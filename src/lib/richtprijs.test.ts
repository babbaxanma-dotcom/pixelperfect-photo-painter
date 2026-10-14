/**
 * Richtprijs van de rekenaar (14 okt 2026). Bedragen met de hand nagerekend uit src/data/dakprijzen.json en
 * src/data/renovatieprijzen.ts; een wijziging aan een prijs of rekenregel moet hier bewust mee aangepast worden.
 */
import { describe, it, expect } from 'vitest';
import { berekenVork, dakVork, renovatieVork } from './richtprijs';
import { renovatieExcl } from '@/data/renovatieprijzen';

const reno = (x: Record<string, string>) => ({ Woning: 'Rijwoning', Grootte: '100 tot 150 m²', Leeftijd: 'Ouder dan 10 jaar', Staat: 'Een groot deel', Start: 'Zo snel mogelijk', ...x });

describe('dak', () => {
  it('hellend dak, renovatie met isolatie, gegolfde pannen, 50-100 m², ouder dan 10 jaar', () => {
    expect(dakVork({ Dak: 'Hellend dak', Werk: 'Renovatie', Isolatie: 'Met isolatie', Leeftijd: 'Ouder dan 10 jaar', Bedekking: 'Gegolfde pannen', Grootte: '50 tot 100 m²', Asbest: 'Nee' }))
      .toEqual({ min: 8500, max: 31000, asbest: false });
  });
  it('herstelling geeft geen bedrag', () => {
    expect(dakVork({ Dak: 'Hellend dak', Werk: 'Herstelling', Grootte: '50 tot 100 m²' })).toBeNull();
  });
  it('berekenVork kiest de dakrekenaar voor ab_dakwerken', () => {
    expect(berekenVork('ab_dakwerken', { Dak: 'Plat dak', Werk: 'Isolatie', Leeftijd: 'Jonger dan 10 jaar', Grootte: 'Kleiner dan 50 m²', Asbest: 'Nee' }))
      .toEqual({ min: 3500, max: 14000, asbest: false });
  });
});

describe('renovatie', () => {
  it('keuken + isolatie, rijwoning 100-150 m²: 8.000-20.000 + 3.450-13.125 excl., 6 % btw', () => {
    expect(renovatieExcl(reno({ Renoveren: 'Keuken, Isolatie' }))).toEqual([11450, 33125]);
    expect(renovatieVork(reno({ Renoveren: 'Keuken, Isolatie' }))).toEqual({ min: 12000, max: 35500, asbest: false });
  });
  it('totaalrenovatie, een groot deel, 100-150 m²: 800-1.500 per m²', () => {
    expect(renovatieExcl(reno({ Renoveren: 'Alles (totaalrenovatie)' }))).toEqual([80000, 225000]);
    expect(renovatieVork(reno({ Renoveren: 'Alles (totaalrenovatie)' }))).toEqual({ min: 84500, max: 238500, asbest: false });
  });
  it('alleen badkamer in een jong appartement: 21 % btw op het maximum', () => {
    expect(renovatieVork(reno({ Woning: 'Appartement', Grootte: 'Kleiner dan 100 m²', Leeftijd: 'Jonger dan 10 jaar', Staat: 'Enkel de afwerking', Renoveren: 'Badkamer' })))
      .toEqual({ min: 6000, max: 18500, asbest: false });
  });
  it('grootte niet gekend: oppervlakte volgens het woningtype', () => {
    expect(renovatieExcl(reno({ Woning: 'Halfopen bebouwing', Grootte: 'Weet ik niet', Renoveren: 'Alles (totaalrenovatie)', Staat: 'Alles' })))
      .toEqual([140 * 1500, 200 * 3000]);
  });
  it('dak in de renovatierekenaar komt uit dezelfde dakprijstabel', () => {
    expect(renovatieExcl(reno({ Renoveren: 'Dak' }))).toEqual([5964, 37829]);
  });
  it('vloeren + muren dekken woonkamer en slaapkamers: die tellen dan niet mee', () => {
    const zonder = renovatieExcl(reno({ Renoveren: 'Vloeren, Muren en plafonds' }))!;
    const met = renovatieExcl(reno({ Renoveren: 'Woonkamer, Slaapkamers, Vloeren, Muren en plafonds' }))!;
    expect(met).toEqual(zonder);
  });
  it('alle posten op één na liggen in dezelfde orde als de totaalrenovatie per m²', () => {
    const totaal = renovatieExcl(reno({ Renoveren: 'Alles (totaalrenovatie)' }))!;
    const posten = renovatieExcl(reno({ Renoveren: 'Keuken, Badkamer, Woonkamer, Slaapkamers, Vloeren, Muren en plafonds, Verwarming en sanitair, Isolatie, Ramen en deuren, Elektriciteit, Dak' }))!;
    expect(posten[0]).toBeGreaterThan(totaal[0] * 0.5);
    expect(posten[0]).toBeLessThan(totaal[0] * 1.5);
    expect(posten[1]).toBeGreaterThan(totaal[1] * 0.5);
    expect(posten[1]).toBeLessThan(totaal[1] * 1.5);
  });
  it('zonder woningtype of renovatiekeuze geen bedrag', () => {
    expect(renovatieVork({ Grootte: '100 tot 150 m²', Staat: 'Alles' })).toBeNull();
  });
});
