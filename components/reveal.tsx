'use client';
// One observer for the whole page: [data-r] elements get .in when they enter the viewport;
// [data-px] images drift slightly with scroll; the header rule tracks reading progress.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('[data-r]:not(.in)').forEach((el) => io.observe(el));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const px = [...document.querySelectorAll<HTMLElement>('[data-px]')];
    let raf = 0;
    const tick = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress', String(h > 0 ? Math.min(1, scrollY / h) : 0));
      if (!reduce) for (const el of px) { const b = el.parentElement!.getBoundingClientRect(); const k = Math.max(-1, Math.min(1, (b.top + b.height / 2 - innerHeight / 2) / innerHeight)); el.style.transform = `translate3d(0, ${(-k * 6).toFixed(2)}%, 0) scale(1.12)`; }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { io.disconnect(); removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [path]);
  return null;
}
