import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildHero, SHELL_STYLE } from '../_shell';
import { submitLead } from '@/lib/leads';

import heroBg from '@/assets/dak/intro-overview.jpg';
import imgBenefits from '@/assets/dak/dakisolatie.jpg';
import imgProcess from '@/assets/home/vakman-dak.jpg';
import g1 from '@/assets/dak/hellend-pannen.jpg';
import g2 from '@/assets/dak/leien.jpg';
import g3 from '@/assets/dak/plat-epdm.jpg';
import g4 from '@/assets/dak/zinkwerk.jpg';
import expertImg from '@/assets/home/team1.jpg';

// LP-specifieke aanvullingen op SHELL_STYLE. Hergebruikt ALLE bestaande
// `.lf-*` klassen van de subpages voor 100% stijl-consistentie.
const LP_EXTRA = `
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
`;

const HTML = `
${buildHero({
  bg: heroBg,
  eyebrow: 'AB Dakwerken · Willebroek',
  title: 'Nieuw dak.<br/>Vaste prijs. <span class="ab-mark">Eigen dakdekkers</span>.',
  lede: 'Volledige dakvervanging, dakisolatie en zinkwerk in Mechelen, Antwerpen, Lier en heel Vlaanderen. Gratis plaatsbezoek binnen 5 werkdagen, bindende offerte met fotorapport, 10 jaar garantie op waterdichtheid.',
  primary: { label: 'Gratis dakinspectie aanvragen', href: '#lp-form' },
  secondary: { label: 'Bel +32 470 63 44 13 →', href: 'tel:+32470634413' },
})}

<section class="lf-section" style="padding: 0;">
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
        <img src="${g1}" alt="Pannendak Mechelen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Hellend dak</small><strong>Pannendak — Mechelen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="1">
        <img src="${g2}" alt="Natuurleien Antwerpen" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Hellend dak</small><strong>Natuurleien — Antwerpen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="2">
        <img src="${g3}" alt="Plat dak EPDM Lier" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Plat dak</small><strong>EPDM rubber — Lier</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell" data-reveal data-reveal-delay="3">
        <img src="${g4}" alt="Zinkwerk Sint-Niklaas" loading="lazy"/>
        <div class="lp-gallery-cap"><small>Afwerking</small><strong>Zinkwerk — Sint-Niklaas</strong></div>
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

    // Form submit
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
    };
  }, []);

  // Hergebruik de algemene site-interacties (reveal-on-scroll, FAQ open/close, smooth-scroll)
  useAbBouwInteractions();

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
