#!/usr/bin/env node
/**
 * check-lp-formulier: de robuustheid van het contactblok van de aanvraagkaart (Aanvraag.tsx), 18 nov 2026 (formulier v2, zoals bfbouw.be
 * audit f5bc8cc/8be9516 en tools/audit.mjs; Mohammed: "die harste fixes dat je had en push").
 * Gemeten op /lp/dakwerken (de kaart bovenaan), zoals een bezoeker; alle verzoeken naar GHL en Web3Forms worden onderschept (nul echte
 * leads), Clarity en Google-tags krijgen een leeg antwoord.
 *   A. telefoonnummers: met spaties, punten, schuine strepen, streepjes, harde spaties, onzichtbare richtingstekens, +32 of 0032 aanvaard;
 *      te kort, rommel en leeg geweigerd, met de melding onder het telefoonveld; er vertrekt niets;
 *   B. een punt achter het e-mailadres gaat weg; een nummer met harde spaties gaat met gewone spaties naar het CRM (payload);
 *   C. Enter in "Uw naam" gaat naar het volgende lege veld (geen melding, niets verstuurd); Enter in het laatste veld verstuurt;
 *   D. versturen: "Bezig…" en de knop werkt niet tijdens het versturen; bij een netwerkfout en bij een 503 gaat de aanvraag vanzelf nog 2
 *      keer (3 pogingen per transport), bij een 400 niet (1 poging), zonder antwoord stopt het wachten na de time-out (testhaak
 *      __abWachtMs); daarna "Versturen lukte niet ..." direct onder de verzendknop, de knop werkt weer, de gegevens staan er nog;
 *   E. getypte naam, telefoon en e-mail blijven bewaard in het tabblad: na herladen staan ze terug in het contactblok;
 *   F. gsm 360x642, 390x664 en 320x568: het contactblok (kop "Contact", velden, verzendknop) in beeld; per veld met het toetsenbord open
 *      (het zichtbare deel 290 px lager): kop, veld en verzendknop in beeld en niet achter de kopbalk; na het sluiten van het toetsenbord
 *      verspringt het veld niet (hoogstens 2 px) en ligt de kopbalk niet over het veld; tekst in de velden minstens 16 px; velden, knop en
 *      "Terug" minstens 44 px hoog.
 * Positieve controles (zonder: exit 2): "0470 12 34" als goed verwacht moet A laten falen; een Enter-blokkade op het naamveld C; een 400
 * waar 3 pogingen verwacht worden D; gewiste opslag vóór herladen E; een verzendknop 400 px lager F (toetsenbord); een scroll van 120 px bij
 * het sluiten van het toetsenbord F (sprong).
 *   G. belknoppen: de knop in de kopbalk blijft tijdens het formulier (18 nov 2026), de ronde knop gaat weg;
 *   H. na elk antwoord en op het contactblok staat de kaart met haar titel onder de vaste kopbalk (1265x585 en 390x664, beide kaarten);
 *   I. "Beide" bij het soort dak: volle-breedte rij zonder icoon in de stijl van "Gratis dakinspectie"; daarna het pad van Hellend dak, ook op
 *      /lp/dakwerken/asbest; in de aanvraag "Dak: Beide (hellend en plat)".
 * Positieve controles 18 nov: kopknop verborgen (G), ronde knop zichtbaar (G), kaart 30 px onder de kopbalk (H), "Beide" met icoon of op halve
 * breedte (I), het pad na Plat dak wijkt af van Hellend dak (I).
 *
 * 23 nov 2026: /lp/dakwerken staat in de opbouw van bfbouw.be (LpBfC.tsx, herkend aan .abc): hero zonder formulier, de enige aanvraagkaart onderaan
 * (#contact > #rekenaar). HERO ('#rekenaar .kgj-reken--aanvraag') wijst daar naar die kaart; A-F en I meten dus de kaart onderaan. Voor die vorm:
 *   A-F beginnen zoals een bezoeker bij de kaart (de kaart onder de kopbalk, zoals na "Offerte aanvragen"); zonder dat tikte de toets een kaart
 *     7.000 px onder het scherm aan en mat F terwijl de zachte scroll van de kaart nog liep (gemeten 23 nov op 390x664: knop 795-849, 250 ms later
 *     609-663, daarna stil op 598-652, in beeld);
 *   G meet de belknop in de kopbalk van die vorm (.abc-kop: "Bel direct" op gsm, het nummer op de computer) en als ronde knop de zwevende
 *     berichtknop rechtsonder (.abc-zweef); de bezoeker staat eerst bij de kaart (zoals na "Offerte aanvragen");
 *   H meet alleen de kaart onderaan (een kaart bovenaan bestaat niet), zoals een bezoeker die naar de kaart scrolde; ook de positieve controle.
 * De geplante fouten van G dragen de selectors van beide vormen. /lp/dakwerken/asbest (I) heeft de oude vorm en blijft zoals hij was.
 *
 * Draaien:  node scripts/check-lp-formulier.cjs            (start zelf een vite dev-server)
 *           LP_BASIS=http://localhost:8080 node scripts/check-lp-formulier.cjs
 * Exit 0 = alles AF, 1 = afwijking, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4437;
const PAD = '/lp/dakwerken';
const HERO = '#rekenaar .kgj-reken--aanvraag';
const ONDER = '.bf-lpinsp__kaartvak .kgj-reken--aanvraag';
/* 23 nov 2026: de vorm van PAD (true = de opbouw van bfbouw.be, LpBfC.tsx); bepaald bij het opwarmen */
let ABC = null;
const NAAR_CONTACT = ['Dakrenovatie', 'Hellend dak', 'Nee']; // 18 nov 2026: geen startvraag
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const MELD = { telFout: 'Dat telefoonnummer lijkt niet volledig. Controleer het even.', telLeeg: 'Vul uw telefoonnummer in. Wij bellen u om een moment af te spreken.', mailLeeg: 'Vul uw e-mailadres in. Daar sturen wij uw offerte naartoe.' };
const GOED = ['0470 12 34 56', '0470123456', '0470.12.34.56', '0470/12.34.56', '0470-12-34-56', '0470\u00a012\u00a034\u00a056', '+32 470 12 34 56', '\u202a+32 470 12 34 56\u202c', '0032 470 12 34 56', '015 12 34 56'];
const FOUT = ['0470 12 34', '........', 'abc', '12345678'];

