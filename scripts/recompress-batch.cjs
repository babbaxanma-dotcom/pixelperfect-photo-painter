// Recompress specifieke files naar JPEG q80 mozjpeg, max-width 2200.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS = path.resolve(__dirname, '..', 'src', 'assets');
const FILES = [
  'gevel/grijze-crepi.jpg',
  'gevel/witte-crepi.jpg',
  'gevel/steenstrips.jpg',
  'gevel/sierpleister.jpg',
  'interieur/keuken-noten.jpg',
  'realisaties/01_extra_villa-modern-mechelen.jpg',
  'werkwijze/02-plaatsbezoek.jpg',
  'werkwijze/05-uitvoering.jpg',
  'eco/zonnepanelen.jpg',
  'eco/warmtepomp.jpg',
  'eco/houtskelet.jpg',
  'home/proj1.jpg',
  'home/proj2.jpg',
  'home/proj3.jpg',
  'home/proj4.jpg',
  'werkwijze/01-contact.jpg',
  'werkwijze/06-voorop.jpg',
  'werkwijze/08-nazorg.jpg',
];

async function run() {
  let savedKB = 0;
  for (const rel of FILES) {
    const full = path.join(ASSETS, rel);
    if (!fs.existsSync(full)) { console.log('skip (missing):', rel); continue; }
    const before = fs.statSync(full).size;
    const buf = fs.readFileSync(full);
    const out = await sharp(buf, { failOn: 'none' })
      .rotate()
      .resize({ width: 2200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    // schrijf met retry
    let ok = false;
    for (let i = 0; i < 5 && !ok; i++) {
      try { fs.writeFileSync(full, out); ok = true; }
      catch (e) { await new Promise(r => setTimeout(r, 300)); }
    }
    if (!ok) { console.log('FAIL write:', rel); continue; }
    const after = fs.statSync(full).size;
    savedKB += Math.round((before - after) / 1024);
    console.log(`${rel}: ${Math.round(before/1024)} KB → ${Math.round(after/1024)} KB`);
  }
  console.log(`\nTotaal bespaard: ${savedKB} KB`);
}
run().catch(e => { console.error(e); process.exit(1); });
