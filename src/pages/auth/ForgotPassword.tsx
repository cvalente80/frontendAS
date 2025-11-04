import { FormEvent, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);
    try {
      await resetPassword(email);
      setSuccess('Email de recuperação enviado, verifique sua caixa de entrada.');
    } catch (err: any) {
      setError(err?.message || 'Falha ao enviar recuperação.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Recuperar palavra-passe</h1>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-4 text-green-700 text-sm">{success}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button disabled={pending} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">{pending ? 'A enviar…' : 'Enviar link de recuperação'}</button>
      </form>
      <div className="text-sm mt-4">
        <NavLink className="underline" to={`/${base}/auth/login`}>Voltar ao login</NavLink>
      </div>
    </div>
  );
}
