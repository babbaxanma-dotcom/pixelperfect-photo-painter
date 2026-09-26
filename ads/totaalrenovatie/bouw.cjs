/**
 * Totaalrenovatie-campagne AB Bouw (Google Ads), gebouwd op 26 sep 2026. NOG NIET ONLINE:
 * Mohammed: "Alles mag ingesteld worden, maar nog niet online zetten."
 *
 * Landingspagina: /lp/totaalrenovatie (vorm van /lp/dakwerken, calculator in de hero).
 *
 * Waar de hoeken vandaan komen (ads/totaalrenovatie/ads-v2.cjs, meting 15 sep, 129
 * advertenties van 38 adverteerders, plus Transparency Center 25 sep):
 *   vol, dus niet gebruikt:  "één aanspreekpunt / A tot Z" (15 van 38), "ontzorgen" (13),
 *                            "X jaar ervaring" (11)
 *   leeg en bewezen:         6% btw of premie (1 van 38, Kijzer 328 dagen), eigen personeel
 *                            (2 van 38, Tifre 771 dagen), prijs berekenen (3 van 38, Rinovato)
 *   het zoekwoord als kop:   Rinovato, 477 dagen: "Aannemer Totaalrenovatie",
 *                            "{KeyWord:Aannemer in jouw buurt}", "Renoveren met 1 Totaalaannemer"
 * Niet gebruikt: "inclusief EPC-attest". AB levert dat nergens; een EPC-attest maakt een
 * energiedeskundige. Wel: "inclusief premiebegeleiding" (op de pagina: "Wij regelen de
 * aanvraag van uw Mijn VerbouwPremie").
 *
 * Dit script faalt (exit 1) als een tekst te lang is, een verboden zinsbouw of een getal
 * zonder bron op de pagina bevat, een kop dubbel staat, of een uitsluiting een eigen
 * zoekwoord blokkeert. Het toetst ook de 681 uitsluitingen van de dakcampagne, zodat
 * zichtbaar is wat een kopie van die campagne zou blokkeren.
 *
 * Draaien: node ads/totaalrenovatie/bouw.cjs
 */
const fs = require('fs');
const path = require('path');
const MAP = __dirname;

const CAMPAGNE = 'AB Bouw — Totaalrenovatie — Search';
const URL = 'https://www.abgroep.be/lp/totaalrenovatie';

/* ---------- Instellingen (door Claude beslist, Mohammed keurt) ---------- */
const INSTELLINGEN = {
  status: 'Onderbroken',
  budgetPerDag: 40,            // zie BUDGET hieronder
  bieding: 'Klikken maximaliseren, max. CPC € 8',
  netwerk: 'Alleen Google Zoeken (geen zoekpartners, geen Display)',
  aiMax: 'uit', breedZoeken: 'uit',
  taal: 'Nederlands',
  locatie: 'Dezelfde 42 gemeenten als de dakcampagne (arrondissementen Antwerpen en Mechelen, Beveren-Kruibeke-Zwijndrecht), stad Antwerpen uitgesloten (Bardh, 23 sep), optie Aanwezigheid',
  doelen: 'Leadformulieren, Leads van telefoongesprekken, Offertes aanvragen (zoals dak)',
  urlAchtervoegsel: 'utm_source=google&utm_medium=cpc&utm_campaign=totaalrenovatie&utm_term={keyword}',
};

