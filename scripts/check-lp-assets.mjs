/**
 * check-lp-assets: elke /assets/-verwijzing in de gebouwde HTML moet als bestand in dist/assets bestaan (4 nov 2026).
 *
 * Aanleiding: van 3 nov 18:38 tot 4 nov laadde op /lp/dakwerken, /lp/dakwerken/asbest, /lp/totaalrenovatie en
 * /lp/aannemer-renovatiewerken geen enkele foto en geen logo. De voorgerenderde HTML (scripts/prerender-lp.mjs) kreeg
 * de beeldnamen van de server-build ([name]-[hash]), de browser-build schrijft alleen [hash]. Vercel gaf voor elk
 * ontbrekend beeld index.html terug (rewrite naar /index.html), dus geen 404 en geen build-fout: de fout was onzichtbaar.
 *
 * Gebruik: node scripts/check-lp-assets.mjs [dist-map]  (laatste stap van npm run build; exit 1 = build stopt,
 * Vercel houdt de vorige versie online).
 * Lege meting = fout: vindt de check in de LP-pagina's geen enkele beeldverwijzing, dan faalt hij ook.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.argv[2] || 'dist');
const LP = ['lp/dakwerken', 'lp/dakwerken/asbest', 'lp/totaalrenovatie', 'lp/aannemer-renovatiewerken'];

function htmlBestanden(map) {
  const uit = [];
  for (const e of fs.readdirSync(map, { withFileTypes: true })) {
    const p = path.join(map, e.name);
    if (e.isDirectory()) { if (e.name !== 'assets') uit.push(...htmlBestanden(p)); } else if (e.name.endsWith('.html')) uit.push(p);
  }
  return uit;
}

let fout = 0;
let beeldenInLp = 0;
for (const r of LP) if (!fs.existsSync(path.join(DIST, r, 'index.html'))) { console.error(`check-lp-assets: FOUT ${r}/index.html ontbreekt`); fout++; }
for (const bestand of htmlBestanden(DIST)) {
  const html = fs.readFileSync(bestand, 'utf8');
  const refs = new Set([...html.matchAll(/\/assets\/[^"'\s,)?#]+/g)].map((m) => m[0]));
  const rel = path.relative(DIST, bestand).replace(/\\/g, '/');
  const isLp = LP.some((r) => rel === `${r}/index.html`);
  for (const ref of refs) {
    if (isLp && /\.(jpe?g|png|webp|avif|svg)$/i.test(ref)) beeldenInLp++;
    if (!fs.existsSync(path.join(DIST, ref))) { console.error(`check-lp-assets: FOUT ${rel} verwijst naar ${ref}, dat bestand bestaat niet`); fout++; }
  }
}
if (!beeldenInLp) { console.error('check-lp-assets: FOUT geen enkele beeldverwijzing in de LP-pagina\'s gevonden (lege meting)'); fout++; }
if (fout) { console.error(`check-lp-assets: ${fout} fout(en), build gestopt`); process.exit(1); }
console.log(`check-lp-assets: OK, ${beeldenInLp} beeldverwijzingen in ${LP.length} LP-pagina's, alle /assets/-bestanden bestaan`);
