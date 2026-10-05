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
import heroNok from '@/assets/dak/hero-antraciet-nok.jpg';
import waaromDakwerker from '@/assets/dak/waarom-dakwerker.jpg';
import waaromPannendak from '@/assets/dak/waarom-pannendak.jpg';
import antraciet3 from '@/assets/dak/lp-real-det-3.jpg';
import platdak from '@/assets/dak/platdak-tegel.jpg';
import droneAntraciet from '@/assets/dak/drone-antraciet.jpg';
import pannenDicht from '@/assets/dak/hellend-pannen.jpg';
import dakVoor from '@/assets/lp-diensten/dak-voor.jpg';
import dakNa from '@/assets/lp-diensten/dak-na.jpg';
/* Foto's bij de eerste calculatorvraag (Mohammed, 24 sep). Hellend: de
   dakwerkenfoto van getnorvo.com (norvo-website sectoren/niche-dak.jpg).
   Plat: een plat dak op de achterbouw van een rijwoning
   (generated-final/set/platdak-na.jpg). Uitsneden 16:9, 640x360. */
import keuzeHellend from '@/assets/dak/keuze-hellend.jpg';
import keuzePlat from '@/assets/dak/keuze-plat.jpg';

import type { IcoonNaam } from './Iconen';

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
  tip?: { bij: string[]; tekst: string };
  /** Op een telefoon twee tegels naast elkaar in plaats van één kolom (alleen voor korte labels). */
  raster?: boolean;
  /** Afvinkvraag: meerdere keuzes, met een knop Volgende. `alles` is het label van
      het vakje bovenaan dat alle keuzes in één keer aanvinkt. */
  afvinken?: { alles: string; tip?: { bij: string[]; tekst: string } };
  /** Een zekerheid als bulletpoint onder de keuzes van deze vraag (zelfde stijl als de
      troeven op de laatste stap). De regel onderaan de kaart valt dan weg, anders staat
      hij er twee keer. */
  punt?: string;
};
export type Foto = { src: string; alt: string };
export type Review = { tekst: string; naam: string; bron: string };

export type Sectie = 'waarom' | 'voordelen' | 'diensten' | 'werkwijze' | 'uitgevoerd' | 'voorna' | 'reviews' | 'vangnet' | 'faq';

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
  hero: { kop: string; ondertitel?: string; onder: string; bewijs: string[]; dias: (Foto & { pos?: string })[];
    knop?: { tekst: string; onder: string } };
  /** Smalle donkere balk boven de kop, gevolgd door het telefoonnummer (totaalrenovatie, 5 okt). */
  topbalk?: string;
  /** titel + tijd: kop van de calculator boven de voortgang; zeker: de regel onderaan de kaart. */
  rekenaar: { titel: string; tijd: string; zeker: string; vragen: Vraag[]; gerust: string; uitkomstKop: string; uitkomstOnder: string; knop: string; troeven?: string[];
    /** Trust signals onderaan de kaart, met vinkje; vervangen de regel `zeker` (dakwerken, 4 okt). */
    vertrouwen?: string[] };
  /** tegenover: de zin boven de redenen; dan staat de tekst (de frustratie) links in een
      donker vak en de redenen (de oplossing) rechts, zonder foto's (totaalrenovatie, 5 okt). */
  /** kolommen: alleen de kop en de redenen, als drie kolommen met icoon (gestripte
      totaalrenovatie, 5 okt); gaat voor `tegenover`. */
  waarom: { kop: string; tekst: string; redenen: { titel: string; tekst: string }[]; duo: [Foto, Foto]; tegenover?: string; kolommen?: boolean };
  /** Diensten onder "Waarom": id is het anker voor een sitelink (/lp/dakwerken#nieuw-dak). */
  /** onder: optionele zin onder de kop. Een lege tekst toont alleen icoon en naam (totaalrenovatie, 27 sep).
   *  foto: met een foto wordt de dienst een fotokaart zonder icoon (dakwerken, 2 okt).
   *  vlakken: kaarten met het icoon op een groot licht vlak, ook zonder foto (dakwerken, 3 okt). */
  diensten: { kop: string; onder?: string; vlakken?: boolean; lijst: { id: string; icoon: IcoonNaam; naam: string; tekst: string; foto?: Foto }[] };
  /** Voordelen tussen "Waarom" en de diensten: elk voordeel een gekleurde bol met icoon. */
  voordelen?: { kop: string; lijst: { icoon: IcoonNaam; kleur: 'oranje' | 'blauw' | 'groen'; titel: string; tekst: string }[] };
  /** Veelgestelde vragen vlak voor het slotblok; alleen op pagina's die ze invullen (29 sep). */
  faq?: { kop: string; lijst: { v: string; a: string }[] };
  /** meer: nog andere voor/na-paren; de schuif krijgt dan pijlen (29 sep). */
  voorna: { kop: string; onder: string; voor: Foto; na: Foto; label: string; meer?: { voor: Foto; na: Foto; label?: string }[] };
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
  werkwijze: { kop: string; onder: string; stappen: { titel: string; tekst: string }[] };
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
  inspectie: { kop: string; knop: string; onder: string; alt: string; bronLead: string;
    extra?: { naam: string; label: string; opties: string[] }[];
    plaatsbezoek?: { naam: string; naamHint: string; email: string; emailHint: string; gsm: string; gsmUitleg: string; gsmHint: string; postcode: string; postcodeHint: string };
    vertrouwen?: { icoon: 'slot' | 'telefoon' | 'euro'; tekst: string }[] };
  /** Message match (Mohammed, 26 sep): wie via een advertentie of sitelink komt, ziet een kop
      die past bij wat hij zocht. `zoek` is een regex, apart getoetst op dienst=, dak= en utm_term;
      voor de kop wint die volgorde (LpKgj.tsx). `voor` beantwoordt vraag 1 al (Terug blijft werken). */
  boodschap?: { zoek: string; kop: string; voor?: { sleutel: string; label: string } }[];
};

