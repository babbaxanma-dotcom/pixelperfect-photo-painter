/**
 * De iconen uit de referentie, nagetekend op de gemeten maat.
 * Lijniconen hebben 1,5px lijndikte, gevulde glyphs staan in een cirkel of tegel.
 */

type P = { className?: string };

export const IcFacebook = ({ className }: P) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M9.6 16V9.2h2.3l.35-2.7H9.6V4.78c0-.78.22-1.31 1.34-1.31h1.4V1.06A19.3 19.3 0 0 0 10.3.95C8.28.95 6.9 2.18 6.9 4.45V6.5H4.6v2.7h2.3V16h2.7Z" />
  </svg>
);

export const IcLinkedIn = ({ className }: P) => (
  <svg className={className} width="11" height="10" viewBox="0 0 11 10" fill="currentColor" aria-hidden="true">
    <path d="M2.3 10H.4V3.3h1.9V10ZM1.35 2.45a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2ZM10.6 10H8.7V6.72c0-.86-.31-1.3-.93-1.3-.67 0-1.02.45-1.02 1.3V10H4.86V3.3h1.89v.86s.57-1.05 1.91-1.05c1.35 0 1.94.82 1.94 2.4V10Z" />
  </svg>
);

export const IcYouTube = ({ className }: P) => (
  <svg className={className} width="12" height="10" viewBox="0 0 12 10" fill="currentColor" aria-hidden="true">
    <path d="M11.53 1.9A1.5 1.5 0 0 0 10.47.85C9.53.6 6 .6 6 .6s-3.53 0-4.47.25A1.5 1.5 0 0 0 .47 1.9C.22 2.83.22 5 .22 5s0 2.17.25 3.1a1.5 1.5 0 0 0 1.06 1.05C2.47 9.4 6 9.4 6 9.4s3.53 0 4.47-.25a1.5 1.5 0 0 0 1.06-1.05C11.78 7.17 11.78 5 11.78 5s0-2.17-.25-3.1ZM4.87 6.8V3.2L7.9 5 4.87 6.8Z" />
  </svg>
);

export const IcX = ({ className }: P) => (
  <svg className={className} width="10" height="11" viewBox="0 0 10 11" fill="currentColor" aria-hidden="true">
    <path d="M7.83.5h1.5L6.06 4.24 9.9 9.32H6.9L4.55 6.25 1.86 9.32H.36l3.5-4L.18.5h3.08l2.12 2.8L7.83.5Zm-.53 7.92h.83L2.84 1.34h-.9L7.3 8.42Z" />
  </svg>
);

export const IcPin = ({ className }: P) => (
  <svg className={className} width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.5 5.9c0 3.3-4.5 7.1-4.5 7.1S1.5 9.2 1.5 5.9a4.5 4.5 0 0 1 9 0Z" />
    <circle cx="6" cy="5.8" r="1.7" />
  </svg>
);

export const IcMail = ({ className }: P) => (
  <svg className={className} width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="1.4" width="13" height="10.2" rx="1.8" />
    <path d="m1.6 2.6 5.9 4.2 5.9-4.2" />
  </svg>
);

export const IcTelefoon = ({ className }: P) => (
  <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
    <path d="M7.4 3.1c.4-.3 1-.2 1.3.2l1.8 2.6c.3.4.2.9-.1 1.2l-1.1 1c-.2.2-.3.5-.2.8.5 1.4 1.9 3.2 3.6 4.3.3.2.6.1.8-.1l1-1c.3-.3.8-.4 1.2-.2l2.7 1.6c.5.3.6.9.3 1.3l-1.2 1.6c-.5.7-1.4 1-2.2.8-2.2-.6-4.6-2.2-6.4-4.1C7 11 5.6 8.7 5.1 6.6c-.2-.8.1-1.6.8-2.1l1.5-1.4Z" />
  </svg>
);

/** Camera-icoon voor de opnameknop op de schets. */
export const IcCamera = ({ className, maat = 26 }: P & { maat?: number }) => (
  <svg className={className} width={maat} height={maat} viewBox="0 0 26 26" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.6h3.4l1.7-2.6h9.8l1.7 2.6H23a1 1 0 0 1 1 1v9.8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9.6a1 1 0 0 1 1-1Z" />
    <circle cx="13" cy="14.2" r="4.1" />
  </svg>
);

