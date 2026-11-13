---
name: mustard-design-system
description: The Mustard Bio design system — colour roles and which ground each may touch, type scale, spacing, radii, motion, the icon and illustration packs, and the component layer. Load before designing, building or reviewing any page, section, component or visual change in the Mustard Bio website, and before writing or editing any CSS here.
---

# The Mustard Bio design system

Values are synced from the brand repo into `brand/` and checksummed on every
build. **This file carries what the values cannot: when each is right, and when
it is wrong.** Token values live in `brand/tokens.css`; colour roles, the icon
set and the illustration pack live in `brand/brand.ts`.

Build pages by composing `components/ds/`. Verify with `npm run brand:check`.

---

## 1. Colour, and the ground rule

The single most broken rule in this system is not *which* colour, it is *what
it sits on*. Every colour below is listed with the ground it is legal on.

| Token | Hex | What it is | Legal ground |
|---|---|---|---|
| `--charcoal` | `#222F30` | Primary ink, dark surfaces, buttons | anywhere |
| `--deep` | `#445E5F` | Secondary dark, cards, 3D grounds | anywhere |
| `--sage` | `#C9CBBE` | Quiet labels, display second halves | **dark only** |
| `--lime` | `#A7E26E` | **The dose.** Tag square, accents | **dark only** |
| `--mint` | `#CEF79E` | Arrow tile, display mute on dark | **dark only** |
| `--off` | `#F7F7F5` | Default page surface | — |
| `--stone` | `#E7E8E1` | Feature cards, 3D floors | — |
| `--g1` `--g2` | `#EEEEEE` `#E4E3E3` | Bands, card frames, lines | — |
| `--ink` | `#222F30` | Body text | **light only** |
| `--ink-2` | `#4A5A5B` | Secondary text (7.23:1) | **light only** |
| `--ink-3` | `#66756F` | Tertiary text (4.84:1) | **light only** |
| `--muted` | `#7A8883` | Display mute on light (3.70:1) | **light only** |

**Lime and mint are never text on a light ground.** The brand's own tested
pairs in `brand/brand.ts` (`PAIRS`) list lime-on-white as *"Never for text"*.
**Sage is never anything on a light ground** — it reads 1.4:1 on off-white.

On dark grounds the site's convention is: `--mint` for display mute (see
`.hero .title .mute`), `--sage` for quiet labels (see `.ftr-cols .k`),
`--lime` for the dose square and accents, white for body.

### Where the site deliberately differs from the brand

Recorded in the `DEVIATIONS` block of `app/globals.css`. Do not "fix" these
back without reading the reasons.

- **The text ramp runs darker.** The brand's `--mb-text-2` is 5.56:1 and
  `--mb-text-3` is 3.30:1 — the latter fails AA for 17px body copy.
- **`--muted` has no brand equivalent.** The brand assigns display-mute to sage,
  then forbids sage on light, and offers no alternative. This is a **gap in the
  brand**; push a token upstream rather than widening the deviation.
- **`--danger` has no brand equivalent either.** The brand defines no error
  colour at all.
- **The radius scale is tighter** than the brand's 6/10/16/24.

### SITE SHADES

`--hover-charcoal`, `--hover-lime`, `--ground-hero`, `--ground-media`,
`--ground-glow-1/2`, `--panel-ui`, `--skeleton`, `--skeleton-dim`, `--danger`.
Off-palette values the site needed and the brand does not have. They are named
so they stay countable. **Adding one is a decision to record, not a shortcut** —
prefer an existing token, and raise the gap against the brand.

---

## 2. Type

Sizes are fluid here, against the brand's fixed px scale — a recorded deviation,
because fixed 112px display breaks small screens.

| Class | Size | Use |
|---|---|---|
| `.d-1` | clamp(44, 6.4vw, 104) | Page-opening display, one per page |
| `.d-2` | clamp(34, 4.4vw, 68) | Section display |
| `.h-1` | clamp(28, 2.9vw, 44) | Statement headings |
| `.h-2` | clamp(22, 2vw, 30) | Sub-headings |
| `.lead` | clamp(19, 1.45vw, 22) | Introductory text, capped 58ch |
| `.body` | 17px | Reading text, capped 62ch |
| `.k` / `.tag` | 12px mono, uppercase, .07em | Eyebrows and labels |

