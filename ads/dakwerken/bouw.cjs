/**
 * Dak-campagne AB Bouw (Google Ads, campagne-ID 23871467233), herbouwd op 23 sep 2026.
 *
 * Opdracht (Mohammed, 23 sep): alleen dakrenovatie en dakvernieuwing, grote projecten
 * (Bardh: vanaf 5.000 euro), klanten uit de omgeving van Antwerpen maar niet de stad zelf,
 * 35 euro per dag, "genoeg uitsluiting zodat we enkel kwalitatieve klikken krijgen".
 *
 * Dit script schrijft de plak-klare lijsten en faalt (exit 1) als:
 *  - een kop, beschrijving, pad, sitelink of highlight te lang is;
 *  - een tekst een verboden zinsbouw of een claim bevat die niet op de landingspagina staat;
 *  - twee advertentiegroepen dezelfde kop delen (geen stempel over een set);
 *  - een uitsluitingszoekwoord een van onze eigen zoekwoorden blokkeert;
 *  - een uitsluiting een koperzoekopdracht blokkeert die niet bewust op de lijst BEWUST_GEBLOKT staat.
 *
 * Draaien: node ads/dakwerken/bouw.cjs
 */
const fs = require('fs');
const path = require('path');
const MAP = __dirname;

const URL = 'https://www.abgroep.be/lp/dakwerken';

