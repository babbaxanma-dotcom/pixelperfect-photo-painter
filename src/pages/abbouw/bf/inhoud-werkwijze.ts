/**
 * Tekst van /werkwijze in de stijl van bfbouw.be (spec/bf-stijl.md §10), WOORDELIJK uit
 * src/pages/abbouw/Werkwijze.tsx (dictaat Mohammed 4 okt 2026, u-vorm), met de regel per blok.
 *
 * Werkwijze.tsx blijft als terugval ongewijzigd staan en exporteert zijn STAPPEN niet;
 * daarom staan de acht stappen hier letterlijk. De keuring (werk/werkwijze/tekst.mjs)
 * vergelijkt ze programmatisch met dat bestand.
 *
 * BF-tegenhanger: /werkwijze/ (bfbouw-website/bouw/paginas.cjs r.181-183):
 * paginakop + procesBlok (build.cjs r.270-279: kop, tekst, knop, foto, stappen) + plaats().
 */
import type { Foto, Stap } from './blokken';
import { HOME_BF, OMSCHRIJVING_STANDAARD } from './inhoud';
import { FOTOPLAN, type KopFoto } from './fotoplan';

export const WERKWIJZE_BF = {
  // SEO (spec §11): Werkwijze.tsx r.114 zet alleen de titel; de beschrijving was die van index.html r.8
  titel: 'Werkwijze · AB Bouw Groep',
  omschrijving: OMSCHRIJVING_STANDAARD,

  /* paginakop: Werkwijze.tsx r.54-56 (h1, subkop) */
  kop: ['Onze werkwijze'] as [string],
  sub: 'Van uw eerste telefoontje tot 10 jaar na oplevering.',
  foto: FOTOPLAN.werkwijze.kop as KopFoto,

  /* traject (BF procesBlok):
     kop  = Werkwijze.tsx r.62, op twee regels zoals de BF-kop van het traject;
     tekst = Werkwijze.tsx r.57 (zijn inleiding; vult het BF-vak proces__tekst);
     knop = Werkwijze.tsx r.59 "Start bij stap 1" (daar naar /contact; hier staat het formulier op
            dezelfde pagina, dus #offerte, zoals de BF-knop van dit blok);
     foto = FOTOPLAN.werkwijze.traject (spec §15: zelfde trajectfoto als de home). */
  traject: {
    kop: ['8 stappen naar een', 'zorgeloze oplevering'],
    tekst: 'Verbouwen brengt vaak stress met zich mee door onduidelijke planningen, onbereikbare aannemers en vage afspraken. Bij AB Bouw Groep doen we daar niet aan mee. Wij werken volgens een transparant stappenplan. Zo weet u op elk moment in het proces exact wat er gebeurt en wanneer u iets van ons mag verwachten.',
    knop: { tekst: 'Start bij stap 1', href: '#offerte' },
    foto: FOTOPLAN.werkwijze.traject as Foto,
    /* De acht stappen: Werkwijze.tsx r.18-33 (titel t, tekst d, tijdregel tag), woordelijk.
       Iconen 1-3, 5 en 7 = dezelfde als de stappen op de home (inhoud.ts STAPICONEN); 4, 6 en 8 = planning,
       controle en garantie (schil.ts ICOON, getekend naar icStap in _rp.ts r.102-110). */
    stappen: [
      { titel: 'Eerste contact', tijd: 'Binnen 1 tot 2 dagen', icoon: 'gesprek',
        tekst: 'U laat uw gegevens achter of belt ons op. We nemen snel contact met u op om uw plannen kort te bespreken en direct een afspraak in te plannen voor een plaatsbezoek.' },
      { titel: 'Plaatsbezoek en technisch advies', tijd: 'Binnen de eerste week', icoon: 'bezoek',
        tekst: 'We komen persoonlijk langs om de situatie op te meten en de bestaande toestand in kaart te brengen. U krijgt ter plaatse al eerlijk, haalbaar advies over welke aanpak technisch en financieel het meest logisch is.' },
      { titel: 'Transparante offerte', tijd: 'Week 2 tot 3', icoon: 'offerte',
        tekst: 'Geen vage totaalbedragen. U ontvangt een uiterst gedetailleerde offerte waarin elke post (materialen, uitvoering, afbraak en afvoer) helder is gesplitst. We nemen deze samen door zodat u exact weet waar uw budget naartoe gaat.' },
      { titel: 'Voorbereiding en planning', tijd: 'Vanaf week 3', icoon: 'planning',
        tekst: 'Na uw akkoord schieten wij in actie. We bestellen de materialen, plannen onze vaste ploegen in en regelen waar nodig de EPB-verslaggeving. Het belangrijkste: u krijgt de exacte startdatum zwart op wit.' },
      { titel: 'Uitvoering van de werken', tijd: 'Duur afhankelijk van het project', icoon: 'werken',
        tekst: 'De werken starten op de afgesproken dag. Onze werfleider bewaakt de planning streng en houdt u op de hoogte van de voortgang. Elke vrijdag ruimen we de werf grondig op, zodat uw huis netjes en veilig het weekend in gaat.' },
      { titel: 'Vooroplevering en controle', tijd: 'De laatste week', icoon: 'controle',
        tekst: 'Voor we de werken definitief afronden, lopen we samen de volledige werf over. We noteren de laatste details op een afwerkingslijst en zorgen dat deze puntjes direct worden opgelost.' },
      { titel: 'Officiële oplevering', tijd: 'De laatste dag', icoon: 'oplevering',
        tekst: 'Het project is afgerond. We overlopen samen het eindresultaat en overhandigen u het complete opleverdossier. Hierin zitten alle attesten, garantiebewijzen en de specificaties van de gebruikte materialen.' },
      { titel: 'Nazorg en garantie', tijd: 'Voor de komende 10 jaar', icoon: 'garantie',
        tekst: 'Onze verantwoordelijkheid stopt niet wanneer we de oprit afrijden. U krijgt 10 jaar wettelijke, schriftelijke garantie op structurele renovaties en daken. Merkt u nadien toch iets op? Eén telefoontje en we komen het oplossen.' },
    ] as Stap[],
  },

  /* plaatsblok: zijn kop "Klaar voor stap 1?" (r.98) is een vraag als kop, dus HOME.contact.kop (spec §10);
     tekst = Werkwijze.tsx r.99 woordelijk */
  plaats: {
    kop: HOME_BF.contact.kop,
    tekst: 'Het plaatsbezoek en de gedetailleerde offerte zijn volledig kosteloos. Daarna beslist u in alle rust of u de samenwerking aangaat.',
    knopKies: HOME_BF.contact.knopKies,
  },

  voet: HOME_BF.voet,
};
