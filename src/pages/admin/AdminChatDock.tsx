import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, query, where, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { subscribeMessages, setAdminTyping, addAdminMessage } from '../../lib/chat';

type Thread = {
  chatId: string;
  userId: string;
  lastMessageAt?: Date | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export default function AdminChatDock() {
  const { t } = useTranslation('common');
  const { isAdmin, user } = useAuth();
  const [threads, setThreads] = React.useState<Thread[]>([]);
  const [openIds, setOpenIds] = React.useState<string[]>([]);
  const [messagesById, setMessagesById] = React.useState<Record<string, Array<{ id: string; text: string; authorRole: string; createdAt: Date | null }>>>({});
  const [sendingId, setSendingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isAdmin) return;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const col = collection(db, 'chats');
    const q = query(col, where('lastMessageAt', '>=', since), orderBy('lastMessageAt', 'desc'));
    const unsub = onSnapshot(q, async (snap) => {
      const baseRows: Thread[] = snap.docs.map((d) => {
        const data: any = d.data();
        const ts: any = data.lastMessageAt;
        return {
          chatId: d.id,
          userId: String(data.userId || d.id),
          lastMessageAt: ts?.toDate ? ts.toDate() : null,
          name: data.name ?? null,
          email: data.email ?? null,
          phone: data.phone ?? null,
        };
      });
      // Enrichment: fetch users/{uid} for missing names
      const enriched = await Promise.all(baseRows.map(async (row) => {
        if (!row.name) {
          try {
            const uref = doc(db, 'users', row.userId);
            const usnap = await getDoc(uref);
            if (usnap.exists()) {
              const ud: any = usnap.data();
              const name = ud.displayName || ud.name || null;
              const email = ud.email || null;
              const phone = ud.phone || ud.phoneNumber || null;
              if (name || email || phone) {
                const updated: Thread = { ...row, name: name ?? row.name ?? null, email: email ?? row.email ?? null, phone: phone ?? row.phone ?? null };
                // Persist back into chat doc to avoid future lookups
                try {
                  const cref = doc(db, 'chats', row.chatId);
                  const patch: any = {};
                  if (name && row.name !== name) patch.name = name;
                  if (email && row.email !== email) patch.email = email;
                  if (phone && row.phone !== phone) patch.phone = phone;
                  if (Object.keys(patch).length) await updateDoc(cref, patch);
                } catch {}
                return updated;
              }
            }
          } catch {}
        }
        return row;
      }));
      setThreads(enriched);
    });
    return () => unsub();
  }, [isAdmin]);

  React.useEffect(() => {
    // Attach message listeners for opened threads
    const unsubs: Array<() => void> = [];
    openIds.forEach((chatId) => {
      const unsub = subscribeMessages(chatId, (msgs) => {
        setMessagesById((prev) => ({ ...prev, [chatId]: msgs }));
      });
      unsubs.push(unsub);
    });
    return () => { unsubs.forEach((u) => { try { u(); } catch {} }); };
  }, [openIds]);

  function toggleThread(chatId: string) {
    setOpenIds((prev) => (prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]));
  }

  async function send(chatId: string, text: string) {
    if (!user || !text.trim()) return;
    try {
      setSendingId(chatId);
      await addAdminMessage(chatId, user.uid, text.trim());
    } finally {
      setSendingId(null);
      setAdminTyping(chatId, false).catch(() => {});
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 max-h-[80vh] overflow-auto">
      {!isAdmin && (
        <div className="px-3 py-2 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs">
          Apenas administradores podem ver a dock de conversas.
        </div>
      )}
      {isAdmin && threads.map((th) => (
        <div key={th.chatId} className="w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="px-3 py-2 bg-blue-600 text-white flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{th.name || th.userId}</div>
              <div className="text-[11px] opacity-90 truncate">{[th.email, th.phone].filter(Boolean).join(' · ') || '—'}</div>
            </div>
            <button
              type="button"
              className="px-2 py-1 text-[11px] rounded bg-white text-blue-700 hover:bg-blue-100"
              onClick={() => toggleThread(th.chatId)}
            >{openIds.includes(th.chatId) ? 'Fechar' : 'Abrir'}</button>
          </div>
          {openIds.includes(th.chatId) && (
            <div className="p-2 flex flex-col gap-2">
              <div className="h-48 overflow-auto space-y-2 bg-gray-50 p-2 rounded">
                {(messagesById[th.chatId] || []).map((m) => (
                  <div key={m.id} className={`max-w-[80%] p-2 rounded-xl text-sm shadow ${m.authorRole === 'user' ? 'bg-white border border-gray-200' : 'ml-auto bg-blue-50 border border-blue-100'}`}>
                    <div className="text-[10px] text-gray-500 mb-0.5">{m.authorRole}</div>
                    <div className="whitespace-pre-wrap text-gray-800">{m.text}</div>
                    {m.createdAt && <div className="text-[10px] text-gray-400 mt-0.5">{m.createdAt.toLocaleString()}</div>}
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); const ta = (e.currentTarget.elements.namedItem('msg') as HTMLTextAreaElement); const v = ta.value; ta.value=''; send(th.chatId, v); }}
                className="flex items-end gap-2"
              >
                <textarea name="msg" rows={2} className="flex-1 resize-none px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button
                  type="submit"
                  disabled={sendingId === th.chatId}
                  className={`px-3 py-2 rounded-lg text-white font-semibold shadow ${sendingId === th.chatId ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
                >{sendingId === th.chatId ? t('chat.sending') : t('chat.send')}</button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
