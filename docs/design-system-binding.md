# Binding this site to the Mustard Bio design system

How `mustard-landing-page` consumes `mustard-bio-brand`, why it is built this
way, and what has to be true for any future page or UI change to be on-brand
without anyone having to ask for it.

Status: **All six phases built and green (2026-11-13).** See §10 for what
shipped, how the plan changed on contact, and what is deliberately left undone.

---

## 1. The problem this solves

This repo is a detached fork of `mustard-bio-brand/site/`. In the brand repo
that folder was a monorepo sibling of `identity/`, and it had a real pipeline:
`scripts/sync-assets.mjs` ran on `predev` and `prebuild`, `verify-assets.mjs`
checksummed the result on `postbuild`. Forking it out broke the relative path
`../identity`, so the pipeline was dropped rather than reworked.

What replaced it was convention. `content/brand-tokens.css` is a byte-identical
copy of the brand's `design-system/tokens.css` that **nothing imports**.
`lib/brand/illustrations.ts` carries a header comment saying "Copy changes from
there". Both are honest attempts at a rule, and neither is a mechanism.

Current state, measured 2026-11-12 against brand `main`:

- **Assets: clean.** All 21 files in `public/assets/` plus the 4 fonts in
  `assets/fonts/` are byte-identical to `identity/assets/`. `lib/brand/scenes.js`
  is byte-identical to `identity/render/scenes.js`. Nothing enforces this.
- **Tokens: drifted.** `app/globals.css` re-declares its own set under its own
  names, with some values changed (table in §4).
- **Judgment: absent.** `CLAUDE.md` gives the design system one line — four hex
  codes. Nothing about the type scale, radii, spacing, motion, the icon set, the
  illustration pack, or which colour may touch which ground.

That last point is the operative one. The reason UI work needs re-prompting is
not that the tokens are stale. It is that the rules were never written down
anywhere the agent reads.

---

## 2. What the brand repo actually provides

`mustard-bio-brand` is 223MB, but the system proper is small and scattered. Only
~3.9MB of it is relevant to a website.

| Layer | Location | State |
|---|---|---|
| Tokens | `design-system/tokens.css`, `tokens.json` | Complete: colour, type, radius, space, motion |
| Colour roles + WCAG pairs | `web/lib/brand.ts` → `COLOURS`, `PAIRS` | Usage strings + 12 tested pairs |
| Icon set (28, 24px, 1.25 stroke) | `web/lib/brand.ts` → `ICONS` | Real, inline SVG markup |
| Illustration pack (7, 114 grid, 1px) | `web/lib/brand.ts` → `ILLO`, `identity/assets/illustrations/` | Generative |
| Motion curves | `web/lib/brand.ts` → `CURVES` | 4 named curves + durations |
| Logo artwork | `identity/assets/logo/` (12 SVGs) | Fixed. Never redraw |
| Renders, motion, fonts | `identity/assets/` | Byte-exact, never recompress |
| Rules and permitted claims | `CLAUDE.md`, `brief/brief.md`, `brief/website-copy.md` | Authoritative |
| **Components** | `web/components/sections/07-components.tsx` | **Documentation only — no reusable code exists** |

The last row is the most important fact in this table. The brand repo documents
its components by rendering examples of them. It does not ship them. Any
component layer has to be built, and the only question is where it lives
(ADR-002).

---

## 3. Design: four layers, not one

A sync pipeline transfers values. Drift does not happen at the value layer, so a
pipeline alone does not stop it.

Three rules that are true in the brand today and that **no CSS variable can
express**:

- Lime `#A7E26E` is "the dose" — accents on **dark grounds only**.
- Sage `#C9CBBE` is for display second-halves at 48px+ and quiet grounds. The
  brand's `CLAUDE.md` states: *never sage on light grounds*.
- `web/lib/brand.ts` `PAIRS` lists lime-on-white explicitly as **"Never for text"**.

`var(--mb-lime)` will render lime text on white without complaint. A perfect
token sync therefore yields a site that is technically on-brand and actually
wrong. So the binding is built in four layers:

