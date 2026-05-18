// Tracking — GA4 + Google Ads conversions + UTM capture.
// Env vars:
//   VITE_GA4_ID                        → G-XXXXXXX (hoofd-site Measurement ID)
//   VITE_GA4_ID_LP                     → G-XXXXXXX (LP-specifiek Measurement ID)
//   VITE_GADS_ID                       → AW-XXXXXXX (Google Ads account ID)
//   VITE_GADS_CONVERSION_LABEL_FORM    → conversion label voor form submits
//   VITE_GADS_CONVERSION_LABEL_CALL    → conversion label voor tel: clicks
//   VITE_GADS_CONVERSION_LABEL_NEWS    → conversion label voor newsletter signups

// LP-paden: /lp/*, /lokaal/*, /bedankt → naar GA4_LP property
function isLpPath(path: string): boolean {
  return path.startsWith('/lp/') || path.startsWith('/lokaal/') || path.startsWith('/bedankt');
}

function activeGa4Id(): string | undefined {
  const main = import.meta.env.VITE_GA4_ID as string | undefined;
  const lp = import.meta.env.VITE_GA4_ID_LP as string | undefined;
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
  const main = import.meta.env.VITE_GA4_ID as string | undefined;
  const lp = import.meta.env.VITE_GA4_ID_LP as string | undefined;
  const target = isLpPath(path) ? (lp ?? main) : main;
  if (!target) return;
  gtag('event', 'page_view', {
    send_to: target,
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : path,
  });
}

export function fireConversion(kind: 'contact_form' | 'newsletter' | 'landing_page', payload: Record<string, unknown>) {
  const gadsId = import.meta.env.VITE_GADS_ID as string | undefined;
  const labelForm = import.meta.env.VITE_GADS_CONVERSION_LABEL_FORM as string | undefined;
  const labelNews = import.meta.env.VITE_GADS_CONVERSION_LABEL_NEWS as string | undefined;
  const ga4Target = activeGa4Id();

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
  if (gadsId) {
    const label = kind === 'newsletter' ? labelNews : labelForm;
    if (label) {
      gtag('event', 'conversion', {
        send_to: `${gadsId}/${label}`,
        value: kind === 'newsletter' ? 1 : 50,
        currency: 'EUR',
        transaction_id: `${kind}-${Date.now()}`,
      });
    }
  }

  // Quiet success log — handig bij QA
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.info('[tracking] conversion fired:', kind, payload);
  }
}

export function trackCallClick(source: string) {
  const gadsId = import.meta.env.VITE_GADS_ID as string | undefined;
  const labelCall = import.meta.env.VITE_GADS_CONVERSION_LABEL_CALL as string | undefined;
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
