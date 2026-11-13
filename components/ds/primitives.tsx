// Mustard Bio design system — marks.
//
// These are the only sanctioned way to draw a button, an eyebrow, a display
// title, a framed image, an illustration or an icon. Reach for one of these
// before writing markup; if none fits, the gap belongs here, not in a page.
import Link from '@/components/link';
import { Fragment, type ReactNode } from 'react';
import { ILLO, ICONS, type IlloKind } from '@/brand/brand';

export type { IlloKind };
export type IconName = keyof typeof ICONS;

export function Arrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

/** Split button: label block + arrow chip (slides on hover).
 *  `lime` and `light` are for dark grounds; `dark` is the light-ground default. */
export function Btn({ href, children, tone = 'dark' }: { href: string; children: ReactNode; tone?: 'dark' | 'light' | 'lime' }) {
  return <Link href={href} className={`btn btn-${tone}`}><span className="btn-l">{children}</span><span className="btn-a"><Arrow /></span></Link>;
}

/** Mono eyebrow with the lime "dose" square. `tone="d"` switches the text to
 *  sage for dark grounds; the square stays lime either way. */
export function Tag({ children, tone }: { children: ReactNode; tone?: 'd' }) {
  return <span className={`tag${tone ? ' tag-' + tone : ''}`}>{children}</span>;
}

/** Display title. The last line is muted — mint on dark grounds, --muted on
 *  light. Lines rise in on reveal. Pass the size as `className`: d-1, d-2, h-1. */
export function Title({ lines, as: As = 'h2', className = '' }: { lines: string[]; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <As className={`title ${className}`} data-r>
      {lines.map((l, i) => <Fragment key={i}>{i > 0 && ' '}<span className={`ln${i === lines.length - 1 && lines.length > 1 ? ' mute' : ''}`}><span style={{ transitionDelay: `${i * 90}ms` }}>{l}</span></span></Fragment>)}
    </As>
  );
}

/** Image in a rounded frame. Renders are served untouched — never resize or
 *  recompress them, and never swap in next/image. */
export function Frame({ src, alt, className = '', parallax }: { src: string; alt: string; className?: string; parallax?: boolean }) {
  return (
    <figure className={`frame ${className}`} data-r>
      <img src={src} alt={alt} loading="lazy" {...(parallax ? { 'data-px': '' } : {})} />
    </figure>
  );
}

/** An illustration from the brand pack (114 grid, 1px line), drawn in
 *  currentColor. Seven exist; do not draw an eighth here. */
export function Illo({ kind, className = '', label }: { kind: IlloKind; className?: string; label?: string }) {
  return (
    <svg className={`illo ${className}`} viewBox="0 0 114 114" fill="none" stroke="currentColor" strokeWidth="1" strokeMiterlimit="10"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} data-r dangerouslySetInnerHTML={{ __html: ILLO[kind]() }} />
  );
}

/** An icon from the brand's 24px set (1.25 stroke), drawn in currentColor.
 *  28 exist — capsule, tablet, flask, factory, chart, quality, network and so
 *  on. Pick one rather than drawing a new mark. */
export function Icon({ name, className = '', label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg className={`ds-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
  );
}

/** Secondary affordance: a mono, uppercase text link with a nudging arrow.
 *  Inherits currentColor, so it is legal on any ground — unlike Btn, whose
 *  tones are ground-specific. Use it beside a Btn, never instead of one. */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="ds-textlink"><span>{children}</span><Arrow /></Link>;
}