| Layer | Answers | Mechanism | Drift caught by |
|---|---|---|---|
| **Values** | What is lime? | `scripts/sync-brand.mjs`, pinned SHA | checksum manifest |
| **Composition** | How do I build a section? | `components/ds/` | the correct thing is the only easy thing |
| **Constraints** | Is this allowed? | `npm run brand:check` | build failure |
| **Judgment** | Why? When not? | `CLAUDE.md` + `.claude/skills/mustard-design-system/` | the agent reading it |

### The root cause is the open authoring surface

`app/page.tsx` hand-writes `<section className="wrap statement">`, and
`globals.css` carries ~380 lines of one-off per-section CSS — `.st-l`, `.ap-list`,
`.biz-*`, `.ev-t`, `.today-h` and so on. Every new page means new bespoke CSS,
which is a fresh drift surface that no amount of token syncing closes.

The site already has the seed of a primitives layer in `components/ui.tsx`
(`Btn`, `Tag`, `Title`, `Frame`, `Arrow`) and `components/illo.tsx` (`Illo`).
What is missing is the tier above it: section, grid, panel, measure. Phase 3
builds that tier. After it exists, a new page is **composed**, not styled, and
drift stops being possible rather than being policed.

### The error message is the teacher

A generic CSS linter says `no-hex-literals`. That teaches nothing and gets
suppressed. The checker in Phase 2 must speak the brand's own vocabulary:

```
app/globals.css:214  raw hex #A7E26E
  This is --mb-lime, "the dose".
  brand PAIRS marks lime-on-light as "Never for text" — it is an accent on
  dark grounds only. Use var(--lime) on a charcoal or deepsea ground, or
  var(--ink) for text here.
```

That message is itself a unit of the design system. It is how the constraint
layer feeds the judgment layer during a session, rather than only in CI after
the fact.

---

## 4. Token reconciliation: layered, with recorded deviations

**Decision taken:** brand tokens become an imported base layer under canonical
names. The site layer may only *derive* from them. Genuine deviations move into
one `DEVIATIONS` block with a stated reason, which `brand:check` allow-lists.
Nothing changes visually today; every future divergence becomes visible.

Measured drift as of 2026-11-12:

| Concern | Brand | Site | Verdict |
|---|---|---|---|
| charcoal, sage, lime, mint, stone, white | `#222F30` … | same values, renamed (`--mb-charcoal` → `--charcoal`) | rename only |
| deepsea / offwhite / gray-1 / gray-2 | `#445E5F` `#F7F7F5` `#EEEEEE` `#E4E3E3` | `--deep` `--off` `--g1` `--g2`/`--line` | rename only |
| secondary text | `--mb-text-2` `#5C6B6C` (5.56:1 on white) | `--ink-2` `#4A5A5B` (7.23:1) | **deviation** — site runs higher contrast |
| tertiary text | `--mb-text-3` `#8B8F86` (3.30:1) | `--ink-3` `#66756F` (4.84:1) | **deviation** — site clears AA for body |
| `--muted` `#7A8883` (3.70:1) | *does not exist in brand* | used for display mute | **deviation** — needs a brand token or removal |
| radii | 6 / 10 / 16 / 24 | 4 / 6 / 8 / 10 / 12 | **scale conflict** — different system, not a tweak |
| type scale | fixed px: 112 / 72 / 48 / 32 / 22 / 17 / 13 | fluid `clamp()`, maxima 104 / 68 / 44 / 30 | **different model** |
| tracking | `-0.03em` display | `-.035em` on `.d-1`, `-.03em` on `.d-2` | partial |
| ease | `cubic-bezier(.16,1,.3,1)` | identical | aligned |
| durations | `--mb-dur-1..4` = 200/400/800/1200 | **absent** — hardcoded `.3s`, `.9s`, `1.1s`, `.45s` | missing |
| space scale | `10 20 30 50 70 90 140` | **absent** — ad hoc throughout | missing |

