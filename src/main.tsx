import { createRoot, hydrateRoot } from "react-dom/client";
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

// 3 nov 2026 (witscherm, zie scripts/prerender-lp.mjs): staat de pagina al als HTML in #root, dan neemt React die over
// (hydrateRoot); de server-HTML blijft zichtbaar tot de route geladen is. Anders, zoals voorheen, een lege root vullen.
const rootEl = document.getElementById("root")!;
// Message match (LpBf: dienst=, dak=, utm_term=) geeft een andere kop en vraag 1 dan de voorgerenderde HTML: dan niet
// hydrateren maar opnieuw opbouwen (zonder dit: React-fouten #418/#425, gevonden door check:lppayload op 3 nov).
// vercel.json stuurt zulke bezoeken al naar de gewone index.html; dit vangt /lp/dakwerken/?utm_term=... (map-index) op.
const zoek = new URLSearchParams(window.location.search);
const metMatch = ["dienst", "dak", "utm_term"].some((k) => (zoek.get(k) || "").trim() !== "");
if (rootEl.dataset.voorgerenderd && rootEl.firstElementChild && !metMatch) {
  // eerst laten tekenen, dan hydrateren: anders schuift de lange hydratatietaak het eerste beeld op (gemeten 3 nov)
  requestAnimationFrame(() => setTimeout(() => hydrateRoot(rootEl, <App />), 0));
} else {
  createRoot(rootEl).render(<App />);
}