/* ---------- Zoekwoorden: twee groepen op zoekintentie ---------- */
// w = woordgroep, e = exact. Geen breed zoeken.
const GROEPEN = {
  'Totaalrenovatie': {
    kern: 'totaalrenovatie',
    zoekwoorden: [
      ['totaalrenovatie', 'w'], ['totaalrenovatie', 'e'], ['totaalrenovatie woning', 'w'], ['totaalrenovatie huis', 'w'],
      ['woning volledig renoveren', 'w'], ['huis volledig renoveren', 'w'], ['aannemer totaalrenovatie', 'w'],
      ['renovatie aannemer', 'w'], ['aannemer renovatie', 'w'], ['algemene aannemer renovatie', 'w'],
      ['aannemer verbouwing', 'w'], ['huis gekocht renoveren', 'w'], ['oude woning renoveren', 'w'],
      ['woning strippen en renoveren', 'w'], ['renovatiebedrijf', 'w'], ['renovatie woning', 'w'], ['huis renoveren', 'w'],
    ],
    pad: ['totaal', 'renovatie'],
    koppen: [
      'Totaalrenovatie van uw woning',   // positie 1, gepind met de KeyWord-kop
      '{KeyWord:Aannemer totaalrenovatie}',
      'Renoveren met eigen ploegen',
      'AB Bouw Groep: renovatie',
      'Bereken uw prijs in 2 minuten',
      '6% btw bij woning 10+ jaar',
      'Hulp bij Mijn VerbouwPremie',
      'Gratis plaatsbezoek en offerte',
      'VCA-gecertificeerd, verzekerd',
      'Eén planning voor alle werken',
      'Ruwbouw en afwerking in huis',
      'Totaalrenovatie in {LOCATION(City):uw regio}',
      'Huis gekocht om te renoveren?',
      'Transparante offerte',
      'Offerte per onderdeel',
    ],
    beschrijvingen: [
      'Bereken in 2 minuten de prijs van uw renovatie. Gratis plaatsbezoek en offerte.',
      'Onze eigen ploegen doen elk vak, volgens één planning. VCA-gecertificeerd en verzekerd.',
      'Woning ouder dan tien jaar? Dan geldt 6% btw. Wij regelen uw Mijn VerbouwPremie.',
      'U krijgt de volledige prijs op papier, met per onderdeel wat erin zit.',
    ],
  },
  'Prijs renovatie': {
    kern: 'renovatie',
    zoekwoorden: [
      ['renovatie kostprijs', 'w'], ['kostprijs totaalrenovatie', 'w'], ['prijs totaalrenovatie', 'w'],
      ['wat kost een huis renoveren', 'w'], ['wat kost een totaalrenovatie', 'w'], ['huis renoveren prijs', 'w'],
      ['woning renoveren kostprijs', 'w'], ['renovatie prijs per m2', 'w'], ['renovatiekosten berekenen', 'w'],
      ['prijs huis renoveren', 'w'], ['kostprijs renovatie woning', 'w'], ['totaalrenovatie prijs', 'w'],
    ],
    pad: ['prijs', 'renovatie'],
    koppen: [
      'Wat kost uw totaalrenovatie?',     // positie 1, gepind met de KeyWord-kop
      '{KeyWord:Prijs totaalrenovatie}',
      'Bereken uw renovatieprijs',
      'Prijs in 2 minuten berekend',
      'AB Bouw Groep: totaalrenovatie',
      '6% btw voor woning 10+ jaar',
      'Inclusief premiebegeleiding',
      'Gratis plaatsbezoek',
      'Elke post apart op papier',
      'Eigen ploegen voor elk vak',
      'Renovatie in {LOCATION(City):uw regio}',
      'Wat kost een huis renoveren?',
      'Kostprijs renovatie woning',
      'VCA-attest en verzekerd',
      'Strikte planning',
    ],
    beschrijvingen: [
      'Wat kost uw renovatie? Beantwoord zes korte vragen op onze website. Klaar in 2 minuten.',
      'Gratis plaatsbezoek: we bekijken uw woning en u krijgt een vrijblijvende offerte.',
      'Woning ouder dan tien jaar? 6% btw, en wij regelen de aanvraag van uw premie.',
      'Eigen ploegen voor ruwbouw en afwerking, volgens één planning. VCA en verzekerd.',
    ],
  },
};

/* ---------- Componenten op campagneniveau ---------- */
const SITELINKS = [
  { tekst: 'Bereken uw renovatieprijs', r1: 'Klaar in 2 minuten', r2: 'Gratis en vrijblijvend', url: URL + '#rekenaar' },
  { tekst: 'Gratis plaatsbezoek', r1: 'We bekijken uw woning ter plaatse', r2: 'Daarna een vrijblijvende offerte', url: URL + '#contact' },
  { tekst: 'Onze diensten', r1: 'Afbraak en ruwbouw', r2: 'Pleisterwerk en interieur', url: URL + '#diensten' },
  { tekst: 'Zo verloopt uw renovatie', r1: 'In vijf duidelijke stappen', r2: 'U weet vooraf wat er gebeurt', url: URL + '#werkwijze' },
  { tekst: 'Voor en na', r1: 'Dezelfde uitbouw, voor en na', r2: 'Een werf van AB Bouw Groep', url: URL + '#voorna' },
  { tekst: '6% btw en premies', r1: '6% btw bij woning 10+ jaar', r2: 'Hulp bij Mijn VerbouwPremie', url: URL + '#waarom' },
];
const HIGHLIGHTS = ['Gratis plaatsbezoek', 'Eigen ploegen', 'VCA-gecertificeerd', 'Volledig verzekerd', 'Offerte per onderdeel',
  'Premiebegeleiding', '6% btw vanaf 10 jaar', 'Prijs in 2 minuten'];
