#!/usr/bin/env node
/**
 * Guard op de kop van de site.
 *
 * Aanleiding: de kop bestaat TWEE keer. De homepage en de landingspaginas
 * renderen hem als JSX in LpReplica.tsx; de overige paginas zijn HTML-strings
 * en krijgen hem uit _rp.ts. Een React-component past niet in een string, dus
 * is die tweede versie met de hand overgetypt — en liep hij uit de pas:
 *
 *   - de diensten-link zit daar in een uitklap-wikkel en was dus een KLEINKIND
 *     van .pc-nav, waardoor de regel .pc-nav > a hem niet raakte: 8px breder,
 *     regelhoogte 16 in plaats van 14, en elke link erna schoof mee;
 *   - de chevron was 14x14 waar de andere versie er een van 10x6 gebruikt;
 *   - de iconen voor adres, e-mail en telefoon waren de RoofPro-varianten
 *     (17x17, lijndikte 2) in plaats van de PrimeCraft-versies (12x14 en
 *     15x13, lijndikte 1,5), waardoor de contactrij 2px lager stond;
 *   - de navigatie stond op een krappere variant van toen er nog zes links
 *     waren.
 *
 * Mohammed heeft dit twee keer moeten aanwijzen. Zolang er twee kopieen zijn,
 * bewaakt deze check dat ze gelijk blijven: hij meet elk element in de kop op
 * een pagina van elk soort en faalt bij het kleinste verschil.
 *
 * De echte oplossing is een van de twee kopieen weghalen. Zolang de binnen-
 * paginas HTML-strings zijn, kan dat niet zonder ze te herbouwen.
 *
 * Draaien: node scripts/check-kop.cjs   (start zelf een preview-server)
 */
const { spawn, execSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4351;

/* Een pagina van elk soort: de homepage (JSX-kop met eigen navigatie), een
   gewone binnenpagina en een divisiepagina (beide de HTML-kop). */
const PAGINAS = ['/', '/over', '/dakwerken', '/contact'];

/* Deze horen alleen bij de HTML-versie: het mobiele menu en de uitklap. Ze
   staan in rust op nul en zijn geen vormverschil. */
const ALLEEN_HTML = ['rp-dd', 'rp-dd__panel', 'rp-dd__item', 'rp-burger'];

(async () => {
  const server = spawn('npx', ['vite', 'preview', '--port', String(POORT), '--strictPort'],
    { shell: true, stdio: 'ignore' });
  let browser;
  try {
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { op = (await fetch(`http://localhost:${POORT}/`)).ok; } catch { await new Promise((k) => setTimeout(k, 500)); }
    }
    if (!op) { console.error('FOUT: preview-server kwam niet op — de meting is ongeldig'); process.exit(2); }

    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

    const meet = async (pad) => {
      const p = await browser.newPage();
      await p.setViewport({ width: 1440, height: 700 });
      await p.goto(`http://localhost:${POORT}${pad}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await p.evaluate(() => document.fonts.ready);
      await new Promise((k) => setTimeout(k, 700));
      const r = await p.evaluate(() => {
        const kop = document.querySelector('.pc-kop');
        if (!kop) return null;
        const uit = {};
        for (const n of kop.querySelectorAll('*')) {
          const kl = (n.className.baseVal !== undefined ? n.className.baseVal : n.className).toString().split(' ')[0];
          const b = n.getBoundingClientRect();
          if (b.width === 0 && b.height === 0) continue;
          const sleutel = (kl || n.tagName.toLowerCase()) + (n.tagName === 'svg' ? '(svg)' : '');
          if (uit[sleutel]) continue;
          const c = getComputedStyle(n);
          uit[sleutel] = [Math.round(b.width), Math.round(b.height), Math.round(b.left), Math.round(b.top),
            c.fontSize, c.fontWeight].join('|');
        }
        return uit;
      });
      await p.close();
      return r;
    };

    const gemeten = {};
    for (const pad of PAGINAS) {
      const m = await meet(pad);
      if (!m) { console.error(`FOUT: geen kop gevonden op ${pad} — de meting is ongeldig`); process.exit(2); }
      gemeten[pad] = m;
    }

    /* Positieve controle: vindt de meting te weinig onderdelen, dan bewijst
       "geen verschil" niets. De kop heeft logo, twee strepen, contactrij,
       navigatie met vijf links en het telefoonblok. */
    const aantal = Object.keys(gemeten['/']).length;
    if (aantal < 12) {
      console.error(`FOUT: maar ${aantal} onderdelen in de kop gevonden — de meting is ongeldig`);
      process.exit(2);
    }

    const basis = gemeten['/'];
    const fouten = [];
    for (const pad of PAGINAS.slice(1)) {
      for (const sleutel of new Set([...Object.keys(basis), ...Object.keys(gemeten[pad])])) {
        if (ALLEEN_HTML.includes(sleutel)) continue;
        const a = basis[sleutel];
        const b = gemeten[pad][sleutel];
        if (a === b) continue;
        const toon = (v) => {
          if (!v) return 'ontbreekt';
          const [w, h, l, t, fs, fw] = v.split('|');
          return `${w}x${h} op ${l},${t} · ${fs}/${fw}`;
        };
        fouten.push(`${pad} — ${sleutel}\n         homepage: ${toon(a)}\n         hier:     ${toon(b)}`);
      }
    }

    console.log(`check-kop: ${aantal} onderdelen vergeleken over ${PAGINAS.length} paginas`);
    if (!fouten.length) {
      console.log('  de kop staat op elke pagina op dezelfde pixel');
      process.exit(0);
    }
    console.log('');
    for (const f of fouten) console.log(`  FOUT: ${f}`);
    console.log('\n  De kop bestaat twee keer: als JSX in LpReplica.tsx en als HTML in _rp.ts.');
    console.log('  Wijzig je er een, wijzig dan de andere mee.');
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ }
  }
})();
