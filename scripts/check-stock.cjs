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
 *
 * 13 okt 2026, DICTAAT MOHAMMED: "die stock photos ook op landingspagina dakwerken aub". /lp/dakwerken mag ook, maar
 * ALLEEN in de hero-dia's en de slotblokfoto (#contact). De LP importeert de 1600-webp-varianten uit src/assets/bf
 * (op de dev-server /src/assets/bf/stock-<naam>-1600.webp, dezelfde herkenning als /dakwerken). De regels voor
 * /dakwerken hierboven blijven exact; de herkenning kent daarnaast ook de bron-jpg (/src/assets/dak-stock/stock-<naam>.jpg),
 * zodat een import van de jpg op welke route ook gevonden wordt. Op /lp/dakwerken faalt:
 *   (a) een stockbeeld buiten de hero-dia's en de slotblokfoto (waarom, werk, voor/na, reviews, diensten, ...);
 *   (c) een alt met AB, ons, onze, wij, we of door;
 *   (d) een stockbeeld twee keer in de hero, de foto van dia 1 in het slotblok, of een andere herhaling. Toegestaan is
 *       precies één herhaling: dia 2, 3 of 4 opnieuw als slotblokfoto (vier stockfoto's op vijf plekken; voorheen stond
 *       pannenDicht ook in dia 4 én in het slotblok).
 * Bron: in src/pages/abbouw/lp/kgj/inhoud.ts mag "stock-" alleen op een import van een stockbeeld (src/assets/bf/stock-*.webp
 * of src/assets/dak-stock/stock-*.jpg) staan, en die
 * namen alleen op een dia-regel in hero.dias of op de regel foto: in cta. Positieve controles: een geplante stockfoto
 * in #waarom van /lp/dakwerken, een geplante slechte alt, een geplante dubbele dia, dia 1 als slotblokfoto, en in een
 * kopie van inhoud.ts een geplante stock-import gebruikt in waarom.duo en een losse "stock-"-tekst.
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
/* 13 okt 2026: de dak-LP, alleen hero-dia's en slotblokfoto (zie kop). */
const LP_ROUTE = '/lp/dakwerken';
const LP_INHOUD = path.join(WORTEL, 'src', 'pages', 'abbouw', 'lp', 'kgj', 'inhoud.ts');
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
    /* de inhoud van /lp/dakwerken: eigen, strengere regel (lpBronToets) in plaats van een vrijstelling */
    if (path.normalize(p) === path.normalize(LP_INHOUD)) { fout.push(...lpBronToets(t).fout); continue; }
    const i = t.search(/stock-[a-z]/);
    if (i >= 0) fout.push(`${path.relative(WORTEL, p)} r.${t.slice(0, i).split('\n').length}: "stock-" buiten fotoplan.ts`);
  }
  return fout;
}

/* ---------- (a) bron: inhoud.ts van /lp/dakwerken ----------
   "stock-" alleen op een regel  import <naam> from '@/assets/bf/stock-<x>-<breedte>.webp';  (of de bron-jpg
   '@/assets/dak-stock/stock-<x>.jpg') en elke zo geïmporteerde naam
   alleen op een dia-regel ({ src: <naam>, ...) binnen "    dias: [" ... "    ]," of op de regel "foto: { src: <naam>, ..."
   binnen "  cta: {" ... "  },". Elk ander gebruik (waarom.duo, werk.fotos, voorna, reviews, diensten, een export, een
   spreiding) faalt. Wordt het bestand anders opgemaakt, dan faalt dit luid (exit 1), nooit stil. */
