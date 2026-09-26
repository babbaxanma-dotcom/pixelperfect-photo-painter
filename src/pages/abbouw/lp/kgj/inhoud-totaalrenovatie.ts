/**
 * Inhoud van de totaalrenovatiepagina in de vormtaal van /lp/dakwerken.
 *
 * Mohammed, 26 sep 2026: "een hele totale renovatie landingspagina om naar
 * dezelfde stijl zoals we hebben gebruikt bij de landingspagina van
 * dakwerken", met als voor/na "die witte uitbouw zo die slider dat je ook hebt
 * op de homepagina", en zonder "wat klanten schrijven".
 *
 * Elke bewering komt uit wat AB al publiceert: de vorige totaalrenovatiepagina
 * (replica/inhoud.ts: eigen ploeg, plaatsbezoek, prijs per onderdeel, afschermen
 * tegen stof, 6% btw, VCA) en de homepage ("eigen ploegen voor dakwerken, gevel,
 * badkamer, interieur, ruwbouw en energiewerken"). De tekst is getoetst met de
 * copy-guard (copy-totaalrenovatie.txt, groen op 26 sep 2026).
 *
 * Foto's: alleen echte werffoto's van AB uit lp-diensten/realisaties, plus de
 * uitbouw van de homepage (uitbreiding-voor/na) in de voor/na-schuif.
 */
import type { KgjInhoud } from './inhoud';

import openKeuken from '@/assets/lp-diensten/realisaties/totaalrenovatie-p5-a.jpg';
import keukeneiland from '@/assets/lp-diensten/realisaties/totaalrenovatie-p6-a.jpg';
import tvWand from '@/assets/lp-diensten/realisaties/interieur-tvwand.jpg';
import badkamer from '@/assets/lp-diensten/realisaties/badkamer-nieuw.jpg';
import keuken from '@/assets/lp-diensten/totaalrenovatie-hero.jpg';
import doorgang from '@/assets/lp-diensten/totaalrenovatie-what.jpg';
import uitbouwVoor from '@/assets/lp-diensten/uitbreiding-voor.jpg';
import uitbouwNa from '@/assets/lp-diensten/uitbreiding-na.jpg';

