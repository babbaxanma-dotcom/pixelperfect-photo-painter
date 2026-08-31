#!/usr/bin/env node
/**
 * Guard op de copy van de replica-landingspagina's (inhoud.ts).
 *
 * Aanleiding: Mohammed heeft dezelfde soort tekst nu meermaals moeten
 * afkeuren, met eigen woorden erbij. "Zes divisies, 120+ realisaties" noemde
 * hij "de definitieve van AI flat copy". Over "Vier dingen die vastliggen" en
 * "Alle vijf de onderdelen": "zoveel dit, zoveel dat — dit is precies wat ik
 * bedoel met AI flatness". Een geschreven regel bleek niet te volstaan, dus
 * staat hij hier als check die vóór elke uitlevering draait.
 *
 * Wat hier getoetst wordt zijn de patronen die hij herkent, niet de smaak:
 *   1. telzinnen  — "zes divisies", "vijf onderdelen", "3 stappen"
 *   2. negatie-framing — "geen X maar Y", "niet alleen", "in plaats van"
 *   3. hedge-woorden — mogelijk, waarschijnlijk, eventueel, misschien
 *   4. cijfers en termijnen die nergens uit de site komen
 *
 * UITZONDERINGEN staan hieronder met de reden erbij. Dat zijn zinnen die
 * Mohammed zelf heeft goedgekeurd en die al live staan; ze stilzwijgend uit de
 * regex houden zou het patroon onzichtbaar maken.
 *
 * De guard faalt ook als hij niets te lezen vindt: een lege meting is geen
 * groen licht. Er draait een positieve controle mee die bewijst dat elke regel
 * kan vuren.
 *
 * Draaien: node scripts/check-replica-copy.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const BRON = path.join(__dirname, '..', 'src/pages/abbouw/lp/replica/inhoud.ts');

/**
 * Getallen en termijnen die op de site zelf staan en dus geen belofte zijn die
 * ik erbij verzin. Bron: LpDienst.tsx (dienst badkamerrenovatie en
 * totaalrenovatie) en de bestaande, goedgekeurde totaalrenovatiepagina.
 */
const GEDEKTE_FEITEN = [
  '6%', '21%', '10 jaar', 'tien jaar', '30 jaar', '50 jaar',
  'vijf werkdagen', '5 werkdagen', 'twee tot drie weken',
  '90 m²', '120 m²', '160 m²', '200 m²',
  '4,9', '120+', 'drie maanden',
];

/**
 * Zinnen die Mohammed heeft goedgekeurd en die live staan. Ze breken wel een
 * regel, maar ze zijn van hem — niet stilzwijgend wegfilteren, wel benoemen.
 */
const UITZONDERINGEN = [
  {
    tekst: '6% btw in plaats van 21%',
    reden: 'staat live op de totaalrenovatiepagina en is door Mohammed goedgekeurd',
  },
  {
    tekst: 'Bij een totaalrenovatie werken die zes op dezelfde werf',
    reden: 'verwijst naar de divisielijst er direct boven; door Mohammed gelaten na de "zes divisies"-correctie',
  },
];

