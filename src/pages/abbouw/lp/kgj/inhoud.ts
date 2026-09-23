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
import dakwerker from '@/assets/dak/dakwerker-pannen.jpg';
import pannenDichtbij from '@/assets/dak/pannen-dichtbij.jpg';
import antraciet3 from '@/assets/dak/lp-real-det-3.jpg';
import platdak from '@/assets/dak/platdak-tegel.jpg';
import droneAntraciet from '@/assets/dak/drone-antraciet.jpg';
import pannenDicht from '@/assets/dak/hellend-pannen.jpg';
import dakVoor from '@/assets/lp-diensten/dak-voor.jpg';
import dakNa from '@/assets/lp-diensten/dak-na.jpg';

export type Keuze = { label: string; uitleg?: string };
/** als: de vraag verschijnt alleen als een eerdere vraag dat antwoord kreeg. */
export type Vraag = { sleutel: string; vraag: string; keuzes: Keuze[]; als?: { sleutel: string; waarde: string } };
export type Foto = { src: string; alt: string };
export type Review = { tekst: string; naam: string; bron: string };

export type KgjInhoud = {
  /** Paginatitel in het tabblad. */
  titel: string;
  omschrijving: string;
  divisie: Divisie;
  /** Bron in GHL, zodat je in het CRM ziet van welke pagina een lead komt. */
  bronLead: string;
  bedanktSlug: string;
  /** ondertitel: eigen regel direct onder de kop, boven de subkop. */
  hero: { kop: string; ondertitel?: string; onder: string; bewijs: string[]; dias: Foto[] };
  rekenaar: { vragen: Vraag[]; gerust: string; uitkomstKop: string; uitkomstOnder: string; knop: string };
  waarom: { kop: string; tekst: string; redenen: { titel: string; tekst: string }[]; duo: [Foto, Foto] };
  voorna: { kop: string; onder: string; voor: Foto; na: Foto; label: string };
  /* Foto's van uitgevoerd werk. Dit staat op de plek waar de demo reviews
     heeft: AB heeft één Google-review, dus tot er echte klantenstemmen zijn
     draagt het werk zelf het bewijs. */
  werk: { kop: string; onder: string; fotos: (Foto & { label: string })[] };
  reviews: { kop: string; beeld: Foto; lijst: Review[] };
  werkwijze: { kop: string; onder: string; stappen: { titel: string; tekst: string }[] };
  /** punten: wat de klant bij de gratis inspectie krijgt, als vinkjes onder de kop. */
  cta: { kop: string; tekst: string; punten: string[]; foto: Foto };
  /** Het formulier onderaan: de gratis dakinspectie, met een link terug naar de calculator. */
  inspectie: { kop: string; knop: string; onder: string; alt: string; bronLead: string };
};

