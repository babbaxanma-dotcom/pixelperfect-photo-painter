#!/usr/bin/env node
/**
 * check-lp-contact: de laadstap en het contactblok van de aanvraagkaart op /lp/dakwerken, /lp/dakwerken/asbest, /lp/totaalrenovatie en
 * /lp/aannemer-renovatiewerken.
 *
 * Geschiedenis: 5 nov 2026 (Mohammed: "doe bij ab de exact form dingen") toetste dit script het volle scherm (gsm) en het venster (pc)
 * met sluitknop. 18 nov 2026 (formulier v2, Mohammed: "die popup kan je weghalen", "doe al di fix van dat het geen popup is"; daarna zijn
 * referentie: het einde van het formulier "gewoon zo") bestaat dat niet meer: het contactblok is de volgende stap in dezelfde kaart. De
 * punten die het volle scherm toetsten, toetsen nu het blok in de kaart; elk punt houdt een positieve controle. Per pagina, zoals een
 * bezoeker:
 *   1. na het laatste antwoord 1,2 s de laadstap ("Uw aanvraag wordt klaargezet"), daarna het contactblok; nooit beide tegelijk;
 *   2. 390x664: GEEN pop-up: de kaart staat niet vast over het scherm, geen html.is-formvol, geen dialoog, geen sluitknop, geen donkere
 *      achtergrond, geen extra regel in de geschiedenis (history.length gelijk); het blok staat in de kaart met dezelfde teller ("Stap n")
 *      en "Terug"; kop "Contact", de drie velden en de verzendknop in beeld;
 *   3. in het contactblok staat "gratis" precies 2x (de verzendknop en "Gratis plaatsbezoek" in de korte regels onder de knop, dictaat
 *      Mohammed 18 nov) en "vrijblijvend" 1x ("Vrijblijvend: je beslist zelf ..." in stap 3, definitief dictaat 18 nov);
 *   4. "Terug" vanaf het contactblok = de laatste vraag, met het gekozen antwoord; geen horizontale scroll;
 *   5. versturen: leeg verstuurt niets (meldingen onder de velden); daarna (dubbelklik) precies 1 GHL- en 1 Web3Forms-verzoek, precies 1
 *      conversie, de bedankpagina met "Wat nu volgt" en drie stappen, de bewaarde antwoorden en contactgegevens gewist, geen JS-fout;
 *   6. dubbele tik op het laatste antwoord = 1 laadstap; de terugknop van de browser tijdens de laadstap doet wat hij overal doet: hij
 *      verlaat de pagina (er is geen eigen geschiedenisregel meer); wie terugkomt, staat op het contactblok met zijn antwoorden;
 *   7. 1265x585 en 1440x800: het contactblok staat in de kaart in de pagina (geen venster), kop, velden en verzendknop zichtbaar zonder
 *      zelf te scrollen; "gratis" 1x; geen horizontale scroll;
 *   8. veelgestelde vragen (dakpagina's), ongewijzigd;
 *   9. focusstand op de gsm (9 nov 2026): na een tik op "Ik ben op zoek naar" of vraag 1 een wazige sluier, de kaart scherp in beeld.
 * De robuustheid van het formulier (nummers, e-mail, Enter, nieuwe pogingen, time-out, bewaren, toetsenbord) toetst check-lp-formulier.cjs.
 * Niets gaat naar buiten: GHL en Web3Forms krijgen een leeg antwoord en worden geteld, Clarity en Google-tags een leeg script,
 * tel: en mailto: worden afgebroken.
 *
 * Positieve controles (zonder: exit 2), op /lp/dakwerken @390: laadstap op 0 ms moet punt 1 laten falen; de kaart vast over het scherm
 * (geplante CSS) punt 2 (pop-up); een geplant woord "gratis" in het blok punt 3; een verzendknop 700 px lager punt 2 (niet in beeld);
 * een geplante pushState bij het contactblok punt 2 (geschiedenis); een open eerste vraag punt 8; een witte sluier punt 9.
 *
 * Draaien:  node scripts/check-lp-contact.cjs                         (start zelf een vite dev-server)
 *           LP_BASIS=http://127.0.0.1:8080 node scripts/check-lp-contact.cjs
 * Exit 0 = alles AF, 1 = afwijking, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4435;
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const HERO = '#rekenaar .kgj-reken--aanvraag';
/* 18 nov 2026 (v2): zonder asbest-, oppervlakte- en bereikbaar-vraag */
const PADEN = {
  '/lp/dakwerken': ['Dakrenovatie', 'Hellend dak', 'Nee'], // 18 nov 2026: geen startvraag
  '/lp/dakwerken/asbest': ['Nieuw dak', 'Plat dak', 'Huidig dak vervangen'],
  '/lp/totaalrenovatie': ['Rijwoning', 'Gedeeltelijke renovatie', ['Keuken', 'Badkamer'], '€ 25.000 tot € 75.000'],
  '/lp/aannemer-renovatiewerken': ['Rijwoning', 'Gedeeltelijke renovatie', ['Keuken', 'Badkamer'], '€ 25.000 tot € 75.000'],
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
    if (/leadconnectorhq\.com|web3forms\.com|gohighlevel|msgsndr/.test(u)) {
      const cors = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' };
      if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: cors, body: '' });
      if (u.includes('web3forms')) tel.w3++; else if (/\/hooks\//.test(u)) tel.ghl++;
      return r.respond({ status: 200, contentType: 'application/json', headers: cors, body: '{"success":true}' });
    }
    if (/clarity\.ms|googletagmanager|google-analytics|doubleclick|googleadservices|googlesyndication/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
    if (!/^(127\.0\.0\.1|localhost)$/.test(new URL(u).hostname) && r.method() !== 'GET') return r.abort();
    if (/\/api\//.test(u)) return r.respond({ status: 200, contentType: 'application/json', body: '{}' });
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
    if (o.push) { const echt = history.pushState.bind(history); setInterval(() => { if (document.querySelector('.kgj-reken__contact') && !window.__geduwd) { window.__geduwd = true; echt({ geplant: 1 }, ''); } }, 50); }
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
  const r = (s, ouder = k) => { const e = ouder.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height), zicht: b.width > 0 && b.height > 0 }; };
  const vast = (() => { for (let e = k; e && e !== document.body; e = e.parentElement) if (getComputedStyle(e).position === 'fixed') return true; return false; })();
  const f = k.querySelector('form.kgj-reken__contact');
  const tekst = f ? f.innerText || '' : '';
  const kop = document.querySelector('.kgj-kop'), kcs = kop && getComputedStyle(kop);
  return { vast, laden: !!k.querySelector('.kgj-reken__laad'), contact: !!f, html: document.documentElement.classList.contains('is-formvol'),
    dialoog: !!document.querySelector('[role="dialog"][aria-modal="true"]'), sluit: !!document.querySelector('.kgj-reken__sluit'), achter: !!document.querySelector('.kgj-reken__achter'),
    tel: (k.querySelector('.kgj-reken__tel')?.dataset.intern ?? k.querySelector('.kgj-reken__tel')?.textContent.trim()), terug: !!k.querySelector('.kgj-reken__terug'),
    vraag: k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.textContent?.trim() || null,
    ckop: r('.kgj-reken__ckop'), knop: r('.kgj-reken__knop'), naam: r('input[name="naam"]'), telv: r('input[name="telefoon"]'), mail: r('input[name="email"]'),
    balk: kop && kcs.position === 'fixed' && kcs.visibility !== 'hidden' ? Math.round(kop.getBoundingClientRect().bottom) : 0,
    gratis: (tekst.match(/gratis/gi) || []).length, vrij: (tekst.match(/vrijblijvend/gi) || []).length, gekozen: k.querySelector('.kgj-reken__keuze.is-aan strong')?.textContent.trim() || null,
    vh: innerHeight, vw: innerWidth, hist: history.length,
    hscroll: Math.max(document.documentElement.scrollWidth, innerWidth) > document.documentElement.clientWidth + 1 };
}, HERO);
/* Tijdlijn in de pagina zelf (MutationObserver, geen pollen): wanneer de laadstap verschijnt en verdwijnt, wanneer het contactblok komt. */
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
const geenPopup = (c) => !(c.vast || c.html || c.dialoog || c.sluit || c.achter);

