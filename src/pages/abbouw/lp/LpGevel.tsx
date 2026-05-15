import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { SHELL_STYLE } from '../_shell';
import { submitLead } from '@/lib/leads';
import { BLOGS } from '@/data/blogs';

const LP_BLOGS = BLOGS.filter(b =>
  b.tag === 'Gevel' ||
  b.slug === 'gevelrenovatie-crepi-versus-steenstrips' ||
  b.slug === 'na-isolatie-spouw-of-buiten' ||
  b.slug === 'epc-label-c-2028'
).slice(0, 3);

// Hero rotatie — 4 gevel-realisaties
import hero1 from '@/assets/gevel/witte-crepi.jpg';
import hero2 from '@/assets/gevel/grijze-crepi.jpg';
import hero3 from '@/assets/gevel/steenstrips.jpg';
import hero4 from '@/assets/gevel/sierpleister.jpg';

import imgBenefits from '@/assets/gevel/grijze-crepi.jpg';
import imgProcess from '@/assets/gevel/stelling.jpg';
import gExtra from '@/assets/gevel/intro.jpg';

import rev1 from '@/assets/reviews/jasmien.jpg';
import rev2 from '@/assets/reviews/joris.jpg';
import rev3 from '@/assets/reviews/marius.jpg';
import rev4 from '@/assets/reviews/cindy.jpg';
import rev5 from '@/assets/reviews/dimitri.jpg';
import rev6 from '@/assets/reviews/steven.jpg';
import rev7 from '@/assets/reviews/eva.jpg';
import rev8 from '@/assets/reviews/hicham.jpg';

// (Reviews data inline in IIFE in HTML section — exact zoals Home page)

