import { Fragment, useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/data/contact';
import Rekenaar from './Rekenaar';
import Aanvraag from './Aanvraag';
import Inspectie from './Inspectie';
import ChatAssistent from './ChatAssistent';
import Werkspoor from './Werkspoor';
import { Icoon } from './Iconen';
import { IcChevron } from '../replica/Iconen';
import { DAKWERKEN, type KgjInhoud, type Sectie, type StapIcoon } from './inhoud';
import { CLARITY_PROJECT, laadClarity } from '@/lib/clarity';
import logoWit from '@/assets/bf/logo-wit-440.webp';
import logoInk from '@/assets/bf/logo-ink-440.webp';
/* Voetlogo: hetzelfde bestand als de voet van LpKgj (r.12, r.788): "beelden EXACT zoals nu" (spec §17). */
import logo from '@/assets/home/logo-trim.png';
import '../../bf/bf.css';
import '../../bf/bf-ab.css';
import './lp-bf.css';
import './lp-bf-ab.css';

/**
 * Landingspagina in de stijl van bfbouw.be (spec/bf-stijl.md §17, OPDRACHT MOHAMMED 12 okt:
 * "en doe ook de dakwerken en totaalrenovatie lp in de nieuwe stijl").
 *
 * Alleen de stijl verandert. Dit omhulsel leest HETZELFDE inhoudsobject als LpKgj.tsx (KgjInhoud) en
 * gebruikt dezelfde logica-componenten: Rekenaar, Inspectie (met PostcodeGemeente en Toestemming),
 * ChatAssistent en Werkspoor. Velden, validatie, payload (bron_lead incl. :hero/:venster), /bedankt-URL,
 * trackFormStart, Toestemming en Clarity zitten in die componenten en in de effecten hieronder, die
 * LpKgj.tsx regel voor regel volgen: message match, Clarity via laadClarity, ankers na het laden,
 * vaste balk op de telefoon, het venster met de rekenaar.
 *
 * De markup en de klassen zijn die van BF lp-dak (bfbouw-website/bouw/lp-dak.cjs), met bf-voorvoegsel en
 * gescoopt onder .bf.bf-lp (CSS: lp-bf.css gegenereerd door scripts/bf-css-port-lp.cjs, plus lp-bf-ab.css).
 * De kop draagt OOK de klasse kgj-kop: Rekenaar.tsx (scrolfix) en check-rekenaar-scroll.cjs meten die.
 *
 * Bewust weg (§17): menu, voetlinkenlijst, reviews, cijferband met claims, scroll-reveal (lock 3 aug);
 * contactkolom blijft (live-inhoud): voetlogo, zin, Contact met adres, telefoon, e-mail en btw, zoals LpKgj r.785-809.
 * De Google-badge "5,0 op Google" mag (spec §1). Beelden exact zoals in het inhoudsobject (keuze Mohammed 12 okt).
 * Geen canonical (zoals LpKgj; index.html houdt https://abgroep.be/).
 *
 * LpKgj.tsx blijft ongewijzigd staan als terugval: de route terugzetten in App.tsx is één regel.
 *
 * 19 okt 2026 (heroAanvraag, Mohammed: "bouw de abgroep totaalrenovatie en dakwerken lp naar de nieuwe, dus rekenaar weg,
 * en doe dat naar dakinspectie en gratis plaatsbezoek form bovenaan"): de aanvraagkaart (Aanvraag.tsx) staat in de hero op
 * de plek van de rekenaar, en de pagina heeft geen enkele rekenaar-ingang meer (zie zonderRekenaar hieronder).
 */

/* Google-profiel van AB (spec §1, zelfde plaats als bf/schil.ts GOOGLE_PROFIEL). */
const GOOGLE_PROFIEL = 'https://www.google.com/maps/place//data=!4m3!3m2!1s0x4a0341ae3b55ce5d:0x7d0fc6746e96d5bf';

/* ---------- iconen: BF-lijnstijl (bfbouw build.cjs r.39-71, bf/schil.ts ICOON) ---------- */
const IcTel = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.6 16.6 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5z" />
    <path d="M14.5 3.8a6 6 0 0 1 5.7 5.7M14.3 7.2a2.8 2.8 0 0 1 2.5 2.5" />
  </svg>
);
const IcPijl = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" /></svg>
);
const IcVink = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8" /></svg>
);
const IcGoogle = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.7 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);
const IcSter = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L10 15l-5.4 2.9 1.1-6.1L1.2 7.6l6.1-.8z" /></svg>
);
/* 13 okt, Mohammed: "die plaatsbezoek knop, haal de kalender logo weg overal": de plaatsbezoekknoppen (hero, kop,
   midden, slotblok) hebben geen kalendericoon meer. */

/* Eerstvolgend vrij plaatsbezoek, live uit Bardhs agenda (zelfde GHL-kalender en free-slots-API als BedanktBf.tsx).
   Het antwoord is per dag ("2026-10-15": { slots: ["2026-10-15T10:00:00+02:00", ...] }) plus metavelden. Geen antwoord
   binnen 5 s, een foutcode of geen enkel vrij moment: niets tonen (nooit een verzonnen datum). */
const KALENDER_ID = 'ST3uIpAM7kFEokIm2NM7';
const TZ = 'Europe/Brussels';
function dagIn(ms: number) {
  const d = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(ms).map((p) => [p.type, p.value]));
  return `${d.year}-${d.month}-${d.day}`;
}
/* ruimte (aanvraagkaart, 19 okt 2026): de regel houdt zijn plek vanaf het eerste beeld vrij, zo hoog als de langst mogelijke
   datum ("donderdag 30 september"), en het antwoord komt erin zonder dat de kaart verschuift. Zonder die ruimte schoof de
   kaart een tel na het laden: op de gsm zakten de keuzes ongeveer 40 px (een tik kon op de verkeerde keuze vallen), op de
   computer schoof de gecentreerde kaart 16 px omhoog (check-ankers: /lp/totaalrenovatie#rekenaar op 76 px in plaats van 92).
   Komt er geen vrij moment, dan valt de regel weg, zoals zonder ruimte. */
