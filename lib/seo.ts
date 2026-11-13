// Search and AI-search metadata, built only from the verbatim website copy (lib/copy.ts).
import type { Metadata } from 'next';
import { HOME, MANUFACTURING, TECHNOLOGY, ABOUT, CAREERS, TAGLINE } from './copy';

/** Canonical origin: NEXT_PUBLIC_SITE_URL, else Vercel's production domain, else localhost for dev. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/$/, '');

export const NAME = 'Mustard Bio';

export type PageKey = 'home' | 'manufacturing' | 'technology' | 'about' | 'careers';

/** One record per page: what search engines, social cards, JSON-LD and llms.txt all read. */
export const PAGES: Record<PageKey, { path: string; title: string; heading: string; description: string; label: string }> = {
  home: { path: '/', label: 'Home', title: `${NAME}: ${TAGLINE}`, heading: TAGLINE, description: HOME.hero.sub },
  manufacturing: { path: '/manufacturing', label: 'Manufacturing', title: 'Pharmaceutical manufacturing', heading: MANUFACTURING.hero.title.join(' '), description: MANUFACTURING.hero.body[0] },
  technology: { path: '/technology', label: 'Technology', title: 'Maverick OS', heading: TECHNOLOGY.hero.title.join(' '), description: TECHNOLOGY.hero.body[0] },
  about: { path: '/about', label: 'About', title: 'About and vision', heading: ABOUT.hero.title.join(' '), description: ABOUT.hero.body[0] },
  careers: { path: '/careers', label: 'Careers', title: 'Careers', heading: CAREERS.hero.title.join(' '), description: CAREERS.hero.body[1] },
};

export const url = (path: string) => SITE_URL + (path === '/' ? '' : path);
export const ogPath = (key: PageKey) => `/og/${key}.png`;

export function pageMetadata(key: PageKey): Metadata {
  const p = PAGES[key];
  return {
    title: key === 'home' ? { absolute: p.title } : p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: { type: 'website', siteName: NAME, locale: 'en', url: p.path, title: key === 'home' ? p.title : `${p.title} · ${NAME}`, description: p.description, images: [{ url: ogPath(key), width: 1200, height: 630, alt: p.heading, type: 'image/png' }] },
    twitter: { card: 'summary_large_image', title: key === 'home' ? p.title : `${p.title} · ${NAME}`, description: p.description, images: [ogPath(key)] },
  };
}

/** schema.org graph for a page: Organization + WebSite on every page, plus the WebPage and its breadcrumb. */
export function jsonLd(key: PageKey) {
  const p = PAGES[key];
  const org = {
    '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: NAME, url: url('/'),
    logo: { '@type': 'ImageObject', url: url('/assets/logo/app-icon.svg') },
    slogan: TAGLINE, description: HOME.hero.body[0],
  };
  const site = { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: NAME, url: url('/'), inLanguage: 'en', publisher: { '@id': org['@id'] } };
  const page: Record<string, unknown> = {
    '@type': key === 'about' ? 'AboutPage' : 'WebPage', '@id': `${url(p.path)}#webpage`, url: url(p.path), name: p.title, headline: p.heading,
    description: p.description, inLanguage: 'en', isPartOf: { '@id': site['@id'] }, about: { '@id': org['@id'] },
    primaryImageOfPage: { '@type': 'ImageObject', url: url(ogPath(key)), width: 1200, height: 630 },
  };
  if (key === 'technology') page.mentions = { '@type': 'Thing', name: 'Maverick OS', description: TECHNOLOGY.hero.body[0] };
  const graph: object[] = [org, site, page];
  if (key !== 'home') {
    page.breadcrumb = { '@id': `${url(p.path)}#breadcrumb` };
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url(p.path)}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: PAGES.home.label, item: url('/') },
      { '@type': 'ListItem', position: 2, name: p.label, item: url(p.path) },
    ] });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
