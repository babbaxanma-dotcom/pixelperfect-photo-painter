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
import aanbod1 from '@/assets/lp-diensten/totaalrenovatie-steps.jpg';
import aanbod2 from '@/assets/lp-diensten/terras-g1.jpg';
import aanbod3 from '@/assets/lp-diensten/pleisterwerk-g2.jpg';
import aanbod4 from '@/assets/lp-diensten/oprit-g2.jpg';
import contactFoto from '@/assets/lp-diensten/totaalrenovatie-what.jpg';
import eindFoto from '@/assets/lp-diensten/tegelwerken-hero.jpg';
import cirkelFoto from '@/assets/lp-diensten/badkamer-hero.jpg';

import bkHero from '@/assets/lp-diensten/tegelwerken-g1.jpg';
import bkOver from '@/assets/lp-diensten/badkamer-g2.jpg';
import bkDienstenBg from '@/assets/lp-diensten/tegelwerken-what.jpg';
import bkKaartSanitair from '@/assets/lp-diensten/badkamer-g3.jpg';
import bkContact from '@/assets/lp-diensten/badkamer-hero.jpg';
import bkCirkel from '@/assets/lp-diensten/badkamer-services.jpg';
import bkAanbod1 from '@/assets/lp-diensten/badkamer-what.jpg';
import bkAanbod2 from '@/assets/lp-diensten/badkamer-g1.jpg';
import bkAanbod3 from '@/assets/lp-diensten/badkamer-steps.jpg';
import bkAanbod4 from '@/assets/lp-diensten/tegelwerken-g2.jpg';
import bkTegelwand from '@/assets/lp-diensten/tegelkaart-grootformaat.jpg';

export type Werkfoto = { naam: string; alt: string; pos?: string };

