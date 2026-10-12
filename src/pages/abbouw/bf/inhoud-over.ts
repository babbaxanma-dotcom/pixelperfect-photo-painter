/**
 * Tekst en beelden van /over in de stijl van bfbouw.be (spec/bf-stijl.md §10).
 *
 * Bron per blok:
 *   - overAb ("Over AB Bouw Groep") en aanpak ("De kracht van onze aanpak" + slotalinea):
 *     bron = "dictaat Mohammed 12 okt 2026 (geplakte copy)". WOORDELIJK overgenomen, geen woord herschreven,
 *     ingekort of verbeterd. Deze copy vervangt "Hoe wij werken" en "De mensen op uw werf" (OverOns.tsx).
 *   - alle andere tekst: WOORDELIJK uit src/pages/abbouw/OverOns.tsx (dictaat Mohammed 4 okt 2026,
 *     "visueel verbeteren" 5 okt zonder tekstwijziging). Regelnummers hieronder = regels in OverOns.tsx.
 * OverOns.tsx exporteert die lijsten niet en blijft als terugval staan (spec §3).
 *
 * Volgorde (spec §10): paginakop, cijferband, duo "Over AB Bouw Groep" met Google-badge,
 * beloftelijst "De kracht van onze aanpak" met slotalinea, waarden-raster "Officieel erkend en
 * verzekerd", plaatsblok. Geen team- en geen reviewblok (spec §1, ab-paginas.md /over).
 *
 * Beelden: FOTOPLAN.over (spec §15).
 */
import { HOME_BF, OMSCHRIJVING_STANDAARD } from './inhoud';
import { FOTOPLAN } from './fotoplan';

