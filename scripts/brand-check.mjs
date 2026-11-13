// Design-system constraints that CSS itself cannot express.
//
//   npm run brand:check
//
// Every message here is meant to TEACH the rule, not just name it — this is the
// constraint layer feeding the judgment layer while you work, instead of only
// failing in CI afterwards. See docs/design-system-binding.md §3.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const problems = [];
const fail = (file, line, title, teach) => problems.push({ file, line, title, teach });

// ---------------------------------------------------------------- parse CSS
const CSS_PATH = 'app/globals.css';
const css = read(CSS_PATH);
const lines = css.split('\n');

// the token block is everything inside the first top-level :root{...}
const rootStart = css.indexOf(':root{');
const rootEnd = css.indexOf('\n}', rootStart);
const tokenBlock = css.slice(rootStart, rootEnd);
const tokenBlockEndLine = css.slice(0, rootEnd).split('\n').length;

const tokens = {};
for (const m of tokenBlock.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tokens[m[1]] = m[2].trim();

const brandTokens = {};
for (const m of read('brand/tokens.css').matchAll(/(--mb-[\w-]+)\s*:\s*([^;]+);/g)) brandTokens[m[1]] = m[2].trim();

const resolve = (v, d = 0) => {
  if (d > 12) return v;
  return String(v).replace(/var\((--[\w-]+)\)/g, (_, n) => {
    const next = tokens[n] ?? brandTokens[n];
    return next === undefined ? `UNRESOLVED(${n})` : resolve(next, d + 1);
  });
};

// ------------------------------------------------- 1. no raw colour in rules
// Colours belong in the token block. A hex buried in a rule is a value nobody
// can find again. rgba()/rgb() with alpha are compositing, not palette, so they
// are allowed; #000 and #fff inside a mask are channels, not colours.
for (let i = tokenBlockEndLine; i < lines.length; i++) {
  const line = lines[i];
  if (/mask-image/.test(line)) continue;
  for (const m of line.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)) {
    fail(CSS_PATH, i + 1, `raw colour ${m[0]} in a rule`,
      `Colours live in the :root token block, never in a rule. If ${m[0]} is a brand\n` +
      `   value, derive it: var(--lime) -> var(--mb-lime). If it is genuinely new, add a\n` +
      `   named token under SITE SHADES with a one-line reason, so the next person can\n` +
      `   see what it is for and whether the brand should absorb it.`);
  }
}

// ------------------------------------------------------ 2. ground discipline
// The brand's hardest rules are about which colour may touch which ground, and
// no CSS variable can carry them. brand/brand.ts PAIRS marks lime-on-light as
// "Never for text"; the brand CLAUDE.md says never sage on light grounds.
//
// The ground is READ FROM THE STYLESHEET, not from a hand-kept list of "dark"
// selectors — such a list is itself a drift surface, and the first version of
// this check produced five false positives because of one. Where the ground
// cannot be determined, nothing is reported: a checker that cries wolf is a
// checker people switch off.
const RULES = [];
{
  // Strip comments rather than taking the last line of the selector: a selector
  // list spanning several lines would otherwise lose every line but the last,
  // which silently hid a dark-panel override from this very check.
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(bare))) {
    const sel = m[1].trim().replace(/\s*\n\s*/g, ' ');
    if (!sel || sel.startsWith('@') || sel.startsWith(':root') || sel.startsWith('from') || sel.startsWith('to') || /^\d+%$/.test(sel)) continue;
    RULES.push({ sel, decls: m[2], line: bare.slice(0, m.index).split('\n').length });
  }
}

const asHex = (v) => {
  const r = resolve(v).trim();
  const m = r.match(/#[0-9A-Fa-f]{3,6}\b/);
  return m ? m[0] : null;
};

// selector -> background colour, for every rule that states one
const grounds = new Map();
for (const r of RULES) {
  const m = r.decls.match(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/);
  if (!m) continue;
  const hex = asHex(m[1]);
  if (hex) for (const one of r.sel.split(',')) grounds.set(one.trim(), hex);
}

const relLum = (hex) => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c) : h.match(/../g);
  return f.map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
};

// walk out from the most specific part of the selector to the least
function groundFor(sel) {
  const clean = sel.replace(/::?[a-z-]+(\([^)]*\))?/g, '').trim();
  if (grounds.has(clean)) return grounds.get(clean);
  const parts = clean.split(/\s+/);
  for (let i = parts.length - 1; i >= 0; i--) {
    const tail = parts.slice(i).join(' ');
    if (grounds.has(tail)) return grounds.get(tail);
    const head = parts.slice(0, i + 1).join(' ');
    if (grounds.has(head)) return grounds.get(head);
    const bare = parts[i].split('.').filter(Boolean).map((c) => '.' + c);
    for (const b of bare) if (grounds.has(b)) return grounds.get(b);
  }
  return null;
}

const DARK_ONLY = { '--sage': 'sage', '--lime': 'lime (the dose)', '--mint': 'mint' };
const LIGHT_ONLY = { '--ink-2': 'secondary text', '--ink-3': 'tertiary text', '--muted': 'display mute' };

