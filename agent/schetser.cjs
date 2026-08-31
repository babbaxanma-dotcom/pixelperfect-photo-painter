#!/usr/bin/env node
/**
 * Badkamerschetser — de agent die op deze pc draait.
 *
 * De website staat op Vercel en mag geen sleutels bevatten. Deze dienst draait
 * hier, bouwt uit de keuzes van de bezoeker een prompt, laat Artlist het beeld
 * maken en geeft het terug. Vercel praat er alleen mee via een tunnel-adres dat
 * in een omgevingsvariabele staat, zodat het adres nooit in de browser belandt.
 *
 * Waarom hier en niet op Vercel: de Artlist-verbinding is op deze machine
 * ingelogd. Een serverloze functie zou een aparte API-sleutel nodig hebben die
 * er vandaag niet is. Bovendien wilde Mohammed dat het nadenken — het bouwen
 * van de prompt — lokaal gebeurt.
 *
 * LET OP: als deze pc uit staat, werkt de sectie op de site niet. De proxy op
 * Vercel vangt dat af met een nette melding; hij verzint geen beeld.
 *
 * Draaien:  node agent/schetser.cjs
 * Poort:    AGENT_POORT (standaard 8787)
 * Geheim:   AGENT_GEHEIM — dezelfde waarde moet bij Vercel staan
 */
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');

const POORT = Number(process.env.AGENT_POORT || 8787);
const GEHEIM = process.env.AGENT_GEHEIM || '';
const MAP = path.join(os.tmpdir(), 'ab-schetser');
fs.mkdirSync(MAP, { recursive: true });

/* ── De keuzes en hun promptfragmenten ────────────────────────────────────
   Elke keuze is één zin die het model kan waarmaken. Meer dan vier assen
   tegelijk levert een beeld op waarin het model de helft laat vallen. */
const ASSEN = {
  tegels: {
    betonlook: 'large-format concrete-look grey porcelain tiles',
    antraciet: 'large-format anthracite dark grey porcelain tiles',
    marmerlook: 'large-format white marble-look porcelain tiles with soft grey veining',
    zandsteen: 'large-format warm beige sandstone-look porcelain tiles',
  },
  meubel: {
    eiken: 'a floating oak vanity unit',
    wit: 'a floating matt white vanity unit',
    antraciet: 'a floating anthracite vanity unit',
    walnoot: 'a floating walnut vanity unit',
  },
  kranen: {
    zwart: 'matte black taps and a matte black framed shower screen',
    chroom: 'polished chrome taps and a slim chrome framed shower screen',
    goud: 'brushed brass taps and a brushed brass framed shower screen',
    rvs: 'brushed stainless steel taps and a stainless steel framed shower screen',
  },
  opstelling: {
    inloopdouche: 'a walk-in shower with a clear glass panel where the bath used to be',
    bad: 'a built-in bath',
    beide: 'a built-in bath and a separate walk-in shower',
    houden: null, /* niets aan de indeling veranderen */
  },
};

/**
 * Bouwt de instructie.
 *
 * De opdracht is bewust MINIMAAL: alleen benoemen wat er verandert, en
 * expliciet zeggen dat de rest identiek blijft. Wie het hele beeld opnieuw
 * beschrijft, krijgt een andere kamer terug — dat is bij het uitproberen
 * bevestigd. De opsomming van wat gelijk moet blijven staat er wel bij, want
 * zonder die zin veranderde de spiegel mee.
 */
function bouwPrompt(keuzes, eigenMateriaal) {
  const stukken = [];
  for (const [as, waarde] of Object.entries(keuzes)) {
    const zin = ASSEN[as]?.[waarde];
    if (zin) stukken.push(zin);
  }
  if (!stukken.length) return null;

  const wat = eigenMateriaal
    ? `Apply the material from the second reference image to the walls and floor. Also give the room ${stukken.join(', ')}.`
    : `Change the bathroom in this photograph to have ${stukken.join(', ')}.`;

  return `${wat} Keep everything else in the photograph exactly identical: the same room and layout, the same camera angle and framing, the same windows and daylight, the same ceiling, the same door, and the same proportions. Keep reflections in the mirror and glass consistent with the new materials. Photorealistic interior photograph, no styling props added, no text, no watermark.`;
}

