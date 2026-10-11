/**
 * Gedeelde secties in de stijl van bfbouw.be (spec/bf-stijl.md §4, §7, §8, §10),
 * als HTML-stringbouwers. Bron van de markup: bfbouw-website/build.cjs (home r.281-386,
 * plaats r.234-253, formulier r.197-213, inspectieBlok r.257-262, procesBlok r.270-279,
 * dkaart r.256) en bouw/paginas.cjs (dienstrij r.170-173, waarden r.142, belofte r.145,
 * lees r.215). AB-onderdelen die BF niet heeft (FAQ, voor/na-schuif, n-stappenraster)
 * hebben hun opmaak in bf-ab.css.
 *
 * Geen enkel blok bevat zelf tekst die een claim is: alle copy komt binnen via de
 * parameters (inhoud.ts) en daar staat de bron per blok.
 */
import { CONTACT } from '@/data/contact';
import type { Divisie } from '@/lib/leads';
import { ICOON, type IcoonNaam, beeld, esc, grootsteUrl, logoInk, GOOGLE_PROFIEL, TEL, TEL_HREF } from './schil';
/* De paginakop (foto- en vlakke variant) staat in schil.ts (spec §4) en is hier ook bereikbaar, zodat elke pagina haar blokken uit één module haalt. */
export { paginakop, type Kruimel } from './schil';

export type Foto = { naam: string; alt: string; pos?: string };

/* ---------- keuzelijst van het formulier (spec §8) en de GHL-sleutel per keuze ---------- */
export const WERK: { t: string; key: Divisie }[] = [
  { t: 'Totaalrenovatie en nieuwbouw', key: 'ab_construct' },
  { t: 'Dakwerken', key: 'ab_dakwerken' },
  { t: 'Gevelrenovatie', key: 'ab_gevelbekleding' },
  { t: 'Badkamer en wellness', key: 'ab_bad__wellness' },
  { t: 'Interieurwerken', key: 'ab_interieurwerken' },
  { t: 'Ecologisch en energetisch', key: 'ab_ecologisch' },
  { t: 'Combinatie van werken', key: 'combinatie_meerdere_divisies' },
  { t: 'Weet ik nog niet', key: 'nog_te_bepalen' },
];
export const werkKey = (t: string | null | undefined): Divisie => WERK.find((w) => w.t === (t || '').trim())?.key ?? 'nog_te_bepalen';

/* ---------- hero (BF build.cjs r.311-322) ---------- */
export function hero(o: { kop: [string, string]; tekst: string; knop: string; dias: Foto[]; verder: string; heeftPlaats?: boolean }) {
  const dias = o.dias.map((d, i) => beeld(d.naam, { cls: 'bf-hero__beeld' + (i === 0 ? ' bf-is-on' : ''), alt: d.alt, sizes: '100vw', lazy: i !== 0, prio: i === 0, pos: d.pos })).join('');
  const kies = o.heeftPlaats === false ? 'href="/contact#offerte"' : 'href="#offerte" data-kies';
  return `<section class="bf-hero" aria-labelledby="bf-hero-kop">
<div class="bf-hero__slides" data-hero>${dias}</div>
<div class="bf-hero__laag" aria-hidden="true"></div>
<div class="bf-hero__in">
<div class="bf-hero__tekstblok">
<h1 class="bf-hero__kop" id="bf-hero-kop">${esc(o.kop[0])} <span class="bf-hero__kop2">${esc(o.kop[1])}</span></h1>
<p class="bf-hero__tekst">${esc(o.tekst)}</p>
<div class="bf-hero__knoppen"><a class="bf-knop bf-hero__knop" ${kies}>${esc(o.knop)}${ICOON.pijlR}</a><a class="bf-knop bf-knop--rand-wit" href="${TEL_HREF}">Bel ${TEL}</a></div>
</div>
<a class="bf-hero__verder" href="${o.verder}" aria-label="Verder naar de inhoud">${ICOON.omlaag}</a>
</div>
</section>`;
}

