/**
 * Tekst van /diensten in de stijl van bfbouw.be (spec/bf-stijl.md §10), met de bron per blok.
 *
 * Bron: src/pages/abbouw/Diensten.tsx = het dictaat van Mohammed van 4 okt 2026 (letterlijk,
 * in de u-vorm). Diensten.tsx exporteert zijn data niet en laadt bij een import roofpro.css
 * mee; daarom staat de tekst hier WOORDELIJK overgenomen, met het regelnummer erbij.
 * Niets ingekort, niets herschreven. De afdelingsnamen komen uit _divisies.ts (één bron,
 * spec §4); ze zijn gelijk aan de titels in Diensten.tsx r.25-70.
 *
 * Beelden: FOTOPLAN.diensten (spec §15): kop = de dienstenbanner van de home, elke rij = de
 * homekaart van die afdeling (één vaste foto per afdeling over de hele site).
 */
import { DIVISIES } from '../_divisies';
import type { Dienstrij } from './blokken';
import { FOTOPLAN, type DivisieSlug } from './fotoplan';
import { HOME_BF, OMSCHRIJVING_STANDAARD } from './inhoud';
import type { IcoonNaam } from './schil';

/* De zes afdelingen, in de volgorde en met de tekst van Diensten.tsx r.23-78.
   kort = het woord in de knop "Meer over …" (r.120: `Meer over ${d.kort}`). */
const RIJEN: { slug: DivisieSlug; nr: string; kort: string; icoon: IcoonNaam; lede: string; punten: [string, string, string] }[] = [
  {
    // Diensten.tsx r.25-31
    slug: 'construct', nr: '01', kort: 'totaalrenovatie', icoon: 'construct',
    lede: 'Een ingrijpend bouwproject vraagt om strakke regie en overzicht. Wij nemen de volledige werfcoördinatie in handen, van de eerste grondwerken tot de schilderklare oplevering. Uw voordeel? Eén centrale projectleider die de voortgang bewaakt, overlegt met de architect en zorgt dat de ruwbouw naadloos overgaat in de afwerking.',
    punten: [
      'Volledige renovaties en sleutel-op-de-deur nieuwbouw',
      'Aanbouwen en volume-uitbreidingen',
      'Eén vast aanspreekpunt voor het hele traject',
    ],
  },
  {
    // Diensten.tsx r.34-40
    slug: 'ecologisch', nr: '02', kort: 'energetisch renoveren', icoon: 'ecologisch',
    lede: 'De normen voor energiezuinig wonen worden steeds strenger. Wij helpen u om uw EPC-label drastisch te verbeteren met toekomstgerichte ingrepen. We kijken naar het totaalplaatje van uw woning en adviseren welke oplossingen het hoogste rendement opleveren, terwijl we u tegelijkertijd door het doolhof van de Vlaamse premies loodsen.',
    punten: [
      'Installatie van warmtepompen en efficiënte technieken',
      'Hoogwaardige isolatieschil (dak, vloer en wand)',
      'Actieve begeleiding bij het aanvragen van de Mijn VerbouwPremie',
    ],
  },
  {
    // Diensten.tsx r.43-49
    slug: 'dakwerken', nr: '03', kort: 'dakwerken', icoon: 'dak',
    lede: 'Het dak is de belangrijkste beschermlaag van uw pand. Wij bouwen, vernieuwen en isoleren dakkappen volgens de strengste normen voor waterdichtheid en windbestendigheid. We werken uitsluitend met robuuste, weersbestendige materialen voor een resultaat dat decennia meegaat.',
    punten: [
      'Hellende daken met kwalitatieve pannen en zinkwerk',
      'Platte daken voorzien van naadloze, duurzame EPDM',
      'Plaatsing van dakramen en dakkapellen',
    ],
  },
  {
    // Diensten.tsx r.52-58
    slug: 'gevel', nr: '04', kort: 'gevelrenovatie', icoon: 'gevel',
    lede: 'Een nieuwe gevel geeft uw woning niet alleen visueel een complete upgrade, het is hét moment om de buitenschil thermisch te optimaliseren. Wij combineren hoogwaardige esthetische afwerkingen direct met de juiste buitengevelisolatie, zodat uw woning zowel qua look als energieprestatie weer helemaal bij de tijd is.',
    punten: [
      'Afwerking in moderne crepi of traditionele steenstrips',
      'Houten en composiet gevelbekledingen',
      'Geïntegreerde isolatiesystemen (ETICS)',
    ],
  },
  {
    // Diensten.tsx r.61-67
    slug: 'bad', nr: '05', kort: 'badkamers', icoon: 'bad',
    lede: 'Uw badkamer moet een plek van comfort en rust zijn. Wij verzorgen de complete transformatie van de ruimte. Omdat onze eigen ploegen zowel het breekwerk, de leidingen, als het precieze tegel- en kitwerk voor hun rekening nemen, werken we efficiënt door. Zo zit u geen dag langer in het stof dan nodig.',
    punten: [
      'Complete renovaties van afbraak tot afwerking',
      'Plaatsing van inloopdouches en grootformaat tegels',
      'Installatie van hoogwaardig sanitair en vloerverwarming',
    ],
  },
  {
    // Diensten.tsx r.70-76
    slug: 'interieur', nr: '06', kort: 'interieurwerken', icoon: 'interieur',
    lede: 'De perfecte afwerking zit in de details. Onze interieurbouwers en eigen schrijnwerkers tillen de binnenkant van uw woning naar een hoger niveau. Met millimeterprecisie zorgen we voor een feilloze afwerking die perfect integreert met de rest van het huis.',
    punten: [
      'Vakkundige Gyproc-werken, scheidingswanden en (akoestische) plafonds',
      'Maatwerk door eigen schrijnwerkers: inbouwkasten en binnendeuren',
      'Plaatsing van kwalitatieve parket- en houten vloeren',
    ],
  },
];

