import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import hero from '@/assets/home/hero-realisaties.jpg';
import logo from '@/assets/home/logo.png';
import svcBad from '@/assets/home/svc-bad.jpg';
import svcDak from '@/assets/home/svc-dak.jpg';
import svcInterieur from '@/assets/home/svc-interieur.jpg';
import svcGevel from '@/assets/home/svc-gevel.jpg';
import svcConstruct from '@/assets/home/svc-construct.jpg';
import svcEco from '@/assets/home/svc-eco.jpg';
import about from '@/assets/home/about.jpg';
import skills from '@/assets/home/skills.jpg';
import why from '@/assets/home/why.jpg';
// dakwerken
import dakPannen from '@/assets/dak/hellend-pannen.jpg';
import dakLeien from '@/assets/dak/leien.jpg';
import dakEpdm from '@/assets/dak/plat-epdm.jpg';
import dakIso from '@/assets/dak/dakisolatie.jpg';
import dakZink from '@/assets/dak/zinkwerk.jpg';
import dakRaam from '@/assets/dak/dakraam.jpg';
import dakBitumen from '@/assets/dak/bitumen.jpg';
import dakIntro from '@/assets/dak/intro-overview.jpg';
// construct
import cAanbouw from '@/assets/construct/aanbouw.jpg';
import cAfwerking from '@/assets/construct/afwerking.jpg';
import cHalfopen from '@/assets/construct/halfopen.jpg';
import cVilla from '@/assets/construct/intro-villa.jpg';
import cNieuw from '@/assets/construct/nieuwbouw.jpg';
import cRuwbouw from '@/assets/construct/ruwbouw.jpg';
import cTotaal from '@/assets/construct/totaal.jpg';
// eco
import eHout from '@/assets/eco/houtskelet.jpg';
import eIso from '@/assets/eco/isolatie.jpg';
import eKalk from '@/assets/eco/kalk.jpg';
import eWarmte from '@/assets/eco/warmtepomp.jpg';
import eZon from '@/assets/eco/zonnepanelen.jpg';
import eVent from '@/assets/eco/ventilatie.jpg';
// extra renovation hero
import projVilla from '@/assets/project-villa.jpg';
import projReno from '@/assets/project-renovatie.jpg';
import projUtil from '@/assets/project-utiliteit.jpg';
// interieur
import intWoonkamer from '@/assets/interieur/woonkamer-eik.jpg';
import intKeuken from '@/assets/interieur/keuken-noten.jpg';
import intTrap from '@/assets/interieur/trap-staal-eik.jpg';

type Card = { img: string; tag: string; t: string; d: string };
type Filter = { key: string; label: string; imgs: [string, string, string, string]; cards: Card[] };

