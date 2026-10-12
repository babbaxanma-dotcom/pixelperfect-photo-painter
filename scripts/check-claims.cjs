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
  '/lp/richtprijs-berekenen', '/lp/aannemer-renovatiewerken'];

const VERBODEN = [
  { naam: 'Google-score zonder bron', re: /\b4,9\b|Google-score|Gemiddeld \d,\d van 5/ },
  { naam: 'aantal realisaties zonder bron', re: /\b\d{2,4}\+\s*(realisaties|woningen|projecten|tevreden)/i },
  /* De teller "120+" staat in losse letters (fotoglyphs), dus met witruimte ertussen. */
  { naam: 'teller zonder bron', re: /1\s*2\s*0\s*\+\s*Realisaties/i },
  { naam: 'termijn zonder bron', re: /binnen vijf werkdagen/i },
  /* Namen van reviews die niet op het Google-profiel van AB staan (uit de oude site). */
  { naam: 'review met naam zonder bron', re: /Nathalie Aerts|Inge Vermeiren|Dirk Maes|Hilde Goossens|Geert Verbeke|Saïda El Khatib|Yusuf Demir|Jasmien De Backer|Dimitri Maes|Hicham Bouali|Greet Vermeiren|Ahmed Karimi|Tine Maes/ },
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
  /* De pagina lezen zoals een bezoeker; lokaas = een geplante regel met een verboden claim. */
  const lees = async (pad, lokaas) => {
    const p = await br.newPage();
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (/services\.leadconnectorhq\.com|api\.web3forms\.com/.test(u)) return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
      if (/clarity\.ms|googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
      return r.continue();
    });
    await p.setViewport({ width: 1366, height: 900 });
    await p.goto(basis + pad, { waitUntil: 'networkidle2' });
    await wacht(900);
    if (lokaas) await p.evaluate(() => { const d = document.createElement('p'); d.textContent = 'Gemiddeld 4,9 van 5 · 120+ realisaties'; document.querySelector('main, #root')?.appendChild(d); });
    /* Ook wat pas bij het scrollen verschijnt. */
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await wacht(60); }
    const tekst = await p.evaluate(() => document.body.innerText);
    await p.close();
    return tekst;
  };
  const vind = (tekst) => VERBODEN.map((v) => [v, tekst.match(v.re)]).filter(([, m]) => m && !TOEGESTAAN.some((t) => t.re.test(m[0])));
  try {
    /* Positieve controle */
    const proef = vind(await lees('/lp/dakwerken', true)).map(([v, m]) => `${v.naam} ("${m[0]}")`);
    if (proef.length < 2) { console.log(`ONGELDIGE METING: positieve controle vond ${proef.length} van de 2 geplante claims (${proef.join('; ')})`); process.exit(2); }
    console.log(`positieve controle: ${proef.join('; ')}`);
    for (const pad of PAGINAS) {
      const tekst = await lees(pad, false);
      if (tekst.length < 200) { fouten.push(`${pad}: pagina leeg (${tekst.length} tekens), ongeldige meting`); continue; }
      gelezen++;
      for (const [v, m] of vind(tekst)) fouten.push(`${pad}: ${v.naam} ("${m[0]}")`);
    }
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (gelezen === 0) { console.log('ONGELDIGE METING: geen pagina gelezen'); process.exit(2); }
  console.log(`check-claims: ${gelezen} pagina's gelezen zoals een bezoeker (${basis})`);
  if (fouten.length) { fouten.forEach((f) => console.log('  FOUT: ' + f)); process.exit(1); }
  console.log('  geen reviews, scores, aantallen of termijnen zonder bron');
  process.exit(0);
})().catch((e) => { console.log('ONGELDIGE METING: ' + e.message); process.exit(2); });