let br, basis;
async function open({ w = 390, h = 664, antwoord = null, voorLaden = null, pad = PAD } = {}) {
  const ctx = await br.createBrowserContext();
  const p = await ctx.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 1000, hasTouch: w < 1000 });
  const log = { ghl: [], w3: [], fouten: [] };
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (/^(tel|mailto):/.test(u)) return r.abort();
    if (/leadconnectorhq\.com|web3forms\.com|gohighlevel|msgsndr/.test(u)) {
      const cors = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' };
      if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: cors, body: '' });
      let body = r.postData(); try { body = JSON.parse(body); } catch { /* */ }
      (u.includes('web3forms') ? log.w3 : log.ghl).push(body);
      const a = antwoord || 200;
      if (a === 'hangt') return; // geen antwoord: de time-out moet het oplossen
      /* 600 ms vertraging, zoals een echte verbinding: anders is de bezig-stand voorbij vóór de toets kijkt */
      setTimeout(() => { if (a === 'netwerk') r.abort('failed').catch(() => {}); else r.respond({ status: a, contentType: 'application/json', headers: cors, body: '{}' }).catch(() => {}); }, antwoord ? 600 : 0);
      return;
    }
    if (/clarity\.ms|googletagmanager|google-analytics|doubleclick|googleadservices|googlesyndication/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
    if (/\/api\//.test(u)) return r.respond({ status: 200, contentType: 'application/json', body: '{}' });
    if (!/^(127\.0\.0\.1|localhost)$/.test(new URL(u).hostname) && r.method() !== 'GET') return r.abort();
    return r.continue();
  });
  p.on('pageerror', (e) => log.fouten.push(String(e.message || e)));
  await p.evaluateOnNewDocument(() => {
    window.__abLaadMs = 0; window.__abVolUit = true; window.__ev = []; window.clarity = function () { window.__ev.push(Array.from(arguments)); };
    try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: true, ts: Date.now() })); } catch (e) { /* */ }
  });
  if (voorLaden) await p.evaluateOnNewDocument(voorLaden);
  await p.goto(basis + pad, { waitUntil: 'networkidle2', timeout: 60000 });
  await p.waitForSelector(HERO + ' .kgj-reken__keuze', { timeout: 20000 });
  await wacht(300);
  return { p, ctx, log };
}
async function naarContact(p) {
  /* 23 nov 2026, vorm .abc: de enige kaart staat onderaan; de bezoeker staat er eerst bij (zoals na "Offerte aanvragen"). Zonder dat tikte de toets een
     kaart 7.000 px onder het scherm aan en liep de zachte scroll van de kaart nog bij het meten (F: verzendknop tot 745 px op 390x664). */
  if (ABC) { await p.evaluate((s) => window.scrollTo({ top: document.querySelector(s).getBoundingClientRect().top + scrollY - document.querySelector('.kgj-kop').getBoundingClientRect().bottom - 8, behavior: 'instant' }), ONDER); await wacht(300); }
  for (const l of NAAR_CONTACT) {
    const ok = await p.evaluate((w, l) => { const b = [...document.querySelectorAll(w + ' .kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l); b?.click(); return !!b; }, HERO, l);
    if (!ok) throw new Error(`keuze "${l}" niet gevonden`);
    await wacht(280);
  }
  await p.waitForSelector(HERO + ' form.kgj-reken__contact', { timeout: 5000 });
  await wacht(500);
}
/* een waarde zetten zoals de automatische invulling dat doet (ook onzichtbare tekens), met een input-event voor React */
const zetVeld = (p, naam, waarde) => p.evaluate((w, n, v) => {
  const i = document.querySelector(`${w} input[name="${n}"]`);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, v);
  i.dispatchEvent(new Event('input', { bubbles: true }));
}, HERO, naam, waarde);
const verstuur = (p) => p.evaluate((w) => document.querySelector(w + ' .kgj-reken__knop').click(), HERO);
const meldingen = (p) => p.evaluate((w) => Object.fromEntries([...document.querySelectorAll(w + ' .kgj-reken__veldfout')].map((m) => [m.closest('.kgj-reken__cveld').querySelector('input').name, m.textContent.trim()])), HERO);

/* A. nummers; verwacht = lijst van [nummer, true = aanvaard] */
async function nummersFouten(verwacht) {
  const uit = [];
  const { p, ctx, log } = await open();
  try {
    await naarContact(p);
    await zetVeld(p, 'naam', 'Test');
    for (const [nr, goed] of verwacht) {
      await zetVeld(p, 'telefoon', nr); await zetVeld(p, 'email', '');
      await verstuur(p); await wacht(250);
      const m = await meldingen(p);
      if (goed && m.telefoon) uit.push(`A. "${JSON.stringify(nr).slice(1, -1)}" geweigerd ("${m.telefoon}"), verwacht aanvaard`);
      if (goed && m.email !== MELD.mailLeeg) uit.push(`A. "${nr}": geen e-mailmelding (${JSON.stringify(m)}) (de toets steunt daarop: er mag niets vertrekken)`);
      if (!goed && m.telefoon !== (nr ? MELD.telFout : MELD.telLeeg)) uit.push(`A. "${JSON.stringify(nr).slice(1, -1)}" aanvaard of verkeerde melding ("${m.telefoon || ''}"), verwacht geweigerd`);
    }
    if (log.ghl.length || log.w3.length) uit.push(`A. er vertrokken ${log.ghl.length} GHL- en ${log.w3.length} Web3Forms-verzoeken`);
    return uit;
  } finally { await ctx.close(); }
}
/* B. payload: punt achter het e-mailadres weg, harde spaties in het nummer worden gewone spaties */
async function payloadFouten() {
  const uit = [];
  const { p, ctx, log } = await open();
  try {
    await naarContact(p);
    await zetVeld(p, 'naam', 'Test Kaart'); await zetVeld(p, 'telefoon', '0470\u00a012\u00a034\u00a056'); await zetVeld(p, 'email', 'test@kaart.be.');
    await verstuur(p);
    await p.waitForFunction(() => location.pathname.startsWith('/bedankt'), { timeout: 10000 }).catch(() => {});
    const g = log.ghl[0] || {};
    if (log.ghl.length !== 1 || log.w3.length !== 1) uit.push(`B. ${log.ghl.length} GHL- en ${log.w3.length} Web3Forms-verzoeken (verwacht 1 en 1)`);
    if (g.email !== 'test@kaart.be') uit.push(`B. e-mail in de aanvraag "${g.email}" (verwacht "test@kaart.be": de punt achteraan weg)`);
    if (g.phone !== '0470 12 34 56') uit.push(`B. telefoon in de aanvraag ${JSON.stringify(g.phone)} (verwacht "0470 12 34 56")`);
    if (g.firstName !== 'Test' || g.lastName !== 'Kaart') uit.push(`B. naam in de aanvraag ${g.firstName} / ${g.lastName} (verwacht Test / Kaart)`);
    return uit;
  } finally { await ctx.close(); }
}
/* C. Enter */
async function enterFouten(blokkeer = false) {
  const uit = [];
  const { p, ctx, log } = await open();
  try {
    await naarContact(p);
    if (blokkeer) await p.evaluate((w) => document.querySelector(w + ' input[name=naam]').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); } }, true), HERO);
    await p.focus(`${HERO} input[name=naam]`);
    await p.keyboard.type('Jan');
    await p.keyboard.press('Enter'); await wacht(250);
    const na1 = await p.evaluate(() => document.activeElement?.name || document.activeElement?.tagName);
    const m1 = await meldingen(p);
    if (na1 !== 'telefoon') uit.push(`C. Enter in "Uw naam" bracht de cursor naar "${na1}" (verwacht telefoon)`);
    if (Object.keys(m1).length) uit.push(`C. Enter in "Uw naam" gaf meldingen ${JSON.stringify(m1)} (verwacht geen: niets verstuurd)`);
    await p.keyboard.type('0470 12 34 56'); await p.keyboard.press('Enter'); await wacht(250);
    const na2 = await p.evaluate(() => document.activeElement?.name);
    if (na2 !== 'email') uit.push(`C. Enter in "Telefoonnummer" bracht de cursor naar "${na2}" (verwacht email)`);
    await p.keyboard.type('fout'); await p.keyboard.press('Enter'); await wacht(300);
    const m3 = await meldingen(p);
    if (!m3.email) uit.push(`C. Enter in het laatste veld verstuurde niet (geen e-mailmelding: ${JSON.stringify(m3)})`);
    if (log.ghl.length || log.w3.length) uit.push(`C. er vertrok een verzoek met een fout e-mailadres`);
    return uit;
  } finally { await ctx.close(); }
}
/* D. versturen met een storing; verwacht = aantal pogingen per transport */
async function storingFouten(antwoord, verwacht, wachtMs = null) {
  const uit = [];
  const { p, ctx, log } = await open({ antwoord, voorLaden: wachtMs ? new Function(`window.__abWachtMs = ${wachtMs};`) : null });
  try {
    await naarContact(p);
    await zetVeld(p, 'naam', 'Test Kaart'); await zetVeld(p, 'telefoon', '0470 12 34 56'); await zetVeld(p, 'email', 'test@kaart.be');
    await verstuur(p); await wacht(150);
    const bezig = await p.evaluate((w) => { const b = document.querySelector(w + ' .kgj-reken__knop'); return { uit: b.disabled, tekst: b.textContent.trim() }; }, HERO);
    if (!bezig.uit || bezig.tekst !== 'Bezig…') uit.push(`D(${antwoord}). tijdens het versturen: knop ${JSON.stringify(bezig)} (verwacht uitgeschakeld met "Bezig…")`);
    await verstuur(p); // een tweede tik tijdens het versturen telt niet
    await p.waitForSelector(HERO + ' .kgj-reken__fout', { timeout: 20000 }).catch(() => {});
    await wacht(antwoord === 'hangt' ? 300 : 4500); // na de laatste poging: geen verzoek meer
    const r = await p.evaluate((w) => {
      const k = document.querySelector(w), b = k.querySelector('.kgj-reken__knop'), f = k.querySelector('.kgj-reken__fout');
      const br_ = b.getBoundingClientRect(), fr = f?.getBoundingClientRect();
      return { pad: location.pathname, fout: f?.textContent.trim() || null, onder: fr ? Math.round(fr.top - br_.bottom) : null, knop: !b.disabled, tekst: b.textContent.trim(),
        velden: ['naam', 'telefoon', 'email'].map((n) => k.querySelector(`input[name=${n}]`)?.value) };
    }, HERO);
    if (log.ghl.length !== verwacht || log.w3.length !== verwacht) uit.push(`D(${antwoord}). ${log.ghl.length} GHL- en ${log.w3.length} Web3Forms-pogingen (verwacht ${verwacht} en ${verwacht})`);
    if (!r.fout || !/^Versturen lukte niet\. Bel gerust 0\d/.test(r.fout)) uit.push(`D(${antwoord}). melding "${r.fout}" (verwacht "Versturen lukte niet. Bel gerust ...")`);
    if (r.onder === null || r.onder < 0 || r.onder > 24) uit.push(`D(${antwoord}). de melding staat niet direct onder de verzendknop (${r.onder} px eronder)`);
    if (!r.knop || r.tekst === 'Bezig…') uit.push(`D(${antwoord}). de knop werkt niet weer (${r.tekst})`);
    if (r.velden.join('|') !== 'Test Kaart|0470 12 34 56|test@kaart.be') uit.push(`D(${antwoord}). de gegevens zijn weg (${r.velden.join(' | ')})`);
    if (r.pad !== PAD) uit.push(`D(${antwoord}). de pagina ging naar ${r.pad}`);
    return uit;
  } finally { await ctx.close(); }
}
/* E. bewaren in het tabblad */
async function bewaarFouten(wis = false) {
  const uit = [];
  const { p, ctx } = await open();
  try {
    await naarContact(p);
    await zetVeld(p, 'naam', 'Jan Peeters'); await zetVeld(p, 'telefoon', '0470 12 34 56'); await zetVeld(p, 'email', 'jan@voorbeeld.be');
    await wacht(200);
    if (wis) await p.evaluate(() => sessionStorage.removeItem('ab_contact'));
    await p.reload({ waitUntil: 'networkidle2' });
    await p.waitForSelector(HERO + ' form.kgj-reken__contact', { timeout: 8000 }).catch(() => {});
    await wacht(500);
    const v = await p.evaluate((w) => ['naam', 'telefoon', 'email'].map((n) => document.querySelector(`${w} input[name=${n}]`)?.value ?? '(geen veld)'), HERO);
    if (v.join('|') !== 'Jan Peeters|0470 12 34 56|jan@voorbeeld.be') uit.push(`E. na herladen: ${v.join(' | ')} (verwacht de getypte gegevens terug)`);
    return uit;
  } finally { await ctx.close(); }
}
/* F. gsm en toetsenbord; plant = { css, sprong } */
async function gsmFouten(w, h, plant = {}) {
  const uit = [];
  const { p, ctx } = await open({ w, h });
  try {
    await naarContact(p);
    if (plant.css) await p.addStyleTag({ content: plant.css });
    if (plant.sprong) await p.evaluate(() => { let v = visualViewport.height; visualViewport.addEventListener('resize', () => { if (visualViewport.height > v + 100) scrollBy(0, 120); v = visualViewport.height; }); });
    const maat = (veld) => p.evaluate((w, veld) => {
      const k = document.querySelector(w), r = (s) => { const e = k.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) }; };
      const kop = document.querySelector('.kgj-kop'), kcs = kop && getComputedStyle(kop);
      const balk = kop && kcs.position === 'fixed' && kcs.visibility !== 'hidden' ? Math.round(kop.getBoundingClientRect().bottom) : 0;
      const vv = window.visualViewport;
      return { balk, top: vv ? Math.round(vv.offsetTop) : 0, hoog: Math.round(vv ? vv.height : innerHeight), ckop: r('.kgj-reken__ckop'), knop: r('.kgj-reken__knop'), veld: veld ? r(`input[name=${veld}]`) : null,
        velden: ['naam', 'telefoon', 'email'].map((n) => r(`input[name=${n}]`)), letter: Math.min(...[...k.querySelectorAll('.kgj-reken__contact input')].map((i) => parseFloat(getComputedStyle(i).fontSize))),
        terug: r('.kgj-reken__terug'), nastap: r('.kgj-reken__nastap'),
        /* 18 nov 2026 (Mohammed: "niet 1 2 3 zo, meer stappen, zoals kijzer het heeft"): stappenblok, licht grijs vlak, cirkels met alleen een rand */
        kort: (() => { const o = k.querySelector('.kgj-reken__nastap'); if (!o) return null; const ocs = getComputedStyle(o), li = o.querySelector('.kgj-reken__nakort li'), cs = li && getComputedStyle(li), voor = li && getComputedStyle(li, '::before');
          return { kop: o.querySelector('.kgj-reken__nastap-kop')?.textContent.trim(), titels: [...o.querySelectorAll('.kgj-reken__nakort li > b')].map((l) => l.textContent.trim()), uitleg: [...o.querySelectorAll('.kgj-reken__nakort li > span')].map((l) => l.textContent.trim()),
            px: li ? parseFloat(getComputedStyle(li.querySelector('b')).fontSize) : 0, gewicht: li ? getComputedStyle(li.querySelector('b')).fontWeight : '', upx: li && li.querySelector('span') ? parseFloat(getComputedStyle(li.querySelector('span')).fontSize) : 0,
            ucontrast: (() => { const sp = li && li.querySelector('span'); if (!sp) return 0; const lum = (k) => { const v = (k.match(/[0-9.]+/g) || []).map(Number).slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; }; const a = lum(getComputedStyle(sp).color), b = lum(ocs.backgroundColor); return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 10) / 10; })(),
            vlak: ocs.backgroundColor, schaduw: ocs.boxShadow, rand: voor ? parseFloat(voor.borderTopWidth) : 0, cirkel: voor ? voor.backgroundColor : '', cirkelB: voor ? Math.round(parseFloat(voor.width)) : 0 }; })() };
    }, HERO, veld);
    const inBeeld = (m, r) => r && r.top >= Math.max(m.balk, m.top) - 1 && r.bottom <= m.top + m.hoog + 1;
    /* zonder toetsenbord */
    const m0 = await maat(null);
    for (const [naam, r] of [['kop "Contact"', m0.ckop], ['naamveld', m0.velden[0]], ['telefoonveld', m0.velden[1]], ['e-mailveld', m0.velden[2]], ['verzendknop', m0.knop]]) if (!inBeeld(m0, r)) uit.push(`F ${w}x${h}. ${naam} niet in beeld zonder toetsenbord ${JSON.stringify(r)} (balk ${m0.balk}, zichtbaar ${m0.hoog})`);
    /* "Na uw aanvraag" kort (18 nov 2026, Mohammed: "ook kort van wat erna gebeurt"): de drie titels van AB, direct onder de knop, in beeld, 15 px, contrast >= 4,5, geen vlak of kader */
    if (!m0.kort || m0.kort.kop !== 'Na uw aanvraag' || m0.kort.titels.join('|') !== 'We nemen binnen 24 uur contact op|Gratis plaatsbezoek met onze dakexpert|Je ontvangt je offerte in je mailbox' /* 19 nov 2026: drie stappen */) uit.push(`F ${w}x${h}. stappenblok "Na uw aanvraag" onder de knop ontbreekt of andere tekst (${JSON.stringify(m0.kort)})`);
    else if (w < 340) {
      /* 19 nov 2026: onder 340 px is het blok één dichte uitklapregel direct onder de knop (vorm en gedrag: check-lp-smal.cjs) */
      if (!m0.nastap || m0.nastap.top < m0.knop.bottom || m0.nastap.top - m0.knop.bottom > 24) uit.push(`F ${w}x${h}. uitklapregel "Na uw aanvraag" niet direct onder de knop (${JSON.stringify(m0.nastap)}, knop tot ${m0.knop.bottom})`);
    } else {
      /* het blok begint direct onder de knop; op de gsm mag het onder het scherm doorlopen (kop, velden en knop staan hierboven al in beeld) */
      if (!m0.nastap || m0.nastap.top < m0.knop.bottom || m0.nastap.top - m0.knop.bottom > 24) uit.push(`F ${w}x${h}. stappenblok niet direct onder de knop (${JSON.stringify(m0.nastap)}, knop tot ${m0.knop.bottom})`);
      if (m0.kort.vlak !== 'rgb(242, 242, 242)' || m0.kort.schaduw !== 'none') uit.push(`F ${w}x${h}. stappenblok: vlak ${m0.kort.vlak}, schaduw ${m0.kort.schaduw} (verwacht licht grijs #f2f2f2 zonder schaduw)`);
      if (m0.kort.px !== 16 || m0.kort.gewicht !== '700') uit.push(`F ${w}x${h}. stappenblok: titel ${m0.kort.px} px / ${m0.kort.gewicht} (verwacht 16 px vet)`);
      /* 18 nov 2026 (Mohammed: "doe dat zoals kijzer, zo hoe dat wordt uitgelegd"): één uitlegzin per stap, woordelijk, 15-16 px, contrast >= 4,5 */
      if (m0.kort.uitleg.join('|') !== 'We overlopen je aanvraag en spreken een plaatsbezoek af op een moment dat jou past.|Onze dakexpert bekijkt je dak ter plaatse en bespreekt met jou de mogelijkheden.|Vrijblijvend: je beslist zelf, zonder enige verplichting.' || /* 19 nov 2026: drie stappen (was vijf, Kijzer 18 nov) */ m0.kort.upx < 15 || m0.kort.upx > 16 || m0.kort.ucontrast < 4.5) uit.push(`F ${w}x${h}. stappenblok: uitleg ${JSON.stringify({ uitleg: m0.kort.uitleg, px: m0.kort.upx, contrast: m0.kort.ucontrast })} (verwacht de drie gedicteerde zinnen, 15-16 px, contrast >= 4,5)`);
      if (m0.kort.rand < 1 || !/^rgba\(0, 0, 0, 0\)$|^transparent$/.test(m0.kort.cirkel) || m0.kort.cirkelB < 36 || m0.kort.cirkelB > 40) uit.push(`F ${w}x${h}. stappenblok: gevulde cirkel of geen rand (${JSON.stringify(m0.kort)}) (verwacht een cirkel van 36-40 px met alleen een rand)`);
    }
    if (m0.letter < 16) uit.push(`F ${w}x${h}. tekst in de velden ${m0.letter} px (minstens 16)`);
    for (const [naam, r] of [['naamveld', m0.velden[0]], ['telefoonveld', m0.velden[1]], ['e-mailveld', m0.velden[2]], ['verzendknop', m0.knop], ['Terug', m0.terug]]) if (!r || r.h < 44) uit.push(`F ${w}x${h}. ${naam} ${r ? r.h : '?'} px hoog (minstens 44)`);
    /* per veld met het toetsenbord open */
    for (const veld of ['naam', 'telefoon', 'email']) {
      await p.focus(`${HERO} input[name=${veld}]`);
      await p.setViewport({ width: w, height: h - 290, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      await wacht(500);
      const m = await maat(veld);
      for (const [naam, r] of [['kop "Contact"', m.ckop], [`veld ${veld}`, m.veld], ['verzendknop', m.knop]]) if (!inBeeld(m, r)) uit.push(`F ${w}x${h} toetsenbord open in ${veld}. ${naam} niet in beeld ${JSON.stringify(r)} (balk ${m.balk}, zichtbaar ${m.top}-${m.top + m.hoog})`);
      await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      await wacht(500);
      const n = await maat(veld);
      if (Math.abs(n.veld.top - m.veld.top) > 2) uit.push(`F ${w}x${h}. sprong bij het sluiten van het toetsenbord in ${veld}: veld van ${m.veld.top} naar ${n.veld.top} px`);
      if (n.balk > n.veld.top) uit.push(`F ${w}x${h}. na het sluiten van het toetsenbord ligt de kopbalk (tot ${n.balk} px) over het veld ${veld} (${n.veld.top} px)`);
      await p.evaluate(() => document.activeElement?.blur());
    }
    return uit;
  } finally { await ctx.close(); }
}

