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
import platdak from '@/assets/dak/lp-real-epdm-2.jpg';
import droneAntraciet from '@/assets/dak/drone-antraciet.jpg';
import pannenDicht from '@/assets/dak/hellend-pannen.jpg';
import dakVoor from '@/assets/lp-diensten/dak-voor.jpg';
import dakNa from '@/assets/lp-diensten/dak-na.jpg';

export type Keuze = { label: string; uitleg?: string };
export type Vraag = { sleutel: string; vraag: string; keuzes: Keuze[] };
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
  hero: { kop: string; onder: string; bewijs: string[]; dias: Foto[] };
  rekenaar: { vragen: Vraag[]; gerust: string; uitkomstKop: string; uitkomstOnder: string; knop: string };
  waarom: { kop: string; tekst: string; redenen: { titel: string; tekst: string }[]; duo: [Foto, Foto] };
  voorna: { kop: string; onder: string; voor: Foto; na: Foto; label: string };
  /* Foto's van uitgevoerd werk. Dit staat op de plek waar de demo reviews
     heeft: AB heeft één Google-review, dus tot er echte klantenstemmen zijn
     draagt het werk zelf het bewijs. */
  werk: { kop: string; onder: string; fotos: (Foto & { label: string })[] };
  reviews: { kop: string; beeld: Foto; lijst: Review[] };
  werkwijze: { kop: string; onder: string; stappen: { titel: string; tekst: string }[] };
  cta: { kop: string; tekst: string; foto: Foto };
};

