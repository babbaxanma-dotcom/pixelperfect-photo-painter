/**
 * Welke belofte staat er in de advertenties van de concurrentie, en hoeveel
 * bedrijven zeggen precies hetzelfde?
 *
 * Bron: 6-serp-concurrenten.txt — de echte advertenties op de Belgische
 * zoekresultaten, 15 sep 2026, opgehaald met een gewone browser (headless Chrome
 * krijgt geen advertenties geserveerd).
 *
 * Het aantal BEDRIJVEN per thema telt, niet het aantal advertenties: één
 * adverteerder met twintig varianten van dezelfde zin is één stem, geen twintig.
 *
 * Draaien: node ads/totaalrenovatie/analyse-serp.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const BRON = path.join(__dirname, '6-serp-concurrenten.txt');
const regels = fs.readFileSync(BRON, 'utf8').split('\n')
  .filter((r) => r.includes(' :: '))
  .map((r) => { const d = r.split(' :: '); return { domein: d[0].trim(), tekst: r }; });

const THEMAS = {
  'ontzorgen / zonder stress': /zonder (gedoe|stress|zorg|zorgen|vraagtekens|verrassingen)|zorgeloos|zorgeloze|ontzorg|geen verrassingen/i,
  'één aanspreekpunt / A tot Z': /(één|een|1) (aanspreekpunt|partner|contact)\b|van a ?(tot|-) ?z|a tot z|start tot afwerking|begin tot eind|onder één dak|ruwbouw tot afwerking/i,
  'jaren ervaring': /\d+\+? ?(jaar|jr) (ervaring|bouwervaring|actief)|jarenlange ervaring|meer dan \d+ jaar/i,
  'gratis / vrijblijvend': /gratis (offerte|prijs|plaatsbezoek|werfbezoek|advies)|vrijblijvend/i,
  'realisaties / beoordelingen': /realisatie|projecten bekijken|voor ?& ?na|reviews|beoordeeld|\d,\d \(\d+\)|\d+\+ ?(renovaties|woningen)/i,
  'kwaliteit / vakmanschap': /vakmanschap|kwaliteit|hoogwaardige|topkwaliteit|piekfijn|oog voor detail/i,
  'lokaal / stad in de kop': /jouw (buurt|regio)|lokale|in de regio|omstreken|omgeving/i,
  'SNELHEID MET EEN GETAL': /binnen \d+ ?(u|uur|dagen|weken|minuten)|in \d+ minuten|48u|in slechts \d/i,
  'VASTE PRIJS VOORAF': /vaste prijs|heldere prijs|eerlijke (raming|inschatting|prijs)|binnen uw budget/i,
  'PRIJS ZELF BEREKENEN': /bereken|prijs ?schatting|wat kost|kost totaalrenovatie|huis kosten/i,
  'GARANTIE': /\bgarantie\b/i,
  'EIGEN PERSONEEL': /eigen (personeel|team|ploeg|vakmensen)/i,
  'PREMIE OF BTW': /premie|subsidie|\bbtw\b|6%/i,
};

const bedrijven = new Set(regels.map((r) => r.domein));
const uit = [];
for (const [naam, re] of Object.entries(THEMAS)) {
  const treffers = regels.filter((r) => re.test(r.tekst));
  uit.push({ naam, ads: treffers.length, bedrijven: new Set(treffers.map((t) => t.domein)).size });
}
uit.sort((a, b) => b.bedrijven - a.bedrijven);

console.log(`${regels.length} advertenties van ${bedrijven.size} adverteerders\n`);
console.log('THEMA                          BEDRIJVEN   ADVERTENTIES');
for (const t of uit) {
  const balk = '#'.repeat(t.bedrijven);
  console.log(`  ${t.naam.padEnd(30)} ${String(t.bedrijven).padStart(2)}/${bedrijven.size}  ${String(t.ads).padStart(4)}  ${balk}`);
}

/* Een meting die niets vindt bewijst niets: de drukste thema's horen er te zijn. */
const druk = uit.find((t) => t.naam.startsWith('ontzorgen'));
if (!regels.length || !druk || druk.bedrijven < 5) {
  console.error('\nFOUT: bron leeg of niet herkend — de meting is ongeldig');
  process.exit(1);
}

console.log('\nVOL  = wat bijna iedereen zegt, daar valt AB niet op');
console.log('LEEG = advertentieruimte die niemand claimt (HOOFDLETTERS hierboven)');
