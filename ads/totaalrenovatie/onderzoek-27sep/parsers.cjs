/* Parsers overgenomen uit onderzoek-top5/oogst-23sep/5-structuur.cjs (regels 28-164), ongewijzigd. */
const fs = require('node:fs');
const path = require('node:path');
const CACHE = process.env.CACHE || path.join(__dirname, 'cache');
const kleur = (rgb) => {
  const [r, g, b] = rgb || [-1, -1, -1];
  if (r < 0) return 'leeg';
  const lum = (r * 299 + g * 587 + b * 114) / 1000;
  if (b - r > 90 && b > 150) return 'blauw';
  if (Math.max(r, g, b) - Math.min(r, g, b) > 25) return 'kleur';
  if (lum < 70) return 'donker';
  if (lum >= 103 && lum <= 118) return 'meta'; /* locatie-/reviewregel onder de kop */
  return 'grijs';
};
const DOMEIN = /\b[\w-]+\.(be|com|nl|eu|net|org|site|online)\b/i;
const RUIS = /^(Gesponsord|Sponsored|Gesponsorde|Advertentie|Ad|Sponsorisé|Annonce)$/i;
const plak = (regels) => regels.reduce((s, r) => {
  const t = r.t.trim();
  if (!s) return t;
  return /[a-zà-ÿ]-$/i.test(s) && !/\s-$/.test(s) ? s + t : s + ' ' + t;
}, '');
const splitsKop = (k) => k.replace(/ I (?=[A-Z0-9])/g, ' | ').split(/\s+[-–|•]\s+/).map((x) => x.trim()).filter(Boolean);

