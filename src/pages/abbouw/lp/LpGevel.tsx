import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { SHELL_STYLE } from '../_shell';
import { submitLead } from '@/lib/leads';
import type { Gemeente } from '@/data/gemeentes';
import { CONTACT } from '@/data/contact';
import { BLOGS } from '@/data/blogs';
import logo from '@/assets/home/logo.png';

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

// 5 FLUX-Ultra premium gevel-anatomy layer renders (ETICS opbouw)
import gevCross from '@/assets/gevel/lp-anatomy-cross.jpg';
import gevL1 from '@/assets/gevel/lp-anatomy-l1.jpg';
import gevL2 from '@/assets/gevel/lp-anatomy-l2.jpg';
import gevL3 from '@/assets/gevel/lp-anatomy-l3.jpg';
import gevL4 from '@/assets/gevel/lp-anatomy-l4.jpg';
import gevL5 from '@/assets/gevel/lp-anatomy-l5.jpg';

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
/* ───────── Mini LP-header (logo + telefoon, geen menu) ─────────
   LP's hebben bewust geen volledige nav (zou afleiden van conversion-flow),
   maar wel een brand-anchor zodat ads-traffic weet bij wie ze geland zijn. */
.lp-mini-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 50;
  background: linear-gradient(180deg, rgba(8,12,22,0.55) 0%, rgba(8,12,22,0.25) 70%, rgba(8,12,22,0) 100%);
  pointer-events: none;
}
.lp-mini-header > * { pointer-events: auto; }
.lp-mini-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 0;
}
.lp-mini-brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  background: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(8,12,22,0.18);
}
.lp-mini-logo { height: 30px; width: auto; display: block; }
.lp-mini-phone {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--navy);
  color: #fff !important;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
}
.lp-mini-phone:hover { background: #08213d; transform: translateY(-1px); }
.lp-mini-phone svg { flex-shrink: 0; }
@media (max-width: 720px) {
  .lp-mini-header-inner { padding: 14px 0; }
  .lp-mini-logo { height: 24px; }
  .lp-mini-brand { padding: 6px 10px; }
  .lp-mini-phone { padding: 9px 14px; font-size: 13px; }
  .lp-mini-phone-label { display: none; }
}

/* ───────── Hero mini-form (above-fold quick-capture) ───────── */
.lp-quick-form {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 50px -22px rgba(15,23,42,0.30), 0 4px 12px -4px rgba(15,23,42,0.08);
  padding: 26px 28px 24px;
  max-width: 880px;
  margin: -60px auto 0;
  position: relative;
  z-index: 4;
  overflow: hidden;
}
.lp-quick-form::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d98c03 0%, #f0a83a 50%, #d98c03 100%);
}
.lp-quick-form-head { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.lp-quick-form-head-icon {
  width: 38px; height: 38px; border-radius: 10px; background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.lp-quick-form-title {
  font-family: var(--font-display); font-size: 17px; font-weight: 700;
  color: var(--navy); line-height: 1.2; letter-spacing: -0.01em;
}
.lp-quick-form-sub { font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; }
.lp-quick-form form {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; align-items: stretch;
}
.lp-quick-form input {
  padding: 14px 16px; border: 1px solid var(--ink-line); border-radius: 10px;
  font: inherit; font-size: 14.5px; color: var(--ink); background: #fff;
  transition: border-color .2s ease, box-shadow .2s ease; width: 100%;
}
.lp-quick-form input:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(217,140,3,0.18);
}
.lp-quick-form button[type="submit"] {
  grid-column: 1 / -1; margin-top: 4px;
  padding: 16px 28px; border-radius: 12px; border: none;
  background: #d98c03 !important; background-color: #d98c03 !important;
  color: #ffffff !important;
  font: inherit; font-size: 15.5px; font-weight: 700; letter-spacing: -0.01em;
  cursor: pointer; transition: background .15s ease, transform .15s ease, box-shadow .2s ease;
  display: inline-flex !important; align-items: center; justify-content: center; gap: 10px;
  white-space: nowrap; width: 100%;
  box-shadow: 0 8px 20px -8px rgba(217,140,3,0.55);
}
.lp-quick-form button[type="submit"]:hover {
  background: #c47a02 !important; background-color: #c47a02 !important;
  transform: translateY(-1px);
  box-shadow: 0 12px 26px -10px rgba(217,140,3,0.65);
}
.lp-quick-form button[type="submit"]:active { transform: translateY(0); }
.lp-quick-form button[type="submit"]:disabled { opacity: 0.7; cursor: wait; }
.lp-quick-form button[type="submit"] svg { flex-shrink: 0; }
.lp-quick-form-error { font-size: 13px; color: #c4523f; background: #fcebe5; border-radius: 8px; padding: 8px 12px; margin-top: 10px; }
.lp-quick-form-thanks { display: none; text-align: center; padding: 32px 24px; }
.lp-quick-form.is-success form,
.lp-quick-form.is-success .lp-quick-form-head { display: none; }
.lp-quick-form.is-success .lp-quick-form-thanks { display: block; }
.lp-quick-form-thanks-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: #d1f5e3; color: #0f7a4a;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
}
.lp-quick-form-thanks h4 { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--navy); margin: 0 0 6px; }
.lp-quick-form-thanks p { font-size: 14px; color: var(--ink-soft); line-height: 1.5; margin: 0; }
@media (max-width: 720px) {
  .lp-quick-form { margin: -50px 12px 0; padding: 16px 16px 18px; border-radius: 14px; box-shadow: 0 24px 60px -24px rgba(0,0,0,0.4), 0 8px 20px -8px rgba(0,0,0,0.18); }
  .lp-quick-form-title { font-size: 15px !important; line-height: 1.25 !important; }
  .lp-quick-form-sub { font-size: 11.5px !important; }
  .lp-quick-form input { padding: 13px 14px !important; font-size: 15px !important; }
  .lp-quick-form button[type="submit"] { padding: 14px 22px !important; font-size: 14.5px !important; }
  .lp-quick-form-head { margin-bottom: 12px; }
  .lp-quick-form-title { font-size: 15.5px; }
  .lp-quick-form-sub { font-size: 12px; }
  .lp-quick-form form { grid-template-columns: 1fr; gap: 10px; }
  .lp-quick-form button[type="submit"] { grid-column: 1; margin-top: 6px; padding: 15px 22px; font-size: 15px; }
}

