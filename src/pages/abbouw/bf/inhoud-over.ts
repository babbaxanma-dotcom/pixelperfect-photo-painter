/**
 * Tekst en beelden van /over in de stijl van bfbouw.be (spec/bf-stijl.md §10).
 *
 * ALLE tekst komt WOORDELIJK uit src/pages/abbouw/OverOns.tsx (dictaat Mohammed 4 okt 2026,
 * "visueel verbeteren" 5 okt zonder tekstwijziging). Regelnummers hieronder = regels in OverOns.tsx.
 * OverOns.tsx exporteert die lijsten niet en blijft als terugval staan (spec §3); de keuring
 * (werk/over/keur-over.mjs) leest OverOns.tsx en toetst elke zin hier woordelijk tegen de pagina.
 *
 * Volgorde (spec §10, gelijk aan OverOns.tsx): paginakop, cijferband, "Hoe wij werken" met
 * Google-badge, beloftelijst "De mensen op uw werf", waarden-raster "Officieel erkend en
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

  /* duo met Google-badge (BF "Waar wij voor staan"): kop r.65, alinea r.70-73 */
  werken: {
    kop: 'Hoe wij werken',
    alinea: 'Verbouwen is een flinke stap. Daarom werken wij als algemeen aannemer: we nemen het volledige traject op ons. Geen gedoe met het afstemmen van losse vakmannen of onduidelijkheid over wie verantwoordelijk is. Wij voeren de werken uit, sturen de planning aan en leveren af tegen de prijs die we vooraf hebben afgesproken.',
    foto: FOTOPLAN.over.overSplit,
  },

  /* beloftelijst (BF "Wat u van ons mag verwachten", duo--om): kop r.82, lede r.83, punten STRUCTUUR r.25-30 */
  mensen: {
    kop: 'De mensen op uw werf',
    lede: 'Bij een grote verbouwing wisselen verschillende disciplines elkaar af. Om dat soepel te laten verlopen, werken we met een vaste structuur:',
    punten: [
      { titel: 'Vakmensen in vaste dienst',
        tekst: 'Onze metselaars, dakdekkers, tegelzetters en schrijnwerkers horen bij ons vaste team. Daardoor heeft u op de werf steeds vertrouwde gezichten over de vloer die werken volgens onze eigen vaste kwaliteitsstandaarden.' },
      { titel: 'Eén vaste werfleider',
        tekst: 'U hoeft geen zes verschillende mensen na te bellen. U krijgt één direct telefoonnummer. Uw werfleider kent de planning, is vaak aanwezig op de werf en blijft uw vaste aanspreekpunt tot na de oplevering.' },
      { titel: 'Eén prijs, helder uitgesplitst',
        tekst: 'Onze offertes laten precies zien waar u voor betaalt. Elke post (afbraak, materiaal, uitvoering, afvoer) staat apart genoteerd. Mochten er tijdens de werken extra wensen bij komen, dan voeren we die pas uit na uw schriftelijk akkoord op de prijs.' },
    ],
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