const dakwerken: Card[] = [
  { img: dakPannen, tag: 'Hellend dak', t: 'Pannendak Antwerpen', d: 'Volledige vervanging keramische pannen + onderdak + PIR-isolatie. 14 dagen.' },
  { img: dakEpdm, tag: 'Plat dak', t: 'EPDM aanbouw Lier', d: 'EPDM in één stuk met afschot, slokkers en zinken kraal. 8 dagen.' },
  { img: dakLeien, tag: 'Leien', t: 'Natuurleien villa Bonheiden', d: 'Spaanse natuurleien met koperen kielgoten en nieuwe schouwbekleding.' },
  { img: dakZink, tag: 'Zinkwerk', t: 'Bakgoot herenhuis Mechelen', d: 'Volledige bakgoot in zink VMZINC met EPDM-onderlaag. 3 dagen.' },
  { img: dakIso, tag: 'Dakisolatie', t: 'Sarking Willebroek', d: 'Sarking-isolatie 24 cm PIR met behoud van bestaande dakstoel.' },
  { img: dakRaam, tag: 'Dakramen', t: 'VELUX-set Boom', d: 'Drie nieuwe VELUX-ramen met aansluiting op bestaande pannen.' },
  { img: dakBitumen, tag: 'Bitumen', t: 'Plat dak garage Mechelen', d: 'APP-bitumen 2-laags met grijze leislag, klaar in 2 dagen.' },
  { img: dakIntro, tag: 'Dakrenovatie', t: 'Volledige dakvernieuwing Lier', d: 'Strip & rebuild dak: nieuwe spanten, isolatie en pannen.' },
  { img: dakPannen, tag: 'Hellend dak', t: 'Pannendak Boom', d: 'Vervanging keramische pannen Wienerberger met onderdakfolie en tengellatten.' },
  { img: dakEpdm, tag: 'Plat dak', t: 'EPDM dakkapel Mechelen', d: 'EPDM Firestone op nieuwe OSB-onderlaag met aluminium daktrim.' },
  { img: dakIso, tag: 'Dakisolatie', t: 'PUR zoldervloer Antwerpen', d: 'Geprojecteerde PUR 16 cm op de zoldervloer, premiedossier inbegrepen.' },
  { img: dakZink, tag: 'Zinkwerk', t: 'Mastgoten villa Bonheiden', d: 'Zinken mastgoten op verborgen consoles, koperen regenpijpen op maat.' },
  { img: dakLeien, tag: 'Leien', t: 'Leiendak pastorij Lier', d: 'Restauratie leiendak met behoud originele dakkapellen en koperen kielgoten.' },
  { img: dakRaam, tag: 'Dakramen', t: 'Lichtkoepel Mechelen', d: 'Twee VELUX-koepels op plat dak met opstanden en EPDM-aansluiting.' },
  { img: dakBitumen, tag: 'Bitumen', t: 'Bitumen platdak Antwerpen', d: 'Tweelaagse bitumen op nieuwe PIR-isolatie, 110 m² in 4 dagen.' },
  { img: dakIntro, tag: 'Dakrenovatie', t: 'Strip & rebuild Boom', d: 'Volledige strip van bestaand dak, nieuwe gordingen en pannenlat.' },
  { img: dakEpdm, tag: 'Plat dak', t: 'EPDM dakterras Brussel', d: 'EPDM met composiet terrasplanken op tegeldragers, inclusief leuning.' },
  { img: dakIso, tag: 'Dakisolatie', t: 'Hellingsisolatie Mechelen', d: 'PIR tussen kepers + onderdakfolie, behoud zichtbare dakstoel binnen.' },
];

const renovatie: Card[] = [
  { img: projReno, tag: 'Totaalrenovatie', t: 'Rijwoning Mechelen', d: 'Strip & rebuild, nieuwe technieken, isolatie, dak, gevel en interieur. 18 weken.' },
  { img: cTotaal, tag: 'Energetische renovatie', t: 'Hoekwoning Antwerpen', d: 'Naisolatie, nieuw schrijnwerk, warmtepomp en zonnepanelen. EPC C → A.' },
  { img: cAanbouw, tag: 'Aanbouw', t: 'Achterbouw Bonheiden', d: 'Aanbouw met plat dak, openslaande deuren en gietvloer. 10 weken.' },
  { img: cAfwerking, tag: 'Renovatie', t: 'Stadswoning Brussel', d: 'Volledige binnenrenovatie met behoud van originele cement-tegels.' },
  { img: cRuwbouw, tag: 'Ruwbouw-renovatie', t: 'Casco-renovatie Lier', d: 'Casco-strip, nieuwe binnendragende muren en stalen lateien.' },
  { img: about, tag: 'Gevelrenovatie', t: 'Halfopen Boom', d: 'Reiniging, nieuw voegwerk en geïsoleerde steenstrips. 4 weken.' },
  { img: projUtil, tag: 'Bedrijfspand', t: 'Kantoorrenovatie Willebroek', d: 'Volledige interieurrenovatie met nieuwe technieken en glaswanden. 12 weken.' },
  { img: cVilla, tag: 'Villarenovatie', t: 'Villa Bonheiden', d: 'Behoud authentieke gevel, volledig nieuwe binneninrichting en buitenisolatie.' },
  { img: cVilla, tag: 'Karakterwoning', t: 'Herenhuis Antwerpen', d: 'Restauratie originele lambrisering en pleisterprofielen, modern comfort.' },
  { img: projReno, tag: 'Stadsrenovatie', t: 'Burgerwoning Antwerpen', d: 'Volledige binnenrenovatie met behoud authentieke voorgevel. 16 weken.' },
  { img: cAanbouw, tag: 'Uitbreiding', t: 'Keukenuitbouw Mechelen', d: 'Aanbouw met grote schuifpui, gietvloer en doorzonkeuken. 8 weken.' },
  { img: cTotaal, tag: 'Energierenovatie', t: 'Fermette Bonheiden', d: 'Na-isolatie, nieuw schrijnwerk en warmtepomp. EPC F → B.' },
  { img: projUtil, tag: 'Bedrijfspand', t: 'Loods-renovatie Boom', d: 'Strip & rebuild loods naar kantoorruimte met dakisolatie en ramen.' },
  { img: cAfwerking, tag: 'Renovatie', t: 'Rijwoning Brussel', d: 'Open keuken-leefruimte gecreëerd door dragende muur weg te halen.' },
];