/* ───────── Calculator-CTA banner ───────── */
.lp-calc-cta-section { background: var(--bg); padding: 32px 0 8px; }
.lp-calc-cta {
  display: grid; grid-template-columns: auto 1fr auto; gap: 22px;
  align-items: center; max-width: 920px; margin: 0 auto;
  background: linear-gradient(135deg, #fff 0%, #fff8ec 100%);
  border: 1.5px solid rgba(217,140,3,0.32); border-radius: 18px;
  padding: 22px 28px; text-decoration: none;
  box-shadow: 0 10px 32px -14px rgba(217,140,3,0.25);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.lp-calc-cta:hover { transform: translateY(-3px); border-color: #d98c03; box-shadow: 0 16px 40px -16px rgba(217,140,3,0.45); }
.lp-calc-cta-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: #d98c03; color: #fff;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 8px 20px -8px rgba(217,140,3,0.55);
}
.lp-calc-cta-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.lp-calc-cta-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #d98c03; }
.lp-calc-cta-title { font-family: var(--font-display); font-size: clamp(18px, 2.2vw, 22px); font-weight: 700; color: var(--navy); line-height: 1.25; }
.lp-calc-cta-em { background: linear-gradient(transparent 62%, rgba(217,140,3,0.32) 62%); padding: 0 3px; }
.lp-calc-cta-sub { font-size: 13.5px; color: var(--ink-soft); line-height: 1.5; }
.lp-calc-cta-sub strong { color: var(--navy); font-weight: 700; }
.lp-calc-cta-arrow {
  width: 44px; height: 44px; border-radius: 50%; background: #d98c03; color: #fff;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: transform .25s ease;
}
.lp-calc-cta:hover .lp-calc-cta-arrow { transform: translateX(4px); }
@media (max-width: 720px) {
  .lp-calc-cta { grid-template-columns: auto 1fr; padding: 18px 20px; }
  .lp-calc-cta-arrow { display: none; }
  .lp-calc-cta-icon { width: 44px; height: 44px; }
}

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

/* Mobile: hero compact (vorm zichtbaar above-fold) + nav hidden-until-scroll */
@media (max-width: 900px) {
  .lf-hero.lp-hero-cine { min-height: 72vh !important; min-height: 72dvh !important; height: 72dvh !important; align-items: flex-start !important; }
  .lp-hero-cine .lf-hero-wrap { padding-top: 80px !important; padding-bottom: 24px !important; min-height: 72dvh !important; }
  .lp-hero-cine .lf-hero-headline { font-size: clamp(28px, 8vw, 38px) !important; line-height: 1.12 !important; margin: 0 0 12px !important; }
  .lp-hero-cine .lf-hero-sub { font-size: 14px !important; line-height: 1.5 !important; margin: 0 0 16px !important; }
  .lp-hero-cine .lf-hero-actions { gap: 10px !important; }
  .lp-hero-cine .lf-cta-pill { padding: 14px 22px !important; font-size: 14px !important; }
  .lp-hero-cine .lf-hero-ghost { font-size: 13.5px !important; padding: 8px 14px !important; }
  .lp-hero-cine .lp-hero-trust { display: none !important; }
  .lp-hero-cine .lp-cta-microtrust { display: none !important; }
  .lp-hero-cine .lf-scroll-cue { display: none !important; }
  body.lp-page .lf-fab-call { display: none !important; }
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

/* LP differentiator USPs — wat anderen NIET bieden */
.lp-usp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.lp-usp-card { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 14px; padding: 22px 18px 20px; transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease; position: relative; }
.lp-usp-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 18px 40px -20px rgba(217,140,3,0.35); }
.lp-usp-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(217,140,3,0.12); color: var(--accent); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px; }
.lp-usp-card h4 { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 6px; letter-spacing: -0.005em; line-height: 1.25; }
.lp-usp-card p { font-size: 13px; color: var(--ink-soft); line-height: 1.5; margin: 0; }
@media (max-width: 1100px) { .lp-usp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .lp-usp-grid { grid-template-columns: 1fr; gap: 12px; } }

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

/* ───────── Werkwijze stepped cards ───────── */
.lp-process-steps {
  list-style: none;
  padding: 0;
  margin: 28px 0 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lp-process-steps li {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 18px;
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 14px;
  box-shadow: 0 2px 6px -2px rgba(10,22,40,0.06);
  transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
}
.lp-process-steps li:hover {
  transform: translateX(4px);
  box-shadow: 0 14px 28px -10px rgba(10,22,40,0.14);
  border-color: rgba(217,140,3,0.32);
}
.lp-process-num {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: -0.02em;
  flex-shrink: 0;
  min-width: 36px;
  line-height: 1;
  padding-top: 2px;
}
.lp-process-steps li div { display: flex; flex-direction: column; gap: 3px; }
.lp-process-steps li strong {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--navy);
  font-weight: 600;
  letter-spacing: -0.01em;
}
.lp-process-steps li span {
  font-size: 13.5px;
  color: var(--ink-soft);
  line-height: 1.5;
}
@media (max-width: 720px) {
  .lp-process-steps li { padding: 14px 14px; gap: 12px; }
  .lp-process-num { font-size: 19px; min-width: 30px; }
  .lp-process-steps li strong { font-size: 15px; }
  .lp-process-steps li span { font-size: 13px; }
}

/* Gevel ETICS cross-section — één premium FLUX render boven het 5-card grid */
.lp-gevel-cross-wrap {
  max-width: 480px;
  margin: 0 auto 48px;
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px -4px rgba(10,22,40,0.08);
  padding: 18px;
}
.lp-gevel-cross-img {
  display: block; width: 100%; height: auto; border-radius: 6px;
}

/* ───────── Premium gevel anatomy grid (FLUX-Ultra renders) ───────── */
.lp-anatomy-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 8px;
}
.lp-anatomy-tile {
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px -4px rgba(10,22,40,0.08);
  transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease, border-color .35s ease;
  display: flex; flex-direction: column;
}
.lp-anatomy-tile:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 50px -16px rgba(10,22,40,0.18), 0 4px 12px -2px rgba(10,22,40,0.08);
  border-color: rgba(217,140,3,0.35);
}
.lp-anatomy-tile-img {
  background: linear-gradient(180deg, #f8f6f2 0%, #efece4 100%);
  aspect-ratio: 16/9;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.lp-anatomy-tile-img img {
  width: 100%; height: 100%; object-fit: cover; object-position: center;
  transition: transform .55s cubic-bezier(.22,1,.36,1);
}
.lp-anatomy-tile:hover .lp-anatomy-tile-img img { transform: scale(1.04); }
.lp-anatomy-tile-body { padding: 22px 24px 24px; position: relative; }
.lp-anatomy-tile-num {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-bottom: 8px;
}
.lp-anatomy-tile-body h4 {
  font-family: var(--font-display);
  font-size: 19px; font-weight: 600;
  color: var(--navy);
  letter-spacing: -0.015em;
  margin: 0 0 8px;
}
.lp-anatomy-tile-body p {
  margin: 0; font-size: 14px; line-height: 1.55;
  color: var(--ink-soft);
}
@media (max-width: 900px) { .lp-anatomy-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
@media (max-width: 560px) { .lp-anatomy-grid { grid-template-columns: 1fr; } }

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

/* ───────── Hot-button word highlight (scroll-triggered slide-in zoals reviews) ───────── */
.lp-hot {
  color: #d98c03 !important;
  font-weight: 700;
  background-color: transparent !important;
  background-image: linear-gradient(#d98c03, #d98c03) !important;
  background-size: 0% 100%;
  background-position: left center;
  background-repeat: no-repeat;
  padding: 2px 6px;
  border-radius: 3px;
  transition: background-size 0.6s cubic-bezier(.22,1,.36,1), color 0.4s ease;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.lp-urgency-card.revealed .lp-hot,
.lp-form-side.revealed .lp-hot,
.lp-form-side[data-reveal].revealed .lp-hot,
.lp-form-card.revealed .lp-hot {
  background-size: 100% 100%;
  color: #fff !important;
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

/* ===== LP-FOCUS: bloat-secties verbergen voor max conversie ===== */
.lp-calc-cta-section,
.lp-price-anchor,
.lf-section:has(.lp-prijs-grid),
.lf-section:has(.lp-anatomy-grid),
.lf-section:has(.lp-dak-cross-img),
.lf-section:has(.lp-blog-grid) {
  display: none !important;
}
/* Email-veld in mini-form weg = 2 velden ipv 3 = minder friction */
.lp-quick-form input[name="email"] { display: none !important; }
@media (max-width: 720px) {
  .lp-quick-form form { grid-template-columns: 1fr !important; }
}

/* ═══════════════ HERO REDESIGN — "premium vakman" ipv tech-template ═══════════════
   Zelfde redesign als dakwerken-LP: verwijdert AI-tells (even-donkere wash,
   gecentreerde zwevende tekst, glassmorphism-chips, glow-knop, eyebrow-bolletje).
   Foto = de held (ademt), content links geankerd & geaard. */
.lp-hero-cine .lf-hero-bg--slides::after {
  background:
    linear-gradient(90deg, rgba(10,16,28,0.82) 0%, rgba(10,16,28,0.52) 34%, rgba(10,16,28,0.14) 64%, rgba(10,16,28,0) 100%),
    linear-gradient(0deg, rgba(10,16,28,0.60) 0%, rgba(10,16,28,0) 38%) !important;
}
.lp-hero-cine .lf-hero-bg--slides { filter: contrast(1.04) saturate(1.05) !important; }
.lp-hero-cine .lf-hero-wrap {
  align-items: flex-end !important;
  justify-content: flex-start !important;
  padding-bottom: 66px !important;
}
.lp-hero-cine .lf-hero-mini { max-width: 680px !important; text-align: left !important; margin: 0 !important; }
.lp-hero-cine .lf-hero-sub { margin: 0 0 28px 0 !important; text-align: left !important; max-width: 600px !important; }
.lp-hero-cine .lf-hero-actions { justify-content: flex-start !important; }
.lp-hero-cine .lf-hero-eyebrow {
  background: none !important; border: none !important;
  -webkit-backdrop-filter: none !important; backdrop-filter: none !important;
  padding: 0 !important; margin-bottom: 18px !important;
  font-size: 12.5px !important; font-weight: 700 !important;
  letter-spacing: 0.2em !important; text-transform: uppercase !important; color: #f0a83a !important;
}
.lp-hero-cine .lf-hero-eyebrow-dot { display: none !important; }
.lp-hero-cine .lf-hero-headline { font-weight: 700 !important; letter-spacing: -0.012em !important; line-height: 1.05 !important; }
.lp-hero-cine .lp-hero-trust {
  background: none !important; border: none !important;
  -webkit-backdrop-filter: none !important; backdrop-filter: none !important;
  border-radius: 0 !important; border-top: 1px solid rgba(255,255,255,0.20) !important;
  padding: 18px 0 0 0 !important; margin-top: 26px !important; gap: 26px !important; flex-wrap: wrap !important;
}
.lp-hero-cine .lp-hero-trust > span { padding: 0 !important; font-size: 13.5px !important; }
.lp-hero-cine .lp-hero-trust > span + span { border-left: none !important; }
.lp-hero-cine .lf-cta-pill { border-radius: 8px !important; box-shadow: 0 2px 10px rgba(10,16,28,0.22) !important; }
.lp-hero-cine .lf-cta-pill:hover { box-shadow: 0 6px 18px rgba(10,16,28,0.30) !important; transform: translateY(-1px) !important; }
.lp-hero-cine .lf-hero-ghost { border-radius: 8px !important; }
.lp-hero-cine .lf-scroll-cue { display: none !important; }
@media (max-width: 900px) {
  .lp-hero-cine .lf-hero-wrap { align-items: flex-end !important; justify-content: flex-start !important; padding-bottom: 28px !important; }
  .lp-hero-cine .lf-hero-mini { text-align: left !important; }
  .lp-hero-cine .lf-hero-bg--slides::after {
    background: linear-gradient(0deg, rgba(10,16,28,0.86) 0%, rgba(10,16,28,0.40) 46%, rgba(10,16,28,0.18) 100%) !important;
  }
  .lp-hero-cine .lf-hero-eyebrow { margin-bottom: 12px !important; font-size: 11px !important; }
}

/* ═══════════════ GRAND SLAM OFFER — "Zorgeloze Gevel" (Hormozi) ═══════════════ */
.lp-offer { padding: 56px 0 8px; }
.lp-offer-head { max-width: 720px; margin: 0 0 28px; }
.lp-offer-eyebrow { font-size: 12.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
.lp-offer-title { font-family: var(--font-display); font-size: clamp(24px, 3vw, 34px); font-weight: 700; color: var(--navy); letter-spacing: -0.02em; line-height: 1.12; margin: 0 0 10px; }
.lp-offer-sub { font-size: 15px; color: var(--ink-soft); line-height: 1.6; margin: 0; }
.lp-offer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 32px; background: #fff; border: 1px solid rgba(10,22,40,0.08); border-radius: 16px; padding: 30px 32px; box-shadow: 0 1px 2px rgba(15,17,21,.04), 0 18px 44px -28px rgba(10,22,40,0.18); }
.lp-offer-item { display: flex; gap: 13px; align-items: flex-start; }
.lp-offer-check { width: 24px; height: 24px; border-radius: 50%; background: rgba(217,140,3,0.12); color: var(--accent); flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
.lp-offer-item-text { font-size: 14.5px; line-height: 1.5; color: var(--ink); }
.lp-offer-item-text strong { color: var(--navy); font-weight: 700; display: block; margin-bottom: 1px; }
.lp-offer-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 22px; margin-top: 20px; padding-top: 4px; }
.lp-offer-cta { display: inline-flex; align-items: center; gap: 9px; background: #d98c03; color: #fff; font-weight: 700; font-size: 15px; padding: 14px 26px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 10px rgba(217,140,3,0.3); transition: transform .15s ease, background .2s ease; }
.lp-offer-cta:hover { background: #c47a02; transform: translateY(-1px); }
.lp-offer-foot-note { font-size: 13px; color: var(--ink-mute); }
@media (max-width: 720px) {
  .lp-offer { padding: 36px 0 4px; }
  .lp-offer-grid { grid-template-columns: 1fr; gap: 14px; padding: 22px 20px; }
  .lp-offer-foot { flex-direction: column; align-items: stretch; }
  .lp-offer-cta { justify-content: center; }
}
`;

const HTML = `
<header class="lp-mini-header">
  <div class="wrap lp-mini-header-inner">
    <a class="lp-mini-brand" href="/" aria-label="AB Bouw Groep — home">
      <img src="${logo}" alt="AB Bouw Groep — Gevelrenovatie" class="lp-mini-logo" />
    </a>
    <a href="${CONTACT.phone.href}" class="lp-mini-phone" aria-label="Bel ons direct">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <span class="lp-mini-phone-label">${CONTACT.phone.spaced}</span>
    </a>
  </div>
</header>

<section class="lf-hero lp-hero-cine">
  <div class="lf-hero-bg lf-hero-bg--slides" data-hero-slides>
    <img src="${hero1}" alt="Witte crepi gevelrenovatie — AB Gevelbekleding" class="is-active" />
    <img src="${hero2}" alt="Grijze crepi halfopen woning — AB Bouw Groep" loading="lazy" />
    <img src="${hero3}" alt="Steenstrips tuinaanbouw — AB Gevelbekleding" loading="lazy" />
    <img src="${hero4}" alt="Sierpleister marmorino afwerking — AB Bouw Groep" loading="lazy" />
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
          <span>Vraag gratis plaatsbezoek</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
        <a href="${CONTACT.phone.href}" class="lf-hero-ghost">
          <span>Bel ${CONTACT.phone.spaced}</span>
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

<!-- HERO MINI-FORM — boven-fold quick capture, 3 verplichte velden -->
<div class="wrap">
  <div class="lp-quick-form" data-lp-quick data-reveal>
    <div class="lp-quick-form-head">
      <div class="lp-quick-form-head-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <div class="lp-quick-form-title">Vraag gratis plaatsbezoek</div>
        <div class="lp-quick-form-sub">Vakman langs binnen 5 werkdagen · bindende offerte · 100% vrijblijvend</div>
      </div>
    </div>
    <form data-lp-quick-form novalidate>
      <input type="text" name="firstName" placeholder="Voornaam *" required autocomplete="given-name" />
      <input type="email" name="email" placeholder="E-mailadres *" required autocomplete="email" inputmode="email" />
      <input type="tel" name="phone" placeholder="Telefoon *" required autocomplete="tel" inputmode="tel" />
      <button type="submit" data-lp-quick-submit style="background:#d98c03 !important; background-color:#d98c03 !important; color:#ffffff !important; border:none;">
        <span data-lp-quick-submit-label>Plan mijn gratis gevel-offerte</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </form>
    <div class="lp-quick-form-error" data-lp-quick-error hidden></div>
    <div class="lp-quick-form-thanks" data-lp-quick-thanks aria-hidden="true">
      <div class="lp-quick-form-thanks-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h4>Bedankt — we hebben uw aanvraag.</h4>
      <p>Onze projectleider neemt binnen één werkdag persoonlijk contact met u op.</p>
    </div>
  </div>
</div>

<!-- GRAND SLAM OFFER — "Zorgeloze Gevel" (Hormozi): aanbod expliciet maken -->
<section class="lf-section lp-offer">
  <div class="wrap">
    <div class="lp-offer-head" data-reveal>
      <div class="lp-offer-eyebrow">Wat u bij ons krijgt</div>
      <h2 class="lp-offer-title">Het <span class="ab-mark">Zorgeloze Gevel</span>-pakket</h2>
      <p class="lp-offer-sub">Van het eerste plaatsbezoek tot een afgewerkte gevel regelt u alles met één ploeg en één vaste contactpersoon. Vaste prijs, geen tussenpartij.</p>
    </div>
    <div class="lp-offer-grid" data-reveal data-reveal-delay="1">
      ${[
        ['Gratis plaatsbezoek met advies', 'Een vakman komt binnen 5 werkdagen langs en bekijkt ter plaatse wat uw gevel nodig heeft.'],
        ['Bindende offerte zonder meerkost', 'De prijs op uw offerte is de prijs die u betaalt. Zwart op wit.'],
        ['Mijn VerbouwPremie geregeld', 'Wij dienen het volledige premiedossier voor u in, zodat u niets misloopt.'],
        ['Eigen gevelploeg', 'Uw gevel wordt uitgevoerd door onze eigen mensen, niet door onderaannemers.'],
        ['15 jaar garantie', 'U krijgt een schriftelijke garantie op de uitgevoerde werken.'],
        ['Eén vaste contactpersoon', 'Dezelfde projectleider begeleidt u van de offerte tot de oplevering.'],
        ['Nette werf', 'Na de werken ruimen wij alles op en laten we uw woning proper achter.'],
        ['Crepi, sierpleister, steenstrips of bekleding', 'Wij adviseren de afwerking die past bij uw woning en budget.'],
      ].map(([t, d]) => `
      <div class="lp-offer-item">
        <span class="lp-offer-check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
        <span class="lp-offer-item-text"><strong>${t}</strong>${d}</span>
      </div>`).join('')}
    </div>
    <div class="lp-offer-foot" data-reveal>
      <a href="#lp-form" class="lp-offer-cta" data-smooth>
        Vraag gratis plaatsbezoek
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <span class="lp-offer-foot-note">Vrijblijvend · antwoord binnen 1 werkdag</span>
    </div>
  </div>
</section>

<!-- CALCULATOR-CTA banner -->
<section class="lf-section lp-calc-cta-section">
  <div class="wrap">
    <a href="/calculator/gevel" class="lp-calc-cta" data-reveal>
      <div class="lp-calc-cta-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/>
          <line x1="8" y1="6" x2="16" y2="6"/>
          <line x1="8" y1="10" x2="10" y2="10"/><line x1="12" y1="10" x2="14" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/>
          <line x1="8" y1="14" x2="10" y2="14"/><line x1="12" y1="14" x2="14" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/>
          <line x1="8" y1="18" x2="14" y2="18"/>
        </svg>
      </div>
      <div class="lp-calc-cta-text">
        <span class="lp-calc-cta-eyebrow">Sneller dan een formulier</span>
        <strong class="lp-calc-cta-title">Bereken uw gevel-offerte online — <span class="lp-calc-cta-em">60 seconden</span></strong>
        <span class="lp-calc-cta-sub">6 simpele vragen. <strong>Geen technische kennis nodig.</strong> Wij meten alles nauwkeurig op bij het gratis plaatsbezoek.</span>
      </div>
      <div class="lp-calc-cta-arrow" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </a>
  </div>
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
              { name: 'Jasmien De Backer', role: 'Witte crepi rijwoning', img: rev1, text: 'Onze rijwoning had een vermoeide bezetting uit de jaren ’80. Nu een spierwitte crepi-gevel die je zo van een interieurmagazine plukt. De buren komen vragen wie het werk gedaan heeft. Strak, proper, op tijd opgeleverd.', highlights: ['spierwitte crepi-gevel', 'op tijd opgeleverd'] },
              { name: 'Joris Vanhove', role: 'ETICS + crepi', img: rev2, text: 'Volledig pakket: 16 cm EPS-isolatie + crepi-afwerking. EPC van F naar C in één werk. Stookkost deze winter bijna gehalveerd, en de muren binnen voelen niet meer koud aan. Premie-dossier (€4.800) liep via hen.', highlights: ['EPC van F naar C', 'bijna gehalveerd', '€4.800'] },
              { name: 'Marius Ionescu', role: 'Steenstrips voorgevel', img: rev3, text: 'We wilden de klassieke Vlaamse baksteen-look zonder het gewicht en de kost van echte stenen. Steenstrips Vandersanden, voegen kaarsrecht, aansluitingen rond ramen vakwerk. Niemand merkt het verschil — zelfs onze schoonvader niet.', highlights: ['voegen kaarsrecht', 'zelfs onze schoonvader niet'] },
              { name: 'Cindy Van Looy', role: 'Sierpleister marmorino', img: rev4, text: 'Marmorino-afwerking in zachte taupe. Eén van de experts hielp met de kleurkeuze — wij wilden eerst grijs, hij overtuigde ons van een warmere tint. Achteraf super blij, het huis straalt nu echt karakter uit.', highlights: ['zachte taupe', 'super blij', 'echt karakter'] },
              { name: 'Dimitri Maes', role: 'Crepi + buitenisolatie', img: rev5, text: 'Halfopen woning uit 1968 die nooit was geïsoleerd. 16 cm EPS buitenisolatie + crepi. Comfort-sprong is enorm: geen koude muren meer in de winter. Premie €5.400 zonder problemen uitbetaald.', highlights: ['Comfort-sprong is enorm', '€5.400 zonder problemen'] },
              { name: 'Steven Goossens', role: 'Gevelherstel + crepi', img: rev6, text: 'Onze gevel had scheuren en vochtproblemen. Drie aannemers wilden direct crepi erop smeren. Eén van de experts zei: eerst herstellen, anders gooi je geld weg. Uitgevoerd zoals beloofd. Factuur tot op de euro met de offerte.', highlights: ['eerst herstellen', 'tot op de euro'] },
              { name: 'Eva Vandeputte', role: 'Witte crepi nieuwbouw · Kontich', img: rev7, text: 'Nieuwbouw afgewerkt met witte crepi op de spouwmuur. Strakke lijn over de volledige gevel, geen scheuren of vlekken. Plaatsing in 5 werkdagen, stelling weg, oprit proper opgekuist, klaar.', highlights: ['Strakke lijn', '5 werkdagen', 'proper opgekuist'] },
              { name: 'Hicham Bouali', role: 'Gevelisolatie + nieuwe crepi', img: rev8, text: 'Eerste aannemer wilde alleen crepi over de bestaande gevel. AB Bouw legde uit waarom we ETICS-isolatie nodig hadden. Hogere prijs, veel betere oplossing. EPC + comfort vlot. Geen spijt van die keuze.', highlights: ['veel betere oplossing', 'Geen spijt'] },
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

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 36px;">
      <span class="lf-eyebrow">Wat anderen niet bieden</span>
      <h2 class="lf-h2">4 garanties die je elders<br/><span class="ab-mark">tevergeefs zoekt</span>.</h2>
    </div>
    <div class="lp-usp-grid">
      <div class="lp-usp-card" data-reveal>
        <div class="lp-usp-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
        <h4>Snelle planning</h4>
        <p>Bij de meeste klanten starten we binnen 30 dagen na akkoord. Geen 6 maanden wachten zoals elders.</p>
      </div>
      <div class="lp-usp-card" data-reveal data-reveal-delay="1">
        <div class="lp-usp-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <h4>Asbest? Inbegrepen</h4>
        <p>Oude rijwoningen hebben vaak asbestcement gevelplaten. Verwijdering + attest in offerte.</p>
      </div>
      <div class="lp-usp-card" data-reveal data-reveal-delay="2">
        <div class="lp-usp-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
        <h4>Schone-werf garantie</h4>
        <p>Stelling weg, oprit gestraald, geen pleisterresten. Foto-rapportage via WhatsApp.</p>
      </div>
      <div class="lp-usp-card" data-reveal data-reveal-delay="3">
        <div class="lp-usp-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        <h4>EPC-winst vooraf berekend</h4>
        <p>Wij berekenen uw verwachte EPC-verbetering en premie-bedrag vóór de offerte. Geen valse beloftes — alleen wat we kunnen waarmaken.</p>
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
        Plan gratis plaatsbezoek
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
        <p class="lf-lede" style="margin-bottom: 8px;">Eigen gevelploeg. Geen onderaannemers. Eén verantwoordelijke.</p>
        <ol class="lp-process-steps">
          <li><span class="lp-process-num">01</span><div><strong>Plaatsbezoek</strong><span>Week 1 · Gratis gevelopname + richtprijs</span></div></li>
          <li><span class="lp-process-num">02</span><div><strong>Offerte</strong><span>Week 2 · Bindend op papier + premiedossier voorbereid</span></div></li>
          <li><span class="lp-process-num">03</span><div><strong>Uitvoering</strong><span>Week 3-5 · 10-18 werkdagen + weekrapport per email</span></div></li>
          <li><span class="lp-process-num">04</span><div><strong>Oplevering</strong><span>Premie ingediend · 10 jaar garantie schriftelijk</span></div></li>
        </ol>
      </div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 28px;">
      <span class="lf-eyebrow">ETICS opbouw</span>
      <h2 class="lf-h2">Uw gevel in <span class="ab-mark">3D</span> — laag voor laag.</h2>
      <p class="lf-lede" style="margin: 14px auto 0; max-width: 620px;">Geen crepi op een muur — <strong>5 lagen vakwerk</strong> die samen isolatie, EPC-winst en strak resultaat leveren. Conform Vlaamse renovatieplicht 2028.</p>
    </div>
    <div class="lp-gevel-cross-wrap" data-reveal>
      <img class="lp-gevel-cross-img" src="${gevCross}" alt="ETICS-opbouw cross-section — 5 lagen van baksteen tot crepi"/>
    </div>
    <div class="lp-anatomy-grid" data-reveal>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${gevL1}" alt="Bestaande baksteengevel — laag 1" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">01</span>
          <h4>Bestaande gevel</h4>
          <p>Bakstenen spouw- of massiefmuur. We controleren stevigheid, vocht en eventueel scheurherstel vooraf.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${gevL2}" alt="Lijmmortel en ankers — laag 2" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">02</span>
          <h4>Lijmlaag + ankers</h4>
          <p>EPS-platen worden volledig verlijmd met cementgebonden lijm + mechanisch verankerd voor maximale grip.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${gevL3}" alt="EPS isolatieplaten — laag 3" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">03</span>
          <h4>EPS-isolatie 16cm</h4>
          <p>Premium expanded polystyrene λ=0,031 W/mK. Levert EPC-sprong + maakt de muur permanent warm aan de binnenkant.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${gevL4}" alt="Wapeningsnet en grondlaag — laag 4" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">04</span>
          <h4>Wapening + grondlaag</h4>
          <p>Glasvezelnet ingebed in een 4mm grondpleister — voorkomt scheuren en geeft een vlakke ondergrond.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${gevL5}" alt="Crepi sierpleister — laag 5" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">05</span>
          <h4>Crepi-afwerking</h4>
          <p>Sierpleister Sto, Weber of Marmorino in uw kleur. UV-bestendig, krimpvrij, 25 jaar fabrieksgarantie.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lf-section" style="padding: 8px 0 32px;">
  <div class="wrap">
    <div class="lp-cta-banner" data-reveal>
      <div class="lp-cta-banner-text">
        <strong>Eerlijk advies, op uw eigen tempo.</strong>
        <span>Eén van onze experts komt langs en zegt eerlijk: crepi volstaat, of toch ETICS. Vrijblijvend en gratis.</span>
      </div>
      <a href="${CONTACT.phone.href}" class="lp-cta-banner-cta">
        Bel een expert direct
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
        <img src="${hero1}" alt="Witte crepi" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Crepi</small><strong>Witte crepi</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="1">
        <img src="${hero2}" alt="Grijze crepi" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Crepi</small><strong>Grijze crepi</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="2">
        <img src="${hero3}" alt="Steenstrips" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Steenstrips</small><strong>Klassieke look</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="3">
        <img src="${hero4}" alt="Sierpleister" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Sierpleister</small><strong>Marmorino</strong></div>
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
        <a href="/blog/${b.slug}?lp=%2Flp%2Fgevel" target="_blank" rel="noopener" class="lp-blog-card" data-reveal data-reveal-delay="${i}">
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

<section class="lp-form-section" id="lp-form" style="scroll-margin-top: 100px; padding-top: 40px;">
  <div class="wrap">
    <div class="lp-form-grid">
      <div class="lp-form-side" data-reveal>
        <span class="lf-eyebrow">Gratis gevelinspectie</span>
        <h2 class="lf-h2" style="color:#fff;">Vraag uw <span class="ab-mark">gratis gevelinspectie</span> aan.</h2>
        <p>Binnen 5 werkdagen komt onze gevelploeg langs. Volledige opname, eerste richtprijs ter plaatse, premiedossier doorgesproken — <mark class="lp-hot" style="--lp-hot-delay:120">100% vrijblijvend en gratis</mark>.</p>
        <ul>
          <li>Plaatsbezoek binnen 5 werkdagen</li>
          <li>Bindende offerte op papier</li>
          <li>Premiedossier inbegrepen (gem. €4.500+ terug)</li>
          <li>10 jaar garantie op afwerking</li>
          <li>Eigen gevelploeg, geen onderaannemers</li>
        </ul>
      </div>
      <div class="lp-form-card" data-reveal data-reveal-delay="1" data-lp-form-wrapper>
        <h3>Plan uw gratis <mark class="lp-hot">gevelinspectie</mark></h3>
        <p class="lf-form-sub">We bellen u binnen één werkdag terug — <mark class="lp-hot">100% vrijblijvend</mark>.</p>
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
    <div><strong>AB Bouw Groep</strong>${CONTACT.address.street}<br/>${CONTACT.address.postcode} ${CONTACT.address.city}</div>
    <div><strong>Telefoon</strong><a href="${CONTACT.phone.href}">${CONTACT.phone.spaced}</a></div>
    <div><strong>Email</strong><a href="mailto:info@abgroep.be">info@abgroep.be</a></div>
    <div><strong>Erkenningen</strong>VCA*-gecertificeerd<br/>Lid Bouwunie</div>
  </div>
</section>

<a href="#lp-form" class="lp-sticky-cta" aria-label="Vraag gevelinspectie" style="background-color:#d98c03 !important; background-image:none !important; background:#d98c03 !important; color:#fff !important;">
  Vraag gratis gevelinspectie aan
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
</a>

<a href="${CONTACT.phone.href}" class="lf-fab-call" aria-label="Bel ons direct">
  <span class="lf-fab-pulse"></span>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
</a>
`;

export default function LpGevel({ local }: { local?: Gemeente } = {}) {
  useEffect(() => {
    const pageUrl = local ? `https://abgroep.be/lokaal/gevelrenovatie-${local.slug}` : 'https://abgroep.be/lp/gevel';
    // Canonical: non-local LP wijst naar /gevel (organic service-page) om
    // duplicate-content fight te vermijden. Lokale varianten blijven self-canonical.
    const canonicalUrl = local ? pageUrl : 'https://abgroep.be/gevel';
    document.title = local
      ? `Gevelrenovatie ${local.name} — Crepi, ETICS, Steenstrips | AB Bouw Groep`
      : "Gevelrenovatie Mechelen & Antwerpen — Crepi, ETICS, Steenstrips | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', local
      ? `Erkend gevelrenovatie-aannemer in ${local.name} (${local.postcode}). Crepi, ETICS-buitenisolatie, steenstrips en sierpleister. Eigen ploeg uit Willebroek, 10 jaar garantie via Federale Verzekering, Mijn VerbouwPremie inbegrepen. Gratis plaatsbezoek binnen 5 werkdagen.`
      : 'Erkend gevelrenovatie-aannemer in Mechelen, Antwerpen, Lier, Bornem, Sint-Niklaas. Crepi, ETICS-buitenisolatie, steenstrips, sierpleister. Eigen ploeg, 10 jaar garantie via Federale Verzekering, Mijn VerbouwPremie inbegrepen. Gratis plaatsbezoek binnen 5 werkdagen.');

    // Open Graph + Twitter cards
    const setMeta = (prop: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('og:title', local
      ? `Gevelrenovatie ${local.name} — Crepi, ETICS, Steenstrips | AB Bouw Groep`
      : 'Gevelrenovatie Mechelen & Antwerpen — Crepi, ETICS, Steenstrips | AB Bouw Groep', true);
    setMeta('og:description', local
      ? `Crepi, ETICS-buitenisolatie en steenstrips in ${local.name}. Eigen ploeg, 10j garantie, premiedossier inbegrepen.`
      : 'Crepi, ETICS-buitenisolatie, steenstrips. Eigen ploeg, 10j garantie, premiedossier inbegrepen.', true);
    setMeta('og:type', 'website', true);
    setMeta('og:locale', 'nl_BE', true);
    setMeta('og:url', pageUrl, true);
    setMeta('twitter:card', 'summary_large_image');

    // Canonical + hreflang
    const setLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
      let el = document.querySelector(selector);
      if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); if (hreflang) el.setAttribute('hreflang', hreflang); document.head.appendChild(el); }
      el.setAttribute('href', href);
    };
    setLink('canonical', canonicalUrl);
    setLink('alternate', canonicalUrl, 'nl-BE');
    setLink('alternate', canonicalUrl, 'x-default');

    // Schema.org JSON-LD: HomeAndConstructionBusiness + FAQ + Service
    const schemaId = 'lp-gevel-schema';
    document.getElementById(schemaId)?.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "HomeAndConstructionBusiness",
          "@id": "https://abgroep.be/#organization",
          "name": "AB Bouw Groep",
          "url": "https://abgroep.be",
          "telephone": CONTACT.phone.e164,
          "email": "info@abgroep.be",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": CONTACT.address.street,
            "postalCode": CONTACT.address.postcode,
            "addressLocality": CONTACT.address.city,
            "addressCountry": "BE"
          },
          "areaServed": [
            { "@type": "City", "name": "Mechelen" },
            { "@type": "City", "name": "Antwerpen" },
            { "@type": "City", "name": "Lier" },
            { "@type": "City", "name": "Boom" },
            { "@type": "City", "name": "Bornem" },
            { "@type": "City", "name": "Willebroek" },
            { "@type": "City", "name": "Bonheiden" },
            { "@type": "City", "name": "Heist-op-den-Berg" },
            { "@type": "City", "name": "Puurs" },
            { "@type": "City", "name": "Sint-Niklaas" },
            { "@type": "City", "name": "Kontich" },
            { "@type": "City", "name": "Vilvoorde" },
            { "@type": "GeoCircle", "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 51.0259, "longitude": 4.4778 }, "geoRadius": "40000" }
          ],
          "geo": { "@type": "GeoCoordinates", "latitude": 51.0596, "longitude": 4.3631 },
          "priceRange": "€€",
          "currenciesAccepted": "EUR",
          "paymentAccepted": "Cash, Bank Transfer, Credit Card",
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "18:00" }
          ],
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "96", "bestRating": "5" },
          "sameAs": ["https://www.facebook.com/abbouwgroep", "https://www.instagram.com/abbouwgroep"]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": local
            ? [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://abgroep.be" },
              { "@type": "ListItem", "position": 2, "name": "Gevelrenovatie", "item": "https://abgroep.be/gevel" },
              { "@type": "ListItem", "position": 3, "name": `Gevelrenovatie ${local.name}`, "item": pageUrl }
            ]
            : [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://abgroep.be" },
              { "@type": "ListItem", "position": 2, "name": "Gevelrenovatie", "item": "https://abgroep.be/lp/gevel" }
            ]
        },
        {
          "@type": "Service",
          "name": "Gevelrenovatie — crepi, ETICS-isolatie, steenstrips, sierpleister",
          "provider": { "@id": "https://abgroep.be/#organization" },
          "areaServed": "Vlaanderen",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Gevelrenovatie diensten",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Witte crepi gevel" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Grijze crepi gevel" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ETICS buitenisolatie + crepi" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Steenstrips Vandersanden" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Marmorino sierpleister" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gevelherstel + scheurherstel" }}
            ]
          }
        },
        {
          "@type": "FAQPage",
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ab-faq-body p"] },
          "mainEntity": [
            { "@type": "Question", "name": "Hoeveel kost een crepi-gevel?", "acceptedAnswer": { "@type": "Answer", "text": "Pure crepi op bestaande gevel kost gemiddeld €45-€75/m². ETICS-systeem (16cm isolatie + crepi) €110-€150/m². Definitieve prijs hangt af van gevelstaat en isolatiedikte." }},
            { "@type": "Question", "name": "Wat is het verschil tussen crepi en ETICS?", "acceptedAnswer": { "@type": "Answer", "text": "Crepi = sierpleister direct op de gevel, voor optisch resultaat. ETICS = External Thermal Insulation Composite System: EPS-isolatie + wapeningsnet + crepi-afwerking, voor energieprestatie EN optisch resultaat." }},
            { "@type": "Question", "name": "Doen jullie de Mijn VerbouwPremie aanvraag?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, voor ETICS-buitenisolatie regelen wij het volledige premiedossier. Tot €5.000 premie afhankelijk van inkomenscategorie. Pure crepi zonder isolatie komt sinds 2026 niet meer in aanmerking." }},
            { "@type": "Question", "name": "Hoe lang duurt een gevelrenovatie?", "acceptedAnswer": { "@type": "Answer", "text": "Een rijwoning gevel is gemiddeld in 2 weken afgewerkt. Halfopen of vrijstaande woning 3-4 weken inclusief opbouw stelling en uithardingstijd." }},
            { "@type": "Question", "name": "Wat is uw garantie?", "acceptedAnswer": { "@type": "Answer", "text": "10 jaar wettelijke aansprakelijkheid op afwerking en isolatieprestatie, gedekt door polis bij Federale Verzekering. Plus fabrieksgarantie op Sto/Weber/Marmorino-systemen." }}
          ]
        }
      ]
    });
    document.head.appendChild(schema);

    const prev = document.body.className;
    document.body.className = 'lp-page is-subpage';
    try { sessionStorage.setItem('ab_last_lp', local ? `/lokaal/gevelrenovatie-${local.slug}` : '/lp/gevel'); } catch {}
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
      const requiredFields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]');
      for (const inp of Array.from(requiredFields)) {
        if (!inp.checkValidity()) { inp.reportValidity(); return; }
      }
      const fd = new FormData(form);
      const emailV = ((fd.get('email') as string) || '').trim();
      const phoneV = ((fd.get('phone') as string) || '').trim();
      if (!emailV || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailV)) {
        const el = form.querySelector<HTMLInputElement>('input[name="email"]');
        el?.focus(); el?.reportValidity();
        if (errBox) errBox.textContent = 'Vul een geldig e-mailadres in.';
        return;
      }
      if (!phoneV || phoneV.replace(/\D/g, '').length < 8) {
        const el = form.querySelector<HTMLInputElement>('input[name="phone"]');
        el?.focus(); el?.reportValidity();
        if (errBox) errBox.textContent = 'Vul een geldig telefoonnummer in (minstens 8 cijfers).';
        return;
      }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Even bezig…'; }
      if (errBox) errBox.textContent = '';
      wrap.classList.remove('is-error');
      // Sub-service label voor GHL Task-omschrijving (GHL "Type werk" SINGLE_OPTIONS
      // accepteert enkel divisie-labels, dus sub-service hier in aanvullende_info)
      const TYPE_GEVEL_LABELS: Record<string, string> = {
        crepi_alleen: 'Crepi op bestaande gevel',
        etics_crepi: 'ETICS + crepi (buitenisolatie)',
        steenstrips: 'Steenstrips',
        sierpleister: 'Sierpleister (marmorino e.a.)',
        reiniging: 'Gevelreiniging',
        herstel: 'Gevelherstel (scheuren, vocht)',
        anders: 'Anders / weet niet zeker',
      };
      const typeGevelRaw = (fd.get('type_gevel') as string) || '';
      const subService = TYPE_GEVEL_LABELS[typeGevelRaw] || typeGevelRaw;
      const userInfo = ((fd.get('aanvullende_info') as string) || '').trim();
      const combinedInfo = subService
        ? `Type gevelwerk: ${subService}${userInfo ? `\n\n${userInfo}` : ''}`
        : (userInfo || undefined);

      const result = await submitLead({
        source: 'landing_page',
        landing_division: 'ab_gevelbekleding',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email: emailV,
        phone: phoneV,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: 'AB Gevelbekleding',
        aanvullende_info: combinedInfo,
        bron_lead: local ? `seo:gevelrenovatie-${local.slug}` : 'ads:gevel',
      });
      if (result.ok) {
        wrap.classList.add('is-success');
        window.location.href = '/bedankt?service=gevel';
        return;
      } else {
        wrap.classList.add('is-error');
        if (errBox) errBox.textContent = `Er ging iets mis. Bel ons gerust op ${CONTACT.phone.spaced}.`;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag gratis gevelinspectie aan'; }
      }
    };
    form?.addEventListener('submit', onSubmit);

    // === HERO MINI-FORM (above-fold quick capture) ===
    const quickWrap = document.querySelector<HTMLElement>('[data-lp-quick]');
    const quickForm = document.querySelector<HTMLFormElement>('[data-lp-quick-form]');
    const quickBtn = document.querySelector<HTMLButtonElement>('[data-lp-quick-submit]');
    const quickBtnLabel = document.querySelector<HTMLElement>('[data-lp-quick-submit-label]');
    const quickErr = document.querySelector<HTMLElement>('[data-lp-quick-error]');

    const onQuickSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (!quickForm) return;
      const fd = new FormData(quickForm);
      const firstName = ((fd.get('firstName') as string) || '').trim();
      const phoneV = ((fd.get('phone') as string) || '').trim();
      const phoneValid = phoneV && phoneV.replace(/\D/g, '').length >= 8;
      const phoneDigits = phoneV.replace(/\D/g, '');
      const emailV = `lead-${phoneDigits || Date.now()}@abgroep.be`;

      const showError = (msg: string, fieldName?: string) => {
        if (quickErr) { quickErr.hidden = false; quickErr.textContent = msg; }
        if (fieldName) quickForm.querySelector<HTMLInputElement>(`input[name="${fieldName}"]`)?.focus();
      };

      if (!firstName) { showError('Vul uw voornaam in.', 'firstName'); return; }
      if (!phoneValid) { showError('Vul uw telefoonnummer in (minstens 8 cijfers).', 'phone'); return; }

      if (quickErr) quickErr.hidden = true;
      if (quickBtn) quickBtn.disabled = true;
      if (quickBtnLabel) quickBtnLabel.textContent = 'Even bezig…';

      const result = await submitLead({
        source: 'landing_page',
        landing_division: 'ab_gevelbekleding',
        page_path: window.location.pathname,
        firstName,
        email: emailV,
        phone: phoneV,
        type_werk: 'AB Gevelbekleding',
        aanvullende_info: 'Hero-mini-form (3 velden, above-fold quick capture)',
        bron_lead: local ? `seo:gevelrenovatie-${local.slug}:quick` : 'ads:gevel:quick',
      });

      if (result.ok) {
        quickWrap?.classList.add('is-success');
      } else {
        if (quickBtn) quickBtn.disabled = false;
        if (quickBtnLabel) quickBtnLabel.textContent = 'Plan mijn gratis gevel-offerte';
        showError(`Er ging iets mis. Bel ons gerust op ${CONTACT.phone.spaced}.`);
      }
    };
    quickForm?.addEventListener('submit', onQuickSubmit);

    return () => {
      document.body.className = prev;
      style.remove();
      document.getElementById('lp-gevel-schema')?.remove();
      form?.removeEventListener('submit', onSubmit);
      quickForm?.removeEventListener('submit', onQuickSubmit);
      countObserver.disconnect();
    };
  }, []);

  useAbBouwInteractions();

  const renderedHtml = local
    ? HTML
        .replace('AB Gevelbekleding · Willebroek', `AB Gevelbekleding · ${local.name}`)
        .replace(
          'in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
          `in ${local.name} en de regio.`
        )
        .replaceAll('?lp=%2Flp%2Fgevel', `?lp=%2Flokaal%2Fgevelrenovatie-${local.slug}`)
    : HTML;

  return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
}
