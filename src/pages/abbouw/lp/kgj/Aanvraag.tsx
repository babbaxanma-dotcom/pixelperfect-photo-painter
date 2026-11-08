import { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, BadgePercent, CalendarCheck, Check, ClipboardCheck, Clock, Hammer, Home, Pencil, Plus, SearchCheck, ShieldCheck, UserCheck, X } from 'lucide-react';
import { Icoon } from './Iconen';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { allowsMarketing } from '@/lib/consent';
import { meldClarity } from '@/lib/clarity';
import { CONTACT } from '@/data/contact';
import { snoeiAntwoorden, type KgjInhoud } from './inhoud';
import PostcodeGemeente from './PostcodeGemeente';
import Toestemming from './Toestemming';
import { beginStand, bewaarAanvraag, telt, useAanvraagStaat, wisAanvraag, type AanvraagStand } from './AanvraagStaat';

/* Testhaken (5 nov 2026, zoals bfbouw.be window.__bfLaadMs / __bfVolUit): __abLaadMs = duur van de laadstap (0 = meteen het
   contactscherm), __abVolUit = de kaart blijft in de pagina (geen volle scherm, geen venster). */
type AbTest = { __abLaadMs?: number; __abVolUit?: boolean };

/* Google-G en ster voor de trustrij (zelfde tekening als Rekenaar.tsx en LpBf.tsx). */
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
/* Huis met vergrootglas: de inspectie (bfbouw.be lp-dak.cjs ICO.inspectie), in de lijnstijl van de kaartkop. */
const IcInspectie = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 11 12 4l8.5 7" /><path d="M6 9.5V19h4.5" /><circle cx="15.5" cy="15.5" r="3.6" /><path d="m18.2 18.2 2.6 2.6" />
  </svg>
);

/**
 * De aanvraagkaart bovenaan de landingspagina (19 okt 2026, opdracht Mohammed: "bouw de abgroep totaalrenovatie en
 * dakwerken lp naar de nieuwe, dus rekenaar weg, en doe dat naar dakinspectie en gratis plaatsbezoek form bovenaan").
 *
 * "De nieuwe" = bfbouw.be/lp/dakwerken (bouw/lp-dak.cjs maakKaart, src/js/site.js data-inspectiekaart): eerst een paar
 * klikvragen, één tik = antwoord en meteen de volgende vraag, Terug kan altijd; daarna de contactstap. Geen prijs, geen
 * calculator. De opmaak en het tikgedrag zijn die van Rekenaar.tsx (klassen kgj-reken__*, druktoestand, 200 ms tegen een
 * dubbele tik, de kop terug in beeld na elke stap), zodat de kaart eruitziet zoals de rekenaar die hier stond.
 *
 * Versturen gaat exact zoals Inspectie.tsx (het formulier onderaan): submitLead met bron_lead = inhoud.inspectie.bronLead.
 * GHL en de belassistent routeren op die waarde, dus de kaart en het formulier onderaan geven dezelfde bron.
 * aanvullende_info = "Aanvraag gratis dakinspectie" (of plaatsbezoek), gevolgd door "Sleutel: antwoord" per vraag.
 * Daarna de vraag uit Toestemming.tsx (zonder marketingtoestemming) en de bedankpagina, zoals Inspectie.
 *
 * Draagt kgj-reken: de vaste balk op de telefoon (LpBf) verdwijnt zodra de kaart in beeld staat.
 */
/* Badges (22 okt 2026, /lp/totaalrenovatie en /lp/dakwerken): elk vinkje een icoon dat bij zijn tekst past. Een tekst die hier
   niet staat, krijgt het icoon van zijn plaats. Ook gebruikt voor de vinkjes onder de kaart op de telefoon (LpBf). */
const BADGE_PER_TEKST: Record<string, typeof Check> = {
  'Vaste prijs vooraf': ShieldCheck, 'Eén vast aanspreekpunt': UserCheck, 'Vakmanschap tot in de details': Award,
  'Gratis & vrijblijvende dakinspectie': ClipboardCheck, 'Gratis & vrijblijvende offerte': ClipboardCheck, 'Vrijblijvende offerte': ClipboardCheck, '6% btw-tarief (woningen > 10 jaar)': BadgePercent,
  'Weet de exacte staat van uw dak': SearchCheck, 'Weet waar u aan toe bent': SearchCheck,
};
export const badgeIcoon = (tekst: string, i: number) => BADGE_PER_TEKST[tekst] ?? [ShieldCheck, UserCheck, Award][i] ?? Check;

/* Focusstand (7 nov 2026, zoals bfbouw.be src/js/site.js, Mohammed daar: "doe ook als je start aan de form dat de rest wit wordt rond de form,
   maar als je scrolt ga je eruit", "op pc verzin ook iets"; hier: "en doe al deze changes ook bij ab pagina"). Onze eigen scroll (stapwissel,
   knop "Ik ben op zoek naar", vaste knop) telt niet als wegscrollen: tot de scroll 250 ms stilstaat, hoogstens 3 s. */
const FOCUS_UIT_DEEL = 0.5; // deel van de kaart in beeld (afgetopt op de schermhoogte) waaronder de focusstand uitgaat, zoals bfbouw.be
const eigen = { aan: false, t: 0, cap: 0 };
function eigenKlaar() { eigen.aan = false; window.clearTimeout(eigen.t); window.clearTimeout(eigen.cap); }
export function eigenScroll() {
  eigen.aan = true;
  window.clearTimeout(eigen.t); eigen.t = window.setTimeout(eigenKlaar, 250);
  window.clearTimeout(eigen.cap); eigen.cap = window.setTimeout(eigenKlaar, 3000);
}

