/**
 * Werkgebiedkaart van /lp/dakwerken (23 nov 2026, Mohammed: "je hoeft niet alles op te sommen, doe gewoon heel oost vlaanderen", "en vlaams brabant",
 * "en dan de grootste [steden] opgesomd"): de grenzen van Oost-Vlaanderen en Vlaams-Brabant en van Willebroek (thuis, adres van AB), plus de ligging
 * van de steden die de pagina noemt. Bron: OpenStreetMap via Nominatim (één verzoek per 1,1 s, algemene User-Agent).
 * Schrijft src/pages/abbouw/lp/kgj/regiokaart-ab.ts (zelfde vorm als voorheen: W, H, vlakken, labels, bron). Opnieuw draaien: node scripts/maak-regiokaart-provincies.mjs
 */
import fs from 'node:fs';
const UA = 'kaart-werkgebied/1.0';
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
async function zoek(q, extra = '') {
  const u = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&countrycodes=be&format=jsonv2&limit=1${extra}`;
  for (let poging = 1; poging <= 3; poging++) {
    const r = await fetch(u, { headers: { 'User-Agent': UA, 'Accept-Language': 'nl' } });
    if (r.ok) { const j = await r.json(); await wacht(1100); if (!j.length) throw new Error('niet gevonden: ' + q); return j[0]; }
    await wacht(3000 * poging);
  }
  throw new Error('Nominatim antwoordt niet voor ' + q);
}
const VLAKKEN = [['Oost-Vlaanderen', 'Oost-Vlaanderen, Vlaanderen'], ['Vlaams-Brabant', 'Vlaams-Brabant, Vlaanderen'], ['Willebroek', 'Willebroek, Antwerpen']];
const STEDEN = ['Willebroek', 'Gent', 'Aalst', 'Sint-Niklaas', 'Dendermonde', 'Lokeren', 'Ninove', 'Oudenaarde', 'Geraardsbergen',
  'Leuven', 'Vilvoorde', 'Halle', 'Dilbeek', 'Grimbergen', 'Asse', 'Tienen', 'Aarschot'];
const vormen = [];
for (const [naam, q] of VLAKKEN) {
  const r = await zoek(q, '&polygon_geojson=1&polygon_threshold=0.0025');
  if (!r.geojson || !/Polygon/.test(r.geojson.type)) throw new Error('geen grens voor ' + naam);
  vormen.push({ naam, geo: r.geojson });
  console.log(`grens ${naam}: ${r.geojson.type}, ${r.display_name}`);
}
const punten = [];
for (const s of STEDEN) { const r = await zoek(`${s}`, '&featuretype=city'); punten.push({ naam: s, lat: +r.lat, lon: +r.lon }); console.log(`punt ${s}: ${(+r.lat).toFixed(4)}, ${(+r.lon).toFixed(4)}`); }
// projectie: rechthoekig met cos(breedte) op het midden; marge 12 px; breedte 590 zoals de vorige kaart
const ringen = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
let lonMin = 99, lonMax = -99, latMin = 99, latMax = -99;
for (const v of vormen) for (const pol of ringen(v.geo)) for (const ring of pol) for (const [lo, la] of ring) { lonMin = Math.min(lonMin, lo); lonMax = Math.max(lonMax, lo); latMin = Math.min(latMin, la); latMax = Math.max(latMax, la); }
const cos = Math.cos(((latMin + latMax) / 2) * Math.PI / 180);
const W = 590, M = 12, k = (W - 2 * M) / ((lonMax - lonMin) * cos), H = Math.round((latMax - latMin) * k + 2 * M);
const xy = (lo, la) => [+(M + (lo - lonMin) * cos * k).toFixed(1), +(M + (latMax - la) * k).toFixed(1)];
const pad = (g) => ringen(g).map((pol) => pol.map((ring) => 'M' + ring.map(([lo, la]) => xy(lo, la).join(' ')).join('L') + 'Z').join('')).join('');
const uit = {
  W, H,
  vlakken: vormen.map((v) => ({ naam: v.naam, d: pad(v.geo) })),
  labels: punten.map((p) => { const [x, y] = xy(p.lon, p.lat); return { naam: p.naam, x, y }; }),
  bron: 'Kaart: © OpenStreetMap-bijdragers',
};
const kop = `/* Werkgebiedkaart /lp/dakwerken (23 nov 2026): de provincies Oost-Vlaanderen en Vlaams-Brabant en Willebroek (adres van AB), grenzen en stadsligging uit
   OpenStreetMap (Nominatim), gemaakt met scripts/maak-regiokaart-provincies.mjs. Mohammed: "doe gewoon heel oost vlaanderen", "en vlaams brabant". */\n`;
fs.writeFileSync('src/pages/abbouw/lp/kgj/regiokaart-ab.ts', kop + `export const REGIOKAART_AB: { W: number; H: number; vlakken: { naam: string; d: string }[]; labels: { naam: string; x: number; y: number }[]; bron: string } = ${JSON.stringify(uit)};\n`);
console.log(`geschreven: ${W}x${H}, ${uit.vlakken.length} vlakken (${uit.vlakken.map((v) => v.naam + ' ' + v.d.length + ' tekens').join(', ')}), ${uit.labels.length} labels`);
