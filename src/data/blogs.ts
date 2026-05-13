import blog1 from '@/assets/home/blog1.jpg';
import blog2 from '@/assets/home/blog2.jpg';
import blog3 from '@/assets/home/blog3.jpg';
import ecoIso from '@/assets/eco/isolatie.jpg';
import badInloop from '@/assets/bad/inloopdouche.jpg';
import gevelCrepi from '@/assets/gevel/witte-crepi.jpg';
import dakIso from '@/assets/dak/dakisolatie.jpg';
import construct from '@/assets/construct/totaal.jpg';
import warmtepomp from '@/assets/eco/warmtepomp.jpg';
import blogHoutskelet from '@/assets/home/blog5-houtskelet.jpg';
import blogFermette from '@/assets/home/blog6-fermette.jpg';
import blogZon from '@/assets/home/blog7-zon.jpg';
// Hergebruik bestaande relevante assets als blog-cover voor de 6 extra blogs
import gevelGrijze from '@/assets/gevel/grijze-crepi.jpg';
import dakEpdmImg from '@/assets/dak/plat-epdm.jpg';
import interieurGietvloer from '@/assets/interieur/gietvloer.jpg';
import ecoVent from '@/assets/eco/ventilatie.jpg';
import interieurParket from '@/assets/interieur/parket.jpg';
import constructTotaal from '@/assets/construct/totaal.jpg';

