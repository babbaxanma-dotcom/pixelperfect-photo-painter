/**
 * check-rekenaar-scroll: na elke keuze in de rekenaar (en sinds 19 okt 2026 in de aanvraagkaart van /lp/dakwerken en
 * /lp/totaalrenovatie) staat de kop ("Vraag X van Y", "Stap X van Y") in beeld, onder de vaste menubalk.
 *
 * Aanleiding: Mohammed, 1 okt 2026: "bij vraag 2 of 3 paar pixels naar onder ...
 * waardoor je de form kwijtraakt". Op /lp/totaalrenovatie is vraag 2 (afvinken)
 * 923 px hoog en vraag 3 620 px op 390 px breed. Wie naar onder scrolde om
 * "Volgende" te tikken, zag daarna de kop niet meer (top -197 px of onder de balk).
 *
 * Werkt zoals een mens: scrollt alleen als de knop onder het scherm valt, tot hij
 * net in beeld is, en tikt dan op die plek.
 *
 * De vaste kop heet op elke LP .kgj-kop (LpKgj.tsx, en LpBf.tsx in de BF-stijl, spec §17); Rekenaar.tsx r.95 meet
 * dezelfde klasse. Ontbreekt die klasse of is de kop 0 px hoog, dan meet de toets "balk = 0" en zou hij stil groen
 * geven: dat is een ongeldige meting (exit 2).
 * Positieve controle (12 okt 2026): op /lp/dakwerken (390) wordt na de eerste keuze de kop van de rekenaar
 * expres onder de vaste kop geschoven; de meting moet dat als fout zien, anders exit 2.
 * Clarity, Google-tags en de leadverzoeken krijgen een leeg antwoord: geen vervuiling van de statistieken.
 *
 * Draaien:  node scripts/check-rekenaar-scroll.cjs            (start zelf een dev-server)
 *           LP_BASIS=https://www.abgroep.be node scripts/...  (tegen een bestaande site)
 * Exit 0 = alles in beeld, 1 = een kop viel weg, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4431;
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

const PADEN = {
  /* 19 okt 2026 (Mohammed: "rekenaar weg, en doe dat naar dakinspectie en gratis plaatsbezoek form bovenaan"): op
     /lp/dakwerken en /lp/totaalrenovatie staat bovenaan de aanvraagkaart (Aanvraag.tsx). Zelfde kaart (.kgj-reken), zelfde
     kop (.kgj-reken__kop, "Stap X van Y") en dezelfde scrolfix na elke stap: dezelfde meting, met hun klikvragen tot en met
     de contactstap. De rekenaar zelf staat alleen nog op /lp/richtprijs-berekenen en blijft hier gemeten. */
  dakwerken: ['Hellend dak', 'Dakrenovatie / Nieuw dak', 'Ja', 'Nee'],
  /* 22 okt 2026: vraag 1 de woning, vraag 3 de afvinkvraag (de hoogste stap: daar valt de kop het makkelijkst weg), dan start en budget */
  totaalrenovatie: ['Rijwoning', 'Gedeeltelijke renovatie', 'Keuken', 'Badkamer', '@verder', 'Zo snel mogelijk', '€ 25.000 tot € 75.000'],
  /* 5 okt 2026: de renovatierekenaar staat niet meer in de hero van /lp/totaalrenovatie (daar
     een knop naar het formulier), maar op de losse rekenaarpagina /lp/richtprijs-berekenen. */
  'richtprijs-berekenen': ['Rijwoning', 'Alles (totaalrenovatie)', '@verder', '100 tot 150 m²', 'Ouder dan 10 jaar', 'Alles'],
};
const SCHERMEN = [[390, 844], [375, 667]];

