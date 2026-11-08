/**
 * Inhoud van de landingspagina's in de KGJ-vormtaal.
 *
 * De opmaak staat in LpKgj.tsx, de stijl in stijl.ts (gegenereerd uit de demo).
 * Wat per dienst verschilt staat hier: koppen, calculatorvragen, redenen,
 * stappen, foto's en de leadbron.
 *
 * De tekst van de dakwerkenpagina is getoetst met de copy-guard van de
 * norvo-copy-skill (copy-dakwerken.txt, groen op 22 sep 2026). Wijzig je hier
 * een zin, zet hem dan ook in dat bestand en draai de guard opnieuw.
 *
 * Waar de invalshoek vandaan komt (Google Ads Transparency Center, 22 sep):
 * de langstlopende beeldadvertentie van Recotex (601 dagen) zegt "Dak
 * vernieuwen? Reken vooraf. Snel, eenvoudig en zonder verplichtingen." met een
 * knop "Bereken nu". Geen van de vijf grootste spelers zet de calculator zelf
 * boven de vouw; hier staat de eerste vraag er meteen.
 */
import type { Divisie } from '@/lib/leads';

import panRood from '@/assets/dak/lp-dak-panrood.jpg';
import antraciet from '@/assets/dak/lp-real-det-2.jpg';
import waaromDakwerker from '@/assets/dak/waarom-dakwerker.jpg';
import waaromPannendak from '@/assets/dak/waarom-pannendak.jpg';
import antraciet3 from '@/assets/dak/lp-real-det-3.jpg';
import platdak from '@/assets/dak/platdak-tegel.jpg';
/* Stockfoto's (sfeerbeeld), DICTAAT MOHAMMED 13 okt 2026: "die stock photos ook op landingspagina dakwerken aub".
   Bron, fotograaf en licentie: bovenaan src/pages/abbouw/bf/fotoplan.ts. Alleen in hero.dias en cta.foto, nooit in een
   blok dat eigen werk toont (waarom, werk, voor/na, reviews, diensten). Guard: scripts/check-stock.cjs.
   De 1600-webp-varianten (scripts/bf-beelden.cjs) en niet de jpg's uit src/assets/dak-stock: betaald advertentieverkeer,
   de laadtijd van dia 1 telt meer dan de laatste scherpte (13 okt: 4 dia's samen 802 KB i.p.v. 2.699 KB). */
import stockDaklijn from '@/assets/bf/stock-daklijn-1600.webp';
import stockZinkwerk from '@/assets/bf/stock-zinkwerk-1600.webp';
import stockPannenStapels from '@/assets/bf/stock-pannen-stapels-1600.webp';
import stockPanlatten from '@/assets/bf/stock-panlatten-1600.webp';
/* 8 nov 2026, Mohammed: "Waar kunnen we u mee helpen? kan je in die vakjes geen mooie fotos doen?". AB heeft alleen eigen dakfoto's van de hoeve
   (geen isolatie, geen herstelling); zijn keuze op de klikvraag: "Stock in alle 4". Vier Pexels-foto's, licentie en uitsnede in fotoplan.ts. */
import stockDienstNieuwDak from '@/assets/bf/stock-dienst-nieuw-dak-900.webp';
import stockDienstRenovatie from '@/assets/bf/stock-dienst-renovatie-900.webp';
import stockDienstIsolatie from '@/assets/bf/stock-dienst-isolatie-900.webp';
import stockDienstHerstelling from '@/assets/bf/stock-dienst-herstelling-900.webp';
import dakVoor from '@/assets/lp-diensten/dak-voor.jpg';
import dakNa from '@/assets/lp-diensten/dak-na.jpg';
/* Foto's bij de eerste calculatorvraag (Mohammed, 24 sep). Hellend: de
   dakwerkenfoto van getnorvo.com (norvo-website sectoren/niche-dak.jpg).
   Plat: een plat dak op de achterbouw van een rijwoning
   (generated-final/set/platdak-na.jpg). Uitsneden 16:9, 640x360. */
import keuzeHellend from '@/assets/dak/keuze-hellend.jpg';
import keuzePlat from '@/assets/dak/keuze-plat.jpg';

import type { IcoonNaam } from './Iconen';
import { HOEVE } from './realisatie-hoeve';

/** foto: optioneel beeld boven het label; icoon: optioneel icoon links van het label.
    Het label zegt al wat er te zien is, dus geen alt-tekst. */
export type Keuze = { label: string; uitleg?: string; foto?: string; icoon?: IcoonNaam;
  /** Afvinkvraag: de groep waaronder de keuze als knopje staat (Ruimtes, Werken). */
  groep?: string };
/** als: de vraag verschijnt alleen als elke genoemde eerdere vraag één van de
    opgesomde antwoorden kreeg ({ Dak: ['Hellend dak'], Werk: ['Renovatie'] }).
    tip: na een van de antwoorden in `bij` staat `tekst` klein onder de volgende vraag. */
export type Vraag = {
  sleutel: string; vraag: string; keuzes: Keuze[];
  als?: Record<string, string[]>;
  /** Aanvraagkaart (Aanvraag.tsx, 30 okt 2026): de vraag valt weg zodra een eerdere vraag één van deze antwoorden kreeg. */
  nietAls?: Record<string, string[]>;
  tip?: { bij: string[]; tekst: string };
  /** Op een telefoon twee tegels naast elkaar in plaats van één kolom (alleen voor korte labels). */
  raster?: boolean;
  /** Altijd één kolom, ook op de computer (lange labels zoals bedragen breken anders midden in "€ 25.000"). */
  lijst?: boolean;
  /** Afvinkvraag: meerdere keuzes, met een knop Volgende. `alles` is het label van
      het vakje bovenaan dat alle keuzes in één keer aanvinkt. */
  afvinken?: { alles: string; tip?: { bij: string[]; tekst: string } };
  /** Een zekerheid als bulletpoint onder de keuzes van deze vraag (zelfde stijl als de
      troeven op de laatste stap). De regel onderaan de kaart valt dan weg, anders staat
      hij er twee keer. */
  punt?: string;
};
/** Eén stap van de offerte (Aanvraag.tsx): keuzelijsten en eventueel een optioneel tekstvak. */
export type OfferteStap = { kop: string; velden: { sleutel: string; label: string; opties: string[] }[]; extra?: { sleutel: string; label: string; hint: string } };
export type Foto = { src: string; alt: string };
export type Review = { tekst: string; naam: string; bron: string };

export type StapIcoon = 'pin' | 'offerte' | 'agenda' | 'helm' | 'sleutel';
export type Sectie = 'waarom' | 'voordelen' | 'diensten' | 'werkwijze' | 'uitgevoerd' | 'voorna' | 'reviews' | 'vangnet' | 'faq' | 'zekerheden' | 'uitleg' | 'realisatie';
/** Zekerhedenstrook (2 nov 2026, zoals bfbouw.be zekerStrook van 31 okt): korte zekerheden met icoon op één rij. */
export type Zekerheid = { icoon: 'prijs' | 'aanspreek' | 'schild' | 'kalender' | 'medaille' | 'klok' | 'premie'; tekst: string };

/** Realisatie in de kijker (8 nov 2026, realisatie-hoeve.ts): één echt project van AB met een video na de werken, een foto tijdens de werken (wissel
    "Na de werken" / "Tijdens de werken"), de uitgevoerde werken, foto's en een rondgang tijdens de werken (galerij + venster). */
export type Realisatie = {
  kop: string; project: string; werkenKop: string; werken: string[];
  na: { label: string; video: string; poster: string; alt: string };
  tijdens: { label: string; src: string; alt: string };
};

