import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { ABOUT as A } from '@/lib/copy';
import { ContactForm } from '@/components/contact-form';
import { Tag, Title, Frame, Rule } from '@/components/ui';

export const metadata: Metadata = pageMetadata('about');

export default function About() {
  return (
    <>
      <JsonLd page="about" />
      <section className="phero wrap" data-page="/about" data-dark="0">
        <div className="phero-t"><Tag>About</Tag><Title as="h1" lines={A.hero.title} className="d-1" /></div>
        <div className="about-grid">
          <Frame src="/assets/render/asset-mark-light.jpg" alt="The Mustard Bio scale-rule mark as a glass sculpture" className="about-img" parallax />
          <div className="about-b">{A.hero.body.map((p, i) => <p key={i} className={i ? 'body' : 'h-2'} data-r>{p}</p>)}<Rule /></div>
        </div>
      </section>

      <section className="vision" id="vision">
        <div className="wrap vision-in">
          <Tag tone="d">Vision</Tag>
          <Title lines={A.vision.title} className="d-2" />
          <ol className="vgrid">
            {A.vision.body.map((p, i) => <li key={i} data-r style={{ transitionDelay: `${i * 80}ms` }}><span className="num">0{i + 1}</span><p>{p}</p></li>)}
          </ol>
          <p className="dest" data-r>{A.vision.destination}</p>
        </div>
      </section>

      <section className="wrap contact" id="contact">
        <div className="ct-l"><Tag>Contact</Tag><h2 className="sr-only">Contact Mustard Bio</h2><p className="h-1" data-r>{A.contact.body}</p></div>
        <div className="ct-r"><ContactForm /></div>
      </section>
    </>
  );
}
