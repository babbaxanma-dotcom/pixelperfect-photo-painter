/**
 * check-claims: geen bewijs zonder bron op de pagina's die klanten zien.
 *
 * Aanleiding: op 30 sep en 1 okt 2026 stonden op /bedankt en op de homepage
 * reviews met naam, "4,9 Google-score", "Gemiddeld 4,9 van 5" en "120+
 * realisaties". Het Google-profiel van AB heeft één review (gecontroleerd 22 sep).
 * Regel 1 van Norvo: geen verzonnen reviews, cijfers of resultaatclaims.
 *
 * Opent elke pagina zoals een bezoeker (gerenderde tekst, niet de broncode) en
 * faalt op een verboden patroon. Komt er een echte score of review met bron,
 * dan gaat die in TOEGESTAAN met de bron erbij, nooit door de guard te verzwakken.
 *
 * 12 okt 2026 (spec/bf-stijl.md §17): ook /lp/richtprijs-berekenen en /lp/aannemer-renovatiewerken; de LP's
 * krijgen de BF-stijl, die een Google-badge "5,0 op Google" mag tonen (spec §1) maar nooit een review of cijferband.
 * Positieve controle (zonder: exit 2): op /lp/dakwerken wordt een regel met "Gemiddeld 4,9 van 5" en "120+ realisaties"
 * in de pagina gezet; de toets moet beide vinden.
 * 13 okt 2026: ook de rekenaar-varianten van /bedankt en de agendapagina's /afspraak en /dakinspectie (tekst in de
 * GHL-iframe telt mee). Op die funnelpagina's faalt elk echt bedrag; alleen het vergrendelde "€ 00.000 – 00.000" mag.
 * Positieve controle bedrag (zonder: exit 2): een geplant "€ 12.500 – 18.000" moet gevonden worden, een geplant
 * nullen-bedrag niet.
 * Clarity, Google-tags en de leadverzoeken krijgen een leeg antwoord: geen vervuiling van de statistieken.
 *
 * Draaien:  node scripts/check-claims.cjs                  (start zelf een dev-server)
 *           LP_BASIS=https://www.abgroep.be node scripts/check-claims.cjs
 * Exit 0 = schoon, 1 = claim gevonden, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4432;
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

/* Pagina's die al schoon zijn. Een pagina komt er pas bij als ze schoon is. */
const PAGINAS = ['/', '/bedankt?dienst=dakwerken', '/bedankt?dienst=totaalrenovatie', '/lp/dakwerken', '/lp/totaalrenovatie',
  /* 4 okt 2026: na de nieuwe teksten van Mohammed zonder 4,9 en 120+. */
  '/diensten', '/werkwijze', '/over', '/contact',
  /* 12 okt 2026: de twee andere LP's (spec §17). */
  '/lp/richtprijs-berekenen', '/lp/aannemer-renovatiewerken',
  /* 13 okt 2026: de rest van de funnel. Na de rekenaar staat op /bedankt het vergrendelde bedrag (alleen nullen, de
     richtprijs komt van Bardh); stap 2 is de agendapagina (BedanktBf.tsx, AfspraakBf.tsx). */
  '/bedankt?dienst=dakwerken&van=rekenaar', '/bedankt?dienst=totaalrenovatie&van=rekenaar', '/afspraak', '/dakinspectie'];

/* Funnelpagina's: daar mag geen enkel echt bedrag staan (regel 'echt bedrag' hieronder). */
const FUNNEL = /^\/(bedankt|afspraak|dakinspectie)\b/;

