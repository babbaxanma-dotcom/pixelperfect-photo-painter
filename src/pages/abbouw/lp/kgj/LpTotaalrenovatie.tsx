import LpBf from './LpBf';
import { TOTAALRENOVATIE } from './inhoud-totaalrenovatie';

/**
 * /lp/totaalrenovatie in de vormtaal van /lp/dakwerken (Mohammed, 26 sep 2026).
 * Eigen bestand, zodat de foto's van deze pagina niet meeladen op dakwerken.
 *
 * 12 okt 2026 (spec/bf-stijl.md §17, bouwstap 5): in de stijl van bfbouw.be via LpBf, met hetzelfde inhoudsobject.
 * Terugval = de regel hieronder terugzetten naar <LpKgj inhoud={TOTAALRENOVATIE} /> (import LpKgj from './LpKgj').
 */
export default function LpTotaalrenovatie() {
  return <LpBf inhoud={TOTAALRENOVATIE} />;
}
