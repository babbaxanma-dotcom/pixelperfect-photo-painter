import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureUtm, installCallTracking, trackPageView } from "./lib/tracking";
import { allowsAnalytics, allowsMarketing, installConsentBanner, hasDecided } from "./lib/consent";

// Tracking bootstrap — laadt gtag.js, vangt UTM params, installeert global tel: click handler.
// GDPR: gtag.js wordt NIET geladen vóór consent.
function bootTracking() {
  if (typeof window === 'undefined') return;
  const ga4 = import.meta.env.VITE_GA4_ID as string | undefined;
  const gads = import.meta.env.VITE_GADS_ID as string | undefined;
  const ids = [ga4, gads].filter(Boolean) as string[];

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

  // gtag.js loader — gebruik de eerste ID voor het script (GA4 als beschikbaar, anders Ads)
  const primary = ga4 || gads!;
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
  if (ga4) gtag('config', ga4, { anonymize_ip: true });
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
