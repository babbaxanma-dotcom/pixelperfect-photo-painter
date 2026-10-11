#!/usr/bin/env node
/**
 * Port van de CSS van bfbouw.be naar abgroep.be (spec/bf-stijl.md §4, verplicht scriptmatig).
 *
 * Leest bfbouw-website/src/css/site.css met postcss en schrijft
 * src/pages/abbouw/bf/bf.css. Het script:
 *  - houdt alleen de regels van de componenten die AB gebruikt (lijst BLOKKEN),
 *    IN DE OORSPRONKELIJKE VOLGORDE: de BF-cascade is gelaagd, latere regels
 *    overschrijven eerdere. Binnen een regel met meerdere selectors vallen alleen
 *    de selectors van niet-gebruikte componenten weg;
 *  - hernoemt elke klasse .x naar .bf-x (ook toestandsklassen en klassen in
 *    :not(), :is(), :where(), :has()) en elke gebruikte @keyframes-naam naar bf-x;
 *  - zet ".bf " vóór elke selector; :root, html en body worden .bf, en de
 *    toestandsklasse menu-open (BF zet die op body) komt op .bf zelf;
 *  - vervangt de BF-tokens en de BF-merkkleuren door de AB-waarden (§5);
 *  - laat @font-face weg (Plus Jakarta Sans komt via Google Fonts in index.html);
 *  - zet tekst op een merkvlak die wit was op navy (wit op goud haalt 2,7:1).
 *
 * Herhaalbaar: node scripts/bf-css-port.cjs. AB-aanvullingen staan in bf-ab.css.
 * Het script controleert zichzelf (positieve en negatieve controle) en stopt met
 * exitcode 1 als de uitvoer niet klopt.
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const REPO = path.resolve(__dirname, '..');
const BRON = process.env.BF_CSS || path.resolve(REPO, '..', 'bfbouw-website', 'src', 'css', 'site.css');
const DOEL = path.join(REPO, 'src', 'pages', 'abbouw', 'bf', 'bf.css');

/* Componenten (BEM-blok = de klasse vóór __ of --). Home, schil en de subpaginablokken
   uit bf-css.md "Subpagina's" (paginakop, dienstrij, waarden, belofte, lees, 404-blok).
   NIET: topbalk, reviews, blog, team, oude secties, LP, rekenaar, bedankt, CRM, login. */
const BLOKKEN = new Set([
  // basis
  'sr', 'overslaan', 'h2', 'streep', 'knop', 'rond', 'beeld-leeg',
  // schil
  'kop', 'nav', 'belzweef', 'voet',
  // home
  'hero', 'over', 'cijfers', 'cijfer', 'dsectie', 'dkaarten', 'dkaart', 'waarom', 'wkaart', 'veeghint',
  'inspectie', 'proces', 'pstap', 'rslider-sectie', 'rslider', 'rproject',
  // plaatsblok en formulier
  'plaats', 'fwissel', 'fpaneel', 'form', 'fveld', 'fveld-rij', 'ster', 'formulier-melding',
  // subpagina's
  'paginakop', 'kruimel', 'blok', 'lees', 'sblok', 'sraam', 'duo', 'waarden', 'waarde', 'belofte', 'dienstrijen', 'dienstrij',
]);
/* Toestandsklassen die BF met JS zet. */
const TOESTANDEN = new Set(['is-on', 'is-actief', 'is-gescrold', 'is-slepen', 'is-in-beeld', 'is-zichtbaar', 'menu-open']);
/* Varianten van een gebruikt blok die alleen op de LP van BF bestaan. */
const WEG_KLASSEN = new Set(['kop--lp', 'dkaarten__raster--lp']);
/* Toestanden die op de wortel staan (BF: body). Op AB komen ze op .bf zelf. */
const WORTEL_TOESTAND = new Set(['menu-open']);

/* §5 kleuren en letters (BF -> AB). */
const TOKENS = {
  '--merk': '#d98c03',
  '--merk-ui': '#d98c03',
  '--merk-tekst': '#915e02',
  '--merk-diep': '#c27c02',
  '--op-merk': '#0a1628',
  '--ink': '#0a1628',
};
/* De donkere gloed in de cijferband en de vlakke paginakop. Spec §5: eerst een donkere goudtint;
   ziet dat er modderig uit, dan #16294a. 11 okt getoetst op de schermafdruk (1265): #3d2b06 naar navy
   gaf een olijfbruine vlek in de hoek, dus #16294a. Vergelijken: BF_GLOED=#3d2b06 node scripts/bf-css-port.cjs */
