/* Vindt het element dat horizontale overflow veroorzaakt op een route.
   Gebruik: node scripts/vind-overflow.mjs /realisaties/gevel */

import puppeteer from "puppeteer-core";

/* accepteert "realisaties/gevel" én "/realisaties/gevel" (Git Bash
   converteert leading-slash-args naar Windows-paden) */
const ruw = process.argv[2] || "";
const route = "/" + ruw.replace(/^.*?([a-z-]+(?:\/[a-z-]+)*)$/i, "$1").replace(/^\/+/, "");
const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
});
const p = await b.newPage();
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await p.goto("http://localhost:4180" + route, { waitUntil: "networkidle0" });
await p.evaluate(async () => {
  await new Promise((klaar) => {
    let y = 0;
    const stap = () => {
      y += 700;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight) setTimeout(stap, 60);
      else { window.scrollTo(0, 0); setTimeout(klaar, 400); }
    };
    stap();
  });
});
const scrollbaar = await p.evaluate(() => {
  window.scrollTo(60, 0);
  const x = window.scrollX;
  window.scrollTo(0, 0);
  return x;
});
console.log(`horizontaal scrollbaar: ${scrollbaar}px (0 = gebruiker ziet niets)`);
const daders = await p.evaluate(() => {
  const grens = window.innerWidth;
  const out = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > grens + 1 || r.left < -1) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && String(el.className).slice(0, 70)) || "",
        left: Math.round(r.left),
        right: Math.round(r.right),
        breed: Math.round(r.width),
      });
    }
  });
  return out.slice(0, 12);
});
console.log(JSON.stringify(daders, null, 1));
await b.close();
