// Next.js Link, or a plain <a> to the exported .html file in the static preview build
// (NEXT_PUBLIC_STATIC_PREVIEW=1), where pages are served as flat files with no router.
import NextLink from 'next/link';
import type { ComponentProps } from 'react';

const PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === '1';

export function toFile(href: string) {
  if (!href.startsWith('/')) return href;
  const [path, hash] = href.split('#');
  const page = path.split('?')[0].replace(/\/$/, '') || '/index';
  return page.slice(1) + '.html' + (hash ? '#' + hash : '');
}

export default function Link({ href, ...rest }: ComponentProps<typeof NextLink> & { href: string }) {
  if (PREVIEW) return <a href={toFile(href)} {...(rest as ComponentProps<'a'>)} />;
  return <NextLink href={href} {...rest} />;
}
