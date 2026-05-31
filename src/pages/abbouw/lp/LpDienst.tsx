/**
 * LpDienst — herbruikbare sub-service landingspagina (navy-replica stijl).
 * Routes: /lp/velux, /lp/gevelreiniging, /lp/hervoegen
 *
 * Config-gedreven (DIENSTEN): één component, drie diensten. De markup +
 * styling spiegelt de bewezen dakwerken-LP (tr-* navy/orange thema, Lexend).
 * Hergebruikt submitLead() uit @/lib/leads, dus GHL-webhook + Google Ads
 * conversie-tracking komen automatisch mee. Belgische context, adres altijd
 * uit CONTACT.address.
 */
import { useEffect, useRef, useState } from 'react';
import { submitLead, type Divisie } from '@/lib/leads';
import { CONTACT } from '@/data/contact';
import logo from '@/assets/home/logo.png';
import velux from '@/assets/merken/Velux.png';

import imgVelux from '@/assets/dak/lp-velux.jpg';
import imgGevelReinig from '@/assets/gevel/lp-gevelreiniging.jpg';
import imgHervoegen from '@/assets/gevel/lp-hervoegen.jpg';
import imgSarking from '@/assets/dak/lp-sarking-zolder.jpg';
import imgPlatdak from '@/assets/dak/lp-plat-dak.jpg';
import imgCrepiWit from '@/assets/gevel/witte-crepi.jpg';
import imgCrepiGrijs from '@/assets/gevel/grijze-crepi.jpg';
import imgSteenstripsLp from '@/assets/gevel/lp-steenstrips-zwart.jpg';
import wienerberger from '@/assets/merken/Wienerberger.png';
// Galerij-foto's (Recente realisaties) — vers gegenereerd per thema
import imgCrepi1 from '@/assets/gevel/lp-crepi-1.jpg';
import imgCrepi2 from '@/assets/gevel/lp-crepi-2.jpg';
import imgCrepi3 from '@/assets/gevel/lp-crepi-3.jpg';
import imgSteen1 from '@/assets/gevel/lp-steen-1.jpg';
import imgSteen2 from '@/assets/gevel/lp-steen-2.jpg';
import imgSteen3 from '@/assets/gevel/lp-steen-3.jpg';
import imgReinig1 from '@/assets/gevel/lp-reinig-1.jpg';
import imgReinig2 from '@/assets/gevel/lp-reinig-2.jpg';
import imgReinig3 from '@/assets/gevel/lp-reinig-3.jpg';
import imgHervoeg1 from '@/assets/gevel/lp-hervoeg-1.jpg';
import imgIsol1 from '@/assets/dak/lp-isol-1.jpg';
import imgIsol2 from '@/assets/dak/lp-isol-2.jpg';
import imgIsol3 from '@/assets/dak/lp-isol-3.jpg';
import imgPdak1 from '@/assets/dak/lp-platdak-1.jpg';
import imgPdak2 from '@/assets/dak/lp-platdak-2.jpg';
import imgPdak3 from '@/assets/dak/lp-platdak-3.jpg';
import imgVx1 from '@/assets/dak/lp-veluxg-1.jpg';
import imgVx2 from '@/assets/dak/lp-veluxg-2.jpg';
import imgVx3 from '@/assets/dak/lp-veluxg-3.jpg';

const NAVY = '#0a1628';
const NAVY2 = '#14233a';
const ORANGE = '#d98c03';
const ORANGE_H = '#b87502';

type Review = { text: string; name: string; role: string };

type Dienst = {
  slug: string;
  division: Divisie; typeWerk: string; bronLead: string;
  eyebrow: string; h1: string; sub: string; subBold: string; heroImg: string;
  /** extra cert-logo in de hero (naast VCA/Bouwunie/Verzekerd) */
  certLogo: { src: string; alt: string };
  topbar: string[];
  offerEyebrow: string; offerH2: string; offerIntro: string; offer: string[];
  steps: [string, string][];
  whatTitle: string; whatIntro: string; what: [string, string][]; whatImg: string;
  /** Recente-realisaties galerij (3 themafoto's), optioneel */
  gallery?: string[];
  reviews: Review[];
  faq: [string, string][];
  /** opties voor de "Type werk" select in de eind-CTA */
  typeWerkOpties: string[];
  finalSub: string;
  metaTitle: string; metaDesc: string;
};

