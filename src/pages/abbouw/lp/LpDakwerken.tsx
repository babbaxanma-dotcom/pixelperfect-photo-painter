import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { SHELL_STYLE } from '../_shell';
import { submitLead } from '@/lib/leads';
import { BLOGS } from '@/data/blogs';

// Filter blogs op dakwerken-relevante tags zodat alleen relevante content
// op de LP verschijnt. Linkjes openen in een NIEUWE tab zodat de bezoeker
// zijn LP-context niet kwijt is.
const LP_BLOGS = BLOGS.filter(b =>
  b.tag === 'Dakwerken' ||
  b.slug === 'dakisolatie-renovatieplicht' ||
  b.slug === 'plat-dak-epdm-roofing-zink' ||
  b.slug === 'epc-label-c-2028'
).slice(0, 3);

// Hero rotatie — 4 dakwerk-realisaties, zelfde aanpak als de Home page
import hero1 from '@/assets/dak/hellend-pannen.jpg';
import hero2 from '@/assets/dak/leien.jpg';
import hero3 from '@/assets/dak/plat-epdm.jpg';
import hero4 from '@/assets/dak/zinkwerk.jpg';

import imgBenefits from '@/assets/dak/dakisolatie.jpg';
import imgProcess from '@/assets/home/vakman-dak.jpg';
import gExtra from '@/assets/dak/dakraam.jpg';
import expertImg from '@/assets/home/team1.jpg';

import rev1 from '@/assets/reviews/marc.jpg';
import rev2 from '@/assets/reviews/dirk.jpg';
import rev3 from '@/assets/reviews/filip.jpg';
import rev4 from '@/assets/reviews/jeroen.jpg';
import rev5 from '@/assets/reviews/mehmet.jpg';
import rev6 from '@/assets/reviews/sofie.jpg';
import rev7 from '@/assets/reviews/nathalie.jpg';
import rev8 from '@/assets/reviews/ellen.jpg';

const DAK_REVIEWS = [
  { name: 'Marc Van den Broeck', role: 'Pannendak vernieuwd · Mechelen', img: rev1, text: 'Eerlijke offerte, geen meerwerken achteraf. Eigen ploeg op de werf, geen 5 onderaannemers die elkaar tegenwerken. Het dak ligt er strak bij en de premie van €4.200 is netjes uitbetaald.' },
  { name: 'Dirk Maes', role: 'Plat dak EPDM · Antwerpen', img: rev2, text: "Lekkend dak vrijdag gemeld, maandagochtend stond de ploeg er. EPDM in één stuk gelegd over 65m², geen naden, geen verrassingen. Top service voor wie z'n dak echt vakkundig wil." },
  { name: 'Filip Wouters', role: 'Hellend dak + isolatie · Puurs', img: rev3, text: 'Volledige stripoperatie: oude pannen weg, nieuwe sarking-isolatie, Koramic pannen erop. Acht werkdagen, geen dag uitloop. EPC-score van label E naar B in één renovatie.' },
  { name: 'Jeroen De Coster', role: 'Dakvenster Velux · Lier', img: rev4, text: 'Twee Velux-ramen in de keperruimte, met buitenzonwering. Plaatsing in twee dagen, binnenafwerking helemaal mee gepleisterd door eigen schrijnwerker. Geen koudebruggen, geen vocht.' },
  { name: 'Mehmet Yıldız', role: 'Stormschade hersteld · Bornem', img: rev5, text: 'Helft van de pannen weggewaaid tijdens storm. AB Bouw kwam dezelfde dag voor noodfix met dekzeil, week erop nieuw dak gelegd. Factuur exact zoals afgesproken, verzekeringsdossier mee geregeld.' },
  { name: 'Sofie Vermeulen', role: 'Zinken dakgoten + boordafwerking · Sint-Niklaas', img: rev6, text: 'Oude koperen goten vervangen door natuurzink (VMZinc). Gesoldeerde verbindingen, geen siliconen. Mooie strakke lijn rond heel het huis. Vakwerk dat 60 jaar meegaat.' },
  { name: 'Nathalie Aerts', role: 'Volledige dakrenovatie · Bonheiden', img: rev7, text: 'Twee verdiepingen, complete dakvervanging. Bardh kwam wekelijks zelf langs om vragen te beantwoorden. Vlotte communicatie, foto-update elke vrijdag in mail. Premie van €5.200 ingediend door hen.' },
  { name: 'Ellen De Smet', role: 'Dakisolatie zonder afbraak · Heist-op-den-Berg', img: rev8, text: 'PIR-isolatie tussen de kepers, geen volledig nieuw dak nodig volgens hen. Eerlijk advies, andere aannemers wilden meteen alles vervangen. EPC-sprong van 60 punten, factuur half zo groot.' },
];

