// Genereert Google Ads image-assets in 3 ratios (landscape, square, portrait) per
// bron-foto. Output naar google-ads-assets/{dakwerken,gevel,brand}/. Sharp resizes
// + smart-crops naar Google Ads aanbevolen specs.
//
// Run: node scripts/generate-google-ads-assets.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const RATIOS = [
  { name: 'landscape', w: 1200, h: 628 }, // 1.91:1 — Google Ads aanbevolen
  { name: 'square',    w: 1200, h: 1200 },
  { name: 'portrait',  w: 960,  h: 1200 }, // 4:5
];

const ASSETS = {
  dakwerken: [
    'src/assets/dak/lp-hero-pannendak.jpg',
    'src/assets/dak/lp-plat-dak.jpg',
    'src/assets/dak/lp-velux.jpg',
    'src/assets/dak/lp-vakman.jpg',
    'src/assets/dak/lp-zink-goot.jpg',
    'src/assets/dak/lp-classic-renovatie.jpg',
    'src/assets/dak/lp-stormschade.jpg',
    'src/assets/dak/dakisolatie.jpg',
    'src/assets/home/svc-dak.jpg',
  ],
  gevel: [
    'src/assets/gevel/witte-crepi.jpg',
    'src/assets/gevel/grijze-crepi.jpg',
    'src/assets/gevel/steenstrips.jpg',
    'src/assets/gevel/sierpleister.jpg',
    'src/assets/gevel/stelling.jpg',
    'src/assets/gevel/intro.jpg',
    'src/assets/home/svc-gevel.jpg',
  ],
  brand: [
    'src/assets/home/proj1.jpg',
    'src/assets/home/proj2.jpg',
    'src/assets/home/proj3.jpg',
    'src/assets/home/proj4.jpg',
    'src/assets/home/hero.jpg',
    'src/assets/home/hero-2.jpg',
    'src/assets/home/hero-3.jpg',
  ],
};

async function processOne(srcPath, campaign) {
  const base = srcPath.split('/').pop().replace(/\.[^.]+$/, '');
  for (const r of RATIOS) {
    const out = `google-ads-assets/${campaign}/${r.name}/${base}-${r.w}x${r.h}.jpg`;
    await mkdir(dirname(out), { recursive: true });
    await sharp(srcPath)
      .resize(r.w, r.h, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 86, mozjpeg: true, progressive: true })
      .toFile(out);
    process.stdout.write(`✓ ${out}\n`);
  }
}

(async () => {
  for (const [campaign, files] of Object.entries(ASSETS)) {
    for (const f of files) {
      try { await processOne(f, campaign); }
      catch (e) { process.stderr.write(`✗ ${f}: ${e.message}\n`); }
    }
  }
})();