/* ---------- Zoekwoorden (onderzoek autocomplete gl=be + junidata, 23 sep) ---------- */
// w = woordgroep, e = exact. Geen breed zoeken.
const GROEPEN = {
  'Hellend dak vernieuwen': {
    zoekwoorden: [
      ['dak vernieuwen', 'w'], ['dak vernieuwen', 'e'], ['dak vernieuwen prijs', 'w'],
      ['dak vernieuwen kosten', 'w'], ['dak vernieuwen en isoleren', 'w'], ['hellend dak vernieuwen', 'w'],
      ['volledig dak vernieuwen prijs', 'e'], ['kostprijs nieuw dak', 'w'], ['prijs nieuw dak', 'w'],
      ['nieuw dak laten plaatsen', 'w'], ['nieuw dak laten leggen', 'w'], ['dak laten vernieuwen', 'w'],
      ['dak laten vervangen', 'w'], ['dak renoveren kosten', 'w'], ['dakrenovatie prijs', 'w'],
      ['dakrenovatie offerte', 'w'], ['nieuw pannendak', 'w'], ['pannendak vervangen', 'w'],
      ['leien dak vervangen', 'w'], ['sarkingdak prijs', 'w'],
    ],
    // Zonder deze vangt "dak vernieuwen" ook de platte daken; die horen in de andere groep.
    kruis: ['plat dak', 'platte dak', 'platte daken', 'platdak', 'roofing', 'epdm', 'bitumen'],
    pad: ['dak', 'vernieuwen'],
    koppen: [
      'Dak vernieuwen?',                // positie 1, gepind (samen met Pannendak vervangen en Kostprijs nieuw dak)
      'Wat kost uw nieuw dak?',
      'Prijsaanvraag in 2 minuten',
      'Gratis dakinspectie',
      'Tien jaar garantie op uw dak',
      'Huis ouder dan 10 jaar? 6% btw',
      'Mijn VerbouwPremie-begeleiding',
      'Pannendak vervangen',
      'Nieuw dak met isolatie',
      /* 25 sep, Transparency Center: de langstlopende advertenties van de grote namen
         dragen de bedrijfsnaam als kop ("Dural Bouwgroep" 1414 dagen, "OVB Construct"
         1027) en herhalen het zoekwoord ("Experts in {KeyWord:platte daken}", 1669 dagen). */
      'AB Bouw Groep',
      'Vraag uw gratis offerte aan',
      'Dak aan vervanging toe?',
      '{KeyWord:Nieuw dak laten plaatsen}',
      'Dak vernieuwen in {LOCATION(City):uw regio}',
      'Kostprijs nieuw dak',
    ],
    beschrijvingen: [
      'Nieuw dak nodig? Bereken in 2 minuten uw dakprijs. Gratis en vrijblijvend.',
      'Gratis dakinspectie ter plaatse. Daarna krijgt u een vrijblijvende offerte.',
      'Tien jaar garantie op dakrenovatie. Volledig verzekerd en VCA-gecertificeerd.',
      'Woning ouder dan tien jaar? 6% btw. En volledige Mijn VerbouwPremie-begeleiding.',
    ],
  },
  'Plat dak vernieuwen': {
    zoekwoorden: [
      ['plat dak vernieuwen', 'w'], ['plat dak vernieuwen', 'e'], ['plat dak vernieuwen prijs', 'w'],
      ['plat dak vernieuwen en isoleren', 'w'], ['plat dak laten vernieuwen', 'w'], ['plat dak laten vervangen', 'w'],
      ['nieuw plat dak', 'w'], ['kostprijs plat dak vernieuwen', 'w'], ['kostprijs nieuw plat dak', 'w'],
      ['dakrenovatie plat dak', 'w'], ['roofing plat dak vernieuwen', 'w'], ['roofing vernieuwen', 'w'],
      ['prijs roofing m2 geplaatst', 'w'], ['epdm laten leggen', 'w'], ['epdm dakbedekking laten leggen', 'w'],
      ['prijs epdm dak geplaatst', 'w'], ['bitumen dak vervangen', 'w'], ['plat dak epdm aannemer', 'w'],
    ],
    kruis: ['pannen', 'pannendak', 'leien', 'hellend', 'sarking', 'sarkingdak'],
    pad: ['plat-dak', 'vernieuwen'],
    koppen: [
      'Plat dak vernieuwen?',           // positie 1, gepind (samen met Wat kost een nieuw plat dak? en Roofing of EPDM vernieuwen)
      'Wat kost een nieuw plat dak?',
      'Prijs aanvragen in 2 minuten',
      'Gratis inspectie van uw dak',
      '10 jaar garantie op dakwerk',
      '6% btw bij woning 10+ jaar',
      'Begeleiding Mijn VerbouwPremie',
      'Nieuw plat dak in EPDM',
      'Roofing of EPDM vernieuwen',
      'Plat dak met nieuwe isolatie',
      'AB Bouw Groep: platte daken',
      '{KeyWord:Nieuw plat dak}',
      'EPDM laten leggen',
      'Nieuw plat dak in {LOCATION(City):uw regio}',
      'Plat dak laten vervangen',
    ],
    beschrijvingen: [
      'Wat kost een nieuw plat dak? Bereken het op onze website in 2 minuten.',
      'Gratis dakinspectie: we bekijken uw plat dak ter plaatse en overlopen de bevindingen.',
      'Wij geven tien jaar garantie op dakrenovatie en zijn volledig verzekerd.',
      '6% btw voor een woning ouder dan tien jaar, met Mijn VerbouwPremie-begeleiding.',
    ],
  },
};

