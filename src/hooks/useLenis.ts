import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Initialiseert Lenis smooth-scroll site-breed — voor alle bezoekers.
 * (Bewuste keuze van de opdrachtgever: de smooth-scroll/animaties blijven aan,
 *  ook als de bezoeker `prefers-reduced-motion` heeft staan.)
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      // Lerp-based smoothing. Lager = zwaarder/floaty (voelt laggy), hoger = snappy.
      // 0.085 voelde sloom; 0.11 is buttery maar reageert direct op je input.
      // (Let op: zodra `lerp` gezet is, negeert Lenis `duration`/`easing` — die zaten
      //  hier nutteloos bij.)
      lerp: 0.11,
      smoothWheel: true,
      // 0.95 maakte één muiswiel-notch te kort → "stroperig" gevoel. 1.0 = natuurlijk.
      wheelMultiplier: 1,
      // touch blijft native — momentum op mobiel voelt al goed.
      touchMultiplier: 1,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
