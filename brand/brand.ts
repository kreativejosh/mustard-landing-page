// Brand data used across the identity site. Values mirror design-system/tokens.css.

export type Swatch = { name: string; token: string; hex: string; rgb: string; hsl: string; cmyk: string; use: string; ink: string };

export const COLOURS: Swatch[] = [
  { name: 'Dark Charcoal', token: '--charcoal', hex: '#222F30', rgb: '34 47 48', hsl: '184 17 16', cmyk: '29 2 0 81', use: 'Primary ink, type, buttons, dark surfaces', ink: '#fff' },
  { name: 'Deep Sea Green', token: '--deepsea', hex: '#445E5F', rgb: '68 94 95', hsl: '182 17 32', cmyk: '28 1 0 63', use: 'Secondary dark, cards, 3D grounds', ink: '#fff' },
  { name: 'Sage Mist', token: '--sage', hex: '#C9CBBE', rgb: '201 203 190', hsl: '69 11 77', cmyk: '1 0 6 20', use: 'Display second halves, quiet grounds', ink: '#222F30' },
  { name: 'Fresh Lime', token: '--lime', hex: '#A7E26E', rgb: '167 226 110', hsl: '91 67 66', cmyk: '26 0 51 11', use: 'The dose. Tag square, accents on dark', ink: '#222F30' },
  { name: 'Soft Mint', token: '--mint', hex: '#CEF79E', rgb: '206 247 158', hsl: '88 85 79', cmyk: '17 0 36 3', use: 'Arrow tile, highlight surfaces', ink: '#222F30' },
  { name: 'Off White', token: '--offwhite', hex: '#F7F7F5', rgb: '247 247 245', hsl: '60 11 96', cmyk: '0 0 1 3', use: 'Default surface, tiles', ink: '#222F30' },
  { name: 'Stone', token: '--stone', hex: '#E7E8E1', rgb: '231 232 225', hsl: '69 13 90', cmyk: '0 0 3 9', use: 'Feature cards, 3D floors', ink: '#222F30' },
  { name: 'Light Gray', token: '--gray-1', hex: '#EEEEEE', rgb: '238 238 238', hsl: '0 0 93', cmyk: '0 0 0 7', use: 'Page bands, card frames', ink: '#222F30' },
];

export const PAIRS: [fg: string, bg: string, label: string][] = [
  ['#222F30', '#FFFFFF', 'Body text'], ['#222F30', '#F7F7F5', 'Body text'], ['#FFFFFF', '#222F30', 'Reverse text'], ['#A7E26E', '#222F30', 'Dose on dark'],
  ['#CEF79E', '#222F30', 'Accent text on dark'], ['#222F30', '#CEF79E', 'Button arrow'], ['#222F30', '#A7E26E', 'Text on lime'], ['#5C6B6C', '#FFFFFF', 'Secondary text'],
  ['#C9CBBE', '#222F30', 'Muted on dark'], ['#FFFFFF', '#445E5F', 'Text on Deep Sea'], ['#C9CBBE', '#F7F7F5', 'Display only'], ['#A7E26E', '#FFFFFF', 'Never for text'],
];

const lum = (h: string) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);

/** WCAG 2.1 contrast ratio between two hex colours. */
export const contrast = (a: string, b: string) => {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

export const wcagLevel = (r: number) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'Fail');

