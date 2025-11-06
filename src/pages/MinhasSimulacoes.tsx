import React, { useEffect, useMemo, useState } from 'react';
import Seo from "../components/Seo";
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, limit, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

type SimulationDoc = {
  id: string;
  type: 'auto' | 'vida' | 'saude' | 'habitacao' | 'rc_prof' | 'condominio' | string;
  createdAt?: Timestamp | null;
  status?: 'draft' | 'submitted' | 'quoted' | 'archived' | string;
  title?: string;
  summary?: string;
  // Dados adicionais guardados pela página de simulação (ex.: auto: matricula, marca, modelo, ...)
  payload?: Record<string, any>;
};

export default function MinhasSimulacoes(): React.ReactElement {
  const { user, displayName } = useAuth();
  const { t } = useTranslation('common');
  const [items, setItems] = useState<SimulationDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const uid = user?.uid;

  const baseRef = useMemo(() => {
    if (!uid) return null;
    return collection(db, 'users', uid, 'simulations');
  }, [uid]);

  useEffect(() => {
    if (!baseRef) return;
    setLoading(true);
    setError(null);
    setNote(null);

    const constraints = [orderBy('createdAt', 'desc'), limit(100)] as const;
    const q = query(baseRef, ...constraints);
    const unsub = onSnapshot(q, {
      next: (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as SimulationDoc[];
        const filtered = filter === 'all' ? docs : docs.filter((d) => d.type === filter);
        setItems(filtered);
        setLoading(false);
      },
      error: (e: any) => {
        console.error('[MinhasSimulacoes] Firestore snapshot error:', e);
        const code = e?.code || e?.status || 'unknown';
        const msg = e?.message || '';
        // Graceful fallback: try a one-time fetch so the user still sees content
        (async () => {
          try {
            setNote(
              'Sem atualização em tempo real (listen falhou). A mostrar resultados atuais apenas uma vez.'
            );
            const oneTime = await getDocs(q);
            const docs = oneTime.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as SimulationDoc[];
            const filtered = filter === 'all' ? docs : docs.filter((d) => d.type === filter);
            setItems(filtered);
          } catch (fallbackErr: any) {
            console.error('[MinhasSimulacoes] Fallback getDocs failed:', fallbackErr);
            const code2 = fallbackErr?.code || fallbackErr?.status || 'unknown';
            setError(`Falha ao carregar simulações (${code2}).`);
          } finally {
            setLoading(false);
          }
        })().catch(() => {
          // No-op; errors handled above
        });
      },
    });
    return () => unsub();
  }, [baseRef, filter]);

  return (
    <main className="container mx-auto px-4 py-8">
      <Seo title="As minhas simulações" description="Área do utilizador para consultar as simulações submetidas." canonicalPath={(typeof window !== 'undefined' ? window.location.pathname : '/pt/minhas-simulacoes')} noIndex />
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">As minhas simulações</h1>
      <p className="text-blue-800 mb-6">Bem-vindo{displayName ? `, ${displayName}` : ''}. Aqui poderá consultar as simulações submetidas com a sua conta.</p>

      {!user && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded">
          É necessário iniciar sessão para ver as suas simulações.
        </div>
      )}

      {user && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-blue-800">Tipo:</label>
            <select
              className="border border-blue-200 rounded px-2 py-1 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="auto">Auto</option>
              <option value="vida">Vida</option>
              <option value="saude">Saúde</option>
              <option value="habitacao">Habitação</option>
              <option value="rc_prof">RC Profissional</option>
              <option value="condominio">Condomínio</option>
            </select>
          </div>

          {loading && (
            <div className="p-4 border border-blue-100 rounded bg-white shadow-sm">A carregar…</div>
          )}
          {error && (
            <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded">{error}</div>
          )}
          {!error && note && (
            <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-900 rounded">{note}</div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="p-4 border border-blue-100 rounded bg-white shadow-sm text-blue-800">
              Sem simulações para mostrar.
            </div>
          )}

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => {
              const date = (it.createdAt instanceof Timestamp)
                ? it.createdAt.toDate().toLocaleString()
                : '';
              const title = it.title || (it.type ? it.type.toUpperCase() : 'Simulação');
              const plate = (it as any)?.payload?.matricula || (it as any)?.matricula as string | undefined;
              const brand = (it as any)?.payload?.marca || (it as any)?.marca as string | undefined;
              const model = (it as any)?.payload?.modelo || (it as any)?.modelo as string | undefined;
              const year = (it as any)?.payload?.ano || (it as any)?.ano as string | undefined;
              const statusLabel = it.status ? (t(`status.${it.status}` as any) || it.status) : undefined;
              return (
                <li key={it.id} className="p-4 border border-blue-100 rounded bg-white shadow-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                      <span>{title}</span>
                      {plate && (
                        <span className="text-[11px] leading-none px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 font-medium">
                          {plate}
                        </span>
                      )}
                    </h3>
                    {statusLabel && <span className="text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800">{statusLabel}</span>}
                  </div>
                  {date && <p className="text-xs text-blue-700">{date}</p>}
                  {it.summary && <p className="text-sm text-blue-800">{it.summary}</p>}
                  {/* Futuro: Botões para ver detalhe, repetir, etc. */}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
