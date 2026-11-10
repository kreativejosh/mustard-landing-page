import { jsonLd, type PageKey } from '@/lib/seo';

/** Structured data for search engines and AI answer engines (schema.org JSON-LD, server-rendered). */
export function JsonLd({ page }: { page: PageKey }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(page)).replace(/</g, '\\u003c') }} />;
}
