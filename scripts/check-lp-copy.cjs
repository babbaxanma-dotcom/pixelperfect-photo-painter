#!/usr/bin/env node
/* Guard op de hero-copy van de landingspagina's.
 *
 * Waarom dit bestaat: Mohammed heeft dezelfde soort copy-fout meer dan eens
 * moeten aanwijzen, en een geschreven regel bleek niet te werken. 22 aug 2026
 * over de totaalrenovatie-lede: "super slehte onprofessionele copy". De zin
 * ging volledig over ons ("wij maken de planning, wij sturen alle vaklui aan")
 * en zei daarmee ongewild dat het werk wordt uitbesteed. Daarnaast stond in
 * 10 van de 14 lede's dezelfde stadjeslijst als vast sjabloonslot.
 *
 * TWEEDE CORRECTIE, zelfde dag. Ik verving die lede's door zinnen die openen
 * met een probleem van de klant en eindigen op een onthulling ("Een muur die
 * niet vlak is, ziet u pas als de verf erop staat"). Ook fout: "waarom wil je
 * landen, zeg gewoon professioneel wat er gedaan wordt". Dat is de
 * verkoperstoon-tell uit memory feedback_toon_vlak_niet_landen: elke zin
 * eindigt op een wending. De lede moet PLAT zijn en opsommen wat er gedaan
 * wordt. Geen probleemstelling, geen onthulling, geen slot dat moet landen.
 *
 * Deze guard faalt ook als hij niets te controleren vindt: een lege meting is
 * geen groen licht. Er draait een positieve controle mee die bewijst dat elke
 * regel kan vuren.
 */
const fs = require('node:fs');
const path = require('node:path');

const BRON = path.join(__dirname, '..', 'src', 'pages', 'abbouw', 'lp', 'LpDienst.tsx');

/* ── de regels ───────────────────────────────────────────────────────────── */
const REGELS = [
  {
    naam: 'stadjeslijst als sjabloonslot',
    /* de steden mogen op de pagina staan (de regio-FAQ), maar niet als vaste
       staart aan elke lede geplakt */
    test: (t) => /in Mechelen, Antwerpen, Lier en heel Vlaanderen/i.test(t),
    uitleg: 'zet de regio in de "Werken jullie in mijn regio?"-FAQ, niet in de lede',
  },
  {
    naam: 'lede opent over onszelf',
    test: (t) => /^(Wij|We|Ons|Onze)\b/.test(t.trim()),
    uitleg: 'noem plat wat er gedaan wordt, niet wat wij allemaal doen',
  },
  {
    naam: 'zin die wil landen',
    /* onthullingsconstructies: de zin bouwt op naar een wending in plaats van
       te zeggen wat er gedaan wordt */
    test: (t) => /\b(ziet u|merkt u|weet u|voelt u)\b|\bpas als\b|en dat blijft zo/i.test(t),
    uitleg: 'geen onthulling of wending; zeg plat wat er gedaan wordt en stop daar',
  },
  {
    naam: 'werk wordt uitbesteed',
    /* "vaklui aansturen" / "onderaannemers coordineren" leest als middenman en
       ondergraaft de eigen ploeg — precies de angst bij een totaalrenovatie */
    test: (t) => /vaklui aan|vakmensen aan|onderaannemers? (aan|co[oö]rdin)/i.test(t),
    uitleg: 'dit zegt dat het werk wordt uitbesteed; noem wat de klant krijgt',
  },
  {
    naam: 'em-dash',
    test: (t) => t.includes('—'),
    uitleg: 'em-dash is een vibe-coded tell; gebruik een punt of een komma',
  },
  {
    naam: 'tautologie pleisterwerk',
    test: (t) => /pleisterwerk,\s*bepleistering/i.test(t),
    uitleg: 'pleisterwerk en bepleistering zijn hetzelfde woord',
  },
];

/* ── invoer ──────────────────────────────────────────────────────────────── */
if (!fs.existsSync(BRON)) {
  console.error(`FOUT: ${BRON} bestaat niet`);
  process.exit(1);
}
const src = fs.readFileSync(BRON, 'utf8');

/* haal de hero-copy op: slug + h1 + sub. Anker op de veldnamen, niet op
   commentaar of volgorde. */
