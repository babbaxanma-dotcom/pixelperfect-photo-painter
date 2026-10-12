#!/usr/bin/env node
/**
 * De huisstijl van de landingspagina's: hero en slotblok.
 *
 * Aanleiding: Mohammed moest twee keer een opmaak terugdraaien die hij niet gevraagd had.
 * Op 4 okt werden stappen-bolletjes en zekerheidskaarten proza. Op 5 okt werd de hero van
 * /lp/totaalrenovatie een wit tekstvlak op een onbedekte foto en het slotblok een licht vlak
 * ("wat heb je gedaan met het design!!!!", "haal die vierkante witte blok weg", "ga weer
 * richting oude design"). De huisstijl van zijn LP's:
 *
 *   1. hero: de foto vult de hele hero, er ligt een donkere laag over, de kop is wit;
 *   2. de heroknop (waar die er is) staat in het eerste scherm;
 *   3. slotblok (#contact): de foto staat erin, met een donkere laag, de kop is wit.
 *
 * Positieve controle: dezelfde metingen draaien ook op een pagina waar het afgekeurde witte
 * vlak en het lichte slotblok zijn ingespoten. Vinden ze daar niets, dan is de meting
 * ongeldig (exit 2): een controle die de fout niet kan zien, bewijst niets.
 *
 * 12 okt 2026 (spec/bf-stijl.md §17): de LP's krijgen een omhulsel in de stijl van bfbouw.be (LpBf.tsx).
 * Dezelfde drie regels, met de BF-selectors: hero .bf-lphero (foto .bf-lphero__slides, laag .bf-lphero__laag,
 * heroknop .bf-lphero__knop) en slotblok #contact.bf-lpinsp (foto .bf-lpinsp__beeld, laag .bf-lpinsp__laag,
 * kop .bf-lpinsp__tekst h2). Per pagina meet de toets de vorm die er staat; de positieve controle draait op
 * de eerste pagina van ELKE vorm die gemeten wordt.
 *
 * Draaien: node scripts/check-huisstijl.cjs   (start zelf een preview-server)
 *          LP_BASIS=http://127.0.0.1:4610 node scripts/check-huisstijl.cjs   (tegen een draaiende server, zonder bouwen)
 * Clarity, Google-tags en de leadverzoeken krijgen een leeg antwoord: geen vervuiling van de statistieken.
 */
const { startPreview } = require('./_preview.cjs');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PAGINAS = ['/lp/totaalrenovatie', '/lp/aannemer-renovatiewerken', '/lp/richtprijs-berekenen', '/lp/dakwerken'];
/* Desktop, krappe laptop (1366 x 680 na de browserbalken), iPhone, kleine Android. */
const SCHERMEN = [[1440, 900], [1366, 680], [390, 844], [360, 740]];
const WIT = 'rgb(255, 255, 255)';

/* Het afgekeurde ontwerp van 5 okt (bf474a9), voor de positieve controle. */
const AFGEKEURD = `
.kgj-hero__vlak { background: #fff !important; }
.kgj-hero h1 { color: #121417 !important; }
.kgj-hero::after { content: none !important; }
.kgj-cta { background: #f6f6f6 !important; }
.kgj-cta__foto { display: none !important; }
.kgj-cta::after { content: none !important; }
.kgj-cta__tekst h2 { color: #121417 !important; }`;
/* Hetzelfde afgekeurde ontwerp in de BF-vorm (LpBf.tsx). */
const AFGEKEURD_BF = `
.bf-lphero__tekst { background: #fff !important; }
.bf-lphero h1 { color: #121417 !important; }
.bf-lphero__laag { display: none !important; }
.bf-lpinsp { background: #f6f6f6 !important; }
.bf-lpinsp__beeld { display: none !important; }
.bf-lpinsp__laag { display: none !important; }
.bf-lpinsp__tekst h2 { color: #121417 !important; }`;

const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

