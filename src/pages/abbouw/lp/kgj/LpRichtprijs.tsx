import LpKgj from './LpKgj';
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
 */
export default function LpRichtprijs() {
  return <LpKgj inhoud={TOTAALRENOVATIE_OUD} />;
}
