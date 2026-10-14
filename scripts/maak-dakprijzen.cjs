// Draaien: node scripts/maak-dakprijzen.cjs   (schrijft src/data/dakprijzen.json; leest de Norvo-kostenmotor in C:/Users/Mohammed/NORVO/richtprijs-ai)
//
// Prijstabel voor de AB-dakrekenaar (14 okt 2026, Mohammed: "zoals bf en je werkt gewoon voor alles veilige richtprijzen uit,
// realistisch, en heel accuraat"). Zelfde methode als bfbouw-website/tools/dakprijzen.cjs: per antwoordcombinatie (dak, werk, isolatie,
// bedekking, grootte) een minimum en maximum, totaal excl. btw, uit de Norvo-kostenmotor (materiaalprijzen met bron-url in
// NORVO/richtprijs-ai/data/*.js, werkuren uit vakkennis). Minimum = goedkope uitvoering op de kleinste oppervlakte van de schijf × 0,80;
// maximum = dure uitvoering (met goten, schouw, dakramen en muuraansluitingen) op de grootste oppervlakte × 1,10.
// Verschil met BF: de labels van de AB-rekenaar (Werk "Renovatie" / "Isolatie") en de bedekking "Golfplaten" (de motor heeft geen
// golfplaat: minimum met vezelcementleien, maximum met betonpannen). "Herstelling" krijgt geen bedrag: dat is niet te begroten zonder
// te kijken (de rekenaar toont dan geen prijs en belooft er ook geen).
const fs = require('fs');
const path = require('path');
const MOTOR = 'C:/Users/Mohammed/NORVO/richtprijs-ai';
const terug = process.cwd();
process.chdir(MOTOR);
const { laadRP } = require(MOTOR + '/laad.cjs');
const RP = laadRP();
process.chdir(terug);
const MIN_F = 0.8, MAX_F = 1.1;

function geo(A) { const w = Math.sqrt(A / 1.5625); return { w, s: 0.78 * w }; }
function hellend(A, o) {
  const { w, s } = geo(A); const p = []; const q = (code, h) => p.push({ code, hoeveelheid: Math.round(h * 10) / 10 });
  if (o.binnen) { q('dak.isolatie.kepers', A); q('dak.dampscherm.binnen', A); if (o.extra) q('dak.afwerking.gyproc', A); return { dakvlak_m2: A, ploeg: 2, materieel_per_dag: ['transport'], posten: p }; }
  q('dak.stelling', 2 * w * 6); q('dak.zeil', A);
  q(o.asbest ? 'dak.asbest.leien' : 'dak.afbraak', A);
  if (o.nieuw) q('dak.structuur.nieuw', A);
  if (o.isolatie === 'lo') { q('dak.sarking120', A); q('dak.aanslagbalk', 2 * w + 2 * s); }
  if (o.isolatie === 'hi') { q('dak.dampscherm.sarking', A); q('dak.sarking160', A); q('dak.aanslagbalk', 2 * w + 2 * s); }
  q('dak.onderdak', A);
  if (o.bedekking.startsWith('dak.pannen')) { q('dak.tengellatten', A); q('dak.panlatten', A); }
  q(o.bedekking, A);
  q(o.bedekking.startsWith('dak.leien') ? 'dak.nok.leien' : 'dak.nok', w);
  if (o.bedekking.startsWith('dak.pannen')) q('dak.gevelpannen', 2 * s);
  q('dak.dakvoetprofiel', 2 * w);
  if (o.extra) { q('dak.goot.zink', 2 * w); q('dak.afvoer.zink', 12); q('dak.schouw', 1); q('dak.dakraam.herplaatsen', 2); q('dak.muuraansluiting', 2 * s); }
  return { dakvlak_m2: A, ploeg: 3, materieel_per_dag: ['lift', 'transport'], posten: p };
}
function plat(A, o) {
  const z = Math.sqrt(A); const p = []; const q = (code, h) => p.push({ code, hoeveelheid: Math.round(h * 10) / 10 });
  q('plat.stelling', 4 * z * 1.5);
  q(o.asbest ? 'dak.asbest.onderdak' : 'plat.afbraak', A);
  if (o.nieuw) { q('plat.roostering', A); q('plat.beplating', A); }
  if (o.isolatie) { q('plat.dampscherm', A); q(o.isolatie === 'hi' ? 'plat.afschot' : 'plat.isolatie.pir', A); }
  q(o.bedekking, A);
  q('plat.dakrand', 2 * z); q('plat.opstand', 2 * z);
  if (o.extra) { q('plat.afvoer', 2); q('plat.koepel', 1); q('plat.bakgoot', z); }
  return { dakvlak_m2: A, ploeg: 2, materieel_per_dag: ['transport'], posten: p };
}
const excl = (m) => { const r = RP.bereken(m, {}); if (r.overgeslagen && r.overgeslagen.length) throw new Error('overgeslagen ' + JSON.stringify(r.overgeslagen)); return r.kosten.excl; };