const SNIPPETS = [
  { kop: 'Services', waarden: ['Afbraak en ruwbouw', 'Technieken', 'Pleisterwerk', 'Vloeren en tegels', 'Interieur'] },
];

/* ---------- Uitsluitingen van deze campagne ---------- */
// [tekst, type] met type w (woordgroep) of e (exact). Omgekeerde bewijslast (CLAUDE.md):
// alleen woorden waarvan vaststaat dat geen koper van een totaalrenovatie ze typt.
const UITSLUITEN = [
  // uit 3-negatives.csv (15 sep)
  ['zelf renoveren', 'w'], ['doe het zelf', 'w'], ['stappenplan', 'w'], ['checklist', 'w'], ['opleiding', 'w'],
  ['cursus', 'w'], ['vacature', 'w'], ['jobs', 'w'], ['stage', 'w'], ['loon', 'w'], ['renovatielening', 'w'],
  ['hypotheek', 'w'], ['immoweb', 'w'], ['zimmo', 'w'], ['te huur', 'w'], ['nederland', 'w'], ['wallonie', 'w'],
  ['charleroi', 'w'], ['forum', 'w'], ['klachten', 'w'], ['failliet', 'w'], ['wikipedia', 'w'], ['betekenis', 'w'],
  ['tweedehands', 'w'], ['containerwoning', 'w'], ['mobilhome', 'w'], ['caravan', 'w'],
  // 26 sep: deelwerken met een eigen pagina of een kleine opdracht, en andere bestemmingen
  ['badkamer', 'w'], ['keuken', 'w'], ['dak', 'w'], ['dakwerken', 'w'], ['gevel', 'w'], ['schilder', 'w'],
  ['schilderwerken', 'w'], ['behangen', 'w'], ['laminaat', 'w'], ['parket leggen', 'w'], ['kantoor', 'w'],
  ['winkel', 'w'], ['horeca', 'w'], ['kerk', 'w'], ['school', 'w'], ['gemeente', 'w'], ['subsidie aanvragen', 'w'],
  ['renovatieplicht', 'w'], ['epc', 'w'], ['energiescan', 'w'], ['architect', 'w'], ['tekenaar', 'w'],
  ['gratis', 'e'], ['goedkoop', 'w'], ['goedkoopste', 'w'], ['zwart', 'w'], ['in het zwart', 'w'],
];

/* ---------- Budget (Mohammed: "het dagbudget mag je ook bepalen") ----------
   Zoekwoordplanner 26 sep, België, gemiddeld per maand: totaalrenovatie 880, renovatie woning 210,
   huis renoveren 480, renovatie aannemer 390; bod bovenaan €1,60 (laag) en €6,83 (hoog).
   Klikprijs voor de rekensom: €4,22 (midden van die twee). €40 per dag = 9 klikken per dag.
   Benchmark bouw/aannemers (LocaliQ 2025): 1 lead per 31 klikken. Dan 1 lead per 3,4 dagen,
   kost per lead €131. Zie het rapport voor de meetregel. */
const BUDGET = { perDag: INSTELLINGEN.budgetPerDag, klikprijs: 4.22, klikkenPerLead: 31 };

