import { useEffect, useState } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { SHELL_STYLE } from '../_shell';
import { submitLead } from '@/lib/leads';
import { BLOGS } from '@/data/blogs';
import type { Gemeente } from '@/data/gemeentes';
import { CONTACT } from '@/data/contact';
import CalculatorDak from '../calculator/CalculatorDak';
import logo from '@/assets/home/logo.png';

// Filter blogs op dakwerken-relevante tags zodat alleen relevante content
// op de LP verschijnt. Linkjes openen in een NIEUWE tab zodat de bezoeker
// zijn LP-context niet kwijt is.
const LP_BLOGS = BLOGS.filter(b =>
  b.tag === 'Dakwerken' ||
  b.slug === 'dakisolatie-renovatieplicht' ||
  b.slug === 'plat-dak-epdm-roofing-zink' ||
  b.slug === 'epc-label-c-2028'
).slice(0, 3);

// Finale dakwerken-LP foto's — Sony A7RV / Immoweb-listing aesthetic via
// FLUX Ultra met --no-upsample en hand-laid brick + authentic BE door directives.
// Hero rotation: variety van Belgisch residential — renovatie + 3 nieuwbouw types.
import heroClassic from '@/assets/dak/lp-classic-renovatie.jpg';   // klassieke Vlaamse renovatie
import heroCrepi from '@/assets/dak/lp-crepi-nieuwbouw.jpg';       // witte crepi modern nieuwbouw
import heroOranje from '@/assets/dak/lp-oranje-solar.jpg';         // oranje brick + solar panels
import heroGeel from '@/assets/dak/lp-geel-nieuwbouw.jpg';         // gele brick nieuwbouw

import imgVelux from '@/assets/dak/lp-velux.jpg';                 // warm interior comfort
import imgVakman from '@/assets/dak/lp-vakman.jpg';               // process action shot
import imgNatuurleien from '@/assets/dak/lp-natuurleien.jpg';     // gallery slate close-up
import imgPlatDak from '@/assets/dak/lp-plat-dak.jpg';            // gallery EPDM
import imgZinkGoot from '@/assets/dak/lp-zink-goot.jpg';          // gallery zink detail

import imgAnatomy from '@/assets/dak/lp-anatomy-illustration.jpg'; // 3D-illustration cross-section
import dakCross from '@/assets/dak/lp-3d-exploded.jpg';              // exploded 3D roof anatomy — 6 lagen zwevend
import imgComfort from '@/assets/dak/lp-comfort-illustration.jpg'; // warm-interior comfort visual

// 6 FLUX-Ultra premium dak-anatomy layer renders (Cinema 4D / Octane quality)
import anaL1 from '@/assets/dak/lp-anatomy-l1.jpg';  // pannen — terracotta
import anaL2 from '@/assets/dak/lp-anatomy-l2.jpg';  // tengels — wood
import anaL3 from '@/assets/dak/lp-anatomy-l3.jpg';  // onderdak — membrane
import anaL4 from '@/assets/dak/lp-anatomy-l4.jpg';  // PIR — foil + foam
import anaL5 from '@/assets/dak/lp-anatomy-l5.jpg';  // dampscherm — film
import anaL6 from '@/assets/dak/lp-anatomy-l6.jpg';  // plafond — plaster


import rev1 from '@/assets/reviews/stijn.jpg';
import rev2 from '@/assets/reviews/lieve.jpg';
import rev3 from '@/assets/reviews/yusuf.jpg';
import rev4 from '@/assets/reviews/greet.jpg';
import rev5 from '@/assets/reviews/davy.jpg';
import rev6 from '@/assets/reviews/annick.jpg';
import rev7 from '@/assets/reviews/ahmed.jpg';
import rev8 from '@/assets/reviews/tine.jpg';

// (Reviews data inline in IIFE in HTML section — exact zoals Home page)

