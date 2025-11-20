import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subscribeMessages, addAdminMessage, markAdminOpened, getChat } from '../../lib/chat';
import { useAuth } from '../../context/AuthContext';

export default function ChatThread() {
  const { t } = useTranslation('common');
  const { lang, chatId } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<Array<{ id: string; text: string; authorRole: string; createdAt: Date | null }>>([]);
  const [input, setInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [identity, setIdentity] = React.useState<{ name?: string | null; email?: string | null; phone?: string | null } | null>(null);

  React.useEffect(() => {
    if (!chatId) return;
    const unsub = subscribeMessages(chatId, (rows) => setMessages(rows));
    // mark as read for admin when opening
    markAdminOpened(chatId).catch(() => {});
    getChat(chatId).then((doc) => {
      if (doc) setIdentity({ name: doc.name ?? null, email: doc.email ?? null, phone: doc.phone ?? null });
    }).catch(() => {});
    return () => unsub();
  }, [chatId]);

  async function onSend() {
    if (!chatId || !input.trim() || !user) return;
    try {
      setSending(true);
      await addAdminMessage(chatId, user.uid, input.trim());
      setInput('');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Chat</h1>
        <Link to={`/${base}/admin/inbox`} className="text-blue-600 underline">Voltar</Link>
      </div>
      <div className="border rounded-lg h-[60vh] flex flex-col">
        {identity && (
          <div className="px-3 py-2 border-b bg-white text-sm">
            <div className="font-semibold">{identity.name || 'Utilizador'}</div>
            <div className="text-gray-600">{[identity.email, identity.phone].filter(Boolean).join(' · ')}</div>
          </div>
        )}
        <div className="flex-1 overflow-auto p-3 bg-gray-50 space-y-2">
          {messages.length === 0 ? (
            <div className="text-gray-500">{t('chat.empty')}</div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`max-w-[80%] p-2 rounded-xl text-sm shadow ${m.authorRole === 'user' ? 'bg-white border border-gray-200' : 'ml-auto bg-blue-50 border border-blue-100'}`}>
                <div className="text-[10px] text-gray-500 mb-0.5">{m.authorRole}</div>
                <div className="whitespace-pre-wrap text-gray-800">{m.text}</div>
                {m.createdAt && <div className="text-[10px] text-gray-400 mt-0.5">{m.createdAt.toLocaleString()}</div>}
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t bg-white flex items-end gap-2">
          <textarea
            rows={2}
            className="flex-1 resize-none px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={t('chat.messagePlaceholder') as string}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!sending) onSend();
              }
            }}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!input.trim() || sending || !user}
            className={`px-4 py-2 rounded-lg text-white font-semibold shadow ${!input.trim() || sending || !user ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {sending ? t('chat.sending') : t('chat.send')}
          </button>
        </div>
      </div>
    </div>
  );
}