export type KgjInhoud = {
  /** Paginatitel in het tabblad. */
  titel: string;
  omschrijving: string;
  divisie: Divisie;
  /** Bron in GHL, zodat je in het CRM ziet van welke pagina een lead komt. */
  bronLead: string;
  bedanktSlug: string;
  /** ondertitel: eigen regel direct onder de kop, boven de subkop. */
  /** dias.pos: uitsnede in de brede hero (object-position), bijvoorbeeld om een nok in beeld te houden. */
  /** knop: een grote knop naar het formulier in plaats van de rekenaar in de hero, met een
      regel eronder (totaalrenovatie, 5 okt). De rekenaar staat dan in `vangnet`. */
  /** kop2: tweede deel van de kop als eigen regel in gedempt wit, zoals de kop op de homepage (bf-hero__kop2);
      zonder goud en zonder streep (totaalrenovatie, 13 okt). */
  hero: { kop: string; kop2?: string; ondertitel?: string; onder: string; bewijs: string[]; dias: (Foto & { pos?: string })[];
    knop?: { tekst: string; onder: string } };
  /** Smalle donkere balk boven de kop, gevolgd door het telefoonnummer (totaalrenovatie, 5 okt; weg sinds 13 okt). */
  topbalk?: string;
  /** Strakke hero (totaalrenovatie, 13 okt, Mohammed: "above the fold moet beter", "de cta moet duidelijk zijn,
      waarom nu doen, wat krijg je"): compactere kop, grotere knop met pijl, de regel onder de knop als vinkjes
      (delen gescheiden door " · ") en het eerstvolgende vrije plaatsbezoek live uit de agenda. */
  strak?: boolean;
  /** Het aanvraagformulier (Inspectie, zelfde als onderaan) in de hero in plaats van de knop: op de computer rechts
      naast de kop, op de telefoon direct onder de puntjes (13 okt, Mohammed: "is het niet slimmer om een form toe te
      voegen above the fold?"). */
  heroFormulier?: boolean;
  /** De rekenaar in de hero, ook als de pagina een knop heeft (knop verdwijnt uit de hero; #rekenaar springt naar de
      hero-rekenaar in plaats van het venster te openen). 13 okt, Mohammed: "gaat een rekenaar niet hoger converteren?",
      "nummer krijgen is oke, want ik wil voor ab groep een receptionist opbouwen", "na de rekenaar gaan ze toch naar
      bedankt pagina voor plaatsbezoek". Wint van heroFormulier. */
  heroRekenaar?: boolean;
  /** De aanvraagkaart in de hero (Aanvraag.tsx) in plaats van de rekenaar: eerst klikvragen, dan de contactstap, zoals
      bfbouw.be/lp/dakwerken. 19 okt 2026, Mohammed: "bouw de abgroep totaalrenovatie en dakwerken lp naar de nieuwe, dus
      rekenaar weg, en doe dat naar dakinspectie en gratis plaatsbezoek form bovenaan". Met deze vlag (en `aanvraag`) staat
      er nergens op de pagina een ingang naar de rekenaar: geen rekenaarknop, geen vangnet, geen venster, geen knop
      "Liever eerst een prijs?" in het formulier onderaan, geen rekenaarknop in de chat. Wint van heroRekenaar en heroFormulier. */
  heroAanvraag?: boolean;
  /** Belblok direct onder de hero (alleen /lp/dakwerken, 22 okt 2026): kop, de tekst vóór het nummer op de belknop en een
      rustige link naar de aanvraagkaart. Het nummer en de tel:-link komen uit CONTACT.phone, niet uit deze inhoud. */
  belBlok?: { kop: string; knop: string; link: string };
  /** De inhoud van de aanvraagkaart. titel + tijd: kop van de kaart; vragen: één tik = antwoord en meteen de volgende
      vraag (geen afvinkvragen); contactKop: kop van de laatste stap ("Bijna klaar! ..."); vertrouwen en trustrij: zoals op
      de rekenaarkaart; vrijMoment: het eerstvolgende vrije plaatsbezoek uit de agenda onder de kaartkop (sinds 22 okt 2026 op geen enkele
      pagina meer aan, Mohammed: "haal weg ... die volgende moment"; de vlag en VrijMoment in LpBf bestaan nog). */
  aanvraag?: { titel: string; tijd: string; vragen: Vraag[]; contactKop: string; vertrouwen?: string[];
    trustrij?: { b: string; s: string; icoon?: 'kalender' | 'gereedschap' | 'schild' }[]; vrijMoment?: boolean;
    /** Welke velden de contactstap heeft naast Naam* en Gsm* (22 okt 2026, renovatiepagina's: "verwijder email form,
        verwijder postcode form"; dezelfde dag ook /lp/dakwerken). Zonder deze instelling staan beide aan.
        email 'verplicht' (2 nov 2026, offerte zoals bfbouw.be 31 okt: "doe ook een vakje emailadres bij de offerte aanvraag
        indiening"): E-mailadres* als eigen rij onder Naam en Telefoonnummer. */
    contactVelden?: { email?: boolean | 'verplicht'; postcode?: boolean };
    /** Wat de bezoeker krijgt, direct onder "Bijna klaar!": sinds 26 okt 2026 drie vinkjes in een eigen vlak (Mohammed: "moet
        visueel duidelijker en apart, en visueel mooi"), zelfde woorden als de zin van 22 okt. */
    disclaimer?: string[];
    /** Het slotblok onderaan (#contact) toont dezelfde klikkaart als de hero, in plaats van het formulier van Inspectie.tsx. */
    onder?: boolean;
    /** Regel direct onder de verzendknop, na "★★★★★ 5,0 op Google ·" (bfbouw.be rk__knopzeker, 23 okt 2026). */
    zeker?: string;
    /** Vertrouwensrij, vinkjes en Google-badge als duidelijke tegels met iconen (alleen vorm, zelfde teksten en cijfers). */
    badges?: boolean;
    /** 29 okt 2026, Mohammed: "weet u al wat de staat is van uw dak en wilt u een offerte aanvragen, klik dan hier". Onder de
        keuzes van vraag 1: wie al weet wat er moet gebeuren, slaat de vragen over en vraagt meteen een offerte aan. */
    offerte?: { vraag: string; knop: string; contactKop: string; verzend: string;
      /** 30 okt 2026, Mohammed: "verschillende vakken met waar mogelijk dropdown is beste, dat zorgt voor makkelijkheid, en de meest
          belangrijke vragen en dan optioneel extra": per stap een paar keuzelijsten (verplicht) en eventueel het tekstvak Extra info
          (optioneel), met Doorgaan; daarna de contactstap. De sleutel staat zo in aanvullende_info ("Soort werk: Dak herstellen"). */
      stappen?: OfferteStap[] };
    /** 5 nov 2026, zoals bfbouw.be 4-5 nov (Mohammed: "doe bij ab de exact form dingen", "de exacte wijzigingen als bij bf"):
        laadstap van 1,2 s tussen de laatste vraag en het contactscherm. kop = de regel met het draaiende rondje; eerste en laatste =
        regel 1 en 3; regel 2 = de antwoorden op `sleutels` (een kaal "Weet ik niet" telt niet), of `leeg` als er geen is. */
    laden?: { kop: string; eerste: string; laatste: string; sleutels: string[]; leeg: string };
    /** "Na uw aanvraag": wat er na het versturen gebeurt (bfbouw.be LP.kaart.volgtKop + volgt). Op de gsm over het volle scherm
        boven de velden, op de pc in het venster links, in de pagina onder de verzendknop; ook op de bedankpagina ("Wat nu volgt"). */
    volgtKop?: string;
    volgt?: { titel: string; tekst: string }[];
    /** Eén regel direct boven de verzendknop, alleen in de pagina (bfbouw.be rk__trigger "Offerte binnen 24 uur"). */
    trigger?: string;
    /** Tekst van de knoppen die naar het formulier gaan (kop, waarom, werkwijze, vaste gsm-knop). De verzendknop zelf = inspectie.knop.
        5 nov 2026, bfbouw.be: "gratis" alleen nog in de kaarttitel en de verzendknop, de andere knoppen "Offerte aanvragen". */
    naarKnop?: string };
  /** titel + tijd: kop van de calculator boven de voortgang; zeker: de regel onderaan de kaart.
      trustrij: rij onderaan de kaart met Google 5,0 + sterren en daarnaast deze cijfers (zoals bfbouw.be rk__trust). */
  rekenaar: { trustrij?: { b: string; s: string }[]; titel: string; tijd: string; zeker: string; vragen: Vraag[]; gerust: string; uitkomstKop: string; uitkomstOnder: string; knop: string; troeven?: string[];
    /** Trust signals onderaan de kaart, met vinkje; vervangen de regel `zeker` (dakwerken, 4 okt). */
    vertrouwen?: string[] };
  /** tegenover: de zin boven de redenen; dan staat de tekst (de frustratie) links in een
      donker vak en de redenen (de oplossing) rechts, zonder foto's (totaalrenovatie, 5 okt). */
  /** kolommen: alleen de kop en de redenen, als drie kolommen met icoon (gestripte
      totaalrenovatie, 5 okt); gaat voor `tegenover`. */
  /** intro: alinea onder de kop bij de kolommen (definitieve totaalrenovatie, 5 okt). */
  waarom: { kop: string; tekst: string; redenen: { titel: string; tekst: string }[]; duo: [Foto, Foto]; tegenover?: string; kolommen?: boolean; intro?: string };
  /** Diensten onder "Waarom": id is het anker voor een sitelink (/lp/dakwerken#nieuw-dak). */
  /** onder: optionele zin onder de kop. Een lege tekst toont alleen icoon en naam (totaalrenovatie, 27 sep).
   *  foto: met een foto wordt de dienst een fotokaart zonder icoon (dakwerken, 2 okt).
   *  vlakken: kaarten met het icoon op een groot licht vlak, ook zonder foto (dakwerken, 3 okt). */
  /** meer (2 nov 2026, zoals bfbouw.be 31 okt "dienstkaarten moeten leiden naar info"): de hele kaart is tikbaar en klapt
   *  deze uitleg open ("Lees meer" / "Minder tonen"); niets leidt weg van de aanvraag. */
  diensten: { kop: string; onder?: string; vlakken?: boolean; lijst: { id: string; icoon: IcoonNaam; naam: string; tekst: string; foto?: Foto; meer?: string[] }[] };
  /** Zekerhedenstrook (2 nov 2026): staat waar 'zekerheden' in de volgorde staat. Meer dan drie: een band die doorloopt (7 nov 2026, zoals
      bfbouw.be zeker--loop). */
  zekerheden?: Zekerheid[];
  /** Realisatie in de kijker (8 nov 2026): staat waar 'realisatie' in de volgorde staat. */
  realisatie?: Realisatie;
  /** "Wat heeft uw dak nodig?" (7 nov 2026, zoals bfbouw.be LP.uitleg): twee alinea's, een lijst met kop, een slotzin met vink en de foto rechts.
      zoek: de knoppen "Ik ben op zoek naar:" eronder; elke knop vult vraag 1 (sleutel) van de kaart onderaan in en brengt die kaart in beeld. */
  uitleg?: { kop: string; tekst: string[]; lijstKop: string; lijst: string[]; slot: string; foto: Foto;
    zoek?: { kop: string; sleutel: string; knoppen: { tekst: string; label: string; icoon: IcoonNaam }[] } };
  /** Voordelen tussen "Waarom" en de diensten: elk voordeel een gekleurde bol met icoon. */
  voordelen?: { kop: string; lijst: { icoon: IcoonNaam; kleur: 'oranje' | 'blauw' | 'groen'; titel: string; tekst: string }[] };
  /** Veelgestelde vragen vlak voor het slotblok; alleen op pagina's die ze invullen (29 sep).
      eersteOpen: de eerste vraag staat open bij het laden; link: klikbare zin achter het antwoord naar het offerteblok (#contact)
      (5 nov 2026, zoals bfbouw.be: "vraag dan een gratis offerte aan, en dat klikbaar"). */
  faq?: { kop: string; eersteOpen?: boolean; lijst: { v: string; a: string; link?: string }[] };
  /** meer: nog andere voor/na-paren; de schuif krijgt dan pijlen (29 sep). */
  /** hint: korte regel onder de schuif ("Sleep de balk over de foto"). */
  voorna: { kop: string; onder: string; voor: Foto; na: Foto; label: string; meer?: { voor: Foto; na: Foto; label?: string }[]; hint?: string };
  /** Uitgevoerd werk, direct boven de voor/na (totaalrenovatie, 28 sep): een doorlopend
      spoor met alleen echte foto's van AB, zonder namen (Mohammed: "zonder de namen").
      Optioneel: dakwerken vult het niet in en toont de sectie niet. pos: object-position
      van de vierkante uitsnede. De herkomst van elke foto staat in scripts/check-lp-reno.cjs. */
  uitgevoerd?: { kop: string; onder?: string; fotos: (Foto & { pos?: string })[] };
  /** Het vangnet (totaalrenovatie, 5 okt): een rustig blok met een knop die de rekenaar in
      een venster opent, voor wie nog geen plaatsbezoek wil. Draagt het anker #rekenaar. */
  /** href: de knop gaat naar die pagina (de losse rekenaar) in plaats van het venster te openen. */
  vangnet?: { kop: string; tekst: string; knop: string; href?: string };
  /** Volgorde van de secties tussen de hero en het slotblok. Leeg = de standaardvolgorde. */
  volgorde?: Sectie[];
  /* Foto's van uitgevoerd werk. Dit staat op de plek waar de demo reviews
     heeft: AB heeft één Google-review, dus tot er echte klantenstemmen zijn
     draagt het werk zelf het bewijs. */
  werk: { kop: string; onder: string; fotos: (Foto & { label: string })[] };
  reviews: { kop: string; beeld: Foto; lijst: Review[] };
  /** icoon per stap: leeg = de iconen van de dak-LP op volgorde (totaalrenovatie, 5 okt: eigen iconen
      zodat er geen twee huisjes in één rij staan). */
  werkwijze: { kop: string; onder: string; stappen: { titel: string; tekst: string; icoon?: StapIcoon }[] };
  /** punten: wat de klant bij de gratis inspectie krijgt, als vinkjes onder de kop. */
  /** naam: korte naam van de aanvraag, voor de knop in de vaste balk op de telefoon en voor het
      CRM ("Aanvraag gratis plaatsbezoek"); leeg = de kop. onderkop: regel onder de kop. */
  cta: { kop: string; tekst: string; punten: string[]; foto: Foto; naam?: string; onderkop?: string };
  /** Het formulier onderaan: de gratis dakinspectie, met een link terug naar de calculator. */
  /** extra: optionele keuzelijsten onder de verplichte velden (totaalrenovatie, 26 sep:
      "bij totaalrenovatie willen ze juist meer"). Nooit verplicht: alleen het telefoonnummer is dat. */
  /** plaatsbezoek: de velden in de volgorde naam, e-mail, gsm, postcode, met deze labels
      (totaalrenovatie, 5 okt). vertrouwen: regels met een icoon onder de knop; die vervangen
      onder, alt en de privacyregel. */
  /** knopPijl: een pijl achter de tekst van de verzendknop (zijn ➔). */
  inspectie: { kop: string; knop: string; onder: string; alt: string; bronLead: string; knopPijl?: boolean;
    extra?: { naam: string; label: string; opties: string[] }[];
    plaatsbezoek?: { naam: string; naamHint: string; email: string; emailHint: string; gsm: string; gsmUitleg: string; gsmHint: string; postcode: string; postcodeHint: string };
    vertrouwen?: { icoon: 'slot' | 'telefoon' | 'euro' | 'koffie'; tekst: string }[] };
  /** Message match (Mohammed, 26 sep): wie via een advertentie of sitelink komt, ziet een kop
      die past bij wat hij zocht. `zoek` is een regex, apart getoetst op dienst=, dak= en utm_term;
      voor de kop wint die volgorde (LpKgj.tsx). `voor` beantwoordt vraag 1 al (Terug blijft werken). */
  boodschap?: { zoek: string; kop: string; voor?: { sleutel: string; label: string } }[];
  /** Vraag die op deze pagina altijd al beantwoord is (sub-LP, bv. /lp/dakwerken/asbest: Asbest = Ja), als er geen message match is. */
  voorAf?: { sleutel: string; label: string };
};

