import type { MetadataRoute } from 'next';
import { PAGES, url, ogPath, type PageKey } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return (Object.keys(PAGES) as PageKey[]).map((k) => ({
    url: url(PAGES[k].path), lastModified: now, changeFrequency: 'monthly', priority: k === 'home' ? 1 : 0.8,
    images: [url(ogPath(k))],
  }));
}