/* ---------- Componenten op campagneniveau ---------- */
const SITELINKS = [
  { tekst: 'Gratis dakinspectie', r1: 'Wij bekijken uw dak ter plaatse', r2: 'Daarna een vrijblijvende offerte', url: URL + '#contact' },
  /* 24 sep: de calculator heeft 6 tot 8 vragen per pad, "zes vragen" klopt niet meer;
     de kop van de calculator heet nu "Bereken uw dakprijs / Klaar in 2 minuten". */
  { tekst: 'Bereken uw dakprijs', r1: 'Klaar in 2 minuten', r2: 'Gratis en vrijblijvend', url: URL + '#rekenaar' },
  { tekst: 'Waarom AB Bouw Groep', r1: 'Tien jaar garantie op dakwerk', r2: 'Volledige premiebegeleiding', url: URL + '#waarom' },
  { tekst: 'Zo verloopt uw dakwerk', r1: 'In vijf duidelijke stappen', r2: 'U weet vooraf wat er gebeurt', url: URL + '#werkwijze' },
  /* 25 sep: Google raadt 6 sitelinks aan, Dural toont er tot 8. De vijfde wijst naar de
     hero, waar de 6% btw en de premiebegeleiding als vinkjes staan. */
  { tekst: '6% btw en premies', r1: '6% btw bij woning 10+ jaar', r2: 'Hulp bij Mijn VerbouwPremie', url: URL + '#top' },
  /* 25 sep, de twee grote diensten van de dienstensectie. Mohammed: "nee niet naar de
     nieuwe ankers op pagina", "het mag bovenaan komen want daar moeten ze ook zijn":
     ze landen bovenaan bij de calculator. De parameter geeft elke sitelink een eigen
     URL (Google weigert twee sitelinks met dezelfde) en de pagina opent zonder anker. */
  { tekst: 'Nieuw dak', r1: 'Volledig nieuw dak', r2: 'Pannen, leien of plat dak', url: URL + '?dienst=nieuw-dak' },
  { tekst: 'Dakrenovatie', r1: 'Uw dakstructuur blijft staan', r2: 'Nieuwe pannen en onderdak', url: URL + '?dienst=renovatie' },
];
const HIGHLIGHTS = ['Gratis dakinspectie', 'Tien jaar garantie', 'Premiebegeleiding', 'Ruim 15 jaar ervaring', 'VCA-gecertificeerd', 'Volledig verzekerd', 'Vrijblijvende offerte',
  'Aanvraag in 2 minuten', '6% btw vanaf 10 jaar'];
/* 25 sep: tweede snippet = de vier diensten van de landingspagina, in dezelfde volgorde
   (Mohammed: "de diensten moeten zijn, nieuw dak, dakrenovatie, dakisolatie, dakherstelling"). */
const SNIPPETS = [
  { kop: 'Typen', waarden: ['Pannendak', 'Leien dak', 'Plat dak', 'EPDM', 'Roofing', 'Bitumen'] },
  { kop: 'Diensten', waarden: ['Nieuw dak', 'Dakrenovatie', 'Dakisolatie', 'Dakherstelling'] },
];
const SNIPPET = SNIPPETS[0];

/* ---------- Uitsluitingen ---------- */
const BRON = require('./negatives-bron.cjs');
// Beslist op 23 sep (Claude, binnen Mohammeds opdracht "enkel dakrenovatie, vernieuwing").
// Wie hier iets schrapt: de reden staat erbij.
BRON['10 Beslist 23 sep: geen renovatie van het woningdak'] = [
  ['dakkapel', 'w', 'nieuw volume, geen dakrenovatie'],
  ['dakkapellen', 'w', 'nieuw volume, geen dakrenovatie'],
  ['uitbouw', 'w', 'plat dakje op aanbouw, onder 5.000 euro'],
  ['aanbouw', 'w', 'plat dakje op aanbouw, onder 5.000 euro'],
  ['storm', 'w', 'meestal pannen terugleggen'],
  ['stormschade', 'w', 'meestal pannen terugleggen'],
  ['windschade', 'w', 'meestal pannen terugleggen'],
  ['verzekering', 'w', 'schadedossier, meestal herstelling'],
  ['schouw', 'w', 'meestal vegen of herstellen'],
  ['schoorsteen', 'w', 'meestal vegen of herstellen'],
  ['golfplaten', 'w', 'meestal bijgebouw of loods'],
  ['sandwichpanelen', 'w', 'meestal bijgebouw of loods'],
  ['forum', 'w', 'infozoeker'],
  ['soorten', 'w', 'infozoeker'],
  ['nadelen', 'w', 'infozoeker'],
  ['voordelen', 'w', 'infozoeker'],
  ['verschil', 'w', 'infozoeker'],
  ['levensduur', 'w', 'infozoeker'],
  ['nieuwbouw', 'w', 'geen renovatie'],
];
// Uit het echte zoektermenrapport van deze campagne (14 mei - 23 sep 2026) en de oude
// uitsluitingenlijst: termen waarop al betaald is zonder dat het een dakrenovatie was.
// Niet overgenomen uit de oude lijst: "hoeveel kost", "kostprijs", "per m2" en "premie" —
// die blokkeerden kopers ("kostprijs nieuw dak" is een eigen zoekwoord).
BRON['11 Echte zoektermen en oude lijst (23 sep)'] = [
  ['govaert', 'w', 'concurrent, 2 betaalde kliks'],
  ['kds', 'w', 'concurrent KDS Beveren, betaalde klik'],
  ['solitec', 'w', 'concurrent, betaalde klik'],
  ['epdm folie', 'w', 'materiaalkoper, betaalde klik'],
  ['2e keus', 'w', 'materiaalkoper, betaalde klik'],
  ['tweede keus', 'w', 'materiaalkoper'],
  ['stoomreiniger', 'w', 'reiniging, oude lijst'],
  ['vandersanden', 'w', 'steenmerk, oude lijst'],
  ['sandwich', 'w', 'bijgebouw of loods, oude lijst'],
];

