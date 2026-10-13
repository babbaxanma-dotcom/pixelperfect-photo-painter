#!/usr/bin/env node
/**
 * check-lp-payload: elke lead van de 4 landingspagina's komt identiek aan bij GHL en Web3Forms.
 *
 * Aanleiding (spec/bf-stijl.md §17, 12 okt 2026): de LP's krijgen een nieuw omhulsel in de stijl van bfbouw.be.
 * Alleen de stijl mag veranderen. GHL-workflow W01b kiest de sms aan de klant op bron_lead_detail
 * (dakwerken:rekenaar, totaalrenovatie:rekenaar, dakwerken:inspectie); aanvullende_info staat letterlijk in de sms
 * aan Bardh. Eén afwijking stuurt de verkeerde sms of verliest de conversie.
 *
 * Per LP en per flow (rekenaar in de hero, rekenaar in het venster, het slotformulier) doet deze toets wat een
 * bezoeker doet, onderschept elk verzoek naar services.leadconnectorhq.com en api.web3forms.com (nul echte leads)
 * en vergelijkt veld voor veld met de vaste referentie in scripts/fixtures/lp-payload/<lp>.json (gemeten op de
 * HUIDIGE LpKgj, 12 okt 2026). Verder per flow:
 *   - validatie: leeg telefoonnummer en < 8 cijfers geven de vaste foutmelding en versturen NIETS;
 *   - dubbelklik op de verzendknop = precies 1 GHL- en 1 Web3Forms-verzoek;
 *   - trackFormStart: het form_start-label in de dataLayer;
 *   - Toestemming-stap na een lead zonder marketingtoestemming ("Liever niet"), geen stap met toestemming;
 *   - de /bedankt-URL;
 *   - Clarity: verzoek naar https://www.clarity.ms/tag/<project-id> (beantwoord met een leeg script).
 * Google-tags krijgen een leeg script: geen vervuiling van statistieken of conversies. Nooit tel:/mailto:.
 *
 * Positieve controle (zonder: exit 2): dezelfde flow draait één keer met een geplante fout in de pagina (het
 * GHL-verzoek krijgt een ander bron_lead_detail); de toets moet die afwijking vinden.
 *
 * Niet gemount (12 okt 2026: de eerste run gaf één keer inspectie @1001 zonder wortel en zonder Clarity-verzoek, bij
 * herhaling groen): ontbreekt de wortel van de flow EN is er geen Clarity-verzoek, dan herhaalt de toets die flow één
 * keer. Blijft het zo, dan is de meting ongeldig (exit 2), geen afwijking van de pagina (exit 1). Positieve controle:
 * een pad zonder landingspagina moet als niet gemount herkend worden, anders exit 2.
 *
 * Draaien:  node scripts/check-lp-payload.mjs                         (start zelf een vite dev-server)
 *           LP_BASIS=http://127.0.0.1:4610 node scripts/check-lp-payload.mjs
 *           LP_PAGINAS=dakwerken LP_BREEDTES=1265,1440,1001,1000,390 node scripts/check-lp-payload.mjs
 * Exit 0 = alles gelijk, 1 = afwijking, 2 = ongeldige meting.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4433;
const FIXTURES = path.join(HIER, 'fixtures', 'lp-payload');
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const VLUCHTIG = new Set(['user_agent', 'submitted_at', 'referrer']);

const ALLE = ['dakwerken', 'richtprijs-berekenen', 'totaalrenovatie', 'aannemer-renovatiewerken'];
const PAGINAS = (process.env.LP_PAGINAS || ALLE.join(',')).split(',').map((s) => s.trim()).filter(Boolean);
/* Standaard: de breedte van de referentie (1265) en de telefoon (390). */
const BREEDTES = (process.env.LP_BREEDTES || '1265,390').split(',').map(Number);

