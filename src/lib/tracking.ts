// Tracking — GA4 + Google Ads conversions + UTM capture.
// Env vars:
//   VITE_GA4_ID                        → G-XXXXXXX (hoofd-site Measurement ID)
//   VITE_GA4_ID_LP                     → G-XXXXXXX (LP-specifiek Measurement ID)
//   VITE_GADS_ID                       → AW-XXXXXXX (Google Ads account ID)
//   VITE_GADS_CONVERSION_LABEL_FORM    → conversion label voor form submits
//   VITE_GADS_CONVERSION_LABEL_CALL    → conversion label voor tel: clicks
//   VITE_GADS_CONVERSION_LABEL_NEWS    → conversion label voor newsletter signups

// ── PRODUCTIE-FALLBACKS ──────────────────────────────────────────────────────
// Deze client-side ID's zijn NIET geheim — de AW-tag staat al hardcoded in
// index.html en alle gtag-ID's komen sowieso mee in de JS-bundle. We bakken ze
// hier als fallback in, zodat een ontbrekende build-variabele in Lovable de
// conversiemeting nooit meer stil kan slopen. Env var wint als hij gezet is.
const GADS_ID = (import.meta.env.VITE_GADS_ID as string) || 'AW-18162707660';
const GADS_LABEL_FORM = (import.meta.env.VITE_GADS_CONVERSION_LABEL_FORM as string) || 'hmUYCOLzvbMcEMzZ09RD';
const GADS_LABEL_CALL = (import.meta.env.VITE_GADS_CONVERSION_LABEL_CALL as string) || 'OpJlCKGwvrMcEMzZ09RD';
const GADS_LABEL_NEWS = (import.meta.env.VITE_GADS_CONVERSION_LABEL_NEWS as string) || '';
const GA4_ID = (import.meta.env.VITE_GA4_ID as string) || 'G-VSPZVRD0LW';
const GA4_ID_LP = (import.meta.env.VITE_GA4_ID_LP as string) || 'G-4421GRKGF8';

// LP-paden: /lp/*, /lokaal/*, /bedankt → naar GA4_LP property
function isLpPath(path: string): boolean {
  return path.startsWith('/lp/') || path.startsWith('/lokaal/') || path.startsWith('/bedankt');
}

function activeGa4Id(): string | undefined {
  const main = GA4_ID || undefined;
  const lp = GA4_ID_LP || undefined;
  if (typeof window === 'undefined') return main;
  return isLpPath(window.location.pathname) ? (lp ?? main) : main;
}

const LS_UTM_KEY = 'ab_bouw_utm_v1';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
  if (typeof window.gtag === 'function') {
    (window.gtag as (...a: unknown[]) => void)(...args);
  }
}

// Eenmalig bij eerste page-load: vang UTM params, persist in localStorage
// zodat ze later bij submit nog beschikbaar zijn.
export function captureUtm() {
  if (typeof window === 'undefined') return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const found: UtmParams = {};
    UTM_KEYS.forEach((k) => {
      const v = sp.get(k);
      if (v) found[k] = v;
    });
    if (Object.keys(found).length > 0) {
      const existing = readUtm();
      const merged: UtmParams = { ...existing, ...found, ...{ captured_at: new Date().toISOString() } as UtmParams };
      window.localStorage.setItem(LS_UTM_KEY, JSON.stringify(merged));
    }
  } catch {
    /* ignore */
  }
}

