/* v6-overlay voor de landingspagina's.
   De LP's houden hun eigen markup en conversie-opbouw (smalle navigatie zonder
   uitgangen, formulier boven de vouw). Deze laag trekt alleen het UITERLIJK
   gelijk met de rest van de site. Wordt NA LP_CSS geladen, dus wint in de cascade.

   BEWUST NIET AANGERAAKT, na gemeten regressies:
   - backdrop-filter op de kop: dat maakt de kop een containing block voor het
     fixed off-canvas mobiele menu, waardoor dat 328px buiten de pagina viel.
   - .tr-svc-card een witte achtergrond geven: die kaarten staan op sommige LP's
     op een donkere sectie met witte tekst -> wit op wit.
   - .tr-eyebrow verkleuren: die staat zowel op lichte als op donkere secties;
     één kleur voldoet daar nooit aan beide kanten.
   - de voet lichter maken: de linkkleuren daarin zijn op wit ingesteld. */

const GOUD = '#d98c03';
const GOUD_DIEP = '#b87502';
const NAVY = '#0a1628';
const DONKER = '#09101a';
const TINT = '#f6f8fa';
const LIJN = '#e6e8ec';
const LIJN_ZACHT = '#eef0f3';

export const LP_V6_CSS = `
/* ── kop ─────────────────────────────────────────────────────────────── */
.tr .tr-header { border-bottom: 1px solid ${LIJN_ZACHT}; }
.tr .tr-header .tr-wrap { min-height: 88px; }
.tr .tr-logo { height: 42px; }
.tr .tr-nav a { font-size: 15px; font-weight: 600; }

/* ── knoppen ─────────────────────────────────────────────────────────── */
.tr .tr-btn {
  background: ${GOUD}; color: ${NAVY};
  border-radius: 6px; font-weight: 700; letter-spacing: -0.005em;
  box-shadow: 0 1px 2px rgba(16,24,40,0.08);
  transition: background-color .2s cubic-bezier(.25,.46,.45,.94), color .2s cubic-bezier(.25,.46,.45,.94);
}
.tr .tr-btn:hover { background: ${GOUD_DIEP}; color: ${NAVY}; }
.tr .tr-topbar-phone { border-radius: 6px; font-weight: 700; }
.tr .tr-headphone { border-radius: 6px; }

/* ── sectieritme: rustige tint in plaats van haarlijnen ──────────────── */
.tr .tr-section + .tr-section { border-top: 0; }
.tr .tr-steps { background: ${TINT}; }

/* ── koptypografie gelijk aan de site ────────────────────────────────── */
.tr h1 { letter-spacing: -0.04em; }
.tr h2 { letter-spacing: -0.03em; line-height: 1.1; }
.tr h3 { letter-spacing: -0.02em; }

/* ── formulierkaart en velden ────────────────────────────────────────── */
.tr .tr-quickform {
  border: 1px solid ${LIJN};
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(16,24,40,0.06), 0 18px 44px rgba(16,24,40,0.10);
}
.tr .tr-quickform input,
.tr .tr-quickform select,
.tr .tr-quickform textarea,
.tr .tr-final-card input,
.tr .tr-final-card select,
.tr .tr-final-card textarea {
  border-radius: 8px; border: 1.5px solid ${LIJN}; font-size: 15.5px; padding: 13px 14px;
  transition: border-color .18s ease, box-shadow .18s ease;
}
.tr .tr-quickform input:focus,
.tr .tr-quickform select:focus,
.tr .tr-quickform textarea:focus,
.tr .tr-final-card input:focus,
.tr .tr-final-card select:focus,
.tr .tr-final-card textarea:focus {
  outline: none; border-color: ${GOUD}; box-shadow: 0 0 0 3px rgba(217,140,3,0.18);
}

.tr .tr-about-badge { border: 1px solid ${LIJN}; border-radius: 12px; box-shadow: 0 1px 2px rgba(16,24,40,0.05); }

/* ── FAQ als losse kaartjes, gelijk aan de site ──────────────────────── */
.tr .tr-faq-box { display: grid; gap: 12px; }
.tr .tr-faq-item {
  background: #fff; border: 1px solid ${LIJN};
  border-radius: 12px; overflow: hidden;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.tr .tr-faq-item:hover { border-color: #d3d7de; }
.tr .tr-faq-item[open] { border-color: ${GOUD}; box-shadow: 0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06); }
.tr .tr-faq-item summary { padding: 19px 22px; font-size: 16.5px; font-weight: 700; }
.tr .tr-faq-item > div, .tr .tr-faq-item > p { padding-inline: 22px; }

/* ── slotblok als donkere kaart met ronde hoeken, zoals op de site ───── */
.tr .tr-final { background: transparent; border-top: 0; box-shadow: none; padding: clamp(56px,6vw,92px) 0; }
.tr .tr-final > .tr-wrap {
  background: ${DONKER};
  border-radius: 20px;
  padding: clamp(34px, 4vw, 56px);
}
.tr .tr-final h2 { margin-bottom: 34px; }

/* ── cijferband ──────────────────────────────────────────────────────── */
.tr .tr-num + .tr-num::before { background: rgba(255,255,255,0.14); }

/* ── zichtbare focus, zoals site-breed ───────────────────────────────── */
.tr :focus-visible { outline: 3px solid ${GOUD}; outline-offset: 3px; border-radius: 4px; }
`;
