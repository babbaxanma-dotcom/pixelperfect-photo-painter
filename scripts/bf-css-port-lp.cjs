#!/usr/bin/env node
/**
 * Port van de LP-CSS van bfbouw.be (/lp/dakwerken/) naar de landingspagina's van abgroep.be
 * (spec/bf-stijl.md §17). Zelfde aanpak als scripts/bf-css-port.cjs, eigen blokkenlijst en eigen lokaas.
 *
 * Leest bfbouw-website/src/css/site.css met postcss en schrijft src/pages/abbouw/lp/kgj/lp-bf.css.
 *  - Houdt alleen regels met minstens één LP-klasse (LP_BLOKKEN, LP_KLASSEN of een rekenaarklasse uit KGJ),
 *    IN DE OORSPRONKELIJKE VOLGORDE (de BF-cascade is gelaagd). Een andere klasse in dezelfde selector
 *    mag alleen als bf.css haar al heeft (.bf-x): de LP-regels bouwen op de gedeelde schil.
 *  - Hernoemt .x naar .bf-x en zet ".bf " vóór elke selector (gescoopt, zoals bf.css).
 *  - De rekenaar van BF (.rk) heet op AB anders: AB houdt zijn eigen React-component (Rekenaar.tsx,
 *    Inspectie.tsx: velden, validatie en payload blijven identiek, §17). Waar BF en AB dezelfde rol
 *    hebben (één klasse, één rol), wordt de BF-klasse de AB-klasse (KGJ). BF-klassen zonder
 *    AB-tegenhanger vallen weg; hun vorm staat met de hand in lp-bf-ab.css.
 *  - Vervangt de BF-merkkleuren door de AB-waarden (§5), tekst op een merkvlak wordt navy.
 *  - Geen hover-lift (lock 3 aug), geen beloningsanimatie, geen reviews, geen cijferband met claims.
 *  - Neemt de regels van chat, fotospoor en voor/na-pijlen (.kgj-chat*, .kgj-werkspoor*, .pc-bediening) over uit
 *    kgj/extra.ts, met de KGJ-tokens uit kgj/stijl.ts, gescoopt onder .bf.bf-lp .bf-lpkgj: ChatAssistent.tsx en
 *    Werkspoor.tsx houden zo hun huidige vorm en gedrag in het nieuwe omhulsel.
 *
 * Herhaalbaar en deterministisch: node scripts/bf-css-port-lp.cjs. Zelfcontrole met lokaas: exit 1 bij een fout.
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const REPO = path.resolve(__dirname, '..');
const BRON = process.env.BF_CSS || path.resolve(REPO, '..', 'bfbouw-website', 'src', 'css', 'site.css');
const BF_CSS = path.join(REPO, 'src', 'pages', 'abbouw', 'bf', 'bf.css');
const KGJ = path.join(REPO, 'src', 'pages', 'abbouw', 'lp', 'kgj');
const DOEL = path.join(KGJ, 'lp-bf.css');

/* LP-blokken van BF (bouw/lp-dak.cjs). NIET: lptrust (cijferband met BF-claims), lpreviews, lpdaken
   (AB heeft geen echte dakfoto's buiten de voor/na), lpslot (oude versie, niet meer in lp-dak.cjs). */
