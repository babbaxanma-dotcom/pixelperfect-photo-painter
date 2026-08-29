/**
 * Landingspagina totaalrenovatie — replica van de referentie in Downloads.
 *
 * De opzet, de maten en de plaatsing komen uit een pixelmeting van die
 * referentie (1200x8408). De inhoud, de kleuren en de foto's zijn van AB Bouw.
 * Waar de referentie iets Amerikaans toont (financieringsdeals, Angi-awards,
 * dollarbedragen) houdt de replica de VORM en vervangt hij de INHOUD door het
 * Vlaamse equivalent; die keuzes staan per plek in commentaar.
 *
 * Deze pagina staat naast LpDienst.tsx en raakt de andere dertien pagina's niet.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTACT } from '@/data/contact';
import { submitLead } from '@/lib/leads';
import Calculator from './Calculator';
import { trackFormStart } from '@/lib/tracking';
import { DIENSTEN } from '../LpDienst';
import { REPLICA_CSS } from './stijl';
import {
  IcBericht, IcChevron, IcGoogle, IcFacebook, IcLinkedIn, IcMail, IcPersoon, IcPijl,
  IcPin, IcSter, IcTelefoon, IcX, IcYouTube, IcZonnestraal,
  IcBoog, IcStapBel, IcStapBezoek, IcStapMeten, IcStapOplevering, IcStapWerf,
} from './Iconen';

import logo from '@/assets/home/logo-trim.png';
import heroFoto from '@/assets/lp-diensten/totaalrenovatie-hero.jpg';
import overFoto from '@/assets/lp-diensten/totaalrenovatie-g1.jpg';
import glyph1 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p1-a.jpg';
import glyph2 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p1-b.jpg';
import glyph3 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p2-a.jpg';
import glyph4 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p2-b.jpg';
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
import merkWienerberger from '@/assets/merken/Wienerberger-donker.png';
import merkKoramic from '@/assets/merken/Koramic-donker.png';
import merkVelux from '@/assets/merken/Velux-donker.png';
import merkRockpanel from '@/assets/merken/rockpanel-donker.png';

/**
 * De merken waarmee AB werkt. Alleen logo's die in de repo staan én al elders
 * op de site gebruikt worden (LpDienst, LpDakwerken): dat zijn geverifieerde
 * leveranciers, geen namen die ik erbij zet.
 *
 * De vier uit src/assets/merken staan als -donker-variant in de lijst: de
 * bestanden zonder achtervoegsel zijn wit (gemeten helderheid 255) en dus voor
 * een donkere ondergrond; deze rail staat op wit.
 */
const MERKEN = [
  { src: merkWienerberger, alt: 'Wienerberger' },
  { src: merkKoramic, alt: 'Koramic' },
  { src: merkRockpanel, alt: 'Rockpanel' },
  { src: merkVelux, alt: 'Velux' },
  { src: '/assets/logos/knauf.png', alt: 'Knauf' },
  { src: '/assets/logos/isover.png', alt: 'Isover' },
  { src: '/assets/logos/eternit.png', alt: 'Eternit' },
  { src: '/assets/logos/caparol.png', alt: 'Caparol' },
  { src: '/assets/logos/dorken.png', alt: 'Dörken' },
  { src: '/assets/logos/isoproc.png', alt: 'Isoproc' },
  { src: '/assets/logos/mato.png', alt: 'Mato' },
  { src: '/assets/logos/rectic.png', alt: 'Recticel' },
];

/** Elke glyph van "120+" krijgt een eigen foto, net als de drie in de referentie. */
const GETAL_GLYPHS = [
  { teken: '1', foto: glyph1 }, { teken: '2', foto: glyph2 },
  { teken: '0', foto: glyph3 }, { teken: '+', foto: glyph4 },
];
/** De zes divisies van AB Bouw Groep. */
const DIVISIES = ['AB Construct', 'AB Dakwerken', 'AB Gevelbekleding',
  'AB Interieurwerken', 'AB Bad & Wellness', 'AB Ecologisch'];

/**
 * De reviews komen uit LpDienst.tsx, waar ze al voor de live site staan.
 * Hier geen nieuwe schrijven: klantbeoordelingen verzinnen mag niet, en twee
 * verschillende versies van dezelfde review op één site is ook fout.
 */
const REVIEWS = DIENSTEN.totaalrenovatie.reviews;

/** De opties uit de keuzelijst, gelijk aan die van de bestaande LP. */
const SOORT_WERK = DIENSTEN.totaalrenovatie.typeWerkOpties;

type Dienstkaart = { titel: string; tekst: string; foto: string; alt: string; href: string };

/**
 * De vijf kaarten: de ONDERDELEN van één totaalrenovatie, in de volgorde
 * waarin ze op de werf gebeuren — strippen, technieken, pleisteren, tegelen,
 * afwerken. Geen dienstenmenu: "Totaalrenovatie" naast "Badkamer" en "Oprit"
 * zetten leest als vijf losse opdrachten en spreekt de hele pagina tegen.
 *
 * De referentie laat drie van de vijf kaarten op dezelfde formule draaien
 * ("laat je X weg, dan gaat Y mis"). Die vorm staat hier nog maar op één kaart.
 */
const DIENSTKAARTEN: Dienstkaart[] = [
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
];

type Aanbodkaart = { badge: [string, string]; titel: string; tekst: string; foto: string; alt: string; knop: string; href: string };

/**
 * De aanbodkaarten. De referentie toont hier Amerikaanse financieringsdeals
 * ("$0 Payment", "$45/Month"): een aanbod dat AB niet doet en dat hier dus een
 * verzonnen belofte zou zijn. De VORM blijft — sticker met twee regels, titel,
 * subtitel, één gevulde en drie omlijnde knoppen — en de INHOUD wordt wat er
 * bij een Vlaamse renovatie echt vastligt.
 */
const AANBOD: Aanbodkaart[] = [
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
];

/**
 * De realisatiefoto's, per dienst opgehaald uit de map zelf.
 *
 * Met een glob in plaats van 32 losse imports: zo kan er geen foto twee keer in
 * een tabblad belanden en groeit de lijst mee als er beelden bijkomen. De
 * sleutel is de bestandsnaam, bijvoorbeeld "badkamer-p1-a".
 */
const REALISATIES = import.meta.glob('../../../../assets/lp-diensten/realisaties/*.jpg', {
  eager: true, import: 'default',
}) as Record<string, string>;

