/**
 * Van een lijst concurrent-domeinen naar hun volledige advertentiegeschiedenis.
 *
 * De domeinen komen uit de echte zoekresultaten van Google: dat zijn per definitie
 * bedrijven die vandaag betalen voor "totaalrenovatie" en varianten. Het register
 * van Google zegt er vervolgens bij hoe lang elke advertentie al loopt en welke
 * er gestopt zijn.
 *
 * Twee stappen per domein:
 *   SearchSuggestions   domein of merknaam -> adverteerder-id
 *   SearchCreatives     adverteerder-id    -> al zijn advertenties met datums
 *
 * Tempo: het register geeft na een paar honderd snelle verzoeken een 429 met een
 * captcha. Daarom een vaste pauze tussen elk verzoek en opnieuw proberen met een
 * langere pauze als het toch misgaat.
 *
 * Draaien: node oogst-domeinen.cjs <domeinen.json> <uit.json>
 */
const fs = require('node:fs');

const DOMEINEN = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const UIT = process.argv[3] || 'domeinen.json';
const PAUZE = 1500;

const wacht = (ms) => new Promise((k) => setTimeout(k, ms));

const KOPPEN = {
  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
  origin: 'https://adstransparency.google.com',
  referer: 'https://adstransparency.google.com/?region=BE',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
};

async function rpc(naam, payload, poging = 0) {
  const r = await fetch(`https://adstransparency.google.com/anji/_/rpc/${naam}?authuser=`, {
    method: 'POST', headers: KOPPEN,
    body: 'f.req=' + encodeURIComponent(JSON.stringify(payload)),
    signal: AbortSignal.timeout(30000),
  });
  if (r.status === 429) {
    if (poging >= 4) throw new Error('429 blijft komen');
    const rust = 60000 * (poging + 1);
    console.log(`  429 — ${rust / 1000}s wachten`);
    await wacht(rust);
    return rpc(naam, payload, poging + 1);
  }
  if (!r.ok) throw new Error('status ' + r.status);
  return r.json();
}

const soortVan = (i) => (!i ? 'onbekend' : i['1'] ? 'tekst' : i['2'] ? 'video' : i['3'] ? 'beeld' : 'onbekend');

/* Van domein naar merkwoord: kijzer.be -> kijzer, bear-renovations.com -> bear renovations. */
const merkVan = (d) => d.replace(/^www\./, '').replace(/\.[a-z.]+$/, '').split('-').join(' ');

(async () => {
  const uit = [];
  for (const [i, domein] of DOMEINEN.entries()) {
    let gekozen = null;
    try {
      /* Eerst op het domein zelf zoeken, dan op het merkwoord. */
      for (const vraag of [domein, merkVan(domein)]) {
        const s = await rpc('SearchService/SearchSuggestions', { 1: vraag, 2: 30, 3: 30, 4: [2056], 5: { 1: 1 } });
        await wacht(PAUZE);
        const kandidaten = (s['1'] || []).map((x) => x['1']).filter((a) => a && a['3'] === 'BE');
        if (!kandidaten.length) continue;
        /* De adverteerder met de meeste advertenties is het echte bedrijf, niet
           een naamgenoot met één advertentie. */
        kandidaten.sort((a, b) => Number(((b['4'] || {})['2'] || {})['1'] || 0) - Number(((a['4'] || {})['2'] || {})['1'] || 0));
        gekozen = { id: kandidaten[0]['2'], naam: kandidaten[0]['1'],
          aantal: Number(((kandidaten[0]['4'] || {})['2'] || {})['1'] || 0) };
        break;
      }
    } catch (e) { console.log(`  ${domein}: ${e.message}`); }

    let ads = [];
    if (gekozen) {
      try {
        const c = await rpc('SearchService/SearchCreatives', {
          2: 100, 3: { 8: [2056], 12: { 1: '', 2: true }, 13: { 1: [gekozen.id] } }, 7: { 1: 1, 2: 0, 3: 2008 },
        });
        await wacht(PAUZE);
        ads = (c['1'] || []).map((x) => {
          const eerst = Number((x['6'] || {})['1'] || 0);
          const laatst = Number((x['7'] || {})['1'] || 0);
          return {
            cr: x['2'], soort: soortVan(x['3']),
            eerst, laatst,
            dagen: eerst && laatst ? Math.round((laatst - eerst) / 86400) : null,
            dagenGetoond: x['13'] ?? null,
            preview: ((x['3'] || {})['1'] || {})['4'] || null,
          };
        }).filter((x) => x.dagen !== null);
      } catch (e) { console.log(`  ${domein} advertenties: ${e.message}`); }
    }

    uit.push({ domein, ...(gekozen || {}), advertenties: ads });
    console.log(`${String(i + 1).padStart(3)}/${DOMEINEN.length} ${domein.padEnd(30)} ${(gekozen ? gekozen.naam : 'niet gevonden').slice(0, 28).padEnd(30)} ${ads.length} adv`);
    fs.writeFileSync(UIT, JSON.stringify(uit, null, 1));
  }

  const n = uit.reduce((s, x) => s + x.advertenties.length, 0);
  const met = uit.filter((x) => x.advertenties.length).length;
  console.log(`\nKLAAR: ${n} advertenties over ${met} van de ${DOMEINEN.length} domeinen`);
  if (!n) { console.error('FOUT: niets gemeten — ongeldige run'); process.exit(1); }
})();
