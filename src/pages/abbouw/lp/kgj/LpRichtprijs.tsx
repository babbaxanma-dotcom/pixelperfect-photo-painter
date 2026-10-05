import LpKgj from './LpKgj';
import { RICHTPRIJS } from './inhoud-richtprijs';

/**
 * /lp/richtprijs-berekenen: de losse rekenaar, het vangnet van de twee
 * renovatiepagina's (Mohammed, 5 okt 2026, "de drie paginas").
 */
export default function LpRichtprijs() {
  return <LpKgj inhoud={RICHTPRIJS} />;
}