Three-way naming conflict to resolve first: `design-system/tokens.css` uses
`--mb-*`; `web/lib/brand.ts` uses bare `--charcoal`; this site uses
`--charcoal`/`--ink`. **The brand repo contradicts its own tokens file.** This
plan treats `--mb-*` as canonical (it is the file named `design-system/`) and
works around the contradiction rather than fixing it here — see ADR-003.

Target shape for `app/globals.css`:

```css
@import '../brand/tokens.css';   /* fetched, pinned, never hand-edited */

:root {
  /* site layer — derivation only, no literals */
  --charcoal: var(--mb-charcoal);
  --lime:     var(--mb-lime);
  --r2:       var(--mb-radius-1);
  --dur-ui:   var(--mb-dur-1);

  /* DEVIATIONS — each needs a reason; brand:check allow-lists exactly these */
  --ink-2: #4A5A5B;  /* brand --mb-text-2 is 5.56:1; site body needs AAA on white */
  --ink-3: #66756F;  /* brand --mb-text-3 is 3.30:1, below AA for 17px body */
  --r1:    4px;      /* site runs a tighter radius scale than the brand's 6/10/16/24 */
}
```

---

## 5. Sync: pinned fetch

**Decision taken:** a pinned fetch script, not a submodule and not an npm
package. The brand repo is 223MB (61MB stationery, 20MB renders) against the
3.9MB this site needs, so a submodule taxes every clone and CI run for nothing.
An npm package is cleaner long-term but requires restructuring the brand repo
before anything can land here.

```
scripts/
  brand.manifest.json   pinned SHA + file list + sha256 of every file
  sync-brand.mjs        fetch exactly the manifest from that SHA → brand/ + public/assets/
  verify-brand.mjs      re-hash on disk, fail on any mismatch
```

- `brand/` holds `tokens.css`, `scenes.js` and `brand.ts`. The last is the brand's
  `web/lib/brand.ts` fetched **verbatim** rather than extracted into a
  `brand-data.json`, as first planned: it is self-contained TypeScript with no
  imports, so copying it whole avoids writing and maintaining a TS parser, and it
  brings `COLOURS`, `PAIRS`, `ICONS`, `ILLO` and `CURVES` across in one file —
  exactly what Phases 2–4 need.
- `public/assets/` keeps the 21 files it already has, plus `assets/fonts/`.
- These stay **committed, but generated and checksummed**. This is a deliberate
  departure from the brand repo, which git-ignores `web/public/assets`. That repo
  could afford to, because `../identity` was always on disk next to it. Here the
  source is a network fetch, and this site deploys from GitHub via Vercel, so
  git-ignoring them would make every production build depend on github.com being
  up and the brand repo staying public. Committed bytes keep builds hermetic;
  `verify-brand` still makes a hand-edit impossible to ship.
- Upgrading the brand is one SHA bump in the manifest. The diff shows exactly
  what changed. A surprise change fails `verify`.

This is deliberately the same idiom the brand repo's own `site/` already used,
so it will read as familiar to anyone who knows that repo.

---

## 6. Build phases

### Phase 0 — Ground truth (~half a day)

Pin and verify what is already correct, before changing anything.

1. Write `scripts/brand.manifest.json` pinning the current brand `main` SHA, the
   21 assets, 4 fonts, `tokens.css`, `scenes.js`, `illustrations.ts`, and a
   `brand-data.json` extracted from `web/lib/brand.ts`.
2. Write `sync-brand.mjs` (sparse fetch at that SHA) and `verify-brand.mjs`
   (sha256 compare).
3. Wire `presync`/`predev`/`prebuild`/`postbuild` in `package.json`.
4. Git-ignore `brand/` and `public/assets/`; delete the vendored copies.
5. **Delete `content/brand-tokens.css`** — the dead copy. Its replacement is
   `brand/tokens.css`, which is actually imported.

**Done when** `npm run build` fetches, verifies, and produces a byte-identical
`out/` to today's.

