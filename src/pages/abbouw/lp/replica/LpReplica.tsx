/**
 * Landingspagina totaalrenovatie — replica van de referentie in Downloads.
 *
 * De opzet, de maten en de plaatsing komen uit een pixelmeting van die
 * referentie (1200x8408). De inhoud, de kleuren en de foto's zijn van AB Bouw.
 * Waar de referentie iets Amerikaans toont (financieringsdeals, Angi-awards,
 * dollarbedragen) houdt de replica de VORM en vervangt hij de INHOUD door het
 * Vlaamse equivalent; die keuzes staan per plek in commentaar.
 *
 * Deze pagina staat naast LpDienst.tsx en raakt de andere dertien pagina's niet.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTACT } from '@/data/contact';
import { submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { DIENSTEN } from '../LpDienst';
import { REPLICA_CSS } from './stijl';
import {
  IcBericht, IcChevron, IcFacebook, IcLinkedIn, IcMail, IcPersoon, IcPijl,
  IcPin, IcSter, IcTelefoon, IcX, IcYouTube, IcZonnestraal,
  IcBoog, IcStapBel, IcStapBezoek, IcStapMeten, IcStapOplevering, IcStapWerf,
} from './Iconen';

import logo from '@/assets/home/logo-trim.png';
import heroFoto from '@/assets/lp-diensten/totaalrenovatie-hero.jpg';
import overFoto from '@/assets/lp-diensten/totaalrenovatie-g1.jpg';
import glyph1 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p1-a.jpg';
import glyph2 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p1-b.jpg';
import glyph3 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p2-a.jpg';
import glyph4 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p2-b.jpg';
import dienstenBg from '@/assets/lp-diensten/totaalrenovatie-g2.jpg';
import kaartRuwbouw from '@/assets/bad/ruwbouw.jpg';
import kaartTechnieken from '@/assets/construct/technieken.jpg';
import kaartPleister from '@/assets/interieur/gyproc.jpg';
import kaartTegel from '@/assets/bad/tegelwerk.jpg';
import kaartSanitair from '@/assets/bad/sanitair.jpg';
import aanbod1 from '@/assets/lp-diensten/totaalrenovatie-steps.jpg';
import aanbod2 from '@/assets/lp-diensten/terras-g1.jpg';
import aanbod3 from '@/assets/lp-diensten/pleisterwerk-g2.jpg';
import aanbod4 from '@/assets/lp-diensten/oprit-g2.jpg';
import contactFoto from '@/assets/lp-diensten/totaalrenovatie-what.jpg';
import eindFoto from '@/assets/lp-diensten/tegelwerken-hero.jpg';
import cirkelFoto from '@/assets/lp-diensten/badkamer-hero.jpg';
import merkWienerberger from '@/assets/merken/Wienerberger-donker.png';
import merkKoramic from '@/assets/merken/Koramic-donker.png';
import merkVelux from '@/assets/merken/Velux-donker.png';
import merkRockpanel from '@/assets/merken/rockpanel-donker.png';

/**
 * De merken waarmee AB werkt. Alleen logo's die in de repo staan én al elders
 * op de site gebruikt worden (LpDienst, LpDakwerken): dat zijn geverifieerde
 * leveranciers, geen namen die ik erbij zet.
 *
 * De vier uit src/assets/merken staan als -donker-variant in de lijst: de
 * bestanden zonder achtervoegsel zijn wit (gemeten helderheid 255) en dus voor
 * een donkere ondergrond; deze rail staat op wit.
 */
const MERKEN = [
  { src: merkWienerberger, alt: 'Wienerberger' },
  { src: merkKoramic, alt: 'Koramic' },
  { src: merkRockpanel, alt: 'Rockpanel' },
  { src: merkVelux, alt: 'Velux' },
  { src: '/assets/logos/knauf.png', alt: 'Knauf' },
  { src: '/assets/logos/isover.png', alt: 'Isover' },
  { src: '/assets/logos/eternit.png', alt: 'Eternit' },
  { src: '/assets/logos/caparol.png', alt: 'Caparol' },
  { src: '/assets/logos/dorken.png', alt: 'Dörken' },
  { src: '/assets/logos/isoproc.png', alt: 'Isoproc' },
  { src: '/assets/logos/mato.png', alt: 'Mato' },
  { src: '/assets/logos/rectic.png', alt: 'Recticel' },
];

/** Elke glyph van "120+" krijgt een eigen foto, net als de drie in de referentie. */
const GETAL_GLYPHS = [
  { teken: '1', foto: glyph1 }, { teken: '2', foto: glyph2 },
  { teken: '0', foto: glyph3 }, { teken: '+', foto: glyph4 },
];
/** De zes divisies van AB Bouw Groep. */
const DIVISIES = ['AB Construct', 'AB Dakwerken', 'AB Gevelbekleding',
  'AB Interieurwerken', 'AB Bad & Wellness', 'AB Ecologisch'];

/**
 * De reviews komen uit LpDienst.tsx, waar ze al voor de live site staan.
 * Hier geen nieuwe schrijven: klantbeoordelingen verzinnen mag niet, en twee
 * verschillende versies van dezelfde review op één site is ook fout.
 */
const REVIEWS = DIENSTEN.totaalrenovatie.reviews;

/** De opties uit de keuzelijst, gelijk aan die van de bestaande LP. */
const SOORT_WERK = DIENSTEN.totaalrenovatie.typeWerkOpties;