/** Veld voor veld: ontbrekend, extra, andere waarde, andere volgorde. */
export function vergelijk(verwacht, echt) {
  const v = Object.fromEntries(Object.entries(verwacht).filter(([k]) => !VLUCHTIG.has(k)));
  const e = Object.fromEntries(Object.entries(echt || {}).filter(([k]) => !VLUCHTIG.has(k)));
  const uit = [];
  for (const k of Object.keys(v)) {
    if (!(k in e)) uit.push(`veld ${k} ontbreekt (verwacht ${JSON.stringify(v[k])})`);
    else if (JSON.stringify(v[k]) !== JSON.stringify(e[k])) uit.push(`veld ${k}: ${JSON.stringify(e[k])} in plaats van ${JSON.stringify(v[k])}`);
  }
  for (const k of Object.keys(e)) if (!(k in v)) uit.push(`extra veld ${k}: ${JSON.stringify(e[k])}`);
  if (!uit.length && Object.keys(v).join('|') !== Object.keys(e).join('|')) uit.push(`andere volgorde van de velden: ${Object.keys(e).join(',')}`);
  return uit;
}

async function startServer() {
  if (process.env.LP_BASIS) return { basis: process.env.LP_BASIS.replace(/\/$/, ''), stop: () => {} };
  const vite = path.join(HIER, '..', 'node_modules', 'vite', 'bin', 'vite.js');
  const srv = spawn(process.execPath, [vite, '--port', String(POORT), '--strictPort'], { stdio: 'ignore', cwd: path.join(HIER, '..') });
  const basis = `http://localhost:${POORT}`;
  let op = false;
  for (let i = 0; i < 90 && !op; i++) { try { op = (await fetch(basis + '/lp/dakwerken')).ok; } catch { await wacht(500); } }
  if (!op) { try { srv.kill(); } catch { /* */ } console.log('ONGELDIGE METING: dev-server kwam niet op'); process.exit(2); }
  return { basis, stop: () => { try { srv.kill(); } catch { /* */ } } };
}

async function open(browser, basis, url, breedte, marketing, lokaas) {
  const ctx = await browser.createBrowserContext(); // schone opslag per flow (consent, utm, sessionStorage)
  const p = await ctx.newPage();
  const log = { ghl: [], w3f: [], clarity: [], extern: [], fouten: [] };
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' };
    if (/services\.leadconnectorhq\.com|api\.web3forms\.com/.test(u)) {
      if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: cors, body: '' });
      let body = r.postData(); try { body = JSON.parse(body); } catch { /* geen json */ }
      (/leadconnectorhq/.test(u) ? log.ghl : log.w3f).push(body);
      return r.respond({ status: 200, contentType: 'application/json', headers: cors, body: '{}' });
    }
    if (/clarity\.ms/.test(u)) { log.clarity.push(u); return r.respond({ status: 200, contentType: 'application/javascript', body: '' }); }
    if (/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|google\.com\/(pagead|ccm)/.test(u)) return r.respond({ status: 204, body: '' });
    if (/^(tel|mailto):/.test(u)) { log.extern.push(u); return r.abort(); }
    const host = new URL(u).hostname;
    if (!/^(127\.0\.0\.1|localhost)$/.test(host) && r.method() !== 'GET') { log.extern.push(r.method() + ' ' + u); return r.abort(); }
    return r.continue();
  });
  p.on('pageerror', (e) => log.fouten.push(String(e.message || e).slice(0, 200)));
  await p.setViewport({ width: breedte, height: breedte < 500 ? 844 : 900, isMobile: breedte < 500, hasTouch: breedte < 500 });
  await p.evaluateOnNewDocument((m) => { try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: m, ts: Date.now() })); } catch { /* */ } }, marketing);
  if (lokaas) {
    /* Geplante fouten voor de positieve controle: het GHL-verzoek krijgt een ander bron_lead_detail en vertrekt twee keer. */
    await p.evaluateOnNewDocument(() => {
      const echt = window.fetch.bind(window);
      window.fetch = (inv, o) => {
        try { if (String(inv).includes('leadconnectorhq') && o && typeof o.body === 'string') { const b = JSON.parse(o.body); b.bron_lead_detail += ':LOKAAS'; o = { ...o, body: JSON.stringify(b) }; echt(inv, o).catch(() => {}); } } catch { /* */ }
        return echt(inv, o);
      };
    });
  }
  await p.goto(basis + url, { waitUntil: 'networkidle2', timeout: 60000 });
  await wacht(900);
  return { p, ctx, log };
}

