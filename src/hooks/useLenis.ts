import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Initialiseert Lenis smooth-scroll site-breed.
 * Hooks ook alle in-page anchor-clicks (#hash, /pad#hash) zodat ze
 * via Lenis vloeien i.p.v. de native instant-jump.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    // Expose globaal voor componenten die programmatisch willen scrollen
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Anchor-link click handler: vang #hash + same-page CTA-buttons
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      // alleen pure in-page hashes ("#contact") of huidige pad + hash
      if (!href.startsWith('#')) return;
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
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
