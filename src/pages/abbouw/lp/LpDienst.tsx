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
import { initRealisatieLightbox } from './_lightbox';
import { initBeforeAfter } from './_beforeafter';
import { initLpReveal } from './_reveal';
import { initLpCallFab } from './_fab';
import { CONTACT } from '@/data/contact';
import logo from '@/assets/home/logo.png';
import velux from '@/assets/merken/Velux.png';

import imgVelux from '@/assets/dak/lp-velux-huis.jpg';
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
import imgHervoeg2 from '@/assets/gevel/lp-hervoeg-2.jpg';
import imgHervoeg3 from '@/assets/gevel/lp-hervoeg-3.jpg';
import imgHervoegVoor from '@/assets/gevel/lp-hervoeg-voor.jpg';
import imgHervoegNa from '@/assets/gevel/lp-hervoeg-na.jpg';
import imgIsol1 from '@/assets/dak/lp-isol-1.jpg';
import imgIsol2 from '@/assets/dak/lp-isol-2.jpg';
import imgIsol3 from '@/assets/dak/lp-isol-3.jpg';
import imgIsolGyproc from '@/assets/dak/lp-isol-gyproc.jpg';
import imgIsolGestuct from '@/assets/dak/lp-isol-gestuct.jpg';
import imgIsolSarking from '@/assets/dak/lp-isol-sarking.jpg';
import imgIsolKoramic from '@/assets/dak/lp-isol-koramic.jpg';
import imgPdak1 from '@/assets/dak/lp-platdak-1.jpg';
import imgPdak2 from '@/assets/dak/lp-platdak-2.jpg';
import imgPdak3 from '@/assets/dak/lp-platdak-3.jpg';
import imgRoofing from '@/assets/dak/lp-roofing-1.jpg';
import imgVx1 from '@/assets/dak/lp-veluxg-1.jpg';
import imgVx2 from '@/assets/dak/lp-veluxg-2.jpg';
import imgVx3 from '@/assets/dak/lp-veluxg-3.jpg';

