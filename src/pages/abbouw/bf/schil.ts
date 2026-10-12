/**
 * Gedeelde schil in de stijl van bfbouw.be (spec/bf-stijl.md §6): kop, voet,
 * zwevende belknop, paginakop, iconen en beelden. HTML-stringbouwers, zoals de
 * BF-sjablonen in bfbouw-website/build.cjs (topbalkEnNav r.159-171, voet
 * r.173-193, beeld r.29-36) en bouw/paginas.cjs (paginakop r.103). Alle klassen
 * dragen het voorvoegsel bf- (zie scripts/bf-css-port.cjs).
 *
 * Contactgegevens komen ALTIJD uit CONTACT; de dienstenlijst van de voet komt uit
 * DIENST_LINKS (_rp.ts:151-158), niet gekopieerd.
 */
import { CONTACT } from '@/data/contact';
import { DIENST_LINKS } from '../_rp';
import { BEELDEN } from './beelden';

/* Vite levert per webp-variant de url (met hash in de build). */
const URLS = import.meta.glob('/src/assets/bf/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const url = (bestand: string) => {
  const u = URLS['/src/assets/bf/' + bestand];
  if (!u) throw new Error('bf-beeld ontbreekt: ' + bestand + ' (draai node scripts/bf-beelden.cjs)');
  return u;
};

export const esc = (s: string | number) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Adres uit CONTACT op één plek: "2830 Willebroek" breekt nooit (voet en plaatsblok; gemeten 11-12 okt: op 390 en 414
 *  brak de voet tussen "2830" en "Willebroek", op 1265 de adrestegel). Zelfde tekst als CONTACT.address.full. */
export const adresHtml = () => `${esc(CONTACT.address.street)}, <span style="white-space:nowrap">${esc(CONTACT.address.postcode)} ${esc(CONTACT.address.city)}</span>`;

export const NAAM = 'AB Bouw Groep';
export const TEL = CONTACT.phone.display;
export const TEL_HREF = CONTACT.phone.href;
/* Google-profiel van AB (spec §1: zelfde plaats als src/pages/abbouw/Review.tsx, zonder !12e1). */
export const GOOGLE_PROFIEL = 'https://www.google.com/maps/place//data=!4m3!3m2!1s0x4a0341ae3b55ce5d:0x7d0fc6746e96d5bf';

/* ---------- iconen (inline SVG) ----------
   BF-lijnstijl: build.cjs r.39-71 en bouw/iconen-diensten.cjs. De AB-iconen (afdelingen,
   werkwijzestappen, cijferband, /over) zijn in dezelfde stijl getekend: 24-raster, lijn 1.7-1.8,
   ronde uiteinden; de cijferband en /over 32-raster, lijn 1.9, zoals BF klanten/schild/klok. */