### Phase 1 — Token binding (~1 day)

1. `@import` the fetched `brand/tokens.css` at the top of `globals.css`.
2. Rewrite the `:root` block as derivations (§4 target shape).
3. Move the three real deviations into the `DEVIATIONS` block with reasons.
4. Add the missing layers: duration tokens from `--mb-dur-*`, and a space scale
   from `--mb-space`. Replace the hardcoded `.3s`/`.9s`/`1.1s` transitions.
5. Decide `--muted`: either derive it from a brand token or retire it.

**Done when** `globals.css` `:root` contains no colour literal outside
`DEVIATIONS`, and the rendered site is pixel-identical.

### Phase 2 — Constraint layer (~1 day)

`scripts/brand-check.mjs`, exposed as `npm run brand:check`. Rules, each with a
message written in the brand's vocabulary (§3):

| Rule | Catches |
|---|---|
| no raw colour in any rule | the `#F4F6F5`, `#3a564f`, `#1c2b24` literals that were in `globals.css` |
| lime / mint only on dark grounds | the "Never for text" pair |
| no sage on light grounds | the brand's explicit prohibition |
| radii must be on-scale | ad-hoc `border-radius` values |
| durations must be token-derived | hardcoded `ms`/`s` |
| body text ≥ 4.5:1 on its ground | contrast regressions, computed not asserted |
| logo SVGs unmodified | checksum against the manifest |
| `images.unoptimized` still true | recompressed renders |

Seed it with the known-good allow-list so it passes on day one; every new
violation is then genuinely new.

### Phase 3 — Composition layer (~2–3 days, highest leverage)

Extract `components/ds/` so pages are composed rather than styled.

- Promote `Btn`, `Tag`, `Title`, `Frame`, `Arrow`, `Illo` out of `ui.tsx` into
  `components/ds/`.
- Add the missing section tier, read out of the patterns already in
  `globals.css`: `Section` (wrap + gutter + rhythm), `Split` (the `st-l`/`st-r`,
  `ap-l`/`ap-list`, `ev-t` two-column pattern), `Panel` (charcoal/stone/offwhite
  grounds with correct ink), `NumberedList` (the approach pattern),
  `Measure` (the `58ch`/`62ch` caps).
- Add `Icon` backed by the brand's 26-icon set — currently unused by this site
  and therefore a standing invitation to draw new ones.
- Collapse the per-section CSS these replace.

**Explicit non-goal:** art-directed one-offs (`hero-canvas`, `motion-bg`,
`dashboard-illo`, the metaball blend) stay bespoke. They are the brand's
expression layer, not its component layer. `brand:check` must allow-list them or
it will generate noise and get ignored.

**Done when** a new page can be built without writing a new CSS class.

### Phase 4 — Judgment layer (~1 day, this is the part you asked for)

1. **Rewrite `CLAUDE.md`** so it carries standing rules, not four hex codes:
   token discipline, where values come from, never hand-edit `brand/`, the
   ground rules for lime/sage/mint, compose from `components/ds/` before writing
   CSS, run `brand:check` before claiming done, and an instruction to load the
   skill below before any UI work.
2. **Build `.claude/skills/mustard-design-system/SKILL.md`** — the detailed
   reference CLAUDE.md points at. Colour roles with their "when not to", the
   type scale and why it is fluid here, the radius and space scales, motion
   curves and when each applies, the icon and illustration packs with their
   grids, and the logo rules.
3. **Add `docs/recipes.md`** — worked, copy-pasteable compositions for the
   section patterns this site actually uses. Recipes beat prose: an agent
   reproduces a worked example far more faithfully than it follows a rule.

The division of labour matters. `CLAUDE.md` is loaded every session, so it holds
only what must always be true and must stay short. The skill holds the depth and
is loaded on demand. Recipes carry the muscle memory.

### Phase 5 — Feedback loop (~half a day)

1. Add `brand:check` and `verify-brand` to `.github/workflows/ci.yml`, alongside
   the existing lint / tsc / audit / build steps.
