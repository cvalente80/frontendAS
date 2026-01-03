import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { signInWithGoogle, signInWithEmailPassword, registerWithEmailPassword, resetPassword } from '../firebase';
import { formatAuthError } from '../utils/firebaseAuthErrors';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthChoiceModal({ open, onClose }: Props) {
  const { t } = useTranslation('common');
  const [mode, setMode] = useState<'choice' | 'email-login' | 'email-register' | 'reset'>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'ok'|'err'|null>(null);

  if (!open) return null;

  // Permitir fechar com tecla Escape
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const finish = () => { setEmail(''); setPassword(''); setMode('choice'); onClose(); };

  async function handleGoogle() {
    setPending(true);
    try {
      await signInWithGoogle();
      finish();
    } catch (e: any) {
      setMessage(formatAuthError(e, t) || t('auth.googleLoginFailed', 'Falha ao autenticar com Google'));
      setMessageType('err');
    } finally {
      setPending(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null); setMessageType(null);
    try {
      await signInWithEmailPassword(email, password);
      finish();
    } catch (e: any) {
      setMessage(formatAuthError(e, t) || t('auth.loginFailed', 'Falha no login'));
      setMessageType('err');
    } finally { setPending(false); }
  }

  async function handleEmailRegister(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null); setMessageType(null);
    try {
      if (!name.trim()) {
        setMessage(t('auth.provideName', 'Indique o seu nome.'));
        setMessageType('err'); setPending(false); return;
      }
      const user = await registerWithEmailPassword(email, password);
      try {
        await updateProfile(user, { displayName: name.trim() });
      } catch (err) {
        // se falhar o updateProfile, continuar mesmo assim
        console.warn('[Auth] updateProfile falhou:', err);
      }
      finish();
    } catch (e: any) {
      setMessage(formatAuthError(e, t) || t('auth.registerFailed', 'Falha no registo'));
      setMessageType('err');
    } finally { setPending(false); }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null); setMessageType(null);
    try {
      await resetPassword(email);
      setMessage(
        t('auth.emailSent', 'Email de recuperação enviado.') +
        ' ' +
        t('auth.emailSentSpamNote', 'Por favor, verifique também a pasta de spam/lixo caso não encontre o email.')
      );
      setMessageType('ok');
    } catch (e: any) {
      setMessage(formatAuthError(e, t) || t('auth.resetFailed', 'Falha ao enviar recuperação'));
      setMessageType('err');
    } finally { setPending(false); }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-xl bg-white shadow-xl border border-gray-200 p-5">
        {mode === 'choice' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-900 text-center">{t('auth.loginTitle', 'Entrar')}</h2>
            <button
              onClick={handleGoogle}
              disabled={pending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-white border border-blue-200 px-4 py-2 text-blue-900 hover:bg-blue-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{t('auth.continueWithGoogle', 'Continuar com Google')}</span>
            </button>
            <div className="flex items-center gap-2 text-blue-800">
              <div className="h-px flex-1 bg-blue-200" />
              <span className="text-xs uppercase tracking-widest">{t('auth.or', 'ou')}</span>
              <div className="h-px flex-1 bg-blue-200" />
            </div>
            <button
              onClick={() => setMode('email-login')}
              className="w-full rounded-md bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-500"
            >
              {t('auth.signInWithEmail', 'Entrar com Email/Password')}
            </button>
            <div className="text-center text-sm">
              <button onClick={() => setMode('email-register')} className="text-blue-700 underline">{t('auth.createAccount', 'Criar conta')}</button>
              <span className="mx-1">·</span>
              <button onClick={() => setMode('reset')} className="text-blue-700 underline">{t('auth.forgotPassword', 'Recuperar password')}</button>
            </div>
          </div>
        )}

        {mode === 'email-login' && (
          <form className="space-y-3" onSubmit={handleEmailLogin}>
            <h2 className="text-lg font-semibold text-blue-900">{t('auth.loginWithEmailTitle', 'Entrar com Email')}</h2>
            <input type="email" required placeholder={t('auth.email', 'Email')} value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={t('auth.password', 'Password')}
                value={password}
                onChange={e=>setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? t('auth.hidePassword', 'Ocultar password') : t('auth.showPassword', 'Mostrar password')}
                title={showPassword ? t('auth.hidePassword', 'Ocultar password') : t('auth.showPassword', 'Mostrar password')}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.69-1.61 1.71-3.07 2.98-4.29M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-3.42M6.1 6.1 1 1m22 22-5.1-5.1M9.88 4.12A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-."></path></svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {message && <div className={`text-sm ${messageType==='err'?'text-red-700':'text-green-700'}`}>{message}</div>}
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-3 py-2 rounded border" onClick={()=>setMode('choice')}>{t('actions.back', 'Voltar')}</button>
              <button type="submit" disabled={pending} className="px-3 py-2 rounded bg-blue-600 text-white">{t('auth.signIn', 'Entrar')}</button>
            </div>
          </form>
        )}

        {mode === 'email-register' && (
          <form className="space-y-3" onSubmit={handleEmailRegister}>
            <h2 className="text-lg font-semibold text-blue-900">{t('auth.registerTitle', 'Criar conta')}</h2>
            <input
              type="text"
              required
              placeholder={t('auth.name', 'Nome')}
              value={name}
              onChange={e=>setName(e.target.value)}
              onInvalid={(e) => {
                const el = e.currentTarget as HTMLInputElement;
                if (!el.value.trim()) {
                  el.setCustomValidity(t('auth.provideName', 'Indique o seu nome.'));
                }
              }}
              onInput={(e) => {
                (e.currentTarget as HTMLInputElement).setCustomValidity('');
              }}
              className="w-full border rounded px-3 py-2"
            />
            <input type="email" required placeholder={t('auth.email', 'Email')} value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={t('auth.passwordMin', 'Password (min 6)')}
                value={password}
                onChange={e=>setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? t('auth.hidePassword', 'Ocultar password') : t('auth.showPassword', 'Mostrar password')}
                title={showPassword ? t('auth.hidePassword', 'Ocultar password') : t('auth.showPassword', 'Mostrar password')}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.69-1.61 1.71-3.07 2.98-4.29M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-3.42M6.1 6.1 1 1m22 22-5.1-5.1M9.88 4.12A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-."></path></svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {message && <div className={`text-sm ${messageType==='err'?'text-red-700':'text-green-700'}`}>{message}</div>}
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-3 py-2 rounded border" onClick={()=>setMode('choice')}>{t('actions.cancel', 'Cancelar')}</button>
              <button type="submit" disabled={pending} className="px-3 py-2 rounded bg-blue-600 text-white">{t('auth.register', 'Registar')}</button>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form className="space-y-3" onSubmit={handleReset}>
            <h2 className="text-lg font-semibold text-blue-900">{t('auth.resetTitle', 'Recuperar password')}</h2>
            <input type="email" required placeholder={t('auth.email', 'Email')} value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
            {message && <div className={`text-sm ${messageType==='err'?'text-red-700':'text-green-700'}`}>{message}</div>}
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-3 py-2 rounded border" onClick={()=>setMode('choice')}>{t('actions.back', 'Voltar')}</button>
              <button type="submit" disabled={pending} className="px-3 py-2 rounded bg-blue-600 text-white">{t('actions.send', 'Enviar')}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
