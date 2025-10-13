import React from 'react';
import { NavLink } from 'react-router-dom';

export function DesktopNav() {
  return (
    <nav className="bg-white py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <NavLink to="/" className="flex items-center gap-2">
        <img src={`${import.meta.env.BASE_URL}logo-empresarial.svg`} alt="Logo Ansião Seguros" className="h-12 w-12" />
        <span className="text-3xl font-bold text-blue-900 hover:text-blue-700">Ansião Seguros</span>
      </NavLink>
      <div className="hidden md:flex gap-6 text-blue-700 font-medium">
        <NavLink to="/" end className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Início</NavLink>
        <NavLink to="/simulacao-auto" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Auto</NavLink>
        <NavLink to="/simulacao-vida" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Vida</NavLink>
        <NavLink to="/simulacao-saude" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Saúde</NavLink>
        <NavLink to="/simulacao-habitacao" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Simulação Habitação</NavLink>
        <NavLink to="/produtos" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Produtos</NavLink>
        <NavLink to="/contato" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 text-blue-900 font-bold" : "hover:text-blue-900"}>Contato</NavLink>
      </div>
    </nav>
  );
}

export default DesktopNav;
