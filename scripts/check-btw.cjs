#!/usr/bin/env node
/**
 * Het btw-nummer van AB Bouw Groep, overal hetzelfde en overal juist.
 *
 * Aanleiding (Mohammed, 7 okt 2026): "BE1010850361 is het btw nummer ... bij algemene
 * voorwaarden of privacy die btw daar is fout". Het oude nummer (0712.443.881) stond hard
 * in de voet van de landingspagina's en in de voorwaarden; het controlegetal ervan klopte
 * niet eens. Sinds 7 okt staat het nummer op één plek (src/data/contact.ts, CONTACT.btw) en
 * verwijst elke pagina daarnaar.
 *
 * Deze controle faalt als:
 *   1. CONTACT.btw.display niet het Belgische formaat heeft of het controlegetal niet klopt
 *      (97 - (eerste acht cijfers mod 97) = laatste twee cijfers);
 *   2. ergens in src/ nog een ander btw-nummer hard staat (BE 0xxx.xxx.xxx, BE 1xxx.xxx.xxx
 *      of zonder punten), behalve in contact.ts zelf;
 *   3. een van de voeten of de voorwaarden het nummer niet uit CONTACT.btw haalt:
 *      LpReplica.tsx (homepage), _rp.ts (informatiepagina's), LpKgj.tsx (landingspagina's),
 *      Voorwaarden.tsx.
 *
 * Draaien: node scripts/check-btw.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const WORTEL = path.join(__dirname, '..', 'src');
const fouten = [];

/* 1. Het nummer zelf. */
const contact = fs.readFileSync(path.join(WORTEL, 'data', 'contact.ts'), 'utf8');
const m = contact.match(/display:\s*'(BE \d{4}\.\d{3}\.\d{3})'/);
if (!m) fouten.push('contact.ts: CONTACT.btw.display ontbreekt of heeft niet het formaat "BE 0000.000.000"');
else {
  const cijfers = m[1].replace(/\D/g, '');
  const basis = Number(cijfers.slice(0, 8)), controle = Number(cijfers.slice(8));
  if (97 - (basis % 97) !== controle) fouten.push(`contact.ts: controlegetal van ${m[1]} klopt niet (verwacht ${97 - (basis % 97)})`);
}

/* 2. Geen hard nummer buiten contact.ts. */
const loop = (map) => {
  for (const e of fs.readdirSync(map, { withFileTypes: true })) {
    const p = path.join(map, e.name);
    if (e.isDirectory()) { if (e.name !== '_source') loop(p); continue; }
    if (!/\.(tsx?|js|cjs|mjs|json|html|css)$/.test(e.name) || p.endsWith(path.join('data', 'contact.ts'))) continue;
    const t = fs.readFileSync(p, 'utf8');
    const hard = t.match(/BE ?[01]\d{3}\.?\d{3}\.?\d{3}\b/g);
    if (hard) fouten.push(`${path.relative(WORTEL, p)}: hard btw-nummer ${[...new Set(hard)].join(', ')} (hoort uit CONTACT.btw te komen)`);
  }
};
loop(WORTEL);

/* 3. Elke voet en de voorwaarden gebruiken de bron. */
for (const [bestand, minimaal] of [
  ['pages/abbouw/lp/replica/LpReplica.tsx', 2], ['pages/abbouw/_rp.ts', 2],
  ['pages/abbouw/lp/kgj/LpKgj.tsx', 2], ['pages/abbouw/Voorwaarden.tsx', 1],
]) {
  const t = fs.readFileSync(path.join(WORTEL, bestand), 'utf8');
  const n = (t.match(/CONTACT\.btw\.display/g) || []).length;
  if (n < minimaal) fouten.push(`${bestand}: CONTACT.btw.display ${n}x gevonden, minstens ${minimaal}x verwacht`);
}

if (fouten.length) { console.error(`NIET AF — btw-nummer (${fouten.length}):\n  ${fouten.join('\n  ')}`); process.exit(1); }
console.log(`AF — btw-nummer ${m[1]}: controlegetal klopt, geen hard nummer in src/, bron gebruikt in homepage, informatiepagina's, landingspagina's en voorwaarden.`);
