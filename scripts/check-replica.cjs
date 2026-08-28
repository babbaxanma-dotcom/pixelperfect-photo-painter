#!/usr/bin/env node
/**
 * Guard voor de replica-landingspagina.
 *
 * Aanleiding: drie keer op rij won een sitebrede regel uit
 * src/styles/ab-bouw.css van een klasse in replica/stijl.ts, en elke keer zag
 * je dat pas op een schermafdruk:
 *   1. "h1,h2,h3 { font-family: var(--font-display) }"  -> kop werd Archivo
 *      in plaats van Poppins;
 *   2. ".pcx h1 { margin: 0 }" (eigen basisregel) -> de kopmarge deed niets,
 *      de H1 stond 18px te hoog;
 *   3. "section { color: var(--ink) }" -> H1, navlinks en scorecijfer werden
 *      AB-navy #14233a in plaats van #131311.
 * Dit script toetst het resultaat in de browser, niet de CSS-bron, want alleen
 * de uitkomst van de cascade telt.
 *
 * Draaien:  node scripts/check-replica.cjs [url]
 * Standaard: http://localhost:8081/lp/totaalrenovatie
 */
const puppeteer = require('puppeteer-core');
const fs = require('node:fs');
const path = require('node:path');

const URL = process.argv[2] || 'http://localhost:8081/lp/totaalrenovatie';
const CHROME = process.env.CHROME_PAD || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

