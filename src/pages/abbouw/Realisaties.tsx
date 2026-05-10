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
  { img: skills, tag: 'Karakterwoning', t: 'Herenhuis Antwerpen', d: 'Restauratie originele lambrisering en pleisterprofielen, modern comfort.' },
];

const nieuwbouw: Card[] = [
  { img: cVilla, tag: 'Vrijstaand', t: 'Open bebouwing Bonheiden', d: 'Sleutel-op-de-deur, E-peil 30, klassiek met gevelsteen. 11 maanden.' },
  { img: cHalfopen, tag: 'Halfopen', t: 'HOB Willebroek', d: 'Ruwbouw winddicht in 14 weken, oplevering casco+. Eigen ploegen op alle loten.' },
  { img: cNieuw, tag: 'Nieuwbouw', t: 'Vrijstaand Mechelen', d: 'Moderne nieuwbouw met witte crepi en grijs aluminium schrijnwerk.' },
  { img: projVilla, tag: 'BEN-bouw', t: 'BEN-villa Lier', d: 'Bijna-energieneutraal met warmtepomp, ventilatie D en 24 PV-panelen.' },
  { img: cRuwbouw, tag: 'Ruwbouw', t: 'Ruwbouw Boom', d: 'Ruwbouw winddicht met houtskeletwanden op betonnen plint. 16 weken.' },
  { img: about, tag: 'Stadswoning', t: 'Nieuwbouw Antwerpen', d: 'Smalle stadskavel, drie bouwlagen met dakterras en patio.' },
];

const interieur: Card[] = [
  { img: svcInterieur, tag: 'Maatwerk', t: 'Penthouse Mechelen', d: 'Volledig maatwerk: keuken, dressing, TV-wand en bibliotheek in eik.' },
  { img: cAfwerking, tag: 'Pleisterwerk', t: 'Herenhuis Antwerpen', d: 'Velours-pleisterwerk in alle leefruimtes, profielen en lichtkoven.' },
  { img: skills, tag: 'Vloeren', t: 'Visgraat eik Mechelen', d: 'Massief eik visgraat geolied, met vloerverwarming.' },
  { img: about, tag: 'Loft', t: 'Industriële loft Brussel', d: 'Open-plan met akoestisch plafond, betonlook gietvloer en stalen binnenpui.' },
  { img: eKalk, tag: 'Kalkpleister', t: 'Cottage Bonheiden', d: 'Natuurlijke kalkpleister in alle leefruimtes, ademend en mat.' },
  { img: cVilla, tag: 'Schrijnwerk', t: 'Maatkasten Lier', d: 'Inbouw-dressing en TV-meubel in gerookte eik.' },
  { img: svcInterieur, tag: 'Keuken', t: 'Maatkeuken Antwerpen', d: 'Gefineerde noten met composiet werkblad en geïntegreerde toestellen.' },
  { img: cAfwerking, tag: 'Trappen', t: 'Stalen trap Mechelen', d: 'Maatwerktrap in zwart staal met massieve eiken treden.' },
];

const badkamer: Card[] = [
  { img: svcBad, tag: 'Wellness', t: 'Wellnesssuite Leuven', d: 'Walk-in douche, hammam, dubbele wastafel en maatkast, 4 weken.' },
  { img: dakRaam, tag: 'Zolderbadkamer', t: 'Zolder Mechelen', d: 'Inbouw onder dakkapel met dakraam, microcement en zwevend toilet.' },
  { img: cAfwerking, tag: 'Familiebadkamer', t: 'Familiebadkamer Lier', d: 'Bad + inloopdouche, tegelwerk grootformaat, regendouche. 3 weken.' },
  { img: cAanbouw, tag: 'Compact', t: 'Gastenbadkamer Boom', d: 'Volledige strip & rebuild op 4 m² met zwevend meubel. 10 dagen.' },
  { img: svcBad, tag: 'Master', t: 'Master ensuite Bonheiden', d: 'Vrijstaand bad, dubbele inloopdouche en walk-in dressing. 5 weken.' },
  { img: eKalk, tag: 'Microcement', t: 'Microcementbadkamer Antwerpen', d: 'Naadloze microcement-afwerking op wanden en vloer, mat en warm.' },
];

