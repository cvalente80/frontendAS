import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, loading, displayName, loginWithGoogle, logout } = useAuth();

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Logótipo ou nome do site à esquerda */}
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo-empresarial.svg`} alt="Logo Ansião Seguros" className="h-8 w-8" />
          <span className="text-lg font-semibold text-gray-800">Ansião Seguros</span>
        </div>

        {/* Controlos à direita */}
        <div className="flex items-center gap-4">
          {/* O seu seletor de língua pode vir aqui */}
          {/* <LanguageSwitcher /> */}

          {/* Estado de autenticação */}
          {loading ? (
            <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200" />
          ) : user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-700 max-w-[180px] truncate">Olá {displayName}</span>
              <button
                onClick={logout}
                className="rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