type Dienstkaart = { titel: string; tekst: string; foto: string; alt: string; href: string };

/**
 * De vijf kaarten: de ONDERDELEN van één totaalrenovatie, in de volgorde
 * waarin ze op de werf gebeuren — strippen, technieken, pleisteren, tegelen,
 * afwerken. Geen dienstenmenu: "Totaalrenovatie" naast "Badkamer" en "Oprit"
 * zetten leest als vijf losse opdrachten en spreekt de hele pagina tegen.
 *
 * De referentie laat drie van de vijf kaarten op dezelfde formule draaien
 * ("laat je X weg, dan gaat Y mis"). Die vorm staat hier nog maar op één kaart.
 */
const DIENSTKAARTEN: Dienstkaart[] = [
  { titel: 'Afbraak en ruwbouw', href: '#contact',
    tekst: 'Muren weg, nieuwe openingen, oude vloer eruit. Wat blijft staan wordt eerst ondersteund.',
    foto: kaartRuwbouw, alt: 'Gestripte ruimte tijdens de afbraak, leidingen zichtbaar' },
  { titel: 'Technieken', href: '#contact',
    tekst: 'Water, afvoer en elektriciteit gaan de muur in voordat er gepleisterd wordt.',
    foto: kaartTechnieken, alt: 'Nieuwe leidingen ingewerkt in de muur' },
  { titel: 'Pleisterwerk en gyproc', href: '#contact',
    tekst: 'Wanden en plafonds vlak en recht, klaar om te schilderen.',
    foto: kaartPleister, alt: 'Ruimte met geplaatste gyprocwanden, klaar om te pleisteren' },
  { titel: 'Vloeren en tegelwerk', href: '#contact',
    tekst: 'Eerst een vlakke, droge ondergrond. Tegels die daar niet op liggen, komen later los.',
    foto: kaartTegel, alt: 'Tegelzetter aan het werk' },
  { titel: 'Badkamer en sanitair', href: '#contact',
    tekst: 'Douche, bad, kranen en alles wat erachter zit.',
    foto: kaartSanitair, alt: 'Afgewerkte badkamer met nieuw sanitair' },
];

type Aanbodkaart = { badge: [string, string]; titel: string; tekst: string; foto: string; alt: string; knop: string; href: string };

/**
 * De aanbodkaarten. De referentie toont hier Amerikaanse financieringsdeals
 * ("$0 Payment", "$45/Month"): een aanbod dat AB niet doet en dat hier dus een
 * verzonnen belofte zou zijn. De VORM blijft — sticker met twee regels, titel,
 * subtitel, één gevulde en drie omlijnde knoppen — en de INHOUD wordt wat er
 * bij een Vlaamse renovatie echt vastligt.
 */
const AANBOD: Aanbodkaart[] = [
  { badge: ['6%', 'btw'], titel: '6% btw in plaats van 21%',
    tekst: 'Bij een woning ouder dan tien jaar.', knop: 'Bekijk of uw woning telt',
    href: '#contact', foto: aanbod1, alt: 'Afgewerkte woonkamer na renovatie' },
  { badge: ['5', 'werkdagen'], titel: 'Plaatsbezoek binnen vijf werkdagen',
    tekst: "Opmeten, foto's van de opbouw, knelpunten.", knop: 'Gratis offerte',
    href: '#contact', foto: aanbod2, alt: 'Terras aan een gerenoveerde woning' },
  { badge: ['Eigen', 'ploeg'], titel: 'Eigen ploeg op de werf',
    tekst: 'Dezelfde mensen, elke dag.', knop: 'Gratis offerte',
    href: '#contact', foto: aanbod3, alt: 'Gepleisterde ruimte tijdens de afwerking' },
  { badge: ['VCA', 'attest'], titel: 'VCA-gecertificeerd en verzekerd',
    tekst: 'Attest en polis op aanvraag.', knop: 'Gratis offerte',
    href: '#contact', foto: aanbod4, alt: 'Nieuwe oprit in klinkers' },
];

/**
 * De realisatiefoto's, per dienst opgehaald uit de map zelf.
 *
 * Met een glob in plaats van 32 losse imports: zo kan er geen foto twee keer in
 * een tabblad belanden en groeit de lijst mee als er beelden bijkomen. De
 * sleutel is de bestandsnaam, bijvoorbeeld "badkamer-p1-a".
 */
const REALISATIES = import.meta.glob('../../../../assets/lp-diensten/realisaties/*.jpg', {
  eager: true, import: 'default',
}) as Record<string, string>;

const beeld = (naam: string) => {
  const treffer = Object.entries(REALISATIES).find(([pad]) => pad.endsWith(`/${naam}.jpg`));
  if (!treffer) throw new Error(`realisatiefoto ontbreekt: ${naam}.jpg`);
  return treffer[1];
};

/**
 * De vier tabbladen boven het fotoraster. Ze filteren op DEEL VAN DE WONING,
 * niet op dienst: "Renovatie" als tabblad naast "Badkamer" leest weer als een
 * menu van losse opdrachten, en dat is precies wat deze pagina niet is.
 * Elk tabblad heeft acht eigen werffoto's — geen enkele foto komt twee keer op
 * de pagina voor, ook niet in de cijfers of de cirkels hierboven.
 */
