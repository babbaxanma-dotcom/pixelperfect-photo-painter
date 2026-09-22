/**
 * Alle advertenties van de vijf grootste spelers uit het Google Ads Transparency
 * Center, met looptijd en — voor tekstadvertenties — de tekst zelf.
 *
 * Mohammed wees de spelers aan (22 sep 2026): Dural Bouwgroep, Recotex,
 * Rinovato en Kijzer. Verelst komt erbij als grootste adverteerder op
 * totaalrenovatie (1095 dagen, 40 advertenties die alle 40 lopen).
 *
 * Werkwijze:
 *   1. Per speler de adverteerder-id's zoeken: eerst op domein via
 *      SearchCreatives (veld 12 = domeinfilter), daarna op merknaam via
 *      SearchSuggestions. Een Belgische KMO staat vaak op de naam van de
 *      zaakvoerder of een holding, dus beide wegen.
 *   2. Per adverteerder alle advertenties ophalen met begin- en einddatum.
 *   3. Van tekstadvertenties de preview openen en de zichtbare tekst eruit
 *      halen; van beeldadvertenties het beeldadres bewaren.
 *
 * Draaien: node ads/onderzoek-top5/oogst.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const UIT = path.join(__dirname, 'top5.json');
const SPELERS = [
  { naam: 'Kijzer', domeinen: ['kijzer.be'], merk: ['kijzer'] },
  { naam: 'Dural Bouwgroep', domeinen: ['dural.be', 'duralbouwgroep.be'], merk: ['dural bouwgroep', 'dural'] },
  { naam: 'Recotex', domeinen: ['recotex.be'], merk: ['recotex'] },
  { naam: 'Rinovato', domeinen: ['rinovato.be'], merk: ['rinovato', 'facibel'] },
  { naam: 'Verelst', domeinen: ['verelst.be'], merk: ['aannemingen verelst', 'verelst'] },
];

const KOPPEN = {
  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
  origin: 'https://adstransparency.google.com',
  referer: 'https://adstransparency.google.com/?region=BE',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
};
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));

async function rpc(naam, payload) {
  for (let poging = 0; poging < 3; poging++) {
    const r = await fetch(`https://adstransparency.google.com/anji/_/rpc/${naam}?authuser=`, {
      method: 'POST', headers: KOPPEN,
      body: 'f.req=' + encodeURIComponent(JSON.stringify(payload)),
      signal: AbortSignal.timeout(30000),
    });
    if (r.status === 429) { console.log('  429 — 90s wachten'); await wacht(90000); continue; }
    if (!r.ok) throw new Error(`${naam} status ${r.status}`);
    await wacht(900);
    return r.json();
  }
  throw new Error('429 blijft komen');
}

/* Veldnummers zoals waargenomen in de antwoorden: 6 = eerste vertoning,
   7 = laatste, 3 = inhoud (1 = tekst met preview, 2 = video, 3 = beeld). */
const leesAdv = (c) => {
  const inhoud = c['3'] || {};
  const soort = inhoud['1'] ? 'tekst' : inhoud['2'] ? 'video' : inhoud['3'] ? 'beeld' : 'onbekend';
  const eerst = Number((c['6'] || {})['1'] || 0);
  const laatst = Number((c['7'] || {})['1'] || 0);
  const beeld = ((inhoud['3'] || {})['2'] || '').match(/src="([^"]+)"/);
  return {
    adverteerder: c['1'], cr: c['2'], naam: c['12'], soort,
    eerst: eerst ? new Date(eerst * 1000).toISOString().slice(0, 10) : null,
    laatst: laatst ? new Date(laatst * 1000).toISOString().slice(0, 10) : null,
    dagen: eerst && laatst ? Math.round((laatst - eerst) / 86400) : null,
    preview: (inhoud['1'] || {})['4'] || null,
    beeld: beeld ? beeld[1] : null,
  };
};

