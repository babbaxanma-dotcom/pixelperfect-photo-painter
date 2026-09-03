#!/usr/bin/env node
/**
 * De kop en de hero, op elke pagina en elke schermmaat.
 *
 * Aanleiding: Mohammed vond drie dingen die ik zelf had moeten vinden. De titel
 * op de homepage viel achter de vaste kop. Het formulier boven de vouw was op
 * een laptop niet meer te zien. En op een telefoon was er geen enkele manier om
 * naar een andere pagina te gaan, want daar verdwijnt de navigatierij.
 *
 * Alle drie zijn ze zichtbaar in één oogopslag en geen van drieën kwam uit een
 * test. Vandaar deze: hij opent elke pagina op drie schermen en kijkt naar wat
 * een bezoeker ziet.
 *
 * Wat hier gecontroleerd wordt:
 *   1. de titel staat niet achter de vaste kop;
 *   2. de verstuurknop van het heroformulier staat boven de vouw;
 *   3. de heroknop is niet platgedrukt;
 *   4. er verschuift niets tijdens het scrollen;
 *   5. op een telefoon is er een menuknop die een menu met links opent.
 *
 * De schermmaat 1366x620 is een 15-inch laptop na aftrek van de browserbalken.
 * Dat is de krapste maat waarop het formulier nog moet passen; op een ruimer
 * scherm valt deze fout niet op.
 *
 * Draaien: node scripts/check-kophero.cjs   (start zelf een preview-server)
 */
