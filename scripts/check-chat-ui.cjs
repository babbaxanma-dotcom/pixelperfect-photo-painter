/**
 * Browsertoets van de digitale assistent op /lp/dakwerken en /lp/totaalrenovatie.
 *
 * Draait tegen een dev-server met het nepmodel:
 *   CHAT_NEP=1 npx vite --port 8090 --strictPort
 *   node scripts/check-chat-ui.cjs
 * en, als tegenproef, tegen een server zonder sleutel (LEEG_URL, standaard 8080):
 * daar mag geen chatknop staan.
 *
 * Verstuurt NOOIT een lead: elk verzoek naar GHL of Web3Forms wordt onderschept
 * en afgebroken; de toets leest alleen wat er verstuurd zou worden.
 */
const puppeteer = require('puppeteer-core');

const BASIS = process.env.CHAT_URL || 'http://localhost:8090';
const LEEG = process.env.LEEG_URL || 'http://localhost:8080';
const UIT = process.env.SCHERMEN || require('os').tmpdir() + '/chat-ui';
require('fs').mkdirSync(UIT, { recursive: true });
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));
const uitslag = [];
const meld = (ok, wat, detail = '') => uitslag.push(`${ok ? 'AF     ' : 'NIET AF'}  ${wat}${detail ? '  (' + detail + ')' : ''}`);
const LEAD = /leadconnectorhq|msgsvc|web3forms/;

