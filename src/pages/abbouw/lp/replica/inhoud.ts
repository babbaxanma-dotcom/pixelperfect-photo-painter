/**
 * De inhoud van de replica-landingspagina's, per pagina.
 *
 * De opzet, de stijl en het gedrag staan in LpReplica.tsx; alles wat per
 * pagina verschilt staat hier. Zo draaien totaalrenovatie en badkamerrenovatie
 * op dezelfde code: een fout in de carrousel of in het formulier hoeft maar één
 * keer gerepareerd, en een tweede pagina kan niet stilletjes achterlopen op de
 * eerste.
 *
 * Wat hier NIET in staat: verzonnen cijfers, termijnen of garanties. Elk
 * feitelijk getal op deze pagina's is terug te vinden in de live dienstpagina
 * (LpDienst.tsx) of in de contactgegevens — 6% btw bij een woning ouder dan
 * tien jaar, plaatsbezoek meestal binnen vijf werkdagen, twee tot drie weken
 * voor een volledige badkamer, vaste prijs na het plaatsbezoek.
 */
import type { Aanbodkaart, Dienstkaart, Stapgegevens } from './Onderdelen';
import {
  IcStapBel, IcStapBezoek, IcStapMeten, IcStapOplevering, IcStapWerf,
  IcZekerVca, IcZekerWoning, IcZekerBtw, IcZekerAttest,
} from './Iconen';

/* ── Beelden ──────────────────────────────────────────────────────────────
   De werffoto's van het spoor worden met een glob uit de realisaties-map
   gehaald (zie LpReplica); die staan hier dus als naam, niet als import. */
import svcDak from '@/assets/dak/lp-veluxg-3.jpg';
import svcGevel from '@/assets/home/svc-gevel.jpg';
import svcBad from '@/assets/home/svc-bad.jpg';
import svcInterieur from '@/assets/home/svc-interieur.jpg';
import svcConstruct from '@/assets/home/svc-construct.jpg';
import svcEco from '@/assets/home/svc-eco.jpg';
import homeHero from '@/assets/home/hero-steenstrips.jpg';
/* 1 okt: de keuken met barkrukken (p6-a) is dezelfde opname als IMG_9027 in het
   fotospoor, dat sinds vandaag alle LP-foto's toont. Hier dus de afgewerkte
   woonkeuken uit de voor/na van de totaalrenovatie-LP (IMG_0119). */
import homeOver from '@/assets/lp-diensten/woonkeuken-na.jpg';
import heroFoto from '@/assets/lp-diensten/totaalrenovatie-hero.jpg';
import overFoto from '@/assets/lp-diensten/totaalrenovatie-g1.jpg';
import dienstenBg from '@/assets/lp-diensten/totaalrenovatie-g2.jpg';
import kaartRuwbouw from '@/assets/lp-diensten/kaart-ruwbouw.jpg';
import kaartTechnieken from '@/assets/lp-diensten/kaart-technieken.jpg';
import kaartPleister from '@/assets/lp-diensten/kaart-pleisterwerk.jpg';
import kaartTegel from '@/assets/lp-diensten/kaart-vloeren.jpg';
import kaartSanitair from '@/assets/lp-diensten/kaart-badkamer.jpg';
import dakVoor from '@/assets/lp-diensten/dak-voor.jpg';
import dakNa from '@/assets/lp-diensten/dak-na.jpg';
import uitbreidingVoor from '@/assets/lp-diensten/uitbreiding-voor.jpg';
import uitbreidingNa from '@/assets/lp-diensten/uitbreiding-na.jpg';
import aanbod1 from '@/assets/lp-diensten/totaalrenovatie-steps.jpg';
import plaatsbezoekFoto from '@/assets/lp-diensten/plaatsbezoek.jpg';
import vcaLogo from '@/assets/lp-diensten/vca-logo.jpg';
import aanbod2 from '@/assets/lp-diensten/terras-g1.jpg';
import aanbod3 from '@/assets/lp-diensten/pleisterwerk-g2.jpg';
import aanbod4 from '@/assets/lp-diensten/oprit-g2.jpg';
import contactFoto from '@/assets/lp-diensten/totaalrenovatie-what.jpg';
import eindFoto from '@/assets/lp-diensten/tegelwerken-hero.jpg';
import cirkelFoto from '@/assets/lp-diensten/badkamer-hero.jpg';

import bkHero from '@/assets/lp-diensten/tegelwerken-g1.jpg';
import bkOver from '@/assets/lp-diensten/realisaties/badkamer-nieuw.jpg';
/* De vier beelden in de letters van 120+ op de badkamerpagina. Vier verschillende
   werven, zodat het getal niet vier keer dezelfde ruimte toont. */
import bkGlyph1 from '@/assets/lp-diensten/realisaties/badkamer-p1-a.jpg';
import bkGlyph2 from '@/assets/lp-diensten/realisaties/badkamer-p2-a.jpg';
import bkGlyph3 from '@/assets/lp-diensten/realisaties/badkamer-p3-a.jpg';
import bkGlyph4 from '@/assets/lp-diensten/realisaties/badkamer-p4-a.jpg';
import bkDienstenBg from '@/assets/lp-diensten/tegelwerken-what.jpg';
import bkKaartSanitair from '@/assets/lp-diensten/badkamer-g3.jpg';
import bkContact from '@/assets/lp-diensten/badkamer-hero.jpg';
import bkCirkel from '@/assets/lp-diensten/badkamer-services.jpg';
import bkAanbod1 from '@/assets/lp-diensten/badkamer-what.jpg';
import bkAanbod2 from '@/assets/lp-diensten/badkamer-g1.jpg';
import bkAanbod3 from '@/assets/lp-diensten/badkamer-steps.jpg';
import bkAanbod4 from '@/assets/lp-diensten/tegelwerken-g2.jpg';
import bkWerf from '@/assets/lp-diensten/badkamer-werf.jpg';
import bkUitbraak from '@/assets/bad/ruwbouw.jpg';
import bkLeidingen from '@/assets/construct/technieken.jpg';
import bkTegelzetter from '@/assets/bad/tegelwerk.jpg';
import dakAfgewerkt from '@/assets/lp-diensten/dak-na.jpg';
/* De echte foto's van uitgevoerd werk staan op de totaalrenovatie-LP (kgj); de
   homepage toont dezelfde lijst, zodat ze niet uit elkaar lopen. */
import { TOTAALRENOVATIE as RENO_LP } from '../kgj/inhoud-totaalrenovatie';

/** naam: bestand in assets/lp-diensten/realisaties; src: een geïmporteerd beeld
    (de echte foto's van de totaalrenovatie-LP). Precies één van beide. */
export type Werkfoto = { naam?: string; src?: string; alt: string; pos?: string };

