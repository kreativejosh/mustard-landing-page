# Mustard Bio website — notes for Claude

- Next.js 15 App Router, static export (`output: 'export'`). Pages in `app/`, shared UI in `components/`, styles in `app/globals.css`.
- Copy is verbatim from `content/website-copy.md` via `lib/copy.ts`. Never reword it, never describe Mustard Bio beyond it, and never add invented claims, numbers, people or contact details.
- Brand: charcoal #222F30, off-white #F7F7F5, lime #A7E26E (the "dose"), mint #CEF79E; IBM Plex Sans/Mono. The logo SVGs in `public/assets/logo/` are fixed artwork: never redraw them. Lime dose on dark grounds only.
- Keep `images.unoptimized` (renders are served as produced). Body text on light grounds must stay ≥ 4.5:1 contrast.
- SEO/AI search lives in `lib/seo.ts`, `lib/og.tsx`, `lib/llms.ts`, `components/json-ld.tsx`, `app/sitemap.ts`, `app/robots.ts`. New pages: add them to `PAGES` in `lib/seo.ts`, export `pageMetadata(key)` and render `<JsonLd page=... />`.
- The visual reference must never be named or hinted at anywhere in code, comments or docs.
