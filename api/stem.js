/**
 * Stemassistent AB Bouw Groep (14 okt 2026). Mohammed: "puur voor de landingspaginas advertentie aanvragen, aanvraag
 * kwalificatie en inplannen in dakinspectie of plaatsbezoek".
 *
 * Eén functie, vier acties (?actie=...):
 *   bel       GHL-workflow 01 stuurt { contact_id } bij een nieuwe aanvraag. Deze functie leest het contact zelf in GHL,
 *             belt alleen een verse aanvraag van een landingspagina met een Belgisch telefoonnummer, binnen het
 *             belvenster, en maar één keer (tag stem-gebeld). Dakpagina's → gratis dakinspectie, renovatiepagina's →
 *             gratis plaatsbezoek (Mohammed: "je ziet al aan de hand van de aanvraag gaat het om dakinspectie of
 *             plaatsbezoek"); de agent kiest dat nooit zelf.
 *   momenten  tool van de agent: de eerstvolgende vrije momenten van de agenda "Plaatsbezoek aan huis", in gewone
 *             woorden ("woensdag 21 oktober om 10 uur") met het exacte tijdstip erbij.
 *   boek      tool van de agent: boekt het gekozen moment voor dit contact, alleen een moment dat nu vrij is en alleen
 *             voor een contact dat de assistent zelf belde (tag stem-gebeld). ?proef=1 controleert zonder te boeken.
 *   noteer    tool van de agent: de uitkomst van het gesprek als notitie bij het contact.
 *
 * Er staat geen geheim in GHL of in ElevenLabs: de sleutels staan alleen hier op de server.
 * Nodig bij Vercel (Mohammed plakt ze zelf): GHL_TOKEN (private integration AB) en ELEVENLABS_API_KEY.
 */
export const config = { maxDuration: 30 };

const GHL = 'https://services.leadconnectorhq.com';
const LOCATIE = '86MhhNXcdg4sbqD689x4';
const AGENDA = 'ST3uIpAM7kFEokIm2NM7'; // Plaatsbezoek aan huis – AB Bouw Groep (wo 10-20, za 10-16:30)
const BARDH = '18TfSW4WHNvqYVGzPK3p';
const VELD = { bronDetail: 'fnbg1EeFs1qxaZ4PwfVd', info: 'aliVp2IMV6V1RiMb2uWu', adres: '6GeGYvSM2ksQF7QKCNDQ', postcode: 'rMRveOXYsOkjAMUe0a9x' };
const TAG = 'stem-gebeld';
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID || 'agent_1701m4y2my6tea6800a1e46gw3tx'; // ab-voice-agent/ids.json
const NUMMER_ID = process.env.ELEVENLABS_PHONE_ID || 'VUL_IN';
const TZ = 'Europe/Brussels';
/* Belvenster (Brusselse tijd): ma-vr 9:00-20:00, za 10:00-17:00. Daarbuiten belt de assistent niet; Bardh krijgt zijn
   melding en beltaak zoals altijd. */
const VENSTER = { 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [10, 17] };
const MAX_LEEFTIJD_MIN = 60; // alleen een verse aanvraag: ouder dan dit = niet bellen

const ghl = async (pad, opties = {}, versie = '2021-07-28') => {
  const r = await fetch(GHL + pad, {
    ...opties,
    headers: { Authorization: `Bearer ${process.env.GHL_TOKEN}`, Version: versie, Accept: 'application/json', 'Content-Type': 'application/json', ...(opties.headers || {}) },
  });
  const tekst = await r.text();
  let json; try { json = JSON.parse(tekst); } catch { json = { tekst }; }
  if (!r.ok) throw Object.assign(new Error(`GHL ${r.status} ${pad}`), { status: r.status, json });
  return json;
};

const veld = (contact, id) => (contact.customFields || contact.customField || []).find((f) => f.id === id)?.value ?? '';

/* Brusselse kalenderdelen van een tijdstip */
function brussel(d) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
    .formatToParts(d).map((x) => [x.type, x.value]));
  const dag = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday];
  return { dag, uur: Number(p.hour) % 24, minuut: Number(p.minute) };
}
export function binnenVenster(d = new Date()) {
  const { dag, uur, minuut } = brussel(d);
  const v = VENSTER[dag];
  if (!v) return false;
  const t = uur + minuut / 60;
  return t >= v[0] && t < v[1];
}

