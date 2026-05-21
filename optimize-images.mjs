// Comprimeert + downscaled alle afbeeldingen > 400KB. Buffer-based om Windows file-locks te vermijden.
import sharp from 'sharp';
import { readdir, stat, readFile, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = 'src/assets';
const MAX_WIDTH = 1600;
const QUALITY = 78;
const MIN_FILE_KB = 180;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(full));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const files = await walk(ROOT);
let totalBefore = 0, totalAfter = 0, processed = 0;

for (const file of files) {
  const before = (await stat(file)).size;
  if (before < MIN_FILE_KB * 1024) continue;
  try {
    const input = await readFile(file);
    const meta = await sharp(input).metadata();
    const targetWidth = Math.min(meta.width || MAX_WIDTH, MAX_WIDTH);
    const buffer = await sharp(input)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();
    if (buffer.length < before) {
      const outPath = file.replace(/\.png$/i, '.jpg');
      await writeFile(outPath, buffer);
      if (outPath !== file) await unlink(file);
      totalBefore += before;
      totalAfter += buffer.length;
      processed++;
      console.log(`${file.split('assets')[1].padEnd(50)} ${Math.round(before/1024)}KB -> ${Math.round(buffer.length/1024)}KB (-${Math.round((1-buffer.length/before)*100)}%)`);
    }
  } catch (e) {
    console.error(`SKIP ${file.split('assets')[1]}: ${e.message}`);
  }
}

console.log(`\n=== ${processed} files · ${Math.round(totalBefore/1024/1024)}MB -> ${Math.round(totalAfter/1024/1024)}MB (-${Math.round((1-totalAfter/totalBefore)*100)}%) ===`);
