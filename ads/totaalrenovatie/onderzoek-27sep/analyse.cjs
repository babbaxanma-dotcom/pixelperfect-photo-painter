/**
 * Analyse van de autocomplete-oogst (raw.json) tegen de campagne in ../bouw.cjs, 27 sep 2026.
 *   1. elke unieke aanvulling: klasse (indeling.cjs), welke van de 29 zoekwoorden hem vangen, welke uitsluiting hem blokkeert
 *   2. uitsluitingen die een KOPER (of een koopnabije premie/btw-zoeker, of een KOPER uit bouw.cjs) blokkeren
 *   3. KOPER-aanvullingen die geen van de 29 zoekwoorden vangt
 *   4. per zoekwoord: klassen van zijn eigen autocomplete (de 10 populairste vervolgen) en van alles wat hij vangt
 *   5. kandidaat-uitsluitingen (KANDIDATEN hieronder), getoetst tegen ALLE KOPER- en koopnabije aanvullingen
 * Vangen = dezelfde tokenlogica als blokkeert() in bouw.cjs (woordgroep = aaneengesloten woorden in volgorde,
 * exact = gelijk). "variant" = na enkelvoud/meervoud en "totaal renovatie" -> "totaalrenovatie".
 * Schrijft zoekwoorden.json. Draaien: node analyse.cjs
 */
const fs = require('fs');
const path = require('path');
const { ZOEKWOORDEN, UITSLUITEN, KOPER: KOPER_BOUW, blokkeert, tok } = require('./bron.cjs');
const { deel } = require('./indeling.cjs');
const raw = require('./raw.json');

/* Kandidaat-uitsluitingen: [tekst, type, reden]. Elk moet 0 KOPER en 0 koopnabije aanvullingen blokkeren. */
const KANDIDATEN = require('./kandidaten.cjs');

const NORM = { renovaties: 'renovatie', totaalrenovaties: 'totaalrenovatie', woningen: 'woning', huizen: 'huis', aannemers: 'aannemer', woningrenovaties: 'woningrenovatie' };
const norm = (s) => tok(s).map((w) => NORM[w] || w).join(' ').replace(/\btotaal renovatie\b/g, 'totaalrenovatie');

/* 1. Aanvullingen verzamelen */
const aanv = new Map();
for (const [zaad, v] of Object.entries(raw)) for (const a of v.aanvullingen) {
  const k = a.toLowerCase().trim();
  if (!aanv.has(k)) aanv.set(k, { tekst: k, zaden: [] });
  aanv.get(k).zaden.push({ zaad, soort: v.soort });
}
const lijst = [];
for (const a of aanv.values()) {
  const d = deel(a.tekst);
  const gevangen = ZOEKWOORDEN.filter((z) => blokkeert(z.tekst, z.type, a.tekst)).map((z) => `${z.type === 'e' ? '[' + z.tekst + ']' : '"' + z.tekst + '"'}`);
  const variant = gevangen.length ? [] : ZOEKWOORDEN.filter((z) => blokkeert(norm(z.tekst), z.type, norm(a.tekst))).map((z) => `"${z.tekst}"`);
  const geblokkeerd = UITSLUITEN.filter(([t, ty]) => blokkeert(t, ty, a.tekst)).map(([t, ty]) => (ty === 'e' ? `[${t}]` : `"${t}"`));
  const alleenNeg = a.zaden.every((z) => z.soort.every((s) => s === 'neg' || s === 'kand'));
  lijst.push({ tekst: a.tekst, klasse: d.klasse, reden: d.reden, koopnabij: d.koopnabij, geo: d.geo, gevangenDoor: gevangen, gevangenAlsVariant: [...new Set(variant)], geblokkeerdDoor: geblokkeerd, zaden: a.zaden.map((z) => z.zaad), alleenUitNegZaad: alleenNeg });
}
lijst.sort((a, b) => a.tekst.localeCompare(b.tekst));
const koper = lijst.filter((a) => a.klasse === 'KOPER');
const koopnabij = lijst.filter((a) => a.koopnabij);

