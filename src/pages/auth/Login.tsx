import React from "react";
import { useAuth } from "../../context/AuthContext";
import { signInWithGoogle, signOutUser } from "../../firebase";
import { useTranslation } from 'react-i18next';
import { formatAuthError } from '../../utils/firebaseAuthErrors';
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { user, loading } = useAuth();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');
  const { t } = useTranslation('common');

  const handleLogin = async () => {
    setPending(true);
    setError(null);
    try {
      const logged = await signInWithGoogle(); // popup → user, redirect → null
      if (logged) {
        if (redirect) {
          navigate(redirect, { replace: true });
        } else {
          navigate("/", { replace: true }); // fallback
        }
      }
    } catch (e: any) {
      setError(formatAuthError(e, t) || t('auth.googleLoginFailed', 'Falha ao autenticar com Google'));
    } finally {
      setPending(false);
    }
  };

  const handleLogout = async () => {
    setPending(true);
    try {
      await signOutUser();
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return <div className="p-6">A carregar...</div>;
  }

  if (user) {
    const name = user.displayName ?? user.email?.split("@")[0] ?? t('auth.hello', 'Olá');
    return (
      <div className="p-6 space-y-3">
        <div>{t('auth.hello', 'Olá')} {name} 👋</div>
        <button
          onClick={handleLogout}
          disabled={pending}
          className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {t('auth.signOut', 'Sair')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && <div className="mb-3 text-sm text-red-700">{error}</div>}
      <button
        onClick={handleLogin}
        disabled={pending}
        className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {t('auth.continueWithGoogle', 'Continuar com Google')}
      </button>
    </div>
  );
}
