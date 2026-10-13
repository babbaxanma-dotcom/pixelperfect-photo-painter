/**
 * Dienstensectie van de home als één horizontale rij fotokaarten. Mohammed, 13 okt: "bij diensten zet ze naast elkaar,
 * ipv zo vakjes, dus naast elkaar en je kan naar zijkant scrollen, en constant wanneer je op t vakje zelf bent dat het
 * iets harder in beeld is, en begin wederom in het midden dat beide kanten vakjes hebben". Eigen ontwerp, niet de
 * slider van bfbouw.be (12 okt: "dat het niet lijkt op bfbouw").
 *
 * Opbouw: kop links, introzin en knop rechts (de bestaande teksten van HOME_BF.diensten, ongewijzigd); daaronder de zes
 * kaarten naast elkaar, allemaal even groot, over de volle breedte van het scherm. Elke kaart is één link naar de
 * afdelingspagina: foto, donkere verlooplaag onderaan, naam (h3), de kaartzin en een pijl.
 *  - De rij scrolt horizontaal en klikt vast op het midden (scroll-snap): vinger, trackpad of shift + wiel.
 *  - De kaart in het midden staat op volle grootte en helderheid; de andere zijn kleiner (0,92) en gedimd. Muis of
 *    toetsenbordfocus op een kaart brengt ook die kaart op volle grootte en helderheid. Overgang 250 ms; bij "minder
 *    beweging" geen schaal, wel het helderheidsverschil.
 *  - Bij het laden staat de 3e kaart in het midden, zodat er links en rechts kaarten staan. Dat gebeurt met scrollLeft
 *    van de rij zelf: de pagina verspringt niet.
 *  - Ronde knoppen links en rechts (stijl van de knoppen bij "Uitgevoerd werk", home-oud.css) schuiven één kaart.
 *  - Geen autoplay en geen lus.
 *
 * Het gedrag zit in het eigen element <ab-dienstenrij> hieronder (zoals <ab-werkspoor> in home-oud.ts): het hangt zich
 * aan zodra de HTML in de pagina staat en ruimt op als de pagina weggaat; gedrag.ts hoeft er niets voor te weten.
 *
 * Tekst en foto's komen binnen via de parameters (inhoud.ts, HOME_BF.diensten: één vaste echte foto per afdeling, zoals
 * op /diensten en de afdelingspagina's).
 */
import { ICOON, beeld, esc } from './schil';
import type { Dienstkaart } from './blokken';
import './home-diensten.css';

const PIJL = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 14.5 14.5 5.5M7.5 5.5h7v7"/></svg>';

/** Welke kaart bij het laden in het midden staat (0 = de eerste): de 4e van 6. */
const START = 3;

export function dienstenCarrousel(o: { id: string; kop: string; tekst?: string; knop?: { tekst: string; href: string }; kaarten: Dienstkaart[] }) {
  const start = Math.min(START, o.kaarten.length - 1);
  const stand = (i: number) => (i === start ? ' is-midden' : i < start ? ' is-links' : ' is-rechts');
  const kaart = (k: Dienstkaart, i: number) => `<li class="bf-hd-kaart${stand(i)}"><a class="bf-hd-tegel" href="${k.href}">
${beeld(k.foto.naam, { cls: 'bf-hd-tegel__beeld', alt: k.foto.alt, sizes: '(max-width: 538px) 78vw, (max-width: 1000px) 420px, 480px', pos: k.foto.pos })}
<span class="bf-hd-tegel__pijl" aria-hidden="true">${PIJL}</span>
<span class="bf-hd-tegel__sluier" aria-hidden="true"></span>
<span class="bf-hd-tegel__tekst"><h3>${esc(k.titel)}</h3><span class="bf-hd-tegel__zin">${esc(k.tekst)}</span></span>
</a></li>`;
  const rechts = o.tekst || o.knop ? `<div class="bf-hd-kop__rechts">${o.tekst ? `<p>${esc(o.tekst)}</p>` : ''}${o.knop ? `<a class="bf-knop bf-hd-knop" href="${o.knop.href}">${esc(o.knop.tekst)}${ICOON.pijlR}</a>` : ''}</div>` : '';
  return `<section class="bf-hd" id="${o.id}" aria-labelledby="${o.id}-kop"><div class="bf-hd-raam">
<div class="bf-hd-kop"><h2 class="bf-h2" id="${o.id}-kop">${esc(o.kop)}</h2>${rechts}</div>
</div>
<ab-dienstenrij class="bf-hd-rij" data-start="${start}">
<ul class="bf-hd-baan">${o.kaarten.map(kaart).join('')}</ul>
<button type="button" class="bf-hd-schuif bf-hd-schuif--vorige" data-vorige aria-label="Vorige dienst"${start === 0 ? ' aria-disabled="true"' : ''}>${ICOON.chevL}</button>
<button type="button" class="bf-hd-schuif bf-hd-schuif--volgende" data-volgende aria-label="Volgende dienst"${start === o.kaarten.length - 1 ? ' aria-disabled="true"' : ''}>${ICOON.chevR}</button>
</ab-dienstenrij>
</section>`;
}

