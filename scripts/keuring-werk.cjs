#!/usr/bin/env node
/**
 * Eigen keuring van de sectie "Uitgevoerd werk" (skill ui-eigen-keuring).
 * Meet wat een bezoeker ziet: tegelmaat, uitsnede, overflow, autoplay, volgorde.
 * Draaien: node scripts/keuring-werk.cjs [url]
 */
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const URL = process.argv[2] || 'http://localhost:8081/lp/totaalrenovatie';
const CHROME = process.env.CHROME_PAD || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const UIT = process.env.KEUR_UIT || '.';
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new', protocolTimeout: 180000,
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });

  for (const breedte of [1440, 390]) {
    const pg = await browser.newPage();
    await pg.setViewport({ width: breedte, height: 900, deviceScaleFactor: 1 });
    await pg.evaluateOnNewDocument(() => {
      try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true, essential: true, ts: Date.now() })); } catch { /* leeg */ }
    });
    await pg.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await pg.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
      await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; })));
    });
    await wacht(600);

    const meting = await pg.evaluate(() => {
      const spoor = document.querySelector('.pc-werk-spoor');
      const tegels = [...document.querySelectorAll('.pc-werk-foto img')];
      const maten = tegels.map((t) => {
        const r = t.getBoundingClientRect();
        return {
          b: Math.round(r.width), h: Math.round(r.height),
          bron: `${t.naturalWidth}x${t.naturalHeight}`,
          /* welk deel van de bron overleeft de vierkante uitsnede */
          zicht: Math.round((Math.min(t.naturalWidth / t.naturalHeight, t.naturalHeight / t.naturalWidth)) * 100),
          src: (t.currentSrc || t.src).split('/').pop().split('?')[0],
        };
      });
      const koppen = [...document.querySelectorAll('.pcx h2')].map((h) => h.textContent.trim());
      const lijn = document.querySelector('.pc-werk-vul');
      return {
        koppen,
        tegels: maten.length,
        breedtes: [...new Set(maten.map((m) => m.b))],
        hoogtes: [...new Set(maten.map((m) => m.h))],
        vierkant: maten.every((m) => Math.abs(m.b - m.h) <= 1),
        minZicht: Math.min(...maten.map((m) => m.zicht)),
        eerste: maten.slice(0, 3),
        spoorBreed: spoor ? Math.round(spoor.scrollWidth) : -1,
        spoorZicht: spoor ? Math.round(spoor.clientWidth) : -1,
        lijnAnimatie: lijn ? getComputedStyle(lijn).animationName + ' ' + getComputedStyle(lijn).animationDuration : 'GEEN',
        overflow: Math.round(document.documentElement.scrollWidth - window.innerWidth),
      };
    });

    /* autoplay: staat het spoor na 5 seconden verder? */
    const voor = await pg.$eval('.pc-werk-spoor', (e) => e.scrollLeft);
    await wacht(5200);
    const na = await pg.$eval('.pc-werk-spoor', (e) => e.scrollLeft);

    /* hover moet het stilzetten */
    const vak = await pg.$eval('.pc-werk-spoor', (e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + window.scrollY + r.height / 2 }; });
    await pg.evaluate((y) => window.scrollTo(0, y - 300), vak.y);
    await wacht(400);
    await pg.mouse.move(vak.x, 300);
    await wacht(400);
    const hoverVoor = await pg.$eval('.pc-werk-spoor', (e) => e.scrollLeft);
    await wacht(5200);
    const hoverNa = await pg.$eval('.pc-werk-spoor', (e) => e.scrollLeft);

    console.log(`\n=== ${breedte}px ===`);
    console.log(`koppen in volgorde: ${meting.koppen.join(' | ')}`);
    console.log(`tegels: ${meting.tegels} · breedtes ${meting.breedtes.join(',')} · hoogtes ${meting.hoogtes.join(',')} · vierkant: ${meting.vierkant ? 'JA' : 'NEE'}`);
    console.log(`spoor: ${meting.spoorBreed}px breed, ${meting.spoorZicht}px zichtbaar · minste bron zichtbaar in de uitsnede: ${meting.minZicht}%`);
    console.log(`voortgangslijn: ${meting.lijnAnimatie}`);
    console.log(`horizontale overflow pagina: ${meting.overflow}px`);
    console.log(`autoplay zonder muis: ${voor} -> ${na} (${na > voor ? 'BEWEEGT' : 'STIL'})`);
    console.log(`met muis erop:        ${hoverVoor} -> ${hoverNa} (${hoverNa === hoverVoor ? 'STIL' : 'BEWEEGT — FOUT'})`);

    /* Screenshot in RUST: spoor op de eerste tegel, autoplay stil. Een opname
       midden in een beweging toont tegels die half over de rand hangen en zegt
       niets over hoe de sectie er echt uitziet. */
    await pg.evaluate(() => {
      const el = document.querySelector('.pc-werk-spoor');
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = 0;
    });
    await wacht(300);
    /* screenshot van de sectie zelf */
    const el = await pg.$('.pc-werk');
    await el.screenshot({ path: path.join(UIT, `werk-${breedte}.png`) });
    /* en de pagina eronder: reviews + zekerheden, om de volgorde te zien */
    await pg.screenshot({ path: path.join(UIT, `pagina-${breedte}.png`), fullPage: true });
    await pg.close();
  }
  await browser.close();
})();
