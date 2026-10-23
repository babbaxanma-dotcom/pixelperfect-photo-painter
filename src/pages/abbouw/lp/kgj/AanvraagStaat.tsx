import { createContext, useContext, useMemo, useRef, useState, type Dispatch, type MutableRefObject, type ReactNode, type SetStateAction } from 'react';
import type { KgjInhoud } from './inhoud';

/**
 * Eén stand voor de aanvraagkaart bovenaan (hero) en die onderaan (#contact), 23 okt 2026.
 *
 * Aanleiding (Clarity, /lp/totaalrenovatie, 23 okt 01:52, gsm): de bezoeker tikte bovenaan "Rijwoning", scrolde naar beneden en
 * tikte "Plan uw gratis plaatsbezoek". Die knop brengt hem naar de kaart onderaan, en die stond opnieuw op vraag 1: elke kaart had
 * zijn eigen useState. Hij tikte niets meer en vertrok. Nu lezen en schrijven beide kaarten dezelfde stand: stap, antwoorden,
 * vinkjes, naam en telefoonnummer. Wie bovenaan begon, gaat onderaan verder waar hij was, en omgekeerd.
 *
 * Per kaart blijft (Aanvraag.tsx): de foutmelding, "Bezig…", de druktoestand en de 200 ms tegen een dubbele tik.
 * Gedeeld zonder nieuwe weergave (refs): welke kaart de bezoeker het laatst gebruikte (alleen die scrolt na een stap en meldt de
 * verste stap aan Clarity), of form_start al vertrok (één keer per bezoek), de verste stap (Terug telt niet) en of er al verstuurd
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
  /** De aanvraag is verstuurd en de vraag uit Toestemming.tsx staat open (in beide kaarten). */
  vraagToestemming: boolean;
};

export type GedeeldeAanvraag = {
  stand: AanvraagStand;
  zet: Dispatch<SetStateAction<AanvraagStand>>;
  actief: MutableRefObject<Plek | null>;
  gestart: MutableRefObject<boolean>;
  verste: MutableRefObject<number>;
  verstuurt: MutableRefObject<boolean>;
};

/* Message match (LpBf match.voor): past dit bij vraag 1, dan begint de kaart bij vraag 2 met dat antwoord. */
export function beginStand(inhoud: KgjInhoud, voor?: { sleutel: string; label: string }): AanvraagStand {
  const vragen = inhoud.aanvraag?.vragen ?? [];
  const vooraf = voor && vragen[0]?.sleutel === voor.sleutel && vragen[0].keuzes.some((k) => k.label === voor.label) ? voor : undefined;
  return { stap: vooraf ? 1 : 0, antwoorden: vooraf ? { [vooraf.sleutel]: vooraf.label } : {}, vinken: {}, naam: '', telefoon: '', vraagToestemming: false };
}

function useMaakGedeeld(begin: () => AanvraagStand): GedeeldeAanvraag {
  const [stand, zet] = useState(begin);
  const actief = useRef<Plek | null>(null);
  const gestart = useRef(false);
  const verste = useRef(stand.stap);
  const verstuurt = useRef(false);
  return useMemo(() => ({ stand, zet, actief, gestart, verste, verstuurt }), [stand]);
}

const Gedeeld = createContext<GedeeldeAanvraag | null>(null);

export function AanvraagStaat({ begin, children }: { begin: () => AanvraagStand; children: ReactNode }) {
  const gedeeld = useMaakGedeeld(begin);
  return <Gedeeld.Provider value={gedeeld}>{children}</Gedeeld.Provider>;
}

/** De gedeelde stand van de pagina, of een eigen stand als er geen AanvraagStaat boven de kaart staat. */
export function useAanvraagStaat(begin: () => AanvraagStand): GedeeldeAanvraag {
  const eigen = useMaakGedeeld(begin);
  return useContext(Gedeeld) ?? eigen;
}

/** Voor de vaste knop op de gsm (LpBf): waar de bezoeker staat, of null zonder AanvraagStaat. gestart = hij tikte al iets aan
    (een vooraf beantwoorde vraag via de zoekterm telt niet); verstuurd = de aanvraag is weg. */
export function useAanvraagVoortgang(): { stap: number; gestart: boolean; verstuurd: boolean } | null {
  const g = useContext(Gedeeld);
  if (!g) return null;
  return { stap: g.stand.stap, gestart: g.gestart.current, verstuurd: g.verstuurt.current || g.stand.vraagToestemming };
}
