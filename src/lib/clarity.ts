import { allowsAnalytics, allowsMarketing } from '@/lib/consent';

/* Microsoft Clarity (heatmaps en sessie-opnames), één project per advertentiepagina.
   Mohammed, 4 okt: "microsoft clarity, zet op dakwerken lp" (ysh2tr1qtp) en "we gaan een
   andere aanmaken voor totaalrenovatie" (ysjtjyakao). Sleutel = bedanktSlug van de LP;
   een LP zonder project laadt niets.
   14 okt, Mohammed: "voeg ook de twee landingspaginas en de home page toe aan clarity": drie nieuwe projecten in zijn
   nieuwe Clarity-account (zelfde account als bfbouw.be). De oude projecten ysh2tr1qtp en ysjtjyakao (ander account)
   krijgen geen nieuwe data meer. Home = de homepagina /. Eén project per bezoek: wie van home naar een LP klikt, blijft
   in het home-project (Clarity wisselt niet van project binnen een sessie).
   Sinds 31 okt 2025 werkt Clarity voor bezoekers uit de EER pas volledig met een
   toestemmingssignaal (Consent API v2). Zonder toestemming neemt Clarity op zonder cookies;
   met toestemming (analytics + marketing) volledig. Bij een nieuwe keuze gaat het signaal opnieuw. */
export const CLARITY_PROJECT: Record<string, string> = {
  dakwerken: 'yxp88pzo3i',
  totaalrenovatie: 'yxp8qe0p9u',
  home: 'yxp937b4f2',
};

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global {
  interface Window { clarity?: ClarityFn }
}

export function stuurClarityToestemming() {
  if (typeof window === 'undefined') return;
  window.clarity?.('consentv2', {
    ad_Storage: allowsMarketing() ? 'granted' : 'denied',
    analytics_Storage: allowsAnalytics() ? 'granted' : 'denied',
  });
}

/* Mohammed, 4 okt: "koppel het dan met de ads dat ik alle data zie van elke klik via de ads".
   Elke advertentieklik zet zijn gegevens in de link: gclid (automatische tagging) en het
   achtervoegsel van de campagne (ads/dakwerken/bouw.cjs, ads/totaalrenovatie/bouw.cjs): utm_campaign, utm_term = het zoekwoord,
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

/* 14 nov 2026 (Mohammed: "fixen dat we bij ab bouw groep website alle klikken krijgen in clarity"): Clarity start vanuit
   index.html, vóór de pagina in beeld staat (daar staat dezelfde lijst, met consentv2 en de advertentietags). Deze lijst is
   de bron voor scripts/check-clarity-start.cjs, die de twee vergelijkt. Elke pagina zonder eigen project gaat naar het
   home-project; /bedankt en /bedankt/<dienst> ook. Niet in de lijst: adressen met een telefoonnummer in het pad (/status,
   /beoordeling) en de pagina's uit de klant-sms'en (/afspraak, /dakinspectie, /review). */
export const CLARITY_PAD: Record<string, string> = {
  '/': CLARITY_PROJECT.home,
  '/over': CLARITY_PROJECT.home,
  '/diensten': CLARITY_PROJECT.home,
  '/werkwijze': CLARITY_PROJECT.home,
  '/contact': CLARITY_PROJECT.home,
  '/construct': CLARITY_PROJECT.home,
  '/ecologisch': CLARITY_PROJECT.home,
  '/interieur': CLARITY_PROJECT.home,
  '/dakwerken': CLARITY_PROJECT.home,
  '/bad': CLARITY_PROJECT.home,
  '/gevel': CLARITY_PROJECT.home,
  '/privacy': CLARITY_PROJECT.home,
  '/voorwaarden': CLARITY_PROJECT.home,
  '/cookies': CLARITY_PROJECT.home,
  '/lp/badkamerrenovatie': CLARITY_PROJECT.home,
  '/badkamerrenovatie': CLARITY_PROJECT.home,
  '/lp/dakwerken': CLARITY_PROJECT.dakwerken,
  '/lp/dakwerken/asbest': CLARITY_PROJECT.dakwerken,
  '/lp/totaalrenovatie': CLARITY_PROJECT.totaalrenovatie,
  '/totaalrenovatie': CLARITY_PROJECT.totaalrenovatie,
  '/lp/aannemer-renovatiewerken': CLARITY_PROJECT.totaalrenovatie,
  '/lp/richtprijs-berekenen': CLARITY_PROJECT.totaalrenovatie,
};

/* Vangnet voor een bezoek waar index.html Clarity niet startte (bv. van een pagina buiten de lijst doorgeklikt naar een
   advertentiepagina). Het toestemmingssignaal bij een nieuwe keuze gaat via main.tsx (stuurClarityToestemming), op elke pagina. */
export function laadClarity(id: string) {
  if (typeof window === 'undefined' || window.clarity) return;
  // De officiële Clarity-code, als functie.
  const c = window as Window & { clarity?: ClarityFn };
  c.clarity = c.clarity || (function (...args: unknown[]) { (c.clarity!.q = c.clarity!.q || []).push(args); } as ClarityFn);
  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://www.clarity.ms/tag/' + id;
  const y = document.getElementsByTagName('script')[0];
  if (y?.parentNode) y.parentNode.insertBefore(t, y); else document.head.appendChild(t);
  stuurClarityToestemming();
  zetAdvertentie();
}
