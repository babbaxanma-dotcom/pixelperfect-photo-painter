// Install V3 → src/assets/{dak,gevel}/, optimize via sharp.
import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'generated-images-v3';
const DST = 'src/assets';
const MAX_WIDTH = 1600;
const QUALITY = 80;

let installed = 0;
for (const dir of ['dak', 'gevel']) {
  const files = await readdir(join(SRC, dir));
  for (const f of files) {
    if (!f.endsWith('.jpg')) continue;
    const inputPath = join(SRC, dir, f);
    const outputPath = join(DST, dir, f);
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
    console.log(`✓ ${dir}/${f}  ${beforeKB}KB → ${afterKB}KB`);
    installed++;
  }
}
console.log(`\n${installed} V3 images installed`);
