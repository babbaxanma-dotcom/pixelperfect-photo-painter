const puppeteer = require('puppeteer-core');
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars','--force-device-scale-factor=1'] });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
  await pg.goto('http://localhost:8081/lp/totaalrenovatie', { waitUntil: 'networkidle0', timeout: 60000 });
  await pg.evaluate(async () => { document.querySelectorAll('img[loading="lazy"]').forEach(i=>{i.loading='eager';}); await Promise.all([...document.images].filter(i=>!i.complete).map(i=>new Promise(r=>{i.onload=i.onerror=r;}))); });
  await wacht(600);
  const m = await pg.evaluate(() => {
    const uit = [];
    const r = (sel, naam) => {
      const e = document.querySelector(sel);
      if (!e) { uit.push(naam + ': niet gevonden'); return; }
      const b = e.getBoundingClientRect();
      uit.push(naam + ': y ' + Math.round(b.y + window.scrollY) + ' tot ' + Math.round(b.bottom + window.scrollY) + '  (hoog ' + Math.round(b.height) + ')');
    };
    r('.pc-hero', 'hero');
    r('.pc-hero-vat', 'hero-vat');
    r('.pc-hero-vat h1', 'h1');
    r('.pc-hero-foto', 'foto');
    const kinderen = [...(document.querySelector('.pc-hero')?.children || [])];
    kinderen.forEach((k, i) => {
      const b = k.getBoundingClientRect();
      uit.push('  hero-kind ' + i + ' [' + k.className + ']: y ' + Math.round(b.y + window.scrollY) + ' tot ' + Math.round(b.bottom + window.scrollY));
    });
    const na = document.querySelector('.pc-hero')?.nextElementSibling;
    if (na) {
      const b = na.getBoundingClientRect();
      uit.push('volgende sectie [' + na.className + ']: y ' + Math.round(b.y + window.scrollY));
      const h = na.querySelector('h2');
      if (h) uit.push('  eerste h2 daarin: y ' + Math.round(h.getBoundingClientRect().y + window.scrollY));
    }
    return uit;
  });
  console.log(m.join('\n'));
  await b.close();
})();
