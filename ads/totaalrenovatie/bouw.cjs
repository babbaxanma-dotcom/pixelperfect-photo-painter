/**
 * Totaalrenovatie-campagne AB Bouw (Google Ads), gebouwd op 26 sep 2026. LIVE sinds 28 sep 2026
 * (Mohammed: "totaalrenovatie advertentie mag online", "Doe het nu"), campagne-ID 24290242482,
 * groepen Totaalrenovatie (34) en Prijs renovatie (24), 189 uitsluitingen, 6 sitelinks, 9 highlights,
 * snippet Services. Deze file blijft de bron: elke wijziging hier eerst, dan in Google Ads.
 *
 * Landingspagina: /lp/totaalrenovatie (vorm van /lp/dakwerken, calculator in de hero).
 *
 * Waar de hoeken vandaan komen (ads/totaalrenovatie/ads-v2.cjs, meting 15 sep, 129
 * advertenties van 38 adverteerders, plus Transparency Center 25 sep):
 *   vol, dus niet gebruikt:  "één aanspreekpunt / A tot Z" (15 van 38), "ontzorgen" (13),
 *                            "X jaar ervaring" (11)
 *   leeg en bewezen:         6% btw of premie (1 van 38, Kijzer 328 dagen), eigen personeel
 *                            (2 van 38, Tifre 771 dagen), prijs berekenen (3 van 38, Rinovato)
 *   het zoekwoord als kop:   Rinovato, 477 dagen: "Aannemer Totaalrenovatie",
 *                            "{KeyWord:Aannemer in jouw buurt}", "Renoveren met 1 Totaalaannemer"
 * EPC: Mohammed, 26 sep: "begeleiding bij EPC-attest en premiebegeleiding". Op de pagina:
 * "Wij begeleiden u bij uw EPC-attest en regelen de aanvraag van uw Mijn VerbouwPremie."
 * Dus "EPC-begeleiding" mag; "inclusief EPC-attest" niet (het attest maakt een energiedeskundige).
 *
 * Onderzoek 27 sep (onderzoek-27sep/, Mohammed: "we gaan niet blind starten"):
 *   concurrenten:  Transparency Center, 51 actieve renovatie-aannemers. De tien die het langst
 *                  lopen (RuverkO 1446 dagen, Verelst 997, Builthings 759) zeggen gratis/vrijblijvend
 *                  (7 van 10), bewijs (6), één aanspreekpunt (6), lokaal (5). Prijszekerheid staat bij
 *                  4 van 33 op de zoekpagina (Verelst: "Binnen timing én binnen budget"), dus
 *                  "Vaste prijs na plaatsbezoek" (bron: de pagina en de homepage).
 *   zoekwoorden:   1663 autocomplete-aanvullingen, 491 kopers. 120 kopers vielen buiten de oude 29
 *                  zoekwoorden (woning renoveren, volledige renovatie, huis verbouwen, renovatiekosten,
 *                  algemene aannemer ...), nu opgenomen. 3 oude uitsluitingen blokkeerden kopers
 *                  (goedkoopste, subsidie aanvragen, badkamer), nu weg of versmald. Uitsluitingen
 *                  matchen geen meervoud of samenstelling ("vacature" blokkeert "vacatures" niet),
 *                  dus die staan er apart bij, net als de junk die "huis renoveren" en "renovatie
 *                  woning" vangen (youtube, lening, tunnels, buitenland, concurrenten).
 *   filterkop:     zoals dak een gepinde kop op positie 2 met "hele", zodat wie één kamer of één
 *                  vloer zoekt niet klikt.
 *   VCA:           uit koppen en beschrijvingen; Mohammed noemde het op de pagina "een raar puntje".
 *
 * Dit script faalt (exit 1) als een tekst te lang is, een verboden zinsbouw of een getal
 * zonder bron op de pagina bevat, een kop dubbel staat, of een uitsluiting een eigen
 * zoekwoord blokkeert. Het toetst ook de 681 uitsluitingen van de dakcampagne, zodat
 * zichtbaar is wat een kopie van die campagne zou blokkeren.
 *
 * Draaien: node ads/totaalrenovatie/bouw.cjs
 */
const fs = require('fs');
const path = require('path');
const MAP = __dirname;

const CAMPAGNE = 'AB Bouw — Totaalrenovatie — Search';
const URL = 'https://www.abgroep.be/lp/totaalrenovatie';

