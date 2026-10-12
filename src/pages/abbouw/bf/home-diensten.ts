/**
 * Dienstensectie van de home als rustig fotoraster (bento), eigen ontwerp: niet de slider van bfbouw.be en niet de
 * oude AB-opbouw. Mohammed, 12 okt: "nee niet diensten sectie zoals eerst, ik bedoel anders, dat het niet lijkt op
 * bfbouw, maar een andere mooier manier".
 *
 * Opbouw: kop links, introzin en knop rechts (de bestaande teksten van HOME_BF.diensten); daaronder zes fototegels.
 * Desktop: de eerste tegel (Totaalrenovatie en nieuwbouw) groot over twee rijen links, rechts twee tegels boven en drie
 * eronder. Gsm: de eerste tegel over de volle breedte, daarna twee kolommen vierkante tegels; een oneven laatste tegel
 * neemt de volle breedte. Elke tegel is één link naar de afdelingspagina: foto, donkere verlooplaag onderaan, naam
 * (h3), de kaartzin en een pijl. Hover: de foto zoomt 3,5 %; verder geen beweging.
 *
 * Tekst en foto's komen binnen via de parameters (inhoud.ts, HOME_BF.diensten: dezelfde kaarten als de vorige
 * dienstenslider, één vaste echte foto per afdeling, zoals op /diensten en de afdelingspagina's).
 */
import { ICOON, beeld, esc } from './schil';
import type { Dienstkaart } from './blokken';
import './home-diensten.css';

const PIJL = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 14.5 14.5 5.5M7.5 5.5h7v7"/></svg>';

export function dienstenRaster(o: { id: string; kop: string; tekst?: string; knop?: { tekst: string; href: string }; kaarten: Dienstkaart[] }) {
  const tegel = (k: Dienstkaart, i: number) => `<li class="bf-hd-cel bf-hd-cel--${i + 1}"><a class="bf-hd-tegel" href="${k.href}">
${beeld(k.foto.naam, { cls: 'bf-hd-tegel__beeld', alt: k.foto.alt, sizes: i === 0 ? '(max-width: 1000px) 100vw, 720px' : '(max-width: 1000px) 50vw, 380px', pos: k.foto.pos })}
<span class="bf-hd-tegel__pijl" aria-hidden="true">${PIJL}</span>
<span class="bf-hd-tegel__tekst"><h3>${esc(k.titel)}</h3><span class="bf-hd-tegel__zin">${esc(k.tekst)}</span></span>
</a></li>`;
  const rechts = o.tekst || o.knop ? `<div class="bf-hd-kop__rechts">${o.tekst ? `<p>${esc(o.tekst)}</p>` : ''}${o.knop ? `<a class="bf-knop bf-hd-knop" href="${o.knop.href}">${esc(o.knop.tekst)}${ICOON.pijlR}</a>` : ''}</div>` : '';
  return `<section class="bf-hd" id="${o.id}" aria-labelledby="${o.id}-kop"><div class="bf-hd-raam">
<div class="bf-hd-kop"><h2 class="bf-h2" id="${o.id}-kop">${esc(o.kop)}</h2>${rechts}</div>
<ul class="bf-hd-raster">${o.kaarten.map(tegel).join('')}</ul>
</div></section>`;
}