function VrijMoment({ ruimte = false }: { ruimte?: boolean }) {
  const [tekst, setTekst] = useState<string | null>(null);
  const [mislukt, setMislukt] = useState(false);
  useEffect(() => {
    let weg = false;
    const ctl = new AbortController();
    const klok = window.setTimeout(() => ctl.abort(), 5000);
    const nu = Date.now();
    fetch(`https://backend.leadconnectorhq.com/calendars/${KALENDER_ID}/free-slots?startDate=${nu}&endDate=${nu + 15 * 864e5}&timezone=Europe%2FBrussels`, { signal: ctl.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d: Record<string, { slots?: unknown }>) => {
        const eerste = Object.values(d ?? {}).flatMap((v) => (Array.isArray(v?.slots) ? v.slots : []))
          .map((s) => Date.parse(String(s))).filter((t) => t > nu).sort((a, b) => a - b)[0];
        if (weg) return;
        if (!eerste) { setMislukt(true); return; }
        const vandaag = dagIn(nu), dag = dagIn(eerste), morgen = dagIn(nu + 864e5);
        const datum = new Intl.DateTimeFormat('nl-BE', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(eerste);
        setTekst(dag === vandaag ? 'vandaag' : dag === morgen ? 'morgen' : datum);
      })
      .catch(() => { if (!weg) setMislukt(true); })
      .finally(() => window.clearTimeout(klok));
    return () => { weg = true; ctl.abort(); window.clearTimeout(klok); };
  }, []);
  if (!ruimte) {
    if (!tekst) return null;
    return <p className="bf-lphero__vrij"><span className="bf-lphero__stip" aria-hidden="true" /><span>Eerstvolgend vrij plaatsbezoek: <b>{tekst}</b></span></p>;
  }
  if (!tekst && mislukt) return null;
  return (
    <p className={`bf-lphero__vrij${tekst ? '' : ' bf-lphero__vrij--wacht'}`} aria-hidden={tekst ? undefined : true}>
      <span className="bf-lphero__stip" aria-hidden="true" />
      <span className="bf-lphero__vrijtekst">
        <span className="bf-lphero__vrijmaat" aria-hidden="true">Eerstvolgend vrij plaatsbezoek: <b>donderdag 30 september</b></span>
        {tekst && <span>Eerstvolgend vrij plaatsbezoek: <b>{tekst}</b></span>}
      </span>
    </p>
  );
}

/* Dezelfde iconen als LpKgj.tsx r.53-87 (redenen, stappen, oplossing), lijn 1,8 zoals BF. De key staat VÓÓR de spread:
   na de spread valt JSX terug op createElement en gaf React een key-waarschuwing in de console (ook op LpKgj, gemeten 12 okt). */
const lijn = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
const REDEN_ICONEN = [
  <svg key="schild" {...lijn}><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" /><path d="m8.8 12 2.2 2.2 4.3-4.4" /></svg>,
  <svg key="agenda" {...lijn}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="m9 15 2 2 4-4" /></svg>,
  <svg key="premie" {...lijn}><circle cx="12" cy="12" r="8.6" /><path d="M15.2 8.6a4 4 0 1 0 0 6.8M7.2 10.8h5.6M7.2 13.2h5.6" /></svg>,
];
const STAP_ICONEN = [
  <svg key="aanvraag" {...lijn}><path d="M21 3 3 10.5l7 2.6 2.6 7.4z" /><path d="m10 13.1 5-5" /></svg>,
  <svg key="huis" {...lijn}><path d="M3.2 10.6 12 3.4l8.8 7.2V20a1 1 0 0 1-1 1H4.2a1 1 0 0 1-1-1z" /><path d="M9.4 21v-6.2h5.2V21" /></svg>,
  <svg key="papier" {...lijn}><path d="M6 2.9h7.4L18.4 8v13.1H6z" /><path d="M13.4 2.9V8h5" /><path d="M9 12.2h6.4M9 15.4h6.4M9 18.6h3.6" /></svg>,
  <svg key="dak" {...lijn}><path d="M2.5 12.5 12 4l9.5 8.5" /><path d="M5.5 10v10h13V10" /><path d="M9 20v-5h6v5" /></svg>,
  <svg key="nazorg" {...lijn}><circle cx="12" cy="12" r="8.6" /><path d="m8.4 12.2 2.4 2.4 4.8-5" /></svg>,
];
const STAP_ICOON: Record<StapIcoon, JSX.Element> = {
  pin: <svg {...lijn}><path d="M12 21s-6.6-5.7-6.6-11.2a6.6 6.6 0 0 1 13.2 0C18.6 15.3 12 21 12 21Z" /><circle cx="12" cy="9.8" r="2.5" /></svg>,
  offerte: STAP_ICONEN[2],
  agenda: REDEN_ICONEN[1],
  helm: <svg {...lijn}><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" /><path d="M14 6a6 6 0 0 1 6 6v3" /><path d="M4 15v-3a6 6 0 0 1 6-6" /><rect x="2" y="15" width="20" height="4" rx="1" /></svg>,
  sleutel: <svg {...lijn}><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" /><path d="m21 2-9.6 9.6" /><circle cx="7.5" cy="15.5" r="5.5" /></svg>,
};
const OPLOSSING_ICONEN = [
  <svg key="schild" {...lijn}><path d="M12 2.5 4.5 5.6v5.7c0 4.8 3.2 8.3 7.5 9.7 4.3-1.4 7.5-4.9 7.5-9.7V5.6Z" /><path d="m8.6 12 2.4 2.4 4.4-4.6" /></svg>,
  <svg key="bezem" {...lijn}><path d="m20.5 3.5-8 8" /><path d="M11 10.2 13.8 13c.6.6.6 1.6 0 2.2l-5.4 5.4a1.6 1.6 0 0 1-2.2 0L3.4 17.8a1.6 1.6 0 0 1 0-2.2l5.4-5.4c.6-.6 1.6-.6 2.2 0Z" /><path d="m6.6 14.6 2.8 2.8M4.8 16.4l2.8 2.8" /></svg>,
  <svg key="euro" {...lijn}><path d="M17.8 6.2A7.4 7.4 0 1 0 17.8 17.8" /><path d="M4.4 10h9.2M4.4 14h9.2" /></svg>,
];
/* De volgorde van de secties tussen hero en slotblok, zoals LpKgj.tsx r.91. */
const STANDAARD_VOLGORDE: Sectie[] = ['waarom', 'voordelen', 'diensten', 'werkwijze', 'uitgevoerd', 'voorna', 'reviews', 'faq'];

/* "Titel: uitleg" toont de titel in het vet (LpKgj.tsx r.108-118, zelfde woorden). */
const metVet = (t: string) => {
  const i = t.indexOf(': ');
  return i > 0 ? <><strong>{t.slice(0, i + 1)}</strong>{t.slice(i + 1)}</> : t;
};
const metKop = (t: string) => {
  const i = t.indexOf(': ');
  return i > 0 ? <><strong>{t.slice(0, i)}</strong><span className="bf-lphero__uitleg">{t.slice(i + 2)}</span></> : t;
};

/* De kop van de hero: tekst tussen [ ] in de merkkleur met de BF-streep eronder, \n = vaste breuk (LpKgj r.354-358).
   kop2 = tweede regel in gedempt wit, zoals de kop op de homepage (blokken.ts hero: bf-hero__kop2). */
function HeroKop({ kop, kop2 }: { kop: string; kop2?: string }) {
  return (
    <h1 className="bf-lphero__kop">
      {kop.split(/\[([^\]]+)\]/).map((deel, i) => (i % 2
        ? (
          <span className="bf-lphero__accent" key={i}>{deel}
            <svg className="bf-lphero__streep" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true"><path d="M4 12C70 4 160 3 296 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>
          </span>
        )
        : deel.split('\n').map((regel, j, alle) => <Fragment key={`${i}-${j}`}>{regel}{j < alle.length - 1 && <>{' '}<br /></>}</Fragment>)))}
      {kop2 && <>{' '}<span className="bf-lphero__kop2">{kop2}</span></>}
    </h1>
  );
}

