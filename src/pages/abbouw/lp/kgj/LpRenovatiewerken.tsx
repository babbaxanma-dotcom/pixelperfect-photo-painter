import LpBf from './LpBf';
import { RENOVATIEWERKEN } from './inhoud-renovatiewerken';

/**
 * /lp/aannemer-renovatiewerken: kopie van de totaalrenovatiepagina voor wie een
 * aannemer voor renovatiewerken zoekt (Mohammed, 5 okt 2026, "de drie paginas").
 *
 * 12 okt 2026 (spec/bf-stijl.md §17, bouwstap 6): in de stijl van bfbouw.be via LpBf, met hetzelfde inhoudsobject.
 * Terugval = de regel hieronder terugzetten naar <LpKgj inhoud={RENOVATIEWERKEN} /> (import LpKgj from './LpKgj').
 */
export default function LpRenovatiewerken() {
  return <LpBf inhoud={RENOVATIEWERKEN} />;
}
