/* Stap 1b: adverteerder zoeken via SearchSuggestions (regio 2056 = België). node 1b-suggesties.cjs <term> */
const { rpc, Stop429 } = require('../../onderzoek-top5/oogst-25sep/rpc.cjs');
(async () => {
  try {
    const s = await rpc('SearchService/SearchSuggestions', { 1: process.argv[2], 2: 60, 3: 60, 4: [2056], 5: { 1: 1 } });
    for (const r of s['1'] || []) console.log(r['1'] ? `${r['1']['2']} | ${r['1']['1']} | ${r['1']['3']} | ${Number(((r['1']['4'] || {})['2'] || {})['1'] || 0)}` : `domein ${(r['2'] || {})['1']}`);
  } catch (e) { console.log(e instanceof Stop429 ? 'GESTOPT: ' + e.message : 'FOUT: ' + e.message); process.exit(2); }
})();