2. Decide on a `PreToolUse` hook in `.claude/settings.json` that re-injects token
   rules on every `.css`/`.tsx` edit. **Recommendation: do not add it yet.** With
   Phases 3 and 4 in place it is largely redundant, and it fires on every single
   edit. Revisit only if drift still shows up in review.

---

## 7. Decisions

### ADR-001: Pinned fetch over submodule or package

**Status:** Accepted.
**Context:** Brand is a separate 223MB repo; the site needs 3.9MB of it. The
original pipeline assumed a monorepo path that no longer exists.
**Decision:** Fetch a manifest of named files at a pinned SHA; checksum on build.
**Consequences:** Clones and CI stay small; upgrades are an explicit, reviewable
SHA bump; a surprise brand change fails the build. Costs: network access at build
time (mitigated by committing the manifest and caching), and the manifest must be
edited by hand when the site starts using a new asset.

### ADR-002: The component layer lives in the site, for now

**Status:** Accepted.
**Context:** The brand repo documents components but ships none. Something has to
own them.
**Decision:** Build `components/ds/` here. Treat it as the prototype for a layer
that may later be promoted into the brand repo.
**Consequences:** Unblocks immediately and the components stay shaped by real
use. Cost: a second consumer of the brand would have to copy or wait for the
promotion. Revisit when a second consumer appears.

### ADR-003: `--mb-*` is canonical; the brand's internal conflict is not fixed here

**Status:** Accepted.
**Context:** `design-system/tokens.css` uses `--mb-*`, `web/lib/brand.ts` uses
bare `--charcoal`. The brand repo contradicts itself.
**Decision:** Treat `--mb-*` as canonical. The site maps to it. Do not change the
brand repo as part of this work.
**Consequences:** This site is unblocked without a cross-repo PR. Cost: the
contradiction persists upstream, and `brand-data.json` extraction must normalise
`brand.ts`'s bare names on the way in. A follow-up PR to the brand repo should
settle it properly.

---

## 8. What this plan does not do

Recorded deliberately so none of it is assumed covered.

- **Does not fix the brand repo.** The `--mb-*` vs `--charcoal` contradiction
  (ADR-003) stays. So does the fact that the brand ships no component code
  (ADR-002). Both want upstream PRs that are out of scope here.
- **Does not resolve the token deviations in the brand's favour.** The layered
  model makes them *visible and reasoned*; it does not adjudicate them. The
  radius scales genuinely conflict (6/10/16/24 vs 4/6/8/10/12) and one of the two
  is eventually wrong. That is a design call, not an engineering one.
- **Does not change anything visually.** Phases 0–2 are pixel-neutral by design.
  If a Phase 1 derivation changes a rendered value, that is a bug, not progress.
- **Does not cover the 61MB stationery set, 20MB of renders, Blender scenes, or
  print artwork.** Out of scope for a website.
- **Does not add the blocking hook** (Phase 5 recommends against it for now).
- **Does not cover art-directed sections.** `hero-canvas`, `motion-bg`,
  `dashboard-illo` and the metaball blend stay bespoke and must be allow-listed,
  or the checker becomes noise.
- **No build verification was possible during assessment** — `node_modules` is
  not installed in this repo, so `tsc --noEmit` could not run. Phase 0 should
  start with `npm ci` and a clean baseline build.

## 9. Correction to the initial assessment

The first framing of this work called it a *sync* problem. That was the wrong
emphasis. Assets are already byte-identical and have not drifted at all; the
sync script mostly protects a state that is currently correct. The actual cause
of having to re-prompt for the design system is the combination of an **open
authoring surface** (Phase 3) and an **unwritten judgment layer** (Phase 4).
Phases 0–2 are necessary groundwork, but if only two phases ever get built, build
3 and 4.


---

## 10. Build log

### Phase 0 — done, 2026-11-13

Branch `build/design-system-binding`, off `main` (this repo has no long-lived
`dev`; its convention is topic branch → PR into `main`, which CI gates).