const nieuwbouw: Card[] = [
  { img: cVilla, tag: 'Vrijstaand', t: 'Open bebouwing Bonheiden', d: 'Sleutel-op-de-deur, E-peil 30, klassiek met gevelsteen. 11 maanden.' },
  { img: cHalfopen, tag: 'Halfopen', t: 'HOB Willebroek', d: 'Ruwbouw winddicht in 14 weken, oplevering casco+. Eigen ploegen op alle loten.' },
  { img: cNieuw, tag: 'Nieuwbouw', t: 'Vrijstaand Mechelen', d: 'Moderne nieuwbouw met witte crepi en grijs aluminium schrijnwerk.' },
  { img: projVilla, tag: 'BEN-bouw', t: 'BEN-villa Lier', d: 'Bijna-energieneutraal met warmtepomp, ventilatie D en 24 PV-panelen.' },
  { img: cRuwbouw, tag: 'Ruwbouw', t: 'Ruwbouw Boom', d: 'Ruwbouw winddicht met houtskeletwanden op betonnen plint. 16 weken.' },
  { img: cAanbouw, tag: 'Stadswoning', t: 'Nieuwbouw Antwerpen', d: 'Smalle stadskavel, drie bouwlagen met dakterras en patio.' },
  { img: cTotaal, tag: 'Vrijstaand', t: 'Villa Mechelen', d: 'Hedendaagse villa met crepi en houten gevelaccenten, BEN-norm.' },
  { img: cAfwerking, tag: 'Sleutel-op-de-deur', t: 'SOD-woning Boom', d: 'Volledige sleutel-op-de-deur met afwerking en keuken inbegrepen.' },
  { img: projVilla, tag: 'BEN-bouw', t: 'BEN-villa Bonheiden', d: 'Bijna-energieneutrale villa met geothermische warmtepomp.' },
  { img: cVilla, tag: 'Klassiek', t: 'Klassieke villa Lier', d: 'Klassieke vrijstaande woning in gevelsteen met zadeldak en dakkapel.' },
];

