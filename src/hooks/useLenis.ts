import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Lenis smooth-scroll — alleen op desktop. Mobile gebruikt native scroll
 * (al smooth + 60fps op iOS/Android, Lenis voegde alleen lag toe).
 * Anchor links via native scrollIntoView op mobile, Lenis op desktop.
 */
export function useLenis() {
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' &&
      (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) &&
      window.matchMedia('(max-width: 900px)').matches;

    // === MOBILE PATH: pure native scroll, geen Lenis ===
    if (isTouch) {
      const onAnchorClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        if (!href.startsWith('#') || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      };
      document.addEventListener('click', onAnchorClick);
      return () => document.removeEventListener('click', onAnchorClick);
    }

    // === DESKTOP PATH: Lenis met sneller duration ===
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#') || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 0.6 });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      cancelAnimationFrame(rafId);
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      lenis.destroy();
    };
  }, []);
}
