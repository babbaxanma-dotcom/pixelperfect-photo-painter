/* Benoem per route de elementen die op 390px buiten de viewport steken. */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASIS = process.env.AUDIT_BASE || "http://localhost:4300";
const ROUTES = ["/realisaties/dakwerken", "/realisaties/gevel", "/werkwijze", "/contact"];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", userDataDir: "E:/pptr/audit" });
for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASIS + route, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1200));
  const info = await page.evaluate(() => {
    const vw = window.innerWidth;
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width > vw + 2 || r.right > vw + 2 || r.left < -2) {
        const kids = el.querySelectorAll("*").length;
        out.push({
          sel: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : ""),
          w: Math.round(r.width), left: Math.round(r.left), right: Math.round(r.right), kids,
        });
      }
    }
    // alleen de buitenste boosdoeners (grootste breedte eerst, max 8)
    return { sw: document.documentElement.scrollWidth, vw, out: out.sort((a, b) => b.w - a.w).slice(0, 8) };
  });
  console.log(`\n== ${route} sw=${info.sw} vw=${info.vw}`);
  for (const o of info.out) console.log(`  ${o.w}px [${o.left}..${o.right}] ${o.sel}`);
  await page.close();
}
await browser.close();
