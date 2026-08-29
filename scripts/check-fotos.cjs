#!/usr/bin/env node
/**
 * Guard tegen bijna-dezelfde foto's in het werkraster.
 *
 * Aanleiding: Mohammed heeft drie keer moeten aanwijzen dat er in de tabbladen
 * "veel dezelfde foto's" staan — twee opnames van dezelfde ruimte vanuit een
 * hoek die een centimeter verschilt. Zulke paren zijn met het blote oog pas te
 * zien als je ze naast elkaar legt, en een keurder (mens of AI) mist ze zodra
 * hij de foto's één voor één bekijkt. Daarom worden ze hier geteld in plaats
 * van bekeken.
 *
 * Methode: dHash (verschil tussen naburige pixels op een 9x8 grijswaardebeeld)
 * plus een grof kleurhistogram. Twee foto's zijn "bijna dezelfde" als de
 * hamming-afstand van de dHash klein is EN de kleurverdeling dicht bij elkaar
 * ligt. Twee signalen, omdat dHash alleen ook los van elkaar staande maar
 * even sobere ruimtes als gelijk kan zien.
 *
 * Elke pagina wordt APART getoetst: dezelfde foto op twee verschillende
 * pagina's is geen dubbel, twee bijna-gelijke foto's in één spoor wel.
 *
 * Draaien: node scripts/check-fotos.cjs [--alle]
 *   zonder vlag: alleen de foto's die in de vier tabbladen staan
 *   --alle     : elk bestand in de realisatiemap, om vervangers te zoeken
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const WORTEL = path.join(__dirname, '..');
const MAP = path.join(WORTEL, 'src/assets/lp-diensten/realisaties');
const BRON = path.join(WORTEL, 'src/pages/abbouw/lp/replica/inhoud.ts');

/** Grens waaronder twee foto's als bijna dezelfde gelden. */
const HAMMING_GRENS = 12;
const KLEUR_GRENS = 0.14;

/** dHash: 64 bits, elk bit is "pixel links is helderder dan pixel rechts". */
async function dhash(bestand) {
  const rauw = await sharp(bestand).greyscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer();
  const bits = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) bits.push(rauw[y * 9 + x] > rauw[y * 9 + x + 1] ? 1 : 0);
  }
  return bits;
}

