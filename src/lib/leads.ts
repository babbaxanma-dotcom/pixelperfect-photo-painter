// Lead submission — pushes naar GoHighLevel Inbound Webhook + optionele Web3Forms email backup.
// Env vars (zet in .env, zie .env.example):
//   VITE_GHL_WEBHOOK_URL          → Inbound Webhook URL uit GHL (Automations → Inbound Webhook)
//   VITE_WEB3FORMS_KEY            → optionele fallback voor email-bezorging
//   VITE_LEAD_EMAIL_FALLBACK_TO   → ontvanger voor de Web3Forms backup
//
// Mapping volgt het Norvo context document (custom fields uit GHL subaccount).

import { getUtmParams, fireConversion } from './tracking';

export type Divisie =
  | 'ab_construct'
  | 'ab_ecologisch'
  | 'ab_interieurwerken'
  | 'ab_dakwerken'
  | 'ab_bad__wellness'
  | 'ab_gevelbekleding'
  | 'combinatie_meerdere_divisies'
  | 'nog_te_bepalen';

const DIVISIE_LABEL_TO_KEY: Record<string, Divisie> = {
  'Algemene aanneming (Construct)': 'ab_construct',
  'Ecologisch / duurzaam': 'ab_ecologisch',
  'Interieurwerken': 'ab_interieurwerken',
  'Dakwerken': 'ab_dakwerken',
  'Badkamer / wellness': 'ab_bad__wellness',
  'Gevelbekleding': 'ab_gevelbekleding',
  'Combinatie / weet ik niet': 'combinatie_meerdere_divisies',
};

export function divisieKey(label: string | null | undefined): Divisie {
  if (!label) return 'nog_te_bepalen';
  return DIVISIE_LABEL_TO_KEY[label.trim()] ?? 'nog_te_bepalen';
}

export interface LeadPayload {
  // Pipeline-stuurinformatie
  source: 'contact_form' | 'newsletter' | 'landing_page';
  page_path: string;
  landing_division?: Divisie; // wanneer landing page

  // Persoon
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;

  // Adres project (granular — wordt voor GHL Adres-veld geconcatenateerd)
  straat?: string;
  postcode?: string;
  gemeente?: string;

  // Project
  type_werk?: Divisie;
  aanvullende_info?: string;

  // Marketing
  bron_lead?: string;
}

interface SubmitResult {
  ok: boolean;
  via: 'ghl' | 'web3forms' | 'none';
  error?: string;
}

function buildBody(p: LeadPayload) {
  const utm = getUtmParams();

  // Concat adres voor GHL custom field "Adres project" (Enkele lijn — Norvo sectie 4).
  // Format: "Straat 12, 2830 Willebroek" — alleen niet-lege onderdelen, comma tussen
  // straat en de postcode-gemeente combo.
  const straat = p.straat?.trim();
  const postcode = p.postcode?.trim();
  const gemeente = p.gemeente?.trim();
  const postcodeGemeente = [postcode, gemeente].filter(Boolean).join(' ').trim();
  const adresProject = [straat, postcodeGemeente].filter(Boolean).join(', ').trim() || undefined;

  return {
    // Standaard GHL contact velden
    firstName: p.firstName?.trim() || undefined,
    lastName: p.lastName?.trim() || undefined,
    name: [p.firstName, p.lastName].filter(Boolean).join(' ').trim() || undefined,
    email: p.email.trim().toLowerCase(),
    phone: p.phone?.trim() || undefined,

    // GHL standaard adres-velden (komen door tot Contact.address1 / postalCode / city)
    address1: straat || undefined,
    postalCode: postcode || undefined,
    city: gemeente || undefined,
    country: 'BE',

    // Custom fields (zie Norvo context, sectie 4)
    type_werk: p.type_werk ?? 'nog_te_bepalen',
    aanvullende_info: p.aanvullende_info?.trim() || undefined,
    adres_project: adresProject,
    bron_lead: p.bron_lead || (utm.utm_source ? `ads:${utm.utm_source}` : 'website'),

    // UTM / context
    page_path: p.page_path,
    landing_division: p.landing_division,
    source: p.source,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_term: utm.utm_term,
    utm_content: utm.utm_content,
    gclid: utm.gclid,
    fbclid: utm.fbclid,
    referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    submitted_at: new Date().toISOString(),
  };
}

async function postJSON(url: string, body: unknown, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
      mode: 'cors',
      keepalive: true,
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

export async function submitLead(p: LeadPayload): Promise<SubmitResult> {
  const ghlUrl = import.meta.env.VITE_GHL_WEBHOOK_URL as string | undefined;
  const w3fKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
  const fallbackEmail = import.meta.env.VITE_LEAD_EMAIL_FALLBACK_TO as string | undefined;

  const body = buildBody(p);

  // 1) Probeer GHL Inbound Webhook
  if (ghlUrl) {
    try {
      const res = await postJSON(ghlUrl, body);
      if (res.ok) {
        fireConversion(p.source, body);
        // Web3Forms parallel als extra inbox-backup
        if (w3fKey) void sendWeb3Forms(body, w3fKey, fallbackEmail);
        return { ok: true, via: 'ghl' };
      }
    } catch (err) {
      // fall through naar Web3Forms
      console.warn('[lead] GHL submit failed:', err);
    }
  }

  // 2) Web3Forms fallback (email naar Bardh + Tarik)
  if (w3fKey) {
    try {
      const ok = await sendWeb3Forms(body, w3fKey, fallbackEmail);
      if (ok) {
        fireConversion(p.source, body);
        return { ok: true, via: 'web3forms' };
      }
    } catch (err) {
      console.warn('[lead] Web3Forms submit failed:', err);
    }
  }

  return { ok: false, via: 'none', error: 'no transport configured' };
}

async function sendWeb3Forms(body: ReturnType<typeof buildBody>, key: string, to?: string) {
  const payload = {
    access_key: key,
    subject: `[AB Bouw site] Nieuwe ${body.source === 'newsletter' ? 'nieuwsbrief-inschrijving' : 'lead'} — ${body.name ?? body.email}`,
    from_name: 'AB Bouw website',
    ...(to ? { to } : {}),
    ...body,
  };
  const res = await postJSON('https://api.web3forms.com/submit', payload);
  return res.ok;
}
