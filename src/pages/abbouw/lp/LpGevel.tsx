import { useEffect } from 'react';
import { submitLead } from '@/lib/leads';
import type { Gemeente } from '@/data/gemeentes';
import { CONTACT } from '@/data/contact';
import logo from '@/assets/home/logo.png';

// Hero + section photos (gevel-realisaties).
import heroWitte from '@/assets/gevel/witte-crepi.jpg';
import imgGrijze from '@/assets/gevel/grijze-crepi.jpg';
import imgSteenstrips from '@/assets/gevel/lp-steenstrips-zwart.jpg';
import imgSierpleister from '@/assets/gevel/lp-gevelreiniging.jpg';
import imgStelling from '@/assets/gevel/stelling.jpg';
import imgIntro from '@/assets/gevel/intro.jpg';
import { initRealisatieLightbox } from './_lightbox';
import imgRealCrepi1 from '@/assets/gevel/lp-real-crepi-1.jpg';
import imgRealCrepi2 from '@/assets/gevel/lp-real-crepi-2.jpg';
import imgRealCrepi3 from '@/assets/gevel/lp-real-crepi-3.jpg';
import imgRealSteen1 from '@/assets/gevel/lp-real-steen-1.jpg';
import imgRealSteen2 from '@/assets/gevel/lp-real-steen-2.jpg';
import imgRealSteen3 from '@/assets/gevel/lp-real-steen-3.jpg';
import imgRealReinig1 from '@/assets/gevel/lp-real-reinig-1.jpg';
import imgRealReinig2 from '@/assets/gevel/lp-real-reinig-2.jpg';
import imgRealReinig3 from '@/assets/gevel/lp-real-reinig-3.jpg';

/* ─────────────────────────────────────────────────────────────────────────
   Texas-Roofing-Pros layout, faithfully replicated, NAVY theme, AB Bouw NL
   content — gevel-variant. Zelfde structuur & CSS als LpDakwerken: scoped CSS
   string injected via <style>, HTML als template literal gerenderd via
   dangerouslySetInnerHTML. Forms wired in useEffect via data-* hooks.
   ───────────────────────────────────────────────────────────────────────── */

const NAVY = '#0a1628';
const NAVY2 = '#14233a';
const ORANGE = '#d98c03';
const ORANGE_H = '#b87502';
const GOLD = '#c69a4b';