/* ---------- Instellingen (door Claude beslist, Mohammed keurt) ---------- */
const INSTELLINGEN = {
  status: 'Aangezet (28 sep 2026, campagne-ID 24290242482)',
  budgetPerDag: 40,            // zie BUDGET hieronder
  bieding: 'Klikken maximaliseren, zonder max. CPC (Mohammed, 27 sep: "geen cpc maximaal")',
  netwerk: 'Alleen Google Zoeken (geen zoekpartners, geen Display)',
  aiMax: 'uit', breedZoeken: 'uit',
  taal: 'Nederlands',
  locatie: 'Dezelfde 36 gemeenten als de dakcampagne (arrondissementen Antwerpen en Mechelen, Beveren-Kruibeke-Zwijndrecht, zonder de 6 verste), stad Antwerpen uitgesloten (Bardh, 23 sep), optie Aanwezigheid',
  /* 5 okt: Essen, Wuustwezel, Brecht, Kalmthout, Malle en Zoersel verwijderd uit dak EN totaalrenovatie (Mohammed: "ja eruit").
     Dat zijn de 6 gemeenten op meer dan 33 km in vogelvlucht van AB (Dokter Persoonslaan 33, Willebroek): 46,0 tot 34,0 km;
     daarna komen Stabroek en Kapellen op 30,3 km. Reden: beide campagnes geven elk dag hun volle budget uit en verliezen
     14 tot 22% van de vertoningen door budget, terwijl de 6 samen 14% van de vertoningen waren. Een kleiner gebied kost dus
     geen klikken; het geld gaat naar zoekers dichter bij Willebroek. Hun 0 conversies op 30 klikken is toeval (2 verwacht). */
  doelen: 'Leadformulieren, Leads van telefoongesprekken, Offertes aanvragen (zoals dak)',
  urlAchtervoegsel: 'utm_source=google&utm_medium=cpc&utm_campaign=totaalrenovatie&utm_term={keyword}',
  /* 4 okt 23:55: woordgroep "algemene aannemer" op pauze (Mohammed: "oke"). 28 sep - 4 okt: 20 klikken, € 53,83,
     0 conversies; de andere zoekwoorden samen 78 klikken, 9 conversies. De zoekopdracht noemt geen renovatie, dus
     de pagina past er niet bij. Regel (Mohammed, 4 okt): zoekwoorden met slechte message match gaan eruit, de pagina
     wordt niet breder gemaakt. Hij staat nog in GROEPEN hieronder, want die lijst is de upload van 28 sep. */
  /* 5 okt: ook "renovatie bedrijf" en "verbouwingswerken" op pauze (Mohammed: "oke doe maar"). Samen 16 klikken, € 43,18,
     0 conversies; zoekwoorden die de woning noemen 64 klikken, 8 conversies. Regel: het budget is elke dag op, dus een
     zoekwoord dat zwakker is dan de rest mag eruit, ook zonder bewijs dat het slecht is. "aannemer renovatiewerken" blijft
     (2 klikken, 1 conversie). Pauze, geen uitsluiting: een uitsluiting blokkeert ook "verbouwingswerken woning". */
  /* 6 okt (Mohammed: "die bouncden ... gaat weer aan, en vervolgens die leiden naar de nieuwe landingspagina",
     "zoektermen die bij de prijs doorgingen ... naar de landingspagina van de prijs rekenaar"). Uiteindelijke URL op
     ZOEKWOORDNIVEAU (de advertenties blijven ongewijzigd):
     - groep Prijs renovatie, alle 42 zoekwoorden -> https://www.abgroep.be/lp/richtprijs-berekenen
     - groep Totaalrenovatie, 16 aannemer-zoekwoorden -> https://www.abgroep.be/lp/aannemer-renovatiewerken:
       algemene aannemer, algemene aannemer renovatie, renovatie bedrijf, renovatiebedrijf, renovatiefirma,
       renovatie firma, verbouwingswerken, aannemer renovatiewerken, aannemer renovatie, renovatie aannemer,
       renovatie aannemers, aannemer renovaties, aannemer verbouwing, bouwbedrijf renovatie, aannemer voor
       renovatie, aannemer energetische renovatie (alle woordgroep). Algemene aannemer, renovatie bedrijf en
       verbouwingswerken staan weer AAN. De rest van de groep gaat via de advertentie naar /lp/totaalrenovatie. */
  /* 6 okt 11:45 (Mohammed: "In Google Ads maak je er dit van: [algemene aannemer] en [renovatie bedrijf]", "maak ze gewoon
     exact match"): beide van woordgroep naar EXACT, via Bewerken > Zoektypen wijzigen (Google verwijdert het oude zoekwoord
     en maakt een nieuw; de URL /lp/aannemer-renovatiewerken is meegegaan, nagelezen). Statistieken van vóór 6 okt staan op
     het verwijderde zoekwoord. "verbouwingswerken" blijft woordgroep. Reden: de woordgroep-varianten trokken firmanamen en
     plaatsen aan (slk projects, jos de jongh, 3bouw via "algemene aannemer"; dcs via "renovatie bedrijf"). */
  /* 6 okt 12:40 (verificatie met 5 controleurs op Fable; Mohammed: "het budget is kapot aan het gaan", "doe alle
     aanpassingen"). De 16 aannemer-zoekwoorden kostten 28 sep-5 okt €139,42 voor 1 conversie (48 klikken, 2,1%) tegen
     €22,70 (woning, 3/25) en €24,61 (prijs, 5/46); bij vol budget verdringt elke aannemer-klik een woning-klik. Daarom
     13 woordgroep-aannemer-zoekwoorden op PAUZE: algemene aannemer renovatie, renovatiebedrijf, renovatiefirma,
     renovatie firma, verbouwingswerken, aannemer renovatie, renovatie aannemer, renovatie aannemers, aannemer
     renovaties, aannemer verbouwing, bouwbedrijf renovatie, aannemer voor renovatie, aannemer energetische renovatie.
     AAN naar /lp/aannemer-renovatiewerken blijven: [algemene aannemer], [renovatie bedrijf] (exact) en "aannemer
     renovatiewerken" (2 klikken, 1 conversie). Firmanamen kwamen ook via de kleine zoekwoorden (janco via bouwbedrijf
     renovatie; 6 namen op 5-6 okt via renovatiebedrijf/renovatie aannemer/aannemer verbouwing), dus niet alleen via de drie. */
};