/* 2. Uitsluitingen die een koper blokkeren */
const blokRapport = [];
for (const [t, ty] of UITSLUITEN) {
  const k = koper.filter((a) => blokkeert(t, ty, a.tekst)).map((a) => a.tekst);
  const n = koopnabij.filter((a) => blokkeert(t, ty, a.tekst)).map((a) => a.tekst);
  const b = KOPER_BOUW.filter((q) => blokkeert(t, ty, q));
  const alles = lijst.filter((a) => blokkeert(t, ty, a.tekst));
  const perKlasse = {}; for (const a of alles) perKlasse[a.klasse] = (perKlasse[a.klasse] || 0) + 1;
  blokRapport.push({ uitsluiting: ty === 'e' ? `[${t}]` : `"${t}"`, blokkeertKoper: k, blokkeertKoopnabij: n, blokkeertKoperBouw: b, blokkeertPerKlasse: perKlasse });
}

/* 3. Kopers die geen zoekwoord vangt */
const gemist = koper.filter((a) => a.gevangenDoor.length === 0);

/* 4. Per zoekwoord */
const perZoekwoord = ZOEKWOORDEN.map((z) => {
  const eigen = (raw[z.tekst]?.aanvullingen || []).map((s) => lijst.find((a) => a.tekst === s.toLowerCase().trim()));
  const telEigen = {}; for (const a of eigen) telEigen[a.klasse] = (telEigen[a.klasse] || 0) + 1;
  const vangt = lijst.filter((a) => !a.alleenUitNegZaad && blokkeert(z.tekst, z.type, a.tekst));
  const telVangt = {}; for (const a of vangt) telVangt[a.klasse] = (telVangt[a.klasse] || 0) + 1;
  const nietKoperEigen = eigen.filter((a) => a.klasse !== 'KOPER').map((a) => `${a.tekst} (${a.klasse})`);
  return { groep: z.groep, zoekwoord: z.type === 'e' ? `[${z.tekst}]` : `"${z.tekst}"`, eigenAutocomplete: telEigen, eigenNietKoper: nietKoperEigen, alleGevangen: telVangt, aandeelKoperGevangen: vangt.length ? Math.round((100 * (telVangt.KOPER || 0)) / vangt.length) : null };
});

/* 5. Kandidaat-uitsluitingen */
const kandRapport = KANDIDATEN.map(([t, ty, reden]) => {
  const k = koper.filter((a) => blokkeert(t, ty, a.tekst)).map((a) => a.tekst);
  const n = koopnabij.filter((a) => blokkeert(t, ty, a.tekst)).map((a) => a.tekst);
  const b = KOPER_BOUW.filter((q) => blokkeert(t, ty, q));
  const eigen = ZOEKWOORDEN.filter((z) => blokkeert(t, ty, z.tekst)).map((z) => z.tekst);
  const winst = lijst.filter((a) => a.klasse !== 'KOPER' && a.gevangenDoor.length && a.geblokkeerdDoor.length === 0 && blokkeert(t, ty, a.tekst)).map((a) => `${a.tekst} (${a.klasse})`);
  const veilig = !k.length && !n.length && !b.length && !eigen.length;
  return { uitsluiting: ty === 'e' ? `[${t}]` : `"${t}"`, reden, veilig, blokkeertKoper: k, blokkeertKoopnabij: n, blokkeertKoperBouw: b, blokkeertEigenZoekwoord: eigen, houdtTegen: winst };
});

/* Positieve controle: de toets moet een bekende blokkade vinden. */
if (!blokkeert('badkamer', 'w', 'aannemer renovatie 1e verdieping inclusief badkamer')) { console.error('TOETS DEFECT'); process.exit(2); }

