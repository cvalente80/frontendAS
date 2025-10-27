export function withLang(baseLang: string | undefined, path: string) {
  const lang = baseLang === 'en' ? 'en' : 'pt';
  const clean = path.replace(/^\//, '');
  return `/${lang}/${clean}`.replace(/\/$/, '');
}
