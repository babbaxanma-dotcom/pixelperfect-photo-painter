#!/usr/bin/env node
/**
 * Guard op bediening zonder gevolg.
 *
 * Aanleiding: de badkamerschetser had zeven vragen waarvan er vier zichtbaar
 * niets deden. Je koos walnoot, geborsteld goud, een ligbad en vloerverwarming,
 * en er veranderde nergens iets op het scherm. Toen Mohammed dat aanwees zette
 * ik er een zin onder die uitlegde waarom — het probleem beschrijven in plaats
 * van oplossen. Zijn antwoord: "dat is toch een zichtbaar probleem?"
 *
 * Deze check vangt die fout voordat hij uitgeleverd wordt. Hij bedient elke
 * keuzeknop en elke keuzelijst op de pagina en eist dat de pagina daarna
 * meetbaar anders is. Verandert er niets, dan is de bezoeker aan het klikken op
 * iets wat hem niets oplevert, en faalt de check.
 *
 * Wat telt als verandering: een ander beeld, andere tekst, of een ander element
 * dat als gekozen gemarkeerd staat. Een verandering die alleen in de code
 * bestaat — een variabele die meegaat in het formulier — telt hier NIET, want
 * de bezoeker ziet die niet. Dat is precies het gat dat dit moet dichten.
 *
 * Draaien: node scripts/check-keuzes.cjs   (start zelf een preview-server)
 */
