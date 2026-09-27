/**
 * Stap 3: per tekstadvertentie de velden (kop, beschrijving, sitelinks,
 * extensies) uit OCR of content.js-preview, en alles samen in concurrenten.json.
 *
 * Bronnen:
 *  - raw/<slug>.json         metadata uit SearchCreatives (stap 1, 27 sep 2026)
 *  - OCR=<pad>/ocr.json      Windows-OCR van de simgad-schermafdrukken (4-ocr.ps1)
 *  - CACHE/html/<cr>.html    ontsleutelde content.js-previews (stap 2)
 *  - controle.json           visueel nagelezen koppen/beschrijvingen (optioneel);
 *                            die winnen van de OCR.
 *
 * Actief = laatst getoond op of na 2026-09-20.
 * Draaien: CACHE=<map> OCR=<ocr.json> node 3-structuur.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { uitOcr, uitHtml } = require('./parsers.cjs');

const RAW = path.join(__dirname, 'raw');
const OCR = JSON.parse(fs.readFileSync(process.env.OCR, 'utf8').replace(/^﻿/, ''));
const CONTROLE_F = path.join(__dirname, 'controle.json');
const CONTROLE = fs.existsSync(CONTROLE_F) ? JSON.parse(fs.readFileSync(CONTROLE_F, 'utf8')) : {};
const GRENS = '2026-09-20';

const adverteerders = [];
const advertenties = [];
for (const f of fs.readdirSync(RAW).filter((x) => x.endsWith('.json'))) {
  const st = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
  const uniek = new Map();
  for (const d of Object.values(st.doelen)) for (const c of d.creatives) uniek.set(c.cr, c);
  const alle = [...uniek.values()];
  const formaten = {};
  for (const c of alle) {
    const k = c.formaat + (c.laatst && c.laatst >= GRENS ? ' actief' : ' gestopt');
    formaten[k] = (formaten[k] || 0) + 1;
  }
  adverteerders.push({
    adverteerder: st.speler, soort: st.soort, serpAdvertenties15sep: st.serp,
    domeinen: Object.keys(st.doelen).map((k) => k.replace('domein:', '')),
    googleNamen: [...new Set(alle.map((c) => `${c.adverteerder} (${c.adverteerderId})`))],
    creativesOpgehaald: alle.length,
    totaalVolgensGoogle: Object.values(st.doelen).map((d) => d.totaal),
    volledig: Object.values(st.doelen).every((d) => d.klaar),
    gestoptOpGrens: Object.values(st.doelen).some((d) => d.gestoptOpGrens),
    formaten,
  });
  for (const c of alle.filter((x) => x.formaat === 'tekst')) {
    let inhoud;
    if (c.beeld && /simgad/.test(c.beeld)) inhoud = OCR[c.cr] ? uitOcr(OCR[c.cr], c.formaat) : { bron: 'ocr', fout: 'geen ocr' };
    else if (c.preview) inhoud = uitHtml(c.cr, c.formaat);
    else inhoud = { bron: 'geen', fout: 'geen inhoud' };
    const ctl = CONTROLE[c.cr];
    if (ctl) inhoud = { ...inhoud, ...ctl, bron: inhoud.bron + '+visueel' };
    advertenties.push({
      adverteerder: st.speler, soort: st.soort, adverteerderGoogle: c.adverteerder, adverteerderId: c.adverteerderId, cr: c.cr,
      eerst: c.eerst, laatst: c.laatst, dagen: c.looptijdDagen, dagenGetoond: c.dagenGetoond,
      actief: !!(c.laatst && c.laatst >= GRENS),
      kop: inhoud.kop || null, koppen: inhoud.koppen || [], beschrijving: inhoud.beschrijving || null,
      sitelinks: inhoud.sitelinks || [], extensies: (inhoud.extensies || []).map((e) => `[${e.soort}] ${e.tekst}`),
      weergaveUrl: inhoud.weergaveUrl || null, naamInAdvertentie: inhoud.naam || null,
      bron: inhoud.bron, fout: inhoud.fout || null,
      link: `https://adstransparency.google.com/advertiser/${c.adverteerderId}/creative/${c.cr}?region=BE`,
    });
  }
}
advertenties.sort((a, b) => (b.actief - a.actief) || (b.dagen || 0) - (a.dagen || 0));

const uit = {
  bron: 'Google Ads Transparency Center, SearchService/SearchCreatives, regio BE (2056), filter op domein',
  oogst: '2026-09-27',
  actiefRegel: `laatst getoond op of na ${GRENS}`,
  dagenRegel: 'dagen = laatst getoond min eerst getoond (kalenderdagen); dagenGetoond = aantal dagen met vertoning volgens Google (veld 13)',
  inhoudRegel: 'bron ocr = Windows-OCR van de gearchiveerde schermafdruk; html = content.js-preview; +visueel = kop en beschrijving nagelezen op de schermafdruk',
  adverteerders, aantal: advertenties.length, advertenties,
};
fs.writeFileSync(path.join(__dirname, 'concurrenten.json'), JSON.stringify(uit, null, 1));
const tel = {};
for (const a of advertenties) { const k = `${a.adverteerder}${a.actief ? ' actief' : ''}`; tel[k] = (tel[k] || 0) + 1; }
console.log(`${advertenties.length} tekstadvertenties, ${advertenties.filter((a) => a.actief).length} actief, ${advertenties.filter((a) => a.fout).length} met fout`);
console.log(JSON.stringify(tel, null, 0));
