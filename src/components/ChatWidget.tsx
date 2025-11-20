import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ensureChatForUser, addUserMessage, subscribeMessages, markUserOpened, updateChatIdentity } from '../lib/chat';

type ChatMessage = { id: string; who: 'user' | 'agent'; text: string; at: number };

export type ChatWidgetProps = {
  phoneNumber: string; // e.g., '+351 912 345 678'
  whatsappNumber?: string; // e.g., '+351912345678' or '351912345678'
  defaultOpen?: boolean;
};

export default function ChatWidget({ phoneNumber, whatsappNumber, defaultOpen = false }: ChatWidgetProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';
  const [open, setOpen] = useState(defaultOpen);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<null | { type: 'ok' | 'err'; text: string }>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<null | (() => void)>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const persistTimer = useRef<any>(null);

  // Ouvir pedido global para abrir o chat (após login)
  React.useEffect(() => {
    function onChatOpen() {
      setOpen(true);
    }
    window.addEventListener('chat:open', onChatOpen);
    return () => window.removeEventListener('chat:open', onChatOpen);
  }, []);

  const telHref = useMemo(() => `tel:${phoneNumber.replace(/[^+\d]/g, '')}`, [phoneNumber]);
  const whatsHref = useMemo(() => {
    if (!whatsappNumber) return '';
    const onlyDigits = whatsappNumber.replace(/\D/g, '');
    const text = encodeURIComponent(
      t('chat.whatsPrefill', { defaultValue: 'Olá! Gostaria de falar com a Ansião Seguros.' }) as string
    );
    return `https://wa.me/${onlyDigits}?text=${text}`;
  }, [whatsappNumber, t]);

  function scrollToBottomSoon() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });
  }

  // Subscribe to Firestore messages when panel is open and user is authenticated
  React.useEffect(() => {
    // cleanup previous subscription
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
    setMessages([]);
    setChatId(null);
    if (!open || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const id = await ensureChatForUser(user.uid);
        if (cancelled) return;
        setChatId(id);
        // Reset unread for the user when opening their chat
        try { await markUserOpened(id); } catch {}
        unsubRef.current = subscribeMessages(id, (list) => {
          setMessages(
            list.map((m) => ({
              id: m.id,
              who: m.authorRole === 'user' ? 'user' : 'agent',
              text: m.text,
              at: m.createdAt ? m.createdAt.getTime() : Date.now(),
            }))
          );
          scrollToBottomSoon();
        });
      } catch (e) {
        console.error('[ChatWidget] subscribe error', e);
      }
    })();
    return () => {
      cancelled = true;
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [open, user]);

  // Persist identity fields (name/email/phone) to chat doc with debounce
  React.useEffect(() => {
    if (!user || !chatId) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      const payload: { name?: string | null; email?: string | null; phone?: string | null } = {};
      if (name) payload.name = name;
      if (email) payload.email = email;
      if (phone) payload.phone = phone;
      if (Object.keys(payload).length > 0) {
        updateChatIdentity(chatId, payload).catch(() => {});
      }
    }, 600);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [name, email, phone, chatId, user]);

  async function handleSend() {
    if (!input.trim()) return;
    if (!user) {
      try { localStorage.setItem('chat:intentOpen', '1'); } catch {}
      window.dispatchEvent(new CustomEvent('auth:open'));
      return;
    }
    try {
      setSending(true);
      const id = chatId ?? (await ensureChatForUser(user.uid));
      if (!chatId) setChatId(id);
      await addUserMessage(id, user.uid, input.trim());
      setInput('');
      // feedback optional for realtime chat; show success briefly
      setFeedback({ type: 'ok', text: t('chat.sent') });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      console.error('[ChatWidget] send error', e);
      setFeedback({ type: 'err', text: t('chat.error') });
      setTimeout(() => setFeedback(null), 6000);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-40">
      {/* Floating Button */}
      {!open && (
        <div className="flex flex-col items-end gap-2">
          {whatsappNumber && (
            <a
              href={whatsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1fb256] transition"
              aria-label={t('chat.whatsappNow')}
            >
              <WhatsAppIcon className="w-5 h-5 text-white" />
              <span className="font-semibold text-sm">{t('chat.whatsappNow')}</span>
            </a>
          )}
          <a
            href={telHref}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition md:hidden"
            aria-label={t('chat.callNow')}
          >
            <PhoneIcon className="w-5 h-5 text-white" />
            <span className="font-semibold text-sm">{t('chat.callNow')}</span>
          </a>
          <button
            type="button"
            onClick={() => {
              if (!user) {
                try {
                  // Guarda intenção de abrir chat após login
                  localStorage.setItem('chat:intentOpen', '1');
                } catch {}
                // Abre o mesmo modal de autenticação usado no botão Entrar
                window.dispatchEvent(new CustomEvent('auth:open'));
                return;
              }
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition"
            aria-expanded={open}
            aria-controls="chat-panel"
          >
            <ChatIcon className="w-5 h-5 text-white" />
            <span className="font-semibold text-sm">{t('chat.talkNow')}</span>
          </button>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div
          id="chat-panel"
          className="w-80 sm:w-96 h-[28rem] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          role="dialog"
          aria-label={t('chat.title')}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <span>🤖</span>
              <div>
                <div className="text-sm font-bold leading-tight">{t('chat.title')}</div>
                <div className="text-[11px] opacity-90">{t('chat.subtitle')}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 rounded hover:bg-blue-500"
                onClick={() => setOpen(false)}
                aria-label={t('chat.close')}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Identity */}
          <div className="px-3 pt-3 pb-2 border-b border-gray-100 grid grid-cols-1 gap-2">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={t('chat.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={t('chat.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-36 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={t('chat.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d+ ]/g, ''))}
              />
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-auto p-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-sm text-gray-500 text-center mt-8">
                {t('chat.empty')}
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[85%] p-2 rounded-xl text-sm shadow ${m.who === 'user' ? 'ml-auto bg-cyan-50 border border-cyan-100' : 'bg-white border border-gray-200'}`}>
                    <div className="text-[10px] text-gray-500 mb-0.5">{m.who === 'user' ? t('chat.you') : t('chat.agent')}</div>
                    <div className="whitespace-pre-wrap text-gray-800">{m.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="p-3 border-t border-gray-200 bg-white">
            {feedback && (
              <div className={`mb-2 text-xs ${feedback.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{feedback.text}</div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                className="flex-1 resize-none px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={t('chat.messagePlaceholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (!sending) handleSend();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || sending || !user}
                className={`px-4 py-2 rounded-lg text-white font-semibold shadow ${
                  !input.trim() || sending || !user ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {sending ? t('chat.sending') : t('chat.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  // WhatsApp logo (simplified) using currentColor for fill
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19.11 17.23c-.27-.14-1.6-.79-1.84-.88-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.46-.84-2-.22-.53-.44-.46-.61-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.25.27-.96.93-.96 2.26 0 1.33.98 2.62 1.12 2.8.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.57.65.21 1.25.18 1.72.11.53-.08 1.6-.65 1.83-1.27.23-.62.23-1.14.16-1.25-.07-.11-.25-.18-.52-.32z"/>
      <path d="M26.75 5.25A13.93 13.93 0 0 0 16 1a14 14 0 0 0-12.2 20.9L1 31l9.3-2.76A14 14 0 1 0 26.75 5.25zM16 27a11 11 0 0 1-5.6-1.5l-.4-.23-5.4 1.6 1.6-5.3-.26-.43A11 11 0 1 1 27 16 11 11 0 0 1 16 27z"/>
    </svg>
  );
}

function PhoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.2 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.32 1.76.59 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.11a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.6.59A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function ChatIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 9h8v2H6V9zm0-3h12v2H6V6z"/>
    </svg>
  );
}
