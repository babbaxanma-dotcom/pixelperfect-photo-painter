/**
 * Zoekt woordgroepen die meer dan één keer op dezelfde pagina staan.
 *
 * Aanleiding (22 sep 2026): "eigen dakwerkers en zinkwerkers" stond vier keer
 * op de dakwerkenpagina — in de SEO-tekst, in de drie punten boven de vouw,
 * in de inleiding van het waarom-blok en als titel van de eerste reden.
 * Mohammed: "je hebt weer ai cliche, die eigen dakwerkers en eigen
 * zinkwerkers gebruik je al 5x vandaag". Dezelfde klasse als de offerte-
 * belofte die zowel bij de redenen als bij de werkwijze stond.
 *
 * De stempeltoets in check-tekst.cjs kijkt naar de OPBOUW van blokken en
 * vuurt pas vanaf twee blokken; die vond hier niets. Dit script kijkt naar de
 * letterlijke woorden.
 *
 * Draaien:  node scripts/check-herhaling.cjs [bestand.txt]
 *           (zonder argument: src/pages/abbouw/lp/kgj/copy-dakwerken.txt)
 * Uitkomst: exit 0 = geen herhaling, exit 1 = herschrijven.
 */
const fs = require('fs');
const path = require('path');

const LENGTE = 3;      /* een groep van drie woorden of meer telt als stempel */
const MAX = 1;         /* zo vaak mag een groep voorkomen */

/* Woordgroepen die mogen herhalen: ze benoemen hetzelfde ding en een
   synoniem zoeken maakt de tekst vager, niet beter. */
const TOEGESTAAN = [
  'binnen een werkdag', 'binnen één werkdag',
  'binnen vijf werkdagen',
  'wat uw dak kost',
  'van uw woning',
];

const pad = process.argv[2] || path.join(__dirname, '..', 'src', 'pages', 'abbouw', 'lp', 'kgj', 'copy-dakwerken.txt');

/** Woorden los, zonder leestekens en zonder hoofdletterverschil: "Eigen
    dakwerkers" en "eigen dakwerkers" zijn dezelfde stempel. */
const woorden = (tekst) => tekst.toLowerCase()
  .replace(/[.,;:!?()"«»]/g, ' ')
  .split(/\s+/).filter(Boolean);

const zoek = (tekst) => {
  const tel = new Map();
  /* Per regel: elke regel is een losse tekst op de pagina. Over de regelgrens
     heen tellen gaf vals alarm ("plat dak?" + "Wat ligt er" = "plat dak wat"). */
  for (const regel of tekst.split(/\r?\n/)) {
    const w = woorden(regel);
    for (let n = LENGTE; n <= 6; n++) {
      for (let i = 0; i + n <= w.length; i++) {
        const groep = w.slice(i, i + n).join(' ');
        if (TOEGESTAAN.some((t) => groep.includes(t))) continue;
        tel.set(groep, (tel.get(groep) || 0) + 1);
      }
    }
  }
  /* Alleen de langste variant melden: "eigen dakwerkers en zinkwerkers"
     bevat ook "eigen dakwerkers en", en die tweede melding voegt niets toe. */
  const raak = [...tel.entries()].filter(([, n]) => n > MAX).sort((a, b) => b[0].length - a[0].length);
  const uit = [];
  for (const [groep, n] of raak) {
    if (uit.some(([g]) => g.includes(groep))) continue;
    uit.push([groep, n]);
  }
  return uit;
};

/* Positieve controle: vindt de zoeker een stempel die er zeker in zit? Zo
   niet, dan meet hij niets en is groen op de echte tekst waardeloos. */
const proef = 'eigen dakwerkers en zinkwerkers leggen het dak. Bij ons staan eigen dakwerkers en zinkwerkers op het dak.';
if (zoek(proef).length === 0) { console.error('GUARD STUK: positieve controle vindt geen herhaling'); process.exit(2); }

/* Alleen de lopende tekst. Onder de scheidingslijn staan knoppen, labels en
   de SEO-titel: die MOETEN herhalen (twee vragen met een knop "Weet ik niet",
   een paginatitel die de kop van de hero spiegelt). Ze meenemen zou de guard
   elke keer rood maken om iets dat geen fout is, en dan zet iemand hem uit. */
const heel = fs.readFileSync(pad, 'utf8');
const grens = heel.indexOf('--- functioneel ---');
const tekst = grens < 0 ? heel : heel.slice(0, grens);
if (grens < 0) console.warn('let op: geen scheidingslijn gevonden, de hele tekst wordt gemeten');
const gevonden = zoek(tekst);

if (gevonden.length) {
  console.log(`ROOD — ${gevonden.length} woordgroep(en) staan meer dan één keer in ${path.basename(pad)}:`);
  for (const [groep, n] of gevonden) console.log(`  ${n}x  "${groep}"`);
  console.log('\nZet de formule op één plek, de sterkste, en schrijf de andere plek vanuit een andere invalshoek.');
  process.exit(1);
}
console.log(`GROEN — geen woordgroep van ${LENGTE}+ woorden staat twee keer in ${path.basename(pad)}.`);
