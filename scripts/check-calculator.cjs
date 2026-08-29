#!/usr/bin/env node
/**
 * Stresstest van de prijsindicatie-calculator.
 *
 * Het telefoonnummer is hier verplicht: de prijsindicatie wordt telefonisch
 * gegeven, dus een aanvraag zonder nummer is een aanvraag waar niemand iets mee
 * kan. Deze test probeert het formulier op alle manieren te versturen waarop een
 * bezoeker dat fout kan doen, en controleert dat er niets vertrekt zonder
 * bruikbaar nummer — en dat het wél vertrekt zodra het er staat.
 *
 * Er gaat GEEN echte lead de deur uit: elk verzoek naar de webhook of naar
 * Web3Forms wordt onderschept en met een nagemaakt antwoord afgehandeld. De
 * test telt die pogingen wel, want "niet verstuurd" en "onderschept" moeten uit
 * elkaar te houden zijn.
 *
 * Draaien: node scripts/check-calculator.cjs [url]
 */
const puppeteer = require('puppeteer-core');

const BASIS = process.argv[2] || 'http://localhost:8080';
/* Beide replica-pagina's draaien op dezelfde calculator. Eén ervan toetsen
   bewijst niets over de andere: de vragen, de bron en de bedankpagina komen
   per pagina uit inhoud.ts. */