// LP-specifieke aanvullingen op SHELL_STYLE — hergebruikt alle bestaande
// `.lf-*` klassen voor 100% stijl-consistentie met de rest van de site.
const LP_EXTRA = `
/* ───────── LP cinematic hero ───────── */
.lp-hero-cine { min-height: 100vh; min-height: 100dvh; }
.lp-hero-cine .lf-hero-bg--slides { filter: contrast(1.04) saturate(0.96); }
.lp-hero-cine .lf-hero-bg--slides::after {
  background:
    radial-gradient(ellipse at center, rgba(8,12,22,0.30) 0%, rgba(8,12,22,0.78) 70%, rgba(8,12,22,0.94) 100%),
    linear-gradient(180deg, rgba(8,12,22,0.45) 0%, rgba(8,12,22,0.05) 22%, rgba(8,12,22,0.05) 70%, rgba(8,12,22,0.55) 100%);
  z-index: 3;
}
.lp-hero-cine .lf-hero-wrap {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 100vh; min-height: 100dvh;
  padding-top: 120px !important;
  padding-bottom: 90px !important;
}
.lp-hero-cine .lf-hero-mini { max-width: 920px; }
.lp-hero-cine .lf-hero-headline {
  font-size: clamp(36px, 5.4vw, 64px);
  line-height: 1.07;
  font-weight: 600;
  letter-spacing: -0.022em;
  margin: 0 0 16px;
  color: #fff;
}
.lp-hero-cine .lf-hero-sub {
  font-size: clamp(15.5px, 1.3vw, 18px);
  color: rgba(255,255,255,0.86);
  margin: 0 auto 30px;
  max-width: 680px;
  line-height: 1.6;
}
.lp-hero-cine .lf-hero-actions { gap: 14px; }
.lp-hero-cine .lf-cta-pill {
  padding: 16px 26px;
  font-size: 14.5px;
  box-shadow: 0 14px 32px -10px rgba(217,140,3,0.55);
}
.lp-hero-cine .lf-cta-pill:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -10px rgba(217,140,3,0.65); }

/* Hero trust chip — direct onder CTAs, social proof */
.lp-hero-trust {
  margin-top: 26px;
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 0;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-display);
  overflow: hidden;
}
.lp-hero-trust > span {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  font-size: 13px; font-weight: 500;
  white-space: nowrap;
}
.lp-hero-trust > span + span { border-left: 1px solid rgba(255,255,255,0.16); }
.lp-hero-trust b { font-weight: 600; color: #fff; }
.lp-hero-trust .lp-hero-trust-stars { color: #F5C518; letter-spacing: 1px; font-size: 12px; }
.lp-hero-trust-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #2ed47a; box-shadow: 0 0 0 4px rgba(46,212,122,0.18); }
@media (max-width: 720px) {
  .lp-hero-trust { flex-wrap: wrap; border-radius: 18px; justify-content: center; }
  .lp-hero-trust > span { padding: 8px 14px; font-size: 12.5px; }
  .lp-hero-trust > span + span { border-left: 0; }
}

/* Micro-trust onder CTA — kleine duidelijkheidstekst */
.lp-cta-microtrust {
  margin-top: 12px;
  font-size: 12.5px;
  color: rgba(255,255,255,0.74);
  font-family: var(--font-display);
  letter-spacing: 0.01em;
}
.lp-cta-microtrust b { color: rgba(255,255,255,0.92); font-weight: 600; }

/* ───────── Reviews carousel fix — disable auto-scroll, center set-0 ───────── */
.lp-reviews .lf-testi-track { animation: none !important; }
.lp-reviews .lf-testi-shift { transition: transform 0.55s cubic-bezier(.22,.7,.2,1); }
.lp-reviews .lf-testi-marquee { padding-top: 28px; padding-bottom: 36px; }
@media (max-width: 760px) {
  .lp-reviews .lf-testi-shift { transition: none; }
}

/* ───────── Trust logo strip ───────── */
.lp-trust-strip {
  padding: 28px 0 36px;
  background: #fff;
  border-bottom: 1px solid var(--ink-line-soft);
}
.lp-trust-strip-inner {
  display: flex; flex-wrap: wrap;
  align-items: center; justify-content: center;
  gap: 24px 44px;
}
.lp-trust-badge {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--ink-soft);
  letter-spacing: 0.01em;
}
.lp-trust-badge strong { color: var(--navy); font-weight: 700; font-size: 13.5px; }
.lp-trust-badge svg { color: var(--accent); flex-shrink: 0; }
.lp-trust-divider { width: 1px; height: 22px; background: var(--ink-line-soft); }
@media (max-width: 720px) {
  .lp-trust-strip { padding: 22px 0 26px; }
  .lp-trust-strip-inner { gap: 14px 22px; }
  .lp-trust-badge { font-size: 12px; }
  .lp-trust-divider { display: none; }
}

/* ───────── Premie urgency box ───────── */
.lp-premie {
  background: linear-gradient(135deg, rgba(217,140,3,0.06) 0%, rgba(217,140,3,0.02) 100%);
  border: 1px solid rgba(217,140,3,0.22);
  border-radius: 16px;
  padding: 28px 32px;
  display: grid; grid-template-columns: auto 1fr auto; gap: 28px; align-items: center;
}
.lp-premie-ico {
  width: 56px; height: 56px; border-radius: 14px;
  background: var(--accent); color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.lp-premie-text strong {
  display: block; font-family: var(--font-display); font-size: 18px;
  color: var(--navy); font-weight: 700; letter-spacing: -0.01em; margin-bottom: 4px;
}
.lp-premie-text p { margin: 0; font-size: 14px; color: var(--ink-soft); line-height: 1.55; }
.lp-premie-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 999px;
  background: var(--navy); color: #fff;
  font-family: var(--font-display); font-weight: 600; font-size: 13.5px;
  text-decoration: none; white-space: nowrap;
  transition: background .2s ease, transform .15s ease;
}
.lp-premie-cta:hover { background: #0d1d36; transform: translateY(-1px); }
@media (max-width: 720px) {
  .lp-premie { grid-template-columns: 1fr; gap: 18px; padding: 22px 22px; text-align: left; }
  .lp-premie-cta { width: 100%; justify-content: center; }
}

/* LP: bottom CTA bar mobile, sticky bel + offerte */
.lp-bottom-bar { display: none; }
@media (max-width: 900px) {
  .lp-bottom-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    z-index: 60;
    display: grid; grid-template-columns: 1fr 1.4fr; gap: 8px;
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid var(--ink-line);
  }
  .lp-bottom-bar a {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 16px; border-radius: 999px;
    font-weight: 700; font-size: 14px; text-decoration: none;
  }
  .lp-bottom-bar .lp-bb-call { background: var(--navy); color: #fff; }
  .lp-bottom-bar .lp-bb-cta { background: var(--accent); color: #fff; }
  body.lp-page { padding-bottom: 76px; }
}

/* LP trust foot — geen nav links, alleen bedrijfsgegevens */
.lp-trust-foot {
  padding: 56px 0 80px;
  background: #fff;
  border-top: 1px solid var(--ink-line-soft);
  font-size: 13px; color: var(--ink-mute);
}
.lp-trust-foot .wrap {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
}
.lp-trust-foot strong { display: block; color: var(--navy); font-size: 14px; margin-bottom: 4px; }
.lp-trust-foot a { color: var(--ink-soft); text-decoration: none; }
.lp-trust-foot a:hover { color: var(--accent); }
@media (max-width: 720px) { .lp-trust-foot .wrap { grid-template-columns: 1fr 1fr; gap: 22px; } }

/* LP stats (hergebruikt buildhero stat-look in nieuwe sectie) */
.lp-stats-strip {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 36px;
  padding: 56px 0;
  border-bottom: 1px solid var(--ink-line-soft);
}
.lp-stat { position: relative; padding-left: 18px; }
.lp-stat::before {
  content: ''; position: absolute; left: 0; top: 4px; bottom: 8px;
  width: 3px; background: var(--accent);
}
.lp-stat-num {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 700;
  color: var(--navy);
  letter-spacing: -0.025em;
  line-height: 1;
  margin-bottom: 6px;
}
.lp-stat-label {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink-soft);
  line-height: 1.45;
}
@media (max-width: 900px) {
  .lp-stats-strip { grid-template-columns: repeat(2, 1fr); gap: 28px 20px; padding: 40px 0; }
}

/* LP urgency cards — hergebruik card-stijl van de site */
.lp-urgency-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.lp-urgency-card {
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  padding: 28px 26px;
  border-radius: 14px;
  transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
}
.lp-urgency-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 22px 50px -20px rgba(15,17,21,0.22); }
.lp-urgency-num { font-family: var(--font-display); font-weight: 700; font-size: 26px; color: var(--accent); line-height: 1; margin-bottom: 14px; letter-spacing: -0.02em; }
.lp-urgency-card h4 { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--navy); margin: 0 0 8px; letter-spacing: -0.01em; }
.lp-urgency-card p { font-size: 14.5px; color: var(--ink-soft); line-height: 1.55; margin: 0; }
@media (max-width: 900px) { .lp-urgency-grid { grid-template-columns: 1fr; gap: 14px; } }

/* LP gallery — hergebruik project-collage look */
.lp-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.lp-gallery-cell { position: relative; aspect-ratio: 4/5; overflow: hidden; border-radius: 12px; text-decoration: none; color: inherit; }
.lp-gallery-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.22,1,.36,1); }
.lp-gallery-cell:hover img { transform: scale(1.06); }
.lp-gallery-cell::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(10,22,40,0.85) 100%); pointer-events: none; }
.lp-gallery-cap { position: absolute; left: 18px; bottom: 16px; right: 18px; z-index: 2; color: #fff; }
.lp-gallery-cap small { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.78); margin-bottom: 4px; }
.lp-gallery-cap strong { display: block; font-family: var(--font-display); font-size: 16px; font-weight: 600; }
@media (max-width: 900px) { .lp-gallery { grid-template-columns: 1fr 1fr; } }

/* LP expert quote — hergebruik split layout */
.lp-expert-quote { font-family: var(--font-display); font-size: clamp(20px, 2.2vw, 26px); font-weight: 500; line-height: 1.35; color: var(--navy); letter-spacing: -0.015em; margin: 0 0 24px; padding-left: 22px; border-left: 3px solid var(--accent); }
.lp-expert-name { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--navy); }
.lp-expert-role { font-size: 13.5px; color: var(--ink-mute); margin-bottom: 22px; }

/* LP form bg — hergebruikt navy CTA-stijl */
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
.lp-form-card input, .lp-form-card textarea {
  font: inherit; font-size: 15px;
  width: 100%; padding: 13px 14px;
  border: 1px solid var(--ink-line); border-radius: 10px;
  background: #fff; color: var(--ink);
}
.lp-form-card input:focus, .lp-form-card textarea:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(217,140,3,0.14);
}
.lp-form-card textarea { min-height: 96px; resize: vertical; }
.lp-form-card button[type="submit"] {
  margin-top: 4px; padding: 15px 22px;
  background: var(--accent); color: #fff; border: none;
  border-radius: 999px; font: inherit; font-weight: 700; font-size: 14.5px;
  cursor: pointer; transition: background .2s ease, transform .15s ease;
}
.lp-form-card button[type="submit"]:hover { background: var(--accent-hover); transform: translateY(-1px); }
.lp-form-card button[type="submit"]:disabled { opacity: 0.6; cursor: wait; }
.lp-form-foot { margin-top: 10px; font-size: 12px; color: var(--ink-mute); }
.lp-form-foot a { color: var(--accent); }
.lp-form-thanks { display: none; padding: 24px 0; text-align: center; }
.lp-form-card.is-success .lp-form-thanks { display: block; }
.lp-form-card.is-success form { display: none; }
.lp-form-side ul { list-style: none; padding: 0; margin: 22px 0 0; }
.lp-form-side ul li {
  padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.10);
  font-size: 14px; color: rgba(255,255,255,0.85);
  display: flex; align-items: center; gap: 12px;
}
.lp-form-side ul li::before {
  content: ''; width: 18px; height: 18px; border-radius: 50%;
  background: var(--accent);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
  background-size: 12px; background-repeat: no-repeat; background-position: center;
  flex-shrink: 0;
}
.lp-form-error { display: none; margin-top: 10px; padding: 10px 12px; background: #fdecea; border: 1px solid rgba(179,38,30,0.22); border-radius: 8px; color: #b3261e; font-size: 13.5px; }
.lp-form-card.is-error .lp-form-error { display: block; }
@media (max-width: 900px) {
  .lp-form-grid { grid-template-columns: 1fr; gap: 32px; }
  .lp-form-row { grid-template-columns: 1fr; }
  .lp-form-card { padding: 26px 22px; }
}

/* Verdiepende reads (gerelateerde blogs) — opens in new tab */
.lp-blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1180px; margin: 0 auto; }
.lp-blog-card {
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  color: var(--ink);
  display: flex; flex-direction: column;
  transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .3s ease;
}
.lp-blog-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 22px 50px -20px rgba(15,17,21,0.22);
}
.lp-blog-img { aspect-ratio: 16/10; overflow: hidden; }
.lp-blog-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.22,1,.36,1); }
.lp-blog-card:hover .lp-blog-img img { transform: scale(1.05); }
.lp-blog-body { padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.lp-blog-meta { display: flex; align-items: center; gap: 12px; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; }
.lp-blog-tag { color: var(--accent); font-weight: 700; }
.lp-blog-time { color: var(--ink-mute); font-weight: 600; }
.lp-blog-body h4 { font-family: var(--font-display); font-size: 18px; color: var(--navy); margin: 0; line-height: 1.3; font-weight: 700; letter-spacing: -0.01em; }
.lp-blog-body p { font-size: 14px; line-height: 1.55; color: var(--ink-soft); margin: 0; }
.lp-blog-link {
  margin-top: auto;
  padding-top: 4px;
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 700; color: var(--accent);
  letter-spacing: 0.02em;
  transition: gap .25s ease;
}
.lp-blog-card:hover .lp-blog-link { gap: 12px; }
@media (max-width: 900px) {
  .lp-blog-grid { grid-template-columns: 1fr; gap: 16px; }
}

/* Sticky desktop CTA */
.lp-sticky-cta { display: none; }
@media (min-width: 901px) {
  body.past-hero .lp-sticky-cta {
    position: fixed; right: 24px; bottom: 24px; z-index: 60;
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 24px; background: var(--accent); color: #fff;
    font-family: var(--font-display); font-weight: 600; font-size: 14px;
    text-decoration: none; border-radius: 999px;
    box-shadow: 0 14px 36px -10px rgba(217,140,3,0.55), 0 2px 4px rgba(15,17,21,0.08);
    transition: transform .2s ease, box-shadow .25s ease, background .2s ease;
    animation: lf-form-pulse 4s ease-in-out infinite;
  }
  body.past-hero .lp-sticky-cta:hover { transform: translateY(-2px); background: var(--accent-hover); }
}
`;

