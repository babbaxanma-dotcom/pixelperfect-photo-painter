// Lead submission — pushes naar GoHighLevel Inbound Webhook + optionele Web3Forms email backup.
// Env vars (zet in .env, zie .env.example):
//   VITE_GHL_WEBHOOK_URL          → Inbound Webhook URL uit GHL (Automations → Inbound Webhook)
//   VITE_WEB3FORMS_KEY            → optionele fallback voor email-bezorging
//   VITE_LEAD_EMAIL_FALLBACK_TO   → ontvanger voor de Web3Forms backup
//
// Mapping volgt het Norvo context document (custom fields uit GHL subaccount).

import { getUtmParams, fireConversion } from './tracking';

// ── Web3Forms email-backup ────────────────────────────────────────────────
// Vuurt ALTIJD parallel met de GHL-webhook, zodat een lead NOOIT verloren gaat
// als de GHL-workflow/webhook niet afvuurt. De key mag via env (VITE_WEB3FORMS_KEY)
// OF hieronder hardcoded — Lovable-env blijkt soms leeg, dáárom kwam de backup
// niet binnen. Mails arriveren op het e-mailadres waarmee de key is aangemaakt
// (LEAD_EMAIL_TO override is optioneel).
const WEB3FORMS_ACCESS_KEY = '28574905-cb34-4bf5-83ed-6e09edec92d0'; // Mohammeds Web3Forms access key (nieuwe geverifieerde mail)
const LEAD_EMAIL_TO = ''; // optioneel: forceer ontvanger; leeg = Web3Forms-registratie-mail

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

// GHL "Type werk" SINGLE_OPTIONS expects EXACT divisie-labels. Accepteert zowel
// onze interne keys (ab_dakwerken) als de UI-labels uit Contact-form en LP's.
const DIVISIE_TO_GHL_LABEL: Record<string, string> = {
  // Interne keys
  ab_construct: 'AB Construct',
  ab_ecologisch: 'AB Ecologisch',
  ab_interieurwerken: 'AB Interieurwerken',
  ab_dakwerken: 'AB Dakwerken',
  ab_bad__wellness: 'AB Bad & Wellness',
  ab_gevelbekleding: 'AB Gevelbekleding',
  combinatie_meerdere_divisies: 'Combinatie / meerdere divisies',
  nog_te_bepalen: 'Nog te bepalen',
  // Pass-through wanneer LP-handlers al de GHL-label sturen
  'AB Construct': 'AB Construct',
  'AB Ecologisch': 'AB Ecologisch',
  'AB Interieurwerken': 'AB Interieurwerken',
  'AB Dakwerken': 'AB Dakwerken',
  'AB Bad & Wellness': 'AB Bad & Wellness',
  'AB Gevelbekleding': 'AB Gevelbekleding',
  'Combinatie / meerdere divisies': 'Combinatie / meerdere divisies',
  'Nog te bepalen': 'Nog te bepalen',
};

function toGhlDivisie(input: string | undefined): string {
  if (!input) return 'Nog te bepalen';
  return DIVISIE_TO_GHL_LABEL[input] ?? 'Nog te bepalen';
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
    email: p.email?.trim().toLowerCase() || undefined,
    phone: p.phone?.trim() || undefined,

    // GHL standaard adres-velden (komen door tot Contact.address1 / postalCode / city)
    address1: straat || undefined,
    postalCode: postcode || undefined,
    city: gemeente || undefined,
    country: 'BE',

    // Custom fields (zie Norvo context, sectie 4)
    type_werk: toGhlDivisie(p.type_werk),
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
    gbraid: utm.gbraid,
    wbraid: utm.wbraid,
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

  // Last-line guard: blokkeer ALLEEN als er GEEN enkel contactmiddel is.
  // (Snelle LP-formulieren sturen vaak enkel telefoon — die mogen NOOIT verloren
  // gaan; een lead met enkel telefoon is bruikbaar.)
  if (p.source !== 'newsletter') {
    const emailOk = !!p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim());
    const phoneOk = !!p.phone && (p.phone.replace(/\D/g, '').length >= 8);
    if (!emailOk && !phoneOk) {
      console.error('[lead] geblokkeerd — geen email én geen telefoon', { emailOk, phoneOk, source: p.source });
      return { ok: false, via: 'none', error: 'invalid_contact_info' };
    }
  }

  const body = buildBody(p);

  const w3key = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) || WEB3FORMS_ACCESS_KEY || undefined;
  const w3to = (import.meta.env.VITE_LEAD_EMAIL_FALLBACK_TO as string | undefined) || LEAD_EMAIL_TO || undefined;

  let ghlOk = false;
  let w3Ok = false;

  // Beide transporten ALTIJD parallel: GHL (CRM/pipeline) ÉN Web3Forms (email-backup).
  // Geen enkele lead mag verloren gaan als de GHL-webhook/workflow niet afvuurt.
  const tasks: Promise<void>[] = [];

  if (ghlUrl) {
    tasks.push(
      postJSON(ghlUrl, body)
        .then((res) => { ghlOk = res.ok; if (!res.ok) console.warn('[lead] GHL niet-ok status:', res.status); })
        .catch((err) => { console.warn('[lead] GHL submit failed:', err); })
    );
  }

  if (w3key) {
    tasks.push(
      postJSON('https://api.web3forms.com/submit', {
        access_key: w3key,
        subject: `Nieuwe AB Bouw lead (${p.source}) — ${body.name || body.email}`,
        from_name: 'AB Bouw website',
        ...(w3to ? { to: w3to } : {}),
        ...body,
      })
        .then((res) => { w3Ok = res.ok; if (!res.ok) console.warn('[lead] Web3Forms niet-ok status:', res.status); })
        .catch((err) => { console.warn('[lead] Web3Forms submit failed:', err); })
    );
  }

  await Promise.allSettled(tasks);

  const via: SubmitResult['via'] = ghlOk ? 'ghl' : w3Ok ? 'web3forms' : 'none';

  // Conversie vuurt bij geslaagde bezorging via WELK transport dan ook.
  if (ghlOk || w3Ok) {
    fireConversion(p.source, body);
    return { ok: true, via };
  }

  console.error('[lead] geen enkel transport geslaagd — lead niet bezorgd', { source: p.source });
  return { ok: false, via: 'none', error: 'no transport succeeded' };
}