const tok = (s) => s.toLowerCase().replace(/[’']/g, "'").split(/\s+/).filter(Boolean);
function blokkeert(neg, type, query) {
  const n = tok(neg), q = tok(query);
  if (type === 'e') return n.join(' ') === q.join(' ');
  if (type === 'b') return n.every((t) => q.includes(t));
  for (let i = 0; i + n.length <= q.length; i++) if (n.every((t, j) => q[i + j] === t)) return true;
  return false;
}

const fouten = [];
const negs = [];
for (const [cat, lijst] of Object.entries(BRON)) for (const [t, ty] of lijst) negs.push({ t, ty, cat });
const dubbel = new Set();
for (const n of negs) { const k = n.t + '|' + n.ty; if (dubbel.has(k)) fouten.push(`uitsluiting dubbel: ${n.t}`); dubbel.add(k); }

// Positieve controle: de toets moet deze bekende blokkades vangen, anders is hij stuk.
for (const [n, ty, q, verwacht] of [['premie', 'w', 'dakrenovatie premie', true], ['plat dak', 'w', 'plat dak vernieuwen prijs', true], ['velux plaatsen', 'w', 'dak vernieuwen met velux', false]]) {
  if (blokkeert(n, ty, q) !== verwacht) { console.error(`TOETS DEFECT op "${n}" / "${q}"`); process.exit(2); }
}

// 1. Geen enkele uitsluiting (campagne + eigen kruislijst) mag een eigen zoekwoord raken.
for (const [naam, g] of Object.entries(GROEPEN)) {
  for (const [kw] of g.zoekwoorden) {
    for (const n of negs) if (blokkeert(n.t, n.ty, kw)) fouten.push(`campagne-uitsluiting "${n.t}" blokkeert eigen zoekwoord "${kw}"`);
    for (const k of g.kruis) if (blokkeert(k, 'w', kw)) fouten.push(`kruis-uitsluiting "${k}" blokkeert eigen zoekwoord "${kw}" in ${naam}`);
  }
}
// Elk kruiswoord moet de platte-dakvraag echt naar de andere groep sturen.
if (!GROEPEN['Hellend dak vernieuwen'].kruis.some((k) => blokkeert(k, 'w', 'plat dak vernieuwen prijs'))) fouten.push('kruislijst hellend houdt plat dak niet tegen');

// 2. Koperzoekopdrachten (autocomplete gl=be, 23 sep). Geblokkeerd mag alleen als het hieronder bewust staat.
const KOPER = ['dak vernieuwen kosten', 'dak vernieuwen prijs per m2', 'dak vernieuwen subsidie', 'dak vernieuwen vergunning nodig', 'dak vernieuwen en isoleren prijs', 'dak vernieuwen premie', 'dak vernieuwen asbest', 'dak vernieuwen btw', 'dak vernieuwen met zonnepanelen', 'dak vernieuwen architect nodig', 'dakrenovatie kosten', 'dakrenovatie offerte aanvragen', 'dakrenovatie premie aanvragen', 'dakrenovatie btw tarief', 'dakrenovatie op afbetaling', 'dakrenovatie in de buurt', 'dakrenovatie kosten berekenen', 'dakrenovatie calculator', 'wat kost een nieuw dak', 'wat kost een nieuw dak met dakpannen en isolatie', 'kostprijs nieuw dak rijwoning', 'kostprijs nieuw dak en onderdak', 'nieuw dak met dakkapel kosten', 'nieuw dak en asbest verwijderen', 'prijs nieuw dak rijhuis', 'kosten nieuw dak tussenwoning', 'pannendak vervangen kosten', 'pannendak laten vervangen', 'dakpannen vervangen kosten', 'asbest dak vervangen premie', 'asbestdak vervangen kosten', 'leien dak vervangen', 'plat dak vervangen kosten per m2', 'plat dak renoveren en isoleren prijs', 'roofing plat dak vernieuwen', 'nieuwe roofing plat dak', 'gratis offerte dak vernieuwen', 'goedkoop dak vernieuwen', 'premie dakwerken vlaanderen', 'moet mijn dak vernieuwd worden', 'huis gekocht dak vernieuwen', 'huis kopen dak vernieuwen', 'dak laten vernieuwen offerte', 'nieuw dak kleine rijwoning', 'volledig dak vernieuwen prijs', 'dak vernieuwen met velux', 'dak vernieuwen met dakramen', 'nieuw dak met velux kosten', 'dak en dakgoten vernieuwen', 'dak vernieuwen inclusief dakgoten', 'dak vernieuwen en schouw afbreken', 'gratis dakinspectie', 'epdm dak laten leggen prijs', 'onderdak vervangen', 'dak vernieuwen appartementsgebouw', 'nieuw hellend dak prijs', 'dakrenovatie oud huis', 'dak vernieuwen lening', 'dakrenovatie financieren', 'dak vernieuwen verzekering', 'nieuw dak zonder isolatie', 'leien dak vernieuwen prijs', 'dak vernieuwen wanneer', 'nieuw dak plaatsen vergunning', 'hoeveel kost een nieuw dak', 'hoeveel kost plat dak vernieuwen', 'epdm dak vernieuwen', 'bitumen dak vernieuwen kosten', 'dak vernieuwen voor zonnepanelen', 'asbest leien dak vervangen', 'offerte nieuw dak', 'dakrenovatie aannemer', 'nieuw dak met isolatie en zonnepanelen', 'dak vernieuwen en dakkapel plaatsen', 'kosten nieuw dak vrijstaand huis', 'plat dak vernieuwen met lichtkoepel', 'dak volledig vernieuwen', 'dak vernieuwen met sarking', 'hoe lang duurt een dakrenovatie'];
const BEWUST_GEBLOKT = new Set([
  'nieuw dak met dakkapel kosten', 'dak vernieuwen en dakkapel plaatsen', // dakkapel = nieuw volume
  'dak vernieuwen verzekering', // schadedossier
  'dak vernieuwen en schouw afbreken', // schouw
  'dak vernieuwen wanneer', // oriëntatie, geen koopmoment
]);
const geblokt = [];
for (const q of KOPER) for (const n of negs) if (blokkeert(n.t, n.ty, q)) { geblokt.push(`${q} <- ${n.t}`); if (!BEWUST_GEBLOKT.has(q)) fouten.push(`uitsluiting "${n.t}" blokkeert koper "${q}"`); }

/* ---------- Teksten ---------- */
const VERBODEN = [
  { re: /zonder (gedoe|stress|zorgen)|ontzorg|zorgeloos/i, waarom: 'zegt elke concurrent al' },
  { re: /van a ?(tot|-) ?z|één aanspreekpunt/i, waarom: 'zegt elke concurrent al' },
  { re: /\bpartner\b/i, waarom: 'meest gebruikte woord in de markt' },
  { re: /\b(geen|niet|zonder|nooit)\b/i, waarom: 'negatie-framing' },
  { re: /of bel/i, waarom: 'nummer is een eigen element' },
  { re: /willebroek/i, waarom: 'geen Willebroek-anker' },
  { re: /nr\.? ?1|#1|beste|sterren|review/i, waarom: 'claim die AB niet kan dragen (1 Google-review)' },
  { re: /!/, waarom: 'geen uitroepteken op search' },
  { re: /\b(?!EPDM\b)[A-Z]{4,}\b/, waarom: 'geen hoofdletterwoorden (EPDM is een productnaam)' },
  { re: /direct|meteen|onmiddellijk|binnen 24/i, waarom: 'de calculator toont geen bedrag; AB belt met de prijs' },
  // Mohammed 23 sep: de regio is een targeting-instelling, geen tekst ('Platte daken rond Antwerpen' = fout).
  // Een gemeente in een kop mag alleen via {LOCATION(City):...}.
  { re: /\b(rond|omgeving|regio|provincie|antwerpen|mechelen|willebroek|boom|lier|bornem|puurs|kontich|rupelstreek|vlaanderen)\b/i, waarom: 'regio of plaatsnaam in de tekst; gebruik {LOCATION(City):uw regio}', zonderLocatie: true },
];
// {LOCATION(City):standaard} telt voor de lengte als de standaardtekst; een te lange gemeente
// valt bij Google zelf terug op die standaardtekst.
const LOCATIE = /\{LOCATION\(City\):([^}]*)\}|\{KeyWord:([^}]*)\}/g;
// 25 sep: {KeyWord:standaard} telt net als de locatie als zijn standaardtekst; een te lang
// zoekwoord valt bij Google terug op die standaard. Het zoekwoord zelf komt uit de eigen
// zoekwoordenlijst en draagt dus geen plaatsnaam.
// Elke claim met een getal moet letterlijk op /lp/dakwerken staan (inhoud.ts, cf9ea56).
const TOEGESTAAN_GETAL = [/\b2 minuten\b/, /6%/, /\b(10|tien) jaar\b/i, /\b15 jaar\b/, /\b(6|zes) (korte )?vragen\b/i, /\b10\+ jaar\b/];

function toets(tekst, max, soort) {
  const zichtbaar = tekst.replace(LOCATIE, (_, loc, kw) => loc ?? kw);
  /* Invoeging met een ander formaat dan deze twee (bv. {KEYWORD:...} of {Keyword:...})
     verandert de hoofdletters; alleen {KeyWord:} en {LOCATION(City):} zijn afgesproken. */
  if (/\{(?!KeyWord:|LOCATION\(City\):)[^}]*\}/.test(tekst)) fouten.push(`${soort} "${tekst}": onbekende invoeging`);
  if (zichtbaar.length > max) fouten.push(`${soort} ${zichtbaar.length}/${max} tekens: "${tekst}"`);
  const zonder = tekst.replace(LOCATIE, '');
  for (const v of VERBODEN) if (v.re.test(v.zonderLocatie ? zonder : zichtbaar)) fouten.push(`${soort} "${tekst}": ${v.waarom}`);
  if (/\d/.test(tekst) && !TOEGESTAAN_GETAL.some((re) => re.test(tekst))) fouten.push(`${soort} "${tekst}": getal zonder bron op de landingspagina`);
}

