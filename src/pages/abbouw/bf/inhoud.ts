/**
 * Tekst van de BF-pagina's van abgroep.be, met de bron per blok (spec/bf-stijl.md §6-7).
 *
 * De hometekst is het dictaat van Mohammed van 4 okt 2026 en staat in HOME
 * (lp/replica/inhoud.ts r.598-793). Ze wordt hier GEÏMPORTEERD, niet gekopieerd:
 * één bron, woordelijk, en de guards die HOME lezen (check-replica-copy, check-fotos)
 * blijven dezelfde tekst toetsen. Afdelingsnamen komen uit _divisies.ts (één bron).
 * Een zin die niet uit HOME komt, staat hieronder letterlijk met zijn bron erbij.
 *
 * Beelden: alleen echte AB-foto's (spec §9); namen = bestanden in src/assets/bf
 * (scripts/bf-beelden.cjs). Alt-teksten komen uit de bestaande pagina's waar die
 * foto al stond; staat de foto nergens, dan beschrijft de alt wat er te zien is.
 */
import { HOME } from '../lp/replica/inhoud';
import { DIVISIES } from '../_divisies';
import type { Cijfer, Dienstkaart, Foto, RailFoto, Stap } from './blokken';
import type { IcoonNaam } from './schil';
import { ONDERAAN_FOTO, ONDERAAN_CIRKEL } from './onderaan';

/* Url van elke eigen foto zoals Vite hem levert. In de build heet een beeld assets/<hash>.jpg (vite.config.ts
   assetFileNames), dus de bestandsnaam staat dan niet in x.src: zoeken op naam alleen gaf in de build een witte
   pagina (gemeten 12 okt, "geen alt in HOME.werk.fotos voor IMG_0102"). Daarom ook vergelijken met de url zelf. */
