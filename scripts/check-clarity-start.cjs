/**
 * check-clarity-start (14 nov 2026): Clarity moet starten vóór de app geladen is, op elke pagina uit de lijst.
 *
 * Aanleiding: Mohammed, 14 nov: "fixen dat we bij ab bouw groep website alle klikken krijgen in clarity er is een bug dat we
 * momenteel niet alles krijgen". Gemeten op de live dakpagina (gsm, trage 4G): pagina in beeld na 3,0 s, Clarity-verzoek na
 * 6,3 s (Clarity startte in een React-effect). Tikken en korte bezoeken in die tijd stonden in geen enkele opname.
 * Herstel: de start staat in index.html (head). Deze toets bewaakt dat.
 *
 * Wat hij toetst:
 *  1. de lijst in index.html is gelijk aan CLARITY_PAD in src/lib/clarity.ts (zelfde adressen, zelfde project);
 *  2. per adres uit de lijst: het verzoek naar https://www.clarity.ms/tag/<project> vertrekt terwijl het hoofdscript van de app
 *     (/src/main.tsx) nog wordt tegengehouden, en er vertrekt geen verzoek naar een ander project;
 *  3. de wachtrij begint met consentv2 en bevat de tag "bron"; een advertentiebezoek (gclid) krijgt "Google Ads" en "upgrade";
 *  4. adressen buiten de lijst (/afspraak, /dakinspectie, /review, /status/<nummer>, /beoordeling/<nummer>/5) sturen niets
 *     naar Clarity, ook niet nadat de app geladen is;
 *  5. positieve controle: dezelfde pagina zonder het startblok in de HTML moet door punt 2 als fout gezien worden.
 * Niets gaat naar buiten: Clarity en de Google-tags krijgen een leeg antwoord.
 *
 * Draaien:  node scripts/check-clarity-start.cjs            (start zelf een vite dev-server)
 *           LP_BASIS=http://127.0.0.1:8080 node scripts/check-clarity-start.cjs
 * Exit 0 = alles AF, 1 = afwijking, 2 = ongeldige meting.
 */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 4437;
const ROOT = path.join(__dirname, '..');
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
let fout = 0;
const t = (naam, ok, info = '') => { console.log((ok ? '  AF   ' : '  FOUT ') + naam + (ok ? '' : '  (' + info + ')')); if (!ok) fout++; };

/* 1. de twee lijsten */
function lijstUitTs() {
  const ts = fs.readFileSync(path.join(ROOT, 'src/lib/clarity.ts'), 'utf8');
  const proj = {};
  const blokP = ts.match(/export const CLARITY_PROJECT[^{]*\{([\s\S]*?)\};/);
  for (const m of blokP[1].matchAll(/(\w+):\s*'([a-z0-9]+)'/g)) proj[m[1]] = m[2];
  const blok = ts.match(/export const CLARITY_PAD[^{]*\{([\s\S]*?)\};/);
  const uit = {};
  for (const m of blok[1].matchAll(/'([^']+)':\s*CLARITY_PROJECT\.(\w+)/g)) uit[m[1]] = proj[m[2]];
  return { uit, proj };
}
function lijstUitHtml() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const ids = {};
  const v = html.match(/var H='([a-z0-9]+)',D='([a-z0-9]+)',T='([a-z0-9]+)';/);
  if (!v) return null;
  ids.H = v[1]; ids.D = v[2]; ids.T = v[3];
  const blok = html.match(/var P=\{([^}]*)\};/);
  if (!blok) return null;
  const uit = {};
  for (const m of blok[1].matchAll(/'([^']+)':([HDT])/g)) uit[m[1]] = ids[m[2]];
  return { uit, html, bedankt: /p==='\/bedankt'\|\|p\.indexOf\('\/bedankt\/'\)===0\?H:null/.test(html) };
}

