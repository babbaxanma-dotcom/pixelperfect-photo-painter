/**
 * Telefoontoets van /lp/totaalrenovatie (Mohammed, 26 sep 2026: "dezelfde stijl
 * zoals we hebben gebruikt bij de landingspagina van dakwerken").
 *
 * Draait op een preview (npx vite preview --port 8140) en verstuurt nooit een
 * lead: het formulier wordt alleen geopend, niet verzonden.
 *
 * Draaien: node scripts/check-lp-reno.cjs
 */
const puppeteer = require('puppeteer-core');

const URL = process.env.LP_URL || 'http://127.0.0.1:8140/lp/totaalrenovatie';
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));
const uitslag = [];
const meld = (ok, wat, detail = '') => uitslag.push(`${ok ? 'AF     ' : 'NIET AF'}  ${wat}${detail ? '  (' + detail + ')' : ''}`);

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const page = await browser.newPage();
  const fouten = [];
  page.on('pageerror', (e) => fouten.push(String(e.message).slice(0, 120)));
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false })));
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await wacht(700);

  const kop = await page.evaluate(() => ({ titel: document.title, h1: document.querySelector('h1')?.textContent.trim() }));
  meld(kop.titel === 'Dé specialist voor uw renovatie | AB Bouw Groep', 'tabbladtitel', kop.titel);
  meld(kop.h1 === 'Expert in totaalrenovaties en totaalprojecten', 'kop', kop.h1);

  /* Zoals op dakwerken: alle antwoorden van vraag 1 boven de vouw. */
  const vouw = await page.evaluate(() => { const k = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')]; return Math.round(Math.max(...k.map((e) => e.getBoundingClientRect().bottom))); });
  meld(vouw <= 844, 'alle antwoorden van vraag 1 boven de vouw', `laatste eindigt op ${vouw} van 844`);

  const vraag = () => page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim());
  const tel = () => page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__tel')?.textContent.trim());
  const keuzes = () => page.evaluate(() => [...document.querySelectorAll('#rekenaar .kgj-reken__keuze strong')].map((b) => b.textContent.trim()));
  const tik = async (label) => {
    const r = await page.evaluate((l) => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith(l)); if (!b) return null; b.scrollIntoView({ block: 'center', behavior: 'instant' }); return true; }, label);
    if (!r) return false;
    /* De pagina scrolt vloeiend (scroll-behavior: smooth); meet pas na de sprong. */
    await wacht(120);
    const p = await page.evaluate((l) => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith(l)); const x = b.getBoundingClientRect(); return { x: x.left + x.width / 2, y: x.top + x.height / 2 }; }, label);
    await page.touchscreen.tap(p.x, p.y); await wacht(250); return true;
  };

  /* De hele calculator door, met de verwachte vraag op elke stap. */
  const pad = [
    ['Wat voor woning is het?', 'Rijwoning', 'Vraag 1 van 6'],
    ['Wat wilt u renoveren?', 'De hele woning', 'Vraag 2 van 6'],
    ['Hoe groot is de woning?', '100 tot 150 m²', 'Vraag 3 van 6'],
    ['Hoe oud is de woning?', 'Ouder dan 10 jaar', 'Vraag 4 van 6'],
    ['Hoeveel moet er vernieuwd worden?', 'Alles', 'Vraag 5 van 6'],
    ['Wanneer wilt u beginnen?', 'Binnen drie maanden', 'Vraag 6 van 6'],
  ];
  let tip = '';
  for (const [v, antwoord, teller] of pad) {
    const nu = await vraag(); const t = await tel();
    meld(nu === v && t === teller, `vraag: ${v}`, `${nu} / ${t}`);
    if (v === 'Hoeveel moet er vernieuwd worden?') tip = await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__tip')?.textContent.trim() || '');
    if (v === 'Wat voor woning is het?') meld((await keuzes()).join('|') === 'Appartement|Rijwoning|Halfopen woning|Open bebouwing', 'vier soorten woning', (await keuzes()).join(', '));
    meld(await tik(antwoord), `tik op "${antwoord}"`);
  }
  meld(tip.includes('6% btw'), 'btw-melding na een woning ouder dan 10 jaar', tip);
  const form = await page.evaluate(() => ({ kop: document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim(), knop: document.querySelector('#rekenaar .kgj-reken__knop')?.textContent.trim(), telVerplicht: document.querySelector('#rekenaar input[name=telefoon]')?.getAttribute('aria-required') }));
  meld(form.kop === 'Waar mogen we de berekening naartoe verzenden?' && form.knop === 'Bereken prijs', 'formulier na de laatste vraag', `${form.kop} / ${form.knop}`);
  meld(form.telVerplicht === 'true', 'alleen telefoon verplicht');

  /* Tikfeedback: tijdens het drukken kleurt het antwoord op. */
  await page.evaluate(() => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__terug')][0]; });
  await page.goto(URL, { waitUntil: 'networkidle0' }); await wacht(500);
  const r = await page.evaluate(() => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith('Appartement')); b.scrollIntoView({ block: 'center' }); const x = b.getBoundingClientRect(); return { x: x.left + x.width / 2, y: x.top + x.height / 2, rust: getComputedStyle(b).borderColor }; });
  await page.touchscreen.touchStart(r.x, r.y); await wacht(60);
  const druk = await page.evaluate(() => getComputedStyle([...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith('Appartement'))).borderColor);
  await page.touchscreen.touchEnd(); await wacht(150);
  meld(druk !== r.rust, 'tijdens het drukken kleurt het antwoord op', `rust ${r.rust} / druk ${druk}`);
  meld((await vraag()) === 'Wat wilt u renoveren?', 'na het loslaten meteen de volgende vraag', await vraag());

  /* Pagina als geheel. */
  const pg = await page.evaluate(() => ({
    breed: document.documentElement.scrollWidth,
    reviews: !!document.querySelector('#reviews'),
    diensten: [...document.querySelectorAll('#diensten .kgj-dienst h3')].map((h) => h.textContent.trim()),
    dienstTekst: document.querySelectorAll('#diensten .kgj-dienst p').length,
    voornaKop: document.querySelectorAll('#voorna h2').length,
    voornaLabel: document.querySelectorAll('#voorna figcaption').length,
    voor: document.querySelector('.kgj-schuif__voor img')?.getAttribute('src') || '',
    na: document.querySelector('.kgj-schuif__na img')?.getAttribute('src') || '',
    stukFoto: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.src).slice(0, 3),
    slot: document.querySelector('#contact h2')?.textContent.trim(),
  }));
  meld(pg.breed <= 390, 'geen horizontaal scrollen', `paginabreedte ${pg.breed}`);
  meld(!pg.reviews, "geen sectie 'wat klanten schrijven'");
  /* 27 sep (Mohammed): de zes afdelingen van AB, alleen naam en icoon. */
  meld(pg.diensten.join('|') === 'Totaalrenovatie en nieuwbouw|Ecologisch bouwen|Interieurwerken|Dakwerken|Badkamer en wellness|Gevelrenovatie' && pg.dienstTekst === 0,
    'zes afdelingen, zonder tekst per afdeling', pg.diensten.join(' | '));
  meld(pg.voornaKop === 0 && pg.voornaLabel === 0, "voor/na zonder kop 'Dezelfde uitbouw' en zonder label 'Aanbouw'");
  /* De build geeft de foto's een hashnaam; vergelijk dus de inhoud (md5) met
     de bronbestanden van de uitbouw. */
  const md5 = (buf) => require('crypto').createHash('md5').update(buf).digest('hex');
  const bron = (f) => md5(require('fs').readFileSync(require('path').join(__dirname, '..', 'src/assets/lp-diensten', f)));
  const haal = async (src) => md5(Buffer.from(await (await fetch(new globalThis.URL(src, URL))).arrayBuffer()));
  const voorOk = (await haal(pg.voor)) === bron('uitbreiding-voor.jpg');
  const naOk = (await haal(pg.na)) === bron('uitbreiding-na.jpg');
  meld(voorOk && naOk, 'voor/na = de uitbouw van de homepage (md5)', `voor ${voorOk} / na ${naOk}`);

  /* Uitgevoerd werk (Mohammed, 28 sep: "net boven de before and after, uitgevoerd
     werk, maar enkel abgroep echte fotos"). Elke foto in de sectie moet uit
     ECHTE_FOTOS komen, vergeleken op inhoud (md5), niet op naam.
     Bron van de lijst: de git-geschiedenis. Alle vier kwamen binnen in b314038
     (28 aug 2026: "Zijn eigen foto's ingevoegd: ... afgewerkt plafond met lichtvoeg,
     ... kamers met antracieten ramen, twee badkamers ...") en zijn sindsdien niet
     gewijzigd (git log --follow). Bewust NIET op de lijst:
       - generated-final/ en alles met fal/flux/ai/gegenereerd in naam of commit;
       - de reeksen *-p1/p2/p3 in lp-diensten/realisaties: nano /edit in 683e7bc
         (20 jun), 1200x896 = generatorformaat, ook al staan ze in het spoor van
         de homepage;
       - interieur/ en bad/: a8320f0 (3 jun) "78 scene-fotos geregenereerd";
       - via Artlist bewerkte foto's (badkamer-nieuw, hero-steenstrips);
       - de hero-beelden van de LP's en alles wat al elders op deze pagina staat. */
  const ECHTE_FOTOS = [
    { f: 'lp-diensten/kaart-pleisterwerk.jpg', bron: 'b314038: "afgewerkt plafond met lichtvoeg"' },
    { f: 'lp-diensten/realisaties/badkamer-p4-b.jpg', bron: 'b314038: "twee badkamers"' },
    { f: 'lp-diensten/realisaties/totaalrenovatie-p4-a.jpg', bron: 'b314038: "kamers met antracieten ramen"' },
    { f: 'lp-diensten/realisaties/badkamer-p4-a.jpg', bron: 'b314038: "twee badkamers"' },
  ];
  const assetMd5 = (f) => md5(require('fs').readFileSync(require('path').join(__dirname, '..', 'src/assets', f)));
  const echtMd5 = new Map(ECHTE_FOTOS.map((e) => [assetMd5(e.f), e.f]));
  const uit = await page.evaluate(() => {
    const s = document.querySelector('#uitgevoerd');
    if (!s) return null;
    return {
      kop: s.querySelector('h2')?.textContent.trim(),
      volgende: s.nextElementSibling?.id || '',
      fotos: [...s.querySelectorAll('img')].map((i) => ({ src: i.getAttribute('src'), alt: i.alt.trim(), lazy: i.getAttribute('loading'), fit: getComputedStyle(i).objectFit })),
      labels: [...s.querySelectorAll('figcaption')].map((c) => c.textContent.trim()),
      rest: [...document.querySelectorAll('img')].filter((i) => !s.contains(i)).map((i) => i.getAttribute('src')).filter(Boolean),
    };
  });
  meld(!!uit, 'sectie uitgevoerd werk staat op de pagina');
  if (uit) {
    meld(uit.kop === 'Uitgevoerd werk', "kop 'Uitgevoerd werk'", uit.kop);
    meld(uit.volgende === 'voorna', 'sectie staat direct boven de voor/na', `volgende sectie: ${uit.volgende}`);
    meld(uit.fotos.length >= 4, 'minstens 4 foto\'s', String(uit.fotos.length));
    const sommen = await Promise.all(uit.fotos.map((f) => haal(f.src)));
    const vreemd = sommen.map((s, i) => (echtMd5.has(s) ? '' : uit.fotos[i].src)).filter(Boolean);
    meld(vreemd.length === 0, 'elke foto komt uit de lijst met echte AB-foto\'s (md5)',
      vreemd.length ? `niet goedgekeurd: ${vreemd.join(' ')}` : sommen.map((s) => echtMd5.get(s).split('/').pop()).join(', '));
    meld(new Set(sommen).size === sommen.length, 'geen foto twee keer in de sectie');
    const restSommen = new Set(await Promise.all(uit.rest.map((s) => haal(s))));
    const dubbel = sommen.filter((s) => restSommen.has(s)).map((s) => echtMd5.get(s));
    meld(dubbel.length === 0, 'geen foto die al elders op de pagina staat (hero, waarom, voor/na, slot)',
      dubbel.length ? dubbel.join(' ') : `${restSommen.size} andere beelden vergeleken`);
    /* Positieve controle: de eerste herofoto is geen goedgekeurde werffoto en
       staat al op de pagina; beide toetsen moeten hem vangen. */
    const heroSom = await haal(uit.rest.find((s) => /totaalrenovatie-hero/.test(s)) || uit.rest[0]);
    meld(!echtMd5.has(heroSom) && restSommen.has(heroSom), 'positieve controle: de herofoto wordt gevangen');
    meld(uit.fotos.every((f) => f.lazy === 'lazy' && f.alt.length >= 20 && f.fit === 'cover'),
      'elke foto: loading=lazy, beschrijvende alt, object-fit cover');
    /* Label = één categoriewoord of een korte afdelingsnaam: hooguit drie woorden, geen cijfer. */
    meld(uit.labels.every((l) => l.split(/\s+/).length <= 3 && !/\d/.test(l)), 'labels kort, zonder cijfer', uit.labels.join(', '));
  }
  meld(pg.stukFoto.length === 0, 'geen kapotte foto', pg.stukFoto.join(' '));
  meld(pg.slot === 'Gratis plaatsbezoek', 'slotblok', pg.slot);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45)); await wacht(700);
  const balk = await page.evaluate(() => { const b = document.querySelector('.kgj-actiebalk'); return { aan: b?.classList.contains('is-aan'), tekst: b?.querySelector('button')?.textContent.trim() }; });
  meld(balk.aan && balk.tekst === 'Gratis plaatsbezoek', 'vaste balk: Gratis plaatsbezoek', JSON.stringify(balk));
  /* Mohammed 26 sep, klembord: op desktop stak de rechterkolom van vraag 2
     buiten de kaart ("De benedenverdieping"). Elke vraag, op desktop en gsm:
     elk antwoord ligt binnen de kaart. */
  for (const [naam, vp] of [['desktop', { width: 1440, height: 900 }], ['gsm', { width: 390, height: 844, isMobile: true, hasTouch: true }]]) {
    const q = await browser.newPage();
    await q.setViewport(vp);
    await q.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false })));
    await q.goto(URL, { waitUntil: 'networkidle0' }); await wacht(500);
    const buiten = [];
    for (let stap = 0; stap < 6; stap++) {
      const m = await q.evaluate(() => {
        const kaart = document.querySelector('#rekenaar .kgj-reken').getBoundingClientRect();
        const k = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')];
        const fout = k.filter((e) => { const r = e.getBoundingClientRect(); return r.right > kaart.right - 1 || r.left < kaart.left + 1 || e.scrollWidth > e.clientWidth + 1; }).map((e) => e.textContent.trim());
        return { vraag: document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim(), fout };
      });
      if (m.fout.length) buiten.push(`${m.vraag}: ${m.fout.join(', ')}`);
      await q.evaluate(() => document.querySelector('#rekenaar .kgj-reken__keuze').click()); await wacht(260);
    }
    meld(buiten.length === 0, `${naam}: elk antwoord van elke vraag binnen de kaart`, buiten.join(' | '));
    await q.close();
  }
  /* Uitgevoerd werk: een rustig raster. Telefoon twee kolommen; groot scherm drie,
     of vier naast elkaar als er precies vier foto's zijn. Alle tegels even groot. */
  for (const [naam, vp] of [['desktop', { width: 1440, height: 900 }], ['gsm', { width: 390, height: 844, isMobile: true, hasTouch: true }]]) {
    const q = await browser.newPage(); await q.setViewport(vp);
    await q.goto(URL, { waitUntil: 'networkidle0' }); await wacht(400);
    const r = await q.evaluate(() => {
      const t = [...document.querySelectorAll('#uitgevoerd .kgj-uitfoto__beeld')].map((e) => e.getBoundingClientRect());
      const top = Math.min(...t.map((b) => b.top));
      return { n: t.length, kolommen: t.filter((b) => Math.abs(b.top - top) < 2).length,
        maten: [...new Set(t.map((b) => `${Math.round(b.width)}x${Math.round(b.height)}`))], breed: document.documentElement.scrollWidth };
    });
    const verwacht = naam === 'gsm' ? 2 : (r.n === 4 ? 4 : 3);
    meld(r.kolommen === verwacht && r.maten.length === 1 && r.breed <= vp.width, `${naam}: uitgevoerd werk in ${verwacht} kolommen, tegels even groot`,
      `${r.kolommen} kolommen, ${r.maten.join(' / ')}, paginabreedte ${r.breed}`);
    await q.close();
  }
  /* Dakwerken deelt de componenten maar heeft deze sectie niet. */
  {
    const q = await browser.newPage(); await q.setViewport({ width: 1440, height: 900 });
    await q.goto(URL.replace(/\/lp\/totaalrenovatie.*$/, '/lp/dakwerken'), { waitUntil: 'networkidle0' }); await wacht(300);
    const d = await q.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim(), uit: !!document.querySelector('#uitgevoerd') }));
    meld(d.h1 === 'Dé specialist voor uw dakwerk' && !d.uit, '/lp/dakwerken zonder sectie uitgevoerd werk', JSON.stringify(d));
    await q.close();
  }

  /* Positieve controle: een te breed antwoord moet de toets doen falen. */
  {
    const q = await browser.newPage(); await q.setViewport({ width: 1440, height: 900 });
    await q.goto(URL, { waitUntil: 'networkidle0' }); await wacht(400);
    const gevangen = await q.evaluate(() => {
      const kaart = document.querySelector('#rekenaar .kgj-reken').getBoundingClientRect();
      const e = document.querySelector('#rekenaar .kgj-reken__keuze'); e.style.width = '900px';
      const r = e.getBoundingClientRect(); return r.right > kaart.right - 1;
    });
    meld(gevangen, 'positieve controle: een te breed antwoord wordt gevangen');
    await q.close();
  }

  meld(fouten.length === 0, 'geen fouten in de console', fouten.join(' | '));

  await browser.close();
  console.log(uitslag.join('\n'));
  const af = uitslag.filter((u) => u.startsWith('AF')).length;
  console.log(`\n${af} van ${uitslag.length} AF`);
  process.exit(af === uitslag.length ? 0 : 1);
})();
