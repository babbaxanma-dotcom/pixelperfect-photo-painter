import { describe, expect, it } from 'vitest';
import { BEELDEN_TEST, kiesBeeld } from './Schetser';

/**
 * Het vangnet van de badkamerschetser.
 *
 * In de pagina zelf heeft elke combinatie van ruimtegrootte, toilet en tegellook
 * een eigen beeld. Daardoor valt er niets meer terug, en kan de browsercheck
 * niet meer bewijzen dat de terugval nog werkt — een meting die niets tegenkomt
 * bewijst niets.
 *
 * Deze tests voeren de keuze uit met een opzettelijk onvolledige beeldenbank.
 * Zo blijft aantoonbaar dat de volgende look die iemand toevoegt zonder beeld
 * niet in stilte een gebroken plaatje oplevert.
 */
const HALF = {
  'middel|wc|Betonlook grijs': 'm-wc-beton.jpg',
  'middel|wc|Antraciet': 'm-wc-antraciet.jpg',
  'middel|geenwc|Betonlook grijs': 'm-gwc-beton.jpg',
  'klein|wc|Betonlook grijs': 'k-wc-beton.jpg',
};

const GROOTTES = ['klein', 'middel', 'ruim'];
const LOOKS = ['Betonlook grijs', 'Antraciet', 'Marmerlook wit', 'Beige zandsteen', 'Houtlook', 'Microcement'];

describe('kiesBeeld, het vangnet van de schetser', () => {
  it('toont het gevraagde beeld wanneer die combinatie bestaat', () => {
    const r = kiesBeeld('middel', 'wc', 'Antraciet', HALF);
    expect(r.gevraagd).toBe('Antraciet');
    expect(r.getoond).toBe('Antraciet');
    expect(r.beeld).toBe('m-wc-antraciet.jpg');
  });

  it('valt terug op de basis wanneer de look ontbreekt, en meldt dat', () => {
    const r = kiesBeeld('middel', 'geenwc', 'Antraciet', HALF);
    expect(r.gevraagd).toBe('Antraciet');
    /* getoond wijkt af van gevraagd: daarop baseert het onderschrift zijn uitleg
       dat er iets anders te zien is dan wat gekozen werd. */
    expect(r.getoond).toBe('Betonlook grijs');
    expect(r.getoond).not.toBe(r.gevraagd);
    expect(r.beeld).toBe('m-gwc-beton.jpg');
  });

  it('houdt de grootte apart: dezelfde look in een andere ruimte is een ander beeld', () => {
    expect(kiesBeeld('klein', 'wc', 'Betonlook grijs', HALF).beeld).toBe('k-wc-beton.jpg');
    expect(kiesBeeld('middel', 'wc', 'Betonlook grijs', HALF).beeld).toBe('m-wc-beton.jpg');
  });

  it('behandelt "staat er niet tussen" als de basis, zonder terugvalmelding', () => {
    const r = kiesBeeld('middel', 'wc', 'anders', HALF);
    /* Dit is een keuze, geen terugval: de bezoeker beschrijft het zelf in het
       veld eronder, dus hoort het onderschrift geen excuus te maken. */
    expect(r.gevraagd).toBe('Betonlook grijs');
    expect(r.getoond).toBe(r.gevraagd);
  });

  it('behandelt een lege keuze als de basis', () => {
    const r = kiesBeeld('middel', 'wc', undefined, HALF);
    expect(r.getoond).toBe('Betonlook grijs');
    expect(r.beeld).toBe('m-wc-beton.jpg');
  });
});

describe('de echte beeldenbank', () => {
  it('heeft voor elke ruimte, elk toilet en elke look een eigen beeld', () => {
    const gezien = new Set<string>();
    for (const grootte of GROOTTES) {
      for (const toilet of ['wc', 'geenwc']) {
        for (const look of LOOKS) {
          const r = kiesBeeld(grootte, toilet, look, BEELDEN_TEST);
          /* getoond === gevraagd bewijst dat er niets terugvalt. */
          expect(r.getoond, `${grootte} + ${toilet} + ${look} valt terug`).toBe(look);
          expect(r.beeld, `${grootte} + ${toilet} + ${look} heeft geen beeld`).toBeTruthy();
          gezien.add(r.beeld as string);
        }
      }
    }
    /* En elk beeld is een ander bestand: twee combinaties die hetzelfde tonen
       zou de bezoeker laten klikken zonder dat er iets verandert. */
    expect(gezien.size).toBe(GROOTTES.length * 2 * LOOKS.length);
  });

  it('geeft nooit een leeg beeld terug, ook niet bij een onbekende look', () => {
    for (const grootte of GROOTTES) {
      for (const toilet of ['wc', 'geenwc']) {
        expect(kiesBeeld(grootte, toilet, 'bestaat niet', BEELDEN_TEST).beeld).toBeTruthy();
      }
    }
  });
});
