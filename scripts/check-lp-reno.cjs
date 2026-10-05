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
  meld(kop.h1 === 'Uw renovatie zorgeloos geregeld van A tot Z', 'kop', kop.h1);

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
    ['Wat voor woning wilt u renoveren?', 'Rijwoning', 'Vraag 1 van 6'],
    ['Wat wilt u renoveren?', 'Alles (totaalrenovatie)', 'Vraag 2 van 6'],
    ['Hoe groot is de woning?', '100 tot 150 m²', 'Vraag 3 van 6'],
    ['Hoe oud is de woning?', 'Ouder dan 10 jaar', 'Vraag 4 van 6'],
    ['Hoeveel moet er vernieuwd worden?', 'Alles', 'Vraag 5 van 6'],
    ['Wanneer wilt u beginnen?', 'Dit jaar', 'Vraag 6 van 6'],
  ];
  let tip = '';
  for (const [v, antwoord, teller] of pad) {
    const nu = await vraag(); const t = await tel();
    meld(nu === v && t === teller, `vraag: ${v}`, `${nu} / ${t}`);
    if (v === 'Hoeveel moet er vernieuwd worden?') tip = await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__tip')?.textContent.trim() || '');
    if (v === 'Wat voor woning wilt u renoveren?') meld((await keuzes()).join('|') === 'Appartement|Rijwoning|Halfopen bebouwing|Open bebouwing', 'vier soorten woning', (await keuzes()).join(', '));
    if (v === 'Wat wilt u renoveren?') {
      /* Mohammed, 28 sep: afvinken per ruimte en onderdeel, met "Alles
         (totaalrenovatie)" dat alles aanvinkt. */
      const vink = () => page.evaluate(() => ({
        labels: [...document.querySelectorAll('#rekenaar .kgj-reken__vink')].map((e) => e.textContent.trim()),
        aan: [...document.querySelectorAll('#rekenaar .kgj-reken__vink')].filter((e) => e.getAttribute('aria-checked') === 'true').map((e) => e.textContent.trim()),
        uit: document.querySelector('#rekenaar .kgj-reken__verder')?.disabled,
      }));
      const klik = (l) => page.evaluate((l) => [...document.querySelectorAll('#rekenaar .kgj-reken__vink')].find((e) => e.textContent.trim() === l).click(), l);
      const leeg = await vink();
      meld(leeg.labels.join('|') === 'Alles (totaalrenovatie)|Keuken|Badkamer|Woonkamer|Slaapkamers|Vloeren|Muren en plafonds|Verwarming en sanitair|Isolatie|Ramen en deuren|Elektriciteit|Dak|Gevel',
        'afvinklijst: Alles + 12 ruimtes en onderdelen', leeg.labels.join(', '));
      meld(leeg.aan.length === 0 && leeg.uit === true, 'niets aangevinkt: Volgende staat uit');
      await klik('Alles (totaalrenovatie)'); await wacht(120);
      const alles = await vink();
      meld(alles.aan.length === 13 && alles.uit === false, 'Alles vinkt alles aan', `${alles.aan.length} van 13`);
      const premie = () => page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__tip')?.textContent.trim() || '');
      meld((await premie()).includes('Mijn VerbouwPremie'), 'Alles (dus ook Isolatie): premiemelding staat er', await premie());
      await klik('Isolatie'); await wacht(120);
      meld((await premie()) === '', 'Isolatie uit: geen premiemelding', await premie());
      await klik('Isolatie'); await wacht(120);
      await klik('Dak'); await wacht(120);
      const zonderDak = await vink();
      meld(zonderDak.aan.length === 11 && !zonderDak.aan.includes('Alles (totaalrenovatie)'), 'één vakje uit: Alles gaat mee uit', `${zonderDak.aan.length} aan`);
      await klik('Dak'); await wacht(120);
      meld((await vink()).aan.includes('Alles (totaalrenovatie)'), 'alle vakjes weer aan: Alles staat weer aan');
      await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__verder').click()); await wacht(400);
      meld(true, `tik op "${antwoord}" en Volgende`);
      continue;
    }
    meld(await tik(antwoord), `tik op "${antwoord}"`);
  }
  meld(tip.includes('6% btw'), 'btw-melding na een woning ouder dan 10 jaar', tip);
  const form = await page.evaluate(() => ({ kop: document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim(), knop: document.querySelector('#rekenaar .kgj-reken__knop')?.textContent.trim(), telVerplicht: document.querySelector('#rekenaar input[name=telefoon]')?.getAttribute('aria-required') }));
  meld(form.kop === 'Waar mogen we de berekening naartoe verzenden?' && form.knop === 'Ontvang mijn richtprijs', 'formulier na de laatste vraag', `${form.kop} / ${form.knop}`);
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
  /* 29 sep (Mohammed): eerst de woonkeuken (IMG_0117/0119), met de pijl de uitbouw
     van de homepage; "pijltje ... voor andere before after". */
  const voorOk = (await haal(pg.voor)) === bron('woonkeuken-voor.jpg');
  const naOk = (await haal(pg.na)) === bron('woonkeuken-na.jpg');
  meld(voorOk && naOk, 'voor/na paar 1 = de woonkeuken (md5)', `voor ${voorOk} / na ${naOk}`);
  const schuifStand = () => page.evaluate(() => ({
    voor: document.querySelector('.kgj-schuif__voor img')?.getAttribute('src') || '',
    na: document.querySelector('.kgj-schuif__na img')?.getAttribute('src') || '',
    tel: document.querySelector('.kgj-schuif__wissel .pc-bediening-tel')?.textContent.trim() || '',
    lijn: document.querySelector('.kgj-schuif__lijn')?.style.left || '',
    pijlen: [...document.querySelectorAll('.kgj-schuif__wissel button')].map((b) => b.getAttribute('aria-label')),
  }));
  const s1 = await schuifStand();
  meld(s1.pijlen.join('|') === 'Vorige voor en na|Volgende voor en na' && s1.tel === '1 / 2', 'voor/na: pijlen en teller 1 / 2', `${s1.pijlen.join(', ')} · ${s1.tel}`);
  /* Balk eerst verschuiven, dan wisselen: hij moet terug naar het midden. */
  await page.evaluate(() => { const r = document.querySelector('.kgj-schuif__bereik'); const zet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; zet.call(r, '20'); r.dispatchEvent(new Event('input', { bubbles: true })); });
  await wacht(150);
  await page.evaluate(() => [...document.querySelectorAll('.kgj-schuif__wissel button')].find((b) => b.getAttribute('aria-label') === 'Volgende voor en na').click());
  await wacht(300);
  const s2 = await schuifStand();
  const s2voor = (await haal(s2.voor)) === bron('uitbreiding-voor.jpg');
  const s2na = (await haal(s2.na)) === bron('uitbreiding-na.jpg');
  meld(s2voor && s2na && s2.tel === '2 / 2', 'voor/na: pijl volgende toont paar 2 = de uitbouw van de homepage (md5)', `voor ${s2voor} / na ${s2na} · ${s2.tel}`);
  meld(s2.lijn === '50%', 'voor/na: na het wisselen staat de balk terug in het midden', s2.lijn);
  await page.evaluate(() => [...document.querySelectorAll('.kgj-schuif__wissel button')].find((b) => b.getAttribute('aria-label') === 'Volgende voor en na').click());
  await wacht(300);
  const s3 = await schuifStand();
  meld(s3.tel === '1 / 2' && s3.voor === s1.voor, 'voor/na: na het laatste paar weer het eerste (rond)', s3.tel);

  /* 29 sep (Mohammed: "meer goeie puntjes? dat de particulier wilt zien", "kijk
     ooms ... verelst ... zedreno"): veelgestelde vragen met AB's eigen antwoorden
     uit _divisies.ts, tussen de voor/na en het slotblok. */
  const divisies = require('fs').readFileSync(require('path').join(__dirname, '..', 'src/pages/abbouw/_divisies.ts'), 'utf8').replace(/\r\n/g, '\n');
  const faq = await page.evaluate(() => {
    const s = document.querySelector('#faq');
    if (!s) return null;
    const items = [...s.querySelectorAll('details')];
    const eerste = items[0]; eerste.querySelector('summary').click();
    return {
      kop: s.querySelector('h2')?.textContent.trim(),
      vragen: items.map((d) => d.querySelector('summary').textContent.trim()),
      antwoorden: items.map((d) => d.querySelector('p').textContent.trim()),
      open: eerste.open,
      vorige: s.previousElementSibling?.id, volgende: s.nextElementSibling?.id,
    };
  });
  const VRAGEN = ['Kan ik in huis blijven wonen tijdens de werken?', 'Hoe zit het met meerwerk?', 'Moet ik alles in één keer doen?',
    'Hebben jullie een eigen architect?', 'Regelen jullie de vergunning?'];
  meld(!!faq && faq.kop === 'Veelgestelde vragen' && faq.vragen.join('|') === VRAGEN.join('|'), 'veelgestelde vragen: vijf vragen in vaste volgorde', faq && faq.vragen.join(' | '));
  const eigen = faq ? faq.antwoorden.filter((a) => divisies.includes(`a: '${a.replace(/'/g, "\\'")}'`)).length : 0;
  meld(eigen === VRAGEN.length, 'elk antwoord staat letterlijk op een afdelingspagina van AB (_divisies.ts)', `${eigen} van ${VRAGEN.length}`);
  meld(!!faq && faq.vorige === 'voorna' && faq.volgende === 'contact', 'vragen staan tussen de voor/na en het slotblok', faq && `${faq.vorige} > faq > ${faq.volgende}`);
  meld(!!faq && faq.open, 'een vraag klapt open bij een klik');

  /* Uitgevoerd werk (Mohammed, 28 sep: "net boven de before and after, uitgevoerd
     werk, maar enkel abgroep echte fotos", daarna "zonder de namen", "op de manier
     van de home page", "zo dat het horizontaal doorloopt", "er zijn veel meer
     fotos" en "kijk gewoon naar de gedownloade foto's ... neem de goede foto's
     eruit"). Elke foto in het spoor moet uit ECHTE_FOTOS komen, vergeleken op
     inhoud (md5), niet op naam.
     Bron: Mohammeds eigen iPhone-foto's in C:/Users/Mohammed/Downloads
     (IMG_90xx.jpeg, 28 aug en 1 sep), stand gecorrigeerd en op 1179px breed gezet
     in commit fe90779 (src/assets/lp-diensten/eigen/). Alleen afgewerkt werk.
     Bewust NIET op de lijst:
       - IMG_9068: de uitbouw, die de voor/na eronder al toont;
       - IMG_9064: vloerverwarming in een kale kamer (werf);
       - de oude kopieën uit b314038 (realisaties/*-p4/p5/p6, kaart-*): grotendeels
         dezelfde foto's in een andere uitsnede, dus dubbel in het spoor;
       - badkamer-nieuw: Artlist-bewerking van IMG_9069 (d3dc17f);
       - generated-final/, de reeksen *-p1/p2/p3 (nano /edit, 683e7bc),
         interieur/ en bad/ (a8320f0), stockfoto's van andere bedrijven
         (83e321e, 61094f6, d36d186, 96275c5) en elke andere Artlist-bewerking. */
  /* 29 sep: zeven foto's erbij uit Downloads/bijlagen (Mohammed: "pak al deze fotos",
     "al de rest in uitgevoerd werk, behalve 2 onafgewerkte"). Niet opgenomen: 0104,
     0107, 0108, 0109, 0112, 0113 (dezelfde foto's als 9025, 9027, 9028, 9029, 9014,
     9015), de werffoto's 0101, 0103, 0115, 0116 en het voor/na-paar 0117/0119. */
  const BRON = (n) => n.startsWith('01')
    ? `Downloads/bijlagen/IMG_${n}.jpeg, eigen foto Mohammed (29 sep)`
    : `Downloads/IMG_${n}.jpeg, eigen iPhone-foto Mohammed (fe90779)`;
  const ECHTE_FOTOS = ['9065', '9028', '9022', '9015', '9069', '9030', '9027', '9025', '9029', '9014',
    '0100', '0102', '0105', '0106', '0110', '0111', '0114']
    .map((n) => ({ f: `lp-diensten/eigen/IMG_${n}.jpg`, bron: BRON(n) }));
  const assetMd5 = (f) => md5(require('fs').readFileSync(require('path').join(__dirname, '..', 'src/assets', f)));
  const echtMd5 = new Map(ECHTE_FOTOS.map((e) => [assetMd5(e.f), e.f]));
  const uit = await page.evaluate(() => {
    const s = document.querySelector('#uitgevoerd');
    if (!s) return null;
    const imgs = [...s.querySelectorAll('.kgj-werkspoor__spoor img')];
    return {
      kop: s.querySelector('h2')?.textContent.trim(),
      /* Alle zichtbare tekst van de sectie: alleen de kop mag er staan. */
      tekst: s.innerText.replace(/\s+/g, ' ').trim(),
      figcaptions: s.querySelectorAll('figcaption').length,
      volgende: s.nextElementSibling?.id || '',
      fotos: imgs.map((i) => ({ src: i.getAttribute('src'), alt: i.alt.trim(), verborgen: !!i.closest('[aria-hidden="true"]'), lazy: i.getAttribute('loading'), fit: getComputedStyle(i).objectFit })),
      pijlen: [...s.querySelectorAll('.pc-bediening button')].map((b) => b.getAttribute('aria-label')),
      heroSrc: document.querySelector('.kgj-dia img')?.getAttribute('src') || '',
    };
  });
  meld(!!uit, 'sectie uitgevoerd werk staat op de pagina');
  if (uit) {
    meld(uit.kop === 'Uitgevoerd werk', "kop 'Uitgevoerd werk'", uit.kop);
    meld(uit.tekst === 'Uitgevoerd werk' && uit.figcaptions === 0, 'geen namen bij de foto\'s: alleen de kop', uit.tekst);
    meld(uit.volgende === 'voorna', 'sectie staat direct boven de voor/na', `volgende sectie: ${uit.volgende}`);
    const eerste = uit.fotos.filter((f) => !f.verborgen);
    const tweede = uit.fotos.filter((f) => f.verborgen);
    meld(eerste.length >= 10 && tweede.length === eerste.length && eerste.every((f, i) => f.src === tweede[i].src),
      'de reeks staat twee keer in het spoor (oneindige lus), de tweede verborgen', `${eerste.length} + ${tweede.length}`);
    const sommen = await Promise.all(uit.fotos.map((f) => haal(f.src)));
    const vreemd = sommen.map((s, i) => (echtMd5.has(s) ? '' : uit.fotos[i].src)).filter(Boolean);
    meld(vreemd.length === 0, `elke foto komt uit de lijst met ${ECHTE_FOTOS.length} echte AB-foto's (md5)`,
      vreemd.length ? `niet goedgekeurd: ${vreemd.join(' ')}` : `${new Set(sommen).size} verschillende`);
    const eersteSommen = sommen.slice(0, eerste.length);
    meld(new Set(eersteSommen).size === eersteSommen.length && eersteSommen.length === ECHTE_FOTOS.length,
      'elke goedgekeurde foto precies één keer per reeks', `${new Set(eersteSommen).size} van ${ECHTE_FOTOS.length}`);
    /* Positieve controle: de herofoto van deze pagina is niet goedgekeurd en moet gevangen worden. */
    const heroSom = await haal(uit.heroSrc);
    meld(!!uit.heroSrc && !echtMd5.has(heroSom), 'positieve controle: de herofoto wordt gevangen', uit.heroSrc);
    /* De uitbouw staat al in de voor/na eronder: niet nog eens in het spoor. */
    const uitbouw = assetMd5('lp-diensten/eigen/IMG_9068.jpg');
    meld(!echtMd5.has(uitbouw) && !sommen.includes(uitbouw), 'de uitbouw (IMG_9068) staat niet in het spoor');
    const paarSommen = ['lp-diensten/woonkeuken-voor.jpg', 'lp-diensten/woonkeuken-na.jpg'].map(assetMd5);
    meld(paarSommen.every((s) => !sommen.includes(s)), 'het voor/na-paar van de woonkeuken staat niet in het spoor');
    meld(eerste.every((f) => f.lazy === 'lazy' && f.alt.length >= 20 && f.fit === 'cover') && tweede.every((f) => f.alt === ''),
      'elke foto: loading=lazy, object-fit cover, beschrijvende alt (tweede reeks leeg)');
    meld(uit.pijlen.join('|') === 'Vorige foto|Volgende foto', 'pijlen zoals op de homepage', uit.pijlen.join(', '));
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
        const k = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze, #rekenaar .kgj-reken__vink')];
        const fout = k.filter((e) => { const r = e.getBoundingClientRect(); return r.right > kaart.right - 1 || r.left < kaart.left + 1 || e.scrollWidth > e.clientWidth + 1; }).map((e) => e.textContent.trim());
        return { vraag: document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim(), fout };
      });
      if (m.fout.length) buiten.push(`${m.vraag}: ${m.fout.join(', ')}`);
      /* De afvinkvraag gaat pas door met Volgende. */
      await q.evaluate(() => {
        const v = document.querySelector('#rekenaar .kgj-reken__vink');
        if (v) { v.click(); return; }
        document.querySelector('#rekenaar .kgj-reken__keuze').click();
      }); await wacht(120);
      await q.evaluate(() => document.querySelector('#rekenaar .kgj-reken__verder')?.click()); await wacht(260);
    }
    meld(buiten.length === 0, `${naam}: elk antwoord van elke vraag binnen de kaart`, buiten.join(' | '));
    await q.close();
  }
  /* Uitgevoerd werk: het spoor van de homepage. Het schuift zelf op (positie na
     6 s is een andere), het stopt onder de muis, de pijl "Volgende" loopt rond
     zonder muur, en de tegels hebben de maat van de homepage: 309px vierkant met
     14px afronding op een groot scherm, 78% van de baan op de telefoon. */
  for (const [naam, vp] of [['desktop', { width: 1440, height: 900 }], ['gsm', { width: 390, height: 844, isMobile: true, hasTouch: true }]]) {
    const q = await browser.newPage(); await q.setViewport(vp);
    await q.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false })));
    await q.goto(URL, { waitUntil: 'networkidle0' }); await wacht(400);
    await q.evaluate(() => document.querySelector('#uitgevoerd').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await wacht(500);
    const stand = () => q.evaluate(() => document.querySelector('#uitgevoerd .kgj-werkspoor__spoor').scrollLeft);
    const maat = await q.evaluate(() => {
      const baan = document.querySelector('#uitgevoerd .kgj-werkspoor__spoor').getBoundingClientRect();
      const t = [...document.querySelectorAll('#uitgevoerd .kgj-werkspoor__foto img')].map((e) => e.getBoundingClientRect());
      const img = document.querySelector('#uitgevoerd .kgj-werkspoor__foto img');
      return { b: Math.round(t[0].width), h: Math.round(t[0].height), gelijk: new Set(t.map((r) => `${Math.round(r.width)}x${Math.round(r.height)}`)).size,
        radius: getComputedStyle(img).borderTopLeftRadius, baan: Math.round(baan.width), breed: document.documentElement.scrollWidth };
    });
    const maatOk = naam === 'desktop' ? maat.b === 309 && maat.h === 309 : Math.abs(maat.b - Math.round((maat.baan - 40) * 0.78)) <= 2 && maat.b === maat.h;
    meld(maatOk && maat.gelijk === 1 && maat.radius === '14px' && maat.breed <= vp.width, `${naam}: tegels vierkant zoals de homepage, afronding 14px`,
      `${maat.b}x${maat.h}, baan ${maat.baan}, radius ${maat.radius}, paginabreedte ${maat.breed}`);
    const t0 = await stand(); await wacht(6000); const t6 = await stand();
    meld(t6 !== t0, `${naam}: het spoor schuift zelf op`, `scrollLeft ${t0} -> ${t6} na 6 s`);
    if (naam === 'desktop') {
      /* Muis op het spoor: na de lopende beweging mag de stand 5 s lang niet veranderen (de klok tikt om de 4 s). */
      const r = await q.evaluate(() => { const x = document.querySelector('#uitgevoerd .kgj-werkspoor__spoor').getBoundingClientRect(); return { x: x.left + x.width / 2, y: x.top + x.height / 2 }; });
      await q.mouse.move(r.x, r.y); await wacht(800);
      const h0 = await stand(); await wacht(5000); const h5 = await stand();
      const lijnStil = await q.evaluate(() => !!document.querySelector('#uitgevoerd .kgj-werkspoor__vul--stil'));
      meld(h5 === h0 && lijnStil, 'desktop: het spoor stopt onder de muis', `scrollLeft ${h0} -> ${h5} na 5 s, lijn stil: ${lijnStil}`);
      /* Pijl "Volgende": één volle reeks verder staat dezelfde foto links, en elke klik verschuift. */
      const links = () => q.evaluate(() => {
        const sp = document.querySelector('#uitgevoerd .kgj-werkspoor__spoor'); const l = sp.getBoundingClientRect().left;
        const f = [...sp.querySelectorAll('img')].map((i) => ({ s: i.getAttribute('src'), d: Math.abs(i.getBoundingClientRect().left - l) })).sort((a, b) => a.d - b.d)[0];
        return f.s;
      });
      const n = await q.evaluate(() => document.querySelectorAll('#uitgevoerd .kgj-werkspoor__spoor img').length / 2);
      const begin = await links(); let muur = 0;
      for (let k = 0; k < n; k++) {
        const voor = await stand();
        await q.click('#uitgevoerd .pc-bediening button[aria-label="Volgende foto"]'); await wacht(700);
        const na = await stand(); if (Math.abs(na - voor) < 1) muur += 1;
      }
      const einde = await links();
      meld(muur === 0 && einde === begin, `desktop: ${n} keer "Volgende" = rond, zonder muur`, `muur ${muur}, begin ${begin.split('/').pop()} / einde ${einde.split('/').pop()}`);
    }
    await q.close();
  }
  /* Dakwerken deelt de componenten maar heeft deze sectie niet. */
  {
    const q = await browser.newPage(); await q.setViewport({ width: 1440, height: 900 });
    await q.goto(URL.replace(/\/lp\/totaalrenovatie.*$/, '/lp/dakwerken'), { waitUntil: 'networkidle0' }); await wacht(300);
    const d = await q.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim(), uit: !!document.querySelector('#uitgevoerd') }));
    meld(d.h1 === 'Bereken in 2 minuten de richtprijs van uw dak' && !d.uit, '/lp/dakwerken zonder sectie uitgevoerd werk', JSON.stringify(d));
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