function lpBronToets(tekst) {
  const regels = tekst.split(/\r?\n/);
  const fout = [];
  const namen = [];
  regels.forEach((r, i) => {
    if (!/stock-[a-z]/.test(r)) return;
    const m = r.match(/^import (\w+) from '@\/assets\/(?:dak-stock\/stock-[a-z-]+\.jpg|bf\/stock-[a-z-]+-\d+\.webp)';\s*$/);
    if (m) namen.push(m[1]);
    else fout.push(`inhoud.ts r.${i + 1}: "stock-" buiten een import uit src/assets/dak-stock of src/assets/bf: ${r.trim().slice(0, 100)}`);
  });
  if (!namen.length) return { fout, namen };
  /* alleen binnen het object DAKWERKEN (het type KgjInhoud bovenaan heeft ook een regel "  cta: { ...") */
  const obj = regels.findIndex((r) => /^export const DAKWERKEN\b/.test(r));
  const blok = (begin, eind) => {
    if (obj < 0) return null;
    const b = regels.findIndex((r, j) => j > obj && begin.test(r));
    if (b < 0) return null;
    const e = regels.findIndex((r, j) => j > b && eind.test(r));
    return e < 0 ? null : [b, e];
  };
  const dias = blok(/^ {4}dias: \[/, /^ {4}\],/);
  const cta = blok(/^ {2}cta: \{/, /^ {2}\},/);
  const woord = new RegExp(`\\b(${namen.join('|')})\\b`);
  regels.forEach((r, i) => {
    if (/^import /.test(r) || /^\s*(\/\/|\*|\/\*)/.test(r) || !woord.test(r)) return;
    const inDias = !!dias && i > dias[0] && i < dias[1] && /^\s*\{ src: \w+,/.test(r);
    const inCta = !!cta && i > cta[0] && i < cta[1] && /^\s*foto: \{ src: \w+,/.test(r);
    if (!inDias && !inCta) fout.push(`inhoud.ts r.${i + 1}: stockbeeld buiten hero.dias en cta.foto: ${r.trim().slice(0, 100)}`);
  });
  return { fout, namen };
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
/* modus: true = /dakwerken (regels ongewijzigd), 'lp' = /lp/dakwerken (alleen hero-dia's en slotblokfoto), false = elders */
function paginaToets(modus) {
  const magStock = !!modus;
  const lp = modus === 'lp';
  /* BF-variant stock-<naam>-<breedte>.webp, of een LP-import /src/assets/dak-stock/stock-<naam>.jpg (dev-server) */
  const STOCK = /\/stock-[a-z0-9-]+?-\d+\.webp|\/stock-[a-z0-9-]+\.(?:jpe?g|png)/;
  const naamVan = (s) => { const m = String(s).match(/\/(stock-[a-z0-9-]+?)-\d+\.webp/) || String(s).match(/\/(stock-[a-z0-9-]+)\.(?:jpe?g|png)/); return m ? m[1] : null; };
  const VERBODEN = '.bf-paginakop, .bf-hero, #verhaal, .bf-dienstrij, .bf-proces, .bf-rslider-sectie, .bf-rslider, .bf-rproject, .bf-voorna, .bf-oc, .bf-eind, #realisaties, #werk';
  const TOEGESTAAN = '.bf-waarde__foto, .bf-dsectie__band';
  /* /lp/dakwerken: de dia's van de hero en de foto van het slotblok, in de BF-vorm (LpBf) en de KGJ-vorm (LpKgj) */
  const LP_DIA = '.bf-lphero__slides > img.bf-lphero__beeld, .kgj-hero__foto > .kgj-dia > img';
  const LP_SLOT = '#contact img.bf-lpinsp__beeld, #contact .kgj-cta__foto > img';
  const ALT = /\bAB\b|\b(ons|onze|wij|we|door)\b/i;
  const fout = [];
  const beelden = [...document.querySelectorAll('img')].filter((i) => STOCK.test(i.getAttribute('src') || '') || STOCK.test(i.getAttribute('srcset') || ''));
  const diaLijst = lp ? [...document.querySelectorAll(LP_DIA)] : [];
  const gezien = {};
  const lpPlek = {};
  for (const i of beelden) {
    const naam = naamVan(i.getAttribute('src')) || naamVan(i.getAttribute('srcset'));
    const blok = i.closest('section');
    const waar = blok ? (blok.id ? '#' + blok.id : '.' + String(blok.className).split(' ')[0]) : '(geen sectie)';
    if (!magStock) fout.push(`b: ${naam} op een route zonder stockfoto's (${waar})`);
    if (lp) {
      const dia = i.matches(LP_DIA) ? diaLijst.indexOf(i) + 1 : 0;
      const slot = i.matches(LP_SLOT);
      if (!dia && !slot) fout.push(`a: ${naam} buiten de hero-dia's en de slotblokfoto (${waar})`);
      const pl = (lpPlek[naam] = lpPlek[naam] || { dias: [], slot: 0 });
      if (dia) pl.dias.push(dia);
      if (slot) pl.slot++;
    } else {
      const verboden = i.closest(VERBODEN);
      if (verboden) fout.push(`a: ${naam} in een eigen-werkblok (${verboden.id ? '#' + verboden.id : '.' + String(verboden.className).split(' ')[0]})`);
      else if (!i.closest(TOEGESTAAN)) fout.push(`a: ${naam} niet op een toegestane plek (${waar})`);
    }
    if (ALT.test(i.alt || '')) fout.push(`c: ${naam} alt "${i.alt}"`);
    gezien[naam] = (gezien[naam] || 0) + 1;
  }
  if (lp) {
    /* precies één herhaling mag: een dia vanaf dia 2 opnieuw als slotblokfoto */
    for (const [n, k] of Object.entries(gezien)) {
      if (k < 2) continue;
      const pl = lpPlek[n] || { dias: [], slot: 0 };
      if (pl.dias.length > 1) fout.push(`d: ${n} ${pl.dias.length} keer in de hero-dia's (dia ${pl.dias.join(', ')})`);
      else if (pl.slot && pl.dias.includes(1)) fout.push(`d: ${n} in het slotblok herhaalt dia 1`);
      else if (!(k === 2 && pl.dias.length === 1 && pl.slot === 1)) fout.push(`d: ${n} ${k} keer op de pagina`);
    }
  } else {
    for (const [n, k] of Object.entries(gezien)) if (k > 1) fout.push(`d: ${n} ${k} keer op de pagina`);
  }
  /* ook buiten <img> (svg-image, inline stijl): op een route zonder stock telt elke vermelding, op de LP ook */
  if (!magStock || lp) {
    const andere = [...document.querySelectorAll('image, [style*="stock-"]')].filter((e) => STOCK.test(e.getAttribute('href') || e.getAttribute('xlink:href') || e.getAttribute('style') || ''));
    andere.forEach((e) => fout.push(lp ? `a: stockbeeld buiten <img> (${e.tagName.toLowerCase()})` : `b: stockbeeld buiten <img> (${e.tagName.toLowerCase()})`));
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
  /* positieve controle op de LP-bronregel: een kopie van inhoud.ts met een geplante stock-import die in waarom.duo
     gebruikt wordt, en een losse "stock-"-tekst; beide moeten gevonden worden, de echte regels niet opnieuw */
  {
    const lpBron = fs.readFileSync(LP_INHOUD, 'utf8');
    const voor = new Set(lpBronToets(lpBron).fout);
    const geplant = lpBron + "\nimport stockGeplant from '@/assets/dak-stock/stock-geplant.jpg';\nconst geplant = { waarom: { duo: [{ src: stockGeplant, alt: 'x' }] } };\nconst losGeplant = 'stock-zinkwerk';\n";
    const nieuw = lpBronToets(geplant).fout.filter((f) => !voor.has(f));
    if (!nieuw.some((f) => f.includes('buiten hero.dias en cta.foto')) || !nieuw.some((f) => f.includes('buiten een import'))) stop(2, `ONGELDIGE METING: de LP-bronregel vond de geplante overtredingen in inhoud.ts niet ${JSON.stringify(nieuw)}`);
    console.log(`  inhoud.ts: ${lpBronToets(lpBron).namen.length} stock-imports (${lpBronToets(lpBron).namen.join(', ')})`);
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
    let stockOpLp = 0;
    for (const pad of ROUTES) {
      const p = await open(pad);
      const mag = pad === TOEGESTANE_ROUTE;
      const m = await p.evaluate(paginaToets, mag ? true : pad === LP_ROUTE ? 'lp' : false);
      m.fout.forEach((f) => mis.push(`${pad}: ${f}`));
      if (pad === LP_ROUTE) {
        stockOpLp = m.aantal;
        console.log(`  ${pad}: ${m.aantal} stockbeelden (${m.namen.join(', ')})`);
        /* positieve controle LP: (a) in #waarom, (c) slechte alt, (d) dubbele dia en dia 1 als slotblokfoto */
        const ctl = await p.evaluate((tf) => {
          const toets = new Function('return (' + tf + ')')();
          const dias = [...document.querySelectorAll('.bf-lphero__slides > img.bf-lphero__beeld, .kgj-hero__foto > .kgj-dia > img')];
          const slot = document.querySelector('#contact img.bf-lpinsp__beeld, #contact .kgj-cta__foto > img');
          const waarom = document.querySelector('#waarom');
          const stock = dias.find((i) => /\/stock-/.test(i.getAttribute('src') || ''));
          if (!stock || !slot || !waarom) return { ok: false, reden: `dia met stock ${!!stock}, slotblokfoto ${!!slot}, #waarom ${!!waarom}` };
          const r = { ok: true };
          const a = stock.cloneNode(); a.className = ''; a.alt = 'neutraal'; waarom.appendChild(a);
          r.a = toets('lp').fout.some((f) => f.startsWith('a: ') && f.includes('#waarom'));
          a.remove();
          const c = stock.cloneNode(); c.alt = 'Dak gelegd door AB Bouw Groep'; stock.parentElement.appendChild(c);
          const rc = toets('lp').fout;
          r.c = rc.some((f) => f.startsWith('c: '));
          r.dHero = rc.some((f) => f.startsWith('d: ') && f.includes("hero-dia's"));
          c.remove();
          const oud = slot.getAttribute('src');
          slot.setAttribute('src', dias[0].getAttribute('src'));
          r.dSlot = toets('lp').fout.some((f) => f.startsWith('d: ') && f.includes('herhaalt dia 1'));
          slot.setAttribute('src', oud);
          return r;
        }, paginaToets.toString());
        if (!ctl.ok || !ctl.a || !ctl.c || !ctl.dHero || !ctl.dSlot) { await p.close(); stop(2, `ONGELDIGE METING: positieve controle op ${pad} faalt ${JSON.stringify(ctl)}`); }
      }
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
          /* ook de LP-vorm: een jpg-import uit src/assets/dak-stock */
          const jpg = document.createElement('img');
          jpg.setAttribute('src', '/src/assets/dak-stock/stock-geplant.jpg'); jpg.alt = 'x';
          (document.querySelector('main') || document.body).appendChild(jpg);
          const f = toets(false).fout;
          return f.some((x) => x.startsWith('b: stock-geplant ')) && f.filter((x) => x.startsWith('b: stock-geplant ')).length === 2;
        }, paginaToets.toString());
        if (!b) { await p.close(); stop(2, 'ONGELDIGE METING: positieve controle (b) op /gevel faalt (webp- en jpg-vorm)'); }
      }
      await p.close();
    }
    if (!stockOpDak) stop(2, `ONGELDIGE METING: 0 stockbeelden herkend op ${TOEGESTANE_ROUTE} (herkenning kapot, of de stock is bewust weg: pas dan deze guard aan)`);
    if (!stockOpLp) stop(2, `ONGELDIGE METING: 0 stockbeelden herkend op ${LP_ROUTE} (herkenning kapot, of de stock is bewust weg: pas dan deze guard aan)`);

    if (mis.length) {
      console.error(`check-stock: ${mis.length} overtredingen\n`);
      mis.forEach((x) => console.error('  FOUT: ' + x));
      console.error('\n  Een stockfoto is sfeerbeeld: alleen op /dakwerken, in "Wat wij doen" of de banner, en op /lp/dakwerken in de hero-dia\'s en de slotblokfoto, met een neutrale alt.');
      process.exitCode = 1;
    } else {
      console.log(`check-stock: ${ROUTES.length} routes + fotoplan.ts + inhoud.ts, 0 overtredingen, positieve controles (a)(b)(c)(d), LP (a)(c)(d) en bron gezien`);
    }
  } finally {
    if (browser) await browser.close();
    if (srv) srv.kill();
  }
})().catch((e) => stop(2, `ONGELDIGE METING: ${e.message}`));
