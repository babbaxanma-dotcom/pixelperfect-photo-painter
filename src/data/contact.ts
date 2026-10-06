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
  /** Btw-nummer, Mohammed 7 okt 2026: "BE1010850361 is het btw nummer" (het oude 0712.443.881 was
      fout en stond in de voet van de landingspagina's en in de voorwaarden). Controlegetal klopt:
      97 - (10108503 mod 97) = 61. */
  btw: {
    /** "BE 1010.850.361": zoals het op de site staat */
    display: 'BE 1010.850.361',
    /** "BE1010850361": zonder spaties en punten, voor facturen en API's */
    plain: 'BE1010850361',
  },
  address: {
    street: 'August van Landeghemstraat 63',
    postcode: '2830',
    city: 'Willebroek',
    country: 'BE',
    /** "August van Landeghemstraat 63, 2830 Willebroek" — one-line full */
    full: 'August van Landeghemstraat 63, 2830 Willebroek',
  },
};
