import { useEffect } from 'react';
import '@/styles/roofpro.css';
// hero-werkwijze.jpg was een geposeerde stockfoto (twee mannen die omhoog wijzen)
import hero from '@/assets/home/hero-diensten.jpg';
// De acht stapfoto's zijn eruit (aug 2026, op vraag van Mohammed): AI-beelden
// met mensen erop, en mensen overtuigend genereren lukt niet. De stapkaarten
// zijn nu tekst; het nummer draagt de kaart.
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

const STAPPEN = [
  { n: '01', t: 'Eerste contact', tag: 'Dag 1 tot 2',
    d: 'U belt of vult het formulier in. We bellen terug om te horen wat u van plan bent en spreken een moment af voor het plaatsbezoek.' },
  { n: '02', t: 'Plaatsbezoek', tag: 'Week 1',
    d: 'We komen langs, meten op en fotograferen de bestaande toestand. U hoort ter plaatse al welke aanpak realistisch is.' },
  { n: '03', t: 'Offerte', tag: 'Week 2 tot 3',
    d: 'U krijgt een offerte waarin elke post apart staat: afbraak, materiaal, uitvoering en afvoer. We nemen ze samen door.' },
  { n: '04', t: 'Voorbereiding', tag: 'Week 3 en verder',
    d: 'Materiaal bestellen, ploegen inplannen en waar nodig vergunning en EPB regelen. U krijgt de startdatum op papier.' },
  { n: '05', t: 'Uitvoering', tag: 'Duur hangt af van het werk',
    d: 'De werfleider volgt de planning op en stuurt wekelijks een werfrapport. De werf gaat elke vrijdag opgeruimd het weekend in.' },
  { n: '06', t: 'Voor-oplevering', tag: 'Laatste week',
    d: 'We lopen samen rond en zetten de laatste punten op een lijst. Die werken we af voor de officiële oplevering.' },
  { n: '07', t: 'Oplevering', tag: 'Sleuteldag',
    d: 'Rondgang, sleuteloverdracht en het dossier: garanties, attesten en de gegevens van de gebruikte materialen.' },
  { n: '08', t: 'Nazorg', tag: 'Twaalf maanden',
    d: 'Merkt u in het eerste jaar iets op, dan komen we kijken. Uw werfleider blijft in die periode uw aanspreekpunt.' },
];

const HTML = () => `<div class="rp">
${rpNav('/werkwijze')}

<section class="rp-phero rp-phero--foto">
  <div class="rp-phero__bg" aria-hidden="true">
    <img src="${hero}" alt="" width="1920" height="620" fetchpriority="high" decoding="async"/>
    <span class="rp-phero__veil"></span>
  </div>
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Werkwijze</span></nav>
    <span class="rp-eyebrow">${ic.mark} Werkwijze</span>
    <h1 class="rp-phero__t">Acht stappen<span class="rp-dim">van telefoon tot nazorg</span></h1>
    <p class="rp-phero__lede">Hieronder staat wat er in welke volgorde gebeurt, en wanneer u van ons hoort. Zo weet u op elk moment waar uw dossier staat.</p>
    <div style="margin-top:30px;display:flex;flex-wrap:wrap;gap:12px">
      <a class="rp-btn rp-btn--primary" href="/contact">Start bij stap 1</a>
      <a class="rp-btn rp-btn--ghost" href="${CONTACT.phone.href}">${ic.phone(17)} ${CONTACT.phone.display}</a>
    </div>
  </div>
</section>


<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-steps">
      ${STAPPEN.map((s) => `
      <article class="rp-step rp-step--tekst">
        <div class="rp-step__body">
          <div class="rp-step__n">${s.n}</div>
          <h2 class="rp-step__t">${s.t}</h2>
          <p class="rp-step__d">${s.d}</p>
          <p class="rp-step__tijd">${s.tag}</p>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="rp-cta">
  <div class="rp-wrap">
    <div class="rp-cta__box" style="min-height:270px">
      <div class="rp-cta__bg" aria-hidden="true">
        <img src="${hero}" alt="" width="1200" height="420" loading="lazy" decoding="async"/>
        <span class="rp-cta__veil"></span>
      </div>
      <div class="rp-cta__inner">
        <h2 class="rp-cta__t">Klaar voor stap 1?</h2>
        <p class="rp-cta__p">Het plaatsbezoek en de offerte erna zijn kosteloos. U beslist daarna of u verdergaat.</p>
        <div style="margin-top:26px;display:flex;flex-wrap:wrap;gap:12px">
          <a class="rp-btn rp-btn--primary" href="/contact">Plan een plaatsbezoek</a>
          <a class="rp-btn rp-btn--ghost" href="${CONTACT.phone.href}" style="color:#fff;border-color:rgba(255,255,255,.34)">${ic.phone(17)} ${CONTACT.phone.display}</a>
        </div>
        <div style="margin-top:20px">
          <span class="rp-proofchip">
            <span class="rp-proofchip__sterren" aria-hidden="true">${ic.star(13).repeat(5)}</span>
            <span class="rp-proofchip__t">4,9 op Google &middot; 120+ woningen gerenoveerd</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Werkwijze() {
  useEffect(() => {
    document.title = 'Werkwijze — AB Bouw Groep';
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
