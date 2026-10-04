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
  '/diensten', '/werkwijze', '/over', '/contact'];

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
  try {
    for (const pad of PAGINAS) {
      const p = await br.newPage();
      await p.setViewport({ width: 1366, height: 900 });
      await p.goto(basis + pad, { waitUntil: 'networkidle2' });
      await wacht(900);
      /* Ook wat pas bij het scrollen verschijnt. */
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 700) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await wacht(60); }
      const tekst = await p.evaluate(() => document.body.innerText);
      if (tekst.length < 200) { fouten.push(`${pad}: pagina leeg (${tekst.length} tekens), ongeldige meting`); await p.close(); continue; }
      gelezen++;
      for (const v of VERBODEN) {
        const m = tekst.match(v.re);
        if (m && !TOEGESTAAN.some((t) => t.re.test(m[0]))) fouten.push(`${pad}: ${v.naam} ("${m[0]}")`);
      }
      await p.close();
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