const interieur: Card[] = [
  { img: svcInterieur, tag: 'Maatwerk', t: 'Penthouse Mechelen', d: 'Volledig maatwerk: keuken, dressing, TV-wand en bibliotheek in eik.' },
  { img: intKeuken, tag: 'Keuken', t: 'Maatkeuken Antwerpen', d: 'Gefineerde noten met composiet werkblad en geïntegreerde toestellen.' },
  { img: intWoonkamer, tag: 'Vloeren', t: 'Visgraat eik Mechelen', d: 'Massief eik visgraat geolied, met vloerverwarming en ingebouwde bibliotheek.' },
  { img: intTrap, tag: 'Trappen', t: 'Stalen trap Mechelen', d: 'Maatwerktrap in zwart staal met massieve eiken treden.' },
  { img: eKalk, tag: 'Kalkpleister', t: 'Cottage Bonheiden', d: 'Natuurlijke kalkpleister in alle leefruimtes, ademend en mat.' },
  { img: cVilla, tag: 'Schrijnwerk', t: 'Maatkasten Lier', d: 'Inbouw-dressing en TV-meubel in gerookte eik.' },
  { img: intWoonkamer, tag: 'Loft-afwerking', t: 'Stadsappartement Brussel', d: 'Open-plan met lichtkoven, eiken vloer en mat-witte gepleisterde wanden.' },
  { img: intKeuken, tag: 'Open keuken', t: 'Open keuken Lier', d: 'Kookeiland in noten met zicht op tuin via grote schuifpui.' },
  { img: intTrap, tag: 'Trappenhal', t: 'Trappenhal Brussel', d: 'Open trappenhal met zwart staal, eiken treden en glazen leuning.' },
  { img: svcInterieur, tag: 'Bibliotheek', t: 'Maatbibliotheek Bonheiden', d: 'Vloer-tot-plafond bibliotheek in eik met geïntegreerde verlichting.' },
  { img: intWoonkamer, tag: 'Living', t: 'Living Antwerpen', d: 'Strakke living met gepleisterde lichtkoof en visgraat eiken vloer.' },
  { img: eKalk, tag: 'Pleisterwerk', t: 'Pleisterwerk Mechelen', d: 'Velours-pleisterwerk in alle leefruimtes met fijne profielen.' },
];

const badkamer: Card[] = [
  { img: svcBad, tag: 'Wellness', t: 'Wellnesssuite Leuven', d: 'Walk-in douche, hammam, dubbele wastafel en maatkast, 4 weken.' },
  { img: dakRaam, tag: 'Zolderbadkamer', t: 'Zolder Mechelen', d: 'Inbouw onder dakkapel met dakraam, microcement en zwevend toilet.' },
  { img: cAfwerking, tag: 'Familiebadkamer', t: 'Familiebadkamer Lier', d: 'Bad + inloopdouche, tegelwerk grootformaat, regendouche. 3 weken.' },
  { img: cAanbouw, tag: 'Compact', t: 'Gastenbadkamer Boom', d: 'Volledige strip & rebuild op 4 m² met zwevend meubel. 10 dagen.' },
  { img: svcBad, tag: 'Master', t: 'Master ensuite Bonheiden', d: 'Vrijstaand bad, dubbele inloopdouche en walk-in dressing. 5 weken.' },
  { img: eKalk, tag: 'Microcement', t: 'Microcementbadkamer Antwerpen', d: 'Naadloze microcement-afwerking op wanden en vloer, mat en warm.' },
  { img: svcBad, tag: 'Inloopdouche', t: 'Inloopdouche Mechelen', d: 'XL-inloopdouche met grootformaat tegels en zwart matte kraanwerk.' },
  { img: cAfwerking, tag: 'Renovatie', t: 'Badkamerrenovatie Boom', d: 'Strip & rebuild bestaande badkamer in 2,5 weken, inclusief leidingwerk.' },
  { img: dakRaam, tag: 'Dakbadkamer', t: 'Badkamer onder dak Lier', d: 'Volledig nieuwe badkamer onder hellend dak met twee VELUX-ramen.' },
  { img: cAanbouw, tag: 'Gastentoilet', t: 'Gastentoilet Antwerpen', d: 'Compact gastentoilet met fineer-meubel en mat zwart sanitair.' },
  { img: svcBad, tag: 'Wellness', t: 'Sauna-suite Bonheiden', d: 'Master ensuite met inbouwsauna en vrijstaand bad in microcement.' },
];