export const IcPijl = ({ className, maat = 8 }: P & { maat?: number }) => (
  <svg className={className} width={maat} height={maat} viewBox="0 0 8 8" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 7 7 1M2.4 1H7v4.6" />
  </svg>
);

export const IcChevron = ({ className, richting = 'onder' }: P & { richting?: 'onder' | 'boven' | 'links' | 'rechts' }) => {
  const d = { onder: 'm1 1 4 4 4-4', boven: 'm1 5 4-4 4 4', links: 'm5 1-4 4 4 4', rechts: 'm1 1 4 4-4 4' }[richting];
  const maat = richting === 'onder' || richting === 'boven'
    ? { w: 10, h: 6, vb: '0 0 10 6' } : { w: 6, h: 10, vb: '0 0 6 10' };
  return (
    <svg className={className} width={maat.w} height={maat.h} viewBox={maat.vb} fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
};

export const IcPersoon = ({ className }: P) => (
  <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7" cy="4.6" r="2.6" />
    <path d="M1.8 12.4c0-2.4 2.3-3.9 5.2-3.9s5.2 1.5 5.2 3.9" />
  </svg>
);

export const IcBericht = ({ className }: P) => (
  <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12.4 8.6a1.6 1.6 0 0 1-1.6 1.6H4.4L1.6 13V3a1.6 1.6 0 0 1 1.6-1.6h7.6A1.6 1.6 0 0 1 12.4 3v5.6Z" />
  </svg>
);

export const IcSter = ({ className }: P) => (
  <svg className={className} width="15" height="14" viewBox="0 0 15 14" fill="currentColor" aria-hidden="true">
    <path d="M7.5 0l2.02 4.5 4.98.45-3.75 3.2 1.1 4.85L7.5 10.4 3.15 13l1.1-4.85L.5 4.95l4.98-.45L7.5 0Z" />
  </svg>
);

/**
 * De zonnestraal-sticker uit de aanbodkaarten: een onregelmatige ster met
 * zestien punten en een handgetekende omlijning. De punten wisselen bewust in
 * lengte — een regelmatige ster leest als een clipart-badge.
 */
export const IcZonnestraal = ({ className }: P) => {
  const punten = 16;
  const lengtes = [1, 0.93, 1, 0.9, 1, 0.95, 1, 0.88, 1, 0.94, 1, 0.91, 1, 0.96, 1, 0.89];
  const d = Array.from({ length: punten * 2 }, (_, i) => {
    const hoek = (Math.PI * i) / punten - Math.PI / 2;
    const buiten = i % 2 === 0;
    const r = buiten ? 49 * lengtes[i / 2 | 0] : 35;
    return `${50 + r * Math.cos(hoek) * 0.78},${50 + r * Math.sin(hoek) * 0.94}`;
  }).join(' L');
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d={`M${d} Z`} fill="currentColor" stroke="#0a1628" strokeWidth="2.6" strokeLinejoin="round" />
    </svg>
  );
};

/* ── De vijf stapiconen, elk 28x27 met lijndikte 1,6 ── */
const stap = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/** Stap 1 — bellen of mailen. */
export const IcStapBel = ({ className }: P) => (
  <svg className={className} width="28" height="27" viewBox="0 0 28 27" {...stap} aria-hidden="true">
    <rect x="1.5" y="6" width="17" height="12.5" rx="2" />
    <path d="m2.4 7.2 7.6 5.4 7.6-5.4" />
    <path d="M18.5 19.4c1.3 2.3 3.3 4.1 5.6 5.2M20.6 15.8c2 .9 3.7 2.4 4.8 4.3" />
  </svg>
);

