#!/usr/bin/env node
/**
 * check-lp-aanvraag: de aanvraagkaart bovenaan (en op de renovatiepagina's ook onderaan) /lp/dakwerken, /lp/totaalrenovatie
 * en /lp/aannemer-renovatiewerken.
 *
 * Aanleiding (19 okt 2026, opdracht Mohammed): "bouw de abgroep totaalrenovatie en dakwerken lp naar de nieuwe, dus
 * rekenaar weg, en doe dat naar dakinspectie en gratis plaatsbezoek form bovenaan en andere headline en subheadline".
 * De rekenaar blijft alleen op /lp/richtprijs-berekenen (prijs- en woningzoekwoorden, Mohammed 6 okt: "VOLLEDIG ZO LATEN").
 * 22 okt 2026 (Mohammed), alleen /lp/totaalrenovatie en /lp/aannemer-renovatiewerken: onderaan bij het plaatsbezoek dezelfde
 * klikkaart ("zo dat je makkelijk kan klikken") met een extra vraag (budget, 3 vragen + contactstap = 4 stappen); de contactstap
 * heeft alleen nog Naam* en Gsm* ("verwijder email form, verwijder postcode form"); een disclaimer boven de knop; trust badges
 * als tegels met iconen (zelfde teksten); geen "Eerstvolgend vrij plaatsbezoek" en geen free-slots-verzoek meer; geen termijn
 * ("binnen één werkdag") in de kaart. Alleen /lp/dakwerken: het belblok "Lekt uw dak?" direct onder de hero.
 * 22 okt 2026, Mohammed: "je hebt veel vergeten", "DIE FORMS", "die visuele dingetjes", "EN TIS ENKEL lp dakwerken en lp
 * totaalrenovatie": /lp/dakwerken krijgt hetzelfde als de renovatiepagina's: klikkaart ook onderaan, een extra vraag (de start,
 * 5 vragen + contactstap = 6 stappen), alleen Naam* en Gsm*, een disclaimer, trust badges. Deze toets eiste tot dan het omgekeerde
 * op /lp/dakwerken (Inspectie onderaan, e-mail en postcode, geen disclaimer, geen badges); dat is nu dezelfde eis voor alle drie.
 *
 * Per pagina, zoals een bezoeker:
 *   1. geen enkele rekenaar-ingang: geen rekenaarkaart (kgj-reken--hero / --venster), geen venster, geen vangnet, geen
 *      knop "Liever eerst een prijs?", geen knop of link met "bereken", en in de zichtbare tekst, de paginatitel en de
 *      meta-omschrijving geen "rekenaar", "richtprijs" of "bereken";
 *   2. eerste gsm-scherm (390x844): het woord "gratis dakinspectie" (dak) of "gratis plaatsbezoek" (renovatie), de
 *      eerste klikvraag en al haar keuzes staan volledig in beeld;
 *   3. één tik = antwoord en meteen de volgende vraag ("Stap 1 van n" wordt "Stap 2 van n"), een tweede tik binnen
 *      200 ms slaat geen vraag over, Terug brengt de vorige vraag terug; op de renovatiepagina's geldt dat voor de kaart
 *      bovenaan (#rekenaar) én voor de kaart onderaan (#contact);
 *   4. de contactstap: de band "Bijna klaar! Bevestig uw gratis ...", EXACT twee velden: naam (verplicht) en telefoon
 *      (verplicht), geen e-mail-, geen postcodeveld; een disclaimer direct onder de band (de zin van bfbouw.be) en
 *      zonder kop "Wat u krijgt" (22 okt: "haal dat weg"); de labels "Naam *" en "Telefoonnummer *" ("niet gsm"); de regel
 *      onder de knop (dak: "Onze dakexpert neemt zo snel mogelijk contact met u op."); de knop = de knop van het formulier
 *      onderaan; versturen zonder naam geeft "Vul uw naam in." (20 okt 2026: de bevestigings-sms begint met "Dag
 *      {{voornaam}},"), daarna met naam maar zonder gsm-nummer de gsm-melding; beide verzenden NIETS;
 *   5. message match (dak): ?utm_term=plat dak toont de kop "Dé specialist voor uw platte dak" en de kaart begint bij
 *      vraag 2 ("Stap 2 van 5"); Terug geeft vraag 1. Zonder utm_term begint ze bij vraag 1.
 *   6. de kop (h1) is de afgesproken kop en geen werkwijze-kop. 20 okt 2026, Mohammed over "Laat uw dak gratis
 *      inspecteren": "wat is dat voor een headline" en "je kan toch zelf ook redeneren dat dit niet goed is". Een kop die
 *      de bezoeker een opdracht geeft over de inspectie, het plaatsbezoek of de offerte gaat over onze werkwijze, niet over
 *      zijn huis, en herhaalt het aanbod dat de kaart al noemt (memory feedback_hook_gaat_over_het_huis, punt 5). Het
 *      aanbod hoort in de subkop en de kaart.
 *   7. onderaan (#contact): op de drie pagina's de klikkaart en géén keuzelijst (<select>) en geen formulier van
 *      Inspectie; er staat precies één element #rekenaar;
 *   8. geen "Eerstvolgend vrij ..." in de tekst en geen verzoek naar free-slots (de GHL-agenda) op de drie pagina's
 *      (22 okt 2026, Mohammed: "haal weg bij abgroep die volgende moment");
 *   9. badges: de vertrouwensrij in de kaart is drie tegels met een icoon en de teksten/cijfers blijven letterlijk
 *      (renovatie "5,0", "16 jaar ervaring", zonder "6 vakdisciplines"; dak "5,0", "10 jaar garantie", "15 jaar ervaring"); de drie
 *      vinkjes letterlijk, elk met een eigen icoon; "5,0 op Google" in de hero;
 *  10. belblok (alleen /lp/dakwerken, 22 okt 2026): kop "In nood?" (eerst "Lekt uw dak?"), knop "Bel direct <nummer>" met dezelfde tel:-href als
 *      de belknop in de kop, link "Of vraag uw gratis dakinspectie aan" naar #rekenaar; staat buiten de hero, na de
 *      hero, binnen de eerste 1500 px op de gsm, zonder schaduw en kaart; geen "24/7", "meteen", "binnen", tijden ("nood" mag sinds 22 okt: zijn kop);
 *      op de gsm gestapeld met een knop van minstens 48 px en volle breedte; Clarity-events dak-bel-blok en
 *      dak-bel-blok-inspectie bij een klik; NIET op de renovatiepagina's en NIET op /lp/richtprijs-berekenen;
 *  11. geen horizontale scroll;
 *  12. vaste knop onderaan de gsm: een tik brengt de klikkaart onderaan in beeld (tot 22 okt 2026 deed hij niets meer).
 * Wat er bij een volledige aanvraag naar GHL en Web3Forms gaat (bron_lead, aanvullende_info, Toestemming, /bedankt),
 * toetst check-lp-payload veld voor veld.
 *
 * Positieve controles (zonder: exit 2): /lp/richtprijs-berekenen (de rekenaarpagina) moet op punt 1 falen en op punt 7 en 10;
 * een kaart die 900 px lager staat (geplante CSS) moet op punt 2 falen; een tik die niets doet (geplante pointer-events: none
 * op de keuzes) moet op punt 3 falen; een weggehaalde disclaimer en een disclaimer zonder vet deel moeten de disclaimertoets
 * laten falen, een gewoon vinkje bij de badges de badgetoets; een geplante
 * tekst "Eerstvolgend ..." plus een geplande free-slots-aanvraag moeten punt 8 laten falen.
 * Niets gaat naar buiten: GHL en Web3Forms krijgen een leeg antwoord (en worden geteld: elke telling > 0 is een fout),
 * de free-slots-aanvraag wordt geteld en beantwoord, Clarity en Google-tags krijgen een leeg script, tel: en mailto: worden
 * afgebroken.
 *
 * Draaien:  node scripts/check-lp-aanvraag.cjs                       (start zelf een vite dev-server)
 *           LP_BASIS=http://localhost:8080 node scripts/check-lp-aanvraag.cjs
 * Exit 0 = alles AF, 1 = afwijking, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4434;
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const VERBODEN = /rekenaar|richtprijs|bereken/i;
/* 6. werkwijze-kop: het aanbod of een opdracht in de h1 */
const WERKWIJZEKOP = /inspect|plaatsbezoek|offerte|bereken|richtprijs|^(laat|plan|vraag|bestel|ontvang)\b/i;
const kopFouten = (h1, verwacht) => {
  const uit = [];
  if (h1 !== verwacht) uit.push(`kop "${h1}" in plaats van "${verwacht}"`);
  if (WERKWIJZEKOP.test(h1 || '')) uit.push(`werkwijze-kop "${h1}" (aanbod of opdracht in de kop; het aanbod hoort in de subkop en de kaart)`);
  return uit;
};

