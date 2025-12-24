import * as admin from 'firebase-admin';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';

// Initialize Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp();
}

// Helper to read env vars with fallback.
function envAny(names: string[], fallback = ''): string {
  for (const n of names) {
    const v = process.env[n];
    if (v) return v;
  }
  return fallback;
}

// EmailJS configuration via environment variables
// Set using CI secrets or Firebase runtime variables:
//   EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, ADMIN_TO, SITE_BASE_URL
const emailjsCfg = {
  serviceId: envAny(['EMAILJS_SERVICE_ID'], 'service_4ltybjl'),
  templateId: envAny(['EMAILJS_TEMPLATE_ID'], 'template_k0tx9hp'),
  publicKey: envAny(['EMAILJS_PUBLIC_KEY', 'EMAILJS_USER_ID'], ''),
  adminTo: envAny(['ADMIN_TO'], ''),
  siteBase: envAny(['SITE_BASE_URL'], 'https://ansiao.pt'),
};

// Toggle via EMAIL_NOTIFICATIONS_ENABLED (preferred) or legacy MAIL_NOTIFICATIONS_ENABLED
const notificationsEnabled = (
  envAny(['EMAIL_NOTIFICATIONS_ENABLED', 'MAIL_NOTIFICATIONS_ENABLED'], 'false')
) === 'true';

function htmlEscape(s: string) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// Firestore trigger disabled: client-side handles notifications now.
// Intentionally not exported to avoid deployment.
const notifyOnFirstUserMessage = onDocumentCreated('chats/{chatId}/messages/{messageId}', async (event) => {
  const snap = event.data;
  if (!snap) return;
  const data = snap.data() as any;
  const chatId = event.params.chatId as string;

  if (!data || data.authorRole !== 'user') return;

  const db = admin.firestore();
  const chatRef = db.doc(`chats/${chatId}`);
  const chatSnap = await chatRef.get();
  if (!chatSnap.exists) return;

  const chat = chatSnap.data() || {};
  if (chat.firstNotified) return; // Already notified

  const name = chat.name || '(anónimo)';
  const email = chat.email || '(sem email)';
  const phone = chat.phone || '(sem telefone)';
  const text = String(data.text || '');

  const subject = `Novo chat iniciado — ${name}`;
  const inboxUrl = `${emailjsCfg.siteBase}/pt/admin/inbox`;

  // Send via EmailJS REST API
  if (!notificationsEnabled || !emailjsCfg.adminTo || !emailjsCfg.serviceId || !emailjsCfg.templateId || !emailjsCfg.publicKey) {
    logger.info('[notifyOnFirstUserMessage] EmailJS disabled or missing configuration; skipping send.', { enabled: notificationsEnabled });
  } else {
    try {
      const body = {
        service_id: emailjsCfg.serviceId,
        template_id: emailjsCfg.templateId,
        user_id: emailjsCfg.publicKey,
        template_params: {
          // Template expects {{name}} for subject and body, and {{message}} for content
          to_email: emailjsCfg.adminTo,
          name,
          message: `Primeira mensagem: ${text}\n\nAbrir inbox: ${inboxUrl}`,
        },
      } as const;
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`EmailJS send failed: ${res.status} ${res.statusText} ${txt}`);
      }
      logger.info('[notifyOnFirstUserMessage] EmailJS send OK');
    } catch (e) {
      logger.error('[notifyOnFirstUserMessage] EmailJS send error', e);
    }
  }

  await chatRef.update({ firstNotified: true });
});

// HTTPS proxy to send EmailJS from server side to avoid client-side 412 errors (domain restrictions).
// Expects JSON body: { service_id, template_id, user_id, template_params }
export const sendContactEmail = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { service_id, template_id, user_id, template_params } = req.body ?? {};
    if (!service_id || !template_id || !user_id || !template_params || typeof template_params !== 'object') {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const body = {
      service_id,
      template_id,
      user_id,
      template_params,
    } as const;

    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const txt = await r.text().catch(() => '');
    if (!r.ok) {
      logger.error('[sendContactEmail] EmailJS error', { status: r.status, statusText: r.statusText, body: txt });
      res.status(r.status).send(txt || r.statusText);
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e: any) {
    logger.error('[sendContactEmail] Unexpected error', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
