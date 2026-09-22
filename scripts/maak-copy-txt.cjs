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
const LEESBAAR = /(?:^|\s)(kop|onder|tekst|titel|vraag|gerust|uitkomstKop|uitkomstOnder|knop)\s*:\s*'((?:[^'\\]|\\.)*)'/g;

const schoon = (s) => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');

const regels = [];
let m;
while ((m = LEESBAAR.exec(blok))) {
  const waarde = schoon(m[2]);
  if (waarde) regels.push(waarde);
}

/* Knoppen van de calculator, tegellabels, paginatitel en SEO-tekst komen
   onder een scheidingslijn. Ze zijn functioneel: twee vragen mogen allebei
   een knop "Weet ik niet" hebben, en de paginatitel MAG de kop van de hero
   spiegelen. De herhalingsguard stopt bij die lijn; de copy-guard leest het
   hele bestand, want de verboden woorden gelden overal. */
const functioneel = [];
for (const s of ['titel', 'omschrijving']) {
  const t = blok.match(new RegExp(`(?:^|\\s)${s}\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
  if (t) functioneel.push(schoon(t[1]));
}
for (const k of blok.matchAll(/\{\s*label:\s*'((?:[^'\\]|\\.)*)'(?:,\s*uitleg:\s*'((?:[^'\\]|\\.)*)')?/g)) {
  functioneel.push(schoon(k[1]));
  if (k[2]) functioneel.push(schoon(k[2]));
}
for (const b of blok.matchAll(/bewijs:\s*\[([^\]]*)\]/g)) {
  for (const p of b[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)) functioneel.push(schoon(p[1]));
}

/* De paginatitel matcht ook op `titel:` en stond daardoor zowel boven als
   onder de streep; de herhalingsguard meldde hem dan als stempel tegen
   zichzelf. Wat functioneel is, hoort maar op één plek te staan. */
const lopend = regels.filter((r) => !functioneel.includes(r));

if (lopend.length < 20) throw new Error(`te weinig lopende tekst gevonden (${lopend.length}): de regex vangt de inhoud niet meer`);

const uit = lopend.join('\n') + '\n\n--- functioneel ---\n' + functioneel.join('\n') + '\n';
fs.writeFileSync(DOEL, uit, 'utf8');
console.log(`${lopend.length} zinnen lopende tekst + ${functioneel.length} functionele regels naar ${path.relative(process.cwd(), DOEL)}`);
