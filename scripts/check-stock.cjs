#!/usr/bin/env node
/**
 * check-stock: een stockfoto is SFEERBEELD, nooit "ons werk".
 *
 * Aanleiding (13 okt 2026): op /dakwerken stond een stockfoto (een dakwerker op de nok bij de schouw) in het traject
 * "Van offerte tot oplevering", recht boven stap 1 "We klimmen op het dak". Een bezoeker leest die man dan als een
 * dakwerker van AB Bouw Groep: een verzonnen referentie (regel 1 van Norvo). Geen enkele check las /dakwerken.
 * Stockfoto's mogen alleen op /dakwerken (DICTAAT MOHAMMED 12 okt 2026, spec/bf-stijl.md §9), met bron, fotograaf en
 * licentie bovenaan src/pages/abbouw/bf/fotoplan.ts.
 *
 * Faalt (exit 1) op:
 *   (a) een stockbeeld in een blok dat eigen werk toont of suggereert (paginakop, hero, verhaalrij, traject, rail,
 *       voor/na, onderste deel), of op een andere plek dan de toegestane: de foto van een tegel in "Wat wij doen"
 *       (.bf-waarde__foto) en de banner van "Andere diensten" (.bf-dsectie__band);
 *   (b) een stockbeeld op een andere route dan /dakwerken (gerenderd), of in fotoplan.ts een STOCK-verwijzing op een
 *       regel zonder "dakwerken" of als kop/rij/traject (bron);
 *   (c) een alt van een stockbeeld met AB, ons, onze, wij, we of door;
 *   (d) hetzelfde stockbeeld twee keer op één pagina.
 * Positieve controle (zonder: exit 2, ongeldige meting): per regel wordt een overtreding in de pagina of in een kopie van
 * de bron geplant en moet de toets ze vinden; op /dakwerken moet minstens één stockbeeld herkend worden.
 * Niets gaat naar buiten: elk verzoek buiten de eigen server krijgt een leeg antwoord (Clarity, Google-tags, GHL,
 * Web3Forms, lettertypes). Een verzoek naar tel: of mailto: wordt afgebroken.
 *
 * Draaien:  node scripts/check-stock.cjs              (start zelf een dev-server op een vrije poort)
 *           STOCK_BASIS=http://127.0.0.1:4610 node scripts/check-stock.cjs
 * Dev-server en geen build: in de build heet elk beeld assets/<hash>.webp (vite.config.ts), dus de naam "stock-" is
 * daar niet te lezen. Exit 0 = schoon, 1 = overtreding, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PAD || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const WORTEL = path.join(__dirname, '..');
const FOTOPLAN = path.join(WORTEL, 'src', 'pages', 'abbouw', 'bf', 'fotoplan.ts');
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

const TOEGESTANE_ROUTE = '/dakwerken';
const ROUTES = ['/', '/over', '/diensten', '/werkwijze', '/contact',
  '/dakwerken', '/gevel', '/bad', '/interieur', '/construct', '/ecologisch',
  '/privacy', '/voorwaarden', '/cookies', '/totaalrenovatie', '/badkamerrenovatie',
  '/lp/badkamerrenovatie', '/lp/dakwerken', '/lp/totaalrenovatie', '/lp/richtprijs-berekenen', '/lp/aannemer-renovatiewerken',
  '/bedankt?dienst=dakwerken'];
/* /afspraak en /dakinspectie worden NIET geopend: daar staat de GHL-kalender (een meting raakt die nooit aan). Ze, en
   elke andere pagina, vallen onder de bronscan hieronder: "stock-" mag in src/ alleen in fotoplan.ts en beelden.ts staan. */
const BRON_TOEGESTAAN = new Set([FOTOPLAN, path.join(WORTEL, 'src', 'pages', 'abbouw', 'bf', 'beelden.ts')].map((p) => path.normalize(p)));

