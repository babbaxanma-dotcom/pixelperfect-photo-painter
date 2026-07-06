// Genereert 1 foto op 2K: node gen-one.mjs <naam> <ar> [refBestand]
// - zonder ref: text-to-image (fal-ai/nano-banana-pro, resolution 2K)
// - met ref (pad naar jpg): /edit-endpoint met het refbeeld als image_urls[0]
//   -> zelfde project vanuit een andere hoek (prompt beschrijft de nieuwe hoek)
// Leest de prompt uit generated-final/<naam>.prompt.txt, schrijft <naam>.jpg
import { writeFile, readFile, mkdir } from 'node:fs/promises';
const [,, name, ar = '16:9', refPad] = process.argv;
if (!name) { console.error('gebruik: node gen-one.mjs <naam> <ar> [refBestand]'); process.exit(1); }
// FAL_KEY hoort in .env.local (gitignored) — .env is getrackt en mag geen secrets dragen
let env = '';
for (const f of ['./.env.local', './.env']) {
  try { env += await readFile(new URL(f, import.meta.url), 'utf8') + '\n'; } catch {}
}
const FAL_KEY = (env.match(/FAL_KEY=(.+)/) || [])[1]?.trim();
if (!FAL_KEY) { console.error('GEEN FAL_KEY'); process.exit(1); }
await mkdir(new URL('./generated-final', import.meta.url), { recursive: true });
const prompt = (await readFile(new URL(`./generated-final/${name}.prompt.txt`, import.meta.url), 'utf8')).trim();
if (!prompt) { console.error('lege prompt'); process.exit(1); }

let endpoint = 'https://fal.run/fal-ai/nano-banana-pro';
const body = { prompt, aspect_ratio: ar, num_images: 1, output_format: 'jpeg', resolution: '2K' };
if (refPad) {
  const refBuf = await readFile(new URL(`./${refPad}`, import.meta.url));
  body.image_urls = [`data:image/jpeg;base64,${refBuf.toString('base64')}`];
  endpoint = 'https://fal.run/fal-ai/nano-banana-pro/edit';
}

for (let poging = 1; poging <= 3; poging++) {
  try {
    const r = await fetch(endpoint, { method: 'POST',
      headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body) });
    if (!r.ok) { console.error(`poging ${poging}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`); if (poging < 3) { await new Promise(s => setTimeout(s, 4000)); continue; } process.exit(1); }
    const j = await r.json();
    const url = j?.images?.[0]?.url;
    if (!url) { console.error('geen image-url'); process.exit(1); }
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(new URL(`./generated-final/${name}.jpg`, import.meta.url), buf);
    console.log('OK', name, (buf.length / 1024 | 0) + 'kb', refPad ? '(edit/ref)' : '(t2i)', '2K');
    process.exit(0);
  } catch (e) { console.error(`poging ${poging}:`, e.message); if (poging < 3) await new Promise(s => setTimeout(s, 4000)); }
}
process.exit(1);
