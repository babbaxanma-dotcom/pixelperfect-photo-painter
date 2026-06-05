/**
 * Voor/na sleep-slider voor de gevel-LP's (bv. hervoegen).
 * Markup-contract:
 *   <div class="ba-slider" data-ba>
 *     <img class="ba-base" ... />                 // NA (onderlaag, volledig)
 *     <div class="ba-clip"><img ... /></div>      // VOOR (bovenlaag, geclipt)
 *     <div class="ba-handle"><span>…</span></div>
 *     <span class="ba-tag ba-tag-l">Voor</span>
 *     <span class="ba-tag ba-tag-r">Na</span>
 *   </div>
 * Sleep (pointer) of pijltjes om te onthullen. Idempotent.
 */
export function initBeforeAfter(): void {
  const sliders = Array.from(document.querySelectorAll<HTMLElement>('[data-ba]'));
  sliders.forEach((slider) => {
    if (slider.dataset.baInit) return;
    slider.dataset.baInit = '1';

    const clip = slider.querySelector<HTMLElement>('.ba-clip');
    const handle = slider.querySelector<HTMLElement>('.ba-handle');
    const clipImg = slider.querySelector<HTMLImageElement>('.ba-clip img');
    if (!clip || !handle) return;

    const sizeImg = () => { if (clipImg) clipImg.style.width = slider.clientWidth + 'px'; };
    sizeImg();
    window.addEventListener('resize', sizeImg);

    const apply = (pct: number) => {
      const p = Math.max(0, Math.min(100, pct));
      clip.style.width = p + '%';
      handle.style.left = p + '%';
      slider.setAttribute('aria-valuenow', String(Math.round(p)));
    };
    apply(50);

    let dragging = false;
    const pctFromX = (clientX: number) => {
      const r = slider.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      slider.setPointerCapture?.(e.pointerId);
      apply(pctFromX(e.clientX));
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => { if (dragging) apply(pctFromX(e.clientX)); };
    const onUp = () => { dragging = false; };
    slider.addEventListener('pointerdown', onDown);
    slider.addEventListener('pointermove', onMove);
    slider.addEventListener('pointerup', onUp);
    slider.addEventListener('pointercancel', onUp);

    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', 'Voor en na hervoegen');
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e: KeyboardEvent) => {
      const cur = Number(slider.getAttribute('aria-valuenow') || '50');
      if (e.key === 'ArrowLeft') { apply(cur - 4); e.preventDefault(); }
      if (e.key === 'ArrowRight') { apply(cur + 4); e.preventDefault(); }
    });
  });
}
