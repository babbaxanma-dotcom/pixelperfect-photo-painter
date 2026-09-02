/*
 * De ruimte onder de vaste kop wordt bijgesteld tot de titel er echt onder valt.
 *
 * Eén keer de kophoogte als padding zetten volstaat niet overal. De hero van de
 * homepage heeft een vaste hoogte en lijnt zijn inhoud zelf uit; de padding
 * wordt daar deels opgegeten in plaats van de inhoud omlaag te duwen, waardoor
 * de bovenkant van de titel achter de kop bleef.
 *
 * Berekenen wat er dan bij moet is gokken naar de opmaak van elke pagina. Dus
 * meet de functie na en telt bij tot het klopt, met een harde grens zodat een
 * pagina die om een andere reden overlapt hier niet in een lus blijft hangen.
 */
const fs = require('node:fs');
const NL = String.fromCharCode(10);
const CR = String.fromCharCode(13);

const P = 'src/pages/abbouw/_rp.ts';
const s = fs.readFileSync(P, 'utf8');
const crlf = s.includes(CR);
let t = s.split(CR).join('');

const oud = [
  '    /* Eerst de hoogte van de kop, dan nameten. De marge van een titel loopt',
  '       door de padding van zijn sectie heen, dus staat de eerste inhoud soms',
  '       hoger dan de ruimte die hier gezet wordt. Wat er dan nog onder de kop',
  '       valt, komt er in de tweede stap bij. */',
  '    const hoogte = kop.offsetHeight;',
  "    wikkel.style.paddingTop = hoogte + 'px';",
  '',
  "    const eerste = wikkel.querySelector<HTMLElement>('h1, h2, .pc-h1, .rp-phero__t');",
  '    if (eerste) {',
  '      const tekort = kop.getBoundingClientRect().bottom - eerste.getBoundingClientRect().top;',
  "      if (tekort > 0) wikkel.style.paddingTop = hoogte + Math.ceil(tekort) + 'px';",
  '    }',
].join(NL);

const nieuw = [
  '    let ruimte = kop.offsetHeight;',
  "    wikkel.style.paddingTop = ruimte + 'px';",
  '',
  "    const eerste = wikkel.querySelector<HTMLElement>('h1, h2, .pc-h1, .rp-phero__t');",
  '    if (eerste) {',
  '      /* Nameten en bijtellen. De hero van de homepage heeft een vaste hoogte en',
  '         lijnt zijn inhoud zelf uit: daar eet de padding zichzelf deels op en',
  '         blijft de titel achter de kop staan. Uitrekenen hoeveel er bij moet is',
  '         gokken naar de opmaak van elke pagina; nameten werkt overal. */',
  '      const tekort = () => kop.getBoundingClientRect().bottom - eerste.getBoundingClientRect().top;',
  '      for (let poging = 0; poging < 6 && tekort() > 0; poging++) {',
  '        ruimte += Math.ceil(tekort());',
  "        wikkel.style.paddingTop = ruimte + 'px';",
  '      }',
  '    }',
].join(NL);

if (t.split(oud).length - 1 !== 1) { console.error('FOUT: anker niet gevonden'); process.exit(1); }
t = t.split(oud).join(nieuw);
fs.writeFileSync(P, crlf ? t.split(NL).join(CR + NL) : t);
console.log('  spacer telt bij tot de titel vrij staat');
