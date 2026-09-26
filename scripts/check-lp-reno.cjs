/**
 * Telefoontoets van /lp/totaalrenovatie (Mohammed, 26 sep 2026: "dezelfde stijl
 * zoals we hebben gebruikt bij de landingspagina van dakwerken").
 *
 * Draait op een preview (npx vite preview --port 8140) en verstuurt nooit een
 * lead: het formulier wordt alleen geopend, niet verzonden.
 *
 * Draaien: node scripts/check-lp-reno.cjs
 */
const puppeteer = require('puppeteer-core');

const URL = process.env.LP_URL || 'http://127.0.0.1:8140/lp/totaalrenovatie';
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));
const uitslag = [];
const meld = (ok, wat, detail = '') => uitslag.push(`${ok ? 'AF     ' : 'NIET AF'}  ${wat}${detail ? '  (' + detail + ')' : ''}`);

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const page = await browser.newPage();
  const fouten = [];
  page.on('pageerror', (e) => fouten.push(String(e.message).slice(0, 120)));
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false })));
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await wacht(700);

  const kop = await page.evaluate(() => ({ titel: document.title, h1: document.querySelector('h1')?.textContent.trim() }));
  meld(kop.titel === 'Dé specialist voor uw renovatie | AB Bouw Groep', 'tabbladtitel', kop.titel);
  meld(kop.h1 === 'Dé specialist voor uw renovatie', 'kop', kop.h1);

  /* Zoals op dakwerken: alle antwoorden van vraag 1 boven de vouw. */
  const vouw = await page.evaluate(() => { const k = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')]; return Math.round(Math.max(...k.map((e) => e.getBoundingClientRect().bottom))); });
  meld(vouw <= 844, 'alle antwoorden van vraag 1 boven de vouw', `laatste eindigt op ${vouw} van 844`);

  const vraag = () => page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim());
  const tel = () => page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__tel')?.textContent.trim());
  const keuzes = () => page.evaluate(() => [...document.querySelectorAll('#rekenaar .kgj-reken__keuze strong')].map((b) => b.textContent.trim()));
  const tik = async (label) => {
    const r = await page.evaluate((l) => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith(l)); if (!b) return null; b.scrollIntoView({ block: 'center', behavior: 'instant' }); return true; }, label);
    if (!r) return false;
    /* De pagina scrolt vloeiend (scroll-behavior: smooth); meet pas na de sprong. */
    await wacht(120);
    const p = await page.evaluate((l) => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith(l)); const x = b.getBoundingClientRect(); return { x: x.left + x.width / 2, y: x.top + x.height / 2 }; }, label);
    await page.touchscreen.tap(p.x, p.y); await wacht(250); return true;
  };

  /* De hele calculator door, met de verwachte vraag op elke stap. */
  const pad = [
    ['Wat voor woning is het?', 'Rijwoning', 'Vraag 1 van 6'],
    ['Wat wilt u renoveren?', 'De hele woning', 'Vraag 2 van 6'],
    ['Hoe groot is de woning?', '100 tot 150 m²', 'Vraag 3 van 6'],
    ['Hoe oud is de woning?', 'Ouder dan 10 jaar', 'Vraag 4 van 6'],
    ['Hoeveel moet er vernieuwd worden?', 'Alles', 'Vraag 5 van 6'],
    ['Wanneer wilt u beginnen?', 'Binnen drie maanden', 'Vraag 6 van 6'],
  ];
  let tip = '';
  for (const [v, antwoord, teller] of pad) {
    const nu = await vraag(); const t = await tel();
    meld(nu === v && t === teller, `vraag: ${v}`, `${nu} / ${t}`);
    if (v === 'Hoeveel moet er vernieuwd worden?') tip = await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__tip')?.textContent.trim() || '');
    if (v === 'Wat voor woning is het?') meld((await keuzes()).join('|') === 'Appartement|Rijwoning|Halfopen woning|Open bebouwing', 'vier soorten woning', (await keuzes()).join(', '));
    meld(await tik(antwoord), `tik op "${antwoord}"`);
  }
  meld(tip.includes('6% btw'), 'btw-melding na een woning ouder dan 10 jaar', tip);
  const form = await page.evaluate(() => ({ kop: document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim(), knop: document.querySelector('#rekenaar .kgj-reken__knop')?.textContent.trim(), telVerplicht: document.querySelector('#rekenaar input[name=telefoon]')?.getAttribute('aria-required') }));
  meld(form.kop === 'Op welk nummer bereiken we u?' && form.knop === 'Bereken prijs', 'formulier na de laatste vraag', `${form.kop} / ${form.knop}`);
  meld(form.telVerplicht === 'true', 'alleen telefoon verplicht');

  /* Tikfeedback: tijdens het drukken kleurt het antwoord op. */
  await page.evaluate(() => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__terug')][0]; });
  await page.goto(URL, { waitUntil: 'networkidle0' }); await wacht(500);
  const r = await page.evaluate(() => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith('Appartement')); b.scrollIntoView({ block: 'center' }); const x = b.getBoundingClientRect(); return { x: x.left + x.width / 2, y: x.top + x.height / 2, rust: getComputedStyle(b).borderColor }; });
  await page.touchscreen.touchStart(r.x, r.y); await wacht(60);
  const druk = await page.evaluate(() => getComputedStyle([...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith('Appartement'))).borderColor);
  await page.touchscreen.touchEnd(); await wacht(150);
  meld(druk !== r.rust, 'tijdens het drukken kleurt het antwoord op', `rust ${r.rust} / druk ${druk}`);
  meld((await vraag()) === 'Wat wilt u renoveren?', 'na het loslaten meteen de volgende vraag', await vraag());

  /* Pagina als geheel. */
  const pg = await page.evaluate(() => ({
    breed: document.documentElement.scrollWidth,
    reviews: !!document.querySelector('#reviews'),
    diensten: [...document.querySelectorAll('#diensten .kgj-dienst h3')].map((h) => h.textContent.trim()),
    voor: document.querySelector('.kgj-schuif__voor img')?.getAttribute('src') || '',
    na: document.querySelector('.kgj-schuif__na img')?.getAttribute('src') || '',
    stukFoto: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.src).slice(0, 3),
    slot: document.querySelector('#contact h2')?.textContent.trim(),
  }));
  meld(pg.breed <= 390, 'geen horizontaal scrollen', `paginabreedte ${pg.breed}`);
  meld(!pg.reviews, "geen sectie 'wat klanten schrijven'");
  meld(pg.diensten.length === 4, 'vier diensten', pg.diensten.join(' | '));
  /* De build geeft de foto's een hashnaam; vergelijk dus de inhoud (md5) met
     de bronbestanden van de uitbouw. */
  const md5 = (buf) => require('crypto').createHash('md5').update(buf).digest('hex');
  const bron = (f) => md5(require('fs').readFileSync(require('path').join(__dirname, '..', 'src/assets/lp-diensten', f)));
  const haal = async (src) => md5(Buffer.from(await (await fetch(new globalThis.URL(src, URL))).arrayBuffer()));
  const voorOk = (await haal(pg.voor)) === bron('uitbreiding-voor.jpg');
  const naOk = (await haal(pg.na)) === bron('uitbreiding-na.jpg');
  meld(voorOk && naOk, 'voor/na = de uitbouw van de homepage (md5)', `voor ${voorOk} / na ${naOk}`);
  meld(pg.stukFoto.length === 0, 'geen kapotte foto', pg.stukFoto.join(' '));
  meld(pg.slot === 'Gratis plaatsbezoek', 'slotblok', pg.slot);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45)); await wacht(700);
  const balk = await page.evaluate(() => { const b = document.querySelector('.kgj-actiebalk'); return { aan: b?.classList.contains('is-aan'), tekst: b?.querySelector('button')?.textContent.trim() }; });
  meld(balk.aan && balk.tekst === 'Gratis plaatsbezoek', 'vaste balk: Gratis plaatsbezoek', JSON.stringify(balk));
  meld(fouten.length === 0, 'geen fouten in de console', fouten.join(' | '));

  await browser.close();
  console.log(uitslag.join('\n'));
  const af = uitslag.filter((u) => u.startsWith('AF')).length;
  console.log(`\n${af} van ${uitslag.length} AF`);
  process.exit(af === uitslag.length ? 0 : 1);
})();
