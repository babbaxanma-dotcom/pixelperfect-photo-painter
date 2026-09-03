/**
 * Landingspagina in replica-vorm — de opzet van de referentie in Downloads.
 *
 * Deze ene component draait beide replica-pagina's: /totaalrenovatie en
 * /badkamerrenovatie. Wat per pagina verschilt (koppen, foto's, kaarten,
 * stappen, calculatorvragen, leadbron) komt uit inhoud.ts; de opzet, de maten
 * en het gedrag staan hier. Zo kan de tweede pagina niet stilletjes
 * achterlopen op een correctie aan de eerste.
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
import { wireVasteKop } from '../../_rp';
import { useNavigate } from 'react-router-dom';
import { CONTACT } from '@/data/contact';
import { submitLead } from '@/lib/leads';
import Calculator from './Calculator';
import Schetser from './Schetser';
import { trackFormStart } from '@/lib/tracking';
import { DIENSTEN } from '../LpDienst';
import { REPLICA_CSS } from './stijl';
import {
  IcBericht, IcChevron, IcGoogle, IcFacebook, IcLinkedIn, IcMail, IcPersoon, IcPijl,
  IcPin, IcSter, IcTelefoon, IcX, IcYouTube,
  IcBoog, IcStapBel, IcStapBezoek, IcStapMeten, IcStapOplevering, IcStapWerf,
  IcBurger, IcKruis,
} from './Iconen';
import {
  Bediening, Kaart, SpoorKaart, Stap, VoorNaSchuif,
  type Aanbodkaart, type Dienstkaart,
} from './Onderdelen';
import { TOTAALRENOVATIE, type PaginaInhoud } from './inhoud';
import { BLOGS } from '@/data/blogs';

import logo from '@/assets/home/logo-trim.png';
import glyph1 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p1-a.jpg';
import glyph2 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p1-b.jpg';
import glyph3 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p2-a.jpg';
import glyph4 from '@/assets/lp-diensten/realisaties/totaalrenovatie-p2-b.jpg';
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
const GLYPH_TEKENS = ['1', '2', '0', '+'];
const GLYPH_STANDAARD = [glyph1, glyph2, glyph3, glyph4];
/** De zes divisies van AB Bouw Groep. */
const DIVISIES = ['AB Construct', 'AB Dakwerken', 'AB Gevelbekleding',
  'AB Interieurwerken', 'AB Bad & Wellness', 'AB Ecologisch'];




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



/*
 * De navigatie van een landingspagina wijst naar secties op die pagina zelf.
 *
 * "Diensten" stond hier maar de badkamerpagina heeft die sectie niet: daar
 * klikte je op een link die je nergens bracht. Een pagina kan deze lijst
 * overschrijven via inhoud.nav; waar dat niet gebeurt telt deze.
 */
