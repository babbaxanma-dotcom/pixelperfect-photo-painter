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
import { DIVISIES } from '../../_divisies';

/* Veelgestelde vragen: de antwoorden die AB al op zijn afdelingspagina's geeft,
   rechtstreeks uit _divisies.ts (één bron, niets nieuw beweerd). Een vraag die
   daar verdwijnt, valt hier stil weg; check-lp-reno telt ze. */
const vraag = (afdeling: string, v: string) => {
  const f = DIVISIES[afdeling]?.faqs.find((x) => x.q === v);
  return f ? [{ v: f.q, a: f.a }] : [];
};

import openKeuken from '@/assets/lp-diensten/realisaties/totaalrenovatie-p5-a.jpg';
import keukeneiland from '@/assets/lp-diensten/realisaties/totaalrenovatie-p6-a.jpg';
import tvWand from '@/assets/lp-diensten/realisaties/interieur-tvwand.jpg';
import badkamer from '@/assets/lp-diensten/realisaties/badkamer-nieuw.jpg';
import keuken from '@/assets/lp-diensten/totaalrenovatie-hero.jpg';
import doorgang from '@/assets/lp-diensten/totaalrenovatie-what.jpg';
import uitbouwVoor from '@/assets/lp-diensten/uitbreiding-voor.jpg';
import uitbouwNa from '@/assets/lp-diensten/uitbreiding-na.jpg';
/* Uitgevoerd werk: Mohammeds eigen iPhone-foto's van afgewerkt werk, uit zijn
   Downloads (IMG_90xx.jpeg), stand gecorrigeerd in commit fe90779. Mohammed:
   "kijk gewoon naar de gedownloade foto's ... neem de goede foto's eruit".
   IMG_9068 (de uitbouw) staat al in de voor/na eronder en IMG_9064 is een werf;
   die twee horen niet in het spoor. De lijst met bron staat in
   scripts/check-lp-reno.cjs (ECHTE_FOTOS); die guard toetst elke foto op md5. */
import eigen9014 from '@/assets/lp-diensten/eigen/IMG_9014.jpg';
import eigen9015 from '@/assets/lp-diensten/eigen/IMG_9015.jpg';
import eigen9022 from '@/assets/lp-diensten/eigen/IMG_9022.jpg';
import eigen9025 from '@/assets/lp-diensten/eigen/IMG_9025.jpg';
import eigen9027 from '@/assets/lp-diensten/eigen/IMG_9027.jpg';
import eigen9028 from '@/assets/lp-diensten/eigen/IMG_9028.jpg';
import eigen9029 from '@/assets/lp-diensten/eigen/IMG_9029.jpg';
import eigen9030 from '@/assets/lp-diensten/eigen/IMG_9030.jpg';
import eigen9065 from '@/assets/lp-diensten/eigen/IMG_9065.jpg';
import eigen9069 from '@/assets/lp-diensten/eigen/IMG_9069.jpg';
/* 29 sep, Mohammed: "pak al deze fotos" (Downloads/bijlagen, IMG_01xx.jpeg) en "al
   de rest eigenlijk in uitgevoerd werk, behalve 2 onafgewerkte fotos". Van de 13
   afgewerkte stonden er 6 al in het spoor (0104 = 9025, 0107 = 9027, 0108 = 9028,
   0109 = 9029, 0112 = 9014, 0113 = 9015); de 7 nieuwe staan hieronder. Werffoto's
   (0101, 0103, 0115, 0116) horen niet in "Uitgevoerd werk". 0117 en 0119 zijn het
   voor/na-paar. */
import eigen0100 from '@/assets/lp-diensten/eigen/IMG_0100.jpg';
import eigen0102 from '@/assets/lp-diensten/eigen/IMG_0102.jpg';
import eigen0105 from '@/assets/lp-diensten/eigen/IMG_0105.jpg';
import eigen0106 from '@/assets/lp-diensten/eigen/IMG_0106.jpg';
import eigen0110 from '@/assets/lp-diensten/eigen/IMG_0110.jpg';
import eigen0111 from '@/assets/lp-diensten/eigen/IMG_0111.jpg';
import eigen0114 from '@/assets/lp-diensten/eigen/IMG_0114.jpg';
/* Voor/na (29 sep): IMG_0117 (ruwbouw) en IMG_0119 (afgewerkt), dezelfde doorkijk
   naar de tuin; beide 16:10 uitgesneden met de tuindeur op dezelfde plek. */