/** Telt deze vraag van de aanvraagkaart mee bij deze antwoorden? (zoals telt() in bfbouw.be src/js/site.js, 4 nov 2026)
    als: elk genoemd antwoord moet gekozen zijn (Nieuw dak krijgt eigen vragen); nietAls: de vraag valt weg bij één van die antwoorden. */
export function vraagTelt(v: Vraag, antwoorden: Record<string, string>): boolean {
  if (v.als && Object.entries(v.als).some(([k, l]) => !l.includes(antwoorden[k]))) return false;
  return !v.nietAls || !Object.entries(v.nietAls).some(([k, l]) => l.includes(antwoorden[k]));
}
/** Na een ander antwoord (bv. Terug en Dakrenovatie in plaats van Nieuw dak): antwoorden van vragen die niet meer tellen gaan weg,
    tenzij een vraag met dezelfde sleutel nog telt of de pagina dat antwoord vooraf gaf (bfbouw.be snoei(), 4 nov 2026). */
export function snoeiAntwoorden(vragen: Vraag[], antwoorden: Record<string, string>, vooraf?: string): Record<string, string> {
  const a = { ...antwoorden };
  for (let ronde = 0; ronde < 4; ronde++) {
    const weg = vragen.filter((v) => a[v.sleutel] !== undefined && v.sleutel !== vooraf && !vraagTelt(v, a)
      && !vragen.some((x) => x !== v && x.sleutel === v.sleutel && vraagTelt(x, a)));
    if (!weg.length) break;
    weg.forEach((v) => { delete a[v.sleutel]; });
  }
  return a;
}

/* De kop van /lp/dakwerken (2 nov 2026, zoals bfbouw.be 31 okt). Tussen [ ] = accentkleur. */
const DAK_KOP = 'Uw dak laten [vernieuwen], [renoveren] of [isoleren]?';

