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
}

/* Hoe ver de sectie van de bovenrand mag staan na het springen. De vaste kop
   dekt de bovenste 137px af, dus dat is geen fout. */
const SPELING = 145;

const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

(async () => {
  /* Eigen build, vrije poort, en nagaan dat de server de eigen site serveert (scripts/_preview.cjs). */
  const server = await startPreview(POORT); POORT = server.poort;
  let browser;
  try {
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { op = (await fetch(`http://localhost:${POORT}/`)).ok; }
      catch { await new Promise((k) => setTimeout(k, 500)); }
    }
    if (!op) stop(2, 'FOUT: preview-server kwam niet op — de meting is ongeldig');

    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
    const fouten = [];
    let metingen = 0;

    for (const doel of DOELEN) {
      for (const anker of doel.ankers) {
        const p = await browser.newPage();
        await p.setViewport({ width: 1440, height: 900 });
        await p.evaluateOnNewDocument(() =>
          localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true })));
        await p.goto(`http://localhost:${POORT}${doel.pad}#${anker}`, { waitUntil: 'networkidle0', timeout: 60000 });
        /* Ruim wachten: de sprong herhaalt zichzelf terwijl beelden nalaadeen. */
        await new Promise((k) => setTimeout(k, 2600));

        const m = await p.evaluate((a) => {
          const e = document.getElementById(a);
          if (!e) return { er: false };
          return { er: true, afstand: Math.round(Math.abs(e.getBoundingClientRect().top)) };
        }, anker);
        await p.close();
        metingen++;

        if (!m.er) fouten.push(`${doel.pad}#${anker}: er is geen element met dat id`);
        else if (m.afstand > SPELING) {
          fouten.push(`${doel.pad}#${anker}: de sectie staat ${m.afstand}px van de bovenrand — er is niet gesprongen`);
        }
      }
    }

    /* Positieve controle: een run die niets opende bewijst niets. */
    const minimum = DOELEN.reduce((n, d) => n + d.ankers.length, 0);
    if (metingen < minimum) stop(2, `FOUT: maar ${metingen} van de ${minimum} ankers getest — de meting is ongeldig`);

    console.log(`check-ankers: ${metingen} ankers geopend als een bezoeker`);
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
    try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ }
  }
})();
