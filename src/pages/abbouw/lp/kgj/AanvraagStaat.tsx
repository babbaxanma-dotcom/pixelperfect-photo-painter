import { createContext, useContext, useEffect, useMemo, useRef, useState, type Dispatch, type MutableRefObject, type ReactNode, type SetStateAction } from 'react';
import { meldClarity } from '@/lib/clarity';
import { vraagTelt, type KgjInhoud } from './inhoud';

/**
 * Eén stand voor de aanvraagkaart bovenaan (hero) en die onderaan (#contact), 23 okt 2026.
 *
 * Aanleiding (Clarity, /lp/totaalrenovatie, 23 okt 01:52, gsm): de bezoeker tikte bovenaan "Rijwoning", scrolde naar beneden en
 * tikte "Plan uw gratis plaatsbezoek". Die knop brengt hem naar de kaart onderaan, en die stond opnieuw op vraag 1: elke kaart had
 * zijn eigen useState. Hij tikte niets meer en vertrok. Nu lezen en schrijven beide kaarten dezelfde stand: stap, antwoorden,
 * vinkjes, naam, telefoonnummer, de foutmelding en "Bezig…". Wie bovenaan begon, gaat onderaan verder waar hij was, en omgekeerd.
 *
 * Per kaart blijft (Aanvraag.tsx): de druktoestand, de 200 ms tegen een dubbele tik, de verste stap voor Clarity (elke kaart meldt
 * wat de bezoeker in die kaart deed) en een bevroren beeld van de kaart bovenaan zolang ze buiten beeld is.
 * Gedeeld zonder nieuwe weergave (refs): welke kaart de bezoeker het laatst gebruikte (alleen die scrolt na een stap, spreekt
 * "Stap x van y" uit en toont de foutmelding als melding), of form_start al vertrok (één keer per bezoek) en of er al verstuurd
 * wordt (nooit twee aanvragen, ook niet uit de twee kaarten samen).
 *
 * Zonder AanvraagStaat erboven (een losse kaart) heeft de kaart haar eigen stand, zoals vóór 23 okt.
 */

export type Plek = 'hero' | 'onder';

export type AanvraagStand = {
  stap: number;
  antwoorden: Record<string, string>;
  vinken: Record<string, string[]>;
  naam: string;
  telefoon: string;
  /** 2 nov 2026: het e-mailadres op de contactstap (offerte), gedeeld zoals naam en nummer. */
  email?: string;
  /** De bezoeker tikte of typte al iets. Een vraag die de zoekterm vooraf beantwoordde (message match) telt niet. */
  aangetikt: boolean;
  fout: string | null;
  bezig: boolean;
  /** De aanvraag is verstuurd en de vraag uit Toestemming.tsx staat open (in beide kaarten). */
  vraagToestemming: boolean;
  /** 29 okt 2026: de bezoeker koos "Klik dan hier" (offerte) en sloeg de vragen over. */
  offerte?: boolean;
  /** 30 okt 2026: de stap binnen de offerte (keuzelijsten, Doorgaan) en de antwoorden daar; gelijk aan het aantal stappen = de contactstap. */
  offerteStap?: number;
  offerteAntw?: Record<string, string>;
  /** 7 nov 2026: vragen die de pagina vooraf beantwoordde en die in beide kaarten wegvallen (message match op het soort dak, nu vraag 2;
      zoals bfbouw.be data-voor op plat-dak/hellend-dak). */
  overslaan?: string[];
  /** 7 nov 2026 (zoals bfbouw.be rk__gekozen): de knop "Ik ben op zoek naar" die de kaart startte; de kaart toont "Uw keuze: ..." bij de
      vragen erna, zolang dat antwoord blijft staan. */
  gekozen?: { sleutel: string; label: string };
};

export type GedeeldeAanvraag = {
  stand: AanvraagStand;
  zet: Dispatch<SetStateAction<AanvraagStand>>;
  actief: MutableRefObject<Plek | null>;
  gestart: MutableRefObject<boolean>;
  verstuurt: MutableRefObject<boolean>;
};

/* Message match (LpBf match.voor): past dit bij vraag 1, dan begint de kaart bij vraag 2 met dat antwoord. */
export function beginStand(inhoud: KgjInhoud, voor?: { sleutel: string; label: string }): AanvraagStand {
  const vragen = inhoud.aanvraag?.vragen ?? [];
  const vooraf = voor && vragen[0]?.sleutel === voor.sleutel && vragen[0].keuzes.some((k) => k.label === voor.label) ? voor : undefined;
  /* 2 nov 2026 (/lp/dakwerken/asbest): een latere vraag kan ook vooraf beantwoord zijn (Asbest = Ja). Het antwoord staat dan meteen in de
     aanvraag; de vraag zelf valt weg via haar nietAls in het inhoudsobject. De kaart begint gewoon bij vraag 1. */
  const later = !vooraf && voor && vragen.some((v, i) => i > 0 && v.sleutel === voor.sleutel && v.keuzes.some((k) => k.label === voor.label)) ? voor : undefined;
  const antwoord = vooraf ?? later;
  /* 7 nov 2026: een vooraf beantwoorde latere vraag valt weg in beide kaarten (overslaan), zoals bfbouw.be data-voor. */
  return { stap: vooraf ? 1 : 0, antwoorden: antwoord ? { [antwoord.sleutel]: antwoord.label } : {}, vinken: {}, naam: '', telefoon: '',
    aangetikt: false, fout: null, bezig: false, vraagToestemming: false, ...(later ? { overslaan: [later.sleutel] } : {}) };
}

