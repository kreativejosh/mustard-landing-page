# Mustard Bio website — notes for Claude

## Before any UI or design work

**Load the `mustard-design-system` skill first** (`.claude/skills/mustard-design-system/`).
It carries the colour roles, type scale, spacing, motion and the rules that
cannot be expressed as code. Do not design from the hex codes below alone —
they are an index, not the system.

Then: **compose from `components/ds/`**. Writing a new CSS class in
`app/globals.css` to lay out a page is the drift this repo exists to prevent.
If no component fits, add one to `components/ds/` so the next page inherits it.

Worked examples live in `docs/recipes.md`. Copy one rather than starting blank.

## Brand files are generated

`brand/`, `public/assets/` and `assets/fonts/` are owned by
[mustard-bio-brand](https://github.com/kreativejosh/mustard-bio-brand) and
pinned by `scripts/brand.manifest.json`. **Never hand-edit them.** To change
one, change it in the brand repo, bump `sha` in the manifest, then
`npm run brand:sync -- --update`.

The logo SVGs are fixed artwork: never redraw or re-space them. The capsule "o"
is artwork, not a typed character.

## The rules that break a page most often

- **Lime (`--lime`) is "the dose": dark grounds only.** The brand's own tested
  pairs mark lime-on-white as *"Never for text"*. Same for `--mint`.
- **Never sage on a light ground.** It reads 1.4:1 on off-white. On dark, sage
  is the quiet-label colour.
- **No colour literal in a CSS rule.** Colours live in the `:root` block of
  `app/globals.css`: derived from `--mb-*` where the brand has them, under
  `DEVIATIONS` or `SITE SHADES` where it does not, each with a stated reason.
- **Body text stays at or above 4.5:1** on the ground it actually sits on.
- Keep `images.unoptimized`: renders are served exactly as produced.

## Before claiming done

```bash
npm run brand:verify   # brand files unmodified
npm run brand:check    # design-system constraints
npx tsc --noEmit && npx eslint . && npm run build
```

`brand:check` explains each violation and what to do instead — read the message,
do not work around it. `prebuild` runs both, so a violation fails the build.

## Copy

Copy is verbatim from `content/website-copy.md` via `lib/copy.ts`. Never reword
it, never describe Mustard Bio beyond it, and never add invented claims,
numbers, people or contact details.

## Other

- Next.js 15 App Router, static export (`output: 'export'`).
- SEO/AI search: `lib/seo.ts`, `lib/og.tsx`, `lib/llms.ts`, `components/json-ld.tsx`,
  `app/sitemap.ts`, `app/robots.ts`. New pages: add to `PAGES` in `lib/seo.ts`,
  export `pageMetadata(key)`, render `<JsonLd page=... />`.
- The visual reference must never be named or hinted at anywhere in code,
  comments or docs.
- Architecture and reasoning: `docs/design-system-binding.md`.
