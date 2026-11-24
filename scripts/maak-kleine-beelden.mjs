/**
 * Kleine varianten van de zware beelden op /lp/dakwerken (uitvoeringsplan 24 nov 2026, AB stap 13: "Afbeeldingen kleiner aanleveren, 661 KiB te
 * winnen"). De pagina toonde elk beeld in zijn volle breedte (1.200 tot 1.600 px), ook op een gsm waar het 300 tot 400 px breed staat.
 * Per beeld: een WebP van 800 px breed naast het origineel; de pagina biedt beide aan (srcset + sizes in LpBfC.tsx via beelden-klein.ts) en de browser
 * kiest. De herofoto en de slotfoto (jpg) krijgen ook een WebP op volle breedte. De originelen blijven staan: andere pagina's gebruiken ze.
 * De stockbeelden (src/assets/bf/stock-*-1600.webp) hebben al een variant van 800 px (stock-*-800.webp, in gebruik op /dakwerken): die maakt dit
 * script NIET opnieuw; beelden-klein.ts gebruikt de bestaande.
 *
 * Draaien: node scripts/maak-kleine-beelden.mjs   (overschrijft de varianten; schrijft niets anders)
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const A = 'src/assets';
/* [bron, breedtes] : per breedte komt er <naam>-<breedte>.webp naast de bron (een breedte groter dan de bron wordt de bronbreedte) */
const BEELDEN = [
  ['dak/hero-antraciet-nok.jpg', [800, 1200]],
  ['dak/hellend-pannen.jpg', [800, 1200]],
  ['dak/waarom-werf-ab.webp', [800]],
  ['realisaties/hoeve/hoeve-dak-open-169.webp', [800]],
  ['realisaties/dakkapel/dakkapel-aanbouw.webp', [800]],
  /* de dienstfoto's staan 180 px (gsm, twee naast elkaar) tot 320 px (computer, vier naast elkaar) breed */
  ['bf/stock-dienst-herstelling-900.webp', [480]],
  ['bf/stock-dienst-isolatie-900.webp', [480]],
  ['bf/stock-dienst-nieuw-dak-900.webp', [480]],
];
let voor = 0, na = 0;
for (const [bron, breedtes] of BEELDEN) {
  const f = path.join(A, bron), md = await sharp(f).metadata(), kb = Math.round(fs.statSync(f).size / 1024);
  const basis = f.replace(/\.(jpg|webp)$/, '').replace(/-(1600|900)$/, '');
  const uit = [];
  for (const b of breedtes) {
    const br = Math.min(b, md.width), doel = `${basis}-${br}.webp`;
    await sharp(f).resize({ width: br, withoutEnlargement: true }).webp({ quality: 74, effort: 6 }).toFile(doel);
    uit.push(`${path.basename(doel)} ${Math.round(fs.statSync(doel).size / 1024)} KB`);
  }
  voor += kb; na += Math.round(fs.statSync(`${basis}-${Math.min(breedtes[0], md.width)}.webp`).size / 1024);
  console.log(`${bron} (${md.width}x${md.height}, ${kb} KB) -> ${uit.join(', ')}`);
}
console.log(`som originelen ${voor} KB, som kleinste varianten ${na} KB, verschil ${voor - na} KB`);

/* 24 nov 2026 (laadtijd gsm, PageSpeed: LCP 7,6 s, grootste element = de herofoto): op schermen tot 1.000 px staat de herofoto in een vak van
   100vw x 250 px (lp-bfc.css: object-fit cover, object-position 50% 40%). Van de vierkante foto (1200 x 1200) is daar hoogstens 250/320 = 78 % van de
   hoogte te zien. De gsm-variant is daarom vooraf bijgesneden tot 80 % van de hoogte, verdeeld rond het ankerpunt van 40 % (8 % boven en 12 % onder
   eraf): met dezelfde object-position toont de browser dan exact dezelfde uitsnede bij elke breedte vanaf 313 px. Kwaliteit 66 (naast 74 op 2x
   vergroting niet te onderscheiden). 728 px = 412 px x 1,75 (de gsm van PageSpeed), 828 px = 414 px x 2, 1080 px = 360 px x 3, 1200 px = 390 px x 3 (bronbreedte). */
{
  const bron = path.join(A, 'dak/hero-antraciet-nok.jpg');
  for (const br of [728, 828, 1080, 1200]) {
    const doel = path.join(A, `dak/hero-antraciet-nok-gsm-${br}.webp`);
    await sharp(bron).extract({ left: 0, top: 96, width: 1200, height: 960 }).resize({ width: br, withoutEnlargement: true }).webp({ quality: 66, effort: 6 }).toFile(doel);
    console.log(`herofoto gsm ${br} px: ${Math.round(fs.statSync(doel).size / 1024)} KB`);
  }
}
