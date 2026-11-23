#!/usr/bin/env node
/**
 * check-lp-smal: de aanvraagkaart op een smalle gsm, de terugweg naar het formulier en de hoeve-video, op /lp/dakwerken, /lp/totaalrenovatie en
 * /lp/dakwerken/asbest.
 *
 * Aanleiding (19 nov 2026, Clarity): AB 19 nov 09:10 (Android, 274x493) en BF 18 nov 16:17 (226x412), een gsm met grote weergave of grote tekst:
 * drie vragen in 12 s, het contactscherm, dan naar de bodem gescrold en weg. Mohammed: "ze maken het form af, maar scrollen dan om te lezen", "en
 * dan raken ze verdwaald", "ook is het hele scherm de spacing heel raar op telefoon", "fix ook dat probleem dat je niet op play kan drukken vaak".
 * Gemeten op fa4e459: de knoppen "Ik ben op zoek naar" maakten de pagina 51 px (226) en 27 px (274) breder dan het scherm, waardoor de gsm de
 * pagina breder legde dan het scherm en de vaste kopbalk los kwam van wat de bezoeker zag; de verzendknop stond onder de onderrand; "Na uw
 * aanvraag" was 970 tot 1.449 px lang; met automatisch afspelen uit speelde de hoeve-video 0 van 10 tikken af.
 *
 * Per pagina, zoals een bezoeker (echte aanrakingen, puppeteer touchscreen), op 226x412 en 274x493:
 *   1. de pagina is niet breder dan het scherm (innerWidth = schermbreedte, geen horizontale scroll) en de kopbalk past (belknop volledig in beeld);
 *   2. na elk antwoord en op het contactscherm: geen veld of knop van de kaart in beeld ligt onder de kopbalk (elementFromPoint in het midden van
 *      elk zichtbaar veld, elke knop en elke summary);
 *   3. op het contactscherm staat de verzendknop volledig in beeld, onder de kopbalk; "Na uw aanvraag" is één regel die openklapt (details, dicht,
 *      hoogstens 60 px) met 3 stappen;
 *   4. terugweg: met een getypte naam (contactscherm) en ook bij vraag 2: 2.500 px naar beneden scrollen = de vaste knop "Aanvraag afronden"
 *      verschijnt (in beeld, raakbaar, niet onder de kopbalk, de ronde belknop weg); een tik brengt de kaart terug in beeld (contactscherm:
 *      verzendknop in beeld, naam nog ingevuld; vraag 2: dezelfde vraag) en de knop verdwijnt;
 * en op 390x664:
 *   5. de realisatie van de hoeve staat direct onder de hero met het formulier, er is geen belblok "In nood?" (19 nov 2026: "oke doe maar eruit"),
 *      "Na uw aanvraag" staat open met 3 stappen;
 *   6. play: met automatisch afspelen geweigerd (zoals een iPhone in energiebesparing: play() telt alleen binnen een echte tik) speelt een tik op de
 *      afspeelknop de video af en pauzeert de volgende tik, 6 tikken na elkaar, de knop raakbaar (elementFromPoint).
 * Positieve controles (zonder: exit 2), op /lp/dakwerken: twee vaste kolommen van 140 px voor "Ik ben op zoek naar" (punt 1); een kopbalk van 160
 * px (punt 2); "Aanvraag afronden" verborgen (punt 4); de afspeelknop niet raakbaar (punt 6). Tegen de live versie van fa4e459 (LP_BASIS=
 * https://abgroep.be) faalt deze toets op punt 1, 3, 4, 5 en 6.
 *
 * 23 nov 2026: /lp/dakwerken staat in de opbouw van bfbouw.be (LpBfC.tsx, .abc): hero zonder formulier, de enige aanvraagkaart onderaan in #contact.
 * Voor die vorm (herkend aan .abc) begint elke flow zoals een bezoeker daar begint: een tik op "Offerte aanvragen" in de hero, dan de kaart. Punt 1
 * toetst de kopbalk van die vorm (logo, "Bel direct" en de menuknop volledig in beeld); punt 4 de zwevende berichtknop (.abc-zweef) in plaats van de
 * ronde belknop; punt 5 de volgorde van de secties zoals bfbouw.be (hero, waarom, diensten, realisaties, uitleg, werkwijze, voordelen, regio,
 * zekerheden, vragen, tips, offerteblok, contact) in plaats van "de hoeve direct onder de hero met het formulier" (de hero heeft geen formulier meer).
 * De positieve controles planten hun fout in de vorm die er staat: twee vaste kolommen van 140 px voor de twee heroknoppen, een kopbalk van 160 px
 * (.abc-kop__in); "Aanvraag afronden" en de afspeelknop hebben dezelfde klassen. De oude vormen (/lp/totaalrenovatie, /lp/dakwerken/asbest) ongewijzigd.
 * Een tik zoals een vinger: de keuze springt (instant) naar het midden van het scherm en wordt dan getikt. Met de zachte scroll van de pagina (html
 * scroll-behavior: smooth) en de kaart 7.000 px lager was de tik een race tegen die scroll (gemeten 23 nov op 274x493: na de tik op "Dakrenovatie"
 * stond de kaart nog op vraag 1, daarna "keuze Hellend dak niet gevonden" en "Node is either not clickable or not an Element").
 * Niets gaat naar buiten: Clarity, Google-tags, GHL, Web3Forms en /api/ krijgen een leeg antwoord; er wordt nooit verstuurd.
 *
 * Draaien:  node scripts/check-lp-smal.cjs                       (start zelf een vite dev-server)
 *           LP_BASIS=http://localhost:8080 node scripts/check-lp-smal.cjs
 * Exit 0 = alles AF, 1 = afwijking, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4438;
const HERO = '#rekenaar .kgj-reken--aanvraag';
const BLOK = /clarity\.ms|googletagmanager|google-analytics|googleadservices|doubleclick|googlesyndication|leadconnector|gohighlevel|msgsndr|web3forms|\/api\//;
const PADEN = {
  '/lp/dakwerken': ['Dakrenovatie', 'Hellend dak', 'Nee'],
  '/lp/totaalrenovatie': ['Rijwoning', 'Gedeeltelijke renovatie', ['Keuken', 'Badkamer'], '€ 25.000 tot € 75.000'],
  '/lp/dakwerken/asbest': ['Nieuw dak', 'Plat dak', 'Huidig dak vervangen'],
};
const SMAL = [[226, 412], [274, 493]];
/* 23 nov 2026: de blokken van /lp/dakwerken in de opbouw van bfbouw.be (LpBfC.tsx), in volgorde: [naam, selector van het kind van main] */
const ABC_VOLGORDE = [['hero', '.abc-hero'], ['waarom', '#waarom'], ['diensten', '#diensten'], ['realisaties', '.abc-real'], ['uitleg', '.abc-uitleg'],
  ['werkwijze', '#werkwijze'], ['voordelen', '.abc-voordelen'], ['regio', '#regio'], ['zekerheden', '.abc-zeker'], ['vragen', '#faq'], ['tips', '#blog'],
  ['offerteblok', '#contact'], ['contact', '#gegevens']];
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

