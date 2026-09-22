/**
 * Welke hoeken gebruiken de vijf grootste spelers, en hoe lang houden ze die vol?
 *
 * Leest top5.json (uit oogst.cjs). Per speler: de koppen en zinnen uit zijn
 * tekstadvertenties, ontdaan van de previewcode en het adres, en per hoek hoeveel
 * advertenties hem gebruiken en hoe lang de langste daarvan al loopt.
 *
 * Draaien: node ads/onderzoek-top5/hoeken.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'top5.json'), 'utf8'));

/* De previewcode begint met een JS-aanroep; alles na de eerste ' | ' is tekst. */
const schoon = (regels) => regels
  .join(' | ')
  .replace(/previewservice\.[^|]*\|/g, '')
  .split(' | ')
  .map((x) => x.replace(/^[·\s]+|['",\\)]+$/g, '').trim())
  .filter((x) => x.length > 3
    && !/^(Van |Sluizenstraat|Bekijk voorkeuren|Mijn advertentiecentrum)/.test(x)
    && !/\.(be|com|nl)$/.test(x)
    && !/^\d/.test(x));

const HOEKEN = {
  'stad in de kop': /^(dakwerken|dakwerker|dakdekker|renovatie|totaalrenovatie|aannemer)\s+[A-Z]/i,
  'gratis / vrijblijvende offerte': /gratis|vrijblijvend/i,
  'snelheid / binnen X': /binnen \d+|snel|24\/7|dezelfde dag|nood/i,
  'premie / subsidie / btw': /premie|subsidie|btw|lening/i,
  'prijs / kost berekenen': /bereken|simuleer|prijs|kost|scherpste|budget/i,
  'garantie': /garantie/i,
  'jaren ervaring / grootte': /\d+\s*(jaar|jr)|ervaring|nr\.? ?1|grootste|marktleider|\d+\s*(werven|projecten|klanten)/i,
  'betrouwbaar / vakmanschap': /betrouwba|vakman|vakkundig|kwaliteit|vertrouw/i,
  'ontzorgen / A tot Z / één partner': /ontzorg|zorgeloos|zonder zorg|a tot z|één (partner|aanspreekpunt)|van begin tot/i,
  'pijn / probleem vooraan': /\?|lek|schade|hoofdpijn|problemen|zorgen over/i,
  'eigen ploegen': /eigen (ploeg|personeel|team|mensen)/i,
  'reviews / sterren': /review|sterren|beoordeling|\d[,.]\d\/5/i,
};

const NU = Date.now();
for (const s of data) {
  const ads = s.advertenties;
  const tekst = ads.filter((a) => a.regels && a.regels.length);
  const loopt = ads.filter((a) => a.laatst && (NU - Date.parse(a.laatst)) / 864e5 <= 10).length;
  const lengtes = ads.map((a) => a.dagen || 0).sort((a, b) => b - a);
  const soort = {};
  for (const a of ads) soort[a.soort] = (soort[a.soort] || 0) + 1;

  console.log(`\n══ ${s.speler.toUpperCase()} ══  ${ads.length} advertenties · ${loopt} lopen nu · langste ${lengtes[0] || 0} dagen · ${JSON.stringify(soort)}`);
  console.log(`   eerste advertentie: ${ads.map((a) => a.eerst).filter(Boolean).sort()[0] || '?'}`);

  /* Per hoek: aantal tekstadvertenties en de langste looptijd. */
  const perHoek = [];
  for (const [hoek, re] of Object.entries(HOEKEN)) {
    const hits = tekst.filter((a) => schoon(a.regels).some((r) => re.test(r)));
    if (hits.length) perHoek.push([hoek, hits.length, Math.max(...hits.map((a) => a.dagen || 0))]);
  }
  perHoek.sort((a, b) => b[1] - a[1]);
  console.log(`   HOEKEN (van ${tekst.length} tekstadvertenties met leesbare tekst):`);
  for (const [h, n, max] of perHoek) console.log(`     ${h.padEnd(36)} ${String(n).padStart(3)} adv · langste ${max}d`);

  /* De zinnen zelf, langstlopende eerst, zonder dubbels. */
  const zinnen = new Map();
  for (const a of tekst.sort((x, y) => (y.dagen || 0) - (x.dagen || 0))) {
    for (const r of schoon(a.regels)) if (!zinnen.has(r)) zinnen.set(r, a.dagen || 0);
  }
  console.log('   ZINNEN (langste looptijd eerst):');
  [...zinnen.entries()].slice(0, 28).forEach(([z, d]) => console.log(`     ${String(d).padStart(4)}d  ${z.slice(0, 140)}`));
}
