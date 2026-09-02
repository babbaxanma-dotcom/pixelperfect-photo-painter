import { describe, expect, it } from 'vitest';
import { kiesBeeld } from './Schetser';

/**
 * Het vangnet van de badkamerschetser.
 *
 * In de pagina zelf heeft elke tegellook een eigen beeld, met en zonder toilet.
 * Daardoor valt er niets meer terug, en kan de browsercheck niet meer bewijzen
 * dat de terugval nog werkt — een meting die niets tegenkomt bewijst niets.
 *
 * Deze tests voeren de keuze uit met een opzettelijk onvolledige beeldenbank.
 * Zo blijft aantoonbaar dat de volgende look die iemand toevoegt zonder beeld
 * niet in stilte een gebroken plaatje oplevert.
 */
const HALF = {
  'wc|Betonlook grijs': 'basis-wc.jpg',
  'wc|Antraciet': 'antraciet-wc.jpg',
  'geenwc|Betonlook grijs': 'basis-geenwc.jpg',
};

describe('kiesBeeld, het vangnet van de schetser', () => {
  it('toont het gevraagde beeld wanneer die combinatie bestaat', () => {
    const r = kiesBeeld('wc', 'Antraciet', HALF);
    expect(r.gevraagd).toBe('Antraciet');
    expect(r.getoond).toBe('Antraciet');
    expect(r.beeld).toBe('antraciet-wc.jpg');
  });

  it('valt terug op de basis wanneer de combinatie ontbreekt, en meldt dat', () => {
    const r = kiesBeeld('geenwc', 'Antraciet', HALF);
    expect(r.gevraagd).toBe('Antraciet');
    /* getoond wijkt af van gevraagd: daarop baseert het onderschrift zijn
       uitleg dat er iets anders te zien is dan wat gekozen werd. */
    expect(r.getoond).toBe('Betonlook grijs');
    expect(r.getoond).not.toBe(r.gevraagd);
    expect(r.beeld).toBe('basis-geenwc.jpg');
  });

  it('geeft nooit een leeg beeld terug zolang de basis bestaat', () => {
    for (const toilet of ['wc', 'geenwc']) {
      for (const look of ['Antraciet', 'Marmerlook wit', 'Houtlook', 'bestaat niet']) {
        expect(kiesBeeld(toilet, look, HALF).beeld).toBeTruthy();
      }
    }
  });

  it('behandelt "staat er niet tussen" als de basis, zonder terugvalmelding', () => {
    const r = kiesBeeld('wc', 'anders', HALF);
    /* Dit is een keuze, geen terugval: de bezoeker beschrijft het zelf in het
       veld eronder, dus hoort het onderschrift geen excuus te maken. */
    expect(r.gevraagd).toBe('Betonlook grijs');
    expect(r.getoond).toBe(r.gevraagd);
  });

  it('behandelt een lege keuze als de basis', () => {
    const r = kiesBeeld('wc', undefined, HALF);
    expect(r.getoond).toBe('Betonlook grijs');
    expect(r.beeld).toBe('basis-wc.jpg');
  });
});

describe('de echte beeldenbank', () => {
  it('heeft voor elke look een eigen beeld, met en zonder toilet', async () => {
    const { BEELDEN_TEST } = await import('./Schetser');
    const looks = ['Betonlook grijs', 'Antraciet', 'Marmerlook wit', 'Beige zandsteen', 'Houtlook', 'Microcement'];
    const gezien = new Set<string>();
    for (const toilet of ['wc', 'geenwc']) {
      for (const look of looks) {
        const r = kiesBeeld(toilet, look, BEELDEN_TEST);
        /* getoond === gevraagd bewijst dat er niets terugvalt. */
        expect(r.getoond, `${toilet} + ${look} valt terug`).toBe(look);
        gezien.add(r.beeld as string);
      }
    }
    /* En elk beeld is een ander bestand: twee combinaties die hetzelfde tonen
       zou de bezoeker laten klikken zonder dat er iets verandert. */
    expect(gezien.size).toBe(looks.length * 2);
  });
});
