/**
 * Alle Belgische bouw-adverteerders uit het register van Google halen, met per
 * advertentie de begindatum en de laatste dag dat hij te zien was.
 *
 * Waarom opnieuw: de vorige twee pogingen vertrokken van domeinen uit organische
 * zoekresultaten. Die bedrijven adverteren grotendeels niet — 93 domeinen leverden
 * 11 adverteerders op. De adverteerders staan in het register van Google zelf, en
 * dat register is gewoon te bevragen:
 *
 *   SearchService/SearchSuggestions   naam of domein  -> adverteerders met hun id
 *   SearchService/SearchCreatives     adverteerder-id -> al zijn advertenties
 *
 * SearchCreatives geeft per advertentie meteen "voor het eerst getoond" en "voor
 * het laatst weergegeven" als tijdstempels. Er hoeft dus geen detailpagina meer
 * geopend te worden: één verzoek per adverteerder in plaats van één per
 * advertentie.
 *
 * Draaien: node oogst-register.cjs <uit.json>
 */
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const UIT = process.argv[2] || 'register.json';

/* Woorden die in de naam of het domein van een Belgisch bouwbedrijf zitten.
   Het register zoekt op naam, dus dit zijn geen zoekopdrachten van klanten maar
   bedrijfsnaam-fragmenten. */
const TERMEN = [
  'renovatie', 'renovaties', 'renovatiewerken', 'renoveren', 'renov', 'reno',
  'totaalrenovatie', 'woningrenovatie', 'huisrenovatie', 'binnenrenovatie',
  'energierenovatie', 'verbouw', 'verbouwen', 'verbouwingen',
  'bouw', 'bouwbedrijf', 'bouwwerken', 'bouwonderneming', 'bouwgroep',
  'algemene bouw', 'woningbouw', 'projectbouw', 'nieuwbouw', 'bouwteam',
  'aannemer', 'aannemingen', 'aannemingsbedrijf', 'aanneming',
  'dakwerken', 'dakwerker', 'daken', 'dakrenovatie', 'zinkwerken',
  'gevel', 'gevelwerken', 'gevelrenovatie', 'crepi', 'isolatie',
  'schrijnwerk', 'schrijnwerkerij', 'timmerwerken',
  'interieur', 'interieurbouw', 'maatwerk',
  'badkamer', 'badkamerrenovatie', 'keuken', 'keukens', 'sanitair',
  'ramen', 'ramen en deuren', 'pleisterwerken', 'bezetting', 'chape',
  'vloeren', 'tegelwerken', 'elektriciteit',
  'construct', 'constructions', 'bouwprojecten', 'klusbedrijf',
  'sleutel op de deur', 'casco', 'afwerking', 'bouwadvies',
];

/* Alleen bedrijven waarvan de naam of het domein naar de bouw wijst. Het
   register geeft ook naamgenoten terug die iets heel anders doen. */
const BOUWWOORD = /renov|verbouw|bouw|aannem|dak|gevel|schrijnwerk|timmer|interieur|badkamer|keuken|sanitair|raam|ramen|deuren|pleister|bezet|chape|vloer|tegel|isolat|crepi|construct|klus|woning|zink|maatwerk/i;

const wacht = (ms) => new Promise((k) => setTimeout(k, ms));

/* Het antwoord noemt velden bij nummer. Deze namen komen uit de waargenomen
   antwoorden: 6 is de eerste vertoning, 7 de laatste, 3 draagt de inhoud. */
const soortVan = (inhoud) => {
  if (!inhoud) return 'onbekend';
  if (inhoud['1']) return 'tekst';
  if (inhoud['2']) return 'video';
  if (inhoud['3']) return 'beeld';
  return 'onbekend';
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const p = await browser.newPage();
    await p.goto('https://adstransparency.google.com/?region=BE',
      { waitUntil: 'networkidle2', timeout: 60000 });
    await wacht(2500);

    /* De verzoeken lopen vanuit de pagina zelf, zodat ze de juiste herkomst en
       koekjes meekrijgen. */
    await p.evaluate(() => {
      window.__rpc = async (naam, payload) => {
        const r = await fetch(`https://adstransparency.google.com/anji/_/rpc/${naam}?authuser=`, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: 'f.req=' + encodeURIComponent(JSON.stringify(payload)),
        });
        return r.json();
      };
    });

    /* Ronde 1 — wie adverteert er. */
    const bedrijven = new Map();
    for (const term of TERMEN) {
      let gevonden = 0;
      try {
        const antwoord = await p.evaluate((t) =>
          window.__rpc('SearchService/SearchSuggestions',
            { 1: t, 2: 60, 3: 60, 4: [2056], 5: { 1: 1 } }), term);
        for (const rij of antwoord['1'] || []) {
          const a = rij['1'];
          if (!a || a['3'] !== 'BE') continue;
          const naam = a['1'] || '';
          if (!BOUWWOORD.test(naam)) continue;
          const aantal = Number(((a['4'] || {})['2'] || {})['1'] || 0);
          if (!bedrijven.has(a['2'])) { bedrijven.set(a['2'], { id: a['2'], naam, aantal, term }); gevonden++; }
        }
      } catch (e) { console.log(`  -- ${term}: ${String(e.message).slice(0, 50)}`); }
      console.log(`${String(gevonden).padStart(3)} nieuw · ${term}`);
      await wacht(260);
    }

    const lijst = [...bedrijven.values()].sort((a, b) => b.aantal - a.aantal);
    console.log(`\n${lijst.length} Belgische bouw-adverteerders in het register\n`);

    /* Ronde 2 — hun advertenties. */
    const alles = [];
    for (const [i, b] of lijst.entries()) {
      let ads = [];
      try {
        const antwoord = await p.evaluate((id) =>
          window.__rpc('SearchService/SearchCreatives', {
            2: 40,
            3: { 8: [2056], 12: { 1: '', 2: true }, 13: { 1: [id] } },
            7: { 1: 1, 2: 0, 3: 2008 },
          }), b.id);
        ads = (antwoord['1'] || []).map((c) => {
          const eerst = Number((c['6'] || {})['1'] || 0);
          const laatst = Number((c['7'] || {})['1'] || 0);
          return {
            cr: c['2'],
            soort: soortVan(c['3']),
            eerst, laatst,
            dagen: eerst && laatst ? Math.round((laatst - eerst) / 86400) : null,
            preview: ((c['3'] || {})['1'] || {})['4'] || null,
          };
        }).filter((c) => c.dagen !== null);
      } catch { /* deze adverteerder sloeg over */ }

      alles.push({ ...b, advertenties: ads });
      if ((i + 1) % 25 === 0 || i === lijst.length - 1) {
        const n = alles.reduce((s, x) => s + x.advertenties.length, 0);
        console.log(`${String(i + 1).padStart(4)}/${lijst.length}   ${n} advertenties gelezen`);
        fs.writeFileSync(UIT, JSON.stringify(alles, null, 1));
      }
      await wacht(120);
    }

    fs.writeFileSync(UIT, JSON.stringify(alles, null, 1));
    const n = alles.reduce((s, x) => s + x.advertenties.length, 0);
    const met = alles.filter((x) => x.advertenties.length).length;
    console.log(`\nKLAAR: ${n} advertenties over ${met} adverteerders`);
    if (n < 200) console.log('LET OP: minder dan 200 advertenties — te weinig om een patroon uit te lezen');
  } finally {
    await browser.close();
  }
})();