export const DAKWERKEN: KgjInhoud = {
  titel: 'Dakwerken: reken vooraf uit wat uw dak kost | AB Bouw Groep',
  omschrijving: 'Klik vijf antwoorden aan en hoor binnen één werkdag wat uw dak kost. Eigen dakwerkers en zinkwerkers, gratis plaatsbezoek.',
  divisie: 'ab_dakwerken',
  bronLead: 'lp:dakwerken:rekenaar',
  bedanktSlug: 'dakwerken',

  hero: {
    kop: 'Reken vooraf uit wat uw dak kost',
    onder: 'Vijf vragen over uw dak. Binnen één werkdag belt een van onze dakwerkers u met de prijs.',
    /* Drie controleerbare feiten onder de kop. Een bezoeker die uit een
       advertentie komt, kent AB niet; dit is het enige bewijs dat boven de
       vouw past zolang er geen geverifieerde Google-score is.
       Volgorde op wat de Belgische markt blijkt te belonen: de langstlopende
       tekstadvertentie van Dural (1462 dagen, 45 van zijn 60 leesbare ads)
       zet "gratis en vrijblijvend" vooraan. Het VCA-attest staat nu in het
       waarom-blok: een certificaat overtuigt lager op de pagina, een
       toezegging overtuigt boven de vouw. */
    bewijs: ['Gratis plaatsbezoek en offerte', 'Eigen dakwerkers en zinkwerkers', 'Tien jaar aansprakelijk'],
    dias: [
      { src: antraciet, alt: 'Halfopen woning in rode baksteen met een nieuw antraciet pannendak' },
      { src: panRood, alt: 'Rijwoning met een nieuw rood pannendak en een dakvenster' },
      { src: platdak, alt: 'Plat dak met nieuwe EPDM en een zinken dakrand, van bovenaf' },
      { src: droneAntraciet, alt: 'Dronefoto boven een nieuw antraciet pannendak' },
      { src: pannenDicht, alt: 'Nieuw hellend dak met pannen, schuin van onderaf' },
    ],
  },

  rekenaar: {
    vragen: [
      { sleutel: 'Werk', vraag: 'Wat moet er aan uw dak gebeuren?', keuzes: [
        { label: 'Dak vernieuwen' },
        { label: 'Dak isoleren' },
        { label: 'Lek of schade herstellen' },
        { label: 'Plat dak vernieuwen' },
        { label: 'Dakraam plaatsen' },
      ] },
      { sleutel: 'Dak', vraag: 'Wat voor dak heeft u?', keuzes: [
        { label: 'Pannen' }, { label: 'Leien' }, { label: 'Plat dak' }, { label: 'Weet ik niet' },
      ] },
      { sleutel: 'Woning', vraag: 'Wat voor woning is het?', keuzes: [
        { label: 'Rijwoning' }, { label: 'Halfopen bebouwing' }, { label: 'Vrijstaande woning' }, { label: 'Ander gebouw' },
      ] },
      /* Deze vraag bepaalt het btw-tarief: 6% bij een woning ouder dan tien
         jaar, anders 21%. Wie belt met de prijs, weet dat dan al. */
      { sleutel: 'Leeftijd', vraag: 'Hoe oud is de woning?', keuzes: [
        { label: 'Ouder dan tien jaar', uitleg: 'dan geldt 6% btw' },
        { label: 'Jonger dan tien jaar' }, { label: 'Weet ik niet' },
      ] },
      { sleutel: 'Start', vraag: 'Wanneer wilt u beginnen?', keuzes: [
        { label: 'Zo snel mogelijk' }, { label: 'Binnen drie maanden' }, { label: 'Later dit jaar' }, { label: 'Ik verken nog' },
      ] },
    ],
    gerust: 'Weet u het niet zeker? Een schatting volstaat.',
    uitkomstKop: 'Nog één stap',
    uitkomstOnder: 'U hoort de prijs binnen één werkdag. Wilt u daarna verder, dan komen wij opmeten.',
    knop: 'Bel mij met de prijs',
  },

  waarom: {
    kop: 'Wie er op uw dak staat',
    /* De pijn eerst, in zijn situatie: hij kan de kwaliteit van een dak niet
       zelf beoordelen. Daarna wat hij eraan overhoudt. De drie redenen
       dragen de feiten; deze twee zinnen zetten hem op zijn eigen stoep, en
       herhalen dus niets uit de redenen. */
    tekst: 'Een dak vernieuwt u één keer in dertig jaar. U geeft er veel geld aan uit voor werk waar u zelf nooit op klimt om te kijken of het goed zit. Daarom houden wij het in eigen huis. Onze eigen dakwerkers leggen de pannen en onze eigen zinkwerkers maken de goten. Dezelfde mensen die maandag beginnen, leggen ook de laatste pan. Voor we starten hoort u wat er gebeurt en wat het kost, met elke post apart op de offerte. Tien jaar lang blijft dit dak ons werk.',
    redenen: [
      { titel: 'Eigen dakwerkers en zinkwerkers', tekst: 'Elke ochtend dezelfde ploeg op uw dak, tot de laatste nokpan vastligt.' },
      { titel: 'Tien jaar aansprakelijk', tekst: 'Zo lang blijft dit dak ons werk. Verzekerd, met een VCA-attest voor de werf.' },
      { titel: 'Elke post apart op uw offerte', tekst: 'U leest per post wat u betaalt, aan het btw-tarief dat op uw woning geldt.' },
    ],
    /* Boven: de dakwerker zelf aan het werk. De kop van dit blok gaat over
       wie er op het dak staat, dus hoort daar een mens bij en geen vierde
       gevelfoto. Hier stond eerst lp-real-det-1, en dat bestand bleek op een
       pixelvergelijking hetzelfde frame als de eerste hero-dia (verschil 1,8
       van 255): dezelfde woning stond dus twee keer op één pagina. */
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
    kop: 'Uitgevoerd werk',
    onder: 'Zo ziet het eruit als de ploeg vertrokken is.',
    fotos: [
      { src: antraciet, label: 'Antraciet pannendak', alt: 'Halfopen woning in rode baksteen met een nieuw antraciet pannendak' },
      { src: panRood, label: 'Rood pannendak', alt: 'Rijwoning met een nieuw rood pannendak en een dakvenster' },
      { src: platdak, label: 'Plat dak met EPDM', alt: 'Plat dak met nieuwe EPDM en een zinken dakrand, van bovenaf' },
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
      { titel: 'Prijs', tekst: 'Uw vijf antwoorden zeggen ons hoe groot het werk is.' },
      { titel: 'Plaatsbezoek', tekst: 'Binnen vijf werkdagen staan we op uw dak en meten we op.' },
      /* Stond eerst "Elke post staat apart op papier": dat is nu de derde
         reden in het waarom-blok. Twee keer dezelfde belofte op één pagina
         leest als vulling, dus deze stap draagt het geruststellende deel. */
      { titel: 'Offerte', tekst: 'U neemt hem rustig door voor u beslist.' },
      { titel: 'Werf', tekst: 'Het dak gaat elke avond dicht, ook als het werk nog loopt.' },
    ],
  },

  cta: {
    kop: 'Laat uw dak opmeten',
    tekst: 'Wij komen langs binnen vijf werkdagen en meten uw dak op. De offerte die erop volgt is gratis en vrijblijvend.',
    foto: { src: pannenDicht, alt: 'Nieuw hellend dak met pannen' },
  },
};