const REGELS = [
  {
    naam: 'telzin',
    /* Een getal plus een verzamelnaam als kop of openingszin. Precies de vorm
       die hij drie keer heeft laten schrappen. */
    test: (t) => /\b(twee|drie|vier|vijf|zes|zeven|acht|negen|\d+)\s+(divisies?|onderdelen|stappen|redenen|punten|zekerheden|dingen|voordelen|pijlers)\b/i.exec(t),
    uitleg: 'noem wat het is, niet hoeveel het er zijn',
    slecht: 'Vijf onderdelen die vastliggen',
  },
  {
    naam: 'negatie-framing',
    test: (t) => /\bgeen\s+[\wé]+(,)?\s+maar\b|\bniet alleen\b|\bin plaats van\b|\bzonder dat u\b/i.exec(t),
    uitleg: 'zeg wat het wél is; een zin die zich afzet tegen iets anders leest als reclame',
    slecht: 'Geen onderaannemers, maar onze eigen ploeg',
  },
  {
    naam: 'hedge-woord',
    /* "mogelijk" staat er apart in. Als bijwoord is het een slag om de arm
       ("wij komen mogelijk langs"), maar "zo snel mogelijk" en "wat er mogelijk
       is" zijn gewoon Nederlands en staan zo in de goedgekeurde copy. Alleen de
       bijwoordelijke vorm telt. */
    test: (t) => /\b(waarschijnlijk|eventueel|misschien|doorgaans|allicht)\b/i.exec(t)
      || /\bmogelijk\b(?!\s+is\b)(?<!\bzo snel mogelijk)/i.exec(t.replace(/zo snel mogelijk/gi, '')),
    uitleg: 'schrijf wat er gebeurt, of laat de zin weg',
    slecht: 'Wij komen eventueel langs om op te meten.',
  },
  {
    naam: 'ongedekt cijfer',
    /* Elk getal met een eenheid dat niet in GEDEKTE_FEITEN staat is een belofte
       die de offerte later moet waarmaken. */
    test: (t) => {
      const m = [...t.matchAll(/\b\d+([.,]\d+)?\s*(%|m²|jaar|weken|werkdagen|dagen|maanden|euro|€)\b/gi)]
        .map((x) => x[0].trim())
        .filter((g) => !GEDEKTE_FEITEN.some((f) => g.replace(/\s+/g, ' ').toLowerCase() === f.toLowerCase()));
      return m.length ? { 0: m[0] } : null;
    },
    uitleg: 'elk getal moet terug te vinden zijn op de site; staat het er niet, dan hoort het hier niet',
    slecht: 'De werf duurt 12 dagen.',
  },
];

/* ── meten ────────────────────────────────────────────────────────────────── */

if (!fs.existsSync(BRON)) {
  console.error(`FOUT: ${BRON} bestaat niet — de meting is ongeldig`);
  process.exit(2);
}
const bron = fs.readFileSync(BRON, 'utf8');

/**
 * Alle zichtbare tekst uit de inhoud: de waarden van tekstvelden, niet de
 * commentaren en niet de bestandsnamen. Regels die met een * of / beginnen
 * (commentaar) blijven buiten beschouwing.
 */
const VELDEN = /(?:titel|regels|knop|kop|tekst|slot|alt|badge|onder|uitkomstKop|footer|vraag|label|uitleg|titel):\s*(\[[^\]]*\]|'(?:[^'\\]|\\.)*')/g;
const zinnen = [];
for (const regel of bron.split('\n')) {
  const kaal = regel.trim();
  if (kaal.startsWith('*') || kaal.startsWith('//') || kaal.startsWith('/*')) continue;
  if (kaal.startsWith('import ')) continue;
  for (const m of kaal.matchAll(VELDEN)) {
    for (const s of m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)) {
      const t = s[1].replace(/\\'/g, "'").trim();
      if (t.length > 2) zinnen.push(t);
    }
  }
}

/* Positieve controle op de meting: vindt hij te weinig tekst, dan bewijst
   "geen overtredingen" niets. De twee pagina's samen leveren ruim honderd
   zinnen; onder de zestig klopt er iets niet aan het uitlezen. */
if (zinnen.length < 60) {
  console.error(`FOUT: maar ${zinnen.length} zinnen uit de inhoud gelezen — de meting is ongeldig`);
  process.exit(2);
}

/* Positieve controle op de regels: elke regel moet op zijn eigen slechte
   voorbeeld vuren. Een regel die door een typefout nooit meer aanslaat, zou
   anders stilletjes groen blijven geven. */
for (const r of REGELS) {
  if (!r.test(r.slecht)) {
    console.error(`FOUT: regel "${r.naam}" vuurt niet op zijn eigen voorbeeld ("${r.slecht}") — de meting is ongeldig`);
    process.exit(2);
  }
}

