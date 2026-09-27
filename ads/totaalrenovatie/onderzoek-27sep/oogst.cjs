/**
 * Google-autocomplete (hl=nl, gl=be) voor de totaalrenovatiecampagne, 27 sep 2026.
 * Geen browser: alleen https://suggestqueries.google.com (client=firefox), 500 ms tussen verzoeken.
 *
 * Zaden (soort):
 *   kw      de 28 unieke teksten van de 29 zoekwoorden in ../bouw.cjs
 *   basis   de 13 basistermen uit de opdracht
 *   letter  de 4 hoofdtermen + spatie + a..z
 *   extra   koperformuleringen die in geen enkel zaad hierboven staan (om gemiste kopers te vinden)
 *   neg     elke woordgroep-uitsluiting in context: "renovatie X", "X renovatie", "totaalrenovatie X",
 *           "huis renoveren X" (toets of een uitsluiting een koper raakt)
 *   kand    kandidaat-uitsluitingen (toets vóór voorstel), via KAND=... in de omgeving
 *
 * Uitvoer: raw.json { zaad: { soort: [...], aanvullingen: [...] } }. Bestaande zaden worden niet opnieuw opgehaald.
 * Draaien: node oogst.cjs
 */
const fs = require('fs');
const path = require('path');
const { ZOEKWOORDEN, UITSLUITEN } = require('./bron.cjs');

const RAW = path.join(__dirname, 'raw.json');
const raw = fs.existsSync(RAW) ? JSON.parse(fs.readFileSync(RAW, 'utf8')) : {};

const zaden = new Map();
const voeg = (q, soort) => { q = q.trim().toLowerCase() + (q.endsWith(' ') ? ' ' : ''); if (!zaden.has(q)) zaden.set(q, new Set()); zaden.get(q).add(soort); };

for (const z of ZOEKWOORDEN) voeg(z.tekst, 'kw');
for (const b of ['totaalrenovatie', 'renovatie', 'huis renoveren', 'woning renoveren', 'verbouwing', 'renovatie aannemer', 'aannemer',
  'renovatiebedrijf', 'huis gekocht', 'oude woning', 'strippen', 'renovatie prijs', 'renovatiekosten']) voeg(b, 'basis');
for (const h of ['totaalrenovatie', 'huis renoveren', 'renovatie woning', 'renovatie aannemer'])
  for (const c of 'abcdefghijklmnopqrstuvwxyz') voeg(`${h} ${c}`, 'letter');
for (const e of ['renovatie huis', 'woning renovatie', 'woningrenovatie', 'volledige renovatie', 'huis verbouwen', 'woning verbouwen',
  'verbouwen', 'renoveren', 'totaalrenovatie aannemer', 'appartement renoveren', 'renovatie appartement', 'renovatiewerken',
  'renovatie offerte', 'verbouwing prijs', 'rijwoning renoveren', 'renovatie rijwoning', 'huis te renoveren', 'renovatie oude woning',
  'aannemer in de buurt', 'algemene aannemer']) voeg(e, 'extra');
for (const [t, ty] of UITSLUITEN) {
  if (ty !== 'w') continue; // exact "gratis" blokkeert alleen de zoekopdracht "gratis" zelf
  for (const q of [`renovatie ${t}`, `${t} renovatie`, `totaalrenovatie ${t}`, `huis renoveren ${t}`]) voeg(q, 'neg');
}
for (const k of (process.env.KAND || '').split('|').map((s) => s.trim()).filter(Boolean)) voeg(k, 'kand');

const pauze = (ms) => new Promise((r) => setTimeout(r, ms));
async function haal(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=nl&gl=be&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`;
  for (let poging = 1; poging <= 3; poging++) {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0' } });
    if (r.ok) { const j = JSON.parse(await r.text()); return j[1]; }
    console.error(`HTTP ${r.status} op "${q}" (poging ${poging})`);
    await pauze(5000 * poging);
  }
  throw new Error(`mislukt: "${q}"`);
}

(async () => {
  let nieuw = 0;
  for (const [q, soorten] of zaden) {
    const soort = [...soorten];
    if (raw[q]) { raw[q].soort = [...new Set([...raw[q].soort, ...soort])]; continue; }
    raw[q] = { soort, aanvullingen: await haal(q), opgehaald: new Date().toISOString() };
    nieuw++;
    if (nieuw % 25 === 0) { fs.writeFileSync(RAW, JSON.stringify(raw, null, 1)); console.log(`${nieuw} opgehaald`); }
    await pauze(500);
  }
  fs.writeFileSync(RAW, JSON.stringify(raw, null, 1));
  const uniek = new Set(Object.values(raw).flatMap((v) => v.aanvullingen));
  const leeg = Object.entries(raw).filter(([, v]) => v.aanvullingen.length === 0).map(([k]) => k);
  console.log(`Klaar: ${zaden.size} zaden (${nieuw} nieuw), ${uniek.size} unieke aanvullingen, ${leeg.length} zaden zonder aanvulling.`);
})();
