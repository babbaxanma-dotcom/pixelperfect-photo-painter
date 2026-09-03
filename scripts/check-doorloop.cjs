/**
 * De doorloop van de badkamerschetser, van eerste vraag tot verzendknop.
 *
 * Aanleiding: de schetser toonde zeven vragen onder elkaar. Mohammed wilde er
 * één per scherm, die vanzelf doorgaat, met de mogelijkheid om een eerder
 * antwoord aan te passen, en zonder te moeten scrollen.
 *
 * Wat hier bewezen moet worden:
 *   - er staat één vraag tegelijk op het scherm;
 *   - een keuze brengt je vanzelf naar de volgende vraag;
 *   - elke vraag komt één keer voor en de laatste stap is het formulier;
 *   - je kunt op een eerder antwoord klikken, het aanpassen, en de rest blijft;
 *   - elke VRAAG past in het venster zonder te scrollen.
 *
 * De slotstap valt buiten die laatste eis: daar staan een fotoknop, drie velden,
 * een verzendknop en de geruststelling. Dat is een formulier, en een formulier
 * mag langer zijn dan het scherm. Wel wordt gemeten dat de verzendknop binnen
 * anderhalf scherm ligt, zodat hij nooit ver weg staat.
 *
 * Draaien: node doorloop-test.cjs   (start zelf een preview-server)
 */
