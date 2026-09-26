import LpKgj from './LpKgj';
import { TOTAALRENOVATIE } from './inhoud-totaalrenovatie';

/**
 * /lp/totaalrenovatie in de vormtaal van /lp/dakwerken (Mohammed, 26 sep 2026).
 * Eigen bestand, zodat de foto's van deze pagina niet meeladen op dakwerken.
 */
export default function LpTotaalrenovatie() {
  return <LpKgj inhoud={TOTAALRENOVATIE} />;
}
