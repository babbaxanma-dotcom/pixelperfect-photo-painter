import LpBf from './LpBf';
import { TOTAALRENOVATIE } from './inhoud-totaalrenovatie';
import { RENOVATIEWERKEN } from './inhoud-renovatiewerken';

/**
 * /lp/aannemer-renovatiewerken: kopie van de totaalrenovatiepagina voor wie een
 * aannemer voor renovatiewerken zoekt (Mohammed, 5 okt 2026, "de drie paginas").
 *
 * 12 okt 2026 (spec/bf-stijl.md §17, bouwstap 6): in de stijl van bfbouw.be via LpBf, met hetzelfde inhoudsobject.
 *
 * 13 okt 2026 avond, Mohammed: "die hele onderverdeling van ad groups onnodig", "we gaan gewoon laten wat al werkte
 * toen we aanvragen kregen": geen aparte aannemerpagina meer. Deze URL (advertentiegroep Aannemer renovatiewerken)
 * toont dezelfde rekenaarpagina als /lp/totaalrenovatie; alleen de bron in het CRM blijft eigen, zodat te zien is
 * waar een aanvraag vandaan kwam. Terugval = de regel hieronder terugzetten naar <LpBf inhoud={RENOVATIEWERKEN} />.
 *
 * 19 okt 2026: volgt de nieuwe /lp/totaalrenovatie (aanvraagkaart bovenaan, geen rekenaar). De kaart en het formulier
 * onderaan sturen allebei inspectie.bronLead = lp:aannemer-renovatiewerken:inspectie.
 */
export default function LpRenovatiewerken() {
  return <LpBf inhoud={{ ...TOTAALRENOVATIE, bronLead: RENOVATIEWERKEN.bronLead, inspectie: RENOVATIEWERKEN.inspectie }} />;
}