/* ---------- Toetsen ---------- */
const tok = (s) => s.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôöùûüç² ]/g, ' ').split(/\s+/).filter(Boolean);
function blokkeert(neg, type, query) {
  const n = tok(neg), q = tok(query);
  if (type === 'e') return n.join(' ') === q.join(' ');
  if (type === 'b') return n.every((t) => q.includes(t));
  for (let i = 0; i + n.length <= q.length; i++) if (n.every((t, j) => q[i + j] === t)) return true;
  return false;
}
const fouten = [];
/* Positieve controle op de blokkeertoets. */
for (const [n, ty, q, verwacht] of [['badkamer', 'w', 'badkamer renoveren prijs', true], ['dak', 'w', 'totaalrenovatie woning', false], ['gratis', 'e', 'gratis offerte renovatie', false]]) {
  if (blokkeert(n, ty, q) !== verwacht) { console.error(`TOETS DEFECT op "${n}" / "${q}"`); process.exit(2); }
}
for (const [naam, g] of Object.entries(GROEPEN)) for (const [kw] of g.zoekwoorden) for (const [t, ty] of UITSLUITEN) {
  if (blokkeert(t, ty, kw)) fouten.push(`uitsluiting "${t}" blokkeert eigen zoekwoord "${kw}" (${naam})`);
}
/* Koperzoekopdrachten die NIET geblokkeerd mogen worden. */
const KOPER = ['totaalrenovatie woning prijs', 'aannemer totaalrenovatie antwerpen', 'wat kost een totaalrenovatie per m2', 'huis gekocht volledig renoveren',
  'renovatie oude woning kostprijs', 'totaalrenovatie offerte', 'renovatie woning 6 btw', 'aannemer renovatie in de buurt', 'woning renoveren premie'];
for (const q of KOPER) for (const [t, ty] of UITSLUITEN) if (blokkeert(t, ty, q)) fouten.push(`uitsluiting "${t}" blokkeert koper "${q}"`);

const VERBODEN = [
  { re: /zonder (gedoe|stress|zorgen)|ontzorg|zorgeloos/i, waarom: '13 van de 38 concurrenten zeggen dit al' },
  { re: /van a ?(tot|-) ?z|één aanspreekpunt|1 aanspreekpunt/i, waarom: '15 van de 38 concurrenten zeggen dit al' },
  { re: /\bpartner\b/i, waarom: 'meest gebruikte woord in de markt' },
  { re: /\b(geen|niet|zonder|nooit)\b/i, waarom: 'negatie-framing' },
  { re: /nr\.? ?1|#1|beste|sterren|review/i, waarom: 'claim die AB niet kan dragen (1 Google-review)' },
  { re: /!/, waarom: 'geen uitroepteken op search' },
  { re: /\bepc\b/i, waarom: 'EPC-attest levert AB niet' },
  { re: /\b(?!EPDM\b|VCA\b)[A-Z]{4,}\b/, waarom: 'geen hoofdletterwoorden' },
  { re: /\b(rond|omgeving|regio|provincie|antwerpen|mechelen|brasschaat|schilde|schoten|wilrijk|vlaanderen)\b/i, waarom: 'plaatsnaam in de tekst; gebruik {LOCATION(City):uw regio}', zonderLocatie: true },
];
const INVOEGING = /\{LOCATION\(City\):([^}]*)\}|\{KeyWord:([^}]*)\}/g;
// Elk getal moet op /lp/totaalrenovatie staan (inhoud-totaalrenovatie.ts).
const TOEGESTAAN_GETAL = [/\b2 minuten\b/, /6%/, /\b(10|tien) jaar\b/i, /\b10\+ jaar\b/, /\bzes\b/i];
function toets(tekst, max, soort) {
  const zichtbaar = tekst.replace(INVOEGING, (_, loc, kw) => loc ?? kw);
  if (/\{(?!KeyWord:|LOCATION\(City\):)[^}]*\}/.test(tekst)) fouten.push(`${soort} "${tekst}": onbekende invoeging`);
  if (zichtbaar.length > max) fouten.push(`${soort} ${zichtbaar.length}/${max} tekens: "${tekst}"`);
  const zonder = tekst.replace(INVOEGING, '');
  for (const v of VERBODEN) if (v.re.test(v.zonderLocatie ? zonder : zichtbaar)) fouten.push(`${soort} "${tekst}": ${v.waarom}`);
  if (/\d/.test(zichtbaar) && !TOEGESTAAN_GETAL.some((re) => re.test(zichtbaar))) fouten.push(`${soort} "${tekst}": getal zonder bron op de landingspagina`);
}
const alleKoppen = new Map();
for (const [naam, g] of Object.entries(GROEPEN)) {
  if (g.koppen.length !== 15) fouten.push(`${naam}: ${g.koppen.length} koppen, verwacht 15`);
  if (g.beschrijvingen.length !== 4) fouten.push(`${naam}: ${g.beschrijvingen.length} beschrijvingen, verwacht 4`);
  const vragen = g.koppen.filter((k) => k.includes('?')).length;
  if (vragen > 7) fouten.push(`${naam}: ${vragen} vraagkoppen`);
  for (const k of g.koppen) {
    toets(k, 30, `kop (${naam})`);
    const al = alleKoppen.get(k.toLowerCase());
    if (al) fouten.push(`kop "${k}" staat in ${al} en ${naam}`);
    alleKoppen.set(k.toLowerCase(), naam);
  }
  for (const b of g.beschrijvingen) toets(b, 90, `beschrijving (${naam})`);
  for (const p of g.pad) if (p.length > 15) fouten.push(`pad "${p}" te lang`);
  if (!g.koppen[0].toLowerCase().includes(g.kern)) fouten.push(`${naam}: kop 1 draagt het zoekwoord "${g.kern}" niet`);
}
for (const s of SITELINKS) { toets(s.tekst, 25, 'sitelink'); toets(s.r1, 35, 'sitelinkregel'); toets(s.r2, 35, 'sitelinkregel'); }
if (new Set(SITELINKS.map((s) => s.url)).size !== SITELINKS.length) fouten.push('twee sitelinks met dezelfde URL');
for (const h of HIGHLIGHTS) toets(h, 25, 'highlight');
for (const s of SNIPPETS) for (const w of s.waarden) toets(w, 25, `snippet ${s.kop}`);
{ const voor = fouten.length; toets('{KeyWord:Dit is een veel te lange standaardkop}', 30, 'controle'); if (fouten.length === voor) { console.error('TOETS DEFECT: KeyWord-lengte'); process.exit(2); } fouten.pop(); }

