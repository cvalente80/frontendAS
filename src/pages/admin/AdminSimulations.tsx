import React, { useEffect, useMemo, useState } from 'react';
import { collectionGroup, getDocs, limit, onSnapshot, orderBy, query, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../firebase';
import Seo from '../../components/Seo';

type SimRow = {
  id: string;
  ownerUid: string;
  type?: string;
  title?: string;
  createdAt?: any;
  pdfUrl?: string;
  status?: string;
};

export default function AdminSimulations(): React.ReactElement {
  const [items, setItems] = useState<SimRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('dateDesc');

  const baseRef = useMemo(() => collectionGroup(db, 'simulations'), []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNote(null);
    const pageSize = 50;
    const q = query(baseRef as any, orderBy('createdAt', 'desc'), limit(pageSize));
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
          return { id: d.id, ownerUid, type: data?.type, title: data?.title, createdAt: data?.createdAt, pdfUrl: data?.pdfUrl, status: data?.status } as SimRow;
        });
        setItems(rows);
        const last = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
        setLastDoc(last);
        setHasMore(snap.size === pageSize);
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
              return { id: d.id, ownerUid, type: data?.type, title: data?.title, createdAt: data?.createdAt, pdfUrl: data?.pdfUrl, status: data?.status } as SimRow;
            });
            setItems(rows);
            const last = one.docs.length ? one.docs[one.docs.length - 1] : null;
            setLastDoc(last);
            setHasMore(one.size === pageSize);
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

  async function loadMore() {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    const pageSize = 50;
    try {
      const q = query(baseRef as any, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
      const snap = await getDocs(q);
      const rows = snap.docs.map((d) => {
        const data = d.data() as any;
        let ownerUid = '';
        try {
          const segments = d.ref.path.split('/');
          const i = segments.indexOf('users');
          if (i >= 0 && segments[i + 1]) ownerUid = segments[i + 1];
        } catch {}
        return { id: d.id, ownerUid, type: data?.type, title: data?.title, createdAt: data?.createdAt, pdfUrl: data?.pdfUrl, status: data?.status } as SimRow;
      });
      setItems((prev) => [...prev, ...rows]);
      const last = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
      setLastDoc(last);
      setHasMore(snap.size === pageSize);
    } catch (e) {
      console.error('[AdminSimulations] loadMore failed:', e);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Seo title={'Todas as simulações (Admin)'} description={'Lista global de simulações'} canonicalPath={(typeof window !== 'undefined' ? window.location.pathname : '/pt/admin/simulacoes')} noIndex />
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">Admin: Todas as simulações</h1>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-blue-800">Tipo</label>
          <select className="border border-blue-200 rounded px-2 py-1 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="auto">Auto</option>
            <option value="vida">Vida</option>
            <option value="saude">Saúde</option>
            <option value="habitacao">Habitação</option>
            <option value="rc_prof">RC Profissional</option>
            <option value="condominio">Condomínio</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-blue-800">Estado</label>
          <select className="border border-blue-200 rounded px-2 py-1 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="em_processamento">Em processamento (sem PDF)</option>
            <option value="simulacao_enviada">Simulação enviada (com PDF)</option>
            <option value="submitted">submitted (doc)</option>
            <option value="quoted">quoted (doc)</option>
            <option value="archived">archived (doc)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-blue-800">Ordenar</label>
          <select className="border border-blue-200 rounded px-2 py-1 text-sm" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="dateDesc">Data ↓</option>
            <option value="dateAsc">Data ↑</option>
            <option value="typeAsc">Tipo A-Z</option>
            <option value="pdfFirst">PDF primeiro</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-blue-800">Pesquisar</label>
          <input
            type="text"
            className="border border-blue-200 rounded px-2 py-1 text-sm"
            placeholder="UID, ID, título, tipo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-blue-700">Total: {items.length}</div>
      </div>
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
              <th className="py-2 px-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter((r) => {
                const typeOk = typeFilter === 'all' || (r.type || '') === typeFilter;
                const hasPdf = Boolean(r.pdfUrl);
                const computedStatus = hasPdf ? 'simulacao_enviada' : 'em_processamento';
                const docStatus = r.status || undefined;
                const statusOk =
                  statusFilter === 'all' ||
                  statusFilter === computedStatus ||
                  statusFilter === docStatus;
                const q = search.trim().toLowerCase();
                const searchOk = !q || [r.ownerUid, r.id, r.title || '', r.type || ''].some((v) => (v || '').toLowerCase().includes(q));
                return typeOk && statusOk && searchOk;
              })
              .sort((a, b) => {
                const aPdf = Boolean(a.pdfUrl);
                const bPdf = Boolean(b.pdfUrl);
                const aDate = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const bDate = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                if (sortKey === 'dateAsc') return aDate - bDate;
                if (sortKey === 'typeAsc') return (a.type || '').localeCompare(b.type || '');
                if (sortKey === 'pdfFirst') return (bPdf ? 1 : 0) - (aPdf ? 1 : 0);
                // default: dateDesc
                return bDate - aDate;
              })
              .map((r) => {
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
                  <td className="py-2 px-2">
                    {(() => {
                      const hasPdf = Boolean(r.pdfUrl);
                      const computedStatus = hasPdf ? 'simulacao_enviada' : 'em_processamento';
                      const docStatus = r.status || undefined;
                      return docStatus ? `${computedStatus} / ${docStatus}` : computedStatus;
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={loadMore}
          disabled={!hasMore || loadingMore}
          className={`px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 ${(!hasMore || loadingMore) ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loadingMore ? 'A carregar…' : (hasMore ? 'Carregar mais' : 'Sem mais resultados')}
        </button>
      </div>
    </main>
  );
}
