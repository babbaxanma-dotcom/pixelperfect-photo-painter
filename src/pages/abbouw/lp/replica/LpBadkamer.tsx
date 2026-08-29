/**
 * Landingspagina badkamerrenovatie.
 *
 * Zelfde opzet, stijl en gedrag als de totaalrenovatie-pagina; alleen de
 * inhoud verschilt. Die staat in inhoud.ts, zodat een correctie aan de
 * carrousel, het formulier of de calculator meteen voor beide pagina's geldt.
 */
import LpReplica from './LpReplica';
import { BADKAMER } from './inhoud';

export default function LpBadkamer() {
  return <LpReplica inhoud={BADKAMER} />;
}