for (const r of RULES) {
  const cm = r.decls.match(/(?:^|;)\s*color\s*:\s*var\((--[\w-]+)\)/);
  if (!cm) continue;
  const tok = cm[1];
  if (!DARK_ONLY[tok] && !LIGHT_ONLY[tok]) continue;
  const bg = groundFor(r.sel);
  if (!bg) continue;                       // ground unknown: say nothing
  const dark = relLum(bg) < 0.18;

  if (DARK_ONLY[tok] && !dark) {
    fail(CSS_PATH, r.line, `${DARK_ONLY[tok]} used as text on a light ground (${bg}) — ${r.sel}`,
      `${tok} is reserved for dark grounds. brand/brand.ts PAIRS marks lime-on-white\n` +
      `   as "Never for text", and the brand forbids sage on light grounds (it reads\n` +
      `   1.4:1 on off-white). On a light ground use var(--ink) or var(--ink-2).`);
  }
  if (LIGHT_ONLY[tok] && dark) {
    fail(CSS_PATH, r.line, `${LIGHT_ONLY[tok]} used on a dark ground (${bg}) — ${r.sel}`,
      `${tok} is tuned for light grounds and will not carry on charcoal. The site's\n` +
      `   own convention on dark is var(--mint) for display mute and var(--sage) for\n` +
      `   quiet labels — see .hero .title .mute and .ftr-cols .k.`);
  }
}

// ------------------------------- 2b. grounds that only exist at composition time
// The check above reasons about CSS-time grounds. A generic text class like
// .lead carries no ground of its own: its ground appears only when <Measure> is
// composed inside <Panel ground="on-charcoal">. That blind spot shipped
// --ink-2 (1.91:1) onto a charcoal panel. So instead of chasing usage through
// TSX, assert the invariant: any bare class that hard-sets a light-ground
// colour MUST be re-inked under every dark panel ground.
const DARK_PANELS = ['.ds-panel.on-charcoal', '.ds-panel.on-deep'];
const lightInk = new Set(['--ink', '--ink-2', '--ink-3', '--muted']);
// Only the generic text classes components/ds/ can place inside a Panel. Page-
// specific classes (.mos-sign, .biz-*) never compose into one, and demanding
// overrides for them was this rule's own first false-positive run.
// ADD TO THIS LIST when a ds component starts emitting a new text class.
const COMPOSABLE = ['.lead', '.body', '.k', '.num', '.title .mute'];
const bareLightClasses = new Set();
for (const r of RULES) {
  for (const one of r.sel.split(',')) {
    const sel = one.trim();
    if (!COMPOSABLE.includes(sel)) continue;
    const m = r.decls.match(/(?:^|;)\s*color\s*:\s*var\((--[\w-]+)\)/);
    if (m && lightInk.has(m[1])) bareLightClasses.add(sel);
  }
}
for (const cls of bareLightClasses) {
  for (const panel of DARK_PANELS) {
    const covered = RULES.some((r) => r.sel.split(',').some((one) => {
      const sel = one.trim();
      return sel.startsWith(panel + ' ') && sel.endsWith(cls) && /color/.test(r.decls);
    }));
    if (!covered) {
      fail(CSS_PATH, 0, `${cls} is not re-inked inside ${panel}`,
        `${cls} hard-sets a light-ground colour, so it overrides the panel's inherited\n` +
        `   white and renders near-invisible on dark. Add:\n` +
        `     ${panel} ${cls}{color:rgba(255,255,255,.8)}\n` +
        `   This is the bug class the selector-based ground check cannot see, because\n` +
        `   ${cls} has no ground until a page composes it inside a Panel.`);
    }
  }
}

// ------------------------------------------------------- 3. radii on-scale
const RADII = new Set(Object.keys(tokens).filter((t) => /^--r\d$/.test(t)).map((t) => resolve(tokens[t])));
for (let i = tokenBlockEndLine; i < lines.length; i++) {
  for (const m of lines[i].matchAll(/border-radius\s*:\s*([^;}]+)/g)) {
    const v = m[1].trim();
    if (v.includes('var(') || v === '50%' || v === '999px' || /^\d+%$/.test(v)) continue;
    // hairlines on 1-8px decoration (chart bars, ticks, dots) are not a scale decision
    if (/^[12]px$/.test(v)) continue;
    if (RADII.has(v)) {
      fail(CSS_PATH, i + 1, `off-token border-radius: ${v}`,
        `${v} happens to equal a scale step, but written literally it drifts the moment\n` +
        `   the scale moves. Use the token instead (--r1 4px, --r2 6px, --r3 8px,\n` +
        `   --r4 10px, --r5 12px).`);
    } else {
      fail(CSS_PATH, i + 1, `border-radius ${v} is off the scale`,
        `The site's radius scale is 4/6/8/10/12 (--r1..--r5). ${v} is not on it.\n` +
        `   Pick the nearest step, or change the scale deliberately in the token block.`);
    }
  }
}

