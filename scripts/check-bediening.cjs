#!/usr/bin/env node
/**
 * Stresstest van de schuifknoppen onder de aanbod- en reviewsporen.
 *
 * Aanleiding: Mohammed meldde "dit pijltje werkt soms niet". Oorzaak was dat de
 * stand van een spoor pas werd opgemeten bij het eerste scroll-event: tot dat
 * moment stond max op de beginwaarde 1, was de voorwaarde "links >= max - 2"
 * al waar en stond de knop "volgende" uitgeschakeld. Je zag dat alleen als je
 * meteen na het laden klikte — daarom "soms".
 *
 * Deze test klikt echt, meet de scrollpositie ervoor en erna, en loopt elk
 * spoor van begin tot eind en terug. Een knop die niets doet is een fout, ook
 * als hij er goed uitziet.
 *
 * Draaien: node scripts/check-bediening.cjs [url]
 */
const puppeteer = require('puppeteer-core');

const BASIS = process.argv[2] || 'http://localhost:8080';
const PADEN = ['/totaalrenovatie', '/badkamerrenovatie'];
const CHROME = process.env.CHROME_PAD || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BREEDTES = [1200, 768, 390];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new', protocolTimeout: 180000,
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });

  const fouten = [];
  let geklikt = 0;

  for (const pad of PADEN) {
  for (const breedte of BREEDTES) {
    const pg = await browser.newPage();
    await pg.setViewport({ width: breedte, height: 900, deviceScaleFactor: 1 });
    await pg.evaluateOnNewDocument(() => {
      try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true, essential: true, ts: Date.now() })); } catch { /* leeg */ }
    });
    await pg.goto(BASIS + pad, { waitUntil: 'networkidle0', timeout: 60000 });
    await pg.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
      await document.fonts.ready;
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
      window.scrollTo(0, 0);
      for (let n = 0; n < 60 && ![...document.images].every((i) => i.complete && i.naturalWidth > 0); n++) {
        await new Promise((r) => setTimeout(r, 200));
      }
    });

    const sporen = await pg.evaluate(() => [...document.querySelectorAll('.pc-bediening')].map((b, i) => i));
    if (!sporen.length) { fouten.push(`${pad} ${breedte}px: geen enkele bediening gevonden — de meting telt niet`); await pg.close(); continue; }

    for (const i of sporen) {
      const naam = await pg.evaluate((n) => {
        const b = document.querySelectorAll('.pc-bediening')[n];
        return b.querySelector('button')?.getAttribute('aria-label') || `spoor ${n}`;
      }, i);

      /* 1. meteen na het laden moet "volgende" bruikbaar zijn als er te schuiven valt */
      const beginstand = await pg.evaluate((n) => {
        const b = document.querySelectorAll('.pc-bediening')[n];
        const spoor = b.previousElementSibling?.querySelector('[class*="spoor"]') || b.parentElement.querySelector('[class*="spoor"]');
        const k = b.querySelectorAll('button');
        return {
          teSchuiven: spoor ? spoor.scrollWidth - spoor.clientWidth : 0,
          volgendeUit: k[1].disabled, vorigeUit: k[0].disabled, links: spoor ? spoor.scrollLeft : -1,
        };
      }, i);
      if (beginstand.teSchuiven > 20 && beginstand.volgendeUit) {
        fouten.push(`${pad} ${breedte}px · ${naam}: "volgende" staat uit terwijl er ${Math.round(beginstand.teSchuiven)}px te schuiven valt`);
      }
      if (beginstand.links === -1) { fouten.push(`${pad} ${breedte}px · ${naam}: het spoor zelf niet gevonden`); continue; }
      if (beginstand.teSchuiven <= 20) continue;

      /* Loopt dit spoor rond? Dan wordt het hieronder anders getoetst. */
      const lus = await pg.evaluate((n) => {
        const b = document.querySelectorAll('.pc-bediening')[n];
        const spoor = b.parentElement.querySelector('[class*="spoor"]');
        return spoor && spoor.dataset.lus ? spoor.children.length / 2 : 0;
      }, i);

      /* 2. tien keer vooruit klikken: elke klik moet de positie echt verzetten,
            tot het spoor aan het eind ligt.
            NIET voor een spoor dat rondloopt: daar is terugspringen naar het
            begin juist het gewenste gedrag, en bij acht foto's valt die sprong
            binnen de tien klikken. Voor die sporen doet punt 3a de echte toets
            (naad, uitlijning), en die is strenger. */
      if (!lus) {
      let vorige = beginstand.links;
      let aanEind = false;
      for (let klik = 0; klik < 10 && !aanEind; klik++) {
        const uit = await pg.evaluate(async (n) => {
          const b = document.querySelectorAll('.pc-bediening')[n];
          const spoor = b.parentElement.querySelector('[class*="spoor"]');
          const knop = b.querySelectorAll('button')[1];
          if (knop.disabled) return { uitgeschakeld: true, links: spoor.scrollLeft };
          knop.click();
          await new Promise((r) => setTimeout(r, 600));
          return { uitgeschakeld: false, links: spoor.scrollLeft, max: spoor.scrollWidth - spoor.clientWidth };
        }, i);
        geklikt++;
        if (uit.uitgeschakeld) { aanEind = true; break; }
        if (uit.links <= vorige + 2) {
          if (uit.links >= uit.max - 2) { aanEind = true; break; }
          fouten.push(`${pad} ${breedte}px · ${naam}: klik ${klik + 1} op "volgende" verzette niets (bleef op ${Math.round(uit.links)}px van ${Math.round(uit.max)}px)`);
          break;
        }
        vorige = uit.links;
      }

      }

      /* 3a. een spoor dat rondloopt (data-lus) heeft geen eind: daar telt of de
             lus naadloos sluit. De reeks staat twee keer in de DOM; na precies
             één reeks aan stappen moet dezelfde foto weer vooraan staan en mag
             de uitlijning geen millimeter zijn weggekropen. Twee fouten die
             hier al in zaten: de terugsprong ging over scrollWidth / 2 (één
             goot te kort) en de stap was geschat op breedte + 25 terwijl de
             goot 12px is op een telefoon — samen 13px wegkruipen per stap. */
      if (lus) {
        const stappen = await pg.evaluate(async (n, reeks) => {
          const b = document.querySelectorAll('.pc-bediening')[n];
          const spoor = b.parentElement.querySelector('[class*="spoor"]');
          const knop = b.querySelectorAll('button')[1];
          spoor.style.scrollBehavior = 'auto';
          spoor.scrollLeft = 0;
          const vooraan = () => {
            const t = [...spoor.children]
              .map((f) => ({ src: (f.querySelector('img') || {}).src || '', x: Math.round(f.offsetLeft - spoor.scrollLeft) }))
              .filter((f) => f.x > -5).sort((a, c) => a.x - c.x)[0];
            return t ? { src: t.src.split('/').pop(), x: t.x } : null;
          };
          /* Wachten tot het spoor ECHT stilstaat. scrollTo schuift met
             behavior:'smooth' en trekt zich niets aan van scroll-behavior in
             de stijl; klikken op een vaste tik van 60ms vertrekt dan halverwege
             de vorige beweging en stapelt een fout op die er niet is. */
          const stil = async () => {
            const begin = Date.now();
            let vorig = -1;
            let gelijk = 0;
            for (let n = 0; n < 60; n++) {
              await new Promise((r) => setTimeout(r, 25));
              const nu = Math.round(spoor.scrollLeft);
              gelijk = nu === vorig ? gelijk + 1 : 0;
              vorig = nu;
              /* Drie gelijke metingen ÉN het animatievenster voorbij. Aan het
                 begin van een smooth scroll staat de stand nog even stil; wie
                 dan al doorklikt, klikt midden in de vorige beweging en de
                 telling loopt achter op wat er te zien is. */
              if (gelijk >= 3 && Date.now() - begin > 500) return;
            }
          };
          const rij = [];
          for (let k = 0; k <= reeks + 1; k++) {
            rij.push(vooraan());
            knop.click();
            await stil();
          }
          spoor.style.scrollBehavior = '';
          spoor.scrollLeft = 0;
          return rij;
        }, i, lus);
        geklikt += stappen.length;
        if (stappen.length < lus + 2 || stappen.some((s) => !s)) {
          fouten.push(`${pad} ${breedte}px · ${naam}: de lus-meting leverde ${stappen.length} standen op — ongeldig`);
        } else {
          if (stappen[lus].src !== stappen[0].src) {
            fouten.push(`${pad} ${breedte}px · ${naam}: na ${lus} stappen staat ${stappen[lus].src} vooraan in plaats van ${stappen[0].src} — de lus sluit niet`);
          }
          /* Na de terugsprong moet exact de tweede foto vooraan staan. Deze
             toets is de enige die de SPRONG zelf meet: de naadtoets hierboven
             kijkt naar de tegel vlak vóór de sprong en blijft groen als de
             sprong op de verkeerde tegel uitkomt. Bewezen met een positieve
             controle: één tegel mis in de terugsprong maakt deze regel rood. */
          if (stappen[lus + 1].src !== stappen[1].src) {
            fouten.push(`${pad} ${breedte}px · ${naam}: na de terugsprong staat ${stappen[lus + 1].src} vooraan in plaats van ${stappen[1].src} — de lus springt naar de verkeerde foto`);
          }
          const drift = Math.max(...stappen.map((s) => Math.abs(s.x - stappen[0].x)));
          if (drift > 2) {
            fouten.push(`${pad} ${breedte}px · ${naam}: de uitlijning kruipt ${drift}px weg over ${lus} stappen — de stapgrootte klopt niet met de goot`);
          }
        }
        continue;
      }

      /* 3b. aan het eind moet "vorige" bruikbaar zijn en terugbrengen */
      const terug = await pg.evaluate(async (n) => {
        const b = document.querySelectorAll('.pc-bediening')[n];
        const spoor = b.parentElement.querySelector('[class*="spoor"]');
        const knop = b.querySelectorAll('button')[0];
        const voor = spoor.scrollLeft;
        if (knop.disabled) return { uitgeschakeld: true, voor };
        knop.click();
        await new Promise((r) => setTimeout(r, 600));
        return { uitgeschakeld: false, voor, na: spoor.scrollLeft };
      }, i);
      geklikt++;
      if (terug.voor > 20 && terug.uitgeschakeld) {
        fouten.push(`${pad} ${breedte}px · ${naam}: "vorige" staat uit terwijl het spoor op ${Math.round(terug.voor)}px staat`);
      } else if (!terug.uitgeschakeld && terug.na >= terug.voor - 2) {
        fouten.push(`${pad} ${breedte}px · ${naam}: klik op "vorige" verzette niets (bleef op ${Math.round(terug.na)}px)`);
      }
    }
    await pg.close();
  }
  }
  await browser.close();

  /* positieve controle: een test die niet geklikt heeft bewijst niets */
  if (geklikt < 6) {
    console.error(`FOUT: maar ${geklikt} klikken uitgevoerd — de test heeft de knoppen niet echt bediend`);
    process.exit(2);
  }

  console.log(`check-bediening: ${geklikt} klikken over ${BREEDTES.length} schermbreedtes en ${PADEN.length} pagina's`);
  if (!fouten.length) { console.log('  alle schuifknoppen doen wat ze beloven'); process.exit(0); }
  console.log('');
  for (const f of fouten) console.log(`  FOUT: ${f}`);
  process.exit(1);
})();
