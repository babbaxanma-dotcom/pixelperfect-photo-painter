import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureUtm, installCallTracking, trackPageView } from "./lib/tracking";
import { allowsAnalytics, allowsMarketing, installConsentBanner, hasDecided } from "./lib/consent";

// Tracking bootstrap — laadt gtag.js, vangt UTM params, installeert global tel: click handler.
// GDPR: gtag.js wordt NIET geladen vóór consent.
// LP-routes krijgen events naar GA4_LP property; al de rest naar GA4_MAIN.
// LP-set: /lp/*, /lokaal/*, /bedankt
export function isLpPath(path: string): boolean {
  return path.startsWith('/lp/') || path.startsWith('/lokaal/') || path === '/bedankt' || path.startsWith('/bedankt');
}

function bootTracking() {
  if (typeof window === 'undefined') return;
  const ga4Main = import.meta.env.VITE_GA4_ID as string | undefined;
  const ga4Lp = import.meta.env.VITE_GA4_ID_LP as string | undefined;
  const gads = import.meta.env.VITE_GADS_ID as string | undefined;
  const ids = [ga4Main, ga4Lp, gads].filter(Boolean) as string[];

  captureUtm();
  installCallTracking();

  if (ids.length === 0) return;
  // GDPR: alleen tracking laden als consent gegeven
  const analyticsOk = allowsAnalytics();
  const marketingOk = allowsMarketing();
  if (!analyticsOk && !marketingOk) {
    // Wacht op consent — herstart bootTracking als consent gegeven wordt
    if (!hasDecided()) {
      window.addEventListener('ab-bouw-consent-changed', () => bootTracking(), { once: true });
    }
    return;
  }

  // gtag.js loader — gebruik de eerste beschikbare ID voor het script-load
  const primary = ga4Main || ga4Lp || gads!;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${primary}`;
  document.head.appendChild(s);

  // dataLayer init + configs
  (window as unknown as { dataLayer: unknown[] }).dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer || [];
  function gtag(...args: unknown[]) {
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
  }
  (window as unknown as { gtag: typeof gtag }).gtag = gtag;
  gtag('js', new Date());
  // Beide GA4 properties configureren — send_page_view UIT, we vuren handmatig
  // per pad naar de juiste property
  if (ga4Main) gtag('config', ga4Main, { anonymize_ip: true, send_page_view: false });
  if (ga4Lp) gtag('config', ga4Lp, { anonymize_ip: true, send_page_view: false });
  if (gads) gtag('config', gads);

  trackPageView(window.location.pathname);

  // SPA route changes — push een page_view bij elke history change
  let lastPath = window.location.pathname;
  const checkPath = () => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageView(lastPath);
    }
  };
  window.addEventListener('popstate', checkPath);
  const origPush = history.pushState;
  history.pushState = function (...args) {
    const r = origPush.apply(this, args as Parameters<typeof history.pushState>);
    queueMicrotask(checkPath);
    return r;
  };
}

// Toon cookie banner (GDPR) — als nog geen keuze gemaakt is.
if (typeof window !== 'undefined') {
  // Wacht op DOMContentLoaded zodat document.body bestaat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installConsentBanner, { once: true });
  } else {
    installConsentBanner();
  }
}

bootTracking();

createRoot(document.getElementById("root")!).render(<App />);
