/**
 * /lp/aannemer-renovatiewerken: de kopie van de totaalrenovatiepagina voor wie
 * een aannemer voor renovatiewerken zoekt (Mohammed, 5 okt 2026, "de drie
 * paginas": "Je kloont de Totaalrenovatie pagina ... en past alleen de
 * elementen boven de fold en het dienstenoverzicht aan. De werkwijze, de
 * realisaties en de garanties blijven exact hetzelfde.").
 *
 * Alles wat hier niet staat, komt uit TOTAALRENOVATIE. De tekst is van
 * Mohammed, letterlijk ("maar met mijn copy he"): de kop en subkop uit
 * "de drie paginas", de frustratie en het dienstenoverzicht uit zijn
 * herziene blauwdruk voor renovatiewerken. Echte werffoto's van AB.
 */
import type { KgjInhoud } from './inhoud';
import { TOTAALRENOVATIE } from './inhoud-totaalrenovatie';
import eigen9022 from '@/assets/lp-diensten/eigen/IMG_9022.jpg';
import eigen9025 from '@/assets/lp-diensten/eigen/IMG_9025.jpg';
import eigen9030 from '@/assets/lp-diensten/eigen/IMG_9030.jpg';
import eigen9065 from '@/assets/lp-diensten/eigen/IMG_9065.jpg';
import uitbouwNa from '@/assets/lp-diensten/uitbreiding-na.jpg';
import dakNa from '@/assets/lp-diensten/dak-na.jpg';

export const RENOVATIEWERKEN: KgjInhoud = {
  ...TOTAALRENOVATIE,
  titel: 'Aannemer voor renovatiewerken | AB Bouw Groep',
  omschrijving: 'De betrouwbare aannemer voor al uw renovatiewerken. Gratis plaatsbezoek en offerte, werken aan 6% btw.',
  bronLead: 'lp:aannemer-renovatiewerken:rekenaar',

  hero: {
    ...TOTAALRENOVATIE.hero,
    /* "De Betrouwbare Aannemer Voor Al Uw Renovatiewerken." Het zoekwoord in de accentkleur:
       wie "aannemer" zocht, leest het meteen. */
    kop: 'De betrouwbare [aannemer] voor al uw renovatiewerken.',
    /* 6 okt, Mohammed: "haal alle subtekst weg, hou enkel headline en puntjes" (zelfde hero als de
       totaalrenovatiepagina). */
    onder: '',
  },

  waarom: {
    ...TOTAALRENOVATIE.waarom,
    kop: 'Een renovatie hoeft geen nachtmerrie te zijn.',
    tekst: 'Veel huiseigenaren zien enorm op tegen een verbouwing of renovatie. Aannemers die hun afspraken niet nakomen, een huis dat maandenlang een bouwwerf is, en offertes die halverwege het traject plotseling duizenden euro\'s duurder uitvallen.',
    tegenover: 'Bij AB Bouw Groep pakken we elk renovatieproject fundamenteel anders aan:',
  },

  diensten: {
    kop: 'Eén aannemer voor al uw renovatiewerken',
    onder: 'Of u nu één specifieke ruimte wilt aanpakken of de hele woning stript: omdat wij alle disciplines zelf in huis hebben, sluiten de werkzaamheden altijd naadloos op elkaar aan.',
    lijst: [
      { id: 'bouw', icoon: 'dienst-nieuw', naam: 'Totaalrenovatie & nieuwbouw', tekst: 'Uw woning volledig gestript en opnieuw opgebouwd.',
        foto: { src: eigen9022, alt: 'Open leefruimte met keukeneiland, eettafel en glaspui naar de tuin, door AB Bouw Groep' } },
      { id: 'aanbouw', icoon: 'dienst-ruwbouw', naam: 'Aanbouwen & verbouwingen', tekst: 'Meer leefruimte creëren met een strakke aanbouw of het doorbreken van muren.',
        foto: { src: uitbouwNa, alt: 'Afgewerkte uitbouw met witte crepi en een schuifraam over de volle breedte, door AB Bouw Groep' } },
      { id: 'dakwerken', icoon: 'dienst-renovatie', naam: 'Dakwerken', tekst: 'Van isolatie en nieuwe dakbedekking tot complete dakconstructies.',
        foto: { src: dakNa, alt: 'Vernieuwd pannendak met dakvensters, door AB Bouw Groep' } },
      { id: 'gevel', icoon: 'dienst-ruwbouw', naam: 'Gevelrenovatie', tekst: 'Herstel, isolatie en een compleet nieuwe uitstraling voor uw buitenmuren.',
        foto: { src: eigen9030, alt: 'Wit geschilderde woning met een nieuw tuinpad van grote tegels, door AB Bouw Groep' } },
      { id: 'badkamer', icoon: 'afd-bad', naam: 'Badkamer en wellness', tekst: 'Van leidingwerk tot de laatste luxueuze tegel, vakkundig geïnstalleerd.',
        foto: { src: eigen9025, alt: 'Inloopdouche met marmerlook-tegels en een zwevend wastafelmeubel, door AB Bouw Groep' } },
      { id: 'interieur', icoon: 'dienst-interieur', naam: 'Interieurwerken', tekst: 'Maatwerk meubels, schilderwerken en vloeren die perfect bij uw stijl passen.',
        foto: { src: eigen9065, alt: 'Tv-wand in marmerlook tussen houten lamellen, met een zwevend meubel, door AB Bouw Groep' } },
    ],
  },

  /* Zelfde formulier, eigen bron: in het CRM staat van welke pagina de lead komt
     ("De CRM-Hack" in de blauwdruk). */
  inspectie: { ...TOTAALRENOVATIE.inspectie, bronLead: 'lp:aannemer-renovatiewerken:inspectie' },
};
