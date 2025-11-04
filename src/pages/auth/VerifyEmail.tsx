import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const { sendVerification, user } = useAuth();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function resend() {
    setMsg(null); setErr(null); setPending(true);
    try {
      await sendVerification();
      setMsg('Email de verificação reenviado.');
    } catch (e: any) {
      setErr(e?.message || 'Falha ao reenviar.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Verificar email</h1>
      <p className="text-sm mb-4">Enviamos um link de verificação para o seu email{user?.email ? ` (${user.email})` : ''}. Confirme para desbloquear todas as funcionalidades.</p>
      {msg && <div className="text-green-700 text-sm mb-2">{msg}</div>}
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <button onClick={resend} disabled={pending} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">{pending ? 'A reenviar…' : 'Reenviar email'}</button>
    </div>
  );
}