/* "woensdag 21 oktober om 10 uur" / "om 14.30 uur" */
export function inWoorden(iso) {
  const d = new Date(iso);
  const datum = new Intl.DateTimeFormat('nl-BE', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const { uur, minuut } = brussel(d);
  return `${datum} om ${uur}${minuut ? '.' + String(minuut).padStart(2, '0') : ''} uur`;
}

/* Belgisch nummer naar E.164; anders null (de assistent belt alleen Belgische nummers). */
export function e164(tel) {
  const c = String(tel || '').replace(/[^\d+]/g, '');
  if (/^\+32\d{8,9}$/.test(c)) return c;
  if (/^0032\d{8,9}$/.test(c)) return '+' + c.slice(2);
  if (/^0\d{8,9}$/.test(c)) return '+32' + c.slice(1);
  return null;
}

/* Welke afspraak hoort bij deze aanvraag (bron_lead_detail van de site, src/lib/leads.ts). */
export function soortVan(bronDetail) {
  const b = String(bronDetail || '');
  if (!b.startsWith('lp:')) return null;
  /* waarde = de reden voor het bezoek, woordelijk uit de bedankpagina van abgroep.be (BedanktBf TEKST, Mohammed: "Geef
     een reden voor de inspectie (Frame de waarde)"). */
  if (b.startsWith('lp:dakwerken:')) return { soort: 'gratis dakinspectie', onderwerp: 'uw dak', titel: 'Gratis dakinspectie', waarde: 'Om een definitieve prijs op te stellen, komt onze dakexpert graag de exacte staat van het dak opmeten.' };
  return { soort: 'gratis plaatsbezoek', onderwerp: 'uw renovatie', titel: 'Gratis plaatsbezoek', waarde: 'Onze projectleider komt langs, meet op en bespreekt uw plannen ter plaatse.' };
}

/* De antwoorden uit de rekenaar zonder het getoonde bedrag: de assistent noemt geen prijzen. */
const zonderPrijs = (info) => String(info || '').split(' · ').filter((d) => !/richtprijs|€/i.test(d)).join(' · ');

async function vrijeMomenten(dagen = 21) {
  const nu = Date.now();
  const j = await ghl(`/calendars/${AGENDA}/free-slots?startDate=${nu}&endDate=${nu + dagen * 864e5}&timezone=${encodeURIComponent(TZ)}`, {}, '2021-04-15');
  return Object.entries(j).filter(([, v]) => v && Array.isArray(v.slots)).flatMap(([, v]) => v.slots).sort();
}

async function bel(body) {
  const id = body.contact_id || body.contactId || body.id;
  if (!id) return { gebeld: false, reden: 'geen contact_id' };
  const { contact } = await ghl(`/contacts/${id}`);
  if (!contact || contact.locationId !== LOCATIE) return { gebeld: false, reden: 'contact niet gevonden' };
  if ((contact.tags || []).includes(TAG)) return { gebeld: false, reden: 'al gebeld' };
  const s = soortVan(veld(contact, VELD.bronDetail));
  if (!s) return { gebeld: false, reden: 'geen aanvraag van een landingspagina' };
  const nummer = e164(contact.phone);
  if (!nummer) return { gebeld: false, reden: 'geen Belgisch telefoonnummer' };
  const leeftijd = (Date.now() - new Date(contact.dateAdded).getTime()) / 6e4;
  if (leeftijd > MAX_LEEFTIJD_MIN) return { gebeld: false, reden: `aanvraag is ${Math.round(leeftijd)} min oud` };
  if (!binnenVenster()) return { gebeld: false, reden: 'buiten het belvenster' };
  /* Ja-ritme (Mohammed 14 okt): de assistent laat de klant eerst zijn eigen aanvraag bevestigen. Rekenaar = een
     richtprijs gevraagd; formulier = de inspectie of het bezoek zelf gevraagd. AI Act art. 50: meteen zeggen dat het
     een digitale assistent is. */
  const voornaam = (contact.firstName || '').trim();
  const aanvraag = veld(contact, VELD.bronDetail).includes(':rekenaar') ? `een richtprijs voor ${s.onderwerp}` : `een ${s.soort}`;
  const eersteZin = `Goeiedag, u spreekt met de digitale assistent van AB Bouw Groep.${voornaam ? ` Spreek ik met ${voornaam}?` : ''}`;
  const r = await fetch('https://api.elevenlabs.io/v1/convai/twilio/outbound-call', {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: AGENT_ID,
      agent_phone_number_id: NUMMER_ID,
      to_number: nummer,
      conversation_initiation_client_data: {
        dynamic_variables: {
          contact_id: contact.id,
          voornaam,
          aanvraag,
          soort_afspraak: s.soort,
          onderwerp: s.onderwerp,
          antwoorden: zonderPrijs(veld(contact, VELD.info)) || 'geen antwoorden bekend',
          gemeente: contact.city || veld(contact, VELD.postcode) || '',
          waarde: s.waarde,
        },
        conversation_config_override: { agent: { first_message: eersteZin } },
      },
    }),
  });
  const uit = await r.json().catch(() => ({}));
  if (!r.ok || !uit.success) return { gebeld: false, reden: `ElevenLabs ${r.status}: ${uit.message || JSON.stringify(uit.detail || uit).slice(0, 200)}` };
  await ghl(`/contacts/${id}/tags`, { method: 'POST', body: JSON.stringify({ tags: [TAG] }) });
  return { gebeld: true, gesprek: uit.conversation_id };
}

