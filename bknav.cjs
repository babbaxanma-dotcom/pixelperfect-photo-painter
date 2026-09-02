/*
 * De badkamerpagina krijgt een eigen navigatie.
 *
 * "Diensten" wees naar een sectie die op deze pagina niet bestaat: je klikte en
 * er gebeurde niets. Op deze pagina staat op die plek de schetser, en dat is
 * meteen het sterkste wat de pagina te bieden heeft. De link heet er nu naar en
 * springt erheen.
 */
const fs = require('node:fs');
const NL = String.fromCharCode(10);
const CR = String.fromCharCode(13);

const P = 'src/pages/abbouw/lp/replica/inhoud.ts';
const s = fs.readFileSync(P, 'utf8');
const crlf = s.includes(CR);
let t = s.split(CR).join('');

/* Het anker moet uniek in BADKAMER staan: bronPrefix komt maar één keer voor. */
const anker = "  bronPrefix: 'badkamerrenovatie',";
if (t.split(anker).length - 1 !== 1) {
  /* Als de prefix anders heet, zoek het blok op zijn export. */
  const start = t.indexOf('export const BADKAMER');
  if (start < 0) { console.error('FOUT: BADKAMER niet gevonden'); process.exit(1); }
  console.error('FOUT: anker bronPrefix niet uniek of afwezig');
  process.exit(1);
}

const nieuw = [
  anker,
  '',
  '  /*',
  '   * Eigen navigatie: de standaardlijst heeft een link naar de dienstensectie,',
  '   * en die staat niet op deze pagina. Op die plek staat hier de schetser —',
  '   * het sterkste wat de pagina te bieden heeft — dus wijst de link daarheen.',
  '   */',
  '  nav: [',
  "    { label: 'Home', href: '#top' },",
  "    { label: 'Over ons', href: '#over' },",
  "    { label: 'Ontwerp uw badkamer', href: '#schetser' },",
  "    { label: 'Aanpak', href: '#werkwijze' },",
  "    { label: 'Contact', href: '#contact' },",
  '  ],',
].join(NL);

t = t.split(anker).join(nieuw);
fs.writeFileSync(P, crlf ? t.split(NL).join(CR + NL) : t);
console.log('  badkamerpagina: link naar het ontwerp');
