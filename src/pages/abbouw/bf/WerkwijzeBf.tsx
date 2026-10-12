/**
 * /werkwijze in de stijl van bfbouw.be (spec/bf-stijl.md §10; BF-tegenhanger /werkwijze/,
 * bouw/paginas.cjs r.181-183): paginakop, traject met de 8 stappen (titel, tijdregel klein
 * onder de titel, tekst; 2 kaarten per rij op desktop (bf-ab.css .bf-proces__stappen--8)),
 * plaatsblok met de formuliertabs, voet en zwevende belknop.
 * Alle tekst staat in inhoud-werkwijze.ts, woordelijk uit Werkwijze.tsx (dictaat Mohammed 4 okt).
 * Alle stapiconen staan in ICOON (schil.ts), ook planning, controle en garantie (stap 4, 6 en 8).
 *
 * Lokale herstellingen (keuring /werkwijze r2, vondst 3, 4 en 5): werkwijze.css en useWerkwijzeHerstel hieronder.
 * Ze horen in de gedeelde bestanden (bf-ab.css en gedrag.ts, voor elke pagina met een plaatsblok); daar werkten
 * andere agents tegelijk. Wie ze daarheen verhuist, haalt ze hier weg.
 */
import { useEffect, useMemo } from 'react';
import BfPagina from './BfPagina';
import { pagina } from './schil';
import { paginakop, traject } from './blokken';
import { onderaan } from './onderaan';
import { WERKWIJZE_BF } from './inhoud-werkwijze';
import './werkwijze.css';

/* Alleen op deze pagina: BfPagina zet data-track-source="werkwijze" op de .bf-wortel. */
const SCOPE = '.bf[data-track-source="werkwijze"]';

/**
 * 3. Lege verzending: gedrag.ts (stap 10) zet de focus op het foutveld, maar de melding (role=status, onder de
 *    verzendknop) viel buiten beeld (390: 984-1030 bij 844; 1265: 773-789 bij 720). gedrag.ts luistert op het
 *    formulier zelf, dit op document, dus dit loopt erna. De pagina schuift zo weinig mogelijk, zodat veld en
 *    melding allebei onder de vaste kop in beeld staan (het veld met zijn label); past dat niet, dan gaat het veld voor.
 *    Altijd scrollTo: zo wint deze positie ook van het scrollen dat focus() zelf startte.
 * 5. De pil "Vraag een gratis plaatsbezoek aan" (data-kies) verbergt zichzelf (gedrag.ts stap 9, zoals BF), en dan
 *    viel de focus naar body. Kwam de klik van het toetsenbord (:focus-visible vóór de klik), dan gaat de focus naar
 *    de tab Plaatsbezoek (een tabknop, geen veld: het gsm-toetsenbord springt niet open). Muis of vinger: geen focus.
 */
function useWerkwijzeHerstel() {
  useEffect(() => {
    const zacht = (): ScrollBehavior => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth');

    const naVerzenden = (e: Event) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement) || !form.matches(`${SCOPE} form.js-bf-form`)) return;
      const veld = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      const melding = form.querySelector<HTMLElement>('.bf-formulier-melding');
      if (!veld || !melding || melding.hidden) return;
      const kop = document.querySelector<HTMLElement>(`${SCOPE} .bf-kop`);
      const y = window.scrollY;
      // bovenrand van het veldblok (label + veld): anders verdwijnt het label "Telefoonnummer" onder de kop
      const veldTop = (veld.closest<HTMLElement>('.bf-fveld') ?? veld).getBoundingClientRect().top + y;
      const meldingOnder = melding.getBoundingClientRect().bottom + y;
      const minst = meldingOnder + 12 - window.innerHeight; // vanaf hier staat de melding volledig in beeld
      const hoogst = veldTop - (kop ? kop.getBoundingClientRect().height : 0) - 12; // tot hier staat het veld onder de kop
      const doel = minst <= hoogst ? Math.min(Math.max(y, minst), hoogst) : hoogst;
      window.scrollTo({ top: Math.max(0, doel), behavior: zacht() });
    };

    let toetsKies: HTMLElement | null = null;
    const voorKlik = (e: MouseEvent) => {
      const k = (e.target as Element | null)?.closest<HTMLElement>('[data-kies]') ?? null;
      let toets = false;
      try { toets = !!k && k.matches(':focus-visible'); } catch { toets = false; }
      toetsKies = k && toets && k.closest(SCOPE) ? k : null;
    };
    const naKlik = () => {
      const k = toetsKies; toetsKies = null;
      if (!k || k.getClientRects().length) return; // alleen als de knop zichzelf verborg
      document.querySelector<HTMLElement>(`${SCOPE} #bf-tab-plaatsbezoek`)?.focus({ preventScroll: true });
    };

    document.addEventListener('submit', naVerzenden);
    document.addEventListener('click', voorKlik, true);
    document.addEventListener('click', naKlik);
    return () => {
      document.removeEventListener('submit', naVerzenden);
      document.removeEventListener('click', voorKlik, true);
      document.removeEventListener('click', naKlik);
    };
  }, []);
}

export function werkwijzeHtml() {
  const W = WERKWIJZE_BF;
  const T = W.traject;
  const inhoud = [
    paginakop({ kop: W.kop, sub: W.sub, foto: W.foto }),
    traject({ id: 'werkwijze', kop: T.kop, tekst: T.tekst, knop: T.knop, foto: T.foto, stappen: T.stappen }),
    onderaan({ pagina: 'werkwijze', kop: W.plaats.kop, tekst: W.plaats.tekst }),
  ].join('\n');
  return pagina({ actief: '/werkwijze', heeftPlaats: true, inhoud, voettekst: W.voet });
}

export default function WerkwijzeBf() {
  const html = useMemo(werkwijzeHtml, []);
  useWerkwijzeHerstel();
  return <BfPagina html={html} titel={WERKWIJZE_BF.titel} omschrijving={WERKWIJZE_BF.omschrijving} pad="/werkwijze" bron="werkwijze" />;
}