const VERBODEN = [
  { naam: 'Google-score zonder bron', re: /\b4,9\b|Google-score|Gemiddeld \d,\d van 5/ },
  { naam: 'aantal realisaties zonder bron', re: /\b\d{2,4}\+\s*(realisaties|woningen|projecten|tevreden)/i },
  /* De teller "120+" staat in losse letters (fotoglyphs), dus met witruimte ertussen. */
  { naam: 'teller zonder bron', re: /1\s*2\s*0\s*\+\s*Realisaties/i },
  { naam: 'termijn zonder bron', re: /binnen vijf werkdagen/i },
  /* 22 okt 2026, Mohammed: "100 procent budget garantie haal dat overal uit, doe gewoon, vaste prijs vooraf"; en geen terugbeltermijn
     meer ("neemt zo snel mogelijk contact met u op"). */
  { naam: 'budgetgarantie (Mohammed 22 okt: eruit)', re: /budget\s*-?\s*garantie|prijsgarantie/i },
  { naam: 'terugbeltermijn (Mohammed 22 okt: eruit)', alleen: /^\/lp\//, re: /binnen (één|een|1) werkdag/i },
  /* Namen van reviews die niet op het Google-profiel van AB staan (uit de oude site). */
  { naam: 'review met naam zonder bron', re: /Nathalie Aerts|Inge Vermeiren|Dirk Maes|Hilde Goossens|Geert Verbeke|Saïda El Khatib|Yusuf Demir|Jasmien De Backer|Dimitri Maes|Hicham Bouali|Greet Vermeiren|Ahmed Karimi|Tine Maes/ },
  /* Een euroteken met een bedrag waarin een cijfer 1-9 staat ("€ 12.500", "€ 00.000 – 18.000"). Het vergrendelde
     "€ 00.000 – 00.000" valt er niet onder. Het euroteken en de cijfers staan in aparte vakken (innerText: "€\n00.000"),
     dus witruimte na het teken mag. Alleen op de funnelpagina's: de LP's tonen premies en budgetten met een bron
     (gemeten 13 okt: /lp/dakwerken "€ 5.750", /lp/richtprijs-berekenen "€ 50.000 tot € 100.000"). */
  { naam: 'echt bedrag in de funnel', alleen: FUNNEL, re: /€\s*(?:[0-9.,]*[1-9][0-9.,]*|[0-9.,]+[ \u00a0]*[–-][ \u00a0]*[0-9.,]*[1-9][0-9.,]*)/ },
];
const TOEGESTAAN = []; // { re, bron } — alleen met een bron die Mohammed of Bardh gaf

(async () => {
  let srv = null;
  let basis = process.env.LP_BASIS;
  if (!basis) {
    const vite = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    srv = spawn(process.execPath, [vite, '--port', String(POORT), '--strictPort'], { stdio: 'ignore' });
    basis = `http://localhost:${POORT}`;
    let op = false;
    for (let i = 0; i < 90 && !op; i++) {
      try { op = (await fetch(basis + '/')).ok; } catch { await wacht(500); }
    }
    if (!op) { console.log('ONGELDIGE METING: dev-server kwam niet op'); process.exit(2); }
  }
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const fouten = []; let gelezen = 0;
  /* De pagina lezen zoals een bezoeker; lokaas = een functie die in de pagina een verboden claim plant. */
  const lees = async (pad, lokaas) => {
    const p = await br.newPage();
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (/services\.leadconnectorhq\.com|api\.web3forms\.com/.test(u)) return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
      if (/clarity\.ms|googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
      /* De GHL-kalender op /afspraak en /dakinspectie POST bij het laden zelf (attribution_service): niets naar buiten. */
      if (/leadconnectorhq|web3forms|msgsvc/.test(u) && r.method() === 'OPTIONS') return r.respond({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' }, body: '' });
      if (/leadconnectorhq|web3forms|msgsvc/.test(u) && r.method() !== 'GET' && r.method() !== 'HEAD') return r.respond({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: '{}' });
      return r.continue();
    });
    await p.setViewport({ width: 1366, height: 900 });
    await p.goto(basis + pad, { waitUntil: 'networkidle2' });
    await wacht(900);
    if (lokaas) await p.evaluate(...[].concat(lokaas));
    /* Ook wat pas bij het scrollen verschijnt. */
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await wacht(60); }
    let tekst = await p.evaluate(() => document.body.innerText);
    /* De GHL-kalender op /afspraak en /dakinspectie staat in een iframe: wat de bezoeker daar leest, telt mee (de
       pagina zelf heeft 184 tekens). Wachten tot de widget tekst heeft (hoogstens 20 s, zie check-bouwrook). */
    for (const el of await p.$$('iframe')) {
      const f = await el.contentFrame().catch(() => null);
      if (!f) continue;
      await f.waitForFunction(() => document.body && document.body.innerText.length > 0, { timeout: 20000 }).catch(() => {});
      try { tekst += '\n' + await f.evaluate(() => (document.body ? document.body.innerText : '')); } catch { /* frame weg */ }
    }
    await p.close();
    return tekst;
  };
  const vind = (tekst, pad) => VERBODEN.filter((v) => !v.alleen || v.alleen.test(pad)).map((v) => [v, tekst.match(v.re)]).filter(([, m]) => m && !TOEGESTAAN.some((t) => t.re.test(m[0])));
  /* Lokaas voor het bedrag: zelfde opbouw als het vergrendelde bedrag (euroteken en cijfers in aparte vakken). */
  const bedrag = (cijfers) => [(c) => {
    const d = document.createElement('div'); d.style.display = 'flex';
    const e = document.createElement('span'); e.textContent = '€';
    const s = document.createElement('span'); s.textContent = c;
    d.append(e, s); document.querySelector('main, #root').appendChild(d);
  }, cijfers];
  try {
    /* Positieve controle */
    const proef = vind(await lees('/lp/dakwerken', () => { const d = document.createElement('p'); d.textContent = 'Gemiddeld 4,9 van 5 · 120+ realisaties'; document.querySelector('main, #root')?.appendChild(d); }), '/lp/dakwerken').map(([v, m]) => `${v.naam} ("${m[0]}")`);
    if (proef.length < 2) { console.log(`ONGELDIGE METING: positieve controle vond ${proef.length} van de 2 geplante claims (${proef.join('; ')})`); process.exit(2); }
    console.log(`positieve controle: ${proef.join('; ')}`);
    /* Positieve controle bedrag: een echt bedrag op de bedankpagina na de rekenaar moet gevonden worden; het
       vergrendelde nullen-bedrag in dezelfde opbouw niet (anders faalt de guard op de pagina zoals ze hoort). */
    const RP = '/bedankt?dienst=dakwerken&van=rekenaar';
    const echt = vind(await lees(RP, bedrag('12.500 – 18.000')), RP).filter(([v]) => v.alleen);
    if (echt.length !== 1) { console.log(`ONGELDIGE METING: positieve controle bedrag vond ${echt.length} van 1 geplant bedrag ("€ 12.500 – 18.000")`); process.exit(2); }
    const nul = vind(await lees(RP, bedrag('00.000 – 00.000')), RP).filter(([v]) => v.alleen);
    if (nul.length !== 0) { console.log(`ONGELDIGE METING: het vergrendelde nullen-bedrag telt als echt bedrag ("${nul[0][1][0]}")`); process.exit(2); }
    console.log(`positieve controle bedrag: ${echt[0][0].naam} ("${echt[0][1][0].replace(/\s+/g, ' ')}"); nullen-bedrag niet geteld`);
    for (const pad of PAGINAS) {
      const tekst = await lees(pad, null);
      if (tekst.length < 200) { fouten.push(`${pad}: pagina leeg (${tekst.length} tekens), ongeldige meting`); continue; }
      gelezen++;
      for (const [v, m] of vind(tekst, pad)) fouten.push(`${pad}: ${v.naam} ("${m[0].replace(/\s+/g, ' ')}")`);
    }
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (gelezen === 0) { console.log('ONGELDIGE METING: geen pagina gelezen'); process.exit(2); }
  console.log(`check-claims: ${gelezen} pagina's gelezen zoals een bezoeker (${basis})`);
  if (fouten.length) { fouten.forEach((f) => console.log('  FOUT: ' + f)); process.exit(1); }
  console.log('  geen reviews, scores, aantallen of termijnen zonder bron, geen echt bedrag in de funnel');
  process.exit(0);
})().catch((e) => { console.log('ONGELDIGE METING: ' + e.message); process.exit(2); });