IBM Plex Sans throughout; IBM Plex Mono for labels, numbers and anything
technical. Display text is tracked tight (−.03em and under); mono labels are
tracked loose (+.06em). Never set body copy in mono.

`<Title>` splits a display line so the **last line is muted** — mint on dark,
`--muted` on light. That two-tone display is a signature of the identity; use
it for page and section openers rather than a flat heading.

---

## 3. Space, radius, motion

- **Space scale** `--sp-1..7` = 10 / 20 / 30 / 50 / 70 / 90 / 140px, mirroring
  the brand's `--mb-space`. `brand:check` asserts they still match.
- **Radii** `--r1..5` = 4 / 6 / 8 / 10 / 12px. `--r5` is the hero/panel radius.
  Never write a literal radius; 1–2px hairlines on chart bars and dots are the
  only exception.
- **Motion** `--dur-1..4` = 200 / 400 / 800 / 1200ms, easing `--ease`
  (`cubic-bezier(.16,1,.3,1)`, expo-out) for entrances and UI, `--ease-io` for
  loops. 21 older durations are off this scale and capped by a budget in
  `brand:check` — do not add more.
- Everything must survive `prefers-reduced-motion: reduce`, which the stylesheet
  already honours globally.

Reveal on scroll is `data-r` on an element, which the reveal observer switches
to `.in`. `<Title>`, `<Measure>`, `<Frame>` and `<Illo>` set it for you.

---

## 4. The packs: use them, do not draw

- **28 icons**, 24px, 1.25 stroke, in `brand/brand.ts` `ICONS`. Draw with
  `<Icon name="…" />`. Names: capsule, tablet, blister, flask, vial, scale,
  carton, batch, line, sensor, chart, quality, automation, temperature,
  pressure, factory, chip, network, document, shipping, global, time, access,
  person, check, alert, arrow-right, arrow-out.
- **7 illustrations**, 114 grid, 1px line, generative, in `ILLO`. Draw with
  `<Illo kind="…" />`. Kinds: dose, capsules, lattice, scale, flow, network,
  layers.

If a mark you need is missing, add it **to the brand repo's pack**, then bump
the SHA. Drawing a one-off SVG in a page is how the pack stops being the pack.

---

## 5. The component layer

```
Section   page section: max width, gutters, rhythm. tone="lead-in" | "ruled"
Split     two columns. ratio="wide" (1:2.4) | "even" | default (1:1.25)
Col       column inside a Split. sticky pins it beside a scrolling neighbour
Panel     coloured surface; ground sets the ink. on-charcoal|on-deep|on-stone|on-off
NumberedList  the numbered-statement list; emphasis={n} promotes one item
Measure   capped text run. size="lead" | "body"
Title     two-tone display title (last line muted)
Tag       mono eyebrow with the lime dose square. tone="d" on dark
Btn       split button. tone="dark" (light grounds) | "lime" | "light" (dark grounds)
Frame     image in a rounded frame — never next/image, never recompressed
Illo      illustration from the pack
Icon      icon from the pack
```

**A new page should need no new CSS.** If it seems to, the pattern belongs in
`components/ds/`, not in `app/globals.css`. The per-section classes already in
the stylesheet (`.st-*`, `.ap-*`, `.biz-*`, `.ev-*`, `.mos-*`) predate this
layer and are not a model to copy.

---

## 6. Checking

```bash
npm run brand:check    # ground rules, raw colour, radii, motion budget, contrast
npm run brand:verify   # brand files unmodified
```

`brand:check` messages explain the rule and the fix. If one looks wrong, the
ground detection may genuinely not know a surface — read
`scripts/brand-check.mjs` before suppressing anything. Its first version used a
hand-kept list of "dark" selectors and produced five false positives; it now
reads grounds from the stylesheet and stays silent when it cannot tell.

Full reasoning and build history: `docs/design-system-binding.md`.
