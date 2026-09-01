/* Van één merkkleur naar een volledig palet van 15 tokens, plus de 20 vaste
   contrasttoetsen. Nul afhankelijkheden.
   Gebruik: node scripts/palet.mjs <merkkleur> [tweede-donkere-merkkleur]
   Voorbeeld: node scripts/palet.mjs #d98c03 #0a1628
   Exitcode 1 = minstens één toets gezakt. */
const hex2rgb = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const rgb2hex = ([r, g, b]) => '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
const lum = ([r, g, b]) => { const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const CR = (a, b) => { const L1 = lum(hex2rgb(a)), L2 = lum(hex2rgb(b)); return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); };
function rgb2hsl(hex) {
  let [r, g, b] = hex2rgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min; let h = 0;
  if (d) { if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  const l = (max + min) / 2;
  return [Math.round(h), Math.round((d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))) * 100), Math.round(l * 100)];
}
function hsl2hex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(100, s)) / 100; l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2; let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0]; else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c]; else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
  return rgb2hex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
}
const klem = (v, a, b) => Math.max(a, Math.min(b, v));
const f2 = (n) => n.toFixed(2).replace('.', ',');

const merk = process.argv[2] || '#1c4f9c';
const tweede = process.argv[3] || null;

const [H, S, L] = rgb2hsl(merk);
const aS = klem(S, 55, 98), aL = klem(L, 32, 52);
const accent = hsl2hex(H, aS, aL);
const accentDonker = hsl2hex(H, aS, aL - 7);
let iH, iS;
if (tweede) { const [h2, s2] = rgb2hsl(tweede); iH = h2; iS = Math.min(s2, 60); } else { iH = H; iS = 30; }
const inkt = hsl2hex(iH, iS, tweede ? 10 : 11);
const nH = iS >= 8 ? iH : H;
const vlak = hsl2hex(nH, 29, 97);
const donker = hsl2hex(nH, Math.max(0, iS - 11), 7);
let accentTekst = accent;
for (let x = aL; x >= 5; x--) { const c = hsl2hex(H, aS, x); if (CR(c, vlak) >= 5.0) { accentTekst = c; break; } }
const accentInkt = CR(inkt, accent) >= 4.5 ? inkt : '#ffffff';
let dL = aL + 13, accentOpDonker = hsl2hex(H + 2, aS - 24, dL);
while (CR(accentOpDonker, inkt) < 4.5 && dL < 95) { dL++; accentOpDonker = hsl2hex(H + 2, aS - 24, dL); }
const accentTint = hsl2hex(H, aS - 10, 94);
const T = {
  '--accent': accent, '--accent-donker': accentDonker, '--accent-inkt': accentInkt,
  '--accent-tekst': accentTekst, '--accent-op-donker': accentOpDonker, '--accent-tint': accentTint,
  '--inkt': inkt, '--inkt-2': hsl2hex(nH, 9, 46), '--tekst': hsl2hex(nH, 6, 34), '--fijn': hsl2hex(nH, 6, 40),
  '--lijn': hsl2hex(nH, 14, 91), '--lijn-zacht': hsl2hex(nH, 17, 94), '--vlak': vlak, '--donker': donker, '--wit': '#ffffff',
};
console.log(':root {');
for (const [k, v] of Object.entries(T)) console.log(`  ${k}: ${v};`.padEnd(34) + `/* hsl(${rgb2hsl(v).join(' ').replace(/^(\d+) (\d+) (\d+)$/, '$1 $2% $3%')}) */`);
console.log('}\n');

const toetsen = [
  ['--accent-inkt op --accent (knoptekst)', T['--accent-inkt'], T['--accent'], 4.5],
  ['--accent-inkt op --accent-donker (hover)', T['--accent-inkt'], T['--accent-donker'], 4.5],
  ['--accent-tekst op --wit', T['--accent-tekst'], T['--wit'], 4.5],
  ['--accent-tekst op --vlak', T['--accent-tekst'], T['--vlak'], 4.5],
  ['--accent-tekst op --accent-tint', T['--accent-tekst'], T['--accent-tint'], 4.5],
  ['--inkt op --wit', T['--inkt'], T['--wit'], 4.5],
  ['--inkt op --vlak', T['--inkt'], T['--vlak'], 4.5],
  ['--inkt op --accent-tint', T['--inkt'], T['--accent-tint'], 4.5],
  ['--tekst op --wit', T['--tekst'], T['--wit'], 4.5],
  ['--tekst op --vlak', T['--tekst'], T['--vlak'], 4.5],
  ['--fijn op --vlak', T['--fijn'], T['--vlak'], 4.5],
  ['--inkt-2 op --wit', T['--inkt-2'], T['--wit'], 4.5],
  ['--wit op --inkt', T['--wit'], T['--inkt'], 4.5],
  ['--wit op --donker', T['--wit'], T['--donker'], 4.5],
  ['--accent-op-donker op --donker', T['--accent-op-donker'], T['--donker'], 4.5],
  ['--accent-op-donker op --inkt', T['--accent-op-donker'], T['--inkt'], 4.5],
  ['--inkt op --accent-op-donker (knop op donker)', T['--inkt'], T['--accent-op-donker'], 4.5],
  ['--accent tegen --wit (vlakgrens)', T['--accent'], T['--wit'], 3.0],
  ['--accent tegen --vlak (vlakgrens)', T['--accent'], T['--vlak'], 3.0],
  ['--lijn tegen --wit (haarlijn)', T['--lijn'], T['--wit'], 1.2],
];
let gezakt = 0;
for (const [n, a, b, e] of toetsen) {
  const c = CR(a, b); const ok = c >= e; if (!ok) gezakt++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${n.padEnd(46)} ${f2(c)}:1   eis ${String(e).replace('.', ',')}:1`);
}
if (gezakt) console.log(`\n${gezakt} toets(en) gezakt. Zakt alleen "--accent tegen --wit/--vlak": geef elk accentvlak op wit een rand van 1,5px in --accent-tekst en draai opnieuw.`);
process.exit(gezakt ? 1 : 0);
