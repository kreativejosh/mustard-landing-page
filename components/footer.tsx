import Link from '@/components/link';
import { NAV, TAGLINE, HOME } from '@/lib/copy';
import { Btn } from './ui';

/** Charcoal footer: tagline + CTA, page index, and the scale rule stretched across the full width. */
export function Footer() {
  const h = [30, 100, 85, 70, 55, 40, 55, 70, 85, 100, 30];
  return (
    <footer className="ftr">
      <div className="ftr-top">
        <div className="ftr-say">
          <p className="h-2">{TAGLINE}</p>
          <Btn href="/about#contact" tone="lime">{HOME.build.cta}</Btn>
        </div>
        <div className="ftr-cols">
          <div><span className="k">Pages</span>{NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}</div>
          <div><span className="k">Contact</span><Link href="/about#contact">Partnerships</Link><Link href="/careers">Careers</Link></div>
        </div>
      </div>
      <div className="ftr-rule" aria-hidden="true" data-r>
        {h.map((p, i) => <i key={i} className={i === 5 ? 'dose' : undefined} style={{ height: `${p}%`, transitionDelay: `${Math.abs(i - 5) * 60}ms` }} />)}
      </div>
      <div className="ftr-base">
        <img src="/assets/logo/primary-white-dose.svg" alt="Mustard Bio" width={200} height={34} />
        <span>© {new Date().getFullYear()} Mustard Bio</span>
      </div>
    </footer>
  );
}
