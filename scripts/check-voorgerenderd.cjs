/* check-voorgerenderd (3 nov 2026): toetst de voorgerenderde LP's (scripts/prerender-lp.mjs) op een productiebuild.
 * 1) kop en knoppen staan in beeld vóór het script geladen is; 2) een tik op een keuze vóór React klaar is, wordt na het
 * hydrateren uitgevoerd (stap 1 -> 2); 3) geen hydratatiefout. Tegenproef (3 nov): met __abKlaar vooraf op true gaat de tik
 * verloren en wordt de toets rood.
 * Draaien: npm run build, dist serveren zoals Vercel (eerst <pad>/index.html), dan LP_BASIS=http://127.0.0.1:<poort> node scripts/check-voorgerenderd.cjs */
const puppeteer = require('puppeteer-core');
const B = process.env.LP_BASIS || process.argv[2] || 'http://127.0.0.1:8090';
const BLOK = /clarity\.ms|googletagmanager|google-analytics|doubleclick|googleadservices|leadconnector|web3forms|facebook|fonts\.g/;
let fout = 0; const t = (n, ok, info = '') => { console.log((ok ? '  ok   ' : '  FOUT ') + n + (ok ? '' : '  (' + info + ')')); if (!ok) fout++; };
const teller = (p) => p.evaluate(() => { const e = [...document.querySelectorAll('#root *')].find((x) => /^Stap \d+ van \d+$/.test((x.textContent || '').trim()) && x.children.length === 0); return e ? e.textContent.trim() : null; });
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  for (const pad of ['/lp/dakwerken', '/lp/dakwerken/asbest', '/lp/totaalrenovatie', '/lp/aannemer-renovatiewerken']) for (const [w, h] of [[390, 664], [1265, 800]]) {
    const p = await b.newPage(); const log = [];
    p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) log.push(m.text().slice(0, 160)); });
    p.on('pageerror', (e) => log.push('pageerror ' + e.message.slice(0, 160)));
    await p.setRequestInterception(true);
    // hoofdscript 2,5 s vertragen, zodat er een venster is waarin de pagina zichtbaar maar nog niet gehydrateerd is
    p.on('request', (r) => { const u = r.url(); if (BLOK.test(u)) return r.respond({ status: 204, body: '' }); if (/\/assets\/.+\.js$/.test(u) && !p.__vrij) return setTimeout(() => r.continue(), 2500); r.continue(); });
    await p.setViewport({ width: w, height: h, isMobile: w < 1000, hasTouch: w < 1000 });
    await p.goto(B + pad, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 400));
    const voor = await p.evaluate(() => ({ klaar: !!window.__abKlaar, h1: !!document.querySelector('#root h1'), keuze: !!document.querySelector('#root button') }));
    t(`${w} ${pad}: kop en knoppen zichtbaar vóór het script geladen is`, voor.h1 && voor.keuze && !voor.klaar, JSON.stringify(voor));
    const stap0 = await teller(p);
    // vroege tik op de eerste keuzeknop in het formulier (tegel/keuze), via een echte muisklik
    const doel = await p.evaluateHandle(() => [...document.querySelectorAll('#root button')].find((x) => { const r = x.getBoundingClientRect(); return r.top > 0 && r.bottom < innerHeight && r.width > 60 && /dak|renovatie|bouw|badkamer|Hellend|Plat|Ja|keuken|uitbreiding/i.test(x.textContent || '') && !/Bel|menu|Lees/i.test(x.textContent || ''); }));
    const naam = await p.evaluate((x) => (x ? x.textContent.trim().slice(0, 30) : null), doel);
    if (naam) { const bb = await doel.boundingBox(); await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); }
    await p.waitForFunction(() => window.__abKlaar === true, { timeout: 30000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1200));
    const stap1 = await teller(p);
    t(`${w} ${pad}: vroege tik op "${naam}" wordt na het hydrateren uitgevoerd (${stap0} -> ${stap1})`, !!naam && stap0 && stap1 && stap0 !== stap1, JSON.stringify({ naam, stap0, stap1 }));
    const hydra = log.filter((l) => /hydrat|did not match|Minified React error #(418|419|421|422|423|425)|Text content does not match|server rendered/i.test(l));
    t(`${w} ${pad}: geen hydratatiefout of paginafout in de console`, hydra.length === 0 && !log.some((l) => l.startsWith('pageerror')), JSON.stringify(log.slice(0, 4)));
    await p.close();
  }
  await b.close(); console.log(fout ? `ROOD ${fout}` : 'GROEN'); process.exit(fout ? 1 : 0);
})().catch((e) => { console.error(e.message); process.exit(2); });