Shipped:

- `scripts/brand.manifest.json` — pins `kreativejosh/mustard-bio-brand` at
  `39b8538` (2026-11-10), 29 files, 4.00 MB, sha256 each.
- `scripts/sync-brand.mjs` — fetches each file from raw.githubusercontent at the
  pinned SHA and verifies it. `--update` re-hashes, for adopting a new SHA.
- `scripts/verify-brand.mjs` — no network; re-hashes on disk. Wired to `predev`
  and `prebuild`.
- `brand/` — `tokens.css`, `brand.ts`, `scenes.js`, all synced.
- `lib/brand/illustrations.ts` — was a ~60-line hand-copy of the pack, now a
  2-line re-export from `brand/brand.ts`.
- `lib/brand/scenes.js` — deleted; `hero-canvas.tsx` imports `@/brand/scenes.js`.
- `content/brand-tokens.css` — **deleted**. The dead copy that nothing imported.
- `eslint.config.mjs` — ignores `brand/**` (generated) instead of `lib/brand/**`.
- `README.md` — brand section rewritten around the three commands.

Verified, not assumed:

- `npm run brand:sync` against live GitHub rewrote all 29 files and `git status`
  showed **no modification** to any of them. The assets really were byte-identical
  to brand `main`; the pipeline now proves it on demand instead of by assertion.
- Tamper test: appending a line to `brand/tokens.css` makes `verify-brand` exit 1
  and `npm run build` exit 1. The gate blocks a build, it does not merely warn.
- Full CI sequence green: `eslint` (0 errors, 0 warnings), `tsc --noEmit`,
  `npm run build`, and all 9 expected files present in `out/`.
- CI needs no new step yet: it runs `npm run build`, and `prebuild` runs the
  verify. Phase 5 should still add an explicit step so the failure reads clearly.

Not done in Phase 0, by design: no token was touched. `app/globals.css` still
declares its own values and still does not import `brand/tokens.css` — that is
Phase 1. Phase 0 changed plumbing only, and the rendered site is unchanged.


### Phase 1 — done, 2026-11-13

`app/globals.css` now imports the brand layer and derives from it.

- `@import '../brand/tokens.css'` at the top. Verified it is really inlined:
  `--mb-charcoal:#222F30` appears in the emitted stylesheet and no `@import`
  survives in the output.
- 14 site tokens became `var(--mb-*)` references: `--charcoal --deep --sage
  --lime --mint --off --white --g1 --g2 --stone --ink --line --ease --ease-io`.
- `--dur-1..4` added, derived from `--mb-dur-*`. This closes a "missing" row in
  the §4 drift table.
- `--sp-1..7` added, mirroring `--mb-space`. CSS cannot index a space-separated
  list, so these are literals; Phase 2 must assert they still equal the brand's.
- `:root` now holds exactly three colour literals, all inside `DEVIATIONS`.

**Proof of value-neutrality.** A resolver walked the *emitted* stylesheet,
tracking brace depth so `@media` overrides were excluded, resolved every site
token through its new `var()` chain, and compared against the pre-Phase-1
values: **all 34 match exactly.** The first run of that check reported `--hdr`
and `--logo-h` as changed; that was the resolver flattening the responsive
`:root` at line 451, not a regression — `git diff` confirmed neither line was
touched. Worth recording because it is the exact shape of false positive that
Phase 2's checker will have to avoid.

**Durations: narrower than planned, on purpose.** The plan said "replace the
hardcoded `.3s`/`.9s`/`1.1s` transitions", which contradicts the same phase's
pixel-identical gate — those are not brand values, so tokenising them would
change the motion design. Only the 11 literals that *already* equalled a brand
duration were swapped (`.2s`→`--dur-1` ×3, `.4s`→`--dur-2` ×5, `1.2s`→`--dur-4`
×3). The rest (`.25s` ×5, `.3s` ×5, `.6s` ×4, `.9s` ×4, `1.1s` ×2, `.45s`,
`.5s`) stay literal and are now a known, enumerated gap: bringing them onto the
scale is a design pass, not plumbing. `--dur-3` (800ms) is defined but unused.