const gevel: Card[] = [
  { img: svcGevel, tag: 'Witte crepi', t: 'HOB Boom', d: 'Geïsoleerde gevel met witte siliconen-crepi. 4 weken.' },
  { img: cTotaal, tag: 'Grijze crepi', t: 'Nieuwbouw Mechelen', d: 'Antraciet crepi met zwart aluminium schrijnwerk.' },
  { img: dakIso, tag: 'Buitenisolatie', t: 'ETICS Antwerpen', d: 'Volledige na-isolatie met EPS + minerale crepi. EPC sprong van D → B.' },
  { img: cNieuw, tag: 'Steenstrips', t: 'Steenstrips Lier', d: 'Geïsoleerde steenstrips Wienerberger met crepi-accent.' },
  { img: about, tag: 'Houten gevel', t: 'Lariks Bonheiden', d: 'Ventileerde gevelbekleding in onbehandeld lariks, vergrijst natuurlijk.' },
  { img: svcGevel, tag: 'Composiet', t: 'Trespa Willebroek', d: 'Composiet gevelplaten Trespa Meteon op aluminium onderconstructie.' },
  { img: cTotaal, tag: 'Renovatie', t: 'Gevelrenovatie Mechelen', d: 'Reiniging, hervoegen en accent in steenstrips boven inkom.' },
  { img: cNieuw, tag: 'Strip & crepi', t: 'Naïsolatie Antwerpen', d: 'Volledige na-isolatie met EPS en mat-witte siliconen-crepi.' },
  { img: dakIso, tag: 'ETICS', t: 'ETICS-systeem Boom', d: 'Geïsoleerd gevelsysteem met versterkingsweefsel en minerale eindlaag.' },
  { img: about, tag: 'Lariks', t: 'Lariks-aanbouw Lier', d: 'Verticale lariks-bekleding op aanbouw, ventileerd op aluminium rails.' },
];

const ecologisch: Card[] = [
  { img: eHout, tag: 'Houtskelet', t: 'CLT-woning Mechelen', d: 'Massief houtbouw (CLT) met houtvezel-isolatie en kalkpleister.' },
  { img: eWarmte, tag: 'Warmtepomp', t: 'Lucht-water Lier', d: 'Hybride warmtepomp + bestaande condensatieketel als backup.' },
  { img: eZon, tag: 'Zonnepanelen', t: 'PV-installatie Boom', d: '24 panelen oost-west met hybride omvormer en thuisbatterij.' },
  { img: eIso, tag: 'Isolatie', t: 'Houtvezel Antwerpen', d: 'Volledig na-isolatieproject met natuurlijke houtvezelplaten.' },
  { img: eVent, tag: 'Ventilatie D', t: 'Systeem D Bonheiden', d: 'Balansventilatie met warmteterugwinning, 92% rendement.' },
  { img: eKalk, tag: 'Kalkpleister', t: 'Bio-renovatie Mechelen', d: 'Natuurlijke kalkpleister op leemstrobouw, dampopen en gezond.' },
  { img: eZon, tag: 'PV + batterij', t: 'Zonneproject Antwerpen', d: '18 PV-panelen met thuisbatterij 10 kWh en EV-laadpunt.' },
  { img: eHout, tag: 'Houtbouw', t: 'Houtskelet Boom', d: 'Houtskeletbouw met houtvezelisolatie en gevel in lariks.' },
  { img: eWarmte, tag: 'Geothermie', t: 'Bodemwarmtepomp Lier', d: 'Verticale boringen met geothermische warmtepomp en vloerverwarming.' },
  { img: eIso, tag: 'Bio-isolatie', t: 'Hennepisolatie Mechelen', d: 'Hennep- en houtvezelplaten in dakvlak van karakterwoning.' },
];