// 24 px interface set, 1.25 stroke, drawn as SVG inner markup
export const ICONS: Record<string, string> = {
  capsule: '<g transform="rotate(-36 12 12)"><rect x="3.5" y="8.5" width="17" height="7" rx="3.5"/><path d="M12 8.5v7"/></g>',
  tablet: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16"/>',
  blister: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><circle cx="12" cy="10" r="1.6"/><circle cx="15.5" cy="10" r="1.6"/><circle cx="8.5" cy="14.5" r="1.6"/><circle cx="12" cy="14.5" r="1.6"/><circle cx="15.5" cy="14.5" r="1.6"/>',
  flask: '<path d="M9.5 3.5h5M10.3 3.5V9l-5.4 9.3a1.5 1.5 0 0 0 1.3 2.2h11.6a1.5 1.5 0 0 0 1.3-2.2L13.7 9V3.5"/><path d="M7.3 15h9.4"/>',
  vial: '<path d="M9 3.5h6M10 3.5v14.5a2 2 0 0 0 4 0V3.5"/><path d="M10 12h4"/>',
  scale: '<path d="M4 20v-4M6.7 20V6M9.3 20V9M14.7 20V9M17.3 20V6M20 20v-4"/><path d="M12 20v-7" stroke-width="2.6"/>',
  carton: '<path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9"/>',
  batch: '<rect x="4" y="4" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/>',
  line: '<rect x="3" y="14" width="18" height="5" rx="2.5"/><circle cx="6" cy="16.5" r=".8"/><circle cx="18" cy="16.5" r=".8"/><rect x="6" y="8" width="4.5" height="4.5" rx=".6"/><rect x="13.5" y="8" width="4.5" height="4.5" rx=".6"/>',
  sensor: '<circle cx="12" cy="12" r="1.8"/><path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7M5.6 18.4a9 9 0 0 1 0-12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>',
  chart: '<path d="M3.5 3.5v17h17"/><path d="m7 15 3.5-4 3 2.5L19 7"/>',
  quality: '<path d="M12 3.5 19.5 6v6c0 4.4-3.2 7.6-7.5 8.5-4.3-.9-7.5-4.1-7.5-8.5V6z"/><path d="m8.8 12 2.2 2.2 4.4-4.4"/>',
  automation: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  temperature: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
  pressure: '<path d="M4.5 17.5a8.5 8.5 0 1 1 15 0"/><path d="m12 13 4-4"/><circle cx="12" cy="13" r="1"/>',
  factory: '<path d="M3.5 20.5v-10l5 3v-3l5 3v-3l5 3v-9h2v16z"/><path d="M7 17h2M11 17h2M15 17h2"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/>',
  network: '<circle cx="5.5" cy="12" r="2"/><circle cx="18.5" cy="6" r="2"/><circle cx="18.5" cy="18" r="2"/><circle cx="12" cy="12" r="1.5"/><path d="M7.5 12h3M13.3 11.3l3.5-4.2M13.3 12.7l3.5 4.2"/>',
  document: '<path d="M6.5 3.5h8l3.5 3.5v13.5H6.5z"/><path d="M14.5 3.5V7H18M9 11h6M9 14h6M9 17h4"/>',
  shipping: '<path d="M3.5 6.5h10v10h-10zM13.5 10h4l3 3v3.5h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  global: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 3.5 5.3 3.5 8.5s-1 6.2-3.5 8.5c-2.5-2.3-3.5-5.3-3.5-8.5s1-6.2 3.5-8.5z"/>',
  time: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  access: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<path d="M12 4 21 19.5H3z"/><path d="M12 10v4.5M12 17v.5"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-out': '<path d="M7 17 17 7M8 7h9v9"/>',
};