/* Google-badge (spec §1: "5,0 op Google" + 5 sterren MAG, aantal reviews NOOIT). */
function GoogleBadge({ klasse }: { klasse: string }) {
  return (
    <a className={klasse} href={GOOGLE_PROFIEL} target="_blank" rel="noopener">
      <span className="bf-over__g"><IcGoogle /></span>
      <span><span className="bf-over__sterren" aria-hidden="true"><IcSter /><IcSter /><IcSter /><IcSter /><IcSter /></span><b>5,0 op Google</b></span>
    </a>
  );
}

export default function LpBf({ inhoud = DAKWERKEN }: { inhoud?: KgjInhoud }) {
  const vat = useRef<HTMLDivElement>(null);
  const [dia, setDia] = useState(0);
  const [balk, setBalk] = useState(false);
  const [gescrold, setGescrold] = useState(false);
  const [schuif, setSchuif] = useState(50);
  /* De rekenaar in een venster (LpKgj r.130-133): elke knop "Bereken uw prijs" opent hem waar de bezoeker is. */
  const [venster, setVenster] = useState(false);
  const vensterVak = useRef<HTMLDivElement>(null);
  const vensterTerug = useRef<HTMLElement | null>(null);
  const dienstFotos = !!inhoud.diensten.vlakken || inhoud.diensten.lijst.some((d) => d.foto);
  /* Aanvraagkaart in de hero (heroAanvraag, 19 okt 2026): dan nergens een ingang naar de rekenaar. Geen rekenaarknop in
     waarom en werkwijze (daar een knop naar het formulier onderaan), geen vangnet, geen venster, geen knop "Liever eerst een
     prijs?" in het formulier onderaan en geen rekenaarknop in de chat. */
  const heroAanvraag = !!inhoud.heroAanvraag && !!inhoud.aanvraag;
  const zonderRekenaar = heroAanvraag;

  /* Microsoft Clarity (LpKgj r.137-138): project per bedanktSlug, via laadClarity. */
  useEffect(() => { const id = CLARITY_PROJECT[inhoud.bedanktSlug]; if (id) laadClarity(id); }, [inhoud.bedanktSlug]);

  /* Venster: Escape sluit, de pagina erachter scrolt niet (LpKgj r.139-146). Toegankelijkheid: de focus gaat
     naar het venster zelf (tabIndex -1, geen ring) en na het sluiten terug naar de knop die het venster opende.
     Herstel 13 okt: de focus ging naar de sluitknop; bij binnenkomst via de sitelink #rekenaar toonde de browser dan een
     bruine focusring rond × (2 px op 1265, 3 px op 390), het eerste wat het oog trof, vóór de eerste vraag. De eerste Tab
     gaat nu naar de sluitknop, met de ring.
     Focusval (aria-modal, herstel 12 okt: na 'Plat dak' sprong Tab naar de belknop in de kop achter het venster):
     alles naast het venster krijgt inert zolang het open is, en Tab / Shift+Tab gaan rond binnen het venster. */
  useEffect(() => {
    if (!venster) return;
    const vak = () => document.querySelector<HTMLElement>('.bf-lpvenster__in');
    const toets = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setVenster(false); return; }
      if (e.key !== 'Tab') return;
      const v = vak();
      if (!v) return;
      const stops = [...v.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((el) => el.getClientRects().length > 0);
      if (!stops.length) return;
      const eerste = stops[0], laatste = stops[stops.length - 1];
      const actief = document.activeElement as HTMLElement | null;
      const binnen = !!actief && v.contains(actief);
      /* Focus op het venster zelf (net geopend): Tab gaat naar de eerste stop (de browser doet dat zelf), Shift+Tab naar de laatste. */
      if (e.shiftKey && (!binnen || actief === eerste || actief === v)) { e.preventDefault(); laatste.focus(); }
      else if (!e.shiftKey && (!binnen || actief === laatste)) { e.preventDefault(); eerste.focus(); }
    };
    const buren = vat.current ? [...vat.current.children].filter((k) => !k.classList.contains('bf-lpvenster')) : [];
    buren.forEach((k) => k.setAttribute('inert', ''));
    const vorig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', toets);
    vensterVak.current?.focus({ preventScroll: true });
    return () => {
      buren.forEach((k) => k.removeAttribute('inert'));
      document.body.style.overflow = vorig;
      document.removeEventListener('keydown', toets);
      vensterTerug.current?.focus?.({ preventScroll: true });
    };
  }, [venster]);
  const openVenster = () => { vensterTerug.current = document.activeElement as HTMLElement | null; setVenster(true); };

  const schuifVak = useRef<HTMLDivElement>(null);
  const sleept = useRef(false);

  /* Message match (LpKgj r.153-174, ongewijzigd): kop volgt dienst= vóór dak= vóór utm_term; vraag 1 alleen
     vooraf via dak= of utm_term. Alleen lezen, niets bewaren. */
  const [match] = useState(() => {
    if (typeof window === 'undefined' || !inhoud.boodschap) return undefined;
    const p = new URLSearchParams(window.location.search);
    const vind = (k: string) => {
      const q = (p.get(k) || '').toLowerCase();
      return q.trim() ? inhoud.boodschap!.filter((b) => new RegExp(b.zoek, 'i').test(q)) : [];
    };
    const [dienst, dak, term] = [vind('dienst'), vind('dak'), vind('utm_term')];
    const kop = (dienst[0] ?? dak[0] ?? term[0])?.kop;
    if (!kop) return undefined;
    return { kop, voor: [...dak, ...term].find((b) => b.voor)?.voor };
  });
  const kop = match?.kop ?? inhoud.hero.kop;

  /* Kop: transparant over de hero, wit zodra er 24 px gescrold is (BF site.js r.7-8, bf/gedrag.ts stap 1). */
  useEffect(() => {
    const zet = () => setGescrold(window.scrollY > 24);
    zet();
    window.addEventListener('scroll', zet, { passive: true });
    return () => window.removeEventListener('scroll', zet);
  }, []);

  /* De vaste balk onderaan de telefoon (LpKgj r.181-201): weg zodra een rekenaar, het formulier of de
     heroknop voor minstens 25 % in beeld staat. */
  useEffect(() => {
    const wortel = vat.current;
    if (!wortel || !('IntersectionObserver' in window)) return;
    const kaarten = [...wortel.querySelectorAll('.kgj-reken, .bf-lphero__knop')];
    if (!kaarten.length) return;
    const inBeeld = new Set<Element>();
    const kijker = new IntersectionObserver((rijen) => {
      for (const r of rijen) {
        if (r.isIntersecting) inBeeld.add(r.target);
        else inBeeld.delete(r.target);
      }
      setBalk(inBeeld.size === 0);
    }, { threshold: 0.25 });
    kaarten.forEach((k) => kijker.observe(k));
    return () => kijker.disconnect();
  }, []);

  useEffect(() => {
    document.title = inhoud.titel;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', inhoud.omschrijving);
  }, [inhoud]);

  /* Anker in de link (sitelinks #contact, #rekenaar, #waarom, #werkwijze, #top): na het laden springen
     (LpKgj r.209-221). Staat de rekenaar in het vangnet, dan opent #rekenaar ook het venster.
     Meteen 'instant' springen (geen zachte scroll): de bezoeker staat binnen één frame bij het doel en scroll
     anchoring houdt hem daar. Eén correctiesprong zodra Plus Jakarta Sans geladen is: bij een eerste bezoek (koude
     cache, advertentieklik) wordt de pagina boven het doel daarna langer (gemeten 12 okt op 390 px: #contact en
     #werkwijze 115 px te laag, #diensten 90 px). Heeft de bezoeker zelf gescrold (wiel, vinger, toets), dan geen
     correctie. Geen scroll-event als signaal: de eigen sprong vuurt die ook; geen touchstart/pointerdown: een tik
     op de cookiebanner is geen scroll. */
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    if (id === 'rekenaar' && inhoud.vangnet && !inhoud.heroRekenaar && !zonderRekenaar) setVenster(true);
    const ev = ['wheel', 'touchmove', 'keydown'] as const;
    let zelf = false;
    const merk = () => { zelf = true; };
    const los = () => ev.forEach((e) => window.removeEventListener(e, merk));
    const t = window.setTimeout(() => {
      const doel = document.getElementById(id);
      if (!doel) return;
      doel.scrollIntoView({ block: 'start', behavior: 'instant' });
      ev.forEach((e) => window.addEventListener(e, merk, { passive: true }));
      document.fonts?.ready.then(() => {
        los();
        if (!zelf) doel.scrollIntoView({ block: 'start', behavior: 'instant' });
      });
    }, 120);
    return () => { window.clearTimeout(t); los(); zelf = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Herofoto's: om de zes seconden de volgende, stil als het tabblad niet zichtbaar is; geen diashow bij
     "minder beweging" (LpKgj r.223-240). Overvloeien 1,4 s zoals BF (bf.css .bf-hero__slides). */
  useEffect(() => {
    const n = inhoud.hero.dias.length;
    if (n < 2 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let klok: number | null = null;
    const stop = () => { if (klok !== null) { window.clearInterval(klok); klok = null; } };
    const start = () => { stop(); klok = window.setInterval(() => setDia((d) => (d + 1) % n), 6000); };
    const zicht = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', zicht);
    start();
    return () => { stop(); document.removeEventListener('visibilitychange', zicht); };
  }, [inhoud]);

  /* Werkwijze op gsm (≤1000 px): de stap in het midden van het scherm licht op (BF site.js r.354-355, bf/gedrag.ts
     r.202 traject is-in-beeld, zelfde breedtevoorwaarde). Op de computer niet: spec §4 en de lock van 3 aug (geen
     scroll-effecten). Toestand, geen scroll-reveal: niets verschijnt of beweegt. */
  useEffect(() => {
    const wortel = vat.current;
    if (!wortel || !('IntersectionObserver' in window) || !window.matchMedia?.('(max-width: 1000px)').matches) return;
    const stappen = wortel.querySelectorAll('.bf-pstap');
    const io = new IntersectionObserver((rijen) => rijen.forEach((r) => r.target.classList.toggle('bf-is-in-beeld', r.isIntersecting)), { rootMargin: '-45% 0px -45% 0px' });
    stappen.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* Voor/na (LpKgj r.291-305): slepen met pointer-events, de range-input blijft voor het toetsenbord. */
  const paren = [{ voor: inhoud.voorna.voor, na: inhoud.voorna.na, label: inhoud.voorna.label }, ...(inhoud.voorna.meer ?? [])];
  const [paar, setPaar] = useState(0);
  const huidig = paren[paar] ?? paren[0];
  const wissel = (r: -1 | 1) => { setPaar((p) => (p + r + paren.length) % paren.length); setSchuif(50); };
  const zetSchuif = (x: number) => {
    const el = schuifVak.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width > 0) setSchuif(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  };

  /* De knop in de vaste balk brengt de bezoeker naar het formulier onderaan (LpKgj r.762-775, ongewijzigd). */
  const naarFormulier = () => {
    const vorm = document.querySelector<HTMLElement>('.kgj-reken--inspectie');
    if (!vorm) return;
    const kopH = Math.max(0, ...['.kgj-kop', '.kgj-topbalk'].map((s) => document.querySelector(s)?.getBoundingClientRect().bottom ?? 0));
    if (vorm.offsetHeight <= window.innerHeight - kopH) {
      vorm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    window.scrollTo({ top: vorm.getBoundingClientRect().top + window.scrollY - kopH - 8, behavior: 'smooth' });
  };

  /* Zonder rekenaar (heroAanvraag, 19 okt 2026): op dezelfde plek een knop naar het aanvraagformulier onderaan (#contact),
     met de knoptekst van dat formulier. Zo doet bfbouw.be/lp/dakwerken het met de aanvraag bovenaan: de knoppen verderop
     scrollen naar het formulier onderaan (Mohammed 9 okt, bouw/lp-dak.cjs cta), en de werkwijze zegt "via het formulier
     hieronder". */
  const rekenKnop = (klasse: string) => (zonderRekenaar
    ? <a className={`bf-knop bf-lpcta__knop ${klasse}`} href="#contact">{inhoud.inspectie.knop}<IcPijl /></a>
    : <button type="button" className={`bf-knop bf-lpcta__knop ${klasse}`} onClick={openVenster}>Bereken uw prijs<IcPijl /></button>
  );

  const secties: Record<Sectie, React.ReactNode> = {
    waarom: inhoud.waarom.kolommen ? (
      /* Totaalrenovatie (5 okt): kop, intro en drie zekerheden als kolommen. BF: waarden--3 op grijs, met het grote grijze
         nummer 01-03 rechtsboven (BF lp-dak.cjs r.236 waarde__nr). Het nummer is aria-hidden versiering, geen tekst: de
         woorden blijven die van live (LpKgj r.428-435, spec §17). Herstel 13 okt: de rechterbovenhoek bleef leeg. */
      <section className="bf-sblok bf-sblok--grijs bf-lpvoordelen bf-lpwaarom--kolommen" id="waarom" aria-labelledby="waarom-kop">
        <div className="bf-sraam">
          <h2 className="bf-h2 bf-h2--midden" id="waarom-kop">{inhoud.waarom.kop}</h2>
          {inhoud.waarom.intro && <p className="bf-lpsectie__onder">{inhoud.waarom.intro}</p>}
          <div className="bf-waarden bf-waarden--3">
            {inhoud.waarom.redenen.map((r, i) => (
              <article className="bf-waarde" key={r.titel}>
                <span className="bf-waarde__nr" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="bf-waarde__icoon">{OPLOSSING_ICONEN[i % OPLOSSING_ICONEN.length]}</span>
                <h3>{r.titel}</h3><p>{r.tekst}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    ) : inhoud.waarom.tegenover ? (
      /* Frustratie links in een donker vak, de oplossing rechts met drie iconen (5 okt). */
      <section className="bf-sblok bf-lpwaarom bf-lpwaarom--tegenover" id="waarom" aria-labelledby="waarom-kop">
        <div className="bf-sraam">
          <h2 className="bf-h2 bf-h2--midden" id="waarom-kop">{inhoud.waarom.kop}</h2>
          <div className="bf-lptegenover">
            <div className="bf-lptegenover__probleem"><p>{inhoud.waarom.tekst}</p></div>
            <div className="bf-lptegenover__oplossing">
              <p className="bf-lptegenover__intro">{inhoud.waarom.tegenover}</p>
              <ul className="bf-lpredenen">
                {inhoud.waarom.redenen.map((r, i) => (
                  <li key={r.titel}><span className="bf-lpredenen__ic">{OPLOSSING_ICONEN[i % OPLOSSING_ICONEN.length]}</span><div><h3>{r.titel}</h3><p>{r.tekst}</p></div></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    ) : (
      /* Dak: BF lpwaarom (duo: tekst + foto), met de drie AB-redenen en de knop die het venster opent. De knop staat
         direct onder de alinea en vóór de redenen, zoals live (LpKgj r.469-481); de Google-badge ernaast mag (§1). */
      <section className="bf-sblok bf-lpwaarom" id="waarom" aria-labelledby="waarom-kop">
        <div className="bf-duo">
          <div className="bf-duo__tekst">
            <h2 className="bf-h2" id="waarom-kop">{inhoud.waarom.kop}</h2>
            <p>{inhoud.waarom.tekst}</p>
            <div className="bf-lpwaarom__acties">
              {rekenKnop('bf-lpwaarom__knop')}
              <GoogleBadge klasse="bf-over__google" />
            </div>
            <ul className="bf-lpredenen">
              {inhoud.waarom.redenen.map((r, i) => (
                <li key={r.titel}><span className="bf-lpredenen__ic">{REDEN_ICONEN[i % REDEN_ICONEN.length]}</span><div><h3>{r.titel}</h3><p>{r.tekst}</p></div></li>
              ))}
            </ul>
          </div>
          <figure className="bf-duo__foto bf-lpwaarom__fotos">
            <img src={inhoud.waarom.duo[0].src} alt={inhoud.waarom.duo[0].alt} loading="lazy" decoding="async" />
            <img src={inhoud.waarom.duo[1].src} alt={inhoud.waarom.duo[1].alt} loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>
    ),

    /* Voordelen (26 sep): BF lpvoordelen, drie kaarten met icoon op grijs. Zonder de BF-nummers 01/02/03: live
       (LpKgj r.499-507) toont er geen (tekst woordelijk, spec §17). */
    voordelen: inhoud.voordelen && (
      <section className="bf-sblok bf-sblok--grijs bf-lpvoordelen" id="voordelen" aria-labelledby="voordelen-kop">
        <div className="bf-sraam">
          <h2 className="bf-h2 bf-h2--midden" id="voordelen-kop">{inhoud.voordelen.kop}</h2>
          <div className="bf-waarden bf-waarden--3">
            {inhoud.voordelen.lijst.map((v) => (
              <article className="bf-waarde" key={v.titel}>
                <span className="bf-waarde__icoon"><Icoon naam={v.icoon} /></span>
                <h3>{v.titel}</h3><p>{v.tekst}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),

    /* Diensten: BF lpdiensten (dkaarten zonder link). De id per dienst is het anker van een sitelink. Zonder
       foto staat het icoon op een licht vlak (Mohammed, 3 okt), zoals nu. Met foto: de ronde BF-badge met het
       dienst-icoon op de fotorand (BF build.cjs r.262 dkaart__icoon, aria-hidden; herstel 13 okt). */
    diensten: (
      <section className="bf-sblok bf-lpdiensten" id="diensten" aria-labelledby="diensten-kop">
        <div className="bf-sraam">
          <h2 className="bf-h2 bf-h2--midden" id="diensten-kop">{inhoud.diensten.kop}</h2>
          {inhoud.diensten.onder && <p className="bf-lpsectie__onder">{inhoud.diensten.onder}</p>}
          <ul className={`bf-dkaarten__raster bf-dkaarten__raster--lp${dienstFotos ? '' : ' bf-lpdiensten--kort'}`}>
            {inhoud.diensten.lijst.map((d) => (
              <li className="bf-dkaart" id={d.id} key={d.id}>
                {dienstFotos ? (
                  <div className="bf-dkaart__media">
                    {d.foto
                      ? <><img className="bf-dkaart__beeld" src={d.foto.src} alt={d.foto.alt} loading="lazy" decoding="async" /><span className="bf-dkaart__icoon" aria-hidden="true"><Icoon naam={d.icoon} /></span></>
                      : <span className="bf-lpdienst__vlak" aria-hidden="true"><Icoon naam={d.icoon} /></span>}
                  </div>
                ) : <span className="bf-lpdienst__ic" aria-hidden="true"><Icoon naam={d.icoon} /></span>}
                <div className="bf-dkaart__body">
                  <h3>{d.naam}</h3>
                  {d.tekst && <p>{d.tekst}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),

    /* Werkwijze: BF procesBlok (intro + stapkaarten met icoon en nummer), zonder foto: het inhoudsobject
       heeft er geen (beelden zoals nu). Nummer "01"-"05" zoals live (LpKgj r.562). De knop staat NA de stappen,
       zoals live (LpKgj r.571-581, midknop): op de gsm leest de bezoeker eerst de uitleg. */
    werkwijze: (
      <section className="bf-proces bf-lpproces" id="werkwijze" aria-labelledby="werkwijze-kop">
        <div className="bf-proces__top bf-lpproces__top">
          <div className="bf-proces__intro">
            <h2 className="bf-h2" id="werkwijze-kop">{inhoud.werkwijze.kop}</h2>
            {inhoud.werkwijze.onder && <p className="bf-proces__tekst">{inhoud.werkwijze.onder}</p>}
          </div>
        </div>
        <ol className={`bf-proces__stappen bf-proces__stappen--${inhoud.werkwijze.stappen.length}`}>
          {inhoud.werkwijze.stappen.map((s, i) => (
            <li className="bf-pstap" key={s.titel}>
              <div className="bf-pstap__top">
                <span className="bf-pstap__ic" aria-hidden="true">{s.icoon ? STAP_ICOON[s.icoon] : STAP_ICONEN[i % STAP_ICONEN.length]}</span>
                <span className="bf-pstap__nr">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{s.titel}</h3>
              <p>{s.tekst}</p>
              {/* Verbindingspijl naar de volgende stap (BF bf/blokken.ts r.132 PIJL); bf.css regelt plek, kleur en verbergen vanaf 1001 px. */}
              {i < inhoud.werkwijze.stappen.length - 1 && (
                <svg className="bf-pstap__pijl" viewBox="0 0 48 28" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 22c6-12 16-17 27-14 5 1.5 8 4 10 7" /><path d="M33 16l7 .5 1-7" /></svg>
              )}
            </li>
          ))}
        </ol>
        {inhoud.hero.knop ? (
          <div className="bf-lpmidknop"><a className="bf-knop bf-proces__knop" href="#contact">{inhoud.hero.knop.tekst}</a></div>
        ) : !inhoud.vangnet && (
          <div className="bf-lpmidknop">{rekenKnop('bf-proces__knop')}</div>
        )}
      </section>
    ),

    /* Uitgevoerd werk (renovatie, 28 sep): het doorlopende fotospoor, zelfde component als nu. */
    uitgevoerd: inhoud.uitgevoerd && inhoud.uitgevoerd.fotos.length > 0 && (
      <section className="bf-sblok bf-lpuitgevoerd" id="uitgevoerd" aria-labelledby="uitgevoerd-kop">
        <div className="bf-sraam">
          <h2 className="bf-h2 bf-h2--midden" id="uitgevoerd-kop">{inhoud.uitgevoerd.kop}</h2>
          {inhoud.uitgevoerd.onder && <p className="bf-lpsectie__onder">{inhoud.uitgevoerd.onder}</p>}
          <div className="bf-lpkgj"><Werkspoor fotos={inhoud.uitgevoerd.fotos} label="Uitgevoerde projecten" /></div>
        </div>
      </section>
    ),

    /* Voor/na: de schuif van de BF-home (bf-ab.css .bf-voorna), met het gedrag van LpKgj r.602-646. */
    voorna: (
      <section className="bf-sblok bf-sblok--grijs bf-lpvoorna" id="voorna" aria-labelledby={inhoud.voorna.kop ? 'voorna-kop' : undefined}>
        <div className="bf-sraam">
          {inhoud.voorna.kop && <h2 className="bf-h2 bf-h2--midden" id="voorna-kop">{inhoud.voorna.kop}</h2>}
          <p className="bf-lpsectie__onder">{inhoud.voorna.onder}</p>
          <figure className="bf-lpvoorna__paar">
            <div className="bf-voorna">
              <div className="bf-voorna__vak" ref={schuifVak} style={{ '--pos': `${schuif}%` } as React.CSSProperties}
                onPointerDown={(e) => { sleept.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); zetSchuif(e.clientX); }}
                onPointerMove={(e) => { if (sleept.current) zetSchuif(e.clientX); }}
                onPointerUp={(e) => { sleept.current = false; const el = e.currentTarget as HTMLElement; if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); }}
                onPointerCancel={() => { sleept.current = false; }}>
                <img className="bf-voorna__beeld" src={huidig.na.src} alt={huidig.na.alt} loading="lazy" decoding="async" />
                <div className="bf-voorna__voor"><img className="bf-voorna__beeld" src={huidig.voor.src} alt={huidig.voor.alt} loading="lazy" decoding="async" /></div>
                {/* Zelfde woorden en volgorde als live (LpKgj r.616-627): "Na", "Voor", greep "‹ ›". De plek in beeld
                    (Voor links, Na rechts) komt uit de CSS, niet uit de volgorde. */}
                <span className="bf-voorna__label bf-voorna__label--na">Na</span>
                <span className="bf-voorna__label bf-voorna__label--voor">Voor</span>
                <span className="bf-voorna__lijn" aria-hidden="true">
                  <span className="bf-voorna__greep bf-voorna__greep--tekst" aria-hidden="true">‹ ›</span>
                </span>
                <input className="bf-voorna__bereik" type="range" min={0} max={100} step={0.1} value={schuif}
                  aria-label={inhoud.voorna.onder} onChange={(e) => setSchuif(Number(e.target.value))} />
              </div>
            </div>
            {inhoud.voorna.hint && <p className="bf-lpvoorna__hint">{inhoud.voorna.hint}</p>}
            {huidig.label && <figcaption>{huidig.label}</figcaption>}
          </figure>
          {paren.length > 1 && (
            <div className="bf-lpkgj">
              <div className="kgj-schuif__wissel">
                <div className="pc-bediening">
                  <button type="button" aria-label="Vorige voor en na" onClick={() => wissel(-1)}><IcChevron richting="links" /></button>
                  <span className="pc-bediening-tel" aria-live="polite">{paar + 1} / {paren.length}</span>
                  <button type="button" aria-label="Volgende voor en na" onClick={() => wissel(1)}><IcChevron richting="rechts" /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    ),

    /* Reviews: NOOIT (spec §1, §12). Het inhoudsobject heeft overal een lege lijst; ook gevuld komt er niets. */
    reviews: null,

    /* Vangnet (totaalrenovatie, 5 okt): draagt het anker #rekenaar; de knop opent het venster of gaat naar de
       losse rekenaarpagina met de parameters van de advertentieklik (LpKgj r.684-705). */
    vangnet: !zonderRekenaar && inhoud.vangnet && (
      <section className="bf-sblok bf-sblok--grijs bf-lpvangnet" id="rekenaar" aria-labelledby="vangnet-kop">
        <div className="bf-sraam bf-lpvangnet__in">
          <h2 className="bf-h2 bf-h2--midden" id="vangnet-kop">{inhoud.vangnet.kop}</h2>
          {inhoud.vangnet.tekst && <p className="bf-lpsectie__onder">{inhoud.vangnet.tekst}</p>}
          {inhoud.vangnet.href ? (
            <a className="bf-knop bf-knop--licht bf-lpcta__knop bf-lpvangnet__knop" href={inhoud.vangnet.href + (typeof window !== 'undefined' ? window.location.search : '')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20h16" /><path d="M7 16.5V11M12 16.5V6M17 16.5v-8" /></svg>
              {inhoud.vangnet.knop}
            </a>
          ) : (
            <button type="button" className="bf-knop bf-knop--licht bf-lpcta__knop bf-lpvangnet__knop" onClick={openVenster}>{inhoud.vangnet.knop}</button>
          )}
        </div>
      </section>
    ),

    /* Veelgestelde vragen (29 sep): de BF-vragenkaarten van de home (bf-ab.css .bf-vragen), <details> zonder JS.
       Alle vragen dicht bij het laden, zoals live (LpKgj r.716-721). Zonder de gouden streep van de home onder de kop:
       geen andere kop op de LP's en op BF lp-dak draagt er een (herstel 13 okt). */
    faq: inhoud.faq && inhoud.faq.lijst.length > 0 && (
      <section className="bf-vragen" id="faq" aria-labelledby="faq-kop">
        <h2 className="bf-h2 bf-h2--midden" id="faq-kop">{inhoud.faq.kop}</h2>
        <div className="bf-vragen__lijst">
          {inhoud.faq.lijst.map((f) => (
            <details className="bf-vraag" key={f.v}>
              <summary>{f.v}<span className="bf-vraag__plus" aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  };

  const vertrouwen = heroAanvraag ? (inhoud.aanvraag?.vertrouwen ?? []) : (inhoud.rekenaar.vertrouwen ?? inhoud.hero.bewijs);
  /* Wat er rechts in de hero staat: de aanvraagkaart (heroAanvraag, 19 okt), de rekenaar (geen knop, of heroRekenaar), het
     plaatsbezoekformulier (heroFormulier) of alleen de knop in de tekstkolom. heroAanvraag wint, dan heroRekenaar (13 okt). */
  const heroReken = !heroAanvraag && (!inhoud.hero.knop || !!inhoud.heroRekenaar);
  const heroForm = !heroAanvraag && !heroReken && !!inhoud.heroFormulier;
  const heroKnop = !heroAanvraag && !heroReken && !heroForm;

  return (
    <div className={`bf bf-lp bf-lp--${inhoud.bedanktSlug}${inhoud.strak ? ' bf-lp--strak' : ''}`} ref={vat}>
      <header className={`bf-kop bf-kop--over bf-kop--lp kgj-kop${gescrold ? ' bf-is-gescrold' : ''}${inhoud.topbalk ? ' bf-kop--topbalk' : ''}`} id="kop">
        {/* Totaalrenovatie (5 okt): smalle balk met het telefoonnummer, hoort bij de vaste kop. */}
        {inhoud.topbalk && (
          <div className="bf-lptopbalk kgj-topbalk">
            <IcTel /><span><span className="bf-lptopbalk__zin">{inhoud.topbalk} </span><a href={CONTACT.phone.href}>{CONTACT.phone.display}</a></span>
          </div>
        )}
        {/* Geen nav-landmark: de LP-kop is geen menu (live LpKgj r.324 is een div). */}
        <div className="bf-nav">
          <a className="bf-nav__logo" href="#top" aria-label="AB Bouw Groep">
            <img className="bf-nav__logo-wit" src={logoWit} width={440} height={125} alt="Logo van AB Bouw Groep" decoding="async" />
            <img className="bf-nav__logo-ink" src={logoInk} width={440} height={125} alt="" decoding="async" />
          </a>
          <div className="bf-nav__acties">
            {/* Plaatsbezoekpagina's: de aanvraagknop staat op de computer altijd in de kop (LpKgj r.326-331). */}
            {inhoud.hero.knop && (
              <a className="bf-knop bf-lpbel bf-lpkop__actie" href="#contact">{inhoud.cta.naam ?? inhoud.hero.knop.tekst}</a>
            )}
            {/* Geen aria-label: de zichtbare tekst is de naam, zoals live ("Bel 0460 20 77 88", gsm "Bel direct"; WCAG 2.5.3). */}
            {!inhoud.topbalk && (
              <a className="bf-knop bf-lpbel" href={CONTACT.phone.href}>
                <IcTel /><span className="bf-lpbel__lang">Bel {CONTACT.phone.display}</span><span className="bf-lpbel__kort">Bel direct</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className={`bf-lphero bf-lphero--algemeen${heroKnop ? ' bf-lphero--knop' : ''}${heroForm ? ' bf-lphero--form' : ''}${heroAanvraag ? ' bf-lphero--aanvraag' : ''}`} id="top">
          <div className="bf-hero__slides bf-lphero__slides">
            {inhoud.hero.dias.map((d, i) => (
              <img className={`bf-hero__beeld bf-lphero__beeld${i === dia ? ' bf-is-on' : ''}`} key={d.src} src={d.src} alt={d.alt}
                loading={i === 0 ? 'eager' : 'lazy'} decoding="async" {...(i === 0 ? { fetchpriority: 'high' } : {})}
                style={d.pos ? { objectPosition: d.pos } : undefined} />
            ))}
          </div>
          <div className="bf-lphero__laag" aria-hidden="true" />
          <div className="bf-lphero__in">
            <div className="bf-lphero__tekst">
              <HeroKop kop={kop} kop2={match ? undefined : inhoud.hero.kop2} />
              {inhoud.hero.ondertitel && <p className="bf-lphero__ondertitel">{inhoud.hero.ondertitel}</p>}
              {inhoud.hero.onder && <p className="bf-lphero__sub">{inhoud.hero.onder}</p>}
              {inhoud.hero.bewijs.length > 0 && (
                <ul className="bf-lphero__bewijs">
                  {inhoud.hero.bewijs.map((b) => (
                    <li key={b}><span className="bf-lphero__vink"><IcVink /></span><span>{inhoud.hero.knop ? metKop(b) : metVet(b)}</span></li>
                  ))}
                </ul>
              )}
              {/* Rekenaar in de hero op een plaatsbezoekpagina (heroRekenaar, 13 okt): de rekenaar is de hoofdactie, het
                  plaatsbezoek de tweede ("secundaire cta gratis plaatsbezoek"), als randknop naar het formulier onderaan. */}
              {heroReken && inhoud.heroRekenaar && inhoud.hero.knop && (
                <a className="bf-knop bf-lphero__tweede" href="#contact">{inhoud.hero.knop.tekst}<IcPijl /></a>
              )}
              {heroKnop && (
                <div className="bf-lphero__actie">
                  <a className="bf-knop bf-lpcta__knop bf-lphero__knop" href="#contact">{inhoud.hero.knop.tekst}{inhoud.strak && <IcPijl />}</a>
                  {/* Strak (totaalrenovatie, 13 okt): de regel onder de knop als vinkjes, daaronder het eerstvolgende vrije moment. */}
                  {inhoud.hero.knop.onder && (inhoud.strak
                    ? <ul className="bf-lphero__zeker">{inhoud.hero.knop.onder.split(' · ').map((z) => <li key={z}><IcVink />{z}</li>)}</ul>
                    : <p className="bf-lphero__micro">{inhoud.hero.knop.onder}</p>)}
                  {inhoud.strak && <VrijMoment />}
                </div>
              )}
              <ul className="bf-lphero__vertrouwen"><li><GoogleBadge klasse="bf-lphero__google" /></li></ul>
            </div>
            {heroForm && (
              /* Formulier in de hero (heroFormulier): de kaart zegt wat u krijgt (de knoptekst) en wanneer het kan
                 (eerstvolgend vrij plaatsbezoek); geen aparte knop meer in de tekstkolom. */
              <div id="aanvraag" className="bf-lphero__reken bf-lphero__form">
                <Inspectie inhoud={inhoud} opPrijs={openVenster}
                  boven={<><p className="bf-lphero__formtitel">{inhoud.hero.knop?.tekst ?? inhoud.cta.kop}</p><VrijMoment /></>} />
              </div>
            )}
            {heroAanvraag && (
              /* Aanvraagkaart (19 okt 2026): op de computer rechts naast de kop, op de telefoon onder de subkop, zoals de rekenaar
                 die hier stond. Het anker blijft #rekenaar: de sitelinks "Bereken uw dakprijs" en "Bereken uw renovatieprijs"
                 (ads/dakwerken en ads/totaalrenovatie) wijzen er nog naar; zo landen ze op de kaart in plaats van op niets. */
              <div id="rekenaar" className="bf-lphero__reken bf-lphero__aanvraag">
                <Aanvraag inhoud={inhoud} voor={match?.voor} boven={inhoud.aanvraag?.vrijMoment ? <VrijMoment ruimte /> : undefined} />
                {/* Telefoon: de vinkjes onder de kaart (zoals bij de rekenaar); op de computer staan ze in de kaart. */}
                {vertrouwen.length > 0 && (
                  <div className="bf-lphero__gerust">
                    <ul className="bf-lphero__vinkjes">
                      {vertrouwen.map((t) => <li key={t}><span><IcVink /></span>{metVet(t)}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {heroReken && (
              <div id="rekenaar" className="bf-lphero__reken">
                <Rekenaar inhoud={inhoud} plek="hero" voor={match?.voor} />
                {/* Telefoon: de vinkjes onder de kaart (4 okt, plan mobiele hero); op de computer staan ze in de kaart. */}
                {vertrouwen.length > 0 && (
                  <div className="bf-lphero__gerust">
                    <ul className="bf-lphero__vinkjes">
                      {vertrouwen.map((t) => <li key={t}><span><IcVink /></span>{metVet(t)}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {(inhoud.volgorde ?? STANDAARD_VOLGORDE).map((naam) => <Fragment key={naam}>{secties[naam]}</Fragment>)}

        {/* Slotblok: BF lpinsp (foto, donkere laag, vinkjes, witte belknop, witte kaart), met Inspectie.tsx. */}
        <section className={`bf-lpinsp${inhoud.cta.onderkop ? ' bf-lpinsp--ruim' : ''}`} id="contact" aria-labelledby="contact-kop">
          <img className="bf-lpinsp__beeld" src={inhoud.cta.foto.src} alt={inhoud.cta.foto.alt} loading="lazy" decoding="async" />
          <div className="bf-lpinsp__laag" aria-hidden="true" />
          <div className="bf-lpinsp__in">
            <div className="bf-lpinsp__tekst">
              <h2 id="contact-kop">{inhoud.cta.kop}</h2>
              {inhoud.cta.onderkop && <p className="bf-lpinsp__onderkop">{inhoud.cta.onderkop}</p>}
              {inhoud.cta.tekst && <p>{inhoud.cta.tekst}</p>}
              {inhoud.cta.punten.length > 0 && (
                <ul className="bf-lpinsp__stappen">
                  {inhoud.cta.punten.map((p) => <li key={p}><span><IcVink /></span>{p}</li>)}
                </ul>
              )}
              {!inhoud.topbalk && <a className="bf-lpinsp__bel" href={CONTACT.phone.href}><IcTel />Bel {CONTACT.phone.display}</a>}
            </div>
            <div className="bf-lpinsp__kaartvak"><Inspectie inhoud={inhoud} opPrijs={zonderRekenaar ? undefined : openVenster} /></div>
          </div>
        </section>
      </main>

      {/* Telefoon: vaste knop naar het formulier + belknop (BF lpsticky + belzweef), met de logica van de
          actiebalk van LpKgj (r.753-780): zichtbaar zolang geen rekenaar, formulier of heroknop in beeld staat. */}
      <button type="button" className={`bf-lpsticky${balk ? ' bf-is-zichtbaar' : ''}`} onClick={naarFormulier} tabIndex={balk ? 0 : -1} aria-hidden={!balk}>
        {inhoud.cta.naam ?? inhoud.cta.kop}<IcPijl />
      </button>
      <a className={`bf-belzweef${balk ? ' bf-is-zichtbaar' : ''}`} href={CONTACT.phone.href} aria-label={'Bel ' + CONTACT.phone.display} tabIndex={balk ? 0 : -1} aria-hidden={!balk}><IcTel /></a>

      {/* Digitale assistent (28 sep): verschijnt alleen als api/chat een sleutel heeft. Vorm: kgj/extra.ts via de port. */}
      <div className="bf-lpkgj"><ChatAssistent inhoud={inhoud} balk={balk} opRekenaar={zonderRekenaar ? undefined : openVenster} /></div>

      {/* Voet: de inhoud van live (LpKgj r.785-809) woordelijk, in de BF-opmaak (grijs vlak, logo + zin, kolom Contact,
          onderregel). Geen voetlinkenlijst (§17); de klasse kgj-voet leest check-lp-gsm.cjs (btw in de voet). */}
      <footer className="bf-lpvoet kgj-voet">
        <div className="bf-lpvoet__raster">
          <div className="bf-lpvoet__merk">
            <img className="bf-lpvoet__logo" src={logo} width={1071} height={305} alt="Logo van AB Bouw Groep" loading="lazy" decoding="async" />
            <p>Dakwerken, gevelwerken en renovatie in heel Vlaanderen.</p>
          </div>
          <div className="bf-lpvoet__kolom">
            <h4>Contact</h4>
            <ul className="bf-lpvoet__contact">
              <li>{CONTACT.address.street}<br />{CONTACT.address.city}</li>
              <li><a href={CONTACT.phone.href}>{CONTACT.phone.display}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              {/* 7 okt 2026, Mohammed: het btw-nummer ook in de voet van de landingspagina's (src/data/contact.ts). */}
              <li>BTW {CONTACT.btw.display}</li>
            </ul>
          </div>
        </div>
        <div className="bf-lpvoet__in">
          <p>© {new Date().getFullYear()} AB Bouw Groep · BTW {CONTACT.btw.display}</p>
          <div className="bf-lpvoet__links"><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/voorwaarden">Voorwaarden</a></div>
        </div>
      </footer>

      {venster && !zonderRekenaar && (
        <div className="bf-lpvenster kgj-venster" role="dialog" aria-modal="true" aria-label="Bereken uw prijs"
          onClick={(e) => { if (e.target === e.currentTarget) setVenster(false); }}>
          <div className="bf-lpvenster__in kgj-venster__in" tabIndex={-1} ref={vensterVak}>
            <button type="button" className="bf-lpvenster__dicht" aria-label="Sluiten" onClick={() => setVenster(false)}>×</button>
            <Rekenaar inhoud={inhoud} plek="venster" />
          </div>
        </div>
      )}
    </div>
  );
}
