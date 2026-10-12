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
 *      Voorwaarden.tsx, en de voorwaarden in de BF-stijl (bf/JuridischBf.tsx), en de voet van de
 *      landingspagina's in de BF-stijl (lp/kgj/LpBf.tsx, één regel: © · BTW · adres, zoals BF lpvoet).
 *
 * Positieve controle (zonder: exit 2): het patroon van stap 2 vangt een geplant oud nummer en de telling van
 * stap 3 vangt een geplante voet zonder CONTACT.btw.display.
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
const HARD = /BE ?[01]\d{3}\.?\d{3}\.?\d{3}\b/g;
const telBron = (x) => (x.match(/CONTACT\.btw\.display/g) || []).length;
if (!'<p>BTW BE 0712.443.881</p>'.match(HARD) || telBron('<p>BTW BE 1010.850.361</p>') !== 0 || telBron('BTW {CONTACT.btw.display}') !== 1) {
  console.error('ONGELDIGE METING: de positieve controle (geplant hard nummer, geplante voet zonder bron) wordt niet gevangen');
  process.exit(2);
}
const loop = (map) => {
  for (const e of fs.readdirSync(map, { withFileTypes: true })) {
    const p = path.join(map, e.name);
    if (e.isDirectory()) { if (e.name !== '_source') loop(p); continue; }
    if (!/\.(tsx?|js|cjs|mjs|json|html|css)$/.test(e.name) || p.endsWith(path.join('data', 'contact.ts'))) continue;
    const t = fs.readFileSync(p, 'utf8');
    const hard = t.match(HARD);
    if (hard) fouten.push(`${path.relative(WORTEL, p)}: hard btw-nummer ${[...new Set(hard)].join(', ')} (hoort uit CONTACT.btw te komen)`);
  }
};
loop(WORTEL);

/* 3. Elke voet en de voorwaarden gebruiken de bron. */
for (const [bestand, minimaal] of [
  ['pages/abbouw/lp/replica/LpReplica.tsx', 2], ['pages/abbouw/_rp.ts', 2],
  ['pages/abbouw/lp/kgj/LpKgj.tsx', 2], ['pages/abbouw/Voorwaarden.tsx', 1],
  ['pages/abbouw/bf/JuridischBf.tsx', 1], ['pages/abbouw/lp/kgj/LpBf.tsx', 1],
]) {
  const t = fs.readFileSync(path.join(WORTEL, bestand), 'utf8');
  const n = telBron(t);
  if (n < minimaal) fouten.push(`${bestand}: CONTACT.btw.display ${n}x gevonden, minstens ${minimaal}x verwacht`);
}

if (fouten.length) { console.error(`NIET AF — btw-nummer (${fouten.length}):\n  ${fouten.join('\n  ')}`); process.exit(1); }
console.log(`AF — btw-nummer ${m[1]}: controlegetal klopt, geen hard nummer in src/, bron gebruikt in homepage, informatiepagina's, landingspagina's en voorwaarden.`);