const EIGEN = import.meta.glob('/src/assets/lp-diensten/eigen/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

/* Alt-tekst van een foto die al in het uitgevoerd werk van HOME staat (bron: kgj/inhoud-totaalrenovatie.ts r.276-292). */
const werkAlt = (bestand: string) => {
  const eigenUrl = EIGEN['/src/assets/lp-diensten/eigen/' + bestand + '.jpg'];
  const f = (HOME.werk.fotos || []).find((x) => (eigenUrl && x.src === eigenUrl) || (x.src || x.naam || '').includes(bestand));
  if (!f) throw new Error('geen alt in HOME.werk.fotos voor ' + bestand);
  return f.alt;
};

/* Afdeling -> titel uit _divisies.ts, kaarttekst uit HOME.diensten.kaarten (inh r.687-706). */
const kaartTekst = (href: string) => {
  const k = HOME.diensten.kaarten.find((x) => x.href === href);
  if (!k) throw new Error('geen kaart in HOME.diensten voor ' + href);
  return k.tekst;
};
const dienst = (slug: string, icoon: IcoonNaam, foto: Foto, tekst = kaartTekst('/' + slug)): Dienstkaart => {
  const titel = DIVISIES[slug].title;
  return { titel, tekst, href: '/' + slug, foto, icoon, link: 'Lees meer over ' + titel.toLowerCase() };
};

/* ---------- "Uitgevoerd werk" zoals eerst op de home (home-oud.ts; Mohammed 12 okt) ----------
   Het spoor van de oude home in die volgorde (HOME.werk.fotos @9727a84 = de 17 eigen foto's van
   kgj/inhoud-totaalrenovatie.ts r.275-291 met de afgewerkte dakfoto op plek 3, replica/inhoud.ts r.722-726; gemeten
   op de oude home 12 okt: 18 tegels). Alle 18 staan in de lijst echte foto's (ab-fotos.md §3); geen badkamer-nieuw en
   geen realisaties/*-p1/p2/p3 (die stonden alleen in het spoor van de LP, TOTAALRENOVATIE.werk). Alt en uitsnede
   woordelijk uit dezelfde bron. */
const WERK_OUD: Foto[] = [
  { naam: 'IMG_9065', alt: werkAlt('IMG_9065') },
  { naam: 'IMG_9028', alt: werkAlt('IMG_9028'), pos: '60% center' },
  { naam: 'dak-na', alt: 'Vernieuwd pannendak met nieuwe pannen en dakvensters, door AB Bouw Groep' },
  { naam: 'IMG_0110', alt: werkAlt('IMG_0110') },
  { naam: 'IMG_9022', alt: werkAlt('IMG_9022') },
  { naam: 'IMG_0114', alt: werkAlt('IMG_0114') },
  { naam: 'IMG_9015', alt: werkAlt('IMG_9015') },
  { naam: 'IMG_9069', alt: werkAlt('IMG_9069'), pos: '75% center' },
  { naam: 'IMG_0102', alt: werkAlt('IMG_0102'), pos: '40% center' },
  { naam: 'IMG_9030', alt: werkAlt('IMG_9030') },
  { naam: 'IMG_0111', alt: werkAlt('IMG_0111') },
  { naam: 'IMG_9027', alt: werkAlt('IMG_9027') },
  { naam: 'IMG_0105', alt: werkAlt('IMG_0105') },
  { naam: 'IMG_9025', alt: werkAlt('IMG_9025') },
  { naam: 'IMG_0100', alt: werkAlt('IMG_0100') },
  { naam: 'IMG_9029', alt: werkAlt('IMG_9029'), pos: '80% center' },
  { naam: 'IMG_0106', alt: werkAlt('IMG_0106') },
  { naam: 'IMG_9014', alt: werkAlt('IMG_9014') },
];
/* Tweelingen (andere opname van dezelfde ruimte, ab-fotos.md §6) van foto's uit WERK_OUD die op de BF-site kunnen staan. */
const TWEELING: Record<string, string[]> = {
  IMG_9022: ['totaalrenovatie-p5-a'],
  IMG_9015: ['IMG_0105'],
  IMG_0105: ['IMG_9015'],
};

const [overAlinea1, overAlinea2] = HOME.over.tekst.split('\n\n');
const STAPICONEN: IcoonNaam[] = ['gesprek', 'bezoek', 'offerte', 'werken', 'oplevering'];

export const HOME_BF = {
  /* SEO: dezelfde waarden als nu (spec §11), HOME r.600-601 */
  titel: HOME.titel,
  omschrijving: HOME.omschrijving,

  /* §7.2 hero: HOME.hero (inh r.661-663). Knop 2 = "Bel 0460 20 77 88" (aanname A3, vervangt "Of bel direct:"). */
  hero: {
    // dictaat Mohammed 11 okt: "Uw bouw- of renovatiepartner van A tot Z als headline"
    kop: ['Uw bouw- of renovatiepartner', 'van A tot Z'] as [string, string],
    tekst: HOME.hero.sub,
    knop: HOME.hero.knop,
    /* volgorde = dictaat Mohammed 11 okt: "de eerste foto in de hero foto roll moet zijn die mooie
       keuken foto", "daarna die woonkamer", "daarna de rest" */
    dias: [
      // bron alt: kgj/inhoud-totaalrenovatie.ts r.130 (dezelfde foto als herodia van de LP)
      { naam: 'totaalrenovatie-p5-a', alt: 'Open leefruimte met keuken en eethoek na totaalrenovatie door AB Bouw Groep' },
      { naam: 'IMG_0102', alt: werkAlt('IMG_0102') },
      // drone-opname van de werf (Downloads/IMG_9019, 11 okt naar lp-diensten/eigen gekopieerd). Stond op geen enkele
      // bestaande pagina, dus de alt beschrijft wat te zien is. dak-voor.jpg (kgj/inhoud.ts r.379) is een ANDERE opname
      // van hetzelfde dak (1600x900, dichtbij, ander standpunt; IMG_9019 = 2358x1710, hele woning van bovenaf).
      { naam: 'IMG_9019', alt: 'Woning van bovenaf tijdens de dakwerken: de oude dakbedekking is eraf en de dakstructuur ligt open, door AB Bouw Groep' },
      { naam: 'IMG_9028', alt: werkAlt('IMG_9028'), pos: '60% center' },
    ] as Foto[],
  },

  /* §7.3 over-split: kop HOME.over.kop (inh r.673) als één regel, alinea's inh r.674-675 woordelijk */
  over: {
    // dictaat Mohammed 11 okt: "Alle vakmensen onder één dak" naar "waarom AB Bouw Groep"
    kop: 'Waarom AB Bouw Groep',
    alineas: [overAlinea1, overAlinea2],
    knop: { tekst: 'Meer over ons', href: '/over' },
    // vakman onderaan de foto (zoals FOTOPLAN /over beloftelijst, 50% 85%); alleen merkbaar op ≤1000 px,
    // desktop toont de volle hoogte (gemeten 11 okt: 390 zonder uitsnede 18-82 % van de hoogte, vakman op 74-92 %)
    foto: { naam: 'IMG_0105', alt: werkAlt('IMG_0105'), pos: '50% 85%' } as Foto,
  },

  /* §7.4 cijferband: statische getallen. De bron per tegel staat ALLEEN als commentaar boven de tegel: commentaar valt
     weg bij de build. Een veld 'bron' kwam als tekst in de publieke JS-bundel, ook al toont de pagina het nergens
     (vondst ronde 1: naam in data-claimbron; vondst ronde 2: 'dictaat …' als stringliteral in de bundel). */
  cijfers: [
    // bron: OverOns.tsx r.21 (dictaat Mohammed 4 okt, "6 vakdisciplines onder één dak")
    { icoon: 'vakmensen', getal: '6', label: 'Vakdisciplines onder één dak' },
    // bron: Google Maps (cid 0x7d0fc6746e96d5bf), gemeten 11 okt 2026: 5,0; spec §1
    { icoon: 'sterLijn', getal: '5,0', label: 'Op Google' },
    // bron: dictaat Mohammed 11 okt ("Garantie ipv wettelijke aansprakelijkheid") + wet (tienjarige aansprakelijkheid, art. 1792 en 2270 oud BW)
    { icoon: 'schild', getal: '10 jaar', label: 'Garantie' },
    // bron: lp/replica/inhoud.ts r.784-785 (FAQ, dictaat Mohammed 4 okt: plaatsbezoek en offerte kosteloos)
    { icoon: 'plaatsbezoek', getal: 'Gratis', label: 'Plaatsbezoek en offerte' },
  ] satisfies Omit<Cijfer, 'bron'>[],

  /* §7.5 diensten: kop HOME.diensten.kop; rechts de zin van /diensten (Diensten.tsx r.97, dictaat) */
  diensten: {
    kop: HOME.diensten.kop[0],
    tekst: 'Eén betrouwbare partner voor al uw bouw- en renovatieplannen.',
    knop: { tekst: 'Bekijk alle diensten', href: '/diensten' },
    banner: { naam: 'tegelwerken-p4-a' },
    kaarten: [
      dienst('construct', 'construct', { naam: 'IMG_9029', alt: werkAlt('IMG_9029'), pos: '80% center' }),
      // bron alt: replica/inhoud.ts r.724
      dienst('dakwerken', 'dak', { naam: 'dak-na', alt: 'Vernieuwd pannendak met nieuwe pannen en dakvensters, door AB Bouw Groep' }),
      // alt AANGEPAST van replica/inhoud.ts r.730 (altNa van uitbreiding-na: dezelfde aanbouw, andere opname): "Dezelfde"
      // viel weg (de voor-foto staat hier niet) en ", door AB Bouw Groep" kwam erbij zoals bij de andere kaarten.
      // De oude /diensten (Diensten.tsx r.111) gaf deze foto alleen de sjabloon-alt "Gevelrenovatie door AB Bouw Groep".
      dienst('gevel', 'gevel', { naam: 'uitbreiding-gevel', alt: 'Aanbouw afgewerkt met witte crepi en een schuifraam over de volle breedte, door AB Bouw Groep' }),
      dienst('bad', 'bad', { naam: 'IMG_9025', alt: werkAlt('IMG_9025') }),
      dienst('interieur', 'interieur', { naam: 'IMG_9065', alt: werkAlt('IMG_9065') }),
      // aanname A8: kaarttekst = zijn dienstenzin (Diensten.tsx r.37), past bij de enige echte foto (vloerverwarming)
      dienst('ecologisch', 'ecologisch', { naam: 'IMG_9064', alt: 'Kamer in renovatie met de sleuven voor vloerverwarming in de vloer, door AB Bouw Groep' }, 'Installatie van warmtepompen en efficiënte technieken.'),
    ],
  },

  /* §7.6 zekerheid: HOME.aanbod (inh r.759-770) woordelijk */
  zekerheid: {
    kop: HOME.aanbod.kop,
    lede: HOME.aanbod.lede,
    kaarten: (HOME.aanbod.bolletjes || []).map((b) => ({ titel: b.titel, tekst: b.tekst })),
    huis: 'pleisterwerk-g2',
    // bron alt: kgj/inhoud-totaalrenovatie.ts (terras-p4-b)
    inzet: { naam: 'terras-p4-b', alt: 'Terrasaanleg met lijngoot en nivelleerclips rond een vijver, door AB Bouw Groep' } as Foto,
  },

  /* §7.7 inspectieband: kop = HOME.eind.kop[1], tekst = HOME.eind.tekst (live eindband, inh r.774-776) */
  inspectie: {
    kop: HOME.eind.kop[1],
    tekst: HOME.eind.tekst,
    knop: HOME.hero.knop,
  },

  /* §7.8 traject: HOME.werkwijze (inh r.737-751) woordelijk, geen introtekst */
  werkwijze: {
    kop: HOME.werkwijze.kop,
    knop: { tekst: 'Bekijk onze werkwijze', href: '/werkwijze' },
    // bron alt: replica/inhoud.ts r.240
    foto: { naam: 'kaart-ruwbouw', alt: 'Nieuwe brede doorgang tussen leefruimte en keuken na het wegbreken van de muur' } as Foto,
    stappen: HOME.werkwijze.stappen.map((s, i) => ({ titel: s.titel, tekst: s.tekst, icoon: STAPICONEN[i] })) as Stap[],
  },

  /* §7.9 uitgevoerd werk: kop HOME.werk.kop; onderschrift = één categoriewoord (afdeling) */
  werk: {
    kop: HOME.werk.kop,
    fotos: [
      { naam: 'IMG_0114', label: 'Interieur' },
      { naam: 'IMG_9069', label: 'Badkamer', pos: '75% center' },
      { naam: 'IMG_0111', label: 'Interieur' },
      { naam: 'IMG_9014', label: 'Totaalrenovatie' },
      { naam: 'IMG_0100', label: 'Interieur' },
      { naam: 'IMG_0110', label: 'Interieur' },
    ].map((f) => ({ ...f, alt: werkAlt(f.naam) })) as RailFoto[],
    // voor/na zoals op de LP (kgj/inhoud-totaalrenovatie.ts r.306-307), labels "Voor" en "Na" (LpKgj.tsx r.618-622)
    voorNa: {
      voor: { naam: 'woonkeuken-voor', alt: 'De verbouwing in ruwbouw: nieuwe binnenmuren in snelbouwsteen, houten balken in het plafond en de opening naar de tuin' } as Foto,
      na: { naam: 'woonkeuken-na', alt: 'Dezelfde doorkijk na de werken: open woonkeuken met lichtkoepel, lichte vloer en een glazen deur naar de tuin' } as Foto,
    },
  },

  /* Uitgevoerd werk op de home sinds 12 okt (Mohammed: "bij uitgevoerd werk, doe dat naar hoe dat eerst was"): kop
     HOME.werk.kop, het spoor van de oude home (WERK_OUD, zelfde volgorde) in de oude opbouw (home-oud.ts), met de
     voor/na-schuif van werk.voorNa eronder. spoor = WERK_OUD zonder de foto's die elders op de home al staan of daar
     een tweeling hebben (geen foto twee keer op één pagina). "werk" hierboven blijft staan voor fotoplan.ts. */
  werkOud: {
    kop: HOME.werk.kop,
    fotos: WERK_OUD,
    get spoor(): Foto[] { return spoorOud(); },
  },

  /* §7.10 FAQ: HOME.faq (inh r.779-791) woordelijk */
  faq: {
    kop: HOME.faq!.kop[0],
    vragen: HOME.faq!.vragen,
  },

  /* §7.11 plaatsblok: HOME.contact (inh r.616-622) woordelijk */
  contact: {
    kop: HOME.contact.kop,
    tekst: HOME.contact.tekst!,
    knopKies: 'Vraag een gratis plaatsbezoek aan',
  },

  /* voet: HOME.footer (inh r.650, gelijk aan rpFooter) */
  voet: HOME.footer,
};

/* Het spoor "zoals eerst" zonder dubbels: een foto die al in de hero (dictaat 11 okt), de over-split, de dienstkaarten,
   de zekerheid, het traject, de voor/na-schuif of het onderste deel (onderaan.ts, spec §16) staat, of daar een tweeling
   heeft, valt uit het spoor. De dienstentegels (home-diensten.ts) tonen diensten.kaarten. De rest houdt de oude volgorde. */
function spoorOud(): Foto[] {
  const H = HOME_BF;
  const elders = new Set<string>([
    ...H.hero.dias, H.over.foto, ...H.diensten.kaarten.map((k) => k.foto), H.zekerheid.inzet, { naam: H.zekerheid.huis },
    H.werkwijze.foto, H.werk.voorNa.voor, H.werk.voorNa.na, ONDERAAN_FOTO, ONDERAAN_CIRKEL,
  ].map((f) => f.naam));
  return WERK_OUD.filter((f) => !elders.has(f.naam) && !(TWEELING[f.naam] || []).some((t) => elders.has(t)));
}

/* Beschrijving voor de pagina's die er zelf nooit een zetten (OverOns, Diensten, Werkwijze,
   Contact, NotFound): bij een rechtstreeks bezoek gold die van index.html r.8. Die waarde
   blijft (spec §11: de huidige waarden); de BF-schil zet haar nu expliciet, zodat er na een
   SPA-navigatie geen beschrijving van de vorige pagina blijft hangen. */
export const OMSCHRIJVING_STANDAARD = 'Algemene aannemer voor dakwerken, gevelrenovatie, badkamers, interieur, totaalrenovatie en energiewerken. Gratis plaatsbezoek in heel Vlaanderen.';
