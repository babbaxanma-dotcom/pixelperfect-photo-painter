#!/usr/bin/env node
/**
 * check-ads-negatives.cjs — DE GUARD tegen de duurste Google Ads-fout:
 * een negative-zoekwoord dat een EIGEN dienst of EIGEN werkgebied-stad blokkeert.
 *
 * Achtergrond (jun 2026): er stonden negatives als "fakro", "pur", "spuitisolatie",
 * "opbouw", "sk06", "dakvensterinstallateur" en steden binnen het werkgebied
 * (gent/aalst/dendermonde...) in de lijst. Die blokkeren ECHTE klanten — permanent,
 * onzichtbaar (geblokkeerde queries komen niet in het zoektermenrapport), x2 campagnes.
 * Zie memory feedback_negatives_service_test.md.
 *
 * KERNREGEL (omgekeerde bewijslast): een phrase/broad negative is alleen veilig als
 * hij MINSTENS ÉÉN versmallend token bevat dat een AB-klant nooit zou typen
 * (een concurrent-/persoonsnaam, of een info/job/B2B-woord). Een negative die VOLLEDIG
 * uit herkende dienstwoorden en/of eigen-werkgebied-steden bestaat = blokkeert generieke
 * koop-intentie = FOUT.
 *   "venco dakwerken"  -> bevat 'venco' (versmallend, concurrent) -> VEILIG
 *   "zelf plaatsen"    -> bevat 'zelf'  (versmallend, info)       -> VEILIG
 *   "fakro"            -> enkel dienstwoord, niets versmallends    -> FOUT
 *   "dakwerken gent"   -> dienst + eigen stad, niets versmallends  -> FOUT
 *
 * Exact [..] is precies (blokkeert enkel die exacte string), dus laag risico; alleen
 * een exact die letterlijk één puur dienstwoord is ([dakwerken]) wordt geflagd.
 *
 * De dienstwoorden zijn GEGROND tegen de live site-catalogus: bij elke run checkt
 * de guard of de gecureerde dienstwoorden nog in de echte broncode voorkomen en
 * waarschuwt als de catalogus is gewijzigd (zodat de lijst niet verrot).
 *
 * Gebruik:  node scripts/check-ads-negatives.cjs [pad/naar/negatives.txt]
 * Exit 1 bij een FOUT (CI faalt). Exit 0 als alles veilig is.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const negPath = process.argv[2] || path.join(ROOT, 'ads', 'negatives.txt');

// ── Bronbestanden waaruit de dienst-catalogus wordt gegrond ─────────────────
const CATALOG_FILES = [
  'src/pages/abbouw/Dakwerken.tsx',
  'src/pages/abbouw/Gevel.tsx',
  'src/pages/abbouw/Diensten.tsx',
  'src/pages/abbouw/Construct.tsx',
  'src/pages/abbouw/Realisaties.tsx',
  'src/pages/abbouw/lp/LpDienst.tsx',
  'src/pages/abbouw/lp/LpDakwerken.tsx',
  'src/pages/abbouw/lp/LpGevel.tsx',
].map((p) => path.join(ROOT, p));

function readCatalog() {
  let txt = '';
  for (const f of CATALOG_FILES) {
    try { txt += '\n' + fs.readFileSync(f, 'utf8').toLowerCase(); } catch { /* bestand mag ontbreken */ }
  }
  return txt;
}

// ── 1. Gecureerde dienstwoorden (mogen NOOIT alleen een negative zijn) ──────
// Gegrond door het lezen van de live catalogus (Dakwerken/Gevel/Diensten/...).
// catalogTokens = verwacht in de broncode (guard waarschuwt als ze verdwijnen).
// domainTokens  = domeinkennis die niet per se in copy staat (Velux-maatcodes,
//                 merken die AB plaatst) maar wél koop-intentie betekenen.
const SERVICE_CATALOG = [
  // dak
  'dakwerken', 'dakwerker', 'dakdekker', 'dakrenovatie', 'dakbedekking',
  'pannen', 'dakpannen', 'leien', 'bitumen', 'roofing', 'epdm',
  'opbouw', 'dampscherm', 'pir', 'pur', 'glaswol', 'cellulose',
  'isolatie', 'dakisolatie', 'sarking', 'zink', 'zinkwerk',
  'dakgoot', 'dakgoten', 'regenpijp', 'kilgoot',
  'dakraam', 'dakramen', 'dakvenster', 'dakvensters', 'dakkapel', 'dakkapellen',
  'velux', 'fakro', 'roto',
  // gevel
  'gevel', 'crepi', 'sierpleister', 'pleisterwerk', 'steenstrips',
  'gevelbekleding', 'gevelreiniging', 'gevelrenovatie', 'gevelisolatie',
  'hervoegen', 'voegen', 'voegwerk', 'reinigen', 'spuitwerk', 'etics',
  'buitenisolatie', 'cladding', 'methode',
  // werkwoorden / kern
  'plaatsen', 'plaatsing', 'installateur', 'installatie', 'renovatie',
];
const SERVICE_DOMAIN = [
  'spuitisolatie',                          // = geprojecteerde PUR (AB-dienst)
  'dakvensterinstallateur',                 // letterlijk AB-dienst
  'sk06', 'mk04', 'mk06', 'uk04', 'ck02',   // Velux-maatcodes = install-lead
  'ggl', 'gpl',                             // Velux-types
];
const SERVICE = new Set([...SERVICE_CATALOG, ...SERVICE_DOMAIN]);