const LP_EXTRA = `
/* ───────── LP cinematic hero ───────── */
.lp-hero-cine { min-height: 100vh; min-height: 100dvh; }
.lp-hero-cine .lf-hero-bg--slides { filter: contrast(1.04) saturate(0.96); }
.lp-hero-cine .lf-hero-bg--slides::after {
  background:
    linear-gradient(180deg, rgba(8,12,22,0.55) 0%, rgba(8,12,22,0.20) 30%, rgba(8,12,22,0.15) 70%, rgba(8,12,22,0.65) 100%);
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

/* Mobile: hero fullscreen + nav hidden-until-scroll (matcht Home gedrag) */
@media (max-width: 900px) {
  .lf-hero.lp-hero-cine { min-height: 100vh !important; min-height: 100dvh !important; height: 100dvh !important; align-items: center !important; }
  .lp-hero-cine .lf-hero-wrap { padding-top: 100px !important; padding-bottom: 60px !important; min-height: 100dvh !important; }
}
body.lp-page.is-subpage .lf-nav {
  opacity: var(--nav-sweep, 0) !important;
  transform: translateY(calc((1 - var(--nav-sweep, 0)) * -10px)) !important;
  transition: top 0.4s var(--ease) !important;
  pointer-events: none;
}
body.lp-page.is-subpage.past-hero .lf-nav { pointer-events: auto !important; }
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

.lp-hero-trust {
  margin-top: 26px;
  display: inline-flex;
  align-items: center; gap: 0;
  padding: 0;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
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

.lp-cta-microtrust {
  margin-top: 12px;
  font-size: 12.5px;
  color: rgba(255,255,255,0.74);
  font-family: var(--font-display);
  letter-spacing: 0.01em;
}
.lp-cta-microtrust b { color: rgba(255,255,255,0.92); font-weight: 600; }

/* Reviews carousel: SHELL_STYLE's .lf-testi-marquee heeft een full-bleed
   margin: 0 calc(50% - 50vw) die de marquee BUITEN de wrap trekt naar
   viewport-breed. Reset 'm hier zodat 'ie binnen wrap (1280px gecentreerd)
   blijft zoals Home. */
.lp-reviews .lf-testi-marquee {
  margin: 0 !important;
  width: 100% !important;
  padding: 56px 0 64px !important;
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 10%, #000 90%, transparent 100%) !important;
          mask-image: linear-gradient(to right, transparent 0, #000 10%, #000 90%, transparent 100%) !important;
}
.lp-reviews .lf-testi-track {
  gap: 0 !important;
  padding: 0 !important;
  animation: lf-marquee-scroll 58s linear infinite !important;
}
.lp-reviews .lf-testi-marquee:hover .lf-testi-track,
.lp-reviews .lf-testi-marquee:focus-within .lf-testi-track {
  animation-play-state: running !important;
}
@keyframes lf-marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
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
  background: var(--navy); color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 22px -10px rgba(10,22,40,0.45);
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

/* Mobile: gebruikt .lf-fab-call (telefoon-icon) uit SHELL_STYLE — zelfde als Home */

/* LP trust foot */
.lp-trust-foot {
  padding: 56px 0 80px;
  background: #fff;
  border-top: 1px solid var(--ink-line-soft);
  font-size: 13px; color: var(--ink-mute);
}
.lp-trust-foot .wrap { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
.lp-trust-foot strong { display: block; color: var(--navy); font-size: 14px; margin-bottom: 4px; }
.lp-trust-foot a { color: var(--ink-soft); text-decoration: none; }
.lp-trust-foot a:hover { color: var(--accent); }
@media (max-width: 720px) { .lp-trust-foot .wrap { grid-template-columns: 1fr 1fr; gap: 22px; } }

/* LP stats */
.lp-stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 36px; padding: 56px 0; border-bottom: 1px solid var(--ink-line-soft); }
.lp-stat { position: relative; padding-left: 18px; }
.lp-stat::before { content: ''; position: absolute; left: 0; top: 4px; bottom: 8px; width: 3px; background: var(--accent); }
.lp-stat-num { font-family: var(--font-display); font-size: clamp(28px, 3.2vw, 40px); font-weight: 700; color: var(--navy); letter-spacing: -0.025em; line-height: 1; margin-bottom: 6px; }
.lp-stat-label { font-size: 13.5px; font-weight: 500; color: var(--ink-soft); line-height: 1.45; }
@media (max-width: 900px) { .lp-stats-strip { grid-template-columns: repeat(2, 1fr); gap: 28px 20px; padding: 40px 0; } }

/* LP urgency cards */
.lp-urgency-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.lp-urgency-card { background: #fff; border: 1px solid var(--ink-line-soft); padding: 28px 26px; border-radius: 14px; transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease; }
.lp-urgency-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 22px 50px -20px rgba(15,17,21,0.22); }
.lp-urgency-num { font-family: var(--font-display); font-weight: 700; font-size: 26px; color: var(--accent); line-height: 1; margin-bottom: 14px; letter-spacing: -0.02em; }
.lp-urgency-card h4 { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--navy); margin: 0 0 8px; letter-spacing: -0.01em; }
.lp-urgency-card p { font-size: 14.5px; color: var(--ink-soft); line-height: 1.55; margin: 0; }
@media (max-width: 900px) { .lp-urgency-grid { grid-template-columns: 1fr; gap: 14px; } }

/* LP gallery */
.lp-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.lp-gallery-cell { position: relative; aspect-ratio: 4/5; overflow: hidden; border-radius: 12px; text-decoration: none; color: inherit; }
.lp-gallery-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.22,1,.36,1); }
.lp-gallery-cell:hover img { transform: scale(1.06); }
.lp-gallery-cell::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(10,22,40,0.85) 100%); pointer-events: none; }
.lp-gallery-cap { position: absolute; left: 18px; bottom: 16px; right: 18px; z-index: 2; color: #fff; }
.lp-gallery-cap small { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.78); margin-bottom: 4px; }
.lp-gallery-cap strong { display: block; font-family: var(--font-display); font-size: 16px; font-weight: 600; }
@media (max-width: 900px) { .lp-gallery { grid-template-columns: 1fr 1fr; } }

/* LP expert quote */
.lp-expert-quote { font-family: var(--font-display); font-size: clamp(20px, 2.2vw, 26px); font-weight: 500; line-height: 1.35; color: var(--navy); letter-spacing: -0.015em; margin: 0 0 24px; padding-left: 22px; border-left: 3px solid var(--accent); }
.lp-expert-name { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--navy); }
.lp-expert-role { font-size: 13.5px; color: var(--ink-mute); margin-bottom: 22px; }

/* LP form section */
.lp-form-section { background: var(--navy); color: #fff; padding: 90px 0; }
.lp-form-section h2 { color: #fff; }
/* .ab-mark default = navy text → invisible on navy bg → force goud met !important */
.lp-form-section h2 .ab-mark,
.lp-form-section .lf-h2 .ab-mark { color: var(--accent) !important; }
.lp-form-section h2 .ab-mark::after,
.lp-form-section .lf-h2 .ab-mark::after { opacity: 0.22 !important; background: rgba(255,255,255,0.18) !important; }
.lp-form-section .lf-eyebrow { background: var(--accent) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.10); }
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
.lp-form-card button[type="submit"] {
  margin-top: 4px; padding: 15px 22px;
  background: #d98c03 !important;
  background-color: #d98c03 !important;
  color: #fff !important;
  border: none;
  border-radius: 999px; font: inherit; font-weight: 700; font-size: 14.5px;
  cursor: pointer; transition: background .2s ease, transform .15s ease;
}
.lp-form-card button[type="submit"]:hover {
  background: #b87502 !important;
  background-color: #b87502 !important;
  transform: translateY(-1px);
}
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
@media (max-width: 900px) { .lp-form-grid { grid-template-columns: 1fr; gap: 32px; } .lp-form-row { grid-template-columns: 1fr; } .lp-form-card { padding: 26px 22px; } }

/* Verdiepende reads */
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

/* ───────── 3D model placeholder + gevel anatomy ───────── */
.lp-3d-frame {
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #0a1628 0%, #14233a 100%);
  border-radius: 18px;
  position: relative; overflow: hidden;
  margin: 24px 0 32px;
  isolation: isolate;
}
.lp-3d-frame::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(circle at 30% 40%, rgba(217,140,3,0.20) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(46,212,122,0.10) 0%, transparent 50%);
  animation: lp-3d-pulse 8s ease-in-out infinite;
}
@keyframes lp-3d-pulse {
  0%, 100% { transform: scale(1) translate3d(0,0,0); opacity: 0.7; }
  50%      { transform: scale(1.1) translate3d(2%, -1%, 0); opacity: 1; }
}
.lp-3d-frame::after {
  content: ''; position: absolute; inset: 0;
  background-image:
    linear-gradient(0deg, transparent 49.5%, rgba(255,255,255,0.05) 50%, transparent 50.5%),
    linear-gradient(90deg, transparent 49.5%, rgba(255,255,255,0.05) 50%, transparent 50.5%);
  background-size: 48px 48px;
  opacity: 0.6;
}
.lp-3d-placeholder {
  position: absolute; inset: 0; z-index: 2;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.78);
  gap: 10px; text-align: center; padding: 0 24px;
}
.lp-3d-icon {
  width: 64px; height: 64px; border-radius: 16px;
  background: rgba(217,140,3,0.18);
  border: 1px solid rgba(217,140,3,0.36);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--accent);
  margin-bottom: 6px;
  animation: lp-3d-icon-spin 12s linear infinite;
}
@keyframes lp-3d-icon-spin { to { transform: rotate(360deg); } }
.lp-3d-label { font-family: var(--font-display); font-size: 18px; font-weight: 600; color: #fff; }
.lp-3d-sub { font-size: 13px; letter-spacing: 0.02em; color: rgba(255,255,255,0.6); }
.lp-3d-layers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.lp-3d-layer {
  padding: 16px 18px; background: #fff;
  border: 1px solid var(--ink-line-soft); border-radius: 12px;
  font-size: 14px; color: var(--ink);
  display: flex; align-items: center; gap: 14px;
  transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
  position: relative; overflow: hidden;
}
.lp-3d-layer::before {
  content: ''; position: absolute; left: -100%; top: 0; bottom: 0; width: 100%;
  background: linear-gradient(90deg, transparent, rgba(217,140,3,0.08), transparent);
  transition: left .6s ease;
}
.lp-3d-layer:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 16px 36px -20px rgba(217,140,3,0.5); }
.lp-3d-layer:hover::before { left: 100%; }
.lp-3d-layer strong {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--accent); color: #fff;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}
@media (max-width: 760px) { .lp-3d-layers { grid-template-columns: 1fr; } }

/* Scroll-target fix — nav (~90px) compenseren bij CTA scroll-to-form */
#lp-form { scroll-margin-top: 100px; }

/* ───────── Mobile reviews: manual swipe (mirror Home pattern) ───────── */
@media (max-width: 760px) {
  .lp-reviews .lf-testi-marquee {
    position: relative;
    overflow-x: auto !important;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    padding: 8px 0 28px !important;
    height: auto;
    min-height: 0;
    -webkit-mask-image: none !important;
            mask-image: none !important;
    margin: 0 !important;
    width: 100% !important;
  }
  .lp-reviews .lf-testi-marquee::-webkit-scrollbar { display: none; }
  .lp-reviews .lf-testi-shift { position: static; transform: none !important; transition: none !important; display: block; padding: 0; }
  .lp-reviews .lf-testi-track { position: relative; display: flex; width: max-content; animation: none !important; overflow: visible; gap: 0; }
  .lp-reviews .lf-testi-set:not([data-testi-set="0"]) { display: none !important; }
  .lp-reviews .lf-testi-set[data-testi-set="0"] { display: flex; flex-wrap: nowrap; gap: 14px; padding: 4px 16px; }
  .lp-reviews .lf-testi { flex: 0 0 86%; max-width: 360px; scroll-snap-align: center; transform: none !important; opacity: 1 !important; }
  .lp-reviews .lf-testi-arrow { display: none !important; }
}

/* ───────── Hot-button word highlight (scroll-triggered, thema-oranje) ───────── */
.lp-urgency-card .lp-hot {
  background-image: linear-gradient(120deg, rgba(217,140,3,0) 50%, rgba(217,140,3,0.55) 50%);
  background-size: 220% 100%;
  background-position: 100% 0;
  background-repeat: no-repeat;
  transition: background-position 1.1s cubic-bezier(.22,1,.36,1);
  padding: 1px 5px; border-radius: 3px; font-weight: 700; color: var(--navy);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.lp-urgency-card.revealed .lp-hot {
  background-position: 0 0;
  transition-delay: calc(var(--lp-hot-delay, 0) * 1ms);
}
.lp-reviews-swipe-hint { display: none; }
@media (max-width: 760px) {
  .lp-reviews-swipe-hint {
    display: inline-flex; align-items: center; gap: 8px;
    margin-top: 6px;
    font-family: var(--font-display);
    font-size: 12.5px; color: var(--ink-mute);
    letter-spacing: 0.02em;
  }
  .lp-reviews-swipe-hint svg { animation: lp-swipe-nudge 1.8s ease-in-out infinite; }
  @keyframes lp-swipe-nudge {
    0%, 100% { transform: translateX(0); opacity: 0.6; }
    50%      { transform: translateX(6px); opacity: 1; }
  }
}

/* Stats count-up bloom */
.lp-stat-num { display: inline-block; transition: color .35s ease; }
.lp-stat[data-counted] .lp-stat-num { animation: lp-stat-pop 0.6s ease-out; }
@keyframes lp-stat-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.06); color: var(--accent); }
  100% { transform: scale(1); }
}

/* Premie box icon: pulsing goud */
.lp-premie-ico { position: relative; animation: lp-premie-glow 3.6s ease-in-out infinite; }
@keyframes lp-premie-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(10,22,40,0.45), 0 8px 22px -10px rgba(10,22,40,0.45); }
  50%      { box-shadow: 0 0 0 10px rgba(10,22,40,0), 0 12px 30px -10px rgba(10,22,40,0.6); }
}

/* Urgency card: gradient sweep on hover */
.lp-urgency-card { position: relative; overflow: hidden; }
.lp-urgency-card::before {
  content: ''; position: absolute; left: -100%; top: 0; bottom: 0; width: 100%;
  background: linear-gradient(90deg, transparent, rgba(217,140,3,0.08), transparent);
  transition: left .7s cubic-bezier(.22,1,.36,1); pointer-events: none;
}
.lp-urgency-card:hover::before { left: 100%; }

/* Form select dropdown — modern, clean, premium */
.lp-form-card select {
  font: inherit; font-size: 15px;
  width: 100%;
  padding: 14px 44px 14px 16px;
  border: 1px solid var(--ink-line);
  border-radius: 12px;
  background-color: #fff;
  color: var(--ink);
  cursor: pointer;
  appearance: none; -webkit-appearance: none; -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230a1628' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
  font-weight: 500;
  line-height: 1.4;
}
.lp-form-card select:hover {
  border-color: rgba(217,140,3,0.5);
  background-color: #fafafa;
}
.lp-form-card select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(217,140,3,0.18);
}
.lp-form-card select:invalid { color: var(--ink-mute); }
.lp-form-card select option { color: var(--ink); padding: 12px; }
.lp-form-card select option:first-child { color: var(--ink-mute); }

/* Sticky desktop CTA — ALTIJD goud (background op base + media + inline) */
.lp-sticky-cta {
  display: none;
  background: #d98c03 !important;
  background-color: #d98c03 !important;
  color: #fff !important;
}
@media (min-width: 901px) {
  .lp-sticky-cta {
    position: fixed !important;
    right: 24px; bottom: 24px;
    z-index: 60;
    display: inline-flex !important;
    align-items: center;
    gap: 10px;
    padding: 14px 24px;
    font-family: var(--font-display); font-weight: 600; font-size: 14px;
    text-decoration: none;
    border-radius: 999px;
    box-shadow: 0 14px 36px -10px rgba(217,140,3,0.55), 0 2px 4px rgba(15,17,21,0.08);
    transition: transform .2s ease, box-shadow .25s ease;
  }
  .lp-sticky-cta:hover {
    transform: translateY(-2px);
    background: #b87502 !important;
    background-color: #b87502 !important;
    box-shadow: 0 20px 44px -10px rgba(217,140,3,0.7), 0 2px 4px rgba(15,17,21,0.08);
  }
}

/* Inline CTA banner */
.lp-cta-banner {
  margin: 0; padding: 26px 34px;
  background: linear-gradient(135deg, #0a1628 0%, #14233a 100%);
  border-radius: 18px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  color: #fff;
  position: relative; overflow: hidden; isolation: isolate;
}
.lp-cta-banner::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at 85% 50%, rgba(217,140,3,0.18) 0%, transparent 55%);
  pointer-events: none;
}
.lp-cta-banner-text { flex: 1; position: relative; z-index: 2; }
.lp-cta-banner-text strong {
  display: block; font-family: var(--font-display); font-size: 19px; font-weight: 700;
  letter-spacing: -0.012em; margin-bottom: 4px; color: #fff;
}
.lp-cta-banner-text span { font-size: 14px; color: rgba(255,255,255,0.78); }
.lp-cta-banner-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 24px;
  background: #d98c03 !important; color: #fff !important;
  font-family: var(--font-display); font-weight: 700; font-size: 14px;
  text-decoration: none; border-radius: 999px;
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
  white-space: nowrap; position: relative; z-index: 2;
  box-shadow: 0 8px 22px -8px rgba(217,140,3,0.6);
}
.lp-cta-banner-cta:hover {
  background: #b87502 !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -8px rgba(217,140,3,0.75);
}
@media (max-width: 720px) {
  .lp-cta-banner { flex-direction: column; padding: 22px 22px; gap: 16px; text-align: center; }
  .lp-cta-banner-cta { width: 100%; justify-content: center; }
}
`;

