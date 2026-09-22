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
  hero: { kop: string; onder: string; dias: Foto[] };
  rekenaar: { vragen: Vraag[]; uitkomstKop: string; uitkomstOnder: string; knop: string };
  waarom: { kop: string; tekst: string; redenen: { titel: string; tekst: string }[]; duo: [Foto, Foto] };
  voorna: { kop: string; onder: string; voor: Foto; na: Foto; label: string };
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
    onder: 'Klik vijf antwoorden aan. Binnen één werkdag hoort u uw prijs.',
    dias: [
      { src: panRood, alt: 'Rijwoning met een nieuw rood pannendak tussen twee oudere buren' },
      { src: antraciet, alt: 'Halfopen woning in rode baksteen met een nieuw antraciet pannendak' },
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
        { label: 'Ouder dan tien jaar' }, { label: 'Jonger dan tien jaar' }, { label: 'Weet ik niet' },
      ] },
      { sleutel: 'Start', vraag: 'Wanneer wilt u beginnen?', keuzes: [
        { label: 'Zo snel mogelijk' }, { label: 'Binnen drie maanden' }, { label: 'Later dit jaar' }, { label: 'Ik verken nog' },
      ] },
    ],
    uitkomstKop: 'Waar mogen wij u bellen met uw prijs?',
    uitkomstOnder: 'Alleen uw telefoonnummer is verplicht.',
    knop: 'Stuur mijn prijs',
  },

  waarom: {
    kop: 'Wie er op uw dak staat',
    tekst: 'Wat onder de pannen zit, ziet u na de werf nooit meer. Daarom telt wie het legt.',
    redenen: [
      { titel: 'Eigen dakwerkers en zinkwerkers', tekst: 'Dezelfde ploeg staat elke dag op uw werf.' },
      { titel: 'Tienjarige aansprakelijkheid', tekst: 'Verzekerd, met een VCA-attest voor de werf.' },
      { titel: 'Plaatsbezoek binnen vijf werkdagen', tekst: 'Wij meten op en zetten elke post apart op papier.' },
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

  /* De reviews die al op de dakpagina's van abgroep.be staan (LpDienst:
     dakisolatie, velux, platdak). Niet door mij nagekeken op echtheid. */
  reviews: {
    kop: 'Wat klanten schrijven',
    beeld: { src: antraciet3, alt: 'Nieuw antraciet dak op een halfopen woning in rode baksteen' },
    lijst: [],
  },

  werkwijze: {
    kop: 'Zo verloopt uw dakwerk',
    onder: 'U weet vooraf wat er gebeurt en wanneer.',
    stappen: [
      { titel: 'Prijs', tekst: 'Uw antwoorden geven ons een eerste bedrag voor uw dak.' },
      { titel: 'Plaatsbezoek', tekst: 'Binnen vijf werkdagen komen we kijken en meten we op.' },
      { titel: 'Offerte', tekst: 'Elke post staat apart op papier, met zijn eigen prijs.' },
      { titel: 'Werf', tekst: 'Dezelfde ploeg komt elke dag terug en ruimt elke avond op.' },
    ],
  },

  cta: {
    kop: 'Uw prijs in vijf antwoorden',
    tekst: 'Het plaatsbezoek en de offerte zijn gratis.',
    foto: { src: pannenDicht, alt: 'Nieuw hellend dak met pannen' },
  },
};