/* ---------- Zoekwoorden: twee groepen op zoekintentie ---------- */
// w = woordgroep, e = exact. Geen breed zoeken.
const GROEPEN = {
  'Totaalrenovatie': {
    kern: 'totaalrenovatie',
    zoekwoorden: [
      ['totaalrenovatie', 'w'], ['totaalrenovatie', 'e'], ['totaalrenovatie woning', 'w'], ['totaalrenovatie huis', 'w'],
      ['woning volledig renoveren', 'w'], ['huis volledig renoveren', 'w'], ['aannemer totaalrenovatie', 'w'],
      ['renovatie aannemer', 'w'], ['aannemer renovatie', 'w'], ['algemene aannemer renovatie', 'w'],
      ['aannemer verbouwing', 'w'], ['huis gekocht renoveren', 'w'], ['oude woning renoveren', 'w'],
      ['woning strippen en renoveren', 'w'], ['renovatiebedrijf', 'w'], ['renovatie woning', 'w'], ['huis renoveren', 'w'],
      // 27 sep: kopers uit de autocomplete die de lijst hierboven niet vangt
      ['woning renoveren', 'w'], ['renovatie huis', 'w'], ['woningrenovatie', 'w'], ['volledige renovatie', 'w'],
      ['huis compleet renoveren', 'w'], ['huis laten renoveren', 'w'], ['huis volledig laten renoveren', 'w'],
      ['renovatie oude woning', 'w'], ['renovatie rijwoning', 'w'], ['rijwoning renoveren', 'w'], ['huis verbouwen', 'w'],
      ['woning verbouwen', 'w'], ['verbouwingswerken', 'w'], ['aannemer renovatiewerken', 'w'], ['algemene aannemer', 'w'],
      ['aannemer voor renovatie', 'w'], ['aannemer energetische renovatie', 'w'],
    ],
    pad: ['totaal', 'renovatie'],
    pin2: 'Uw hele woning gerenoveerd',
    koppen: [
      'Aannemer voor totaalrenovatie',   // positie 1, gepind met de KeyWord-kop
      '{KeyWord:Aannemer totaalrenovatie}',
      /* Positie 2, gepind: filterkop. Wie één kamer of één vloer zoekt, klikt hier niet. */
      'Uw hele woning gerenoveerd',
      'Bereken uw prijs in 2 minuten',
      '6% btw bij woning 10+ jaar',
      'Hulp bij Mijn VerbouwPremie',
      'Gratis plaatsbezoek en offerte',
      'Vaste prijs na plaatsbezoek',
      'Zes afdelingen in huis',
      'Eén planning voor alle werken',
      'Inclusief EPC-begeleiding',
      'Totaalrenovatie in {LOCATION(City):uw regio}',
      'Huis gekocht om te renoveren?',
      'AB Bouw Groep: renovatie',
      'Eigen ploeg, elke dag dezelfde',   // pagina, werkwijze: "Dezelfde ploeg komt elke dag terug."
    ],
    beschrijvingen: [
      'Bereken in 2 minuten de prijs van uw renovatie. Gratis plaatsbezoek en offerte.',
      'Zes afdelingen in huis: onze eigen ploegen doen elk vak, volgens één planning.',
      'Woning ouder dan tien jaar? Dan geldt 6% btw. Wij regelen uw Mijn VerbouwPremie.',
      'Tijdens de werken schermen wij de woning af tegen stof en ruimen we elke avond op.',
    ],
  },
  'Prijs renovatie': {
    kern: 'renovatie',
    zoekwoorden: [
      ['renovatie kostprijs', 'w'], ['kostprijs totaalrenovatie', 'w'], ['prijs totaalrenovatie', 'w'],
      ['wat kost een huis renoveren', 'w'], ['wat kost een totaalrenovatie', 'w'], ['huis renoveren prijs', 'w'],
      ['woning renoveren kostprijs', 'w'], ['renovatie prijs per m2', 'w'], ['renovatiekosten berekenen', 'w'],
      ['prijs huis renoveren', 'w'], ['kostprijs renovatie woning', 'w'], ['totaalrenovatie prijs', 'w'],
      // 27 sep: prijszoekers uit de autocomplete die de lijst hierboven niet vangt
      ['renovatiekosten', 'w'], ['renovatie prijs', 'w'], ['renovatie offerte', 'w'], ['offerte renovatie', 'w'],
      ['verbouwing prijs', 'w'], ['huis verbouwen kosten', 'w'], ['woning verbouwen kosten', 'w'],
      ['woning renoveren kosten', 'w'], ['renovatie huis kosten', 'w'], ['volledige renovatie kosten', 'w'],
      ['huis laten renoveren kosten', 'w'], ['kostprijs renovatie huis', 'w'],
    ],
    pad: ['prijs', 'renovatie'],
    pin2: 'Prijs voor de hele woning',
    koppen: [
      'Wat kost uw totaalrenovatie?',     // positie 1, gepind met de KeyWord-kop
      '{KeyWord:Prijs totaalrenovatie}',
      /* Positie 2, gepind: filterkop. Wie de prijs van één badkamer of vloer zoekt, klikt hier niet. */
      'Prijs voor de hele woning',
      'Prijs in 2 minuten berekend',
      'AB Bouw Groep: totaalrenovatie',
      '6% btw voor woning 10+ jaar',
      'Inclusief premiebegeleiding',
      'Gratis plaatsbezoek',
      'Gratis en vrijblijvend',
      'Eigen ploegen voor elk vak',
      'Renovatie in {LOCATION(City):uw regio}',
      'Wat kost een huis renoveren?',
      'Kostprijs renovatie woning',
      'Vaste prijs op uw offerte',
      'Zes afdelingen, één planning',
    ],
    beschrijvingen: [
      'Wat kost uw renovatie? Beantwoord zes korte vragen op onze website. Klaar in 2 minuten.',
      'Na het gratis plaatsbezoek krijgt u een vaste prijs. Wat op de offerte staat, betaalt u.',
      'Woning ouder dan tien jaar? 6% btw, en wij regelen de aanvraag van uw premie.',
      'Eigen ploegen voor ruwbouw en afwerking, volgens één planning. Volledig verzekerd.',
    ],
  },
};

/* ---------- Componenten op campagneniveau ---------- */
const SITELINKS = [
  { tekst: 'Bereken uw renovatieprijs', r1: 'Klaar in 2 minuten', r2: 'Gratis en vrijblijvend', url: URL + '#rekenaar' },
  { tekst: 'Gratis plaatsbezoek', r1: 'We bekijken uw woning ter plaatse', r2: 'Daarna een vrijblijvende offerte', url: URL + '#contact' },
  { tekst: 'Onze diensten', r1: 'Zes afdelingen in huis', r2: 'Eén planning voor alle werken', url: URL + '#diensten' },  // 27 sep: de sectie toont nu de zes afdelingen
  { tekst: 'Zo verloopt uw renovatie', r1: 'In vijf duidelijke stappen', r2: 'U weet vooraf wat er gebeurt', url: URL + '#werkwijze' },
  { tekst: 'Voor en na', r1: 'Sleep de balk over de foto', r2: 'Een werf van AB Bouw Groep', url: URL + '#voorna' },  // 27 sep: "uitbouw/aanbouw" van de pagina gehaald
  { tekst: 'EPC- en premiebegeleiding', r1: 'Begeleiding bij uw EPC-attest', r2: 'Hulp bij Mijn VerbouwPremie', url: URL + '#waarom' },
];
const HIGHLIGHTS = ['Gratis plaatsbezoek', 'Eigen ploegen', 'Vaste prijs', 'Volledig verzekerd', 'Zes afdelingen in huis',
  'Premiebegeleiding', 'EPC-begeleiding', '6% btw vanaf 10 jaar', 'Prijs in 2 minuten'];
