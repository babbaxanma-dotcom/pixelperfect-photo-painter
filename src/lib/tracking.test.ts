/**
 * AVG/ePrivacy: een gclid of utm-waarde mag pas op het toestel bewaard worden
 * met toestemming voor marketing (25 sep 2026). Zonder toestemming blijft hij
 * in het geheugen, zodat een aanvraag in hetzelfde bezoek toch zijn bron meldt.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const LS_UTM = 'ab_bouw_utm_v1';
const LS_CONSENT = 'ab_bouw_consent_v1';

async function laadMetUrl(zoek: string) {
  vi.resetModules();
  window.history.replaceState({}, '', '/lp/dakwerken' + zoek);
  return import('./tracking');
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('utm en gclid bewaren', () => {
  it('bewaart zonder toestemming NIETS op het toestel, maar kent de bron wel', async () => {
    const t = await laadMetUrl('?gclid=ABC&utm_source=google&utm_medium=cpc');
    t.captureUtm();
    expect(window.localStorage.getItem(LS_UTM)).toBeNull();
    expect(t.getUtmParams().gclid).toBe('ABC');
    expect(t.getUtmParams().utm_source).toBe('google');
  });

  it('bewaart met toestemming voor marketing', async () => {
    window.localStorage.setItem(LS_CONSENT, JSON.stringify({ analytics: true, marketing: true }));
    const t = await laadMetUrl('?gclid=XYZ');
    t.captureUtm();
    expect(JSON.parse(window.localStorage.getItem(LS_UTM) || '{}').gclid).toBe('XYZ');
  });

  it('bewaart pas na toestemming die later komt, en wist bij intrekken', async () => {
    const t = await laadMetUrl('?gclid=LATER');
    t.captureUtm();
    expect(window.localStorage.getItem(LS_UTM)).toBeNull();

    window.localStorage.setItem(LS_CONSENT, JSON.stringify({ analytics: true, marketing: true }));
    window.dispatchEvent(new CustomEvent('ab-bouw-consent-changed'));
    expect(JSON.parse(window.localStorage.getItem(LS_UTM) || '{}').gclid).toBe('LATER');

    window.localStorage.setItem(LS_CONSENT, JSON.stringify({ analytics: false, marketing: false }));
    window.dispatchEvent(new CustomEvent('ab-bouw-consent-changed'));
    expect(window.localStorage.getItem(LS_UTM)).toBeNull();
  });
});