/** Kleuren die op deze pagina mogen voorkomen, als rgb-string. */
const PALET = {
  'rgb(19, 19, 17)': 'tekst',
  'rgb(68, 68, 68)': 'lopende tekst',
  'rgb(81, 81, 76)': 'grijs',
  'rgb(86, 86, 86)': 'staptekst',
  'rgb(87, 87, 87)': 'subtekst merken',
  'rgb(91, 89, 85)': 'grijs reviews en contact',
  'rgb(59, 58, 55)': 'reviewtekst',
  'rgb(74, 73, 69)': 'formulier-ondertitel',
  'rgb(86, 83, 79)': 'grijs 2',
  'rgb(255, 255, 255)': 'wit',
  'rgb(10, 22, 40)': 'AB-navy',
  'rgb(217, 140, 3)': 'AB-goud',
  'rgba(0, 0, 0, 0)': 'doorzichtig (fotogevulde tekst)',
};
/** Wat er beslist NIET mag: de tokens die uit ab-bouw.css lekken. */
const VERBODEN = { 'rgb(20, 35, 58)': '--ink uit ab-bouw.css', 'rgb(74, 84, 104)': '--ink-soft uit ab-bouw.css' };

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const pg = await browser.newPage();
  await pg.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
  await pg.evaluateOnNewDocument(() => {
    try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true, essential: true, ts: Date.now() })); } catch { /* private mode */ }
  });

  const paginafouten = [];
  pg.on('pageerror', (e) => paginafouten.push(String(e).slice(0, 160)));

  let res;
  try {
    res = await pg.goto(URL, { waitUntil: 'networkidle0', timeout: 45000 });
  } catch (e) {
    console.error(`FOUT: ${URL} niet bereikbaar (${String(e).split('\n')[0]}).`);
    console.error('Start eerst de dev-server vanuit de projectmap: npm run dev');
    await browser.close();
    process.exit(2);
  }

  const uit = await pg.evaluate(async () => {
    await document.fonts.ready;
    const wortel = document.querySelector('.pcx');
    if (!wortel) return { geenWortel: true };
    const elementen = [...wortel.querySelectorAll('h1, h2, h3, p, a, button, span, div, li, input')]
      .filter((e) => (e.textContent || '').trim().length > 0 || e.tagName === 'INPUT');
    const gezien = [];
    for (const e of elementen) {
      const c = getComputedStyle(e);
      gezien.push({
        tag: e.tagName.toLowerCase(),
        klasse: (typeof e.className === 'string' ? e.className : '').slice(0, 40),
        font: c.fontFamily.split(',')[0].replace(/["']/g, ''),
        kleur: c.color,
        tekst: (e.textContent || '').trim().slice(0, 30),
      });
    }
    return {
      aantal: elementen.length,
      gezien,
      poppins: [...document.fonts].filter((f) => f.family.replace(/["']/g, '') === 'Poppins' && f.status === 'loaded').length,
      h1: { ls: getComputedStyle(document.querySelector('.pc-h1') || document.body).letterSpacing },
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      tekens: document.body.innerText.trim().length,
    };
  });

  const fouten = [];
  if (uit.geenWortel) fouten.push('geen .pcx-wortel gevonden — verkeerde pagina of render mislukt');

  /* Geen enkele foto twee keer op de pagina. Mohammed heeft dit twee keer
     moeten aanwijzen ("weer 3 dezelfde foto's onder elkaar"), dus het wordt
     hier geteld in plaats van bekeken. */
  const bron = fs.readFileSync(path.join(__dirname, '..', 'src/pages/abbouw/lp/replica/LpReplica.tsx'), 'utf8');
  const verwijzingen = [
    ...[...bron.matchAll(/^import \w+ from '@\/assets\/([^']+)';$/gm)].map((m) => m[1].split('/').pop()),
    ...[...bron.matchAll(/'([a-z]+-p\d-[abc])'/g)].map((m) => m[1] + '.jpg'),
  ];
  const telFoto = {};
  for (const f of verwijzingen) telFoto[f] = (telFoto[f] || 0) + 1;
  const dubbeleFoto = Object.entries(telFoto).filter(([, n]) => n > 1);
  if (verwijzingen.length < 20) {
    fouten.push(`maar ${verwijzingen.length} beeldverwijzingen gevonden in de bron — de fototelling is ongeldig`);
  }
  if (dubbeleFoto.length) {
    fouten.push(`${dubbeleFoto.length} foto('s) staan meer dan één keer op de pagina: ${dubbeleFoto.map(([f, n]) => `${f} (${n}x)`).join(', ')}`);
  }

  /* Positieve controle: een check die niets onderzocht is geen groen licht. */
  if (!uit.geenWortel && uit.aantal < 30) {
    fouten.push(`slechts ${uit.aantal} elementen onderzocht — te weinig, de meting telt niet`);
  }
  if (!uit.geenWortel && uit.tekens < 400) fouten.push(`pagina bevat maar ${uit.tekens} tekens tekst`);
  if (!uit.geenWortel && uit.poppins < 3) fouten.push(`Poppins in ${uit.poppins} gewichten geladen, verwacht 4`);

  const verkeerdFont = (uit.gezien || []).filter((g) => g.font !== 'Poppins');
  if (verkeerdFont.length) {
    fouten.push(`${verkeerdFont.length} element(en) niet in Poppins, bv. <${verkeerdFont[0].tag}> "${verkeerdFont[0].tekst}" => ${verkeerdFont[0].font}`);
  }

  const lek = (uit.gezien || []).filter((g) => VERBODEN[g.kleur]);
  if (lek.length) {
    fouten.push(`${lek.length} element(en) met een gelekte sitekleur, bv. <${lek[0].tag}> "${lek[0].tekst}" => ${lek[0].kleur} (${VERBODEN[lek[0].kleur]})`);
  }
  const vreemd = (uit.gezien || []).filter((g) => !PALET[g.kleur] && !VERBODEN[g.kleur]);
  if (vreemd.length) {
    const lijst = [...new Set(vreemd.map((g) => g.kleur))].slice(0, 4).join(', ');
    fouten.push(`${vreemd.length} element(en) met een kleur buiten het palet: ${lijst}`);
  }

  if (!uit.geenWortel && uit.h1.ls === 'normal') {
    fouten.push('de H1 heeft geen letterspatie meer — .pcx * overrulet .pc-h1');
  }
  if (uit.overflow > 0) fouten.push(`horizontale overflow ${uit.overflow}px op 1200px`);

  /* mobiel: de referentie is een vaste 1200-opzet, maar hij mag niet uitsteken */
  await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await pg.reload({ waitUntil: 'networkidle0' });
  const mobUit = await pg.evaluate(() => {
    const over = document.documentElement.scrollWidth - window.innerWidth;
    if (over <= 0) return { over };
    /* meteen zeggen WELK element uitsteekt; een kaal getal is een zoekplaatje */
    /* Alleen elementen melden die NIET door een voorouder worden weggeknipt:
       een marquee binnen overflow:hidden steekt wel uit in zijn eigen
       rechthoek maar veroorzaakt geen paginabrede overflow. */
    const geknipt = (e) => {
      for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
        const o = getComputedStyle(n);
        if (/hidden|clip|auto|scroll/.test(o.overflowX)) return true;
      }
      return false;
    };
    const boosdoeners = [...document.querySelectorAll('.pcx *')]
      .map((e) => ({ e, r: e.getBoundingClientRect() }))
      .filter(({ e, r }) => r.right > window.innerWidth + 1 && r.width > 0 && !geknipt(e))
      .sort((a, b) => b.r.right - a.r.right)
      .slice(0, 3)
      .map(({ e, r }) => `<${e.tagName.toLowerCase()}${typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/s+/).join('.') : ''}> tot x=${Math.round(r.right)}`);
    return { over, boosdoeners };
  });
  if (mobUit.over > 0) {
    fouten.push(`horizontale overflow ${mobUit.over}px op 390px — ${(mobUit.boosdoeners || []).join(' | ')}`);
  }
  const mob = mobUit.over;

  if (paginafouten.length) fouten.push(`javascriptfout: ${paginafouten[0]}`);
  await browser.close();

  console.log(`check-replica: ${uit.aantal || 0} elementen getoetst op ${URL}`);
  console.log(`  ${verwijzingen.length} beeldverwijzingen, ${dubbeleFoto.length} dubbel`);
  console.log(`  http ${res.status()} · Poppins ${uit.poppins || 0} gewichten · overflow ${uit.overflow}px (1200) / ${mob}px (390)`);
  if (!fouten.length) { console.log('  alles in orde'); process.exit(0); }
  console.log('');
  for (const f of fouten) console.log(`  FOUT: ${f}`);
  process.exit(1);
})();
