/**
 * Bouwt api/_kennis.js: de kennis van de chatassistent, rechtstreeks uit de
 * bronnen van de site. Zo zegt de chat nooit iets wat niet op de site staat,
 * en loopt hij mee met elke tekstwijziging (Mohammed, 28 sep 2026: "AI chat
 * assistente die alles weet van AB Bouwgroep, maar nooit een prijs doorgeeft").
 *
 * Bronnen:
 *   - src/pages/abbouw/_divisies.ts: de zes afdelingen, werkwijze met termijnen,
 *     veelgestelde vragen (dezelfde teksten als op de afdelingspagina's)
 *   - src/pages/abbouw/lp/kgj/inhoud.ts en inhoud-totaalrenovatie.ts: de teksten
 *     van /lp/dakwerken en /lp/totaalrenovatie
 *   - src/data/contact.ts: telefoon, e-mail, adres
 *
 * Harde filter: geen enkele regel met een bedrag (€, euro) gaat mee, behalve de
 * nagelezen premiezin (Mijn VerbouwPremie, vlaanderen.be). Zo staat er in de
 * kennis nergens een prijs die de chat zou kunnen herhalen, ook niet de
 * budgetkeuzes van het formulier.
 *
 * Draaien: node scripts/maak-chat-kennis.mjs   (check-chat.mjs toetst of het
 * bestand nog overeenkomt met de bronnen)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(hier, '..');
/* De repo mengt CRLF en LF; alles naar LF, anders vallen de regex hieronder stil. */
const lees = (f) => fs.readFileSync(path.join(repo, f), 'utf8').replace(/\r\n/g, '\n');

/** Commentaar weg, zodat alleen de echte teksten overblijven. */
const zonderCommentaar = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const tekst = (s) => s.replace(/\\'/g, "'").replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim();

/** Een regel met een bedrag mag alleen mee als het de nagelezen premiezin is. */
export function magMee(regel) {
  if (!/€|\beuro\b|\bEUR\b/i.test(regel)) return true;
  return /VerbouwPremie/.test(regel) && !/€\s?\d{1,3}(\.\d{3})+\s*(tot|–|-)/.test(regel);
}

/* ── afdelingen ── */
function afdelingen() {
  const s = zonderCommentaar(lees('src/pages/abbouw/_divisies.ts'));
  const blokken = s.split(/\n  (?=[a-z]+: \{\n    slug:)/).slice(1);
  const uit = [];
  for (const b of blokken) {
    const veld = (k) => { const m = b.match(new RegExp(`${k}: '((?:[^'\\\\]|\\\\.)*)'`)); return m ? tekst(m[1]) : ''; };
    const lijst = (k) => {
      const m = b.match(new RegExp(`${k}: \\[([\\s\\S]*?)\\n    \\]`));
      if (!m) return [];
      return [...m[1].matchAll(/t: '((?:[^'\\]|\\.)*)', d: '((?:[^'\\]|\\.)*)'/g)].map((x) => `${tekst(x[1])}: ${tekst(x[2])}`);
    };
    const stappen = [...b.matchAll(/stap\('((?:[^'\\]|\\.)*)', '((?:[^'\\]|\\.)*)', '((?:[^'\\]|\\.)*)'/g)]
      .map((x) => `${tekst(x[1])} (${tekst(x[3])}): ${tekst(x[2])}`);
    const faqs = [...b.matchAll(/\{ q: '((?:[^'\\]|\\.)*)', a: '((?:[^'\\]|\\.)*)' \}/g)]
      .map((x) => `V: ${tekst(x[1])}\nA: ${tekst(x[2])}`);
    uit.push([
      `### Afdeling ${veld('title')}`,
      veld('heroLede'), veld('storyLede'),
      ...lijst('features').map((x) => '- ' + x),
      ...lijst('whatWeDo').map((x) => '- ' + x),
      stappen.length ? 'Werkwijze:' : '', ...stappen.map((x) => '- ' + x),
      faqs.length ? 'Veelgestelde vragen:' : '', ...faqs,
    ].filter(Boolean).filter(magMee).join('\n'));
  }
  return uit.join('\n\n');
}

/* ── landingspagina's ── */
const OVERSLAAN = /^(src|alt|slug|id|icoon|kleur|naam|sleutel|bronLead|bedanktSlug|divisie|zoek|kind|pad|href|pos|foto|titel|omschrijving|label|uitleg|vraag|gerust|uitkomstKop|uitkomstOnder|knop|tijd|zeker|alles|onder)$/;
function landingspagina(f, naam) {
  const s = zonderCommentaar(lees(f))
    /* De budgetkeuzes van het formulier en de rekenaarvragen horen niet in de kennis. */
    .replace(/extra: \[[\s\S]*?\n    \],/g, '')
    .replace(/boodschap: \[[\s\S]*?\n  \],/g, '');
  const uit = [];
  for (const m of s.matchAll(/(\w+):\s*'((?:[^'\\]|\\.)*)'/g)) {
    const [, k, v] = m;
    /* "Omdat u isolatie hebt aangevinkt: …" hoort bij één stap van de rekenaar,
       niet in een gesprek. */
    if (OVERSLAAN.test(k) || v.length < 12 || /^Omdat u /.test(v)) continue;
    uit.push(tekst(v));
  }
  for (const m of s.matchAll(/(\w+): \[\s*((?:'(?:[^'\\]|\\.)*'\s*,?\s*)+)\]/g)) {
    /* bij: de antwoorden waarna een melding komt, geen kennis. */
    if (OVERSLAAN.test(m[1]) || m[1] === 'bij') continue;
    uit.push([...m[2].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => tekst(x[1])).join(' · '));
  }
  return `### Pagina ${naam}\n` + [...new Set(uit)].filter(magMee).map((x) => '- ' + x).join('\n');
}

/* ── contact ── */
function contact() {
  const s = lees('src/data/contact.ts');
  const tel = s.match(/display: '([^']+)'/)[1];
  const mail = s.match(/email: '([^']+)'/)[1];
  const adres = s.match(/full: '([^']+)'/)[1];
  return `### Contact\n- Telefoon: ${tel}\n- E-mail: ${mail}\n- Adres: ${adres}`;
}

export function bouwKennis() {
  return [
    '## Wat AB Bouw Groep zegt op zijn eigen site (enige bron voor feiten)',
    contact(),
    landingspagina('src/pages/abbouw/lp/kgj/inhoud.ts', '/lp/dakwerken'),
    landingspagina('src/pages/abbouw/lp/kgj/inhoud-totaalrenovatie.ts', '/lp/totaalrenovatie'),
    afdelingen(),
  ].join('\n\n');
}

export function bestandInhoud(kennis) {
  return `/* GEGENEREERD door scripts/maak-chat-kennis.mjs uit de teksten van de site.
   Niet met de hand wijzigen: pas de bron aan en draai het script opnieuw.
   Bestanden die met _ beginnen zijn bij Vercel geen eigen route. */
export const KENNIS = ${JSON.stringify(kennis)};
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const kennis = bouwKennis();
  fs.writeFileSync(path.join(repo, 'api/_kennis.js'), bestandInhoud(kennis));
  console.log(`api/_kennis.js: ${kennis.length} tekens, ${kennis.split('\n').length} regels`);
}