const { spawn, execSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4420;
const SP = process.argv[2];

(async () => {
  const srv = spawn('npx', ['vite', 'preview', '--port', String(POORT), '--strictPort'],
    { shell: true, stdio: 'ignore' });
  let br, stuk = 0, metingen = 0;
  const fout = (m) => { stuk++; console.log('  FOUT: ' + m); };
  try {
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { op = (await fetch(`http://localhost:${POORT}/`)).ok; }
      catch { await new Promise((k) => setTimeout(k, 500)); }
    }
    if (!op) { console.error('FOUT: preview-server kwam niet op — de meting is ongeldig'); process.exit(2); }
    br = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

    for (const [w, h, tag] of [[1440, 900, 'pc'], [1366, 620, 'laptop'], [390, 844, 'gsm']]) {
      const p = await br.newPage();
      await p.setViewport({ width: w, height: h, isMobile: w < 500, hasTouch: w < 500,
        deviceScaleFactor: w < 500 ? 2 : 1 });
      await p.evaluateOnNewDocument(() =>
        localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true })));
      await p.goto(`http://localhost:${POORT}/lp/badkamerrenovatie`, { waitUntil: 'networkidle0' });
      await p.evaluate(() => document.fonts.ready);
      await new Promise((k) => setTimeout(k, 900));

      const stand = () => p.evaluate(() => {
        const s = document.querySelector('#schetser');
        const vraag = s.querySelector('.pc-schets-vraag h3');
        const form = s.querySelector('.pc-schets-form');
        const verstuur = form && form.querySelector('button[type=submit]');
        const r = s.getBoundingClientRect();
        return {
          vraag: vraag ? vraag.textContent.trim() : null,
          koppen: s.querySelectorAll('.pc-schets-vraag h3').length,
          terug: [...s.querySelectorAll('.pc-schets-terug button')].map((b) => b.textContent.trim()),
          heeftForm: !!form,
          /* De afstand van de bovenkant van de sectie tot de verzendknop. */
          totVerstuur: verstuur
            ? Math.round(verstuur.getBoundingClientRect().bottom - r.top) : null,
          hoogte: Math.round(r.height),
          vouw: window.innerHeight,
        };
      });

      const gezien = [];
      for (let i = 0; i < 12; i++) {
        const s = await stand();
        metingen++;
        gezien.push(s.vraag);

        /* Eén vraag tegelijk. */
        if (s.koppen !== 1) fout(`${tag}: ${s.koppen} vragen tegelijk in beeld op stap ${i + 1}`);

        if (s.heeftForm) {
          /* De slotstap: geen scroll-eis, wel een verzendknop die niet ver weg
             staat. */
          if (s.totVerstuur === null) fout(`${tag}: geen verzendknop op de slotstap`);
          else if (s.totVerstuur > s.vouw * 1.5) {
            fout(`${tag}: de verzendknop staat ${s.totVerstuur}px diep, meer dan anderhalf scherm`);
          }
          break;
        }

        /* Elke vraag past in het venster. */
        if (s.hoogte > s.vouw) {
          fout(`${tag}: "${s.vraag}" is ${s.hoogte}px hoog in een venster van ${s.vouw}px`);
        }

        const klikte = await p.evaluate(() => {
          const b = [...document.querySelectorAll('#schetser .pc-schets-vraag button')]
            .filter((x) => x.offsetParent !== null)[0];
          if (!b) return false;
          b.click();
          return true;
        });
        if (!klikte) { fout(`${tag}: geen keuzeknop op "${s.vraag}"`); break; }
        await new Promise((k) => setTimeout(k, 480));
      }

      const eind = await stand();
      console.log(`${tag.padEnd(8)}${gezien.length} stappen, eindigt op het formulier`
        + `; verzendknop op ${eind.totVerstuur} van ${eind.vouw}px`);

      if (!eind.heeftForm) fout(`${tag}: de doorloop eindigt niet op het formulier`);
      if (gezien.length < 6) fout(`${tag}: maar ${gezien.length} stappen, verwacht er minstens 6`);
      if (new Set(gezien).size !== gezien.length) {
        fout(`${tag}: dezelfde vraag kwam twee keer: ${gezien.join(' / ')}`);
      }

      /* Terugklikken en aanpassen, zonder de rest te verliezen. */
      const aantal = eind.terug.length;
      if (aantal < 5) fout(`${tag}: maar ${aantal} antwoorden om op terug te klikken`);
      else {
        const voor = await p.evaluate(() => {
          const b = document.querySelectorAll('#schetser .pc-schets-terug button')[0];
          const tekst = b.textContent.trim();
          b.click();
          return tekst;
        });
        await new Promise((k) => setTimeout(k, 450));
        const na = await stand();
        metingen++;
        if (!na.vraag || na.heeftForm) fout(`${tag}: terugklikken bracht geen vraag terug`);
        if (na.terug.length !== aantal) {
          fout(`${tag}: na terugklikken nog ${na.terug.length} van de ${aantal} antwoorden`);
        }
        await p.evaluate(() => {
          const b = [...document.querySelectorAll('#schetser .pc-schets-vraag button')]
            .filter((x) => x.offsetParent !== null);
          (b[1] || b[0]).click();
        });
        await new Promise((k) => setTimeout(k, 480));
        const naWijziging = await p.evaluate(() =>
          document.querySelectorAll('#schetser .pc-schets-terug button')[0].textContent.trim());
        metingen++;
        if (naWijziging === voor) fout(`${tag}: het antwoord veranderde niet na een andere keuze`);
        else console.log(' '.repeat(8) + `terug en aangepast: "${voor}" werd "${naWijziging}", `
          + `alle ${aantal} antwoorden bewaard`);
      }

      if (SP) await p.screenshot({ path: `${SP}/doorloop-${tag}.png` });
      await p.close();
    }

    /* Positieve controle: een run die niets doorliep bewijst niets. */
    if (metingen < 3 * 8) {
      console.error(`FOUT: maar ${metingen} metingen — de doorloop is niet echt doorlopen`);
      process.exit(2);
    }

    console.log(`\ndoorloop-test: ${metingen} metingen over 3 schermen`);
    console.log(stuk ? `  ${stuk} fouten` : '  één vraag per scherm, past in beeld, en aanpassen werkt');
    process.exit(stuk ? 1 : 0);
  } finally {
    if (br) await br.close();
    try { execSync(`taskkill /PID ${srv.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ }
  }
})();
