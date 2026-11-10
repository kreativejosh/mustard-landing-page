import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import Link from '@/components/link';
import { HOME } from '@/lib/copy';
import { HeroCanvas } from '@/components/hero-canvas';
import { MaverickUI } from '@/components/maverick-ui';
import { CtaBand } from '@/components/cta-band';
import { Btn, Tag, Title, Frame, Rule, Arrow } from '@/components/ui';

export const metadata: Metadata = pageMetadata('home');

export default function Home() {
  const { hero, approach, businesses: b, start, build } = HOME;
  return (
    <>
      <JsonLd page="home" />
      {/* Hero: live glass-flow shader, title anchored low, scale rule as the baseline */}
      <section className="hero" data-page="/" data-dark="1">
        <div className="hero-bg"><img src="/assets/3d/flow-dark.jpg" alt="" /><HeroCanvas /></div>
        <div className="hero-in">
          <Title as="h1" lines={hero.title} className="d-1" />
          <div className="hero-side" data-r>
            <p className="hero-sub">{hero.sub}</p>
            <div className="ctas"><Btn href="#approach" tone="lime">{hero.primary}</Btn><Btn href="/about#contact" tone="light">{hero.secondary}</Btn></div>
          </div>
        </div>
        <div className="hero-ticks" aria-hidden="true">{Array.from({ length: 61 }, (_, i) => <i key={i} className={i === 30 ? 'dose' : i % 10 === 0 ? 'maj' : i % 5 === 0 ? 'mid' : undefined} />)}</div>
      </section>

      {/* Statement */}
      <section className="wrap statement">
        <div className="st-l"><Tag>Mustard Bio</Tag><Rule /></div>
        <div className="st-r">
          <p className="h-1" data-r>{hero.body[0]}</p>
          <p className="lead" data-r>{hero.body[1]}</p>
        </div>
      </section>

      {/* A new approach: sticky title, three measured statements */}
      <section className="wrap approach" id="approach">
        <div className="ap-l"><Tag>01 · Approach</Tag><h2 className="d-2" data-r>{approach.title}</h2></div>
        <ol className="ap-list">
          {approach.body.map((p, i) => (
            <li key={i} data-r className={i === 1 ? 'em' : undefined}><span className="num">0{i + 1}</span><p>{p}</p></li>
          ))}
        </ol>
      </section>

      {/* Two connected businesses */}
      <section className="wrap biz">
        <div className="biz-head"><Tag>02 · Mustard Bio</Tag><h2 className="d-2" data-r>{b.title}</h2></div>
        <div className="biz-grid">
          <Link href="/manufacturing" className="biz-card light" data-r>
            <div className="biz-img"><img src="/assets/render/asset-tablets.jpg" alt="Tablets and capsules" loading="lazy" /></div>
            <div className="biz-txt">
              <span className="k">A · Manufacturing</span>
              <h3 className="h-2">{b.manufacturing.title}</h3>
              {b.manufacturing.body.map((p, i) => <p key={i} className="body">{p}</p>)}
              <span className="more">Manufacturing <Arrow /></span>
            </div>
          </Link>
          <div className="biz-link" aria-hidden="true" data-r><i /><b /><i /></div>
          <Link href="/technology" className="biz-card dark" data-r>
            <div className="biz-img ui"><MaverickUI compact /></div>
            <div className="biz-txt">
              <span className="k">B · Technology</span>
              <h3 className="h-2">{b.intelligence.title}</h3>
              {b.intelligence.body.map((p, i) => <p key={i} className="body">{p}</p>)}
              <span className="more">Maverick OS <Arrow /></span>
            </div>
          </Link>
        </div>
        <p className="together h-2" data-r><span className="dot" />{b.together}</p>
      </section>

      {/* Starting with pharmaceuticals */}
      <section className="wrap start">
        <div className="start-txt">
          <Tag>03 · Ogun State, Nigeria</Tag>
          <h2 className="h-1" data-r>{start.title}</h2>
          {start.body.map((p, i) => <p key={i} className={i === 2 ? 'lead' : 'body'} data-r>{p}</p>)}
          <Btn href="/manufacturing">Manufacturing</Btn>
        </div>
        <Frame src="/assets/render/facility-facade.jpg" alt="Illustrative render of a Mustard Bio manufacturing facility" caption="Illustrative render" className="start-img" parallax />
      </section>

      <CtaBand cta={build.cta} href="/about#contact" />
    </>
  );
}