// --------------------------------------- 4. motion budget (known gap, capped)
// 21 durations are not on the brand scale. That is a design pass, not plumbing
// (see docs §10, Phase 1), so this is a budget that must not grow.
const BRAND_MS = new Set(['200ms', '400ms', '800ms', '1200ms']);
const MOTION_BUDGET = 21;
let offScale = 0;
for (let i = tokenBlockEndLine; i < lines.length; i++) {
  if (/prefers-reduced-motion/.test(lines[i])) continue;
  for (const m of lines[i].matchAll(/(?:transition|animation)[^;}]*?(?<![\w.])(\d*\.?\d+)(m?s)\b/g)) {
    const ms = m[2] === 's' ? parseFloat(m[1]) * 1000 : parseFloat(m[1]);
    if (ms <= 1 || ms >= 3000) continue; // reduced-motion overrides and ambient loops
    if (!BRAND_MS.has(`${ms}ms`)) offScale++;
  }
}
if (offScale > MOTION_BUDGET) {
  fail(CSS_PATH, 0, `${offScale} off-scale durations, budget is ${MOTION_BUDGET}`,
    `The brand scale is 200/400/800/1200ms (--dur-1..--dur-4). ${offScale - MOTION_BUDGET} new\n` +
    `   off-scale duration(s) appeared. Use a token, or raise MOTION_BUDGET here with a\n` +
    `   note saying why this one earns its own timing.`);
}

// ------------------------------------- 5. the space scale still mirrors brand
const brandSpace = (brandTokens['--mb-space'] || '').split(/\s+/).filter(Boolean);
const siteSpace = Object.keys(tokens).filter((t) => /^--sp-\d$/.test(t)).sort().map((t) => resolve(tokens[t]));
if (brandSpace.length && siteSpace.length && brandSpace.join(' ') !== siteSpace.join(' ')) {
  fail(CSS_PATH, 0, 'the space scale no longer matches the brand',
    `--mb-space is "${brandSpace.join(' ')}"\n   --sp-1..n is "${siteSpace.join(' ')}"\n` +
    `   CSS cannot index a space-separated list, so --sp-* is a hand mirror of the brand's\n` +
    `   scale and this check is the only thing keeping the two honest.`);
}

// ----------------------------------------------------------- 6. contrast
const lum = (hex) => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c) : h.match(/../g);
  return f.map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
};
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const hexOf = (t) => { const v = resolve(`var(${t})`); return /^#[0-9A-Fa-f]{3,6}$/.test(v) ? v : null; };

// body-sized text must clear AA on the grounds it actually sits on
for (const [fg, bgs, label, min] of [
  ['--ink', ['--white', '--off'], 'body text', 4.5],
  ['--ink-2', ['--white', '--off'], 'secondary text', 4.5],
  ['--ink-3', ['--white', '--off'], 'tertiary text', 4.5],
  ['--muted', ['--white', '--off'], 'display mute', 3.0],
  ['--sage', ['--charcoal'], 'quiet label on dark', 4.5],
  ['--mint', ['--charcoal'], 'display mute on dark', 4.5],
]) {
  const f = hexOf(fg); if (!f) continue;
  for (const bg of bgs) {
    const b = hexOf(bg); if (!b) continue;
    const r = contrast(f, b);
    if (r < min) {
      fail(CSS_PATH, 0, `${label}: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${min}:1`,
        `Changing a token changed a contrast ratio. ${fg} resolves to ${f} and ${bg} to ${b}.\n` +
        `   The brand's own ramp fails here too — that is why the site runs a darker text\n` +
        `   ramp as a recorded deviation. Do not fix this by lightening the ground.`);
    }
  }
}

// ------------------------------------------- 7. renders are never recompressed
const nextConfig = read('next.config.ts');
if (!/unoptimized\s*:\s*true/.test(nextConfig)) {
  fail('next.config.ts', 0, 'images.unoptimized is no longer true',
    `The brand renders are served exactly as produced. Next's optimiser would\n` +
    `   recompress them and the identity work would be lost at the last step.`);
}

// ------------------------------------------ 8. no stray copies of brand files
for (const [stray, why] of [
  ['content/brand-tokens.css', 'the tokens come from brand/tokens.css, which is synced and checksummed'],
  ['lib/brand/scenes.js', 'the scene library comes from brand/scenes.js'],
]) {
  if (existsSync(join(root, stray))) {
    fail(stray, 0, 'a hand-copy of a brand file is back',
      `${why}. A second copy is how the last drift started: it looks authoritative,\n` +
      `   nothing imports it, and it silently rots. Delete it.`);
  }
}

// ---------------------------------------------------------------- report
if (!problems.length) {
  console.log('brand:check  all design-system constraints hold');
  process.exit(0);
}
console.error(`\n  ${problems.length} design-system problem(s):\n`);
for (const p of problems) {
  console.error(`  ${p.file}${p.line ? `:${p.line}` : ''}  ${p.title}`);
  console.error(`   ${p.teach}\n`);
}
console.error('  Rules live in scripts/brand-check.mjs; the reasoning is in docs/design-system-binding.md.\n');
process.exit(1);
