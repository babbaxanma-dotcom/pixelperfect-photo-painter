/**
 * Stap 4: analyse voor de totaalrenovatie-campagne van AB Bouw.
 *
 * A. ../6-serp-concurrenten.txt (15 sep 2026, 128 unieke advertenties, 37 adverteerders):
 *    advertenties per adverteerder, hoeken, CTA's, extensies.
 * B. concurrenten.json (Transparency Center, 27 sep 2026): langstlopende actieve
 *    tekstadvertenties, hoeken bij aannemers en bij offertesites.
 *
 * Een hoek telt per ADVERTEERDER (één stem) en per advertentie.
 * Elke hoek-regex heeft een positieve controle: een zin waarvan vaststaat dat hij
 * moet treffen. Faalt er één, dan is de meting ongeldig (exit 1).
 *
 * Draaien: node 4-analyse.cjs  -> analyse.json + uitvoer op het scherm
 */
const fs = require('node:fs');
const path = require('node:path');

const HOEKEN = {
  'ontzorgen / zonder stress': [/zonder (gedoe|stres+|zorgen?|vraagtekens|verrassingen|discussies|kopzorgen)|zorgelo(os|ze)|ontzorg|gemoedsrust|geen verrassingen|geen zorgen/i, 'Renovatie Zonder Stress'],
  'één aanspreekpunt / van A tot Z': [/(één|een|1|vast) (vast )?aanspreekpunt|(één|1) (partner|contact|aannemer)\b|van a ?(tot|-) ?z|\ba tot z\b|d'a à z|start tot (afwerking|oplevering)|begin tot (eind|einde)|ontwerp tot (oplevering|afwerking|realisatie)|plan tot oplevering|ruwbouw tot afwerking|onder één dak|fullservice|allesomvattend/i, 'Van ruwbouw tot afwerking: 1 aannemer'],
  'jaren ervaring (getal)': [/\d+\+?\s*(jaar|jr)\.?\s*(ervaring|bouwervaring|actief|in renovatie|expertise)|meer dan \d+ jaar|al \d+\+?\s*jaar|\d+\+?\s*ans d'expérience|jarenlange ervaring/i, 'Al 45+ jaar ervaring in renovatie'],
  'gratis / vrijblijvend': [/gratis|vrijblijvend|kosteloos|gratuit|sans engagement/i, 'Vraag een gratis offerte'],
  'gratis plaatsbezoek / aan huis': [/(plaats|werf)bezoek|komen (vrijblijvend )?langs|bij je thuis|aan huis/i, 'Gratis werfbezoek en offerte binnen 48u'],
  'prijszekerheid (vaste prijs, raming, budget)': [/vaste prijs|heldere prijs|eerlijke (raming|inschatting|prijs)|binnen (uw |jouw |je |het |afgesproken )?budget|prijs vooraf|transparante prijs/i, 'Duidelijke afspraken, vaste prijs'],
  'prijs berekenen / kostprijs': [/bereken|calculator|prijs ?schatting|verbouwcheck|wat kost|kostprijs|prijs\S* .{0,25}20\d\d|prijzen|totaalrenovatie prijs|kost totaalrenovatie|huis kosten|calculez|prix/i, 'Bereken je renovatiekost'],
  'bewijs (realisaties, projecten, reviews)': [/realisatie|(?<![a-z])projecten|voor ?& ?na|reviews?|beoordee?l|klanten geven|tevreden klanten|\d[,.]\d\s*\(\d+\)|\d+\+?\s*(renovaties|projecten|woningen)|referenties|réalisations/i, 'Bekijk onze realisaties'],
  'kwaliteit / vakmanschap': [/vakmanschap|kwaliteit|kwalitatie|hoogwaardig|topkwaliteit|piekfijn|oog voor detail|regels van de kunst|vakkundig|vakm(annen|ensen)/i, 'Kwaliteit en vakmanschap'],
  'lokaal / regio': [/(in|uit) (uw|jouw|je) (regio|buurt|omgeving)|lokale|in de regio|en omgeving|omstreken|dynamically generated location|regio [A-Z]/i, 'Totaalrenovatie in jouw regio'],
  'snelheid met getal': [/binnen \d+\s*(u|uur|dagen|weken|werkdagen)\b|in (slechts )?\d+\s*(min|minuten)\b|\b\d+\s*(u|h)\b|48u/i, 'Offerte binnen 48 uur'],
  /* Alleen het woord garantie: "wij garanderen vakmanschap" is geen garantie-aanbod. */
  'garantie': [/garantie/i, '15 jaar garantie'],
  'eigen personeel / team': [/eigen (personeel|team|ploeg|vakmensen|mensen)/i, 'Alles met eigen personeel'],
  'premies / subsidies': [/premie|subsidie|\bprimes?\b/i, 'Tot € 2.625 korting op factuur via premies'],
  'btw 6%': [/\bbtw\b|\b6 ?%/i, 'Renoveren aan 6% btw'],
  'EPC / energielabel': [/\bepc\b|energielabel|energiescore/i, 'Van EPC F naar C'],
  'renovatieplicht': [/renovatieplicht|renovatieverplichting/i, 'Renovatieplicht na aankoop'],
  'energie / isolatie / duurzaam': [/energiezuinig|energie|isol|duurza|ben-?woning/i, 'Energiezuinig renoveren?'],
};
const CTA = {
  'offerte aanvragen': [/offerte|devis/i, 'Vraag uw gratis offerte'],
  'afspraak / gesprek / kennismaking': [/afspraak|gesprek|kennismaking|rendez-vous/i, 'Plan een 1e gesprek'],
  'contact / bellen': [/contacteer|contact|bel ons|bellen|\bbel\b|appeler/i, 'Neem vandaag nog contact'],
  'realisaties bekijken': [/(bekijk|ontdek|zie).{0,20}(realisaties|projecten)/i, 'Bekijk onze realisaties'],
  'zelf berekenen / check': [/bereken|verbouwcheck|calculez/i, 'Doe onze verbouwcheck'],
  'offertes vergelijken': [/vergelijk|comparez/i, 'Vergelijk de Best Beoordeelde Aannemers'],
  'postcode invullen': [/postcode/i, 'Vul uw Postcode in'],
};
const OFFERTE = {
  'aantal gratis offertes (getal)': [/\d+\s*(gratis\s*)?offertes|max \d+|tot \d+ gratis|\d+ devis/i, '6 Gratis Offertes in 2 Minuten'],
  'vergelijken': [/vergelijk|comparez/i, 'Vergelijk de Best Beoordeelde Aannemers'],
  'snelheid in minuten': [/in (slechts )?\d+\s*(min|minuten)\b|in 1 min/i, 'in 2 Minuten'],
  'besparen / korting': [/bespa(ar|ren)|korting|économis/i, 'Bespaar tot 40%'],
  'prijs + jaartal (prijsgids)': [/(prijs|prijzen|prix|kost\S*)\D{0,30}20\d\d|20\d\d\D{0,15}(prijs|prijzen|prix)/i, 'Prijs Aannemer Renovatie 2025'],
  'volume-cijfers (vakmensen, opdrachten, klanten)': [/\d[\d.]*\+?\s*(vakspecialisten|opdrachten|schilders|tevreden klanten|gebruikers|catégories)/i, '2000+ Vakspecialisten'],
  '"beste/top" aannemers': [/best(e)? beoordeelde|top (aannemers|vakmannen|specialisten|renovatiespecialisten)|de beste keuze/i, 'Top Aannemers'],
  'gratis / vrijblijvend': [/gratis|vrijblijvend|gratuit|sans engagement/i, 'Gratis & Vrijblijvend'],
  'postcode invullen': [/postcode/i, 'Vul uw Postcode in'],
  'premies': [/premie|\bprimes?\b/i, 'Premie in Vlaanderen'],
};

/* Positieve controle */
let fout = 0;
for (const [set, lijst] of Object.entries({ HOEKEN, CTA, OFFERTE })) {
  for (const [naam, [re, voorbeeld]] of Object.entries(lijst)) {
    if (!re.test(voorbeeld)) { console.error(`CONTROLE FAALT: ${set} / ${naam} treft "${voorbeeld}" niet`); fout++; }
  }
}
if (fout) process.exit(1);

const tel = (items, sets, tekstVan, wieVan) => {
  const wie = new Set(items.map(wieVan));
  return Object.entries(sets).map(([naam, [re]]) => {
    const t = items.filter((x) => re.test(tekstVan(x)));
    return { hoek: naam, adverteerders: new Set(t.map(wieVan)).size, vanAdverteerders: wie.size, advertenties: t.length, vanAdvertenties: items.length, wie: [...new Set(t.map(wieVan))] };
  }).sort((a, b) => b.adverteerders - a.adverteerders || b.advertenties - a.advertenties);
};

/* ---------- A. SERP 15 sep ---------- */
const SERP = fs.readFileSync(path.join(__dirname, '..', '6-serp-concurrenten.txt'), 'utf8').split('\n').filter((r) => r.includes(' :: '))
  .map((r) => { const d = r.split(' :: ').map((x) => x.trim()); return { domein: d[0], kop: d[1], velden: d.slice(1), tekst: d.slice(1).join(' || ') }; });
const GEEN_AANNEMER = { 'aannemeroffertes.be': 'offertesite', 'renovatieweekend.be': 'evenement', 'sint-niklaas.be': 'stad', 'sundae.be': 'interieuradvies', 'kwadraat.be': 'projectontwikkelaar' };
const perDomein = {};
for (const r of SERP) perDomein[r.domein] = (perDomein[r.domein] || 0) + 1;
const serpTop = Object.entries(perDomein).sort((a, b) => b[1] - a[1]).map(([d, n]) => ({ domein: d, advertenties: n, soort: GEEN_AANNEMER[d] || 'aannemer' }));
const serpAannemers = SERP.filter((r) => !GEEN_AANNEMER[r.domein]);
const serpHoeken = tel(serpAannemers, HOEKEN, (r) => r.tekst, (r) => r.domein);
const serpCta = tel(serpAannemers, CTA, (r) => r.tekst, (r) => r.domein);
/* Extensies: velden na de omschrijving (index >= 3 van velden = kop, naam, omschrijving, ...). */
const extSoort = (e) => /bezoeken in de afgelopen maand/i.test(e) ? 'annotatie "10.000+ bezoeken"'
  : /^\d,\d \(\d+\)$/.test(e) ? 'reviews (sterren)' : /\+32/.test(e) ? 'telefoonnummer'
  : /^(Route|Website|Bel ons)$/.test(e) ? 'knop (Route/Website/Bel ons)'
  : /Aannemer ·|Geopend|Sluit om/.test(e) ? 'locatie (adres/openingsuren)' : 'sitelink of callout';
const ext = {};
for (const r of SERP) for (const e of r.velden.slice(3)) {
  const s = extSoort(e);
  (ext[s] ||= { adverteerders: new Set(), vermeldingen: 0, voorbeelden: new Set() });
  ext[s].adverteerders.add(r.domein); ext[s].vermeldingen++; if (ext[s].voorbeelden.size < 40) ext[s].voorbeelden.add(e);
}
/* Terugkerende kopfragmenten: kop gesplitst op | en -, plaatsnamen genormaliseerd naar <stad>. */
const STEDEN = /\b(Antwerpen|Gent|Brugge|Leuven|Hasselt|Mechelen|Aalst|Kortrijk|Oostende|Sint[- ]Niklaas|Wilrijk|Dendermonde|Geraardsbergen|Brussel)\b/gi;
const frag = {};
for (const r of serpAannemers) {
  for (const f of new Set(r.kop.split(/\s+[|–-]\s+/).map((x) => x.trim().replace(STEDEN, '<stad>').toLowerCase()).filter(Boolean))) {
    (frag[f] ||= { adverteerders: new Set(), advertenties: 0 }); frag[f].adverteerders.add(r.domein); frag[f].advertenties++;
  }
}
const serpFragmenten = Object.entries(frag).map(([f, v]) => ({ fragment: f, adverteerders: v.adverteerders.size, advertenties: v.advertenties, wie: [...v.adverteerders] }))
  .filter((x) => x.advertenties >= 3).sort((a, b) => b.advertenties - a.advertenties);
const serpExt = Object.entries(ext).map(([s, v]) => ({ soort: s, adverteerders: v.adverteerders.size, vermeldingen: v.vermeldingen, wie: [...v.adverteerders], voorbeelden: [...v.voorbeelden] }))
  .sort((a, b) => b.adverteerders - a.adverteerders);

/* ---------- B. Transparency Center 27 sep ---------- */
const TC = JSON.parse(fs.readFileSync(path.join(__dirname, 'concurrenten.json'), 'utf8'));
const RENOV = /renov|verbouw|rénov/i;
const tekstTc = (a) => [a.kop, a.beschrijving, ...(a.sitelinks || []), ...(a.extensies || [])].filter(Boolean).join(' || ');
const isRenov = (a) => RENOV.test(tekstTc(a) + ' ' + (a.weergaveUrl || ''));
const act = TC.advertenties.filter((a) => a.actief && a.kop);
const actAannemerRenov = act.filter((a) => a.soort === 'aannemer' && isRenov(a)).sort((a, b) => b.dagen - a.dagen);
const actOfferteRenov = act.filter((a) => a.soort === 'offertesite' && isRenov(a)).sort((a, b) => b.dagen - a.dagen);
const top10strikt = actAannemerRenov.slice(0, 10);
const perSp = {};
const top10max2 = actAannemerRenov.filter((a) => ((perSp[a.adverteerder] = (perSp[a.adverteerder] || 0) + 1) <= 2)).slice(0, 10);
const kort = (a) => ({ dagen: a.dagen, dagenGetoond: a.dagenGetoond, eerst: a.eerst, laatst: a.laatst, adverteerder: a.adverteerder, kop: a.kop, koppen: a.koppen, beschrijving: a.beschrijving, sitelinks: a.sitelinks, url: a.weergaveUrl, bron: a.bron, link: a.link });
const tcHoeken = tel(actAannemerRenov, HOEKEN, tekstTc, (a) => a.adverteerder);
const tcCta = tel(actAannemerRenov, CTA, tekstTc, (a) => a.adverteerder);
const offHoeken = tel([...actOfferteRenov, ...SERP.filter((r) => r.domein === 'aannemeroffertes.be').map((r) => ({ adverteerder: 'aannemeroffertes.be', tekst: r.tekst }))],
  OFFERTE, (a) => a.tekst || tekstTc(a), (a) => a.adverteerder);
const offHoekenAls = tel(actOfferteRenov, HOEKEN, tekstTc, (a) => a.adverteerder);
const sitelinkTel = {};
for (const a of actAannemerRenov) for (const s of new Set(a.sitelinks || [])) (sitelinkTel[s] ||= new Set()).add(a.adverteerder);
const sitelinks = Object.entries(sitelinkTel).map(([s, w]) => ({ sitelink: s, adverteerders: w.size, wie: [...w] })).sort((a, b) => b.adverteerders - a.adverteerders);
const perSpeler = {};
for (const a of TC.advertenties) {
  const p = (perSpeler[a.adverteerder] ||= { soort: a.soort, tekst: 0, actief: 0, actiefRenov: 0, langsteActiefRenov: null });
  p.tekst++; if (a.actief) p.actief++;
  if (a.actief && a.kop && isRenov(a)) { p.actiefRenov++; if (!p.langsteActiefRenov || a.dagen > p.langsteActiefRenov) p.langsteActiefRenov = a.dagen; }
}

const uit = {
  gemaakt: '2026-09-27', bronnen: { A: 'ads/totaalrenovatie/6-serp-concurrenten.txt (15 sep 2026)', B: 'onderzoek-27sep/concurrenten.json (Transparency Center, 27 sep 2026)' },
  regels: { actief: TC.actiefRegel, renovatieFilter: String(RENOV) + ' in kop, beschrijving, sitelinks, extensies of weergave-URL', serpAannemers: 'alle domeinen behalve ' + Object.keys(GEEN_AANNEMER).join(', ') },
  A: { advertentiesPerAdverteerder: serpTop, kopFragmenten: serpFragmenten, hoekenAannemers: serpHoeken, ctaAannemers: serpCta, extensies: serpExt },
  B: { perSpeler, aantalActiefAannemerRenov: actAannemerRenov.length, aantalActiefOfferteRenov: actOfferteRenov.length,
    top10strikt: top10strikt.map(kort), top10max2PerAdverteerder: top10max2.map(kort), hoekenAannemers: tcHoeken, ctaAannemers: tcCta,
    sitelinksAannemers: sitelinks, offertesiteHoeken: offHoeken, offertesitesOpAannemerHoeken: offHoekenAls,
    offertesiteLangst: actOfferteRenov.slice(0, 12).map(kort) },
};
fs.writeFileSync(path.join(__dirname, 'analyse.json'), JSON.stringify(uit, null, 1));

const regel = (h) => `  ${h.hoek.padEnd(46)} ${String(h.adverteerders).padStart(2)}/${h.vanAdverteerders} adv.  ${String(h.advertenties).padStart(3)}/${h.vanAdvertenties} ads`;
console.log('A. SERP 15 sep — advertenties per adverteerder (top 13)');
for (const r of serpTop.slice(0, 13)) console.log(`  ${String(r.advertenties).padStart(2)}  ${r.domein} (${r.soort})`);
console.log(`\nA. hoeken bij aannemers (SERP, ${new Set(serpAannemers.map((r) => r.domein)).size} aannemers, ${serpAannemers.length} ads)`);
for (const h of serpHoeken) console.log(regel(h));
console.log('\nA. kopfragmenten in >= 3 advertenties');
for (const f of serpFragmenten) console.log(`  ${String(f.advertenties).padStart(2)} ads ${f.adverteerders} adv.  ${f.fragment}  (${f.wie.join(', ')})`);
console.log('\nA. CTA bij aannemers (SERP)'); for (const h of serpCta) console.log(regel(h));
console.log('\nA. extensies (SERP, alle 37)'); for (const e of serpExt) console.log(`  ${e.soort.padEnd(32)} ${e.adverteerders} adv. ${e.vermeldingen}x`);
console.log(`\nB. per speler (TC 27 sep)`); for (const [s, p] of Object.entries(perSpeler)) console.log(`  ${s.padEnd(24)} ${p.soort.padEnd(11)} tekst ${p.tekst} · actief ${p.actief} · actief+renov ${p.actiefRenov} · langste ${p.langsteActiefRenov}`);
console.log(`\nB. top 10 strikt (actief, aannemer, renovatie: ${actAannemerRenov.length})`);
for (const a of top10strikt) console.log(`  ${a.dagen}d/${a.dagenGetoond} ${a.adverteerder}: ${a.kop}`);
console.log('\nB. top 10 max 2 per adverteerder');
for (const a of top10max2) console.log(`  ${a.dagen}d/${a.dagenGetoond} ${a.eerst} ${a.adverteerder}: ${a.kop} || ${a.beschrijving} || SL ${a.sitelinks.join(' ; ')} [${a.bron}] ${a.cr || ''}`);
console.log(`\nB. hoeken bij aannemers (TC actief+renov)`); for (const h of tcHoeken) console.log(regel(h));
console.log('\nB. CTA bij aannemers (TC)'); for (const h of tcCta) console.log(regel(h));
console.log('\nB. sitelinks bij >=2 aannemers'); for (const s of sitelinks.filter((x) => x.adverteerders >= 2)) console.log(`  ${s.adverteerders}  ${s.sitelink}  (${s.wie.join(', ')})`);
console.log(`\nB. offertesites (TC actief+renov ${actOfferteRenov.length} + SERP aannemeroffertes)`); for (const h of offHoeken) console.log(regel(h));
console.log('\nB. offertesites op aannemer-hoeken'); for (const h of offHoekenAls) console.log(regel(h));
console.log('\nB. offertesites langst actief (renovatie)'); for (const a of actOfferteRenov.slice(0, 12)) console.log(`  ${a.dagen}d/${a.dagenGetoond} ${a.adverteerder}: ${a.kop} || ${(a.beschrijving || '').slice(0, 160)} || SL ${a.sitelinks.join(' ; ')}`);