// LP-specifieke aanvullingen op SHELL_STYLE — hergebruikt alle bestaande
// `.lf-*` klassen voor 100% stijl-consistentie met de rest van de site.
const LP_EXTRA = `
/* ───────── Mini LP-header (logo + telefoon, geen menu) ─────────
   LP's hebben bewust geen volledige nav (zou afleiden van conversion-flow),
   maar wel een brand-anchor zodat ads-traffic weet bij wie ze geland zijn.
   Mobile: logo links, phone-icon rechts (verkleind). */
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
.lp-mini-logo {
  height: 30px;
  width: auto;
  display: block;
}
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

/* ───────── Hero mini-form (above-fold quick-capture) ─────────
   Doel: ads-traffic die nu nooit naar de form onderaan scrollt, vanaf
   eerste seconde een laag-friction conversie-pad bieden. 3 velden,
   alle required, inline horizontaal op desktop, gestapeld op mobile.
   Compacte witte kaart onder hero met opvallende oranje CTA. */
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
.lp-quick-form-head {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 16px;
}
.lp-quick-form-head-icon {
  width: 38px; height: 38px;
  border-radius: 10px; background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.lp-quick-form-title {
  font-family: var(--font-display);
  font-size: 17px; font-weight: 700; color: var(--navy);
  line-height: 1.2; letter-spacing: -0.01em;
}
.lp-quick-form-sub {
  font-size: 12.5px; color: var(--ink-soft); margin-top: 2px;
}
.lp-quick-form form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  align-items: stretch;
}
.lp-quick-form input {
  padding: 14px 16px;
  border: 1px solid var(--ink-line);
  border-radius: 10px;
  font: inherit; font-size: 14.5px;
  color: var(--ink);
  background: #fff;
  transition: border-color .2s ease, box-shadow .2s ease;
  width: 100%;
}
.lp-quick-form input:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(217,140,3,0.18);
}
.lp-quick-form button[type="submit"] {
  grid-column: 1 / -1;
  margin-top: 4px;
  padding: 16px 28px;
  border-radius: 12px;
  border: none;
  background: #d98c03 !important;
  background-color: #d98c03 !important;
  color: #ffffff !important;
  font: inherit; font-size: 15.5px; font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: background .15s ease, transform .15s ease, box-shadow .2s ease;
  display: inline-flex !important;
  align-items: center; justify-content: center;
  gap: 10px;
  white-space: nowrap;
  width: 100%;
  box-shadow: 0 8px 20px -8px rgba(217,140,3,0.55);
}
.lp-quick-form button[type="submit"]:hover {
  background: #c47a02 !important;
  background-color: #c47a02 !important;
  transform: translateY(-1px);
  box-shadow: 0 12px 26px -10px rgba(217,140,3,0.65);
}
.lp-quick-form button[type="submit"]:active { transform: translateY(0); }
.lp-quick-form button[type="submit"]:disabled { opacity: 0.7; cursor: wait; }
.lp-quick-form button[type="submit"] svg { flex-shrink: 0; }
.lp-quick-form-error {
  font-size: 13px; color: #c4523f;
  background: #fcebe5; border-radius: 8px;
  padding: 8px 12px; margin-top: 10px;
}
.lp-quick-form-thanks {
  display: none;
  text-align: center;
  padding: 32px 24px;
}
.lp-quick-form.is-success form,
.lp-quick-form.is-success .lp-quick-form-head { display: none; }
.lp-quick-form.is-success .lp-quick-form-thanks { display: block; }
.lp-quick-form-thanks-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: #d1f5e3; color: #0f7a4a;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 14px;
}
.lp-quick-form-thanks h4 {
  font-family: var(--font-display);
  font-size: 20px; font-weight: 700; color: var(--navy);
  margin: 0 0 6px;
}
.lp-quick-form-thanks p {
  font-size: 14px; color: var(--ink-soft); line-height: 1.5; margin: 0;
}
@media (max-width: 720px) {
  .lp-quick-form {
    margin: -50px 12px 0;
    padding: 16px 16px 18px;
    border-radius: 14px;
    box-shadow: 0 24px 60px -24px rgba(0,0,0,0.4), 0 8px 20px -8px rgba(0,0,0,0.18);
  }
  .lp-quick-form-title { font-size: 15px !important; line-height: 1.25 !important; }
  .lp-quick-form-sub { font-size: 11.5px !important; }
  .lp-quick-form input { padding: 13px 14px !important; font-size: 15px !important; }
  .lp-quick-form button[type="submit"] { padding: 14px 22px !important; font-size: 14.5px !important; }
  .lp-quick-form-head { margin-bottom: 12px; }
  .lp-quick-form-title { font-size: 15.5px; }
  .lp-quick-form-sub { font-size: 12px; }
  .lp-quick-form form {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .lp-quick-form button[type="submit"] {
    grid-column: 1;
    margin-top: 6px;
    padding: 15px 22px;
    font-size: 15px;
  }
}

/* Price anchor band — boven de hoofd-form, geeft buyer een budget-anker */
.lp-price-anchor {
  background: linear-gradient(135deg, rgba(217,140,3,0.08) 0%, rgba(217,140,3,0.02) 100%);
  border-top: 1px solid rgba(217,140,3,0.18);
  border-bottom: 1px solid rgba(217,140,3,0.18);
  padding: 32px 0;
}
.lp-price-anchor-inner {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 28px;
  align-items: center;
  max-width: 980px; margin: 0 auto;
}
.lp-price-anchor-eyebrow-wrap {
  flex-shrink: 0;
}
.lp-price-anchor-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: #d98c03;
  display: block; margin-bottom: 4px;
}
.lp-price-anchor-title {
  font-family: var(--font-display);
  font-size: 17px; font-weight: 700; color: var(--navy);
  line-height: 1.2; letter-spacing: -0.01em;
}
.lp-price-anchor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.lp-price-anchor-item {
  display: flex; flex-direction: column; gap: 2px;
}
.lp-price-anchor-num {
  font-family: var(--font-display);
  font-size: 22px; font-weight: 700; color: var(--navy);
  line-height: 1;
}
.lp-price-anchor-lbl {
  font-size: 12.5px; color: var(--ink-soft); line-height: 1.4;
}
.lp-price-anchor-foot {
  grid-column: 1 / -1;
  font-size: 12px; color: var(--ink-mute);
  padding-top: 14px; margin-top: 14px;
  border-top: 1px solid rgba(15,23,42,0.06);
  text-align: center;
}
@media (max-width: 720px) {
  .lp-price-anchor-inner { grid-template-columns: 1fr; gap: 18px; }
  .lp-price-anchor-grid { grid-template-columns: 1fr; gap: 12px; }
  .lp-price-anchor-num { font-size: 19px; }
}

/* ───────── Calculator-CTA banner (boven reviews) ───────── */
.lp-calc-cta-section { background: var(--bg); }
.lp-calc-cta {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 22px;
  align-items: center;
  max-width: 920px; margin: 0 auto;
  background: linear-gradient(135deg, #fff 0%, #fff8ec 100%);
  border: 1.5px solid rgba(217,140,3,0.32);
  border-radius: 18px;
  padding: 22px 28px;
  text-decoration: none;
  box-shadow: 0 10px 32px -14px rgba(217,140,3,0.25);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.lp-calc-cta:hover {
  transform: translateY(-3px);
  border-color: #d98c03;
  box-shadow: 0 16px 40px -16px rgba(217,140,3,0.45);
}
.lp-calc-cta-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: #d98c03; color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 20px -8px rgba(217,140,3,0.55);
}
.lp-calc-cta-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.lp-calc-cta-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: #d98c03;
}
.lp-calc-cta-title {
  font-family: var(--font-display);
  font-size: clamp(18px, 2.2vw, 22px);
  font-weight: 700; color: var(--navy);
  line-height: 1.25;
}
.lp-calc-cta-em {
  background: linear-gradient(transparent 62%, rgba(217,140,3,0.32) 62%);
  padding: 0 3px;
}
.lp-calc-cta-sub {
  font-size: 13.5px; color: var(--ink-soft); line-height: 1.5;
}
.lp-calc-cta-sub strong { color: var(--navy); font-weight: 700; }
.lp-calc-cta-arrow {
  width: 44px; height: 44px; border-radius: 50%;
  background: #d98c03; color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
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
.lp-hero-cine .lf-hero-bg--slides { filter: contrast(1.02) saturate(1.0); }
.lp-hero-cine .lf-hero-bg--slides::after {
  background:
    linear-gradient(180deg, rgba(8,12,22,0.55) 0%, rgba(8,12,22,0.20) 30%, rgba(8,12,22,0.15) 70%, rgba(8,12,22,0.65) 100%);
  z-index: 3;
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
  /* Hide hero-trust + microtrust op mobile — duplicates met mini-form sub-text */
  .lp-hero-cine .lp-hero-trust { display: none !important; }
  .lp-hero-cine .lp-cta-microtrust { display: none !important; }
  /* Scroll cue subtieler */
  .lp-hero-cine .lf-scroll-cue { display: none !important; }
  /* FAB-call ALTIJD weg op LP — anders overlapt het de form */
  body.lp-page .lf-fab-call { display: none !important; }
}

body.lp-page.is-subpage .lf-nav {
  opacity: var(--nav-sweep, 0) !important;
  transform: translateY(calc((1 - var(--nav-sweep, 0)) * -10px)) !important;
  transition: top 0.4s var(--ease) !important;
  pointer-events: none;
}
body.lp-page.is-subpage.past-hero .lf-nav { pointer-events: auto !important; }
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

/* Reviews carousel: SHELL_STYLE's .lf-testi-marquee heeft een full-bleed
   margin (calc(50% - 50vw)) die de marquee BUITEN de wrap trekt naar
   100vw — dat trekt de cards naar de viewport-left-edge. Home heeft die
   margin NIET. We resetten 'm hier zodat de marquee binnen .wrap blijft
   (gecentreerd in 1280px) precies zoals Home. */
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

/* Mobile: gebruikt .lf-fab-call (telefoon-icon) uit SHELL_STYLE — zelfde als
   Home + subpages. Geen aparte bottom-bar meer op LP. */

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

/* LP differentiator USPs — wat anderen NIET bieden */
.lp-usp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.lp-usp-card {
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  border-radius: 14px;
  padding: 22px 18px 20px;
  transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
  position: relative;
}
.lp-usp-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 18px 40px -20px rgba(217,140,3,0.35); }
.lp-usp-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: rgba(217,140,3,0.12);
  color: var(--accent);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
}
.lp-usp-card h4 { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 6px; letter-spacing: -0.005em; line-height: 1.25; }
.lp-usp-card p { font-size: 13px; color: var(--ink-soft); line-height: 1.5; margin: 0; }
@media (max-width: 1100px) { .lp-usp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .lp-usp-grid { grid-template-columns: 1fr; gap: 12px; } }

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
/* .ab-mark heeft default color:var(--navy) — onzichtbaar op navy bg.
   Force naar goud met !important om class-cascade te beating. */
.lp-form-section h2 .ab-mark,
.lp-form-section .lf-h2 .ab-mark { color: var(--accent) !important; }
.lp-form-section h2 .ab-mark::after,
.lp-form-section .lf-h2 .ab-mark::after { opacity: 0.22 !important; background: rgba(255,255,255,0.18) !important; }
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

/* ───────── ECHT werkende 3D dak-anatomy (CSS perspective + preserve-3d) ───────── */
.lp-anatomy {
  display: grid; grid-template-columns: 1.3fr 1fr;
  gap: 48px; align-items: center;
  margin: 32px 0;
}
.lp-anatomy-stage {
  position: relative;
  height: 480px;
  perspective: 1400px;
  perspective-origin: 50% 35%;
  transform-style: preserve-3d;
}
.lp-anatomy-stage::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 90%, rgba(15,17,21,0.10) 0%, transparent 60%);
  pointer-events: none;
}
.lp-anatomy-card {
  position: absolute;
  left: 50%; top: 50%;
  width: 360px; height: 64px;
  margin: -32px 0 0 -180px;
  border-radius: 12px;
  box-shadow: 0 18px 32px -12px rgba(10,22,40,0.35), 0 2px 6px rgba(10,22,40,0.12);
  transform-style: preserve-3d;
  transform: rotateX(58deg) translateZ(calc(var(--depth, 0) * 1px));
  transition: transform .55s cubic-bezier(.22,1,.36,1), box-shadow .35s ease, filter .35s ease;
  cursor: pointer;
  display: flex; align-items: center; gap: 16px;
  padding: 0 22px;
  font-family: var(--font-display); font-weight: 600;
  color: #fff;
  overflow: hidden;
}
.lp-anatomy-card::after {
  content: ''; position: absolute; inset: 0;
  background:
    repeating-linear-gradient(90deg, transparent 0 12px, rgba(255,255,255,0.06) 12px 13px);
  pointer-events: none;
}
.lp-anatomy-card[data-layer="1"] { --depth: 150; background: linear-gradient(180deg, #c24f1f 0%, #8e3a13 100%); }
.lp-anatomy-card[data-layer="2"] { --depth: 90;  background: linear-gradient(180deg, #8e623c 0%, #6e472a 100%); }
.lp-anatomy-card[data-layer="3"] { --depth: 30;  background: linear-gradient(180deg, #2e3845 0%, #1a2129 100%); }
.lp-anatomy-card[data-layer="4"] { --depth: -30; background: linear-gradient(180deg, #dbac3e 0%, #a37f23 100%); }
.lp-anatomy-card[data-layer="5"] { --depth: -90; background: linear-gradient(180deg, #94999f 0%, #5e6470 100%); }
.lp-anatomy-card[data-layer="6"] { --depth: -150; background: linear-gradient(180deg, #fafaf3 0%, #e0ddd4 100%); color: var(--navy); }

/* Dak cross-section — één premium FLUX render boven het 6-card grid */
.lp-dak-cross-wrap {
  max-width: 480px;
  margin: 0 auto 48px;
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px -4px rgba(10,22,40,0.08);
  padding: 18px;
}
.lp-dak-cross-img {
  display: block; width: 100%; height: auto; border-radius: 6px;
}

/* ───────── Premium dak anatomy grid (FLUX-Ultra renders) ───────── */
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
.lp-anatomy-tile-body {
  padding: 22px 24px 24px;
  position: relative;
}
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
  font-size: 19px;
  font-weight: 600;
  color: var(--navy);
  letter-spacing: -0.015em;
  margin: 0 0 8px;
}
.lp-anatomy-tile-body p {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--ink-soft);
}
@media (max-width: 900px) {
  .lp-anatomy-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}
@media (max-width: 560px) {
  .lp-anatomy-grid { grid-template-columns: 1fr; }
}
.lp-anatomy-card:hover {
  transform: rotateX(58deg) translateZ(calc(var(--depth, 0) * 1px + 70px)) translateY(-10px);
  box-shadow: 0 32px 50px -16px rgba(10,22,40,0.45), 0 4px 12px rgba(10,22,40,0.15);
  filter: brightness(1.08);
}
.lp-anatomy-card-num {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(255,255,255,0.20);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  flex-shrink: 0;
  position: relative; z-index: 1;
}
.lp-anatomy-card[data-layer="6"] .lp-anatomy-card-num {
  background: rgba(10,22,40,0.10); color: var(--navy);
}
.lp-anatomy-card-label {
  font-size: 14.5px; letter-spacing: -0.01em;
  position: relative; z-index: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Scroll-into-view: layers float up to their final position from below */
@keyframes lp-anatomy-rise {
  from {
    transform: rotateX(58deg) translateZ(0) translateY(120px);
    opacity: 0;
  }
  to {
    transform: rotateX(58deg) translateZ(calc(var(--depth, 0) * 1px));
    opacity: 1;
  }
}
[data-reveal].revealed .lp-anatomy-card {
  animation: lp-anatomy-rise 1s cubic-bezier(.22,1,.36,1) backwards;
}
[data-reveal].revealed .lp-anatomy-card[data-layer="6"] { animation-delay: 0.05s; }
[data-reveal].revealed .lp-anatomy-card[data-layer="5"] { animation-delay: 0.15s; }
[data-reveal].revealed .lp-anatomy-card[data-layer="4"] { animation-delay: 0.25s; }
[data-reveal].revealed .lp-anatomy-card[data-layer="3"] { animation-delay: 0.35s; }
[data-reveal].revealed .lp-anatomy-card[data-layer="2"] { animation-delay: 0.45s; }
[data-reveal].revealed .lp-anatomy-card[data-layer="1"] { animation-delay: 0.55s; }

.lp-anatomy-info {
  padding: 32px;
  background: #fafaf7;
  border-radius: 16px;
  border: 1px solid var(--ink-line-soft);
}
.lp-anatomy-info-eyebrow {
  display: inline-block;
  font-size: 11.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}
.lp-anatomy-info h3 {
  font-family: var(--font-display);
  font-size: 24px; color: var(--navy);
  margin: 0 0 12px; letter-spacing: -0.015em;
  font-weight: 700;
}
.lp-anatomy-info p {
  color: var(--ink-soft);
  font-size: 14.5px; line-height: 1.65; margin: 0 0 16px;
}
.lp-anatomy-info ul {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 8px;
}
.lp-anatomy-info ul li {
  display: flex; align-items: center; gap: 10px;
  font-size: 13.5px; color: var(--ink-soft);
}
.lp-anatomy-info ul li::before {
  content: ''; width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .lp-anatomy { grid-template-columns: 1fr; gap: 28px; }
  .lp-anatomy-stage { height: 400px; perspective: 1100px; }
  .lp-anatomy-card { width: 300px; margin-left: -150px; }
  .lp-anatomy-card[data-layer="1"] { --depth: 110; }
  .lp-anatomy-card[data-layer="2"] { --depth: 66; }
  .lp-anatomy-card[data-layer="3"] { --depth: 22; }
  .lp-anatomy-card[data-layer="4"] { --depth: -22; }
  .lp-anatomy-card[data-layer="5"] { --depth: -66; }
  .lp-anatomy-card[data-layer="6"] { --depth: -110; }
}

/* Scroll-target fix — nav (~90px) compenseren bij CTA scroll-to-form */
#lp-form { scroll-margin-top: 100px; }

/* ───────── Werkwijze stepped cards (visueel ipv saaie bullet list) ───────── */
.lp-process-steps {
  list-style: none;
  padding: 0;
  margin: 28px 0 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  counter-reset: process;
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
  .lp-reviews .lf-testi-shift {
    position: static;
    transform: none !important;
    transition: none !important;
    display: block;
    padding: 0;
  }
  .lp-reviews .lf-testi-track {
    position: relative;
    display: flex;
    width: max-content;
    animation: none !important;
    overflow: visible;
    gap: 0;
  }
  .lp-reviews .lf-testi-set:not([data-testi-set="0"]) { display: none !important; }
  .lp-reviews .lf-testi-set[data-testi-set="0"] {
    display: flex;
    flex-wrap: nowrap;
    gap: 14px;
    padding: 4px 16px;
  }
  .lp-reviews .lf-testi {
    flex: 0 0 86%;
    max-width: 360px;
    scroll-snap-align: center;
    transform: none !important;
    opacity: 1 !important;
  }
  .lp-reviews .lf-testi-arrow { display: none !important; }
}

/* ───────── Hot-button word highlight (solid brand orange, geen browser-default mark) ───────── */
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
.lp-reviews-swipe-hint {
  display: none;
}
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

/* ───────── Heat-loss pie chart (educational infographic) ───────── */
.lp-heatloss { display: grid; grid-template-columns: auto 1fr; gap: 36px; align-items: center; }
.lp-heatloss-chart { position: relative; width: 220px; height: 220px; flex-shrink: 0; }
.lp-heatloss-chart svg { width: 100%; height: 100%; transform: rotate(-90deg); shape-rendering: geometricPrecision; }
.lp-heatloss-chart circle.bg { fill: none; stroke: var(--ink-line-soft); stroke-width: 18; }
.lp-heatloss-chart circle.seg {
  fill: none; stroke-width: 18;
  stroke-dasharray: 0 999;
  stroke-linecap: round;
  transition: stroke-dasharray 1.6s cubic-bezier(.22,1,.36,1);
}
[data-reveal].revealed .lp-heatloss-chart circle.seg.dak  { stroke-dasharray: var(--dak-len, 188) 999; }
[data-reveal].revealed .lp-heatloss-chart circle.seg.muur { stroke-dasharray: var(--muur-len, 157) 999; transition-delay: .2s; }
[data-reveal].revealed .lp-heatloss-chart circle.seg.glas { stroke-dasharray: var(--glas-len, 94) 999; transition-delay: .4s; }
[data-reveal].revealed .lp-heatloss-chart circle.seg.vloer { stroke-dasharray: var(--vloer-len, 94) 999; transition-delay: .6s; }
[data-reveal].revealed .lp-heatloss-chart circle.seg.vent { stroke-dasharray: var(--vent-len, 94) 999; transition-delay: .8s; }
.lp-heatloss-chart-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: var(--font-display);
  pointer-events: none;
}
.lp-heatloss-chart-num {
  font-size: 38px; font-weight: 700; color: var(--accent);
  letter-spacing: -0.02em; line-height: 1;
}
.lp-heatloss-chart-sub {
  font-size: 11.5px; font-weight: 500; color: var(--ink-mute);
  letter-spacing: 0.08em; text-transform: uppercase;
  margin-top: 4px;
}
.lp-heatloss-legend { display: grid; gap: 10px; }
.lp-heatloss-legend-item {
  display: grid; grid-template-columns: 14px 1fr auto; align-items: center; gap: 10px;
  font-size: 14px; color: var(--ink);
}
.lp-heatloss-legend-item .dot {
  width: 12px; height: 12px; border-radius: 3px;
}
.lp-heatloss-legend-item .pct { font-weight: 700; color: var(--ink-soft); }
@media (max-width: 720px) {
  .lp-heatloss { grid-template-columns: 1fr; gap: 24px; }
  .lp-heatloss-chart { margin: 0 auto; }
}

/* ───────── Stats count-up animation ───────── */
.lp-stat-num {
  display: inline-block;
  transition: color .35s ease;
}
.lp-stat[data-counted] .lp-stat-num {
  animation: lp-stat-pop 0.6s ease-out;
}
@keyframes lp-stat-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.06); color: var(--accent); }
  100% { transform: scale(1); }
}

/* ───────── Premie box icon: roteren + pulserend goud ───────── */
.lp-premie-ico {
  position: relative;
  animation: lp-premie-glow 3.6s ease-in-out infinite;
}
@keyframes lp-premie-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(10,22,40,0.45), 0 8px 22px -10px rgba(10,22,40,0.45); }
  50%      { box-shadow: 0 0 0 10px rgba(10,22,40,0), 0 12px 30px -10px rgba(10,22,40,0.6); }
}

/* ───────── Urgency card: gradient sweep on hover ───────── */
.lp-urgency-card { position: relative; overflow: hidden; }
.lp-urgency-card::before {
  content: ''; position: absolute; left: -100%; top: 0; bottom: 0; width: 100%;
  background: linear-gradient(90deg, transparent, rgba(217,140,3,0.08), transparent);
  transition: left .7s cubic-bezier(.22,1,.36,1);
  pointer-events: none;
}
.lp-urgency-card:hover::before { left: 100%; }

/* ───────── Inline CTA banner — verspreid op LP voor extra conversie ───────── */
.lp-cta-banner {
  margin: 0;
  padding: 26px 34px;
  background: linear-gradient(135deg, #0a1628 0%, #14233a 100%);
  border-radius: 18px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  color: #fff;
  position: relative; overflow: hidden;
  isolation: isolate;
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
  white-space: nowrap;
  position: relative; z-index: 2;
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

/* ───────── Form select dropdown — modern, clean, premium ───────── */
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

/* ───── PRIJS-SECTIE ───── */
.lp-prijs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.lp-prijs-card {
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 14px;
  padding: 22px 22px 20px;
  transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
  position: relative;
  overflow: hidden;
}
.lp-prijs-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 36px; height: 3px;
  background: var(--accent);
  border-radius: 0 0 3px 0;
  transition: width .3s ease;
}
.lp-prijs-card:hover {
  border-color: rgba(217,140,3,0.4);
  transform: translateY(-2px);
  box-shadow: 0 14px 32px -16px rgba(10,22,40,0.18);
}
.lp-prijs-card:hover::before { width: 64px; }
.lp-prijs-card-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-soft);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.lp-prijs-card-amount {
  display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap;
  margin-bottom: 12px;
}
.lp-prijs-card-from { font-size: 13px; color: var(--ink-soft); font-weight: 500; }
.lp-prijs-card-amount strong {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: -0.02em;
  line-height: 1;
}
.lp-prijs-card-unit { font-size: 13px; color: var(--ink-soft); }
.lp-prijs-card-note { font-size: 13.5px; color: var(--ink-soft); line-height: 1.5; }
.lp-prijs-foot {
  font-size: 12.5px;
  color: var(--ink-mute);
  text-align: center;
  margin: 22px auto 0;
  max-width: 720px;
  line-height: 1.6;
}
@media (max-width: 900px) {
  .lp-prijs-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .lp-prijs-card { padding: 18px 16px 16px; }
  .lp-prijs-card-amount strong { font-size: 22px; }
  .lp-prijs-card-label { font-size: 11.5px; }
}
@media (max-width: 540px) {
  .lp-prijs-grid { grid-template-columns: 1fr; }
}

/* ───── VELUX-SECTIE ───── */
.lp-velux-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.lp-velux-card {
  background: #fff;
  border: 1.5px solid rgba(10,22,40,0.08);
  border-radius: 16px;
  padding: 26px 24px 24px;
  display: flex;
  flex-direction: column;
  transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
}
.lp-velux-card:hover {
  border-color: rgba(217,140,3,0.5);
  transform: translateY(-3px);
  box-shadow: 0 14px 32px -12px rgba(10,22,40,0.16);
}
.lp-velux-card-title {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}
.lp-velux-card-text {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.55;
  margin: 0 0 14px;
}
.lp-velux-card-list {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lp-velux-card-list li {
  font-size: 13.5px;
  color: var(--ink);
  padding-left: 18px;
  position: relative;
}
.lp-velux-card-list li::before {
  content: '✓';
  position: absolute; left: 0; top: 0;
  color: var(--accent);
  font-weight: 700;
}
.lp-velux-card-list strong { color: var(--navy); font-weight: 700; }
.lp-velux-card-cta {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: auto;
  padding: 11px 18px;
  background: var(--navy);
  color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 999px;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
  align-self: flex-start;
}
.lp-velux-card-cta:hover {
  background: #07182a;
  transform: translateY(-1px);
}
@media (max-width: 900px) {
  .lp-velux-grid { grid-template-columns: 1fr; gap: 14px; }
  .lp-velux-card { padding: 22px 20px 22px; }
}

/* ───── MOBILE TIGHTEN — overlap fixes + verminderde padding/text ───── */
@media (max-width: 720px) {
  .lf-section { padding: 44px 0 !important; }
  .lf-section-head { margin-bottom: 22px !important; }
  .lf-h2 { font-size: clamp(24px, 6vw, 32px) !important; line-height: 1.18 !important; letter-spacing: -0.02em; }
  .lf-eyebrow { font-size: 11px; letter-spacing: 0.14em; }
  .lf-lede { font-size: 14.5px !important; line-height: 1.55 !important; }
  .lp-stats-strip { gap: 24px 16px !important; padding: 28px 0 !important; }
  .lp-stat-num { font-size: clamp(28px, 7vw, 36px) !important; }
  .lp-stat-label { font-size: 12.5px !important; line-height: 1.4 !important; }
  .lp-premie { padding: 22px 18px !important; gap: 14px !important; }
  .lp-premie-text strong { font-size: 15.5px !important; line-height: 1.3 !important; display: block; margin-bottom: 6px; }
  .lp-premie-text p { font-size: 13.5px !important; line-height: 1.55 !important; }
  .lp-premie-cta { font-size: 13px !important; padding: 11px 18px !important; }
  /* Reviews carousel — tighter */
  .lp-reviews { padding: 38px 0 !important; }
  /* Anatomy grid tighter */
  .lp-anatomy-grid { gap: 10px !important; }
  .lp-anatomy-tile { padding: 14px 12px !important; }
  /* FAQ tighter */
  .ab-faq summary { padding: 14px 16px !important; font-size: 14.5px !important; }
  .ab-faq-body { padding: 0 16px 14px !important; }
  .ab-faq-body p { font-size: 13.5px !important; line-height: 1.55 !important; }
  /* Blog cards tighter */
  .lp-blog-card { padding: 0 !important; }
  .lp-blog-body { padding: 14px 16px 16px !important; }
  .lp-blog-meta { font-size: 11px !important; }
  /* Gallery cells — tighter caption */
  .lp-gallery-cap { padding: 10px 12px !important; }
  .lp-gallery-cap strong { font-size: 13.5px !important; }
  .lp-gallery-cap small { font-size: 10.5px !important; }
  /* Form section */
  .lp-form-section { padding: 36px 0 !important; }
  .lp-form-card { padding: 22px 18px !important; }
  .lp-form-card h3 { font-size: 19px !important; line-height: 1.25 !important; }
  .lp-form-card label { font-size: 13px !important; }
  .lp-form-card input, .lp-form-card select, .lp-form-card textarea {
    padding: 12px 14px !important; font-size: 14.5px !important;
  }
}

/* Sticky desktop CTA — ALTIJD goud (background op base + media, niet alleen
   inside media query, en ook inline op de <a> met !important voor zekerheid) */
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
`;