const GLOED = process.env.BF_GLOED || '#16294a';
const HEX = {
  '#fc6607': '#d98c03', // merk
  '#ef6107': '#d98c03', // merk-ui
  '#bd4d05': '#915e02', // merk als tekst op licht
  '#b54905': '#c27c02', // merk-diep
  '#0b0b0c': '#0a1628', // ink
  '#1c1c1c': '#0a1628', // donkere vlakken en op-merk
  '#3a2414': GLOED, // verloop cijferband en vlakke paginakop
  '#ff8a3d': '#e9a531', // verloop inspectieband (licht)
  '#e85a05': '#c98303', // verloop inspectieband (donker)
  '#f3c2a3': '#efd59b', // stippen
  '#a64305': '#915e02', // nummer werkwijzestap (wordt later overschreven)
  '#fff1e8': '#fbf3e6', // lichte merktint
};
const RGB = {
  '252,102,7': '217, 140, 3', // merk in rgba()
  '28,28,28': '10, 22, 40', // op-merk in rgba()
};

const klassen = (sel) => [...sel.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]);
const blok = (k) => k.split('__')[0].split('--')[0];
function houden(sel) {
  const ks = klassen(sel);
  if (ks.some((k) => WEG_KLASSEN.has(k))) return false;
  return ks.every((k) => TOESTANDEN.has(k) || BLOKKEN.has(blok(k)));
}
const WORTEL = /^(?::root|html|body|:where\((?:html|body)\))$/;
function herschrijf(sel) {
  const s = sel.trim();
  if (WORTEL.test(s)) return '.bf';
  const r = s.replace(/\.([a-zA-Z_][\w-]*)/g, '.bf-$1');
  const eerste = klassen(s)[0];
  if (eerste && WORTEL_TOESTAND.has(eerste) && s.startsWith('.' + eerste)) return '.bf' + r; // .bf.bf-menu-open …
  return '.bf ' + r;
}
function kleur(waarde) {
  let v = waarde.replace(/#[0-9a-fA-F]{6}\b/g, (h) => HEX[h.toLowerCase()] || h);
  v = v.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,/g, (m, r, g, b) => {
    const nieuw = RGB[`${r},${g},${b}`];
    return nieuw ? `rgba(${nieuw},` : m;
  });
  return v;
}

const css = fs.readFileSync(BRON, 'utf8');
const bron = postcss.parse(css, { from: BRON });

const stats = { regelsIn: 0, regelsUit: 0, selectorsWeg: 0, witOpMerk: 0, hoverLift: 0 };
const animaties = new Set();

