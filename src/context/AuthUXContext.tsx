import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import AuthChoiceModal from '../components/AuthChoiceModal';

/**
 * AuthUXContext centraliza uma função requireAuth() que:
 * - Se o utilizador já estiver autenticado, resolve imediatamente
 * - Caso contrário, abre o modal de autenticação e resolve quando o utilizador fizer login
 */

type AuthUX = {
  requireAuth: () => Promise<void>;
  openAuth: () => void;
  closeAuth: () => void;
};

const AuthUXContext = createContext<AuthUX | null>(null);

export function AuthUXProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const resolverRef = useRef<(() => void) | null>(null);

  const closeAuth = useCallback(() => setOpen(false), []);
  const openAuth = useCallback(() => setOpen(true), []);

  const requireAuth = useCallback(async () => {
    // Se já estiver autenticado, não bloquear
    if (!loading && user) return;
    // Caso contrário, abrir modal e aguardar resolução
    setOpen(true);
    await new Promise<void>((resolve) => {
      resolverRef.current = resolve;
    });
  }, [user, loading]);

  // Quando o utilizador ficar autenticado, resolvemos quem estiver à espera
  useEffect(() => {
    if (!loading && user && resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
      setOpen(false);
    }
  }, [user, loading]);

  const value = useMemo(() => ({ requireAuth, openAuth, closeAuth }), [requireAuth, openAuth, closeAuth]);

  return (
    <AuthUXContext.Provider value={value}>
      {children}
      <AuthChoiceModal open={open} onClose={closeAuth} />
    </AuthUXContext.Provider>
  );
}

export function useAuthUX() {
  const ctx = useContext(AuthUXContext);
  if (!ctx) throw new Error('useAuthUX deve ser usado dentro de AuthUXProvider');
  return ctx;
}