/* play() telt alleen binnen een echte tik (touchend, click of pointerup van de vinger), zoals een iPhone in energiebesparing of Android met
   databesparing: automatisch afspelen wordt geweigerd. */
const AUTOPLAY_UIT = () => {
  let gebaar = false;
  for (const t of ['touchend', 'click', 'pointerup']) document.addEventListener(t, (e) => { if (!e.isTrusted) return; gebaar = true; setTimeout(() => { gebaar = false; }, 0); }, true);
  const echt = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { return gebaar ? echt.call(this) : Promise.reject(new DOMException('automatisch afspelen geweigerd', 'NotAllowedError')); };
};

let br, basis;
async function open(pad, w, h, { css = null, autoplayUit = false } = {}) {
  const ctx = await br.createBrowserContext();
  const p = await ctx.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (/^(tel|mailto):/.test(u)) return r.abort();
    if (BLOK.test(u)) {
      const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type' };
      return r.respond({ status: 200, headers: cors, contentType: 'application/json', body: '{}' });
    }
    return r.continue();
  });
  await p.evaluateOnNewDocument((uit) => {
    window.__abLaadMs = 0;
    try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false, ts: Date.now() })); sessionStorage.clear(); } catch { /* */ }
    if (uit) (0, eval)('(' + uit + ')()');
  }, autoplayUit ? AUTOPLAY_UIT.toString() : null);
  await p.goto(basis + pad, { waitUntil: 'networkidle2', timeout: 60000 });
  await p.waitForSelector(HERO + ' .kgj-reken__keuze', { timeout: 20000 });
  if (css) await p.addStyleTag({ content: css });
  await wacht(500);
  return { ctx, p };
}
/* Een tik zoals een vinger: het element in het midden van het scherm, dan touchscreen.tap op zijn midden. 23 nov 2026: de sprong naar het midden is
   'instant' (zie de kop van dit script); daarna 250 ms rust, zoals voorheen. */
