import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureUtm, installCallTracking, trackPageView } from "./lib/tracking";
import { installConsentBanner, syncConsentToGtag } from "./lib/consent";

// gtag.js + Consent Mode v2 zijn al in index.html geladen (zie <head>). Hier
// alleen: SPA page-view tracking, UTM capture, tel: click listener, en de
// consent-state syncen naar gtag bij elke navigatie/keuze.
export function isLpPath(path: string): boolean {
  return path.startsWith('/lp/') || path.startsWith('/lokaal/') || path === '/bedankt' || path.startsWith('/bedankt');
}

function bootTracking() {
  if (typeof window === 'undefined') return;

  captureUtm();
  installCallTracking();
  syncConsentToGtag();

  trackPageView(window.location.pathname);

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

  window.addEventListener('ab-bouw-consent-changed', () => syncConsentToGtag());
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installConsentBanner, { once: true });
  } else {
    installConsentBanner();
  }
}

bootTracking();

createRoot(document.getElementById("root")!).render(<App />);
