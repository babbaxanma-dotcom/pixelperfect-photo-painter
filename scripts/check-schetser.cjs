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
   dit getal mee te groeien — anders vangt de check de nieuwe niet. */
const MET_EIGEN_BEELD = ['Betonlook grijs', 'Antraciet', 'Marmerlook wit', 'Beige zandsteen', 'Houtlook', 'Microcement'];

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

    /* stap 1: grootte en toilet, want zonder die twee verschijnt er geen beeld */
    const knoppen = await p.$$('#schetser .pc-schets-keuzes button');
    if (knoppen.length < 5) stop(2, `FOUT: maar ${knoppen.length} keuzeknoppen gevonden — de meting is ongeldig`);
    await knoppen[1].click();            // Gemiddeld
    await knoppen[3].click();            // Ja, toilet erin

    const beeldSrc = () => p.$eval('#schetser .pc-schets-beeld img', (n) => n.getAttribute('src'));
    const onder = () => p.$eval('#schetser .pc-schets-beeld figcaption', (n) => n.textContent.trim());

    const eerste = await beeldSrc();
    if (!eerste) stop(2, 'FOUT: geen voorbeeldbeeld na het kiezen van grootte en toilet — de meting is ongeldig');

    /* stap 2: elke tegeloptie langs, en het beeld uitlezen */
    const gezien = new Map();
    for (const tegel of MET_EIGEN_BEELD) {
      await p.select('#schetser select', tegel);
      await new Promise((k) => setTimeout(k, 120));
      gezien.set(tegel, { src: await beeldSrc(), onderschrift: await onder() });
    }

    const fouten = [];
    const unieke = new Set([...gezien.values()].map((v) => v.src));
    if (unieke.size !== MET_EIGEN_BEELD.length) {
      fouten.push(`${MET_EIGEN_BEELD.length} tegellooks, maar ${unieke.size} verschillende beelden — minstens twee opties tonen hetzelfde`);
    }
    for (const [tegel, v] of gezien) {
      if (!v.onderschrift.toLowerCase().includes(tegel.toLowerCase())) {
        fouten.push(`"${tegel}" gekozen, maar het onderschrift zegt "${v.onderschrift}"`);
      }
    }

    /* positieve controle: een look zonder eigen beeld moet WEL terugvallen én
       dat zeggen. Vindt hij dat niet, dan meet de check de eerlijkheid niet. */
    await p.$$eval('#schetser .pc-schets-keuzes button', (ns) => ns[4].click());  // apart toilet
    await p.select('#schetser select', 'Antraciet');
    await new Promise((k) => setTimeout(k, 120));
    const terugval = await onder();
    if (!/noteren wij/i.test(terugval)) {
      fouten.push(`terugval niet gemeld: bij een combinatie zonder eigen beeld zei het onderschrift "${terugval}"`);
    }

    console.log(`check-schetser: ${gezien.size} tegellooks doorlopen, ${unieke.size} verschillende beelden`);
    if (!fouten.length) { console.log('  het beeld volgt elke tegelkeuze en het onderschrift klopt'); process.exit(0); }
    console.log('');
    for (const f of fouten) console.log(`  FOUT: ${f}`);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    afsluiten();
  }
})();
