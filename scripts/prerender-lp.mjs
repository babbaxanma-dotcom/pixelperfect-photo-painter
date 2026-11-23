/**
 * prerender-lp: zet de HTML van de advertentiepagina's al in hun index.html (3 nov 2026).
 *
 * Aanleiding: Mohammed, 3 nov: "laad snelheid ab ... het blijft soms witscherm helemaal als iemand op de pagina beland".
 * Gemeten op www.abgroep.be/lp/dakwerken (trage 4G, CPU 4x, eerste bezoek): 4,0 s wit (mediaan van 3), want
 * <div id="root"></div> is leeg tot React, de route en haar CSS geladen en uitgevoerd zijn.
 *
 * Werking (na `vite build` en `vite build --ssr src/entry-server.tsx --outDir dist-ssr`):
 *  1. render(route) uit dist-ssr/entry-server.js geeft de HTML van de pagina (zelfde componenten als in de browser);
 *  2. die HTML komt in <div id="root" data-voorgerenderd="1">, plus de CSS van de route (blokkerend, anders flitst de
 *     pagina zonder opmaak) en modulepreload van haar scripts, uit dist/.vite/manifest.json;
 *  3. geschreven naar dist/<route>/index.html; vercel.json leidt /<route> daarheen; main.tsx hydrateert.
 *  4. dist/.vite en dist-ssr worden gewist (geen bronbestandsnamen publiek, zie vite.config.ts).
 * Faalt een route (render-fout, geen h1, geen formulier), dan stopt de build met exit 1: Vercel houdt dan de vorige
 * versie online. Nooit een halve pagina publiceren.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const ROUTES = {
  /* 23 nov 2026: /lp/dakwerken draait op LpBfC (BF-opbouw); de CSS van LpBfC (lp-bfc.css) moet blokkerend in de head, anders flitst de pagina zonder opmaak */
  '/lp/dakwerken': 'src/pages/abbouw/lp/kgj/LpBfC.tsx',
  /* 23 nov 2026: de subpagina's per advertentiegroep (LpBfC.tsx VARIANTEN_AB) krijgen ook hun HTML vooraf */
  '/lp/dakwerken/dakrenovatie': 'src/pages/abbouw/lp/kgj/LpBfC.tsx',
  '/lp/dakwerken/nieuw-dak': 'src/pages/abbouw/lp/kgj/LpBfC.tsx',
  '/lp/dakwerken/plat-dak': 'src/pages/abbouw/lp/kgj/LpBfC.tsx',
  '/lp/dakwerken/dakisolatie': 'src/pages/abbouw/lp/kgj/LpBfC.tsx',
  '/lp/dakwerken/asbest': 'src/pages/abbouw/lp/kgj/LpBfAsbest.tsx',
  '/lp/totaalrenovatie': 'src/pages/abbouw/lp/kgj/LpTotaalrenovatie.tsx',
  '/lp/aannemer-renovatiewerken': 'src/pages/abbouw/lp/kgj/LpRenovatiewerken.tsx',
};

const manifestPad = path.join(DIST, '.vite', 'manifest.json');
if (!fs.existsSync(manifestPad)) { console.error('prerender-lp: dist/.vite/manifest.json ontbreekt (vite build met manifest: true?)'); process.exit(1); }
const manifest = JSON.parse(fs.readFileSync(manifestPad, 'utf8'));
const sjabloon = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (!sjabloon.includes('<div id="root"></div>')) { console.error('prerender-lp: <div id="root"></div> niet gevonden in dist/index.html'); process.exit(1); }
const { render } = await import(pathToFileURL(path.join(ROOT, 'dist-ssr', 'entry-server.js')).href);

// CSS en JS van een manifestregel en al haar (statische) imports; dynamische imports niet (die laadt de pagina pas later)
function verzamel(sleutel, css = new Set(), js = new Set(), gezien = new Set()) {
  if (gezien.has(sleutel)) return { css, js }; gezien.add(sleutel);
  const m = manifest[sleutel]; if (!m) throw new Error('niet in manifest: ' + sleutel);
  js.add(m.file); (m.css || []).forEach((c) => css.add(c));
  (m.imports || []).forEach((i) => verzamel(i, css, js, gezien));
  return { css, js };
}
const entry = Object.keys(manifest).find((k) => manifest[k].isEntry);
const basis = verzamel(entry); // staat al in index.html

