/**
 * Stap 2: ALLE creatives per adverteerder uit het Transparency Center (regio
 * België = 2056), met volledige paginatie (token in veld 2 van het antwoord).
 *
 * Hervatbaar: de stand (verzamelde creatives + volgende token) staat per doel
 * in raw/<slug>.json. Bij 429/captcha stopt het script netjes en schrijft weg;
 * opnieuw draaien gaat verder waar het stopte.
 *
 * Draaien: node 2-creatives.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { rpc, Stop429, teller } = require('./rpc.cjs');

const RAW = path.join(__dirname, 'raw');
fs.mkdirSync(RAW, { recursive: true });

/* id's uit suggesties.json (1-suggesties.cjs, 23 sep 2026). */
const SPELERS = [
  { slug: 'dural', naam: 'Dural Bouwgroep', ids: ['AR14597423254357409793'], domeinen: ['dural-bouwgroep.be'] },
  { slug: 'kijzer', naam: 'Kijzer', ids: ['AR02015556340159610881', 'AR13617136139147149313'], domeinen: ['kijzer.be'] },
  { slug: 'recotex', naam: 'Recotex', ids: ['AR08325191579513913345'], domeinen: ['recotex.be', 'campagnes-recotex.be'] },
  { slug: 'rinovato', naam: 'Rinovato / Facibel', ids: ['AR12659967956717928449'], domeinen: ['rinovato.be'] },
  { slug: 'verelst', naam: 'Aannemingen Verelst', ids: ['AR13925616890962509825'], domeinen: ['verelst.be'] },
  { slug: 'ovb', naam: 'OVB Construct', ids: ['AR11612765766432063489'], domeinen: ['ovbconstruct.be'] },
  { slug: 'michielse', naam: 'Michielse & Zonen', ids: ['AR00499202794683629569', 'AR16498392366730706945'], domeinen: ['michielse.be', 'michielse-dakwerken.be'] },
  /* De 5 extra met de meeste creatives uit de zoektermen dakwerken/dakrenovatie/dak vernieuwen/dakdekker. */
  { slug: 'hars', naam: 'Dakwerken Hars', ids: ['AR05779876492548767745'], domeinen: [] },
  { slug: 'brems', naam: 'Brems Dakwerken', ids: ['AR06806312584677949441', 'AR15616213497245859841'], domeinen: [] },
  { slug: 'h-en-k', naam: 'Dakwerken H-en-K', ids: ['AR06874440575697813505'], domeinen: [] },
  { slug: 'dhooge', naam: "Dakwerken D'hooge", ids: ['AR01500061248463568897'], domeinen: [] },
  { slug: 'jv', naam: 'JV Dakwerken', ids: ['AR18086045418747068417'], domeinen: [] },
];

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

async function allePaginas(doel, filter, maxBladen = 100) {
  /* doel = { creatives:[], token, klaar, totaal } — wordt ter plekke bijgewerkt. */
  while (!doel.klaar && doel.bladen < maxBladen) {
    const payload = { 2: 100, 3: { 8: [2056], 12: { 1: filter.domein || '', 2: true }, ...(filter.id ? { 13: { 1: [filter.id] } } : {}) }, 7: { 1: 1, 2: 0, 3: 2008 } };
    if (doel.token) payload[4] = doel.token;
    const a = await rpc('SearchService/SearchCreatives', payload);
    const rij = a['1'] || [];
    for (const c of rij) doel.creatives.push(lees(c));
    if (a['4'] && doel.totaal == null) doel.totaal = Number(a['4']);
    doel.bladen++;
    doel.token = a['2'] || null;
    if (!doel.token || !rij.length) doel.klaar = true;
  }
}

(async () => {
  let gestopt = null;
  for (const s of SPELERS) {
    const bestand = path.join(RAW, `${s.slug}.json`);
    const st = fs.existsSync(bestand) ? JSON.parse(fs.readFileSync(bestand, 'utf8'))
      : { speler: s.naam, slug: s.slug, doelen: {} };
    const bewaar = () => fs.writeFileSync(bestand, JSON.stringify(st, null, 1));
    try {
      /* Domeinen: alleen blad 1, om adverteerder-id's achter het domein te vinden. */
      for (const d of s.domeinen) {
        const k = 'domein:' + d;
        st.doelen[k] ||= { creatives: [], token: null, klaar: false, bladen: 0, totaal: null };
        if (st.doelen[k].bladen < 1) { await allePaginas(st.doelen[k], { domein: d }, 1); bewaar(); }
        for (const c of st.doelen[k].creatives) if (!s.ids.includes(c.adverteerderId)) s.ids.push(c.adverteerderId);
      }
      for (const id of s.ids) {
        const k = 'id:' + id;
        st.doelen[k] ||= { creatives: [], token: null, klaar: false, bladen: 0, totaal: null };
        await allePaginas(st.doelen[k], { id });
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
    const totalen = Object.entries(st.doelen).map(([k, d]) => `${k} ${d.creatives.length}/${d.totaal ?? '?'}${d.klaar ? '' : ' (open)'}`).join(' · ');
    console.log(`${s.naam.padEnd(22)} ${String(uniek.size).padStart(5)} uniek · ${totalen}`);
  }
  console.log(`\ncalls deze run: ${teller()}${gestopt ? ' · GESTOPT: ' + gestopt : ' · alles doorlopen'}`);
  if (gestopt) process.exit(2);
})();