/* G. belknoppen (18 nov 2026, Mohammed: "de bel directjes ctas moeten weg wanneer hij daar is ofzo"): vóór het eerste antwoord zichtbaar, vanaf
   het eerste antwoord weg zolang de kaart in beeld is, terug als de kaart volledig uit beeld is, weg op het contactblok, terug na versturen.
   Sinds 18 nov ("bij het form invullen zijn de andere forms zo wit … bij belknop") geldt dat alleen voor de ronde belknop: de knop in de kopbalk blijft.
   De kopbalk verspringt niet (zelfde hoogte en plaats van het logo). */
async function belFouten(w, h, css = null) {
  const uit = [];
  const { p, ctx } = await open({ w, h });
  try {
    if (css) await p.addStyleTag({ content: css });
    /* 23 nov 2026, vorm .abc (LpBfC): de belknop in de kopbalk is "Bel direct" (gsm en tablet) of het nummer (computer), elk een tel:-link in .abc-kop;
       de ronde knop rechtsonder is de zwevende berichtknop .abc-zweef */
    const bel = () => p.evaluate(() => {
      const zicht = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && Number(getComputedStyle(e).opacity) > 0.1;
      const abc = !!document.querySelector('.abc');
      const kop = abc ? document.querySelector(innerWidth <= 1000 ? '.abc-kop a.abc-kop__bel[href^="tel:"]' : '.abc-kop a.abc-kop__tel[href^="tel:"]') : document.querySelector('.bf-kop a.bf-lpbel[href^="tel:"]');
      const zweef = document.querySelector(abc ? '.abc-zweef' : '.bf-belzweef');
      const balk = document.querySelector('.kgj-kop')?.getBoundingClientRect();
      return { kop: zicht(kop), zweef: zicht(zweef), balkH: Math.round(balk?.height ?? -1), formulier: document.documentElement.classList.contains('is-informulier') };
    });
    /* vorm .abc: de enige kaart staat onderaan; de bezoeker staat er eerst bij (zoals na "Offerte aanvragen"), anders begint de toets met een tik op een
       kaart buiten beeld */
    if (ABC) await p.evaluate((s) => window.scrollTo({ top: document.querySelector(s).getBoundingClientRect().top + scrollY - document.querySelector('.kgj-kop').getBoundingClientRect().bottom - 8, behavior: 'instant' }), ONDER);
    await wacht(400);
    const b0 = await bel();
    if (!b0.kop) uit.push(`G ${w}x${h}. vóór het eerste antwoord is de belknop in de kopbalk niet zichtbaar`);
    await p.evaluate((w) => [...document.querySelectorAll(w + ' .kgj-reken__keuze')][0].click(), HERO);
    await wacht(500);
    const b1 = await bel();
    /* 18 nov 2026 (Mohammed: "bij het form invullen zijn de andere forms zo wit … bij belknop"): de belknop in de kopbalk BLIJFT tijdens het formulier
       (zonder knop was de kopbalk na de scroll een lege witte balk); alleen de ronde belknop gaat weg */
    if (!b1.kop) uit.push(`G ${w}x${h}. na het eerste antwoord is de belknop in de kopbalk niet zichtbaar (${JSON.stringify(b1)})`);
    if (b1.zweef) uit.push(`G ${w}x${h}. na het eerste antwoord met de kaart in beeld staat er nog een ronde belknop (${JSON.stringify(b1)})`);
    if (b1.balkH !== b0.balkH) uit.push(`G ${w}x${h}. de kopbalk verspringt (${b0.balkH} -> ${b1.balkH} px)`);
    await p.evaluate(() => { const k = document.querySelector('#rekenaar .kgj-reken--aanvraag'), o = document.querySelector('#contact .kgj-reken--aanvraag'); const r = k.getBoundingClientRect(); scrollTo(0, scrollY + r.bottom + 40); if (o && o.getBoundingClientRect().top < innerHeight) scrollTo(0, scrollY + 10); });
    await wacht(700);
    const b2 = await bel();
    if (!b2.kop) uit.push(`G ${w}x${h}. met de kaart volledig uit beeld is de belknop niet terug (${JSON.stringify(b2)})`);
    /* terug naar de kaart: bovenaan de pagina (oude vorm, kaart in de hero) of terug bij de kaart onderaan (vorm .abc) */
    if (ABC) await p.evaluate((s) => window.scrollTo({ top: document.querySelector(s).getBoundingClientRect().top + scrollY - document.querySelector('.kgj-kop').getBoundingClientRect().bottom - 8, behavior: 'instant' }), ONDER);
    else await p.evaluate(() => scrollTo(0, 0));
    await wacht(400);
    for (const l of NAAR_CONTACT.slice(1)) { await p.evaluate((w, l) => { const b = [...document.querySelectorAll(w + ' .kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l); b?.click(); }, HERO, l); await wacht(300); }
    await p.waitForSelector(HERO + ' form.kgj-reken__contact', { timeout: 5000 }).catch(() => {});
    await wacht(900);
    const b3 = await bel();
    if (!b3.kop) uit.push(`G ${w}x${h}. op het contactblok is de belknop in de kopbalk niet zichtbaar (${JSON.stringify(b3)})`);
    if (b3.zweef) uit.push(`G ${w}x${h}. op het contactblok staat een ronde belknop in beeld (${JSON.stringify(b3)})`);
    await zetVeld(p, 'naam', 'Test Kaart'); await zetVeld(p, 'telefoon', '0470 12 34 56'); await zetVeld(p, 'email', 'test@kaart.be');
    await verstuur(p);
    await p.waitForFunction(() => location.pathname.startsWith('/bedankt'), { timeout: 10000 }).catch(() => {});
    await wacht(500);
    const b4 = await p.evaluate(() => ({ pad: location.pathname, formulier: document.documentElement.classList.contains('is-informulier') }));
    if (!b4.pad.startsWith('/bedankt') || b4.formulier) uit.push(`G ${w}x${h}. na versturen: ${JSON.stringify(b4)} (verwacht de bedankpagina zonder is-informulier)`);
    return uit;
  } finally { await ctx.close(); }
}

/* H. kaart onder de kopbalk (18 nov 2026, Mohammed: "bij het form invullen zijn de andere forms zo wit"; gemeten op bfbouw.be 1265x585: na het eerste
   antwoord lag de witte kopbalk over de kaarttitel "Gratis offerte aanvragen"): na elk antwoord en op het contactblok staan de bovenrand van de kaart en
   de titel onder de kopbalk. Zonder testhaken (focusstand en laadstap zoals een echte bezoeker), beide kaarten. schuif = positieve controle: de kaart
   30 px onder de kopbalk geschoven. */
async function kaartKopFouten(w, h, schuif = false) {
  const uit = [];
  /* elke kaart in een eigen pagina: de twee kaarten delen hun stap (na de kaart bovenaan staat ook die onderaan op het contactblok) */
  /* 23 nov 2026, vorm .abc (LpBfC): alleen de kaart onderaan bestaat; die wordt gemeten zoals hieronder voor de kaart onderaan (eerst tot 200 px boven de
     kaart gescrold), ook voor de positieve controle */
  for (const sel of ABC ? [ONDER] : schuif ? [HERO] : [HERO, ONDER]) {
    const { p, ctx } = await open({ w, h, voorLaden: () => { delete window.__abLaadMs; delete window.__abVolUit; } });
    try {
      if (sel !== HERO) { await p.evaluate((s) => window.scrollTo({ top: document.querySelector(s).getBoundingClientRect().top + scrollY - 200, behavior: 'instant' }), sel); await wacht(600); }
      const meet = () => p.evaluate((s) => { const k = document.querySelector(s); return { stap: (k.querySelector('.kgj-reken__kop')?.textContent || '').replace(/\s*(‹\s*)?Terug.*$/, ''), kop: Math.round(document.querySelector('.kgj-kop').getBoundingClientRect().bottom), kaart: Math.round(k.getBoundingClientRect().top), titel: Math.round(k.querySelector('.kgj-reken__hoofd').getBoundingClientRect().top) }; }, sel);
      const rij = [];
      for (const l of NAAR_CONTACT) {
        const ok = await p.evaluate((s, l) => { const b = [...document.querySelectorAll(s + ' .kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l); b?.click(); return !!b; }, sel, l);
        if (!ok) throw new Error(`H: keuze "${l}" niet gevonden`);
        await wacht(1600); rij.push({ na: l, ...(await meet()) });
      }
      await wacht(1600); rij.push({ na: 'contactblok', ...(await meet()) });
      if (schuif) { await p.evaluate((s) => window.scrollBy({ top: document.querySelector(s).getBoundingClientRect().top - document.querySelector('.kgj-kop').getBoundingClientRect().bottom + 30, behavior: 'instant' }), sel); await wacht(300); rij.push({ na: 'geschoven', ...(await meet()) }); }
      const slecht = rij.filter((m) => m.kaart < m.kop || m.titel < m.kop);
      if (slecht.length) uit.push(`H ${w}x${h} ${sel === HERO ? 'kaart bovenaan' : ABC ? 'kaart onderaan (de enige kaart)' : 'kaart onderaan'}. de kaart of haar titel ligt onder de kopbalk: ${JSON.stringify(slecht)}`);
      if (rij[rij.length - (schuif ? 2 : 1)].stap !== '') uit.push(`H ${w}x${h}. het contactblok (geen eigen stap: lege teller; 18 nov 2026) werd niet bereikt: ${JSON.stringify(rij)}`);
    } finally { await ctx.close(); }
  }
  return uit;
}

/* I. "Beide" bij "Om welk soort dak gaat het?" (18 nov 2026, Mohammed): een volle-breedte rij onder de twee fototegels, zelfde rand, afronding en tekst
   als de rij "Gratis dakinspectie", zonder icoon, even hoog als die rij; daarna exact het pad van Hellend dak (elk werk, ook op /lp/dakwerken/asbest); in de
   aanvraag "Dak: Beide (hellend en plat)". plant = positieve controle: 'icoon' (een icoon in de rij) of 'half' (halve breedte). */
const BEIDE = 'Beide (hellend en plat)';
async function beideVormFouten(w, h, pad = PAD, plant = null) {
  const uit = [];
  const { p, ctx } = await open({ w, h, pad });
  try {
    const ref = await p.evaluate((s) => { const b = [...document.querySelectorAll(s + ' .kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === 'Gratis dakinspectie'), cs = getComputedStyle(b), st = getComputedStyle(b.querySelector('strong')); return { h: Math.round(b.getBoundingClientRect().height), radius: cs.borderTopLeftRadius, rand: cs.boxShadow, fs: st.fontSize, fw: st.fontWeight, kleur: st.color }; }, HERO);
    await p.evaluate((s) => { const b = [...document.querySelectorAll(s + ' .kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === 'Dakrenovatie'); b.click(); }, HERO); await wacht(500);
    if (plant === 'icoon') await p.evaluate((s) => { const b = [...document.querySelectorAll(s + ' .kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === 'Beide / combinatie'); b?.insertAdjacentHTML('afterbegin', '<i class="kgj-reken__icoon"><svg viewBox="0 0 24 24"></svg></i>'); }, HERO);
    if (plant === 'half') await p.addStyleTag({ content: '.bf.bf-lp .kgj-reken--aanvraag .kgj-reken__keuze--breed{grid-column:auto!important}' });
    await wacht(150);
    const v = await p.evaluate((s) => { const k = document.querySelector(s), knoppen = [...k.querySelectorAll('.kgj-reken__stap .kgj-reken__keuze')], r = (e) => e.getBoundingClientRect();
      const b = knoppen.find((x) => (x.querySelector('strong')?.textContent || '').trim() === 'Beide / combinatie'), tg = knoppen.filter((x) => x.querySelector('.kgj-reken__foto'));
      if (!b) return { b: false, labels: knoppen.map((x) => x.textContent.trim()) };
      const cs = getComputedStyle(b), st = getComputedStyle(b.querySelector('strong')), rs = r(b.parentElement);
      return { b: true, vraag: k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.textContent, labels: knoppen.map((x) => (x.querySelector('strong')?.textContent || '').trim()), waarde: b.getAttribute('data-waarde'), icoon: b.querySelectorAll('svg, img, .kgj-reken__icoon').length,
        laatste: knoppen[knoppen.length - 1] === b, breed: Math.round(r(b).width), rasterB: Math.round(rs.width), onderTegels: tg.length === 2 && tg.every((x) => r(b).top >= r(x).bottom), h: Math.round(r(b).height), radius: cs.borderTopLeftRadius, rand: cs.boxShadow, fs: st.fontSize, fw: st.fontWeight, kleur: st.color }; }, HERO);
    const ok = v.b && v.vraag === 'Om welk soort dak gaat het?' && v.labels.join('|') === 'Hellend dak|Plat dak|Beide / combinatie' && v.waarde === BEIDE && v.icoon === 0 && v.laatste && Math.abs(v.breed - v.rasterB) <= 1 && v.onderTegels && Math.abs(v.h - ref.h) <= 1 && v.h >= 44
      && v.radius === ref.radius && v.rand === ref.rand && v.fs === ref.fs && v.fw === ref.fw && v.kleur === ref.kleur;
    if (!ok) uit.push(`I ${w}x${h} ${pad}. "Beide" niet als volle-breedte rij zonder icoon in de stijl van "Gratis dakinspectie": ${JSON.stringify({ v, ref })}`);
    return uit;
  } finally { await ctx.close(); }
}
/* het pad (vragen + keuzes) na het soort dak, en de aanvraagtekst die naar GHL gaat */
async function padNa(pad, werk, dak) {
  const { p, ctx, log } = await open({ pad });
  try {
    const kies = (l) => p.evaluate((s, l) => { const b = [...document.querySelectorAll(s + ' .kgj-reken__stap .kgj-reken__keuze')].find((x) => (x.querySelector('strong')?.textContent || '').trim() === l); b?.click(); return !!b; }, HERO, l);
    if (!(await kies(werk))) throw new Error(`I: keuze "${werk}" niet gevonden op ${pad}`); await wacht(400);
    if (!(await kies(dak))) throw new Error(`I: keuze "${dak}" niet gevonden op ${pad}`); await wacht(400);
    const rij = [];
    for (let i = 0; i < 6; i++) {
      if (await p.$(HERO + ' form.kgj-reken__contact')) break;
      const s = await p.evaluate((s) => { const st = document.querySelector(s + ' .kgj-reken__stap'); return st ? { vraag: st.querySelector('.kgj-reken__vraag')?.textContent || '', keuzes: [...st.querySelectorAll('.kgj-reken__keuze strong')].map((x) => x.textContent.trim()) } : null; }, HERO);
      if (!s || !s.keuzes.length) break;
      rij.push(s); await kies(s.keuzes[0]); await wacht(400);
    }
    await p.waitForSelector(HERO + ' form.kgj-reken__contact', { timeout: 5000 }).catch(() => {});
    const stap = await p.evaluate((s) => (document.querySelector(s + ' .kgj-reken__kop')?.textContent || '').replace(/\s*(‹\s*)?Terug.*$/, ''), HERO);
    await zetVeld(p, 'naam', 'Test Kaart'); await zetVeld(p, 'telefoon', '0470 12 34 56'); await zetVeld(p, 'email', 'test@kaart.be');
    await verstuur(p);
    await p.waitForFunction(() => location.pathname.startsWith('/bedankt'), { timeout: 10000 }).catch(() => {});
    return { rij, stap, info: (log.ghl[0] || {}).aanvullende_info || '' };
  } finally { await ctx.close(); }
}
async function beidePadFouten() {
  const uit = [];
  for (const pad of [PAD, '/lp/dakwerken/asbest']) for (const werk of ['Dakrenovatie', 'Nieuw dak', 'Herstelling', 'Isolatie', 'Gratis dakinspectie']) {
    const hl = await padNa(pad, werk, 'Hellend dak'), be = await padNa(pad, werk, 'Beide / combinatie');
    const ok = JSON.stringify(be.rij) === JSON.stringify(hl.rij) && be.stap === hl.stap && be.stap === '' /* contactblok: geen teller */ && hl.info.includes('Dak: Hellend dak') && be.info === hl.info.replace('Dak: Hellend dak', 'Dak: ' + BEIDE);
    if (!ok) uit.push(`I ${pad} ${werk}. het pad of de aanvraag na "Beide" wijkt af van Hellend dak: ${JSON.stringify({ hl, be })}`);
  }
  return uit;
}

(async () => {
  let srv = null;
  basis = process.env.LP_BASIS ? process.env.LP_BASIS.replace(/\/$/, '') : null;
  if (!basis) {
    const vite = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    srv = spawn(process.execPath, [vite, '--port', String(POORT), '--strictPort'], { stdio: 'ignore', cwd: path.join(__dirname, '..') });
    basis = `http://localhost:${POORT}`;
    let op = false;
    for (let i = 0; i < 90 && !op; i++) { try { op = (await fetch(basis + PAD)).ok; } catch { await wacht(500); } }
    if (!op) { try { srv.kill(); } catch { /* */ } console.log('ONGELDIGE METING: dev-server kwam niet op'); process.exit(2); }
  }
  br = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-first-run', '--no-default-browser-check'] });
  const fouten = [];
  let code = 0, metingen = 0;
  const pc = (naam, f, stuk) => {
    if (!f.some((x) => x.includes(stuk))) { console.log(`ONGELDIGE METING: positieve controle "${naam}" niet gevangen (${f.join(' | ') || 'geen fout'})`); code = 2; }
    else console.log(`positieve controle: ${naam}: gevangen (${f.find((x) => x.includes(stuk))})`);
  };
  try {
    { const { p, ctx } = await open(); ABC = await p.evaluate(() => !!document.querySelector('.abc')); await ctx.close(); } // opwarmen; 23 nov 2026: de vorm van PAD
    console.log(`vorm van ${PAD}: ${ABC ? 'opbouw van bfbouw.be (LpBfC, .abc): alleen de kaart onderaan' : 'kaart bovenaan en onderaan'}`);
    /* positieve controles */
    pc('"0470 12 34" als goed verwacht', await nummersFouten([['0470 12 34', true]]), 'geweigerd');
    pc('Enter geblokkeerd op het naamveld', await enterFouten(true), 'Enter in "Uw naam"');
    pc('een 400 waar 3 pogingen verwacht worden', await storingFouten(400, 3), 'pogingen');
    pc('gewiste opslag vóór herladen', await bewaarFouten(true), 'na herladen');
    pc('verzendknop 400 px lager', await gsmFouten(390, 664, { css: '.kgj-reken__contact .kgj-reken__knop{margin-top:400px!important}' }), 'verzendknop niet in beeld');
    pc('scroll bij het sluiten van het toetsenbord', await gsmFouten(390, 664, { sprong: true }), 'sprong');
    /* 18 nov 2026: de kopknop blijft tijdens het formulier; de regel van vóór de fix (kopknop weg) moet rood geven, net als een zichtbare ronde knop */
    /* 23 nov 2026: elke plant draagt de selectors van de oude vorm en van de vorm .abc (LpBfC: tel:-links in .abc-kop, zwevende knop .abc-zweef) */
    pc('belknop in de kopbalk verborgen tijdens het formulier', await belFouten(390, 664, 'html.is-informulier body .bf.bf-lp .bf-kop a.bf-lpbel[href^="tel:"], html.is-informulier body .bf.bf-lp .abc-kop a[href^="tel:"]{opacity:0!important;visibility:hidden!important}'), 'in de kopbalk niet zichtbaar');
    pc('ronde belknop (vorm .abc: zwevende berichtknop) geforceerd zichtbaar tijdens het formulier', await belFouten(390, 664, 'html.is-informulier body .bf.bf-lp .bf-belzweef, html.is-informulier body .bf.bf-lp .abc-zweef{opacity:1!important;visibility:visible!important}'), 'ronde belknop');
    pc('kaart 30 px onder de kopbalk geschoven', await kaartKopFouten(1265, 585, true), 'ligt onder de kopbalk');
    pc('"Beide" met een icoon', await beideVormFouten(390, 664, PAD, 'icoon'), 'niet als volle-breedte rij');
    pc('"Beide" op halve breedte', await beideVormFouten(390, 664, PAD, 'half'), 'niet als volle-breedte rij');
    pc('pad na Plat dak wijkt af van Hellend dak (de vergelijking kan aanslaan)', await (async () => { const hl = await padNa(PAD, 'Gratis dakinspectie', 'Hellend dak'), pl = await padNa(PAD, 'Gratis dakinspectie', 'Plat dak'); return JSON.stringify(pl.rij) !== JSON.stringify(hl.rij) && pl.info.includes('Dak: Plat dak') ? ['I pad wijkt af: ' + JSON.stringify(pl.rij.map((x) => x.vraag))] : []; })(), 'pad wijkt af');
    pc('stappenblok 300 px lager', await gsmFouten(390, 664, { css: '.bf.bf-lp .kgj-reken__nastap{margin-top:300px!important}' }), 'niet direct onder de knop');
    pc('uitleg te licht', await gsmFouten(390, 664, { css: '.bf.bf-lp .kgj-reken__nakort li > span{color:#b5b5b8!important}' }), 'stappenblok: uitleg');
    pc('gevulde cirkels in het stappenblok', await gsmFouten(390, 664, { css: '.bf.bf-lp .kgj-reken__nakort li::before{background:#d98c03!important}' }), 'gevulde cirkel');
    if (code === 2) throw new Error('positieve controle niet gevangen (zie hierboven)');

    for (const f of await nummersFouten([...GOED.map((n) => [n, true]), ...FOUT.map((n) => [n, false]), ['', false]])) fouten.push(f); metingen++;
    for (const f of await payloadFouten()) fouten.push(f); metingen++;
    for (const f of await enterFouten()) fouten.push(f); metingen++;
    for (const [a, n, ms] of [['netwerk', 3], [503, 3], [400, 1], ['hangt', 1, 2500]]) { for (const f of await storingFouten(a, n, ms)) fouten.push(f); metingen++; }
    for (const f of await bewaarFouten()) fouten.push(f); metingen++;
    for (const [w, h] of [[360, 642], [390, 664], [320, 568]]) { for (const f of await gsmFouten(w, h)) fouten.push(f); metingen++; }
    for (const [w, h] of [[390, 664], [1265, 585]]) { for (const f of await belFouten(w, h)) fouten.push(f); metingen++; }
    for (const [w, h] of [[1265, 585], [390, 664]]) { for (const f of await kaartKopFouten(w, h)) fouten.push(f); metingen++; }
    for (const [w, h] of [[1265, 585], [390, 664]]) for (const pad of [PAD, '/lp/dakwerken/asbest']) { for (const f of await beideVormFouten(w, h, pad)) fouten.push(f); metingen++; }
    for (const f of await beidePadFouten()) fouten.push(f); metingen++;
  } catch (e) {
    console.log('ONGELDIGE METING: ' + (e && e.message ? e.message : e));
    code = 2;
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (code === 2) process.exit(2);
  if (metingen !== 20) { console.log(`ONGELDIGE METING: ${metingen} metingen (verwacht 20)`); process.exit(2); }
  console.log(`check-lp-formulier: ${PAD}, ${GOED.length} goede en ${FOUT.length + 1} foute nummers, payload, Enter, 4 storingen, bewaren, 3 gsm-maten met toetsenbord (${basis})`);
  if (fouten.length) { for (const f of fouten) console.log('  FOUT: ' + f); process.exit(1); }
  console.log('  AF: nummers en e-mail ruim aanvaard en streng geweigerd, Enter naar het volgende lege veld, bezig-stand, 2 nieuwe pogingen bij netwerk/5xx, geen bij 4xx, time-out, melding onder de knop, gegevens blijven, bewaard na herladen, contactblok in beeld met en zonder toetsenbord op 360, 390 en 320 breed, geen sprong, 16 px en 44 px; kopknop blijft, ronde knop weg tijdens het formulier; kaart met titel onder de kopbalk na elk antwoord; "Beide" volle breedte zonder icoon, pad en aanvraag = Hellend dak');
  process.exit(0);
})();