/* ---------- gedrag van de rij ---------- */
function definieerDienstenrij() {
  if (typeof window === 'undefined' || !('customElements' in window) || customElements.get('ab-dienstenrij')) return;

  class Dienstenrij extends HTMLElement {
    private opruim: (() => void)[] = [];

    connectedCallback() {
      const baan = this.querySelector<HTMLElement>('.bf-hd-baan');
      const vorige = this.querySelector<HTMLElement>('[data-vorige]');
      const volgende = this.querySelector<HTMLElement>('[data-volgende]');
      if (!baan || this.opruim.length) return;
      const kaarten = Array.from(baan.children) as HTMLElement[];
      const n = kaarten.length;
      if (!n) return;
      const stil = !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const op = (doel: EventTarget, type: string, fn: EventListenerOrEventListenerObject, opt?: AddEventListenerOptions) => {
        doel.addEventListener(type, fn, opt);
        this.opruim.push(() => doel.removeEventListener(type, fn, opt));
      };

      /* Posities uit de opmaak (offsetLeft/offsetWidth, de baan is position: relative): de schaal van de zijkaarten is
         een transform en verandert die maten niet. */
      const midden = (k: HTMLElement) => k.offsetLeft + k.offsetWidth / 2;
      const standVan = (i: number) => Math.max(0, midden(kaarten[i]) - baan.clientWidth / 2);
      const inHetMidden = () => {
        const c = baan.scrollLeft + baan.clientWidth / 2;
        let beste = 0, afstand = Infinity;
        kaarten.forEach((k, i) => { const a = Math.abs(midden(k) - c); if (a < afstand) { afstand = a; beste = i; } });
        return beste;
      };
      let index = -1;
      const markeer = (i: number) => {
        if (i === index) return;
        index = i;
        kaarten.forEach((k, j) => {
          k.classList.toggle('is-midden', j === i);
          k.classList.toggle('is-links', j < i);
          k.classList.toggle('is-rechts', j > i);
        });
        vorige?.setAttribute('aria-disabled', String(i === 0));
        volgende?.setAttribute('aria-disabled', String(i === n - 1));
      };
      /* Verzetten zonder animatie (laden, venster dat van breedte verandert). */
      const spring = (i: number) => { baan.scrollLeft = standVan(i); markeer(i); };

      const startAttr = Number(this.dataset.start);
      spring(Number.isFinite(startAttr) ? Math.min(Math.max(startAttr, 0), n - 1) : 0);

      /* Een rij smaller dan 200 px (verborgen, of even 1 px breed tijdens een schermafdruk van de hele pagina, gemeten
         13 okt) zegt niets over welke kaart in het midden staat: dan blijft de kaart die er stond. */
      const meetbaar = () => baan.clientWidth >= 200;

      /* Tijdens het scrollen (vinger, trackpad, knop) volgt de middelste kaart de rij, één keer per beeld. */
      let beeld = 0;
      op(baan, 'scroll', () => {
        if (beeld) return;
        beeld = window.requestAnimationFrame(() => { beeld = 0; if (meetbaar()) markeer(inHetMidden()); });
      }, { passive: true });

      /* Knoppen: precies één kaart. Een tweede klik tijdens de zachte scroll telt verder vanaf het doel van de eerste. */
      let doel = -1, doelTijd = 0;
      const schuif = (r: -1 | 1) => {
        const basis = doel >= 0 && performance.now() - doelTijd < 700 ? doel : inHetMidden();
        const naar = Math.min(Math.max(basis + r, 0), n - 1);
        if (naar === basis) return;
        doel = naar; doelTijd = performance.now();
        baan.scrollTo({ left: standVan(naar), behavior: stil ? 'instant' : 'smooth' });
      };
      if (vorige) op(vorige, 'click', () => schuif(-1));
      if (volgende) op(volgende, 'click', () => schuif(1));

      /* Met het toetsenbord naar een kaart: die kaart schuift naar het midden. */
      op(baan, 'focusin', (e) => {
        const t = e.target as HTMLElement;
        if (!t.matches?.(':focus-visible')) return;
        const i = kaarten.findIndex((k) => k.contains(t));
        if (i >= 0 && i !== inHetMidden()) baan.scrollTo({ left: standVan(i), behavior: stil ? 'instant' : 'smooth' });
      });

      /* Ander venster (draaien van de gsm, breder venster): dezelfde kaart blijft in het midden. */
      if ('ResizeObserver' in window) {
        let breedte = baan.clientWidth;
        const ro = new ResizeObserver(() => {
          if (baan.clientWidth === breedte) return;
          breedte = baan.clientWidth;
          if (meetbaar()) spring(index < 0 ? 0 : index);
        });
        ro.observe(baan);
        this.opruim.push(() => ro.disconnect());
      }

      /* De foto's naast het midden staan buiten beeld in de rij; ze laden mee zodra de sectie in de buurt komt, zodat er
         bij het schuiven geen lege kaart voorbijkomt. */
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((e) => {
          if (!e.some((x) => x.isIntersecting)) return;
          baan.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
          io.disconnect();
        }, { rootMargin: '800px 0px' });
        io.observe(this);
        this.opruim.push(() => io.disconnect());
      }

      this.opruim.push(() => { if (beeld) window.cancelAnimationFrame(beeld); });
    }

    disconnectedCallback() {
      this.opruim.splice(0).reverse().forEach((f) => f());
    }
  }

  customElements.define('ab-dienstenrij', Dienstenrij);
}
definieerDienstenrij();
