#!/usr/bin/env node
/**
 * Zet de stylesheet van de KGJ Projects-demo om naar een stijl voor de
 * landingspagina's van abgroep.be.
 *
 * Mohammed (22 sep 2026): "je hebt toch de website van kgj projects, exact die,
 * maar dan met abgroep.be context". Dus niet natekenen maar letterlijk
 * overnemen, met drie aanpassingen:
 *
 *   1. Afgeschermd onder .kgjx. De demo stijlt html, body, h1, p en img
 *      rechtstreeks; op abgroep.be zou dat elke andere pagina meeveranderen.
 *   2. De kleuren van AB. De demo haalt zijn kleur uit het logo van de klant
 *      (KGJ: donkergrijs draagt, groen accentueert); bij AB is dat navy en goud.
 *   3. Afgeschermd tegen de sitebrede regels van ab-bouw.css, die p, section en
 *      h1-h3 een eigen kleur geven. Zonder die afscherming kleurt de tekst op de
 *      herofoto navy in plaats van wit.
 *
 * Herhaalbaar: draai opnieuw als de demo verandert.
 * Draaien: node scripts/poort-kgj-stijl.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const BRON = 'C:/Users/Mohammed/NORVO-DEMOS/kgjprojects/styles.css';
const DOEL = path.join(__dirname, '..', 'src', 'pages', 'abbouw', 'lp', 'kgj', 'stijl.ts');

let css = fs.readFileSync(BRON, 'utf8').split('\r').join('');
const fouten = [];
const wissel = (oud, nieuw, wat, verwacht = 1) => {
  const n = css.split(oud).length - 1;
  if (n !== verwacht) fouten.push(`${wat}: ${n}x gevonden, verwacht ${verwacht}`);
  css = css.split(oud).join(nieuw);
};

/* ── 1. Variabelen: niet op :root maar op het paginavat ── */
wissel(':root {\n  --merk:', '.kgjx {\n  --merk:', 'variabelenblok');
wissel('  :root { --zij: 54px; --lucht: 72px; }', '  .kgjx { --zij: 54px; --lucht: 72px; }', 'laptop-maten');
wissel('  :root { --zij: 22px; --lucht: 58px; }', '  .kgjx { --zij: 22px; --lucht: 58px; }', 'telefoon-maten');

/* ── 2. Kleuren van AB ── */
const KLEUR = [
  ['--merk: #26292e;', '--merk: #0a1628;'],
  ['--merk-diep: #16181b;', '--merk-diep: #050b14;'],
  ['--merk-licht: #f1f2f3;', '--merk-licht: #eef1f5;'],
  ['--accent: #00a654;', '--accent: #d98c03;'],
  ['--accent-diep: #00833f;', '--accent-diep: #b87502;'],
  ['--accent-licht: #e8f7ef;', '--accent-licht: #fbf1dc;'],
];
for (const [o, n] of KLEUR) wissel(o, n, `kleur ${o.split(':')[0]}`);

/* ── 3. Elementregels onder het vat ──
   Onder :where(.kgjx) en niet onder .kgjx. :where telt niet mee in het gewicht,
   dus "a" houdt het gewicht 0,0,1 dat het in de demo had, en de klassen van de
   demo (.kgj-knop--vol zet witte tekst) winnen er nog steeds van. Met .kgjx
   ervoor woog "a" 0,1,1 en erfde de belknop de donkere tekstkleur: donker op
   donker. Dat de sitebrede regels van ab-bouw.css (ook 0,0,1) niet winnen, komt
   door de volgorde: deze stijl staat in de pagina zelf, dus na de sitestijl. */
wissel('* { box-sizing: border-box; }', '.kgjx, .kgjx * { box-sizing: border-box; }', 'box-sizing');
wissel('html { scroll-behavior: smooth; scroll-padding-top: 96px; -webkit-text-size-adjust: 100%; }',
  'html:has(.kgjx) { scroll-behavior: smooth; scroll-padding-top: 96px; -webkit-text-size-adjust: 100%; }', 'html');
wissel('body { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }',
  '.kgjx { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }', 'body-aanraking');
wissel('a, button, label, summary, input, select, textarea { touch-action: manipulation; }',
  ':where(.kgjx) :is(a, button, label, summary, input, select, textarea) { touch-action: manipulation; }', 'aanraking');
wissel('body {\n  margin: 0;\n  background: var(--wit);', '.kgjx {\n  margin: 0;\n  background: var(--wit);', 'body-basis');
wissel('img { max-width: 100%; display: block; }', ':where(.kgjx) img { max-width: 100%; display: block; }', 'img');
wissel('figure { margin: 0; }', ':where(.kgjx) figure { margin: 0; }', 'figure');
wissel('a { color: inherit; text-decoration: none; }', ':where(.kgjx) a { color: inherit; text-decoration: none; }', 'a');
wissel('h1, h2, h3, h4 { margin: 0;', ':where(.kgjx) :is(h1, h2, h3, h4) { margin: 0; text-wrap: wrap;', 'koppen');
wissel('h2 { font-size: clamp(27px, 3vw, 41px); }', ':where(.kgjx) h2 { font-size: clamp(27px, 3vw, 41px); }', 'h2');
wissel('h3 { font-size: 19px; letter-spacing: -.012em; }', ':where(.kgjx) h3 { font-size: 19px; letter-spacing: -.012em; }', 'h3');
wissel('p { margin: 0; }', ':where(.kgjx) p { margin: 0; color: inherit; }\n:where(.kgjx) section { color: inherit; }', 'p');
wissel('ul, ol { margin: 0; padding: 0; list-style: none; }', ':where(.kgjx) :is(ul, ol) { margin: 0; padding: 0; list-style: none; }', 'lijsten');

/* Geen enkele kale elementregel mag overblijven: die zou de rest van de site
   raken. Een regel die met een element begint en niet met .kgjx, faalt. */
const kaal = css.split('\n').filter((r) => /^(html|body|img|figure|a|h[1-6]|p|ul|ol|button|input|\*)\s*[,{]/.test(r));
if (kaal.length) fouten.push(`kale elementregels over: ${kaal.join(' | ')}`);
if (/(^|\n)\s*:root\s*\{/.test(css)) fouten.push(':root staat er nog in');
if (/#00a654|#00833f|#26292e/i.test(css)) fouten.push('KGJ-kleur staat er nog letterlijk in');

if (fouten.length) { for (const f of fouten) console.error('FOUT: ' + f); process.exit(1); }

const kop = `/**
 * De stijl van de landingspagina's in de vormtaal van KGJ Projects.
 *
 * GEGENEREERD door scripts/poort-kgj-stijl.cjs uit
 * NORVO-DEMOS/kgjprojects/styles.css. Niet met de hand wijzigen: pas het script
 * of de demo aan en draai opnieuw, anders loopt deze kopie stil uit de pas met
 * het origineel. Alles staat onder .kgjx en raakt de rest van abgroep.be niet.
 */
`;
fs.mkdirSync(path.dirname(DOEL), { recursive: true });
fs.writeFileSync(DOEL, kop + 'export const KGJ_CSS = ' + JSON.stringify(css) + ';\n');
console.log(`KGJ-stijl overgezet: ${(css.length / 1024).toFixed(1)} kB, onder .kgjx, kleuren van AB → ${path.relative(process.cwd(), DOEL)}`);