/* 27 sep: dezelfde zes afdelingen als de sectie "Onze diensten" op de pagina. */
const SNIPPETS = [
  { kop: 'Services', waarden: ['Totaalrenovatie', 'Ecologisch bouwen', 'Interieurwerken', 'Dakwerken', 'Badkamer en wellness', 'Gevelrenovatie'] },
];

/* ---------- Uitsluitingen van deze campagne ---------- */
// [tekst, type] met type w (woordgroep) of e (exact). Omgekeerde bewijslast (CLAUDE.md):
// alleen woorden waarvan vaststaat dat geen koper van een totaalrenovatie ze typt.
const UITSLUITEN = [
  // uit 3-negatives.csv (15 sep)
  ['zelf renoveren', 'w'], ['doe het zelf', 'w'], ['stappenplan', 'w'], ['checklist', 'w'], ['opleiding', 'w'],
  ['cursus', 'w'], ['vacature', 'w'], ['jobs', 'w'], ['stage', 'w'], ['loon', 'w'], ['renovatielening', 'w'],
  ['hypotheek', 'w'], ['immoweb', 'w'], ['zimmo', 'w'], ['te huur', 'w'], ['nederland', 'w'], ['wallonie', 'w'],
  ['charleroi', 'w'], ['forum', 'w'], ['klachten', 'w'], ['failliet', 'w'], ['wikipedia', 'w'], ['betekenis', 'w'],
  ['tweedehands', 'w'], ['containerwoning', 'w'], ['mobilhome', 'w'], ['caravan', 'w'],
  // 26 sep: deelwerken met een eigen pagina of een kleine opdracht, en andere bestemmingen
  ['keuken', 'w'], ['dak', 'w'], ['dakwerken', 'w'], ['gevel', 'w'], ['schilder', 'w'],
  ['schilderwerken', 'w'], ['behangen', 'w'], ['laminaat', 'w'], ['parket leggen', 'w'], ['kantoor', 'w'],
  ['winkel', 'w'], ['horeca', 'w'], ['kerk', 'w'], ['school', 'w'], ['gemeente', 'w'],
  /* 26 sep: 'epc' en 'renovatieplicht' NIET uitsluiten: wie een woning met een slecht label kocht, moet renoveren. */
  ['energiescan', 'w'], ['architect', 'w'], ['tekenaar', 'w'],
  ['gratis', 'e'], ['zwart', 'w'], ['in het zwart', 'w'],
  /* 27 sep: 'badkamer' blokkeerde "aannemer renovatie 1e verdieping inclusief badkamer"; nu alleen de
     zoekopdracht naar een losse badkamer. 'goedkoop(ste)' en 'subsidie aanvragen' weg: ze blokkeerden
     "totaalrenovatie goedkoopste prijs" en "totaalrenovatie subsidie aanvragen mechelen". */
  ['badkamer renovatie', 'w'], ['renovatie badkamer', 'w'], ['badkamer renoveren', 'w'], ['badkamerrenovatie', 'w'],
  ['totaalrenovatie badkamer', 'w'], ['verbouwing badkamer', 'w'],
  ['parket renovatie', 'w'], ['toilet renovatie', 'w'], ['tuin renovatie', 'w'], ['trap renovatie', 'w'], ['traprenovatie', 'w'],
  // 27 sep: meervoud en samenstelling van de lijst hierboven (een uitsluiting matcht die niet)
  ['vacatures', 'w'], ['stages', 'w'], ['cursussen', 'w'], ['jobstudent', 'w'], ['flexijob', 'w'], ['loonbrief', 'w'],
  ['loonbarema', 'w'], ['klachtendienst', 'w'], ['klachtenformulier', 'w'], ['klachtencommissie', 'w'], ['caravans', 'w'],
  ['containerwoningen', 'w'], ['kantoorruimte', 'w'], ['kantoormeubelen', 'w'], ['winkels', 'w'], ['schooltv', 'w'],
  ['schoolfeest', 'w'], ['schooluren', 'w'],
  // 27 sep: geld lenen en administratie
  ['lening', 'w'], ['krediet', 'w'], ['renovatiekrediet', 'w'], ['verbouwingslening', 'w'], ['hypotheekrente', 'w'],
  ['jaarrekening', 'w'], ['fiscaal', 'w'], ['aftrekbaar', 'w'], ['zelfstandige', 'w'], ['notaris', 'w'], ['fluvius', 'w'],
  ['cadgis', 'w'], ['kadaster', 'w'], ['excel', 'w'], ['xls', 'w'], ['huurder', 'w'], ['huren', 'w'], ['huur', 'w'],
  ['te koop', 'w'], ['kopen', 'w'], ['verhuizen', 'w'], ['overwaarde', 'w'], ['agrarisch', 'w'],
  // 27 sep: tv, video, school, taal en nieuws (tunnels en het Binnenhof zijn werven in het nieuws)
  ['youtube', 'w'], ['quiz', 'w'], ['quizlet', 'w'], ['quotes', 'w'], ['xxl', 'w'], ['programma', 'w'],
  ['voor een ton', 'w'], ['vtm', 'w'], ['qmusic', 'w'], ['boek', 'w'], ['animal crossing', 'w'], ['ai', 'w'], ['ugc', 'w'],
  ['reddit', 'w'], ['zwarte lijst', 'w'], ['engels', 'w'], ['frans', 'w'], ['nederlands', 'w'], ['ugent', 'w'], ['uza', 'w'],
  ['uz', 'w'], ['cm', 'w'], ['condoleren', 'w'], ['xtc', 'w'], ['q8', 'w'], ['fortis', 'w'], ['binnenhof', 'w'],
  ['tunnel', 'w'], ['hubertustunnel', 'w'], ['rupeltunnel', 'w'], ['waaslandtunnel', 'w'], ['camper', 'w'], ['cadeau', 'w'],
  ['chalet', 'w'], ['loods', 'w'],
  // 27 sep: buitenland (de locatie-instelling kijkt naar waar iemand is, niet naar wat hij zoekt)
  ['spanje', 'w'], ['frankrijk', 'w'], ['italie', 'w'], ['duitsland', 'w'], ['curacao', 'w'], ['suriname', 'w'], ['ibiza', 'w'],
  ['zwarte woud', 'w'], ['amsterdam', 'w'], ['rotterdam', 'w'], ['den haag', 'w'], ['utrecht', 'w'], ['haarlem', 'w'],
  ['leiden', 'w'], ['kerkrade', 'w'], ['yerseke', 'w'], ['ypenburg', 'w'], ['ymere', 'w'],
  /* 27 sep: concurrenten (zoekpagina 15 sep, Transparency Center en autocomplete). Wie een merk zoekt,
     zoekt dat bedrijf (Ben Heath: concurrentnamen uitsluiten tenzij je er actief op biedt). */
  ['verelst', 'w'], ['kapareno', 'w'], ['martha', 'w'], ['vulsteke', 'w'], ['gijbels', 'w'], ['ruverko', 'w'],
  ['builthings', 'w'], ['cleys', 'w'], ['pintelon', 'w'], ['interieurkabinet', 'w'], ['total interior', 'w'], ['dhoore', 'w'],
  ['domico', 'w'], ['tifre', 'w'], ['grava', 'w'], ['renox', 'w'], ['reno x', 'w'], ['reno vlad', 'w'], ['noterman', 'w'],
  ['iha', 'w'], ['genki', 'w'], ['franssen', 'w'], ['jvr', 'w'], ['mitch', 'w'], ['mortier', 'w'], ['ooms', 'w'],
  ['schipper', 'w'], ['chrisma', 'w'], ['rinovato', 'w'], ['vanoverbeke', 'w'], ['zedreno', 'w'], ['x2o', 'w'], ['mh', 'w'],
  ['b&g', 'w'], ['bobex', 'w'], ['aannemeroffertes', 'w'],
  /* 28 sep (Mohammed: "super veel negatives die er niets mee te maken hebben maar deftige negatives
     weinig"). De lijst hierboven kwam uit de autocomplete-oogst; die toont rariteiten even groot als de
     grote groepen. Hieronder de soorten zoekers die geen aannemer zoeken, elk woord getoetst tegen de
     491 kopers. Bewust NIET: 'hoe' (blokkeert "hoe renovatiekosten berekenen"), 'verplicht(ingen)',
     'premie', 'subsidie(s)', 'epc' (kopers), 'planning' en 'duur' (dubbelzinnig), 'ervaringen'
     (wie een aannemer vergelijkt). */
  // doe-het-zelf
  ['zelf', 'w'], ['diy', 'w'], ['klussen', 'w'], ['klusser', 'w'], ['klushuis', 'w'], ['zelfbouw', 'w'],
  ['zonder aannemer', 'w'], ['goedkoop', 'w'],
  // uitleg en regels
  ['handleiding', 'w'], ['tutorial', 'w'], ['video', 'w'], ['tips', 'w'], ['wat is', 'w'], ['definitie', 'w'],
  ['uitleg', 'w'], ['hoe beginnen', 'w'], ['waar beginnen', 'w'], ['wat eerst', 'w'], ['volgorde', 'w'],
  ['stappen', 'w'], ['duurtijd', 'w'], ['hoelang', 'w'], ['hoe lang', 'w'], ['regels', 'w'], ['wetgeving', 'w'],
  ['normen', 'w'], ['vergunning', 'w'], ['omgevingsvergunning', 'w'], ['belasting', 'w'], ['pdf', 'w'],
  ['template', 'w'], ['sjabloon', 'w'],
  // inspiratie
  ['ideeën', 'w'], ['ideeen', 'w'], ['inspiratie', 'w'], ['voorbeelden', 'w'], ['voorbeeld', 'w'], ['voor en na', 'w'],
  // bouwmarkten en materiaal
  ['gamma', 'w'], ['brico', 'w'], ['hubo', 'w'], ['praxis', 'w'], ['hornbach', 'w'], ['ikea', 'w'],
  ['materiaal', 'w'], ['materialen', 'w'], ['bouwmaterialen', 'w'],
  /* 3 okt (Mohammed: "niet kopers uitsluiten in hoeverre je kan", "het doel is de klikken kwaliteit
     verhogen en geen budget verspillen", "er is niets vast beslist"). Bron: zoektermen 28 sep - 3 okt
     (228 termen, 86 klikken, 9 conversies). Premie en subsidie: Google-autocomplete gaf 495
     aanvullingen, waarvan 0 met aannemer, offerte, laten, bedrijf of firma; de vraag gaat over de
     regeling, niet over het werk. Het besluit van 27 sep (premie = koper) is hiermee herzien. */
  // premie en subsidie
  ['premie', 'w'], ['premies', 'w'], ['subsidie', 'w'], ['subsidies', 'w'], ['renovatiepremie', 'w'], ['renovatiepremies', 'w'], ['verbouwpremie', 'w'], ['verbouwloket', 'w'], ['verbouwlening', 'w'], ['mijnverbouwlening', 'w'], ['isolatiepremie', 'w'],
  // concurrenten uit het zoektermenrapport (wie een merk zoekt, zoekt dat bedrijf)
  ['portas', 'w'], ['vermeiren', 'w'], ['laerhoven', 'w'], ['dcs stekene', 'w'], ['bouwmakkers', 'w'], ['renotec', 'w'], ['vimmo', 'w'], ['bm renovaties', 'w'], ['ddg renovaties', 'w'], ['rebuilding team', 'w'], ['bowson', 'w'], ['mrw bouw', 'w'], ['manova', 'w'], ['ibo mechelen', 'w'], ['jef brabants', 'w'], ['vepreno', 'w'], ['zinder', 'w'], ['thuismakers', 'w'], ['linea projects', 'w'], ['inframe', 'w'], ['asobi', 'w'], ['avrs', 'w'], ['bart loos', 'w'], ['ben aerden', 'w'], ['bert van goethem', 'w'], ['brebuild', 'w'], ['van buggenhout', 'w'], ['carson', 'w'], ['de beule', 'w'], ['de peuter', 'w'], ['dero construct', 'w'], ['dhulst', 'w'], ['energco', 'w'], ['feys', 'w'], ['fixitom', 'w'], ['jv reno', 'w'], ['kmi aanbouw', 'w'], ['mcm malle', 'w'], ['rafal', 'w'], ['renisol', 'w'], ['rombouts', 'w'], ['rvh projects', 'w'], ['sam lingier', 'w'], ['slw solutions', 'w'], ['stijn grootjans', 'w'], ['tom tilleman', 'w'], ['valckenborgh', 'w'], ['versluys', 'w'], ['vdb verbouwingen', 'w'], ['vds', 'w'], ['willemen', 'w'], ['alltech', 'w'], ['van gorp', 'w'], ['abc renovatie', 'w'],
  // buiten het werkgebied (Nederland, West-Vlaanderen, Limburg, kust)
  ['geleen', 'w'], ['oosterhout', 'w'], ['hulst', 'w'], ['zulte', 'w'], ['westende', 'w'], ['kust', 'w'], ['lummen', 'w'],
  // geen dienst van AB of geen aannemer gezocht
  ['veranda', 'w'], ['woonunit', 'w'], ['architecten', 'w'], ['keukendeuren', 'w'], ['keukendeurtjes', 'w'], ['keukenfronten', 'w'], ['keukenkastdeuren', 'w'], ['keukenkast deuren', 'w'], ['remodeling', 'w'], ['elektriciteit', 'w'], ['mag je', 'w'],
  /* 6 okt (Mohammed: "werk dit uit", zwarte lijst klusjes). Getoetst: 0 van de 525 kopers. Bewust NIET uit die lijst:
     'dakkapel' en 'asbestdak vervangen' (diensten van AB: Diensten.tsx, RealisatiesDakwerken, asbestvraag in de
     dakrekenaar); premie/subsidie, woonunit en keukendeurtjes stonden er al. */
  ['klein toilet', 'w'], ['douche plaatsen', 'w'], ['badkamer in 1 dag', 'w'], ['trap renoveren', 'w'], ['terras uitbreken', 'w'],
  /* 6 okt (Mohammed: "doe alles"): lekken uit de zoektermen van 4-5 okt, na de uitsluitingen van 3 okt. "dcs stekene"
     blokkeerde "dcs interieur stekene" niet (woordgroep = aaneen). Getoetst: 0 van de 525 kopers; autocomplete geeft
     geen woningkoper met terras, landelijke stijl, verbouwtips of douchebak. */
  ['dcs interieur', 'w'], ['slk projects', 'w'], ['janco', 'w'], ['reyniers', 'w'], ['3bouw', 'w'], ['all reno interior', 'w'],
  ['djt', 'w'], ['jos de jongh', 'w'], ['baeten van es', 'w'], ['terras', 'w'], ['landelijke stijl', 'w'], ['verbouwtips', 'w'], ['douchebak', 'w'],
  /* 6 okt 12:30 (verificatie met 5 controleurs; Mohammed: "doe alle aanpassingen"). Bedrijfsvormen (firmanamen komen als
     "x bvba", "x projects" binnen, 7 verschillende in 8 dagen, 0 herhalingen) en losse klusjes uit de prijsgroep (2-4 okt:
     7 van 13 zichtbare klikken off-target: badkamer, elektriciteit, gyproc, trap, veranda). Getoetst: 0 van 525 kopers,
     autocomplete leeg. NIET "nv": koper "renovatie aannemer nv". NIET "dakkapel": dienst van AB. */
  ['gyproc', 'w'], ['bvba', 'w'], ['bv', 'w'], ['projects', 'w'], ['nieuwe badkamer', 'w'], ['inloopdouche', 'w'],
  // losse infovragen, exact
  ['renovatie 6 btw', 'e'], ['wanneer renoveren epc', 'e'], ['duurzaam renoveren nu', 'e'], ['all renovations', 'e'], ['renovatie experts', 'e'], ['binnendeuren renoveren', 'e'], ['vloerverwarming renovatie beperkte hoogte', 'e'],
];
/* 28 sep: elke soort niet-koper moet in de lijst staan. Zo kan een lijst niet meer groot lijken terwijl
   de grote groepen ontbreken. */