const beeld = (naam: string) => {
  const treffer = Object.entries(REALISATIES).find(([pad]) => pad.endsWith(`/${naam}.jpg`));
  if (!treffer) throw new Error(`realisatiefoto ontbreekt: ${naam}.jpg`);
  return treffer[1];
};

/**
 * De foto's in het spoor: vier per soort werk, op volgorde om en om gezet.
 *
 * Waarom om en om en niet per soort gegroepeerd: er passen er vier tegelijk in
 * beeld, dus bij groeperen ziet de bezoeker in het eerste scherm alleen
 * badkamers. Zo staat er op elke scrollpositie een woning, een badkamer, een
 * tegelvloer en een terras naast elkaar, en staan twee gelijkaardige foto's
 * nooit naast elkaar.
 *
 * Alleen ECHTE werffoto's. Elke gegenereerde foto die hier stond werd herkend
 * als AI — negen pogingen over drie rondes, allemaal afgekeurd. Van bijna
 * dezelfde opname (zelfde ruimte, zelfde hoek) staat alleen de beste hier.
 */
const WERK_FOTOS: { naam: string; alt: string; pos?: string }[] = [
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
];

/**
 * De vijf stappen. De referentie zet er keukenapparaten bij (dampkap, fornuis,
 * broodrooster); hier staat bij elke stap het gereedschap dat er echt aan te
 * pas komt. De teksten noemen elk iets anders: staan er drie keer dezelfde
 * belofte in, dan leest het als een sjabloon.
 */
const STAPPEN = [
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
];

const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Over ons', href: '#over' },
  { label: 'Diensten', href: '#diensten', chevron: true },
  { label: 'Aanpak', href: '#werkwijze' },
  { label: 'Contact', href: '#contact' },
];

/**
 * De vier socialcirkels linksboven in de referentie.
 *
 * Deze lijst is LEEG en dat is een keuze: er staat in de hele codebase geen
 * enkele geverifieerde profiel-URL van AB Bouw Groep, en een verzonnen
 * facebook.com/... zou bezoekers naar een 404 sturen. Zodra Mohammed de echte
 * adressen doorgeeft, komen ze hier en verschijnt de rij vanzelf op de plek uit
 * de referentie: eerste cirkel accentgevuld, daarna drie in #f3f4ef.
 */
const SOCIAAL_ICOON = { facebook: IcFacebook, linkedin: IcLinkedIn, youtube: IcYouTube, x: IcX };
const SOCIALS: { naam: keyof typeof SOCIAAL_ICOON; href: string }[] = [];

/** De vier velden van de balk onder de hero, in de volgorde van de referentie. */
const BALKVELDEN = [
  { naam: 'naam', plaats: 'Naam', type: 'text', icoon: IcPersoon, autoComplete: 'name' },
  { naam: 'telefoon', plaats: 'Telefoon', type: 'tel', icoon: IcTelefoon, autoComplete: 'tel' },
  { naam: 'email', plaats: 'E-mail', type: 'email', icoon: IcMail, autoComplete: 'email' },
  { naam: 'bericht', plaats: 'Bericht', type: 'text', icoon: IcBericht, autoComplete: 'off' },
] as const;

/**
 * Voor/na-schuif van één echte werf: hetzelfde dak met de pannen eraf en er weer
 * op. De bediening is een <input type="range"> over het hele beeld, zodat
 * slepen met de muis, vegen op een telefoon én de pijltjestoetsen alle drie
 * werken zonder eigen sleepcode — en een schermlezer krijgt een echte regelaar.
 */
function DakSchuif() {
  const [deel, setDeel] = useState(50);
  const vat = useRef<HTMLDivElement>(null);
  const sleept = useRef(false);

  /* Het slepen wordt hier ZELF afgehandeld met pointer-events, niet overgelaten
     aan het gedrag van de range-input. Die input is onzichtbaar (opacity 0) en
     iOS Safari levert daar niet betrouwbaar aanraakgebeurtenissen aan af — op
     de telefoon bewoog de slider daardoor niet, terwijl hij in de browser op de
     pc wel werkte. Met setPointerCapture volgt de vinger gegarandeerd, ook als
     hij buiten het beeld komt. De input blijft staan voor het toetsenbord en
     voor schermlezers. */
  const uitPositie = (klientX: number) => {
    const el = vat.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width <= 0) return;
    setDeel(Math.min(100, Math.max(0, ((klientX - r.left) / r.width) * 100)));
  };
  const pak = (e: React.PointerEvent) => {
    sleept.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    uitPositie(e.clientX);
  };
  const volg = (e: React.PointerEvent) => { if (sleept.current) uitPositie(e.clientX); };
  const los = (e: React.PointerEvent) => {
    sleept.current = false;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  return (
    <figure className="pc-vgl">
      <div className="pc-vgl-vat" ref={vat}>
        <img src={dakVoor} alt="Het dak van dezelfde woning met de pannen eraf: alleen het houten gebint staat er nog" />
        <img src={dakNa} alt="Hetzelfde dak na de werken, met nieuwe pannen en dakvensters"
          style={{ clipPath: `inset(0 0 0 ${deel}%)` }} />
        <div className="pc-vgl-sleep" onPointerDown={pak} onPointerMove={volg}
          onPointerUp={los} onPointerCancel={los} aria-hidden="true" />
        <input type="range" min={0} max={100} step={1} value={Math.round(deel)} className="pc-vgl-bedien"
          aria-label="Sleep om het dak voor en na de werken te vergelijken"
          onChange={(e) => setDeel(Number(e.target.value))} />
        <span className="pc-vgl-lijn" style={{ left: `${deel}%` }} aria-hidden="true">
          <span className="pc-vgl-greep"><IcChevron richting="links" /><IcChevron richting="rechts" /></span>
        </span>
        <span className="pc-vgl-label pc-vgl-label--l" aria-hidden="true">Dak eraf</span>
        <span className="pc-vgl-label pc-vgl-label--r" aria-hidden="true">Dak erop</span>
      </div>
    </figure>
  );
}


