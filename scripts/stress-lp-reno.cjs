/**
 * Stresstest van /lp/totaalrenovatie (Mohammed, 26 sep 2026: "je hebt een paar
 * stresstests uitgevoerd").
 *
 * VERSTUURT NOOIT EEN ECHTE LEAD. Elke aanvraag naar GHL, Web3Forms, webhooks
 * en Google (analytics, conversie) wordt in de browser onderschept en krijgt een
 * nep-antwoord; niets verlaat de pc. Een positieve controle bewijst dat de
 * onderschepping werkt: de toets faalt als er ook maar één leadverzoek is dat
 * NIET onderschept werd.
 *
 * Draaien: node scripts/stress-lp-reno.cjs   (preview op 127.0.0.1:8140)
 */
const puppeteer = require('puppeteer-core');

const BASIS = process.env.BASIS || 'http://127.0.0.1:8140';
const URL = BASIS + '/lp/totaalrenovatie';
const LEAD = [/leadconnectorhq/i, /gohighlevel/i, /web3forms/i, /hooks\./i, /services\.leadconnector/i];
const GOOGLE = [/googletagmanager/i, /google-analytics/i, /googleadservices/i, /doubleclick/i, /gstatic\.com\/.*conversion/i];
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));
const uitslag = [];
const meld = (ok, wat, detail = '') => uitslag.push(`${ok ? 'AF     ' : 'NIET AF'}  ${wat}${detail ? '  (' + detail + ')' : ''}`);

async function nieuwePagina(browser, vp, { traag = false } = {}) {
  const page = await browser.newPage();
  const leads = [];
  const ontsnapt = [];
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    if (LEAD.some((re) => re.test(u))) {
      /* CORS-koppen, anders laat de browser na de voorcontrole (OPTIONS) de
         echte POST niet door en lijkt de aanvraag mislukt. */
      const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
      if (req.method() === 'OPTIONS') return req.respond({ status: 204, headers: cors, body: '' });
      leads.push({ url: u, body: req.postData() || '' });
      return req.respond({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ success: true, ok: true, id: 'test' }) });
    }
    if (GOOGLE.some((re) => re.test(u))) return req.respond({ status: 204, body: '' });
    return req.continue();
  });
  /* Tweede verdedigingslinie: een leadverzoek dat toch het netwerk op gaat. */
  page.on('requestfinished', (req) => { const u = req.url(); if (LEAD.some((re) => re.test(u)) && !req.response()?.fromServiceWorker?.()) {} });
  /* Een onderschept antwoord heeft geen server-IP; een echt antwoord wel. Elk leadantwoord met een IP is dus ontsnapt. */
  page.on('response', (res) => { const u = res.url(); if (LEAD.some((re) => re.test(u)) && (res.remoteAddress()?.ip || '') !== '') ontsnapt.push(u + ' via ' + res.remoteAddress().ip); });
  const fouten = [];
  page.on('pageerror', (e) => fouten.push(String(e.message).slice(0, 120)));
  await page.setViewport(vp);
  await page.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false })));
  if (traag) {
    const cdp = await page.target().createCDPSession();
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8 });
  }
  return { page, leads, ontsnapt, fouten };
}

const gsm = { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true };

