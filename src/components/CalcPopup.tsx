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
const DELAY_MS = 15_000;

export default function CalcPopup() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (SKIP_PATTERNS.some((re) => re.test(path))) return;
    if (!SHOW_PATTERNS.some((re) => re.test(path))) return;
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

    const timer = window.setTimeout(() => setShow(true), DELAY_MS);
    return () => window.clearTimeout(timer);
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
    sessionStorage.setItem(STORAGE_KEY, '1');
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
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="calc-popup-body" onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
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
            <span className="calc-popup-sub">6 vragen, direct prijsindicatie. Geen contactstress.</span>
          </div>
          <button type="button" className="calc-popup-cta" onClick={handleClick}>
            Start
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
          width: 420px; max-width: calc(100vw - 32px);
          background: linear-gradient(135deg, #fff 0%, #fff8ec 100%);
          border: 1.5px solid rgba(217,140,3,0.4);
          border-radius: 18px;
          box-shadow: 0 24px 60px -16px rgba(15,23,42,0.32), 0 4px 14px rgba(15,23,42,0.08);
          z-index: 9998;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }
        .calc-popup-card.is-open {
          animation: calcPopupIn 0.42s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .calc-popup-card.is-closing {
          animation: calcPopupOut 0.22s ease forwards;
        }
        @keyframes calcPopupIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes calcPopupOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(10px) scale(0.98); }
        }
        .calc-popup-close {
          position: absolute;
          top: 10px; right: 10px;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(15,23,42,0.06);
          color: #475569;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s;
          z-index: 2;
        }
        .calc-popup-close:hover { background: rgba(15,23,42,0.12); color: #0f172a; }
        .calc-popup-body {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 20px 22px 20px 20px;
          cursor: pointer;
        }
        .calc-popup-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: #d98c03;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 6px 16px -6px rgba(217,140,3,0.55);
        }
        .calc-popup-text {
          display: flex; flex-direction: column; gap: 2px;
          min-width: 0;
          padding-right: 8px;
        }
        .calc-popup-eyebrow {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #d98c03;
        }
        .calc-popup-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #0a1628;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }
        .calc-popup-em {
          background: linear-gradient(transparent 62%, rgba(217,140,3,0.32) 62%);
          padding: 0 3px;
        }
        .calc-popup-sub {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.4;
          margin-top: 2px;
        }
        .calc-popup-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 999px;
          background: #d98c03 !important;
          color: #fff !important;
          border: none;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          font-family: inherit;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .calc-popup-cta:hover { background: #c47a02 !important; transform: translateX(2px); }
        .calc-popup-cta svg { flex-shrink: 0; }

        /* Mobile — slide-in vanaf onderkant, full-width minus marge */
        @media (max-width: 640px) {
          .calc-popup-card {
            bottom: 12px;
            right: 12px;
            left: 12px;
            width: auto;
            max-width: none;
          }
          .calc-popup-body {
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            padding: 18px 18px 16px;
            gap: 12px 14px;
          }
          .calc-popup-icon {
            grid-row: 1; grid-column: 1;
            width: 42px; height: 42px;
          }
          .calc-popup-text {
            grid-row: 1; grid-column: 2;
            padding-right: 32px;
          }
          .calc-popup-title { font-size: 14.5px; }
          .calc-popup-sub { font-size: 12px; }
          .calc-popup-cta {
            grid-row: 2; grid-column: 1 / -1;
            justify-content: center;
            padding: 11px 16px;
            font-size: 14px;
          }
          .calc-popup-close { top: 8px; right: 8px; }
        }

        /* Respecteer prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .calc-popup-card.is-open,
          .calc-popup-card.is-closing { animation: none; }
        }
      `}</style>
    </>
  );
}
