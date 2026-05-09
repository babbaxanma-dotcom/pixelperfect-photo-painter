import blog1 from '@/assets/home/blog1.jpg';
import blog2 from '@/assets/home/blog2.jpg';
import blog3 from '@/assets/home/blog3.jpg';
import ecoIso from '@/assets/eco/isolatie.jpg';
import badInloop from '@/assets/bad/inloopdouche.jpg';
import gevelCrepi from '@/assets/gevel/witte-crepi.jpg';
import dakIso from '@/assets/dak/dakisolatie.jpg';
import construct from '@/assets/construct/totaal.jpg';
import warmtepomp from '@/assets/eco/warmtepomp.jpg';

export type BlogPost = {
  slug: string;
  img: string;
  tag: string;
  day: string;
  month: string;
  date: string;
  author: string;
  readTime: string;
  title: string;
  excerpt: string;
  /** HTML body, rendered as-is */
  body: string;
};

export const BLOGS: BlogPost[] = [
  {
    slug: 'bouwen-in-2026',
    img: blog1,
    tag: 'Trends 2026',
    day: '12', month: 'mrt', date: '12 maart 2026',
    author: 'Tom Verhaegen', readTime: '6 min',
    title: 'Bouwen in 2026: zo verandert de Vlaamse woningmarkt',
    excerpt: 'Strengere EPC-eisen, circulair bouwen en nieuwe premies. Waarom 2026 hét moment is voor een toekomstgerichte renovatie.',
    body: `
      <p class="lf-lede">2026 is geen klein bouwjaar. De Vlaamse renovatieverplichting wordt strenger, de premies herschikken en de bouwsector zelf zit in volle transitie. Wie nu plant, bouwt voor de regelgeving van 2030 — niet die van 2020.</p>
      <h3>1. EPC-label D wordt de nieuwe ondergrens</h3>
      <p>Sinds 2023 moeten woningen met EPC E of F binnen vijf jaar na aankoop gerenoveerd worden tot minstens label D. In 2028 schuift die lat op naar label C, in 2035 naar label A. Praktisch betekent dat: dakisolatie, hoogrendementsbeglazing en een efficiënte verwarmingsinstallatie zijn niet langer optioneel.</p>
      <h3>2. Mijn VerbouwPremie blijft, maar wijzigt</h3>
      <p>De inkomensgebonden premie loopt door in 2026, met aangepaste plafonds. Voor dakisolatie, muurisolatie en glasvervanging blijven de bedragen interessant. Wij dienen de aanvraag standaard mee in — zonder meerprijs.</p>
      <h3>3. Circulair bouwen wordt mainstream</h3>
      <p>Hergebruikte bakstenen, biogebaseerde isolatie (hennep, houtvezel, kurk) en demonteerbare constructies zijn niet meer iets voor nichebouwers. We zien ze elke maand vaker in onze offertes — vaak op vraag van de klant zelf.</p>
      <h3>Wat wij u aanraden</h3>
      <p>Begin met een eerlijke audit van uw woning. Niet alles moet morgen, maar maak een plan voor de komende vijf jaar. Eén keer goed renoveren is altijd goedkoper dan drie keer flikken.</p>
    `,
  },
  {
    slug: 'warmtepomp-zonnepanelen',
    img: blog2,
    tag: 'Energie',
    day: '05', month: 'mrt', date: '5 maart 2026',
    author: 'Bart De Smet', readTime: '5 min',
    title: 'Warmtepomp en zonnepanelen: de slimme combinatie',
    excerpt: 'Hoe een hybride energiesysteem uw maandfactuur tot 70% verlaagt, en welke premies u in 2026 niet mag missen.',
    body: `
      <p class="lf-lede">Een warmtepomp werkt op stroom. Zonnepanelen wekken stroom op. De combinatie is logisch — maar pas écht rendabel met de juiste afstemming.</p>
      <h3>De match is technisch</h3>
      <p>Een lucht-water warmtepomp verbruikt het meest in de winter, net wanneer panelen het minst opbrengen. Toch loont de combinatie: op jaarbasis dekken 12 panelen ongeveer 60-80% van het pompverbruik in een goed geïsoleerde woning.</p>
      <h3>Vergeet de buffer niet</h3>
      <p>Een buffervat van 200-300 liter laat de pomp draaien wanneer de zon schijnt, zelfs als u op dat moment geen warmte vraagt. Zo benut u uw eigen stroom maximaal in plaats van die terug te leveren aan een lage prijs.</p>
      <h3>Premies 2026</h3>
      <p>Mijn VerbouwPremie geeft tot € 4.000 voor een warmtepomp en tot € 1.500 voor een hybride systeem. Voor de panelen zelf is er geen directe premie meer, maar de digitale meter en het capaciteitstarief maken zelfverbruik wél belangrijker dan ooit.</p>
    `,
  },
  {
    slug: 'badkamertrends-2026',
    img: blog3,
    tag: 'Interieur',
    day: '28', month: 'feb', date: '28 februari 2026',
    author: 'Lisa Mertens', readTime: '4 min',
    title: '5 badkamertrends die uw woning meer waard maken',
    excerpt: 'Walk-in douches, natuurlijke materialen en slim sanitair. Onze interieurarchitect deelt de must-haves voor 2026.',
    body: `
      <p class="lf-lede">Een goed gerenoveerde badkamer haalt zichzelf vaak terug bij verkoop. Maar niet elke trend is een investering — sommige zijn gewoon mode.</p>
      <h3>1. Inloopdouche zonder profiel</h3>
      <p>Vloergelijke douches met lineair afvoergoot zijn intussen standaard. Ze ogen rustig, zijn levensloopbestendig en maken de ruimte optisch groter.</p>
      <h3>2. Grootformaat tegels</h3>
      <p>60×120 of 120×120 op de vloer geeft minder voegen, dus een rustiger beeld én minder onderhoud. Op de wand werkt het idem.</p>
      <h3>3. Mat zwart en geborsteld nikkel</h3>
      <p>Chroom is stilaan op zijn retour. Mat zwart blijft hard staan; geborsteld nikkel komt op als warmer alternatief.</p>
      <h3>4. Geïntegreerde verlichting</h3>
      <p>LED-strips onder zwevende meubels, dimbare spiegelverlichting en circadiaans licht (warm 's avonds, koel 's ochtends) maken het verschil tussen een natte cel en een wellnessmoment.</p>
      <h3>5. Natuurlijk steen — of de imitatie ervan</h3>
      <p>Travertin en marmer komen terug. Wie het budget niet heeft: keramische tegels in steenlook zijn intussen bedrieglijk goed.</p>
    `,
  },
  {
    slug: 'dakisolatie-renovatieplicht',
    img: dakIso,
    tag: 'Renovatie',
    day: '20', month: 'feb', date: '20 februari 2026',
    author: 'Anthony Beerens', readTime: '5 min',
    title: 'Dakisolatie: de eerste stap, en waarom velen ze fout zetten',
    excerpt: 'Een slecht geïsoleerd dak verliest tot 30% van uw warmte. Wat u moet weten voor u begint.',
    body: `
      <p class="lf-lede">Vraagt u tien aannemers om een offerte voor dakisolatie? U krijgt tien verschillende prijzen én tien verschillende opbouwen. Hier is wat écht telt.</p>
      <h3>R-waarde, niet centimeter</h3>
      <p>Wat telt is de R-waarde van het hele pakket, niet alleen de dikte van de isolatie. Voor premies geldt R ≥ 4,5 m²K/W. Wij mikken standaard op R 5,5 — dat haalt u met 22 cm minerale wol of 18 cm PIR.</p>
      <h3>Damprem niet vergeten</h3>
      <p>Isoleren zonder luchtdicht damprem is geld weggooien. Vocht uit uw woning condenseert in de isolatie, die isolatie verzakt, en binnen vijf jaar zit u met schimmel op de dakplaat.</p>
      <h3>Hellend versus plat</h3>
      <p>Plat dak isoleert u meestal langs buiten (warm dak met PIR + EPDM). Hellend dak vaak langs binnen tussen de kepers, soms langs buiten met sarking. Welke aanpak het slimst is, hangt af van uw dakopbouw — laat dat altijd ter plaatse beoordelen.</p>
    `,
  },
  {
    slug: 'gevelrenovatie-crepi-versus-steenstrips',
    img: gevelCrepi,
    tag: 'Gevel',
    day: '14', month: 'feb', date: '14 februari 2026',
    author: 'Tom Verhaegen', readTime: '4 min',
    title: 'Crepi of steenstrips? De eerlijke vergelijking',
    excerpt: 'Beide kunnen prachtig. Beide hebben hun valkuilen. Een nuchtere kijk op de twee meest gevraagde gevelafwerkingen.',
    body: `
      <p class="lf-lede">We krijgen de vraag bijna wekelijks: "Wat raden jullie aan, crepi of steenstrips?" Ons antwoord is altijd hetzelfde: het hangt af van uw woning, uw budget én uw geduld.</p>
      <h3>Crepi: strakker, sneller, goedkoper</h3>
      <p>Een mineraal of siliconenpleister op buitenisolatie (ETICS) geeft een strak, modern beeld. De plaatsing gaat snel, het kost ongeveer € 110-140/m² inclusief 14 cm EPS-isolatie. Nadeel: bij stoten of ladders breekt de afwerking. En na 10-15 jaar is een herstel- of frisbeurt nodig.</p>
      <h3>Steenstrips: duurder, duurzamer</h3>
      <p>Keramische of klei-steenstrips ogen als echt metselwerk en gaan decennialang mee zonder onderhoud. Reken op € 180-230/m². De plaatsing duurt langer (voegen!) en u bent afhankelijker van de weersomstandigheden.</p>
      <h3>Wanneer kiezen we wat</h3>
      <p>Voor moderne nieuwbouw of een strakke gevelrenovatie: vaak crepi. Voor klassieke woningen of als de buren ook in baksteen zitten: steenstrips. En durf te combineren — crepi op het bovenvolume, steenstrips op de plint.</p>
    `,
  },
  {
    slug: 'sleutel-op-de-deur-renoveren',
    img: construct,
    tag: 'Renovatie',
    day: '06', month: 'feb', date: '6 februari 2026',
    author: 'Sarah Van den Broeck', readTime: '6 min',
    title: 'Renoveren met één aannemer: wat sleutel-op-de-deur écht inhoudt',
    excerpt: 'Eén contract, één prijs, één aanspreekpunt. Klinkt eenvoudig — maar wat krijgt u nu precies?',
    body: `
      <p class="lf-lede">"Sleutel-op-de-deur" is een term die elke aannemer gebruikt. Bij ons betekent het: u tekent één contract, u krijgt één planning, en wij regelen alle onderaannemers, vergunningen en oplevering.</p>
      <h3>Wat zit er standaard in</h3>
      <ul class="ab-checks">
        <li>Plaatsbezoek, opmeting en gedetailleerde offerte</li>
        <li>Architect en EPB-verslaggever indien nodig</li>
        <li>Alle ruwbouw, technieken en afwerking</li>
        <li>Vaste werfleider als één aanspreekpunt</li>
        <li>Wekelijks werfrapport met foto's</li>
        <li>Werfopruim, container en stortkosten</li>
        <li>Premie-aanvraag (Mijn VerbouwPremie)</li>
        <li>10-jarige aansprakelijkheid en verzekering</li>
      </ul>
      <h3>Wat zit er níét in</h3>
      <p>Meubilair, gordijnen, losse verlichting en tuinaanleg houden we standaard buiten de offerte — zodat u die zelf kan kiezen zonder marge. Wel adviseren we mee als u dat wenst.</p>
      <h3>Eén prijs, geen verrassingen</h3>
      <p>Onze offerte is gedetailleerd per post. Meerwerken kunnen voorkomen (verborgen vocht, asbest, slechte fundering) — maar enkel na uw schriftelijk akkoord. Geen "ja maar", geen rare facturen op het einde.</p>
    `,
  },
  {
    slug: 'na-isolatie-spouw-of-buiten',
    img: ecoIso,
    tag: 'Energie',
    day: '24', month: 'jan', date: '24 januari 2026',
    author: 'Bart De Smet', readTime: '4 min',
    title: 'Spouwmuur na-isoleren of langs buiten: wat is voor u het slimst?',
    excerpt: 'Drie technieken, drie prijskaartjes, drie heel verschillende resultaten. Een praktische gids.',
    body: `
      <p class="lf-lede">Tot 35% van uw warmteverlies gaat via de muren. Maar voor u beslist hoe u isoleert: weet wat uw muur aankan.</p>
      <h3>1. Na-isolatie van de spouw</h3>
      <p>Snel, goedkoop (€ 25-40/m²), klaar in één dag. Vereist wél een open spouw van minstens 5 cm en een gevel zonder vochtproblemen. Wij doen altijd eerst een endoscopisch onderzoek.</p>
      <h3>2. Buitenisolatie (ETICS)</h3>
      <p>Het beste resultaat (R 4-5+), geen koudebruggen, en u krijgt meteen een nieuwe gevel. Maar ook het duurste (€ 110-150/m²) en uw woning wordt zo'n 16 cm dikker — let op met dakoversteken en raamdorpels.</p>
      <h3>3. Binnenisolatie</h3>
      <p>Enkel als de twee andere niet kunnen (beschermde gevel, te smalle spouw). Vraagt vakwerk: een verkeerd geplaatste damprem leidt gegarandeerd tot vocht- en schimmelproblemen.</p>
    `,
  },
  {
    slug: 'wellness-thuis-budget',
    img: badInloop,
    tag: 'Bad & Wellness',
    day: '15', month: 'jan', date: '15 januari 2026',
    author: 'Lisa Mertens', readTime: '5 min',
    title: 'Wellness in eigen huis: wat kost het écht?',
    excerpt: 'Stoomdouche, sauna, hammam of jacuzzi: vier opties, vier budgetten, vier impacts op uw woning.',
    body: `
      <p class="lf-lede">Een wellness thuis is geen utopie meer. Met de juiste planning past het in een gemiddelde badkamer of bijgebouw — zolang u vooraf weet waar u aan begint.</p>
      <h3>Stoomdouche (€ 4.000 - 8.000)</h3>
      <p>De toegankelijkste optie. Past in elke moderne inloopdouche, mits goede ventilatie en een waterdichte cabine. Verbruik beperkt.</p>
      <h3>Infraroodsauna (€ 3.500 - 6.000)</h3>
      <p>Compact, lage aansluitwaarde, snel op temperatuur. Ideaal voor wie weinig ruimte heeft.</p>
      <h3>Klassieke Finse sauna (€ 6.000 - 12.000)</h3>
      <p>Vraagt 230V of 400V, een aparte ruimte met goede dampscherm en houten afwerking. Beste ervaring, maar reken op stroomverbruik en plaats.</p>
      <h3>Hammam (€ 12.000 - 25.000)</h3>
      <p>De koningsklasse. Volledig betegelde ruimte, stoomgenerator, banken op maat, vloerverwarming. Verhoogt uw woningwaarde aantoonbaar — maar het is een echt bouwproject.</p>
    `,
  },
];
