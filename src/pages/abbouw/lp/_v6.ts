/* v6-stijllaag voor de landingspaginas.
   OPZET BLIJFT: de LP's houden hun eigen smalle navigatie en hun eigen
   sectievolgorde, want daar komt betaald advertentieverkeer binnen.
   DEZE LAAG doet alleen het UITERLIJK, en trekt elk onderdeel gelijk met zijn
   tegenhanger op de homepage. Laadt na LP_CSS, dus wint in de cascade.

   VIER DINGEN DIE HIER NOOIT IN MOGEN, elk gemeten kapotgegaan:
   1. backdrop-filter op .tr-header -> wordt containing block voor het fixed
      off-canvas menu, dat viel daardoor 328px buiten de pagina.
   2. .tr-svc-card een witte achtergrond -> die kaarten staan op sommige LP's op
      een donkere sectie met witte tekst: wit op wit.
   3. de voet lichter maken zonder ook alle linkkleuren mee te nemen.
   4. één goudtint voor alle eyebrows -> goud als TEKST heeft twee waarden nodig:
      #915e02 op licht (4,99:1) en #e0a83c op donker. */

const GOUD = '#d98c03';
const GOUD_DIEP = '#b87502';
const GOUD_TEKST = '#915e02';
const GOUD_LICHT = '#e0a83c';
const NAVY = '#0a1628';
const DONKER = '#09101a';
const INKT2 = '#6b7280';
const TEKST = '#52525b';
const MUTE = '#5f636c';
const TINT = '#f6f8fa';
const LIJN = '#e6e8ec';
const LIJN_ZACHT = '#eef0f3';
const SCHADUW = '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06)';
const SCHADUW_OP = '0 4px 10px rgba(16,24,40,0.06), 0 18px 44px rgba(16,24,40,0.10)';
const EASE = 'cubic-bezier(.25,.46,.45,.94)';

