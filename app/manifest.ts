import type { MetadataRoute } from 'next';
import { NAME, PAGES } from '@/lib/seo';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: NAME, short_name: NAME, description: PAGES.home.description, start_url: '/', display: 'standalone',
    background_color: '#FFFFFF', theme_color: '#222F30',
    icons: [{ src: '/assets/logo/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  };
}