const alleKoppen = new Map();
for (const [naam, g] of Object.entries(GROEPEN)) {
  if (g.koppen.length !== 15) fouten.push(`${naam}: ${g.koppen.length} koppen, verwacht 15`);
  if (g.beschrijvingen.length !== 4) fouten.push(`${naam}: ${g.beschrijvingen.length} beschrijvingen, verwacht 4`);
  if (new Set(g.koppen.map((k) => k.toLowerCase())).size !== g.koppen.length) fouten.push(`${naam}: dubbele kop`);
  const vragen = g.koppen.filter((k) => k.includes('?')).length;
  if (vragen > 7) fouten.push(`${naam}: ${vragen} vraagkoppen, maximaal de helft`);
  for (const k of g.koppen) {
    toets(k, 30, `kop (${naam})`);
    const al = alleKoppen.get(k.toLowerCase());
    if (al) fouten.push(`kop "${k}" staat in ${al} en ${naam}: geen stempel over een set`);
    alleKoppen.set(k.toLowerCase(), naam);
  }
  for (const b of g.beschrijvingen) toets(b, 90, `beschrijving (${naam})`);
  for (const p of g.pad) if (p.length > 15) fouten.push(`pad "${p}" te lang`);
  // Kop 1 moet het zoekwoord van de groep dragen.
  if (!g.koppen[0].toLowerCase().includes(naam.toLowerCase().replace('hellend ', ''))) fouten.push(`${naam}: kop 1 "${g.koppen[0]}" draagt het zoekwoord niet`);
}
for (const s of SITELINKS) { toets(s.tekst, 25, 'sitelink'); toets(s.r1, 35, 'sitelinkregel'); toets(s.r2, 35, 'sitelinkregel'); }
if (new Set(SITELINKS.map((s) => s.url)).size !== SITELINKS.length) fouten.push('twee sitelinks met dezelfde URL');
for (const h of HIGHLIGHTS) toets(h, 25, 'highlight');
for (const s of SNIPPETS) {
  if (s.waarden.length < 3) fouten.push(`snippet ${s.kop}: minstens 3 waarden`);
  for (const w of s.waarden) { if (w.length > 25) fouten.push(`snippetwaarde te lang: ${w}`); toets(w, 25, `snippet ${s.kop}`); }
}
/* Positieve controle op de invoeging: een te lange standaardtekst moet vallen. */
{ const voor = fouten.length; toets('{KeyWord:Dit is een veel te lange standaardkop}', 30, 'controle'); if (fouten.length === voor) { console.error('TOETS DEFECT: KeyWord-lengte wordt niet gemeten'); process.exit(2); } fouten.pop(); }

