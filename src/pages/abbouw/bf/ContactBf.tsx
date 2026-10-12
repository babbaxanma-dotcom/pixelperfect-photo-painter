/**
 * /contact in de stijl van bfbouw.be (spec/bf-stijl.md §10; BF-tegenhanger /contact/, bouw/paginas.cjs r.207-210):
 * paginakop + plaatsblok met de formuliertabs. Geen openingsuren (aanname zonder bron, A6),
 * geen zwevende belknop (spec §6). Tekst en bron per regel: inhoud-contact.ts.
 *
 * /contact#plaatsbezoek opent de tab "Gratis plaatsbezoek" en scrolt naar de formulierkaart,
 * net als een [data-kies]-knop op een pagina met plaatsblok. Daar komen de plaatsbezoek-knoppen van
 * pagina's zonder plaatsblok (juridisch, 404) binnen: de kop-pil, hero en inspectieband (schil.ts,
 * blokken.ts) en een [data-kies] zonder formulier (gedrag.ts).
 */
import { useEffect, useMemo } from 'react';
import BfPagina from './BfPagina';
import { pagina } from './schil';
import { paginakop } from './blokken';
import { onderaan } from './onderaan';
import { HOME_BF } from './inhoud';
import { CONTACT_BF } from './inhoud-contact';
import { FOTOPLAN } from './fotoplan';
import './contact.css';

export function contactHtml() {
  const C = CONTACT_BF;
  const inhoud = [
    paginakop({ kop: C.kop, sub: C.sub, foto: FOTOPLAN.contact.kop }),
    onderaan({ pagina: C.plaats.pagina, kop: C.plaats.kop, tekst: C.plaats.tekst, eind: false }),
  ].join('\n');
  return pagina({ actief: '/contact', heeftPlaats: true, inhoud, voettekst: HOME_BF.voet, belknop: false });
}

export default function ContactBf() {
  const html = useMemo(contactHtml, []);

  // Toetsenbord op de pil "Vraag een gratis plaatsbezoek aan" (keuring ronde 2): gedrag.ts punt 9 verbergt de pil zodra
  // de tab Plaatsbezoek aan staat; de focus viel dan naar BODY en de volgende Tab sprong terug naar de teltegel (op 390
  // van y 982 naar y 380). BF doet hetzelfde (site.js r.262). Had de pil :focus-visible (toetsenbord), dan gaat de focus
  // naar de tab Gratis plaatsbezoek, zonder te scrollen (gedrag.ts scrolt zelf naar de kaart). Bij muis of vinger geen
  // focus (spec §4: zonder focus); een tabknop opent ook geen gsm-toetsenbord (regel 9 okt: geen focus op een veld).
  // Lokaal hier omdat gedrag.ts gedeeld is; dezelfde regel hoort voor elk plaatsblok in gedrag.ts punt 9.
  useEffect(() => {
    const blok = document.querySelector<HTMLElement>('.bf .bf-plaats[data-pagina="contact"]');
    const pil = blok?.querySelector<HTMLElement>('.bf-plaats__inspectie[data-kies]');
    const tab = blok?.querySelector<HTMLElement>('#bf-tab-plaatsbezoek');
    if (!blok || !pil || !tab) return;
    let viaToets = false;
    // vangfase op de sectie: loopt vóór de klikhandler van gedrag.ts op de pil, dus terwijl de pil nog zichtbaar is
    const voor = (e: Event) => {
      if (e.target instanceof Node && pil.contains(e.target)) {
        try { viaToets = pil.matches(':focus-visible'); } catch { viaToets = false; }
      }
    };
    const na = () => {
      if (viaToets && tab.getAttribute('aria-selected') === 'true') tab.focus({ preventScroll: true });
      viaToets = false;
    };
    blok.addEventListener('click', voor, true);
    pil.addEventListener('click', na);
    return () => { blok.removeEventListener('click', voor, true); pil.removeEventListener('click', na); };
  }, [html]);

  // Draait na het effect van BfPagina (kind eerst), dus wireBf hangt al aan de knoppen:
  // de pil in het plaatsblok doet de tabwissel en de scroll (gedrag.ts, punt 9).
  useEffect(() => {
    if (window.location.hash !== '#plaatsbezoek') return;
    // de kop-pil is een [data-kies]-knop (ook als ze op desktop verborgen is): scrolt naar het formulier (gedrag.ts punt 9)
    document.querySelector<HTMLElement>('.bf [data-kies]')?.click();
  }, [html]);

  return <BfPagina html={html} titel={CONTACT_BF.titel} omschrijving={CONTACT_BF.omschrijving} pad="/contact" bron="contact" />;
}