// generative 1 px illustrations on a 114 grid
export const ILLO = {
  dose() {
    let d = ''; const cx = 57, cy = 110;
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI * (i / 20); const L = i === 10 ? 104 : [44, 60, 80, 96][i % 4] + (i % 2 ? 6 : 0); const r0 = 10;
      d += `M${(cx - Math.cos(a) * r0).toFixed(2)} ${(cy - Math.sin(a) * r0).toFixed(2)}L${(cx - Math.cos(a) * L).toFixed(2)} ${(cy - Math.sin(a) * L).toFixed(2)}`;
    }
    return `<path d="${d}"/><path d="M57 100V6" stroke-width="3"/>`;
  },
  capsules() {
    let s = '';
    for (let i = 0; i < 7; i++) { const w = 14 + i * 7, h = w * 1.9; s += `<rect x="${57 - w / 2}" y="${57 - h / 2}" width="${w}" height="${h}" rx="${w / 2}" transform="rotate(36.15 57 57)"/>`; }
    return s;
  },
  lattice() {
    let d = ''; const xs = [3, 57, 111];
    for (let r = 0; r < 6; r++) { const y = 6 + r * 20.4; d += `M${xs[0]} ${y}L${xs[1]} ${y + 10.2}L${xs[2]} ${y}M${xs[0]} ${y + 10.2}L${xs[1]} ${y}L${xs[2]} ${y + 10.2}`; }
    return `<path d="${d}"/>`;
  },
  scale() {
    let d = ''; const hs = [60, 128, 116, 104, 92, 80, 92, 104, 116, 128, 60];
    hs.forEach((h, i) => { const x = 7 + i * 10; for (let k = 0; k < 3; k++) d += `M${x + k * 1.6 - 1.6} 110V${110 - h * 0.78 + k * 5}`; });
    return `<path d="${d}"/>`;
  },
  flow() {
    let d = '';
    for (let k = 0; k < 14; k++) {
      let p = '';
      for (let x = 0; x <= 114; x += 3) { const y = 20 + k * 5.6 + Math.sin(x / 18 + k * 0.35) * 10 * Math.sin(k / 4 + 1); p += (x ? 'L' : 'M') + x + ' ' + y.toFixed(2); }
      d += p;
    }
    return `<path d="${d}"/>`;
  },
  network() {
    const n = 11; const pts = [...Array(n)].map((_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [57 + Math.cos(a) * 50, 57 + Math.sin(a) * 50]; });
    let d = '';
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) d += `M${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}L${pts[j][0].toFixed(1)} ${pts[j][1].toFixed(1)}`;
    return `<path d="${d}"/>`;
  },
  // added for the website: the intelligence layer over production
  layers() {
    // four floating isometric planes; the top one, the intelligence layer, is ruled with fine lines
    let d = ''; const cx = 57, w = 50, h = 16;
    const plane = (y: number) => ({ L: [cx - w, y], T: [cx, y - h], R: [cx + w, y], B: [cx, y + h] });
    for (let k = 0; k < 4; k++) {
      const { L, T, R, B } = plane(30 + k * 22);
      d += `M${L}L${T}L${R}L${B}Z`.replace(/,/g, ' ');
    }
    const { L, T, B } = plane(30);
    for (let t = 1; t < 14; t++) { // lines parallel to the L-T edge, from the L-B edge to the T-R edge
      const f = t / 14, sx = L[0] + (B[0] - L[0]) * f, sy = L[1] + (B[1] - L[1]) * f;
      d += `M${sx.toFixed(2)} ${sy.toFixed(2)}L${(sx + T[0] - L[0]).toFixed(2)} ${(sy + T[1] - L[1]).toFixed(2)}`;
    }
    return `<path d="${d}"/>`;
  },
};
export type IlloKind = keyof typeof ILLO;

export const ILLO_TILES: [IlloKind, string, string][] = [
  ['dose', 'var(--mint)', '#222F30'], ['capsules', 'var(--charcoal)', '#fff'], ['lattice', 'var(--stone)', '#222F30'],
  ['scale', 'var(--offwhite)', '#222F30'], ['flow', 'var(--deepsea)', '#fff'], ['network', 'var(--sage)', '#222F30'],
  ['layers', 'var(--stone)', '#222F30'],
];

export const CURVES: [label: string, bezier: string, ms: number][] = [
  ['Expo out · default', '.16,1,.3,1', 800], ['Expo out · long', '.16,1,.3,1', 1200], ['In-out · loops', '.65,0,.35,1', 800], ['Fast · UI', '.16,1,.3,1', 200],
];

export const NAV: { group: string; items: [id: string, label: string][] }[] = [
  { group: 'Foundations', items: [['overview', 'Overview'], ['brief', 'Brief'], ['logo', 'Logo'], ['colour', 'Colour'], ['type', 'Typography'], ['icons', 'Iconography'], ['components', 'Components']] },
  { group: 'Expression', items: [['three', '3D assets'], ['motion', 'Motion'], ['imagery', 'Imagery']] },
  { group: 'Applications', items: [['stationery', 'Stationery'], ['marketing', 'Marketing'], ['merch', 'Merchandise'], ['facility', 'Facility'], ['products', 'Products'], ['files', 'Files']] },
];

// example data for the line-control UI sparkline
export function sparkline(n = 80) {
  let v = 70; const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) { v += Math.sin(i * 1.7) * 4 + Math.cos(i * 0.6) * 3; v = Math.max(40, Math.min(100, v * 0.9 + 70 * 0.1)); pts.push([(i / (n - 1)) * 600, v]); }
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  return { d, area: d + 'L600 140L0 140Z', last: pts[n - 1][1] };
}
