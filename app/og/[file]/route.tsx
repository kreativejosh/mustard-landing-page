// Share images as real files: /og/home.png, /og/manufacturing.png, /og/technology.png, /og/about.png
import { ogImage } from '@/lib/og';
import { PAGES, type PageKey } from '@/lib/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(PAGES).map((k) => ({ file: `${k}.png` })); }

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  return ogImage(file.replace(/\.png$/, '') as PageKey);
}
