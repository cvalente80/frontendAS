import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { subscribeChats } from '../../lib/chat';

export default function ChatInbox() {
  const { t } = useTranslation('common');
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';
  const [rows, setRows] = React.useState<Array<{ id: string; last: string; unread?: number; when?: Date | null; userId: string; name?: string | null; email?: string | null; phone?: string | null }>>([]);

  React.useEffect(() => {
    const unsub = subscribeChats((items) => {
      setRows(items.map(({ id, data }) => ({
        id,
        last: data.lastMessagePreview || '',
        unread: data.unreadForAdmin || 0,
        when: (data as any).lastMessageAt?.toDate ? (data as any).lastMessageAt.toDate() : null,
        userId: data.userId,
        name: (data as any).name ?? null,
        email: (data as any).email ?? null,
        phone: (data as any).phone ?? null,
      })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      {rows.length === 0 ? (
        <div className="text-gray-500">{t('chat.empty')}</div>
      ) : (
        <ul className="divide-y divide-gray-200 border rounded-lg">
          {rows.map((r) => (
            <li key={r.id} className="p-3 hover:bg-gray-50 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{r.name || r.userId}</div>
                <div className="text-xs text-gray-500 truncate">{[r.email, r.phone].filter(Boolean).join(' · ')}</div>
                <div className="text-sm text-gray-600 truncate">{r.last || '—'}</div>
                {r.when && <div className="text-xs text-gray-400">{r.when.toLocaleString()}</div>}
              </div>
              <div className="flex items-center gap-3">
                {r.unread ? (
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-600 text-white">{r.unread}</span>
                ) : null}
                <Link to={`/${base}/admin/chat/${r.id}`} className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500">Abrir</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
