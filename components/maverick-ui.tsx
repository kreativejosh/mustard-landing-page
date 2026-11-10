'use client';
// Illustrative Maverick OS screen: steps through the six workflows the current demonstration supports
// (from the website copy). Clearly labelled as a simulated demonstration; values are placeholders.
import { useEffect, useRef, useState } from 'react';
import { TECHNOLOGY } from '@/lib/copy';

const STEPS = TECHNOLOGY.today.workflows;

export function MaverickUI({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0; let vis = false;
    const io = new IntersectionObserver((e) => { vis = e[0].isIntersecting; }); if (ref.current) io.observe(ref.current);
    id = window.setInterval(() => { if (vis) setStep((s) => (s + 1) % STEPS.length); }, 2200);
    return () => { clearInterval(id); io.disconnect(); };
  }, []);
  return (
    <div ref={ref} className={`mos${compact ? ' mos-c' : ''}`} role="img" aria-label="Illustrative Maverick OS screen stepping through a simulated batch workflow">
      <div className="mos-bar">
        <span className="mos-dots"><i /><i /><i /></span>
        <span className="mos-t">Maverick OS</span>
        <span className="mos-sim">Simulated demonstration</span>
      </div>
      <div className="mos-body">
        <aside className="mos-side">
          <span className="k">Batch</span>
          <b>MB-0000-00</b>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s} className={i < step ? 'done' : i === step ? 'now' : undefined}><em>{String(i + 1).padStart(2, '0')}</em>{s}</li>
            ))}
          </ol>
        </aside>
        <section className="mos-main">
          <div className="mos-head"><span className="k">Current step</span><b key={step} className="mos-step">{STEPS[step]}</b></div>
          <div className="mos-chart" aria-hidden="true">
            {Array.from({ length: 32 }, (_, i) => <i key={i} style={{ height: `${38 + 26 * Math.sin((i + step * 3) / 3.2) + 14 * Math.sin(i / 1.7)}%` }} />)}
          </div>
          <div className="mos-rows">
            {['Parameter', 'Parameter', 'Parameter'].map((p, i) => (
              <div key={i} className="mos-row"><span>{p} 0{i + 1}</span><span className="mono">00.0</span><span className={`chip${i <= step % 3 ? ' ok' : ''}`}>{i <= step % 3 ? 'Checked' : 'Pending'}</span></div>
            ))}
          </div>
          <div className="mos-sign"><span className="k">Sign-off</span><span className="sig" /><span className="mono">00/00/0000 00:00</span></div>
        </section>
      </div>
    </div>
  );
}