async function tikOp(p, handle) {
  await handle.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await wacht(250);
  await handle.tap();
}
/* 23 nov 2026, vorm .abc (LpBfC): de kaart staat alleen onderaan; een bezoeker komt er met de knop "Offerte aanvragen" in de hero. Een echte tik op die
   knop, daarna wachten tot de pagina stilstaat. Op de oude vormen (kaart in de hero) gebeurt er niets. */
async function naarKaart(p) {
  if (!(await p.evaluate(() => !!document.querySelector('.abc')))) return;
  const knop = await p.evaluateHandle(() => [...document.querySelectorAll('.abc-hero a[href="#contact"]')].find((a) => a.getClientRects().length) || null);
  const e = knop.asElement();
  if (!e) throw new Error('geen knop "Offerte aanvragen" in de hero');
  await tikOp(p, e);
  let vorige = -1;
  for (let i = 0; i < 30; i++) { const y = await p.evaluate(() => Math.round(window.scrollY)); if (y === vorige) break; vorige = y; await wacht(150); }
  await wacht(300);
}
async function antwoord(p, label) {
  const h = await p.evaluateHandle((s, l) => [...document.querySelectorAll(s + ' .kgj-reken__keuze, ' + s + ' .kgj-reken__vink')].find((x) => (x.querySelector('strong')?.textContent || x.textContent || '').trim() === l) || null, HERO, label);
  const e = h.asElement();
  if (!e) throw new Error(`keuze "${label}" niet gevonden`);
  await tikOp(p, e);
  await wacht(1100); // stapwissel + de eigen scroll van de kaart (smooth)
}
async function verder(p) {
  const e = await p.$(HERO + ' .kgj-reken__verder');
  if (!e) throw new Error('knop Volgende niet gevonden');
  await e.tap();
  await wacht(1100);
}

