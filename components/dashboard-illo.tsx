// Abstract dashboard illustration for manufacturing intelligence: no real screens, labels or values,
// only the idea of monitoring in motion (a live trace, working bars, a sweeping gauge, a scanning list).
const BARS = [46, 62, 38, 70, 54, 82, 60, 44, 66, 90, 58, 72, 50, 64, 78, 56];
const TRACE = 'M0 64 C20 60 30 40 50 42 S80 70 100 58 S130 24 150 30 S180 66 200 54 S230 20 250 28 S280 60 300 52 S330 34 350 40 S380 62 400 64';
const TRACE2 = 'M0 78 C25 74 35 66 55 70 S85 84 105 78 S135 58 155 62 S185 80 205 74 S235 56 255 60 S285 78 305 72 S335 62 355 66 S385 80 400 78';

export function DashboardIllo() {
  return (
    <svg className="dash" viewBox="0 0 520 330" role="img" aria-label="Illustration of a manufacturing dashboard in motion">
      <rect className="d-win" x="0.5" y="0.5" width="519" height="329" rx="8" />
      <path className="d-bar" d="M0.5 30.5H519.5" />
      {[0, 1, 2].map((i) => <circle key={i} className="d-dot" cx={16 + i * 12} cy="15.5" r="3.5" />)}
      <rect className="d-sk" x="58" y="12" width="70" height="7" rx="2" />
      <rect className="d-chip" x="452" y="10" width="54" height="11" rx="2" />

      {/* left list: a highlight scans through the steps */}
      <rect className="d-side" x="0.5" y="30.5" width="124" height="299" />
      <g className="d-scan"><rect className="d-hi" x="10" y="44" width="104" height="26" rx="3" /></g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(18 ${50 + i * 40})`}>
          <rect className="d-sq" width="9" height="9" rx="1.5" style={{ animationDelay: `${i * 0.6}s` }} />
          <rect className="d-sk" x="18" y="1" width={[64, 52, 70, 58, 66, 48][i]} height="7" rx="2" />
        </g>
      ))}

      {/* live trace: two lines drift left continuously */}
      <rect className="d-card" x="140" y="46" width="364" height="128" rx="6" />
      <rect className="d-sk" x="156" y="60" width="54" height="7" rx="2" />
      <rect className="d-sk dim" x="440" y="60" width="48" height="7" rx="2" />
      <svg x="141" y="80" width="362" height="92" viewBox="0 0 400 100" preserveAspectRatio="none">
        {[24, 48, 72].map((y) => <path key={y} className="d-grid" d={`M0 ${y}H400`} />)}
        <g className="d-drift">
          <path className="d-line2" d={TRACE2} /><path className="d-line2" d={TRACE2} transform="translate(400 0)" />
          <path className="d-line" d={TRACE} /><path className="d-line" d={TRACE} transform="translate(400 0)" />
        </g>
      </svg>

      {/* working bars */}
      <rect className="d-card" x="140" y="186" width="236" height="128" rx="6" />
      <rect className="d-sk" x="156" y="200" width="44" height="7" rx="2" />
      {BARS.map((h, i) => (
        <rect key={i} className={`d-col${i % 5 === 3 ? ' on' : ''}`} x={158 + i * 13} y={298 - h} width="8" height={h} rx="1"
          style={{ animationDelay: `${(i % 6) * -0.45}s`, animationDuration: `${2.4 + (i % 4) * 0.5}s` }} />
      ))}

      {/* sweeping gauge */}
      <rect className="d-card" x="388" y="186" width="116" height="128" rx="6" />
      <path className="d-arc" d="M406 286 A40 40 0 0 1 486 286" />
      <path className="d-arc on" d="M406 286 A40 40 0 0 1 462 248" />
      <g className="d-needle"><path d="M446 286 L446 254" /><circle cx="446" cy="286" r="4" /></g>
      <rect className="d-sk" x="420" y="298" width="52" height="6" rx="2" />
    </svg>
  );
}