// ── 2. Eigen werkgebied — Vlaamse steden/gemeenten (NOOIT als negative) ─────
// AB claimt "heel Vlaanderen"; basis = Willebroek/Mechelen/Antwerpen-as.
// Elke Vlaamse plaatsnaam als negative blokkeert een echte geo-lead.
const AREA_CITIES = new Set([
  'willebroek', 'mechelen', 'antwerpen', 'lier', 'bornem', 'puurs', 'bonheiden',
  'sint-niklaas', 'sint', 'niklaas', 'beveren', 'temse', 'kruibeke', 'hamme',
  'dendermonde', 'lebbeke', 'zele', 'wetteren', 'gent', 'aalst', 'ninove',
  'denderleeuw', 'geraardsbergen', 'lokeren', 'waasmunster',
  'brussel', 'asse', 'vilvoorde', 'grimbergen', 'kampenhout', 'zaventem',
  'leuven', 'aarschot', 'diest', 'tienen', 'haacht', 'keerbergen',
  'geel', 'westerlo', 'herentals', 'mol', 'turnhout', 'lommel', 'heist',
  'rijkevorsel', 'hoogstraten', 'brasschaat', 'schoten', 'kapellen', 'kontich',
  'boom', 'niel', 'rumst', 'duffel', 'wijnegem', 'mortsel', 'edegem', 'hove',
  'brugge', 'oostende', 'kortrijk', 'roeselare', 'ieper', 'waregem', 'tielt',
  'hasselt', 'genk', 'sint-truiden', 'tongeren', 'bilzen', 'lommel', 'beringen',
  'zottegem', 'oudenaarde', 'ronse', 'deinze', 'eeklo', 'maldegem',
]);
// Steden die je BEWUST als negative mag houden (ver buiten bereik, budget sparen).
const CITY_ALLOWED_AS_NEGATIVE = new Set(['nieuwpoort', 'knokke', 'depanne', 'koksijde', 'veurne']);

// ── 3. Versmallende tokens: info/DIY/job/B2B — maken een negative net VEILIG ──
const NARROWING = new Set([
  'handleiding', 'montage', 'zelf', 'diy', 'tutorial', 'reviews', 'review',
  'ervaringen', 'ervaring', 'lijst', 'forum', 'tweedehands', 'doe', 'het',
  'vacature', 'vacatures', 'job', 'jobs', 'loon', 'salaris', 'opleiding',
  'cursus', 'stage', 'verdeler', 'verdelers', 'distributeur', 'groothandel',
  'gratis', 'gebruikt', 'occasie', 'wikipedia', 'betekenis', 'wat', 'hoe',
]);
// Dutch stopwoorden tellen niet mee als "versmallend" (te generiek).
const STOP = new Set(['de', 'het', 'een', 'van', 'en', 'in', 'op', 'met', 'voor', 'd', 'a', 'o', 'bv']);

// ── Parse de negatives ──────────────────────────────────────────────────────
function classifyLine(raw) {
  const line = raw.trim();
  if (!line) return null;
  let type = 'broad';
  let text = line;
  if (line.startsWith('[') && line.endsWith(']')) { type = 'exact'; text = line.slice(1, -1); }
  else if (line.startsWith('"') && line.endsWith('"')) { type = 'phrase'; text = line.slice(1, -1); }
  const tokens = text.toLowerCase().split(/[\s\-]+/).filter(Boolean);
  return { raw: line, type, text: text.toLowerCase(), tokens };
}

function tokenClass(tok) {
  if (SERVICE.has(tok)) return 'service';
  if (AREA_CITIES.has(tok)) return 'city';
  if (CITY_ALLOWED_AS_NEGATIVE.has(tok)) return 'city_ok';
  if (NARROWING.has(tok)) return 'narrowing';
  if (STOP.has(tok)) return 'stop';
  return 'other'; // onbekend = meestal merk-/persoonsnaam = versmallend
}

