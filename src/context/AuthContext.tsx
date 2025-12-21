import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, handleAuthRedirect, signInWithGoogle, signOutUser, db, signInWithEmailPassword, registerWithEmailPassword, resetPassword } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';

// Helper para obter o nome mais fiável do utilizador
function getDisplayName(u: User | null): string {
  if (!u) return 'Utilizador';
  return (
    (u.displayName && u.displayName.trim()) ||
    u.providerData?.find((p) => p?.displayName)?.displayName ||
    u.email?.split('@')[0] ||
    'Utilizador'
  );
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  displayName: string;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<any>; // signInWithGoogle pode retornar um user ou null
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name?: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
  sendVerification: () => Promise<void>;
};
import { sendVerification } from '../firebase';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Processa o resultado de um login por redirecionamento (se houver)
    // e hidrata imediatamente após refresh
    (async () => {
      try {
        // 1) Hidratar sessão persistida já no arranque (sem esperar pelo listener)
        if (auth.currentUser && loading) {
          setUser(auth.currentUser);
          setLoading(false);
        }
        // 2) Finalizar redirect (se existir) e aplicar utilizador antes de redirecionar
        const redirected = await handleAuthRedirect();
        if (redirected) {
          try {
            await redirected.reload();
          } catch {
            // ignore
          }
          setUser(redirected);
          setLoading(false);
          if (location.pathname.includes('/login')) {
            navigate('/', { replace: true });
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();

    // Ouve as mudanças de estado de autenticação (login, logout, refresh)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !currentUser.displayName) {
        try {
          await currentUser.reload();
        } catch (error) {
          console.error('Falha ao recarregar o perfil do utilizador:', error);
        }
      }
      setUser(currentUser);
      setLoading(false);

      // Carrega o perfil do utilizador (ex.: isAdmin) sem sobrescrever o campo no DB
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        // Garante apenas dados básicos; NÃO tocar em isAdmin aqui
        try {
          await setDoc(userRef, {
            email: currentUser.email ?? null,
            displayName: currentUser.displayName ?? null,
            createdAt: serverTimestamp(),
          }, { merge: true });
        } catch {
          // Ignora falhas de escrita (offline)
        }
        // Determina isAdmin: prioridade à coleção admins/{uid}; fallback para users/{uid}.isAdmin
        try {
          const adminRef = doc(db, 'admins', currentUser.uid);
          const adminSnap = await getDoc(adminRef);
          if (adminSnap.exists()) {
            setIsAdmin(true);
          } else {
            try {
              const snap = await getDoc(userRef);
              if (snap.exists()) {
                const data = snap.data() as any;
                setIsAdmin(Boolean(data?.isAdmin));
              } else {
                setIsAdmin(false);
              }
            } catch {
              // Sem conectividade: não alterar o estado atual para evitar falsos negativos
            }
          }
        } catch {
          // Sem conectividade: não alterar o estado atual
        }
      } else {
        setIsAdmin(false);
      }

      if (currentUser && location.pathname.includes('/login')) {
        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect');
        navigate(redirect || '/', { replace: true });
        try {
          // Sinalizar ao UI que pode abrir o chat, se havia intenção
          if (typeof window !== 'undefined' && localStorage.getItem('chat:intentOpen') === '1') {
            localStorage.removeItem('chat:intentOpen');
            window.dispatchEvent(new CustomEvent('chat:open'));
          }
        } catch {}
      }
    });

    return () => unsubscribe(); // Limpa a subscrição ao desmontar
  }, [navigate, location.pathname, loading]);

  // Log + persistência do nome sempre que o utilizador mudar
  useEffect(() => {
    if (!loading) {
      if (user) {
        const name = getDisplayName(user);
        console.log('[Auth] Utilizador autenticado:', name, `(UID: ${user.uid})`);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('authDisplayName', name);
            window.dispatchEvent(new CustomEvent('auth:updated', { detail: { user, displayName: name } }));
          } catch {
            // ignore storage/dispatch issues
          }
        }
      } else {
        console.log('[Auth] Nenhum utilizador autenticado.');
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('authDisplayName');
            window.dispatchEvent(new CustomEvent('auth:updated', { detail: { user: null, displayName: '' } }));
          } catch {
            // ignore
          }
        }
      }
    }
  }, [user, loading]);

  const value = useMemo(
    () => {
      const persistedName =
        typeof window !== 'undefined' ? (localStorage.getItem('authDisplayName') || '') : '';
      return {
        user,
        loading,
        displayName: getDisplayName(user) || persistedName || 'Utilizador',
        isAdmin,
        loginWithGoogle: signInWithGoogle,
        logout: signOutUser,
        login: signInWithEmailPassword,
        register: async (email: string, password: string, _name?: string) => registerWithEmailPassword(email, password),
        forgotPassword: resetPassword,
        sendVerification,
        refreshAdminStatus: async () => {
          if (!user) {
            setIsAdmin(false);
            return false;
          }
          try {
            const adminRef = doc(db, 'admins', user.uid);
            const adminSnap = await getDoc(adminRef);
            if (adminSnap.exists()) {
              setIsAdmin(true);
              return true;
            }
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);
            const flag = snap.exists() && Boolean((snap.data() as any)?.isAdmin);
            setIsAdmin(flag);
            return flag;
          } catch (e) {
            console.warn('[Auth] refreshAdminStatus erro', e);
            return isAdmin;
          }
        },
      };
    },
    [user, loading, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4 text-center">A carregar…</div>;
  if (!user) return <div className="p-6 text-center">Acesso restrito. É necessário autenticação.</div>;
  return children;
}
