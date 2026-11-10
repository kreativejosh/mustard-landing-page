import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { MANUFACTURING as M } from '@/lib/copy';
import { CtaBand } from '@/components/cta-band';
import { Tag, Title, Frame } from '@/components/ui';

export const metadata: Metadata = pageMetadata('manufacturing');

const ICONS = {
  contract: <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="14" width="36" height="26" rx="2" /><path d="M6 22h36M16 14v-4h16v4M20 30h8" /></svg>,
  quality: <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5l15 6v11c0 10-6.5 17-15 21-8.5-4-15-11-15-21V11z" /><path d="M17 24l5 5 9-10" /></svg>,
};

export default function Manufacturing() {
  return (
    <>
      <JsonLd page="manufacturing" />
      <section className="phero wrap" data-page="/manufacturing" data-dark="0">
        <div className="phero-t"><Tag>Manufacturing</Tag><Title as="h1" lines={M.hero.title} className="d-1" /></div>
        <div className="phero-grid">
          <Frame src="/assets/render/facility-corridor.jpg" alt="A clean manufacturing corridor" className="phero-img" parallax />
          <div className="phero-b">{M.hero.body.map((p, i) => <p key={i} className={i ? 'body' : 'lead'} data-r>{p}</p>)}</div>
        </div>
        <dl className="facts">
          {M.facts.map((f, i) => (
            <div key={f.k} data-r style={{ transitionDelay: `${i * 80}ms` }}>
              <dt className="k">{f.k}</dt>
              <dd>{i === 1 ? <><span className="num-sm">Approximately</span><b className="num-xl">4,000</b><span className="num-sm">square feet</span></> : f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap focus">
        <div className="focus-img"><Frame src="/assets/render/asset-pack.jpg" alt="Cartons and blister packs" parallax /></div>
        <div className="focus-txt">
          <Tag>{M.blocks[0].eyebrow}</Tag>
          <h2 className="d-2" data-r>{M.blocks[0].title}</h2>
          {M.blocks[0].body.map((p, i) => <p key={i} className="lead" data-r>{p}</p>)}
          <ul className="forms" data-r>{['Tablets', 'Capsules'].map((x) => <li key={x}><span className="sq" />{x}</li>)}</ul>
        </div>
      </section>

      <section className="wrap duo">
        {M.blocks.slice(1).map((b, i) => (
          <article key={b.title} className="duo-c" data-r style={{ transitionDelay: `${i * 100}ms` }}>
            <span className="ico">{i ? ICONS.quality : ICONS.contract}</span>
            <h2 className="h-2">{b.title}</h2>
            {b.body.map((p, j) => <p key={j} className="body">{p}</p>)}
          </article>
        ))}
      </section>

      <section className="wrap evolve">
        <div className="ev-in">
          <div className="ev-t"><Tag tone="d">Maverick OS</Tag><h2 className="d-2" data-r>{M.evolve.title}</h2>{M.evolve.body.map((p, i) => <p key={i} className="lead" data-r>{p}</p>)}</div>
          <div className="loop" aria-hidden="true" data-r>
            <svg className="loop-svg" viewBox="0 0 400 260">
              <path className="loop-p" d="M110 130 C110 50 290 50 290 130 C290 210 110 210 110 130 Z" />
              <circle className="loop-dot" r="5"><animateMotion dur="7s" repeatCount="indefinite" path="M110 130 C110 50 290 50 290 130 C290 210 110 210 110 130 Z" /></circle>
            </svg>
            <span className="node n1">Manufacturing operations</span>
            <span className="node n2">Software systems</span>
          </div>
        </div>
      </section>

      <CtaBand cta={M.cta} href="/about?topic=manufacturing#contact" />
    </>
  );
}