export type PaginaInhoud = {
  /** Titel in het browsertabblad. */
  titel: string;
  /** Omschrijving voor de zoekresultaten. */
  omschrijving: string;
  /** Het korte adres van de pagina; hier wijst de canonical naartoe. */
  pad: string;
  /** Sleutel in DIENSTEN: levert de reviews en de keuzelijst "soort werk". */
  dienst: 'totaalrenovatie' | 'badkamerrenovatie';
  /** Divisie waaronder de lead in het CRM terechtkomt. */
  divisie: 'ab_construct' | 'ab_bad__wellness';
  /** Voorvoegsel van bron_lead; er komt ':contact' of ':balk' achter. */
  bronPrefix: string;
  /**
   * Reviews voor deze pagina. Blijft dit leeg, dan komen ze uit DIENSTEN.
   * Er wordt er GEEN geschreven en er wordt geen naam veranderd: dit zijn
   * bestaande, al gepubliceerde beoordelingen van abgroep.be.
   */
  reviews?: { text: string; name: string; role: string }[];
  /**
   * De vier foto's in de letters van "120+". Blijft dit leeg, dan staan er
   * renovatiebeelden. Op een dienstpagina hoort in dat getal het werk te staan
   * waar de bezoeker voor kwam: wie een badkamer zoekt, ziet daar geen daken.
   */
  glyphFotos?: string[];
  /**
   * Navigatie in de kop. Blijft dit leeg, dan staat de LP-navigatie er: links
   * die alleen naar een sectie van dezelfde pagina springen. Een landingspagina
   * hoort geen uitgangen te hebben, de homepage juist wel.
   */
  nav?: { label: string; href: string; chevron?: boolean }[];
  /** Veelgestelde vragen. Alleen de homepage heeft deze sectie. */
  faq?: { kop: string[]; vragen: { v: string; a: string }[] };
  /** Blok met de laatste artikels. Alleen de homepage heeft deze sectie. */
  blog?: { kop: string[]; knop: string; aantal: number };
  /** Toont de lijst met de zes divisies in de over-sectie. Standaard aan. */
  toonDivisies?: boolean;
  /** Toont de realisatieteller in de over-sectie. Standaard aan. */
  toonTeller?: boolean;
  /** Toont de oranje band "Bel ons vandaag" die door het beeld loopt. Standaard aan. */
  toonBand?: boolean;
  /**
   * Google-score in het blok op de foto (bv. '5,0'). Leeg = geen blok. Alleen
   * invullen met het cijfer dat op het Google-profiel van AB staat, met datum.
   */
  googleScore?: string;
  /** Toont de sectie met uitgevoerd werk. Standaard aan. */
  toonWerk?: boolean;
  /** Toont de badkamerschetser. */
  schetser?: boolean;
  /**
   * Toont de richtprijs-calculator onder de balk. Standaard aan; de homepage
   * zet hem uit. Optioneel, zodat de twee landingspagina's niets merken.
   */
  toonCalculator?: boolean;
  /** Toont het raster met dienstkaarten. */
  toonDiensten: boolean;
  /** Zin onder het logo in de voettekst. */
  footer: string;
  /**
   * Toont de merkenrail. De logo's in de repo zijn dak-, gevel- en
   * pleistermerken (Wienerberger, Koramic, Velux, Rockpanel, Knauf). Onder
   * "waar we mee bouwen" op een badkamerpagina klopt dat niet, en een
   * sanitairmerk erbij tekenen zou een leverancier verzinnen.
   */
  toonMerken: boolean;
  hero: {
    regels: string[];
    /** Regel onder de kop. Blijft dit leeg, dan staat er niets. */
    sub?: string;
    knop: string;
    /** Regel onder de knop, gevolgd door het telefoonnummer ("Of bel direct:"). */
    bel?: string;
    foto: string;
    alt: string;
    /** Waar de telefoonuitsnede op inzoomt; leeg laat de standaard staan. */
    focus?: string;
    /**
     * Fotorol over de volle breedte, zoals de hero van de totaalrenovatie-LP:
     * elke zes seconden de volgende foto, met een donkere waas en witte kop.
     * Leeg = de gesplitste hero met één foto (foto, alt).
     */
    dias?: { src: string; alt: string; pos?: string }[];
  };
  /** tekst: twee regeleinden na elkaar beginnen een nieuwe alinea. */
  over: { kop: string[]; tekst: string; slot: string; foto: string; alt: string };
  diensten: { kop: string[]; achtergrond: string; kaarten: Dienstkaart[] };
  werkwijze: { kop: string[]; stappen: Stapgegevens[] };
  werk: {
    kop: string;
    fotos: Werkfoto[];
    schuif?: { voor: string; na: string; altVoor: string; altNa: string; labelLinks: string; labelRechts: string };
  };
  /** bolletjes: punten in dezelfde vorm als de werkwijze, in plaats van het
      kaartenspoor; lede: de zin onder de kop (homepage, 5 okt 2026). */
  aanbod: { kop: string; kaarten: Aanbodkaart[]; lede?: string; bolletjes?: Stapgegevens[] };
  /** tekst: alinea onder de kop; dan vervalt de eigen kop van het formulier. knop: tekst op de verzendknop. */
  contact: { kop: string; foto: string; alt: string; tekst?: string; knop?: string };
  /** Zet de donkere afsluitband onder het contactformulier uit. */
  toonEind?: boolean;
  /** De kopbalk is bovenaan weg en schuift pas in beeld bij het scrollen; het
      logo staat dan wit in de hero (homepage, 5 okt 2026). */
  kopBovenaanWeg?: boolean;
  /** De voet van de gewone pagina's: pagina's en de zes afdelingen. */
  siteVoet?: boolean;
  eind: { kop: string[]; tekst: string; achtergrond: string; cirkel: string; cirkelAlt: string };
  calculator: {
    badge: string; kop: string; onder: string; knop: string;
    uitkomstKop: string;
    bronLead: string;
    bedanktSlug: string;
    divisie: 'ab_construct' | 'ab_bad__wellness';
    vragen: { sleutel: string; vraag: string; keuzes: { label: string; uitleg: string }[] }[];
  };
};

/* ══ Totaalrenovatie ══════════════════════════════════════════════════════ */

