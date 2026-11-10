// Mustard Bio illustration pack (114 grid, 1 px line).
// Source of truth: the brand design system (mustard-bio-brand: web/lib/brand.ts, exported to identity/assets/illustrations/).
// Copy changes from there; do not draw new marks here without adding them to the pack.

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

/** The pack's flow illustration stretched to a wide band (same line count and wave), for the footer. */
export function flowWide(width = 1140) {
  let d = '';
  for (let k = 0; k < 14; k++) {
    let p = '';
    for (let x = 0; x <= width; x += 6) { const y = 20 + k * 5.6 + Math.sin(x / 90 + k * 0.35) * 10 * Math.sin(k / 4 + 1); p += (x ? 'L' : 'M') + x + ' ' + y.toFixed(2); }
    d += p;
  }
  return `<path d="${d}"/>`;
}