const fouten = [];
const toegestaan = [];
for (const zin of zinnen) {
  for (const r of REGELS) {
    const treffer = r.test(zin);
    if (!treffer) continue;
    const uitzondering = UITZONDERINGEN.find((u) => zin.includes(u.tekst));
    if (uitzondering) { toegestaan.push(`${zin} — ${uitzondering.reden}`); continue; }
    fouten.push(`${r.naam}: "${zin}"\n         ${r.uitleg} (trof: "${treffer[0]}")`);
  }
}

/* ── de hookregel ─────────────────────────────────────────────────────────
   Apart, want hij geldt op één plek: de kop van de hero.

   Aanleiding: ik zette "Droombadkamer / met de prijs / vooraf op papier" in de
   kop. Mohammed keurde dat af en had gelijk — het breekt twee gelockte regels
   tegelijk. "De prijs vooraf op papier" is een geruststelling, en die hoort op
   een zekerheidskaart. De kop moet gaan over wat er straks bij hem THUIS staat.
   De regels hierboven zagen daar niets van: die toetsen telzinnen, negatie,
   hedges en cijfers. Een controle die de vraag niet stelt, geeft geen groen
   licht — hij zwijgt alleen. Vandaar deze. */
const BEWIJSWOORDEN = [
  'prijs', 'offerte', 'gratis', 'garantie', 'btw', 'papier', 'korting',
  'certificaat', 'vca', 'verzekerd', 'attest', 'keurmerk', 'werkdagen',
  'vrijblijvend', 'aanbod', 'actie',
];
const koppen = [];
for (const paginanaam of ['TOTAALRENOVATIE', 'BADKAMER']) {
  const begin = bron.indexOf(`export const ${paginanaam}: PaginaInhoud = {`);
  if (begin < 0) {
    console.error(`FOUT: pagina ${paginanaam} niet gevonden — de meting is ongeldig`);
    process.exit(2);
  }
  const stuk = bron.slice(begin, bron.indexOf(String.fromCharCode(10) + 'export const ', begin + 10) + 1 || undefined);
  const m = stuk.match(/regels:\s*\[([^\]]*)\]/);
  if (!m) {
    console.error(`FOUT: ${paginanaam}: geen hero-kop gevonden — de meting is ongeldig`);
    process.exit(2);
  }
  const kop = [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1]).join(' ');
  if (!kop.trim()) {
    console.error(`FOUT: ${paginanaam}: hero-kop is leeg — de meting is ongeldig`);
    process.exit(2);
  }
  koppen.push({ paginanaam, kop });
}

/* positieve controle: de afgekeurde kop moet deze regel laten vuren */
const PROEFKOP = 'Droombadkamer met de prijs vooraf op papier';
const treft = (t) => BEWIJSWOORDEN.find((w) => new RegExp(`\\b${w}\\b`, 'i').test(t));
if (!treft(PROEFKOP)) {
  console.error('FOUT: de hookregel vuurt niet op de afgekeurde kop — de meting is ongeldig');
  process.exit(2);
}

for (const { paginanaam, kop } of koppen) {
  const woord = treft(kop);
  if (woord) {
    fouten.push(`hook bevat bewijs: "${kop}" (${paginanaam})\n         "${woord}" is een geruststelling; die hoort op een zekerheidskaart. De kop gaat over wat er bij de klant thuis staat.`);
  }
}

console.log(`check-replica-copy: ${zinnen.length} zinnen getoetst aan ${REGELS.length} regels, ${koppen.length} koppen aan de hookregel`);
for (const t of toegestaan) console.log(`  toegestaan: ${t}`);
if (!fouten.length) {
  console.log('  geen telzinnen, negatie-framing, hedge-woorden of ongedekte cijfers');
  process.exit(0);
}
console.log('');
for (const f of fouten) console.log(`  FOUT: ${f}`);
process.exit(1);
