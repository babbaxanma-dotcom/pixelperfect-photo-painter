/**
 * Wat zegt de oogst? Twee vragen: welke advertenties zijn gestopt en hoe lang
 * hebben die het volgehouden, en welke lopen nog en hoe lang al.
 *
 * "Laatst weergegeven" ligt bij een lopende advertentie op gisteren of vandaag.
 * Alles wat meer dan tien dagen geleden voor het laatst te zien was, is gestopt.
 */
const fs = require('node:fs');
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const NU = Math.floor(Date.now() / 1000);
const DAG = 86400;
const STIL = 10; /* dagen sinds de laatste vertoning voordat we hem gestopt noemen */

const ads = [];
for (const b of data) {
  for (const a of b.advertenties) {
    ads.push({ ...a, naam: b.naam, id: b.id, stilDagen: Math.round((NU - a.laatst) / DAG) });
  }
}

const metAds = data.filter((b) => b.advertenties.length);
const zonder = data.length - metAds.length;
console.log(`REGISTER: ${data.length} Belgische bouw-adverteerders gevonden`);
console.log(`          ${metAds.length} hebben advertenties in het archief, ${zonder} niet`);
console.log(`          ${ads.length} advertenties met een begin- en einddatum\n`);

const gestopt = ads.filter((a) => a.stilDagen > STIL);
const loopt = ads.filter((a) => a.stilDagen <= STIL);
console.log(`GESTOPT: ${gestopt.length}   LOOPT NOG: ${loopt.length}\n`);

const mediaan = (v) => { const s = [...v].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };

const blok = (titel, set) => {
  if (!set.length) return;
  const d = set.map((a) => a.dagen);
  console.log(`${titel}: ${set.length} stuks · mediaan ${mediaan(d)} dagen · langste ${Math.max(...d)}`);
};

console.log('== LOOPTIJD PER SOORT ==');
for (const soort of ['tekst', 'beeld', 'video', 'onbekend']) {
  const s = gestopt.filter((a) => a.soort === soort);
  const l = loopt.filter((a) => a.soort === soort);
  if (!s.length && !l.length) continue;
  console.log(`\n  ${soort.toUpperCase()}`);
  blok('    gestopt   ', s);
  blok('    loopt nog ', l);
}

console.log('\n== HOE LANG HIELDEN GESTOPTE ADVERTENTIES HET VOL ==');
const bakken = [[0, 7], [8, 30], [31, 90], [91, 180], [181, 365], [366, 99999]];
for (const [a, b] of bakken) {
  const n = gestopt.filter((x) => x.dagen >= a && x.dagen <= b).length;
  const pct = gestopt.length ? Math.round((n / gestopt.length) * 100) : 0;
  const naam = b === 99999 ? 'meer dan een jaar' : `${a}-${b} dagen`;
  console.log(`  ${naam.padEnd(20)} ${String(n).padStart(4)}  ${'#'.repeat(Math.round(pct / 2))} ${pct}%`);
}

console.log('\n== ADVERTEERDERS DIE HET LANGST DOORGAAN ==');
const per = {};
for (const a of ads) {
  const p = (per[a.naam] ||= { n: 0, max: 0, loopt: 0, soorten: new Set() });
  p.n++; p.max = Math.max(p.max, a.dagen); p.soorten.add(a.soort);
  if (a.stilDagen <= STIL) p.loopt++;
}
const top = Object.entries(per).sort((x, y) => y[1].max - x[1].max).slice(0, 30);
for (const [naam, p] of top) {
  console.log(`  ${String(p.max).padStart(4)}d  ${naam.slice(0, 38).padEnd(40)} ${String(p.n).padStart(3)} adv, ${p.loopt} lopen · ${[...p.soorten].join('+')}`);
}