function main() {
  if (!fs.existsSync(negPath)) {
    console.error(`FOUT: negatives-bestand niet gevonden: ${negPath}`);
    process.exit(2);
  }
  const catalog = readCatalog();
  const lines = fs.readFileSync(negPath, 'utf8').split(/\r?\n/);

  const errors = [];   // blokkeert eigen dienst/stad -> exit 1
  const warns = [];     // handmatige review (onbekend single-token broad e.d.)
  let counts = { exact: 0, phrase: 0, broad: 0, total: 0 };

  for (const raw of lines) {
    const e = classifyLine(raw);
    if (!e) continue;
    counts.total++; counts[e.type]++;

    const classes = e.tokens.map(tokenClass);
    const hasNarrowing = classes.some((c) => c === 'narrowing' || c === 'other' || c === 'city_ok');
    const serviceToks = e.tokens.filter((_, i) => classes[i] === 'service');
    const cityToks = e.tokens.filter((_, i) => classes[i] === 'city');
    const onlyServiceOrCity = e.tokens.length > 0 &&
      classes.every((c) => c === 'service' || c === 'city' || c === 'stop') &&
      (serviceToks.length > 0 || cityToks.length > 0);

    if (e.type === 'exact') {
      // Exact is precies: alleen flaggen als de hele string één puur dienstwoord is.
      if (e.tokens.length === 1 && SERVICE.has(e.tokens[0])) {
        errors.push(`${e.raw}  → exact-match op puur dienstwoord "${e.tokens[0]}" blokkeert die koop-query`);
      }
      continue;
    }

    // phrase / broad
    if (onlyServiceOrCity && !hasNarrowing) {
      const why = cityToks.length
        ? `bevat eigen-werkgebied stad: ${cityToks.join(', ')}`
        : `volledig dienstwoord(en): ${serviceToks.join(', ')} — geen versmallend token`;
      errors.push(`${e.raw}  → ${why}  (blokkeert echte AB-klant)`);
    } else if (e.type === 'broad' && e.tokens.length === 1 && tokenClass(e.tokens[0]) === 'other') {
      // Eén onbekend broad token (bv. een Velux-maatcode die ik niet ken, of een
      // term die in de sitecopy staat): handmatig nakijken.
      const inCopy = catalog.includes(e.tokens[0]) && e.tokens[0].length >= 4;
      warns.push(`${e.raw}  → onbekend broad token "${e.tokens[0]}"${inCopy ? ' — KOMT VOOR in je sitecopy, dubbelcheck of dit een dienst is' : ' — check of dit een product-/maatcode van een eigen dienst is'}`);
    }
  }

  // ── Grounding-check: staan de gecureerde catalogus-dienstwoorden nog in de bron? ──
  const drifted = SERVICE_CATALOG.filter((w) => !catalog.includes(w));
  if (catalog && drifted.length) {
    warns.push(`CATALOGUS-DRIFT: deze gecureerde dienstwoorden staan niet meer in de sitecopy — her-verifieer of ze nog diensten zijn: ${drifted.join(', ')}`);
  }
  if (!catalog) {
    warns.push('Kon de site-catalogus niet lezen (bronbestanden niet gevonden) — guard draait op de gecureerde lijst zonder live grounding.');
  }

  // ── Rapport ─────────────────────────────────────────────────────────────
  console.log(`\nGoogle Ads negatives-guard — ${negPath}`);
  console.log(`  ${counts.total} negatives  (exact: ${counts.exact}, phrase: ${counts.phrase}, broad: ${counts.broad})`);

  if (warns.length) {
    console.log(`\n  ⚠  ${warns.length} te bekijken (geen blocker):`);
    warns.forEach((w) => console.log(`     - ${w}`));
  }

  if (errors.length) {
    console.log(`\n  ✖  ${errors.length} GEVAARLIJKE negative(s) — blokkeren een eigen dienst of werkgebied-stad:`);
    errors.forEach((e) => console.log(`     - ${e}`));
    console.log('\n  → Verwijder deze uit Google Ads (gedeelde lijst + losse campagne-negatives) én uit ads/negatives.txt.');
    console.log('     Regel: een term gaat er pas op als BEWEZEN is dat geen AB-klant die een dienst zoekt hem ooit typt.\n');
    process.exit(1);
  }

  console.log('\n  ✓  Geen negative blokkeert een bewezen eigen dienst of werkgebied-stad.\n');
  process.exit(0);
}

main();
