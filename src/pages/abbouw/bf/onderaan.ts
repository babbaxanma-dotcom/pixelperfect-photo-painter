/**
 * Het onderste deel "zoals eerst": de contactsectie en de navy eindband van de live home
 * (LpReplica.tsx r.1048-1131, opmaak stijl.ts r.787-847), in de letter en kleuren van de nieuwe site.
 *
 * Mohammed, 12 okt: "die plaatsbezoek ding onderaan wel graag zoals eerst", "dus full width naar de zijkanten",
 * "dat het zoals eerst komt"; klikkeuze "Oud onderste deel terug". Dit vervangt plaatsBlok() op elke pagina.
 *
 * Teksten: HOME.contact en HOME.eind (replica/inhoud.ts r.616-622 en r.773-777), woordelijk; een pagina mag
 * zijn eigen kop en zin meegeven (zoals bij het plaatsblok). Beelden: alleen echte AB-foto's (spec §9); de oude
 * keuken- en cirkelfoto waren AI-beelden (kaart/ab-fotos.md §2) en zijn vervangen.
 *
 * Formulier: dezelfde koppeling als het plaatsblok (gedrag.ts stap 9-10). form.js-bf-form met data-soort="contact"
 * geeft bron_lead "<pagina>:contact", zoals de oude home ("home:contact", LpReplica.tsx r.481).
 */
import { CONTACT } from '@/data/contact';
import { HOME } from '../lp/replica/inhoud';
import { ICOON, beeld, esc, TEL, TEL_HREF } from './schil';
import { WERK } from './blokken';
import './onderaan.css';

export type OnderaanFoto = { naam: string; alt: string; pos?: string };

/* Standaardbeelden (echt, kaart/ab-fotos.md §3). Een pagina waarop een van deze al staat (of een tweeling,
   ab-fotos.md §6), geeft een ander mee. */
export const ONDERAAN_FOTO: OnderaanFoto = { naam: 'IMG_9027', alt: 'Keukeneiland met twee barkrukken, afgewerkt door AB Bouw Groep' };
export const ONDERAAN_CIRKEL: OnderaanFoto = { naam: 'IMG_0106', alt: 'Afgewerkte douche met patroontegels, door AB Bouw Groep' };

const telIcoon = ICOON.tel, pinIcoon = ICOON.pin;

