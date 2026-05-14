import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildHero, SHELL_STYLE } from '../_shell';
import { submitLead } from '@/lib/leads';
import { BLOGS } from '@/data/blogs';

const LP_BLOGS = BLOGS.filter(b =>
  b.tag === 'Gevel' ||
  b.slug === 'gevelrenovatie-crepi-versus-steenstrips' ||
  b.slug === 'na-isolatie-spouw-of-buiten' ||
  b.slug === 'epc-label-c-2028'
).slice(0, 3);

import heroBg from '@/assets/gevel/witte-crepi.jpg';
import imgBenefits from '@/assets/gevel/grijze-crepi.jpg';
import imgProcess from '@/assets/gevel/stelling.jpg';
import g1 from '@/assets/gevel/witte-crepi.jpg';
import g2 from '@/assets/gevel/grijze-crepi.jpg';
import g3 from '@/assets/gevel/steenstrips.jpg';
import g4 from '@/assets/gevel/sierpleister.jpg';
import expertImg from '@/assets/home/team2.jpg';

// Tijdelijke review-avatars — vervang via Bardh's foto's
import rev1 from '@/assets/reviews/sofie.jpg';
import rev2 from '@/assets/reviews/hilde.jpg';
import rev3 from '@/assets/reviews/pieter.jpg';
import rev4 from '@/assets/reviews/ana.jpg';
import rev5 from '@/assets/reviews/katrien.jpg';
import rev6 from '@/assets/reviews/karim.jpg';
import rev7 from '@/assets/reviews/inge.jpg';
import rev8 from '@/assets/reviews/marc.jpg';

const GEVEL_REVIEWS = [
  { name: 'Sofie Vermeulen', role: 'Witte crepi rijwoning · Mechelen', img: rev1, text: 'Gevel ligt er nu twee jaar bij en is nog steeds spierwit. Buurman dacht eerst dat ze geverfd was, want zo strak afgewerkt. Ploeg was supernet — alle struiken afgeplakt, oprit elke avond opgeruimd.' },
  { name: 'Hilde Goossens', role: 'ETICS-isolatie + crepi · Boom', img: rev2, text: 'EPC-label van F naar C in één werk. Stookkost deze winter bijna gehalveerd, het verschil is voelbaar in elke kamer. Premie van €4.800 zoals afgesproken op de rekening, AB Bouw heeft heel het dossier ingediend.' },
  { name: 'Pieter Janssens', role: 'Steenstrips voorgevel · Lier', img: rev3, text: 'We wilden de baksteen-look behouden zonder echte stenen. Steenstrips ziet er authentiek uit, niemand merkt het verschil. Plaatsing perfect, voegen kaarsrecht, aansluitingen rond ramen netjes afgewerkt.' },
  { name: 'Ana Popescu', role: 'Sierpleister marmorino · Bornem', img: rev4, text: 'Marmorino-afwerking in zachte taupe-tint. Niemand in onze straat heeft zoiets, geeft het huis een echt karakter. De vakman gaf advies over kleur dat we zelf nooit zouden gekozen hebben — gelukkig hebben we geluisterd.' },
  { name: 'Katrien Peeters', role: 'Crepi + buitenisolatie · Antwerpen', img: rev5, text: 'Halfopen woning uit 1968, nooit geïsoleerd geweest. Nu 16cm EPS-isolatie + crepi-afwerking. Het hele huis voelt anders aan, vooral in de winter — geen koude muren meer. Zou het meteen weer doen.' },
  { name: 'Karim El Amrani', role: 'Volledige gevelrenovatie · Willebroek', img: rev6, text: 'Oude gevel had veel scheuren en vochtproblemen. Bardh kwam langs, gaf eerlijk advies: eerst herstellen dan crepi, anders gooi je geld weg. Werd uitgevoerd zoals beloofd, factuur exact als offerte.' },
  { name: 'Inge Vermeiren', role: 'Witte crepi nieuwbouw · Kontich', img: rev7, text: 'Nieuwbouw afgewerkt met witte crepi op spouwmuur. Strakke lijn op de hele gevel, geen scheuren of vlekken in afwerking. Plaatsing in 5 dagen voor heel het huis, daarna stelling weg en alles proper.' },
  { name: 'Marc Van den Broeck', role: 'Gevelisolatie + nieuwe crepi · Mechelen', img: rev8, text: 'Eerste aannemer gaf alleen offerte voor crepi alleen, AB Bouw legde uit waarom je ETICS NODIG hebt voor onze woning. Andere prijs maar veel betere oplossing. EPC sprong + comfort, ronduit zalig.' },
];

