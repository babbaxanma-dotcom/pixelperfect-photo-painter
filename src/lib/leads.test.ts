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
import { submitLead, ghlBron, splitNaam, type LeadPayload } from './leads';
import { fireConversion } from './tracking';

const utm = vi.hoisted(() => ({ nu: {} as Record<string, string> }));
vi.mock('./tracking', () => ({
  getUtmParams: () => utm.nu,
  fireConversion: vi.fn(),
}));

// De opties van het GHL-dropdownveld "Bron lead" (contact), afgelezen in GHL op 23 sep 2026.
// Een waarde buiten deze lijst bewaart GHL niet.
const GHL_BRON_OPTIES = ['Website', 'Telefoon', 'Doorverwijzing', 'Google Ads', 'Social', 'Werfbord / passant', 'Beurs of event', 'Bestaande klant'];

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
  utm.nu = {};
  vi.stubEnv('VITE_GHL_WEBHOOK_URL', GHL_URL);
  vi.stubEnv('VITE_WEB3FORMS_KEY', '');           // forceert de hardcoded fallback-key (altijd actief)
  vi.stubEnv('VITE_LEAD_EMAIL_FALLBACK_TO', '');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('submitLead, transport', () => {
  it('vuurt BEIDE transporten parallel (GHL én Web3Forms) bij een geldige lead', async () => {
    const f = fetchMock();
    vi.stubGlobal('fetch', f);

    const res = await submitLead({ ...base });

    const urls = urlsOf(f);
    expect(urls).toContain(GHL_URL);
    expect(urls.some((u) => u.startsWith(WEB3_URL))).toBe(true);
    expect(f).toHaveBeenCalledTimes(3); // GHL + Web3Forms (Mohammed) + Web3Forms (tarik.azarkan@getnorvo.be, 24 nov 2026)
    expect(res.ok).toBe(true);
    expect(fireConversion).toHaveBeenCalledTimes(1);
  });

  it('stuurt elke lead ook als mail naar tarik.azarkan@getnorvo.be (24 nov 2026), met dezelfde velden', async () => {
    const f = fetchMock();
    vi.stubGlobal('fetch', f);
    await submitLead({ ...base });
    const w3 = f.mock.calls.filter((c) => String(c[0]) === WEB3_URL).map((c) => JSON.parse(String(c[1]?.body)));
    expect(w3.map((b) => b.access_key).sort()).toEqual(['287b3728-9325-409b-91f8-b2582fb83017', 'b01e4fea-3e73-418b-b65a-acfb1d3ee43c']);
    expect(w3[0].phone).toBe(w3[1].phone);
    expect(w3[0].email).toBe('jan@example.com');
  });

  it('GHL ligt eruit en alleen de mail naar Tarik komt aan: de lead is toch bezorgd', async () => {
    vi.stubGlobal('fetch', vi.fn(async (u: string, init?: RequestInit) => {
      if (String(u) === WEB3_URL && String(init?.body).includes('287b3728-9325-409b-91f8-b2582fb83017')) return { ok: true, status: 200 } as unknown as Response;
      return { ok: false, status: 503 } as unknown as Response;
    }));
    const res = await submitLead({ ...base });
    expect(res.ok).toBe(true);
    expect(res.via).toBe('web3forms');
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

describe('submitLead, contact-guard', () => {
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

describe('voornaam en achternaam naar GHL ("Dag {{contact.first_name}},")', () => {
  async function verstuurd(p: Partial<LeadPayload>) {
    const f = fetchMock();
    vi.stubGlobal('fetch', f);
    const res = await submitLead({ ...base, ...p });
    const ghl = f.mock.calls.find((c) => String(c[0]) === GHL_URL);
    return { res, body: JSON.parse(String(ghl?.[1]?.body)), f };
  }

  it('splitst "jan peeters" in Jan + peeters', async () => {
    const { body } = await verstuurd({ firstName: 'jan peeters' });
    expect(body.firstName).toBe('Jan');
    expect(body.lastName).toBe('peeters');
    expect(body.name).toBe('Jan peeters');
  });

  it('laat één voornaam staan en zet er een hoofdletter op', async () => {
    const { body } = await verstuurd({ firstName: 'jan' });
    expect(body.firstName).toBe('Jan');
    expect(body.lastName).toBeUndefined();
    expect(body.name).toBe('Jan');
  });

  it('trimt en houdt de rest van de achternaam zoals getypt ("  Marie  Louise Peeters ")', async () => {
    const { body } = await verstuurd({ firstName: '  Marie  Louise Peeters ' });
    expect(body.firstName).toBe('Marie');
    expect(body.lastName).toBe('Louise Peeters');
    expect(body.name).toBe('Marie Louise Peeters');
  });

  it('houdt een samengestelde voornaam met koppelteken in één stuk', async () => {
    expect(splitNaam('Jean-Pierre Dubois').firstName).toBe('Jean-Pierre');
    expect(splitNaam('jean-pierre').firstName).toBe('Jean-pierre');
  });

  it('een lege naam blijft leeg en de lead vertrekt toch (telefoon-only)', async () => {
    const { res, body, f } = await verstuurd({ firstName: '   ', email: '', phone: '0470 12 34 56' });
    expect(body.firstName).toBeUndefined();
    expect(body.lastName).toBeUndefined();
    expect(body.name).toBeUndefined();
    expect(res.ok).toBe(true);
    expect(f).toHaveBeenCalledTimes(3); // GHL + 2x Web3Forms (24 nov 2026)
  });

  it('firstName en lastName apart meegegeven blijven ongewijzigd (voornaam met hoofdletter)', async () => {
    const { body } = await verstuurd({ firstName: 'jan', lastName: 'Van den Berg' });
    expect(body.firstName).toBe('Jan');
    expect(body.lastName).toBe('Van den Berg');
    expect(body.name).toBe('Jan Van den Berg');
  });

  it('splitst NIET als de achternaam apart is meegegeven, ook niet bij twee voornamen', async () => {
    const { body } = await verstuurd({ firstName: 'Marie Louise', lastName: 'Peeters' });
    expect(body.firstName).toBe('Marie Louise');
    expect(body.lastName).toBe('Peeters');
  });

  it('geeft de conversie dezelfde gesplitste naam door (Enhanced Conversions)', async () => {
    await verstuurd({ firstName: 'jan peeters' });
    const doorgegeven = vi.mocked(fireConversion).mock.calls[0][1] as Record<string, unknown>;
    expect(doorgegeven.firstName).toBe('Jan');
    expect(doorgegeven.lastName).toBe('peeters');
  });
});

describe('bron naar GHL', () => {
  it.each([
    [{ gclid: 'Cj0KCQ' }, 'Google Ads'],
    [{ gbraid: '0AAAAA' }, 'Google Ads'],
    [{ utm_source: 'google', utm_medium: 'cpc' }, 'Google Ads'],
    [{ utm_source: 'google', utm_medium: 'organic' }, 'Website'],
    [{ fbclid: 'IwAR' }, 'Social'],
    [{ utm_source: 'facebook' }, 'Social'],
    [{}, 'Website'],
  ])('%o geeft %s', (params, verwacht) => {
    expect(ghlBron(params)).toBe(verwacht);
  });

  it('stuurt een geldige Bron lead-optie en het formulier-detail apart', async () => {
    utm.nu = { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'dakrenovatie', utm_term: 'dak vernieuwen', gclid: 'Cj0KCQ' };
    const f = fetchMock();
    vi.stubGlobal('fetch', f);

    await submitLead({ ...base, bron_lead: 'lp:dakwerken:rekenaar:hero' });

    const ghl = f.mock.calls.find((c) => String(c[0]) === GHL_URL);
    const body = JSON.parse(String(ghl?.[1]?.body));
    expect(GHL_BRON_OPTIES).toContain(body.bron_lead);
    expect(body.bron_lead).toBe('Google Ads');
    expect(body.bron_lead_detail).toBe('lp:dakwerken:rekenaar:hero');
    expect(body.utm_campaign).toBe('dakrenovatie');
    expect(body.utm_term).toBe('dak vernieuwen');
  });

  it('valt zonder formulier-detail terug op het pad', async () => {
    const f = fetchMock();
    vi.stubGlobal('fetch', f);

    await submitLead({ ...base });

    const body = JSON.parse(String(f.mock.calls.find((c) => String(c[0]) === GHL_URL)?.[1]?.body));
    expect(body.bron_lead).toBe('Website');
    expect(body.bron_lead_detail).toBe('/lp/dakisolatie');
  });
});

describe('submitLead, conversie vuurt enkel bij bezorging', () => {
  it('vuurt GEEN conversie als alle transporten falen', async () => {
    const f = vi.fn(async () => { throw new Error('network down'); });
    vi.stubGlobal('fetch', f);

    const res = await submitLead({ ...base });

    expect(res.ok).toBe(false);
    expect(res.via).toBe('none');
    expect(fireConversion).not.toHaveBeenCalled();
  });
});

/* 18 nov 2026 (formulier v2): mag een mislukte aanvraag vanzelf opnieuw (Aanvraag.tsx, 2 nieuwe pogingen)? Alleen als de aanvraag
   zeker niet aankwam: elk transport een netwerkfout of een 5xx. Een time-out of een 4xx: nooit vanzelf opnieuw (dubbele lead). */
describe('submitLead, opnieuw na een mislukte bezorging', () => {
  it('netwerkfout op beide transporten: opnieuw = true, geen conversie', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));
    const res = await submitLead({ ...base });
    expect(res.ok).toBe(false);
    expect(res.opnieuw).toBe(true);
    expect(fireConversion).not.toHaveBeenCalled();
  });
  it('503 op beide transporten: opnieuw = true', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503 }) as unknown as Response));
    const res = await submitLead({ ...base });
    expect(res.opnieuw).toBe(true);
  });
  it('een 4xx op één transport: opnieuw = false (de aanvraag zelf klopt niet)', async () => {
    vi.stubGlobal('fetch', vi.fn(async (u: string) => ({ ok: false, status: String(u).includes('web3forms') ? 400 : 503 }) as unknown as Response));
    const res = await submitLead({ ...base });
    expect(res.ok).toBe(false);
    expect(res.opnieuw).toBe(false);
  });
  it('een time-out (AbortError) op één transport: opnieuw = false (het verzoek kan al aangekomen zijn)', async () => {
    vi.stubGlobal('fetch', vi.fn(async (u: string) => { if (String(u).includes('web3forms')) throw new DOMException('aborted', 'AbortError'); throw new TypeError('Failed to fetch'); }));
    const res = await submitLead({ ...base });
    expect(res.opnieuw).toBe(false);
  });
  it('één transport geslaagd: ok, geen opnieuw-vlag', async () => {
    vi.stubGlobal('fetch', vi.fn(async (u: string) => { if (String(u).includes('web3forms')) throw new TypeError('Failed to fetch'); return { ok: true, status: 200 } as unknown as Response; }));
    const res = await submitLead({ ...base });
    expect(res.ok).toBe(true);
    expect(res.opnieuw).toBeUndefined();
  });
});