const LP_BLOKKEN = new Set(['lphero', 'lpbel', 'lpwaarom', 'lpvoordelen', 'lpdiensten', 'lpcta', 'lpinsp', 'lpsticky', 'lpvoet']);
/* LP-varianten van een gedeeld blok (bf-css-port.cjs zet ze in WEG_KLASSEN). */
const LP_KLASSEN = new Set(['kop--lp', 'dkaarten__raster--lp']);
/* Rekenaar: BF-klasse -> AB-klasse (Rekenaar.tsx, Inspectie.tsx). Alleen 1-op-1-rollen. */
const KGJ_NAAM = {
  'rk': 'kgj-reken', 'rk--ab': 'kgj-reken',
  'rk__hoofd': 'kgj-reken__hoofd', 'rk__logo': 'kgj-reken__logo', 'rk__titel': 'kgj-reken__titel', 'rk__tijd': 'kgj-reken__tijd',
  'rk__weg': 'kgj-reken__weg', 'rk__begin': 'kgj-reken__begin', 'rk__balk': 'kgj-reken__balk', 'rk__eind': 'kgj-reken__eind',
  'rk__kop': 'kgj-reken__kop', 'rk__teller': 'kgj-reken__tel', 'rk__terug': 'kgj-reken__terug',
  'rk__stap': 'kgj-reken__stap', 'rk__vraag': 'kgj-reken__vraag', 'rk__keuzes': 'kgj-reken__keuzes',
  'rk__keuzes--oneven': 'kgj-reken__keuzes--oneven', 'rk__keuze': 'kgj-reken__keuze',
  'rk__rij': 'kgj-reken__keuze--icoon', 'rk__ic': 'kgj-reken__icoon',
  'rk__gerust': 'kgj-reken__gerust', 'rk__tip': 'kgj-reken__tip', 'rk__zeker': 'kgj-reken__zeker',
  'rk__vinkjes': 'kgj-reken__vertrouwen', 'rk__form': 'kgj-reken__form', 'rk__velden': 'kgj-reken__rij',
  'rk__privacy': 'kgj-reken__privacy', 'rk__basis': 'kgj-reken__richt-onder', 'rk__formkop': 'kgj-reken__vraag--richt',
  // slotkaart: BF lpinsp__kaart = de kaart van Inspectie.tsx; de terug-link = de alt-knop naar het venster
  'lpinsp__kaart': 'kgj-reken--inspectie', 'lpinsp__terug': 'kgj-reken__alt',
};
/* Toestanden. is-aan zet de AB-rekenaar zelf (Rekenaar.tsx): blijft zo. De andere zet LpBf.tsx met bf-. */
const TOESTAND_KGJ = new Set(['is-aan']);
/* Scope: .bf.bf-lp (de wortel van LpBf.tsx draagt beide klassen). Eén klasse meer dan bf.css: de LP-regels winnen
   van de gedeelde schil, ongeacht in welke volgorde de CSS-bestanden na een build laden (BF: het LP-blok staat na de basis). */
const SCOPE = '.bf.bf-lp';
const TOESTAND_BF = new Set(['is-zichtbaar', 'is-gescrold', 'is-on', 'menu-open']);
/* Weg, ook als ze in een LP-blok staan: reviews en avatars (spec §1, §12), de trustrij met BF-cijfers en
   data-claimbron (§12), de score bij de knop, de beloningsanimatie (AB zet is-beloning niet). */
const WEG = (k) => /review|avatar|trust|knopzeker|claim/.test(k) || k === 'is-beloning';
/* Gemapte regels die AB-inhoud zouden verbergen. BF toont de regel "zeker" nergens (vinkjes in de plaats),
   AB toont hem op een LP zonder vinkjes. BF verbergt kaartkop en vinkjes op gsm in ELKE rekenaar; AB alleen
   in de hero (LpKgj, extra.ts): die regels staan per plek in lp-bf-ab.css. */
const WEG_REGEL = new Set(['.bf.bf-lp .kgj-reken .kgj-reken__zeker', '.bf.bf-lp .kgj-reken .kgj-reken__hoofd|1000', '.bf.bf-lp .kgj-reken .kgj-reken__vertrouwen|1000']);