import woonkeukenVoor from '@/assets/lp-diensten/woonkeuken-voor.jpg';
import woonkeukenNa from '@/assets/lp-diensten/woonkeuken-na.jpg';
/* 5 okt: de afgewerkte dakfoto (de na-foto van de dak-LP) voor de dienstkaart Dakwerken. */
import dakNa from '@/assets/lp-diensten/dak-na.jpg';

/* 5 okt 2026: de pagina volgt Mohammeds blauwdrukken ("abgroep landingspagina
   totaalrenovatie", de herziening voor "renovatiewerken" en daarna "de drie
   paginas": deze moederpagina voor totaalrenovatie, een kopie voor
   renovatiewerken in inhoud-renovatiewerken.ts en de losse rekenaar in
   inhoud-richtprijs.ts). Zijn tekst letterlijk ("maar met mijn copy he"), in de
   u-vorm en met Nederlandse hoofdletters. Niet
   overgenomen: "Meer dan 500 Vlamingen gingen u voor" (een aantal zonder
   bron, zoals 4,9 en 120+). De herofoto's blijven ("de visuele foto in hero
   zelfde laten"). Emoji's zijn iconen in de huisstijl. */
/* 5 okt 2026, later: Mohammeds gestripte versie ("te veel tekst ... ze scannen"). De pagina is
   gehalveerd: korte subkop en bullets, alleen de voor/na als bewijs, drie zekerheden in kolommen,
   stappen en diensten in één regel, het telefoonnummer alleen bovenaan en in de voet.
   "Geen gereciclebel" uit zijn tekst is als tikfout gelezen: "Geen gebel". */
/* 5 okt, derde versie: Mohammeds "strakke, natuurlijke" tekst ("normaal Vlaams", zonder "strippings"
   en geforceerde slogans). Zijn tekst stond in de je-vorm; de hele site spreekt met u (zijn keuze
   van 5 okt), dus hier ook. Emoji's zijn lijniconen in de huisstijl. */
/* 5 okt, DEFINITIEF (Mohammed: "dit is het definitief"): zijn tekst letterlijk, met zijn visuele
   instructies per sectie (wit tekstvlak op de herofoto, grijze voor/na, drie kaarten, tijdlijn,
   fotoraster, vangnet met ghost-knop, witte formulierkaart met subtiele schaduw). Nederlandse
   hoofdletters ("Totaalrenovaties & nieuwbouw"). Eén aanpassing in een antwoord: de vraag werd
   "Kan ik de werken ook in fases laten uitvoeren?", dus het antwoord begint met "Ja" in plaats van
   "Nee". */