const filters: Filter[] = [
  { key: 'alle', label: 'Alle projecten',
    imgs: [projReno, dakPannen, svcInterieur, svcBad],
    cards: [
      renovatie[0], nieuwbouw[0], dakwerken[0], interieur[0],
      badkamer[0], gevel[0], ecologisch[0], renovatie[1],
      dakwerken[2], interieur[1], nieuwbouw[1], badkamer[2],
      gevel[1], ecologisch[1], renovatie[3], interieur[3],
    ],
  },
  { key: 'dakwerken', label: 'Dakwerken',
    imgs: [dakPannen, dakEpdm, dakLeien, dakZink], cards: dakwerken },
  { key: 'renovatie', label: 'Renovatie',
    imgs: [projReno, cAfwerking, cAanbouw, cTotaal], cards: renovatie },
  { key: 'nieuwbouw', label: 'Nieuwbouw',
    imgs: [cVilla, cHalfopen, cNieuw, projVilla], cards: nieuwbouw },
  { key: 'interieur', label: 'Interieur',
    imgs: [svcInterieur, intKeuken, intWoonkamer, intTrap], cards: interieur },
  { key: 'badkamer', label: 'Badkamer',
    imgs: [svcBad, dakRaam, cAfwerking, cAanbouw], cards: badkamer },
  { key: 'gevel', label: 'Gevelbekleding',
    imgs: [svcGevel, cTotaal, dakIso, cNieuw], cards: gevel },
  { key: 'ecologisch', label: 'Ecologisch',
    imgs: [eHout, eWarmte, eZon, eIso], cards: ecologisch },
];

const HTML = `
${buildNav('realisaties')}

${buildHero({
  bg: hero,
  eyebrow: 'Realisaties',
  title: 'Projecten die de tand<br/>des tijds doorstaan.',
  lede: 'Een greep uit ons recent werk. Elke realisatie is gebouwd door onze eigen vakmensen, opgevolgd door één projectleider en opgeleverd op de afgesproken datum.',
  primary: { label: 'Start uw project', href: '/contact' },
  secondary: { label: 'Bekijk realisaties →', href: '/realisaties' },
})}

<section class="lf-section">
  <div class="wrap">
    <div class="lf-proj-tabs-wrap" data-reveal>
      <div class="lf-proj-tabs" id="rzFilters">
        ${filters.map((f, i) => `
          <button class="lf-proj-chip${i === 0 ? ' active' : ''}" data-rz="${f.key}">
            ${i === 0 ? '<span class="lf-chip-dot"></span>' : ''}${f.label}
          </button>`).join('')}
      </div>
    </div>
    <div class="lf-proj-collage" data-reveal id="rzCollage">
      <div class="lf-proj-cell lf-proj-tl"><img id="rzImg0" src="${filters[0].imgs[0]}" alt="" loading="lazy"/></div>
      <div class="lf-proj-cell lf-proj-tr"><img id="rzImg1" src="${filters[0].imgs[1]}" alt="" loading="lazy"/></div>
      <div class="lf-proj-cell lf-proj-bl"><img id="rzImg2" src="${filters[0].imgs[2]}" alt="" loading="lazy"/></div>
      <div class="lf-proj-cell lf-proj-br"><img id="rzImg3" src="${filters[0].imgs[3]}" alt="" loading="lazy"/></div>
      <div class="lf-proj-logo"><img src="${logo}" alt="AB Bouw Groep" /></div>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="lf-stats">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">In cijfers</span>
      <h2 class="lf-h2">Realisaties die zich<br/>laten tellen.</h2>
    </div>
    <div class="lf-stats-grid">
      <div class="lf-stat-card" data-reveal>
        <div class="lf-stat-photo"><img src="${svcDak}" alt="" loading="lazy"/></div>
        <div class="lf-stat-body">
          <div class="lf-stat-num"><span class="lf-stat-dot"></span><span data-count="48325">0</span><span class="lf-stat-suffix">m²</span></div>
          <div class="lf-stat-label">Afgewerkte daken</div>
        </div>
      </div>
      <div class="lf-stat-card" data-reveal data-reveal-delay="1">
        <div class="lf-stat-photo"><img src="${svcGevel}" alt="" loading="lazy"/></div>
        <div class="lf-stat-body">
          <div class="lf-stat-num"><span class="lf-stat-dot"></span><span data-count="63112">0</span><span class="lf-stat-suffix">m²</span></div>
          <div class="lf-stat-label">Afgewerkte gevels</div>
        </div>
      </div>
      <div class="lf-stat-card" data-reveal data-reveal-delay="2">
        <div class="lf-stat-photo"><img src="${svcConstruct}" alt="" loading="lazy"/></div>
        <div class="lf-stat-body">
          <div class="lf-stat-num"><span class="lf-stat-dot"></span><span data-count="184">0</span><span class="lf-stat-suffix">+</span></div>
          <div class="lf-stat-label">Opgeleverde projecten</div>
        </div>
      </div>
      <div class="lf-stat-card lf-stat-card--nophoto" data-reveal data-reveal-delay="3">
        <div class="lf-stat-body">
          <div class="lf-stat-num"><span class="lf-stat-dot"></span><span data-count="1326">0</span><span class="lf-stat-suffix">+</span></div>
          <div class="lf-stat-label">Tevreden klanten</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow" id="rzCardsEyebrow">Recent werk</span>
      <h2 class="lf-h2" id="rzCardsTitle">Een greep uit onze projecten,<br/>één kwaliteitsstandaard.</h2>
    </div>
    ${filters.map(f => `
      <div class="rz-grid rz-panel${f.key === 'alle' ? ' active' : ''}" data-rz-panel="${f.key}" style="${f.key === 'alle' ? '' : 'display:none;'}">
        ${f.cards.map(p => `
          <a class="rz-proj-card" data-reveal href="/contact" aria-label="${p.t}">
            <div class="rz-proj-img"><img src="${p.img}" alt="${p.t}" loading="lazy"/></div>
            <div class="rz-proj-foot">
              <div class="rz-proj-meta">
                <span class="rz-proj-tag">${p.tag}</span>
                <span class="rz-proj-loc">${p.t}</span>
              </div>
              <span class="rz-proj-arrow" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>
              </span>
            </div>
          </a>`).join('')}
      </div>`).join('')}
  </div>
</section>

${buildCta('Uw project op deze pagina?', 'Een sterk resultaat begint bij een goed gesprek. We luisteren en denken vrijblijvend met u mee.')}

${FOOTER}
`;

