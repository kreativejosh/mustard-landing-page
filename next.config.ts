import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export: deploy the out/ folder to any host.
  output: 'export',
  // Brand renders are served exactly as produced by the render pipeline: never resized or recompressed.
  images: { unoptimized: true },
  // Static preview build (flat files, any host): asset URLs made relative after export (see README).
  ...(process.env.NEXT_PUBLIC_STATIC_PREVIEW === '1' ? { assetPrefix: '/__REL__' } : {}),
};

export default nextConfig;
