/**
 * "Uitgevoerd werk" zoals op de oude home (Mohammed, 12 okt: "bij uitgevoerd werk, doe dat naar hoe dat eerst was"),
 * in de letter en kleuren van de nieuwe site, zoals onderaan.ts dat deed voor het onderste deel. (De dienstensectie is
 * een eigen ontwerp: home-diensten.ts.)
 *
 * Bron van de opbouw: de oude home = LpReplica.tsx met HOME (commit 9727a84): LpReplica.tsx r.840-884 en r.178-299,
 * r.409-426 (één doorlopend spoor van vierkante tegels, de reeks twee keer in de DOM voor een naadloze lus, elke 4 s één
 * tegel verder met een gouden vullijn eronder, pauze bij muis/focus, 6 s rust na een aanraking, veeg of pijlklik, pijlen
 * "Vorige foto"/"Volgende foto", geen autoplay bij "minder beweging" of een verborgen tabblad), opmaak stijl.ts
 * r.589-610, r.769-782, r.952-957. Daaronder de voor/na-schuif, binnen dezelfde sectie (LpReplica.tsx r.878-882).
 *
 * Maten: stijl.ts-px x 1,14 in --u (op 1265 px gelijk aan de oude pagina), breedte = het raam van de nieuwe site
 * (1200u), zoals onderaan.css. Het gedrag van het spoor zit in het eigen element <ab-werkspoor> hieronder: het hangt
 * zich aan zodra de HTML in de pagina staat en ruimt op als de pagina weggaat; gedrag.ts hoeft er niets voor te weten.
 */
import { ICOON, beeld, esc } from './schil';
import { BEELDEN } from './beelden';
import type { Foto } from './blokken';
import './home-oud.css';

