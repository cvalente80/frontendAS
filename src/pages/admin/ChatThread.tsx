import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subscribeMessages, addAdminMessage, markAdminOpened, getChat, subscribeChatDoc, setAdminTyping } from '../../lib/chat';
import { useAuth } from '../../context/AuthContext';

export default function ChatThread() {
  const { t } = useTranslation('common');
  const { lang, chatId } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';
  const { user, isAdmin, refreshAdminStatus } = useAuth();
  const [messages, setMessages] = React.useState<Array<{ id: string; text: string; authorRole: string; createdAt: Date | null }>>([]);
  const [input, setInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [identity, setIdentity] = React.useState<{ name?: string | null; email?: string | null; phone?: string | null } | null>(null);
  const [error, setError] = React.useState<null | { code?: string; message: string }>(null);
  const [typingUser, setTypingUser] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const prevCountRef = React.useRef(0);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const metaUnsubRef = React.useRef<null | (() => void)>(null);
  const stopTypingTimerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!chatId) return;
    if (metaUnsubRef.current) { metaUnsubRef.current(); metaUnsubRef.current = null; }
    const unsub = subscribeMessages(
      chatId,
      (rows) => {
        setError(null);
        const isNewUserMsg = rows.length > prevCountRef.current && rows[rows.length - 1].authorRole === 'user';
        prevCountRef.current = rows.length;
        setMessages(rows);
        // Scroll to bottom on update (when opening or new messages)
        try {
          const el = listRef.current;
          if (el) {
            el.scrollTo({ top: el.scrollHeight });
          }
        } catch {}
        if (soundEnabled && isNewUserMsg) {
          try {
            const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
            const ctx = new Ctx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = 660;
            osc.connect(gain); gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
            osc.start(); osc.stop(ctx.currentTime + 0.26);
          } catch {}
        }
      },
      (err) => setError({ code: err?.code, message: String(err?.message || err) })
    );
    markAdminOpened(chatId).catch(() => {});
    getChat(chatId).then((doc) => {
      if (doc) setIdentity({ name: doc.name ?? null, email: doc.email ?? null, phone: doc.phone ?? null });
    }).catch(() => {});
    metaUnsubRef.current = subscribeChatDoc(chatId, (doc) => {
      if (!doc) { setTypingUser(false); return; }
      const ts: any = doc.typingUserAt;
      let recent = false;
      if (ts && ts.toDate) recent = Date.now() - ts.toDate().getTime() < 5000;
      setTypingUser(Boolean(doc.typingUser) && recent);
    });
    return () => { unsub(); if (metaUnsubRef.current) { metaUnsubRef.current(); metaUnsubRef.current = null; } };
  }, [chatId, soundEnabled]);

  async function onSend() {
    if (!chatId || !input.trim() || !user) return;
    try {
      setSending(true);
      await addAdminMessage(chatId, user.uid, input.trim());
      setInput('');
    } finally {
      setSending(false);
      if (chatId) setAdminTyping(chatId, false).catch(() => {});
    }
  }

  function signalTyping() {
    if (!chatId || !user) return;
    if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    setAdminTyping(chatId, true).catch(() => {});
    stopTypingTimerRef.current = setTimeout(() => {
      setAdminTyping(chatId, false).catch(() => {});
    }, 3500);
  }

  function exportConversation() {
    const lines = messages.map(m => `[${m.createdAt ? m.createdAt.toISOString() : 'sem-data'}] ${m.authorRole}: ${m.text}`);
    const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `chat-${chatId}.txt`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Chat</h1>
        <Link to={`/${base}/admin/inbox`} className="text-blue-600 underline">Voltar</Link>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
        <span className={`px-2 py-1 rounded ${isAdmin ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>Admin: {isAdmin ? 'sim' : 'não'}</span>
        {user && <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">UID: {user.uid.slice(0,8)}…</span>}
        <button
          type="button"
          onClick={() => refreshAdminStatus().catch(() => {})}
          className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
        >Rever permissões</button>
        <button
          type="button"
          onClick={() => setSoundEnabled(v => !v)}
          className={`px-2 py-1 rounded ${soundEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'} border border-gray-300`}
        >{soundEnabled ? '🔔 Som' : '🔕 Mudo'}</button>
        <button
          type="button"
          onClick={exportConversation}
          className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-300"
        >Exportar TXT</button>
      </div>
      {!isAdmin && (
        <div className="mb-3 p-3 rounded border border-yellow-200 bg-yellow-50 text-sm text-yellow-800">
          <div className="font-semibold mb-1">Perfil sem permissões de administrador.</div>
          <div>
            Crie <code>admins/&lt;seu-uid&gt;</code> ou defina <code>users/&lt;seu-uid&gt;.isAdmin = true</code> no Firestore para ler e responder a todos os chats.
          </div>
        </div>
      )}
      <div className="border rounded-lg h-[60vh] flex flex-col">
        {error && (
          <div className="px-3 py-2 border-b bg-red-50 text-red-700 text-sm">
            {error.code === 'permission-denied' ? (
              <span>Sem permissões para ver esta conversa. Necessita de perfil administrador.</span>
            ) : (
              <span>Erro: {error.message}</span>
            )}
          </div>
        )}
        {identity && (
          <div className="px-3 py-2 border-b bg-white text-sm">
            <div className="font-semibold">{identity.name || 'Utilizador'}</div>
            <div className="text-gray-600">{[identity.email, identity.phone].filter(Boolean).join(' · ')}</div>
          </div>
        )}
        <div ref={listRef} className="flex-1 overflow-auto p-3 bg-gray-50 space-y-2">
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
          {typingUser && (
            <div className="max-w-[60%] p-2 rounded-xl text-xs bg-white border border-gray-200 italic text-gray-500">
              Utilizador a escrever...
            </div>
          )}
        </div>
        <div className="p-3 border-t bg-white flex items-end gap-2">
          <textarea
            rows={2}
            className="flex-1 resize-none px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={t('chat.messagePlaceholder') as string}
            value={input}
            onChange={(e) => { setInput(e.target.value); signalTyping(); }}
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
