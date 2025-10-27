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
            <li><NavLink to={`/${base}/simulacao-auto`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.auto')}</NavLink></li>
            <li><NavLink to={`/${base}/simulacao-vida`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.life')}</NavLink></li>
            <li><NavLink to={`/${base}/simulacao-saude`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.health')}</NavLink></li>
            <li><NavLink to={`/${base}/simulacao-habitacao`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.homeInsurance')}</NavLink></li>
            <li><NavLink to={`/${base}/produtos`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.products')}</NavLink></li>
            <li><NavLink to={`/${base}/contato`} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "font-bold text-blue-900" : "hover:text-blue-900"}>{t('nav.contact')}</NavLink></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
