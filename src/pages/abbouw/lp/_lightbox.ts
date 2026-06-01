/**
 * Realisatie-lightbox — gedeeld over alle LP's (React-markup én innerHTML-markup).
 *
 * Werkt via één gedelegeerde document-click op [data-rl-trigger]. Het element
 * draagt data-rl-photos (JSON-array van image-URL's) en optioneel data-rl-index
 * (welke foto eerst in beeld) + data-rl-title. De lightbox toont de foto's groot;
 * navigeren via pijl-knoppen (‹ ›), toetsenbord-pijlen, klikbare bolletjes,
 * of scrollen/swipen. Sluiten via X, klik op achtergrond of Esc.
 *
 * Eén implementatie i.p.v. drie: roep initRealisatieLightbox() aan in een
 * useEffect per LP en ruim op met de teruggegeven cleanup-functie.
 */
const STYLE_ID = 'rl-lightbox-style';

const CSS = `
.rl-thumb { cursor: pointer; position: relative; }
.rl-thumb::after {
  content: ""; position: absolute; inset: 0; background: rgba(10,22,40,0);
  transition: background .25s ease; pointer-events: none;
}
.rl-thumb:hover::after { background: rgba(10,22,40,0.16); }
.rl-thumb .rl-zoom {
  position: absolute; right: 12px; bottom: 12px; width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(10,22,40,0.55); color: #fff; border-radius: 999px;
  opacity: 0; transform: translateY(6px); transition: opacity .25s ease, transform .25s ease;
  backdrop-filter: blur(2px); pointer-events: none;
}
.rl-thumb:hover .rl-zoom { opacity: 1; transform: translateY(0); }

.rl-overlay {
  position: fixed; inset: 0; z-index: 4000; display: flex; flex-direction: column;
  background: rgba(8,16,30,0.94); opacity: 0; transition: opacity .28s ease;
  -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
}
.rl-overlay.is-open { opacity: 1; }
.rl-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px clamp(16px, 4vw, 40px); color: rgba(255,255,255,0.92);
  font-family: var(--font-display, sans-serif); flex-shrink: 0; position: relative; z-index: 3;
}
.rl-bar-title { font-size: 15px; font-weight: 500; letter-spacing: 0.01em; }
.rl-bar-count { font-size: 13px; color: rgba(255,255,255,0.6); margin-left: 12px; }
.rl-close {
  width: 44px; height: 44px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.22);
  background: rgba(255,255,255,0.06); color: #fff; font-size: 22px; line-height: 1;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: background .2s ease;
}
.rl-close:hover { background: rgba(255,255,255,0.16); }
.rl-scroll {
  flex: 1; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth;
  padding: 0 clamp(12px, 4vw, 40px) 40px;
  display: flex; flex-direction: column; align-items: center; gap: clamp(16px, 2.5vw, 28px);
}
.rl-scroll img {
  display: block; width: 100%; max-width: 960px; height: auto; border-radius: 4px;
  box-shadow: 0 40px 80px -40px rgba(0,0,0,0.6);
}

/* Navigatie-pijlen (desktop) */
.rl-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 54px; height: 54px; border-radius: 999px; z-index: 4;
  border: 1px solid rgba(255,255,255,0.28); background: rgba(20,32,52,0.55);
  color: #fff; cursor: pointer; padding: 0;
  display: flex; align-items: center; justify-content: center;
  -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
  transition: background .2s ease, opacity .2s ease, transform .2s ease;
}
.rl-nav svg { width: 26px; height: 26px; }
.rl-nav:hover { background: rgba(40,56,84,0.85); }
.rl-prev { left: clamp(14px, 3vw, 40px); }
.rl-next { right: clamp(14px, 3vw, 40px); }
.rl-nav:disabled { opacity: 0; pointer-events: none; }

.rl-dots { display: flex; justify-content: center; gap: 9px; padding: 0 0 18px; flex-shrink: 0; position: relative; z-index: 3; }
.rl-dot { width: 9px; height: 9px; border-radius: 999px; background: rgba(255,255,255,0.3); border: 0; padding: 0; cursor: pointer; transition: background .2s ease, transform .2s ease; }
.rl-dot:hover { background: rgba(255,255,255,0.6); }
.rl-dot.is-active { background: rgba(255,255,255,0.95); transform: scale(1.15); }
body.rl-open { overflow: hidden; }
@media (max-width: 720px) {
  .rl-bar { padding: 14px 16px; }
  .rl-nav { display: none; }          /* mobiel = swipe */
  .rl-scroll {
    flex-direction: row; align-items: center;
    overflow-x: auto; overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 0; padding: 0 0 24px;
    scrollbar-width: none;
  }
  .rl-scroll::-webkit-scrollbar { display: none; }
  .rl-scroll img {
    flex: 0 0 100%; width: 100%; max-width: 100%;
    scroll-snap-align: center;
    padding: 0 16px; box-sizing: border-box;
  }
}
`;

const ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
const ARROW_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';

