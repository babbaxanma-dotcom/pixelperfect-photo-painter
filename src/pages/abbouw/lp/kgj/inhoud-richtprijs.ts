/**
 * /lp/richtprijs-berekenen: de losse rekenaar voor wie zich nog oriënteert
 * (Mohammed, 5 okt 2026, "de drie paginas": campagne C, "Bereken de Richtprijs
 * van uw Renovatie. Klaar in 2 Minuten.", en de vangnetknop van de twee
 * landingspagina's linkt hierheen).
 *
 * De rekenaar staat in de hero, zoals de totaalrenovatiepagina hem tot 5 okt
 * had. Daaronder alleen het bewijs (uitgevoerd werk, voor/na), de werkwijze,
 * de vragen en het formulier: de pagina blijft bij de tool. Alles wat hier niet
 * staat, komt uit TOTAALRENOVATIE.
 */
import type { KgjInhoud } from './inhoud';
import { TOTAALRENOVATIE } from './inhoud-totaalrenovatie';

export const RICHTPRIJS: KgjInhoud = {
  ...TOTAALRENOVATIE,
  titel: 'Bereken de richtprijs van uw renovatie | AB Bouw Groep',
  omschrijving: 'Bereken de richtprijs van uw renovatie. Klaar in 2 minuten.',
  bronLead: 'lp:richtprijs:rekenaar',

  hero: {
    ...TOTAALRENOVATIE.hero,
    /* Uit zijn advertentietekst voor campagne C. "Klaar in 2 minuten" staat al op de kaart van de
       rekenaar ernaast, dus geen subkop die het herhaalt. */
    kop: 'Bereken de richtprijs van uw [renovatie]',
    onder: '',
    /* Geen knop: hier staat de rekenaar zelf in de hero. */
    knop: undefined,
  },

  /* De pagina is het vangnet; geen tweede verwijzing naar zichzelf. */
  vangnet: undefined,
  volgorde: ['uitgevoerd', 'voorna', 'werkwijze', 'faq'],

  inspectie: { ...TOTAALRENOVATIE.inspectie, bronLead: 'lp:richtprijs:inspectie' },
};
