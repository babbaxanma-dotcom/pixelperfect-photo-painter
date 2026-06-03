/**
 * Subtiele scroll-reveal voor de landingspagina's (.tr-systeem).
 * Content-blokken faden zacht omhoog zodra ze in beeld komen — niet overdreven.
 * Eén call per LP in een useEffect, net als initRealisatieLightbox. Returnt cleanup.
 */
export function initLpReveal(): () => void {
  if (typeof document === 'undefined') return () => {};
  const root = document.querySelector<HTMLElement>('.tr');
  if (!root) return () => {};

  // CSS één keer injecteren — self-contained, geen losse stylesheet nodig.
  const STYLE_ID = 'lp-reveal-style';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.tr [data-reveal]{opacity:0;' +
      'transition:opacity .35s cubic-bezier(.25,.46,.45,.94);' +
      'transition-delay:var(--reveal-delay,0ms);will-change:opacity}' +
      '.tr [data-reveal].revealed{opacity:1}';
    document.head.appendChild(s);
  }

  // Reveal-doelen: de content-blokken binnen elke sectie (nooit de hero).
  const reveals: HTMLElement[] = [];
  root.querySelectorAll<HTMLElement>('.tr-section').forEach((section) => {
    const wrap = section.querySelector<HTMLElement>(':scope > .tr-wrap') ?? section;
    let i = 0;
    Array.from(wrap.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      if (child.matches('script, style') || child.hasAttribute('data-reveal')) return;
      child.setAttribute('data-reveal', '');
      child.style.setProperty('--reveal-delay', `${Math.min(i, 3) * 70}ms`);
      reveals.push(child);
      i++;
    });
  });

  const revealAll = () => reveals.forEach((el) => el.classList.add('revealed'));

  if (!('IntersectionObserver' in window)) {
    revealAll();
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  reveals.forEach((el) => io.observe(el));

  // Veiligheidsnet: content nooit permanent verborgen laten als er iets misgaat.
  const safety = window.setTimeout(revealAll, 2600);

  return () => {
    io.disconnect();
    window.clearTimeout(safety);
  };
}
