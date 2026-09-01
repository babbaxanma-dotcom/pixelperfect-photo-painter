import LpReplica from './lp/replica/LpReplica';
import { HOME } from './lp/replica/inhoud';

/**
 * De homepage in de PrimeCraft-vormtaal.
 *
 * Dit bestand is met opzet leeg: alle opzet, maten en gedrag staan in
 * LpReplica, alle inhoud in HOME. Zo kan de homepage niet stilletjes
 * achterlopen op een correctie aan de landingspagina's — een tweede kopie van
 * dezelfde vormtaal loopt gegarandeerd uit de pas.
 *
 * De oude RoofPro-homepage staat nog in Home.tsx. Die is niet verwijderd,
 * zodat teruggaan één regel in App.tsx is zolang deze versie niet bevestigd is.
 */
export default function HomePc() {
  return <LpReplica inhoud={HOME} />;
}