/* Eigen foto's die (nog) niet als webp in src/assets/bf staan (IMG_9030): de jpg zelf, zoals op de oude home. */
const JPG = import.meta.glob('/src/assets/lp-diensten/eigen/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

function foto(f: Foto, o: { cls: string; sizes: string; alt?: string }) {
  const alt = o.alt ?? f.alt;
  if (BEELDEN[f.naam]) return beeld(f.naam, { cls: o.cls, alt, sizes: o.sizes, pos: f.pos });
  const src = JPG['/src/assets/lp-diensten/eigen/' + f.naam + '.jpg'];
  if (!src) throw new Error('home-oud: foto ontbreekt: ' + f.naam);
  return `<img class="${o.cls}" src="${src}" alt="${esc(alt)}" decoding="async" loading="lazy"${f.pos ? ` style="object-position:${f.pos}"` : ''}>`;
}

/* ---------- uitgevoerd werk (oude opbouw) ---------- */
export function werkOud(o: { id: string; kop: string; fotos: Foto[]; na?: string }) {
  /* De reeks staat er twee keer: zo springt het spoor aan het eind onzichtbaar terug naar dezelfde foto in de eerste
     reeks. De tweede reeks is voor een schermlezer verborgen en heeft lege alt-teksten (LpReplica.tsx r.849-861). */
  const tegels = [0, 1].map((reeks) => o.fotos.map((f) => `<figure class="bf-ho-foto"${reeks ? ' aria-hidden="true"' : ''}>${foto(f, { cls: 'bf-ho-foto__beeld', sizes: '(max-width: 1000px) 78vw, 382px', alt: reeks ? '' : f.alt })}</figure>`).join('')).join('');
  return `<section class="bf-ho-werk" id="${o.id}" aria-labelledby="${o.id}-kop">
<div class="bf-ho-raam"><h2 class="bf-h2 bf-h2--midden" id="${o.id}-kop">${esc(o.kop)}</h2></div>
<ab-werkspoor class="bf-ho-raam bf-ho-werk__vat">
<div class="bf-ho-spoor" role="group" aria-label="Uitgevoerde projecten">${tegels}</div>
<div class="bf-ho-lijn" aria-hidden="true"><i class="bf-ho-vul"></i></div>
<div class="bf-ho-bediening"><button type="button" data-vorige aria-label="Vorige foto">${ICOON.chevL}</button><button type="button" data-volgende aria-label="Volgende foto">${ICOON.chevR}</button></div>
</ab-werkspoor>
${o.na || ''}</section>`;
}

/* ---------- gedrag van het spoor (LpReplica.tsx r.178-299 en r.409-426) ---------- */
const TIK = 4000;
const RUST = 6000;

function definieerWerkspoor() {
  if (typeof window === 'undefined' || !('customElements' in window) || customElements.get('ab-werkspoor')) return;

  class Werkspoor extends HTMLElement {
    private opruim: (() => void)[] = [];

    connectedCallback() {
      const spoor = this.querySelector<HTMLElement>('.bf-ho-spoor');
      const vul = this.querySelector<HTMLElement>('.bf-ho-vul');
      if (!spoor || this.opruim.length) return;
      const stil = !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const zacht: ScrollBehavior = stil ? 'instant' : 'smooth';
      const op = (doel: EventTarget, type: string, fn: EventListenerOrEventListenerObject, opt?: AddEventListenerOptions) => {
        doel.addEventListener(type, fn, opt);
        this.opruim.push(() => doel.removeEventListener(type, fn, opt));
      };

      /* De index wordt GETELD, niet afgelezen: tijdens de eigen zachte scroll ligt scrollLeft tussen twee tegels in.
         Verzet iets anders het spoor (een veeg), dan wint de DOM zodra het verschil groter is dan één tegel. */
      let index = 0;
      const tegels = () => Array.from(spoor.children) as HTMLElement[];
      /* Positie van tegel i ten opzichte van tegel 0, uit getBoundingClientRect: de tegels zijn een derde van het raam
         breed en dus geen heel aantal pixels; offsetLeft rondt af en liet de lus per reeks wegkruipen (r.205-214). */
      const stand = (t: HTMLElement[], i: number) => t[i].getBoundingClientRect().left - t[0].getBoundingClientRect().left;
      /* Verzetten ZONDER animatie: het spoor heeft scroll-behavior smooth in de stijl (r.215-227). */
      const spring = (naar: number) => {
        const bewaar = spoor.style.scrollBehavior;
        spoor.style.scrollBehavior = 'auto';
        spoor.scrollLeft = naar;
        void spoor.scrollLeft;
        spoor.style.scrollBehavior = bewaar;
      };
      const stapLus = (richting: -1 | 1) => {
        const t = tegels();
        const helft = Math.floor(t.length / 2);
        if (!helft) return;
        let i = Math.min(Math.max(index, 0), t.length - 1);
        const breedte = t.length > 1 ? stand(t, 1) : 0;
        if (breedte > 0 && Math.abs(stand(t, i) - spoor.scrollLeft) > breedte) {
          let dichtst = Infinity;
          t.forEach((_, j) => { const a = Math.abs(stand(t, j) - spoor.scrollLeft); if (a < dichtst) { dichtst = a; i = j; } });
        }
        if (i >= helft) { i -= helft; spring(stand(t, i)); }
        let doel = i + richting;
        if (doel < 0) { i += helft; spring(stand(t, i)); doel = i - 1; }
        index = doel;
        spoor.scrollTo({ left: stand(t, doel), behavior: zacht });
      };

      /* De vullijn begint op nul bij elke nieuwe foto en bevriest (springt niet terug) bij een pauze (r.184-190). */
      const nieuweRonde = () => {
        if (!vul) return;
        vul.style.animation = 'none';
        void vul.offsetWidth;
        vul.style.animation = '';
      };
      let klok = 0, hervatKlok = 0;
      const startKlok = () => {
        window.clearInterval(klok);
        if (stil) return;
        klok = window.setInterval(() => { if (document.hidden) return; stapLus(1); nieuweRonde(); }, TIK);
      };
      const zetStil = (aan: boolean) => { this.classList.toggle('is-stil', aan); };
      const pauzeer = (hervatNa = 0) => {
        window.clearTimeout(hervatKlok);
        window.clearInterval(klok);
        zetStil(true);
        if (hervatNa > 0) hervatKlok = window.setTimeout(() => { zetStil(false); nieuweRonde(); startKlok(); }, hervatNa);
      };
      const hervat = () => { window.clearTimeout(hervatKlok); zetStil(false); nieuweRonde(); startKlok(); };

      op(this, 'pointerenter', () => pauzeer());
      op(this, 'pointerleave', hervat);
      op(this, 'focusin', () => pauzeer());
      op(this, 'focusout', hervat);
      op(this, 'touchstart', () => pauzeer(RUST), { passive: true });
      op(this, 'wheel', () => pauzeer(RUST), { passive: true });
      /* Wie zelf op een pijl klikt, neemt het over: 6 s rust (r.277-282). */
      const knop = (sel: string, r: -1 | 1) => {
        const b = this.querySelector(sel);
        if (b) op(b, 'click', () => { pauzeer(RUST); nieuweRonde(); stapLus(r); });
      };
      knop('[data-vorige]', -1);
      knop('[data-volgende]', 1);

      startKlok();
      this.opruim.push(() => { window.clearInterval(klok); window.clearTimeout(hervatKlok); });
    }

    disconnectedCallback() {
      this.opruim.splice(0).reverse().forEach((f) => f());
    }
  }

  customElements.define('ab-werkspoor', Werkspoor);
}
definieerWerkspoor();