/* ---------- Wat een kopie van de dakcampagne zou blokkeren ---------- */
const DAK = require('../dakwerken/negatives-bron.cjs');
const dakNegs = [];
for (const lijst of Object.values(DAK)) for (const [t, ty] of lijst) dakNegs.push([t, ty]);
const dakBlok = [];
for (const [naam, g] of Object.entries(GROEPEN)) for (const [kw] of g.zoekwoorden) for (const [t, ty] of dakNegs) if (blokkeert(t, ty, kw)) dakBlok.push(`"${kw}" <- dak-uitsluiting "${t}" (${ty})`);

if (fouten.length) { for (const f of fouten) console.error('FOUT: ' + f); process.exit(1); }

/* ---------- Plak-klare lijsten ---------- */
const plak = (t, ty) => (ty === 'e' ? `[${t}]` : `"${t}"`);
for (const [naam, g] of Object.entries(GROEPEN)) {
  const slug = naam.toLowerCase().replace(/\s+/g, '-');
  fs.writeFileSync(path.join(MAP, `1-zoekwoorden-${slug}.txt`), g.zoekwoorden.map(([t, ty]) => plak(t, ty)).join('\n') + '\n');
}
fs.writeFileSync(path.join(MAP, '2-uitsluiten-campagne.txt'), UITSLUITEN.map(([t, ty]) => plak(t, ty)).join('\n') + '\n');
fs.writeFileSync(path.join(MAP, '3-advertenties.json'), JSON.stringify({ campagne: CAMPAGNE, url: URL, instellingen: INSTELLINGEN, budget: BUDGET, groepen: GROEPEN, sitelinks: SITELINKS, highlights: HIGHLIGHTS, snippets: SNIPPETS }, null, 2) + '\n');

const nKw = Object.values(GROEPEN).reduce((s, g) => s + g.zoekwoorden.length, 0);
console.log(`Groen. ${nKw} zoekwoorden in ${Object.keys(GROEPEN).length} groepen, ${UITSLUITEN.length} uitsluitingen, ${KOPER.length} koperzoekopdrachten vrij.`);
console.log(`Budget €${BUDGET.perDag}/dag = ${Math.floor(BUDGET.perDag / BUDGET.klikprijs)} klikken/dag; 1 lead per ${BUDGET.klikkenPerLead} klikken = 1 lead per ${(BUDGET.klikkenPerLead / (BUDGET.perDag / BUDGET.klikprijs)).toFixed(1)} dagen, €${Math.round(BUDGET.klikkenPerLead * BUDGET.klikprijs)} per lead.`);
console.log(`Een kopie van de dakcampagne zou ${dakBlok.length} eigen zoekwoorden blokkeren${dakBlok.length ? ':\n  ' + dakBlok.join('\n  ') : '.'}`);