export type PaginaInhoud = {
  /** Titel in het browsertabblad. */
  titel: string;
  /** Sleutel in DIENSTEN: levert de reviews en de keuzelijst "soort werk". */
  dienst: 'totaalrenovatie' | 'badkamerrenovatie';
  /** Divisie waaronder de lead in het CRM terechtkomt. */
  divisie: 'ab_construct' | 'ab_bad__wellness';
  /** Voorvoegsel van bron_lead; er komt ':contact' of ':balk' achter. */
  bronPrefix: string;
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
  titel: 'Totaalrenovatie in heel Vlaanderen — AB Bouw Groep',
  dienst: 'totaalrenovatie',
  divisie: 'ab_construct',
  bronPrefix: 'lp:totaalrenovatie',
  footer: 'AB Bouw Groep is aannemer voor totaalrenovatie in heel Vlaanderen. Van ruwbouw tot afwerking.',
  toonMerken: true,
  hero: {
    regels: ['Uw partner voor', 'totaalrenovatie', 'van A tot Z'],
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
      { naam: 'badkamer-p4-a', alt: 'Badkamer met marmerlook-tegels en zwevend meubel, door AB Bouw Groep' },
      { naam: 'totaalrenovatie-p5-a', alt: 'Open keuken met eethoek na totaalrenovatie, door AB Bouw Groep' },
      { naam: 'badkamer-p3-b', alt: 'Badkamer in antraciet met zwevend wastafelmeubel, door AB Bouw Groep' },
      { naam: 'terras-p3-c', alt: 'Aangelegd terras met grijze tegels tegen de gevel, door AB Bouw Groep' },
      { naam: 'tegelwerken-p2-a', alt: 'Gelegde tegelvloer met doorlopende plint, door AB Bouw Groep' },
      { naam: 'badkamer-p4-b', alt: 'Badkamer met microcement wanden, bad en toilet, door AB Bouw Groep' },
      { naam: 'totaalrenovatie-p6-a', alt: 'Keukeneiland met barkrukken na renovatie, door AB Bouw Groep' },
      { naam: 'badkamer-p1-a', alt: 'Badkamer met inloopdouche in betonlook, door AB Bouw Groep' },
      { naam: 'terras-p4-b', alt: 'Terrasaanleg met lijngoot en nivelleerclips rond een vijver, door AB Bouw Groep' },
      { naam: 'tegelwerken-p1-a', alt: 'Grijze vloertegels in een gerenoveerde ruimte, door AB Bouw Groep' },
      { naam: 'badkamer-p3-a', alt: 'Donkere badkamer met inloopdouche en lavabomeubel, door AB Bouw Groep' },
      /* Het interessante van dit beeld — de glaspui en de straat — zit rechts;
         bij een midden-crop blijft er kale muur over. Vandaar de eigen uitsnede. */
      { naam: 'totaalrenovatie-p6-b', alt: 'Afgewerkte handelsruimte met glaspui en tegelvloer, door AB Bouw Groep', pos: '72% center' },
      { naam: 'badkamer-p1-c', alt: 'Inloopdouche met glazen wand, door AB Bouw Groep' },
      { naam: 'terras-p3-a', alt: 'Terras in grote betontegels achter een woning, door AB Bouw Groep' },
      { naam: 'tegelwerken-p2-c', alt: 'Antracieten vloertegels in een gerenoveerde ruimte, door AB Bouw Groep' },
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
        href: '#contact', foto: aanbod2, alt: 'Terras aan een gerenoveerde woning' },
      { badge: ['Eigen', 'ploeg'], titel: 'Eigen ploeg op de werf',
        tekst: 'Dezelfde mensen, elke dag.', knop: 'Gratis offerte',
        href: '#contact', foto: aanbod3, alt: 'Gepleisterde ruimte tijdens de afwerking' },
      { badge: ['VCA', 'attest'], titel: 'VCA-gecertificeerd en verzekerd',
        tekst: 'Attest en polis op aanvraag.', knop: 'Gratis offerte',
        href: '#contact', foto: aanbod4, alt: 'Nieuwe oprit in klinkers' },
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
  titel: 'Badkamerrenovatie in heel Vlaanderen — AB Bouw Groep',
  dienst: 'badkamerrenovatie',
  divisie: 'ab_bad__wellness',
  bronPrefix: 'lp:badkamerrenovatie',
  footer: 'AB Bouw Groep vernieuwt badkamers in heel Vlaanderen. Leidingen, tegels en sanitair door dezelfde ploeg.',
  toonMerken: false,
  hero: {
    /* De kop noemt wat de klant thuis ziet staan als de ploeg weg is. Geen
       belofte over tien jaar: die is onzichtbaar én niet hard te maken. */
    regels: ['Een badkamer', 'die strak ligt', 'en goed wegloopt'],
    knop: 'Plan gratis plaatsbezoek',
    foto: bkHero,
    alt: 'Badkamer met eiken meubel, opzetkom en zwart omkaderde douchewand, door AB Bouw Groep',
  },
  over: {
    kop: ['Eén vaste ploeg voor uw', 'hele badkamer'],
    tekst: 'Het meeste geld en de meeste tijd zitten achter de muur: leidingen verleggen, lagen laten drogen voordat er getegeld kan worden. Daarom meten wij eerst ter plaatse op en zetten we de prijs per onderdeel op papier, voordat er iets uitgebroken wordt.',
    slot: 'De badkamer valt onder AB Bad & Wellness; loopt het werk verder dan die ene kamer, dan schuiven de collega’s van interieur of dak mee aan.',
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
        foto: kaartRuwbouw, alt: 'Uitgebroken muuropening tijdens de ruwbouwfase van een renovatie' },
      { titel: 'Nieuwe leidingen', href: '#contact',
        tekst: 'Water, afvoer en elektriciteit gaan de open muur in. De helling van de afvoer bepaalt of uw douche straks wegloopt.',
        foto: kaartTechnieken, alt: 'Nieuwe water- en afvoerleidingen in een opengelegde muur' },
      { titel: 'Waterdicht maken', href: '#contact',
        tekst: 'Op de vlakke ondergrond komt de laag die het water tegenhoudt. Gaat daar iets fout, dan ziet u dat pas jaren later.',
        foto: kaartTegel, alt: 'Vlakke, voorbereide vloer met grootformaat tegels' },
      { titel: 'Tegelwerk', href: '#contact',
        tekst: 'De tegelzetter begint bij de rij die u vanuit de deur ziet, zodat de gesneden stukken in de hoek uitkomen.',
        foto: bkTegelwand, alt: 'Grootformaat wandtegels, strak in lijn gezet' },
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
      { badge: ['Vaste', 'prijs'], titel: 'Vaste prijs na het plaatsbezoek',
        tekst: 'Wat op de offerte staat, betaalt u.', knop: 'Gratis offerte',
        href: '#contact', foto: bkAanbod3, alt: 'Badkamer met dubbele lavabo, bad en inloopdouche' },
      { badge: ['2-3', 'weken'], titel: 'Twee tot drie weken werk',
        tekst: 'Van uitbreken tot de laatste voeg.', knop: 'Gratis offerte',
        href: '#contact', foto: bkAanbod4, alt: 'Tegelvloer in visgraatmotief, gelegd door AB Bouw Groep' },
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