const S24 = (d: string, lijn = 1.7) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${lijn}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const S32 = (d: string) => `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const ICOON = {
  // BF build.cjs r.40-60
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="1.5"/><path d="m3 6 9 7 9-7"/></svg>',
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.6 16.6 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5z"/><path d="M14.5 3.8a6 6 0 0 1 5.7 5.7M14.3 7.2a2.8 2.8 0 0 1 2.5 2.5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg>',
  pijlR: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5"/></svg>',
  chevL: '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2.5 4.5 7 9 11.5"/></svg>',
  chevR: '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2.5 9.5 7 5 11.5"/></svg>',
  omlaag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16M5 13l7 7 7-7"/></svg>',
  burger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  google: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.7 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>',
  ster: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L10 15l-5.4 2.9 1.1-6.1L1.2 7.6l6.1-.8z"/></svg>',
  // btw-regel in de voet: zelfde document-icoon als rpFooter (_rp.ts)
  btw: S24('<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/>', 1.8),
  vink: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8"/></svg>',

  // cijferband (32-raster zoals BF klanten/schild/medaille/klok, build.cjs r.52-55)
  vakmensen: S32('<path d="M5 15.5 16 6.5l11 9"/><path d="M8 13.2V26h16V13.2"/><path d="m13.5 21.5 5-5"/><path d="M18.5 16.5a2.3 2.3 0 0 1 3.2-3.2l-1.6 1.6.1 1.4 1.4.1 1.6-1.6a2.3 2.3 0 0 1-3.2 3.2"/><path d="M12 23l1.5-1.5"/>'),
  sterLijn: S32('<path d="m16 4.5 3.4 7 7.6 1.1-5.5 5.3 1.3 7.6L16 21.9l-6.8 3.6 1.3-7.6L5 12.6l7.6-1.1z"/>'),
  schild: S32('<path d="M16 3.5 5.5 7.5v7.8c0 6.4 4.4 11.4 10.5 13.2 6.1-1.8 10.5-6.8 10.5-13.2V7.5z"/><path d="m11.2 16 3.4 3.4 6.4-6.8"/>'),
  plaatsbezoek: S32('<path d="M4.5 15 16 5.5 27.5 15"/><path d="M7.5 12.8V27h9"/><circle cx="21.5" cy="20.5" r="4"/><path d="m24.4 23.4 3 3"/>'),

  // /over: cijferbalk (jaren) en erkenningen (32-raster, lijn 1.9). Onderwerp per erkenning zoals icStap in
  // OverOns.tsx (woning, attest, garantie, btw); "garantie" bij VCA is een helm, want het schild hoort al bij
  // de wettelijke aansprakelijkheid op de home.
  jaren: S32('<rect x="5" y="7" width="22" height="20" rx="2.5"/><path d="M5 13h22M11 4.5v5M21 4.5v5"/><path d="M11 18.5h3M18 18.5h3M11 22.5h3"/>'),
  woning: S32('<path d="M4.5 15 16 5.5 27.5 15"/><path d="M7.5 12.8V27h17V12.8"/><path d="m12 19.6 3 3 5.4-5.8"/>'),
  attest: S32('<path d="M19.5 27.5H8.5A1.5 1.5 0 0 1 7 26V5.5A1.5 1.5 0 0 1 8.5 4h13A1.5 1.5 0 0 1 23 5.5v7"/><path d="M11 10h8M11 14.5h5"/><circle cx="23" cy="19.5" r="4.5"/><path d="m20.4 23.4-1 5 3.6-2 3.6 2-1-5"/>'),
  helm: S32('<path d="M13.3 13.3V6.7a1.3 1.3 0 0 1 1.3-1.4h2.8a1.3 1.3 0 0 1 1.3 1.4v6.6"/><path d="M18.7 8a8 8 0 0 1 8 8v4"/><path d="M5.3 20v-4a8 8 0 0 1 8-8"/><rect x="2.7" y="20" width="26.6" height="5.3" rx="1.3"/>'),
  procent: S32('<circle cx="16" cy="16" r="11.5"/><path d="m11.2 20.8 9.6-9.6"/><circle cx="11.8" cy="11.8" r="1.9"/><circle cx="20.2" cy="20.2" r="1.9"/>'),

  // afdelingen (24-raster, lijn 1.7, zoals bouw/iconen-diensten.cjs)
  construct: S24('<path d="M2.5 11 12 3.8 21.5 11"/><path d="M5.5 9V20h13V9"/><path d="M5.5 13.5h13M5.5 17h13M9 13.5V17M15 13.5V17M12 17v3M12 10v3.5"/>'),
  dak: S24('<path d="M2.5 11.5 12 4l9.5 7.5"/><path d="M5.5 9.3V20h13V9.3"/><path d="M15 13.4a3.2 3.2 0 1 0 .4 3.3"/><path d="M15.5 11.3v2.3h-2.3"/>'),
  gevel: S24('<path d="M3.5 10 12 3.8l8.5 6.2V20.5h-17z"/><path d="M7.5 11.2v9.3M12 9v11.5M16.5 11.2v9.3"/>'),
  bad: S24('<path d="M3 12h18v2.5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 12V6.5a2.5 2.5 0 0 1 4.9-.7"/><path d="M9.6 7.2h2.8"/><path d="m7 19.5-1 1.5M17 19.5l1 1.5"/>'),
  interieur: S24('<rect x="4" y="3.5" width="16" height="17" rx="1.5"/><path d="M12 3.5v17M9.6 10.5v3M14.4 10.5v3M4 17h16"/>'),
  ecologisch: S24('<rect x="2.5" y="6" width="19" height="12" rx="1.5"/><circle cx="9" cy="12" r="3.6"/><path d="M9 8.4v7.2M5.4 12h7.2"/><path d="M15.5 9.5h3M15.5 12h3M15.5 14.5h3"/><path d="M5 18v2M19 18v2"/>'),

  // werkwijzestappen (24-raster, lijn 1.8; 2-4 = BF STAPICOON, build.cjs r.264-268)
  gesprek: S24('<path d="M4.5 5h15v10.5h-8.2L7 19v-3.5H4.5z"/><path d="M8 9h8M8 12h5"/>', 1.8),
  bezoek: S24('<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h7"/><circle cx="16.5" cy="16" r="3"/><path d="m18.7 18.2 2 2"/>', 1.8),
  offerte: S24('<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4"/><path d="M10 12h5M10 15.5h5"/><path d="M4.5 9v11.5"/>', 1.8),
  werken: S24('<path d="M4 16a8 8 0 0 1 16 0"/><path d="M2.5 16h19v2.5h-19z"/><path d="M10 8.4V5.5h4v2.9"/>', 1.8),
  oplevering: S24('<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/><path d="m9 14.5 2.2 2.2 4.3-4.6"/>', 1.8),
  // /werkwijze, stap 4, 6 en 8: kalender met vinkje, afwerkingslijst, garantieschild (naar icStap in _rp.ts r.102-110)
  planning: S24('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="m9 15.2 2.1 2.1 4-4.2"/>', 1.8),
  controle: S24('<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9.5 3h5v3h-5z"/><path d="m8.5 11.6 1.3 1.3 2.4-2.6M8.5 16.6l1.3 1.3 2.4-2.6M14.6 12h1.6M14.6 17h1.6"/>', 1.8),
  garantie: S24('<path d="M12 3 5.5 5.6v5.5c0 4.5 2.8 8 6.5 9.4 3.7-1.4 6.5-4.9 6.5-9.4V5.6z"/><path d="m9 12 2.1 2.1 4-4.3"/>', 1.8),
} as const;
export type IcoonNaam = keyof typeof ICOON;

/* ---------- beelden ----------
   beeld(naam) zoals BF build.cjs r.30-36: src = grootste variant, srcset met alle varianten,
   width/height van het beeld, alt, decoding async, lazy behalve met prio (fetchpriority high). */
export function beeld(naam: string, o: { cls?: string; alt?: string; sizes?: string; lazy?: boolean; prio?: boolean; pos?: string } = {}) {
  const b = BEELDEN[naam];
  if (!b) throw new Error('onbekend bf-beeld: ' + naam);
  const { cls = '', alt = '', sizes = '100vw', lazy = true, prio = false, pos } = o;
  const srcset = b.varianten.map((v) => `${url(v.bestand)} ${v.breedte}w`).join(', ');
  const grootste = b.varianten[b.varianten.length - 1];
  return `<img${cls ? ` class="${cls}"` : ''} src="${url(grootste.bestand)}" srcset="${srcset}" sizes="${sizes}" width="${b.breedte}" height="${b.hoogte}" alt="${esc(alt)}" decoding="async"${lazy && !prio ? ' loading="lazy"' : ''}${prio ? ' fetchpriority="high"' : ''}${pos ? ` style="object-position:${pos}"` : ''}>`;
}
/** Url van de grootste variant (voor <image> in de huisvorm). */
export const grootsteUrl = (naam: string) => url(BEELDEN[naam].varianten[BEELDEN[naam].varianten.length - 1].bestand);
const LOGO_WIT = () => url(BEELDEN['logo-wit'].varianten[0].bestand);
const LOGO_INK = () => url(BEELDEN['logo-ink'].varianten[0].bestand);
export const logoInk = LOGO_INK;

/* ---------- kop (BF build.cjs r.159-171, kop--over) ---------- */
const NAV = [
  { t: 'Over ons', href: '/over' },
  { t: 'Diensten', href: '/diensten' },
  { t: 'Werkwijze', href: '/werkwijze' },
  { t: 'Contact', href: '/contact' },
];
/**
 * @param actief href van het menu-item dat aria-current krijgt ('' = geen)
 * @param heeftPlaats staat het plaatsblok (#offerte) op deze pagina?
 */
export function kop(actief: string, heeftPlaats: boolean) {
  const menu = NAV.map((n) => `<a href="${n.href}"${actief === n.href ? ' aria-current="page"' : ''}>${esc(n.t)}</a>`).join('');
  // gsm na scrollen: de pil "Gratis plaatsbezoek" vervangt de belknop (spec §6). Zonder plaatsblok gaat ze naar
  // /contact#plaatsbezoek: ContactBf zet daar de tab "Gratis plaatsbezoek" open (zoals data-kies), zodat de lead
  // als contact:plaatsbezoek binnenkomt en niet als contact:offerte.
  const pil = heeftPlaats
    ? '<button type="button" class="bf-nav__inspectie" data-kies>Gratis plaatsbezoek</button>'
    : '<a class="bf-nav__inspectie" href="/contact#plaatsbezoek">Gratis plaatsbezoek</a>';
  return `<header class="bf-kop bf-kop--over">
