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

/* Alt-tekst van een foto die al in het uitgevoerd werk van HOME staat (bron: kgj/inhoud-totaalrenovatie.ts r.276-292). */
const werkAlt = (bestand: string) => {
  const f = (HOME.werk.fotos || []).find((x) => (x.src || x.naam || '').includes(bestand));
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

const [overAlinea1, overAlinea2] = HOME.over.tekst.split('\n\n');
const STAPICONEN: IcoonNaam[] = ['gesprek', 'bezoek', 'offerte', 'werken', 'oplevering'];

export const HOME_BF = {
  /* SEO: dezelfde waarden als nu (spec §11), HOME r.600-601 */
  titel: HOME.titel,
  omschrijving: HOME.omschrijving,

  /* §7.2 hero: HOME.hero (inh r.661-663). Knop 2 = "Bel 0460 20 77 88" (aanname A3, vervangt "Of bel direct:"). */
  hero: {
    kop: [HOME.hero.regels[0], HOME.hero.regels[1]] as [string, string],
    tekst: HOME.hero.sub,
    knop: HOME.hero.knop,
    dias: [
      // 1: drone-opname van de werf (Downloads/IMG_9019, 11 okt naar lp-diensten/eigen gekopieerd)
      { naam: 'IMG_9019', alt: 'Woning van bovenaf tijdens de dakwerken: de oude dakbedekking is eraf en de dakstructuur ligt open, door AB Bouw Groep' },
      { naam: 'IMG_0102', alt: werkAlt('IMG_0102') },
      // bron alt: kgj/inhoud-totaalrenovatie.ts r.130 (dezelfde foto als herodia van de LP)
      { naam: 'totaalrenovatie-p5-a', alt: 'Open leefruimte met keuken en eethoek na totaalrenovatie door AB Bouw Groep' },
      { naam: 'IMG_9028', alt: werkAlt('IMG_9028'), pos: '60% center' },
    ] as Foto[],
  },

  /* §7.3 over-split: kop HOME.over.kop (inh r.673) als één regel, alinea's inh r.674-675 woordelijk */
  over: {
    kop: HOME.over.kop.join(' '),
    alineas: [overAlinea1, overAlinea2],
    knop: { tekst: 'Meer over ons', href: '/over' },
    foto: { naam: 'IMG_0105', alt: werkAlt('IMG_0105') } as Foto,
  },

  /* §7.4 cijferband: statische getallen, bron per tegel (data-claimbron) */
  cijfers: [
    { icoon: 'vakmensen', getal: '6', label: 'Vakdisciplines onder één dak', bron: 'dictaat Mohammed 4 okt, /over (OverOns.tsx r.21)' },
    { icoon: 'sterLijn', getal: '5,0', label: 'Op Google', bron: 'Google Maps, gemeten 11 okt 2026' },
    { icoon: 'schild', getal: '10 jaar', label: 'Wettelijke aansprakelijkheid', bron: 'wet (tienjarige aansprakelijkheid)' },
    { icoon: 'plaatsbezoek', getal: 'Gratis', label: 'Plaatsbezoek en offerte', bron: 'FAQ dictaat Mohammed 4 okt (inh r.784)' },
  ] as Cijfer[],

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
      // bron alt: replica/inhoud.ts r.731 (dezelfde aanbouw, afgewerkt)
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
      { naam: 'IMG_0106', label: 'Badkamer' },
      { naam: 'IMG_9027', label: 'Interieur' },
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
