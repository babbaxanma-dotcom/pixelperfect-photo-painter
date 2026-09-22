/**
 * Hoe zijn de landingspagina's van de vijf grootste spelers opgebouwd, en hoe
 * werkt hun prijscalculator?
 *
 * Per speler: schermafdruk boven de vouw op desktop en telefoon, de koppen in
 * volgorde (de sectie-indeling), de knoppen, of er een formulier of calculator
 * boven de vouw staat, en de link naar hun calculator. Die calculatorpagina
 * wordt ook geopend en gefotografeerd, want daar zit het doel van de pagina.
 *
 * Draaien: node ads/onderzoek-top5/lps.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const MAP = path.join(__dirname, 'schermen');
const SITES = [
  { naam: 'kijzer', url: 'https://www.kijzer.be/' },
  { naam: 'dural', url: 'https://www.dural-bouwgroep.be/' },
  { naam: 'recotex', url: 'https://www.recotex.be/' },
  { naam: 'rinovato', url: 'https://www.rinovato.be/' },
  { naam: 'verelst', url: 'https://www.verelst.be/' },
];
const CALC = /bereken|simuleer|simulatie|calculator|prijs ?(berekenen|indicatie|simul)|kostprijs|wat kost|offerte in \d/i;
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));

/* Cookiebanners wegklikken: de eerste knop die weigert of alleen noodzakelijke
   toestaat, anders accepteren — anders staat de banner op elke schermafdruk. */
async function cookies(p) {
  await p.evaluate(() => {
    const knoppen = [...document.querySelectorAll('button, a')];
    const kies = knoppen.find((b) => /weiger|alleen noodzakelijk|enkel noodzakelijk|reject|decline/i.test(b.innerText || ''))
      || knoppen.find((b) => /accepteer|akkoord|alles toestaan|accept all|aanvaard/i.test(b.innerText || ''));
    if (kies) kies.click();
  }).catch(() => {});
  await wacht(900);
}

async function lees(p) {
  return p.evaluate((calcBron) => {
    const CALC = new RegExp(calcBron, 'i');
    const s = (t) => (t || '').replace(/\s+/g, ' ').trim();
    const koppen = [...document.querySelectorAll('h1, h2')].map((h) => s(h.innerText)).filter(Boolean).slice(0, 16);
    const knoppen = [...new Set([...document.querySelectorAll('a, button')].map((b) => s(b.innerText))
      .filter((t) => t && t.length < 50 && /vraag|bereken|simul|plan|offerte|afspraak|bel |gesprek|start|gratis|ontvang|prijs/i.test(t)))].slice(0, 14);
    const vouw = [];
    for (const el of document.querySelectorAll('h1, h2, h3, p, a, button, label, span')) {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight || r.height < 6) continue;
      const t = s(el.innerText);
      if (t && t.length > 2 && t.length < 140 && !vouw.includes(t)) vouw.push(t);
    }
    const velden = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')];
    const veldBoven = velden.filter((v) => { const r = v.getBoundingClientRect(); return r.top >= 0 && r.top < window.innerHeight && r.height > 6; }).length;
    const calc = [...document.querySelectorAll('a[href]')]
      .filter((a) => CALC.test(s(a.innerText)) || /bereken|simul|calculator|prijs/i.test(a.getAttribute('href')))
      .map((a) => ({ t: s(a.innerText).slice(0, 60), href: a.href }))
      .filter((a) => a.href.startsWith('http'));
    return { titel: document.title.slice(0, 100), koppen, knoppen, bovenDeVouw: vouw.slice(0, 18),
      veldenBovenVouw: veldBoven, velden: velden.length, calculatorLinks: calc.slice(0, 6),
      hoogte: document.body.scrollHeight };
  }, CALC.source);
}

(async () => {
  fs.mkdirSync(MAP, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const uit = [];
  try {
    for (const site of SITES) {
      const r = { naam: site.naam, url: site.url };
      try {
        const p = await browser.newPage();
        await p.setViewport({ width: 1440, height: 900 });
        await p.goto(site.url, { waitUntil: 'networkidle2', timeout: 45000 });
        await wacht(2000); await cookies(p);
        await p.screenshot({ path: path.join(MAP, `${site.naam}-desktop.png`) });
        Object.assign(r, await lees(p));

        await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
        await p.reload({ waitUntil: 'networkidle2', timeout: 45000 });
        await wacht(1800); await cookies(p);
        await p.screenshot({ path: path.join(MAP, `${site.naam}-mobiel.png`) });
        r.mobielBovenDeVouw = (await lees(p)).bovenDeVouw.slice(0, 10);

        /* De calculator zelf: eerste link die ernaar wijst. */
        const doel = (r.calculatorLinks || []).find((l) => !/#$/.test(l.href));
        if (doel) {
          await p.setViewport({ width: 1440, height: 900 });
          await p.goto(doel.href, { waitUntil: 'networkidle2', timeout: 45000 });
          await wacht(2200); await cookies(p);
          await p.screenshot({ path: path.join(MAP, `${site.naam}-calculator.png`) });
          r.calculator = { url: doel.href, ...(await lees(p)) };
        }
        await p.close();
      } catch (e) { r.fout = String(e.message).slice(0, 80); }
      uit.push(r);
      console.log(`${site.naam.padEnd(10)} ${r.fout ? 'FOUT ' + r.fout : (r.koppen[0] || '(geen h1)').slice(0, 60)} · calculator: ${r.calculator ? r.calculator.url : 'geen link gevonden'}`);
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(__dirname, 'lps.json'), JSON.stringify(uit, null, 1));
  console.log(`\nschermen in ${MAP}`);
})();