/* Labels exact zoals in src/pages/abbouw/lp/kgj/inhoud.ts (DAKWERKEN.rekenaar.vragen). */
const GROOTTE = { 'Kleiner dan 50 m²': [25, 50], '50 tot 100 m²': [50, 100], '100 tot 150 m²': [100, 150], 'Groter dan 150 m²': [150, 250], 'Weet ik niet': [50, 150] };
const HB = { 'Gegolfde pannen': ['dak.pannen.beton', 'dak.pannen.klei'], 'Vlakke pannen of leien': ['dak.pannen.beton', 'dak.leien.natuur'],
  Golfplaten: ['dak.leien.vezelcement', 'dak.pannen.beton'], 'Weet ik nog niet': ['dak.pannen.beton', 'dak.leien.natuur'] };
const PB = { Bitumen: ['plat.roofing', 'plat.roofing'], Roofing: ['plat.roofing', 'plat.roofing'], EPDM: ['plat.epdm', 'plat.epdm'], 'Weet ik nog niet': ['plat.roofing', 'plat.epdm'] };

const tabel = {}, asbest = {};
function zet(sleutel, f, lo, hi) {
  for (const [g, [a, b]] of Object.entries(GROOTTE)) {
    tabel[sleutel + '|' + g] = [Math.round(excl(f(a, lo)) * MIN_F), Math.round(excl(f(b, hi)) * MAX_F)];
    if (!lo.binnen) asbest[sleutel + '|' + g] = [Math.round((excl(f(a, { ...lo, asbest: 1 })) - excl(f(a, lo))) * MIN_F), Math.round((excl(f(b, { ...hi, asbest: 1 })) - excl(f(b, hi))) * MAX_F)];
  }
}
for (const werk of ['Renovatie', 'Nieuw dak']) for (const iso of ['Met isolatie', 'Zonder isolatie']) {
  const i = iso === 'Met isolatie';
  for (const [bk, [blo, bhi]] of Object.entries(HB)) zet(`Hellend dak|${werk}|${iso}|${bk}`, hellend, { bedekking: blo, isolatie: i && 'lo', nieuw: werk === 'Nieuw dak' }, { bedekking: bhi, isolatie: i && 'hi', nieuw: werk === 'Nieuw dak', extra: 1 });
  for (const [bk, [blo, bhi]] of Object.entries(PB)) zet(`Plat dak|${werk}|${iso}|${bk}`, plat, { bedekking: blo, isolatie: i && 'lo', nieuw: werk === 'Nieuw dak' }, { bedekking: bhi, isolatie: i && 'hi', nieuw: werk === 'Nieuw dak', extra: 1 });
}
// isolatie zonder nieuwe bedekking: hellend = binnenisolatie tussen de kepers (afgewerkt of niet); plat = nieuwe opbouw met isolatie
zet('Hellend dak|Isolatie', hellend, { binnen: 1 }, { binnen: 1, extra: 1 });
zet('Plat dak|Isolatie', plat, { bedekking: 'plat.roofing', isolatie: 'lo' }, { bedekking: 'plat.epdm', isolatie: 'hi', extra: 1 });

const uit = path.join(__dirname, '..', 'src', 'data', 'dakprijzen.json');
fs.writeFileSync(uit, JSON.stringify({ gemaakt: new Date().toISOString().slice(0, 10), motor: 'NORVO/richtprijs-ai', tabel, asbest }) + '\n');
console.log(`dakprijzen.json: ${Object.keys(tabel).length} combinaties, ${Object.keys(asbest).length} met asbesttoeslag`);
