import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { CAREERS } from '@/lib/copy';
import { Section, Split, Col, Panel, IconList, Measure, Tag, Title, Btn, TextLink, Illo } from '@/components/ds';

export const metadata: Metadata = pageMetadata('careers');

export default function Careers() {
  const { hero, roles, general } = CAREERS;
  return (
    <>
      <JsonLd page="careers" />

      {/* Opening statement: the ask, not a job board */}
      <Section tone="lead-in">
        <Split ratio="wide">
          <Col><Tag>Careers</Tag><Illo kind="network" /></Col>
          <Col>
            <Title as="h1" lines={hero.title} className="d-2" />
            {hero.body.map((p, i) => <Measure key={i} size={i === 0 ? 'lead' : 'body'}>{p}</Measure>)}
            <div className="ctas">
              <Btn href="#roles">{hero.primary}</Btn>
              <TextLink href="/about?topic=careers#contact">{hero.secondary}</TextLink>
            </div>
          </Col>
        </Split>
      </Section>

      {/* The disciplines carry this page while there are no live vacancies */}
      <Section tone="ruled" id="roles">
        <Split>
          <Col sticky>
            <Tag>01 · Open roles</Tag>
            <Title lines={[roles.title]} className="d-2" />
            <Measure>{roles.lead}</Measure>
          </Col>
          <Col>
            <IconList items={roles.disciplines} />
            <Measure size="body">{roles.vacancies}</Measure>
          </Col>
        </Split>
      </Section>

      {/* Dark panel: the general application */}
      <Section>
        <Panel ground="on-charcoal">
          <Split ratio="even">
            <Col><Tag tone="d">02 · General applications</Tag><Title lines={general.title} className="d-2" /></Col>
            <Col>
              {general.body.map((p, i) => <Measure key={i} size={i === 0 ? 'lead' : 'body'}>{p}</Measure>)}
              <div className="ctas"><Btn href="/about?topic=careers#contact" tone="lime">{general.cta}</Btn></div>
            </Col>
          </Split>
        </Panel>
      </Section>
    </>
  );
}
