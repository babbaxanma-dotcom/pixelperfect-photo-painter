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
 *   4. het contactblok (18 nov 2026, formulier v2, Mohammed: het einde van het formulier "gewoon zo" zoals zijn referentie): kop
 *      "Contact", EXACT drie velden naam, telefoon, e-mail (alle drie verplicht), de tekst "Uw naam" / "Telefoonnummer" /
 *      "E-mailadres" in het veld met een lijnicoon links, geen label erboven, tekst >= 16 px, het juiste toetsenbord (tel, email) en
 *      automatische invulling (name, tel, email); de knop = de knop van het formulier onderaan; niets anders in of rond het blok (geen
 *      band, overzicht, hulpregels, "Na uw aanvraag", regel boven de knop, cijferrij, vinkjes); geen melding vóór een poging; versturen
 *      zonder naam geeft "Vul uw naam in." onder het naamveld (20 okt 2026: de sms begint met "Dag {{voornaam}},"), daarna de gsm- en de
 *      e-mailmelding onder hun veld; niets wordt verzonden;
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
 *      vinkjes letterlijk; "5,0 op Google" in de hero. Sinds 2 nov 2026 (Mohammed: "door al die tekst en iconen eronder weet je
 *      niet goed dat je moet klikken", "deel aub op zoals bf") de indeling van bfbouw.be: elk vinkje hetzelfde kleine vinkje
 *      (lucide-check, max 22 px), de cijfers zonder kader of vlak; alleen de keuzes zien eruit als een knop;
 *  10. belblok: WEG sinds 19 nov 2026 (Mohammed: "oke doe maar eruit"); op geen enkele pagina een .bf-lpbelblok (positieve controle 6: een
 *      geplant blok op /lp/dakwerken moet falen). Tot 19 nov (22 okt 2026, alleen /lp/dakwerken): kop "In nood?" (eerst "Lekt uw dak?"), knop "Bel direct <nummer>" met dezelfde tel:-href als
 *      de belknop in de kop, link "Of vraag uw gratis dakinspectie aan" naar #rekenaar; staat buiten de hero, na de
 *      hero, binnen de eerste 1500 px op de gsm, zonder schaduw en kaart; geen "24/7", "meteen", "binnen", tijden ("nood" mag sinds 22 okt: zijn kop);
 *      op de gsm gestapeld met een knop van minstens 48 px en volle breedte; Clarity-events dak-bel-blok en
 *      dak-bel-blok-inspectie bij een klik; NIET op de renovatiepagina's en NIET op /lp/richtprijs-berekenen;
 *  11. geen horizontale scroll;
 *  12. geen vaste offerteknop onderaan de gsm (8 nov 2026, Mohammed: "bij ab die statische offerte aanvragen onderaan ook weg
 *      aub"): bovenaan, halverwege en onderaan geen vast element met tekst naar het formulier in de onderste helft van het scherm;
 *      de ronde belknop zonder tekst mag blijven.
 *  13. één stand voor de twee kaarten (23 okt 2026, Clarity /lp/totaalrenovatie 01:52: bovenaan "Rijwoning", dan "Plan uw gratis
 *      plaatsbezoek", en de kaart onderaan stond weer op vraag 1; de bezoeker vertrok). Gsm 390x637 (iPhone in Safari, gemeten in
 *      Clarity 23 okt): vraag 1 bovenaan, dan een tik op een link naar #contact: de kaart onderaan staat op vraag 2, "Stap x van y"
 *      direct onder de vaste balk en alle keuzes in beeld; een antwoord onderaan zet ook de kaart bovenaan een stap verder.
 *  14. contactblok in beeld zonder pop-up (18 nov 2026, Mohammed: "die popup kan je weghalen"): op 390x637 staat de kaart nooit vast
 *      over het scherm (geen is-formvol, geen dialoog, geen sluitknop, geen achtergrond) en staan de kop "Contact" (onder de vaste
 *      kopbalk), naam, telefoon, e-mail en de verzendknop in beeld, voor de kaart bovenaan en onderaan. (23 okt-17 nov: het volle scherm.)
 *  15. (vaste knop met de stap) weg sinds 8 nov 2026: er is geen vaste knop meer (punt 12).
 *  16. elke stap volledig in beeld op 390x637, kaart bovenaan en onderaan: na elk antwoord de vraag onder de vaste balk en alle
 *      keuzes, Volgende of de verzendknop binnen het scherm.
 *  17. geen sprong onderaan (review 23 okt): zonder scroll anchoring (Safari) zakt de bovenrand van de kaart onderaan na een antwoord
 *      onderaan hoogstens 40 px voorbij het hoogste van haar startpositie en het vaste punt 8 px onder de kopbalk (18 nov 2026: daar
 *      schuift de kaart met haar titel bewust naartoe); de kaart bovenaan is dan bevroren zolang ze buiten beeld is.
 *  18. één belofte (23 okt 2026, Mohammed: "optimalisatie van de knoppen, wat de knoppen zeggen ... ga na WAT DE BESTE is"):
 *      de verzendknop is "Gratis dakinspectie aanvragen" / "Gratis plaatsbezoek aanvragen" (punt 4) en elke zichtbare knop naar het
 *      formulier draagt dezelfde tekst.
 * Wat er bij een volledige aanvraag naar GHL en Web3Forms gaat (bron_lead, aanvullende_info, Toestemming, /bedankt),
 * toetst check-lp-payload veld voor veld.
 *
 * 23 nov 2026: /lp/dakwerken staat in de opbouw van bfbouw.be (LpBfC.tsx, herkend aan .abc; Mohammed: "in dezelfde stijl zoals bf"): hero zonder
 * formulier met twee knoppen ("Offerte aanvragen" naar #contact, "Bekijk recente daken"), de enige aanvraagkaart onderaan (#contact > #rekenaar, plek
 * onder). HERO en ONDER wijzen daar naar dezelfde kaart. Voor die vorm:
 *   2. eerste gsm-scherm: de knop "Offerte aanvragen" in de hero staat volledig in het eerste scherm (goedgekeurd op bfbouw.be); na één echte tik erop
 *      staan vraag 1 en al haar keuzes van de kaart volledig in beeld, onder de vaste kopbalk;
 *   6. de kop is "Dakwerker nodig? Kies voor vakmanschap." (LpBfC BFC.kop + kop2, zoals bfbouw.be 22 nov), gelezen zoals hij er staat (twee regels);
 *   9. badges: de vertrouwensrij en de vinkjes in de kaart onderaan (geen .bf-lp--badges op de pagina: die klasse hoort bij de kaart in de hero);
 *      geen Google-badge in de hero;
 *  13. één stand wordt: na een antwoord, naar boven scrollen en een tik op een link naar #contact staat de kaart op dezelfde stap met "Stap x van y"
 *      direct onder de vaste balk en alle keuzes in beeld; een antwoord daar zet de volgende stap (zelfde regel als 23 okt, nu voor de enige kaart);
 *  14, 16. alleen de kaart onderaan (een kaart bovenaan bestaat niet);
 *  18. de klikbare zin in een antwoord van de vragen (.abc-faq details a) telt niet als knop, zoals bf-vraag__link.
 * De kaartflow (punt 3, 4, 7, 9, 11) loopt één keer per maat, op de kaart onderaan. Positieve controles voor die vorm: de heroknop 900 px lager
 * (punt 2), keuzes 500 px lager na de tik (punt 2), een Google-badge in de hero (punt 9), de link naar #contact met de gewone sprong in plaats van
 * naar de kaart (punt 13) en keuzes onderaan 500 px lager (punt 13). /lp/totaalrenovatie en /lp/aannemer-renovatiewerken ongewijzigd.
 *
 * Positieve controles (zonder: exit 2): /lp/richtprijs-berekenen (de rekenaarpagina) moet op punt 1 falen en op punt 7 en 10;
 * een kaart die 900 px lager staat (geplante CSS) moet op punt 2 falen; een tik die niets doet (geplante pointer-events: none
 * op de keuzes) moet op punt 3 falen; een weggehaalde disclaimer en een disclaimer zonder vet deel moeten de disclaimertoets
 * laten falen, een gewoon vinkje bij de badges de badgetoets; een geplante
 * tekst "Eerstvolgend ..." plus een geplande free-slots-aanvraag moeten punt 8 laten falen. Punt 13-17: elke bewering op een
 * eigen geplante fout (tik onderaan zonder gevolg, link vóór de tik bovenaan, keuzes onderaan 500 px lager, disclaimer met 420 px
 * marge, keuzes 500 px lager, geen bevroren kaart). Punt 12: een geplante vaste knop "Gratis dakinspectie aanvragen" onderaan.
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
  /* 2 nov 2026 (omvormen zoals bfbouw.be 31 okt): kop "Uw dak laten vernieuwen, renoveren of isoleren?", aanbod "gratis offerte";
     zes vragen (oppervlakte en start zoals bfbouw.be) + contactstap = 7 stappen */
  /* 5 nov 2026, zoals bfbouw.be 4 nov: vraag 1 "Om welk soort dak gaat het?", Dakrenovatie en Nieuw dak apart */
  /* 7 nov 2026, zoals bfbouw.be 7 nov ("en doe al deze changes ook bij ab pagina"): vraag 1 "Ik ben op zoek naar:" met Gratis dakinspectie, vraag 2 het soort dak */
  pad: '/lp/dakwerken', soort: 'dak', kop: 'Uw dak laten vernieuwen, renoveren of isoleren?', woord: 'gratis offerte', vraag1: 'Ik ben op zoek naar:', keuzes1: ['Dakrenovatie', 'Nieuw dak', 'Herstelling', 'Isolatie', 'Gratis dakinspectie'],
  /* 23 nov 2026: de kop in de opbouw van bfbouw.be (LpBfC.tsx BFC.kop + BFC.kop2, zoals bfbouw.be sinds 22 nov: "Dakwerker nodig? Kies voor
     vakmanschap."; de AB-advertentiegroep "Dakwerken in de buurt" landt op deze pagina) */
  kopAbc: 'Dakwerker nodig? Kies voor vakmanschap.',
  /* 18 nov 2026 (formulier v2, Mohammed: "die vraag van oppervlakte en asbest eruit"; de staal-vraag "bereikbaar" weg): werk, dak, isoleren,
     start + het contactblok = 5 stappen (was 8 op het staal) */
  pad1: ['Dakrenovatie', 'Hellend dak', 'Nee'], vraag2: 'Om welk soort dak gaat het?', // 18 nov 2026: "wanneer wilt u starten eruit"
  /* knop: dictaat Mohammed 31 okt voor bfbouw.be ("Gratis en vrijblijvende offerte aanvragen"; infinitief "aanvragen", onderzoek 23 okt).
     5 nov 2026, zoals bfbouw.be 91ab7ba: verzendknop "Gratis offerte aanvragen", de andere knoppen "Offerte aanvragen" (naarKnop);
     contactkop zonder "gratis". */
  /* 18 nov 2026 (v2, Mohammed: het einde van het formulier "gewoon zo"): het contactblok heeft de kop "Contact" (geen band "Bijna klaar!") */
  ckop: 'Contact', knop: 'Gratis offerte aanvragen', naarKnop: 'Offerte aanvragen', stappen: 4, // 18 nov 2026: werk, dak, isoleren + contact
  /* 18 nov 2026, dictaat Mohammed (woordelijk): de korte regels direct onder de verzendknop op de dakpagina's */
  nakort: ['We nemen binnen 24 uur contact op', 'Gratis plaatsbezoek met onze dakexpert', 'Je ontvangt je offerte in je mailbox'], // 19 nov 2026: drie stappen (Mohammed: "3 stappen"; was vijf, Kijzer 18 nov)
  /* 18 nov 2026, dictaat ("doe dat zoals kijzer, zo hoe dat wordt uitgelegd"): één uitlegzin per stap */
  uitleg: ['We overlopen je aanvraag en spreken een plaatsbezoek af op een moment dat jou past.', 'Onze dakexpert bekijkt je dak ter plaatse en bespreekt met jou de mogelijkheden.', 'Vrijblijvend: je beslist zelf, zonder enige verplichting.'], // 19 nov 2026: drie stappen (stap 4 en 5 weg)
  tegels: ['5,0', '10 jaar garantie', '15 jaar ervaring'],
  /* 5 nov 2026, bfbouw.be: "Na uw aanvraag" (twee stappen) vervangt de regel onder de knop */
  /* 7 nov 2026 (bfbouw.be "oke doe maar die 3 stappen"): contact binnen 24 uur, gratis plaatsbezoek, offerte */
  volgt: ['Wij nemen binnen 24 uur contact op', 'Gratis plaatsbezoek', 'Uw offerte'],
  /* 3 nov 2026, Mohammed: "dat puntje 6btw bij woningen ouder dan 10j in de hero weg". 5 nov: "Vrijblijvende offerte" (bfbouw.be) */
  vinkjes: ['Vrijblijvende offerte', 'Vakmanschap tot in de details'],
};
const RENO = (pad) => ({
  pad, soort: 'reno', kop: 'Jouw complete renovatie, perfect geregeld van A tot Z.', woord: 'gratis offerte',
  /* 22 okt 2026, Mohammed: "2 meer vragen, bij stap 1 graag wat voor woning", "en dan die vraag van dat ze mooi kunnen aanklikken wat
     er allemaal nodig is": woning, omvang, afvinkvraag (een lijst in pad1 = die vinkjes en dan Volgende), start, budget */
  vraag1: 'Wat voor woning wilt u renoveren?', keuzes1: ['Appartement', 'Rijwoning', 'Halfopen bebouwing', 'Open bebouwing'],
  pad1: ['Rijwoning', 'Gedeeltelijke renovatie', ['Keuken', 'Badkamer'], '€ 25.000 tot € 75.000'], vraag2: 'Wat wilt u renoveren?', // 18 nov 2026: geen startvraag; // 18 nov 2026 (v2): de staal-vraag "bereikbaar" weg, 6 stappen
  ckop: 'Contact', knop: 'Gratis offerte aanvragen', naarKnop: 'Offerte aanvragen', stappen: 5, // 18 nov 2026: woning, omvang, onderdelen, budget + contact
  nakort: ['We nemen binnen 24 uur contact op', 'Gratis plaatsbezoek met onze expert', 'Je ontvangt je offerte in je mailbox'], // 19 nov 2026: drie stappen (was vijf, Kijzer 18 nov)
  uitleg: ['We overlopen je aanvraag en spreken een plaatsbezoek af op een moment dat jou past.', 'Onze expert bekijkt je woning ter plaatse en bespreekt met jou de mogelijkheden.', 'Vrijblijvend: je beslist zelf, zonder enige verplichting.'], // 19 nov 2026: drie stappen (stap 4 en 5 weg)
  /* 22 okt 2026: "6 vakdisciplines ... weg, bij die form", "dat is een rare trust badge" */
  tegels: ['5,0', '16 jaar ervaring'],
  volgt: ['Wij nemen binnen 24 uur contact op', 'Gratis plaatsbezoek', 'Uw offerte'], // 7 nov 2026 (bfbouw.be)
  vinkjes: ['Vrijblijvende offerte', 'Vaste prijs vooraf', 'Eén vast aanspreekpunt', 'Vakmanschap tot in de details'], // 22 okt 2026: geen budgetgarantie meer; 2 nov: offerte; 5 nov: zonder "gratis"
});
const PAGINAS = [DAK, RENO('/lp/totaalrenovatie'), RENO('/lp/aannemer-renovatiewerken')];
/* 23 nov 2026: de vorm per pad (true = opbouw van bfbouw.be, LpBfC.tsx, .abc: alleen de kaart onderaan); bepaald bij de start */
const ABC = {};
const kaarten = (pg) => (ABC[pg.pad] ? [[ONDER, 'onderaan']] : [[HERO, 'bovenaan'], [ONDER, 'onderaan']]);
const kopVan = (pg) => (ABC[pg.pad] ? pg.kopAbc : pg.kop);

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

  const open = async (url, { gsm = true, css = null, hoogte = 844, voorLaden = null, beweging = false } = {}) => {
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
    /* beweging = zoals de meeste bezoekers (zachte scroll); toets 17 meet daarmee de sprong die een bezoeker ziet */
    if (!beweging) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    if (gsm) await p.setViewport({ width: 390, height: hoogte, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    else await p.setViewport({ width: 1265, height: 800 });
    await p.evaluateOnNewDocument(() => { try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false, ts: Date.now() })); } catch { /* */ } });
    /* 5 nov 2026: de laadstap (1,2 s) en het volle scherm / venster na de laatste vraag (Aanvraag.tsx) meet check-lp-contact.cjs.
       Hier staat de laadstap op 0 ms en blijft de kaart in de pagina, zodat de toetsen hieronder de pagina meten zoals voorheen
       (één stand voor twee kaarten, vaste knop, sprong). Punt 14 zet het volle scherm weer aan (voorLaden). */
    await p.evaluateOnNewDocument(() => { window.__abLaadMs = 0; window.__abVolUit = true; });
    if (voorLaden) await p.evaluateOnNewDocument(voorLaden);
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

  /* 2 voor de vorm .abc (23 nov 2026): de knop "Offerte aanvragen" in de hero volledig in het eerste scherm, dan één echte tik erop: vraag 1 en al haar
     keuzes van de kaart onderaan volledig in beeld, onder de vaste kopbalk. */
  const eersteSchermAbc = async (p, pg) => {
    const uit = [];
    const knop = await p.evaluate((naarKnop) => {
      const H = innerHeight;
      const kop = document.querySelector('.kgj-kop'), kb = kop ? kop.getBoundingClientRect().bottom : 0;
      const a = [...document.querySelectorAll('.abc-hero a[href="#contact"]')].find((x) => x.getClientRects().length);
      if (!a) return null;
      const r = a.getBoundingClientRect(), cs = getComputedStyle(a);
      return { tekst: a.textContent.replace(/\s+/g, ' ').trim(), top: Math.round(r.top), bottom: Math.round(r.bottom), H, kb: Math.round(kb), x: r.left + r.width / 2, y: r.top + r.height / 2,
        zicht: cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.5, naarKnop };
    }, pg.naarKnop);
    if (!knop) return ['geen knop naar #contact in de hero'];
    if (knop.tekst !== pg.naarKnop) uit.push(`de heroknop zegt "${knop.tekst}" in plaats van "${pg.naarKnop}"`);
    if (!knop.zicht || knop.top < knop.kb || knop.bottom > knop.H) { uit.push(`de knop "${knop.tekst}" staat niet volledig in het eerste scherm (${knop.top}-${knop.bottom} px, kopbalk tot ${knop.kb}, scherm ${knop.H})`); return uit; }
    await p.touchscreen.tap(knop.x, knop.y);
    let vorige = -1;
    for (let i = 0; i < 30; i++) { const y = await p.evaluate(() => Math.round(scrollY)); if (y === vorige) break; vorige = y; await wacht(150); }
    await wacht(300);
    const k = await p.evaluate((ONDER) => {
      const kaart = document.querySelector(ONDER); if (!kaart) return null;
      const kb = document.querySelector('.kgj-kop').getBoundingClientRect().bottom, H = innerHeight;
      const vraag = kaart.querySelector('.kgj-reken__stap .kgj-reken__vraag'), vr = vraag?.getBoundingClientRect();
      const keuzes = [...kaart.querySelectorAll('.kgj-reken__stap .kgj-reken__keuze')].map((x) => ({ label: x.querySelector('strong')?.textContent.trim(), top: x.getBoundingClientRect().top, bottom: x.getBoundingClientRect().bottom }));
      return { kb: Math.round(kb), H, vraag: vraag?.textContent.trim(), vtop: Math.round(vr?.top ?? -1), vbottom: Math.round(vr?.bottom ?? 9999), keuzes };
    }, ONDER);
    if (!k) return [...uit, `na de tik op "${knop.tekst}": geen aanvraagkaart onderaan`];
    if (k.vraag !== pg.vraag1) uit.push(`na de tik op "${knop.tekst}": eerste vraag "${k.vraag}" in plaats van "${pg.vraag1}"`);
    else if (k.vtop < k.kb - 1 || k.vbottom > k.H) uit.push(`na de tik op "${knop.tekst}": eerste vraag buiten beeld (${k.vtop}-${k.vbottom} px, kopbalk tot ${k.kb}, scherm ${k.H})`);
    if (k.keuzes.map((x) => x.label).join('|') !== pg.keuzes1.join('|')) uit.push(`na de tik: keuzes ${k.keuzes.map((x) => x.label).join(' / ')} in plaats van ${pg.keuzes1.join(' / ')}`);
    const buiten = k.keuzes.filter((x) => x.top < k.kb - 1 || x.bottom > k.H);
    if (buiten.length) uit.push(`na de tik op "${knop.tekst}": ${buiten.length} keuze(s) buiten beeld (laatste onderkant ${Math.round(Math.max(...k.keuzes.map((x) => x.bottom)))} van ${k.H})`);
    return uit;
  };
  /* 6: de kop zoals hij er staat. Vorm .abc: twee regels (twee blokken in de h1), gelezen met een spatie ertussen. */
  const leesKop = (p) => p.evaluate(() => { const h = document.querySelector('h1'); if (!h) return undefined; return (document.querySelector('.abc') ? h.innerText : h.textContent).trim().replace(/\s+/g, ' '); });

  const stand = (p, root = HERO) => p.evaluate((root) => {
    const k = document.querySelector(root);
    return { tel: (k.querySelector('.kgj-reken__tel')?.dataset.intern ?? k.querySelector('.kgj-reken__tel')?.textContent.trim()), vraag: k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.textContent.trim().replace(/\s+/g, ' '),
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
    if (s0.tel !== 'Stap 1' || s0.vraag !== pg.vraag1 || s0.terug) uit.push(`begin: ${JSON.stringify(s0)}`);
    if (!(await tik(p, pg.pad1[0], root))) return [...uit, `keuze "${pg.pad1[0]}" niet gevonden`];
    const s1 = await stand(p, root);
    if (s1.tel !== 'Stap 2' || s1.vraag !== pg.vraag2 || !s1.terug) uit.push(`na één tik: ${JSON.stringify(s1)} (verwacht Stap 2, "${pg.vraag2}", Terug)`);
    await p.evaluate((root) => document.querySelector(root + ' .kgj-reken__terug')?.click(), root);
    await wacht(450);
    const s2 = await stand(p, root);
    if (s2.tel !== 'Stap 1' || s2.vraag !== pg.vraag1) uit.push(`na Terug: ${JSON.stringify(s2)}`);
    /* dubbele tik: twee klikken binnen 50 ms = één stap */
    await p.evaluate((l, root) => { const b = [...document.querySelectorAll(root + ' .kgj-reken__keuze')].find((x) => x.textContent.trim().startsWith(l)); b.click(); setTimeout(() => { const c = [...document.querySelectorAll(root + ' .kgj-reken__keuze')][0]; c?.click(); }, 40); }, pg.pad1[0], root);
    await wacht(500);
    const s3 = await stand(p, root);
    if (s3.tel !== 'Stap 2') uit.push(`dubbele tik: ${s3.tel} (verwacht Stap 2: een tweede tik binnen 200 ms telt niet)`);
    return uit;
  };

  /* 4. Offerte (2 nov 2026, omvormen zoals bfbouw.be 31 okt): de kaart is een gewone offerteaanvraag. Op de contactstap geen
     disclaimer-vinkjes ("geen inspectie of plaatsbezoek voor het versturen") en geen regel "5,0 op Google · Gratis en vrijblijvend"
     onder de knop (dubbel met "Gratis en vrijblijvende offerte aanvragen"); in de kaart geen tijdregel onder de kaartkop en geen
     tweede route "Weet u al ... Klik dan hier"; nergens in de zichtbare tekst van de pagina "gratis dakinspectie" of "gratis
     plaatsbezoek" (dat aanbod staat pas op de bedankpagina).
     8 nov 2026: sinds de port van bfbouw.be 7 nov (Mohammed: "en doe al deze changes ook bij ab pagina") horen die woorden op drie plekken
     WEL: de keuze "Gratis dakinspectie" bij vraag 1 (.kgj-reken__keuze), de knoppen "Ik ben op zoek naar" (.bf-lpzoek__knop) en stap 2
     "Gratis plaatsbezoek" van "Na uw aanvraag" (.kgj-reken__volgt). Elders (kop, subkop, kaartkop, knop) blijft het oud aanbod. */
  const offerteFouten = (p, root) => p.evaluate((root) => {
    const k = document.querySelector(root);
    const uit = [];
    if (!k) return ['geen aanvraagkaart'];
    const tekst = (el) => el.textContent.replace(/\s+/g, ' ').trim();
    if (k.querySelector('.kgj-reken__disclaimer')) uit.push('disclaimer-vinkjes op de contactstap ("' + tekst(k.querySelector('.kgj-reken__disclaimer')) + '")');
    if (k.querySelector('.kgj-reken__knopzeker')) uit.push('regel onder de knop "' + tekst(k.querySelector('.kgj-reken__knopzeker')) + '" (dubbel met de knoptekst)');
    if (k.querySelector('.kgj-reken__tijd')) uit.push('tijdregel onder de kaartkop "' + tekst(k.querySelector('.kgj-reken__tijd')) + '"');
    if (k.querySelector('.kgj-reken__offerte')) uit.push('tweede route "' + tekst(k.querySelector('.kgj-reken__offerte')) + '"');
    const OUD = /gratis (dakinspectie|plaatsbezoek)/i;
    const zicht = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    const MAG = '.kgj-reken__keuze, .bf-lpzoek__knop, .kgj-reken__volgt, .kgj-reken__nakort'; // 18 nov 2026: de korte regels onder de knop ("Gratis plaatsbezoek ...", zijn dictaat)
    const oud = [...document.querySelectorAll('h1, h2, h3, p, span, b, strong, li, a, button, summary')].filter((e) => zicht(e) && OUD.test(e.textContent) && ![...e.children].some((c) => OUD.test(c.textContent)) && !e.closest(MAG));
    if (oud.length) uit.push('oud aanbod in de tekst: "' + tekst(oud[0]).slice(0, 80) + '"');
    return uit;
  }, root);

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

  /* 9. Badges (dak en renovatie, 22 okt 2026): teksten en cijfers letterlijk gelijk, elk cijfer met een icoon. 2 nov 2026 (Mohammed:
     "door al die tekst en iconen eronder weet je niet goed dat je moet klikken", "deel aub op zoals bf"): zoals bfbouw.be (rk__vinkjes,
     rk__badges) elk vinkje hetzelfde kleine vinkje en de cijfers zonder kader of vlak. Vervangt "elk vinkje een eigen icoon" (22 okt). */
  const badgesFouten = (p, pg) => p.evaluate((pg, HERO) => {
    const uit = [];
    const k = document.querySelector(HERO);
    const norm = (e) => e.textContent.replace(/\s+/g, ' ').trim();
    /* 23 nov 2026, vorm .abc (LpBfC): alleen de kaart onderaan; .bf-lp--badges hoort bij de oude pagina met de kaart in de hero (LpBf.tsx) */
    const abc = !!document.querySelector('.abc');
    const heeft = !!k?.classList.contains('kgj-reken--badges') && (abc || !!document.querySelector('.bf-lp--badges'));
    if (!heeft) return [abc ? 'badges ontbreken (.kgj-reken--badges op de kaart)' : 'badges ontbreken (.kgj-reken--badges / .bf-lp--badges)'];
    const tegels = [...k.querySelectorAll('.kgj-reken__trust li')];
    if (tegels.map(norm).join('|') !== pg.tegels.join('|')) uit.push(`vertrouwensrij "${tegels.map(norm).join(' | ')}" in plaats van "${pg.tegels.join(' | ')}"`);
    /* 18 nov 2026 (Mohammed: "gewoon de algemene stijl robuuster minder speels"): de cijferrij is gewone tekst. Was (22 okt): elk cijfer met
       een icoontegel; nu mag er naast het Google-logo GEEN zichtbaar icoon meer staan (positieve controle 10: een geplant zichtbaar icoon). */
    const zichtbaarIcoon = tegels.filter((t) => !t.classList.contains('kgj-reken__trust-g') && [...t.querySelectorAll('svg')].some((s) => s.getClientRects().length > 0 && getComputedStyle(s).visibility !== 'hidden'));
    if (zichtbaarIcoon.length) uit.push(`${zichtbaarIcoon.length} cijfer(s) in de vertrouwensrij met een icoontegel (robuust: gewone tekst)`);
    const li = [...k.querySelectorAll('.kgj-reken__vertrouwen li')];
    const vinkjes = li.map(norm);
    if (vinkjes.join('|') !== pg.vinkjes.join('|')) uit.push(`vinkjes "${vinkjes.join(' | ')}" in plaats van "${pg.vinkjes.join(' | ')}"`);
    if (li.some((l) => !l.querySelector('svg'))) uit.push('een vinkje heeft geen icoon');
    const iconen = li.map((l) => [...(l.querySelector('svg')?.classList ?? [])].find((c) => /^lucide-(?!icon$)/.test(c)) ?? '');
    if (iconen.some((c) => c !== 'lucide-check')) uit.push(`de vinkjes hebben een eigen icoon in plaats van het vinkje van bfbouw.be (${iconen.join(', ')})`);
    const groot = li.map((l) => l.querySelector('svg')?.getBoundingClientRect().height ?? 0).filter((h) => h > 22);
    if (groot.length) uit.push(`${groot.length} vinkje(s) groter dan 22 px (${groot.map(Math.round).join(', ')} px); bfbouw.be: 20 px`);
    /* 5 nov 2026: de haakjes van rgba(...) stonden niet geëscaped, dus een doorzichtige tegel telde altijd als kader (rood sinds 2 nov,
       ook zonder kader). Positieve controle 10 plant een echt kader en moet blijven falen. */
    const kader = tegels.filter((t) => { const st = getComputedStyle(t); return !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(st.backgroundColor) || st.boxShadow !== 'none'; });
    if (kader.length) uit.push(`${kader.length} cijfer(s) in de vertrouwensrij staan in een kader of vlak (bfbouw.be: zonder kader)`);
    /* 8 nov 2026, Mohammed: "5 op google onder de subkop bij ab eruit aub": de Google-badge onder de subkop hoort WEG (was: verplicht) */
    /* in de markup van de hero, zichtbaar of niet (op de gsm verbergt de css .bf-lphero__google; een badge die er staat telt toch) */
    /* 23 nov 2026, vorm .abc: de hero is .abc-hero; daar telt ook elk blad-element met "op Google" in de tekst als Google-badge */
    const g = document.querySelector('.bf-lphero .bf-lphero__google, .abc-hero .bf-lphero__google')
      || [...document.querySelectorAll('.abc-hero *')].find((e) => !e.children.length && /op google/i.test(e.textContent));
    if (g) uit.push('Google-badge onder de subkop staat er nog (' + norm(g).slice(0, 40) + ')');
    return uit;
  }, pg, HERO);

  /* 10. Geen belblok (19 nov 2026, Mohammed: "oke doe maar eruit"). */
  const geenBelblok = (p) => p.evaluate(() => { const n = document.querySelectorAll('.bf-lpbelblok').length; return n ? [`belblok "In nood?" staat ${n} keer op de pagina (weg sinds 19 nov 2026)`] : []; });
  /* 10 (tot 19 nov 2026). Belblok op /lp/dakwerken. */
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
      /* 2 nov 2026: het aanbod is de offerte (bfbouw.be 31 okt: "Of vraag uw gratis offerte aan") */
      /* 5 nov 2026: zonder "gratis" (bfbouw.be 91ab7ba: "Of vraag uw offerte aan") */
      if (norm(link) !== 'Of vraag uw offerte aan') uit.push(`link "${norm(link)}" in plaats van "Of vraag uw offerte aan"`);
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

  /* 12. geen vaste offerteknop onderaan de gsm (8 nov 2026, Mohammed: "bij ab die statische offerte aanvragen onderaan ook weg aub",
     zoals bfbouw.be die dag). Tot dan stond hier de vaste knop .bf-lpsticky. Gemeten zoals een bezoeker scrolt (bovenaan, halverwege,
     onderaan): geen element met position fixed in de onderste helft van het scherm met tekst naar het formulier. Elke klassenaam telt
     mee, zodat een vaste knop onder een andere naam ook rood wordt. De ronde belknop (bf-belzweef, zonder tekst) mag blijven. */
  const vasteOfferteFouten = async (p) => {
    const uit = [];
    for (const deel of [0.15, 0.45, 0.8]) {
      await p.evaluate((d) => window.scrollTo(0, document.documentElement.scrollHeight * d), deel);
      await wacht(900);
      const gezien = await p.evaluate(() => [...document.querySelectorAll('body *')].filter((el) => {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return false;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1 || r.bottom <= innerHeight * 0.5 || r.top >= innerHeight) return false;
        return /offerte|aanvra|plaatsbezoek|inspectie/i.test(el.textContent);
      }).map((el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''} "${el.textContent.replace(/\s+/g, ' ').trim().slice(0, 50)}"`));
      for (const g of gezien) uit.push(`vaste knop onderaan op ${Math.round(deel * 100)} % van de pagina: ${g}`);
    }
    return uit;
  };

  /* 13. Eén stand voor de kaart bovenaan en onderaan (zie de kop van dit script). linkEerst = positieve controle: de link naar
     #contact vóór de tik bovenaan, dan hoort de kaart onderaan op stap 1 te staan en moet de toets dat als fout zien. */
  /* 23 nov 2026, vorm .abc (één kaart, onderaan): eerst een antwoord in die kaart, dan de link (de heroknop "Offerte aanvragen", boven op de pagina):
     de kaart moet op dezelfde stap terug in beeld komen met "Stap x van y" direct onder de balk. gewoneSprong = positieve controle: de klik op de link
     bereikt de pagina niet (stopPropagation in de vangfase), dus de browser doet de gewone ankersprong naar de kop van het offerteblok. */
  const eenStandFouten = async (pg, { css = null, linkEerst = false, gewoneSprong = false } = {}) => {
    const abc = !!ABC[pg.pad];
    const voorLaden = gewoneSprong ? () => document.addEventListener('click', (e) => { if (e.target?.closest?.('a[href="#contact"]')) e.stopPropagation(); }, true) : null;
    const { p, ctx } = await open(pg.pad, { gsm: true, hoogte: 637, css, voorLaden });
    const uit = [];
    if (!linkEerst) {
      if (!(await tik(p, pg.pad1[0], HERO))) { await ctx.close(); return [`keuze "${pg.pad1[0]}" ${abc ? 'in de kaart' : 'bovenaan'} niet gevonden`]; }
      const s0 = await stand(p, HERO);
      if (s0.tel !== 'Stap 2') uit.push(`${abc ? 'in de kaart' : 'bovenaan'} na één tik: ${s0.tel}`);
    }
    /* zoals een bezoeker: de eerste zichtbare link naar #contact buiten de kop (renovatie: onder de werkwijze, dak: in het waarom-blok; vorm .abc: de
       heroknop, de kopbalk is daar .abc-kop) */
    const link = await p.evaluate(() => {
      const a = [...document.querySelectorAll('a[href="#contact"]')].find((x) => x.getClientRects().length && !x.closest('.bf-kop, .abc-kop'));
      if (!a) return null;
      a.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = a.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, tekst: a.textContent.trim() };
    });
    if (!link) { await ctx.close(); return [...uit, 'geen zichtbare link naar #contact buiten de kop']; }
    await wacht(200);
    await p.touchscreen.tap(link.x, link.y);
    await wacht(1600);
    const s1 = await stand(p, ONDER);
    if (s1.tel !== 'Stap 2' || s1.vraag !== pg.vraag2) uit.push(`na "${link.tekst}" staat de kaart onderaan op ${s1.tel}, "${s1.vraag}" (verwacht Stap 2, "${pg.vraag2}")`);
    const m = await p.evaluate((ONDER) => {
      const k = document.querySelector(ONDER);
      const balk = document.querySelector('.kgj-kop').getBoundingClientRect().bottom;
      const kop = k.querySelector('.kgj-reken__kop').getBoundingClientRect().top;
      const keuzes = [...k.querySelectorAll('.kgj-reken__stap .kgj-reken__keuze')].map((x) => x.getBoundingClientRect().bottom);
      return { balk: Math.round(balk), kop: Math.round(kop), onder: keuzes.length ? Math.round(Math.max(...keuzes)) : 9999, vh: innerHeight };
    }, ONDER);
    if (m.kop < m.balk || m.kop > m.balk + 60) uit.push(`"Stap x van y" van de kaart onderaan op ${m.kop} px (verwacht direct onder de vaste balk, ${m.balk} px)`);
    if (m.onder > m.vh) uit.push(`keuzes van de kaart onderaan tot ${m.onder} px (scherm ${m.vh})`);
    if (!(await tik(p, pg.pad1[1], ONDER))) uit.push(`keuze "${pg.pad1[1]}" onderaan niet gevonden`);
    if (abc) {
      /* vorm .abc: geen kaart bovenaan; het antwoord onderaan zet de kaart een stap verder */
      const s2 = await stand(p, ONDER);
      if (s2.tel !== 'Stap 3') uit.push(`na een antwoord onderaan staat de kaart op ${s2.tel} (verwacht Stap 3)`);
      await ctx.close();
      return uit;
    }
    /* de kaart bovenaan is bevroren zolang ze buiten beeld is (toets 17); terug in beeld toont ze de stap van nu */
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await wacht(700);
    const s2 = await stand(p, HERO);
    if (s2.tel !== 'Stap 3') uit.push(`na een antwoord onderaan staat de kaart bovenaan (terug in beeld) op ${s2.tel} (verwacht Stap 3)`);
    await ctx.close();
    return uit;
  };

  /* 14. Contactblok in beeld op 390x637 (zie de kop van dit script).
     18 nov 2026 (formulier v2, Mohammed: "die popup kan je weghalen"): het contactscherm over het volle scherm (5-17 nov) bestaat niet meer.
     Nu gemeten zoals een bezoeker het ziet: GEEN pop-up (de kaart staat niet vast over het scherm, html zonder is-formvol, geen role=dialog,
     geen sluitknop, geen donkere achtergrond) en het contactblok in de pagina: de kop "Contact" onder de vaste kopbalk, naam, telefoon,
     e-mail en de verzendknop binnen het scherm. De voorouder-toets van 9 nov (Safari knipt een VASTE kaart af) is daarmee vervangen door
     de eis dat de kaart nooit vast staat. */
  const contactInBeeldFouten = async (pg, root, css = null) => {
    const { p, ctx } = await open(pg.pad, { gsm: true, hoogte: 637, css, voorLaden: () => { window.__abVolUit = false; } });
    if (root === ONDER) { await p.evaluate((r) => document.querySelector(r).scrollIntoView({ block: 'start', behavior: 'instant' }), root); await wacht(300); }
    for (const l of pg.pad1) if (!(await tik(p, l, root))) { await ctx.close(); return [`keuze "${l}" niet gevonden`]; }
    await wacht(900);
    const m = await p.evaluate((root) => {
      const k = document.querySelector(root);
      const r = (q) => k.querySelector(q)?.getBoundingClientRect();
      const kop = document.querySelector('.kgj-kop'), kcs = kop && getComputedStyle(kop);
      const balk = kop && kcs.position === 'fixed' && kcs.visibility !== 'hidden' ? kop.getBoundingClientRect().bottom : 0;
      const kaartVast = (() => { for (let e = k; e && e !== document.body; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === 'fixed') return e.className.toString().split(' ')[0]; } return ''; })();
      return { tel: (k.querySelector('.kgj-reken__tel')?.dataset.intern ?? k.querySelector('.kgj-reken__tel')?.textContent.trim()), vast: kaartVast, formvol: document.documentElement.classList.contains('is-formvol'),
        dialoog: !!document.querySelector('[role="dialog"][aria-modal="true"]'), sluit: !!k.querySelector('.kgj-reken__sluit'), achter: !!document.querySelector('.kgj-reken__achter'),
        balk: Math.round(balk), ckop: Math.round(r('.kgj-reken__ckop')?.top ?? -1),
        naam: Math.round(r('input[name=naam]')?.bottom ?? 9999), gsm: Math.round(r('input[name=telefoon]')?.bottom ?? 9999), mail: Math.round(r('input[name=email]')?.bottom ?? 9999),
        knop: Math.round(r('.kgj-reken__knop')?.bottom ?? 9999), vh: innerHeight };
    }, root);
    await ctx.close();
    if (m.tel !== `Stap ${pg.stappen}`) return [`niet op het contactblok (${m.tel})`];
    const uit = [];
    if (m.vast || m.formvol || m.dialoog || m.sluit || m.achter) uit.push(`pop-up: het contactblok staat over de pagina (${JSON.stringify({ vast: m.vast, formvol: m.formvol, dialoog: m.dialoog, sluit: m.sluit, achter: m.achter })})`);
    if (m.ckop < m.balk - 1) uit.push(`de kop "Contact" ligt onder de vaste kopbalk (${m.ckop} px, balk tot ${m.balk} px)`);
    for (const [naam, onder] of [['het naamveld', m.naam], ['het telefoonveld', m.gsm], ['het e-mailveld', m.mail], ['de verzendknop', m.knop]]) {
      if (onder > m.vh) uit.push(`${naam} valt onder het scherm (onderkant ${onder} van ${m.vh} px)`);
    }
    return uit;
  };

  /* 15. (vaste knop met de stap) is weg sinds 8 nov 2026: er is geen vaste knop meer (punt 12). */

  /* 16. Elke stap volledig in beeld op 390x637 (iPhone in Safari, Clarity 23 okt): na elk antwoord staan de vraag (onder de vaste
     balk) en alle keuzes, Volgende of de verzendknop in beeld; voor de kaart bovenaan en onderaan. */
  /* 5 nov 2026: zoals een bezoeker het ziet, met het volle scherm aan (voorLaden); over het volle scherm is de bovenrand de rij met
     Terug en de stap van de kaart zelf, niet de kopbalk van de pagina. */
  const alleStappenFouten = async (pg, root, css = null) => {
    const { p, ctx } = await open(pg.pad, { gsm: true, hoogte: 637, css, voorLaden: () => { window.__abVolUit = false; } });
    const uit = [];
    if (root === ONDER) { await p.evaluate((r) => document.querySelector(r).scrollIntoView({ block: 'start', behavior: 'instant' }), root); await wacht(300); }
    for (const l of pg.pad1) {
      if (!(await tikZonderScroll(p, l, root))) { uit.push(`keuze "${l}" niet gevonden`); break; }
      const m = await p.evaluate((root) => {
        const k = document.querySelector(root);
        const balk = k.classList.contains('is-vol') ? k.querySelector('.kgj-reken__kop').getBoundingClientRect().bottom : document.querySelector('.kgj-kop').getBoundingClientRect().bottom;
        const vraag = k.querySelector('.kgj-reken__stap .kgj-reken__vraag')?.getBoundingClientRect();
        const doelen = [...k.querySelectorAll('.kgj-reken__stap :is(.kgj-reken__keuze, .kgj-reken__vink, .kgj-reken__verder, .kgj-reken__knop)')];
        return { tel: (k.querySelector('.kgj-reken__tel')?.dataset.intern ?? k.querySelector('.kgj-reken__tel')?.textContent.trim()), balk: Math.round(balk), vraag: Math.round(vraag?.top ?? -1),
          onder: doelen.length ? Math.round(Math.max(...doelen.map((d) => d.getBoundingClientRect().bottom))) : 9999, vh: innerHeight };
      }, root);
      if (m.vraag < m.balk || m.onder > m.vh) uit.push(`${m.tel}: vraag op ${m.vraag} px (balk ${m.balk}), laatste knop tot ${m.onder} px (scherm ${m.vh})`);
    }
    await ctx.close();
    return uit;
  };
  /* Zoals de bezoeker na de vorige stap: tikken waar de keuze nu staat, zonder zelf te scrollen (anders meet 16 de eigen scroll). */
  const tikZonderScroll = async (p, label, root) => {
    if (Array.isArray(label)) {
      for (const l of label) {
        const ok = await p.evaluate((root, l) => { const b = [...document.querySelectorAll(root + ' .kgj-reken__vink--chip')].find((x) => x.textContent.trim() === l); b?.click(); return !!b; }, root, l);
        if (!ok) return false;
        await wacht(150);
      }
      await p.evaluate((root) => document.querySelector(root + ' .kgj-reken__verder')?.click(), root);
    } else {
      const ok = await p.evaluate((l, root) => { const b = [...document.querySelectorAll(root + ' .kgj-reken__keuze')].find((x) => x.textContent.trim().startsWith(l)); b?.click(); return !!b; }, label, root);
      if (!ok) return false;
    }
    await wacht(600);
    return true;
  };

  /* 17. De kaart onderaan verspringt niet als de bezoeker daar antwoordt (review 23 okt: werkt de bezoeker onderaan, dan veranderde
     de kaart bovenaan mee van hoogte; Safari corrigeert de scrollpositie niet en de kaart onderaan sprong 248 px omlaag). Gemeten
     zonder scroll anchoring (overflow-anchor: none, zoals Safari): na een antwoord onderaan blijft "Stap x van y" binnen 40 px.
     zonderBevriezen = positieve controle: elke kaart altijd "in beeld" (geen bevroren kaart bovenaan) moet de sprong laten zien. */
  const sprongFout = async (pg, { zonderBevriezen = false } = {}) => {
    const voorLaden = zonderBevriezen ? () => { window.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe(el) { setTimeout(() => this.cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }]), 0); } unobserve() {} disconnect() {} }; } : null;
    const { p, ctx } = await open(pg.pad, { gsm: true, hoogte: 637, css: '*{overflow-anchor:none!important}', voorLaden, beweging: true });
    if (!(await tikZonderScroll(p, pg.pad1[0], HERO))) { await ctx.close(); return `keuze "${pg.pad1[0]}" bovenaan niet gevonden`; }
    await p.evaluate(() => { const a = [...document.querySelectorAll('a[href="#contact"]')].find((x) => x.getClientRects().length && !x.closest('.bf-kop')); a?.scrollIntoView({ block: 'center', behavior: 'instant' }); a?.click(); });
    await wacht(1200);
    /* 18 nov 2026: gemeten op de bovenrand van de kaart. Na een antwoord schuift Aanvraag.tsx de kaart met haar titel bewust tot 8 px onder de vaste
       kopbalk (Mohammed: "bij het form invullen zijn de andere forms zo wit"); die eigen scroll is geen sprong. Een sprong = de kaart zakt meer dan 40 px
       voorbij het hoogste van haar startpositie en dat vaste punt (de Safari-sprong van 23 okt: 248 px). */
    const r = await p.evaluate((ONDER, label) => new Promise((klaar) => {
      const k = document.querySelector(ONDER);
      const kop = () => k.getBoundingClientRect().top;
      const balk = document.querySelector('.kgj-kop'), bcs = balk && getComputedStyle(balk);
      const punt = balk && bcs.position === 'fixed' ? balk.getBoundingClientRect().bottom + 8 : 8;
      const voor = Math.max(kop(), punt);
      const spoor = [];
      const t0 = performance.now();
      const meet = () => { spoor.push(kop()); if (performance.now() - t0 < 1200) requestAnimationFrame(meet); else klaar({ voor: Math.round(voor), max: Math.round(Math.max(...spoor)) }); };
      const b = [...k.querySelectorAll('.kgj-reken__keuze')].find((x) => x.textContent.trim().startsWith(label));
      if (!b) { klaar(null); return; }
      b.click();
      requestAnimationFrame(meet);
    }), ONDER, pg.pad1[1]);
    await ctx.close();
    if (!r) return `keuze "${pg.pad1[1]}" onderaan niet gevonden`;
    return r.max - r.voor > 40 ? `de kaart onderaan sprong ${r.max - r.voor} px omlaag na een antwoord onderaan (bovenrand kaart tot ${r.max} px, verwacht hoogstens ${r.voor + 40})` : null;
  };

  /* 18. Eén belofte op elke knop naar het formulier (23 okt 2026, knoppenonderzoek): elke zichtbare link naar #contact (kopknop op de
     computer, knop onder de werkwijze of in het waarom-blok) draagt exact de tekst van de verzendknop. Uitzondering: de rustige link in
     het belblok ("Of vraag uw gratis dakinspectie aan", zijn dictaat 22 okt, punt 10). plant = positieve controle (andere tekst). */
  const knoppenFouten = async (p, pg, plant = null) => {
    if (plant) await p.evaluate((t) => { const a = [...document.querySelectorAll('a[href="#contact"]')].find((x) => x.getClientRects().length && !x.closest('.bf-lpbelblok')); if (a) a.textContent = t; }, plant);
    /* 5 nov 2026: de klikbare zin in de veelgestelde vragen ("Vraag dan een gratis offerte aan.", bfbouw.be lpfaq__link) is een
       tekstlink in een antwoord, geen knop; ze telt niet mee. */
    /* 23 nov 2026, vorm .abc: de klikbare zin in een antwoord van de vragen heeft daar geen klasse (.abc-faq details a); zelfde uitzondering */
    const teksten = await p.evaluate(() => [...document.querySelectorAll('a[href="#contact"]')]
      .filter((x) => x.getClientRects().length && !x.closest('.bf-lpbelblok') && !x.classList.contains('bf-vraag__link') && !x.closest('.abc-faq details'))
      .map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
    if (!teksten.length) return ['geen zichtbare knop naar het formulier'];
    /* 5 nov 2026 (bfbouw.be 91ab7ba, Mohammed daar: "andere gewoon offerte aanvragen"): de knoppen naar het formulier zeggen allemaal
       "Offerte aanvragen"; "gratis" staat alleen nog in de kaarttitel en op de verzendknop. */
    return teksten.filter((t) => t !== pg.naarKnop).map((t) => `knop "${t}" in plaats van "${pg.naarKnop}" (één tekst op elke knop naar het formulier)`);
  };

  /* 11. horizontale scroll */
  /* 2 nov 2026: op een gsm zoomt de browser een te brede pagina uit; dan zijn scrollWidth en innerWidth allebei 407 en zag deze toets niets
     (de waarom-knop met "Gratis en vrijblijvende offerte aanvragen" was 391 px op 390). Daarom ook tegen clientWidth (de schermbreedte). */
  const scrollFout = (p) => p.evaluate(() => {
    const scherm = document.documentElement.clientWidth;
    const breed = Math.max(document.documentElement.scrollWidth, innerWidth);
    return breed > scherm + 1 ? `horizontale scroll of uitgezoomde pagina (${breed} px breed op een scherm van ${scherm})` : null;
  });

  /* Eén kaart (hero of onder) van begin tot contactstap en validatie. */
  /* naContact = positieve controle (18 nov 2026): een functie die in de pagina een fout plant zodra het contactblok er staat */
  const kaartFlow = async (p, ctx, pg, root, naam, maat, naContact = null) => {
    const etiket = `${pg.pad} @${maat} ${naam}`;
    if (!(await p.$(root))) { fouten.push(`${etiket}: geen aanvraagkaart (${root})`); await ctx.close(); return; }
    metingen++;
    for (const f of await tikGedrag(p, pg, root)) fouten.push(`${etiket}: tik: ${f}`);
    /* 4. tot de contactstap (vraag 1 is al gekozen in tikGedrag; de rest van het pad) */
    for (const l of pg.pad1.slice(1)) if (!(await tik(p, l, root))) fouten.push(`${etiket}: keuze "${l}" niet gevonden`);
    if (naContact) await p.evaluate(naContact, root);
    const c = await p.evaluate((root) => {
      const k = document.querySelector(root);
      const f = k.querySelector('form.kgj-reken__form');
      const zicht = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
      return { tel: (k.querySelector('.kgj-reken__tel')?.dataset.intern ?? k.querySelector('.kgj-reken__tel')?.textContent.trim()), ckop: f?.querySelector('.kgj-reken__ckop')?.textContent.trim().replace(/\s+/g, ' '),
        velden: f ? [...f.querySelectorAll('input:not([type=hidden]), input[type=hidden]')].map((i) => i.name || (i.closest('.kgj-pg') ? 'postcode-gemeente' : '')).filter(Boolean) : [],
        selects: f ? f.querySelectorAll('select').length : 0,
        knop: f?.querySelector('button[type=submit]')?.textContent.trim(), verplicht: f?.querySelector('[name=telefoon]')?.getAttribute('aria-required'),
        verplichtNaam: f?.querySelector('[name=naam]')?.getAttribute('aria-required'), verplichtMail: f?.querySelector('[name=email]')?.getAttribute('aria-required'),
        /* 18 nov 2026 (v2, zijn referentie): de tekst staat als placeholder in het veld, met een lijnicoon links in het veld, geen label erboven */
        plaats: f ? [...f.querySelectorAll('input:not([type=hidden])')].map((i) => `${i.name}=${i.placeholder}/${i.type}/${i.autocomplete}${i.inputMode ? '/' + i.inputMode : ''}`) : [],
        iconen: f ? [...f.querySelectorAll('input:not([type=hidden])')].filter((i) => { const ic = i.parentElement.querySelector('.kgj-reken__cic svg'); if (!zicht(ic)) return false; const a = ic.getBoundingClientRect(), b = i.getBoundingClientRect(); return a.left >= b.left && a.right <= b.left + 48 && a.top >= b.top && a.bottom <= b.bottom; }).length : 0,
        labels: f ? [...f.querySelectorAll('label')].filter(zicht).map((l) => l.textContent.replace(/\s+/g, ' ').trim()) : [],
        nakort: f ? [...f.querySelectorAll('.kgj-reken__nakort li > b')].map((l) => l.textContent.trim()) : [],
        uitleg: f ? [...f.querySelectorAll('.kgj-reken__nakort li > span')].map((l) => l.textContent.trim()) : [],
        nakortOnder: (() => { const o = f?.querySelector('.kgj-reken__nastap'), b = f?.querySelector('button[type=submit]'); /* 18 nov 2026: het stappenblok begint direct onder de knop */ return o && b ? Math.round(o.getBoundingClientRect().top - b.getBoundingClientRect().bottom) : null; })(),
        letter: f ? Math.min(...[...f.querySelectorAll('input:not([type=hidden])')].map((i) => parseFloat(getComputedStyle(i).fontSize))) : 0,
        /* niets anders in het blok en rond het blok in de kaart (Mohammed 18 nov: "gewoon zo") */
        extra: ['.kgj-reken__band', '.kgj-reken__samen', '.kgj-reken__hulp', '.kgj-reken__volgt', '.kgj-reken__trigger', '.kgj-reken__trust', '.kgj-reken__vertrouwen', '.kgj-reken__disclaimer', '.kgj-reken__gerust', '.kgj-reken__bereik', 'input[type=radio]'].filter((s) => [...k.querySelectorAll(s)].some(zicht)) };
    }, root);
    if (c.tel !== `Stap ${pg.stappen}`) fouten.push(`${etiket}: contactstap teller "${c.tel}"`);
    if (c.ckop !== pg.ckop) fouten.push(`${etiket}: kop van het contactblok "${c.ckop}" in plaats van "${pg.ckop}"`);
    /* 22 okt 2026 (dak en renovatie): Naam* en Telefoonnummer*, geen postcode. 2 nov 2026 (offerte, bfbouw.be 31 okt): E-mailadres* erbij. */
    if (c.velden.join('|') !== 'naam|telefoon|email') fouten.push(`${etiket}: de contactstap heeft de velden "${c.velden.join(', ')}" in plaats van precies "naam, telefoon, email" (geen postcode/gemeente)`);
    if (c.selects) fouten.push(`${etiket}: de contactstap heeft ${c.selects} keuzelijst(en)`);
    if (c.verplichtMail !== 'true') fouten.push(`${etiket}: e-mailveld niet als verplicht gemarkeerd`);
    for (const f of await offerteFouten(p, root)) fouten.push(`${etiket}: ${f}`);
    if (c.knop !== pg.knop) fouten.push(`${etiket}: knop "${c.knop}" in plaats van "${pg.knop}"`);
    if (c.verplicht !== 'true') fouten.push(`${etiket}: telefoonveld niet als verplicht gemarkeerd`);
    if (c.verplichtNaam !== 'true') fouten.push(`${etiket}: naamveld niet als verplicht gemarkeerd`);
    /* 18 nov 2026 (v2, zijn referentie): "Uw naam", "Telefoonnummer", "E-mailadres" als tekst in het veld (22 okt "niet gsm" blijft), elk veld
       met het juiste toetsenbord en de automatische invulling, een lijnicoon links in het veld, geen label erboven, tekst minstens 16 px */
    const PLAATS = 'naam=Uw naam/text/name|telefoon=Telefoonnummer/tel/tel/tel|email=E-mailadres/email/email/email';
    if (c.plaats.join('|') !== PLAATS) fouten.push(`${etiket}: velden "${c.plaats.join(' | ')}" in plaats van "${PLAATS}"`);
    if (c.iconen !== 3) fouten.push(`${etiket}: ${c.iconen} van de 3 velden met een lijnicoon links in het veld`);
    if (c.labels.length) fouten.push(`${etiket}: label(s) boven de velden "${c.labels.join(' | ')}" (zijn referentie: de tekst in het veld)`);
    /* 18 nov 2026 (dictaat Mohammed): de korte regels direct onder de verzendknop, woordelijk */
    if (c.uitleg.join('|') !== pg.uitleg.join('|')) fouten.push(`${etiket}: uitleg in het stappenblok "${c.uitleg.join(' | ')}" in plaats van "${pg.uitleg.join(' | ')}"`);
    if (c.nakort.join('|') !== pg.nakort.join('|') || c.nakortOnder === null || c.nakortOnder < 0 || c.nakortOnder > 24) fouten.push(`${etiket}: korte regels onder de knop "${c.nakort.join(' | ')}" op ${c.nakortOnder} px onder de knop (verwacht "${pg.nakort.join(' | ')}" direct eronder)`);
    if (c.letter < 16) fouten.push(`${etiket}: tekst in de velden ${c.letter} px (minstens 16 px, anders zoomt iOS in)`);
    /* 18 nov 2026 (Mohammed: het contactblok "gewoon zo", niets anders): geen band, overzicht, hulpregels, "Na uw aanvraag", regel boven de
       knop, cijferrij, vinkjes of keuzes in of rond het blok. Vervangt de eisen van 5-7 nov ("Na uw aanvraag", "Antwoord binnen 24 uur"). */
    if (c.extra.length) fouten.push(`${etiket}: in of rond het contactblok staat nog ${c.extra.join(', ')} (zijn referentie: kop, drie velden, knop)`);
    const voor = leads;
    /* 18 nov 2026 (v2): de melding staat rood onder het veld zelf (eerste foute veld in de volgorde van het blok) en verschijnt pas na een poging */
    const voorPoging = await p.evaluate((root) => document.querySelectorAll(root + ' .kgj-reken__veldfout, ' + root + ' .kgj-reken__fout').length, root);
    if (voorPoging) fouten.push(`${etiket}: ${voorPoging} melding(en) vóór een poging om te versturen`);
    const meldingNa = async () => {
      await p.evaluate((root) => document.querySelector(root + ' form button[type=submit]').click(), root); await wacht(500);
      return p.evaluate((root) => {
        const m = document.querySelector(root + ' .kgj-reken__veldfout') || document.querySelector(root + ' .kgj-reken__fout');
        if (!m) return '';
        const veld = m.closest('.kgj-reken__cveld')?.querySelector('input');
        const onder = veld ? m.getBoundingClientRect().top >= veld.getBoundingClientRect().bottom - 1 : false;
        return m.textContent.trim() + (veld && onder ? '' : ' [NIET ONDER HET VELD]');
      }, root);
    };
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
    /* 2 nov 2026: naam en gsm ingevuld, e-mail leeg of zonder @: de e-mailmelding, en er vertrekt niets */
    await p.type(`${root} form [name=telefoon]`, '0400 00 00 00');
    const zonderMail = await meldingNa();
    if (zonderMail !== 'Vul uw e-mailadres in. Daar sturen wij uw offerte naartoe.') fouten.push(`${etiket}: lege e-mail gaf "${zonderMail}"`);
    await p.type(`${root} form [name=email]`, 'test.kaart');
    const fouteMail = await meldingNa();
    if (fouteMail !== 'Dat e-mailadres lijkt niet juist. Controleer het even.') fouten.push(`${etiket}: e-mail zonder @ gaf "${fouteMail}"`);
    if (leads !== voor) fouten.push(`${etiket}: zonder geldig e-mailadres vertrok er een verzoek`);
    await ctx.close();
  };

  try {
    /* 23 nov 2026: de vorm van elke pagina (.abc = opbouw van bfbouw.be, LpBfC.tsx: alleen de kaart onderaan) */
    for (const pg of PAGINAS) { const { p, ctx } = await open(pg.pad); ABC[pg.pad] = await p.evaluate(() => !!document.querySelector('.abc')); await ctx.close(); }
    console.log(`vorm: ${PAGINAS.map((pg) => `${pg.pad} ${ABC[pg.pad] ? 'opbouw van bfbouw.be (alleen de kaart onderaan)' : 'kaart bovenaan en onderaan'}`).join('; ')}`);
    /* ---------- positieve controles ---------- */
    {
      const { p, ctx } = await open('/lp/richtprijs-berekenen');
      const pc1 = await rekenaarSporen(p);
      const pc7 = await ondenFouten(p);
      await ctx.close();
      if (pc1.length < 2) { console.log(`ONGELDIGE METING: de rekenaarpagina /lp/richtprijs-berekenen gaf ${pc1.length} rekenaarsporen (${pc1.join('; ')})`); process.exit(2); }
      console.log(`positieve controle 1: /lp/richtprijs-berekenen heeft ${pc1.length} rekenaarsporen (${pc1.slice(0, 2).join('; ')})`);
      if (!pc7.length) { console.log('ONGELDIGE METING: de rekenaarpagina met keuzelijsten onderaan werd door de onderaan-toets goedgekeurd'); process.exit(2); }
      {
        const pq = await open('/lp/dakwerken');
        await pq.p.evaluate(() => { const b = document.createElement('section'); b.className = 'bf-lpbelblok'; document.querySelector('main').prepend(b); });
        const pc6 = await geenBelblok(pq.p);
        await pq.ctx.close();
        if (!pc6.length) { console.log('ONGELDIGE METING: een geplant belblok op /lp/dakwerken werd door de toets goedgekeurd'); process.exit(2); }
        console.log(`positieve controle 6: geplant belblok gevangen (${pc6[0]})`);
      }
      console.log(`positieve controle 7: /lp/richtprijs-berekenen houdt het formulier met keuzelijsten onderaan (${pc7[0]})`);
    }
    {
      /* 23 nov 2026: de plant draagt de oude vorm (de kaart in de hero 900 px lager) en de vorm .abc (de heroknop "Offerte aanvragen" 900 px lager) */
      const { p, ctx } = await open('/lp/dakwerken', { css: '.kgj-reken--aanvraag{margin-top:900px!important}.abc .abc-hero__knoppen{margin-top:900px!important}' });
      const pc2 = ABC[DAK.pad] ? await eersteSchermAbc(p, DAK) : await eersteScherm(p, DAK);
      await ctx.close();
      if (!pc2.length) { console.log(`ONGELDIGE METING: een ${ABC[DAK.pad] ? 'heroknop' : 'kaart'} 900 px lager werd in het eerste scherm gezien`); process.exit(2); }
      console.log(`positieve controle 2: ${ABC[DAK.pad] ? 'heroknop' : 'kaart'} 900 px lager gezien (${pc2[0]})`);
    }
    if (ABC[DAK.pad]) {
      /* 23 nov 2026, vorm .abc: de keuzes van vraag 1 500 px lager in de kaart; na de tik op de heroknop moeten ze buiten beeld gezien worden */
      const { p, ctx } = await open('/lp/dakwerken', { css: '#contact .kgj-reken--aanvraag .kgj-reken__keuzes{margin-top:500px!important}' });
      const pc2b = await eersteSchermAbc(p, DAK);
      await ctx.close();
      if (!pc2b.some((x) => x.includes('buiten beeld'))) { console.log(`ONGELDIGE METING: keuzes 500 px lager werden na de tik op de heroknop niet buiten beeld gezien (${pc2b.join(' | ') || 'niets'})`); process.exit(2); }
      console.log(`positieve controle 2b: keuzes 500 px lager na de tik op de heroknop gezien (${pc2b.find((x) => x.includes('buiten beeld'))})`);
    }
    {
      /* 11 (2 nov 2026): een knop die 1 px breder is dan het gsm-scherm (zoals de waarom-knop die dag) moet als fout gezien worden */
      /* 23 nov 2026: ook de knoppen naar het formulier van de vorm .abc (a.abc-knop naar #contact) */
      const { p, ctx } = await open('/lp/dakwerken', { gsm: true, css: '.bf-lpcta__knop, .abc a.abc-knop[href="#contact"]{white-space:nowrap!important;min-width:391px!important;max-width:none!important}' /* 8 nov 2026: elke knop naar het formulier (de waarom-knop staat niet meer op /lp/dakwerken) */ });
      const pc11 = await scrollFout(p);
      await ctx.close();
      if (!pc11) { console.log('ONGELDIGE METING: een knop van 391 px op een gsm van 390 werd door de scrolltoets niet gezien'); process.exit(2); }
      console.log(`positieve controle 11: te brede knop op de gsm gezien (${pc11})`);
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
      if (kopFouten(DAK.kop, DAK.kop).length || kopFouten(DAK.kopAbc, DAK.kopAbc).length || kopFouten(RENO('').kop, RENO('').kop).length) { console.log('ONGELDIGE METING: de afgesproken koppen vallen zelf onder de werkwijze-regel'); process.exit(2); }
      console.log(`positieve controle 4: de koppen van 19 okt geweigerd (${pc4[0]})`);
    }
    {
      /* offertetoets (2 nov 2026): op de echte kaart groen; een geplante disclaimer, een geplante regel onder de knop en een geplante
         tekst "gratis dakinspectie" moeten elk gezien worden. En een badge met het gewone vinkje moet de badgetoets laten falen. */
      const { p, ctx } = await open('/lp/dakwerken');
      for (const l of DAK.pad1) await tik(p, l, HERO);
      const goed = await offerteFouten(p, HERO);
      if (goed.length) { console.log(`ONGELDIGE METING: de offertetoets faalt al op de echte kaart (${goed[0]}); de positieve controle zegt dan niets`); process.exit(2); }
      await p.evaluate((root) => {
        const band = document.querySelector(root + ' .kgj-reken__ckop'); // 18 nov 2026 (v2): de kop "Contact" (de band "Bijna klaar!" is weg)
        const d = document.createElement('ul'); d.className = 'kgj-reken__disclaimer'; d.innerHTML = '<li>Laat uw dak vakkundig controleren</li>'; band?.after(d);
        const z = document.createElement('p'); z.className = 'kgj-reken__knopzeker'; z.textContent = '5,0 op Google · Gratis en vrijblijvend'; document.querySelector(root + ' .kgj-reken__knop')?.after(z);
        const o = document.createElement('p'); o.textContent = 'Of vraag uw gratis dakinspectie aan'; document.querySelector('main')?.append(o);
      }, HERO);
      const pc8 = await offerteFouten(p, HERO);
      /* 18 nov 2026 (v2): bij het contactblok staan de vinkjes en de cijferrij niet meer; de badgetoets meet ze bij de laatste vraag (Terug) */
      await p.evaluate((root) => document.querySelector(root + ' .kgj-reken__terug')?.click(), HERO);
      await wacht(450);
      await p.evaluate((root) => {
        const s = document.querySelector(root + ' .kgj-reken__vertrouwen li svg'); s?.classList.replace([...s.classList].find((c) => /^lucide-(?!icon$)/.test(c)), 'lucide-award');
        const t = document.querySelector(root + ' .kgj-reken__trust li:last-child'); if (t) { t.style.background = '#faf6ec'; t.style.boxShadow = 'inset 0 0 0 1px #eadfc2'; }
        const ic = document.querySelector(root + ' .kgj-reken__trust .kgj-reken__trust-ic'); if (ic) ic.style.setProperty('display', 'grid', 'important'); // 18 nov 2026: geplante icoontegel
        const g = document.createElement('a'); g.className = 'bf-lphero__google'; g.textContent = '5,0 op Google'; (document.querySelector('.bf-lphero__tekst') || document.querySelector('.abc-hero__in') || document.querySelector('main')).append(g); // 8 nov 2026: geplante badge onder de subkop; 23 nov 2026: vorm .abc in .abc-hero__in
      }, HERO);
      const pc10 = await badgesFouten(p, DAK);
      await ctx.close();
      if (!pc8.some((x) => x.includes('disclaimer')) || !pc8.some((x) => x.includes('regel onder de knop')) || !pc8.some((x) => x.includes('oud aanbod'))) { console.log(`ONGELDIGE METING: een geplante disclaimer, regel onder de knop of "gratis dakinspectie" werd door de offertetoets niet allemaal gezien (${pc8.join(' | ') || 'niets'})`); process.exit(2); }
      console.log(`positieve controle 8: geplante disclaimer, regel onder de knop en oud aanbod gezien (${pc8.join('; ')})`);
      if (!pc10.some((x) => x.includes('eigen icoon')) || !pc10.some((x) => x.includes('kader')) || !pc10.some((x) => x.includes('Google-badge')) || !pc10.some((x) => x.includes('icoontegel'))) { console.log(`ONGELDIGE METING: een eigen icoon bij een vinkje of een cijfer in een kader werd door de badgetoets niet allebei gezien (${pc10.join(' | ') || 'niets'})`); process.exit(2); }
      console.log(`positieve controle 10: eigen icoon bij een vinkje en cijfer in een kader gezien (${pc10.join('; ')})`);
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
      /* 12. geen vaste offerteknop: een geplante vaste knop onder een andere klassenaam (zoals de oude lpsticky: 58 px hoog, onderaan,
         met de knoptekst) moet de toets laten falen. */
      const { p, ctx } = await open('/lp/dakwerken', { gsm: true });
      await p.evaluate(() => {
        const a = document.createElement('a');
        a.href = '#contact'; a.className = 'geplant-vast'; a.textContent = 'Gratis dakinspectie aanvragen';
        a.style.cssText = 'position:fixed;left:16px;right:86px;bottom:16px;height:58px;z-index:40;background:#f90;display:flex;align-items:center;justify-content:center';
        document.body.append(a);
      });
      const pc12 = await vasteOfferteFouten(p);
      await ctx.close();
      if (!pc12.some((f) => f.includes('geplant-vast'))) { console.log(`ONGELDIGE METING: een geplante vaste offerteknop werd niet gezien (${pc12.join(' | ') || 'niets'})`); process.exit(2); }
      console.log(`positieve controle 12: geplante vaste offerteknop gezien (${pc12[0]})`);
    }
    {
      /* 13-17 (23 okt 2026): elke bewering van de nieuwe toetsen moet op een geplante fout rood worden. pc = [naam, fouten, verwacht stuk tekst] */
      const RENO1 = RENO('/lp/totaalrenovatie');
      const pcs = [
        ['13a: een tik onderaan die niets doet', await eenStandFouten(RENO1, { css: '.kgj-reken--onder .kgj-reken__keuze{pointer-events:none!important}' }), 'kaart bovenaan (terug in beeld) op'],
        ['13b: de link naar #contact vóór de tik bovenaan', await eenStandFouten(RENO1, { linkEerst: true }), 'staat de kaart onderaan op Stap 1'],
        ['13c: keuzes onderaan 500 px lager', await eenStandFouten(RENO1, { css: '#contact .kgj-reken--aanvraag .kgj-reken__keuzes{margin-top:500px!important}' }), 'keuzes van de kaart onderaan tot'],
        /* 18 nov 2026 (v2): de kop "Contact" in plaats van de band; de pop-up van 5-17 nov (de kaart vast over het scherm) moet rood geven */
        /* 23 nov 2026, vorm .abc op /lp/dakwerken: dezelfde bewering voor de enige kaart, onderaan. De link naar #contact moet de kaart op haar stap
           brengen ("Stap x van y" direct onder de balk): een klik die de pagina niet bereikt (gewone ankersprong naar de kop van het offerteblok) moet rood
           geven, net als keuzes 500 px lager. */
        ...(ABC[DAK.pad] ? [
          ['13d: de link naar #contact doet de gewone ankersprong (vorm .abc)', await eenStandFouten(DAK, { gewoneSprong: true }), '"Stap x van y" van de kaart onderaan op'],
          ['13e: keuzes onderaan 500 px lager (vorm .abc)', await eenStandFouten(DAK, { css: '#contact .kgj-reken--aanvraag .kgj-reken__keuzes{margin-top:500px!important}' }), 'keuzes van de kaart onderaan tot'],
        ] : []),
        ['14: 420 px marge onder de kop "Contact"', await contactInBeeldFouten(DAK, ABC[DAK.pad] ? ONDER : HERO, '.kgj-reken--aanvraag .kgj-reken__ckop{margin-bottom:420px!important}'), 'valt onder het scherm'],
        ['14b: de kaart bovenaan als pop-up (vast over het scherm)', await contactInBeeldFouten(DAK, HERO, '#rekenaar .kgj-reken--aanvraag.is-contact{position:fixed!important;inset:0!important;z-index:1000!important}'), 'pop-up'],
        ['14c: de kaart onderaan als pop-up (vast over het scherm)', await contactInBeeldFouten(DAK, ONDER, '#contact .kgj-reken--aanvraag.is-contact{position:fixed!important;inset:0!important;z-index:1000!important}'), 'pop-up'],
        ['16: keuzes 500 px lager', await alleStappenFouten(RENO1, HERO, '.kgj-reken--aanvraag .kgj-reken__keuzes{margin-top:500px!important}'), 'laatste knop tot'],
        ['17: kaart bovenaan niet bevroren (alles altijd in beeld)', [await sprongFout(RENO1, { zonderBevriezen: true })].filter(Boolean), 'sprong'],
        ['18: een knop naar het formulier met de oude tekst', await (async () => { const { p, ctx } = await open(RENO1.pad, { gsm: false }); const f = await knoppenFouten(p, RENO1, 'Plan uw gratis plaatsbezoek'); await ctx.close(); return f; })(), 'Plan uw gratis plaatsbezoek'],
      ];
      for (const [naam, f, stuk] of pcs) {
        if (!f.some((x) => x.includes(stuk))) { console.log(`ONGELDIGE METING: positieve controle ${naam} werd niet als fout gezien (verwacht "${stuk}", gezien: ${f.join(' | ') || 'niets'})`); process.exit(2); }
        console.log(`positieve controle ${naam}: gezien (${f.find((x) => x.includes(stuk))})`);
      }
    }
    {
      /* 4 (18 nov 2026, contactblok v2): geplante fouten in het blok moeten elk gezien worden: een label boven de velden, een verborgen
         icoon, tekst van 14 px, "Na uw aanvraag" in het blok, de melding boven het veld in plaats van eronder, een andere placeholder. */
      const voor = fouten.length;
      const { p, ctx } = await open(DAK.pad, { gsm: true, css: '.kgj-reken__cveld:first-child .kgj-reken__cic{display:none!important}.kgj-reken__cveld input{font-size:14px!important}.kgj-reken__cveld{display:flex!important;flex-direction:column-reverse!important}' });
      await kaartFlow(p, ctx, DAK, HERO, 'positieve controle', '390x844', (root) => {
        const f = document.querySelector(root + ' form');
        const l = document.createElement('label'); l.textContent = 'Naam *'; f.prepend(l);
        const v = document.createElement('div'); v.className = 'kgj-reken__volgt'; v.textContent = 'Na uw aanvraag'; f.append(v);
        f.querySelector('[name=telefoon]').placeholder = '04xx xx xx xx';
        const li = f.querySelector('.kgj-reken__nakort li > b'); if (li) li.textContent = 'Wij bellen u terug';
      });
      const pc4 = fouten.splice(voor);
      for (const stuk of ['label(s) boven de velden', '2 van de 3 velden met een lijnicoon', 'tekst in de velden 14 px', 'kgj-reken__volgt', 'NIET ONDER HET VELD', '04xx xx xx xx', 'Wij bellen u terug']) {
        if (!pc4.some((x) => x.includes(stuk))) { console.log(`ONGELDIGE METING: positieve controle 4 (contactblok) zag "${stuk}" niet (${pc4.join(' | ') || 'niets'})`); process.exit(2); }
      }
      console.log(`positieve controle 4 (contactblok): 7 geplante fouten gezien (${pc4.length} meldingen)`);
      metingen--; // de controle telt niet als meting van een pagina
    }
    const leadsNaControles = leads;

    /* ---------- de drie pagina's ---------- */
    for (const pg of PAGINAS) {
      for (const gsm of [true, false]) {
        const maat = gsm ? '390x844' : '1265x800';
        /* kaart bovenaan (23 nov 2026, vorm .abc: de toetsen van de pagina; geen kaart bovenaan, de kaartflow loopt hieronder op de kaart onderaan) */
        {
          const { p, ctx, slots } = await open(pg.pad, { gsm });
          if (!(await p.$(HERO))) { fouten.push(`${pg.pad} @${maat}: geen aanvraagkaart (${HERO})`); await ctx.close(); continue; }
          for (const f of await rekenaarSporen(p)) fouten.push(`${pg.pad} @${maat}: rekenaar-ingang: ${f}`);
          const h1 = await leesKop(p);
          for (const f of kopFouten(h1, kopVan(pg))) fouten.push(`${pg.pad} @${maat}: ${f}`);
          for (const f of await ondenFouten(p)) fouten.push(`${pg.pad} @${maat}: onderaan: ${f}`);
          for (const f of await badgesFouten(p, pg)) fouten.push(`${pg.pad} @${maat}: badges: ${f}`);
          for (const f of await knoppenFouten(p, pg)) fouten.push(`${pg.pad} @${maat}: knoppen: ${f}`);
          const sf = await scrollFout(p); if (sf) fouten.push(`${pg.pad} @${maat}: ${sf}`);
          /* 19 nov 2026 (Mohammed: "oke doe maar eruit"): geen belblok "In nood?" meer, op geen enkele pagina */
          for (const f of await geenBelblok(p)) fouten.push(`${pg.pad} @${maat}: ${f}`);
          /* eerste gsm-scherm als laatste van de paginatoetsen: op de vorm .abc tikt het de heroknop (de pagina scrolt dan naar de kaart) */
          if (gsm) for (const f of ABC[pg.pad] ? await eersteSchermAbc(p, pg) : await eersteScherm(p, pg)) fouten.push(`${pg.pad} @${maat}: eerste scherm: ${f}`);
          /* het belblok-gedrag (hash, Clarity) loopt als laatste in een eigen pagina, zodat de kaartflow niet verstoord wordt */
          if (ABC[pg.pad]) await ctx.close();
          else await kaartFlow(p, ctx, pg, HERO, 'bovenaan', maat);
          /* na alle stappen (meer dan 2,5 s na het laden): nog steeds geen free-slots-verzoek en geen "Eerstvolgend"-tekst */
          const vf = slots.length;
          if (vf) fouten.push(`${pg.pad} @${maat}: ${vf} free-slots-verzoek(en) naar de GHL-agenda`);
        }
        {
          const { p, ctx, slots } = await open(pg.pad, { gsm });
          await wacht(2500);
          for (const f of await vrijFouten(p, slots)) fouten.push(`${pg.pad} @${maat}: vrij moment: ${f}`);
          await ctx.close();
        }
        /* kaart onderaan (dak en renovatie, 22 okt 2026) */
        {
          const { p, ctx } = await open(pg.pad, { gsm });
          await kaartFlow(p, ctx, pg, ONDER, 'onderaan', maat);
        }
      }
    }
    /* 13-17 (23 okt 2026): één stand, contactscherm in beeld, vaste knop met de stap, elke stap in beeld, geen sprong onderaan */
    for (const pg of PAGINAS) {
      for (const f of await eenStandFouten(pg)) fouten.push(`${pg.pad} @390x637: één stand: ${f}`);
      metingen++;
      for (const [root, naam] of kaarten(pg)) { // 23 nov 2026: vorm .abc alleen onderaan
        for (const f of await contactInBeeldFouten(pg, root)) fouten.push(`${pg.pad} @390x637 ${naam}: contactscherm: ${f}`);
        for (const f of await alleStappenFouten(pg, root)) fouten.push(`${pg.pad} @390x637 ${naam}: stap niet in beeld: ${f}`);
        metingen += 2;
      }
      /* 12 (8 nov 2026): geen vaste offerteknop onderaan, op de gsm van de Clarity-opnamen (390x664) en op 390x844 */
      for (const hoogte of [664, 844]) {
        const { p, ctx } = await open(pg.pad, { gsm: true, hoogte });
        for (const f of await vasteOfferteFouten(p)) fouten.push(`${pg.pad} @390x${hoogte}: ${f}`);
        await ctx.close();
      }
      metingen++;
      const sf = await sprongFout(pg);
      if (sf) fouten.push(`${pg.pad} @390x637 zonder scroll anchoring: ${sf}`);
      metingen++;
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
      const m = { h1: await leesKop(p) };
      const s = await stand(p);
      /* 2 nov 2026: de variant plat (en hellend, isolatie, renovatie, nieuw) houdt de gewone kop van de pagina; 23 nov 2026: op de vorm .abc is dat kopAbc */
      for (const f of kopFouten(m.h1, kopVan(DAK))) fouten.push(`message match: ${f}`);
      /* 7 nov 2026 (zoals bfbouw.be data-voor): het soort dak is nu vraag 2; de zoekterm beantwoordt het en die vraag valt weg in de kaart. */
      if (s.vraag !== DAK.vraag1 || s.tel !== 'Stap 1' || s.terug) fouten.push(`message match: kaart ${JSON.stringify(s)} (verwacht vraag 1, Stap 1, geen Terug)`);
      if (!(await tik(p, 'Dakrenovatie', HERO))) fouten.push('message match: keuze Dakrenovatie niet gevonden');
      await wacht(450);
      const s1 = await stand(p);
      if (s1.vraag === DAK.vraag2 || s1.tel !== 'Stap 2' || !s1.terug) fouten.push(`message match: na Dakrenovatie ${JSON.stringify(s1)} (verwacht Stap 2 zonder "${DAK.vraag2}": plat dak staat al vast)`);
      await p.evaluate(() => document.querySelector('.kgj-reken--aanvraag .kgj-reken__terug')?.click());
      await wacht(450);
      const s2 = await stand(p);
      if (s2.vraag !== DAK.vraag1) fouten.push(`message match: Terug gaf "${s2.vraag}"`);
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
  /* + per pagina (23 okt 2026): één stand, contactscherm en elke stap bovenaan en onderaan, vaste knop, geen sprong onderaan */
  /* 23 nov 2026: per pagina het aantal kaarten (vorm .abc: 1, alleen onderaan); was vast 3 * 2 * 2 + 1 + 3 * 7 = 34 */
  const verwacht = PAGINAS.reduce((n, pg) => n + 2 * kaarten(pg).length + 3 + 2 * kaarten(pg).length, 0) + 1;
  if (PAGINAS.some((pg) => ABC[pg.pad] === undefined)) { console.log('ONGELDIGE METING: de vorm van een pagina is niet bepaald'); process.exit(2); }
  if (metingen < verwacht) { console.log(`ONGELDIGE METING: ${metingen} metingen (verwacht ${verwacht})`); process.exit(2); }
  console.log(`check-lp-aanvraag: ${PAGINAS.map((pg) => `${pg.pad} (${kaarten(pg).map(([, n]) => 'kaart ' + n).join(' en ')})`).join(', ')} x 2 maten + message match, ${metingen} metingen (${basis}), ${leads} leadverzoeken`);
  if (fouten.length) { fouten.forEach((f) => console.log('  FOUT: ' + f)); process.exit(1); }
  console.log('  kop zoals afgesproken, geen rekenaar-ingang, kaart in het eerste gsm-scherm (vorm .abc: de knop "Offerte aanvragen" in het eerste scherm en na één tik vraag 1 met alle keuzes in beeld), één tik = volgende vraag (bovenaan en onderaan), contactstap naam, telefoonnummer en e-mailadres (verplicht) zonder disclaimer of regel onder de knop, geen tijdregel, geen tweede route, nergens "gratis dakinspectie/plaatsbezoek", naam verplicht, lege gsm, lege of foute e-mail, badges met eigen iconen, geen vrij moment en geen agenda-verzoek, geen belblok, geen horizontale scroll, één stand voor de kaart bovenaan en onderaan, contactscherm en elke stap volledig in beeld op 390x637, geen vaste offerteknop onderaan, geen sprong onderaan zonder scroll anchoring');
  process.exit(0);
})().catch((e) => { console.log('ONGELDIGE METING: ' + e.message); process.exit(2); });
