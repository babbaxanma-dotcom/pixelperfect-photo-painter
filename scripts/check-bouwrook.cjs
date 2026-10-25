#!/usr/bin/env node
/**
 * Rendert elke pagina in de GEBOUWDE site?
 *
 * Aanleiding (12 okt 2026): op de dev-server stond alles goed, maar de build toonde op
 * elke pagina een wit scherm. Een opzoeking zocht een foto op zijn bestandsnaam in de url;
 * in de build heet elk beeld assets/<hash>.jpg (vite.config.ts assetFileNames), dus de
 * opzoeking vond niets en gooide een fout bij het laden van de code. Een push had de hele
 * site wit gezet. Geen test meet dat, want alle andere checks openen enkele pagina's of
 * draaien tegen de dev-server.
 *
 * Wat hier faalt, per route in de build:
 *   - een JavaScript-fout op de pagina (pageerror);
 *   - niet precies één h1;
 *   - minder dan 300 tekens zichtbare tekst (wit of half scherm).
 *
 * Draaien: node scripts/check-bouwrook.cjs   (start zelf een preview-server)
 */
const { startPreview } = require('./_preview.cjs');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PAD || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROUTES = ['/', '/over', '/diensten', '/werkwijze', '/contact',
  '/dakwerken', '/gevel', '/bad', '/interieur', '/construct', '/ecologisch',
  '/privacy', '/voorwaarden', '/cookies', '/bestaat-niet',
  '/totaalrenovatie', '/badkamerrenovatie', '/lp/badkamerrenovatie',
  '/lp/dakwerken', '/lp/totaalrenovatie', '/lp/richtprijs-berekenen', '/lp/aannemer-renovatiewerken',
  '/bedankt/totaalrenovatie', '/afspraak',
  /* 13 okt 2026: de dak-kant van de funnel (BedanktBf.tsx, AfspraakBf.tsx). */
  '/bedankt/dakwerken?van=rekenaar', '/dakinspectie'];
/* Analytics en advertentietags blijven dicht: een meting stuurt niets naar buiten. */
const BLOK = /clarity\.ms|googletagmanager|google-analytics|doubleclick|googleadservices|facebook/;

const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

(async () => {
  const server = await startPreview(4392);
  const basis = `http://localhost:${server.poort}`;
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
    const open = async (pad) => {
      const p = await browser.newPage();
      await p.setViewport({ width: 1265, height: 720 });
      await p.setRequestInterception(true);
      /* De GHL-kalender op /afspraak doet bij het laden zelf een POST (attribution_service): elke POST naar
         leadconnectorhq of web3forms krijgt een leeg antwoord, OPTIONS met CORS-headers. */
      p.on('request', (r) => {
        if (BLOK.test(r.url())) return r.abort();
        if (/leadconnectorhq|web3forms/.test(r.url()) && r.method() === 'OPTIONS') return r.respond({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' }, body: '' });
        if (/leadconnectorhq|web3forms/.test(r.url()) && r.method() !== 'GET' && r.method() !== 'HEAD') return r.respond({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: '{}' });
        return r.continue();
      });
      const fouten = [];
      p.on('pageerror', (e) => fouten.push(String(e.message || e).slice(0, 160)));
      await p.goto(basis + pad, { waitUntil: 'networkidle0', timeout: 60000 });
      return { p, fouten };
    };

    /* Positieve controle: een fout die de pagina zelf gooit, moet hier gezien worden. */
    {
      const { p, fouten } = await open('/');
      await p.evaluate(() => setTimeout(() => { throw new Error('positieve controle'); }, 0));
      await new Promise((k) => setTimeout(k, 300));
      await p.close();
      if (!fouten.some((f) => f.includes('positieve controle'))) stop(2, 'FOUT: positieve controle niet gezien, de meting is ongeldig');
    }

    const mis = [];
    for (const pad of ROUTES) {
      const { p, fouten } = await open(pad);
      const m = await p.evaluate(() => ({ h1: document.querySelectorAll('h1').length, tekst: document.body.innerText.length }));
      /* De tekst in de iframes van de pagina telt mee: op /afspraak staat de inhoud in de GHL-kalender (eigen tekst
         184 tekens, gemeten 13 okt). Tot 13 okt haalde /afspraak de 300 alleen dankzij de tekst van de cookiebanner;
         die verschijnt daar nu pas na een scroll (consent.ts). Een lege of kapotte kalender telt dus niet mee.
         Eerst wachten tot elke iframe tekst heeft (hoogstens 20 s): networkidle0 keert soms terug vóór de widget
         getekend is (keuring 13 okt: 3 van 35 runs 184 tekens, rood zonder fout; de widget gaat van 0 naar 797 tekens
         tussen 3,9 en 4,9 s na de start, networkidle0 viel ook op 2,3 s). Een kalender die na 20 s nog leeg is, faalt. */
      for (const el of await p.$$('iframe')) {
        const f = await el.contentFrame().catch(() => null);
        if (f) await f.waitForFunction(() => document.body && document.body.innerText.length > 0, { timeout: 20000 }).catch(() => {});
      }
      for (const f of p.frames()) {
        if (f === p.mainFrame()) continue;
        try { m.tekst += await f.evaluate(() => (document.body ? document.body.innerText.length : 0)); } catch { /* frame weg */ }
      }
      await p.close();
      if (fouten.length) mis.push(`${pad}: fout op de pagina: ${fouten.join(' | ')}`);
      if (m.h1 !== 1) mis.push(`${pad}: ${m.h1} h1, verwacht 1`);
      if (m.tekst < 300) mis.push(`${pad}: maar ${m.tekst} tekens tekst (wit scherm?)`);
    }
    if (mis.length) {
      console.error(`check-bouwrook: ${mis.length} fouten in de gebouwde site\n`);
      mis.forEach((x) => console.error('  FOUT: ' + x));
      console.error('\n  Zo ziet een bezoeker de site na een push. Repareer het vóór een push.');
      process.exitCode = 1;
    } else {
      console.log(`check-bouwrook: ${ROUTES.length} routes in de gebouwde site, positieve controle gezien`);
      console.log('  elke pagina rendert zonder fout, met precies één h1');
    }
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch((e) => stop(2, `FOUT: ${e.message} — de meting is ongeldig`));
