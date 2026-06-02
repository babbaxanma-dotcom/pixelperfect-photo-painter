/**
 * Subtiele mobiele bel-knop (navy, rond, rechtsonder) die bij het scrollen verschijnt.
 * Self-contained: injecteert eigen markup + CSS. Eén call per LP in een useEffect,
 * net als initLpReveal / initRealisatieLightbox. Returnt cleanup.
 */
const PHONE_HREF = 'tel:+32460207788';

export function initLpCallFab(): () => void {
  if (typeof document === 'undefined') return () => {};
  if (document.getElementById('tr-fab-call')) return () => {};

  const STYLE_ID = 'tr-fab-style';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '#tr-fab-call{position:fixed;right:16px;bottom:16px;z-index:90;width:54px;height:54px;border-radius:50%;' +
      'background:#0a1628;color:#fff;display:none;align-items:center;justify-content:center;text-decoration:none;' +
      'box-shadow:0 10px 26px rgba(10,22,40,.30);opacity:0;transform:translateY(12px) scale(.9);' +
      'transition:opacity .3s ease,transform .3s ease}' +
      '#tr-fab-call svg{width:24px;height:24px;display:block}' +
      '#tr-fab-call.is-visible{opacity:1;transform:none}' +
      '#tr-fab-call:active{transform:scale(.94)}' +
      '@media (max-width:760px){#tr-fab-call{display:flex}}';
    document.head.appendChild(s);
  }

  const a = document.createElement('a');
  a.id = 'tr-fab-call';
  a.href = PHONE_HREF;
  a.setAttribute('aria-label', 'Bel ons');
  a.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  document.body.appendChild(a);

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      a.classList.toggle('is-visible', window.scrollY > 420);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  return () => {
    window.removeEventListener('scroll', onScroll);
    a.remove();
  };
}