const velden = (naam) => [...src.matchAll(new RegExp(`^\\s*${naam}: '((?:[^'\\\\]|\\\\.)*)'`, 'gm'))]
  .map((m) => m[1].replace(/\\'/g, "'"));

const slugs = velden('slug');
const koppen = velden('h1');
const ledes = velden('sub');
/* offerH2 is de kop boven het aanbodblok. Die stond eerst niet in deze guard,
   en daardoor bleef "Een vlakke muur ziet u pas als de verf erop zit" staan:
   exact de onthullingsconstructie die uit de lede moest. Een guard die maar de
   helft van de copy leest geeft groen zonder iets te bewijzen. */
const aanbodkoppen = velden('offerH2');
/* DERDE CORRECTIE, 26 aug 2026: "alle website hebben ... aan vaste prijs, ik zei
   toch niet die domme copy". De metaTitle is de kop in de zoekresultaten, dus
   dat is de hook-positie bij uitstek, en daar stond op 10 van de 14 pagina's
   dezelfde staart. In de metaDesc was het 12 van de 14. Deze guard las alleen
   h1, sub en offerH2 en meldde daarom "schoon" terwijl de stempel er stond.
   Een guard die de helft van de copy niet leest, bewijst niets. */
const metatitels = velden('metaTitle');
const metadescs = velden('metaDesc');

/* lege meting = ongeldige meting */
const MINIMUM = 10;
if (ledes.length < MINIMUM || koppen.length < MINIMUM) {
  console.error(`FOUT: maar ${koppen.length} koppen en ${ledes.length} lede's gevonden, minstens ${MINIMUM} verwacht.`);
  console.error('De guard heeft de copy niet kunnen lezen; dat is geen groen licht.');
  process.exit(1);
}

/* ── positieve controle: bewijst dat elke regel kan vuren ─────────────────── */
const LOKAAS = {
  'stadjeslijst als sjabloonslot': 'Crepi in Mechelen, Antwerpen, Lier en heel Vlaanderen.',
  'lede opent over onszelf': 'Wij doen dit al jaren voor u.',
  'zin die wil landen': 'Een muur die niet vlak is, ziet u pas als de verf erop staat.',
  'werk wordt uitbesteed': 'Wij sturen alle vaklui aan tot de oplevering.',
  'em-dash': 'Strak gelegd — tot in de hoek.',
  'tautologie pleisterwerk': 'Pleisterwerk, bepleistering en gyproc.',
};
for (const r of REGELS) {
  if (!r.test(LOKAAS[r.naam])) {
    console.error(`FOUT: positieve controle faalt voor "${r.naam}" — de regel kan niet vuren, dus meet niets.`);
    process.exit(1);
  }
}

/* ── reviews: klanttaal, geen bedrijfstaal ────────────────────────────────────
 * VIERDE CORRECTIE, 27 aug 2026: "alsof de eigenaar het typt, echt dingen uit
 * het bedrijf". Gemeten: 13 van de 42 reviews gebruikten woorden die een klant
 * nooit typt, of herhaalden letterlijk een verkoopargument van AB. Een review
 * die "de offerte klopte met de eindafrekening" zegt, is het bedrijf dat door
 * de klant heen praat. Dat leest als verzonnen, ook als hij echt is.
 */
const KLANT_ZEGT_NIET = [
  'meerwerk', 'offerte', 'projectleider', 'oplevering', 'plaatsbezoek', 'vaste prijs',
  'aanspreekpunt', 'op papier', 'grootformaat', 'geen verrassingen', 'zoals afgesproken',
  'zoals gezegd', 'eigen ploeg', 'onderaannemer',
];
const reviews = [...src.matchAll(/text: '"([^"]+)"'/g)].map((m) => m[1]);
if (reviews.length < 20) {
  console.error(`FOUT: maar ${reviews.length} reviews gevonden; dat is geen geldige meting.`);
  process.exit(1);
}
/* positieve controle */
if (!KLANT_ZEGT_NIET.some((w) => 'De offerte klopte met de eindafrekening.'.toLowerCase().includes(w))) {
  console.error('FOUT: positieve controle faalt voor de reviewregel.');
  process.exit(1);
}
/* VIJFDE CORRECTIE, zelfde dag: "en zijn niet blijven plakken???? even serieus,
 * je genereert enkel AI slop". Toen ik de bedrijfstaal wegnam schreef ik er
 * geforceerd-volkse taal voor in de plaats: krachtzinnetjes en pointes. Een
 * echte Google-review is kort, feitelijk en een beetje saai; hij eindigt op
 * "Heel tevreden", niet op een wending. Daarom ook een lengtegrens: de
 * gemiddelde echte review hier is 117 tekens, en alles boven 190 bleek een
 * verhaaltje van mij te zijn. */
const KRACHTZIN = [
  'blijven plakken', 'zei wel iets', 'siert hen', 'niet aan gedacht', 'doorbijten',
  'mag er zijn', 'buurvrouw', 'wat ik het meest', 'daar moet je op voorbereid',
  'dat scheelt een hoop', 'ook van dichtbij',
];
const MAX_REVIEW = 190;
/* positieve controle op allebei de regels */
if (!KRACHTZIN.some((w) => 'zijn niet blijven plakken'.includes(w))) {
  console.error('FOUT: positieve controle faalt voor de krachtzin-regel.');
  process.exit(1);
}
for (const r of reviews) {
  const zakelijk = KLANT_ZEGT_NIET.filter((w) => r.toLowerCase().includes(w));
  if (zakelijk.length) {
    bevindingen.push({
      slug: 'review', waar: 'reviews', regel: `bedrijfstaal in de mond van de klant: ${zakelijk.join(', ')}`,
      uitleg: 'een klant typt dit niet; zo leest de review als door het bedrijf geschreven',
      tekst: r,
    });
  }
  const pointe = KRACHTZIN.filter((w) => r.toLowerCase().includes(w));
  if (pointe.length) {
    bevindingen.push({
      slug: 'review', waar: 'reviews', regel: `bedacht krachtzinnetje: ${pointe.join(', ')}`,
      uitleg: 'echte reviews eindigen plat, niet op een pointe',
      tekst: r,
    });
  }
  if (r.length > MAX_REVIEW) {
    bevindingen.push({
      slug: 'review', waar: 'reviews', regel: `te lang: ${r.length} tekens`,
      uitleg: `boven ${MAX_REVIEW} tekens wordt het een verhaaltje; echte reviews hier zijn gemiddeld 117`,
      tekst: r,
    });
  }
}

/* ── de meting ───────────────────────────────────────────────────────────── */
const bevindingen = [];
const telling = {};
const kijk = (slug, waar, tekst) => {
  for (const r of REGELS) {
    if (r.test(tekst)) bevindingen.push({ slug, waar, regel: r.naam, uitleg: r.uitleg, tekst });
  }
};
for (let i = 0; i < ledes.length; i++) {
  const slug = slugs[i] || `#${i + 1}`;
  if (koppen[i]) kijk(slug, 'h1', koppen[i]);
  kijk(slug, 'sub', ledes[i]);
  if (aanbodkoppen[i]) kijk(slug, 'offerH2', aanbodkoppen[i]);
  if (metatitels[i]) kijk(slug, 'metaTitle', metatitels[i]);
  if (metadescs[i]) kijk(slug, 'metaDesc', metadescs[i]);
}

/* Lengte van de zoekresultaat-kop. Boven 60 tekens kapt Google hem af, en dan
   valt net het stuk weg dat de klik moet verdienen. */
for (let i = 0; i < metatitels.length; i++) {
  if (metatitels[i].length > 60) {
    bevindingen.push({
      slug: slugs[i] || `#${i + 1}`, waar: 'metaTitle', regel: 'te lang voor Google',
      uitleg: `${metatitels[i].length} tekens; boven 60 wordt hij afgekapt`,
      tekst: metatitels[i],
    });
  }
}

/* ── de telpoort ─────────────────────────────────────────────────────────────
 * Uit memory feedback_copy_no_template_slots: een kernfrase mag in hoogstens 3
 * van de sets staan. Staat hij vaker, dan is het geen propositie meer maar een
 * sjabloonslot met een verwisseld zelfstandig naamwoord. De per-regel-checks
 * hierboven vangen dat niet, want elke losse zin is dan op zichzelf in orde. */
const KERNFRASES = ['vaste prijs', 'offerte', 'plaatsbezoek', 'werkdag',
  'eigen ploeg', '6% btw', 'heel Vlaanderen'];
const MAX_SETS = 3;

/* De telpoort draait nu over DRIE velden apart. Eerst liep hij alleen over
   h1 + sub, en juist daardoor bleef de stempel in metaTitle en metaDesc staan:
   elke losse titel was op zichzelf in orde, alleen stonden ze alle tien
   hetzelfde te zeggen. */
const POORTEN = [
  { naam: 'hero', velden: [koppen, ledes] },
  { naam: 'metaTitle', velden: [metatitels] },
  { naam: 'metaDesc', velden: [metadescs] },
];

for (const poort of POORTEN) {
  const teller = {};
  for (let i = 0; i < ledes.length; i++) {
    const slug = slugs[i] || `#${i + 1}`;
    const tekst = poort.velden.map((v) => v[i] || '').join(' ');
    for (const f of KERNFRASES) {
      if (tekst.toLowerCase().includes(f.toLowerCase())) {
        (teller[f] || (teller[f] = [])).push(slug);
      }
    }
  }
  for (const [f, waar] of Object.entries(teller)) {
    telling[`${poort.naam}:${f}`] = waar;
    if (waar.length > MAX_SETS) {
      bevindingen.push({
        slug: `${waar.length} pagina's`,
        waar: `telpoort ${poort.naam}`,
        regel: `kernfrase "${f}" gestempeld`,
        uitleg: `mag in maximaal ${MAX_SETS} van de ${poort.naam}-velden staan; nu in ${waar.slice(0, 6).join(', ')}${waar.length > 6 ? '...' : ''}`,
        tekst: f,
      });
    }
  }
}

/* ── het telefoonnummer ──────────────────────────────────────────────────────
 * Mohammed heeft "of bel <nummer>" onder een knop meermaals "super lelijk"
 * genoemd, en ik heb het daarna nog herhaald op ENS, AB en Norvo. De guard die
 * daarvoor bestond (check-kaarten.cjs) is bij de pc-migratie verdwenen, en het
 * patroon stond op 22 aug 2026 weer op de LP als "Liever bellen? <nummer>".
 * Het nummer is een volwaardig eigen element, nooit een staart. */
const TEL_TELLS = [
  { patroon: /of bel\s*\{?PHONE/i, naam: '"of bel <nummer>"' },
  { patroon: /Liever bellen\?\s*\{PHONE\}/i, naam: '"Liever bellen? <nummer>"' },
  /* $ uitgesloten, anders vuurt dit op de foutmelding `Bel ons gerust op
     ${PHONE}` in een template literal. Dat is een terugvalzin bij een mislukte
     verzending, geen ontwerppatroon onder een knop. */
  { patroon: /bel(?:len)?[^<>{}\n$]{0,20}\{PHONE\}/i, naam: 'bel-zin direct voor {PHONE}' },
];
/* positieve controle */
for (const t of TEL_TELLS) {
  const lokaas = { '"of bel <nummer>"': 'of bel {PHONE}', '"Liever bellen? <nummer>"': 'Liever bellen? {PHONE}', 'bel-zin direct voor {PHONE}': 'Liever bellen? {PHONE}' }[t.naam];
  if (!t.patroon.test(lokaas)) {
    console.error(`FOUT: positieve controle faalt voor ${t.naam}`);
    process.exit(1);
  }
}
if (!src.includes('{PHONE}')) {
  console.error('FOUT: {PHONE} komt niet voor in de bron; de telefooncheck meet niets.');
  process.exit(1);
}
for (const t of TEL_TELLS) {
  if (t.patroon.test(src)) {
    bevindingen.push({
      slug: 'aanvraagkaart', waar: 'markup', regel: `telefoonnummer als staart: ${t.naam}`,
      uitleg: 'geef het nummer een eigen element; nooit een zin met "bel" er direct voor',
      tekst: t.naam,
    });
  }
}

console.log(`hero-copy gecontroleerd: ${koppen.length} koppen, ${ledes.length} lede's, ${REGELS.length} regels + telpoort + telefooncheck`);

if (!bevindingen.length) {
  console.log('schoon');
  process.exit(0);
}

console.error(`\n${bevindingen.length} bevinding(en):\n`);
for (const b of bevindingen) {
  console.error(`  ${b.slug} · ${b.waar} · ${b.regel}`);
  console.error(`    "${b.tekst.slice(0, 110)}${b.tekst.length > 110 ? '...' : ''}"`);
  console.error(`    ${b.uitleg}\n`);
}
process.exit(1);
