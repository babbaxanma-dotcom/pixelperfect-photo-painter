/**
 * De uitgelezen advertentieteksten op een rij, langstlopende eerst, en alleen de
 * bedrijven die renovatie of verbouwing verkopen — keukenzaken en
 * projectontwikkelaars zeggen niets over wat AB moet schrijven.
 */
const fs = require('node:fs');
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const RELEVANT = /renov|verbouw|dak|gevel|badkamer|isolat|aannem|pleister|schrijnwerk|bouwwerk|algemene bouw|totaal/i;
const RUIS = /^(Local Ad Rendering Service|Sponsorisé|website|call|directions|ROUTE|ITIN|Site bezoeken|Visiter le site|Bellen|Route)$/i;

const NU = Math.floor(Date.now() / 1000);

const rijen = data
  .map((x) => ({ ...x, regels: x.regels.filter((r) => !RUIS.test(r)) }))
  .filter((x) => x.regels.some((r) => RELEVANT.test(r)) || RELEVANT.test(x.naam))
  .sort((a, b) => b.dagen - a.dagen);

console.log(`${rijen.length} van ${data.length} advertenties gaan over renovatie of verbouwen\n`);

for (const r of rijen) {
  const stil = Math.round((NU - r.laatst) / 86400);
  const staat = stil <= 10 ? 'LOOPT' : `gestopt ${stil}d geleden`;
  console.log(`${String(r.dagen).padStart(5)}d  ${staat.padEnd(20)} ${r.naam.slice(0, 34)}`);
  for (const regel of r.regels) console.log(`         ${regel}`);
  console.log('');
}
