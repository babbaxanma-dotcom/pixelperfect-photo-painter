/* Volledige site-audit-data: per route full-page screenshots (390 mobiel +
   1440 desktop), overflow-meting (scrollWidth vs innerWidth — nooit op oog),
   console-errors, gefaalde requests en alle interne links.
   Gebruik: node scripts/audit-site.mjs [alleen-route] */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const UIT = path.join(ROOT, "audit");
const BASIS = process.env.AUDIT_BASE || "http://localhost:4180";

const ROUTES = [
  "/", "/over", "/diensten", "/realisaties", "/realisaties/dakwerken",
  "/realisaties/gevel", "/werkwijze", "/contact", "/construct",
  "/ecologisch", "/interieur", "/dakwerken", "/bad", "/gevel", "/blog",
  "/calculator/dakwerken", "/calculator/gevel",
  "/lp/totaalrenovatie", "/lp/dakwerken",
];

const filter = process.argv[2];
const routes = filter ? ROUTES.filter((r) => r.includes(filter)) : ROUTES;

fs.mkdirSync(UIT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", userDataDir: "E:/pptr/audit" });
const rapport = [];

for (const route of routes) {
  const naam = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
  const item = { route, consoleErrors: [], failedRequests: [], links: [], overflow: {} };

  for (const [label, w, h] of [["mobiel", 390, 844], ["desktop", 1440, 900]]) {
    const page = await browser.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") item.consoleErrors.push(`${label}: ${m.text().slice(0, 200)}`);
    });
    page.on("requestfailed", (r) => {
      item.failedRequests.push(`${label}: ${r.url().slice(0, 160)} (${r.failure()?.errorText})`);
    });
    page.on("response", (r) => {
      if (r.status() >= 400) item.failedRequests.push(`${label}: HTTP ${r.status()} ${r.url().slice(0, 160)}`);
    });
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(BASIS + route, { waitUntil: "networkidle0", timeout: 45000 });
    /* reveals triggeren zoals een echte bezoeker: doorscrollen, dan terug.
       Geen opacity/transform-nuke: die toont ook bewust-verborgen UI. */
    await page.addStyleTag({ content: "*{animation-duration:0.01s!important;transition-duration:0.01s!important}" });
    await page.evaluate(async () => {
      await new Promise((klaar) => {
        let y = 0;
        const stap = () => {
          y += 700;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(stap, 90);
          else { window.scrollTo(0, 0); setTimeout(klaar, 500); }
        };
        stap();
      });
    });

    item.overflow[label] = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }));
    if (label === "desktop") {
      item.links = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter(
          (h) => h && !h.startsWith("http") && !h.startsWith("tel:") && !h.startsWith("mailto:") && !h.startsWith("#"),
        ),
      );
    }
    await page.screenshot({ path: path.join(UIT, `${naam}-${label}.png`), fullPage: true });
    await page.close();
  }
  rapport.push(item);
  const o = item.overflow;
  console.log(
    `${route}: mob-overflow ${o.mobiel.overflow}px · desk-overflow ${o.desktop.overflow}px · console ${item.consoleErrors.length} · failed ${item.failedRequests.length}`,
  );
}

/* interne links toetsen tegen de routelijst + bekende dynamische paden */
const bekend = new Set([...ROUTES, "/bedankt", "/privacy", "/voorwaarden", "/cookies", "/index"]);
const alleLinks = new Set(rapport.flatMap((r) => r.links.map((l) => l.split("?")[0].split("#")[0])));
const kapot = [...alleLinks].filter(
  (l) => !bekend.has(l) && !l.startsWith("/blog/") && !l.startsWith("/lokaal/") && !l.startsWith("/lp/") && !l.startsWith("/realisaties/"),
);
console.log(`\nonbekende interne links: ${kapot.length ? kapot.join(", ") : "geen"}`);

fs.writeFileSync(path.join(UIT, "rapport.json"), JSON.stringify(rapport, null, 1));
console.log(`rapport: audit/rapport.json + ${routes.length * 2} screenshots`);
await browser.close();