/* wacht tot de pagina stilstaat (de scrolfix van de rekenaar scrolt zacht): een muisklik op een bewegende knop mist */
async function stilScroll(p) {
  let vorige = -1;
  for (let i = 0; i < 40; i++) {
    const y = await p.evaluate(() => Math.round(window.scrollY));
    if (y === vorige) return;
    vorige = y; await wacht(120);
  }
}

const klik = (p, sel, tekst) => p.evaluate((sel, tekst) => {
  const b = [...document.querySelectorAll(sel)].find((x) => x.textContent.trim().replace(/\s+/g, ' ').startsWith(tekst));
  if (!b) return false; b.click(); return true;
}, sel, tekst);

async function doeFlow(browser, basis, lp, f, breedte, lokaas = false) {
  const url = lp.pad + (f.query || '') + (f.hash || '');
  const { p, ctx, log } = await open(browser, basis, url, breedte, f.marketing, lokaas);
  const fouten = [];
  try {
    /* Clarity: het juiste project */
    const tag = `https://www.clarity.ms/tag/${lp.clarity}`;
    if (!log.clarity.includes(tag)) fouten.push(`Clarity: geen verzoek naar ${tag} (gezien: ${log.clarity.join(', ') || 'niets'})`);
    if (log.clarity.some((c) => /\/tag\//.test(c) && c !== tag)) fouten.push(`Clarity: verzoek naar een ander project (${log.clarity.join(', ')})`);

    if (f.opener === 'alt') {
      await p.evaluate(() => { const a = [...document.querySelectorAll('.kgj-reken__alt')].pop(); a?.scrollIntoView({ block: 'center' }); a?.click(); });
      await wacht(500);
    }
    if (f.hash) await wacht(500);
    const wortel = f.wortel;
    /* Wortel weg EN geen Clarity-verzoek = de pagina is niet gemount (12 okt: één keer op inspectie @1001, bij herhaling
       groen). Dat is geen afwijking van de pagina maar een mislukte meting: de hoofdlus herhaalt de flow dan één keer. */
    if (!(await p.$(wortel))) { fouten.push(`wortel ${wortel} niet gevonden`); return { fouten, log, ongemount: log.clarity.length === 0 }; }
    if (f.soort === 'inspectie') { await p.evaluate((w) => document.querySelector(w).scrollIntoView({ block: 'center' }), wortel); await wacht(300); }

    for (const a of f.antwoorden || []) {
      let ok = true;
      if (a === '@verder') ok = await p.evaluate((w) => { const b = document.querySelector(w + ' .kgj-reken__verder'); if (!b) return false; b.click(); return true; }, wortel);
      else if (a.startsWith('@vink:')) ok = await klik(p, wortel + ' .kgj-reken__vink', a.slice(6));
      else ok = await klik(p, wortel + ' .kgj-reken__keuze', a);
      if (!ok) { fouten.push(`antwoord "${a}" niet gevonden`); return { fouten, log }; }
      await wacht(260);
    }
    const form = `${wortel} form.kgj-reken__form`;
    if (!(await p.$(form))) { fouten.push(`formulier ${form} niet gevonden na de antwoorden`); return { fouten, log }; }

    /* validatie: leeg en te kort versturen niets */
    const foutTekst = async () => p.evaluate((w) => document.querySelector(w + ' .kgj-reken__fout')?.textContent.trim() ?? null, wortel);
    await p.evaluate((s) => document.querySelector(s + ' button[type=submit]').click(), form);
    await wacht(350);
    const leeg = await foutTekst();
    if (leeg !== f.fouten.leeg) fouten.push(`validatie leeg: "${leeg}" in plaats van "${f.fouten.leeg}"`);
    await p.type(`${form} [name="telefoon"]`, '0400 00');
    await p.evaluate((s) => document.querySelector(s + ' button[type=submit]').click(), form);
    await wacht(350);
    const kort = await foutTekst();
    if (kort !== f.fouten.kort) fouten.push(`validatie < 8 cijfers: "${kort}" in plaats van "${f.fouten.kort}"`);
    if (log.ghl.length || log.w3f.length) fouten.push(`validatie: er vertrok een verzoek bij een ongeldig nummer (${log.ghl.length} GHL, ${log.w3f.length} Web3Forms)`);
    await p.evaluate((s) => { const i = document.querySelector(s + ' [name="telefoon"]'); i.focus(); i.select(); }, form);
    await p.keyboard.press('Backspace');

    /* velden zoals de referentie */
    for (const [naam, waarde] of Object.entries(f.velden)) {
      if (naam === '@pg') {
        await p.type(`${form} .kgj-pg input[type=text]`, waarde, { delay: 30 });
        await wacht(600);
        /* zoals de referentiemeting: geen deelgemeente gekozen, de voorstellenlijst dicht (Escape), dan het veld uit */
        await p.keyboard.press('Escape');
        await p.evaluate(() => document.activeElement?.blur());
        await wacht(150);
        continue;
      }
      const tag = await p.$eval(`${form} [name="${naam}"]`, (e) => e.tagName).catch(() => null);
      if (!tag) { fouten.push(`veld ${naam} niet gevonden`); continue; }
      if (tag === 'SELECT') await p.select(`${form} [name="${naam}"]`, waarde);
      else await p.type(`${form} [name="${naam}"]`, waarde);
    }

    /* dubbelklik: precies één lead */
    await p.$eval(`${form} button[type=submit]`, (b) => b.scrollIntoView({ block: 'center' }));
    await stilScroll(p);
    const knop = await p.$(`${form} button[type=submit]`);
    await knop.click({ count: 2, delay: 20 });
    await wacht(2000);
    if (log.ghl.length !== 1 || log.w3f.length !== 1) fouten.push(`aantal verzoeken na dubbelklik: ${log.ghl.length} GHL en ${log.w3f.length} Web3Forms (verwacht 1 en 1)`);
    for (const d of vergelijk(f.ghl, log.ghl[0])) fouten.push('GHL ' + d);
    for (const d of vergelijk(f.web3forms, log.w3f[0])) fouten.push('Web3Forms ' + d);

    /* form_start */
    const starts = await p.evaluate(() => [...new Set((window.dataLayer || []).map((a) => { try { const x = Array.from(a); return x[0] === 'event' && x[1] === 'form_start' ? x[2]?.method : null; } catch { return null; } }).filter(Boolean))]);
    if (!starts.includes(f.formStart)) fouten.push(`trackFormStart: "${f.formStart}" niet in de dataLayer (wel: ${starts.join(', ') || 'niets'})`);
    if (starts.some((s) => s !== f.formStart)) fouten.push(`trackFormStart: ander label erbij (${starts.join(', ')})`);

    /* toestemming en bedankt */
    const st = await p.evaluate(() => ({ url: location.pathname + location.search, toestemming: !!document.querySelector('.kgj-toestemming') }));
    let bedankt = st.url;
    if (f.toestemming) {
      if (!st.toestemming) fouten.push(`Toestemming: de stap verscheen niet (url ${st.url})`);
      else { await klik(p, '.kgj-toestemming__knoppen button', 'Liever niet'); await wacht(1200); bedankt = await p.evaluate(() => location.pathname + location.search); }
    } else if (st.toestemming) fouten.push('Toestemming: de stap verscheen terwijl er marketingtoestemming was');
    if (bedankt !== f.bedankt) fouten.push(`bedankt: ${bedankt} in plaats van ${f.bedankt}`);
    if (log.extern.length) fouten.push(`verzoek naar buiten tegengehouden: ${log.extern.join(', ')}`);
    if (log.fouten.length) fouten.push(`paginafout: ${log.fouten.join(' | ')}`);
    return { fouten, log };
  } finally {
    await ctx.close();
  }
}

(async () => {
  const fixtures = {};
  for (const slug of PAGINAS) {
    const bestand = path.join(FIXTURES, slug + '.json');
    if (!fs.existsSync(bestand)) { console.log(`ONGELDIGE METING: referentie ontbreekt (${bestand})`); process.exit(2); }
    fixtures[slug] = JSON.parse(fs.readFileSync(bestand, 'utf8'));
    if (!fixtures[slug].flows?.length) { console.log(`ONGELDIGE METING: referentie zonder flows (${slug})`); process.exit(2); }
  }
  /* vergelijker zelf: een geplante afwijking moet gevonden worden */
  const proef = vergelijk({ a: 1, b: 'x' }, { a: 1, b: 'y', c: 2 });
  if (proef.length !== 2) { console.log('ONGELDIGE METING: de vergelijker vindt de geplante afwijking niet'); process.exit(2); }

  const server = await startServer();
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] });
  const fouten = [];
  let flows = 0, leads = 0, ongeldig = null;
  try {
    /* positieve controle, end-to-end: geplante fout in de pagina */
    const eerste = fixtures[PAGINAS[0]];
    const pc = await doeFlow(browser, server.basis, eerste, eerste.flows[0], BREEDTES[0], true);
    const gevonden = pc.fouten.filter((x) => /bron_lead_detail.*LOKAAS/.test(x));
    const dubbel = pc.fouten.filter((x) => /aantal verzoeken na dubbelklik: 2 GHL/.test(x));
    if (!gevonden.length || !dubbel.length) { console.log(`ONGELDIGE METING: positieve controle vond de geplante fout niet (${pc.fouten.join(' | ') || 'geen afwijking'})`); process.exit(2); }
    console.log(`positieve controle: geplante fouten gevonden ("${gevonden[0]}"; "${dubbel[0]}")`);
    /* positieve controle op de herkenning van een niet-gemounte pagina: een pad zonder LP moet als ongemount tellen */
    const leegPc = await doeFlow(browser, server.basis, { ...eerste, pad: '/lp/__geen-landingspagina__' }, eerste.flows[0], BREEDTES[0]);
    if (!leegPc.ongemount) { console.log(`ONGELDIGE METING: positieve controle herkent een niet-gemounte pagina niet (${leegPc.fouten.join(' | ') || 'geen afwijking'})`); process.exit(2); }
    console.log('positieve controle: een pagina zonder LP telt als niet gemount (geen wortel, geen Clarity)');

    for (const slug of PAGINAS) {
      if (ongeldig) break;
      const lp = fixtures[slug];
      for (const breedte of BREEDTES) {
        if (ongeldig) break;
        for (const f of lp.flows) {
          const label = `${lp.pad} ${f.naam} @${breedte}`;
          let r = await doeFlow(browser, server.basis, lp, f, breedte);
          if (r.ongemount) {
            console.log(`  HERHAAL ${label}: pagina niet gemount (geen wortel, geen Clarity-verzoek)`);
            r = await doeFlow(browser, server.basis, lp, f, breedte);
            if (r.ongemount) { ongeldig = `${label}: twee keer niet gemount (geen wortel ${f.wortel}, geen Clarity-verzoek)`; break; }
          }
          flows++; leads += r.log.ghl.length;
          if (r.fouten.length) r.fouten.forEach((x) => fouten.push(`${label}: ${x}`));
          else console.log(`  AF  ${label}: payload GHL + Web3Forms gelijk, ${f.formStart}, ${f.toestemming ? 'Toestemming' : 'geen Toestemming'}, ${f.bedankt}, Clarity ${lp.clarity}`);
        }
      }
    }
  } finally {
    await browser.close();
    server.stop();
  }
  if (ongeldig) { console.log(`ONGELDIGE METING: ${ongeldig}`); process.exit(2); }
  if (!flows || !leads) { console.log('ONGELDIGE METING: geen enkele lead onderschept'); process.exit(2); }
  console.log(`check-lp-payload: ${flows} flows, ${leads} onderschepte GHL-leads (nul echte), ${PAGINAS.length} LP's x ${BREEDTES.length} breedtes (${server.basis})`);
  if (fouten.length) { fouten.forEach((x) => console.log('  FOUT: ' + x)); process.exit(1); }
  console.log('  elke lead is veld voor veld gelijk aan de referentie van de huidige LP');
  process.exit(0);
})().catch((e) => { console.log('ONGELDIGE METING: ' + e.message); process.exit(2); });