export const DIENSTEN_BF = {
  /* SEO: Diensten.tsx r.147 zet alleen de titel; de beschrijving was die van index.html r.8 (spec §11) */
  titel: 'Onze diensten · AB Bouw Groep',
  omschrijving: OMSCHRIJVING_STANDAARD,

  /* paginakop: Diensten.tsx r.96-98 */
  kop: ['Onze diensten'] as [string],
  sub: 'Eén betrouwbare partner voor al uw bouw- en renovatieplannen.',
  lede: 'Bij AB Bouw Groep brengen we alle bouwspecialisaties samen onder één dak. Of u ons nu inschakelt voor een gerichte ingreep, of voor een project waarbij de hele woning op de schop gaat: wij hebben de juiste vakmensen in huis. Omdat onze afdelingen intern met elkaar communiceren, garanderen we een strakke, doorlopende planning zonder stiltes op de werf.',
  kopFoto: FOTOPLAN.diensten.kop,

  /* zes dienstrijen (BF bouw/paginas.cjs r.170-173): nummer, titel, lede, 3 vinkpunten, knop naar de afdelingspagina */
  rijen: RIJEN.map((r): Dienstrij => ({
    id: r.slug,
    nr: r.nr,
    titel: DIVISIES[r.slug].title,
    alineas: [r.lede],
    punten: r.punten,
    foto: FOTOPLAN.diensten.rijen[r.slug],
    icoon: r.icoon,
    knop: { tekst: 'Meer over ' + r.kort, href: '/' + r.slug },
  })),

  /* inspectieband: dezelfde band als op de home (HOME_BF.inspectie = live eindband, inh r.774-776) */
  inspectie: HOME_BF.inspectie,

  /* beloftelijst: kop r.130, lede r.131, punten r.81-83 (titel t, tekst d).
     Foto: de BF-tegenhanger (/over-ons/ "Wat u van ons mag verwachten", bouw/paginas.cjs r.145) is altijd een duo met
     foto links; BF heeft geen variant zonder foto (vondst ronde 2: 668 px brede kolom, kop op x=299 tegen x=105-169
     erboven en eronder). Zelfde beeld en uitsnede als de beloftelijst van /over (FOTOPLAN.over.belofte: IMG_0105,
     50% 85%, de vakman aan het werk). Geen tweeling op /diensten: groep 9015|0105|9066 komt hier niet voor
     (ab-fotos.md §6). NIEUWE FOTOKEUZE, BEVESTIGD DOOR MOHAMMED: nee. */
  belofte: {
    foto: FOTOPLAN.over.belofte,
    kop: 'Onze belofte bij elk project',
    lede: 'Hoe groot of klein de opdracht ook is, wij werken altijd volgens dezelfde vaste principes:',
    punten: [
      { titel: 'Gedetailleerde afspraken', tekst: 'Een heldere offerte en een vastgelegde startdatum. Geen verrassingen.' },
      { titel: 'Respect voor uw woning', tekst: 'Een gestructureerde werf die aan het einde van de week netjes wordt achtergelaten.' },
      { titel: 'Volledige dekking', tekst: '10 jaar wettelijke garantie op de uitgevoerde werken.' },
    ],
  },

  /* plaatsblok: kop = Diensten.tsx r.136 (spec §10); tekst = HOME.contact.tekst (dictaat 4 okt), het slot van /diensten had geen eigen alinea */
  plaats: {
    kop: 'Bespreek uw project met ons',
    tekst: HOME_BF.contact.tekst,
    knopKies: HOME_BF.contact.knopKies,
  },
};
