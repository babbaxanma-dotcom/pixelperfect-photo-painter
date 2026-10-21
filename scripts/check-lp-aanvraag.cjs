#!/usr/bin/env node
/**
 * check-lp-aanvraag: de aanvraagkaart bovenaan /lp/dakwerken, /lp/totaalrenovatie en /lp/aannemer-renovatiewerken.
 *
 * Aanleiding (19 okt 2026, opdracht Mohammed): "bouw de abgroep totaalrenovatie en dakwerken lp naar de nieuwe, dus
 * rekenaar weg, en doe dat naar dakinspectie en gratis plaatsbezoek form bovenaan en andere headline en subheadline".
 * De rekenaar blijft alleen op /lp/richtprijs-berekenen (prijs- en woningzoekwoorden, Mohammed 6 okt: "VOLLEDIG ZO LATEN").
 *
 * Per pagina, zoals een bezoeker:
 *   1. geen enkele rekenaar-ingang: geen rekenaarkaart (kgj-reken--hero / --venster), geen venster, geen vangnet, geen
 *      knop "Liever eerst een prijs?", geen knop of link met "bereken", en in de zichtbare tekst, de paginatitel en de
 *      meta-omschrijving geen "rekenaar", "richtprijs" of "bereken";
 *   2. eerste gsm-scherm (390x844): het woord "gratis dakinspectie" (dak) of "gratis plaatsbezoek" (renovatie), de
 *      eerste klikvraag en al haar keuzes staan volledig in beeld;
 *   3. één tik = antwoord en meteen de volgende vraag ("Stap 1 van n" wordt "Stap 2 van n"), een tweede tik binnen
 *      200 ms slaat geen vraag over, Terug brengt de vorige vraag terug;
 *   4. de contactstap: de band "Bijna klaar! Bevestig uw gratis ...", de velden naam (verplicht), telefoon (verplicht),
 *      postcode of gemeente en e-mail, de knop = de knop van het formulier onderaan; versturen zonder naam geeft "Vul uw
 *      naam in." (20 okt 2026: de bevestigings-sms begint met "Dag {{voornaam}},", zonder naam stond er "Dag ,"),
 *      daarna met naam maar zonder gsm-nummer de gsm-melding; beide verzenden NIETS;
 *   5. message match (dak): ?utm_term=plat dak toont de kop "Dé specialist voor uw platte dak" en de kaart begint bij
 *      vraag 2 ("Stap 2 van 5"); Terug geeft vraag 1. Zonder utm_term begint ze bij vraag 1.
 *   6. de kop (h1) is de afgesproken kop en geen werkwijze-kop. 20 okt 2026, Mohammed over "Laat uw dak gratis
 *      inspecteren": "wat is dat voor een headline" en "je kan toch zelf ook redeneren dat dit niet goed is". Een kop die
 *      de bezoeker een opdracht geeft over de inspectie, het plaatsbezoek of de offerte gaat over onze werkwijze, niet over
 *      zijn huis, en herhaalt het aanbod dat de kaart al noemt (memory feedback_hook_gaat_over_het_huis, punt 5). Het
 *      aanbod hoort in de subkop en de kaart.
 * Wat er bij een volledige aanvraag naar GHL en Web3Forms gaat (bron_lead, aanvullende_info, Toestemming, /bedankt),
 * toetst check-lp-payload veld voor veld.
 *
 * Positieve controles (zonder: exit 2): /lp/richtprijs-berekenen (de rekenaarpagina) moet op punt 1 falen; een kaart
 * die 900 px lager staat (geplante CSS) moet op punt 2 falen; een tik die niets doet (geplante pointer-events: none op de
 * keuzes) moet op punt 3 falen.
 * Niets gaat naar buiten: GHL en Web3Forms krijgen een leeg antwoord (en worden geteld: elke telling > 0 is een fout),
 * Clarity en Google-tags een leeg script, tel: en mailto: worden afgebroken.
 *
 * Draaien:  node scripts/check-lp-aanvraag.cjs                       (start zelf een vite dev-server)
 *           LP_BASIS=http://localhost:8080 node scripts/check-lp-aanvraag.cjs
 * Exit 0 = alles AF, 1 = afwijking, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4434;
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const VERBODEN = /rekenaar|richtprijs|bereken/i;
/* 6. werkwijze-kop: het aanbod of een opdracht in de h1 */
const WERKWIJZEKOP = /inspect|plaatsbezoek|offerte|bereken|richtprijs|^(laat|plan|vraag|bestel|ontvang)\b/i;
const kopFouten = (h1, verwacht) => {
  const uit = [];
  if (h1 !== verwacht) uit.push(`kop "${h1}" in plaats van "${verwacht}"`);
  if (WERKWIJZEKOP.test(h1 || '')) uit.push(`werkwijze-kop "${h1}" (aanbod of opdracht in de kop; het aanbod hoort in de subkop en de kaart)`);
  return uit;
};