**`--muted` resolved, and it is a gap in the brand, not a site error.** The site
already follows the brand rule — `.hero .title .mute` and `.vision .title .mute`
use mint on dark grounds. `--muted` applies only on *light* grounds, where the
brand assigns display-mute to sage and then forbids sage on light (1.4:1 on
off-white) without offering an alternative. Recorded in `DEVIATIONS` with that
reasoning and flagged to push upstream.

**Not done:** no CSS *rule* was retrofitted. The new `--sp-*` scale is declared
but unused, and the ~380 lines of per-section CSS are untouched — retrofitting
spacing changes layout, which Phase 1 forbids. That is Phase 3's job.


### Phases 2-5 — done, 2026-11-13

**Phase 2, constraint layer.** `scripts/brand-check.mjs`, wired to `prebuild`
and CI as `npm run brand:check`. Eight rules: no raw colour in a rule, ground
discipline, radii on-scale, a motion budget, the space scale still mirroring the
brand, contrast on real pairs, `images.unoptimized`, and no re-appearance of a
hand-copied brand file.

To make the first rule absolute instead of exception-riddled, the 11 off-palette
literals scattered through the stylesheet were **named** rather than
allow-listed — `--hover-charcoal`, `--ground-hero`, `--panel-ui`, `--danger` and
so on, in a `SITE SHADES` block, same values, each with a reason. 26 `#fff`
became `var(--white)`. Six literal radii became `--r1/--r2/--r3`. All
value-identical. Only `#000` ×2 survives, inside `mask-image`, where it is a
mask channel rather than a colour.

*The ground check was rebuilt mid-phase.* Its first version used a hand-kept
list of "dark" selectors and reported **five false positives** — `.hdr-cta` and
`.sheet-cta` are charcoal buttons, `.mos-side` sits on a light panel, and
`.chip.ok` declares `background:var(--charcoal)` in the very same rule. A
hand-kept list of grounds is itself a drift surface. It now reads backgrounds
out of the stylesheet, resolves them through the token chain, computes relative
luminance, and **stays silent when it cannot determine the ground** — a checker
that cries wolf gets switched off.

Tamper-tested, all five rule classes: raw hex, lime-on-white, off-scale radius,
space scale, `images.unoptimized`. Each fails with a teaching message; all
restore clean.

