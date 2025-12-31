import React, { useEffect, useMemo, useState } from 'react';
import { collectionGroup, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import Seo from '../../components/Seo';

type SimRow = {
  id: string;
  ownerUid: string;
  type?: string;
  title?: string;
  createdAt?: any;
  pdfUrl?: string;
};

export default function AdminSimulations(): React.ReactElement {
  const [items, setItems] = useState<SimRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const baseRef = useMemo(() => collectionGroup(db, 'simulations'), []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNote(null);
    const q = query(baseRef as any, orderBy('createdAt', 'desc'), limit(200));
    const unsub = onSnapshot(q, {
      next: (snap) => {
        const rows = snap.docs.map((d) => {
          const data = d.data() as any;
          let ownerUid = '';
          try {
            const segments = d.ref.path.split('/');
            const i = segments.indexOf('users');
            if (i >= 0 && segments[i + 1]) ownerUid = segments[i + 1];
          } catch {}
          return { id: d.id, ownerUid, type: data?.type, title: data?.title, createdAt: data?.createdAt, pdfUrl: data?.pdfUrl } as SimRow;
        });
        setItems(rows);
        setLoading(false);
      },
      error: (e: any) => {
        console.error('[AdminSimulations] snapshot error:', e);
        setError('Falha ao carregar simulações (permissões ou rede).');
        (async () => {
          try {
            setNote('Modo fallback ativado (pedido único).');
            const one = await getDocs(q);
            const rows = one.docs.map((d) => {
              const data = d.data() as any;
              let ownerUid = '';
              try {
                const segments = d.ref.path.split('/');
                const i = segments.indexOf('users');
                if (i >= 0 && segments[i + 1]) ownerUid = segments[i + 1];
              } catch {}
              return { id: d.id, ownerUid, type: data?.type, title: data?.title, createdAt: data?.createdAt, pdfUrl: data?.pdfUrl } as SimRow;
            });
            setItems(rows);
          } catch (fallbackErr) {
            console.error('[AdminSimulations] fallback getDocs failed:', fallbackErr);
          } finally {
            setLoading(false);
          }
        })().catch(() => {});
      },
    });
    return () => unsub();
  }, [baseRef]);

  return (
    <main className="container mx-auto px-4 py-8">
      <Seo title={'Todas as simulações (Admin)'} description={'Lista global de simulações'} canonicalPath={(typeof window !== 'undefined' ? window.location.pathname : '/pt/admin/simulacoes')} noIndex />
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">Admin: Todas as simulações</h1>
      {loading && <div className="p-4 border border-blue-100 rounded bg-white shadow-sm">A carregar…</div>}
      {error && <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded">{error}</div>}
      {!error && note && <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-900 rounded">{note}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-2">UID</th>
              <th className="py-2 px-2">ID</th>
              <th className="py-2 px-2">Tipo</th>
              <th className="py-2 px-2">Título</th>
              <th className="py-2 px-2">Data</th>
              <th className="py-2 px-2">PDF</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => {
              const dateStr = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : '';
              return (
                <tr key={`${r.ownerUid}_${r.id}`} className="border-b">
                  <td className="py-2 px-2 text-blue-800">{r.ownerUid}</td>
                  <td className="py-2 px-2 text-blue-800">{r.id}</td>
                  <td className="py-2 px-2">{r.type || '-'}</td>
                  <td className="py-2 px-2">{r.title || '-'}</td>
                  <td className="py-2 px-2 text-blue-700">{dateStr}</td>
                  <td className="py-2 px-2">
                    {r.pdfUrl ? (
                      <a className="text-blue-700 underline" href={r.pdfUrl} target="_blank" rel="noopener noreferrer">Abrir</a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
