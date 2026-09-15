/**
 * De zichtbare tekst van een advertentie uit de preview halen.
 *
 * Het register geeft per zoekadvertentie een preview-adres mee. Dat adres levert
 * een groot javascript-bestand waarin de volledige advertentie als string zit,
 * ge-escaped. Uitpakken en de tags eruit halen geeft de koppen en de
 * omschrijving.
 *
 * Draaien: node lees-tekst.cjs <register.json> <uit.json> [maxAdvertenties]
 */
const fs = require('node:fs');

const DATA = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const UIT = process.argv[3] || 'teksten.json';
const MAX = Number(process.argv[4] || 400);

const ontescape = (s) => s
  .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\n/g, '\n');

/* Rommel die in elke preview zit en niets met de advertentie te maken heeft. */
const RUIS = /^(GLS Ad Rendering Service|Appeler|Message|Bellen|Sponsored|Gesponsord|Ad|Advertentie)$/i;

async function tekstVan(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(25000) });
  const ruw = await r.text();
  const uit = ontescape(ruw)
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, '\n')
    .split('\n').map((x) => x.trim())
    .filter((x) => x.length > 3 && x.length < 120
      && /[a-zA-ZÀ-ÿ]{3}/.test(x)
      && !/[{}<>;=]|function|var |\.css|px;|\$/.test(x)
      && !RUIS.test(x));
  return [...new Set(uit)];
}

(async () => {
  const taken = [];
  for (const b of DATA) {
    for (const a of b.advertenties) {
      if (a.soort === 'tekst' && a.preview) taken.push({ naam: b.naam, ...a });
    }
  }
  /* Langstlopende eerst: daar zit het antwoord dat Mohammed zoekt. */
  taken.sort((x, y) => y.dagen - x.dagen);
  const set = taken.slice(0, MAX);
  console.log(`${taken.length} zoekadvertenties met preview, ${set.length} worden uitgelezen`);

  const uit = [];
  let mislukt = 0;
  for (let i = 0; i < set.length; i += 8) {
    const groep = set.slice(i, i + 8);
    const res = await Promise.all(groep.map(async (t) => {
      try { return { ...t, preview: undefined, regels: await tekstVan(t.preview) }; }
      catch { return null; }
    }));
    for (const r of res) { if (r && r.regels.length) uit.push(r); else mislukt++; }
    if ((i + 8) % 80 === 0) console.log(`  ${uit.length} gelezen, ${mislukt} mislukt`);
  }

  fs.writeFileSync(UIT, JSON.stringify(uit, null, 1));
  console.log(`\nKLAAR: ${uit.length} advertenties met tekst, ${mislukt} zonder`);
  if (!uit.length) { console.error('FOUT: geen enkele tekst gelezen — de meting is ongeldig'); process.exit(1); }
})();