/** Grof kleurhistogram: 4x4x4 blokken, genormaliseerd. */
async function kleuren(bestand) {
  const { data, info } = await sharp(bestand).resize(64, 64, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  const hist = new Array(64).fill(0);
  const stap = info.channels;
  for (let i = 0; i < data.length; i += stap) {
    const k = (data[i] >> 6) * 16 + (data[i + 1] >> 6) * 4 + (data[i + 2] >> 6);
    hist[k]++;
  }
  const totaal = hist.reduce((a, b) => a + b, 0) || 1;
  return hist.map((v) => v / totaal);
}

const hamming = (a, b) => a.reduce((n, v, i) => n + (v === b[i] ? 0 : 1), 0);
const kleurAfstand = (a, b) => a.reduce((n, v, i) => n + Math.abs(v - b[i]), 0) / 2;

(async () => {
  const alle = process.argv.includes('--alle');
  const bron = fs.readFileSync(BRON, 'utf8');

  /* Welke foto's staan er echt in de sporen? Per pagina uit de bron lezen, niet
     raden. De inhoud van beide pagina's staat in hetzelfde bestand, dus de
     tekst wordt eerst per pagina-object gesplitst. */
  const paginas = [];
  for (const naam of ['TOTAALRENOVATIE', 'BADKAMER']) {
    const begin = bron.indexOf(`export const ${naam}: PaginaInhoud = {`);
    if (begin < 0) {
      console.error(`FOUT: pagina ${naam} niet gevonden in ${path.basename(BRON)} — de meting is ongeldig`);
      process.exit(2);
    }
    const eind = bron.indexOf(String.fromCharCode(10) + 'export const ', begin + 10);
    const stuk = bron.slice(begin, eind < 0 ? bron.length : eind);
    const spoor = stuk.slice(stuk.indexOf('fotos: ['), stuk.indexOf('schuif:') > 0 ? stuk.indexOf('schuif:') : undefined);
    const gebruikt = [...spoor.matchAll(/naam: '([a-z]+-p\d-[a-z])'/g)].map((m) => m[1]);
    const regels = (spoor.match(/\{ naam: '/g) || []).length;
    /* Positieve controle op de meting zelf: evenveel gelezen namen als regels.
       Nul (veld hernoemd) of te weinig (regex loopt achter op de vorm) maakt de
       uitslag "geen dubbels" waardeloos, dus faalt de guard luid. */
    if (!gebruikt.length || gebruikt.length !== regels) {
      console.error(`FOUT: ${naam}: ${gebruikt.length} namen gelezen maar ${regels} regels in de lijst — de meting is ongeldig`);
      process.exit(2);
    }
    paginas.push({ naam, gebruikt });
  }

  /** Vingerafdrukken van een reeks namen. */
  const meet = async (namen) => {
    const uit = [];
    for (const n of namen) {
      const pad = path.join(MAP, `${n}.jpg`);
      uit.push({ naam: n, d: await dhash(pad), k: await kleuren(pad) });
    }
    return uit;
  };

  if (alle) {
    const namen = fs.readdirSync(MAP).filter((f) => f.endsWith('.jpg')).map((f) => f.replace(/\.jpg$/, ''));
    const vingers = await meet(namen);
    const paren = [];
    for (let i = 0; i < vingers.length; i++) {
      for (let j = i + 1; j < vingers.length; j++) {
        const h = hamming(vingers[i].d, vingers[j].d);
        const k = kleurAfstand(vingers[i].k, vingers[j].k);
        if (h <= HAMMING_GRENS && k <= KLEUR_GRENS) paren.push({ a: vingers[i].naam, b: vingers[j].naam, h, k });
      }
    }
    paren.sort((x, y) => x.h - y.h);
    for (const p of paren) console.log(`  lijkt op elkaar  ${p.a}  ~  ${p.b}   (hamming ${p.h}, kleur ${p.k.toFixed(3)})`);
    console.log(`
${paren.length} paar(en) onder de grens — met --alle is dit een lijst, geen oordeel.`);
    process.exit(0);
  }

  const fouten = [];
  let vergeleken = 0;
  let parenTotaal = 0;

  for (const { naam, gebruikt } of paginas) {
    const ontbreekt = gebruikt.filter((n) => !fs.existsSync(path.join(MAP, `${n}.jpg`)));
    if (ontbreekt.length) {
      console.error(`FOUT: ${naam}: ${ontbreekt.length} foto bestaat niet: ${ontbreekt.join(', ')}`);
      process.exit(1);
    }
    const vingers = await meet(gebruikt);

    /* positieve controle: een foto met zichzelf moet afstand 0 geven */
    if (hamming(vingers[0].d, vingers[0].d) !== 0 || kleurAfstand(vingers[0].k, vingers[0].k) > 1e-9) {
      console.error('FOUT: de vingerafdruk herkent een foto niet als gelijk aan zichzelf — meting ongeldig');
      process.exit(2);
    }

    for (let i = 0; i < vingers.length; i++) {
      for (let j = i + 1; j < vingers.length; j++) {
        parenTotaal++;
        const h = hamming(vingers[i].d, vingers[j].d);
        const k = kleurAfstand(vingers[i].k, vingers[j].k);
        if (h <= HAMMING_GRENS && k <= KLEUR_GRENS) {
          fouten.push(`${naam}: ${vingers[i].naam} en ${vingers[j].naam} zijn bijna dezelfde foto (hamming ${h}, kleur ${k.toFixed(3)})`);
        }
      }
    }

    /* dezelfde bestandsnaam twee keer in één spoor is altijd fout */
    const telling = {};
    for (const n of gebruikt) telling[n] = (telling[n] || 0) + 1;
    for (const [n, x] of Object.entries(telling).filter(([, x]) => x > 1)) {
      fouten.push(`${naam}: ${n} staat ${x}x in het spoor`);
    }
    vergeleken += vingers.length;
  }

  console.log(`check-fotos: ${vergeleken} foto's over ${paginas.length} pagina's (${parenTotaal} paren)`);
  if (!fouten.length) { console.log("  geen bijna-dezelfde foto's binnen een pagina"); process.exit(0); }
  console.log('');
  for (const f of fouten) console.log(`  FOUT: ${f}`);
  process.exit(1);
})();