/* Punt 1. */
const breedte = (p, w) => p.evaluate((w) => {
  const uit = [];
  if (innerWidth !== w) uit.push(`de gsm legt de pagina ${innerWidth} px breed op een scherm van ${w} px (iets op de pagina is breder dan het scherm)`);
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) uit.push(`horizontale scroll (${document.documentElement.scrollWidth} px op ${document.documentElement.clientWidth})`);
  const vv = window.visualViewport;
  if (vv && Math.abs(vv.width - innerWidth) > 1) uit.push(`zichtbaar deel ${Math.round(vv.width)} px op een pagina van ${innerWidth} px breed (de gsm legt de pagina breder dan het scherm)`);
  /* 23 nov 2026, vorm .abc: de kopbalk is .abc-kop__in met het logo en .abc-kop__acties ("Bel direct" en de menuknop) */
  for (const e of document.querySelectorAll('.kgj-kop .bf-nav > *, .kgj-kop .bf-lpbel, .abc-kop .abc-kop__in > *, .abc-kop .abc-kop__acties > *')) { const r = e.getBoundingClientRect(); if (r.width && (r.right > (vv ? vv.width : innerWidth) + 0.5 || r.left < -0.5)) uit.push(`kopbalk: ${e.className} loopt buiten het scherm (${Math.round(r.left)}-${Math.round(r.right)})`); }
  return uit;
}, w);
/* Punt 2: elk zichtbaar veld, elke knop en summary van de kaart in beeld: het midden is van het element zelf (niet van de kopbalk of iets anders). */
const bedekt = (p) => p.evaluate((s) => {
  const k = document.querySelector(s); const uit = [];
  const vv = window.visualViewport, vh = vv ? vv.height : innerHeight;
  for (const e of k.querySelectorAll('input:not([type="hidden"]), button, summary, select, textarea')) {
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height || getComputedStyle(e).visibility === 'hidden') continue;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (y < 0 || y > vh) continue; // buiten beeld
    const t = document.elementFromPoint(x, y);
    if (!t || !(t === e || e.contains(t) || t.contains(e) && t !== document.body)) {
      const wie = t ? (t.closest('.kgj-kop') ? 'de kopbalk' : (t.className && String(t.className)) || t.tagName) : 'niets';
      uit.push(`"${(e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.textContent || e.name || '').trim().slice(0, 30)}" ligt onder ${wie} (y ${Math.round(y)})`);
    }
  }
  return uit;
}, HERO);
/* Punt 3. */
const contactScherm = (p) => p.evaluate((s) => {
  const k = document.querySelector(s); const uit = [];
  const f = k.querySelector('form.kgj-reken__contact');
  if (!f) return ['het contactscherm verschijnt niet'];
  const kop = document.querySelector('.kgj-kop'), kcs = getComputedStyle(kop);
  const kb = kcs.position === 'fixed' && kcs.visibility !== 'hidden' ? kop.getBoundingClientRect().bottom : 0;
  const vv = window.visualViewport, vh = vv ? vv.height : innerHeight;
  const knop = f.querySelector('button[type="submit"]').getBoundingClientRect();
  if (knop.top < kb - 0.5 || knop.bottom > vh + 0.5) uit.push(`verzendknop niet volledig in beeld (${Math.round(knop.top)}-${Math.round(knop.bottom)}, kopbalk tot ${Math.round(kb)}, scherm ${Math.round(vh)})`);
  const na = f.querySelector('.kgj-reken__nastap');
  if (!na) uit.push('"Na uw aanvraag" ontbreekt');
  else {
    if (na.tagName !== 'DETAILS' || na.open) uit.push(`"Na uw aanvraag" is geen dichte uitklapregel (${na.tagName}${na.open ? ', open' : ''})`);
    if (na.getBoundingClientRect().height > 60) uit.push(`"Na uw aanvraag" is ${Math.round(na.getBoundingClientRect().height)} px hoog (hoogstens 60)`);
    if (na.querySelectorAll('.kgj-reken__nakort li').length !== 3) uit.push(`"Na uw aanvraag" heeft ${na.querySelectorAll('.kgj-reken__nakort li').length} stappen (verwacht 3)`);
  }
  return uit;
}, HERO);
/* Punt 4. */
async function terugweg(p, { naam }) {
  const uit = [];
  if (naam) {
    const veld = await p.$(HERO + ' input[name="naam"]');
    await veld.tap(); await p.keyboard.type(naam); await p.evaluate(() => document.activeElement && document.activeElement.blur()); await wacht(400);
  }
  const voor = await p.evaluate((s) => (document.querySelector(s + ' .kgj-reken__stap .kgj-reken__vraag')?.textContent || '').trim(), HERO);
  for (let i = 0; i < 10; i++) { await p.evaluate(() => window.scrollBy(0, 250)); await wacht(90); }
  await wacht(700);
  const knop = await p.evaluate(() => {
    const b = document.querySelector('.kgj-afronden'); if (!b) return null;
    const r = b.getBoundingClientRect(), cs = getComputedStyle(b);
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const kop = document.querySelector('.kgj-kop').getBoundingClientRect();
    const bel = document.querySelector('.bf-belzweef, .abc-zweef'); // 23 nov 2026: vorm .abc heeft een zwevende berichtknop rechtsonder
    const vv = window.visualViewport, vh = vv ? vv.height : innerHeight;
    let ouderFout = null;
    for (let e = b.parentElement; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (/(hidden|clip|auto|scroll)/.test(c.overflow + c.overflowX + c.overflowY) || c.transform !== 'none' || c.filter !== 'none') { ouderFout = e.className || e.tagName; break; } }
    return { aan: b.classList.contains('is-aan'), zicht: cs.display !== 'none' && r.width > 0 && cs.visibility === 'visible' && +cs.opacity > 0.9, raak: !!t && (t === b || b.contains(t)), top: r.top, bottom: r.bottom, kopOnder: kop.bottom, vh, tekst: b.textContent.trim(),
      bel: bel ? getComputedStyle(bel).visibility : 'geen', ouderFout };
  });
  if (!knop) return ['de knop "Aanvraag afronden" bestaat niet'];
  if (!knop.aan || !knop.zicht) uit.push('na wegscrollen verschijnt de knop "Aanvraag afronden" niet');
  else {
    if (knop.tekst !== 'Aanvraag afronden') uit.push(`knoptekst "${knop.tekst}"`);
    if (!knop.raak) uit.push('de knop "Aanvraag afronden" is niet raakbaar (iets anders ligt erover)');
    if (knop.top < knop.kopOnder || knop.bottom > knop.vh + 0.5) uit.push(`de knop staat niet onderaan in beeld (${Math.round(knop.top)}-${Math.round(knop.bottom)})`);
    if (knop.bel === 'visible') uit.push('de ronde knop rechtsonder (belknop, of de berichtknop op de vorm .abc) staat tegelijk met de knop in beeld');
    if (knop.ouderFout) uit.push(`de knop hangt in ${knop.ouderFout} (overflow, transform of filter): Safari tekent een vast element daar verkeerd`);
  }
  if (!knop.aan || !knop.zicht) return uit;
  const b = await p.$('.kgj-afronden');
  await b.tap();
  await wacht(1800);
  const na = await p.evaluate((s, naamVerwacht) => {
    const k = document.querySelector(s); const r = k.getBoundingClientRect();
    const kop = document.querySelector('.kgj-kop'), kcs = getComputedStyle(kop);
    const kb = kcs.position === 'fixed' && kcs.visibility !== 'hidden' ? kop.getBoundingClientRect().bottom : 0;
    const vv = window.visualViewport, vh = vv ? vv.height : innerHeight;
    const knop = k.querySelector('form.kgj-reken__contact button[type="submit"]');
    const kr = knop && knop.getBoundingClientRect();
    return { inBeeld: r.bottom > kb + 40 && r.top < vh - 40, vraag: (k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.textContent || '').trim(),
      naam: k.querySelector('input[name="naam"]')?.value ?? null, knopInBeeld: kr ? kr.top >= kb - 0.5 && kr.bottom <= vh + 0.5 : null, verborgen: !document.querySelector('.kgj-afronden').classList.contains('is-aan'), naamVerwacht };
  }, HERO, naam || null);
  if (!na.inBeeld) uit.push('na de tik op "Aanvraag afronden" staat de kaart niet in beeld');
  if (na.vraag !== voor) uit.push(`na de tik staat de kaart op "${na.vraag}" in plaats van "${voor}"`);
  if (naam && na.naam !== naam) uit.push(`de getypte naam is weg ("${na.naam}")`);
  if (naam && na.knopInBeeld === false) uit.push('na de tik staat de verzendknop niet in beeld');
  if (!na.verborgen) uit.push('de knop "Aanvraag afronden" blijft staan terwijl de kaart in beeld is');
  return uit;
}