let fout = 0;
for (const [route, bron] of Object.entries(ROUTES)) {
  try {
    const html = await render(route);
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
    if (!h1 || !/<button/.test(html)) throw new Error('geen h1 of geen knop in de render');
    const { css, js } = verzamel(bron);
    const extraCss = [...css].filter((c) => !basis.css.has(c)).map((c) => `<link rel="stylesheet" crossorigin href="/${c}">`).join('');
    // Geen enkel script vóór het eerste beeld (gemeten 3 nov, lokaal, trage 4G + CPU 4x: scripts in de head 2,3 s, alles na
    // het eerste beeld 1,4 s). Het hoofdscript en alle modulepreloads (van Vite en van de route) gaan uit de head en worden
    // na de eerste tekening ingevoegd. Een tik op een knop vóór React klaar is, wordt onthouden en na het hydrateren
    // opnieuw uitgevoerd (LpBf.tsx, useEffect "vroege tik"); links (tel:, #anker) werken zonder script.
    const hoofd = sjabloon.match(/<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/);
    if (!hoofd) throw new Error('hoofdscript niet gevonden in dist/index.html');
    const voorladen = [...sjabloon.matchAll(/<link rel="modulepreload" crossorigin href="(\/assets\/[^"]+\.js)">/g)].map((m) => m[1])
      .concat([...js].filter((f) => !basis.js.has(f)).map((f) => '/' + f));
    const laadNaBeeld = `<script>(function(){var w=window,d=document;w.__abVroeg=null;` +
      `d.addEventListener('click',function(e){if(w.__abKlaar)return;var b=e.target&&e.target.closest?e.target.closest('#root button'):null;if(!b)return;` +
      `e.preventDefault();e.stopPropagation();var a=d.querySelectorAll('#root button');for(var i=0;i<a.length;i++)if(a[i]===b){w.__abVroeg=i;break}},true);` +
      `var gedaan=false;function laad(){if(gedaan)return;gedaan=true;${JSON.stringify(voorladen)}.forEach(function(h){var l=d.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=h;d.head.appendChild(l)});` +
      `var s=d.createElement('script');s.type='module';s.crossOrigin='';s.src=${JSON.stringify(hoofd[1])};d.head.appendChild(s)}` +
      `requestAnimationFrame(function(){setTimeout(laad,0)});setTimeout(laad,3000)})()</script>`;
    // 11 nov 2026, Mohammed: 'nog alleen in die logo bij tabbladen': de dakpagina's krijgen het teken van AB Dakwerken als tabbladicoon
    const dakIconen = (h) => { const uit = h.replace('<link rel="icon" type="image/x-icon" href="/favicon.ico" />', '').replace('href="/favicon-16.png"', 'href="/favicon-dak-16.png"').replace('href="/favicon-32.png"', 'href="/favicon-dak-32.png"').replace('href="/apple-touch-icon.png"', 'href="/apple-touch-dak.png"'); if (!uit.includes('/favicon-dak-32.png') || uit.includes('/favicon.ico')) throw new Error('tabbladicoon van de dakpagina niet gezet: ' + route); return uit; };
    /* 23 nov 2026, Mohammed: "doe op ab paginas logo en naam van ab bouw groep gewoon ipv ab dakwerken". Ook het tabbladicoon is weer dat van AB Bouw Groep; dakIconen blijft staan voor een terugkeer. */
    /* 23 nov 2026: de voorgerenderde dakpagina droeg de titel en beschrijving van de homepagina ("AB Bouw Group — Renovatie en verbouwing in Vlaanderen",
       met "Group"); Google en de advertentiecontrole lezen die eerst. Nu de titel en beschrijving van de pagina zelf (LpBfC.tsx BFC.titel, inhoud.ts DAKWERKEN.omschrijving). */
    /* titel en beschrijving per subpagina: dezelfde als VARIANTEN_AB in LpBfC.tsx (23 nov 2026) */
    const KOP = {
      '/lp/dakwerken': { titel: 'Dakwerken in Willebroek en omstreken | AB Bouw Groep', beschrijving: 'Dakrenovatie, nieuw dak of dakisolatie. Vraag uw gratis offerte aan bij AB Bouw Groep, werken aan 6% btw.' },
      '/lp/dakwerken/dakrenovatie': { titel: 'Dakrenovatie in Willebroek en omstreken | AB Bouw Groep', beschrijving: 'Dakrenovatie met nieuwe pannen of leien, onderdak en isolatie. Vraag uw gratis offerte aan bij AB Bouw Groep, werken aan 6% btw.' },
      '/lp/dakwerken/nieuw-dak': { titel: 'Nieuw dak laten plaatsen | AB Bouw Groep', beschrijving: 'Een volledig nieuw dak: structuur, isolatie, onderdak en dakbedekking. Vraag uw gratis offerte aan bij AB Bouw Groep.' },
      '/lp/dakwerken/plat-dak': { titel: 'Plat dak vernieuwen, herstellen of isoleren | AB Bouw Groep', beschrijving: 'Uw plat dak vernieuwen, herstellen of isoleren in EPDM, roofing of bitumen. Vraag uw gratis offerte aan bij AB Bouw Groep.' },
      '/lp/dakwerken/dakisolatie': { titel: 'Dakisolatie in Willebroek en omstreken | AB Bouw Groep', beschrijving: 'Uw dak isoleren langs buiten, langs binnen of op een plat dak, met de attesten voor uw premie. Vraag uw gratis offerte aan bij AB Bouw Groep.' },
      /* 23 nov 2026 (keuring F4): ook de andere voorgerenderde LP's droegen de titel van de homepagina ("AB Bouw Group ..."); dezelfde titel en
         beschrijving als hun inhoud (inhoud.ts DAKWERKEN_ASBEST, inhoud-totaalrenovatie.ts TOTAALRENOVATIE, inhoud-renovatiewerken.ts), die de app na het laden zet */
      '/lp/dakwerken/asbest': { titel: 'De specialist voor uw asbestdak | AB Bouw Groep', beschrijving: 'Uw asbestdak vervangen door een nieuw dak. Vraag uw gratis offerte aan bij AB Bouw Groep, werken aan 6% btw.' },
      '/lp/totaalrenovatie': { titel: 'Dé specialist voor uw renovatie | AB Bouw Groep', beschrijving: 'Bereken in 2 minuten de prijs van uw renovatie. Gratis plaatsbezoek en offerte, werken aan 6% btw.' },
      '/lp/aannemer-renovatiewerken': { titel: 'Aannemer voor renovatiewerken | AB Bouw Groep', beschrijving: 'De betrouwbare aannemer voor al uw renovatiewerken. Gratis plaatsbezoek en offerte, werken aan 6% btw.' },
    }[route];
    if (!KOP) throw new Error('geen titel en beschrijving (KOP) voor ' + route);
    const metKop = (h) => !KOP ? h : h
      .replace(/<title>[^<]*<\/title>/, `<title>${KOP.titel}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${KOP.beschrijving}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${KOP.titel}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${KOP.beschrijving}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${KOP.titel}$2`);
    const pagina = metKop(false && route.startsWith('/lp/dakwerken') ? dakIconen(sjabloon) : sjabloon)
      .replace(hoofd[0], '')
      .replace(/<link rel="modulepreload" crossorigin href="\/assets\/[^"]+\.js">/g, '')
      .replace('</head>', `${extraCss}</head>`)
      .replace('<div id="root"></div>', `<div id="root" data-voorgerenderd="1">${html}</div>${laadNaBeeld}`);
    // 14 nov 2026: Clarity start vanuit de head (index.html), vóór de voorgerenderde pagina; zonder die start geen pagina publiceren
    const clarityOp = pagina.indexOf('https://www.clarity.ms/tag/');
    if (clarityOp < 0 || clarityOp > pagina.indexOf('<div id="root"') || !pagina.includes(`'${route}':`)) throw new Error('Clarity-start ontbreekt vóór #root of kent dit adres niet: ' + route);
    const doel = path.join(DIST, route.slice(1), 'index.html');
    fs.mkdirSync(path.dirname(doel), { recursive: true });
    fs.writeFileSync(doel, pagina);
    console.log(`prerender-lp: ${route} -> dist${route}/index.html (${Math.round(pagina.length / 1024)} KB, h1 "${h1.replace(/<[^>]+>/g, '').trim().slice(0, 60)}", +${extraCss.split('<link').length - 1} css, +${voorladen.length} js na eerste beeld)`);
  } catch (e) {
    fout++; console.error(`prerender-lp: FOUT ${route}: ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e}`);
  }
}
fs.rmSync(path.join(DIST, '.vite'), { recursive: true, force: true });
fs.rmSync(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });
if (fout) { console.error(`prerender-lp: ${fout} route(s) mislukt, build gestopt`); process.exit(1); }
