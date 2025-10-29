import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation('common');
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm md:hidden">
      <div className="py-4 px-4 flex justify-between items-center">
        <NavLink to={`/${base}`} className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src={`${import.meta.env.BASE_URL}logo-empresarial.svg`} alt="Logo Ansião Seguros" className="h-10 w-10" />
          <span className="text-2xl font-bold text-blue-900">{t('brand')}</span>
        </NavLink>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button aria-label="Abrir menu" className="p-2 rounded-md border border-blue-200" onClick={() => setOpen((v) => !v)}>
          <svg width="24" height="24" fill="none" stroke="#1e3a8a" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          </button>
        </div>
      </div>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
      )}
      {open && (
        <nav className="px-4 pb-4 relative">
          <ul className="flex flex-col gap-3 text-blue-800 font-medium">
            <li><NavLink to={`/${base}`} end onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.homeLink')}</NavLink></li>
            {/* Simulador collapsible */}
            <li>
              <details className="group">
                <summary className="cursor-pointer select-none flex items-center justify-between">
                  {t('nav.simulator')}
                  <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                </summary>
                <ul className="mt-2 ml-3 flex flex-col gap-2">
                  <li><NavLink to={`/${base}/simulacao-auto`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.auto')}</NavLink></li>
                  <li><NavLink to={`/${base}/simulacao-vida`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.life')}</NavLink></li>
                  <li><NavLink to={`/${base}/simulacao-saude`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.health')}</NavLink></li>
                  <li><NavLink to={`/${base}/simulacao-habitacao`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.homeInsurance')}</NavLink></li>
                </ul>
              </details>
            </li>
            <li><NavLink to={`/${base}/produtos`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.products')}</NavLink></li>
            <li><NavLink to={`/${base}/contato`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.contact')}</NavLink></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
