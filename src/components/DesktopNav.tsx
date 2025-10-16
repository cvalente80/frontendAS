import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export function DesktopNav() {
  const { t } = useTranslation('common');
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';
  return (
    <nav className="bg-white py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <NavLink to={`/${base}`} className="flex items-center gap-2">
        <img src={`${import.meta.env.BASE_URL}logo-empresarial.svg`} alt="Logo Ansião Seguros" className="h-12 w-12" />
  <span className="text-3xl font-bold text-blue-900 hover:text-blue-700">{t('brand')}</span>
      </NavLink>
      <div className="hidden md:flex gap-6 text-blue-700 font-medium items-center">
        <NavLink to={`/${base}`} end className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>{t('nav.homeLink')}</NavLink>
        <NavLink to={`/${base}/simulacao-auto`} className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>{t('nav.auto')}</NavLink>
        <NavLink to={`/${base}/simulacao-vida`} className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>{t('nav.life')}</NavLink>
        <NavLink to={`/${base}/simulacao-saude`} className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>{t('nav.health')}</NavLink>
        <NavLink to={`/${base}/simulacao-habitacao`} className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>{t('nav.homeInsurance')}</NavLink>
        <NavLink to={`/${base}/produtos`} className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>{t('nav.products')}</NavLink>
        <NavLink to={`/${base}/contato`} className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>{t('nav.contact')}</NavLink>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

export default DesktopNav;