const HTML = `
<section class="lf-hero lp-hero-cine">
  <div class="lf-hero-bg lf-hero-bg--slides" data-hero-slides>
    <img src="${hero1}" alt="Witte crepi gevelrenovatie rijwoning — AB Gevelbekleding Mechelen" class="is-active" />
    <img src="${hero2}" alt="Grijze crepi halfopen woning — AB Bouw Groep Antwerpen" loading="lazy" />
    <img src="${hero3}" alt="Steenstrips voorgevel — AB Gevelbekleding Lier" loading="lazy" />
    <img src="${hero4}" alt="Sierpleister marmorino afwerking — Bornem" loading="lazy" />
  </div>
  <button type="button" class="lf-hero-arrow lf-hero-arrow--prev" data-hero-prev aria-label="Vorige foto">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  </button>
  <button type="button" class="lf-hero-arrow lf-hero-arrow--next" data-hero-next aria-label="Volgende foto">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
  <div class="wrap lf-hero-wrap">
    <div class="lf-hero-mini" data-hero-anim>
      <span class="lf-hero-eyebrow"><span class="lf-hero-eyebrow-dot"></span>AB Gevelbekleding · Willebroek</span>
      <h1 class="lf-hero-headline">
        Nieuwe gevel.<br/>Strak afgewerkt. EPC-sprong.
      </h1>
      <p class="lf-hero-sub">Crepi, ETICS-buitenisolatie, steenstrips en sierpleister in Mechelen, Antwerpen, Lier en heel Vlaanderen. <strong style="color:#fff;">Gratis plaatsbezoek</strong> binnen 5 werkdagen · <strong style="color:#fff;">bindende offerte</strong> · <strong style="color:#fff;">60 EPC-punten</strong> winst gemiddeld.</p>
      <div class="lf-hero-actions">
        <a href="#lp-form" class="lf-cta-pill" data-smooth>
          <span>Gratis gevelinspectie aanvragen</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
        <a href="tel:+32470634413" class="lf-hero-ghost">
          <span>Bel +32 470 63 44 13</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
      <p class="lp-cta-microtrust"><b>Antwoord binnen 1 werkdag.</b> Vrijblijvend en gratis.</p>
      <div class="lp-hero-trust">
        <span><span class="lp-hero-trust-stars">★★★★★</span><b>4,9 / 5</b></span>
        <span><b>184+</b> klanten</span>
        <span><b>10 jaar</b> garantie</span>
        <span><span class="lp-hero-trust-dot"></span>Gratis plaatsbezoek</span>
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

<section class="lf-section lf-tone-soft lf-reviews-section lp-reviews" style="padding: 56px 0;">
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
          <span class="lf-reviews-count">96+ gevelprojecten beoordeeld</span>
        </div>
      </div>
      <span class="lp-reviews-swipe-hint" aria-hidden="true">
        Swipe voor meer reviews
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </span>
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
          ${(() => {
            const reviews = [
              { name: 'Jasmien De Backer', role: 'Witte crepi rijwoning · Mechelen', img: rev1, text: 'Onze rijwoning had een vermoeide bezetting uit de jaren ’80. Nu een spierwitte crepi-gevel die je zo van een interieurmagazine plukt. De buren komen vragen wie het werk gedaan heeft. Strak, proper, op tijd opgeleverd.', highlights: ['spierwitte crepi-gevel', 'op tijd opgeleverd'] },
              { name: 'Joris Vanhove', role: 'ETICS + crepi · Boom', img: rev2, text: 'Volledig pakket: 16 cm EPS-isolatie + crepi-afwerking. EPC van F naar C in één werk. Stookkost deze winter bijna gehalveerd, en de muren binnen voelen niet meer koud aan. Premie-dossier (€4.800) liep via hen.', highlights: ['EPC van F naar C', 'bijna gehalveerd', '€4.800'] },
              { name: 'Marius Ionescu', role: 'Steenstrips voorgevel · Lier', img: rev3, text: 'We wilden de klassieke Vlaamse baksteen-look zonder het gewicht en de kost van echte stenen. Steenstrips Vandersanden, voegen kaarsrecht, aansluitingen rond ramen vakwerk. Niemand merkt het verschil — zelfs onze schoonvader niet.', highlights: ['voegen kaarsrecht', 'zelfs onze schoonvader niet'] },
              { name: 'Cindy Van Looy', role: 'Sierpleister marmorino · Bornem', img: rev4, text: 'Marmorino-afwerking in zachte taupe. Bardh hielp met de kleurkeuze — wij wilden eerst grijs, hij overtuigde ons van een warmere tint. Achteraf super blij, het huis straalt nu echt karakter uit.', highlights: ['zachte taupe', 'super blij', 'echt karakter'] },
              { name: 'Dimitri Maes', role: 'Crepi + buitenisolatie · Antwerpen', img: rev5, text: 'Halfopen woning uit 1968 die nooit was geïsoleerd. 16 cm EPS buitenisolatie + crepi. Comfort-sprong is enorm: geen koude muren meer in de winter. Premie €5.400 zonder problemen uitbetaald.', highlights: ['Comfort-sprong is enorm', '€5.400 zonder problemen'] },
              { name: 'Steven Goossens', role: 'Gevelherstel + crepi · Willebroek', img: rev6, text: 'Onze gevel had scheuren en vochtproblemen. Drie aannemers wilden direct crepi erop smeren. Bardh zei: eerst herstellen, anders gooi je geld weg. Uitgevoerd zoals beloofd. Factuur tot op de euro met de offerte.', highlights: ['eerst herstellen', 'tot op de euro'] },
              { name: 'Eva Vandeputte', role: 'Witte crepi nieuwbouw · Kontich', img: rev7, text: 'Nieuwbouw afgewerkt met witte crepi op de spouwmuur. Strakke lijn over de volledige gevel, geen scheuren of vlekken. Plaatsing in 5 werkdagen, stelling weg, oprit proper opgekuist, klaar.', highlights: ['Strakke lijn', '5 werkdagen', 'proper opgekuist'] },
              { name: 'Hicham Bouali', role: 'Gevelisolatie + nieuwe crepi · Mechelen', img: rev8, text: 'Eerste aannemer wilde alleen crepi over de bestaande gevel. AB Bouw legde uit waarom we ETICS-isolatie nodig hadden. Hogere prijs, veel betere oplossing. EPC + comfort vlot. Geen spijt van die keuze.', highlights: ['veel betere oplossing', 'Geen spijt'] },
            ];
            const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const wrapWords = (phrase: string, baseI: number) => {
              const words = phrase.split(/(\s+)/);
              let wi = 0;
              return words.map((w) => {
                if (/^\s+$/.test(w)) return w;
                const idx = baseI + wi;
                wi += 1;
                return `<span class="lf-hl-word" style="--hl-i:${idx}">${w}</span>`;
              }).join('');
            };
            const highlight = (text: string, terms: string[]) => {
              let out = text;
              let wordOffset = 0;
              terms.forEach((term) => {
                const re = new RegExp(escapeRe(term), 'i');
                out = out.replace(re, (m) => {
                  const wrapped = `<mark class="lf-hl">${wrapWords(m, wordOffset)}</mark>`;
                  wordOffset += m.trim().split(/\s+/).length;
                  return wrapped;
                });
              });
              return out;
            };
            const loopedSets = [-1, 0, 1];
            return loopedSets.map((setIdx) => `
              <div class="lf-testi-set" data-testi-set="${setIdx}"${setIdx !== 0 ? ' aria-hidden="true"' : ''}>
                ${reviews.map((t, reviewIdx) => `
                  <article class="lf-testi" data-review-index="${reviewIdx}">
                    <div class="lf-testi-stars">★★★★★</div>
                    <p>${highlight(t.text, t.highlights)}</p>
                    <div class="lf-testi-divider"></div>
                    <div class="lf-testi-foot">
                      <img class="lf-testi-avatar" src="${t.img}" alt="${t.name}" loading="lazy"/>
                      <div class="lf-testi-meta">
                        <strong>${t.name}</strong>
                        <span>${t.role}</span>
                      </div>
                      <svg class="lf-testi-google" viewBox="0 0 48 48" width="22" height="22" aria-label="Review">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"/>
                        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.2 5.2C41.4 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                      </svg>
                    </div>
                  </article>
                `).join('')}
              </div>
            `).join('');
          })()}
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
        <span>10-jarige polis bij <strong>Federale Verzekering</strong></span>
      </span>
      <span class="lp-trust-divider"></span>
      <span class="lp-trust-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span><strong>10 jaar</strong> garantie afwerking</span>
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
      <div class="lp-stat" data-reveal><div class="lp-stat-num" data-count-up="32180" data-count-suffix=" m²">0 m²</div><div class="lp-stat-label">Gevelvlak afgewerkt sinds 2010</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="1"><div class="lp-stat-num" data-count-up="60" data-count-suffix=" EPC">0 EPC</div><div class="lp-stat-label">Gemiddelde puntenwinst per project</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="2"><div class="lp-stat-num" data-count-up="40" data-count-suffix="%">0%</div><div class="lp-stat-label">Lagere stookkost na ETICS</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="3"><div class="lp-stat-num" data-count-up="55" data-count-prefix="€" data-count-suffix="/m²">€0/m²</div><div class="lp-stat-label">Premie buitenisolatie 2026</div></div>
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
        <strong>Premie 2026: €55/m² — daarna minder.</strong>
        <p>Op een halfopen woning <strong style="color:var(--navy);">€4.500–€7.200 terug</strong>. Vanaf 2027 zakt het tarief — wie nu boekt zet de 2026-premie vast in offerte. Wij regelen het volledige dossier.</p>
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
        <span class="lf-eyebrow">Waarom een gevelrenovatie loont</span>
        <h2 class="lf-h2">EPC-sprong,<br/><span class="ab-mark">strak resultaat</span>.</h2>
        <p class="lf-lede">Een ongeïsoleerde gevel verliest tot 40% van uw stookkost. Een ETICS-renovatie verlaagt EPC met gemiddeld 60 punten én geeft uw huis een volledig nieuwe uitstraling — vaak doorslaggevend bij verkoop.</p>
        <ul class="ab-checks" style="margin-top: 22px;">
          <li>40% lagere stookkost vanaf de eerste winter</li>
          <li>EPC-sprong gemiddeld 60 punten — klaar voor renovatieplicht 2028</li>
          <li>Geen koudebruggen, geen vochtschimmel meer — gezonder binnenklimaat</li>
          <li>€12.000–€25.000 meerwaarde bij verkoop</li>
        </ul>
        <a href="#lp-form" class="lf-cta-pill" style="margin-top: 28px;">
          <span>Vraag uw gratis plaatsbezoek aan</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgBenefits}" alt="Grijze crepi gevelrenovatie" loading="lazy"/></div>
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
        <p>Mijn VerbouwPremie voor buitenisolatie staat in 2026 op €55/m² maar wordt <mark class="lp-hot" style="--lp-hot-delay:120">elk jaar verlaagd</mark>. Op een halfopen woning bespaart u nu <mark class="lp-hot" style="--lp-hot-delay:340">€4.500-€7.200</mark> die u in 2027 <mark class="lp-hot" style="--lp-hot-delay:560">niet meer krijgt</mark>.</p>
      </div>
      <div class="lp-urgency-card" data-reveal data-reveal-delay="1">
        <div class="lp-urgency-num">02</div>
        <h4>EPC-verplichting 2028</h4>
        <p>Vanaf 2028 moet elke gekochte woning binnen 5 jaar <mark class="lp-hot" style="--lp-hot-delay:120">EPC-label C halen</mark>. Wie nu renoveert is voorbereid; wie wacht riskeert <mark class="lp-hot" style="--lp-hot-delay:340">sancties en lagere verkoopprijs</mark>.</p>
      </div>
      <div class="lp-urgency-card" data-reveal data-reveal-delay="2">
        <div class="lp-urgency-num">03</div>
        <h4>Klaar binnen 2 weken</h4>
        <p>Begin nu en uw gevel is <mark class="lp-hot" style="--lp-hot-delay:120">binnen 2 weken afgewerkt</mark>. Wachten betekent één extra winter zonder isolatie — al snel <mark class="lp-hot" style="--lp-hot-delay:340">honderden euro's extra stookkost</mark>.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf-section" style="padding: 0 0 8px;">
  <div class="wrap">
    <div class="lp-cta-banner" data-reveal>
      <div class="lp-cta-banner-text">
        <strong>Vandaag bellen = volgende week opname.</strong>
        <span>Gratis plaatsbezoek binnen 5 werkdagen · vrijblijvende offerte · 10 jaar garantie.</span>
      </div>
      <a href="#lp-form" class="lp-cta-banner-cta" data-smooth>
        Plan mijn gratis gevelinspectie
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div class="lf-split-img" data-reveal><img src="${imgProcess}" alt="Stelling tegen halfopen gevel" loading="lazy"/></div>
      <div data-reveal data-reveal-delay="1">
        <span class="lf-eyebrow">Onze werkwijze</span>
        <h2 class="lf-h2">Van eerste gesprek tot<br/><span class="ab-mark">strakke gevel</span> in 5-7 weken.</h2>
        <p class="lf-lede">Eigen gevelploeg betekent: geen onderaannemers, geen tussenstops, één verantwoordelijke. Wij beginnen en wij maken het af.</p>
        <ul class="ab-checks" style="margin-top: 22px;">
          <li><strong>Week 1</strong> — Gratis plaatsbezoek, gevelopname, eerste richtprijs</li>
          <li><strong>Week 2</strong> — Bindende offerte, materialen vastgezet, premiedossier voorbereid</li>
          <li><strong>Week 3-5</strong> — Uitvoering 10-18 werkdagen, weekrapport per email</li>
          <li><strong>Oplevering</strong> — Premie ingediend, 10 jaar garantie schriftelijk vastgelegd</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 28px;">
      <span class="lf-eyebrow">Interactief</span>
      <h2 class="lf-h2">Uw gevel in <span class="ab-mark">3D</span> — opbouw uitgelegd.</h2>
      <p class="lf-lede" style="margin: 14px auto 0; max-width: 620px;">Beweeg, draai, zoom in. Zo zit een ETICS-gevel in elkaar — van bestaande muur tot crepi-afwerking, zes lagen vakwerk.</p>
    </div>
    <div class="lp-3d-frame" data-reveal>
      <div class="lp-3d-placeholder">
        <span class="lp-3d-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </span>
        <span class="lp-3d-label">3D model komt hier</span>
        <span class="lp-3d-sub">Drag to rotate · Scroll to zoom · Click to inspect layer</span>
      </div>
    </div>
    <div class="lp-3d-layers" data-reveal data-reveal-delay="1">
      <div class="lp-3d-layer"><strong>1</strong> Bestaande spouwmuur</div>
      <div class="lp-3d-layer"><strong>2</strong> Lijmlaag + pluggen</div>
      <div class="lp-3d-layer"><strong>3</strong> EPS-isolatieplaten 16cm</div>
      <div class="lp-3d-layer"><strong>4</strong> Wapeningsnet + grondlaag</div>
      <div class="lp-3d-layer"><strong>5</strong> Crepi-afwerking</div>
      <div class="lp-3d-layer"><strong>6</strong> Aansluitingen + dilataties</div>
    </div>
  </div>
</section>

<section class="lf-section" style="padding: 8px 0 32px;">
  <div class="wrap">
    <div class="lp-cta-banner" data-reveal>
      <div class="lp-cta-banner-text">
        <strong>Eerlijk advies, op uw eigen tempo.</strong>
        <span>Bardh komt langs en zegt eerlijk: crepi volstaat, of toch ETICS. Vrijblijvend en gratis.</span>
      </div>
      <a href="tel:+32470634413" class="lp-cta-banner-cta">
        Bel Bardh direct
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </a>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head" data-reveal style="margin-bottom: 36px;">
      <span class="lf-eyebrow">Realisaties</span>
      <h2 class="lf-h2">Gevels die<br/><span class="ab-mark">jaren strak blijven</span>.</h2>
    </div>
    <div class="lp-gallery">
      <a href="#lp-form" class="lp-gallery-cell" data-reveal>
        <img src="${hero1}" alt="Witte crepi Mechelen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Crepi</small><strong>Witte crepi — Mechelen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="1">
        <img src="${hero2}" alt="Grijze crepi Antwerpen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Crepi</small><strong>Grijze crepi — Antwerpen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="2">
        <img src="${hero3}" alt="Steenstrips Lier" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Steenstrips</small><strong>Klassieke look — Lier</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="3">
        <img src="${hero4}" alt="Sierpleister Bornem" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Sierpleister</small><strong>Marmorino — Bornem</strong></div>
      </a>
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
      <details data-reveal><summary>Wat kost een crepi-gevel in 2026?</summary><div class="ab-faq-body"><p>Crepi alleen op bestaande gevel (130m²): €6.500-€12.500. Volledige ETICS met buitenisolatie + crepi: €18.000-€32.000 alles inbegrepen. Premie €55/m² haalt €4.500-€7.200 van de factuur. Bindende richtprijs na plaatsbezoek.</p></div></details>
      <details data-reveal><summary>Hoe lang duurt de plaatsing?</summary><div class="ab-faq-body"><p>Crepi op bestaande gevel: 5-9 werkdagen. ETICS volledig (isolatie + afwerking): 10-18 werkdagen. Inclusief stelling, afdekken en eindopkuis.</p></div></details>
      <details data-reveal><summary>Crepi of steenstrips — wat past bij mijn woning?</summary><div class="ab-faq-body"><p>Crepi = strakke moderne look, goedkoper, sneller. Steenstrips = klassieke baksteen-look, duurder, langere plaatsing. Plaatsbezoek geeft uitsluitsel op basis van woningtype, buurt en budget. Beide kunnen op ETICS-isolatie.</p></div></details>
      <details data-reveal><summary>Doen jullie de premieaanvraag?</summary><div class="ab-faq-body"><p>Ja, standaard. We bereiden het Mijn VerbouwPremie-dossier voor, leveren foto's en facturen aan in juist format. U deelt enkel uw burgerprofiel-login.</p></div></details>
      <details data-reveal><summary>Wat is uw garantie?</summary><div class="ab-faq-body"><p>10 jaar wettelijke aansprakelijkheid op afwerking en isolatieprestatie, gedekt door polis bij Federale Verzekering. Plus fabrieksgarantie op Sto/Weber/Marmorino-systemen.</p></div></details>
      <details data-reveal><summary>Welke regio's bedienen jullie?</summary><div class="ab-faq-body"><p>Volledige provincie Antwerpen en Vlaams-Brabant. Onze ploeg vertrekt elke ochtend uit Willebroek — werkbereik tot ongeveer 50 km. Mechelen, Antwerpen, Lier, Boom, Bornem, Puurs, Sint-Niklaas, Heist-op-den-Berg, Brussel-rand, Vilvoorde, Aalst, Dendermonde, Leuven. Twijfel je over jouw gemeente? Bel even — als we ‘ja’ zeggen, komen we.</p></div></details>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 40px;">
      <span class="lf-eyebrow">Verdiepende reads</span>
      <h2 class="lf-h2">Eerst wat <span class="ab-mark">leren</span> over gevels?</h2>
      <p class="lf-lede" style="margin: 16px auto 0; max-width: 620px;">Drie artikelen die de meest gestelde vragen beantwoorden.</p>
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
        <span class="lf-eyebrow">Gratis gevelinspectie</span>
        <h2 class="lf-h2" style="color:#fff;">Vraag uw <span class="ab-mark">gratis gevelinspectie</span> aan.</h2>
        <p>Binnen 5 werkdagen komt onze gevelploeg langs. Volledige opname, eerste richtprijs ter plaatse, premiedossier doorgesproken — vrijblijvend en gratis.</p>
        <ul>
          <li>Plaatsbezoek binnen 5 werkdagen</li>
          <li>Bindende offerte op papier</li>
          <li>Premiedossier inbegrepen (gem. €4.500+ terug)</li>
          <li>10 jaar garantie op afwerking</li>
          <li>Eigen gevelploeg, geen onderaannemers</li>
        </ul>
      </div>
      <div class="lp-form-card" data-reveal data-reveal-delay="1" data-lp-form-wrapper>
        <h3>Plan uw gratis gevelinspectie</h3>
        <p class="lf-form-sub">We bellen u binnen één werkdag terug om een afspraak in te plannen.</p>
        <form data-lp-form novalidate>
          <div class="lp-form-row">
            <input type="text" name="firstName" placeholder="Voornaam *" required autocomplete="given-name" />
            <input type="text" name="lastName" placeholder="Familienaam *" required autocomplete="family-name" />
          </div>
          <input type="email" name="email" placeholder="E-mailadres *" required autocomplete="email" />
          <input type="tel" name="phone" placeholder="Telefoonnummer *" required autocomplete="tel" />
          <select name="type_gevel" required>
            <option value="">Type gevelwerk *</option>
            <option value="crepi_alleen">Crepi op bestaande gevel</option>
            <option value="etics_crepi">ETICS + crepi (buitenisolatie)</option>
            <option value="steenstrips">Steenstrips</option>
            <option value="sierpleister">Sierpleister (marmorino e.a.)</option>
            <option value="reiniging">Gevelreiniging</option>
            <option value="herstel">Gevelherstel (scheuren, vocht)</option>
            <option value="anders">Anders / weet niet zeker</option>
          </select>
          <input type="text" name="straat" placeholder="Straat en nummer" autocomplete="street-address" />
          <div class="lp-form-row">
            <input type="text" name="postcode" placeholder="Postcode" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="postal-code" />
            <input type="text" name="gemeente" placeholder="Gemeente" autocomplete="address-level2" />
          </div>
          <textarea name="aanvullende_info" placeholder="Vertel kort over uw gevel (oppervlakte, leeftijd, klacht)"></textarea>
          <button type="submit" data-lp-submit style="background:#d98c03 !important; color:#fff !important;">Vraag gratis gevelinspectie aan</button>
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
    <div><strong>AB Bouw Groep</strong>August van Landeghemstraat 65<br/>2830 Willebroek</div>
    <div><strong>Telefoon</strong><a href="tel:+32470634413">+32 470 63 44 13</a></div>
    <div><strong>Email</strong><a href="mailto:info@abgroep.be">info@abgroep.be</a></div>
    <div><strong>Erkenningen</strong>VCA*-gecertificeerd<br/>Lid Bouwunie</div>
  </div>
</section>

<a href="#lp-form" class="lp-sticky-cta" aria-label="Vraag gevelinspectie" style="background-color:#d98c03 !important; background-image:none !important; background:#d98c03 !important; color:#fff !important;">
  Vraag gratis gevelinspectie aan
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
</a>

<a href="tel:+32470634413" class="lf-fab-call" aria-label="Bel ons direct">
  <span class="lf-fab-pulse"></span>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
</a>
`;

