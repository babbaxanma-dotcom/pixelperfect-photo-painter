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

/* Mohammed, 4 okt: "koppel het dan met de ads dat ik alle data zie van elke klik via de ads".
   Elke advertentieklik zet zijn gegevens in de link: gclid (automatische tagging) en het
   achtervoegsel van de campagne (ads/dakwerken/bouw.cjs): utm_campaign, utm_term = het zoekwoord,
   dienst= of dak= = de advertentiegroep of sitelink. Die gaan als tags mee met de opname,
   zodat je in Clarity filtert op Filters > Aangepaste tags (bron = Google Ads, zoekwoord, ...).
   Een advertentiebezoek krijgt ook "upgrade": Clarity bewaart die opname altijd. */
function zetAdvertentie() {
  const p = new URLSearchParams(window.location.search);
  const klik = p.get('gclid') || p.get('gbraid') || p.get('wbraid');
  const advertentie = Boolean(klik) || (p.get('utm_source') === 'google' && p.get('utm_medium') === 'cpc');
  const zet = (sleutel: string, waarde: string | null) => { if (waarde) window.clarity?.('set', sleutel, waarde); };
  zet('bron', advertentie ? 'Google Ads' : 'geen advertentie');
  zet('zoekwoord', p.get('utm_term'));
  zet('campagne', p.get('utm_campaign'));
  zet('dienst', p.get('dienst') || (p.get('dak') ? 'dak-' + p.get('dak') : null));
  zet('klik-id', klik);
  if (advertentie) window.clarity?.('upgrade', 'Google Ads-klik');
}

/* Een stap in de opname (rekenaar: vraag-2 ... contactgegevens, aanvraag-verstuurd). In Clarity
   te filteren via Filters > Aangepaste gebeurtenissen. Zonder Clarity op de pagina: niets. */
export function meldClarity(gebeurtenis: string) {
  if (typeof window !== 'undefined') window.clarity?.('event', gebeurtenis);
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
  zetAdvertentie();
  window.addEventListener('ab-bouw-consent-changed', stuurToestemming);
}
