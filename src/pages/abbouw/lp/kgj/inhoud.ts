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

import panRood from '@/assets/dak/lp-real-pan-2.jpg';
import panRood1 from '@/assets/dak/lp-real-pan-1.jpg';
import antraciet from '@/assets/dak/lp-real-det-2.jpg';
import antraciet1 from '@/assets/dak/lp-real-det-1.jpg';
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
    onder: 'Vijf vragen over uw dak. Een van onze dakwerkers belt u binnen één werkdag met de prijs, vrijblijvend.',
    /* Drie controleerbare feiten onder de kop. Een bezoeker die uit een
       advertentie komt, kent AB niet; dit is het enige bewijs dat boven de
       vouw past zolang er geen geverifieerde Google-score is. */
    bewijs: ['Eigen dakwerkers en zinkwerkers', 'VCA-gecertificeerd en verzekerd', 'Gratis plaatsbezoek'],
    dias: [
      /* Het antracieten dak staat vooraan tot Mohammed een vervanger stuurt
         voor de foto met de oranje pannen (22 sep). */
      { src: antraciet, alt: 'Halfopen woning in rode baksteen met een nieuw antraciet pannendak' },
      { src: panRood, alt: 'Rijwoning met een nieuw rood pannendak tussen twee oudere buren' },
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
    gerust: 'Een schatting volstaat.',
    uitkomstKop: 'Nog één stap',
    uitkomstOnder: 'Wij bellen u binnen één werkdag met de prijs. Het gesprek is vrijblijvend.',
    knop: 'Bel mij met de prijs',
  },

  waarom: {
    kop: 'Wie er op uw dak staat',
    tekst: 'Het meeste dakwerk verdwijnt onder de pannen: het onderdak, de isolatie, het lood langs de gemene muur. U ziet het na de werf nooit meer terug, dus moet u kunnen vertrouwen op de mensen die het leggen.',
    redenen: [
      { titel: 'Eigen dakwerkers en zinkwerkers', tekst: 'Dezelfde mensen staan elke dag op uw werf, tot de laatste nokpan vastligt.' },
      { titel: 'Tienjarige aansprakelijkheid', tekst: 'Verzekerd op de constructie, met een VCA-attest voor de veiligheid op de werf.' },
      { titel: 'Elke post apart op uw offerte', tekst: 'U ziet wat het dak, het onderdak en de goot apart kosten.' },
    ],
    duo: [
      { src: antraciet1, alt: 'Halfopen woning met een nieuw antraciet dak, vanaf de straat' },
      { src: panRood1, alt: 'Rijwoning met een nieuw rood pannendak, recht van voren' },
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
    onder: 'Daken die wij vernieuwden.',
    fotos: [
      { src: antraciet, label: 'Antraciet pannendak', alt: 'Halfopen woning in rode baksteen met een nieuw antraciet pannendak' },
      { src: panRood, label: 'Rood pannendak', alt: 'Rijwoning met een nieuw rood pannendak tussen twee oudere buren' },
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
      { titel: 'Prijs', tekst: 'Uw antwoorden geven ons de omvang van het werk.' },
      { titel: 'Plaatsbezoek', tekst: 'Binnen vijf werkdagen staan we op uw dak en meten we op.' },
      { titel: 'Offerte', tekst: 'Elke post staat apart op papier. Bij een woning ouder dan tien jaar aan 6% btw.' },
      { titel: 'Werf', tekst: 'Dezelfde ploeg komt elke dag terug en ruimt elke avond op.' },
    ],
  },

  cta: {
    kop: 'Uw dak van dichtbij bekeken',
    tekst: 'Wij komen langs binnen vijf werkdagen en meten uw dak op. De offerte die erop volgt is gratis en vrijblijvend.',
    foto: { src: pannenDicht, alt: 'Nieuw hellend dak met pannen' },
  },
};
