/**
 * Leest GROEPEN, UITSLUITEN, KOPER en blokkeert() uit ../bouw.cjs ZONDER dat script te draaien
 * (bouw.cjs schrijft bij het draaien de plak-klare lijsten opnieuw weg; dat mag hier niet).
 * Het stuk tot "const fouten" bevat alleen definities; KOPER wordt apart uit de tekst gehaald.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const tekst = fs.readFileSync(path.join(__dirname, '..', 'bouw.cjs'), 'utf8');
const eind = tekst.indexOf('const fouten = [];');
if (eind < 0) throw new Error('bouw.cjs: "const fouten" niet gevonden');
const kop = tekst.slice(0, eind);
const koperM = tekst.match(/const KOPER = (\[[\s\S]*?\]);/);
if (!koperM) throw new Error('bouw.cjs: KOPER niet gevonden');

const ctx = { require: (m) => (m === 'fs' || m === 'path' ? require(m) : {}), __dirname: path.join(__dirname, '..'), out: {} };
vm.createContext(ctx);
vm.runInContext(kop + `\nout.GROEPEN = GROEPEN; out.UITSLUITEN = UITSLUITEN; out.blokkeert = blokkeert; out.tok = tok;\nout.KOPER = ${koperM[1]};`, ctx);

const { GROEPEN, UITSLUITEN, blokkeert, tok, KOPER } = ctx.out;
const ZOEKWOORDEN = [];
for (const [groep, g] of Object.entries(GROEPEN)) for (const [t, ty] of g.zoekwoorden) ZOEKWOORDEN.push({ groep, tekst: t, type: ty });

/* Positieve controle: dezelfde drie gevallen als bouw.cjs. */
for (const [n, ty, q, verwacht] of [['badkamer', 'w', 'badkamer renoveren prijs', true], ['dak', 'w', 'totaalrenovatie woning', false], ['gratis', 'e', 'gratis offerte renovatie', false]]) {
  if (blokkeert(n, ty, q) !== verwacht) throw new Error(`TOETS DEFECT op "${n}" / "${q}"`);
}
if (ZOEKWOORDEN.length !== 29) throw new Error(`verwacht 29 zoekwoorden, gevonden ${ZOEKWOORDEN.length}`);
if (UITSLUITEN.length !== 52) throw new Error(`verwacht 52 uitsluitingen, gevonden ${UITSLUITEN.length}`);
if (KOPER.length !== 11) throw new Error(`verwacht 11 koperzoekopdrachten, gevonden ${KOPER.length}`);

module.exports = { ZOEKWOORDEN, UITSLUITEN, KOPER, blokkeert, tok };
