#!/usr/bin/env node
/**
 * Komt een adres met een anker eraan werkelijk bij die sectie uit?
 *
 * Aanleiding: 15 sep 2026. Voor de totaalrenovatie-campagne bouwde ik sitelinks
 * naar #calculator, #aanbod en #werk, naar het voorbeeld van de twee
 * concurrenten die het langst adverteren — die zetten allebei een sitelink naar
 * hun prijsberekening. Bij het nameten bleek dat GEEN ENKEL anker sprong, ook
 * #werkwijze niet, dat er al maanden in zat.
 *
 * De oorzaak is de volgorde: de browser zoekt het element op het moment dat hij
 * de pagina binnenkrijgt, en dan heeft React nog niets gerenderd. De secties
 * komen een tel later, maar de sprong is dan al voorbij. Er komt geen fout van,
 * de bezoeker landt gewoon bovenaan.
 *
 * Dat is duur zodra er advertenties op staan: iemand klikt op "Bereken uw prijs"
 * en komt bij de kop van de pagina terecht.
 *
 * Deze check opent elk anker als een echte bezoeker en kijkt of de sectie
 * bovenaan het scherm staat. Hij faalt ook als een anker niet bestaat.
 *
 * Draaien: node scripts/check-ankers.cjs   (start zelf een preview-server)
 *          LP_BASIS=http://127.0.0.1:4610 node scripts/check-ankers.cjs   (tegen een draaiende server, zonder bouwen)
 *
 * Elk anker opent op 1440x900 en op de gsm (390x844, touch), elk in een eigen browsercontext: koude cache, zoals
 * een bezoeker die op een advertentie klikt (12 okt 2026: met warme cache stond alles goed, koud landde een
 * sitelink op de gsm 115 px te laag). Op de LP's in de BF-stijl (.bf-lp) moet het anker op 4 px na op de
 * onderkant van de vaste kop (.kgj-kop) staan; elders blijft de grens 145 px. Is Plus Jakarta Sans op een
 * .bf-lp-pagina niet geladen, dan is de meting ongeldig (exit 2): zonder lettersprong geen drift, dus vals groen.
 *
 * Positieve controle op de meting zelf (12 okt 2026, LP's in de BF-stijl, spec §17): /lp/dakwerken#contact
 * opent één keer met een pagina die niet springt (scrollIntoView uitgeschakeld), één keer met een anker dat
 * niet bestaat, en één keer op 390 px koud met de code van vóór 12 okt (één zachte sprong, geen correctie na
 * het laden van de letter; gemeten 187 px); de meting moet alle drie als fout zien, anders exit 2.
 * Clarity, Google-tags en de leadverzoeken krijgen een leeg antwoord: geen vervuiling van de statistieken.
 *
 * Venster (12 okt 2026, spec §17 "#rekenaar opent op /lp/totaalrenovatie en /lp/aannemer-renovatiewerken het venster";
 * LpKgj r.218, LpBf r.257): op die twee pagina's moet #rekenaar ook de rekenaar in het venster openen (sitelink
 * "Bereken uw renovatieprijs"); op /lp/dakwerken en /lp/richtprijs-berekenen staat de rekenaar in de hero en blijft
 * het venster dicht. De ankers van /lp/totaalrenovatie gelden ook voor /lp/aannemer-renovatiewerken (zelfde
 * inhoudsobject, spread) en /lp/richtprijs-berekenen krijgt #rekenaar en #contact. Positieve controle: een meting
 * van /lp/totaalrenovatie#contact (venster dicht) moet als "venster ging niet open" gezien worden, anders exit 2.
 */
const { spawn, execSync } = require('node:child_process');
const { startPreview } = require('./_preview.cjs');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
let POORT = 4384;

/* Elk anker waar een navigatielink of een sitelink naartoe wijst. De sitelinks
   komen rechtstreeks uit ads/<campagne>/3-advertenties.json: op 26 sep liep de
   vaste lijst hier achter op de nieuwe /lp/totaalrenovatie (hij testte nog de
   ankers van de pagina van 15 sep). */
