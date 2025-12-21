import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatAuthError } from '../../utils/firebaseAuthErrors';

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
  const { t } = useTranslation('common');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);
    try {
      await register(email, password, name);
      setSuccess(t('auth.registerSuccess', 'Conta criada. Verifique o seu email para ativar.'));
      setTimeout(() => nav(`/${base}/auth/login`), 1200);
    } catch (err: any) {
      setError(formatAuthError(err, t) || t('auth.registerFailed', 'Falha no registo'));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">{t('auth.registerTitle', 'Criar conta')}</h1>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-4 text-green-700 text-sm">{success}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded px-3 py-2" type="text" placeholder={t('auth.name', 'Nome')} value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="email" placeholder={t('auth.email', 'Email')} value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder={t('auth.passwordMin', 'Password (min 6)')} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        <button disabled={pending} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">{pending ? 'A criar…' : t('auth.register', 'Criar conta')}</button>
      </form>
      <div className="text-sm mt-4">
        Já tem conta? <NavLink to={`/${base}/auth/login`} className="underline">{t('auth.signIn', 'Entrar')}</NavLink>
      </div>
    </div>
  );
}
