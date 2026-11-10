'use client';
// Full-bleed brand motion loop (design system motion assets). Plays muted inline, pauses when off-screen,
// and shows only the still frame for people who prefer reduced motion.
import { useEffect, useRef, useState } from 'react';

export function MotionBg({ src, poster, className = '' }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setStill(true); return; }
    const v = ref.current; if (!v) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.1 });
    io.observe(v); return () => io.disconnect();
  }, []);
  if (still) return <img className={className} src={poster} alt="" aria-hidden="true" />;
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true" />;
}