export const OVER_BF = {
  /* SEO: OverOns.tsx r.126 zet alleen de titel; de beschrijving was die van index.html r.8 (spec §11) */
  titel: 'Over ons · AB Bouw Groep',
  omschrijving: OMSCHRIJVING_STANDAARD,

  /* paginakop: h1 r.50 ("Het bedrijf achter" + lichtere tweede regel "uw verbouwing").
     De oude hero had geen subkop; BF-vak blijft leeg (geen nieuwe tekst). */
  kop: ['Het bedrijf achter', 'uw verbouwing'] as [string, string],
  kopFoto: FOTOPLAN.over.kop,

  /* cijferband (BF .ocijfers, witte balk over de onderrand van de paginakop): CIJFERS r.19-22, zijn tekst.
     Spec A2: op /over blijft "16 jaar ervaring" staan.
     Bron-waarden zonder naam (ze belanden als tekst in de JS-bundel); verwijzingen: OverOns.tsx r.20 en r.21, dictaat Mohammed 4 okt. */
  cijfers: {
    label: 'AB Bouw Groep in cijfers',
    tegels: [
      { icoon: 'jaren', getal: '16', label: 'jaar ervaring', bron: 'dictaat 4 okt /over' },
      { icoon: 'vakmensen', getal: '6', label: 'vakdisciplines onder één dak', bron: 'dictaat 4 okt /over' },
    ] as { icoon: 'jaren' | 'vakmensen'; getal: string; label: string; bron: string }[],
  },

  /* duo met Google-badge (BF "Waar wij voor staan"): kop + 2 alinea's.
     Bron: dictaat Mohammed 12 okt 2026 (geplakte copy), "## Over AB Bouw Groep". Woordelijk, niets herschreven.
     Vervangt kop "Hoe wij werken" + alinea uit OverOns.tsx r.65-73. Foto blijft. */
  overAb: {
    kop: 'Over AB Bouw Groep',
    alineas: [
      'Een verbouwing is een prachtig project: het is bouwen aan de plek waar u woont en leeft. Wij begrijpen dat u tijdens dit traject vooral wilt genieten van het proces en het resultaat. Daarom richten wij ons op wat écht telt: duidelijkheid, topkwaliteit en rust in uw hoofd.',
      'Met 16 jaar ervaring en 6 verschillende vakdisciplines onder één dak brengen we alle expertise samen die nodig is voor uw droomwoning. Als algemeen aannemer coördineren wij uw project van de allereerste afbraak tot de laatste plint. Wij zorgen voor een perfect op elkaar afgestemde planning, zodat u zich volledig kunt focussen op de keuzes die uw huis een thuis maken.',
    ],
    foto: FOTOPLAN.over.overSplit,
  },

  /* beloftelijst (BF "Wat u van ons mag verwachten", duo--om): kop, 3 punten, slotalinea direct onder de punten.
     Bron: dictaat Mohammed 12 okt 2026 (geplakte copy), "## De kracht van onze aanpak". Woordelijk, niets herschreven.
     Per punt: titel = het vetgedrukte deel vóór de dubbele punt, tekst = de rest. Geen lede (de copy heeft er geen).
     Vervangt kop "De mensen op uw werf", lede en de 3 punten uit OverOns.tsx r.25-30 en r.82-83. Foto blijft. */
  aanpak: {
    kop: 'De kracht van onze aanpak',
    punten: [
      { titel: 'Eén hecht team',
        tekst: 'Onze metselaars, dakdekkers, tegelzetters en schrijnwerkers zijn bij ons in vaste dienst. Zij zijn perfect op elkaar ingespeeld en werken met dezelfde hoge kwaliteitsstandaard aan uw woning. U ziet steeds vertrouwde, vriendelijke gezichten op de werf.' },
      { titel: 'Uw persoonlijke werfleider',
        tekst: 'U krijgt één vast aanspreekpunt dat uw project door en door kent. Uw werfleider bewaakt de planning, stuurt het team aan en staat altijd klaar om uw vragen te beantwoorden – van de start tot ver na de oplevering.' },
      { titel: 'Transparantie vanaf de start',
        tekst: 'Onze offertes zijn helder en tot in detail uitgeschreven, zodat u precies weet waar u aan toe bent. Komen er gaandeweg nieuwe ideeën of wensen naar boven? Dan bekijken we die samen en voeren we ze pas uit na uw akkoord.' },
    ],
    slot: 'Of het nu gaat om een vernieuwd interieur, een duurzame gevelrenovatie of een complete totaalrenovatie: wij realiseren uw plannen met zorg en vakmanschap. Vanzelfsprekend bouwt u met volledige zekerheid dankzij onze officiële erkenningen, certificaten en de wettelijke 10-jarige aansprakelijkheid.',
    foto: FOTOPLAN.over.belofte,
  },

  /* waarden-raster (BF "Onze kernwaarden", 2x2 kaarten met nummer en icoon): kop r.94 op één regel,
     lede r.95, ERKENNINGEN r.34-37 (icoon per erkenning zoals icStap in OverOns: woning, attest, garantie, btw) */
  erkend: {
    kop: 'Officieel erkend en verzekerd',
    lede: 'We bouwen op zekerheid, voor u en voor ons.',
    items: [
      { icoon: 'woning', titel: 'Tienjarige aansprakelijkheid', tekst: 'Wettelijke garantie op stabiliteit en waterdichtheid.' },
      { icoon: 'attest', titel: 'EPB-verslaggever in huis', tekst: 'Direct de juiste expertise voor renovaties en nieuwbouw waar een verslag verplicht is.' },
      { icoon: 'helm', titel: 'VCA-gecertificeerd', tekst: 'Veilig werken staat voorop, gecontroleerd en gecertificeerd.' },
      { icoon: 'procent', titel: '6% btw-tarief', tekst: 'Wij zorgen voor de correcte toepassing bij woningen ouder dan tien jaar.' },
    ] as { icoon: 'woning' | 'attest' | 'helm' | 'procent'; titel: string; tekst: string }[],
  },

  /* plaatsblok: kop r.110 (spec §10), tekst r.111; pilknop = die van de home (spec §7.11) */
  plaats: {
    kop: 'Zullen we uw plannen bespreken?',
    tekst: 'We komen graag langs. We luisteren naar uw ideeën, kijken naar de huidige situatie en bespreken eerlijk wat er haalbaar is binnen uw budget. Een eerste gesprek kost u niets.',
    knopKies: HOME_BF.contact.knopKies,
  },

  voet: HOME_BF.voet,
};