const DIENSTEN: Record<string, Dienst> = {
  velux: {
    slug: 'velux',
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:velux',
    eyebrow: 'Uw woning verdient het beste',
    h1: 'Velux dakraam vakkundig geplaatst.',
    sub: 'Plaatsing en vervanging van Velux-dakramen in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
    subBold: 'Eigen dakdekkers',
    heroImg: imgVelux,
    certLogo: { src: velux, alt: 'Velux' },
    topbar: ['Gratis opmeting binnen 5 werkdagen', 'Familiebedrijf', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende Velux-plaatser in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep is een familiebedrijf met een eigen ploeg uit Willebroek. Van opmeting tot waterdichte afwerking, alles door één ploeg.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis opmeting aan huis, met advies over type en formaat',
      'Vaste prijs inclusief plaatsing en binnenafwerking',
      'Erkend Velux-plaatser, met behoud van fabrieksgarantie',
      'Eigen dakdekkers, geen onderaannemers',
      'Plaatsbezoek binnen 5 werkdagen, plaatsing op afspraak',
    ],
    steps: [
      ['Gratis opmeting', 'Een vakman komt langs, meet op en bespreekt welk type en formaat bij uw dak past.'],
      ['Vaste offerte', 'U krijgt een bindende prijs inclusief plaatsing en binnenafwerking. Zo weet u exact waar u aan toe bent.'],
      ['Plaatsing op afspraak', 'Onze eigen ploeg plaatst het dakraam waterdicht af, doorgaans op één dag.'],
    ],
    whatTitle: 'Wat houdt een Velux-plaatsing in?',
    whatIntro: 'Een dakraam plaatsen is meer dan een gat in het dak. Wij verzorgen het volledige werk, van het juiste gootstuk tot de afgewerkte binnenkant.',
    what: [
      ['Nieuw dakraam', 'Plaatsing van een nieuw Velux-dakraam in een pannendak of leien dak, met het juiste gootstuk.'],
      ['Vervanging', 'Een oud of lekkend dakraam vervangen we door een nieuw model, waterdicht aangesloten.'],
      ['Isolatie & gootstuk', 'Correcte aansluiting met isolatie en gootstuk, zodat er geen koudebrug of condens ontstaat.'],
      ['Binnenafwerking', 'De binnenkant netjes afgewerkt en gepleisterd, klaar voor gebruik.'],
    ],
    whatImg: imgVx1,
    gallery: [imgVx1, imgVx2, imgVx3],
    reviews: [
      { text: '"Twee Velux-ramen in de zolderslaapkamer. Plaatsing op twee dagen, binnenafwerking direct mee gepleisterd. Geen koudebrug, geen condens."', name: 'Bart Wouters', role: 'Velux dakvenster' },
      { text: '"Oud koepelraam vervangen door een modern Velux-dakraam. Vaste prijs vooraf, factuur klopte tot op de euro. Netjes afgewerkt."', name: 'Katrien De Smet', role: 'Vervanging dakraam' },
      { text: '"Vakman kwam eerst opmeten en gaf eerlijk advies over het formaat. Plaatsing op één dag, alles waterdicht en proper achtergelaten."', name: 'Tom Vermeulen', role: 'Nieuw dakraam' },
    ],
    faq: [
      ['Wat kost een Velux dakraam geplaatst?', 'Dat hangt af van het type, het formaat en de bestaande dakopbouw. Een standaardplaatsing start doorgaans rond €1.250 inclusief plaatsing. U krijgt een vaste prijs na de gratis opmeting.'],
      ['Plaatsen jullie ook in een bestaand pannendak?', 'Ja. Wij plaatsen Velux-dakramen in pannendaken en leien daken, met het juiste gootstuk zodat alles waterdicht blijft.'],
      ['Hoe lang duurt de plaatsing?', 'Een standaard dakraam plaatsen we doorgaans op één dag, inclusief binnenafwerking.'],
      ['Krijg ik garantie op de plaatsing?', 'Ja. U krijgt garantie op de waterdichtheid van de plaatsing, bovenop de fabrieksgarantie van Velux op het raam zelf.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen. Bij het plaatsbezoek bevestigen we de planning.'],
    ],
    typeWerkOpties: ['Nieuw dakraam', 'Vervanging', 'Meerdere ramen', 'Anders'],
    finalSub: 'Praat met onze dakwerker',
    metaTitle: 'Velux dakraam laten plaatsen — vaste prijs | AB Bouw Groep',
    metaDesc: 'Velux-dakramen plaatsen en vervangen in Vlaanderen. Erkend plaatser, eigen ploeg, vaste prijs inclusief plaatsing. Gratis opmeting binnen 5 werkdagen.',
  },
  gevelreiniging: {
    slug: 'gevelreiniging',
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:gevelreiniging',
    eyebrow: 'Uw woning verdient het beste',
    h1: 'Uw gevel als nieuw, zonder schade.',
    sub: 'Professionele gevelreiniging in Mechelen, Antwerpen, Lier en heel Vlaanderen. De juiste methode voor uw gevelsteen.',
    subBold: 'Eigen ploeg',
    heroImg: imgGevelReinig,
    certLogo: { src: '/assets/logos/caparol.png', alt: 'Caparol' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Familiebedrijf', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende gevelspecialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep is een familiebedrijf met een eigen ploeg uit Willebroek. Wij reinigen uw gevel met de juiste methode, zonder de steen te beschadigen.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis plaatsbezoek met advies over de juiste methode',
      'Aangepaste methode per gevel: lagedruk, nevel of chemisch',
      'Geen schade aan de voegen of de steen',
      'Optioneel impregneren tegen nieuw vuil en vocht',
      'Eigen ploeg, geen onderaannemers',
    ],
    steps: [
      ['Gratis plaatsbezoek', 'Een vakman bekijkt uw gevel en bepaalt de juiste reinigingsmethode.'],
      ['Vaste offerte', 'U krijgt een bindende prijs per m², met of zonder impregnatie. Zo weet u exact waar u aan toe bent.'],
      ['Reiniging door eigen ploeg', 'Wij reinigen uw gevel zorgvuldig, zonder de voeg of steen te beschadigen.'],
    ],
    whatTitle: 'Wat houdt gevelreiniging in?',
    whatIntro: 'Niet elke gevel reinig je op dezelfde manier. Wij kiezen de methode die uw gevelsteen aankan en pakken vuil, mos en algen grondig aan.',
    what: [
      ['Gevelreiniging', 'Vuil, roet en uitslag verwijderen met de juiste druk en het juiste middel voor uw gevelsteen.'],
      ['Mos- en algenbestrijding', 'Groene aanslag, mos en algen behandelen en verwijderen, ook op moeilijk bereikbare plekken.'],
      ['Impregneren', 'De gevel nadien beschermen tegen vocht en nieuw vuil, zodat hij jaren langer proper blijft.'],
      ['Veilig werken', 'Met stelling of hoogwerker waar nodig, netjes afgeschermd en proper opgeruimd.'],
    ],
    whatImg: imgReinig1,
    gallery: [imgReinig1, imgReinig2, imgReinig3],
    reviews: [
      { text: '"Gevel vol groene aanslag, na de reiniging zag de woning er weer als nieuw uit. Geen schade aan de voegen, alles netjes opgeruimd."', name: 'Nele Peeters', role: 'Gevelreiniging' },
      { text: '"Vakman koos bewust voor lagedruk omdat onze steen poreus is. Eerlijk advies en een nette werf. Meteen ook laten impregneren."', name: 'Sofie Claes', role: 'Reiniging + impregneren' },
      { text: '"Vaste prijs per m² vooraf, geen verrassingen. De ploeg werkte stipt en proper. Verschil voor en na is enorm."', name: 'Koen Willems', role: 'Gevelreiniging' },
    ],
    faq: [
      ['Wat kost gevelreiniging per m²?', 'Dat hangt af van de vervuiling, de gevelsteen en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Beschadigt reinigen mijn gevel niet?', 'Niet als de juiste methode wordt gebruikt. Wij stemmen de druk en het middel af op uw gevelsteen, zodat voeg en steen intact blijven.'],
      ['Is impregneren nuttig?', 'Vaak wel. Een impregnatie houdt vocht en vuil tegen, waardoor uw gevel langer proper blijft. Wij adviseren of het zinvol is voor uw gevel.'],
      ['Hoe lang blijft mijn gevel proper?', 'Met een impregnatie blijft uw gevel jaren langer schoon. Zonder hangt het af van de ligging en de begroeiing rond de woning.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Gevelreiniging', 'Impregneren', 'Mosbestrijding', 'Anders'],
    finalSub: 'Praat met onze gevelspecialist',
    metaTitle: 'Gevelreiniging — zonder schade aan uw gevel | AB Bouw Groep',
    metaDesc: 'Professionele gevelreiniging in Vlaanderen. Juiste methode per gevelsteen, geen schade aan de voegen, optioneel impregneren. Gratis plaatsbezoek.',
  },
  hervoegen: {
    slug: 'hervoegen',
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:hervoegen',
    eyebrow: 'Uw woning verdient het beste',
    h1: 'Uw gevel opnieuw voegen.',
    sub: 'Uitslijpen en hervoegen van uw gevel in Mechelen, Antwerpen, Lier en heel Vlaanderen. Lossende of verweerde voegen vakkundig vervangen.',
    subBold: 'Eigen ploeg',
    heroImg: imgHervoegen,
    certLogo: { src: '/assets/logos/eternit.png', alt: 'Eternit' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Familiebedrijf', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende voegspecialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep is een familiebedrijf met een eigen ploeg uit Willebroek. Wij slijpen oude voegen uit en voegen opnieuw in de juiste kleur en techniek.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis plaatsbezoek met beoordeling van uw voegen',
      'Oude voegen volledig uitgeslepen voor een duurzaam resultaat',
      'Kleur en techniek afgestemd op uw gevelsteen',
      'Nette werf, alles proper opgeruimd',
      'Eigen ploeg, geen onderaannemers',
    ],
    steps: [
      ['Gratis plaatsbezoek', 'Een vakman beoordeelt de staat van uw voegen en adviseert wat nodig is.'],
      ['Vaste offerte', 'U krijgt een bindende prijs per m² voor uitslijpen en hervoegen. Zo weet u exact waar u aan toe bent.'],
      ['Voegwerk door eigen ploeg', 'Wij slijpen de oude voegen uit en voegen opnieuw in de juiste kleur.'],
    ],
    whatTitle: 'Wat houdt hervoegen in?',
    whatIntro: 'Verweerde voegen laten vocht door en tasten op termijn de muur aan. Wij slijpen ze uit en voegen opnieuw in, voor een gevel die weer decennia meegaat.',
    what: [
      ['Uitslijpen', 'De losse en verweerde voegen volledig uitslijpen tot een gezonde diepte.'],
      ['Hervoegen', 'Opnieuw voegen met de juiste mortel, in een kleur die past bij uw gevelsteen.'],
      ['Herstel voegen', 'Gedeeltelijk herstel waar enkel bepaalde zones zijn aangetast.'],
      ['Nette afwerking', 'Strak doorgevoegd profiel, gevel proper opgeleverd zonder mortelresten.'],
    ],
    whatImg: imgHervoeg1,
    reviews: [
      { text: '"Onze voegen brokkelden af en lieten vocht door. Alles uitgeslepen en opnieuw gevoegd in de juiste kleur. Gevel ziet er weer strak uit."', name: 'Dirk Van Damme', role: 'Volledige gevel hervoegd' },
      { text: '"Slechts één gevel was aangetast. Eerlijk advies om enkel dat deel te doen, geen onnodig werk. Nette ploeg, vaste prijs vooraf."', name: 'Inge Mertens', role: 'Gedeeltelijk hervoegen' },
      { text: '"Voegwerk vakkundig gedaan, kleur perfect afgestemd op de steen. Werf elke dag proper achtergelaten. Top resultaat."', name: 'Stijn Jacobs', role: 'Herstel voegen' },
    ],
    faq: [
      ['Wanneer moet een gevel hervoegd worden?', 'Als de voegen loskomen, verbrokkelen of diep zijn uitgesleten. Dat laat vocht door en tast op termijn de muur aan. Een plaatsbezoek geeft uitsluitsel.'],
      ['Wat kost hervoegen per m²?', 'Dat hangt af van de staat van de voegen en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Hoe lang gaat een nieuwe voeg mee?', 'Vakkundig uitgeslepen en opnieuw gevoegd gaat een gevel doorgaans decennia mee.'],
      ['Moet de hele gevel hervoegd worden?', 'Niet altijd. Soms volstaat een deel van de gevel. Bij het plaatsbezoek bekijken we wat echt nodig is.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Volledige gevel', 'Gedeeltelijk', 'Herstel voegen', 'Anders'],
    finalSub: 'Praat met onze voegspecialist',
    metaTitle: 'Gevel hervoegen — uitslijpen en opnieuw voegen | AB Bouw Groep',
    metaDesc: 'Gevel laten hervoegen in Vlaanderen. Oude voegen uitslijpen, opnieuw voegen in de juiste kleur. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
  },
  dakisolatie: {
    slug: 'dakisolatie',
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:dakisolatie',
    eyebrow: 'Uw woning verdient het beste',
    h1: 'Dakisolatie die uw factuur verlaagt.',
    sub: 'Sarkingisolatie en zoldervloerisolatie in Mechelen, Antwerpen, Lier en heel Vlaanderen. Warmer huis, lagere stookkost.',
    subBold: 'Eigen dakdekkers',
    heroImg: imgSarking,
    certLogo: { src: '/assets/logos/rectic.png', alt: 'Recticel' },
    topbar: ['Gratis dakinspectie binnen 5 werkdagen', 'Familiebedrijf', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende dakisolatie-specialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep is een familiebedrijf met een eigen ploeg uit Willebroek. Wij isoleren uw dak luchtdicht en zonder koudebruggen, voor blijvend comfort.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis dakinspectie met advies over de juiste isolatiewaarde',
      'Sarking buitenop of isolatie tussen de kepers',
      'Lager EPC en een merkbaar lagere stookkost',
      'Luchtdicht afgewerkt, geen koudebruggen of condens',
      'Eigen dakdekkers, geen onderaannemers',
    ],
    steps: [
      ['Gratis dakinspectie', 'Een vakman bekijkt uw dak en adviseert de juiste isolatiemethode en dikte.'],
      ['Vaste offerte', 'U krijgt een bindende prijs, met de verwachte EPC-winst. Zo weet u exact waar u aan toe bent.'],
      ['Isolatie door eigen ploeg', 'Wij plaatsen de isolatie luchtdicht af, met dampscherm en nette afwerking.'],
    ],
    whatTitle: 'Wat houdt dakisolatie in?',
    whatIntro: 'Een slecht geïsoleerd dak is goed voor tot 30% warmteverlies. Wij kiezen de methode die bij uw dak past en werken alles luchtdicht af.',
    what: [
      ['Sarkingisolatie', 'Isolatie buitenop de kepers, ideaal bij een dakrenovatie. Geen verlies aan zolderhoogte.'],
      ['Tussen de kepers', 'Isolatie tussen en onder de kepers, met dampscherm, wanneer het dak intact blijft.'],
      ['Zoldervloer isoleren', 'Snelle en voordelige oplossing wanneer de zolder niet bewoond is.'],
      ['Luchtdicht afwerken', 'Correct dampscherm en aansluitingen, zodat er geen condens of koudebrug ontstaat.'],
    ],
    whatImg: imgIsol2,
    gallery: [imgIsol1, imgIsol2, imgIsol3],
    reviews: [
      { text: '"Dak vernieuwd met sarkingisolatie in één beweging. De zolder is nu een volwaardige kamer, en de verwarming staat merkbaar lager."', name: 'Hilde Declercq', role: 'Sarkingisolatie' },
      { text: '"Eerlijk advies over de isolatiewaarde, geen overdreven dikte verkocht. Vaste prijs vooraf, factuur klopte. Nette ploeg."', name: 'Wim De Backer', role: 'Dakisolatie' },
      { text: '"Zoldervloer laten isoleren, op één dag gedaan. Het scheelt direct op de stookkost. Alles proper opgeruimd."', name: 'Els Vandenberghe', role: 'Zoldervloerisolatie' },
    ],
    faq: [
      ['Wat kost dakisolatie?', 'Dat hangt af van de methode, de oppervlakte en de gewenste isolatiewaarde. U krijgt een vaste prijs na de gratis dakinspectie.'],
      ['Heb ik recht op premie voor dakisolatie?', 'Vaak wel, via Mijn VerbouwPremie, mits aan de vereiste R-waarde wordt voldaan. Wij plaatsen conform de voorwaarden en regelen het dossier mee.'],
      ['Sarking of tussen de kepers?', 'Sarking is ideaal bij een dakrenovatie, omdat de isolatie buitenop komt. Blijft het dak intact, dan isoleren we tussen en onder de kepers.'],
      ['Hoeveel bespaar ik?', 'Een slecht geïsoleerd dak verliest tot 30% warmte. Goede dakisolatie verdient zich doorgaans terug via een lagere stookkost.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Sarkingisolatie', 'Tussen de kepers', 'Zoldervloer', 'Anders'],
    finalSub: 'Praat met onze dakwerker',
    metaTitle: 'Dakisolatie laten plaatsen — sarking & meer | AB Bouw Groep',
    metaDesc: 'Dakisolatie in Vlaanderen: sarking, tussen de kepers of zoldervloer. Lager EPC, lagere stookkost, premie-dossier geregeld. Vaste prijs, eigen ploeg.',
  },
  platdak: {
    slug: 'platdak',
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:platdak',
    eyebrow: 'Uw woning verdient het beste',
    h1: 'Plat dak in naadloos EPDM.',
    sub: 'Platte daken in EPDM voor aanbouw, garage of bijgebouw in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
    subBold: 'Eigen dakdekkers',
    heroImg: imgPlatdak,
    certLogo: { src: '/assets/logos/dorken.png', alt: 'Dörken' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Familiebedrijf', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende platdak-specialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep is een familiebedrijf met een eigen ploeg uit Willebroek. Wij leggen uw plat dak in EPDM in één naadloos stuk, jaren waterdicht.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis plaatsbezoek met advies over opbouw en isolatie',
      'EPDM in één naadloos stuk, geen plakranden',
      'Geïsoleerd volgens de huidige normen',
      'Strakke randafwerking en correcte waterafvoer',
      'Eigen dakdekkers, geen onderaannemers',
    ],
    steps: [
      ['Gratis plaatsbezoek', 'Een vakman bekijkt uw dak, meet op en adviseert over opbouw en isolatie.'],
      ['Vaste offerte', 'U krijgt een bindende prijs inclusief isolatie en afwerking. Zo weet u exact waar u aan toe bent.'],
      ['Plaatsing door eigen ploeg', 'Wij leggen het EPDM naadloos, geïsoleerd en waterdicht af.'],
    ],
    whatTitle: 'Wat houdt een plat dak in EPDM in?',
    whatIntro: 'EPDM is een rubberen dakbedekking die we in één stuk leggen. Geen naden, geen plakranden, en een levensduur van decennia.',
    what: [
      ['Nieuw plat dak', 'Volledige opbouw met isolatie en EPDM in één naadloos stuk, voor aanbouw, garage of bijgebouw.'],
      ['Renovatie plat dak', 'Een oud, lekkend plat dak vervangen we door een waterdichte EPDM-constructie.'],
      ['Isolatie', 'Het dak isoleren volgens de huidige normen, voor minder warmteverlies.'],
      ['Randen & afvoer', 'Strakke randprofielen en een correcte waterafvoer, netjes afgewerkt.'],
    ],
    whatImg: imgPdak1,
    gallery: [imgPdak1, imgPdak2, imgPdak3],
    reviews: [
      { text: '"Plat dak van de aanbouw volledig vernieuwd in EPDM. Eén naadloos stuk, geen plakranden meer. Al twee winters volledig droog."', name: 'Nadia El Amrani', role: 'Plat dak EPDM' },
      { text: '"Oud lekkend garagedak vervangen. Vaste prijs vooraf, op twee dagen klaar. Nette randafwerking, proper opgeruimd."', name: 'Pieter Lauwers', role: 'Renovatie plat dak' },
      { text: '"Eerlijk advies, de isolatie meteen mee vernieuwd. Factuur klopte tot op de euro. Strak resultaat."', name: 'Marleen Stevens', role: 'Nieuw plat dak' },
    ],
    faq: [
      ['Wat kost een plat dak in EPDM?', 'Dat hangt af van de oppervlakte, de opbouw en de isolatie. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Waarom EPDM en geen roofing?', 'EPDM leggen we in één naadloos stuk, zonder plakranden of brander. Dat geeft minder risico op lekken en een langere levensduur.'],
      ['Hoe lang gaat EPDM mee?', 'Een correct gelegd EPDM-dak gaat doorgaans 40 tot 50 jaar mee.'],
      ['Kan de isolatie mee vernieuwd worden?', 'Ja. Bij een nieuw of vernieuwd plat dak isoleren we meteen volgens de huidige normen.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Nieuw plat dak', 'Renovatie', 'Met isolatie', 'Anders'],
    finalSub: 'Praat met onze dakwerker',
    metaTitle: 'Plat dak in EPDM laten leggen — vaste prijs | AB Bouw Groep',
    metaDesc: 'Plat dak in naadloos EPDM in Vlaanderen. Voor aanbouw, garage of bijgebouw, geïsoleerd en waterdicht. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
  },
  crepi: {
    slug: 'crepi',
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:crepi',
    eyebrow: 'Uw woning verdient het beste',
    h1: 'Een strakke crepi-gevel die jaren mooi blijft.',
    sub: 'Crepi en sierpleister in elke kleur, in Mechelen, Antwerpen, Lier en heel Vlaanderen. Egaal, duurzaam en onderhoudsarm.',
    subBold: 'Eigen ploeg',
    heroImg: imgCrepiWit,
    certLogo: { src: '/assets/logos/caparol.png', alt: 'Caparol' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Familiebedrijf', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende crepi-specialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep is een familiebedrijf met een eigen ploeg uit Willebroek. Wij brengen crepi egaal en strak aan, in de kleur en korrel die u kiest.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis plaatsbezoek met kleur- en korreladvies',
      'Egaal aangebracht, geen vlekken of zichtbare overgangen',
      'Crepi op nieuwbouw of op een bestaande gevel',
      'Optioneel in combinatie met buitenisolatie (ETICS)',
      'Eigen ploeg, geen onderaannemers',
    ],
    steps: [
      ['Gratis plaatsbezoek', 'Een vakman bekijkt uw gevel en adviseert over ondergrond, kleur en korrel.'],
      ['Vaste offerte', 'U krijgt een bindende prijs per m². Zo weet u exact waar u aan toe bent.'],
      ['Crepi door eigen ploeg', 'Wij bereiden de ondergrond voor en brengen de crepi egaal en strak aan.'],
    ],
    whatTitle: 'Wat houdt een crepi-gevel in?',
    whatIntro: 'Crepi is een gevelpleister die uw woning een strakke, moderne look geeft. Wij verzorgen de volledige opbouw, van ondergrond tot afwerklaag.',
    what: [
      ['Crepi op gevel', 'Een egale pleisterafwerking op uw bestaande gevel, in de kleur en korrel naar keuze.'],
      ['Sierpleister', 'Fijne of grove sierpleister, ook marmorino, voor een verfijnde afwerking.'],
      ['Crepi op isolatie', 'Crepi als afwerklaag op buitenisolatie (ETICS), voor een lager EPC.'],
      ['Voorbereiding', 'Ondergrond reinigen, herstellen en voorstrijken, zodat de crepi jaren blijft zitten.'],
    ],
    whatImg: imgCrepiGrijs,
    gallery: [imgCrepi1, imgCrepi2, imgCrepi3],
    reviews: [
      { text: '"Volledige gevel in witte crepi. Egaal aangebracht, geen vlekken of overgangen. De woning ziet er compleet vernieuwd uit."', name: 'Johan Aerts', role: 'Crepi-gevel' },
      { text: '"Crepi in een warme grijstint, kleur perfect zoals op staal. Vaste prijs per m² vooraf, nette ploeg, proper opgeleverd."', name: 'Carine Verlinden', role: 'Crepi + kleur' },
      { text: '"Crepi meteen op buitenisolatie laten zetten. Warmer huis én een strakke gevel in één werk. Top advies vooraf."', name: 'Rik Dewulf', role: 'Crepi op ETICS' },
    ],
    faq: [
      ['Wat kost crepi per m²?', 'Dat hangt af van de ondergrond, de gewenste afwerking en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Kan crepi op mijn bestaande gevel?', 'Meestal wel, mits de ondergrond gezond is. Wij beoordelen dit bij het plaatsbezoek en bereiden de gevel correct voor.'],
      ['In welke kleuren kan crepi?', 'In nagenoeg elke kleur en in verschillende korrelgroottes. Bij het plaatsbezoek bekijken we stalen samen met u.'],
      ['Is crepi onderhoudsarm?', 'Ja. Een goed aangebrachte crepi blijft jaren mooi en vraagt weinig onderhoud. Optioneel kan een vuilwerende afwerking.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Crepi op gevel', 'Sierpleister', 'Crepi op isolatie', 'Anders'],
    finalSub: 'Praat met onze gevelspecialist',
    metaTitle: 'Crepi laten plaatsen — strakke gevel, vaste prijs | AB Bouw Groep',
    metaDesc: 'Crepi en sierpleister in Vlaanderen, in elke kleur. Egaal aangebracht op gevel of buitenisolatie. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
  },
  steenstrips: {
    slug: 'steenstrips',
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:steenstrips',
    eyebrow: 'Uw woning verdient het beste',
    h1: 'Steenstrips met een authentieke baksteen-look.',
    sub: 'Steenstrips en gevelbekleding in Mechelen, Antwerpen, Lier en heel Vlaanderen. De look van baksteen, zonder het gewicht.',
    subBold: 'Eigen ploeg',
    heroImg: imgSteenstripsLp,
    certLogo: { src: wienerberger, alt: 'Wienerberger' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Familiebedrijf', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende steenstrips-specialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep is een familiebedrijf met een eigen ploeg uit Willebroek. Wij plaatsen steenstrips kaarsrecht, met voegen zoals echt metselwerk.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis plaatsbezoek met advies over steen en voegkleur',
      'Authentieke baksteen-look, zonder het gewicht',
      'Voegen kaarsrecht, niet van echt metselwerk te onderscheiden',
      'Vaak in combinatie met buitenisolatie (ETICS)',
      'Eigen ploeg, geen onderaannemers',
    ],
    steps: [
      ['Gratis plaatsbezoek', 'Een vakman bekijkt uw gevel en adviseert over steensoort, kleur en voeg.'],
      ['Vaste offerte', 'U krijgt een bindende prijs per m². Zo weet u exact waar u aan toe bent.'],
      ['Plaatsing door eigen ploeg', 'Wij verlijmen de steenstrips kaarsrecht en voegen ze strak door.'],
    ],
    whatTitle: 'Wat houdt steenstrips plaatsen in?',
    whatIntro: 'Steenstrips zijn dunne stroken echte baksteen. Ze geven uw gevel de look van metselwerk, maar zijn lichter en ideaal op isolatie.',
    what: [
      ['Steenstrips op gevel', 'Dunne baksteenstroken verlijmd op uw bestaande gevel, strak doorgevoegd.'],
      ['Op buitenisolatie', 'Steenstrips als afwerking op ETICS, voor een lager EPC én een baksteen-look.'],
      ['Keuze uit kleuren', 'Van klassiek roodbruin tot modern antraciet, met de voegkleur naar keuze.'],
      ['Strak voegwerk', 'Voegen kaarsrecht doorgetrokken, niet van echt metselwerk te onderscheiden.'],
    ],
    whatImg: imgSteen1,
    gallery: [imgSteen1, imgSteen2, imgSteen3],
    reviews: [
      { text: '"Gevel in antraciet steenstrips, meteen op isolatie. Niet van echt metselwerk te onderscheiden. Buren vragen wie het deed."', name: 'An Verhoeven', role: 'Steenstrips op ETICS' },
      { text: '"Roodbruine steenstrips op de voorgevel. Voegen kaarsrecht, kleur perfect. Vaste prijs vooraf, nette ploeg."', name: 'Luc Segers', role: 'Steenstrips' },
      { text: '"Eerlijk advies over steen en voegkleur, met stalen aan huis. Strak resultaat, proper opgeleverd."', name: 'Tania Govaerts', role: 'Gevelbekleding' },
    ],
    faq: [
      ['Wat kost steenstrips per m²?', 'Dat hangt af van de steensoort, de ondergrond en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Zien steenstrips er echt uit als baksteen?', 'Ja. Het zijn dunne stroken echte baksteen, strak doorgevoegd. Ze zijn niet van volwaardig metselwerk te onderscheiden.'],
      ['Kunnen steenstrips op isolatie?', 'Ja. Steenstrips zijn ideaal als afwerking op buitenisolatie (ETICS): een lager EPC én een baksteen-look.'],
      ['Op welke ondergrond kan het?', 'Op de meeste gezonde gevels en op isolatieplaten. Wij beoordelen de ondergrond bij het plaatsbezoek.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Steenstrips op gevel', 'Op isolatie', 'Gevelbekleding', 'Anders'],
    finalSub: 'Praat met onze gevelspecialist',
    metaTitle: 'Steenstrips laten plaatsen — baksteen-look | AB Bouw Groep',
    metaDesc: 'Steenstrips in Vlaanderen: authentieke baksteen-look, kaarsrecht gevoegd, ideaal op buitenisolatie. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
  },
};

const PHONE = CONTACT.phone.spaced;
const PHONE_HREF = CONTACT.phone.href;
const ADDRESS = CONTACT.address.full;
const stars = '★★★★★';

/* ── Inline SVG iconen (geen externe deps) ──────────────────────────────── */
const Phone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const Check = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const Shield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
);
const Pin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IcStep1 = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M9 16l2 2 4-4" /></svg>
);
const IcStep2 = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></svg>
);
const IcStep3 = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
);
const IcWhy1 = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
);
const IcWhy2 = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
);
const IcWhy3 = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>
);

