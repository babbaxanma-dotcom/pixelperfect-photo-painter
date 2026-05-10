import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Initialiseert Lenis smooth-scroll site-breed.
 * Respecteert prefers-reduced-motion: bij 'reduce' wordt Lenis niet geactiveerd.
 * Native scroll-anchors (anchors, hash links, smooth-scroll JS) blijven werken
 * via Lenis' eigen anchor handling.
 */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // raak touch niet aan — native momentum op mobiel voelt beter
      touchMultiplier: 1,
      wheelMultiplier: 1,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Als de gebruiker tijdens de sessie reduce-motion aanzet → stop Lenis.
    const onChange = () => {
      if (reduced.matches) {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      }
    };
    reduced.addEventListener?.('change', onChange);

    return () => {
      reduced.removeEventListener?.('change', onChange);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