export default function Aanvraag({ inhoud, voor, boven, plek = 'hero' }: {
  inhoud: KgjInhoud;
  /** hero = de kaart bovenaan (form_start-label met :hero, Clarity aanvraag-*); onder = dezelfde kaart in het slotblok
      (#contact, 22 okt 2026: "onderaan bij plaatsbezoek de form zo dat je makkelijk kan klikken"): form_start-label = de
      bron_lead zelf, zoals het formulier van Inspectie.tsx dat daar had, en eigen Clarity-events (aanvraag-onder-*). */
  plek?: 'hero' | 'onder';
  /** Message match (LpBf match.voor): past dit bij vraag 1, dan begint de kaart bij vraag 2 met dat antwoord. */
  voor?: { sleutel: string; label: string };
  /** Optioneel onder de kaartkop: het eerstvolgende vrije plaatsbezoek (VrijMoment in LpBf). */
  boven?: React.ReactNode;
}) {
  const a = inhoud.aanvraag!;
  const t = inhoud.inspectie;
  const navigate = useNavigate();
  /* Stap, antwoorden, vinkjes, naam, telefoonnummer, de foutmelding en "Bezig…" delen de kaart bovenaan en die onderaan
     (AanvraagStaat.tsx, 23 okt 2026): wie bovenaan begon en via "Plan uw gratis plaatsbezoek" onderaan landt, staat daar op
     dezelfde stap. */
  const { stand: levend, zet, actief, gestart, verstuurt } = useAanvraagStaat(() => beginStand(inhoud, voor));
  /* Bevroren beeld (alleen de kaart bovenaan): zolang ze helemaal buiten beeld is, toont ze de stap van het moment dat ze uit
     beeld ging. Werkt de bezoeker onderaan, dan verandert de kaart bovenaan niet van hoogte en schuift de kaart onder zijn vinger
     niet weg (Safari past de scrollpositie daar niet op aan, Chrome wel; review 23 okt). Terug in beeld = de stand van nu. */
  const [bevroren, setBevroren] = useState<AanvraagStand | null>(null);
  const levendRef = useRef(levend);
  levendRef.current = levend;
  const stand = bevroren ?? levend;
  const { stap, antwoorden, vinken, vraagToestemming, fout, bezig } = stand;
  /* 30 okt 2026: een vraag met nietAls valt weg zodra een eerder antwoord erin staat (Isolatie bij stap 2 = geen "Wilt u ook isoleren?").
     5 nov 2026 (zoals bfbouw.be 4 nov): een vraag met `als` telt alleen na dat antwoord (Nieuw dak: waarvoor, dakbedekking). */
  /* 7 nov 2026: ook zonder de vragen die de pagina vooraf beantwoordde (stand.overslaan, message match op het soort dak). */
  const VRAGEN = a.vragen.filter((v) => telt(v, stand));
  /* De vraag die de pagina vooraf beantwoordde: message match (voor, alleen de kaart bovenaan) of de sub-LP (voorAf, bv. Asbest: Ja,
     ook in de kaart onderaan). */
  const vooraf = voor?.sleutel ?? inhoud.voorAf?.sleutel;
  /* 2 nov 2026 (/lp/dakwerken/asbest): wat in de aanvraag en de samenvatting staat = de beantwoorde vragen die de bezoeker zag, plus
     een vraag die de pagina vooraf beantwoordde (voor, bv. Asbest: Ja), in de volgorde van de kaart. */
  const BEANTWOORD = a.vragen.filter((v) => antwoorden[v.sleutel] && (VRAGEN.includes(v) || v.sleutel === vooraf || !!stand.overslaan?.includes(v.sleutel)));
  /* Offerte (30 okt 2026, Mohammed: "verschillende vakken met waar mogelijk dropdown is beste ... de meest belangrijke vragen en dan
     optioneel extra"): eigen stappen met keuzelijsten en Doorgaan, daarna de contactstap. */
  const OSTAPPEN = a.offerte?.stappen ?? [];
  const offerte = Boolean(stand.offerte && a.offerte);
  const oStap = stand.offerteStap ?? 0;
  const oAntw = stand.offerteAntw ?? {};
  const [oFout, setOFout] = useState<string[]>([]);
  const kaart = useRef<HTMLDivElement>(null);
  const balk = useRef<HTMLDivElement>(null);
  const telVeld = useRef<HTMLInputElement>(null);
  const mailVeld = useRef<HTMLInputElement>(null);
  const vorigeStap = useRef('');
  const vorigeBalk = useRef(stap);
  /* Clarity per kaart: de verste stap die de bezoeker in DEZE kaart haalde (Terug telt niet). */
  const verste = useRef(levend.stap);

  const onder = plek === 'onder';
  const clarityNaam = onder ? 'aanvraag-onder' : 'aanvraag';
  const meldStap = (s: number) => meldClarity(s >= VRAGEN.length ? `${clarityNaam}-contact` : `${clarityNaam}-vraag-${s + 1}`);
  /* Deze kaart gebruikt de bezoeker nu: alleen zij scrolt na een stap, spreekt "Stap x van y" uit en meldt de stap aan Clarity.
     Komt hij hier binnen op een stap die deze kaart nog niet meldde (begonnen in de andere kaart), dan meldt ze die eerst: zo telt
     elke kaart wat de bezoeker in die kaart deed, en heeft een verstuurde aanvraag in deze kaart ook een contactstap in deze kaart. */
  const gebruik = () => {
    actief.current = plek;
    const s = levendRef.current.stap;
    if (s > verste.current) { verste.current = s; meldStap(s); }
  };
  const actiefHier = actief.current === plek || (actief.current === null && !onder);
  const klaar = offerte ? oStap >= OSTAPPEN.length : stap >= VRAGEN.length;
  /* De contactstap telt mee: "Stap 1 van 5" bij vier vragen. De balk staat bij het laden al op de eerste stap. */
  const totaal = (offerte ? OSTAPPEN.length : VRAGEN.length) + 1;
  const nu = (offerte ? Math.min(oStap, OSTAPPEN.length) : Math.min(stap, VRAGEN.length)) + 1;
  /* Elke stapwissel, ook binnen de offerte: daarop scrollen, focussen en belonen de effecten hieronder. */
  const stapSleutel = `${levend.offerte ? 'o' : 'v'}${levend.offerte ? levend.offerteStap ?? 0 : levend.stap}`;

  /* Het bevroren beeld van de kaart bovenaan: vastzetten zodra ze helemaal uit beeld is, loslaten zodra ze terug in beeld komt. */
  useEffect(() => {
    if (onder || typeof IntersectionObserver === 'undefined') return;
    const el = kaart.current;
    if (!el) return;
    const io = new IntersectionObserver(([r]) => {
      if (r.isIntersecting) setBevroren(null);
      else setBevroren((b) => b ?? levendRef.current);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [onder]);

  /* Na elke stap (ook Terug) de kop van de kaart terug in beeld als hij onder de vaste kop of boven het scherm viel
     (Rekenaar.tsx, Mohammed 1 okt: "paar pixels naar onder ... waardoor je de form kwijtraakt"). De nieuwe vraag krijgt
     de focus zonder te scrollen (zoals bfbouw.be focusVraag): een schermlezer verliest zijn plek niet.
     23 okt 2026 (Clarity /lp/totaalrenovatie, gsm): ook omgekeerd. Op het contactscherm stond de verzendknop onder het scherm
     (iPhone in Safari, 390 x 664 zichtbaar: onderkant knop 897 px). De bezoeker zag "Bijna klaar!", de zin eronder en het
     naamveld, scrolde zoekend naar de knop en vertrok. Valt de laatste keuze, Volgende of de verzendknop onder het scherm, dan
     schuift de pagina net genoeg omhoog zolang "Stap x van y" onder de vaste balk zichtbaar blijft; past de stap niet, dan staat
     "Stap x van y" direct onder de balk. Alleen de kaart die de bezoeker gebruikt, scrolt (de twee kaarten delen de stap). */
  const inBeeld = () => {
    const el = kaart.current;
    if (!el) return;
    const vraag = el.querySelector<HTMLElement>('.kgj-reken__stap .kgj-reken__vraag');
    if (vraag) { vraag.setAttribute('tabindex', '-1'); vraag.focus({ preventScroll: true }); }
    /* Over het volle scherm (gsm) of in het venster (pc) scrolt de kaart zelf, niet de pagina. */
    if (volRef.current) { el.scrollTop = 0; return; }
    const kop = el.querySelector<HTMLElement>('.kgj-reken__kop') ?? el;
    const gedrag: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const balkH = document.querySelector('.kgj-kop')?.getBoundingClientRect().height ?? 0;
    const boven = balkH + 8;
    const kopTop = kop.getBoundingClientRect().top;
    /* onderkant van wat de bezoeker nu moet tikken: de keuzes, Volgende, of de verzendknop met de regel eronder */
    /* 2 nov 2026: ook de regel onder de verzendknop ("Onze dakexpert contacteert u ... over uw offerte."): zegt wat er na de knop gebeurt. */
    const doelen = [...el.querySelectorAll<HTMLElement>('.kgj-reken__stap :is(.kgj-reken__keuze, .kgj-reken__vink, .kgj-reken__verder, .kgj-reken__knop, .kgj-reken__knopzeker, .kgj-reken__gerust)')];
    /* een offertestap focust zijn kop (geen veld: op de gsm zou het toetsenbord openspringen) */
    const onderkant = doelen.length ? Math.max(...doelen.map((d) => d.getBoundingClientRect().bottom)) : kopTop;
    const tekort = onderkant - (window.innerHeight - 12);
    const kopWeg = kopTop < balkH + 4;
    if (!kopWeg && tekort <= 0) return;
    let naar = kopWeg ? el.getBoundingClientRect().top - boven : Math.min(tekort, kopTop - boven);
    if (kopWeg && tekort - naar > 0) naar = kopTop - boven;
    eigenScroll(); // 7 nov 2026: onze scroll zet de focusstand niet uit
    window.scrollTo({ top: window.scrollY + naar, behavior: gedrag });
  };
  useEffect(() => {
    if (vorigeStap.current === stapSleutel) return;
    vorigeStap.current = stapSleutel;
    if (actief.current !== plek) return;
    inBeeld();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stapSleutel, actief, plek]);

  /* ---------- Laadstap, volle scherm en venster (5 nov 2026, zoals bfbouw.be cad4e57, 91ab7ba, 5638c50) ----------
     Mohammed (bfbouw.be, 4-5 nov): "vanaf ze bij de laatste stap zijn, het laad zo 1 second, gegevens opslaan, en dan opent het de
     contactscherm op een hoge cro manier", "doe dat als je bij de laatste stap bent dat je fullscreen zit in form", "doe nog gewoon dat
     ze makkelijker uit de fullscreen kunnen gaan als ze dat willen", "en op pc ook fullscreen ofzo, dat je alles mooi ziet"; hier:
     "doe bij ab de exact form dingen" (5 nov).
     - Na het laatste antwoord: 1,2 s "Uw aanvraag wordt klaargezet" met drie regels die afvinken (regel 2 = de eigen antwoorden),
       daarna schuift het contactscherm open. De antwoorden staan dan in sessionStorage (AanvraagStaat.tsx bewaarAanvraag).
     - Vanaf de laadstap: op de gsm (tot 1000 px) vult de kaart het scherm, de verzendknop staat vast onderaan; op de pc (vanaf
       1001 px) een venster in het midden over een donkere achtergrond (CSS: lp-bf-ab.css, blok 5 nov).
     - Sluitknop rechtsboven, Esc en een klik naast het venster: terug in de pagina, contactscherm en antwoorden blijven staan.
       Terug, Wijzigen en de terugknop van de gsm: naar de vorige vraag in de pagina. Sluiten tijdens de laadstap stopt de laadstap.
     Alleen de kaart die de bezoeker gebruikt, gaat over het scherm; een teruggezette aanvraag opent in de pagina. */
  const [laden, setLaden] = useState(false);
  const [laadFase, setLaadFase] = useState(0);
  const [nieuw, setNieuw] = useState(false);
  const laadBeurt = useRef(0);
  const klokken = useRef<number[]>([]);
  const [vol, setVol] = useState(false);
  const volRef = useRef(false);
  const stopLaad = () => { laadBeurt.current++; klokken.current.forEach((k) => window.clearTimeout(k)); klokken.current = []; setLaden(false); };
  const zetVol = (aan: boolean) => {
    if (aan) focusUit(); // 7 nov 2026: het volle scherm neemt over, de sluier van de focusstand gaat uit (zoals bfbouw.be)
    if (aan && (window as unknown as AbTest).__abVolUit) return;
    if (aan === volRef.current) return;
    volRef.current = aan;
    setVol(aan);
    /* Eén regel in de geschiedenis: de terugknop van de gsm sluit het volle scherm in plaats van de pagina te verlaten. De staat van
       React Router (usr, key, idx) blijft erin staan, zodat de router dezelfde pagina blijft tonen. */
    if (aan) { try { window.history.pushState({ ...(window.history.state || {}), abVol: plek }, ''); } catch { /* niets */ } }
    else { try { if ((window.history.state as { abVol?: string } | null)?.abVol === plek) window.history.back(); } catch { /* niets */ } }
  };
  const startLaad = (antw: Record<string, string>, vink: Record<string, string[]>) => {
    bewaarAanvraag(antw, vink);
    zetVol(true);
    const t = (window as unknown as AbTest).__abLaadMs;
    const ms = !a.laden ? 0 : typeof t === 'number' ? t : 1200;
    if (ms <= 0) return;
    const beurt = ++laadBeurt.current;
    setLaadFase(0);
    setLaden(true);
    meldClarity(`${clarityNaam}-laden`);
    klokken.current = [1, 2, 3].map((n) => window.setTimeout(() => { if (beurt === laadBeurt.current) setLaadFase(n); }, Math.round((ms * n) / 4)));
    klokken.current.push(window.setTimeout(() => {
      if (beurt !== laadBeurt.current) return;
      setLaden(false);
      setNieuw(true);
    }, ms));
  };
  const sluitVol = () => {
    if (!volRef.current) return;
    stopLaad();
    zetVol(false);
    meldClarity(`${clarityNaam}-sluiten`);
    requestAnimationFrame(() => inBeeld());
  };
  /* html.is-formvol: de pagina erachter scrolt niet en de hero/het slotblok komen boven de kopbalk (CSS). Weg bij het verlaten. */
  useEffect(() => {
    document.documentElement.classList.toggle('is-formvol', vol);
    if (vol && kaart.current) kaart.current.scrollTop = 0;
  }, [vol]);
  useEffect(() => () => {
    if (volRef.current) document.documentElement.classList.remove('is-formvol');
    klokken.current.forEach((k) => window.clearTimeout(k));
  }, []);
  /* Terugknop van gsm of browser: uit het volle scherm, naar de vorige vraag (de laadstap stopt, het formulier opent niet alsnog). */
  useEffect(() => {
    const terug = () => {
      if (!volRef.current) return;
      volRef.current = false;
      setVol(false);
      stopLaad();
      zet((s) => ({ ...s, fout: null, stap: Math.max(0, Math.min(s.stap, a.vragen.filter((v) => telt(v, s)).length) - 1) }));
    };
    window.addEventListener('popstate', terug);
    return () => window.removeEventListener('popstate', terug);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* ---------- Focusstand (7 nov 2026, zoals bfbouw.be; zie eigenScroll bovenaan) ----------
     Bij de klikvragen vóór de laadstap: een sluier over al de rest (gsm wit, pc donker; CSS lp-bf-ab.css blok 7 nov), de kaart blijft in de
     pagina staan. Aan bij de eerste tik op een knop in de kaart (of een knop "Ik ben op zoek naar", event ab-focus-start) en bij elke tik daarna.
     Uit zodra de bezoeker zelf wegscrollt (minder dan de helft van de kaart in beeld), bij een tik op de sluier, Esc, het volle scherm, en bij
     terugkeer van de bedankpagina. Eén kaart tegelijk (event ab-focus). Testhaak: __abVolUit houdt ook de focusstand uit, zoals __bfVolUit. */
  const [focus, setFocus] = useState(false);
  const focusRef = useRef(false);
  const focusGestart = useRef(false);
  const bijVraag = useRef(false);
  bijVraag.current = !vol && !laden && !klaar && !offerte && !vraagToestemming && !bevroren;
  const focusUit = () => { if (!focusRef.current) return; focusRef.current = false; setFocus(false); };
  const focusAan = () => {
    if ((window as unknown as AbTest).__abVolUit || focusRef.current) return;
    focusRef.current = true;
    setFocus(true);
    window.dispatchEvent(new CustomEvent('ab-focus', { detail: plek }));
  };
  useEffect(() => {
    const ander = (e: Event) => { if ((e as CustomEvent).detail !== plek) focusUit(); };
    const start = (e: Event) => { if ((e as CustomEvent).detail === plek) { focusGestart.current = true; actief.current = plek; focusAan(); } };
    const terug = (e: PageTransitionEvent) => { if (e.persisted) focusUit(); };
    window.addEventListener('ab-focus', ander);
    window.addEventListener('ab-focus-start', start);
    window.addEventListener('pageshow', terug);
    return () => { window.removeEventListener('ab-focus', ander); window.removeEventListener('ab-focus-start', start); window.removeEventListener('pageshow', terug); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plek]);
  /* De ouder (hero of slotblok) komt boven de kopbalk, html.is-rkfocus zolang een kaart de stand heeft; de ouder pas na het vervagen (0,2 s) terug. */
  useEffect(() => {
    const el = kaart.current;
    const ouder = el?.closest<HTMLElement>('.bf-lphero__in, .bf-lpinsp__in');
    document.documentElement.classList.toggle('is-rkfocus', !!document.querySelector('.kgj-reken.is-focus'));
    if (!ouder) return;
    if (focus) { ouder.classList.add('is-rkfocus'); return; }
    const t = window.setTimeout(() => { if (!el?.classList.contains('is-focus')) ouder.classList.remove('is-rkfocus'); }, 220);
    return () => window.clearTimeout(t);
  }, [focus]);
  useEffect(() => {
    if (!focus) return;
    let raf = 0;
    const kijk = () => {
      raf = 0;
      const el = kaart.current;
      if (!el || eigen.aan) return;
      const act = document.activeElement;
      if (act && el.contains(act) && /^(INPUT|SELECT|TEXTAREA)$/.test(act.tagName)) return; // toetsenbord open: de browser scrolt zelf
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      if (Math.min(r.bottom, vh) - Math.max(r.top, 0) < FOCUS_UIT_DEEL * Math.min(r.height, vh)) focusUit();
    };
    const scroll = () => {
      if (eigen.aan) { window.clearTimeout(eigen.t); eigen.t = window.setTimeout(eigenKlaar, 250); return; }
      if (!raf) raf = requestAnimationFrame(kijk);
    };
    const toets = (e: KeyboardEvent) => { if (e.key === 'Escape') focusUit(); };
    const vv = () => eigenScroll();
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('keydown', toets);
    window.visualViewport?.addEventListener('resize', vv);
    return () => {
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('keydown', toets);
      window.visualViewport?.removeEventListener('resize', vv);
      if (raf) cancelAnimationFrame(raf);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);
  /* Niet meer bij een vraag (laadstap, contactscherm, volle scherm, bevroren kaart): uit. */
  useEffect(() => { if (focus && !bijVraag.current) focusUit(); });
  /* Tik in de kaart (vangfase): de eerste tik op een knop start de stand; na de stapwissel van die tik weer aan als de kaart nog bij een vraag staat
     (Terug of Wijzigen vanaf het contactscherm). Na het laatste antwoord opent het volle scherm en blijft de sluier uit. */
  const focusKlik = (e: React.MouseEvent) => {
    const knop = (e.target as HTMLElement).closest?.('button, a, input, select, textarea, label');
    if (!focusGestart.current && !knop) return;
    if (bijVraag.current) { focusGestart.current = true; focusAan(); }
    window.setTimeout(() => { if (bijVraag.current) { focusGestart.current = true; focusAan(); } }, 0);
  };

  /* Esc sluit, zoals de sluitknop. */
  useEffect(() => {
    if (!vol) return;
    const toets = (e: KeyboardEvent) => { if (e.key === 'Escape') sluitVol(); };
    document.addEventListener('keydown', toets);
    return () => document.removeEventListener('keydown', toets);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vol]);
  /* Na de laadstap: de kop van het contactscherm krijgt de focus (zonder te scrollen). */
  useEffect(() => {
    if (!nieuw || actief.current !== plek) return;
    inBeeld();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nieuw]);
  /* Terug of Wijzigen vanuit het contactscherm: terug in de pagina (geen volle scherm meer). */
  useEffect(() => {
    if (vol && !klaar && !laden) zetVol(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vol, klaar, laden]);

  /* Beloning bij elke gezette stap (bfbouw.be beloon(), Mohammed 10 okt: endowed progress + beloning per stap): een korte gloed
     en glans over de balk, alleen vooruit, nooit bij Terug, niet bij "minder beweging". */
  useEffect(() => {
    const vooruit = stap > vorigeBalk.current;
    vorigeBalk.current = stap;
    const el = balk.current;
    if (!vooruit || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.remove('is-beloning');
    void el.offsetWidth;
    el.classList.add('is-beloning');
  }, [stap]);

  /* Clarity: de verste stap van deze bezoeker in deze kaart (Terug telt niet), zoals de rekenaar dat deed. */
  useEffect(() => {
    if (actief.current !== plek || levend.stap <= verste.current) return;
    verste.current = levend.stap;
    meldStap(levend.stap);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levend.stap]);

  /* De eerste tik telt als start van het formulier (GA4 form_start), één keer per bezoek, ook als de bezoeker in de andere
     kaart verdergaat. Eigen label voor de kaart bovenaan, zodat in GA4 te zien is welk formulier begonnen werd; de bron in GHL
     (bron_lead) blijft die van het formulier onderaan. */
  const meldStart = () => {
    if (gestart.current) return;
    gestart.current = true;
    trackFormStart(onder ? t.bronLead : `${t.bronLead}:hero`);
  };

  /* Tik = antwoord + volgende vraag (Rekenaar.tsx, Mohammed 25 sep): het antwoord kleurt op zodra de vinger het raakt,
     een tweede tik binnen 200 ms telt niet (een dubbele tik slaat geen vraag over). */
  const [druk, setDruk] = useState<string | null>(null);
  const laatsteTik = useRef(0);
  const kies = (sleutel: string, label: string) => {
    const tijd = Date.now();
    if (tijd - laatsteTik.current < 200 || laden) return;
    laatsteTik.current = tijd;
    setDruk(null);
    gebruik();
    meldStart();
    /* 5 nov 2026 (zoals bfbouw.be snoei, 4 nov): antwoorden van vragen die na dit antwoord niet meer tellen, gaan weg (Terug en
       Dakrenovatie in plaats van Nieuw dak: "Nieuwbouw" mag de asbestvraag niet meer wegnemen). De volgende stap = de vraag na deze
       in de nieuwe reeks; na de laatste vraag de laadstap. */
    const s0 = levendRef.current;
    const antw = snoeiAntwoorden(a.vragen, { ...s0.antwoorden, [sleutel]: label }, vooraf);
    const reeks = a.vragen.filter((v) => telt(v, { antwoorden: antw, overslaan: s0.overslaan }));
    const hier = reeks.findIndex((v) => v.sleutel === sleutel);
    const volgende = (hier >= 0 ? hier : s0.stap) + 1;
    zet((s) => ({ ...s, aangetikt: true, antwoorden: antw, stap: volgende }));
    if (volgende >= reeks.length) startLaad(antw, s0.vinken);
  };

  /* Afvinkvraag (22 okt 2026, /lp/totaalrenovatie: "die vraag van dat ze mooi kunnen aanklikken wat er allemaal nodig is, makkelijk
     en gebruiksvriendelijk"): zelfde gedrag als de afvinkvraag van de rekenaar (Rekenaar.tsx vink/verder). Alles vinkt alles aan of
     uit; Volgende pas met minstens één vinkje; het antwoord is de lijst, of het label van Alles als alles aan staat. */
  const vink = (v: (typeof VRAGEN)[number], label: string | null) => {
    gebruik();
    meldStart();
    const alle = v.keuzes.map((k) => k.label);
    zet((s) => {
      const nu = s.vinken[v.sleutel] ?? [];
      const volgend = label === null
        ? (nu.length === alle.length ? [] : alle)
        : nu.includes(label) ? nu.filter((l) => l !== label) : alle.filter((l) => l === label || nu.includes(l));
      return { ...s, aangetikt: true, vinken: { ...s.vinken, [v.sleutel]: volgend } };
    });
  };
  const verder = (v: (typeof VRAGEN)[number]) => {
    const gekozen = vinken[v.sleutel] ?? [];
    if (!gekozen.length || !v.afvinken) return;
    if (laden) return;
    gebruik();
    const antwoord = gekozen.length === v.keuzes.length ? v.afvinken.alles : gekozen.join(', ');
    const s0 = levendRef.current;
    const antw = snoeiAntwoorden(a.vragen, { ...s0.antwoorden, [v.sleutel]: antwoord }, vooraf);
    const reeks = a.vragen.filter((x) => telt(x, { antwoorden: antw, overslaan: s0.overslaan }));
    const hier = reeks.findIndex((x) => x.sleutel === v.sleutel);
    const volgende = (hier >= 0 ? hier : s0.stap) + 1;
    zet((s) => ({ ...s, aangetikt: true, antwoorden: antw, stap: volgende }));
    if (volgende >= reeks.length) startLaad(antw, s0.vinken);
  };
  const zetFout = (f: string | null) => zet((s) => ({ ...s, fout: f }));
  /* Offerte (29 okt 2026): wie al weet wat er moet gebeuren, slaat de klikvragen over. Sinds 30 okt eerst de offertestappen
     (keuzelijsten + Doorgaan), dan de contactstap. Terug vanaf de eerste offertestap brengt hem bij vraag 1; de antwoorden blijven. */
  const naarOfferte = () => {
    gebruik();
    meldStart();
    meldClarity(`${clarityNaam}-offerte`);
    setOFout([]);
    zet((s) => ({ ...s, aangetikt: true, fout: null, offerte: true, offerteStap: 0, stap: VRAGEN.length }));
  };
  const kiesOfferte = (sleutel: string, waarde: string) => {
    gebruik();
    if (waarde) setOFout((f) => f.filter((x) => x !== sleutel));
    zet((s) => ({ ...s, aangetikt: true, offerteAntw: { ...(s.offerteAntw ?? {}), [sleutel]: waarde } }));
  };
  const doorgaan = () => {
    const st = OSTAPPEN[oStap];
    if (!st) return;
    gebruik();
    const open = st.velden.filter((v) => !oAntw[v.sleutel]).map((v) => v.sleutel);
    setOFout(open);
    if (open.length) {
      kaart.current?.querySelector<HTMLElement>(`[data-oveld="${CSS.escape(open[0])}"]`)?.focus();
      return;
    }
    meldClarity(`${clarityNaam}-offerte-${oStap + 2 > OSTAPPEN.length ? 'contact' : `stap-${oStap + 2}`}`);
    zet((s) => ({ ...s, aangetikt: true, fout: null, offerteStap: (s.offerteStap ?? 0) + 1 }));
    if (oStap + 1 >= OSTAPPEN.length) startLaad(levendRef.current.antwoorden, levendRef.current.vinken);
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    gebruik();
    if (verstuurt.current) return;
    const f = new FormData(e.currentTarget);
    const telefoon = String(f.get('telefoon') || '').trim();
    /* 20 okt 2026 (Mohammed: de bevestigings-sms begint met "Dag {{voornaam}},"): de naam is hier verplicht, zoals op
       bfbouw.be. Zonder naam stond er "Dag ,". De controle staat vóór die van de gsm: de velden staan in die volgorde. */
    if (!String(f.get('naam') || '').trim()) { zetFout('Vul uw naam in.'); return; }
    /* Dezelfde controle en meldingen als Inspectie.tsx: leeg = fout, minder dan acht cijfers = fout. */
    const cijfers = telefoon.replace(/\D/g, '').length;
    if (!telefoon) { zetFout('Vul uw telefoonnummer in. Wij bellen u om een moment af te spreken.'); return; }
    if (cijfers < 8) { zetFout('Dat telefoonnummer lijkt niet volledig. Controleer het even.'); return; }
    /* 2 nov 2026 (offerte, zoals bfbouw.be 31 okt): het e-mailadres is verplicht waar contactVelden.email 'verplicht' is. Alleen een
       vormcontrole (iets@iets.iets), geen bestaanscontrole. */
    if (emailVerplicht) {
      const mail = String(f.get('email') || '').trim();
      if (!mail) { zetFout('Vul uw e-mailadres in. Daar sturen wij uw offerte naartoe.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { zetFout('Dat e-mailadres lijkt niet juist. Controleer het even.'); return; }
    }
    verstuurt.current = true;
    zet((s) => ({ ...s, fout: null, bezig: true }));
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: inhoud.divisie,
      firstName: String(f.get('naam') || '').trim() || undefined,
      email: String(f.get('email') || '').trim(),
      phone: telefoon,
      postcode: String(f.get('postcode') || '').trim() || undefined,
      gemeente: String(f.get('gemeente') || '').trim() || undefined,
      type_werk: inhoud.divisie,
      /* "Aanvraag gratis dakinspectie · Dak: Hellend dak · Werk: ..." (zelfde begin als Inspectie.tsx). */
      /* Offerte: "Aanvraag offerte · Soort werk: Dak herstellen · Type dak: Plat dak · ... · Extra info: ..." (30 okt 2026: alles leesbaar in GHL). */
      aanvullende_info: (offerte ? ['Aanvraag offerte (weet al wat er moet gebeuren)',
        ...OSTAPPEN.flatMap((st) => [...st.velden.map((v) => v.sleutel), ...(st.extra ? [st.extra.sleutel] : [])])
          .filter((k) => (oAntw[k] ?? '').trim()).map((k) => `${k}: ${oAntw[k].trim().replace(/\s+/g, ' ')}`)]
        : ['Aanvraag ' + (inhoud.cta.naam ?? inhoud.cta.kop).toLowerCase(),
          ...BEANTWOORD.map((v) => `${v.sleutel}: ${antwoorden[v.sleutel]}`)]).join(' · '),
      bron_lead: t.bronLead,
    });
    if (!res.ok) { verstuurt.current = false; zet((s) => ({ ...s, bezig: false, fout: leadFoutmelding(res, CONTACT.phone.display) })); return; }
    meldClarity(`${clarityNaam}-verstuurd`);
    wisAanvraag();
    /* 29 okt 2026 (bureau: na versturen geen bedankpagina, Clarity 29 okt 07:22 sessie yd92yn): altijd meteen naar de
       bedankpagina. Zonder toestemming voor marketing staat de vraag uit Toestemming.tsx daar bovenaan (BedanktBf,
       navigatiestaat abToestemming); in de kaart hield ze de bezoeker op de adpagina tot hij antwoordde. */
    zet((s) => ({ ...s, bezig: false }));
    naarBedankt(!allowsMarketing());
  };
  /* 5 nov 2026 (zoals bfbouw.be e216830, Mohammed daar: "ja op de thankyou page ook"): de bedankpagina toont onder "Wat nu volgt"
     dezelfde twee stappen als "Na uw aanvraag" (navigatiestaat abVolgt); het aanbod van het plaatsbezoek of de dakinspectie blijft. */
  const naarBedankt = (vraag = false) => {
    const st = { ...(vraag ? { abToestemming: true } : {}), ...(a.volgt?.length ? { abVolgt: a.volgt } : {}) };
    navigate('/bedankt/' + inhoud.bedanktSlug, Object.keys(st).length ? { state: st } : undefined);
  };

  const vraag = VRAGEN[stap];
  /* Welke velden de contactstap naast Naam en Gsm heeft (renovatiepagina's: alleen die twee). Standaard beide aan. */
  const emailVerplicht = a.contactVelden?.email === 'verplicht';
  const metEmail = a.contactVelden?.email !== false && !emailVerplicht;
  const metPostcode = a.contactVelden?.postcode !== false;
  /* "Bijna klaar! Bevestig uw gratis dakinspectie": het eerste deel op een eigen regel in de merkkleur (bfbouw.be rk__bijna). */
  const contactKop = offerte && a.offerte ? a.offerte.contactKop : a.contactKop;
  const band = contactKop.match(/^(Bijna klaar!)\s+(.+)$/);
  /* Samenvatting boven de velden (29 okt 2026, Mohammed: "ja dit zeker"): de eigen antwoorden. Een kaal Ja/Nee krijgt het
     onderwerp erbij ("Isolatie: Ja"), anders zegt het niets. */
  const KAAL = /^(ja|nee|weet ik (nog )?niet)$/i;
  const samen = offerte ? OSTAPPEN.flatMap((st) => st.velden.map((v) => oAntw[v.sleutel])).filter(Boolean) : BEANTWOORD.map((v) => (KAAL.test(antwoorden[v.sleutel]) ? `${v.sleutel}: ${antwoorden[v.sleutel]}` : antwoorden[v.sleutel]));
  /* Laadstap regel 2: de eigen antwoorden ("Dakrenovatie · 50 tot 100 m²"); een kaal "Weet ik niet" telt niet. */
  const laadRegel = a.laden ? (a.laden.sleutels.map((k) => antwoorden[k]).filter((x) => x && !KAAL.test(x)).join(' · ') || a.laden.leeg) : '';
  /* Trust badges: op het contactscherm in het formulier (boven de knop, zoals bfbouw.be badgesMini), anders onderaan de kaart. */
  const trustRij = a.trustrij && (
    <ul className="kgj-reken__trust">
      <li className="kgj-reken__trust-g">
        <span className="kgj-reken__trust-gic"><IcGoogle /></span>
        <span><b>5,0</b><span className="kgj-reken__trust-st" aria-hidden="true"><IcSter /><IcSter /><IcSter /><IcSter /><IcSter /></span></span>
      </li>
      {a.trustrij.map((c) => (
        <li key={c.b + c.s}>
          {a.badges && c.icoon && <span className="kgj-reken__trust-ic" aria-hidden="true">{c.icoon === 'kalender' ? <CalendarCheck /> : c.icoon === 'schild' ? <ShieldCheck /> : <Hammer />}</span>}
          <b>{c.b}</b>{' '}<span>{c.s}</span>
        </li>
      ))}
    </ul>
  );
  const trustInForm = klaar && !vraagToestemming && !!a.volgt?.length;

  return (
    <Fragment>
    {/* Donkere achtergrond achter het volle scherm / het venster: een klik erop sluit (zoals de sluitknop). */}
    {vol && <div className="kgj-reken__achter" aria-hidden="true" onClick={sluitVol} />}
    {/* 7 nov 2026: sluier van de focusstand (vlak vóór de kaart, zoals bfbouw.be rk__sluier); een tik erop zet de stand uit. */}
    <div className={`kgj-reken__sluier${focus ? ' is-aan' : ''}`} aria-hidden="true" onClick={focusUit} />
    <div ref={kaart} onClickCapture={focusKlik} className={`kgj-reken kgj-reken--aanvraag${onder ? ' kgj-reken--onder' : ''}${a.badges ? ' kgj-reken--badges' : ''}${stand.aangetikt && stap > 0 ? ' is-bezig' : ''}${klaar ? ' is-contact' : ''}${vol ? ' is-vol' : ''}${laden ? ' is-laden' : ''}${focus ? ' is-focus' : ''}`}
      {...(vol ? { role: 'dialog', 'aria-modal': true, 'aria-label': 'Uw offerteaanvraag' } : {})}>
      <div className="kgj-reken__hoofd">
        <span className="kgj-reken__logo" aria-hidden="true"><IcInspectie /></span>
        <div>
          <p className="kgj-reken__titel">{a.titel}</p>
          {/* 2 nov 2026: zonder tijdregel als tijd leeg is (bfbouw.be 31 okt: kaartkop "Gratis offerte aanvragen" alleen). */}
          {a.tijd && <p className="kgj-reken__tijd"><Clock aria-hidden="true" />{a.tijd}</p>}
        </div>
      </div>
      {boven}
      <div className="kgj-reken__weg" aria-hidden="true">
        <Home className="kgj-reken__begin" />
        {/* 7 nov 2026, zoals bfbouw.be (Mohammed daar: "maak de balk vanaf de start 40 procent gevuld"): 40 % bij stap 1, 100 % op het contactscherm. */}
        <div className="kgj-reken__balk" ref={balk} onAnimationEnd={(e) => { if (e.animationName === 'kgj-glans') e.currentTarget.classList.remove('is-beloning'); }}><i style={{ width: `${totaal > 1 ? Math.round((40 + (60 * (nu - 1)) / (totaal - 1)) * 10) / 10 : 100}%` }} /></div>
        <span className={`kgj-reken__eind${klaar ? ' is-aan' : ''}`}><Check /></span>
      </div>
      {/* Na een verstuurde aanvraag geen Terug meer: terug naar een vraag zou doen alsof er nog niets verstuurd is. */}
      {!vraagToestemming && (
        <div className="kgj-reken__kop">
          {/* Uitgesproken door een schermlezer alleen in de kaart die de bezoeker gebruikt (de andere kaart verandert mee). */}
          {/* 7 nov 2026, zoals bfbouw.be (Mohammed daar: "DOE ipv stap 1 VAN 7 gewoon stap 1"). */}
          <span className="kgj-reken__tel" aria-live={actiefHier ? 'polite' : 'off'}>Stap {nu}</span>
          {stap > 0 && !laden && (
            <button type="button" className="kgj-reken__terug" onClick={() => { gebruik(); setOFout([]); zet((s) => (s.offerte
              ? ((s.offerteStap ?? 0) > 0 ? { ...s, aangetikt: true, fout: null, offerteStap: (s.offerteStap ?? 0) - 1 } : { ...s, aangetikt: true, fout: null, offerte: false, stap: 0 })
              : { ...s, aangetikt: true, fout: null, stap: Math.max(0, Math.min(s.stap, VRAGEN.length) - 1) })); }}>‹ Terug</button>
          )}
          {/* 5 nov 2026 (bfbouw.be 5638c50, Mohammed daar: "doe nog gewoon dat ze makkelijker uit de fullscreen kunnen gaan als ze
              dat willen"): sluitknop van 44 px, alleen over het volle scherm en in het venster. */}
          {vol && <button type="button" className="kgj-reken__sluit" aria-label="Sluiten" onClick={sluitVol}><X aria-hidden="true" /></button>}
        </div>
      )}
      {/* 7 nov 2026, zoals bfbouw.be rk__gekozen (Mohammed daar: "bij de knoppen is het niet duidelijk dat je in de form zit met eerste vraag al
          ingevuld"; "uw keuze bolletje plakt te hard op het form bij stap 7": niet op het contactscherm). Alleen bij de vragen na de knop. */}
      {stand.gekozen && !klaar && !laden && !offerte && !vraagToestemming && antwoorden[stand.gekozen.sleutel] === stand.gekozen.label
        && vraag && vraag.sleutel !== stand.gekozen.sleutel && (
        <p className="kgj-reken__gekozen"><Check aria-hidden="true" /><span>Uw keuze: <b>{stand.gekozen.label}</b></span></p>
      )}

      {laden && a.laden ? (
        /* De laadstap (bfbouw.be rk__laad): drie regels die een voor een afvinken, daarna het contactscherm. */
        <div className={`kgj-reken__laad is-${laadFase}`}>
          <p className="kgj-reken__laad-kop" role="status"><span className="kgj-reken__laad-spin" aria-hidden="true" />{a.laden.kop}</p>
          <ul className="kgj-reken__laad-lijst">
            {[a.laden.eerste, laadRegel, a.laden.laatste].map((r, i) => (
              <li key={i} className={laadFase > i ? 'is-aan' : undefined}><span className="kgj-reken__laad-vink" aria-hidden="true"><Check /></span><span>{r}</span></li>
            ))}
          </ul>
        </div>
      ) : vraagToestemming ? (
        <Toestemming verder={naarBedankt} stil={!actiefHier} />
      ) : offerte && !klaar ? (() => {
        /* Offertestap: label boven elk veld, native keuzelijst met "Maak een keuze", de melding direct onder het veld. */
        const st = OSTAPPEN[oStap];
        const id = (k: string) => `kgj-o-${plek}-${k.replace(/\W+/g, '-').toLowerCase()}`;
        return (
          <div className="kgj-reken__stap kgj-reken__ostap" key={`o${oStap}`}>
            <p className="kgj-reken__vraag">{st.kop}</p>
            {st.velden.map((v) => {
              const mist = oFout.includes(v.sleutel);
              return (
                <div className="kgj-reken__oveld" key={v.sleutel}>
                  <label htmlFor={id(v.sleutel)}>{v.label} *</label>
                  <select id={id(v.sleutel)} data-oveld={v.sleutel} value={oAntw[v.sleutel] ?? ''} aria-required="true" aria-invalid={mist || undefined}
                    aria-describedby={mist ? `${id(v.sleutel)}-fout` : undefined} onFocus={gebruik} onChange={(e) => kiesOfferte(v.sleutel, e.target.value)}>
                    <option value="">Maak een keuze</option>
                    {v.opties.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {mist && <p className="kgj-reken__ofout" id={`${id(v.sleutel)}-fout`} role={actiefHier ? 'alert' : undefined}>Kies een antwoord.</p>}
                </div>
              );
            })}
            {st.extra && (
              <div className="kgj-reken__oveld">
                <label htmlFor={id(st.extra.sleutel)}>{st.extra.label}</label>
                <textarea id={id(st.extra.sleutel)} rows={2} placeholder={st.extra.hint} value={oAntw[st.extra.sleutel] ?? ''}
                  onFocus={gebruik} onChange={(e) => kiesOfferte(st.extra!.sleutel, e.target.value)} />
              </div>
            )}
            <button type="button" className="kgj-knop kgj-knop--vol kgj-reken__verder" onClick={doorgaan}>Doorgaan<ArrowRight aria-hidden="true" /></button>
          </div>
        );
      })() : !klaar && vraag.afvinken ? (() => {
        const gekozen = vinken[vraag.sleutel] ?? [];
        const alles = gekozen.length === vraag.keuzes.length;
        return (
          <div className="kgj-reken__stap" key={stap}>
            <p className="kgj-reken__vraag kgj-reken__vraag--vink">{vraag.vraag}</p>
            <p className="kgj-reken__meer">Meerdere keuzes mogelijk</p>
            <div className="kgj-reken__vinken" role="group" aria-label={vraag.vraag}>
              <button type="button" role="checkbox" aria-checked={alles}
                className={`kgj-reken__vink kgj-reken__vink--alles${alles ? ' is-aan' : ''}`} onClick={() => vink(vraag, null)}>
                <i className="kgj-reken__vakje" aria-hidden="true"><Check /></i>{vraag.afvinken.alles}
              </button>
              {[...new Set(vraag.keuzes.map((k) => k.groep ?? ''))].map((groep) => (
                <div className="kgj-reken__groep" key={groep}>
                  {groep && <p className="kgj-reken__groepnaam">{groep}</p>}
                  <div className="kgj-reken__chips">
                    {vraag.keuzes.filter((k) => (k.groep ?? '') === groep).map((k) => {
                      const aan = gekozen.includes(k.label);
                      return (
                        <button type="button" role="checkbox" aria-checked={aan} key={k.label}
                          className={`kgj-reken__vink kgj-reken__vink--chip${aan ? ' is-aan' : ''}`} onClick={() => vink(vraag, k.label)}>
                          {aan ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}{k.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {vraag.afvinken.tip && vraag.afvinken.tip.bij.some((b) => gekozen.includes(b)) && (
              <p className="kgj-reken__tip"><BadgePercent aria-hidden="true" />{vraag.afvinken.tip.tekst}</p>
            )}
            <button type="button" className="kgj-knop kgj-knop--vol kgj-reken__verder" disabled={!gekozen.length} onClick={() => verder(vraag)}>
              {gekozen.length ? <>Volgende<ArrowRight aria-hidden="true" /></> : 'Vink minstens één onderdeel aan'}
            </button>
          </div>
        );
      })() : !klaar ? (
        <div className="kgj-reken__stap" key={stap}>
          <p className="kgj-reken__vraag">{vraag.vraag}</p>
          <div className={`kgj-reken__keuzes${vraag.keuzes.length % 2 === 1 ? ' kgj-reken__keuzes--oneven' : ''}${vraag.raster ? ' kgj-reken__keuzes--raster' : ''}${vraag.lijst ? ' kgj-reken__keuzes--lijst' : ''}`}>
            {vraag.keuzes.map((k) => (
              <button type="button" key={k.label}
                className={`kgj-reken__keuze${k.icoon ? ' kgj-reken__keuze--icoon' : ''}${antwoorden[vraag.sleutel] === k.label ? ' is-aan' : ''}${druk === k.label ? ' is-druk' : ''}`}
                onPointerDown={() => setDruk(k.label)}
                onPointerUp={() => setDruk(null)}
                onPointerCancel={() => setDruk(null)}
                onPointerLeave={() => setDruk(null)}
                onClick={() => kies(vraag.sleutel, k.label)}>
                {k.foto && <img className="kgj-reken__foto" src={k.foto} alt="" width={640} height={360} decoding="async" />}
                {k.icoon && <i className="kgj-reken__icoon"><Icoon naam={k.icoon} /></i>}
                <span className="kgj-reken__tekst">
                  <strong>{k.label}</strong>
                  {k.uitleg && <span>{k.uitleg}</span>}
                </span>
              </button>
            ))}
          </div>
          {stap === 0 && a.offerte && (
            <p className="kgj-reken__offerte">
              <span>{a.offerte.vraag}</span>{' '}
              <button type="button" onClick={naarOfferte}>{a.offerte.knop}<ArrowRight aria-hidden="true" /></button>
            </p>
          )}
        </div>
      ) : (
        <div className={`kgj-reken__stap${nieuw ? ' is-nieuw' : ''}`} key="contact" onAnimationEnd={(e) => { if (e.animationName === 'kgj-open') setNieuw(false); }}>
          <form className="kgj-reken__form kgj-reken__contact" onSubmit={verstuur} noValidate>
            <div className="kgj-reken__band">
              <p className="kgj-reken__vraag kgj-reken__vraag--band">
                {band ? <><span className="kgj-reken__bijna">{band[1]}</span> {band[2]}</> : contactKop}
              </p>
            </div>
            {/* De zin onder "Bijna klaar! Bevestig ..." zoals op bfbouw.be (rk__contactsub), in een duidelijk vlak met vinkje. 22 okt 2026,
                Mohammed: "die disclaimer bedoelde ik van wat er al was visueel verbeteren", "laat uw dak vakkundig controleren en vermijd
                onnodige kosten", "dat wat er stond", "doe even overal". */}
            {/* 26 okt 2026, Mohammed: "moet visueel duidelijker en apart, en visueel mooi": drie vinkjes in een eigen vlak (bfbouw.be rk__punten). */}
            {a.disclaimer && !offerte && (
              <ul className="kgj-reken__disclaimer">
                {a.disclaimer.map((p) => <li key={p}><Check aria-hidden="true" /><span>{p}</span></li>)}
              </ul>
            )}
            {samen.length > 0 && (
              <div className="kgj-reken__samen">
                <button type="button" className="kgj-reken__samen-wijzig" onClick={() => { gebruik(); zet((s) => (s.offerte ? { ...s, aangetikt: true, fout: null, offerteStap: 0 } : { ...s, aangetikt: true, fout: null, stap: 0 })); }}>
                  <Pencil aria-hidden="true" />Wijzigen
                </button>
                <p className="kgj-reken__samen-tekst"><span className="kgj-reken__samen-kop">Uw aanvraag</span>{samen.join(' · ')}</p>
              </div>
            )}
            {/* Geen autoFocus: op een telefoon sprong het toetsenbord dan meteen open (Mohammed, 24 sep).
                23 okt 2026: naam en nummer staan in de gedeelde stand (een kaart wisselen of Terug wist niets); op de gsm zet het
                toetsenbord een hoofdletter bij elke naam en gaat "Volgende" van Naam naar Telefoonnummer, waar "Verstuur" verstuurt. */}
            {/* 5 nov 2026: de velden in één vak, zodat het volle scherm (gsm) en het venster (pc) ze als één blok kunnen plaatsen. */}
            <div className="kgj-reken__velden">
            <div className="kgj-reken__rij">
              <label>Naam *<input name="naam" type="text" autoComplete="name" autoCapitalize="words" enterKeyHint="next" placeholder="Uw naam" aria-required="true"
                value={stand.naam} onFocus={gebruik} onChange={(e) => { const v = e.target.value; zet((s) => ({ ...s, aangetikt: true, naam: v })); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); telVeld.current?.focus(); } }} /></label>
              {/* 22 okt 2026, Mohammed: "en doe naam en telefoonnummer", "niet gsm". */}
              <label>Telefoonnummer *
                <input ref={telVeld} name="telefoon" type="tel" autoComplete="tel" inputMode="tel" enterKeyHint={emailVerplicht ? 'next' : 'send'} placeholder="04xx xx xx xx" aria-required="true"
                  value={stand.telefoon} onFocus={gebruik} onChange={(e) => { const v = e.target.value; zet((s) => ({ ...s, aangetikt: true, telefoon: v })); }}
                  onKeyDown={emailVerplicht ? (e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); mailVeld.current?.focus(); } } : undefined} />
              </label>
            </div>
            {/* 2 nov 2026 (offerte, zoals bfbouw.be 31 okt: "doe ook een vakje emailadres bij de offerte aanvraag indiening"; daar zonder
                voorbeeldtekst): een eigen rij over de volle breedte. Gedeeld tussen de twee kaarten, zoals naam en nummer. */}
            {emailVerplicht && (
              <div className="kgj-reken__rij kgj-reken__rij--een">
                <label>E-mailadres *
                  <input ref={mailVeld} name="email" type="email" autoComplete="email" inputMode="email" enterKeyHint="send" aria-required="true"
                    value={stand.email ?? ''} onFocus={gebruik} onChange={(e) => { const v = e.target.value; zet((s) => ({ ...s, aangetikt: true, email: v })); }} />
                </label>
              </div>
            )}
            {(metPostcode || metEmail) && (
              <div className="kgj-reken__rij">
                {/* Korte voorbeeldtekst: op de computer staat het veld in een halve kolom (de standaardhint werd afgekapt). */}
                {metPostcode && <PostcodeGemeente hint="bv. 2830" />}
                {metEmail && <label>E-mail<input name="email" type="email" autoComplete="email" inputMode="email" placeholder="uw@email.be" /></label>}
              </div>
            )}
            </div>
            {fout && <p className="kgj-reken__fout" role={actiefHier ? 'alert' : undefined}>{fout}</p>}
            {trustInForm && trustRij}
            {/* 5 nov 2026 (bfbouw.be rk__trigger, Mohammed daar: "simpelweg offerte binnen 24 uur"): één regel direct boven de knop,
                alleen in de pagina (over het volle scherm en in het venster staat het in "Na uw aanvraag"). */}
            {a.trigger && <p className="kgj-reken__trigger"><span className="kgj-reken__trigger-ic" aria-hidden="true"><Check /></span><span>{a.trigger}</span></p>}
            <button className="kgj-knop kgj-knop--vol kgj-reken__knop" type="submit" disabled={bezig}>
              {bezig ? 'Bezig…' : <>{offerte && a.offerte ? a.offerte.verzend : t.knop}<ArrowRight aria-hidden="true" /></>}
            </button>
            {/* 5 nov 2026 (bfbouw.be rk__volgt, Mohammed daar: "mensen willen weten wat er daarna gebeurt", "Zo krijgt u uw offerte
                andere kop" -> "Na uw aanvraag"): de twee stappen na het versturen. In de pagina onder de knop; over het volle scherm
                boven de velden, in het venster links (CSS). Vervangt de regel onder de knop (t.onder). */}
            {a.volgt && a.volgt.length > 0 && (
              <div className="kgj-reken__volgt">
                <p className="kgj-reken__volgt-kop">{a.volgtKop}</p>
                <ol className="kgj-reken__volgt-lijst">
                  {a.volgt.map((v) => <li key={v.titel}><span><b>{v.titel}</b> {v.tekst}</span></li>)}
                </ol>
              </div>
            )}
            {/* 23 okt 2026: direct onder de verzendknop het bewijs en het risico weg, op het moment van beslissen (bfbouw.be rk__knopzeker:
                "5,0 op Google · Gratis en vrijblijvend"). Op de gsm staat de kaartkop met "vrijblijvend" dan boven het scherm. */}
            {a.zeker && (
              <p className="kgj-reken__knopzeker">
                <span className="kgj-reken__trust-st" aria-hidden="true"><IcSter /><IcSter /><IcSter /><IcSter /><IcSter /></span>
                <b>5,0 op Google</b>{' '}<span aria-hidden="true">·</span>{' '}{a.zeker}
              </p>
            )}
            {!a.volgt?.length && <p className="kgj-reken__gerust">{t.onder}</p>}
          </form>
        </div>
      )}

      {a.vertrouwen && a.vertrouwen.length > 0 && (
        <ul className="kgj-reken__vertrouwen">
          {/* 2 nov 2026, Mohammed: "door al die tekst en iconen eronder weet je niet goed dat je moet klikken", "deel aub op zoals bf":
              een klein vinkje per punt zoals bfbouw.be (rk__vinkjes), geen eigen icoon meer dat op een keuze lijkt. */}
          {a.vertrouwen.map((v) => <li key={v}><Check aria-hidden="true" />{v}</li>)}
        </ul>
      )}
      {/* Trustrij zoals op de rekenaarkaart (Google 5,0 + sterren, dan de cijfers). Nooit het aantal reviews.
          5 nov 2026: op het contactscherm staat ze in het formulier (trustInForm). */}
      {!trustInForm && trustRij}
      {/* 26 okt 2026, Mohammed: privacyregel onder de trustsignalen, zodat die op de laatste stap meteen onder de knop in beeld staan. */}
      {klaar && !laden && <p className="kgj-reken__privacy kgj-reken__privacy--na">Wij gebruiken uw gegevens alleen voor deze aanvraag. <a href="/privacy">Privacybeleid</a></p>}
    </div>
    </Fragment>
  );
}
