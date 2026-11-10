import Link from '@/components/link';
import { NAV, TAGLINE, HOME, ABOUT } from '@/lib/copy';
import { Btn } from './ui';
import { FlowBand } from './illo';

/** Charcoal footer: tagline + CTA, page index, and the flow illustration as a full-width band. */
export function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-top">
        <div className="ftr-say">
          <p className="h-2">{TAGLINE}</p>
          <Btn href="/about#contact" tone="lime">{HOME.build.cta}</Btn>
        </div>
        <div className="ftr-cols">
          <div><span className="k">Pages</span>{NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}</div>
          <div><span className="k">Contact</span>{ABOUT.contact.topics.map((t) => <Link key={t} href="/about#contact">{t}</Link>)}</div>
        </div>
      </div>
      <FlowBand className="ftr-flow" />
      <div className="ftr-base">
        <img src="/assets/logo/primary-white-dose.svg" alt="Mustard Bio" width={200} height={34} />
        <span>© {new Date().getFullYear()} Mustard Bio</span>
      </div>
    </footer>
  );
}
