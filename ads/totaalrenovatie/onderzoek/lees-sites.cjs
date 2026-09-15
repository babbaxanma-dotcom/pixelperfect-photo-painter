/**
 * Wat staat er op de landingspagina's van de concurrentie, en wat ontbreekt er
 * bij iedereen?
 */
const fs = require('node:fs');
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).filter((x) => !x.fout);

const naam = (a) => a.replace('https://www.', '').replace(/\/.*$/, '');

console.log('== WAT BIEDEN ZE AAN ==');
const kolommen = ['gratisBezoek', 'prijsTool', 'garantie', 'premieBtw', 'vastePrijs', 'eigenPloeg'];
const kort = { gratisBezoek: 'gratis bezoek', prijsTool: 'prijs-tool', garantie: 'garantie',
  premieBtw: 'premie/btw', vastePrijs: 'vaste prijs', eigenPloeg: 'eigen ploeg' };
console.log('  ' + 'site'.padEnd(26) + kolommen.map((k) => kort[k].padEnd(15)).join(''));
for (const s of data) {
  console.log('  ' + naam(s.adres).padEnd(26)
    + kolommen.map((k) => (s.aanbod[k] ? 'ja' : '-').padEnd(15)).join(''));
}
console.log('');
for (const k of kolommen) {
  const n = data.filter((s) => s.aanbod[k]).length;
  console.log(`  ${kort[k].padEnd(16)} ${n}/${data.length}`);
}

console.log('\n== FORMULIER BOVEN DE VOUW ==');
const metForm = data.filter((s) => s.formulierBoven);
console.log(`  ${metForm.length} van de ${data.length}: ${metForm.map((s) => naam(s.adres)).join(', ') || 'geen enkele'}`);

console.log('\n== TERMIJN, BEOORDELINGEN, AANTAL PROJECTEN ==');
for (const s of data) {
  const a = s.aanbod;
  if (!a.termijn && !a.reviews && !a.aantalProjecten) continue;
  console.log(`  ${naam(s.adres).padEnd(26)} ${[a.termijn, a.reviews, a.aantalProjecten].filter(Boolean).join(' · ')}`);
}

console.log('\n== DE KOP BOVENAAN ==');
for (const s of data) console.log(`  ${naam(s.adres).padEnd(26)} ${s.h1 || '(geen h1)'}`);

console.log('\n== KNOPPEN ==');
for (const s of data) {
  if (!s.knoppen.length) continue;
  console.log(`  ${naam(s.adres)}`);
  console.log(`     ${s.knoppen.slice(0, 8).join(' | ')}`);
}

console.log('\n== VOLGORDE VAN DE SECTIES ==');
for (const s of data) {
  console.log(`  ${naam(s.adres)}`);
  console.log(`     ${s.koppen.slice(0, 10).join('  >  ')}`);
}
