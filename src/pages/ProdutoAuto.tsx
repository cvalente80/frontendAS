import React from "react";
import Seo from "../components/Seo";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProdutoAuto() {
  const { t } = useTranslation('product_auto');
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <Seo
        title={t('seoTitle')}
        description={t('seoDesc')}
        canonicalPath={`/${base}/produto-auto`}
      />
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header visual com imagem e título */}
  <div className="relative h-56 md:h-80 w-full flex items-center justify-center bg-blue-900">
          <img src={`${import.meta.env.BASE_URL}imagens/nosso-produtos-car.jpg`} alt={t('headerTitle')} className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 text-center w-full">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow mb-2">{t('headerTitle')}</h1>
            <p className="text-base md:text-lg text-blue-100 font-medium mb-4">{t('headerSubtitle')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link to={`/${base}/simulacao-auto`} className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition">{t('ctaSimulate')}</Link>
                      <Link to={`/${base}/contato`} className="inline-block px-8 py-3 bg-blue-400 text-white font-bold rounded-full shadow-lg hover:bg-blue-300 transition">{t('ctaContact')}</Link>
            </div>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-8 space-y-10">
          {/* Seção: Benefícios */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              {t('whyTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '🚗', key: 0 },
                { icon: '🕒', key: 1 },
                { icon: '⚙️', key: 2 },
                { icon: '�', key: 3 },
                { icon: '👨‍👩‍👧‍👦', key: 4 },
              ].map(({ icon, key }) => (
                <div key={key} className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                  <span className="text-blue-700 text-2xl">{icon}</span>
                  <span>{t(`whyItems.${key}`)}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Seção: Coberturas */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
              {t('coveragesTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-blue-100 shadow p-5">
                  <h3 className="font-bold text-blue-700 mb-1">{t(`coverages.${idx}.title`)}</h3>
                  <p className="text-gray-700">{t(`coverages.${idx}.desc`)}</p>
                </div>
              ))}
            </div>
          </section>
          {/* Seção: Vantagens */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              {t('benefitsTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '📱', key: 0 },
                { icon: '🔧', key: 1 },
                { icon: '⚡', key: 2 },
                { icon: '🎯', key: 3 },
              ].map(({ icon, key }) => (
                <div key={key} className="bg-blue-50 rounded-xl p-5 shadow flex gap-3 items-start">
                  <span className="text-blue-700 text-2xl">{icon}</span>
                  <span>{t(`benefits.${key}`)}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Seção: Como contratar */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              {t('howTitle')}
            </h2>
            <ol className="list-decimal pl-6 text-blue-900 text-lg space-y-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx}>{t(`howSteps.${idx}`)}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
