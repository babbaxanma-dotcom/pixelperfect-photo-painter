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

export function allowsAnalytics(): boolean {
  return readConsent()?.analytics === true;
}

export function allowsMarketing(): boolean {
  return readConsent()?.marketing === true;
}

const BANNER_ID = 'ab-bouw-cookie-banner';

const BANNER_HTML = `
<div class="abc-banner" role="dialog" aria-live="polite" aria-label="Cookie-instellingen">
  <div class="abc-banner-inner">
    <div class="abc-banner-text">
      <strong>Cookies & privacy</strong>
      <p>We gebruiken cookies om de site te laten werken en, met uw toestemming, om bezoekers te meten en advertenties bij te houden.
        Lees meer in onze <a href="/cookies">cookieverklaring</a>.</p>
    </div>
    <div class="abc-banner-actions">
      <button type="button" class="abc-btn abc-btn-ghost" data-abc-action="essential">Alleen essentiële</button>
      <button type="button" class="abc-btn abc-btn-primary" data-abc-action="accept">Alles aanvaarden</button>
    </div>
  </div>
</div>
`;

const BANNER_CSS = `
.abc-banner {
  position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 999;
  background: #fff; color: #0f1115;
  border: 1px solid rgba(15,17,21,0.10);
  border-radius: 16px;
  box-shadow: 0 24px 60px -18px rgba(10,22,40,0.35);
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 14.5px; line-height: 1.55;
  animation: abc-in 0.45s cubic-bezier(.22,.61,.36,1);
}
@keyframes abc-in { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
.abc-banner-inner {
  display: grid; grid-template-columns: 1fr auto; gap: 20px;
  padding: 18px 22px; align-items: center;
  max-width: 1140px; margin: 0 auto;
}
.abc-banner-text strong { display: block; font-size: 15px; margin-bottom: 4px; }
.abc-banner-text p { margin: 0; color: rgba(15,17,21,0.72); }
.abc-banner-text a { color: var(--accent, #d98c03); text-decoration: underline; }
.abc-banner-actions { display: flex; gap: 10px; }
.abc-btn {
  font: inherit; cursor: pointer; padding: 11px 18px;
  border-radius: 999px; border: 1px solid transparent;
  white-space: nowrap; transition: background 0.2s, border-color 0.2s, transform 0.1s;
}
.abc-btn:active { transform: scale(0.97); }
.abc-btn-ghost {
  background: transparent; color: #0f1115;
  border-color: rgba(15,17,21,0.18);
}
.abc-btn-ghost:hover { background: rgba(15,17,21,0.04); }
.abc-btn-primary {
  background: var(--accent, #d98c03); color: #fff; border-color: var(--accent, #d98c03);
  font-weight: 600;
}
.abc-btn-primary:hover { background: var(--accent-hover, #b87502); border-color: var(--accent-hover, #b87502); }
@media (max-width: 720px) {
  .abc-banner-inner { grid-template-columns: 1fr; gap: 14px; }
  .abc-banner-actions { flex-direction: column-reverse; }
  .abc-btn { width: 100%; }
}
`;

let installed = false;
let removeBanner: (() => void) | null = null;

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
  document.body.appendChild(wrap);

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
    wrap.removeEventListener('click', onClick);
    wrap.remove();
    styleEl.remove();
    removeBanner = null;
  };
}