const VERPLICHTE_SOORTEN = {
  'doe-het-zelf': ['zelf', 'doe het zelf', 'diy', 'klussen'],
  uitleg: ['tips', 'wat is', 'handleiding', 'uitleg', 'stappenplan'],
  inspiratie: ['ideeën', 'inspiratie', 'voorbeelden', 'voor en na'],
  bouwmarkten: ['gamma', 'brico', 'hubo', 'praxis'],
  regels: ['vergunning', 'regels', 'wetgeving'],
  jobs: ['vacature', 'vacatures', 'jobs', 'opleiding'],
  lenen: ['lening', 'krediet', 'renovatielening', 'hypotheek'],
};

/* ---------- Budget (Mohammed: "het dagbudget mag je ook bepalen") ----------
   Zoekwoordplanner 26 sep, België, gemiddeld per maand: totaalrenovatie 880, renovatie woning 210,
   huis renoveren 480, renovatie aannemer 390; bod bovenaan €1,60 (laag) en €6,83 (hoog).
   Klikprijs voor de rekensom: €4,22 (midden van die twee). €40 per dag = 9 klikken per dag.
   Benchmark bouw/aannemers (LocaliQ 2025, localiq.com/blog/home-services-search-advertising-benchmarks,
   april 2024 tot maart 2025): conversie 2,61%, dus 1 lead per 38 klikken. Dan 1 lead per 4,0 dagen,
   kost per lead €160. (26 sep gecorrigeerd: eerst 31 klikken, afgeleid uit kost per lead gedeeld door
   klikprijs; dat deelt twee gemiddelden en is niet de conversie. Dak rekent ook met de conversie.) */
