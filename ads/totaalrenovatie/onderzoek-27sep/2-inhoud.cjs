/**
 * Stap 2: de inhoud van elke TEKSTadvertentie binnenhalen (overgenomen uit
 * onderzoek-top5/oogst-23sep/3-inhoud.cjs).
 *  - simgad-PNG (tpc.googlesyndication.com): schermafdruk -> OCR in stap 3.
 *  - content.js-preview (displayads-formats.googleusercontent.com): HTML.
 * Beide hosts zijn niet het rate-limited adstransparency.google.com.
 * Hervatbaar: wat al in de cache staat wordt overgeslagen.
 *
 * Draaien: CACHE=<map> node 2-inhoud.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const RAW = path.join(__dirname, 'raw');
const CACHE = process.env.CACHE || path.join(__dirname, 'cache');
const PNG = path.join(CACHE, 'png');
const HTML = path.join(CACHE, 'html');
fs.mkdirSync(PNG, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });

const ontescape = (s) => s
  .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\n/g, '\n').replace(/\\\//g, '/').replace(/\\"/g, '"').replace(/\\'/g, "'");

async function haal(url, doel, binair) {
  if (fs.existsSync(doel)) return 'cache';
  for (let p = 0; p < 3; p++) {
    try {
      const r = await fetch(url.split('\\u0026').join('&').split('&amp;').join('&'), { signal: AbortSignal.timeout(30000) });
      if (!r.ok) { if (r.status === 404) return 'status 404'; throw new Error('status ' + r.status); }
      if (binair) fs.writeFileSync(doel, Buffer.from(await r.arrayBuffer()));
      else fs.writeFileSync(doel, ontescape(await r.text()));
      return 'ok';
    } catch (e) { if (p === 2) return 'fout ' + e.message; await new Promise((k) => setTimeout(k, 2000)); }
  }
}

(async () => {
  const taken = [];
  for (const f of fs.readdirSync(RAW).filter((x) => x.endsWith('.json'))) {
    const st = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
    const uniek = new Map();
    for (const d of Object.values(st.doelen)) for (const c of d.creatives) uniek.set(c.cr, c);
    for (const c of uniek.values()) {
      if (c.formaat !== 'tekst') continue;
      if (c.beeld && /simgad/.test(c.beeld)) taken.push([c.beeld, path.join(PNG, c.cr + '.png'), true]);
      if (c.preview) taken.push([c.preview, path.join(HTML, c.cr + '.html'), false]);
    }
  }
  console.log(`${taken.length} bestanden (png + preview)`);
  const tel = {};
  for (let i = 0; i < taken.length; i += 8) {
    const res = await Promise.all(taken.slice(i, i + 8).map(([u, d, b]) => haal(u, d, b)));
    for (const r of res) tel[r] = (tel[r] || 0) + 1;
  }
  console.log('KLAAR', JSON.stringify(tel));
})();
