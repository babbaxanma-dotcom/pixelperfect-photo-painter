import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import heroImg from '@/assets/home/svc-eco.jpg';
import imgIntro from '@/assets/eco/intro.jpg';
import imgWarmtepomp from '@/assets/eco/warmtepomp.jpg';
import imgIsolatie from '@/assets/eco/isolatie.jpg';
import imgHoutskelet from '@/assets/eco/houtskelet.jpg';
import imgZonnepanelen from '@/assets/eco/zonnepanelen.jpg';
import imgKalk from '@/assets/eco/kalk.jpg';
import imgVentilatie from '@/assets/eco/ventilatie.jpg';

const types = [
  {
    id: 'warmtepomp', img: imgWarmtepomp, tag: 'Technieken',
    title: 'Warmtepompen',
    intro: 'Lucht-water warmtepompen voor renovatie en nieuwbouw, correct gedimensioneerd op woning en verbruik.',
    specs: [
      ['Type', 'Lucht-water'],
      ['Toepassing', 'Nieuwbouw & renovatie'],
      ['Afgifte', 'Vloerverwarming / lage temperatuur'],
      ['Premie', 'Mijn VerbouwPremie'],
      ['Rendement', 'SCOP tot 4,8'],
    ],
    bullets: [
      'Dimensionering op warmteverliesberekening',
      'Combinatie met sanitair warm water',
      'Stille buitenunit met correcte plaatsing',
      'Premiedossier mee opgenomen',
    ],
  },
  {
    id: 'isolatie', img: imgIsolatie, tag: 'Schil',
    title: 'Natuurlijke isolatie',
    intro: 'Cellulose, houtvezel en dampopen opbouwen voor een stabieler binnenklimaat en betere zomerbuffer.',
    specs: [
      ['Materialen', 'Cellulose, houtvezel'],
      ['Toepassing', 'Dak, wand, vloer'],
      ['Eigenschap', 'Dampopen & vochtregulerend'],
      ['Premie', 'Tot €40/m² afhankelijk van pakket'],
      ['Doel', 'EPC-sprong + comfort'],
    ],
    bullets: [
      'Sterke akoestische prestaties',
      'Betere bescherming tegen oververhitting',
      'Geschikt voor renovatie en houtskelet',
      'Advies per bestaande opbouw',
    ],
  },
  {
    id: 'houtskelet', img: imgHoutskelet, tag: 'Structuur',
    title: 'Houtskelet & CLT',
    intro: 'Droge, snelle bouwmethode voor opbouw, uitbreiding en volledige nieuwbouw met hoge isolatiewaarden.',
    specs: [
      ['Type', 'Houtskelet of CLT'],
      ['Voordeel', 'Snelle droge bouw'],
      ['Isolatie', 'In de wandopbouw geïntegreerd'],
      ['Toepassing', 'Nieuwbouw, opbouw, uitbreiding'],
      ['Planning', 'Korte werftijd'],
    ],
    bullets: [
      'Lichte constructie, ideaal voor opbouwen',
      'Korte open werfperiode',
      'Maatwerk prefab mogelijk',
      'Combineerbaar met gevelbekleding of steenstrip',
    ],
  },
  {
    id: 'zonnepanelen', img: imgZonnepanelen, tag: 'Energie',
    title: 'Zonnepanelen',
    intro: 'PV-installaties als onderdeel van een totaalplan, afgestemd op dak, verbruik en toekomstige warmtepomp.',
    specs: [
      ['Type', 'Monokristallijn zwart'],
      ['Plaatsing', 'Hellend of plat dak'],
      ['Doel', 'Zelfverbruik maximaliseren'],
      ['Opties', 'Batterij / laadpaal'],
      ['Rendement', 'Afhankelijk van oriëntatie'],
    ],
    bullets: [
      'Legplan op maat van uw dakvlak',
      'Aandacht voor bekabeling en doorvoeren',
      'Voorbereid op warmtepomp en laadpaal',
      'Esthetisch ingepast in het dakbeeld',
    ],
  },
  {
    id: 'kalk', img: imgKalk, tag: 'Afwerking',
    title: 'Kalkpleister & natuurlijke afwerking',
    intro: 'Dampopen binnenafwerking met rustige textuur, gezond binnenklimaat en een warme, eerlijke uitstraling.',
    specs: [
      ['Type', 'Kalkpleister'],
      ['Eigenschap', 'Vochtregulerend'],
      ['Look', 'Mat, mineraal, zacht'],
      ['Toepassing', 'Wanden en plafonds'],
      ['Combinatie', 'Ideaal met bio-ecologische opbouw'],
    ],
    bullets: [
      'Natuurlijke, rustige uitstraling',
      'Past bij renovatie én nieuwbouw',
      'Dampopen systeemopbouw',
      'Minder synthetische afwerking in huis',
    ],
  },
  {
    id: 'ventilatie', img: imgVentilatie, tag: 'Binnenklimaat',
    title: 'Ventilatie D',
    intro: 'Gebalanceerde ventilatie met warmterecuperatie voor gezonde lucht zonder onnodig warmteverlies.',
    specs: [
      ['Type', 'Systeem D'],
      ['Functie', 'Toevoer + afvoer met WTW'],
      ['Toepassing', 'Nieuwbouw & grondige renovatie'],
      ['Voordeel', 'Comfort en energie-efficiëntie'],
      ['Onderhoud', 'Filterwissel periodiek'],
    ],
    bullets: [
      'Correct debiet per ruimte berekend',
      'Strakke integratie in techniekenruimte',
      'Minder vocht- en geurproblemen',
      'Belangrijk onderdeel van BEN-aanpak',
    ],
  },
];