async function pagina(browser, url, vp) {
  const p = await browser.newPage();
  await p.setViewport(vp);
  await p.evaluateOnNewDocument(() => {
    localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false }));
    sessionStorage.clear();
    /* Leadverzoeken komen nooit op het netwerk: fetch geeft meteen een fout terug
       en bewaart wat er verstuurd zou worden (de aanvraag via keepalive-fetch
       draagt zijn body niet mee in de onderschepping van puppeteer). */
    window.__leads = [];
    const echt = window.fetch.bind(window);
    window.fetch = (url, opt = {}) => {
      if (/leadconnectorhq|msgsvc|web3forms/.test(String(url))) {
        window.__leads.push({ url: String(url), body: String(opt.body || '') });
        return Promise.resolve(new Response('{}', { status: 500 }));
      }
      return echt(url, opt);
    };
  });
  const leads = [];
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    if (LEAD.test(r.url())) {
      /* fetch met keepalive: de body komt niet mee in postData(), apart ophalen. */
      const lead = { url: r.url(), body: r.postData() || '' };
      leads.push(lead);
      if (!lead.body && r.hasPostData && r.hasPostData()) r.fetchPostData().then((b) => { lead.body = b || ''; }).catch(() => {});
      r.abort();
    }
    else r.continue();
  });
  const fouten = [];
  p.on('pageerror', (e) => fouten.push(String(e.message).slice(0, 120)));
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await wacht(900);
  return { p, leads, fouten };
}
const klikTekst = (p, sel, tekst) => p.evaluate((s, t) => {
  const e = [...document.querySelectorAll(s)].reverse().find((x) => x.textContent.trim() === t || x.textContent.trim().endsWith(t));
  if (e) { e.click(); return true; } return false;
}, sel, tekst);
const wachtAntwoord = async (p) => { for (let i = 0; i < 40; i++) { await wacht(150); if (!(await p.$('.kgj-chat__typt'))) return; } };
const laatsteAi = (p) => p.evaluate(() => [...document.querySelectorAll('.kgj-chat__bel--ai')].pop()?.textContent.trim() || '');

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const gsm = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };

  /* Tegenproef: zonder sleutel geen knop. */
  const leeg = await pagina(browser, LEEG + '/lp/dakwerken', gsm);
  meld(!(await leeg.p.$('.kgj-chatknop')), 'zonder sleutel: geen chatknop op de pagina');
  await leeg.p.close();

  /* ── dakwerken, telefoon ── */
  const { p, leads, fouten } = await pagina(browser, BASIS + '/lp/dakwerken', gsm);
  meld(!!(await p.$('.kgj-chatknop')), 'met sleutel: chatknop staat er');
  await p.screenshot({ path: `${UIT}/01-knop-gsm.png` });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45)); await wacht(700);
  const hoog = await p.evaluate(() => {
    const k = document.querySelector('.kgj-chatknop').getBoundingClientRect();
    const b = document.querySelector('.kgj-actiebalk.is-aan')?.getBoundingClientRect();
    return { knop: Math.round(k.bottom), balk: b ? Math.round(b.top) : null };
  });
  meld(hoog.balk !== null && hoog.knop <= hoog.balk - 8, 'knop staat boven de vaste actiebalk', JSON.stringify(hoog));
  await p.screenshot({ path: `${UIT}/02-knop-boven-balk.png` });

  await p.click('.kgj-chatknop'); await wacht(400);
  const open = await p.evaluate(() => {
    const r = document.querySelector('.kgj-chat').getBoundingClientRect();
    return { b: Math.round(r.width), h: Math.round(r.height), welkom: document.querySelector('.kgj-chat__bel--ai')?.textContent,
      snel: [...document.querySelectorAll('.kgj-chat__snel > *')].map((e) => e.textContent.trim()),
      vaak: [...document.querySelectorAll('.kgj-chat__vaak button')].map((e) => e.textContent.trim()), breed: document.documentElement.scrollWidth };
  });
  meld(open.b === 390 && open.h === 844, 'op de telefoon vult het venster het scherm', `${open.b}x${open.h}`);
  meld(/welkom bij AB Bouw Groep/.test(open.welkom) && /dak/.test(open.welkom) && !/ik/i.test(open.welkom), 'welkom in de wij-vorm, noemt AB Bouw Groep en het dak', open.welkom);
  meld(open.snel.join('|') === 'Bereken mijn prijs|Gratis dakinspectie aanvragen|Bel 0460 20 77 88', 'drie snelle functies', open.snel.join(' | '));
  meld(open.vaak.length === 4, 'vier vaak gestelde vragen', open.vaak.join(' | '));
  meld(open.breed <= 390, 'geen horizontaal scrollen met open chat', String(open.breed));
  await p.screenshot({ path: `${UIT}/03-open-gsm.png` });

  await klikTekst(p, '.kgj-chat__vaak button', 'Hoelang duren de werken aan mijn dak?'); await wachtAntwoord(p);
  const na1 = await p.evaluate(() => ({
    mens: [...document.querySelectorAll('.kgj-chat__bel--mens')].map((e) => e.textContent),
    andere: [...document.querySelectorAll('.kgj-chat__vaak--na button')].map((e) => e.textContent), actie: document.querySelector('.kgj-chat__actie')?.textContent,
  }));
  meld(na1.mens.length === 1 && /werkdagen/.test(await laatsteAi(p)), 'vraag gesteld en beantwoord', await laatsteAi(p));
  meld(na1.andere.length >= 2, 'ruimte voor andere vragen na het antwoord', na1.andere.join(' | '));
  meld(/dakinspectie/i.test(na1.actie || ''), 'knop bij het antwoord: gratis dakinspectie', na1.actie);
  await p.screenshot({ path: `${UIT}/04-antwoord-gsm.png` });

  /* Aanvraag in de chat. */
  await klikTekst(p, '.kgj-chat__snel button', 'Gratis dakinspectie aanvragen'); await wachtAntwoord(p);
  meld(/Wat moet er aan uw dak gebeuren/.test(await laatsteAi(p)), 'aanvraag: eerste vraag', await laatsteAi(p));
  await p.screenshot({ path: `${UIT}/05-aanvraag-vraag1.png` });
  for (const k of ['Dakrenovatie', 'Hellend dak']) { await klikTekst(p, '.kgj-chat__keuzes button', k); await wachtAntwoord(p); }
  await p.type('.kgj-chat__invoer textarea', 'Mortsel'); await p.keyboard.press('Enter'); await wachtAntwoord(p);
  for (const k of ['50 tot 100 m²', 'Binnen drie maanden']) { await klikTekst(p, '.kgj-chat__keuzes button', k); await wachtAntwoord(p); }
  const kaart = await p.evaluate(() => {
    const k = document.querySelector('.kgj-chat__kaart');
    if (!k) return null;
    return { titel: k.querySelector('.kgj-chat__kaartkop').textContent, velden: [...k.querySelectorAll('dt')].map((e) => e.textContent),
      bericht: k.querySelector('textarea').value, knop: k.querySelector('button[type=submit]').textContent };
  });
  meld(!!kaart && kaart.velden.length === 5 && /Mortsel/.test(kaart.titel), 'aanvraag klaar: kaart met vijf velden', kaart && `${kaart.titel} / ${kaart.velden.join(', ')}`);
  meld(!!kaart && /Vraag uw gratis dakinspectie aan/.test(kaart.knop), 'knop van de kaart = knop van het formulier onderaan', kaart && kaart.knop);
  await p.evaluate(() => document.querySelector('.kgj-chat__kaart').scrollIntoView({ block: 'start' })); await wacht(300);
  await p.screenshot({ path: `${UIT}/06-kaart-gsm.png` });

  /* Zonder telefoon: melding, niets verstuurd. */
  await p.click('.kgj-chat__kaart button[type=submit]'); await wacht(300);
  meld(/telefoonnummer/.test(await p.evaluate(() => document.querySelector('.kgj-chat__kaart .kgj-reken__fout')?.textContent || '')) && leads.length === 0,
    'zonder telefoon: melding en geen verzending');
  await p.type('.kgj-chat__kaart input[name=telefoon]', '0400 00 00 00');
  await p.type('.kgj-chat__kaart input[name=naam]', 'Test Chat');
  await p.click('.kgj-chat__kaart button[type=submit]'); await wacht(1500);
  const inPagina = await p.evaluate(() => window.__leads);
  const ghl = inPagina.find((l) => /leadconnectorhq|msgsvc/.test(l.url));
  let data = {};
  try { data = JSON.parse(ghl?.body || '{}'); } catch { /* geen JSON */ }
  const info = JSON.stringify(data);
  meld(!!ghl && leads.length === 0, 'lead zou naar GHL gaan (in de pagina tegengehouden, nul verzoeken op het netwerk)', ghl ? ghl.url.slice(0, 80) : 'geen');
  meld(/lp:dakwerken:inspectie/.test(info), 'zelfde bron_lead als het formulier onderaan (lp:dakwerken:inspectie)');
  meld(/via de chat/.test(info) && /Mortsel/.test(info) && /Hellend dak/.test(info), 'aanvullende info: via de chat, met de velden');
  meld(/0400/.test(info.replace(/\s/g, '')) || /400000000/.test(info), 'telefoonnummer meegestuurd');
  meld(!p.url().includes('/bedankt'), 'onderschepte lead: geen bedankpagina (niets aangekomen)');

  /* Prijsvraag: geen bedrag, knop opent de prijsberekening. */
  await p.evaluate(() => sessionStorage.clear());
  await p.goto(BASIS + '/lp/dakwerken', { waitUntil: 'networkidle2' }); await wacht(700);
  await p.click('.kgj-chatknop'); await wacht(300);
  await p.type('.kgj-chat__invoer textarea', 'Wat kost een nieuw dak van 100 m² ongeveer?'); await p.keyboard.press('Enter'); await wachtAntwoord(p);
  const prijs = await laatsteAi(p);
  meld(!/€|euro|\d{1,3}\.\d{3}/i.test(prijs), 'prijsvraag: geen bedrag in het antwoord', prijs.slice(0, 80));
  await p.screenshot({ path: `${UIT}/07-prijsvraag.png` });
  await p.click('.kgj-chat__actie'); await wacht(500);
  meld(!(await p.$('.kgj-chat')) && !!(await p.$('.kgj-venster')), 'knop "Bereken mijn prijs": chat dicht, prijsberekening open');
  meld(fouten.length === 0, 'geen fouten in de console (dakwerken)', fouten.join(' | '));
  await p.close();

  /* ── dakwerken, desktop ── */
  const d = await pagina(browser, BASIS + '/lp/dakwerken', { width: 1366, height: 900 });
  const pil = await d.p.evaluate(() => { const k = document.querySelector('.kgj-chatknop'); const r = k.getBoundingClientRect(); return { tekst: k.textContent.trim(), rechts: Math.round(innerWidth - r.right), onder: Math.round(innerHeight - r.bottom) }; });
  meld(pil.tekst === 'Stel uw vraag' && pil.rechts === 24 && pil.onder === 24, 'desktop: knop "Stel uw vraag" rechtsonder', JSON.stringify(pil));
  await d.p.click('.kgj-chatknop'); await wacht(300);
  const venster = await d.p.evaluate(() => { const r = document.querySelector('.kgj-chat').getBoundingClientRect(); return { b: Math.round(r.width), h: Math.round(r.height) }; });
  meld(venster.b === 390 && venster.h <= 660, 'desktop: venster 390 breed rechtsonder', JSON.stringify(venster));
  await klikTekst(d.p, '.kgj-chat__vaak button', 'Krijg ik een premie voor dakisolatie?'); await wachtAntwoord(d.p);
  await d.p.screenshot({ path: `${UIT}/08-desktop.png` });
  await d.p.close();

  /* ── totaalrenovatie ── */
  const r = await pagina(browser, BASIS + '/lp/totaalrenovatie', gsm);
  await r.p.click('.kgj-chatknop'); await wacht(300);
  const reno = await r.p.evaluate(() => ({ welkom: document.querySelector('.kgj-chat__bel--ai').textContent, snel: [...document.querySelectorAll('.kgj-chat__snel > *')].map((e) => e.textContent.trim()) }));
  meld(/renovatie/.test(reno.welkom) && reno.snel[1] === 'Gratis plaatsbezoek aanvragen', 'totaalrenovatie: eigen welkom en plaatsbezoek', reno.snel.join(' | '));
  await klikTekst(r.p, '.kgj-chat__snel button', 'Gratis plaatsbezoek aanvragen'); await wachtAntwoord(r.p);
  meld(/Wat voor woning/.test(await laatsteAi(r.p)), 'totaalrenovatie: aanvraag begint bij de woning', await laatsteAi(r.p));
  await r.p.screenshot({ path: `${UIT}/09-reno-gsm.png` });
  for (const k of ['Rijwoning', 'Alles (totaalrenovatie)']) { await klikTekst(r.p, '.kgj-chat__keuzes button', k); await wachtAntwoord(r.p); }
  await r.p.type('.kgj-chat__invoer textarea', 'Kontich'); await r.p.keyboard.press('Enter'); await wachtAntwoord(r.p);
  for (const k of ['100 tot 150 m²', 'Zo snel mogelijk']) { await klikTekst(r.p, '.kgj-chat__keuzes button', k); await wachtAntwoord(r.p); }
  const renoKaart = await r.p.evaluate(() => ({ knop: document.querySelector('.kgj-chat__kaart button[type=submit]')?.textContent, velden: document.querySelectorAll('.kgj-chat__kaart dt').length }));
  meld(renoKaart.velden === 5 && /plaatsbezoek/.test(renoKaart.knop || ''), 'totaalrenovatie: kaart met vijf velden en knop plaatsbezoek', JSON.stringify(renoKaart));
  await r.p.type('.kgj-chat__kaart input[name=telefoon]', '0400 00 00 00');
  await r.p.click('.kgj-chat__kaart button[type=submit]'); await wacht(1500);
  const renoLead = (await r.p.evaluate(() => window.__leads)).find((l) => /leadconnectorhq|msgsvc/.test(l.url));
  meld(!!renoLead && /lp:totaalrenovatie:inspectie/.test(renoLead.body) && /Kontich/.test(renoLead.body) && r.leads.length === 0,
    'totaalrenovatie: lead met bron lp:totaalrenovatie:inspectie (tegengehouden, niets op het netwerk)');
  meld(r.fouten.length === 0, 'geen fouten in de console (totaalrenovatie)', r.fouten.join(' | '));
  await r.p.close();

  await browser.close();
  console.log(uitslag.join('\n'));
  const af = uitslag.filter((x) => x.startsWith('AF')).length;
  console.log(`\n${af} van ${uitslag.length} AF · schermen in ${UIT}`);
  process.exit(af === uitslag.length ? 0 : 1);
})();
