import LpBf from './LpBf';
import { TOTAALRENOVATIE_OUD } from './inhoud-totaalrenovatie-oud';

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
 */
export default function LpRichtprijs() {
  return <LpBf inhoud={TOTAALRENOVATIE_OUD} />;
}
