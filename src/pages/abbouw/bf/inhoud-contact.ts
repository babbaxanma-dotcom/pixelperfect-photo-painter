/**
 * Tekst van /contact in de stijl van bfbouw.be (spec/bf-stijl.md §10), met de bron per regel.
 *
 * Bron: src/pages/abbouw/Contact.tsx (de huidige contactpagina) en HOME.contact
 * (lp/replica/inhoud.ts r.616-622, dictaat Mohammed 4 okt), via HOME_BF: één bron,
 * woordelijk, niets herschreven.
 *
 * Bewust NIET overgenomen uit Contact.tsx:
 * - de openingsuren (r.105-109): aanname zonder bron (spec A6, _rp.ts r.243-246);
 * - "Bellen gaat sneller dan een formulier. Tijdens de kantooruren neemt er iemand op die
 *   uw dossier kan inkijken." (r.99): steunt op die openingsuren en is een belofte zonder bron;
 * - "Liever meteen iemand aan de lijn?" (r.98): een vraag als kop; net als op /werkwijze
 *   (spec §10) krijgt het plaatsblok de kop van HOME.contact;
 * - "Velden met een sterretje zijn verplicht." (r.29): het nieuwe formulier heeft geen
 *   verplichte velden met sterretje; de uitleg boven de velden staat in spec §8.
 * De telefoon, het e-mailadres en het adres komen in het plaatsblok uit CONTACT (blokken.ts).
 */
import { HOME_BF, OMSCHRIJVING_STANDAARD } from './inhoud';

export const CONTACT_BF = {
  /* SEO (spec §11): Contact.tsx r.124 zet alleen de titel; de beschrijving was die van index.html r.8 */
  titel: 'Contact · AB Bouw Groep',
  omschrijving: OMSCHRIJVING_STANDAARD,

  /* paginakop (spec §10): kop "Contact" + één zin uit de bestaande pagina (Contact.tsx r.83) */
  kop: ['Contact'] as [string],
  sub: 'Wij bellen u terug om een moment af te spreken.',

  /* plaatsblok: HOME.contact (inh r.616-622) woordelijk, zoals op de home; BF /contact/ toont
     daar ook hetzelfde blok als de home (bouw/paginas.cjs r.207-210). Leadbron spec §8:
     bron_lead "contact:offerte" of "contact:plaatsbezoek", trackFormStart "contact:plaatsblok". */
  plaats: {
    pagina: 'contact',
    kop: HOME_BF.contact.kop,
    tekst: HOME_BF.contact.tekst,
    knopKies: HOME_BF.contact.knopKies,
  },
};
