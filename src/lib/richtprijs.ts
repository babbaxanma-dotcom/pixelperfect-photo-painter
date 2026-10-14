/* Richtprijs van de rekenaar (14 okt 2026, Mohammed: "zoals bf en je werkt gewoon voor alles veilige richtprijzen uit,
   realistisch, en heel accuraat"). Zelfde rekenregel als bfbouw.be (src/js/site.js bfVork): totaal excl. btw uit een
   prijstabel, minimum met 6 % btw, maximum met 6 % (woning ouder dan 10 jaar) of 21 %, minimum naar beneden en maximum naar
   boven afgerond op € 500. Asbest: "Ja, vermoedelijk" telt in minimum en maximum, "Weet ik niet zeker" alleen in het maximum.

   Dak: src/data/dakprijzen.json (scripts/maak-dakprijzen.cjs, Norvo-kostenmotor). Herstelling: geen bedrag (niet te begroten
   zonder te kijken); de rekenaar belooft dan ook geen prijs op het volgende scherm.
   Renovatie: src/data/renovatieprijzen.ts (Belgische bronnen per post). */
import DAK from '@/data/dakprijzen.json';
import { renovatieExcl } from '@/data/renovatieprijzen';

const TABEL = DAK.tabel as unknown as Record<string, [number, number]>;
const ASBEST = DAK.asbest as unknown as Record<string, [number, number]>;

export type Vork = { min: number; max: number; asbest: boolean };
export type Antwoorden = Record<string, string | undefined>;

const SLEUTEL = 'ab_richtprijs';

function metBtw(minExcl: number, maxExcl: number, leeftijd: string | undefined): { min: number; max: number } {
  return {
    min: Math.floor((minExcl * 1.06) / 500) * 500,
    max: Math.ceil((maxExcl * (leeftijd === 'Ouder dan 10 jaar' ? 1.06 : 1.21)) / 500) * 500,
  };
}

export function dakVork(a: Antwoorden): Vork | null {
  if (!a.Dak || !a.Werk || !a.Grootte || a.Werk === 'Herstelling') return null;
  const k = (a.Werk === 'Isolatie'
    ? [a.Dak, a.Werk, a.Grootte]
    : [a.Dak, a.Werk, a.Isolatie || 'Zonder isolatie', a.Bedekking || 'Weet ik nog niet', a.Grootte]).join('|');
  const t = TABEL[k];
  if (!t) return null;
  const as = ASBEST[k] ?? [0, 0];
  const ja = a.Asbest === 'Ja, vermoedelijk';
  const mss = a.Asbest === 'Weet ik niet zeker';
  const { min, max } = metBtw(t[0] + (ja ? as[0] : 0), t[1] + (ja || mss ? as[1] : 0), a.Leeftijd);
  return { min, max, asbest: (ja || mss) && !!ASBEST[k] };
}

export function renovatieVork(a: Antwoorden): Vork | null {
  const r = renovatieExcl(a);
  if (!r) return null;
  const { min, max } = metBtw(r[0], r[1], a.Leeftijd);
  return { min, max, asbest: false };
}

/** Vork voor de rekenaar van deze divisie, of null als er geen eerlijke prijs te geven is. */
export function berekenVork(divisie: string, a: Antwoorden): Vork | null {
  return divisie === 'ab_dakwerken' ? dakVork(a) : renovatieVork(a);
}

export const bedrag = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Bewaard voor de bedankpagina (zelfde tab, dezelfde funnel). */
export function bewaarVork(v: Vork) {
  try { sessionStorage.setItem(SLEUTEL, JSON.stringify(v)); } catch { /* geen opslag: de bedankpagina toont dan geen bedrag */ }
}
export function leesVork(): Vork | null {
  try { const s = sessionStorage.getItem(SLEUTEL); return s ? (JSON.parse(s) as Vork) : null; } catch { return null; }
}
