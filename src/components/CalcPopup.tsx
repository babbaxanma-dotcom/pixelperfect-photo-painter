import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * CalcPopup — slide-in popup na 15 sec engagement.
 *
 * Doel: ads-traffic dat na 15s nog steeds op de page is, naar de calculator
 * trekken (60-sec wizard heeft hogere conversie dan een vol formulier).
 *
 * Regels:
 *   - Toont 1× per sessie (sessionStorage)
 *   - Niet op pagina's waar het overbodig is (calc zelf, contact, bedankt, legal)
 *   - 15-sec delay = bewezen sweet spot (vroeger = irritant, later = gemist)
 *   - Toont enkel op pagina's met dakwerken-context (LP, lokaal-dak, blog, home, etc.)
 *   - Mobile-vriendelijk: bottom slide-in i.p.v. fullscreen modal
 *   - ESC of klik buiten dismissed het
 *
 * Verwacht effect: 3-6% extra leads via calculator-pad bovenop normale form-flow.
 */
const SKIP_PATTERNS = [
  /^\/calculator\b/,
  /^\/contact\b/,
  /^\/bedankt\b/,
  /^\/privacy\b/,
  /^\/voorwaarden\b/,
  /^\/cookies\b/,
];

const SHOW_PATTERNS = [
  /^\/$/,                            // home
  /^\/lp\/dakwerken/,                // ad LP
  /^\/lokaal\/dakwerker-/,           // 24 lokale dakwerker pages
  /^\/realisaties\/dakwerken/,       // dedicated realisaties
  /^\/realisaties$/,                 // overview
  /^\/dakwerken$/,                   // service page
  /^\/blog/,                         // alle blog-pages (incl. premie-artikels)
  /^\/over$/,                        // about
  /^\/werkwijze$/,                   // process
];

const STORAGE_KEY = 'ab_calc_popup_shown';
const CONSENT_KEY = 'ab_bouw_consent_v1';
const DELAY_MS = 15_000;

/** Heeft user een keuze gemaakt op de cookie-banner? */
const hasConsentDecision = (): boolean => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!(parsed && parsed.decided_at);
  } catch {
    return false;
  }
};