if (fouten.length) { for (const f of fouten) console.error('FOUT: ' + f); process.exit(1); }

/* ---------- Plak-klare lijsten ---------- */
const plak = (t, ty) => (ty === 'e' ? `[${t}]` : `"${t}"`);
for (const [naam, g] of Object.entries(GROEPEN)) {
  const slug = naam.split(' ')[0].toLowerCase();
  fs.writeFileSync(path.join(MAP, `1-zoekwoorden-${slug}.txt`), g.zoekwoorden.map(([t, ty]) => plak(t, ty)).join('\n') + '\n');
  fs.writeFileSync(path.join(MAP, `2-uitsluiten-${slug}.txt`), g.kruis.map((t) => `"${t}"`).join('\n') + '\n');
}
fs.writeFileSync(path.join(MAP, '2-uitsluiten-campagne.txt'), negs.map((n) => plak(n.t, n.ty)).join('\n') + '\n');
fs.writeFileSync(path.join(MAP, '3-advertenties.json'), JSON.stringify({ url: URL, groepen: GROEPEN, sitelinks: SITELINKS, highlights: HIGHLIGHTS, snippet: SNIPPET, snippets: SNIPPETS }, null, 2) + '\n');

console.log(`Groen. ${Object.values(GROEPEN).reduce((s, g) => s + g.zoekwoorden.length, 0)} zoekwoorden, ${negs.length} campagne-uitsluitingen, 2 advertenties.`);
console.log(`Koperzoekopdrachten: ${KOPER.length} getoetst, ${geblokt.length} bewust geblokkeerd:`);
for (const g of geblokt) console.log('  ' + g);