const DOELEN = [
  { pad: '/lp/badkamerrenovatie', ankers: ['schetser', 'werkwijze', 'contact', 'over'] },
  { pad: '/', ankers: ['over', 'werkwijze', 'contact'] },
];
{
  const fs = require('node:fs');
  const path = require('node:path');
  const ADS = path.join(__dirname, '..', 'ads');
  for (const map of fs.readdirSync(ADS)) {
    const bestand = path.join(ADS, map, '3-advertenties.json');
    if (!fs.existsSync(bestand)) continue;
    for (const s of JSON.parse(fs.readFileSync(bestand, 'utf8')).sitelinks || []) {
      const u = new URL(s.url);
      if (!u.hash) continue;
      let doel = DOELEN.find((d) => d.pad === u.pathname);
      if (!doel) DOELEN.push((doel = { pad: u.pathname, ankers: [] }));
      if (!doel.ankers.includes(u.hash.slice(1))) doel.ankers.push(u.hash.slice(1));
    }
  }
  /* Positieve controle: de sitelinks van beide campagnes moeten gelezen zijn. */
  for (const pad of ['/lp/dakwerken', '/lp/totaalrenovatie']) {
    if (!DOELEN.some((d) => d.pad === pad && d.ankers.length)) { console.error(`FOUT: geen sitelink-ankers gelezen voor ${pad} — de meting is ongeldig`); process.exit(2); }
  }
  /* 12 okt 2026 (spec §17): /lp/aannemer-renovatiewerken = spread van /lp/totaalrenovatie, dus dezelfde ankers; de
     rekenaarpagina /lp/richtprijs-berekenen draagt #rekenaar (hero) en #contact. */
  const totaal = DOELEN.find((d) => d.pad === '/lp/totaalrenovatie');
  if (!DOELEN.some((d) => d.pad === '/lp/aannemer-renovatiewerken')) DOELEN.push({ pad: '/lp/aannemer-renovatiewerken', ankers: [...totaal.ankers] });
  if (!DOELEN.some((d) => d.pad === '/lp/richtprijs-berekenen')) DOELEN.push({ pad: '/lp/richtprijs-berekenen', ankers: ['rekenaar', 'contact'] });
  if (!totaal.ankers.includes('rekenaar')) { console.error('FOUT: de sitelink #rekenaar van /lp/totaalrenovatie ontbreekt in de advertenties — de vensterproef is ongeldig'); process.exit(2); }
}

/* #rekenaar opent het venster met de rekenaar (VENSTER_OPEN) of laat het dicht (VENSTER_DICHT: rekenaar in de hero). */
const VENSTER_OPEN = ['/lp/totaalrenovatie', '/lp/aannemer-renovatiewerken'];
const VENSTER_DICHT = ['/lp/dakwerken', '/lp/richtprijs-berekenen'];

/* Hoe ver de sectie van de bovenrand mag staan na het springen. De vaste kop
   dekt de bovenste 137px af, dus dat is geen fout. */
const SPELING = 145;

/* LP's in de stijl van bfbouw.be (LpBf.tsx, wortel .bf-lp; spec §17): strenger. Het anker moet op de onderkant van de
   vaste kop (.kgj-kop) staan, met hoogstens 4 px speling. Bovenaan of onderaan de pagina, waar de browser niet verder
   kan scrollen, telt de plek waar het anker dan hoort te staan.
   Aanleiding 12 okt 2026: op de gsm landde een sitelink bij een eerste bezoek (koude cache, advertentieklik) 90 tot 115 px
   te laag (#contact en #werkwijze op 187 px, #diensten op 162 px; de kop eindigt op 72 px). De sprong liep vóór Plus
   Jakarta Sans geladen was; daarna werd de pagina boven het doel langer. De oude meting (1440x900, één gedeelde cache,
   speling 145 px) stond groen. */
const STRAK = 4;

