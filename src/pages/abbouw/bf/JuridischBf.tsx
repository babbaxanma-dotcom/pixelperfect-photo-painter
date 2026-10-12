/**
 * /privacy, /voorwaarden en /cookies in de stijl van bfbouw.be (spec/bf-stijl.md §10;
 * BF-tegenhanger /privacy/ en /cookies/, bouw/paginas.cjs r.214-252): vlakke paginakop +
 * leeskolom (.bf-lees), geen plaatsblok (BF GEEN_FORM, build.cjs r.156).
 *
 * De juridische tekst komt WOORDELIJK uit inhoud-juridisch.ts, waar hij uit Privacy.tsx,
 * Voorwaarden.tsx en Cookies.tsx naartoe verhuisde (die lezen hem daar nu ook). Het btw-nummer
 * van de voorwaarden komt uit CONTACT.btw. Wat BF .lees niet heeft (cookietabel, cookiegroepen,
 * vraagkaart, alinea na een lijst) staat in juridisch.css.
 *
 * Het label "Juridisch" boven de oude h1 valt weg: een label boven de kop is in de BF-stijl verboden
 * (spec §12); het is geen juridische tekst.
 */
import { useMemo } from 'react';
import { CONTACT } from '@/data/contact';
import BfPagina from './BfPagina';
import { pagina } from './schil';
import { paginakop, lees } from './blokken';
import { HOME_BF } from './inhoud';
import {
  PRIVACY, PRIVACY_BLOKKEN, VOORWAARDEN, voorwaardenArtikelen,
  COOKIES, COOKIE_GROEPEN, COOKIE_BROWSERS, VRAAG_TEKST, type CookieRij,
} from './inhoud-juridisch';
import './juridisch.css';

export type JuridischSoort = 'privacy' | 'voorwaarden' | 'cookies';

/* Kop, inleiding, titel en beschrijving: dezelfde waarden als de oude pagina's (inhoud-juridisch.ts). */
export const JURIDISCH_BF: Record<JuridischSoort, { kop: string; sub: string; vraag: string; titel: string; omschrijving: string }> = {
  privacy: { kop: PRIVACY.kop, sub: PRIVACY.lede, vraag: PRIVACY.vraag, titel: PRIVACY.titel, omschrijving: PRIVACY.omschrijving },
  voorwaarden: { kop: VOORWAARDEN.kop, sub: VOORWAARDEN.lede, vraag: VOORWAARDEN.vraag, titel: VOORWAARDEN.titel, omschrijving: VOORWAARDEN.omschrijving },
  cookies: { kop: COOKIES.kop, sub: COOKIES.lede, vraag: COOKIES.vraag, titel: COOKIES.titel, omschrijving: COOKIES.omschrijving },
};

/* De strings in inhoud-juridisch.ts bevatten bewust HTML (links): ze gaan ongewijzigd de pagina in,
   net als in de oude pagina's. */
const alineas = (ps?: string[]) => (ps || []).map((t) => `<p>${t}</p>`).join('');
const lijst = (items?: string[]) => (items && items.length ? `<ul>${items.map((l) => `<li>${l}</li>`).join('')}</ul>` : '');

function privacyTekst() {
  return PRIVACY_BLOKKEN.map((b) => `<h2>${b.n}. ${b.t}</h2>${alineas(b.p)}${lijst(b.lijst)}${alineas(b.na)}`).join('');
}

function voorwaardenTekst() {
  return voorwaardenArtikelen(CONTACT.btw.display).map((a) => `<h2>${a.n} · ${a.t}</h2>${alineas(a.p)}`).join('');
}

/* Cookietabel: op desktop een tabel; op smalle schermen stapelt elke rij (juridisch.css), met de
   kolomkop als label via data-label. */
function cookieTabel(rijen: CookieRij[]) {
  const [k1, k2, k3] = COOKIES.tabelKop;
  return `<table class="bf-jur-tabel"><thead><tr><th scope="col">${k1}</th><th scope="col">${k2}</th><th scope="col">${k3}</th></tr></thead><tbody>${rijen
    .map((r) => `<tr><td data-label="${k1}"><code>${r.naam}</code></td><td data-label="${k2}">${r.doel}</td><td data-label="${k3}">${r.duur}</td></tr>`)
    .join('')}</tbody></table>`;
}

function cookiesTekst() {
  const C = COOKIES;
  const groepen = COOKIE_GROEPEN.map((g) => `<section class="bf-jur-groep"><h3>${g.t} <span class="bf-jur-groep__status">· ${g.status}</span></h3><p>${g.uitleg}</p>${g.rijen ? cookieTabel(g.rijen) : ''}</section>`).join('');
  const browsers = `<ul class="bf-jur-links">${COOKIE_BROWSERS.map(([n, u]) => `<li><a href="${u}" rel="noopener noreferrer" target="_blank">${n}</a></li>`).join('')}</ul>`;
  return [
    `<h2>${C.wat.t}</h2><p>${C.wat.p}</p>`,
    `<h2>${C.welke.t}</h2><p>${C.welke.p}</p>${groepen}`,
    `<h2>${C.keuze.t}</h2><p>${C.keuze.p}</p>`,
    `<h2>${C.browser.t}</h2><p>${C.browser.p}</p>${browsers}<p>${C.browser.na}</p>`,
    `<h2>${C.meer.t}</h2><p>${C.meer.p}</p>`,
  ].join('');
}

const TEKST: Record<JuridischSoort, () => string> = { privacy: privacyTekst, voorwaarden: voorwaardenTekst, cookies: cookiesTekst };

export function juridischHtml(soort: JuridischSoort) {
  const J = JURIDISCH_BF[soort];
  const vraag = `<aside class="bf-jur-vraag" aria-labelledby="bf-jur-vraag-kop"><h2 id="bf-jur-vraag-kop">${J.vraag}</h2><p>${VRAAG_TEKST}</p></aside>`;
  const inhoud = [
    paginakop({ kop: [J.kop], sub: J.sub }),
    lees(TEKST[soort]() + vraag),
  ].join('\n');
  return pagina({ actief: '', heeftPlaats: false, inhoud, voettekst: HOME_BF.voet });
}

export default function JuridischBf({ soort }: { soort: JuridischSoort }) {
  const J = JURIDISCH_BF[soort];
  const html = useMemo(() => juridischHtml(soort), [soort]);
  // key: bij een wissel tussen twee juridische pagina's (zelfde component) begint de pagina opnieuw
  return <BfPagina key={soort} html={html} titel={J.titel} omschrijving={J.omschrijving} pad={'/' + soort} bron={soort} />;
}
