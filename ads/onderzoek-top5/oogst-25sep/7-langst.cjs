/**
 * Stap 7 (25 sep 2026): de langstlopende advertenties die VANDAAG nog lopen.
 *
 * Opdracht Mohammed: "exact op transparency center opzoeken naar de grote namen,
 * kijken naar de langst draaiende ads, en wat zij doen".
 *
 * Neemt de verse lijst (raw/ van 25 sep: welke advertenties nu nog tonen, en sinds
 * wanneer) en koppelt de inhoud (kop, beschrijving, sitelinks, extensies) uit de
 * oogst van 23 sep. Actief = laatst getoond op of na 23 sep 2026.
 *
 * Draaien: node 7-langst.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const VERS = path.join(__dirname, 'raw');
const OUD = path.join(__dirname, '..', 'oogst-23sep');
const GRENS = '2026-09-23';

const inhoud = new Map();
for (const f of fs.readdirSync(OUD).filter((x) => x.endsWith('.json') && !['ocr.json', 'plaatsen-be.json', 'suggesties.json', 'samenvatting-dak.json'].includes(x))) {
  const d = JSON.parse(fs.readFileSync(path.join(OUD, f), 'utf8'));
  for (const a of d.advertenties || []) inhoud.set(a.cr, a);
}

const rijen = [];
for (const f of fs.readdirSync(VERS)) {
  const st = JSON.parse(fs.readFileSync(path.join(VERS, f), 'utf8'));
  const uniek = new Map();
  for (const d of Object.values(st.doelen)) for (const c of d.creatives) uniek.set(c.cr, c);
  for (const c of uniek.values()) {
    if (!c.laatst || c.laatst < GRENS) continue;
    const i = inhoud.get(c.cr) || {};
    rijen.push({ speler: st.speler, formaat: c.formaat, eerst: c.eerst, laatst: c.laatst, dagen: c.looptijdDagen, getoond: c.dagenGetoond,
      kop: i.kop || null, koppen: i.koppen || [], beschrijving: i.beschrijving || null, sitelinks: i.sitelinks || [],
      extensies: (i.extensies || []).map((e) => `[${e.soort}] ${e.tekst}`), url: i.weergaveUrl || null, link: `https://adstransparency.google.com/advertiser/${c.adverteerderId}/creative/${c.cr}?region=BE` });
  }
}
rijen.sort((a, b) => (b.dagen || 0) - (a.dagen || 0));
fs.writeFileSync(path.join(__dirname, 'langst-actief.json'), JSON.stringify(rijen, null, 1));

const perSpeler = {};
for (const r of rijen) (perSpeler[r.speler] ||= []).push(r);
console.log(`actief (laatst >= ${GRENS}): ${rijen.length} advertenties`);
for (const [s, l] of Object.entries(perSpeler)) {
  const leesbaar = l.filter((r) => r.kop);
  console.log(`\n=== ${s}: ${l.length} actief, ${leesbaar.length} met gelezen tekst · langste ${l[0].dagen} dagen`);
  for (const r of leesbaar.slice(0, 6)) {
    console.log(`  ${String(r.dagen).padStart(4)}d · ${r.formaat} · KOP: ${r.kop}`);
    if (r.koppen.length > 1) console.log(`        koppen: ${r.koppen.join(' | ')}`);
    if (r.beschrijving) console.log(`        BESCHR: ${r.beschrijving}`);
    if (r.sitelinks.length) console.log(`        SITELINKS: ${r.sitelinks.join(' | ')}`);
    if (r.extensies.length) console.log(`        EXT: ${[...new Set(r.extensies)].slice(0, 6).join(' | ')}`);
  }
}