const BUDGET = { perDag: INSTELLINGEN.budgetPerDag, klikprijs: 4.22, klikkenPerLead: Math.round(1 / 0.0261) };

/* ---------- Toetsen ---------- */
const tok = (s) => s.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôöùûüç² ]/g, ' ').split(/\s+/).filter(Boolean);
function blokkeert(neg, type, query) {
  const n = tok(neg), q = tok(query);
  if (type === 'e') return n.join(' ') === q.join(' ');
  if (type === 'b') return n.every((t) => q.includes(t));
  for (let i = 0; i + n.length <= q.length; i++) if (n.every((t, j) => q[i + j] === t)) return true;
  return false;
}
const fouten = [];
/* Positieve controle op de blokkeertoets. */
for (const [n, ty, q, verwacht] of [['badkamer', 'w', 'badkamer renoveren prijs', true], ['dak', 'w', 'totaalrenovatie woning', false], ['gratis', 'e', 'gratis offerte renovatie', false]]) {
  if (blokkeert(n, ty, q) !== verwacht) { console.error(`TOETS DEFECT op "${n}" / "${q}"`); process.exit(2); }
}
for (const [naam, g] of Object.entries(GROEPEN)) for (const [kw] of g.zoekwoorden) for (const [t, ty] of UITSLUITEN) {
  if (blokkeert(t, ty, kw)) fouten.push(`uitsluiting "${t}" blokkeert eigen zoekwoord "${kw}" (${naam})`);
}
/* Koperzoekopdrachten die NIET geblokkeerd mogen worden. */
const KOPER = ['renovatie woning epc label', 'renovatieplicht woning aannemer', 'totaalrenovatie woning prijs', 'aannemer totaalrenovatie antwerpen', 'wat kost een totaalrenovatie per m2', 'huis gekocht volledig renoveren',
  'renovatie oude woning kostprijs', 'totaalrenovatie offerte', 'renovatie woning 6 btw', 'aannemer renovatie in de buurt'];