const { spawn, execSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4371;

/* Secties met bediening die de bezoeker iets moet opleveren. Komt er een
   configurator bij, dan hoort hij hier. */
const DOELEN = [
  {
    pad: '/badkamerrenovatie', sectie: '#schetser', naam: 'badkamerschetser',
    /*
     * Hoeveel keuzegroepen de bezoeker een BEELD moeten laten zien.
     *
     * Zeven vragen, waarvan er vijf over uiterlijk gaan: de ruimte, het toilet,
     * de tegel, het meubel en de kraan. Die vijf tonen beeld — de eerste drie
     * door het voorbeeldbeeld te veranderen, de laatste twee met stalen. De
     * andere twee, indeling en verwarming, zijn geen materiaal en kunnen dat
     * niet; die landen in het keuzelijstje.
     *
     * Dit getal gaat alleen omhoog. Zakt het, dan is een keuze van beeld naar
     * tekst gedegradeerd, en dat is precies de fout die deze check bestaat om
     * te vangen.
     */
    metBeeld: 5,
  },
];

/* Knoppen die de pagina verlaten of een paneel openen veranderen per definitie
   iets anders dan de sectie; die horen niet in deze meting. */
const OVERSLAAN = ['submit', 'reset'];

/*
 * Bediening die buiten de pagina uitkomt en hier dus niets kan veranderen.
 *
 * Deze twee openen de bestandskiezer van het besturingssysteem. Een browser
 * zonder scherm krijgt dat venster niet, dus meet deze check daar niets — het
 * is geen bediening zonder gevolg. De lijst blijft met opzet kort en per stuk
 * beredeneerd: elke naam die je hier toevoegt haalt een stuk van de belofte
 * uit de meting.
 */
const BUITEN_DE_PAGINA = [
  'Foto van uw badkamer maken',
  'of kies er een uit uw toestel',
];

const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

/** Een vingerafdruk van alles wat de bezoeker in de sectie kan zien. */
const vingerafdruk = (sel) => {
  const s = document.querySelector(sel);
  if (!s) return null;
  const beelden = [...s.querySelectorAll('img')].map((i) => i.getAttribute('src') || '').join('|');
  const gekozen = [...s.querySelectorAll('[aria-pressed="true"], .is-aan, :checked, option:checked')]
    .map((e) => (e.textContent || '').trim() + '#' + (e.className || '')).join('|');
  return beelden + '@@' + s.innerText.replace(/\s+/g, ' ').trim() + '@@' + gekozen;
};

(async () => {
  const server = spawn('npx', ['vite', 'preview', '--port', String(POORT), '--strictPort'],
    { shell: true, stdio: 'ignore' });
  let browser;
  try {
    let op = false;
    for (let i = 0; i < 60 && !op; i++) {
      try { op = (await fetch(`http://localhost:${POORT}/`)).ok; } catch { await new Promise((k) => setTimeout(k, 500)); }
    }
    if (!op) stop(2, 'FOUT: preview-server kwam niet op — de meting is ongeldig');

    browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
    const fouten = [];
    let bediend = 0;

    for (const doel of DOELEN) {
      const p = await browser.newPage();
      await p.setViewport({ width: 1440, height: 1000 });
      await p.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true })));
      await p.goto(`http://localhost:${POORT}${doel.pad}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await new Promise((k) => setTimeout(k, 900));

      if (!(await p.$(doel.sectie))) stop(2, `FOUT: ${doel.naam}: ${doel.sectie} staat niet op ${doel.pad} — de meting is ongeldig`);

      /* Eerst de sectie in een staat brengen waarin alle bediening zichtbaar is;
         een configurator toont zijn latere vragen pas na de eerste keuzes. */
      const eersteKnoppen = await p.$$(`${doel.sectie} button`);
      for (const k of eersteKnoppen.slice(0, 4)) { try { await k.click(); await new Promise((r) => setTimeout(r, 120)); } catch { /* onzichtbaar */ } }
      await new Promise((k) => setTimeout(k, 300));

      /*
       * Per keuzegroep: laat bedienen de bezoeker een beeld zien?
       *
       * Dat kan op twee manieren. Het voorbeeldbeeld verandert mee, of de keuze
       * bestaat zelf uit stalen. Een groep die alleen een tekstregel oplevert
       * telt niet mee — dat was de toestand die werd afgekeurd.
       */
      const beeldBron = () => {
        const s = document.querySelector('#schetser');
        return [...s.querySelectorAll('.pc-schets-beeld img')].map((i) => i.getAttribute('src')).join('|');
      };
      let groepenMetBeeld = 0;

      /* Eerst een geldige begintoestand. Zonder grootte EN toilet toont de
         schetser nog geen voorbeeldruimte, en dan meet de eerste groep het
         verschil tussen niets en niets. */
      const ks0 = await p.$$(`${doel.sectie} .pc-schets-keuzes button`);
      await ks0[1].click(); await new Promise((k) => setTimeout(k, 150));
      await ks0[3].click(); await new Promise((k) => setTimeout(k, 250));

      /* De ruimte- en toiletknoppen vormen samen de eerste twee groepen. Binnen
         een groep wordt alleen een optie aangeklikt die nog niet aan staat: een
         knop die al gekozen is verandert terecht niets. */
      for (const [van, tot] of [[0, 3], [3, 5]]) {
        const voorB = await p.evaluate(beeldBron);
        const ks = await p.$$(`${doel.sectie} .pc-schets-keuzes button`);
        for (let i = van; i < tot && i < ks.length; i++) {
          const aan = await ks[i].evaluate((b) => b.classList.contains('is-aan'));
          if (aan) continue;
          try { await ks[i].click(); } catch { continue; }
          await new Promise((k) => setTimeout(k, 150));
        }
        const naB = await p.evaluate(beeldBron);
        if (voorB !== naB) groepenMetBeeld++;
      }

      /* Stalengroepen laten het beeld bij de keuze zelf zien. */
      groepenMetBeeld += await p.$$eval(`${doel.sectie} .pc-schets-stalen`,
        (gs) => gs.filter((g) => g.querySelectorAll('img').length > 1).length);

      /* Elke keuzelijst: elke optie langs. */
      const lijsten = await p.$$(`${doel.sectie} select`);
      for (let i = 0; i < lijsten.length; i++) {
        const opties = await lijsten[i].$$eval('option', (os) => os.filter((o) => !o.disabled).map((o) => o.value));
        const naam = await p.evaluate((sel, idx) => {
          const l = document.querySelectorAll(sel + ' select')[idx];
          const label = l.closest('label');
          return (label && label.querySelector('span') ? label.querySelector('span').textContent : 'lijst ' + idx).trim();
        }, doel.sectie, i);

        let lijstRaaktBeeld = false;
        for (const waarde of opties) {
          const voor = await p.evaluate(vingerafdruk, doel.sectie);
          const voorB = await p.evaluate(beeldBron);
          await lijsten[i].select(waarde);
          await new Promise((k) => setTimeout(k, 160));
          const na = await p.evaluate(vingerafdruk, doel.sectie);
          const naB = await p.evaluate(beeldBron);
          bediend++;
          if (voorB !== naB) lijstRaaktBeeld = true;
          if (voor === na) fouten.push(`${doel.naam}: "${naam}" op "${waarde}" verandert niets op het scherm`);
        }
        if (lijstRaaktBeeld) groepenMetBeeld++;
      }

      /* Elke knop in de sectie. */
      const knoppen = await p.$$(`${doel.sectie} button`);
      for (let i = 0; i < knoppen.length; i++) {
        const soort = await knoppen[i].evaluate((b) => b.type + '|' + (b.textContent || '').trim().slice(0, 30));
        if (OVERSLAAN.includes(soort.split('|')[0])) continue;
        if (BUITEN_DE_PAGINA.includes(soort.split('|')[1])) continue;
        const zichtbaar = await knoppen[i].evaluate((b) => b.getBoundingClientRect().width > 0);
        if (!zichtbaar) continue;

        const voor = await p.evaluate(vingerafdruk, doel.sectie);
        try { await knoppen[i].click(); } catch { continue; }
        await new Promise((k) => setTimeout(k, 160));
        const na = await p.evaluate(vingerafdruk, doel.sectie);
        bediend++;
        /* Een knop die al gekozen was verandert niets, en dat is juist gedrag.
           Daarom telt alleen een knop die NIET al aan stond. */
        const wasAan = await knoppen[i].evaluate((b) => b.classList.contains('is-aan') || b.getAttribute('aria-pressed') === 'true');
        if (voor === na && !wasAan) fouten.push(`${doel.naam}: knop "${soort.split('|')[1]}" verandert niets op het scherm`);
      }
      if (groepenMetBeeld < doel.metBeeld) {
        fouten.push(`${doel.naam}: ${groepenMetBeeld} keuzegroepen laten een beeld zien, er worden er ${doel.metBeeld} verwacht`
          + ' — een keuze is van beeld naar tekst gedegradeerd');
      }
      console.log(`  ${doel.naam}: ${groepenMetBeeld} van ${doel.metBeeld} keuzegroepen tonen beeld`);
      await p.close();
    }

    /* Positieve controle: vindt de meting te weinig bediening, dan bewijst
       "alles verandert iets" niets. De schetser heeft drie keuzelijsten, elk met
       meerdere opties, plus vijf ruimte- en toiletknoppen en negen stalen. */
    if (bediend < 25) stop(2, `FOUT: maar ${bediend} bedieningen gemeten — de meting is ongeldig`);

    console.log(`check-keuzes: ${bediend} bedieningen op ${DOELEN.length} sectie(s)`);
    if (!fouten.length) {
      console.log('  elke knop en elke keuze levert de bezoeker iets zichtbaars op');
      process.exit(0);
    }
    console.log('');
    for (const f of fouten) console.log(`  FOUT: ${f}`);
    console.log('\n  Een bedienbaar element dat niets verandert, laat de bezoeker klikken');
    console.log('  zonder resultaat. Los het op of haal de bediening weg; een zin die');
    console.log('  uitlegt waarom er niets gebeurt, telt niet als oplossing.');
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ }
  }
})();
