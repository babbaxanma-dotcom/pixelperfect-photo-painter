#!/usr/bin/env node
/**
 * Belooft de sitemap alleen pagina's die bestaan?
 *
 * Aanleiding: de sitemap noemde 74 adressen waarvan er 58 niet bestonden. Alle
 * gemeentepagina's en alle blogartikelen waren vervangen door een omleiding naar
 * de homepage, maar stonden er nog in. Google kreeg zo acht en vijftig keer
 * dezelfde homepage aangeboden onder een ander adres.
 *
 * Dat gebeurde stil: er is geen foutmelding als een sitemap iets belooft dat er
 * niet is, en niemand opent hem. Deze check haalt elk adres uit de sitemap op
 * bij de echte site en kijkt waar hij uitkomt.
 *
 * Wat hier faalt:
 *   - een adres dat op een ander pad eindigt dan waar het naartoe wees;
 *   - een adres dat de 404-pagina toont;
 *   - twee adressen die dezelfde pagina tonen;
 *   - een bestaande pagina die NIET in de sitemap staat (dan mist Google hem).
 *
 * Draaien: node scripts/check-sitemap.cjs   (start zelf een preview-server)
 */
const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4383;

const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

const sitemap = fs.readFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), 'utf8');
const paden = [...sitemap.matchAll(/<loc>https:\/\/abgroep\.be([^<]*)<\/loc>/g)].map((m) => m[1] || '/');

/* Positieve controle op het lezen zelf: een sitemap die niets oplevert zou
   deze check groen laten zonder iets te meten. */
if (paden.length < 10) stop(2, `FOUT: maar ${paden.length} adressen uit de sitemap gelezen — de meting is ongeldig`);

/* De pagina's die wel bestaan maar bewust buiten de sitemap blijven. Staat er
   iets anders niet in, dan is dat een gemis en geen keuze. */
const MAG_ONTBREKEN = new Set(['/index', '/bedankt', '/lp/totaalrenovatie', '/lp/badkamerrenovatie']);

(async () => {
  const server = spawn('npx', ['vite', 'preview', '--port', String(POORT), '--strictPort'],
    { shell: true, stdio: 'ignore' });
  let browser;
  try {
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { op = (await fetch(`http://localhost:${POORT}/`)).ok; }
      catch { await new Promise((k) => setTimeout(k, 500)); }
    }
    if (!op) stop(2, 'FOUT: preview-server kwam niet op — de meting is ongeldig');

    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
    const fouten = [];
    const gezien = new Map();

    for (const pad of paden) {
      const p = await browser.newPage();
      await p.evaluateOnNewDocument(() =>
        localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true })));
      await p.goto(`http://localhost:${POORT}${pad}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await new Promise((k) => setTimeout(k, 400));
      const uit = await p.evaluate(() => ({
        pad: location.pathname,
        titel: document.title,
        h1: document.querySelector('h1')?.textContent?.trim().slice(0, 60) || '',
        vierNulVier: /404/.test(document.body.innerText.slice(0, 400)),
      }));
      await p.close();

      if (uit.vierNulVier) {
        fouten.push(`${pad}: toont de 404-pagina`);
      } else if (uit.pad !== pad) {
        fouten.push(`${pad}: komt uit op ${uit.pad} — een omleiding hoort niet in de sitemap`);
      }
      /* Twee adressen die dezelfde kop en titel tonen zijn voor een zoekmachine
         hetzelfde. */
      const vinger = uit.titel + '|' + uit.h1;
      if (gezien.has(vinger)) fouten.push(`${pad} toont hetzelfde als ${gezien.get(vinger)}`);
      else gezien.set(vinger, pad);
    }

    /* En andersom: bestaat er een pagina die niet in de sitemap staat? */
    const app = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.tsx'), 'utf8');
    const inSitemap = new Set(paden);
    for (const m of app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<\s*([A-Za-z][A-Za-z0-9_]*)/g)) {
      const [, pad, component] = m;
      if (component === 'Navigate' || pad.includes(':') || pad === '*') continue;
      if (MAG_ONTBREKEN.has(pad) || inSitemap.has(pad)) continue;
      fouten.push(`${pad} bestaat wel maar staat niet in de sitemap`);
    }

    console.log(`check-sitemap: ${paden.length} adressen opgehaald en nagelopen`);
    if (!fouten.length) {
      console.log('  elk adres bestaat, komt uit waar het belooft, en niets ontbreekt');
      process.exit(0);
    }
    console.log('');
    for (const f of fouten.slice(0, 20)) console.log(`  FOUT: ${f}`);
    if (fouten.length > 20) console.log(`  (${fouten.length} in totaal)`);
    console.log('\n  Draai node scripts/maak-sitemap.cjs om hem uit de routes opnieuw op te bouwen.');
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ }
  }
})();
