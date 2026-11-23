/* /lp/dakwerken in de opbouw en vorm van bfbouw.be/lp/dakwerken (STAAL C, live 22 nov 2026).
   23 nov 2026, Mohammed: "jij moet ab nu ook doen he, in dezelfde stijl zoals bf".
   Opbouw zoals BF: kopbalk met menu, hero zonder formulier (kop, subkop, twee knoppen), Waarom voor ons kiezen, diensten op een donkere band,
   realisatie, Wat heeft uw dak nodig?, Zo werken wij, de voordelen, werkgebied met kaart, zekerhedenband, veelgestelde vragen, offerteblok met
   de bestaande aanvraagkaart (Aanvraag.tsx, plek onder: zelfde vragen, zelfde verzending naar GHL en Web3Forms, zelfde bedankpagina),
   contactblok met berichtformulier, uitgebreide voet.
   Teksten: uit inhoud.ts (DAKWERKEN) of uit bfbouw.be (vorm); de AB-feiten staan in BFC hieronder met hun bron. Geen reviews (spec §1, §12).
   Terugval: in App.tsx de route /lp/dakwerken weer naar LpBf. */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { TIPS_AB, type TipAb } from './tips-ab';
import { DIENST_INFO_AB, DIENST_PAD } from './diensten-ab';
import { CONTACT } from '@/data/contact';
import Aanvraag, { eigenScroll } from './Aanvraag';
import { AanvraagStaat, beginStand, useGedeeldeAanvraag } from './AanvraagStaat';
import Realisatie from './Realisatie';
import { Icoon } from './Iconen';
import { DAKWERKEN, type KgjInhoud, type Zekerheid } from './inhoud';
import { REGIOKAART_AB } from './regiokaart-ab';
import { BadgeEuro, CalendarCheck, Check, Clock, FileCheck, Medal, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react';
import { CLARITY_PROJECT, laadClarity, meldClarity } from '@/lib/clarity';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { mailGeldig, mailKaal, telGeldig } from './contact-controle';
/* 23 nov 2026, Mohammed: "doe op ab paginas logo en naam van ab bouw groep gewoon ipv ab dakwerken". */
import logoWit from '@/assets/bf/logo-wit-440.webp';
/* 23 nov 2026, Mohammed: "bij ab foto in de hero doe die foto dat we hadden van dat anthraciet zwart dak, ingezoomt, die was mooi": de nok van een
   antraciet pannendak (vroegere herodia heroNok, tot 13 okt 2026 op deze pagina). */
import heroNok from '@/assets/dak/hero-antraciet-nok.jpg';
/* 23 nov 2026, Mohammed (foto's uit zijn Downloads, WhatsApp 9.29 en 9.32): "deze foto bij ab onder de hero", "zonder die blikjes redbull in beeld";
   "heb nog 1 in downloads deze kan je ook opzich implementeren als realisatie". De eerste is onderaan bijgesneden (1179x505: de blikjes en de kledij
   linksonder zijn weg, niets vergroot); de tweede staat volledig, als tweede realisatie onder de hoeve. */
import werfDakwerkers from '@/assets/dak/waarom-werf-ab.webp';
import dakkapelAanbouw from '@/assets/realisaties/dakkapel/dakkapel-aanbouw.webp';
/* 23 nov 2026, Mohammed: "bij offerte aanvragen sectie ook een mooiere foto op de achtergrond, we hebben nog mooie fotos die we voor ab gebruikten". */
import slotFoto from '@/assets/dak/hellend-pannen.jpg';
import logoInk from '@/assets/bf/logo-ink-440.webp';
import '../../bf/bf.css';
import '../../bf/bf-ab.css';
import './lp-bf.css';
import './lp-bf-ab.css';
import './lp-bfc.css';

/* AB-feiten en de vorm van BF, elk met bron. */
const BFC = {
  titel: 'Dakwerken in Willebroek en omstreken | AB Bouw Groep',
  /* Adres van AB: src/data/contact.ts (August van Landeghemstraat 63, 2830 Willebroek). Vorm: BF "Dakwerken in Antwerpen en omstreken". */
  regio: 'Dakwerken in Willebroek en omstreken',
  /* Kop zoals bfbouw.be sinds 22 nov 2026 ("Dakwerker nodig? Kies voor vakmanschap."): de grootste AB-advertentiegroep "Dakwerken in de buurt"
     (71 zoekwoorden rond dakwerken, dakwerker, dakdekker) landt op deze pagina. */
  kop: 'Dakwerker nodig?',
  kop2: 'Kies voor vakmanschap.',
  /* 23 nov 2026 (keuring tekst-AB-03): bij AB staat er één realisatie zonder datum (de hoeve); "Bekijk recente daken" (bfbouw.be, drie daken) beloofde meer */
  knop2: { href: '#realisaties', tekst: 'Bekijk ons werk' },
  /* Subkop woordelijk bfbouw.be (vette eerste zin + zin over ervaring en werk); AB-feit: "meer dan 15 jaar ervaring" (DAKWERKEN.waarom, zijn woord), BF: 25 jaar. */
  subVet: 'Zoekt u een dakwerker in de buurt die kwaliteit levert en afspraken nakomt? Die hebt u gevonden.',
  sub: 'Met meer dan 15 jaar ervaring, oog voor detail en kwaliteitsvolle materialen zorgen wij voor een perfect afgewerkt dak.',
  /* Menu woordelijk bfbouw.be: Diensten (uitklapmenu), Realisaties, Werkwijze, Werkgebied, Tips en uitleg, Contact. */
  menu: [['#realisaties', 'Realisaties'], ['#werkwijze', 'Werkwijze'], ['#regio', 'Werkgebied'], ['#blog', 'Tips en uitleg'], ['#gegevens', 'Contact']] as const,
  /* "Wat heeft uw dak nodig?" woordelijk bfbouw.be (LP.nodig, met de vette woorden). */
  nodig: [
    'Alles begint met kijken **in welke staat uw dak is**. Soms volstaan nieuwe pannen of een nieuwe roofing, soms moeten ook het hout en de isolatie eronder vernieuwd worden, en soms is een volledig nieuw dak de beste keuze.',
    'Ligt uw dak open, dan is dat het ideale moment om **meteen te isoleren**. Zo gebeurt alles in één keer en moet uw dak later niet opnieuw open.',
    'Zo is uw dak weer **waterdicht, goed geïsoleerd** en klaar voor de komende decennia.',
  ],
  /* Vier punten zoals BF "Waarom voor ons kiezen"; titels = AB-zekerheden, zinnen uit DAKWERKEN.waarom (tekst en redenen) en de werkwijze. */
  kiezen: [
    /* 23 nov 2026, Mohammed: "voor ab bij waarom ons doe zelfde punten als bega ab aub". Woordelijk bfbouw.be (bouw/lp-dak.cjs kiezen, 22 nov), met de
       AB-feiten: meer dan 15 jaar ervaring (BF: 25) en 10 jaar garantie (BF: 15). */
    { icoon: <Medal aria-hidden="true" />, titel: 'Meer dan 15 jaar ervaring', tekst: 'Ervaren vakmannen die elk dak met zorg en oog voor detail afwerken.' },
    { icoon: <UserCheck aria-hidden="true" />, titel: 'Uw ervaring als klant staat voorop', tekst: 'Wij nemen u het werk uit handen, zodat u met een gerust hart aan uw dak begint.' },
    { icoon: <MessageSquare aria-hidden="true" />, titel: 'Vlotte en duidelijke communicatie', tekst: 'U krijgt snel antwoord en weet altijd waar u aan toe bent.' },
    { icoon: <ShieldCheck aria-hidden="true" />, titel: '10 jaar garantie op al onze dakwerken', tekst: 'Wij staan achter ons werk, ook jaren na de oplevering.' },
  ],
  /* Werkgebied. 23 nov 2026, Mohammed: "en bij de locaties bij bardh, je hoeft niet alles op te sommen, doe gewoon heel oost vlaanderen", "en vlaams
     brabant", "en dan de grootste [steden] opgesomd". Was: de 28 gemeenten van de AB-advertentiegroep "Dakwerken in de buurt". Nu per provincie de grootste
     steden; kaart = beide provincies en Willebroek (regiokaart-ab.ts, scripts/maak-regiokaart-provincies.mjs). De postcodecheck eronder blijft elke
     Belgische postcode groen geven, met de juiste gemeente. */
  gebied: {
    kop: 'Actief in Willebroek en omstreken',
    sub: 'Vanuit Willebroek komen wij bij u langs in heel Oost-Vlaanderen en Vlaams-Brabant.',
    thuis: 'Willebroek',
    provincies: [
      { naam: 'Oost-Vlaanderen', steden: ['Gent', 'Aalst', 'Sint-Niklaas', 'Dendermonde', 'Lokeren', 'Ninove', 'Oudenaarde', 'Geraardsbergen'] },
      { naam: 'Vlaams-Brabant', steden: ['Leuven', 'Vilvoorde', 'Halle', 'Dilbeek', 'Grimbergen', 'Asse', 'Tienen', 'Aarschot'] },
    ],
    opKaart: ['Willebroek', 'Gent', 'Sint-Niklaas', 'Dendermonde', 'Aalst', 'Oudenaarde', 'Ninove', 'Leuven', 'Halle', 'Tienen', 'Aarschot'],
  },
  /* "Zo werken wij": woordelijk bfbouw.be (bouw/lp-dak.cjs proces2, 22 nov 2026). 23 nov 2026, Mohammed: "Zo werken wij exact zoals bf graag,
     woordelijk exact ook". Eén verschil: de garantie van AB is 10 jaar (DAKWERKEN.waarom, faq), niet de 15 jaar van BF. **...** = vet. */
  stappen: [
    'Wij komen **gratis bij u langs** en bekijken uw dak ter plaatse.',
    'U ontvangt een **duidelijke offerte** met de werken, de materialen en een vaste prijs.',
    'Onze eigen vakmannen **starten op de afgesproken datum** en werken netjes en veilig.',
    'We overlopen samen elk detail en **leveren pas op als u tevreden bent**.',
    'U geniet **zorgeloos** van uw nieuwe dak, met 10 jaar garantie.',
  ],
  /* Zin onder "Snel antwoord": woordelijk bfbouw.be (dictaat Mohammed, 22 nov 2026). */
  snel: 'Wij laten u niet wachten. Vlot en duidelijk antwoorden is bij ons de regel.',
};

/* 23 nov 2026, Mohammed: "en maak ook de sublp voor isolatie he", "want deze gebruiken ook isolatie", "bij ab". Subpagina's per advertentiegroep zoals
   bfbouw.be (bouw/lp-dak.cjs VARIANTEN, live 22 nov: /dakrenovatie/, /nieuw-dak/, /plat-dak/, kop "Uw dak renoveren? Kies voor vakmanschap." enz.)
   en dakisolatie (AB-groep Dakisolatie gaf de enige 2 aanvragen van november, plan 22 nov). Zelfde pagina: eigen kop, plaatsregel, titel en
   beschrijving; de dienst van de pagina staat eerst bij de diensten; plat dak vult "Om welk soort dak gaat het?" vooraf in, zoals bfbouw.be.
   Dezelfde titels en beschrijvingen staan in scripts/prerender-lp.mjs (KOP), voor de voorgerenderde HTML. */
type VariantInfo = { kop: string; regio: string; titel: string; beschrijving: string; dienst: string; subVet: string; voor?: { sleutel: string; label: string } };
export const VARIANTEN_AB = {
  dakrenovatie: { kop: 'Uw dak renoveren?', regio: 'Dakrenovatie in Willebroek en omstreken', titel: 'Dakrenovatie in Willebroek en omstreken | AB Bouw Groep',
    beschrijving: 'Dakrenovatie met nieuwe pannen of leien, onderdak en isolatie. Vraag uw gratis offerte aan bij AB Bouw Groep, werken aan 6% btw.', dienst: 'renovatie',
    subVet: 'Zoekt u voor uw dakrenovatie een dakwerker die kwaliteit levert en afspraken nakomt? Die hebt u gevonden.', voor: { sleutel: 'Werk', label: 'Dakrenovatie' } },
  'nieuw-dak': { kop: 'Een nieuw dak nodig?', regio: 'Nieuw dak in Willebroek en omstreken', titel: 'Nieuw dak laten plaatsen | AB Bouw Groep',
    beschrijving: 'Een volledig nieuw dak: structuur, isolatie, onderdak en dakbedekking. Vraag uw gratis offerte aan bij AB Bouw Groep.', dienst: 'nieuw-dak',
    subVet: 'Zoekt u voor uw nieuw dak een dakwerker die kwaliteit levert en afspraken nakomt? Die hebt u gevonden.', voor: { sleutel: 'Werk', label: 'Nieuw dak' } },
  'plat-dak': { kop: 'Uw plat dak vernieuwen?', regio: 'Platte daken in Willebroek en omstreken', titel: 'Plat dak vernieuwen, herstellen of isoleren | AB Bouw Groep',
    beschrijving: 'Uw plat dak vernieuwen, herstellen of isoleren in EPDM, roofing of bitumen. Vraag uw gratis offerte aan bij AB Bouw Groep.', dienst: 'renovatie', voor: { sleutel: 'Dak', label: 'Plat dak' },
    subVet: 'Zoekt u voor uw plat dak een dakwerker die kwaliteit levert en afspraken nakomt? Die hebt u gevonden.' },
  dakisolatie: { kop: 'Uw dak isoleren?', regio: 'Dakisolatie in Willebroek en omstreken', titel: 'Dakisolatie in Willebroek en omstreken | AB Bouw Groep',
    beschrijving: 'Uw dak isoleren langs buiten, langs binnen of op een plat dak, met de attesten voor uw premie. Vraag uw gratis offerte aan bij AB Bouw Groep.', dienst: 'isolatie',
    subVet: 'Zoekt u voor uw dakisolatie een dakwerker die kwaliteit levert en afspraken nakomt? Die hebt u gevonden.', voor: { sleutel: 'Werk', label: 'Isolatie' } },
} satisfies Record<string, VariantInfo>;
export type VariantAb = keyof typeof VARIANTEN_AB;

const ZEKER_ICOON: Record<Zekerheid['icoon'], JSX.Element> = {
  prijs: <BadgeEuro aria-hidden="true" />, aanspreek: <UserCheck aria-hidden="true" />,
  schild: <ShieldCheck aria-hidden="true" />, kalender: <CalendarCheck aria-hidden="true" />,
  medaille: <Medal aria-hidden="true" />, klok: <Clock aria-hidden="true" />, premie: <FileCheck aria-hidden="true" />,
};

const lijn = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
const IcTel = () => <svg {...lijn}><path d="M5.2 3.5h3.3l1.6 4.2-2.1 1.3a11.6 11.6 0 0 0 7 7l1.3-2.1 4.2 1.6v3.3a1.7 1.7 0 0 1-1.8 1.7A17 17 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8Z" /></svg>;
const IcPijl = () => <svg {...lijn}><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></svg>;
const IcPin = () => <svg {...lijn}><path d="M12 21s-6.6-5.7-6.6-11.2a6.6 6.6 0 0 1 13.2 0C18.6 15.3 12 21 12 21Z" /><circle cx="12" cy="9.8" r="2.5" /></svg>;
const IcMail = () => <svg {...lijn}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m3.5 6 8.5 7 8.5-7" /></svg>;
const IcKlok = () => <svg {...lijn}><circle cx="12" cy="12" r="8.6" /><path d="M12 7.5V12l3 2" /></svg>;
const IcBericht = () => <svg {...lijn}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></svg>;
const IcVink = () => <svg {...lijn}><path d="m5 12.5 4.2 4.2L19 7" /></svg>;

/* **woorden** = vet */
const vet = (t: string) => t.split(/\*\*(.+?)\*\*/g).map((d, j) => (j % 2 ? <b key={j}>{d}</b> : d));
/* Foto per artikel: beelden die nergens anders op de pagina staan (23 nov 2026: dia 2 stond ook als achtergrond van de dienstenband,
   de isolatiefoto ook in het dienstvak; dezelfde foto twee keer op een pagina oogt goedkoop). Pannen = panlatten met een baan pannen,
   premie = rijwoningen met dakramen en dakkapel, kost = rij oude daken. */
const tipFoto = (t: TipAb, inhoud: KgjInhoud) => (t.slug === 'pannen-leien-of-epdm' ? inhoud.hero.dias[3]
  : t.slug === 'premie-voor-uw-dak-in-2026' ? inhoud.hero.dias[1]
  : inhoud.hero.dias[0]) ?? inhoud.hero.dias[0];
const TIP_PAD = '/lp/dakwerken/tips/';
/* [woord] = in de accentkleur (zelfde schrijfwijze als de koppen in inhoud.ts). */
const metAccent = (t: string) => t.split(/(\[[^\]]+\])/g).map((d, i) => (d.startsWith('[') ? <span className="abc-accent" key={i}>{d.slice(1, -1)}</span> : d));