/** De witte contactsectie: telefoonchip, kop, zin, drie tegels, formulierkaart en foto. */
function contactSectie(o: { pagina: string; bron: 'landing_page' | 'contact_form'; kop: string; tekst: string; standaardWerk?: string; foto: OnderaanFoto; laatste: boolean }) {
  const id = 'bf-oc-f';
  const opties = WERK.map((w) => `<option${w.t === o.standaardWerk ? ' selected' : ''}>${esc(w.t)}</option>`).join('');
  return `<section class="bf-oc${o.laatste ? ' bf-oc--laatste' : ''}" id="offerte" aria-labelledby="bf-oc-kop" data-pagina="${esc(o.pagina)}" data-bron="${o.bron}"><div class="bf-oc__raam" id="contact">
<div class="bf-oc__midden"><a class="bf-oc__chip" href="${TEL_HREF}">${esc(CONTACT.phone.display)}${ICOON.chevR}</a><h2 class="bf-h2 bf-oc__kop" id="bf-oc-kop">${esc(o.kop)}</h2><p class="bf-oc__tekst">${esc(o.tekst)}</p></div>
<ul class="bf-oc__info">
<li><span class="bf-oc__cirkel">${telIcoon}</span><div><h3>Telefoon</h3><p><a href="${TEL_HREF}">${esc(CONTACT.phone.spaced)}</a></p></div></li>
<li><span class="bf-oc__cirkel">${pinIcoon}</span><div><h3>Werkgebied</h3><p>Heel Vlaanderen</p></div></li>
<li><span class="bf-oc__cirkel">${ICOON.woning}</span><div><h3>Adres</h3><p>${esc(CONTACT.address.street)}<br>${esc(CONTACT.address.postcode)} ${esc(CONTACT.address.city)}</p></div></li>
</ul>
<div class="bf-oc__rij">
<div class="bf-oc__form bf-plaats__formkern"><form id="${id}" class="bf-oc__formulier js-bf-form" data-soort="contact" novalidate>
<div class="bf-oc__paar">
<div class="bf-oc__veld"><label for="${id}-vn">Voornaam</label><input id="${id}-vn" name="voornaam" placeholder="Voornaam" autocomplete="given-name"></div>
<div class="bf-oc__veld"><label for="${id}-an">Achternaam</label><input id="${id}-an" name="achternaam" placeholder="Achternaam" autocomplete="family-name"></div>
</div>
<div class="bf-oc__paar">
<div class="bf-oc__veld"><label for="${id}-te">Telefoon</label><input id="${id}-te" name="telefoon" type="tel" inputmode="tel" placeholder="Telefoon" autocomplete="tel"></div>
<div class="bf-oc__veld"><label for="${id}-em">E-mail</label><input id="${id}-em" name="email" type="email" inputmode="email" placeholder="E-mail" autocomplete="email"></div>
</div>
<div class="bf-oc__veld bf-oc__enkel"><label for="${id}-werk">Soort werk</label><select id="${id}-werk" name="werk"><option value="">Soort werk</option>${opties}</select></div>
<div class="bf-oc__veld bf-oc__enkel"><label for="${id}-pr">Bericht (optioneel)</label><textarea id="${id}-pr" name="project" rows="5" maxlength="1000" placeholder="Bericht (optioneel)"></textarea></div>
<button class="bf-knop bf-oc__knop" type="submit">${esc(HOME.contact.knop || 'Verstuur aanvraag')}${ICOON.pijlR}</button>
<p class="bf-formulier-melding bf-oc__melding" id="${id}-melding" role="status" hidden></p>
<p class="bf-oc__privacy">We gebruiken uw gegevens enkel om uw aanvraag te behandelen. Lees ons <a href="/privacy">privacybeleid</a>.</p>
</form></div>
<div class="bf-oc__foto">${beeld(o.foto.naam, { cls: 'bf-oc__img', alt: o.foto.alt, sizes: '(max-width: 1000px) 100vw, 500px', pos: o.foto.pos })}</div>
</div>
</div></section>`;
}

/** De navy eindband over de volle breedte, met de cirkelfoto die over de bovenrand steekt. */
function eindBand(cirkel: OnderaanFoto) {
  const [r1, r2] = HOME.eind.kop;
  return `<section class="bf-eind" aria-labelledby="bf-eind-kop">
<div class="bf-eind__cirkel">${beeld(cirkel.naam, { cls: 'bf-eind__img', alt: cirkel.alt, sizes: '500px', pos: cirkel.pos })}</div>
<div class="bf-eind__raam"><div class="bf-eind__vat">
<h2 class="bf-eind__kop" id="bf-eind-kop">${esc(r1)}${r2 ? `<br>${esc(r2)}` : ''}</h2>
<p>${esc(HOME.eind.tekst)}</p>
<div class="bf-eind__knoppen"><a class="bf-knop bf-eind__knop" href="${TEL_HREF}">${esc(TEL)}${ICOON.pijlR}</a><button type="button" class="bf-knop bf-eind__knop bf-eind__knop--wit" data-kies>Vraag een plaatsbezoek aan${ICOON.pijlR}</button></div>
</div></div>
</section>`;
}

/**
 * Het hele onderste deel. eind: false op /contact (daar is de contactsectie de pagina zelf).
 * pagina: sleutel in bron_lead en trackFormStart ('home', 'over', 'dakwerken', ...).
 */
export function onderaan(o: {
  pagina: string;
  bron?: 'landing_page' | 'contact_form';
  kop?: string;
  tekst?: string;
  standaardWerk?: string;
  foto?: OnderaanFoto;
  cirkel?: OnderaanFoto;
  eind?: boolean;
}) {
  const eind = o.eind !== false;
  return contactSectie({
    pagina: o.pagina,
    bron: o.bron || 'landing_page',
    kop: o.kop || HOME.contact.kop,
    tekst: o.tekst || HOME.contact.tekst || '',
    standaardWerk: o.standaardWerk,
    foto: o.foto || ONDERAAN_FOTO,
    laatste: !eind,
  }) + (eind ? eindBand(o.cirkel || ONDERAAN_CIRKEL) : '');
}