const HERO = '#rekenaar .kgj-reken--aanvraag';
const ONDER = '#contact .kgj-reken--aanvraag';
const DAK = {
  pad: '/lp/dakwerken', soort: 'dak', kop: 'Dé specialist voor uw nieuwe dak', woord: 'gratis dakinspectie', vraag1: 'Wat voor dak heeft u?', keuzes1: ['Hellend dak', 'Plat dak'],
  /* de vijfde vraag (22 okt 2026): de start, vier keuzes */
  pad1: ['Hellend dak', 'Dakrenovatie / Nieuw dak', 'Ja', 'Nee', 'Zo snel mogelijk'], vraag2: 'Wat moet er aan uw dak gebeuren?',
  band: 'Bijna klaar! Bevestig uw gratis dakinspectie', knop: 'Vraag uw gratis dakinspectie aan', stappen: 6,
  /* 22 okt 2026: de zin van bfbouw.be (contactSub, zijn dictaat 17 okt), "dat wat er stond" */
  disclaimer: 'Laat uw dak vakkundig controleren. Voorkom onvoorziene kosten en weet exact wat er moet gebeuren.',
  tegels: ['5,0', '10 jaar garantie', '15 jaar ervaring'],
  /* 21 okt, Mohammed woordelijk: "onze dakexpert ... neemt zo snel mogelijk contact met u op" */
  onder: 'Onze dakexpert neemt zo snel mogelijk contact met u op.',
  vinkjes: ['Gratis & vrijblijvende dakinspectie', 'Vakmanschap tot in de details', '6% btw-tarief (woningen > 10 jaar)'],
};
const RENO = (pad) => ({
  pad, soort: 'reno', kop: 'Jouw complete renovatie, perfect geregeld van A tot Z.', woord: 'gratis plaatsbezoek',
  /* 22 okt 2026, Mohammed: "2 meer vragen, bij stap 1 graag wat voor woning", "en dan die vraag van dat ze mooi kunnen aanklikken wat
     er allemaal nodig is": woning, omvang, afvinkvraag (een lijst in pad1 = die vinkjes en dan Volgende), start, budget */
  vraag1: 'Wat voor woning wilt u renoveren?', keuzes1: ['Appartement', 'Rijwoning', 'Halfopen bebouwing', 'Open bebouwing'],
  pad1: ['Rijwoning', 'Gedeeltelijke renovatie', ['Keuken', 'Badkamer'], 'Zo snel mogelijk', '€ 25.000 tot € 75.000'], vraag2: 'Wat wilt u renoveren?',
  band: 'Bijna klaar! Bevestig uw gratis plaatsbezoek', knop: 'Bevestig mijn gratis plaatsbezoek', stappen: 6,
  disclaimer: 'Laat uw woning vakkundig bekijken. Voorkom onvoorziene kosten en weet exact wat er moet gebeuren.',
  /* 22 okt 2026: "6 vakdisciplines ... weg, bij die form", "dat is een rare trust badge" */
  tegels: ['5,0', '16 jaar ervaring'],
  onder: 'Wij nemen zo snel mogelijk contact met u op.',
  vinkjes: ['Vaste prijs vooraf', 'Eén vast aanspreekpunt', 'Vakmanschap tot in de details'], // 22 okt 2026: geen budgetgarantie meer
});
const PAGINAS = [DAK, RENO('/lp/totaalrenovatie'), RENO('/lp/aannemer-renovatiewerken')];