async function momenten() {
  /* Gespreid: per dag hoogstens 3 momenten (begin, midden, einde van de dag), 4 dagen, zodat de assistent twee
     verschillende dagen kan voorstellen. */
  const perDag = {};
  for (const v of await vrijeMomenten()) (perDag[v.slice(0, 10)] ||= []).push(v);
  const slots = Object.values(perDag).slice(0, 4).flatMap((d) => [...new Set([d[0], d[Math.floor(d.length / 2)], d[d.length - 1]])]);
  if (!slots.length) return { momenten: [], uitleg: 'Er is de komende drie weken geen vrij moment. Zeg dat een medewerker de klant terugbelt om een moment af te spreken.' };
  return { momenten: slots.map((start) => ({ start, tekst: inWoorden(start) })) };
}

async function boek(body, proef) {
  const { contact_id: id, start } = body;
  if (!id || !start) return { geboekt: false, reden: 'contact_id en start zijn nodig' };
  const { contact } = await ghl(`/contacts/${id}`);
  if (!contact || contact.locationId !== LOCATIE) return { geboekt: false, reden: 'contact niet gevonden' };
  if (!(contact.tags || []).includes(TAG)) return { geboekt: false, reden: 'dit contact werd niet door de assistent gebeld' };
  const vrij = await vrijeMomenten();
  const gekozen = vrij.find((v) => new Date(v).getTime() === new Date(start).getTime());
  if (!gekozen) return { geboekt: false, reden: 'dat moment is niet meer vrij', momenten: vrij.slice(0, 6).map((v) => ({ start: v, tekst: inWoorden(v) })) };
  const s = soortVan(veld(contact, VELD.bronDetail)) || { titel: 'Gratis plaatsbezoek' };
  const adres = String(body.adres || '').trim();
  if (proef) return { geboekt: false, proef: true, zou_boeken: { start: gekozen, tekst: inWoorden(gekozen), titel: s.titel, adres } };
  const eind = new Date(new Date(gekozen).getTime() + 60 * 6e4).toISOString();
  await ghl('/calendars/events/appointments', {
    method: 'POST',
    body: JSON.stringify({
      calendarId: AGENDA, locationId: LOCATIE, contactId: id, assignedUserId: BARDH,
      startTime: gekozen, endTime: eind, title: `${s.titel} – ${contact.firstName || contact.contactName || ''}`.trim(),
      appointmentStatus: 'confirmed', address: adres || undefined, ignoreDateRange: false, toNotify: true,
    }),
  }, '2021-04-15');
  if (adres) await ghl(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify({ customFields: [{ id: VELD.adres, field_value: adres }] }) }).catch(() => {});
  return { geboekt: true, tekst: inWoorden(gekozen) };
}

async function noteer(body) {
  const { contact_id: id, uitkomst, samenvatting } = body;
  if (!id) return { genoteerd: false };
  const { contact } = await ghl(`/contacts/${id}`);
  if (!contact || !(contact.tags || []).includes(TAG)) return { genoteerd: false, reden: 'onbekend contact' };
  await ghl(`/contacts/${id}/notes`, { method: 'POST', body: JSON.stringify({ body: `STEMASSISTENT - ${uitkomst || 'gesprek'}\n${samenvatting || ''}`.trim() }) });
  return { genoteerd: true };
}

export default async function handler(req, res) {
  const actie = req.query?.actie;
  if (req.method === 'GET' && !actie) return res.status(200).json({ gereed: Boolean(process.env.GHL_TOKEN && process.env.ELEVENLABS_API_KEY) });
  if (req.method !== 'POST') return res.status(405).json({ fout: 'alleen POST' });
  if (!process.env.GHL_TOKEN) return res.status(503).json({ fout: 'GHL_TOKEN ontbreekt' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  try {
    if (actie === 'bel') return res.status(200).json(await bel(body));
    if (actie === 'momenten') return res.status(200).json(await momenten());
    if (actie === 'boek') return res.status(200).json(await boek(body, req.query?.proef === '1'));
    if (actie === 'noteer') return res.status(200).json(await noteer(body));
    return res.status(400).json({ fout: 'onbekende actie' });
  } catch (e) {
    console.error('[stem]', actie, e.message, JSON.stringify(e.json || '').slice(0, 300));
    return res.status(200).json({ fout: 'Dat lukte niet. Zeg dat een medewerker de klant terugbelt.', detail: e.message });
  }
}
