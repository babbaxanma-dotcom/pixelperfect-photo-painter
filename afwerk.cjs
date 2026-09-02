/*
 * Drie dingen afwerken.
 *
 * 1. De vaste kop dekte de bovenrand van de titel op de homepage af. Die hero
 *    verdeelt zijn hoogte zelf, dus duwt padding de inhoud niet volledig omlaag
 *    en bleef er achttien pixels van de titel achter de kop. Dat is precies de
 *    marge boven de titel; die valt daar weg.
 *
 * 2. "Look" eruit. Betonlook, marmerlook en houtlook lezen in Vlaanderen als
 *    een woord over knoflook. De materialen heten voortaan gewoon beton, marmer
 *    en hout.
 *
 * 3. "Gratis" krijgt de onderstreping uit de PrimeCraft-vormtaal, zodat het
 *    woord opvalt in plaats van mee te lopen in de zin.
 */
const fs = require('node:fs');
const NL = String.fromCharCode(10);
const CR = String.fromCharCode(13);

const lees = (p) => { const s = fs.readFileSync(p, 'utf8'); return { p, crlf: s.includes(CR), t: s.split(CR).join('') }; };
const schrijf = (o) => fs.writeFileSync(o.p, o.crlf ? o.t.split(NL).join(CR + NL) : o.t);
const R = (o, oud, nieuw, wat) => {
  const n = o.t.split(oud).length - 1;
  if (n !== 1) { console.error('FOUT: ' + n + ' treffers voor "' + wat + '", verwacht 1'); process.exit(1); }
  o.t = o.t.split(oud).join(nieuw);
  console.log('  ' + wat);
};

/* ── 1 en 3: de vorm ───────────────────────────────────────────────────── */

const css = lees('src/pages/abbouw/lp/replica/stijl.ts');

R(css,
  '.pc-kop--site { background: #fff; position: fixed; top: 0; left: 0; right: 0; z-index: 30; }',
  [
    '.pc-kop--site { background: #fff; position: fixed; top: 0; left: 0; right: 0; z-index: 30; }',
    '/* Deze hero verdeelt zijn hoogte zelf, dus duwt de ruimte onder de vaste kop',
    '   de inhoud niet volledig omlaag: de marge boven de titel bleef achter de kop',
    '   hangen en sneed de bovenrand van de letters af. */',
    '.pcx .pc-hero--ruim .pc-h1 { margin-top: 0; }',
  ].join(NL),
  'titel valt vrij onder de vaste kop',
);

R(css,
  '.pc-schets-sub { font-size: 16px; line-height: 24px; color: #565656; max-width: 520px; margin: 12px auto 0; }',
  [
    '.pc-schets-sub { font-size: 16px; line-height: 24px; color: #565656; max-width: 520px; margin: 12px auto 0; }',
    '/* "Gratis" is het woord dat de bezoeker moet zien. Een onderstreping in het',
    '   accent, dik en met lucht eronder, tilt het uit de zin zonder een tweede',
    '   kleur tekst te introduceren. */',
    '.pc-schets-sub strong { color: var(--pc-ink); text-decoration: underline;',
    '  text-decoration-color: var(--pc-accent); text-decoration-thickness: 3px;',
    '  text-underline-offset: 5px; }',
  ].join(NL),
  'Gratis onderstreept in de accentkleur',
);
schrijf(css);

/* ── 2: "look" eruit ───────────────────────────────────────────────────── */

const sc = lees('src/pages/abbouw/lp/replica/Schetser.tsx');
for (const [oud, nieuw] of [
  ["{ waarde: 'Betonlook grijs', label: 'Betonlook grijs' },", "{ waarde: 'Betonlook grijs', label: 'Beton grijs' },"],
  ["{ waarde: 'Marmerlook wit', label: 'Marmerlook wit' },", "{ waarde: 'Marmerlook wit', label: 'Marmer wit' },"],
  ["{ waarde: 'Houtlook', label: 'Houtlook' },", "{ waarde: 'Houtlook', label: 'Hout' },"],
]) {
  R(sc, oud, nieuw, 'label: ' + nieuw.split("label: '")[1].split("'")[0]);
}
/* De waarde blijft ongewijzigd: die staat in de beeldsleutels en in de aanvraag
   die naar het CRM gaat. Alleen wat de bezoeker leest verandert. */
schrijf(sc);