// Zelfde LP_EXTRA als Dakwerken — gedeeld via gewone import zou cleaner zijn,
// maar voor maintainability staat het hier inline. Bij update: kopieer in beide.
const LP_EXTRA = `
.lp-page .lf-hero-bg img { animation: lp-kenburns 22s ease-out infinite alternate; transform-origin: center center; }
@keyframes lp-kenburns {
  from { transform: scale(1.05) translate3d(0,0,0); }
  to   { transform: scale(1.12) translate3d(-1.2%, -0.8%, 0); }
}
.lp-page .lf-section + .lf-section:not(.lf-tone-soft):not(.lp-form-section)::before {
  content: ''; display: block; width: 56px; height: 1px; background: var(--accent); margin: -1px auto 56px;
}
.lp-sticky-cta { display: none; }
@media (min-width: 901px) {
  .lp-sticky-cta {
    position: fixed; right: 24px; bottom: 24px; z-index: 60;
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 24px; background: var(--accent); color: #fff;
    border-radius: 999px; font-family: var(--font-body); font-weight: 700; font-size: 14px;
    text-decoration: none;
    box-shadow: 0 18px 36px -10px rgba(217,140,3,0.55), 0 4px 12px rgba(0,0,0,0.18);
    opacity: 0; transform: translateY(20px) scale(0.95);
    pointer-events: none;
    transition: opacity .4s ease, transform .4s cubic-bezier(.22,1,.36,1), background .2s ease;
  }
  body.past-hero .lp-sticky-cta { opacity: 1; transform: none; pointer-events: auto; }
  .lp-sticky-cta:hover { background: var(--accent-hover); transform: translateY(-2px) scale(1); }
}
.lp-stat { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1); }
.lp-stat.revealed { opacity: 1; transform: none; }
.lp-gallery-cell { transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease; }
.lp-gallery-cell:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -15px rgba(10,22,40,0.45); }
.lp-form-card input:focus, .lp-form-card textarea:focus {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 3px rgba(217,140,3,0.18), 0 1px 0 0 var(--accent) !important;
}

.lp-bottom-bar { display: none; }
@media (max-width: 900px) {
  .lp-bottom-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 60;
    display: grid; grid-template-columns: 1fr 1.4fr; gap: 8px;
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid var(--ink-line);
  }
  .lp-bottom-bar a { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 16px; border-radius: 999px; font-weight: 700; font-size: 14px; text-decoration: none; }
  .lp-bottom-bar .lp-bb-call { background: var(--navy); color: #fff; }
  .lp-bottom-bar .lp-bb-cta { background: var(--accent); color: #fff; }
  body.lp-page { padding-bottom: 76px; }
}
.lp-trust-foot { padding: 56px 0 80px; background: #fff; border-top: 1px solid var(--ink-line-soft); font-size: 13px; color: var(--ink-mute); }
.lp-trust-foot .wrap { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
.lp-trust-foot strong { display: block; color: var(--navy); font-size: 14px; margin-bottom: 4px; }
.lp-trust-foot a { color: var(--ink-soft); text-decoration: none; }
.lp-trust-foot a:hover { color: var(--accent); }
@media (max-width: 720px) { .lp-trust-foot .wrap { grid-template-columns: 1fr 1fr; gap: 22px; } }
.lp-stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 36px; padding: 56px 0; border-bottom: 1px solid var(--ink-line-soft); }
.lp-stat { position: relative; padding-left: 18px; }
.lp-stat::before { content: ''; position: absolute; left: 0; top: 4px; bottom: 8px; width: 3px; background: var(--accent); }
.lp-stat-num { font-family: var(--font-display); font-size: clamp(28px, 3.2vw, 40px); font-weight: 700; color: var(--navy); letter-spacing: -0.025em; line-height: 1; margin-bottom: 6px; }
.lp-stat-label { font-size: 13.5px; font-weight: 500; color: var(--ink-soft); line-height: 1.45; }
@media (max-width: 900px) { .lp-stats-strip { grid-template-columns: repeat(2, 1fr); gap: 28px 20px; padding: 40px 0; } }
.lp-urgency-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.lp-urgency-card { background: #fff; border: 1px solid var(--ink-line-soft); padding: 28px 26px; border-radius: 14px; transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease; }
.lp-urgency-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 22px 50px -20px rgba(15,17,21,0.22); }
.lp-urgency-num { font-family: var(--font-display); font-weight: 700; font-size: 26px; color: var(--accent); line-height: 1; margin-bottom: 14px; letter-spacing: -0.02em; }
.lp-urgency-card h4 { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--navy); margin: 0 0 8px; letter-spacing: -0.01em; }
.lp-urgency-card p { font-size: 14.5px; color: var(--ink-soft); line-height: 1.55; margin: 0; }
@media (max-width: 900px) { .lp-urgency-grid { grid-template-columns: 1fr; gap: 14px; } }
.lp-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.lp-gallery-cell { position: relative; aspect-ratio: 4/5; overflow: hidden; border-radius: 12px; text-decoration: none; color: inherit; }
.lp-gallery-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.22,1,.36,1); }
.lp-gallery-cell:hover img { transform: scale(1.06); }
.lp-gallery-cell::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(10,22,40,0.85) 100%); pointer-events: none; }
.lp-gallery-cap { position: absolute; left: 18px; bottom: 16px; right: 18px; z-index: 2; color: #fff; }
.lp-gallery-cap small { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.78); margin-bottom: 4px; }
.lp-gallery-cap strong { display: block; font-family: var(--font-display); font-size: 16px; font-weight: 600; }
@media (max-width: 900px) { .lp-gallery { grid-template-columns: 1fr 1fr; } }
.lp-expert-quote { font-family: var(--font-display); font-size: clamp(20px, 2.2vw, 26px); font-weight: 500; line-height: 1.35; color: var(--navy); letter-spacing: -0.015em; margin: 0 0 24px; padding-left: 22px; border-left: 3px solid var(--accent); }
.lp-expert-name { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--navy); }
.lp-expert-role { font-size: 13.5px; color: var(--ink-mute); margin-bottom: 22px; }
.lp-form-section { background: var(--navy); color: #fff; padding: 90px 0; }
.lp-form-section h2 { color: #fff; }
.lp-form-section .lf-eyebrow {
  background: var(--accent) !important;
  color: #fff !important;
  border: 1px solid rgba(255,255,255,0.10);
}
.lp-form-section p { color: rgba(255,255,255,0.82); }
.lp-form-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: start; }
.lp-form-card { background: #fff; color: var(--ink); padding: 36px 32px; border-radius: 14px; }
.lp-form-card h3 { font-family: var(--font-display); font-size: 22px; color: var(--navy); margin: 0 0 8px; font-weight: 700; }
.lp-form-card .lf-form-sub { font-size: 14px; color: var(--ink-soft); margin: 0 0 22px; }
.lp-form-card form { display: flex; flex-direction: column; gap: 10px; }
.lp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.lp-form-card input, .lp-form-card textarea { font: inherit; font-size: 15px; width: 100%; padding: 13px 14px; border: 1px solid var(--ink-line); border-radius: 10px; background: #fff; color: var(--ink); }
.lp-form-card input:focus, .lp-form-card textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(217,140,3,0.14); }
.lp-form-card textarea { min-height: 96px; resize: vertical; }
.lp-form-card button[type="submit"] { margin-top: 4px; padding: 15px 22px; background: var(--accent); color: #fff; border: none; border-radius: 999px; font: inherit; font-weight: 700; font-size: 14.5px; cursor: pointer; transition: background .2s ease, transform .15s ease; }
.lp-form-card button[type="submit"]:hover { background: var(--accent-hover); transform: translateY(-1px); }
.lp-form-card button[type="submit"]:disabled { opacity: 0.6; cursor: wait; }
.lp-form-foot { margin-top: 10px; font-size: 12px; color: var(--ink-mute); }
.lp-form-foot a { color: var(--accent); }
.lp-form-thanks { display: none; padding: 24px 0; text-align: center; }
.lp-form-card.is-success .lp-form-thanks { display: block; }
.lp-form-card.is-success form { display: none; }
.lp-form-side ul { list-style: none; padding: 0; margin: 22px 0 0; }
.lp-form-side ul li { padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.10); font-size: 14px; color: rgba(255,255,255,0.85); display: flex; align-items: center; gap: 12px; }
.lp-form-side ul li::before { content: ''; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E"); background-size: 12px; background-repeat: no-repeat; background-position: center; flex-shrink: 0; }
.lp-form-error { display: none; margin-top: 10px; padding: 10px 12px; background: #fdecea; border: 1px solid rgba(179,38,30,0.22); border-radius: 8px; color: #b3261e; font-size: 13.5px; }
.lp-form-card.is-error .lp-form-error { display: block; }
@media (max-width: 900px) {
  .lp-form-grid { grid-template-columns: 1fr; gap: 32px; }
  .lp-form-row { grid-template-columns: 1fr; }
  .lp-form-card { padding: 26px 22px; }
}
.lp-blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1180px; margin: 0 auto; }
.lp-blog-card { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 14px; overflow: hidden; text-decoration: none; color: var(--ink); display: flex; flex-direction: column; transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .3s ease; }
.lp-blog-card:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 22px 50px -20px rgba(15,17,21,0.22); }
.lp-blog-img { aspect-ratio: 16/10; overflow: hidden; }
.lp-blog-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.22,1,.36,1); }
.lp-blog-card:hover .lp-blog-img img { transform: scale(1.05); }
.lp-blog-body { padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.lp-blog-meta { display: flex; align-items: center; gap: 12px; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; }
.lp-blog-tag { color: var(--accent); font-weight: 700; }
.lp-blog-time { color: var(--ink-mute); font-weight: 600; }
.lp-blog-body h4 { font-family: var(--font-display); font-size: 18px; color: var(--navy); margin: 0; line-height: 1.3; font-weight: 700; letter-spacing: -0.01em; }
.lp-blog-body p { font-size: 14px; line-height: 1.55; color: var(--ink-soft); margin: 0; }
.lp-blog-link { margin-top: auto; padding-top: 4px; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--accent); letter-spacing: 0.02em; transition: gap .25s ease; }
.lp-blog-card:hover .lp-blog-link { gap: 12px; }
@media (max-width: 900px) { .lp-blog-grid { grid-template-columns: 1fr; gap: 16px; } }
`;

