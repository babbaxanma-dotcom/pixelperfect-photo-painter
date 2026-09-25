/**
 * Telefooncontrole van /lp/dakwerken: loopt de pagina af zoals een bezoeker
 * op een iPhone (390 x 844) en meldt per punt AF of NIET AF.
 *
 * Er wordt NIETS verstuurd: de formulieren worden tot de verzendknop
 * doorgeklikt, maar nooit ingediend. Geen enkele echte lead.
 *
 * Verwacht een draaiende preview op http://127.0.0.1:8140 (preview-licht.cjs).
 * Schermen komen in %TEMP%/claude/lp-gsm.
 *
 * Draaien: node scripts/check-lp-gsm.cjs
 */
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = 'http://127.0.0.1:8140/lp/dakwerken';
const UIT = 'C:/Users/Mohammed/AppData/Local/Temp/claude/lp-gsm';
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));
const uitslag = [];
const meld = (ok, wat, detail = '') => uitslag.push(`${ok ? 'AF     ' : 'NIET AF'}  ${wat}${detail ? '  (' + detail + ')' : ''}`);

(async () => {
  fs.mkdirSync(UIT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const fouten = [];
  page.on('pageerror', (e) => fouten.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') fouten.push(m.text()); });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await wacht(800);

  const klikKeuze = async (label) => page.evaluate((l) => {
    const k = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((b) => b.textContent.trim().startsWith(l));
    if (!k) return false; k.click(); return true;
  }, label);
  const tel = () => page.$eval('#rekenaar .kgj-reken__tel', (e) => e.textContent.trim());
  const vraag = () => page.$eval('#rekenaar .kgj-reken__vraag', (e) => e.textContent.trim());

  /* 0. Cookiebanner binnen het scherm. Stond op 23 sep op elke telefoon half
        buiten beeld (x = -175) en dekte keuzes en verzendknoppen af; de
        eerste versie van deze controle zag dat niet. */
  const banner = await page.evaluate(() => {
    const e = document.querySelector('.abc-banner'); if (!e) return null;
    const r = e.getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right) };
  });
  meld(!banner || (banner.l >= 0 && banner.r <= 390), 'cookiebanner volledig binnen het scherm', banner ? `${banner.l} tot ${banner.r} van 390` : 'geen banner');

  /* 1. Boven de vouw */
  const vouw = await page.evaluate(() => {
    const k = document.querySelector('#rekenaar .kgj-reken__keuze:last-child').getBoundingClientRect();
    return { onder: Math.round(k.bottom), h1: document.querySelector('.kgj-hero h1').textContent.trim() };
  });
  meld(vouw.onder <= 844, 'alle keuzes van vraag 1 boven de vouw', `laatste keuze eindigt op ${vouw.onder} van 844`);
  meld(vouw.h1 === 'Dé specialist voor uw dakwerk', 'kop', vouw.h1);
  await page.screenshot({ path: `${UIT}/01-hero.png` });

  /* 2. Vraag 1 (Recotex-volgorde): soort dak, geen 'Weet u het niet zeker' */
  const v1 = await page.evaluate(() => ({
    keuzes: [...document.querySelectorAll('#rekenaar .kgj-reken__keuze strong')].map((b) => b.textContent.trim()),
    vraag: document.querySelector('#rekenaar .kgj-reken__vraag').textContent.trim(),
    gerust: !!document.querySelector('#rekenaar .kgj-reken__gerust'),
  }));
  meld(v1.vraag === 'Welk soort dak heeft u?' && v1.keuzes.join('|') === 'Hellend dak|Plat dak', 'vraag 1 = soort dak', `${v1.vraag} / ${v1.keuzes.join(', ')}`);
  meld(!v1.gerust, "geen 'Weet u het niet zeker' bij vraag 1");
  meld((await tel()) === 'Vraag 1 van 8', 'teller start op 1 van 8 (langste pad)', await tel());

  /* 3. Hellend + renovatie tot het formulier (Mohammed 24 sep: na vraag 1
     eerst herstelling/renovatie/isolatie, dan hoe oud het dak is). */
  const tip = () => page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__tip')?.textContent.trim() || '');
  const keuzesNu = () => page.evaluate(() => [...document.querySelectorAll('#rekenaar .kgj-reken__keuze strong')].map((b) => b.textContent.trim()).join('|'));
  await klikKeuze('Hellend dak'); await wacht(250);
  meld((await vraag()) === 'Wat moet er aan uw dak gebeuren?' && (await keuzesNu()) === 'Herstelling|Renovatie|Isolatie' && (await tel()) === 'Vraag 2 van 8',
    'vraag 2 = herstelling, renovatie, isolatie', `${await vraag()} / ${await keuzesNu()} / ${await tel()}`);
  await klikKeuze('Renovatie'); await wacht(250);
  meld((await vraag()) === 'Hoe oud is uw dak?' && (await tel()) === 'Vraag 3 van 8', 'vraag 3 = hoe oud is uw dak', `${await vraag()} / ${await tel()}`);
  meld((await keuzesNu()) === 'Jonger dan 10 jaar|Ouder dan 10 jaar', 'leeftijd: alleen jonger of ouder dan 10 jaar', await keuzesNu());
  meld(!(await tip()), 'nog geen btw-melding vóór het antwoord');
  await klikKeuze('Ouder dan 10 jaar'); await wacht(250);
  meld((await vraag()) === 'Welke dakbedekking wenst u?', 'renovatie: dakbedekking die u wenst', await vraag());
  meld((await tip()).includes('6% btw'), 'btw-melding na een dak ouder dan 10 jaar', await tip());
  const volgorde = [];
  const tipDaarna = [];
  for (const k of ['Gegolfde pannen', '50 tot 100 m²', 'Ja', 'Nee', 'Zo snel mogelijk']) { await klikKeuze(k); await wacht(250); volgorde.push(await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim())); tipDaarna.push(await tip()); }
  meld(volgorde.slice(0, 4).join(' > ') === 'Hoe groot is het dak? > Is er isolatie nodig? > Is er asbest aanwezig in het dak? > Wanneer wilt u beginnen?', 'renovatie: grootte, isolatie, asbest, start', volgorde.slice(0, 4).join(' > '));
  meld(tipDaarna.every((t) => !t), 'btw-melding staat alleen op de stap na het antwoord');
  const form = await page.evaluate(() => {
    const knop = document.querySelector('#rekenaar .kgj-reken__knop');
    return { knop: knop && knop.textContent.trim(), onder: !!document.querySelector('#rekenaar form .kgj-reken__gerust') };
  });
  meld(form.knop === 'Bereken prijs', 'verzendknop calculator', form.knop);
  meld(!form.onder, "zin 'U hoort de prijs binnen één werkdag' is weg");
  await page.evaluate(() => document.querySelector('#rekenaar').scrollIntoView({ block: 'center' }));
  await wacht(300);
  await page.screenshot({ path: `${UIT}/02-calculator-formulier.png` });

  const naarBegin = async () => { for (let i = 0; i < 9; i++) { await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__terug')?.click()); await wacht(150); } };

  /* 3b. Tikken zoals op een telefoon: het antwoord dat na de tik op dezelfde
     plek staat, mag er niet gekozen uitzien (Mohammed 25 sep: "1 ding is
     altijd geselecteerd voor het klikken ... zeker op telefoon"). Oorzaak was
     :hover die op een aanraakscherm blijft hangen. */
  await naarBegin();
  await page.evaluate(() => document.querySelector('#rekenaar').scrollIntoView({ block: 'center' }));
  await wacht(300);
  const tikOp = async (label) => {
    const r = await page.evaluate((l) => { const b = [...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith(l)); const x = b.getBoundingClientRect(); return { x: x.left + x.width / 2, y: x.top + x.height / 2 }; }, label);
    /* Mohammed 25 sep: "je ziet niet wat je hebt aangeklikt" en "na de tik moet
       het direct doorgaan". Tijdens het drukken kleurt het antwoord goud; na het
       loslaten staat binnen 150 ms de volgende vraag er. */
    const rust = await page.evaluate((l) => getComputedStyle([...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith(l))).borderColor, label);
    await page.touchscreen.touchStart(r.x, r.y);
    await wacht(60);
    r.druk = await page.evaluate((l) => getComputedStyle([...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k.textContent.trim().startsWith(l))).borderColor, label);
    r.rust = rust;
    await page.touchscreen.touchEnd();
    await wacht(150);
    r.vraagNa = await page.evaluate(() => document.querySelector('#rekenaar .kgj-reken__vraag')?.textContent.trim());
    await wacht(300);
    return r;
  };
  /* Op "Plat dak": dat antwoord staat na de doorloop hierboven niet gekozen, dus
     de rustkleur is de gewone grijze rand. */
  const plek = await tikOp('Plat dak');
  meld(plek.druk !== plek.rust, 'tijdens het drukken kleurt het antwoord op', `rust ${plek.rust} / druk ${plek.druk}`);
  meld(plek.vraagNa === 'Wat moet er aan uw dak gebeuren?', 'na het loslaten meteen de volgende vraag (binnen 150 ms)', plek.vraagNa);
  const naTik = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y)?.closest('.kgj-reken__keuze');
    if (!el) return { geraakt: false };
    const s = getComputedStyle(el);
    /* Referentie: een ander antwoord dat niet als gekozen gemarkeerd is (na
       "Terug" blijft het vorige antwoord bewust gemarkeerd). */
    const rust = getComputedStyle([...document.querySelectorAll('#rekenaar .kgj-reken__keuze')].find((k) => k !== el && !k.classList.contains('is-aan')));
    return { geraakt: true, label: el.querySelector('strong').textContent.trim(), rand: s.borderColor, schaduw: s.boxShadow, rustRand: rust.borderColor, rustSchaduw: rust.boxShadow, aan: el.classList.contains('is-aan'),
      aanraak: matchMedia('(hover: none)').matches || matchMedia('(pointer: coarse)').matches };
  }, plek);
  meld(naTik.aanraak, 'testbrowser meldt zich als aanraakscherm (anders meet 3b niets)');
  meld(!naTik.geraakt || (!naTik.aan && naTik.rand === naTik.rustRand && naTik.schaduw === naTik.rustSchaduw),
    'na een tik ziet het volgende antwoord op die plek er niet gekozen uit', naTik.geraakt ? `${naTik.label}: rand ${naTik.rand} / rust ${naTik.rustRand}` : 'geen antwoord op die plek');

  /* 4. Plat + renovatie, dak jonger dan 10 jaar (terug naar vraag 1) */
  await naarBegin();
  for (const k of ['Plat dak', 'Renovatie', 'Jonger dan 10 jaar']) { await klikKeuze(k); await wacht(250); }
  const plat = await keuzesNu();
  meld((await vraag()) === 'Wat wilt u op uw plat dak?' && plat === 'Bitumen|Roofing|EPDM|Weet ik nog niet' && (await tel()) === 'Vraag 4 van 8',
    'plat: bitumen, roofing, EPDM', `${await vraag()} / ${plat} / ${await tel()}`);
  meld(!(await tip()), 'geen btw-melding bij een dak jonger dan 10 jaar');

  /* 4b. Hellend + herstelling: wat ligt er NU, geen isolatievraag, 7 vragen */
  await naarBegin();
  const herstel = [];
  for (const k of ['Hellend dak', 'Herstelling', 'Ouder dan 10 jaar']) { await klikKeuze(k); await wacht(250); }
  herstel.push(await vraag());
  const telHerstel = await tel();
  for (const k of ['Gegolfde pannen', 'Kleiner dan 50 m²', 'Nee']) { await klikKeuze(k); await wacht(250); herstel.push(await vraag()); }
  meld(herstel.join(' > ') === 'Welke dakbedekking ligt er nu? > Hoe groot is het dak? > Is er asbest aanwezig in het dak? > Wanneer wilt u beginnen?' && telHerstel === 'Vraag 4 van 7',
    'herstelling: huidige bedekking, grootte, asbest, start (7 vragen)', `${herstel.join(' > ')} / ${telHerstel}`);

  /* 4c. Isolatie: geen bedekking, geen isolatievraag, 6 vragen */
  await naarBegin();
  const isol = [];
  for (const k of ['Hellend dak', 'Isolatie', 'Jonger dan 10 jaar']) { await klikKeuze(k); await wacht(250); }
  isol.push(await vraag());
  const telIsol = await tel();
  for (const k of ['Kleiner dan 50 m²', 'Nee']) { await klikKeuze(k); await wacht(250); isol.push(await vraag()); }
  meld(isol.join(' > ') === 'Hoe groot is het dak? > Is er asbest aanwezig in het dak? > Wanneer wilt u beginnen?' && telIsol === 'Vraag 4 van 6',
    'isolatie: grootte, asbest, start (6 vragen)', `${isol.join(' > ')} / ${telIsol}`);
  await naarBegin();

  /* 5. Horizontaal scrollen en foto's */
  const breed = await page.evaluate(() => document.documentElement.scrollWidth);
  meld(breed <= 390, 'geen horizontaal scrollen', `paginabreedte ${breed}`);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((k) => setTimeout(k, 120)); } });
  await wacht(1200);
  const kapot = await page.evaluate(() => [...document.querySelectorAll('.kgjx img')].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src')));
  meld(kapot.length === 0, 'alle foto’s geladen', kapot.join(', '));

  /* 6. Vaste balk onderaan: zichtbaar midden op de pagina */
  /* Direct springen: de pagina scrollt vloeiend (scroll-behavior: smooth), en
     wie meet terwijl dat nog loopt, ziet een verschuiving die het venster
     niet veroorzaakt (eerste meting: 1946 -> 1931). */
  await page.evaluate(() => window.scrollTo({ top: document.getElementById('werkwijze').offsetTop, behavior: 'instant' }));
  await wacht(600);
  const balk = await page.evaluate(() => { const b = document.querySelector('.kgj-actiebalk'); return b && getComputedStyle(b).display !== 'none'; });
  meld(balk, 'vaste balk zichtbaar midden op de pagina');
  await page.screenshot({ path: `${UIT}/03-werkwijze.png` });

  /* 6b. De knop in de balk heet "Gratis dakinspectie" (Mohammed 24 sep) */
  const balkKnop = await page.evaluate(() => document.querySelector('.kgj-actiebalk .kgj-knop--vol')?.textContent.trim());
  meld(balkKnop === 'Gratis dakinspectie', 'knop in de vaste balk = Gratis dakinspectie', balkKnop);

  /* 7. Venster: de prijsknop op de pagina opent de calculator op de plek zelf */
  const yVoor = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => document.querySelector('.kgj-midknop button')?.click());
  await wacht(400);
  const venster = await page.evaluate(() => {
    const v = document.querySelector('.kgj-venster');
    if (!v) return null;
    const r = v.querySelector('.kgj-reken').getBoundingClientRect();
    return { vraag: v.querySelector('.kgj-reken__vraag').textContent.trim(), onder: Math.round(r.bottom), y: window.scrollY };
  });
  meld(!!venster, 'prijsknop op de pagina opent het venster');
  if (venster) {
    meld(venster.y === yVoor, 'pagina blijft staan bij openen', `${yVoor} -> ${venster.y}`);
    meld(venster.onder <= 844, 'venster past op het scherm', `onderkant ${venster.onder} van 844`);
    await page.screenshot({ path: `${UIT}/04-venster.png` });
    await page.evaluate(() => document.querySelector('.kgj-venster__dicht').click());
    await wacht(300);
    meld(!(await page.$('.kgj-venster')), 'venster sluit met het kruisje');
  }

  /* 8. De balkknop brengt de bezoeker naar het inspectieformulier */
  await page.evaluate(() => window.scrollTo({ top: document.getElementById('werkwijze').offsetTop, behavior: 'instant' }));
  await wacht(500);
  await page.evaluate(() => document.querySelector('.kgj-actiebalk .kgj-knop--vol')?.click());
  await wacht(1500);
  const inBeeld = await page.evaluate(() => { const r = document.querySelector('.kgj-reken--inspectie').getBoundingClientRect(); return r.top < 844 && r.bottom > 0; });
  meld(inBeeld, 'balkknop brengt u naar het inspectieformulier');

  /* 8b. Slotblok met inspectieformulier */
  await page.evaluate(() => document.getElementById('contact').scrollIntoView());
  await wacht(800);
  const slot = await page.evaluate(() => ({
    kop: document.querySelector('#contact h2')?.textContent.trim(),
    punten: [...document.querySelectorAll('.kgj-cta__punten li')].map((l) => l.textContent.trim()),
    knop: document.querySelector('.kgj-reken--inspectie .kgj-reken__knop')?.textContent.trim(),
    balk: getComputedStyle(document.querySelector('.kgj-actiebalk')).display !== 'none',
  }));
  meld(slot.kop === 'Gratis dakinspectie', 'slotblok-kop', slot.kop);
  meld(slot.punten.length === 3, 'drie vinkjes bij de inspectie', slot.punten.join(' | '));
  meld(slot.knop === 'Vraag uw gratis dakinspectie aan', 'knop inspectieformulier', slot.knop);

  /* 8c. Postcode of gemeente (Mohammed 25 sep): automatisch kiezen bij postcode
     en bij een volledige naam, voorstellen bij deelgemeenten. */
  const pg = '.kgj-reken--inspectie .kgj-pg input[type=text]';
  const pgStaat = () => page.evaluate(() => {
    const w = document.querySelector('.kgj-reken--inspectie .kgj-pg');
    return {
      tekst: w.querySelector('input[type=text]').value,
      postcode: w.querySelector('input[name=postcode]').value,
      gemeente: w.querySelector('input[name=gemeente]').value,
      opties: [...w.querySelectorAll('.kgj-pg__lijst li')].map((l) => l.textContent.trim()),
    };
  });
  /* Veld leegmaken zoals een bezoeker: alles selecteren en wissen (een
     driedubbele tik selecteert niets op een aanraakscherm). */
  const typ = async (s) => {
    await page.focus(pg);
    await page.$eval(pg, (el) => el.select());
    await page.keyboard.press('Backspace');
    await wacht(150);
    await page.type(pg, s, { delay: 40 });
    await wacht(500);
  };
  await typ('2850');
  let st = await pgStaat();
  meld(st.tekst === '2850 Boom' && st.postcode === '2850' && st.gemeente === 'Boom' && !st.opties.length, 'postcode 2850 kiest vanzelf Boom', JSON.stringify(st));
  await typ('2830');
  st = await pgStaat();
  meld(st.opties.length === 4 && st.opties.join('|').includes('Willebroek'), 'postcode 2830 toont de 4 deelgemeenten', st.opties.join(' | '));
  const optie = await page.$$('.kgj-reken--inspectie .kgj-pg__lijst li');
  const doelOptie = [];
  for (const o of optie) { if ((await (await o.getProperty('textContent')).jsonValue()).includes('Willebroek')) doelOptie.push(o); }
  /* Het voorstel moet zichtbaar en raakbaar zijn: het element op het tikpunt
     is het voorstel zelf, niet de cookiebanner of een vaste balk. */
  let raakbaar = false;
  if (doelOptie[0]) {
    const b = await doelOptie[0].boundingBox();
    const x = b.x + b.width / 2, y = b.y + b.height / 2;
    raakbaar = await page.evaluate((x, y) => !!document.elementFromPoint(x, y)?.closest('.kgj-pg__lijst li'), x, y);
    await page.touchscreen.tap(x, y); await wacht(300);
  }
  meld(raakbaar, 'voorstel is zichtbaar en raakbaar (niets ligt erover)');
  st = await pgStaat();
  meld(st.tekst === '2830 Willebroek' && st.postcode === '2830' && st.gemeente === 'Willebroek' && !st.opties.length, 'tik op een voorstel kiest het', JSON.stringify(st));
  await typ('Willebroek');
  st = await pgStaat();
  meld(st.tekst === '2830 Willebroek' && st.postcode === '2830', 'volledige naam kiest vanzelf', JSON.stringify(st));
  await typ('Mech');
  st = await pgStaat();
  meld(st.opties.some((o) => o.includes('Mechelen')), 'begin van een naam geeft voorstellen', st.opties.slice(0, 3).join(' | '));
  await page.keyboard.press('Escape');
  await page.evaluate(() => document.querySelector('.kgj-reken--inspectie').scrollIntoView({ block: 'center' }));
  await wacht(700);
  const balkBijForm = await page.evaluate(() => getComputedStyle(document.querySelector('.kgj-actiebalk')).display !== 'none');
  meld(!balkBijForm, 'vaste balk verdwijnt bij het formulier (dekt de knop niet af)');
  await page.screenshot({ path: `${UIT}/05-inspectie.png` });

  /* 9. Voet */
  const voet = await page.evaluate(() => document.querySelector('.kgj-voet')?.textContent || '');
  meld(voet.includes('BE 0712.443.881'), 'btw-nummer in de voet');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wacht(400);
  await page.screenshot({ path: `${UIT}/06-voet.png` });

  /* 10. Diensten (Mohammed 25 sep: "de diensten moeten zijn, nieuw dak,
     dakrenovatie, dakisolatie, dakherstelling"). Elk anker is een mogelijke
     sitelink: na het openen van /lp/dakwerken#id staat die kaart in beeld. */
  const diensten = await page.evaluate(() => ({
    kop: document.querySelector('#diensten h2')?.textContent.trim(),
    namen: [...document.querySelectorAll('#diensten .kgj-dienst h3')].map((h) => h.textContent.trim()),
    ids: [...document.querySelectorAll('#diensten .kgj-dienst')].map((d) => d.id),
    iconen: [...document.querySelectorAll('#diensten .kgj-dienst__icoon svg')].length,
  }));
  meld(diensten.kop === 'Onze diensten', 'kop dienstensectie', diensten.kop);
  meld(diensten.namen.join('|') === 'Nieuw dak|Dakrenovatie|Dakisolatie|Dakherstelling', 'diensten: nieuw dak, dakrenovatie, dakisolatie, dakherstelling', diensten.namen.join(' | '));
  meld(diensten.iconen === 4, 'elke dienst heeft een icoon', `${diensten.iconen} iconen`);
  const ankers = [];
  for (const id of diensten.ids) {
    const q = await browser.newPage();
    await q.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await q.evaluateOnNewDocument(() => localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false })));
    await q.goto(`${URL}#${id}`, { waitUntil: 'networkidle0' });
    await wacht(700);
    ankers.push(await q.evaluate((a) => { const r = document.getElementById(a).getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight ? a : `${a} buiten beeld (${Math.round(r.top)})`; }, id));
    await q.close();
  }
  meld(ankers.length === 4 && ankers.every((a) => !a.includes('buiten')), 'elk dienstanker springt naar zijn kaart', ankers.join(' | '));

  meld(fouten.length === 0, 'geen fouten in de console', fouten.slice(0, 3).join(' | '));
  await browser.close();

  console.log(uitslag.join('\n'));
  const niet = uitslag.filter((r) => r.startsWith('NIET')).length;
  console.log(`\n${uitslag.length - niet} van ${uitslag.length} AF · schermen in ${UIT}`);
  process.exit(niet ? 1 : 0);
})();
