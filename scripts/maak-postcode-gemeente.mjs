#!/usr/bin/env node
/*
 * maak-postcode-gemeente.mjs: elke Belgische postcode -> de naam van haar HUIDIGE gemeente, in het Nederlands.
 *
 * Bron en datum: 23 nov 2026.
 *  - bpost-lijst postcode -> plaatsnaam: src/data/postcodes-be.json (deelgemeenten, soms ook de Franse naam).
 *  - OpenStreetMap (c) OpenStreetMap-bijdragers, ODbL, via Overpass (https://overpass-api.de/api/interpreter):
 *    gemeenten (boundary=administrative, admin_level=8) en deelgemeenten (admin_level=9) per provincie/gewest,
 *    met de fusies van 1 jan 2025 (bv. Beveren-Kruibeke-Zwijndrecht, Tongeren-Borgloon, Pajottegem, Borsbeek -> Antwerpen),
 *    en plaatsknopen (place=*) voor plaatsnamen die in OSM geen deelgemeente zijn (bv. Laken, Wijgmaal).
 *
 * Uitvoer: JSON-object {"2830":"Willebroek", ...} met elke postcode uit de bpost-lijst, naar
 *  - abgroep-vaklogo/src/data/postcode-gemeente.json
 *  - inzicht-formulier/data/postcode-gemeente.json
 * Naam = name:nl van de OSM-gemeente, anders name.
 *
 * Koppelregel:
 *  1. Deelgemeente -> gemeente: per gemeente telt Overpass hoeveel grenslijnen van elke deelgemeente BINNEN de gemeente liggen;
 *     de deelgemeente hoort bij de gemeente met de hoogste verhouding binnen/totaal. Een deelgemeente zonder lijn binnenin
 *     (gemeente met maar een deelgemeente) hoort bij de gemeente met dezelfde naam.
 *  2. Namen vergelijken na normaliseren (kleine letters, zonder accenten en leestekens). Kandidaat-gemeenten van postcode P =
 *     gemeenten waarvan de eigen naam of de naam van een deelgemeente (name, name:nl, name:fr, name:de) gelijk is aan een
 *     plaatsnaam van P. Ook als variant: dezelfde naam zonder toevoeging ("Beveren-Leie" = "Beveren", "Sinaai-Waas" = "Sinaai",
 *     "Hérinnes-lez-Pecq" = "Hérinnes").
 *  3. Ankers van gemeente G = de postcodes waar G de meeste plaatsnamen heeft (alleen exacte namen, geen gelijkspel).
 *     Afstand(P, G) = kleinste verschil tussen P en een ander anker van G; "blok" = een ander anker in hetzelfde tiental (879x).
 *  4. Keuze: de meeste plaatsnamen van P; bij gelijkspel: anker in hetzelfde blok, dan afstand hoogstens 100, dan eigen naam
 *     als plaatsnaam van P, dan exacte naam boven variant, dan de eigen naam die het minst vaak elders voorkomt, dan de kleinste
 *     afstand. De winnaar telt alleen met eigen naam, met 2+ plaatsnamen, met een anker in het blok of binnen 200.
 *  5. Lukt dat niet: dezelfde plaatsnamen opzoeken als plaatsknoop (place=*) in OSM, in alt_name/old_name/official_name, als deel
 *     van een dubbele naam ("Évegnée-Tignée") of met een letter verschil; de gemeente rond die knoop telt als kandidaat;
 *     keuze = de meeste namen, dan blok, dan kleinste afstand tot de al gekoppelde postcodes van die gemeente (hoogstens 200),
 *     van laag naar hoog.
 *  6. Lukt ook dat niet: de Nederlandse plaatsnaam uit de bpost-lijst, en de postcode staat in "niet gekoppeld" in het verslag.
 * Controle: de steekproef onderaan moet kloppen en minstens 98 % moet gekoppeld zijn, anders schrijft het script niets weg.
 *
 * Gebruik: node scripts/maak-postcode-gemeente.mjs [--cache <map>] [--inzicht <map van inzicht-formulier>] [--droog]
 *   --cache <map>  bewaart de ruwe Overpass-antwoorden in <map> en hergebruikt ze bij een volgende run (zonder: alles vers ophalen).
 *   --inzicht      standaard ../../inzicht-formulier (naast deze repo).
 *   --droog        alleen het verslag tonen, niets wegschrijven.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const HIER = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HIER, '..');
const arg = (naam) => { const i = process.argv.indexOf(naam); return i > -1 ? process.argv[i + 1] : null; };
const CACHE = arg('--cache');
const DROOG = process.argv.includes('--droog');
const INZICHT = resolve(arg('--inzicht') || join(REPO, '..', 'inzicht-formulier'));
const BPOST = join(REPO, 'src', 'data', 'postcodes-be.json');
const UIT = [join(REPO, 'src', 'data', 'postcode-gemeente.json'), join(INZICHT, 'data', 'postcode-gemeente.json')];
const OVERPASS = 'https://overpass-api.de/api/interpreter';
const GEBIEDEN = ['BE-VAN', 'BE-VBR', 'BE-VLI', 'BE-VOV', 'BE-VWV', 'BE-WBR', 'BE-WHT', 'BE-WLG', 'BE-WLX', 'BE-WNA', 'BE-BRU'];
const DICHTBIJ = 100; // gelijkspel: kandidaat binnen deze afstand gaat voor
const AANVAARD = 200; // winnaar met maar een plaatsnaam, zonder eigen naam en zonder blok: hoogstens deze afstand

// Steekproef (opdracht 23 nov 2026). 9150 = de gemeente na de fusie van 1 jan 2025.
const STEEKPROEF = {
  2830: 'Willebroek', 2811: 'Mechelen', 2800: 'Mechelen', 1910: 'Kampenhout', 3000: 'Leuven', 3001: 'Leuven',
  2000: 'Antwerpen', 2100: 'Antwerpen', 2900: 'Schoten', 9000: 'Gent', 8000: 'Brugge', 3500: 'Hasselt', 1000: 'Brussel',
  1050: 'Elsene', 4000: 'Luik', 7700: 'Moeskroen', 1785: 'Merchtem', 9220: 'Hamme', 1981: 'Zemst', 9308: 'Aalst',
  2870: 'Puurs-Sint-Amands', 9150: 'Beveren-Kruibeke-Zwijndrecht',
};

// ---------- hulp ----------
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const zonderAccent = (s) => String(s || '').replace(/œ/g, 'oe').replace(/Œ/g, 'Oe').replace(/æ/g, 'ae').replace(/Æ/g, 'Ae').replace(/ß/g, 'ss')
  .normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = (s) => zonderAccent(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const splits = (v) => String(v).split(/\s+-\s+|\s*;\s*|\s+\/\s+/);
// naam zonder toevoeging: alles vanaf het eerste verbindingswoord (niet het eerste woord) valt weg
const VERBIND = new Set(['aan', 'bij', 'op', 'onder', 'over', 'ten', 'ter', 'waas', 'leie', 'dijle', 'kempen',
  'lez', 'les', 'sur', 'sous', 'en', 'a', 'au', 'aux', 'la', 'le', 'l', 'de', 'du', 'des', 'd']);
function basis(raw) {
  const seg = zonderAccent(raw).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const i = seg.findIndex((s, k) => k > 0 && VERBIND.has(s));
  return i > 0 ? seg.slice(0, i).join('') : null;
}
const zonderLidwoord = (raw) => { const seg = zonderAccent(raw).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); return seg.length > 1 && ['le', 'la', 'les', 'l'].includes(seg[0]) ? seg.slice(1).join('') : null; };
function namen(tags, sleutels) {
  const uit = new Set();
  for (const k of sleutels) {
    const v = tags[k]; if (!v) continue;
    uit.add(norm(v));
    for (const deel of splits(v)) uit.add(norm(deel));
  }
  uit.delete('');
  return uit;
}
function basisNamen(tags, sleutels) {
  const uit = new Set();
  for (const k of sleutels) { const v = tags[k]; if (!v) continue; for (const deel of [v, ...splits(v)]) { const b = basis(deel); if (b) uit.add(b); } }
  return uit;
}
const HOOFD = ['name', 'name:nl', 'name:fr', 'name:de'];
const EXTRA = ['alt_name', 'alt_name:nl', 'alt_name:fr', 'old_name', 'old_name:nl', 'old_name:fr', 'official_name', 'official_name:nl', 'official_name:fr', 'short_name', 'loc_name'];
function levenshtein1(a, b) { // true als a en b hoogstens 1 bewerking verschillen
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, fout = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++fout > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return fout + (a.length - i) + (b.length - j) <= 1;
}

let laatsteVraag = 0;
async function overpass(query, label) {
  const sleutel = createHash('sha1').update(query).digest('hex').slice(0, 12);
  const pad = CACHE ? join(CACHE, `${label}-${sleutel}.json`) : null;
  if (pad && existsSync(pad)) return JSON.parse(readFileSync(pad, 'utf8'));
  const pauzes = [30000, 60000, 120000, 240000, 300000, 300000];
  for (let poging = 0; ; poging++) {
    const sinds = Date.now() - laatsteVraag;
    if (sinds < 5000) await wacht(5000 - sinds); // beleefd: minstens 5 s tussen twee vragen
    laatsteVraag = Date.now();
    let status = 0, tekst = '', fout = null, j = null;
    try {
      const r = await fetch(OVERPASS, {
        method: 'POST',
        headers: { 'User-Agent': 'kaart-werkgebied/1.0', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
      });
      status = r.status; tekst = await r.text();
    } catch (e) { tekst = String(e); }
    laatsteVraag = Date.now();
    if (status !== 200) fout = `HTTP ${status}`;
    else {
      try { j = JSON.parse(tekst); } catch { fout = 'geen JSON'; }
      if (j && j.remark && /error|timed out|out of memory/i.test(j.remark)) fout = 'remark: ' + j.remark;
    }
    console.error(`  Overpass ${label}: poging ${poging + 1} ${fout || 'OK'} (${tekst.length} bytes)`);
    if (status === 400) throw new Error(`Overpass ${label}: fout in de vraag: ${tekst.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 600)}`);
    if (!fout) {
      if (pad) { mkdirSync(CACHE, { recursive: true }); writeFileSync(pad, JSON.stringify(j)); }
      return j;
    }
    if (poging >= pauzes.length - 1) throw new Error(`Overpass ${label} mislukt: ${fout} ${tekst.slice(0, 300)}`);
    await wacht(pauzes[poging]);
  }
}

const gebiedQuery = (code) => `[out:json][timeout:900];
area["ISO3166-2"="${code}"]->.p;
rel(area.p)["boundary"="administrative"]["admin_level"="8"]->.g;
rel(area.p)["boundary"="administrative"]["admin_level"="9"]->.d9;
.g out tags;
.d9 out tags;
foreach.g->.x(
  .x map_to_area->.a;
  way(r.d9)(area.a)->.wa;
  rel(bw.wa)["boundary"="administrative"]["admin_level"="9"]->.cand;
  foreach.cand->.y(
    way(r.y)->.w;
    way.w(area.a)->.wi;
    make c g=x.u(id()), s=y.u(id()), t=w.count(ways), i=wi.count(ways);
    out;
  );
);`;

// accentongevoelige regex voor een genormaliseerde naam (Overpass, POSIX): elke letter met haar accentvarianten, leestekens vrij
const VAR = {
  a: 'a|à|á|â|ã|ä|å|A|À|Á|Â|Ã|Ä|Å', c: 'c|ç|C|Ç', e: 'e|è|é|ê|ë|E|È|É|Ê|Ë', i: 'i|ì|í|î|ï|I|Ì|Í|Î|Ï', n: 'n|ñ|N|Ñ',
  o: 'o|ò|ó|ô|õ|ö|O|Ò|Ó|Ô|Õ|Ö', u: 'u|ù|ú|û|ü|U|Ù|Ú|Û|Ü', y: 'y|ý|ÿ|Y|Ý|Ÿ',
};
const naamRegex = (n) => n.split('').map((ch) => (VAR[ch] ? `(${VAR[ch]})` : ch)).join("([- '.]|’)*");
// plaatsknopen waarvan de naam begint met een gezochte naam (zo vallen ook "Le Bizet", "Évegnée-Tignée" en "Sart-lez-Spa" erin)
const plaatsQuery = (sleutels) => `[out:json][timeout:600];
area["ISO3166-1"="BE"]["admin_level"="2"]->.be;
node["place"][~"^name(:(nl|fr|de))?$"~"^(((L|l)(e|a|es)?([- '.]|’)*)?(${sleutels.map(naamRegex).join('|')}))",i](area.be)->.pl;
foreach.pl->.pn(
  .pn is_in->.ar;
  area.ar["boundary"="administrative"]["admin_level"="8"]->.g8;
  make p k=pn.u(id()), name=pn.u(t["name"]), nl=pn.u(t["name:nl"]), fr=pn.u(t["name:fr"]), de=pn.u(t["name:de"]), place=pn.u(t["place"]), g=g8.set(id());
  out;
);`;

// ---------- 1. bpost ----------
const bpost = JSON.parse(readFileSync(BPOST, 'utf8'));
const plaatsen = new Map();
for (const [pc, n] of bpost) { if (!plaatsen.has(pc)) plaatsen.set(pc, []); if (!plaatsen.get(pc).includes(n)) plaatsen.get(pc).push(n); }
const POSTCODES = [...plaatsen.keys()].sort((a, b) => a - b);
console.error(`bpost: ${bpost.length} regels, ${POSTCODES.length} postcodes`);

// ---------- 2. OSM per provincie/gewest ----------
const gem = new Map(); const deel = new Map(); const koppels = new Map();
for (const code of GEBIEDEN) {
  const j = await overpass(gebiedQuery(code), code);
  let g8 = 0;
  for (const e of j.elements) {
    if (e.type === 'relation' && e.tags.admin_level === '8') { g8++; if (!gem.has(e.id)) gem.set(e.id, { id: e.id, tags: e.tags, gebied: code }); }
    else if (e.type === 'relation' && e.tags.admin_level === '9') { if (!deel.has(e.id)) deel.set(e.id, { id: e.id, tags: e.tags }); }
    else if (e.type === 'c') {
      const g = +e.tags.g, s = +e.tags.s, t = +e.tags.t, i = +e.tags.i;
      if (!koppels.has(s)) koppels.set(s, []);
      if (!koppels.get(s).some((k) => k.g === g)) koppels.get(s).push({ g, t, i, r: t ? i / t : 0 });
    }
  }
  if (!g8) throw new Error(`${code}: geen enkele gemeente ontvangen, meting ongeldig`);
  console.error(`${code}: ${g8} gemeenten`);
}
const gemNaam = (g) => gem.get(g).tags['name:nl'] || gem.get(g).tags.name;

// deelgemeente -> gemeente (hoogste verhouding lijnen binnenin / totaal)
const ouder = new Map(); const twijfelOuder = [];
for (const [s, ks] of koppels) {
  ks.sort((a, b) => b.r - a.r || b.i - a.i);
  ouder.set(s, ks[0].g);
  if (ks.length > 1 && ks[1].r >= ks[0].r * 0.5) twijfelOuder.push(`${deel.get(s)?.tags.name}: ${ks.map((k) => `${gemNaam(k.g)} ${k.i}/${k.t}`).join(', ')}`);
}
const gemPerNaam = new Map();
for (const g of gem.values()) for (const n of namen(g.tags, HOOFD)) { if (!gemPerNaam.has(n)) gemPerNaam.set(n, new Set()); gemPerNaam.get(n).add(g.id); }
const zonderOuder = [];
for (const d of deel.values()) {
  if (ouder.has(d.id)) continue;
  const hits = new Set(); for (const n of namen(d.tags, HOOFD)) for (const g of gemPerNaam.get(n) || []) hits.add(g);
  if (hits.size === 1) ouder.set(d.id, [...hits][0]); else zonderOuder.push(d.tags.name);
}

// ---------- 3. kandidaten ----------
const IDX = new Map(); const IDXB = new Map(); const IDX2 = new Map(); // exact, zonder toevoeging, extra namen
const zet = (idx, n, g, via) => { if (!idx.has(n)) idx.set(n, []); if (!idx.get(n).some((h) => h.g === g && h.via === via)) idx.get(n).push({ g, via }); };
for (const g of gem.values()) {
  for (const n of namen(g.tags, HOOFD)) zet(IDX, n, g.id, 'eigen');
  for (const n of basisNamen(g.tags, HOOFD)) zet(IDXB, n, g.id, 'eigen');
  for (const n of namen(g.tags, EXTRA)) zet(IDX2, n, g.id, 'eigen');
}
for (const [s, g] of ouder) {
  const t = deel.get(s).tags;
  for (const n of namen(t, HOOFD)) zet(IDX, n, g, 'deel');
  for (const n of basisNamen(t, HOOFD)) zet(IDXB, n, g, 'deel');
  for (const n of namen(t, EXTRA)) zet(IDX2, n, g, 'deel');
}
function kandidaten(pc) {
  const m = new Map();
  const tel = (g, raw, soort, eigen) => {
    if (!m.has(g)) m.set(g, { exact: new Set(), variant: new Set(), eigen: false });
    const v = m.get(g); if (soort === 'exact') v.exact.add(raw); else v.variant.add(raw);
    if (eigen) v.eigen = true;
  };
  for (const raw of plaatsen.get(pc)) {
    const n = norm(raw); const b = basis(raw);
    for (const h of IDX.get(n) || []) tel(h.g, raw, 'exact', h.via === 'eigen');
    for (const h of IDXB.get(n) || []) tel(h.g, raw, 'variant', false);      // OSM "Beveren-Leie" = bpost "Beveren"
    if (b) for (const h of IDX.get(b) || []) tel(h.g, raw, 'variant', false); // bpost "Sinaai-Waas" = OSM "Sinaai"
  }
  for (const v of m.values()) for (const raw of v.exact) v.variant.delete(raw);
  return m;
}
const KAND = new Map(POSTCODES.map((pc) => [pc, kandidaten(pc)]));

// hoe vaak staat de eigen naam van een gemeente als plaatsnaam in de bpost-lijst
const naamTelling = new Map();
for (const pc of POSTCODES) for (const n of new Set(plaatsen.get(pc).map(norm))) naamTelling.set(n, (naamTelling.get(n) || 0) + 1);
const zeldzaamheid = (g) => Math.min(Infinity, ...[...namen(gem.get(g).tags, HOOFD)].map((n) => naamTelling.get(n) || Infinity));

// ankers: postcodes waar een gemeente strikt de meeste exacte plaatsnamen heeft
const ANKERS = new Map();
for (const [pc, m] of KAND) {
  const rij = [...m].map(([g, v]) => [g, v.exact.size]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]);
  if (rij.length && (rij.length === 1 || rij[0][1] > rij[1][1])) { if (!ANKERS.has(rij[0][0])) ANKERS.set(rij[0][0], []); ANKERS.get(rij[0][0]).push(+pc); }
}
const blokVan = (pc) => Math.floor(+pc / 10);
function ligging(pc, lijst) {
  const ander = (lijst || []).filter((q) => q !== +pc);
  return { d: Math.min(Infinity, ...ander.map((q) => Math.abs(q - pc))), blok: ander.some((q) => blokVan(q) === blokVan(pc)) };
}
const toon = (k) => `${gemNaam(k.g)}${k.eigen ? '*' : ''} n${k.score}${k.exact < k.score ? '(v' + (k.score - k.exact) + ')' : ''} d${k.d}${k.blok ? ' blok' : ''}`;

// ---------- 4. keuze ----------
const resultaat = new Map(); // pc -> {g, hoe}
const verslag = { meer: [], zwak: [], onzeker: [], terugval: [] };
for (const pc of POSTCODES) {
  const m = KAND.get(pc);
  if (!m.size) continue;
  const lijst = [...m].map(([g, v]) => ({ g, eigen: v.eigen, exact: v.exact.size, score: v.exact.size + v.variant.size, zeld: zeldzaamheid(g), ...ligging(pc, ANKERS.get(g)) }));
  lijst.sort((a, b) => (b.score - a.score) || (b.blok - a.blok) || ((b.d <= DICHTBIJ) - (a.d <= DICHTBIJ)) || (b.eigen - a.eigen)
    || (b.exact - a.exact) || (a.zeld - b.zeld) || (a.d - b.d));
  const w = lijst[0];
  const regel = `${pc} ${plaatsen.get(pc).join('|')} -> ${gemNaam(w.g)}   [${lijst.map(toon).join('; ')}]`;
  if (!(w.eigen || w.score >= 2 || w.blok || w.d <= AANVAARD)) { verslag.onzeker.push(regel); continue; }
  resultaat.set(pc, { g: w.g, hoe: 'deelgemeente' });
  if (lijst.length > 1) verslag.meer.push(regel);
  else if (!w.eigen && w.score < 2 && !w.blok) verslag.zwak.push(regel);
  else if (w.exact < w.score && !w.exact) verslag.zwak.push(regel + ' (alleen variant)');
}

// ---------- 5. terugval: plaatsknopen, extra namen, dubbele namen, een letter verschil ----------
const open = POSTCODES.filter((pc) => !resultaat.has(pc));
const rauwOpen = [...new Set(open.flatMap((pc) => plaatsen.get(pc)))];
const zoekSleutels = [...new Set(rauwOpen.flatMap((r) => [norm(r), basis(r)]).filter(Boolean))].sort();
const knopen = []; // {sleutels:Set, g:[...]}
if (zoekSleutels.length) {
  const j = await overpass(plaatsQuery(zoekSleutels), 'plaatsen');
  for (const e of j.elements.filter((x) => x.type === 'p')) {
    const gs = String(e.tags.g || '').split(';').filter(Boolean).map((a) => +a - 3600000000).filter((g) => gem.has(g));
    const sl = new Set();
    for (const k of ['name', 'nl', 'fr', 'de']) for (const v of [e.tags[k], ...splits(e.tags[k] || '')]) {
      if (!v) continue; sl.add(norm(v)); const b = basis(v); if (b) sl.add(b); const z = zonderLidwoord(v); if (z) sl.add(z);
      for (const deelnaam of zonderAccent(v).split(/-/)) if (deelnaam.length >= 4) sl.add(norm(deelnaam)); // "Évegnée-Tignée"
    }
    knopen.push({ naam: e.tags.name, sl, gs });
  }
}
// deelgemeenten met een dubbele naam ("Évegnée-Tignée") en alle namen voor een letter verschil
const delen = new Map(); const alleNamen = new Map();
for (const [s, g] of ouder) for (const k of HOOFD) {
  const v = deel.get(s).tags[k]; if (!v) continue;
  if (!alleNamen.has(norm(v))) alleNamen.set(norm(v), new Set()); alleNamen.get(norm(v)).add(g);
  const stukken = zonderAccent(v).split(/-/); if (stukken.length < 2) continue;
  for (const st of stukken) if (st.length >= 4) { const n = norm(st); if (!delen.has(n)) delen.set(n, new Set()); delen.get(n).add(g); }
}
const gekoppeldVan = new Map(); // g -> [pc]
for (const [pc, r] of resultaat) { if (!gekoppeldVan.has(r.g)) gekoppeldVan.set(r.g, []); gekoppeldVan.get(r.g).push(+pc); }
for (const pc of open) {
  const m = new Map();
  const tel = (g, raw, bron) => { if (!m.has(g)) m.set(g, { namen: new Set(), bron: new Set() }); m.get(g).namen.add(raw); m.get(g).bron.add(bron); };
  for (const raw of plaatsen.get(pc)) {
    const n = norm(raw); const b = basis(raw);
    for (const kn of knopen) if (kn.sl.has(n) || (b && kn.sl.has(b))) for (const g of kn.gs) tel(g, raw, 'plaatsknoop ' + kn.naam);
    for (const h of [...(IDX2.get(n) || []), ...(b ? IDX2.get(b) || [] : [])]) tel(h.g, raw, 'alt_name');
    for (const g of delen.get(n) || []) tel(g, raw, 'dubbele naam');
    if (n.length >= 6) for (const [an, gs] of alleNamen) if (levenshtein1(n, an)) for (const g of gs) tel(g, raw, 'letter verschil');
    for (const [g] of KAND.get(pc)) tel(g, raw, 'deelgemeente');
  }
  const lijst = [...m].map(([g, v]) => ({ g, score: v.namen.size, bron: [...v.bron].join('+'), ...ligging(pc, gekoppeldVan.get(g)) }))
    .filter((k) => k.blok || k.d <= AANVAARD);
  lijst.sort((a, b) => (b.score - a.score) || (b.blok - a.blok) || (a.d - b.d));
  const regel = `${pc} ${plaatsen.get(pc).join('|')}: ${[...m].map(([g, v]) => `${gemNaam(g)} [${[...v.bron].join('+')}] d${ligging(pc, gekoppeldVan.get(g)).d}`).join(', ') || 'geen kandidaat'}`;
  if (!lijst.length) { verslag.terugval.push(regel + ' -> NIET GEKOPPELD'); continue; }
  resultaat.set(pc, { g: lijst[0].g, hoe: lijst[0].bron });
  if (!gekoppeldVan.has(lijst[0].g)) gekoppeldVan.set(lijst[0].g, []);
  gekoppeldVan.get(lijst[0].g).push(+pc);
  verslag.terugval.push(regel + ' -> ' + gemNaam(lijst[0].g));
}

// ---------- 6. niet gekoppeld: Nederlandse bpost-naam ----------
const nlNamen = new Set(); const frNamen = new Set();
for (const x of [...gem.values(), ...deel.values()]) { if (x.tags['name:nl']) nlNamen.add(norm(x.tags['name:nl'])); if (x.tags['name:fr']) frNamen.add(norm(x.tags['name:fr'])); }
function nederlandseNaam(pc) {
  const ns = plaatsen.get(pc);
  return ns.find((n) => nlNamen.has(norm(n)) && !frNamen.has(norm(n))) || ns.find((n) => !frNamen.has(norm(n)) || nlNamen.has(norm(n))) || ns[0];
}
const uit = {}; const nietGekoppeld = [];
for (const pc of POSTCODES) {
  const r = resultaat.get(pc);
  if (r) uit[pc] = gemNaam(r.g);
  else { uit[pc] = nederlandseNaam(pc); nietGekoppeld.push(pc); }
}

// ---------- 7. verslag en controle ----------
const gekoppeld = POSTCODES.length - nietGekoppeld.length;
console.log(`gemeenten in OSM: ${gem.size}, deelgemeenten: ${deel.size}, deelgemeenten zonder gemeente: ${zonderOuder.length}${zonderOuder.length ? ' (' + zonderOuder.join(', ') + ')' : ''}`);
if (twijfelOuder.length) console.log('deelgemeenten met twee mogelijke gemeenten:\n  ' + twijfelOuder.join('\n  '));
console.log(`\nmeerdere kandidaten (${verslag.meer.length}); * = eigen naam, n = aantal plaatsnamen (v = via variant), d = afstand tot ander anker, blok = anker in hetzelfde tiental:\n  ` + verslag.meer.join('\n  '));
console.log(`\nzwakke enige kandidaat (${verslag.zwak.length}):\n  ` + verslag.zwak.join('\n  '));
if (verslag.onzeker.length) console.log(`\nkandidaat te ver, naar terugval (${verslag.onzeker.length}):\n  ` + verslag.onzeker.join('\n  '));
console.log(`\nterugval (${verslag.terugval.length}):\n  ` + verslag.terugval.join('\n  '));
console.log(`\nniet gekoppeld (${nietGekoppeld.length}): ${nietGekoppeld.map((pc) => `${pc} ${uit[pc]}`).join(', ') || '-'}`);
const zonderPostcode = [...gem.values()].filter((g) => !Object.values(uit).includes(gemNaam(g.id)));
console.log(`gemeenten zonder postcode (${zonderPostcode.length}): ${zonderPostcode.map((g) => gemNaam(g.id)).join(', ') || '-'}`);
console.log(`\npostcodes: ${POSTCODES.length}, gekoppeld: ${gekoppeld} (${(100 * gekoppeld / POSTCODES.length).toFixed(1)} %)`);
let fouten = 0;
console.log('\nsteekproef:');
for (const [pc, verwacht] of Object.entries(STEEKPROEF)) {
  const ok = uit[pc] === verwacht && !nietGekoppeld.includes(pc);
  if (!ok) fouten++;
  console.log(`  ${ok ? 'OK  ' : 'FOUT'} ${pc} verwacht ${verwacht}, kreeg ${uit[pc]}`);
}
if (fouten || gekoppeld / POSTCODES.length < 0.98) {
  console.error(`\nNIET weggeschreven: ${fouten} fout(en) in de steekproef of minder dan 98 % gekoppeld.`);
  process.exit(1);
}
const json = '{\n' + POSTCODES.map((pc) => `${JSON.stringify(pc)}:${JSON.stringify(uit[pc])}`).join(',\n') + '\n}\n';
if (DROOG) { console.log('\n--droog: niets weggeschreven.'); process.exit(0); }
for (const pad of UIT) { mkdirSync(dirname(pad), { recursive: true }); writeFileSync(pad, json); console.log('geschreven: ' + pad); }
