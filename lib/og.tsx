// Branded 1200x630 share images, rendered at build time from the page's verbatim heading.
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PAGES, type PageKey } from './seo';
import { ILLO, type IlloKind } from './brand/illustrations';

// one illustration from the brand pack per page (the logo already sits top left)
const ART: Record<PageKey, IlloKind> = { home: 'layers', manufacturing: 'capsules', technology: 'lattice', about: 'dose', careers: 'network' };

export const OG_SIZE = { width: 1200, height: 630 };
const ROOT = process.cwd();

export async function ogImage(key: PageKey) {
  const [sans, mono, logo] = await Promise.all([
    readFile(join(ROOT, 'assets/fonts/ibm-plex-sans-latin-400-normal.woff')),
    readFile(join(ROOT, 'assets/fonts/ibm-plex-mono-latin-500-normal.woff')),
    readFile(join(ROOT, 'public/assets/logo/primary-white-dose.svg')),
  ]);
  const p = PAGES[key];
  const art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 114 114" fill="none" stroke="#CEF79E" stroke-width="1" stroke-miterlimit="10">${ILLO[ART[key]]()}</svg>`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#222F30', color: '#fff', padding: '64px 72px 96px', fontFamily: 'Plex', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={`data:image/svg+xml;base64,${logo.toString('base64')}`} width={300} height={50} alt="" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'PlexMono', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: '#C9CBBE' }}>
            <div style={{ width: 14, height: 14, background: '#A7E26E' }} />{p.label}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: p.heading.length > 50 ? 64 : 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 780 }}>{p.heading}</div>
        <img src={`data:image/svg+xml;base64,${Buffer.from(art).toString('base64')}`} width={230} height={230} alt="" style={{ position: 'absolute', right: 72, bottom: 56, opacity: 0.9 }} />
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: 'Plex', data: sans, weight: 400 }, { name: 'PlexMono', data: mono, weight: 500 }] },
  );
}
