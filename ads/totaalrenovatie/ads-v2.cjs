/**
 * De advertenties, gebouwd op wat gemeten is in plaats van op wat goed klinkt.
 *
 * Meting 15 sep 2026 — 129 advertenties van 38 adverteerders op de Belgische
 * zoekresultaten (ads/totaalrenovatie/6-serp-concurrenten.txt) plus 18
 * landingspagina's van de concurrenten die het langst adverteren.
 *
 * Wat vol zit, en dus niets oplevert:
 *   één aanspreekpunt / A tot Z   15 van de 38 bedrijven
 *   ontzorgen / zonder stress     13 van de 38
 *   X jaar ervaring               11 van de 38
 * Verelst zegt dat ook, 1095 dagen lang, met 40 advertenties die alle 40 nog
 * lopen. Die zin is van hen gekocht met 45 jaar. AB die hem herhaalt is de
 * goedkopere versie van Verelst.
 *
 * Wat leeg staat, en wél bewezen is door de langstlopende advertenties:
 *   premie of btw    1 van de 38 —  Kijzer, 328 dagen, 150.000-175.000 vertoningen
 *   garantie         2 van de 38 —  KwadrO, 585 dagen
 *   eigen personeel  2 van de 38 —  Tifre, 771 dagen
 *   prijs berekenen  3 van de 38 —  Rinovato, 282 dagen
 *   snelheid met een getal  4 van de 38 — Reno X en Grava "binnen 48 uur"
 *
 * AB heeft alle vijf echt: het btw-tarief, de tienjarige aansprakelijkheid met
 * VCA-attest, eigen ploegen, de calculator, en het plaatsbezoek binnen vijf
 * werkdagen. Daarom drie groepen op die drie hoeken, niet op ontzorgen.
 *
 * Draaien: node ads/totaalrenovatie/ads-v2.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const MAP = __dirname;
const KOP_MAX = 30, OMS_MAX = 90;
const CAMPAGNE = 'AB Bouw — Totaalrenovatie — Search';
const URL = 'https://abgroep.be/lp/totaalrenovatie';

/* Drie koppen die in elke groep mee mogen: ze gaan over wat AB doet, niet over
   wat AB belooft. */
const GEDEELD = [
  'Gratis plaatsbezoek',
  'Eigen ploeg op de werf',
  'AB Bouw Groep',
];

const GROEPEN = [
  {
    naam: 'Btw-voordeel',
    eigen: [
      'Ziet u op tegen papierwerk?',
      '6% btw in plaats van 21%',
      'Wij regelen uw btw-dossier',
      'Woning ouder dan tien jaar?',
      'Btw-begeleiding inbegrepen',
      'Scheelt 15% op de factuur',
      'Uw renovatie aan 6% btw',
      'Van afbraak tot oplevering',
    ],
    oms: [
      'Bij een woning ouder dan tien jaar geldt 6% btw. Wij bekijken of u in aanmerking komt.',
      'Het papierwerk voor het btw-tarief nemen wij mee in uw dossier.',
      'Afbraak, ruwbouw, technieken en afwerking door onze eigen ploegen.',
      'Gratis plaatsbezoek in heel Vlaanderen. Wij bellen u binnen een werkdag.',
    ],
    pad: ['btw', 'renovatie'],
  },
  {
    naam: 'Prijsindicatie',
    eigen: [
      'Geen idee wat het gaat kosten?',
      'Wat kost uw renovatie?',
      'Prijsindicatie in 5 vragen',
      'Weet uw prijs in 2 minuten',
      'Uw renovatieprijs berekenen',
      'Prijs voor uw hele woning',
      'Vaste prijs na het bezoek',
      'Elke post apart op papier',
    ],
    oms: [
      'Klik vijf antwoorden aan en weet wat uw renovatie kost. U hoeft niets op te meten.',
      'U krijgt de volledige prijs op papier, met per onderdeel wat erin zit.',
      'Afbraak, ruwbouw, technieken en afwerking door onze eigen ploegen.',
      'Gratis plaatsbezoek in heel Vlaanderen. Wij bellen u binnen een werkdag.',
    ],
    pad: ['prijs', 'renovatie'],
  },
  {
    /* NIEUW. Twee van de 38 adverteerders noemen garantie, twee noemen eigen
       personeel. KwadrO draait zijn garantie-advertentie 585 dagen, Tifre zijn
       "alles met eigen personeel" 771 dagen. Dit is de meest open hoek. */
    naam: 'Zekerheid',
    eigen: [
      'Wie staat er op uw werf?',
      'Eigen ploeg, dezelfde mensen',
      'Tienjarige aansprakelijkheid',
      'VCA-gecertificeerd, verzekerd',
      'Zes vakken, één ploeg',
      'Plaatsbezoek binnen 5 dagen',
      'Eén planning voor de hele werf',
      'Uw renovatie, onze mensen',
    ],
    oms: [
      'Afbraak, ruwbouw, technieken en afwerking door onze eigen ploegen.',
      'Tienjarige aansprakelijkheid en een VCA-attest. De werf is verzekerd.',
      'Plaatsbezoek binnen vijf werkdagen: opmeten, foto\'s en de knelpunten op papier.',
      'Gratis plaatsbezoek in heel Vlaanderen. Wij bellen u binnen een werkdag.',
    ],
    pad: ['eigen-ploeg', 'renovatie'],
  },
];