/* ---------- Google-badge (spec §1: "5,0 op Google" + 5 sterren MAG; aantal reviews NOOIT) ---------- */
export const googleBadge = () =>
  `<a class="bf-over__google" href="${GOOGLE_PROFIEL}" target="_blank" rel="noopener" aria-label="5,0 op Google, opent ons Google-profiel"><span class="bf-over__g">${ICOON.google}</span><span><span class="bf-over__sterren" aria-hidden="true">${ICOON.ster.repeat(5)}</span><b>5,0 op Google</b></span></a>`;

/* ---------- over-split (BF build.cjs r.324-332) ---------- */
export function overSplit(o: { id: string; kop: string; alineas: string[]; knop?: { tekst: string; href: string }; google?: boolean; foto: Foto }) {
  return `<section class="bf-over" id="${o.id}" aria-labelledby="${o.id}-kop">
<div class="bf-over__links">
<h2 class="bf-over__h2" id="${o.id}-kop">${esc(o.kop)}</h2>
${o.alineas.map((t) => `<p class="bf-over__tekst">${esc(t)}</p>`).join('')}
<div class="bf-over__acties">${o.knop ? `<a class="bf-knop bf-over__knop" href="${o.knop.href}">${esc(o.knop.tekst)}</a>` : ''}${o.google ? googleBadge() : ''}</div>
</div>
<figure class="bf-over__foto">${beeld(o.foto.naam, { alt: o.foto.alt, sizes: '(max-width: 1000px) 100vw, 424px', pos: o.foto.pos })}</figure>
</section>`;
}

/* ---------- cijferband (BF build.cjs r.334): statische getallen, bron per tegel ---------- */
export type Cijfer = { icoon: IcoonNaam; getal: string; label: string; bron: string };
export function cijferband(o: { label: string; tegels: Cijfer[] }) {
  return `<section class="bf-cijfers" aria-label="${esc(o.label)}"><ul class="bf-cijfers__band bf-cijfers__band--${o.tegels.length}">${o.tegels.map((c) => `<li class="bf-cijfer" data-claimbron="${esc(c.bron)}"><span class="bf-cijfer__icoon">${ICOON[c.icoon]}</span><span class="bf-cijfer__getal">${esc(c.getal)}</span><span class="bf-cijfer__label">${esc(c.label)}</span></li>`).join('')}</ul></section>`;
}

/* ---------- dienstenslider (BF build.cjs r.336-344, dkaart r.256) ---------- */
export type Dienstkaart = { titel: string; tekst: string; href: string; foto: Foto; icoon: IcoonNaam; link: string };
export function dienstenSlider(o: { id: string; kop: string; tekst?: string; knop?: { tekst: string; href: string }; banner: { naam: string; pos?: string }; kaarten: Dienstkaart[] }) {
  const kaart = (d: Dienstkaart) => `<li class="bf-dkaart"><div class="bf-dkaart__media">${beeld(d.foto.naam, { cls: 'bf-dkaart__beeld', alt: d.foto.alt, sizes: '(max-width: 1000px) 78vw, 290px', pos: d.foto.pos })}<span class="bf-dkaart__icoon" aria-hidden="true">${ICOON[d.icoon]}</span></div><div class="bf-dkaart__body"><h3>${esc(d.titel)}</h3><p>${esc(d.tekst)}</p><a class="bf-dkaart__link" href="${d.href}">${esc(d.link)}</a></div></li>`;
  const rechts = o.tekst || o.knop ? `<div class="bf-dsectie__rechts">${o.tekst ? `<p>${esc(o.tekst)}</p>` : ''}${o.knop ? `<a class="bf-knop bf-dsectie__knop" href="${o.knop.href}">${esc(o.knop.tekst)}${ICOON.pijlR}</a>` : ''}</div>` : '';
  return `<section class="bf-dsectie" id="${o.id}" aria-labelledby="${o.id}-kop">
<div class="bf-dsectie__band">${beeld(o.banner.naam, { cls: 'bf-dsectie__achter', alt: '', sizes: '(max-width: 1000px) 100vw, 1200px', pos: o.banner.pos })}<div class="bf-dsectie__laag" aria-hidden="true"></div>
<div class="bf-dsectie__in"><h2 class="bf-dsectie__kop" id="${o.id}-kop">${esc(o.kop)}</h2>${rechts}</div>
</div>
<div class="bf-dkaarten" data-dkaarten><ul class="bf-dkaarten__baan">${o.kaarten.map(kaart).join('')}</ul>
<div class="bf-dkaarten__nav"><button type="button" class="bf-rond" data-dk-prev aria-label="Vorige dienst">${ICOON.chevL}</button><div class="bf-dkaarten__stippen" aria-hidden="true">${o.kaarten.map(() => '<span></span>').join('')}</div><button type="button" class="bf-rond bf-rond--vol" data-dk-next aria-label="Volgende dienst">${ICOON.chevR}</button></div>
</div>
</section>`;
}

