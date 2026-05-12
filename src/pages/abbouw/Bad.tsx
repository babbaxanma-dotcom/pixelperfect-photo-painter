import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import heroImg from '@/assets/home/svc-bad.jpg';
import imgIntro from '@/assets/bad/intro.jpg';
import imgRuwbouw from '@/assets/bad/ruwbouw.jpg';
import imgTegel from '@/assets/bad/tegelwerk.jpg';
import imgInloop from '@/assets/bad/inloopdouche.jpg';
import imgSanitair from '@/assets/bad/sanitair.jpg';
import imgWellness from '@/assets/bad/wellness.jpg';

const types = [
  {
    id: 'renovatie', img: imgInloop, tag: 'Renovatie',
    title: 'Volledige badkamerrenovatie',
    intro: 'Van strip tot eerste douche in vier weken. Eén planning, één projectleider, één vaste prijs voor de hele werf.',
    specs: [
      ['Doorlooptijd', '4 weken (gemiddeld)'],
      ['Inhoud', 'Sanitair, leidingen, tegels, kasten, verlichting'],
      ['Tegels', 'Grootformaat porcelain of natuursteen'],
      ['Garantie', '10 jaar waterdichtheid'],
      ['Prijs', 'Vanaf €15.000 (vaste prijs)'],
    ],
    bullets: [
      'Eigen tegelzetter, loodgieter en elektricien',
      'Inloopdouche met lineaire afvoer',
      'Wandnis voor shampoo standaard inbegrepen',
      'Zwarte of geborstelde inox kranen op vraag',
    ],
  },
  {
    id: 'tegelwerk', img: imgTegel, tag: 'Afwerking',
    title: 'Tegelwerk &amp; vloeren',
    intro: 'Grootformaat tegels, mozaïek of natuursteen. Strak gevoegd, met inox of alu profielen op de hoeken.',
    specs: [
      ['Formaten', 'Tot 120×120 cm grootformaat'],
      ['Materialen', 'Porselein, natuursteen, mozaïek'],
      ['Voegen', '1,5 / 2 / 3 mm op kleur'],
      ['Onderlaag', 'Egalisatie en afdichting inbegrepen'],
      ['Doorlooptijd', '5 tot 10 werkdagen'],
    ],
    bullets: [
      'Vlakheid tot binnen 2 mm/2 m',
      'Afdichtingsmembraan onder elke tegel',
      'Inox of zwarte profielen op de hoeken',
      'Schoon tot in de silicone-voeg',
    ],
  },
  {
    id: 'sanitair', img: imgSanitair, tag: 'Sanitair',
    title: 'Sanitair &amp; meubels',
    intro: 'Wastafels, badmeubels en kranen, ofwel uit ons assortiment, ofwel uw eigen keuze. We werken met vaste, kwaliteitsvolle merken.',
    specs: [
      ['Wastafels', 'Onderbouw, opbouw of solid surface'],
      ['Kranen', 'Mat zwart, chroom of geborsteld inox'],
      ['Meubels', 'Eikfineer, melamine of gelakt MDF'],
      ['Spiegels', 'Frameloos, met indirecte LED'],
      ['Levertijd', '3 tot 5 weken'],
    ],
    bullets: [
      'Zelf materialen aankopen toegestaan',
      'Wandinbouwspoelers voor het toilet',
      'Geluidsdempende afvoeren',
      'LED-verlichting op dimmer',
    ],
  },
  {
    id: 'wellness', img: imgWellness, tag: 'Wellness',
    title: 'Wellness &amp; hammam',
    intro: 'Voor wie een eigen wellnesshoek wil: stoomcabine, hammam of infrarood. Ingewerkt in de badkamer of als losse ruimte.',
    specs: [
      ['Types', 'Stoom · hammam · infrarood'],
      ['Bekleding', 'Glas-mozaïek of natuursteen'],
      ['Verlichting', 'Indirecte LED, op kleur in te stellen'],
      ['Bediening', 'Touchpaneel of app'],
      ['Doorlooptijd', '5 tot 7 weken'],
    ],
    bullets: [
      'Volledige waterdichting tot 100°C',
      'Geluidsisolatie van de techniekenruimte',
      'Banken op maat met verwarming',
      'Geïntegreerde aroma-doseerunit op vraag',
    ],
  },
];

