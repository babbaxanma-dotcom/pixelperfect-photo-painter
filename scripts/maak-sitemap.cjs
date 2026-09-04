#!/usr/bin/env node
/**
 * De sitemap, afgeleid uit de routes zelf.
 *
 * Aanleiding: de sitemap noemde 74 adressen waarvan er 58 niet bestonden. Alle
 * gemeentepagina's en alle blogartikelen zijn ooit vervangen door een omleiding
 * naar de homepage, maar de sitemap bleef ze beloven. Google kreeg dus 58 keer
 * dezelfde homepage aangeboden onder een ander adres: verspild crawlbudget, en
 * acht en vijftig bijna-duplicaten van de belangrijkste pagina.
 *
 * Met de hand bijhouden gaat opnieuw mis zodra er een route verdwijnt. Dit
 * script leest App.tsx, houdt over wat werkelijk een pagina rendert, en laat
 * daar nog drie soorten uit vallen:
 *
 *   - omleidingen (element={<Navigate .../>}), want die zijn geen pagina;
 *   - /index, dat dezelfde inhoud toont als /;
 *   - /bedankt, dat pas na een aanvraag zin heeft;
 *   - de /lp/-varianten van totaalrenovatie en badkamerrenovatie, want die
 *     tonen dezelfde pagina als het korte adres en horen niet allebei in de
 *     zoekresultaten.
 *
 * Draaien: node scripts/maak-sitemap.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const BASIS = 'https://abgroep.be';
const APP = path.join(__dirname, '..', 'src', 'App.tsx');
const UIT = path.join(__dirname, '..', 'public', 'sitemap.xml');

/* Adressen die wel een pagina renderen maar niet in de zoekresultaten horen. */
const NIET_IN_SITEMAP = new Set([
  '/index',            // zelfde inhoud als /
  '/bedankt',          // heeft alleen zin na een aanvraag
  '/lp/totaalrenovatie',    // duplicaat van /totaalrenovatie
  '/lp/badkamerrenovatie',  // duplicaat van /badkamerrenovatie
]);

/* Hoe vaak een pagina verandert en hoe zwaar ze weegt. Alleen een hint voor
   zoekmachines, maar een verkeerde hint is erger dan geen: de dienstpagina's
   veranderen echt vaker dan de voorwaarden. */
const GEWICHT = (pad) => {
  if (pad === '/') return { prio: '1.0', freq: 'weekly' };
  if (pad === '/totaalrenovatie' || pad === '/badkamerrenovatie') return { prio: '0.9', freq: 'weekly' };
  if (pad.startsWith('/calculator/')) return { prio: '0.8', freq: 'monthly' };
  if (['/privacy', '/voorwaarden', '/cookies'].includes(pad)) return { prio: '0.3', freq: 'yearly' };
  return { prio: '0.7', freq: 'monthly' };
};

function routesUitApp() {
  const bron = fs.readFileSync(APP, 'utf8');
  const uit = [];
  /* Elke <Route path="..." element={<Iets ...  — de naam achter element bepaalt
     of het een pagina is of een omleiding. */
  for (const m of bron.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<\s*([A-Za-z][A-Za-z0-9_]*)/g)) {
    const [, pad, component] = m;
    if (component === 'Navigate') continue;   // omleiding, geen pagina
    if (pad.includes(':') || pad === '*') continue;  // dynamisch of vangnet
    if (NIET_IN_SITEMAP.has(pad)) continue;
    uit.push(pad);
  }
  return [...new Set(uit)].sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

const paden = routesUitApp();

/* Een lege of bijna lege sitemap wijst op een leesfout in App.tsx, niet op een
   site zonder pagina's. Dan liever stoppen dan de bestaande overschrijven. */
if (paden.length < 10) {
  console.error(`FOUT: maar ${paden.length} routes gevonden in App.tsx — sitemap niet geschreven`);
  process.exit(2);
}

const datum = new Date().toISOString().slice(0, 10);
const regels = paden.map((pad) => {
  const { prio, freq } = GEWICHT(pad);
  return [
    '  <url>',
    `    <loc>${BASIS}${pad === '/' ? '/' : pad}</loc>`,
    `    <lastmod>${datum}</lastmod>`,
    `    <changefreq>${freq}</changefreq>`,
    `    <priority>${prio}</priority>`,
    '  </url>',
  ].join('\n');
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<!-- Gemaakt door scripts/maak-sitemap.cjs uit de routes in src/App.tsx.',
  '     Niet met de hand bijwerken: draai het script opnieuw. -->',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...regels,
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(UIT, xml);
console.log(`sitemap geschreven: ${paden.length} adressen`);
for (const p of paden) console.log('  ' + p);
