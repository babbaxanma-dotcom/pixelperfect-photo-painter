/* Contrastpoort. Reden van bestaan: vier keer is in dit project dezelfde fout
   gemaakt — een kleur blanket over een element zetten zonder te kijken op welke
   achtergrond het landt. Navy op navy, wit op wit, en donkergrijs op een donkere
   hero-foto. Waarschuwingen in een bestand voorkwamen dat niet, dus meten we.

   METHODE. De achtergrond uit de CSS afleiden werkt niet: de hero zet zijn foto
   als <img> achter de tekst, en een poging om dat via elementsFromPoint te
   herkennen sloeg op 550 van 884 elementen aan. Daarom nu de enige methode die
   altijd klopt: de tekst tijdelijk onzichtbaar maken, één screenshot per scherm,
   en de echte pixel onder elke tekstregel uitlezen. Dat vangt foto, kleurvlak,
   verloop en sluier in één keer.

   Twee controles lopen elke run mee. Zonder allebei is de uitslag ongeldig.
   node guard-contrast.mjs [basis-url]                                        */
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASIS = process.argv[2] || 'http://localhost:8080';
const ROUTES = ['/', '/totaalrenovatie', '/badkamerrenovatie', '/lp/pleisterwerk', '/lp/tegelwerken', '/over', '/contact'];
const SCHERMEN = [['desktop', 1440, 900], ['mobiel', 390, 844]];

const lum = (r, g, b) => {
  const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const cr = (a, b) => {
  const L1 = lum(...a), L2 = lum(...b);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
const ontleed = (c) => { const m = c.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : null; };

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', protocolTimeout: 300000 });

async function meet(route, breedte, hoogte, proefInjectie) {
  const p = await browser.newPage();
  await p.setViewport({ width: breedte, height: hoogte });
  await p.goto(BASIS + route, { waitUntil: 'networkidle2' });
  await p.addStyleTag({ content: '.abc-banner{display:none !important}' });
  await p.evaluate(() => document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }));
  await new Promise((r) => setTimeout(r, 2200));

  if (proefInjectie) {
    await p.evaluate(() => {
      const d = document.createElement('p');
      d.id = '_proef';
      d.textContent = 'Deze regel moet zakken';
      d.style.cssText = 'color:#8a8a8a;background:#7d7d7d;font-size:15px;padding:10px;margin:0;';
      document.body.prepend(d);
    });
    await new Promise((r) => setTimeout(r, 200));
  }

  /* Alleen wat in de eerste schermvullingen staat: verderop klopt het
     pixel-monster niet meer zonder te scrollen, en dan meet je lucht. */
  const kandidaten = await p.evaluate((vh) => {
    const uit = [];
    for (const el of document.querySelectorAll('body *')) {
      const eigen = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
      if (eigen.length < 3) continue;
      /* Sierglyphs zijn grafisch, geen tekst: de sterrenrij is aria-hidden en
         de homepage tekent dezelfde ster als SVG. Meenemen zou de LP afkeuren
         voor iets dat op de homepage is goedgekeurd. */
      if (/^[\u2605\u2606\u2022\u00b7\s]+$/.test(eigen)) continue;
      if (el.getAttribute('aria-hidden') === 'true' && eigen.length < 12) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 6) continue;
      if (r.top < 0 || r.bottom > vh) continue;
      /* Ook horizontaal binnen beeld eisen. Zonder dit werd het mobiele
         uitschuifmenu gemeten terwijl het met translateX naast het scherm
         staat: vier "fouten" die niemand ooit ziet. */
      if (r.right <= 0 || r.left >= window.innerWidth) continue;
      const st = getComputedStyle(el);
      if (st.visibility === 'hidden' || st.display === 'none' || parseFloat(st.opacity) < 0.15) continue;
      el.setAttribute('data-cg', String(uit.length));
      uit.push({
        i: uit.length, tekst: eigen.slice(0, 44), kleur: st.color,
        px: parseFloat(st.fontSize), vet: Number(st.fontWeight) || 400,
        x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2),
      });
    }
    return uit;
  }, hoogte);

  await p.evaluate(() => {
    const s = document.createElement('style');
    s.id = '_verberg';
    s.textContent = '[data-cg]{color:transparent !important;text-shadow:none !important}';
    document.head.appendChild(s);
  });
  await new Promise((r) => setTimeout(r, 250));
  const shot = await p.screenshot({ type: 'png' });
  await p.close();

  const { data, info } = await sharp(shot).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixel = (x, y) => {
    const xx = Math.min(info.width - 1, Math.max(0, x));
    const yy = Math.min(info.height - 1, Math.max(0, y));
    const o = (yy * info.width + xx) * info.channels;
    return [data[o], data[o + 1], data[o + 2]];
  };

  const resultaten = [];
  for (const k of kandidaten) {
    const voor = ontleed(k.kleur);
    if (!voor) continue;
    /* mediaan van negen monsters rond het midden: één pixel kan net een
       lichte plek in een foto treffen en dat geeft een vals oordeel */
    const monsters = [];
    for (const dx of [-14, 0, 14]) for (const dy of [-4, 0, 4]) monsters.push(pixel(k.x + dx, k.y + dy));
    const mid = (i) => monsters.map((m) => m[i]).sort((a, b) => a - b)[Math.floor(monsters.length / 2)];
    const achter = [mid(0), mid(1), mid(2)];
    const groot = k.px >= 24 || (k.px >= 18.66 && k.vet >= 700);
    const eis = groot ? 3 : 4.5;
    const ratio = cr(voor, achter);
    resultaten.push({ ...k, achter, ratio, eis, zakt: ratio < eis });
  }
  return resultaten;
}

