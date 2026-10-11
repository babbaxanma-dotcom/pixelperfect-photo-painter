#!/usr/bin/env node
/**
 * Beelden voor de BF-stijl van abgroep.be (spec/bf-stijl.md §4 en §9).
 *
 * Maakt van elke ECHTE AB-foto webp-varianten in src/assets/bf/<naam>-<breedte>.webp
 * (800, 1440 en 2048 waar het origineel groot genoeg is; nooit opschalen: is het
 * origineel smaller dan de volgende stap, dan is het origineel zelf de grootste
 * variant). sharp schrijft geen metadata weg tenzij je erom vraagt, dus EXIF en
 * GPS verdwijnen; .rotate() zet eerst de EXIF-stand in de pixels.
 *
 * Kopieert ook de drone-opname IMG_9019 uit Downloads naar
 * src/assets/lp-diensten/eigen/IMG_9019.jpg (metadata weg), zodat de bron in de
 * repo staat.
 *
 * Schrijft src/pages/abbouw/bf/beelden.ts: per beeld de afmetingen en de
 * varianten. schil.ts bouwt daarmee srcset, width en height.
 *
 * Herhaalbaar: node scripts/bf-beelden.cjs (bestaande varianten worden overschreven).
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const REPO = path.resolve(__dirname, '..');
const A = (p) => path.join(REPO, 'src', 'assets', p);
const DOEL = A('bf');
const MANIFEST = path.join(REPO, 'src', 'pages', 'abbouw', 'bf', 'beelden.ts');
const DRONE_BRON = process.env.IMG_9019 || 'C:/Users/Mohammed/Downloads/IMG_9019 (1).jpeg';
const DRONE_DOEL = A('lp-diensten/eigen/IMG_9019.jpg');

/* Alleen echte AB-foto's (spec §9, ab-fotos.md §3). Naam = bestandsnaam zonder extensie. */
const FOTOS = [
  // hero (4 dia's)
  'lp-diensten/eigen/IMG_9019.jpg',
  'lp-diensten/eigen/IMG_0102.jpg',
  'lp-diensten/realisaties/totaalrenovatie-p5-a.jpg',
  'lp-diensten/eigen/IMG_9028.jpg',
  // over-split
  'lp-diensten/eigen/IMG_0105.jpg',
  // dienstenbanner
  'lp-diensten/realisaties/tegelwerken-p4-a.jpg',
  // dienstkaarten
  'lp-diensten/eigen/IMG_9029.jpg',
  'lp-diensten/dak-na.jpg',
  'gevel/uitbreiding-gevel.jpg',
  'lp-diensten/eigen/IMG_9025.jpg',
  'lp-diensten/eigen/IMG_9065.jpg',
  'lp-diensten/eigen/IMG_9064.jpg',
  // zekerheid: huisvorm en inzet
  'lp-diensten/pleisterwerk-g2.jpg',
  'lp-diensten/realisaties/terras-p4-b.jpg',
  // traject
  'lp-diensten/kaart-ruwbouw.jpg',
  // realisatierail (8)
  'lp-diensten/eigen/IMG_0106.jpg',
  'lp-diensten/eigen/IMG_9027.jpg',
  'lp-diensten/eigen/IMG_0114.jpg',
  'lp-diensten/eigen/IMG_9069.jpg',
  'lp-diensten/eigen/IMG_0111.jpg',
  'lp-diensten/eigen/IMG_9014.jpg',
  'lp-diensten/eigen/IMG_0100.jpg',
  'lp-diensten/eigen/IMG_0110.jpg',
  // voor/na
  'lp-diensten/woonkeuken-voor.jpg',
  'lp-diensten/woonkeuken-na.jpg',
];
/* Logo's: de kop toont ze op 161 px (desktop), de voet op 220 px. 440 px dekt een scherm met dubbele dichtheid. */
const LOGOS = [
  { bron: 'home/logo-trim.png', naam: 'logo-ink' },
  { bron: 'home/logo-wit-goud.png', naam: 'logo-wit' },
];
const STAPPEN = [800, 1440, 2048];

async function main() {
  fs.mkdirSync(DOEL, { recursive: true });

  if (!fs.existsSync(DRONE_DOEL)) {
    if (!fs.existsSync(DRONE_BRON)) throw new Error('drone-opname niet gevonden: ' + DRONE_BRON);
    await sharp(DRONE_BRON).rotate().jpeg({ quality: 88, mozjpeg: true }).toFile(DRONE_DOEL);
    console.log('gekopieerd (zonder metadata):', path.relative(REPO, DRONE_DOEL));
  }

  const manifest = {};
  for (const rel of FOTOS) {
    const bron = A(rel);
    if (!fs.existsSync(bron)) throw new Error('bron ontbreekt: ' + rel);
    const naam = path.basename(rel).replace(/\.[^.]+$/, '');
    const meta = await sharp(bron).rotate().metadata();
    // na rotate() geeft metadata() nog de opgeslagen maat; draai breedte en hoogte bij stand 5-8
    const gedraaid = (meta.orientation || 1) >= 5;
    const bw = gedraaid ? meta.height : meta.width;
    const bh = gedraaid ? meta.width : meta.height;
    const breedtes = STAPPEN.filter((w) => w < bw);
    if (!breedtes.includes(Math.min(bw, 2048))) breedtes.push(Math.min(bw, 2048));
    const varianten = [];
    for (const w of breedtes) {
      const bestand = `${naam}-${w}.webp`;
      const info = await sharp(bron).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(path.join(DOEL, bestand));
      varianten.push({ bestand, breedte: info.width, hoogte: info.height });
    }
    const grootste = varianten[varianten.length - 1];
    manifest[naam] = { bron: rel, breedte: grootste.breedte, hoogte: grootste.hoogte, varianten: varianten.map(({ bestand, breedte }) => ({ bestand, breedte })) };
    console.log(naam.padEnd(24), `${bw}x${bh}`, '->', varianten.map((v) => v.breedte).join('/'));
  }
  for (const { bron, naam } of LOGOS) {
    const bestand = `${naam}-440.webp`;
    const info = await sharp(A(bron)).resize({ width: 440, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100, effort: 5 }).toFile(path.join(DOEL, bestand));
    manifest[naam] = { bron, breedte: info.width, hoogte: info.height, varianten: [{ bestand, breedte: info.width }] };
    console.log(naam.padEnd(24), '->', `${info.width}x${info.height}`);
  }

  // positieve controle: elk beeld heeft minstens één variant en elk bestand bestaat
  let fout = 0;
  for (const [naam, b] of Object.entries(manifest)) {
    if (!b.varianten.length) { console.error('geen variant:', naam); fout++; }
    for (const v of b.varianten) if (!fs.existsSync(path.join(DOEL, v.bestand))) { console.error('ontbreekt:', v.bestand); fout++; }
  }
  if (Object.keys(manifest).length !== FOTOS.length + LOGOS.length) { console.error('aantal klopt niet'); fout++; }
  if (fout) process.exit(1);

  const kop = '/* GEGENEREERD door scripts/bf-beelden.cjs. Niet met de hand wijzigen: draai het script opnieuw. */\n';
  const type = 'export type BfBeeld = { bron: string; breedte: number; hoogte: number; varianten: { bestand: string; breedte: number }[] };\n';
  fs.writeFileSync(MANIFEST, kop + type + 'export const BEELDEN: Record<string, BfBeeld> = ' + JSON.stringify(manifest, null, 2) + ';\n');
  console.log(`${Object.keys(manifest).length} beelden, manifest: ${path.relative(REPO, MANIFEST)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