export default function LpGevel() {
  useEffect(() => {
    document.title = "Gevelrenovatie Mechelen, Antwerpen & Vlaanderen — Gratis gevelinspectie | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Nieuwe gevel in Mechelen, Antwerpen, Lier en heel Vlaanderen. Crepi, ETICS-isolatie, steenstrips. Eigen ploeg, 10 jaar garantie, premiedossier inbegrepen.');

    const prev = document.body.className;
    document.body.className = 'lp-page is-subpage';
    try { sessionStorage.setItem('ab_last_lp', '/lp/gevel'); } catch {}
    const style = document.createElement('style');
    style.textContent = SHELL_STYLE + LP_EXTRA;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    // ── Reviews carousel: Home's CSS + JS centering bovenop (LP-specifiek omdat
    // reviews direct onder hero komen, animatie is niet vooruit gelopen).
    // Reviews carousel: GEEN custom JS — hook + LP_EXTRA CSS = Home gedrag.

    // ── Stats count-up animation
    const formatNl = (n: number) => n.toLocaleString('nl-BE');
    const animateCount = (el: HTMLElement) => {
      const target = parseInt(el.dataset.countUp || '0', 10);
      if (!target || isNaN(target)) return;
      const prefix = el.dataset.countPrefix || '';
      const suffix = el.dataset.countSuffix || '';
      const duration = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.floor(eased * target);
        el.textContent = prefix + formatNl(current) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + formatNl(target) + suffix;
      };
      requestAnimationFrame(tick);
    };
    const countNums = document.querySelectorAll<HTMLElement>('[data-count-up]');
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting && !el.dataset.counted) {
          el.dataset.counted = '1';
          animateCount(el);
          el.parentElement?.setAttribute('data-counted', '1');
        }
      });
    }, { threshold: 0.4 });
    countNums.forEach((el) => countObserver.observe(el));

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
        landing_division: 'ab_gevelbekleding',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email: (fd.get('email') as string) || '',
        phone: (fd.get('phone') as string) || undefined,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: ((fd.get('type_gevel') as string) || 'ab_gevelbekleding'),
        aanvullende_info: (fd.get('aanvullende_info') as string) || undefined,
        bron_lead: 'ads:gevel',
      });
      if (result.ok) {
        wrap.classList.add('is-success');
      } else {
        wrap.classList.add('is-error');
        if (errBox) errBox.textContent = 'Er ging iets mis. Bel ons gerust op +32 470 63 44 13.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag gratis gevelinspectie aan'; }
      }
    };
    form?.addEventListener('submit', onSubmit);

    return () => {
      document.body.className = prev;
      style.remove();
      form?.removeEventListener('submit', onSubmit);
      countObserver.disconnect();
    };
  }, []);

  useAbBouwInteractions();

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
