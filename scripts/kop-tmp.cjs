const puppeteer = require('puppeteer-core');
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars','--force-device-scale-factor=1'] });
  for (const w of [1440, 1200, 900, 390]) {
    const pg = await b.newPage();
    await pg.setViewport({ width: w, height: 700, deviceScaleFactor: 1 });
    await pg.goto('http://localhost:8081/lp/totaalrenovatie', { waitUntil: 'networkidle0', timeout: 60000 });
    await wacht(400);
    const m = await pg.evaluate(() => {
      const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.x), r: Math.round(b.right), y: Math.round(b.y), w: Math.round(b.width), t: (e.textContent||'').trim().slice(0,40) }; };
      return { tel: r('.pc-kop-tel'), label: r('.pc-tellabel'), nav: r('.pc-nav'), midden: r('.pc-kop-midden'), contact: r('.pc-kop-contact'), vat: r('.pc-kop-vat') };
    });
    console.log(`--- ${w}px`); for (const [k,v] of Object.entries(m)) console.log('   '+k+': '+(v?JSON.stringify(v):'niet aanwezig'));
    if (w === 1440 || w === 900) { const el = await pg.$('.pc-kop'); if (el) await el.screenshot({ path: `C:/Users/Mohammed/AppData/Local/Temp/claude/C--Users-Mohammed/100e6fd8-3cd6-4850-9cee-9f9af0859931/scratchpad/kop-${w}.png` }); }
    await pg.close();
  }
  await b.close();
})();