export const TOTAALRENOVATIE: KgjInhoud = {
  /* Zelfde vorm als het tabblad van dakwerken, dat Mohammed koos ("over het vak"). */
  titel: 'Dé specialist voor uw renovatie | AB Bouw Groep',
  omschrijving: 'Bereken in 2 minuten de prijs van uw renovatie. Gratis plaatsbezoek en offerte, werken aan 6% btw.',
  divisie: 'ab_construct',
  bronLead: 'lp:totaalrenovatie:rekenaar',
  bedanktSlug: 'totaalrenovatie',

  hero: {
    kop: 'Dé specialist voor uw renovatie',
    /* Zelfde opbouw als Mohammeds subkop op dakwerken. Het mechanisme: AB heeft
       voor elk vak een eigen ploeg (homepage), dus één planning. */
    onder: 'Totaalrenovaties in Regio Antwerpen en omstreken. Onze eigen ploegen nemen elk vak voor hun rekening, volgens één planning.',
    /* Mohammeds eigen drie vinkjes, letterlijk (26 sep). */
    bewijs: ['1 vast aanspreekpunt van ontwerp tot oplevering', 'Transparante offerte & strikte planning', 'Echt vakmanschap en perfecte afwerking'],
    /* Mohammed, 26 sep: "laat enkel de keuken foto, badkamerrenovatie foto van
       abgroep die we bij badkamerrenovatie lp in de sectie hebben onder hero, en
       dan nog die leefruimte echte foto". De badkamer is de foto uit de sectie
       onder de hero van /lp/badkamerrenovatie (replica/inhoud.ts, bkOver). */
    dias: [
      { src: keuken, alt: 'Keuken met eiland en glaspui na een totaalrenovatie door AB Bouw Groep' },
      { src: badkamer, alt: 'Badkamer met dubbele lavabo op eiken meubel, bad en inloopdouche, door AB Bouw Groep' },
      { src: openKeuken, alt: 'Open leefruimte met keuken en eethoek na totaalrenovatie door AB Bouw Groep' },
    ],
  },

  rekenaar: {
    /* Vijf vragen uit de vorige calculator van deze pagina, in dezelfde vorm als
       dakwerken: iconen, een tik gaat meteen door, de 6% btw-melding na een
       woning ouder dan tien jaar. De leeftijd is, zoals op dakwerken, alleen
       "jonger of ouder dan 10 jaar": dat is de grens van de 6% btw. */
    titel: 'Bereken uw renovatieprijs',
    tijd: 'Klaar in 2 minuten',
    zeker: 'Gratis en vrijblijvend',
    vragen: [
      { sleutel: 'Woning', vraag: 'Wat voor woning is het?', raster: true, keuzes: [
        { label: 'Appartement', icoon: 'appartement' }, { label: 'Rijwoning', icoon: 'rijwoning' },
        { label: 'Halfopen woning', icoon: 'halfopen' }, { label: 'Open bebouwing', icoon: 'vrijstaand' },
      ] },
      { sleutel: 'Omvang', vraag: 'Wat wilt u renoveren?', keuzes: [
        { label: 'De hele woning', icoon: 'heelhuis' }, { label: 'De benedenverdieping', icoon: 'beneden' },
        { label: 'De bovenverdieping', icoon: 'boven' }, { label: 'Nog niet beslist', icoon: 'twijfel' },
      ] },
      /* 26 sep, uit het plan van Gemini dat Mohammed doorstuurde: de oppervlakte.
         De grenzen komen uit de vorige calculator (appartement 90 m², rijwoning
         120 m², halfopen 160 m², open bebouwing 200 m² of meer). */
      { sleutel: 'Grootte', vraag: 'Hoe groot is de woning?', keuzes: [
        { label: 'Kleiner dan 100 m²', icoon: 'maat1' }, { label: '100 tot 150 m²', icoon: 'maat2' },
        { label: '150 tot 200 m²', icoon: 'maat3' }, { label: 'Groter dan 200 m²', icoon: 'maat4' },
        { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Leeftijd', vraag: 'Hoe oud is de woning?', keuzes: [
        { label: 'Jonger dan 10 jaar', icoon: 'jong' }, { label: 'Ouder dan 10 jaar', icoon: 'oud' },
      ], tip: { bij: ['Ouder dan 10 jaar'], tekst: 'Dankzij de wettelijke 6% btw-regeling betaalt u 15% minder btw op uw factuur.' } },
      { sleutel: 'Staat', vraag: 'Hoeveel moet er vernieuwd worden?', keuzes: [
        { label: 'Alles', uitleg: 'tot op de ruwbouw', icoon: 'strippen' },
        { label: 'Een groot deel', uitleg: 'een stuk blijft staan', icoon: 'deel' },
        { label: 'Enkel de afwerking', uitleg: 'pleister en verf', icoon: 'afwerking' },
        { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Start', vraag: 'Wanneer wilt u beginnen?', keuzes: [
        { label: 'Zo snel mogelijk', icoon: 'snel' }, { label: 'Binnen drie maanden', icoon: 'drie' },
        { label: 'Later dit jaar', icoon: 'later' }, { label: 'Ik verken nog', icoon: 'verken' },
      ] },
    ],
    gerust: 'Weet u het niet zeker? Een schatting volstaat.',
    uitkomstKop: 'Op welk nummer bereiken we u?',
    uitkomstOnder: '',
    knop: 'Bereken prijs',
  },

  waarom: {
    kop: 'Waarom AB Bouw Groep',
    /* Zelfde opbouw als de goedgekeurde tekst op dakwerken. Geen jaartal: "meer
       dan 15 jaar" gaat bij AB over dakwerken, niet over renovatie. */
    tekst: 'Een totaalrenovatie doet u één keer en daarna woont u er jaren in. Daarom is het belangrijk dat u een aannemer kiest die elk vak zelf in huis heeft. Onze eigen ploegen werken op dezelfde werf, volgens één planning. U kan rekenen op één aanspreekpunt dat uw dossier kent.',
    redenen: [
      { titel: 'VCA-gecertificeerd en verzekerd', tekst: 'Onze ploegen zijn VCA-gecertificeerd en volledig verzekerd.' },
      { titel: 'Gratis plaatsbezoek en offerte', tekst: 'Het plaatsbezoek en de offerte zijn gratis en vrijblijvend.' },
      /* Premiebegeleiding: dezelfde zin als op dakwerken (AB regelt de aanvraag). Geen bedrag: sinds 1 maart 2026 is de premie versmald. */
      { titel: '6% btw en premiebegeleiding', tekst: 'Voor een woning ouder dan tien jaar geldt 6% btw. Wij regelen de aanvraag van uw Mijn VerbouwPremie.' },
    ],
    duo: [
      { src: keukeneiland, alt: 'Keukeneiland met barkrukken na renovatie door AB Bouw Groep' },
      { src: tvWand, alt: 'Tv-wand in marmerlook met houten lamellen, door AB Bouw Groep' },
    ],
  },

  /* De onderdelen van één renovatie, in de volgorde waarin ze op de werf
     gebeuren (vorige pagina: "Wat er in een totaalrenovatie zit"). */
  diensten: {
    kop: 'Onze diensten',
    lijst: [
      { id: 'ruwbouw', icoon: 'dienst-ruwbouw', naam: 'Afbraak en ruwbouw', tekst: 'Muren weg, nieuwe openingen, oude vloer eruit. Wat blijft staan, wordt eerst ondersteund.' },
      { id: 'technieken', icoon: 'dienst-technieken', naam: 'Technieken', tekst: 'Nieuwe leidingen en elektriciteit gaan de muur in voordat er gepleisterd wordt.' },
      { id: 'afwerking', icoon: 'dienst-pleister', naam: 'Pleisterwerk en vloeren', tekst: 'Wanden en plafonds vlak en recht, de tegels strak in lijn gelegd.' },
      { id: 'interieur', icoon: 'dienst-interieur', naam: 'Interieur', tekst: 'Badkamer en keuken, met het maatwerk dat erbij hoort.' },
    ],
  },

  /* Mohammed: de slider van de homepage, de witte uitbouw. */
  voorna: {
    kop: 'Dezelfde uitbouw voor en na de werken',
    onder: 'Sleep de balk over de foto.',
    voor: { src: uitbouwVoor, alt: 'De aanbouw in ruwbouw: snelbouwstenen en de houten balken van het platte dak' },
    na: { src: uitbouwNa, alt: 'Dezelfde aanbouw afgewerkt, met witte crepi en een schuifraam over de volle breedte' },
    label: 'Aanbouw',
  },

  werk: { kop: '', onder: '', fotos: [] },

  /* Mohammed: "wat klanten schrijven, weg". Een lege lijst toont de sectie niet. */
  reviews: { kop: '', beeld: { src: doorgang, alt: '' }, lijst: [] },

  werkwijze: {
    kop: 'Zo verloopt uw renovatie',
    onder: 'U weet vooraf wat er gebeurt en wanneer.',
    stappen: [
      { titel: 'Aanvraag', tekst: 'U doet uw aanvraag via het formulier hieronder of rechtstreeks telefonisch.' },
      { titel: 'Plaatsbezoek', tekst: 'We bekijken de woning samen met u en overlopen uw wensen.' },
      { titel: 'Offerte', tekst: 'U krijgt de volledige prijs op papier, met per onderdeel wat erin zit.' },
      { titel: 'Uitvoering', tekst: 'Dezelfde ploeg komt elke dag terug. Wij schermen de woning af tegen stof en ruimen elke avond op.' },
      { titel: 'Oplevering', tekst: 'We lopen samen door de woning. Uw opmerkingen werken we af voordat de werf sluit.' },
    ],
  },

  cta: {
    kop: 'Gratis plaatsbezoek',
    tekst: '',
    punten: [
      'We bekijken uw woning ter plaatse',
      'Samen overlopen we uw wensen',
      'U ontvangt een vrijblijvende offerte',
    ],
    foto: { src: doorgang, alt: 'Afgewerkte leefruimte uit een totaalrenovatie van AB Bouw Groep' },
  },

  inspectie: {
    kop: 'Plan uw plaatsbezoek',
    knop: 'Vraag uw gratis plaatsbezoek aan',
    onder: 'Wij bellen u binnen één werkdag om een moment af te spreken.',
    alt: 'Liever eerst een prijs? Bereken hem in 2 minuten',
    bronLead: 'lp:totaalrenovatie:inspectie',
  },
};