export default function CalcPopup() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Bij elke route-change: popup eerst weghalen + opnieuw evalueren of er
  // op deze page een timer moet starten. Voorkomt dat een popup blijft
  // hangen na navigeren naar een andere page (bv. naar /calculator zelf).
  useEffect(() => {
    setShow(false);
    setClosing(false);

    const path = location.pathname;
    if (SKIP_PATTERNS.some((re) => re.test(path))) return;
    if (!SHOW_PATTERNS.some((re) => re.test(path))) return;
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

    let timerId: number | undefined;
    let consentWatchId: number | undefined;

    // Timer start pas NADAT cookie-keuze gemaakt is. Anders verschijnt
    // popup over de consent-banner heen (slechte UX + technisch GDPR-vraag).
    const startTimer = () => {
      if (timerId !== undefined) return; // al gestart
      timerId = window.setTimeout(() => setShow(true), DELAY_MS);
    };

    if (hasConsentDecision()) {
      startTimer();
    } else {
      // Wacht op consent-event (afgevuurd door consent.ts writeConsent())
      const onConsentChanged = () => startTimer();
      window.addEventListener('ab-bouw-consent-changed', onConsentChanged);
      // Plus polling-fallback voor het geval consent buiten event om gezet wordt
      consentWatchId = window.setInterval(() => {
        if (hasConsentDecision()) {
          window.removeEventListener('ab-bouw-consent-changed', onConsentChanged);
          if (consentWatchId !== undefined) window.clearInterval(consentWatchId);
          consentWatchId = undefined;
          startTimer();
        }
      }, 1500);
      return () => {
        window.removeEventListener('ab-bouw-consent-changed', onConsentChanged);
        if (consentWatchId !== undefined) window.clearInterval(consentWatchId);
        if (timerId !== undefined) window.clearTimeout(timerId);
      };
    }

    return () => {
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleClose = () => {
    setClosing(true);
    sessionStorage.setItem(STORAGE_KEY, '1');
    window.setTimeout(() => { setShow(false); setClosing(false); }, 220);
  };

  const handleClick = () => {
    // 1) markeer als 'getoond' zodat hij niet terugkomt deze sessie
    sessionStorage.setItem(STORAGE_KEY, '1');
    // 2) verberg DIRECT (geen wachten op route-change re-render)
    setShow(false);
    setClosing(false);
    // 3) navigeer naar calculator
    navigate('/calculator/dakwerken');
  };

  if (!show) return null;

  return (
    <>
      <div
        className={`calc-popup-card ${closing ? 'is-closing' : 'is-open'}`}
        role="dialog"
        aria-labelledby="calc-popup-title"
        aria-modal="false"
      >
        <button
          type="button"
          className="calc-popup-close"
          onClick={handleClose}
          aria-label="Sluit popup"
          title="Sluiten"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="calc-popup-body">
          <div className="calc-popup-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="calc-popup-text">
            <span className="calc-popup-eyebrow">Sneller dan een formulier</span>
            <strong id="calc-popup-title" className="calc-popup-title">
              Bereken uw offerte online — <span className="calc-popup-em">60 seconden</span>
            </strong>
            <span className="calc-popup-sub">6 vragen, vrijblijvende prijsindicatie. Geen verplichtingen.</span>
          </div>
        </div>

        <div className="calc-popup-actions">
          <button type="button" className="calc-popup-dismiss" onClick={handleClose}>
            Liever niet
          </button>
          <button type="button" className="calc-popup-cta" onClick={handleClick}>
            <span>Bereken offerte</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .calc-popup-card {
          position: fixed;
          bottom: 24px; right: 24px;
          width: 380px; max-width: calc(100vw - 32px);
          background: #ffffff;
          border: 1px solid rgba(15,23,42,0.10);
          border-radius: 14px;
          box-shadow: 0 24px 60px -16px rgba(15,23,42,0.28), 0 8px 20px -8px rgba(15,23,42,0.10);
          z-index: 9998;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          overflow: hidden;
        }
        .calc-popup-card.is-open {
          animation: calcPopupIn 0.36s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .calc-popup-card.is-closing {
          animation: calcPopupOut 0.22s ease forwards;
        }
        @keyframes calcPopupIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes calcPopupOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(8px) scale(0.98); }
        }

        /* Close — groot, hoog-contrast navy circle. Geen mistake mogelijk. */
        .calc-popup-close {
          position: absolute;
          top: 12px; right: 12px;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #0a1628;
          color: #ffffff;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.15s;
          z-index: 2;
          padding: 0;
        }
        .calc-popup-close:hover { background: #1a2c4a; transform: scale(1.05); }
        .calc-popup-close:focus-visible {
          outline: 2px solid #d98c03; outline-offset: 2px;
        }

        .calc-popup-body {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: flex-start;
          gap: 16px;
          padding: 22px 60px 18px 22px;
        }
        .calc-popup-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: #0a1628;
          color: #ffffff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .calc-popup-text {
          display: flex; flex-direction: column; gap: 4px;
          min-width: 0;
        }
        .calc-popup-eyebrow {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #64748b;
        }
        .calc-popup-title {
          font-size: 16px;
          font-weight: 700;
          color: #0a1628;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .calc-popup-em {
          color: #d98c03;
          font-weight: 700;
        }
        .calc-popup-sub {
          font-size: 13px;
          color: #475569;
          line-height: 1.45;
          margin-top: 2px;
        }

        /* Actions footer — divider + 2 knoppen */
        .calc-popup-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px 18px;
          border-top: 1px solid rgba(15,23,42,0.06);
          background: #fafbfc;
        }
        .calc-popup-dismiss {
          flex: 0 0 auto;
          padding: 9px 14px;
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          border: 1px solid rgba(15,23,42,0.12);
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          font-family: inherit;
        }
        .calc-popup-dismiss:hover {
          background: rgba(15,23,42,0.04);
          color: #0a1628;
          border-color: rgba(15,23,42,0.20);
        }
        .calc-popup-cta {
          flex: 1 1 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 18px;
          border-radius: 8px;
          background: #d98c03 !important;
          color: #ffffff !important;
          border: none;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .calc-popup-cta:hover { background: #c47a02 !important; }
        .calc-popup-cta:active { transform: translateY(1px); }
        .calc-popup-cta svg { flex-shrink: 0; }

        /* Mobile — full-width onderaan, knoppen onder elkaar */
        @media (max-width: 640px) {
          .calc-popup-card {
            bottom: 12px; right: 12px; left: 12px;
            width: auto; max-width: none;
            border-radius: 12px;
          }
          .calc-popup-body {
            padding: 20px 56px 16px 18px;
            gap: 14px;
          }
          .calc-popup-icon { width: 40px; height: 40px; }
          .calc-popup-title { font-size: 15px; }
          .calc-popup-sub { font-size: 12.5px; }
          .calc-popup-actions {
            padding: 12px 18px 16px;
          }
          .calc-popup-dismiss {
            padding: 10px 12px;
            font-size: 12.5px;
          }
          .calc-popup-cta {
            padding: 12px 16px;
            font-size: 13.5px;
          }
          .calc-popup-close {
            top: 10px; right: 10px;
            width: 38px; height: 38px;
          }
        }

        /* Tap-friendly minimum size op touch devices */
        @media (pointer: coarse) {
          .calc-popup-close { width: 44px; height: 44px; top: 10px; right: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .calc-popup-card.is-open,
          .calc-popup-card.is-closing { animation: none; }
        }
      `}</style>
    </>
  );
}