/* §5 kleuren (BF -> AB), zoals bf-css-port.cjs, plus de lichte merktinten van de LP. */
const HEX = {
  '#fc6607': '#d98c03', '#ef6107': '#d98c03', '#bd4d05': '#915e02', '#b54905': '#c27c02',
  '#0b0b0c': '#0a1628', '#1c1c1c': '#0a1628', '#ff8a3d': '#e9a531', '#e85a05': '#c98303',
  '#fff1e8': '#fbf3e6', '#fff6f0': '#fdf8ef', '#ffe6d5': '#f8e6c2', '#7a3a0e': '#6b4502', '#f2ede8': '#efece6',
};
const RGB = { '252,102,7': '217, 140, 3', '28,28,28': '10, 22, 40', '60,25,0': '10, 22, 40' };
function kleur(waarde) {
  let v = waarde.replace(/#[0-9a-fA-F]{6}\b/g, (h) => HEX[h.toLowerCase()] || h);
  v = v.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,/g, (m, r, g, b) => { const n = RGB[`${r},${g},${b}`]; return n ? `rgba(${n},` : m; });
  return v;
}

const bfKlassen = new Set([...fs.readFileSync(BF_CSS, 'utf8').matchAll(/\.bf-([a-zA-Z_][\w-]*)/g)].map((m) => m[1]));
const klassen = (sel) => [...sel.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]);
const blok = (k) => k.split('__')[0].split('--')[0];
const isLp = (k) => LP_BLOKKEN.has(blok(k)) || LP_KLASSEN.has(k) || Object.prototype.hasOwnProperty.call(KGJ_NAAM, k);
function houden(sel) {
  const ks = klassen(sel);
  if (!ks.some(isLp)) return false; // geen LP-regel: staat al in bf.css of hoort niet bij de LP
  return ks.every((k) => {
    if (WEG(k)) return false;
    if (Object.prototype.hasOwnProperty.call(KGJ_NAAM, k) || TOESTAND_KGJ.has(k) || TOESTAND_BF.has(k)) return true;
    if (blok(k) === 'rk') return false; // rekenaarklasse zonder AB-tegenhanger: met de hand in lp-bf-ab.css
    if (LP_BLOKKEN.has(blok(k)) || LP_KLASSEN.has(k)) return true;
    return bfKlassen.has(k); // gedeelde BF-klasse: alleen als bf.css haar heeft
  });
}
function herschrijf(sel) {
  const r = sel.trim().replace(/\.([a-zA-Z_][\w-]*)/g, (m, k) => {
    if (Object.prototype.hasOwnProperty.call(KGJ_NAAM, k)) return '.' + KGJ_NAAM[k];
    if (TOESTAND_KGJ.has(k)) return '.' + k;
    return '.bf-' + k;
  });
  return SCOPE + ' ' + r;
}
function navyOpMerk(regel) {
  const achter = regel.nodes.find((d) => d.type === 'decl' && /^background(-color)?$/.test(d.prop) && /var\(--merk(-diep|-ui)?\)/.test(d.value));
  if (achter) regel.walkDecls('color', (d) => { if (/^(#fff|#ffffff|white)$/i.test(d.value.trim())) { d.value = 'var(--op-merk)'; stats.witOpMerk++; } });
  return regel;
}

const stats = { regelsIn: 0, regelsUit: 0, selectorsWeg: 0, witOpMerk: 0, hoverLift: 0, wegRegel: 0, chat: 0 };
function verwerkRegel(rule, media) {
  stats.regelsIn++;
  const sels = rule.selectors.filter(houden);
  stats.selectorsWeg += rule.selectors.length - sels.length;
  if (!sels.length) return null;
  const nieuweSels = sels.map(herschrijf).filter((s) => {
    const sleutel = media && /max-width:\s*1000px/.test(media) ? s + '|1000' : s;
    if (WEG_REGEL.has(sleutel) && rule.nodes.some((d) => d.type === 'decl' && d.prop === 'display' && d.value === 'none')) { stats.wegRegel++; return false; }
    return true;
  });
  if (!nieuweSels.length) return null;
  const nieuw = rule.clone({ selectors: nieuweSels });
  nieuw.raws.selector = undefined;
  nieuw.walkComments((c) => c.remove());
  nieuw.walkDecls((d) => { d.value = kleur(d.value); });
  nieuw.walkDecls((d) => { if (/^animation/.test(d.prop)) d.remove(); }); // alleen de beloningsanimatie gebruikte er een
  if (sels.some((s) => s.includes(':hover'))) nieuw.walkDecls('transform', (d) => { d.remove(); stats.hoverLift++; });
  if (!nieuw.nodes.length) return null;
  stats.regelsUit++;
  return navyOpMerk(nieuw);
}

const css = fs.readFileSync(BRON, 'utf8');
const bron = postcss.parse(css, { from: BRON });
const uit = postcss.root();
uit.append(postcss.comment({ text: ` GEGENEREERD door scripts/bf-css-port-lp.cjs uit bfbouw-website/src/css/site.css (${css.split('\n').length} regels)\n   en de chatregels uit kgj/extra.ts. Niet met de hand wijzigen: draai het script opnieuw.\n   AB-aanvullingen staan in lp-bf-ab.css. Elke regel draagt het regelnummer in site.css (L…). ` }));
for (const node of bron.nodes) {
  const lijn = node.source && node.source.start ? node.source.start.line : 0;
  if (node.type === 'rule') {
    const r = verwerkRegel(node, null);
    if (r) { r.raws.before = ' '; uit.append(postcss.comment({ text: `L${lijn}`, raws: { before: '\n' } })); uit.append(r); }
  } else if (node.type === 'atrule' && (node.name === 'media' || node.name === 'supports')) {
    const at = node.clone({ nodes: [] });
    for (const kind of node.nodes || []) {
      if (kind.type !== 'rule') continue;
      const r = verwerkRegel(kind, node.params);
      if (r) at.append(r);
    }
    if (at.nodes.length) { uit.append(postcss.comment({ text: `L${lijn}`, raws: { before: '\n' } })); at.raws.before = ' '; uit.append(at); }
  }
  // @font-face en @keyframes: niet nodig (letter via index.html, geen animatie op de LP)
}

/* ---------- KGJ-onderdelen die hun vorm houden: chat (ChatAssistent.tsx), fotospoor (Werkspoor.tsx) en de
   pijlen van de voor/na-paren (.pc-bediening). Regels uit kgj/extra.ts, tokens uit kgj/stijl.ts, gescoopt onder
   .bf.bf-lp .bf-lpkgj (de omhulling in LpBf.tsx). Regels die aan één LP hangen (.kgjx.kgj-lp--x) vallen weg. ---------- */
const extraTs = fs.readFileSync(path.join(KGJ, 'extra.ts'), 'utf8');
const extraCss = extraTs.slice(extraTs.indexOf('`') + 1, extraTs.lastIndexOf('`'));
const stijlTs = fs.readFileSync(path.join(KGJ, 'stijl.ts'), 'utf8');
const kgjCss = JSON.parse(stijlTs.slice(stijlTs.indexOf('"'), stijlTs.lastIndexOf('"') + 1));
const tokens = postcss.parse(kgjCss).nodes.find((n) => n.type === 'rule' && n.selector === '.kgjx' && n.nodes.some((d) => d.prop === '--merk'));
if (!tokens) { console.error('kgj/stijl.ts: tokenregel .kgjx { --merk … } niet gevonden'); process.exit(1); }
const KGJ_DEEL = /kgj-chat|kgj-werkspoor|pc-bediening/;
const kgjRegel = (r) => r.selectors.every((s) => KGJ_DEEL.test(s) && !/^\.kgjx\.kgj-lp--/.test(s.trim()));
const kgjHerschrijf = (r) => {
  const n = r.clone({ selectors: r.selectors.map((s) => SCOPE + ' .bf-lpkgj ' + s.trim().replace(/^\.kgjx\s+/, '')) });
  n.raws.selector = undefined; n.walkComments((c) => c.remove());
  n.walkDecls(/^font(-family)?$/, (d) => { d.value = d.value.replace(/\bLato,\s*/g, "'Plus Jakarta Sans', "); });
  n.walkDecls(/^animation(-name)?$/, (d) => { for (const m of d.value.matchAll(/\bkgj-[\w-]+/g)) kgjAnimaties.add(m[0]); });
  stats.chat++; return n;
};
const kgjAnimaties = new Set();
uit.append(postcss.comment({ text: 'KGJ-onderdelen (kgj/extra.ts), KGJ-tokens uit kgj/stijl.ts', raws: { before: '\n' } }));
const tok = tokens.clone({ selector: SCOPE + ' .bf-lpkgj' }); tok.raws.selector = undefined; tok.walkComments((c) => c.remove());
uit.append(tok);
const extraBoom = postcss.parse(extraCss);
for (const node of extraBoom.nodes) {
  if (node.type === 'rule' && kgjRegel(node)) uit.append(kgjHerschrijf(node));
  else if (node.type === 'atrule' && node.name === 'media') {
    const at = node.clone({ nodes: [] });
    for (const k of node.nodes || []) if (k.type === 'rule' && kgjRegel(k)) at.append(kgjHerschrijf(k));
    if (at.nodes.length) uit.append(at);
  }
}
for (const node of extraBoom.nodes) {
  if (node.type === 'atrule' && node.name === 'keyframes' && kgjAnimaties.has(node.params)) { const kf = node.clone(); kf.walkComments((c) => c.remove()); uit.append(kf); }
}

let tekst = uit.toResult().css.replace(/\n{3,}/g, '\n\n') + '\n';

/* ---------- zelfcontrole ---------- */
const fouten = [];
const ok = new RegExp('^(bf|bf-[\\w-]+|kgj-reken[\\w-]*|kgj-chat[\\w-]*|kgj-werkspoor[\\w-]*|pc-bediening[\\w-]*|kgj-schuif__wissel|kgj-knop[\\w-]*|is-hoog|' + [...TOESTAND_KGJ].join('|') + ')$');
const gecontroleerd = postcss.parse(tekst);
gecontroleerd.walkRules((r) => {
  if (r.parent.type === 'atrule' && r.parent.name === 'keyframes') return;
  for (const s of r.selectors) {
    if (!s.startsWith(SCOPE + ' ')) fouten.push('selector zonder ' + SCOPE + ': ' + s);
    for (const k of klassen(s)) if (!ok.test(k)) fouten.push(`klasse buiten de LP-naamruimte: ${k} in ${s}`);
  }
});
gecontroleerd.walkAtRules((a) => { if (a.name !== 'media' && a.name !== 'supports' && !(a.name === 'keyframes' && kgjAnimaties.has(a.params))) fouten.push('onverwachte at-regel @' + a.name + ' ' + a.params); });
const laag = tekst.toLowerCase();
for (const verboden of ['#fc6607', '#ef6107', '#bd4d05', '#1c1c1c', '252, 102, 7', '252,102,7', 'bf-lptrust', 'bf-lpreviews', 'bf-lpdaken', 'bf-lpslot', 'review', 'avatar', 'trust', 'knopzeker', 'claimbron', 'beloning', 'rk-glans', 'rk-gloed', 'bf-rk', 'lato', 'playfair', '@font-face', 'bf-dank', 'bf-crm']) {
  if (laag.includes(verboden)) fouten.push('verboden in de uitvoer: ' + verboden);
}
// positieve controle: deze moeten erin zitten
for (const moet of ['.bf.bf-lp .bf-lphero {', '.bf.bf-lp .bf-lphero__laag {', '.bf.bf-lp .bf-lphero__kop {', '.bf.bf-lp .bf-lphero__streep {', '.bf.bf-lp .bf-kop--lp .bf-nav__acties {', '.bf.bf-lp .bf-lpbel {',
  '.bf.bf-lp .kgj-reken {', '.bf.bf-lp .kgj-reken__keuze.is-aan {', '.bf.bf-lp .kgj-reken__eind.is-aan {', '.bf.bf-lp .kgj-reken__tel {', '.bf.bf-lp .kgj-reken__icoon {', '.bf.bf-lp .kgj-reken [hidden] {',
  '.bf.bf-lp .bf-lpinsp {', '.bf.bf-lp .kgj-reken--inspectie {', '.bf.bf-lp .kgj-reken__alt {', '.bf.bf-lp .bf-lpsticky.bf-is-zichtbaar {', '.bf.bf-lp .bf-lpvoet {', '.bf.bf-lp .bf-dkaarten__raster--lp {',
  '.bf.bf-lp .bf-lpkgj {', '.bf.bf-lp .bf-lpkgj .kgj-chatknop {', '.bf.bf-lp .bf-lpkgj .kgj-werkspoor {', '@keyframes kgj-werkspoor-vullen', '--merk: #0a1628']) {
  if (!tekst.includes(moet)) fouten.push('ontbreekt in de uitvoer: ' + moet);
}
// cascade: de tweede (v2) laag van de hero staat NA de eerste, zoals in site.css
{
  const idx = []; let i = 0;
  gecontroleerd.walk((n) => { i++; if (n.type === 'rule' && n.selector === SCOPE + ' .bf-lphero__laag' && n.parent.type === 'root') idx.push(i); });
  if (idx.length < 2 || idx[1] < idx[0]) fouten.push('cascadevolgorde: .bf-lphero__laag v2 niet na v1 (' + idx.join(',') + ')');
}
// geen hover-lift; het lokaas moet de controle doen afgaan
const hoverLift = (c) => { let n = 0; postcss.parse(c).walkRules((r) => { if (r.selector.includes(':hover')) r.walkDecls('transform', () => { n++; }); }); return n; };
if (hoverLift(tekst)) fouten.push('hover-lift in de uitvoer');
if (hoverLift('.bf .x:hover { transform: translateY(-2px); }') !== 1) fouten.push('hover-controle vangt het lokaas niet');
// het eigen lokaas van de LP-port: verboden blokken tegenhouden, toegelaten blokken doorlaten
const lokaasWeg = ['.lptrust__rij li', '.lphero__review blockquote', '.lphero__avatar', '.rk__trust b', '.rkaart__naam', '.lpdaken .rslider-sectie__knop', '.rk__knopzeker', '.rk__balk.is-beloning i::after', '.hero__beeld', '.rk__tegel-beeld', '.reviews__in'];
const lokaasHou = ['.lphero__kop', '.rk__keuze.is-aan', '.kop--lp .nav__acties', '.lpinsp__kaart .fveld', '.lpsticky.is-zichtbaar', '.lphero__vertrouwen .over__sterren', '.dkaarten__raster--lp .dkaart__body'];
for (const s of lokaasWeg) if (houden(s)) fouten.push('filter laat het lokaas door: ' + s);
for (const s of lokaasHou) if (!houden(s)) fouten.push('filter houdt een LP-regel tegen: ' + s);
if (herschrijf('.rk--ab .rk__teller') !== '.bf.bf-lp .kgj-reken .kgj-reken__tel') fouten.push('KGJ-hernoeming faalt op het lokaas');
if (WEG_REGEL.size && !stats.wegRegel) fouten.push('WEG_REGEL: geen enkele AB-verbergregel weggelaten (BF-bron gewijzigd?)');
if (stats.chat < 10) fouten.push(`KGJ-onderdelen: maar ${stats.chat} regels uit extra.ts`);

if (process.env.TOON) console.log(tekst.split('\n').filter((r) => /lato/i.test(r)).join('\n'));
if (fouten.length) { console.error(fouten.slice(0, 40).join('\n')); console.error(`${fouten.length} fouten, lp-bf.css NIET geschreven`); process.exit(1); }
fs.writeFileSync(DOEL, tekst);
console.log(`lp-bf.css geschreven: ${stats.regelsUit} van ${stats.regelsIn} regels gehouden, ${stats.selectorsWeg} selectors weggelaten, ${stats.wegRegel} AB-verbergregel(s) weg, ${stats.witOpMerk}x wit op merkvlak naar navy, ${stats.hoverLift} hover-transform(s) weg, ${stats.chat} KGJ-regels (chat, fotospoor, pijlen), ${Math.round(tekst.length / 1024)} kB`);
