import { TFunction } from 'i18next';

// Maps Firebase Auth error codes to localized, user-friendly messages using i18n
export function formatAuthError(error: any, t: TFunction<'common'>): string {
  const code: string = String(error?.code || '').replace(/^firebase:\s*error\s*/i, '').replace(/^\(|\)$/g, '');

  // Normalize known aliases
  const normalized = normalizeCode(code);

  // If we have a direct translation key, use it; else show generic
  if (normalized) {
    const key = `auth.errors.${normalized}`;
    const translated = t(key, { defaultValue: '' }) as string;
    if (translated && translated.trim().length > 0) return translated;
  }

  // Fallback generic
  return t('auth.errors.generic', 'Ocorreu um erro. Tente novamente.');
}

function normalizeCode(code: string): string | null {
  if (!code) return null;
  // Remove wrappers like "auth/..." or spaces
  const c = code.replace(/^error\s*/i, '').trim();
  // Ensure we keep only the Firebase code part (e.g., auth/invalid-credential)
  const m = c.match(/auth\/[a-z0-9-]+/i);
  const pure = (m ? m[0] : c).toLowerCase();

  switch (pure) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'invalid-credential';
    case 'auth/invalid-email':
      return 'invalid-email';
    case 'auth/user-not-found':
      return 'user-not-found';
    case 'auth/missing-password':
      return 'missing-password';
    case 'auth/too-many-requests':
      return 'too-many-requests';
    case 'auth/network-request-failed':
      return 'network-request-failed';
    case 'auth/email-already-in-use':
      return 'email-already-in-use';
    case 'auth/weak-password':
      return 'weak-password';
    case 'auth/popup-closed-by-user':
      return 'popup-closed-by-user';
    case 'auth/popup-blocked':
      return 'popup-blocked';
    default:
      return null;
  }
}
