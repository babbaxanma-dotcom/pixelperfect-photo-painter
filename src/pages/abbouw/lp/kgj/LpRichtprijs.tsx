import LpBf from './LpBf';
import { TOTAALRENOVATIE } from './inhoud-totaalrenovatie';

/**
 * /lp/richtprijs-berekenen = de totaalrenovatiepagina zoals ze tot 5 okt 2026
 * 20:47 live stond, met de rekenaar in de hero (inhoud van commit 6955c93).
 *
 * Mohammed, 6 okt: "wat al werkte, met de prijs searches etc, VOLLEDIG ZO
 * LATEN, dus al die mensen moeten naar de vorige landingspagina met de
 * rekenaar". De prijs- en woningzoekwoorden van de Google Ads-campagne sturen
 * hierheen; de bouncers (aannemer-zoekwoorden) gaan naar de nieuwe pagina's
 * /lp/totaalrenovatie en /lp/aannemer-renovatiewerken. De bron in het CRM
 * blijft lp:totaalrenovatie:rekenaar, zoals vóór 5 okt.
 *
 * 12 okt 2026 (spec/bf-stijl.md §17, bouwstap 4): in de stijl van bfbouw.be via LpBf, met hetzelfde inhoudsobject.
 * Terugval = de regel hieronder terugzetten naar <LpKgj inhoud={TOTAALRENOVATIE_OUD} /> (import LpKgj from './LpKgj').
 *
 * 13 okt 2026 avond, Mohammed: "maak de totaalrenovatie pagina weer rekenaar, gefocust om het berekenen, zoals dakwerken"
 * en "die hele onderverdeling van ad groups onnodig": deze URL (prijs- en woningzoekwoorden) toont dezelfde rekenaarpagina
 * als /lp/totaalrenovatie. Bron in het CRM blijft lp:totaalrenovatie:rekenaar, zoals voorheen.
 * Terugval naar de oude pagina = TOTAALRENOVATIE_OUD (inhoud-totaalrenovatie-oud.ts) weer importeren en tonen.
 */
export default function LpRichtprijs() {
  return <LpBf inhoud={TOTAALRENOVATIE} />;
}