export const TOTAALRENOVATIE: KgjInhoud = {
  /* Zelfde vorm als het tabblad van dakwerken, dat Mohammed koos ("over het vak"). */
  titel: 'Dé specialist voor uw renovatie | AB Bouw Groep',
  omschrijving: 'Bereken in 2 minuten de prijs van uw renovatie. Gratis plaatsbezoek en offerte, werken aan 6% btw.',
  divisie: 'ab_construct',
  bronLead: 'lp:totaalrenovatie:rekenaar',
  bedanktSlug: 'totaalrenovatie',

  topbalk: 'Direct persoonlijk advies voor uw renovatie? Bel:',

  hero: {
    /* Mohammeds eigen kop, letterlijk (26 sep). 4 okt, plan desktop-hero: nieuwe kop. */
    /* 5 okt, "de drie paginas": deze pagina gaat 100% over totaalrenovatie ("Uw Totaalrenovatie
       Zorgeloos Geregeld. Vaste Prijs, Eén Vaste Partner."); de brede kop staat op de
       renovatiewerken-pagina. Zorgeloos blijft in de accentkleur. */
    /* Definitief: "van A tot Z" in de accentkleur. */
    kop: 'Uw renovatie [van A tot Z] geregeld.\nVaste prijs, één partner.',
    /* Zelfde opbouw als Mohammeds subkop op dakwerken. Het mechanisme: AB heeft
       voor elk vak een eigen ploeg (homepage), dus één planning. */
    /* Mohammed, 26 sep: de subkop "eruit". Leeg = geen regel onder de kop. */
    /* 4 okt: subheadline eerst "Bereken binnen 2 minuten een realistische prijsindicatie voor uw
       woning.", dan Mohammed: "eruit in de subheadline bij totaalrenovatie". Leeg = geen regel. */
    /* 6 okt, Mohammed: "teveel tekst in hero, haal alle subtekst weg, hou enkel headline en puntjes". */
    onder: '',
    /* 4 okt, plan desktop-hero (Mohammed): drie USP's, het deel voor de dubbelepunt in het vet. 5 okt: zijn nieuwe teksten. */
    bewijs: ['100% Budgetgarantie: De prijs op uw offerte is de eindprijs. Geen onaangename verrassingen achteraf.', 'Eén vast aanspreekpunt: U hoeft zelf geen aannemers op elkaar af te stemmen. Wij sturen de hele werf aan.', 'Volledige premiebegeleiding: Wij regelen uw EPC-attest en begeleiden de aanvraag van uw Mijn VerbouwPremie.'],
    /* 5 okt: een grote knop naar het formulier in plaats van de rekenaar; die staat in het vangnet. */
    knop: { tekst: 'Vraag uw gratis plaatsbezoek aan', onder: '' },
    /* Mohammed, 26 sep: "laat enkel de keuken foto, badkamerrenovatie foto van
       abgroep die we bij badkamerrenovatie lp in de sectie hebben onder hero, en
       dan nog die leefruimte echte foto". De badkamer is de foto uit de sectie
       onder de hero van /lp/badkamerrenovatie (replica/inhoud.ts, bkOver). */
    /* 5 okt, Mohammed: "doe de 3 foto van de slider als eerste foto", "badkamer tweede", "1ste van nu
       als 3de". */
    dias: [
      { src: openKeuken, alt: 'Open leefruimte met keuken en eethoek na totaalrenovatie door AB Bouw Groep' },
      { src: badkamer, alt: 'Badkamer met dubbele lavabo op eiken meubel, bad en inloopdouche, door AB Bouw Groep' },
      { src: keuken, alt: 'Keuken met eiland en glaspui na een totaalrenovatie door AB Bouw Groep' },
    ],
  },

  rekenaar: {
    /* Vijf vragen uit de vorige calculator van deze pagina, in dezelfde vorm als
       dakwerken: iconen, een tik gaat meteen door, de 6% btw-melding na een
       woning ouder dan tien jaar. De leeftijd is, zoals op dakwerken, alleen
       "jonger of ouder dan 10 jaar": dat is de grens van de 6% btw. */
    /* 4 okt, plan desktop-hero: kaarttitel en subtekst. */
    titel: 'Ontvang een realistische prijsindicatie',
    tijd: 'Klaar in 2 minuten • 100% vrijblijvend',
    zeker: 'Gratis en vrijblijvend',
    vragen: [
      { sleutel: 'Woning', vraag: 'Wat voor woning wilt u renoveren?', raster: true, keuzes: [
        { label: 'Appartement', icoon: 'appartement' }, { label: 'Rijwoning', icoon: 'rijwoning' },
        { label: 'Halfopen bebouwing', icoon: 'halfopen' }, { label: 'Open bebouwing', icoon: 'vrijstaand' },
      ] },
      /* Mohammed, 28 sep: "bij vraag 2, wat wilt u renoveren, krijg je afvinksysteem
         van de kamers etc" en "een afvink erbij van, alles, totaalrenovatie, en alles
         wordt daarmee aangevinkt". Voorbeeld: de prijsschatting van reno-x.be (per
         onderdeel inbegrepen of niet), zonder hun "per m²"/"vast bedrag" en hun
         Engelse termen. Alleen werk dat AB zelf doet, zoals de site het noemt:
         keuken, badkamer, vloeren, pleister- en schilderwerk, "elektriciteit,
         sanitair, verwarming en ventilatie", isolatie, schrijnwerk, dak en gevel. */
      /* Premiemelding zodra Isolatie aangevinkt is, ook via Alles (Mohammed, 28 sep:
         "omdat u isolatie mee hebt geselecteerd ... tot 50% van de factuur terug ...
         via mijn verbouwpremie. Wij begeleiden u ... niet zo van die gekke uitleg").
         "Afhankelijk van uw inkomen" blijft: sinds 1 maart 2026 krijgen categorie 1
         en 2 niets meer. Daarna: "hier moet ook dat maximum bedrag zijn".
         Nagelezen op vlaanderen.be (28 sep 2026), aanvragen vanaf 1 maart 2026,
         eigenaar-bewoner: dak categorie 4 50% (max. 5.750 euro), categorie 3 35%
         (max. 4.025 euro), 1 en 2 niets; buitenmuur en vloer: "Er is geen premie meer
         mogelijk" in elke categorie. Daarom noemt de zin alleen dakisolatie. */
      { sleutel: 'Renoveren', vraag: 'Wat wilt u renoveren?', afvinken: { alles: 'Alles (totaalrenovatie)', tip: { bij: ['Isolatie'],
        tekst: 'Omdat u isolatie hebt aangevinkt: voor dakisolatie krijgt u via Mijn VerbouwPremie tot 50% van de factuur terug, maximaal € 5.750, afhankelijk van uw inkomen. Wij begeleiden u bij de aanvraag.' } }, keuzes: [
        /* Mohammed, 28 sep: "tis nu allemaal vakjes overwhelming". Twee korte groepen
           knopjes onder één groot vakje Alles. */
        { label: 'Keuken', groep: 'Ruimtes' }, { label: 'Badkamer', groep: 'Ruimtes' },
        { label: 'Woonkamer', groep: 'Ruimtes' }, { label: 'Slaapkamers', groep: 'Ruimtes' },
        /* Volgorde zo dat de knopjes op een gsm vier volle regels vullen. */
        { label: 'Vloeren', groep: 'Werken' }, { label: 'Muren en plafonds', groep: 'Werken' },
        { label: 'Verwarming en sanitair', groep: 'Werken' }, { label: 'Isolatie', groep: 'Werken' },
        { label: 'Ramen en deuren', groep: 'Werken' }, { label: 'Elektriciteit', groep: 'Werken' },
        { label: 'Dak', groep: 'Werken' }, { label: 'Gevel', groep: 'Werken' },
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
    uitkomstKop: 'Waar mogen we de berekening naartoe verzenden?',
    uitkomstOnder: 'Wij bezorgen u uw richtprijs zo snel mogelijk.',
    knop: 'Ontvang mijn richtprijs',
    /* Drie zekerheden net boven de knop (Mohammed, 28 sept). Geen 10 jaar garantie:
       die geldt volgens de site alleen voor dakwerken. */
    troeven: ['Gratis en vrijblijvend', 'Vaste prijs, geen verrassingen', '1 vast aanspreekpunt'],
  },

  waarom: {
    kop: 'Verbouwen zoals het wél hoort',
    intro: 'Verhalen over werven die weken stilliggen of facturen die plots de hoogte inschieten... we kennen ze allemaal. Bij AB Bouw Groep pakken we het anders aan:',
    /* Mohammed, 26 sep: zoals de tekst van Zedreno, "maar iets aanpassen dat het
       niet zelfde tekst lijkt". Eigen woorden en AB's eigen feiten (eigen ploegen
       per vak, uitbreiding: de uitbouw in de voor/na). Geen jaartal: "meer dan 15
       jaar" gaat bij AB over dakwerken. */
    tekst: 'Veel huiseigenaren zien enorm op tegen een totaalrenovatie. Aannemers die hun afspraken niet nakomen, een huis dat maandenlang een bouwwerf is, en offertes die halverwege het traject plotseling duizenden euro\'s duurder uitvallen.',
    /* 5 okt: de frustratie links in een donker vak, de oplossing rechts. */
    tegenover: 'Bij AB Bouw Groep pakken we dit fundamenteel anders aan:',
    /* Gestript: alleen de kop en drie korte zekerheden, elk een kolom. */
    kolommen: true,
    redenen: [
      { titel: 'Naadloze planning', tekst: 'Omdat we alle expertises zelf in huis hebben, volgen de werken elkaar vlot op zonder wachttijden.' },
      { titel: 'Propere werf', tekst: 'Onze vaste ploeg dekt alles netjes af en laat de werf élke avond opgeruimd achter.' },
      { titel: 'Zekerheid vooraf', tekst: 'Met onze vaste prijsgarantie weet u vooraf exact wat uw totale renovatie gaat kosten.' },
    ],
    duo: [
      { src: keukeneiland, alt: 'Keukeneiland met barkrukken na renovatie door AB Bouw Groep' },
      { src: tvWand, alt: 'Tv-wand in marmerlook met houten lamellen, door AB Bouw Groep' },
    ],
  },

  /* Mohammed, 27 sep: "doe gewoon bij onze diensten de afdelingen van ab bouw groep,
     simpel, zonder al te veel tekst, die 6 afdelingen" en "bij een renovatie ... stellen
     wij de afdelingen juist op aan elkaar omdat we alles binnenshuis hebben verloopt de
     planning vlot". Namen en volgorde: de zes afdelingen van AB (homepage DIENSTEN,
     nummering in _divisies.ts: construct 01, ecologisch 02, interieur 03, dak 04,
     bad 05, gevel 06). */
  diensten: {
    /* 5 okt, "de drie paginas": op deze pagina de schaal van de projecten ("Volledige strippings",
       "Aanbouwen", "Energetische Totaalrenovaties"), met de kop en tekst uit de eerste blauwdruk.
       De uitleg per kaart zijn zijn eigen zinnen uit die blauwdrukken. Echte werffoto's van AB. */
    kop: 'Onze expertises',
    onder: '',
    lijst: [
      { id: 'bouw', icoon: 'dienst-nieuw', naam: 'Totaalrenovaties & nieuwbouw', tekst: '',
        foto: { src: eigen9022, alt: 'Open leefruimte met keukeneiland, eettafel en glaspui naar de tuin, door AB Bouw Groep' } },
      { id: 'aanbouw', icoon: 'dienst-ruwbouw', naam: 'Aanbouwen & uitbreidingen', tekst: '',
        foto: { src: uitbouwNa, alt: 'Afgewerkte uitbouw met witte crepi en een schuifraam over de volle breedte, door AB Bouw Groep' } },
      { id: 'dak-gevel', icoon: 'dienst-renovatie', naam: 'Dak- en gevelwerken', tekst: '',
        foto: { src: dakNa, alt: 'Vernieuwd pannendak met dakvensters, door AB Bouw Groep' } },
      { id: 'badkamer', icoon: 'afd-bad', naam: 'Badkamer & interieur', tekst: '',
        foto: { src: eigen9025, alt: 'Inloopdouche met marmerlook-tegels en een zwevend wastafelmeubel, door AB Bouw Groep' } },
    ],
  },

  /* Mohammed, 28 sep: "op de totaalrenovatie pagina wil ik graag net boven de before
     and after, uitgevoerd werk, maar enkel abgroep echte fotos". Daarna: "zonder de
     namen", "op de manier van de home page", "zo dat het horizontaal doorloopt",
     "er zijn veel meer fotos" en "kijk gewoon naar de gedownloade foto's". Sinds
     29 sep zeventien eigen foto's, om en om gezet: twee badkamers, twee keukens,
     twee plafonds of twee salons staan nooit naast elkaar, ook niet waar het spoor
     rondloopt. pos: vierkante uitsnede. */
  uitgevoerd: {
    kop: 'Uitgevoerd werk',
    /* 5 okt: de tekst van de bewijssectie uit de blauwdruk. Zijn kop "Meer dan 500 Vlamingen gingen
       u voor" staat er niet op: een aantal zonder bron. */
    onder: 'Een succesvolle renovatie valt of staat met vakmanschap. Bekijk onze recente transformaties in de regio. Kwaliteit, een scherp oog voor detail en onze liefde voor het vak staan bij elk project voorop. Wij leveren uw woning sleutel-op-de-deur af.',
    fotos: [
      { src: eigen9065, alt: 'Tv-wand in marmerlook tussen houten lamellen, met een zwevend meubel, door AB Bouw Groep' },
      { src: eigen9028, pos: '60% center', alt: 'Badkamer met ligbad onder het raam, hangtoilet, douchebak en wastafelmeubel met zwarte kraan, door AB Bouw Groep' },
      { src: eigen0110, alt: 'Gewelfde doorgang in lichte leempleister naar een ruimte met vaste vloerbekleding en fluwelen gordijnen, door AB Bouw Groep' },
      { src: eigen9022, alt: 'Open leefruimte met keukeneiland, eettafel en glaspui naar de tuin, door AB Bouw Groep' },
      { src: eigen0114, alt: 'Witte trap met eiken treden en een smal raam bovenaan, door AB Bouw Groep' },
      { src: eigen9015, alt: 'Plafond met ingewerkte lichtlijnen en spots boven een wand met sierlijsten, door AB Bouw Groep' },
      { src: eigen9069, pos: '75% center', alt: 'Badkamer met dubbele wastafel op een houten meubel, groene wandtegels en een inloopdouche, door AB Bouw Groep' },
      { src: eigen0102, pos: '40% center', alt: 'Leefruimte met visgraatparket, een haard in donkere marmerlook en een tv-wand tussen houten lamellen, door AB Bouw Groep' },
      { src: eigen9030, alt: 'Wit geschilderde woning met een nieuw tuinpad van grote tegels in wit grind, door AB Bouw Groep' },
      { src: eigen0111, alt: 'Behandelruimte met twee maatwerk-behandeltafels, gescheiden door lichte gordijnen, door AB Bouw Groep' },
      { src: eigen9027, alt: 'Keukeneiland met twee barkrukken en witte keukenkasten, door AB Bouw Groep' },
      { src: eigen0105, alt: 'Verlaagd plafond met spots, lichtlijnen en indirecte verlichting boven een wand met sierlijsten, door AB Bouw Groep' },
      { src: eigen9025, alt: 'Inloopdouche met marmerlook-tegels, glazen wand met zwart profiel en een zwevend wastafelmeubel in lichte houtlook, door AB Bouw Groep' },
      { src: eigen0100, alt: 'Zithoek met donkere houten vloer, wand in sierpleister en een wand met houten lamellen naast de terrasdeur, door AB Bouw Groep' },
      { src: eigen9029, pos: '80% center', alt: 'Afgewerkte handelsruimte met grote tegelvloer, spots en een glaspui naar de straat, door AB Bouw Groep' },
      { src: eigen0106, alt: 'Douche met patroontegels en een regendouche, naast een wastafelmeubel met zwart blad, door AB Bouw Groep' },
      { src: eigen9014, alt: 'Kamer met antraciet raam, witte wanden en grijze vaste vloerbekleding, gezien vanuit de deuropening, door AB Bouw Groep' },
    ],
  },

  /* Mohammed: de slider van de homepage, de witte uitbouw. 27 sep: kop "Dezelfde
     uitbouw voor en na de werken" en label "Aanbouw" eruit ("die tekst is echt niet
     mooi", "1 keer zeg je aanbouw en 1 keer uitbouw"). 29 sep: "2 daarvan moet je
     zetten in before and after slider" en "die before and after slider moet je ook
     pijltje kunnen doen voor andere before after". Eerst de woonkeuken (0117/0119),
     met de pijl daarna de uitbouw. */
  voorna: {
    /* Definitief: zijn kop en twee zinnen boven de schuif, "Sleep de balk over de foto" eronder. */
    kop: 'Resultaten waar we trots op zijn',
    onder: 'Kwaliteit en een strakke afwerking spreken voor zich. Bekijk hieronder enkele van onze recente werven in Vlaanderen.',
    hint: 'Sleep de balk over de foto',
    voor: { src: woonkeukenVoor, alt: 'De verbouwing in ruwbouw: nieuwe binnenmuren in snelbouwsteen, houten balken in het plafond en de opening naar de tuin' },
    na: { src: woonkeukenNa, alt: 'Dezelfde doorkijk na de werken: open woonkeuken met lichtkoepel, lichte vloer en een glazen deur naar de tuin' },
    label: '',
    meer: [
      {
        voor: { src: uitbouwVoor, alt: 'De uitbouw in ruwbouw: snelbouwstenen en de houten balken van het platte dak' },
        na: { src: uitbouwNa, alt: 'Dezelfde uitbouw afgewerkt, met witte crepi en een schuifraam over de volle breedte' },
      },
    ],
  },

  werk: { kop: '', onder: '', fotos: [] },

  /* 5 okt, blauwdruk: het vangnet voor wie nog oriënteert, met de rekenaar achter een knop. */
  vangnet: {
    /* 5 okt, "de drie paginas": de knop gaat naar de losse rekenaar (/lp/richtprijs-berekenen). */
    kop: 'Liever eerst een indicatie van de kosten?',
    tekst: 'Wilt u weten waar u financieel aan toe bent voordat we langskomen? Bereken uw richtprijs in 2 minuten. 100% vrijblijvend.',
    knop: 'Bereken uw richtprijs in 2 minuten',
    href: '/lp/richtprijs-berekenen',
  },

  /* 5 okt: de volgorde van de blauwdruk. Bewijs (werk en voor/na) direct na de hero, dan
     frustratie en oplossing, het stappenplan, de diensten, het vangnet en de vragen. */
  /* Gestript: zonder het fotospoor, alleen de voor/na als bewijs. */
  volgorde: ['voorna', 'waarom', 'werkwijze', 'diensten', 'vangnet', 'faq'],

  /* 29 sep, Mohammed: "meer goeie puntjes? dat de particulier wilt zien", "kijk
     ooms woonrealisaties en verelst en zedreno". Ooms en Verelst hebben allebei
     een blok veelgestelde vragen; de vragen hieronder zijn de angsten van wie een
     hele woning laat renoveren (wonen tijdens de werken, meerwerk, faseren,
     architect, vergunning), met AB's eigen antwoorden. */
  faq: {
    kop: 'Veelgestelde vragen',
    /* 5 okt: de vijf vragen en antwoorden uit de blauwdruk, letterlijk. */
    lijst: [
      { v: 'Kan ik in huis blijven wonen tijdens de werken?',
        a: 'In de meeste gevallen is dat mogelijk. Dit is uiteraard afhankelijk van de omvang van de renovatie. We bespreken dit altijd tijdens het plaatsbezoek en plannen de werkzaamheden zo in dat u, indien nodig, de essentiële voorzieningen kunt blijven gebruiken en we de hinder tot een absoluut minimum beperken.' },
      { v: 'Hoe werkt jullie budgetgarantie precies?',
        a: 'AB Bouw Groep hanteert een strikte 100% budgetgarantie. De prijs op de offerte na het plaatsbezoek is de prijs die u betaalt. Eventueel meerwerk komt uitsluitend voor als u tijdens het traject zélf besluit om aanpassingen of extra wensen toe te voegen. Dit wordt altijd vooraf en transparant met u besproken.' },
      { v: 'Kan ik de werken ook in fases laten uitvoeren?',
        a: 'Ja, u kunt de renovatie ook in fases laten uitvoeren. Tijdens het adviesgesprek denken we graag met u mee over de meest logische en kostenefficiënte volgorde, bijvoorbeeld eerst de schil (dak en gevel) en later de binnenafwerking.' },
      { v: 'Regelen jullie ook de vergunningen?',
        a: 'Ja, indien uw project architecturale ingrepen of vergunningen vereist, nemen wij dit volledig voor onze rekening. Wij werken nauw samen met ervaren architecten en regelen al het papierwerk met uw gemeente. U heeft er geen omkijken naar.' },
      { v: 'Hoe helpen jullie bij de aanvraag van premies?',
        a: 'Renoveren geeft vaak recht op aanzienlijke overheidspremies. Onze experts kennen de actuele regelgeving in Vlaanderen door en door. Wij leveren u de correcte attesten aan, begeleiden het EPC-traject en helpen u bij de effectieve aanvraag, zodat u maximaal profiteert van de subsidies.' },
    ],
  },

  /* Mohammed: "wat klanten schrijven, weg". Een lege lijst toont de sectie niet. */
  reviews: { kop: '', beeld: { src: doorgang, alt: '' }, lijst: [] },

  werkwijze: {
    /* 5 okt: de vijf stappen uit de blauwdruk, letterlijk. */
    kop: 'Heldere afspraken in 5 stappen',
    onder: '',
    stappen: [
      { titel: 'Plaatsbezoek', icoon: 'pin', tekst: 'We komen langs om uw woning te bekijken en de mogelijkheden te bespreken.' },
      { titel: 'Vaste prijs offerte', icoon: 'offerte', tekst: 'U ontvangt een helder, gedetailleerd voorstel zonder kleine lettertjes.' },
      { titel: 'Planning & voorbereiding', icoon: 'agenda', tekst: 'Bij akkoord leggen we de startdatum vast en bereiden we de werken tot in de puntjes voor.' },
      { titel: 'De uitvoering', icoon: 'helm', tekst: 'Onze vakmensen gaan aan de slag. U wordt proactief op de hoogte gehouden.' },
      { titel: 'Oplevering', icoon: 'sleutel', tekst: 'We lopen alles samen na en sluiten pas af als u 100% tevreden bent.' },
    ],
  },

  cta: {
    /* 5 okt, blauwdruk: de conversiesectie. naam blijft "Gratis plaatsbezoek": de knop in de
       vaste balk op de telefoon en de regel in het CRM. */
    kop: 'Plan uw gratis plaatsbezoek',
    tekst: 'We komen ter plaatse om uw project te bespreken en u direct inzicht te geven in de mogelijkheden en het budget.',
    naam: 'Gratis plaatsbezoek',
    punten: [],
    foto: { src: doorgang, alt: 'Afgewerkte leefruimte uit een totaalrenovatie van AB Bouw Groep' },
  },

  inspectie: {
    kop: '',
    /* 5 okt, blauwdruk: "Bevestig mijn gratis plaatsbezoek", velden en labels letterlijk. */
    knop: 'Bevestig mijn gratis plaatsbezoek',
    knopPijl: true,
    onder: 'Wij bellen u binnen één werkdag om een moment af te spreken.',
    alt: 'Liever eerst een prijs? Bereken hem in 2 minuten',
    bronLead: 'lp:totaalrenovatie:inspectie',
    /* 5 okt, "de drie paginas": het uniforme formulier, velden en labels letterlijk. */
    plaatsbezoek: {
      naam: 'Voornaam & achternaam', naamHint: 'Uw voor- en achternaam',
      email: 'E-mailadres', emailHint: 'uw@email.be',
      /* ‑ = vast koppelteken: "premie-check" breekt niet over twee regels. */
      gsm: 'GSM-nummer', gsmUitleg: '(Voor de afspraakplanning & uw gratis premie‑check)', gsmHint: '04xx xx xx xx',
      postcode: 'Postcode of gemeente', postcodeHint: 'Bijv. 2800',
    },
    vertrouwen: [
      { icoon: 'slot', tekst: 'Wij gebruiken uw gegevens enkel voor deze aanvraag. Uw privacy is veilig.' },
      { icoon: 'telefoon', tekst: 'We bellen u binnen 1 werkdag om de afspraak in te plannen.' },
      { icoon: 'euro', tekst: 'Zowel het plaatsbezoek als de daaropvolgende offerte zijn 100% gratis.' },
    ],
    /* Mohammed, 26 sep: "voeg een paar bijhorende dropdown menus of vragen toe, maar
       hou het wel hoge conversie", "want bij totaalrenovatie willen ze juist meer".
       Drie keuzelijsten, geen enkele verplicht. Het budget is voor AB de sterkste
       filter op grote projecten (Bardh: grote werken). */
    extra: [
      /* 29 sep, Mohammed: "gelijkvloers eerste verdieping geeft te weinig optie ...
         zonder dat t overwhelming word". Nog altijd één keuzelijst, nu per ruimte, in
         dezelfde woorden als de rekenaar. */
      /* 5 okt, "de drie paginas" (Exacte Setup): twee keuzelijsten, geen budget meer. */
      /* Derde versie: zijn korte keuzes. Ze gaan als tekst naar het CRM (aanvullende_info). */
      { naam: 'omvang', label: 'Wat wilt u renoveren?', opties: ['De hele woning (totaalrenovatie)', 'Gedeeltelijke renovatie', 'Aanbouw', 'Specifieke werken'] },
      { naam: 'start', label: 'Wanneer wilt u starten?', opties: ['Zo snel mogelijk', 'Binnen 6 maanden', 'Volgend jaar', 'Ik verken nog'] },
    ],
  },
};
