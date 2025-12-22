import React, { useEffect, useMemo, useState } from 'react';
import Seo from "../components/Seo";
import { useAuth } from '../context/AuthContext';
import { listPolicies, type PolicyRecord } from '../utils/policies';
import { useTranslation } from 'react-i18next';
import PolicyForm from '../components/PolicyForm';
import { db, storage } from '../firebase';
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default function MinhasApolices(): React.ReactElement {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation(['policies', 'common', 'mysims']);
  const [items, setItems] = useState<PolicyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [simDetails, setSimDetails] = useState<Record<string, { marca?: string; matricula?: string }>>({});

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function formatDate(dt: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = pad(dt.getDate());
    const month = pad(dt.getMonth() + 1);
    const year = dt.getFullYear();
    const hours = pad(dt.getHours());
    const minutes = pad(dt.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function policyCreatedAtLabel(it: PolicyRecord): string {
    const anyIt: any = it as any;
    const ts = anyIt?.createdAt as Timestamp | undefined;
    if (ts && typeof ts.toDate === 'function') {
      return formatDate(ts.toDate());
    }
    // Fallback: try to infer from simulationId suffix (ISO date after last colon)
    const raw = String(it.simulationId || '');
    const last = raw.split(':').pop() || '';
    const parsed = new Date(last);
    if (!isNaN(parsed.getTime())) return formatDate(parsed);
    // Last resort: current date
    return formatDate(new Date());
  }
  function typeLabel(type?: string): string {
    if (!type) return '';
    const map: Record<string, string> = {
      auto: t('mysims:filters.types.auto'),
      vida: t('mysims:filters.types.vida'),
      saude: t('mysims:filters.types.saude'),
      habitacao: t('mysims:filters.types.habitacao'),
      rc_prof: t('mysims:filters.types.rc_prof'),
      condominio: t('mysims:filters.types.condominio'),
    };
    return map[type] || String(type).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Normalize legacy statuses to new keys for display/classes
  const normalizeStatus = (s?: string | null): 'em_criacao' | 'em_validacao' | 'em_vigor' | undefined => {
    if (!s) return undefined;
    if (s === 'em_criacao' || s === 'em_validacao' || s === 'em_vigor') return s;
    if (s === 'draft') return 'em_criacao';
    if (s === 'submitted') return 'em_validacao';
    if (s === 'active' || s === 'em_vigor' || s === 'approved') return 'em_vigor';
    return 'em_criacao';
  };

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    listPolicies(user.uid)
      .then((res) => setItems(res))
      .catch((e) => { console.error(e); setError(t('policies:errors.loadFailed')); })
      .finally(() => setLoading(false));
  }, [user?.uid]);

  // Prefetch auto simulation details (brand, plate) for pill labels
  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      const missing = items.filter((it) => it.type === 'auto' && it.simulationId && !simDetails[it.simulationId]);
      for (const it of missing) {
        try {
          const sref = doc(db, 'users', user.uid, 'simulations', it.simulationId);
          const snap = await getDoc(sref);
          const data: any = snap.exists() ? snap.data() : {};
          const payload = data?.payload || {};
          const marca = payload.marca || data.marca || undefined;
          const matricula = payload.matricula || data.matricula || undefined;
          setSimDetails((prev) => ({ ...prev, [it.simulationId]: { marca, matricula } }));
        } catch (e) {
          // ignore fetch errors for labels
        }
      }
    })();
  }, [items, user?.uid]);

  return (
    <main className="container mx-auto px-4 py-8">
      {toast && (
        <div className={`mb-4 rounded px-4 py-2 text-sm font-medium shadow-sm border transition-colors ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>{toast.message}</div>
      )}
      <Seo title={t('policies:seo.title')} description={t('policies:seo.desc')} canonicalPath={(typeof window !== 'undefined' ? window.location.pathname : '/pt/minhas-apolices')} noIndex />
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">{t('policies:heading')}</h1>
      {!user && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded">{t('policies:authRequired')}</div>
      )}
      {user && (
        <section className="space-y-4">
          {loading && <div className="p-4 border border-blue-100 rounded bg-white shadow-sm">{t('policies:loading')}</div>}
          {error && <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="p-4 border border-blue-100 rounded bg-white shadow-sm text-blue-800">{t('policies:empty')}</div>
          )}
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <li key={it.id} className="p-4 border border-blue-100 rounded bg-white shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {it.type && (
                      <span className="shrink-0 text-[11px] leading-none px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 font-medium">
                        {it.type === 'auto'
                          ? `${typeLabel(it.type)}${simDetails[it.simulationId]?.marca ? ' - ' + simDetails[it.simulationId]?.marca : ''}${simDetails[it.simulationId]?.matricula ? ' - ' + simDetails[it.simulationId]?.matricula : ''}`
                          : typeLabel(it.type)}
                      </span>
                    )}
                  </div>
                  {/* Status badge */}
                  {normalizeStatus(it.status) && (
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${normalizeStatus(it.status) === 'em_criacao' ? 'bg-yellow-100 border border-yellow-300 text-yellow-800' : normalizeStatus(it.status) === 'em_validacao' ? 'bg-blue-100 border border-blue-300 text-blue-800' : 'bg-green-100 border border-green-300 text-green-800'}`}>
                      {t(`policies:statuses.${normalizeStatus(it.status)}`)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-700 mt-3 mb-3 text-left">{t('policies:itemSub', { sim: policyCreatedAtLabel(it) })}</p>
                <PolicyForm uid={user.uid} policyId={it.id!} initial={it} />
                {/* Policy PDF actions */}
                <div className="mt-3">
                  {it.policyPdfUrl ? (
                    <div className="flex items-center gap-3">
                      <a href={it.policyPdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-10 h-10" aria-hidden>
                          <rect x="4" y="4" width="40" height="40" rx="6" fill="#10B981" />
                          <text x="50%" y="62%" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontWeight="700" fontSize="14" fill="#FFFFFF">PDF</text>
                        </svg>
                        <span className="text-sm font-medium underline">{t('policies:pdf.viewCta')}</span>
                      </a>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              setDeletingId(it.id!);
                              const pdfRef = storageRef(storage, `policies/${user.uid}/${it.id}/policy.pdf`);
                              try { await deleteObject(pdfRef); } catch {}
                              const ref = doc(db, 'users', user.uid, 'policies', it.id!);
                              await updateDoc(ref, { policyPdfUrl: null });
                              showToast(t('policies:pdf.successDelete'), 'success');
                            } catch (e) {
                              console.error(e);
                              showToast(t('policies:pdf.errorDelete'), 'error');
                            } finally {
                              setDeletingId(null);
                            }
                          }}
                          className={`inline-flex items-center gap-2 text-red-600 hover:text-red-700 ${deletingId === it.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                          disabled={deletingId === it.id}
                        >
                          {t('policies:pdf.delete')}
                        </button>
                      )}
                    </div>
                  ) : (
                    isAdmin && (
                      <div>
                        <label className="text-xs text-blue-800 block mb-1">{t('policies:pdf.uploadLabel')}</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          disabled={uploadingId === it.id}
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f || f.type !== 'application/pdf') return;
                            const MAX_BYTES = 2 * 1024 * 1024;
                            if (f.size > MAX_BYTES) { showToast(t('policies:pdf.tooLarge'), 'error'); e.currentTarget.value = ''; return; }
                            try {
                              setUploadingId(it.id!);
                              const sref = storageRef(storage, `policies/${user.uid}/${it.id}/policy.pdf`);
                              await uploadBytes(sref, f, { contentType: 'application/pdf' });
                              const url = await getDownloadURL(sref);
                              const ref = doc(db, 'users', user.uid, 'policies', it.id!);
                              await updateDoc(ref, { policyPdfUrl: url, status: 'em_vigor' });
                              showToast(t('policies:pdf.successUpload'), 'success');
                            } catch (err) {
                              console.error(err);
                              showToast(t('policies:pdf.errorUpload'), 'error');
                            } finally {
                              setUploadingId(null);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        {uploadingId === it.id && (
                          <div className="mt-1 text-xs text-blue-700 flex items-center gap-2">
                            <span className="w-3 h-3 inline-block border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            {t('policies:pdf.uploading')}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