/* Elk anker op 1440x900 en op de gsm (390x844), elk in een eigen browsercontext = koude cache, zoals een advertentieklik. */
const MATEN = [
  { width: 1440, height: 900 },
  { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
];

/* Lokaas voor de positieve controles (draait in de pagina vóór de app):
   geen = de pagina springt niet;
   oud  = de code van vóór 12 okt: één zachte sprong (scrollIntoView({ block: 'start' }) met CSS scroll-behavior smooth),
          zonder correctie na het laden van de letter (elke volgende sprong wordt genegeerd). */
const LOKAAS = {
  geen: () => { Element.prototype.scrollIntoView = function () {}; history.scrollRestoration = 'manual'; },
  oud: () => {
    const orig = Element.prototype.scrollIntoView;
    let n = 0;
    Element.prototype.scrollIntoView = function () { if (n++) return; orig.call(this, { block: 'start' }); };
  },
  /* kop112 = ankerruimte van de oude vaste gsm-kop (topbalk 40 + logorij 72) terwijl alleen de topbalk vast staat */
  kop112: () => {
    const zet = () => { const s = document.createElement('style'); s.textContent = 'html{scroll-padding-top:112px!important}'; document.head.appendChild(s); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', zet); else zet();
  },
};

const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

(async () => {
  /* Eigen build, vrije poort, en nagaan dat de server de eigen site serveert (scripts/_preview.cjs). */
  const server = process.env.LP_BASIS ? { pid: null } : await startPreview(POORT);
  const BASIS = process.env.LP_BASIS ? process.env.LP_BASIS.replace(/\/$/, '') : `http://localhost:${(POORT = server.poort)}`;
  let browser;
  try {
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { op = (await fetch(`${BASIS}/`)).ok; }
      catch { await new Promise((k) => setTimeout(k, 500)); }
    }
    if (!op) stop(2, 'FOUT: preview-server kwam niet op — de meting is ongeldig');

    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
    const fouten = [];
    let metingen = 0;

    /* Eén anker openen als een bezoeker die voor het eerst komt: eigen context (koude cache), gekozen maat. */
    const meetAnker = async (pad, anker, maat, lokaas) => {
      const ctx = await browser.createBrowserContext();
      try {
        const p = await ctx.newPage();
        await p.setRequestInterception(true);
        p.on('request', (r) => {
          const u = r.url();
          if (/^(tel|mailto):/.test(u)) return r.abort();
          if (/services\.leadconnectorhq\.com|api\.web3forms\.com/.test(u)) return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
          if (/clarity\.ms|googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
          return r.continue();
        });
        await p.setViewport(maat);
        await p.evaluateOnNewDocument(() =>
          localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true })));
        if (lokaas) await p.evaluateOnNewDocument(LOKAAS[lokaas]);
        await p.goto(`${BASIS}${pad}#${anker}`, { waitUntil: 'networkidle0', timeout: 90000 });
        /* Ruim wachten: de sprong herhaalt zichzelf terwijl beelden nalaadeen. */
        await new Promise((k) => setTimeout(k, 2600));
        return await p.evaluate((a) => {
          const e = document.getElementById(a);
          if (!e) return { er: false };
          const top = e.getBoundingClientRect().top;
          /* De onderkant van wat VAST staat. Op de renovatie-LP's met topbalk blijft op de gsm (<= 1000) alleen de topbalk
             (.kgj-topbalk, 40 px) vast en scrolt de logorij (header.kgj-kop, dan position absolute) mee weg, zoals live
             LpKgj (extra.ts r.1049-1055; lp-bf-ab.css, 13 okt). De onderkant van .kgj-kop zelf lag dan ver boven het scherm
             (gemeten 13 okt: verwacht -935 tot -4280 px, terwijl de sectie correct op 40 px onder de topbalk stond).
             Telt alleen een element dat fixed of sticky is; staat er niets vast, dan hoort het anker op 0. */
          const kopEl = document.querySelector('.kgj-kop');
          const vast = ['.kgj-kop', '.kgj-topbalk'].map((s) => document.querySelector(s))
            .filter((x) => x && /^(fixed|sticky)$/.test(getComputedStyle(x).position));
          const kop = kopEl ? Math.max(0, ...vast.map((x) => x.getBoundingClientRect().bottom)) : null;
          const docTop = top + window.scrollY;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const verwacht = kop == null ? null : docTop - Math.min(Math.max(docTop - kop, 0), max);
          return {
            er: true, top: Math.round(top), kop: kop == null ? null : Math.round(kop), verwacht: verwacht == null ? null : Math.round(verwacht),
            bfLp: !!document.querySelector('.bf-lp'), font: document.fonts.check('700 38px "Plus Jakarta Sans"'),
            venster: !!document.querySelector('[role="dialog"].kgj-venster .kgj-reken--venster'),
          };
        }, anker);
      } finally { await ctx.close(); }
    };
    /* #rekenaar: venster open waar de rekenaar in het vangnet staat, dicht waar hij in de hero staat. */
    const vensterFout = (pad, anker, maat, m) => {
      if (anker !== 'rekenaar') return null;
      const waar = `${pad}#${anker} (${maat.width}px)`;
      if (VENSTER_OPEN.includes(pad) && !m.venster) return `${waar}: het venster met de rekenaar ging niet open (spec §17)`;
      if (VENSTER_DICHT.includes(pad) && m.venster) return `${waar}: het venster ging open, de rekenaar staat hier in de hero`;
      return null;
    };
    const oordeel = (pad, anker, maat, m) => {
      const waar = `${pad}#${anker} (${maat.width}px)`;
      if (!m.er) return `${waar}: er is geen element met dat id`;
      const vf = vensterFout(pad, anker, maat, m);
      if (vf) return vf;
      if (m.bfLp) {
        if (m.kop == null) return `${waar}: de LP-kop draagt de klasse kgj-kop niet (spec §17)`;
        if (Math.abs(m.top - m.verwacht) > STRAK || Math.abs(m.top) > SPELING) return `${waar}: de sectie staat op ${m.top}px, onder de kop hoort ${m.verwacht}px — ${m.top - m.verwacht}px ernaast`;
        return null;
      }
      return Math.abs(m.top) > SPELING ? `${waar}: de sectie staat ${Math.abs(m.top)}px van de bovenrand — er is niet gesprongen` : null;
    };
    /* Een LP in de BF-stijl zonder geladen Plus Jakarta Sans meet geen lettersprong: vals groen, dus ongeldig. */
    const geldig = (pad, anker, maat, m) => {
      if (m.er && m.bfLp && !m.font) stop(2, `FOUT: Plus Jakarta Sans niet geladen op ${pad}#${anker} (${maat.width}px) — de meting is ongeldig`);
      return m;
    };

    /* Positieve controle op de meting: een pagina die niet springt, een anker dat niet bestaat, en de code van vóór
       12 okt (zachte sprong zonder correctie) op de gsm met koude cache (gemeten: #contact op 187 px). */
    const gsm = MATEN.find((m) => m.width === 390);
    const pc1 = oordeel('/lp/dakwerken', 'contact', MATEN[0], geldig('/lp/dakwerken', 'contact', MATEN[0], await meetAnker('/lp/dakwerken', 'contact', MATEN[0], 'geen')));
    const pc2 = oordeel('/lp/dakwerken', 'bestaat-niet', MATEN[0], await meetAnker('/lp/dakwerken', 'bestaat-niet', MATEN[0]));
    const pc3 = oordeel('/lp/dakwerken', 'contact', gsm, geldig('/lp/dakwerken', 'contact', gsm, await meetAnker('/lp/dakwerken', 'contact', gsm, 'oud')));
    if (!pc1 || !pc2 || !pc3) stop(2, `FOUT: positieve controle ziet de geplante fout niet (niet springen: ${pc1 || 'niet gezien'}; geen id: ${pc2 || 'niet gezien'}; zachte sprong zonder correctie op 390: ${pc3 || 'niet gezien'}) — de meting is ongeldig`);
    /* Positieve controle venster: /lp/totaalrenovatie#contact opent geen venster; als #rekenaar beoordeeld moet dat een fout zijn. */
    const pc4 = vensterFout('/lp/totaalrenovatie', 'rekenaar', MATEN[0], await meetAnker('/lp/totaalrenovatie', 'contact', MATEN[0]));
    if (!pc4) stop(2, 'FOUT: positieve controle venster: een pagina zonder open venster werd niet als fout gezien — de meting is ongeldig');
    /* Positieve controle topbalk (13 okt 2026): op de gsm staat op /lp/totaalrenovatie alleen de topbalk (40 px) vast.
       Landt het anker 72 px lager (scroll-padding van de oude kop van 112 px, lokaas 'kop112'), dan moet dat een fout zijn. */
    const pc5 = oordeel('/lp/totaalrenovatie', 'contact', gsm, geldig('/lp/totaalrenovatie', 'contact', gsm, await meetAnker('/lp/totaalrenovatie', 'contact', gsm, 'kop112')));
    if (!pc5) stop(2, 'FOUT: positieve controle topbalk: een anker 72 px onder de vaste topbalk werd niet als fout gezien — de meting is ongeldig');
    console.log(`positieve controle: ${pc1}; ${pc2}; ${pc3}; venster: ${pc4}; topbalk: ${pc5}`);

    /* Elk anker op elke maat, elk in een eigen context; ANKER_PARALLEL tegelijk (standaard 3). */
    const taken = [];
    for (const doel of DOELEN) for (const anker of doel.ankers) for (const maat of MATEN) taken.push({ pad: doel.pad, anker, maat });
    let volgende = 0;
    const werker = async () => {
      while (volgende < taken.length) {
        const t = taken[volgende++];
        const m = geldig(t.pad, t.anker, t.maat, await meetAnker(t.pad, t.anker, t.maat));
        metingen++;
        const f = oordeel(t.pad, t.anker, t.maat, m);
        if (f) fouten.push(f);
      }
    };
    await Promise.all(Array.from({ length: Math.max(1, Number(process.env.ANKER_PARALLEL || 3)) }, werker));

    /* Positieve controle: een run die niets opende bewijst niets. */
    const minimum = DOELEN.reduce((n, d) => n + d.ankers.length, 0) * MATEN.length;
    if (metingen < minimum) stop(2, `FOUT: maar ${metingen} van de ${minimum} ankers getest — de meting is ongeldig`);

    console.log(`check-ankers: ${metingen} metingen, elk anker als een bezoeker die voor het eerst komt (${MATEN.map((m) => m.width).join(' en ')} px)`);
    if (!fouten.length) {
      console.log('  elk anker brengt de bezoeker bij zijn sectie');
      process.exit(0);
    }
    console.log('');
    for (const f of fouten) console.log(`  FOUT: ${f}`);
    console.log('\n  Een sitelink die niet springt, zet de bezoeker bovenaan de pagina.');
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    if (server.pid) { try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ } }
  }
})();
