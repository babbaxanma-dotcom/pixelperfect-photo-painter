import { createContext, useContext, useMemo, useRef, useState, type Dispatch, type MutableRefObject, type ReactNode, type SetStateAction } from 'react';
import type { KgjInhoud } from './inhoud';

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
  /** De bezoeker tikte of typte al iets. Een vraag die de zoekterm vooraf beantwoordde (message match) telt niet. */
  aangetikt: boolean;
  fout: string | null;
  bezig: boolean;
  /** De aanvraag is verstuurd en de vraag uit Toestemming.tsx staat open (in beide kaarten). */
  vraagToestemming: boolean;
  /** 29 okt 2026: de bezoeker koos "Klik dan hier" (offerte) en sloeg de vragen over. */
  offerte?: boolean;
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
  return { stap: vooraf ? 1 : 0, antwoorden: vooraf ? { [vooraf.sleutel]: vooraf.label } : {}, vinken: {}, naam: '', telefoon: '',
    aangetikt: false, fout: null, bezig: false, vraagToestemming: false };
}

function useMaakGedeeld(begin: () => AanvraagStand): GedeeldeAanvraag {
  const [stand, zet] = useState(begin);
  const actief = useRef<Plek | null>(null);
  const gestart = useRef(false);
  const verstuurt = useRef(false);
  return useMemo(() => ({ stand, zet, actief, gestart, verstuurt }), [stand]);
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

/** Voor de vaste knop op de gsm (LpBf): waar de bezoeker staat, of null zonder AanvraagStaat. */
export function useAanvraagVoortgang(): { stap: number; aangetikt: boolean; verstuurd: boolean } | null {
  const g = useContext(Gedeeld);
  if (!g) return null;
  return { stap: g.stand.stap, aangetikt: g.stand.aangetikt, verstuurd: g.stand.bezig || g.stand.vraagToestemming };
}
