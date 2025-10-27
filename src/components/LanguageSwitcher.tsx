import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import i18n from '../i18n';

function swapLangInPath(pathname: string, nextLang: 'pt' | 'en') {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return `/${nextLang}`;
  parts[0] = nextLang;
  return '/' + parts.join('/');
}

function Flag({ lang }: { lang: 'pt' | 'en' }) {
  return <span role="img" aria-hidden className="text-xl leading-none">{lang === 'pt' ? '🇵🇹' : '🇬🇧'}</span>;
}

export default function LanguageSwitcher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const current = (params.lang === 'en' ? 'en' : 'pt') as 'pt' | 'en';
  const other = current === 'pt' ? 'en' : 'pt';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const choose = (lang: 'pt' | 'en') => {
    if (lang === current) {
      setOpen(false);
      return;
    }
    i18n.changeLanguage(lang);
    navigate(swapLangInPath(pathname, lang), { replace: true });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded px-2 py-1 border ${open ? 'bg-gray-100 border-blue-300' : 'border-gray-200 hover:bg-gray-100'}`}
        title={current.toUpperCase()}
        aria-label={current === 'pt' ? 'Idioma atual: Português. Abrir seletor de idioma.' : 'Current language: English. Open language selector.'}
      >
        <Flag lang={current} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-md py-1 z-50">
          <button
            role="menuitem"
            onClick={() => choose(other)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
            aria-label={other === 'pt' ? 'Mudar para Português' : 'Switch to English'}
          >
            <Flag lang={other} />
            <span className="text-sm">{other.toUpperCase()}</span>
          </button>
        </div>
      )}
    </div>
  );
}