/** Stap 2 — het plaatsbezoek: een woning met een loep. */
export const IcStapBezoek = ({ className }: P) => (
  <svg className={className} width="28" height="27" viewBox="0 0 28 27" {...stap} aria-hidden="true">
    <path d="M2 11.6 12.4 3l10.4 8.6" />
    <path d="M4.7 13.6V23a1.4 1.4 0 0 0 1.4 1.4h5.2" />
    <circle cx="19.4" cy="18.4" r="5" />
    <path d="m23.2 22.2 3.3 3.2" />
  </svg>
);

/** Stap 3 — opmeten en offerte: rolmeter op een plan. */
export const IcStapMeten = ({ className }: P) => (
  <svg className={className} width="28" height="27" viewBox="0 0 28 27" {...stap} aria-hidden="true">
    <rect x="1.6" y="2.4" width="18" height="22" rx="2" />
    <path d="M5.4 7.6h10M5.4 12h10M5.4 16.4h6" />
    <path d="M20.8 13.4h5.6v9.4a1.6 1.6 0 0 1-1.6 1.6h-2.4a1.6 1.6 0 0 1-1.6-1.6Z" />
    <path d="M22.2 16.2v2M24.8 16.2v2" />
  </svg>
);

/** Stap 4 — de werf start: truweel. */
export const IcStapWerf = ({ className }: P) => (
  <svg className={className} width="28" height="27" viewBox="0 0 28 27" {...stap} aria-hidden="true">
    <path d="M15.6 2.4 25 11.8l-8.2 8.2a3 3 0 0 1-4.2 0l-5-5a3 3 0 0 1 0-4.2Z" />
    <path d="m11.4 14.6-8 8" />
    <path d="M2.4 21.2 5 23.8" />
  </svg>
);

/** Stap 5 — de laatste ronde: lijstje met vinkjes. */
export const IcStapOplevering = ({ className }: P) => (
  <svg className={className} width="28" height="27" viewBox="0 0 28 27" {...stap} aria-hidden="true">
    <rect x="3.4" y="3.6" width="19" height="21" rx="2" />
    <path d="M9.4 1.6h7.2v4H9.4Z" />
    <path d="m7.6 12 2 2 3.6-3.8M7.6 18.6l2 2 3.6-3.8" />
    <path d="M15.8 12.6h3.2M15.8 19.2h3.2" />
  </svg>
);

/**
 * De handgetekende boog tussen twee stappen: 174x32, lijndikte 1,6, met een
 * open pijlpunt. `bol` keert de kromming om, net als in de referentie waar de
 * middelste boog de andere kant op buigt.
 */
export const IcBoog = ({ className, bol = false }: P & { bol?: boolean }) => (
  <svg className={className} width="174" height="32" viewBox="0 0 174 32" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={bol ? 'M2 26C34 4 72 1 112 6c22 3 40 9 58 18' : 'M2 6C34 28 72 31 112 26c22-3 40-9 58-18'} />
    <path d={bol ? 'm163 18 9 6-3-10' : 'm163 14 9-6-3 10'} />
  </svg>
);

export const IcKlok = ({ className }: P) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="9" r="7.4" />
    <path d="M9 4.6V9l2.8 1.7" />
  </svg>
);

/**
 * Het Google-beeldmerk in de vier merkkleuren, gebruikt om te tonen dat een
 * beoordeling van Google komt. Google staat dat gebruik toe voor precies die
 * attributie — mits de beoordeling ook werkelijk van Google komt.
 */
export const IcGoogle = ({ className }: P) => (
  <svg className={className} width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.4Z" />
    <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.6-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46Z" />
    <path fill="#FBBC05" d="M11.6 28.1c-.4-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.7H4.3A22 22 0 0 0 2 24c0 3.6.9 6.9 2.3 9.8l7.3-5.7Z" />
    <path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.3 30 2 24 2 15.4 2 7.9 6.9 4.3 14.2l7.3 5.7c1.8-5.2 6.6-9.1 12.4-9.1Z" />
  </svg>
);
/* De drie lijntjes en het kruis van het mobiele menu. Dezelfde maat en dikte
   als de knop op de gewone paginas gebruikt, zodat de kop op een telefoon
   overal hetzelfde aanvoelt. */
export const IcBurger = ({ className }: P) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IcKruis = ({ className }: P) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