export const TOTAALRENOVATIE: PaginaInhoud = {
  titel: 'Totaalrenovatie in heel Vlaanderen, AB Bouw Groep',
  omschrijving: 'Ruwbouw, technieken, pleisterwerk, vloeren en afwerking door één aannemer met een eigen ploeg. Eén planning, één aanspreekpunt, gratis plaatsbezoek in heel Vlaanderen.',
  pad: '/totaalrenovatie',
  dienst: 'totaalrenovatie',
  divisie: 'ab_construct',
  bronPrefix: 'lp:totaalrenovatie',
  toonDiensten: true,
  footer: 'AB Bouw Groep is algemene aannemer voor renovatie en bouwwerken in heel Vlaanderen. Van ruwbouw tot afwerking.',
  toonMerken: true,
  hero: {
    regels: ['De partner voor uw', 'bouwwerkzaamheden', 'en renovatie'],
    knop: 'Plan gratis plaatsbezoek',
    foto: heroFoto,
    alt: 'Woonkamer en keuken na een totaalrenovatie door AB Bouw Groep',
  },
  over: {
    kop: ['Eén vaste ploeg voor uw', 'hele renovatie'],
    tekst: 'Geen enkele renovatie loopt precies zoals op papier. Achter een muur zit een leiding die niemand verwachtte, een vloer blijkt niet vlak, een deur sluit niet meer. Wie daar vooraf ruimte voor laat, houdt de planning overeind.',
    slot: 'Bij een totaalrenovatie werken die zes op dezelfde werf, volgens dezelfde planning.',
    foto: overFoto,
    alt: 'Afgewerkte leefruimte na een totaalrenovatie door AB Bouw Groep',
  },
  diensten: {
    kop: ['Wat er in een', 'totaalrenovatie zit'],
    achtergrond: dienstenBg,
    /**
     * De ONDERDELEN van één totaalrenovatie, in de volgorde waarin ze op de
     * werf gebeuren — strippen, technieken, pleisteren, tegelen, afwerken.
     * Geen dienstenmenu: "Totaalrenovatie" naast "Badkamer" en "Oprit" zetten
     * leest als vijf losse opdrachten en spreekt de hele pagina tegen.
     */
    kaarten: [
      { titel: 'Afbraak en ruwbouw', href: '#contact',
        tekst: 'Muren weg, nieuwe openingen, oude vloer eruit. Wat blijft staan wordt eerst ondersteund.',
        foto: kaartRuwbouw, alt: 'Nieuwe brede doorgang tussen leefruimte en keuken na het wegbreken van de muur' },
      { titel: 'Technieken', href: '#contact',
        tekst: 'Water, afvoer en elektriciteit gaan de muur in voordat er gepleisterd wordt.',
        foto: kaartTechnieken, alt: 'Verdeler voor vloerverwarming, netjes aangesloten in een ingebouwde kast' },
      { titel: 'Pleisterwerk en gyproc', href: '#contact',
        tekst: 'Wanden en plafonds vlak en recht, klaar om te schilderen.',
        foto: kaartPleister, alt: 'Strak gepleisterde wanden met een scherpe hoek en vlak plafond' },
      { titel: 'Vloeren en tegelwerk', href: '#contact',
        tekst: 'Van chape tot voeg: strak gelegd, recht in lijn en netjes afgewerkt.',
        foto: kaartTegel, alt: 'Grootformaat vloertegels in een afgewerkte leefruimte' },
      { titel: 'Interieur en afwerking', href: '#contact',
        tekst: 'Badkamer, keuken, binnendeuren en het maatwerk dat erbij hoort.',
        foto: kaartSanitair, alt: 'Afgewerkte badkamer met wastafel op eiken meubel' },
    ],
  },
  werkwijze: {
    kop: ['Wat er gebeurt nadat', 'u een aanvraag indient'],
    stappen: [
      { titel: 'U doet een aanvraag', Icoon: IcStapBel,
        tekst: 'Laat uw gegevens achter en vertel kort wat u wil laten doen. Een foto van de ruimte helpt. Bellen mag ook.' },
      { titel: 'Gratis plaatsbezoek', Icoon: IcStapBezoek,
        tekst: 'We bekijken de ruimte samen met u, luisteren naar wat u voor ogen hebt en zeggen meteen wat haalbaar is.' },
      { titel: 'Opmeten en offerte', Icoon: IcStapMeten,
        tekst: 'U krijgt de volledige prijs op papier, met per onderdeel wat erin zit. Ook de materialen die wij voorzien en de vermoedelijke doorlooptijd staan erbij.' },
      { titel: 'De werf start', Icoon: IcStapWerf,
        tekst: 'Dezelfde mensen komen elke dag terug. Wij schermen de rest van de woning af tegen stof en ruimen elke avond op.' },
      { titel: 'De laatste ronde', Icoon: IcStapOplevering,
        tekst: 'Bij de oplevering gaan we samen door de woning. Uw opmerkingen worden verholpen voordat de werf wordt afgesloten.' },
    ],
  },
  werk: {
    kop: 'Uitgevoerd werk',
    /**
     * Om en om gezet: er passen er vier tegelijk in beeld, dus bij groeperen
     * ziet de bezoeker in het eerste scherm alleen badkamers. Alleen ECHTE
     * werffoto's — elke gegenereerde foto die hier stond werd herkend als AI.
     */
    fotos: [
      { naam: 'badkamer-nieuw', alt: 'Badkamer met dubbele wastafel, groene metrotegels en vrijstaand bad, door AB Bouw Groep' },
      /* Staand beeld in een liggend kader: op het midden valt de tv-wand mooi
         uit, een lagere uitsnede zou alleen vloer laten zien. */
      { naam: 'interieur-tvwand', alt: 'Tv-wand in marmerlook met houten lamellen en zwevend meubel, door AB Bouw Groep' },
      { naam: 'badkamer-p4-a', alt: 'Badkamer met marmerlook-tegels en zwevend meubel, door AB Bouw Groep' },
      { naam: 'totaalrenovatie-p5-a', alt: 'Open keuken met eethoek na totaalrenovatie, door AB Bouw Groep' },
      { naam: 'badkamer-p3-b', alt: 'Badkamer in antraciet met zwevend wastafelmeubel, door AB Bouw Groep' },
      { naam: 'terras-p3-c', alt: 'Aangelegd terras met grijze tegels tegen de gevel, door AB Bouw Groep' },
      { naam: 'totaalrenovatie-p1-a', alt: 'Rijwoning met nieuwe gevelpleister en vernieuwd dak, door AB Bouw Groep' },
      { naam: 'badkamer-p4-b', alt: 'Badkamer met microcement wanden, bad en toilet, door AB Bouw Groep' },
      { naam: 'totaalrenovatie-p6-a', alt: 'Keukeneiland met barkrukken na renovatie, door AB Bouw Groep' },
      { naam: 'badkamer-p1-a', alt: 'Badkamer met inloopdouche in betonlook, door AB Bouw Groep' },
      { naam: 'terras-p4-b', alt: 'Terrasaanleg met lijngoot en nivelleerclips rond een vijver, door AB Bouw Groep' },
      { naam: 'oprit-p2-a', alt: 'Aangelegde klinkeroprit tot aan de poort, door AB Bouw Groep' },
      { naam: 'badkamer-p3-a', alt: 'Donkere badkamer met inloopdouche en lavabomeubel, door AB Bouw Groep' },
      /* Het interessante van dit beeld — de glaspui en de straat — zit rechts;
         bij een midden-crop blijft er kale muur over. Vandaar de eigen uitsnede. */
      { naam: 'totaalrenovatie-p6-b', alt: 'Afgewerkte handelsruimte met glaspui en tegelvloer, door AB Bouw Groep', pos: '72% center' },
      { naam: 'badkamer-p1-c', alt: 'Inloopdouche met glazen wand, door AB Bouw Groep' },
      { naam: 'terras-p3-a', alt: 'Terras in grote betontegels achter een woning, door AB Bouw Groep' },
      { naam: 'totaalrenovatie-p3-a', alt: 'Slaapkamer met eiken parket na renovatie, door AB Bouw Groep' },
      { naam: 'badkamer-p3-c', alt: 'Inloopdouche met donkere tegels en glaswand, door AB Bouw Groep' },
      { naam: 'tegelwerken-p4-a', alt: 'Tegelvloer in houtlook op de verdieping, door AB Bouw Groep' },
      { naam: 'badkamer-p1-b', alt: 'Badkamer met hangtoilet en wastafelmeubel, door AB Bouw Groep' },
    ],
    schuif: {
      voor: dakVoor, na: dakNa,
      altVoor: 'Het dak van dezelfde woning met de pannen eraf: alleen het houten gebint staat er nog',
      altNa: 'Hetzelfde dak na de werken, met nieuwe pannen en dakvensters',
      labelLinks: 'Dak eraf', labelRechts: 'Dak erop',
    },
  },
  aanbod: {
    kop: 'Uw zekerheden',
    kaarten: [
      { badge: ['6%', 'btw'], titel: '6% btw in plaats van 21%',
        tekst: 'Bij een woning ouder dan tien jaar.', knop: 'Bekijk of uw woning telt',
        href: '#contact', foto: aanbod1, alt: 'Afgewerkte woonkamer na renovatie' },
      { badge: ['Eigen', 'ploeg'], titel: 'Eigen ploeg op de werf',
        tekst: 'Dezelfde mensen, elke dag.', knop: 'Gratis offerte',
        href: '#contact', foto: aanbod3, alt: 'Gepleisterde ruimte tijdens de afwerking' },
      { badge: ['VCA', 'attest'], titel: 'VCA-gecertificeerd en verzekerd',
        tekst: '', knop: 'Gratis offerte',
        href: '#contact', foto: vcaLogo, alt: 'VCA-gecertificeerd' },
    ],
  },
  contact: {
    kop: 'Vraag een plaatsbezoek',
    foto: contactFoto,
    alt: 'Afgewerkte leefruimte uit een totaalrenovatie van AB Bouw Groep',
  },
  eind: {
    kop: ['Uw renovatie begint', 'met een plaatsbezoek.'],
    tekst: 'Laat uw gegevens achter of bel ons. Wij komen langs, lopen de woning met u door en zeggen meteen wat er mogelijk is.',
    achtergrond: eindFoto,
    cirkel: cirkelFoto,
    cirkelAlt: 'Afgewerkte badkamer uit een renovatie van AB Bouw Groep',
  },
  calculator: {
    badge: 'Prijsindicatie in 5 vragen',
    kop: 'Wat kost uw renovatie?',
    onder: 'Klik de antwoorden aan. U hoeft niets op te meten of op te zoeken.',
    knop: 'Start de berekening',
    uitkomstKop: 'Waar mogen wij uw prijs naartoe sturen?',
    bronLead: 'lp:totaalrenovatie:calculator',
    divisie: 'ab_construct' as const,
    bedanktSlug: 'totaalrenovatie',
    vragen: [
      { sleutel: 'Omvang', vraag: 'Hoever gaat uw renovatie?', keuzes: [
        { label: 'De hele woning', uitleg: 'van kelder tot dak' },
        { label: 'De benedenverdieping', uitleg: 'leefruimte, keuken, berging' },
        { label: 'De bovenverdieping', uitleg: 'slaapkamers en badkamer' },
        { label: 'Nog niet beslist', uitleg: 'daar komen we samen uit' },
      ] },
      { sleutel: 'Woning', vraag: 'Wat voor woning is het?', keuzes: [
        { label: 'Een appartement', uitleg: 'ongeveer 90 m²' },
        { label: 'Een rijwoning', uitleg: 'ongeveer 120 m²' },
        { label: 'Een halfopen woning', uitleg: 'ongeveer 160 m²' },
        { label: 'Een open bebouwing', uitleg: '200 m² of meer' },
        { label: 'Geen idee', uitleg: 'wij meten het op' },
      ] },
      { sleutel: 'Leeftijd woning', vraag: 'Hoe oud is de woning ongeveer?', keuzes: [
        { label: 'Nieuwer dan 10 jaar', uitleg: 'dan geldt 21% btw' },
        { label: '10 tot 30 jaar', uitleg: 'dan geldt 6% btw' },
        { label: '30 tot 50 jaar', uitleg: 'dan geldt 6% btw' },
        { label: 'Ouder dan 50 jaar', uitleg: 'dan geldt 6% btw' },
        { label: 'Weet ik niet', uitleg: 'wij zoeken het op' },
      ] },
      { sleutel: 'Staat', vraag: 'Hoeveel moet er vernieuwd worden?', keuzes: [
        { label: 'Alles', uitleg: 'strippen tot op de ruwbouw' },
        { label: 'Een groot deel', uitleg: 'een stuk blijft staan' },
        { label: 'Enkel de afwerking', uitleg: 'vloer, pleister en verf' },
        { label: 'Weet ik niet', uitleg: 'dat zien we ter plaatse' },
      ] },
      { sleutel: 'Start', vraag: 'Wanneer zou u willen starten?', keuzes: [
        { label: 'Zo snel mogelijk', uitleg: 'wij bellen u eerst' },
        { label: 'Binnen drie maanden', uitleg: 'ruim op tijd' },
        { label: 'Dit jaar nog', uitleg: 'we plannen samen in' },
        { label: 'Ik kijk eerst rond', uitleg: 'vrijblijvend, geen druk' },
      ] },
    ],
  },
};

