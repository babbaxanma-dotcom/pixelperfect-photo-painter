/**
 * Tekst van de zes afdelingspagina's in de stijl van bfbouw.be (spec/bf-stijl.md §10), met de bron per blok.
 *
 * Alle afdelingstekst komt uit _divisies.ts (DIVISIES): GEÏMPORTEERD, niet gekopieerd, zodat de
 * pagina, de chatkennis (scripts/maak-chat-kennis.mjs) en de guard check-diensten-copy dezelfde
 * tekst lezen. Wat het oude sjabloon (_division.tsx, buildDivisionPage) vast in de markup had,
 * staat hieronder letterlijk met het regelnummer erbij. Beelden: FOTOPLAN (fotoplan.ts, spec §15).
 *
 * Bewust weggelaten (spec §10, aanname A7): de tijdlabels van de processtappen ("binnen 5
 * werkdagen", "meestal 3 tot 10 dagen", ...): daar is geen bron voor. Eyebrows ("Wat wij doen"
 * als label boven een kop) bestaan niet meer: wat iets zegt, is een gewone kop.
 */
import type { DivisionConfig } from '../_division';
import { DIVISIES } from '../_divisies';
import { WERK, type Dienstkaart, type Foto, type Stap } from './blokken';
import type { IcoonNaam } from './schil';
import { HOME_BF } from './inhoud';
import { FOTOPLAN, type DivisieSlug, type KopFoto } from './fotoplan';

/** "Pannen, leien<br/>en platte daken" -> twee kopregels (zoals tweeRegels in _division.tsx r.27-31) */
const regels = (html: string): [string, string?] => {
  const [a, ...rest] = html.split(/<br\s*\/?>/i);
  return rest.length ? [a.trim(), rest.join(' ').trim()] : [a.trim()];
};

/* Stapicoon per positie: _division.tsx r.105 (bezoek, meten, werf, sleutel), in de BF-iconen van schil.ts.
   Stap 2 heet per afdeling "Offerte", "Offerte en stalen", "Ontwerp en offerte" of "Doorrekening": het document. */
const STAPICONEN: IcoonNaam[] = ['bezoek', 'offerte', 'werken', 'oplevering'];

export type DivisieInhoud = {
  slug: DivisieSlug;
  titel: string;
  omschrijving: string;
  kop: { regels: [string, string?]; sub: string; foto: KopFoto | null; knop: string };
  verhaal: { titel: string[]; tekst: string; punten: { titel: string; tekst: string }[]; foto: Foto; icoon: IcoonNaam; knop: string };
  watWijDoen: { kop: string; items: { titel: string; tekst: string }[] };
  traject: { kop: string[]; knop: { tekst: string; href: string }; foto: Foto; stappen: Stap[] };
  vragen: { kop: string; vragen: { v: string; a: string }[] };
  andere: { kop: string; tekst: string; knop: { tekst: string; href: string }; banner: { naam: string; pos?: string }; kaarten: Dienstkaart[] };
  plaats: { standaardWerk: string; kop: string; tekst: string; knopKies: string };
};

export function divisieInhoud(slug: DivisieSlug): DivisieInhoud {
  const c: DivisionConfig | undefined = DIVISIES[slug];
  if (!c) throw new Error('onbekende afdeling: ' + slug);
  // standaardkeuze van het formulier = deze afdeling (spec §8); de titel in _divisies.ts is dezelfde tekst als de keuzelijst
  const werk = WERK.find((w) => w.t === c.title);
  if (!werk) throw new Error('afdeling ' + slug + ' staat niet in de keuzelijst van het formulier: ' + c.title);
  // icoon van de afdeling: hetzelfde als op haar homekaart (één icoon per afdeling over de hele site)
  const kaart = HOME_BF.diensten.kaarten.find((k) => k.href === '/' + slug);
  if (!kaart) throw new Error('geen homekaart voor ' + slug);
  const plan = FOTOPLAN.divisie[slug];
  const andere = FOTOPLAN.andereDiensten(slug);

  return {
    slug,
    /* SEO: dezelfde waarden als nu (spec §11), _division.tsx r.162 en r.165 */
    titel: `${c.title} · AB Bouw Groep`,
    omschrijving: c.meta,

    /* paginakop (spec §10): heroTitle op 2 regels, heroLede (geen kruimelpad: dictaat 11 okt), knoppen "Vraag een plaatsbezoek aan" (HOME.hero.knop) + "Bel 0460 20 77 88" */
    kop: { regels: regels(c.heroTitle), sub: c.heroLede, foto: plan.kop, knop: HOME_BF.hero.knop },

    /* dienstrij met het verhaal + 3 features (_division.tsx r.55-71): kop storyTitle, tekst storyLede,
       punten "<b>t.</b> d" zoals r.66. Knop = BF-dienstrij (paginas.cjs r.172) met de tablabel van het formulier (spec §8). */
    verhaal: {
      // de regelbreuk van de bron blijft ("Isolatie en afwerking<br/>in één werf"), zoals bij de h1 en de trajectkop
      titel: regels(c.storyTitle).filter((s): s is string => !!s),
      tekst: c.storyLede,
      punten: c.features.map((f) => ({ titel: f.t, tekst: f.d })),
      foto: plan.rij,
      icoon: kaart.icoon,
      knop: 'Offerte aanvragen',
    },

    /* waarden-raster "Wat wij doen" (spec §10; _division.tsx r.77), 3 tegels whatWeDo (r.82-88) */
    watWijDoen: { kop: 'Wat wij doen', items: c.whatWeDo.map((w) => ({ titel: w.t, tekst: w.d })) },

    /* traject 4 stappen ZONDER tijdlabels (spec §10, A7): kop r.97, knop r.99, stappen r.102-112 zonder s.time */
    traject: {
      kop: ['Van offerte', 'tot oplevering'],
      knop: { tekst: 'Volledige werkwijze', href: '/werkwijze' },
      foto: plan.traject,
      stappen: c.process.map((s, i) => ({ titel: s.t, tekst: s.d, icoon: STAPICONEN[i] ?? 'werken' })),
    },

    /* FAQ (4): kop r.122 op één regel, vragen r.126-130 */
    vragen: { kop: 'Wat klanten ons het vaakst vragen', vragen: c.faqs.map((f) => ({ v: f.q, a: f.a })) },

    /* "Andere diensten" (spec §10): dienstenslider met de 5 andere afdelingen = hun homekaart (tekst HOME, foto
       FOTOPLAN.andereDiensten), rechts de zin en de knop van de home (dictaat /diensten, Diensten.tsx r.97) */
    andere: { kop: 'Andere diensten', tekst: HOME_BF.diensten.tekst, knop: HOME_BF.diensten.knop, banner: andere.banner, kaarten: andere.kaarten },

    /* plaatsblok (spec §8, §10): standaardkeuze = deze afdeling. Kop: "Plannen voor …?" (r.143) is een vraag
       als kop, dus HOME.contact.kop zoals /werkwijze; tekst r.144 woordelijk. */
    plaats: {
      standaardWerk: werk.t,
      kop: HOME_BF.contact.kop,
      tekst: 'We komen langs, meten op en bezorgen u een offerte waarin elke post apart staat. Het plaatsbezoek is vrijblijvend.',
      knopKies: HOME_BF.contact.knopKies,
    },
  };
}

