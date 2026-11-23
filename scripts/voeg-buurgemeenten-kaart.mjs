/**
 * Werkgebiedkaart van /lp/dakwerken, aanvulling van 23 nov 2026 (uitvoeringsplan 24 nov, stap 1 AB): de gemeenten rond Willebroek die het blok
 * "Actief in Willebroek en omstreken" noemt, elk met de eigen gemeentegrens op de bestaande kaart (Oost-Vlaanderen, Vlaams-Brabant, Willebroek).
 * De provincies, Willebroek en de bestaande stadspunten blijven byte-gelijk; dit script voegt alleen vlakken en labels toe.
 *
 * Bron: OpenStreetMap. Grenzen per relatienummer via polygons.openstreetmap.fr (Nominatim weigerde op 23 nov 2026 elk verzoek met fout 629).
 * De projectie is die van scripts/maak-regiokaart-provincies.mjs (rechthoekig, cos(breedte) op het midden, marge 12, breedte 590); de omsluitende
 * rechthoek komt uit de volledige grenzen van de twee provincies en Willebroek. Controle: het bestaande vlak van Willebroek moet op 1,5 px na
 * samenvallen met de opnieuw geprojecteerde grens, anders stopt het script.
 *
 * Draaien: node scripts/voeg-buurgemeenten-kaart.mjs [map met tussenopslag]
 */
import fs from 'node:fs';
const DOEL = 'src/pages/abbouw/lp/kgj/regiokaart-ab.ts';
const CACHE = process.argv[2] || '';
const UA = 'kaart-werkgebied/1.0';
const BASIS = [['Oost-Vlaanderen', 53135], ['Vlaams-Brabant', 58004], ['Willebroek', 414233]];
/* naam op de pagina, OSM-relatie van de gemeente (Puurs = gemeente Puurs-Sint-Amands) */
const BUREN = [['Mechelen', 412864], ['Boom', 58860], ['Puurs', 391117], ['Bornem', 391113], ['Rumst', 58824], ['Duffel', 964195], ['Niel', 58333],
  ['Schelle', 58364], ['Hemiksem', 58376], ['Aartselaar', 58545], ['Sint-Katelijne-Waver', 414402]];
/* Alleen een punt met naam (de gemeente ligt in een provincie die al als vlak op de kaart staat): naam, lengte, breedte van de dorpskern (OpenStreetMap). */
const PUNTEN = [['Zemst', 4.4611, 50.9836]];

async function grens(id) {
  const f = CACHE ? `${CACHE}/rel-${id}.json` : '';
  if (f && fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  const r = await fetch(`https://polygons.openstreetmap.fr/get_geojson.py?id=${id}&params=0`, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`geen grens voor relatie ${id}: ${r.status}`);
  const j = await r.json(); await new Promise((k) => setTimeout(k, 1100));
  if (f) fs.writeFileSync(f, JSON.stringify(j));
  return j;
}
/* GeoJSON (Polygon, MultiPolygon of GeometryCollection daarvan) -> lijst van polygonen, elk een lijst ringen */
const polygonen = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : g.type === 'GeometryCollection' ? g.geometries.flatMap(polygonen) : []);

const bron = fs.readFileSync(DOEL, 'utf8');
const begin = bron.indexOf('= {"W"');
if (begin < 0) throw new Error('vorm van ' + DOEL + ' niet herkend');
const kaart = JSON.parse(bron.slice(begin + 2).trim().replace(/;$/, ''));

const basis = [];
for (const [naam, id] of BASIS) basis.push({ naam, pol: polygonen(await grens(id)) });
let lonMin = 99, lonMax = -99, latMin = 99, latMax = -99;
for (const v of basis) for (const pol of v.pol) for (const ring of pol) for (const [lo, la] of ring) { lonMin = Math.min(lonMin, lo); lonMax = Math.max(lonMax, lo); latMin = Math.min(latMin, la); latMax = Math.max(latMax, la); }
const cos = Math.cos(((latMin + latMax) / 2) * Math.PI / 180);
const W = 590, M = 12, k = (W - 2 * M) / ((lonMax - lonMin) * cos), H = Math.round((latMax - latMin) * k + 2 * M);
const xy = (lo, la) => [M + (lo - lonMin) * cos * k, M + (latMax - la) * k];
if (W !== kaart.W || Math.abs(H - kaart.H) > 1) throw new Error(`projectie wijkt af: ${W}x${H} tegenover ${kaart.W}x${kaart.H}`);

/* controle op Willebroek: bestaand vlak tegenover de opnieuw geprojecteerde grens */
const doos = (punten) => punten.reduce((d, [x, y]) => [Math.min(d[0], x), Math.min(d[1], y), Math.max(d[2], x), Math.max(d[3], y)], [1e9, 1e9, -1e9, -1e9]);
const oud = doos([...kaart.vlakken.find((v) => v.naam === 'Willebroek').d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [+m[1], +m[2]]));
const nieuw = doos(basis.find((v) => v.naam === 'Willebroek').pol.flatMap((pol) => pol[0].map(([lo, la]) => xy(lo, la))));
const afwijking = Math.max(...oud.map((w, i) => Math.abs(w - nieuw[i])));
console.log(`controle Willebroek: bestaand ${oud.map((w) => w.toFixed(1)).join(' ')}, nieuw ${nieuw.map((w) => w.toFixed(1)).join(' ')}, grootste afwijking ${afwijking.toFixed(2)} px`);
if (afwijking > 1.5) throw new Error('de projectie valt niet samen met de bestaande kaart');