export const DAKWERKEN: KgjInhoud = {
  titel: 'Dakwerken: reken vooraf uit wat uw dak kost | AB Bouw Groep',
  omschrijving: 'Klik zes antwoorden aan en hoor binnen één werkdag wat uw dak kost. Gratis plaatsbezoek en offerte, werken aan 6% btw.',
  divisie: 'ab_dakwerken',
  bronLead: 'lp:dakwerken:rekenaar',
  bedanktSlug: 'dakwerken',

  hero: {
    /* De calculator staat ernaast en zegt zelf wat hij doet. Mohammed: 'de
       berekening is toch ernaast dat hoef je niet te verwoorden'. De kop gaat
       over het resultaat aan zijn huis. */
    kop: 'Dé specialist voor uw dakwerk',
    onder: 'Beantwoord zes korte vragen en u weet direct wat het kost.',
    /* Drie controleerbare feiten onder de kop. Een bezoeker die uit een
       advertentie komt, kent AB niet; dit is het enige bewijs dat boven de
       vouw past zolang er geen geverifieerde Google-score is.
       Volgorde op wat de Belgische markt blijkt te belonen: de langstlopende
       tekstadvertentie van Dural (1462 dagen, 45 van zijn 60 leesbare ads)
       zet "gratis en vrijblijvend" vooraan. Het VCA-attest staat nu in het
       waarom-blok: een certificaat overtuigt lager op de pagina, een
       toezegging overtuigt boven de vouw. */
    bewijs: ['Gratis dakinspectie en offerte', 'Volledige premiebegeleiding (Mijn VerbouwPremie)', '6% btw vanaf tien jaar oud', '10 jaar garantie'],
    dias: [
      { src: antraciet, alt: 'Halfopen woning in rode baksteen met een nieuw antraciet pannendak' },
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
       Bij plat dak Mohammeds eigen keuzes (bitumen, roofing, EPDM). */
    vragen: [
      { sleutel: 'Dak', vraag: 'Welk soort dak heeft u?', keuzes: [
        { label: 'Hellend dak', uitleg: 'hellingshoek groter dan 15°' },
        { label: 'Plat dak', uitleg: 'hellingshoek kleiner dan 15°' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Welke dakbedekking wenst u?', als: { sleutel: 'Dak', waarde: 'Hellend dak' }, keuzes: [
        { label: 'Gegolfde pannen' }, { label: 'Vlakke pannen of leien' }, { label: 'Golfplaten' }, { label: 'Weet ik nog niet' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Wat wilt u op uw plat dak?', als: { sleutel: 'Dak', waarde: 'Plat dak' }, keuzes: [
        { label: 'Bitumen' }, { label: 'Roofing' }, { label: 'EPDM' }, { label: 'Weet ik nog niet' },
      ] },
      { sleutel: 'Grootte', vraag: 'Hoe groot is het dak?', keuzes: [
        { label: 'Kleiner dan 50 m²' }, { label: '50 tot 100 m²' }, { label: '100 tot 150 m²' }, { label: 'Groter dan 150 m²' }, { label: 'Weet ik niet' },
      ] },
      { sleutel: 'Isolatie', vraag: 'Is er isolatie nodig?', keuzes: [
        { label: 'Ja', uitleg: 'ik wil isolatie laten plaatsen' }, { label: 'Nee', uitleg: 'enkel dakwerken' },
      ] },
      { sleutel: 'Asbest', vraag: 'Is er asbest aanwezig in het dak?', keuzes: [
        { label: 'Ja, vermoedelijk' }, { label: 'Nee' }, { label: 'Weet ik niet zeker' },
      ] },
      { sleutel: 'Start', vraag: 'Wanneer wilt u beginnen?', keuzes: [
        { label: 'Zo snel mogelijk' }, { label: 'Binnen drie maanden' }, { label: 'Later dit jaar' }, { label: 'Ik verken nog' },
      ] },
    ],
    gerust: 'Weet u het niet zeker? Een schatting volstaat.',
    uitkomstKop: 'Nog één stap',
    uitkomstOnder: '',
    knop: 'Bereken prijs',
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
      { titel: 'Volledige premiebegeleiding', tekst: 'Wij regelen de aanvraag van uw Mijn VerbouwPremie.' },
    ],
    /* Boven: de dakwerker zelf aan het werk. Dit blok verkoopt de mensen, dus
       hoort er een mens in beeld en geen vierde gevelfoto. Hier stond eerst
       lp-real-det-1, en dat bestand bleek op een pixelvergelijking hetzelfde
       frame als de eerste hero-dia (verschil 1,8 van 255): dezelfde woning
       stond dus twee keer op één pagina. */
    duo: [
      { src: dakwerker, alt: 'Dakwerker die nieuwe antraciet pannen legt op de tengellatten' },
      { src: pannenDichtbij, alt: 'Hetzelfde pannendak van bovenaf, tot op de nokpannen' },
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
    alt: 'Liever eerst een prijs? Bereken hem in zes vragen',
    bronLead: 'lp:dakwerken:inspectie',
  },
};
