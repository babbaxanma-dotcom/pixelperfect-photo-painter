#!/usr/bin/env node
/**
 * check-lp-veeg: vegen is geen tik op de antwoordtegels van de aanvraagkaart (Aanvraag.tsx, kies()).
 *
 * Aanleiding (16 nov 2026, opdracht Mohammed, staal): wie op de gsm over de kaart veegt om te scrollen, koos soms ongewild een
 * antwoord en stond een vraag verder. Regel in Aanvraag.tsx: een aanraking die meer dan 10 px bewoog is een veeg (het einde wordt
 * onthouden); een tik op een antwoordtegel telt niet als de aanraking zelf meer dan 4 px bewoog of minder dan 600 ms na het einde
 * van een veeg begon. Muis en toetsenbord tellen altijd. Een scroll van de pagina zelf (stapwissel) houdt de volgende tik niet tegen.
 *
 * Gemeten met echte aanrakingen (CDP Input.dispatchTouchEvent via puppeteer touchscreen), /lp/dakwerken op 390x664, kaart bovenaan:
 *   1. gewone tik op een antwoord                         -> volgende vraag
 *   2. tik die 7 px beweegt                               -> blijft op de vraag
 *   3. veeg, 300 ms later een tik                         -> blijft op de vraag
 *   4. veeg, 800 ms later een tik                         -> volgende vraag
 *   5. veeg, meteen daarna een muisklik                   -> volgende vraag
 *   6. scroll door de pagina zelf (scrollBy), meteen tik  -> volgende vraag
 *   7. veeg, meteen daarna knop.click() (zo voert LpBf de vroege tik van vóór het hydrateren uit) -> volgende vraag
 * De tijd tussen het einde van de veeg en het begin van de tik wordt in de pagina zelf gemeten; valt ze buiten het bedoelde venster
 * (trage pc), dan wordt het geval herhaald, en na 4 pogingen is de meting ongeldig.
 *
 * Positieve controles (zonder: exit 2): met de regel uit (testhaak window.__abVeegUit, zoals __abVolUit) moet geval 2 en geval 3 WEL
 * een antwoord kiezen. Dat bewijst dat de browser in die gevallen echt een klik geeft en dat deze toets een weggevallen regel vangt.
 * Niets gaat naar buiten: Clarity, Google-tags, GHL, Web3Forms en /api/ worden afgebroken; er wordt nooit verstuurd.
 *
 * Draaien:  node scripts/check-lp-veeg.cjs                       (start zelf een vite dev-server)
 *           LP_BASIS=http://localhost:8080 node scripts/check-lp-veeg.cjs
 * Exit 0 = alles AF, 1 = afwijking, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4436;
const PAD = '/lp/dakwerken';
const HERO = '#rekenaar .kgj-reken--aanvraag';
const KEUZE = 'Dakrenovatie';
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const BLOK = /clarity\.ms|googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|googlesyndication|leadconnector|gohighlevel|msgsndr|web3forms|\/api\//;
class Ongeldig extends Error {}

async function open(br, basis, veegUit) {
  const ctx = await br.createBrowserContext();
  const p = await ctx.newPage();
  await p.setViewport({ width: 390, height: 664, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); // de scroll na een stap is dan meteen klaar
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (/^(tel|mailto):/.test(u) || BLOK.test(u)) return r.abort();
    if (!/^(127\.0\.0\.1|localhost)$/.test(new URL(u).hostname) && r.method() !== 'GET') return r.abort();
    return r.continue();
  });
  await p.evaluateOnNewDocument((uit) => {
    if (uit) window.__abVeegUit = true;
    window.__abVolUit = true; // de kaart blijft in de pagina (geen focusstand, geen volle scherm): alleen de tik wordt gemeten
    window.__m = { start: [], eind: [], klik: [] };
    addEventListener('touchstart', () => window.__m.start.push(performance.now()), { capture: true, passive: true });
    addEventListener('touchend', () => window.__m.eind.push(performance.now()), { capture: true, passive: true });
    addEventListener('mousedown', () => window.__m.klik.push(performance.now()), { capture: true, passive: true });
    try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false, ts: Date.now() })); } catch (e) { /* */ }
  }, veegUit);
  await p.goto(basis + PAD, { waitUntil: 'networkidle2', timeout: 90000 });
  await p.waitForSelector(HERO + ' .kgj-reken__keuze', { timeout: 30000 });
  await wacht(600);
  return { ctx, p };
}
const stand = (p) => p.evaluate((w) => { const k = document.querySelector(w); return { tel: k.querySelector('.kgj-reken__tel')?.textContent.trim() || null, vraag: k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.textContent.trim() || null }; }, HERO);
const midden = (p) => p.evaluate((w, l) => {
  const b = [...document.querySelector(w).querySelectorAll('.kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l);
  if (!b) return null;
  const r = b.getBoundingClientRect();
  const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
  /* raak: op die plek ligt echt de tegel (niet de vaste kopbalk of een ander vlak erboven) */
  return { x, y, top: r.top, bottom: r.bottom, vh: innerHeight, raak: b.contains(document.elementFromPoint(x, y)), nu: performance.now(), eind: window.__m.eind[window.__m.eind.length - 1] ?? null };
}, HERO, KEUZE);
/* Terug naar vraag 1, de kaart bovenaan in beeld, en de 200 ms tegen een dubbele tik voorbij. */
async function begin(p) {
  for (let i = 0; i < 8; i++) {
    const s = await stand(p);
    if (s.tel === 'Stap 1') break;
    await p.evaluate((w) => document.querySelector(w).querySelector('.kgj-reken__terug')?.click(), HERO);
    await wacht(250);
  }
  await p.evaluate((w) => { const k = document.querySelector(w); window.scrollTo(0, Math.max(0, window.scrollY + k.getBoundingClientRect().top - 90)); }, HERO);
  await wacht(450);
  const s = await stand(p);
  if (s.tel !== 'Stap 1') throw new Ongeldig(`niet terug op vraag 1 (${JSON.stringify(s)})`);
  const m = await midden(p);
  if (!m || !m.raak || m.top < 60 || m.bottom > m.vh) throw new Ongeldig(`de tegel "${KEUZE}" staat niet vrij in beeld (${JSON.stringify(m)})`);
  return m;
}
const tik = async (p, x, y, dx = 0) => {
  const h = await p.touchscreen.touchStart(x, y);
  if (dx) await h.move(x + dx, y);
  await h.end();
};
/* Een trage veeg van 60 px omhoog onder de tegels (geen uitloop: de vinger staat stil voor hij loslaat). */
const veeg = async (p) => {
  const h = await p.touchscreen.touchStart(40, 600);
  for (let i = 1; i <= 6; i++) await h.move(40, 600 - i * 10);
  await wacht(120);
  await h.end();
};
const gekozen = async (p) => { await wacht(450); return (await stand(p)).tel === 'Stap 2'; };
const laatste = (p) => p.evaluate(() => ({ start: window.__m.start[window.__m.start.length - 1] ?? null, eind: window.__m.eind, klik: window.__m.klik[window.__m.klik.length - 1] ?? null }));

/* De gevallen. Elk geeft { gekozen, info } terug; een tijdvenster dat niet gehaald is, gooit Ongeldig na 4 pogingen. */
const GEVAL = {
  async gewoon(p) { const m = await begin(p); await tik(p, m.x, m.y); return { gekozen: await gekozen(p), info: 'tik zonder beweging' }; },
  async beweegt(p) { const m = await begin(p); await tik(p, m.x, m.y, 7); return { gekozen: await gekozen(p), info: 'tik met 7 px beweging' }; },
  async naVeeg(p, ms, van, tot) {
    for (let poging = 1; poging <= 4; poging++) {
      await begin(p);
      await veeg(p);
      const m = await midden(p); // de pagina is door de veeg verschoven: de plaats van de tegel van nu
      if (!m || m.eind === null) throw new Ongeldig('geen einde van de veeg gemeten');
      if (!m.raak || m.top < 0 || m.bottom > m.vh) throw new Ongeldig(`na de veeg staat de tegel niet vrij in beeld (${Math.round(m.top)}-${Math.round(m.bottom)}, raak ${m.raak})`);
      const nog = ms - (m.nu - m.eind);
      if (nog > 0) await wacht(nog);
      await tik(p, m.x, m.y);
      const t = await laatste(p);
      const tussen = Math.round(t.start - m.eind);
      if (tussen >= van && tussen < tot) return { gekozen: await gekozen(p), info: `tik ${tussen} ms na de veeg` };
      await wacht(900);
    }
    throw new Ongeldig(`het venster ${van}-${tot} ms na de veeg is in 4 pogingen niet gehaald (trage pc)`);
  },
  async muisNaVeeg(p) {
    for (let poging = 1; poging <= 4; poging++) {
      await begin(p);
      await veeg(p);
      const m = await midden(p);
      if (!m || !m.raak) throw new Ongeldig('na de veeg staat de tegel niet vrij in beeld (muisklik)');
      await p.mouse.click(m.x, m.y);
      const t = await laatste(p);
      const tussen = Math.round(t.klik - m.eind);
      if (tussen >= 0 && tussen < 600) return { gekozen: await gekozen(p), info: `muisklik ${tussen} ms na de veeg` };
      await wacht(900);
    }
    throw new Ongeldig('een muisklik binnen 600 ms na de veeg is in 4 pogingen niet gehaald (trage pc)');
  },
  async paginaScroll(p) {
    const m = await begin(p);
    await p.evaluate(() => window.scrollBy(0, 40));
    await tik(p, m.x, m.y - 40);
    return { gekozen: await gekozen(p), info: 'tik meteen na scrollBy(0, 40)' };
  },
  async klikNaVeeg(p) {
    await begin(p);
    await veeg(p);
    const tussen = await p.evaluate((w, l) => {
      const b = [...document.querySelector(w).querySelectorAll('.kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l);
      b.click();
      return Math.round(performance.now() - window.__m.eind[window.__m.eind.length - 1]);
    }, HERO, KEUZE);
    if (tussen >= 600) throw new Ongeldig(`knop.click() kwam pas ${tussen} ms na de veeg`);
    return { gekozen: await gekozen(p), info: `knop.click() ${tussen} ms na de veeg` };
  },
};

(async () => {
  let srv = null;
  let basis = process.env.LP_BASIS ? process.env.LP_BASIS.replace(/\/$/, '') : null;
  if (!basis) {
    const vite = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    srv = spawn(process.execPath, [vite, '--port', String(POORT), '--strictPort'], { stdio: 'ignore', cwd: path.join(__dirname, '..') });
    basis = `http://localhost:${POORT}`;
    let op = false;
    for (let i = 0; i < 90 && !op; i++) { try { op = (await fetch(basis + PAD)).ok; } catch { await wacht(500); } }
    if (!op) { try { srv.kill(); } catch { /* */ } console.log('ONGELDIGE METING: dev-server kwam niet op'); process.exit(2); }
  }
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-lcd-text', '--no-first-run', '--no-default-browser-check'] });
  const fouten = [];
  let code = 0;
  try {
    /* opwarmen: de eerste lading van een koude dev-server */
    { const { ctx } = await open(br, basis, false); await ctx.close(); }

    /* Positieve controles: met de regel uit kiezen geval 2 en 3 WEL een antwoord. */
    {
      const { ctx, p } = await open(br, basis, true);
      const a = await GEVAL.beweegt(p);
      if (!a.gekozen) throw new Ongeldig(`positieve controle "tik met 7 px beweging, regel uit" koos geen antwoord: de browser geeft hier geen klik (${a.info})`);
      console.log(`positieve controle: regel uit, ${a.info}: kiest een antwoord (gevangen)`);
      const b = await GEVAL.naVeeg(p, 300, 150, 600);
      if (!b.gekozen) throw new Ongeldig(`positieve controle "tik 300 ms na een veeg, regel uit" koos geen antwoord: de browser geeft hier geen klik (${b.info})`);
      console.log(`positieve controle: regel uit, ${b.info}: kiest een antwoord (gevangen)`);
      await ctx.close();
    }

    const { ctx, p } = await open(br, basis, false);
    const eis = async (nr, naam, uitkomst, moet) => {
      const ok = uitkomst.gekozen === moet;
      console.log(`${ok ? '  ok  ' : '  FOUT'} ${nr}. ${naam}: ${uitkomst.gekozen ? 'volgende vraag' : 'blijft op de vraag'} (${uitkomst.info})`);
      if (!ok) fouten.push(`${nr}. ${naam}: ${uitkomst.gekozen ? 'koos een antwoord' : 'koos geen antwoord'} (${uitkomst.info}); verwacht: ${moet ? 'volgende vraag' : 'blijft op de vraag'}`);
    };
    await eis(1, 'gewone tik', await GEVAL.gewoon(p), true);
    await eis(2, 'tik die 7 px beweegt', await GEVAL.beweegt(p), false);
    await eis(3, 'tik 300 ms na een veeg', await GEVAL.naVeeg(p, 300, 150, 600), false);
    await eis(4, 'tik 800 ms na een veeg', await GEVAL.naVeeg(p, 800, 600, 3000), true);
    await eis(5, 'muisklik meteen na een veeg', await GEVAL.muisNaVeeg(p), true);
    await eis(6, 'tik meteen na een scroll van de pagina zelf', await GEVAL.paginaScroll(p), true);
    await eis(7, 'knop.click() meteen na een veeg (vroege tik)', await GEVAL.klikNaVeeg(p), true);
    await eis(8, 'gewone tik na alle gevallen', await GEVAL.gewoon(p), true);
    await ctx.close();
  } catch (e) {
    console.log('ONGELDIGE METING: ' + (e && e.message ? e.message : e));
    code = 2;
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (code === 2) process.exit(2);
  console.log(`check-lp-veeg: ${PAD} @390x664, 8 gevallen, 2 positieve controles (${basis})`);
  if (fouten.length) { for (const f of fouten) console.log('  FOUT: ' + f); process.exit(1); }
  console.log('  AF: een gewone tik kiest, een tik die 7 px beweegt en een tik 300 ms na een veeg kiezen niet, 800 ms na een veeg wel, muis en knop.click() altijd, een scroll van de pagina houdt niets tegen');
  process.exit(0);
})();