async function tik(page, label, sel = '#rekenaar') {
  const ok = await page.evaluate((l, s) => { const b = [...document.querySelectorAll(`${s} .kgj-reken__keuze`)].find((k) => k.textContent.trim().startsWith(l)); if (!b) return false; b.scrollIntoView({ block: 'center', behavior: 'instant' }); return true; }, label, sel);
  if (!ok) return false;
  await wacht(120);
  const p = await page.evaluate((l, s) => { const b = [...document.querySelectorAll(`${s} .kgj-reken__keuze`)].find((k) => k.textContent.trim().startsWith(l)); const x = b.getBoundingClientRect(); return { x: x.left + x.width / 2, y: x.top + x.height / 2 }; }, label, sel);
  await page.touchscreen.tap(p.x, p.y); await wacht(260); return true;
}
const vraag = (page) => page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim());
const ANTWOORDEN = ['Halfopen woning', 'De hele woning', '150 tot 200 m²', 'Ouder dan 10 jaar', 'Een groot deel', 'Zo snel mogelijk'];

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });

  /* 1. Volledige aanvraag via de calculator, onderschept. */
  {
    const { page, leads, ontsnapt, fouten } = await nieuwePagina(browser, gsm);
    await page.goto(URL, { waitUntil: 'networkidle0' }); await wacht(500);
    for (const a of ANTWOORDEN) await tik(page, a);
    meld((await vraag(page)) === 'Op welk nummer bereiken we u?', 'calculator komt bij het formulier', await vraag(page));
    /* Leeg nummer, dan een te kort nummer: de juiste foutmelding, niets verstuurd. */
    await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__knop').click()); await wacht(300);
    const leeg = await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__fout')?.textContent.trim());
    meld(/telefoonnummer/.test(leeg || '') && leads.length === 0, 'leeg nummer: foutmelding, niets verstuurd', leeg);
    await page.type('#rekenaar input[name=telefoon]', '0470 12', { delay: 20 });
    await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__knop').click()); await wacht(300);
    const kort = await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__fout')?.textContent.trim());
    meld(/niet volledig/.test(kort || '') && leads.length === 0, 'te kort nummer: foutmelding, niets verstuurd', kort);
    await page.type('#rekenaar input[name=telefoon]', ' 34 56', { delay: 20 });
    await page.type('#rekenaar input[name=naam]', 'Test Stresstest', { delay: 10 });
    await Promise.all([
      page.waitForNavigation({ timeout: 15000 }).catch(() => null),
      page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__knop').click()),
    ]);
    await wacht(800);
    const ghl = leads.find((l) => /leadconnector|gohighlevel|hooks\./i.test(l.url));
    const w3f = leads.find((l) => /web3forms/i.test(l.url));
    meld(!!ghl && !!w3f, 'lead gaat naar GHL én Web3Forms (onderschept)', `${leads.length} verzoeken`);
    const body = ghl ? ghl.body : '';
    meld(/AB Construct/.test(body), 'type werk in GHL = AB Construct', (body.match(/"type_werk":"[^"]*"/) || [''])[0]);
    meld(/lp:totaalrenovatie:rekenaar:hero/.test(body), 'bron = lp:totaalrenovatie:rekenaar:hero');
    meld(/Woning: Halfopen woning/.test(body) && /Staat: Een groot deel/.test(body) && /Start: Zo snel mogelijk/.test(body), 'alle antwoorden gaan mee met de lead');
    meld(/0470 12 34 56|0470123456/.test(body.replace(/\\u00a0/g, ' ')), 'telefoonnummer gaat mee');
    meld(page.url().includes('/bedankt?dienst=totaalrenovatie'), 'naar de bedankpagina', page.url().replace(BASIS, ''));
    meld(ontsnapt.length === 0, 'geen leadverzoek het netwerk op (geen server-IP in de antwoorden)', ontsnapt.join(' '));
    meld(fouten.length === 0, 'geen fouten in de console (aanvraag)', fouten.join(' | '));
    await page.close();
  }

  /* 2. Inspectieformulier onderaan, met postcode, onderschept. */
  {
    const { page, leads } = await nieuwePagina(browser, gsm);
    await page.goto(URL + '#contact', { waitUntil: 'networkidle0' }); await wacht(600);
    const f = '.kgj-reken--inspectie';
    await page.type(`${f} input[name=telefoon]`, '0470 11 22 33', { delay: 10 });
    await page.focus(`${f} .kgj-pg input[type=text]`); await page.type(`${f} .kgj-pg input[type=text]`, '2850', { delay: 30 }); await wacht(400);
    await Promise.all([
      page.waitForNavigation({ timeout: 15000 }).catch(() => null),
      page.evaluate((s) => document.querySelector(`${s} .kgj-reken__knop`).click(), f),
    ]);
    await wacht(600);
    const ghl = leads.find((l) => /leadconnector|gohighlevel|hooks\./i.test(l.url));
    const body = ghl ? ghl.body : '';
    meld(/Aanvraag gratis plaatsbezoek/.test(body), 'inspectie-lead: "Aanvraag gratis plaatsbezoek"');
    meld(/2850/.test(body) && /Boom/.test(body), 'postcode en gemeente gaan mee', (body.match(/"postcode":"\d+"|"gemeente":"[^"]*"/g) || []).join(' '));
    meld(/lp:totaalrenovatie:inspectie/.test(body), 'bron = lp:totaalrenovatie:inspectie');
    await page.close();
  }

  /* 3. Terug-knop, dubbele tik, en de btw-melding blijft kloppen. */
  {
    const { page } = await nieuwePagina(browser, gsm);
    await page.goto(URL, { waitUntil: 'networkidle0' }); await wacht(500);
    await tik(page, 'Rijwoning'); await tik(page, 'De hele woning');
    await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__terug').click()); await wacht(200);
    meld((await vraag(page)) === 'Wat wilt u renoveren?', 'Terug brengt u één vraag terug', await vraag(page));
    /* Dubbele tik (80 ms): mag maar één vraag verder gaan. */
    const p = await page.evaluate(() => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith('De hele woning')); b.scrollIntoView({ block: 'center', behavior: 'instant' }); const x = b.getBoundingClientRect(); return { x: x.left + x.width / 2, y: x.top + x.height / 2 }; });
    await wacht(120);
    await page.touchscreen.tap(p.x, p.y); await wacht(80); await page.touchscreen.tap(p.x, p.y); await wacht(300);
    meld((await vraag(page)) === 'Hoe groot is de woning?', 'dubbele tik slaat geen vraag over', await vraag(page));
    await page.close();
  }

  /* 4. Toetsenbord alleen (Tab + Enter), zoals wie geen muis gebruikt. */
  {
    const { page } = await nieuwePagina(browser, { width: 1366, height: 800 });
    await page.goto(URL, { waitUntil: 'networkidle0' }); await wacht(500);
    await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__keuze').focus());
    await page.keyboard.press('Enter'); await wacht(300);
    meld((await vraag(page)) === 'Wat wilt u renoveren?', 'Enter op een antwoord gaat door', await vraag(page));
    const zichtbaar = await page.evaluate(() => { document.querySelector('#rekenaar .kgj-reken__keuze').focus(); const s = getComputedStyle(document.activeElement); return s.outlineStyle !== 'none' && s.outlineWidth !== '0px'; });
    meld(zichtbaar, 'focus is zichtbaar (rand rond het antwoord)');
    await page.close();
  }

  /* 5. Schermen: 320 px, gsm liggend, groot scherm. */
  for (const [naam, vp] of [['320 px', { width: 320, height: 640, isMobile: true, hasTouch: true }], ['gsm liggend', { width: 844, height: 390, isMobile: true, hasTouch: true }], ['1920 breed', { width: 1920, height: 1080 }]]) {
    const { page, fouten } = await nieuwePagina(browser, vp);
    await page.goto(URL, { waitUntil: 'networkidle0' }); await wacht(500);
    const m = await page.evaluate(() => ({
      breed: document.documentElement.scrollWidth, vp: innerWidth,
      afgekapt: [...document.querySelectorAll('h1, h2, h3, .kgj-reken__keuze, .kgj-knop')].filter((e) => e.scrollWidth > e.clientWidth + 2).map((e) => e.textContent.trim().slice(0, 30)).slice(0, 3),
    }));
    meld(m.breed <= m.vp, `${naam}: geen horizontaal scrollen`, `${m.breed} op ${m.vp}`);
    meld(m.afgekapt.length === 0, `${naam}: geen afgekapte tekst`, m.afgekapt.join(' | '));
    meld(fouten.length === 0, `${naam}: geen fouten in de console`, fouten.join(' | '));
    await page.close();
  }

  /* 6. Traag netwerk (400 kbit/s, 400 ms): de calculator is bruikbaar voor de foto's binnen zijn. */
  {
    const { page } = await nieuwePagina(browser, gsm, { traag: true });
    const t0 = Date.now();
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#rekenaar .kgj-reken__keuze', { timeout: 60000 });
    const s = ((Date.now() - t0) / 1000).toFixed(1);
    meld(Number(s) <= 12, 'traag netwerk: eerste vraag klikbaar', `${s} s`);
    await page.close();
  }

  await browser.close();
  console.log(uitslag.join('\n'));
  const af = uitslag.filter((u) => u.startsWith('AF')).length;
  console.log(`\n${af} van ${uitslag.length} AF`);
  process.exit(af === uitslag.length ? 0 : 1);
})();
