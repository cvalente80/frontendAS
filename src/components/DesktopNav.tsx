import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

export function DesktopNav() {
  const { t } = useTranslation('common');
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';
  const { user } = useAuth();
  return (
    <nav className="bg-white py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <NavLink to={`/${base}`} className="flex items-center gap-2 shrink-0">
        <img src={`${import.meta.env.BASE_URL}logo-empresarial.svg`} alt="Logo Ansião Seguros" className="h-10 w-10 xl:h-12 xl:w-12" />
  <span className="text-2xl xl:text-3xl font-bold text-blue-900 hover:text-blue-700 whitespace-nowrap">{t('brand')}</span>
      </NavLink>
      <div className="hidden md:flex items-center gap-4 xl:gap-6 text-blue-700 font-medium text-sm xl:text-base">
        <NavLink to={`/${base}`} end className={({ isActive }) => (isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900") + " whitespace-nowrap"}>{t('nav.homeLink')}</NavLink>
        {/* Dropdown Simulador */}
        <div className="relative group">
          <button className="whitespace-nowrap hover:text-blue-900 inline-flex items-center gap-1 focus:outline-none" aria-haspopup="true">
            {t('nav.simulator')}
            <svg className="w-4 h-4 text-current" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute left-0 top-full w-56 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 scale-95 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition duration-150 ease-out p-2 z-50">
            <div className="flex flex-col text-blue-800">
              <NavLink to={`/${base}/simulacao-auto`} className={({ isActive }) => (isActive ? "bg-blue-50 text-blue-900 font-semibold" : "hover:bg-gray-50 hover:text-blue-900") + " rounded px-3 py-2"}>{t('nav.auto')}</NavLink>
              <NavLink to={`/${base}/simulacao-vida`} className={({ isActive }) => (isActive ? "bg-blue-50 text-blue-900 font-semibold" : "hover:bg-gray-50 hover:text-blue-900") + " rounded px-3 py-2"}>{t('nav.life')}</NavLink>
              <NavLink to={`/${base}/simulacao-saude`} className={({ isActive }) => (isActive ? "bg-blue-50 text-blue-900 font-semibold" : "hover:bg-gray-50 hover:text-blue-900") + " rounded px-3 py-2"}>{t('nav.health')}</NavLink>
              <NavLink to={`/${base}/simulacao-habitacao`} className={({ isActive }) => (isActive ? "bg-blue-50 text-blue-900 font-semibold" : "hover:bg-gray-50 hover:text-blue-900") + " rounded px-3 py-2"}>{t('nav.homeInsurance')}</NavLink>
            </div>
          </div>
        </div>
        <NavLink to={`/${base}/produtos`} className={({ isActive }) => (isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900") + " whitespace-nowrap"}>{t('nav.products')}</NavLink>
        <NavLink to={`/${base}/contato`} className={({ isActive }) => (isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900") + " whitespace-nowrap"}>{t('nav.contact')}</NavLink>
        {user && (
          <NavLink to={`/${base}/minhas-simulacoes`} className={({ isActive }) => (isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900") + " whitespace-nowrap"}>
            {t('nav.mySimulations')}
          </NavLink>
        )}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

export default DesktopNav;
