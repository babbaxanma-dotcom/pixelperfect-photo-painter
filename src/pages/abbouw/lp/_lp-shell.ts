// Gedeelde stijling voor Google-Ads landing pages onder /lp/*.
// Editorial / Recotex-stijl conversion-pagina: één duidelijk doel = lead.
// Geen nav, geen footer-navigatie, alleen sticky bel + offerte CTA.

export const LP_STYLE = `
:root {
  --lp-navy: #0a1628;
  --lp-accent: #d98c03;
  --lp-accent-hover: #b87502;
  --lp-ink: #0f1115;
  --lp-ink-soft: #4a5061;
  --lp-ink-mute: #7a8090;
  --lp-line: #e4e5e7;
  --lp-line-soft: #f0f1f3;
  --lp-bg: #fafaf8;
  --lp-bg-soft: #f4f4f0;
  --lp-display: 'Bricolage Grotesque', system-ui, sans-serif;
  --lp-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  --lp-serif: 'Instrument Serif', serif;
}

html, body { background: #fff; margin: 0; padding: 0; }
body.lp-page { font-family: var(--lp-body); color: var(--lp-ink); -webkit-font-smoothing: antialiased; line-height: 1.6; }
body.lp-page * { box-sizing: border-box; }
body.lp-page img { max-width: 100%; display: block; }

/* Sticky bottom CTA bar */
.lp-bottom-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 60;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--lp-line);
  box-shadow: 0 -8px 24px -8px rgba(10,22,40,0.10);
  pointer-events: auto;
}
.lp-bb-call, .lp-bb-cta {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 16px;
  border-radius: 12px;
  font-family: var(--lp-body);
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  letter-spacing: -0.005em;
  transition: transform .15s ease;
}
.lp-bb-call { background: var(--lp-navy); color: #fff; }
.lp-bb-cta { background: var(--lp-accent); color: #fff; }
.lp-bb-cta:hover, .lp-bb-call:hover { transform: translateY(-1px); }
@media (min-width: 901px) {
  .lp-bottom-bar { display: none; }
}

/* ── HERO ── */
.lp-hero {
  position: relative;
  min-height: 100vh; min-height: 100svh;
  background: var(--lp-navy);
  color: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.lp-hero-bg { position: absolute; inset: 0; z-index: 0; }
.lp-hero-bg img { width: 100%; height: 100%; object-fit: cover; }
.lp-hero-bg::after {
  content: '';
  position: absolute; inset: 0;
  background:
    linear-gradient(110deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.72) 45%, rgba(10,22,40,0.25) 100%),
    linear-gradient(180deg, rgba(10,22,40,0.30) 0%, rgba(10,22,40,0.60) 100%);
}
.lp-hero-wrap {
  position: relative; z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 88px clamp(20px, 6vw, 64px) 64px;
  width: 100%;
}
.lp-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.22);
  backdrop-filter: blur(8px);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 22px;
}
.lp-hero-tag::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: var(--lp-accent);
  box-shadow: 0 0 0 4px rgba(217,140,3,0.25);
}
.lp-hero h1 {
  font-family: var(--lp-display);
  font-size: clamp(34px, 5.4vw, 72px);
  line-height: 1.02;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0 0 22px;
  max-width: 920px;
}
.lp-hero h1 em {
  font-family: var(--lp-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--lp-accent);
  margin-right: 4px;
}
.lp-hero-lede {
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.55;
  color: rgba(255,255,255,0.85);
  max-width: 620px;
  margin: 0 0 32px;
}
.lp-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.lp-btn-primary, .lp-btn-secondary, .lp-btn-light {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 16px 28px;
  border-radius: 999px;
  font-family: var(--lp-body);
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  letter-spacing: -0.005em;
  transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .25s ease, background .2s ease;
  cursor: pointer;
  border: none;
  white-space: nowrap;
}
.lp-btn-primary {
  background: var(--lp-accent); color: #fff;
  box-shadow: 0 12px 28px -8px rgba(217,140,3,0.55);
}
.lp-btn-primary:hover { background: var(--lp-accent-hover); transform: translateY(-2px); box-shadow: 0 18px 36px -10px rgba(217,140,3,0.65); }
.lp-btn-secondary { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.40); }
.lp-btn-secondary:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.70); }
.lp-btn-light { background: #fff; color: var(--lp-navy); }
.lp-btn-light:hover { background: #fff; transform: translateY(-1px); box-shadow: 0 12px 28px -8px rgba(10,22,40,0.30); }

/* Inline trust badge in hero */
.lp-hero-trust {
  display: flex; flex-wrap: wrap; gap: 22px; align-items: center;
  margin-top: 36px;
  font-size: 13px; color: rgba(255,255,255,0.78);
}
.lp-hero-trust > div { display: inline-flex; align-items: center; gap: 9px; }
.lp-hero-trust strong { color: #fff; font-weight: 600; font-size: 14px; }
.lp-hero-stars { color: var(--lp-accent); font-size: 14px; letter-spacing: 1px; }

@media (max-width: 720px) {
  .lp-hero-wrap { padding: 72px 20px 48px; }
  .lp-hero-actions { flex-direction: column; align-items: stretch; }
  .lp-btn-primary, .lp-btn-secondary { width: 100%; }
}

/* ── STATS STRIP ── */
.lp-stats {
  background: #fff;
  padding: 60px 0;
  border-bottom: 1px solid var(--lp-line-soft);
}
.lp-stats-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(20px, 6vw, 64px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 36px;
}
.lp-stat { position: relative; padding-left: 18px; }
.lp-stat::before {
  content: ''; position: absolute; left: 0; top: 4px; bottom: 8px;
  width: 3px; background: var(--lp-accent);
}
.lp-stat-num {
  font-family: var(--lp-display);
  font-size: clamp(34px, 3.6vw, 48px);
  font-weight: 700;
  color: var(--lp-navy);
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 6px;
}
.lp-stat-label {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--lp-ink-soft);
  line-height: 1.45;
}
@media (max-width: 900px) {
  .lp-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 28px 20px; }
}

/* ── SECTION (generic) ── */
.lp-section { padding: 90px 0; background: #fff; }
.lp-section.alt { background: var(--lp-bg-soft); }
.lp-section.dark { background: var(--lp-navy); color: #fff; }
.lp-section-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(20px, 6vw, 64px);
}
.lp-eyebrow {
  display: inline-block;
  font-family: var(--lp-body);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--lp-accent);
  margin-bottom: 14px;
  position: relative;
  padding-left: 32px;
}
.lp-eyebrow::before {
  content: ''; position: absolute; left: 0; top: 50%;
  width: 22px; height: 1px; background: var(--lp-accent);
}
.lp-section h2 {
  font-family: var(--lp-display);
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.022em;
  color: var(--lp-navy);
  margin: 0 0 18px;
  max-width: 760px;
}
.lp-section.dark h2 { color: #fff; }
.lp-section h2 em {
  font-family: var(--lp-serif); font-style: italic; font-weight: 400;
  color: var(--lp-accent);
}
.lp-section-lede {
  font-size: clamp(15.5px, 1.2vw, 18px);
  line-height: 1.6;
  color: var(--lp-ink-soft);
  max-width: 680px;
  margin: 0 0 48px;
}
.lp-section.dark .lp-section-lede { color: rgba(255,255,255,0.78); }

/* ── BENEFITS (2-col text + visual) ── */
.lp-benefits {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 64px;
  align-items: center;
}
.lp-benefits-list { list-style: none; padding: 0; margin: 0 0 28px; }
.lp-benefits-list li {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--lp-line-soft);
  font-size: 16px;
  line-height: 1.5;
  color: var(--lp-ink);
}
.lp-benefits-list li::before {
  content: ''; flex-shrink: 0;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--lp-accent);
  margin-top: 2px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: center;
}
.lp-benefits-list li strong { display: block; font-weight: 700; color: var(--lp-navy); margin-bottom: 2px; }
.lp-benefits-visual {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: 4px;
  overflow: hidden;
}
.lp-benefits-visual img { width: 100%; height: 100%; object-fit: cover; }
.lp-benefits-visual::after {
  content: ''; position: absolute; inset: 0;
  border: 1px solid rgba(15,17,21,0.08);
  pointer-events: none;
}
@media (max-width: 900px) {
  .lp-benefits { grid-template-columns: 1fr; gap: 40px; }
  .lp-benefits-visual { aspect-ratio: 4/3; }
}

/* ── URGENCY CARDS (3-up) ── */
.lp-urgency-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.lp-urgency-card {
  background: #fff;
  border: 1px solid var(--lp-line);
  padding: 32px 28px;
  position: relative;
  transition: border-color .25s ease, transform .25s ease;
}
.lp-urgency-card:hover { border-color: var(--lp-accent); transform: translateY(-2px); }
.lp-urgency-num {
  font-family: var(--lp-serif);
  font-style: italic;
  font-size: 36px;
  color: var(--lp-accent);
  line-height: 1;
  margin-bottom: 18px;
}
.lp-urgency-card h4 {
  font-family: var(--lp-display);
  font-size: 19px;
  font-weight: 700;
  color: var(--lp-navy);
  margin: 0 0 10px;
  letter-spacing: -0.01em;
}
.lp-urgency-card p {
  font-size: 14.5px;
  color: var(--lp-ink-soft);
  line-height: 1.55;
  margin: 0;
}
@media (max-width: 900px) { .lp-urgency-grid { grid-template-columns: 1fr; gap: 14px; } }

/* ── PROCESS / SPEED ── */
.lp-process {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.lp-process-points { display: flex; flex-direction: column; gap: 24px; margin-top: 8px; }
.lp-process-point {
  display: flex; align-items: flex-start; gap: 18px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--lp-line-soft);
}
.lp-process-point:last-child { border-bottom: none; }
.lp-process-point-num {
  font-family: var(--lp-serif);
  font-style: italic;
  font-size: 36px;
  color: var(--lp-accent);
  line-height: 1;
  flex-shrink: 0;
  width: 56px;
}
.lp-process-point-body strong {
  display: block;
  font-family: var(--lp-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--lp-navy);
  margin-bottom: 6px;
}
.lp-process-point-body p { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--lp-ink-soft); }
.lp-process-img {
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 4px;
}
.lp-process-img img { width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 900px) {
  .lp-process { grid-template-columns: 1fr; gap: 36px; }
  .lp-process-img { aspect-ratio: 16/10; order: -1; }
}

/* ── GALLERY ── */
.lp-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.lp-gallery-cell {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 4px;
}
.lp-gallery-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.22,1,.36,1); }
.lp-gallery-cell:hover img { transform: scale(1.06); }
.lp-gallery-cell::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(10,22,40,0.85) 100%);
  pointer-events: none;
}
.lp-gallery-cap {
  position: absolute; left: 18px; bottom: 16px; right: 18px;
  z-index: 2;
  color: #fff;
}
.lp-gallery-cap small {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.78);
  margin-bottom: 4px;
}
.lp-gallery-cap strong { display: block; font-family: var(--lp-display); font-size: 17px; font-weight: 600; }
@media (max-width: 900px) { .lp-gallery { grid-template-columns: 1fr 1fr; } }
@media (max-width: 540px) { .lp-gallery { grid-template-columns: 1fr; } }

/* ── EXPERT QUOTE ── */
.lp-expert {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 64px;
  align-items: center;
}
.lp-expert-img {
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  max-width: 380px;
}
.lp-expert-img img { width: 100%; height: 100%; object-fit: cover; }
.lp-expert-quote {
  font-family: var(--lp-serif);
  font-size: clamp(22px, 2.4vw, 30px);
  font-style: italic;
  line-height: 1.35;
  color: var(--lp-navy);
  margin: 0 0 28px;
  position: relative;
  padding-left: 24px;
}
.lp-expert-quote::before {
  content: ''; position: absolute; left: 0; top: 4px; bottom: 4px;
  width: 3px; background: var(--lp-accent);
}
.lp-expert-name { font-family: var(--lp-display); font-size: 17px; font-weight: 700; color: var(--lp-navy); margin-bottom: 2px; }
.lp-expert-role { font-size: 13.5px; color: var(--lp-ink-mute); margin-bottom: 22px; }
@media (max-width: 900px) {
  .lp-expert { grid-template-columns: 1fr; gap: 32px; }
  .lp-expert-img { max-width: 220px; }
}

/* ── REVIEWS ── */
.lp-reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 8px;
}
.lp-review-card {
  background: #fff;
  border: 1px solid var(--lp-line);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lp-review-stars { color: var(--lp-accent); font-size: 15px; letter-spacing: 2px; }
.lp-review-text { font-size: 15px; line-height: 1.55; color: var(--lp-ink); margin: 0; }
.lp-review-author { display: flex; align-items: center; gap: 12px; margin-top: auto; }
.lp-review-author-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--lp-bg-soft); display: inline-flex; align-items: center; justify-content: center; font-weight: 700; color: var(--lp-navy); font-size: 15px; }
.lp-review-author-info { font-size: 13px; }
.lp-review-author-info strong { display: block; color: var(--lp-navy); font-size: 14px; }
.lp-review-author-info span { color: var(--lp-ink-mute); }
@media (max-width: 900px) { .lp-reviews-grid { grid-template-columns: 1fr; } }

/* ── FAQ ── */
.lp-faq { max-width: 820px; margin: 0 auto; }
.lp-faq details {
  border-bottom: 1px solid var(--lp-line);
  padding: 22px 0;
}
.lp-faq summary {
  list-style: none;
  cursor: pointer;
  font-family: var(--lp-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--lp-navy);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.lp-faq summary::-webkit-details-marker { display: none; }
.lp-faq summary::after {
  content: '+';
  font-family: var(--lp-serif);
  font-weight: 400;
  font-size: 28px;
  color: var(--lp-accent);
  line-height: 0.7;
  flex-shrink: 0;
  transition: transform .2s ease;
}
.lp-faq details[open] summary::after { content: '–'; }
.lp-faq details p {
  margin: 12px 0 0;
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--lp-ink-soft);
}

/* ── FORM SECTION ── */
.lp-form-section {
  background: var(--lp-navy);
  color: #fff;
}
.lp-form-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 64px;
  align-items: start;
}
.lp-form-section h2 { color: #fff; }
.lp-form-section .lp-eyebrow { color: var(--lp-accent); }
.lp-form-side p {
  color: rgba(255,255,255,0.82);
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 22px;
}
.lp-form-side ul {
  list-style: none; padding: 0; margin: 24px 0 0;
}
.lp-form-side ul li {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  font-size: 14.5px;
  color: rgba(255,255,255,0.85);
  display: flex; align-items: center; gap: 12px;
}
.lp-form-side ul li::before {
  content: ''; width: 18px; height: 18px; border-radius: 50%;
  background: var(--lp-accent);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
  background-size: 12px;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
}
.lp-form-card {
  background: #fff;
  color: var(--lp-ink);
  padding: 40px 36px;
  border-radius: 4px;
}
.lp-form-card h3 {
  font-family: var(--lp-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--lp-navy);
  margin: 0 0 8px;
  letter-spacing: -0.015em;
}
.lp-form-card .lp-form-sub {
  font-size: 14.5px;
  color: var(--lp-ink-soft);
  margin: 0 0 24px;
}
.lp-form-card form { display: flex; flex-direction: column; gap: 12px; }
.lp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.lp-form-card input, .lp-form-card textarea {
  font: inherit;
  font-size: 16px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--lp-line);
  border-radius: 10px;
  background: #fff;
  color: var(--lp-ink);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.lp-form-card input:focus, .lp-form-card textarea:focus {
  outline: none;
  border-color: var(--lp-accent);
  box-shadow: 0 0 0 3px rgba(217,140,3,0.14);
}
.lp-form-card textarea { min-height: 110px; resize: vertical; }
.lp-form-card button[type="submit"] {
  margin-top: 4px;
  padding: 16px 22px;
  background: var(--lp-accent);
  color: #fff;
  border: none;
  border-radius: 999px;
  font: inherit;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background .2s ease, transform .15s ease;
}
.lp-form-card button[type="submit"]:hover { background: var(--lp-accent-hover); transform: translateY(-1px); }
.lp-form-card button[type="submit"]:disabled { opacity: 0.6; cursor: wait; }
.lp-form-foot { margin-top: 14px; font-size: 12.5px; color: var(--lp-ink-mute); }
.lp-form-foot a { color: var(--lp-accent); }
.lp-form-error {
  display: none;
  margin-top: 12px; padding: 12px 14px;
  background: #fdecea; border: 1px solid rgba(179,38,30,0.22);
  border-radius: 10px;
  color: #b3261e; font-size: 14px;
}
.lp-form-card.is-error .lp-form-error { display: block; }
.lp-form-thanks {
  display: none; padding: 28px;
  text-align: center;
}
.lp-form-card.is-success .lp-form-thanks { display: block; }
.lp-form-card.is-success form { display: none; }
.lp-form-thanks-icon {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: var(--lp-accent);
  color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.lp-form-thanks h3 { color: var(--lp-navy); margin: 0 0 8px; }
.lp-form-thanks p { color: var(--lp-ink-soft); margin: 0; }
@media (max-width: 900px) {
  .lp-form-grid { grid-template-columns: 1fr; gap: 36px; }
  .lp-form-card { padding: 28px 22px; }
  .lp-form-row { grid-template-columns: 1fr; }
}

/* ── FINAL TRUST FOOTER ── */
.lp-trust-foot {
  padding: 56px 0 100px;
  background: #fff;
  border-top: 1px solid var(--lp-line-soft);
  font-size: 13px;
  color: var(--lp-ink-mute);
}
.lp-trust-foot-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(20px, 6vw, 64px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  align-items: start;
}
.lp-trust-foot strong { display: block; color: var(--lp-navy); font-size: 14px; margin-bottom: 4px; }
.lp-trust-foot a { color: var(--lp-ink-soft); text-decoration: none; }
.lp-trust-foot a:hover { color: var(--lp-accent); }
@media (max-width: 900px) {
  .lp-trust-foot-grid { grid-template-columns: 1fr 1fr; gap: 22px; }
}

/* ── SECTION SPACING REDUCTION ON MOBILE ── */
@media (max-width: 720px) {
  .lp-section { padding: 60px 0; }
  .lp-stats { padding: 40px 0; }
}

/* ── REVEAL on scroll (lightweight, geen lib) ── */
.lp-reveal { opacity: 0; transform: translateY(20px); transition: opacity .55s ease, transform .55s cubic-bezier(.22,1,.36,1); }
.lp-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .lp-reveal { opacity: 1; transform: none; transition: none; } }
`;

/** Sticky mobile bottom-bar (call + offerte). Niet getoond op desktop. */
export const lpStickyBar = (phone: string, offerLabel = 'Vraag offerte') => `
<div class="lp-bottom-bar">
  <a href="tel:${phone.replace(/\\s/g, '')}" class="lp-bb-call" aria-label="Bel direct">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    <span>Bel direct</span>
  </a>
  <a href="#lp-form" class="lp-bb-cta" data-lp-smooth>
    <span>${offerLabel}</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </a>
</div>
`;

/** Trust-footer onderaan elke LP. */
export const lpTrustFoot = `
<section class="lp-trust-foot">
  <div class="lp-trust-foot-grid">
    <div>
      <strong>AB Bouw Groep</strong>
      Industrieweg 14<br/>2830 Willebroek
    </div>
    <div>
      <strong>Telefoon</strong>
      <a href="tel:+32470634413">+32 470 63 44 13</a>
    </div>
    <div>
      <strong>Email</strong>
      <a href="mailto:info@abgroep.be">info@abgroep.be</a>
    </div>
    <div>
      <strong>Erkenningen</strong>
      VCA*-gecertificeerd<br/>Lid Bouwunie
    </div>
  </div>
</section>
`;
