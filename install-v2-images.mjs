// Auto-pick seed101 voor elke V2-image, optimaliseer naar 1600px/q78 mozjpeg,
// kopieer naar src/assets/{dak,gevel}/ met juiste filename (zonder -seedXXX suffix).
// Werkt alleen voor de 23/24 succesvolle prompts; missing (lp-anatomy-l5 gevel) skip.
import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'generated-images-v2';
const DST = 'src/assets';
const PICK_SEED = 101;

const MAX_WIDTH = 1600;
const QUALITY = 80;

let installed = 0, skipped = 0;
for (const dir of ['dak', 'gevel']) {
  const files = await readdir(join(SRC, dir));
  // Find unique base-names by stripping -seedNNN.jpg
  const baseNames = [...new Set(files.map(f => f.replace(/-seed\d+\.jpg$/, '')))];
  for (const base of baseNames) {
    const pick = `${base}-seed${PICK_SEED}.jpg`;
    if (!files.includes(pick)) {
      console.log(`SKIP ${dir}/${base}.jpg — geen seed${PICK_SEED} variant`);
      skipped++;
      continue;
    }
    const inputPath = join(SRC, dir, pick);
    const outputPath = join(DST, dir, `${base}.jpg`);
    const input = await readFile(inputPath);
    const meta = await sharp(input).metadata();
    const targetWidth = Math.min(meta.width || MAX_WIDTH, MAX_WIDTH);
    const buffer = await sharp(input)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();
    await writeFile(outputPath, buffer);
    const beforeKB = Math.round(input.length / 1024);
    const afterKB = Math.round(buffer.length / 1024);
    console.log(`✓ ${dir}/${base}.jpg  ${beforeKB}KB → ${afterKB}KB`);
    installed++;
  }
}
console.log(`\n${installed} installed, ${skipped} skipped`);
