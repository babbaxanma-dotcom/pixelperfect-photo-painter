/* Contactblad: kandidaatfoto's naast elkaar met hun bestandsnaam, om elke foto
   apart te keuren vóór hij op een pagina komt.
   Draaien: node contactblad.cjs <uit.png> <bestand...> */
const sharp = require('sharp');
const path = require('node:path');

const [uit, ...bestanden] = process.argv.slice(2);
const B = 360, H = 250, LABEL = 26, KOL = 4;

(async () => {
  const tegels = await Promise.all(bestanden.map(async (f, i) => {
    const beeld = await sharp(f).resize(B, H, { fit: 'cover' }).toBuffer();
    const naam = path.basename(f).replace(/[<&>]/g, '');
    const label = Buffer.from(`<svg width="${B}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/>
      <text x="8" y="18" font-family="Arial" font-size="14" fill="#fff">${i + 1}. ${naam}</text></svg>`);
    return { beeld, label, x: (i % KOL) * B, y: Math.floor(i / KOL) * (H + LABEL) };
  }));
  const rijen = Math.ceil(bestanden.length / KOL);
  await sharp({ create: { width: KOL * B, height: rijen * (H + LABEL), channels: 3, background: '#fff' } })
    .composite(tegels.flatMap((t) => [
      { input: t.label, left: t.x, top: t.y },
      { input: t.beeld, left: t.x, top: t.y + LABEL },
    ]))
    .png().toFile(uit);
  console.log(`${bestanden.length} foto's op ${uit}`);
})();
