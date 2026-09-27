/**
 * Stap 1 (27 sep 2026): creatives van de totaalrenovatie-concurrenten uit het
 * Google Ads Transparency Center (regio België = 2056), zonder browser.
 *
 * Doelen: de adverteerders met de meeste unieke advertenties in
 * ../6-serp-concurrenten.txt (15 sep 2026), aannemers en offertesites apart.
 * Per domein één SearchCreatives-verzoek (100 per blad). De resultaten komen
 * gesorteerd op "laatst getoond", nieuwste eerst: er wordt pas een volgend blad
 * gehaald als het laatste item van het blad nog op of na GRENS getoond werd.
 *
 * Hervatbaar: stand per doel in raw/<slug>.json. Bij 429/captcha stopt het
 * script (rpc.cjs: harde stop, geen herhaalpogingen) en schrijft weg.
 *
 * Draaien: PAUZE=5000 node 1-oogst.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { rpc, Stop429, teller } = require('../../onderzoek-top5/oogst-25sep/rpc.cjs');

const RAW = path.join(__dirname, 'raw');
fs.mkdirSync(RAW, { recursive: true });
const GRENS = '2026-09-20';

/* serp = aantal unieke advertenties in 6-serp-concurrenten.txt */
const DOELEN = [
  { slug: 'verelst', naam: 'Aannemingen Verelst', soort: 'aannemer', serp: 20, domeinen: ['verelst.be'] },
  { slug: 'reno-x', naam: 'Reno X', soort: 'aannemer', serp: 8, domeinen: ['reno-x.be'] },
  { slug: 'kapareno', naam: 'KapaReno', soort: 'aannemer', serp: 7, domeinen: ['kapareno.be'] },
  { slug: 'martha', naam: 'Martha Bouwteam', soort: 'aannemer', serp: 7, domeinen: ['martha-bouwteam.be'] },
  { slug: 'ruverko', naam: 'RuverkO', soort: 'aannemer', serp: 5, domeinen: ['ruverko-totaalproject.be'] },
  /* Plaats 6 gedeeld: vijf aannemers met elk 4 advertenties. */
  { slug: 'builthings', naam: 'Builthings', soort: 'aannemer', serp: 4, domeinen: ['builthings.be'] },
  { slug: 'cleys', naam: 'Cleys', soort: 'aannemer', serp: 4, domeinen: ['cleys.be'] },
  { slug: 'diegopintelon', naam: 'Diego Pintelon', soort: 'aannemer', serp: 4, domeinen: ['diegopintelon.be'] },
  { slug: 'interieurkabinet', naam: 'InterieurKabinet', soort: 'aannemer', serp: 4, domeinen: ['interieurkabinet.be'] },
  { slug: 'totalinteriorconcept', naam: 'Total Interior Concept', soort: 'aannemer', serp: 4, domeinen: ['totalinteriorconcept.be'] },
  /* Offertesites */
  { slug: 'aannemeroffertes', naam: 'aannemeroffertes.be', soort: 'offertesite', serp: 12, domeinen: ['aannemeroffertes.be'] },
  { slug: 'bobex', naam: 'Bobex', soort: 'offertesite', serp: 0, domeinen: ['bobex.be'] },
  { slug: 'solvari', naam: 'Solvari', soort: 'offertesite', serp: 0, domeinen: ['solvari.be'] },
  { slug: 'renovatiewereld', naam: 'Renovatiewereld', soort: 'offertesite', serp: 0, domeinen: ['renovatiewereld.be'] },
];
const MAX_BLADEN = { aannemer: 5, offertesite: 3 };

const FORMAAT = { 1: 'tekst', 2: 'beeld', 3: 'video' };
const lees = (c) => {
  const inhoud = c['3'] || {};
  const eerst = Number((c['6'] || {})['1'] || 0);
  const laatst = Number((c['7'] || {})['1'] || 0);
  const img = ((inhoud['3'] || {})['2'] || '').match(/src="([^"]+)"/);
  return {
    adverteerderId: c['1'], cr: c['2'], adverteerder: c['12'],
    formaatCode: c['4'], formaat: FORMAAT[c['4']] || 'onbekend',
    eerst: eerst ? new Date(eerst * 1000).toISOString().slice(0, 10) : null,
    laatst: laatst ? new Date(laatst * 1000).toISOString().slice(0, 10) : null,
    eerstTs: eerst, laatstTs: laatst,
    looptijdDagen: eerst && laatst ? Math.round((laatst - eerst) / 86400) : null,
    dagenGetoond: c['13'] ?? null,
    preview: (inhoud['1'] || {})['4'] || null,
    beeld: img ? img[1] : null,
  };
};

async function bladen(doel, domein, max) {
  while (!doel.klaar && doel.bladen < max) {
    const payload = { 2: 100, 3: { 8: [2056], 12: { 1: domein, 2: true } }, 7: { 1: 1, 2: 0, 3: 2008 } };
    if (doel.token) payload[4] = doel.token;
    const a = await rpc('SearchService/SearchCreatives', payload);
    const rij = a['1'] || [];
    for (const c of rij) doel.creatives.push(lees(c));
    if (a['4'] && doel.totaal == null) doel.totaal = Number(a['4']);
    doel.bladen++;
    doel.token = a['2'] || null;
    const laatste = rij.length ? lees(rij[rij.length - 1]) : null;
    if (!doel.token || !rij.length) doel.klaar = true;
    else if (laatste && laatste.laatst && laatste.laatst < GRENS) { doel.klaar = true; doel.gestoptOpGrens = true; }
  }
}

(async () => {
  let gestopt = null;
  for (const s of DOELEN) {
    const bestand = path.join(RAW, `${s.slug}.json`);
    const st = fs.existsSync(bestand) ? JSON.parse(fs.readFileSync(bestand, 'utf8'))
      : { speler: s.naam, slug: s.slug, soort: s.soort, serp: s.serp, oogst: '2026-09-27', doelen: {} };
    const bewaar = () => fs.writeFileSync(bestand, JSON.stringify(st, null, 1));
    try {
      for (const d of s.domeinen) {
        const k = 'domein:' + d;
        st.doelen[k] ||= { creatives: [], token: null, klaar: false, bladen: 0, totaal: null };
        await bladen(st.doelen[k], d, MAX_BLADEN[s.soort]);
        bewaar();
      }
    } catch (e) {
      bewaar();
      gestopt = e instanceof Stop429 ? e.message : 'FOUT ' + e.message;
      console.log(`${s.naam}: GESTOPT — ${gestopt}`);
      break;
    }
    const uniek = new Map();
    for (const d of Object.values(st.doelen)) for (const c of d.creatives) uniek.set(c.cr, c);
    const act = [...uniek.values()].filter((c) => c.laatst && c.laatst >= GRENS).length;
    const ids = [...new Set([...uniek.values()].map((c) => `${c.adverteerder} ${c.adverteerderId}`))];
    const totalen = Object.entries(st.doelen).map(([k, d]) => `${k} ${d.creatives.length}/${d.totaal ?? '?'}${d.klaar ? '' : ' (open)'}`).join(' · ');
    console.log(`${s.naam.padEnd(24)} ${String(uniek.size).padStart(4)} uniek · ${act} actief · ${totalen} · ${ids.join(' / ')}`);
  }
  console.log(`\ncalls deze run: ${teller()}${gestopt ? ' · GESTOPT: ' + gestopt : ' · alles doorlopen'}`);
  if (gestopt) process.exit(2);
})();