export default function LpBfC({ inhoud = DAKWERKEN, variant }: { inhoud?: KgjInhoud; variant?: VariantAb }) {
  /* Artikelpagina binnen de landingspagina (/lp/dakwerken/tips/:slug), zoals bfbouw.be: zelfde kopbalk, eigen kop met foto, het artikel, offerteblok.
     Dienstpagina (/lp/dakwerken/diensten/:dienst, 23 nov 2026, zie diensten-ab.ts): kop met foto, wanneer, wat de werken omvatten, wat de prijs bepaalt,
     werkwijze, vragen, de andere diensten, offerteblok. */
  const { slug, dienst: dienstSlug } = useParams();
  /* 23 nov 2026 (keuring F1, F2): pathname = de effecten hieronder draaien ook na een wissel binnen LpBfC (Lees meer, Terug); state.terug = de pagina
     waar de bezoeker op "Lees meer" tikte (bv. /lp/dakwerken/plat-dak), zodat "Terug" daar weer uitkomt. */
  const { pathname, state } = useLocation();
  const terugNaar = (typeof state === 'object' && state && typeof (state as { terug?: unknown }).terug === 'string' ? (state as { terug: string }).terug : '/lp/dakwerken');
  const tip = slug ? TIPS_AB.find((t) => t.slug === slug) : undefined;
  const dienst = dienstSlug ? inhoud.diensten.lijst.find((d) => DIENST_INFO_AB[d.id]?.slug === dienstSlug) : undefined;
  const info = dienst ? DIENST_INFO_AB[dienst.id] : undefined;
  const V: VariantInfo | undefined = variant ? VARIANTEN_AB[variant] : undefined;
  const sub = !!(tip || dienst);
  const basis = sub ? '/lp/dakwerken' : '';
  const [gescrold, setGescrold] = useState(false);
  const [menu, setMenu] = useState(false);
  const [zweef, setZweef] = useState(false);
  const vat = useRef<HTMLDivElement>(null);

  useEffect(() => { const id = CLARITY_PROJECT[inhoud.bedanktSlug]; if (id) laadClarity(id); }, [inhoud.bedanktSlug]);

  /* Vroege tik (scripts/prerender-lp.mjs): zoals LpBf. */
  useEffect(() => {
    const w = window as unknown as { __abKlaar?: boolean; __abVroeg?: number | null };
    if (w.__abKlaar) return;
    w.__abKlaar = true;
    const i = w.__abVroeg;
    w.__abVroeg = null;
    if (typeof i !== 'number') return;
    const knop = document.querySelectorAll<HTMLButtonElement>('#root button')[i];
    if (knop) setTimeout(() => knop.click(), 0);
  }, []);

  /* Message match (zoals LpBf): dak= of utm_term vult vraag 1 van de kaart in; dienst= kan de kop zetten. */
  const [match] = useState(() => {
    if (typeof window === 'undefined' || !inhoud.boodschap) return undefined;
    const p = new URLSearchParams(window.location.search);
    const vind = (k: string) => {
      const q = (p.get(k) || '').toLowerCase();
      return q.trim() ? inhoud.boodschap!.filter((b) => new RegExp(b.zoek, 'i').test(q)) : [];
    };
    const [dienst, dak, term] = [vind('dienst'), vind('dak'), vind('utm_term')];
    const kop = (dienst[0] ?? dak[0] ?? term[0])?.kop;
    const voor = [...dak, ...term].find((b) => b.voor)?.voor;
    return kop || voor ? { kop, voor } : undefined;
  });
  const voor = match?.voor ?? V?.voor ?? inhoud.voorAf;
  /* Eigen kop alleen als de zoekterm er echt een heeft (inhoud.ts boodschap, 2 nov 2026: "die varianten houden de gewone kop"; alleen herstel en
     stormschade krijgen een eigen kop, Mohammed 26 okt). De varianten plat, hellend, isolatie, renovatie en nieuw dragen de oude gewone kop van
     /lp/dakwerken (inhoud.hero.kop); op deze pagina is de gewone kop BFC.kop. 23 nov 2026, check-lp-aanvraag (message match): met
     ?utm_term=plat dak renoveren stond hier "Uw dak laten vernieuwen, renoveren of isoleren? Kies voor vakmanschap." in plaats van de gewone kop. */
  const eigenKop = match?.kop && match.kop !== inhoud.hero.kop ? match.kop : undefined;

  useEffect(() => {
    document.title = dienst ? `${dienst.naam} | AB Bouw Groep` : tip ? `${tip.titel} | AB Bouw Groep` : V ? V.titel : inhoud === DAKWERKEN ? BFC.titel : inhoud.titel;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', dienst ? (dienst.meer?.[0] ?? dienst.tekst) : tip ? tip.beschrijving : V ? V.beschrijving : inhoud.omschrijving);
    if (tip || dienst) window.scrollTo(0, 0);
  }, [inhoud, tip, dienst, V]);

  /* Kopbalk: doorzichtig over de foto bovenaan (pc), wit na 24 px scrollen. */
  useEffect(() => {
    const zet = () => setGescrold(window.scrollY > 24);
    zet();
    window.addEventListener('scroll', zet, { passive: true });
    return () => window.removeEventListener('scroll', zet);
  }, []);

  /* Zwevende berichtknop (gsm, zoals BF): pas voorbij de hero, weg zolang het offerteblok, het contactblok of de voet in beeld is.
     23 nov 2026 (keuring beeld-AB-04 en beeld-ALLE-02): ook weg zolang de realisatie (de knop lag over de pauzeknop van de video en over de tab
     "Tijdens de werken") of de postcodecheck "Komen we ook bij u langs?" (de knop lag over "Controleer") in beeld is. */
  useEffect(() => {
    const wortel = vat.current;
    if (!wortel || !('IntersectionObserver' in window)) return;
    const doelen = [...wortel.querySelectorAll('.abc-hero, .abc-sub, #realisaties, .abc-check, #contact, #gegevens, .abc-voet')];
    const zicht = new Set<Element>();
    const io = new IntersectionObserver((rijen) => {
      rijen.forEach((r) => (r.isIntersecting ? zicht.add(r.target) : zicht.delete(r.target)));
      setZweef(zicht.size === 0);
    }, { threshold: 0 });
    doelen.forEach((d) => io.observe(d));
    return () => io.disconnect();
  }, [pathname]);

  /* Menu op gsm: Escape sluit, de pagina erachter scrolt niet. */
  useEffect(() => {
    if (!menu) return;
    const toets = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    const vorig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', toets);
    return () => { document.body.style.overflow = vorig; document.removeEventListener('keydown', toets); };
  }, [menu]);

  /* Anker in de link (sitelinks #contact, #waarom, #werkwijze, #diensten, #rekenaar): na het laden springen, zoals LpBf (12 en 23 okt):
     meteen 'instant', en één correctiesprong zodra de letters (Urbanist, Inter) geladen zijn; bij een eerste bezoek (koude cache,
     advertentieklik) wordt de pagina boven het doel daarna langer (12 okt op 390 px gemeten: tot 115 px te laag). Heeft de bezoeker zelf
     gescrold (wiel, vinger, toets), dan geen correctie. Gsm, #contact: meteen de aanvraagkaart in plaats van de kop van het offerteblok.
     23 nov 2026: overgenomen na check-ankers (de nieuwe pagina sprong één keer, zonder correctie). */
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const ev = ['wheel', 'touchmove', 'keydown'] as const;
    let zelf = false;
    const merk = () => { zelf = true; };
    const los = () => ev.forEach((e) => window.removeEventListener(e, merk));
    const t = window.setTimeout(() => {
      const kaartOnder = id === 'contact' && window.matchMedia('(max-width: 1000px)').matches
        ? document.querySelector<HTMLElement>('#contact .kgj-reken--onder') : null;
      const doel = kaartOnder ?? document.getElementById(id);
      if (!doel) return;
      doel.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
      ev.forEach((e) => window.addEventListener(e, merk, { passive: true }));
      document.fonts?.ready.then(() => {
        los();
        if (!zelf) doel.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
      });
    }, 120);
    return () => { window.clearTimeout(t); los(); zelf = true; };
  }, [pathname]);

  /* Gsm en tablet (tot 1000 px): een tik op een link naar #contact (hero, menu, realisatie, uitleg, werkwijze, vragen, postcodecheck) brengt de
     aanvraagkaart zelf in beeld, zoals LpBf naarFormulier (23 okt 2026, Clarity /lp/totaalrenovatie 01:52: de sprong naar de kop van het slotblok liet de
     kaart onder het scherm staan; de bezoeker zocht en vertrok). Gemeten op deze pagina 23 nov 2026 (gewone sprong): op 390x637 stond na één antwoord
     "Stap 2 van 3" 375 px onder de kopbalk en vielen de keuzes onder het scherm (tot 721 px); op 390x664 vielen de keuzes van vraag 1 onder het scherm.
     Begonnen: "Stap x van y" direct onder de balk. Anders de kaart in het midden van het deel onder de balk als ze past, of haar bovenrand 8 px onder
     de balk. Op de computer de gewone sprong: daar staat de kaart naast de kop van het offerteblok. */
  useEffect(() => {
    const wortel = vat.current;
    if (!wortel) return;
    const klik = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href="#contact"]');
      if (!link || !window.matchMedia('(max-width: 1000px)').matches) return;
      const vorm = document.querySelector<HTMLElement>('#contact .kgj-reken--onder');
      if (!vorm) return;
      e.preventDefault();
      const kopH = Math.max(0, document.querySelector('.kgj-kop')?.getBoundingClientRect().bottom ?? 0);
      const rij = vorm.classList.contains('is-bezig') ? vorm.querySelector<HTMLElement>('.kgj-reken__kop') : null;
      /* toetsenbord: de volgende Tab begint in de kaart, zoals na een gewone ankersprong */
      const vraag = vorm.querySelector<HTMLElement>('.kgj-reken__stap .kgj-reken__vraag');
      if (vraag) { vraag.setAttribute('tabindex', '-1'); vraag.focus({ preventScroll: true }); }
      const gedrag: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      eigenScroll(); // onze scroll zet de focusstand van de kaart niet uit (Aanvraag.tsx)
      if (rij) { window.scrollTo({ top: rij.getBoundingClientRect().top + window.scrollY - kopH - 8, behavior: gedrag }); return; }
      const vrij = window.innerHeight - kopH - vorm.offsetHeight;
      window.scrollTo({ top: vorm.getBoundingClientRect().top + window.scrollY - (vrij >= 16 ? kopH + vrij / 2 : kopH + 8), behavior: gedrag });
    };
    wortel.addEventListener('click', klik);
    return () => wortel.removeEventListener('click', klik);
  }, []);

  const naarKnop = inhoud.aanvraag?.naarKnop ?? inhoud.inspectie.knop;
  const offerteKnop = (klasse = '') => <a className={`abc-knop ${klasse}`} href="#contact">{naarKnop}<IcPijl /></a>;
  const hero = inhoud === DAKWERKEN ? { src: heroNok, alt: 'Nok van een nieuw antraciet pannendak met zinken goot, onder een lichtbewolkte lucht' } : inhoud.hero.dias[0];
  const band = inhoud.hero.dias[2] ?? inhoud.hero.dias[0];
  const G = BFC.gebied;
  const K = REGIOKAART_AB;

  /* Diensten: de dienst van de subpagina eerst (VARIANTEN_AB). Foto per dienst: Dakrenovatie = het stilstaande beeld van de hoeve (dictaat 23 nov). */
  const dienstenLijst = V ? [...inhoud.diensten.lijst].sort((a, b) => Number(b.id === V.dienst) - Number(a.id === V.dienst)) : inhoud.diensten.lijst;
  const dienstFoto = (d: KgjInhoud['diensten']['lijst'][number]) => (d.id === 'renovatie' && inhoud.realisatie ? { src: inhoud.realisatie.na.poster, alt: inhoud.realisatie.na.alt } : d.foto);
  /* "Lees meer" naar de eigen dienstpagina, zoals bfbouw.be (knop onder de tekst van elke dienst). */
  const leesMeer = (id: string, naam: string) => (DIENST_INFO_AB[id]
    ? <Link className="abc-dienst__meer" to={DIENST_PAD + DIENST_INFO_AB[id].slug} state={{ terug: sub ? terugNaar : pathname }} aria-label={`Lees meer over ${naam.toLowerCase()}`}>Lees meer<IcPijl /></Link> : null);
  const werkwijze = (
    <section className="abc-proces" id="werkwijze" aria-labelledby="abc-proces-kop">
      <div className="abc-raam">
        <h2 className="abc-h2" id="abc-proces-kop">Zo werken wij</h2>
        <ol className={`abc-proces__stappen abc-proces__stappen--${BFC.stappen.length}`}>
          {BFC.stappen.map((s, i) => (
            <li key={s}><span className="abc-proces__nr" aria-hidden="true">{i + 1}</span><p><span className="abc-sr">Stap {i + 1}: </span>{s.split(/\*\*(.+?)\*\*/g).map((d, j) => (j % 2 ? <b key={j}>{d}</b> : d))}</p></li>
          ))}
        </ol>
        <p className="abc-proces__onder">{offerteKnop()}</p>
      </div>
    </section>
  );
  const vragen = inhoud.faq && inhoud.faq.lijst.length > 0 ? (
    <section className="abc-faq" id="faq" aria-labelledby="abc-faq-kop">
      <div className="abc-raam abc-faq__in">
        <h2 className="abc-h2 abc-h2--midden" id="abc-faq-kop">{inhoud.faq.kop}</h2>
        <div className="abc-faq__lijst">
          {inhoud.faq.lijst.map((f) => (
            <details key={f.v}><summary><span>{f.v}</span><span className="abc-faq__plus" aria-hidden="true" /></summary><p>{f.a}{f.link && <>{' '}<a href="#contact">{f.link}</a></>}</p></details>
          ))}
        </div>
      </div>
    </section>
  ) : null;

  /* inhoud erbij: anders zet AanvraagStaat de bewaarde antwoorden niet terug na herladen of de terugknop (check-lp-contact punt 6, 23 nov 2026) */
  return (
    <AanvraagStaat begin={() => beginStand(inhoud, voor)} inhoud={inhoud}>
    <div className={`bf bf-lp abc${menu ? ' abc--menu' : ''}`} ref={vat}>
      <header className={`abc-kop kgj-kop${gescrold ? ' is-gescrold' : ''}`} id="kop">
        <div className="abc-kop__in">
          <a className="abc-logo" href={sub ? '/lp/dakwerken' : '#top'} aria-label="AB Bouw Groep">
            <img className="abc-logo__wit" src={logoWit} width={440} height={125} alt="Logo van AB Bouw Groep" decoding="async" />
            <img className="abc-logo__ink" src={logoInk} width={440} height={125} alt="" decoding="async" />
          </a>
          <nav className="abc-menu" aria-label="Menu">
            <div className="abc-menu__groep">
              <a href={`${basis}#diensten`}>Diensten<svg className="abc-menu__pijl" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg></a>
              <div className="abc-menu__sub">{inhoud.diensten.lijst.map((d) => (DIENST_INFO_AB[d.id] ? <Link key={d.id} to={DIENST_PAD + DIENST_INFO_AB[d.id].slug}>{d.naam}</Link> : <a key={d.id} href={`${basis}#${d.id}`}>{d.naam}</a>))}</div>
            </div>
            {BFC.menu.map(([href, tekst]) => <a key={href} href={href === '#gegevens' ? href : `${basis}${href}`}>{tekst}</a>)}
          </nav>
          <div className="abc-kop__acties">
            <a className="abc-kop__tel" href={CONTACT.phone.href}><IcTel /><span>{CONTACT.phone.display}</span></a>
            <a className="abc-knop abc-kop__offerte" href="#contact">{naarKnop}</a>
            <a className="abc-knop abc-kop__bel" href={CONTACT.phone.href}><IcTel />Bel direct</a>
            <button type="button" className="abc-burger" aria-expanded={menu} aria-controls="abc-gsmmenu" aria-label={menu ? 'Menu sluiten' : 'Menu openen'} onClick={() => setMenu((m) => !m)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div className="abc-gsmmenu" id="abc-gsmmenu" hidden={!menu}>
        <nav aria-label="Menu op gsm">
          {[['#diensten', 'Diensten'] as const, ...BFC.menu].map(([href, tekst]) => <a key={href} href={href === '#gegevens' ? href : `${basis}${href}`} onClick={() => setMenu(false)}>{tekst}<IcPijl /></a>)}
        </nav>
        <div className="abc-gsmmenu__acties">
          <a className="abc-knop" href="#contact" onClick={() => setMenu(false)}>{naarKnop}<IcPijl /></a>
          <a className="abc-knop abc-knop--rand" href={CONTACT.phone.href}><IcTel />Bel {CONTACT.phone.display}</a>
        </div>
      </div>

      <main>
        {tip && (
          <>
            <section className="abc-sub" aria-labelledby="abc-sub-kop">
              <div className="abc-sub__in">
                <div className="abc-sub__tekst">
                  <Link className="abc-sub__terug" to={`${terugNaar}#blog`}><svg {...lijn}><path d="m14.5 6-6 6 6 6" /></svg>Terug naar tips en uitleg</Link>
                  <h1 id="abc-sub-kop">{tip.titel}</h1>
                  <p className="abc-sub__meta">{tip.categorie} · {tip.datumVol}</p>
                  <p className="abc-sub__intro">{tip.inleiding}</p>
                  <div className="abc-hero__knoppen">{offerteKnop()}<a className="abc-knop abc-knop--rand" href={CONTACT.phone.href}><IcTel />Bel {CONTACT.phone.display}</a></div>
                </div>
                <figure className="abc-sub__foto"><img src={tipFoto(tip, inhoud).src} alt={tipFoto(tip, inhoud).alt} decoding="async" /></figure>
              </div>
            </section>
            <section className="abc-artikel">
              {/* Vaste tekst uit tips-ab.ts (woordelijk bfbouw.be), geen invoer van bezoekers. */}
              <div className="abc-raam abc-lees" dangerouslySetInnerHTML={{ __html: tip.inhoud }} />
            </section>
          </>
        )}
        {dienst && info && (
          <>
            <section className="abc-sub" aria-labelledby="abc-sub-kop">
              <div className="abc-sub__in">
                <div className="abc-sub__tekst">
                  <Link className="abc-sub__terug" to={`${terugNaar}#diensten`}><svg {...lijn}><path d="m14.5 6-6 6 6 6" /></svg>Terug naar alle diensten</Link>
                  <h1 id="abc-sub-kop">{dienst.naam}</h1>
                  <p className="abc-sub__intro">{dienst.meer?.[0] ?? dienst.tekst}</p>
                  <div className="abc-hero__knoppen">{offerteKnop()}<a className="abc-knop abc-knop--rand" href={CONTACT.phone.href}><IcTel />Bel {CONTACT.phone.display}</a></div>
                </div>
                {(() => { const ft = dienstFoto(dienst); return ft && <figure className="abc-sub__foto"><img src={ft.src} alt={ft.alt} decoding="async" /></figure>; })()}
              </div>
            </section>
            <section className="abc-dinfo" aria-labelledby="abc-dinfo-wanneer">
              <div className="abc-raam abc-dinfo__in">
                <div className="abc-dinfo__blok">
                  <h2 className="abc-h2" id="abc-dinfo-wanneer">{info.wanneerKop}</h2>
                  <ul className="abc-dinfo__vinken">{info.wanneer.map((t) => <li key={t}><span aria-hidden="true"><IcVink /></span>{t}</li>)}</ul>
                </div>
                <div className="abc-dinfo__blok">
                  <h2 className="abc-h2">{info.aanpakKop}</h2>
                  {(dienst.meer ?? []).slice(1).map((t) => <p key={t}>{t}</p>)}
                  <ol className="abc-dinfo__stappen">{info.aanpak.map((t, i) => <li key={t}><span className="abc-dinfo__nr" aria-hidden="true">{i + 1}</span>{t}</li>)}</ol>
                </div>
              </div>
            </section>
            <section className="abc-dinfo abc-dinfo--tint" aria-labelledby="abc-dinfo-prijs">
              <div className="abc-raam">
                <div className="abc-dinfo__kader">
                  <div>
                    <h2 className="abc-h2" id="abc-dinfo-prijs">Wat bepaalt de prijs?</h2>
                    <ul className="abc-dinfo__vinken">{info.prijs.map((t) => <li key={t}><span aria-hidden="true"><IcVink /></span>{t}</li>)}</ul>
                  </div>
                  <div className="abc-dinfo__actie">
                    <p className="abc-dinfo__vast">U ontvangt een vrijblijvende offerte met een vaste prijs.</p>
                    {offerteKnop()}
                  </div>
                </div>
              </div>
            </section>
            {werkwijze}
            {vragen}
            <section className="abc-dandere" aria-labelledby="abc-dandere-kop">
              <div className="abc-raam">
                <h2 className="abc-h2" id="abc-dandere-kop">Onze andere diensten</h2>
                <ul className="abc-diensten__rij abc-diensten__rij--3">
                  {inhoud.diensten.lijst.filter((d) => d.id !== dienst.id).map((d) => (
                    <li className="abc-dienst" key={d.id}>
                      {(() => { const ft = dienstFoto(d); return ft && <figure className="abc-dienst__foto"><img src={ft.src} alt={ft.alt} loading="lazy" decoding="async" /></figure>; })()}
                      <div className="abc-dienst__lijf">
                        <span className="abc-dienst__ic" aria-hidden="true"><Icoon naam={d.icoon} /></span>
                        <h3>{d.naam}</h3>
                        <p>{d.tekst}</p>
                        {leesMeer(d.id, d.naam)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
        {!tip && !dienst && (<>
        <section className="abc-hero" id="top">
          <img className="abc-hero__foto" src={hero.src} alt={hero.alt} loading="eager" decoding="async" {...{ fetchpriority: 'high' }} />
          <div className="abc-hero__laag" aria-hidden="true" />
          <div className="abc-hero__in">
            <p className="abc-hero__regio"><span className="abc-hero__pin"><IcPin /></span>{V?.regio ?? BFC.regio}</p>
            <h1 className="abc-hero__kop">
              <span>{eigenKop ? metAccent(eigenKop) : V?.kop ?? BFC.kop}</span>{' '}
              <span className="abc-accent">{BFC.kop2}</span>
            </h1>
            <p className="abc-hero__sub"><b>{V?.subVet ?? BFC.subVet}</b> {BFC.sub}</p>
            <div className="abc-hero__knoppen">
              {offerteKnop()}
              <a className="abc-knop abc-knop--rand" href={BFC.knop2.href}>{BFC.knop2.tekst}</a>
            </div>
          </div>
        </section>

        <section className="abc-kiezen" id="waarom" aria-labelledby="abc-kiezen-kop">
          <div className="abc-raam abc-kiezen__in">
            <figure className="abc-kiezen__foto"><img src={werfDakwerkers} alt="Twee dakwerkers op een dak waar de oude pannen af zijn; de panlatten liggen bloot" loading="lazy" decoding="async" /></figure>
            <div className="abc-kiezen__tekst">
              <h2 className="abc-h2" id="abc-kiezen-kop">Waarom voor ons kiezen</h2>
              <ul className="abc-kiezen__lijst">
                {BFC.kiezen.map((k) => (
                  <li key={k.titel}><span className="abc-kiezen__ic">{k.icoon}</span><div><h3>{k.titel}</h3><p>{k.tekst}</p></div></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="abc-diensten" id="diensten" aria-labelledby="abc-diensten-kop">
          <div className="abc-diensten__band">
            <img src={band.src} alt="" loading="lazy" decoding="async" />
            <div className="abc-raam abc-diensten__kop"><h2 className="abc-h2" id="abc-diensten-kop">{inhoud.diensten.kop}</h2>{inhoud.diensten.onder && <p>{inhoud.diensten.onder}</p>}</div>
          </div>
          <div className="abc-raam">
            <ul className={`abc-diensten__rij abc-diensten__rij--${inhoud.diensten.lijst.length}`}>
              {dienstenLijst.map((d) => (
                <li className="abc-dienst" id={d.id} key={d.id}>
                  {/* 23 nov 2026, Mohammed: "gebruik de stilstaande na foto van de hoeve bij dakwerken diensten bij ab bij dakrenovatie": het stilstaande
                      beeld van de drone na de werken (realisatie-hoeve.ts, na.poster) op het vak Dakrenovatie. */}
                  {(() => { const ft = dienstFoto(d);
                    return ft && <figure className="abc-dienst__foto"><img src={ft.src} alt={ft.alt} loading="lazy" decoding="async" /></figure>; })()}
                  <div className="abc-dienst__lijf">
                    <span className="abc-dienst__ic" aria-hidden="true"><Icoon naam={d.icoon} /></span>
                    <h3>{d.naam}</h3>
                    <p>{d.tekst}</p>
                    {leesMeer(d.id, d.naam)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 23 nov 2026 (keuring techniek-AB-01): geen id op deze omhulling; de sectie in Realisatie.tsx draagt id="realisaties" al (was dubbel) */}
        {inhoud.realisatie && (
          <div className="abc-real">
            <Realisatie r={inhoud.realisatie} knop={offerteKnop('bf-real__cta')} />
            {/* Tweede realisatie (23 nov 2026, zie de import van dakkapelAanbouw): zelfde opmaak als de hoeve, één foto. Alleen wat op de foto te zien is,
                geen plaats, duur of prijs (daar is geen bron voor). */}
            <section className="bf-sblok bf-lprealisatie abc-real2" id="realisatie-dakkapel" aria-labelledby="realisatie-dakkapel-kop">
              <div className="bf-sraam">
                <div className="bf-real">
                  <div className="bf-real__beeld">
                    <div className="bf-real__podium">
                      <img src={dakkapelAanbouw} alt="Achtergevel tijdens de werken: een dakkapel en een aanbouw met verticale houten bekleding, grote zwarte schuiframen en twee vakmannen op het dak" loading="lazy" decoding="async" />
                      <span className="bf-real__label" aria-hidden="true">Tijdens de werken</span>
                    </div>
                  </div>
                  <div className="bf-real__info">
                    <h2 className="bf-real__project" id="realisatie-dakkapel-kop">Dakkapel en aanbouw met houten gevelbekleding</h2>
                    <p className="bf-real__werkenkop">Uitgevoerde werken</p>
                    <ul className="bf-real__werken">
                      {['Dakkapel met twee ramen en houten bekleding', 'Aanbouw met houten gevelbekleding', 'Grote schuiframen in zwarte profielen'].map((w) => <li key={w}><span className="bf-real__vink" aria-hidden="true"><Check /></span>{w}</li>)}
                    </ul>
                    <div className="bf-real__knop">{offerteKnop('bf-real__cta')}</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {inhoud.uitleg && (
          <section className="abc-uitleg" aria-labelledby="abc-uitleg-kop">
            <div className="abc-raam abc-uitleg__in">
              <div className="abc-uitleg__tekst">
                <h2 className="abc-h2" id="abc-uitleg-kop">{inhoud.uitleg.kop}</h2>
                {BFC.nodig.map((t) => <p key={t}>{vet(t)}</p>)}
                {offerteKnop()}
              </div>
              <figure className="abc-uitleg__foto"><img src={inhoud.uitleg.foto.src} alt={inhoud.uitleg.foto.alt} loading="lazy" decoding="async" /></figure>
            </div>
          </section>
        )}

        {werkwijze}

        {inhoud.voordelen && (
          <section className="abc-voordelen" aria-labelledby="abc-voordelen-kop">
            <div className="abc-raam">
              <h2 className="abc-h2 abc-h2--midden" id="abc-voordelen-kop">{inhoud.voordelen.kop}</h2>
              <VoordelenRij lijst={inhoud.voordelen.lijst} />
            </div>
          </section>
        )}

        <section className="abc-gebied" id="regio" aria-labelledby="abc-gebied-kop">
          <div className="abc-raam abc-gebied__in">
            <div className="abc-gebied__tekst">
              <h2 className="abc-h2" id="abc-gebied-kop">{G.kop}</h2>
              <p className="abc-gebied__sub">{G.sub}</p>
              <div className="abc-gebied__adres"><span className="abc-gebied__pin"><IcPin /></span><div><b>AB Bouw Groep</b><span>{CONTACT.address.full}</span></div></div>
              {G.provincies.map((p) => (
                <div className="abc-gebied__provincie" key={p.naam}>
                  <p className="abc-gebied__provnaam">Heel {p.naam}</p>
                  <ul className="abc-gebied__chips">{p.steden.map((g) => <li key={g}>{g}</li>)}</ul>
                </div>
              ))}
              {/* 23 nov 2026, Mohammed: "Komen we ook bij u langs? moet trouwens op de plek offerte aanvragen, niet boven" */}
              <RegioCheck />
            </div>
            <figure className="abc-gebied__kaart">
              <svg viewBox={`0 0 ${K.W} ${K.H}`} role="img" aria-label={`Kaart van het werkgebied: ${G.thuis}, ${G.provincies.map((p) => p.naam).join(' en ')}`}>
                <g className="abc-gebied__vlakken">{K.vlakken.map((v) => <path key={v.naam} className={v.naam === G.thuis ? 'is-thuis' : undefined} d={v.d} fillRule="evenodd" />)}</g>
                <g className="abc-gebied__namen">{K.labels.filter((l) => G.opKaart.includes(l.naam)).map((l) => (
                  <g key={l.naam} className={l.naam === G.thuis ? 'is-thuis' : undefined}><circle cx={l.x} cy={l.y} r={l.naam === G.thuis ? 5 : 3.4} /><text x={l.x} y={l.y - 10} textAnchor="middle">{l.naam}</text></g>
                ))}</g>
              </svg>
              <figcaption>{K.bron}</figcaption>
            </figure>
          </div>
        </section>

        {inhoud.zekerheden && inhoud.zekerheden.length > 0 && (
          <section className="abc-zeker" aria-label="Uw zekerheden bij AB Bouw Groep">
            <div className="abc-zeker__baan">
              {[0, 1].map((n) => (
                <ul key={n} aria-hidden={n === 1 ? true : undefined}>
                  {inhoud.zekerheden!.map((z) => <li key={z.tekst}><span className="abc-zeker__ic">{ZEKER_ICOON[z.icoon]}</span><b>{z.tekst}</b></li>)}
                </ul>
              ))}
            </div>
          </section>
        )}

        {vragen}

        </>)}

        {/* Tips en uitleg zoals bfbouw.be: drie artikels als kaarten (pc naast elkaar, gsm een per een te vegen); op een artikelpagina de andere. */}
        <section className="abc-blog" id="blog" aria-labelledby="abc-blog-kop">
          <div className="abc-raam">
            <h2 className="abc-h2 abc-h2--midden" id="abc-blog-kop">Tips en uitleg</h2>
            <div className="abc-blog__rij">
              {TIPS_AB.filter((t) => !tip || t.slug !== tip.slug).slice(0, 3).map((t) => (
                <article className="abc-post" key={t.slug}>
                  <img className="abc-post__beeld" src={tipFoto(t, inhoud).src} alt={tipFoto(t, inhoud).alt} loading="lazy" decoding="async" />
                  <div className="abc-post__datum"><b>{t.datumKort}</b><span>{t.jaar}</span></div>
                  <p className="abc-post__cat">{t.categorie}</p>
                  <h3 className="abc-post__titel">{t.titel}</h3>
                  <div className="abc-post__voet"><Link className="abc-knop abc-post__knop" to={TIP_PAD + t.slug} state={{ terug: sub ? terugNaar : pathname }} aria-label={`Lees meer: ${t.titel}`}>Lees meer</Link></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Offerteblok: de bestaande vorm (bf-lpinsp) en de bestaande aanvraagkaart. #contact = de sitelink "Gratis offerte"; #rekenaar = de oude
            sitelinks "Bereken uw dakprijs". */}
        <section className="bf-lpinsp abc-offerte" id="contact" aria-labelledby="contact-kop">
          <img className="bf-lpinsp__beeld" src={inhoud === DAKWERKEN ? slotFoto : inhoud.cta.foto.src} alt={inhoud === DAKWERKEN ? 'Hellend pannendak in het avondlicht' : inhoud.cta.foto.alt} loading="lazy" decoding="async" />
          <div className="bf-lpinsp__laag" aria-hidden="true" />
          <div className="bf-lpinsp__in">
            <div className="bf-lpinsp__tekst">
              <h2 id="contact-kop">{inhoud.cta.kop}</h2>
              {inhoud.cta.tekst && <p>{inhoud.cta.tekst}</p>}
              {inhoud.cta.punten.length > 0 && (
                <ul className="bf-lpinsp__stappen">{inhoud.cta.punten.map((p) => <li key={p}><span><IcVink /></span>{p}</li>)}</ul>
              )}
              <a className="bf-lpinsp__bel" href={CONTACT.phone.href}><IcTel />Bel {CONTACT.phone.display}</a>
            </div>
            <div className="bf-lpinsp__kaartvak" id="rekenaar">
              <Aanvraag inhoud={inhoud} voor={voor} plek="onder" />
            </div>
          </div>
        </section>

        <ContactBlok inhoud={inhoud} />
      </main>

      <a className={`abc-zweef${zweef ? ' is-zichtbaar' : ''}`} href="#gegevens" aria-label="Stuur ons een bericht" tabIndex={zweef ? 0 : -1} aria-hidden={!zweef}><IcBericht /></a>
      <AfrondKnop />

      <footer className="abc-voet kgj-voet">
        <div className="abc-raam abc-voet__raster">
          <div className="abc-voet__merk">
            <img src={logoWit} width={440} height={125} alt="Logo van AB Bouw Groep" loading="lazy" decoding="async" />
            <p>{V?.regio ?? BFC.regio}, door AB Bouw Groep.</p>
          </div>
          <div className="abc-voet__kolom"><h2>Diensten</h2><ul>{inhoud.diensten.lijst.map((d) => <li key={d.id}>{DIENST_INFO_AB[d.id] ? <Link to={DIENST_PAD + DIENST_INFO_AB[d.id].slug}>{d.naam}</Link> : <a href={`${basis}#${d.id}`}>{d.naam}</a>}</li>)}</ul></div>
          <div className="abc-voet__kolom"><h2>Navigatie</h2><ul>{BFC.menu.map(([href, tekst]) => <li key={href}><a href={href === '#gegevens' ? href : `${basis}${href}`}>{tekst}</a></li>)}<li><a href="#contact">{naarKnop}</a></li></ul></div>
          <div className="abc-voet__kolom abc-voet__contact"><h2>Contact</h2><ul>
            <li><span className="abc-voet__ic"><IcTel /></span><a href={CONTACT.phone.href}>{CONTACT.phone.display}</a></li>
            <li><span className="abc-voet__ic"><IcMail /></span><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            {/* 23 nov 2026 (keuring beeld-AB-03): het huisnummer stond alleen op een regel ("August van Landeghemstraat" / "63"); nu een harde spatie
                voor het nummer en op de computer blijft de straat op één regel (lp-bfc.css) */}
            <li><span className="abc-voet__ic"><IcPin /></span><span><span className="abc-voet__straat">{CONTACT.address.street.replace(/ (\d+\w*)$/, '\u00a0$1')}</span><br />{CONTACT.address.postcode} {CONTACT.address.city}</span></li>
          </ul></div>
        </div>
        <div className="abc-raam abc-voet__onder">
          <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> AB Bouw Groep · BTW {CONTACT.btw.display} · {CONTACT.address.full}</p>
          <div><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/voorwaarden">Voorwaarden</a></div>
        </div>
      </footer>
    </div>
    </AanvraagStaat>
  );
}

/* Contactblok zoals bfbouw.be (#contact daar, hier #gegevens: #contact is op AB de sitelink naar het offerteblok). Het bericht gaat via
   submitLead (GHL + Web3Forms parallel, conversie alleen bij bezorging), net als de aanvraagkaart; de lead herkent u aan "Bericht" in
   aanvullende_info. Een telefoonnummer is verplicht, een e-mailadres niet. */
/* 23 nov 2026, Mohammed: "de voordelen van een dakrenovatie swipent": tot 1000 px een veegbare rij (lp-bfc.css) met stipjes eronder,
   zoals bfbouw.be (site.js .veeghint). Het stipje van de kaart die links in beeld staat, is breed en goud. */
function VoordelenRij({ lijst }: { lijst: NonNullable<KgjInhoud['voordelen']>['lijst'] }) {
  const rij = useRef<HTMLUListElement>(null);
  const [actief, setActief] = useState(0);
  /* 23 nov 2026 (keuring beeld-AB-05): op tablet (768 px) staat de rij na één veeg al aan het einde en bereikt de linkerrand van de laatste kaart de
     rijrand nooit; aan het einde (scrollLeft binnen 2 px van het maximum) is daarom altijd het laatste stipje actief. */
  const meet = () => {
    const r = rij.current; if (!r) return;
    const n = r.children.length;
    if (n && r.scrollLeft >= r.scrollWidth - r.clientWidth - 2 && r.scrollLeft > 0) { setActief(n - 1); return; }
    const links = r.getBoundingClientRect().left; let best = 0, af = Infinity;
    Array.from(r.children).forEach((k, i) => { const x = Math.abs((k as HTMLElement).getBoundingClientRect().left - links - 16); if (x < af) { af = x; best = i; } });
    setActief(best);
  };
  return (
    <>
      <ul className="abc-voordelen__rij" ref={rij} onScroll={meet}>
        {lijst.map((v, i) => (
          <li key={v.titel}><span className="abc-voordelen__nr" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span className="abc-voordelen__ic" aria-hidden="true"><Icoon naam={v.icoon} /></span><h3>{v.titel}</h3><p>{v.tekst}</p></li>
        ))}
      </ul>
      <div className="abc-veeghint" aria-hidden="true">{lijst.map((v, i) => <span key={v.titel} className={i === actief ? 'is-actief' : undefined} />)}</div>
    </>
  );
}

/* "Aanvraag afronden" (19 nov 2026, Mohammed: "ze maken het form af, maar scrollen dan om te lezen", "en dan raken ze verdwaald", "iets technisch dat je
   makkelijk terug kan invullen"; op bfbouw.be maakt site.js de knop voor elke aanvraagkaart, ook als er alleen een kaart onderaan staat). In Aanvraag.tsx
   beheert alleen de kaart bovenaan deze knop; deze pagina heeft alleen de kaart onderaan, dus stond hier geen knop (23 nov 2026, check-lp-smal punt 4:
   "de knop bestaat niet").
   Zelfde regel, opmaak (.kgj-afronden, lp-bf-ab.css) en Clarity-gebeurtenis als daar: staat de bezoeker voorbij vraag 1 (een latere vraag, het
   contactblok of de offertestappen) en is de kaart niet in beeld, dan onderaan een vaste knop; een tik geeft het event ab-afronden voor de kaart
   onderaan, die dan doet wat ze na een stap doet (Aanvraag.tsx inBeeld). Zolang de knop staat: html.is-afronden (de zwevende berichtknop wijkt,
   lp-bfc.css). De knop hangt direct in de wortel (.bf.bf-lp): geen voorouder met overflow, transform of filter (Safari, zoals de sluier). */
function AfrondKnop() {
  const levend = useGedeeldeAanvraag()?.stand;
  const verderDanStart = !!levend && levend.aangetikt && (levend.stap > 0 || !!levend.offerte) && !levend.vraagToestemming;
  const [aan, setAan] = useState(false);
  useEffect(() => {
    let raf = 0;
    const kijk = () => {
      raf = 0;
      if (!verderDanStart) { setAan(false); return; }
      const kop = document.querySelector<HTMLElement>('.kgj-kop'), kcs = kop && getComputedStyle(kop);
      const kb = kop && kcs && kcs.position === 'fixed' && kcs.visibility !== 'hidden' ? Math.max(0, kop.getBoundingClientRect().bottom) : 0;
      const zicht = [...document.querySelectorAll<HTMLElement>('.kgj-reken--aanvraag')].some((k) => {
        const r = k.getBoundingClientRect();
        return r.height > 0 && r.bottom > kb + 24 && r.top < window.innerHeight - 24;
      });
      setAan(!zicht);
    };
    const plan = () => { if (!raf) raf = requestAnimationFrame(kijk); };
    plan();
    window.addEventListener('scroll', plan, { passive: true });
    window.addEventListener('resize', plan);
    return () => { window.removeEventListener('scroll', plan); window.removeEventListener('resize', plan); if (raf) cancelAnimationFrame(raf); };
  }, [verderDanStart]);
  useEffect(() => { document.documentElement.classList.toggle('is-afronden', aan); }, [aan]);
  useEffect(() => () => { document.documentElement.classList.remove('is-afronden'); }, []);
  const terug = () => {
    meldClarity('aanvraag-afronden');
    window.dispatchEvent(new CustomEvent('ab-afronden', { detail: 'onder' }));
  };
  return (
    <button type="button" className={`kgj-afronden${aan ? ' is-aan' : ''}`} aria-hidden={!aan} tabIndex={aan ? 0 : -1} onClick={terug}>
      Aanvraag afronden<IcPijl />
    </button>
  );
}

function ContactBlok({ inhoud }: { inhoud: KgjInhoud }) {
  const [velden, setVelden] = useState({ naam: '', telefoon: '', email: '', bericht: '' });
  const [fouten, setFouten] = useState<Partial<Record<keyof typeof velden, string>>>({});
  const [melding, setMelding] = useState('');
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const zet = (k: keyof typeof velden) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const w = e.target.value;
    setVelden((v) => ({ ...v, [k]: w }));
    if (fouten[k]) setFouten((f) => ({ ...f, [k]: undefined }));
  };
  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f: typeof fouten = {};
    if (velden.naam.trim().length < 2) f.naam = 'Vul uw naam in.';
    if (!velden.telefoon.trim()) f.telefoon = 'Vul uw telefoonnummer in.';
    else if (!telGeldig(velden.telefoon.trim())) f.telefoon = 'Dit telefoonnummer klopt niet.';
    if (velden.email.trim() && !mailGeldig(mailKaal(velden.email))) f.email = 'Dit e-mailadres klopt niet.';
    if (velden.bericht.trim().length < 5) f.bericht = 'Schrijf uw bericht.';
    setFouten(f);
    const eerste = (['naam', 'telefoon', 'email', 'bericht'] as const).find((k) => f[k]);
    if (eerste) { document.getElementById(`abc-bericht-${eerste}`)?.focus(); return; }
    setBezig(true); setMelding('Bezig met versturen…');
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: inhoud.divisie,
      firstName: velden.naam.trim(),
      email: velden.email.trim() ? mailKaal(velden.email) : '',
      phone: velden.telefoon.trim(),
      type_werk: inhoud.divisie,
      aanvullende_info: `Bericht via de landingspagina: ${velden.bericht.trim().replace(/\s+/g, ' ').slice(0, 1500)}`,
      bron_lead: inhoud.inspectie.bronLead,
    });
    setBezig(false);
    if (!res.ok) { setMelding(leadFoutmelding(res, CONTACT.phone.display)); meldClarity('bericht-mislukt'); return; }
    meldClarity('bericht-verstuurd');
    setMelding('');
    setKlaar(true);
  };
  const veld = (k: 'naam' | 'telefoon' | 'email', label: string, type: string, auto: string, verplicht: boolean) => (
    <div className="abc-veld">
      <label htmlFor={`abc-bericht-${k}`}>{label}{verplicht && <span className="abc-ster" aria-hidden="true">*</span>}</label>
      <input id={`abc-bericht-${k}`} type={type} autoComplete={auto} inputMode={k === 'telefoon' ? 'tel' : k === 'email' ? 'email' : undefined}
        value={velden[k]} onChange={zet(k)} aria-required={verplicht || undefined} aria-invalid={fouten[k] ? true : undefined} aria-describedby={`abc-bericht-${k}-fout`} />
      <p className="abc-veld__fout" id={`abc-bericht-${k}-fout`} hidden={!fouten[k]}>{fouten[k]}</p>
    </div>
  );
  return (
    <section className="abc-contact" id="gegevens" aria-labelledby="abc-contact-kop">
      <div className="abc-raam abc-contact__in">
        <div className="abc-contact__tekst">
          <h2 className="abc-h2" id="abc-contact-kop">Neem contact met ons op</h2>
          <div className="abc-contact__snel"><span className="abc-contact__snelic"><IcKlok /></span><div><b>Snel antwoord</b><p>{BFC.snel}</p></div></div>
          <dl className="abc-contact__gegevens">
            <div className="abc-contact__bel"><dt>Bel ons</dt><dd><a href={CONTACT.phone.href}>{CONTACT.phone.display}</a></dd></div>
            <div><dt>Mail ons</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
            {/* 23 nov 2026 (keuring beeld-AB-02): postcode en gemeente blijven samen ("2830" stond los van "Willebroek"); is er geen plaats voor één regel,
                dan breekt het adres na de komma, zoals op INzicht en BF */}
            <div><dt>Adres</dt><dd>{CONTACT.address.street}, <span className="abc-nw">{CONTACT.address.postcode} {CONTACT.address.city}</span></dd></div>
          </dl>
        </div>
        <div className="abc-contact__vak">
          {klaar ? (
            <div className="abc-contact__klaar" role="status"><h3>Bedankt, uw bericht is verstuurd.</h3><p>Wij nemen binnen 24 uur contact op.</p></div>
          ) : (
            <form className="abc-bericht" onSubmit={verstuur} noValidate>
              <h3>Stuur ons een bericht</h3>
              <div className="abc-bericht__rij">{veld('naam', 'Naam', 'text', 'name', true)}{veld('telefoon', 'Telefoon', 'tel', 'tel', true)}</div>
              {veld('email', 'E-mail', 'email', 'email', false)}
              <div className="abc-veld">
                <label htmlFor="abc-bericht-bericht">Uw bericht<span className="abc-ster" aria-hidden="true">*</span></label>
                <textarea id="abc-bericht-bericht" rows={4} maxLength={1500} value={velden.bericht} onChange={zet('bericht')} aria-required aria-invalid={fouten.bericht ? true : undefined} aria-describedby="abc-bericht-bericht-fout" />
                <p className="abc-veld__fout" id="abc-bericht-bericht-fout" hidden={!fouten.bericht}>{fouten.bericht}</p>
              </div>
              {melding && <p className="abc-bericht__melding" role="status">{melding}</p>}
              <button type="submit" className="abc-knop" disabled={bezig}>Verstuur bericht<IcPijl /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* "Komen we ook bij u langs?" (23 nov 2026, Mohammed: "kijk of we ook in uw regio komen ofzoiets, en dan postcode invoeren, en dat je makkelijk kan
   klikken op een knop, en dan dat er een ding komt van we werken ook in .... in het groen en dan offerte aanvragen of neem contact met ons op").
   23 nov 2026, Mohammed: "op pagina van ab hoef je niet antwerpen ... uit te sluiten, het is gewoon dat ze niet concurreren in de ads, maar als iemand
   daar postal van antwerpen intypt ... show gewoon dat je daar werkt".
   23 nov 2026, Mohammed: "geef gewoon ALLES wat ze daar invoeren groen, want de ads gaan toch alleen locaties targeten waar wij werken" en "met de juiste
   naam erbij dan uiteraard". Dus: elke bestaande Belgische postcode geeft het groene vak "We werken ook in {gemeente}." met de gemeente waartoe die
   postcode nu hoort (fusies van 1 jan 2025 inbegrepen, bv. 9150 = Beveren-Kruibeke-Zwijndrecht). Bron van de naam: src/data/postcode-gemeente.json
   (scripts/maak-postcode-gemeente.mjs, 23 nov 2026): de 1145 postcodes van de bpost-lijst src/data/postcodes-be.json, elk gekoppeld aan haar gemeente
   via OpenStreetMap. Vier cijfers die niet in die lijst staan: een melding, geen groen vak. Niets wordt verstuurd. */
function RegioCheck() {
  const [pc, setPc] = useState('');
  const [uitkomst, setUitkomst] = useState<{ soort: 'ja'; gemeente: string } | { soort: 'onbekend' | 'fout' | 'mislukt' } | null>(null);
  /* Alleen het antwoord op de laatste invoer telt: de lijst laadt de eerste keer asynchroon. */
  const beurt = useRef(0);
  const controleer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nr = ++beurt.current;
    const p = pc.replace(/\D/g, '');
    if (!/^\d{4}$/.test(p)) { setUitkomst({ soort: 'fout' }); return; }
    /* 23 nov 2026 (keuring techniek-AB-02): laadt de lijst niet (netwerkfout, of een open tabblad na een nieuwe uitrol met andere bestandsnamen), dan
       een melding zoals op INzicht in plaats van niets en een scriptfout; een volgende klik probeert opnieuw. */
    let gemeenten: Record<string, string>;
    try {
      gemeenten = (await import('@/data/postcode-gemeente.json')).default as Record<string, string>;
    } catch {
      if (nr === beurt.current) { setUitkomst({ soort: 'mislukt' }); meldClarity('regio-check-mislukt'); }
      return;
    }
    if (nr !== beurt.current) return;
    const gemeente = gemeenten[p];
    if (gemeente) { setUitkomst({ soort: 'ja', gemeente }); meldClarity('regio-check-ja'); return; }
    setUitkomst({ soort: 'onbekend' });
    meldClarity('regio-check-onbekend');
  };
  return (
    <div className="abc-check">
      <p className="abc-check__kop">Komen we ook bij u langs?</p>
      <form className="abc-check__rij" onSubmit={controleer} noValidate>
        <label className="abc-sr" htmlFor="abc-check-pc">Uw postcode</label>
        <input id="abc-check-pc" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={4} placeholder="Uw postcode" value={pc}
          onChange={(e) => { beurt.current++; setPc(e.target.value.replace(/\D/g, '').slice(0, 4)); setUitkomst(null); }} aria-describedby="abc-check-uitkomst" />
        <button type="submit" className="abc-knop abc-knop--donker">Controleer</button>
      </form>
      <div id="abc-check-uitkomst" role="status" aria-live="polite">
        {uitkomst?.soort === 'fout' && <p className="abc-check__fout">Vul een postcode van 4 cijfers in.</p>}
        {uitkomst?.soort === 'onbekend' && <p className="abc-check__fout">Deze postcode vinden we niet. Kijk ze even na.</p>}
        {uitkomst?.soort === 'mislukt' && <p className="abc-check__fout">Controleren lukte niet. Probeer het opnieuw.</p>}
        {uitkomst?.soort === 'ja' && (
          <div className="abc-check__ja">
            <p><span className="abc-check__vink"><IcVink /></span>We werken ook in {uitkomst.gemeente}.</p>
            <div className="abc-check__knoppen"><a className="abc-knop" href="#contact">Offerte aanvragen<IcPijl /></a><a className="abc-knop abc-knop--lijn" href="#gegevens">Neem contact met ons op</a></div>
          </div>
        )}
      </div>
    </div>
  );
}
