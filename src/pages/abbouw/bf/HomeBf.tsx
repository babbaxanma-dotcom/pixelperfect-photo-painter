/**
 * Homepage van abgroep.be in de stijl van bfbouw.be (spec/bf-stijl.md §7).
 * Volgorde: kop, hero, over-split, cijferband, diensten, zekerheid,
 * traject, uitgevoerd werk + voor/na, vragen, contactsectie + eindband (onderaan.ts, spec §16), voet + zwevende belknop.
 * Alle tekst komt uit inhoud.ts (HOME_BF), met de bron per blok.
 */
import { useMemo } from 'react';
import BfPagina from './BfPagina';
import { pagina } from './schil';
import { BEELDEN } from './beelden';
import { hero, overSplit, cijferband, dienstenSlider, zekerheid, traject, realisatieRail, voorNa, faq, type Foto } from './blokken';
import { onderaan } from './onderaan';
import { werkOud } from './home-oud';
import { dienstenCarrousel } from './home-diensten';
import { HOME_BF as H } from './inhoud';

/* Twee aanpassingen aan blokken die ALLEEN op de home staan (hero, cijferband), hier lokaal omdat blokken.ts en bf.css
   gedeeld zijn. vervang() telt mee: geeft het blok ooit een ander aantal treffers dan verwacht, dan blijft de markup
   zoals ze is (en faalt de dev-server luid), zodat een stille halve vervanging niet kan. */
function vervang(html: string, zoek: RegExp, nieuw: (i: number) => string, verwacht: number, wat: string) {
  const treffers = html.match(zoek)?.length ?? 0;
  if (treffers !== verwacht) {
    if (import.meta.env.DEV) throw new Error(`HomeBf: ${wat}: ${treffers} treffers, verwacht ${verwacht}`);
    return html;
  }
  let i = 0;
  return html.replace(zoek, () => nieuw(i++));
}

/* Hero-dia's: sizes volgens de beeldverhouding. hero() zet sizes="100vw", maar op <=1000 px is het herovak staand
   (390x844, object-fit cover): de foto staat dan zo breed als schermhoogte x beeldverhouding, niet 100vw. Met 100vw koos
   de browser op 390 de 800w-variant: dia 1 3,78x opgeschaald bij DPR 2 (vondst ronde 2). max(100vw, …) houdt een
   liggend gsm-scherm juist. Desktop blijft 100vw. Dia 1 (totaalrenovatie-p5-a) heeft zelf maar 1200x670: echt scherp
   op gsm wordt ze pas met een groter origineel van die foto. */
const heroSizes = (naam: string) => {
  const b = BEELDEN[naam];
  return `(max-width: 1000px) max(100vw, ${Math.ceil((b.breedte / b.hoogte) * 100)}vh), 100vw`;
};
const metHeroSizes = (html: string, dias: Foto[]) =>
  vervang(html, / sizes="100vw"/g, (i) => ` sizes="${heroSizes(dias[i].naam)}"`, dias.length, 'hero sizes');

/* Cijferband: de icooncirkel van BF (bf.css L1257: merkkleur op 12 % + ring op 35 %) mengt goud over navy tot een
   neutraal grijs vlak (gemeten 12 okt op 1265: 35,36,35 op navy 10,22,40; BF: warme gloed op antraciet). Hier een
   lichte navy vulling met een gouden ring; het icoon blijft goud (vondst ronde 2). */
const ICOONCIRKEL = 'background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 calc(1.5 * var(--u)) rgba(217,140,3,.5)';
const metIcoonCirkel = (html: string, aantal: number) =>
  vervang(html, /<span class="bf-cijfer__icoon">/g, () => `<span class="bf-cijfer__icoon" style="${ICOONCIRKEL}">`, aantal, 'cijfer-icoon');

export function homeHtml() {
  const inhoud = [
    metHeroSizes(hero({ kop: H.hero.kop, tekst: H.hero.tekst, knop: H.hero.knop, dias: H.hero.dias, verder: '#over' }), H.hero.dias),
    overSplit({ id: 'over', kop: H.over.kop, alineas: H.over.alineas, knop: H.over.knop, google: true, foto: H.over.foto }),
    // bron per tegel staat als commentaar in inhoud.ts; het type Cijfer (blokken.ts, gedeeld) vraagt nog een veld bron,
    // dat cijferband() nergens leest: leeg, zodat er geen interne tekst in de JS-bundel belandt (vondst ronde 2)
    metIcoonCirkel(cijferband({ label: 'AB Bouw Groep in cijfers', tegels: H.cijfers.map((c) => ({ ...c, bron: '' })) }), H.cijfers.length),
    dienstenCarrousel({ id: 'diensten', kop: H.diensten.kop, tekst: H.diensten.tekst, knop: H.diensten.knop, kaarten: H.diensten.kaarten }),
    zekerheid({ kop: H.zekerheid.kop, lede: H.zekerheid.lede, kaarten: H.zekerheid.kaarten, huis: H.zekerheid.huis, inzet: H.zekerheid.inzet }),
    traject({ id: 'werkwijze', kop: H.werkwijze.kop, knop: H.werkwijze.knop, foto: H.werkwijze.foto, stappen: H.werkwijze.stappen, pijlen: false }),
    werkOud({ id: 'realisaties', kop: H.werkOud.kop, fotos: H.werkOud.spoor, na: voorNa(H.werk.voorNa) }),
    faq({ id: 'vragen', kop: H.faq.kop, vragen: H.faq.vragen }),
    onderaan({ pagina: 'home', kop: H.contact.kop, tekst: H.contact.tekst }),
  ].join('\n');
  return pagina({ actief: '', heeftPlaats: true, inhoud, voettekst: H.voet });
}

export default function HomeBf() {
  const html = useMemo(homeHtml, []);
  return <BfPagina html={html} titel={H.titel} omschrijving={H.omschrijving} pad="/" bron="home" />;
}
