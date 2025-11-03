import React from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, signInWithGoogle, signOutUser } from "../lib/firebase";

export default function Header() {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const name =
    user?.displayName ??
    user?.email?.split("@")[0] ??
    "Utilizador";

  return (
    <header className="w-full border-b">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {/* ...existing brand/logo... */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm sm:text-base">Olá {name}</span>
              <button
                onClick={() => signOutUser()}
                className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800"
            >
              Entrar com Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
