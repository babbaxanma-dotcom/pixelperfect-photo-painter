// Cookie consent (GDPR/ePrivacy compliant voor BE)
// - Geen tracking-scripts laden vóór consent
// - Banner toont éénmalig, keuze in localStorage
// - 3 niveaus: accept-all, essential-only, custom (advanced)
// - "essential-only" => geen GA4, geen Ads, geen UTM persist

const LS_KEY = 'ab_bouw_consent_v1';

export type ConsentState = {
  analytics: boolean;     // GA4
  marketing: boolean;     // Google Ads + Meta Pixel
  decided_at: string;     // ISO timestamp
};

const DEFAULT_ESSENTIAL: ConsentState = {
  analytics: false,
  marketing: false,
  decided_at: '',
};

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsent(c: ConsentState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify({ ...c, decided_at: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent('ab-bouw-consent-changed', { detail: c }));
  } catch {
    /* ignore */
  }
}

export function hasDecided(): boolean {
  return readConsent() !== null;
}

/* Keuze uit de vraag na een aanvraag ("Mag AB Bouw Groep aan Google doorgeven ...").
   Alleen marketing wijzigt; analytics blijft wat de bezoeker eerder koos (standaard nee).
   De banner verdwijnt, want de bezoeker heeft gekozen. */
export function kiesMarketing(ja: boolean) {
  writeConsent({ analytics: readConsent()?.analytics === true, marketing: ja, decided_at: '' });
  removeBanner?.();
}

export function allowsAnalytics(): boolean {
  return readConsent()?.analytics === true;
}

export function allowsMarketing(): boolean {
  return readConsent()?.marketing === true;
}

// Push de huidige consent-state naar gtag. gtag.js zelf staat in index.html en
// start in "denied" state (Consent Mode v2). Hier upgraden we naar "granted"
// zodra de bezoeker de cookie-banner heeft geaccepteerd.
export function syncConsentToGtag() {
  if (typeof window === 'undefined') return;
  type GtagFn = (...args: unknown[]) => void;
  const w = window as unknown as { gtag?: GtagFn; dataLayer?: unknown[] };
  const pushFn: GtagFn = w.gtag ?? ((...a: unknown[]) => { (w.dataLayer ??= []).push(a); });
  const c = readConsent();
  const analytics = c?.analytics === true ? 'granted' : 'denied';
  const marketing = c?.marketing === true ? 'granted' : 'denied';
  pushFn('consent', 'update', {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
  });
}

const BANNER_ID = 'ab-bouw-cookie-banner';

const BANNER_HTML = `
<div class="abc-banner" role="dialog" aria-live="polite" aria-label="Cookie-instellingen">
  <div class="abc-banner-inner">
    <div class="abc-banner-text">
      <p>Met uw toestemming meten we bezoeken en advertenties. <a href="/cookies">Cookieverklaring</a></p>
    </div>
    <div class="abc-banner-actions">
      <button type="button" class="abc-btn abc-btn-ghost" data-abc-action="essential">Alleen essentiële</button>
      <button type="button" class="abc-btn abc-btn-primary" data-abc-action="accept">Alles aanvaarden</button>
    </div>
  </div>
</div>
`;

const BANNER_CSS = `
/* 18 nov 2026, Mohammed: "de cookie melding op ab is irritant, fix dat": van een zwevende kaart (titel + drie regels, ± 170 px hoog op de gsm)
   naar een smalle balk onderaan met één zin; tijdens het invullen van een formulier (html.is-informulier) is hij weg. De keuze blijft even
   makkelijk (Alleen essentiële naast Alles aanvaarden) en zonder keuze staat alles op geweigerd (Consent Mode in index.html). */
.abc-banner {
  position: fixed; left: 50%; transform: translateX(-50%); bottom: 12px; z-index: 999;
  width: calc(100% - 24px); max-width: 640px;
  background: #fff; color: #0f1115;
  border: 1px solid rgba(15,17,21,0.12);
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(10,22,40,0.14);
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 14px; line-height: 1.5;
}
.abc-banner-inner {
  display: grid; grid-template-columns: 1fr auto; gap: 12px;
  padding: 10px 12px 10px 16px; align-items: center;
}
html.is-informulier .abc-banner { display: none; }
#ab-bouw-cookie-banner .abc-banner-text p { font-size: 13.5px; line-height: 1.4; } /* de globale p-regel (16 px) maakte de zin groter dan nodig */
.abc-banner-text strong { display: block; font-size: 15px; margin-bottom: 4px; }
.abc-banner-text p { margin: 0; color: rgba(15,17,21,0.72); }
.abc-banner-text a { color: var(--accent, #d98c03); text-decoration: underline; }
.abc-banner-actions { display: flex; gap: 10px; }
.abc-btn {
  font: inherit; cursor: pointer; padding: 8px 14px; min-height: 40px;
  border-radius: 6px; border: 1px solid transparent;
  white-space: nowrap; transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease, color .15s ease;
}
.abc-btn:active { }
.abc-btn-ghost {
  background: transparent; color: #0f1115;
  border-color: rgba(15,17,21,0.18);
}
.abc-btn-ghost:hover { background: rgba(15,17,21,0.04); }
.abc-btn-primary {
  /* navy op goud = 6,65:1; wit op goud haalde maar 2,73:1 en zakte door AA */
  background: #d98c03; color: #0a1628; border-color: #d98c03;
  font-weight: 700;
}
.abc-btn-primary:hover { background: #b87502; border-color: #b87502; color: #0a1628; }
@media (max-width: 720px) {
  .abc-banner { font-size: 13px; left: 0; right: 0; bottom: 0; transform: none; width: auto; max-width: none; border-radius: 0; border-width: 1px 0 0; box-shadow: 0 -4px 12px rgba(10,22,40,0.08); }
  .abc-banner-inner { grid-template-columns: 1fr; gap: 8px; padding: 8px 12px calc(8px + env(safe-area-inset-bottom)); }
  .abc-banner-actions { flex-direction: row; }
  .abc-btn { flex: 1; padding: 6px 10px; min-height: 40px; }
}
`;

