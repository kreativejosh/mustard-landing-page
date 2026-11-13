'use client';
// Live "flow" shader from the brand scene library (brand/scenes.js, synced): slow folds of tinted glass.
// A still poster sits underneath, so the hero never flashes empty; reduced motion renders one frame.
import { useEffect, useRef } from 'react';

export function HeroCanvas({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let raf = 0, alive = true, cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      const SCENES: any = (await import('@/brand/scenes.js')).SCENES;
      const cv = ref.current; if (!cv || !alive) return;
      let r: any;
      try { r = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: false }); } catch { return; }
      r.setPixelRatio(Math.min(devicePixelRatio, 1.5)); r.outputColorSpace = THREE.SRGBColorSpace;
      let S: any;
      const size = () => { const b = cv.parentElement!.getBoundingClientRect(); r.setSize(b.width, b.height, false); S = SCENES.flow({ aspect: b.width / b.height, variant }); };
      size(); addEventListener('resize', size);
      let vis = true; const io = new IntersectionObserver((e) => { vis = e[0].isIntersecting; }); io.observe(cv);
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; const t0 = performance.now();
      const loop = () => {
        if (vis) { S.update(reduce ? 3 : 3 + (performance.now() - t0) / 1000); r.render(S.scene, S.camera); cv.classList.add('live'); }
        if (!reduce && alive) raf = requestAnimationFrame(loop);
      };
      loop();
      cleanup = () => { removeEventListener('resize', size); io.disconnect(); r.dispose(); };
    })();
    return () => { alive = false; cancelAnimationFrame(raf); cleanup(); };
  }, [variant]);
  return <canvas ref={ref} className="flow" aria-hidden="true" />;
}
