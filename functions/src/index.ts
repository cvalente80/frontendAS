import * as admin from 'firebase-admin';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import nodemailer from 'nodemailer';

// Initialize Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp();
}

// Helper to read env vars with fallback.
function env(name: string, fallback = ''): string {
  return process.env[name] || fallback;
}

// SMTP / notification configuration ONLY from environment variables now.
// Set using your deployment pipeline or Firebase console (Runtime environment variables / secrets). Example:
//   firebase functions:config:unset mail  (if migrating away from config())
//   export MAIL_HOST=smtp.example.com MAIL_PORT=587 MAIL_USER=xxx MAIL_PASS=yyy MAIL_FROM="Ansião Seguros <no-reply@ansiao.pt>" ADMIN_TO=admin@example.com SITE_BASE_URL=https://ansiao.pt
// For sensitive values (MAIL_PASS), prefer functions secrets or CI secret injection.
const mailConfig = {
  host: env('MAIL_HOST'),
  port: Number(env('MAIL_PORT', '587')),
  secure: env('MAIL_SECURE') === 'true',
  auth: {
    user: env('MAIL_USER'),
    pass: env('MAIL_PASS'),
  },
  from: env('MAIL_FROM', 'Ansião Seguros <no-reply@example.com>'),
  adminTo: env('ADMIN_TO'),
  siteBase: env('SITE_BASE_URL', 'https://ansiao.pt'),
};

// Email notifications toggle (disabled by default). Enable by setting MAIL_NOTIFICATIONS_ENABLED=true.
const notificationsEnabled = (process.env.MAIL_NOTIFICATIONS_ENABLED || 'false') === 'true';

const transporter = notificationsEnabled
  ? nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: mailConfig.auth.user ? mailConfig.auth : undefined,
    })
  : null as any;

function htmlEscape(s: string) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// Firestore trigger using v2 API
export const notifyOnFirstUserMessage = onDocumentCreated('chats/{chatId}/messages/{messageId}', async (event) => {
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
  const inboxUrl = `${mailConfig.siteBase}/pt/admin/inbox`;
  const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111">
        <h2 style="margin:0 0 12px 0;color:#0a4">Novo contacto no chat</h2>
        <p><strong>Utilizador:</strong> ${htmlEscape(name)}</p>
        <p><strong>Email:</strong> ${htmlEscape(email)}</p>
        <p><strong>Telefone:</strong> ${htmlEscape(phone)}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0"/>
        <p><strong>Primeira mensagem:</strong></p>
        <div style="white-space:pre-wrap;border:1px solid #e5e7eb;padding:8px;border-radius:8px;background:#fafafa">${htmlEscape(text)}</div>
        <p style="margin-top:12px">Abrir inbox: <a href="${inboxUrl}">${inboxUrl}</a></p>
      </div>
    `;

  // Skip sending emails when notifications are disabled (default) or SMTP config is missing
  if (!notificationsEnabled || !mailConfig.adminTo || !mailConfig.host) {
    logger.info('[notifyOnFirstUserMessage] Email notifications disabled or not configured; skipping send.');
  } else {
    try {
      await transporter.sendMail({ from: mailConfig.from, to: mailConfig.adminTo, subject, html });
    } catch (e) {
      logger.error('[notifyOnFirstUserMessage] sendMail error', e);
    }
  }

  await chatRef.update({ firstNotified: true });
});
