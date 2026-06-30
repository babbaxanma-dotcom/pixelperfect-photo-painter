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
import { trackFormStart } from '@/lib/tracking';
import { initRealisatieLightbox } from './_lightbox';
import { initBeforeAfter } from './_beforeafter';
import { initLpReveal } from './_reveal';
import { initLpCallFab } from './_fab';
import { CONTACT } from '@/data/contact';
import CalculatorWizard from '../calculator/CalculatorWizard';
import { DAK_CALC_CONFIGS } from '../calculator/dakCalcConfigs';
import logo from '@/assets/home/logo.png';
import imgTrG1 from '@/assets/interieur/woonkamer-eik.jpg';
import imgTrG2 from '@/assets/construct/halfopen.jpg';
import imgTrG3 from '@/assets/interieur/trap-staal-eik.jpg';
import imgBkG1 from '@/assets/bad/intro.jpg';
import imgBkG2 from '@/assets/bad/wellness.jpg';
import imgBkG3 from '@/assets/realisaties/bad-gastentoilet.jpg';
import imgTgG1 from '@/assets/interieur/droom.jpg';
import imgTgG2 from '@/assets/interieur/woonkamer-eik.jpg';
import imgTgG3 from '@/assets/bad/inloopdouche.jpg';
import imgPlG1 from '@/assets/interieur/intro-overview.jpg';
import imgPlG2 from '@/assets/interieur/hero.jpg';
import imgPlG3 from '@/assets/interieur/maatkasten.jpg';
import imgTeG1 from '@/assets/construct/aanbouw.jpg';
import imgTeG2 from '@/assets/realisaties/21_extra_aanbouw-modern_b.jpg';
import imgTeG3 from '@/assets/realisaties/17_extra_houtskelet-thermowood-bonheiden.jpg';
import imgOpG1 from '@/assets/realisaties/extra-25_rode-baksteen-villa.jpg';
import imgOpG2 from '@/assets/construct/nieuwbouw.jpg';
import imgOpG3 from '@/assets/construct/intro-villa.jpg';
import imgZwG1 from '@/assets/realisaties/extra-23_beige-balcony.jpg';
import imgZwG2 from '@/assets/realisaties/extra-27_zonnepaneel-fermette.jpg';
import imgZwG3 from '@/assets/realisaties/21_extra_aanbouw-modern_b.jpg';
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
import imgVeluxStappen from '@/assets/dak/lp-velux-stappen.jpg';
// ── nieuwe dienst-LP assets (renovatie/interieur/buitenaanleg) ──
import imgTrHero from '@/assets/construct/totaal.jpg';
import imgTrWhat from '@/assets/interieur/keuken-noten.jpg';
import imgBkHero from '@/assets/bad/inloopdouche.jpg';
import imgBkWhat from '@/assets/bad/sanitair.jpg';
import imgTgHero from '@/assets/interieur/gietvloer.jpg';
import imgTgWhat from '@/assets/interieur/parket.jpg';
import imgPlHero from '@/assets/interieur/binnendeuren.jpg';
import imgPlWhat from '@/assets/interieur/plafonds.jpg';
import imgTeHero from '@/assets/realisaties/20_extra_tuingevel-schuifraam-bonheiden.jpg';
import imgTeWhat from '@/assets/realisaties/21_extra_aanbouw-modern_a.jpg';
import imgOpHero from '@/assets/realisaties/extra-24_geel-rijwoning.jpg';
import imgOpWhat from '@/assets/realisaties/15_extra_garage-renovatie_a.jpg';
import imgZwHero from '@/assets/construct/aanbouw.jpg';
import imgZwWhat from '@/assets/realisaties/extra-22_villa-vrijstaand.jpg';

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
  certLogo?: { src: string; alt: string };
  topbar: string[];
  offerEyebrow: string; offerH2: string; offerIntro: string; offer: string[];
  steps: [string, string][];
  whatTitle: string; whatIntro: string; what: [string, string][]; whatImg: string;
  /** optionele foto naast de "In 3 stappen"-sectie (dakwerken-stijl photo-layout) */
  stepsImg?: string;
  /** optionele voor/na sleep-slider die whatImg in de about-sectie vervangt */
  beforeAfter?: { before: string; after: string };
  /** optionele "herkent u dit?" signalen-sectie */
  signs?: { title: string; intro: string; items: string[] };
  /** Recente-realisaties galerij (3 themafoto's), optioneel */
  gallery?: Array<string | string[]>;
  reviews: Review[];
  faq: [string, string][];
  /** opties voor de "Type werk" select in de eind-CTA */
  typeWerkOpties: string[];
  finalSub: string;
  metaTitle: string; metaDesc: string;
  /** per-dienst overrides van gedeelde markup (de-cliché + eigen invalshoek per pagina) */
  reviewsH2?: string;     // reviews-kop (default 'Wat onze klanten vertellen')
  quickformH3?: string;   // mini-form kop (default 'Liever dat wij u bellen?')
  werkwijzeH2?: string;   // stappen-kop (default 'In 3 stappen geregeld')
  finalH2?: string;       // eind-CTA kop (default 'Klaar om te starten?')
  urgencyLine?: string;   // about urgency-regel (default plaatsbezoek-variant)
  quickThanks?: string;   // mini-form bedankt-tekst
  breadcrumb?: string;    // schema breadcrumb-naam (default = dienstnaam i.p.v. h1)
  galleryNoun?: string;   // publieke dienstnaam voor lightbox/alt (default d.typeWerk)
};

