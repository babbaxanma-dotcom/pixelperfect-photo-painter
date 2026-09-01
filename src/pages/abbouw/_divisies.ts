/* Eén bron voor de zes divisiepagina's. De pagina's zelf zijn dunne wrappers,
   zodat inhoud en vormgeving niet uit elkaar kunnen lopen. */
import type { DivisionConfig } from './_division';

import dakHero from '@/assets/dak/hellend-pannen.jpg';
import dakStory from '@/assets/dak/zinkwerk.jpg';
import gevelHero from '@/assets/gevel/intro.jpg';
import gevelStory from '@/assets/gevel/witte-crepi.jpg';
import badHero from '@/assets/bad/intro.jpg';
import badStory from '@/assets/bad/inloopdouche.jpg';
import intHero from '@/assets/interieur/hero.jpg';
import intStory from '@/assets/interieur/maatkasten.jpg';
import conHero from '@/assets/construct/intro-villa.jpg';
import conStory from '@/assets/construct/aanbouw.jpg';
import ecoHero from '@/assets/eco/intro.jpg';
import ecoStory from '@/assets/eco/warmtepomp.jpg';

const stap = (t: string, d: string, time: string, n: string) => ({ n, t, d, time });

export const DIVISIES: Record<string, DivisionConfig> = {
  dakwerken: {
    slug: 'dakwerken', num: '04', title: 'Dakwerken', eyebrow: 'Dakwerken',
    heroTitle: 'Een dak dat<br/>weer decennia meegaat',
    heroLede: 'Van een lek dat hersteld moet worden tot een dak dat volledig vernieuwd wordt. Wij leggen pannen, leien en platte daken, en isoleren mee zolang het dak toch openligt.',
    heroBg: dakHero,
    storyTitle: 'Eerst kijken,<br/>dan pas vernieuwen',
    storyLede: 'Bij het plaatsbezoek zeggen we of herstellen volstaat of vervangen nodig is. Moet het dak er wel af, dan hoort u meteen wat het kost en hoelang uw woning openligt.',
    storyImg: dakStory,
    features: [
      { n: '01', t: 'Pannen en leien', d: 'Volledig vernieuwen inclusief onderdak, tengels en panlatten.' },
      { n: '02', t: 'Platte daken in EPDM', d: 'Uit één stuk gelegd, dus zonder lasnaden die later kunnen opengaan.' },
      { n: '03', t: 'Zinkwerk', d: 'Dakgoten, mastgoten, kilgoten en slabben door onze eigen zinkwerker.' },
    ],
    whatWeDo: [
      { n: '01', t: 'Dakvernieuwing', d: 'Pannendak of leien dak volledig afgebroken en opnieuw opgebouwd, met nieuw onderdak.' },
      { n: '02', t: 'Dakisolatie', d: 'PIR, PUR of cellulose tot onder K30, van binnenuit of via sarking op het dakvlak.' },
      { n: '03', t: 'Dakvensters en dakkapellen', d: 'Velux en Fakro, of een dakkapel op maat wanneer u meer sta-hoogte wil.' },
    ],
    process: [
      stap('Plaatsbezoek', 'We klimmen op het dak, controleren onderdak en houtwerk en fotograferen wat we zien.', 'binnen 5 werkdagen', '01'),
      stap('Offerte', 'Per post uitgesplitst: afbraak, materiaal, isolatie, zinkwerk en afvoer.', 'binnen 7 werkdagen', '02'),
      stap('Uitvoering', 'Stelling, afbraak en opbouw. Uw dak is nooit een nacht onafgedekt.', 'meestal 3 tot 10 dagen', '03'),
      stap('Oplevering', 'We lopen samen rond, ruimen op en u krijgt de garantie op papier.', 'zelfde week', '04'),
    ],
    faqs: [
      { q: 'Kan ik alleen het dak laten doen?', a: 'Ja. Een dak is bij ons een op zichzelf staande opdracht. Wilt u er isolatie of nieuwe dakgoten bij, dan zetten we dat als aparte post in de offerte, zodat u kunt kiezen.' },
      { q: 'Hoelang ligt mijn woning open?', a: 'Bij een gemiddeld hellend dak drie tot tien werkdagen. We werken per dakvlak en dekken elke avond af, dus uw woning staat nooit een nacht open.' },
      { q: 'Is dakisolatie nog premiegerechtigd?', a: 'Dat hangt af van uw inkomenscategorie en het jaartal. De voorwaarden wijzigen geregeld, dus we toetsen ze per dossier opnieuw en zeggen bij het plaatsbezoek wat er in uw situatie geldt.' },
      { q: 'Wat gebeurt er met het afval?', a: 'Container, afvoer en verwerking zitten in de prijs. Bij asbestverdacht materiaal schakelen we een erkende verwijderaar in; dat staat apart in de offerte.' },
    ],
    meta: 'Dakwerken door AB Bouw Groep: pannen, leien, platte daken in EPDM, dakisolatie en zinkwerk. Kosteloos plaatsbezoek in heel Vlaanderen.',
  },

  gevel: {
    slug: 'gevel', num: '06', title: 'Gevelrenovatie', eyebrow: 'Gevelrenovatie',
    heroTitle: 'Een gevel die<br/>er weer jaren tegen kan',
    heroLede: 'Crepi, steenstrips, houten bekleding of composiet. En omdat de stelling er toch staat, is dit het moment om er buitenisolatie achter te zetten.',
    heroBg: gevelHero,
    storyTitle: 'De stelling staat er<br/>maar één keer',
    storyLede: 'Een gevel opnieuw afwerken zonder isolatie is een gemiste kans: het duurste deel van het werk, de stelling en de voorbereiding, betaalt u dan een tweede keer wanneer u later alsnog isoleert.',
    storyImg: gevelStory,
    features: [
      { n: '01', t: 'Crepi', d: 'Mineraal, silicaat of siliconen, op isolatie of rechtstreeks op de muur.' },
      { n: '02', t: 'Steenstrips', d: 'Keramiek of klei, wanneer u het uitzicht van metselwerk wil houden.' },
      { n: '03', t: 'Buitenisolatie', d: 'Volgens ETICS, met wapeningsnet en afwerking in één opbouw.' },
    ],
    whatWeDo: [
      { n: '01', t: 'Gevelafwerking', d: 'Crepi en sierpleister in de kleur en korrel die u kiest, met stalen ter plaatse.' },
      { n: '02', t: 'Gevelbekleding', d: 'Hout in lariks, ceder of thermohout, of composiet zoals Trespa, Rockpanel en Eternit.' },
      { n: '03', t: 'Reinigen en hervoegen', d: 'Bestaand metselwerk reinigen en opnieuw voegen wanneer vervangen niet nodig is.' },
    ],
    process: [
      stap('Plaatsbezoek', 'We beoordelen de ondergrond, de vochthuishouding en de aansluitingen aan ramen en dak.', 'binnen 5 werkdagen', '01'),
      stap('Offerte en stalen', 'Prijs per post, en u kiest de kleur en korrel aan de hand van stalen op uw eigen gevel.', 'binnen 7 werkdagen', '02'),
      stap('Uitvoering', 'Stelling, voorbereiding, isolatie en afwerking. Buren krijgen vooraf bericht.', 'meestal 1 tot 3 weken', '03'),
      stap('Oplevering', 'Stelling weg, alles proper, en de garantie schriftelijk mee.', 'zelfde week', '04'),
    ],
    faqs: [
      { q: 'Kan crepi op elke gevel?', a: 'Bijna. De ondergrond moet droog en draagkrachtig zijn. Bij optrekkend vocht of loszittend metselwerk pakken we dat eerst aan, anders komt het probleem door de afwerking heen.' },
      { q: 'Wordt mijn woning dan dikker?', a: 'Met buitenisolatie komt de gevel doorgaans 14 tot 20 cm naar buiten. Dat heeft gevolgen voor dakoversteek, raamdorpels en soms de rooilijn. We meten dat op en zeggen vooraf wat het betekent.' },
      { q: 'Hoe zit het met de premie voor gevelisolatie?', a: 'De voorwaarden zijn de laatste jaren verschillende keren gewijzigd en hangen af van uw inkomenscategorie. We toetsen uw situatie bij het plaatsbezoek, zodat u een bedrag hoort dat op uw dossier van toepassing is.' },
      { q: 'Hoelang gaat crepi mee?', a: 'Een goed uitgevoerde crepi op isolatie gaat vlot 25 jaar mee. Reinigen om de tien jaar houdt de kleur egaal.' },
    ],
    meta: 'Gevelrenovatie door AB Bouw Groep: crepi, steenstrips, houten en composiet gevelbekleding, met buitenisolatie volgens ETICS.',
  },

  bad: {
    slug: 'bad', num: '05', title: 'Badkamer en wellness', eyebrow: 'Badkamers',
    heroTitle: 'Eén ploeg voor<br/>uw hele badkamer',
    heroLede: 'Sanitair, tegelwerk, vloerverwarming en elektriciteit komen van dezelfde ploeg, in één planning. Zo blijft de afstemming tussen de vakken bij ons liggen.',
    heroBg: badHero,
    storyTitle: 'Eerst zien,<br/>dan bestellen',
    storyLede: 'U krijgt een 3D-ontwerp ter goedkeuring voordat er iets besteld wordt. Zo ontdekt u niet halverwege dat het meubel net te breed is of de deur tegen de douchewand komt.',
    storyImg: badStory,
    features: [
      { n: '01', t: '3D-ontwerp vooraf', d: 'U ziet de indeling, de tegels en het meubilair voor de eerste bestelling vertrekt.' },
      { n: '02', t: 'Vloerverwarming inbegrepen', d: 'Standaard in onze badkamerprijs, niet als meerprijs achteraf.' },
      { n: '03', t: 'Eén ploeg', d: 'Sanitair, tegels en elektriciteit door dezelfde mensen, in één planning.' },
    ],
    whatWeDo: [
      { n: '01', t: 'Volledige renovatie', d: 'Uitbraak tot op de ruwbouw, nieuwe leidingen, en opnieuw opgebouwd.' },
      { n: '02', t: 'Tegelwerk', d: 'Keramiek, natuursteen of microcement, tot in de nissen en de hoekafwerking.' },
      { n: '03', t: 'Sanitair en wellness', d: 'Inloopdouches, vrijstaande baden en regendouches; op vraag stoom of sauna.' },
    ],
    process: [
      stap('Plaatsbezoek', 'We meten op, kijken naar leidingen en afvoer en bespreken wat u wil.', 'binnen 5 werkdagen', '01'),
      stap('Ontwerp en offerte', 'Een 3D-beeld plus een prijs waarin elke post apart staat.', 'binnen 10 werkdagen', '02'),
      stap('Uitvoering', 'Uitbraak, leidingen, tegels, sanitair. Eén ploeg, één planning.', 'meestal 3 tot 5 weken', '03'),
      stap('Oplevering', 'Samen nakijken, laatste punten afwerken, garantie op papier.', 'zelfde week', '04'),
    ],
    faqs: [
      { q: 'Hoelang kan ik mijn badkamer niet gebruiken?', a: 'Reken op drie tot vijf weken voor een volledige renovatie. Is er maar één badkamer in huis, dan plannen we de dagen zonder water zo kort mogelijk en zeggen we vooraf welke dat zijn.' },
      { q: 'Mag ik zelf sanitair aankopen?', a: 'Dat kan. We plaatsen het dan en nemen de garantie op de plaatsing voor onze rekening; de garantie op het toestel blijft bij uw leverancier.' },
      { q: 'Is vloerverwarming een meerprijs?', a: 'Nee, die zit standaard in onze badkamerprijs. Wat er wel apart bij komt is een eventuele aanpassing aan uw ketel of verdeler; dat staat als aparte lijn in de offerte.' },
      { q: 'Werken jullie met een vast team?', a: 'Ja. Dezelfde tegelzetter en sanitair-installateur van start tot oplevering, met één werfleider als aanspreekpunt.' },
    ],
    meta: 'Badkamerrenovatie door AB Bouw Groep: 3D-ontwerp vooraf, vloerverwarming inbegrepen, sanitair en tegelwerk door één ploeg.',
  },

  interieur: {
    slug: 'interieur', num: '03', title: 'Interieurwerken', eyebrow: 'Interieurwerken',
    heroTitle: 'De afwerking waar u<br/>elke dag naar kijkt',
    heroLede: 'Wanden, plafonds, vloeren en maatwerk. Onze eigen schrijnwerker maakt de kasten, dus wat getekend is, past ook echt.',
    heroBg: intHero,
    storyTitle: 'Maatwerk uit<br/>ons eigen atelier',
    storyLede: 'Kasten, dressings en tv-meubels tekenen en maken we zelf. Dat scheelt een schakel, en het betekent dat een aanpassing tijdens de werken geen weken vertraging oplevert.',
    storyImg: intStory,
    features: [
      { n: '01', t: 'Gyproc en plafonds', d: 'Enkele en dubbele wanden, akoestisch geïsoleerd, met verlaagde plafonds.' },
      { n: '02', t: 'Vloeren', d: 'Parket massief of meerlaags, visgraat, kuierplank, of een gietvloer.' },
      { n: '03', t: 'Maatkasten', d: 'Dressings, inbouwkasten en tv-meubels uit eigen atelier.' },
    ],
    whatWeDo: [
      { n: '01', t: 'Wanden en plafonds', d: 'Gyproc, pleisterwerk en verlaagde plafonds met inbouwspots en ledstrips.' },
      { n: '02', t: 'Vloerafwerking', d: 'Parket, laminaat, tegels of een naadloze gietvloer, inclusief plinten.' },
      { n: '03', t: 'Schrijnwerk', d: 'Binnendeuren stomp of opdek, trappen, en maatkasten op millimeter.' },
    ],
    process: [
      stap('Plaatsbezoek', 'We meten de ruimtes op en bespreken indeling, materialen en afwerkingsniveau.', 'binnen 5 werkdagen', '01'),
      stap('Ontwerp en offerte', 'Tekeningen voor het maatwerk plus een uitgesplitste prijs.', 'binnen 10 werkdagen', '02'),
      stap('Uitvoering', 'Eerst het ruwe werk, dan de afwerking. Stofschermen en dagelijks opruimen.', 'meestal 2 tot 6 weken', '03'),
      stap('Oplevering', 'Samen nalopen, laatste punten wegwerken, garantie op papier.', 'zelfde week', '04'),
    ],
    faqs: [
      { q: 'Kan ik in huis blijven wonen tijdens de werken?', a: 'Meestal wel. We werken per zone, plaatsen stofschermen en ruimen dagelijks op. Bij een gietvloer of volledige stripbeurt is een paar dagen elders logeren comfortabeler.' },
      { q: 'Maken jullie de kasten zelf?', a: 'Ja, in ons eigen atelier. Daardoor kunnen we tijdens de werken nog bijsturen zonder wekenlange levertermijnen.' },
      { q: 'Wat kost een gietvloer tegenover parket?', a: 'Dat verschilt te sterk per ondergrond en oppervlakte om hier een getal te noemen. In de offerte zetten we beide opties naast elkaar zodat u ze kunt vergelijken.' },
      { q: 'Doen jullie ook enkel schilderwerk of behang?', a: 'Als onderdeel van een grotere opdracht wel. Voor uitsluitend schilderwerk verwijzen we u liever door naar een schilder; dat is niet ons vak.' },
    ],
    meta: 'Interieurwerken door AB Bouw Groep: gyproc, pleisterwerk, parket en gietvloeren, en maatkasten uit eigen atelier.',
  },

  construct: {
    slug: 'construct', num: '01', title: 'Totaalrenovatie en nieuwbouw', eyebrow: 'Totaalrenovatie',
    heroTitle: 'Uw woning volledig<br/>op de schop',
    heroLede: 'Een woning die tot op de ruwe muren gaat, een aanbouw, of bouwen van nul. Wij coördineren alle vakken en houden één planning bij.',
    heroBg: conHero,
    storyTitle: 'Eén planning<br/>voor alle vakken',
    storyLede: 'Bij een totaalrenovatie gaat de meeste tijd verloren aan wachten: de tegelzetter kan niet starten omdat de chape er nog niet ligt. Omdat onze vakken onder hetzelfde dak zitten, plannen wij die volgorde zelf.',
    storyImg: conStory,
    features: [
      { n: '01', t: 'Sleutel op de deur', d: 'Nieuwbouwwoningen vanaf ongeveer 180 m², van vergunning tot oplevering.' },
      { n: '02', t: 'Totaalrenovatie', d: 'Tot op de ruwe muren, inclusief technieken en volledige afwerking.' },
      { n: '03', t: 'Uitbreiden', d: 'Aanbouw, dakopbouw of kelderuitbreiding aan een bestaande woning.' },
    ],
    whatWeDo: [
      { n: '01', t: 'Ruwbouw', d: 'Funderingen, metselwerk, betonwerk en draagstructuur door eigen metselaars.' },
      { n: '02', t: 'Technieken', d: 'Elektriciteit, sanitair, verwarming en ventilatie, op elkaar afgestemd.' },
      { n: '03', t: 'Afwerking', d: 'Pleisterwerk, vloeren, schrijnwerk en schilderwerk tot in de plinten.' },
    ],
    process: [
      stap('Plaatsbezoek', 'We bekijken de woning of het perceel en bespreken uw programma en budget.', 'binnen 5 werkdagen', '01'),
      stap('Ontwerp en offerte', 'Samen met uw architect of die van ons, plus een uitgesplitste prijs per fase.', 'binnen 3 weken', '02'),
      stap('Uitvoering', 'Eén werfleider bewaakt volgorde en planning van alle vakken.', 'afhankelijk van de omvang', '03'),
      stap('Oplevering', 'Rondgang, puntenlijst afwerken, dossier en garanties overhandigd.', 'zelfde week', '04'),
    ],
    faqs: [
      { q: 'Hebben jullie een eigen architect?', a: 'We werken graag samen met uw architect. Heeft u er nog geen, dan brengen we u in contact met een architect waarmee we vaker werken. U blijft zelf de opdrachtgever van de architect.' },
      { q: 'Regelen jullie de vergunning?', a: 'De aanvraag zelf loopt via de architect. Wij leveren de uitvoeringsgegevens aan en volgen mee op, zodat er geen tijd verloren gaat tussen goedkeuring en start.' },
      { q: 'Hoe zit het met meerwerk?', a: 'Meerwerk gaat pas door na uw schriftelijke akkoord op een aparte prijs. Zo staat er nooit iets op de eindfactuur waar u niet vooraf van wist.' },
      { q: 'Kan ik zelf een deel uitvoeren?', a: 'Dat kan, en we zetten in de offerte duidelijk waar onze verantwoordelijkheid stopt. Voor de garantie is het belangrijk dat die grens op papier staat.' },
    ],
    meta: 'Totaalrenovatie en nieuwbouw door AB Bouw Groep: ruwbouw, technieken en afwerking onder één planning, met eigen vakmensen.',
  },

  ecologisch: {
    slug: 'ecologisch', num: '02', title: 'Ecologisch en energetisch', eyebrow: 'Energetisch renoveren',
    heroTitle: 'Minder verbruiken,<br/>zonder gokwerk',
    heroLede: 'Isolatie, warmtepomp, ventilatie en zonnepanelen in één dossier. We rekenen vooraf uit wat elke ingreep oplevert, zodat u kunt kiezen wat u wel en niet doet.',
    heroBg: ecoHero,
    storyTitle: 'Eerst de schil,<br/>dan de techniek',
    storyLede: 'Een warmtepomp in een slecht geïsoleerde woning draait duur en haalt zijn rendement niet. Daarom isoleren we eerst en kiezen we het toestel pas daarna, op de werkelijke warmtevraag.',
    storyImg: ecoStory,
    features: [
      { n: '01', t: 'Isolatie eerst', d: 'Dak, spouw en buitengevel, zodat de installatie kleiner mag worden.' },
      { n: '02', t: 'Warmtepomp op maat', d: 'Gedimensioneerd op de warmtevraag na isolatie, niet op de oude situatie.' },
      { n: '03', t: 'Papierwerk mee', d: 'Attesten, EPB en premiedossier regelen wij mee waar dat van toepassing is.' },
    ],
    whatWeDo: [
      { n: '01', t: 'Isolatie', d: 'Dakisolatie in PIR, PUR of cellulose, spouwmuurisolatie en na-isolatie van gevels.' },
      { n: '02', t: 'Verwarming en ventilatie', d: 'Lucht/water-warmtepompen en gebalanceerde ventilatie met warmteterugwinning.' },
      { n: '03', t: 'Zon en bio-ecologisch', d: 'Zonnepanelen, en op aanvraag houtskeletbouw en kalkpleister.' },
    ],
    process: [
      stap('Plaatsbezoek', 'We nemen de schil op: dak, gevels, ramen en de huidige installatie.', 'binnen 5 werkdagen', '01'),
      stap('Doorrekening', 'U krijgt per ingreep wat het kost en wat het aan verbruik scheelt.', 'binnen 10 werkdagen', '02'),
      stap('Uitvoering', 'Eerst isoleren, dan de techniek plaatsen en inregelen.', 'afhankelijk van het pakket', '03'),
      stap('Oplevering', 'Inregelen, uitleg over de bediening, en de attesten die u nodig heeft.', 'zelfde week', '04'),
    ],
    faqs: [
      { q: 'Moet ik alles in één keer doen?', a: 'Nee. We maken een volgorde waarin elke stap op zichzelf zinvol is, zodat u kunt faseren zonder later werk te moeten afbreken.' },
      { q: 'Op welke premies heb ik recht?', a: 'Dat hangt af van uw inkomenscategorie, het bouwjaar en de ingreep, en de regels wijzigen geregeld. We toetsen uw dossier bij het plaatsbezoek en zeggen u dan waar u recht op heeft.' },
      { q: 'Werkt een warmtepomp met mijn bestaande radiatoren?', a: 'Soms wel, soms niet. Het hangt af van de watertemperatuur die uw radiatoren nodig hebben. We rekenen dat door en zeggen het eerlijk als vloerverwarming of grotere radiatoren nodig zijn.' },
      { q: 'Doen jullie ook enkel zonnepanelen?', a: 'Ja, dat kan als losse opdracht. We zeggen er wel bij of isoleren in uw situatie meer oplevert per geïnvesteerde euro.' },
    ],
    meta: 'Energetisch renoveren met AB Bouw Groep: isolatie, warmtepomp, ventilatie en zonnepanelen, doorgerekend voor u beslist.',
  },
};
