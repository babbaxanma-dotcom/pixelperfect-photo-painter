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
import homeOver from '@/assets/lp-diensten/realisaties/totaalrenovatie-p6-a.jpg';
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

export type Werkfoto = { naam: string; alt: string; pos?: string };

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
    foto: string;
    alt: string;
    /** Waar de telefoonuitsnede op inzoomt; leeg laat de standaard staan. */
    focus?: string;
  };
  over: { kop: string[]; tekst: string; slot: string; foto: string; alt: string };
  diensten: { kop: string[]; achtergrond: string; kaarten: Dienstkaart[] };
  werkwijze: { kop: string[]; stappen: Stapgegevens[] };
  werk: {
    kop: string;
    fotos: Werkfoto[];
    schuif?: { voor: string; na: string; altVoor: string; altNa: string; labelLinks: string; labelRechts: string };
  };
  aanbod: { kop: string; kaarten: Aanbodkaart[] };
  contact: { kop: string; foto: string; alt: string };
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
        tekst: 'Meestal binnen vijf werkdagen staat er iemand bij u thuis. We bekijken de ruimte samen met u, luisteren naar wat u voor ogen hebt en zeggen meteen wat haalbaar is.' },
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
      { badge: ['5', 'werkdagen'], titel: 'Plaatsbezoek binnen vijf werkdagen',
        tekst: "Opmeten, foto's van de opbouw, knelpunten.", knop: 'Gratis offerte',
        href: '#contact', foto: plaatsbezoekFoto, alt: 'Woning in uitvoering: vloerverwarming gelegd, klaar voor de chape' },
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
    /* Een why-us, geen uitleg over badkamers. De kop stelt de vraag die de
       bezoeker op dit punt heeft, en de tekst antwoordt met wat AB anders doet
       dan een reeks losse vaklui: hetzelfde ploeg legt de leidingen en zet de
       tegels. Dat is een feit over de werkwijze, geen belofte over het
       resultaat. */
    kop: ['Waarom kiezen voor', 'AB Bouw Groep'],
    tekst: 'Sanitair, elektriciteit, waterdichting en tegelwerk zitten bij ons in één ploeg. Dezelfde mensen die de leidingen leggen, zetten ook de tegels, dus de volgorde en de droogtijden liggen in één hand. U hebt één aanspreekpunt van het uitbreken tot de laatste voeg.',
    slot: 'De startdatum krijgt u op papier. In de offerte staat elke post apart: afbraak, materiaal, uitvoering en afvoer.',
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
        tekst: 'Meestal binnen vijf werkdagen staat er iemand bij u thuis. Hij meet de ruimte op, bekijkt waar de afvoer ligt en luistert naar wat u voor ogen hebt.' },
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
        href: '#contact', foto: bkAanbod3, alt: 'Badkamer met dubbele lavabo, bad en inloopdouche' },
      { badge: ['Vaste', 'prijs'], titel: 'Vaste prijs na het plaatsbezoek',
        tekst: 'Wat op de offerte staat, betaalt u.', knop: 'Gratis offerte',
        href: '#contact', foto: bkWerf, alt: 'Badkamer halverwege de renovatie: wanden deels betegeld, leidingen aangesloten' },
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
  /* De gerenoveerde keuken uit het uitgevoerde werk van de landingspagina. */
  contact: {
    kop: 'Vraag een plaatsbezoek',
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
  reviews: [
    { text: 'Isolatie, dak en ramen in één keer aangepakt. Veel warmer nu, en zij regelden het hele papierwerk. Echt ontzorgd.', name: 'Nathalie Aerts', role: 'Energetische renovatie · Bonheiden' },
    { text: 'Vier weken stof, en dan een prachtige badkamer. Inloopdouche, zwevend meubel, vloerverwarming. De tegelzetter heeft hier echt zijn handtekening gezet.', name: 'Inge Vermeiren', role: 'Badkamer en toilet · Kontich' },
    { text: 'Ik dacht aan een nieuw dak, maar na hun bezoek bleek herstellen genoeg. Ze hadden me makkelijk meer kunnen aansmeren. Dat noem ik eerlijk werken.', name: 'Dirk Maes', role: 'Plat dak · Antwerpen' },
    { text: 'Witte crepi op buitenisolatie. Onze stookkost is bijna gehalveerd deze winter. Net en proper gewerkt.', name: 'Hilde Goossens', role: 'Gevelisolatie · Boom' },
  ],
  toonCalculator: false,
  toonDiensten: false,
  footer: '',

  nav: [
    { label: 'Over ons', href: '/over' },
    { label: 'Diensten', href: '/diensten', chevron: true },
    { label: 'Werkwijze', href: '/werkwijze' },
    { label: 'Contact', href: '/contact' },
  ],

  hero: {
    regels: ['De oplossing voor uw', 'bouwwerkzaamheden', 'en renovatie'],
    knop: 'Vraag een plaatsbezoek aan',
    foto: homeHero,
    alt: 'Woning met vernieuwde gevel in steenstrips en een nieuw pannendak, door AB Bouw Groep',
  },

  over: {
    kop: ['Waarom kiezen voor', 'AB Bouw Groep'],
    tekst: 'Of uw plannen nu vastliggen of nog moeten groeien: wij begeleiden u van het eerste gesprek tot de oplevering. U schakelt één afdeling in of ze allemaal. Wij coördineren alle bouwactiviteiten die nodig zijn voor de realisatie van uw bouwwerk.',
    slot: '',
    foto: homeOver,
    alt: 'Leefruimte met open keuken en glazen pui na een totaalrenovatie door AB Bouw Groep',
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
    fotos: [
      ...TOTAALRENOVATIE.werk.fotos.slice(0, 2),
      { naam: 'dak-rood-drone', alt: 'Vernieuwd pannendak in rode keramische pannen met dakvensters, door AB Bouw Groep' },
      /* De keuken staat op deze pagina al bij "Waarom kiezen voor". Twee keer
         hetzelfde beeld op een pagina leest slordig, dus hier eruit. */
      ...TOTAALRENOVATIE.werk.fotos.slice(2).filter((f) => f.naam !== 'totaalrenovatie-p6-a'),
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
    kop: ['Van eerste telefoon', 'tot oplevering'],
  },

  eind: {
    ...TOTAALRENOVATIE.eind,
    kop: ['Plannen voor uw woning?', 'Laat uw nummer achter'],
    tekst: 'Wij bellen u terug om een plaatsbezoek in te plannen. Dat bezoek en de offerte erna zijn kosteloos.',
  },

  faq: {
    kop: ['Wat klanten ons', 'het vaakst vragen'],
    vragen: [
      { v: 'Werken jullie in heel Vlaanderen?',
        a: 'Ja. We werken in heel Vlaanderen en in Brussel. Voor een plaatsbezoek maken we een afspraak die past, ook in de vooravond.' },
      { v: 'Wat kost een plaatsbezoek en een offerte?',
        a: 'Niets. We komen langs, meten op en bezorgen u een gedetailleerde offerte. Daar zijn geen kosten aan verbonden en u bent tot niets verplicht.' },
      { v: 'Kan ik een enkel werk laten doen, of moet het een volledige renovatie zijn?',
        a: 'Beide kan. Alleen een dak of alleen een badkamer is prima. Loopt uw project over meerdere vakken, dan coordineren wij die onderling.' },
      { v: 'Hoe zit het met premies?',
        a: 'We bekijken bij het plaatsbezoek welke premies op uw situatie van toepassing zijn en leveren de attesten aan die u nodig heeft. De premievoorwaarden wijzigen geregeld, dus we toetsen ze per dossier opnieuw.' },
      { v: 'Hoe lang op voorhand moet ik boeken?',
        a: 'Dat hangt af van het vak en het seizoen. Bij het plaatsbezoek zeggen we meteen welke startperiode realistisch is, en die zetten we in de offerte.' },
    ],
  },

};