function uitOcr(o, formaat) {
  if (!o || o.fout || !o.regels) return { bron: 'ocr', fout: (o && o.fout) || 'geen ocr' };
  let r = (Array.isArray(o.regels) ? o.regels : [o.regels]).map((x) => ({ ...x, k: kleur(x.rgb) }))
    .sort((a, b) => a.y - b.y || a.x - b.x);
  if (r.some((x) => /That.s an error|error\. Please try again/i.test(x.t))) return { bron: 'ocr', fout: 'archiefbeeld 500' };
  r = r.filter((x) => !RUIS.test(x.t.trim()) && x.k !== 'leeg');
  const res = { bron: 'ocr', naam: null, weergaveUrl: null, kop: null, koppen: [], beschrijving: null, sitelinks: [], extensies: [], overig: [] };
  const eersteBlauw = r.findIndex((x) => x.k === 'blauw');

  if (formaat === 'tekst' && eersteBlauw >= 0) {
    const top = r.slice(0, eersteBlauw);
    const urlR = [...top].reverse().find((x) => /www\.|\//.test(x.t) && DOMEIN.test(x.t)) || [...top].reverse().find((x) => DOMEIN.test(x.t));
    res.weergaveUrl = urlR ? urlR.t.replace(/\s+/g, '') : null;
    const naamR = top.find((x) => x !== urlR && x.k === 'donker');
    res.naam = naamR ? naamR.t : null;
    /* Kop: aaneengesloten blauwe regels. */
    let i = eersteBlauw; const kop = [];
    while (i < r.length && r[i].k === 'blauw' && (!kop.length || r[i].y - kop[kop.length - 1].y1 < 40)) kop.push(r[i++]);
    res.kop = plak(kop);
    res.koppen = splitsKop(res.kop);
    /* Beschrijving: eerste aaneengesloten grijze blok na de kop. */
    const rest = r.slice(i).filter((x) => x.k !== 'kleur');
    for (const x of rest.filter((y) => y.k === 'meta')) {
      const t = x.t.trim();
      res.extensies.push({ soort: /^\*?\s*\(?\d[,.]\d\)?$|^\*?\s*\(\d[\d.]*\)$|★/.test(t) ? 'reviews' : 'locatie', tekst: t });
    }
    let j = rest.findIndex((x) => x.k === 'grijs');
    const besch = [];
    if (j >= 0) {
      besch.push(rest[j]);
      while (j + 1 < rest.length && rest[j + 1].k === 'grijs' && rest[j + 1].y - besch[besch.length - 1].y1 < 30) besch.push(rest[++j]);
    }
    res.beschrijving = plak(besch) || null;
    const naBesch = besch.length ? rest.filter((x) => x.y > besch[besch.length - 1].y1) : rest;
    const voorBesch = besch.length ? rest.filter((x) => x.y < besch[0].y && !besch.includes(x)) : [];
    for (const x of [...voorBesch, ...naBesch]) {
      const t = x.t.trim();
      if (/^(Bellen|Website|Route|Offerte aanvragen|Meer informatie|Nu bellen)$/i.test(t)) res.extensies.push({ soort: 'knop', tekst: t });
      else if (/\d[,.]\d.*\(\d|beoordeling|review|★/i.test(t)) res.extensies.push({ soort: 'reviews', tekst: t });
      else if (/^(Open|Gesloten|Nu open|Opent)|openingstijden|\d{4}\s+[A-Z][a-z]/.test(t)) res.extensies.push({ soort: 'locatie', tekst: t });
      else if (x.k === 'donker' || x.k === 'blauw') res.sitelinks.push(t);
      else if (x.k === 'grijs') res.extensies.push({ soort: /:/.test(t) ? 'snippet' : 'callout/sitelinkbeschrijving', tekst: t });
    }
    res.overig = r.filter((x) => x.k === 'kleur').map((x) => x.t);
  } else {
    /* Beeld-/Demand-Gen-weergave of tekst zonder blauwe kop: naam + url bovenaan,
       grootste donkere regels = kop, grijze regels = beschrijving. */
    const neutraal = r.filter((x) => x.k !== 'kleur');
    const urlR = neutraal.find((x) => DOMEIN.test(x.t) && x.y < 120);
    res.weergaveUrl = urlR ? urlR.t.replace(/\s+/g, '') : null;
    res.naam = (neutraal.find((x) => x !== urlR && x.k === 'donker' && x.y < 80) || {}).t || null;
    const lijf = neutraal.filter((x) => x !== urlR && x.t !== res.naam && !/^(Site bezoeken|Meer informatie|Nu bellen|Offerte aanvragen|Bellen|Aanmelden|Nu kopen)$/i.test(x.t.trim()));
    const maxH = Math.max(0, ...lijf.map((x) => x.h));
    const groot = lijf.filter((x) => x.h >= maxH * 0.75 && x.k !== 'blauw');
    res.kop = plak(groot) || null;
    res.koppen = res.kop ? splitsKop(res.kop) : [];
    /* Alleen grijze regels in dezelfde kolom als de kop: tekst op een bord in de foto telt niet. */
    const kolom = groot.length ? Math.min(...groot.map((x) => x.x)) : null;
    res.beschrijving = plak(lijf.filter((x) => !groot.includes(x) && x.k === 'grijs'
      && (kolom == null || Math.abs(x.x - kolom) < 60))) || null;
    res.extensies = lijf.filter((x) => x.k === 'blauw').map((x) => ({ soort: 'knop', tekst: x.t }));
    res.overig = r.filter((x) => x.k === 'kleur').map((x) => x.t);
  }
  return res;
}

/* content.js-preview. Drie sjablonen gezien (23 sep):
   - "Local Ad Rendering Service": data-p = [n,["kop","beschrijving","domein","naam",[[adres]]...
   - "Single Ad Rendering Service" (gewone zoekadvertentie): data-p bevat
     "361903925":[7x null,"kop","weergave-URL","beschrijving",...]; sitelinks,
     reviews en locatie staan als tekstknopen met vaste klassen.
   - "GLS Ad Rendering Service" (Local Services): alleen tekstknopen. */
const ontEnt = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&middot;/g, '·').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const STR = '"((?:[^"\\\\]|\\\\.)*)"';
const ontStr = (s) => (s || '').replace(/\\(.)/g, '$1').replace(/[\u2066-\u2069]/g, '').trim();
function uitHtml(cr, formaat) {
  const f = path.join(CACHE, 'html', cr + '.html');
  if (!fs.existsSync(f)) return { bron: 'html', fout: 'geen preview' };
  const h = fs.readFileSync(f, 'utf8');
  const sjabloon = ((h.match(/<title>([^<]*)<\/title>/) || [])[1] || '').replace(' Ad Rendering Service', '') || 'onbekend';
  /* Tekst tussen twee tags; de klasse komt van de tag er direct voor. */
  const knopen = [...h.matchAll(/>([^<>]{1,400})</g)].map((x) => {
    const tag = h.slice(h.lastIndexOf('<', x.index), x.index);
    return { c: (tag.match(/class="([^"]*)"/) || [])[1] || '', t: ontEnt(x[1]).replace(/\\+$/, '').replace(/[\u2066-\u2069]/g, '').trim() };
  }).filter((x) => x.t.length > 1 && !/[{};=]|function|Ad Rendering Service/.test(x.t));
  const dp = ontEnt((h.match(/data-p="%\.@\.([^"]*)"/) || [])[1] || '');
  const res = { bron: 'html', sjabloon, naam: null, weergaveUrl: null, kop: null, koppen: [], beschrijving: null, sitelinks: [], extensies: [] };
  let m;
  if ((m = dp.match(new RegExp(`"361903925":\\[(?:null,){7}${STR},${STR},${STR}`)))) {
    res.kop = ontStr(m[1]); res.weergaveUrl = ontStr(m[2]); res.beschrijving = ontStr(m[3]);
  } else if ((m = dp.match(new RegExp(`^\\[?\\d+,\\[${STR},${STR},${STR},(?:${STR}|null)`)))) {
    res.kop = ontStr(m[1]); res.beschrijving = ontStr(m[2]); res.weergaveUrl = ontStr(m[3]); res.naam = ontStr(m[4]);
    const adres = dp.match(new RegExp(`\\[\\[${STR},${STR},${STR},${STR},${STR},${STR},"BE"`));
    if (adres) res.extensies.push({ soort: 'locatie', tekst: `${ontStr(adres[2])}, ${ontStr(adres[6])} ${ontStr(adres[4])}` });
  }
  for (const k of knopen) {
    if (/eletOb/.test(k.c)) { if (/www\.|https?:|\//.test(k.t) || DOMEIN.test(k.t) && k.t !== res.naam && res.naam) res.weergaveUrl ||= k.t; else res.naam ||= k.t; }
    else if (/Ueh9jd/.test(k.c)) res.sitelinks.push(k.t);
    else if (/FXta0d/.test(k.c)) res.extensies.push({ soort: 'reviews', tekst: k.t });
    else if (/KiC4od/.test(k.c)) res.extensies.push({ soort: 'locatie', tekst: k.t });
    else if (/gIhPub/.test(k.c) || /^(ROUTE|BEL|Bellen|Route|Website|website|call|directions|Site bezoeken|Website bezoeken|Appeler|Message|Overzicht)$/.test(k.t)) res.extensies.push({ soort: 'knop', tekst: k.t });
    else if (/rMoTmb/.test(k.c) && !/^<[^>]+>$/.test(k.t)) res.extensies.push({ soort: 'locatie', tekst: k.t.replace(/<[^>]+>\s*·?\s*/g, '').trim() });
  }
  if (!res.kop) {
    /* Terugval (GLS / zonder data-p): eerste tekstknoop die geen naam, domein of knop is. */
    const vrij = knopen.filter((k) => !/^(Gesponsord|Sponsored|Sponsorisé|·|ROUTE|BEL|Site bezoeken|website|call|directions|Appeler|Message|Ouvert|Fermé)$/i.test(k.t)
      && !/^· Van /.test(k.t) && k.t !== res.naam && !DOMEIN.test(k.t) && !/^\[|\]$|^</.test(k.t));
    res.kop = vrij[0] ? vrij[0].t : null;
    res.beschrijving = vrij[1] && !/^En activité depuis/.test(vrij[1].t) ? vrij[1].t : null;
    for (const k of knopen) if (/^En activité depuis/.test(k.t)) res.extensies.push({ soort: 'jaren actief (Local Services)', tekst: k.t });
    res.terugval = true;
  }
  const gezien = new Set();
  res.extensies = res.extensies.filter((e) => e.tekst && !gezien.has(e.soort + e.tekst) && gezien.add(e.soort + e.tekst));
  res.koppen = res.kop ? splitsKop(res.kop) : [];
  return res;
}

module.exports = { uitOcr, uitHtml, kleur };
