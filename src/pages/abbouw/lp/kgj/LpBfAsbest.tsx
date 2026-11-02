/* /lp/dakwerken/asbest (2 nov 2026, Mohammed: "en dan die aparte sublp voor asbest"): de dakpagina met de inhoud DAKWERKEN_ASBEST
   (eigen kop en subkop, asbestvraag vooraf op Ja). Zelfde opbouw als de bestanden van /lp/totaalrenovatie en /lp/aannemer-renovatiewerken. */
import LpBf from './LpBf';
import { DAKWERKEN_ASBEST } from './inhoud';

export default function LpBfAsbest() {
  return <LpBf inhoud={DAKWERKEN_ASBEST} />;
}
