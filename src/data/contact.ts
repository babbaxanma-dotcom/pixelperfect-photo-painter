/**
 * Centrale contact-config. Enige plek waar telefoonnummer, e-mail en adres staan.
 * Wijzig hier → site-wide update (na build/deploy).
 *
 * BELANGRIJK: externe systemen apart bijwerken bij telefoonnummer-switch:
 * - GHL → Settings → Custom Values → Telefoonnummer
 * - Google Business Profile → Edit profile → Phone
 * - Google Ads → Assets → Call extension
 * - Bardh's 0470: call forward AAN naar het nieuwe Twilio nummer
 */

export const CONTACT = {
  phone: {
    /** "0470 63 44 13" — BE display format, met spaties */
    display: '0470 63 44 13',
    /** "+32 470 63 44 13" — internationaal met spaties */
    spaced: '+32 470 63 44 13',
    /** "+32470634413" — E.164 voor schema.org / tel:-href / API's */
    e164: '+32470634413',
    /** "tel:+32470634413" — direct in <a href> bruikbaar */
    href: 'tel:+32470634413',
  },
  email: 'info@abgroep.be',
  address: {
    street: 'August van Landeghemstraat 65',
    postcode: '2830',
    city: 'Willebroek',
    country: 'BE',
  },
};