async function smalFlow(pad, w, h, plant = {}) {
  const uit = [];
  const tag = `${pad} @${w}x${h}`;
  const { ctx, p } = await open(pad, w, h, plant);
  try {
    for (const f of await breedte(p, w)) uit.push(`${tag} 1. ${f}`);
    await naarKaart(p);
    const st = PADEN[pad];
    for (const s of st) {
      if (Array.isArray(s)) { for (const v of s) await antwoord(p, v); await verder(p); } else await antwoord(p, s);
      for (const f of await bedekt(p)) uit.push(`${tag} 2. na "${Array.isArray(s) ? s.join('+') : s}": ${f}`);
    }
    for (const f of await contactScherm(p)) uit.push(`${tag} 3. ${f}`);
    for (const f of await terugweg(p, { naam: 'Jan Proef' })) uit.push(`${tag} 4. contactscherm: ${f}`);
  } catch (e) { uit.push(`${tag} het formulier loopt vast: ${e.message}`); } finally { await ctx.close(); }
  /* terugweg vanaf vraag 2 */
  const t2 = await open(pad, w, h, plant);
  try {
    const s = PADEN[pad][0];
    await naarKaart(t2.p);
    await antwoord(t2.p, s);
    for (const f of await terugweg(t2.p, { naam: null })) uit.push(`${tag} 4. vraag 2: ${f}`);
  } catch (e) { uit.push(`${tag} het formulier loopt vast: ${e.message}`); } finally { await t2.ctx.close(); }
  return uit;
}