<nav class="bf-nav" aria-label="Hoofdmenu">
<a class="bf-nav__logo" href="/" aria-label="${NAAM}, naar de startpagina"><img class="bf-nav__logo-wit" src="${LOGO_WIT()}" width="440" height="125" alt="" decoding="async" loading="lazy"><img class="bf-nav__logo-ink" src="${LOGO_INK()}" width="440" height="125" alt="" decoding="async" loading="lazy"></a>
<div class="bf-nav__menu" id="bf-menu">${menu}</div>
<div class="bf-nav__acties">${pil}<a class="bf-nav__tel" href="${TEL_HREF}" aria-label="Bel ${NAAM} op ${TEL}">${ICOON.tel}<span>${TEL}</span></a><a class="bf-knop bf-nav__knop" href="${heeftPlaats ? '#offerte' : '/contact'}">Gratis offerte</a></div>
<button class="bf-nav__burger" type="button" aria-expanded="false" aria-controls="bf-menu" aria-label="Menu openen">${ICOON.burger}</button>
</nav>
</header>`;
}

/* ---------- zwevende belknop (BF build.cjs r.174) ---------- */
export const belzweef = () => `<a class="bf-belzweef" href="${TEL_HREF}" aria-label="Bel ${NAAM} op ${TEL}">${ICOON.tel}</a>`;

/* ---------- voet (BF build.cjs r.173-193, voet--sub, 4 kolommen, geen sociale iconen) ----------
   Tekst onder het logo: HOME.footer (replica/inhoud.ts r.650, gelijk aan rpFooter). */
export function voet(tekst: string) {
  const snel = NAV.map((n) => `<li><a href="${n.href}">${esc(n.t)}</a></li>`).join('');
  const diensten = DIENST_LINKS.map((d) => `<li><a href="${d.href}">${esc(d.t)}</a></li>`).join('');
  return `<footer class="bf-voet bf-voet--sub"><div class="bf-voet__in">
