/**
 * De zes afdelingspagina's in de stijl van bfbouw.be, één sjabloon (spec/bf-stijl.md §10;
 * BF-tegenhanger /diensten/dakwerken/, bouw/paginas.cjs r.165-179).
 * Volgorde: paginakop · dienstrij met het verhaal + 3 features · waarden-raster "Wat wij doen" ·
 * traject in 4 stappen (zonder tijdlabels) · veelgestelde vragen · "Andere diensten" (slider met
 * de 5 andere afdelingen) · plaatsblok met deze afdeling als standaardkeuze · voet.
 * Alle tekst: inhoud-divisies.ts (uit _divisies.ts geïmporteerd, bron per blok).
 */
import { useMemo } from 'react';
import BfPagina from './BfPagina';
import { pagina, ICOON, TEL, TEL_HREF, esc } from './schil';
import { paginakop, dienstRij, waardenRaster, traject, faq, dienstenSlider } from './blokken';
import { onderaan, type OnderaanFoto } from './onderaan';

/* /bad toont IMG_0106 al als paginakop: de cirkel van de eindband wordt daar IMG_9028 (spec §16) */
const CIRKEL_BAD: OnderaanFoto = { naam: 'IMG_9028', alt: 'Afgewerkte badkamer met ligbad onder het raam, door AB Bouw Groep', pos: '60% center' };
import { HOME_BF } from './inhoud';
import { divisieInhoud } from './inhoud-divisies';
import type { DivisieSlug } from './fotoplan';
import './divisie.css';

export function divisieHtml(slug: DivisieSlug) {
  const D = divisieInhoud(slug);
  const V = D.verhaal;
  // knoppen van de paginakop (spec §10): plaatsbezoek (kiest de tab, scrolt naar het formulier) en bellen
  const knoppen = `<a class="bf-knop bf-hero__knop" href="#offerte" data-kies>${esc(D.kop.knop)}${ICOON.pijlR}</a><a class="bf-knop bf-knop--rand-wit" href="${TEL_HREF}">Bel ${TEL}</a>`;
  const inhoud = [
    paginakop({ kop: D.kop.regels, sub: D.kop.sub, foto: D.kop.foto || undefined, knoppen }),
    // dienstrij met het verhaal (BF paginas.cjs r.170-172): één rij, dus geen nummer; punten met vette titel
    // (_division.tsx r.66). id "verhaal": haak voor de haarlijn rond de foto in divisie.css.
    dienstRij([{ id: 'verhaal', titel: V.titel, alineas: [V.tekst], punten: V.punten, foto: V.foto, icoon: V.icoon, knop: { tekst: V.knop, href: '#offerte' } }]),
    // tegels zonder icoon (_division.tsx r.82-88): bf-ab.css houdt de kop vrij van het grote nummer
    waardenRaster({ kop: D.watWijDoen.kop, items: D.watWijDoen.items }),
    traject({ id: 'werkwijze', kop: D.traject.kop, knop: D.traject.knop, foto: D.traject.foto, stappen: D.traject.stappen }),
    // grijs vlak (BF sblok--grijs): traject en vragen zijn allebei wit en liepen anders in één vlak in elkaar over
    faq({ id: 'vragen', kop: D.vragen.kop, vragen: D.vragen.vragen, grijs: true }),
    dienstenSlider({ id: 'andere-diensten', kop: D.andere.kop, tekst: D.andere.tekst, knop: D.andere.knop, banner: D.andere.banner, kaarten: D.andere.kaarten }),
    onderaan({ pagina: slug, standaardWerk: D.plaats.standaardWerk, kop: D.plaats.kop, tekst: D.plaats.tekst, cirkel: slug === 'bad' ? CIRKEL_BAD : undefined }),
  ].join('\n');
  return pagina({ actief: '/diensten', heeftPlaats: true, inhoud, voettekst: HOME_BF.voet });
}

export default function DivisieBf({ slug }: { slug: DivisieSlug }) {
  const D = useMemo(() => divisieInhoud(slug), [slug]);
  const html = useMemo(() => divisieHtml(slug), [slug]);
  // key: bij een wissel tussen twee afdelingen (zelfde component) begint de pagina opnieuw
  return <BfPagina key={slug} html={html} titel={D.titel} omschrijving={D.omschrijving} pad={'/' + slug} bron={slug} />;
}
