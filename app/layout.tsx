import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { Reveal } from '@/components/reveal';
import { SITE_URL, NAME, PAGES } from '@/lib/seo';
import './globals.css';

// IBM Plex (SIL OFL) served from the repo: no font download at build time, so builds never depend on Google Fonts.
const sans = localFont({
  src: [
    { path: '../assets/fonts/ibm-plex-sans-latin-400-normal.woff', weight: '400', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-latin-500-normal.woff', weight: '500', style: 'normal' },
  ],
  variable: '--font-sans', display: 'swap', fallback: ['system-ui', 'sans-serif'],
});
const mono = localFont({
  src: [
    { path: '../assets/fonts/ibm-plex-mono-latin-400-normal.woff', weight: '400', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-mono-latin-500-normal.woff', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono', display: 'swap', fallback: ['ui-monospace', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: PAGES.home.title, template: `%s · ${NAME}` },
  description: PAGES.home.description,
  applicationName: NAME,
  authors: [{ name: NAME }],
  creator: NAME,
  publisher: NAME,
  icons: { icon: '/assets/logo/app-icon.svg' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { types: { 'text/plain': '/llms.txt' } },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#222F30' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <noscript><style>{`[data-r]{opacity:1!important;transform:none!important}.title .ln>span{transform:none!important}`}</style></noscript>
        <a href="#main" className="skip">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