<div class="bf-voet__raster">
<div><a class="bf-voet__logo" href="/" aria-label="${NAAM}"><img src="${LOGO_INK()}" width="440" height="125" alt="${NAAM}" loading="lazy" decoding="async"></a><p class="bf-voet__tekst">${esc(tekst)}</p></div>
<div><h2>Snel naar</h2><ul class="bf-voet__lijst">${snel}</ul></div>
<div><h2>Onze diensten</h2><ul class="bf-voet__lijst">${diensten}</ul></div>
<div><h2>Contact</h2><ul class="bf-voet__lijst bf-voet__contact">
<li>${ICOON.tel}<a href="${TEL_HREF}">${TEL}</a></li>
<li>${ICOON.pin}<span>${adresHtml()}</span></li>
<li>${ICOON.mail}<a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
<li>${ICOON.btw}<span>BTW ${CONTACT.btw.display}</span></li></ul></div>
</div>
<div class="bf-voet__onder"><p>© ${new Date().getFullYear()} ${NAAM} · BTW ${CONTACT.btw.display}</p><nav aria-label="Juridisch"><a href="/privacy">Privacy</a><span aria-hidden="true"></span><a href="/voorwaarden">Voorwaarden</a><span aria-hidden="true"></span><a href="/cookies">Cookies</a></nav></div>
</div></footer>`;
}

/* ---------- paginakop (BF bouw/paginas.cjs r.103) ----------
   Foto + donkere laag + h1 op 2 regels (2e regel lichter, zoals de hero) + subkop.
   Zonder foto: de vlakke variant (juridisch, 404). Optioneel twee knoppen (divisiepagina's).
   Geen kruimelpad (dictaat Mohammed 11 okt: "de paths op de paginas subpaginas, weghalen"). */
export function paginakop(o: {
  kop: [string, string?];
  sub?: string;
  /** tweede alinea onder de subkop (bv. /diensten: sub r.97 + lede r.98) */
  lede?: string;
  foto?: { naam: string; pos?: string };
  knoppen?: string;
}) {
  const [r1, r2] = o.kop;
  return `<section class="bf-paginakop${o.foto ? '' : ' bf-paginakop--vlak'}">${o.foto ? beeld(o.foto.naam, { cls: 'bf-paginakop__beeld', alt: '', sizes: '100vw', lazy: false, prio: true, pos: o.foto.pos }) : ''}<div class="bf-paginakop__laag" aria-hidden="true"></div><div class="bf-paginakop__in"><h1>${esc(r1)}${r2 ? ` <span class="bf-paginakop__kop2">${esc(r2)}</span>` : ''}</h1>${o.sub ? `<p>${esc(o.sub)}</p>` : ''}${o.lede ? `<p class="bf-paginakop__lede">${esc(o.lede)}</p>` : ''}${o.knoppen ? `<div class="bf-paginakop__knoppen">${o.knoppen}</div>` : ''}</div></section>`;
}

/** Een volledige pagina: kop, main, belknop (niet op /contact) en voet. */
export function pagina(o: { actief: string; heeftPlaats: boolean; inhoud: string; voettekst: string; belknop?: boolean }) {
  return `<a class="bf-overslaan" href="#bf-inhoud">Naar de inhoud</a>${kop(o.actief, o.heeftPlaats)}<main id="bf-inhoud">${o.inhoud}</main>${o.belknop === false ? '' : belzweef()}${voet(o.voettekst)}`;
}
