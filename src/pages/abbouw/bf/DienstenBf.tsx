/**
 * /diensten in de stijl van bfbouw.be (spec/bf-stijl.md §10).
 * BF-tegenhanger: /diensten/ (bouw/paginas.cjs r.158-162) voor de paginakop, de inspectieband en
 * het plaatsblok; de zes rijen volgen de BF-dienstrij van /diensten/dakwerken/ (r.170-173),
 * want AB heeft zes afdelingen en geen twee groepen (ab-paginas.md §3).
 * Volgorde: paginakop, zes dienstrijen, inspectieband, beloftelijst, plaatsblok.
 * Alle tekst komt uit inhoud-diensten.ts (woordelijk uit Diensten.tsx, dictaat Mohammed 4 okt).
 */
import { useMemo } from 'react';
import BfPagina from './BfPagina';
import { pagina } from './schil';
import { paginakop, dienstRij, beloftelijst } from './blokken';
import { onderaan } from './onderaan';
import { HOME_BF } from './inhoud';
import { DIENSTEN_BF as D } from './inhoud-diensten';

/* Woorden met koppeltekens die op gsm niet over twee regels mogen breken. Gemeten 12 okt op 390 en 360:
   vinkpunt 01 brak als "sleutel-op-de- | deur nieuwbouw". Alleen het soort regelbreuk verandert; de tekst
   blijft woordelijk (zelfde aanpak als "e-mailadres" in de formulieruitleg, blokken.ts). Werkt op de
   HTML-string van de rijen: het woord staat daar alleen als tekst, nooit in een attribuut. */
const HEEL = ['sleutel-op-de-deur'];
const heel = (html: string) => HEEL.reduce((h, w) => h.split(w).join(`<span style="white-space:nowrap">${w}</span>`), html);

export function dienstenHtml() {
  const inhoud = [
    paginakop({ kop: D.kop, sub: D.sub, lede: D.lede, foto: D.kopFoto }),
    heel(dienstRij(D.rijen)),
    // BF /over-ons/ "Wat u van ons mag verwachten": duo met foto links (duo--om), grijs vlak
    beloftelijst({ kop: D.belofte.kop, lede: D.belofte.lede, punten: D.belofte.punten, foto: D.belofte.foto, om: true, grijs: true }),
    onderaan({ pagina: 'diensten', kop: D.plaats.kop, tekst: D.plaats.tekst }),
  ].join('\n');
  return pagina({ actief: '/diensten', heeftPlaats: true, inhoud, voettekst: HOME_BF.voet });
}

export default function DienstenBf() {
  const html = useMemo(dienstenHtml, []);
  return <BfPagina html={html} titel={D.titel} omschrijving={D.omschrijving} pad="/diensten" bron="diensten" />;
}
