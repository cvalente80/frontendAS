import React, { useEffect } from 'react';
import i18n from '../i18n';

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  canonicalPath?: string; // e.g. "/produto-frota"
  noIndex?: boolean;
  structuredData?: object | object[];
};

const DEFAULT_TITLE = 'Ansião Seguros';
const DEFAULT_DESC = 'Ansião Seguros — Seguros Auto, Vida, Saúde, Habitação e soluções empresariais em Ansião (Leiria). Simulações e propostas personalizadas.';
const DEFAULT_IMAGE = `${import.meta.env.BASE_URL}logo-empresarial.svg`;

function siteBase(): string | null {
  const fromEnv = (import.meta as any).env?.VITE_SITE_URL as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (typeof window !== 'undefined') {
    const base = (import.meta as any).env?.BASE_URL || '/';
    const baseNormalized = base.startsWith('/') ? base : `/${base}`;
    return `${window.location.origin}${baseNormalized.replace(/\/$/, '')}`;
  }
  return null;
}

function upsertMetaByName(name: string, content: string | undefined) {
  if (!content) return;
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProp(property: string, content: string | undefined) {
  if (!content) return;
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string | undefined) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, image, canonicalPath, noIndex, structuredData }: SeoProps) {
  useEffect(() => {
    // language
    const lang = i18n.language === 'en' ? 'en' : 'pt';
    document.documentElement.lang = lang;

    const base = siteBase();
    const resolvedTitle = title ? `${DEFAULT_TITLE} | ${title}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESC;
    const img = image || DEFAULT_IMAGE;
    const url = (() => {
      if (!base) return undefined;
      if (canonicalPath) {
        const path = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
        return `${base}${path}`;
      }
      return typeof window !== 'undefined' ? `${base}${window.location.pathname}${window.location.search}` : undefined;
    })();

    // Title
    document.title = resolvedTitle;
    // Meta
    upsertMetaByName('description', desc);
    if (noIndex) upsertMetaByName('robots', 'noindex,nofollow');

    // Open Graph
    if (url) upsertMetaByProp('og:url', url);
    upsertMetaByProp('og:type', 'website');
    upsertMetaByProp('og:site_name', 'Ansião Seguros');
  upsertMetaByProp('og:locale', lang === 'en' ? 'en_GB' : 'pt_PT');
    upsertMetaByProp('og:title', resolvedTitle);
    upsertMetaByProp('og:description', desc);
    upsertMetaByProp('og:image', img);

    // Twitter
    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', resolvedTitle);
    upsertMetaByName('twitter:description', desc);
    upsertMetaByName('twitter:image', img);

    // Canonical
    if (url) upsertLink('canonical', url);

    // Structured data: remove old ones we created then add fresh ones
    const old = Array.from(document.head.querySelectorAll('script[data-seo-jsonld="true"]'));
    old.forEach(n => n.parentElement?.removeChild(n));
    const list = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];
    for (const obj of list) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo-jsonld', 'true');
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
    }
  }, [title, description, image, canonicalPath, noIndex, structuredData, i18n.language]);

  return null;
}

