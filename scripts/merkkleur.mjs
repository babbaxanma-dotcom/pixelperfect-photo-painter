/* Merkkleur uitlezen uit een logo, een screenshot van een bestaande site of een
   foto van een bestelwagen. Draait op de sharp die al in deze repo staat.
   Gebruik: node scripts/merkkleur.mjs <bestand>
   Uitvoer: de drie zwaarste merkkandidaten als hex + hsl + aandeel in procent.

   WAAROM DE BOVENSTE VIERTEL: het gemiddelde van een kleurbak trekt de waarde
   naar de anti-aliasing-rand en levert een te lichte, te bleke kleur op. Op
   public/icon-512.png gaf het gemiddelde #eab721 terwijl het merkgoud in de
   code #d98c03 is. De mediaan van de bovenste viertel op verzadiging haalt de
   randpixels eruit. */
import sharp from 'sharp';

const bestand = process.argv[2];
if (!bestand) { console.error('geef een bestandspad'); process.exit(2); }

const rgb2hex = ([r, g, b]) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) { if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  const l = (max + min) / 2;
  return [h, (d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))) * 100, l * 100];
}

const { data, info } = await sharp(bestand).resize(240, 240, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const bakken = new Map();
let geteld = 0;
for (let i = 0; i < data.length; i += info.channels) {
  const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  if (a < 200) continue;                       /* doorzichtige randpixel */
  const [h, s, l] = rgb2hsl(r, g, b);
  if (s < 25 || l < 12 || l > 82) continue;    /* grijs, zwart en wit zijn geen merkkleur */
  geteld++;
  const sleutel = Math.round(h / 10) * 10;
  if (!bakken.has(sleutel)) bakken.set(sleutel, []);
  bakken.get(sleutel).push([r, g, b, s]);
}
if (!geteld) { console.error('GEEN MERKKLEUR GEVONDEN — het beeld is grijs, zwart of wit. Val terug op de standaardkleur.'); process.exit(1); }
const mid = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
const top = [...bakken.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 3);
for (const [hoek, px] of top) {
  const kern = px.slice().sort((a, b) => b[3] - a[3]).slice(0, Math.max(1, Math.round(px.length / 4)));
  const kleur = [mid(kern.map((p) => p[0])), mid(kern.map((p) => p[1])), mid(kern.map((p) => p[2]))];
  const [h, s, l] = rgb2hsl(...kleur);
  console.log(`${rgb2hex(kleur)}  hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)  ${(100 * px.length / geteld).toFixed(1).replace('.', ',')}% van de gekleurde pixels  (hoekbak ${hoek})`);
}
