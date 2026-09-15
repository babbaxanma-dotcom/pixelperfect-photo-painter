/**
 * De landingspagina's van de concurrenten die het langst adverteren: welke kop
 * staat er boven, in welke volgorde staan de secties, welke knoppen staan erop
 * en wat bieden ze aan.
 *
 * Alleen de bedrijven die vandaag op "totaalrenovatie" betalen of die volgens
 * het register van Google al honderden dagen doorgaan. De rest zegt niets over
 * wat werkt.
 *
 * Draaien: node oogst-sites.cjs <uit.json>
 */
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const UIT = process.argv[2] || 'sites.json';

const SITES = [
  'https://www.verelst.be/renovatie',
  'https://www.tifre.be',
  'https://www.kijzer.be',
  'https://www.domico.be/totaalrenovatie',
  'https://www.reno-x.be',
  'https://www.interieurkabinet.be',
  'https://www.totalinteriorconcept.be',
  'https://www.gravagroup.be',
  'https://www.kapareno.be',
  'https://www.martha-bouwteam.be',
  'https://www.vanderydt.com',
  'https://www.taelmanconstruct.be',
  'https://www.ruverko-totaalproject.be',
  'https://www.dhoore-construct.be',
  'https://www.rinovato.be',
  'https://www.kwadro.be',
  'https://www.gentbouw.be',
  'https://www.bear-renovations.com',
  'https://www.victorrenoveert.be',
  'https://www.debouwmakker.be',
];

const wacht = (ms) => new Promise((k) => setTimeout(k, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const uit = [];

  try {
    for (const [i, adres] of SITES.entries()) {
      const p = await browser.newPage();
      await p.setViewport({ width: 1440, height: 900 });
      let meting = { adres, fout: null };
      try {
        await p.goto(adres, { waitUntil: 'networkidle2', timeout: 45000 });
        await wacht(2200);
        meting = await p.evaluate((adres) => {
          const tekst = document.body.innerText;
          const schoon = (s) => s.replace(/\s+/g, ' ').trim();

          /* Wat staat er boven de vouw: alles wat in de eerste schermhoogte valt. */
          const boven = [];
          for (const el of document.querySelectorAll('h1, h2, p, a, button, span')) {
            const r = el.getBoundingClientRect();
            if (r.top < 0 || r.top > 820 || r.height < 8) continue;
            const t = schoon(el.innerText || '');
            if (t && t.length > 2 && t.length < 160 && !boven.includes(t)) boven.push(t);
          }

          const koppen = [...document.querySelectorAll('h1, h2')]
            .map((h) => schoon(h.innerText)).filter(Boolean).slice(0, 14);

          const knoppen = [...new Set([...document.querySelectorAll('a, button')]
            .map((b) => schoon(b.innerText))
            .filter((t) => t && t.length > 2 && t.length < 46
              && /vraag|bereken|plan|contact|offerte|afspraak|bel|gesprek|start|ontdek|bekijk|gratis|simuleer|ontvang/i.test(t)))]
            .slice(0, 14);

          /* Staat er een formulier in het eerste scherm? */
          const velden = [...document.querySelectorAll('input, textarea, select')]
            .filter((v) => v.type !== 'hidden');
          const formulierBoven = velden.some((v) => {
            const r = v.getBoundingClientRect();
            return r.top >= 0 && r.top < 820 && r.height > 8;
          });

          const heeft = (re) => re.test(tekst);
          return {
            adres,
            titel: document.title.slice(0, 90),
            h1: schoon((document.querySelector('h1') || {}).innerText || ''),
            bovenDeVouw: boven.slice(0, 12),
            koppen,
            knoppen,
            formulierBoven,
            velden: velden.length,
            woorden: tekst.split(/\s+/).length,
            fotos: document.querySelectorAll('img').length,
            aanbod: {
              gratisBezoek: heeft(/gratis (plaatsbezoek|werfbezoek|bezoek|offerte|advies|intake)/i),
              prijsTool: heeft(/bereken|simuleer|prijs ?(indicatie|schatting|calculator)|richtprijs/i),
              garantie: heeft(/\d+ jaar garantie|garantie inbegrepen|\bgarantie\b/i),
              premieBtw: heeft(/premie|6% ?btw|btw-tarief|subsidie/i),
              vastePrijs: heeft(/vaste prijs|prijs vooraf|geen meerwerk|geen verrassingen/i),
              eigenPloeg: heeft(/eigen (ploeg|team|personeel|vakmensen|mensen|arbeiders)/i),
              termijn: (tekst.match(/binnen \d+ ?(werkdag|werkdagen|dag|dagen|uur|u|week|weken)/i) || [])[0] || null,
              reviews: (tekst.match(/(\d[,.]\d)\s*\/?\s*5|\d+\s*(reviews|beoordelingen|recensies)/i) || [])[0] || null,
              aantalProjecten: (tekst.match(/\d{2,4}\+?\s*(projecten|realisaties|renovaties|woningen)/i) || [])[0] || null,
            },
          };
        }, adres);
      } catch (e) { meting = { adres, fout: String(e.message).slice(0, 60) }; }
      await p.close();
      uit.push(meting);
      console.log(`${String(i + 1).padStart(2)}/${SITES.length} ${adres.replace('https://www.', '').padEnd(34)} ${meting.fout ? 'FOUT ' + meting.fout : meting.h1.slice(0, 50)}`);
      fs.writeFileSync(UIT, JSON.stringify(uit, null, 1));
    }
  } finally {
    await browser.close();
  }

  const goed = uit.filter((x) => !x.fout).length;
  console.log(`\nKLAAR: ${goed} van de ${SITES.length} sites gelezen`);
  if (goed < SITES.length / 2) { console.error('FOUT: te veel sites mislukt — ongeldige meting'); process.exit(1); }
})();