const NAV: { label: string; href: string; chevron?: boolean }[] = [
  { label: 'Home', href: '#top' },
  { label: 'Over ons', href: '#over' },
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



/** Zet de regels van een kop onder elkaar, precies zoals ze in de referentie
    afbreken. Levert dezelfde opbouw op als tekst met een los <br /> ertussen. */
const regels = (r: string[]) => r.flatMap((t, i) => (i ? [<br key={i} />, t] : [t]));

export default function LpReplica({ inhoud = TOTAALRENOVATIE }: { inhoud?: PaginaInhoud }) {
  const REVIEWS = inhoud.reviews ?? DIENSTEN[inhoud.dienst].reviews;
  const SOORT_WERK = DIENSTEN[inhoud.dienst].typeWerkOpties;
  const navigate = useNavigate();
  const [mobOpen, setMobOpen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const startGemeld = useRef(false);
  const reviewSpoor = useRef<HTMLDivElement>(null);
  const aanbodSpoor = useRef<HTMLDivElement>(null);
  const werkSpoor = useRef<HTMLDivElement>(null);
  const [reviewPos, setReviewPos] = useState({ links: 0, max: 1 });
  const [aanbodPos, setAanbodPos] = useState({ links: 0, max: 1 });
  const [werkPos, setWerkPos] = useState({ links: 0, max: 1 });
  /* Het fotospoor schuift zelf op. Zodra iemand er met de muis, de vinger of
     het toetsenbord aan komt, stopt dat: een spoor dat doorloopt terwijl je
     kijkt of sleept, vecht met de bezoeker. Na een aanraking wacht het zes
     seconden voor het weer verder gaat, zodat het niet onder je vinger
     wegschuift. */
  const [werkStil, setWerkStil] = useState(false);
  /* Teller die alleen omhoog gaat als er een NIEUWE foto begint. Hij is de
     sleutel van de vullijn: React hangt er een vers element aan op, dus de
     animatie start op nul. Zou de sleutel op de pauze staan, dan zou de lijn
     bij het minste hoveren terugspringen naar leeg in plaats van te bevriezen
     op de stand die hij had, precies wat de eerste keuring liet zien. */
  const [lijnRonde, setLijnRonde] = useState(0);
  const nieuweRonde = () => setLijnRonde((r) => r + 1);
  const werkIndex = useRef(0);
  const werkAnimeert = useRef(0);
  const hervatKlok = useRef<number>();
  const pauzeerWerk = (hervatNa = 0) => {
    window.clearTimeout(hervatKlok.current);
    setWerkStil(true);
    if (hervatNa > 0) hervatKlok.current = window.setTimeout(() => { setWerkStil(false); nieuweRonde(); }, hervatNa);
  };
  const hervatWerk = () => { window.clearTimeout(hervatKlok.current); setWerkStil(false); nieuweRonde(); };
  /** Hoeveel er per klik opschuift: de afstand van tegel 1 naar tegel 2, uit
      de DOM gelezen. Niet 'breedte + 25': de goot is 24px op de brede stand en
      12px op de smalle, dus die schatting liet het spoor per stap wegkruipen
      (gemeten 13px per stap op 390px, waardoor de lus na 18 stappen niet meer
      op dezelfde foto uitkwam). */
  const stapVan = (el: HTMLElement) => {
    const k = el.children;
    /* getBoundingClientRect en niet offsetLeft: op de smalle stand is een tegel
       78% breed en dus geen heel aantal pixels. offsetLeft rondt af, en die
       halve pixel per stap telde over één reeks op tot 7px scheefstand. */
    const een = k[0]?.getBoundingClientRect().left;
    const twee = k[1]?.getBoundingClientRect().left;
    if (een !== undefined && twee !== undefined && twee > een) return twee - een;
    return (el.firstElementChild?.getBoundingClientRect().width ?? 300) + 25;
  };
  /** Verzet het spoor ZONDER animatie.
      Het spoor heeft scroll-behavior: smooth in de stijl, dus een gewone
      toewijzing aan scrollLeft wordt zelf geanimeerd en meteen door de
      volgende scrollTo overschreven. Gevolg: bij een klik op "vorige" vanaf
      positie nul bleef het spoor op nul staan, precies de muur die er niet
      mocht zijn. Even op auto, springen, terugzetten. */
  const springDirect = (el: HTMLElement, naar: number) => {
    const bewaar = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = naar;
    void el.scrollLeft;
    el.style.scrollBehavior = bewaar;
  };
  /** Eén tegel verder of terug in een spoor dat rondloopt. Zowel de pijlen als
      de klok van vier seconden lopen hier doorheen, zodat er maar één versie
      van deze rekensom bestaat.
      Niet relatief stappen maar naar de EXACTE positie van een tegel springen:
      relatief optellen laat elke stap de fractie liggen die de browser van
      scrollLeft afrondt, en over achttien tegels was dat 4 tot 7px scheef ,
      dan sluit de lus niet meer en verspringt het beeld. */
  const stapLus = (el: HTMLElement, richting: -1 | 1) => {
    const tegels = Array.from(el.children) as HTMLElement[];
    const helft = Math.floor(tegels.length / 2);
    if (!helft) return;
    /* offsetLeft telt vanaf de offsetParent, niet vanaf het spoor: op een breed
       scherm staat de container gecentreerd en zit er 113px marge in dat getal.
       Rechtstreeks als scrollstand gebruiken zet het spoor dus precies die
       marge scheef. Alles wordt daarom gemeten vanaf de eerste tegel. */
    const nul = tegels[0].offsetLeft;
    const stand = (i: number) => tegels[i].offsetLeft - nul;
    /* De index wordt GETELD, niet afgelezen. Onze eigen scroll is smooth, dus
       tijdens de animatie ligt scrollLeft tussen twee tegels in; wie dan
       opnieuw klikt, kiest de verkeerde "huidige" tegel en de uitlijning kruipt
       weg, gemeten 113px over één reeks. Handmatig scrollen stelt de teller
       bij via synchroniseerWerkIndex, maar niet zolang onze animatie loopt. */
    let index = Math.min(Math.max(werkIndex.current, 0), tegels.length - 1);
    /* Zelfcorrectie. Verzet iets anders dan deze functie de positie — een veeg,
       een sprong van buitenaf, dan klopt de teller niet meer met wat er staat.
       De grens is één hele tegel: tijdens onze eigen animatie is het verschil
       altijd kleiner dan dat, dus dan blijft de teller leidend; is het groter,
       dan is er echt iets anders gebeurd en wint de DOM. */
    const stapBreedte = (tegels[1]?.offsetLeft ?? 0) - (tegels[0]?.offsetLeft ?? 0);
    if (stapBreedte > 0 && Math.abs(tegels[index].offsetLeft - el.scrollLeft) > stapBreedte) {
      let dichtst = Infinity;
      tegels.forEach((t, i) => {
        const afstand = Math.abs(t.offsetLeft - el.scrollLeft);
        if (afstand < dichtst) { dichtst = afstand; index = i; }
      });
    }
    /* Staat het spoor al in de tweede reeks, zet het dan onzichtbaar terug naar
       dezelfde tegel in de eerste. Zo blijft de index begrensd en is er in geen
       van beide richtingen ooit een eind. */
    if (index >= helft) { index -= helft; springDirect(el, stand(index)); }
    let doel = index + richting;
    if (doel < 0) { index += helft; springDirect(el, stand(index)); doel = index - 1; }
    werkIndex.current = doel;
    werkAnimeert.current = Date.now() + 450;
    el.scrollTo({ left: stand(doel), behavior: 'smooth' });
  };
  const schuif = (ref: React.RefObject<HTMLDivElement>, richting: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    /* Wie zelf op een pijl klikt, neemt het over: de autoplay stopt zes
       seconden. Zonder dit vecht de tik van vier seconden met de klik en lijkt
       de pijl niets te doen, precies wat de bedieningstest aan het eind van
       het spoor betrapte. Hoveren alleen volstaat niet: een klik vanuit een
       test of een toetsenbord stuurt geen pointerenter. */
    if (ref === werkSpoor) { pauzeerWerk(6000); nieuweRonde(); }
    const stap = stapVan(el);
    if (el.dataset.lus) {
      /* Oneindig spoor: de reeks staat twee keer in de DOM, dus een sprong van
         precies één reeksbreedte laat exact hetzelfde beeld staan. Die sprong
         gebeurt ZONDER animatie vlak voor het schuiven, waarna de gewone
         beweging volgt, je ziet de omslag daardoor niet. */
      stapLus(el, richting);
      volgStand(el, setWerkPos);
      return;
    }
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const doel = Math.min(max, Math.max(0, el.scrollLeft + richting * stap));
    el.scrollTo({ left: doel, behavior: 'smooth' });
    /* Meteen zelf bijwerken: op een spoor dat al aan het eind staat vuurt er
       geen scroll-event meer, en dan bleef de knopstand hangen. */
    volgStand(el, ref === reviewSpoor ? setReviewPos : ref === werkSpoor ? setWerkPos : setAanbodPos);
  };
  const volgStand = (el: HTMLElement, zet: (p: { links: number; max: number }) => void) =>
    zet({ links: el.scrollLeft, max: Math.max(1, el.scrollWidth - el.clientWidth) });

  /* De sporen één keer opmeten zodra ze bestaan, en opnieuw bij elke maatwijziging.
     Zonder deze meting staat max op de beginwaarde 1, is "pos.links >= pos.max - 2"
     al waar en is de knop "volgende" uitgeschakeld tot je met de hand scrolt ,
     dat is de pijl die "soms niet werkt". Beelden laden later, dus een
     ResizeObserver op het spoor vangt ook de breedte na het laden op. */
  /* De kop blijft staan bij het scrollen en krimpt tot de navigatierij. Op de
     landingspagina ligt hij over de herofoto, dus krijgt hij daarbij een witte
     achtergrond; zonder die achtergrond leest hij door de inhoud heen. */
  useEffect(() => wireVasteKop(), []);

  /* De hero blijft staan terwijl de pagina eroverheen schuift. Zonder meer zou
     de titel half onder de formulierkaart blijven hangen: een afgesneden woord
     dat er tijdens het hele scrollen onderuit steekt. De inhoud vervaagt daarom
     mee terwijl je de hero uit scrolt, over de eerste 380px, en is weg tegen de
     tijd dat de kaart erover ligt. De foto blijft; die hoort bij het beeld dat
     onder de pagina wegzakt.

     Wie beweging heeft uitgezet in zijn systeem krijgt dit niet: dan blijft de
     hero gewoon staan zoals hij is. */
  useEffect(() => {
    const vat = document.querySelector<HTMLElement>('.pc-hero--ruim .pc-hero-vat');
    if (!vat) return;
    const rustig = window.matchMedia('(prefers-reduced-motion: reduce)');
    let bezig = false;
    const teken = () => {
      bezig = false;
      const deel = Math.min(1, Math.max(0, window.scrollY / 380));
      vat.style.opacity = String(1 - deel);
      vat.style.transform = `translateY(${-deel * 36}px)`;
    };
    const meet = () => { if (!bezig) { bezig = true; requestAnimationFrame(teken); } };
    const zet = () => {
      if (rustig.matches) { vat.style.opacity = ''; vat.style.transform = ''; return; }
      teken();
    };
    zet();
    window.addEventListener('scroll', meet, { passive: true });
    rustig.addEventListener('change', zet);
    return () => {
      window.removeEventListener('scroll', meet);
      rustig.removeEventListener('change', zet);
      vat.style.opacity = ''; vat.style.transform = '';
    };
  }, []);

  /* Het menu sluit bij Escape en zodra het scherm breed genoeg is voor de gewone
     navigatierij, en zet de pagina eronder vast zolang het openstaat. Zonder dat
     scrolt de achtergrond mee onder het paneel door. */
  useEffect(() => {
    if (!mobOpen) return;
    const vorige = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const toets = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobOpen(false); };
    const breed = window.matchMedia('(min-width: 901px)');
    const dicht = () => setMobOpen(false);
    window.addEventListener('keydown', toets);
    breed.addEventListener('change', dicht);
    return () => {
      document.body.style.overflow = vorige;
      window.removeEventListener('keydown', toets);
      breed.removeEventListener('change', dicht);
    };
  }, [mobOpen]);

  useEffect(() => {
    const paren: [React.RefObject<HTMLDivElement>, (p: { links: number; max: number }) => void][] =
      [[reviewSpoor, setReviewPos], [aanbodSpoor, setAanbodPos], [werkSpoor, setWerkPos]];
    const meet = () => paren.forEach(([r, zet]) => { if (r.current) volgStand(r.current, zet); });
    meet();
    const ro = new ResizeObserver(meet);
    paren.forEach(([r]) => { if (r.current) { ro.observe(r.current); Array.from(r.current.children).forEach((k) => ro.observe(k)); } });
    window.addEventListener('resize', meet);
    const t = window.setTimeout(meet, 800);
    return () => { ro.disconnect(); window.removeEventListener('resize', meet); window.clearTimeout(t); };
  }, []);

  /* Het spoor schuift elke vier seconden één tegel op en springt aan het eind
     terug naar het begin. Vier seconden is de tijd die de vullijn eronder
     nodig heeft, zodat de bezoeker de volgende foto ziet aankomen in plaats
     van erdoor verrast te worden. Staat het tabblad op de achtergrond, dan
     stopt het: anders loopt de teller door en verspringt alles ineens bij
     terugkomst. Wie "minder beweging" heeft ingesteld, krijgt geen autoplay. */
  useEffect(() => {
    const el = werkSpoor.current;
    if (!el || werkStil) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tik = () => {
      if (document.hidden) return;
      stapLus(el, 1);
      nieuweRonde();
    };
    const id = window.setInterval(tik, 4000);
    return () => window.clearInterval(id);
  }, [werkStil]);

  /* Titel, omschrijving en canonical.
     De canonical wijst altijd naar het korte adres, ook als de bezoeker via
     /lp/... binnenkomt. Beide adressen tonen dezelfde pagina; zonder deze regel
     slaat App.tsx de /lp/-route over (die beheren hun eigen canonical) en blijft
     de statische canonical uit index.html staan, die naar de homepage wijst.
     Twee identieke pagina's die allebei naar de homepage canonicaliseren is
     precies de duplicate content die robots.txt zegt te vermijden. */
  useEffect(() => {
    document.title = inhoud.titel;
    const zet = (kies: string, maak: () => Element, attr: string, waarde: string) => {
      let el = document.querySelector(kies);
      if (!el) { el = maak(); document.head.appendChild(el); }
      el.setAttribute(attr, waarde);
    };
    zet('meta[name="description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    }, 'content', inhoud.omschrijving);
    zet('link[rel="canonical"]:not([hreflang])', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }, 'href', `https://abgroep.be${inhoud.pad}`);
  }, [inhoud]);

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
      landing_division: inhoud.divisie,
      firstName: String(f.get('voornaam') || '').trim() || undefined,
      lastName: String(f.get('achternaam') || '').trim() || undefined,
      email,
      phone: telefoon || undefined,
      type_werk: inhoud.divisie,
      aanvullende_info: [String(f.get('soortwerk') || '').trim(), String(f.get('bericht') || '').trim()]
        .filter(Boolean).join(', ') || undefined,
      bron_lead: inhoud.bronPrefix + ':contact',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=' + inhoud.dienst);
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
      landing_division: inhoud.divisie,
      firstName: voor || undefined,
      lastName: rest.join(' ') || undefined,
      email,
      phone: telefoon || undefined,
      type_werk: inhoud.divisie,
      aanvullende_info: String(f.get('bericht') || '').trim() || undefined,
      bron_lead: inhoud.bronPrefix + ':balk',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=' + inhoud.dienst);
    else setFout('Versturen lukte niet. Bel gerust ' + CONTACT.phone.display + '.');
  };

  return (
    <div className="pcx" id="top">
      <style dangerouslySetInnerHTML={{ __html: REPLICA_CSS }} />

      {/* ── Hero met de kop erover. De foto begint op y=0 en loopt onder de
           kop door; een wegvallende witte sluier maakt de kop leesbaar. ── */}
      <section className={`pc-hero${inhoud.nav ? ' pc-hero--ruim' : ''}`}>
        <div className="pc-hero-vlak" />
        <div className="pc-hero-foto">
          <img src={inhoud.hero.foto} alt={inhoud.hero.alt}
            style={inhoud.hero.focus ? ({ '--pc-hero-focus': inhoud.hero.focus } as React.CSSProperties) : undefined} />
        </div>
        <div className="pc-hero-sluier" />

        <header className={`pc-kop${inhoud.nav ? ' pc-kop--site' : ''}`}>
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
                <nav className={`pc-nav${(inhoud.nav ?? NAV).length > 5 ? ' pc-nav--dicht' : ''}`}>
                  {(inhoud.nav ?? NAV).map((n) => (
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
            <button
              className="rp-burger"
              type="button"
              aria-label={mobOpen ? 'Menu sluiten' : 'Menu openen'}
              aria-expanded={mobOpen}
              aria-controls="pc-mob"
              onClick={() => setMobOpen((o) => !o)}
            >
              <IcBurger />
            </button>
          </div>
        </header>

        {/* Op een telefoon is er geen plaats voor de navigatierij, dus verdween
            die helemaal: er was geen enkele manier om vanaf hier naar een andere
            pagina te gaan. Dit paneel is hetzelfde als op de gewone paginas, met
            dezelfde knop van drie lijntjes, zodat de site zich overal gelijk
            gedraagt. */}
        <div className={`rp-mob${mobOpen ? ' is-open' : ''}`} id="pc-mob" hidden={!mobOpen}>
          <div className="rp-mob__top">
            <img src={logo} alt="AB Bouw Groep" style={{ height: 36, width: 'auto' }} />
            <button className="rp-mob__close" type="button" onClick={() => setMobOpen(false)} aria-label="Menu sluiten">
              <IcKruis />
            </button>
          </div>
          <nav className="rp-mob__list" aria-label="Mobiel menu">
            {(inhoud.nav ?? NAV).map((n) => (
              /* Sluiten bij het aanklikken: de meeste links hier zijn ankers op
                 deze pagina, en dan blijft het paneel er anders overheen liggen. */
              <a className="rp-mob__link" key={n.label} href={n.href} onClick={() => setMobOpen(false)}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="rp-mob__cta">
            <a className="pc-knop pc-knop--accent" href={CONTACT.phone.href} style={{ justifyContent: 'center' }}>
              <IcTelefoon />{CONTACT.phone.display}
            </a>
            <a className="pc-knop pc-knop--donker" href="#contact" onClick={() => setMobOpen(false)} style={{ justifyContent: 'center' }}>
              Gratis offerte<IcPijl />
            </a>
          </div>
        </div>

        <div className="pc-vat pc-hero-vat">
          {/* De referentie zet 'New' in de pil: een nieuwheidsclaim die voor AB
              niet klopt. De pil is eruit; de chip noemt de dienst en het
              werkgebied, zodat er informatie staat en geen kaal opschrift. */}
          <h1 className="pc-h1">{regels(inhoud.hero.regels)}</h1>
          {inhoud.hero.sub && <p className="pc-hero-sub">{inhoud.hero.sub}</p>}
          <a className="pc-knop pc-knop--accent" href="#contact">{inhoud.hero.knop}<IcPijl /></a>
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
      <div className={`pc-vat pc-balk${inhoud.toonCalculator === false ? ' pc-balk--los' : ''}`}>
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

      {/* ── Richtprijs-calculator, direct onder de balk ── */}
      {inhoud.toonCalculator !== false && (
        <div className="pc-vat pc-calc-vat"><Calculator inhoud={inhoud.calculator} /></div>
      )}

      {/* ── Over ons ── */}
      <section className="pc-over" id="over">
        <div className="pc-vat pc-over-grid">
          <div>
            <h2 className="pc-h2">{regels(inhoud.over.kop)}</h2>
            <a className="pc-knop pc-knop--accent pc-over-knop" href={CONTACT.phone.href}>
              Bel {CONTACT.phone.display}<IcPijl />
            </a>
          </div>

          {/* De realisatieteller hoort bij het uitgevoerde werk. Staat die sectie
              uit, dan hoort de teller er ook niet: dan telt de pagina iets dat ze
              nergens laat zien. */}
          {inhoud.toonTeller !== false && (
          <div>
            <div className="pc-getal">
              {GLYPH_TEKENS.map((teken, i) => (
                <span key={i} style={{
                  backgroundImage: `url(${(inhoud.glyphFotos ?? GLYPH_STANDAARD)[i]})`,
                }}>{teken}</span>
              ))}
            </div>
            <p className="pc-getal-label">Realisaties</p>
          </div>
          )}

          <div className="pc-rij2 pc-over-foto">
            <img src={inhoud.over.foto} alt={inhoud.over.alt} loading="lazy" />
            <div className="pc-score">
              <div className="pc-score-sterren">
                {[0, 1, 2, 3, 4].map((i) => <IcSter key={i} />)}
              </div>
              <div className="pc-score-cijfer">4,9</div>
              <div className="pc-score-bij">Google-score</div>
            </div>
          </div>

          <div className="pc-rij2 pc-over-tekst">
            <p>{inhoud.over.tekst}</p>
            {/* De zes divisies stonden in één doorlopende zin. Als lijst is in
                één oogopslag te zien wat er onder één dak zit. */}
            {inhoud.toonDivisies !== false && (
            <ul className="pc-divisies">
              {DIVISIES.map((d) => <li key={d}>{d}</li>)}
            </ul>
            )}
            {inhoud.over.slot && <p className="pc-over-slot">{inhoud.over.slot}</p>}
          </div>
        </div>
      </section>

      {/* ── Diensten: donkere sectie met vijf getrapte fotokaarten ── */}
      {inhoud.schetser && <Schetser />}

      {inhoud.toonDiensten && (
        <section className="pc-diensten" id="diensten">
          <div className="pc-diensten-bg">
            <img src={inhoud.diensten.achtergrond} alt="" aria-hidden="true" loading="lazy" />
          </div>
          <div className="pc-vat">
            <div className="pc-midden">
              <h2 className="pc-h2--donker">{regels(inhoud.diensten.kop)}</h2>
            </div>

            {/* Het mozaiek van de referentie werkt alleen met vijf kaarten.
                Bij elk ander aantal staan ze even groot naast elkaar. */}
            {inhoud.diensten.kaarten.length === 5 ? (
              <div className="pc-kaarten">
                <div className="pc-kaarten-kolom">
                  <Kaart {...inhoud.diensten.kaarten[0]} hoogte={226} />
                  <Kaart {...inhoud.diensten.kaarten[1]} hoogte={335} />
                </div>
                <div className="pc-kaarten-kolom">
                  <Kaart {...inhoud.diensten.kaarten[2]} hoogte={585} gevuld />
                </div>
                <div className="pc-kaarten-kolom">
                  <Kaart {...inhoud.diensten.kaarten[3]} hoogte={334} />
                  <Kaart {...inhoud.diensten.kaarten[4]} hoogte={227} />
                </div>
              </div>
            ) : (
              <div className="pc-kaarten pc-kaarten--gelijk">
                {inhoud.diensten.kaarten.map((k) => (
                  <Kaart key={k.titel} {...k} hoogte={335} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Aanbod: kaartenspoor dat rechts uit beeld loopt ── */}
      {/* ── Marquee-band. De referentie herhaalt hier een telefoonoproep;
           het spoor staat twee keer in de DOM zodat de lus naadloos is. ── */}
      <div className="pc-marquee" aria-hidden="true">
        <div className="pc-marquee-spoor">
          {[0, 1].map((lus) => (
            <div key={lus} style={{ display: 'flex' }}>
              {[0, 1, 2, 3].map((i) => (
                <div className="pc-marquee-eenheid" key={i}>
                  <IcTelefoon />
                  <span>Bel ons vandaag, {CONTACT.phone.spaced}</span>
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
          <h2 className="pc-h2--midden">{regels(inhoud.werkwijze.kop)}</h2>
        </div>
        <div className="pc-stappen">
          {/* De bogen staan absoluut: hun plek komt uit de gemeten
              tussenruimtes tussen de cirkels, niet uit de rasterstroom. */}
          <span className="pc-boog" style={{ left: 249, top: 12 }}><IcBoog /></span>
          <span className="pc-boog" style={{ left: 601, top: 11 }}><IcBoog bol /></span>
          <span className="pc-boog" style={{ left: 430, top: 227 }}><IcBoog /></span>
          <div className="pc-stappen-rij">
            {inhoud.werkwijze.stappen.slice(0, 3).map((s, i) => <Stap key={s.titel} {...s} nr={i + 1} actief={i === 1} />)}
          </div>
          <div className="pc-stappen-rij pc-stappen-rij--twee">
            {inhoud.werkwijze.stappen.slice(3).map((s, i) => <Stap key={s.titel} {...s} nr={i + 4} />)}
          </div>
        </div>
      </section>

      {/* ── Realisaties: één spoor met alle werffoto's, daaronder de dakschuif ──
          De vier tabbladen zijn weg. Een filter waar de bezoeker op moet
          klikken verbergt drie kwart van het werk achter een knop die de
          meesten niet aanraken; één spoor toont alles en scrolt zelf. Elke
          tegel is even groot en vierkant, zodat de rij als één blok leest. */}
      {inhoud.toonWerk !== false && (
      <section className="pc-werk">
        <div className="pc-vat pc-midden">
          <h2 className="pc-h2--midden">{inhoud.werk.kop}</h2>
        </div>
        <div className="pc-vat"
          onPointerEnter={() => pauzeerWerk()} onPointerLeave={hervatWerk}
          onFocusCapture={() => pauzeerWerk()} onBlurCapture={hervatWerk}
          onTouchStart={() => pauzeerWerk(6000)} onWheel={() => pauzeerWerk(6000)}>
          {/* De reeks staat er twee keer in. Zo kan het spoor bij het einde
              onzichtbaar terugspringen naar dezelfde foto in de eerste reeks:
              de bezoeker blijft met één pijl doorschuiven en raakt in geen van
              beide richtingen een muur. De tweede reeks is voor een schermlezer
              verborgen, anders staat elk project er twee keer in. */}
          <div className="pc-werk-spoor" ref={werkSpoor} role="group" aria-label="Uitgevoerde projecten"
            data-lus="1" onScroll={(e) => volgStand(e.currentTarget, setWerkPos)}>
            {[0, 1].map((reeks) => inhoud.werk.fotos.map((f) => (
              <figure className="pc-werk-foto" key={reeks + f.naam} aria-hidden={reeks === 1 ? true : undefined}>
                <img src={beeld(f.naam)} alt={reeks === 1 ? '' : f.alt} loading="lazy"
                  style={f.pos ? { objectPosition: f.pos } : undefined} />
              </figure>
            )))}
          </div>
          {/* De vullijn loopt in vier seconden vol en begint opnieuw op het
              moment dat de volgende foto inschuift: de bezoeker ziet hem
              aankomen. Muis erop of vinger erop bevriest de lijn waar hij
              staat; hij springt niet terug naar leeg. Dit is de enige
              voortgangsaanduiding van dit spoor, het balkje tussen de pijlen
              staat uit, twee streepjes vlak onder elkaar leest als een fout. */}
          <div className="pc-werk-lijn" aria-hidden="true">
            <i key={lijnRonde} className={werkStil ? 'pc-werk-vul pc-werk-vul--stil' : 'pc-werk-vul'} />
          </div>
          <Bediening spoor={werkSpoor} pos={werkPos} schuif={schuif} wat="foto" lus />
        </div>
        {/* De voor/na-schuif hoort bij een paar opnames vanuit hetzelfde punt.
            Bestaat dat paar voor deze pagina niet, dan valt het blok weg: twee
            verschillende ruimtes naast elkaar zetten suggereert een
            vergelijking die er niet is. */}
        {inhoud.werk.schuif && (
          <div className="pc-vat pc-midden">
            <VoorNaSchuif {...inhoud.werk.schuif} />
          </div>
        )}
      </section>
      )}

      {/* ── Keurmerken: waar we mee bouwen ── */}

      {inhoud.toonMerken && (
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
      )}

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
                  <span className="pc-review-bron" title="Beoordeling op Google"><IcGoogle /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <Bediening spoor={reviewSpoor} pos={reviewPos} schuif={schuif} wat="review" />
      </section>

      {/* ── Uw zekerheden: de vier voorwaarden die vastliggen ──
          Deze sectie stond eerst boven de werkwijze, dus vóór elk bewijs. Wie
          nog niet weet wie hier werkt en wat er is opgeleverd, leest vier
          voordelen als reclame. Nu komt hij ná het stappenplan, het werk en de
          reviews: dezelfde vier punten lezen dan als voorwaarden waarop je
          tekent, en de bezoeker scrolt langs het bewijs om er te komen. */}
      <section className="pc-aanbod">
        <div className="pc-vat">
          <h2 className="pc-h2--midden">{inhoud.aanbod.kop}</h2>
        </div>
        <div className="pc-spoor" ref={aanbodSpoor}
          onScroll={(e) => volgStand(e.currentTarget, setAanbodPos)}>
          {inhoud.aanbod.kaarten.map((k, i) => <SpoorKaart key={k.titel} {...k} gevuld={i === 0} />)}
        </div>
        <Bediening spoor={aanbodSpoor} pos={aanbodPos} schuif={schuif} wat="kaart" />
      </section>

      {/* ── Contact ── */}
      {/* ── Veelgestelde vragen. Alleen de homepage heeft deze sectie; een
           landingspagina laat hem weg. Het paneel werkt met <details>, dus
           ook zonder JavaScript. ── */}
      {inhoud.faq && (
        <section className="pc-faq" id="vragen">
          <div className="pc-vat">
            <h2 className="pc-h2--midden">{regels(inhoud.faq.kop)}</h2>
            <div className="pc-faq-lijst">
              {inhoud.faq.vragen.map((vraag, i) => (
                <details className="pc-faq-item" key={vraag.v} open={i === 0}>
                  <summary className="pc-faq-vraag">
                    {vraag.v}
                    <span className="pc-faq-teken" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <div className="pc-faq-antwoord">{vraag.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── De laatste artikels. De kaart leent elke maat van .pc-kaart en
           .pc-werk-foto; alleen de beeldverhouding is eigen, omdat een
           artikelbeeld liggend hoort en het fotoraster vierkant is. ── */}
      {inhoud.blog && (
        <section className="pc-blog">
          <div className="pc-vat">
            <h2 className="pc-h2--midden">{regels(inhoud.blog.kop)}</h2>
            <div className="pc-blog-raster">
              {BLOGS.slice(0, inhoud.blog.aantal).map((post) => (
                <a className="pc-blog-kaart" key={post.slug} href={`/blog/${post.slug}`}>
                  <img src={post.img} alt={post.title} loading="lazy" decoding="async" />
                  <div className="pc-blog-tekst">
                    <div className="pc-blog-meta">
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {post.date}
                      </span>
                      <span><IcPersoon />AB Bouw Groep</span>
                    </div>
                    <h3>{post.title}</h3>
                    <span className="pc-blog-lees">Lees het artikel<IcPijl /></span>
                  </div>
                </a>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <a className="pc-knop pc-knop--donker" href="/blog">{inhoud.blog.knop}<IcPijl /></a>
            </div>
          </div>
        </section>
      )}

      <section className="pc-contact" id="contact">
        <div className="pc-vat pc-midden">
          <span className="pc-chip--vlak">{CONTACT.phone.display}<IcChevron richting="rechts" /></span>
          <h2 className="pc-h2--groot">{inhoud.contact.kop}</h2>
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
              <img src={inhoud.contact.foto} alt={inhoud.contact.alt} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Eind-CTA met de cirkelfoto die over de bandrand steekt ── */}
      <section className="pc-eind">
        <div className="pc-eind-bg">
          <img src={inhoud.eind.achtergrond} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="pc-cirkel">
          <img src={inhoud.eind.cirkel} alt={inhoud.eind.cirkelAlt} loading="lazy" />
        </div>
        <div className="pc-vat">
          <div className="pc-eind-vat">
            {/* De referentie herhaalt hier zijn eigen H1-vorm (drie diensten plus
                "één X"). Deze kop zegt iets anders dan de hero. */}
            <h2>{regels(inhoud.eind.kop)}</h2>
            <p>{inhoud.eind.tekst}</p>
            <div className="pc-eind-knoppen">
              <a className="pc-knop pc-knop--accent" href={CONTACT.phone.href}>
                {CONTACT.phone.display}<IcPijl />
              </a>
              <a className="pc-knop pc-knop--wit" href="#contact">Vraag een plaatsbezoek aan<IcPijl /></a>
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
              <p>{inhoud.footer}</p>
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