const FILTER_DATA = filters.reduce<Record<string, { imgs: string[]; label: string }>>((acc, f) => {
  acc[f.key] = { imgs: f.imgs, label: f.label };
  return acc;
}, {});

export default function Realisaties() {
  useEffect(() => {
    document.title = "Realisaties | AB Bouw Group";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Een greep uit recente bouw- en renovatieprojecten van AB Bouw Group in Vlaanderen en Brussel.");
    const prev = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE + `
      .lf-proj-cell img { transition: opacity .35s ease; }
      .lf-proj-cell.swap img { opacity: 0; }

      /* Project cards — locatie + pijl stijl */
      .rz-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
      }
      @media (max-width: 720px) {
        .rz-grid { grid-template-columns: 1fr; gap: 20px; }
      }
      .rz-proj-card {
        position: relative;
        display: block;
        background: #fff;
        border-radius: 18px;
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 1px 2px rgba(15,23,42,.04), 0 12px 28px -18px rgba(15,23,42,.18);
        transition: transform .35s ease, box-shadow .35s ease;
      }
      .rz-proj-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 1px 2px rgba(15,23,42,.06), 0 28px 50px -22px rgba(15,23,42,.28);
      }
      .rz-proj-img {
        position: relative;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: #eef0f3;
      }
      .rz-proj-img img {
        width: 100%; height: 100%;
        object-fit: cover;
        display: block;
        transition: transform .9s cubic-bezier(.2,.7,.2,1);
      }
      .rz-proj-card:hover .rz-proj-img img { transform: scale(1.04); }
      .rz-proj-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 22px 20px;
      }
      .rz-proj-meta { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
      .rz-proj-tag {
        font-size: 11px;
        letter-spacing: .14em;
        text-transform: uppercase;
        color: #64748b;
        font-weight: 600;
      }
      .rz-proj-loc {
        font-size: 19px;
        font-weight: 600;
        color: #0f172a;
        letter-spacing: -.01em;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .rz-proj-arrow {
        flex: 0 0 auto;
        width: 40px; height: 40px;
        border-radius: 999px;
        display: inline-flex; align-items: center; justify-content: center;
        color: #0f172a;
        background: transparent;
        transition: background .25s ease, color .25s ease, transform .35s ease;
      }
      .rz-proj-card:hover .rz-proj-arrow {
        background: #0f172a; color: #fff; transform: translateX(4px);
      }

      /* Stats — strakker, foto naast cijfer */
      .lf-stats { padding: 90px 0 110px; }
      .lf-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-top: 48px;
      }
      @media (max-width: 980px) { .lf-stats-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 520px) { .lf-stats-grid { grid-template-columns: 1fr; } }
      .lf-stat-card {
        background: #fff;
        border: 1px solid rgba(15,23,42,.08);
        border-radius: 16px;
        padding: 18px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 10px 24px -20px rgba(15,23,42,.25);
      }
      .lf-stat-photo {
        flex: 0 0 auto;
        width: 72px; height: 72px;
        border-radius: 12px;
        overflow: hidden;
        background: #eef0f3;
      }
      .lf-stat-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .lf-stat-card--nophoto .lf-stat-photo { display: none; }
      .lf-stat-card--nophoto::before {
        content: '';
        flex: 0 0 auto;
        width: 72px; height: 72px;
        border-radius: 12px;
        background: linear-gradient(135deg, #0f172a, #1e293b);
      }
      .lf-stat-body { min-width: 0; }
      .lf-stat-num {
        display: flex; align-items: baseline; gap: 6px;
        font-size: 30px; font-weight: 700; color: #0f172a; letter-spacing: -.02em;
        line-height: 1;
      }
      .lf-stat-suffix { font-size: 16px; font-weight: 600; color: #475569; }
      .lf-stat-label { margin-top: 8px; font-size: 13px; color: #64748b; letter-spacing: .02em; }
      .lf-stat-dot { display: none; }
    `;
    document.head.appendChild(styleEl);

    const chips = document.querySelectorAll<HTMLButtonElement>('#rzFilters .lf-proj-chip');
    const cells = [0, 1, 2, 3].map(i => document.getElementById('rzImg' + i) as HTMLImageElement | null);
    const panels = document.querySelectorAll<HTMLElement>('.rz-panel');
    const handlers: Array<[HTMLButtonElement, () => void]> = [];

    chips.forEach((chip) => {
      const h = () => {
        const key = chip.getAttribute('data-rz') || 'alle';
        const data = FILTER_DATA[key];
        if (!data) return;
        chips.forEach(c => {
          c.classList.toggle('active', c === chip);
          const isActive = c === chip;
          const hasDot = c.querySelector('.lf-chip-dot');
          if (isActive && !hasDot) {
            const d = document.createElement('span');
            d.className = 'lf-chip-dot';
            c.insertBefore(d, c.firstChild);
          } else if (!isActive && hasDot) {
            hasDot.remove();
          }
        });
        cells.forEach(c => c?.parentElement?.classList.add('swap'));
        window.setTimeout(() => {
          cells.forEach((img, i) => { if (img) img.src = data.imgs[i]; });
          cells.forEach(c => c?.parentElement?.classList.remove('swap'));
        }, 280);
        panels.forEach(p => {
          const match = p.getAttribute('data-rz-panel') === key;
          p.style.display = match ? '' : 'none';
          p.classList.toggle('active', match);
        });
        const eb = document.getElementById('rzCardsEyebrow');
        const tt = document.getElementById('rzCardsTitle');
        if (eb) eb.textContent = key === 'alle' ? 'Recent werk' : data.label;
        if (tt) tt.innerHTML = key === 'alle'
          ? 'Een greep uit onze projecten,<br/>één kwaliteitsstandaard.'
          : `Recent werk, <span style="color:var(--brand,#c9a24a)">${data.label}</span>`;
      };
      chip.addEventListener('click', h);
      handlers.push([chip, h]);
    });

    return () => {
      document.body.className = prev;
      styleEl.remove();
      handlers.forEach(([el, h]) => el.removeEventListener('click', h));
    };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