const tel = {}; for (const a of lijst) tel[a.klasse] = (tel[a.klasse] || 0) + 1;
const uit = {
  meta: {
    datum: '2026-09-27',
    bron: 'Google-autocomplete https://suggestqueries.google.com/complete/search?client=firefox&hl=nl&gl=be (500 ms pauze), zie oogst.cjs',
    campagne: '../bouw.cjs (29 zoekwoorden, 52 uitsluitingen, 11 KOPER-zoekopdrachten)',
    zaden: Object.keys(raw).length,
    zadenPerSoort: Object.values(raw).reduce((m, v) => { for (const s of v.soort) m[s] = (m[s] || 0) + 1; return m; }, {}),
    uniekeAanvullingen: lijst.length,
    perKlasse: tel,
    koopnabij: koopnabij.length,
    klassen: {
      KOPER: 'wil een aannemer of een prijs voor de renovatie/verbouwing van een woning (ook appartement, rijwoning, villa, hoeve)',
      INFO: 'weetjes, regels, premie/btw/lening, doe-het-zelf, betekenis, inspiratie, twijfel; koopnabij=true: premie/btw/epc/renovatieplicht bij een woning (bouw.cjs houdt die bewust)',
      ANDER: 'ander vak (badkamer, keuken, dak, gevel, schilder, architect, ...), ander type (kantoor, winkel, kerk, appartementsgebouw, vakantiewoning, caravan), merknaam concurrent, buitenland',
      JUNK: 'vacatures, opleiding, tv/youtube, tweedehands, vastgoed te koop/te huur, vertaling, ongerelateerd',
    },
    volumes: {
      bron: 'bouw.cjs regel 153-154 (Zoekwoordplanner 26 sep, Belgie, gemiddeld per maand). 1-zoekwoorden.csv (15 sep) bevat geen volumes, alleen max. CPC. Geen andere volumebron zonder browser.',
      totaalrenovatie: 880, 'huis renoveren': 480, 'renovatie aannemer': 390, 'renovatie woning': 210,
      bodBovenaan: { laag: 1.6, hoog: 6.83 },
    },
    matchlogica: 'gevangenDoor/geblokkeerdDoor = blokkeert() uit bouw.cjs (woordgroep: aaneengesloten tokens in volgorde; exact: gelijk). gevangenAlsVariant = na enkelvoud/meervoud en "totaal renovatie"->"totaalrenovatie".',
  },
  zaden: raw,
  aanvullingen: lijst,
  uitsluitingenToets: blokRapport,
  kopersNietGevangen: gemist.map((a) => ({ tekst: a.tekst, geo: a.geo, reden: a.reden, gevangenAlsVariant: a.gevangenAlsVariant, zaden: a.zaden })),
  perZoekwoord,
  kandidaatUitsluitingen: kandRapport,
};
fs.writeFileSync(path.join(__dirname, 'zoekwoorden.json'), JSON.stringify(uit, null, 1) + '\n');

/* Console-samenvatting */
console.log(`${lijst.length} unieke aanvullingen uit ${Object.keys(raw).length} zaden:`, tel, `koopnabij ${koopnabij.length}`);
console.log('\n== Uitsluitingen die een KOPER / koopnabije / bouw-KOPER blokkeren');
for (const r of blokRapport) if (r.blokkeertKoper.length || r.blokkeertKoopnabij.length || r.blokkeertKoperBouw.length)
  console.log(`${r.uitsluiting}: KOPER ${JSON.stringify(r.blokkeertKoper)} | koopnabij ${JSON.stringify(r.blokkeertKoopnabij)} | bouw ${JSON.stringify(r.blokkeertKoperBouw)}`);
console.log('\n== KOPER niet gevangen (' + gemist.length + ')');
for (const a of gemist) console.log(`${a.tekst} | ${a.geo || '-'} | variant: ${a.gevangenAlsVariant.join(',') || '-'}`);
console.log('\n== Per zoekwoord (eigen autocomplete | alles gevangen, % KOPER)');
for (const p of perZoekwoord) console.log(`${p.zoekwoord.padEnd(34)} eigen ${JSON.stringify(p.eigenAutocomplete)} | gevangen ${JSON.stringify(p.alleGevangen)} ${p.aandeelKoperGevangen}% KOPER`);
console.log('\n== Kandidaat-uitsluitingen');
for (const k of kandRapport) console.log(`${k.veilig ? 'VEILIG' : 'VALT AF'} ${k.uitsluiting}: houdt ${k.houdtTegen.length} tegen ${JSON.stringify(k.houdtTegen)}${k.veilig ? '' : ' | blokkeert KOPER ' + JSON.stringify(k.blokkeertKoper) + ' koopnabij ' + JSON.stringify(k.blokkeertKoopnabij) + ' bouw ' + JSON.stringify(k.blokkeertKoperBouw) + ' eigen ' + JSON.stringify(k.blokkeertEigenZoekwoord)}`);
