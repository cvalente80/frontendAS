import { FormEvent, useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const nav = useNavigate();
  const { lang } = useParams();
  const base = lang === 'en' ? 'en' : 'pt';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);
    try {
      await register(email, password, name);
      setSuccess('Conta criada. Verifique seu email para ativar.');
      setTimeout(() => nav(`/${base}/auth/login`), 1200);
    } catch (err: any) {
      setError(err?.message || 'Falha ao criar conta.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Criar conta</h1>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-4 text-green-700 text-sm">{success}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded px-3 py-2" type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Palavra-passe (mín. 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        <button disabled={pending} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">{pending ? 'A criar…' : 'Criar conta'}</button>
      </form>
      <div className="text-sm mt-4">
        Já tem conta? <NavLink to={`/${base}/auth/login`} className="underline">Entrar</NavLink>
      </div>
    </div>
  );
}