function useMaakGedeeld(begin: () => AanvraagStand): GedeeldeAanvraag {
  const [stand, zet] = useState(begin);
  const actief = useRef<Plek | null>(null);
  const gestart = useRef(false);
  const verstuurt = useRef(false);
  return useMemo(() => ({ stand, zet, actief, gestart, verstuurt }), [stand]);
}

/* 5 nov 2026, zoals bfbouw.be 4 nov (cad4e57, bf_aanvraag): na de laatste vraag staan de antwoorden in sessionStorage, per tabblad.
   Keert de bezoeker in hetzelfde tabblad terug (vanuit Google, een nieuwe advertentieklik, herladen), dan staat de kaart meteen op
   het contactscherm met al zijn antwoorden, in de pagina (niet over het volle scherm). "Antwoorden opgeslagen" in de laadstap is
   dus waar. Na een geslaagde aanvraag gaat de sleutel weg. Naam, telefoon en e-mail worden NIET bewaard. */
export const BEWAAR_SLEUTEL = 'ab_aanvraag';
export function bewaarAanvraag(antwoorden: Record<string, string>, vinken: Record<string, string[]>) {
  try { sessionStorage.setItem(BEWAAR_SLEUTEL, JSON.stringify({ pad: window.location.pathname, antwoorden, vinken })); } catch { /* niets */ }
}
export function wisAanvraag() {
  try { sessionStorage.removeItem(BEWAAR_SLEUTEL); } catch { /* niets */ }
}
/** De bewaarde antwoorden van deze pagina als stand op het contactscherm, of null (andere pagina, niets bewaard, een vraag open). */
export function hersteldeStand(inhoud: KgjInhoud, nu: AanvraagStand): AanvraagStand | null {
  let b: { pad?: string; antwoorden?: Record<string, string>; vinken?: Record<string, string[]> } | null = null;
  try { b = JSON.parse(sessionStorage.getItem(BEWAAR_SLEUTEL) || 'null'); } catch { b = null; }
  if (!b || b.pad !== window.location.pathname || !b.antwoorden) return null;
  const antwoorden = { ...b.antwoorden, ...nu.antwoorden };
  const vragen = (inhoud.aanvraag?.vragen ?? []).filter((v) => vraagTelt(v, antwoorden) && !nu.overslaan?.includes(v.sleutel));
  if (!vragen.length || vragen.some((v) => !antwoorden[v.sleutel])) return null;
  return { ...nu, antwoorden, vinken: b.vinken ?? {}, stap: vragen.length, aangetikt: true, fout: null };
}

const Gedeeld = createContext<GedeeldeAanvraag | null>(null);

export function AanvraagStaat({ begin, inhoud, children }: { begin: () => AanvraagStand; inhoud?: KgjInhoud; children: ReactNode }) {
  const gedeeld = useMaakGedeeld(begin);
  const { zet } = gedeeld;
  /* Terugzetten pas na het hydrateren: de voorgerenderde HTML (scripts/prerender-lp.mjs) staat op vraag 1; een andere eerste stand
     gaf React-fout #418. Clarity-gebeurtenis aanvraag-hersteld. */
  useEffect(() => {
    if (!inhoud?.aanvraag) return;
    let hersteld = false;
    zet((s) => { const h = hersteldeStand(inhoud, s); hersteld = !!h; return h ?? s; });
    if (hersteld) meldClarity('aanvraag-hersteld');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Gedeeld.Provider value={gedeeld}>{children}</Gedeeld.Provider>;
}

/** De gedeelde stand van de pagina, of een eigen stand als er geen AanvraagStaat boven de kaart staat. */
export function useAanvraagStaat(begin: () => AanvraagStand): GedeeldeAanvraag {
  const eigen = useMaakGedeeld(begin);
  return useContext(Gedeeld) ?? eigen;
}

/** Voor de vaste knop op de gsm (LpBf): waar de bezoeker staat, of null zonder AanvraagStaat. */
export function useAanvraagVoortgang(): { stap: number; aangetikt: boolean; verstuurd: boolean; antwoorden: Record<string, string>; overslaan?: string[] } | null {
  const g = useContext(Gedeeld);
  if (!g) return null;
  return { stap: g.stand.stap, aangetikt: g.stand.aangetikt, verstuurd: g.stand.bezig || g.stand.vraagToestemming, antwoorden: g.stand.antwoorden, overslaan: g.stand.overslaan };
}
/** Telt deze vraag in deze stand? vraagTelt + de vragen die de pagina vooraf beantwoordde (overslaan). Eén regel voor beide kaarten en de vaste knop. */
export function telt(v: Parameters<typeof vraagTelt>[0], s: { antwoorden: Record<string, string>; overslaan?: string[] }): boolean {
  return vraagTelt(v, s.antwoorden) && !s.overslaan?.includes(v.sleutel);
}
/** De gedeelde stand zelf (null zonder AanvraagStaat), voor de knoppen "Ik ben op zoek naar" (LpBf, 7 nov 2026). */
export function useGedeeldeAanvraag(): GedeeldeAanvraag | null {
  return useContext(Gedeeld);
}
