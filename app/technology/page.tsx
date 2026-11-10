import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { TECHNOLOGY as T } from '@/lib/copy';
import { MaverickUI } from '@/components/maverick-ui';
import { CtaBand } from '@/components/cta-band';
import { Tag, Title, Btn } from '@/components/ui';

export const metadata: Metadata = pageMetadata('technology');

export default function Technology() {
  const stages = [
    { k: 'Next', t: T.next.title, b: T.next.body },
    { k: 'Longer term', t: T.going.title, b: T.going.body },
  ];
  return (
    <>
      <JsonLd page="technology" />
      <section className="thero" data-page="/technology" data-dark="1">
        <div className="thero-in wrap">
          <div className="thero-t">
            <Tag tone="d">Technology</Tag>
            <Title as="h1" lines={T.hero.title} className="d-1" />
            <p className="thero-sub" data-r>{T.hero.sub}</p>
            <p className="thero-b" data-r>{T.hero.body[0]}</p>
            <Btn href="/about?topic=technology#contact" tone="lime">{T.cta}</Btn>
          </div>
          <div className="thero-ui" data-r><MaverickUI /></div>
        </div>
      </section>

      <section className="wrap today">
        <div className="today-h"><Tag>01 · Demonstration</Tag><h2 className="d-2" data-r>{T.today.title}</h2><p className="lead" data-r>{T.today.body}</p></div>
        <ol className="flow-steps">
          {T.today.workflows.map((w, i) => <li key={w} data-r style={{ transitionDelay: `${i * 70}ms` }}><span className="num">{String(i + 1).padStart(2, '0')}</span><b>{w}</b></li>)}
        </ol>
        <aside className="note" data-r><span className="note-i" aria-hidden="true">i</span><p>{T.today.note}</p></aside>
      </section>

      <section className="wrap road">
        <div className="road-h"><Tag>02 · Roadmap</Tag><h2 className="sr-only">Maverick OS roadmap</h2></div>
        <ol className="road-l">
          {stages.map((s, i) => (
            <li key={s.k} data-r>
              <div className="road-k"><span className="dot" /><span className="k">{String(i + 1).padStart(2, '0')} · {s.k}</span></div>
              <div className="road-c"><h3 className="h-1">{s.t}</h3>{s.b.map((p, j) => <p key={j} className="body">{p}</p>)}</div>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand cta={T.cta} href="/about?topic=technology#contact" />
    </>
  );
}
