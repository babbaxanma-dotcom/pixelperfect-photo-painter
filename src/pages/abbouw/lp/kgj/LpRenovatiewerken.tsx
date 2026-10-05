import LpKgj from './LpKgj';
import { RENOVATIEWERKEN } from './inhoud-renovatiewerken';

/**
 * /lp/aannemer-renovatiewerken: kopie van de totaalrenovatiepagina voor wie een
 * aannemer voor renovatiewerken zoekt (Mohammed, 5 okt 2026, "de drie paginas").
 */
export default function LpRenovatiewerken() {
  return <LpKgj inhoud={RENOVATIEWERKEN} />;
}
