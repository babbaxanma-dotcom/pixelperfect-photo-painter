import { allowsAnalytics, allowsMarketing } from '@/lib/consent';

/* Microsoft Clarity (heatmaps en sessie-opnames), alleen op /lp/dakwerken.
   Mohammed, 4 okt: "microsoft clarity, zet op dakwerken lp", project ysh2tr1qtp.
   Sinds 31 okt 2025 werkt Clarity voor bezoekers uit de EER pas volledig met een
   toestemmingssignaal (Consent API v2). Zonder toestemming neemt Clarity op zonder cookies;
   met toestemming (analytics + marketing) volledig. Bij een nieuwe keuze gaat het signaal opnieuw. */
const CLARITY_ID = 'ysh2tr1qtp';

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global {
  interface Window { clarity?: ClarityFn }
}

function stuurToestemming() {
  window.clarity?.('consentv2', {
    ad_Storage: allowsMarketing() ? 'granted' : 'denied',
    analytics_Storage: allowsAnalytics() ? 'granted' : 'denied',
  });
}

export function laadClarity() {
  if (typeof window === 'undefined' || window.clarity) return;
  // De officiële Clarity-code, als functie.
  const c = window as Window & { clarity?: ClarityFn };
  c.clarity = c.clarity || (function (...args: unknown[]) { (c.clarity!.q = c.clarity!.q || []).push(args); } as ClarityFn);
  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
  const y = document.getElementsByTagName('script')[0];
  if (y?.parentNode) y.parentNode.insertBefore(t, y); else document.head.appendChild(t);
  stuurToestemming();
  window.addEventListener('ab-bouw-consent-changed', stuurToestemming);
}
