/**
 * Guard op de calculator-configs.
 *
 * Waarom dit bestaat: een config wordt gemaakt door een bestaande te kopiëren.
 * `division` en `bronLead` zijn allebei gewoon strings, dus een vergeten
 * aanpassing is geldig TypeScript en dus onzichtbaar voor `npm run typecheck`.
 * Het gevolg is niet zichtbaar op de pagina maar wél in GoHighLevel: de lead
 * komt bij de verkeerde divisie binnen en de bron klopt niet. Dat is
 * geld-kritisch, dus het hoort in een test en niet in een leesregel.
 *
 * Deze test faalt ook als hij niets te controleren vindt: een lege meting is
 * geen groen licht.
 */
import { describe, it, expect } from 'vitest';
import { CALC_CONFIGS } from './calcConfigs';
import { DIENSTEN } from '../lp/LpDienst';

const sleutels = Object.keys(CALC_CONFIGS);

describe('calculator-configs', () => {
  it('meet iets: er zijn configs én diensten geladen', () => {
    expect(sleutels.length).toBeGreaterThanOrEqual(5);
    expect(Object.keys(DIENSTEN).length).toBeGreaterThanOrEqual(10);
  });

  it.each(sleutels)('%s: sleutel en slug zijn hetzelfde', (k) => {
    expect(CALC_CONFIGS[k].slug).toBe(k);
  });

  it.each(sleutels)('%s: er bestaat een LP met die slug', (k) => {
    expect(DIENSTEN[k]).toBeDefined();
  });

  it.each(sleutels)('%s: division komt overeen met de LP', (k) => {
    // Anders belandt de lead in GHL bij een andere divisie dan de pagina.
    expect(CALC_CONFIGS[k].division).toBe(DIENSTEN[k].division);
  });

  it.each(sleutels)('%s: bronLead is calculator:<slug>', (k) => {
    // Scheidt calculator-leads van de gewone ads-leads van dezelfde pagina.
    expect(CALC_CONFIGS[k].bronLead).toBe(`calculator:${k}`);
  });

  it.each(sleutels)('%s: elke stap is invulbaar en heeft een uitweg', (k) => {
    const cfg = CALC_CONFIGS[k];
    expect(cfg.steps.length).toBeGreaterThan(0);
    for (const s of cfg.steps) {
      if (s.kind === 'slider') {
        // Wie zijn m² niet weet, moet door kunnen zonder te gokken.
        expect(s.skipLabel, `${k}/${s.id} mist skipLabel`).toBeTruthy();
        expect(s.def).toBeGreaterThanOrEqual(s.min);
        expect(s.def).toBeLessThanOrEqual(s.max);
      } else {
        expect(s.options.length, `${k}/${s.id} heeft geen opties`).toBeGreaterThan(1);
        const keys = s.options.map((o) => o.key);
        expect(new Set(keys).size, `${k}/${s.id} heeft dubbele option-keys`).toBe(keys.length);
      }
    }
  });

  it.each(sleutels)('%s: belooft geen prijs vóór het plaatsbezoek', (k) => {
    /* De LP's beloven een vaste prijs NA het gratis plaatsbezoek. Een
       calculator die "direct uw prijs" suggereert, belooft meer dan de pagina
       eronder en dan klopt de verwachting van de beller niet. */
    const cfg = CALC_CONFIGS[k];
    const tekst = [cfg.label, cfg.triggerLabel, cfg.contactSub, cfg.formHint ?? '',
      ...cfg.steps.flatMap((s) => [s.q, s.sub])].join(' ').toLowerCase();
    expect(tekst).not.toMatch(/direct (uw|je) prijs|meteen (uw|je) prijs|prijs op het scherm/);
  });
});