const STEP_ICONS = [IcStep1, IcStep2, IcStep3];

export default function LpDienst({ slug }: { slug: string }) {
  const d = DIENSTEN[slug];
  const [quickState, setQuickState] = useState<'idle' | 'busy' | 'ok'>('idle');
  const [quickErr, setQuickErr] = useState('');
  const [finalState, setFinalState] = useState<'idle' | 'busy' | 'ok'>('idle');
  const [finalErr, setFinalErr] = useState('');
  const quickRef = useRef<HTMLFormElement>(null);
  const finalRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!d) return;
    document.title = d.metaTitle;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    const prevDesc = m.getAttribute('content');
    m.setAttribute('content', d.metaDesc);
    const prevBody = document.body.className;
    document.body.className = 'lp-page is-subpage';
    window.scrollTo(0, 0);

    // Mobiel menu open/dicht via gedelegeerde click (zoals dakwerken-LP).
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-menu-toggle]')) { document.body.classList.toggle('tr-menu-open'); return; }
      if (target.closest('[data-menu-close]')) { document.body.classList.remove('tr-menu-open'); return; }
      if (target.closest('.tr-mobmenu a')) { document.body.classList.remove('tr-menu-open'); }
    };
    document.addEventListener('click', handler);

    return () => {
      document.body.className = prevBody;
      document.body.classList.remove('tr-menu-open');
      document.removeEventListener('click', handler);
      if (prevDesc) m!.setAttribute('content', prevDesc);
    };
  }, [d]);

  if (!d) { if (typeof window !== 'undefined') window.location.href = '/'; return null; }

  const onQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const firstName = String(fd.get('firstName') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    if (!firstName) { setQuickErr('Vul uw voornaam in.'); return; }
    if (phone.replace(/\D/g, '').length < 8) { setQuickErr('Vul uw telefoonnummer in (minstens 8 cijfers).'); return; }
    setQuickErr('');
    setQuickState('busy');
    const digits = phone.replace(/\D/g, '');
    const res = await submitLead({
      source: 'landing_page', landing_division: d.division, page_path: window.location.pathname,
      firstName, email: `lead-${digits || Date.now()}@abgroep.be`, phone, type_werk: d.typeWerk as Divisie,
      aanvullende_info: `Hero-mini-form (sub-service LP: ${d.slug})`, bron_lead: `${d.bronLead}:quick`,
    });
    if (res.ok) { setQuickState('ok'); }
    else { setQuickState('idle'); setQuickErr(`Er ging iets mis. Bel ons gerust op ${PHONE}.`); }
  };

  const onFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const firstName = String(fd.get('firstName') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const typeWerkSel = String(fd.get('typeWerkSel') || '').trim();
    const info = String(fd.get('aanvullende_info') || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFinalErr('Vul een geldig e-mailadres in.'); return; }
    if (phone.replace(/\D/g, '').length < 8) { setFinalErr('Vul een geldig telefoonnummer in (minstens 8 cijfers).'); return; }
    setFinalErr('');
    setFinalState('busy');
    const aanvullend = [typeWerkSel ? `Type werk: ${typeWerkSel}` : '', info].filter(Boolean).join(' — ') || `Sub-service LP: ${d.slug}`;
    const res = await submitLead({
      source: 'landing_page', landing_division: d.division, page_path: window.location.pathname,
      firstName: firstName || undefined, email, phone, type_werk: d.typeWerk as Divisie,
      aanvullende_info: aanvullend, bron_lead: d.bronLead,
    });
    if (res.ok) { setFinalState('ok'); window.location.href = `/bedankt?service=${d.slug}`; }
    else { setFinalState('idle'); setFinalErr(`Er ging iets mis. Bel ons gerust op ${PHONE}.`); }
  };

  return (
    <div className="tr">
      <style>{LP_CSS}</style>

      {/* 1. TOP BAR */}
      <div className="tr-topbar">
        <div className="tr-wrap">
          <div className="tr-topbar-left">
            {d.topbar.map((t, i) => <span key={i}>{t}</span>)}
          </div>
          <a className="tr-topbar-phone" href={PHONE_HREF}><Phone />{PHONE}</a>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="tr-header">
        <div className="tr-wrap">
          <a href="/" aria-label="AB Bouw Groep"><img className="tr-logo" src={logo} alt="AB Bouw Groep" /></a>
          <nav className="tr-nav">
            <a href="#diensten">Diensten</a>
            <a href="#werkwijze">Werkwijze</a>
            <a href="#reviews">Reviews</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="tr-header-right">
            <div className="tr-rating">
              <span className="tr-rating-score">4,9/5</span>
              <span className="tr-rating-stars">{stars}</span>
            </div>
            <a className="tr-btn tr-headcta" href="#contact" style={{ padding: '12px 22px', fontSize: 14 }}>Gratis offerte</a>
            <button type="button" className="tr-burger" data-menu-toggle aria-label="Menu" aria-expanded="false">
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div className="tr-mobmenu-overlay" data-menu-close />
        <nav className="tr-mobmenu" aria-label="Mobiel menu">
          <button type="button" className="tr-mobmenu-close" data-menu-close aria-label="Sluiten">&times;</button>
          <a href="#diensten">Diensten</a>
          <a href="#werkwijze">Werkwijze</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
          <a className="tr-btn tr-mobmenu-cta" href="#contact">Offerte aanvragen</a>
        </nav>
      </header>

      {/* 3. HERO */}
      <section className="tr-hero">
        <div className="tr-hero-bg"><img src={d.heroImg} alt={d.h1} /></div>
        <div className="tr-hero-inner">
          <div className="tr-wrap">
            <span className="tr-eyebrow">{d.eyebrow}</span>
            <h1>{d.h1}</h1>
            <p className="tr-hero-sub">{d.sub} <b>{d.subBold}</b>, vaste prijs, netjes afgewerkt.</p>
            <div className="tr-certs">
              <span className="tr-cert-pill"><Shield />VCA* gecertificeerd</span>
              <span className="tr-cert-pill"><Check s={15} />Lid Bouwunie</span>
              <span className="tr-cert-pill"><Shield />Verzekerd — Federale Verzekering</span>
              <span className="tr-cert-logo"><img src={d.certLogo.src} alt={d.certLogo.alt} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUICK FORM */}
      <div className="tr-quickform-shell">
        <div className="tr-wrap">
          <div className={`tr-quickform${quickState === 'ok' ? ' is-success' : ''}`}>
            <span className="tr-eyebrow">Snelle aanvraag</span>
            <h3>Vraag gratis plaatsbezoek</h3>
            <form ref={quickRef} onSubmit={onQuickSubmit} noValidate>
              <div className="tr-qf-grid">
                <input type="text" name="firstName" placeholder="Voornaam" autoComplete="given-name" required />
                <input type="tel" name="phone" placeholder="Telefoon" autoComplete="tel" required />
                <button type="submit" className="tr-btn" disabled={quickState === 'busy'}>
                  {quickState === 'busy' ? 'Even bezig…' : 'Verzend aanvraag'}
                </button>
              </div>
            </form>
            {quickErr && <div className="tr-qf-error" style={{ display: 'block' }}>{quickErr}</div>}
            <div className="tr-qf-thanks">
              <div className="tr-qf-thanks-ic"><Check s={26} /></div>
              <h4>Bedankt, aanvraag ontvangen!</h4>
              <p>We bellen u zo snel mogelijk terug voor uw gratis plaatsbezoek.</p>
            </div>
          </div>
          <div className="tr-hero-testi">
            <span className="tr-hero-testi-q">{d.reviews[0].text}</span>
            <div className="tr-hero-testi-name">— {d.reviews[0].name}</div>
          </div>
        </div>
      </div>

      {/* 5. THREE STEPS */}
      <section className="tr-section">
        <div className="tr-wrap">
          <div className="tr-steps-box">
            <h2>In 3 stappen geregeld</h2>
            <div className="tr-steps-grid">
              {d.steps.map(([t, sub], i) => {
                const Ic = STEP_ICONS[i] ?? IcStep1;
                return (
                  <div className="tr-step" key={i}>
                    <div className="tr-step-ic"><Ic /></div>
                    <h3>{t}</h3>
                    <p>{sub}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. ABOUT / CERTIFIED */}
      <section className="tr-section" style={{ background: 'var(--bg-tint)' }}>
        <div className="tr-wrap">
          <div className="tr-about-grid">
            <div className="tr-about-media">
              <div className="tr-about-badges">
                <span className="tr-about-badge"><img src={d.certLogo.src} alt={d.certLogo.alt} /></span>
                <span className="tr-about-badge tr-vca">VCA*</span>
              </div>
              <div className="tr-about-photo"><img src={d.whatImg} alt="AB Bouw vakman aan het werk" /></div>
            </div>
            <div className="tr-about-body">
              <span className="tr-eyebrow">{d.offerEyebrow}</span>
              <h2>{d.offerH2}</h2>
              <p className="tr-about-intro">{d.offerIntro}</p>
              <ul className="tr-checks">
                {d.offer.map((t, i) => (
                  <li key={i}><Check />{i === 0 ? <span><b>{t}</b></span> : <span>{t}</span>}</li>
                ))}
              </ul>
              <a className="tr-btn" href="#contact">Vraag gratis offerte</a>
              <div className="tr-urgency">Nog enkele plaatsbezoeken vrij deze week.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NUMBERS BAR */}
      <section className="tr-numbers">
        <div className="tr-num"><div className="tr-num-big">15 jaar</div><div className="tr-num-lbl">ervaring</div></div>
        <div className="tr-num"><div className="tr-num-big">100%</div><div className="tr-num-lbl">eigen ploeg</div></div>
        <div className="tr-num"><div className="tr-num-big">Vaste prijs</div><div className="tr-num-lbl">offerte = factuur</div></div>
        <div className="tr-num"><div className="tr-num-big">Gratis</div><div className="tr-num-lbl">plaatsbezoek</div></div>
      </section>

      {/* 8. SERVICES / WAT HOUDT HET IN */}
      <section className="tr-section tr-services" id="diensten">
        <div className="tr-wrap">
          <div className="tr-head">
            <span className="tr-eyebrow">Onze aanpak</span>
            <h2>{d.whatTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: 15, lineHeight: 1.6, marginTop: 14 }}>{d.whatIntro}</p>
          </div>
          <div className="tr-svc-grid">
            {d.what.map(([t, sub], i) => (
              <div className="tr-svc-card" key={i}>
                <div className="tr-svc-body"><h3>{t}</h3><p>{sub}</p></div>
              </div>
            ))}
          </div>
          <div className="tr-foot">
            <a className="tr-btn" href="#contact">Vraag gratis offerte</a>
          </div>
        </div>
      </section>

      {/* 8b. RECENTE REALISATIES (galerij) */}
      {d.gallery && d.gallery.length > 0 && (
        <section className="tr-section" style={{ background: 'var(--bg-tint)' }}>
          <div className="tr-wrap">
            <div className="tr-head" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 44px' }}>
              <span className="tr-eyebrow">Recente realisaties</span>
              <h2 style={{ fontSize: 'clamp(27px, 3.2vw, 38px)', color: NAVY, fontWeight: 700, margin: 0 }}>Ons werk in beeld</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {d.gallery.map((src, i) => (
                <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e7e4dd', boxShadow: '0 18px 40px -24px rgba(10,22,40,0.35)', aspectRatio: '4 / 3' }}>
                  <img src={src} alt={`${d.typeWerk} realisatie ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. WHY CHOOSE */}
      <section className="tr-section tr-why" id="werkwijze">
        <div className="tr-wrap">
          <div className="tr-head">
            <span className="tr-eyebrow">Waarom AB Bouw</span>
            <h2>Waarom kiezen voor AB Bouw Groep</h2>
          </div>
          <div className="tr-why-grid">
            <div className="tr-why-col">
              <div className="tr-why-ic"><IcWhy1 /></div>
              <h3>Vakmanschap</h3>
              <p>Een eigen, ervaren ploeg. Geen onderaannemers, wel mensen die hun werk graag goed doen.</p>
            </div>
            <div className="tr-why-col">
              <div className="tr-why-ic"><IcWhy2 /></div>
              <h3>Vaste prijs-garantie</h3>
              <p>Wat u tekent, betaalt u. Ook als materiaalprijzen stijgen. Geen naverrekening achteraf.</p>
            </div>
            <div className="tr-why-col">
              <div className="tr-why-ic"><IcWhy3 /></div>
              <h3>Stipt & betrouwbaar</h3>
              <p>U krijgt een concrete startdatum in de offerte. Wij komen wanneer we het zeggen.</p>
            </div>
          </div>
          <div className="tr-foot"><a className="tr-btn" href="#contact">Vraag gratis offerte</a></div>
        </div>
      </section>

      {/* 10. REVIEWS */}
      <section className="tr-section tr-reviews" id="reviews">
        <div className="tr-wrap">
          <div className="tr-head">
            <span className="tr-eyebrow">Wat klanten zeggen</span>
            <h2>Tevreden klanten in heel Vlaanderen</h2>
          </div>
          <div className="tr-rev-grid">
            {d.reviews.map((r, i) => (
              <div className="tr-rev-card" key={i}>
                <div className="tr-rev-stars">{stars}</div>
                <p>{r.text}</p>
                <div className="tr-rev-foot">
                  <div className="tr-rev-name">{r.name}</div>
                  <div className="tr-rev-role">{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="tr-section" id="faq">
        <div className="tr-wrap">
          <div className="tr-faq-box">
            <h2>Veelgestelde vragen</h2>
            {d.faq.map(([q, a], i) => (
              <details className="tr-faq-item" key={i}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="tr-section tr-final" id="contact">
        <div className="tr-wrap">
          <h2>Klaar om te starten?</h2>
          <div className="tr-final-grid">
            <div className="tr-final-contact">
              <h3>Neem contact op</h3>
              <div className="tr-big">{d.finalSub}</div>
              <div className="tr-line"><Pin /><span>{ADDRESS}</span></div>
              <div className="tr-line"><Phone /><span>Telefoon: <a href={PHONE_HREF}>{PHONE}</a></span></div>
            </div>
            <div className={`tr-final-card${finalState === 'ok' ? ' is-success' : ''}${finalErr ? ' is-error' : ''}`}>
              <h3>Vraag uw gratis offerte</h3>
              <div className="tr-safe"><Shield />Uw gegevens zijn 100% veilig</div>
              <form ref={finalRef} onSubmit={onFinalSubmit} noValidate>
                <div className="tr-final-row">
                  <input type="text" name="firstName" placeholder="Voornaam" autoComplete="given-name" required />
                  <input type="tel" name="phone" placeholder="Telefoon" autoComplete="tel" required />
                </div>
                <input type="email" name="email" placeholder="E-mail" autoComplete="email" required />
                <select name="typeWerkSel" defaultValue="" required>
                  <option value="" disabled>Type werk</option>
                  {d.typeWerkOpties.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <textarea name="aanvullende_info" placeholder="Korte omschrijving" />
                <button type="submit" className="tr-btn" disabled={finalState === 'busy'}>
                  {finalState === 'busy' ? 'Even bezig…' : 'Vraag gratis offerte'}
                </button>
              </form>
              {finalErr && <div className="tr-final-err">{finalErr}</div>}
              <div className="tr-final-thanks">
                <h4>Bedankt, aanvraag ontvangen!</h4>
                <p>We nemen zo snel mogelijk contact met u op.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="tr-footer">
        <div className="tr-wrap">
          <div className="tr-footer-top">
            <span className="tr-footer-wordmark">AB Bouw Groep</span>
            <div className="tr-footer-links">
              <a href="#diensten">Diensten</a>
              <a href="#werkwijze">Werkwijze</a>
              <a href="#reviews">Reviews</a>
              <a href="#contact">Contact</a>
              <a href={PHONE_HREF}>{PHONE}</a>
            </div>
          </div>
          <div className="tr-footer-info">AB Bouw Groep · {ADDRESS} · {PHONE}</div>
          <div className="tr-footer-copy">© {new Date().getFullYear()} AB Bouw Groep — Erkend vakbedrijf in heel Vlaanderen. Alle rechten voorbehouden.</div>
        </div>
      </footer>
    </div>
  );
}

const LP_CSS = `
.tr { font-family: var(--font-body); color: #1d2733; }
.tr * { box-sizing: border-box; }
.tr .tr-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.tr h1, .tr h2, .tr h3, .tr h4 { font-family: var(--font-display); letter-spacing: -0.02em; }
.tr a { text-decoration: none; }

.tr-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  background: ${ORANGE}; color: #fff; border: none; cursor: pointer;
  font-family: var(--font-display); font-weight: 700; font-size: 15px;
  letter-spacing: 0.01em; padding: 15px 30px; border-radius: 6px;
  transition: background .18s ease, transform .18s ease, box-shadow .18s ease;
  box-shadow: 0 10px 24px -12px rgba(217,140,3,0.6);
}
.tr-btn:hover { background: ${ORANGE_H}; transform: translateY(-1px); box-shadow: 0 16px 30px -12px rgba(217,140,3,0.7); }
.tr-btn:active { transform: translateY(0); }
.tr-btn:disabled { opacity: .65; cursor: wait; }
.tr-eyebrow { display: inline-block; font-family: var(--font-display); font-weight: 700; font-size: 12px;
  letter-spacing: 0.14em; text-transform: uppercase; color: ${ORANGE}; margin-bottom: 14px; }
.tr-urgency { margin-top: 14px; font-size: 13px; color: ${ORANGE_H}; font-weight: 600; }
.tr-section { padding: 84px 0; }

/* 1 — TOP BAR */
.tr-topbar { background: ${NAVY}; color: rgba(255,255,255,0.85); font-size: 13px; }
.tr-topbar .tr-wrap { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 40px; }
.tr-topbar-left { display: inline-flex; align-items: center; gap: 0; flex-wrap: wrap; }
.tr-topbar-left span { padding: 4px 0; }
.tr-topbar-left span + span::before { content: "·"; margin: 0 12px; color: rgba(255,255,255,0.4); }
.tr-topbar-phone { display: inline-flex; align-items: center; gap: 8px; background: ${ORANGE}; color: #fff;
  font-weight: 700; padding: 7px 16px; border-radius: 999px; white-space: nowrap; }
.tr-topbar-phone svg { width: 15px; height: 15px; }
@media (max-width: 760px) { .tr-topbar-left span:not(:first-child) { display: none; } }

/* 2 — HEADER */
.tr-header { background: #fff; border-bottom: 1px solid #ececec; position: sticky; top: 0; z-index: 60; }
.tr-header .tr-wrap { display: flex; align-items: center; gap: 24px; min-height: 74px; }
.tr-logo { height: 38px; width: auto; display: block; }
.tr-nav { display: flex; align-items: center; gap: 28px; margin: 0 auto; }
.tr-nav a { color: ${NAVY}; font-family: var(--font-display); font-weight: 600; font-size: 15px; transition: color .18s; }
.tr-nav a:hover { color: ${ORANGE}; }
.tr-header-right { display: flex; align-items: center; gap: 18px; margin-left: auto; }
.tr-rating { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.1; }
.tr-rating-score { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: ${NAVY}; }
.tr-rating-stars { color: ${ORANGE}; font-size: 13px; letter-spacing: 1px; }
.tr-burger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 44px; height: 44px; padding: 10px; background: none; border: 0; cursor: pointer; }
.tr-burger span { display: block; width: 100%; height: 2.5px; background: ${NAVY}; border-radius: 2px; transition: transform .25s var(--ease-out-quart, ease), opacity .2s; }
.tr-mobmenu-overlay { display: none; }
.tr-mobmenu { display: none; }
@media (max-width: 980px) {
  .tr-nav { display: none; }
  .tr-rating { display: none; }
  .tr-headcta { display: none; }
  .tr-burger { display: flex; }
  .tr-logo { height: 52px; }
  .tr-header .tr-wrap { min-height: 66px; gap: 12px; }
  .tr-mobmenu-overlay { display: block; position: fixed; inset: 0; background: rgba(10,22,40,0.55); opacity: 0; pointer-events: none; transition: opacity .28s ease; z-index: 150; }
  body.tr-menu-open .tr-mobmenu-overlay { opacity: 1; pointer-events: auto; }
  .tr-mobmenu { display: flex; flex-direction: column; gap: 2px; position: fixed; top: 0; right: 0; bottom: 0; width: min(84vw, 360px); background: #fff; box-shadow: -24px 0 60px -24px rgba(0,0,0,0.45); transform: translateX(100%); transition: transform .3s var(--ease-out-quart, ease); z-index: 200; padding: 30px 26px 30px; overflow-y: auto; }
  body.tr-menu-open .tr-mobmenu { transform: translateX(0); }
  body.tr-menu-open { overflow: hidden; }
  .tr-mobmenu-close { align-self: flex-end; background: none; border: 0; font-size: 34px; line-height: 1; color: ${NAVY}; cursor: pointer; padding: 0 4px 6px; margin-bottom: 6px; }
  .tr-mobmenu a:not(.tr-btn) { font-family: var(--font-display); font-weight: 600; font-size: 19px; color: ${NAVY}; padding: 15px 4px; border-bottom: 1px solid #efece5; }
  .tr-mobmenu a:not(.tr-btn):active { color: ${ORANGE}; }
  .tr-mobmenu-cta { margin-top: 22px; justify-content: center; text-align: center; padding: 16px; font-size: 16px; }
  body.tr-menu-open .tr-burger span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
  body.tr-menu-open .tr-burger span:nth-child(2) { opacity: 0; }
  body.tr-menu-open .tr-burger span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
}

/* 3 — HERO */
.tr-hero { position: relative; background: ${NAVY}; color: #fff; overflow: hidden; }
.tr-hero-bg { position: absolute; inset: 0; }
.tr-hero-bg img { width: 100%; height: 100%; object-fit: cover; }
.tr-hero-bg::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(10,22,40,0.86) 0%, rgba(10,22,40,0.72) 45%, rgba(10,22,40,0.9) 100%); }
.tr-hero-inner { position: relative; z-index: 2; text-align: center; padding: 96px 0 150px; }
.tr-hero h1 { font-size: clamp(34px, 5.2vw, 60px); line-height: 1.06; font-weight: 700; color: #fff; margin: 0 auto 20px; max-width: 920px; }
.tr-hero-sub { font-size: clamp(15px, 1.4vw, 18px); line-height: 1.6; color: rgba(255,255,255,0.86);
  max-width: 700px; margin: 0 auto 30px; }
.tr-hero-sub b { color: #fff; }
.tr-certs { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px 14px; max-width: 880px; margin: 0 auto; }
.tr-cert-pill { display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 18px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); border-radius: 8px;
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.92); white-space: nowrap; }
.tr-cert-pill svg { color: ${ORANGE}; flex-shrink: 0; }
.tr-cert-logo { display: inline-flex; align-items: center; justify-content: center; height: 44px; padding: 0 16px;
  background: rgba(255,255,255,0.94); border-radius: 8px; }
.tr-cert-logo img { height: 22px; width: auto; object-fit: contain; filter: grayscale(1); opacity: .8; }
@media (max-width: 720px) { .tr-hero-inner { padding: 66px 0 120px; } .tr-cert-pill { height: 38px; padding: 0 13px; font-size: 12px; } }

/* 4 — QUICK FORM */
.tr-quickform-shell { background: #fff; }
.tr-quickform { background: #fff; max-width: 880px; margin: -88px auto 0; position: relative; z-index: 5;
  border: 1px solid #e7e4dd; border-radius: 10px; box-shadow: 0 26px 60px -28px rgba(10,22,40,0.4); padding: 34px 40px 36px; }
.tr-quickform .tr-eyebrow { text-align: center; display: block; margin-bottom: 6px; }
.tr-quickform h3 { text-align: center; font-size: 26px; font-weight: 700; color: ${NAVY}; margin: 0 0 22px; }
.tr-qf-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: stretch; }
.tr-qf-grid input { width: 100%; padding: 15px 16px; border: 1px solid #d9d6cd; border-radius: 6px; font: inherit;
  font-size: 15px; color: #1d2733; background: #fbfaf7; transition: border-color .18s, box-shadow .18s; }
.tr-qf-grid input:focus { outline: none; border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(217,140,3,0.16); background: #fff; }
.tr-qf-grid .tr-btn { white-space: nowrap; }
.tr-qf-error { margin-top: 12px; font-size: 13.5px; color: #b3261e; background: #fdecea;
  border: 1px solid rgba(179,38,30,0.2); border-radius: 6px; padding: 9px 12px; }
.tr-qf-thanks { display: none; text-align: center; padding: 16px 0 6px; }
.tr-qf-thanks-ic { width: 54px; height: 54px; border-radius: 50%; background: #d6f3e4; color: #0f7a4a;
  display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.tr-qf-thanks h4 { font-size: 21px; color: ${NAVY}; margin: 0 0 6px; }
.tr-qf-thanks p { font-size: 14.5px; color: #5b6373; margin: 0; }
.tr-quickform.is-success form, .tr-quickform.is-success .tr-eyebrow,
.tr-quickform.is-success h3, .tr-quickform.is-success .tr-qf-error { display: none; }
.tr-quickform.is-success .tr-qf-thanks { display: block; }
.tr-hero-testi { max-width: 760px; margin: 30px auto 0; text-align: center; padding: 0 16px 8px; }
.tr-hero-testi-q { font-size: 15.5px; line-height: 1.65; color: #3a4252; font-style: italic;
  background: linear-gradient(transparent 60%, rgba(217,140,3,0.22) 60%); display: inline; padding: 1px 2px; }
.tr-hero-testi-name { margin-top: 14px; font-family: var(--font-display); font-weight: 700; color: ${NAVY}; font-size: 14.5px; }
@media (max-width: 720px) {
  .tr-quickform { margin: -72px 14px 0; padding: 22px 18px 24px; }
  .tr-quickform h3 { font-size: 21px; }
  .tr-qf-grid { grid-template-columns: 1fr; }
}

/* 5 — THREE STEPS */
.tr-steps-box { border: 2px solid ${ORANGE}; border-radius: 16px; padding: 48px 44px 52px; max-width: 1060px; margin: 0 auto; }
.tr-steps-box h2 { text-align: center; font-size: clamp(26px, 3vw, 36px); color: ${NAVY}; font-weight: 700; margin: 0 0 44px; }
.tr-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px; }
.tr-step { text-align: center; }
.tr-step-ic { width: 56px; height: 56px; margin: 0 auto 18px; color: ${ORANGE}; display: flex; align-items: center; justify-content: center; }
.tr-step-ic svg { width: 44px; height: 44px; }
.tr-step h3 { font-size: 19px; color: ${NAVY}; font-weight: 700; margin: 0 0 10px; }
.tr-step p { font-size: 14.5px; line-height: 1.62; color: #5b6373; margin: 0; }
@media (max-width: 820px) { .tr-steps-grid { grid-template-columns: 1fr; gap: 30px; } .tr-steps-box { padding: 34px 22px 38px; } }

/* 6 — ABOUT / CERTIFIED */
.tr-about-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 56px; align-items: center; }
.tr-about-media { position: relative; }
.tr-about-badges { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.tr-about-badge { display: inline-flex; align-items: center; justify-content: center; height: 52px; padding: 0 16px;
  background: #fff; border: 1px solid #e7e4dd; border-radius: 8px; box-shadow: 0 8px 20px -14px rgba(10,22,40,0.3); }
.tr-about-badge img { height: 28px; width: auto; object-fit: contain; }
.tr-about-badge.tr-vca { font-family: var(--font-display); font-weight: 800; font-size: 18px; color: ${NAVY}; letter-spacing: -0.01em; }
.tr-about-photo { border-radius: 8px; overflow: hidden; border: 1px solid #e7e4dd; box-shadow: 0 26px 54px -30px rgba(10,22,40,0.4); }
.tr-about-photo img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
.tr-about-body h2 { font-size: clamp(27px, 3.2vw, 38px); color: ${NAVY}; font-weight: 700; line-height: 1.12; margin: 0 0 16px; }
.tr-about-intro { font-size: 15.5px; line-height: 1.7; color: #4a5468; margin: 0 0 22px; }
.tr-checks { list-style: none; padding: 0; margin: 0 0 28px; }
.tr-checks li { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; font-size: 15px; color: #2b3543; line-height: 1.5; }
.tr-checks li svg { color: ${ORANGE}; flex-shrink: 0; margin-top: 2px; }
.tr-checks li b { background: linear-gradient(transparent 62%, rgba(217,140,3,0.28) 62%); padding: 0 2px; font-weight: 700; }
@media (max-width: 900px) { .tr-about-grid { grid-template-columns: 1fr; gap: 36px; } }

/* 7 — NUMBERS BAR */
.tr-numbers { display: grid; grid-template-columns: repeat(4, 1fr); }
.tr-num { padding: 40px 28px; text-align: center; color: #fff; }
.tr-num:nth-child(odd) { background: ${NAVY}; }
.tr-num:nth-child(even) { background: ${ORANGE}; }
.tr-num-big { font-family: var(--font-display); font-weight: 800; font-size: clamp(26px, 3.4vw, 40px); line-height: 1; }
.tr-num-lbl { margin-top: 8px; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.92); }
@media (max-width: 720px) { .tr-numbers { grid-template-columns: 1fr 1fr; } }

/* 8 — SERVICES (dark) */
.tr-services { background: ${NAVY}; color: #fff; }
.tr-services .tr-head { text-align: center; max-width: 720px; margin: 0 auto 50px; }
.tr-services .tr-head h2 { font-size: clamp(27px, 3.2vw, 40px); color: #fff; font-weight: 700; margin: 0; }
.tr-svc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.tr-svc-card { background: ${NAVY2}; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; overflow: hidden;
  display: flex; flex-direction: column; transition: transform .25s ease, border-color .25s ease; }
.tr-svc-card:hover { transform: translateY(-4px); border-color: rgba(217,140,3,0.5); }
.tr-svc-body { padding: 26px 22px 28px; }
.tr-svc-body h3 { font-size: 18px; color: #fff; font-weight: 700; margin: 0 0 9px; }
.tr-svc-body p { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.74); margin: 0; }
.tr-services .tr-foot { text-align: center; margin-top: 46px; }
@media (max-width: 1040px) { .tr-svc-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .tr-svc-grid { grid-template-columns: 1fr; } }

/* 10 — WHY CHOOSE */
.tr-why { text-align: center; background: var(--bg-tint); }
.tr-why .tr-head { max-width: 720px; margin: 0 auto 50px; }
.tr-why .tr-head h2 { font-size: clamp(27px, 3.2vw, 40px); color: ${NAVY}; font-weight: 700; margin: 0; }
.tr-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px; max-width: 1000px; margin: 0 auto; }
.tr-why-col { padding: 0 12px; }
.tr-why-ic { width: 54px; height: 54px; margin: 0 auto 18px; color: ${ORANGE}; display: flex; align-items: center; justify-content: center; }
.tr-why-ic svg { width: 42px; height: 42px; }
.tr-why-col h3 { font-size: 18px; color: ${NAVY}; font-weight: 700; margin: 0 0 10px; }
.tr-why-col p { font-size: 14.5px; line-height: 1.62; color: #5b6373; margin: 0; }
.tr-why .tr-foot { margin-top: 46px; }
@media (max-width: 820px) { .tr-why-grid { grid-template-columns: 1fr; gap: 30px; } }

/* 11 — REVIEWS */
.tr-reviews { background: #fff; }
.tr-reviews .tr-head { text-align: center; max-width: 720px; margin: 0 auto 50px; }
.tr-reviews .tr-head h2 { font-size: clamp(27px, 3.2vw, 40px); color: ${NAVY}; font-weight: 700; margin: 0; }
.tr-rev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.tr-rev-card { background: #fff; border: 1px solid #e7e4dd; border-radius: 10px; padding: 28px 26px 26px;
  display: flex; flex-direction: column; }
.tr-rev-stars { color: ${ORANGE}; font-size: 15px; letter-spacing: 2px; margin-bottom: 14px; }
.tr-rev-card p { font-size: 14.5px; line-height: 1.65; color: #3a4252; margin: 0 0 20px; flex: 1; }
.tr-rev-foot { border-top: 1px solid #eeede4; padding-top: 16px; }
.tr-rev-name { font-family: var(--font-display); font-weight: 700; color: ${NAVY}; font-size: 14.5px; }
.tr-rev-role { font-size: 12.5px; color: ${ORANGE}; font-weight: 600; margin-top: 2px; }
@media (max-width: 980px) { .tr-rev-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 620px) { .tr-rev-grid { grid-template-columns: 1fr; } }

/* 12 — FAQ */
.tr-faq-box { border: 2px solid ${ORANGE}; border-radius: 16px; padding: 44px 48px 40px; max-width: 920px; margin: 0 auto; }
.tr-faq-box h2 { text-align: center; font-size: clamp(26px, 3vw, 36px); color: ${NAVY}; font-weight: 700; margin: 0 0 30px; }
.tr-faq-item { border-bottom: 1px solid #ece9e1; }
.tr-faq-item summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 14px;
  padding: 18px 4px; font-family: var(--font-display); font-weight: 600; font-size: 16px; color: ${NAVY}; }
.tr-faq-item summary::-webkit-details-marker { display: none; }
.tr-faq-item summary::before { content: "+"; flex-shrink: 0; width: 22px; height: 22px; display: inline-flex;
  align-items: center; justify-content: center; color: ${ORANGE}; font-size: 20px; font-weight: 700; line-height: 1; }
.tr-faq-item[open] summary::before { content: "–"; }
.tr-faq-item p { margin: 0 0 18px 36px; font-size: 14.5px; line-height: 1.65; color: #5b6373; }
@media (max-width: 720px) { .tr-faq-box { padding: 30px 20px 26px; } }

/* 13 — FINAL CTA (dark) */
.tr-final { background: ${NAVY}; color: #fff; }
.tr-final h2 { text-align: center; font-size: clamp(27px, 3.2vw, 40px); color: #fff; font-weight: 700; margin: 0 0 48px; }
.tr-final-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 56px; align-items: start; }
.tr-final-contact h3 { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: ${ORANGE}; font-weight: 700; margin: 0 0 10px; }
.tr-final-contact .tr-big { font-family: var(--font-display); font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 24px; }
.tr-final-contact .tr-line { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: rgba(255,255,255,0.84); margin-bottom: 14px; line-height: 1.5; }
.tr-final-contact .tr-line svg { color: ${ORANGE}; flex-shrink: 0; margin-top: 2px; }
.tr-final-contact a { color: rgba(255,255,255,0.84); }
.tr-final-contact a:hover { color: #fff; }
.tr-final-card { background: #fff; color: #1d2733; border-radius: 12px; padding: 34px 32px 32px; }
.tr-final-card h3 { font-size: 23px; color: ${NAVY}; font-weight: 700; margin: 0 0 4px; }
.tr-final-card .tr-safe { font-size: 13.5px; color: #6b7383; margin: 0 0 20px; display: flex; align-items: center; gap: 7px; }
.tr-final-card .tr-safe svg { color: #0f7a4a; }
.tr-final-card form { display: flex; flex-direction: column; gap: 11px; }
.tr-final-row { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
.tr-final-card input, .tr-final-card textarea, .tr-final-card select { width: 100%; padding: 14px 15px; border: 1px solid #d9d6cd;
  border-radius: 6px; font: inherit; font-size: 15px; color: #1d2733; background: #fbfaf7; }
.tr-final-card input:focus, .tr-final-card textarea:focus, .tr-final-card select:focus { outline: none; border-color: ${ORANGE};
  box-shadow: 0 0 0 3px rgba(217,140,3,0.16); background: #fff; }
.tr-final-card textarea { min-height: 92px; resize: vertical; }
.tr-final-card .tr-btn { margin-top: 4px; width: 100%; }
.tr-final-err { margin-top: 10px; font-size: 13.5px; color: #b3261e; background: #fdecea;
  border: 1px solid rgba(179,38,30,0.2); border-radius: 6px; padding: 9px 12px; }
.tr-final-thanks { display: none; text-align: center; padding: 18px 0; }
.tr-final-thanks h4 { font-size: 22px; color: ${NAVY}; margin: 0 0 6px; }
.tr-final-thanks p { font-size: 14.5px; color: #5b6373; margin: 0; }
.tr-final-card.is-success form { display: none; }
.tr-final-card.is-success .tr-final-thanks { display: block; }
@media (max-width: 900px) { .tr-final-grid { grid-template-columns: 1fr; gap: 34px; } .tr-final-row { grid-template-columns: 1fr; } }

/* 14 — FOOTER */
.tr-footer { background: ${NAVY}; color: rgba(255,255,255,0.7); padding: 48px 0 36px; border-top: 1px solid rgba(255,255,255,0.08); }
.tr-footer-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 22px; margin-bottom: 26px; }
.tr-footer-wordmark { font-family: var(--font-display); font-weight: 700; font-size: 19px; color: #fff; letter-spacing: -0.01em; }
.tr-footer-links { display: flex; flex-wrap: wrap; gap: 22px; }
.tr-footer-links a { color: rgba(255,255,255,0.72); font-size: 14px; }
.tr-footer-links a:hover { color: ${ORANGE}; }
.tr-footer-info { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6; }
.tr-footer-copy { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 12.5px; color: rgba(255,255,255,0.45); }
`;
