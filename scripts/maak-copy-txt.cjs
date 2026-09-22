/**
 * Schrijft de zichtbare tekst van een KGJ-landingspagina naar een .txt, zodat
 * de copy-guard op precies de zinnen draait die de bezoeker leest.
 *
 * Aanleiding: copy-dakwerken.txt werd met de hand bijgehouden en liep uit de
 * pas met inhoud.ts. De guard gaf daardoor groen op een zin die niet meer op
 * de pagina stond ("Plaatsbezoek binnen vijf werkdagen"), terwijl de zin die
 * er wel stond nooit getoetst was. Een guard die een ander bestand meet dan
 * de pagina, meet niets.
 *
 * Draaien:  node scripts/maak-copy-txt.cjs
 * Daarna:   node C:/Users/Mohammed/.claude/skills/norvo-copy/check-tekst.cjs \
 *             src/pages/abbouw/lp/kgj/copy-dakwerken.txt
 */
const fs = require('fs');
const path = require('path');

const BRON = path.join(__dirname, '..', 'src', 'pages', 'abbouw', 'lp', 'kgj', 'inhoud.ts');
const DOEL = path.join(__dirname, '..', 'src', 'pages', 'abbouw', 'lp', 'kgj', 'copy-dakwerken.txt');

const bron = fs.readFileSync(BRON, 'utf8');
/* Alleen het blok van DAKWERKEN, anders komt de inhoud van een tweede dienst
   er straks doorheen lopen. */
const begin = bron.indexOf('export const DAKWERKEN');
if (begin < 0) throw new Error('DAKWERKEN niet gevonden in inhoud.ts');
const blok = bron.slice(begin);

/* De velden die de bezoeker leest. alt-teksten en technische sleutels
   (divisie, bronLead, src) blijven eruit: die staan niet op de pagina. */
const LEESBAAR = /(?:^|\s)(kop|onder|tekst|titel|label|vraag|gerust|uitkomstKop|uitkomstOnder|knop|omschrijving)\s*:\s*'((?:[^'\\]|\\.)*)'/g;

const regels = [];
let m;
while ((m = LEESBAAR.exec(blok))) {
  const waarde = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  if (waarde) regels.push(waarde);
}
/* De keuzes van de calculator staan als { label: '…' } al in LEESBAAR, maar
   de losse keuzes zonder sleutel niet. Die haken we er apart bij. */
for (const k of blok.matchAll(/\{\s*label:\s*'((?:[^'\\]|\\.)*)'(?:,\s*uitleg:\s*'((?:[^'\\]|\\.)*)')?\s*\}/g)) {
  if (!regels.includes(k[1])) regels.push(k[1]);
  if (k[2] && !regels.includes(k[2])) regels.push(k[2]);
}

if (regels.length < 30) throw new Error(`te weinig tekst gevonden (${regels.length}): de regex vangt de inhoud niet meer`);

fs.writeFileSync(DOEL, regels.join('\n') + '\n', 'utf8');
console.log(`${regels.length} zinnen uit inhoud.ts naar ${path.relative(process.cwd(), DOEL)}`);