let installed = false;
let removeBanner: (() => void) | null = null;
let bannerEl: HTMLDivElement | null = null;
let wachtOpScroll: (() => void) | null = null;

/* Pagina's waar de banner pas verschijnt zodra de bezoeker voorbij 90 % van het eerste scherm scrolt.
   - /lp/: op de telefoon lag de banner bij het openen over de antwoorden van de eerste rekenaarvraag (gemeten 1 okt 2026).
   - /bedankt, /afspraak, /dakinspectie (de funnel na een aanvraag): op 390 lag hij over de keuzes "Volgende week" en
     "Later" en over het datumraster van de kalender (gemeten 12 okt 2026). /afspraak en /dakinspectie worden ook vanuit
     de klant-sms'en geopend, dus vers geladen.
   Tot de bezoeker kiest staat alles op "geweigerd" (Consent Mode-standaard in index.html). */
function bannerNaScroll(pad: string): boolean {
  if (pad.startsWith('/lp/')) return true;
  const p = pad.replace(/\/+$/, '');
  /* /totaalrenovatie toont sinds 13 okt 2026 dezelfde landingspagina als /lp/totaalrenovatie: zelfde bannergedrag. */
  return p === '/bedankt' || p.startsWith('/bedankt/') || p === '/afspraak' || p === '/dakinspectie' || p === '/totaalrenovatie';
}

function stopWachten() {
  if (wachtOpScroll) window.removeEventListener('scroll', wachtOpScroll);
  wachtOpScroll = null;
}

function wachtTotScroll() {
  if (wachtOpScroll || !bannerEl) return;
  wachtOpScroll = () => {
    if (window.scrollY < window.innerHeight * 0.9) return;
    stopWachten();
    if (bannerEl && !hasDecided() && !bannerEl.isConnected) document.body.appendChild(bannerEl);
  };
  window.addEventListener('scroll', wachtOpScroll, { passive: true });
}

/* Voor de funnelpagina's (BedanktBf, AfspraakBf), bij het openen: komt de bezoeker via de SPA binnen terwijl de banner
   al openstaat (bv. na scrollen op de LP of een siteformulier), dan gaat hij weg tot dezelfde scrollgrens.
   Geeft de opruimfunctie terug: gaat de bezoeker naar een pagina zonder die regel, dan staat de banner er meteen weer. */
export function bannerWachtOpScroll(): () => void {
  if (typeof window === 'undefined' || !bannerEl || hasDecided()) return () => {};
  if (bannerEl.isConnected) bannerEl.remove();
  wachtTotScroll();
  return () => {
    if (!bannerEl || hasDecided() || bannerNaScroll(window.location.pathname)) return;
    stopWachten();
    if (!bannerEl.isConnected) document.body.appendChild(bannerEl);
  };
}

export function installConsentBanner() {
  if (typeof document === 'undefined' || installed) return;
  installed = true;

  if (hasDecided()) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'ab-bouw-cookie-banner-style';
  styleEl.textContent = BANNER_CSS;
  document.head.appendChild(styleEl);

  const wrap = document.createElement('div');
  wrap.id = BANNER_ID;
  wrap.innerHTML = BANNER_HTML;
  bannerEl = wrap;
  if (bannerNaScroll(window.location.pathname)) wachtTotScroll();
  else document.body.appendChild(wrap);

  const onClick = (e: Event) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const action = t.closest('[data-abc-action]')?.getAttribute('data-abc-action');
    if (!action) return;
    if (action === 'accept') {
      writeConsent({ analytics: true, marketing: true, decided_at: '' });
    } else if (action === 'essential') {
      writeConsent({ ...DEFAULT_ESSENTIAL });
    }
    removeBanner?.();
  };
  wrap.addEventListener('click', onClick);

  removeBanner = () => {
    if (wachtOpScroll) window.removeEventListener('scroll', wachtOpScroll);
    wachtOpScroll = null;
    wrap.removeEventListener('click', onClick);
    wrap.remove();
    styleEl.remove();
    bannerEl = null;
    removeBanner = null;
  };
}