/* ---------- zekerheid (BF build.cjs r.346-353): huisvorm met foto, inzet, 4 kaarten ---------- */
function rondeVeelhoek(pts: number[][], r: number) {
  const n = pts.length; let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const v1 = [p0[0] - p1[0], p0[1] - p1[1]], v2 = [p2[0] - p1[0], p2[1] - p1[1]];
    const l1 = Math.hypot(v1[0], v1[1]), l2 = Math.hypot(v2[0], v2[1]); const rr = Math.min(r, l1 / 2, l2 / 2);
    const a = [p1[0] + v1[0] / l1 * rr, p1[1] + v1[1] / l1 * rr], b = [p1[0] + v2[0] / l2 * rr, p1[1] + v2[1] / l2 * rr];
    d += (i === 0 ? `M${a[0].toFixed(1)} ${a[1].toFixed(1)}` : ` L${a[0].toFixed(1)} ${a[1].toFixed(1)}`) + ` Q${p1[0]} ${p1[1]} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  return d + ' Z';
}
/* BF build.cjs r.107 */
const HUIS = rondeVeelhoek([[0, 197], [88, 133], [88, 12], [157, 12], [157, 83], [268, 2], [539, 199], [539, 272], [490, 272], [490, 492], [59, 492], [59, 272], [0, 272]], 9);
/* BF build.cjs r.75 */
const HUISICOON = '<svg viewBox="0 0 95 85" aria-hidden="true"><path d="M7 31 47.5 4 88 31v54H7z" fill="#efefef"/><path d="M3 34.5 47.5 5 92 34.5" fill="none" stroke="var(--merk-ui)" stroke-width="5" stroke-linejoin="miter"/><path d="M14 38h67v6H14z" fill="#fff" opacity=".7"/></svg>';
export function zekerheid(o: { kop: string; lede?: string; kaarten: { titel: string; tekst: string }[]; huis: string; inzet: Foto }) {
  return `<section class="bf-waarom" aria-labelledby="bf-waarom-kop">
<h2 class="bf-h2 bf-h2--midden" id="bf-waarom-kop">${esc(o.kop)}</h2><span class="bf-streep" aria-hidden="true"></span>${o.lede ? `<p class="bf-waarom__lede">${esc(o.lede)}</p>` : ''}
<div class="bf-waarom__veld">
<div class="bf-waarom__huis" aria-hidden="true"><svg viewBox="0 0 540 494" preserveAspectRatio="none"><defs><clipPath id="bf-huisvorm"><path d="${HUIS}"/></clipPath></defs><image href="${grootsteUrl(o.huis)}" x="0" y="0" width="540" height="494" preserveAspectRatio="xMidYMid slice" clip-path="url(#bf-huisvorm)"/></svg></div>
<div class="bf-waarom__inzet">${beeld(o.inzet.naam, { alt: o.inzet.alt, sizes: '173px', pos: o.inzet.pos })}</div>
${o.kaarten.map((k, i) => `<article class="bf-wkaart bf-wkaart--${i + 1}">${HUISICOON}<h3>${esc(k.titel)}</h3><p>${esc(k.tekst)}</p></article>`).join('')}
</div>
</section>`;
}

/* ---------- inspectieband (BF build.cjs r.257-262), goud verloop, navy tekst ---------- */
export function inspectieBand(o: { kop: string; tekst: string; knop: string; heeftPlaats: boolean }) {
  const kies = o.heeftPlaats ? 'href="#offerte" data-kies' : 'href="/contact#offerte"';
  return `<section class="bf-inspectie" aria-labelledby="bf-inspectie-kop"><div class="bf-inspectie__blok">
<div class="bf-inspectie__tekst"><h2 id="bf-inspectie-kop">${esc(o.kop)}</h2><p>${esc(o.tekst)}</p></div>
<div class="bf-inspectie__knoppen"><a class="bf-inspectie__knop bf-inspectie__knop--vol" ${kies}>${esc(o.knop)}${ICOON.pijlR}</a><a class="bf-inspectie__knop" href="${TEL_HREF}">Bel ${TEL}${ICOON.pijlR}</a></div>
</div></section>`;
}

/* ---------- traject (BF build.cjs r.270-279) met n stappen en een optionele tijdregel ---------- */
export type Stap = { titel: string; tekst: string; icoon: IcoonNaam; tijd?: string };
const PIJL = '<svg class="bf-pstap__pijl" viewBox="0 0 48 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 22c6-12 16-17 27-14 5 1.5 8 4 10 7"/><path d="M33 16l7 .5 1-7"/></svg>';
export function traject(o: { id: string; kop: string[]; tekst?: string; knop?: { tekst: string; href: string }; foto: Foto; stappen: Stap[] }) {
  const n = o.stappen.length;
  return `<section class="bf-proces" id="${o.id}" aria-labelledby="${o.id}-kop">
<div class="bf-proces__top">
<div class="bf-proces__intro"><h2 class="bf-h2" id="${o.id}-kop">${o.kop.map(esc).join('<br>')}</h2>${o.tekst ? `<p class="bf-proces__tekst">${esc(o.tekst)}</p>` : ''}${o.knop ? `<a class="bf-knop bf-proces__knop" href="${o.knop.href}">${esc(o.knop.tekst)}${ICOON.pijlR}</a>` : ''}</div>
<figure class="bf-proces__foto">${beeld(o.foto.naam, { alt: o.foto.alt, sizes: '(max-width: 1000px) 100vw, 600px', pos: o.foto.pos })}</figure>
</div>
<ol class="bf-proces__stappen bf-proces__stappen--${n}">${o.stappen.map((st, i) => `<li class="bf-pstap"><div class="bf-pstap__top"><span class="bf-pstap__ic" aria-hidden="true">${ICOON[st.icoon]}</span><span class="bf-pstap__nr">Stap ${i + 1}</span></div><h3>${esc(st.titel)}</h3>${st.tijd ? `<span class="bf-pstap__tijd">${esc(st.tijd)}</span>` : ''}<p>${esc(st.tekst)}</p>${i < n - 1 ? PIJL : ''}</li>`).join('')}</ol>
</section>`;
}

/* ---------- uitgevoerd werk: rail (BF build.cjs r.372-376) zonder knop en zonder link ---------- */
export type RailFoto = Foto & { label: string };
export function realisatieRail(o: { id: string; kop: string; fotos: RailFoto[]; na?: string }) {
  return `<section class="bf-rslider-sectie" id="${o.id}" aria-labelledby="${o.id}-kop"><div class="bf-rslider-sectie__in">
<div class="bf-rslider-sectie__intro"><h2 class="bf-h2" id="${o.id}-kop">${esc(o.kop)}</h2></div>
<div class="bf-rslider" data-slider role="group" aria-label="${esc(o.kop)}"><div class="bf-rslider__pijlen"><button type="button" class="bf-rond" data-slider-prev aria-label="Vorige foto">${ICOON.chevL}</button><button type="button" class="bf-rond bf-rond--vol" data-slider-next aria-label="Volgende foto">${ICOON.chevR}</button></div>
<ul class="bf-rslider__baan">${o.fotos.map((f) => `<li class="bf-rproject"><figure>${beeld(f.naam, { alt: f.alt, sizes: '(max-width: 1000px) 72vw, 272px', pos: f.pos })}</figure><strong>${esc(f.label)}</strong></li>`).join('')}</ul></div>
</div>${o.na || ''}</section>`;
}

/* ---------- voor/na-schuif (AB; labels zoals de LP: LpKgj.tsx r.618-622 "Voor" en "Na") ---------- */
export function voorNa(o: { voor: Foto; na: Foto; labelVoor?: string; labelNa?: string }) {
  const sizes = '(max-width: 1000px) 100vw, 1200px';
  return `<div class="bf-voorna" data-voorna><div class="bf-voorna__vak" style="--pos:50%">
${beeld(o.na.naam, { cls: 'bf-voorna__beeld', alt: o.na.alt, sizes })}
<div class="bf-voorna__voor">${beeld(o.voor.naam, { cls: 'bf-voorna__beeld', alt: o.voor.alt, sizes })}</div>
<span class="bf-voorna__label bf-voorna__label--voor" aria-hidden="true">${esc(o.labelVoor || 'Voor')}</span><span class="bf-voorna__label bf-voorna__label--na" aria-hidden="true">${esc(o.labelNa || 'Na')}</span>
<span class="bf-voorna__lijn" aria-hidden="true"><span class="bf-voorna__greep">${ICOON.chevL}${ICOON.chevR}</span></span>
<input class="bf-voorna__bereik" type="range" min="0" max="100" step="1" value="50" aria-label="Schuif tussen voor en na">
</div></div>`;
}

/* ---------- veelgestelde vragen (AB; BF-kaartstijl in bf-ab.css). <details> werkt zonder JS. ---------- */
export function faq(o: { id: string; kop: string; vragen: { v: string; a: string }[] }) {
  return `<section class="bf-vragen" id="${o.id}" aria-labelledby="${o.id}-kop">
<h2 class="bf-h2 bf-h2--midden" id="${o.id}-kop">${esc(o.kop)}</h2><span class="bf-streep" aria-hidden="true"></span>
<div class="bf-vragen__lijst">${o.vragen.map((q, i) => `<details class="bf-vraag"${i === 0 ? ' open' : ''}><summary>${esc(q.v)}<span class="bf-vraag__plus" aria-hidden="true"></span></summary><p>${esc(q.a)}</p></details>`).join('')}</div>
</section>`;
}

/* ---------- formulier (spec §8; BF build.cjs r.197-213) ---------- */
type Soort = 'offerte' | 'plaatsbezoek';
function formulier(soort: Soort, standaardWerk?: string) {
  const id = `bf-f-${soort}`;
  const opties = WERK.map((w) => `<option${w.t === standaardWerk ? ' selected' : ''}>${esc(w.t)}</option>`).join('');
  return `<form id="${id}" class="bf-form js-bf-form" data-soort="${soort}" novalidate>
<p class="bf-form__uitleg">Vul uw telefoonnummer of e-mailadres in.</p>
<div class="bf-fveld"><label for="${id}-naam">Voornaam en naam</label><input id="${id}-naam" name="naam" autocomplete="name"></div>
<div class="bf-fveld-rij">
<div class="bf-fveld"><label for="${id}-te">Telefoonnummer</label><input id="${id}-te" name="telefoon" type="tel" inputmode="tel" autocomplete="tel"></div>
<div class="bf-fveld"><label for="${id}-em">E-mailadres</label><input id="${id}-em" name="email" type="email" inputmode="email" autocomplete="email"></div>
</div>
<div class="bf-fveld"><label for="${id}-werk">Om welk werk gaat het?</label><select id="${id}-werk" name="werk"><option value="">Maak een keuze</option>${opties}</select></div>
<div class="bf-fveld bf-fveld--kort"><label for="${id}-pc">Postcode</label><input id="${id}-pc" name="postcode" inputmode="numeric" maxlength="4" autocomplete="postal-code"></div>
<div class="bf-fveld"><label for="${id}-pr">Beschrijf kort uw project</label><textarea id="${id}-pr" name="project" rows="4" maxlength="1000" placeholder="Type werken, gewenste startdatum, …"></textarea></div>
<button class="bf-knop bf-form__knop" type="submit">${soort === 'offerte' ? 'Offerte aanvragen' : 'Plaatsbezoek aanvragen'}${ICOON.pijlR}</button>
<p class="bf-formulier-melding" id="${id}-melding" role="status" hidden></p>
<p class="bf-form__privacy">We gebruiken uw gegevens enkel om uw aanvraag te behandelen. Lees ons <a href="/privacy">privacybeleid</a>.</p>
</form>`;
}

/* ---------- plaatsblok (BF build.cjs r.234-253): goud blok, contacttegels, formulierkaart met tabs ----------
   pagina: sleutel van de pagina in bron_lead en trackFormStart ('home', 'over', 'dakwerken', ...).
   bron: LeadPayload.source (spec §8: 'landing_page').
   standaardWerk: vooraf gekozen werk (divisiepagina: die afdeling). */
export function plaatsBlok(o: { pagina: string; bron?: 'landing_page' | 'contact_form'; standaardWerk?: string; kop: string; tekst: string; knopKies: string }) {
  return `<section class="bf-plaats" id="offerte" aria-labelledby="bf-plaats-kop" data-pagina="${esc(o.pagina)}" data-bron="${o.bron || 'landing_page'}"><div class="bf-plaats__raam" id="contact"><div class="bf-plaats__blok">
<div class="bf-plaats__tekst">
<h2 class="bf-plaats__kop" id="bf-plaats-kop">${esc(o.kop)}</h2><button type="button" class="bf-plaats__inspectie" data-kies>${esc(o.knopKies)}${ICOON.pijlR}</button>
<p class="bf-plaats__lede">${esc(o.tekst)}</p>
<ul class="bf-plaats__info">
<li><span class="bf-plaats__ic">${ICOON.tel}</span><span><b>Telefoon</b><a href="${TEL_HREF}">${TEL}</a></span></li>
<li><span class="bf-plaats__ic">${ICOON.mail}</span><span><b>E-mail</b><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></span></li>
<li><span class="bf-plaats__ic">${ICOON.pin}</span><span><b>Adres</b><span>${esc(CONTACT.address.full)}</span></span></li>
</ul>
<img class="bf-plaats__logo" src="${logoInk()}" width="440" height="125" alt="" loading="lazy" decoding="async">
</div>
<div class="bf-plaats__form" data-fwissel><div class="bf-plaats__formkern">
<div class="bf-fwissel" role="tablist" aria-label="Soort aanvraag"><button type="button" role="tab" id="bf-tab-offerte" aria-controls="bf-paneel-offerte" aria-selected="true" class="bf-is-actief" data-wissel="offerte">Offerte aanvragen</button><button type="button" role="tab" id="bf-tab-plaatsbezoek" aria-controls="bf-paneel-plaatsbezoek" aria-selected="false" tabindex="-1" data-wissel="plaatsbezoek">Gratis plaatsbezoek</button></div>
<div class="bf-fpaneel bf-is-on" id="bf-paneel-offerte" role="tabpanel" aria-labelledby="bf-tab-offerte" data-paneel="offerte">${formulier('offerte', o.standaardWerk)}</div>
<div class="bf-fpaneel" id="bf-paneel-plaatsbezoek" role="tabpanel" aria-labelledby="bf-tab-plaatsbezoek" data-paneel="plaatsbezoek" hidden>${formulier('plaatsbezoek', o.standaardWerk)}</div>
</div></div>
</div></div></section>`;
}

/* ---------- dienstrij (BF bouw/paginas.cjs r.170-173) ---------- */
export type Dienstrij = { id: string; nr: string; titel: string; alineas: string[]; punten?: string[]; foto?: Foto; icoon: IcoonNaam; knop?: { tekst: string; href: string } };
export function dienstRij(rijen: Dienstrij[]) {
  return `<div class="bf-dienstrijen">${rijen.map((d, i) => `<section class="bf-dienstrij${i % 2 ? ' bf-dienstrij--om' : ''}${d.foto ? '' : ' bf-dienstrij--zonder'}" id="${d.id}" aria-labelledby="bf-h-${d.id}">
${d.foto ? `<div class="bf-dienstrij__beeld">${beeld(d.foto.naam, { alt: d.foto.alt, sizes: '(max-width: 1000px) 100vw, 560px', pos: d.foto.pos })}<span class="bf-dienstrij__icoon" aria-hidden="true">${ICOON[d.icoon]}</span></div>` : ''}
<div class="bf-dienstrij__tekst"><span class="bf-dienstrij__nr">${esc(d.nr)}</span><h2 class="bf-h2" id="bf-h-${d.id}">${esc(d.titel)}</h2>${d.alineas.map((t) => `<p>${esc(t)}</p>`).join('')}${d.punten && d.punten.length ? `<ul class="bf-dienstrij__punten">${d.punten.map((p) => `<li><span class="bf-belofte__vink" aria-hidden="true">${ICOON.vink}</span><span>${esc(p)}</span></li>`).join('')}</ul>` : ''}${d.knop ? `<a class="bf-knop bf-dienstrij__knop" href="${d.knop.href}">${esc(d.knop.tekst)}${ICOON.pijlR}</a>` : ''}</div></section>`).join('')}</div>`;
}

/* ---------- waarden-raster (BF bouw/paginas.cjs r.142) ---------- */
export function waardenRaster(o: { kop: string; lede?: string; items: { titel: string; tekst: string; icoon?: IcoonNaam }[]; grijs?: boolean }) {
  return `<section class="bf-sblok${o.grijs === false ? '' : ' bf-sblok--grijs'}"><div class="bf-sraam"><h2 class="bf-h2 bf-h2--midden">${esc(o.kop)}</h2>${o.lede ? `<p class="bf-sraam__lede">${esc(o.lede)}</p>` : ''}
<div class="bf-waarden bf-waarden--${o.items.length}">${o.items.map((w, i) => `<article class="bf-waarde"><span class="bf-waarde__nr" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${w.icoon ? `<span class="bf-waarde__icoon">${ICOON[w.icoon]}</span>` : ''}<h3>${esc(w.titel)}</h3><p>${esc(w.tekst)}</p></article>`).join('')}</div></div></section>`;
}

/* ---------- beloftelijst (BF bouw/paginas.cjs r.143-147, duo met vinkjes) ---------- */
export function beloftelijst(o: { kop: string; lede?: string; punten: { titel: string; tekst: string }[]; foto?: Foto; om?: boolean; grijs?: boolean }) {
  return `<section class="bf-sblok${o.grijs ? ' bf-sblok--grijs' : ''}"><div class="bf-duo${o.om ? ' bf-duo--om' : ''}${o.foto ? '' : ' bf-duo--zonder'}">
<div class="bf-duo__tekst"><h2 class="bf-h2">${esc(o.kop)}</h2>${o.lede ? `<p>${esc(o.lede)}</p>` : ''}
<ul class="bf-belofte">${o.punten.map((p) => `<li><span class="bf-belofte__vink" aria-hidden="true">${ICOON.vink}</span><div><h3>${esc(p.titel)}</h3><p>${esc(p.tekst)}</p></div></li>`).join('')}</ul></div>
${o.foto ? `<figure class="bf-duo__foto">${beeld(o.foto.naam, { alt: o.foto.alt, sizes: '(max-width: 1000px) 100vw, 540px', pos: o.foto.pos })}</figure>` : ''}
</div></section>`;
}

/* ---------- leeskolom (BF .lees: privacy, voorwaarden, cookies) ----------
   html: de juridische tekst WOORDELIJK uit het bestaande bestand (spec §10). */
export const lees = (html: string) => `<section class="bf-blok"><div class="bf-lees">${html}</div></section>`;