const { spawn, execSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4382;

/* De landingspaginas met een heroformulier, plus een gewone pagina zodat de
   kop daar ook meegemeten wordt. */
/* Ook de /lp/-adressen. Die wijzen naar dezelfde component, maar het zijn de
   adressen uit de advertenties en dus wat bezoekers werkelijk openen. Ik testte
   alleen /badkamerrenovatie terwijl Mohammed naar /lp/badkamerrenovatie keek:
   een guard die de echte adressen niet kent, meet de verkeerde pagina. */
const PAGINAS = ['/', '/badkamerrenovatie', '/lp/badkamerrenovatie',
  '/totaalrenovatie', '/lp/totaalrenovatie', '/over'];
/* Drie soorten scherm plus dat van Mohammed zelf. Zijn venster is breed maar
   laag: 1531x708 na browserbalken en taakbalk. Juist daar valt het formulier
   het eerst weg, en juist daar keek ik niet. */
const SCHERMEN = [[1531, 708], [1440, 900], [1366, 620], [390, 844]];

/* Een subpixel-afronding bij het schalen van een beeld is geen sprong. */
const SPELING = 2;

const stop = (code, bericht) => { console.error(bericht); process.exit(code); };

(async () => {
  const server = spawn('npx', ['vite', 'preview', '--port', String(POORT), '--strictPort'],
    { shell: true, stdio: 'ignore' });
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

    for (const pad of PAGINAS) {
      for (const [breedte, hoogte] of SCHERMEN) {
        const waar = `${pad} @${breedte}x${hoogte}`;
        const p = await browser.newPage();
        await p.setViewport({ width: breedte, height: hoogte, isMobile: breedte < 500, hasTouch: breedte < 500 });
        await p.evaluateOnNewDocument(() =>
          localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true })));
        await p.goto(`http://localhost:${POORT}${pad}`, { waitUntil: 'networkidle0', timeout: 60000 });
        await p.evaluate(() => document.fonts.ready);
        await new Promise((k) => setTimeout(k, 800));

        const m = await p.evaluate(() => {
          const q = (s) => document.querySelector(s);
          const R = (e) => (e ? e.getBoundingClientRect() : null);
          const kop = q('.pc-kop'), titel = q('.pc-h1, .rp-phero__t, h1');
          const form = q('.pc-hero form, .pc-balk form');
          const verstuur = form && form.querySelector('button[type=submit], .pc-knop');
          const heroknop = q('.pc-hero-vat > .pc-knop');
          return {
            kopOnder: kop ? Math.round(R(kop).bottom) : null,
            titelBoven: titel ? Math.round(R(titel).top) : null,
            heroForm: !!form,
            verstuurOnder: verstuur ? Math.round(R(verstuur).bottom) : null,
            heroknopHoogte: heroknop ? Math.round(R(heroknop).height) : null,
            fotoOnder: q('.pc-hero-foto') ? Math.round(R(q('.pc-hero-foto')).bottom) : null,
            balkBoven: q('.pc-balk') ? Math.round(R(q('.pc-balk')).top) : null,
            /* Het bovenste element in de hero dat werkelijk iets toont. */
            eersteInhoud: (() => {
              const hero = q('.pc-hero, .rp-phero');
              if (!hero) return null;
              let top = Infinity;
              for (const e of hero.querySelectorAll('*')) {
                /* De kop staat op een telefoon binnen de hero, als eerste blok
                   in de kolom. Zonder deze uitzondering telt zijn logo als het
                   eerste stuk inhoud en meet deze check altijd nul. */
                if (e.closest('.pc-kop')) continue;
                const r = e.getBoundingClientRect();
                if (r.height < 4 || r.width < 4) continue;
                const heeftTekst = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
                const isBeeld = e.tagName === 'IMG' || e.tagName === 'SVG';
                if (!heeftTekst && !isBeeld) continue;
                top = Math.min(top, r.top);
              }
              return top === Infinity ? null : Math.round(top);
            })(),
            vouw: window.innerHeight,
          };
        });
        metingen++;

        /* 1. De titel hoort onder de kop te beginnen, niet erachter. */
        if (m.kopOnder === null) fouten.push(`${waar}: geen kop gevonden`);
        else if (m.titelBoven === null) fouten.push(`${waar}: geen titel gevonden`);
        else if (m.kopOnder - m.titelBoven > 0) {
          fouten.push(`${waar}: de titel staat ${m.kopOnder - m.titelBoven}px achter de kop`);
        }

        /* 2. Het formulier boven de vouw is de belangrijkste plek van een
              landingspagina. Zakt de verstuurknop eronder, dan ziet niemand hem
              zonder te scrollen. De gewone paginas hebben er geen. */
        if (m.heroForm) {
          if (m.verstuurOnder === null) fouten.push(`${waar}: heroformulier zonder verstuurknop`);
          else if (m.verstuurOnder > m.vouw) {
            fouten.push(`${waar}: de verstuurknop staat ${m.verstuurOnder - m.vouw}px onder de vouw`);
          }
        }

        /* 3. Een knop die tot een streepje is samengedrukt betekent dat de
              inhoud niet in de hero past. */
        if (m.heroknopHoogte !== null && m.heroknopHoogte < 40) {
          fouten.push(`${waar}: de heroknop is platgedrukt tot ${m.heroknopHoogte}px`);
        }

        /* 3b. Leegte onder de kop. Op een telefoon staat alles onder elkaar en
               heeft de hero alleen de hoogte van zijn inhoud nodig. Bleef er een
               ondergrens van een breed scherm staan, dan rekte de hero uit en
               hing de inhoud in een leeg vlak: 156px niets tussen de kop en de
               eerste letter. Niemand meet dat, iedereen ziet het.

               Gemeten tot het EERSTE stuk inhoud, niet tot de titel: op een
               gewone pagina staat er een kruimelpad boven de titel, en dat is
               inhoud, geen leegte. */
        if (breedte < 500 && m.eersteInhoud !== null && m.kopOnder !== null) {
          const leeg = m.eersteInhoud - m.kopOnder;
          if (leeg > 70) fouten.push(`${waar}: ${leeg}px leegte onder de kop voor er inhoud komt`);
        }

        /* 3c. De balk hoort op een telefoon onder de foto, niet eroverheen.
               Daar is de foto een band van ruim 200px, en een overlap uit de
               brede opmaak dekt daar de helft van af. */
        if (breedte < 500 && m.fotoOnder !== null && m.balkBoven !== null) {
          const overlap = m.fotoOnder - m.balkBoven;
          if (overlap > 8) fouten.push(`${waar}: het formulier dekt ${overlap}px van de herofoto af`);
        }

        /* 4. Scrollen met het wiel, zoals een bezoeker het doet. De plek van de
              titel in het DOCUMENT hoort constant te blijven: de pagina beweegt,
              de inhoud niet. Verschuift die, dan springt de pagina onder de
              vinger weg. window.scrollTo zou dit missen — dat is één sprong, en
              de kop wisselt juist onderweg van hoogte. */
        const plek = () => p.evaluate(() => {
          const e = document.querySelector('.pc-h1, .rp-phero__t, h1');
          return e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : 0;
        });
        let vorige = await plek();
        let ergste = 0, ergsteY = 0;
        for (let i = 0; i < 24; i++) {
          await p.mouse.wheel({ deltaY: i < 12 ? 70 : -70 });
          await new Promise((k) => setTimeout(k, 80));
          const nu = await plek();
          metingen++;
          const d = Math.abs(nu - vorige);
          if (d > ergste) { ergste = d; ergsteY = await p.evaluate(() => Math.round(window.scrollY)); }
          vorige = nu;
        }
        if (ergste > SPELING) {
          fouten.push(`${waar}: de titel springt ${ergste}px tijdens het scrollen, rond scrollpositie ${ergsteY}`);
        }

        /* 5. Op een telefoon verdwijnt de navigatierij. Dan moet de menuknop
              hem terugbrengen, anders is er geen weg naar een andere pagina. */
        if (breedte < 500) {
          const menu = await p.evaluate(() => {
            const b = document.querySelector('.rp-burger');
            if (!b) return { knop: false };
            const zichtbaar = b.getBoundingClientRect().width > 0 && getComputedStyle(b).display !== 'none';
            return { knop: true, zichtbaar, lijnen: (b.querySelector('path')?.getAttribute('d') || '').split('M').length - 1 };
          });
          metingen++;
          if (!menu.knop || !menu.zichtbaar) {
            fouten.push(`${waar}: geen zichtbare menuknop, de navigatie is hier onbereikbaar`);
          } else {
            await p.click('.rp-burger');
            await new Promise((k) => setTimeout(k, 350));
            const paneel = await p.evaluate(() => {
              const m = document.querySelector('.rp-mob, [data-mob]');
              if (!m) return { er: false };
              return {
                er: true,
                open: getComputedStyle(m).display !== 'none' && !m.hidden,
                links: m.querySelectorAll('a').length,
              };
            });
            metingen++;
            if (!paneel.er || !paneel.open) fouten.push(`${waar}: de menuknop opent geen menu`);
            else if (paneel.links < 3) fouten.push(`${waar}: het menu heeft maar ${paneel.links} links`);
            else {
              /* Sluiten hoort ook te werken, anders zit een bezoeker vast. */
              await p.keyboard.press('Escape');
              await new Promise((k) => setTimeout(k, 350));
              const dicht = await p.evaluate(() => {
                const m = document.querySelector('.rp-mob, [data-mob]');
                return getComputedStyle(m).display === 'none' || m.hidden;
              });
              metingen++;
              if (!dicht) fouten.push(`${waar}: het menu sluit niet met Escape`);
            }
          }
        }

        await p.close();
      }
    }

    /* Positieve controle op de meting zelf: een check die niets tegenkwam
       bewijst niets. Per pagina en scherm horen er minstens 25 metingen te zijn
       (1 opmaak + 24 scrollstappen), en op de telefoon nog vier menu-metingen. */
    const minimum = PAGINAS.length * SCHERMEN.length * 25;
    if (metingen < minimum) {
      stop(2, `FOUT: maar ${metingen} metingen gedaan, minstens ${minimum} verwacht — de meting is ongeldig`);
    }

    console.log(`check-kophero: ${metingen} metingen over ${PAGINAS.length} paginas en ${SCHERMEN.length} schermen`);
    if (!fouten.length) {
      console.log('  de titel staat vrij, het formulier staat boven de vouw, en het menu werkt op telefoon');
      process.exit(0);
    }
    console.log('');
    for (const f of fouten) console.log(`  FOUT: ${f}`);
    console.log('\n  Dit is wat een bezoeker meteen ziet. Repareer het vóór een push.');
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' }); } catch { /* al weg */ }
  }
})();