// ----------------------------------------------------------------------------
// PLACEHOLDER COVERS voor de nieuwe SEO-blogs.
// Wil je een eigen foto? Open in File Explorer:
//   src/assets/home/
// en vervang het overeenkomstige bestand (drag-and-drop "save as" met dezelfde
// naam volstaat). Bestandsnaam = onthouden welke blog. Geen code-aanpassing.
// ----------------------------------------------------------------------------
import blogBadInloop from '@/assets/home/blog-bad-inloopdouche.jpg';
import blogBadStoom from '@/assets/home/blog-bad-stoomdouche.jpg';
import blogBadItaliaanse from '@/assets/home/blog-bad-italiaanse.jpg';
import blogGevelCrepiPrijs from '@/assets/home/blog-gevel-crepi-prijs.jpg';
import blogGevelEtics from '@/assets/home/blog-gevel-etics.jpg';
import blogGevelHouten from '@/assets/home/blog-gevel-houten.jpg';
import blogTrends2026 from '@/assets/home/blog-trends-2026.jpg';
import blogTrendsSmart from '@/assets/home/blog-trends-smarthome.jpg';
import blogTrendsBio from '@/assets/home/blog-trends-biobased.jpg';

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
    slug: 'epc-label-c-2028',
    img: gevelGrijze,
    tag: 'Regelgeving',
    day: '06', month: 'mei', date: '6 mei 2026',
    author: 'Tom Verhaegen', readTime: '6 min',
    title: 'EPC label C tegen 2028: bent u op tijd?',
    excerpt: 'De renovatieverplichting schuift in 2028 op naar label C. Welke ingrepen tellen echt mee, wat kost het, en waarom u beter nu start dan in 2027.',
    body: `
      <p class="lf-lede">In 2028 moet elke woning verkocht of geërfd na die datum binnen vijf jaar minstens EPC-label C halen. Voor veel Vlaamse rijwoningen betekent dat een serieus pakket aan werken — geen paniek, maar wel planning.</p>
      <h3>1. Wat is label C precies?</h3>
      <p>Label C komt grosso modo overeen met een EPC-score tussen 200 en 300 kWh/m²/jaar. Een ongeïsoleerde rijwoning uit de jaren '60 zit vandaag vaak op label E of F (400-600). De sprong is dus aanzienlijk.</p>
      <h3>2. De drie ingrepen die het verschil maken</h3>
      <p>Dakisolatie blijft de goedkoopste winst per kWh. Gevolgd door hoogrendementsbeglazing en spouwmuurisolatie of buitengevelisolatie. Een warmtepomp of condensatieketel werkt pas optimaal ná de isolatie — niet ervoor.</p>
      <h3>3. Wat kost label E → C?</h3>
      <p>Voor een gemiddelde rijwoning rekent u op € 35.000 tot € 60.000 voor de volledige sprong, premies niet meegerekend. Met Mijn VerbouwPremie en de juiste fasering blijft de netto-investering vaak onder € 40.000.</p>
      <h3>4. Waarom 2028 dichterbij is dan u denkt</h3>
      <p>De vergunningstermijnen, wachttijden bij aannemers en levertijden van materialen lopen op. Wie pas in 2027 begint, zit krap. Wie nu start, kiest het beste seizoen, de beste prijs en het beste team.</p>
      <h3>Ons advies</h3>
      <p>Vraag een EPC-audit aan vóór u iets uitvoert. Op basis daarvan maken wij een fasering over twee tot drie jaar — geen werk dubbelop, geen onnodige uitgaven.</p>
    `,
  },
  {
    slug: 'plat-dak-epdm-roofing-zink',
    img: dakEpdmImg,
    tag: 'Dakwerken',
    day: '29', month: 'apr', date: '29 april 2026',
    author: 'Tom Verhaegen', readTime: '6 min',
    title: 'Plat dak: EPDM, roofing of zink?',
    excerpt: 'Drie courante materialen, drie heel andere prijskaartjes en levensduren. Welke past bij uw aanbouw, garage of berging?',
    body: `
      <p class="lf-lede">Een plat dak is geen detail. De keuze van de waterdichting bepaalt of u in 2055 nog rustig kunt slapen tijdens een herfststorm — of niet.</p>
      <h3>1. Bitumineuze roofing (APP/SBS)</h3>
      <p>Het klassieke werkpaardje. Twee lagen, gebrand op de ondergrond. Levensduur 20 tot 25 jaar bij correcte plaatsing. Goedkoop in materiaal (€ 30-45/m² inclusief plaatsing), maar gevoelig voor naden en UV.</p>
      <h3>2. EPDM (rubberfolie)</h3>
      <p>Eén stuk rubber, vrijwel naadloos op een gemiddeld dak van 50 m². Levensduur 40 tot 50 jaar. Iets duurder (€ 55-75/m²), maar veel minder gevoelig voor mechanische schade en thermische schokken. Onze standaardkeuze voor nieuwbouw en grote vlakken.</p>
      <h3>3. Zink (felsdak)</h3>
      <p>Premium-keuze: levensduur tot 80 jaar, prachtig zichtbaar van op straat. Kost € 130-180/m². Vraagt een ervaren plaatser; één steekje los kan een dure herstelling worden.</p>
      <h3>4. Wat met groendak of begaanbaar dak?</h3>
      <p>Een groendak (sedum) komt altijd boven op EPDM of vergelijkbaar. Het beschermt de dichting en verlengt de levensduur tot 60+ jaar.</p>
      <h3>Ons advies</h3>
      <p>Voor de meeste aanbouwen, garages en BEN-platte daken: EPDM met een dampscherm en PIR-isolatie van 14-16 cm. Zink alleen waar het zichtbaar én verzorgd moet zijn.</p>
    `,
  },
  {
    slug: 'microcement-versus-tegels-badkamer',
    img: badInloop,
    tag: 'Interieur',
    day: '22', month: 'apr', date: '22 april 2026',
    author: 'Lisa Mertens', readTime: '5 min',
    title: 'Microcement of tegels in de badkamer?',
    excerpt: 'Naadloos en stoer, of klassiek en pragmatisch? Een eerlijke vergelijking op vlak van prijs, onderhoud en levensduur.',
    body: `
      <p class="lf-lede">Microcement is hot. Tegels zijn ingeburgerd. Maar wie een badkamer renoveert die vijftien jaar mee moet, doet er goed aan om verder te kijken dan de Instagram-foto's.</p>
      <h3>1. Look & feel</h3>
      <p>Microcement geeft een naadloos, monolithisch beeld — vaak in warme grijs- of beigetinten met subtiele spaanmarkering. Tegels bieden veel meer keuze in patroon, formaat en kleur, maar voegen blijven zichtbaar.</p>
      <h3>2. Waterdichtheid</h3>
      <p>Beide werken — mits correct geplaatst. Microcement vraagt een meerlagige opbouw met epoxy primer, een vezeldoek en een polyurethaan eindlaag. Eén foutje en u krijgt later barstjes. Bij tegels zit de kwetsbaarheid in de voegen en de waterdichting eronder.</p>
      <h3>3. Onderhoud</h3>
      <p>Microcement is gevoelig voor agressieve schoonmaakmiddelen en kalk. Een pH-neutraal product en een jaarlijkse impregnatie zijn de regel. Tegels zijn quasi onderhoudsvrij; voegen kunnen wel verkleuren.</p>
      <h3>4. Prijs</h3>
      <p>Microcement: € 90-140/m² inclusief plaatsing. Goede keramische tegels 60×120: € 70-110/m² geplaatst. Microcement is dus zelden goedkoper.</p>
      <h3>Ons advies</h3>
      <p>Voor douche- en spatzones: tegels of microcement zijn beide goed, mits vakkundig geplaatst. Voor vloer en wand in een masterbadkamer waar u rust en eenheid wilt: microcement is zijn meerprijs waard.</p>
    `,
  },
  {
    slug: 'vloerverwarming-nat-droog',
    img: interieurGietvloer,
    tag: 'Interieur',
    day: '15', month: 'apr', date: '15 april 2026',
    author: 'Bart De Smet', readTime: '5 min',
    title: 'Vloerverwarming in renovatie: nat of droogbouw?',
    excerpt: '8 cm chape of een droge plaat van 25 mm? De vloerverwarming-keuze die het verschil maakt bij een verbouwing zonder uitbraak.',
    body: `
      <p class="lf-lede">Vloerverwarming is in nieuwbouw evident. Bij renovatie wringt het: de bestaande vloeropbouw, de deuropeningen, de drempels — alles moet kloppen. De keuze tussen natte chape en droogbouw bepaalt vaak hoe ingrijpend de werken worden.</p>
      <h3>1. Natte vloerverwarming (chape)</h3>
      <p>Standaard 6-8 cm extra opbouw, leidingen op een isolatieplaat, daarna anhydriet- of cementchape. Beste warmteafgifte, traagste reactie. Vraagt minstens 6 weken droogtijd vóór tegels of parket.</p>
      <h3>2. Droogbouw vloerverwarming</h3>
      <p>Voorgevormde EPS- of XPS-panelen met groeven voor de leidingen, daarop een dunne afwerkingsplaat. Totale opbouw 25-40 mm. Geen droogtijd. Iets minder vermogen, maar voor goed geïsoleerde woningen ruim voldoende.</p>
      <h3>3. Wanneer kiest u wat?</h3>
      <p>Volledige strip-out van de vloer en voldoende plafondhoogte: natte chape. Behoud van bestaande dorpels, deuren en plafondhoogte: droogbouw. Bij combinatie met een warmtepomp werken beide perfect, mits het dikteverschil correct berekend is.</p>
      <h3>4. Wat met parket erboven?</h3>
      <p>Volgens de norm is de oppervlaktetemperatuur van het parket beperkt tot 27 °C. Kies voor meerlagig parket (geen massief), in beperkte breedtes, en laat het minstens twee weken acclimatiseren vóór plaatsing.</p>
      <h3>Ons advies</h3>
      <p>In rijwoningen met krappe plafondhoogte werkt droogbouw vaak beter. In open ruimtes met nieuwe gietvloer of grote tegels: nat. Wij berekenen altijd vermogen én opbouwhoogte vóór de keuze.</p>
    `,
  },
  {
    slug: 'asbestattest-verkoop-renovatie',
    img: constructTotaal,
    tag: 'Veiligheid',
    day: '08', month: 'apr', date: '8 april 2026',
    author: 'Tom Verhaegen', readTime: '6 min',
    title: 'Asbestattest 2026: zo verloopt een veilige verwijdering',
    excerpt: 'Sinds 2022 verplicht bij verkoop, vanaf 2032 voor élke woning. Wat betekent het concreet, en wanneer moet er echt verwijderd worden?',
    body: `
      <p class="lf-lede">Het asbestattest is geen verkoopformaliteit meer — het wordt het renovatiedocument bij uitstek. Wat staat erin, wat zegt het niet, en wat doet u ermee?</p>
      <h3>1. Wat is een asbestattest?</h3>
      <p>Een verplicht document opgesteld door een gecertificeerd asbestdeskundige (OVAM-erkend) waarin alle zichtbare en redelijkerwijs vermoede asbestbronnen in een woning worden opgelijst. Geldig 10 jaar, 5 jaar bij vastgestelde risico's.</p>
      <h3>2. Verplicht bij?</h3>
      <p>Verkoop sinds 2022. Verhuur en notariële schenking volgen. Vanaf 2032 moet élke woning gebouwd vóór 2001 een attest hebben. Renovatie? Niet verplicht, wel sterk aangeraden.</p>
      <h3>3. Verwijderen of in plaats laten?</h3>
      <p>Hechtgebonden asbest (golfplaten in goede staat, vinylvloer met asbest backing) is niet automatisch een probleem zolang u het niet beschadigt. Niet-hechtgebonden materiaal (oude isolatie rond buizen, spuitasbest) moet wél weg, door een erkend verwijderaar.</p>
      <h3>4. Wat kost het?</h3>
      <p>Attest: € 400-700 voor een gemiddelde woning. Verwijdering golfplaten: € 25-45/m² afgevoerd. Verwijdering buisisolatie: snel € 1.500-3.000 voor een gemiddelde rijwoning.</p>
      <h3>5. Premies</h3>
      <p>De Vlaamse asbestpremie blijft in 2026 actief: forfaitair € 8/m² voor daken, gecombineerd met de daksanering en isolatie. Voor totaalrenovaties is de premie vaak ruimer.</p>
      <h3>Ons advies</h3>
      <p>Combineer asbestverwijdering altijd met de daaropvolgende renovatie. Eén keer stellingen, één keer afvoer, één keer arbeid — dat scheelt al snel duizenden euro.</p>
    `,
  },
  {
    slug: 'mijn-verbouwpremie-2026',
    img: warmtepomp,
    tag: 'Premies',
    day: '01', month: 'apr', date: '1 april 2026',
    author: 'Tom Verhaegen', readTime: '7 min',
    title: 'Mijn VerbouwPremie 2026: alle bedragen op een rij',
    excerpt: 'Welke premies blijven, welke verdwijnen, en hoeveel kunt u in 2026 realistisch terugkrijgen op een totaalrenovatie?',
    body: `
      <p class="lf-lede">De Vlaamse premielandschap blijft bewegen. In 2026 verschuift het accent van losse subsidies naar gebundelde renovatieprojecten. Wie slim plant, recupereert tot € 25.000.</p>
      <h3>1. Mijn VerbouwPremie — de hoofdcategorieën</h3>
      <p>Inkomensgebonden, maar voor de meeste eenverdieners en gezinnen interessant. De plafonds in 2026:</p>
      <ul class="ab-checks">
        <li>Dakisolatie: € 8/m² tot € 30/m² afhankelijk van inkomenscategorie</li>
        <li>Buitenmuurisolatie binnenkant: € 15-22/m²</li>
        <li>Buitenmuurisolatie buitenkant: € 30-45/m²</li>
        <li>Spouwmuurisolatie: € 5-9/m²</li>
        <li>Hoogrendementsbeglazing: € 16-24/m²</li>
        <li>Warmtepomp lucht-water: € 1.500-4.000</li>
        <li>Hybride warmtepomp: € 800-1.800</li>
        <li>Zonneboiler: € 1.500</li>
      </ul>
      <h3>2. Renovatiekrediet bij Vlaamse Woonlening</h3>
      <p>Tot € 60.000 aan 0% intrest voor wie energetisch renoveert binnen 5 jaar na aankoop. Vaak rendabeler dan een commerciële lening.</p>
      <h3>3. Asbestpremie</h3>
      <p>€ 8/m² voor daken, op te tellen bij de daksaneringspremie. Combineer altijd met dakwerken zelf.</p>
      <h3>4. Aankoop + renovatie: het EPC-traject</h3>
      <p>Bij verkoop met EPC E of F bent u verplicht binnen 5 jaar naar D te renoveren. De gebundelde premie kan oplopen tot € 5.000 boven op de losse posten — mits aangevraagd via één dossier.</p>
      <h3>5. Wat veel mensen vergeten</h3>
      <p>Btw-tarief van 6% voor woningen ouder dan 10 jaar geldt nog altijd. Op een totaalrenovatie van € 80.000 is dat € 12.800 minder dan aan 21%.</p>
      <h3>Ons advies</h3>
      <p>Wij dienen alle premies standaard mee in. Eén dossier, één opvolger, één afrekening. U doet niets — behalve handtekenen.</p>
    `,
  },
  {
    slug: 'houtskelet-toekomst',
    img: blogHoutskelet,
    tag: 'Ecologisch',
    day: '01', month: 'apr', date: '1 april 2026',
    author: 'Bart De Smet', readTime: '5 min',
    title: 'Houtskeletbouw: waarom de cijfers eindelijk kloppen',
    excerpt: 'Sneller bouwen, lagere CO₂-uitstoot, betere isolatiewaardes. Wanneer is houtbouw écht slimmer dan klassieke ruwbouw?',
    body: `
      <p class="lf-lede">Houtskeletbouw zat lang in een nichehoekje. In 2026 wordt het mainstream — niet uit ecologische overtuiging, maar omdat de prijs-prestatieverhouding eindelijk klopt.</p>
      <h3>Een kortere bouwtijd</h3>
      <p>Een houtskeletwand wordt in atelier gefabriceerd en op werf geplaatst. Een volledige ruwbouw winddicht in 4-6 weken is realistisch — tegenover 14-18 weken bij klassieke ruwbouw. Dat scheelt huur, financieringskosten en risico op weervertraging.</p>
      <h3>Isolatie zit in de wand zelf</h3>
      <p>Een courante houtskeletwand haalt R 5,5 m²K/W met 24 cm houtvezel of cellulose. Bij klassieke ruwbouw heb je daarvoor een spouw van 14 cm + bijkomende buitenisolatie nodig.</p>
      <h3>De prijs in 2026</h3>
      <p>Voor een sleutel-op-de-deur woning ligt houtskelet zo'n 3-7% boven klassiek metselwerk — historisch was dat 10-15%. De evolutie zit in industrialisatie: meer prefab betekent minder uurloon op werf.</p>
      <h3>Wat het niet oplost</h3>
      <p>Funderingen blijven beton. Vloeren tussen verdiepingen zijn vaak nog predallen. Houtbouw bespaart u dus 60-70% van de "natte" bouwfase, niet alles.</p>
    `,
  },
  {
    slug: 'fermette-renoveren',
    img: blogFermette,
    tag: 'Renovatie',
    day: '25', month: 'mrt', date: '25 maart 2026',
    author: 'Sarah Van den Broeck', readTime: '6 min',
    title: 'Een fermette renoveren: charme behouden, comfort toevoegen',
    excerpt: 'Witgekalkte muren, oude balken, klinkers. Hoe maak je een fermette modern zonder de ziel eruit te slopen?',
    body: `
      <p class="lf-lede">Een Vlaamse fermette uit de jaren '70-'80 is geen monument — maar wel een typologie met een eigen taal. Het ergste wat je kan doen is hem laten lijken op een nieuwbouwwoning.</p>
      <h3>Behoud wat de fermette een fermette maakt</h3>
      <p>De witgekalkte buitenmuren, de zware balken in de leefruimte, de kleine vensteropeningen aan de straatkant: dat zijn de elementen die u niet kan namaken. Werk de details met respect af — geen plasticschijnbalken, geen gladde gypsumplaten over alles.</p>
      <h3>Open de achterkant</h3>
      <p>Het ritme van de meeste fermettes laat een grote opening aan de tuinkant toe zonder de straatzijde te schenden. Een schuifpui van 4-6 m geeft het comfort dat de oorspronkelijke woning ontbeerde, zonder de gevel naar de straat aan te tasten.</p>
      <h3>Isolatie: enkel langs binnen</h3>
      <p>Buitenisolatie ruïneert de uitstraling. Werk daarom langs binnen met natuurlijke materialen (houtvezel, hennep) op een correct geplaatste damprem. Combineer met kalkpleister voor een dampopen geheel.</p>
      <h3>Vloer en haard</h3>
      <p>De originele plavuizen of brede plankenvloer waar mogelijk behouden en herstellen — vaak goedkoper dan vervangen. De open haard? Sluit hem aan op een moderne EPA-houtkachel met dubbele verbranding, dat haalt uw E-peil omhoog zonder de sfeer te verliezen.</p>
      <h3>Ons advies</h3>
      <p>Werk met een aannemer die fermettes kent. Een loutere "modernisering" gooit drie generaties karakter weg. Het sweet spot zit in 70% behouden, 30% moderniseren.</p>
    `,
  },
  {
    slug: 'zonnepanelen-2026-rendement',
    img: blogZon,
    tag: 'Energie',
    day: '18', month: 'mrt', date: '18 maart 2026',
    author: 'Bart De Smet', readTime: '4 min',
    title: 'Zonnepanelen in 2026: kloppen de cijfers nog?',
    excerpt: 'Geen premie meer, capaciteitstarief, prosumententarief afgeschaft. Loont een PV-installatie nog steeds — en hoeveel?',
    body: `
      <p class="lf-lede">De gouden tijd van zonnepanelen is voorbij. Toch installeren we ze nog op bijna elke nieuwbouw en renovatie. Waarom? Omdat de wiskunde nog altijd klopt — alleen anders.</p>
      <h3>De nieuwe realiteit van 2026</h3>
      <p>Geen premie meer, geen terugdraaiende teller, een capaciteitstarief dat 's avonds stevig prijst. Wie zonnepanelen plaatst zonder strategie betaalt zich blauw.</p>
      <h3>Wat wél werkt</h3>
      <p>Maximaal eigen verbruik. Combineer panelen met een hybride omvormer en een thuisbatterij van 5-10 kWh. Stuur uw warmtepomp, vaatwas en EV-laadpaal op zonneproductie. Realistisch zelfverbruik haalt 65-80% in plaats van de oude 30%.</p>
      <h3>De cijfers</h3>
      <p>16 panelen (~6,4 kWp) + hybride omvormer + 8 kWh batterij + slimme aansturing: € 13.000-15.000. Terugverdientijd 8-10 jaar bij een gemiddeld gezin met 4.500 kWh/jaar verbruik en een warmtepomp.</p>
      <h3>Wanneer niet plaatsen?</h3>
      <p>Een noord-georiënteerd dak, een dak met veel schaduw, of een woning zonder warmtepomp én zonder EV. Dan loopt de terugverdientijd boven de 14 jaar — beter eerst het dak isoleren.</p>
      <h3>Ons advies</h3>
      <p>Zonnepanelen zijn in 2026 een lange-termijninvestering, geen quick-win. Plan ze ná dakisolatie en samen met uw warmtepomp en EV-laadpaal — anders rendeert het niet.</p>
    `,
  },
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

  // =====================================================================
  // EXTRA SEO-BLOGS — Bad & Wellness, Gevel, Trends 2026
  // Geoptimaliseerd op Vlaamse zoektermen. Vervang de img-bestanden in
  // src/assets/home/blog-*.jpg om eigen foto's te gebruiken.
  // =====================================================================

  {
    slug: 'inloopdouche-zonder-drempel-prijs',
    img: blogBadInloop,
    tag: 'Bad & Wellness',
    day: '03', month: 'mei', date: '3 mei 2026',
    author: 'Lisa Mertens', readTime: '6 min',
    title: 'Inloopdouche zonder drempel: wat kost het écht in 2026?',
    excerpt: 'De drempelloze inloopdouche is dé standaard geworden. Maar het prijsverschil tussen "starter" en "premium" loopt op tot €5.000 voor dezelfde m². Dit zijn de keuzes die uw factuur bepalen.',
    body: `
      <p class="lf-lede">Een goede inloopdouche begint niet bij het tegelmotief, maar bij de chape eronder. Acht jaar verder zonder lekken vergt minutieus vakwerk in vier lagen — en dat is precies waar de prijs zit.</p>
      <h3>1. Wat kost een drempelloze inloopdouche?</h3>
      <p>Reken op € 3.500 - € 7.500 voor een douche van 120×90 cm, alles in. De spreiding zit in: hardheid van de bestaande chape (uit te kappen of niet), drainagesysteem (lineair afvoergoot vs kruisafvoer), tegelformaat en glaspaneel-type.</p>
      <h3>2. Lineair afvoergoot of klassieke afvoer?</h3>
      <p>De lineair gootlijn (Wedi, Schlüter Kerdi) is mooier én vraagt slechts één afschotrichting, dus minder dik betegelen. Meerprijs: € 350-600. Voor renovaties met beperkte plafondhoogte een no-brainer.</p>
      <h3>3. Waterdichting: het kritieke punt</h3>
      <p>Vraag altijd om een gecertificeerd waterdichtingssysteem onder de tegels (vezeldoek + vloeibare PU of een Kerdi-membraan). Een dunne afsmeerlaag silicaat is geen waterdichting — dat is de bekendste oorzaak van lekkages na vijf jaar.</p>
      <h3>4. Tegels: welk formaat in Vlaanderen werkt?</h3>
      <p>Groot formaat (60×120 of 80×80) geeft een rustige look maar vraagt een vlakke ondergrond. Mozaïek (5×5) volgt het afschot makkelijk maar geeft veel voegwerk. Onze tussenkeuze: 30×60 verticaal geplaatst — eenvoudig te leggen, weinig voegen, modern.</p>
      <h3>5. Glaspaneel of volledig open?</h3>
      <p>Een 8 mm helder gehard glas van 90 cm breed kost € 450-700. Volledig open (walk-in zonder glas) bespaart u dit budget maar verwacht spatzones tot 1,5 m. Werkt enkel als de badkamer ruim genoeg is.</p>
      <h3>Ons advies</h3>
      <p>Investeer in de waterdichting en de chape — daar is geen "later opnieuw doen" mogelijk. Bespaar liever op tegel-merk (Vlaamse keramiek doet niet onder voor Italiaans tegen de helft van de prijs).</p>
    `,
  },
  {
    slug: 'stoomdouche-hammam-prijs',
    img: blogBadStoom,
    tag: 'Bad & Wellness',
    day: '26', month: 'apr', date: '26 april 2026',
    author: 'Lisa Mertens', readTime: '5 min',
    title: 'Stoomdouche en hammam: prijs, plaatsing en onderhoud',
    excerpt: 'Een stoomdouche thuis kost minder dan u denkt — een echte hammam veel meer. Het verschil zit in de stoomgenerator, de tegels en de eisen aan de ruimte.',
    body: `
      <p class="lf-lede">Het verschil tussen "een stoomfunctie in de douche" en "een echte hammam" zit in de manier waarop stoom geproduceerd, vastgehouden en afgevoerd wordt. Daar staan grote prijsstappen tegenover.</p>
      <h3>1. Stoomdouche in een bestaande cabine (€ 4.000 - 8.000)</h3>
      <p>Een stoomgenerator van 6-9 kW (Klafs, Tylö, Helo) wordt aangesloten op bestaande waterleiding en 230V/400V. De douchecabine krijgt een hellend plafond (afvloei condens), volledig betegelde wanden en een dampdichte deur. Klaar in 2-3 dagen, in een bestaande badkamer.</p>
      <h3>2. Een aparte hammam-ruimte (€ 12.000 - 25.000)</h3>
      <p>Een echte hammam is een aparte ruimte van minstens 4 m². Stoomgenerator van 12-18 kW, banken op maat (gegoten beton met tadelakt-afwerking), vloerverwarming voor de marmer/keramiek-vloer, plafond in gewelfde vorm. Bouwtijd: 3-4 weken.</p>
      <h3>3. Welk type stoomgenerator?</h3>
      <p>Reken 1 kW per m³ ruimte als vuistregel. Een hammam van 4 m² × 2,4 m hoog = bijna 10 m³ → minstens 9 kW. Een Klafs Coloris (€ 3.800) of Tylö Pure (€ 2.900) zijn courante keuzes in Vlaanderen.</p>
      <h3>4. Tegels: porceleinen of natuursteen?</h3>
      <p>Tadelakt-pleisterwerk geeft het authentieke marokkaanse hammam-effect maar vraagt jaarlijkse herwax. Porseleinen tegels zijn praktischer en even waterdicht — voor renovaties met onderhoudsbudget van nul aanrader.</p>
      <h3>5. Onderhoud: vaak onderschat</h3>
      <p>Vlaams leidingwater zorgt voor kalkaanslag in stoomgeneratoren. Plan jaarlijks een ontkalking (€ 120-180 service-prijs) — anders halveert u de levensduur van het toestel.</p>
      <h3>Ons advies</h3>
      <p>Twijfelt u tussen stoomdouche en hammam? Begin met een stoomgenerator in uw bestaande douche. Bevalt het, dan kunt u er over 2-3 jaar een echte hammam-ruimte aan toevoegen — de eerste investering blijft bruikbaar.</p>
    `,
  },
  {
    slug: 'italiaanse-douche-of-ligbad-2026',
    img: blogBadItaliaanse,
    tag: 'Bad & Wellness',
    day: '19', month: 'apr', date: '19 april 2026',
    author: 'Lisa Mertens', readTime: '5 min',
    title: 'Italiaanse douche of ligbad? De juiste keuze in 2026',
    excerpt: 'Vlaamse renoveerders kiezen sinds 2024 in 70% van de gevallen voor een drempelloze douche zonder bad. Maar in welke woningen is dat een fout?',
    body: `
      <p class="lf-lede">Het ligbad is niet dood — alleen verhuisd. Wie nog plaats heeft voor één badkamer wérk, moet bewust kiezen. Hier is wanneer een ligbad nog steeds de juiste keuze is.</p>
      <h3>1. Wanneer kiest u voor inloopdouche alleen?</h3>
      <p>Renovatie van een rijwoning waar de badkamer onder 8 m² blijft. Een drempelloze douche van 120×90 cm + lavabo + toilet vult comfortabel — een ligbad erbij zorgt voor een opeengepropte ruimte zonder beweegruimte.</p>
      <h3>2. Wanneer heeft u beide nodig?</h3>
      <p>Een gezinswoning met jonge kinderen. Niet voor uzelf — voor het bad waarin u uw 2-jarige verschoont, en het bad dat u op zondagavond zelf gebruikt. Vanaf 10 m² badkamerruimte is dit perfect haalbaar.</p>
      <h3>3. Vrijstaand of inbouw-ligbad?</h3>
      <p>Een vrijstaand bad (Riho, Bette, Villeroy & Boch — € 1.500-3.500) is dé designkeuze van 2026. Vraagt wel ≥ 80 cm rondom om praktisch werkbaar te zijn. Inbouw blijft ergonomischer en goedkoper (€ 600-1.200).</p>
      <h3>4. Wat met badkamerwaarde bij verkoop?</h3>
      <p>Marktanalyse Vlaamse vastgoedmakelaars (Q1 2026): woningen met enkel inloopdouche verkopen 4-6 weken sneller dan woningen met enkel ligbad. Combinatie blijft topkeuze voor gezinswoningen vanaf € 450.000.</p>
      <h3>Ons advies</h3>
      <p>Vraag uzelf één vraag: <em>"Wanneer heb ik voor het laatst een bad genomen?"</em>. Antwoord "vorige maand" of recenter → behoud het bad. Antwoord "weet ik niet meer" → vervang door grote inloopdouche.</p>
    `,
  },

  {
    slug: 'crepi-prijs-per-m2-2026',
    img: blogGevelCrepiPrijs,
    tag: 'Gevel',
    day: '12', month: 'mei', date: '12 mei 2026',
    author: 'Tom Verhaegen', readTime: '6 min',
    title: 'Crepi prijs per m² in 2026: alle factoren in één overzicht',
    excerpt: 'Een crepi-offerte kan variëren van € 45 tot € 110/m² voor exact dezelfde woning. Welke posten verklaren dat verschil? En welke moet u écht laten doen?',
    body: `
      <p class="lf-lede">Crepi blijft het meest gevraagde gevelproduct in Vlaanderen — maar de prijsspreiding is enorm. Hier is wat u krijgt voor elke € 10 verschil per m².</p>
      <h3>1. Basis crepi op bestaande gevel (€ 45 - 60/m²)</h3>
      <p>Reinigen, gronderen, één laag siliconenhars-pleister 2 mm. Geen stelling apart gerekend bij rijwoningen onder 8 m hoogte. Geschikt als de gevel structureel gezond is en u enkel een verfrissing wil.</p>
      <h3>2. Crepi met isolatie buitenkant — ETICS (€ 110 - 150/m²)</h3>
      <p>EPS- of rockwool-isolatie 12-16 cm + wapeningsnet + crepi-afwerking. Geeft u meteen een R-waarde van 4,5+ en u recupereert via de Mijn VerbouwPremie (€ 30-45/m²). Beste lange-termijn investering.</p>
      <h3>3. Stelling: vaak verborgen post</h3>
      <p>Een halfopen woning van 120 m² gevel vraagt 7-10 stelling-dagen. Stelling huren + opzetten kost € 1.800-3.200 voor zo'n project. Goedkope offertes "vergeten" deze post.</p>
      <h3>4. Welke korrel kiezen?</h3>
      <p>1,5 mm: glad en modern, maar elk gebrek is zichtbaar. 2 mm: meest gebruikt, structuur en gladheid in balans. 3 mm: rustieke uitstraling, perfect voor verdoezelen van oude scheurtjes.</p>
      <h3>5. Welke kleur in 2026?</h3>
      <p>De top-3 in Vlaanderen: gebroken wit (RAL 9001), licht-warmgrijs (NCS S 2000-N), en taupe-beige. Heldere kleuren (geel, rood) vragen UV-stabiele pigmenten — meerprijs € 4-6/m².</p>
      <h3>Ons advies</h3>
      <p>Combineer crepi altijd met isolatie als uw woning ouder is dan 1995 — anders betaalt u tweemaal voor één stelling. Vraag offertes met geïntegreerd premiedossier; dat scheelt al snel € 3.000-6.000 op een gemiddelde gevel.</p>
    `,
  },
  {
    slug: 'etics-buitengevelisolatie-premie-2026',
    img: blogGevelEtics,
    tag: 'Gevel',
    day: '05', month: 'mei', date: '5 mei 2026',
    author: 'Tom Verhaegen', readTime: '7 min',
    title: 'ETICS buitengevelisolatie: premie, prijs en valkuilen',
    excerpt: 'Buitenisolatie is de duurste maar meest effectieve manier om uw EPC te verbeteren. In 2026 is de premie verhoogd, maar de uitvoering is complexer dan ooit.',
    body: `
      <p class="lf-lede">External Thermal Insulation Composite System — kortweg ETICS — is technisch geen renovatie meer maar een herinrichting van uw woningschil. Hier is wat u moet weten vóór u tekent.</p>
      <h3>1. Wat is ETICS precies?</h3>
      <p>Een gelaagd systeem: lijmlaag op de bestaande gevel + isolatieplaat (12-20 cm EPS, rotswol of PIR) + glasvezelweefsel + grondlaag + decoratieve crepi-afwerking. Totale dikte: 14-22 cm extra op uw gevel.</p>
      <h3>2. R-waarde en EPC-impact</h3>
      <p>Een goed uitgevoerd ETICS-systeem haalt R 4,5-5,5 m²K/W. Voor een doorsnee rijwoning betekent dat een EPC-sprong van 80-120 punten — voldoende om van label F naar C te springen, of van D naar B.</p>
      <h3>3. Mijn VerbouwPremie 2026</h3>
      <p>Buitenisolatie buitenkant: € 30/m² (hoogste inkomenscategorie) tot € 45/m² (laagste inkomenscategorie). Voor een gemiddelde rijwoning van 120 m² gevel: € 3.600 - 5.400 premie. Wij dienen het dossier integraal mee in.</p>
      <h3>4. Valkuilen: dakoversteken en raamdorpels</h3>
      <p>Uw gevel wordt 16 cm dikker. Bestaande dakoversteken moeten verlengd, raamdorpels vernieuwd, regenpijpen verlegd. Dat is 15-25% van uw totale ETICS-budget — niet vergeten in te calculeren.</p>
      <h3>5. Welke isolatieplaat?</h3>
      <p>EPS grafiet (Neopor): goedkoopst, R 4,5 bij 14 cm, brandklasse B-s2,d0. Rockwool: duurder maar brandveiliger en geluiddempender, A1-klasse. PIR (Recticel): dunner mogelijk voor zelfde R-waarde — handig bij smalle straatzijde.</p>
      <h3>6. Hoe lang duurt de uitvoering?</h3>
      <p>Voor een halfopen woning rekent u op 12-18 werkdagen: 2 dagen stelling opbouwen, 3-4 dagen isolatie kleven, 2 dagen wapenen, 4-5 dagen droging + crepi, 1 dag stelling afbreken. Weersafhankelijk.</p>
      <h3>Ons advies</h3>
      <p>Begin met een EPC-audit vóór u offerteert. Dan weet u of buitenisolatie écht de juiste keuze is, of dat na-isolatie van de spouw volstaat (een derde van de prijs). Voor woningen vóór 1980 zonder isolerende spouw is ETICS bijna altijd de winnaar.</p>
    `,
  },
  {
    slug: 'houten-gevelbekleding-thermowood-lariks',
    img: blogGevelHouten,
    tag: 'Gevel',
    day: '28', month: 'apr', date: '28 april 2026',
    author: 'Bart De Smet', readTime: '6 min',
    title: 'Houten gevelbekleding: thermowood, lariks of vergrijzen?',
    excerpt: 'Hout op een gevel is mooi op dag één. Hoe het er over tien jaar uitziet hangt af van houtsoort, oriëntatie en wat u accepteert. Een eerlijke gids.',
    body: `
      <p class="lf-lede">Een houten gevel veroudert anders dan een crepi-gevel — en die vergrijzing is niet iedereen z'n smaak. Hier is hoe u kiest zonder spijt achteraf.</p>
      <h3>1. Lariks: Europees, betaalbaar, vergrijst</h3>
      <p>Siberische of Oostenrijkse lariks (€ 35-55/m² geplaatst) is de meest gebruikte keuze in Vlaanderen. Onbehandeld vergrijst hij in 18-24 maanden naar een uniforme zilvergrijze tint. Wie dat niet wil, behandelt jaarlijks met een UV-pigment-olie (€ 80/uur arbeid).</p>
      <h3>2. Thermowood (€ 60-85/m²)</h3>
      <p>Vuren of grenen dat thermisch behandeld is (220°C, 3 uur) — wordt rotbestendig en stabieler. Donkerbruin op dag één, vergrijst trager dan lariks. Beste keuze voor noordgevels die je dieper bruin wil houden.</p>
      <h3>3. Western Red Cedar (€ 95-140/m²)</h3>
      <p>Top-keuze qua duurzaamheid (50+ jaar) en stabiliteit. Diep bruinrood verkleurd naar zilvergrijs. Importprijs maakt dit een premium-keuze, ideaal voor architecten-villa's of accenten.</p>
      <h3>4. Composiet (€ 80-120/m²)</h3>
      <p>Houtvezels + recyclage-kunststof. Vergrijst niet, krast niet, vraagt nul onderhoud. Maar het ziet er ook nooit écht als hout uit — voor sommigen een dealbreaker.</p>
      <h3>5. Oriëntatie en levensduur</h3>
      <p>Zuid en west krijgen tot 60% meer UV en regen dan noord. Een lariks-zuidgevel vergrijst sneller en ongelijker. Combineer dus: lariks op de luwe zijdes, thermowood op zon-blootgestelde delen, of bescherm de zuidgevel met een dakoversteek van 60+ cm.</p>
      <h3>6. Bevestiging: gevelrasterprofiel met luchtspouw</h3>
      <p>Goed houtwerk zit nooit direct tegen de muur. Een tengellatten-rooster van 28 mm geeft een ventileerbare luchtspouw — cruciaal tegen schimmel achter de bekleding. Wij gebruiken aluminium tengels in plaats van hout: 0 risico op rot.</p>
      <h3>Ons advies</h3>
      <p>Test eerst een sample. Wij plaatsen op aanvraag een proefpaneel van 1 m² in lariks, thermowood en composiet op uw gevel — twaalf weken laten zitten, dan kiezen. Bespaart spijt over een 30+ jaar beslissing.</p>
    `,
  },

  {
    slug: 'renovatietrends-2026-vlaanderen',
    img: blogTrends2026,
    tag: 'Trends 2026',
    day: '17', month: 'mei', date: '17 mei 2026',
    author: 'Tom Verhaegen', readTime: '6 min',
    title: 'Renovatietrends 2026: wat zien Vlaamse aannemers veranderen?',
    excerpt: 'Vijf bewegingen op de werf die in 2026 ons werk veranderen — van materiaalkeuze tot klantverwachting. Wat dit voor uw renovatieplan betekent.',
    body: `
      <p class="lf-lede">Trends in bouw verlopen anders dan in mode — ze trekken vijf jaar door en gaan dan vaak nooit meer weg. Hier is wat we sinds januari 2026 anders zien dan in 2025.</p>
      <h3>1. Microcement en tadelakt vervangen tegels (deels)</h3>
      <p>Voor het tweede jaar op rij vragen klanten naadloze afwerking in badkamer- en woonkamervloeren. Microcement (€ 90-140/m²) is nu mainstream in middenklasse-renovaties. Tegels blijven dominant in douches en gevels.</p>
      <h3>2. Warmtepomp wordt standaard, gas verdwijnt</h3>
      <p>Sinds januari 2026 is een nieuwe gasketel in nieuwbouw verboden in Vlaanderen. In renovaties zien we 80% van onze klanten meteen overschakelen op een lucht/water-warmtepomp — vaak in combinatie met buitengevelisolatie.</p>
      <h3>3. Zwart schrijnwerk in plaats van antraciet</h3>
      <p>De grijstrend wordt opgevolgd door dieper-zwart RAL 9005. Ramen, deuren, dakrandafwerkingen — alles wordt strakker en donkerder. Vooral in combinatie met witte of zachtbeige gevels.</p>
      <h3>4. Maatkasten in eik of noten i.p.v. wit</h3>
      <p>Witte hoogglans is gedaan. Klanten kiezen nu massief gefineerde houtsoorten — vooral noten, donkere eik en zelfs essen. Meerprijs t.o.v. wit melamine: 25-40%, maar woningwaarde stijgt mee.</p>
      <h3>5. Verborgen technieken, zichtbare ambacht</h3>
      <p>Wandcontactdozen ingelaten, verlichting indirect of in een schaduwvoeg, ventilatie via wandroosters i.p.v. plafondroosters. Maar zichtbare structuren (gebinte, beton, ruwe baksteen) komen terug. Het zijn de leidingen die moeten verdwijnen, niet het materiaal.</p>
      <h3>Ons advies</h3>
      <p>Trends zijn nuttig voor inspiratie, niet als checklist. Begin elke renovatie met de structurele beslissingen (isolatie, technieken, indeling) — afwerkingstrends kies u pas wanneer u de offerte rondhebt en het beton droogt.</p>
    `,
  },
  {
    slug: 'smart-home-renovatie-knx-domotica',
    img: blogTrendsSmart,
    tag: 'Trends 2026',
    day: '10', month: 'mei', date: '10 mei 2026',
    author: 'Bart De Smet', readTime: '6 min',
    title: 'Smart home bij renovatie: van eenvoudige domotica tot KNX',
    excerpt: 'U hoeft geen IT\'er te zijn om uw verlichting, verwarming en zonwering centraal te bedienen. Vier niveaus van domotica, vier budgetten, vier impacts.',
    body: `
      <p class="lf-lede">Domotica is geen luxe meer, maar de invulling loopt sterk uiteen. Hier is hoe u kiest tussen "een app voor de verwarming" en een volledig KNX-systeem.</p>
      <h3>1. App-based slimme apparaten (€ 500 - 2.000)</h3>
      <p>Slimme thermostaat (Tado, Netatmo, Bosch), enkele Philips Hue-lampen, een Shelly relais op de zonwering. Bedienbaar via smartphone-app, geen kabels extra. Geschikt voor kleinere renovaties of huurwoningen. Nadeel: drie apps, drie clouds, fragmentatie.</p>
      <h3>2. Niko Home Control (€ 4.000 - 8.000 voor doorsnee rijwoning)</h3>
      <p>Belgisch product, draadgebonden bediening met aantrekkelijke schakelaars. Centraal stuurt verlichting, zonwering, ventilatie, soms verwarming. Werkt zonder internet, eenvoudig in onderhoud. Onze meest gevraagde keuze voor renovaties tot € 250.000.</p>
      <h3>3. KNX (€ 10.000 - 25.000)</h3>
      <p>De Europese standaard voor gebouwautomatisering. Volledig configurereerbaar, eindeloos uitbreidbaar, herprogrammeerbaar. Vraagt een KNX-integrator én een aparte bekabeling. Beste keuze voor villa's vanaf € 700.000 of bedrijven.</p>
      <h3>4. Loxone (€ 6.000 - 15.000)</h3>
      <p>De moderne uitdager: één Miniserver-kastje stuurt verlichting, audio, klimaatregeling, beveiliging. Open systeem, korte leercurve. Mooie middenweg tussen Niko en KNX qua flexibiliteit/prijs.</p>
      <h3>5. Wat plant u in een renovatie?</h3>
      <p>Vraag in elk geval extra lege buizen tussen plafond, vloer en verdeelkast bij elke renovatie waar de muren open liggen. Kostprijs nu: € 200-400. Achteraf bijwerken zonder lege buis: € 3.000-6.000. Hetzelfde principe geldt voor CAT6-bekabeling.</p>
      <h3>Ons advies</h3>
      <p>Start met scenario's, niet met apparaten. Welke acties wil u in één klik kunnen doen? "Avondmodus", "Vakantie", "Filmavond". Pas daarna bepaalt u welk systeem dat moet ondersteunen. Een KNX zonder duidelijk gebruik is verspilde investering.</p>
    `,
  },
  {
    slug: 'biobased-bouwen-hempcrete-leem-houtvezel-2026',
    img: blogTrendsBio,
    tag: 'Trends 2026',
    day: '03', month: 'mei', date: '3 mei 2026',
    author: 'Bart De Smet', readTime: '7 min',
    title: 'Biobased bouwen in 2026: hempcrete, leem en houtvezelisolatie',
    excerpt: 'Vlaamse bouwmaterialen worden groener. Wat is realistisch, wat blijft niche, en wat haalt nu écht de werf? Een nuchtere stand van zaken.',
    body: `
      <p class="lf-lede">"Biobased" is geen marketingterm meer — het is een materiaalcategorie met eigen prestaties, prijzen en valkuilen. Hier is wat u in 2026 redelijkerwijs kunt verwachten.</p>
      <h3>1. Houtskeletbouw blijft de hoofdmoot</h3>
      <p>30% van de Vlaamse nieuwbouw is intussen in houtskelet (CLT of vlasvezelplaat). Sneller op de werf (4-6 weken kortere bouwtijd), beter geïsoleerd, lagere CO₂-voetafdruk. Meerprijs t.o.v. snelbouwsteen: 6-12%.</p>
      <h3>2. Houtvezelisolatie i.p.v. minerale wol</h3>
      <p>Pavatex, Steico, Gutex — houtvezelplaten met λ-waarde 0,038-0,044. Iets duurder (€ 18-26/m² vs € 9-14/m² voor rotswol), maar capillair en damp-open. Geschikt voor sarking-daken en houten gevels. Voor klassieke spouwmuren niet altijd zinnig.</p>
      <h3>3. Hempcrete (hennepkalk): nog niche, maar groeiend</h3>
      <p>Mengsel van hennepvezel + kalkmelk, in situ gestort of als prefab-blok (€ 250-350/m³ verwerkt). Geweldig vochtregulerend, maar lage druksterkte — niet zelfdragend, vraagt houten frame. In Vlaanderen vooral gebruikt in monumentenrenovatie en passieve villa's.</p>
      <h3>4. Leempleister voor binnenmuren</h3>
      <p>Geen scheuren, geen verf nodig, regelend op luchtvochtigheid (40-60% RV constant). Meerprijs vs gyproc + pleister: 20-30%. Onze aanrader voor slaapkamers en hobbykamers. In badkamers minder geschikt — daar primeert waterdichting.</p>
      <h3>5. Cellulose-vlokken voor zolderisolatie</h3>
      <p>Gerecycleerd kranten- en boekenpapier, vlokkenmachine in een dag verspreid (€ 25-40/m² voor 24 cm). Vergelijkbaar isolerend met EPS, maar 100% recyclebaar en zonder broeikasgas-petrochemie. Wij plaatsen dit op 60% van onze hellende dak-renovaties sinds 2025.</p>
      <h3>6. Wat met de premies?</h3>
      <p>De Mijn VerbouwPremie maakt sinds 2026 geen onderscheid meer tussen biobased en synthetisch — de R-waarde telt. Vlaams Energie Agentschap bevestigt: een natuurlijke isolatie met R 4,5 krijgt evenveel premie als rotswol met R 4,5.</p>
      <h3>Ons advies</h3>
      <p>Begin met wat bewezen is: cellulose op zolder, houtvezel voor sarking, leempleister op één kamer. Bouw uw vertrouwen op. Hempcrete en CLT zijn fantastisch maar vragen specialisten — niet elke aannemer kan dat al uitvoeren.</p>
    `,
  },
];