/* ══ Badkamerrenovatie ════════════════════════════════════════════════════ */

export const BADKAMER: PaginaInhoud = {
  titel: 'Badkamerrenovatie in heel Vlaanderen, AB Bouw Groep',
  omschrijving: 'Uitbraak, leidingen, waterdichting, tegelwerk en sanitair door dezelfde ploeg. Een volledige badkamer staat er in twee tot drie weken, met een vaste prijs na het plaatsbezoek.',
  pad: '/badkamerrenovatie',
  dienst: 'badkamerrenovatie',
  divisie: 'ab_bad__wellness',
  bronPrefix: 'lp:badkamerrenovatie',

  /* Het getal 120+ toont hier badkamers. Met de renovatiebeelden stonden er
     daken en gevels in een cijfer dat over badkamerwerk gaat. */
  glyphFotos: [bkGlyph1, bkGlyph2, bkGlyph3, bkGlyph4],

  /*
   * Eigen navigatie. De standaardlijst had een link naar de dienstensectie en
   * die staat niet op deze pagina; daar klikte je op iets wat je nergens
   * bracht. Op die plek staat hier de schetser, dus wijst de link daarheen en
   * heet hij ernaar.
   */
  nav: [
    { label: 'Home', href: '#top' },
    { label: 'Over ons', href: '#over' },
    { label: 'Ontwerp uw badkamer', href: '#schetser' },
    { label: 'Aanpak', href: '#werkwijze' },
    { label: 'Contact', href: '#contact' },
  ],
  schetser: true,
  /* De dienstkaarten staan hier niet: de schetser neemt die plek in. */
  toonDiensten: false,
  footer: 'AB Bouw Groep vernieuwt badkamers in heel Vlaanderen. Leidingen, tegels en sanitair door dezelfde ploeg.',
  toonDivisies: false,
  toonMerken: false,
  /* Vijf in plaats van drie. De eerste drie stonden al op de dienstpagina,
     de laatste twee staan al op de homepage, allemaal bestaande beoordelingen
     over badkamerwerk. Er is er geen bijgeschreven en geen naam gewijzigd. */
  reviews: [
    { text: '"Oude badkamer was aan vervanging toe. Bad eruit, inloopdouche erin. Drie weken werk, netjes afgewerkt."', name: 'Greet Janssens', role: 'Bad vervangen door douche · Mechelen' },
    { text: '"Van begin tot eind dezelfde ploeg, dat voel je aan het resultaat. Alles strak en netjes afgewerkt. Heel content."', name: 'Katrien Peeters', role: 'Badkamer · Antwerpen' },
    { text: '"Bad vervangen door een inloopdouche en het toilet mee verplaatst. Alles strak aangesloten. Heel tevreden."', name: 'Peter Maes', role: 'Volledige renovatie · Willebroek' },
    { text: '"Vier weken stof, en dan een prachtige badkamer. Inloopdouche, zwevend meubel, vloerverwarming. De tegelzetter heeft hier echt zijn handtekening gezet."', name: 'Inge Vermeiren', role: 'Badkamer en toilet · Kontich' },
    { text: '"Op tijd begonnen en op tijd klaar. De douche loopt goed weg, dat was bij de vorige niet zo."', name: 'Linda Verbeeck', role: 'Badkamer op zolder · Bornem' },
  ],
  hero: {
    /* De kop noemt wat de klant thuis ziet staan als de ploeg weg is. */
    regels: ['Droombadkamer,', 'zoals u hem', 'voor ogen had'],
    knop: 'Plan gratis plaatsbezoek',
    foto: bkHero,
    alt: 'Badkamer met eiken meubel, opzetkom en zwart omkaderde douchewand, door AB Bouw Groep',
  },
  over: {
    /* Een why-us die loopt als een verhaal, niet als een rij bewijsstukken.
       Twee eerdere versies stapelden feitjes waar niemand om vraagt: de
       startdatum op papier, elke post apart in de offerte. Waar, maar het
       leest als een machine die zijn regels afvinkt.

       Deze volgt de teksten die Mohammed aandroeg: hij spreekt het vertrouwen
       uit ("u mag rekenen op") in plaats van het te bewijzen, noemt waarvoor
       je terecht kunt met een voorbeeld dat een lezer herkent, en eindigt op
       waar de lezer voor komt. Geen cijfer, geen jaartal, geen belofte over
       een resultaat dat AB niet zelf in de hand heeft. */
    kop: ['Waarom kiezen voor', 'AB Bouw Groep'],
    tekst: 'Onze badkamerploeg verzorgt uw badkamer in de ruimste zin van het woord. Bij ons kan u terecht voor een volledige renovatie, of voor een aanpassing aan wat er staat: de stap van een ligbad naar een ruime inloopdouche, bijvoorbeeld. Wij werken met ervaren vakmensen, plannen de uitvoering nauwkeurig en volgen ze van dichtbij op.',
    slot: 'U mag rekenen op één aanspreekpunt dat uw dossier kent, van de eerste kennismaking tot de oplevering. Zo krijgt u de badkamer die u voor ogen had, binnen de afgesproken termijn terwijl u van de werken zelf weinig merkt.',
    foto: bkOver,
    alt: 'Badkamer met dubbele lavabo op eiken meubel, bad en inloopdouche, door AB Bouw Groep',
  },
  diensten: {
    kop: ['Wat er in een', 'badkamerrenovatie zit'],
    achtergrond: bkDienstenBg,
    /**
     * De vijf onderdelen van één badkamerwerf, in de volgorde waarin ze
     * gebeuren. De foto's tonen die fasen bij echte werven van AB: uitbraak en
     * leidingwerk zijn ruwbouwbeelden, de laatste twee zijn afgewerkt.
     */
    kaarten: [
      { titel: 'Alles eruit', href: '#contact',
        tekst: 'Tegels, bad, meubel en de oude leidingen verdwijnen. Pas dan is te zien wat erachter zat.',
        foto: bkUitbraak, alt: 'Uitgebroken badkamer: kale bakstenen muren met de oude leidingen nog in zicht' },
      { titel: 'Nieuwe leidingen', href: '#contact',
        tekst: 'Water, afvoer en elektriciteit gaan de open muur in. De helling van de afvoer bepaalt of uw douche straks wegloopt.',
        foto: bkLeidingen, alt: 'Nieuwe water- en afvoerleidingen en ventilatie tegen de kale wand' },
      { titel: 'Waterdicht maken', href: '#contact',
        tekst: 'Op de vlakke ondergrond komt de laag die het water tegenhoudt. Gaat daar iets fout, dan ziet u dat pas jaren later.',
        foto: kaartTegel, alt: 'Vlakke, voorbereide vloer met grootformaat tegels' },
      { titel: 'Tegelwerk', href: '#contact',
        tekst: 'De tegelzetter begint bij de rij die u vanuit de deur ziet, zodat de gesneden stukken in de hoek uitkomen.',
        foto: bkTegelzetter, alt: 'Tegelzetter die een grootformaat tegel in de lijmlaag plaatst' },
      { titel: 'Sanitair plaatsen', href: '#contact',
        tekst: 'Toilet, meubel, kranen en de afzuiging gaan als laatste aan. Daarna wordt er gevoegd en opgekuist.',
        foto: bkKaartSanitair, alt: 'Afgewerkte badkamer met wastafelmeubel, hangtoilet en inloopdouche' },
    ],
  },
  werkwijze: {
    kop: ['Wat er gebeurt nadat', 'u een aanvraag indient'],
    stappen: [
      { titel: 'U doet een aanvraag', Icoon: IcStapBel,
        tekst: 'Laat uw gegevens achter en vertel kort wat er nu staat en wat weg mag. Een foto van de badkamer helpt. Bellen mag ook.' },
      { titel: 'Gratis plaatsbezoek', Icoon: IcStapBezoek,
        tekst: 'Wij meten de ruimte op, bekijken waar de afvoer ligt en luisteren naar wat u voor ogen hebt.' },
      { titel: 'Opmeten en offerte', Icoon: IcStapMeten,
        tekst: 'U krijgt een vaste prijs op papier, met per onderdeel wat erin zit: uitbraak, leidingen, tegelwerk, sanitair en de afvoer van het puin.' },
      { titel: 'De werf start', Icoon: IcStapWerf,
        tekst: 'Dezelfde ploeg doet het werk van uitbraak tot voeg. Heeft u maar één badkamer, dan gaan het toilet en een werkende douche als eerste terug open.' },
      { titel: 'De laatste ronde', Icoon: IcStapOplevering,
        tekst: 'Bij de oplevering lopen we samen door de badkamer en test u zelf de kranen en de afvoer. Wat u aanwijst, werken we af voordat de ploeg vertrekt.' },
    ],
  },
  werk: {
    kop: 'Uitgevoerde badkamers',
    /**
     * Alleen echte, afgewerkte badkamers van AB. De volgorde zet gelijkaardige
     * ruimtes uit elkaar: er staan er drie tot vier tegelijk in beeld, en twee
     * lichtgrijze inloopdouches naast elkaar leest als dezelfde foto.
     */
    fotos: [
      { naam: 'badkamer-p4-a', alt: 'Badkamer met marmerlook-tegels en zwevend eiken meubel, door AB Bouw Groep' },
      { naam: 'badkamer-p1-b', alt: 'Badkamer met hangtoilet en wastafelmeubel, door AB Bouw Groep' },
      { naam: 'badkamer-p3-a', alt: 'Donkere badkamer met inloopdouche en lavabomeubel, door AB Bouw Groep' },
      { naam: 'badkamer-p1-c', alt: 'Inloopdouche met glazen wand, door AB Bouw Groep' },
      { naam: 'badkamer-p4-b', alt: 'Badkamer met bad onder het raam en hangtoilet, door AB Bouw Groep' },
      { naam: 'badkamer-p3-b', alt: 'Badkamer in antraciet met zwevend wastafelmeubel, door AB Bouw Groep' },
      { naam: 'badkamer-p1-a', alt: 'Badkamer met inloopdouche in betonlook, door AB Bouw Groep' },
      { naam: 'badkamer-p3-c', alt: 'Inloopdouche met donkere tegels en glaswand, door AB Bouw Groep' },
    ],
    /* Geen voor/na-schuif: die hoort bij het dak van de totaalrenovatie. Van
       een badkamer bestaat er geen paar opnames vanuit exact hetzelfde punt,
       en twee verschillende ruimtes naast elkaar zetten zou een vergelijking
       suggereren die er niet is. */
  },
  aanbod: {
    kop: 'Uw zekerheden',
    kaarten: [
      { badge: ['6%', 'btw'], titel: '6% btw bij een woning ouder dan tien jaar',
        tekst: 'Wij bekijken of u in aanmerking komt en regelen het papierwerk.', knop: 'Bekijk of uw woning telt',
        href: '#contact', foto: bkAanbod1, alt: 'Badkamer met bad, meubel en houtlook-vloer' },
      { badge: ['5', 'werkdagen'], titel: 'Plaatsbezoek binnen vijf werkdagen',
        tekst: 'Opmeten, de afvoer bekijken, knelpunten benoemen.', knop: 'Gratis offerte',
        href: '#contact', foto: bkAanbod2, alt: 'Badkamer onder een schuin dak met hangtoilet en meubel' },
      { badge: ['2-3', 'weken'], titel: 'Twee tot drie weken werk',
        tekst: 'Van uitbreken tot de laatste voeg.', knop: 'Gratis offerte',
        href: '#contact', foto: bkWerf, alt: 'Badkamer halverwege de renovatie: wanden deels betegeld, leidingen aangesloten' },
      { badge: ['Vaste', 'prijs'], titel: 'Vaste prijs na het plaatsbezoek',
        tekst: 'Wat op de offerte staat, betaalt u.', knop: 'Gratis offerte',
        href: '#contact', foto: bkAanbod3, alt: 'Badkamer met dubbele lavabo, bad en inloopdouche' },
    ],
  },
  contact: {
    kop: 'Vraag een plaatsbezoek',
    foto: bkContact,
    alt: 'Afgewerkte badkamer met wastafelmeubel en inloopdouche, door AB Bouw Groep',
  },
  eind: {
    kop: ['Uw badkamer begint', 'met een plaatsbezoek.'],
    tekst: 'Laat uw gegevens achter of bel ons. Wij komen langs, meten de ruimte op en zeggen meteen wat er kan.',
    achtergrond: eindFoto,
    cirkel: bkCirkel,
    cirkelAlt: 'Afgewerkte badkamer met inloopdouche en hangtoilet, door AB Bouw Groep',
  },
  calculator: {
    badge: 'Prijsindicatie in 5 vragen',
    kop: 'Wat kost uw badkamer?',
    onder: 'Klik de antwoorden aan. U hoeft niets op te meten of op te zoeken.',
    knop: 'Start de berekening',
    uitkomstKop: 'Waar mogen wij uw prijs naartoe sturen?',
    bronLead: 'lp:badkamerrenovatie:calculator',
    divisie: 'ab_bad__wellness' as const,
    bedanktSlug: 'badkamerrenovatie',
    /* Vragen die iemand aan de keukentafel kan beantwoorden zonder rolmeter of
       plan. Overal een uitweg voor wie het niet weet: wie twijfelt sluit het
       scherm in plaats van te gokken. */
    vragen: [
      { sleutel: 'Werk', vraag: 'Wat wilt u laten doen?', keuzes: [
        { label: 'De hele badkamer', uitleg: 'van de kale muur opnieuw opgebouwd' },
        { label: 'Het bad wordt een douche', uitleg: 'de afvoer schuift mee op' },
        { label: 'Een inloopdouche plaatsen', uitleg: 'gelijkvloers instappen' },
        { label: 'Weet ik nog niet', uitleg: 'wij denken mee ter plaatse' },
      ] },
      { sleutel: 'Grootte', vraag: 'Hoe groot is uw badkamer?', keuzes: [
        { label: 'Klein', uitleg: 'douche, toilet en een lavabo' },
        { label: 'Gemiddeld', uitleg: 'bad of douche plus meubel' },
        { label: 'Ruim', uitleg: 'bad én aparte douche passen erin' },
        { label: 'Weet ik niet', uitleg: 'wij meten het op' },
      ] },
      { sleutel: 'Indeling', vraag: 'Blijven douche, toilet en lavabo op hun plaats?', keuzes: [
        { label: 'Alles blijft waar het staat', uitleg: 'wij sluiten aan op de bestaande buizen' },
        { label: 'De douche of het bad verhuist', uitleg: 'de afvoer moet mee verlegd' },
        { label: 'De hele indeling gaat anders', uitleg: 'alle aansluitingen schuiven op' },
        { label: 'Weet ik niet', uitleg: 'wij kijken waar de afvoer ligt' },
      ] },
      { sleutel: 'Woning', vraag: 'Hoe oud is de woning ongeveer?', keuzes: [
        { label: 'Nieuwer dan 10 jaar', uitleg: 'dan geldt 21% btw' },
        { label: 'Ouder dan 10 jaar', uitleg: 'dan geldt 6% btw' },
        { label: 'Weet ik niet', uitleg: 'wij zoeken het op' },
      ] },
      { sleutel: 'Start', vraag: 'Wanneer zou de ploeg mogen starten?', keuzes: [
        { label: 'Zo snel als het kan', uitleg: 'de badkamer is echt op' },
        { label: 'Binnen enkele maanden', uitleg: 'ik plan het rustig in' },
        { label: 'Dit jaar nog', uitleg: 'we plannen samen in' },
        { label: 'Nog niet beslist', uitleg: 'de prijs bepaalt mijn timing' },
      ] },
    ],
  },
};