/**
 * Laat Artlist het beeld maken.
 *
 * Dit loopt via de Claude-opdrachtregel op deze machine, omdat de
 * Artlist-verbinding daar is ingelogd. Komt er ooit een losse API-sleutel, dan
 * is dit de enige functie die vervangen moet worden — de rest van de dienst
 * blijft zoals hij is.
 */
function genereer(prompt, fotoPad) {
  return new Promise((klaar, mis) => {
    const opdracht = [
      'Gebruik de Artlist-tool generate_image met modelGroupId 117.',
      `Neem als invoerbeeld het bestand ${fotoPad} (upload het eerst met upload_image).`,
      'Instelling aspect_ratio moet overeenkomen met de verhouding van dat bestand.',
      `De prompt is precies dit, woord voor woord: ${prompt}`,
      'Wacht tot de generatie klaar is en antwoord met UITSLUITEND de assetUrl, niets anders.',
    ].join(' ');

    execFile('claude', ['-p', opdracht], { timeout: 180000, maxBuffer: 8 * 1024 * 1024 },
      (fout, uit) => {
        if (fout) return mis(new Error('generatie mislukt: ' + fout.message));
        const url = (uit.match(/https:\/\/\S+/) || [])[0];
        if (!url) return mis(new Error('geen beeld-adres in het antwoord'));
        klaar(url.replace(/[)\]",.]+$/, ''));
      });
  });
}

const antwoord = (res, code, lichaam) => {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(lichaam));
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/leeft') return antwoord(res, 200, { ok: true });
  if (req.method !== 'POST' || req.url !== '/schets') return antwoord(res, 404, { fout: 'onbekend pad' });
  if (GEHEIM && req.headers['x-agent-geheim'] !== GEHEIM) return antwoord(res, 401, { fout: 'geen toegang' });

  let ruw = '';
  req.on('data', (d) => {
    ruw += d;
    if (ruw.length > 12e6) { req.destroy(); }
  });
  req.on('end', async () => {
    let body;
    try { body = JSON.parse(ruw); } catch { return antwoord(res, 400, { fout: 'ongeldige invoer' }); }

    const prompt = bouwPrompt(body.keuzes || {}, body.eigenMateriaal);
    if (!prompt) return antwoord(res, 400, { fout: 'geen keuzes meegegeven' });
    if (!body.foto) return antwoord(res, 400, { fout: 'geen foto meegegeven' });

    /* De foto komt binnen als data-URI; die moet als bestand op schijf staan
       voordat Artlist hem kan inlezen. */
    const gegevens = String(body.foto).split(',').pop();
    const naam = path.join(MAP, `bezoeker-${process.hrtime.bigint()}.jpg`);
    try {
      fs.writeFileSync(naam, Buffer.from(gegevens, 'base64'));
      const beeld = await genereer(prompt, naam);
      antwoord(res, 200, { beeld, prompt });
    } catch (e) {
      antwoord(res, 502, { fout: e.message });
    } finally {
      fs.rm(naam, { force: true }, () => {});
    }
  });
});

/* Alleen luisteren als dit bestand rechtstreeks gestart wordt. Zo kan een
   test de prompt-bouwer inlezen zonder dat er een server blijft draaien. */
module.exports = { ASSEN, bouwPrompt, server };

if (require.main === module) server.listen(POORT, () => {
  console.log(`schetser-agent luistert op http://localhost:${POORT}`);
  if (!GEHEIM) console.log('LET OP: AGENT_GEHEIM staat niet ingesteld — iedereen die het adres kent, kan de agent gebruiken.');
});