const HTML = `
<header class="lp-mini-header">
  <div class="wrap lp-mini-header-inner">
    <a class="lp-mini-brand" href="/" aria-label="AB Bouw Groep — home">
      <img src="${logo}" alt="AB Bouw Groep — Dakwerken" class="lp-mini-logo" />
    </a>
    <a href="${CONTACT.phone.href}" class="lp-mini-phone" aria-label="Bel ons direct">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <span class="lp-mini-phone-label">${CONTACT.phone.spaced}</span>
    </a>
  </div>
</header>

<section class="lf-hero lp-hero-cine">
  <div class="lf-hero-bg lf-hero-bg--slides" data-hero-slides>
    <img src="${heroClassic}" alt="Vlaamse rijwoning renovatie met anthraciet pannen — AB Dakwerken" class="is-active" />
    <img src="${heroCrepi}" alt="Moderne villa met witte crepi gevel en anthraciet pannen — AB Bouw Groep" loading="lazy" />
    <img src="${heroOranje}" alt="Energieneutrale woning met oranje gevel en zonnepanelen — AB Dakwerken" loading="lazy" />
    <img src="${heroGeel}" alt="Eigentijdse nieuwbouw met gele baksteen en anthraciet dak — AB Bouw Groep" loading="lazy" />
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
      <p class="lf-hero-sub">Volledige dakvervanging, dakisolatie en zinkwerk in Mechelen, Antwerpen, Lier en heel Vlaanderen. <strong style="color:#fff;">Gratis plaatsbezoek</strong> binnen 5 werkdagen · <strong style="color:#fff;">bindende offerte</strong> met fotorapport · <strong style="color:#fff;">10 jaar garantie</strong> op waterdichtheid.</p>
      <div class="lf-hero-actions">
        <a href="#lp-form" class="lf-cta-pill" data-smooth>
          <span>Gratis dakinspectie aanvragen</span>
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
        <span><b>124+</b> klanten</span>
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
        <div class="lp-quick-form-title">Plan uw gratis dakinspectie</div>
        <div class="lp-quick-form-sub">Vakman langs binnen 5 werkdagen · bindende offerte · 100% vrijblijvend</div>
      </div>
    </div>
    <form data-lp-quick-form novalidate>
      <input type="text" name="firstName" placeholder="Voornaam *" required autocomplete="given-name" />
      <input type="email" name="email" placeholder="E-mailadres *" required autocomplete="email" inputmode="email" />
      <input type="tel" name="phone" placeholder="Telefoon *" required autocomplete="tel" inputmode="tel" />
      <button type="submit" data-lp-quick-submit style="background:#d98c03 !important; background-color:#d98c03 !important; color:#ffffff !important; border:none;">
        <span data-lp-quick-submit-label>Plan mijn gratis dakinspectie</span>
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

<section class="lf-section lp-calc-cta-section" style="padding: 32px 0 8px;">
  <div class="wrap">
    <a href="/calculator/dakwerken" class="lp-calc-cta" data-calc-trigger>
      <div class="lp-calc-cta-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/>
          <line x1="8" y1="6" x2="16" y2="6"/>
          <line x1="8" y1="10" x2="10" y2="10"/>
          <line x1="12" y1="10" x2="14" y2="10"/>
          <line x1="16" y1="10" x2="16" y2="10"/>
          <line x1="8" y1="14" x2="10" y2="14"/>
          <line x1="12" y1="14" x2="14" y2="14"/>
          <line x1="16" y1="14" x2="16" y2="14"/>
          <line x1="8" y1="18" x2="14" y2="18"/>
        </svg>
      </div>
      <div class="lp-calc-cta-text">
        <span class="lp-calc-cta-eyebrow">Sneller dan een formulier</span>
        <strong class="lp-calc-cta-title">Bereken uw offerte online — <span class="lp-calc-cta-em">60 seconden</span></strong>
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
              { name: 'Stijn Devos', role: 'Pannendak Koramic', img: rev1, text: 'Onze rijwoning had een dak van 1962, lekte op drie plaatsen. AB Bouw stripte alles op één maandag en lag vrijdag waterdicht. Koramic Aleonard pannen, sarkingisolatie, nieuwe goten. Premie van €4.200 een maand na oplevering op de rekening.', highlights: ['vrijdag waterdicht', 'Koramic Aleonard', '€4.200 een maand na oplevering'] },
              { name: 'Lieve Hermans', role: 'Plat dak EPDM', img: rev2, text: 'Vrijdag een natte vlek op het plafond, zaterdag belde een van de werfleiders me terug. Maandag stond de ploeg op het dak. 70 m² EPDM in één stuk gelegd, geen naden, geen sjoemel. Factuur klopte tot op de euro met de offerte.', highlights: ['zaterdag belde een van de werfleiders me terug', 'geen naden', 'tot op de euro'] },
              { name: 'Yusuf Demir', role: 'Sarking dakisolatie', img: rev3, text: 'Wij wilden vooral lager EPC voor de verkoop. Sarkingsysteem buitenop, oude binnenafwerking bleef. EPC van F naar C op twee weken werk. De vastgoedmakelaar liet ons €18.000 hoger vragen na de renovatie.', highlights: ['EPC van F naar C', 'twee weken werk', '€18.000 hoger'] },
              { name: 'Greet Coppens', role: 'Velux dakvenster', img: rev4, text: 'Twee Velux GGL ramen in de keperruimte voor onze nieuwe zolderslaapkamer. Plaatsing op twee dagen, binnenafwerking direct mee gepleisterd. Geen koudebrug, geen condens, en de zomer waren we héél blij met de Velux-zonwering.', highlights: ['twee dagen', 'Geen koudebrug', 'héél blij'] },
              { name: 'Davy Janssens', role: 'Stormschade hersteld', img: rev5, text: 'Storm Pia haalde de helft van de pannen weg. Eén van de experts stuurde dezelfde dag iemand voor het dekzeil, de week erop volledig nieuw dak. Verzekering werd door hen rechtstreeks geregeld — wij moesten niets uitzoeken.', highlights: ['dezelfde dag', 'wij moesten niets uitzoeken'] },
              { name: 'Annick Verstraete', role: 'Zinkwerk VMZinc', img: rev6, text: 'Oude koperen goten vervangen door natuurzink VMZinc Anthra-Zinc. Gesoldeerde verbindingen, geen plastic koppelstukken, geen kit. Strakke lijn rond heel het huis. Volgens de loodgieter gaat dit 60 jaar mee.', highlights: ['VMZinc Anthra-Zinc', 'Strakke lijn', '60 jaar mee'] },
              { name: 'Ahmed Berraf', role: 'Volledige dakrenovatie', img: rev7, text: 'Twee verdiepingen + zolder, alles gestript en opnieuw. De werfleider stond elke vrijdag op de werf om de week te overlopen. Foto-update elke avond per WhatsApp. Premie van €5.200 ingediend door hen.', highlights: ['elke vrijdag op de werf', 'Foto-update elke avond', 'Premie van €5.200'] },
              { name: 'Tine Verlinden', role: 'PIR-dakisolatie', img: rev8, text: 'Drie aannemers gevraagd, twee wilden direct alles vervangen. Eén van de experts klopte op de pannen, zei: dit dak gaat nog 20 jaar mee, gewoon isolatie tussen kepers. Klaar in 3 dagen. EPC-sprong van 58 punten.', highlights: ['nog 20 jaar mee', 'Klaar in 3 dagen', 'EPC-sprong van 58 punten'] },
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
      <div class="lp-stat" data-reveal><div class="lp-stat-num" data-count-up="48325" data-count-suffix=" m²">0 m²</div><div class="lp-stat-label">Afgewerkte daken sinds 2010</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="1"><div class="lp-stat-num" data-count-up="6" data-count-suffix=" vaste">0 vaste</div><div class="lp-stat-label">Eigen dakdekkers in dienst</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="2"><div class="lp-stat-num" data-count-up="30" data-count-suffix="%">0%</div><div class="lp-stat-label">Minder warmteverlies na isolatie</div></div>
      <div class="lp-stat" data-reveal data-reveal-delay="3"><div class="lp-stat-num" data-count-up="40" data-count-prefix="€" data-count-suffix="/m²">€0/m²</div><div class="lp-stat-label">Premie dakisolatie 2026</div></div>
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
        <strong>Premie 2026: €40/m² — daarna minder.</strong>
        <p>Op een gemiddelde rijwoning <strong style="color:var(--navy);">€3.500–€5.500 terug</strong>. Vanaf 2027 zakt het tarief — wie nu boekt zet de 2026-premie vast in offerte. Wij regelen het volledige dossier.</p>
      </div>
      <a href="#lp-form" class="lp-premie-cta" data-smooth>
        Bereken mijn premie
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>
</section>

<!-- PRIJS-ANCHOR sectie — voor 'hoeveel kost' searches die nu bouncen -->
<section class="lf-section" style="padding: 56px 0 56px;">
  <div class="wrap">
    <div class="lf-section-head" data-reveal style="margin-bottom: 28px;">
      <span class="lf-eyebrow">Indicatieve richtprijzen 2026</span>
      <h2 class="lf-h2">Wat kost een <span class="ab-mark">nieuw dak</span>?</h2>
      <p class="lf-lede" style="margin: 14px 0 0; max-width: 640px;">Eerlijke richtprijzen op basis van onze recente projecten. Exacte prijs altijd na gratis plaatsbezoek met fotorapport.</p>
    </div>
    <div class="lp-prijs-grid" data-reveal>
      <div class="lp-prijs-card">
        <div class="lp-prijs-card-label">Pannendak — Koramic klei</div>
        <div class="lp-prijs-card-amount"><span class="lp-prijs-card-from">vanaf</span> <strong>€140-200</strong> <span class="lp-prijs-card-unit">/ m²</span></div>
        <div class="lp-prijs-card-note">Volledige vervanging, panlatten, onderdakfolie, dakgoot.</div>
      </div>
      <div class="lp-prijs-card">
        <div class="lp-prijs-card-label">Plat dak — EPDM rubber</div>
        <div class="lp-prijs-card-amount"><span class="lp-prijs-card-from">vanaf</span> <strong>€120-160</strong> <span class="lp-prijs-card-unit">/ m²</span></div>
        <div class="lp-prijs-card-note">Firestone EPDM, aluminium daktrim, 25j garantie.</div>
      </div>
      <div class="lp-prijs-card">
        <div class="lp-prijs-card-label">Dakisolatie — sarking PIR</div>
        <div class="lp-prijs-card-amount"><span class="lp-prijs-card-from">vanaf</span> <strong>€95-140</strong> <span class="lp-prijs-card-unit">/ m²</span></div>
        <div class="lp-prijs-card-note">22 cm PIR, Mijn VerbouwPremie €40/m² recupereerbaar.</div>
      </div>
      <div class="lp-prijs-card">
        <div class="lp-prijs-card-label">Natuurleien — Cupa Heavy</div>
        <div class="lp-prijs-card-amount"><span class="lp-prijs-card-from">vanaf</span> <strong>€220-310</strong> <span class="lp-prijs-card-unit">/ m²</span></div>
        <div class="lp-prijs-card-note">Premium leien, koperen kielgoten, 100j levensduur.</div>
      </div>
      <div class="lp-prijs-card">
        <div class="lp-prijs-card-label">Velux dakvenster</div>
        <div class="lp-prijs-card-amount"><span class="lp-prijs-card-from">vanaf</span> <strong>€1.700</strong> <span class="lp-prijs-card-unit">per stuk</span></div>
        <div class="lp-prijs-card-note">GGL/GPL, inclusief pan-aansluiting + binnenafwerking.</div>
      </div>
      <div class="lp-prijs-card">
        <div class="lp-prijs-card-label">Zinkwerk — VMZinc</div>
        <div class="lp-prijs-card-amount"><span class="lp-prijs-card-from">vanaf</span> <strong>€85-130</strong> <span class="lp-prijs-card-unit">/ lopende m</span></div>
        <div class="lp-prijs-card-note">Bakgoot of mastgoot, koperen regenpijpen op maat.</div>
      </div>
    </div>
    <p class="lp-prijs-foot" data-reveal>Prijzen excl. BTW (6% renovatie / 21% nieuwbouw). Gratis plaatsbezoek = exacte bindende offerte binnen 5 werkdagen.</p>
  </div>
</section>

<!-- VELUX & DAKKAPEL sectie — anchor voor velux-search traffic -->
<section class="lf-section lf-tone-soft" id="velux" style="padding: 56px 0 60px;">
  <div class="wrap">
    <div class="lf-section-head" data-reveal style="margin-bottom: 28px;">
      <span class="lf-eyebrow">Velux & dakvensters</span>
      <h2 class="lf-h2">Enkel een dakvenster? <span class="ab-mark">Vakman binnen 5 dagen.</span></h2>
      <p class="lf-lede" style="margin: 14px 0 0; max-width: 640px;">Geen volledige dakrenovatie nodig — wij doen ook losse Velux- en dakvensterjobs van 1 tot 3 dagen.</p>
    </div>
    <div class="lp-velux-grid" data-reveal>
      <div class="lp-velux-card">
        <strong class="lp-velux-card-title">Velux plaatsen</strong>
        <p class="lp-velux-card-text">Nieuw Velux GGL of GPL in bestaande pannen of leien. Inclusief pan-aansluiting, dampscherm, binnenafwerking en gootstuk.</p>
        <ul class="lp-velux-card-list">
          <li><strong>1-2 dagen</strong> per dakvenster</li>
          <li><strong>10 jaar garantie</strong> waterdichtheid</li>
          <li><strong>Vanaf €1.700</strong> compleet</li>
        </ul>
        <a href="#lp-form" class="lp-velux-card-cta" data-smooth>Vraag Velux-offerte<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
      </div>
      <div class="lp-velux-card">
        <strong class="lp-velux-card-title">Dakkapel toevoegen</strong>
        <p class="lp-velux-card-text">Volledige dakkapel met staand venster — meer licht én staanruimte op zolder. Bekleding in zink of crepi.</p>
        <ul class="lp-velux-card-list">
          <li><strong>2-3 weken</strong> per dakkapel</li>
          <li><strong>Bouwvergunning</strong> wij regelen</li>
          <li><strong>Vanaf €8.500</strong> compleet</li>
        </ul>
        <a href="#lp-form" class="lp-velux-card-cta" data-smooth>Vraag dakkapel-offerte<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
      </div>
      <div class="lp-velux-card">
        <strong class="lp-velux-card-title">Dakraam vervangen</strong>
        <p class="lp-velux-card-text">Oud Velux of dakraam met condens of lekkage? Vervanging in zelfde opening, vaak in 1 dag klaar.</p>
        <ul class="lp-velux-card-list">
          <li><strong>1 dag</strong> per raam</li>
          <li><strong>Behoud</strong> binnenafwerking</li>
          <li><strong>Vanaf €1.350</strong> compleet</li>
        </ul>
        <a href="#lp-form" class="lp-velux-card-cta" data-smooth>Vraag vervanging-offerte<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
      </div>
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
          <li>Geen lekken meer — droog plafond, droge isolatie, droog spaargeld</li>
          <li>30% lagere stookkost vanaf dag één</li>
          <li>EPC-sprong klaar voor renovatieplicht 2028 — wie wacht betaalt</li>
          <li>€8.000–€18.000 meerwaarde bij verkoop</li>
        </ul>
        <a href="#lp-form" class="lf-cta-pill" style="margin-top: 28px;">
          <span>Vraag uw gratis plaatsbezoek aan</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
      </div>
      <div data-reveal data-reveal-delay="1">
        <div class="lp-heatloss">
          <div class="lp-heatloss-chart">
            <svg viewBox="0 0 100 100">
              <!-- Total circumference at r=40 ≈ 251.3 -->
              <circle class="bg" cx="50" cy="50" r="40"/>
              <!-- Dak 30% = 75.4 -->
              <circle class="seg dak"  cx="50" cy="50" r="40" stroke="#d98c03" style="--dak-len: 75.4"/>
              <!-- Muren 25% = 62.8 (offset 75.4) -->
              <circle class="seg muur" cx="50" cy="50" r="40" stroke="#0a1628" style="--muur-len: 62.8" stroke-dashoffset="-75.4"/>
              <!-- Ramen 15% = 37.7 (offset 138.2) -->
              <circle class="seg glas" cx="50" cy="50" r="40" stroke="#4a9090" style="--glas-len: 37.7" stroke-dashoffset="-138.2"/>
              <!-- Vloer 15% = 37.7 (offset 175.9) -->
              <circle class="seg vloer" cx="50" cy="50" r="40" stroke="#6b8e4e" style="--vloer-len: 37.7" stroke-dashoffset="-175.9"/>
              <!-- Ventilatie 15% = 37.7 (offset 213.6) -->
              <circle class="seg vent" cx="50" cy="50" r="40" stroke="#9b3a3a" style="--vent-len: 37.7" stroke-dashoffset="-213.6"/>
            </svg>
            <div class="lp-heatloss-chart-center">
              <div class="lp-heatloss-chart-num">30%</div>
              <div class="lp-heatloss-chart-sub">verlies via dak</div>
            </div>
          </div>
          <div class="lp-heatloss-legend">
            <div class="lp-heatloss-legend-item"><span class="dot" style="background:#d98c03"></span><span>Dak</span><span class="pct">30%</span></div>
            <div class="lp-heatloss-legend-item"><span class="dot" style="background:#0a1628"></span><span>Muren</span><span class="pct">25%</span></div>
            <div class="lp-heatloss-legend-item"><span class="dot" style="background:#4a9090"></span><span>Ramen &amp; deuren</span><span class="pct">15%</span></div>
            <div class="lp-heatloss-legend-item"><span class="dot" style="background:#6b8e4e"></span><span>Vloer</span><span class="pct">15%</span></div>
            <div class="lp-heatloss-legend-item"><span class="dot" style="background:#9b3a3a"></span><span>Ventilatie</span><span class="pct">15%</span></div>
          </div>
        </div>
      </div>
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
        <p>Mijn VerbouwPremie staat in 2026 op €40/m² maar wordt <mark class="lp-hot" style="--lp-hot-delay:120">elk jaar verlaagd</mark>. Op een gemiddelde rijwoning bespaart u nu <mark class="lp-hot" style="--lp-hot-delay:340">€3.500-€5.400</mark> die u in 2027 <mark class="lp-hot" style="--lp-hot-delay:560">niet meer krijgt</mark>.</p>
      </div>
      <div class="lp-urgency-card" data-reveal data-reveal-delay="1">
        <div class="lp-urgency-num">02</div>
        <h4>Materiaalprijzen stijgen</h4>
        <p>Pannen, leien en EPDM zijn sinds 2022 <mark class="lp-hot" style="--lp-hot-delay:120">+18% duurder</mark> en blijven stijgen. Wie nu boekt, krijgt nog <mark class="lp-hot" style="--lp-hot-delay:340">2026-tarieven vastgezet</mark> in offerte.</p>
      </div>
      <div class="lp-urgency-card" data-reveal data-reveal-delay="2">
        <div class="lp-urgency-num">03</div>
        <h4>Klaar binnen 2 weken</h4>
        <p>Begin nu en uw dak ligt <mark class="lp-hot" style="--lp-hot-delay:120">binnen 2 weken waterdicht</mark>. Wachten betekent langer met <mark class="lp-hot" style="--lp-hot-delay:340">stormrisico</mark> én een hogere stookrekening deze winter.</p>
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
        <p>Bij oude pannendaken duikt vaak asbest op. Verwijdering + verwerkingsattest in de offerte.</p>
      </div>
      <div class="lp-usp-card" data-reveal data-reveal-delay="2">
        <div class="lp-usp-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
        <h4>Schone-werf garantie</h4>
        <p>Foto-update elke vrijdag via WhatsApp. Werf netjes opgeruimd voor het weekend.</p>
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
        <strong>Vandaag bellen = volgende week op uw dak.</strong>
        <span>Gratis plaatsbezoek binnen 5 werkdagen · vrijblijvende offerte · 10 jaar garantie.</span>
      </div>
      <a href="#lp-form" class="lp-cta-banner-cta" data-smooth>
        Plan mijn gratis dakinspectie
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div class="lf-split-img" data-reveal><img src="${heroCrepi}" alt="Afgewerkte nieuwbouw met crepi en zwart dak — resultaat AB Dakwerken" loading="lazy"/></div>
      <div data-reveal data-reveal-delay="1">
        <span class="lf-eyebrow">Onze werkwijze</span>
        <h2 class="lf-h2">Van eerste gesprek tot<br/><span class="ab-mark">waterdicht dak</span> in 6 weken.</h2>
        <p class="lf-lede" style="margin-bottom: 8px;">Eigen dakploeg. Geen onderaannemers. Eén verantwoordelijke.</p>
        <ol class="lp-process-steps">
          <li><span class="lp-process-num">01</span><div><strong>Plaatsbezoek</strong><span>Week 1 · Gratis inspectie + dronefoto's + richtprijs</span></div></li>
          <li><span class="lp-process-num">02</span><div><strong>Offerte</strong><span>Week 2 · Bindend op papier + premiedossier voorbereid</span></div></li>
          <li><span class="lp-process-num">03</span><div><strong>Uitvoering</strong><span>Week 3-5 · 8-14 werkdagen + weekrapport per email</span></div></li>
          <li><span class="lp-process-num">04</span><div><strong>Oplevering</strong><span>Premie ingediend · 10 jaar garantie schriftelijk</span></div></li>
        </ol>
      </div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 28px;">
      <span class="lf-eyebrow">Interactief</span>
      <h2 class="lf-h2">Uw dak in <span class="ab-mark">3D</span> — laag voor laag.</h2>
      <p class="lf-lede" style="margin: 14px auto 0; max-width: 620px;">Geen pannen op een lat — <strong>6 lagen vakwerk</strong> die samen waterdichtheid, isolatie en comfort leveren. Conform Vlaamse renovatieplicht 2028.</p>
    </div>
    <div class="lp-dak-cross-wrap" data-reveal>
      <img class="lp-dak-cross-img" src="${dakCross}" alt="Dak cross-section — 6 lagen van plafond tot dakpannen"/>
    </div>
    <div class="lp-anatomy-grid" data-reveal>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${anaL1}" alt="Koramic dakpannen — laag 1" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">01</span>
          <h4>Dakpannen of natuurleien</h4>
          <p>Koramic ceramic pannen of Cupa natuurleien — waterdichte buitenste laag.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${anaL2}" alt="Tengels en panlatten — laag 2" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">02</span>
          <h4>Tengels en panlatten</h4>
          <p>Pine houten dragers die de pannen op exacte hoogte houden voor luchtcirculatie.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${anaL3}" alt="Onderdak waterdichte folie — laag 3" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">03</span>
          <h4>Onderdak</h4>
          <p>Diffuus-open waterdichte folie — vangt eventuele lekkages op.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${anaL4}" alt="PIR-isolatie tussen kepers — laag 4" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">04</span>
          <h4>PIR-isolatie</h4>
          <p>Recticel Powerroof PIR-platen met aluminium reflectie — λ=0,022 W/mK, beste isolatie in zijn klasse.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${anaL5}" alt="Dampscherm — laag 5" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">05</span>
          <h4>Dampscherm</h4>
          <p>Polyethyleen folie die vocht binnenshuis tegenhoudt vooraleer het in de isolatie komt.</p>
        </div>
      </div>
      <div class="lp-anatomy-tile">
        <div class="lp-anatomy-tile-img"><img src="${anaL6}" alt="Binnenafwerking — laag 6" loading="lazy"/></div>
        <div class="lp-anatomy-tile-body">
          <span class="lp-anatomy-tile-num">06</span>
          <h4>Binnenafwerking</h4>
          <p>Gipsplaten of gevoegde houten plafondbekleding — strak afgewerkt zoals in een woonkamer.</p>
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
        <span>Eén van onze experts komt langs en zegt u eerlijk wat moet en wat kan wachten. Vrijblijvend en gratis.</span>
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
      <h2 class="lf-h2">Daken die de<br/><span class="ab-mark">tand des tijds</span> doorstaan.</h2>
    </div>
    <div class="lp-gallery">
      <a href="#lp-form" class="lp-gallery-cell" data-reveal>
        <img src="${heroClassic}" alt="Klassieke Vlaamse renovatie met anthraciet pannen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Renovatie</small><strong>Anthraciet pannen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="1">
        <img src="${imgNatuurleien}" alt="Natuurleien close-up vakwerk" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Hellend dak</small><strong>Natuurleien</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="2">
        <img src="${imgPlatDak}" alt="Plat dak EPDM" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Plat dak</small><strong>EPDM rubber</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="3">
        <img src="${heroOranje}" alt="Nieuwbouw met oranje gevel en zonnepanelen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Nieuwbouw</small><strong>Oranje gevel + solar</strong></div>
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
      <details data-reveal><summary>Wat kost een nieuw dak in 2026?</summary><div class="ab-faq-body"><p>Volledige vervanging hellend dak op rijwoning (120 m²): €18.000-€32.000 alles inbegrepen. Plat dak in EPDM iets goedkoper. De premie €40/m² haalt €3.500-€5.500 van die factuur. Bindende richtprijs na plaatsbezoek.</p></div></details>
      <details data-reveal><summary>Hoe lang duurt de plaatsing?</summary><div class="ab-faq-body"><p>Hellend pannendak op rijwoning: 8-14 werkdagen. Plat dak EPDM: 4-8 werkdagen. Inclusief stelling en eindopkuis.</p></div></details>
      <details data-reveal><summary>Doen jullie de premieaanvraag voor mij?</summary><div class="ab-faq-body"><p>Ja, standaard. We bereiden het Mijn VerbouwPremie-dossier voor, leveren foto's en facturen aan in juist format. U deelt enkel uw burgerprofiel-login.</p></div></details>
      <details data-reveal><summary>Wat is uw garantie?</summary><div class="ab-faq-body"><p>10 jaar wettelijke aansprakelijkheid op waterdichtheid en stabiliteit, gedekt door polis bij Federale Verzekering. Plus fabrieksgarantie 30-50 jaar op Koramic/Eternit/Firestone materialen.</p></div></details>
      <details data-reveal><summary>Werken jullie ook bij dringende lekkages?</summary><div class="ab-faq-body"><p>Ja. Bij stormschade bellen we dezelfde week. Tijdelijke water-stop, daarna structurele renovatie. Bel voor 16u → iemand dezelfde dag.</p></div></details>
      <details data-reveal><summary>Welke regio's bedienen jullie?</summary><div class="ab-faq-body"><p>Volledige provincie Antwerpen en Vlaams-Brabant. Onze ploeg vertrekt elke ochtend uit Willebroek — werkbereik tot ongeveer 50 km. Mechelen, Antwerpen, Lier, Boom, Bornem, Puurs, Sint-Niklaas, Heist-op-den-Berg, Brussel-rand, Vilvoorde, Aalst, Dendermonde, Leuven. Twijfel je over jouw gemeente? Bel even — als we ‘ja’ zeggen, komen we.</p></div></details>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal style="margin-bottom: 40px;">
      <span class="lf-eyebrow">Verdiepende reads</span>
      <h2 class="lf-h2">Eerst wat <span class="ab-mark">leren</span> over dakwerken?</h2>
      <p class="lf-lede" style="margin: 16px auto 0; max-width: 620px;">Drie artikelen die de meest gestelde vragen beantwoorden.</p>
    </div>
    <div class="lp-blog-grid">
      ${LP_BLOGS.map((b, i) => `
        <a href="/blog/${b.slug}?lp=%2Flp%2Fdakwerken" target="_blank" rel="noopener" class="lp-blog-card" data-reveal data-reveal-delay="${i}">
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