const WERK_TABS = [
  { label: 'Hele woning', alt: 'Volledig gerenoveerde woning door AB Bouw Groep', beelden: [
    'totaalrenovatie-p3-a', 'totaalrenovatie-p1-c', 'totaalrenovatie-p3-b', 'totaalrenovatie-p2-c',
    'totaalrenovatie-p3-c', 'pleisterwerk-p1-a', 'pleisterwerk-p1-b', 'pleisterwerk-p2-a'] },
  { label: 'Badkamer', alt: 'Uitgevoerde badkamerrenovatie door AB Bouw Groep', beelden: [
    'badkamer-p1-a', 'badkamer-p1-b', 'badkamer-p1-c', 'badkamer-p2-a',
    'badkamer-p2-b', 'badkamer-p2-c', 'badkamer-p3-a', 'badkamer-p3-b'] },
  { label: 'Tegelwerk', alt: 'Uitgevoerd tegelwerk door AB Bouw Groep', beelden: [
    'tegelwerken-p1-a', 'tegelwerken-p1-b', 'tegelwerken-p1-c', 'tegelwerken-p2-a',
    'tegelwerken-p2-b', 'tegelwerken-p2-c', 'tegelwerken-p3-a', 'tegelwerken-p3-b'] },
  { label: 'Terras', alt: 'Uitgevoerde terrasaanleg door AB Bouw Groep', beelden: [
    'terras-p1-a', 'terras-p1-b', 'terras-p1-c', 'terras-p2-a',
    'terras-p2-b', 'terras-p2-c', 'terras-p3-a', 'terras-p3-b'] },
];

/**
 * De vijf stappen. De referentie zet er keukenapparaten bij (dampkap, fornuis,
 * broodrooster); hier staat bij elke stap het gereedschap dat er echt aan te
 * pas komt. De teksten noemen elk iets anders: staan er drie keer dezelfde
 * belofte in, dan leest het als een sjabloon.
 */
const STAPPEN = [
  { titel: 'U doet een aanvraag', Icoon: IcStapBel,
    tekst: 'Vul het formulier in met uw postcode en wat u wil veranderen. Een foto van de ruimte helpt. Bellen mag ook.' },
  { titel: 'Gratis plaatsbezoek', Icoon: IcStapBezoek,
    tekst: 'Meestal binnen vijf werkdagen staat er iemand bij u thuis. Die bekijkt de ruimte en zegt meteen wat er mogelijk is.' },
  { titel: 'Opmeten en offerte', Icoon: IcStapMeten,
    tekst: 'U krijgt de volledige prijs op papier, met per onderdeel wat erin zit. Is uw woning ouder dan tien jaar, dan geldt 6% btw.' },
  { titel: 'De werf start', Icoon: IcStapWerf,
    tekst: 'Dezelfde mensen komen elke dag terug. Wij schermen de rest van de woning af tegen stof en ruimen elke avond op.' },
  { titel: 'De laatste ronde', Icoon: IcStapOplevering,
    tekst: 'We lopen samen alles na. Wat u aanduidt, brengen we in orde voordat de laatste man vertrekt.' },
];

const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Over ons', href: '#over' },
  { label: 'Diensten', href: '#diensten', chevron: true },
  { label: 'Aanpak', href: '#werkwijze' },
  { label: 'Contact', href: '#contact' },
];

/**
 * De vier socialcirkels linksboven in de referentie.
 *
 * Deze lijst is LEEG en dat is een keuze: er staat in de hele codebase geen
 * enkele geverifieerde profiel-URL van AB Bouw Groep, en een verzonnen
 * facebook.com/... zou bezoekers naar een 404 sturen. Zodra Mohammed de echte
 * adressen doorgeeft, komen ze hier en verschijnt de rij vanzelf op de plek uit
 * de referentie: eerste cirkel accentgevuld, daarna drie in #f3f4ef.
 */
const SOCIAAL_ICOON = { facebook: IcFacebook, linkedin: IcLinkedIn, youtube: IcYouTube, x: IcX };
const SOCIALS: { naam: keyof typeof SOCIAAL_ICOON; href: string }[] = [];

/** De vier velden van de balk onder de hero, in de volgorde van de referentie. */
const BALKVELDEN = [
  { naam: 'naam', plaats: 'Naam', type: 'text', icoon: IcPersoon, autoComplete: 'name' },
  { naam: 'telefoon', plaats: 'Telefoon', type: 'tel', icoon: IcTelefoon, autoComplete: 'tel' },
  { naam: 'email', plaats: 'E-mail', type: 'email', icoon: IcMail, autoComplete: 'email' },
  { naam: 'bericht', plaats: 'Bericht', type: 'text', icoon: IcBericht, autoComplete: 'off' },
] as const;