const veld = (s) => (/[",\n]/.test(s) ? '"' + String(s).split('"').join('""') + '"' : s);

/* Zinnen die Mohammed eerder afkeurde of die de hele markt al zegt. Een kop die
   hierin valt, gaat er niet op. */
const VERBODEN = [
  { re: /zonder (gedoe|stress|zorgen)|ontzorg|zorgeloos/i, waarom: '13 van de 38 concurrenten zeggen dit al' },
  { re: /van a ?(tot|-) ?z|één aanspreekpunt/i, waarom: '15 van de 38 concurrenten zeggen dit al' },
  { re: /\bpartner\b/i, waarom: 'het meest gebruikte woord in de hele set' },
  { re: /\bniet\b.*\bmaar\b|geen .* maar /i, waarom: 'negatie-framing' },
  { re: /of bel/i, waarom: 'nummer hoort een eigen element te zijn' },
];

const fouten = [];
const rijen = [['Campaign', 'Ad Group', 'Ad type',
  ...Array.from({ length: 11 }, (_, i) => `Headline ${i + 1}`),
  ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
  'Final URL', 'Path 1', 'Path 2'].join(',')];

for (const g of GROEPEN) {
  const koppen = [...g.eigen, ...GEDEELD];
  for (const k of koppen) {
    if (k.length > KOP_MAX) fouten.push(`kop ${k.length} tekens: ${k}`);
    for (const v of VERBODEN) if (v.re.test(k)) fouten.push(`kop "${k}": ${v.waarom}`);
  }
  for (const o of g.oms) {
    if (o.length > OMS_MAX) fouten.push(`omschrijving ${o.length} tekens: ${o}`);
    for (const v of VERBODEN) if (v.re.test(o)) fouten.push(`omschrijving "${o.slice(0, 40)}…": ${v.waarom}`);
  }
  if (koppen.length !== 11) fouten.push(`${g.naam}: ${koppen.length} koppen, verwacht 11`);
  rijen.push([CAMPAGNE, g.naam, 'Responsive search ad', ...koppen, ...g.oms, URL, ...g.pad]
    .map(veld).join(','));
}

if (fouten.length) { for (const f of fouten) console.error('FOUT: ' + f); process.exit(1); }

fs.writeFileSync(path.join(MAP, '2-advertenties.csv'), rijen.join('\n') + '\n');
console.log(`${GROEPEN.length} advertentiegroepen geschreven, ${GROEPEN.length * 11} koppen, ${GROEPEN.length * 4} omschrijvingen`);
console.log('gebouwd op de lege hoeken: btw, prijs, zekerheid — niet op ontzorgen');
