/**
 * Regressie-guards voor de lead-pijplijn (leads.ts).
 *
 * Beschermt de twee dingen die eerder stilletjes braken en geld kostten:
 *  1. Web3Forms-backup moet ALTIJD parallel met GHL vuren (niet enkel als GHL faalt),
 *     zodat een lead nooit verloren gaat als de GHL-webhook niet afvuurt.
 *  2. Een telefoon-only lead (snel LP-formulier) mag NIET geblokkeerd worden.
 * En de basisveiligheid: een lead zonder enig contactmiddel wordt wél geblokkeerd,
 * en de conversie vuurt enkel bij geslaagde bezorging.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { submitLead, type LeadPayload } from './leads';
import { fireConversion } from './tracking';

vi.mock('./tracking', () => ({
  getUtmParams: () => ({}),
  fireConversion: vi.fn(),
}));

const GHL_URL = 'https://services.leadconnectorhq.com/hooks/test/webhook';
const WEB3_URL = 'https://api.web3forms.com/submit';

function fetchMock() {
  return vi.fn(async (_url: string, _init?: RequestInit) => ({ ok: true, status: 200 }) as unknown as Response);
}
function urlsOf(fetchSpy: ReturnType<typeof fetchMock>) {
  return fetchSpy.mock.calls.map((c) => String(c[0]));
}
const base: LeadPayload = {
  source: 'landing_page',
  page_path: '/lp/dakisolatie',
  email: 'jan@example.com',
  phone: '0470 12 34 56',
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('VITE_GHL_WEBHOOK_URL', GHL_URL);
  vi.stubEnv('VITE_WEB3FORMS_KEY', '');           // forceert de hardcoded fallback-key (altijd actief)
  vi.stubEnv('VITE_LEAD_EMAIL_FALLBACK_TO', '');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('submitLead — transport', () => {
  it('vuurt BEIDE transporten parallel (GHL én Web3Forms) bij een geldige lead', async () => {
    const f = fetchMock();
    vi.stubGlobal('fetch', f);

    const res = await submitLead({ ...base });

    const urls = urlsOf(f);
    expect(urls).toContain(GHL_URL);
    expect(urls.some((u) => u.startsWith(WEB3_URL))).toBe(true);
    expect(f).toHaveBeenCalledTimes(2);
    expect(res.ok).toBe(true);
    expect(fireConversion).toHaveBeenCalledTimes(1);
  });

  it('vuurt Web3Forms ook als de GHL-webhook-URL ontbreekt (lead gaat nooit verloren)', async () => {
    vi.stubEnv('VITE_GHL_WEBHOOK_URL', '');
    const f = fetchMock();
    vi.stubGlobal('fetch', f);

    const res = await submitLead({ ...base });

    const urls = urlsOf(f);
    expect(urls.some((u) => u.startsWith(WEB3_URL))).toBe(true);
    expect(urls).not.toContain(GHL_URL);
    expect(res.ok).toBe(true);
    expect(res.via).toBe('web3forms');
  });
});

describe('submitLead — contact-guard', () => {
  it('blokkeert een telefoon-only lead NIET (snel LP-formulier zonder e-mail)', async () => {
    const f = fetchMock();
    vi.stubGlobal('fetch', f);

    const res = await submitLead({ ...base, email: '', phone: '0470 12 34 56' });

    expect(res.ok).toBe(true);
    expect(f).toHaveBeenCalled();
    expect(fireConversion).toHaveBeenCalledTimes(1);
  });

  it('blokkeert een e-mail-only lead NIET', async () => {
    const f = fetchMock();
    vi.stubGlobal('fetch', f);

    const res = await submitLead({ ...base, email: 'jan@example.com', phone: '' });

    expect(res.ok).toBe(true);
    expect(f).toHaveBeenCalled();
  });

  it('blokkeert een lead zonder enig contactmiddel (geen fetch, geen conversie)', async () => {
    const f = fetchMock();
    vi.stubGlobal('fetch', f);

    const res = await submitLead({ ...base, email: '', phone: '' });

    expect(res.ok).toBe(false);
    expect(res.via).toBe('none');
    expect(f).not.toHaveBeenCalled();
    expect(fireConversion).not.toHaveBeenCalled();
  });
});

describe('submitLead — conversie vuurt enkel bij bezorging', () => {
  it('vuurt GEEN conversie als alle transporten falen', async () => {
    const f = vi.fn(async () => { throw new Error('network down'); });
    vi.stubGlobal('fetch', f);

    const res = await submitLead({ ...base });

    expect(res.ok).toBe(false);
    expect(res.via).toBe('none');
    expect(fireConversion).not.toHaveBeenCalled();
  });
});
