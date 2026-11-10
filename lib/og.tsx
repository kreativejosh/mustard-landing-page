// Branded 1200x630 share images, rendered at build time from the page's verbatim heading.
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PAGES, type PageKey } from './seo';

export const OG_SIZE = { width: 1200, height: 630 };
const ROOT = process.cwd();

export async function ogImage(key: PageKey) {
  const [sans, mono, logo] = await Promise.all([
    readFile(join(ROOT, 'assets/fonts/ibm-plex-sans-latin-400-normal.woff')),
    readFile(join(ROOT, 'assets/fonts/ibm-plex-mono-latin-500-normal.woff')),
    readFile(join(ROOT, 'public/assets/logo/primary-white-dose.svg')),
  ]);
  const p = PAGES[key];
  const ticks = [30, 100, 85, 70, 55, 40, 55, 70, 85, 100, 30];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#222F30', color: '#fff', padding: '64px 72px', fontFamily: 'Plex' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={`data:image/svg+xml;base64,${logo.toString('base64')}`} width={300} height={50} alt="" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'PlexMono', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: '#C9CBBE' }}>
            <div style={{ width: 14, height: 14, background: '#A7E26E' }} />{p.label}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: p.heading.length > 50 ? 64 : 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>{p.heading}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 70 }}>
          {ticks.map((h, i) => <div key={i} style={{ width: i === 5 ? 16 : 5, height: `${h}%`, background: i === 5 ? '#A7E26E' : 'rgba(255,255,255,.85)' }} />)}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: 'Plex', data: sans, weight: 400 }, { name: 'PlexMono', data: mono, weight: 500 }] },
  );
}
