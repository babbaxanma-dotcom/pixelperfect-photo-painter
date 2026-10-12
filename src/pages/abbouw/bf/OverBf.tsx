/**
 * /over in de stijl van bfbouw.be (spec/bf-stijl.md §10; BF-tegenhanger /over-ons/, bouw/paginas.cjs r.134-155).
 *
 * Volgorde (spec §10 = volgorde van OverOns.tsx):
 *   paginakop · cijferband (BF .ocijfers, witte balk over de paginakop) · duo "Hoe wij werken" met
 *   Google-badge · beloftelijst "De mensen op uw werf" (duo--om, grijs) · waarden-raster "Officieel erkend
 *   en verzekerd" (2x2 zoals BF "Onze kernwaarden") · plaatsblok · voet + zwevende belknop.
 * Weg ten opzichte van BF: het teamduo (geen AB-tekst) en het reviewblok (spec §1).
 *
 * Alle tekst woordelijk uit OverOns.tsx, met regelnummers in inhoud-over.ts.
 * Duo, waarden-raster en iconen komen uit de gedeelde blokken (blokken.ts, schil.ts ICOON). Lokaal staat
 * alleen de markup van de cijferbalk (BF paginas.cjs r.137); haar CSS zit in bf.css (port), de AB-variant
 * met twee tegels in over.css.
 */
import { useMemo } from 'react';
import BfPagina from './BfPagina';
import { pagina, esc, ICOON } from './schil';
import { paginakop, beloftelijst, duo, waardenRaster } from './blokken';
import { onderaan, type OnderaanFoto } from './onderaan';

/* /over toont IMG_9027 al: het fotovak van het onderste deel wordt daar IMG_0110 (spec §16) */
const FOTO_OVER: OnderaanFoto = { naam: 'IMG_0110', alt: 'Gewelfde doorgang afgewerkt in leempleister, door AB Bouw Groep' };
import { OVER_BF } from './inhoud-over';
import './over.css';

/* cijferband als witte balk over de onderrand van de paginakop (BF paginas.cjs r.137, .ocijfers) */
function ocijfers(o: typeof OVER_BF.cijfers) {
  return `<section class="bf-ocijfers" aria-label="${esc(o.label)}"><ul class="bf-ocijfers__balk bf-ocijfers__balk--${o.tegels.length}">${o.tegels.map((c) => `<li><span class="bf-ocijfers__icoon">${ICOON[c.icoon]}</span><span><b>${esc(c.getal)}</b><span>${esc(c.label)}</span></span></li>`).join('')}</ul></section>`;
}

export function overHtml() {
  const O = OVER_BF;
  const inhoud = [
    paginakop({ kop: O.kop, foto: O.kopFoto }),
    ocijfers(O.cijfers),
    // BF "Waar wij voor staan" (paginas.cjs r.138-142): duo met Google-badge, zonder knop
    duo({ id: 'werken', kop: O.werken.kop, alineas: [O.werken.alinea], google: true, foto: O.werken.foto }),
    beloftelijst({ kop: O.mensen.kop, lede: O.mensen.lede, punten: O.mensen.punten, foto: O.mensen.foto, om: true, grijs: true }),
    // BF "Onze kernwaarden" (paginas.cjs r.143-144): nummer, icoon, kop, tekst; wit vlak na de grijze beloftelijst
    waardenRaster({ id: 'erkend', kop: O.erkend.kop, lede: O.erkend.lede, items: O.erkend.items, grijs: false }),
    onderaan({ pagina: 'over', kop: O.plaats.kop, tekst: O.plaats.tekst, foto: FOTO_OVER }),
  ].join('\n');
  return pagina({ actief: '/over', heeftPlaats: true, inhoud, voettekst: O.voet });
}

export default function OverBf() {
  const html = useMemo(overHtml, []);
  return <BfPagina html={html} titel={OVER_BF.titel} omschrijving={OVER_BF.omschrijving} pad="/over" bron="over" />;
}
