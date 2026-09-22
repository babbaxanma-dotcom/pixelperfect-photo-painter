/**
 * De campagne-landingspagina van Recotex: campagnes-recotex.be.
 *
 * Hun advertenties gaan niet naar recotex.be maar naar een apart domein dat
 * alleen voor advertenties bestaat. Dat is de pagina die hun geld moet
 * terugverdienen, dus de relevantste om na te bouwen. Per pagina: desktop en
 * telefoon boven de vouw, de hele pagina, en elke stap van de calculator tot
 * aan het contactformulier (klikken op de eerste keuze van elke stap).
 *
 * Draaien: node ads/onderzoek-top5/campagne-lp.cjs [url...]
 */
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const MAP = path.join(__dirname, 'schermen');
const URLS = process.argv.slice(2).length ? process.argv.slice(2) : ['https://www.campagnes-recotex.be/'];
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));

async function cookies(p) {
  await p.evaluate(() => {
    const k = [...document.querySelectorAll('button, a')];
    const b = k.find((x) => /weiger|alleen noodzakelijk|enkel noodzakelijk|reject|decline/i.test(x.innerText || ''))
      || k.find((x) => /accepteer|akkoord|alles toestaan|accept all|aanvaard/i.test(x.innerText || ''));
    if (b) b.click();
    /* Pop-ups met een kruisje sluiten. */
    for (const x of document.querySelectorAll('[aria-label*="lose" i], [aria-label*="sluit" i], .close, .modal-close')) {
      if (x.getBoundingClientRect().width > 0) x.click();
    }
  }).catch(() => {});
  await wacht(900);
}

const naamVan = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '');

(async () => {
  fs.mkdirSync(MAP, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const uit = [];
  try {
    for (const url of URLS) {
      const n = naamVan(url);
      const r = { url };
      const p = await browser.newPage();
      try {
        await p.setViewport({ width: 1440, height: 900 });
        await p.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        await wacht(2200); await cookies(p);
        await p.screenshot({ path: path.join(MAP, `${n}-desktop.png`) });
        await p.screenshot({ path: path.join(MAP, `${n}-heel.png`), fullPage: true });
        r.pagina = await p.evaluate(() => {
          const s = (t) => (t || '').replace(/\s+/g, ' ').trim();
          return {
            titel: document.title,
            koppen: [...document.querySelectorAll('h1, h2, h3')].map((h) => s(h.innerText)).filter(Boolean).slice(0, 24),
            knoppen: [...new Set([...document.querySelectorAll('a, button')].map((b) => s(b.innerText)).filter((t) => t && t.length < 50))].slice(0, 30),
            links: [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith('http')))].slice(0, 40),
            velden: [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].map((v) => ({
              soort: v.type || v.tagName, naam: v.name || v.id, label: s((v.labels && v.labels[0] && v.labels[0].innerText) || v.placeholder || ''),
              boven: v.getBoundingClientRect().top < window.innerHeight,
            })),
            hoogte: document.body.scrollHeight,
          };
        });

        await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
        await p.reload({ waitUntil: 'networkidle2', timeout: 45000 });
        await wacht(1800); await cookies(p);
        await p.screenshot({ path: path.join(MAP, `${n}-mobiel.png`) });
      } catch (e) { r.fout = String(e.message).slice(0, 80); }
      await p.close();
      uit.push(r);
      console.log(`${n}: ${r.fout || (r.pagina.koppen[0] || '') + ' · ' + r.pagina.velden.length + ' velden, ' + r.pagina.velden.filter((v) => v.boven).length + ' boven de vouw'}`);
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(__dirname, 'campagne-lp.json'), JSON.stringify(uit, null, 1));
})();
