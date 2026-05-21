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
    /** "0460 20 77 88" — BE display format, met spaties */
    display: '0460 20 77 88',
    /** "+32 460 20 77 88" — internationaal met spaties */
    spaced: '+32 460 20 77 88',
    /** "+32460207788" — E.164 voor schema.org / tel:-href / API's */
    e164: '+32460207788',
    /** "tel:+32460207788" — direct in <a href> bruikbaar */
    href: 'tel:+32460207788',
  },
  email: 'info@abgroep.be',
  address: {
    street: 'August van Landeghemstraat 63',
    postcode: '2830',
    city: 'Willebroek',
    country: 'BE',
    /** "August van Landeghemstraat 63, 2830 Willebroek" — one-line full */
    full: 'August van Landeghemstraat 63, 2830 Willebroek',
  },
};