/* Douglas-Peucker in beeldpunten: een gemeente van 4.000 punten wordt een vlak van enkele tientallen punten, afwijking hoogstens 0,3 px */
function vereenvoudig(p, tol) {
  if (p.length < 4) return p;
  const houd = new Uint8Array(p.length); houd[0] = houd[p.length - 1] = 1;
  /* gesloten ring (eerste punt = laatste punt): eerst splitsen op het punt dat het verst van het begin ligt, anders heeft de eerste lijn lengte 0 */
  let verst = 0, vi = 0;
  for (let i = 1; i < p.length - 1; i++) { const d = Math.hypot(p[i][0] - p[0][0], p[i][1] - p[0][1]); if (d > verst) { verst = d; vi = i; } }
  houd[vi] = 1;
  const stapel = [[0, vi], [vi, p.length - 1]];
  while (stapel.length) {
    const [a, b] = stapel.pop(); let ver = 0, idx = -1;
    const [ax, ay] = p[a], [bx, by] = p[b], dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * (p[i][0] - ax) - dx * (p[i][1] - ay)) / len; if (d > ver) { ver = d; idx = i; } }
    if (ver > tol && idx > 0) { houd[idx] = 1; stapel.push([a, idx], [idx, b]); }
  }
  return p.filter((_, i) => houd[i]);
}
/* zwaartepunt van de buitenring: daar komt het punt en de naam */
function midden(p) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < p.length - 1; i++) { const f = p[i][0] * p[i + 1][1] - p[i + 1][0] * p[i][1]; a += f; cx += (p[i][0] + p[i + 1][0]) * f; cy += (p[i][1] + p[i + 1][1]) * f; }
  return [cx / (3 * a), cy / (3 * a)];
}
const r1 = (n) => +n.toFixed(1);
const vlakken = [], labels = [];
for (const [naam, id] of BUREN) {
  if (kaart.vlakken.some((v) => v.naam === naam)) { console.log(`${naam}: staat al op de kaart`); continue; }
  const pol = polygonen(await grens(id));
  if (!pol.length) throw new Error('geen vlak voor ' + naam);
  const ringen = pol.flatMap((pp) => pp).map((ring) => ring.map(([lo, la]) => xy(lo, la)));
  const grootste = ringen.reduce((a, b) => (b.length > a.length ? b : a));
  /* halve punt eraf en opnieuw sluiten: de ring begint en eindigt op hetzelfde punt */
  const d = ringen.map((ring) => { const v = vereenvoudig(ring, 0.3); return 'M' + v.slice(0, -1).map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L') + 'Z'; }).join('');
  const [mx, my] = midden(grootste);
  vlakken.push({ naam, d }); labels.push({ naam, x: r1(mx), y: r1(my) });
  console.log(`${naam}: ${ringen.length} ring(en), ${grootste.length} punten -> ${d.length} tekens, punt ${r1(mx)} ${r1(my)}`);
}
/* Willebroek blijft het laatste vlak: het thuisvlak ligt boven de buren */
const thuis = kaart.vlakken.findIndex((v) => v.naam === 'Willebroek');
if (vlakken.length) kaart.vlakken.splice(thuis, 0, ...vlakken);
kaart.labels.push(...labels);
for (const [naam, lo, la] of PUNTEN) {
  if (kaart.labels.some((l) => l.naam === naam)) { console.log(`${naam}: punt staat al op de kaart`); continue; }
  const [x, y] = xy(lo, la); kaart.labels.push({ naam, x: r1(x), y: r1(y) }); console.log(`${naam}: punt ${r1(x)} ${r1(y)}`);
}
const kop = `/* Werkgebiedkaart /lp/dakwerken (23 nov 2026): de provincies Oost-Vlaanderen en Vlaams-Brabant en Willebroek (adres van AB), grenzen en stadsligging uit
   OpenStreetMap (Nominatim), gemaakt met scripts/maak-regiokaart-provincies.mjs. Mohammed: "doe gewoon heel oost vlaanderen", "en vlaams brabant".
   Aanvulling 23 nov 2026 (uitvoeringsplan 24 nov): de ${BUREN.length} gemeenten rond Willebroek met hun eigen gemeentegrens, toegevoegd met
   scripts/voeg-buurgemeenten-kaart.mjs (OpenStreetMap-relaties via polygons.openstreetmap.fr). Puurs = gemeente Puurs-Sint-Amands. */\n`;
fs.writeFileSync(DOEL, kop + `export const REGIOKAART_AB: { W: number; H: number; vlakken: { naam: string; d: string }[]; labels: { naam: string; x: number; y: number }[]; bron: string } = ${JSON.stringify(kaart)};\n`);
console.log(`geschreven: ${kaart.vlakken.length} vlakken, ${kaart.labels.length} labels, ${fs.statSync(DOEL).size} bytes`);