const NAVY = '#0a1628';
const NAVY2 = '#14233a';
const ORANGE = '#d98c03';
const ORANGE_H = '#b87502';
const GOLD = '#c69a4b';

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
  /** optionele voor/na sleep-slider die whatImg in de about-sectie vervangt */
  beforeAfter?: { before: string; after: string };
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
    eyebrow: 'Dakramen · heel Vlaanderen',
    h1: 'Velux dakraam vakkundig geplaatst.',
    sub: 'Plaatsing en vervanging van Velux-dakramen in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
    subBold: 'Eigen dakdekkers',
    heroImg: imgVx2,
    certLogo: { src: velux, alt: 'Velux' },
    topbar: ['Gratis opmeting binnen 5 werkdagen', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw Velux-plaatser in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep werkt met een eigen vaste ploeg. Van opmeting tot waterdichte afwerking, alles door één ploeg.',
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
    finalSub: 'Praat met één van onze projectleiders',
    metaTitle: 'Velux dakraam laten plaatsen — vaste prijs | AB Bouw Groep',
    metaDesc: 'Velux-dakramen plaatsen en vervangen in Vlaanderen. Erkend plaatser, eigen ploeg, vaste prijs inclusief plaatsing. Gratis opmeting binnen 5 werkdagen.',
  },
  gevelreiniging: {
    slug: 'gevelreiniging',
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:gevelreiniging',
    eyebrow: 'Gevelreiniging · heel Vlaanderen',
    h1: 'Uw gevel als nieuw, zonder schade.',
    sub: 'Professionele gevelreiniging in Mechelen, Antwerpen, Lier en heel Vlaanderen. De juiste methode voor uw gevelsteen.',
    subBold: 'Eigen ploeg',
    heroImg: imgGevelReinig,
    certLogo: { src: '/assets/logos/caparol.png', alt: 'Caparol' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende gevelspecialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep werkt met een eigen vaste ploeg. Wij reinigen uw gevel met de juiste methode, zonder de steen te beschadigen.',
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
    finalSub: 'Praat met één van onze projectleiders',
    metaTitle: 'Gevelreiniging — zonder schade aan uw gevel | AB Bouw Groep',
    metaDesc: 'Professionele gevelreiniging in Vlaanderen. Juiste methode per gevelsteen, geen schade aan de voegen, optioneel impregneren. Gratis plaatsbezoek.',
  },
  hervoegen: {
    slug: 'hervoegen',
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:hervoegen',
    eyebrow: 'Gevelrenovatie · heel Vlaanderen',
    h1: 'Uw gevel opnieuw voegen.',
    sub: 'Uitslijpen en hervoegen van uw gevel in Mechelen, Antwerpen, Lier en heel Vlaanderen. Lossende of verweerde voegen vakkundig vervangen.',
    subBold: 'Eigen ploeg',
    heroImg: imgHervoegen,
    certLogo: { src: '/assets/logos/eternit.png', alt: 'Eternit' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende voegspecialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep werkt met een eigen vaste ploeg. Wij slijpen oude voegen uit en voegen opnieuw in de juiste kleur en techniek.',
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
    beforeAfter: { before: imgHervoegVoor, after: imgHervoegNa },
    gallery: [imgHervoeg1, imgHervoeg2, imgHervoeg3],
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
    finalSub: 'Praat met één van onze projectleiders',
    metaTitle: 'Gevel hervoegen — uitslijpen en opnieuw voegen | AB Bouw Groep',
    metaDesc: 'Gevel laten hervoegen in Vlaanderen. Oude voegen uitslijpen, opnieuw voegen in de juiste kleur. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
  },
  dakisolatie: {
    slug: 'dakisolatie',
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:dakisolatie',
    eyebrow: 'Dakisolatie · heel Vlaanderen',
    h1: 'Dakisolatie die uw factuur verlaagt.',
    sub: 'Sarkingisolatie en zoldervloerisolatie in Mechelen, Antwerpen, Lier en heel Vlaanderen. Warmer huis, lagere stookkost.',
    subBold: 'Eigen dakdekkers',
    heroImg: imgIsol1,
    certLogo: { src: '/assets/logos/rectic.png', alt: 'Recticel' },
    topbar: ['Gratis dakinspectie binnen 5 werkdagen', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende dakisolatie-specialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep werkt met een eigen vaste ploeg. Wij isoleren uw dak luchtdicht en zonder koudebruggen, voor blijvend comfort.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis dakinspectie met advies over de juiste isolatiewaarde',
      'Sarking buitenop of isolatie tussen de balken',
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
      ['Sarkingisolatie', 'Isolatie buitenop de balken, ideaal bij een dakrenovatie. Geen verlies aan zolderhoogte.'],
      ['Tussen de balken', 'Isolatie tussen en onder de balken, met dampscherm, wanneer het dak intact blijft.'],
      ['Zoldervloer isoleren', 'Snelle en voordelige oplossing wanneer de zolder niet bewoond is.'],
      ['Luchtdicht afwerken', 'Correct dampscherm en aansluitingen, zodat er geen condens of koudebrug ontstaat.'],
    ],
    whatImg: imgIsol2,
    gallery: [imgIsol2, imgIsolGyproc, imgIsolGestuct, imgIsolSarking, imgIsolKoramic],
    reviews: [
      { text: '"Dak vernieuwd met sarkingisolatie in één beweging. De zolder is nu een volwaardige kamer, en de verwarming staat merkbaar lager."', name: 'Hilde Declercq', role: 'Sarkingisolatie' },
      { text: '"Eerlijk advies over de isolatiewaarde, geen overdreven dikte verkocht. Vaste prijs vooraf, factuur klopte. Nette ploeg."', name: 'Wim De Backer', role: 'Dakisolatie' },
      { text: '"Zoldervloer laten isoleren, op één dag gedaan. Het scheelt direct op de stookkost. Alles proper opgeruimd."', name: 'Els Vandenberghe', role: 'Zoldervloerisolatie' },
    ],
    faq: [
      ['Wat kost dakisolatie?', 'Dat hangt af van de methode, de oppervlakte en de gewenste isolatiewaarde. U krijgt een vaste prijs na de gratis dakinspectie.'],
      ['Wat is sarking en waarom kiezen mensen ervoor?', 'Bij sarking komt de isolatie als één doorlopende laag bovenop de dakstructuur, onder de nieuwe dakbedekking. Zo behoudt u uw volledige zolderruimte, blijven de houten balken binnen zichtbaar en bruikbaar, en zijn er nagenoeg geen koudebruggen. Ideaal wanneer uw dak toch vernieuwd wordt.'],
      ['Moet ik mijn dak of mijn zoldervloer isoleren?', 'Gebruikt u de zolder als leefruimte (nu of in de toekomst), dan isoleren we het dakvlak zelf: van buitenaf bij een dakrenovatie, of van binnenuit als het dak intact blijft. Gebruikt u de zolder enkel als opslag, dan volstaat vaak het isoleren van de zoldervloer — sneller en voordeliger. Wij adviseren gratis wat bij uw situatie past.'],
      ['Heb ik recht op premie voor dakisolatie?', 'De premievoorwaarden zijn in 2026 gewijzigd; afhankelijk van uw inkomenscategorie en de R-waarde kan er nog premie zijn. Wij bekijken of u in aanmerking komt en regelen sowieso het 6% BTW-tarief (woning ouder dan 10 jaar) en het papierwerk.'],
      ['Sarking of tussen de balken?', 'Sarking is ideaal bij een dakrenovatie, omdat de isolatie buitenop komt. Blijft het dak intact, dan isoleren we tussen en onder de balken.'],
      ['Hoeveel bespaar ik?', 'Een slecht geïsoleerd dak verliest tot 30% warmte. Goede dakisolatie verdient zich doorgaans terug via een lagere stookkost.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Sarkingisolatie', 'Tussen de balken', 'Zoldervloer', 'Anders'],
    finalSub: 'Praat met één van onze projectleiders',
    metaTitle: 'Dakisolatie laten plaatsen — sarking & meer | AB Bouw Groep',
    metaDesc: 'Dakisolatie in Vlaanderen: sarking, tussen de balken of zoldervloer. Lager EPC, lagere stookkost, 6% BTW-voordeel. Vaste prijs, eigen ploeg.',
  },
  platdak: {
    slug: 'platdak',
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:platdak',
    eyebrow: 'Platte daken · heel Vlaanderen',
    h1: 'Plat dak in EPDM of roofing.',
    sub: 'Platte daken in EPDM of roofing voor aanbouw, garage of bijgebouw in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
    subBold: 'Eigen dakdekkers',
    heroImg: imgPlatdak,
    certLogo: { src: '/assets/logos/dorken.png', alt: 'Dörken' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende platdak-specialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep werkt met een eigen vaste ploeg. Wij leggen uw plat dak in EPDM of roofing, vakkundig en jaren waterdicht.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis plaatsbezoek met advies over opbouw en isolatie',
      'EPDM (naadloos) of bewezen roofing — u kiest',
      'Geïsoleerd volgens de huidige normen',
      'Strakke randafwerking en correcte waterafvoer',
      'Eigen dakdekkers, geen onderaannemers',
    ],
    steps: [
      ['Gratis plaatsbezoek', 'Een vakman bekijkt uw dak, meet op en adviseert over opbouw en isolatie.'],
      ['Vaste offerte', 'U krijgt een bindende prijs inclusief isolatie en afwerking. Zo weet u exact waar u aan toe bent.'],
      ['Plaatsing door eigen ploeg', 'Wij leggen uw EPDM of roofing geïsoleerd en waterdicht af.'],
    ],
    whatTitle: 'Wat houdt een plat dak in?',
    whatIntro: 'Wij leggen platte daken in EPDM of roofing. EPDM is een rubbermembraan in één naadloos stuk; roofing (bitumen) is een bewezen, voordelige bedekking. Bij het gratis plaatsbezoek adviseren we wat het best past.',
    what: [
      ['Nieuw plat dak', 'Volledige opbouw met isolatie, afgewerkt in EPDM of roofing, voor aanbouw, garage of bijgebouw.'],
      ['EPDM of roofing', 'EPDM leggen we naadloos in één stuk; roofing is een bewezen, voordelige bitumenbedekking. U kiest na eerlijk advies.'],
      ['Renovatie & isolatie', 'Een oud, lekkend plat dak vervangen we waterdicht, met isolatie volgens de huidige normen.'],
      ['Randen & afvoer', 'Strakke randprofielen en een correcte waterafvoer, netjes afgewerkt.'],
    ],
    whatImg: imgPdak1,
    gallery: [imgPdak1, imgRoofing, imgPdak2, imgPdak3],
    reviews: [
      { text: '"Plat dak van de aanbouw volledig vernieuwd in EPDM. Eén naadloos stuk, geen plakranden meer. Al twee winters volledig droog."', name: 'Sofie Vermeulen', role: 'Plat dak EPDM' },
      { text: '"Oud lekkend garagedak vervangen. Vaste prijs vooraf, op twee dagen klaar. Nette randafwerking, proper opgeruimd."', name: 'Pieter Lauwers', role: 'Renovatie plat dak' },
      { text: '"Eerlijk advies, de isolatie meteen mee vernieuwd. Factuur klopte tot op de euro. Strak resultaat."', name: 'Marleen Stevens', role: 'Nieuw plat dak' },
    ],
    faq: [
      ['Wat kost een plat dak?', 'Dat hangt af van de oppervlakte, de opbouw, de isolatie en de keuze tussen EPDM of roofing. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['EPDM of roofing — wat kies ik?', 'EPDM leggen we naadloos in één stuk, zonder brander, met de langste levensduur. Roofing (bitumen) is bewezen en voordeliger. Bij het plaatsbezoek adviseren we eerlijk wat past bij uw dak en budget.'],
      ['Hoe lang gaat het mee?', 'Een correct gelegd EPDM-dak gaat doorgaans 40 tot 50 jaar mee; roofing doorgaans 15 tot 25 jaar.'],
      ['Kan de isolatie mee vernieuwd worden?', 'Ja. Bij een nieuw of vernieuwd plat dak isoleren we meteen volgens de huidige normen.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Nieuw plat dak', 'Renovatie', 'EPDM of roofing', 'Met isolatie', 'Anders'],
    finalSub: 'Praat met één van onze projectleiders',
    metaTitle: 'Plat dak laten leggen — EPDM of roofing, vaste prijs | AB Bouw Groep',
    metaDesc: 'Plat dak in EPDM of roofing in Vlaanderen. Voor aanbouw, garage of bijgebouw, geïsoleerd en waterdicht. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
  },
  crepi: {
    slug: 'crepi',
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:crepi',
    eyebrow: 'Crepi & sierpleister · heel Vlaanderen',
    h1: 'Een strakke crepi-gevel die jaren mooi blijft.',
    sub: 'Crepi en sierpleister in elke kleur, in Mechelen, Antwerpen, Lier en heel Vlaanderen. Egaal, duurzaam en onderhoudsarm.',
    subBold: 'Eigen ploeg',
    heroImg: imgCrepiWit,
    certLogo: { src: '/assets/logos/caparol.png', alt: 'Caparol' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende crepi-specialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep werkt met een eigen vaste ploeg. Wij brengen crepi egaal en strak aan, in de kleur en korrel die u kiest.',
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
    finalSub: 'Praat met één van onze projectleiders',
    metaTitle: 'Crepi laten plaatsen — strakke gevel, vaste prijs | AB Bouw Groep',
    metaDesc: 'Crepi en sierpleister in Vlaanderen, in elke kleur. Egaal aangebracht op gevel of buitenisolatie. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
  },
  steenstrips: {
    slug: 'steenstrips',
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:steenstrips',
    eyebrow: 'Steenstrips · heel Vlaanderen',
    h1: 'Steenstrips met een authentieke baksteen-look.',
    sub: 'Steenstrips en gevelbekleding in Mechelen, Antwerpen, Lier en heel Vlaanderen. De look van baksteen, zonder het gewicht.',
    subBold: 'Eigen ploeg',
    heroImg: imgSteenstripsLp,
    certLogo: { src: wienerberger, alt: 'Wienerberger' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw erkende steenstrips-specialist in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep werkt met een eigen vaste ploeg. Wij plaatsen steenstrips kaarsrecht, met voegen zoals echt metselwerk.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis plaatsbezoek met advies over steen en voegkleur',
      'Authentieke baksteen-look, zonder het gewicht',
      'Voegen kaarsrecht, met een warme authentieke baksteen-look',
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
      ['Strak voegwerk', 'Voegen kaarsrecht doorgetrokken voor een verzorgde, authentieke baksteen-look.'],
    ],
    whatImg: imgSteen1,
    gallery: [imgSteen1, imgSteen2, imgSteen3],
    reviews: [
      { text: '"Gevel in antraciet steenstrips, meteen op isolatie. Strak gevoegd, mooie baksteen-look. Heel tevreden met het resultaat."', name: 'An Verhoeven', role: 'Steenstrips op ETICS' },
      { text: '"Roodbruine steenstrips op de voorgevel. Voegen kaarsrecht, kleur perfect. Vaste prijs vooraf, nette ploeg."', name: 'Luc Segers', role: 'Steenstrips' },
      { text: '"Eerlijk advies over steen en voegkleur, met stalen aan huis. Strak resultaat, proper opgeleverd."', name: 'Tania Govaerts', role: 'Gevelbekleding' },
    ],
    faq: [
      ['Wat kost steenstrips per m²?', 'Dat hangt af van de steensoort, de ondergrond en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Zien steenstrips er echt uit als baksteen?', 'Ja. Het zijn dunne stroken echte baksteen, strak doorgevoegd. Op het gevelvlak krijgt u een warme, authentieke baksteen-look; enkel aan hoeken en dagkanten is er een klein verschil met vol metselwerk.'],
      ['Kunnen steenstrips op isolatie?', 'Ja. Steenstrips zijn ideaal als afwerking op buitenisolatie (ETICS): een lager EPC én een baksteen-look.'],
      ['Op welke ondergrond kan het?', 'Op de meeste gezonde gevels en op isolatieplaten. Wij beoordelen de ondergrond bij het plaatsbezoek.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Steenstrips op gevel', 'Op isolatie', 'Gevelbekleding', 'Anders'],
    finalSub: 'Praat met één van onze projectleiders',
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
    // Hash-deeplink (bv. Google-sitelink /lp/...#werkwijze): scroll naar de sectie i.p.v. naar boven.
    if (window.location.hash && window.location.hash.length > 1) {
      const _id = window.location.hash.slice(1);
      setTimeout(() => { const _el = document.getElementById(_id); if (_el) _el.scrollIntoView({ behavior: 'smooth', block: 'start' }); else window.scrollTo(0, 0); }, 90);
    } else {
      window.scrollTo(0, 0);
    }

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

  // SEO: canonical + Open Graph + JSON-LD (Organization + Breadcrumb + Service + FAQPage uit d.faq)
  useEffect(() => {
    if (!d) return;
    const pageUrl = `https://abgroep.be/lp/${d.slug}`;
    const setLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
      let el = document.querySelector(selector);
      if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); if (hreflang) el.setAttribute('hreflang', hreflang); document.head.appendChild(el); }
      el.setAttribute('href', href);
    };
    setLink('canonical', pageUrl);
    setLink('alternate', pageUrl, 'nl-BE');
    setLink('alternate', pageUrl, 'x-default');
    const setMeta = (prop: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('og:title', d.metaTitle, true);
    setMeta('og:description', d.metaDesc, true);
    setMeta('og:type', 'website', true);
    setMeta('og:locale', 'nl_BE', true);
    setMeta('og:url', pageUrl, true);
    setMeta('twitter:card', 'summary_large_image');
    const schemaId = 'lp-dienst-schema';
    document.getElementById(schemaId)?.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'HomeAndConstructionBusiness',
          '@id': 'https://abgroep.be/#organization',
          name: 'AB Bouw Groep',
          url: 'https://abgroep.be',
          telephone: CONTACT.phone.e164,
          email: CONTACT.email,
          address: { '@type': 'PostalAddress', streetAddress: 'August van Landeghemstraat 63', postalCode: '2830', addressLocality: 'Willebroek', addressCountry: 'BE' },
          areaServed: [
            { '@type': 'City', name: 'Mechelen' },
            { '@type': 'City', name: 'Antwerpen' },
            { '@type': 'City', name: 'Lier' },
            { '@type': 'City', name: 'Willebroek' },
            { '@type': 'City', name: 'Bornem' },
            { '@type': 'City', name: 'Sint-Niklaas' },
          ],
          priceRange: '€€',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abgroep.be' },
            { '@type': 'ListItem', position: 2, name: d.h1, item: pageUrl },
          ],
        },
        {
          '@type': 'Service',
          name: d.metaTitle,
          provider: { '@id': 'https://abgroep.be/#organization' },
          areaServed: 'Vlaanderen',
        },
        {
          '@type': 'FAQPage',
          mainEntity: d.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        },
      ],
    });
    document.head.appendChild(schema);
    return () => { document.getElementById(schemaId)?.remove(); };
  }, [d]);

  // Realisatie-lightbox: klik op een galerij-foto -> 3 foto's groot, scrollbaar
  useEffect(() => initRealisatieLightbox(), []);
  useEffect(() => initBeforeAfter(), []);
  useEffect(() => initLpReveal(), []);
  useEffect(() => initLpCallFab(), []);

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
    if (res.ok) { setFinalState('ok'); document.getElementById('lp-final')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
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
          <a href="#" aria-label="AB Bouw Groep"><img className="tr-logo" src={logo} alt="AB Bouw Groep" /></a>
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
            <h1>{d.h1}</h1>
            <p className="tr-hero-sub">{d.sub} <b>{d.subBold}</b>.</p>
            <div className="tr-hero-cta">
              <a href="#contact" className="tr-btn">Gratis offerte aanvragen</a>
              <a href={PHONE_HREF} className="tr-hero-call">of bel {PHONE}</a>
            </div>
            <div className="tr-certs">
              <span className="tr-cert-pill"><Shield />VCA* gecertificeerd</span>
              <span className="tr-cert-pill"><Check s={15} />Lid Bouwunie</span>
              <span className="tr-cert-pill"><Shield />Verzekerd via Federale</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUICK FORM */}
      <div className="tr-quickform-shell">
        <div className="tr-wrap">
          <div id="lp-form" className={`tr-quickform${quickState === 'ok' ? ' is-success' : ''}`}>
            <span className="tr-eyebrow">Vrijblijvend</span><h3>Terugbelverzoek</h3>
            <form ref={quickRef} onSubmit={onQuickSubmit} noValidate>
              <div className="tr-qf-grid">
                <input type="text" name="firstName" placeholder="Voornaam *" autoComplete="given-name" required />
                <input type="tel" name="phone" placeholder="Telefoonnummer *" autoComplete="tel" required />
                <button type="submit" className="tr-btn" disabled={quickState === 'busy'}>
                  {quickState === 'busy' ? 'Even bezig…' : 'Bel mij terug'}
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

      {/* 5. WERKWIJZE / 3 STAPPEN */}
      <section className="tr-section" id="werkwijze">
        <div className="tr-wrap">
          <div className="tr-steps-box">
            <h2>In 3 stappen geregeld</h2>
            <div className="tr-steps-grid">
              {d.steps.map(([t, sub], i) => {
                return (
                  <div className="tr-step" key={i}>
                    <div className="tr-step-num">{String(i + 1).padStart(2, '0')}</div>
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
              <div className="tr-about-photo">
                {d.beforeAfter ? (
                  <div className="ba-slider" data-ba>
                    <img className="ba-base" src={d.beforeAfter.after} alt="Gevel na het hervoegen" />
                    <div className="ba-clip"><img src={d.beforeAfter.before} alt="Gevel voor het hervoegen" /></div>
                    <div className="ba-handle"><span className="ba-grip" aria-hidden="true">⟷</span></div>
                    <span className="ba-tag ba-tag-l">Voor</span>
                    <span className="ba-tag ba-tag-r">Na</span>
                  </div>
                ) : (
                  <img src={d.whatImg} alt="AB Bouw vakman aan het werk" />
                )}
              </div>
            </div>
            <div className="tr-about-body">
              
              <h2>{d.offerH2}</h2>
              <p className="tr-about-intro">{d.offerIntro}</p>
              <ul className="tr-checks">
                {d.offer.map((t, i) => (
                  <li key={i}><Check />{i === 0 ? <span><b>{t}</b></span> : <span>{t}</span>}</li>
                ))}
              </ul>
              <div className="tr-urgency">Gratis plaatsbezoek, meestal binnen 5 werkdagen.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NUMBERS BAR */}
      <section className="tr-numbers">
        <div className="tr-num"><div className="tr-num-big">15 jaar</div><div className="tr-num-lbl">ervaring</div></div>
        <div className="tr-num"><div className="tr-num-big">100%</div><div className="tr-num-lbl">eigen ploeg</div></div>
        <div className="tr-num"><div className="tr-num-big">124+</div><div className="tr-num-lbl">projecten</div></div>
        <div className="tr-num"><div className="tr-num-big">10 jaar</div><div className="tr-num-lbl">garantie</div></div>
      </section>

      {/* 8. SERVICES / WAT HOUDT HET IN */}
      <section className="tr-section tr-services" id="diensten">
        <div className="tr-wrap">
          <div className="tr-head">
            
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
        </div>
      </section>

      {/* 8b. RECENTE REALISATIES (galerij) */}
      {d.gallery && d.gallery.length > 0 && (
        <section className="tr-section" style={{ background: 'var(--bg-tint)' }}>
          <div className="tr-wrap">
            <div className="tr-head" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 44px' }}>
              <span className="tr-eyebrow">Recente realisaties</span>
              <h2 style={{ fontSize: 'clamp(27px, 3.2vw, 38px)', color: NAVY, fontWeight: 600, margin: 0 }}>Ons werk in beeld</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {d.gallery.map((src, i) => (
                <div
                  key={i}
                  className="rl-thumb"
                  data-rl-trigger
                  data-rl-index={i}
                  data-rl-photos={JSON.stringify(d.gallery)}
                  data-rl-title={`${d.typeWerk} — realisatie`}
                  style={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 30px 60px -30px rgba(10,22,40,0.35)', aspectRatio: '4 / 3', position: 'relative' }}
                >
                  <img src={src} alt={`${d.typeWerk} realisatie ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span className="rl-zoom" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. REVIEWS */}
      <section className="tr-section tr-reviews" id="reviews">
        <div className="tr-wrap">
          <div className="tr-head">
            
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
            <div id="lp-final" className={`tr-final-card${finalState === 'ok' ? ' is-success' : ''}${finalErr ? ' is-error' : ''}`}>
              <h3>Vraag uw gratis offerte</h3>
              <div className="tr-safe"><Shield />Vrijblijvend — we bellen u terug binnen 1 werkdag</div>
              <form ref={finalRef} onSubmit={onFinalSubmit} noValidate>
                <div className="tr-final-row">
                  <input type="text" name="firstName" placeholder="Voornaam *" autoComplete="given-name" required />
                  <input type="tel" name="phone" placeholder="Telefoonnummer *" autoComplete="tel" required />
                </div>
                <input type="email" name="email" placeholder="E-mail *" autoComplete="email" required />
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
.tr { font-family: var(--font-body); color: #1d2733; --tr-r-photo: 8px; --tr-r-ui: 8px; --tr-r-card: 12px; --wrap: 1180px; --bg-tint: #f3f1ea; --tr-line: #e7e3d8; }
.tr { --section-y: clamp(72px, 8.5vw, 128px); --section-y-lg: clamp(104px, 11vw, 168px); --section-y-compact: clamp(48px, 5.5vw, 84px); }
.tr * { box-sizing: border-box; }
.tr .tr-wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 clamp(24px, 5vw, 56px); }
.tr h1, .tr h2, .tr h3, .tr h4 { font-family: 'Plus Jakarta Sans', var(--font-display); letter-spacing: -0.02em; font-weight: 700; text-wrap: balance; font-feature-settings: 'ss01','kern','liga'; -webkit-font-smoothing: antialiased; }
.tr h1 { letter-spacing: -0.035em; }
.tr h2 { letter-spacing: -0.028em; line-height: 1.08; }
.tr a { text-decoration: none; }

.tr-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  background: ${ORANGE}; color: #fff; border: none; cursor: pointer;
  font-family: var(--font-display); font-weight: 700; font-size: 15px;
  letter-spacing: 0.01em; padding: 15px 30px; border-radius: var(--tr-r-ui);
  transition: background .18s ease, box-shadow .18s ease;
  box-shadow: 0 1px 2px rgba(10,22,40,0.10);
}
.tr-btn:hover { background: ${ORANGE_H}; box-shadow: 0 4px 12px -4px rgba(217,140,3,0.45); }
.tr-btn:active { box-shadow: inset 0 1px 2px rgba(0,0,0,0.18); }
.tr-btn:disabled { opacity: .65; cursor: wait; }
.tr-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-display); font-weight: 600; font-size: 12px;
  letter-spacing: 0.08em; text-transform: uppercase; color: #41495a; margin-bottom: 14px; }
.tr-eyebrow::before { content: ''; width: 26px; height: 3px; border-radius: 2px; background: ${ORANGE}; display: inline-block; flex-shrink: 0; }
.tr-urgency { margin-top: 14px; font-size: 13px; color: #525b6b; font-weight: 600; }
.tr-section { padding: var(--section-y) 0; }
.tr-section + .tr-section { border-top: 1px solid var(--ink-line-soft); }
.tr-section[id] { scroll-margin-top: 88px; }
.tr-section.tr-section--lg { padding: var(--section-y-lg) 0; }
.tr-section.tr-section--compact { padding: var(--section-y-compact) 0; }

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
.tr-logo { height: 50px; width: auto; display: block; }
.tr-nav { display: flex; align-items: center; gap: 28px; margin: 0 auto; }
.tr-nav a { color: ${NAVY}; font-family: var(--font-display); font-weight: 600; font-size: 15px; transition: color .18s; }
.tr-nav a:hover { color: ${ORANGE}; }
.tr-header-right { display: flex; align-items: center; gap: 18px; margin-left: auto; }
.tr-rating { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.1; }
.tr-rating-score { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: ${NAVY}; }
.tr-rating-stars { color: ${GOLD}; font-size: 13px; letter-spacing: 1px; }
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
@media (min-width: 1024px) { .tr-hero { display: flex; align-items: center; min-height: clamp(560px, 64vh, 720px); } .tr-hero-inner { width: 100%; } }
.tr-hero-bg { position: absolute; inset: 0; }
.tr-hero-bg img { width: 100%; height: 100%; object-fit: cover; }
.tr-hero-bg::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(10,22,40,0.90) 0%, rgba(10,22,40,0.64) 34%, rgba(10,22,40,0.30) 56%, rgba(10,22,40,0.08) 76%, rgba(10,22,40,0) 92%), linear-gradient(180deg, rgba(10,22,40,0) 60%, rgba(10,22,40,0.42) 100%); }
.tr-hero-inner { position: relative; z-index: 2; text-align: left; padding: clamp(72px,8vw,112px) 0 clamp(110px,12vw,168px); }
.tr-hero h1 { font-size: clamp(32px, 4.9vw, 60px); line-height: 1.06; font-weight: 800; letter-spacing: -0.035em; color: #fff; margin: 0 0 22px; max-width: 16ch; text-wrap: balance; }
.tr-hero-sub { font-size: clamp(15px, 1.45vw, 19px); line-height: 1.6; color: rgba(255,255,255,0.92);
  max-width: 620px; margin: 0 0 32px; }
.tr-hero-sub b { color: #fff; }
.tr-hero-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 22px; margin: 0 0 30px; }
.tr-hero-call { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: rgba(255,255,255,0.86); text-decoration: none; transition: color .18s; }
.tr-hero-call:hover { color: ${GOLD}; }
@media (max-width: 720px) { .tr-hero-cta { justify-content: center; gap: 12px 18px; margin-bottom: 24px; } }
.tr-hero .tr-eyebrow { color: ${GOLD}; margin-bottom: 18px; }
.tr-hero .tr-eyebrow::before { background: ${GOLD}; }
.tr-certs { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-start; gap: 10px; max-width: 620px; margin: 6px 0 0; }
.tr-cert-pill { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.13); border-radius: var(--tr-r-ui);
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); white-space: nowrap; }
.tr-cert-pill svg { color: ${GOLD}; flex-shrink: 0; opacity: 0.92; }
@media (max-width: 720px) { .tr-hero { display: flex; align-items: center; min-height: 76vh; } .tr-hero-inner { width: 100%; padding: 44px 0 116px; text-align: center; } .tr-hero-sub { margin-left: auto; margin-right: auto; } .tr-certs { justify-content: center; gap: 9px 10px; } .tr-cert-pill { height: 36px; padding: 0 13px; font-size: 12px; }
  .tr-hero-bg::after { background: linear-gradient(180deg, rgba(10,22,40,0.82) 0%, rgba(10,22,40,0.66) 42%, rgba(10,22,40,0.88) 100%); } }

/* 4 — QUICK FORM */
.tr-quickform-shell { background: #fff; }
.tr-quickform { background: #fff; max-width: 880px; margin: -88px auto 0; position: relative; z-index: 5;
  border: 1px solid #e7e4dd; border-radius: var(--tr-r-card); box-shadow: 0 26px 60px -28px rgba(10,22,40,0.4); padding: 34px 40px 36px; }
.tr-quickform .tr-eyebrow { text-align: center; display: block; margin-bottom: 6px; }
.tr-quickform h3 { text-align: center; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; color: ${NAVY}; margin: 0 0 26px; }
.tr-qf-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: stretch; }
.tr-qf-grid input { width: 100%; padding: 15px 16px; border: 1px solid #d3d7dd; border-radius: var(--tr-r-ui); font: inherit;
  font-size: 15px; color: #1d2733; background: #fff; transition: border-color .18s, box-shadow .18s; }
.tr-qf-grid input::placeholder { color: #8a8f98; }
.tr-qf-grid input:focus { outline: none; border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(217,140,3,0.16); background: #fff; }
.tr-qf-grid .tr-btn { white-space: nowrap; }
.tr-qf-error { margin-top: 12px; font-size: 13.5px; color: #b3261e; background: #fdecea;
  border: 1px solid rgba(179,38,30,0.2); border-radius: var(--tr-r-ui); padding: 9px 12px; }
.tr-qf-thanks { display: none; text-align: center; padding: 16px 0 6px; }
.tr-qf-thanks-ic { width: 54px; height: 54px; border-radius: 50%; background: #eef1f5; color: ${NAVY};
  display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.tr-qf-thanks h4 { font-size: 21px; color: ${NAVY}; margin: 0 0 6px; }
.tr-qf-thanks p { font-size: 14.5px; color: #454f60; margin: 0; }
.tr-quickform.is-success form, .tr-quickform.is-success .tr-eyebrow,
.tr-quickform.is-success h3, .tr-quickform.is-success .tr-qf-error { display: none; }
.tr-quickform.is-success .tr-qf-thanks { display: block; }
.tr-hero-testi { max-width: 760px; margin: 30px auto 0; text-align: center; padding: 0 16px 8px; }
.tr-hero-testi-q { font-size: 15.5px; line-height: 1.65; color: #3a4252; font-style: italic;
  display: inline; padding: 0; }
.tr-hero-testi-name { margin-top: 14px; font-family: var(--font-display); font-weight: 700; color: ${NAVY}; font-size: 14.5px; }
@media (max-width: 720px) {
  .tr-quickform { margin: -52px 20px 0; padding: 26px 22px 28px; }
  .tr-quickform h3 { font-size: 21px; margin-bottom: 18px; }
  .tr-qf-grid { grid-template-columns: 1fr; gap: 11px; }
  .tr-hero-testi { margin-top: 26px; }
}

/* 5 — THREE STEPS */
.tr-steps-box { padding: clamp(8px, 2vw, 28px) 0 0; max-width: 1040px; margin: 0 auto; }
.tr-steps-box h2 { text-align: left; max-width: 22ch; font-size: clamp(26px, 3vw, 36px); color: ${NAVY}; font-weight: 700; margin: 0 0 clamp(40px, 4vw, 56px); }
.tr-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(36px, 4.5vw, 64px); }
.tr-step { text-align: left; }
.tr-step-num { font-family: var(--font-display); font-size: 40px; font-weight: 700; line-height: 1; color: ${NAVY}; margin: 0 auto 16px; letter-spacing: -0.03em; position: relative; display: inline-block; padding-bottom: 12px; }
.tr-step-num::after { content: ""; position: absolute; left: 0; bottom: 0; transform: none; width: 24px; height: 3px; background: ${ORANGE}; border-radius: 2px; }
.tr-step h3 { font-size: 20px; color: ${NAVY}; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 10px; }
.tr-step p { font-size: 15px; line-height: 1.62; color: #454f60; margin: 0; }
@media (max-width: 820px) { .tr-steps-grid { grid-template-columns: 1fr; gap: 30px; } .tr-steps-box { padding: 34px 22px 38px; } }

/* 6 — ABOUT / CERTIFIED */
.tr-about-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.tr-about-media { position: relative; }
.tr-about-badges { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.tr-about-badge { display: inline-flex; align-items: center; justify-content: center; height: 52px; padding: 0 16px;
  background: #fff; border: 1px solid #e7e4dd; border-radius: var(--tr-r-ui); box-shadow: 0 8px 20px -14px rgba(10,22,40,0.3); }
.tr-about-badge img { height: 28px; width: auto; object-fit: contain; }
.tr-about-badge.tr-vca { font-family: var(--font-display); font-weight: 700; font-size: 18px; color: ${NAVY}; letter-spacing: -0.01em; }
.tr-about-photo { border-radius: var(--tr-r-photo); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(10,22,40,0.35); }
.tr-about-photo img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
/* Voor/na sleep-slider (hervoegen) */
.ba-slider { position: relative; width: 100%; aspect-ratio: 4/3; border-radius: var(--tr-r-photo); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(10,22,40,0.35); cursor: ew-resize; user-select: none; touch-action: none; container-type: inline-size; }
.ba-slider img { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.ba-clip { position: absolute; top: 0; left: 0; height: 100%; width: 50%; overflow: hidden; }
.ba-clip img { width: 100cqw; max-width: none; }
.ba-handle { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: #fff; transform: translateX(-1px); box-shadow: 0 0 0 1px rgba(10,22,40,0.22); pointer-events: none; }
.ba-grip { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 42px; height: 42px; border-radius: 50%; background: #fff; color: ${NAVY}; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 6px 16px -5px rgba(10,22,40,0.55); }
.ba-tag { position: absolute; bottom: 12px; padding: 5px 13px; border-radius: 999px; background: rgba(10,22,40,0.74); color: #fff; font-family: var(--font-display); font-weight: 600; font-size: 12px; letter-spacing: 0.04em; pointer-events: none; }
.ba-tag-l { left: 12px; }
.ba-tag-r { right: 12px; }
.tr-about-body h2 { font-size: clamp(27px, 4.2vw, 48px); color: ${NAVY}; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 16px; }
.tr-about-intro { font-size: 16px; line-height: 1.7; color: #3a4453; margin: 0 0 22px; }
.tr-checks { list-style: none; padding: 0; margin: 0 0 28px; }
.tr-checks li { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; font-size: 15px; color: #2b3543; line-height: 1.5; }
.tr-checks li svg { color: ${NAVY}; flex-shrink: 0; margin-top: 2px; }
.tr-checks li b { font-weight: 600; color: ${NAVY}; }
@media (max-width: 900px) { .tr-about-grid { grid-template-columns: 1fr; gap: 36px; } }

/* 7 — NUMBERS BAR */
.tr-numbers { display: grid; grid-template-columns: repeat(4, 1fr); background: ${NAVY}; border-top: 3px solid ${GOLD}; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
.tr-num { padding: clamp(48px, 5vw, 76px) 28px; text-align: center; color: #fff; position: relative; }
.tr-num:nth-child(odd) { background: ${NAVY}; }
.tr-num:nth-child(even) { background: ${NAVY}; }
.tr-num + .tr-num::before { content: ""; position: absolute; left: 0; top: 22%; bottom: 22%; width: 1px; background: rgba(198,154,75,0.28); }
.tr-num-big { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 3.4vw, 42px); line-height: 1; color: ${GOLD}; }
.tr-num-lbl { margin-top: 12px; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; color: rgba(255,255,255,0.88); }
@media (max-width: 720px) { .tr-numbers { grid-template-columns: 1fr 1fr; } .tr-num + .tr-num::before { display: none; } .tr-num { padding: 34px 20px; } }

/* 8 — SERVICES (dark) */
.tr-services { background: ${NAVY}; color: #fff; border-top: 1px solid rgba(255,255,255,0.07); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
.tr-services .tr-head { text-align: left; max-width: 680px; margin: 0 0 clamp(44px, 5vw, 72px); }
.tr-services .tr-head h2 { font-size: clamp(27px, 4.4vw, 52px); color: #fff; font-weight: 700; letter-spacing: -0.02em; line-height: 1.06; margin: 0; }
.tr-svc-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(22px, 2.4vw, 34px); align-items: stretch; }
.tr-svc-card { background: ${NAVY2}; border: 1px solid rgba(255,255,255,0.13); border-radius: var(--tr-r-card); overflow: hidden; box-shadow: 0 24px 48px -34px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05);
  display: flex; flex-direction: column; height: 100%; transition: transform .25s ease, border-color .25s ease; }
.tr-svc-card:hover { border-color: rgba(255,255,255,0.28); }
.tr-svc-body { padding: 26px 22px 28px; flex: 1 1 auto; display: flex; flex-direction: column; min-height: 168px; justify-content: flex-start; }
.tr-svc-body h3 { font-size: 18px; color: #fff; font-weight: 600; margin: 0 0 9px; }
.tr-svc-body p { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.74); margin: 0; }
@media (max-width: 1040px) { .tr-svc-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 720px) { .tr-svc-body { min-height: 0; } }
@media (max-width: 560px) { .tr-svc-grid { grid-template-columns: 1fr; } }


/* 11 — REVIEWS */
.tr-reviews { background: #fff; }
.tr-reviews .tr-head { text-align: left; max-width: 680px; margin: 0 0 clamp(44px, 5vw, 72px); }
.tr-reviews .tr-head h2 { font-size: clamp(27px, 3.2vw, 40px); color: ${NAVY}; font-weight: 700; margin: 0; }
.tr-rev-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(24px, 2.4vw, 34px); align-items: stretch; }
.tr-rev-card { background: #fff; border: 1px solid #e7e4dd; border-radius: var(--tr-r-card); padding: 28px 26px 26px;
  display: flex; flex-direction: column; }
.tr-rev-stars { color: ${GOLD}; font-size: 15px; letter-spacing: 2px; margin-bottom: 14px; }
.tr-rev-card p { font-size: 14.5px; line-height: 1.65; color: #3a4252; margin: 0 0 20px; flex: 1; }
.tr-rev-foot { border-top: 1px solid #eeede4; padding-top: 16px; }
.tr-rev-name { font-family: var(--font-display); font-weight: 600; color: ${NAVY}; font-size: 14.5px; }
.tr-rev-role { font-size: 12.5px; color: #525b6b; font-weight: 600; margin-top: 2px; }
@media (max-width: 980px) { .tr-rev-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 620px) { .tr-rev-grid { grid-template-columns: 1fr; } }

/* 12 — FAQ */
.tr-faq-box { border-top: 1px solid #ece9e1; padding: 12px 0 0; max-width: 760px; margin: 0 auto; }
.tr-faq-box h2 { text-align: left; font-size: clamp(26px, 3vw, 36px); color: ${NAVY}; font-weight: 700; margin: 0 0 30px; }
.tr-faq-item { border-bottom: 1px solid #ece9e1; }
.tr-faq-item summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 14px;
  padding: 18px 4px; font-family: var(--font-display); font-weight: 600; font-size: 16px; color: ${NAVY}; }
.tr-faq-item summary::-webkit-details-marker { display: none; }
.tr-faq-item summary::before { content: "+"; flex-shrink: 0; width: 22px; height: 22px; display: inline-flex;
  align-items: center; justify-content: center; color: ${NAVY}; font-size: 20px; font-weight: 700; line-height: 1; }
.tr-faq-item[open] summary::before { content: "–"; }
.tr-faq-item p { margin: 0 0 18px 36px; font-size: 14.5px; line-height: 1.65; color: #454f60; }
@media (max-width: 720px) { .tr-faq-box { padding: 30px 20px 26px; } }

/* 13 — FINAL CTA (dark) */
.tr-final { background: ${NAVY}; color: #fff; border-top: 1px solid rgba(255,255,255,0.07); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
.tr-final h2 { text-align: left; max-width: 18ch; font-size: clamp(27px, 3.2vw, 40px); color: #fff; font-weight: 700; margin: 0 0 48px; }
.tr-final-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 56px; align-items: start; }
.tr-final-contact h3 { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.72); font-weight: 600; margin: 0 0 10px; }
.tr-final-contact .tr-big { font-family: var(--font-display); font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 24px; }
.tr-final-contact .tr-line { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: rgba(255,255,255,0.84); margin-bottom: 14px; line-height: 1.5; }
.tr-final-contact .tr-line svg { color: rgba(255,255,255,0.7); flex-shrink: 0; margin-top: 2px; }
.tr-final-contact a { color: rgba(255,255,255,0.84); }
.tr-final-contact a:hover { color: #fff; }
.tr-final-card { background: #fff; color: #1d2733; border-radius: var(--tr-r-card); padding: 34px 32px 32px; }
.tr-final-card h3 { font-size: 23px; color: ${NAVY}; font-weight: 700; margin: 0 0 4px; }
.tr-final-card .tr-safe { font-size: 13.5px; color: #525b6b; margin: 0 0 20px; display: flex; align-items: center; gap: 7px; }
.tr-final-card .tr-safe svg { color: #525b6b; }
.tr-final-card form { display: flex; flex-direction: column; gap: 11px; }
.tr-final-row { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
.tr-final-card input, .tr-final-card textarea, .tr-final-card select { width: 100%; padding: 14px 15px; border: 1px solid #d9d6cd;
  border-radius: var(--tr-r-ui); font: inherit; font-size: 15px; color: #1d2733; background: #fbfaf7; }
.tr-final-card input:focus, .tr-final-card textarea:focus, .tr-final-card select:focus { outline: none; border-color: ${ORANGE};
  box-shadow: 0 0 0 3px rgba(10,22,40,0.14); background: #fff; }
.tr-final-card textarea { min-height: 92px; resize: vertical; }
.tr-final-card .tr-btn { margin-top: 4px; width: 100%; }
.tr-final-err { margin-top: 10px; font-size: 13.5px; color: #b3261e; background: #fdecea;
  border: 1px solid rgba(179,38,30,0.2); border-radius: var(--tr-r-ui); padding: 9px 12px; }
.tr-final-thanks { display: none; text-align: center; padding: 18px 0; }
.tr-final-thanks h4 { font-size: 22px; color: ${NAVY}; margin: 0 0 6px; }
.tr-final-thanks p { font-size: 14.5px; color: #454f60; margin: 0; }
.tr-final-card.is-success form { display: none; }
.tr-final-card.is-success .tr-final-thanks { display: block; }
@media (max-width: 900px) { .tr-final-grid { grid-template-columns: 1fr; gap: 34px; } .tr-final-row { grid-template-columns: 1fr; } }

/* 14 — FOOTER */
.tr-footer { background: ${NAVY}; color: rgba(255,255,255,0.7); padding: 48px 0 36px; border-top: 1px solid rgba(255,255,255,0.08); }
.tr-footer-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 22px; margin-bottom: 26px; }
.tr-footer-wordmark { font-family: var(--font-display); font-weight: 700; font-size: 19px; color: #fff; letter-spacing: -0.01em; }
.tr-footer-links { display: flex; flex-wrap: wrap; gap: 22px; }
.tr-footer-links a { color: rgba(255,255,255,0.72); font-size: 14px; }
.tr-footer-links a:hover { color: #fff; }
.tr-footer-info { font-size: 14px; color: rgba(255,255,255,0.70); line-height: 1.6; }
.tr-footer-copy { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 12.5px; color: rgba(255,255,255,0.62); }

/* === REALISATIES-GALERIJ + REVIEWS + FOOTER — desktop-robuustheid (additief) === */
.rl-thumb { cursor: pointer; position: relative; transition: transform .3s var(--ease-out-quart, ease), box-shadow .3s var(--ease-out-quart, ease); }
.rl-thumb img { transition: transform .5s var(--ease-out-quart, ease); }
.rl-thumb::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,22,40,0) 60%, rgba(10,22,40,0.34) 100%); opacity: .7; transition: opacity .3s ease; pointer-events: none; }
.rl-zoom { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; color: #fff; background: rgba(10,22,40,0.55); border: 1px solid rgba(255,255,255,0.28); border-radius: var(--tr-r-ui); opacity: 0; transform: translateY(-4px); transition: opacity .25s ease, transform .25s ease; pointer-events: none; z-index: 2; }
@media (hover: hover) and (min-width: 1024px) {
  .rl-thumb:hover { transform: translateY(-4px); box-shadow: 0 38px 70px -28px rgba(10,22,40,0.5); }
  .rl-thumb:hover img { transform: scale(1.05); }
  .rl-thumb:hover::after { opacity: 1; }
  .rl-thumb:hover .rl-zoom { opacity: 1; transform: translateY(0); }
  .tr-rev-card { transition: transform .25s var(--ease-out-quart, ease), box-shadow .25s var(--ease-out-quart, ease), border-color .25s ease; }
  .tr-rev-card:hover { transform: translateY(-3px); box-shadow: 0 26px 50px -30px rgba(10,22,40,0.32); border-color: #ded9cd; }
}
@media (min-width: 1024px) {
  .tr-rev-grid { gap: clamp(24px, 2.4vw, 34px); }
  .tr-footer { padding: 72px 0 44px; }
  .tr-footer-top { align-items: flex-start; margin-bottom: 34px; padding-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .tr-footer-links { gap: 32px; }
  .tr-footer-info { font-size: 14.5px; }
}
`;