function readUtm(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(LS_UTM_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

export function getUtmParams(): UtmParams {
  return readUtm();
}

export function trackPageView(path: string) {
  const main = GA4_ID || undefined;
  const lp = GA4_ID_LP || undefined;
  const target = isLpPath(path) ? (lp ?? main) : main;
  if (!target) return;
  gtag('event', 'page_view', {
    send_to: target,
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : path,
  });
}

// Normaliseer email/phone naar het formaat dat Google Ads Enhanced Conversions
// verwacht. gtag hasht zelf SHA-256 voor wie via gtag('set', 'user_data', ...) gaat.
function normalizeEmail(raw?: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const v = raw.trim().toLowerCase();
  return v.length > 0 && v.includes('@') ? v : undefined;
}
function normalizePhoneBE(raw?: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 0) return undefined;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = '32' + digits.slice(1);
  if (digits.length < 8) return undefined;
  return '+' + digits;
}

export function fireConversion(kind: 'contact_form' | 'newsletter' | 'landing_page', payload: Record<string, unknown>) {
  const gadsId = GADS_ID;
  const labelForm = GADS_LABEL_FORM;
  const labelNews = GADS_LABEL_NEWS;
  const ga4Target = activeGa4Id();

  // Enhanced Conversions: stuur email/phone (normalized, unhashed — gtag hasht)
  // VOOR de conversion event firet. Google matched dit tegen ingelogde Google
  // accounts om consentless conversies alsnog te attribueren.
  const email = normalizeEmail(payload.email);
  const phone = normalizePhoneBE(payload.phone);
  const firstName = typeof payload.firstName === 'string' ? payload.firstName.trim().toLowerCase() : undefined;
  const lastName = typeof payload.lastName === 'string' ? payload.lastName.trim().toLowerCase() : undefined;
  if (email || phone) {
    const userData: Record<string, string | { first_name?: string; last_name?: string; country?: string }> = {};
    if (email) userData.email = email;
    if (phone) userData.phone_number = phone;
    if (firstName || lastName) {
      userData.address = { first_name: firstName, last_name: lastName, country: 'BE' };
    }
    gtag('set', 'user_data', userData);
  }

  // GA4 event (custom) — naar de juiste property op basis van huidig pad
  if (ga4Target) {
    gtag('event', kind === 'newsletter' ? 'sign_up' : 'generate_lead', {
      send_to: ga4Target,
      event_category: 'lead',
      method: kind,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      value: kind === 'contact_form' ? 50 : kind === 'landing_page' ? 50 : 1,
      currency: 'EUR',
    });
  }

  // Google Ads conversion
  const label = kind === 'newsletter' ? labelNews : labelForm;
  if (gadsId && label) {
    gtag('event', 'conversion', {
      send_to: `${gadsId}/${label}`,
      value: kind === 'newsletter' ? 1 : 50,
      currency: 'EUR',
      transaction_id: `${kind}-${Date.now()}`,
    });
    console.info('[tracking] Google Ads conversie afgevuurd:', kind, `${gadsId}/${label}`, { ec: !!(email || phone) });
  } else {
    // Zichtbaar (ook in productie) zodat een ontbrekend label nooit meer stil faalt.
    console.warn('[tracking] Google Ads conversie OVERGESLAGEN — id/label ontbreekt', { gadsId, label, kind });
  }
}

export function trackCallClick(source: string) {
  const gadsId = GADS_ID;
  const labelCall = GADS_LABEL_CALL;
  const ga4Target = activeGa4Id();

  if (ga4Target) {
    gtag('event', 'phone_call_click', {
      send_to: ga4Target,
      event_category: 'engagement',
      method: source,
      value: 25,
      currency: 'EUR',
    });
  }

  if (gadsId && labelCall) {
    gtag('event', 'conversion', {
      send_to: `${gadsId}/${labelCall}`,
      value: 25,
      currency: 'EUR',
      transaction_id: `call-${Date.now()}`,
    });
    console.info('[tracking] Google Ads CALL-conversie afgevuurd:', source, `${gadsId}/${labelCall}`);
  } else {
    console.warn('[tracking] CALL-conversie OVERGESLAGEN — id/label ontbreekt', { gadsId, labelCall });
  }
}

// Global tel: click delegation — auto-fired conversion bij elke phone click
export function installCallTracking() {
  if (typeof document === 'undefined') return;
  const onClick = (e: MouseEvent) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const a = t.closest('a[href^="tel:"]');
    if (!a) return;
    trackCallClick(a.closest('[data-track-source]')?.getAttribute('data-track-source') || (window.location.pathname || 'unknown'));
  };
  document.addEventListener('click', onClick, { capture: true });
}