const DIENSTEN: Record<string, Dienst> = {
  totaalrenovatie: {
    slug: 'totaalrenovatie',
    division: 'ab_construct', typeWerk: 'AB Construct', bronLead: 'ads:totaalrenovatie',
    eyebrow: 'Totaalrenovatie · sleutel-op-de-deur · heel Vlaanderen',
    h1: 'Uw woning volledig renoveren met één aannemer.',
    sub: 'Van casco tot afwerking. U brengt geen losse vaklui samen — wij coördineren alles, met één aanspreekpunt van plan tot oplevering.',
    subBold: 'Vaste prijs vooraf, offerte = factuur',
    heroImg: imgTrHero,
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eén aanspreekpunt, eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Een totaalrenovatie staat of valt met de coördinatie',
    offerIntro: 'De grootste zorg bij een volledige renovatie is niet het werk zelf, maar wie alles op elkaar afstemt en de planning bewaakt. Bij ons is dat één vast aanspreekpunt, van het eerste plaatsbezoek tot de oplevering.',
    offer: ['Eén vaste prijs vooraf, offerte = factuur', 'Eén aanspreekpunt van plan tot oplevering', 'Eigen ploeg, geen losse onderaannemers', 'Casco tot afwerking, alles op elkaar afgestemd', '6% btw bij een woning ouder dan 10 jaar, papierwerk regelen wij', 'Erkend aannemer, lid Bouwunie, VCA*'],
    steps: [['Gratis plaatsbezoek', 'Een vakman komt langs, bekijkt de woning en luistert naar uw plannen. U krijgt eerlijk advies over wat haalbaar en zinvol is.'], ['Vaste offerte', 'Eén bindende prijs op papier voor de volledige renovatie, post per post. Wat op de offerte staat, betaalt u, ook bij prijsstijgingen.'], ['Uitvoering door eigen ploeg', 'Onze eigen ploeg voert de werken uit volgens een afgesproken planning. Eén aanspreekpunt bewaakt de coördinatie tot de oplevering.']],
    whatTitle: 'Wat omvat een totaalrenovatie?',
    whatIntro: 'Een volledige woningrenovatie raakt aan ruwbouw, technieken en afwerking tegelijk. Wij brengen die delen samen onder één coördinatie, zodat u maar met één partij te maken heeft.',
    what: [['Ruwbouw en structuur', 'Muren uitbreken of bijplaatsen, draagstructuur, vloeren en daken aanpassen waar de nieuwe indeling dat vraagt.'], ['Technieken', 'Elektriciteit, sanitair, verwarming en ventilatie volledig vernieuwd, conform de huidige normen.'], ['Isolatie en buitenschil', 'Dak, gevel en ramen waar nodig isoleren en vernieuwen, voor een lager verbruik en meer comfort.'], ['Afwerking', 'Bepleistering, vloeren, keuken, badkamer en schilderwerk, sleutel-op-de-deur opgeleverd.']],
    whatImg: imgTrWhat,
    gallery: [imgTrG1, imgTrG2, imgTrG3],
    reviews: [{ text: '"We hebben een oude rijwoning volledig laten strippen en heropbouwen. Eén aanspreekpunt voor alles, dat heeft ons enorm veel stress gescheeld. De prijs op de offerte klopte tot op het einde."', name: 'Geert Vandenbussche', role: 'Volledige renovatie rijwoning' }, { text: '"Onze woning uit de jaren zeventig is van binnen helemaal vernieuwd: elektriciteit, sanitair, isolatie en afwerking. Hun eigen ploeg deed het meeste zelf, dat merk je aan de afstemming."', name: 'Annelies Verstraeten', role: 'Totaalrenovatie woning' }, { text: '"Bij het plaatsbezoek kregen we de raad om niet alles ineens te doen, maar de keuken en badkamer een jaar later. Dat scheelde ons een lening. Beide fases liepen volgens de planning die op papier stond."', name: 'Bart Coppens', role: 'Gefaseerde renovatie' }],
    faq: [['Wat kost een totaalrenovatie?', 'Dat hangt sterk af van de staat van de woning, de oppervlakte en de gewenste afwerking. Een totaalrenovatie loopt al snel op, daarom werken wij met een vaste prijs op papier per post. Na het gratis plaatsbezoek weet u exact waar u aan toe bent, en die offerte is meteen uw factuur.'], ['Krijg ik echt één vaste prijs voor alles?', 'Ja. Wij maken één bindende offerte op voor de volledige renovatie, post per post. Wat op de offerte staat, betaalt u, ook als materiaalprijzen ondertussen stijgen. Komen er meerwerken op uw vraag bij, dan bespreken we die vooraf en legt u het vast voor we ze uitvoeren.'], ['Werken jullie met onderaannemers?', 'Het meeste werk doet onze eigen vaste ploeg. Voor zeer specifieke onderdelen werken we soms met vaste partners die we al jaren kennen, maar de coördinatie en het aanspreekpunt blijven altijd bij ons.'], ['Geldt het 6% btw-tarief voor mijn renovatie?', 'Is uw woning ouder dan 10 jaar en blijft ze hoofdzakelijk een privéwoning, dan valt de renovatie via de aannemer doorgaans onder 6% btw op materiaal en arbeid. Wij regelen het bijhorende papierwerk en bekijken bij het plaatsbezoek of u in aanmerking komt.'], ['Hoe lang duurt een totaalrenovatie?', 'Dat verschilt per project, van enkele weken voor een gedeeltelijke renovatie tot enkele maanden voor een volledige woning. Bij de offerte krijgt u een realistische planning, en één aanspreekpunt bewaakt die tijdens de werken.'], ['Kan ik tijdens de werken in mijn woning blijven wonen?', 'Bij een gedeeltelijke renovatie meestal wel. We werken dan per zone en schermen stof zoveel mogelijk af. Bij een volledige renovatie is het vaak praktischer om er even uit te zijn; dat bespreken we eerlijk op het plaatsbezoek, zodat u vooraf weet waar u aan toe bent.'], ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen. Bij het gratis plaatsbezoek bevestigen we meteen de planning.']],
    typeWerkOpties: ['Volledige woning', 'Gedeeltelijke renovatie', 'Sleutel-op-de-deur', 'Anders'],
    finalSub: 'Liever eerst overleggen over uw plannen? Bel gerust, dan denken we mee.',
    metaTitle: 'Totaalrenovatie aan vaste prijs | AB Bouw Groep',
    metaDesc: 'Uw woning volledig renoveren met één aannemer, één vaste prijs. Casco tot afwerking, eigen ploeg, 6% btw waar het kan. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Liever dat wij u bellen?',
    werkwijzeH2: 'In 3 stappen naar uw vernieuwde woning',
    finalH2: 'Klaar om uw renovatie te plannen?',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u terug om het gratis plaatsbezoek in te plannen. Daarna volgt uw vaste prijs op papier.',
    breadcrumb: 'Totaalrenovatie',
    galleryNoun: 'Totaalrenovatie',
  },
  badkamerrenovatie: {
    slug: 'badkamerrenovatie',
    division: 'ab_bad__wellness', typeWerk: 'AB Bad & Wellness', bronLead: 'ads:badkamerrenovatie',
    eyebrow: 'Badkamerrenovatie · heel Vlaanderen',
    h1: 'Een nieuwe badkamer, in één keer goed.',
    sub: 'Wij vernieuwen uw badkamer volledig: sanitair, tegels, douche en leidingen. Eén ploeg, één vaste prijs, in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
    subBold: 'Vaste prijs vooraf',
    heroImg: imgBkHero,
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg, geen onderaannemers'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Een badkamer renoveert u maar eens in de twintig jaar',
    offerIntro: 'Dan kiest u liefst een ploeg die het van A tot Z in handen neemt. Wij coördineren sanitair, tegels en afwerking zelf, met één aanspreekpunt en een prijs die op voorhand vastligt.',
    offer: ['Offerte = factuur, ook bij prijsstijgingen', 'Gratis plaatsbezoek met eerlijk advies', 'Eén ploeg voor sanitair, tegels en leidingen', 'Eén aanspreekpunt van plan tot oplevering', '6% btw bij een woning ouder dan 10 jaar', 'Eigen vaste ploeg, geen onderaannemers'],
    steps: [['Gratis plaatsbezoek', 'Een vakman bekijkt uw badkamer, neemt de maten en bespreekt wat u in gedachten hebt.'], ['Vaste offerte', 'U krijgt een bindende prijs voor het volledige werk. Wat op de offerte staat, betaalt u.'], ['Uitvoering door eigen ploeg', 'Wij breken uit, leggen leidingen, tegelen en plaatsen het sanitair. Eén ploeg, nette werf.']],
    whatTitle: 'Wat komt er kijken bij een badkamerrenovatie?',
    whatIntro: 'Een badkamer vernieuwen is meer dan tegels en een douche. Wij verzorgen het volledige traject, van de leidingen achter de muur tot de laatste voeg.',
    what: [['Volledige renovatie', 'Uw badkamer van vloer tot plafond vernieuwd: uitbreken, leidingen, tegels, sanitair en afwerking.'], ['Inloopdouche', 'Een ruime inloopdouche op maat, waterdicht ingewerkt en gelijkvloers waar het kan.'], ['Bad vervangen door douche', 'Het oude bad eruit, een moderne douche ervoor in de plaats, leidingen mee aangepast.'], ['Sanitair en leidingen', 'Nieuwe water- en afvoerleidingen, kranen, toilet en meubel, alles correct aangesloten.']],
    whatImg: imgBkWhat,
    gallery: [imgBkG1, imgBkG2, imgBkG3],
    reviews: [{ text: '"Onze badkamer uit de jaren negentig volledig vernieuwd. Bad eruit, ruime inloopdouche erin. Eén ploeg voor alles, en de prijs klopte met de offerte."', name: 'Greet Janssens', role: 'Volledige badkamerrenovatie' }, { text: '"We twijfelden of we het bad zouden houden, maar ze toonden met de maten dat een douche de kleine ruimte een pak groter laat voelen. Achteraf blij dat we geluisterd hebben. Het toilet schoof mee een halve meter op, alles strak aangesloten."', name: 'Peter Maes', role: 'Bad vervangen door douche' }, { text: '"Vaste prijs vooraf, geen verrassingen achteraf. De leidingen zaten verouderd, ze hebben dat meteen mee opgelost. Heel tevreden."', name: 'Linda Verbeeck', role: 'Inloopdouche op maat' }],
    faq: [['Wat kost een badkamerrenovatie?', 'Dat hangt af van de oppervlakte, het sanitair, de tegels en de staat van de leidingen. Een complete badkamer ligt doorgaans tussen 9.000 en 18.000 euro. U krijgt een vaste prijs na het gratis plaatsbezoek; wat op de offerte staat, betaalt u.'], ['Hoe lang duurt een badkamerrenovatie?', 'Een volledige badkamer is doorgaans in twee tot drie weken klaar, afhankelijk van de omvang en de droogtijden. Bij het plaatsbezoek geven we u een realistische planning.'], ['Doen jullie alles zelf of met onderaannemers?', 'Alles met onze eigen vaste ploeg. Sanitair, tegelwerk en leidingen zitten in één hand, met één aanspreekpunt van begin tot oplevering.'], ['Kan ik mijn bad laten vervangen door een inloopdouche?', 'Ja, dat is een van de meest gevraagde renovaties. Wij halen het bad eruit, passen de leidingen en de afvoer aan en plaatsen een waterdichte inloopdouche.'], ['Betaal ik 6% of 21% btw?', 'Is uw woning ouder dan 10 jaar, dan valt de renovatie inclusief plaatsing meestal onder 6% btw. Wij bekijken of u in aanmerking komt en regelen het papierwerk.'], ['Kan ik mijn badkamer nog gebruiken tijdens de werken?', 'Bij een volledige renovatie ligt de badkamer een aantal dagen stil, van het uitbreken tot het sanitair terug aangesloten is. Heeft u maar één badkamer, zeg dat op het plaatsbezoek: we plannen het toilet en een werkende douche dan als eerste opnieuw aan, zodat u zo weinig mogelijk dagen zonder zit.'], ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen. Bij het gratis plaatsbezoek bevestigen we meteen de planning.']],
    typeWerkOpties: ['Volledige badkamer', 'Inloopdouche', 'Bad vervangen door douche', 'Anders'],
    finalSub: 'Liever eerst iemand aan de lijn? Bel gerust.',
    metaTitle: 'Badkamerrenovatie aan vaste prijs | AB Bouw Groep',
    metaDesc: 'Badkamer laten renoveren in Vlaanderen: sanitair, tegels, douche en leidingen door één ploeg. Vaste prijs vooraf, 6% btw waar het kan. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Liever dat wij u bellen?',
    werkwijzeH2: 'In 3 stappen naar uw nieuwe badkamer',
    finalH2: 'Klaar voor een nieuwe badkamer?',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u terug om uw gratis plaatsbezoek in te plannen. Daarna volgt uw vaste prijs op papier.',
    breadcrumb: 'Badkamerrenovatie',
    galleryNoun: 'Badkamerrenovatie',
  },
  tegelwerken: {
    slug: 'tegelwerken',
    division: 'ab_interieurwerken', typeWerk: 'AB Interieurwerken', bronLead: 'ads:tegelwerken',
    eyebrow: 'Tegelwerken · vloer- en wandtegels · heel Vlaanderen',
    h1: 'Strak gelegde tegels, tot in de hoek correct.',
    sub: 'Vloer- en wandtegels in badkamer, keuken of woonkamer, ook grootformaat. Vlak gelegd, met voegen die kloppen, in heel Vlaanderen.',
    subBold: 'Eigen ploeg, vaste prijs per m²',
    heroImg: imgTgHero,
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg, geen onderaannemers'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Tegels leggen is precisiewerk, geen invulwerk',
    offerIntro: 'Een scheve voeg of een holle tegel ziet u elke dag opnieuw. Onze eigen tegelzetters leggen vlak, voegen strak door en werken elke hoek netjes af.',
    offer: ['Vaste prijs per m², offerte = factuur', 'Gratis plaatsbezoek met advies over tegel en legpatroon', 'Eigen vaste ploeg, geen onderaannemers', 'Vlak gelegd, geen holle tegels of scheve voegen', 'Grootformaat en XXL-tegels vakkundig geplaatst', '6% btw bij een woning ouder dan 10 jaar'],
    steps: [['Gratis plaatsbezoek', 'Een vakman meet op en bespreekt tegelkeuze, legpatroon en voegkleur.'], ['Vaste offerte', 'U krijgt een bindende prijs per m². Wat op de offerte staat, betaalt u.'], ['Plaatsing door eigen ploeg', 'Wij egaliseren de ondergrond en leggen de tegels vlak en strak doorgevoegd.']],
    whatTitle: 'Wat houdt tegels plaatsen in?',
    whatIntro: 'Een mooie tegelvloer begint bij een vlakke ondergrond. Wij verzorgen het volledige werk, van voorbereiding tot de laatste voeg.',
    what: [['Vloertegels leggen', 'Keramische tegels of grootformaat, vlak gelegd in badkamer, keuken of woonkamer.'], ['Wandtegels plaatsen', 'Wandtegels strak en waterpas geplaatst, met nette aansluitingen rond kranen en stopcontacten.'], ['Grootformaat en XXL', 'Grote formaten gelijmd in volvlak, zodat er geen holle plekken onder de tegel zitten.'], ['Voegen en afwerking', 'Strak doorgevoegd in de juiste kleur, hoeken en plinten netjes afgewerkt.']],
    whatImg: imgTgWhat,
    gallery: [imgTgG1, imgTgG2, imgTgG3],
    reviews: [{ text: '"Volledige woonkamer in grootformaat tegels. Kaarsrecht gelegd en strak gevoegd. Mooi resultaat."', name: 'Marc Hermans', role: 'Vloertegels woonkamer' }, { text: '"Badkamer volledig betegeld, vloer en wanden. Netjes afgewerkt rond de kranen en strak doorgevoegd. Heel tevreden."', name: 'Liesbeth Coninckx', role: 'Badkamer betegeld' }, { text: '"Goed advies over het legpatroon, ze hebben echt meegedacht. Keuken en hal in één lijn doorgelegd. Mooi gedaan."', name: 'Patrick Goossens', role: 'Keuken- en vloertegels' }],
    faq: [['Wat kost tegels leggen per m²?', 'Dat hangt af van het formaat, het legpatroon en de staat van de ondergrond. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'], ['Leggen jullie ook grootformaat en XXL-tegels?', 'Ja. Grote formaten lijmen we in volvlak, zodat er geen holle plekken onder de tegel zitten. Dat vraagt een vlakke ondergrond, die bereiden we correct voor.'], ['Moet de ondergrond eerst worden voorbereid?', 'Meestal wel. Een vlakke, draagkrachtige ondergrond is de basis voor een strak resultaat. Bij het plaatsbezoek beoordelen we of egaliseren nodig is.'], ['Geldt het 6% btw-tarief voor tegelwerken?', 'Bij een woning ouder dan 10 jaar valt tegelwerk incl. plaatsing en materiaal via ons onder het 6% renovatietarief. Bij nieuwbouw is dat 21%. Dat papierwerk regelen wij.'], ['Plaatsen jullie ook de tegels die ik zelf gekozen heb?', 'Ja. U kiest de tegels in de showroom, wij verzorgen de plaatsing. We adviseren gerust over formaat en legpatroon zodat alles strak uitkomt.'], ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.']],
    typeWerkOpties: ['Vloertegels', 'Wandtegels', 'Grootformaat / XXL', 'Anders'],
    finalSub: 'Praat met één van onze projectleiders.',
    metaTitle: 'Tegels laten leggen aan vaste prijs | AB Bouw Groep',
    metaDesc: 'Vloer- en wandtegels laten leggen in Vlaanderen, ook grootformaat. Vlak gelegd, strak gevoegd, vaste prijs per m². Eigen ploeg. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Liever dat wij u bellen?',
    werkwijzeH2: 'In 3 stappen een strakke tegelvloer',
    finalH2: 'Klaar voor strak gelegde tegels?',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u terug om het gratis plaatsbezoek in te plannen. Daarna volgt uw vaste prijs per m² op papier.',
    breadcrumb: 'Tegelwerken',
    galleryNoun: 'Tegelwerk',
  },
  pleisterwerk: {
    slug: 'pleisterwerk',
    division: 'ab_interieurwerken', typeWerk: 'AB Interieurwerken', bronLead: 'ads:pleisterwerk',
    eyebrow: 'Pleisterwerk & gyproc · heel Vlaanderen',
    h1: 'Strakke wanden en plafonds, klaar om te schilderen.',
    sub: 'Pleisterwerk, bepleistering en gyproc in Mechelen, Antwerpen, Lier en heel Vlaanderen. Wij pleisteren uw wanden en plafonds vlak en strak, klaar voor de verf.',
    subBold: 'Vaste prijs vooraf, eigen ploeg',
    heroImg: imgPlHero,
    certLogo: { src: '/assets/logos/knauf.png', alt: 'Knauf' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg, geen onderaannemers'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Een vlakke muur ziet u pas als de verf erop zit.',
    offerIntro: 'Een goede pleisterlaag valt niet op, een slechte des te meer: golven, scheuren of uitzakkers zie je voor de rest van de tijd. Wij werken met een eigen vaste ploeg en leveren wanden en plafonds strak en vlak op.',
    offer: ['Offerte = factuur, ook bij prijsstijgingen', 'Gratis plaatsbezoek met opmeting en eerlijk advies', 'Vlakke, strakke afwerking, klaar om te schilderen', 'Pleisterwerk en gyproc door dezelfde ploeg', '6% btw bij een woning ouder dan 10 jaar', 'Eigen ploeg, geen onderaannemers'],
    steps: [['Gratis plaatsbezoek', 'Een vakman meet de wanden en plafonds op en bespreekt de afwerking.'], ['Vaste offerte', 'U krijgt een bindende prijs per m² voor pleisterwerk of gyproc. Zo weet u exact waar u aan toe bent.'], ['Uitvoering door eigen ploeg', 'Wij bereiden de ondergrond voor en pleisteren uw wanden en plafonds vlak en strak.']],
    whatTitle: 'Wat houdt pleisterwerk in?',
    whatIntro: 'Van een ruwe muur naar een vlakke wand: dat is pleisterwerk. Wij doen het natte pleisterwerk én de drogere gyproc-opbouw, zodat uw hele binnenafwerking bij één ploeg ligt.',
    what: [['Wanden pleisteren', 'Bepleistering van bakstenen of betonnen muren, vlak afgewerkt en klaar voor de verf.'], ['Plafonds pleisteren', 'Plafonds strak en egaal pleisteren, zonder zichtbare overgangen of golven.'], ['Gyproc & voorzetwanden', 'Gipsplaten, scheidingswanden en voorzetwanden plaatsen, dichtgezet en uitgevlakt.'], ['Voorbereiding', 'Ondergrond reinigen, uitvlakken en voorstrijken, zodat de pleister blijft zitten en niet scheurt.']],
    whatImg: imgPlWhat,
    gallery: [imgPlG1, imgPlG2, imgPlG3],
    reviews: [{ text: '"Heel het benedenverdiep opnieuw laten pleisteren. Strak en vlak, geen oneffenheden. En alles netjes afgeplakt voor ze begonnen."', name: 'Wim Heylen', role: 'Wanden en plafonds gepleisterd' }, { text: '"Voor de nieuwe slaapkamers een gyproc voorzetwand laten plaatsen en alles mee gepleisterd. Vaste prijs vooraf, geen verrassingen achteraf."', name: 'Annelies Maes', role: 'Gyproc + pleisterwerk' }, { text: '"Plafond in de living zat vol haarscheuren door de oude pleister. Ze raadden af om er gewoon over te schilderen en hebben het volledig uitgevlakt en herpleisterd. Een halfjaar later nog altijd geen barst te zien."', name: 'Geert Vermeiren', role: 'Plafond pleisteren' }],
    faq: [['Wat kost pleisterwerk per m²?', 'Dat hangt af van de oppervlakte, de staat van de ondergrond en de gewenste afwerking. U krijgt een vaste prijs per m² na het gratis plaatsbezoek. Wat op de offerte staat, betaalt u.'], ['Doen jullie ook gyproc en voorzetwanden?', 'Ja. Wij plaatsen gipsplaten, scheidingswanden en voorzetwanden, en pleisteren ze meteen af. Pleisterwerk en gyproc liggen zo bij dezelfde ploeg.'], ['Valt pleisterwerk onder 6% btw?', 'Bij een woning ouder dan 10 jaar valt pleisterwerk en gyproc onder het 6% renovatietarief. Bij nieuwbouw is dat 21%. Wij regelen het bijhorende papierwerk.'], ['Hoe lang moet de pleister drogen?', 'Vers pleisterwerk droogt doorgaans enkele weken, afhankelijk van de dikte en de ventilatie. Pas daarna schildert u best. Wij zeggen u bij de oplevering wanneer de muur schilderklaar is.'], ['Kan ik er meteen op schilderen?', 'Nee, laat de pleister eerst volledig uitdrogen. Daarna is de wand vlak en klaar voor de verf, zonder extra uitvlakwerk.'], ['Geeft pleisteren veel stof in een bewoond huis?', 'Pleisteren zelf is nat werk en stuift weinig; het stof komt vooral van het opruwen, schuren en uitkappen vooraf. Daarom dekken we de vloer en alles wat blijft staan af en zetten we de werkzone met folie dicht naar de rest van het huis. Op het einde van elke werkdag halen we het grove stof weg. Werken we in een bewoonde woning, ruim de kamer dan zoveel mogelijk leeg; dan blijft het stof beperkt tot die ene ruimte.'], ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.']],
    typeWerkOpties: ['Wanden pleisteren', 'Plafond pleisteren', 'Gyproc / voorzetwand', 'Anders'],
    finalSub: 'Praat met één van onze projectleiders.',
    metaTitle: 'Pleisterwerk & gyproc, vaste prijs | AB Bouw Groep',
    metaDesc: 'Pleisterwerk en gyproc in Vlaanderen. Wanden en plafonds vlak afgewerkt, vaste prijs per m², eigen ploeg. 6% btw waar het kan. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Liever dat wij u bellen?',
    werkwijzeH2: 'In 3 stappen geregeld',
    finalH2: 'Klaar om uw wanden te laten pleisteren?',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u terug om het gratis plaatsbezoek in te plannen. Daarna volgt uw vaste prijs per m² op papier.',
    breadcrumb: 'Pleisterwerk',
    galleryNoun: 'Pleisterwerk',
  },
  terrasaanleg: {
    slug: 'terrasaanleg',
    division: 'ab_construct', typeWerk: 'AB Construct', bronLead: 'ads:terrasaanleg',
    eyebrow: 'Terrasaanleg · heel Vlaanderen',
    h1: 'Een terras dat vlak ligt en jaren goed blijft afwateren.',
    sub: 'Terras aanleggen in keramische tegels, natuursteen, klinkers of hout. In Mechelen, Antwerpen, Lier en heel Vlaanderen, met een correcte fundering en afwatering.',
    subBold: 'Vaste prijs vooraf',
    heroImg: imgTeHero,
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg, geen onderaannemers'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw terrasaannemer in heel Vlaanderen',
    offerIntro: 'AB Bouw Groep legt uw terras aan met een eigen vaste ploeg, van grondwerk tot de laatste voeg. We bekijken samen welk materiaal bij uw tuin en budget past.',
    offer: ['Offerte = factuur, ook bij prijsstijgingen', 'Gratis plaatsbezoek met advies over materiaal en afwatering', 'Keuze uit keramische tegels, natuursteen, klinkers of hout', 'Stevige fundering en een terras dat correct afwatert', '6% btw bij een woning ouder dan 10 jaar, papierwerk regelen wij', 'Eigen ploeg, geen onderaannemers'],
    steps: [['Gratis plaatsbezoek', 'Een vakman bekijkt uw tuin, de ondergrond en de afwatering, en adviseert over het materiaal.'], ['Vaste offerte', 'U krijgt een bindende prijs per m². Zo weet u exact waar u aan toe bent.'], ['Aanleg door eigen ploeg', 'Wij verzorgen grondwerk, fundering, afwatering en plaatsing tot het terras volledig af is.']],
    whatTitle: 'Wat houdt een terras aanleggen in?',
    whatIntro: 'Een goed terras begint onder de grond. Wij verzorgen de volledige opbouw, van uitgraven en funderen tot het plaatsen en voegen van uw terras.',
    what: [['Keramische tegels', 'Keramiek op tegeldragers of in een vol bed. Vlekt en verkleurt niet, dweilen volstaat om het schoon te houden.'], ['Natuursteen of blauwsteen', 'Belgische blauwsteen of natuursteen voor een warme, tijdloze terraslook.'], ['Klinkers of hout', 'Klinkers en kasseien voor een klassieke tuin, of hardhout zoals padoek voor een natuurlijk terras.'], ['Fundering en afwatering', 'Een stevige onderbouw en het juiste afschot, zodat regenwater netjes wegloopt.']],
    whatImg: imgTeWhat,
    gallery: [imgTeG1, imgTeG2, imgTeG3],
    reviews: [{ text: '"Nieuw terras in keramische tegels, mooi vlak. Na een regenbui staat er nergens nog een plas. Proper opgeleverd."', name: 'Dries Luyckx', role: 'Keramisch terras' }, { text: '"Terras in blauwsteen laten aanleggen. Mooi vlak gelegd en het water loopt netjes weg. Heel content met het resultaat."', name: 'Nadine Peeters', role: 'Natuursteen terras' }, { text: '"Oud terras vervangen door een houten terras. Strak gelegd en klaar binnen de afgesproken week. Heel tevreden."', name: 'Wim Claessens', role: 'Houten terras' }],
    faq: [['Wat kost een terras aanleggen per m²?', 'Dat hangt af van het materiaal, de grootte, de ondergrond en de afwatering. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'], ['Welk materiaal kies ik best?', 'Keramiek hoeft u enkel te dweilen, natuursteen leeft mee met uw gevel, klinkers passen bij een landelijke tuin en hout vraagt jaarlijks een olie-beurt. Bij het plaatsbezoek bekijken we samen wat bij uw tuin en budget past.'], ['Leggen jullie ook de fundering en afwatering?', 'Ja. Wij verzorgen het grondwerk, de fundering en het juiste afschot, zodat uw terras vlak ligt en regenwater goed wegloopt.'], ['Kunnen jullie mijn oude terras vervangen?', 'Ja. We breken het oude terras uit, bereiden de ondergrond opnieuw voor en leggen uw nieuwe terras aan.'], ['Geldt het 6% btw-tarief voor mijn terras?', 'Bij een woning ouder dan 10 jaar valt het terras meestal onder 6% btw op arbeid en materiaal. Bij nieuwbouw of een woning jonger dan 10 jaar is dat 21%. We bekijken het samen.'], ['Wat gebeurt er met de uitgegraven grond en het puin?', 'Bij het uitgraven en bij het uitbreken van een oud terras komen grond en puin vrij. Wij voeren dat zelf af; de afvoer en de containers zitten in de offerteprijs. Tijdens de werken stapelen we de materialen op één plek in de tuin, en bij de oplevering harken we de werkzone proper aan.'], ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.']],
    typeWerkOpties: ['Keramisch terras', 'Natuursteen terras', 'Terras in klinkers', 'Houten terras'],
    finalSub: 'Praat met één van onze projectleiders.',
    metaTitle: 'Terras aanleggen — vaste prijs | AB Bouw Groep',
    metaDesc: 'Terras aanleggen in keramiek, natuursteen, klinkers of hout. Correcte fundering en afwatering. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Vraag uw vaste prijs voor uw terras',
    werkwijzeH2: 'Zo leggen wij uw terras aan',
    finalH2: 'Klaar voor uw nieuwe terras?',
    urgencyLine: 'Voorjaar en zomer zijn druk voor terrasaanleg, vraag tijdig uw plaatsbezoek aan.',
    quickThanks: 'Bedankt, we bekijken uw aanvraag en bellen u binnen één werkdag terug.',
    breadcrumb: 'Terrasaanleg',
    galleryNoun: 'terrasprojecten',
  },
  oprit: {
    slug: 'oprit',
    division: 'ab_construct', typeWerk: 'AB Construct', bronLead: 'ads:oprit',
    eyebrow: 'Oprit aanleggen · heel Vlaanderen',
    h1: 'Een oprit die jaren strak blijft liggen.',
    sub: 'Oprit aanleggen of vernieuwen in klinkers, betonklinkers of waterdoorlatende verharding. Met de juiste fundering en afboording, in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
    subBold: 'Eigen ploeg',
    heroImg: imgOpHero,
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Uw oprit ligt er decennia. De fundering bepaalt of hij vlak blijft.',
    offerIntro: 'Een oprit die verzakt of waar klinkers loskomen, begint bijna altijd onder de grond. Wij leggen eerst een stabiele fundering en plaatsen pas dan de klinkers, met een eigen vaste ploeg.',
    offer: ['Offerte = factuur, ook bij prijsstijgingen', 'Gratis plaatsbezoek met advies over materiaal en afwatering', 'Stabiele fundering, zodat uw oprit niet verzakt', 'Klinkers, betonklinkers of waterdoorlatende verharding', 'Nette afboording die de oprit op zijn plaats houdt', 'Eigen ploeg, geen onderaannemers'],
    steps: [['Gratis plaatsbezoek', 'Een vakman meet de oprit op, bekijkt de afwatering en bespreekt het materiaal.'], ['Vaste offerte', 'U krijgt een bindende prijs voor de volledige oprit, fundering en afboording inbegrepen. Zo weet u exact waar u aan toe bent.'], ['Aanleg door eigen ploeg', 'Wij graven uit, leggen de fundering en plaatsen de klinkers strak en op niveau.']],
    whatTitle: 'Wat komt er kijken bij een oprit aanleggen?',
    whatIntro: 'Een oprit is meer dan klinkers leggen. De fundering en de afwatering bepalen of hij na jaren nog vlak ligt. Wij verzorgen het volledige werk, van uitgraven tot de laatste voeg.',
    what: [['Klinkers en betonklinkers', 'Klassieke kleiklinkers of betonklinkers, strak gelegd in het verband naar keuze.'], ['Waterdoorlatende oprit', 'Verharding waar regenwater in de bodem zakt in plaats van naar de straat te lopen.'], ['Fundering en uitgraven', 'Uitgraven en een stabiele onderbouw, zodat uw oprit niet verzakt of golft.'], ['Afboording en afwatering', 'Nette boordstenen en de juiste afschot, zodat water wegloopt en de klinkers op hun plaats blijven.']],
    whatImg: imgOpWhat,
    gallery: [imgOpG1, imgOpG2, imgOpG3],
    reviews: [{ text: '"Onze oude oprit was helemaal verzakt. Alles opnieuw aangelegd en twee winters later ligt er nog geen klinker scheef. Top."', name: 'Bram Verschueren', role: 'Oprit vernieuwd' }, { text: '"Voor waterdoorlatende klinkers gekozen op hun advies. Geen plassen meer en regenwater zakt gewoon weg. Vaste prijs vooraf, nette ploeg."', name: 'Annelies Peeters', role: 'Waterdoorlatende oprit' }, { text: '"Nieuwe oprit in betonklinkers, strak gelegd. Een groot verschil met de oude die overal verzakt was. Heel tevreden."', name: 'Patrick Wouters', role: 'Oprit in betonklinkers' }],
    faq: [['Wat kost een oprit aanleggen?', 'Dat hangt af van de oppervlakte, het materiaal en de bestaande ondergrond. U krijgt een vaste prijs voor de volledige oprit na het gratis plaatsbezoek, fundering en afboording inbegrepen.'], ['Klinkers of waterdoorlatende verharding?', 'Klinkers en betonklinkers zijn strak en onderhoudsarm. Waterdoorlatende verharding laat regenwater in de bodem zakken, wat wateroverlast beperkt. Bij het plaatsbezoek adviseren we wat past bij uw oprit en ondergrond.'], ['Hoe lang gaat een oprit mee?', 'Met een goede fundering en afwatering gaat een oprit doorgaans decennia mee zonder te verzakken. De onderbouw is daarbij belangrijker dan de klinker zelf.'], ['Verzakt een oprit na verloop van tijd?', 'Niet als de fundering klopt. Verzakking komt bijna altijd door een te dunne of slecht aangereden onderbouw. Daarom besteden wij daar de meeste aandacht aan.'], ['Betaal ik 6 of 21% btw op een oprit?', 'Een losstaande oprit valt meestal onder 21% btw. Maakt de oprit deel uit van een renovatie van een woning ouder dan 10 jaar, dan kan 6% gelden. Wij bekijken het tarief samen op het plaatsbezoek.'], ['Kan ik mijn auto kwijt terwijl de oprit openligt?', 'Tijdens het uitgraven en de eerste dagen kunt u niet over de oprit rijden, en pas helemaal op het einde mag u opnieuw op de verse klinkers. Reken op enkele dagen waarin u de wagen elders zet, op straat of bij een buur. We bespreken de planning vooraf, zodat u weet welke dagen het zijn en uw auto niet ingesloten raakt.'], ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.']],
    typeWerkOpties: ['Nieuwe oprit', 'Oprit vernieuwen', 'Waterdoorlatend', 'Anders'],
    finalSub: 'Praat met één van onze projectleiders.',
    metaTitle: 'Oprit aanleggen — vaste prijs | AB Bouw Groep',
    metaDesc: 'Oprit aanleggen of vernieuwen in Vlaanderen: klinkers, betonklinkers of waterdoorlatend, stabiele fundering. Vaste prijs, eigen ploeg. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Liever dat wij u bellen?',
    werkwijzeH2: 'In 3 stappen geregeld',
    finalH2: 'Klaar voor een nieuwe oprit?',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u terug om het gratis plaatsbezoek in te plannen. Daarna volgt uw vaste prijs op papier.',
    breadcrumb: 'Oprit aanleggen',
    galleryNoun: 'Oprit',
  },
  zwembad: {
    slug: 'zwembad',
    division: 'ab_construct', typeWerk: 'AB Construct', bronLead: 'ads:zwembad',
    eyebrow: 'Zwembad aanleggen · heel Vlaanderen',
    h1: 'Een zwembad in uw eigen tuin, vakkundig aangelegd.',
    sub: 'Een inbouwzwembad laat u maar één keer aanleggen. Wij verzorgen het volledige werk, van het graafwerk tot het bad en het terras errond, in heel Vlaanderen.',
    subBold: 'Eigen ploeg, vaste prijs vooraf',
    heroImg: imgZwHero,
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Eigen ploeg, geen onderaannemers'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Een zwembad is een bouwproject, geen aankoop',
    offerIntro: 'Het bad is maar één deel; of het over twintig jaar nog strak en dicht ligt, hangt af van de grond, de afwatering en wie het plaatst. Wij leggen zwembaden aan met een eigen vaste ploeg en zetten alles op papier voor de eerste spade de grond in gaat.',
    offer: ['Offerte = factuur, ook bij prijsstijgingen', 'Gratis plaatsbezoek met advies over type en ligging', 'Beton op maat of een polyester bad in één stuk', 'Graafwerk, plaatsing en afwerking in eigen beheer', 'Terras en omgeving mee afgewerkt indien gewenst', 'Eigen ploeg, geen onderaannemers'],
    steps: [['Gratis plaatsbezoek', 'Een vakman bekijkt uw tuin, de ondergrond en de toegang, en bespreekt type en ligging.'], ['Vaste offerte', 'U krijgt een bindende prijs voor het volledige project, van graafwerk tot afwerking. Dat bedrag is meteen uw factuur.'], ['Aanleg door eigen ploeg', 'Wij graven uit, plaatsen het bad en werken alles af, met één vast aanspreekpunt van begin tot eind.']],
    whatTitle: 'Wat komt er kijken bij een zwembad aanleggen?',
    whatIntro: 'Een inbouwzwembad is meer dan een bad in de grond. Wij verzorgen de volledige opbouw, van de uitgraving tot het afgewerkte terras errond.',
    what: [['Betonnen zwembad', 'Een bouwkundig bad, ter plaatse gestort of gemetst, volledig op maat van uw tuin en afmetingen.'], ['Polyester zwembad', 'Een monoblok bad in één stuk, sneller geplaatst en in vaste modellen en kleuren.'], ['Graafwerk & techniek', 'Uitgraving, fundering, leidingen en de filterinstallatie, correct aangelegd en afgewaterd.'], ['Terras & afwerking', 'Boordstenen, terras en de omgeving errond, strak afgewerkt tot een geheel.']],
    whatImg: imgZwWhat,
    gallery: [imgZwG1, imgZwG2, imgZwG3],
    reviews: [{ text: '"Inbouwzwembad in beton in onze tuin. Graafwerk, bad en terras errond, alles door dezelfde ploeg. Netjes geregeld van begin tot eind."', name: 'Koen De Coninck', role: 'Betonnen inbouwzwembad' }, { text: '"Wij twijfelden tussen beton en polyester. Eerlijk advies dat een polyester bad voor onze tuin volstond, scheelde flink in prijs. Netjes geplaatst."', name: 'Veerle Cools', role: 'Polyester zwembad' }, { text: '"Vaste prijs voor het hele project vooraf, van uitgraving tot terras. Geen verrassingen achteraf, werf elke dag proper. Heel tevreden."', name: 'Filip Smets', role: 'Zwembad met terras' }],
    faq: [['Wat kost een zwembad aanleggen?', 'Dat hangt af van de afmetingen, het type bad (beton of polyester), de grondsoort en de afwerking errond. Een inbouwzwembad is een groot project; u krijgt een vaste prijs voor het volledige werk na het gratis plaatsbezoek.'], ['Beton of polyester: wat kies ik?', 'Een betonnen bad is volledig op maat en in elke vorm mogelijk. Een polyester bad komt in één stuk en is sneller geplaatst, maar in vaste modellen. Bij het plaatsbezoek adviseren we eerlijk wat past bij uw tuin en budget.'], ['Doen jullie ook het graafwerk en het terras?', 'Ja. Wij verzorgen het volledige project met eigen ploeg: uitgraving, fundering, leidingen, het bad zelf en de afwerking met boordstenen en terras errond.'], ['Hoe lang duurt de aanleg?', 'Dat verschilt per project. Een polyester bad gaat sneller dan een gestort betonnen bad, en de afwerking errond telt mee. Bij de offerte krijgt u een realistische planning op papier.'], ['Welk btw-tarief geldt er?', 'Voor een nieuw zwembad is dat niet automatisch het verlaagde tarief. Bij het plaatsbezoek bekijken we welk btw-tarief in uw situatie van toepassing is, zodat u vooraf weet waar u aan toe bent.'], ['Moet er een graafmachine door mijn tuin, en wat met de schade?', 'Voor de uitgraving moet er inderdaad een kraan tot bij de plek van het bad. Op het plaatsbezoek kijken we eerst hoe we binnen geraken: langs welke kant, of er een poort of haag tijdelijk weg moet, en of we het tuinpad moeten beschermen. Het rijtracé en de stockplek voor de grond rekenen we als onbruikbaar voor de duur van de werken; gazon of beplanting daar herstellen we nadien niet automatisch, dus wat u zelf wil sparen, spreken we vooraf af.'], ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.']],
    typeWerkOpties: ['Betonnen zwembad', 'Polyester zwembad', 'Zwembad met terras', 'Anders'],
    finalSub: 'Vragen over beton, polyester of de planning? Bel ons even.',
    metaTitle: 'Zwembad laten aanleggen aan vaste prijs | AB Bouw Groep',
    metaDesc: 'Inbouwzwembad laten aanleggen in Vlaanderen: beton of polyester, graafwerk tot afwerking, terras errond. Vaste prijs, eigen ploeg. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Uw tuin laten bekijken?',
    werkwijzeH2: 'Zo leggen we uw zwembad aan',
    finalH2: 'Klaar voor een zwembad in eigen tuin?',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen. Plan tijdig voor het zwemseizoen.',
    quickThanks: 'We bellen u terug om het gratis plaatsbezoek in te plannen. Daarna volgt uw vaste prijs op papier.',
    breadcrumb: 'Zwembad aanleggen',
    galleryNoun: 'Zwembad',
  },
  velux: {
    slug: 'velux',
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:velux',
    eyebrow: 'Velux dakramen · plaatsing en vervanging',
    h1: 'Meer daglicht op zolder met een Velux dakraam',
    sub: 'Een raam in uw dak moet in één keer goed zitten. Wij plaatsen en vervangen Velux dakramen in heel Vlaanderen, waterdicht ingewerkt en vanbinnen netjes afgewerkt.',
    subBold: 'Eén vaste prijs, plaatsing en binnenafwerking inbegrepen',
    heroImg: imgVx2,
    stepsImg: imgVeluxStappen,
    certLogo: { src: velux, alt: 'Velux' },
    topbar: ['Gratis opmeting binnen 5 werkdagen', 'Erkend Velux-plaatser'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Een dakraam is dakwerk. En dakwerk is ons vak.',
    offerIntro: 'Het raam is Velux-kwaliteit; of het over twintig jaar nog waterdicht zit, hangt af van wie het plaatst. Wij renoveren daken sinds 2010 en geven 10 jaar garantie op de waterdichtheid.',
    offer: [
      'Eén vaste prijs, plaatsing en afwerking inbegrepen',
      '10 jaar garantie op de waterdichtheid',
      'Gratis opmeting met eerlijk advies',
      'Erkend Velux-plaatser, fabrieksgarantie behouden',
      '6% btw waar het kan, papierwerk inbegrepen',
      'Binnen afgeschermd tegen stof, proper opgeleverd',
    ],
    steps: [
      ['Gratis opmeting', 'Een vakman meet op en bespreekt type en formaat.'],
      ['Vaste offerte', 'Eén bindende prijs, plaatsing en afwerking inbegrepen. Een standaardplaatsing start rond 1.250 euro.'],
      ['Plaatsing op één dag', 'Waterdicht ingewerkt en vanbinnen afgewerkt. Doorgaans op één dag, \'s avonds is uw dak weer dicht.'],
    ],
    whatTitle: 'Wat komt er kijken bij een Velux-plaatsing?',
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
      { text: '"Twee Velux-ramen op de zolderkamer. \'s Morgens begonnen, tegen de avond alles dicht en de binnenkant mee gepleisterd."', name: 'Bart Wouters', role: 'Twee dakramen op zolder' },
      { text: '"Ons oud dakraam had condens tussen het glas en lekte bij felle regen. Vervangen door een nieuwe Velux, gootstuk en al. Netjes afgewerkt."', name: 'Katrien De Smet', role: 'Vervanging oud dakraam' },
      { text: '"Eerlijk advies over het juiste formaat, en op één dag geplaatst. Vanbinnen netjes afgewerkt."', name: 'Tom Vermeulen', role: 'Nieuw dakraam' },
    ],
    faq: [
      ['Wat kost een Velux dakraam geplaatst?', 'Dat hangt af van het type, het formaat en de bestaande dakopbouw. Een standaardplaatsing start doorgaans rond €1.250 inclusief plaatsing. U krijgt een vaste prijs na de gratis opmeting.'],
      ['Plaatsen jullie ook in een bestaand pannendak?', 'Ja. Wij plaatsen Velux-dakramen in pannendaken en leien daken, met het juiste gootstuk zodat alles waterdicht blijft.'],
      ['Krijg ik condens op mijn nieuwe dakraam?', 'Bij een correct geplaatst dakraam met geïsoleerde inwerking hoort condens niet thuis. Condens tussen het glas van een oud dakraam betekent versleten beglazing; dat lost een vervanging op. Goed ventileren blijft belangrijk, zoals bij elk raam.'],
      ['Hoe lang duurt de plaatsing?', 'Een standaard dakraam plaatsen we doorgaans op één dag, inclusief binnenafwerking.'],
      ['Krijg ik garantie op de plaatsing?', 'Ja. U krijgt 10 jaar garantie op de waterdichtheid van de plaatsing, bovenop de fabrieksgarantie van Velux op het raam zelf.'],
      ['Werken jullie in mijn regio?', 'Wij werken in heel Vlaanderen, met de meeste werven rond Antwerpen, Mechelen en Lier. Bij de gratis opmeting bevestigen we meteen de planning.'],
    ],
    typeWerkOpties: ['Nieuw dakraam', 'Vervanging', 'Meerdere ramen', 'Anders'],
    finalSub: 'Liever eerst iemand aan de lijn? Bel gerust.',
    metaTitle: 'Velux dakraam laten plaatsen aan vaste prijs | AB Bouw Groep',
    metaDesc: 'Velux dakramen plaatsen en vervangen in Vlaanderen. Vaste prijs incl. plaatsing en binnenafwerking, 10 jaar garantie op waterdichtheid. Gratis opmeting.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Liever dat wij u bellen?',
    finalH2: 'Klaar voor meer licht op zolder?',
    urgencyLine: 'Gratis opmeting, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u zo snel mogelijk terug om uw gratis opmeting in te plannen.',
    breadcrumb: 'Velux dakramen',
    galleryNoun: 'Velux dakraam',
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
    finalSub: 'Praat met één van onze projectleiders.',
    metaTitle: 'Gevelreiniging — zonder schade aan uw gevel | AB Bouw Groep',
    metaDesc: 'Professionele gevelreiniging in Vlaanderen. Juiste methode per gevelsteen, geen schade aan de voegen, optioneel impregneren. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Liever dat wij u bellen?',
    werkwijzeH2: 'Zo reinigen we uw gevel',
    finalH2: 'Klaar voor een propere gevel?',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u terug om uw gevel te komen bekijken. Daarna volgt uw vaste prijs per m² op papier.',
    breadcrumb: 'Gevelreiniging',
    galleryNoun: 'Gevelreiniging',
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
    signs: {
      title: 'Tijd om te hervoegen? Herkent u dit?',
      intro: 'Voegen gaan niet eeuwig mee. Deze signalen wijzen erop dat uw gevel toe is aan nieuw voegwerk — wacht niet tot vocht de muur aantast.',
      items: [
        'Voegen die loskomen, verbrokkelen of als zand wegvallen',
        'Diep uitgesleten voegen waar u makkelijk een muntstuk in steekt',
        'Vochtplekken, schimmel of een muffe geur aan de binnenmuur',
        'Groene aanslag of mosvorming op de gevel',
        'Losse of hol klinkende gevelstenen',
        'Witte kalkuitslag (uitbloei) op het metselwerk',
      ],
    },
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
    finalSub: 'Praat met één van onze projectleiders.',
    metaTitle: 'Gevel hervoegen — uitslijpen en voegen | AB Bouw Groep',
    metaDesc: 'Gevel laten hervoegen in Vlaanderen. Oude voegen uitslijpen, opnieuw voegen in de juiste kleur. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Liever dat wij u bellen?',
    werkwijzeH2: 'Van uitslijpen tot nieuwe voeg',
    finalH2: 'Tijd om uw voegen te vernieuwen?',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u terug om de staat van uw voegen te komen beoordelen. Daarna volgt uw vaste prijs per m² op papier.',
    breadcrumb: 'Hervoegen',
    galleryNoun: 'Hervoegen',
  },
  dakisolatie: {
    slug: 'dakisolatie',
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:dakisolatie',
    eyebrow: 'Dakisolatie',
    h1: 'Dakisolatie die uw energiefactuur verlaagt.',
    sub: 'Tot 30% van uw warmte ontsnapt via het dak. Wij isoleren uw hellend dak of zoldervloer, luchtdicht afgewerkt, in heel Vlaanderen.',
    subBold: 'Vaste prijs vooraf, 6% btw waar het kan',
    heroImg: imgIsol1,
    certLogo: { src: '/assets/logos/rectic.png', alt: 'Recticel' },
    topbar: ['Gratis dakinspectie binnen 5 werkdagen', 'Eén vast aanspreekpunt'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Isoleren doet u maar één keer',
    offerIntro: 'Dan kiest u liefst een aannemer die het in één keer juist doet. Wij isoleren daken sinds 2010, luchtdicht en met een vaste prijs vooraf.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis dakinspectie met fotorapport',
      'Sarking buitenop of tussen de balken',
      'Lager EPC en een lagere stookkost',
      'Luchtdicht afgewerkt, geen koudebruggen',
      '6% btw waar het kan, papierwerk inbegrepen',
    ],
    steps: [
      ['Gratis dakinspectie', 'Een vakman inspecteert uw dak en adviseert methode en dikte, met foto\'s.'],
      ['Vaste offerte', 'Een bindende prijs op papier, met de verwachte EPC-winst. Dat bedrag is meteen uw factuur.'],
      ['Plaatsing op de afgesproken dag', 'Isolatie luchtdicht afgewerkt met dampscherm, zolder netjes achtergelaten.'],
    ],
    whatTitle: 'Welke isolatie past bij uw dak?',
    whatIntro: 'Sarking buitenop, isolatie tussen de balken of een geïsoleerde zoldervloer: elk dak vraagt een eigen aanpak. Wij adviseren wat bij uw dak en uw plannen past, en werken alles luchtdicht af.',
    what: [
      ['Sarkingisolatie', 'Isolatie buitenop de balken, ideaal bij een dakrenovatie. Geen verlies aan zolderhoogte.'],
      ['Tussen de balken', 'Isolatie tussen en onder de balken, met dampscherm, wanneer het dak intact blijft.'],
      ['Zoldervloer isoleren', 'Snelle en voordelige oplossing wanneer de zolder niet bewoond is.'],
      ['Luchtdicht afwerken', 'Correct dampscherm en aansluitingen, zodat er geen condens of koudebrug ontstaat.'],
    ],
    whatImg: imgIsol2,
    gallery: [imgIsol2, imgIsolGyproc, imgIsolGestuct, imgIsolSarking, imgIsolKoramic],
    reviews: [
      { text: '"Ons dak werd vernieuwd, dus meteen sarking erop. De zolder is nu een volwaardige kamer en de chauffage staat een graad lager."', name: 'Hilde Declercq', role: 'Sarking bij dakrenovatie' },
      { text: '"Wij vroegen prijs voor isolatie tussen de balken, maar voor onze bergzolder raadden ze de goedkopere zoldervloer aan. Eerlijk advies, en de factuur klopte."', name: 'Wim De Backer', role: 'Zoldervloerisolatie' },
      { text: '"De slaapkamers onder het dak kregen we \'s winters nooit warm. Na de werken voelde je meteen het verschil."', name: 'Els Vandenberghe', role: 'Isolatie tussen de balken' },
    ],
    faq: [
      ['Wat kost dakisolatie?', 'Dat hangt af van de methode, de oppervlakte en de gewenste isolatiewaarde. U krijgt een vaste prijs na de gratis dakinspectie.'],
      ['Wat is sarking en waarom kiezen mensen ervoor?', 'Bij sarking komt de isolatie als één doorlopende laag bovenop de dakstructuur, onder de nieuwe dakbedekking. Zo behoudt u uw volledige zolderruimte, blijven de houten balken binnen zichtbaar en bruikbaar, en zijn er nagenoeg geen koudebruggen. Ideaal wanneer uw dak toch vernieuwd wordt.'],
      ['Moet ik mijn dak of mijn zoldervloer isoleren?', 'Gebruikt u de zolder als leefruimte (nu of in de toekomst), dan isoleren we het dakvlak zelf: van buitenaf bij een dakrenovatie, of van binnenuit als het dak intact blijft. Gebruikt u de zolder enkel als opslag, dan volstaat vaak het isoleren van de zoldervloer. Dat is sneller en voordeliger. Wij adviseren gratis wat bij uw situatie past.'],
      ['Heb ik recht op premie voor dakisolatie?', 'De premievoorwaarden zijn in 2026 gewijzigd; afhankelijk van uw inkomenscategorie en de R-waarde kan er nog premie zijn. Wij bekijken of u in aanmerking komt en regelen sowieso het 6% BTW-tarief (woning ouder dan 10 jaar) en het papierwerk.'],
      ['Sarking of tussen de balken?', 'Sarking is ideaal bij een dakrenovatie, omdat de isolatie buitenop komt. Blijft het dak intact, dan isoleren we tussen en onder de balken.'],
      ['Hoeveel bespaar ik?', 'U voelt het vooral in de stookkost: een geïsoleerd dak houdt de warmte binnen die nu langs boven verdwijnt. Bij de offerte krijgt u de verwachte EPC-winst op papier.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    typeWerkOpties: ['Sarkingisolatie', 'Tussen de balken', 'Zoldervloer', 'Anders'],
    finalSub: 'Vragen over sarking, premies of planning? Bel ons even.',
    metaTitle: 'Dakisolatie laten plaatsen met vaste prijs | AB Bouw Groep',
    metaDesc: 'Dakisolatie in Vlaanderen: sarking, tussen de balken of zoldervloer. Lager EPC, lagere stookkost, 6% btw waar het kan. Vaste prijs en gratis dakinspectie.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Snel uw prijs weten?',
    werkwijzeH2: 'In 3 stappen naar een geïsoleerd dak',
    finalH2: 'Tijd voor een warmer huis?',
    urgencyLine: 'Gratis dakinspectie, meestal binnen 5 werkdagen.',
    quickThanks: 'We bellen u terug om de gratis dakinspectie in te plannen. Daarna volgt uw vaste prijs op papier.',
    breadcrumb: 'Dakisolatie',
    galleryNoun: 'Dakisolatie',
  },
  platdak: {
    slug: 'platdak',
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:platdak',
    eyebrow: 'Platte daken · EPDM en roofing',
    h1: 'Een plat dak dat jaren droog blijft.',
    sub: 'Platte daken lekken op de naden en de randen. Daarom leggen wij EPDM in één naadloos stuk, of voordeligere roofing. Voor aanbouw, garage of bijgebouw, in heel Vlaanderen.',
    subBold: 'En u krijgt 10 jaar garantie op de waterdichtheid',
    heroImg: imgPlatdak,
    certLogo: { src: '/assets/logos/dorken.png', alt: 'Dörken' },
    topbar: ['Gratis plaatsbezoek binnen 5 werkdagen', 'Vaste prijs, geen verrassingen achteraf'],
    offerEyebrow: 'Over AB Bouw Groep',
    offerH2: 'Een plat dak vergeeft geen half werk',
    offerIntro: 'Op een plat dak blijft water liggen en vindt het elk zwak punt: een hoek, een doorvoer, de muuraansluiting. Wij leggen al meer dan vijftien jaar platte daken en geven er 10 jaar garantie op.',
    offer: [
      'Offerte = factuur, ook bij prijsstijgingen',
      'Gratis plaatsbezoek met eerlijk advies',
      'EPDM verlijmd, niet gebrand: geen open vlam',
      'Meteen geïsoleerd volgens de normen',
      '6% btw bij een woning ouder dan 10 jaar',
      'Oude bedekking afgevoerd, werf proper',
    ],
    steps: [
      ['Gratis plaatsbezoek', 'We bekijken de hele opbouw: bedekking, isolatie, randen en afvoer. U hoort meteen of herstellen volstaat of vervangen nodig is.'],
      ['Vaste offerte', 'Eén bindende prijs, isolatie en randafwerking inbegrepen. Wat op de offerte staat, betaalt u.'],
      ['Plaatsing en oplevering', 'Oude lagen eraf, geïsoleerd en waterdicht afgewerkt tot en met de randen. Een garagedak is doorgaans in één à twee dagen klaar.'],
    ],
    whatTitle: 'EPDM of roofing? Wij leggen allebei.',
    whatIntro: 'EPDM is een rubbermembraan in één naadloos stuk en gaat 40 tot 50 jaar mee. Roofing is voordeliger en goed voor 15 tot 25 jaar. Omdat wij allebei leggen, praten we u het duurste niet aan.',
    what: [
      ['Nieuw plat dak', 'Volledige opbouw met isolatie, afgewerkt in EPDM of roofing, voor aanbouw, garage of bijgebouw.'],
      ['EPDM of roofing', 'EPDM leggen we naadloos in één stuk; roofing is een bewezen, voordelige bitumenbedekking. U kiest na eerlijk advies.'],
      ['Renovatie & isolatie', 'Een oud, lekkend plat dak vervangen we waterdicht, met isolatie volgens de huidige normen.'],
      ['Randen & afvoer', 'Strakke randprofielen en een correcte waterafvoer, netjes afgewerkt.'],
    ],
    whatImg: imgPdak1,
    gallery: [imgPdak1, imgRoofing, imgPdak2, imgPdak3],
    reviews: [
      { text: '"Het dak boven onze aanbouw was al twee keer opgelapt, de vochtplek kwam altijd terug. Alles eraf, nieuwe isolatie, één stuk EPDM erover. Twee winters droog."', name: 'Ann Vervaeke', role: 'EPDM op de aanbouw' },
      { text: '"Ons garagedak was dertig jaar oud en helemaal op. In twee dagen vernieuwd, isolatie erbij en de randen netjes afgewerkt."', name: 'Pieter Lauwers', role: 'Garagedak vernieuwd' },
      { text: '"Voor het bijgebouw raadde hun vakman roofing aan, EPDM was de meerprijs niet waard. Eerlijk, strak gelegd en de oude roofing zelf afgevoerd."', name: 'Marleen Stevens', role: 'Roofing op het bijgebouw' },
    ],
    faq: [
      ['Wat kost een plat dak?', 'Dat hangt af van de oppervlakte, de opbouw, de isolatie en de keuze tussen EPDM of roofing. U krijgt een vaste prijs per m² na het gratis plaatsbezoek. Is uw woning ouder dan 10 jaar, dan valt het werk onder 6% btw; dat papierwerk regelen wij.'],
      ['EPDM of roofing: wat kies ik?', 'EPDM leggen we naadloos in één stuk, zonder brander, met de langste levensduur. Roofing (bitumen) is bewezen en voordeliger. Bij het plaatsbezoek adviseren we eerlijk wat past bij uw dak en budget.'],
      ['Hoe lang gaat het mee?', 'Een correct gelegd EPDM-dak gaat doorgaans 40 tot 50 jaar mee; roofing doorgaans 15 tot 25 jaar.'],
      ['Kan de isolatie mee vernieuwd worden?', 'Ja. Bij een nieuw of vernieuwd plat dak isoleren we meteen volgens de huidige normen.'],
      ['Werken jullie in mijn regio?', 'Wij werken in heel Vlaanderen, met de meeste werven rond Antwerpen, Mechelen en Lier. Bij het gratis plaatsbezoek bevestigen we meteen de planning.'],
    ],
    typeWerkOpties: ['Nieuw plat dak', 'Renovatie', 'Met isolatie', 'Anders'],
    finalSub: 'Twijfelt u tussen EPDM en roofing? Bel ons, dan denken we mee.',
    metaTitle: 'Plat dak laten leggen — EPDM of roofing | AB Bouw Groep',
    metaDesc: 'Plat dak voor aanbouw, garage of bijgebouw: EPDM naadloos of bewezen roofing, geïsoleerd en met 10 jaar garantie op de waterdichtheid. Gratis plaatsbezoek.',
    reviewsH2: 'Klantbeoordelingen',
    quickformH3: 'Uw plat dak laten bekijken?',
    werkwijzeH2: 'Zo pakken we uw dak aan',
    finalH2: 'Nooit meer naar het plafond kijken als het giet',
    urgencyLine: 'Gratis plaatsbezoek, meestal binnen 5 werkdagen. Een acuut lek krijgt voorrang in de planning.',
    quickThanks: 'We bellen u terug om het gratis plaatsbezoek vast te leggen. Lekt uw dak nu? Zeg het ons, dan proberen we sneller te komen.',
    breadcrumb: 'Plat dak',
    galleryNoun: 'Plat dak',
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
    whatIntro: 'Crepi is een gevelpleister die als één doorlopende huid over uw muur ligt: geen voegen die later openscheuren of vuil vasthouden. Wij verzorgen de volledige opbouw, van ondergrond tot afwerklaag.',
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
    finalSub: 'Praat met één van onze projectleiders.',
    metaTitle: 'Crepi laten plaatsen — vaste prijs | AB Bouw Groep',
    metaDesc: 'Crepi en sierpleister in Vlaanderen, in elke kleur. Egaal aangebracht op gevel of buitenisolatie. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
    breadcrumb: 'Crepi',
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
      'Voegen op breedte en kleur van echt metselwerk afgevoegd',
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
      ['Strak voegwerk', 'Voegen op lijn doorgetrokken, in de gekozen voegkleur bijgewerkt tot het gevelvlak gelijk ligt.'],
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
    finalSub: 'Praat met één van onze projectleiders.',
    metaTitle: 'Steenstrips laten plaatsen — baksteen-look | AB Bouw Groep',
    metaDesc: 'Steenstrips in Vlaanderen: authentieke baksteen-look, kaarsrecht gevoegd, ideaal op buitenisolatie. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
    breadcrumb: 'Steenstrips',
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
const Doc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>
);
const Calc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="11" x2="8" y2="11" /><line x1="12" y1="11" x2="12" y2="11" /><line x1="16" y1="11" x2="16" y2="11" /><line x1="8" y1="15" x2="8" y2="15" /><line x1="12" y1="15" x2="12" y2="15" /><line x1="16" y1="15" x2="16" y2="19" /></svg>
);
const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const Pin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

export default function LpDienst({ slug }: { slug: string }) {
  const d = DIENSTEN[slug];
  const calcCfg = DAK_CALC_CONFIGS[slug];
  const [calcOpen, setCalcOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(true);
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
            { '@type': 'ListItem', position: 2, name: d.breadcrumb ?? d.h1, item: pageUrl },
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
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFinalErr('Vul een geldig e-mailadres in.'); return; }
    if (phone.replace(/\D/g, '').length < 8) { setFinalErr('Vul een geldig telefoonnummer in (minstens 8 cijfers).'); return; }
    setFinalErr('');
    setFinalState('busy');
    const aanvullend = [typeWerkSel ? `Type werk: ${typeWerkSel}` : '', info].filter(Boolean).join(' — ') || `Sub-service LP: ${d.slug}`;
    const res = await submitLead({
      source: 'landing_page', landing_division: d.division, page_path: window.location.pathname,
      firstName: firstName || undefined, email: email || `lead-${phone.replace(/\D/g, '') || Date.now()}@abgroep.be`, phone, type_werk: d.typeWerk as Divisie,
      aanvullende_info: aanvullend, bron_lead: d.bronLead,
    });
    if (res.ok) { setFinalState('ok'); document.getElementById('lp-final')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else { setFinalState('idle'); setFinalErr(`Er ging iets mis. Bel ons gerust op ${PHONE}.`); }
  };

  return (
    <>
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
            <a className="tr-headphone" href={PHONE_HREF} aria-label="Bel ons"><Phone /><span className="tr-headphone-num">{PHONE}</span></a>
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
            <div className="tr-hero-grid">
              <div className="tr-hero-main">
                <div className="tr-hero-trust">
                  <span className="tr-hero-trust-stars">{stars}</span>
                  <span><b>4,9/5</b> op Google (180+ reviews)</span><span className="tr-hero-trust-dot">·</span>
                  <span>120+ realisaties</span><span className="tr-hero-trust-dot">·</span>
                  <span>Actief sinds 2010</span>
                </div>
                <h1>{d.h1}</h1>
                <p className="tr-hero-sub">{d.sub} <b>{d.subBold}</b>.</p>
                <div className="tr-certs">
                  <span className="tr-cert-pill"><Shield />VCA* gecertificeerd</span>
                  <span className="tr-cert-pill"><Check s={15} />Lid Bouwunie</span>
                  <span className="tr-cert-pill"><Shield />Verzekerd via Federale</span>
                </div>
              </div>
              <aside className="tr-hero-form" aria-label="Vraag uw gratis afspraak aan">
                <div className={`tr-quickform tr-leadcard${quickState === 'ok' ? ' is-success' : ''}`} id="lp-form">
                  <div className={`tr-lc-row tr-lc-row--primary${leadOpen ? ' is-open' : ''}`}>
                    <button type="button" className="tr-lc-head" onClick={() => setLeadOpen((o) => !o)} aria-expanded={leadOpen}>
                      <span className="tr-lc-ic tr-lc-ic--accent" aria-hidden="true"><Doc /></span>
                      <span className="tr-lc-txt">
                        <h3 className="tr-lc-title">{d.steps[0][0]}</h3>
                        <span className="tr-lc-sub">Vrijblijvend, geen verplichtingen.</span>
                      </span>
                      <span className="tr-lc-chev" aria-hidden="true"><Chevron /></span>
                    </button>
                    <div className="tr-lc-panel"><div className="tr-lc-panel-inner"><div className="tr-lc-panel-pad">
                      <form ref={quickRef} onSubmit={onQuickSubmit} onFocusCapture={() => trackFormStart(`lp:${d.slug}:quick`)} noValidate>
                        <div className="tr-qf-grid">
                          <div className="tr-qf-field"><label htmlFor="qf-name">Voornaam</label><input id="qf-name" type="text" name="firstName" placeholder="bv. Jan" autoComplete="given-name" required /></div>
                          <div className="tr-qf-field"><label htmlFor="qf-phone">Telefoonnummer</label><input id="qf-phone" type="tel" name="phone" placeholder="bv. 0470 12 34 56" autoComplete="tel" required /></div>
                          <button type="submit" className="tr-btn" disabled={quickState === 'busy'}>{quickState === 'busy' ? 'Even bezig…' : 'Plan mijn afspraak'}</button>
                        </div>
                      </form>
                      <p className="tr-lc-reassure">We bellen u terug binnen één werkdag.</p>
                      {quickErr && <div className="tr-qf-error" style={{ display: 'block' }}>{quickErr}</div>}
                      <div className="tr-lc-proof">
                        <div className="tr-lc-proof-stars">★★★★★</div>
                        <p className="tr-lc-proof-q">{d.reviews[0].text}</p>
                        <div className="tr-lc-proof-name">{d.reviews[0].name} · {d.reviews[0].role}</div>
                      </div>
                    </div></div></div>
                  </div>
                  <div className="tr-lc-or"><span>Of</span></div>
                  {calcCfg && (
                    <button type="button" className="tr-lc-row tr-lc-row--alt tr-lc-row--calc" onClick={() => setCalcOpen(true)}>
                      <span className="tr-lc-ic" aria-hidden="true"><Calc /></span>
                      <span className="tr-lc-txt">
                        <span className="tr-lc-title-row"><span className="tr-lc-title">{calcCfg.triggerLabel}</span><span className="tr-lc-badge">60 sec</span></span>
                        <span className="tr-lc-sub">Prijsindicatie via onze calculator, klaar in 60 seconden</span>
                      </span>
                      <span className="tr-lc-chev" aria-hidden="true"><Chevron /></span>
                    </button>
                  )}
                  <a className="tr-lc-row tr-lc-row--alt" href={PHONE_HREF}>
                    <span className="tr-lc-ic" aria-hidden="true"><Phone /></span>
                    <span className="tr-lc-txt">
                      <span className="tr-lc-title">Bel ons direct</span>
                      <span className="tr-lc-sub">Vragen of haast? {PHONE}</span>
                    </span>
                    <span className="tr-lc-chev" aria-hidden="true"><Chevron /></span>
                  </a>
                  <div className="tr-qf-thanks">
                    <div className="tr-qf-thanks-ic"><Check s={26} /></div>
                    <h4>Bedankt, uw aanvraag is ontvangen.</h4>
                    <p>{d.quickThanks ?? 'We bellen u zo snel mogelijk terug om uw afspraak in te plannen.'}</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WERKWIJZE / 3 STAPPEN */}
      <section className="tr-section" id="werkwijze">
        <div className="tr-wrap">
          <div className="tr-steps-box">
            <h2>{d.werkwijzeH2 ?? 'In 3 stappen geregeld'}</h2>
            {d.stepsImg ? (
              <div className="tr-steps-layout">
                <div className="tr-steps-photo">
                  <img src={d.stepsImg} alt={`${d.breadcrumb ?? 'Werk'} door AB Bouw Groep`} loading="lazy" width="900" height="900" />
                </div>
                <div className="tr-steps-list">
                  {d.steps.map(([t, sub], i) => (
                    <div className="tr-step" key={i}>
                      <div className="tr-step-num">{String(i + 1).padStart(2, '0')}</div>
                      <h3>{t}</h3>
                      <p>{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="tr-steps-grid">
                {d.steps.map(([t, sub], i) => (
                  <div className="tr-step" key={i}>
                    <div className="tr-step-num">{String(i + 1).padStart(2, '0')}</div>
                    <h3>{t}</h3>
                    <p>{sub}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. NUMBERS BAR */}
      <section className="tr-numbers">
        <div className="tr-num"><div className="tr-num-big">{new Date().getFullYear() - 2010} jaar</div><div className="tr-num-lbl">ervaring</div></div>
        <div className="tr-num"><div className="tr-num-big">1</div><div className="tr-num-lbl">vast aanspreekpunt</div></div>
        <div className="tr-num"><div className="tr-num-big">120+</div><div className="tr-num-lbl">realisaties</div></div>
        <div className="tr-num">{d.division === 'ab_dakwerken' ? (<><div className="tr-num-big">10 jaar</div><div className="tr-num-lbl">garantie</div></>) : (<><div className="tr-num-big">Gratis</div><div className="tr-num-lbl">plaatsbezoek</div></>)}</div>
      </section>

      {/* 9. REVIEWS — naar boven verplaatst (CRO: sociale proof vlak na de cijfers) */}
      <section className="tr-section tr-reviews" id="reviews">
        <div className="tr-wrap">
          <div className="tr-head">
            <h2>{d.reviewsH2 ?? 'Wat onze klanten vertellen'}</h2>
          </div>
          <div className="tr-rev-grid">
            {d.reviews.slice(1).map((r, i) => (
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

      {/* 8. SERVICES / WAT HOUDT HET IN */}
      <section className="tr-section tr-services" id="diensten">
        <div className="tr-wrap">
          <div className="tr-head">
            
            <h2>{d.whatTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.84)', fontSize: 15, lineHeight: 1.6, marginTop: 14 }}>{d.whatIntro}</p>
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

      {/* 6. ABOUT / CERTIFIED — onder de converterende secties: aandacht hoog houden voor hook + bewijs + diensten, daarna pas over ons */}
      <section className="tr-section" style={{ background: '#fff' }}>
        <div className="tr-wrap">
          <div className="tr-about-grid">
            <div className="tr-about-media">
              <div className="tr-about-badges">
                {d.certLogo && <span className="tr-about-badge"><img src={d.certLogo.src} alt={d.certLogo.alt} /></span>}
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
              <div className="tr-urgency">{d.urgencyLine ?? 'Gratis plaatsbezoek, meestal binnen 5 werkdagen.'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8a. HERKENT U DIT? — signalen */}
      {d.signs && (
        <section className="tr-section" style={{ background: '#fff' }}>
          <div className="tr-wrap">
            <div className="tr-head" style={{ textAlign: 'left', maxWidth: 760, margin: '0 0 30px' }}>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', color: NAVY, fontWeight: 700, margin: 0 }}>{d.signs.title}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#454f60', marginTop: 10 }}>{d.signs.intro}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
              {d.signs.items.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '16px 18px', background: 'var(--bg-tint)', borderRadius: 10, border: '1px solid var(--tr-line)', fontSize: 14.5, lineHeight: 1.5, color: '#2b3543' }}>
                  <span style={{ color: ORANGE, flexShrink: 0, fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>›</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8b. RECENTE REALISATIES (galerij) */}
      {d.gallery && d.gallery.length > 0 && (
        <section className="tr-section" style={{ background: 'var(--bg-tint)' }}>
          <div className="tr-wrap">
            <div className="tr-head" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 44px' }}>
              <span className="tr-eyebrow">Recente realisaties</span>
              <h2 style={{ fontSize: 'clamp(27px, 3.2vw, 38px)', color: NAVY, fontWeight: 600, margin: 0 }}>Ons werk in beeld</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {d.gallery.map((item, i) => {
                const photos = Array.isArray(item) ? item : (d.gallery as string[]);
                const cover = Array.isArray(item) ? item[0] : item;
                return (
                <div
                  key={i}
                  className="rl-thumb"
                  data-rl-trigger
                  data-rl-index={Array.isArray(item) ? 0 : i}
                  data-rl-photos={JSON.stringify(photos)}
                  data-rl-title={`${d.galleryNoun ?? d.typeWerk} realisatie`}
                  style={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 30px 60px -30px rgba(10,22,40,0.35)', aspectRatio: '4 / 3', position: 'relative' }}
                >
                  <img src={cover} alt={`${d.galleryNoun ?? d.typeWerk}, realisatie ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span className="rl-zoom" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                  </span>
                </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
          <h2>{d.finalH2 ?? 'Klaar om te starten?'}</h2>
          <div className="tr-final-grid">
            <div className="tr-final-contact">
              <h3>Neem contact op</h3>
              <div className="tr-big">{d.finalSub}</div>
              <div className="tr-line"><Pin /><span>{ADDRESS}</span></div>
              <div className="tr-line"><Phone /><span>Telefoon: <a href={PHONE_HREF}>{PHONE}</a></span></div>
            </div>
            <div id="lp-final" className={`tr-final-card${finalState === 'ok' ? ' is-success' : ''}${finalErr ? ' is-error' : ''}`}>
              <h3>Vraag uw gratis offerte</h3>
              <div className="tr-safe"><Shield />Vrijblijvend. We bellen u terug binnen één werkdag</div>
              <form ref={finalRef} onSubmit={onFinalSubmit} onFocusCapture={() => trackFormStart(`lp:${d.slug}:final`)} noValidate>
                <div className="tr-final-row">
                  <input type="text" name="firstName" placeholder="Voornaam *" autoComplete="given-name" required />
                  <input type="tel" name="phone" placeholder="Telefoonnummer *" autoComplete="tel" required />
                </div>
                <input type="email" name="email" placeholder="E-mail (optioneel)" autoComplete="email" />
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
                <h4>Bedankt, uw aanvraag is ontvangen.</h4>
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
          <div className="tr-footer-copy">© {new Date().getFullYear()} AB Bouw Groep · Erkend bouw- en renovatiebedrijf in Vlaanderen. Alle rechten voorbehouden.{' · '}<a href="/voorwaarden" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'underline' }}>Gebruiksvoorwaarden</a>{' · '}<a href="/privacy" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'underline' }}>Privacybeleid</a>{' · '}<a href="/cookies" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'underline' }}>Cookiebeleid</a></div>
        </div>
      </footer>
    </div>
    {calcOpen && calcCfg && <CalculatorWizard config={calcCfg} onClose={() => setCalcOpen(false)} />}
    </>
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
.tr-hero-trust { display:flex; flex-wrap:wrap; align-items:center; gap:8px 12px; margin:0 0 20px; font-size:14.5px; font-weight:600; color:rgba(255,255,255,0.92); }
.tr-hero-trust b { color:#fff; }
.tr-hero-trust-stars { color:${GOLD}; letter-spacing:1px; font-size:15px; }
.tr-hero-trust-dot { color:rgba(255,255,255,0.4); }
.tr-headphone { display:inline-flex; align-items:center; gap:8px; color:${NAVY}; border:1.5px solid #e0ddd3; background:#fff; font-family:var(--font-display); font-weight:700; font-size:14px; padding:10px 16px; border-radius:999px; white-space:nowrap; transition:border-color .18s, color .18s; }
.tr-headphone svg { color:${ORANGE}; }
.tr-headphone:hover { border-color:${ORANGE}; color:${ORANGE}; }
@media (max-width:980px){ .tr-headphone{ background:${ORANGE}; color:#fff; border-color:${ORANGE}; padding:0; width:42px; height:42px; justify-content:center; gap:0; } .tr-headphone svg{ color:#fff; } .tr-headphone-num{ display:none; } }
@media (max-width:720px){ .tr-hero-trust{ justify-content:center; font-size:13px; gap:6px 10px; } }
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
  .tr-headcta { display: inline-flex; padding: 9px 13px !important; font-size: 12.5px !important; }
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
/* photo-layout (dakwerken-stijl): vierkante foto naast de stappenlijst */
.tr-steps-layout { display: grid; grid-template-columns: 1fr; gap: clamp(28px, 4vw, 44px); align-items: center; }
.tr-steps-photo { border-radius: var(--tr-r-card); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(10,22,40,0.35); }
.tr-steps-photo img { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; }
.tr-steps-list { display: grid; gap: clamp(22px, 2.6vw, 30px); }
@media (min-width: 860px) { .tr-steps-layout { grid-template-columns: minmax(0, 432px) 1fr; gap: clamp(44px, 5vw, 72px); } }
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

/* 8 — SERVICES (dark, tekst-only cards: randen i.p.v. schaduw, gouden keyline-accent, leesbaar voor 45-65j) */
.tr-services { background: ${NAVY}; color: #fff; border-top: 1px solid rgba(255,255,255,0.07); }
.tr-services .tr-head { text-align: left; max-width: 680px; margin: 0 0 clamp(44px, 5vw, 72px); }
.tr-services .tr-head h2 { font-size: clamp(27px, 4.4vw, 52px); color: #fff; font-weight: 700; letter-spacing: -0.02em; line-height: 1.06; margin: 0; }
.tr-svc-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; align-items: stretch; }
.tr-svc-card { background: #15263f; border: 1px solid rgba(255,255,255,0.18); border-radius: var(--tr-r-card);
  display: flex; flex-direction: column; height: 100%; transition: border-color .2s ease; }
.tr-svc-card:hover { border-color: rgba(255,255,255,0.32); }
.tr-svc-body { padding: 24px 24px 28px; flex: 1 1 auto; display: flex; flex-direction: column; }
.tr-svc-body::before { content: ""; width: 28px; height: 2px; background: ${GOLD}; margin: 2px 0 16px; flex: none; }
.tr-svc-body h3 { font-size: 19px; color: #fff; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 9px; }
.tr-svc-body p { font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.84); margin: 0; }
@media (max-width: 1040px) { .tr-svc-grid { grid-template-columns: 1fr 1fr; gap: 18px; } }
@media (max-width: 560px) { .tr-svc-grid { grid-template-columns: 1fr; } .tr-svc-body { padding: 22px 20px 24px; } }


/* 11 — REVIEWS */
.tr-reviews { background: #fff; }
.tr-reviews .tr-head { text-align: left; max-width: 680px; margin: 0 0 clamp(44px, 5vw, 72px); }
.tr-reviews .tr-head h2 { font-size: clamp(27px, 3.2vw, 40px); color: ${NAVY}; font-weight: 700; margin: 0; }
.tr-rev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 380px)); justify-content: center; gap: clamp(24px, 2.4vw, 34px); align-items: stretch; }
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

/* ── HERO LEAD-KAART (zelfde premium keuze-stack als /lp/dakwerken) ──────── */
.tr-hero-grid { display: grid; grid-template-columns: 1fr; grid-template-areas: "main" "form"; row-gap: 26px; align-items: start; }
.tr-hero-main { grid-area: main; min-width: 0; }
.tr-hero-form { grid-area: form; position: relative; z-index: 3; min-width: 0; }
@media (min-width: 1024px) {
  .tr-hero { display: flex; align-items: center; min-height: clamp(600px, 66vh, 740px); }
  .tr-hero-inner { width: 100%; }
  .tr-hero-grid { grid-template-columns: minmax(0,1fr) 416px; grid-template-areas: "main form"; column-gap: clamp(40px, 4.5vw, 64px); align-items: center; }
}
.tr-hero-form .tr-quickform { margin: 0; max-width: none; position: relative; z-index: 3; border: none; border-radius: var(--tr-r-card); box-shadow: 0 24px 56px -20px rgba(10,22,40,0.55), 0 2px 8px rgba(10,22,40,0.18); overflow: hidden; padding: 0; }
.tr-hero-form .tr-quickform::before { content: ''; display: block; height: 3px; background: ${GOLD}; }
.tr-leadcard .tr-lc-ic { flex-shrink: 0; width: 44px; height: 44px; border-radius: var(--tr-r-ui); display: inline-flex; align-items: center; justify-content: center; }
.tr-leadcard .tr-lc-ic svg { display: block; }
.tr-leadcard .tr-lc-txt { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.tr-leadcard .tr-lc-title { margin: 0; font-family: var(--font-display); font-size: 16px; font-weight: 700; line-height: 1.22; letter-spacing: -0.015em; color: ${NAVY}; }
.tr-leadcard .tr-lc-sub { font-size: 13px; line-height: 1.45; color: #525b6b; }
.tr-lc-row--primary { background: #f7f9fc; border-bottom: 1px solid #e7e4dd; }
.tr-lc-head { display: flex; align-items: center; gap: 14px; width: 100%; margin: 0; padding: 20px 26px; background: none; border: none; text-align: left; font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.tr-lc-head .tr-lc-chev { flex-shrink: 0; margin-left: auto; color: #8a8f98; display: inline-flex; align-items: center; transition: transform .28s cubic-bezier(.22,1,.36,1), color .16s; }
.tr-lc-row--primary.is-open .tr-lc-head .tr-lc-chev { transform: rotate(90deg); color: ${NAVY}; }
@media (hover: hover) { .tr-lc-head:hover .tr-lc-chev { color: ${NAVY}; } }
.tr-lc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .32s cubic-bezier(.22,1,.36,1); }
.tr-lc-row--primary.is-open .tr-lc-panel { grid-template-rows: 1fr; }
.tr-lc-panel-inner { min-height: 0; overflow: hidden; }
.tr-lc-panel-pad { padding: 2px 26px 22px; }
.tr-lc-row--primary .tr-lc-ic--accent { background: rgba(217,140,3,0.12); color: ${ORANGE_H}; border: 1px solid rgba(217,140,3,0.28); }
.tr-lc-row--primary .tr-lc-head .tr-lc-txt { flex: 1 1 auto; }
.tr-lc-row--primary .tr-lc-title { font-size: 18px; line-height: 1.18; text-align: left; }
.tr-lc-row--primary .tr-lc-sub { text-align: left; }
.tr-lc-row--primary .tr-qf-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.tr-lc-row--primary .tr-qf-field label { display: block; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: #41495a; margin: 0 0 6px; }
.tr-lc-row--primary .tr-qf-grid input { width: 100%; height: 52px; padding: 0 16px; font-size: 16px; border: 1px solid #cfd5dd; border-radius: var(--tr-r-ui); background: #fff; color: #1d2733; }
.tr-lc-row--primary .tr-qf-grid input:focus { outline: none; border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(217,140,3,0.16); }
.tr-lc-row--primary .tr-qf-grid .tr-btn { min-height: 52px; font-size: 16px; margin-top: 2px; white-space: normal; line-height: 1.25; padding: 13px 14px; width: 100%; }
.tr-lc-reassure { margin: 10px 0 0; font-size: 13px; line-height: 1.45; color: #525b6b; }
@media (min-width: 1024px) {
  .tr-lc-row--primary .tr-lc-panel { grid-template-rows: 1fr; }
  .tr-lc-row--primary .tr-lc-head { cursor: default; pointer-events: none; }
  .tr-lc-row--primary .tr-lc-chev { display: none; }
}
.tr-lc-proof { margin-top: 16px; padding-top: 14px; border-top: 1px solid #ece9e1; }
.tr-lc-proof-stars { color: ${GOLD}; font-size: 12px; letter-spacing: 1.5px; margin-bottom: 6px; }
.tr-lc-proof-q { font-size: 13.5px; line-height: 1.55; color: #454f60; margin: 0; font-style: italic; }
.tr-lc-proof-name { margin-top: 6px; font-family: var(--font-display); font-size: 13px; font-weight: 700; color: ${NAVY}; }
.tr-lc-or { display: flex; align-items: center; gap: 14px; padding: 14px 26px 4px; }
.tr-lc-or::before, .tr-lc-or::after { content: ''; height: 1px; background: #ece9e1; flex: 1; }
.tr-lc-or span { font-family: var(--font-display); font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #8a8f98; }
.tr-lc-row--alt { display: flex; align-items: center; gap: 14px; width: 100%; margin: 0; padding: 14px 26px; min-height: 60px; text-align: left; text-decoration: none; font: inherit; color: inherit; background: #fff; border: none; border-top: 1px solid #f0eee7; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background-color .16s ease; }
.tr-lc-or + .tr-lc-row--alt { border-top: none; }
.tr-lc-row--alt .tr-lc-ic { background: #fff; color: ${NAVY}; border: 1px solid rgba(198,154,75,0.40); box-shadow: 0 1px 2px rgba(10,22,40,0.06); }
.tr-lc-row--alt .tr-lc-title { font-size: 15.5px; }
.tr-lc-chev { flex-shrink: 0; margin-left: auto; color: #8a8f98; display: inline-flex; align-items: center; transition: color .16s ease, transform .16s ease; }
@media (hover: hover) { .tr-lc-row--alt:hover { background: #f7f9fc; } .tr-lc-row--alt:hover .tr-lc-chev { color: ${NAVY}; transform: translateX(2px); } }
.tr-lc-row--alt:active { background: #f1f3f7; }
.tr-lc-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tr-lc-badge { display: inline-flex; align-items: center; font-family: var(--font-display); font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; line-height: 1; padding: 3px 7px; border-radius: 999px; color: ${GOLD}; background: rgba(198,154,75,0.10); border: 1px solid rgba(198,154,75,0.45); white-space: nowrap; }
.tr-lc-row--calc:active { transform: scale(0.985); }
.tr-leadcard.is-success .tr-lc-row--primary,
.tr-leadcard.is-success .tr-lc-or,
.tr-leadcard.is-success .tr-lc-row--alt { display: none; }
.tr-leadcard .tr-qf-thanks { padding: 26px 26px 24px; }
@media (max-width: 720px) {
  .tr-hero { display: block; min-height: 0; }
  .tr-hero-inner { padding: 30px 0 60px; text-align: left; }
  .tr-hero-trust { justify-content: flex-start; }
  .tr-hero-sub { margin-left: 0; margin-right: 0; }
  .tr-certs { justify-content: flex-start; }
  .tr-lc-head { padding: 18px 20px; }
  .tr-lc-panel-pad { padding: 2px 20px 20px; }
  .tr-lc-or { padding: 12px 20px 4px; }
  .tr-lc-row--alt { padding: 13px 20px; min-height: 58px; }
}
`;
