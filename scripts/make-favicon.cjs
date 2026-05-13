// Genereer favicon vanuit AB Bouw logo (src/assets/home/logo.png)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src', 'assets', 'home', 'logo.png');
const PUBLIC = path.resolve(__dirname, '..', 'public');

async function run() {
  if (!fs.existsSync(SRC)) {
    console.error('No logo found:', SRC);
    process.exit(1);
  }
  const sizes = [16, 32, 48, 180]; // 180 = apple-touch-icon
  for (const s of sizes) {
    const out = path.join(PUBLIC, s === 180 ? 'apple-touch-icon.png' : `favicon-${s}.png`);
    await sharp(SRC)
      .resize(s, s, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log('wrote', out, '(' + fs.statSync(out).size + ' bytes)');
  }
  // ICO als 32px PNG opgeslagen als .ico (browsers accepteren PNG-in-ICO)
  const icoTarget = path.join(PUBLIC, 'favicon.ico');
  await sharp(SRC)
    .resize(48, 48, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(icoTarget);
  console.log('wrote', icoTarget, '(' + fs.statSync(icoTarget).size + ' bytes)');
}
run().catch(e => { console.error(e); process.exit(1); });