const HTML = `
${buildNav('diensten')}

${buildHero({
  bg: heroImg,
  eyebrow: '02 · Duurzaam bouwen',
  title: 'Slim isoleren,<br/><span style="color:var(--accent)">duurzaam wonen</span>.',
  lede: 'AB Ecologisch bundelt <span class="ab-hl" data-hl-delay="0">isolatie, warmtepomp en ventilatie</span> in één <span class="ab-hl" data-hl-delay="1">logisch totaalplan</span>.',
  primary: { label: 'Vraag plaatsbezoek aan', href: '/contact' },
  secondary: { label: 'Bekijk realisaties →', href: '/realisaties' },
})}

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">AB Ecologisch</span>
        <h2 class="lf-h2">Bouwen voor<br/>de volgende generatie.</h2>
        <p class="lf-lede">Een ecologisch huis is geen gimmick. Het is een slimmer totaalpakket: betere schil, lagere energiefactuur en een gezonder binnenklimaat.</p>
        <ul class="ab-checks" style="margin-top:18px;">
          <li>Eén plan voor isolatie, technieken en afwerking</li>
          <li>E-peil en premie-impact vooraf besproken</li>
          <li>Dampopen en duurzame opbouwen waar zinvol</li>
          <li>Praktisch advies, niet ideologisch</li>
        </ul>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgIntro}" alt="Ecologische woning" loading="lazy"/></div>
    </div>
  </div>
</section>

<section class="lf-section" style="padding: 0 0 12px;">
  <div class="wrap">
    <div class="ab-toc-wrap">
      <nav class="ab-toc" aria-label="Type ecologische werken">
        ${types.map(t => `<a href="#${t.id}">${t.title}</a>`).join('')}
      </nav>
    </div>
  </div>
</section>

<section class="lf-section" style="padding-top: 24px;">
  <div class="wrap">
    <div class="dak-grid">
      ${types.map(t => `
        <article class="dak-card" id="${t.id}" data-reveal>
          <div class="dak-card-img"><img src="${t.img}" alt="${t.title}" loading="lazy"/><span class="dak-card-tag">${t.tag}</span></div>
          <div class="dak-card-body">
            <h3>${t.title}</h3>
            <p>${t.intro}</p>
            <ul class="ab-checks" style="margin: 14px 0 0;">
              ${t.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
            <details class="ab-more" style="margin-top: 16px;">
              <summary>Specificaties bekijken</summary>
              <table class="dak-spec"><tbody>
                ${t.specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
              </tbody></table>
            </details>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Hoe we denken</span>
      <h2 class="lf-h2">Eerst de schil,<br/>dan de technieken.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal><div class="ab-flow-num">STAP 01</div><h5>Audit</h5><p>We bekijken warmteverlies, huidige opbouw en renovatiepotentieel.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1"><div class="ab-flow-num">STAP 02</div><h5>Plan</h5><p>We bepalen welke combinatie van isolatie en technieken echt rendeert.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2"><div class="ab-flow-num">STAP 03</div><h5>Uitvoering</h5><p>Schil, ventilatie, warmtepomp en afwerking worden op elkaar afgestemd.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3"><div class="ab-flow-num">STAP 04</div><h5>Nazorg</h5><p>EPB, premieaanvraag en afregeling worden mee opgevolgd.</p></div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Bij elk ecologisch traject</span>
      <h2 class="lf-h2">Wat altijd in onze prijs zit.</h2>
    </div>
    <div class="ab-incl ab-incl-single">
      <div class="ab-incl-card yes" data-reveal>
        <h4>Standaard inbegrepen</h4>
        <ul>
          <li>Plaatsbezoek en intakegesprek</li>
          <li>Advies over schil, technieken en volgorde van werken</li>
          <li>Eerlijke premie-inschatting vooraf</li>
          <li>Materiaaladvies op basis van woningtype</li>
          <li>Afstemming met EPB-verslaggever</li>
          <li>Coördinatie tussen isolatie en technieken</li>
          <li>Premiedossier mee opgenomen</li>
          <li>Oplevering met duidelijke uitleg</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Veelgestelde vragen</span>
      <h2 class="lf-h2">Over ecologisch bouwen.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Is ecologisch bouwen veel duurder?</summary><div class="ab-faq-body"><p>Niet altijd. Sommige keuzes zijn duurder in aankoop, maar leveren meer comfort en een lagere energiefactuur op. Wij tonen vooraf waar het verschil echt zit.</p></div></details>
      <details data-reveal><summary>Werken jullie ook met houtskelet?</summary><div class="ab-faq-body"><p>Ja. Voor nieuwbouw, opbouw en uitbreidingen is houtskelet of CLT vaak een heel slimme keuze.</p></div></details>
      <details data-reveal><summary>Kan dit ook bij renovatie?</summary><div class="ab-faq-body"><p>Zeker. Bij renovatie is de juiste volgorde het belangrijkst: eerst de schil verbeteren, daarna technieken vervangen.</p></div></details>
      <details data-reveal><summary>Welke premies zijn er?</summary><div class="ab-faq-body"><p>Dat hangt af van inkomen, woningtype en gekozen werken. Wij geven vooraf een realistische inschatting en nemen het dossier mee op.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Plan uw ecologisch traject', 'Vraag een vrijblijvend plaatsbezoek aan. We bekijken welke ingrepen echt het meeste rendement geven voor uw woning.')}

${FOOTER}

<style>
.dak-grid { display: grid; grid-template-columns: 1fr; gap: 36px; }
.dak-card { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 18px; overflow: hidden; display: grid; grid-template-columns: 1fr 1.2fr; align-items: start; box-shadow: 0 14px 40px -28px rgba(10,22,40,0.18); transition: box-shadow 0.3s, transform 0.3s; }
.dak-card:hover { box-shadow: 0 24px 60px -28px rgba(10,22,40,0.28); transform: translateY(-2px); }
.dak-card:nth-child(even) { grid-template-columns: 1.2fr 1fr; }
.dak-card:nth-child(even) .dak-card-img { order: 2; }
.dak-card-img { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.dak-card-img img { width:100%; height:100%; object-fit: cover; display:block; transition: transform 0.6s var(--ease); }
.dak-card:hover .dak-card-img img { transform: scale(1.04); }
.dak-card-tag { position: absolute; top: 18px; left: 18px; padding: 6px 12px; background: #fff; color: var(--navy); border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; box-shadow: 0 6px 16px -4px rgba(10,22,40,0.25); }
.dak-card-body { padding: 36px 40px; display:flex; flex-direction:column; }
.dak-card-body h3 { font-family: var(--font-display); font-size: clamp(22px, 2.4vw, 28px); color: var(--navy); margin-bottom: 12px; font-weight: 600; letter-spacing: -0.01em; }
.dak-card-body > p { font-size: 14.5px; color: var(--ink-soft); line-height: 1.7; margin-bottom: 4px; }
.dak-spec { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: auto; border-top: 1px solid var(--ink-line-soft); }
.dak-spec td { padding: 9px 0; border-bottom: 1px dashed var(--ink-line-soft); vertical-align: top; }
.dak-spec tr:last-child td { border-bottom: none; }
.dak-spec td:first-child { color: var(--ink-mute); font-weight: 600; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; width: 42%; padding-right: 12px; }
.dak-spec td:last-child { color: var(--navy); font-weight: 500; }
@media (max-width: 900px) {
  .dak-card, .dak-card:nth-child(even) { grid-template-columns: 1fr; }
  .dak-card:nth-child(even) .dak-card-img { order: 0; }
  .dak-card-img { min-height: 240px; }
  .dak-card-body { padding: 28px 24px; }
}
</style>
`;

export default function Ecologisch() {
  useEffect(() => {
    document.title = 'AB Ecologisch, duurzaam bouwen en renoveren | AB Bouw Group';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Warmtepompen, natuurlijke isolatie, houtskelet, zonnepanelen, kalkpleister en ventilatie in één duurzaam totaalplan.');
    const prev = document.body.className;
    document.body.className = '';
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prev; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