/* Alle metingen op één geopende pagina; geeft de lijst met afwijkingen terug. */
async function meet(p, hoogte) {
  return p.evaluate((WIT, hoogte) => {
    const fout = [];
    if (document.querySelector('.bf-lphero')) {
      /* BF-vorm (LpBf.tsx) */
      const zicht = (e) => !!e && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
      const hero = document.querySelector('.bf-lphero');
      const hr = hero.getBoundingClientRect();
      const foto = hero.querySelector('.bf-lphero__slides');
      const fr = foto && foto.getBoundingClientRect();
      const dia = foto && foto.querySelector('img.bf-is-on');
      if (!fr || !zicht(foto) || !zicht(dia) || getComputedStyle(dia).opacity === '0') fout.push('hero: geen foto');
      else if (fr.height < hr.height * 0.95 || fr.width < hr.width * 0.95) fout.push(`hero: de foto vult de hero niet (${Math.round(fr.width)}x${Math.round(fr.height)} van ${Math.round(hr.width)}x${Math.round(hr.height)})`);
      const laag = hero.querySelector('.bf-lphero__laag');
      if (!zicht(laag) || getComputedStyle(laag).backgroundImage === 'none') fout.push('hero: geen donkere laag over de foto');
      const h1 = hero.querySelector('h1');
      if (!h1 || getComputedStyle(h1).color !== WIT) fout.push(`hero: kop is niet wit (${h1 && getComputedStyle(h1).color})`);
      for (const el of hero.querySelectorAll('.bf-lphero__in > *, .bf-lphero__tekst')) {
        if (el.querySelector('h1') && getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)') fout.push(`hero: het tekstvlak heeft een eigen achtergrond (${getComputedStyle(el).backgroundColor})`);
      }
      const knop = hero.querySelector('.bf-lphero__knop');
      if (knop) {
        const b = Math.round(knop.getBoundingClientRect().bottom + window.scrollY);
        if (b > hoogte) fout.push(`hero: knop onder het eerste scherm (${b}px van ${hoogte}px)`);
      }
      const cta = document.querySelector('#contact.bf-lpinsp');
      if (!cta) fout.push('slotblok: geen #contact.bf-lpinsp');
      else {
        if (!zicht(cta.querySelector('.bf-lpinsp__beeld'))) fout.push('slotblok: geen foto');
        const cl = cta.querySelector('.bf-lpinsp__laag');
        if (!zicht(cl) || getComputedStyle(cl).backgroundImage === 'none') fout.push('slotblok: geen donkere laag');
        const h2 = cta.querySelector('.bf-lpinsp__tekst h2');
        if (!h2 || getComputedStyle(h2).color !== WIT) fout.push(`slotblok: kop is niet wit (${h2 && getComputedStyle(h2).color})`);
      }
      return fout;
    }
    const hero = document.querySelector('.kgj-hero');
    if (!hero) return ['geen .kgj-hero en geen .bf-lphero gevonden'];
    const hr = hero.getBoundingClientRect();
    const foto = hero.querySelector('.kgj-hero__foto');
    const fr = foto && foto.getBoundingClientRect();
    if (!fr || getComputedStyle(foto).display === 'none') fout.push('hero: geen foto');
    else if (fr.height < hr.height * 0.95 || fr.width < hr.width * 0.95) fout.push(`hero: de foto vult de hero niet (${Math.round(fr.width)}x${Math.round(fr.height)} van ${Math.round(hr.width)}x${Math.round(hr.height)})`);
    const laag = getComputedStyle(hero, '::after');
    if (laag.content === 'none' || laag.backgroundImage === 'none') fout.push('hero: geen donkere laag over de foto');
    const h1 = hero.querySelector('h1');
    if (!h1 || getComputedStyle(h1).color !== WIT) fout.push(`hero: kop is niet wit (${h1 && getComputedStyle(h1).color})`);
    /* Een tekstvlak met een eigen achtergrond (het witte blok). */
    for (const el of hero.querySelectorAll('.kgj-hero__raster > *, .kgj-hero__vlak')) {
      if (el.querySelector('h1') && getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)') fout.push(`hero: het tekstvlak heeft een eigen achtergrond (${getComputedStyle(el).backgroundColor})`);
    }
    const knop = hero.querySelector('.kgj-hero__knop');
    if (knop) {
      const b = Math.round(knop.getBoundingClientRect().bottom + window.scrollY);
      if (b > hoogte) fout.push(`hero: knop onder het eerste scherm (${b}px van ${hoogte}px)`);
    }
    const cta = document.querySelector('#contact.kgj-cta');
    if (!cta) fout.push('slotblok: geen #contact.kgj-cta');
    else {
      const cf = cta.querySelector('.kgj-cta__foto');
      if (!cf || getComputedStyle(cf).display === 'none') fout.push('slotblok: geen foto');
      const cl = getComputedStyle(cta, '::after');
      if (cl.content === 'none' || cl.backgroundImage === 'none') fout.push('slotblok: geen donkere laag');
      const h2 = cta.querySelector('.kgj-cta__tekst h2');
      if (!h2 || getComputedStyle(h2).color !== WIT) fout.push(`slotblok: kop is niet wit (${h2 && getComputedStyle(h2).color})`);
    }
    return fout;
  }, WIT, hoogte);
}