const DAK = {
  pad: '/lp/dakwerken', kop: 'Dé specialist voor uw nieuwe dak', woord: 'gratis dakinspectie', vraag1: 'Wat voor dak heeft u?', keuzes1: ['Hellend dak', 'Plat dak'],
  pad1: ['Hellend dak', 'Dakrenovatie / Nieuw dak', 'Ja', 'Nee'], vraag2: 'Wat moet er aan uw dak gebeuren?',
  band: 'Bijna klaar! Bevestig uw gratis dakinspectie', knop: 'Vraag uw gratis dakinspectie aan', stappen: 5,
};
const RENO = (pad) => ({
  pad, kop: 'Jouw complete renovatie, perfect geregeld van A tot Z.', woord: 'gratis plaatsbezoek', vraag1: 'Wat wilt u renoveren?',
  keuzes1: ['De hele woning (totaalrenovatie)', 'Gedeeltelijke renovatie', 'Aanbouw', 'Specifieke werken'],
  pad1: ['Gedeeltelijke renovatie', 'Zo snel mogelijk'], vraag2: 'Wanneer wilt u starten?',
  band: 'Bijna klaar! Bevestig uw gratis plaatsbezoek', knop: 'Bevestig mijn gratis plaatsbezoek', stappen: 3,
});
const PAGINAS = [DAK, RENO('/lp/totaalrenovatie'), RENO('/lp/aannemer-renovatiewerken')];

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
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] });
  const fouten = [];
  let leads = 0, metingen = 0;

  const open = async (url, { gsm = true, css = null } = {}) => {
    const ctx = await br.createBrowserContext();
    const p = await ctx.newPage();
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (/^(tel|mailto):/.test(u)) return r.abort();
      if (/services\.leadconnectorhq\.com|api\.web3forms\.com/.test(u)) {
        if (r.method() !== 'OPTIONS') leads++;
        return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type' }, body: '{}' });
      }
      if (/clarity\.ms|googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
      if (!/^(127\.0\.0\.1|localhost)$/.test(new URL(u).hostname) && r.method() !== 'GET') return r.abort();
      return r.continue();
    });
    /* minder beweging: de kaart scrolt na een stap meteen (geen zachte scroll onder de vinger), de herofoto's wisselen niet */
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    if (gsm) await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    else await p.setViewport({ width: 1265, height: 800 });
    await p.evaluateOnNewDocument(() => { try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false, ts: Date.now() })); } catch { /* */ } });
    await p.goto(basis + url, { waitUntil: 'load', timeout: 60000 });
    await p.waitForSelector('.bf-lp', { timeout: 20000 }).catch(() => {});
    await p.evaluate(() => document.fonts.ready);
    /* geplante fout voor een positieve controle: CSS na het laden */
    if (css) await p.addStyleTag({ content: css });
    await wacht(700);
    return { p, ctx };
  };

  /* 1. Rekenaar-ingangen en rekenaarwoorden. */
  const rekenaarSporen = (p) => p.evaluate((bron) => {
    const re = new RegExp(bron, 'i');
    const uit = [];
    for (const [sel, naam] of [['.kgj-reken--hero', 'rekenaarkaart'], ['.kgj-reken--venster, .kgj-venster', 'rekenaarvenster'],
      ['.bf-lpvangnet', 'vangnet'], ['.kgj-reken__alt', 'knop "Liever eerst een prijs?"']]) if (document.querySelector(sel)) uit.push(naam);
    const knoppen = [...document.querySelectorAll('button, a')].filter((e) => re.test(e.textContent || '') || re.test(e.getAttribute('aria-label') || ''));
    if (knoppen.length) uit.push(`knop of link: "${knoppen[0].textContent.trim().slice(0, 50)}"`);
    const tekst = document.body.innerText;
    const m = tekst.match(new RegExp(`.{0,30}(${bron}).{0,30}`, 'i'));
    if (m) uit.push(`zichtbare tekst: "${m[0].replace(/\s+/g, ' ')}"`);
    if (re.test(document.title)) uit.push(`paginatitel: "${document.title}"`);
    const meta = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    if (re.test(meta)) uit.push(`meta-omschrijving: "${meta}"`);
    return uit;
  }, VERBODEN.source);

  /* 2. Eerste gsm-scherm: woord, vraag 1 en elke keuze volledig binnen 0-844. */
  const eersteScherm = (p, pg) => p.evaluate((pg) => {
    const H = innerHeight;
    const zicht = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height > 0 && r.top >= 0 && r.bottom <= H && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.5; };
    const uit = [];
    const metWoord = [...document.querySelectorAll('h1, p, span, b, strong, li')].filter((e) => e.textContent.toLowerCase().includes(pg.woord) && zicht(e));
    if (!metWoord.length) uit.push(`"${pg.woord}" staat niet in het eerste scherm`);
    const kaart = document.querySelector('.kgj-reken--aanvraag');
    if (!kaart) return [...uit, 'geen aanvraagkaart'];
    const vraag = kaart.querySelector('.kgj-reken__vraag');
    if (!vraag || vraag.textContent.trim() !== pg.vraag1) uit.push(`eerste vraag is "${vraag?.textContent.trim()}" in plaats van "${pg.vraag1}"`);
    else if (!zicht(vraag)) uit.push(`eerste vraag buiten het eerste scherm (onderkant ${Math.round(vraag.getBoundingClientRect().bottom)} van ${H})`);
    const keuzes = [...kaart.querySelectorAll('.kgj-reken__keuze')];
    const labels = keuzes.map((k) => k.querySelector('strong')?.textContent.trim());
    if (labels.join('|') !== pg.keuzes1.join('|')) uit.push(`keuzes ${labels.join(' / ')} in plaats van ${pg.keuzes1.join(' / ')}`);
    const buiten = keuzes.filter((k) => !zicht(k));
    if (buiten.length) uit.push(`${buiten.length} keuze(s) buiten het eerste scherm (laatste onderkant ${Math.round(keuzes.at(-1).getBoundingClientRect().bottom)} van ${H})`);
    return uit;
  }, pg);

  const stand = (p) => p.evaluate(() => {
    const k = document.querySelector('.kgj-reken--aanvraag');
    return { tel: k.querySelector('.kgj-reken__tel')?.textContent.trim(), vraag: k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.textContent.trim().replace(/\s+/g, ' '),
      terug: !!k.querySelector('.kgj-reken__terug'), form: !!k.querySelector('form.kgj-reken__form') };
  });
  /* Een echte tik op het midden van de keuze (touchscreen), nadat die in beeld staat. */
  const tik = async (p, label) => {
    const plek = await p.evaluate((l) => {
      const b = [...document.querySelectorAll('.kgj-reken--aanvraag .kgj-reken__keuze')].find((x) => x.textContent.trim().startsWith(l));
      if (!b) return null;
      b.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, label);
    if (!plek) return false;
    await wacht(150);
    await p.touchscreen.tap(plek.x, plek.y);
    await wacht(450);
    return true;
  };
  /* 3. Tikgedrag: tik, dubbele tik, Terug. */
  const tikGedrag = async (p, pg) => {
    const uit = [];
    const s0 = await stand(p);
    if (s0.tel !== `Stap 1 van ${pg.stappen}` || s0.vraag !== pg.vraag1 || s0.terug) uit.push(`begin: ${JSON.stringify(s0)}`);
    if (!(await tik(p, pg.pad1[0]))) return [...uit, `keuze "${pg.pad1[0]}" niet gevonden`];
    const s1 = await stand(p);
    if (s1.tel !== `Stap 2 van ${pg.stappen}` || s1.vraag !== pg.vraag2 || !s1.terug) uit.push(`na één tik: ${JSON.stringify(s1)} (verwacht Stap 2 van ${pg.stappen}, "${pg.vraag2}", Terug)`);
    await p.evaluate(() => document.querySelector('.kgj-reken--aanvraag .kgj-reken__terug')?.click());
    await wacht(450);
    const s2 = await stand(p);
    if (s2.tel !== `Stap 1 van ${pg.stappen}` || s2.vraag !== pg.vraag1) uit.push(`na Terug: ${JSON.stringify(s2)}`);
    /* dubbele tik: twee klikken binnen 50 ms = één stap */
    await p.evaluate((l) => { const b = [...document.querySelectorAll('.kgj-reken--aanvraag .kgj-reken__keuze')].find((x) => x.textContent.trim().startsWith(l)); b.click(); setTimeout(() => { const c = [...document.querySelectorAll('.kgj-reken--aanvraag .kgj-reken__keuze')][0]; c?.click(); }, 40); }, pg.pad1[0]);
    await wacht(500);
    const s3 = await stand(p);
    if (s3.tel !== `Stap 2 van ${pg.stappen}`) uit.push(`dubbele tik: ${s3.tel} (verwacht Stap 2 van ${pg.stappen}: een tweede tik binnen 200 ms telt niet)`);
    return uit;
  };

  try {
    /* ---------- positieve controles ---------- */
    {
      const { p, ctx } = await open('/lp/richtprijs-berekenen');
      const pc1 = await rekenaarSporen(p);
      await ctx.close();
      if (pc1.length < 2) { console.log(`ONGELDIGE METING: de rekenaarpagina /lp/richtprijs-berekenen gaf ${pc1.length} rekenaarsporen (${pc1.join('; ')})`); process.exit(2); }
      console.log(`positieve controle 1: /lp/richtprijs-berekenen heeft ${pc1.length} rekenaarsporen (${pc1.slice(0, 2).join('; ')})`);
    }
    {
      const { p, ctx } = await open('/lp/dakwerken', { css: '.kgj-reken--aanvraag{margin-top:900px!important}' });
      const pc2 = await eersteScherm(p, DAK);
      await ctx.close();
      if (!pc2.length) { console.log('ONGELDIGE METING: een kaart 900 px lager werd in het eerste scherm gezien'); process.exit(2); }
      console.log(`positieve controle 2: kaart 900 px lager gezien (${pc2[0]})`);
    }
    {
      const { p, ctx } = await open('/lp/dakwerken', { css: '.kgj-reken__keuze{pointer-events:none!important}' });
      const pc3 = await tikGedrag(p, DAK);
      await ctx.close();
      if (!pc3.length) { console.log('ONGELDIGE METING: een tik die niets doet werd niet gezien'); process.exit(2); }
      console.log(`positieve controle 3: tik zonder gevolg gezien (${pc3[0]})`);
    }
    {
      const pc4 = kopFouten('Laat uw dak gratis inspecteren', 'Laat uw dak gratis inspecteren');
      const pc5 = kopFouten('Plan een gratis plaatsbezoek voor uw renovatie', 'Plan een gratis plaatsbezoek voor uw renovatie');
      if (!pc4.length || !pc5.length) { console.log('ONGELDIGE METING: de afgekeurde koppen van 19 okt werden niet als werkwijze-kop gezien'); process.exit(2); }
      if (kopFouten(DAK.kop, DAK.kop).length || kopFouten(RENO('').kop, RENO('').kop).length) { console.log('ONGELDIGE METING: de afgesproken koppen vallen zelf onder de werkwijze-regel'); process.exit(2); }
      console.log(`positieve controle 4: de koppen van 19 okt geweigerd (${pc4[0]})`);
    }
    const leadsNaControles = leads;

    /* ---------- de drie pagina's ---------- */
    for (const pg of PAGINAS) {
      for (const gsm of [true, false]) {
        const maat = gsm ? '390x844' : '1265x800';
        const { p, ctx } = await open(pg.pad, { gsm });
        if (!(await p.$('.kgj-reken--aanvraag'))) { fouten.push(`${pg.pad} @${maat}: geen aanvraagkaart (.kgj-reken--aanvraag)`); await ctx.close(); continue; }
        metingen++;
        for (const f of await rekenaarSporen(p)) fouten.push(`${pg.pad} @${maat}: rekenaar-ingang: ${f}`);
        const h1 = await p.evaluate(() => document.querySelector('h1')?.textContent.trim().replace(/\s+/g, ' '));
        for (const f of kopFouten(h1, pg.kop)) fouten.push(`${pg.pad} @${maat}: ${f}`);
        if (gsm) for (const f of await eersteScherm(p, pg)) fouten.push(`${pg.pad} @${maat}: eerste scherm: ${f}`);
        for (const f of await tikGedrag(p, pg)) fouten.push(`${pg.pad} @${maat}: tik: ${f}`);
        /* 4. tot de contactstap (vraag 1 is al gekozen in tikGedrag; de rest van het pad) */
        for (const l of pg.pad1.slice(1)) if (!(await tik(p, l))) fouten.push(`${pg.pad} @${maat}: keuze "${l}" niet gevonden`);
        const c = await p.evaluate(() => {
          const k = document.querySelector('.kgj-reken--aanvraag');
          const f = k.querySelector('form.kgj-reken__form');
          return { tel: k.querySelector('.kgj-reken__tel')?.textContent.trim(), band: k.querySelector('.kgj-reken__band')?.textContent.trim().replace(/\s+/g, ' '),
            velden: f ? [...f.querySelectorAll('input:not([type=hidden]), input[type=hidden]')].map((i) => i.name || (i.closest('.kgj-pg') ? 'postcode-gemeente' : '')).filter(Boolean) : [],
            knop: f?.querySelector('button[type=submit]')?.textContent.trim(), verplicht: f?.querySelector('[name=telefoon]')?.getAttribute('aria-required'),
            verplichtNaam: f?.querySelector('[name=naam]')?.getAttribute('aria-required') };
        });
        if (c.tel !== `Stap ${pg.stappen} van ${pg.stappen}`) fouten.push(`${pg.pad} @${maat}: contactstap teller "${c.tel}"`);
        if (c.band !== pg.band) fouten.push(`${pg.pad} @${maat}: band "${c.band}" in plaats van "${pg.band}"`);
        for (const v of ['naam', 'telefoon', 'postcode-gemeente', 'postcode', 'gemeente', 'email']) if (!c.velden.includes(v)) fouten.push(`${pg.pad} @${maat}: veld ${v} ontbreekt (${c.velden.join(', ')})`);
        if (c.knop !== pg.knop) fouten.push(`${pg.pad} @${maat}: knop "${c.knop}" in plaats van "${pg.knop}"`);
        if (c.verplicht !== 'true') fouten.push(`${pg.pad} @${maat}: telefoonveld niet als verplicht gemarkeerd`);
        if (c.verplichtNaam !== 'true') fouten.push(`${pg.pad} @${maat}: naamveld niet als verplicht gemarkeerd`);
        const voor = leads;
        const meldingNa = async () => { await p.evaluate(() => document.querySelector('.kgj-reken--aanvraag form button[type=submit]').click()); await wacht(500); return p.evaluate(() => document.querySelector('.kgj-reken--aanvraag .kgj-reken__fout')?.textContent.trim() || ''); };
        /* leeg formulier: de naam staat vóór de gsm, dus eerst "Vul uw naam in." */
        const zonderNaam = await meldingNa();
        if (zonderNaam !== 'Vul uw naam in.') fouten.push(`${pg.pad} @${maat}: lege naam gaf "${zonderNaam}" in plaats van "Vul uw naam in."`);
        /* een gsm zonder naam verstuurt ook niets: dat is precies de lead die "Dag ," zou geven */
        await p.type('.kgj-reken--aanvraag form [name=telefoon]', '0400 00 00 00');
        const zonderNaamMetGsm = await meldingNa();
        if (zonderNaamMetGsm !== 'Vul uw naam in.') fouten.push(`${pg.pad} @${maat}: gsm zonder naam gaf "${zonderNaamMetGsm}" in plaats van "Vul uw naam in."`);
        /* Vertrok er wel een verzoek, dan is de naam niet verplicht en is het formulier weg: melden en door naar de volgende
           pagina (geen crash op een ontbrekend veld: dat zou een ongeldige meting lijken in plaats van een afwijking). */
        if (leads !== voor || !(await p.$('.kgj-reken--aanvraag form [name=telefoon]'))) {
          fouten.push(`${pg.pad} @${maat}: zonder naam vertrok er een verzoek (${leads - voor} GHL/Web3Forms)`);
          await ctx.close();
          continue;
        }
        await p.evaluate(() => { const i = document.querySelector('.kgj-reken--aanvraag form [name=telefoon]'); i.focus(); i.select(); });
        await p.keyboard.press('Backspace');
        /* naam ingevuld, gsm leeg: de bestaande gsm-melding */
        await p.type('.kgj-reken--aanvraag form [name=naam]', 'Test Kaart');
        const melding = await meldingNa();
        if (melding !== 'Vul uw telefoonnummer in. Wij bellen u om een moment af te spreken.') fouten.push(`${pg.pad} @${maat}: lege gsm gaf "${melding}"`);
        if (leads !== voor) fouten.push(`${pg.pad} @${maat}: met een lege gsm vertrok er een verzoek`);
        await ctx.close();
      }
    }
    /* 5. message match (dak) */
    {
      const { p, ctx } = await open('/lp/dakwerken?utm_term=plat%20dak%20renoveren');
      const m = await p.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim().replace(/\s+/g, ' ') }));
      const s = await stand(p);
      for (const f of kopFouten(m.h1, 'Dé specialist voor uw platte dak')) fouten.push(`message match: ${f}`);
      if (s.vraag !== DAK.vraag2 || s.tel !== 'Stap 2 van 5' || !s.terug) fouten.push(`message match: kaart ${JSON.stringify(s)} (verwacht vraag 2, Stap 2 van 5, Terug)`);
      await p.evaluate(() => document.querySelector('.kgj-reken--aanvraag .kgj-reken__terug')?.click());
      await wacht(450);
      const s2 = await stand(p);
      if (s2.vraag !== DAK.vraag1) fouten.push(`message match: Terug gaf "${s2.vraag}"`);
      const isAan = await p.evaluate(() => document.querySelector('.kgj-reken--aanvraag .kgj-reken__keuze.is-aan')?.textContent.trim());
      if (isAan !== 'Plat dak') fouten.push(`message match: na Terug staat "${isAan}" aangeduid in plaats van Plat dak`);
      await ctx.close();
      const { p: q, ctx: ctx2 } = await open('/lp/dakwerken');
      const z = await stand(q);
      if (z.vraag !== DAK.vraag1) fouten.push(`zonder message match begint de kaart bij "${z.vraag}"`);
      await ctx2.close();
      metingen++;
    }
    if (leads !== leadsNaControles) fouten.push(`er vertrokken ${leads - leadsNaControles} leadverzoeken tijdens de toets (verwacht 0)`);
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (metingen < PAGINAS.length * 2 + 1) { console.log(`ONGELDIGE METING: ${metingen} metingen`); process.exit(2); }
  console.log(`check-lp-aanvraag: ${PAGINAS.length} pagina's x 2 maten + message match (${basis}), ${leads} leadverzoeken`);
  if (fouten.length) { fouten.forEach((f) => console.log('  FOUT: ' + f)); process.exit(1); }
  console.log('  kop zoals afgesproken (geen werkwijze-kop), geen rekenaar-ingang, kaart in het eerste gsm-scherm, één tik = volgende vraag, contactstap, naam verplicht en lege gsm in orde');
  process.exit(0);
})().catch((e) => { console.log('ONGELDIGE METING: ' + e.message); process.exit(2); });