const PADEN = ['/totaalrenovatie', '/badkamerrenovatie'];
const CHROME = process.env.CHROME_PAD || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
/** Adressen waar een lead naartoe zou gaan. Die mogen nooit echt geraakt worden. */
const LEADPADEN = [/leadconnectorhq/i, /gohighlevel/i, /web3forms/i, /hooks\./i];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new', protocolTimeout: 180000,
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const fouten = [];
  let proeven = 0;

  /** Opent de pagina, loopt de vragen door en stopt op het gegevensscherm. */
  const totAanHetEind = async (pad, breedte = 1200) => {
    const pg = await browser.newPage();
    await pg.setViewport({ width: breedte, height: 950, deviceScaleFactor: 1 });
    await pg.evaluateOnNewDocument(() => {
      try { localStorage.setItem('ab_bouw_consent_v1', JSON.stringify({ analytics: true, marketing: true, essential: true, ts: Date.now() })); } catch { /* leeg */ }
    });
    const gepoogd = [];
    await pg.setRequestInterception(true);
    pg.on('request', (req) => {
      if (LEADPADEN.some((r) => r.test(req.url()))) {
        gepoogd.push(req.url());
        return req.respond({ status: 200, contentType: 'application/json', body: '{"ok":true,"success":true}' });
      }
      return req.continue();
    });
    await pg.goto(BASIS + pad, { waitUntil: 'networkidle0', timeout: 60000 });
    await pg.evaluate(() => document.querySelector('.pc-calc--dicht .pc-knop').click());
    await new Promise((r) => setTimeout(r, 200));
    /* elke vraag beantwoorden met de eerste keuze */
    for (let i = 0; i < 12; i++) {
      const klaar = await pg.evaluate(() => {
        const k = document.querySelector('.pc-calc-keuzes button');
        if (!k) return true;
        k.click();
        return false;
      });
      await new Promise((r) => setTimeout(r, 120));
      if (klaar) break;
    }
    const opEind = await pg.evaluate(() => !!document.querySelector('.pc-calc-uitkomst form'));
    return { pg, gepoogd, opEind };
  };

  /** Vult de velden en drukt op verzenden; geeft terug wat er gebeurde. */
  const verstuur = async (pg, velden) => {
    await pg.evaluate((v) => {
      const zet = (naam, waarde) => {
        const el = document.querySelector(`.pc-calc-uitkomst input[name="${naam}"]`);
        if (!el) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, waarde);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      zet('naam', v.naam || '');
      zet('telefoon', v.telefoon || '');
      zet('email', v.email || '');
      document.querySelector('.pc-calc-uitkomst form').requestSubmit();
    }, velden);
    await new Promise((r) => setTimeout(r, 700));
    return pg.evaluate(() => ({
      fout: (document.querySelector('.pc-calc-fout') || {}).textContent || '',
      nogOpFormulier: !!document.querySelector('.pc-calc-uitkomst form'),
      pad: window.location.pathname,
    }));
  };

  for (const pad of PADEN) {
    /* ── 1. helemaal leeg ── */
    {
      const { pg, gepoogd, opEind } = await totAanHetEind(pad);
      if (!opEind) fouten.push('de vragen leidden niet naar het gegevensscherm — de meting telt niet');
      const r = await verstuur(pg, {});
      proeven++;
      if (!r.nogOpFormulier || r.pad !== pad) fouten.push(pad + ': leeg formulier werd toch verstuurd');
      if (!/telefoonnummer/i.test(r.fout)) fouten.push(`leeg formulier: melding noemt het telefoonnummer niet ("${r.fout}")`);
      if (gepoogd.length) fouten.push(`leeg formulier: er vertrok toch een aanvraag (${gepoogd.length})`);
      await pg.close();
    }

    /* ── 2. alleen naam en e-mail, geen nummer ── */
    {
      const { pg, gepoogd } = await totAanHetEind(pad);
      const r = await verstuur(pg, { naam: 'Test Persoon', email: 'test@voorbeeld.be' });
      proeven++;
      if (!r.nogOpFormulier) fouten.push('zonder telefoonnummer maar met e-mail werd er toch verstuurd');
      if (!/telefoonnummer/i.test(r.fout)) fouten.push(`zonder nummer: melding noemt het telefoonnummer niet ("${r.fout}")`);
      if (gepoogd.length) fouten.push(`zonder nummer: er vertrok toch een aanvraag (${gepoogd.length})`);
      await pg.close();
    }

    /* ── 3. een nummer dat te kort is om te bellen ── */
    {
      const { pg, gepoogd } = await totAanHetEind(pad);
      const r = await verstuur(pg, { naam: 'Test', telefoon: '0460 20 7' }); /* 7 cijfers: net onder de drempel */
      proeven++;
      if (!r.nogOpFormulier) fouten.push('een te kort nummer werd toch geaccepteerd');
      if (!/telefoonnummer|volledig/i.test(r.fout)) fouten.push(`een nummer van 7 cijfers gaf geen validatiemelding ("${r.fout}")`);
      if (gepoogd.length) fouten.push(`te kort nummer: er vertrok toch een aanvraag (${gepoogd.length})`);
      await pg.close();
    }

    /* ── 4. letters in plaats van cijfers ── */
    {
      const { pg, gepoogd } = await totAanHetEind(pad);
      const r = await verstuur(pg, { naam: 'Test', telefoon: 'bel mij maar' });
      proeven++;
      if (!r.nogOpFormulier) fouten.push('een nummer zonder cijfers werd toch geaccepteerd');
      if (!/telefoonnummer|volledig/i.test(r.fout)) {
        /* Zonder deze regel glipte een echte fout erdoor: de controle telde met
           /D/ TEKENS in plaats van cijfers, dus 'bel mij maar' haalde de drempel
           van acht. Het formulier bleef daarna toch staan - niet door de
           controle, maar omdat het versturen lokaal faalt. 'Nog op het
           formulier' is dus geen bewijs; alleen de validatiemelding is dat. */
        fouten.push(`nummer zonder cijfers: geen validatiemelding ("${r.fout}") — de controle liet het door`);
      }
      if (gepoogd.length) fouten.push(`nummer zonder cijfers: er vertrok toch een aanvraag (${gepoogd.length})`);
      await pg.close();
    }

    /* ── 5. een geldig nummer moet de controle PASSEREN ──
          Niet toetsen op doorsturen naar de bedanktpagina: of het versturen
          werkelijk lukt hangt af van de webhooksleutels, en die staan lokaal niet
          ingesteld. Wat deze guard moet bewaken is de drempel zelf — dus: geen
          validatiemelding meer, en het formulier is wel degelijk gaan versturen
          (de knop komt in zijn bezig-stand of er volgt een netwerkmelding). */
    {
      const { pg } = await totAanHetEind(pad);
      const r = await verstuur(pg, { naam: 'Test Persoon', telefoon: '0460 20 77 88' });
      proeven++;
      if (/telefoonnummer|volledig/i.test(r.fout)) fouten.push(`een geldig nummer werd afgewezen door de controle ("${r.fout}")`);
      if (r.pad !== '/bedankt' && !/versturen lukte niet/i.test(r.fout)) {
        fouten.push(`met een geldig nummer gebeurde er niets: geen doorstuur en geen melding (pad ${r.pad}, melding "${r.fout}")`);
      }
      await pg.close();
    }

    /* ── 6. hetzelfde op een telefoon ── */
    {
      const { pg } = await totAanHetEind(pad, 390);
      const r = await verstuur(pg, { telefoon: '0460207788' });
      proeven++;
      if (/telefoonnummer|volledig/i.test(r.fout)) fouten.push(`op 390px werd een geldig nummer afgewezen ("${r.fout}")`);
      if (r.pad !== '/bedankt' && !/versturen lukte niet/i.test(r.fout)) {
        fouten.push(`op 390px gebeurde er niets met een geldig nummer (pad ${r.pad}, melding "${r.fout}")`);
      }
      await pg.close();
    }
  }

  await browser.close();

  if (proeven < 6 * PADEN.length) {
    console.error(`FOUT: maar ${proeven} van de ${6 * PADEN.length} proeven uitgevoerd — de meting telt niet`);
    process.exit(2);
  }

  console.log(`check-calculator: ${proeven} verzendpogingen over ${PADEN.length} pagina's, geen enkele echte lead verstuurd`);
  if (!fouten.length) { console.log('  het telefoonnummer is echt verplicht en een geldige aanvraag komt door'); process.exit(0); }
  console.log('');
  for (const f of fouten) console.log(`  FOUT: ${f}`);
  process.exit(1);
})();
