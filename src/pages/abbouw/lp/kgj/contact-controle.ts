/**
 * Controle van de contactgegevens van de aanvraagkaart (Aanvraag.tsx, AanvraagStaat.tsx), 18 nov 2026 (formulier v2, zoals
 * bfbouw.be audit f5bc8cc / 8aee942, src/js/site.js telKaal, telGeldig, mailKaal, mailGeldig).
 *
 * Telefoon: een nummer uit het adresboek of de automatische invulling komt met harde spaties, punten, schuine strepen, liggende
 * streepjes of onzichtbare richtingstekens ("0470 12 34 56" met U+00A0, "\u202a+32 470 12 34 56\u202c"). De oude toets (minstens
 * 8 cijfers) liet "0470 12 34" door en telde "........" niet als fout. Nu: alle scheidingstekens weg; wat overblijft moet een
 * optionele + en 9 tot 15 cijfers zijn (Belgisch vast nummer = 9 cijfers, gsm = 10, +32 470 ... = 11).
 * E-mail: spaties rond het adres en een punt, komma of puntkomma erachter (iPhone: twee spaties = punt) gaan weg vóór de toets en
 * vóór het versturen; daarna iets@domein.tld met een extensie van minstens 2 tekens en geen lege stukken tussen de punten.
 */
export const telKaal = (t: string) => String(t || '').replace(/[\s\u00a0\u200b-\u200f\u202a-\u202e\u2066-\u2069./()\-\u2010-\u2015]/g, '');
export const telGeldig = (t: string) => /^\+?\d{9,15}$/.test(telKaal(t));
export const mailKaal = (t: string) => String(t || '').trim().replace(/[.,;]+$/, '');
export const mailGeldig = (t: string) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(mailKaal(t));
export const naamGeldig = (t: string) => String(t || '').trim().length > 0;

/** De bewaarde contactgegevens van dit tabblad (sessionStorage, weg na versturen en bij het sluiten van het tabblad). */
export const CONTACT_SLEUTEL = 'ab_contact';
export type BewaardContact = { naam?: string; email?: string; telefoon?: string };
export function leesContact(): BewaardContact | null {
  try {
    const c = JSON.parse(sessionStorage.getItem(CONTACT_SLEUTEL) || 'null') as BewaardContact | null;
    if (!c || typeof c !== 'object') return null;
    const kort = (x: unknown) => (typeof x === 'string' ? x.slice(0, 200) : undefined);
    return { naam: kort(c.naam), email: kort(c.email), telefoon: kort(c.telefoon) };
  } catch { return null; }
}
export function bewaarContact(c: BewaardContact) {
  try { sessionStorage.setItem(CONTACT_SLEUTEL, JSON.stringify(c)); } catch { /* niets */ }
}