(async () => {
  const server = process.env.LP_BASIS ? { kill: () => {} } : await startPreview(4386);
  const BASIS = process.env.LP_BASIS ? process.env.LP_BASIS.replace(/\/$/, '') : `http://localhost:${server.poort}`;
  let browser;
  try {
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { op = (await fetch(`${BASIS}/`)).ok; }
      catch { await new Promise((k) => setTimeout(k, 500)); }
    }
    if (!op) stop(2, 'FOUT: preview-server kwam niet op — de meting is ongeldig');
    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

    const open = async (pad, breedte, hoogte, extraCss) => {
      const p = await browser.newPage();
      /* geen echte leads, geen Clarity-opname, geen Google-tags vanuit de toets */
      await p.setRequestInterception(true);
      p.on('request', (r) => {
        const u = r.url();
        if (/services\.leadconnectorhq\.com|api\.web3forms\.com/.test(u)) return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
        if (/clarity\.ms|googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
        return r.continue();
      });
      await p.setViewport({ width: breedte, height: hoogte, isMobile: breedte < 500, hasTouch: breedte < 500 });
      await p.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false })));
      await p.goto(`${BASIS}${pad}`, { waitUntil: 'networkidle0', timeout: 60000 });
      if (extraCss) await p.addStyleTag({ content: extraCss });
      await p.evaluate(() => document.fonts.ready);
      await new Promise((k) => setTimeout(k, 600));
      return p;
    };

    /* Positieve controle: het afgekeurde ontwerp moet gevonden worden, in elke vorm die gemeten wordt
       (KGJ: LpKgj.tsx, BF: LpBf.tsx). Een vorm zonder eigen controle maakt de meting ongeldig. */
    const vormen = {};
    for (const pad of PAGINAS) {
      const p = await open(pad, 1440, 900);
      const vorm = await p.evaluate(() => (document.querySelector('.bf-lphero') ? 'bf' : document.querySelector('.kgj-hero') ? 'kgj' : 'onbekend'));
      await p.close();
      if (vorm === 'onbekend') stop(2, `FOUT: ${pad} heeft geen .kgj-hero en geen .bf-lphero — de meting is ongeldig`);
      if (!vormen[vorm]) vormen[vorm] = pad;
    }
    let gevonden = [];
    for (const [vorm, pad] of Object.entries(vormen)) {
      const pc = await open(pad, 1440, 900, vorm === 'bf' ? AFGEKEURD_BF : AFGEKEURD);
      const g = await meet(pc, 900);
      await pc.close();
      if (g.length < 4) stop(2, `FOUT: positieve controle (${vorm}, ${pad}) vond ${g.length} van de ingespoten fouten — de meting is ongeldig:\n  ${g.join('\n  ')}`);
      gevonden = gevonden.concat(g);
    }

    const fouten = [];
    let metingen = 0;
    for (const pad of PAGINAS) {
      for (const [breedte, hoogte] of SCHERMEN) {
        const p = await open(pad, breedte, hoogte);
        for (const f of await meet(p, hoogte)) fouten.push(`${pad} @${breedte}x${hoogte}: ${f}`);
        metingen++;
        await p.close();
      }
    }
    if (fouten.length) stop(1, `NIET AF — huisstijl van hero of slotblok gewijzigd (${fouten.length}):\n  ${fouten.join('\n  ')}`);
    console.log(`AF — huisstijl hero en slotblok op ${metingen} metingen (${PAGINAS.length} pagina's x ${SCHERMEN.length} schermen); positieve controle vond ${gevonden.length} ingespoten fouten in ${Object.entries(vormen).map(([v, p]) => `${v} (${p})`).join(' + ')}.`);
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch((e) => stop(2, `FOUT: ${e.message} — de meting is ongeldig`));