**Phase 3, composition layer.** `components/ds/` — `primitives.tsx` (Arrow, Btn,
Tag, Title, Frame, Illo, **Icon**, new, backed by the brand's 28-icon set) and
`layout.tsx` (Section, Split, Col, Panel, NumberedList, Measure).
`components/ui.tsx` and `components/illo.tsx` are now shims, so no existing page
changed.

A generic `ds-*` layout vocabulary was added to `globals.css`, with
measurements lifted from the hand-built sections so the rhythm matches. Proved
by composing a full three-section page from `ds/` alone, building it, and
checking every class it emitted against the stylesheet: **all defined, none
added.** The scratch route was then deleted and its code kept as Recipe 0 in
`docs/recipes.md`.

**Phase 4, judgment layer.** `CLAUDE.md` rewritten from four hex codes into
standing rules that open by ordering the skill to be loaded.
`.claude/skills/mustard-design-system/SKILL.md` carries the depth: the ground
table, the deviations and why, type scale, space/radius/motion, the two packs,
the component layer, and how to read a `brand:check` message.
`docs/recipes.md` carries six worked compositions.

**Phase 5, feedback loop.** CI gained explicit `brand:verify` and `brand:check`
steps ahead of lint, so a binding failure names itself instead of hiding inside
the build. The blocking `PreToolUse` hook was **not** added, per §6 — with
Phases 3 and 4 in place it is largely redundant and it fires on every edit.

### Still undone, deliberately

- **The existing per-section CSS is not migrated.** `.st-*`, `.ap-*`, `.biz-*`,
  `.ev-*`, `.mos-*` still lay out the four live pages; `ds/` is what new pages
  compose from. Migrating them changes rendering, and nothing here was verified
  in a browser. That is a visual task, not a plumbing one.
- **No visual verification anywhere in Phases 0-5.** Token resolution was proved
  arithmetically and class coverage structurally. No page was rendered and
  compared. Phase 1's value-neutrality is therefore proved for token *values*,
  not for pixels.
- **`--sp-1..7` is declared but unused.** Retrofitting spacing changes layout.
- **21 durations remain off the brand scale**, capped by a budget so the number
  cannot grow. Bringing them onto it is a design pass.
- **Three gaps belong upstream, not here:** the brand has no display-mute for
  light grounds (`--muted`), no error colour (`--danger`), and no dark-green
  ground for the 3D surfaces (`--ground-*`). Each is recorded at its definition.
- **The brand repo's own `--mb-*` vs `--charcoal` contradiction is untouched**
  (ADR-003), as is the fact that it ships no component code (ADR-002).
- **`--dur-3` (800ms) is defined but unused.**
- The build now depends on `brand/tokens.css` resolving through `@import`; if a
  future Next upgrade changes CSS handling, `brand:check` will not catch it but
  the emitted-CSS assertion in §10 Phase 1 would. That check is not automated.

### Correction

§2 of this plan said the brand ships 26 icons. It ships **28**. Counted from
`brand/brand.ts`; the table above is corrected.


---

## 11. First real use: the Careers page, and the bug it exposed

Built 2026-11-13 through the system (skill, then `ds/`, then `brand:check`).
Two components were added to `ds/` while building it — `IconList` and
`TextLink` — which is the intended way that layer grows.

**It shipped an accessibility failure that `brand:check` did not catch.**
`<Measure>` renders `.lead` / `.body`, which hard-set `color:var(--ink-2)`.
Composed inside `<Panel ground="on-charcoal">` that overrides the panel's
inherited white and renders at **1.91:1** — found by eye, from a screenshot,
not by any check here. `.title .mute` was a quieter version of the same fault
at 3.74:1 where the site's own dark convention is mint at 11.48:1.

**The blind spot was structural, not an oversight in the rule.** The ground
check reasons about *CSS-time* grounds: it reads a selector, finds the nearest
background, compares luminance. But `.lead` has no ground in CSS. Its ground
exists only at *composition time*, when a page puts `<Measure>` inside a
`<Panel>`. No amount of stylesheet analysis can see that.

The fix asserts the invariant rather than chasing usage through TSX: any
generic text class the `ds/` layer can place inside a Panel must be re-inked
under every dark panel ground, or the build fails. Resulting contrast:

| | before | after |
|---|---|---|
| `.lead` on charcoal | 1.91:1 | 9.40:1 |
| `.body` on charcoal | 1.91:1 | 8.65:1 |
| `.title .mute` on charcoal | 3.74:1 | 11.48:1 |

**Two further defects in the checker surfaced while fixing it**, both of the
cry-wolf kind that §10 warned about:

1. The first version of the composition rule demanded dark-panel overrides for
   *every* bare class setting a light ink, including page-specific ones like
   `.mos-sign` that can never compose into a Panel. Now scoped to a named list
   of classes `ds/` actually emits.
2. The rule parser took `selector.split('\n').pop()` to skip comments, so a
   selector list spanning several lines **lost every line but the last** — which
   hid a dark-panel override from the very check that needed it. It now strips
   comments and keeps the whole selector.

**The lesson for §3's "the error message is the teacher".** A constraint layer
can only enforce what it can observe. This one observes CSS. The composition
layer (Phase 3) is what makes a *runtime* invariant checkable at all, by making
the set of composable classes finite and known. The two phases are not
independent: Phase 3 is what gives Phase 2 something it can reason about.

This is also the clearest possible argument for the §10 caveat that **nothing
here was visually verified.** Every automated gate passed on a page with 1.91:1
body text.
