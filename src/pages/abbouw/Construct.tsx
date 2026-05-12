import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import heroImg from '@/assets/home/svc-construct.jpg';
import imgIntro from '@/assets/construct/intro-villa.jpg';
import imgNieuwbouw from '@/assets/construct/nieuwbouw.jpg';
import imgTotaal from '@/assets/construct/totaal.jpg';
import imgAanbouw from '@/assets/construct/aanbouw.jpg';
import imgRuwbouw from '@/assets/construct/ruwbouw.jpg';
import imgTechnieken from '@/assets/construct/technieken.jpg';
import imgAfwerking from '@/assets/construct/afwerking.jpg';
import imgHalfopen from '@/assets/construct/halfopen.jpg';

const types = [
  {
    id: 'nieuwbouw', img: imgNieuwbouw, tag: 'Sleutel-op-de-deur',
    title: 'Nieuwbouw woningen',
    intro: 'Vrijstaand, halfopen of rij. Eén contract, één projectleider, sleutel-op-de-deur of casco.',
    specs: [
      ['Type', 'Vrijstaand, HOB, rijwoning'],
      ['Oplevering', 'Casco of instapklaar'],
      ['E-peil', 'Standaard E30, optie BEN'],
      ['Doorlooptijd', '8 tot 14 maanden'],
      ['Garantie', '10 jaar (Wet Breyne)'],
    ],
    bullets: [
      'Vaste prijs met meetstaat per lot',
      'Hout- of massiefbouw bespreekbaar',
      'Begeleiding architect of eigen netwerk',
      'Keuze materialen op vast budget',
    ],
  },
  {
    id: 'totaal', img: imgTotaal, tag: 'Renovatie',
    title: 'Totaalrenovatie',
    intro: 'Strip-and-rebuild van een bestaande woning. Wij coördineren ruwbouw, technieken én afwerking onder één dak.',
    specs: [
      ['Aanpak', 'Casco-strippen tot draagstructuur'],
      ['Technieken', 'Volledig vernieuwd'],
      ['Isolatie', 'Dak, gevel en vloer in één'],
      ['Doorlooptijd', '4 tot 7 maanden'],
      ['Premie', 'Mijn VerbouwPremie inbegrepen'],
    ],
    bullets: [
      'Bewoonbaarheidsplan: in welke fase u kunt blijven',
      'Asbestinventaris en sanering inbegrepen',
      'Indien nodig: stabiliteitsstudie',
      'EPC-sprong gemiddeld 2 labels',
    ],
  },
  {
    id: 'aanbouw', img: imgAanbouw, tag: 'Uitbreiding',
    title: 'Aan- en uitbouw',
    intro: 'Een extra leefruimte, veranda of opbouw. Naadloos aangesloten op het bestaande, met aandacht voor licht en isolatie.',
    specs: [
      ['Types', 'Aanbouw, opbouw, veranda'],
      ['Constructie', 'Massief of houtskelet'],
      ['Vergunning', 'Wij regelen het dossier'],
      ['Doorlooptijd', '8 tot 16 weken'],
      ['Glas', 'Driedubbele beglazing standaard'],
    ],
    bullets: [
      'Schuifpuien tot 6 m breed',
      'Plat dak in EPDM met optionele groendak',
      'Vloerverwarming inbegrepen',
      'Lichtstudie voor maximale daglichttoetreding',
    ],
  },
  {
    id: 'halfopen', img: imgHalfopen, tag: 'Casco',
    title: 'Casco bouwen',
    intro: 'Voor wie zelf afwerkt of een andere afwerker heeft. Wij leveren winddicht en wettelijk in orde af, u doet de finishing touch.',
    specs: [
      ['Niveau', 'Casco of casco+'],
      ['Inclusief', 'Ruwbouw, dak, schrijnwerk'],
      ['Optioneel', 'Chape, technieken, pleisterwerk'],
      ['Doorlooptijd', '6 tot 10 maanden'],
      ['Voordelen', 'Lager budget, eigen inbreng'],
    ],
    bullets: [
      'EPB-aangifte en E-peil-berekening inbegrepen',
      'Winddicht opgeleverd, klaar voor afwerking',
      'Optioneel: enkel ruwbouw of ruwbouw + dak',
      'Heldere overdracht naar uw afwerker',
    ],
  },
];

