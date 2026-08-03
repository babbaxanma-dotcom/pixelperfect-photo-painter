/* Interactieve test van het hero-offerteformulier op de homepage.
   Onderschept alle uitgaande lead-requests (er vertrekt NIETS echt).
   Gebruik: node scripts/test-heroform.mjs */

import puppeteer from "puppeteer-core";

const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
});
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const onderschept = [];
await p.setRequestInterception(true);
p.on("request", (r) => {
  const url = r.url();
  if (/gohighlevel|leadconnector|web3forms|hook|webhook/i.test(url)) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (r.method() === "OPTIONS") {
      r.respond({ status: 204, headers: cors });
      return;
    }
    onderschept.push({ url: url.slice(0, 120), method: r.method(), body: (r.postData() || "").slice(0, 300) });
    r.respond({ status: 200, contentType: "application/json", headers: cors, body: '{"success":true}' });
  } else {
    r.continue();
  }
});
p.on("console", (m) => { if (["error","warning","warn"].includes(m.type())) console.log("CONSOLE:", m.text().slice(0, 200)); });
p.on("pageerror", (e) => console.log("PAGEERROR:", String(e).slice(0, 300)));

await p.goto("http://localhost:4300/", { waitUntil: "networkidle0" });

const status = await p.evaluate(() => {
  const form = document.querySelector("[data-hero-form]");
  const naam = document.querySelector("#qh-name");
  if (!form || !naam) return { form: !!form, naam: !!naam };
  const r = naam.getBoundingClientRect();
  const bovenop = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return {
    form: true,
    naamZichtbaar: r.width > 0 && r.height > 0,
    rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width) },
    elementBovenop: bovenop ? `${bovenop.tagName.toLowerCase()}.${String(bovenop.className).slice(0, 60)}` : "niets",
    isInputZelf: bovenop === naam,
  };
});
console.log("VELD-CHECK:", JSON.stringify(status, null, 1));

if (status.isInputZelf === false) {
  console.log("=> Er ligt iets BOVENOP het invoerveld; klikken/typen komt niet aan.");
}

try {
  await p.click("#qh-name");
  await p.type("#qh-name", "Test Testeling", { delay: 15 });
  await p.type("#qh-phone", "0470123456", { delay: 15 });
  const getypt = await p.evaluate(() => ({
    naam: document.querySelector("#qh-name")?.value,
    tel: document.querySelector("#qh-phone")?.value,
  }));
  console.log("NA TYPEN:", JSON.stringify(getypt));
  await p.click("[data-hero-submit]");
  await new Promise((r) => setTimeout(r, 2500));
  const na = await p.evaluate(() => ({
    success: !!document.querySelector(".tr-leadcard.is-success, .lf-qcard.is-success"),
    fout: document.querySelector("[data-hero-error]")?.textContent || "",
    foutZichtbaar: (document.querySelector("[data-hero-error]")?.style.display || "none") !== "none",
  }));
  console.log("NA SUBMIT:", JSON.stringify(na));
} catch (e) {
  console.log("INTERACTIE-FOUT:", String(e).slice(0, 300));
}
console.log("ONDERSCHEPTE LEAD-REQUESTS:", JSON.stringify(onderschept, null, 1));
await b.close();


