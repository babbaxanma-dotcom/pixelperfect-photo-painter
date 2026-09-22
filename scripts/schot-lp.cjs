/**
 * Een landingspagina fotograferen op desktop en telefoon, en de calculator
 * doorklikken tot het contactformulier. Start zelf een preview-server.
 *
 * Draaien: node scripts/schot-lp.cjs /lp/dakwerken
 */
const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4412;
const PAD = process.argv[2] || '/lp/dakwerken';
const UIT = 'C:/Users/Mohammed/AppData/Local/Temp/claude/lp-schermen';
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));
const naam = PAD.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

(async () => {
  fs.mkdirSync(UIT, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(POORT), '--strictPort'], { shell: true, stdio: 'ignore' });
  let browser;
  try {
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { op = (await fetch(`http://localhost:${POORT}/`)).ok; } catch { await wacht(500); }
    }
    if (!op) { console.error('FOUT: preview kwam niet op'); process.exit(2); }
    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

    for (const [scherm, w, h, mobiel] of [['desktop', 1440, 900, false], ['gsm', 390, 844, true]]) {
      const p = await browser.newPage();
      await p.setViewport({ width: w, height: h, isMobile: mobiel, hasTouch: mobiel });
      await p.evaluateOnNewDocument(() =>
        localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true })));
      await p.goto(`http://localhost:${POORT}${PAD}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await wacht(1500);
      await p.screenshot({ path: path.join(UIT, `${naam}-${scherm}-0.png`) });
      const meting = await p.evaluate(() => {
        const k = document.querySelector('.kgj-reken--hero .kgj-reken__keuze');
        const r = k ? k.getBoundingClientRect() : null;
        return { eersteKeuzeTop: r ? Math.round(r.top) : null, eersteKeuzeOnder: r ? Math.round(r.bottom) : null,
          vh: innerHeight, hoogte: document.body.scrollHeight, breed: document.documentElement.scrollWidth > innerWidth };
      });
      console.log(`${scherm}: eerste keuze op ${meting.eersteKeuzeTop}-${meting.eersteKeuzeOnder}px van ${meting.vh} · pagina ${meting.hoogte}px · horizontaal scrollen: ${meting.breed ? 'JA' : 'nee'}`);
      /* De calculator doorklikken: telkens de eerste keuze. */
      for (let i = 0; i < 5; i++) {
        const knop = await p.$('.kgj-reken--hero .kgj-reken__keuze');
        if (!knop) break;
        await knop.click();
        await wacht(450);
      }
      await p.screenshot({ path: path.join(UIT, `${naam}-${scherm}-form.png`) });
      if (!mobiel) {
        for (const y of [900, 1900, 2900, 3900]) {
          await p.evaluate((n) => window.scrollTo(0, n), y);
          await wacht(900);
          await p.screenshot({ path: path.join(UIT, `${naam}-${scherm}-${y}.png`) });
        }
      }
      await p.close();
    }
    console.log(`schermen in ${UIT}`);
  } finally {
    if (browser) await browser.close();
    try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ }
  }
})();