/* Punt 1-5 op 390x664. Geeft de fouten terug. */
async function gsmFlow(br, basis, pad, plant = {}, alleenTot = null) {
  const uit = [];
  const { ctx, p, tel, fouten } = await open(br, basis, 390, 664, pad, plant);
  try {
    const hist0 = await p.evaluate(() => history.length);
    await doorloop(p, pad, false);
    const st = PADEN[pad];
    const t = await laatsteMetTijdlijn(p, st[st.length - 1]);
    if (!t) { uit.push('laatste keuze niet gevonden'); return uit; }
    /* laadAan: rendertijd na de tik, gemeten 133 ms op een drukke pc (5 nov); 300 ms = nog altijd "meteen" */
    if (t.laadAan === null || t.laadAan > 300 || t.laadUit === null || t.laadUit < 1150 || t.laadUit > 1600 || t.contact === null || t.contact < t.laadUit || t.samen)
      uit.push(`1. laadstap ${JSON.stringify(t)} (verwacht: laadstap meteen, weg na 1150-1600 ms, daarna het contactblok, nooit beide)`);
    await wacht(500);
    const c = await info(p);
    if (!c.contact) { uit.push('geen contactblok na de laadstap'); return uit; }
    if (!geenPopup(c)) uit.push(`2. pop-up: ${JSON.stringify({ vast: c.vast, formvol: c.html, dialoog: c.dialoog, sluit: c.sluit, achter: c.achter })} (verwacht: het blok in de kaart, in de pagina)`);
    if (c.hist !== hist0) uit.push(`2. geschiedenis: ${c.hist - hist0} regel(s) erbij (verwacht 0: geen eigen terugregel)`);
    if (c.tel !== `Stap ${st.length + 1}` || !c.terug) uit.push(`2. teller "${c.tel}" en Terug ${c.terug} (verwacht "Stap ${st.length + 1}" en Terug in dezelfde kaart)`);
    for (const [naam, r] of [['kop "Contact"', c.ckop], ['naamveld', c.naam], ['telefoonveld', c.telv], ['e-mailveld', c.mail], ['verzendknop', c.knop]]) {
      if (!(r && r.zicht && r.top >= c.balk - 1 && r.bottom <= c.vh)) uit.push(`2. ${naam} niet in beeld ${JSON.stringify(r)} (balk ${c.balk}, scherm ${c.vh})`);
    }
    if (c.gratis !== 2) uit.push(`3. "gratis" ${c.gratis}x in het contactblok (verwacht 2x: de verzendknop en "Gratis plaatsbezoek" onder de knop)`);
    if (c.vrij !== 1) uit.push(`3. "vrijblijvend" ${c.vrij}x in het contactblok (verwacht 1x: stap 3 van "Na uw aanvraag")`);
    if (alleenTot === 3) return uit;
    /* 4. Terug = de laatste vraag met het gekozen antwoord; daarna weer naar het contactblok */
    const laatste = st[st.length - 1];
    await p.evaluate((w) => document.querySelector(w + ' .kgj-reken__terug').click(), HERO);
    await wacht(500);
    const tr = await info(p);
    const verwachtGekozen = Array.isArray(laatste) ? null : laatste;
    if (tr.contact || (verwachtGekozen && tr.gekozen !== verwachtGekozen)) uit.push(`4. Terug vanaf het contactblok: ${JSON.stringify({ contact: tr.contact, vraag: tr.vraag, gekozen: tr.gekozen })} (verwacht de laatste vraag met "${verwachtGekozen}")`);
    if (tr.hscroll) uit.push('4. horizontale scroll');
    if (Array.isArray(laatste)) await p.evaluate((w) => document.querySelector(w + ' .kgj-reken__verder').click(), HERO); else await tik(p, laatste);
    await p.waitForSelector(HERO + ' form.kgj-reken__contact', { timeout: 5000 }).catch(() => {});
    await wacht(400);
    /* 5. versturen */
    await p.evaluate((w) => document.querySelector(w).querySelector('.kgj-reken__knop').click(), HERO);
    await wacht(400);
    const leeg = await p.evaluate((w) => [...document.querySelectorAll(w + ' .kgj-reken__veldfout')].map((m) => m.closest('.kgj-reken__cveld')?.querySelector('input')?.name), HERO);
    if (leeg.join('|') !== 'naam|telefoon|email') uit.push(`5. leeg versturen: meldingen onder ${leeg.join(', ') || 'geen enkel veld'} (verwacht onder naam, telefoon en e-mail)`);
    if (tel.ghl || tel.w3) uit.push(`5. leeg versturen stuurde ${tel.ghl} GHL / ${tel.w3} Web3Forms`);
    await p.type(`${HERO} input[name="naam"]`, 'Test Kaart');
    await p.type(`${HERO} input[name="telefoon"]`, '0400 00 00 00');
    await p.type(`${HERO} input[name="email"]`, 'test@kaart.be');
    await p.evaluate((w) => { const k = document.querySelector(w).querySelector('.kgj-reken__knop'); k.click(); k.click(); }, HERO);
    await p.waitForFunction(() => location.pathname.startsWith('/bedankt'), { timeout: 15000 }).catch(() => {});
    await p.waitForSelector('.bf-dank__kop', { timeout: 15000 }).catch(() => {});
    await wacht(600);
    const d = await p.evaluate(() => ({ pad: location.pathname, kop: document.querySelector('.bf-dank__volgt h2')?.textContent, stappen: document.querySelectorAll('.bf-dank__stappen--volgt li').length,
      html: document.documentElement.classList.contains('is-formvol'), opslag: sessionStorage.getItem('ab_aanvraag'), contact: sessionStorage.getItem('ab_contact') }));
    if (!d.pad.startsWith('/bedankt/')) uit.push(`5. geen bedankpagina (${d.pad})`);
    if (tel.ghl !== 1 || tel.w3 !== 1) uit.push(`5. ${tel.ghl} GHL- en ${tel.w3} Web3Forms-verzoeken (verwacht 1 en 1)`);
    if (tel.conv !== 1) uit.push(`5. ${tel.conv} conversies (verwacht 1)`);
    if (d.kop !== 'Wat nu volgt' || d.stappen !== 3) uit.push(`5. bedankpagina: "${d.kop}" met ${d.stappen} stappen (verwacht "Wat nu volgt" met 3, 7 nov 2026)`);
    if (d.html || d.opslag !== null || d.contact !== null) uit.push(`5. na versturen: is-formvol ${d.html}, bewaarde antwoorden ${d.opslag}, bewaarde contactgegevens ${d.contact}`);
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
    if (Array.isArray(laatste)) await p.evaluate((w) => { const b = document.querySelector(w + ' .kgj-reken__verder'); b.click(); setTimeout(() => b.click(), 40); }, HERO);
    else await p.evaluate((w, l) => {
      const vind = () => [...document.querySelector(w).querySelectorAll('.kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l);
      vind().click(); setTimeout(() => { const b = vind(); if (b) b.click(); }, 40);
    }, HERO, laatste);
    await wacht(300);
    const n = await p.evaluate(() => window.__ev.filter((e) => e[1] === 'aanvraag-laden').length);
    if (n !== 1) uit.push(`6. dubbele tik gaf ${n} laadstappen (verwacht 1)`);
    /* de terugknop van de browser: de pagina gaat weg (zoals op elke site); wie terugkomt, staat op het contactblok */
    await p.goBack({ timeout: 8000 }).catch(() => {});
    await wacht(800);
    const weg = await p.evaluate(() => location.pathname);
    if (weg === pad) uit.push(`6. de terugknop van de browser bleef op de pagina (${weg}): er is nog een eigen geschiedenisregel`);
    await p.goForward({ timeout: 15000, waitUntil: 'networkidle2' }).catch(() => {});
    await p.waitForSelector(HERO + ' form.kgj-reken__contact', { timeout: 8000 }).catch(() => {});
    await wacht(600);
    const t = await info(p);
    if (!t || !t.contact) uit.push(`6. na terugkomen: geen contactblok (${JSON.stringify({ vraag: t && t.vraag, tel: t && t.tel })}); de antwoorden moeten bewaard zijn`);
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
    await wacht(1900);
    const c = await info(p);
    if (!c.contact) { uit.push('7. geen contactblok'); return uit; }
    if (!geenPopup(c)) uit.push(`7. pop-up of venster: ${JSON.stringify({ vast: c.vast, formvol: c.html, dialoog: c.dialoog, sluit: c.sluit, achter: c.achter })}`);
    for (const [naam, r] of [['kop "Contact"', c.ckop], ['naamveld', c.naam], ['telefoonveld', c.telv], ['e-mailveld', c.mail], ['verzendknop', c.knop]]) {
      if (!(r && r.zicht && r.top >= c.balk - 1 && r.bottom <= c.vh)) uit.push(`7. ${naam} niet in beeld zonder zelf te scrollen ${JSON.stringify(r)} (balk ${c.balk}, scherm ${c.vh})`);
    }
    if (c.gratis !== 2 || c.vrij !== 1) uit.push(`7. gratis ${c.gratis}x, vrijblijvend ${c.vrij}x in het contactblok (verwacht 2x en 1x)`);
    if (c.hscroll) uit.push('7. horizontale scroll');
    if (fouten.length) uit.push(`7. JS-fout: ${fouten.slice(0, 2).join(' | ')}`);
    return uit;
  } finally { await ctx.close(); }
}

/* Punt 9 (9 nov 2026): na een tik op een knop "Ik ben op zoek naar" (dak) of vraag 1 (renovatie) een wazige sluier, de kaart scherp in beeld. */
async function focusFlow(br, basis, pad, css = null) {
  const { ctx, p } = await open(br, basis, 390, 664, pad, css ? { css } : {});
  try {
    const hoe = await p.evaluate((w) => {
      const z = [...document.querySelectorAll('.bf-lpzoek__knop')].find((b) => /dakrenovatie/i.test(b.textContent)) || document.querySelector('.bf-lpzoek__knop');
      if (z) { z.scrollIntoView({ block: 'center' }); z.click(); return 'knop ' + z.textContent.replace(/\s+/g, ' ').trim(); }
      const k = document.querySelector(w + ' .kgj-reken__keuze');
      if (!k) return null;
      k.click(); return 'vraag 1 ' + k.textContent.replace(/\s+/g, ' ').trim();
    }, HERO);
    if (!hoe) return ['9. geen knop "Ik ben op zoek naar" en geen keuze in de kaart'];
    await wacht(1400);
    const m = await p.evaluate(() => {
      const s = document.querySelector('.kgj-reken__sluier.is-aan');
      const k = document.querySelector('.kgj-reken.is-focus');
      if (!s || !k) return { s: !!s, k: !!k };
      const cs = getComputedStyle(s);
      const bf = [cs.backdropFilter, cs.webkitBackdropFilter].filter((x) => x && x !== 'none').join(' ');
      const kl = (cs.backgroundColor.match(/[\d.]+/g) || []).map(Number);
      const r = k.getBoundingClientRect();
      const zicht = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      /* 19 nov 2026 (Mohammed: "de terugknop in het form onderaan bij ab is kapot en wit"): de sluier hangt in de wortel van de pagina, niet in een
         sectie met overflow (Safari tekende hem daar in de verkeerde laag), en de kaart ligt erboven (de terugknop of het midden van de kaart is wat een tik raakt). */
      let ov = null; for (let e = s.parentElement; e && !e.classList.contains('bf-lp'); e = e.parentElement) { const c = getComputedStyle(e); if (c.overflow !== 'visible' || c.transform !== 'none' || c.filter !== 'none') { ov = e.className; break; } }
      const t = k.querySelector('.kgj-reken__terug') || k.querySelector('.kgj-reken__vraag'); const tr = t.getBoundingClientRect(); const raak = document.elementFromPoint(tr.left + tr.width / 2, tr.top + tr.height / 2);
      return { s: true, k: true, ov, inWortel: s.parentElement === document.querySelector('.bf.bf-lp'), raakKaart: !!raak && k.contains(raak), bf, kleur: cs.backgroundColor, wit: kl.length >= 3 && kl[0] > 240 && kl[1] > 240 && kl[2] > 240 && (kl[3] ?? 1) > 0.5, dekking: cs.opacity,
        top: Math.round(r.top), zicht: Math.round(zicht), nodig: Math.round(0.5 * Math.min(r.height, innerHeight)), vh: innerHeight };
    });
    const uit = [];
    if (!m.s || !m.k) return [`9. na een tik (${hoe}) geen focusstand (sluier ${m.s}, kaart ${m.k})`];
    if (!/blur\(/.test(m.bf)) uit.push(`9. de sluier is niet wazig (backdrop-filter "${m.bf || 'none'}") na een tik (${hoe})`);
    if (m.wit) uit.push(`9. de sluier is wit (${m.kleur}) na een tik (${hoe})`);
    if (m.dekking !== '1') uit.push(`9. dekking van de sluier ${m.dekking} (verwacht 1: anders vervaagt ook de vervaging)`);
    if (!m.inWortel || m.ov) uit.push(`9. de sluier hangt niet in de wortel van de pagina (voorouder met overflow/transform/filter: ${m.ov})`);
    if (!m.raakKaart) uit.push('9. een tik op de terugknop of de vraag raakt de kaart niet (iets ligt erover)');
    if (m.zicht < m.nodig) uit.push(`9. de kaart staat niet in beeld (${m.zicht} px in beeld, nodig ${m.nodig}; top ${m.top} van ${m.vh})`);
    return uit;
  } finally { await ctx.close(); }
}

/* Punt 8 (dakpagina's, bfbouw.be 5638c50/8343954): "Veelgestelde vragen" direct onder "De voordelen van een dakrenovatie", de vijf
   vragen in die volgorde, alle dicht, de klikbare zin "Vraag dan een gratis offerte aan." brengt de kaart onderaan in beeld. */
const FAQ = ['Wat kost een dakrenovatie?', 'Kan ik een premie krijgen voor mijn dak?', 'Hoe lang duurt een dakrenovatie?', 'Welke garantie geldt er op dakwerken?', 'Moet mijn volledige dak altijd vernieuwd worden?'];
async function faqFlow(br, basis, pad, w, h, plant = null) {
  const uit = [];
  const { ctx, p } = await open(br, basis, w, h, pad);
  try {
    if (plant) await p.evaluate(() => { const d = document.querySelector('#faq details'); if (d) d.open = true; });
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
    if (f.open.join('|') !== 'false|false|false|false|false') uit.push(`8. open/dicht ${f.open.join(', ')} (verwacht alle vragen dicht)`);
    if (f.link !== '#contact' || f.linkTekst !== 'Vraag dan een gratis offerte aan.') uit.push(`8. link "${f.linkTekst}" naar ${f.link}`);
    if (f.link) {
      await p.evaluate(() => { document.querySelector('#faq details').open = true; document.querySelector('#faq a.bf-vraag__link').click(); });
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
  let code = 0, metingen = 0;
  try {
    /* opwarmen: de eerste lading van een koude dev-server houdt de klokken van de pagina op (gemeten 5 nov: 2430 ms i.p.v. 1200) */
    for (const pad of Object.keys(PADEN)) { const { ctx } = await open(br, basis, 390, 664, pad); await ctx.close(); }
    await (async () => { const { ctx, p } = await open(br, basis, 390, 664, '/lp/dakwerken'); await doorloop(p, '/lp/dakwerken', true); await wacht(1500); await ctx.close(); })();

    /* positieve controles */
    const controles = [
      ['laadstap op 0 ms', { laadMs: 0 }, /^1\. laadstap/],
      ['de kaart vast over het scherm (pop-up)', { css: '#rekenaar .kgj-reken--aanvraag.is-contact{position:fixed!important;inset:0!important;z-index:1000!important}' }, /^2\. pop-up/],
      ['een geplante geschiedenisregel bij het contactblok', { push: true }, /^2\. geschiedenis/],
      ['verzendknop 700 px lager', { css: '.kgj-reken__contact .kgj-reken__knop{margin-top:700px!important}' }, /^2\. verzendknop niet in beeld/],
      ['een geplant woord "gratis" en "vrijblijvend" in het blok', { extra: true }, /^3\. "gratis"/],
    ];
    for (const [naam, plant, verwacht] of controles) {
      let r;
      if (plant.extra) {
        const { ctx, p } = await open(br, basis, 390, 664, '/lp/dakwerken');
        await doorloop(p, '/lp/dakwerken', true);
        await wacht(1700);
        await p.evaluate((w) => { const b = document.querySelector(w + ' .kgj-reken__ckop'); if (b) b.append(' Gratis en vrijblijvend'); }, HERO);
        const c = await info(p);
        r = c.gratis !== 2 ? ['3. "gratis" ' + c.gratis + 'x'] : [];
        await ctx.close();
      } else r = await gsmFlow(br, basis, '/lp/dakwerken', plant, 3);
      if (!r.some((x) => verwacht.test(x))) { console.log(`ONGELDIGE METING: positieve controle "${naam}" niet gevangen (${r.join(' | ') || 'geen fout'})`); code = 2; }
      else console.log(`positieve controle: ${naam}: gevangen`);
    }
    {
      const r = await focusFlow(br, basis, '/lp/dakwerken', '.bf.bf-lp .kgj-reken__sluier{background:#fff!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}');
      if (!r.some((x) => /^9\. de sluier is (niet wazig|wit)/.test(x))) { console.log(`ONGELDIGE METING: positieve controle "witte sluier" niet gevangen (${r.join(' | ') || 'geen fout'})`); code = 2; }
      else console.log(`positieve controle: witte sluier: gevangen (${r.join('; ')})`);
    }
    {
      const r = await faqFlow(br, basis, '/lp/dakwerken', 390, 664, 'open');
      if (!r.some((x) => /^8\. open\/dicht/.test(x))) { console.log(`ONGELDIGE METING: positieve controle "eerste vraag open" niet gevangen (${r.join(' | ') || 'geen fout'})`); code = 2; }
      else console.log('positieve controle: eerste vraag open: gevangen');
    }
    /* 8 nov 2026: een return hier sloeg process.exit(2) over (exit 0 bij een ongeldige meting). Een throw komt in de catch. */
    if (code === 2) throw new Error('positieve controle niet gevangen (zie hierboven)');

    for (const pad of ['/lp/dakwerken', '/lp/dakwerken/asbest']) for (const [w, h] of [[390, 664], [1265, 585]]) { for (const f of await faqFlow(br, basis, pad, w, h)) fouten.push(`${pad} @${w}x${h}: ${f}`); metingen++; }
    for (const pad of Object.keys(PADEN)) {
      if (process.env.LP_SPOOR) console.log('meten: ' + pad);
      for (const f of await focusFlow(br, basis, pad)) fouten.push(`${pad} @390x664: ${f}`);
      for (const f of await gsmFlow(br, basis, pad)) fouten.push(`${pad} @390x664: ${f}`);
      for (const f of await terugFlow(br, basis, pad)) fouten.push(`${pad} @390x664: ${f}`);
      for (const [w, h] of [[1265, 585], [1440, 800]]) for (const f of await pcFlow(br, basis, pad, w, h)) fouten.push(`${pad} @${w}x${h}: ${f}`);
      metingen += 5;
    }
  } catch (e) {
    console.log('ONGELDIGE METING: ' + (e && e.message ? e.message : e));
    code = 2;
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (code === 2) process.exit(2);
  if (metingen !== 4 + 4 * 5) { console.log(`ONGELDIGE METING: ${metingen} metingen (verwacht ${4 + 4 * 5})`); process.exit(2); }
  console.log(`check-lp-contact: ${Object.keys(PADEN).length} LP's, laadstap, contactblok in de kaart 390x664, 1265x585 en 1440x800, versturen (nul echte verzoeken) (${basis})`);
  if (fouten.length) { for (const f of fouten) console.log('  FOUT: ' + f); process.exit(1); }
  console.log('  AF: laadstap 1,2 s, contactblok in de kaart zonder pop-up (geen vast scherm, dialoog, sluitknop, achtergrond of geschiedenisregel), kop, velden en verzendknop in beeld, gratis 2x (knop + "Gratis plaatsbezoek") en vrijblijvend 1x in het blok, Terug = laatste vraag, terugknop van de browser verlaat de pagina en terugkomen = contactblok, 1 lead + 1 conversie, bedankpagina "Wat nu volgt", opslag gewist');
  process.exit(0);
})();
