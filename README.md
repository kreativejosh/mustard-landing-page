# Mustard Bio website

Marketing site for Mustard Bio: Home, Manufacturing, Technology, About (with Vision). Next.js 15 (App Router), exported as static pages.

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Content
- Copy lives in `lib/copy.ts`, word for word from `content/website-copy.md`. Do not reword it or add claims.
- Brand: everything in `brand/` (tokens, colour roles, icons, illustrations, scene library), plus `public/assets/` and `assets/fonts/`, is owned by the [Mustard Bio design system](https://github.com/kreativejosh/mustard-bio-brand) and **generated — never hand-edit it**. See `docs/design-system-binding.md`.

```bash
npm run brand:verify              # checksum every brand file (runs on dev and build)
npm run brand:sync                # restore them from the pinned SHA
npm run brand:sync -- --update    # adopt a new brand SHA after bumping it in the manifest
```

## Search and AI search
Generated from the copy, see `lib/seo.ts`:
- per-page title, description, canonical URL, Open Graph and Twitter cards; share images at `/og/<page>.png` (`lib/og.tsx`)
- schema.org JSON-LD on every page: Organization, WebSite, WebPage/AboutPage, BreadcrumbList
- `/sitemap.xml`, `/robots.txt` (search and AI crawlers allowed), `/manifest.webmanifest`, `/apple-icon.png`
- `/llms.txt` and `/llms-full.txt` (llmstxt.org) for AI assistants
- one `h1` per page, ordered headings, landmarks, alt text on every image

## Environment variables (set at build time)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Live domain, e.g. `https://example.com`. Used for canonicals, sitemap and share images. On Vercel it falls back to the production domain. |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Form service URL that accepts a JSON POST (Formspree, Basin, own API). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Used when no endpoint is set: the form opens the visitor's mail app addressed here. |

## CI/CD
- **CI** (`.github/workflows/ci.yml`): every pull request into `main` runs lint, type-check, `npm audit` (production, high and above) and a full build, then checks every page and SEO file was exported.
- **CD**: Vercel's GitHub integration. Merging a pull request into `main` deploys to production; every pull request gets a preview URL in its checks.
- **Dependabot** (`.github/dependabot.yml`): weekly dependency PRs, Next.js/React grouped, so security releases arrive as PRs that CI checks.
- Protect `main` so nothing reaches production without passing CI (see below).

## Deploy
Vercel: import this repo, framework Next.js, no settings needed beyond the variables above. Any static host works with `out/`.

`npm run preview` builds a flat-file variant (`NEXT_PUBLIC_STATIC_PREVIEW=1`) whose links point at `.html` files, for hosts without clean URLs.