const HTML = `
<section class="lf-hero lp-hero-cine">
  <div class="lf-hero-bg lf-hero-bg--slides" data-hero-slides>
    <img src="${hero1}" alt="Hellend dak met Koramic pannen — AB Dakwerken Mechelen" class="is-active" />
    <img src="${hero2}" alt="Natuurleien dakwerk Antwerpen — AB Bouw Groep" loading="lazy" />
    <img src="${hero3}" alt="Plat dak EPDM rubber renovatie Lier" loading="lazy" />
    <img src="${hero4}" alt="Zinkwerk en boordafwerking Sint-Niklaas" loading="lazy" />
  </div>
  <button type="button" class="lf-hero-arrow lf-hero-arrow--prev" data-hero-prev aria-label="Vorige foto">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  </button>
  <button type="button" class="lf-hero-arrow lf-hero-arrow--next" data-hero-next aria-label="Volgende foto">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
  <div class="wrap lf-hero-wrap">
    <div class="lf-hero-mini" data-hero-anim>
      <span class="lf-hero-eyebrow"><span class="lf-hero-eyebrow-dot"></span>AB Dakwerken · Willebroek</span>
      <h1 class="lf-hero-headline">
        Nieuw dak. Vaste prijs.<br/>Eigen dakdekkers.
      </h1>
      <p class="lf-hero-sub">Volledige dakvervanging, dakisolatie en zinkwerk in Mechelen, Antwerpen, Lier en heel Vlaanderen. Gratis plaatsbezoek binnen 5 werkdagen, bindende offerte met fotorapport, 10 jaar garantie op waterdichtheid.</p>
      <div class="lf-hero-actions">
        <a href="#lp-form" class="lf-cta-pill" data-smooth>
          <span>Gratis dakinspectie aanvragen</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
        <a href="tel:+32470634413" class="lf-hero-ghost">
          <span>Bel +32 470 63 44 13</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
      <p class="lp-cta-microtrust"><b>Antwoord binnen 1 werkdag.</b> Geen verkooppraatje. Geen verplichting.</p>
      <div class="lp-hero-trust">
        <span><span class="lp-hero-trust-stars">★★★★★</span><b>4,9 / 5</b></span>
        <span><b>184+</b> klanten</span>
        <span><b>15 jaar</b> Vlaanderen</span>
        <span><span class="lp-hero-trust-dot"></span>Plaatsbezoek binnen 5 dagen</span>
      </div>
    </div>
  </div>
  <button class="lf-scroll-cue" type="button" aria-label="Scroll naar beneden" onclick="window.scrollBy({top: window.innerHeight - 80, left: 0, behavior: 'smooth'})">
    <span class="lf-scroll-cue-label">Scroll</span>
    <span class="lf-scroll-cue-icon" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </span>
  </button>
</section>

<section class="lf-section lf-tone-soft lf-reviews-section lp-reviews" style="padding: 64px 0 80px;">
  <div class="wrap">
    <div class="lf-section-head centered lf-reviews-head" data-reveal style="margin-bottom: 32px;">
      <span class="lf-eyebrow">Reviews dakwerken</span>
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
          <span class="lf-reviews-count">124+ dakprojecten beoordeeld</span>
        </div>
      </div>
    </div>
    <div class="lf-testi-marquee" data-lp-testi-marquee>
      <button type="button" class="lf-testi-arrow lf-testi-arrow--prev" data-lp-testi-prev aria-label="Vorige review">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button type="button" class="lf-testi-arrow lf-testi-arrow--next" data-lp-testi-next aria-label="Volgende review">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="lf-testi-shift" data-testi-shift>
        <div class="lf-testi-track" data-testi-track>
          ${[-1, 0, 1].map((setIdx) => `
            <div class="lf-testi-set" data-testi-set="${setIdx}"${setIdx !== 0 ? ' aria-hidden="true"' : ''}>
              ${DAK_REVIEWS.map((t, i) => `
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

<section class="lp-trust-strip">
  <div class="wrap">
    <div class="lp-trust-strip-inner">
      <span class="lp-trust-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span><strong>VCA*</strong> Veiligheidscertificaat</span>
      </span>
      <span class="lp-trust-divider"></span>
      <span class="lp-trust-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/></svg>
        <span><strong>Lid Bouwunie</strong></span>
      </span>
      <span class="lp-trust-divider"></span>
      <span class="lp-trust-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M8 14h2M8 17h6"/></svg>
        <span>Verzekerd bij <strong>Federale</strong></span>
      </span>
      <span class="lp-trust-divider"></span>
      <span class="lp-trust-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span><strong>10 jaar</strong> garantie waterdichtheid</span>
      </span>
      <span class="lp-trust-divider"></span>
      <span class="lp-trust-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
        <span><strong>Mijn VerbouwPremie</strong> expert</span>
      </span>
    </div>
  </div>
</section>

<section class="lf-section" style="padding: 64px 0 24px;">
  <div class="wrap">
    <div class="lp-stats-strip">
      <div class="lp-stat" data-reveal><div class="lp-stat-num">48.325 m²</div><div class="lp-stat-label">Afgewerkte daken sinds 2010</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="1"><div class="lp-stat-num">6 vaste</div><div class="lp-stat-label">Eigen dakdekkers in dienst</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="2"><div class="lp-stat-num">30%</div><div class="lp-stat-label">Minder warmteverlies na isolatie</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="3"><div class="lp-stat-num">€40/m²</div><div class="lp-stat-label">Premie dakisolatie 2026</div></div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lp-premie" data-reveal>
      <div class="lp-premie-ico">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div class="lp-premie-text">
        <strong>Premie €40/m² nog geldig in 2026 — wordt elk jaar verlaagd</strong>
        <p>Mijn VerbouwPremie voor dakisolatie staat dit jaar op €40 per m². Op een gemiddelde rijwoning is dat €3.500-€5.500. Vanaf 2027 zakt het tarief — wie nu boekt zet de 2026-premie vast in offerte.</p>
      </div>
      <a href="#lp-form" class="lp-premie-cta" data-smooth>
        Bereken mijn premie
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Waarom een nieuw dak loont</span>
        <h2 class="lf-h2">Meer comfort,<br/><span class="ab-mark">minder kosten</span>.</h2>
        <p class="lf-lede">Een slecht dak verliest tot 30% van uw verwarming. Een goed dak bespaart u jaarlijks honderden euro's én verhoogt uw EPC-label met gemiddeld 80 punten in één renovatie.</p>
        <ul class="ab-checks" style="margin-top: 22px;">
          <li>Bescherming tegen lekkages — geen waterschade aan plafond of isolatie</li>
          <li>Tot 30% minder warmteverlies — direct lagere verwarmingsfactuur</li>
          <li>Hogere EPC-score — vereist voor renovatieverplichting 2028</li>
          <li>€8.000-€18.000 meerwaarde bij verkoop van uw woning</li>
        </ul>
        <a href="#lp-form" class="lf-cta-pill" style="margin-top: 28px;">
          <span>Vraag uw plaatsbezoek aan</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgBenefits}" alt="Dakisolatie wordt aangebracht" loading="lazy"/></div>
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
        <h4>Premies dalen jaarlijks</h4>
        <p>Mijn VerbouwPremie staat in 2026 op €40/m² maar wordt elk jaar verlaagd. Op een gemiddelde rijwoning bespaart u nu €3.500-€5.400 die u in 2027 niet meer krijgt.</p>
      </div>
      <div class="lp-urgency-card" data-reveal data-reveal-delay="1">
        <div class="lp-urgency-num">02</div>
        <h4>Materiaalprijzen stijgen</h4>
        <p>Pannen, leien en EPDM zijn sinds 2022 +18% duurder en blijven stijgen. Wie nu boekt, krijgt nog 2026-tarieven vastgezet in offerte.</p>
      </div>
      <div class="lp-urgency-card" data-reveal data-reveal-delay="2">
        <div class="lp-urgency-num">03</div>
        <h4>Klaar voor de winter</h4>
        <p>Begin nu en uw dak ligt waterdicht vóór november. Wachten tot najaar betekent 2-3 maanden langer wachten en stormrisico ondertussen.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div class="lf-split-img" data-reveal><img src="${imgProcess}" alt="Dakdekker plaatst Koramic pannen" loading="lazy"/></div>
      <div data-reveal data-reveal-delay="1">
        <span class="lf-eyebrow">Onze werkwijze</span>
        <h2 class="lf-h2">Van eerste gesprek tot<br/><span class="ab-mark">waterdicht dak</span> in 6 weken.</h2>
        <p class="lf-lede">Eigen dakploeg betekent: geen onderaannemers, geen tussenstops, één verantwoordelijke. Wij beginnen en wij maken het af.</p>
        <ul class="ab-checks" style="margin-top: 22px;">
          <li><strong>Week 1</strong> — Gratis plaatsbezoek, dakinspectie met dronefoto's, eerste richtprijs</li>
          <li><strong>Week 2</strong> — Bindende offerte, materialen vastgezet, premiedossier voorbereid</li>
          <li><strong>Week 3-5</strong> — Uitvoering 8-14 werkdagen, weekrapport per email</li>
          <li><strong>Oplevering</strong> — Premie ingediend, 10 jaar garantie schriftelijk vastgelegd</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head" data-reveal style="margin-bottom: 36px;">
      <span class="lf-eyebrow">Realisaties</span>
      <h2 class="lf-h2">Daken die de<br/><span class="ab-mark">tand des tijds</span> doorstaan.</h2>
    </div>
    <div class="lp-gallery">
      <a href="#lp-form" class="lp-gallery-cell" data-reveal>
        <img src="${hero1}" alt="Pannendak Mechelen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Hellend dak</small><strong>Pannendak — Mechelen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="1">
        <img src="${hero2}" alt="Natuurleien Antwerpen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Hellend dak</small><strong>Natuurleien — Antwerpen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="2">
        <img src="${hero3}" alt="Plat dak EPDM Lier" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Plat dak</small><strong>EPDM rubber — Lier</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="3">
        <img src="${gExtra}" alt="Dakvenster Lier" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Dakvenster</small><strong>Velux plaatsing — Lier</strong></div>
      </a>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div class="lf-split-img" data-reveal><img src="${expertImg}" alt="Bardh, projectleider AB Dakwerken" loading="lazy"/></div>
      <div data-reveal data-reveal-delay="1">
        <span class="lf-eyebrow">Direct advies</span>
        <p class="lp-expert-quote">"Een dak is geen quick fix. Wij komen langs, meten alles op, en zeggen u eerlijk wat écht moet — en wat 5 jaar kan wachten."</p>
        <div class="lp-expert-name">Bardh</div>
        <div class="lp-expert-role">Projectleider Dakwerken · AB Bouw Groep</div>
        <a href="tel:+32470634413" class="lf-cta-pill">
          <span>Bel Bardh direct</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
        </a>
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
      <details data-reveal><summary>Wat kost een nieuw dak in 2026?</summary><div class="ab-faq-body"><p>Volledige vervanging hellend dak op rijwoning (120 m²): €18.000-€32.000 alles inbegrepen. Plat dak in EPDM iets goedkoper. De premie €40/m² haalt €3.500-€5.500 van die factuur. Bindende richtprijs na plaatsbezoek.</p></div></details>
      <details data-reveal><summary>Hoe lang duurt de plaatsing?</summary><div class="ab-faq-body"><p>Hellend pannendak op rijwoning: 8-14 werkdagen. Plat dak EPDM: 4-8 werkdagen. Inclusief stelling en eindopkuis.</p></div></details>
      <details data-reveal><summary>Doen jullie de premieaanvraag voor mij?</summary><div class="ab-faq-body"><p>Ja, standaard. We bereiden het Mijn VerbouwPremie-dossier voor, leveren foto's en facturen aan in juist format. U deelt enkel uw burgerprofiel-login.</p></div></details>
      <details data-reveal><summary>Wat is uw garantie?</summary><div class="ab-faq-body"><p>10 jaar wettelijke aansprakelijkheid op waterdichtheid en stabiliteit, gedekt door polis bij Federale Verzekering. Plus fabrieksgarantie 30-50 jaar op Koramic/Eternit/Firestone materialen.</p></div></details>
      <details data-reveal><summary>Werken jullie ook bij dringende lekkages?</summary><div class="ab-faq-body"><p>Ja. Bij stormschade bellen we dezelfde week. Tijdelijke water-stop, daarna structurele renovatie. Bel voor 16u → iemand dezelfde dag.</p></div></details>
      <details data-reveal><summary>Welke regio's bedienen jullie?</summary><div class="ab-faq-body"><p>Antwerpen, Mechelen, Lier, Boom, Bornem, Puurs, Sint-Niklaas, Heist-op-den-Berg, Brussel, Vilvoorde, Asse, Aalst, Dendermonde, Leuven.</p></div></details>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 40px;">
      <span class="lf-eyebrow">Verdiepende reads</span>
      <h2 class="lf-h2">Eerst wat <span class="ab-mark">leren</span> over dakwerken?</h2>
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
        <span class="lf-eyebrow">Gratis dakinspectie</span>
        <h2 class="lf-h2" style="color:#fff;">Vraag uw<br/><span class="ab-mark">plaatsbezoek</span> aan.</h2>
        <p>Binnen 5 werkdagen komt onze dakploeg langs. Volledige opname met dronefoto's, eerste richtprijs ter plaatse, premiedossier doorgesproken — vrijblijvend en gratis.</p>
        <ul>
          <li>Plaatsbezoek binnen 5 werkdagen</li>
          <li>Bindende offerte op papier</li>
          <li>Premiedossier inbegrepen (gem. €3.500+ terug)</li>
          <li>10 jaar garantie op waterdichtheid</li>
          <li>Eigen dakploeg, geen onderaannemers</li>
        </ul>
      </div>
      <div class="lp-form-card" data-reveal data-reveal-delay="1" data-lp-form-wrapper>
        <h3>Plan uw dakinspectie</h3>
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
          <textarea name="aanvullende_info" placeholder="Vertel kort over uw dak (type, leeftijd, klacht)"></textarea>
          <button type="submit" data-lp-submit>Vraag dakinspectie aan</button>
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
  Vraag dakinspectie aan
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

export default function LpDakwerken() {
  useEffect(() => {
    document.title = "Dakwerken Mechelen, Antwerpen & Vlaanderen — Gratis dakinspectie | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Nieuw dak in Mechelen, Antwerpen, Lier en heel Vlaanderen. Eigen dakdekkers, 10 jaar garantie, premiedossier inbegrepen. Gratis plaatsbezoek binnen 5 werkdagen.');

    const prev = document.body.className;
    document.body.className = 'lp-page is-subpage';
    const style = document.createElement('style');
    style.textContent = SHELL_STYLE + LP_EXTRA;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    // ── LP-specifieke testimonials-carrousel: auto-scroll uit, set-0 gecentreerd,
    // arrows step één kaart tegelijk, focused card krijgt is-focus highlight.
    // We gebruiken data-lp-testi-* attrs zodat de globale hook 'm niet aanraakt.
    const marquee = document.querySelector<HTMLElement>('.lp-reviews [data-lp-testi-marquee]');
    const shift = document.querySelector<HTMLElement>('.lp-reviews [data-testi-shift]');
    const set0 = document.querySelector<HTMLElement>('.lp-reviews [data-testi-set="0"]');
    const prevBtn = document.querySelector<HTMLElement>('[data-lp-testi-prev]');
    const nextBtn = document.querySelector<HTMLElement>('[data-lp-testi-next]');
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.lp-reviews [data-testi-set="0"] .lf-testi'));

    let lpShift = 0;
    const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
    const applyLpShift = () => {
      if (shift) shift.style.setProperty('--testi-shift', `${lpShift}px`);
    };
    const recomputeInitial = () => {
      if (!marquee || !set0 || cards.length === 0 || isMobile()) return;
      // Center the FIRST card of set-0 in the marquee viewport.
      const mRect = marquee.getBoundingClientRect();
      const firstRect = cards[0].getBoundingClientRect();
      const viewportCenter = mRect.left + mRect.width / 2;
      const cardCenter = firstRect.left + firstRect.width / 2;
      // Note: this assumes initial CSS-applied --testi-shift is 0
      lpShift = viewportCenter - cardCenter;
      applyLpShift();
    };
    const step = (dir: 1 | -1) => {
      if (!cards.length || isMobile()) return;
      const gap = 24;
      const cardW = cards[0].getBoundingClientRect().width + gap;
      lpShift += -dir * cardW;
      applyLpShift();
    };
    const onPrev = () => step(-1);
    const onNext = () => step(1);
    prevBtn?.addEventListener('click', onPrev);
    nextBtn?.addEventListener('click', onNext);

    // Focus highlight: vind welke card het dichtst bij viewport-center is
    let focusRaf = 0;
    const updateFocus = () => {
      focusRaf = 0;
      if (!marquee || cards.length === 0 || isMobile()) return;
      const mRect = marquee.getBoundingClientRect();
      const center = mRect.left + mRect.width / 2;
      let bestIdx = -1; let bestDist = Infinity;
      const dists: number[] = [];
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        dists[i] = d;
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      const cw = cards[0].getBoundingClientRect().width;
      cards.forEach((c, i) => {
        c.classList.toggle('is-focus', i === bestIdx);
        c.classList.toggle('is-near', i !== bestIdx && dists[i] < cw * 1.2);
      });
    };
    const tickFocus = () => {
      focusRaf = requestAnimationFrame(() => { updateFocus(); tickFocus(); });
    };
    // Run AFTER global hook has been set up. RAF + small delay ensures markup is settled.
    const initTimer = window.setTimeout(() => {
      requestAnimationFrame(() => {
        recomputeInitial();
        updateFocus();
        tickFocus();
        if (marquee) marquee.classList.add('is-ready');
      });
    }, 50);

    const onResize = () => { recomputeInitial(); };
    window.addEventListener('resize', onResize);

    // ── Form submit
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
        landing_division: 'ab_dakwerken',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email: (fd.get('email') as string) || '',
        phone: (fd.get('phone') as string) || undefined,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: 'ab_dakwerken',
        aanvullende_info: (fd.get('aanvullende_info') as string) || undefined,
        bron_lead: 'ads:dakwerken',
      });
      if (result.ok) {
        wrap.classList.add('is-success');
      } else {
        wrap.classList.add('is-error');
        if (errBox) errBox.textContent = 'Er ging iets mis. Bel ons gerust op +32 470 63 44 13.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag dakinspectie aan'; }
      }
    };
    form?.addEventListener('submit', onSubmit);

    return () => {
      document.body.className = prev;
      style.remove();
      form?.removeEventListener('submit', onSubmit);
      prevBtn?.removeEventListener('click', onPrev);
      nextBtn?.removeEventListener('click', onNext);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(initTimer);
      if (focusRaf) cancelAnimationFrame(focusRaf);
    };
  }, []);

  useAbBouwInteractions();

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