(async () => {
  let srv = null;
  let basis = process.env.LP_BASIS;
  if (!basis) {
    /* vite rechtstreeks met node, zonder shell: dan is srv.pid de server zelf en stopt
       srv.kill() hem echt (via npx en een shell bleef hij op Windows draaien). */
    const vite = require('node:path').join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    srv = spawn(process.execPath, [vite, '--port', String(POORT), '--strictPort'], { stdio: 'ignore' });
    basis = `http://localhost:${POORT}`;
    let op = false;
    for (let i = 0; i < 90 && !op; i++) {
      try { op = (await fetch(basis + '/lp/dakwerken')).ok; } catch { await wacht(500); }
    }
    if (!op) { console.log('ONGELDIGE METING: dev-server kwam niet op'); process.exit(2); }
  }
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  let metingen = 0; const fouten = [];
  const nieuwePagina = async (w, h, lp) => {
    const p = await br.newPage();
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (/services\.leadconnectorhq\.com|api\.web3forms\.com/.test(u)) return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
      if (/clarity\.ms|googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/.test(u)) return r.respond({ status: 200, contentType: 'application/javascript', body: '' });
      return r.continue();
    });
    await p.emulate({ viewport: { width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    await p.evaluateOnNewDocument(() =>
      localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: false, marketing: false })));
    await p.goto(`${basis}/lp/${lp}`, { waitUntil: 'networkidle2' });
    await wacht(900);
    await p.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Alleen essentiële')?.click());
    await wacht(300);
    return p;
  };
  const meetKop = (p) => p.evaluate(() => {
    const kop = document.querySelector('.kgj-reken .kgj-reken__kop');
    const vast = document.querySelector('.kgj-kop');
    const balk = vast?.getBoundingClientRect().bottom ?? 0;
    return { top: Math.round(kop.getBoundingClientRect().top), balk: Math.round(balk), vast: !!vast, vastH: Math.round(vast?.getBoundingClientRect().height ?? 0), h: innerHeight,
      tel: kop.querySelector('.kgj-reken__tel')?.textContent.trim() };
  });
  const isFout = (s) => s.top < s.balk || s.top > s.h - 80;
  try {
    /* positieve controle: de kop van de rekenaar expres onder de vaste kop */
    {
      const p = await nieuwePagina(390, 844, 'dakwerken');
      const ok = await p.evaluate(() => { const b = [...document.querySelectorAll('.kgj-reken button')].find((x) => x.textContent.trim().startsWith('Hellend dak')); b?.click(); return !!b; });
      await wacht(1100);
      await p.evaluate(() => { const kop = document.querySelector('.kgj-reken .kgj-reken__kop'); const balk = document.querySelector('.kgj-kop')?.getBoundingClientRect().bottom ?? 0; window.scrollBy({ top: kop.getBoundingClientRect().top - balk + 30, behavior: 'instant' }); });
      await wacht(300);
      const s = await meetKop(p);
      await p.close();
      if (!ok || !s.vast || s.vastH < 40) { console.log(`ONGELDIGE METING: positieve controle zonder vaste kop .kgj-kop of zonder rekenaar (${JSON.stringify(s)})`); process.exit(2); }
      if (!isFout(s)) { console.log(`ONGELDIGE METING: de geplante fout (kop op ${s.top}px onder een balk tot ${s.balk}px) werd niet gezien`); process.exit(2); }
      console.log(`positieve controle: geplante fout gezien (kop op ${s.top}px, vaste kop .kgj-kop tot ${s.balk}px)`);
    }
    for (const [w, h] of SCHERMEN) {
      for (const [lp, pad] of Object.entries(PADEN)) {
        const p = await nieuwePagina(w, h, lp);
        for (const l of pad) {
          const plek = await p.evaluate((label) => {
            const r = document.querySelector('.kgj-reken');
            const b = label === '@verder' ? [...r.querySelectorAll('button')].find((x) => /Volgende|Verder/.test(x.textContent))
              : [...r.querySelectorAll('button')].find((x) => x.textContent.trim().startsWith(label));
            if (!b) return null;
            const q = b.getBoundingClientRect();
            if (q.bottom > innerHeight - 90) window.scrollTo({ top: window.scrollY + q.bottom - (innerHeight - 90), behavior: 'instant' });
            const q2 = b.getBoundingClientRect();
            return { x: q2.left + q2.width / 2, y: q2.top + q2.height / 2 };
          }, l);
          if (!plek) { fouten.push(`${lp} ${w}x${h}: knop "${l}" niet gevonden`); break; }
          await wacht(200);
          await p.touchscreen.tap(plek.x, plek.y);
          await wacht(1100);
          const s = await meetKop(p);
          if (!s.vast || s.vastH < 40) { console.log(`ONGELDIGE METING: ${lp} ${w}x${h}: geen vaste kop .kgj-kop (hoogte ${s.vastH}px), balk = 0 zou stil groen geven`); process.exit(2); }
          metingen++;
          if (isFout(s)) fouten.push(`${lp} ${w}x${h} na "${l}": kop op ${s.top}px (balk ${s.balk}px, scherm ${s.h}px, ${s.tel})`);
        }
        await p.close();
      }
    }
  } finally {
    await br.close();
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (metingen === 0) { console.log('ONGELDIGE METING: 0 metingen'); process.exit(2); }
  console.log(`check-rekenaar-scroll: ${metingen} keuzes over ${SCHERMEN.length} schermen en ${Object.keys(PADEN).length} pagina's (${basis})`);
  if (fouten.length) { fouten.forEach((f) => console.log('  FOUT: ' + f)); process.exit(1); }
  console.log('  na elke keuze staat de kop van de rekenaar in beeld');
  process.exit(0);
})().catch((e) => { console.log('ONGELDIGE METING: ' + e.message); process.exit(2); });