/* POSITIEVE CONTROLE: een expres-slechte regel moet zakken. */
const proef = await meet('/', 1440, 900, true);
const p1 = proef.find((r) => r.tekst.startsWith('Deze regel moet zakken'));
console.log(`positieve controle : ${p1 ? (p1.zakt ? 'afgekeurd op ' + p1.ratio.toFixed(2) + ':1' : 'TEN ONRECHTE GOEDGEKEURD') : 'NIET GEVONDEN'}`);
if (!p1 || !p1.zakt) { console.error('GUARD MEET NIETS'); await browser.close(); process.exit(2); }

/* NEGATIEVE CONTROLE: de guard mag niet alles afkeuren.

   Dit telde eerst een VAST aantal (>20) elementen ruim boven de eis in het
   eerste scherm van de homepage. Dat hing aan hoeveel tekst daar toevallig
   stond: na de ombouw naar de PrimeCraft-vormtaal staat er een fotohero met
   minder losse tekstelementen, en de guard sloeg alarm terwijl er 0 van de
   195 gemeten elementen onder AA zakte. Een controle die op de vormgeving
   reageert in plaats van op het contrast, meet het verkeerde.

   Nu is het een VERHOUDING: het overgrote deel van wat gemeten wordt hoort
   ruim te slagen. Zakt dat aandeel in, dan keurt de guard te veel af, hoeveel
   tekst er ook staat. */
const ruim = proef.filter((r) => !r.zakt && r.ratio > 10).length;
const aandeel = proef.length ? ruim / proef.length : 0;
console.log(`negatieve controle : ${ruim} van ${proef.length} elementen ruim boven de eis (${Math.round(aandeel*100)}%, moet >= 60% en >= 8 stuks zijn)`);
if (ruim < 8 || aandeel < 0.6) { console.error('GUARD KEURT TE VEEL AF'); await browser.close(); process.exit(3); }

let totaal = 0, gezakt = 0;
const problemen = [];
for (const route of ROUTES) {
  for (const [naam, w, h] of SCHERMEN) {
    const rs = await meet(route, w, h, false);
    totaal += rs.length;
    for (const r of rs) if (r.zakt) { gezakt++; problemen.push({ route, scherm: naam, ...r }); }
  }
}
await browser.close();

console.log(`\n${totaal} tekstelementen gemeten tegen de ECHTE pixel eronder, ${ROUTES.length} routes x 2 schermen`);
console.log(`${gezakt} zakken onder AA`);
for (const q of problemen.slice(0, 30)) {
  console.log(`  ${q.route} [${q.scherm}] ${q.ratio.toFixed(2)}:1 (eis ${q.eis})  ${q.kleur} op rgb(${q.achter.join(',')})  "${q.tekst}"`);
}
process.exit(gezakt ? 1 : 0);