const HTML = `
${buildNav('diensten')}

${buildHero({
  bg: heroImg,
  eyebrow: '01 · Algemene aanneming',
  title: 'Coördineren, bouwen,<br/><span style="color:var(--accent)">realiseren</span>.',
  lede: 'AB Construct neemt de <span class="ab-hl" data-hl-delay="0">volledige coördinatie</span> van uw bouw of renovatie op zich. <span class="ab-hl" data-hl-delay="1">Eén projectleider, één planning, één eindfactuur</span>.',
  primary: { label: 'Vraag plaatsbezoek aan', href: '/contact' },
  secondary: { label: 'Bekijk realisaties →', href: '/realisaties' },
})}

<!-- INTRO + USP -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">AB Construct</span>
        <h2 class="lf-h2">Eén contract,<br/>één resultaat.</h2>
        <p class="lf-lede">U tekent met één partij. Wij coördineren ruwbouw, technieken en afwerking met eigen ploegen.</p>
        <ul class="ab-checks" style="margin-top:18px;">
          <li>Bindende offerte met meetstaat</li>
          <li>10 jaar wettelijke aansprakelijkheid</li>
          <li>Wekelijks fotoverslag van de werf</li>
          <li>Meerwerk enkel na schriftelijke goedkeuring</li>
        </ul>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgIntro}" alt="Vrijstaande nieuwbouw" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- TOC -->
<section class="lf-section" style="padding: 0 0 12px;">
  <div class="wrap">
    <div class="ab-toc-wrap">
      <nav class="ab-toc" aria-label="Type bouwprojecten">
        ${types.map(t => `<a href="#${t.id}">${t.title}</a>`).join('')}
      </nav>
    </div>
  </div>
</section>

<!-- TYPES -->
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
              <table class="dak-spec">
                <tbody>
                  ${t.specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
                </tbody>
              </table>
            </details>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<!-- DRIE FASES VAN DE WERF -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">De werf in 3 fases</span>
      <h2 class="lf-h2">Van funderingsplaat<br/>tot oplevering.</h2>
    </div>
    <div class="dak-grid">
      <article class="dak-card" data-reveal>
        <div class="dak-card-img"><img src="${imgRuwbouw}" alt="Ruwbouw" loading="lazy"/><span class="dak-card-tag">Fase 1</span></div>
        <div class="dak-card-body">
          <h3>Ruwbouw winddicht</h3>
          <p>Funderingen, metselwerk, welfsels en dakstructuur. Eindigt zodra de woning waterdicht en wind­dicht is.</p>
          <table class="dak-spec"><tbody>
            <tr><td>Inhoud</td><td>Fundering, metselwerk, dak, schrijnwerk</td></tr>
            <tr><td>Doorlooptijd</td><td>14 tot 22 weken</td></tr>
            <tr><td>Tussenfactuur</td><td>Per opgeleverde mijlpaal</td></tr>
          </tbody></table>
        </div>
      </article>
      <article class="dak-card" data-reveal>
        <div class="dak-card-img"><img src="${imgTechnieken}" alt="Technieken" loading="lazy"/><span class="dak-card-tag">Fase 2</span></div>
        <div class="dak-card-body">
          <h3>Technieken &amp; isolatie</h3>
          <p>Sanitair, elektriciteit, ventilatie en verwarming. Vloerisolatie, chape en luchtdichtheidstest voor de afwerking start.</p>
          <table class="dak-spec"><tbody>
            <tr><td>Inhoud</td><td>Sanitair, EL, HVAC, isolatie, chape</td></tr>
            <tr><td>Doorlooptijd</td><td>5 tot 8 weken</td></tr>
            <tr><td>Test</td><td>Blowerdoor &lt; v50 3,0</td></tr>
          </tbody></table>
        </div>
      </article>
      <article class="dak-card" data-reveal>
        <div class="dak-card-img"><img src="${imgAfwerking}" alt="Afwerking" loading="lazy"/><span class="dak-card-tag">Fase 3</span></div>
        <div class="dak-card-body">
          <h3>Afwerking &amp; oplevering</h3>
          <p>Pleisterwerk, vloeren, binnendeuren, keuken en schilderwerk. Eindigt met een rondgang en opleveringsverslag.</p>
          <table class="dak-spec"><tbody>
            <tr><td>Inhoud</td><td>Pleister, vloer, deuren, schilder</td></tr>
            <tr><td>Doorlooptijd</td><td>6 tot 10 weken</td></tr>
            <tr><td>Oplevering</td><td>Met PV en sleutels</td></tr>
          </tbody></table>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- PROCES -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Hoe we te werk gaan</span>
      <h2 class="lf-h2">Van plaatsbezoek tot<br/>nazorg.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal><div class="ab-flow-num">STAP 01</div><h5>Plaatsbezoek</h5><p>Gratis intake binnen 5 werkdagen, met eerste haalbaarheidscheck.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1"><div class="ab-flow-num">STAP 02</div><h5>Offerte &amp; planning</h5><p>Bindende offerte met meetstaat en kalender per fase.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2"><div class="ab-flow-num">STAP 03</div><h5>Vergunning</h5><p>Wij regelen architect, EPB-verslaggever en omgevingsdossier.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3"><div class="ab-flow-num">STAP 04</div><h5>Werf</h5><p>Eigen ploegen, wekelijks fotoverslag, vaste contactpersoon.</p></div>
    </div>
  </div>
</section>

<!-- WAT INBEGREPEN -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Bij elk Construct-project</span>
      <h2 class="lf-h2">Wat altijd in onze prijs zit.</h2>
    </div>
    <div class="ab-incl ab-incl-single">
      <div class="ab-incl-card yes" data-reveal>
        <h4>Standaard inbegrepen</h4>
        <ul>
          <li>Plaatsbezoek en offertegesprek</li>
          <li>Coördinatie met architect en EPB-verslaggever</li>
          <li>Werfinrichting (omheining, container, sanitair)</li>
          <li>Volledige meetstaat per lot</li>
          <li>Wekelijks fotorapport en planning-update</li>
          <li>Veiligheidscoördinator</li>
          <li>10-jarige aansprakelijkheid (Federale Verzekering)</li>
          <li>Opleveringsverslag met fotodocumentatie</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Veelgestelde vragen</span>
      <h2 class="lf-h2">Over algemene aanneming.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Hoe lang duurt een totaalrenovatie?</summary><div class="ab-faq-body"><p>Een rijwoning gemiddeld 4 tot 6 maanden, een grotere woning 6 tot 8 maanden. U krijgt vooraf een gedetailleerde kalender met opleverdatum.</p></div></details>
      <details data-reveal><summary>Wat kost een plaatsbezoek?</summary><div class="ab-faq-body"><p>Niets. Het eerste plaatsbezoek én de offerte zijn gratis en vrijblijvend.</p></div></details>
      <details data-reveal><summary>Krijg ik een vaste prijs?</summary><div class="ab-faq-body"><p>Ja. U krijgt een bindende offerte met gedetailleerde meetstaat. Meerwerk wordt enkel uitgevoerd na uw schriftelijke goedkeuring.</p></div></details>
      <details data-reveal><summary>Welke garantie krijg ik?</summary><div class="ab-faq-body"><p>10 jaar wettelijke aansprakelijkheid op stabiliteit en waterdichtheid (verzekerd via Federale Verzekering), plus 2 jaar op afwerking.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Plan uw bouw of renovatie', 'Vraag een gratis plaatsbezoek aan. Binnen één werkdag krijgt u antwoord van een projectleider.')}

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

export default function Construct() {
  useEffect(() => {
    document.title = "AB Construct, algemene aanneming en sleutel-op-de-deur | AB Bouw Group";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Nieuwbouw, totaalrenovatie, aan- en uitbouw en casco-bouw. Eén projectleider, vaste prijs, eigen ploegen, 10 jaar garantie.");
    const prev = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prev; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