const HTML = `
${buildHero({
  bg: heroBg,
  eyebrow: 'AB Gevelbekleding · Willebroek',
  title: 'Nieuwe gevel.<br/>Lagere energiefactuur. <span class="ab-mark">Hogere woningwaarde</span>.',
  lede: 'Crepi, steenstrips en sierpleister — met of zonder buitenisolatie (ETICS). Gratis plaatsbezoek in Mechelen, Antwerpen, Lier en heel Vlaanderen. Premiedossier €30-45/m² inbegrepen, 10 jaar garantie op waterdichtheid.',
  primary: { label: 'Gratis gevel-advies aanvragen', href: '#lp-form' },
  secondary: { label: 'Bel +32 470 63 44 13 →', href: 'tel:+32470634413' },
})}

<section class="lf-section" style="padding: 0;">
  <div class="wrap">
    <div class="lp-stats-strip">
      <div class="lp-stat" data-reveal><div class="lp-stat-num">63.112 m²</div><div class="lp-stat-label">Afgewerkte gevels sinds 2010</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="1"><div class="lp-stat-num">€5.400</div><div class="lp-stat-label">Premie gem. rijwoning (ETICS)</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="2"><div class="lp-stat-num">30%</div><div class="lp-stat-label">Minder warmteverlies via gevel</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="3"><div class="lp-stat-num">€8-15K</div><div class="lp-stat-label">Meerwaarde bij verkoop</div></div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Waarom gevelrenovatie loont</span>
        <h2 class="lf-h2">Meer dan een verfje —<br/><span class="ab-mark">uw woningschil</span>.</h2>
        <p class="lf-lede">Een oude, niet-geïsoleerde gevel verliest tot 30% van uw verwarming. Buitenisolatie (ETICS) brengt uw woning meteen op label C of B en geeft u tot €45/m² premie in 2026.</p>
        <ul class="ab-checks" style="margin-top: 22px;">
          <li>Lagere energiefactuur — tot 25% besparing na ETICS</li>
          <li>EPC-label sprong — gemiddeld 80-120 punten beter</li>
          <li>Meer wooncomfort — geen koude buitenmuren meer</li>
          <li>€8.000-€15.000 meerwaarde bij verkoop</li>
        </ul>
        <a href="#lp-form" class="lf-cta-pill" style="margin-top: 28px;">
          <span>Vraag uw plaatsbezoek aan</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgBenefits}" alt="Gevelrenovatie grijze crepi" loading="lazy"/></div>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 40px;">
      <span class="lf-eyebrow">Nu starten = meer voordeel</span>
      <h2 class="lf-h2">Drie redenen om<br/><span class="ab-mark">niet te wachten</span>.</h2>
    </div>
    <div class="lp-urgency-grid">
      <div class="lp-urgency-card" data-reveal>
        <div class="lp-urgency-num">01</div>
        <h4>Renovatieplicht 2028</h4>
        <p>Vanaf 2028 moet elke verkochte woning binnen 5 jaar op label C. Wie nu de gevel doet, voldoet automatisch. Wachten = krappe planning + hogere prijs door piekvraag.</p>
      </div>
      <div class="lp-urgency-card" data-reveal data-reveal-delay="1">
        <div class="lp-urgency-num">02</div>
        <h4>Premies dalen jaarlijks</h4>
        <p>Mijn VerbouwPremie staat in 2026 op €30-45/m² buitenisolatie. Op gevel van 120 m² = €3.600-€5.400 cash terug. Bedragen dalen in 2027.</p>
      </div>
      <div class="lp-urgency-card" data-reveal data-reveal-delay="2">
        <div class="lp-urgency-num">03</div>
        <h4>Klaar voor de winter</h4>
        <p>Tussen april en oktober gaat sneller en droogt beter. Najaar = stelling die in regen blijft staan, langere uitvoering.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div class="lf-split-img" data-reveal><img src="${imgProcess}" alt="Stelling voor gevelrenovatie" loading="lazy"/></div>
      <div data-reveal data-reveal-delay="1">
        <span class="lf-eyebrow">Onze werkwijze</span>
        <h2 class="lf-h2">Van plaatsbezoek tot<br/><span class="ab-mark">nieuwe gevel</span> in 6 weken.</h2>
        <p class="lf-lede">Eigen plaatsers, eigen stelling, eigen premiebehandelaar. Geen onderaannemers tussen u en het resultaat.</p>
        <ul class="ab-checks" style="margin-top: 22px;">
          <li><strong>Week 1</strong> — Gratis plaatsbezoek, U-waarde berekening, eerste richtprijs</li>
          <li><strong>Week 2</strong> — Bindende offerte, kleurstalen ter plaatse, premiedossier voorbereid</li>
          <li><strong>Week 3-6</strong> — Stelling, isolatie, wapenen, crepi-afwerking</li>
          <li><strong>Oplevering</strong> — Premie ingediend, garantieattest in mailbox</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head" data-reveal style="margin-bottom: 36px;">
      <span class="lf-eyebrow">Realisaties</span>
      <h2 class="lf-h2">Gevels die<br/><span class="ab-mark">tijdloos mooi</span> blijven.</h2>
    </div>
    <div class="lp-gallery">
      <a href="#lp-form" class="lp-gallery-cell" data-reveal>
        <img src="${g1}" alt="Witte crepi rijwoning Mechelen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Crepi</small><strong>Witte crepi — Mechelen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="1">
        <img src="${g2}" alt="Grijze crepi halfopen Antwerpen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Crepi + ETICS</small><strong>Grijze crepi — Antwerpen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="2">
        <img src="${g3}" alt="Steenstrips villa Lier" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Steenstrips</small><strong>Steenstrips — Lier</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="3">
        <img src="${g4}" alt="Sierpleister Bornem" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Sierpleister</small><strong>Marmorino — Bornem</strong></div>
      </a>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div class="lf-split-img" data-reveal><img src="${expertImg}" alt="Bardh, projectleider gevelrenovatie" loading="lazy"/></div>
      <div data-reveal data-reveal-delay="1">
        <span class="lf-eyebrow">Direct advies</span>
        <p class="lp-expert-quote">"Voordat we praten over kleur of materiaal: eerst meten wat er ÉCHT moet. Soms volstaat een verfbeurt. Soms is ETICS de enige juiste keuze. Wij zeggen u eerlijk welk."</p>
        <div class="lp-expert-name">Bardh</div>
        <div class="lp-expert-role">Projectleider Gevelrenovatie · AB Bouw Groep</div>
        <a href="tel:+32470634413" class="lf-cta-pill">
          <span>Bel Bardh direct</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
        </a>
      </div>
    </div>
  </div>
</section>

<section class="lf-section lf-reviews-section">
  <div class="wrap">
    <div class="lf-section-head centered lf-reviews-head" data-reveal style="margin-bottom: 36px;">
      <span class="lf-eyebrow">Reviews gevelrenovatie</span>
      <div class="lf-reviews-rating">
        <span class="lf-reviews-score">4.9</span>
        <span class="lf-reviews-divider" aria-hidden="true"></span>
        <div class="lf-reviews-meta">
          <div class="lf-reviews-stars" aria-label="4.9 van 5 sterren">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
          </div>
          <span class="lf-reviews-count">98+ gevels beoordeeld</span>
        </div>
      </div>
    </div>
    <div class="lf-testi-marquee" data-testi-marquee>
      <button type="button" class="lf-testi-arrow lf-testi-arrow--prev" data-testi-prev aria-label="Vorige review">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button type="button" class="lf-testi-arrow lf-testi-arrow--next" data-testi-next aria-label="Volgende review">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="lf-testi-shift" data-testi-shift>
        <div class="lf-testi-track" data-testi-track>
          ${[-1, 0, 1].map((setIdx) => `
            <div class="lf-testi-set" data-testi-set="${setIdx}"${setIdx !== 0 ? ' aria-hidden="true"' : ''}>
              ${GEVEL_REVIEWS.map((t, i) => `
                <article class="lf-testi" data-review-index="${i}">
                  <div class="lf-testi-stars">★★★★★</div>
                  <p>${t.text}</p>
                  <div class="lf-testi-divider"></div>
                  <div class="lf-testi-foot">
                    <img class="lf-testi-avatar" src="${t.img}" alt="${t.name}" loading="lazy"/>
                    <div class="lf-testi-meta">
                      <strong>${t.name}</strong>
                      <span>${t.role}</span>
                    </div>
                    <svg class="lf-testi-google" viewBox="0 0 48 48" width="22" height="22" aria-label="Google review">
                      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"/>
                      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.2 5.2C41.4 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                    </svg>
                  </div>
                </article>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Veelgestelde vragen</span>
      <h2 class="lf-h2">Wat <span class="ab-mark">iedereen vraagt</span>.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Wat kost gevelrenovatie in 2026?</summary><div class="ab-faq-body"><p>Crepi op gezonde gevel: €45-€60/m². Crepi + ETICS: €110-€150/m². Steenstrips: €120-€180/m². Houten bekleding: €60-€140/m². Stelling rij­woning €1.800-€3.200. Premies €30-€45/m² halen flink stuk weg.</p></div></details>
      <details data-reveal><summary>Wat is ETICS en heb ik dat nodig?</summary><div class="ab-faq-body"><p>External Thermal Insulation Composite System: isolatieplaat + wapeningsnet + crepi. Voor woningen vóór 1995 zonder spouwisolatie bijna altijd juiste keuze. R-waarde 4,5+, EPC-sprong 80-120 punten.</p></div></details>
      <details data-reveal><summary>Doen jullie de premieaanvraag voor mij?</summary><div class="ab-faq-body"><p>Ja, standaard. Mijn VerbouwPremie-dossier met foto's, facturen en U-waarde-berekeningen. U deelt burgerprofiel-login, wij dienen in.</p></div></details>
      <details data-reveal><summary>Hoeveel meerwaarde geeft gevelrenovatie?</summary><div class="ab-faq-body"><p>Vlaamse vastgoedmakelaars rapporteren €8.000-€15.000 meerwaarde voor rijwoning met geïsoleerde + opnieuw afgewerkte gevel. Woningen met label C+ verkopen 5-7 weken sneller.</p></div></details>
      <details data-reveal><summary>Welke kleur is het meest gevraagd?</summary><div class="ab-faq-body"><p>Top 3 in 2026: gebroken wit (RAL 9001), licht-warmgrijs (NCS S 2000-N), taupe-beige. Heldere kleuren kosten €4-€6/m² meer (UV-stabiele pigmenten). Kleurstalen mee tijdens plaatsbezoek.</p></div></details>
      <details data-reveal><summary>Welke regio's bedienen jullie?</summary><div class="ab-faq-body"><p>Antwerpen, Mechelen, Lier, Boom, Bornem, Puurs, Sint-Niklaas, Heist-op-den-Berg, Brussel, Vilvoorde, Asse, Aalst, Dendermonde, Leuven.</p></div></details>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 40px;">
      <span class="lf-eyebrow">Verdiepende reads</span>
      <h2 class="lf-h2">Eerst wat <span class="ab-mark">leren</span> over gevelrenovatie?</h2>
      <p class="lf-lede" style="margin: 16px auto 0; max-width: 620px;">Drie artikelen die de meest gestelde vragen beantwoorden — open in nieuw tabblad zodat u hier kan verder lezen.</p>
    </div>
    <div class="lp-blog-grid">
      ${LP_BLOGS.map((b, i) => `
        <a href="/blog/${b.slug}" target="_blank" rel="noopener" class="lp-blog-card" data-reveal data-reveal-delay="${i}">
          <div class="lp-blog-img"><img src="${b.img}" alt="${b.title}" loading="lazy"/></div>
          <div class="lp-blog-body">
            <div class="lp-blog-meta">
              <span class="lp-blog-tag">${b.tag}</span>
              <span class="lp-blog-time">${b.readTime}</span>
            </div>
            <h4>${b.title}</h4>
            <p>${b.excerpt}</p>
            <span class="lp-blog-link">Lees het volledige artikel
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><line x1="7" y1="17" x2="17" y2="7"/></svg>
            </span>
          </div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<section class="lp-form-section" id="lp-form">
  <div class="wrap">
    <div class="lp-form-grid">
      <div class="lp-form-side" data-reveal>
        <span class="lf-eyebrow">Gratis gevel-advies</span>
        <h2 class="lf-h2" style="color:#fff;">Vraag uw<br/><span class="ab-mark">plaatsbezoek</span> aan.</h2>
        <p>Binnen 5 werkdagen langs voor opname, U-waarde berekening en kleurstalen ter plaatse. Vrijblijvend, gratis, geen verkoopgesprek.</p>
        <ul>
          <li>Plaatsbezoek binnen 5 werkdagen</li>
          <li>Bindende offerte met kleurstaal</li>
          <li>Premiedossier inbegrepen (gem. €4.500+ terug)</li>
          <li>10 jaar garantie op waterdichtheid</li>
          <li>Eigen plaatsers, eigen stelling</li>
        </ul>
      </div>
      <div class="lp-form-card" data-reveal data-reveal-delay="1" data-lp-form-wrapper>
        <h3>Plan uw gevel-advies</h3>
        <p class="lf-form-sub">We bellen u binnen één werkdag terug om een afspraak in te plannen.</p>
        <form data-lp-form novalidate>
          <div class="lp-form-row">
            <input type="text" name="firstName" placeholder="Voornaam *" required autocomplete="given-name" />
            <input type="text" name="lastName" placeholder="Familienaam *" required autocomplete="family-name" />
          </div>
          <input type="email" name="email" placeholder="E-mailadres *" required autocomplete="email" />
          <input type="tel" name="phone" placeholder="Telefoonnummer *" required autocomplete="tel" />
          <input type="text" name="straat" placeholder="Straat en nummer" autocomplete="street-address" />
          <div class="lp-form-row">
            <input type="text" name="postcode" placeholder="Postcode" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="postal-code" />
            <input type="text" name="gemeente" placeholder="Gemeente" autocomplete="address-level2" />
          </div>
          <textarea name="aanvullende_info" placeholder="Vertel kort over uw gevel (bouwjaar, type woning, wens)"></textarea>
          <button type="submit" data-lp-submit>Vraag gevel-advies aan</button>
          <p class="lp-form-foot">Geen spam. Privacy verklaring op <a href="/privacy" target="_blank">/privacy</a>.</p>
          <div class="lp-form-error" data-lp-form-error></div>
        </form>
        <div class="lp-form-thanks">
          <h3>Aanvraag ontvangen.</h3>
          <p style="color:var(--ink-soft);">We bellen u binnen één werkdag terug om uw plaatsbezoek in te plannen.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lp-trust-foot">
  <div class="wrap">
    <div><strong>AB Bouw Groep</strong>Industrieweg 14<br/>2830 Willebroek</div>
    <div><strong>Telefoon</strong><a href="tel:+32470634413">+32 470 63 44 13</a></div>
    <div><strong>Email</strong><a href="mailto:info@abgroep.be">info@abgroep.be</a></div>
    <div><strong>Erkenningen</strong>VCA*-gecertificeerd<br/>Lid Bouwunie</div>
  </div>
</section>

<a href="#lp-form" class="lp-sticky-cta" aria-label="Vraag offerte">
  Vraag gevel-advies aan
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
</a>

<div class="lp-bottom-bar">
  <a href="tel:+32470634413" class="lp-bb-call" aria-label="Bel direct">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    Bel direct
  </a>
  <a href="#lp-form" class="lp-bb-cta">
    Vraag offerte
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </a>
</div>
`;

export default function LpGevel() {
  useEffect(() => {
    document.title = "Gevelrenovatie Mechelen, Antwerpen & Vlaanderen — Gratis gevel-advies | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Gevelrenovatie in Mechelen, Antwerpen, Lier en heel Vlaanderen. Crepi, steenstrips, ETICS-isolatie. Premie €30-45/m², 10 jaar garantie. Gratis plaatsbezoek binnen 5 werkdagen.');

    const prev = document.body.className;
    document.body.className = 'lp-page is-subpage';
    const style = document.createElement('style');
    style.textContent = SHELL_STYLE + LP_EXTRA;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    const wrap = document.querySelector<HTMLElement>('[data-lp-form-wrapper]');
    const form = document.querySelector<HTMLFormElement>('[data-lp-form]');
    const submitBtn = document.querySelector<HTMLButtonElement>('[data-lp-submit]');
    const errBox = document.querySelector<HTMLElement>('[data-lp-form-error]');
    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (!form || !wrap) return;
      const requiredInputs = form.querySelectorAll<HTMLInputElement>('input[required]');
      for (const inp of Array.from(requiredInputs)) {
        if (!inp.checkValidity()) { inp.reportValidity(); return; }
      }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Even bezig…'; }
      if (errBox) errBox.textContent = '';
      wrap.classList.remove('is-error');
      const fd = new FormData(form);
      const result = await submitLead({
        source: 'landing_page',
        landing_division: 'ab_gevelbekleding',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email: (fd.get('email') as string) || '',
        phone: (fd.get('phone') as string) || undefined,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: 'ab_gevelbekleding',
        aanvullende_info: (fd.get('aanvullende_info') as string) || undefined,
        bron_lead: 'ads:gevel',
      });
      if (result.ok) {
        wrap.classList.add('is-success');
      } else {
        wrap.classList.add('is-error');
        if (errBox) errBox.textContent = 'Er ging iets mis. Bel ons gerust op +32 470 63 44 13.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag gevel-advies aan'; }
      }
    };
    form?.addEventListener('submit', onSubmit);

    return () => {
      document.body.className = prev;
      style.remove();
      form?.removeEventListener('submit', onSubmit);
    };
  }, []);

  useAbBouwInteractions();

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
