// Mustard Bio design system — layout.
//
// A new page is COMPOSED from these, not styled. If you find yourself adding a
// class to app/globals.css to lay a page out, stop: either a component here
// already does it, or the pattern belongs here so the next page gets it too.
import type { ReactNode } from 'react';
import { Icon, type IconName } from './primitives';

/** A page section: max width, page gutters, vertical rhythm.
 *  `lead-in` is the taller opening rhythm; `ruled` adds the hairline divider
 *  the site uses between sections. */
export function Section({ children, id, tone, className = '' }: {
  children: ReactNode; id?: string; tone?: 'lead-in' | 'ruled' | 'lead-in ruled'; className?: string;
}) {
  return <section id={id} className={`wrap ds-section ${tone ?? ''} ${className}`.trim()}>{children}</section>;
}

/** Two columns. `default` is the 1 : 1.25 reading split, `wide` the 1 : 2.4
 *  statement split, `even` a 1 : 1. Collapses to one column under 880px. */
export function Split({ children, ratio, className = '' }: {
  children: ReactNode; ratio?: 'wide' | 'even'; className?: string;
}) {
  return <div className={`ds-split ${ratio ?? ''} ${className}`.trim()}>{children}</div>;
}

/** A column inside a Split. `sticky` pins it beside a scrolling neighbour,
 *  which is how the site's section titles behave. */
export function Col({ children, sticky, className = '' }: { children: ReactNode; sticky?: boolean; className?: string }) {
  return <div className={`ds-col ${sticky ? 'sticky' : ''} ${className}`.trim()}>{children}</div>;
}

/** A coloured surface. The ground sets the ink automatically, which is the
 *  whole point: `on-charcoal` and `on-deep` carry white text and let lime,
 *  mint and sage be used; the light grounds carry --ink and must not. */
export function Panel({ children, ground = 'on-stone', className = '' }: {
  children: ReactNode; ground?: 'on-charcoal' | 'on-deep' | 'on-stone' | 'on-off'; className?: string;
}) {
  return <div className={`ds-panel ${ground} ${className}`.trim()}>{children}</div>;
}

/** The site's numbered-statement list. Pass `emphasis` to promote one item to
 *  display size with the lime dose beside its number. */
export function NumberedList({ items, emphasis, className = '' }: {
  items: string[]; emphasis?: number; className?: string;
}) {
  return (
    <ol className={`ds-nlist ${className}`.trim()}>
      {items.map((p, i) => (
        <li key={i} data-r className={i === emphasis ? 'em' : undefined} style={{ transitionDelay: `${i * 80}ms` }}>
          <span className="num">{String(i + 1).padStart(2, '0')}</span><p>{p}</p>
        </li>
      ))}
    </ol>
  );
}

/** Caps a run of text at a comfortable measure. `lead` is the larger
 *  introductory size (58ch), `body` the reading size (62ch). */
export function Measure({ children, size = 'body', className = '' }: {
  children: ReactNode; size?: 'lead' | 'body'; className?: string;
}) {
  return <p className={`${size} ${className}`.trim()} data-r>{children}</p>;
}

/** A list of labelled items, each carrying an icon from the brand pack. Used
 *  for disciplines, capabilities, service lines — anywhere a set of short
 *  labels needs more presence than a bullet list and less than a NumberedList.
 *  The icon inherits currentColor, so this works on light and dark grounds. */
export function IconList({ items, className = '' }: {
  items: ReadonlyArray<{ readonly icon: IconName; readonly label: string }>; className?: string;
}) {
  return (
    <ul className={`ds-iconlist ${className}`.trim()}>
      {items.map((it, i) => (
        <li key={it.label} data-r style={{ transitionDelay: `${i * 70}ms` }}>
          <Icon name={it.icon} /><span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}
