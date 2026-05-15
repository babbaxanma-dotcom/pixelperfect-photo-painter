#!/usr/bin/env node
/**
 * Compress + resize all JPGs in src/assets/ to web-friendly sizes.
 * - Max width: 1600px (heroes), 1024px (anatomy/tiles), 600px (portraits)
 * - Quality: 75 (mozjpeg, visually lossless on most photos)
 * - Skip if already small (<200KB)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'src', 'assets');
const SKIP_THRESHOLD = 200 * 1024; // skip if <200KB

const WIDTH_RULES = [
  { match: /reviews\//, maxWidth: 600 },
  { match: /lp-anatomy-l[1-6]\.jpg/, maxWidth: 1024 },
  { match: /lp-anatomy-illustration|lp-comfort|lp-heatloss/, maxWidth: 1024 },
  { match: /portraits\//, maxWidth: 600 },
  // default: 1600px for heroes / large images
];

function getMaxWidth(filePath) {
  for (const rule of WIDTH_RULES) {
    if (rule.match.test(filePath)) return rule.maxWidth;
  }
  return 1600;
}

function walk(dir, results = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, results);
    else if (/\.(jpe?g|png)$/i.test(f)) results.push(full);
  }
  return results;
}

(async () => {
  const files = walk(ROOT);
  let totalBefore = 0, totalAfter = 0, optimized = 0, skipped = 0;

  for (const file of files) {
    const stat = fs.statSync(file);
    totalBefore += stat.size;
    if (stat.size < SKIP_THRESHOLD) { skipped++; totalAfter += stat.size; continue; }

    const rel = path.relative(ROOT, file);
    const maxWidth = getMaxWidth(rel);
    const tmpOut = file + '.tmp';

    try {
      const meta = await sharp(file).metadata();
      let pipeline = sharp(file);

      if (meta.width && meta.width > maxWidth) {
        pipeline = pipeline.resize(maxWidth, null, { fit: 'inside', withoutEnlargement: true });
      }

      if (/\.png$/i.test(file)) {
        await pipeline.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(tmpOut.replace(/\.png$/i, '.jpg'));
        fs.unlinkSync(file);
        // user must update import paths manually for png→jpg conversions; skip png for now
        fs.renameSync(tmpOut.replace(/\.png$/i, '.jpg'), file.replace(/\.png$/i, '.jpg'));
      } else {
        await pipeline.jpeg({ quality: 75, mozjpeg: true, progressive: true }).toFile(tmpOut);
        fs.renameSync(tmpOut, file);
      }

      const newStat = fs.statSync(file.replace(/\.png$/i, '.jpg'));
      totalAfter += newStat.size;
      optimized++;
      const savedKb = ((stat.size - newStat.size) / 1024).toFixed(0);
      console.log(`✓ ${rel}  ${(stat.size/1024).toFixed(0)}kB → ${(newStat.size/1024).toFixed(0)}kB  (-${savedKb}kB)`);
    } catch (e) {
      console.log(`✗ ${rel}  ${e.message}`);
      totalAfter += stat.size;
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    }
  }

  console.log(`\n${optimized} optimized, ${skipped} skipped (already small)`);
  console.log(`Total: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (saved ${((totalBefore-totalAfter)/1024/1024).toFixed(1)}MB)`);
})();