const gevel: Card[] = [
  { img: svcGevel, tag: 'Witte crepi', t: 'HOB Boom', d: 'Geïsoleerde gevel met witte siliconen-crepi. 4 weken.' },
  { img: cTotaal, tag: 'Grijze crepi', t: 'Nieuwbouw Mechelen', d: 'Antraciet crepi met zwart aluminium schrijnwerk.' },
  { img: dakIso, tag: 'Buitenisolatie', t: 'ETICS Antwerpen', d: 'Volledige na-isolatie met EPS + minerale crepi. EPC sprong van D → B.' },
  { img: cNieuw, tag: 'Steenstrips', t: 'Steenstrips Lier', d: 'Geïsoleerde steenstrips Wienerberger met crepi-accent.' },
  { img: about, tag: 'Houten gevel', t: 'Lariks Bonheiden', d: 'Ventileerde gevelbekleding in onbehandeld lariks, vergrijst natuurlijk.' },
  { img: svcGevel, tag: 'Composiet', t: 'Trespa Willebroek', d: 'Composiet gevelplaten Trespa Meteon op aluminium onderconstructie.' },
];

const ecologisch: Card[] = [
  { img: eHout, tag: 'Houtskelet', t: 'CLT-woning Mechelen', d: 'Massief houtbouw (CLT) met houtvezel-isolatie en kalkpleister.' },
  { img: eWarmte, tag: 'Warmtepomp', t: 'Lucht-water Lier', d: 'Hybride warmtepomp + bestaande condensatieketel als backup.' },
  { img: eZon, tag: 'Zonnepanelen', t: 'PV-installatie Boom', d: '24 panelen oost-west met hybride omvormer en thuisbatterij.' },
  { img: eIso, tag: 'Isolatie', t: 'Houtvezel Antwerpen', d: 'Volledig na-isolatieproject met natuurlijke houtvezelplaten.' },
  { img: eVent, tag: 'Ventilatie D', t: 'Systeem D Bonheiden', d: 'Balansventilatie met warmteterugwinning, 92% rendement.' },
  { img: eKalk, tag: 'Kalkpleister', t: 'Bio-renovatie Mechelen', d: 'Natuurlijke kalkpleister op leemstrobouw, dampopen en gezond.' },
];

const filters: Filter[] = [
  { key: 'alle', label: 'Alle projecten',
    imgs: [projReno, dakPannen, svcInterieur, svcBad],
    cards: [renovatie[0], nieuwbouw[0], dakwerken[0], interieur[0], badkamer[0], gevel[0], ecologisch[0], renovatie[1]],
  },
  { key: 'dakwerken', label: 'Dakwerken',
    imgs: [dakPannen, dakEpdm, dakLeien, dakZink], cards: dakwerken },
  { key: 'renovatie', label: 'Renovatie',
    imgs: [projReno, cAfwerking, cAanbouw, cTotaal], cards: renovatie },
  { key: 'nieuwbouw', label: 'Nieuwbouw',
    imgs: [cVilla, cHalfopen, cNieuw, projVilla], cards: nieuwbouw },
  { key: 'interieur', label: 'Interieur',
    imgs: [svcInterieur, cAfwerking, skills, about], cards: interieur },
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
      <div class="lf-svc-grid rz-panel${f.key === 'alle' ? ' active' : ''}" data-rz-panel="${f.key}" style="${f.key === 'alle' ? '' : 'display:none;'}">
        ${f.cards.map(p => `
          <div class="lf-svc-card" data-reveal>
            <div class="lf-svc-img"><img src="${p.img}" alt="${p.t}" loading="lazy"/></div>
            <div class="lf-svc-body">
              <span class="lf-eyebrow" style="margin-bottom:10px;">${p.tag}</span>
              <h4>${p.t}</h4>
              <p>${p.d}</p>
            </div>
          </div>`).join('')}
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