<!-- PRIJS-ANKER: ruwe budget-zone voor sceptische BE-buyer -->
<section class="lp-price-anchor" data-reveal>
  <div class="wrap">
    <div class="lp-price-anchor-inner">
      <div class="lp-price-anchor-eyebrow-wrap">
        <span class="lp-price-anchor-eyebrow">Ruwe richtprijs 2026</span>
        <div class="lp-price-anchor-title">Wat kost een dak<br/>ongeveer?</div>
      </div>
      <div class="lp-price-anchor-grid">
        <div class="lp-price-anchor-item">
          <span class="lp-price-anchor-num">Vanaf €85/m²</span>
          <span class="lp-price-anchor-lbl">Pannendak Koramic — incl. onderdak, panlatten en plaatsing</span>
        </div>
        <div class="lp-price-anchor-item">
          <span class="lp-price-anchor-num">Vanaf €110/m²</span>
          <span class="lp-price-anchor-lbl">Plat dak EPDM Firestone — incl. isolatie en dakopstand</span>
        </div>
        <div class="lp-price-anchor-item">
          <span class="lp-price-anchor-num">Tot €40/m² premie</span>
          <span class="lp-price-anchor-lbl">Mijn VerbouwPremie 2026 voor dakisolatie — wij regelen dossier</span>
        </div>
        <div class="lp-price-anchor-foot">
          Richtprijzen exclusief btw, gebaseerd op standaard rijwoning. Definitieve prijs in offerte na plaatsbezoek — geen verrassingen achteraf.
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lp-form-section" id="lp-form" style="scroll-margin-top: 100px; padding-top: 40px;">
  <div class="wrap">
    <div class="lp-form-grid">
      <div class="lp-form-side" data-reveal>
        <span class="lf-eyebrow">Gratis dakinspectie</span>
        <h2 class="lf-h2" style="color:#fff;">Vraag uw <span class="ab-mark">gratis dakinspectie</span> aan.</h2>
        <p>Binnen 5 werkdagen komt onze dakploeg langs. Volledige opname met dronefoto's, eerste richtprijs ter plaatse, premiedossier doorgesproken — <mark class="lp-hot" style="--lp-hot-delay:120">100% vrijblijvend en gratis</mark>.</p>
        <ul>
          <li>Plaatsbezoek binnen 5 werkdagen</li>
          <li>Bindende offerte op papier</li>
          <li>Premiedossier inbegrepen (gem. €3.500+ terug)</li>
          <li>10 jaar garantie op waterdichtheid</li>
          <li>Eigen dakploeg, geen onderaannemers</li>
        </ul>
      </div>
      <div class="lp-form-card" data-reveal data-reveal-delay="1" data-lp-form-wrapper>
        <h3>Plan uw gratis <mark class="lp-hot">dakinspectie</mark></h3>
        <p class="lf-form-sub">We bellen u binnen één werkdag terug — <mark class="lp-hot">100% vrijblijvend</mark>.</p>
        <form data-lp-form novalidate>
          <div class="lp-form-row">
            <input type="text" name="firstName" placeholder="Voornaam *" required autocomplete="given-name" />
            <input type="text" name="lastName" placeholder="Familienaam" autocomplete="family-name" />
          </div>
          <input type="email" name="email" placeholder="E-mailadres *" required autocomplete="email" />
          <input type="tel" name="phone" placeholder="Telefoonnummer *" required autocomplete="tel" />
          <select name="type_dak">
            <option value="">Type dakwerk (optioneel)</option>
            <option value="pannendak">Hellend dak (pannen)</option>
            <option value="natuurleien">Hellend dak (natuurleien)</option>
            <option value="plat_dak_epdm">Plat dak — EPDM</option>
            <option value="plat_dak_roofing">Plat dak — bitumen / roofing</option>
            <option value="dakvenster">Dakvenster (Velux)</option>
            <option value="zinkwerk">Zinkwerk / dakgoten</option>
            <option value="isolatie">Dakisolatie</option>
            <option value="lekkage">Lekkage / stormschade</option>
            <option value="anders">Anders / weet niet zeker</option>
          </select>
          <textarea name="aanvullende_info" placeholder="Vertel kort over uw dak (optioneel)"></textarea>
          <button type="submit" data-lp-submit style="background:#d98c03 !important; color:#fff !important;">Vraag gratis dakinspectie aan</button>
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

