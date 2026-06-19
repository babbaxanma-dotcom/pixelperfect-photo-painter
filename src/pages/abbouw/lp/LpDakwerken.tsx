import { useEffect, useState } from 'react';
import { submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import type { Gemeente } from '@/data/gemeentes';
import { CONTACT } from '@/data/contact';
import CalculatorDak from '../calculator/CalculatorDak';
import logo from '@/assets/home/logo.png';
import velux from '@/assets/merken/Velux.png';

// Hero + section photos (reused asset set — Belgian residential roofing).
import heroClassic from '@/assets/dak/lp-hero-pannendak.jpg';
import imgVelux from '@/assets/dak/lp-velux-huis.jpg';
import imgVakman from '@/assets/home/vakmanschap-2.jpg';
import imgNatuurleien from '@/assets/dak/lp-dakvernieuwing.jpg';
import imgPlatDak from '@/assets/dak/lp-platdak-1.jpg';
import imgZinkGoot from '@/assets/dak/lp-zink-goot.jpg';
import imgComfort from '@/assets/dak/lp-isol-sarking.jpg';
import imgOnderhoud from '@/assets/dak/lp-dakonderhoud.jpg';
import imgStappen from '@/assets/dak/lp-stappen-dakwerker.jpg';
import { initRealisatieLightbox } from './_lightbox';
import { initLpReveal } from './_reveal';
import { initLpCallFab } from './_fab';
import imgRealPan1 from '@/assets/dak/lp-real-pan-1.jpg';
import imgRealPan2 from '@/assets/dak/lp-real-pan-2.jpg';
import imgRealPan3 from '@/assets/dak/lp-real-pan-3.jpg';
import imgRealEpdm1 from '@/assets/dak/lp-real-epdm-1.jpg';
import imgRealEpdm2 from '@/assets/dak/lp-real-epdm-2.jpg';
import imgRealEpdm3 from '@/assets/dak/lp-real-epdm-3.jpg';
import imgRealDet1 from '@/assets/dak/lp-real-det-1.jpg';
import imgRealDet2 from '@/assets/dak/lp-real-det-2.jpg';
import imgRealDet3 from '@/assets/dak/lp-real-det-3.jpg';

/* ─────────────────────────────────────────────────────────────────────────
   Texas-Roofing-Pros layout, faithfully replicated, NAVY theme, AB Bouw NL
   content. Self-contained: scoped CSS string injected via <style>, HTML built
   as template literal and rendered through dangerouslySetInnerHTML, exactly
   like the original Lp pattern. Forms wired in useEffect via data-* hooks.
   ───────────────────────────────────────────────────────────────────────── */

const NAVY = '#0a1628';
const NAVY2 = '#14233a';
const ORANGE = '#d98c03';
const ORANGE_H = '#b87502';
const GOLD = '#c69a4b';

const LP_CSS = `
.tr { font-family: var(--font-body); color: #1d2733; --tr-r-photo: 8px; --tr-r-ui: 8px; --tr-r-card: 12px; --wrap: 1180px; --bg-tint: #f3f1ea; --tr-line: #e7e3d8; }
.tr { --section-y: clamp(72px, 8.5vw, 128px); --section-y-lg: clamp(104px, 11vw, 168px); --section-y-compact: clamp(48px, 5.5vw, 84px); }
.tr * { box-sizing: border-box; }
.tr .tr-wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 clamp(24px, 5vw, 56px); }
.tr h1, .tr h2, .tr h3, .tr h4 { font-family: 'Plus Jakarta Sans', var(--font-display); letter-spacing: -0.02em; font-weight: 700; text-wrap: balance; font-feature-settings: 'ss01','kern','liga'; -webkit-font-smoothing: antialiased; }
.tr h1 { letter-spacing: -0.035em; }
.tr h2 { letter-spacing: -0.028em; line-height: 1.08; }
.tr a { text-decoration: none; }

/* CTA buttons (always orange) */
.tr-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  background: ${ORANGE}; color: #fff; border: none; cursor: pointer;
  font-family: var(--font-display); font-weight: 700; font-size: 15px;
  letter-spacing: 0.01em; padding: 15px 30px; border-radius: var(--tr-r-ui);
  transition: background .18s ease, box-shadow .18s ease;
  box-shadow: 0 1px 2px rgba(10,22,40,0.10);
}
.tr-btn:hover { background: ${ORANGE_H}; box-shadow: 0 4px 12px -4px rgba(217,140,3,0.45); }
.tr-btn:active { box-shadow: inset 0 1px 2px rgba(0,0,0,0.18); }
.tr-btn:disabled { opacity: .65; cursor: wait; }
.tr-cta-block { padding: clamp(44px, 6vw, 70px) 0; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 20px; }
.tr-cta-line { font-family: var(--font-display); font-weight: 600; font-size: clamp(20px, 2.5vw, 27px); color: #14233a; margin: 0; max-width: 540px; line-height: 1.3; }
.tr-cta-block .tr-btn { padding: 15px 34px; font-size: 15px; }
@media (max-width: 600px) { .tr-cta-block { padding: 40px 0; } .tr-cta-block .tr-btn { width: 100%; max-width: 360px; } }
/* Header-CTA = ghost (outline). Houdt oranje schaars: de submit-knop in de hero-kaart
   is de enige gevulde-oranje magneet boven de vouw. */
.tr-headcta { background: rgba(217,140,3,0.08); color: ${ORANGE_H}; border: 1.5px solid ${ORANGE}; box-shadow: none; border-radius: 999px; }
.tr-headcta:hover { background: ${ORANGE}; color: #fff; box-shadow: 0 4px 12px -4px rgba(217,140,3,0.45); }
.tr-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-display); font-weight: 600; font-size: 12px;
  letter-spacing: 0.08em; text-transform: uppercase; color: #41495a; margin-bottom: 14px; }
.tr-eyebrow::before { content: ''; width: 26px; height: 3px; border-radius: 2px; background: ${ORANGE}; display: inline-block; flex-shrink: 0; }
.tr-urgency { margin-top: 14px; font-size: 13px; color: #525b6b; font-weight: 600; }
.tr-section { padding: var(--section-y) 0; }
.tr-section[id] { scroll-margin-top: 88px; }
#lp-form { scroll-margin-top: 88px; }
.tr-section.tr-section--lg { padding: var(--section-y-lg) 0; }
.tr-section.tr-section--compact { padding: var(--section-y-compact) 0; }

/* 1 — TOP BAR */
.tr-topbar { background: ${NAVY}; color: rgba(255,255,255,0.85); font-size: 13px; }
.tr-topbar .tr-wrap { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 40px; }
.tr-topbar-left { display: inline-flex; align-items: center; gap: 0; flex-wrap: wrap; }
.tr-topbar-left span { padding: 4px 0; }
.tr-topbar-left span + span::before { content: "·"; margin: 0 12px; color: rgba(255,255,255,0.4); }
.tr-topbar-phone { display: inline-flex; align-items: center; gap: 8px; color: #fff; font-weight: 600; padding: 10px 0; white-space: nowrap; transition: color .18s; }
.tr-topbar-phone:hover { color: ${ORANGE}; }
.tr-topbar-phone svg { width: 15px; height: 15px; color: ${ORANGE}; }
@media (max-width: 760px) { .tr-topbar-left span:not(:first-child) { display: none; } }

/* 2 — HEADER */
.tr-header { background: #fff; border-bottom: 1px solid #ececec; position: sticky; top: 0; z-index: 60; }
.tr-header .tr-wrap { display: flex; align-items: center; gap: 24px; min-height: 74px; }
.tr-logo { height: 50px; width: auto; display: block; }
.tr-nav { display: flex; align-items: center; gap: 28px; margin: 0 auto; }
.tr-nav a { color: ${NAVY}; font-family: var(--font-display); font-weight: 600; font-size: 15px; transition: color .18s; }
.tr-nav a:hover { color: ${ORANGE}; }
.tr-header-right { display: flex; align-items: center; gap: 18px; margin-left: auto; }
.tr-rating { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.1; }
.tr-rating-score { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: ${NAVY}; }
.tr-rating-stars { color: ${GOLD}; font-size: 13px; letter-spacing: 1px; }
/* Hamburger + mobiel menu */
.tr-burger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 44px; height: 44px; padding: 10px; background: none; border: 0; cursor: pointer; }
.tr-burger span { display: block; width: 100%; height: 2.5px; background: ${NAVY}; border-radius: 2px; transition: transform .25s var(--ease-out-quart, ease), opacity .2s; }
.tr-mobmenu-overlay { display: none; }
.tr-mobmenu { display: none; }
@media (max-width: 980px) {
  .tr-nav { display: none; }
  .tr-rating { display: none; }
  .tr-headcta { display: none; }
  .tr-topbar-phone { display: none; }
  .tr-burger { display: flex; }
  .tr-logo { height: 52px; }
  .tr-header .tr-wrap { min-height: 66px; gap: 12px; }
  .tr-mobmenu-overlay { display: block; position: fixed; inset: 0; background: rgba(10,22,40,0.55); opacity: 0; pointer-events: none; transition: opacity .28s ease; z-index: 150; }
  body.tr-menu-open .tr-mobmenu-overlay { opacity: 1; pointer-events: auto; }
  .tr-mobmenu { display: flex; flex-direction: column; gap: 2px; position: fixed; top: 0; right: 0; bottom: 0; width: min(84vw, 360px); background: #fff; box-shadow: -24px 0 60px -24px rgba(0,0,0,0.45); transform: translateX(100%); transition: transform .3s var(--ease-out-quart, ease); z-index: 200; padding: 30px 26px 30px; overflow-y: auto; }
  body.tr-menu-open .tr-mobmenu { transform: translateX(0); }
  body.tr-menu-open { overflow: hidden; }
  .tr-mobmenu-close { align-self: flex-end; background: none; border: 0; font-size: 34px; line-height: 1; color: ${NAVY}; cursor: pointer; width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0; margin: -6px -12px 6px 0; }
  .tr-mobmenu a:not(.tr-btn) { font-family: var(--font-display); font-weight: 600; font-size: 19px; color: ${NAVY}; padding: 15px 4px; border-bottom: 1px solid #efece5; }
  .tr-mobmenu a:not(.tr-btn):active { color: ${ORANGE}; }
  .tr-mobmenu-cta { margin-top: 22px; justify-content: center; text-align: center; padding: 16px; font-size: 16px; }
  body.tr-menu-open .tr-burger span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
  body.tr-menu-open .tr-burger span:nth-child(2) { opacity: 0; }
  body.tr-menu-open .tr-burger span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
}

/* 3 — HERO */
.tr-hero { position: relative; background: ${NAVY}; color: #fff; overflow: hidden; }
.tr-hero-bg { position: absolute; inset: 0; }
.tr-hero-bg img { width: 100%; height: 100%; object-fit: cover; object-position: 30% 62%; }
.tr-hero-bg::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.78) 38%, rgba(10,22,40,0.38) 60%, rgba(10,22,40,0.08) 80%, rgba(10,22,40,0) 92%), linear-gradient(180deg, rgba(10,22,40,0) 60%, rgba(10,22,40,0.42) 100%); }
.tr-hero-inner { position: relative; z-index: 2; text-align: left; padding: clamp(52px,6.5vw,88px) 0 clamp(52px,6.5vw,88px); }
/* 3-zone hero: hoofdtekst + diensten links, formulier rechts; mobiel main -> form -> svc (CTA hoog) */
.tr-hero-grid { display: grid; grid-template-columns: 1fr; grid-template-areas: "main" "form" "svc"; row-gap: 24px; align-items: start; }
.tr-hero-main { grid-area: main; min-width: 0; }
.tr-hero-svc { grid-area: svc; min-width: 0; }
.tr-hero-form { grid-area: form; position: relative; z-index: 3; min-width: 0; }
@media (min-width: 1024px) {
  .tr-hero { display: flex; align-items: center; min-height: clamp(600px, 66vh, 740px); }
  .tr-hero-inner { width: 100%; }
  .tr-hero-grid { grid-template-columns: minmax(0,1fr) 416px; grid-template-rows: 1fr auto; grid-template-areas: "main form" "svc form"; column-gap: clamp(40px, 4.5vw, 64px); row-gap: 28px; }
}
.tr-hero h1 { font-size: clamp(34px, 4.6vw, 54px); line-height: 1.07; font-weight: 800; letter-spacing: -0.035em; color: #fff; margin: 0 0 18px; max-width: 17ch; text-wrap: balance; text-shadow: 0 1px 2px rgba(10,22,40,0.45); }
.tr-h1-accent { display: block; margin-top: 2px; color: ${GOLD}; }
.tr-hero-sub { font-size: clamp(16px, 1.3vw, 18px); line-height: 1.65; color: rgba(255,255,255,0.88); max-width: 52ch; margin: 0; }
.tr-hero-sub b { color: #fff; font-weight: 600; }
/* diensten-zone op de foto: één omrand systeem (de tegels) + stille cert-regel */
.tr-hero-svc-label { display: block; font-family: var(--font-display); font-size: 11.5px; font-weight: 600; letter-spacing: 0.11em; text-transform: uppercase; color: rgba(255,255,255,0.62); margin: 0 0 10px; }
.tr-hero-svc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(168px, 1fr)); gap: 10px; max-width: 640px; }
.tr-svc-tile { display: flex; align-items: center; gap: 10px; min-height: 46px; padding: 10px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: var(--tr-r-ui); font-family: var(--font-display); font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.92); line-height: 1.3; }
.tr-svc-tile svg { width: 15px; height: 15px; color: ${GOLD}; flex-shrink: 0; }
.tr-hero-svc-certs { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; margin-top: 24px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); text-shadow: 0 1px 2px rgba(10,22,40,0.45); }
.tr-hero-svc-certs svg { width: 14px; height: 14px; color: ${GOLD}; flex-shrink: 0; }

/* hero trust-row + sticky-header phone */
.tr-hero-trust { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin: 0 0 18px; font-size: 13.5px; font-weight: 600; color: rgba(255,255,255,0.8); }
.tr-hero-trust b { color: #fff; font-weight: 700; }
.tr-hero-trust-stars { color: ${GOLD}; letter-spacing: 1px; font-size: 14px; }
.tr-hero-trust-dot { color: rgba(255,255,255,0.35); }
.tr-headphone { display:inline-flex; align-items:center; gap:8px; color:${NAVY}; border:1.5px solid #e0ddd3; background:#fff; font-family:var(--font-display); font-weight:700; font-size:14px; padding:10px 16px; border-radius:999px; white-space:nowrap; transition:border-color .18s, color .18s; }
.tr-headphone svg { color:${ORANGE}; }
.tr-headphone:hover { border-color:${ORANGE}; color:${ORANGE}; }
@media (max-width:980px){ .tr-headphone{ background:transparent; color:${ORANGE}; border:1.5px solid ${ORANGE}; padding:0; width:44px; height:44px; justify-content:center; gap:0; } .tr-headphone svg{ color:${ORANGE}; } .tr-headphone-num{ display:none; } }

/* 4 — QUICK FORM (basis; de hero-kaart hergebruikt deze, scoped via .tr-hero-form) */
.tr-quickform-shell { background: #fff; }
.tr-quickform { background: #fff; max-width: 880px; margin: -88px auto 0; position: relative; z-index: 5;
  border: 1px solid #e7e4dd; border-radius: var(--tr-r-card); box-shadow: 0 26px 60px -28px rgba(10,22,40,0.4); padding: 34px 40px 36px; }
.tr-quickform h3 { text-align: center; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; color: ${NAVY}; margin: 0 0 26px; }
.tr-qf-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: stretch; }
.tr-qf-grid input { width: 100%; padding: 15px 16px; border: 1px solid #d3d7dd; border-radius: var(--tr-r-ui); font: inherit;
  font-size: 15px; color: #1d2733; background: #fff; transition: border-color .18s, box-shadow .18s; }
.tr-qf-grid input::placeholder { color: #8a8f98; }
.tr-qf-grid input:focus { outline: none; border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(217,140,3,0.16); background: #fff; }
.tr-qf-grid .tr-btn { white-space: nowrap; }
.tr-qf-error { margin-top: 12px; font-size: 13.5px; color: #b3261e; background: #fdecea;
  border: 1px solid rgba(179,38,30,0.2); border-radius: var(--tr-r-ui); padding: 9px 12px; }
.tr-qf-thanks { display: none; text-align: center; padding: 16px 0 6px; }
.tr-qf-thanks-ic { width: 54px; height: 54px; border-radius: 50%; background: #eef1f5; color: ${NAVY};
  display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.tr-qf-thanks h4 { font-size: 21px; color: ${NAVY}; margin: 0 0 6px; }
.tr-qf-thanks p { font-size: 14.5px; color: #454f60; margin: 0; }

/* hero-form-kaart: rand weg, schaduw + 4px oranje top, links uitgelijnd, zichtbare labels */
.tr-hero-form .tr-quickform { margin: 0; max-width: none; position: relative; border: none; border-radius: var(--tr-r-card); padding: 30px 28px 24px; box-shadow: 0 24px 56px -20px rgba(10,22,40,0.55), 0 2px 8px rgba(10,22,40,0.18); overflow: hidden; }
.tr-hero-form .tr-quickform::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: ${GOLD}; }
.tr-hero-form .tr-qf-grid { grid-template-columns: 1fr; gap: 14px; }
.tr-qf-field label { display: block; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: #41495a; margin: 0 0 6px; }
.tr-hero-form .tr-qf-grid input { height: 52px; padding: 0 16px; font-size: 16px; border: 1px solid #cfd5dd; }
.tr-hero-form .tr-qf-grid .tr-btn { height: auto; min-height: 52px; font-size: 16px; margin-top: 4px; white-space: normal; line-height: 1.25; padding: 13px 12px; }
.tr-quickform.is-success .tr-qf-grid, .tr-quickform.is-success .tr-eyebrow,
.tr-quickform.is-success h3, .tr-quickform.is-success .tr-qf-error, .tr-quickform.is-success .tr-qf-foot,
.tr-quickform.is-success .tr-qf-note, .tr-quickform.is-success .tr-qf-proof { display: none; }
.tr-quickform.is-success .tr-qf-thanks { display: block; }

/* lead-card: klembord-keuze-stack (3 rijen), AB-sober, scoped onder .tr-hero-form */
.tr-hero-form .tr-quickform.tr-leadcard { padding: 0; overflow: hidden; }
.tr-leadcard .tr-lc-ic { flex-shrink: 0; width: 44px; height: 44px; border-radius: var(--tr-r-ui); display: inline-flex; align-items: center; justify-content: center; }
.tr-leadcard .tr-lc-ic svg { display: block; }
.tr-leadcard .tr-lc-txt { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.tr-leadcard .tr-lc-title { margin: 0; font-family: var(--font-display); font-size: 16px; font-weight: 700; line-height: 1.22; letter-spacing: -0.015em; color: ${NAVY}; }
.tr-leadcard .tr-lc-sub { font-size: 13px; line-height: 1.45; color: #525b6b; }
/* RIJ 1 — primair (formulier): oranje icoon-tegel = climax-markering, lichte navy-tint */
.tr-lc-row--primary { background: #f7f9fc; border-bottom: 1px solid #e7e4dd; }
.tr-lc-head { display: flex; align-items: center; gap: 14px; width: 100%; margin: 0; padding: 20px 26px; background: none; border: none; text-align: left; font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.tr-lc-head .tr-lc-chev { flex-shrink: 0; margin-left: auto; color: #8a8f98; display: inline-flex; align-items: center; transition: transform .28s cubic-bezier(.22,1,.36,1), color .16s; }
.tr-lc-row--primary.is-open .tr-lc-head .tr-lc-chev { transform: rotate(90deg); color: ${NAVY}; }
@media (hover: hover) { .tr-lc-head:hover .tr-lc-chev { color: ${NAVY}; } }
.tr-lc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .32s cubic-bezier(.22,1,.36,1); }
.tr-lc-row--primary.is-open .tr-lc-panel { grid-template-rows: 1fr; }
.tr-lc-panel-inner { min-height: 0; overflow: hidden; }
.tr-lc-panel-pad { padding: 2px 26px 22px; }
.tr-lc-row--primary .tr-lc-ic--accent { background: rgba(217,140,3,0.12); color: ${ORANGE_H}; border: 1px solid rgba(217,140,3,0.28); }
.tr-lc-row--primary .tr-lc-head .tr-lc-txt { flex: 1 1 auto; }
.tr-lc-row--primary .tr-lc-title { font-size: 18px; line-height: 1.18; text-align: left; }
.tr-lc-row--primary .tr-lc-sub { text-align: left; }
.tr-lc-row--primary .tr-qf-grid { grid-template-columns: 1fr; gap: 12px; }
.tr-lc-row--primary .tr-qf-field label { display: block; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: #41495a; margin: 0 0 6px; }
.tr-lc-row--primary .tr-qf-grid input { height: 52px; padding: 0 16px; font-size: 16px; border: 1px solid #cfd5dd; background: #fff; }
.tr-lc-row--primary .tr-qf-grid input:focus { border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(217,140,3,0.16); }
.tr-lc-row--primary .tr-qf-grid .tr-btn { min-height: 52px; font-size: 16px; margin-top: 2px; white-space: normal; line-height: 1.25; padding: 13px 14px; width: 100%; }
.tr-lc-row--primary .tr-qf-error { margin: 12px 0 0; }
.tr-lc-reassure { margin: 10px 0 0; font-size: 13px; line-height: 1.45; color: #525b6b; }
/* Desktop (eigen 416px-kolom): formulier ALTIJD open — geen klik-friction, geen dode dak-ruimte.
   Inklappen blijft enkel mobiel/tablet waar het de hero compact houdt. */
@media (min-width: 1024px) {
  .tr-lc-row--primary .tr-lc-panel { grid-template-rows: 1fr; }
  .tr-lc-row--primary .tr-lc-head { cursor: default; pointer-events: none; }
  .tr-lc-row--primary .tr-lc-chev { display: none; }
}
.tr-lc-proof { margin-top: 16px; padding-top: 14px; border-top: 1px solid #ece9e1; }
.tr-lc-proof-stars { color: ${GOLD}; font-size: 12px; letter-spacing: 1.5px; margin-bottom: 6px; }
.tr-lc-proof-q { font-size: 13.5px; line-height: 1.55; color: #454f60; margin: 0; }
.tr-lc-proof-name { margin-top: 6px; font-family: var(--font-display); font-size: 13px; font-weight: 700; color: ${NAVY}; }
/* "Of"-scheiding tussen aanbod en alternatieve contactwegen */
.tr-lc-or { display: flex; align-items: center; gap: 14px; padding: 14px 26px 4px; }
.tr-lc-or::before, .tr-lc-or::after { content: ''; height: 1px; background: #ece9e1; flex: 1; }
.tr-lc-or span { font-family: var(--font-display); font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #8a8f98; }
/* RIJ 2 & 3 — secundair (klembord-rijen, navy/wit + goud-omrande tegel) */
.tr-lc-row--alt { display: flex; align-items: center; gap: 14px; width: 100%; margin: 0; padding: 14px 26px; min-height: 60px; text-align: left; text-decoration: none; font: inherit; color: inherit; background: #fff; border: none; border-top: 1px solid #f0eee7; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background-color .16s ease; }
.tr-lc-or + .tr-lc-row--alt { border-top: none; }
.tr-lc-row--alt .tr-lc-ic { background: #fff; color: ${NAVY}; border: 1px solid rgba(198,154,75,0.40); box-shadow: 0 1px 2px rgba(10,22,40,0.06); }
.tr-lc-row--alt .tr-lc-title { font-size: 15.5px; }
.tr-lc-chev { flex-shrink: 0; margin-left: auto; color: #8a8f98; display: inline-flex; align-items: center; transition: color .16s ease, transform .16s ease; }
@media (hover: hover) {
  .tr-lc-row--alt:hover { background: #f7f9fc; }
  .tr-lc-row--alt:hover .tr-lc-chev { color: ${NAVY}; transform: translateX(2px); }
}
.tr-lc-row--alt:active { background: #f1f3f7; }
.tr-lc-row--alt:focus-visible { outline: none; box-shadow: inset 0 0 0 2px ${GOLD}; }
/* calc-rij: titel + 60-sec-badge + clean opening-staat */
.tr-lc-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tr-lc-badge { display: inline-flex; align-items: center; font-family: var(--font-display); font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; line-height: 1; padding: 3px 7px; border-radius: 999px; color: ${GOLD}; background: rgba(198,154,75,0.10); border: 1px solid rgba(198,154,75,0.45); white-space: nowrap; }
.tr-lc-row--calc { transition: background-color .16s ease, transform .12s ease; }
.tr-lc-row--calc:active { transform: scale(0.985); }
.tr-lc-row--calc.is-opening { background: #f7f9fc; }
.tr-lc-row--calc.is-opening .tr-lc-title { color: ${ORANGE_H}; }
.tr-lc-row--calc.is-opening .tr-lc-chev { color: ${NAVY}; transform: translateX(3px); }
@media (max-width: 360px) { .tr-lc-badge { margin-top: 1px; } }
/* succes-state: verberg rijen + scheiding; toon enkel thanks */
.tr-quickform.is-success .tr-lc-row--primary,
.tr-quickform.is-success .tr-lc-or,
.tr-quickform.is-success .tr-lc-row--alt { display: none; }
.tr-quickform.tr-leadcard.is-success .tr-qf-thanks { display: block; padding: 26px 26px 24px; }

@media (max-width: 720px) {
  .tr-hero { display: block; min-height: 0; }
  .tr-hero-inner { padding: 32px 0 64px; text-align: left; }
  .tr-hero-trust { justify-content: flex-start; font-size: 13px; gap: 6px 10px; }
  .tr-hero h1 { font-size: 34px; }
  .tr-hero-sub { margin: 0; }
  .tr-hero-svc-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
  .tr-svc-tile { min-height: 42px; font-size: 13px; padding: 9px 12px; }
  .tr-lc-head { padding: 18px 20px; }
  .tr-lc-panel-pad { padding: 2px 20px 20px; }
  .tr-lc-or { padding: 12px 20px 4px; }
  .tr-lc-row--alt { padding: 13px 20px; min-height: 58px; }
  .tr-hero-form .tr-quickform.tr-leadcard.is-success .tr-qf-thanks { padding: 24px 20px 22px; }
}
@media (max-width: 360px) {
  .tr-lc-head { padding: 16px 16px; }
  .tr-lc-panel-pad { padding: 2px 16px 18px; }
  .tr-lc-or { padding: 12px 16px 4px; }
  .tr-lc-row--alt { padding: 12px 16px; gap: 12px; }
}
@media (max-width: 1023px) {
  .tr-hero-bg::after { background: linear-gradient(180deg, rgba(10,22,40,0.84) 0%, rgba(10,22,40,0.7) 42%, rgba(10,22,40,0.88) 100%); }
}
@media (min-width: 721px) and (max-width: 1023px) {
  .tr-hero-form .tr-quickform { max-width: 480px; }
}

/* 5 — THREE STEPS + foto (foto naast stappen op desktop, boven op mobiel) */
.tr-steps-box { padding: clamp(8px, 2vw, 28px) 0 0; max-width: 1040px; margin: 0 auto; }
.tr-steps-box h2 { text-align: left; max-width: 22ch; font-size: clamp(26px, 3vw, 36px); color: ${NAVY}; font-weight: 700; margin: 0 0 clamp(32px, 3.5vw, 48px); }
.tr-steps-layout { display: grid; grid-template-columns: 1fr; gap: clamp(28px, 4vw, 44px); align-items: center; }
.tr-steps-photo { border-radius: var(--tr-r-card); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(10,22,40,0.35); }
.tr-steps-photo img { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; }
.tr-steps-list { display: grid; gap: clamp(22px, 2.6vw, 30px); }
.tr-step { text-align: left; }
.tr-step-num { font-family: var(--font-display); font-size: 40px; font-weight: 700; line-height: 1; color: ${NAVY}; margin: 0 auto 14px; letter-spacing: -0.03em; position: relative; display: inline-block; padding-bottom: 12px; }
.tr-step-num::after { content: ""; position: absolute; left: 0; bottom: 0; transform: none; width: 24px; height: 3px; background: ${ORANGE}; border-radius: 2px; }
.tr-step h3 { font-size: 20px; color: ${NAVY}; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 10px; }
.tr-step p { font-size: 15px; line-height: 1.62; color: #454f60; margin: 0; }
@media (min-width: 860px) { .tr-steps-layout { grid-template-columns: minmax(0, 432px) 1fr; gap: clamp(44px, 5vw, 72px); } }
@media (max-width: 859px) { .tr-steps-box { padding: 34px 22px 38px; } }

/* 6 — ABOUT / CERTIFIED */
.tr-about-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.tr-about-media { position: relative; }
.tr-about-badges { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.tr-about-badge { display: inline-flex; align-items: center; justify-content: center; height: 52px; padding: 0 16px;
  background: #fff; border: 1px solid #e7e4dd; border-radius: var(--tr-r-ui); box-shadow: 0 8px 20px -14px rgba(10,22,40,0.3); }
.tr-about-badge img { height: 28px; width: auto; object-fit: contain; }
.tr-about-badge.tr-vca { font-family: var(--font-display); font-weight: 700; font-size: 18px; color: ${NAVY}; letter-spacing: -0.01em; }
.tr-about-photo { border-radius: var(--tr-r-photo); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(10,22,40,0.35); }
.tr-about-photo img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
.tr-about-body h2 { font-size: clamp(27px, 4.2vw, 48px); color: ${NAVY}; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 16px; }
.tr-about-intro { font-size: clamp(16px, 1.2vw, 18px); line-height: 1.65; color: #3a4453; max-width: 60ch; margin: 0 0 22px; }
.tr-checks { list-style: none; padding: 0; margin: 0 0 28px; }
.tr-checks li { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; font-size: 15px; color: #2b3543; line-height: 1.5; }
.tr-checks li svg { color: ${NAVY}; flex-shrink: 0; margin-top: 2px; }
.tr-checks li b { font-weight: 600; color: ${NAVY}; }
@media (max-width: 900px) { .tr-about-grid { grid-template-columns: 1fr; gap: 36px; } }

/* 7 — NUMBERS BAR */
.tr-numbers { display: grid; grid-template-columns: repeat(4, 1fr); background: ${NAVY}; border-top: 3px solid ${GOLD}; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
.tr-num { padding: clamp(48px, 5vw, 76px) 28px; text-align: center; color: #fff; background: ${NAVY}; position: relative; }
.tr-num + .tr-num::before { content: ""; position: absolute; left: 0; top: 22%; bottom: 22%; width: 1px; background: rgba(198,154,75,0.28); }
.tr-num-big { font-family: var(--font-display); font-weight: 600; font-size: clamp(30px, 3.4vw, 44px); line-height: 1; color: ${GOLD}; }
.tr-num-lbl { margin-top: 12px; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; color: rgba(255,255,255,0.88); }
@media (max-width: 720px) { .tr-numbers { grid-template-columns: 1fr 1fr; } .tr-num + .tr-num::before { display: none; } .tr-num { padding: 34px 20px; } }

/* 8 — SERVICES (dark) */
.tr-services { background: ${NAVY}; color: #fff; border-top: 1px solid rgba(255,255,255,0.07); }
.tr-services .tr-head { text-align: left; max-width: 680px; margin: 0 0 clamp(36px, 4vw, 56px); }
.tr-services .tr-head h2 { font-size: clamp(27px, 4.4vw, 52px); color: #fff; font-weight: 700; letter-spacing: -0.02em; line-height: 1.06; margin: 0; }
.tr-services .tr-head p { font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8); max-width: 560px; margin: 12px 0 0; }
.tr-services .tr-eyebrow { color: rgba(255,255,255,0.7); }
.tr-svc-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 24px; }
.tr-svc-grid > .tr-svc-card:nth-child(-n+2) { grid-column: span 3; }
.tr-svc-grid > .tr-svc-card:nth-child(n+3) { grid-column: span 2; }
.tr-svc-card { background: #15263f; border: 1px solid rgba(255,255,255,0.18); border-radius: var(--tr-r-card); overflow: hidden;
  display: flex; flex-direction: column; transition: border-color .25s ease; }
.tr-svc-card:hover { border-color: rgba(255,255,255,0.32); }
.tr-svc-img { aspect-ratio: 16/10; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.08); }
.tr-svc-img img { width: 100%; height: 100%; object-fit: cover; }
.tr-svc-body { padding: 24px 24px 28px; flex: 1 1 auto; display: flex; flex-direction: column; }
.tr-svc-body h3 { font-size: 19px; color: #fff; font-weight: 600; margin: 0 0 8px; }
.tr-svc-body p { font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.84); margin: 0; }
.tr-services .tr-urgency { color: rgba(255,255,255,0.66); }
@media (max-width: 1040px) { .tr-svc-grid { grid-template-columns: 1fr 1fr; } .tr-svc-grid > .tr-svc-card { grid-column: auto; } }
@media (max-width: 560px) { .tr-svc-grid { grid-template-columns: 1fr; } .tr-svc-grid > .tr-svc-card { grid-column: auto; } }

/* 9 — WE ALSO OFFER / MAINTENANCE */
.tr-also-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.tr-also-body h2 { font-size: clamp(27px, 3.2vw, 38px); color: ${NAVY}; font-weight: 700; margin: 0 0 16px; }
.tr-also-body > p { font-size: 16px; line-height: 1.7; color: #3a4453; margin: 0 0 22px; }
.tr-also-photo { border-radius: var(--tr-r-photo); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(10,22,40,0.35); }
.tr-also-photo img { width: 100%; aspect-ratio: 5/4; object-fit: cover; display: block; }
@media (max-width: 900px) { .tr-also-grid { grid-template-columns: 1fr; gap: 36px; } }


/* 11 — REVIEWS */
.tr-reviews { background: var(--bg-tint); }
.tr-reviews .tr-head { text-align: left; max-width: 680px; margin: 0 0 clamp(44px, 5vw, 72px); }
.tr-reviews .tr-head h2 { font-size: clamp(27px, 3.2vw, 40px); color: ${NAVY}; font-weight: 700; margin: 0; }
.tr-rev-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(24px, 2.4vw, 34px); align-items: stretch; }
.tr-rev-card { background: #fff; border: 1px solid #e7e4dd; border-radius: var(--tr-r-card); padding: 30px 28px 28px;
  display: flex; flex-direction: column; }
.tr-rev-card::before { content: "“"; display: block; font-family: var(--font-display); font-size: 46px; line-height: .6; color: #e2dccb; margin-bottom: 4px; }
.tr-rev-stars { color: ${GOLD}; font-size: 15px; letter-spacing: 2px; margin-bottom: 14px; }
.tr-rev-card p { font-size: 14.5px; line-height: 1.65; color: #3a4252; margin: 0 0 20px; flex: 1; }
.tr-rev-foot { border-top: 1px solid #eeede4; padding-top: 16px; }
.tr-rev-name { font-family: var(--font-display); font-weight: 600; color: ${NAVY}; font-size: 14.5px; }
.tr-rev-role { font-size: 12.5px; color: #525b6b; font-weight: 600; margin-top: 2px; }
@media (max-width: 980px) { .tr-rev-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 620px) { .tr-rev-grid { grid-template-columns: 1fr; } }

/* 12 — FAQ (orange-bordered box) */
.tr-faq-box { padding: 12px 0 0; max-width: 760px; margin: 0 auto; }
.tr-faq-box h2 { text-align: left; font-size: clamp(26px, 3vw, 36px); color: ${NAVY}; font-weight: 700; margin: 0 0 30px; }
.tr-faq-item { border-bottom: 1px solid #ece9e1; }
.tr-faq-item summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 14px;
  padding: 18px 4px; font-family: var(--font-display); font-weight: 600; font-size: 16px; color: ${NAVY}; }
.tr-faq-item summary::-webkit-details-marker { display: none; }
.tr-faq-item summary::before { content: "+"; flex-shrink: 0; width: 22px; height: 22px; display: inline-flex;
  align-items: center; justify-content: center; color: ${NAVY}; font-size: 20px; font-weight: 700; line-height: 1; }
.tr-faq-item[open] summary::before { content: "–"; }
.tr-faq-item p { margin: 0 0 18px 36px; font-size: 14.5px; line-height: 1.65; color: #454f60; }
@media (max-width: 720px) { .tr-faq-box { padding: 30px 20px 26px; } }

/* 13 — FINAL CTA (dark) */
.tr-final { background: ${NAVY}; color: #fff; border-top: 1px solid rgba(255,255,255,0.07); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
.tr-final h2 { text-align: left; max-width: 18ch; font-size: clamp(27px, 3.2vw, 40px); color: #fff; font-weight: 700; margin: 0 0 48px; }
.tr-final-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 56px; align-items: start; }
.tr-final-contact h3 { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.72); font-weight: 600; margin: 0 0 10px; }
.tr-final-contact .tr-big { font-family: var(--font-display); font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 24px; }
.tr-final-contact .tr-line { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: rgba(255,255,255,0.84); margin-bottom: 14px; line-height: 1.5; }
.tr-final-contact .tr-line svg { color: rgba(255,255,255,0.7); flex-shrink: 0; margin-top: 2px; }
.tr-final-contact a { color: rgba(255,255,255,0.84); }
.tr-final-contact a:hover { color: #fff; }
.tr-final-card { background: #fff; color: #1d2733; border-radius: var(--tr-r-card); padding: 34px 32px 32px; }
.tr-final-card h3 { font-size: 23px; color: ${NAVY}; font-weight: 700; margin: 0 0 4px; }
.tr-final-card .tr-safe { font-size: 13.5px; color: #525b6b; margin: 0 0 20px; display: flex; align-items: center; gap: 7px; }
.tr-final-card .tr-safe svg { color: #525b6b; }
.tr-final-card form { display: flex; flex-direction: column; gap: 11px; }
.tr-final-row { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
.tr-final-card input, .tr-final-card textarea, .tr-final-card select { width: 100%; padding: 14px 15px; border: 1px solid #d9d6cd;
  border-radius: var(--tr-r-ui); font: inherit; font-size: 15px; color: #1d2733; background: #fbfaf7; }
.tr-final-card select { appearance: none; -webkit-appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23525b6b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }
.tr-final-card select:invalid { color: #8a8f98; }
.tr-final-card input:focus, .tr-final-card textarea:focus, .tr-final-card select:focus { outline: none; border-color: ${ORANGE};
  box-shadow: 0 0 0 3px rgba(217,140,3,0.16); background-color: #fff; }
.tr-final-card textarea { min-height: 92px; resize: vertical; }
.tr-final-card .tr-btn { margin-top: 4px; width: 100%; }
.tr-final-err { display: none; margin-top: 10px; font-size: 13.5px; color: #b3261e; background: #fdecea;
  border: 1px solid rgba(179,38,30,0.2); border-radius: var(--tr-r-ui); padding: 9px 12px; }
.tr-final-card.is-error .tr-final-err { display: block; }
.tr-final-thanks { display: none; text-align: center; padding: 18px 0; }
.tr-final-thanks h4 { font-size: 22px; color: ${NAVY}; margin: 0 0 6px; }
.tr-final-thanks p { font-size: 14.5px; color: #454f60; margin: 0; }
.tr-final-card.is-success form { display: none; }
.tr-final-card.is-success .tr-final-thanks { display: block; }
.tr-final-testi { grid-column: 1 / -1; margin-top: 40px; text-align: center; max-width: 760px;
  margin-left: auto; margin-right: auto; }
.tr-final-testi-q { font-size: 15.5px; line-height: 1.65; color: rgba(255,255,255,0.86); font-style: italic; }
.tr-final-testi-name { margin-top: 12px; font-family: var(--font-display); font-weight: 700; color: #fff; font-size: 14.5px; }
@media (max-width: 900px) { .tr-final-grid { grid-template-columns: 1fr; gap: 34px; } .tr-final-row { grid-template-columns: 1fr; } }

/* 14 — FOOTER */
.tr-footer { background: ${NAVY}; color: rgba(255,255,255,0.7); padding: 48px 0 36px; border-top: 1px solid rgba(255,255,255,0.08); }
.tr-footer-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 22px; margin-bottom: 26px; }
.tr-footer-wordmark { font-family: var(--font-display); font-weight: 700; font-size: 19px; color: #fff; letter-spacing: -0.01em; }
.tr-footer-links { display: flex; flex-wrap: wrap; gap: 22px; }
.tr-footer-links a { color: rgba(255,255,255,0.72); font-size: 14px; }
.tr-footer-links a:hover { color: #fff; }
.tr-footer-info { font-size: 14px; color: rgba(255,255,255,0.70); line-height: 1.6; }
.tr-footer-copy { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 12.5px; color: rgba(255,255,255,0.62); }

/* === REALISATIES-GALERIJ + REVIEWS + FOOTER — desktop-robuustheid (additief) === */
.rl-thumb { cursor: pointer; position: relative; transition: transform .3s var(--ease-out-quart, ease), box-shadow .3s var(--ease-out-quart, ease); }
.rl-thumb img { transition: transform .5s var(--ease-out-quart, ease); }
.rl-thumb::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,22,40,0) 55%, rgba(10,22,40,0.42) 100%); opacity: .85; transition: opacity .3s ease; pointer-events: none; }
.rl-zoom { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; color: #fff; background: rgba(10,22,40,0.55); border: 1px solid rgba(255,255,255,0.28); border-radius: var(--tr-r-ui); opacity: 0; transform: translateY(-4px); transition: opacity .25s ease, transform .25s ease; pointer-events: none; }
@media (hover: hover) and (min-width: 1024px) {
  .rl-thumb:hover { transform: translateY(-4px); box-shadow: 0 38px 70px -28px rgba(10,22,40,0.5); }
  .rl-thumb:hover img { transform: scale(1.05); }
  .rl-thumb:hover::after { opacity: 1; }
  .rl-thumb:hover .rl-zoom { opacity: 1; transform: translateY(0); }
  .tr-rev-card { transition: transform .25s var(--ease-out-quart, ease), box-shadow .25s var(--ease-out-quart, ease), border-color .25s ease; }
  .tr-rev-card:hover { transform: translateY(-3px); box-shadow: 0 26px 50px -30px rgba(10,22,40,0.32); border-color: #ded9cd; }
}
@media (min-width: 1024px) {
  #realisaties > .tr-wrap > div[style*="grid-template-columns"] { gap: 28px !important; }
  .tr-rev-grid { gap: clamp(24px, 2.4vw, 34px); }
  .tr-footer { padding: 72px 0 44px; }
  .tr-footer-top { align-items: flex-start; margin-bottom: 34px; padding-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .tr-footer-links { gap: 32px; }
  .tr-footer-info { font-size: 14.5px; }
}
`;

/* ── Inline SVG icon set (no external deps) ─────────────────────────────── */
const icPhone = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const icCheck = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const icCheck15 = icCheck.replace('width="20" height="20"','width="15" height="15"');
const icShield = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
const icPin = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const icCheckBig = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const icDoc = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>`;
const icCalc = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="8" y2="11"/><line x1="12" y1="11" x2="12" y2="11"/><line x1="16" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/><line x1="16" y1="15" x2="16" y2="19"/></svg>`;
const icChevron = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const icPhoneRow = icPhone.replace('width="15" height="15"','width="18" height="18"');
const stars = '★★★★★';

const PHONE = CONTACT.phone.spaced;
const PHONE_HREF = CONTACT.phone.href;

/* ── Page HTML (template literal) ───────────────────────────────────────── */
const RL_PAN = JSON.stringify([imgRealPan1, imgRealPan2, imgRealPan3]).replace(/"/g, '&quot;');
const RL_EPDM = JSON.stringify([imgRealEpdm1, imgRealEpdm2, imgRealEpdm3]).replace(/"/g, '&quot;');
const RL_DET = JSON.stringify([imgRealDet1, imgRealDet2, imgRealDet3]).replace(/"/g, '&quot;');

const HTML = `
<div class="tr">

  <!-- 1. TOP BAR -->
  <div class="tr-topbar">
    <div class="tr-wrap">
      <div class="tr-topbar-left">
        <span>Vlaams dakwerk sinds 2010</span>
        <span>10 jaar garantie</span>
      </div>
      <a class="tr-topbar-phone" href="${PHONE_HREF}">${icPhone}${PHONE}</a>
    </div>
  </div>

  <!-- 2. HEADER -->
  <header class="tr-header">
    <div class="tr-wrap">
      <a href="#" aria-label="AB Bouw Groep"><img class="tr-logo" src="${logo}" alt="AB Bouw Groep" /></a>
      <nav class="tr-nav">
        <a href="#diensten">Diensten</a>
        <a href="#werkwijze">Werkwijze</a>
        <a href="#reviews">Reviews</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="tr-header-right">
        <div class="tr-rating">
          <span class="tr-rating-score">4,9/5</span>
          <span class="tr-rating-stars">${stars}</span>
        </div>
        <a class="tr-btn tr-headcta" href="#lp-form" style="padding:12px 22px;font-size:14px;">Gratis dakinspectie</a>
        <a class="tr-headphone" href="${PHONE_HREF}" aria-label="Bel ons">${icPhone}<span class="tr-headphone-num">${PHONE}</span></a>
        <button type="button" class="tr-burger" data-menu-toggle aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="tr-mobmenu-overlay" data-menu-close></div>
    <nav class="tr-mobmenu" aria-label="Mobiel menu">
      <button type="button" class="tr-mobmenu-close" data-menu-close aria-label="Sluiten">×</button>
      <a href="#diensten">Diensten</a>
      <a href="#werkwijze">Werkwijze</a>
      <a href="#reviews">Reviews</a>
      <a href="#faq">Veelgestelde vragen</a>
      <a href="#contact">Contact</a>
      <a class="tr-btn tr-mobmenu-cta" href="#lp-form">Plan gratis dakinspectie</a>
    </nav>
  </header>

  <!-- 3. HERO (split: inhoud + social proof links, formulier rechts) -->
  <section class="tr-hero">
    <div class="tr-hero-bg"><img src="${heroClassic}" alt="Dakwerken Vlaanderen" /></div>
    <div class="tr-hero-inner">
      <div class="tr-wrap">
        <div class="tr-hero-grid">
          <div class="tr-hero-main">
            <div class="tr-hero-trust">
              <span class="tr-hero-trust-stars">${stars}</span>
              <span><b>4,9/5</b> op Google (180+ reviews)</span><span class="tr-hero-trust-dot">·</span>
              <span>120+ daken vernieuwd</span><span class="tr-hero-trust-dot">·</span>
              <span>Sinds 2010</span>
            </div>
            <h1>Dakproblemen of renovatieplannen? <span class="tr-h1-accent">Wij regelen het.</span></h1>
            <p class="tr-hero-sub">Eén vast aanspreekpunt voor uw dak, overal in Vlaanderen.</p>
          </div>
          <div class="tr-hero-svc">
            <span class="tr-hero-svc-label">Onze dakdiensten</span>
            <div class="tr-hero-svc-grid">
              <span class="tr-svc-tile">${icCheck15}Dakrenovatie</span>
              <span class="tr-svc-tile">${icCheck15}Nieuw dak</span>
              <span class="tr-svc-tile">${icCheck15}Dakisolatie</span>
              <span class="tr-svc-tile">${icCheck15}Herstellingen</span>
              <span class="tr-svc-tile">${icCheck15}Plat dak (EPDM)</span>
              <span class="tr-svc-tile">${icCheck15}Velux dakramen</span>
            </div>
            <div class="tr-hero-svc-certs">${icShield}<span>VCA* gecertificeerd</span><span class="tr-hero-trust-dot">·</span><span>Lid Bouwunie</span><span class="tr-hero-trust-dot">·</span><span>Verzekerd via Federale</span></div>
          </div>
          <aside class="tr-hero-form" aria-label="Plan uw gratis dakinspectie">
            <div class="tr-quickform tr-leadcard" id="lp-form" data-lp-quick>

              <!-- RIJ 1 — PRIMAIR: gratis dakinspectie. Dichtgeklapt; vouwt open bij klik. -->
              <div class="tr-lc-row tr-lc-row--primary">
                <button type="button" class="tr-lc-head" data-lc-toggle aria-expanded="false">
                  <span class="tr-lc-ic tr-lc-ic--accent" aria-hidden="true">${icDoc}</span>
                  <span class="tr-lc-txt">
                    <h3 class="tr-lc-title">Gratis dakinspectie met fotorapport</h3>
                    <span class="tr-lc-sub">Vrijblijvend, met fotorapport dat u mag houden.</span>
                  </span>
                  <span class="tr-lc-chev" aria-hidden="true">${icChevron}</span>
                </button>
                <div class="tr-lc-panel">
                  <div class="tr-lc-panel-inner">
                    <div class="tr-lc-panel-pad">
                      <form data-lp-quick-form novalidate>
                        <div class="tr-qf-grid">
                          <div class="tr-qf-field"><label for="qf-name">Voornaam</label><input id="qf-name" type="text" name="firstName" placeholder="bv. Jan" autocomplete="given-name" required /></div>
                          <div class="tr-qf-field"><label for="qf-phone">Telefoonnummer</label><input id="qf-phone" type="tel" name="phone" placeholder="bv. 0470 12 34 56" autocomplete="tel" required /></div>
                          <button type="submit" class="tr-btn" data-lp-quick-submit>
                            <span data-lp-quick-submit-label>Plan mijn inspectie</span>
                          </button>
                        </div>
                      </form>
                      <p class="tr-lc-reassure">We bellen u terug binnen één werkdag.</p>
                      <div class="tr-qf-error" data-lp-quick-error role="alert" hidden></div>
                      <div class="tr-lc-proof">
                        <div class="tr-lc-proof-stars">★★★★★</div>
                        <p class="tr-lc-proof-q">“De prijs op de offerte was ook de prijs op de factuur. Geen meerwerk achteraf, geen discussie. Zeldzaam in deze sector.”</p>
                        <div class="tr-lc-proof-name">Stijn D., Mechelen</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SCHEIDING -->
              <div class="tr-lc-or"><span>Of</span></div>

              <!-- RIJ 2 — SECUNDAIR: calculator (opent CalculatorDak-modal via data-calc-trigger) -->
              <button type="button" class="tr-lc-row tr-lc-row--alt tr-lc-row--calc" data-calc-trigger>
                <span class="tr-lc-ic" aria-hidden="true">${icCalc}</span>
                <span class="tr-lc-txt">
                  <span class="tr-lc-title-row">
                    <span class="tr-lc-title">Bereken mijn offerte</span>
                    <span class="tr-lc-badge">60 sec</span>
                  </span>
                  <span class="tr-lc-sub">Prijsindicatie via onze calculator, klaar in 60 seconden</span>
                </span>
                <span class="tr-lc-chev" aria-hidden="true">${icChevron}</span>
              </button>

              <!-- RIJ 3 — SECUNDAIR: bellen (tel-link) -->
              <a class="tr-lc-row tr-lc-row--alt" href="${PHONE_HREF}">
                <span class="tr-lc-ic" aria-hidden="true">${icPhoneRow}</span>
                <span class="tr-lc-txt">
                  <span class="tr-lc-title">Bel ons direct</span>
                  <span class="tr-lc-sub">Daklek of haast? ${PHONE}</span>
                </span>
                <span class="tr-lc-chev" aria-hidden="true">${icChevron}</span>
              </a>

              <!-- SUCCES-STATE -->
              <div class="tr-qf-thanks" role="status" aria-live="polite">
                <div class="tr-qf-thanks-ic">${icCheck.replace('width="20" height="20"','width="26" height="26"')}</div>
                <h4>Bedankt, uw aanvraag is ontvangen.</h4>
                <p>We bellen u binnen één werkdag om uw gratis dakinspectie in te plannen.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. WERKWIJZE / 3 STAPPEN -->
  <section class="tr-section" id="werkwijze">
    <div class="tr-wrap">
      <div class="tr-steps-box">
        <h2>In 3 stappen naar uw nieuwe dak</h2>
        <div class="tr-steps-layout">
          <div class="tr-steps-photo">
            <img src="${imgStappen}" alt="Dakdekker legt nieuwe dakpannen tijdens een dakrenovatie" loading="lazy" width="860" height="860" />
          </div>
          <div class="tr-steps-list">
            <div class="tr-step">
              <div class="tr-step-num">01</div>
              <h3>Plan uw gratis dakinspectie</h3>
              <p>Kies een moment dat past. Wij bekijken uw dak ter plaatse en u ontvangt een fotorapport van wat we vinden.</p>
            </div>
            <div class="tr-step">
              <div class="tr-step-num">02</div>
              <h3>Ontvang uw vaste prijs-offerte</h3>
              <p>U krijgt heldere opties, materiaalkeuze en een bindende prijs. In de offerte ziet u per post wat er gebeurt en waarom.</p>
            </div>
            <div class="tr-step">
              <div class="tr-step-num">03</div>
              <h3>Zorgeloze plaatsing van begin tot eind</h3>
              <p>Wij voeren alles uit, van het strippen tot de afwerking. Strak, proper, op een afgesproken startdatum.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. NUMBERS BAR -->
  <section class="tr-numbers">
    <div class="tr-num"><div class="tr-num-big">${new Date().getFullYear() - 2010} jaar</div><div class="tr-num-lbl">ervaring</div></div>
    <div class="tr-num"><div class="tr-num-big">120+</div><div class="tr-num-lbl">daken gerenoveerd</div></div>
    <div class="tr-num"><div class="tr-num-big">1</div><div class="tr-num-lbl">vast aanspreekpunt</div></div>
    <div class="tr-num"><div class="tr-num-big">10 jaar</div><div class="tr-num-lbl">garantie</div></div>
  </section>

  <!-- REVIEWS — naar boven verplaatst (CRO: sociale proof vlak na de cijfers) -->
  <section class="tr-section tr-reviews" id="reviews">
    <div class="tr-wrap">
      <div class="tr-head">
        <span class="tr-eyebrow">Reviews</span>
        <h2>Klantbeoordelingen</h2>
      </div>
      <div class="tr-rev-grid">
        <div class="tr-rev-card"><div class="tr-rev-stars">${stars}</div><p>Natte plek op het plafond, en het bleef maar regenen. Ik belde in paniek, kreeg meteen iemand aan de lijn die rustig uitlegde wat er moest gebeuren. Lek gevonden en hersteld nog dezelfde week.</p><div class="tr-rev-foot"><div class="tr-rev-name">Carine Verstraeten</div><div class="tr-rev-role">Daklek hersteld, Lier</div></div></div>
        <div class="tr-rev-card"><div class="tr-rev-stars">${stars}</div><p>Met EPC-label F kwam er amper volk kijken. Sarking langs buiten geplaatst, label naar C, en de verkoop kwam los.</p><div class="tr-rev-foot"><div class="tr-rev-name">Yusuf Demir</div><div class="tr-rev-role">Sarking dakisolatie, Antwerpen</div></div></div>
        <div class="tr-rev-card"><div class="tr-rev-stars">${stars}</div><p>Na de storm lag de helft van onze pannen in de tuin. Dezelfde avond een zeil, twee weken later een nieuw dak. Verzekering door hen geregeld.</p><div class="tr-rev-foot"><div class="tr-rev-name">Davy Janssens</div><div class="tr-rev-role">Stormschade, Sint-Niklaas</div></div></div>
      </div>
    </div>
  </section>

  <div class="tr-wrap tr-cta-block">
    <p class="tr-cta-line">Sluit u aan bij honderden tevreden klanten in uw regio.</p>
    <a class="tr-btn" href="#contact">Vraag uw gratis offerte</a>
  </div>

  <!-- 8. SERVICES -->
  <section class="tr-section tr-services" id="diensten">
    <div class="tr-wrap">
      <div class="tr-head">
        <span class="tr-eyebrow">Onze diensten</span>
        <h2>Alles wat uw dak nodig heeft</h2>
        <p>Van volledige dakvernieuwing tot zinkwerk en dakramen: u regelt het met één offerte.</p>
      </div>
      <div class="tr-svc-grid">
        <div class="tr-svc-card">
          <div class="tr-svc-img rl-thumb" data-rl-trigger data-rl-photos="[&quot;${imgNatuurleien}&quot;]" data-rl-title="Dakvernieuwing"><img src="${imgNatuurleien}" alt="Dakvernieuwing" /><span class="rl-zoom">⤢</span></div>
          <div class="tr-svc-body"><h3>Dakvernieuwing</h3><p>Volledige dakvervanging met pannen, natuurleien of kunstleien. Strak gelegd, jaren waterdicht.</p></div>
        </div>
        <div class="tr-svc-card">
          <div class="tr-svc-img rl-thumb" data-rl-trigger data-rl-photos="[&quot;${imgPlatDak}&quot;]" data-rl-title="Plat dak EPDM"><img src="${imgPlatDak}" alt="Plat dak EPDM" /><span class="rl-zoom">⤢</span></div>
          <div class="tr-svc-body"><h3>Plat dak EPDM</h3><p>Naadloos EPDM in één stuk, geen plakranden. Ideaal voor aanbouw, garage of bijgebouw.</p></div>
        </div>
        <div class="tr-svc-card">
          <div class="tr-svc-img rl-thumb" data-rl-trigger data-rl-photos="[&quot;${imgComfort}&quot;]" data-rl-title="Dakisolatie &amp; sarking"><img src="${imgComfort}" alt="Dakisolatie sarking" /><span class="rl-zoom">⤢</span></div>
          <div class="tr-svc-body"><h3>Dakisolatie / sarking</h3><p>Sarkingisolatie buitenop of tussen de balken. Lager EPC, meer comfort, lagere stookkost.</p></div>
        </div>
        <div class="tr-svc-card">
          <div class="tr-svc-img rl-thumb" data-rl-trigger data-rl-photos="[&quot;${imgZinkGoot}&quot;]" data-rl-title="Zinkwerk &amp; goten"><img src="${imgZinkGoot}" alt="Zinkwerk en goten" /><span class="rl-zoom">⤢</span></div>
          <div class="tr-svc-body"><h3>Zinkwerk & goten</h3><p>Natuurzinken goten en kielgoten, gesoldeerd. Strakke lijn die 50+ jaar meegaat.</p></div>
        </div>
        <div class="tr-svc-card">
          <div class="tr-svc-img rl-thumb" data-rl-trigger data-rl-photos="[&quot;${imgVelux}&quot;]" data-rl-title="Velux dakramen"><img src="${imgVelux}" alt="Velux dakramen" /><span class="rl-zoom">⤢</span></div>
          <div class="tr-svc-body"><h3>Velux dakramen</h3><p>Plaatsing en vervanging van Velux-dakvensters. Waterdicht ingewerkt, meer daglicht op zolder.</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. ABOUT / CERTIFIED — onder de converterende secties: aandacht hoog houden voor hook + bewijs + diensten, daarna pas over ons -->
  <section class="tr-section" style="background:var(--bg-tint);">
    <div class="tr-wrap">
      <div class="tr-about-grid">
        <div class="tr-about-media">
          <div class="tr-about-badges">
            <span class="tr-about-badge"><img src="/assets/logos/koramic.png" alt="Koramic" /></span>
            <span class="tr-about-badge"><img src="/assets/logos/eternit.png" alt="Eternit" /></span>
            <span class="tr-about-badge tr-vca">VCA*</span>
          </div>
          <div class="tr-about-photo"><img src="${imgVakman}" alt="AB Bouw vakman aan het werk" /></div>
        </div>
        <div class="tr-about-body">
          <span class="tr-eyebrow">Over AB Bouw Groep</span>
          <h2>Dakwerkers die doen wat ze zeggen</h2>
          <p class="tr-about-intro">U wilt weten wie er komt, wanneer het klaar is en wat het kost. Daarom krijgt u één vast aanspreekpunt dat opneemt en op de afgesproken dag start.</p>
          <ul class="tr-checks">
            <li>${icCheck}<span><b>Offerte = factuur, geen meerwerken achteraf</b></span></li>
            <li>${icCheck}<span>Fotorapport bij elke dakinspectie</span></li>
            <li>${icCheck}<span>Concrete startdatum in de offerte</span></li>
            <li>${icCheck}<span>10 jaar garantie op waterdichtheid</span></li>
            <li>${icCheck}<span>6% btw waar het kan, plus premie-advies</span></li>
            <li>${icCheck}<span>Ook voor herstellingen en onderhoud</span></li>
          </ul>
          <div class="tr-urgency">Gratis dakinspectie, meestal binnen 5 werkdagen.</div>
        </div>
      </div>
    </div>
  </section>

  <div class="tr-wrap tr-cta-block">
    <p class="tr-cta-line">Eén aanspreekpunt, een vaste prijs vooraf.</p>
    <a class="tr-btn" href="#contact">Plan een vrijblijvend plaatsbezoek</a>
  </div>

  <!-- 9. WE ALSO OFFER / ONDERHOUD -->
  <section class="tr-section">
    <div class="tr-wrap">
      <div class="tr-also-grid">
        <div class="tr-also-body">
          
          <h2>Dakonderhoud & herstellingen</h2>
          <p>Niet altijd een volledig nieuw dak nodig? Wij doen ook gericht onderhoud en kleine herstellingen die uw dak jaren langer laten meegaan.</p>
          <ul class="tr-checks">
            <li>${icCheck}<span>Dakgoot reinigen en herstellen</span></li>
            <li>${icCheck}<span>Losse of gebroken pannen vervangen</span></li>
            <li>${icCheck}<span>Daklekkage opsporen en herstellen</span></li>
            <li>${icCheck}<span>Schoorsteen- en loodwerk</span></li>
            <li>${icCheck}<span>Mosbestrijding en dakreiniging</span></li>
          </ul>
        </div>
        <div class="tr-also-photo"><img src="${imgOnderhoud}" alt="Dakonderhoud en herstellingen" /></div>
      </div>
    </div>
  </section>

  <!-- 10b. RECENTE REALISATIES -->
  <section class="tr-section" id="realisaties" style="background:var(--bg-tint)">
    <div class="tr-wrap">
      <div class="tr-head" style="text-align:left;max-width:760px;margin:0 0 36px">
        <h2 style="font-size:clamp(27px,3.2vw,38px);color:#0a1628;font-weight:700;margin:0">Recente realisaties</h2>
        <p style="font-size:15px;line-height:1.6;color:#454f60;margin:10px 0 0">Een greep uit recent opgeleverde daken. Klik op een project voor meer beelden.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px">
        <div class="rl-thumb" data-rl-trigger data-rl-index="0" data-rl-photos="${RL_PAN}" data-rl-title="Pannendak-renovatie" style="border-radius:4px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(10,22,40,.35);aspect-ratio:4/3;position:relative">
          <img src="${imgRealPan1}" alt="Pannendak-renovatie realisatie" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block" />
          <span style="position:absolute;left:14px;bottom:12px;color:#fff;font-family:var(--font-display);font-weight:600;font-size:15px;text-shadow:0 1px 6px rgba(0,0,0,.55)">Pannendak-renovatie</span>
        </div>
        <div class="rl-thumb" data-rl-trigger data-rl-index="0" data-rl-photos="${RL_EPDM}" data-rl-title="Plat dak in EPDM" style="border-radius:4px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(10,22,40,.35);aspect-ratio:4/3;position:relative">
          <img src="${imgRealEpdm1}" alt="Plat dak EPDM realisatie" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block" />
          <span style="position:absolute;left:14px;bottom:12px;color:#fff;font-family:var(--font-display);font-weight:600;font-size:15px;text-shadow:0 1px 6px rgba(0,0,0,.55)">Plat dak in EPDM</span>
        </div>
        <div class="rl-thumb" data-rl-trigger data-rl-index="0" data-rl-photos="${RL_DET}" data-rl-title="Hellend dak vernieuwd" style="border-radius:4px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(10,22,40,.35);aspect-ratio:4/3;position:relative">
          <img src="${imgRealDet1}" alt="Vernieuwd hellend dak realisatie" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block" />
          <span style="position:absolute;left:14px;bottom:12px;color:#fff;font-family:var(--font-display);font-weight:600;font-size:15px;text-shadow:0 1px 6px rgba(0,0,0,.55)">Hellend dak vernieuwd</span>
        </div>
      </div>
    </div>
  </section>

  <div class="tr-wrap tr-cta-block">
    <p class="tr-cta-line">Benieuwd wat uw project kost?</p>
    <a class="tr-btn" href="#contact">Vraag vrijblijvend uw prijs</a>
  </div>

  <!-- 12. FAQ -->
  <section class="tr-section" id="faq" style="background:var(--bg-tint)">
    <div class="tr-wrap">
      <div class="tr-faq-box">
        <h2>Veelgestelde vragen</h2>
        <details class="tr-faq-item"><summary>Wat kost een nieuw dak?</summary><p>Dat hangt af van de oppervlakte, het type dak en de staat van de constructie. Na een gratis dakinspectie krijgt u een bindende prijs op papier.</p></details>
        <details class="tr-faq-item"><summary>Hoe lang duurt de plaatsing?</summary><p>Een gemiddeld hellend dak ligt waterdicht in 1 tot 2 weken. U krijgt een concrete startdatum in de offerte.</p></details>
        <details class="tr-faq-item"><summary>Doen jullie de premieaanvraag voor mij?</summary><p>Wij bekijken voor welke voordelen u in aanmerking komt: het 6% BTW-tarief (voor woningen ouder dan 10 jaar) en de Mijn VerbouwLening. Behoort u tot de juiste inkomenscategorie, dan regelen wij ook uw Mijn VerbouwPremie-dossier.</p></details>
        <details class="tr-faq-item"><summary>Wat is jullie garantie?</summary><p>10 jaar op waterdichtheid, plus fabrieksgarantie op de materialen (Koramic, Eternit, Firestone).</p></details>
        <details class="tr-faq-item"><summary>Werken jullie ook bij dringende lekkages?</summary><p>Ja, bij acute lekkage komen we zo snel mogelijk langs voor een noodherstel of dekzeil, daarna plannen we de definitieve herstelling.</p></details>
        <details class="tr-faq-item"><summary>Welke regio's bedienen jullie?</summary><p>Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.</p></details>
      </div>
    </div>
  </section>

  <!-- 13. FINAL CTA -->
  <section class="tr-section tr-section--lg tr-final" id="contact">
    <div class="tr-wrap">
      <h2>Laat ons eerst eens komen kijken</h2>
      <div class="tr-final-grid">
        <div class="tr-final-contact">
          <h3>Neem contact op</h3>
          <div class="tr-big">Uw projectleider neemt zelf op</div>
          <div class="tr-line">${icPin}<span>August van Landeghemstraat 63, 2830 Willebroek</span></div>
          <div class="tr-line">${icPhone}<span>Telefoon: <a href="${PHONE_HREF}">${PHONE}</a></span></div>
        </div>
        <div class="tr-final-card" data-lp-form-wrapper>
          <h3>Vraag uw gratis offerte</h3>
          <div class="tr-safe">${icShield}Vrijblijvend. We bellen u terug binnen één werkdag</div>
          <form data-lp-form novalidate>
            <div class="tr-final-row">
              <input type="text" name="firstName" placeholder="Voornaam *" autocomplete="given-name" required />
              <input type="tel" name="phone" placeholder="Telefoonnummer *" autocomplete="tel" required />
            </div>
            <input type="email" name="email" placeholder="E-mail *" autocomplete="email" required />
            <select name="type_dakwerk" class="tr-final-select" required>
              <option value="" disabled selected>Type dakwerk kiezen…</option>
              <option>Nieuw dak / dakvervanging</option>
              <option>Plat dak (EPDM)</option>
              <option>Dakisolatie / sarking</option>
              <option>Zinkwerk &amp; goten</option>
              <option>Dakherstelling / lekkage</option>
              <option>Velux dakraam</option>
              <option>Dakonderhoud</option>
              <option>Anders / weet ik nog niet</option>
            </select>
            <textarea name="aanvullende_info" placeholder="Korte omschrijving (optioneel)"></textarea>
            <button type="submit" class="tr-btn" data-lp-submit>Vraag gratis offerte</button>
          </form>
          <div class="tr-final-err" data-lp-form-error></div>
          <div class="tr-final-thanks">
            <h4>Bedankt, uw aanvraag is ontvangen.</h4>
            <p>We bellen u binnen één werkdag terug.</p>
          </div>
        </div>
        <div class="tr-final-testi">
          <div class="tr-final-testi-q">We stelden de dakvervanging jaren uit, bang voor de overlast. Na een week was alles klaar, de werf elke avond opgeruimd.</div>
          <div class="tr-final-testi-name">Patrick D., Bornem</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 14. FOOTER -->
  <footer class="tr-footer">
    <div class="tr-wrap">
      <div class="tr-footer-top">
        <span class="tr-footer-wordmark">AB Bouw Groep</span>
        <div class="tr-footer-links">
          <a href="#diensten">Diensten</a>
          <a href="#werkwijze">Werkwijze</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
          <a href="${PHONE_HREF}">${PHONE}</a>
        </div>
      </div>
      <div class="tr-footer-info">AB Bouw Groep · August van Landeghemstraat 63, 2830 Willebroek · ${PHONE}</div>
      <div class="tr-footer-copy">© ${new Date().getFullYear()} AB Bouw Groep · Erkend dakwerker in heel Vlaanderen. Alle rechten voorbehouden. &nbsp;·&nbsp; <a href="/voorwaarden" style="color:rgba(255,255,255,0.72);text-decoration:underline">Gebruiksvoorwaarden</a> &nbsp;·&nbsp; <a href="/privacy" style="color:rgba(255,255,255,0.72);text-decoration:underline">Privacybeleid</a> &nbsp;·&nbsp; <a href="/cookies" style="color:rgba(255,255,255,0.72);text-decoration:underline">Cookiebeleid</a></div>
    </div>
  </footer>

</div>
`;

export default function LpDakwerken({ local }: { local?: Gemeente } = {}) {
  const [calcOpen, setCalcOpen] = useState(false);

  // Klikken op [data-calc-trigger] in de LP-HTML opent modal i.p.v. navigeren.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest('[data-calc-trigger]');
      if (trigger) {
        e.preventDefault();
        trigger.classList.add('is-opening');
        setCalcOpen(true);
      }
      // Lead-card "Gratis dakinspectie": klap het formulier open/dicht.
      const lcToggle = target.closest('[data-lc-toggle]');
      if (lcToggle) {
        const row = lcToggle.closest('.tr-lc-row--primary');
        if (row) {
          const open = row.classList.toggle('is-open');
          lcToggle.setAttribute('aria-expanded', String(open));
        }
        return;
      }
      // Mobiel menu: openen/sluiten
      if (target.closest('[data-menu-toggle]')) {
        const open = document.body.classList.toggle('tr-menu-open');
        document.querySelector('.tr-burger')?.setAttribute('aria-expanded', String(open));
        return;
      }
      if (target.closest('[data-menu-close]')) {
        document.body.classList.remove('tr-menu-open');
        document.querySelector('.tr-burger')?.setAttribute('aria-expanded', 'false');
        return;
      }
      // Klik op een menu-link → menu sluiten (anchor-scroll laat doorgaan)
      if (target.closest('.tr-mobmenu a')) {
        document.body.classList.remove('tr-menu-open');
        document.querySelector('.tr-burger')?.setAttribute('aria-expanded', 'false');
      }
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      document.body.classList.remove('tr-menu-open');
    };
  }, []);

  useEffect(() => {
    const pageUrl = local ? `https://abgroep.be/lokaal/dakwerker-${local.slug}` : 'https://abgroep.be/lp/dakwerken';
    const canonicalUrl = local ? pageUrl : 'https://abgroep.be/dakwerken';
    document.title = local
      ? `Dakwerker ${local.name}: pannen, plat dak EPDM, sarkingisolatie | AB Bouw Groep`
      : 'Dakwerker Mechelen & Antwerpen: pannen, plat dak, EPDM, isolatie | AB Bouw Groep';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', local
      ? `Erkend dakwerker in ${local.name} (${local.postcode}). Pannendak Koramic, plat dak EPDM, sarkingisolatie, zinkwerk en natuurleien. Vaste prijs op papier, 10 jaar garantie op waterdichtheid via Federale Verzekering, 6% BTW-voordeel. Gratis dakinspectie, meestal binnen 5 werkdagen.`
      : 'Erkend dakwerker in Mechelen, Antwerpen, Lier, Bornem, Sint-Niklaas. Pannendak, plat dak EPDM, sarking-isolatie, zinkwerk. Vaste prijs op papier, 10 jaar garantie op waterdichtheid via Federale Verzekering, 6% BTW-voordeel. Gratis dakinspectie, meestal binnen 5 werkdagen.');

    // Open Graph + Twitter
    const setMeta = (prop: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('og:title', local
      ? `Dakwerker ${local.name}: gratis dakinspectie | AB Bouw Groep`
      : 'Dakwerker Mechelen & Antwerpen: gratis dakinspectie | AB Bouw Groep', true);
    setMeta('og:description', local
      ? `Pannendak, plat dak EPDM en dakisolatie in ${local.name}. Vaste prijs op papier, 10j garantie op waterdichtheid, 6% BTW-voordeel.`
      : 'Nieuw dak, plat dak EPDM, dakisolatie. Vaste prijs op papier, 10j garantie op waterdichtheid, 6% BTW-voordeel.', true);
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

    // Schema.org JSON-LD: RoofingContractor + Breadcrumb + Service + FAQ
    const schemaId = 'lp-dak-schema';
    document.getElementById(schemaId)?.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'RoofingContractor',
          '@id': 'https://abgroep.be/#organization',
          name: 'AB Bouw Groep',
          url: 'https://abgroep.be',
          telephone: CONTACT.phone.e164,
          email: CONTACT.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'August van Landeghemstraat 63',
            postalCode: '2830',
            addressLocality: 'Willebroek',
            addressCountry: 'BE',
          },
          areaServed: [
            { '@type': 'City', name: 'Mechelen' },
            { '@type': 'City', name: 'Antwerpen' },
            { '@type': 'City', name: 'Lier' },
            { '@type': 'City', name: 'Willebroek' },
            { '@type': 'City', name: 'Bornem' },
            { '@type': 'City', name: 'Sint-Niklaas' },
          ],
          priceRange: '€€',

        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: local
            ? [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abgroep.be' },
              { '@type': 'ListItem', position: 2, name: 'Dakwerker', item: 'https://abgroep.be/dakwerken' },
              { '@type': 'ListItem', position: 3, name: `Dakwerker ${local.name}`, item: pageUrl },
            ]
            : [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abgroep.be' },
              { '@type': 'ListItem', position: 2, name: 'Dakwerken', item: 'https://abgroep.be/lp/dakwerken' },
            ],
        },
        {
          '@type': 'Service',
          name: 'Dakwerken: pannen, plat dak EPDM, dakisolatie',
          provider: { '@id': 'https://abgroep.be/#organization' },
          areaServed: 'Vlaanderen',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Wat kost een nieuw dak?', acceptedAnswer: { '@type': 'Answer', text: 'Dat hangt af van de oppervlakte, het type dak en de staat van de constructie. Na een gratis dakinspectie krijgt u een bindende prijs op papier.' } },
            { '@type': 'Question', name: 'Hoe lang duurt de plaatsing?', acceptedAnswer: { '@type': 'Answer', text: 'Een gemiddeld hellend dak ligt waterdicht in 1 tot 2 weken. U krijgt een concrete startdatum in de offerte.' } },
            { '@type': 'Question', name: 'Doen jullie de premieaanvraag voor mij?', acceptedAnswer: { '@type': 'Answer', text: 'Wij bekijken voor welke voordelen u in aanmerking komt: het 6% BTW-tarief (voor woningen ouder dan 10 jaar) en de Mijn VerbouwLening. Behoort u tot de juiste inkomenscategorie, dan regelen wij ook uw Mijn VerbouwPremie-dossier.' } },
            { '@type': 'Question', name: 'Wat is jullie garantie?', acceptedAnswer: { '@type': 'Answer', text: '10 jaar op waterdichtheid, plus fabrieksgarantie op de materialen (Koramic, Eternit, Firestone).' } },
            { '@type': 'Question', name: 'Werken jullie ook bij dringende lekkages?', acceptedAnswer: { '@type': 'Answer', text: 'Ja, bij acute lekkage komen we zo snel mogelijk langs voor een noodherstel of dekzeil, daarna plannen we de definitieve herstelling.' } },
            { '@type': 'Question', name: 'Welke regio\'s bedienen jullie?', acceptedAnswer: { '@type': 'Answer', text: 'Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.' } },
          ],
        },
      ],
    });
    document.head.appendChild(schema);

    const prev = document.body.className;
    document.body.className = 'lp-page is-subpage';
    try { sessionStorage.setItem('ab_last_lp', local ? `/lokaal/dakwerker-${local.slug}` : '/lp/dakwerken'); } catch {}
    const style = document.createElement('style');
    style.textContent = LP_CSS;
    document.head.appendChild(style);
    // Hash-deeplink (bv. Google-sitelink /lp/...#werkwijze): scroll naar de sectie i.p.v. naar boven.
    if (window.location.hash && window.location.hash.length > 1) {
      const _id = window.location.hash.slice(1);
      setTimeout(() => { const _el = document.getElementById(_id); if (_el) _el.scrollIntoView({ behavior: 'smooth', block: 'start' }); else window.scrollTo(0, 0); }, 90);
    } else {
      window.scrollTo(0, 0);
    }

    // ── Main form (final CTA) submit ─────────────────────────────────────
    const wrap = document.querySelector<HTMLElement>('[data-lp-form-wrapper]');
    const form = document.querySelector<HTMLFormElement>('[data-lp-form]');
    const submitBtn = document.querySelector<HTMLButtonElement>('[data-lp-submit]');
    const errBox = document.querySelector<HTMLElement>('[data-lp-form-error]');
    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (!form || !wrap) return;
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

      const result = await submitLead({
        source: 'landing_page',
        landing_division: 'ab_dakwerken',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        email: emailV,
        phone: phoneV,
        type_werk: 'ab_dakwerken',
        aanvullende_info: (() => {
          const t = ((fd.get('type_dakwerk') as string) || '').trim();
          const m = ((fd.get('aanvullende_info') as string) || '').trim();
          return [t && `Type dakwerk: ${t}`, m].filter(Boolean).join(' — ') || undefined;
        })(),
        bron_lead: local ? `seo:dakwerker-${local.slug}` : 'ads:dakwerken',
      });
      if (result.ok) {
        wrap.classList.add('is-success');
        wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      } else {
        wrap.classList.add('is-error');
        if (errBox) errBox.textContent = `Er ging iets mis. Bel ons gerust op ${CONTACT.phone.spaced}.`;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag gratis offerte'; }
      }
    };
    form?.addEventListener('submit', onSubmit);
    // Funnel-top: vuur form_start bij eerste focus (trackFormStart dedupet per id).
    const onFinalStart = () => trackFormStart(local ? `lp:dakwerker-${local.slug}:final` : 'lp:dakwerken:final');
    form?.addEventListener('focusin', onFinalStart);

    // ── Hero quick-form (above-fold) submit ──────────────────────────────
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
        landing_division: 'ab_dakwerken',
        page_path: window.location.pathname,
        firstName,
        email: emailV,
        phone: phoneV,
        type_werk: 'ab_dakwerken',
        aanvullende_info: 'Hero-mini-form (2 velden, above-fold quick capture)',
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
    const onQuickStart = () => trackFormStart(local ? `lp:dakwerker-${local.slug}:quick` : 'lp:dakwerken:quick');
    quickForm?.addEventListener('focusin', onQuickStart);

    return () => {
      document.body.className = prev;
      style.remove();
      document.getElementById('lp-dak-schema')?.remove();
      form?.removeEventListener('submit', onSubmit);
      quickForm?.removeEventListener('submit', onQuickSubmit);
      form?.removeEventListener('focusin', onFinalStart);
      quickForm?.removeEventListener('focusin', onQuickStart);
    };
  }, []);


  const renderedHtml = local
    ? HTML.replace(
        'voor uw dak, overal in Vlaanderen',
        `voor uw dak in ${local.name} en omgeving`,
      )
    : HTML;

  useEffect(() => initRealisatieLightbox(), []);
  useEffect(() => initLpReveal(), []);
  useEffect(() => initLpCallFab(), []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      {calcOpen && <CalculatorDak onClose={() => { setCalcOpen(false); document.querySelector('[data-calc-trigger].is-opening')?.classList.remove('is-opening'); }} />}
    </>
  );
}
