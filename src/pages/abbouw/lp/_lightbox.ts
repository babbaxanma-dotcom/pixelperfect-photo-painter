/**
 * Realisatie-lightbox — gedeeld over alle LP's (React-markup én innerHTML-markup).
 *
 * Werkt via één gedelegeerde document-click op [data-rl-trigger]. Het element
 * draagt data-rl-photos (JSON-array van image-URL's) en optioneel data-rl-index
 * (welke foto eerst in beeld) + data-rl-title. De lightbox toont de foto's groot
 * en verticaal scrollbaar; sluiten via X, klik op achtergrond of Esc.
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
  font-family: var(--font-display, sans-serif); flex-shrink: 0;
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
.rl-dots { display: flex; justify-content: center; gap: 8px; padding: 0 0 18px; flex-shrink: 0; }
.rl-dot { width: 7px; height: 7px; border-radius: 999px; background: rgba(255,255,255,0.3); }
.rl-dot.is-active { background: rgba(255,255,255,0.9); }
body.rl-open { overflow: hidden; }
@media (max-width: 720px) { .rl-bar { padding: 14px 16px; } }
`;

export function initRealisatieLightbox(): () => void {
  if (typeof document === 'undefined') return () => {};

  if (!document.getElementById(STYLE_ID)) {
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  let overlay: HTMLElement | null = null;

  const close = () => {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('rl-open');
    const el = overlay;
    setTimeout(() => { el.remove(); }, 280);
    overlay = null;
  };

  const open = (photos: string[], startIndex: number, title: string) => {
    if (!photos.length) return;
    close();
    overlay = document.createElement('div');
    overlay.className = 'rl-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title || 'Realisatie');

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
      '<div class="rl-dots">' +
        photos.map((_, i) => '<span class="rl-dot' + (i === startIndex ? ' is-active' : '') + '"></span>').join('') +
      '</div>';

    document.body.appendChild(overlay);
    document.body.classList.add('rl-open');
    // force reflow then fade in
    void overlay.offsetWidth;
    overlay.classList.add('is-open');

    const scroll = overlay.querySelector<HTMLElement>('.rl-scroll');
    const imgs = overlay.querySelectorAll<HTMLImageElement>('.rl-scroll img');
    const dots = overlay.querySelectorAll<HTMLElement>('.rl-dot');

    // scroll naar de aangeklikte foto (na fade-in)
    if (startIndex > 0 && imgs[startIndex]) {
      setTimeout(() => imgs[startIndex].scrollIntoView({ block: 'center' }), 60);
    }

    // actieve dot meelopen tijdens scrollen
    if (scroll && dots.length) {
      scroll.addEventListener('scroll', () => {
        let active = 0;
        const mid = scroll.scrollTop + scroll.clientHeight / 2;
        imgs.forEach((img, i) => { if (img.offsetTop <= mid) active = i; });
        dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
      }, { passive: true });
    }

    overlay.querySelector('.rl-close')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      // klik op achtergrond/scroll-leegte (niet op een foto) sluit
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

  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);

  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    close();
    document.getElementById(STYLE_ID)?.remove();
  };
}
