#!/usr/bin/env node
/* Guard tegen tekst die stukging door een blanket zoek-en-vervang.
 *
 * Aanleiding, 26 aug 2026: een script verving overal `Inter` door `Archivo` om
 * het lettertype te wisselen. Dat raakte ook het woord "Interieurwerken", dus
 * stond er `typeWerk: 'AB Archivoieurwerken'` in de dienst-data. Dat label gaat
 * mee in elke lead naar GHL, dus het was geld-kritisch en het is ongemerkt
 * meegecommit.
 *
 * De klasse-fout: een vervanging op een woorddeel in plaats van op een heel
 * woord. Deze guard vangt de sporen daarvan. Hij kent geen "Archivo" die door
 * een kleine letter wordt gevolgd: het lettertype heet altijd `Archivo` gevolgd
 * door een komma, een aanhalingsteken of een spatie.
 */
const fs = require('node:fs');
const path = require('node:path');

const WORTEL = path.join(__dirname, '..', 'src');
const EXT = new Set(['.ts', '.tsx', '.css', '.html']);

/* patroon → uitleg. Elk patroon is een SPOOR van een half vervangen woord. */
const SPOREN = [
  { naam: 'Archivo in een woord', re: /Archivo[a-z]/g,
    uitleg: 'het lettertype heet Archivo en staat nooit vast aan een klein woord; dit is een halve vervanging van "Inter"' },
  { naam: 'dubbele vervanging', re: /ArchivoArchivo|InterInter/g,
    uitleg: 'een vervanging is twee keer over dezelfde tekst gelopen' },
];

/* positieve controle: de guard moet kunnen vuren */
const LOKAAS = { 'Archivo in een woord': 'AB Archivoieurwerken', 'dubbele vervanging': 'ArchivoArchivo' };
for (const s of SPOREN) {
  s.re.lastIndex = 0;
  if (!s.re.test(LOKAAS[s.naam])) {
    console.error(`FOUT: positieve controle faalt voor "${s.naam}" — de regel kan niet vuren.`);
    process.exit(1);
  }
}

const bestanden = [];
(function loop(map) {
  for (const naam of fs.readdirSync(map)) {
    const p = path.join(map, naam);
    const st = fs.statSync(p);
    if (st.isDirectory()) loop(p);
    else if (EXT.has(path.extname(naam))) bestanden.push(p);
  }
}(WORTEL));

if (bestanden.length < 20) {
  console.error(`FOUT: maar ${bestanden.length} bronbestanden gevonden; dat is geen geldige meting.`);
  process.exit(1);
}

const bevindingen = [];
for (const p of bestanden) {
  const tekst = fs.readFileSync(p, 'utf8');
  const regels = tekst.split('\n');
  for (const s of SPOREN) {
    s.re.lastIndex = 0;
    if (!s.re.test(tekst)) continue;
    regels.forEach((r, i) => {
      s.re.lastIndex = 0;
      if (s.re.test(r)) {
        bevindingen.push({
          bestand: path.relative(path.join(__dirname, '..'), p),
          regel: i + 1, spoor: s.naam, uitleg: s.uitleg, tekst: r.trim().slice(0, 120),
        });
      }
    });
  }
}

console.log(`tekstcorruptie-guard: ${bestanden.length} bronbestanden, ${SPOREN.length} sporen`);

if (!bevindingen.length) {
  console.log('schoon');
  process.exit(0);
}

console.error(`\n${bevindingen.length} bevinding(en):\n`);
for (const b of bevindingen) {
  console.error(`  ${b.bestand}:${b.regel}  ${b.spoor}`);
  console.error(`    ${b.tekst}`);
  console.error(`    ${b.uitleg}\n`);
}
process.exit(1);
