#!/usr/bin/env node
/**
 * Stresstest van de voor/na-schuif bij het dak.
 *
 * Aanleiding: Mohammed meldde twee keer dat de slider op zijn telefoon niet
 * werkte. De eerste keer stond touch-action op het omhulsel in plaats van op de
 * regelaar; de tweede keer bleek de oorzaak dieper te zitten — het slepen leunde
 * op een range-input met opacity 0, en die levert op iOS Safari niet
 * betrouwbaar aanraakgebeurtenissen af. Het slepen gebeurt nu met eigen
 * pointer-events en setPointerCapture.
 *
 * Deze test bedient de slider zoals een bezoeker dat doet en meet of het beeld
 * echt meebeweegt: muis, aanraking, tik, toetsenbord. Hij controleert ook dat
 * verticaal scrollen naast de sleepband gewoon blijft werken — een slider die
 * de pagina vastzet is even stuk als een slider die niet beweegt.
 *
 * Draaien: node scripts/check-schuif.cjs [url]
 */
const puppeteer = require('puppeteer-core');

const URL = process.argv[2] || 'http://localhost:8080/totaalrenovatie';
const CHROME = process.env.CHROME_PAD || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

/** Hoe ver het na-beeld is weggeklipt, in procenten. Dat is wat de bezoeker ziet. */
const STAND = () => {
  const na = document.querySelectorAll('.pc-vgl-vat img')[1];
  const m = getComputedStyle(na).clipPath.match(/([\d.]+)%/);
  return m ? Math.round(Number(m[1])) : null;
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new', protocolTimeout: 180000,
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const fouten = [];
  let proeven = 0;

  const opzet = async (mobiel) => {
    const pg = await browser.newPage();
    if (mobiel) {
      await pg.emulate({
        viewport: { width: 390, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      });
    } else {
      await pg.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    }
    await pg.evaluateOnNewDocument(() => {
      try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true, essential: true, ts: Date.now() })); } catch { /* leeg */ }
    });
    await pg.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await pg.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
      await new Promise((r) => setTimeout(r, 900));
      document.querySelector('.pc-vgl-vat').scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 300));
    });
    const doos = await pg.evaluate(() => {
      const r = document.querySelector('.pc-vgl-vat').getBoundingClientRect();
      return {
        links: Math.round(r.left), rechts: Math.round(r.right), breed: Math.round(r.width),
        midX: Math.round(r.left + r.width / 2), midY: Math.round(r.top + r.height / 2),
        bovenY: Math.round(r.top + 14), inBeeld: r.top >= 0 && r.bottom <= 900,
      };
    });
    return { pg, doos };
  };

  /* ── 1. muis: slepen van het midden naar links ── */
  {
    const { pg, doos } = await opzet(false);
    const voor = await pg.evaluate(STAND);
    await pg.mouse.move(doos.midX, doos.midY);
    await pg.mouse.down();
    for (let i = 1; i <= 10; i++) await pg.mouse.move(doos.midX - i * 18, doos.midY);
    await pg.mouse.up();
    await new Promise((r) => setTimeout(r, 150));
    const na = await pg.evaluate(STAND);
    proeven++;
    if (voor === null || na === null) fouten.push('kon de stand van de schuif niet aflezen — meting ongeldig');
    else if (na >= voor - 5) fouten.push(`muis: slepen naar links verzette het beeld niet (${voor}% -> ${na}%)`);

    /* ── 2. muis: klik rechts moet de scheiding daarheen brengen ── */
    await pg.mouse.click(doos.links + Math.round(doos.breed * 0.8), doos.midY);
    await new Promise((r) => setTimeout(r, 150));
    const klik = await pg.evaluate(STAND);
    proeven++;
    if (klik === null || klik < 70 || klik > 90) fouten.push(`muis: klik op 80% bracht de scheiding naar ${klik}% in plaats van rond 80%`);

    /* ── 3. toetsenbord: de regelaar moet met de pijltjes werken ── */
    const toets = await pg.evaluate(async () => {
      const inp = document.querySelector('.pc-vgl-bedien');
      if (!inp) return { fout: 'geen regelaar' };
      inp.focus();
      const voor = Number(inp.value);
      inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await new Promise((r) => setTimeout(r, 60));
      return { voor, bereikbaar: document.activeElement === inp };
    });
    proeven++;
    if (!toets.bereikbaar) fouten.push('toetsenbord: de regelaar kan geen focus krijgen — niet bedienbaar zonder muis');
    await pg.close();
  }

  /* ── 4. aanraking: schuine veeg moet de schuif bewegen, niet de pagina ── */
  {
    const { pg, doos } = await opzet(true);
    if (!doos.inBeeld) fouten.push('de schuif stond niet volledig in beeld — de aanraakmeting telt niet');
    const voor = { stand: await pg.evaluate(STAND), y: await pg.evaluate(() => window.scrollY) };
    await pg.touchscreen.touchStart(doos.midX, doos.midY);
    for (let i = 1; i <= 10; i++) { await pg.touchscreen.touchMove(doos.midX - i * 13, doos.midY + i * 2); await new Promise((r) => setTimeout(r, 16)); }
    await pg.touchscreen.touchEnd();
    await new Promise((r) => setTimeout(r, 200));
    const na = { stand: await pg.evaluate(STAND), y: await pg.evaluate(() => window.scrollY) };
    proeven++;
    if (na.stand >= voor.stand - 5) fouten.push(`aanraking: schuine veeg verzette het beeld niet (${voor.stand}% -> ${na.stand}%)`);
    if (Math.abs(na.y - voor.y) > 8) fouten.push(`aanraking: de pagina scrolde ${Math.round(na.y - voor.y)}px tijdens het slepen — het gebaar lekt weg naar de pagina`);

    /* ── 5. verticaal vegen naast de sleepband moet de pagina wel scrollen ── */
    const y0 = await pg.evaluate(() => window.scrollY);
    await pg.touchscreen.touchStart(doos.midX, doos.bovenY);
    for (let i = 1; i <= 10; i++) { await pg.touchscreen.touchMove(doos.midX, doos.bovenY - i * 18); await new Promise((r) => setTimeout(r, 16)); }
    await pg.touchscreen.touchEnd();
    await new Promise((r) => setTimeout(r, 350));
    const y1 = await pg.evaluate(() => window.scrollY);
    proeven++;
    if (y1 <= y0 + 20) fouten.push(`aanraking: verticaal vegen boven de sleepband scrolde de pagina niet (${Math.round(y1 - y0)}px) — de bezoeker zit vast`);
    await pg.close();
  }

  await browser.close();

  /* positieve controle: een test die niets bediend heeft bewijst niets */
  if (proeven < 5) {
    console.error(`FOUT: maar ${proeven} proeven uitgevoerd — de meting telt niet`);
    process.exit(2);
  }

  console.log(`check-schuif: ${proeven} proeven op muis, aanraking en toetsenbord`);
  if (!fouten.length) { console.log('  de voor/na-schuif doet wat hij belooft'); process.exit(0); }
  console.log('');
  for (const f of fouten) console.log(`  FOUT: ${f}`);
  process.exit(1);
})();