export default function LpReplica() {
  const navigate = useNavigate();
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const startGemeld = useRef(false);
  const [tab, setTab] = useState(0);
  const reviewSpoor = useRef<HTMLDivElement>(null);
  const aanbodSpoor = useRef<HTMLDivElement>(null);
  const [reviewPos, setReviewPos] = useState({ links: 0, max: 1 });
  const [aanbodPos, setAanbodPos] = useState({ links: 0, max: 1 });
  /** Hoeveel er per klik opschuift: de breedte van één kaart plus de goot. */
  const stapVan = (el: HTMLElement) => (el.firstElementChild?.getBoundingClientRect().width ?? 300) + 25;
  const schuif = (ref: React.RefObject<HTMLDivElement>, richting: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: Math.max(0, el.scrollLeft + richting * stapVan(el)) });
  };
  const volgStand = (el: HTMLElement, zet: (p: { links: number; max: number }) => void) =>
    zet({ links: el.scrollLeft, max: Math.max(1, el.scrollWidth - el.clientWidth) });

  useEffect(() => { document.title = 'Totaalrenovatie in heel Vlaanderen — AB Bouw Groep'; }, []);

  const meldStart = () => {
    if (startGemeld.current) return;
    startGemeld.current = true;
    trackFormStart('lp:replica:balk');
  };

  /** De uitgebreide contactvorm onderaan; dezelfde pijplijn als de balk boven. */
  const verstuurContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    const telefoon = String(f.get('telefoon') || '').trim();
    if (!email && !telefoon) { setFout('Vul een e-mailadres of een telefoonnummer in.'); return; }
    setFout(null);
    setBezig(true);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: 'ab_construct',
      firstName: String(f.get('voornaam') || '').trim() || undefined,
      lastName: String(f.get('achternaam') || '').trim() || undefined,
      email,
      phone: telefoon || undefined,
      type_werk: 'ab_construct',
      aanvullende_info: [String(f.get('soortwerk') || '').trim(), String(f.get('bericht') || '').trim()]
        .filter(Boolean).join(' — ') || undefined,
      bron_lead: 'lp:totaalrenovatie:contact',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=totaalrenovatie');
    else setFout('Versturen lukte niet. Bel gerust ' + CONTACT.phone.display + '.');
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    const telefoon = String(f.get('telefoon') || '').trim();
    if (!email && !telefoon) { setFout('Vul een e-mailadres of een telefoonnummer in.'); return; }
    setFout(null);
    setBezig(true);
    const naam = String(f.get('naam') || '').trim();
    const [voor, ...rest] = naam.split(' ').filter(Boolean);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: 'ab_construct',
      firstName: voor || undefined,
      lastName: rest.join(' ') || undefined,
      email,
      phone: telefoon || undefined,
      type_werk: 'ab_construct',
      aanvullende_info: String(f.get('bericht') || '').trim() || undefined,
      bron_lead: 'lp:totaalrenovatie:balk',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=totaalrenovatie');
    else setFout('Versturen lukte niet. Bel gerust ' + CONTACT.phone.display + '.');
  };

  return (
    <div className="pcx" id="top">
      <style dangerouslySetInnerHTML={{ __html: REPLICA_CSS }} />

      {/* ── Hero met de kop erover. De foto begint op y=0 en loopt onder de
           kop door; een wegvallende witte sluier maakt de kop leesbaar. ── */}
      <section className="pc-hero">
        <div className="pc-hero-vlak" />
        <div className="pc-hero-foto">
          <img src={heroFoto} alt="Woonkamer en keuken na een totaalrenovatie door AB Bouw Groep" />
        </div>
        <div className="pc-hero-sluier" />

        <header className="pc-kop">
          <div className="pc-vat pc-kop-vat">
            <div className="pc-kop-logo">
              <a href="/"><img src={logo} alt="AB Bouw Groep" /></a>
            </div>
            <div className="pc-kop-streep" />

            <div className="pc-kop-midden">
              <div className="pc-kop-rij1">
                {SOCIALS.length > 0 && (
                  <div className="pc-soc">
                    {SOCIALS.map(({ naam, href }) => {
                      const Icoon = SOCIAAL_ICOON[naam];
                      return <a key={naam} href={href} aria-label={naam} target="_blank" rel="noopener noreferrer"><Icoon /></a>;
                    })}
                  </div>
                )}
                <div className="pc-kop-contact">
                  <span><IcPin />{CONTACT.address.street}, {CONTACT.address.city}</span>
                  <span><IcMail /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
                </div>
              </div>

              <div className="pc-kop-rij2">
                <nav className="pc-nav">
                  {NAV.map((n) => (
                    <a key={n.label} href={n.href}>{n.label}{n.chevron && <IcChevron />}</a>
                  ))}
                </nav>
                <a className="pc-knop pc-knop--donker" href="#contact" style={{ marginLeft: 'auto' }}>
                  Gratis offerte<IcPijl />
                </a>
              </div>
            </div>

            <div className="pc-kop-streep" />
            <div className="pc-kop-tel">
              <span className="pc-teltegel"><IcTelefoon /></span>
              <span className="pc-telblok">
                <span className="pc-tellabel">Bel ons vandaag</span>
                <a className="pc-telnr" href={CONTACT.phone.href}>{CONTACT.phone.display}</a>
              </span>
            </div>
          </div>
        </header>

        <div className="pc-vat pc-hero-vat">
          {/* De referentie zet 'New' in de pil: een nieuwheidsclaim die voor AB
              niet klopt. De pil is eruit; de chip noemt de dienst en het
              werkgebied, zodat er informatie staat en geen kaal opschrift. */}
          <span className="pc-chip">Totaalrenovatie in heel Vlaanderen<IcChevron richting="rechts" /></span>
          <h1 className="pc-h1">Uw partner voor<br />totaalrenovatie<br />van A tot Z</h1>
          <a className="pc-knop pc-knop--accent" href="#contact">Plan gratis plaatsbezoek<IcPijl /></a>
        </div>

        <div className="pc-scroll">
          <button type="button" aria-label="Terug naar boven"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><IcChevron richting="boven" /></button>
          <button type="button" className="is-accent" aria-label="Naar de diensten"
            onClick={() => document.getElementById('diensten')?.scrollIntoView({ behavior: 'smooth' })}>
            <IcChevron richting="onder" />
          </button>
        </div>
      </section>

      {/* ── Formulierbalk die over de onderrand van de hero valt ── */}
      <div className="pc-vat pc-balk">
        <form onSubmit={verstuur} onFocusCapture={meldStart}>
          {BALKVELDEN.map((v) => {
            const Icoon = v.icoon;
            return (
              <label key={v.naam} className="pc-veld">
                <Icoon />
                <input name={v.naam} type={v.type} placeholder={v.plaats}
                  autoComplete={v.autoComplete} aria-label={v.plaats} />
              </label>
            );
          })}
          <button className="pc-knop pc-knop--accent" type="submit" disabled={bezig}>
            {bezig ? 'Bezig…' : 'Verstuur'}<IcPijl />
          </button>
        </form>
        {fout && <p className="pc-balk-fout">{fout}</p>}
      </div>

      {/* ── Over ons ── */}
      <section className="pc-over" id="over">
        <div className="pc-vat pc-over-grid">
          <div>
            {/* De referentie zet 'About Us ›' boven de kop. Een opschrift dat
                alleen navertelt waar het blok over gaat is de AI-tell die
                Mohammed al eerder aanwees; de chip houdt zijn vorm en krijgt
                een getal dat ergens over gaat. */}
            <span className="pc-chip--vlak">6 divisies<IcChevron richting="rechts" /></span>
            <h2 className="pc-h2">Eén vaste ploeg voor uw<br />hele renovatie</h2>
            <a className="pc-knop pc-knop--accent pc-over-knop" href={CONTACT.phone.href}>
              Bel {CONTACT.phone.display}<IcPijl />
            </a>
          </div>

          <div>
            <div className="pc-getal">
              {GETAL_GLYPHS.map(({ teken, foto }, i) => (
                <span key={i} style={{ backgroundImage: `url(${foto})` }}>{teken}</span>
              ))}
            </div>
            <p className="pc-getal-label">Realisaties</p>
          </div>

          <div className="pc-rij2 pc-over-foto">
            <img src={overFoto} alt="Afgewerkte leefruimte na een totaalrenovatie door AB Bouw Groep" loading="lazy" />
            <div className="pc-score">
              <div className="pc-score-sterren">
                {[0, 1, 2, 3, 4].map((i) => <IcSter key={i} />)}
              </div>
              <div className="pc-score-cijfer">4,9</div>
              <div className="pc-score-bij">Google-score</div>
            </div>
          </div>

          <div className="pc-rij2 pc-over-tekst">
            <p>
              Geen enkele renovatie loopt precies zoals op papier. Achter een muur zit een leiding
              die niemand verwachtte, een vloer blijkt niet vlak, een deur sluit niet meer. Wie daar
              vooraf ruimte voor laat, houdt de planning overeind.
            </p>
            {/* De zes divisies stonden in één doorlopende zin. Als lijst is in
                één oogopslag te zien wat er onder één dak zit. */}
            <ul className="pc-divisies">
              {DIVISIES.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <p className="pc-over-slot">
              Bij een totaalrenovatie werken die zes op dezelfde werf, volgens dezelfde planning.
            </p>
          </div>
        </div>
      </section>

      {/* ── Diensten: donkere sectie met vijf getrapte fotokaarten ── */}
      <section className="pc-diensten" id="diensten">
        <div className="pc-diensten-bg">
          <img src={dienstenBg} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="pc-vat">
          <div className="pc-midden">
            <span className="pc-chip--donker">5 onderdelen<IcChevron richting="rechts" /></span>
            <h2 className="pc-h2--donker">Wat er in een<br />totaalrenovatie zit</h2>
          </div>

          <div className="pc-kaarten">
            <div className="pc-kaarten-kolom">
              <Kaart {...DIENSTKAARTEN[0]} hoogte={226} />
              <Kaart {...DIENSTKAARTEN[1]} hoogte={335} />
            </div>
            <div className="pc-kaarten-kolom">
              <Kaart {...DIENSTKAARTEN[2]} hoogte={585} gevuld />
            </div>
            <div className="pc-kaarten-kolom">
              <Kaart {...DIENSTKAARTEN[3]} hoogte={334} />
              <Kaart {...DIENSTKAARTEN[4]} hoogte={227} />
            </div>
          </div>

          <div className="pc-midden">
            <p className="pc-diensten-slot">
              Alle vijf de onderdelen lopen via dezelfde planning en dezelfde mensen op de werf.
            </p>
          </div>
        </div>
      </section>

      {/* ── Aanbod: kaartenspoor dat rechts uit beeld loopt ── */}
      <section className="pc-aanbod">
        <div className="pc-vat">
          <h2 className="pc-h2--midden">Wat er nu geldt</h2>
          <p className="pc-aanbod-sub">Vier dingen die vastliggen voordat u tekent.</p>
        </div>
        <div className="pc-spoor" ref={aanbodSpoor}
          onScroll={(e) => volgStand(e.currentTarget, setAanbodPos)}>
          {AANBOD.map((k, i) => <SpoorKaart key={k.titel} {...k} gevuld={i === 0} />)}
        </div>
        <Bediening spoor={aanbodSpoor} pos={aanbodPos} schuif={schuif} wat="kaart" />
      </section>

      {/* ── Marquee-band. De referentie herhaalt hier een telefoonoproep;
           het spoor staat twee keer in de DOM zodat de lus naadloos is. ── */}
      <div className="pc-marquee" aria-hidden="true">
        <div className="pc-marquee-spoor">
          {[0, 1].map((lus) => (
            <div key={lus} style={{ display: 'flex' }}>
              {[0, 1, 2, 3].map((i) => (
                <div className="pc-marquee-eenheid" key={i}>
                  <IcTelefoon />
                  <span>Bel ons vandaag — {CONTACT.phone.spaced}</span>
                  <span className="pc-marquee-punt" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Werkwijze: vijf stappen in 3 + 2 ── */}
      <section className="pc-werkwijze" id="werkwijze">
        <div className="pc-vat pc-midden">
          <span className="pc-chip--vlak">5 stappen<IcChevron richting="rechts" /></span>
          <h2 className="pc-h2--midden">Wat er gebeurt nadat<br />u een aanvraag indient</h2>
        </div>
        <div className="pc-stappen">
          {/* De bogen staan absoluut: hun plek komt uit de gemeten
              tussenruimtes tussen de cirkels, niet uit de rasterstroom. */}
          <span className="pc-boog" style={{ left: 249, top: 12 }}><IcBoog /></span>
          <span className="pc-boog" style={{ left: 601, top: 11 }}><IcBoog bol /></span>
          <span className="pc-boog" style={{ left: 430, top: 227 }}><IcBoog /></span>
          <div className="pc-stappen-rij">
            {STAPPEN.slice(0, 3).map((s, i) => <Stap key={s.titel} {...s} nr={i + 1} actief={i === 1} />)}
          </div>
          <div className="pc-stappen-rij pc-stappen-rij--twee">
            {STAPPEN.slice(3).map((s, i) => <Stap key={s.titel} {...s} nr={i + 4} />)}
          </div>
        </div>
      </section>

      {/* ── Ons werk: tabbalk met vier werkende filters en een fotoraster ── */}
      <section className="pc-werk">
        <div className="pc-vat pc-midden">
          <h2 className="pc-h2--midden">Uitgevoerd werk</h2>
          <div className="pc-tabs" role="tablist" aria-label="Soort werk">
            {WERK_TABS.map((t, i) => (
              <button key={t.label} type="button" role="tab" aria-selected={i === tab}
                onClick={() => setTab(i)}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="pc-vat" role="group" aria-label={WERK_TABS[tab].alt}>
          <div className="pc-werk-rij1">
            {WERK_TABS[tab].beelden.slice(0, 3).map((n) => (
              <img key={n} src={beeld(n)} alt="" loading="lazy" />
            ))}
          </div>
          <div className="pc-werk-rij2">
            <div className="pc-werk-groot">
              <img src={beeld(WERK_TABS[tab].beelden[3])} alt="" loading="lazy" />
            </div>
            <div className="pc-werk-klein">
              {WERK_TABS[tab].beelden.slice(4, 6).map((n) => (
                <img key={n} src={beeld(n)} alt="" loading="lazy" />
              ))}
            </div>
            <div className="pc-werk-klein">
              {WERK_TABS[tab].beelden.slice(6, 8).map((n) => (
                <img key={n} src={beeld(n)} alt="" loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Keurmerken: waar we mee bouwen ── */}
      <section className="pc-merken">
        <div className="pc-vat pc-midden">
          <h2 className="pc-h2--midden">Waar we mee bouwen</h2>
          <p className="pc-merken-sub">
            Een goede verbouwing begint bij het materiaal.
          </p>
          {/* Vier merken, niet zes: dat zijn de logo's die in de repo staan.
              Een VCA-beeldmerk erbij tekenen zou een keurmerk verzinnen. */}
          <div className="pc-merkenrail" aria-label="Merken waarmee we werken">
            <div className="pc-merkenrail-spoor">
              {[0, 1].map((lus) => (
                <div className="pc-merkenrail-rij" key={lus} aria-hidden={lus === 1}>
                  {MERKEN.map((m) => <img key={m.alt} src={m.src} alt={m.alt} loading="lazy" />)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews: scoreblok links, kaartenspoor rechts ── */}
      <section className="pc-reviews">
        <div className="pc-vat pc-midden">
          <span className="pc-chip--rand">4,9<IcChevron richting="rechts" /></span>
          <h2 className="pc-h2--groot">Wat klanten schrijven</h2>
        </div>
        <div className="pc-vat pc-reviews-blok">
          <div className="pc-score-kolom">
            {/* De referentie zet 'EXCELLENT' in kapitalen. Zo'n all-caps
                mini-opschrift is precies de tell die Mohammed heeft verbannen. */}
            <div className="pc-score-woord">Uitstekend</div>
            <div className="pc-score-rij">{[0, 1, 2, 3, 4].map((i) => <IcSter key={i} />)}</div>
            <div className="pc-score-onder">Gemiddeld 4,9 van 5</div>
            {/* Als woord, niet als logo: het Google-beeldmerk staat niet in de
                repo en een nagetekend merk is een nagemaakt merk. */}
            <div className="pc-score-bron">Google</div>
          </div>
          <div className="pc-review-spoor" ref={reviewSpoor}
            onScroll={(e) => volgStand(e.currentTarget, setReviewPos)}>
            {REVIEWS.map((r) => (
              <article className="pc-review" key={r.name}>
                <div className="pc-review-sterren">{[0, 1, 2, 3, 4].map((i) => <IcSter key={i} />)}</div>
                <p>{r.text}</p>
                <div className="pc-review-lijn" />
                <div className="pc-review-voet">
                  <span className="pc-review-avatar">{r.name.charAt(0)}</span>
                  <span>
                    <span className="pc-review-naam">{r.name}</span>
                    <span className="pc-review-rol">{r.role}</span>
                  </span>
                  <span className="pc-review-bron" title="Beoordeling op Google">G</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <Bediening spoor={reviewSpoor} pos={reviewPos} schuif={schuif} wat="review" />
      </section>

      {/* ── Contact ── */}
      <section className="pc-contact" id="contact">
        <div className="pc-vat pc-midden">
          <span className="pc-chip--vlak">{CONTACT.phone.display}<IcChevron richting="rechts" /></span>
          <h2 className="pc-h2--groot">Vraag een plaatsbezoek</h2>
        </div>
        <div className="pc-vat">
          <div className="pc-info">
            <div className="pc-info-kaart">
              <span className="pc-info-cirkel"><IcTelefoon /></span>
              <div><h3>Telefoon</h3><p><a href={CONTACT.phone.href}>{CONTACT.phone.spaced}</a></p></div>
            </div>
            <div className="pc-info-kaart">
              <span className="pc-info-cirkel"><IcPin /></span>
              <div><h3>Werkgebied</h3><p>Heel Vlaanderen</p></div>
            </div>
            <div className="pc-info-kaart">
              <span className="pc-info-cirkel"><IcMail /></span>
              <div><h3>Adres</h3><p>{CONTACT.address.street}<br />{CONTACT.address.postcode} {CONTACT.address.city}</p></div>
            </div>
          </div>

          <div className="pc-contact-rij">
            <form className="pc-form" onSubmit={verstuurContact} onFocusCapture={meldStart}>
              <h3>Zeg wat er moet gebeuren</h3>
              <p className="pc-form-sub">Vul in wat u weet, ook als het nog niet vastligt.</p>
              <div className="pc-form-paar">
                <label className="pc-form-veld"><span>Voornaam</span>
                  <input name="voornaam" placeholder="Voornaam" autoComplete="given-name" /></label>
                <label className="pc-form-veld"><span>Achternaam</span>
                  <input name="achternaam" placeholder="Achternaam" autoComplete="family-name" /></label>
              </div>
              <div className="pc-form-paar">
                <label className="pc-form-veld"><span>Telefoon</span>
                  <input name="telefoon" type="tel" placeholder="Telefoon" autoComplete="tel" /></label>
                <label className="pc-form-veld"><span>E-mail</span>
                  <input name="email" type="email" placeholder="E-mail" autoComplete="email" /></label>
              </div>
              <label className="pc-form-veld pc-form-enkel"><span>Soort werk</span>
                <select name="soortwerk" defaultValue="">
                  <option value="" disabled>Soort werk</option>
                  {SOORT_WERK.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="pc-form-veld pc-form-enkel"><span>Bericht (optioneel)</span>
                <textarea name="bericht" placeholder="Bericht (optioneel)" /></label>
              <button className="pc-knop pc-knop--accent" type="submit" disabled={bezig}>
                {bezig ? 'Bezig…' : 'Verstuur'}<IcPijl maat={13} />
              </button>
              {fout && <p className="pc-form-melding" style={{ color: '#a3231a' }}>{fout}</p>}
            </form>
            <div className="pc-contact-foto">
              <img src={contactFoto} alt="Afgewerkte leefruimte uit een totaalrenovatie van AB Bouw Groep" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Eind-CTA met de cirkelfoto die over de bandrand steekt ── */}
      <section className="pc-eind">
        <div className="pc-eind-bg">
          <img src={eindFoto} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="pc-cirkel">
          <img src={cirkelFoto} alt="Afgewerkte badkamer uit een renovatie van AB Bouw Groep" loading="lazy" />
        </div>
        <div className="pc-vat">
          <div className="pc-eind-vat">
            {/* De referentie herhaalt hier zijn eigen H1-vorm (drie diensten plus
                "één X"). Deze kop zegt iets anders dan de hero. */}
            <h2>Uw renovatie begint<br />bij de opmeting.</h2>
            <p>Laat uw gegevens achter of bel ons. Wij plannen de opmeting in en bespreken uw plannen bij u thuis.</p>
            <div className="pc-eind-knoppen">
              <a className="pc-knop pc-knop--accent" href={CONTACT.phone.href}>
                {CONTACT.phone.display}<IcPijl />
              </a>
              <a className="pc-knop pc-knop--wit" href="#contact">Gratis offerte<IcPijl /></a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pc-footer">
        <div className="pc-vat">
          <div className="pc-footer-grid">
            <div>
              <div className="pc-footer-logo"><img src={logo} alt="AB Bouw Groep" /></div>
              <p>
                AB Bouw Groep werkt vanuit Willebroek met een eigen vaste ploeg: totaalrenovatie,
                badkamers, dakwerken en gevelbekleding. Zes divisies, 120+ realisaties.
              </p>
              {SOCIALS.length > 0 && (
                <div className="pc-footer-soc">
                  {SOCIALS.map(({ naam, href }) => {
                    const Icoon = SOCIAAL_ICOON[naam];
                    return <a key={naam} href={href} aria-label={naam} target="_blank" rel="noopener noreferrer"><Icoon /></a>;
                  })}
                </div>
              )}
            </div>

            <div>
              <h3>Snel naar</h3>
              <nav className="pc-footer-links">
                <a href="#top">Home</a>
                <a href="#over">Over ons</a>
                <a href="#diensten">Diensten</a>
                <a href="#werkwijze">Werkwijze</a>
                <a href="#contact">Gratis offerte</a>
              </nav>
            </div>

            <div>
              <h3>Onze diensten</h3>
              <nav className="pc-footer-links">
                <a href="/lp/totaalrenovatie">Totaalrenovatie</a>
                <a href="/lp/badkamerrenovatie">Badkamerrenovatie</a>
                <a href="/lp/tegelwerken">Tegel- en pleisterwerk</a>
                <a href="/lp/gevel">Dakwerken en gevelbekleding</a>
              </nav>
            </div>

            <div>
              <h3>Contact</h3>
              <div className="pc-footer-contact">
                <span><IcTelefoon /><a href={CONTACT.phone.href}>{CONTACT.phone.spaced}</a></span>
                <span><IcPin />{CONTACT.address.street},<br />{CONTACT.address.postcode} {CONTACT.address.city}</span>
                <span><IcMail /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
              </div>
            </div>
          </div>

          <div className="pc-footer-lijn" />
          <div className="pc-footer-onder">
            <span>© {new Date().getFullYear()} AB Bouw Groep. Alle rechten voorbehouden.</span>
            <a href="/privacy">Privacybeleid</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Bediening onder een horizontaal spoor: vorige, voortgang, volgende.
 * Op een telefoon is anders niet te zien dat er opzij te scrollen valt, en met
 * een muis is zijwaarts scrollen onhandig.
 */
function Bediening({ spoor, pos, schuif, wat }: {
  spoor: React.RefObject<HTMLDivElement>;
  pos: { links: number; max: number };
  schuif: (ref: React.RefObject<HTMLDivElement>, richting: -1 | 1) => void;
  wat: string;
}) {
  const deel = Math.min(1, Math.max(0, pos.links / pos.max));
  const zichtbaar = spoor.current ? spoor.current.clientWidth / spoor.current.scrollWidth : 1;
  return (
    <div className="pc-bediening">
      <button type="button" aria-label={`Vorige ${wat}`} disabled={pos.links <= 2}
        onClick={() => schuif(spoor, -1)}><IcChevron richting="links" /></button>
      <span className="pc-bediening-rail" aria-hidden="true">
        <i style={{ width: `${Math.max(12, zichtbaar * 100)}%`, transform: `translateX(${deel * (100 / Math.max(0.12, zichtbaar) - 100)}%)` }} />
      </span>
      <button type="button" aria-label={`Volgende ${wat}`} disabled={pos.links >= pos.max - 2}
        onClick={() => schuif(spoor, 1)}><IcChevron richting="rechts" /></button>
    </div>
  );
}

/** Eén stap uit de werkwijze: icooncirkel met stapnummer, titel en tekst. */
function Stap({ titel, tekst, Icoon, nr, actief }: (typeof STAPPEN)[number] & { nr: number; actief?: boolean }) {
  return (
    <div className={actief ? 'pc-stap pc-stap--actief' : 'pc-stap'}>
      <div className="pc-stap-badge">
        {actief && <span className="pc-stap-schijf" />}
        <Icoon />
        <span className="pc-stap-pil">Stap {nr}</span>
      </div>
      <h3>{titel}</h3>
      <p>{tekst}</p>
    </div>
  );
}

/** Eén kaart uit het aanbodspoor, met de zonnestraal-sticker op de foto. */
function SpoorKaart({ badge, titel, tekst, foto, alt, knop, href, gevuld }: Aanbodkaart & { gevuld?: boolean }) {
  return (
    <article className="pc-spoor-kaart">
      <div className="pc-spoor-foto">
        <img src={foto} alt={alt} loading="lazy" />
        <span className="pc-badge" style={{ color: 'var(--pc-accent)' }}>
          <IcZonnestraal />
          <span><b>{badge[0]}</b><i>{badge[1]}</i></span>
        </span>
      </div>
      <h3>{titel}</h3>
      <p>{tekst}</p>
      <a className={`pc-knop ${gevuld ? 'pc-knop--accent' : 'pc-knop--rand'}`} href={href}>
        {knop}<IcPijl />
      </a>
    </article>
  );
}

/** Eén fotokaart uit het dienstenraster. */
function Kaart({ titel, tekst, foto, alt, href, hoogte, gevuld }: Dienstkaart & { hoogte: number; gevuld?: boolean }) {
  return (
    <div className="pc-kaart" style={{ height: hoogte }}>
      <img src={foto} alt={alt} loading="lazy" />
      <div className="pc-kaart-inhoud">
        <div className="pc-kaart-tekst">
          <h3>{titel}</h3>
          <p>{tekst}</p>
        </div>
        <a className={gevuld ? 'pc-rond pc-rond--vol' : 'pc-rond'} href={href} aria-label={titel}>
          <IcPijl maat={14} />
        </a>
      </div>
    </div>
  );
}
