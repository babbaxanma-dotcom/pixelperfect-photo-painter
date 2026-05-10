// Shared shell (nav, hero helper, footer, sticky mobile bar) + full lf-* styling
// reused across every AB Bouw subpage so the look is identical to the Home page.
import logo from '@/assets/home/logo.png';

type NavKey = 'home' | 'over' | 'diensten' | 'werkwijze' | 'realisaties' | 'blog' | 'contact';

const isActive = (k: NavKey, active: NavKey) => (k === active ? ' class="active"' : '');

export const buildNav = (active: NavKey) => `
<div class="scroll-progress" id="scrollProgress"></div>

<nav class="lf-nav" id="nav">
  <div class="wrap lf-nav-inner">
    <a class="lf-brand" href="/">
      <img src="${logo}" alt="AB Bouw Groep" class="lf-brand-logo" />
    </a>
    <ul class="lf-menu">
      <li><a href="/"${isActive('home', active)}>Home</a></li>
      <li><a href="/over"${isActive('over', active)}>Over ons</a></li>
      <li><a href="/diensten"${isActive('diensten', active)}>Diensten</a></li>
      <li><a href="/werkwijze"${isActive('werkwijze', active)}>Werkwijze</a></li>
      <li><a href="/realisaties"${isActive('realisaties', active)}>Realisaties</a></li>
      <li><a href="/blog"${isActive('blog', active)}>Blog</a></li>
      <li><a href="/contact"${isActive('contact', active)}>Contact</a></li>
    </ul>
    <a href="tel:+32470634413" class="lf-nav-phone">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      +32 470 63 44 13
    </a>
    <button class="mobile-toggle lf-mobile-toggle" onclick="toggleMobileMenu()" aria-label="Menu">☰</button>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <button class="mm-close" id="mobileMenuClose" type="button" aria-label="Sluit menu">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <div class="mm-section">
    <a href="/">Home</a><a href="/over">Over ons</a><a href="/diensten">Diensten</a>
    <a href="/werkwijze">Werkwijze</a><a href="/realisaties">Realisaties</a><a href="/blog">Blog</a><a href="/contact">Contact</a>
  </div>
  <div class="mm-section">
    <a href="/construct">AB Construct</a><a href="/ecologisch">AB Ecologisch</a>
    <a href="/interieur">AB Interieurwerken</a><a href="/dakwerken">AB Dakwerken</a>
    <a href="/bad">AB Bad &amp; Wellness</a><a href="/gevel">AB Gevelbekleding</a>
  </div>
  <div class="mm-footer">
    <a href="tel:+32470634413">📞 +32 470 63 44 13</a>
    <a href="mailto:info@abbouwgroup.be">✉ info@abbouwgroup.be</a>
  </div>
</div>
`;

