import { HOME } from '@/lib/copy';
import { Btn, Tag } from './ui';
import { Illo } from './illo';

/** Closing band on every page: "Build with us", audiences, and the page's own CTA. */
export function CtaBand({ cta, href }: { cta: string; href: string }) {
  return (
    <section className="band" data-r>
      <div className="band-in">
        <Tag tone="d">{HOME.build.title}</Tag>
        <p className="band-t">{HOME.build.body}</p>
        <ul className="aud">{HOME.build.audiences.map((a, i) => <li key={a} style={{ transitionDelay: `${i * 70}ms` }}><em>0{i + 1}</em>{a}</li>)}</ul>
        <div className="band-cta"><Btn href={href} tone="lime">{cta}</Btn><Illo kind="network" className="band-illo" /></div>
      </div>
    </section>
  );
}
