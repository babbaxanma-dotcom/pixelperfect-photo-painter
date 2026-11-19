// 19 nov 2026, Mohammed: geen cookiemelding op de advertentiepagina's ("mensen geraken afgeschrikt", "kijk zelf maar").
// De rest van de site houdt de melding; zonder keuze blijft alles geweigerd (Consent Mode-standaard in index.html).
import { describe, it, expect } from 'vitest';
import { bannerOpPagina } from './consent';

describe('cookiemelding per pagina', () => {
  it('geen melding op de advertentiepagina\'s', () => {
    for (const p of ['/lp/dakwerken/', '/lp/dakwerken', '/lp/dakwerken/asbest/', '/lp/totaalrenovatie/', '/lp/aannemer-renovatiewerken/', '/totaalrenovatie', '/totaalrenovatie/']) {
      expect(bannerOpPagina(p), p).toBe(false);
    }
  });
  it('wel een melding op de rest van de site (positieve controle)', () => {
    for (const p of ['/', '/dakwerken', '/contact/', '/cookies', '/over', '/bedankt', '/lpx']) {
      expect(bannerOpPagina(p), p).toBe(true);
    }
  });
});