export const DAKWERKEN: KgjInhoud = {
  /* Mohammed, 25 sep: de tekst in het tabblad "moet gaan over het vak", niet over prijs. */
  /* 2 nov 2026 (opdracht Mohammed: "landingspaginas van ab omvormen, we hebben die van bf omgevormd, nu ab"): titel = de kop,
     zoals bfbouw.be/lp/dakwerken sinds 31 okt. */
  titel: 'Uw dak laten vernieuwen, renoveren of isoleren? | AB Bouw Groep',
  /* 24 sep: "zes antwoorden" klopt niet meer (6 tot 8 vragen per pad) en
     "binnen één werkdag" is als belofte van de pagina gehaald. */
  /* 19 okt 2026: zonder "Bereken in 2 minuten de prijs van uw dak." (rekenaar weg, opdracht Mohammed); de rest woordelijk. */
  /* 2 nov 2026: offerte in plaats van dakinspectie (zoals bfbouw.be 31 okt). */
  omschrijving: 'Dakrenovatie, nieuw dak of dakisolatie. Vraag uw gratis offerte aan bij AB Bouw Groep, werken aan 6% btw.',
  divisie: 'ab_dakwerken',
  bronLead: 'lp:dakwerken:rekenaar',
  bedanktSlug: 'dakwerken',

  hero: {
    /* De calculator staat ernaast en zegt zelf wat hij doet. Mohammed: 'de
       berekening is toch ernaast dat hoef je niet te verwoorden'. De kop gaat
       over het resultaat aan zijn huis. */
    /* 4 okt, Mohammed: "headline, bereken in 2 minuten de richtprijs van uw dak, met 2 minuten in kleur".
       Tussen [ ] = in de accentkleur. */
    /* 4 okt, plan mobiele hero: "Bereken in 1 minuut de richtprijs van uw dak" (maak "1 minuut" oranje/goud). */
    /* 19 okt 2026, opdracht Mohammed: "rekenaar weg, en doe dat naar dakinspectie ... form bovenaan en andere headline en
       subheadline". Kop en subkop waren mijn tekst ("Laat uw dak gratis inspecteren").
       20 okt 2026, Mohammed: "Laat uw dak gratis inspecteren??? wat is dat voor een headline" en "je kan toch zelf ook
       redeneren dat dit niet goed is". De kop was een opdracht over de werkwijze (de inspectie) in plaats van over zijn dak,
       en herhaalde het aanbod dat de kaart ernaast al noemt. Nu: wie AB is + zijn dak, zoals bfbouw.be ("De nr. 1 in
       dakwerken" + het aanbod in de subkop) en het tabblad van 25 sep. Het aanbod staat in de subkop en in de kaart. */
    /* 2 nov 2026: de kop van bfbouw.be/lp/dakwerken (dictaat Mohammed 31 okt: "doe de 3 woorden aan t einde renoveren isoleren
       vernieuwen die oranje"), hier in AB-goud. Het aanbod staat in de kaart; de subkop zegt wie AB is voor zijn dak. */
    kop: DAK_KOP,
    /* Mohammeds eigen zin, letterlijk (24 sep): "doe daar gewoon subheadline
       van de specialisatie". De vorige subkop ("u weet direct wat het kost",
       daarna "wij bellen u met de prijs") ging over de calculator, die ernaast
       staat en zichzelf uitlegt. */
    /* 4 okt, Mohammed: "subheadline, beantwoord 8 korte vragen voor een heldere en vrijblijvende
       prijsindicatie van uw dakrenovatie". Het pad van een dakrenovatie telt 8 vragen. */
    /* 4 okt, plan mobiele hero: subheadline "Snel, gratis en 100% vrijblijvend." (vervangt de zin met het aantal vragen). */
    /* 22 okt 2026, Mohammed: "subheadline ... moet eerst zijn, Specialist in platte en hellende daken, renovatie, isolatie, ... (zoiets)
       kies zelf een mooie zin, pas daarna moet komen, vraag uw gratis dakinspectie aan, u weet daarna precies ... mag eruit".
       "Expert" in plaats van "Specialist": de kop erboven zegt al "Dé specialist voor uw nieuwe dak". Renovatie, isolatie en
       herstellingen zijn de keuzes van de vraag "Wat moet er aan uw dak gebeuren?" in de kaart. */
    /* 2 nov 2026: de subkop van bfbouw.be (dictaat Mohammed 31 okt / 1 nov, woordelijk) met het AB-feit: "meer dan 15 jaar
       ervaring in dakwerken" (Mohammed, waarom-tekst hieronder). Ervaring, geen leeftijd van het bedrijf (les BF 1 nov). */
    /* 7 nov 2026 (Mohammed in de BF-chat: "en doe al deze changes ook bij ab pagina"): de subkop van bfbouw.be van 7 nov, woordelijk
       (zijn "van ... tot dakrenovatie moet gaan over de drie dingen dat je in de subkop zegt", zinsbouw van de meeste dakwerkers). Geen
       bedrijfsfeit erin, dus ook voor AB waar. Was: "Specialist in platte en hellende daken. Met meer dan 15 jaar ervaring in dakwerk ..." */
    onder: 'Van dakisolatie en dakrenovatie tot een volledig nieuw dak. Met vakmanschap, kwaliteitsvolle materialen en oog voor detail zorgen wij voor een duurzaam en stevig dak.',
    /* Drie controleerbare feiten onder de kop. Een bezoeker die uit een
       advertentie komt, kent AB niet; dit is het enige bewijs dat boven de
       vouw past zolang er geen geverifieerde Google-score is.
       Volgorde op wat de Belgische markt blijkt te belonen: de langstlopende
       tekstadvertentie van Dural (1462 dagen, 45 van zijn 60 leesbare ads)
       zet "gratis en vrijblijvend" vooraan. Het VCA-attest staat nu in het
       waarom-blok: een certificaat overtuigt lager op de pagina, een
       toezegging overtuigt boven de vouw. */
    /* 4 okt: leeg. Premie, 6% btw en 10 jaar garantie staan als trust signals in de rekenaar;
       twee keer op het eerste scherm "ziet er niet uit" (Mohammed). Zo staat de rekenaar op de
       telefoon hoger. */
    bewijs: [],
    /* 13 okt 2026 (dictaat hierboven bij de imports): de vier stockfoto's van /dakwerken vervangen de gegenereerde
       dia's (heroNok, panRood, droneAntraciet, pannenDicht). Alt = neutrale beschrijving van wat te zien is; de laatste
       drie woordelijk uit fotoplan.ts (STOCK). Daklijn: lucht bovenaan voor de kop; pos 75% 100% houdt de daklijn in
       beeld (1265: de onderkant met de daken; 390: de oranje dakhelling met de schouwen). */
    dias: [
      { src: stockDaklijn, pos: '75% 100%', alt: 'Daken van oude rijwoningen met rode en grijze pannen, bakstenen schouwen en witte dakkapellen onder een grijze lucht' },
      { src: stockZinkwerk, alt: 'Daken van rijwoningen met twee dakramen, een zinken dakkapel en een dakkapel met pannen' },
      { src: stockPannenStapels, alt: 'Rode vlakke dakpannen op de panlatten: onderaan gelegd, bovenaan in stapeltjes over het dakvlak verdeeld' },
      { src: stockPanlatten, alt: 'Houtvezelplaten op het dakvlak met tengels en panlatten, waarop een baan zwarte dakpannen ligt' },
    ],
  },

  /* 19 okt 2026 (opdracht Mohammed, zie hero): bovenaan de aanvraagkaart voor de gratis dakinspectie, zoals
     bfbouw.be/lp/dakwerken: vier klikvragen, dan naam, gsm, postcode of gemeente en e-mail. De rekenaar hieronder staat op
     deze pagina nergens meer (de inhoud blijft voor LpKgj, de terugval). */
  heroAanvraag: true,
  /* 22 okt 2026, Mohammed: "op de dakwerken-pagina's een visueel mooi en clean blok 'Nood? Bel ....', maar niet letterlijk 'nood'",
     met de kop "Lekt uw dak?" en daaronder de gratis dakinspectie. Letterlijk zijn teksten; geen termijn, geen "24/7". */
  /* 22 okt 2026, Mohammed: "Lekt uw dak pas aan naar, in nood?", "en die ding geen haast haal dat weg", "doe gewoon, of". */
  /* 2 nov 2026: link volgt het aanbod (bfbouw.be 31 okt: "Of vraag uw gratis offerte aan"). */
  /* 5 nov 2026, zoals bfbouw.be ("gratis" alleen in de kaarttitel en de verzendknop): "Of vraag uw offerte aan". */
  belBlok: { kop: 'In nood?', knop: 'Bel direct', link: 'Of vraag uw offerte aan' },
  aanvraag: {
    /* 2 nov 2026 (omvormen zoals bfbouw.be 31 okt, Mohammed daar: "ik wil gewoon standaard offerte aanvraag vragen, dan aanvragen,
       en dan op thankyou page pas de offer van dakinspectie"; "mensen hebben niet graag die gratis dakinspectie als woord"):
       kaartkop woordelijk zoals bfbouw.be, zonder de tijdregel eronder. De dakinspectie staat op de bedankpagina (BedanktBf). */
    titel: 'Gratis offerte aanvragen',
    tijd: '',
    /* De vragen en antwoorden van de opdracht, woordelijk. Vraag 1 met de foto's van de eerste rekenaarvraag; de sleutel
       Dak is die van de message match (boodschap.voor). De sleutels staan zo in aanvullende_info ("Dak: ... · Werk: ..."). */
    vragen: [
      /* 5 nov 2026, zoals bfbouw.be 4 nov (Mohammed daar: 'Welk soort dak heeft u?' past niet bij een nieuw dak, "heeft u of zou u
         willen ofzo"): een vraag die past bij een bestaand en een nieuw dak (was "Wat voor dak heeft u?"). */
      /* 2 nov 2026, zoals bfbouw.be 31 okt: de inspectie-keuze wordt "Weet ik nog niet" (altijd onderaan) en Isolatie staat erboven
         (Mohammed 30 okt: "doe dan aub in stap 2 optie toevoegen Isolatie", "wat ik je zeg ook voor ab he"; 31 okt: "bij stap 2 zet
         isolatie boven weet ik nog niet"). */
      /* 5 nov 2026, zoals bfbouw.be 4 nov (Mohammed daar: "nieuw dak is een aanzienlijk andere prijs dan dakrenovatie" -> "oke"):
         Dakrenovatie en Nieuw dak apart (was "Dakrenovatie / Nieuw dak"); op de gsm 2x2 en "Weet ik nog niet" over de volle breedte. */
      /* 7 nov 2026, zoals bfbouw.be 7 nov ("en doe al deze changes ook bij ab pagina"): vraag 1 = "Ik ben op zoek naar:" (Mohammed daar: "Wat moet er
         aan uw dak gebeuren? bovenaan ook naar ik ben op zoek naar:", "doe ook ipv eerste vraag hellend of plat dak, doe dat als twee[de] vraag"), en
         "Weet ik nog niet" wordt "Gratis dakinspectie" ("vervang die door gratis dakinspectie"). AB-bron voor de gratis dakinspectie: de bedankpagina
         biedt ze sinds 31 okt aan ("Plan uw gratis dakinspectie"). Zo sluiten de knoppen "Ik ben op zoek naar" in "Wat heeft uw dak nodig?" aan. */
      { sleutel: 'Werk', vraag: 'Ik ben op zoek naar:', raster: true, keuzes: [
        { label: 'Dakrenovatie', icoon: 'dienst-renovatie' }, { label: 'Nieuw dak', icoon: 'dienst-nieuw' },
        { label: 'Herstelling', icoon: 'herstel' }, { label: 'Isolatie', icoon: 'isolatie' },
        { label: 'Gratis dakinspectie', icoon: 'inspectie' },
      ] },
      { sleutel: 'Dak', vraag: 'Om welk soort dak gaat het?', keuzes: [
        { label: 'Hellend dak', foto: keuzeHellend },
        { label: 'Plat dak', foto: keuzePlat },
      ] },
      /* 7 nov 2026, zoals bfbouw.be (Mohammed daar: "bij gratis dakinspectie moeten de vragen erna wel veranderen"): wie Gratis dakinspectie kiest,
         krijgt na het soort dak "Wat merkt u aan uw dak?" (per soort dak een eigen lijst, zelfde sleutel; woordelijk bfbouw.be) en daarna alleen
         asbest; isoleren, oppervlakte en start vallen weg (nietAls hieronder). */
      { sleutel: 'Signaal', vraag: 'Wat merkt u aan uw dak?', lijst: true, als: { Werk: ['Gratis dakinspectie'], Dak: ['Hellend dak'] }, keuzes: [
        { label: 'Lekkage of vochtplekken', icoon: 'lek' }, { label: 'Losse of kapotte pannen', icoon: 'golfpan' },
        { label: 'Schade na een storm', icoon: 'schade' }, { label: 'Mijn dak is al oud', icoon: 'oud' },
        { label: 'Ik wil het laten nakijken', icoon: 'inspectie' },
      ] },
      { sleutel: 'Signaal', vraag: 'Wat merkt u aan uw dak?', lijst: true, als: { Werk: ['Gratis dakinspectie'], Dak: ['Plat dak'] }, keuzes: [
        { label: 'Lekkage of vochtplekken', icoon: 'lek' }, { label: 'Scheuren of blazen in de roofing', icoon: 'roofing' },
        { label: 'Water blijft op het dak staan', icoon: 'goot' }, { label: 'Mijn dak is al oud', icoon: 'oud' },
        { label: 'Ik wil het laten nakijken', icoon: 'inspectie' },
      ] },
      /* 5 nov 2026, zoals bfbouw.be 4 nov (Mohammed daar: "en bij nieuw stap andere goede perfect aansluitende vragen"): wie Nieuw dak
         kiest, krijgt waarvoor het dak is en de dakbedekking (per soort dak een eigen lijst, zelfde sleutel); "Wilt u ook isoleren?"
         valt weg, asbest alleen als het huidige dak vervangen wordt. Vragen en keuzes woordelijk bfbouw.be; iconen uit de eigen set. */
      { sleutel: 'Situatie', vraag: 'Waarvoor is het nieuwe dak?', als: { Werk: ['Nieuw dak'] }, keuzes: [
        { label: 'Nieuwbouw', icoon: 'vrijstaand' }, { label: 'Uitbreiding of aanbouw', icoon: 'dienst-ruwbouw' },
        { label: 'Huidig dak vervangen', icoon: 'dienst-renovatie' },
      ] },
      { sleutel: 'Dakbedekking', vraag: 'Welke dakbedekking wilt u?', als: { Werk: ['Nieuw dak'], Dak: ['Hellend dak'] }, keuzes: [
        { label: 'Dakpannen', icoon: 'golfpan' }, { label: 'Leien', icoon: 'vlakkepan' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Dakbedekking', vraag: 'Welke dakbedekking wilt u?', als: { Werk: ['Nieuw dak'], Dak: ['Plat dak'] }, keuzes: [
        { label: 'EPDM', icoon: 'epdm' }, { label: 'Roofing', icoon: 'roofing' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      /* Wie bij stap 2 Isolatie of Nieuw dak koos, krijgt deze vraag niet. */
      { sleutel: 'Isolatie', vraag: 'Wilt u ook isoleren?', nietAls: { Werk: ['Isolatie', 'Nieuw dak', 'Gratis dakinspectie'] }, keuzes: [
        { label: 'Ja', icoon: 'isolatie' }, { label: 'Nee', icoon: 'geenisolatie' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Asbest', vraag: 'Zit er asbest in uw dak?', nietAls: { Situatie: ['Nieuwbouw', 'Uitbreiding of aanbouw'] }, keuzes: [
        { label: 'Ja', icoon: 'asbest' }, { label: 'Nee', icoon: 'veilig' }, { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      /* 2 nov 2026, zoals bfbouw.be 31 okt (Mohammed: "meer vragen dat erbij horen, op basis van de norm", gewone offerteaanvraag):
         de oppervlakte en de start, met de vragen en antwoorden van bfbouw.be (zijn offertestap "Planning" van 30 okt, "Binnen 6
         maanden" op zijn woord). Vervangt de startvraag van 22 okt (Dit jaar / Volgend jaar / Ik verken nog). Iconen uit de eigen set:
         de vier vakjes lopen op met de oppervlakte. */
      /* 5 nov 2026, zoals bfbouw.be 4 nov (Mohammed daar: 'Hoe groot is uw dak ongeveer?' bij Nieuw dak + Nieuwbouw "is fout toch"): wie
         nog geen dak heeft, krijgt "Hoe groot wordt het dak ongeveer?" (zelfde sleutel en keuzes). */
      { sleutel: 'Oppervlakte', vraag: 'Hoe groot is uw dak ongeveer?', lijst: true, nietAls: { Situatie: ['Nieuwbouw', 'Uitbreiding of aanbouw'], Werk: ['Gratis dakinspectie'] }, keuzes: [
        { label: 'Minder dan 50 m²', icoon: 'maat1' }, { label: '50 tot 100 m²', icoon: 'maat2' },
        { label: '100 tot 150 m²', icoon: 'maat3' }, { label: 'Meer dan 150 m²', icoon: 'maat4' },
        { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Oppervlakte', vraag: 'Hoe groot wordt het dak ongeveer?', lijst: true, als: { Situatie: ['Nieuwbouw', 'Uitbreiding of aanbouw'] }, keuzes: [
        { label: 'Minder dan 50 m²', icoon: 'maat1' }, { label: '50 tot 100 m²', icoon: 'maat2' },
        { label: '100 tot 150 m²', icoon: 'maat3' }, { label: 'Meer dan 150 m²', icoon: 'maat4' },
        { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Start', vraag: 'Wanneer wilt u starten?', nietAls: { Werk: ['Gratis dakinspectie'] }, keuzes: [
        { label: 'Zo snel mogelijk', icoon: 'snel' }, { label: 'Binnen 3 maanden', icoon: 'drie' },
        { label: 'Binnen 6 maanden', icoon: 'later' }, { label: 'Later', icoon: 'verken' },
      ] },
    ],
    /* 2 nov 2026: kop van de laatste stap zoals bfbouw.be 31 okt (was "Bijna klaar! Bevestig uw gratis dakinspectie").
       5 nov 2026, zoals bfbouw.be (Mohammed daar: "het constant herhalen van gratis en vrijblijvend wekt juist argwaan ... behoud het op
       belangrijke plekken"): zonder "gratis"; op het contactscherm staat "gratis" alleen nog op de verzendknop. */
    contactKop: 'Bijna klaar! Vraag uw offerte aan',
    /* 5 nov 2026, woordelijk bfbouw.be 4-5 nov (laadstap, "Na uw aanvraag", regel boven de knop). AB-feiten:
       - "binnen 24 uur": Mohammed 2 nov voor AB, "offerte binnen 24 uur moet ook offerte binnen 24uur bij ab" (Ads AB 2 nov);
       - "via WhatsApp of" van bfbouw.be NIET: AB heeft geen WhatsApp-nummer in een bron (contact.ts, GHL Twilio-nummers);
         de offerte gaat naar het e-mailadres dat de bezoeker verplicht invult;
       - "dakexpert": de AB-zin onder de knop sinds 21 okt ("Onze dakexpert contacteert u ..."). */
    laden: { kop: 'Uw aanvraag wordt klaargezet', eerste: 'Antwoorden opgeslagen', laatste: 'Klaar voor onze dakexpert', sleutels: ['Werk', 'Oppervlakte'], leeg: 'Gegevens van uw dak' },
    volgtKop: 'Na uw aanvraag',
    /* 7 nov 2026, zoals bfbouw.be 7 nov (Mohammed daar: "oke doe maar die 3 stappen"; "en doe al deze changes ook bij ab pagina"): eerst contact
       binnen 24 uur, dan het gratis plaatsbezoek, dan de offerte. AB-feiten: 24 uur = zijn woord voor AB (2 nov, offerte binnen 24 uur; contact
       binnen 24 uur valt daarbinnen); gratis plaatsbezoek = het aanbod van de AB-bedankpagina; "via WhatsApp of" blijft weg (geen AB-bron).
       Was: "Analyse door onze dakexpert" + "Uw offerte binnen 24 uur" (5 nov). */
    volgt: [
      { titel: 'Wij nemen binnen 24 uur contact op', tekst: 'Onze dakexpert bekijkt uw aanvraag en neemt binnen 24 uur contact met u op om een plaatsbezoek af te spreken.' },
      { titel: 'Gratis plaatsbezoek', tekst: 'We bekijken uw dak ter plaatse, gratis en vrijblijvend.' },
      { titel: 'Uw offerte', tekst: 'U ontvangt uw offerte rechtstreeks in uw mailbox. Volledig vrijblijvend.' },
    ],
    /* 7 nov 2026, zoals bfbouw.be: de offerte volgt na het plaatsbezoek; binnen 24 uur = het contact (was 'Offerte binnen 24 uur'). */
    trigger: 'Antwoord binnen 24 uur',
    naarKnop: 'Offerte aanvragen',
    /* De vinkjes en de trustrij van de rekenaarkaart die hier stond (13 okt). Alleen "Gratis & vrijblijvende richtprijs"
       werd "... dakinspectie": er is geen richtprijs meer, wel de gratis dakinspectie (kop van de kaart en van het slotblok). */
    /* 29 okt 2026, Mohammed: "doe gewoon meer badges als in, weet de exacte staat van uw dak". */
    /* 2 nov 2026, zoals bfbouw.be 31 okt: "Weet de exacte staat van uw dak" (inspectiebelofte) weg, dakinspectie -> offerte.
       "Antwoord binnen 24 uur" van bfbouw.be NIET: een termijn voor AB heeft geen bron (Mohammed 22 okt voor AB: geen termijn). */
    /* 3 nov 2026, Mohammed: "bij abgroep aub dat puntje 6btw bij woningen ouder dan 10j in de hero weg". */
    /* 5 nov 2026, zoals bfbouw.be ("Vrijblijvende offerte"; "gratis" staat al in de kaartkop). */
    vertrouwen: ['Vrijblijvende offerte', 'Vakmanschap tot in de details'],
    /* 2 nov 2026, zoals bfbouw.be 31 okt: geen tweede route "Weet u al ... Klik dan hier" meer; de kaart zelf is de offerteaanvraag. */
    /* 22 okt 2026, Mohammed (21 okt gevraagd, toen alleen op de renovatiepagina's gezet; 22 okt: "je hebt veel vergeten", "DIE FORMS",
       "die visuele dingetjes", "EN TIS ENKEL lp dakwerken en lp totaalrenovatie"): hetzelfde als op /lp/totaalrenovatie.
       Trust badges: tegels met iconen, zelfde teksten en cijfers; schild bij de garantie, kalender bij de jaren ervaring. */
    trustrij: [{ b: '10 jaar', s: 'garantie', icoon: 'schild' }, { b: '15 jaar', s: 'ervaring', icoon: 'kalender' }],
    badges: true,
    /* "verwijder email form, verwijder postcode form": de contactstap heeft alleen nog Naam* en Gsm*.
       2 nov 2026: E-mailadres* terug voor de offerte, zoals bfbouw.be 31 okt (Mohammed: "doe ook een vakje emailadres bij de
       offerte aanvraag indiening"). Postcode blijft weg (zijn AB-keuze van 22 okt). */
    contactVelden: { email: 'verplicht', postcode: false },
    /* 2 nov 2026: geen disclaimer-vinkjes meer op de laatste stap, zoals bfbouw.be 31 okt ("geen inspectie of plaatsbezoek voor het
       versturen"); de drie punten van 22/26 okt ("Laat uw dak vakkundig controleren" ...) beloofden de inspectie. */
    /* "onderaan ... de form zo dat je makkelijk kan klikken": onderaan dezelfde klikkaart in plaats van het formulier van Inspectie. */
    onder: true,
    /* 2 nov 2026: de regel "5,0 op Google · Gratis en vrijblijvend" onder de verzendknop is weg: de knop zegt nu zelf "Gratis en
       vrijblijvende offerte aanvragen" en de Google-score staat in de trustrij eronder (bfbouw.be: geen zin onder de knop, 31 okt
       "trust badges voelen heel dubbel"). */
  },

  rekenaar: {
    /* Overgenomen van de calculator van Recotex (calculator.recotex.be/dakwerken,
       23 sep 2026): soort dak, bedekking, grootte, isolatie, asbest. Simpeler
       gemaakt: de grootte als knoppen in plaats van een schuifbalk, geen
       tussenvraag naar het type pan of isolatie. Als zesde vraag de start,
       zodat AB de dringende aanvragen eerst kan bellen.
       Bij plat dak Mohammeds eigen keuzes (bitumen, roofing, EPDM).
       Kop en slotregel (24 sep, Mohammed: "duidelijk voor de bezoeker dat ze
       daar de prijs kunnen berekenen in 2 minuten"; referentie Airadvisor:
       de uitkomst zichtbaar aan het einde van de balk, een geruststelling
       bij de knop). */
    titel: 'Bereken uw dakprijs',
    /* 4 okt, Mohammed: "de calculator, bereken uw dakprijs, klaar in 2 minuten, vrijblijvend",
       daarna "trust signals erbij": "gratis & vrijblijvende richtprijs", "begeleiding bij premie-aanvragen". */
    tijd: 'Klaar in 2 minuten, vrijblijvend',
    zeker: 'Gratis en vrijblijvend',
    /* 13 okt, Mohammed: "google logo in de rekenaar form, en 10j garantie, 15 jaar ervaring in de blokje van dakwerken
       rekenaar, zoals bij bfbouw". 10 jaar garantie staat nu in de trustrij, dus niet meer bij de vinkjes. Premiepuntje ->
       "Vakmanschap tot in de details" (zijn keuze, doorgegeven via de BF-chat). Bron 15 jaar: Mohammed ("meer dan 15 jaar
       ervaring in dakwerken", waarom-tekst hieronder). */
    vertrouwen: ['Gratis & vrijblijvende richtprijs', 'Vakmanschap tot in de details', '6% btw-tarief (woningen > 10 jaar)'],
    trustrij: [{ b: '10 jaar', s: 'garantie' }, { b: '15 jaar', s: 'ervaring' }],
    vragen: [
      /* Geen hellingshoek meer onder hellend en plat (Mohammed, 24 sep: "mensen
         weten wat een hellend dak is en plat dak"); de foto zegt het al. */
      { sleutel: 'Dak', vraag: 'Welk soort dak heeft u?', keuzes: [
        { label: 'Hellend dak', foto: keuzeHellend },
        { label: 'Plat dak', foto: keuzePlat },
      ] },
      /* Mohammed, 24 sep: "na vraag 1 moet er eerst zijn: herstelling,
         renovatie, isolatie, en dan pas de rest". Elk antwoord heeft een eigen
         vervolg: bij herstelling vragen we wat er NU op het dak ligt, bij
         isolatie vervalt de bedekking en de vraag of er isolatie nodig is. */
      /* Volgorde (Mohammed, 1 okt 2026): renovatie, isolatie, herstelling. */
      /* 6 okt, Mohammed: "voeg optie toe nieuw dak ... moet je dus hebben, nieuw dak, renovatie,
         isolatie, herstelling". Nieuw dak volgt het pad van renovatie: met of zonder isolatie, en
         welke bedekking hij wenst. Icoon: het huis met de plus van de dienstkaart "Nieuw dak". */
      { sleutel: 'Werk', vraag: 'Wat moet er aan uw dak gebeuren?', keuzes: [
        { label: 'Nieuw dak', icoon: 'dienst-nieuw' }, { label: 'Renovatie', icoon: 'nieuwdak' },
        { label: 'Isolatie', icoon: 'isolatie' }, { label: 'Herstelling', icoon: 'herstel' },
      ] },
      /* Mohammed, 27 sep: "als je klikt op herstelling of renovatie, dat je kan kiezen, met
         isolatie of zonder", want "nu is isolatie enkel en alleen apart". De keuze staat dus meteen
         na herstelling of renovatie; wie "Isolatie" koos, krijgt ze niet.
         Premie (26 sep): de melding verschijnt bij "Met isolatie", want isolatie is de voorwaarde
         (Rd 4,5). Bron: vlaanderen.be, Mijn VerbouwPremie voor dak, aanvragen vanaf 1 maart 2026:
         categorie 4 50% (max. 5.750 euro), categorie 3 35% (max. 4.025 euro), 1 en 2 niets meer. */
      { sleutel: 'Isolatie', vraag: 'Wilt u het dak ook laten isoleren?', als: { Werk: ['Herstelling', 'Renovatie', 'Nieuw dak'] },
        tip: { bij: ['Met isolatie'], tekst: 'Met isolatie komt uw dak in aanmerking voor Mijn VerbouwPremie: bij inkomenscategorie 3 of 4 tot 50% van de factuur terug, maximaal € 5.750.' }, keuzes: [
        { label: 'Met isolatie', uitleg: 'het dak wordt mee geïsoleerd', icoon: 'isolatie' },
        { label: 'Zonder isolatie', uitleg: 'enkel de dakwerken', icoon: 'geenisolatie' },
      ] },
      /* Mohammed, 24 sep: "doe ook vraag hoe oud is uw dak", met na het antwoord
         de btw-melding klein in het formulier, "zodat ze verder gaan met de
         vragen". Een dak ouder dan tien jaar ligt op een woning ouder dan tien
         jaar, en dat is de voorwaarde voor 6% btw bij renovatie. De melding zegt
         "15% minder btw" (21% wordt 6%); "15% op uw totale factuur" klopt niet:
         op €10.000 werk is het verschil €1.500, 12,4% van de factuur. */
      /* Twee keuzes (Mohammed, 24 sep: "jonger dan 10 jaar en ouder dan 10
         jaar, meer moeten we niet weten"): de grens is die van de 6% btw. */
      { sleutel: 'Leeftijd', vraag: 'Hoe oud is uw dak?', keuzes: [
        { label: 'Jonger dan 10 jaar', icoon: 'jong' }, { label: 'Ouder dan 10 jaar', icoon: 'oud' },
      ], tip: { bij: ['Ouder dan 10 jaar'], tekst: 'Dankzij de wettelijke 6% btw-regeling betaalt u 15% minder btw op uw factuur.' } },
      { sleutel: 'Bedekking', vraag: 'Welke dakbedekking wenst u?', als: { Dak: ['Hellend dak'], Werk: ['Renovatie', 'Nieuw dak'] }, keuzes: [
        { label: 'Gegolfde pannen', icoon: 'golfpan' }, { label: 'Vlakke pannen of leien', icoon: 'vlakkepan' },
        { label: 'Golfplaten', icoon: 'golfplaat' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Wat wilt u op uw plat dak?', als: { Dak: ['Plat dak'], Werk: ['Renovatie', 'Nieuw dak'] }, keuzes: [
        { label: 'Bitumen', icoon: 'bitumen' }, { label: 'Roofing', icoon: 'roofing' },
        { label: 'EPDM', icoon: 'epdm' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Welke dakbedekking ligt er nu?', als: { Dak: ['Hellend dak'], Werk: ['Herstelling'] }, keuzes: [
        { label: 'Gegolfde pannen', icoon: 'golfpan' }, { label: 'Vlakke pannen of leien', icoon: 'vlakkepan' },
        { label: 'Golfplaten', icoon: 'golfplaat' }, { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Wat ligt er nu op uw plat dak?', als: { Dak: ['Plat dak'], Werk: ['Herstelling'] }, keuzes: [
        { label: 'Bitumen', icoon: 'bitumen' }, { label: 'Roofing', icoon: 'roofing' },
        { label: 'EPDM', icoon: 'epdm' }, { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Grootte', vraag: 'Hoe groot is het dak?', keuzes: [
        { label: 'Kleiner dan 50 m²', icoon: 'maat1' }, { label: '50 tot 100 m²', icoon: 'maat2' },
        { label: '100 tot 150 m²', icoon: 'maat3' }, { label: 'Groter dan 150 m²', icoon: 'maat4' },
        { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Asbest', vraag: 'Is er asbest aanwezig in het dak?', keuzes: [
        { label: 'Ja, vermoedelijk', icoon: 'asbest' }, { label: 'Nee', icoon: 'veilig' }, { label: 'Weet ik niet zeker', icoon: 'twijfel' },
      ] },
      /* 1 okt, Mohammed: "doe bij deze stap duidelijk een puntje gratis en vrijblijvend". */
      { sleutel: 'Start', vraag: 'Wanneer wilt u beginnen?', punt: 'Gratis en vrijblijvend', keuzes: [
        /* 30 sep, Mohammed: "duidelijker, zo snel mogelijk, dit jaar, volgend jaar".
           1 okt: "verwijder aub de optie ik verken nog", dus drie keuzes.
           3 okt: "voeg de optie ik verken nog ook gewoon terug toe". */
        { label: 'Zo snel mogelijk', icoon: 'snel' }, { label: 'Dit jaar', icoon: 'drie' },
        { label: 'Volgend jaar', icoon: 'later' }, { label: 'Ik verken nog', icoon: 'verken' },
      ] },
    ],
    gerust: 'Weet u het niet zeker? Een schatting volstaat.',
    /* Mohammed, 26 sep: "waar mogen we de berekening naartoe verzenden?", ook op dakwerken. */
    uitkomstKop: 'Waar mogen we de berekening naartoe verzenden?',
    uitkomstOnder: 'Wij bezorgen u uw richtprijs zo snel mogelijk.',
    knop: 'Ontvang mijn richtprijs',
    /* Drie zekerheden net boven de knop (Mohammed, 28 sept). Bron: 10 jaar garantie
       en vaste prijs staan op deze pagina en de bedankpagina. */
    troeven: ['Gratis en vrijblijvend', 'Vaste prijs, geen verrassingen', '10 jaar garantie'],
  },

  waarom: {
    kop: 'Waarom AB Bouw Groep',
    /* Mohammeds eigen zin (22 sep 2026), alleen het open woord ingevuld
       ("van topkwaliteit"; "waterdicht" kon letterlijk gelezen
       worden, "degelijk" overtuigde niet). Vier eigen varianten met beeldspraak zijn afgekeurd:
       een zakelijke belofte hier, geen zin die moet "landen".
       "meer dan 15 jaar" komt van Mohammed zelf. */
    tekst: 'Een dak vernieuwt u één keer en vervolgens moet het decennia meegaan. Daarom is het belangrijk dat u een aannemer kiest die het vak kent. Met meer dan 15 jaar ervaring in dakwerken staan we garant voor een eindresultaat van topkwaliteit. U kan rekenen op een zorgeloos traject van A tot Z.',
    redenen: [
      { titel: '10 jaar garantie', tekst: 'Tien jaar garantie op dakrenovatie. We zijn volledig verzekerd en VCA-gecertificeerd.' },
      /* 13 okt, Mohammed: de kaart "Vrijblijvende offerte en dakinspectie" weg ("haal dat puntje weg zelfs, eigenlijk twee is genoeg"). */
      /* Mohammed, 23 sep 2026: 'volledige premiebegeleiding, Mijn VerbouwPremie, zoals
         Kijzer ook doet'. Kijzer noemt het 'Premieservice' en 'volledige omkadering
         met hulp bij premie aanvragen'. Geen bedragen: die hangen af van inkomen en
         werk, en de regels veranderen (gevelpremie weg sinds 1 maart 2026). */
      { titel: 'Volledige premiebegeleiding', tekst: 'Wij regelen de aanvraag van uw Mijn VerbouwPremie. Wordt uw dak mee geïsoleerd, dan krijgt u bij inkomenscategorie 3 of 4 tot 50% van de factuur terug, maximaal € 5.750.' },
    ],
    /* Boven: de dakwerker zelf aan het werk. Dit blok verkoopt de mensen, dus
       hoort er een mens in beeld en geen vierde gevelfoto. Hier stond eerst
       lp-real-det-1, en dat bestand bleek op een pixelvergelijking hetzelfde
       frame als de eerste hero-dia (verschil 1,8 van 255): dezelfde woning
       stond dus twee keer op één pagina. */
    /* Mohammed, 1 okt 2026: "dakwerken als bovenste, dakwerken roof als onderste"
       (Downloads/dakwerken.jpg en dakwerkenroof.jpg). */
    duo: [
      { src: waaromDakwerker, alt: 'Dakwerker die nieuwe antraciet pannen legt op de panlatten' },
      { src: waaromPannendak, alt: 'Pannendak met rode keramische pannen en zinken goot' },
    ],
  },

  /* Mohammed, 26 sep: "voeg ... net onder waarom en boven diensten sectie een sectie,
     voordelen van dakrenovatie, minder stookkost, vermijd schade aan uw dak en
     investering in de waarde van uw woning en wooncomfort", "met de nodige juiste
     iconen, graag in bolvorm en met verschillende bijpassende kleuren", "bij elk
     bolletje een korte uitleg erbij".
     27 sep: titel 2 is zijn zin ("vermijd duizenden euros aan schade"); punt 3 "is echt niet
     overtuigend", dus een feit met bron: Nationale Bank met KU Leuven en UAntwerpen
     (VRT NWS, 14 jan 2025, cijfers 2016-2022): label F gaat 10% goedkoper van de hand,
     label A 13% duurder. De drie teksten zijn even lang, zodat de kaarten gelijk lopen. */
  /* 2 nov 2026 (omvormen zoals bfbouw.be): de drie voordelen van zijn dictaat van 31 okt voor bfbouw.be/lp/dakwerken ("bij de 3
     voordelen aub, en dan ook de iconen aanpassen"), woordelijk; kop zoals daar. Geen bedrijfsclaims: de teksten gaan over het dak.
     Iconen zoals bfbouw.be (vernieuwd dak, isolatie, water): uit de eigen set. */
  voordelen: {
    kop: 'De voordelen van een dakrenovatie',
    lijst: [
      { icoon: 'dienst-renovatie', kleur: 'oranje', titel: 'Een dak dat weer tientallen jaren meegaat', tekst: 'Wij zorgen voor een strakke afwerking met pannen, leien of roofing die passen bij uw woning. Uw huis ziet er direct weer verzorgd uit en is klaar voor de toekomst.' },
      { icoon: 'dienst-isolatie', kleur: 'blauw', titel: 'Minder warmteverlies, lagere stookkosten', tekst: 'Een nieuw dak met goede isolatie houdt de warmte binnen in de winter en buiten in de zomer. Dat merkt u direct aan het comfort in huis én op uw energiefactuur.' },
      { icoon: 'voordeel-schade', kleur: 'groen', titel: 'Voorkom dure vocht- en gevolgschade', tekst: 'Een verschoven pan of een scheur in de roofing laat ongemerkt regenwater binnen. Door op tijd te renoveren, voorkomt u houtrot in uw dakconstructie en vochtplekken binnen.' },
    ],
  },

  /* Mohammed, 25 sep: "onder de sectie waarom ab bouw groep 1 korte diensten sectie,
     diensten met mooie iconen gewoon, naam, en de nodige tekst", daarna "de
     diensten moeten zijn, nieuw dak, dakrenovatie, dakisolatie, dakherstelling"
     en "er zijn genoeg mensen dat nieuw dak willen ipv renovatie".
     Bron van de teksten: de dakwerkenpagina van AB zelf (_divisies.ts: "volledig
     afgebroken en opnieuw opgebouwd, met nieuw onderdak"; "onderdak, tengels en
     panlatten"). De bedekkingen van een plat dak zijn de keuzes uit de calculator.
     Nieuw dak: Mohammeds woorden "Volledig nieuw dak" (25 sep: "want anders haal
     je nieuwbouw eruit"). Bij een renovatie blijft de dakstructuur staan.
     Elke id is een anker voor een sitelink (/lp/dakwerken#nieuw-dak).
     2 okt, Mohammed: "nu zijn het gewoon zo lelijke vierkantjes op een scherm",
     "visueel mooier en beter, clean", "wees creatief". Elke dienst kreeg een foto
     (de conventie van de dienstkaarten op de homepage); het icoon valt dan weg.
     3 okt, Mohammed: "haal die fotos weg bij diensten, laat enkel die van dakrenovatie
     en isolatie". Nieuw dak en dakherstelling tonen hun icoon op een licht vlak.
     3 okt, Mohammed: "doe maar die twee fotos bij diensten ook weg". Alle vier tonen
     hun icoon op een licht vlak (vlakken: true). */
  diensten: {
    /* 7 nov 2026, zoals bfbouw.be (Mohammed daar: "Waar kunnen we jou mee helpen? ipv onze diensten"; u zoals op de hele pagina). */
    kop: 'Waar kunnen we u mee helpen?',
    vlakken: true,
    /* meer (2 nov 2026, zoals bfbouw.be 31 okt: Clarity toonde tikken op een dienstkaart die niets deden; Mohammed: "dienstkaarten
       moeten leiden naar info"): uitleg die openklapt in de kaart. Alleen wat de dienst is (werkwijze en materiaal, zoals de dienstrij
       van /dakwerken: "volledig afgebroken en opnieuw opgebouwd, met nieuw onderdak", "Ligt het dak toch open, dan brengen wij de
       isolatie in dezelfde werf aan", "van binnenuit of via sarking op het dakvlak"), geen beloftes of cijfers over AB. De premie:
       vlaanderen.be, Mijn VerbouwPremie dak vanaf 1 maart 2026 (categorie 3 en 4; 1 en 2 niets). Copy-guard groen op 2 nov. */
    lijst: [
      { id: 'nieuw-dak', icoon: 'dienst-nieuw', naam: 'Nieuw dak', tekst: 'Volledig nieuw dak, met pannen of leien, of als plat dak in EPDM, roofing of bitumen.',
        foto: { src: stockDienstNieuwDak, alt: 'Twee woningen in baksteen met een dak van donkere dakpannen en een dakraam' },
        /* 2 nov 2026, Mohammed: "bij de lees meer van de dienstenkaarten van ab, exacte copy als bf": woordelijk bfbouw.be DAK_TEKST
           (bouw/paginas.cjs, nieuw-dak, dakrenovatie) en zijn dictaat van 31 okt (UITLEG dakisolatie in bouw/lp-dak.cjs). */
        meer: ['Een nieuw dak bouwen wij voor nieuwbouw, of wanneer de oude dakstructuur vervangen moet worden. Het dak wordt dan volledig opgebouwd: structuur, isolatie, onderdak en dakbedekking.', 'U kiest de dakbedekking die bij uw woning past, bijvoorbeeld keramische pannen of leien.'] },
      { id: 'renovatie', icoon: 'dienst-renovatie', naam: 'Dakrenovatie', tekst: 'Uw dakstructuur blijft staan. Wij vernieuwen de pannen of leien, samen met het onderdak en de panlatten.',
        foto: { src: stockDienstRenovatie, alt: 'Vlakke rode kleipannen die over nieuwe panlatten gelegd worden' },
        meer: ['Bij een dakrenovatie blijft de dakstructuur staan. De oude pannen of leien en het oude onderdak gaan eraf, waarna de isolatie, het dampscherm, het onderdak, de panlatten en de nieuwe dakbedekking erop komen.', 'Is de dakstructuur nog gezond, dan is dit de manier om een ouder dak waterdicht en warm te maken.'] },
      { id: 'isolatie', icoon: 'dienst-isolatie', naam: 'Dakisolatie', tekst: 'Wij isoleren uw dak tijdens de renovatie of als aparte opdracht.',
        foto: { src: stockDienstIsolatie, alt: 'Zolder met isolatie met alufolie tegen de houten kepers en een dakraam' },
        meer: ['Verlaag uw energiefactuur direct. Wij isoleren uw dak volgens de huidige normen voor een optimaal wooncomfort, inclusief alle nodige attesten voor uw Mijn VerbouwPremie.'] },
      { id: 'herstelling', icoon: 'dienst-herstel', naam: 'Dakherstelling', tekst: 'Wij herstellen een lek of schade aan uw hellend of plat dak.',
        foto: { src: stockDienstHerstelling, alt: 'Dak in natuurleien met sneeuwvanger, zinken goot en regenpijp' },
        meer: ['Ziet u een vochtplek op het plafond, of ligt er na een storm een pan verschoven? Dan zoeken we eerst waar het water echt binnenkomt, want dat is vaak een eind verwijderd van de vlek. Zo herstellen we de oorzaak, en blijft uw plafond voortaan droog.'] },
    ],
  },

  /* 7 nov 2026, zoals bfbouw.be LP.uitleg en LP.zoek van 7 nov, woordelijk (Mohammed daar: "is er geen betere kandidaat voor een goede hoog sectie",
     "zoek bij competitors", "ook de exacte schrijfstijl punten en zinsopbouw"; "je gaat ervanuit dat een consument die woorden kent?"; "Wat houdt een
     dakrenovatie in? sluit toch nieuw dak mensen eruit"; "ja doe eens die ik ben op zoek naar"; "doe daarbij gratis dakinspectie"). Hier: "en doe al
     deze changes ook bij ab pagina". Geen AB-claim in de tekst: alleen wat er aan een dak gebeurt. Foto = de dakwerker van het waarom-blok
     (Mohammed 1 okt, Downloads/dakwerken.jpg). De knoppen vullen vraag 1 van de kaart onderaan in (LpBf, AanvraagStaat). */
  uitleg: {
    kop: 'Wat heeft uw dak nodig?',
    tekst: [
      'Alles begint met kijken in welke staat uw dak is. Soms volstaan nieuwe pannen of een nieuwe roofing, soms moeten ook het hout en de isolatie eronder vernieuwd worden, en soms is een volledig nieuw dak de beste keuze.',
      'Ligt uw dak open, dan is dat het ideale moment om meteen te isoleren. Zo gebeurt alles in één keer en moet uw dak later niet opnieuw open.',
    ],
    lijstKop: 'Wat de werken omvatten',
    lijst: [
      'De oude pannen of roofing eraf halen en afvoeren',
      'Het hout van uw dak nakijken en rot hout vervangen',
      'Een nieuwe waterdichte laag onder de pannen',
      'Isolatie, zodat uw zolder warm blijft in de winter en koel in de zomer',
      'Nieuwe pannen, leien of roofing',
      'Alles rond de schouw, de dakramen en de goten waterdicht afwerken',
    ],
    slot: 'Zo is uw dak weer waterdicht, goed geïsoleerd en klaar voor de komende decennia.',
    foto: { src: waaromDakwerker, alt: 'Dakwerker die nieuwe antraciet pannen legt op de panlatten' },
    zoek: { kop: 'Ik ben op zoek naar:', sleutel: 'Werk', knoppen: [
      { tekst: 'Dakrenovatie', label: 'Dakrenovatie', icoon: 'dienst-renovatie' },
      { tekst: 'Nieuw dak', label: 'Nieuw dak', icoon: 'dienst-nieuw' },
      { tekst: 'Dakisolatie', label: 'Isolatie', icoon: 'isolatie' },
      { tekst: 'Herstelling', label: 'Herstelling', icoon: 'herstel' },
      { tekst: 'Gratis dakinspectie', label: 'Gratis dakinspectie', icoon: 'inspectie' },
    ] },
  },

  /* 2 nov 2026 (zoals bfbouw.be zekerStrook, 31 okt "zekerheden na de reviews"): AB heeft geen reviewsectie, dus de strook staat
     direct onder het belblok, vóór het werk zelf (voor/na). Alleen AB-feiten met bron: vaste prijs (troeven van de dakrekenaar,
     Mohammed 28 sept), één vast aanspreekpunt (dictaat 4 okt, vinkje renovatiekaart), 10 jaar garantie (dictaat 13 okt, alleen dak).
     "Antwoord binnen 24 uur" van bfbouw.be niet: geen bron voor AB. */
  /* 7 nov 2026, zoals bfbouw.be 7 nov ("en doe al deze changes ook bij ab pagina"): vijf zekerheden die als band doorlopen (LpBf: loop bij meer
     dan drie). Mohammed daar: "Vaste prijs naar kwaliteitsmaterialen"; premiebegeleiding als vijfde ("volledige premiebegeleiding" = zijn woord
     voor AB, 23 sep); "Antwoord binnen 24 uur" = de regel boven de verzendknop. 10 jaar garantie blijft (AB, niet de 15 jaar van BF). */
  zekerheden: [
    { icoon: 'medaille', tekst: 'Kwaliteitsmaterialen' },
    { icoon: 'aanspreek', tekst: 'Eén vast aanspreekpunt' },
    { icoon: 'schild', tekst: '10 jaar garantie' },
    { icoon: 'klok', tekst: 'Antwoord binnen 24 uur' },
    { icoon: 'premie', tekst: 'Volledige premiebegeleiding' },
  ],
  /* 2 nov 2026 (zoals bfbouw.be 31 okt, Mohammed: "maak de pagina eens over het algemeen beter ingedeeld"): na het bewijs eerst wat AB
     doet, dan waarom AB en hoe het verloopt, de voordelen als laatste duw vlak voor het offerteblok. */
  /* 7 nov 2026, zoals bfbouw.be 7 nov: de foto's van het werk na de diensten (Mohammed daar: "verplaats recente daken naar sectie 4", "Na Onze
     diensten"), en "Wat heeft uw dak nodig?" (uitleg) op de plek van "Waarom AB Bouw Groep" (daar: "als het moet zelfs volledig die waarom bfb weg
     en een betere sectie"). */
  /* 8 nov 2026, Mohammed: "ik wil graag op de pagina zo een realisatie sectie maken met die realisatie" (de hoeve, realisatie-hoeve.ts): direct na de
     diensten, waar bfbouw.be zijn recente daken toont; de voor/na van het dak volgt erna. */
  realisatie: HOEVE,
  /* 8 nov 2026, Mohammed (localhost): "Tijdens de werken MAG ERuit, eronder en die slider ook": de voor/na-schuif ('voorna') onder de realisatie is weg.
     De gegevens blijven staan (type), de pagina toont ze niet. */
  volgorde: ['zekerheden', 'diensten', 'realisatie', 'uitleg', 'werkwijze', 'voordelen', 'faq'],

  /* 2 nov 2026, Mohammed: "op dakwerken eruit of doe simpelweg hoe lang duurt dakwerk gemiddeld en nog 2 nuttige vragen",
     "geen onnutige ai slop", "redeneer gewoon". Eerste versie afgekeurd ("nee ai slop copy", "let op de copy dat ik leverde",
     "doe onderzoek hoe een copy expert het aanpakt", "kijk naar talloze websites in dezelfde sector", "creeer vlotte copy").
     Tweede versie in de vorm van zijn goedgekeurde FAQ (totaalrenovatie, 5 okt): eerst het antwoord, dan de voorwaarde, dan wat
     we doen en wat de klant eraan heeft; korte en lange zinnen afgewisseld, "we" en "u". Duur geijkt op 22 Vlaamse dakwerkers
     (plat dak 1-2 dagen, hellend dak een week tot drie weken, herstelling één dag). Wonen en winter: de vragen die een eigenaar
     in november echt stelt. */
  /* 5 nov 2026 (Mohammed: "de exacte wijzigingen als bij bf", "ook bij die veelgestelde vragen"): de drie vragen van bfbouw.be/lp/dakwerken
     van 5 nov, woordelijk, eerste open, in de plaats van duur / thuis wonen / winter (2 nov). Bronnen zoals daar:
     - prijzen: tabel bobex.be/nl-be/dakwerken/dakrenovatie/ (ruwe HTML gelezen 5 nov 2026, excl. btw); 6% btw = wet;
     - premie: ruwe HTML vlaanderen.be/premies-voor-renovatie/mijn-verbouwpremie/mijn-verbouwpremie-voor-dak, gelezen 5 nov 2026
       (cat. 3: 35% max € 4.025; cat. 4: 50% max € 5.750; cat. 1 en 2 sinds 1 maart 2026 niets; enkel werken door een aannemer);
       "volledige premiebegeleiding" = Mohammed 23 sep 2026 voor AB (waarom-reden hierboven);
     - duur: sectorijk 22 Vlaamse dakwerkers (2 nov). Vaste spatie na €. */
  faq: {
    kop: 'Veelgestelde vragen',
    eersteOpen: false, // 8 nov 2026, Mohammed (AB localhost): "veelgestelde vragen eerste vraag niet automatisch open aub" (zoals bfbouw.be die dag)
    lijst: [
      { v: 'Wat kost een dakrenovatie?',
        a: 'De prijs hangt af van het type dak (plat of hellend), de oppervlakte, de staat van het dak en of er isolatie bij komt. Gemiddeld kost een dakrenovatie in België € 50 tot € 200 per m², exclusief btw. Vervangt u alleen de dakbedekking, dan rekent u voor een hellend dak op € 30 tot € 120 per m² en voor een plat dak op € 40 tot € 100. Met nieuwe isolatie erbij wordt dat € 80 tot € 170 voor een hellend en € 70 tot € 150 voor een plat dak, en moet ook het dakhout vernieuwd worden, dan zit u tussen € 150 en € 350 per m². Is uw woning ouder dan tien jaar, dan betaalt u 6% btw in plaats van 21%. Wilt u een prijs op maat voor uw dak?',
        link: 'Vraag dan een gratis offerte aan.' },
      { v: 'Kan ik een premie krijgen voor mijn dak?',
        a: 'Dat hangt af van uw inkomen. Valt u in inkomenscategorie 3 of 4, dan krijgt u via Mijn VerbouwPremie 35% (categorie 3) of 50% (categorie 4) van de factuur zonder btw terug voor de isolatie en renovatie van uw dak, tot maximaal € 4.025 of € 5.750. Voor categorie 1 en 2 is er sinds 1 maart 2026 geen dakpremie meer. De premie geldt alleen als een aannemer het werk uitvoert. Bij ons krijgt u volledige premiebegeleiding.' },
      { v: 'Hoe lang duurt een dakrenovatie?',
        a: 'Dat hangt vooral af van het soort dak en de grootte ervan. Een plat dak ligt er meestal in één tot twee werkdagen, een hellend dak van een gewone gezinswoning vernieuwen en isoleren duurt doorgaans één tot twee weken. U blijft intussen gewoon thuis wonen. Ligt het dak aan het einde van de werkdag nog open, dan dekken we het waterdicht af, zodat uw woning ook bij een regenbui \'s nachts droog blijft.' },
      /* 7 nov 2026, zoals bfbouw.be (vragen van Dakwerken Smet en Dakinvest). Garantie: 10 jaar (AB, dictaat 13 okt) + de wet (tienjarige
         aansprakelijkheid van de aannemer); "Ook na de werken blijven we bereikbaar" = het vaste aanspreekpunt (4 okt). */
      { v: 'Welke garantie geldt er op dakwerken?',
        a: 'U krijgt 10 jaar garantie. Voor structurele werken geldt daarnaast de wettelijke tienjarige aansprakelijkheid van de aannemer. Ook na de werken blijven we bereikbaar.' },
      { v: 'Moet mijn volledige dak altijd vernieuwd worden?',
        a: 'Niet altijd. Tijdens het plaatsbezoek bekijken we wat technisch nodig is en wat niet. Is het hout onder de pannen nog goed, dan vervangen we alleen wat versleten is. Is een groot deel versleten, dan raden we aan om het dak in één keer te vernieuwen.' },
    ],
  },

  voorna: {
    /* 3 nov 2026, Mohammed: "hetzelfde dak voor en na de werken ook, gewoon de foto laten, en de tekst erboven weg". */
    kop: '',
    onder: '',
    voor: { src: dakVoor, alt: 'Het dak met de pannen eraf: alleen het houten gebint staat er nog' },
    na: { src: dakNa, alt: 'Hetzelfde dak na de werken, met nieuwe pannen en dakvensters' },
    label: 'Hellend dak',
  },

  werk: {
    /* Geen kop: de foto's spreken voor zich (Mohammed, 23 sep). */
    kop: '',
    onder: '',
    fotos: [
      { src: antraciet, label: 'Antraciet pannendak', alt: 'Halfopen woning in rode baksteen met een nieuw antraciet pannendak' },
      { src: panRood, label: 'Rood pannendak', alt: 'Rijwoning met een nieuw rood pannendak en een dakvenster' },
      { src: platdak, label: 'Plat dak met EPDM', alt: 'Plat dak met EPDM en een lichtkoepel op een aanbouw achter een woning' },
      /* Drie tegels, één per daktype. De overige beelden tonen dezelfde
         woningen vanuit een andere hoek en lezen als herhaling. */
    ],
  },

  /* De reviews die al op de dakpagina's van abgroep.be staan (LpDienst:
     dakisolatie, velux, platdak) stonden hier. Ze staan NIET op het
     Google-profiel van AB (dat heeft één review, 5,0, van Tarik Azarkan,
     gecontroleerd 22 sep 2026). Zolang dat zo is blijft deze lijst leeg en
     toont de pagina de sectie niet. Echte reviews erin zetten is één regel. */
  reviews: {
    kop: 'Wat klanten schrijven',
    beeld: { src: antraciet3, alt: 'Nieuw antraciet dak op een halfopen woning in rode baksteen' },
    lijst: [],
  },

  /* 7 nov 2026, zoals bfbouw.be LP.stappenKop + LP.stappen van 7 nov (Mohammed daar: "de stappen ook aanpassen aub, ga kijken bij competitors",
     "Zo verloopt uw dakrenovatie" -> "DAT sluit uit isolatie en nieuw" -> "Zo werken wij"; "DOE" op premiebegeleiding in de laatste stap). Hier: "en doe
     al deze changes ook bij ab pagina". AB-feiten: 10 jaar garantie (dak, dictaat 13 okt), volledige premiebegeleiding (23 sep), vast aanspreekpunt
     (4 okt), vaste prijs (28 sept), gratis plaatsbezoek (bedankpagina). Was "Zo verloopt uw dakwerk" in 5 stappen (Aanvraag, Dakinspectie, Offerte,
     Uitvoering, Oplevering). */
  werkwijze: {
    kop: 'Zo werken wij',
    onder: '',
    stappen: [
      { titel: 'Plaatsbezoek', tekst: 'We bekijken uw dak ter plaatse, gratis en vrijblijvend, en bespreken uw wensen en budget.' },
      { titel: 'Offerte op maat', tekst: 'U ontvangt een duidelijke offerte met de werken, de materialen en een vaste prijs.' },
      { titel: 'Planning en uitvoering', tekst: 'Na uw akkoord plannen we de werken in. Op de afgesproken datum starten we, en we werken netjes en veilig.' },
      { titel: 'Oplevering en garantie', tekst: 'We overlopen samen elk detail. U krijgt 10 jaar garantie en volledige premiebegeleiding, en ook later kunt u bij uw vaste aanspreekpunt terecht.' },
    ],
  },

  cta: {
    /* 2 nov 2026, zoals bfbouw.be 31 okt (dictaat Mohammed: kop "Gratis offerte aanvragen"; was 'Gratis dakinspectie en offerte', 25 okt).
       5 nov 2026, zoals bfbouw.be LP.inspectie.kop (Mohammed daar: "andere gewoon offerte aanvragen"). */
    kop: 'Offerte aanvragen',
    naam: 'Gratis offerte', // regel in het CRM: "Aanvraag gratis offerte · Dak: ..."
    /* Mohammed: 'gratis dakinspectie onderaan moet duidelijker'. Wat de klant
       bij de inspectie krijgt, staat nu als drie vinkjes in plaats van in één
       lopende zin. Alles komt uit de werkwijze en de redenen hierboven. */
    /* 2 nov 2026: de punten van bfbouw.be (lpStappen, dictaat 31 okt), zonder "binnen 24u" (geen bron voor AB): het formulier zelf en
       wat de bezoeker krijgt. De dakinspectie komt pas na de aanvraag (bedankpagina). */
    tekst: '',
    /* 7 nov 2026, zoals bfbouw.be lpStappen: zelfde belofte als "Na uw aanvraag" (was 'U ontvangt een vrijblijvende offerte'). */
    punten: [
      'Beantwoord een paar korte vragen',
      'Wij nemen binnen 24 uur contact op',
    ],
    /* 13 okt 2026: stock in plaats van het gegenereerde pannenDicht. Niet daklijn: die is dia 1. Vier stockfoto's op
       vijf plekken (4 dia's + slotblok) geeft precies één herhaling, zoals voorheen (pannenDicht stond in dia 4 én hier).
       Zinkwerk: bestaande daken van rijwoningen ("we bekijken uw dak"), geen dak in opbouw dat als een eigen werf leest. */
    foto: { src: stockZinkwerk, alt: 'Daken van rijwoningen met twee dakramen, een zinken dakkapel en een dakkapel met pannen' },
  },

  inspectie: {
    kop: 'Plan uw dakinspectie',
    /* 23 okt 2026, Mohammed: "doe ook optimalisatie van de knoppen, wat de knoppen zeggen, om meer inzendingen te krijgen", "ga na WAT
       DE BESTE is", "doe goede research op alles". Onderzoek 23 okt (54 sites letterlijk gelezen + A/B-tests): de infinitief "aanvragen"
       zoals de Vlaamse bouwbedrijven (18 van 43; Dakrubbercentrale exact zo), het werkwoord is wat er echt gebeurt (aanvragen, daarna belt
       AB), "gratis" erin. "Bevestig" en "Plan" beloven een vast moment (0 van 54 sites met "Bevestig"); "Vraag mijn ... aan" mengt twee
       stemmen (0 van 46 Belgische sites). Ook de knop in het waarom-blok en de vaste knop (LpBf) dragen deze tekst. */
    /* 2 nov 2026: dictaat Mohammed 31 okt voor bfbouw.be, knoppen "Gratis en vrijblijvende offerte aanvragen" ("anders is het veel te
       veel gratis offerte"); de infinitief "aanvragen" van het onderzoek van 23 okt blijft. */
    /* 5 nov 2026, zoals bfbouw.be LP.kaart.knop: "Gratis offerte aanvragen" (Mohammed daar: herhaling van gratis en vrijblijvend wekt
       argwaan; "vrijblijvend" staat onder "Na uw aanvraag"). Alleen de verzendknop; de andere knoppen zeggen aanvraag.naarKnop. */
    knop: 'Gratis offerte aanvragen',
    /* 21 okt 2026, Mohammed, woordelijk: "onze dakexpert ... neemt zo snel mogelijk contact met u op" (zoals op bfbouw.be).
       2 nov 2026: zoals bfbouw.be 31 okt ("moet uiteraard iets anders worden, over de offerte dan"). */
    onder: 'Onze dakexpert contacteert u zo snel mogelijk over uw offerte.',
    alt: 'Liever eerst een prijs? Bereken hem in 2 minuten',
    /* 2 nov 2026: :offerte zoals bfbouw.be (lp:dakwerken:offerte). In GHL W01b gaat :offerte naar de standaard-sms ("bedankt voor uw
       aanvraag") i.p.v. K1c ("... voor de gratis dakinspectie"); api/stem.js leest alleen het voorvoegsel lp:dakwerken:. */
    bronLead: 'lp:dakwerken:offerte',
  },

  /* Message match (Mohammed, 26 sep: "voor de mensen die bijvoorbeeld klikken, bij die koppen,
     dat ze denken, ah, ik ben op de juiste website"). Volgorde telt: isolatie vóór plat, want
     "plat dak isoleren" is een isolatievraag. Isolatie, renovatie en nieuw vragen het woord
     dak erbij: "badkamer renoveren" of "gevel isoleren" houdt de standaardkop. */
  boodschap: [
    /* 4 okt: de varianten volgen Mohammeds nieuwe kop; alleen het dakwoord wisselt. */
    /* 20 okt 2026: de varianten volgen de kop "Dé specialist voor [uw nieuwe dak]"; alleen het dakwoord wisselt.
       voor (vraag 1 van de aanvraagkaart) blijft. */
    /* 26 okt 2026, Mohammed: sitelink "Stormschade Dakherstel" (?dienst=stormschade) krijgt een kop die erbij past. */
    /* 2 nov 2026 (zoals bfbouw.be 31 okt: één kop voor alle varianten): de kop noemt vernieuwen, renoveren en isoleren, de subkop
       platte en hellende daken; die varianten houden de gewone kop (en vraag 1 vooraf waar de zoekterm het daktype zegt). Alleen
       herstel/stormschade krijgt een eigen kop in dezelfde vorm: de gewone kop noemt herstellen niet. Copy-guard groen op 2 nov. */
    { zoek: 'storm|herstel', kop: 'Uw dak laten [herstellen] na stormschade?' },
    { zoek: 'dak.*isol|isol.*dak|sarking', kop: DAK_KOP },
    { zoek: 'plat|epdm|roofing|bitumen', kop: DAK_KOP, voor: { sleutel: 'Dak', label: 'Plat dak' } },
    { zoek: 'hellend|pannen|leien|sarking', kop: DAK_KOP, voor: { sleutel: 'Dak', label: 'Hellend dak' } },
    { zoek: 'dak.*renov|^renovatie$', kop: DAK_KOP },
    { zoek: 'dak.*(nieuw|vervang)|(nieuw|vervang).*dak', kop: DAK_KOP },
  ],
};

/* /lp/dakwerken/asbest (2 nov 2026, Mohammed: "en dan die aparte sublp voor asbest"; zoals bfbouw.be /lp/dakwerken/asbest/ van
   30-31 okt): de dakpagina met een eigen kop en subkop voor wie op een asbest-zoekwoord klikt, en de asbestvraag vooraf op Ja (een
   stap minder). Kop woordelijk de BF-kop van 31 okt ("De specialist voor uw asbestdak"). Subkop in de vorm van de BF-subkop, zonder
   "onze ploeg haalt eraf": wie het asbest verwijdert, staat voor AB niet in een bron. Bron in GHL lp:dakwerken-asbest:offerte (W01b
   standaard-sms); bedankpagina en conversietags die van /lp/dakwerken. */
export const DAKWERKEN_ASBEST: KgjInhoud = {
  ...DAKWERKEN,
  titel: 'De specialist voor uw asbestdak | AB Bouw Groep',
  omschrijving: 'Uw asbestdak vervangen door een nieuw dak. Vraag uw gratis offerte aan bij AB Bouw Groep, werken aan 6% btw.',
  hero: {
    ...DAKWERKEN.hero,
    kop: 'De specialist voor [uw asbestdak]',
    /* 5 nov 2026, zoals bfbouw.be asbest.sub ("vraag nu uw offerte aan"). */
    onder: 'Wij vervangen uw asbestdak door een nieuw dak, vraag nu uw offerte aan.',
  },
  inspectie: { ...DAKWERKEN.inspectie, bronLead: 'lp:dakwerken-asbest:offerte' },
  /* de asbestvraag valt weg: haar antwoord (Ja) staat vooraf in de aanvraag (voorAf + beginStand) */
  aanvraag: DAKWERKEN.aanvraag && { ...DAKWERKEN.aanvraag,
    vragen: DAKWERKEN.aanvraag.vragen.map((v) => (v.sleutel === 'Asbest' ? { ...v, nietAls: { ...(v.nietAls ?? {}), Asbest: ['Ja'] } } : v)) },
  boodschap: undefined,
  voorAf: { sleutel: 'Asbest', label: 'Ja' },
};