export const LP_V6_CSS = `
/* ══ kop en balk ═════════════════════════════════════════════════════ */
.tr .tr-topbar { background: ${NAVY}; color: rgba(255,255,255,0.84); font-size: 12.5px; }
.tr .tr-topbar-phone { border-radius: 6px; font-weight: 700; }
.tr .tr-header { background: rgba(255,255,255,0.96); border-bottom: 1px solid ${LIJN_ZACHT}; }
.tr .tr-header .tr-wrap { min-height: 88px; gap: 26px; }
.tr .tr-logo { height: 42px; }
.tr .tr-nav { gap: 30px; }
.tr .tr-nav a { font-size: 15px; font-weight: 600; color: ${NAVY}; }
.tr .tr-nav a:hover { color: ${GOUD_TEKST}; }
.tr .tr-rating-score { font-weight: 800; color: ${NAVY}; letter-spacing: -0.02em; }
.tr .tr-headphone { border-radius: 6px; border-color: ${LIJN}; }

/* ══ knoppen, exact het homepage-recept ══════════════════════════════ */
.tr .tr-btn {
  background: ${GOUD}; color: ${NAVY};
  border-radius: 6px; font-weight: 700; font-size: 15px; letter-spacing: -0.005em;
  padding: 15px 26px;
  box-shadow: 0 1px 2px rgba(16,24,40,0.08);
  transition: background-color .2s ${EASE}, color .2s ${EASE};
}
.tr .tr-btn:hover { background: ${GOUD_DIEP}; color: ${NAVY}; }

/* ══ typografie ══════════════════════════════════════════════════════ */
.tr h1 { letter-spacing: -0.045em; }
.tr h2 { letter-spacing: -0.03em; line-height: 1.12; }
.tr h3 { letter-spacing: -0.02em; }
/* LET OP: h2 komt zowel op lichte als op donkere secties voor. Alleen de MAAT
   mag blanket; de KLEUR moet per achtergrond, anders krijg je navy op navy. */
.tr .tr-section h2, .tr .tr-steps-box h2 { font-size: clamp(30px, 3.1vw, 44px); font-weight: 700; }
.tr .tr-section h2, .tr .tr-steps-box h2, .tr .tr-reviews h2, .tr .tr-numbers h2 { color: ${NAVY}; }
.tr .tr-services h2, .tr .tr-services h3, .tr .tr-final h2, .tr .tr-hero h2 { color: #fff; }
.tr .tr-services p { color: rgba(255,255,255,0.86); }

/* eyebrow zoals op de site: klein, uppercase, gespatieerd. Twee kleuren. */
.tr .tr-eyebrow {
  font-weight: 700; font-size: 12.5px; letter-spacing: 0.09em;
  color: ${GOUD_TEKST}; margin-bottom: 16px;
}
.tr .tr-eyebrow::before { background: ${GOUD}; width: 22px; height: 3px; }
.tr .tr-hero .tr-eyebrow,
.tr .tr-final .tr-eyebrow,
.tr .tr-services .tr-eyebrow { color: ${GOUD_LICHT}; }

/* ══ hero: zelfde opbouw als de homepage-hero ════════════════════════ */
.tr .tr-hero h1 { font-size: clamp(34px, 4.4vw, 58px); line-height: 1.03; letter-spacing: -0.035em; }
.tr .tr-hero-sub { font-size: 17px; line-height: 1.62; color: #d3d9e2; }
.tr .tr-hero-sub b { color: #fff; font-weight: 700; }
.tr .tr-hero-trust { font-size: 14.5px; color: #e7ebf1; }
.tr .tr-hero-trust-stars { color: ${GOUD_LICHT}; }

/* de certificaat-chips krijgen de vorm van de vinkjesrij op de homepage */
.tr .tr-certs { gap: 10px 26px; }
.tr .tr-cert-pill {
  height: auto; padding: 0; background: transparent; border: 0; border-radius: 0;
  font-size: 14.5px; font-weight: 600; color: #e7ebf1; gap: 9px;
}
.tr .tr-cert-pill svg, .tr .tr-cert-pill img { color: ${GOUD}; }

/* ══ aanvraagkaart ═══════════════════════════════════════════════════ */
.tr .tr-quickform {
  border: 0; border-radius: 14px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.34);
  padding: 28px 26px 24px;
}
.tr .tr-quickform h3 { font-size: 21px; font-weight: 700; letter-spacing: -0.02em; color: ${NAVY}; margin-bottom: 6px; }
.tr .tr-quickform input,
.tr .tr-quickform select,
.tr .tr-quickform textarea,
.tr .tr-final-card input,
.tr .tr-final-card select,
.tr .tr-final-card textarea {
  border-radius: 8px; border: 1.5px solid ${LIJN}; background: #fff;
  font-size: 15.5px; padding: 13px 14px; color: ${NAVY};
  transition: border-color .18s ease, box-shadow .18s ease;
}
.tr .tr-quickform input:hover, .tr .tr-final-card input:hover { border-color: #cfd4dc; }
.tr .tr-quickform input:focus,
.tr .tr-quickform select:focus,
.tr .tr-quickform textarea:focus,
.tr .tr-final-card input:focus,
.tr .tr-final-card select:focus,
.tr .tr-final-card textarea:focus {
  outline: none; border-color: ${GOUD}; box-shadow: 0 0 0 3px rgba(217,140,3,0.18);
}

/* ══ sectieritme: rustige tint, geen haarlijnen ══════════════════════ */
.tr .tr-section + .tr-section { border-top: 0; }
.tr .tr-steps { background: ${TINT}; }
.tr .tr-section { padding: clamp(64px, 7vw, 96px) 0; }

/* ══ stappen als kaarten, zoals de werkwijzekaarten op de site ═══════ */
.tr .tr-steps-grid { gap: 22px; }
.tr .tr-step {
  background: #fff; border: 1px solid ${LIJN}; border-radius: 14px;
  padding: 24px 22px 26px;
  transition: box-shadow .24s ${EASE}, transform .24s ${EASE}, border-color .24s ${EASE};
}
.tr .tr-step:hover { transform: translateY(-4px); box-shadow: ${SCHADUW_OP}; border-color: transparent; }
.tr .tr-step-num {
  display: inline-grid; place-items: center;
  width: 36px; height: 36px; border-radius: 50%;
  background: ${GOUD}; color: ${NAVY};
  font-size: 14px; font-weight: 800; letter-spacing: 0;
  padding: 0; margin-bottom: 14px;
}
.tr .tr-step-num::after { display: none; }
.tr .tr-step h3 { font-size: 18px; }
.tr .tr-step p { font-size: 14.5px; line-height: 1.58; color: ${TEKST}; }

/* ══ vinkjeslijsten ══════════════════════════════════════════════════ */
.tr .tr-checks li { font-size: 15px; line-height: 1.52; }
.tr .tr-checks svg { color: ${GOUD_TEKST}; }

/* ══ badges ══════════════════════════════════════════════════════════ */
.tr .tr-about-badge { border: 1px solid ${LIJN}; border-radius: 12px; box-shadow: 0 1px 2px rgba(16,24,40,0.05); }

/* ══ cijferband: licht met navy cijfers, zoals de statistiekrij ══════ */
.tr .tr-numbers { background: ${TINT}; border-top: 0; box-shadow: none; }
.tr .tr-num:nth-child(odd), .tr .tr-num:nth-child(even) { background: transparent; }
.tr .tr-num { color: ${NAVY}; }
.tr .tr-num-big { color: ${NAVY}; font-weight: 800; letter-spacing: -0.03em; }
.tr .tr-num-lbl { color: ${TEKST}; }
.tr .tr-num + .tr-num::before { background: ${LIJN}; top: 28%; bottom: 28%; }

/* ══ beoordelingen als kaarten ═══════════════════════════════════════ */
.tr .tr-reviews { background: ${TINT}; }
.tr .tr-rev-score { color: ${NAVY}; font-weight: 800; letter-spacing: -0.03em; }
.tr .tr-rev-list { display: grid; gap: 14px; }
.tr .tr-rev-row {
  background: #fff; border: 1px solid ${LIJN}; border-radius: 14px;
  padding: 22px 24px; box-shadow: ${SCHADUW};
  transition: box-shadow .24s ${EASE}, transform .24s ${EASE};
}
.tr .tr-rev-row:hover { transform: translateY(-3px); box-shadow: ${SCHADUW_OP}; }
.tr .tr-rev-row + .tr-rev-row { border-top: 1px solid ${LIJN}; margin-top: 0; padding-top: 22px; }
.tr .tr-rev-name { font-weight: 800; color: ${NAVY}; }
.tr .tr-rev-role { color: ${MUTE}; }

/* ══ galerij ═════════════════════════════════════════════════════════ */
.tr .rl-thumb { border-radius: 12px; overflow: hidden; box-shadow: ${SCHADUW}; transition: box-shadow .24s ${EASE}, transform .24s ${EASE}; }
.tr .rl-thumb:hover { transform: translateY(-4px); box-shadow: ${SCHADUW_OP}; }

/* ══ FAQ als losse kaartjes ══════════════════════════════════════════ */
.tr .tr-faq-box { display: grid; gap: 12px; max-width: 860px; margin-inline: auto; }
.tr .tr-faq-item {
  background: #fff; border: 1px solid ${LIJN}; border-radius: 12px; overflow: hidden;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.tr .tr-faq-item:hover { border-color: #d3d7de; }
.tr .tr-faq-item[open] { border-color: ${GOUD}; box-shadow: ${SCHADUW}; }
.tr .tr-faq-item summary { padding: 19px 22px; font-size: 16.5px; font-weight: 700; color: ${NAVY}; }
.tr .tr-faq-item > div, .tr .tr-faq-item > p { padding: 0 22px 20px; font-size: 15.5px; line-height: 1.66; color: ${TEKST}; }

/* ══ slotblok: donkere kaart met ronde hoeken, zoals de CTA-band ═════ */
.tr .tr-final { background: transparent; border-top: 0; box-shadow: none; padding: clamp(56px,6vw,92px) 0; }
.tr .tr-final > .tr-wrap { background: ${DONKER}; border-radius: 20px; padding: clamp(34px, 4vw, 56px); }
.tr .tr-final h2 { color: #fff; margin-bottom: 30px; }
.tr .tr-final-card { background: #fff; border-radius: 14px; box-shadow: ${SCHADUW_OP}; }

/* ══ voet: licht, zoals de sitevoet. Ook alle tekstkleuren erin. ═════ */
.tr .tr-footer { background: ${TINT}; border-top: 1px solid ${LIJN}; padding: 54px 0 34px; color: ${TEKST}; }
.tr .tr-footer-wordmark { color: ${NAVY}; }
.tr .tr-footer a,
.tr .tr-footer-links a,
.tr .tr-footer-copy a { color: ${TEKST}; }
.tr .tr-footer a:hover,
.tr .tr-footer-links a:hover,
.tr .tr-footer-copy a:hover { color: ${GOUD_TEKST}; }
.tr .tr-footer-info, .tr .tr-footer-copy { color: ${MUTE}; }
.tr .tr-footer-copy a[style] { color: ${TEKST} !important; }

/* ══ zichtbare focus ═════════════════════════════════════════════════ */
.tr :focus-visible { outline: 3px solid ${GOUD}; outline-offset: 3px; border-radius: 4px; }
`;