/**
 * De homepage.
 *
 * Erft van TOTAALRENOVATIE en overschrijft alleen wat een homepage anders
 * maakt: navigatie met uitgangen, de zes divisies in plaats van de onderdelen
 * van een enkele renovatie, en twee secties die een landingspagina niet heeft.
 *
 * De teksten zijn ONGEWIJZIGD overgenomen van de bestaande homepage. Bij een
 * stijlombouw hoort geen stille herschrijving: dan weet niemand achteraf of
 * een zin veranderde omdat het moest of omdat het toevallig gebeurde.
 */
export const HOME: PaginaInhoud = {
  ...TOTAALRENOVATIE,
  titel: 'AB Bouw Groep, bouw en renovatie in heel Vlaanderen',
  omschrijving: 'Algemene aannemer voor dakwerken, gevelrenovatie, badkamers, interieur, totaalrenovatie en energiewerken. Eén vaste ploeg, vaste prijs na het plaatsbezoek. Gratis plaatsbezoek in heel Vlaanderen.',
  pad: '/',
  bronPrefix: 'home',
  /* 5 okt 2026, Mohammed: "de nav bar moet daar niet zichtbaar zijn, die moet gewoon
     clean komen als je scrolt" en "moet volledig weg zijn bovenaan". */
  kopBovenaanWeg: true,
  /* 4 okt 2026: alle zichtbare tekst van de homepage is de tekst die Mohammed
     aanleverde, letterlijk ("op de home page"). Hij koos bewust "letterlijk"
     voor punten die Bardh nog niet bevestigde. De secties die zijn tekst niet
     noemt (uitgevoerd werk, de zes afdelingen als links, de formulierbalk,
     de afsluitband) blijven staan: dat zijn foto's en bediening.
     5 okt 2026, Mohammed: "je hebt visuele aanpassingen gedaan terwijl ik
     daar niet om vroeg". De werkwijze en de zekerheden zijn daarom weer
     bolletjes, met zijn tekst erover verdeeld, en de afsluitband staat terug. */
  /* De gerenoveerde keuken uit het uitgevoerde werk van de landingspagina. */
  contact: {
    kop: 'Laten we uw plannen bespreken',
    tekst: 'Vul hieronder uw gegevens in en vertel ons kort wat u voor ogen heeft. We nemen snel contact met u op om een vrijblijvend plaatsbezoek in te plannen.',
    knop: 'Verstuur aanvraag',
    foto: heroFoto,
    alt: 'Gerenoveerde keuken met zicht op de tuin, door AB Bouw Groep',
  },
  /* De beoordelingen van de bestaande homepage: dak, gevel, interieur,
     totaalrenovatie en badkamer door elkaar, zodat een bezoeker het vak
     terugvindt waarvoor hij komt. Niet geschreven, niet aangepast --
     dit zijn beoordelingen die al op de site stonden. */
  /* Vier beoordelingen, een per vak: totaalrenovatie, badkamer, dakwerken
     en gevel. Alle vier staan al op de site; er is er geen geschreven en
     geen woord veranderd.

     De vorige twee zijn vervangen omdat ze als het bedrijf zelf klonken:
     "van begin tot eind dezelfde ploeg" is een verkoopargument, geen zin
     die een klant typt, en een ervan noemde de papierwinkel. Deze vier
     noemen een stookkost, een seizoen, een twijfel of de buren -- dat is
     hoe iemand over zijn eigen verbouwing praat. */
  /* 1 okt 2026: hier stonden vier reviews met naam. Ze kwamen van de oude site
     (Lovable-tekst) en staan niet op het Google-profiel van AB, dat één review
     heeft (gecontroleerd 22 sep). Regel 1: geen verzonnen reviews. De sectie
     verschijnt weer zodra hier echte reviews met toestemming staan. */
  reviews: [],
  /* Ook weg tot er een bron is: de teller "120+ realisaties", de merkenrij
     (Velux, Knauf, Isover: niet bevestigd door AB) en de lopende telefoonband
     (rustiger; het nummer staat al in de kop, de over-sectie en het contact). */
  toonTeller: false,
  toonMerken: false,
  toonBand: false,
  toonCalculator: false,
  toonDiensten: false,
  /* Dezelfde voet als de andere pagina's (rpFooter), ook de zin onder het logo. */
  footer: 'Bouw en renovatie voor dak, gevel, badkamer en interieur. Actief in Vlaanderen en Brussel.',
  siteVoet: true,

  nav: [
    { label: 'Over ons', href: '/over' },
    { label: 'Diensten', href: '/diensten', chevron: true },
    { label: 'Werkwijze', href: '/werkwijze' },
    { label: 'Contact', href: '/contact' },
  ],

  hero: {
    regels: ['Uw bouw- of renovatieproject,', 'perfect geregeld'],
    sub: 'Van een enkele ingreep tot een complete totaalrenovatie. Wij nemen de uitvoering en de coördinatie volledig uit handen, zodat u zonder zorgen kunt uitkijken naar het eindresultaat.',
    knop: 'Vraag een plaatsbezoek aan',
    bel: 'Of bel direct:',
    /* 1 okt 2026, Mohammed: "de foto roll graag dezelfde als op totaalrenovatie lp".
       Dezelfde drie foto's, uit de LP zelf, zodat ze niet uit elkaar lopen. */
    dias: RENO_LP.hero.dias,
    foto: homeHero,
    alt: 'Woning met vernieuwde gevel in steenstrips en een nieuw pannendak, door AB Bouw Groep',
  },

  over: {
    kop: ['Alle vakmensen', 'onder één dak'],
    tekst: 'Een geslaagde verbouwing vraagt om overzicht. Of uw plannen nu al concreet zijn of nog volop in de ontwerpfase zitten, wij denken graag met u mee.'
      + '\n\n' + 'U kunt ons inschakelen voor één specifieke opdracht — zoals een nieuw dak, een badkamerrenovatie of het plaatsen van een warmtepomp — maar evengoed voor het volledige plaatje. Omdat wij alle disciplines (ruwbouw, dakwerken, gevelbekleding, interieur, sanitair en ecologie) in huis hebben, sluiten de werkzaamheden naadloos op elkaar aan. Geen wachttijden tussen verschillende aannemers, maar één vlotte planning en één vast aanspreekpunt.',
    slot: '',
    foto: homeOver,
    alt: 'Open woonkeuken met lichtkoepel, lichte vloer en een glazen deur naar de tuin, door AB Bouw Groep',
  },

  /* De zes divisies, niet de onderdelen van een enkele renovatie: op de
     homepage moet een bezoeker zien welk vak hij nodig heeft en daarheen
     kunnen doorklikken. */
  diensten: {
    ...TOTAALRENOVATIE.diensten,
    kop: ['Onze diensten'],
    kaarten: [
      { titel: 'Dakwerken', href: '/dakwerken', foto: svcDak,
        tekst: 'Pannen, leien en platte daken in EPDM.',
        alt: 'Dakwerken door AB Bouw Groep' },
      { titel: 'Gevelrenovatie', href: '/gevel', foto: svcGevel,
        tekst: 'Crepi, steenstrips en houten bekleding.',
        alt: 'Gevelrenovatie door AB Bouw Groep' },
      { titel: 'Badkamer en wellness', href: '/bad', foto: svcBad,
        tekst: 'Van inloopdouche tot volledige badkamer.',
        alt: 'Badkamerrenovatie door AB Bouw Groep' },
      { titel: 'Interieurwerken', href: '/interieur', foto: svcInterieur,
        tekst: 'Maatkasten, keukens en gietvloeren.',
        alt: 'Interieurwerken door AB Bouw Groep' },
      { titel: 'Totaalrenovatie en nieuwbouw', href: '/construct', foto: svcConstruct,
        tekst: 'Ruwbouw, uitbreiding of volledige renovatie.',
        alt: 'Totaalrenovatie door AB Bouw Groep' },
      { titel: 'Ecologisch bouwen', href: '/ecologisch', foto: svcEco,
        tekst: 'Isolatie, warmtepomp en zonnepanelen.',
        alt: 'Energiewerken door AB Bouw Groep' },
    ],
  },

  /**
   * De homepage deelt het fotospoor met de landingspagina, maar niet de
   * voor-na-schuif. Daar toont de landingspagina het dak, en op de homepage
   * de aanbouw. Het dakbeeld staat daarom hier in het spoor en niet in het
   * gedeelde blok: op de landingspagina zou het naast de schuif een dubbel
   * van hetzelfde dak zijn.
   */
  werk: {
    ...TOTAALRENOVATIE.werk,
    /* 1 okt 2026, Mohammed: "al het uitgevoerd werk van totaalrenovatie lp + de
       dakwerk foto afgewerkt". De zeventien eigen foto's van de LP, met de
       afgewerkte dakfoto van de dak-LP (de na-foto van de voor/na) op plek drie,
       zodat het dak vroeg in beeld komt. */
    fotos: [
      ...RENO_LP.uitgevoerd!.fotos.slice(0, 2),
      { src: dakAfgewerkt, alt: 'Vernieuwd pannendak met nieuwe pannen en dakvensters, door AB Bouw Groep' },
      ...RENO_LP.uitgevoerd!.fotos.slice(2),
    ],
    schuif: {
      voor: uitbreidingVoor, na: uitbreidingNa,
      altVoor: 'De aanbouw in ruwbouw: snelbouwstenen en de houten balken van het platte dak',
      altNa: 'Dezelfde aanbouw afgewerkt, met witte crepi en een schuifraam over de volle breedte',
      labelLinks: 'Ruwbouw', labelRechts: 'Afgewerkt',
    },
  },

  werkwijze: {
    ...TOTAALRENOVATIE.werkwijze,
    kop: ['Van het eerste gesprek', 'tot de laatste afwerking'],
    /* Zijn twee alinea's, in dezelfde volgorde over de vijf bolletjes verdeeld.
       De titels zijn korte woorden uit zijn eigen zinnen. */
    stappen: [
      { titel: 'Eerste gesprek', Icoon: IcStapBel,
        tekst: 'Alles begint met een goed beeld van de situatie.' },
      { titel: 'Plaatsbezoek', Icoon: IcStapBezoek,
        tekst: 'Daarom komen we altijd eerst vrijblijvend ter plaatse kijken. We luisteren naar uw wensen, bekijken de ruimte en geven direct aan wat de mogelijkheden zijn.' },
      { titel: 'Offerte', Icoon: IcStapMeten,
        tekst: 'Daarna ontvangt u een heldere offerte waarin alle kosten duidelijk staan omschreven.' },
      { titel: 'De werken', Icoon: IcStapWerf,
        tekst: 'Zodra de werken van start gaan, kunt u rekenen op onze vaste ploegen. We hechten veel belang aan een nette werkomgeving: we schermen andere ruimtes af tegen stof en laten de werf elke dag opgeruimd achter.' },
      { titel: 'Oplevering', Icoon: IcStapOplevering,
        tekst: 'Bij de oplevering overlopen we samen de volledige woning. Pas wanneer u helemaal tevreden bent en de laatste details in orde zijn, sluiten we het project af.' },
    ],
  },

  /* 5 okt 2026, Mohammed: "en bij zekerheden op home page ook ... bolletjes".
     Dezelfde vorm als de werkwijze, zonder stapnummer: deze punten hebben geen
     volgorde. Elke zin komt uit zijn eigen tekst (homepage en Over ons). */
  aanbod: {
    ...TOTAALRENOVATIE.aanbod,
    kop: 'Bouwen op zekerheid',
    lede: 'Als erkend aannemer zorgen we niet alleen voor een goede uitvoering, maar ook voor een sluitende administratie.',
    bolletjes: [
      { titel: 'VCA-gecertificeerd', Icoon: IcZekerVca,
        tekst: 'Veilig werken staat voorop, gecontroleerd en gecertificeerd.' },
      { titel: 'Tienjarige aansprakelijkheid', Icoon: IcZekerWoning,
        tekst: 'Wettelijke garantie op stabiliteit en waterdichtheid.' },
      { titel: '6% btw-tarief', Icoon: IcZekerBtw,
        tekst: 'Waar mogelijk passen we direct het voordelige 6% btw-tarief toe.' },
      { titel: 'Attesten voor uw premies', Icoon: IcZekerAttest,
        tekst: 'We bezorgen u alle nodige attesten om uw premies vlot aan te kunnen vragen.' },
    ],
  },

  eind: {
    ...TOTAALRENOVATIE.eind,
    kop: ['Plannen voor uw woning?', 'Laat uw nummer achter'],
    tekst: 'Wij bellen u terug om een plaatsbezoek in te plannen. Dat bezoek en de offerte erna zijn kosteloos.',
  },

  faq: {
    kop: ['Veelgestelde vragen'],
    vragen: [
      { v: 'Werken jullie overal in Vlaanderen?',
        a: 'Ja, wij zijn actief in heel Vlaanderen en in het Brussels Gewest. Een afspraak voor een plaatsbezoek plannen we in wanneer het u het beste uitkomt.' },
      { v: 'Zijn er kosten verbonden aan de offerte?',
        a: 'Nee, het plaatsbezoek en de offerte die we daarna opmaken, zijn altijd volledig kosteloos en vrijblijvend.' },
      { v: 'Moet het altijd om een grote renovatie gaan?',
        a: 'Zeker niet. We voeren evengoed kleinere, losse werken uit, zoals het vernieuwen van een gevel of het plaatsen van isolatie.' },
      { v: 'Helpen jullie met de Mijn VerbouwPremie?',
        a: 'We adviseren u graag over de actuele normen en zorgen ervoor dat u de juiste technische fiches en facturen heeft om uw aanvraag in te dienen.' },
    ],
  },

};
