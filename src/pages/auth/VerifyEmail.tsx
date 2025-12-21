import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatAuthError } from '../../utils/firebaseAuthErrors';

export default function VerifyEmail() {
  const { sendVerification, user } = useAuth();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { t } = useTranslation('common');

  async function resend() {
    setMsg(null); setErr(null); setPending(true);
    try {
      await sendVerification();
      setMsg(t('auth.verificationEmailSent', 'Email de verificação reenviado.'));
    } catch (e: any) {
      setErr(formatAuthError(e, t) || t('auth.errors.generic', 'Ocorreu um erro. Tente novamente.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">{t('auth.verifyTitle', 'Verificar email')}</h1>
      <p className="text-sm mb-4">{t('auth.verifyIntro', { email: user?.email ? ` (${user.email})` : '' })}</p>
      {msg && <div className="text-green-700 text-sm mb-2">{msg}</div>}
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <button onClick={resend} disabled={pending} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">{pending ? t('auth.resending', 'A reenviar…') : t('auth.resendVerification', 'Reenviar email')}</button>
    </div>
  );
}