export default function LpReplica() {
  const navigate = useNavigate();
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const startGemeld = useRef(false);
  const reviewSpoor = useRef<HTMLDivElement>(null);
  const aanbodSpoor = useRef<HTMLDivElement>(null);
  const werkSpoor = useRef<HTMLDivElement>(null);
  const [reviewPos, setReviewPos] = useState({ links: 0, max: 1 });
  const [aanbodPos, setAanbodPos] = useState({ links: 0, max: 1 });
  const [werkPos, setWerkPos] = useState({ links: 0, max: 1 });
  /* Het fotospoor schuift zelf op. Zodra iemand er met de muis, de vinger of
     het toetsenbord aan komt, stopt dat: een spoor dat doorloopt terwijl je
     kijkt of sleept, vecht met de bezoeker. Na een aanraking wacht het zes
     seconden voor het weer verder gaat, zodat het niet onder je vinger
     wegschuift. */
  const [werkStil, setWerkStil] = useState(false);
  /* Teller die alleen omhoog gaat als er een NIEUWE foto begint. Hij is de
     sleutel van de vullijn: React hangt er een vers element aan op, dus de
     animatie start op nul. Zou de sleutel op de pauze staan, dan zou de lijn
     bij het minste hoveren terugspringen naar leeg in plaats van te bevriezen
     op de stand die hij had — precies wat de eerste keuring liet zien. */
  const [lijnRonde, setLijnRonde] = useState(0);
  const nieuweRonde = () => setLijnRonde((r) => r + 1);
  const werkIndex = useRef(0);
  const werkAnimeert = useRef(0);
  const hervatKlok = useRef<number>();
  const pauzeerWerk = (hervatNa = 0) => {
    window.clearTimeout(hervatKlok.current);
    setWerkStil(true);
    if (hervatNa > 0) hervatKlok.current = window.setTimeout(() => { setWerkStil(false); nieuweRonde(); }, hervatNa);
  };
  const hervatWerk = () => { window.clearTimeout(hervatKlok.current); setWerkStil(false); nieuweRonde(); };
  /** Hoeveel er per klik opschuift: de afstand van tegel 1 naar tegel 2, uit
      de DOM gelezen. Niet 'breedte + 25': de goot is 24px op de brede stand en
      12px op de smalle, dus die schatting liet het spoor per stap wegkruipen
      (gemeten 13px per stap op 390px, waardoor de lus na 18 stappen niet meer
      op dezelfde foto uitkwam). */
  const stapVan = (el: HTMLElement) => {
    const k = el.children;
    /* getBoundingClientRect en niet offsetLeft: op de smalle stand is een tegel
       78% breed en dus geen heel aantal pixels. offsetLeft rondt af, en die
       halve pixel per stap telde over één reeks op tot 7px scheefstand. */
    const een = k[0]?.getBoundingClientRect().left;
    const twee = k[1]?.getBoundingClientRect().left;
    if (een !== undefined && twee !== undefined && twee > een) return twee - een;
    return (el.firstElementChild?.getBoundingClientRect().width ?? 300) + 25;
  };
  /** Verzet het spoor ZONDER animatie.
      Het spoor heeft scroll-behavior: smooth in de stijl, dus een gewone
      toewijzing aan scrollLeft wordt zelf geanimeerd en meteen door de
      volgende scrollTo overschreven. Gevolg: bij een klik op "vorige" vanaf
      positie nul bleef het spoor op nul staan — precies de muur die er niet
      mocht zijn. Even op auto, springen, terugzetten. */
  const springDirect = (el: HTMLElement, naar: number) => {
    const bewaar = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = naar;
    void el.scrollLeft;
    el.style.scrollBehavior = bewaar;
  };
  /** Eén tegel verder of terug in een spoor dat rondloopt. Zowel de pijlen als
      de klok van vier seconden lopen hier doorheen, zodat er maar één versie
      van deze rekensom bestaat.
      Niet relatief stappen maar naar de EXACTE positie van een tegel springen:
      relatief optellen laat elke stap de fractie liggen die de browser van
      scrollLeft afrondt, en over achttien tegels was dat 4 tot 7px scheef —
      dan sluit de lus niet meer en verspringt het beeld. */
  const stapLus = (el: HTMLElement, richting: -1 | 1) => {
    const tegels = Array.from(el.children) as HTMLElement[];
    const helft = Math.floor(tegels.length / 2);
    if (!helft) return;
    /* offsetLeft telt vanaf de offsetParent, niet vanaf het spoor: op een breed
       scherm staat de container gecentreerd en zit er 113px marge in dat getal.
       Rechtstreeks als scrollstand gebruiken zet het spoor dus precies die
       marge scheef. Alles wordt daarom gemeten vanaf de eerste tegel. */
    const nul = tegels[0].offsetLeft;
    const stand = (i: number) => tegels[i].offsetLeft - nul;
    /* De index wordt GETELD, niet afgelezen. Onze eigen scroll is smooth, dus
       tijdens de animatie ligt scrollLeft tussen twee tegels in; wie dan
       opnieuw klikt, kiest de verkeerde "huidige" tegel en de uitlijning kruipt
       weg — gemeten 113px over één reeks. Handmatig scrollen stelt de teller
       bij via synchroniseerWerkIndex, maar niet zolang onze animatie loopt. */
    let index = Math.min(Math.max(werkIndex.current, 0), tegels.length - 1);
    /* Zelfcorrectie. Verzet iets anders dan deze functie de positie — een veeg,
       een sprong van buitenaf — dan klopt de teller niet meer met wat er staat.
       De grens is één hele tegel: tijdens onze eigen animatie is het verschil
       altijd kleiner dan dat, dus dan blijft de teller leidend; is het groter,
       dan is er echt iets anders gebeurd en wint de DOM. */
    const stapBreedte = (tegels[1]?.offsetLeft ?? 0) - (tegels[0]?.offsetLeft ?? 0);
    if (stapBreedte > 0 && Math.abs(tegels[index].offsetLeft - el.scrollLeft) > stapBreedte) {
      let dichtst = Infinity;
      tegels.forEach((t, i) => {
        const afstand = Math.abs(t.offsetLeft - el.scrollLeft);
        if (afstand < dichtst) { dichtst = afstand; index = i; }
      });
    }
    /* Staat het spoor al in de tweede reeks, zet het dan onzichtbaar terug naar
       dezelfde tegel in de eerste. Zo blijft de index begrensd en is er in geen
       van beide richtingen ooit een eind. */
    if (index >= helft) { index -= helft; springDirect(el, stand(index)); }
    let doel = index + richting;
    if (doel < 0) { index += helft; springDirect(el, stand(index)); doel = index - 1; }
    werkIndex.current = doel;
    werkAnimeert.current = Date.now() + 450;
    el.scrollTo({ left: stand(doel), behavior: 'smooth' });
  };
  const schuif = (ref: React.RefObject<HTMLDivElement>, richting: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    /* Wie zelf op een pijl klikt, neemt het over: de autoplay stopt zes
       seconden. Zonder dit vecht de tik van vier seconden met de klik en lijkt
       de pijl niets te doen — precies wat de bedieningstest aan het eind van
       het spoor betrapte. Hoveren alleen volstaat niet: een klik vanuit een
       test of een toetsenbord stuurt geen pointerenter. */
    if (ref === werkSpoor) { pauzeerWerk(6000); nieuweRonde(); }
    const stap = stapVan(el);
    if (el.dataset.lus) {
      /* Oneindig spoor: de reeks staat twee keer in de DOM, dus een sprong van
         precies één reeksbreedte laat exact hetzelfde beeld staan. Die sprong
         gebeurt ZONDER animatie vlak voor het schuiven, waarna de gewone
         beweging volgt — je ziet de omslag daardoor niet. */
      stapLus(el, richting);
      volgStand(el, setWerkPos);
      return;
    }
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const doel = Math.min(max, Math.max(0, el.scrollLeft + richting * stap));
    el.scrollTo({ left: doel, behavior: 'smooth' });
    /* Meteen zelf bijwerken: op een spoor dat al aan het eind staat vuurt er
       geen scroll-event meer, en dan bleef de knopstand hangen. */
    volgStand(el, ref === reviewSpoor ? setReviewPos : ref === werkSpoor ? setWerkPos : setAanbodPos);
  };
  const volgStand = (el: HTMLElement, zet: (p: { links: number; max: number }) => void) =>
    zet({ links: el.scrollLeft, max: Math.max(1, el.scrollWidth - el.clientWidth) });

  /* De sporen één keer opmeten zodra ze bestaan, en opnieuw bij elke maatwijziging.
     Zonder deze meting staat max op de beginwaarde 1, is "pos.links >= pos.max - 2"
     al waar en is de knop "volgende" uitgeschakeld tot je met de hand scrolt —
     dat is de pijl die "soms niet werkt". Beelden laden later, dus een
     ResizeObserver op het spoor vangt ook de breedte na het laden op. */
  useEffect(() => {
    const paren: [React.RefObject<HTMLDivElement>, (p: { links: number; max: number }) => void][] =
      [[reviewSpoor, setReviewPos], [aanbodSpoor, setAanbodPos], [werkSpoor, setWerkPos]];
    const meet = () => paren.forEach(([r, zet]) => { if (r.current) volgStand(r.current, zet); });
    meet();
    const ro = new ResizeObserver(meet);
    paren.forEach(([r]) => { if (r.current) { ro.observe(r.current); Array.from(r.current.children).forEach((k) => ro.observe(k)); } });
    window.addEventListener('resize', meet);
    const t = window.setTimeout(meet, 800);
    return () => { ro.disconnect(); window.removeEventListener('resize', meet); window.clearTimeout(t); };
  }, []);

  /* Het spoor schuift elke vier seconden één tegel op en springt aan het eind
     terug naar het begin. Vier seconden is de tijd die de vullijn eronder
     nodig heeft, zodat de bezoeker de volgende foto ziet aankomen in plaats
     van erdoor verrast te worden. Staat het tabblad op de achtergrond, dan
     stopt het: anders loopt de teller door en verspringt alles ineens bij
     terugkomst. Wie "minder beweging" heeft ingesteld, krijgt geen autoplay. */
  useEffect(() => {
    const el = werkSpoor.current;
    if (!el || werkStil) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tik = () => {
      if (document.hidden) return;
      stapLus(el, 1);
      nieuweRonde();
    };
    const id = window.setInterval(tik, 4000);
    return () => window.clearInterval(id);
  }, [werkStil]);

  useEffect(() => { document.title = 'Totaalrenovatie in heel Vlaanderen — AB Bouw Groep'; }, []);

  const meldStart = () => {
    if (startGemeld.current) return;
    startGemeld.current = true;
    trackFormStart('lp:replica:balk');
  };

  /** De uitgebreide contactvorm onderaan; dezelfde pijplijn als de balk boven. */
  const verstuurContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    const telefoon = String(f.get('telefoon') || '').trim();
    if (!email && !telefoon) { setFout('Vul een e-mailadres of een telefoonnummer in.'); return; }
    setFout(null);
    setBezig(true);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: 'ab_construct',
      firstName: String(f.get('voornaam') || '').trim() || undefined,
      lastName: String(f.get('achternaam') || '').trim() || undefined,
      email,
      phone: telefoon || undefined,
      type_werk: 'ab_construct',
      aanvullende_info: [String(f.get('soortwerk') || '').trim(), String(f.get('bericht') || '').trim()]
        .filter(Boolean).join(' — ') || undefined,
      bron_lead: 'lp:totaalrenovatie:contact',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=totaalrenovatie');
    else setFout('Versturen lukte niet. Bel gerust ' + CONTACT.phone.display + '.');
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    const telefoon = String(f.get('telefoon') || '').trim();
    if (!email && !telefoon) { setFout('Vul een e-mailadres of een telefoonnummer in.'); return; }
    setFout(null);
    setBezig(true);
    const naam = String(f.get('naam') || '').trim();
    const [voor, ...rest] = naam.split(' ').filter(Boolean);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: 'ab_construct',
      firstName: voor || undefined,
      lastName: rest.join(' ') || undefined,
      email,
      phone: telefoon || undefined,
      type_werk: 'ab_construct',
      aanvullende_info: String(f.get('bericht') || '').trim() || undefined,
      bron_lead: 'lp:totaalrenovatie:balk',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=totaalrenovatie');
    else setFout('Versturen lukte niet. Bel gerust ' + CONTACT.phone.display + '.');
  };

  return (
    <div className="pcx" id="top">
      <style dangerouslySetInnerHTML={{ __html: REPLICA_CSS }} />

      {/* ── Hero met de kop erover. De foto begint op y=0 en loopt onder de
           kop door; een wegvallende witte sluier maakt de kop leesbaar. ── */}
      <section className="pc-hero">
        <div className="pc-hero-vlak" />
        <div className="pc-hero-foto">
          <img src={heroFoto} alt="Woonkamer en keuken na een totaalrenovatie door AB Bouw Groep" />
        </div>
        <div className="pc-hero-sluier" />

        <header className="pc-kop">
          <div className="pc-vat pc-kop-vat">
            <div className="pc-kop-logo">
              <a href="/"><img src={logo} alt="AB Bouw Groep" /></a>
            </div>
            <div className="pc-kop-streep" />

            <div className="pc-kop-midden">
              <div className="pc-kop-rij1">
                {SOCIALS.length > 0 && (
                  <div className="pc-soc">
                    {SOCIALS.map(({ naam, href }) => {
                      const Icoon = SOCIAAL_ICOON[naam];
                      return <a key={naam} href={href} aria-label={naam} target="_blank" rel="noopener noreferrer"><Icoon /></a>;
                    })}
                  </div>
                )}
                <div className="pc-kop-contact">
                  <span><IcPin />{CONTACT.address.street}, {CONTACT.address.city}</span>
                  <span><IcMail /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
                </div>
              </div>

              <div className="pc-kop-rij2">
                <nav className="pc-nav">
                  {NAV.map((n) => (
                    <a key={n.label} href={n.href}>{n.label}{n.chevron && <IcChevron />}</a>
                  ))}
                </nav>
                <a className="pc-knop pc-knop--donker" href="#contact" style={{ marginLeft: 'auto' }}>
                  Gratis offerte<IcPijl />
                </a>
              </div>
            </div>

            <div className="pc-kop-streep" />
            <div className="pc-kop-tel">
              <span className="pc-teltegel"><IcTelefoon /></span>
              <span className="pc-telblok">
                <span className="pc-tellabel">Bel ons vandaag</span>
                <a className="pc-telnr" href={CONTACT.phone.href}>{CONTACT.phone.display}</a>
              </span>
            </div>
          </div>
        </header>

        <div className="pc-vat pc-hero-vat">
          {/* De referentie zet 'New' in de pil: een nieuwheidsclaim die voor AB
              niet klopt. De pil is eruit; de chip noemt de dienst en het
              werkgebied, zodat er informatie staat en geen kaal opschrift. */}
          <h1 className="pc-h1">Uw partner voor<br />totaalrenovatie<br />van A tot Z</h1>
          <a className="pc-knop pc-knop--accent" href="#contact">Plan gratis plaatsbezoek<IcPijl /></a>
        </div>

        <div className="pc-scroll">
          <button type="button" aria-label="Terug naar boven"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><IcChevron richting="boven" /></button>
          <button type="button" className="is-accent" aria-label="Naar de diensten"
            onClick={() => document.getElementById('diensten')?.scrollIntoView({ behavior: 'smooth' })}>
            <IcChevron richting="onder" />
          </button>
        </div>
      </section>

      {/* ── Formulierbalk die over de onderrand van de hero valt ── */}
      <div className="pc-vat pc-balk">
        <form onSubmit={verstuur} onFocusCapture={meldStart}>
          {BALKVELDEN.map((v) => {
            const Icoon = v.icoon;
            return (
              <label key={v.naam} className="pc-veld">
                <Icoon />
                <input name={v.naam} type={v.type} placeholder={v.plaats}
                  autoComplete={v.autoComplete} aria-label={v.plaats} />
              </label>
            );
          })}
          <button className="pc-knop pc-knop--accent" type="submit" disabled={bezig}>
            {bezig ? 'Bezig…' : 'Verstuur'}<IcPijl />
          </button>
        </form>
        {fout && <p className="pc-balk-fout">{fout}</p>}
      </div>

      {/* ── Richtprijs-calculator, direct onder de balk ── */}
      <div className="pc-vat pc-calc-vat"><Calculator /></div>

      {/* ── Over ons ── */}
      <section className="pc-over" id="over">
        <div className="pc-vat pc-over-grid">
          <div>
            <h2 className="pc-h2">Eén vaste ploeg voor uw<br />hele renovatie</h2>
            <a className="pc-knop pc-knop--accent pc-over-knop" href={CONTACT.phone.href}>
              Bel {CONTACT.phone.display}<IcPijl />
            </a>
          </div>

          <div>
            <div className="pc-getal">
              {GETAL_GLYPHS.map(({ teken, foto }, i) => (
                <span key={i} style={{ backgroundImage: `url(${foto})` }}>{teken}</span>
              ))}
            </div>
            <p className="pc-getal-label">Realisaties</p>
          </div>

          <div className="pc-rij2 pc-over-foto">
            <img src={overFoto} alt="Afgewerkte leefruimte na een totaalrenovatie door AB Bouw Groep" loading="lazy" />
            <div className="pc-score">
              <div className="pc-score-sterren">
                {[0, 1, 2, 3, 4].map((i) => <IcSter key={i} />)}
              </div>
              <div className="pc-score-cijfer">4,9</div>
              <div className="pc-score-bij">Google-score</div>
            </div>
          </div>

          <div className="pc-rij2 pc-over-tekst">
            <p>
              Geen enkele renovatie loopt precies zoals op papier. Achter een muur zit een leiding
              die niemand verwachtte, een vloer blijkt niet vlak, een deur sluit niet meer. Wie daar
              vooraf ruimte voor laat, houdt de planning overeind.
            </p>
            {/* De zes divisies stonden in één doorlopende zin. Als lijst is in
                één oogopslag te zien wat er onder één dak zit. */}
            <ul className="pc-divisies">
              {DIVISIES.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <p className="pc-over-slot">
              Bij een totaalrenovatie werken die zes op dezelfde werf, volgens dezelfde planning.
            </p>
          </div>
        </div>
      </section>

      {/* ── Diensten: donkere sectie met vijf getrapte fotokaarten ── */}
      <section className="pc-diensten" id="diensten">
        <div className="pc-diensten-bg">
          <img src={dienstenBg} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="pc-vat">
          <div className="pc-midden">
            <h2 className="pc-h2--donker">Wat er in een<br />totaalrenovatie zit</h2>
          </div>

          <div className="pc-kaarten">
            <div className="pc-kaarten-kolom">
              <Kaart {...DIENSTKAARTEN[0]} hoogte={226} />
              <Kaart {...DIENSTKAARTEN[1]} hoogte={335} />
            </div>
            <div className="pc-kaarten-kolom">
              <Kaart {...DIENSTKAARTEN[2]} hoogte={585} gevuld />
            </div>
            <div className="pc-kaarten-kolom">
              <Kaart {...DIENSTKAARTEN[3]} hoogte={334} />
              <Kaart {...DIENSTKAARTEN[4]} hoogte={227} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Aanbod: kaartenspoor dat rechts uit beeld loopt ── */}
      {/* ── Marquee-band. De referentie herhaalt hier een telefoonoproep;
           het spoor staat twee keer in de DOM zodat de lus naadloos is. ── */}
      <div className="pc-marquee" aria-hidden="true">
        <div className="pc-marquee-spoor">
          {[0, 1].map((lus) => (
            <div key={lus} style={{ display: 'flex' }}>
              {[0, 1, 2, 3].map((i) => (
                <div className="pc-marquee-eenheid" key={i}>
                  <IcTelefoon />
                  <span>Bel ons vandaag — {CONTACT.phone.spaced}</span>
                  <span className="pc-marquee-punt" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Werkwijze: vijf stappen in 3 + 2 ── */}
      <section className="pc-werkwijze" id="werkwijze">
        <div className="pc-vat pc-midden">
          <h2 className="pc-h2--midden">Wat er gebeurt nadat<br />u een aanvraag indient</h2>
        </div>
        <div className="pc-stappen">
          {/* De bogen staan absoluut: hun plek komt uit de gemeten
              tussenruimtes tussen de cirkels, niet uit de rasterstroom. */}
          <span className="pc-boog" style={{ left: 249, top: 12 }}><IcBoog /></span>
          <span className="pc-boog" style={{ left: 601, top: 11 }}><IcBoog bol /></span>
          <span className="pc-boog" style={{ left: 430, top: 227 }}><IcBoog /></span>
          <div className="pc-stappen-rij">
            {STAPPEN.slice(0, 3).map((s, i) => <Stap key={s.titel} {...s} nr={i + 1} actief={i === 1} />)}
          </div>
          <div className="pc-stappen-rij pc-stappen-rij--twee">
            {STAPPEN.slice(3).map((s, i) => <Stap key={s.titel} {...s} nr={i + 4} />)}
          </div>
        </div>
      </section>

      {/* ── Realisaties: één spoor met alle werffoto's, daaronder de dakschuif ──
          De vier tabbladen zijn weg. Een filter waar de bezoeker op moet
          klikken verbergt drie kwart van het werk achter een knop die de
          meesten niet aanraken; één spoor toont alles en scrolt zelf. Elke
          tegel is even groot en vierkant, zodat de rij als één blok leest. */}
      <section className="pc-werk">
        <div className="pc-vat pc-midden">
          <h2 className="pc-h2--midden">Uitgevoerd werk</h2>
        </div>
        <div className="pc-vat"
          onPointerEnter={() => pauzeerWerk()} onPointerLeave={hervatWerk}
          onFocusCapture={() => pauzeerWerk()} onBlurCapture={hervatWerk}
          onTouchStart={() => pauzeerWerk(6000)} onWheel={() => pauzeerWerk(6000)}>
          {/* De reeks staat er twee keer in. Zo kan het spoor bij het einde
              onzichtbaar terugspringen naar dezelfde foto in de eerste reeks:
              de bezoeker blijft met één pijl doorschuiven en raakt in geen van
              beide richtingen een muur. De tweede reeks is voor een schermlezer
              verborgen, anders staat elk project er twee keer in. */}
          <div className="pc-werk-spoor" ref={werkSpoor} role="group" aria-label="Uitgevoerde projecten"
            data-lus="1" onScroll={(e) => volgStand(e.currentTarget, setWerkPos)}>
            {[0, 1].map((reeks) => WERK_FOTOS.map((f) => (
              <figure className="pc-werk-foto" key={reeks + f.naam} aria-hidden={reeks === 1 ? true : undefined}>
                <img src={beeld(f.naam)} alt={reeks === 1 ? '' : f.alt} loading="lazy"
                  style={f.pos ? { objectPosition: f.pos } : undefined} />
              </figure>
            )))}
          </div>
          {/* De vullijn loopt in vier seconden vol en begint opnieuw op het
              moment dat de volgende foto inschuift: de bezoeker ziet hem
              aankomen. Muis erop of vinger erop bevriest de lijn waar hij
              staat; hij springt niet terug naar leeg. Dit is de enige
              voortgangsaanduiding van dit spoor — het balkje tussen de pijlen
              staat uit, twee streepjes vlak onder elkaar leest als een fout. */}
          <div className="pc-werk-lijn" aria-hidden="true">
            <i key={lijnRonde} className={werkStil ? 'pc-werk-vul pc-werk-vul--stil' : 'pc-werk-vul'} />
          </div>
          <Bediening spoor={werkSpoor} pos={werkPos} schuif={schuif} wat="foto" lus />
        </div>
        <div className="pc-vat pc-midden">
          <DakSchuif />
        </div>
      </section>

      {/* ── Keurmerken: waar we mee bouwen ── */}
      <section className="pc-merken">
        <div className="pc-vat pc-midden">
          <h2 className="pc-h2--midden">Waar we mee bouwen</h2>
          <p className="pc-merken-sub">
            Een goede verbouwing begint bij het materiaal.
          </p>
          {/* Vier merken, niet zes: dat zijn de logo's die in de repo staan.
              Een VCA-beeldmerk erbij tekenen zou een keurmerk verzinnen. */}
          <div className="pc-merkenrail" aria-label="Merken waarmee we werken">
            <div className="pc-merkenrail-spoor">
              {[0, 1].map((lus) => (
                <div className="pc-merkenrail-rij" key={lus} aria-hidden={lus === 1}>
                  {MERKEN.map((m) => <img key={m.alt} src={m.src} alt={m.alt} loading="lazy" />)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews: scoreblok links, kaartenspoor rechts ── */}
      <section className="pc-reviews">
        <div className="pc-vat pc-midden">
          <span className="pc-chip--rand">4,9<IcChevron richting="rechts" /></span>
          <h2 className="pc-h2--groot">Wat klanten schrijven</h2>
        </div>
        <div className="pc-vat pc-reviews-blok">
          <div className="pc-score-kolom">
            {/* De referentie zet 'EXCELLENT' in kapitalen. Zo'n all-caps
                mini-opschrift is precies de tell die Mohammed heeft verbannen. */}
            <div className="pc-score-woord">Uitstekend</div>
            <div className="pc-score-rij">{[0, 1, 2, 3, 4].map((i) => <IcSter key={i} />)}</div>
            <div className="pc-score-onder">Gemiddeld 4,9 van 5</div>
            {/* Als woord, niet als logo: het Google-beeldmerk staat niet in de
                repo en een nagetekend merk is een nagemaakt merk. */}
            <div className="pc-score-bron">Google</div>
          </div>
          <div className="pc-review-spoor" ref={reviewSpoor}
            onScroll={(e) => volgStand(e.currentTarget, setReviewPos)}>
            {REVIEWS.map((r) => (
              <article className="pc-review" key={r.name}>
                <div className="pc-review-sterren">{[0, 1, 2, 3, 4].map((i) => <IcSter key={i} />)}</div>
                <p>{r.text}</p>
                <div className="pc-review-lijn" />
                <div className="pc-review-voet">
                  <span className="pc-review-avatar">{r.name.charAt(0)}</span>
                  <span>
                    <span className="pc-review-naam">{r.name}</span>
                    <span className="pc-review-rol">{r.role}</span>
                  </span>
                  <span className="pc-review-bron" title="Beoordeling op Google"><IcGoogle /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <Bediening spoor={reviewSpoor} pos={reviewPos} schuif={schuif} wat="review" />
      </section>

      {/* ── Uw zekerheden: de vier voorwaarden die vastliggen ──
          Deze sectie stond eerst boven de werkwijze, dus vóór elk bewijs. Wie
          nog niet weet wie hier werkt en wat er is opgeleverd, leest vier
          voordelen als reclame. Nu komt hij ná het stappenplan, het werk en de
          reviews: dezelfde vier punten lezen dan als voorwaarden waarop je
          tekent, en de bezoeker scrolt langs het bewijs om er te komen. */}
      <section className="pc-aanbod">
        <div className="pc-vat">
          <h2 className="pc-h2--midden">Uw zekerheden</h2>
        </div>
        <div className="pc-spoor" ref={aanbodSpoor}
          onScroll={(e) => volgStand(e.currentTarget, setAanbodPos)}>
          {AANBOD.map((k, i) => <SpoorKaart key={k.titel} {...k} gevuld={i === 0} />)}
        </div>
        <Bediening spoor={aanbodSpoor} pos={aanbodPos} schuif={schuif} wat="kaart" />
      </section>

      {/* ── Contact ── */}
      <section className="pc-contact" id="contact">
        <div className="pc-vat pc-midden">
          <span className="pc-chip--vlak">{CONTACT.phone.display}<IcChevron richting="rechts" /></span>
          <h2 className="pc-h2--groot">Vraag een plaatsbezoek</h2>
        </div>
        <div className="pc-vat">
          <div className="pc-info">
            <div className="pc-info-kaart">
              <span className="pc-info-cirkel"><IcTelefoon /></span>
              <div><h3>Telefoon</h3><p><a href={CONTACT.phone.href}>{CONTACT.phone.spaced}</a></p></div>
            </div>
            <div className="pc-info-kaart">
              <span className="pc-info-cirkel"><IcPin /></span>
              <div><h3>Werkgebied</h3><p>Heel Vlaanderen</p></div>
            </div>
            <div className="pc-info-kaart">
              <span className="pc-info-cirkel"><IcMail /></span>
              <div><h3>Adres</h3><p>{CONTACT.address.street}<br />{CONTACT.address.postcode} {CONTACT.address.city}</p></div>
            </div>
          </div>

          <div className="pc-contact-rij">
            <form className="pc-form" onSubmit={verstuurContact} onFocusCapture={meldStart}>
              <h3>Zeg wat er moet gebeuren</h3>
              <p className="pc-form-sub">Vul in wat u weet, ook als het nog niet vastligt.</p>
              <div className="pc-form-paar">
                <label className="pc-form-veld"><span>Voornaam</span>
                  <input name="voornaam" placeholder="Voornaam" autoComplete="given-name" /></label>
                <label className="pc-form-veld"><span>Achternaam</span>
                  <input name="achternaam" placeholder="Achternaam" autoComplete="family-name" /></label>
              </div>
              <div className="pc-form-paar">
                <label className="pc-form-veld"><span>Telefoon</span>
                  <input name="telefoon" type="tel" placeholder="Telefoon" autoComplete="tel" /></label>
                <label className="pc-form-veld"><span>E-mail</span>
                  <input name="email" type="email" placeholder="E-mail" autoComplete="email" /></label>
              </div>
              <label className="pc-form-veld pc-form-enkel"><span>Soort werk</span>
                <select name="soortwerk" defaultValue="">
                  <option value="" disabled>Soort werk</option>
                  {SOORT_WERK.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="pc-form-veld pc-form-enkel"><span>Bericht (optioneel)</span>
                <textarea name="bericht" placeholder="Bericht (optioneel)" /></label>
              <button className="pc-knop pc-knop--accent" type="submit" disabled={bezig}>
                {bezig ? 'Bezig…' : 'Verstuur'}<IcPijl maat={13} />
              </button>
              {fout && <p className="pc-form-melding" style={{ color: '#a3231a' }}>{fout}</p>}
            </form>
            <div className="pc-contact-foto">
              <img src={contactFoto} alt="Afgewerkte leefruimte uit een totaalrenovatie van AB Bouw Groep" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Eind-CTA met de cirkelfoto die over de bandrand steekt ── */}
      <section className="pc-eind">
        <div className="pc-eind-bg">
          <img src={eindFoto} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="pc-cirkel">
          <img src={cirkelFoto} alt="Afgewerkte badkamer uit een renovatie van AB Bouw Groep" loading="lazy" />
        </div>
        <div className="pc-vat">
          <div className="pc-eind-vat">
            {/* De referentie herhaalt hier zijn eigen H1-vorm (drie diensten plus
                "één X"). Deze kop zegt iets anders dan de hero. */}
            <h2>Uw renovatie begint<br />met een plaatsbezoek.</h2>
            <p>Laat uw gegevens achter of bel ons. Wij komen langs, lopen de woning met u door en zeggen meteen wat er mogelijk is.</p>
            <div className="pc-eind-knoppen">
              <a className="pc-knop pc-knop--accent" href={CONTACT.phone.href}>
                {CONTACT.phone.display}<IcPijl />
              </a>
              <a className="pc-knop pc-knop--wit" href="#contact">Vraag een plaatsbezoek aan<IcPijl /></a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pc-footer">
        <div className="pc-vat">
          <div className="pc-footer-grid">
            <div>
              <div className="pc-footer-logo"><img src={logo} alt="AB Bouw Groep" /></div>
              <p>
                AB Bouw Groep is aannemer voor totaalrenovatie in heel Vlaanderen.
                Van ruwbouw tot afwerking.
              </p>
              {SOCIALS.length > 0 && (
                <div className="pc-footer-soc">
                  {SOCIALS.map(({ naam, href }) => {
                    const Icoon = SOCIAAL_ICOON[naam];
                    return <a key={naam} href={href} aria-label={naam} target="_blank" rel="noopener noreferrer"><Icoon /></a>;
                  })}
                </div>
              )}
            </div>

            <div>
              <h3>Snel naar</h3>
              <nav className="pc-footer-links">
                <a href="#top">Home</a>
                <a href="#over">Over ons</a>
                <a href="#diensten">Diensten</a>
                <a href="#werkwijze">Werkwijze</a>
                <a href="#contact">Gratis offerte</a>
              </nav>
            </div>

            <div>
              <h3>Onze diensten</h3>
              <nav className="pc-footer-links">
                <a href="/lp/totaalrenovatie">Totaalrenovatie</a>
                <a href="/lp/badkamerrenovatie">Badkamerrenovatie</a>
                <a href="/lp/tegelwerken">Tegel- en pleisterwerk</a>
                <a href="/lp/gevel">Dakwerken en gevelbekleding</a>
              </nav>
            </div>

            <div>
              <h3>Contact</h3>
              <div className="pc-footer-contact">
                <span><IcTelefoon /><a href={CONTACT.phone.href}>{CONTACT.phone.spaced}</a></span>
                <span><IcPin />{CONTACT.address.street},<br />{CONTACT.address.postcode} {CONTACT.address.city}</span>
                <span><IcMail /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
              </div>
            </div>
          </div>

          <div className="pc-footer-lijn" />
          <div className="pc-footer-onder">
            <span>© {new Date().getFullYear()} AB Bouw Groep. Alle rechten voorbehouden.</span>
            <a href="/privacy">Privacybeleid</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Bediening onder een horizontaal spoor: vorige, voortgang, volgende.
 * Op een telefoon is anders niet te zien dat er opzij te scrollen valt, en met
 * een muis is zijwaarts scrollen onhandig.
 */
function Bediening({ spoor, pos, schuif, wat, lus }: {
  spoor: React.RefObject<HTMLDivElement>;
  pos: { links: number; max: number };
  schuif: (ref: React.RefObject<HTMLDivElement>, richting: -1 | 1) => void;
  wat: string;
  /** Een spoor dat rondloopt heeft geen begin en geen eind: de knoppen staan
      dan nooit uit, en het positiebalkje vervalt. Dat balkje zou bij een
      verdubbelde reeks een halve stand tonen en halverwege terugspringen, en
      het stond bovendien vlak onder de vullijn — twee streepjes die iets
      anders bedoelen, 50px uit elkaar. */
  lus?: boolean;
}) {
  const deel = Math.min(1, Math.max(0, pos.links / pos.max));
  const zichtbaar = spoor.current ? spoor.current.clientWidth / spoor.current.scrollWidth : 1;
  return (
    <div className="pc-bediening">
      <button type="button" aria-label={`Vorige ${wat}`} disabled={!lus && pos.links <= 2 && pos.max > 2}
        onClick={() => schuif(spoor, -1)}><IcChevron richting="links" /></button>
      {!lus && (
        <span className="pc-bediening-rail" aria-hidden="true">
          <i style={{ width: `${Math.max(12, zichtbaar * 100)}%`, transform: `translateX(${deel * (100 / Math.max(0.12, zichtbaar) - 100)}%)` }} />
        </span>
      )}
      <button type="button" aria-label={`Volgende ${wat}`} disabled={lus ? false : pos.max <= 2 ? false : pos.links >= pos.max - 2}
        onClick={() => schuif(spoor, 1)}><IcChevron richting="rechts" /></button>
    </div>
  );
}

/** Eén stap uit de werkwijze: icooncirkel met stapnummer, titel en tekst. */
function Stap({ titel, tekst, Icoon, nr, actief }: (typeof STAPPEN)[number] & { nr: number; actief?: boolean }) {
  return (
    <div className={actief ? 'pc-stap pc-stap--actief' : 'pc-stap'}>
      <div className="pc-stap-badge">
        {actief && <span className="pc-stap-schijf" />}
        <Icoon />
        <span className="pc-stap-pil">Stap {nr}</span>
      </div>
      <h3>{titel}</h3>
      <p>{tekst}</p>
    </div>
  );
}

/** Eén kaart uit het aanbodspoor, met de zonnestraal-sticker op de foto. */
function SpoorKaart({ badge, titel, tekst, foto, alt, knop, href, gevuld }: Aanbodkaart & { gevuld?: boolean }) {
  return (
    <article className="pc-spoor-kaart">
      <div className="pc-spoor-foto">
        <img src={foto} alt={alt} loading="lazy" />
        <span className="pc-badge" style={{ color: 'var(--pc-accent)' }}>
          <IcZonnestraal />
          <span><b>{badge[0]}</b><i>{badge[1]}</i></span>
        </span>
      </div>
      <h3>{titel}</h3>
      <p>{tekst}</p>
      <a className={`pc-knop ${gevuld ? 'pc-knop--accent' : 'pc-knop--rand'}`} href={href}>
        {knop}<IcPijl />
      </a>
    </article>
  );
}

/** Eén fotokaart uit het dienstenraster. */
function Kaart({ titel, tekst, foto, alt, href, hoogte, gevuld }: Dienstkaart & { hoogte: number; gevuld?: boolean }) {
  return (
    <div className="pc-kaart" style={{ height: hoogte }}>
      <img src={foto} alt={alt} loading="lazy" />
      <div className="pc-kaart-inhoud">
        <div className="pc-kaart-tekst">
          <h3>{titel}</h3>
          <p>{tekst}</p>
        </div>
        <a className={gevuld ? 'pc-rond pc-rond--vol' : 'pc-rond'} href={href} aria-label={titel}>
          <IcPijl maat={14} />
        </a>
      </div>
    </div>
  );
}