(async () => {
  let srv = null;
  let basis = process.env.LP_BASIS ? process.env.LP_BASIS.replace(/\/$/, '') : null;
  if (!basis) {
    const vite = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    srv = spawn(process.execPath, [vite, '--port', String(POORT), '--strictPort'], { stdio: 'ignore', cwd: path.join(__dirname, '..') });
    basis = `http://localhost:${POORT}`;
    let op = false;
    for (let i = 0; i < 90 && !op; i++) { try { op = (await fetch(basis + '/lp/dakwerken')).ok; } catch { await wacht(500); } }
    if (!op) { try { srv.kill(); } catch { /* */ } console.log('ONGELDIGE METING: dev-server kwam niet op'); process.exit(2); }
  }
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] });
  const fouten = [];
  let leads = 0, metingen = 0;

  const open = async (url, { gsm = true, css = null } = {}) => {
    const ctx = await br.createBrowserContext();
    const p = await ctx.newPage();
    const slots = [];
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (/^(tel|mailto):/.test(u)) return r.abort();
      if (/services\.leadconnectorhq\.com|api\.web3forms\.com/.test(u)) {
        if (r.method() !== 'OPTIONS') leads++;
        return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type' }, body: '{}' });
      }
      /* de agenda van GHL (eerstvolgend vrij moment): tellen en leeg beantwoorden, nooit het echte verzoek */
      if (/free-slots/.test(u)) { slots.push(u); return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' }); }
      if (/clarity\.ms|googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
      if (!/^(127\.0\.0\.1|localhost)$/.test(new URL(u).hostname) && r.method() !== 'GET') return r.abort();
      return r.continue();
    });
    /* minder beweging: de kaart scrolt na een stap meteen (geen zachte scroll onder de vinger), de herofoto's wisselen niet */
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    if (gsm) await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    else await p.setViewport({ width: 1265, height: 800 });
    await p.evaluateOnNewDocument(() => { try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false, ts: Date.now() })); } catch { /* */ } });
    await p.goto(basis + url, { waitUntil: 'load', timeout: 60000 });
    await p.waitForSelector('.bf-lp', { timeout: 20000 }).catch(() => {});
    await p.evaluate(() => document.fonts.ready);
    /* geplante fout voor een positieve controle: CSS na het laden */
    if (css) await p.addStyleTag({ content: css });
    await wacht(700);
    return { p, ctx, slots };
  };

  /* 1. Rekenaar-ingangen en rekenaarwoorden. */
  const rekenaarSporen = (p) => p.evaluate((bron) => {
    const re = new RegExp(bron, 'i');
    const uit = [];
    for (const [sel, naam] of [['.kgj-reken--hero', 'rekenaarkaart'], ['.kgj-reken--venster, .kgj-venster', 'rekenaarvenster'],
      ['.bf-lpvangnet', 'vangnet'], ['.kgj-reken__alt', 'knop "Liever eerst een prijs?"']]) if (document.querySelector(sel)) uit.push(naam);
    const knoppen = [...document.querySelectorAll('button, a')].filter((e) => re.test(e.textContent || '') || re.test(e.getAttribute('aria-label') || ''));
    if (knoppen.length) uit.push(`knop of link: "${knoppen[0].textContent.trim().slice(0, 50)}"`);
    const tekst = document.body.innerText;
    const m = tekst.match(new RegExp(`.{0,30}(${bron}).{0,30}`, 'i'));
    if (m) uit.push(`zichtbare tekst: "${m[0].replace(/\s+/g, ' ')}"`);
    if (re.test(document.title)) uit.push(`paginatitel: "${document.title}"`);
    const meta = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    if (re.test(meta)) uit.push(`meta-omschrijving: "${meta}"`);
    return uit;
  }, VERBODEN.source);

  /* 2. Eerste gsm-scherm: woord, vraag 1 en elke keuze volledig binnen 0-844. */
  const eersteScherm = (p, pg) => p.evaluate((pg, HERO) => {
    const H = innerHeight;
    const zicht = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height > 0 && r.top >= 0 && r.bottom <= H && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.5; };
    const uit = [];
    const metWoord = [...document.querySelectorAll('h1, p, span, b, strong, li')].filter((e) => e.textContent.toLowerCase().includes(pg.woord) && zicht(e));
    if (!metWoord.length) uit.push(`"${pg.woord}" staat niet in het eerste scherm`);
    const kaart = document.querySelector(HERO);
    if (!kaart) return [...uit, 'geen aanvraagkaart'];
    const vraag = kaart.querySelector('.kgj-reken__vraag');
    if (!vraag || vraag.textContent.trim() !== pg.vraag1) uit.push(`eerste vraag is "${vraag?.textContent.trim()}" in plaats van "${pg.vraag1}"`);
    else if (!zicht(vraag)) uit.push(`eerste vraag buiten het eerste scherm (onderkant ${Math.round(vraag.getBoundingClientRect().bottom)} van ${H})`);
    const keuzes = [...kaart.querySelectorAll('.kgj-reken__keuze')];
    const labels = keuzes.map((k) => k.querySelector('strong')?.textContent.trim());
    if (labels.join('|') !== pg.keuzes1.join('|')) uit.push(`keuzes ${labels.join(' / ')} in plaats van ${pg.keuzes1.join(' / ')}`);
    const buiten = keuzes.filter((k) => !zicht(k));
    if (buiten.length) uit.push(`${buiten.length} keuze(s) buiten het eerste scherm (laatste onderkant ${Math.round(keuzes.at(-1).getBoundingClientRect().bottom)} van ${H})`);
    return uit;
  }, pg, HERO);

  const stand = (p, root = HERO) => p.evaluate((root) => {
    const k = document.querySelector(root);
    return { tel: k.querySelector('.kgj-reken__tel')?.textContent.trim(), vraag: k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.textContent.trim().replace(/\s+/g, ' '),
      terug: !!k.querySelector('.kgj-reken__terug'), form: !!k.querySelector('form.kgj-reken__form') };
  }, root);
  /* Een echte tik op het midden van de keuze (touchscreen), nadat die in beeld staat. */
  const tik = async (p, label, root = HERO) => {
    /* Afvinkvraag (renovatie, 22 okt 2026): Volgende staat uit zolang er niets is aangevinkt; dan elk vinkje en Volgende. */
    if (Array.isArray(label)) {
      const uit = await p.evaluate((root) => document.querySelector(root + ' .kgj-reken__verder')?.disabled, root);
      if (uit !== true) return false;
      for (const l of label) {
        const ok = await p.evaluate((root, l) => { const b = [...document.querySelectorAll(root + ' .kgj-reken__vink--chip')].find((x) => x.textContent.trim() === l); b?.click(); return !!b; }, root, l);
        if (!ok) return false;
        await wacht(150);
      }
      const aan = await p.evaluate((root) => [...document.querySelectorAll(root + ' .kgj-reken__vink--chip.is-aan')].map((x) => x.textContent.trim()), root);
      if (aan.join('|') !== label.join('|')) return false;
      await p.evaluate((root) => document.querySelector(root + ' .kgj-reken__verder')?.click(), root);
      await wacht(450);
      return true;
    }
    const plek = await p.evaluate((l, root) => {
      const b = [...document.querySelectorAll(root + ' .kgj-reken__keuze')].find((x) => x.textContent.trim().startsWith(l));
      if (!b) return null;
      b.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, label, root);
    if (!plek) return false;
    await wacht(150);
    await p.touchscreen.tap(plek.x, plek.y);
    await wacht(450);
    return true;
  };
  /* 3. Tikgedrag: tik, dubbele tik, Terug. */
  const tikGedrag = async (p, pg, root = HERO) => {
    const uit = [];
    const s0 = await stand(p, root);
    if (s0.tel !== `Stap 1 van ${pg.stappen}` || s0.vraag !== pg.vraag1 || s0.terug) uit.push(`begin: ${JSON.stringify(s0)}`);
    if (!(await tik(p, pg.pad1[0], root))) return [...uit, `keuze "${pg.pad1[0]}" niet gevonden`];
    const s1 = await stand(p, root);
    if (s1.tel !== `Stap 2 van ${pg.stappen}` || s1.vraag !== pg.vraag2 || !s1.terug) uit.push(`na één tik: ${JSON.stringify(s1)} (verwacht Stap 2 van ${pg.stappen}, "${pg.vraag2}", Terug)`);
    await p.evaluate((root) => document.querySelector(root + ' .kgj-reken__terug')?.click(), root);
    await wacht(450);
    const s2 = await stand(p, root);
    if (s2.tel !== `Stap 1 van ${pg.stappen}` || s2.vraag !== pg.vraag1) uit.push(`na Terug: ${JSON.stringify(s2)}`);
    /* dubbele tik: twee klikken binnen 50 ms = één stap */
    await p.evaluate((l, root) => { const b = [...document.querySelectorAll(root + ' .kgj-reken__keuze')].find((x) => x.textContent.trim().startsWith(l)); b.click(); setTimeout(() => { const c = [...document.querySelectorAll(root + ' .kgj-reken__keuze')][0]; c?.click(); }, 40); }, pg.pad1[0], root);
    await wacht(500);
    const s3 = await stand(p, root);
    if (s3.tel !== `Stap 2 van ${pg.stappen}`) uit.push(`dubbele tik: ${s3.tel} (verwacht Stap 2 van ${pg.stappen}: een tweede tik binnen 200 ms telt niet)`);
    return uit;
  };

  /* 4. Disclaimer direct onder de band van de contactstap (zoals bfbouw.be), met de vaste tekst, zonder kop "Wat u krijgt". */
  const disclaimerFouten = (p, root, verwacht) => p.evaluate((root, verwacht) => {
    const k = document.querySelector(root);
    const d = k?.querySelector('form .kgj-reken__disclaimer');
    if (!d) return ['disclaimer ontbreekt op de contactstap'];
    const uit = [];
    const tekst = d.textContent.replace(/\s+/g, ' ').trim();
    if (tekst !== verwacht) uit.push(`disclaimer "${tekst}" in plaats van "${verwacht}"`);
    /* 22 okt 2026, Mohammed over "Wat u krijgt:": "haal dat weg" */
    if (/wat u krijgt/i.test(tekst)) uit.push('de disclaimer heeft nog de kop "Wat u krijgt"');
    if (d.querySelector('b, strong')) uit.push(`de disclaimer heeft een vet deel "${d.querySelector('b, strong').textContent.trim()}"`);
    /* 22 okt 2026: op de plek van bfbouw.be, direct onder "Bijna klaar! Bevestig ..." */
    if (!d.previousElementSibling?.classList.contains('kgj-reken__band')) uit.push('disclaimer staat niet direct onder de band "Bijna klaar! ..."');
    const px = parseFloat(getComputedStyle(d).fontSize);
    if (px < 14) uit.push(`disclaimer is ${px} px (minstens 14)`);
    if (!d.querySelector('svg')) uit.push('disclaimer zonder vinkje');
    return uit;
  }, root, verwacht);

  /* 7. Onderaan (dak en renovatie, 22 okt 2026): klikkaart zonder keuzelijst en zonder formulier van Inspectie; één #rekenaar. */
  const ondenFouten = (p) => p.evaluate((ONDER) => {
    const uit = [];
    const slot = document.querySelector('#contact');
    if (!slot) return ['geen slotblok #contact'];
    const keuzelijsten = slot.querySelectorAll('select').length;
    const inspectie = !!slot.querySelector('.kgj-reken--inspectie');
    if (!document.querySelector(ONDER)) uit.push('onderaan staat de klikkaart niet (#contact .kgj-reken--aanvraag)');
    if (keuzelijsten) uit.push(`onderaan staan nog ${keuzelijsten} keuzelijst(en) (select)`);
    if (inspectie) uit.push('onderaan staat nog het formulier van Inspectie (.kgj-reken--inspectie)');
    const n = document.querySelectorAll('#rekenaar').length;
    if (n > 1) uit.push(`${n} elementen met id="rekenaar" op de pagina`);
    return uit;
  }, ONDER);

  /* 8. Geen "Eerstvolgend vrij ..." en geen free-slots-verzoek. */
  const vrijFouten = async (p, slots) => {
    const uit = [];
    const tekst = await p.evaluate(() => document.body.innerText);
    const m = tekst.match(/.{0,25}eerstvolgend.{0,40}/i);
    if (m) uit.push(`tekst "${m[0].replace(/\s+/g, ' ')}" staat op de pagina`);
    if (slots.length) uit.push(`${slots.length} free-slots-verzoek(en) naar de GHL-agenda (${slots[0].slice(0, 80)})`);
    return uit;
  };

  /* 9. Badges (dak en renovatie, 22 okt 2026): tegels met iconen, teksten en cijfers letterlijk gelijk; elk vinkje een eigen
     icoon (geen twee keer hetzelfde, geen gewoon vinkje). */
  const badgesFouten = (p, pg) => p.evaluate((pg, HERO) => {
    const uit = [];
    const k = document.querySelector(HERO);
    const norm = (e) => e.textContent.replace(/\s+/g, ' ').trim();
    const heeft = !!document.querySelector('.kgj-reken--badges') && !!document.querySelector('.bf-lp--badges');
    if (!heeft) return ['badges ontbreken (.kgj-reken--badges / .bf-lp--badges)'];
    const tegels = [...k.querySelectorAll('.kgj-reken__trust li')];
    if (tegels.map(norm).join('|') !== pg.tegels.join('|')) uit.push(`vertrouwensrij "${tegels.map(norm).join(' | ')}" in plaats van "${pg.tegels.join(' | ')}"`);
    if (tegels.some((t) => !t.querySelector('svg'))) uit.push('een tegel in de vertrouwensrij heeft geen icoon');
    const li = [...k.querySelectorAll('.kgj-reken__vertrouwen li')];
    const vinkjes = li.map(norm);
    if (vinkjes.join('|') !== pg.vinkjes.join('|')) uit.push(`vinkjes "${vinkjes.join(' | ')}" in plaats van "${pg.vinkjes.join(' | ')}"`);
    if (li.some((l) => !l.querySelector('svg'))) uit.push('een vinkje heeft geen icoon');
    const iconen = li.map((l) => [...(l.querySelector('svg')?.classList ?? [])].find((c) => /^lucide-(?!icon$)/.test(c)) ?? '');
    if (new Set(iconen).size !== iconen.length || iconen.some((c) => !c || c === 'lucide-check')) uit.push(`de vinkjes hebben niet elk een eigen icoon (${iconen.join(', ')})`);
    const g = document.querySelector('.bf-lphero__google b')?.textContent.trim();
    if (g !== '5,0 op Google') uit.push(`Google-badge in de hero "${g}" in plaats van "5,0 op Google"`);
    return uit;
  }, pg, HERO);

  /* 10. Belblok op /lp/dakwerken. */
  const belblokFouten = (p, gsm) => p.evaluate((gsm) => {
    const blokken = document.querySelectorAll('.bf-lpbelblok');
    if (blokken.length !== 1) return [`belblok staat ${blokken.length} keer op de pagina (verwacht 1)`];
    const uit = [];
    const blok = blokken[0];
    const norm = (e) => (e?.textContent ?? '').replace(/\s+/g, ' ').trim();
    const kop = norm(blok.querySelector('.bf-lpbelblok__kop'));
    /* 22 okt 2026, Mohammed: "Lekt uw dak pas aan naar, in nood?" */
    if (kop !== 'In nood?') uit.push(`kop "${kop}" in plaats van "In nood?"`);
    const knop = blok.querySelector('a.bf-lpbelblok__knop');
    const link = blok.querySelector('a.bf-lpbelblok__link');
    const kopKnop = document.querySelector('.bf-kop .bf-lpbel');
    const nummer = norm(kopKnop?.querySelector('.bf-lpbel__lang')).replace(/^Bel\s+/, '');
    if (!knop) uit.push('geen belknop in het blok');
    else {
      if (norm(knop) !== `Bel direct ${nummer}`) uit.push(`belknop "${norm(knop)}" in plaats van "Bel direct ${nummer}"`);
      if (!/^tel:/.test(knop.getAttribute('href') || '') || knop.getAttribute('href') !== kopKnop?.getAttribute('href')) uit.push(`tel:-link van het blok "${knop.getAttribute('href')}" is niet die van de kopknop "${kopKnop?.getAttribute('href')}"`);
      const r = knop.getBoundingClientRect();
      if (r.height < (gsm ? 48 : 44) - 0.5) uit.push(`belknop is ${Math.round(r.height)} px hoog`);
      if (gsm && r.width < blok.getBoundingClientRect().width * 0.85) uit.push(`belknop op de gsm niet over de volle breedte (${Math.round(r.width)} px)`);
      if (getComputedStyle(knop).backgroundColor !== 'rgb(217, 140, 3)') uit.push(`belknop heeft achtergrond ${getComputedStyle(knop).backgroundColor} (verwacht de gouden knop rgb(217, 140, 3))`);
    }
    if (!link) uit.push('geen link naar de inspectiekaart');
    else {
      /* 22 okt 2026: "en die ding geen haast haal dat weg", "doe gewoon, of" */
      if (norm(link) !== 'Of vraag uw gratis dakinspectie aan') uit.push(`link "${norm(link)}" in plaats van "Of vraag uw gratis dakinspectie aan"`);
      if (link.getAttribute('href') !== '#rekenaar' || !document.querySelector('#rekenaar')) uit.push(`link wijst naar "${link.getAttribute('href')}", een element dat niet bestaat`);
      if (link.getBoundingClientRect().height < 44 - 0.5) uit.push(`link is ${Math.round(link.getBoundingClientRect().height)} px hoog`);
    }
    if (knop && link) {
      const a = knop.getBoundingClientRect(), b = link.getBoundingClientRect();
      /* 22 okt 2026: op elke breedte staat de link onder de belknop (Mohammed: "Nood? Bel ..... visueel en daaronder ook gratis dakinspectie") */
      if (b.top < a.bottom - 1) uit.push(`${gsm ? 'op de gsm' : 'op de computer'} staat de link niet onder de belknop`);
    }
    const hero = document.querySelector('.bf-lphero');
    if (hero.contains(blok)) uit.push('het blok staat in de hero');
    else if (!(hero.compareDocumentPosition(blok) & Node.DOCUMENT_POSITION_FOLLOWING)) uit.push('het blok staat niet na de hero');
    const top = blok.getBoundingClientRect().top + scrollY;
    if (gsm && top >= 1500) uit.push(`het blok begint op ${Math.round(top)} px (binnen de eerste 1500 px op de gsm)`);
    const tekst = blok.innerText;
    const v = tekst.match(/24\s*\/\s*7|meteen|binnen|\buur\b|werkdag|\d\s*min/i);
    if (v) uit.push(`verboden woord of belofte "${v[0]}" in het blok`);
    const cs = getComputedStyle(blok);
    if (cs.boxShadow !== 'none') uit.push(`schaduw op het blok (${cs.boxShadow})`);
    if (blok.querySelector('.kgj-reken')) uit.push('een tweede kaart in het blok');
    return uit;
  }, gsm);
  /* klik op de link en op de knop: hash, Clarity-events (de tel:-navigatie wordt tegengehouden) */
  const belblokGedrag = async (p) => {
    const uit = [];
    await p.evaluate(() => { document.querySelector('.bf-lpbelblok__knop')?.addEventListener('click', (e) => e.preventDefault(), true); });
    await p.evaluate(() => document.querySelector('.bf-lpbelblok__knop')?.click());
    await p.evaluate(() => document.querySelector('.bf-lpbelblok__link')?.click());
    await wacht(700);
    const r = await p.evaluate(() => ({ hash: location.hash, top: document.querySelector('#rekenaar')?.getBoundingClientRect().top ?? null, h: innerHeight,
      events: window.clarity?.q ? [...window.clarity.q].map((a) => Array.from(a).join(':')) : [] }));
    if (r.hash !== '#rekenaar') uit.push(`na een klik op de link is de hash "${r.hash}" in plaats van "#rekenaar"`);
    if (r.top === null || r.top < -2 || r.top > r.h * 0.6) uit.push(`na een klik op de link staat de kaart op ${r.top === null ? '?' : Math.round(r.top)} px (niet in beeld)`);
    for (const e of ['event:dak-bel-blok', 'event:dak-bel-blok-inspectie']) if (!r.events.includes(e)) uit.push(`Clarity-event "${e.slice(6)}" niet gemeld (gezien: ${r.events.join(', ') || 'niets'})`);
    return uit;
  };

  /* 12. vaste knop onderaan de gsm (.bf-lpsticky): een tik brengt de klikkaart onderaan in beeld. Tot 22 okt 2026 zocht de knop
     alleen het formulier van Inspectie; sinds de klikkaart onderaan deed hij niets. */
  const stickyFout = async (p) => {
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.45));
    await wacht(900);
    if (!(await p.evaluate(() => !!document.querySelector('.bf-lpsticky.bf-is-zichtbaar')))) return 'de vaste knop is halverwege de pagina niet zichtbaar';
    await p.evaluate(() => document.querySelector('.bf-lpsticky').click());
    await wacht(1600);
    const r = await p.evaluate(() => { const k = document.querySelector('#contact .kgj-reken--aanvraag'); if (!k) return null; const q = k.getBoundingClientRect(); return { top: q.top, bottom: q.bottom, h: innerHeight }; });
    if (!r) return 'geen klikkaart onderaan';
    if (r.top > r.h * 0.5 || r.bottom < 0) return `na een tik op de vaste knop staat de kaart onderaan op ${Math.round(r.top)} px (niet in beeld)`;
    return null;
  };

  /* 11. horizontale scroll */
  const scrollFout = (p) => p.evaluate(() => (document.documentElement.scrollWidth > innerWidth + 1 ? `horizontale scroll (${document.documentElement.scrollWidth} px breed op ${innerWidth})` : null));

  /* Eén kaart (hero of onder) van begin tot contactstap en validatie. */
  const kaartFlow = async (p, ctx, pg, root, naam, maat) => {
    const etiket = `${pg.pad} @${maat} ${naam}`;
    if (!(await p.$(root))) { fouten.push(`${etiket}: geen aanvraagkaart (${root})`); await ctx.close(); return; }
    metingen++;
    for (const f of await tikGedrag(p, pg, root)) fouten.push(`${etiket}: tik: ${f}`);
    /* 4. tot de contactstap (vraag 1 is al gekozen in tikGedrag; de rest van het pad) */
    for (const l of pg.pad1.slice(1)) if (!(await tik(p, l, root))) fouten.push(`${etiket}: keuze "${l}" niet gevonden`);
    const c = await p.evaluate((root) => {
      const k = document.querySelector(root);
      const f = k.querySelector('form.kgj-reken__form');
      return { tel: k.querySelector('.kgj-reken__tel')?.textContent.trim(), band: k.querySelector('.kgj-reken__band')?.textContent.trim().replace(/\s+/g, ' '),
        velden: f ? [...f.querySelectorAll('input:not([type=hidden]), input[type=hidden]')].map((i) => i.name || (i.closest('.kgj-pg') ? 'postcode-gemeente' : '')).filter(Boolean) : [],
        selects: f ? f.querySelectorAll('select').length : 0,
        knop: f?.querySelector('button[type=submit]')?.textContent.trim(), verplicht: f?.querySelector('[name=telefoon]')?.getAttribute('aria-required'),
        verplichtNaam: f?.querySelector('[name=naam]')?.getAttribute('aria-required'),
        labels: f ? [...f.querySelectorAll('label')].map((l) => [...l.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim()) : [],
        onder: k.querySelector('.kgj-reken__gerust')?.textContent.replace(/\s+/g, ' ').trim() };
    }, root);
    if (c.tel !== `Stap ${pg.stappen} van ${pg.stappen}`) fouten.push(`${etiket}: contactstap teller "${c.tel}"`);
    if (c.band !== pg.band) fouten.push(`${etiket}: band "${c.band}" in plaats van "${pg.band}"`);
    /* 22 okt 2026 (dak en renovatie): alleen Naam* en Telefoonnummer*, geen keuzelijst, en de disclaimer onder de band */
    if (c.velden.join('|') !== 'naam|telefoon') fouten.push(`${etiket}: de contactstap heeft de velden "${c.velden.join(', ')}" in plaats van precies "naam, telefoon" (geen e-mail, geen postcode/gemeente)`);
    if (c.selects) fouten.push(`${etiket}: de contactstap heeft ${c.selects} keuzelijst(en)`);
    for (const f of await disclaimerFouten(p, root, pg.disclaimer)) fouten.push(`${etiket}: ${f}`);
    if (c.knop !== pg.knop) fouten.push(`${etiket}: knop "${c.knop}" in plaats van "${pg.knop}"`);
    if (c.verplicht !== 'true') fouten.push(`${etiket}: telefoonveld niet als verplicht gemarkeerd`);
    if (c.verplichtNaam !== 'true') fouten.push(`${etiket}: naamveld niet als verplicht gemarkeerd`);
    /* 22 okt 2026, Mohammed: "en doe naam en telefoonnummer", "niet gsm" */
    if (c.labels.join('|') !== 'Naam *|Telefoonnummer *') fouten.push(`${etiket}: labels "${c.labels.join(' | ')}" in plaats van "Naam * | Telefoonnummer *"`);
    if (c.onder !== pg.onder) fouten.push(`${etiket}: regel onder de knop "${c.onder}" in plaats van "${pg.onder}"`);
    const voor = leads;
    const meldingNa = async () => { await p.evaluate((root) => document.querySelector(root + ' form button[type=submit]').click(), root); await wacht(500); return p.evaluate((root) => document.querySelector(root + ' .kgj-reken__fout')?.textContent.trim() || '', root); };
    /* leeg formulier: de naam staat vóór de gsm, dus eerst "Vul uw naam in." */
    const zonderNaam = await meldingNa();
    if (zonderNaam !== 'Vul uw naam in.') fouten.push(`${etiket}: lege naam gaf "${zonderNaam}" in plaats van "Vul uw naam in."`);
    /* een gsm zonder naam verstuurt ook niets: dat is precies de lead die "Dag ," zou geven */
    await p.type(`${root} form [name=telefoon]`, '0400 00 00 00');
    const zonderNaamMetGsm = await meldingNa();
    if (zonderNaamMetGsm !== 'Vul uw naam in.') fouten.push(`${etiket}: gsm zonder naam gaf "${zonderNaamMetGsm}" in plaats van "Vul uw naam in."`);
    /* Vertrok er wel een verzoek, dan is de naam niet verplicht en is het formulier weg: melden en door naar de volgende
       pagina (geen crash op een ontbrekend veld: dat zou een ongeldige meting lijken in plaats van een afwijking). */
    if (leads !== voor || !(await p.$(`${root} form [name=telefoon]`))) {
      fouten.push(`${etiket}: zonder naam vertrok er een verzoek (${leads - voor} GHL/Web3Forms)`);
      await ctx.close();
      return;
    }
    await p.evaluate((root) => { const i = document.querySelector(root + ' form [name=telefoon]'); i.focus(); i.select(); }, root);
    await p.keyboard.press('Backspace');
    /* naam ingevuld, gsm leeg: de bestaande gsm-melding */
    await p.type(`${root} form [name=naam]`, 'Test Kaart');
    const melding = await meldingNa();
    if (melding !== 'Vul uw telefoonnummer in. Wij bellen u om een moment af te spreken.') fouten.push(`${etiket}: lege gsm gaf "${melding}"`);
    if (leads !== voor) fouten.push(`${etiket}: met een lege gsm vertrok er een verzoek`);
    await ctx.close();
  };

  try {
    /* ---------- positieve controles ---------- */
    {
      const { p, ctx } = await open('/lp/richtprijs-berekenen');
      const pc1 = await rekenaarSporen(p);
      const pc6 = await belblokFouten(p, true);
      const pc7 = await ondenFouten(p);
      await ctx.close();
      if (pc1.length < 2) { console.log(`ONGELDIGE METING: de rekenaarpagina /lp/richtprijs-berekenen gaf ${pc1.length} rekenaarsporen (${pc1.join('; ')})`); process.exit(2); }
      console.log(`positieve controle 1: /lp/richtprijs-berekenen heeft ${pc1.length} rekenaarsporen (${pc1.slice(0, 2).join('; ')})`);
      if (!pc6.length) { console.log('ONGELDIGE METING: een pagina zonder belblok (/lp/richtprijs-berekenen) werd door de belblok-toets goedgekeurd'); process.exit(2); }
      console.log(`positieve controle 6: /lp/richtprijs-berekenen heeft geen belblok (${pc6[0]})`);
      if (!pc7.length) { console.log('ONGELDIGE METING: de rekenaarpagina met keuzelijsten onderaan werd door de onderaan-toets goedgekeurd'); process.exit(2); }
      console.log(`positieve controle 7: /lp/richtprijs-berekenen houdt het formulier met keuzelijsten onderaan (${pc7[0]})`);
    }
    {
      const { p, ctx } = await open('/lp/dakwerken', { css: '.kgj-reken--aanvraag{margin-top:900px!important}' });
      const pc2 = await eersteScherm(p, DAK);
      await ctx.close();
      if (!pc2.length) { console.log('ONGELDIGE METING: een kaart 900 px lager werd in het eerste scherm gezien'); process.exit(2); }
      console.log(`positieve controle 2: kaart 900 px lager gezien (${pc2[0]})`);
    }
    {
      const { p, ctx } = await open('/lp/dakwerken', { css: '.kgj-reken__keuze{pointer-events:none!important}' });
      const pc3 = await tikGedrag(p, DAK);
      await ctx.close();
      if (!pc3.length) { console.log('ONGELDIGE METING: een tik die niets doet werd niet gezien'); process.exit(2); }
      console.log(`positieve controle 3: tik zonder gevolg gezien (${pc3[0]})`);
    }
    {
      const pc4 = kopFouten('Laat uw dak gratis inspecteren', 'Laat uw dak gratis inspecteren');
      const pc5 = kopFouten('Plan een gratis plaatsbezoek voor uw renovatie', 'Plan een gratis plaatsbezoek voor uw renovatie');
      if (!pc4.length || !pc5.length) { console.log('ONGELDIGE METING: de afgekeurde koppen van 19 okt werden niet als werkwijze-kop gezien'); process.exit(2); }
      if (kopFouten(DAK.kop, DAK.kop).length || kopFouten(RENO('').kop, RENO('').kop).length) { console.log('ONGELDIGE METING: de afgesproken koppen vallen zelf onder de werkwijze-regel'); process.exit(2); }
      console.log(`positieve controle 4: de koppen van 19 okt geweigerd (${pc4[0]})`);
    }
    {
      /* disclaimertoets (sinds 22 okt heeft elke kaart er een): een weggehaalde disclaimer, een geplante kop "Wat u krijgt:"
         en een badge met het gewone vinkje moeten elk gezien worden */
      const { p, ctx } = await open('/lp/dakwerken');
      for (const l of DAK.pad1) await tik(p, l, HERO);
      const goed = await disclaimerFouten(p, HERO, DAK.disclaimer);
      if (goed.length) { console.log(`ONGELDIGE METING: de disclaimertoets faalt al op de echte kaart (${goed[0]}); de positieve controle zegt dan niets`); process.exit(2); }
      await p.evaluate((root) => { const s = document.querySelector(root + ' .kgj-reken__disclaimer span'); const b = document.createElement('b'); b.textContent = 'Wat u krijgt:'; s?.prepend(b, ' '); }, HERO);
      const pc8b = await disclaimerFouten(p, HERO, DAK.disclaimer);
      await p.evaluate((root) => document.querySelector(root + ' .kgj-reken__disclaimer')?.remove(), HERO);
      const pc8 = await disclaimerFouten(p, HERO, DAK.disclaimer);
      await p.evaluate((root) => { const s = document.querySelector(root + ' .kgj-reken__vertrouwen li svg'); s?.classList.replace([...s.classList].find((c) => /^lucide-(?!icon$)/.test(c)), 'lucide-check'); }, HERO);
      const pc10 = await badgesFouten(p, DAK);
      await ctx.close();
      if (!pc8.length || !pc8b.length) { console.log(`ONGELDIGE METING: een contactstap zonder disclaimer (${pc8.length}) of met de kop "Wat u krijgt:" (${pc8b.length}) werd door de disclaimertoets goedgekeurd`); process.exit(2); }
      console.log(`positieve controle 8: een kaart zonder disclaimer gezien (${pc8[0]}); met geplante kop (${pc8b[0]})`);
      if (!pc10.length) { console.log('ONGELDIGE METING: een gewoon vinkje bij de badges werd door de badgetoets goedgekeurd'); process.exit(2); }
      console.log(`positieve controle 10: gewoon vinkje bij de badges gezien (${pc10[0]})`);
    }
    {
      /* 8. een geplante "Eerstvolgend"-regel en een geplante free-slots-aanvraag moeten gevonden worden */
      const { p, ctx, slots } = await open('/lp/totaalrenovatie');
      await p.evaluate(() => {
        const e = document.createElement('p'); e.textContent = 'Eerstvolgend vrij plaatsbezoek: morgen'; document.body.append(e);
        fetch('https://backend.leadconnectorhq.com/calendars/PLANT/free-slots?startDate=1&endDate=2').catch(() => {});
      });
      await wacht(600);
      const pc9 = await vrijFouten(p, slots);
      await ctx.close();
      if (pc9.length < 2) { console.log(`ONGELDIGE METING: een geplante "Eerstvolgend"-regel en free-slots-aanvraag werden niet allebei gevonden (${pc9.join(' | ') || 'niets'})`); process.exit(2); }
      console.log(`positieve controle 9: geplante vrij-moment-regel en agenda-aanvraag gevonden (${pc9.join('; ')})`);
    }
    {
      /* 12. vaste knop: zonder herkenbare kaart onderaan (klasse kgj-reken--onder weggehaald, zoals de oude selector die alleen
         Inspectie zocht) moet de toets falen; met de echte pagina moet hij slagen */
      const { p, ctx } = await open('/lp/totaalrenovatie');
      const goed = await stickyFout(p);
      await ctx.close();
      if (goed) { console.log(`ONGELDIGE METING: de vaste-knoptoets faalt al op de echte pagina (${goed})`); process.exit(2); }
      const { p: q, ctx: ctx2 } = await open('/lp/totaalrenovatie');
      await q.evaluate(() => document.querySelector('#contact .kgj-reken--onder')?.classList.remove('kgj-reken--onder'));
      const pc12 = await stickyFout(q);
      await ctx2.close();
      if (!pc12) { console.log('ONGELDIGE METING: een vaste knop die nergens heen gaat werd door de vaste-knoptoets goedgekeurd'); process.exit(2); }
      console.log(`positieve controle 12: vaste knop zonder doel gezien (${pc12})`);
    }
    const leadsNaControles = leads;

    /* ---------- de drie pagina's ---------- */
    for (const pg of PAGINAS) {
      for (const gsm of [true, false]) {
        const maat = gsm ? '390x844' : '1265x800';
        /* kaart bovenaan */
        {
          const { p, ctx, slots } = await open(pg.pad, { gsm });
          if (!(await p.$(HERO))) { fouten.push(`${pg.pad} @${maat}: geen aanvraagkaart (${HERO})`); await ctx.close(); continue; }
          for (const f of await rekenaarSporen(p)) fouten.push(`${pg.pad} @${maat}: rekenaar-ingang: ${f}`);
          const h1 = await p.evaluate(() => document.querySelector('h1')?.textContent.trim().replace(/\s+/g, ' '));
          for (const f of kopFouten(h1, pg.kop)) fouten.push(`${pg.pad} @${maat}: ${f}`);
          if (gsm) for (const f of await eersteScherm(p, pg)) fouten.push(`${pg.pad} @${maat}: eerste scherm: ${f}`);
          for (const f of await ondenFouten(p)) fouten.push(`${pg.pad} @${maat}: onderaan: ${f}`);
          for (const f of await badgesFouten(p, pg)) fouten.push(`${pg.pad} @${maat}: badges: ${f}`);
          const sf = await scrollFout(p); if (sf) fouten.push(`${pg.pad} @${maat}: ${sf}`);
          if (pg.soort === 'dak') {
            for (const f of await belblokFouten(p, gsm)) fouten.push(`${pg.pad} @${maat}: belblok: ${f}`);
          } else if (await p.$('.bf-lpbelblok')) fouten.push(`${pg.pad} @${maat}: belblok staat op een renovatiepagina (alleen /lp/dakwerken)`);
          /* het belblok-gedrag (hash, Clarity) loopt als laatste in een eigen pagina, zodat de kaartflow niet verstoord wordt */
          await kaartFlow(p, ctx, pg, HERO, 'bovenaan', maat);
          /* na alle stappen (meer dan 2,5 s na het laden): nog steeds geen free-slots-verzoek en geen "Eerstvolgend"-tekst */
          const vf = slots.length;
          if (vf) fouten.push(`${pg.pad} @${maat}: ${vf} free-slots-verzoek(en) naar de GHL-agenda`);
        }
        {
          const { p, ctx, slots } = await open(pg.pad, { gsm });
          await wacht(2500);
          for (const f of await vrijFouten(p, slots)) fouten.push(`${pg.pad} @${maat}: vrij moment: ${f}`);
          if (pg.soort === 'dak') for (const f of await belblokGedrag(p)) fouten.push(`${pg.pad} @${maat}: belblok: ${f}`);
          await ctx.close();
        }
        if (gsm) {
          const { p, ctx } = await open(pg.pad, { gsm });
          const sf = await stickyFout(p);
          if (sf) fouten.push(`${pg.pad} @${maat}: vaste knop: ${sf}`);
          await ctx.close();
        }
        /* kaart onderaan (dak en renovatie, 22 okt 2026) */
        {
          const { p, ctx } = await open(pg.pad, { gsm });
          await kaartFlow(p, ctx, pg, ONDER, 'onderaan', maat);
        }
      }
    }
    /* de richtprijspagina blijft zoals hij was: geen belblok, geen klikkaart onderaan */
    {
      const { p, ctx } = await open('/lp/richtprijs-berekenen');
      if (await p.$('.bf-lpbelblok')) fouten.push('/lp/richtprijs-berekenen: belblok (hoort alleen op /lp/dakwerken)');
      if (await p.$(ONDER)) fouten.push('/lp/richtprijs-berekenen: klikkaart onderaan (hoort alleen op de dak- en renovatiepagina\'s)');
      await ctx.close();
    }
    /* 5. message match (dak) */
    {
      const { p, ctx } = await open('/lp/dakwerken?utm_term=plat%20dak%20renoveren');
      const m = await p.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim().replace(/\s+/g, ' ') }));
      const s = await stand(p);
      for (const f of kopFouten(m.h1, 'Dé specialist voor uw platte dak')) fouten.push(`message match: ${f}`);
      if (s.vraag !== DAK.vraag2 || s.tel !== `Stap 2 van ${DAK.stappen}` || !s.terug) fouten.push(`message match: kaart ${JSON.stringify(s)} (verwacht vraag 2, Stap 2 van ${DAK.stappen}, Terug)`);
      await p.evaluate(() => document.querySelector('.kgj-reken--aanvraag .kgj-reken__terug')?.click());
      await wacht(450);
      const s2 = await stand(p);
      if (s2.vraag !== DAK.vraag1) fouten.push(`message match: Terug gaf "${s2.vraag}"`);
      const isAan = await p.evaluate(() => document.querySelector('.kgj-reken--aanvraag .kgj-reken__keuze.is-aan')?.textContent.trim());
      if (isAan !== 'Plat dak') fouten.push(`message match: na Terug staat "${isAan}" aangeduid in plaats van Plat dak`);
      await ctx.close();
      const { p: q, ctx: ctx2 } = await open('/lp/dakwerken');
      const z = await stand(q);
      if (z.vraag !== DAK.vraag1) fouten.push(`zonder message match begint de kaart bij "${z.vraag}"`);
      await ctx2.close();
      metingen++;
    }
    if (leads !== leadsNaControles) fouten.push(`er vertrokken ${leads - leadsNaControles} leadverzoeken tijdens de toets (verwacht 0)`);
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  /* 3 paginas x 2 maten x 2 kaarten (bovenaan en onderaan, sinds 22 okt ook op dak); plus message match */
  const verwacht = 3 * 2 * 2 + 1;
  if (metingen < verwacht) { console.log(`ONGELDIGE METING: ${metingen} metingen (verwacht ${verwacht})`); process.exit(2); }
  console.log(`check-lp-aanvraag: dak en 2 renovatiepagina's (kaart bovenaan en onderaan) x 2 maten + message match (${basis}), ${leads} leadverzoeken`);
  if (fouten.length) { fouten.forEach((f) => console.log('  FOUT: ' + f)); process.exit(1); }
  console.log('  kop zoals afgesproken, geen rekenaar-ingang, kaart in het eerste gsm-scherm, één tik = volgende vraag (bovenaan en onderaan), contactstap alleen naam en telefoonnummer + disclaimer zonder kop, naam verplicht, lege gsm, badges met eigen iconen, geen vrij moment en geen agenda-verzoek, belblok op dak, geen horizontale scroll');
  process.exit(0);
})().catch((e) => { console.log('ONGELDIGE METING: ' + e.message); process.exit(2); });