/* 3 okt: 'woning renoveren premie' is geen koper meer (premie en subsidie uitgesloten, zie UITSLUITEN). */
for (const q of KOPER) for (const [t, ty] of UITSLUITEN) if (blokkeert(t, ty, q)) fouten.push(`uitsluiting "${t}" blokkeert koper "${q}"`);
/* 27 sep: ook geen enkele koper uit het autocomplete-onderzoek (491 kopers plus wie een premie of
   subsidie voor de renovatie zoekt). */
const ONDERZOEK = require('./onderzoek-27sep/zoekwoorden.json').aanvullingen.filter((a) => a.klasse === 'KOPER' || a.koopnabij)
  /* 3 okt: premie- en subsidievragen tellen niet meer als koper (zie UITSLUITEN). */
  .filter((a) => !/premie|subsidie/i.test(a.tekst));
if (ONDERZOEK.length < 400) { console.error(`TOETS DEFECT: ${ONDERZOEK.length} kopers uit het onderzoek`); process.exit(2); }
for (const a of ONDERZOEK) for (const [t, ty] of UITSLUITEN) if (blokkeert(t, ty, a.tekst)) fouten.push(`uitsluiting "${t}" blokkeert koper "${a.tekst}" (autocomplete)`);
const dubbel = UITSLUITEN.map(([t, ty]) => ty + t).filter((x, i, l) => l.indexOf(x) !== i);
if (dubbel.length) fouten.push(`dubbele uitsluitingen: ${dubbel.join(', ')}`);
for (const [soort, woorden] of Object.entries(VERPLICHTE_SOORTEN)) for (const w of woorden) {
  if (!UITSLUITEN.some(([t]) => t === w)) fouten.push(`soort "${soort}": uitsluiting "${w}" ontbreekt`);
}

