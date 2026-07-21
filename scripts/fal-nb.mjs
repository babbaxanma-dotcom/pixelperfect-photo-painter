/* Genereert één beeld via fal nano-banana-pro (NIET flux: die gaf de AI-tells).
   Gebruik: node scripts/fal-nb.mjs <uitvoerpad.jpg> <3:2|4:3|16:9|1:1> "<prompt>" */

import fs from "node:fs";
import path from "node:path";

const [, , uitvoer, aspect, ...rest] = process.argv;
const prompt = rest.join(" ");
if (!uitvoer || !aspect || !prompt) {
  console.error('gebruik: node scripts/fal-nb.mjs <uitvoer.jpg> <aspect> "prompt"');
  process.exit(1);
}

const KEY = fs.readFileSync(".env.local", "utf8").match(/FAL_KEY=(.+)/)?.[1]?.trim();
if (!KEY) throw new Error("FAL_KEY niet gevonden in .env.local");

const res = await fetch("https://fal.run/fal-ai/nano-banana-pro", {
  method: "POST",
  headers: { Authorization: `Key ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ prompt, aspect_ratio: aspect }),
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
console.log(`opgeslagen: ${uitvoer}`);