const LP_CSS = `
.tr { font-family: var(--font-body); color: #1d2733; --tr-r-photo: 8px; --tr-r-ui: 8px; --tr-r-card: 12px; --wrap: 1200px; --bg-tint: #f3f1ea; --tr-line: #e7e3d8; }
.tr { --section-y: clamp(56px, 7vw, 116px); --section-y-lg: clamp(80px, 9vw, 140px); --section-y-compact: clamp(44px, 5vw, 80px); }
.tr * { box-sizing: border-box; }
.tr .tr-wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 clamp(24px, 5vw, 56px); }
.tr h1, .tr h2, .tr h3, .tr h4 { font-family: var(--font-display); letter-spacing: -0.02em; font-weight: 700; text-wrap: balance; font-feature-settings: 'ss01','kern','liga'; -webkit-font-smoothing: antialiased; }
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
.tr-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-display); font-weight: 600; font-size: 12px;
  letter-spacing: 0.08em; text-transform: uppercase; color: #41495a; margin-bottom: 14px; }
.tr-eyebrow::before { content: ''; width: 26px; height: 3px; border-radius: 2px; background: ${ORANGE}; display: inline-block; flex-shrink: 0; }
.tr-urgency { margin-top: 14px; font-size: 13px; color: #525b6b; font-weight: 600; }
.tr-section { padding: var(--section-y) 0; }
.tr-section + .tr-section { border-top: 1px solid var(--ink-line-soft); }
.tr-section[id] { scroll-margin-top: 88px; }
.tr-section.tr-section--lg { padding: var(--section-y-lg) 0; }
.tr-section.tr-section--compact { padding: var(--section-y-compact) 0; }

/* 1 — TOP BAR */
.tr-topbar { background: ${NAVY}; color: rgba(255,255,255,0.85); font-size: 13px; }
.tr-topbar .tr-wrap { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 40px; }
.tr-topbar-left { display: inline-flex; align-items: center; gap: 0; flex-wrap: wrap; }
.tr-topbar-left span { padding: 4px 0; }
.tr-topbar-left span + span::before { content: "·"; margin: 0 12px; color: rgba(255,255,255,0.4); }
.tr-topbar-phone { display: inline-flex; align-items: center; gap: 8px; background: ${ORANGE}; color: #fff;
  font-weight: 700; padding: 7px 16px; border-radius: 999px; white-space: nowrap; }
.tr-topbar-phone svg { width: 15px; height: 15px; }
@media (max-width: 760px) { .tr-topbar-left span:not(:first-child) { display: none; } }

/* 2 — HEADER */
.tr-header { background: #fff; border-bottom: 1px solid #ececec; position: sticky; top: 0; z-index: 60; }
.tr-header .tr-wrap { display: flex; align-items: center; gap: 24px; min-height: 74px; }
.tr-logo { height: 38px; width: auto; display: block; }
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
  .tr-burger { display: flex; }
  .tr-logo { height: 52px; }
  .tr-header .tr-wrap { min-height: 66px; gap: 12px; }
  .tr-mobmenu-overlay { display: block; position: fixed; inset: 0; background: rgba(10,22,40,0.55); opacity: 0; pointer-events: none; transition: opacity .28s ease; z-index: 150; }
  body.tr-menu-open .tr-mobmenu-overlay { opacity: 1; pointer-events: auto; }
  .tr-mobmenu { display: flex; flex-direction: column; gap: 2px; position: fixed; top: 0; right: 0; bottom: 0; width: min(84vw, 360px); background: #fff; box-shadow: -24px 0 60px -24px rgba(0,0,0,0.45); transform: translateX(100%); transition: transform .3s var(--ease-out-quart, ease); z-index: 200; padding: 30px 26px 30px; overflow-y: auto; }
  body.tr-menu-open .tr-mobmenu { transform: translateX(0); }
  body.tr-menu-open { overflow: hidden; }
  .tr-mobmenu-close { align-self: flex-end; background: none; border: 0; font-size: 34px; line-height: 1; color: ${NAVY}; cursor: pointer; padding: 0 4px 6px; margin-bottom: 6px; }
  .tr-mobmenu a:not(.tr-btn) { font-family: var(--font-display); font-weight: 600; font-size: 19px; color: ${NAVY}; padding: 15px 4px; border-bottom: 1px solid #efece5; }
  .tr-mobmenu a:not(.tr-btn):active { color: ${ORANGE}; }
  .tr-mobmenu-cta { margin-top: 22px; justify-content: center; text-align: center; padding: 16px; font-size: 16px; }
  body.tr-menu-open .tr-burger span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
  body.tr-menu-open .tr-burger span:nth-child(2) { opacity: 0; }
  body.tr-menu-open .tr-burger span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
}

/* 3 — HERO */
.tr-hero { position: relative; background: ${NAVY}; color: #fff; overflow: hidden; }
@media (min-width: 1024px) { .tr-hero { display: flex; align-items: center; min-height: clamp(560px, 64vh, 720px); } .tr-hero-inner { width: 100%; } }
.tr-hero-bg { position: absolute; inset: 0; }
.tr-hero-bg img { width: 100%; height: 100%; object-fit: cover; }
.tr-hero-bg::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(100deg, rgba(10,22,40,0.90) 0%, rgba(10,22,40,0.70) 46%, rgba(10,22,40,0.40) 100%), linear-gradient(180deg, rgba(10,22,40,0.14) 0%, rgba(10,22,40,0) 46%, rgba(10,22,40,0.55) 100%); }
.tr-hero-inner { position: relative; z-index: 2; text-align: left; padding: clamp(72px,8vw,112px) 0 clamp(110px,12vw,168px); }
.tr-hero h1 { font-size: clamp(32px, 4.9vw, 60px); line-height: 1.07; font-weight: 700; letter-spacing: -0.035em; color: #fff; margin: 0 0 22px; max-width: 16ch; text-wrap: balance; }
.tr-hero-sub { font-size: clamp(15px, 1.45vw, 19px); line-height: 1.6; color: rgba(255,255,255,0.92);
  max-width: 620px; margin: 0 0 32px; }
.tr-hero-sub b { color: #fff; }
.tr-hero-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 22px; margin: 0 0 30px; }
.tr-hero-call { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: rgba(255,255,255,0.86); text-decoration: none; transition: color .18s; }
.tr-hero-call:hover { color: ${GOLD}; }
@media (max-width: 720px) { .tr-hero-cta { justify-content: center; gap: 12px 18px; margin-bottom: 24px; } }
.tr-hero .tr-eyebrow { color: ${GOLD}; margin-bottom: 18px; }
.tr-hero .tr-eyebrow::before { background: ${GOLD}; }
.tr-certs { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-start; gap: 10px; max-width: 620px; margin: 6px 0 0; }
.tr-cert-pill { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.13); border-radius: var(--tr-r-ui);
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); white-space: nowrap; }
.tr-cert-pill svg { color: ${GOLD}; flex-shrink: 0; opacity: 0.92; }
@media (max-width: 720px) { .tr-hero { display: flex; align-items: center; min-height: 76vh; } .tr-hero-inner { width: 100%; padding: 44px 0 116px; text-align: center; } .tr-hero-sub { margin-left: auto; margin-right: auto; } .tr-certs { justify-content: center; gap: 9px 10px; } .tr-cert-pill { height: 36px; padding: 0 13px; font-size: 12px; } }

/* 4 — QUICK FORM (overlaps hero) */
.tr-quickform-shell { background: #fff; }
.tr-quickform { background: #fff; max-width: 880px; margin: -88px auto 0; position: relative; z-index: 5;
  border: 1px solid #e7e4dd; border-radius: var(--tr-r-card); box-shadow: 0 26px 60px -28px rgba(10,22,40,0.4); padding: 34px 40px 36px; }
.tr-quickform .tr-eyebrow { text-align: center; display: block; margin-bottom: 6px; }
.tr-quickform h3 { text-align: center; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; color: ${NAVY}; margin: 0 0 26px; }
.tr-qf-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: stretch; }
.tr-qf-grid input { width: 100%; padding: 15px 16px; border: 1px solid #d3d7dd; border-radius: var(--tr-r-ui); font: inherit;
  font-size: 15px; color: #1d2733; background: #fff; transition: border-color .18s, box-shadow .18s; }
.tr-qf-grid input::placeholder { color: #8a8f98; }
.tr-qf-grid input:focus { outline: none; border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(217,140,3,0.16); background: #fff; }
.tr-qf-grid .tr-btn { white-space: nowrap; }
.tr-qf-error { display: none; margin-top: 12px; font-size: 13.5px; color: #b3261e; background: #fdecea;
  border: 1px solid rgba(179,38,30,0.2); border-radius: var(--tr-r-ui); padding: 9px 12px; }
.tr-qf-thanks { display: none; text-align: center; padding: 16px 0 6px; }
.tr-qf-thanks-ic { width: 54px; height: 54px; border-radius: 50%; background: #eef1f5; color: ${NAVY};
  display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.tr-qf-thanks h4 { font-size: 21px; color: ${NAVY}; margin: 0 0 6px; }
.tr-qf-thanks p { font-size: 14.5px; color: #454f60; margin: 0; }
.tr-quickform.is-success .tr-qf-grid, .tr-quickform.is-success .tr-eyebrow,
.tr-quickform.is-success h3, .tr-quickform.is-success .tr-qf-error { display: none; }
.tr-quickform.is-success .tr-qf-thanks { display: block; }
.tr-hero-testi { max-width: 760px; margin: 30px auto 0; text-align: center; padding: 0 16px 8px; }
.tr-hero-testi-q { font-size: 15.5px; line-height: 1.65; color: #3a4252; font-style: italic;
  display: inline; padding: 0; }
.tr-hero-testi-name { margin-top: 14px; font-family: var(--font-display); font-weight: 700; color: ${NAVY}; font-size: 14.5px; }
@media (max-width: 720px) {
  .tr-quickform { margin: -52px 20px 0; padding: 26px 22px 28px; }
  .tr-quickform h3 { font-size: 21px; margin-bottom: 18px; }
  .tr-qf-grid { grid-template-columns: 1fr; gap: 11px; }
  .tr-hero-testi { margin-top: 26px; }
}

/* 5 — THREE STEPS (orange-bordered box) */
.tr-steps-box { padding: 8px 0 0; max-width: 1180px; margin: 0 auto; }
.tr-steps-box h2 { text-align: center; font-size: clamp(26px, 3vw, 36px); color: ${NAVY}; font-weight: 700; margin: 0 0 44px; }
.tr-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px; }
.tr-step { text-align: center; }
.tr-step-num { font-family: var(--font-display); font-size: 40px; font-weight: 700; line-height: 1; color: ${NAVY}; margin: 0 auto 16px; letter-spacing: -0.03em; position: relative; display: inline-block; padding-bottom: 12px; }
.tr-step-num::after { content: ""; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 24px; height: 3px; background: ${ORANGE}; border-radius: 2px; }
.tr-step h3 { font-size: 20px; color: ${NAVY}; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 10px; }
.tr-step p { font-size: 15px; line-height: 1.62; color: #454f60; margin: 0; }
@media (max-width: 820px) { .tr-steps-grid { grid-template-columns: 1fr; gap: 30px; } .tr-steps-box { padding: 34px 22px 38px; } }

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
.tr-about-intro { font-size: 16px; line-height: 1.7; color: #3a4453; margin: 0 0 22px; }
.tr-checks { list-style: none; padding: 0; margin: 0 0 28px; }
.tr-checks li { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; font-size: 15px; color: #2b3543; line-height: 1.5; }
.tr-checks li svg { color: ${NAVY}; flex-shrink: 0; margin-top: 2px; }
.tr-checks li b { font-weight: 600; color: ${NAVY}; }
@media (max-width: 900px) { .tr-about-grid { grid-template-columns: 1fr; gap: 36px; } }

/* 7 — NUMBERS BAR */
.tr-numbers { display: grid; grid-template-columns: repeat(4, 1fr); background: ${NAVY}; border-top: 3px solid ${GOLD}; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
.tr-num { padding: clamp(40px, 4.4vw, 60px) 28px; text-align: center; color: #fff; background: ${NAVY}; position: relative; }
.tr-num + .tr-num::before { content: ""; position: absolute; left: 0; top: 22%; bottom: 22%; width: 1px; background: rgba(198,154,75,0.28); }
.tr-num-big { font-family: var(--font-display); font-weight: 600; font-size: clamp(30px, 3.4vw, 44px); line-height: 1; color: ${GOLD}; }
.tr-num-lbl { margin-top: 10px; font-size: 14px; font-weight: 600; letter-spacing: 0.01em; color: rgba(255,255,255,0.88); }
@media (max-width: 720px) { .tr-numbers { grid-template-columns: 1fr 1fr; } .tr-num + .tr-num::before { display: none; } .tr-num { padding: 34px 20px; } }

/* 8 — SERVICES (dark) */
.tr-services { background: ${NAVY}; color: #fff; border-top: 1px solid rgba(255,255,255,0.07); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
.tr-services .tr-head { text-align: left; max-width: 680px; margin: 0 0 44px; }
.tr-services .tr-head h2 { font-size: clamp(27px, 4.4vw, 52px); color: #fff; font-weight: 700; letter-spacing: -0.02em; line-height: 1.06; margin: 0; }
.tr-svc-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; align-items: stretch; }
.tr-svc-card { background: ${NAVY2}; border: 1px solid rgba(255,255,255,0.13); border-radius: var(--tr-r-card); overflow: hidden; box-shadow: 0 24px 48px -34px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05);
  display: flex; flex-direction: column; height: 100%; transition: transform .25s ease, border-color .25s ease; }
.tr-svc-card:hover { border-color: rgba(255,255,255,0.28); }
.tr-svc-img { aspect-ratio: 16/11; overflow: hidden; }
.tr-svc-img img { width: 100%; height: 100%; object-fit: cover; }
.tr-svc-body { padding: 22px 22px 26px; flex: 1 1 auto; display: flex; flex-direction: column; }
.tr-svc-body h3 { font-size: 18px; color: #fff; font-weight: 600; margin: 0 0 9px; }
.tr-svc-body p { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.74); margin: 0; }
.tr-services .tr-urgency { color: rgba(255,255,255,0.66); }
@media (max-width: 1040px) { .tr-svc-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .tr-svc-grid { grid-template-columns: 1fr; } }

/* (4-up services valt terug op 2-up @1040 en 1-up @560 — mobiel ongewijzigd) */
/* 9 — WE ALSO OFFER / MAINTENANCE */
.tr-also-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.tr-also-body h2 { font-size: clamp(27px, 3.2vw, 38px); color: ${NAVY}; font-weight: 700; margin: 0 0 16px; }
.tr-also-body > p { font-size: 16px; line-height: 1.7; color: #3a4453; margin: 0 0 22px; }
.tr-also-photo { border-radius: var(--tr-r-photo); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(10,22,40,0.35); }
.tr-also-photo img { width: 100%; aspect-ratio: 5/4; object-fit: cover; display: block; }
@media (max-width: 900px) { .tr-also-grid { grid-template-columns: 1fr; gap: 36px; } }


/* 11 — REVIEWS */
.tr-reviews { background: var(--bg-tint); }
.tr-reviews .tr-head { text-align: left; max-width: 680px; margin: 0 0 44px; }
.tr-reviews .tr-head h2 { font-size: clamp(27px, 3.2vw, 40px); color: ${NAVY}; font-weight: 700; margin: 0; }
.tr-rev-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: stretch; }
.tr-rev-card { background: #fff; border: 1px solid #e7e4dd; border-radius: var(--tr-r-card); padding: 30px 28px 28px;
  display: flex; flex-direction: column; }
.tr-rev-stars { color: ${GOLD}; font-size: 15px; letter-spacing: 2px; margin-bottom: 14px; }
.tr-rev-card p { font-size: 14.5px; line-height: 1.65; color: #3a4252; margin: 0 0 20px; flex: 1; }
.tr-rev-foot { border-top: 1px solid #eeede4; padding-top: 16px; }
.tr-rev-name { font-family: var(--font-display); font-weight: 600; color: ${NAVY}; font-size: 14.5px; }
.tr-rev-role { font-size: 12.5px; color: #525b6b; font-weight: 600; margin-top: 2px; }
@media (max-width: 980px) { .tr-rev-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 620px) { .tr-rev-grid { grid-template-columns: 1fr; } }

/* 12 — FAQ (orange-bordered box) */
.tr-faq-box { border-top: 1px solid #ece9e1; padding: 12px 0 0; max-width: 760px; margin: 0 auto; }
.tr-faq-box h2 { text-align: center; font-size: clamp(26px, 3vw, 36px); color: ${NAVY}; font-weight: 700; margin: 0 0 30px; }
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
.tr-final h2 { text-align: center; font-size: clamp(27px, 3.2vw, 40px); color: #fff; font-weight: 700; margin: 0 0 48px; }
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
.tr-final-card input:focus, .tr-final-card textarea:focus, .tr-final-card select:focus { outline: none; border-color: ${ORANGE};
  box-shadow: 0 0 0 3px rgba(10,22,40,0.14); background: #fff; }
.tr-final-card textarea { min-height: 92px; resize: vertical; }
.tr-final-card select { appearance: none; -webkit-appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23525b6b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center; background-size: 16px; padding-right: 40px; }
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
  .tr-rev-grid { gap: 30px; }
  .tr-footer { padding: 72px 0 44px; }
  .tr-footer-top { align-items: flex-start; margin-bottom: 34px; padding-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .tr-footer-links { gap: 32px; }
  .tr-footer-info { font-size: 14.5px; }
}
`;