export const DAKWERKEN: KgjInhoud = {
  /* Mohammed, 25 sep: de tekst in het tabblad "moet gaan over het vak", niet over prijs. */
  titel: 'Dé specialist voor uw dakwerk | AB Bouw Groep',
  /* 24 sep: "zes antwoorden" klopt niet meer (6 tot 8 vragen per pad) en
     "binnen één werkdag" is als belofte van de pagina gehaald. */
  omschrijving: 'Bereken in 2 minuten de prijs van uw dak. Gratis dakinspectie en offerte, werken aan 6% btw.',
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
    kop: 'Bereken in [2 minuten] de richtprijs van uw dak',
    /* Mohammeds eigen zin, letterlijk (24 sep): "doe daar gewoon subheadline
       van de specialisatie". De vorige subkop ("u weet direct wat het kost",
       daarna "wij bellen u met de prijs") ging over de calculator, die ernaast
       staat en zichzelf uitlegt. */
    /* 4 okt, Mohammed: "subheadline, beantwoord 8 korte vragen voor een heldere en vrijblijvende
       prijsindicatie van uw dakrenovatie". Het pad van een dakrenovatie telt 8 vragen. */
    /* 4 okt, plan mobiele hero: subheadline "Snel, gratis en 100% vrijblijvend." (vervangt de zin met het aantal vragen). */
    onder: 'Snel, gratis en 100% vrijblijvend.',
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
    dias: [
      /* 29 sep, Mohammed: de eerste foto "vind ik maar niks", vervangen door een
         echte foto uit de afbeeldingen van de Google Ads-campagne Dakrenovatie
         (pimgad 10985073941082978780, 1200x1200): "deze is mooi ... zet juist".
         pos 15%: in de brede hero blijft de nok met de lucht erboven in beeld. */
      { src: heroNok, pos: '50% 15%', alt: 'Nieuw antraciet pannendak met de nok tegen een blauwe lucht' },
      { src: panRood, alt: 'Rijwoning met een nieuw rood pannendak en een dakvenster' },
      /* Het platte dak staat niet in de diashow: van dichtbij is het een zwart
         vlak van rand tot rand, en onder de donkere laag leek de hero dan leeg.
         Het staat wel als werktegel. */
      { src: droneAntraciet, alt: 'Dronefoto boven een nieuw antraciet pannendak' },
      { src: pannenDicht, alt: 'Nieuw hellend dak met pannen, schuin van onderaf' },
    ],
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
    vertrouwen: ['Gratis & vrijblijvende richtprijs', 'Begeleiding bij premie-aanvragen', '6% btw-tarief (woningen > 10 jaar)', '10 jaar garantie'],
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
      { sleutel: 'Werk', vraag: 'Wat moet er aan uw dak gebeuren?', keuzes: [
        { label: 'Renovatie', icoon: 'nieuwdak' }, { label: 'Isolatie', icoon: 'isolatie' },
        { label: 'Herstelling', icoon: 'herstel' },
      ] },
      /* Mohammed, 27 sep: "als je klikt op herstelling of renovatie, dat je kan kiezen, met
         isolatie of zonder", want "nu is isolatie enkel en alleen apart". De keuze staat dus meteen
         na herstelling of renovatie; wie "Isolatie" koos, krijgt ze niet.
         Premie (26 sep): de melding verschijnt bij "Met isolatie", want isolatie is de voorwaarde
         (Rd 4,5). Bron: vlaanderen.be, Mijn VerbouwPremie voor dak, aanvragen vanaf 1 maart 2026:
         categorie 4 50% (max. 5.750 euro), categorie 3 35% (max. 4.025 euro), 1 en 2 niets meer. */
      { sleutel: 'Isolatie', vraag: 'Wilt u het dak ook laten isoleren?', als: { Werk: ['Herstelling', 'Renovatie'] },
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
      { sleutel: 'Bedekking', vraag: 'Welke dakbedekking wenst u?', als: { Dak: ['Hellend dak'], Werk: ['Renovatie'] }, keuzes: [
        { label: 'Gegolfde pannen', icoon: 'golfpan' }, { label: 'Vlakke pannen of leien', icoon: 'vlakkepan' },
        { label: 'Golfplaten', icoon: 'golfplaat' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Wat wilt u op uw plat dak?', als: { Dak: ['Plat dak'], Werk: ['Renovatie'] }, keuzes: [
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
      { titel: 'Vrijblijvende offerte en dakinspectie', tekst: 'We komen langs en voeren een vrijblijvende dakinspectie uit.' },
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
  voordelen: {
    kop: 'Voordelen van dakrenovatie',
    lijst: [
      { icoon: 'voordeel-stook', kleur: 'oranje', titel: 'Minder stookkost', tekst: 'Warme lucht stijgt en verdwijnt langs het dak. Met een goed geïsoleerd dak blijft die warmte binnen en stookt u minder.' },
      { icoon: 'voordeel-schade', kleur: 'blauw', titel: "Vermijd duizenden euro's aan schade", tekst: 'Een verschoven pan of een barst in de roofing laat regenwater binnen. Renoveert u op tijd, dan vermijdt u vocht en verdere schade aan uw dak.' },
      { icoon: 'voordeel-waarde', kleur: 'groen', titel: 'Meer waarde voor uw woning', tekst: 'Een dakrenovatie verhoogt de waarde van uw woning en verbetert, met isolatie, de EPC-score aanzienlijk.' },
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
    kop: 'Onze diensten',
    vlakken: true,
    lijst: [
      { id: 'nieuw-dak', icoon: 'dienst-nieuw', naam: 'Nieuw dak', tekst: 'Volledig nieuw dak, met pannen of leien, of als plat dak in EPDM, roofing of bitumen.' },
      { id: 'renovatie', icoon: 'dienst-renovatie', naam: 'Dakrenovatie', tekst: 'Uw dakstructuur blijft staan. Wij vernieuwen de pannen of leien, samen met het onderdak en de panlatten.' },
      { id: 'isolatie', icoon: 'dienst-isolatie', naam: 'Dakisolatie', tekst: 'Wij isoleren uw dak tijdens de renovatie of als aparte opdracht.' },
      { id: 'herstelling', icoon: 'dienst-herstel', naam: 'Dakherstelling', tekst: 'Wij herstellen een lek of schade aan uw hellend of plat dak.' },
    ],
  },

  voorna: {
    kop: 'Hetzelfde dak voor en na de werken',
    onder: 'Sleep de balk over de foto.',
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

  werkwijze: {
    kop: 'Zo verloopt uw dakwerk',
    onder: 'U weet vooraf wat er gebeurt en wanneer.',
    stappen: [
      { titel: 'Aanvraag', tekst: 'U doet uw aanvraag via het formulier hieronder of rechtstreeks telefonisch.' },
      { titel: 'Dakinspectie', tekst: 'Binnen enkele werkdagen doen we de inspectie en bekijken we samen de bevindingen.' },
      /* Stond eerst "Elke post staat apart op papier": dat is nu de derde
         reden in het waarom-blok. Twee keer dezelfde belofte op één pagina
         leest als vulling, dus deze stap draagt het geruststellende deel. */
      { titel: 'Offerte', tekst: 'U krijgt een vrijblijvende offerte.' },
      /* Mohammed: 'wij beginnen aan de werken, meestal duurt dakwerk ...'. De duur
         (één tot twee weken) is door Claude ingevuld: nog te bevestigen door AB. */
      { titel: 'Uitvoering', tekst: 'Wij beginnen aan de werken. Meestal duurt dakwerk één tot twee weken.' },
      { titel: 'Oplevering', tekst: 'Wij ruimen alles netjes op. Het enige wat we achterlaten is een perfect dak.' },
    ],
  },

  cta: {
    kop: 'Gratis dakinspectie',
    /* Mohammed: 'gratis dakinspectie onderaan moet duidelijker'. Wat de klant
       bij de inspectie krijgt, staat nu als drie vinkjes in plaats van in één
       lopende zin. Alles komt uit de werkwijze en de redenen hierboven. */
    tekst: '',
    punten: [
      'We bekijken uw dak ter plaatse',
      'Samen overlopen we de bevindingen',
      'U ontvangt een vrijblijvende offerte',
    ],
    foto: { src: pannenDicht, alt: 'Nieuw hellend dak met pannen' },
  },

  inspectie: {
    kop: 'Plan uw dakinspectie',
    knop: 'Vraag uw gratis dakinspectie aan',
    onder: 'Wij bellen u binnen één werkdag om een moment af te spreken.',
    alt: 'Liever eerst een prijs? Bereken hem in 2 minuten',
    bronLead: 'lp:dakwerken:inspectie',
  },

  /* Message match (Mohammed, 26 sep: "voor de mensen die bijvoorbeeld klikken, bij die koppen,
     dat ze denken, ah, ik ben op de juiste website"). Volgorde telt: isolatie vóór plat, want
     "plat dak isoleren" is een isolatievraag. Isolatie, renovatie en nieuw vragen het woord
     dak erbij: "badkamer renoveren" of "gevel isoleren" houdt de standaardkop. */
  boodschap: [
    /* 4 okt: de varianten volgen Mohammeds nieuwe kop; alleen het dakwoord wisselt. */
    { zoek: 'dak.*isol|isol.*dak|sarking', kop: 'Bereken in [2 minuten] de richtprijs van uw dakisolatie' },
    { zoek: 'plat|epdm|roofing|bitumen', kop: 'Bereken in [2 minuten] de richtprijs van uw plat dak', voor: { sleutel: 'Dak', label: 'Plat dak' } },
    { zoek: 'hellend|pannen|leien|sarking', kop: 'Bereken in [2 minuten] de richtprijs van uw hellend dak', voor: { sleutel: 'Dak', label: 'Hellend dak' } },
    { zoek: 'dak.*renov|^renovatie$', kop: 'Bereken in [2 minuten] de richtprijs van uw dakrenovatie' },
    { zoek: 'dak.*(nieuw|vervang)|(nieuw|vervang).*dak', kop: 'Bereken in [2 minuten] de richtprijs van uw nieuwe dak' },
  ],
};