<a href="#lp-form" class="lp-sticky-cta" aria-label="Vraag dakinspectie" style="background-color:#d98c03 !important; background-image:none !important; background:#d98c03 !important; color:#fff !important;">
  Vraag gratis dakinspectie aan
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
</a>

<a href="${CONTACT.phone.href}" class="lf-fab-call" aria-label="Bel ons direct">
  <span class="lf-fab-pulse"></span>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
</a>
`;

export default function LpDakwerken({ local }: { local?: Gemeente } = {}) {
  const [calcOpen, setCalcOpen] = useState(false);

  // Klikken op [data-calc-trigger] in de LP-HTML opent modal i.p.v. navigeren
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest('[data-calc-trigger]');
      if (trigger) {
        e.preventDefault();
        setCalcOpen(true);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const pageUrl = local ? `https://abgroep.be/lokaal/dakwerker-${local.slug}` : 'https://abgroep.be/lp/dakwerken';
    // Canonical: non-local LP wijst naar de service-pagina /dakwerken om duplicate
    // content-fight met organic te voorkomen. Lokal-varianten blijven self-canonical
    // (stadsgerichte SEO is uniek).
    const canonicalUrl = local ? pageUrl : 'https://abgroep.be/dakwerken';
    document.title = local
      ? `Dakwerker ${local.name} — Pannen, Plat dak EPDM, Sarkingisolatie | AB Bouw Groep`
      : "Dakwerker Mechelen & Antwerpen — Pannen, Plat dak, EPDM, Isolatie | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', local
      ? `Erkend dakwerker in ${local.name} (${local.postcode}). Pannendak Koramic, plat dak EPDM, sarkingisolatie, zinkwerk en natuurleien. Eigen ploeg uit Willebroek, 10 jaar garantie via Federale Verzekering, premie Mijn VerbouwPremie inbegrepen. Gratis plaatsbezoek binnen 5 werkdagen.`
      : 'Erkend dakwerker in Mechelen, Antwerpen, Lier, Bornem, Sint-Niklaas. Pannendak, plat dak EPDM, sarking-isolatie, zinkwerk. Eigen dakdekkers, 10 jaar garantie via Federale Verzekering, premie Mijn VerbouwPremie inbegrepen. Gratis plaatsbezoek binnen 5 werkdagen.');

    // Open Graph + Twitter cards
    const setMeta = (prop: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('og:title', local
      ? `Dakwerker ${local.name} — Gratis dakinspectie | AB Bouw Groep`
      : 'Dakwerker Mechelen & Antwerpen — Gratis dakinspectie | AB Bouw Groep', true);
    setMeta('og:description', local
      ? `Pannendak, plat dak EPDM en dakisolatie in ${local.name}. Eigen ploeg, 10j garantie, premiedossier inbegrepen.`
      : 'Nieuw dak, plat dak EPDM, dakisolatie. Eigen ploeg, 10j garantie, premiedossier inbegrepen.', true);
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

    // Schema.org JSON-LD: RoofingContractor + FAQ + Service
    const schemaId = 'lp-dak-schema';
    document.getElementById(schemaId)?.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "RoofingContractor",
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
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "124", "bestRating": "5" },
          "sameAs": ["https://www.facebook.com/abbouwgroep", "https://www.instagram.com/abbouwgroep"]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": local
            ? [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://abgroep.be" },
              { "@type": "ListItem", "position": 2, "name": "Dakwerker", "item": "https://abgroep.be/dakwerken" },
              { "@type": "ListItem", "position": 3, "name": `Dakwerker ${local.name}`, "item": pageUrl }
            ]
            : [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://abgroep.be" },
              { "@type": "ListItem", "position": 2, "name": "Dakwerken", "item": "https://abgroep.be/lp/dakwerken" }
            ]
        },
        {
          "@type": "Service",
          "name": "Dakwerken — pannen, plat dak EPDM, dakisolatie",
          "provider": { "@id": "https://abgroep.be/#organization" },
          "areaServed": "Vlaanderen",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Dakwerken diensten",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pannendak Koramic" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Plat dak EPDM Firestone" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Natuurleien Cupa" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sarkingisolatie PIR" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Velux dakvenster" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Zinkwerk VMZinc + dakgoten" }}
            ]
          }
        },
        {
          "@type": "FAQPage",
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ab-faq-body p"] },
          "mainEntity": [
            { "@type": "Question", "name": "Hoeveel kost een nieuw dak in Vlaanderen?", "acceptedAnswer": { "@type": "Answer", "text": "Een pannendak inclusief sarkingisolatie kost gemiddeld €120-€170/m². Een plat dak EPDM €90-€140/m². Definitieve prijs hangt af van isolatieniveau, dakopbouw en complexiteit. Wij geven een vaste prijs op offerte na plaatsbezoek." }},
            { "@type": "Question", "name": "Doen jullie de premieaanvraag voor Mijn VerbouwPremie?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, standaard. Wij bereiden uw Mijn VerbouwPremie-dossier voor, leveren foto's en facturen aan in juist format (m² + Rd-waarde + notificatiecode). U deelt enkel uw burgerprofiel-login." }},
            { "@type": "Question", "name": "Hoe lang duren dakwerken?", "acceptedAnswer": { "@type": "Answer", "text": "Een gemiddelde rijwoning ligt waterdicht binnen 2 weken. Volledige renovatie met isolatie en goten 3-5 weken afhankelijk van complexiteit." }},
            { "@type": "Question", "name": "Wat is uw garantie?", "acceptedAnswer": { "@type": "Answer", "text": "10 jaar wettelijke aansprakelijkheid op waterdichtheid en stabiliteit, gedekt door polis bij Federale Verzekering. Plus fabrieksgarantie 30-50 jaar op Koramic/Eternit/Firestone materialen." }},
            { "@type": "Question", "name": "Werken jullie zonder voorschot?", "acceptedAnswer": { "@type": "Answer", "text": "Wij hanteren 30% bij ondertekening, 40% bij aanvang werken, 30% bij oplevering. Geen vooruitbetaling voor materialen die u nog niet zag." }}
          ]
        }
      ]
    });
    document.head.appendChild(schema);

    const prev = document.body.className;
    document.body.className = 'lp-page is-subpage';
    try { sessionStorage.setItem('ab_last_lp', local ? `/lokaal/dakwerker-${local.slug}` : '/lp/dakwerken'); } catch {}
    const style = document.createElement('style');
    style.textContent = SHELL_STYLE + LP_EXTRA;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    // ── Reviews carousel: GEEN custom JS — useAbBouwInteractions hook handelt
    // alles af, en LP_EXTRA CSS overrides SHELL_STYLE naar Home's exacte rules.

    // ── Stats count-up — anime van 0 naar target wanneer in viewport
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
      // Harde dubbele check: phone + email NIET leeg, anders nooit naar GHL.
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
      const TYPE_DAK_LABELS: Record<string, string> = {
        pannendak: 'Hellend dak (pannen)',
        natuurleien: 'Hellend dak (natuurleien)',
        plat_dak_epdm: 'Plat dak — EPDM',
        plat_dak_roofing: 'Plat dak — bitumen / roofing',
        dakvenster: 'Dakvenster (Velux)',
        zinkwerk: 'Zinkwerk / dakgoten',
        isolatie: 'Dakisolatie',
        lekkage: 'Lekkage / stormschade',
        anders: 'Anders / weet niet zeker',
      };
      const typeDakRaw = (fd.get('type_dak') as string) || '';
      const subService = TYPE_DAK_LABELS[typeDakRaw] || typeDakRaw;
      const userInfo = ((fd.get('aanvullende_info') as string) || '').trim();
      const combinedInfo = subService
        ? `Type dakwerk: ${subService}${userInfo ? `\n\n${userInfo}` : ''}`
        : (userInfo || undefined);

      const result = await submitLead({
        source: 'landing_page',
        landing_division: 'ab_dakwerken',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email: emailV,
        phone: phoneV,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: 'AB Dakwerken',
        aanvullende_info: combinedInfo,
        bron_lead: local ? `seo:dakwerker-${local.slug}` : 'ads:dakwerken',
      });
      if (result.ok) {
        wrap.classList.add('is-success');
        window.location.href = '/bedankt?service=dakwerken';
        return;
      } else {
        wrap.classList.add('is-error');
        if (errBox) errBox.textContent = `Er ging iets mis. Bel ons gerust op ${CONTACT.phone.spaced}.`;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag gratis dakinspectie aan'; }
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
      const emailV = ((fd.get('email') as string) || '').trim();
      const phoneV = ((fd.get('phone') as string) || '').trim();
      const emailValid = emailV && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailV);
      const phoneValid = phoneV && phoneV.replace(/\D/g, '').length >= 8;

      const showError = (msg: string, fieldName?: string) => {
        if (quickErr) { quickErr.hidden = false; quickErr.textContent = msg; }
        if (fieldName) quickForm.querySelector<HTMLInputElement>(`input[name="${fieldName}"]`)?.focus();
      };

      if (!firstName) { showError('Vul uw voornaam in.', 'firstName'); return; }
      if (!emailValid) { showError('Vul een geldig e-mailadres in.', 'email'); return; }
      if (!phoneValid) { showError('Vul uw telefoonnummer in (minstens 8 cijfers).', 'phone'); return; }

      if (quickErr) quickErr.hidden = true;
      if (quickBtn) quickBtn.disabled = true;
      if (quickBtnLabel) quickBtnLabel.textContent = 'Even bezig…';

      const result = await submitLead({
        source: 'landing_page',
        landing_division: 'ab_dakwerken',
        page_path: window.location.pathname,
        firstName,
        email: emailV,
        phone: phoneV,
        type_werk: 'AB Dakwerken',
        aanvullende_info: 'Hero-mini-form (3 velden, above-fold quick capture)',
        bron_lead: local ? `seo:dakwerker-${local.slug}:quick` : 'ads:dakwerken:quick',
      });

      if (result.ok) {
        quickWrap?.classList.add('is-success');
      } else {
        if (quickBtn) quickBtn.disabled = false;
        if (quickBtnLabel) quickBtnLabel.textContent = 'Plan mijn gratis dakinspectie';
        showError(`Er ging iets mis. Bel ons gerust op ${CONTACT.phone.spaced}.`);
      }
    };
    quickForm?.addEventListener('submit', onQuickSubmit);

    return () => {
      document.body.className = prev;
      style.remove();
      document.getElementById('lp-dak-schema')?.remove();
      form?.removeEventListener('submit', onSubmit);
      quickForm?.removeEventListener('submit', onQuickSubmit);
      countObserver.disconnect();
    };
  }, []);

  useAbBouwInteractions();

  const renderedHtml = local
    ? HTML
        .replace('AB Dakwerken · Willebroek', `AB Dakwerken · ${local.name}`)
        .replace(
          'in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
          `in ${local.name} en de regio.`
        )
        .replaceAll('?lp=%2Flp%2Fdakwerken', `?lp=%2Flokaal%2Fdakwerker-${local.slug}`)
    : HTML;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      {calcOpen && <CalculatorDak onClose={() => setCalcOpen(false)} />}
    </>
  );
}
