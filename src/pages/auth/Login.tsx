import React from "react";
import { useAuth } from "../../context/AuthContext";
import { signInWithGoogle, signOutUser } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { user, loading } = useAuth();
  const [pending, setPending] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');

  const handleLogin = async () => {
    setPending(true);
    try {
      const logged = await signInWithGoogle(); // popup → user, redirect → null
      if (logged) {
        if (redirect) {
          navigate(redirect, { replace: true });
        } else {
          navigate("/", { replace: true }); // fallback
        }
      }
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
    const name = user.displayName ?? user.email?.split("@")[0] ?? "Utilizador";
    return (
      <div className="p-6 space-y-3">
        <div>Olá {name} 👋</div>
        <button
          onClick={handleLogout}
          disabled={pending}
          className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800 disabled:opacity-60"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={handleLogin}
        disabled={pending}
        className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800 disabled:opacity-60"
      >
        Entrar com Google
      </button>
    </div>
  );
}
