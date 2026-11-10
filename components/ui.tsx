// Small building blocks of the Mustard Bio site language.
import Link from '@/components/link';
import { Fragment, type ReactNode } from 'react';

export function Arrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

/** Split button: dark label block + lime arrow chip (slides on hover). */
export function Btn({ href, children, tone = 'dark' }: { href: string; children: ReactNode; tone?: 'dark' | 'light' | 'lime' }) {
  return <Link href={href} className={`btn btn-${tone}`}><span className="btn-l">{children}</span><span className="btn-a"><Arrow /></span></Link>;
}

/** Mono eyebrow with the lime "dose" square. */
export function Tag({ children, tone }: { children: ReactNode; tone?: 'd' }) {
  return <span className={`tag${tone ? ' tag-' + tone : ''}`}>{children}</span>;
}

/** The scale rule from the mark: 11 graduations, the dose in lime. Draws in when revealed. */
export function Rule({ className = '', dose = true }: { className?: string; dose?: boolean }) {
  const h = [30, 100, 85, 70, 55, 40, 55, 70, 85, 100, 30];
  return (
    <svg className={`rule ${className}`} viewBox="0 0 108 40" aria-hidden="true" data-r>
      {h.map((p, i) => <rect key={i} x={i * 10 + (i > 5 ? 2 : 0)} y={40 - p * 0.4} width={i === 5 ? 4 : 1.6} height={p * 0.4} className={i === 5 && dose ? 'dose' : undefined} style={{ transitionDelay: `${Math.abs(i - 5) * 50}ms` }} />)}
    </svg>
  );
}

/** Display title: first line(s) in ink, last line muted. Lines rise in on reveal. */
export function Title({ lines, as: As = 'h2', className = '' }: { lines: string[]; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <As className={`title ${className}`} data-r>
      {lines.map((l, i) => <Fragment key={i}>{i > 0 && ' '}<span className={`ln${i === lines.length - 1 && lines.length > 1 ? ' mute' : ''}`}><span style={{ transitionDelay: `${i * 90}ms` }}>{l}</span></span></Fragment>)}
    </As>
  );
}

/** Image in a rounded frame with an honest caption. Renders are served untouched. */
export function Frame({ src, alt, caption, className = '', parallax }: { src: string; alt: string; caption?: string; className?: string; parallax?: boolean }) {
  return (
    <figure className={`frame ${className}`} data-r>
      <img src={src} alt={alt} loading="lazy" {...(parallax ? { 'data-px': '' } : {})} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