const HTML = `
${buildNav('diensten')}

${buildHero({
  bg: heroImg,
  eyebrow: '05 · Badkamers & wellness',
  title: 'Sleutel-op-de-deur badkamers,<br/>klaar in <span style="color:var(--accent)">vier weken</span>.',
  lede: 'Premium tegels, sanitair en maatkasten, geplaatst door <span class="ab-hl" data-hl-delay="0">één vaste ploeg</span>. Van strip tot eerste douche: <span class="ab-hl" data-hl-delay="1">één coördinatie, één eindfactuur</span>.',
  primary: { label: 'Vraag plaatsbezoek aan', href: '/contact' },
  secondary: { label: 'Bekijk realisaties →', href: '/realisaties' },
})}

<!-- INTRO -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">AB Bad &amp; Wellness</span>
        <h2 class="lf-h2">Eén ploeg,<br/><span class="ab-mark">één eindresultaat</span>.</h2>
        <p class="lf-lede">In een badkamer komen alle vakgebieden samen: loodgieterij, elektriciteit, tegelwerk, schrijnwerk en sanitair. <span class="ab-hl" data-hl-delay="0">Wij houden alles in eigen hand</span>. Daardoor staat uw badkamer er <span class="ab-hl" data-hl-delay="1">na vier weken</span>, niet na vier maanden.</p>
        <ul class="ab-checks" style="margin-top:18px;">
          <li>Eigen tegelzetter, loodgieter en elektricien</li>
          <li>Vaste prijs op basis van 3D-ontwerp</li>
          <li>Eigen materialen toegestaan, vrije keuze</li>
          <li>10 jaar garantie waterdichtheid</li>
        </ul>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgIntro}" alt="Afgewerkte moderne badkamer" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- TOC -->
<section class="lf-section" style="padding: 0 0 12px;">
  <div class="wrap">
    <div class="ab-toc-wrap">
      <nav class="ab-toc" aria-label="Type badkamerwerken">
        ${types.map(t => `<a href="#${t.id}">${t.title.replace('&amp;', '&')}</a>`).join('')}
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
          <div class="dak-card-img"><img src="${t.img}" alt="${t.title.replace('&amp;', '&')}" loading="lazy"/><span class="dak-card-tag">${t.tag}</span></div>
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

<!-- VIER WEKEN STRIP-OUT -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Hoe lukt 4 weken?</span>
        <h2 class="lf-h2">Omdat alle vakken<br/>onder één dak zitten.</h2>
        <p class="lf-lede">Een gemiddelde badkamerrenovatie duurt bij een algemene aannemer 8 tot 12 weken, omdat elke vakman op zijn beurt moet wachten. Bij ons werken loodgieter, tegelzetter en elektricien parallel, met dagelijkse afstemming op de werf.</p>
        <ul class="ab-checks" style="margin-top:18px;">
          <li>Week 1: strip-out, leidingen, dampscherm</li>
          <li>Week 2: chape, tegels vloer en wand</li>
          <li>Week 3: voegen, sanitair, meubels</li>
          <li>Week 4: kranen, silicone, oplevering</li>
        </ul>
      </div>
      <div data-reveal data-reveal-delay="1"><img src="${imgRuwbouw}" alt="Badkamer in ruwbouwfase" loading="lazy" style="width:100%; border-radius: 16px; aspect-ratio: 4/3; object-fit: cover;"/></div>
    </div>
  </div>
</section>

<!-- PROCES -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Hoe we te werk gaan</span>
      <h2 class="lf-h2">Van plaatsbezoek<br/>tot eerste douche.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal><div class="ab-flow-num">STAP 01</div><h5>Plaatsbezoek</h5><p>Opmeten met laser, wensen en budget bespreken.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1"><div class="ab-flow-num">STAP 02</div><h5>3D-ontwerp</h5><p>Visualisatie van uw nieuwe badkamer, inclusief kleurstaal.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2"><div class="ab-flow-num">STAP 03</div><h5>Materialen</h5><p>Tegels en sanitair gekozen in showroom of via uw keuze.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3"><div class="ab-flow-num">STAP 04</div><h5>Werf 4 weken</h5><p>Eén doorlopende werf, dagelijkse opkuis, eindcontrole.</p></div>
    </div>
  </div>
</section>

<!-- WAT INBEGREPEN -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Bij elke badkamer</span>
      <h2 class="lf-h2">Wat altijd in onze prijs zit.</h2>
    </div>
    <div class="ab-incl ab-incl-single">
      <div class="ab-incl-card yes" data-reveal>
        <h4>Standaard inbegrepen</h4>
        <ul>
          <li>Plaatsbezoek en opmeting met laser</li>
          <li>3D-ontwerp en moodboard</li>
          <li>Strip-out en afvoer van bouwafval</li>
          <li>Volledige nieuwe leidingen (hot/cold/afvoer)</li>
          <li>Afdichtingsmembraan onder tegels</li>
          <li>Hoekprofielen, plinten en silicone op kleur</li>
          <li>Waterdichtheidstest na oplevering</li>
          <li>10 jaar garantie waterdichtheid</li>
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
      <h2 class="lf-h2">Over badkamers.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Echt klaar in 4 weken?</summary><div class="ab-faq-body"><p>Ja, omdat alle disciplines (loodgieter, elektricien, tegelzetter) bij ons in huis zitten en parallel werken. We bezorgen vooraf een dag-per-dag planning.</p></div></details>
      <details data-reveal><summary>Wat kost een gemiddelde badkamer?</summary><div class="ab-faq-body"><p>Vanaf €15.000 voor een standaard renovatie. Premium uitvoering loopt op tot €40.000+. Bij plaatsbezoek krijgt u een vaste prijs op basis van 3D-ontwerp.</p></div></details>
      <details data-reveal><summary>Mag ik mijn eigen tegels of sanitair kiezen?</summary><div class="ab-faq-body"><p>Uiteraard. We adviseren onze partners maar u bent vrij om bij eender welke leverancier te kopen. Wij plaatsen het.</p></div></details>
      <details data-reveal><summary>Welke garantie krijg ik?</summary><div class="ab-faq-body"><p>10 jaar waterdichtheid, 2 jaar afwerking, plus de fabrieksgarantie op sanitair (vaak 5 tot 10 jaar).</p></div></details>
    </div>
  </div>
</section>

${buildCta('Plan uw badkamerrenovatie', 'Vraag een gratis plaatsbezoek aan. Binnen één werkdag krijgt u antwoord met richtprijs en mogelijke startdatum.')}

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

export default function Bad() {
  useEffect(() => {
    document.title = 'AB Bad & Wellness, badkamerrenovatie in 4 weken | AB Bouw Group';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Sleutel-op-de-deur badkamers en wellness, klaar in vier weken. Eigen tegelzetter, loodgieter en elektricien. Vaste prijs op 3D-ontwerp.');
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
