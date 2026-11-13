# Recipes

Worked compositions for the Mustard Bio website. **Copy one rather than
starting from a blank file.** Every recipe here is built only from
`components/ds/` and needs no new CSS.

Rules behind these: `.claude/skills/mustard-design-system/SKILL.md`.
Check your work with `npm run brand:check`.

---

## 0. A whole page with no new CSS

This exact composition was built and verified against the real build on
2026-11-13: every class it emits is defined in `app/globals.css`, and no class
was added for it.

```tsx
import { Section, Split, Col, Panel, NumberedList, Measure, Tag, Title, Btn, Illo, Icon } from '@/components/ds';

export default function Example() {
  return (
    <>
      <Section tone="lead-in">
        <Split ratio="wide">
          <Col><Tag>Mustard Bio</Tag><Illo kind="layers" /></Col>
          <Col>
            <Title lines={['Composed entirely from', 'the design system.']} className="h-1" />
            <Measure size="lead">No new CSS class was written for this page.</Measure>
          </Col>
        </Split>
      </Section>

      <Section tone="ruled" id="approach">
        <Split>
          <Col sticky><Tag>01 · Approach</Tag><Title lines={['A new approach']} className="d-2" /></Col>
          <NumberedList emphasis={1} items={[
            'First statement in the list.',
            'The emphasised one carries the lime dose.',
            'And a third to close.',
          ]} />
        </Split>
      </Section>

      <Section>
        <Panel ground="on-charcoal">
          <Tag tone="d">On a dark ground</Tag>
          <Measure size="lead">Lime and mint are legal here, and only here.</Measure>
          <Btn href="/" tone="lime">Primary action</Btn>
          <Icon name="factory" label="Factory" />
        </Panel>
      </Section>
    </>
  );
}
```

---

## 1. Opening statement

The tall lead-in rhythm, an illustration on the narrow side, a two-tone display
title on the wide side.

```tsx
<Section tone="lead-in">
  <Split ratio="wide">
    <Col><Tag>Mustard Bio</Tag><Illo kind="layers" /></Col>
    <Col>
      <Title lines={['First line in ink,', 'second line muted.']} className="h-1" />
      <Measure size="lead">One paragraph of introductory text.</Measure>
    </Col>
  </Split>
</Section>
```

`Title` mutes the **last** line automatically. Pass one line and nothing mutes.

---

## 2. Sticky section title beside a list

The title pins while the statements scroll past it.

```tsx
<Section tone="ruled" id="approach">
  <Split>
    <Col sticky><Tag>01 · Approach</Tag><Title lines={['A new approach']} className="d-2" /></Col>
    <NumberedList emphasis={1} items={['First.', 'Second, emphasised.', 'Third.']} />
  </Split>
</Section>
```

`emphasis` promotes one item to display size and puts the lime dose beside its
number. Use it on the statement that carries the argument — at most one.

---

## 3. A dark panel

The only place lime, mint and sage are legal.

```tsx
<Section>
  <Panel ground="on-charcoal">
    <Tag tone="d">Label</Tag>
    <Title lines={['Something worth', 'saying on dark.']} className="d-2" />
    <Measure size="lead">Body text on dark is white; sage is for quiet labels.</Measure>
    <Btn href="/about#contact" tone="lime">Partner with us</Btn>
  </Panel>
</Section>
```

`tone="d"` on `Tag` switches its text to sage. `tone="lime"` on `Btn` is for
dark grounds; use the default `dark` tone on light ones.

---

## 4. Image beside text

```tsx
<Section tone="ruled">
  <Split ratio="even">
    <Col>
      <Tag>02 · Manufacturing</Tag>
      <Title lines={['A heading']} className="d-2" />
      <Measure>Reading text, capped at 62ch automatically.</Measure>
    </Col>
    <Col><Frame src="/assets/render/facility-facade.jpg" alt="Describe what is shown" /></Col>
  </Split>
</Section>
```

Never swap `Frame` for `next/image`: the renders are served exactly as produced.
Always write real alt text — every image on this site has it.

---

## 5. Adding a page

1. Compose it from `components/ds/` using the recipes above.
2. Add the key to `PAGES` in `lib/seo.ts`.
3. `export const metadata = pageMetadata('<key>')`.
4. Render `<JsonLd page="<key>" />` as the first child.
5. Put the copy in `content/website-copy.md` and read it through `lib/copy.ts` —
   never inline a sentence in the page.
6. `npm run brand:check && npm run build`.

---

## What does not belong in a recipe

Art-directed one-offs — the hero shader, the metaball loop, the dashboard
illustration — are the brand's expression layer, not its component layer. They
live in their own components (`hero-canvas`, `motion-bg`, `dashboard-illo`) and
are deliberately bespoke. Do not generalise them into `ds/`, and do not copy
their CSS as a starting point for ordinary sections.

---

## 6. The Careers page (built 2026-11-13)

`app/careers/page.tsx` is the first page built entirely through this system and
is worth reading as a worked example. Three structural choices in it:

- **The disciplines carry the page, because there are no vacancies.** The copy
  says vacancies "will be listed here as they become available", so Open Roles
  is an empty state. Rather than apologise for it, the five disciplines are
  given the weight, each with an icon from the brand pack, and the empty-state
  line sits quietly beneath them in body text — not in `.k`, whose uppercase
  would shout a full sentence.
- **`CtaBand` is deliberately omitted.** Its audiences are pharmaceutical
  companies, technical partners, equipment providers and investors. Asking a job
  applicant to "Start a Conversation" about partnerships is the wrong close, so
  the page ends on its own dark General Applications panel instead.
- **The secondary CTA is a `TextLink`, not a `Btn`.** `btn-light` is white on
  translucent white and only works on dark grounds; on this light section it
  would have been invisible. `TextLink` inherits currentColor and is legal
  anywhere.

Two components were added to `ds/` while building it rather than styling the
page directly — `IconList` and `TextLink` — which is the intended way for this
layer to grow.