function verwerkRegel(rule) {
  stats.regelsIn++;
  const sels = rule.selectors.filter(houden);
  stats.selectorsWeg += rule.selectors.length - sels.length;
  if (!sels.length) return null;
  const isWortel = sels.every((s) => WORTEL.test(s.trim()));
  const nieuw = rule.clone({ selectors: sels.map(herschrijf) });
  nieuw.raws.selector = undefined;
  nieuw.walkComments((c) => c.remove());
  nieuw.walkDecls((d) => {
    if (isWortel && Object.prototype.hasOwnProperty.call(TOKENS, d.prop)) d.value = TOKENS[d.prop];
    else d.value = kleur(d.value);
    if (d.prop === 'animation' || d.prop === 'animation-name') {
      d.value = d.value.replace(/\b([a-z][\w-]*-in|rk-[\w-]+)\b/g, (n) => { animaties.add(n); return 'bf-' + n; });
    }
  });
  // geen hover-lift en geen hover-zoom (lock 3 aug: "heel die scroll efect dingetje ... mag allemaal weg"); kleurwissel bij hover blijft
  if (sels.some((s) => s.includes(':hover'))) {
    nieuw.walkDecls('transform', (d) => { d.remove(); stats.hoverLift++; });
    if (!nieuw.nodes.length) { stats.regelsUit++; return null; }
  }
  // tekst op een merkvlak is navy (wit op goud zakt door AA)
  const achter = nieuw.nodes.find((d) => d.type === 'decl' && /^background(-color)?$/.test(d.prop) && /var\(--merk(-diep|-ui)?\)/.test(d.value));
  if (achter) {
    nieuw.walkDecls('color', (d) => { if (/^(#fff|#ffffff|white)$/i.test(d.value.trim())) { d.value = 'var(--op-merk)'; stats.witOpMerk++; } });
  }
  stats.regelsUit++;
  return nieuw;
}

const uit = postcss.root();
uit.append(postcss.comment({ text: ` GEGENEREERD door scripts/bf-css-port.cjs uit bfbouw-website/src/css/site.css (${css.split('\n').length} regels).\n   Niet met de hand wijzigen: draai het script opnieuw. AB-aanvullingen staan in bf-ab.css.\n   Elke regel draagt het regelnummer in site.css (L…). ` }));

const keyframes = [];
for (const node of bron.nodes) {
  const lijn = node.source && node.source.start ? node.source.start.line : 0;
  if (node.type === 'comment') continue;
  if (node.type === 'rule') {
    const r = verwerkRegel(node);
    if (r) { r.raws.before = '\n'; uit.append(postcss.comment({ text: `L${lijn}` })); uit.append(r); }
    continue;
  }
  if (node.type === 'atrule') {
    if (node.name === 'font-face') continue;
    if (node.name === 'keyframes') { keyframes.push({ node, plek: uit.nodes.length }); uit.append(postcss.comment({ text: `@keyframes ${node.params} (L${lijn})` })); continue; }
    if (node.name === 'media' || node.name === 'supports') {
      const at = node.clone({ nodes: [] });
      for (const kind of node.nodes || []) {
        if (kind.type !== 'rule') continue;
        const r = verwerkRegel(kind);
        if (r) at.append(r);
      }
      if (at.nodes.length) { uit.append(postcss.comment({ text: `L${lijn}` })); uit.append(at); }
      continue;
    }
    throw new Error(`onbekende at-regel @${node.name} op L${lijn}`);
  }
}
// alleen de keyframes die een gehouden regel gebruikt, op hun oorspronkelijke plek, met bf-naam
for (const { node } of keyframes) {
  const comment = uit.nodes.find((n) => n.type === 'comment' && n.text.startsWith(`@keyframes ${node.params} `));
  if (animaties.has(node.params)) {
    const kf = node.clone({ params: 'bf-' + node.params });
    kf.walkComments((c) => c.remove());
    kf.walkDecls((d) => { d.value = kleur(d.value); });
    comment.after(kf);
    comment.text = `L${node.source.start.line}`;
  } else comment.remove();
}

let tekst = uit.toResult().css.replace(/\n{3,}/g, '\n\n') + '\n';

/* ---------- zelfcontrole ---------- */
const fouten = [];
const gecontroleerd = postcss.parse(tekst);
gecontroleerd.walkRules((r) => {
  if (r.parent.type === 'atrule' && r.parent.name === 'keyframes') return;
  for (const s of r.selectors) {
    if (!/^\.bf(\b|\.|\s)/.test(s)) fouten.push('selector zonder .bf: ' + s);
    for (const k of klassen(s)) if (k !== 'bf' && !k.startsWith('bf-')) fouten.push('klasse zonder bf-: ' + k + ' in ' + s);
  }
});
gecontroleerd.walkAtRules('font-face', () => fouten.push('@font-face in de uitvoer'));
for (const verboden of ['#fc6607', '#ef6107', '#bd4d05', '#1c1c1c', 'bf-review', 'bf-quote', 'bf-gscore', 'bf-rscore', 'bf-rkaart', 'bf-topbalk', 'bf-lphero', 'bf-crm', 'bf-blog', 'bf-post', 'bf-team', 'bf-lid', 'bf-anim', 'bf-rv', 'bf-ocijfers', 'Lato', 'Playfair']) {
  if (tekst.toLowerCase().includes(verboden.toLowerCase())) fouten.push('verboden in de uitvoer: ' + verboden);
}
// positieve controle: deze moeten erin zitten
for (const moet of ['.bf .bf-hero {', '.bf .bf-kop--over {', '.bf .bf-plaats__blok {', '.bf .bf-dkaart.bf-is-actief {', '.bf.bf-menu-open .bf-nav__menu {', '.bf .bf-paginakop {', '.bf .bf-lees {', '.bf .bf-dienstrij {', '.bf .bf-waarde {', '.bf .bf-belofte {', '@keyframes bf-fpaneel-in', 'container-type: inline-size', '--merk: #d98c03', '--op-merk: #0a1628', '.bf .bf-over__google {']) {
  if (!tekst.includes(moet)) fouten.push('ontbreekt in de uitvoer: ' + moet);
}
// het lokaas: een verboden blok moet het filter echt tegenhouden en een toegelaten blok doorlaten
const hoverLift = (c) => { let n = 0; postcss.parse(c).walkRules((r) => { if (r.selector.includes(':hover')) r.walkDecls('transform', () => { n++; }); }); return n; };
if (hoverLift(tekst)) fouten.push('hover-lift in de uitvoer');
if (hoverLift('.bf .x:hover { transform: translateY(-2px); }') !== 1) fouten.push('hover-controle vangt het lokaas niet');
if (houden('.reviews__in') || houden('.lphero .over__sterren') || !houden('.over__google') || !houden('.menu-open .kop--over')) fouten.push('filter faalt op het lokaas');

if (fouten.length) { console.error(fouten.slice(0, 40).join('\n')); console.error(`${fouten.length} fouten, bf.css NIET geschreven`); process.exit(1); }
fs.writeFileSync(DOEL, tekst);
console.log(`bf.css geschreven: ${stats.regelsUit} van ${stats.regelsIn} regels gehouden, ${stats.selectorsWeg} selectors weggelaten, ${stats.witOpMerk}x wit op merkvlak naar navy, ${stats.hoverLift} hover-transform(s) weg, keyframes: ${[...animaties].join(', ') || 'geen'}, ${Math.round(tekst.length / 1024)} kB`);