const VERBODEN = [
  { re: /zonder (gedoe|stress|zorgen)|ontzorg|zorgeloos/i, waarom: '13 van de 38 concurrenten zeggen dit al' },
  { re: /van a ?(tot|-) ?z|één aanspreekpunt|1 aanspreekpunt/i, waarom: '15 van de 38 concurrenten zeggen dit al' },
  { re: /\bpartner\b/i, waarom: 'meest gebruikte woord in de markt' },
  { re: /\b(geen|niet|zonder|nooit)\b/i, waarom: 'negatie-framing' },
  { re: /nr\.? ?1|#1|beste|sterren|review/i, waarom: 'claim die AB niet kan dragen (1 Google-review)' },
  { re: /!/, waarom: 'geen uitroepteken op search' },
  { re: /inclusief epc-attest|epc-attest inbegrepen/i, waarom: 'het EPC-attest maakt een energiedeskundige; AB begeleidt' },
  { re: /\bVCA\b/, waarom: 'Mohammed, 26 sep: VCA is voor een particulier "een raar puntje"' },
  { re: /\b(?!EPDM\b|VCA\b)[A-Z]{4,}\b/, waarom: 'geen hoofdletterwoorden' },
  { re: /\b(rond|omgeving|regio|provincie|antwerpen|mechelen|brasschaat|schilde|schoten|wilrijk|vlaanderen)\b/i, waarom: 'plaatsnaam in de tekst; gebruik {LOCATION(City):uw regio}', zonderLocatie: true },
];
const INVOEGING = /\{LOCATION\(City\):([^}]*)\}|\{KeyWord:([^}]*)\}/g;
// Elk getal moet op /lp/totaalrenovatie staan (inhoud-totaalrenovatie.ts).
const TOEGESTAAN_GETAL = [/\b2 minuten\b/, /6%/, /\b(10|tien) jaar\b/i, /\b10\+ jaar\b/, /\bzes\b/i];
function toets(tekst, max, soort) {
  const zichtbaar = tekst.replace(INVOEGING, (_, loc, kw) => loc ?? kw);
  if (/\{(?!KeyWord:|LOCATION\(City\):)[^}]*\}/.test(tekst)) fouten.push(`${soort} "${tekst}": onbekende invoeging`);
  if (zichtbaar.length > max) fouten.push(`${soort} ${zichtbaar.length}/${max} tekens: "${tekst}"`);
  const zonder = tekst.replace(INVOEGING, '');
  for (const v of VERBODEN) if (v.re.test(v.zonderLocatie ? zonder : zichtbaar)) fouten.push(`${soort} "${tekst}": ${v.waarom}`);
  if (/\d/.test(zichtbaar) && !TOEGESTAAN_GETAL.some((re) => re.test(zichtbaar))) fouten.push(`${soort} "${tekst}": getal zonder bron op de landingspagina`);
}
const alleKoppen = new Map();
for (const [naam, g] of Object.entries(GROEPEN)) {
  if (g.koppen.length !== 15) fouten.push(`${naam}: ${g.koppen.length} koppen, verwacht 15`);
  if (g.beschrijvingen.length !== 4) fouten.push(`${naam}: ${g.beschrijvingen.length} beschrijvingen, verwacht 4`);
  const vragen = g.koppen.filter((k) => k.includes('?')).length;
  if (vragen > 7) fouten.push(`${naam}: ${vragen} vraagkoppen`);
  for (const k of g.koppen) {
    toets(k, 30, `kop (${naam})`);
    const al = alleKoppen.get(k.toLowerCase());
    if (al) fouten.push(`kop "${k}" staat in ${al} en ${naam}`);
    alleKoppen.set(k.toLowerCase(), naam);
  }
  for (const b of g.beschrijvingen) toets(b, 90, `beschrijving (${naam})`);
  for (const p of g.pad) if (p.length > 15) fouten.push(`pad "${p}" te lang`);
  if (!g.koppen[0].toLowerCase().includes(g.kern)) fouten.push(`${naam}: kop 1 draagt het zoekwoord "${g.kern}" niet`);
  if (!(g.pin2 && g.koppen.includes(g.pin2) && /\bhele\b/.test(g.pin2))) fouten.push(`${naam}: filterkop op positie 2 ontbreekt`);
  const kws = g.zoekwoorden.map(([t, ty]) => ty + t);
  if (new Set(kws).size !== kws.length) fouten.push(`${naam}: dubbel zoekwoord`);
}
for (const s of SITELINKS) { toets(s.tekst, 25, 'sitelink'); toets(s.r1, 35, 'sitelinkregel'); toets(s.r2, 35, 'sitelinkregel'); }
if (new Set(SITELINKS.map((s) => s.url)).size !== SITELINKS.length) fouten.push('twee sitelinks met dezelfde URL');
for (const h of HIGHLIGHTS) toets(h, 25, 'highlight');
for (const s of SNIPPETS) for (const w of s.waarden) toets(w, 25, `snippet ${s.kop}`);
{ const voor = fouten.length; toets('{KeyWord:Dit is een veel te lange standaardkop}', 30, 'controle'); if (fouten.length === voor) { console.error('TOETS DEFECT: KeyWord-lengte'); process.exit(2); } fouten.pop(); }

/* ---------- Wat een kopie van de dakcampagne zou blokkeren ---------- */
const DAK = require('../dakwerken/negatives-bron.cjs');
const dakNegs = [];
for (const lijst of Object.values(DAK)) for (const [t, ty] of lijst) dakNegs.push([t, ty]);
const dakBlok = [];
for (const [naam, g] of Object.entries(GROEPEN)) for (const [kw] of g.zoekwoorden) for (const [t, ty] of dakNegs) if (blokkeert(t, ty, kw)) dakBlok.push(`"${kw}" <- dak-uitsluiting "${t}" (${ty})`);

if (fouten.length) { for (const f of fouten) console.error('FOUT: ' + f); process.exit(1); }

/* ---------- Plak-klare lijsten ---------- */
const plak = (t, ty) => (ty === 'e' ? `[${t}]` : `"${t}"`);
for (const [naam, g] of Object.entries(GROEPEN)) {
  const slug = naam.toLowerCase().replace(/\s+/g, '-');
  fs.writeFileSync(path.join(MAP, `1-zoekwoorden-${slug}.txt`), g.zoekwoorden.map(([t, ty]) => plak(t, ty)).join('\n') + '\n');
}
fs.writeFileSync(path.join(MAP, '2-uitsluiten-campagne.txt'), UITSLUITEN.map(([t, ty]) => plak(t, ty)).join('\n') + '\n');
fs.writeFileSync(path.join(MAP, '3-advertenties.json'), JSON.stringify({ campagne: CAMPAGNE, url: URL, instellingen: INSTELLINGEN, budget: BUDGET, groepen: GROEPEN, sitelinks: SITELINKS, highlights: HIGHLIGHTS, snippets: SNIPPETS }, null, 2) + '\n');

const nKw = Object.values(GROEPEN).reduce((s, g) => s + g.zoekwoorden.length, 0);
console.log(`Groen. ${nKw} zoekwoorden in ${Object.keys(GROEPEN).length} groepen, ${UITSLUITEN.length} uitsluitingen, ${KOPER.length} koperzoekopdrachten vrij.`);
console.log(`Budget €${BUDGET.perDag}/dag = ${Math.floor(BUDGET.perDag / BUDGET.klikprijs)} klikken/dag; 1 lead per ${BUDGET.klikkenPerLead} klikken = 1 lead per ${(BUDGET.klikkenPerLead / (BUDGET.perDag / BUDGET.klikprijs)).toFixed(1)} dagen, €${Math.round(BUDGET.klikkenPerLead * BUDGET.klikprijs)} per lead.`);
console.log(`Een kopie van de dakcampagne zou ${dakBlok.length} eigen zoekwoorden blokkeren${dakBlok.length ? ':\n  ' + dakBlok.join('\n  ') : '.'}`);
