#!/usr/bin/env node
/**
 * Guard op de copy van de zes dienstpagina's (_divisies.ts).
 *
 * Waarom dit bestaat: er stonden twee copy-guards op de landingspagina's en op
 * de replica, maar geen van beide keek naar de dienstpagina's. Daar bleef
 * daardoor de oude tekst staan tot Mohammed hem zelf vond, 5 sept 2026:
 * "eerst dit dan dat, eerst dat dan dit, echt slecht".
 *
 * Hij had gelijk en het was erger dan één zin. Vier van de zes koppen boven de
 * verhaalsectie waren letterlijk "eerst X, dan Y", en de andere twee dezelfde
 * tegenstelling in een ander jasje. Zes pagina's, één stempel, op precies
 * dezelfde plek. In de tekst eronder stond twee keer een uitlegstaart met
 * "zodat" en één keer negatie-framing ("zonder gokwerk").
 *
 * Wat hier gecontroleerd wordt, per stuk copy:
 *   1. negatie-framing: "geen", "zonder", "niet ... maar";
 *   2. uitlegstaart: "zodat", "waardoor";
 *   3. de eerst-dan-slogan;
 *   4. generieke adjectieven waar niets mee gezegd is;
 *   5. hedge-woorden;
 *   6. een em-dash;
 *   7. koppen langer dan acht woorden.
 *
 * En over de zes pagina's heen de stempeltoets: twee pagina's die hun kop of
 * hun tekst met hetzelfde woord openen delen een sjabloon, ook als de inhoud
 * verschilt. Dat is de fout die hierboven staat, en die is met geen enkele
 * regel-per-zin te vangen.
 *
 * Een lege meting is geen groen licht: deze check faalt als hij minder dan
 * twintig stukken copy vindt.
 *
 * Draaien: node scripts/check-diensten-copy.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const BRON = path.join(__dirname, '..', 'src', 'pages', 'abbouw', '_divisies.ts');
const VELDEN = ['heroTitle', 'heroLede', 'storyTitle', 'storyLede'];

const REGELS = [
  ['negatie-framing', /\b(geen|zonder)\b|\bniet\b[^.]{0,24}\bmaar\b/i,
    'zeg wat er wel is; de ontkenning zet juist het woord in het hoofd van de lezer'],
  ['uitlegstaart', /\b(zodat|waardoor)\b/i,
    'de bewering stond er al; wat erachter komt herhaalt hem in andere woorden'],
  ['eerst-dan-slogan', /\beerst\b[^.]{0,30}\bdan\b/i,
    'twee zinsdelen tegenover elkaar leest als een leus, niet als informatie'],
  ['generiek adjectief', /\b(professioneel|betrouwbaar|vakkundig|kwaliteitsvol|slim|effectief|optimaal)\b/i,
    'daar kan de lezer niet naar wijzen; noem wat er gebeurt'],
  ['hedge-woord', /\b(mogelijk|waarschijnlijk|eventueel|misschien|wellicht)\b/i,
    'schrijf wat er gebeurt, of laat de zin weg'],
  ['em-dash', /—/, 'niet in deze huisstijl'],
];

const tekst = fs.readFileSync(BRON, 'utf8').split('\r').join('');
const stukken = [];
let pagina = null;
for (const regel of tekst.split('\n')) {
  const p = regel.match(/^ {2}([a-z]+): \{/);
  if (p) { pagina = p[1]; continue; }
  const m = regel.match(/^\s*(heroTitle|heroLede|storyTitle|storyLede):\s*'(.*)',\s*$/);
  if (m) stukken.push({ pagina, veld: m[1], tekst: m[2] });
}

/* Positieve controle: zes pagina's met vier velden horen 24 stukken te geven.
   Vindt deze check er veel minder, dan leest hij het bestand verkeerd en zegt
   een groene uitkomst niets. */
if (stukken.length < 20) {
  console.error(`FOUT: maar ${stukken.length} stukken copy gelezen uit _divisies.ts — de meting is ongeldig`);
  process.exit(2);
}

const fouten = [];

for (const s of stukken) {
  const kaal = s.tekst.split('<br/>').join(' ');
  for (const [naam, re, waarom] of REGELS) {
    if (re.test(kaal)) fouten.push(`${s.pagina}.${s.veld} [${naam}]: "${kaal.slice(0, 80)}"\n         ${waarom}`);
  }
  if (s.veld.endsWith('Title') && kaal.split(/\s+/).length > 8) {
    fouten.push(`${s.pagina}.${s.veld}: ${kaal.split(/\s+/).length} woorden, een kop mag er acht`);
  }
}

/* De stempeltoets. Twee pagina's die hun kop of hun tekst met hetzelfde woord
   openen, delen een sjabloon; bij een kop weegt dat zwaarder dan bij een zin
   midden in een alinea, want de kop is wat een bezoeker scant. */
for (const veld of VELDEN) {
  const perWoord = new Map();
  for (const s of stukken.filter((x) => x.veld === veld)) {
    const eerste = s.tekst.split('<br/>').join(' ').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-zà-ü]/g, '');
    if (!perWoord.has(eerste)) perWoord.set(eerste, []);
    perWoord.get(eerste).push(s.pagina);
  }
  for (const [woord, paginas] of perWoord) {
    if (paginas.length > 1) {
      fouten.push(`${veld}: ${paginas.length} pagina's openen met "${woord}" (${paginas.join(', ')})`
        + '\n         zes pagina\'s met dezelfde aanzet lezen als één sjabloon');
    }
  }
}

console.log(`check-diensten-copy: ${stukken.length} stukken copy over ${new Set(stukken.map((s) => s.pagina)).size} dienstpagina's`);
if (!fouten.length) {
  console.log('  geen verboden vormen, en elke pagina opent met een eigen woord');
  process.exit(0);
}
console.log('');
for (const f of fouten) console.log(`  FOUT: ${f}`);
process.exit(1);