async function creatives(filter) {
  const alles = [];
  let token = null;
  for (let blad = 0; blad < 6; blad++) {
    const payload = { 2: 100, 3: { 8: [2056], 12: { 1: filter.domein || '', 2: true }, ...(filter.id ? { 13: { 1: [filter.id] } } : {}) }, 7: { 1: 1, 2: 0, 3: 2008 } };
    if (token) payload[4] = token;
    const a = await rpc('SearchService/SearchCreatives', payload);
    for (const c of a['1'] || []) alles.push(leesAdv(c));
    token = a['2'] || null;
    if (!token || !(a['1'] || []).length) break;
  }
  return alles;
}

const ontescape = (s) => s
  .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\n/g, '\n');
const RUIS = /^(GLS Ad Rendering Service|Local Ad Rendering Service|Appeler|Message|Bellen|Sponsored|Gesponsord|Sponsorisé|website|call|directions|Route|ROUTE|Site bezoeken|Website|Bel ons)$/i;

async function tekstVan(url) {
  try {
    const t = await (await fetch(url.split('\\u0026').join('&'), { signal: AbortSignal.timeout(25000) })).text();
    return [...new Set(ontescape(t)
      .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, '\n').split('\n').map((x) => x.trim().replace(/\\$/, ''))
      .filter((x) => x.length > 3 && x.length < 160 && /[a-zA-ZÀ-ÿ]{3}/.test(x)
        && !/[{}<>;=]|function|var |\.css|px;|\$/.test(x) && !RUIS.test(x)))];
  } catch { return []; }
}

(async () => {
  const uit = [];
  for (const s of SPELERS) {
    const gezien = new Map();
    /* 1. Op domein. */
    for (const d of s.domeinen) {
      try {
        for (const a of await creatives({ domein: d })) gezien.set(a.cr, a);
      } catch (e) { console.log(`  ${d}: ${e.message}`); }
    }
    /* 2. Op merknaam, alleen Belgische adverteerders met een bouwnaam. */
    const ids = new Set([...gezien.values()].map((a) => a.adverteerder));
    for (const m of s.merk) {
      try {
        const sug = await rpc('SearchService/SearchSuggestions', { 1: m, 2: 30, 3: 30, 4: [2056], 5: { 1: 1 } });
        for (const r of sug['1'] || []) {
          const a = r['1'];
          if (a && a['3'] === 'BE' && new RegExp(s.merk[0].split(' ')[0], 'i').test(a['1'])) ids.add(a['2']);
        }
      } catch (e) { console.log(`  ${m}: ${e.message}`); }
    }
    for (const id of ids) {
      try { for (const a of await creatives({ id })) gezien.set(a.cr, a); }
      catch (e) { console.log(`  ${id}: ${e.message}`); }
    }

    const ads = [...gezien.values()];
    /* 3. Tekst uit de previews, langstlopende eerst. */
    const tekst = ads.filter((a) => a.preview).sort((x, y) => (y.dagen || 0) - (x.dagen || 0)).slice(0, 60);
    for (let i = 0; i < tekst.length; i += 6) {
      await Promise.all(tekst.slice(i, i + 6).map(async (a) => { a.regels = await tekstVan(a.preview); }));
    }
    for (const a of ads) delete a.preview;

    const loopt = ads.filter((a) => a.laatst && (Date.now() - Date.parse(a.laatst)) / 864e5 <= 10).length;
    console.log(`${s.naam.padEnd(18)} ${String(ads.length).padStart(4)} advertenties, ${loopt} lopen · adverteerders: ${[...new Set(ads.map((a) => a.naam))].join(' / ')}`);
    uit.push({ speler: s.naam, advertenties: ads });
    fs.writeFileSync(UIT, JSON.stringify(uit, null, 1));
  }
  const n = uit.reduce((t, s) => t + s.advertenties.length, 0);
  console.log(`\nKLAAR: ${n} advertenties over ${uit.length} spelers → ${UIT}`);
  if (!n) { console.error('FOUT: niets gevonden — ongeldige run'); process.exit(1); }
})();