async function breedFlow(pad, plant = {}) {
  const uit = [];
  const tag = `${pad} @390x664`;
  const { ctx, p } = await open(pad, 390, 664, { ...plant, autoplayUit: true });
  try {
    const v = await p.evaluate((s, ABC_VOLGORDE) => {
      const fouten = [];
      if (document.querySelector('.abc')) {
        /* 23 nov 2026, vorm .abc (LpBfC): de volgorde van bfbouw.be; de hoeve staat in de realisatie (4e blok), de kaart in het offerteblok */
        const main = document.querySelector('main');
        const naam = (e) => (ABC_VOLGORDE.find(([, sel]) => e.matches(sel)) || [`?${e.id || String(e.className).split(' ')[0]}`])[0];
        const rij = main ? [...main.children].map(naam) : [];
        const verwacht = ABC_VOLGORDE.map(([n]) => n);
        if (rij.join(' > ') !== verwacht.join(' > ')) fouten.push(`volgorde van de secties "${rij.join(' > ')}" in plaats van "${verwacht.join(' > ')}"`);
        if (!document.querySelector('main ~ footer.abc-voet')) fouten.push('geen voet (footer.abc-voet) na de inhoud');
        if (!document.querySelector('.abc-real #realisaties')) fouten.push('geen realisatie van de hoeve (#realisaties) in het realisatieblok');
        if (!document.querySelector('#regio .abc-check')) fouten.push('geen postcodecheck in het werkgebied (#regio .abc-check)');
        if (!document.querySelector(s) || !document.querySelector('#contact ' + s.replace(/^#rekenaar\s+/, ''))) fouten.push('de aanvraagkaart staat niet in het offerteblok (#contact)');
      } else {
        const hero = document.querySelector('.bf-lphero');
        const volgende = hero && hero.nextElementSibling;
        if (!volgende || volgende.id !== 'realisaties') fouten.push(`direct onder de hero staat "${volgende ? (volgende.id || volgende.className) : 'niets'}" in plaats van de realisatie van de hoeve (#realisaties)`);
      }
      if (document.querySelector('.bf-lpbelblok')) fouten.push('het belblok "In nood?" staat nog op de pagina');
      return fouten;
    }, HERO, ABC_VOLGORDE);
    for (const f of v) uit.push(`${tag} 5. ${f}`);
    await naarKaart(p);
    /* "Na uw aanvraag" open met 3 stappen */
    for (const s of PADEN[pad]) { if (Array.isArray(s)) { for (const x of s) await antwoord(p, x); await verder(p); } else await antwoord(p, s); }
    const na = await p.evaluate((s) => { const n = document.querySelector(s + ' .kgj-reken__nastap'); return n ? { tag: n.tagName, li: n.querySelectorAll('.kgj-reken__nakort li').length, zicht: n.querySelector('.kgj-reken__nakort').getClientRects().length > 0 } : null; }, HERO);
    if (!na || na.tag === 'DETAILS' || na.li !== 3 || !na.zicht) uit.push(`${tag} 5. "Na uw aanvraag" niet open met 3 stappen (${JSON.stringify(na)})`);
    /* 6. play */
    await p.evaluate(() => { const r = document.querySelector('.bf-real__podium'); window.scrollTo(0, r.getBoundingClientRect().top + scrollY - 140); });
    await wacht(2500);
    const stand = () => p.evaluate(() => {
      const v = document.querySelector('.bf-real__podium video'), b = document.querySelector('.bf-real__pauze');
      if (!v || !b) return null;
      const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, t = document.elementFromPoint(x, y);
      return { paused: v.paused, x, y, raak: !!t && (t === b || b.contains(t)) };
    });
    const s0 = await stand();
    if (!s0) uit.push(`${tag} 6. video of afspeelknop ontbreekt`);
    else {
      let goed = 0; const reeks = [];
      for (let i = 0; i < 6; i++) {
        const s = await stand();
        if (!s.raak) { reeks.push('niet raakbaar'); continue; }
        await p.touchscreen.tap(s.x, s.y);
        await wacht(700);
        const n = await stand();
        const ok = s.paused ? !n.paused : n.paused;
        if (ok) goed++;
        reeks.push(`${s.paused ? 'afspelen' : 'pauzeren'}:${ok ? 'ok' : 'FOUT'}`);
      }
      if (goed !== 6) uit.push(`${tag} 6. play: ${goed} van 6 tikken deden wat de knop zegt (${reeks.join(', ')})`);
    }
  } finally { await ctx.close(); }
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
    for (let i = 0; i < 90 && !op; i++) { try { op = (await fetch(basis + '/lp/dakwerken')).ok; } catch { await wacht(500); } }
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
    { const { ctx } = await open('/lp/dakwerken', 390, 664); await ctx.close(); } // opwarmen (eerste bundel)
    if (!process.env.LP_BASIS || process.env.LP_PC === '1') {
      /* 23 nov 2026: elke plant draagt de selector van de oude vorm en van de vorm .abc (LpBfC); alleen die van de vorm die er staat, doet iets.
         Op .abc bestaan de knoppen "Ik ben op zoek naar" niet: de rij van de postcodecheck (veld + knop Controleer, buiten de hero) in twee vaste kolommen
         van 140 px. Niet de heroknoppen: de hero knipt wat uitsteekt (overflow hidden), dus daar wordt de pagina niet breder (gemeten: geen fout). De
         kopbalk is .abc-kop__in. */
      pc('"Ik ben op zoek naar" (vorm .abc: de rij van de postcodecheck) in twee vaste kolommen van 140 px', await smalFlow('/lp/dakwerken', 226, 412, { css: '.bf.bf-lp .bf-lpzoek__knoppen{grid-template-columns:repeat(2,140px)!important}.abc .abc-check__rij{display:grid!important;grid-template-columns:repeat(2,140px)!important}' }), ' 1. ');
      pc('kopbalk van 160 px', await smalFlow('/lp/dakwerken', 274, 493, { css: '.bf.bf-lp .bf-kop--lp .bf-nav{height:160px!important}.abc .abc-kop .abc-kop__in{height:160px!important}' }), 'kopbalk'); // punt 2 (veld onder de kopbalk) of punt 3 (verzendknop onder het scherm, kopbalk tot 160)
      pc('"Aanvraag afronden" verborgen', await smalFlow('/lp/dakwerken', 274, 493, { css: '.bf.bf-lp .kgj-afronden{display:none!important}' }), 'verschijnt de knop "Aanvraag afronden" niet');
      pc('afspeelknop niet raakbaar', await breedFlow('/lp/dakwerken', { css: '.bf.bf-lp .bf-real__podium::after{content:"";position:absolute;inset:0;z-index:5}' }), '6. ');
      if (code === 2) throw new Error('positieve controle niet gevangen (zie hierboven)');
    }
    for (const pad of Object.keys(PADEN)) {
      for (const [w, h] of SMAL) { for (const f of await smalFlow(pad, w, h)) fouten.push(f); metingen++; }
      for (const f of await breedFlow(pad)) fouten.push(f); metingen++;
    }
  } catch (e) {
    console.log('ONGELDIGE METING: ' + (e && e.message ? e.message : e));
    code = 2;
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (code === 2) process.exit(2);
  if (metingen !== 9) { console.log(`ONGELDIGE METING: ${metingen} metingen (verwacht 9)`); process.exit(2); }
  console.log(`check-lp-smal: 3 pagina's op 226x412, 274x493 en 390x664 (${basis})`);
  if (fouten.length) { for (const f of fouten) console.log('  FOUT: ' + f); process.exit(1); }
  console.log('  AF: pagina niet breder dan het scherm, kopbalk past, geen veld of knop onder de kopbalk na elk antwoord, verzendknop in beeld, "Na uw aanvraag" ingeklapt onder 340 px en open met 3 stappen op 390, "Aanvraag afronden" na wegscrollen en terug naar de kaart met de antwoorden en de naam, hoeve direct onder het formulier (vorm .abc: blokken in de volgorde van bfbouw.be), geen belblok, play speelt en pauzeert bij elke tik');
  process.exit(0);
})();
