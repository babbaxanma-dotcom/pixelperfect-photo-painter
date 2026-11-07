#!/usr/bin/env node
/**
 * check-lp-contact: de laadstap, het volle scherm (gsm) en het venster (pc) van de aanvraagkaart op /lp/dakwerken,
 * /lp/dakwerken/asbest, /lp/totaalrenovatie en /lp/aannemer-renovatiewerken.
 *
 * Aanleiding (5 nov 2026, Mohammed: "doe bij ab de exact form dingen", "de exacte wijzigingen als bij bf"): de wijzigingen van
 * bfbouw.be van 4-5 nov (cad4e57, d6cfa42, e216830, 91ab7ba, 5638c50). Per pagina, zoals een bezoeker:
 *   1. na het laatste antwoord 1,2 s de laadstap ("Uw aanvraag wordt klaargezet"), daarna het contactscherm; nooit beide tegelijk;
 *   2. 390x664: het contactscherm vult het hele scherm, de verzendknop staat in beeld, de sluitknop rechtsboven is 44x44,
 *      "Na uw aanvraag" staat boven de velden, de regel boven de knop niet over het volle scherm;
 *   3. op het contactscherm staat "gratis" precies 1x (verzendknop) en "vrijblijvend" precies 1x;
 *   4. sluiten = terug in de pagina, contactscherm en antwoorden blijven staan; geen horizontale scroll;
 *   5. versturen: leeg verstuurt niets; daarna (dubbelklik) precies 1 GHL- en 1 Web3Forms-verzoek, precies 1 conversie,
 *      de bedankpagina met "Wat nu volgt" en twee stappen, geen is-formvol meer, de bewaarde antwoorden gewist, geen JS-fout;
 *   6. dubbele tik op het laatste antwoord = 1 laadstap; de terugknop tijdens de laadstap = de vorige vraag, het formulier opent
 *      niet alsnog en de bezoeker blijft op de pagina;
 *   7. 1265x585 en 1440x800: het venster staat in het midden (max 880 px), alles zichtbaar zonder scrollen, gratis 1x en
 *      vrijblijvend 1x, Esc en een klik naast het venster sluiten (contactscherm blijft).
 * Niets gaat naar buiten: GHL en Web3Forms krijgen een leeg antwoord en worden geteld, Clarity en Google-tags een leeg script,
 * tel: en mailto: worden afgebroken.
 *
 * Positieve controles (zonder: exit 2), elk op /lp/dakwerken @390: laadstap op 0 ms moet punt 1 laten falen; de kaart in de pagina
 * (__abVolUit) punt 2; een geplant woord "gratis" in het contactscherm punt 3; een verzendknop die niet vast onderaan staat
 * (geplante CSS) punt 2.
 *
 * Draaien:  node scripts/check-lp-contact.cjs                         (start zelf een vite dev-server)
 *           LP_BASIS=http://127.0.0.1:4612 node scripts/check-lp-contact.cjs
 * Exit 0 = alles AF, 1 = afwijking, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4435;
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const HERO = '#rekenaar .kgj-reken--aanvraag';
const PADEN = {
  '/lp/dakwerken': ['Hellend dak', 'Dakrenovatie', 'Ja', 'Nee', '50 tot 100 m²', 'Zo snel mogelijk'],
  '/lp/dakwerken/asbest': ['Plat dak', 'Nieuw dak', 'Huidig dak vervangen', 'EPDM', '50 tot 100 m²', 'Zo snel mogelijk'],
  '/lp/totaalrenovatie': ['Rijwoning', 'Gedeeltelijke renovatie', ['Keuken', 'Badkamer'], 'Zo snel mogelijk', '€ 25.000 tot € 75.000'],
  '/lp/aannemer-renovatiewerken': ['Rijwoning', 'Gedeeltelijke renovatie', ['Keuken', 'Badkamer'], 'Zo snel mogelijk', '€ 25.000 tot € 75.000'],
};

async function open(br, basis, w, h, pad, plant = {}) {
  const ctx = await br.createBrowserContext();
  const p = await ctx.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w <= 1000, hasTouch: w <= 1000 });
  const tel = { ghl: 0, w3: 0, conv: 0 };
  const fouten = [];
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (/^(tel|mailto):/.test(u)) return r.abort();
    if (/leadconnectorhq\.com|web3forms\.com/.test(u)) {
      const cors = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' };
      if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: cors, body: '' });
      if (u.includes('web3forms')) tel.w3++; else if (/\/hooks\//.test(u)) tel.ghl++;
      return r.respond({ status: 200, contentType: 'application/json', headers: cors, body: '{"success":true}' });
    }
    if (/clarity\.ms|googletagmanager|google-analytics|doubleclick|googleadservices|googlesyndication/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
    if (!/^(127\.0\.0\.1|localhost)$/.test(new URL(u).hostname) && r.method() !== 'GET') return r.abort();
    return r.continue();
  });
  p.on('pageerror', (e) => fouten.push('pageerror: ' + String(e.message || e)));
  p.on('console', (m) => {
    if (/\[tracking\] Google Ads conversie (afgevuurd|OVERGESLAGEN)/.test(m.text())) tel.conv++;
    if (m.type() === 'error' && !/Failed to load resource|favicon/.test(m.text())) fouten.push('console: ' + m.text());
  });
  await p.evaluateOnNewDocument((o) => {
    window.__ev = [];
    window.clarity = function () { window.__ev.push(Array.from(arguments)); };
    if (o.laadMs !== undefined) window.__abLaadMs = o.laadMs;
    if (o.volUit) window.__abVolUit = true;
    try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false, ts: Date.now() })); } catch (e) { /* */ }
  }, plant);
  await p.goto(basis + pad, { waitUntil: 'networkidle2', timeout: 60000 });
  await p.waitForSelector(HERO + ' .kgj-reken__keuze', { timeout: 20000 });
  if (plant.css) await p.addStyleTag({ content: plant.css });
  await wacht(400);
  return { ctx, p, tel, fouten };
}
const tik = (p, label) => p.evaluate((w, l) => {
  const k = document.querySelector(w);
  const b = k && [...k.querySelectorAll('.kgj-reken__keuze, .kgj-reken__vink')].find((x) => (x.querySelector('strong')?.textContent || x.textContent || '').trim() === l);
  if (!b) return false; b.click(); return true;
}, HERO, label);
async function doorloop(p, pad, metLaatste) {
  const st = PADEN[pad];
  for (let i = 0; i < st.length - (metLaatste ? 0 : 1); i++) {
    const s = st[i];
    if (Array.isArray(s)) {
      for (const v of s) { if (!(await tik(p, v))) throw new Error(`keuze "${v}" niet gevonden op ${pad}`); await wacht(260); }
      await p.evaluate((w) => document.querySelector(w).querySelector('.kgj-reken__verder').click(), HERO);
    } else if (!(await tik(p, s))) throw new Error(`keuze "${s}" niet gevonden op ${pad}`);
    await wacht(260);
  }
}
const info = (p) => p.evaluate((w) => {
  const k = document.querySelector(w); if (!k) return null;
  const r = (s) => { const e = k.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), right: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height), zicht: b.width > 0 && b.height > 0 }; };
  const kr = k.getBoundingClientRect();
  const tekst = k.innerText || '';
  return { vol: k.classList.contains('is-vol'), laden: !!k.querySelector('.kgj-reken__laad'), contact: !!k.querySelector('.kgj-reken__contact'), html: document.documentElement.classList.contains('is-formvol'),
    vraag: k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.textContent?.trim() || null,
    knop: r('.kgj-reken__knop'), sluit: r('.kgj-reken__sluit'), naam: r('input[name="naam"]'), volgt: r('.kgj-reken__volgt'), trigger: r('.kgj-reken__trigger'),
    kaart: { top: Math.round(kr.top), bottom: Math.round(kr.bottom), left: Math.round(kr.left), right: Math.round(kr.right), w: Math.round(kr.width), h: Math.round(kr.height), sh: k.scrollHeight, ch: k.clientHeight },
    gratis: (tekst.match(/gratis/gi) || []).length, vrij: (tekst.match(/vrijblijvend/gi) || []).length,
    samen: k.querySelector('.kgj-reken__samen-tekst')?.textContent?.trim() || null, vh: innerHeight, vw: innerWidth,
    hscroll: Math.max(document.documentElement.scrollWidth, innerWidth) > document.documentElement.clientWidth + 1 };
}, HERO);
/* Tijdlijn in de pagina zelf (MutationObserver, geen pollen): wanneer de laadstap verschijnt en verdwijnt, wanneer het contactscherm komt. */
const laatsteMetTijdlijn = (p, label) => p.evaluate((w, l) => new Promise((klaar) => {
  const k = document.querySelector(w);
  const b = [...k.querySelectorAll('.kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l);
  if (!b) { klaar(null); return; }
  const t0 = performance.now(); const t = { laadAan: null, laadUit: null, contact: null, samen: false };
  const kijk = () => {
    const kk = document.querySelector(w); const nu = Math.round(performance.now() - t0);
    const laad = !!kk.querySelector('.kgj-reken__laad'), contact = !!kk.querySelector('.kgj-reken__contact');
    if (laad && t.laadAan === null) t.laadAan = nu;
    if (!laad && t.laadAan !== null && t.laadUit === null) t.laadUit = nu;
    if (contact && t.contact === null) t.contact = nu;
    if (laad && contact) t.samen = true;
  };
  const mo = new MutationObserver(kijk); mo.observe(k, { childList: true, subtree: true });
  b.click(); kijk();
  setTimeout(() => { mo.disconnect(); kijk(); klaar(t); }, 2200);
}), HERO, label);

/* Punt 1-5 op 390x664. Geeft de fouten terug. */
async function gsmFlow(br, basis, pad, plant = {}, alleenTot = null) {
  const uit = [];
  const { ctx, p, tel, fouten } = await open(br, basis, 390, 664, pad, plant);
  try {
    await doorloop(p, pad, false);
    const st = PADEN[pad];
    const t = await laatsteMetTijdlijn(p, st[st.length - 1]);
    if (!t) { uit.push('laatste keuze niet gevonden'); return uit; }
    /* laadAan: rendertijd na de tik, gemeten 133 ms op een drukke pc (5 nov); 300 ms = nog altijd "meteen" */
    if (t.laadAan === null || t.laadAan > 300 || t.laadUit === null || t.laadUit < 1150 || t.laadUit > 1600 || t.contact === null || t.contact < t.laadUit || t.samen)
      uit.push(`1. laadstap ${JSON.stringify(t)} (verwacht: laadstap meteen, weg na 1150-1600 ms, daarna het contactscherm, nooit beide)`);
    await wacht(200);
    const c = await info(p);
    if (!c.contact) { uit.push('geen contactscherm na de laadstap'); return uit; }
    if (!(c.vol && c.html && c.kaart.top === 0 && c.kaart.left === 0 && c.kaart.w === 390 && c.kaart.h === 664)) uit.push(`2. contactscherm niet over het volle scherm ${JSON.stringify(c.kaart)} (is-vol ${c.vol})`);
    if (!(c.knop && c.knop.top >= 0 && c.knop.bottom <= 664)) uit.push(`2. verzendknop niet in beeld ${JSON.stringify(c.knop)}`);
    if (!(c.sluit && c.sluit.zicht && c.sluit.w === 44 && c.sluit.h === 44 && c.sluit.right >= 370 && c.sluit.top < 60)) uit.push(`2. sluitknop ${JSON.stringify(c.sluit)} (verwacht 44x44 rechtsboven)`);
    if (!(c.volgt && c.naam && c.volgt.bottom <= c.naam.top)) uit.push('2. "Na uw aanvraag" staat niet boven de velden');
    if (c.trigger && c.trigger.zicht) uit.push('2. de regel boven de knop staat ook over het volle scherm');
    if (c.gratis !== 1) uit.push(`3. "gratis" ${c.gratis}x op het contactscherm (verwacht 1x, de verzendknop)`);
    if (c.vrij !== 1) uit.push(`3. "vrijblijvend" ${c.vrij}x op het contactscherm (verwacht 1x)`);
    if (alleenTot === 3) return uit;
    const samenVoor = c.samen;
    await p.evaluate((w) => document.querySelector(w).querySelector('.kgj-reken__sluit').click(), HERO);
    await wacht(500);
    const s = await info(p);
    if (!(!s.vol && !s.html && s.contact && s.samen === samenVoor)) uit.push(`4. sluiten: ${JSON.stringify({ vol: s.vol, html: s.html, contact: s.contact, samen: s.samen, voor: samenVoor })}`);
    if (s.hscroll) uit.push('4. horizontale scroll');
    await p.evaluate((w) => document.querySelector(w).querySelector('.kgj-reken__knop').click(), HERO);
    await wacht(300);
    if (tel.ghl || tel.w3) uit.push(`5. leeg versturen stuurde ${tel.ghl} GHL / ${tel.w3} Web3Forms`);
    await p.type(`${HERO} input[name="naam"]`, 'Test Kaart');
    await p.type(`${HERO} input[name="telefoon"]`, '0400 00 00 00');
    await p.type(`${HERO} input[name="email"]`, 'test@kaart.be');
    await p.evaluate((w) => { const k = document.querySelector(w).querySelector('.kgj-reken__knop'); k.click(); k.click(); }, HERO);
    await p.waitForFunction(() => location.pathname.startsWith('/bedankt'), { timeout: 15000 }).catch(() => {});
    await p.waitForSelector('.bf-dank__kop', { timeout: 15000 }).catch(() => {});
    await wacht(600);
    const d = await p.evaluate(() => ({ pad: location.pathname, kop: document.querySelector('.bf-dank__volgt h2')?.textContent, stappen: document.querySelectorAll('.bf-dank__stappen--volgt li').length,
      html: document.documentElement.classList.contains('is-formvol'), opslag: sessionStorage.getItem('ab_aanvraag') }));
    if (!d.pad.startsWith('/bedankt/')) uit.push(`5. geen bedankpagina (${d.pad})`);
    if (tel.ghl !== 1 || tel.w3 !== 1) uit.push(`5. ${tel.ghl} GHL- en ${tel.w3} Web3Forms-verzoeken (verwacht 1 en 1)`);
    if (tel.conv !== 1) uit.push(`5. ${tel.conv} conversies (verwacht 1)`);
    if (d.kop !== 'Wat nu volgt' || d.stappen !== 2) uit.push(`5. bedankpagina: "${d.kop}" met ${d.stappen} stappen (verwacht "Wat nu volgt" met 2)`);
    if (d.html || d.opslag !== null) uit.push(`5. na versturen: is-formvol ${d.html}, bewaarde antwoorden ${d.opslag}`);
    if (fouten.length) uit.push(`5. JS-fout: ${fouten.slice(0, 2).join(' | ')}`);
    return uit;
  } finally { await ctx.close(); }
}
/* Punt 6 op 390x664. */
async function terugFlow(br, basis, pad) {
  const uit = [];
  const { ctx, p, fouten } = await open(br, basis, 390, 664, pad);
  try {
    await doorloop(p, pad, false);
    const st = PADEN[pad];
    const laatste = st[st.length - 1];
    const vraagLaatste = (await info(p)).vraag;
    await p.evaluate((w, l) => {
      const vind = () => [...document.querySelector(w).querySelectorAll('.kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l);
      vind().click(); setTimeout(() => { const b = vind(); if (b) b.click(); }, 40);
    }, HERO, laatste);
    await wacht(300);
    const n = await p.evaluate(() => window.__ev.filter((e) => e[1] === 'aanvraag-laden').length);
    if (n !== 1) uit.push(`6. dubbele tik gaf ${n} laadstappen (verwacht 1)`);
    await p.goBack({ timeout: 5000 }).catch(() => {});
    await wacht(1500);
    const t = await info(p);
    if (!t || t.vol || t.contact || t.laden || t.vraag !== vraagLaatste) uit.push(`6. terugknop tijdens de laadstap: ${JSON.stringify({ vraag: t && t.vraag, verwacht: vraagLaatste, vol: t && t.vol, contact: t && t.contact })}`);
    const pad2 = await p.evaluate(() => location.pathname);
    if (pad2 !== pad) uit.push(`6. de terugknop verliet de pagina (${pad2})`);
    if (fouten.length) uit.push(`6. JS-fout: ${fouten.slice(0, 2).join(' | ')}`);
    return uit;
  } finally { await ctx.close(); }
}
/* Punt 7 op de pc. */
async function pcFlow(br, basis, pad, w, h) {
  const uit = [];
  const { ctx, p, fouten } = await open(br, basis, w, h, pad);
  try {
    await doorloop(p, pad, true);
    await wacht(1600);
    const c = await info(p);
    const midX = (c.kaart.left + c.kaart.right) / 2, midY = (c.kaart.top + c.kaart.bottom) / 2;
    if (!(c.vol && c.contact && Math.abs(midX - w / 2) <= 2 && Math.abs(midY - h / 2) <= 2 && c.kaart.w <= 880)) uit.push(`7. venster niet in het midden ${JSON.stringify(c.kaart)} (is-vol ${c.vol})`);
    if (!(c.kaart.sh <= c.kaart.ch + 1 && c.kaart.top >= 0 && c.kaart.bottom <= h)) uit.push(`7. niet alles zichtbaar zonder scrollen (${c.kaart.sh} > ${c.kaart.ch})`);
    if (c.gratis !== 1 || c.vrij !== 1) uit.push(`7. gratis ${c.gratis}x, vrijblijvend ${c.vrij}x (verwacht 1x en 1x)`);
    await p.keyboard.press('Escape');
    await wacht(400);
    const e = await info(p);
    if (!(!e.vol && e.contact && !e.html)) uit.push('7. Esc sloot het venster niet (of het contactscherm verdween)');
    await p.evaluate((x) => document.querySelector(x).querySelector('.kgj-reken__terug').click(), HERO);
    await wacht(300);
    const st = PADEN[pad];
    await tik(p, st[st.length - 1]);
    await wacht(1600);
    const o = await info(p);
    await p.mouse.click(8, 8);
    await wacht(400);
    const n = await info(p);
    if (!(o.vol && !n.vol && n.contact)) uit.push('7. een klik naast het venster sloot het niet');
    if (n.hscroll) uit.push('7. horizontale scroll');
    if (fouten.length) uit.push(`7. JS-fout: ${fouten.slice(0, 2).join(' | ')}`);
    return uit;
  } finally { await ctx.close(); }
}

/* Punt 8 (dakpagina's, bfbouw.be 5638c50/8343954): "Veelgestelde vragen" direct onder "De voordelen van een dakrenovatie", de drie
   vragen in die volgorde, de eerste open, de klikbare zin "Vraag dan een gratis offerte aan." brengt de kaart onderaan in beeld. */
const FAQ = ['Wat kost een dakrenovatie?', 'Krijg ik een premie voor mijn dakrenovatie?', 'Hoe lang duurt een dakrenovatie?'];
async function faqFlow(br, basis, pad, w, h, plant = null) {
  const uit = [];
  const { ctx, p } = await open(br, basis, w, h, pad);
  try {
    if (plant) await p.evaluate(() => { const d = document.querySelector('#faq details'); if (d) d.open = false; });
    const f = await p.evaluate(() => {
      const s = document.querySelector('#faq');
      const vorige = s?.previousElementSibling;
      return { er: !!s, vorige: vorige?.id || null, vorigeKop: vorige?.querySelector('h2')?.textContent.trim() || null,
        vragen: s ? [...s.querySelectorAll('details summary')].map((x) => x.textContent.trim()) : [], open: s ? [...s.querySelectorAll('details')].map((d) => d.open) : [],
        link: s?.querySelector('a.bf-vraag__link')?.getAttribute('href') || null, linkTekst: s?.querySelector('a.bf-vraag__link')?.textContent.trim() || null };
    });
    if (!f.er) { uit.push('8. geen veelgestelde vragen'); return uit; }
    if (f.vorige !== 'voordelen' || f.vorigeKop !== 'De voordelen van een dakrenovatie') uit.push(`8. de vragen staan na "${f.vorigeKop}" (#${f.vorige}) in plaats van direct onder "De voordelen van een dakrenovatie"`);
    if (f.vragen.join('|') !== FAQ.join('|')) uit.push(`8. vragen "${f.vragen.join(' | ')}"`);
    if (f.open.join('|') !== 'true|false|false') uit.push(`8. open/dicht ${f.open.join(', ')} (verwacht alleen de eerste open)`);
    if (f.link !== '#contact' || f.linkTekst !== 'Vraag dan een gratis offerte aan.') uit.push(`8. link "${f.linkTekst}" naar ${f.link}`);
    if (f.link) {
      await p.evaluate(() => document.querySelector('#faq a.bf-vraag__link').click());
      await wacht(1400);
      const z = await p.evaluate(() => { const k = document.querySelector('#contact .kgj-reken--aanvraag'); const r = k?.getBoundingClientRect(); return r ? { top: Math.round(r.top), vh: innerHeight } : null; });
      if (!z || z.top < 0 || z.top > z.vh - 120) uit.push(`8. na de link staat de kaart onderaan niet in beeld (${JSON.stringify(z)})`);
    }
    const hs = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, innerWidth) > document.documentElement.clientWidth + 1);
    if (hs) uit.push('8. horizontale scroll');
    return uit;
  } finally { await ctx.close(); }
}

(async () => {
  let srv = null;
  let basis = process.env.LP_BASIS ? process.env.LP_BASIS.replace(/\/$/, '') : null;
  if (!basis) {
    const vite = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    srv = spawn(process.execPath, [vite, '--port', String(POORT), '--strictPort'], { stdio: 'ignore', cwd: path.join(__dirname, '..') });
    basis = `http://localhost:${POORT}`;
    let op = false;
    for (let i = 0; i < 90 && !op; i++) { try { op = (await fetch(basis + '/lp/dakwerken')).ok; } catch { await wacht(500); } }
    if (!op) { try { srv.kill(); } catch { /* */ } console.log('ONGELDIGE METING: dev-server kwam niet op'); process.exit(2); }
  }
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-lcd-text', '--no-first-run', '--no-default-browser-check'] });
  const fouten = [];
  let code = 0;
  try {
    /* opwarmen: de eerste lading van een koude dev-server houdt de klokken van de pagina op (gemeten 5 nov: 2430 ms i.p.v. 1200) */
    for (const pad of Object.keys(PADEN)) { const { ctx } = await open(br, basis, 390, 664, pad); await ctx.close(); }
    await (async () => { const { ctx, p } = await open(br, basis, 390, 664, '/lp/dakwerken'); await doorloop(p, '/lp/dakwerken', true); await wacht(1500); await ctx.close(); })();

    /* positieve controles */
    const controles = [
      ['laadstap op 0 ms', { laadMs: 0 }, /^1\. laadstap/],
      ['kaart in de pagina (geen volle scherm)', { volUit: true }, /^2\. contactscherm niet over het volle scherm/],
      ['een geplant woord "gratis"', { extra: true }, /^3\. "gratis"/],
      ['verzendknop niet vast onderaan', { css: '.kgj-reken.is-vol .kgj-reken__contact > .kgj-reken__knop{position:static!important}' }, /^2\. verzendknop niet in beeld/],
    ];
    for (const [naam, plant, verwacht] of controles) {
      let r;
      if (plant.extra) {
        /* "gratis" in het contactscherm planten: na de laadstap een tekst in de band zetten */
        const { ctx, p } = await open(br, basis, 390, 664, '/lp/dakwerken');
        await doorloop(p, '/lp/dakwerken', true);
        await wacht(1600);
        await p.evaluate((w) => { const b = document.querySelector(w + ' .kgj-reken__band'); if (b) b.append(' Gratis'); }, HERO);
        const c = await info(p);
        r = c.gratis !== 1 ? ['3. "gratis" ' + c.gratis + 'x'] : [];
        await ctx.close();
      } else r = await gsmFlow(br, basis, '/lp/dakwerken', plant, 3);
      if (!r.some((x) => verwacht.test(x))) { console.log(`ONGELDIGE METING: positieve controle "${naam}" niet gevangen (${r.join(' | ') || 'geen fout'})`); code = 2; }
      else console.log(`positieve controle: ${naam}: gevangen`);
    }
    {
      const r = await faqFlow(br, basis, '/lp/dakwerken', 390, 664, 'dicht');
      if (!r.some((x) => /^8\. open\/dicht/.test(x))) { console.log(`ONGELDIGE METING: positieve controle "eerste vraag dicht" niet gevangen (${r.join(' | ') || 'geen fout'})`); code = 2; }
      else console.log('positieve controle: eerste vraag dicht: gevangen');
    }
    if (code === 2) return;

    for (const pad of ['/lp/dakwerken', '/lp/dakwerken/asbest']) for (const [w, h] of [[390, 664], [1265, 585]]) for (const f of await faqFlow(br, basis, pad, w, h)) fouten.push(`${pad} @${w}x${h}: ${f}`);
    for (const pad of Object.keys(PADEN)) {
      for (const f of await gsmFlow(br, basis, pad)) fouten.push(`${pad} @390x664: ${f}`);
      for (const f of await terugFlow(br, basis, pad)) fouten.push(`${pad} @390x664: ${f}`);
      for (const [w, h] of [[1265, 585], [1440, 800]]) for (const f of await pcFlow(br, basis, pad, w, h)) fouten.push(`${pad} @${w}x${h}: ${f}`);
    }
  } catch (e) {
    console.log('ONGELDIGE METING: ' + (e && e.message ? e.message : e));
    code = 2;
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (code === 2) process.exit(2);
  console.log(`check-lp-contact: ${Object.keys(PADEN).length} LP's, laadstap, volle scherm 390x664, venster 1265x585 en 1440x800, versturen (nul echte verzoeken) (${basis})`);
  if (fouten.length) { for (const f of fouten) console.log('  FOUT: ' + f); process.exit(1); }
  console.log('  AF: laadstap 1,2 s, contactscherm over het volle scherm met verzendknop en sluitknop, gratis 1x en vrijblijvend 1x, sluiten/Esc/klik ernaast houdt het contactscherm, terugknop = vorige vraag, 1 lead + 1 conversie, bedankpagina "Wat nu volgt"');
  process.exit(0);
})();