export function initRealisatieLightbox(): () => void {
  if (typeof document === 'undefined') return () => {};

  if (!document.getElementById(STYLE_ID)) {
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  let overlay: HTMLElement | null = null;
  // navigatie-hooks van de open overlay (voor toetsenbord-pijlen op document-niveau)
  let nav: { prev: () => void; next: () => void } | null = null;

  const close = () => {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('rl-open');
    const el = overlay;
    setTimeout(() => { el.remove(); }, 280);
    overlay = null;
    nav = null;
  };

  const open = (photos: string[], startIndex: number, title: string) => {
    if (!photos.length) return;
    close();
    overlay = document.createElement('div');
    overlay.className = 'rl-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title || 'Realisatie');

    const multi = photos.length > 1;
    const safeTitle = (title || 'Realisatie').replace(/</g, '&lt;');
    overlay.innerHTML =
      '<div class="rl-bar">' +
        '<div><span class="rl-bar-title">' + safeTitle + '</span>' +
        '<span class="rl-bar-count">' + photos.length + ' foto\'s</span></div>' +
        '<button type="button" class="rl-close" aria-label="Sluiten">×</button>' +
      '</div>' +
      '<div class="rl-scroll">' +
        photos.map((src) => '<img src="' + src + '" alt="' + safeTitle + '" loading="lazy" />').join('') +
      '</div>' +
      (multi ? '<button type="button" class="rl-nav rl-prev" aria-label="Vorige foto">' + ARROW_L + '</button>' +
               '<button type="button" class="rl-nav rl-next" aria-label="Volgende foto">' + ARROW_R + '</button>' : '') +
      '<div class="rl-dots">' +
        photos.map((_, i) => '<button type="button" class="rl-dot' + (i === startIndex ? ' is-active' : '') + '" aria-label="Foto ' + (i + 1) + '"></button>').join('') +
      '</div>';

    document.body.appendChild(overlay);
    document.body.classList.add('rl-open');
    // force reflow then fade in
    void overlay.offsetWidth;
    overlay.classList.add('is-open');

    const scroll = overlay.querySelector<HTMLElement>('.rl-scroll');
    const imgs = overlay.querySelectorAll<HTMLImageElement>('.rl-scroll img');
    const dots = overlay.querySelectorAll<HTMLElement>('.rl-dot');
    const prevBtn = overlay.querySelector<HTMLButtonElement>('.rl-prev');
    const nextBtn = overlay.querySelector<HTMLButtonElement>('.rl-next');
    const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

    let current = startIndex;
    const setActive = (i: number) => {
      current = i;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
      if (prevBtn) prevBtn.disabled = i <= 0;
      if (nextBtn) nextBtn.disabled = i >= photos.length - 1;
    };
    const goTo = (i: number) => {
      const n = Math.max(0, Math.min(photos.length - 1, i));
      const img = imgs[n];
      if (img) img.scrollIntoView(isMobile() ? { inline: 'center', block: 'nearest', behavior: 'smooth' } : { block: 'center', behavior: 'smooth' });
      setActive(n);
    };

    setActive(startIndex);
    // initieel naar de aangeklikte foto (na fade-in)
    if (startIndex > 0 && imgs[startIndex]) {
      setTimeout(() => imgs[startIndex].scrollIntoView(
        isMobile() ? { inline: 'center', block: 'nearest' } : { block: 'center' }
      ), 60);
    }

    nav = { prev: () => goTo(current - 1), next: () => goTo(current + 1) };

    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); goTo(current - 1); });
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); goTo(current + 1); });
    dots.forEach((d, i) => d.addEventListener('click', (e) => { e.stopPropagation(); goTo(i); }));

    // actieve dot/pijl-status meelopen tijdens handmatig scrollen/swipen (per as)
    if (scroll && dots.length) {
      scroll.addEventListener('scroll', () => {
        let active = 0;
        if (isMobile()) {
          const mid = scroll.scrollLeft + scroll.clientWidth / 2;
          imgs.forEach((img, i) => { if (img.offsetLeft <= mid) active = i; });
        } else {
          const mid = scroll.scrollTop + scroll.clientHeight / 2;
          imgs.forEach((img, i) => { if (img.offsetTop <= mid) active = i; });
        }
        setActive(active);
      }, { passive: true });
    }

    overlay.querySelector('.rl-close')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      // klik op achtergrond/scroll-leegte (niet op een foto/knop) sluit
      if (t === overlay || t.classList.contains('rl-scroll')) close();
    });
  };

  const onClick = (e: MouseEvent) => {
    const trigger = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-rl-trigger]');
    if (!trigger) return;
    e.preventDefault();
    let photos: string[] = [];
    try { photos = JSON.parse(trigger.getAttribute('data-rl-photos') || '[]'); } catch { photos = []; }
    const idx = parseInt(trigger.getAttribute('data-rl-index') || '0', 10) || 0;
    const title = trigger.getAttribute('data-rl-title') || '';
    open(photos, idx, title);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!overlay) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') { e.preventDefault(); nav?.prev(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); nav?.next(); }
  };

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);

  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    close();
    document.getElementById(STYLE_ID)?.remove();
  };
}