// Hero in same visual language as Home: dark bg image + floating white card.
export const buildHero = (opts: {
  bg: string;
  eyebrow: string;
  title: string;       // may contain HTML
  lede: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) => {
  const primary = opts.primary ?? { label: 'Vraag een plaatsbezoek aan', href: '/contact' };
  return `
<section class="lf-hero">
  <div class="lf-hero-bg"><img src="${opts.bg}" alt="" /></div>
  <div class="wrap lf-hero-wrap">
    <div class="lf-hero-card" data-reveal>
      <span class="lf-eyebrow">${opts.eyebrow}</span>
      <h1>${opts.title}</h1>
      <p>${opts.lede}</p>
      <div class="lf-hero-actions">
        <a href="${primary.href}" class="lf-cta-pill">
          <span>${primary.label}</span>
          <span class="lf-cta-pill-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </a>
        ${opts.secondary ? `<a href="${opts.secondary.href}" class="lf-btn-ghost">${opts.secondary.label}</a>` : ''}
      </div>
    </div>
  </div>
</section>
`;
};

// CTA banner identical to Home.
export const buildCta = (title: string, lede: string) => `
<section class="lf-section">
  <div class="wrap">
    <div class="lf-cta lf-cta--simple" data-reveal>
      <div class="lf-cta-text">
        <h2>${title}</h2>
        <p>${lede}</p>
        <div class="lf-cta-actions">
          <a href="/contact" class="lf-btn-light">Start uw project</a>
          <a href="/contact" class="lf-btn-outline">Contacteer ons</a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

export const FOOTER = `
<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="nav-brand" href="/"><img src="${logo}" alt="AB Bouw Groep" class="footer-logo" /></a>
        <p>Vlaams bouw- en renovatiebedrijf met gespecialiseerde ploegen. Actief in heel Vlaanderen en Brussel sinds 2010.</p>
      </div>
      <div class="footer-col"><h5>Divisies</h5><ul>
        <li><a href="/construct">AB Construct</a></li>
        <li><a href="/ecologisch">AB Ecologisch</a></li>
        <li><a href="/interieur">AB Interieurwerken</a></li>
        <li><a href="/dakwerken">AB Dakwerken</a></li>
        <li><a href="/bad">AB Bad &amp; Wellness</a></li>
        <li><a href="/gevel">AB Gevelbekleding</a></li>
      </ul></div>
      <div class="footer-col"><h5>Bedrijf</h5><ul>
        <li><a href="/over">Over ons</a></li>
        <li><a href="/werkwijze">Werkwijze</a></li>
        <li><a href="/realisaties">Realisaties</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul></div>
      <div class="footer-col"><h5>Contact</h5><ul>
        <li><a href="tel:+32470634413">+32 470 63 44 13</a></li>
        <li><a href="mailto:info@abbouwgroup.be">info@abbouwgroup.be</a></li>
        <li><a>Willebroek, België</a></li>
        <li><a>Ma t.e.m. vr · 8u tot 18u</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <div>© 2026 AB Bouw Group · BTW BE 0XXX.XXX.XXX</div>
      <div class="footer-bottom-links">
        <a href="/privacy">Privacy</a><a href="/voorwaarden">Algemene voorwaarden</a><a href="/cookies">Cookies</a>
      </div>
    </div>
  </div>
</footer>

<div class="lf-mobile-bar">
  <a href="tel:+32470634413" class="lf-mobile-bar-btn lf-mobile-bar-call">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    Bel ons
  </a>
  <a href="/contact" class="lf-mobile-bar-btn lf-mobile-bar-cta">
    Vraag offerte
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </a>
</div>

<a href="tel:+32470634413" class="lf-fab-call" aria-label="Bel ons direct">
  <span class="lf-fab-pulse"></span>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
</a>
`;

// =====================================================================
// FULL Home-page styling, every lf-* class used on Home is included so
// subpages share an identical look & feel. Keep this in sync with Home.tsx.
// =====================================================================
export const SHELL_STYLE = `
/* Floating white pill nav over hero */
.lf-nav { position: fixed; top: 18px; left: 0; right: 0; z-index: 50; background: transparent; border: none; pointer-events: none; transition: top 0.3s var(--ease); }
.lf-nav-inner { pointer-events: auto; display:flex; align-items:center; gap:28px; padding: 10px 20px 10px 16px; max-width: min(1140px, calc(100% - 80px)); margin: 0 auto; background: #fff; border-radius: 999px; box-shadow: 0 12px 40px -12px rgba(10,22,40,0.18); transition: box-shadow 0.3s var(--ease), padding 0.3s var(--ease); }
.lf-nav.scrolled { top: 10px; }
.lf-nav.scrolled .lf-nav-inner { box-shadow: 0 16px 50px -10px rgba(10,22,40,0.28); }
.lf-brand { display:flex; align-items:center; gap:10px; font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--ink); text-decoration:none; }
.lf-brand-logo { height: 58px; width: auto; display:block; }
.lf-menu { display:flex; gap:24px; list-style:none; margin:0 auto; padding:0; }
.lf-menu a { font-size: 14.5px; font-weight: 500; color: var(--ink-soft); transition: color 0.2s; padding: 8px 0; position: relative; text-decoration:none; }
.lf-menu a:hover, .lf-menu a.active { color: var(--accent); }
.lf-menu a.active::after { content:''; position:absolute; left:0; right:0; bottom:-2px; height:2px; background: var(--accent); }
.lf-nav-phone { display:inline-flex; align-items:center; gap:8px; padding: 12px 20px; background: var(--accent); color:#fff !important; border-radius: 999px; font-weight: 600; font-size: 14px; transition: background 0.2s; text-decoration:none; }
.lf-nav-phone:hover { background: var(--accent-hover); }
.lf-mobile-toggle { display:none; background:transparent; border:none; cursor:pointer; }
@media (max-width: 900px) {
  .lf-menu { display:none; }
  .lf-nav-phone { display:none; }
  .lf-mobile-toggle { display:inline-flex; margin-left:auto; font-size:24px; padding:6px 10px; }
}

/* Buttons */
.lf-btn-pri { display:inline-flex; align-items:center; gap:10px; padding: 15px 28px; background: var(--navy); color:#fff !important; border-radius: 2px; font-weight: 500; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; transition: all 0.25s var(--ease); border:none; cursor:pointer; text-decoration:none; }
.lf-btn-pri:hover { background: #000; transform: translateY(-1px); box-shadow: 0 14px 28px -14px rgba(0,0,0,0.4); }
.lf-btn-sm { padding: 11px 20px; font-size: 12px; }
.lf-btn-light { display:inline-flex; align-items:center; gap:10px; padding: 15px 28px; background: #fff; color: var(--navy) !important; border-radius: 2px; font-weight:500; font-size:13px; letter-spacing: 0.04em; text-transform: uppercase; text-decoration:none; transition: all 0.25s var(--ease); }
.lf-btn-light:hover { background: var(--accent); color: #fff !important; }
.lf-btn-outline { display:inline-flex; align-items:center; gap:10px; padding: 14px 28px; background: transparent; color: #fff !important; border: 1px solid rgba(255,255,255,0.35); border-radius: 2px; font-weight:500; font-size:13px; letter-spacing: 0.04em; text-transform: uppercase; text-decoration:none; transition: all 0.25s var(--ease); }
.lf-btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.06); }
.lf-btn-ghost { display:inline-flex; align-items:center; gap:6px; padding: 0; background: transparent; color: var(--ink) !important; border-radius: 0; font-weight: 500; font-size: 13px; letter-spacing: 0; text-transform: none; text-decoration: none; border: 0; transition: color 0.2s var(--ease); }
.lf-btn-ghost:hover { color: var(--accent) !important; }

.lf-cta-pill { position: relative; display:inline-flex; align-items:center; justify-content:center; gap:0; padding: 14px 26px; background: #d98c03 !important; color: #fff !important; border-radius: 999px; font-weight: 600; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; border: 0; cursor: pointer; transition: transform 0.08s var(--ease), background 0.15s var(--ease); text-decoration: none; line-height: 1; box-shadow: none; -webkit-tap-highlight-color: transparent; }
.lf-cta-pill:hover, .lf-cta-pill:focus, .lf-cta-pill:focus-visible { background: #c47e02 !important; color: #fff !important; outline: none; }
.lf-cta-pill:active { background: #a86b01 !important; transform: scale(0.96); }
.lf-cta-pill-arrow { display: none !important; }

/* Editorial alternating step rows (Werkwijze) */
.ab-steps { display: grid; gap: 56px; max-width: 1080px; margin: 0 auto; }
.ab-step { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.ab-step.reverse .ab-step-media { order: 2; }
.ab-step-media { position: relative; aspect-ratio: 4/3; overflow: hidden; border-radius: 6px; }
.ab-step-media img { width:100%; height:100%; object-fit: cover; display:block; transition: transform 0.7s var(--ease); }
.ab-step:hover .ab-step-media img { transform: scale(1.03); }
.ab-step-num { position: absolute; top: 16px; left: 16px; width: 38px; height: 38px; border-radius: 50%; background: var(--accent); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-family: var(--font-display); font-weight: 600; font-size: 14px; box-shadow: 0 6px 18px -6px rgba(0,0,0,0.35); }
.ab-step-tag { display:inline-block; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
.ab-step h3 { font-family: var(--font-display); font-size: clamp(22px, 2.2vw, 28px); color: var(--navy); margin: 0 0 14px; font-weight: 600; letter-spacing: -0.01em; }
.ab-step p { font-size: 14.5px; line-height: 1.7; color: var(--ink-soft); margin: 0; }
.ab-step .ab-more { margin-top: 14px; }
@media (max-width: 820px) {
  .ab-step, .ab-step.reverse { grid-template-columns: 1fr; gap: 20px; }
  .ab-step.reverse .ab-step-media { order: 0; }
}

.lf-eyebrow { display:inline-block; padding: 6px 14px; background: var(--accent); color:#fff; border-radius: 4px; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform: uppercase; margin-bottom: 18px; }
.lf-h2 { font-family: var(--font-display); font-size: clamp(28px, 3.4vw, 44px); line-height:1.15; font-weight:600; letter-spacing:-0.02em; color: var(--navy); margin-bottom: 18px; }
.lf-section { padding: 90px 0; }
.lf-tone-soft { background: var(--bg-tint); }
.lf-section-head { max-width: 720px; margin-bottom: 56px; }
.lf-section-head.centered { margin: 0 auto 56px; text-align:center; }
.lf-lede { font-size: 16px; color: var(--ink-soft); line-height:1.7; max-width: 560px; margin-bottom: 28px; }

/* HERO (subpages reuse exactly the home hero look) */
.lf-hero { position: relative; min-height: 620px; display:flex; align-items:center; overflow:hidden; margin-top: 0; }
.lf-hero-bg { position:absolute; inset:0; }
.lf-hero-bg img { width:100%; height:100%; object-fit: cover; }
.lf-hero-bg::after { content:''; position:absolute; inset:0; background: linear-gradient(90deg, rgba(10,22,40,0.6) 0%, rgba(10,22,40,0.2) 60%, transparent 100%); }
.lf-hero-wrap { position: relative; z-index:2; padding-top: 160px; padding-bottom: 90px; display:block; max-width: none !important; margin: 0 !important; padding-left: clamp(24px, 6vw, 96px) !important; padding-right: clamp(24px, 6vw, 96px) !important; }
.lf-hero-card { background: rgba(255,255,255,0.96); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.6); padding: 44px 42px; border-radius: 18px; width: 580px; max-width: 100%; box-shadow: 0 30px 80px -30px rgba(10,22,40,0.45); }
.lf-hero-card h1 { font-family: var(--font-display); font-size: clamp(30px, 3.6vw, 44px); line-height:1.15; font-weight:700; letter-spacing:-0.02em; color: var(--navy); margin-bottom: 16px; }
.lf-hero-card p { font-size: 15px; color: var(--ink-soft); line-height:1.7; margin-bottom: 26px; }
.lf-hero-actions { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }

/* Services Grid (used on /diensten) */
.lf-svc-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.lf-svc-card { display:flex; flex-direction:column; background:#fff; border-radius: 14px; overflow:hidden; border: 1px solid var(--ink-line-soft); transition: all 0.3s var(--ease); color: var(--ink); text-decoration:none; }
.lf-svc-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(10,22,40,0.18); border-color: var(--accent); }
.lf-svc-img { position:relative; aspect-ratio: 4/3; overflow:hidden; }
.lf-svc-img img { width:100%; height:100%; object-fit:cover; transition: transform 0.6s var(--ease); }
.lf-svc-card:hover .lf-svc-img img { transform: scale(1.05); }
.lf-svc-num { position:absolute; left:16px; bottom:16px; width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background: var(--accent); color:#fff; font-weight:700; font-size:14px; border-radius: 6px; box-shadow: 0 6px 16px rgba(217,140,3,0.4); }
.lf-svc-body { padding: 24px; }
.lf-svc-body h4 { font-size: 18px; color: var(--navy); margin-bottom: 8px; }
.lf-svc-body p { font-size: 14px; line-height:1.6; color: var(--ink-soft); margin-bottom:16px; }
.lf-svc-link { display:inline-flex; align-items:center; gap:6px; color: var(--accent); font-weight:600; font-size:13px; }

/* Why-us collage */
.lf-why-collage { display:grid; grid-template-columns: 1fr 1.2fr 1fr; grid-template-rows: 1fr 1fr; gap: 24px; max-width: 1100px; margin: 0 auto; }
.lf-why-tile { background:#fff; padding: 28px 26px; border-radius: 12px; border: 1px solid var(--ink-line-soft); position: relative; transition: background 0.5s var(--ease), border-color 0.5s var(--ease), transform 0.5s var(--ease), box-shadow 0.5s var(--ease); }
.lf-why-tile h5 { font-size: 15.5px; color: var(--navy); margin-bottom: 8px; line-height: 1.3; margin-top: 14px; transition: color 0.4s var(--ease); }
.lf-why-tile p { font-size: 13.5px; line-height:1.65; color: var(--ink-soft); margin: 0; }
.lf-why-meta { display:flex; align-items:center; gap:14px; padding-bottom: 14px; border-bottom: 1px solid var(--ink-line-soft); transition: border-color 0.4s var(--ease); }
.lf-why-num { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; line-height: 1; transition: color 0.4s var(--ease); }
.lf-why-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-mute); line-height: 1; transition: color 0.4s var(--ease); }
.lf-why-tile.is-active { background: var(--accent); border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 18px 40px -18px rgba(217,140,3,0.55); }
.lf-why-tile.is-active h5,
.lf-why-tile.is-active p,
.lf-why-tile.is-active .lf-why-num,
.lf-why-tile.is-active .lf-why-label { color: #fff; }
.lf-why-tile.is-active .lf-why-meta { border-bottom-color: rgba(255,255,255,0.35); }
.lf-why-photo { grid-row: 1 / 3; grid-column: 2; border-radius: 14px; overflow:hidden; }
.lf-why-photo img { width:100%; height:100%; object-fit:cover; }
.lf-why-tl { grid-area: 1 / 1; }
.lf-why-tr { grid-area: 1 / 3; }
.lf-why-bl { grid-area: 2 / 1; }
.lf-why-br { grid-area: 2 / 3; }

/* Process */
.lf-process { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; margin-top: 20px; }
.lf-process-line { position: absolute; top: 28px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, var(--ink-line) 8%, var(--ink-line) 92%, transparent); z-index: 0; }
.lf-process-step { position: relative; z-index: 1; background: transparent; padding: 0 8px; text-align: left; }
.lf-process-num { width: 56px; height: 56px; border-radius: 50%; background: #fff; border: 2px solid var(--accent); color: var(--accent); display:inline-flex; align-items:center; justify-content:center; font-family: var(--font-display); font-size: 17px; font-weight: 700; margin-bottom: 18px; box-shadow: 0 6px 18px -6px rgba(217,140,3,0.35); }
.lf-process-step h5 { font-size: 15px; color: var(--navy); margin-bottom: 8px; line-height: 1.3; }
.lf-process-step p { font-size: 13px; line-height: 1.6; color: var(--ink-soft); margin: 0 0 10px; }
.lf-process-time { display:inline-block; padding: 4px 10px; background: rgba(217,140,3,0.10); color: var(--accent); border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }

/* Projects collage */
.lf-proj-tabs-wrap { display:flex; justify-content:center; margin-bottom: 40px; }
.lf-proj-tabs { display:inline-flex; justify-content:center; gap:6px; flex-wrap:wrap; padding: 6px; background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 999px; box-shadow: 0 8px 24px -16px rgba(10,22,40,0.18); }
.lf-proj-chip { display:inline-flex; align-items:center; gap:8px; padding: 10px 20px; background: transparent; border-radius: 999px; font-size: 13px; font-weight:600; color: var(--ink-soft); border: none; transition: all 0.25s var(--ease); cursor:pointer; font-family: inherit; }
.lf-proj-chip:hover { color: var(--navy); background: var(--bg-tint); }
.lf-proj-chip.active { background: var(--navy); color:#fff; box-shadow: 0 6px 16px -6px rgba(10,31,68,0.45); }
.lf-chip-dot { width:6px; height:6px; border-radius:50%; background: var(--accent); display:inline-block; }
.lf-proj-chip:not(.active) .lf-chip-dot { background: var(--ink-line); }
.lf-proj-collage { position: relative; display:grid; grid-template-columns: 1fr 1fr; grid-template-rows: 320px 320px; gap: 4px; }
.lf-proj-cell { overflow: hidden; position:relative; background: var(--bg-tint); }
.lf-proj-cell img { width:100%; height:100%; object-fit:cover; transition: transform 0.5s var(--ease); display:block; }
.lf-proj-cell:hover img { transform: scale(1.05); }
.lf-proj-tl { border-top-left-radius: 18px; }
.lf-proj-tr { border-top-right-radius: 18px; }
.lf-proj-bl { border-bottom-left-radius: 18px; }
.lf-proj-br { border-bottom-right-radius: 18px; }
.lf-proj-logo { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width: 168px; height: 168px; display:flex; align-items:center; justify-content:center; z-index:5; background:#fff; border-radius: 28px; box-shadow: 0 18px 42px -18px rgba(10,22,40,0.28), 0 2px 8px -2px rgba(10,22,40,0.08); border: 1px solid rgba(10,22,40,0.06); padding: 22px; }
.lf-proj-logo img { width: 100%; height: 100%; object-fit: contain; }

/* Testimonials */
.lf-testi-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.lf-testi { background:#fff; padding: 32px; border-radius: 14px; border: 1px solid var(--ink-line-soft); display:flex; flex-direction:column; }
.lf-testi-stars { color: #F5B400; font-size: 18px; letter-spacing: 3px; margin-bottom: 18px; }
.lf-testi p { font-size: 14.5px; line-height:1.7; color: var(--ink-soft); margin-bottom: 22px; flex:1; }
.lf-testi-divider { height:1px; background: var(--ink-line-soft); margin-bottom: 18px; }
.lf-testi-foot { display:flex; align-items:center; gap:14px; }
.lf-testi-avatar { width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0; }
.lf-testi-meta { display:flex; flex-direction:column; gap:2px; flex:1; min-width:0; }
.lf-testi-foot strong { font-size:14.5px; color: var(--navy); font-weight:700; }
.lf-testi-foot span { font-size:12.5px; color: var(--ink-mute); }

/* CTA banner */
.lf-cta { background: var(--navy); border-radius: 18px; padding: 56px; overflow:hidden; position:relative; display:grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items:center; }
.lf-cta--simple { grid-template-columns: 1fr; }
.lf-cta::before { content:''; position:absolute; right: 28%; top:50%; transform:translateY(-50%); width: 280px; height: 280px; border-radius:50%; background: var(--accent); opacity: 0.15; }
.lf-cta-text { color:#fff; position:relative; z-index:2; max-width: 620px; }
.lf-cta-text h2 { color:#fff; font-family: var(--font-display); font-size: clamp(26px, 3vw, 38px); line-height:1.15; margin-bottom: 14px; letter-spacing:-0.02em; }
.lf-cta-text p { color: rgba(255,255,255,0.75); font-size: 15px; margin-bottom: 26px; }
.lf-cta-actions { display:flex; gap:12px; flex-wrap:wrap; }

/* Feature list (used in About-style content blocks) */
.lf-feature { display:flex; gap:18px; padding: 4px 0 18px; border-bottom: 1px solid var(--ink-line-soft); margin-bottom: 16px; }
.lf-feature:last-of-type { border-bottom: none; }
.lf-feature-num { flex-shrink:0; font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--accent); line-height: 1; padding-top: 2px; min-width: 36px; }
.lf-feature h4 { font-size: 15px; color: var(--navy); margin-bottom:4px; }
.lf-feature p { font-size: 13.5px; color: var(--ink-soft); margin:0; }

/* Two-col split (text + image) */
.lf-split { display:grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items:center; }
.lf-split-img { border-radius: 14px; overflow:hidden; aspect-ratio: 4/3; }
.lf-split-img img { width:100%; height:100%; object-fit:cover; }

/* Trust strip */
.lf-trust-strip { margin-top: 48px; padding: 26px 36px; background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 12px; display:grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items:center; gap: 28px; }
.lf-trust-item strong { font-size: 13.5px; color: var(--navy); font-weight: 700; display:block; margin-bottom: 2px; }
.lf-trust-item span { font-size: 11.5px; color: var(--ink-mute); display:block; }
.lf-trust-divider { width: 1px; height: 32px; background: var(--ink-line-soft); }
@media (max-width: 900px) { .lf-trust-strip { grid-template-columns: 1fr; gap: 18px; padding: 22px 24px; } .lf-trust-divider { display:none; } }

/* FAQ */
.lf-faq-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 64px; align-items: start; }
.lf-faq-list .faq-item { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 10px; margin-bottom: 12px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.lf-faq-list .faq-item:hover { border-color: #c9d1de; }
.lf-faq-list .faq-item.open { border-color: var(--accent); box-shadow: 0 12px 28px -16px rgba(217,140,3,0.25); }
.lf-faq-list .faq-q { width: 100%; display:flex; align-items:center; justify-content:space-between; gap: 18px; padding: 20px 24px; background: transparent; border: none; cursor: pointer; text-align: left; font-family: inherit; font-size: 15px; font-weight: 600; color: var(--navy); }
.lf-faq-list .faq-icon { color: var(--accent); flex-shrink: 0; transition: transform 0.25s var(--ease); }
.lf-faq-list .faq-item.open .faq-icon { transform: rotate(45deg); }
.lf-faq-list .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.35s var(--ease); }
.lf-faq-list .faq-item.open .faq-a { max-height: 400px; }
.lf-faq-list .faq-a p { padding: 0 24px 22px; font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0; }

/* Stats strip (dark) */
.lf-stats { background: var(--navy); padding: 38px 0; }
.lf-stats-inner { display:grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items:center; gap: 36px; }
.lf-stat { display:flex; flex-direction:column; gap: 6px; }
.lf-stat strong { font-family: var(--font-display); font-size: clamp(28px, 3vw, 40px); font-weight: 700; color: #fff; line-height: 1; letter-spacing: -0.02em; }
.lf-stat strong em { font-style:normal; font-size: 0.55em; color: var(--accent); margin-left: 2px; }
.lf-stat span { font-size: 12.5px; color: rgba(255,255,255,0.65); line-height: 1.4; }
.lf-stats-divider { width: 1px; height: 42px; background: rgba(255,255,255,0.14); }

/* Support tiles */
.lf-support-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.lf-support-card { background:#fff; padding: 28px 24px; border-radius: 12px; border: 1px solid var(--ink-line-soft); transition: all 0.25s var(--ease); }
.lf-support-card:hover { transform: translateY(-3px); box-shadow: 0 18px 36px -20px rgba(10,22,40,0.18); border-color: var(--accent); }
.lf-support-meta { display:flex; align-items:center; gap: 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--ink-line-soft); }
.lf-support-meta span { font-family: var(--font-display); font-size: 14px; color: var(--accent); }
.lf-support-card h5 { font-size: 16px; color: var(--navy); margin-bottom: 8px; line-height: 1.3; }
.lf-support-card p { font-size: 13.5px; line-height: 1.65; color: var(--ink-soft); margin: 0; }

/* Contact grid */
.lf-contact-grid { display:grid; grid-template-columns: 1fr 1.1fr; gap: 56px; align-items:start; }
.lf-contact-info { display:flex; flex-direction:column; gap: 18px; margin-top: 28px; }
.lf-contact-info-item { display:flex; gap:14px; align-items:flex-start; padding: 14px 0; border-bottom: 1px solid var(--ink-line-soft); }
.lf-contact-info-item:last-child { border-bottom:none; }
.lf-contact-info-icon { width:38px; height:38px; border-radius:8px; background: rgba(217,140,3,0.12); color: var(--accent); display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
.lf-contact-info-text { display:flex; flex-direction:column; gap:2px; }
.lf-contact-info-text strong { font-size:13px; color: var(--navy); font-weight:700; }
.lf-contact-info-text a, .lf-contact-info-text span { font-size:14.5px; color: var(--ink-soft); text-decoration:none; }
.lf-form { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 18px; padding: 36px; box-shadow: 0 24px 60px -28px rgba(10,22,40,0.18); position: relative; }
.lf-form::before { content:''; position:absolute; top:0; left:0; right:0; height: 4px; background: linear-gradient(90deg, #F5C518, var(--navy)); border-top-left-radius: 18px; border-top-right-radius: 18px; }
.lf-form h3 { font-family: var(--font-display); font-size: 24px; color: var(--navy); margin-bottom: 8px; }
.lf-form > p { font-size: 13.5px; color: var(--ink-soft); margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid var(--ink-line-soft); }
.lf-form-row { display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.lf-form input, .lf-form select, .lf-form textarea { width:100%; padding: 13px 16px; border: 1px solid var(--ink-line); border-radius: 10px; background: #fff; margin-bottom: 12px; font-size: 14px; color: var(--ink); font-family: inherit; transition: all 0.2s; }
.lf-form input:focus, .lf-form select:focus, .lf-form textarea:focus { outline:none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(10,31,68,0.08); }
.lf-form textarea { resize: vertical; min-height: 90px; }
.lf-form button { margin-top: 8px; width:100%; justify-content:space-between; }

/* Footer */
.footer { background: #fff !important; color: var(--ink) !important; border-top: 1px solid var(--ink-line) !important; padding: 60px 0 24px; }
.footer-top { display:grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
.footer-brand p { color: var(--ink-soft); font-size: 14px; line-height:1.6; margin-top:12px; max-width: 320px; }
.footer-logo { height: 64px; width: auto; display: block; }
.footer-col h5 { color: var(--navy) !important; font-size: 14px; margin-bottom: 14px; }
.footer-col ul { list-style:none; padding:0; margin:0; }
.footer-col li { margin-bottom: 8px; }
.footer-col a { color: var(--ink-soft) !important; font-size: 14px; text-decoration:none; transition: color 0.2s; }
.footer-col a:hover { color: var(--accent) !important; }
.footer-bottom { color: var(--ink-mute) !important; border-top: 1px solid var(--ink-line-soft) !important; padding-top: 22px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:14px; font-size: 13px; }
.footer-bottom-links { display:flex; gap: 18px; }
.footer-bottom-links a { color: var(--ink-soft) !important; text-decoration:none; }
.footer-bottom-links a:hover { color: var(--accent) !important; }

/* Sticky mobile bar */
.lf-mobile-bar { display: none; }
@media (max-width: 760px) {
  .lf-mobile-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 60; display: grid; grid-template-columns: 1fr 1.3fr; gap: 8px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom)); background: transparent; border-top: 0; box-shadow: none; pointer-events: none; transform: translateY(120%); opacity: 0; transition: transform 0.4s var(--ease), opacity 0.3s var(--ease); }
  body.past-hero .lf-mobile-bar { transform: translateY(0); opacity: 1; }
  .lf-mobile-bar-btn { pointer-events: auto; }
  .lf-mobile-bar-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding: 13px 14px; border-radius: 999px; font-weight: 700; font-size: 14px; text-decoration: none; }
  .lf-mobile-bar-call { background: #fff; color: var(--navy) !important; border: 1.5px solid var(--ink-line); }
  .lf-mobile-bar-cta { background: var(--accent); color: #fff !important; }
  body { padding-bottom: 72px; }
}

/* Responsive */
@media (max-width: 900px) {
  .footer-top { grid-template-columns: 1fr 1fr; }
  .lf-section { padding: 60px 0; }
  .lf-svc-grid, .lf-testi-grid, .lf-support-grid { grid-template-columns: 1fr; }
  .lf-split { grid-template-columns: 1fr; gap: 36px; }
  .lf-why-collage { grid-template-columns: 1fr 1fr; }
  .lf-why-photo { grid-row: 2; grid-column: 1 / 3; height: 220px; }
  .lf-why-tl { grid-area: 1 / 1; } .lf-why-tr { grid-area: 1 / 2; }
  .lf-why-bl { grid-area: 3 / 1; } .lf-why-br { grid-area: 3 / 2; }
  .lf-process { grid-template-columns: 1fr; gap: 28px; }
  .lf-process-line { display: none; }
  .lf-proj-collage { grid-template-columns: 1fr; grid-template-rows: repeat(4, 220px); }
  .lf-proj-logo { display:none; }
  .lf-cta { padding: 36px 24px; grid-template-columns: 1fr; }
  .lf-stats-inner { grid-template-columns: 1fr 1fr; gap: 24px; }
  .lf-stats-divider { display:none; }
  .lf-faq-grid { grid-template-columns: 1fr; gap: 36px; }
  .lf-contact-grid { grid-template-columns: 1fr; gap: 36px; }
}
@media (max-width: 600px) { .footer-top { grid-template-columns: 1fr; } }
@media (max-width: 760px) {
  .wrap { padding-left: 18px !important; padding-right: 18px !important; }
  .lf-section { padding: 56px 0; }
  .lf-section-head { margin-bottom: 32px; }
  .lf-h2 { font-size: 26px; line-height: 1.2; }
  .lf-hero, .lf-hero[style] { min-height: 300px !important; height: auto !important; max-height: 56vh; }
  .lf-hero-wrap { padding-top: 110px !important; padding-bottom: 22px !important; padding-left: 18px !important; padding-right: 18px !important; }
  .lf-hero-card { padding: 18px 16px; border-radius: 12px; }
  .lf-hero-card h1 { font-size: 20px; line-height: 1.2; margin-bottom: 8px; }
  .lf-hero-card p { font-size: 13px; line-height: 1.5; margin-bottom: 0; }
  .lf-hero-card .lf-eyebrow { font-size: 10px; margin-bottom: 8px; }
  .lf-hero-card .lf-hero-actions { margin-top: 14px; }
  .lf-support-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .lf-form { padding: 24px 20px; border-radius: 14px; }
  .lf-svc-grid { gap: 16px; }
  .lf-testi-grid { display:flex; gap:14px; overflow-x:auto; scroll-snap-type:x mandatory; padding: 0 18px 12px; margin: 0 -18px; }
  .lf-testi { flex: 0 0 86%; scroll-snap-align: start; padding:24px; }
}

/* Floating call FAB, mobile only */
.lf-fab-call { display: none !important; }

/* === DEEP CONTENT BLOCKS (subpages) === */
.ab-sub { padding: 70px 0; border-top: 1px solid var(--ink-line-soft); }
.ab-sub:first-of-type { border-top: none; }
.ab-sub-head { max-width: 760px; margin-bottom: 40px; }
.ab-sub-head .lf-h2 { font-size: clamp(24px, 2.6vw, 34px); }

.ab-toc-head { text-align: center; max-width: 640px; margin: 0 auto 22px; }
.ab-toc-title { font-family: var(--font-display); font-size: clamp(20px, 2vw, 24px); font-weight: 600; color: var(--navy); letter-spacing: -0.01em; margin-bottom: 6px; }
.ab-toc-sub { font-size: 14px; color: var(--ink-soft); margin: 0; }
html { scroll-behavior: smooth; }
.ab-toc-wrap { padding: 0 0 8px; display:flex; justify-content:center; }
.ab-toc { display:inline-flex; gap: 4px; flex-wrap:wrap; justify-content:center; padding: 6px; background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 999px; box-shadow: 0 8px 24px -16px rgba(10,22,40,0.18); max-width: 100%; }
.ab-toc a { display:inline-flex; align-items:center; gap:8px; padding: 10px 20px; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--ink-soft); text-decoration: none; transition: color 0.35s var(--ease), background-color 0.35s var(--ease), box-shadow 0.35s var(--ease), transform 0.35s var(--ease); white-space: nowrap; border: none; background: transparent; letter-spacing: -0.005em; cursor: pointer; }
.ab-toc a:hover { color: var(--navy); background: var(--bg-tint); }
.ab-toc a.is-active { background: var(--navy); color: #fff; box-shadow: 0 6px 16px -6px rgba(10,31,68,0.45); transform: translateY(-1px); }

.ab-deep { display:grid; grid-template-columns: 1.1fr 1fr; gap: 56px; align-items: center; }
.ab-deep.reverse .ab-deep-img { order: -1; }
.ab-deep-img { border-radius: 18px; overflow: hidden; aspect-ratio: 4/3; box-shadow: 0 30px 70px -30px rgba(10,22,40,0.35); }
.ab-deep-img img { width:100%; height:100%; object-fit: cover; display:block; }
.ab-deep-tag { display:inline-block; padding: 6px 12px; background: rgba(217,140,3,0.10); color: var(--accent); border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px; }
.ab-deep h3 { font-family: var(--font-display); font-size: clamp(22px, 2.4vw, 30px); line-height: 1.2; color: var(--navy); margin-bottom: 14px; font-weight: 600; letter-spacing: -0.01em; }
.ab-deep > div > p { font-size: 15px; color: var(--ink-soft); line-height: 1.75; margin-bottom: 14px; }
ul.ab-checks { list-style: none; padding: 0; margin: 18px 0 0; display: grid; gap: 10px; }
ul.ab-checks li { display:flex; gap: 10px; align-items:flex-start; font-size: 14px; color: var(--ink); line-height: 1.55; }
ul.ab-checks li::before { content: '✓'; color: var(--accent); font-weight: 800; flex-shrink: 0; }
.ab-more { margin-top: 18px; border-top: 1px solid var(--ink-line-soft); padding-top: 14px; }
.ab-more > summary { cursor: pointer; list-style: none; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--accent); letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: 8px; user-select: none; }
.ab-more > summary::-webkit-details-marker { display: none; }
.ab-more > summary::after { content: '+'; font-size: 18px; line-height: 1; transition: transform .2s ease; }
.ab-more[open] > summary::after { content: '−'; }
.ab-more > summary:hover { color: var(--navy); }
.ab-more > p { margin-top: 14px; font-size: 15px; color: var(--ink-soft); line-height: 1.75; }

.ab-spec { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 14px; overflow: hidden; font-size: 14px; }
.ab-spec th, .ab-spec td { padding: 14px 18px; text-align: left; border-bottom: 1px solid var(--ink-line-soft); }
.ab-spec th { background: var(--bg-tint); font-family: var(--font-display); font-size: 13px; color: var(--navy); font-weight: 700; }
.ab-spec tr:last-child td { border-bottom: none; }
.ab-spec td:first-child { color: var(--navy); font-weight: 600; width: 38%; }
.ab-spec td:last-child { color: var(--ink-soft); }

.ab-incl { display:grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.ab-incl.ab-incl-single { grid-template-columns: minmax(0, 720px); justify-content: center; }
.ab-incl-card { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 14px; padding: 28px 26px; }
.ab-incl-card.yes { border-top: 3px solid #2ea36a; }
.ab-incl-card.no { border-top: 3px solid #c84a3a; }
.ab-incl-card h4 { font-family: var(--font-display); font-size: 16px; color: var(--navy); margin-bottom: 14px; }
.ab-incl-card ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.ab-incl-card li { font-size: 14px; color: var(--ink-soft); line-height: 1.55; padding-left: 22px; position: relative; }
.ab-incl-card.yes li::before { content: '✓'; position: absolute; left: 0; top: 0; color: #2ea36a; font-weight: 700; }
.ab-incl-card.no li::before { content: '×'; position: absolute; left: 0; top: -2px; color: #c84a3a; font-weight: 700; font-size: 18px; }

.ab-faq { display: grid; gap: 12px; max-width: 880px; margin: 0 auto; }
.ab-faq details { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 12px; transition: box-shadow 0.2s, border-color 0.2s; }
.ab-faq details[open] { border-color: var(--accent); box-shadow: 0 14px 36px -22px rgba(10,22,40,0.18); }
.ab-faq summary { list-style: none; padding: 20px 24px; cursor: pointer; font-family: var(--font-display); font-size: 15.5px; color: var(--navy); font-weight: 600; display:flex; justify-content:space-between; align-items:center; gap: 16px; }
.ab-faq summary::-webkit-details-marker { display: none; }
.ab-faq summary::after { content: '+'; font-size: 22px; color: var(--accent); font-weight: 400; }
.ab-faq details[open] summary::after { content: '−'; }
.ab-faq .ab-faq-body { padding: 0 24px 22px; font-size: 14.5px; color: var(--ink-soft); line-height: 1.7; }
.ab-faq .ab-faq-body p { margin: 0 0 10px; }

.ab-vtl { max-width: 920px; margin: 0 auto; }
.ab-vtl-row { display: grid; grid-template-columns: 60px 1fr; gap: 24px; padding: 10px 0; align-items: flex-start; position: relative; }
.ab-vtl-row::before { content:''; position:absolute; left: 28px; top: 56px; bottom: -10px; width: 2px; background: var(--ink-line); }
.ab-vtl-row:last-child::before { display: none; }
.ab-vtl-dot { width: 58px; height: 58px; border-radius: 50%; background: #fff; border: 2px solid var(--accent); color: var(--accent); display:inline-flex; align-items:center; justify-content:center; font-family: var(--font-display); font-weight: 700; font-size: 15px; box-shadow: 0 6px 18px -8px rgba(217,140,3,0.5); position: relative; z-index: 1; }
.ab-vtl-card { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 14px; padding: 22px 26px; }
.ab-vtl-meta { display:flex; gap: 14px; align-items:center; margin-bottom: 8px; flex-wrap:wrap; }
.ab-vtl-meta h4 { font-family: var(--font-display); font-size: 17px; color: var(--navy); font-weight: 600; margin: 0; }
.ab-vtl-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; background: rgba(10,31,68,0.06); color: var(--navy); }
.ab-vtl-card p { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0 0 10px; }
.ab-vtl-card ul { list-style: none; padding: 0; margin: 8px 0 0; display: grid; gap: 6px; }
.ab-vtl-card ul li { font-size: 13.5px; color: var(--ink-soft); padding-left: 18px; position: relative; line-height: 1.55; }
.ab-vtl-card ul li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-weight: 700; }

.ab-tiers { display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.ab-tier { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 16px; padding: 32px 28px; display:flex; flex-direction:column; }
.ab-tier.featured { background: var(--navy); color: #fff; border-color: var(--navy); transform: translateY(-8px); box-shadow: 0 30px 70px -30px rgba(10,22,40,0.45); }
.ab-tier-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.ab-tier.featured .ab-tier-tag { color: #F5C518; }
.ab-tier h4 { font-family: var(--font-display); font-size: 20px; margin-bottom: 8px; color: var(--navy); }
.ab-tier.featured h4 { color: #fff; }
.ab-tier-price { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.ab-tier.featured .ab-tier-price { color: #fff; }
.ab-tier-unit { font-size: 12.5px; color: var(--ink-mute); margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--ink-line-soft); }
.ab-tier.featured .ab-tier-unit { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.12); }
.ab-tier ul { list-style: none; padding: 0; margin: 0 0 22px; display: grid; gap: 10px; flex: 1; }
.ab-tier li { font-size: 13.5px; line-height: 1.55; padding-left: 22px; position: relative; color: var(--ink-soft); }
.ab-tier.featured li { color: rgba(255,255,255,0.82); }
.ab-tier li::before { content: '✓'; position: absolute; left: 0; color: var(--accent); font-weight: 700; }

.ab-flow { display:grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.ab-flow-card { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 14px; padding: 24px 20px; position: relative; }
.ab-flow-num { font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--accent); letter-spacing: 0.12em; margin-bottom: 8px; }
.ab-flow-card h5 { font-family: var(--font-display); font-size: 15px; color: var(--navy); margin-bottom: 6px; }
.ab-flow-card p { font-size: 13px; line-height: 1.55; color: var(--ink-soft); margin: 0; }

.ab-quote { max-width: 860px; margin: 0 auto; padding: 44px 36px; background: var(--bg-tint); border-left: 4px solid var(--accent); border-radius: 8px; font-family: var(--font-display); font-size: clamp(18px, 2vw, 24px); line-height: 1.5; color: var(--navy); font-weight: 500; }
.ab-quote footer { margin-top: 18px; font-family: var(--font-body); font-size: 13.5px; color: var(--ink-soft); font-weight: 500; }

.ab-coverage { display:grid; grid-template-columns: 1fr 1fr; gap: 36px; }
.ab-coverage-list { background:#fff; border: 1px solid var(--ink-line-soft); border-radius: 14px; padding: 28px; }
.ab-coverage-list h4 { font-family: var(--font-display); font-size: 16px; color: var(--navy); margin-bottom: 14px; }
.ab-coverage-cols { display:grid; grid-template-columns: 1fr 1fr; gap: 4px 18px; }
.ab-coverage-cols span { font-size: 14px; color: var(--ink-soft); padding: 6px 0; border-bottom: 1px dashed var(--ink-line-soft); }
.ab-map { background: var(--navy); border-radius: 14px; min-height: 320px; padding: 32px; color:#fff; display:flex; flex-direction:column; justify-content:flex-end; }
.ab-map h4 { font-family: var(--font-display); font-size: 20px; margin-bottom: 6px; color:#fff; }
.ab-map p { font-size: 13.5px; color: rgba(255,255,255,0.85); margin: 0; }
.ab-map--photo { background-size: cover; background-position: center; background-repeat: no-repeat; min-height: 360px; }

@media (max-width: 900px) {
  .ab-deep, .ab-deep.reverse { grid-template-columns: 1fr; gap: 28px; }
  .ab-deep.reverse .ab-deep-img { order: 0; }
  .ab-incl { grid-template-columns: 1fr; }
  .ab-tiers { grid-template-columns: 1fr; }
  .ab-tier.featured { transform: none; }
  .ab-flow { grid-template-columns: 1fr; }
  .ab-coverage { grid-template-columns: 1fr; }
  .ab-vtl-row { grid-template-columns: 46px 1fr; gap: 16px; }
  .ab-vtl-row::before { left: 22px; top: 50px; }
  .ab-vtl-dot { width: 46px; height: 46px; font-size: 13px; }
  .ab-toc-wrap { display: block; padding: 0; margin: 0 -18px; }
  .ab-toc {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;
    scroll-padding-left: 18px;
    gap: 6px;
    padding: 6px 18px;
    margin: 0;
    max-width: none;
    width: 100%;
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    justify-content: flex-start;
    scrollbar-width: none;
  }
  .ab-toc::-webkit-scrollbar { display: none; }
  .ab-toc a {
    flex: 0 0 auto;
    font-size: 13px;
    padding: 9px 16px;
    background: #fff;
    border: 1px solid var(--ink-line-soft);
    box-shadow: 0 4px 12px -8px rgba(10,22,40,0.18);
    scroll-snap-align: start;
  }
  .ab-toc a.is-active { background: var(--navy); color: #fff; border-color: var(--navy); }
}

/* =====================================================================
   Minimal polish — Google reviews badge + nav fix.
   (Extensive design layer removed at user request — andere designer
    werkt morgen verder.)
   ===================================================================== */

:root {
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --shadow-sm: 0 4px 12px -4px rgba(10,22,40,0.08);
  --shadow-md: 0 14px 32px -14px rgba(10,22,40,0.18);
}

/* Nav: solid white, no logo edge bleed on Over/Diensten */
.lf-nav-inner {
  background: #ffffff !important;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.lf-nav.scrolled .lf-nav-inner { background: #ffffff !important; }

/* Reveal animations (kept — needed for count-up + section reveals) */
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s var(--ease-out-quart), transform 0.7s var(--ease-out-quart);
}
[data-reveal].revealed { opacity: 1; transform: translateY(0); }
[data-reveal-delay="1"] { transition-delay: 0.08s; }
[data-reveal-delay="2"] { transition-delay: 0.16s; }
[data-reveal-delay="3"] { transition-delay: 0.24s; }
[data-reveal-delay="4"] { transition-delay: 0.32s; }
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}

/* Skill bars animate to their width on reveal */
.lf-bar-track i { transition: width 1.2s var(--ease-out-quart); }
[data-reveal] .lf-bar-track i { width: 0 !important; }
[data-reveal].revealed .lf-bar-track i { width: var(--bar-w, 100%) !important; }

/* =====================================================================
   GOOGLE REVIEWS BADGE — single, clean pill under hero
   ===================================================================== */
.lf-hero-trust { padding: 28px 0 8px; }
.lf-hero-trust-row { display: flex; justify-content: center; }
.lf-google-badge {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px 12px 16px;
  background: #ffffff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 999px;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s var(--ease-out-quart), box-shadow 0.3s var(--ease-out-quart);
}
.lf-google-badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.lf-google-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(10,22,40,0.08);
  flex-shrink: 0;
}
.lf-google-meta { display: inline-flex; flex-direction: column; line-height: 1.1; }
.lf-google-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.lf-google-rating .lf-count {
  font-family: var(--font-display, inherit);
  font-size: 20px;
  font-weight: 700;
  color: var(--navy, #0a1628);
  letter-spacing: -0.01em;
}
.lf-google-star-row { display: inline-flex; gap: 1px; }
.lf-google-star-row svg { display: block; }
.lf-google-sub {
  margin-top: 3px;
  font-size: 11.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-soft, #5a6275);
  font-weight: 600;
}
@media (max-width: 480px) {
  .lf-google-badge { padding: 10px 16px 10px 12px; gap: 10px; }
  .lf-google-rating .lf-count { font-size: 18px; }
}

/* =====================================================================
   MOBILE: cards-in-your-face — horizontal scroll-snap on stat grid
   Vertical scroll on the page; on mobile this section becomes a
   horizontal snapping rail so cards arrive one by one.
   ===================================================================== */
html { scroll-behavior: smooth; }

@media (max-width: 760px) {
  .lf-stats-pin {
    margin: 0 -18px;
    padding: 6px 0 18px;
    -webkit-overflow-scrolling: touch;
  }
  .lf-stats-pin .lf-stats-grid {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 78%;
    grid-template-columns: none !important;
    gap: 14px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 18px;
    padding: 4px 18px 16px;
    scrollbar-width: none;
  }
  .lf-stats-pin .lf-stats-grid::-webkit-scrollbar { display: none; }
  .lf-stats-pin .lf-stat-card {
    scroll-snap-align: center;
    scroll-snap-stop: always;
    opacity: 0.55;
    transform: scale(0.94);
    transition: opacity 0.45s var(--ease-out-quart), transform 0.45s var(--ease-out-quart);
  }
  .lf-stats-pin .lf-stat-card.in-view {
    opacity: 1;
    transform: scale(1);
  }
}

/* ── Hero centered + cinematic intro animation ─────────────── */
.lf-hero-card.lf-hero-card--center {
  margin: 0 auto;
  text-align: center;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: 0;
  box-shadow: none;
  padding: 0;
  width: min(720px, 100%);
}
.lf-hero-card.lf-hero-card--center h1 {
  font-size: clamp(28px, 4.4vw, 56px);
  line-height: 1.08;
  color: #fff;
  text-shadow: none;
  margin: 0 0 4px;
}
.lf-hero-card.lf-hero-card--center h1 + h1 { margin-top: 2px; }
.lf-hero-card.lf-hero-card--center p {
  color: rgba(255,255,255,0.86);
  margin: 18px auto 26px;
  max-width: 520px;
  font-size: 15px;
}
.lf-hero-card.lf-hero-card--center .lf-hero-actions { justify-content: center; }
.lf-hero-link {
  color: #fff; font-size: 14px; font-weight: 600;
  text-decoration: none; opacity: 0.92;
  border-bottom: 1px solid rgba(255,255,255,0.35);
  padding-bottom: 2px;
  transition: opacity 0.25s var(--ease-out-quart), border-color 0.25s var(--ease-out-quart);
}
.lf-hero-link:hover { opacity: 1; border-color: #fff; }
.lf-hero-bg::after {
  background: radial-gradient(ellipse at center, rgba(10,22,40,0.45) 0%, rgba(10,22,40,0.78) 75%) !important;
}
[data-hero-line] { opacity: 0; transform: translateY(18px); filter: blur(6px); }
[data-hero-anim].played [data-hero-line] { animation: lf-hero-rise 1.05s var(--ease-out-quart) both; }
[data-hero-anim].played [data-hero-line][data-hero-delay="1"] { animation-delay: 0.12s; }
[data-hero-anim].played [data-hero-line][data-hero-delay="2"] { animation-delay: 0.24s; }
[data-hero-anim].played [data-hero-line][data-hero-delay="3"] { animation-delay: 0.46s; }
[data-hero-anim].played [data-hero-line][data-hero-delay="4"] { animation-delay: 0.62s; }
[data-hero-anim].played [data-hero-line][data-hero-delay="5"] { animation-delay: 0.95s; }
@keyframes lf-hero-rise {
  0%   { opacity: 0; transform: translateY(18px); filter: blur(6px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.lf-hero-scroll {
  margin-top: 38px; display: inline-flex; flex-direction: column;
  align-items: center; gap: 10px; font-size: 10px;
  letter-spacing: 0.32em; color: rgba(255,255,255,0.55); font-weight: 600;
}
.lf-hero-scroll i {
  display:block; width:1px; height:36px;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0));
  background-size: 100% 200%;
  animation: lf-scroll-pulse 2.2s ease-in-out infinite;
}
@keyframes lf-scroll-pulse {
  0%   { background-position: 0 -100%; }
  100% { background-position: 0 100%; }
}
.lf-hero { justify-content: center; }
.lf-hero-wrap { display: flex !important; justify-content: center; align-items: center; }
@media (max-width: 760px) {
  .lf-hero-card.lf-hero-card--center h1 { font-size: 30px; }
  .lf-hero-card.lf-hero-card--center p { font-size: 14px; }
  .lf-hero-scroll { margin-top: 28px; }
}
@media (prefers-reduced-motion: reduce) {
  [data-hero-line] { opacity: 1 !important; transform: none !important; filter: none !important; animation: none !important; }
}

/* Hero slideshow — cinematic crossfade + Ken Burns */
.lf-hero-bg--slides { position: absolute; inset: 0; overflow: hidden; }
.lf-hero-bg--slides img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.12);
  transform-origin: center center;
  transition: opacity 1.8s cubic-bezier(0.22,1,0.36,1);
  will-change: opacity, transform;
}
.lf-hero-bg--slides img.is-active {
  opacity: 1;
  animation: lf-hero-kenburns 9s ease-out forwards;
}
@keyframes lf-hero-kenburns {
  0%   { transform: scale(1.12) translate3d(0, 0, 0); }
  100% { transform: scale(1.0)  translate3d(-1.5%, -1%, 0); }
}

/* Hero arrows */
.lf-hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.28);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .25s ease, transform .25s ease, border-color .25s ease;
}
.lf-hero-arrow:hover { background: rgba(255,255,255,0.26); border-color: rgba(255,255,255,0.5); transform: translateY(-50%) scale(1.06); }
.lf-hero-arrow:active { transform: translateY(-50%) scale(.95); }
.lf-hero-arrow--prev { left: clamp(16px, 3vw, 36px); }
.lf-hero-arrow--next { right: clamp(16px, 3vw, 36px); }
@media (max-width: 760px) {
  .lf-hero-arrow { width: 42px; height: 42px; }
}

/* Hero dots */
.lf-hero-dots {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(10,15,28,0.28);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.14);
}
.lf-hero-dot {
  appearance: none;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  width: 28px;
  height: 4px;
  border-radius: 999px;
  position: relative;
  overflow: hidden;
  display: inline-block;
}
.lf-hero-dot::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.35);
  border-radius: inherit;
}
.lf-hero-dot span {
  position: absolute;
  inset: 0;
  background: #fff;
  border-radius: inherit;
  transform: scaleX(0);
  transform-origin: left center;
}
.lf-hero-dot.is-active { width: 56px; }
.lf-hero-dot.is-active span {
  animation: lf-hero-dot-fill 7s linear forwards;
}
@keyframes lf-hero-dot-fill {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}


/* Inline Google reviews link under testimonials title */
.lf-google-inline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.lf-google-inline:hover { border-color: var(--accent); transform: translateY(-1px); }
.lf-google-inline svg { flex-shrink: 0; }

/* Sequential scroll-activated reveal for why-tiles */
[data-why-step] {
  opacity: 0.45;
  transform: translateY(14px);
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
}
[data-why-step].is-revealed {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  [data-why-step] { opacity: 1 !important; transform: none !important; }
}

/* ── Hero typography upgrade — Apple-like display weight & tracking ── */
.lf-hero-card.lf-hero-card--center h1 {
  font-family: var(--font-display);
  font-size: clamp(34px, 5.4vw, 68px) !important;
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.02;
  color: #fff;
  text-shadow: none;
  text-wrap: balance;
}
.lf-hero-card.lf-hero-card--center p {
  font-size: clamp(15px, 1.2vw, 18px);
  color: rgba(255,255,255,0.88);
  max-width: 560px;
  margin: 22px auto 32px;
  line-height: 1.55;
  font-weight: 400;
}
.lf-hero-card.lf-hero-card--center .lf-cta-pill {
  padding: 16px 32px;
  font-size: 13px;
  letter-spacing: 0.06em;
}
.lf-hero-card.lf-hero-card--center .lf-hero-link {
  font-size: 14px;
  margin-left: 6px;
}
.lf-hero-bg--slides + * { /* nothing — placeholder */ }
.lf-hero-bg::after,
.lf-hero-bg--slides::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at center, rgba(10,15,28,0.40) 0%, rgba(10,15,28,0.78) 80%) !important;
  z-index: 1;
}
.lf-hero-bg--slides img { z-index: 0; }

/* ── Google inline pill ── */
.lf-google-inline { white-space: nowrap; }
.lf-google-inline span { letter-spacing: 0.02em; }


/* ── Testimonial marquee — auto-scroll, pause on hover ── */
.lf-testi-marquee {
  position: relative;
  overflow: hidden;
  margin: 0 calc(50% - 50vw);
  padding: 8px 0 24px;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.lf-testi-track {
  display: flex;
  gap: 24px;
  width: max-content;
  padding: 0 24px;
  animation: lf-testi-scroll 60s linear infinite;
}
.lf-testi-marquee:hover .lf-testi-track,
.lf-testi-marquee:focus-within .lf-testi-track {
  animation-play-state: paused;
}
@keyframes lf-testi-scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
.lf-testi-marquee .lf-testi {
  flex: 0 0 380px;
  margin: 0;
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  border-radius: 16px;
  padding: 28px 28px 22px;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s var(--ease);
}
.lf-testi-marquee .lf-testi:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 50px -22px rgba(10,22,40,0.20);
  border-color: var(--accent);
}
@media (max-width: 760px) {
  .lf-testi-marquee .lf-testi { flex-basis: 78vw; padding: 22px; }
  .lf-testi-track { animation-duration: 50s; }
}
@media (prefers-reduced-motion: reduce) {
  .lf-testi-track { animation: none; }
}

/* Blog cards (used on /blog and /blog/:slug as well as homepage) */
.lf-blog-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.lf-blog-card { display:flex; flex-direction:column; background:#fff; border-radius: 14px; overflow:hidden; border: 1px solid var(--ink-line-soft); transition: all 0.3s var(--ease); color: var(--ink); text-decoration: none; }
.lf-blog-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(10,22,40,0.18); border-color: var(--accent); }
.lf-blog-img { position:relative; aspect-ratio: 16/10; overflow:hidden; }
.lf-blog-img img { width:100%; height:100%; object-fit:cover; transition: transform 0.6s var(--ease); }
.lf-blog-card:hover .lf-blog-img img { transform: scale(1.05); }
.lf-blog-tag { position:absolute; top:14px; left:14px; padding: 6px 12px; background: var(--accent); color:#fff; border-radius: 4px; font-size:10.5px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; }
.lf-blog-date-badge { position:absolute; right:14px; bottom:14px; min-width:54px; padding: 8px 10px; background:#fff; border-radius:8px; box-shadow: 0 8px 20px -8px rgba(10,22,40,0.25); display:flex; flex-direction:column; align-items:center; line-height:1; }
.lf-blog-date-badge strong { font-family: var(--font-display); font-size: 18px; color: var(--navy); font-weight: 700; }
.lf-blog-date-badge em { font-style:normal; font-size: 10.5px; color: var(--ink-mute); text-transform:uppercase; letter-spacing:0.08em; margin-top:3px; font-weight:600; }
.lf-blog-body { padding: 24px; display:flex; flex-direction:column; gap:10px; }
.lf-blog-body h4 { font-size: 18px; line-height:1.35; color: var(--navy); }
.lf-blog-body h4 a { color: inherit; transition: color 0.2s; }
.lf-blog-body h4 a:hover { color: var(--accent); }
.lf-blog-body p { font-size: 14px; line-height:1.65; color: var(--ink-soft); margin-bottom: 6px; }
.lf-blog-foot { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top: 6px; padding-top: 14px; border-top: 1px solid var(--ink-line-soft); }
.lf-blog-btn { display:inline-flex; align-items:center; gap:8px; padding: 10px 18px; background: #d98c03; color:#fff !important; border-radius: 999px; font-size: 12.5px; font-weight: 700; letter-spacing:0.04em; text-transform:uppercase; transition: background 0.2s, transform 0.2s; }
.lf-blog-btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
.lf-blog-author { display:inline-flex; align-items:center; gap:6px; font-size:13px; color: var(--ink-soft); font-weight:500; }
.lf-blog-author svg { color: var(--accent); }
@media (max-width: 1100px) { .lf-blog-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 720px) { .lf-blog-grid { grid-template-columns: 1fr; gap: 22px; } }
`;