async function open(browser, basis, pad, { zonderStart = false, houdApp = 2000 } = {}) {
  const ctx = await browser.createBrowserContext();
  const p = await ctx.newPage();
  const log = { clarity: [], tijdensApp: [], appVrij: false, appGevraagd: false, fouten: [] };
  await p.setRequestInterception(true);
  p.on('request', async (r) => {
    const u = r.url();
    try {
      if (/clarity\.ms/.test(u)) { log.clarity.push(u); if (!log.appVrij) log.tijdensApp.push(u); return await r.respond({ status: 200, contentType: 'application/javascript', body: '' }); }
      if (/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|google\.com\/(pagead|ccm)|leadconnectorhq\.com|web3forms\.com/.test(u)) return await r.respond({ status: 204, body: '' });
      const host = new URL(u).hostname;
      if (!/^(127\.0\.0\.1|localhost)$/.test(host) && !/fonts\.(googleapis|gstatic)\.com$/.test(host) && !/^(data|blob):/.test(u)) return await r.abort();
      if (zonderStart && r.isNavigationRequest() && r.resourceType() === 'document') {
        const res = await fetch(u); let html = await res.text();
        const voor = html.length;
        html = html.replace(/<script>\s*\(function\(w,d\)\{\s*var H='[\s\S]*?\}\)\(window,document\);\s*<\/script>/, '');
        if (html.length === voor) log.fouten.push('positieve controle: startblok niet gevonden om weg te halen');
        return await r.respond({ status: 200, contentType: 'text/html', body: html });
      }
      if (/\/src\/main\.tsx/.test(u)) { log.appGevraagd = true; await wacht(houdApp); log.appVrij = true; }
      return await r.continue();
    } catch { /* pagina al dicht */ }
  });
  p.on('pageerror', (e) => log.fouten.push(String(e.message || e).slice(0, 160)));
  await p.setViewport({ width: 390, height: 664, isMobile: true, hasTouch: true });
  await p.goto(basis + pad, { waitUntil: 'domcontentloaded', timeout: 60000 });
  return { p, ctx, log };
}

/* punt 2 en 3 voor één adres; geeft de lijst met afwijkingen terug */
async function toetsAdres(browser, basis, pad, project, opties = {}) {
  const { p, ctx, log } = await open(browser, basis, pad, opties);
  const uit = [];
  try {
    for (let i = 0; i < 100 && !log.appVrij; i++) await wacht(100);
    if (!log.appGevraagd) return { uit: ['hoofdscript /src/main.tsx niet gevraagd'], ongeldig: true };
    const tag = `https://www.clarity.ms/tag/${project}`;
    if (!log.tijdensApp.includes(tag)) uit.push(`geen verzoek naar ${tag} vóór de app geladen is (gezien: ${log.tijdensApp.join(', ') || 'niets'})`);
    const q = await p.evaluate(() => (window.clarity && window.clarity.q ? window.clarity.q.map((a) => Array.from(a).map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x)))) : null));
    if (!q) uit.push('window.clarity.q bestaat niet');
    else {
      if (!q[0] || q[0][0] !== 'consentv2') uit.push(`wachtrij begint niet met consentv2 (${q[0] ? q[0][0] : 'leeg'})`);
      else if (q[0][1] !== '{"ad_Storage":"denied","analytics_Storage":"denied"}') uit.push(`consentv2 zonder keuze is niet denied/denied (${q[0][1]})`);
      const bron = q.find((a) => a[0] === 'set' && a[1] === 'bron');
      const advertentie = /gclid=/.test(pad);
      if (!bron || bron[2] !== (advertentie ? 'Google Ads' : 'geen advertentie')) uit.push(`tag bron = ${bron ? bron[2] : 'ontbreekt'}`);
      if (advertentie && !q.some((a) => a[0] === 'upgrade')) uit.push('advertentiebezoek zonder upgrade');
      if (advertentie && !q.some((a) => a[0] === 'set' && a[1] === 'klik-id' && a[2] === 'TEST-START')) uit.push('advertentiebezoek zonder klik-id');
      if (!advertentie && q.some((a) => a[0] === 'upgrade')) uit.push('upgrade zonder advertentie');
    }
    /* na het laden van de app: geen tweede start, geen ander project, geen paginafout */
    await wacht(2500);
    const tags = log.clarity.filter((c) => /\/tag\//.test(c));
    if (tags.some((c) => c !== tag)) uit.push(`verzoek naar een ander project (${tags.join(', ')})`);
    if (tags.length > 1) uit.push(`${tags.length} verzoeken naar de Clarity-tag (verwacht 1)`);
    if (log.fouten.length) uit.push('fout op de pagina: ' + log.fouten[0]);
    return { uit };
  } finally { await ctx.close().catch(() => {}); }
}

(async () => {
  /* 1 */
  const ts = lijstUitTs(); const html = lijstUitHtml();
  if (!html) { console.log('  FOUT het startblok van Clarity staat niet in index.html'); process.exit(1); }
  const a = JSON.stringify(Object.entries(ts.uit).sort()); const b = JSON.stringify(Object.entries(html.uit).sort());
  t(`lijst in index.html = CLARITY_PAD in clarity.ts (${Object.keys(ts.uit).length} adressen)`, a === b && Object.keys(ts.uit).length >= 19, `index.html ${Object.keys(html.uit).length}, clarity.ts ${Object.keys(ts.uit).length}`);
  t('/bedankt en /bedankt/<dienst> gaan naar het home-project', html.bedankt && html.html.includes(`var H='${ts.proj.home}'`));
  t('het startblok staat in de head, vóór #root', html.html.indexOf('clarity.ms/tag/') > 0 && html.html.indexOf('clarity.ms/tag/') < html.html.indexOf('</head>'));

  let srv = null;
  let basis = process.env.LP_BASIS ? process.env.LP_BASIS.replace(/\/$/, '') : null;
  if (!basis) {
    const vite = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
    srv = spawn(process.execPath, [vite, '--port', String(POORT), '--strictPort'], { stdio: 'ignore', cwd: ROOT });
    basis = `http://localhost:${POORT}`;
    let op = false;
    for (let i = 0; i < 90 && !op; i++) { try { op = (await fetch(basis + '/lp/dakwerken')).ok; } catch { await wacht(500); } }
    if (!op) { try { srv.kill(); } catch { /* */ } console.log('ONGELDIGE METING: dev-server kwam niet op'); process.exit(2); }
  }
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  let ongeldig = null;
  try {
    /* 5. positieve controle eerst: zonder startblok moet de toets rood zijn */
    const pc = await toetsAdres(browser, basis, '/lp/dakwerken', ts.proj.dakwerken, { zonderStart: true });
    if (pc.ongeldig) ongeldig = 'positieve controle: ' + pc.uit[0];
    const gevangen = pc.uit.some((x) => x.startsWith('geen verzoek naar'));
    console.log(gevangen ? '  positieve controle: pagina zonder startblok = fout gezien' : '  positieve controle MISLUKT: pagina zonder startblok werd niet als fout gezien');
    if (!gevangen && !ongeldig) ongeldig = 'positieve controle ving de geplante fout niet';

    /* 2 + 3 */
    const adressen = Object.entries(ts.uit).map(([pad, project]) => [pad, project]);
    adressen.push(['/bedankt', ts.proj.home], ['/bedankt/dakwerken', ts.proj.home], ['/lp/dakwerken/', ts.proj.dakwerken]);
    adressen.push(['/lp/dakwerken?gclid=TEST-START&gad_source=1', ts.proj.dakwerken], ['/lp/totaalrenovatie?utm_source=google&utm_medium=cpc&gclid=TEST-START', ts.proj.totaalrenovatie], ['/?gclid=TEST-START', ts.proj.home]);
    for (const [pad, project] of adressen) {
      if (ongeldig) break;
      let r = await toetsAdres(browser, basis, pad, project);
      if (r.ongeldig) { r = await toetsAdres(browser, basis, pad, project); if (r.ongeldig) { ongeldig = `${pad}: ${r.uit[0]}`; break; } }
      t(`${pad}: Clarity ${project} start vóór de app`, r.uit.length === 0, r.uit.join(' | '));
    }

    /* 4 */
    for (const pad of ['/afspraak', '/dakinspectie', '/review', '/status/0470123456', '/beoordeling/0470123456/5']) {
      if (ongeldig) break;
      const { ctx, log } = await open(browser, basis, pad, { houdApp: 0 });
      await wacht(5000);
      if (!log.appGevraagd) { ongeldig = `${pad}: hoofdscript niet gevraagd`; await ctx.close(); break; }
      t(`${pad}: niets naar Clarity`, log.clarity.length === 0, log.clarity.join(', '));
      await ctx.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
    if (srv) { try { srv.kill(); } catch { /* */ } }
  }
  if (ongeldig) { console.log('ONGELDIGE METING: ' + ongeldig); process.exit(2); }
  console.log(fout ? `ROOD: ${fout} afwijking(en)` : 'GROEN: Clarity start vóór de app op elk adres uit de lijst');
  process.exit(fout ? 1 : 0);
})().catch((e) => { console.error('ONGELDIGE METING: ' + (e && e.message ? e.message : e)); process.exit(2); });