/* ── Inline SVG icon set (no external deps) ─────────────────────────────── */
const icPhone = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const icCheck = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const icShield = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
const icPin = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const stars = '★★★★★';

const PHONE = CONTACT.phone.spaced;
const PHONE_HREF = CONTACT.phone.href;
const ADDRESS = CONTACT.address.full;

/* ── Page HTML (template literal) ───────────────────────────────────────── */
const RL_CREPI = JSON.stringify([imgRealCrepi1, imgRealCrepi2, imgRealCrepi3]).replace(/"/g, '&quot;');
const RL_STEEN = JSON.stringify([imgRealSteen1, imgRealSteen2, imgRealSteen3]).replace(/"/g, '&quot;');
const RL_REINIG = JSON.stringify([imgRealReinig1, imgRealReinig2, imgRealReinig3]).replace(/"/g, '&quot;');

const HTML = `
<div class="tr">

  <!-- 1. TOP BAR -->
  <div class="tr-topbar">
    <div class="tr-wrap">
      <div class="tr-topbar-left">
        <span>Gratis gevelinspectie binnen 5 werkdagen</span>
        <span>Familiebedrijf</span>
        <span>Eigen ploeg</span>
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
        <a class="tr-btn tr-headcta" href="#contact" style="padding:12px 22px;font-size:14px;">Gratis offerte</a>
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
      <a class="tr-btn tr-mobmenu-cta" href="#contact">Offerte aanvragen</a>
    </nav>
  </header>

  <!-- 3. HERO -->
  <section class="tr-hero">
    <div class="tr-hero-bg"><img src="${heroWitte}" alt="Gevelwerken Vlaanderen" /></div>
    <div class="tr-hero-inner">
      <div class="tr-wrap">
        <span class="tr-eyebrow">Gevelwerken · heel Vlaanderen</span>
        <h1>Het vakkundigste gevelwerk van Vlaanderen.</h1>
        <p class="tr-hero-sub">Crepi, buitenisolatie (ETICS), steenstrips en sierpleister. <b>Eigen ploeg</b>, actief in Mechelen, Antwerpen, Lier en heel Vlaanderen.</p>
        <div class="tr-hero-cta">
          <a href="#lp-form" class="tr-btn">Gratis offerte aanvragen</a>
          <a href="${PHONE_HREF}" class="tr-hero-call">of bel ${PHONE}</a>
        </div>
        <div class="tr-certs">
          <span class="tr-cert-pill">${icShield}VCA* gecertificeerd</span>
          <span class="tr-cert-pill">${icCheck.replace('width="20" height="20"','width="15" height="15"')}Lid Bouwunie</span>
          <span class="tr-cert-pill">${icShield}Verzekerd via Federale</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. QUICK FORM -->
  <div class="tr-quickform-shell">
    <div class="tr-wrap">
      <div class="tr-quickform" id="lp-form" data-lp-quick>
        <h3>Gratis terugbelverzoek</h3>
        <form data-lp-quick-form novalidate>
          <div class="tr-qf-grid">
            <input type="text" name="firstName" placeholder="Voornaam" autocomplete="given-name" required />
            <input type="tel" name="phone" placeholder="Telefoon" autocomplete="tel" required />
            <button type="submit" class="tr-btn" data-lp-quick-submit>
              <span data-lp-quick-submit-label>Bel mij terug</span>
            </button>
          </div>
        </form>
        <div class="tr-qf-error" data-lp-quick-error hidden></div>
        <div class="tr-qf-thanks">
          <div class="tr-qf-thanks-ic">${icCheck.replace('width="20" height="20"','width="26" height="26"')}</div>
          <h4>Bedankt, aanvraag ontvangen!</h4>
          <p>We bellen u zo snel mogelijk terug voor uw gratis gevelinspectie.</p>
        </div>
      </div>
      <div class="tr-hero-testi">
        <span class="tr-hero-testi-q">"Onze rijwoning had een vermoeide bezetting uit de jaren '80. Nu een spierwitte crepi-gevel die je zo uit een magazine plukt. Strak, proper, op tijd opgeleverd."</span>
        <div class="tr-hero-testi-name">— Jasmien D., Mechelen</div>
      </div>
    </div>
  </div>

  <!-- 5. WERKWIJZE / 3 STAPPEN -->
  <section class="tr-section" id="werkwijze">
    <div class="tr-wrap">
      <div class="tr-steps-box">
        <h2>In 3 stappen naar uw nieuwe gevel</h2>
        <div class="tr-steps-grid">
          <div class="tr-step">
            <div class="tr-step-num">01</div>
            <h3>Plan uw gratis gevelinspectie</h3>
            <p>Kies een moment dat past. Onze vakman beoordeelt uw gevel en bezorgt een fotorapport van de staat.</p>
          </div>
          <div class="tr-step">
            <div class="tr-step-num">02</div>
            <h3>Ontvang uw vaste prijs-offerte</h3>
            <p>U krijgt heldere opties, materiaalkeuze en een bindende prijs. Zo weet u exact waar u aan toe bent.</p>
          </div>
          <div class="tr-step">
            <div class="tr-step-num">03</div>
            <h3>Zorgeloze plaatsing door eigen ploeg</h3>
            <p>Onze eigen gevelploeg voert alles uit van begin tot eind. Strak, proper, op een afgesproken startdatum.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. ABOUT / CERTIFIED -->
  <section class="tr-section" style="background:var(--bg-tint);">
    <div class="tr-wrap">
      <div class="tr-about-grid">
        <div class="tr-about-media">
          <div class="tr-about-badges">
            <span class="tr-about-badge"><img src="/assets/logos/caparol.png" alt="Caparol" /></span>
            <span class="tr-about-badge"><img src="/assets/logos/knauf.png" alt="Knauf" /></span>
            <span class="tr-about-badge tr-vca">VCA*</span>
          </div>
          <div class="tr-about-photo"><img src="${imgStelling}" alt="AB Bouw gevelploeg aan het werk" /></div>
        </div>
        <div class="tr-about-body">
          
          <h2>Uw erkende gevelspecialist in heel Vlaanderen</h2>
          <p class="tr-about-intro">AB Bouw Groep is een familiebedrijf met een eigen ploeg uit Willebroek. Wij verzorgen crepi, buitenisolatie (ETICS), steenstrips en sierpleister van A tot Z.</p>
          <ul class="tr-checks">
            <li>${icCheck}<span><b>Offerte = factuur, ook bij prijsstijgingen</b></span></li>
            <li>${icCheck}<span>Eigen ploeg, geen onderaannemers</span></li>
            <li>${icCheck}<span>Mijn VerbouwPremie-dossier regelen wij</span></li>
            <li>${icCheck}<span>Transparante prijs, geen verborgen kosten</span></li>
            <li>${icCheck}<span>Strakke, duurzame afwerking</span></li>
          </ul>
          <div class="tr-urgency">Gratis plaatsbezoek, meestal binnen 5 werkdagen.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. NUMBERS BAR -->
  <section class="tr-numbers">
    <div class="tr-num"><div class="tr-num-big">15 jaar</div><div class="tr-num-lbl">ervaring</div></div>
    <div class="tr-num"><div class="tr-num-big">120+</div><div class="tr-num-lbl">gevels gerenoveerd</div></div>
    <div class="tr-num"><div class="tr-num-big">100%</div><div class="tr-num-lbl">eigen ploeg</div></div>
    <div class="tr-num"><div class="tr-num-big">10 jaar</div><div class="tr-num-lbl">garantie</div></div>
  </section>

  <!-- 8. SERVICES -->
  <section class="tr-section tr-services" id="diensten">
    <div class="tr-wrap">
      <div class="tr-head">
        
        <h2>Vakkundig gevelwerk in heel Vlaanderen</h2>
      </div>
      <div class="tr-svc-grid">
        <div class="tr-svc-card">
          <div class="tr-svc-img"><img src="${heroWitte}" alt="Crepi en sierpleister" /></div>
          <div class="tr-svc-body"><h3>Crepi & sierpleister</h3><p>Strakke crepi of marmorino-afwerking in elke kleur, egaal en jaren mooi.</p></div>
        </div>
        <div class="tr-svc-card">
          <div class="tr-svc-img"><img src="${imgGrijze}" alt="ETICS buitenisolatie" /></div>
          <div class="tr-svc-body"><h3>ETICS buitenisolatie</h3><p>16 cm isolatie buitenop + crepi. Lager EPC, geen koude muren meer.</p></div>
        </div>
        <div class="tr-svc-card">
          <div class="tr-svc-img"><img src="${imgSteenstrips}" alt="Steenstrips" /></div>
          <div class="tr-svc-body"><h3>Steenstrips</h3><p>Authentieke baksteen-look zonder het gewicht. Voegen kaarsrecht.</p></div>
        </div>
        <div class="tr-svc-card">
          <div class="tr-svc-img"><img src="${imgSierpleister}" alt="Gevelreiniging en hervoegen" /></div>
          <div class="tr-svc-body"><h3>Gevelreiniging & hervoegen</h3><p>Reinigen, impregneren of hervoegen — uw gevel weer als nieuw.</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. WE ALSO OFFER / ONDERHOUD -->
  <section class="tr-section">
    <div class="tr-wrap">
      <div class="tr-also-grid">
        <div class="tr-also-body">
          
          <h2>Gevelonderhoud & herstellingen</h2>
          <p>Niet altijd een volledig nieuwe gevel nodig? Onze ploeg doet ook gericht onderhoud en herstellingen die uw gevel jaren langer mooi en gezond houden.</p>
          <ul class="tr-checks">
            <li>${icCheck}<span>Gevelreiniging</span></li>
            <li>${icCheck}<span>Hervoegen van metselwerk</span></li>
            <li>${icCheck}<span>Impregneren tegen vocht</span></li>
            <li>${icCheck}<span>Herstel van scheuren en vochtschade</span></li>
            <li>${icCheck}<span>Schilderwerk buiten</span></li>
          </ul>
        </div>
        <div class="tr-also-photo"><img src="${imgIntro}" alt="Gevelonderhoud en herstellingen" /></div>
      </div>
    </div>
  </section>

  <!-- 10b. RECENTE REALISATIES -->
  <section class="tr-section" id="realisaties" style="background:var(--bg-tint)">
    <div class="tr-wrap">
      <div class="tr-head" style="text-align:left;max-width:760px;margin:0 0 36px">
        <h2 style="font-size:clamp(27px,3.2vw,38px);color:#0a1628;font-weight:700;margin:0">Recente realisaties</h2>
        <p style="font-size:15px;line-height:1.6;color:#454f60;margin:10px 0 0">Echte gevels die onze eigen ploeg in Vlaanderen afwerkte. Klik op een project voor meer beelden.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px">
        <div class="rl-thumb" data-rl-trigger data-rl-index="0" data-rl-photos="${RL_CREPI}" data-rl-title="Crepi &amp; buitenisolatie" style="border-radius:4px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(10,22,40,.35);aspect-ratio:4/3;position:relative">
          <img src="${imgRealCrepi1}" alt="Crepi-gevel realisatie" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block" />
          <span style="position:absolute;left:14px;bottom:12px;color:#fff;font-family:var(--font-display);font-weight:600;font-size:15px;text-shadow:0 1px 6px rgba(0,0,0,.55)">Crepi &amp; buitenisolatie</span>
        </div>
        <div class="rl-thumb" data-rl-trigger data-rl-index="0" data-rl-photos="${RL_STEEN}" data-rl-title="Steenstrips" style="border-radius:4px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(10,22,40,.35);aspect-ratio:4/3;position:relative">
          <img src="${imgRealSteen1}" alt="Steenstrips-gevel realisatie" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block" />
          <span style="position:absolute;left:14px;bottom:12px;color:#fff;font-family:var(--font-display);font-weight:600;font-size:15px;text-shadow:0 1px 6px rgba(0,0,0,.55)">Steenstrips</span>
        </div>
        <div class="rl-thumb" data-rl-trigger data-rl-index="0" data-rl-photos="${RL_REINIG}" data-rl-title="Gevelreiniging" style="border-radius:4px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(10,22,40,.35);aspect-ratio:4/3;position:relative">
          <img src="${imgRealReinig1}" alt="Gevelreiniging realisatie" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block" />
          <span style="position:absolute;left:14px;bottom:12px;color:#fff;font-family:var(--font-display);font-weight:600;font-size:15px;text-shadow:0 1px 6px rgba(0,0,0,.55)">Gevelreiniging</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 11. REVIEWS -->
  <section class="tr-section tr-reviews" id="reviews">
    <div class="tr-wrap">
      <div class="tr-head">
        
        <h2>Tevreden klanten in heel Vlaanderen</h2>
      </div>
      <div class="tr-rev-grid">
        <div class="tr-rev-card"><div class="tr-rev-stars">${stars}</div><p>"Volledig pakket: 16 cm EPS + crepi. EPC van F naar C in één werk. Stookkost bijna gehalveerd. Premie-dossier (€4.800) liep via hen."</p><div class="tr-rev-foot"><div class="tr-rev-name">Joris Vanhove</div><div class="tr-rev-role">ETICS + crepi</div></div></div>
        <div class="tr-rev-card"><div class="tr-rev-stars">${stars}</div><p>"Steenstrips Vandersanden, voegen kaarsrecht, aansluitingen rond ramen vakwerk. Niemand merkt het verschil met echte steen."</p><div class="tr-rev-foot"><div class="tr-rev-name">Marius Ionescu</div><div class="tr-rev-role">Steenstrips voorgevel</div></div></div>
        <div class="tr-rev-card"><div class="tr-rev-stars">${stars}</div><p>"Marmorino in zachte taupe. Eén van de mannen hielp met de kleurkeuze. Achteraf super blij, het huis straalt karakter uit."</p><div class="tr-rev-foot"><div class="tr-rev-name">Cindy Van Looy</div><div class="tr-rev-role">Sierpleister marmorino</div></div></div>
      </div>
    </div>
  </section>

  <!-- 12. FAQ -->
  <section class="tr-section" id="faq">
    <div class="tr-wrap">
      <div class="tr-faq-box">
        <h2>Veelgestelde vragen</h2>
        <details class="tr-faq-item"><summary>Wat kost een gevelrenovatie?</summary><p>Dat hangt af van de oppervlakte, de gekozen afwerking (crepi, steenstrips, sierpleister) en of er isolatie bij komt. Na een gratis plaatsbezoek krijgt u een bindende prijs op papier.</p></details>
        <details class="tr-faq-item"><summary>Hoe lang duurt het?</summary><p>Een gemiddelde rijwoning is doorgaans in 1 tot 2 weken afgewerkt, afhankelijk van het systeem en het weer. U krijgt een concrete startdatum in de offerte.</p></details>
        <details class="tr-faq-item"><summary>Doen jullie de premieaanvraag?</summary><p>Ja. Voor buitenisolatie (ETICS) berekenen wij waar u recht op heeft en dienen wij het volledige Mijn VerbouwPremie-dossier voor u in.</p></details>
        <details class="tr-faq-item"><summary>Wat is jullie garantie?</summary><p>10 jaar garantie op de uitvoering, plus de fabrieksgarantie op de gevelsystemen (Caparol, Knauf, Isover).</p></details>
        <details class="tr-faq-item"><summary>Crepi of steenstrips — wat past bij mijn woning?</summary><p>Crepi geeft een strakke, moderne look in elke kleur; steenstrips geven een warme baksteen-uitstraling. Onze vakman adviseert u ter plaatse op basis van uw woning en budget.</p></details>
        <details class="tr-faq-item"><summary>Welke regio's bedienen jullie?</summary><p>Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.</p></details>
      </div>
    </div>
  </section>

  <!-- 13. FINAL CTA -->
  <section class="tr-section tr-final" id="contact">
    <div class="tr-wrap">
      <h2>Klaar voor uw nieuwe gevel?</h2>
      <div class="tr-final-grid">
        <div class="tr-final-contact">
          <h3>Neem contact op</h3>
          <div class="tr-big">Praat met onze gevelspecialist</div>
          <div class="tr-line">${icPin}<span>${ADDRESS}</span></div>
          <div class="tr-line">${icPhone}<span>Telefoon: <a href="${PHONE_HREF}">${PHONE}</a></span></div>
        </div>
        <div class="tr-final-card" data-lp-form-wrapper>
          <h3>Vraag uw gratis offerte</h3>
          <div class="tr-safe">${icShield}Vrijblijvend — we bellen u terug binnen 1 werkdag</div>
          <form data-lp-form novalidate>
            <div class="tr-final-row">
              <input type="text" name="firstName" placeholder="Voornaam" autocomplete="given-name" required />
              <input type="tel" name="phone" placeholder="Telefoon" autocomplete="tel" required />
            </div>
            <input type="email" name="email" placeholder="E-mail" autocomplete="email" required />
            <select name="type_gevelwerk" required>
              <option value="" disabled selected>Type gevelwerk</option>
              <option value="Crepi / Sierpleister">Crepi / Sierpleister</option>
              <option value="Buitenisolatie (ETICS)">Buitenisolatie (ETICS)</option>
              <option value="Steenstrips">Steenstrips</option>
              <option value="Gevelreiniging">Gevelreiniging</option>
              <option value="Hervoegen">Hervoegen</option>
              <option value="Anders/weet nog niet">Anders/weet nog niet</option>
            </select>
            <textarea name="aanvullende_info" placeholder="Korte omschrijving"></textarea>
            <button type="submit" class="tr-btn" data-lp-submit>Vraag gratis offerte</button>
          </form>
          <div class="tr-final-err" data-lp-form-error></div>
          <div class="tr-final-thanks">
            <h4>Bedankt, aanvraag ontvangen!</h4>
            <p>We nemen zo snel mogelijk contact met u op.</p>
          </div>
        </div>
        <div class="tr-final-testi">
          <div class="tr-final-testi-q">"Onze verouderde gevel is in twee weken omgetoverd tot een strakke crepi-afwerking. Proper gewerkt, perfect opgeleverd en de prijs klopte met de offerte."</div>
          <div class="tr-final-testi-name">— Patrick D., Bornem</div>
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
      <div class="tr-footer-info">AB Bouw Groep · ${ADDRESS} · ${PHONE}</div>
      <div class="tr-footer-copy">© ${new Date().getFullYear()} AB Bouw Groep — Erkend gevelspecialist in heel Vlaanderen. Alle rechten voorbehouden.</div>
    </div>
  </footer>

</div>
`;

export default function LpGevel({ local }: { local?: Gemeente } = {}) {
  // Mobiel menu open/sluiten via data-* hooks in de LP-HTML.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-menu-toggle]')) {
        document.body.classList.toggle('tr-menu-open');
        return;
      }
      if (target.closest('[data-menu-close]')) {
        document.body.classList.remove('tr-menu-open');
        return;
      }
      if (target.closest('.tr-mobmenu a')) {
        document.body.classList.remove('tr-menu-open');
      }
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      document.body.classList.remove('tr-menu-open');
    };
  }, []);

  useEffect(() => {
    const pageUrl = local ? `https://abgroep.be/lokaal/gevelrenovatie-${local.slug}` : 'https://abgroep.be/lp/gevel';
    const canonicalUrl = local ? pageUrl : 'https://abgroep.be/gevel';
    document.title = local
      ? `Gevelwerken ${local.name} — Crepi, ETICS, Steenstrips, Sierpleister | AB Bouw Groep`
      : 'Gevelwerken Mechelen & Antwerpen — Crepi, Buitenisolatie, Steenstrips | AB Bouw Groep';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', local
      ? `Erkend gevelspecialist in ${local.name} (${local.postcode}). Crepi, buitenisolatie (ETICS), steenstrips en sierpleister. Eigen ploeg uit Willebroek, 10 jaar garantie via Federale Verzekering, premie Mijn VerbouwPremie inbegrepen. Gratis gevelinspectie binnen 5 werkdagen.`
      : 'Erkend gevelspecialist in Mechelen, Antwerpen, Lier, Bornem, Sint-Niklaas. Crepi, buitenisolatie (ETICS), steenstrips, sierpleister en gevelreiniging. Eigen ploeg, 10 jaar garantie via Federale Verzekering, premie Mijn VerbouwPremie inbegrepen. Gratis gevelinspectie binnen 5 werkdagen.');

    // Open Graph + Twitter
    const setMeta = (prop: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('og:title', local
      ? `Gevelwerken ${local.name} — Gratis gevelinspectie | AB Bouw Groep`
      : 'Gevelwerken Mechelen & Antwerpen — Gratis gevelinspectie | AB Bouw Groep', true);
    setMeta('og:description', local
      ? `Crepi, buitenisolatie (ETICS) en steenstrips in ${local.name}. Eigen ploeg, 10j garantie, premiedossier inbegrepen.`
      : 'Crepi, buitenisolatie (ETICS), steenstrips en sierpleister. Eigen ploeg, 10j garantie, premiedossier inbegrepen.', true);
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

    // Schema.org JSON-LD: HomeAndConstructionBusiness + Breadcrumb + Service + FAQ
    const schemaId = 'lp-gevel-schema';
    document.getElementById(schemaId)?.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'HomeAndConstructionBusiness',
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
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '120', bestRating: '5' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: local
            ? [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abgroep.be' },
              { '@type': 'ListItem', position: 2, name: 'Gevelwerken', item: 'https://abgroep.be/gevel' },
              { '@type': 'ListItem', position: 3, name: `Gevelwerken ${local.name}`, item: pageUrl },
            ]
            : [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abgroep.be' },
              { '@type': 'ListItem', position: 2, name: 'Gevelwerken', item: 'https://abgroep.be/lp/gevel' },
            ],
        },
        {
          '@type': 'Service',
          name: 'Gevelwerken — crepi, buitenisolatie (ETICS), steenstrips, sierpleister',
          provider: { '@id': 'https://abgroep.be/#organization' },
          areaServed: 'Vlaanderen',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Wat kost een gevelrenovatie?', acceptedAnswer: { '@type': 'Answer', text: 'Dat hangt af van de oppervlakte, de gekozen afwerking (crepi, steenstrips, sierpleister) en of er isolatie bij komt. Na een gratis plaatsbezoek krijgt u een bindende prijs op papier.' } },
            { '@type': 'Question', name: 'Hoe lang duurt het?', acceptedAnswer: { '@type': 'Answer', text: 'Een gemiddelde rijwoning is doorgaans in 1 tot 2 weken afgewerkt, afhankelijk van het systeem en het weer. U krijgt een concrete startdatum in de offerte.' } },
            { '@type': 'Question', name: 'Doen jullie de premieaanvraag?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. Voor buitenisolatie (ETICS) berekenen wij waar u recht op heeft en dienen wij het volledige Mijn VerbouwPremie-dossier voor u in.' } },
            { '@type': 'Question', name: 'Wat is jullie garantie?', acceptedAnswer: { '@type': 'Answer', text: '10 jaar garantie op de uitvoering, plus de fabrieksgarantie op de gevelsystemen (Caparol, Knauf, Isover).' } },
            { '@type': 'Question', name: 'Crepi of steenstrips — wat past bij mijn woning?', acceptedAnswer: { '@type': 'Answer', text: 'Crepi geeft een strakke, moderne look in elke kleur; steenstrips geven een warme baksteen-uitstraling. Onze vakman adviseert u ter plaatse op basis van uw woning en budget.' } },
            { '@type': 'Question', name: 'Welke regio\'s bedienen jullie?', acceptedAnswer: { '@type': 'Answer', text: 'Mechelen, Antwerpen, Lier, Willebroek, Bornem, Sint-Niklaas en heel Vlaanderen.' } },
          ],
        },
      ],
    });
    document.head.appendChild(schema);

    const prev = document.body.className;
    document.body.className = 'lp-page is-subpage';
    try { sessionStorage.setItem('ab_last_lp', local ? `/lokaal/gevelrenovatie-${local.slug}` : '/lp/gevel'); } catch {}
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

      const typeGevel = ((fd.get('type_gevelwerk') as string) || '').trim();
      const extra = ((fd.get('aanvullende_info') as string) || '').trim();
      const combinedInfo = [typeGevel ? `Type gevelwerk: ${typeGevel}` : '', extra]
        .filter(Boolean).join(' — ') || undefined;

      const result = await submitLead({
        source: 'landing_page',
        landing_division: 'ab_gevelbekleding',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        email: emailV,
        phone: phoneV,
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
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag gratis offerte'; }
      }
    };
    form?.addEventListener('submit', onSubmit);

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
        landing_division: 'ab_gevelbekleding',
        page_path: window.location.pathname,
        firstName,
        email: emailV,
        phone: phoneV,
        type_werk: 'AB Gevelbekleding',
        aanvullende_info: 'Hero-mini-form (2 velden, above-fold quick capture)',
        bron_lead: local ? `seo:gevelrenovatie-${local.slug}:quick` : 'ads:gevel:quick',
      });
      if (result.ok) {
        quickWrap?.classList.add('is-success');
      } else {
        if (quickBtn) quickBtn.disabled = false;
        if (quickBtnLabel) quickBtnLabel.textContent = 'Bel mij terug';
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
    };
  }, []);


  const renderedHtml = local
    ? HTML
        .replace(
          'Het vakkundigste gevelwerk van Vlaanderen.',
          `Het vakkundigste gevelwerk van ${local.name}.`,
        )
        .replace(
          'actief in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
          `actief in ${local.name} en heel Vlaanderen.`,
        )
    : HTML;

  useEffect(() => initRealisatieLightbox(), []);

  return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
}
