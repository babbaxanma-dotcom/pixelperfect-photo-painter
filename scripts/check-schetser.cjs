#!/usr/bin/env node
/**
 * Guard op de badkamerschetser.
 *
 * De sectie belooft dat het voorbeeldbeeld meeverandert met de tegelkeuze. Dat
 * is precies het soort belofte dat stil kan breken: een verkeerde sleutel in de
 * beeldenbank en de bezoeker klikt zich suf op hetzelfde beeld, zonder dat er
 * ergens een fout verschijnt.
 *
 * Deze check draait de echte pagina in Chrome, doorloopt elke tegeloptie en
 * eist dat er evenveel VERSCHILLENDE beelden verschijnen als er opties met een
 * eigen beeld zijn. Hij faalt ook als hij de sectie niet vindt: een meting die
 * niets tegenkomt bewijst niets.
 *
 * Draaien: node scripts/check-schetser.cjs   (start zelf een preview-server)
 */
const { spawn, execSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4321;
const ADRES = `http://localhost:${POORT}/badkamerrenovatie`;

/* De tegels waarvan een eigen beeld bestaat. Komt er een look bij, dan hoort
   deze lijst mee te groeien — anders vangt de check de nieuwe niet. */
const MET_EIGEN_BEELD = ['Betonlook grijs', 'Antraciet', 'Marmerlook wit', 'Beige zandsteen', 'Houtlook', 'Microcement'];

/* Beide takken worden gemeten. De check draaide alleen de tak MET toilet; de
   tak zonder had toen ook maar een beeld. Nu bestaan alle twaalf combinaties,
   en een halve meting zou de helft van de belofte ongetoetst laten. */
const TAKKEN = [
  { naam: 'met toilet', knop: 3 },
  { naam: 'zonder toilet', knop: 4 },
];

const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

(async () => {
  const server = spawn('npx', ['vite', 'preview', '--port', String(POORT), '--strictPort'],
    { shell: true, stdio: 'ignore' });
  const afsluiten = () => { try { process.kill(-server.pid); } catch { /* al weg */ } try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ } };

  let browser;
  try {
    /* wachten tot de server antwoordt, niet blind slapen */
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { const r = await fetch(`http://localhost:${POORT}/`); op = r.ok; } catch { await new Promise((k) => setTimeout(k, 500)); }
    }
    if (!op) stop(2, 'FOUT: preview-server kwam niet op — de meting is ongeldig');

    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
    const p = await browser.newPage();
    await p.setViewport({ width: 1440, height: 1000 });
    await p.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true })));
    await p.goto(ADRES, { waitUntil: 'networkidle0', timeout: 60000 });

    const sectie = await p.$('#schetser');
    if (!sectie) stop(2, 'FOUT: de schetser-sectie staat niet op de pagina — de meting is ongeldig');

    /* stap 1: grootte, want zonder grootte en toilet verschijnt er geen beeld */
    const knoppen = await p.$$('#schetser .pc-schets-keuzes button');
    if (knoppen.length < 5) stop(2, `FOUT: maar ${knoppen.length} keuzeknoppen gevonden — de meting is ongeldig`);
    await knoppen[1].click();            // Gemiddeld
    await knoppen[3].click();            // Ja, toilet erin

    const beeldSrc = () => p.$eval('#schetser .pc-schets-beeld img', (n) => n.getAttribute('src'));
    const onder = () => p.$eval('#schetser .pc-schets-beeld figcaption', (n) => n.textContent.trim());

    const eerste = await beeldSrc();
    if (!eerste) stop(2, 'FOUT: geen voorbeeldbeeld na het kiezen van grootte en toilet — de meting is ongeldig');

    /* stap 2: per tak elke tegeloptie langs, en het beeld uitlezen */
    const fouten = [];
    const gezien = new Map();
    for (const tak of TAKKEN) {
      await p.$$eval(`#schetser .pc-schets-keuzes button`, (ns, i) => ns[i].click(), tak.knop);
      for (const tegel of MET_EIGEN_BEELD) {
        await p.select('#schetser select', tegel);
        await new Promise((k) => setTimeout(k, 120));
        gezien.set(`${tak.naam}|${tegel}`, { tak: tak.naam, tegel, src: await beeldSrc(), onderschrift: await onder() });
      }
    }

    /* Elke combinatie hoort een eigen beeld te tonen: twee takken die hetzelfde
       laten zien is even fout als twee looks die hetzelfde laten zien. */
    const verwacht = MET_EIGEN_BEELD.length * TAKKEN.length;
    const unieke = new Set([...gezien.values()].map((v) => v.src));
    if (unieke.size !== verwacht) {
      fouten.push(`${verwacht} combinaties, maar ${unieke.size} verschillende beelden — minstens twee tonen hetzelfde`);
    }
    for (const v of gezien.values()) {
      if (!v.onderschrift.toLowerCase().includes(v.tegel.toLowerCase())) {
        fouten.push(`"${v.tegel}" gekozen ${v.tak}, maar het onderschrift zegt "${v.onderschrift}"`);
      }
    }

    /* "Staat er niet tussen" is een keuze, geen terugval: de bezoeker beschrijft
       het zelf in het veld eronder. Het onderschrift hoort dan de basis te noemen
       zonder excuus — een excuus zou suggereren dat er iets misging.

       Het vangnet zelf (een look zonder eigen beeld toont de basis mét uitleg) is
       hier niet meer te meten nu elke combinatie bestaat. Dat staat in
       Schetser.test.ts, waar de keuze met een onvolledige beeldenbank draait. */
    await p.select('#schetser select', 'anders');
    await new Promise((k) => setTimeout(k, 120));
    const anders = await onder();
    if (/noteren wij/i.test(anders) || !/betonlook/i.test(anders)) {
      fouten.push(`"staat er niet tussen" hoort de basis te tonen zonder excuus, maar het onderschrift zei "${anders}"`);
    }

    console.log(`check-schetser: ${gezien.size} combinaties doorlopen over ${TAKKEN.length} takken, ${unieke.size} verschillende beelden`);
    if (!fouten.length) { console.log('  het beeld volgt elke tegelkeuze en het onderschrift klopt'); process.exit(0); }
    console.log('');
    for (const f of fouten) console.log(`  FOUT: ${f}`);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    afsluiten();
  }
})();
