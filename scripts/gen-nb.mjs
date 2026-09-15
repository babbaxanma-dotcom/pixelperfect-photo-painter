/* Genereert één beeld via fal nano-banana-pro (2K) uit een promptbestand; sleutel uit .env.local of .env.
   Gebruik (vanuit pixelperfect-photo-painter): node scripts/gen-nb.mjs <uitvoer.jpg> <aspect 3:2|4:3|16:9|1:1|4:5|3:4> <promptbestand.txt> [1K|2K|4K] */
import fs from "node:fs";
import path from "node:path";

const [, , uitvoer, aspect, promptPad, resolutie = "2K"] = process.argv;
if (!uitvoer || !aspect || !promptPad) {
  console.error("gebruik: node scripts/gen-nb.mjs <uitvoer.jpg> <aspect> <promptbestand.txt> [1K|2K|4K]");
  process.exit(1);
}
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const KEY = (lees(".env.local") + "\n" + lees(".env")).match(/^FAL_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) throw new Error("FAL_KEY niet gevonden in .env.local of .env");
const prompt = fs.readFileSync(promptPad, "utf8").replace(/\s+/g, " ").trim();

const res = await fetch("https://fal.run/fal-ai/nano-banana-pro", {
  method: "POST",
  headers: { Authorization: `Key ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ prompt, aspect_ratio: aspect, resolution: resolutie, num_images: 1, output_format: "jpeg" }),
});
if (!res.ok) {
  console.error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
const data = await res.json();
const url = data?.images?.[0]?.url || data?.image?.url;
if (!url) {
  console.error(`onverwachte respons: ${JSON.stringify(data).slice(0, 300)}`);
  process.exit(1);
}
const img = await fetch(url);
fs.mkdirSync(path.dirname(uitvoer), { recursive: true });
fs.writeFileSync(uitvoer, Buffer.from(await img.arrayBuffer()));
console.log(`opgeslagen: ${uitvoer} (${fs.statSync(uitvoer).size} bytes)`);