/* ---------- (b) bron: geen "stock-" buiten fotoplan.ts en beelden.ts ---------- */
function bronScan(map, fout = []) {
  for (const e of fs.readdirSync(map, { withFileTypes: true })) {
    const p = path.join(map, e.name);
    if (e.isDirectory()) { if (e.name !== 'assets') bronScan(p, fout); continue; }
    if (!/\.(tsx?|jsx?|css|html|json|md)$/.test(e.name) || BRON_TOEGESTAAN.has(path.normalize(p))) continue;
    const t = fs.readFileSync(p, 'utf8');
    const i = t.search(/stock-[a-z]/);
    if (i >= 0) fout.push(`${path.relative(WORTEL, p)} r.${t.slice(0, i).split('\n').length}: "stock-" buiten fotoplan.ts`);
  }
  return fout;
}

/* ---------- (b) bron: fotoplan.ts ---------- */
function bronToets(tekst) {
  const fout = [];
  const regels = tekst.split(/\r?\n/);
  let inDefinitie = false;
  regels.forEach((r, i) => {
    if (/^const STOCK\s*=/.test(r)) inDefinitie = true;
    if (inDefinitie) { if (/^\}\s*satisfies|^\};?\s*$/.test(r)) inDefinitie = false; return; }
    if (/^\s*(\/\/|\*|\/\*)/.test(r)) return; // commentaar
    if (!/STOCK\.|['"]stock-/.test(r)) return;
    if (!/dakwerken/.test(r)) fout.push(`fotoplan.ts r.${i + 1}: stockbeeld op een regel zonder "dakwerken": ${r.trim().slice(0, 120)}`);
    const m = r.match(/\b(kop|rij|traject|voorNa|voor|na|rail|cirkel|fotovak)\s*:\s*(STOCK\.\w+|\{\s*naam:\s*['"]stock-)/);
    if (m) fout.push(`fotoplan.ts r.${i + 1}: stockbeeld als "${m[1]}" (eigen-werkblok)`);
  });
  return fout;
}

/* ---------- (a) (c) (d) gerenderd: draait in de pagina ---------- */
function paginaToets(magStock) {
  const STOCK = /\/stock-[a-z0-9-]+?-\d+\.webp/;
  const naamVan = (s) => { const m = String(s).match(/\/(stock-[a-z0-9-]+?)-\d+\.webp/); return m ? m[1] : null; };
  const VERBODEN = '.bf-paginakop, .bf-hero, #verhaal, .bf-dienstrij, .bf-proces, .bf-rslider-sectie, .bf-rslider, .bf-rproject, .bf-voorna, .bf-oc, .bf-eind, #realisaties, #werk';
  const TOEGESTAAN = '.bf-waarde__foto, .bf-dsectie__band';
  const ALT = /\bAB\b|\b(ons|onze|wij|we|door)\b/i;
  const fout = [];
  const beelden = [...document.querySelectorAll('img')].filter((i) => STOCK.test(i.getAttribute('src') || '') || STOCK.test(i.getAttribute('srcset') || ''));
  const gezien = {};
  for (const i of beelden) {
    const naam = naamVan(i.getAttribute('src')) || naamVan(i.getAttribute('srcset'));
    const blok = i.closest('section');
    const waar = blok ? (blok.id ? '#' + blok.id : '.' + String(blok.className).split(' ')[0]) : '(geen sectie)';
    if (!magStock) fout.push(`b: ${naam} op een route zonder stockfoto's (${waar})`);
    const verboden = i.closest(VERBODEN);
    if (verboden) fout.push(`a: ${naam} in een eigen-werkblok (${verboden.id ? '#' + verboden.id : '.' + String(verboden.className).split(' ')[0]})`);
    else if (!i.closest(TOEGESTAAN)) fout.push(`a: ${naam} niet op een toegestane plek (${waar})`);
    if (ALT.test(i.alt || '')) fout.push(`c: ${naam} alt "${i.alt}"`);
    gezien[naam] = (gezien[naam] || 0) + 1;
  }
  for (const [n, k] of Object.entries(gezien)) if (k > 1) fout.push(`d: ${n} ${k} keer op de pagina`);
  /* ook buiten <img> (svg-image, inline stijl): op een route zonder stock telt elke vermelding */
  if (!magStock) {
    const andere = [...document.querySelectorAll('image, [style*="stock-"]')].filter((e) => STOCK.test(e.getAttribute('href') || e.getAttribute('xlink:href') || e.getAttribute('style') || ''));
    andere.forEach((e) => fout.push(`b: stockbeeld buiten <img> (${e.tagName.toLowerCase()})`));
  }
  return { aantal: beelden.length, namen: Object.keys(gezien), fout };
}

(async () => {
  /* positieve controle op de brontoets, met een kopie van fotoplan.ts in het geheugen */
  const bron = fs.readFileSync(FOTOPLAN, 'utf8');
  const bronFout = bronToets(bron);
  const geplant = bron + "\nconst X = { gevel: { rij: STOCK.zinkwerk } };\nconst Y = { dakwerken: { traject: STOCK.daklijn } };\n";
  const plantFout = bronToets(geplant).slice(bronFout.length);
  if (!plantFout.some((f) => f.includes('zonder "dakwerken"')) || !plantFout.some((f) => f.includes('als "traject"'))) stop(2, 'ONGELDIGE METING: de brontoets vond de geplante overtredingen niet');
  if (!/STOCK\.\w+/.test(bron.split(/\r?\n/).filter((r) => !/^\s*(\/\/|\*|\/\*)/.test(r)).join('\n'))) stop(2, 'ONGELDIGE METING: geen STOCK-verwijzing in fotoplan.ts gevonden (bestand verplaatst of herschreven? pas de guard aan)');
  /* bronscan over src/ met positieve controle: een geplant bestand in een tijdelijke map moet gevonden worden */
  const scanFout = bronScan(path.join(WORTEL, 'src'));
  {
    const tmp = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'check-stock-'));
    fs.writeFileSync(path.join(tmp, 'Geplant.tsx'), "const f = { naam: 'stock-zinkwerk' };\n");
    const gevonden = bronScan(tmp).length === 1;
    fs.rmSync(tmp, { recursive: true, force: true });
    if (!gevonden) stop(2, 'ONGELDIGE METING: de bronscan vond het geplante bestand niet');
  }
  bronFout.push(...scanFout);

  /* eigen dev-server op een poort waar niets op antwoordt (lees: scripts/_preview.cjs, 1 okt: verkeerde site gemeten) */
  let srv = null;
  let basis = process.env.STOCK_BASIS;
  if (!basis) {
    let poort = 0;
    for (const p of [4441, 4442, 4443, 4444, 4445, 4446]) {
      let bezet = false;
      try { await fetch(`http://127.0.0.1:${p}/`, { signal: AbortSignal.timeout(800) }); bezet = true; } catch { /* vrij */ }
      if (!bezet) { poort = p; break; }
    }
    if (!poort) stop(2, 'ONGELDIGE METING: geen vrije poort');
    const vite = path.join(WORTEL, 'node_modules', 'vite', 'bin', 'vite.js');
    srv = spawn(process.execPath, [vite, '--port', String(poort), '--strictPort', '--host', '127.0.0.1'], { cwd: WORTEL, stdio: 'ignore' });
    basis = `http://127.0.0.1:${poort}`;
    let op = false;
    for (let i = 0; i < 90 && !op; i++) {
      if (srv.exitCode !== null) break;
      try { op = (await fetch(basis + '/')).ok; } catch { await wacht(500); }
    }
    if (!op || srv.exitCode !== null) { if (srv) srv.kill(); stop(2, 'ONGELDIGE METING: eigen dev-server kwam niet op'); }
  }
  const eigenHost = new URL(basis).host;

  let browser;
  const mis = [...bronFout];
  try {
    // zonder site-isolatie lopen ook iframes door de onderschepping hieronder
    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-site-isolation-trials', '--disable-features=site-per-process,IsolateOrigins'] });
    const open = async (pad) => {
      const p = await browser.newPage();
      await p.setViewport({ width: 1265, height: 720 });
      await p.setRequestInterception(true);
      p.on('request', (r) => {
        const u = r.url();
        if (/^(tel|mailto):/i.test(u)) return r.abort();
        let host = '';
        try { host = new URL(u).host; } catch { /* data:, blob: */ }
        if (!host || host === eigenHost) return r.continue();
        const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' };
        if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: cors });
        return r.respond({ status: 200, headers: cors, contentType: 'text/plain', body: '' });
      });
      await p.goto(basis + pad, { waitUntil: 'networkidle2', timeout: 60000 });
      await p.waitForFunction(() => document.querySelectorAll('h1').length > 0, { timeout: 15000 }).catch(() => {});
      await wacht(400);
      return p;
    };

    let stockOpDak = 0;
    for (const pad of ROUTES) {
      const p = await open(pad);
      const mag = pad === TOEGESTANE_ROUTE;
      const m = await p.evaluate(paginaToets, mag);
      m.fout.forEach((f) => mis.push(`${pad}: ${f}`));
      if (mag) {
        stockOpDak = m.aantal;
        console.log(`  ${pad}: ${m.aantal} stockbeelden (${m.namen.join(', ')})`);
        /* positieve controle (a), (c), (d): plant overtredingen in de echte pagina en meet opnieuw */
        const ctl = await p.evaluate((tf) => {
          const toets = new Function('return (' + tf + ')')();
          const stock = [...document.querySelectorAll('img')].find((i) => /\/stock-/.test(i.getAttribute('src') || ''));
          if (!stock) return { ok: false, reden: 'geen stockbeeld om te klonen' };
          const doelEind = document.querySelector('.bf-eind, .bf-oc, .bf-proces');
          if (!doelEind) return { ok: false, reden: 'geen eigen-werkblok gevonden' };
          const a = stock.cloneNode(); a.alt = 'neutraal'; doelEind.appendChild(a);
          const c = stock.cloneNode(); c.alt = 'Dak gelegd door AB Bouw Groep'; stock.parentElement.appendChild(c);
          const r = toets(true);
          return { ok: true, a: r.fout.some((f) => f.startsWith('a: ') && f.includes('eigen-werkblok')), c: r.fout.some((f) => f.startsWith('c: ')), d: r.fout.some((f) => f.startsWith('d: ')) };
        }, paginaToets.toString());
        if (!ctl.ok || !ctl.a || !ctl.c || !ctl.d) { await p.close(); stop(2, `ONGELDIGE METING: positieve controle op ${pad} faalt ${JSON.stringify(ctl)}`); }
      }
      if (pad === '/gevel') {
        /* positieve controle (b): een stockbeeld geplant op een andere route */
        const b = await p.evaluate((tf) => {
          const toets = new Function('return (' + tf + ')')();
          const img = document.createElement('img');
          img.setAttribute('src', '/src/assets/bf/stock-geplant-800.webp'); img.alt = 'x';
          (document.querySelector('main') || document.body).appendChild(img);
          return toets(false).fout.some((f) => f.startsWith('b: '));
        }, paginaToets.toString());
        if (!b) { await p.close(); stop(2, 'ONGELDIGE METING: positieve controle (b) op /gevel faalt'); }
      }
      await p.close();
    }
    if (!stockOpDak) stop(2, `ONGELDIGE METING: 0 stockbeelden herkend op ${TOEGESTANE_ROUTE} (herkenning kapot, of de stock is bewust weg: pas dan deze guard aan)`);

    if (mis.length) {
      console.error(`check-stock: ${mis.length} overtredingen\n`);
      mis.forEach((x) => console.error('  FOUT: ' + x));
      console.error('\n  Een stockfoto is sfeerbeeld: alleen op /dakwerken, in "Wat wij doen" of de banner, met een neutrale alt.');
      process.exitCode = 1;
    } else {
      console.log(`check-stock: ${ROUTES.length} routes + fotoplan.ts, 0 overtredingen, positieve controles (a)(b)(c)(d) en bron gezien`);
    }
  } finally {
    if (browser) await browser.close();
    if (srv) srv.kill();
  }
})().catch((e) => stop(2, `ONGELDIGE METING: ${e.message}`));
