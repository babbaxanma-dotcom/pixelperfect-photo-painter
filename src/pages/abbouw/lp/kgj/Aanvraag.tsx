{/* 26 okt 2026, Mohammed: privacyregel onder de trustsignalen. 18 nov 2026 (v2): onder de kaart, direct na het contactblok. */}import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, BadgePercent, CalendarCheck, Check, ChevronDown, ChevronLeft, ClipboardCheck, Clock, Hammer, Mail, Phone, Plus, SearchCheck, ShieldCheck, User, UserCheck } from 'lucide-react';
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
import { bewaarContact, mailGeldig, mailKaal, naamGeldig, telGeldig } from './contact-controle';

/* Testhaken (5 nov 2026, zoals bfbouw.be window.__bfLaadMs / __bfVolUit): __abLaadMs = duur van de laadstap (0 = meteen het
   contactscherm), __abVolUit = geen focusstand (18 nov 2026: het volle scherm en het venster bestaan niet meer). */
/* 16 nov 2026: __abVeegUit = de regel "vegen is geen tik" uit (positieve controle van scripts/check-lp-veeg.cjs). */
/* 18 nov 2026 (v2): __abWachtMs = hoe lang de kaart op het versturen wacht (standaard 15 s; kortere waarde voor de toets). */
type AbTest = { __abLaadMs?: number; __abVolUit?: boolean; __abVeegUit?: boolean; __abWachtMs?: number };

/* Meldingen onder het veld (18 nov 2026, v2): dezelfde zinnen als vóór v2 (toen in één vak boven de verzendknop). */
const MELDING = {
  naam: 'Vul uw naam in.',
  telLeeg: 'Vul uw telefoonnummer in. Wij bellen u om een moment af te spreken.',
  telFout: 'Dat telefoonnummer lijkt niet volledig. Controleer het even.',
  mailLeeg: 'Vul uw e-mailadres in. Daar sturen wij uw offerte naartoe.',
  mailFout: 'Dat e-mailadres lijkt niet juist. Controleer het even.',
} as const;
type CVeld = 'naam' | 'email' | 'telefoon';
/* Een nummer met onzichtbare richtingstekens of harde spaties (adresboek, automatische invulling) gaat schoon naar het CRM. */
const telSchoon = (t: string) => t.replace(/[\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, '').replace(/\u00a0/g, ' ').trim();
const wachtEven = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

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
/* 18 nov 2026 avond, Mohammed: "het blijft wazig bij scrollen", "kijk exact hoe solvari dit heeft":
   exact Solvari (forms.js: useElementVisibility(root, { rootMargin: '-100px' }) + onClickOutside): uit zodra de kaart niet meer zichtbaar is
   binnen FOCUS_MARGE px van de schermrand, of bij een tik op de sluier. FOCUS_UIT_DEEL geldt niet meer. Na onze eigen scroll: event ab-eigen-klaar = opnieuw kijken. */
/* De kaart staat in de hero: wie naar de kop erboven scrolt, houdt de kaart in beeld. Daarom ook: zelf meer dan FOCUS_UIT_PX scrollen = uit (vanaf de
   rustpositie y0: bij aan, na onze eigen scroll, met een veld in focus). */
const FOCUS_MARGE = 100, FOCUS_UIT_PX = 40;
const eigen = { aan: false, t: 0, cap: 0, y0: 0 };
function eigenKlaar() { eigen.aan = false; window.clearTimeout(eigen.t); window.clearTimeout(eigen.cap); eigen.y0 = window.scrollY; window.dispatchEvent(new Event('ab-eigen-klaar')); }
export function eigenScroll() {
  eigen.aan = true;
  window.clearTimeout(eigen.t); eigen.t = window.setTimeout(eigenKlaar, 250);
  window.clearTimeout(eigen.cap); eigen.cap = window.setTimeout(eigenKlaar, 3000);
}

/* ---------- Vegen is geen tik (16 nov 2026, staal) ----------
   Wie op de gsm over de kaart veegt om te scrollen, koos soms ongewild een antwoord en stond een vraag verder. De browser geeft nog een
   klik zolang de vinger binnen zijn eigen marge blijft, en ook voor de aanraking die een uitlopende scroll stopt. Daarom, alleen voor de
   antwoordtegels (kies):
   - een aanraking die meer dan VEEG_PX bewoog (of door de browser werd afgebroken) is een veeg; het einde ervan wordt onthouden;
   - een tik telt niet als de aanraking zelf meer dan TIK_PX bewoog, of minder dan NA_VEEG_MS na het einde van een veeg begon;
   - muis, pen en toetsenbord tellen altijd, ook knop.click() (de vroege tik van vóór het hydrateren, LpBf);
   - alleen de vinger telt: een scroll van de pagina zelf (stapwissel, inBeeld) houdt de volgende tik niet tegen.
   De aanrakingen worden op het document gevolgd (vangfase, passief), één keer voor beide kaarten. De browser stuurt geen touchmove
   zolang de vinger binnen zijn marge blijft; de plaats bij het loslaten telt daarom mee. Guard: scripts/check-lp-veeg.cjs. */
const VEEG_PX = 10;
const TIK_PX = 4;
const NA_VEEG_MS = 600;
type Aanraking = { x: number; y: number; max: number; sindsVeeg: number };
const tast: { nu: Aanraking | null; laatste: Aanraking | null; veegEinde: number; aan: boolean } = { nu: null, laatste: null, veegEinde: -Infinity, aan: false };
function tastAan() {
  if (tast.aan || typeof document === 'undefined') return;
  tast.aan = true;
  const opt = { capture: true, passive: true } as const;
  const ver = (a: Aanraking, t: Touch) => { a.max = Math.max(a.max, Math.hypot(t.clientX - a.x, t.clientY - a.y)); };
  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (!t) return;
    if (e.touches.length > 1) { if (tast.nu) tast.nu.max = Infinity; return; } // tweede vinger (knijpen): geen tik
    tast.nu = { x: t.clientX, y: t.clientY, max: 0, sindsVeeg: performance.now() - tast.veegEinde };
  }, opt);
  document.addEventListener('touchmove', (e) => { if (tast.nu && e.touches[0]) ver(tast.nu, e.touches[0]); }, opt);
  const einde = (e: TouchEvent) => {
    const a = tast.nu;
    if (!a) return;
    if (e.changedTouches[0]) ver(a, e.changedTouches[0]);
    if (e.type === 'touchcancel') a.max = Infinity; // de browser nam de aanraking over (scrollen, systeemgebaar)
    if (e.touches.length) return; // er ligt nog een vinger op het scherm
    if (a.max > VEEG_PX) tast.veegEinde = performance.now();
    tast.laatste = a;
    tast.nu = null;
  };
  document.addEventListener('touchend', einde, opt);
  document.addEventListener('touchcancel', einde, opt);
}
/** Is deze klik op een antwoordtegel het staartje van een veeg? soortDruk = het pointerType van de laatste pointerdown op een tegel
    (Safari gaf lang een klik zonder pointerType). */
function veegTik(e: React.MouseEvent, soortDruk: string): boolean {
  if ((window as unknown as AbTest).__abVeegUit) return false;
  if (e.detail === 0) return false; // toetsenbord (Enter, spatie) en knop.click()
  const soort = (e.nativeEvent as PointerEvent).pointerType || soortDruk;
  if (soort !== 'touch') return false; // muis en pen
  const a = tast.laatste;
  return !!a && (a.max > TIK_PX || a.sindsVeeg < NA_VEEG_MS);
}

/* ---------- Smal scherm (19 nov 2026) ----------
   Clarity: AB 19 nov 09:10 (Android, 274x493) en BF 18 nov 16:17 (226x412), een gsm met grote weergave of grote tekst: drie vragen in 12 s, het
   contactscherm, dan 20 s naar beneden tot de bodem en weg. Mohammed: "ze maken het form af, maar scrollen dan om te lezen", "en dan raken ze
   verdwaald". Onder 340 px: "Na uw aanvraag" ingeklapt (één regel), de kopbalk kleiner en de kaart met minder binnenmarge (lp-bf-ab.css, blok 19 nov). */
const SMAL = '(max-width: 339.98px)';
function useSmal() {
  const [smal, setSmal] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(SMAL);
    const zet = () => setSmal(m.matches);
    zet();
    m.addEventListener?.('change', zet);
    return () => m.removeEventListener?.('change', zet);
  }, []);
  return smal;
}

export default function Aanvraag({ inhoud, voor, boven, plek = 'hero', kaartkop }: {
  inhoud: KgjInhoud;
  /** Eigen kop van deze ene kaart (23 nov 2026, kaart in de hero van /lp/dakwerken: "Gratis offerte in 2 minuten" met een regel eronder); de andere
      kaart op de pagina houdt de kop uit inhoud.aanvraag. Alleen tekst: vragen, verzending en meting zijn die van de kaart zonder eigen kop. */
  kaartkop?: { titel: string; regel?: string };
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
  /* 18 nov 2026 (formulier v2): de meldingen onder de velden (pas na een poging om te versturen). Renovatie en dak hebben allebei
     E-mailadres verplicht (contactVelden.email 'verplicht'). */
  const emailVerplicht = a.contactVelden?.email === 'verplicht';
  const veldFout = stand.veldFout ?? {};
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
  const naamVeld = useRef<HTMLInputElement>(null);
  const telVeld = useRef<HTMLInputElement>(null);
  const mailVeld = useRef<HTMLInputElement>(null);
  const cVelden = { naam: naamVeld, email: mailVeld, telefoon: telVeld } as const;
  const verzendKnop = useRef<HTMLButtonElement>(null);
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
  /* Het contactblok telt mee: "Stap 1 van 5" bij vier vragen. De balk staat bij het laden al op de eerste stap. */
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
    /* 18 nov 2026 (v2): geen volle scherm en geen venster meer; ook de contactstappen staan in de pagina. */
    const kop = el.querySelector<HTMLElement>('.kgj-reken__kop') ?? el;
    const gedrag: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    /* 18 nov 2026 (Mohammed: "bij het form invullen zijn de andere forms zo wit"; gemeten op bfbouw.be 1265x585: na het eerste antwoord lag de witte
       kopbalk over de kaarttitel "Gratis offerte aanvragen", alleen "Stap 2" bleef zichtbaar): het vaste punt is de bovenrand van de KAART (met de
       titel) 8 px onder de onderkant van de vaste kopbalk, gemeten op het moment zelf (elke breedte, ook als de balk bij het scrollen wit wordt);
       niet meer "Stap x" onder de balk. Een verborgen balk (html.is-kopweg) telt als 0. */
    const balkEl = document.querySelector<HTMLElement>('.kgj-kop'), bcs = balkEl && getComputedStyle(balkEl);
    const balkH = balkEl && bcs && (bcs.position === 'fixed' || bcs.position === 'sticky') && bcs.visibility !== 'hidden' ? Math.max(0, balkEl.getBoundingClientRect().bottom) : 0;
    const boven = balkH + 8;
    const kopTop = kop.getBoundingClientRect().top;
    const kaartTop = el.getBoundingClientRect().top;
    /* onderkant van wat de bezoeker nu moet tikken: de keuzes, Volgende, of de verzendknop met de regel eronder */
    /* 2 nov 2026: ook de regel onder de verzendknop ("Onze dakexpert contacteert u ... over uw offerte."): zegt wat er na de knop gebeurt. */
    /* 18 nov 2026 (v2): bij de contactstappen is het doel de knop van die stap ("Verder" of de verzendknop); "Na uw aanvraag" mag onder het scherm staan. */
    const doelen = [...el.querySelectorAll<HTMLElement>('.kgj-reken__stap :is(.kgj-reken__keuze, .kgj-reken__vink, .kgj-reken__verder, .kgj-reken__knop, .kgj-reken__knopzeker, .kgj-reken__gerust)')];
    /* een offertestap focust zijn kop (geen veld: op de gsm zou het toetsenbord openspringen) */
    const onderkant = doelen.length ? Math.max(...doelen.map((d) => d.getBoundingClientRect().bottom)) : kopTop;
    const tekort = onderkant - (window.innerHeight - 12);
    const kopWeg = kaartTop < balkH; // de kaart (titel) ligt (deels) onder de kopbalk of boven het scherm
    if (!kopWeg && tekort <= 0) return;
    let naar = kopWeg ? kaartTop - boven : Math.min(tekort, kaartTop - boven);
    /* Past de stap dan niet (de afvinkvraag van de renovatiepagina's op 390x637: "Volgende" viel onder het scherm, check:aanvraag), dan het punt van
       vóór 18 nov: "Stap x" direct onder de balk, zodat de knop in beeld blijft. Op de dakpagina's past elke stap (check:formulier H). */
    if (tekort > 0 && onderkant - naar > window.innerHeight - 12) {
      naar = kopTop < balkH + 4 ? kaartTop - boven : Math.min(tekort, kopTop - boven);
      if (kopTop < balkH + 4 && tekort - naar > 0) naar = kopTop - boven;
    }
    /* 19 nov 2026 (smal scherm, 226x412 en 274x493, gemeten): lag de kaarttitel boven de balk (kopWeg) en paste de stap, dan schoof de pagina de
       titel terug onder de balk en viel de verzendknop eronder (226x412: knop tot 445 px). Valt na de berekening hierboven de knop nog onder het
       scherm, dan net zoveel minder terug dat hij in beeld staat, met "Stap x" en Terug onder de balk; past ook dat niet (de afvinkvraag op
       226x412), dan "Stap x" en Terug direct onder de balk (zoals vóór 18 nov): Terug ligt nooit onder de balk. Waar de stap al paste (390x664,
       360x740), verandert niets. */
    const nodig = onderkant - (window.innerHeight - 12);
    if (nodig > naar) naar = nodig <= kopTop - boven ? nodig : Math.max(naar, kopTop - boven);
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

  /* ---------- Geen concurrerende belknoppen tijdens het formulier (18 nov 2026) ----------
     Mohammed: "de bel directjes ctas moeten weg wanneer hij daar is ofzo, gaat het niet zorgen voor problemen meerdere ctas". Vanaf het
     eerste antwoord (stand.aangetikt) en zolang een aanvraagkaart (ook maar deels) in beeld is: html.is-informulier; de CSS laat dan de
     belknop in de kopbalk en de ronde belknop wegvagen (de kopbalk zelf verspringt niet). Volledig uit beeld gescrold = terug; na versturen
     gaat de bezoeker naar de bedankpagina (de klasse gaat weg bij het verlaten). Eén register voor de twee kaarten. */
  const aangetikt = levend.aangetikt && !levend.vraagToestemming;
  useEffect(() => {
    const el = kaart.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const w = window as unknown as { __abKaartInBeeld?: Record<string, boolean>; __abGestart?: boolean };
    const reg = (w.__abKaartInBeeld ??= {});
    const zet = () => document.documentElement.classList.toggle('is-informulier', !!w.__abGestart && Object.values(reg).some(Boolean));
    const io = new IntersectionObserver(([r]) => { reg[plek] = r.isIntersecting; zet(); });
    io.observe(el);
    return () => { io.disconnect(); delete reg[plek]; zet(); };
  }, [plek]);
  useEffect(() => {
    const w = window as unknown as { __abKaartInBeeld?: Record<string, boolean>; __abGestart?: boolean };
    w.__abGestart = aangetikt;
    document.documentElement.classList.toggle('is-informulier', aangetikt && Object.values(w.__abKaartInBeeld ?? {}).some(Boolean));
  }, [aangetikt]);
  useEffect(() => () => { document.documentElement.classList.remove('is-informulier'); (window as unknown as { __abGestart?: boolean }).__abGestart = false; }, []);

  /* ---------- Laadstap (5 nov 2026, zoals bfbouw.be cad4e57) ----------
     Mohammed (bfbouw.be, 4-5 nov): "vanaf ze bij de laatste stap zijn, het laad zo 1 second, gegevens opslaan, en dan opent het de
     contactscherm op een hoge cro manier"; hier: "doe bij ab de exact form dingen" (5 nov).
     Na het laatste antwoord: 1,2 s "Uw aanvraag wordt klaargezet" met drie regels die afvinken (regel 2 = de eigen antwoorden), daarna
     schuift het contactblok open. De antwoorden staan dan in sessionStorage (AanvraagStaat.tsx bewaarAanvraag).
     18 nov 2026 (formulier v2, zoals bfbouw.be 8aee942; Mohammed: "die popup kan je weghalen", "doe al di fix van dat het geen popup is",
     "die harste fixes dat je had en push"). Tot vandaag opende het contactscherm vanaf de laadstap over het hele scherm (gsm) of als venster
     met een donkere achtergrond (pc), met een sluitknop en een eigen regel in de geschiedenis. Opnames 18 okt-17 nov (bfbouw.be): van wie
     het contactscherm bereikte, vertrokken 7 van 8 zonder een veld aan te raken, 5 van de 7 met het kruisje of de terugactie. Nu is het
     contactblok de volgende stap in dezelfde kaart, in de pagina, met dezelfde balk, teller en "Terug". Geen volle scherm, geen
     achtergrond, geen sluitknop, geen eigen geschiedenisregel: de terugknop van de browser doet wat hij op elke site doet, en wie terugkomt,
     vindt zijn antwoorden en getypte gegevens terug (ab_aanvraag en ab_contact in de sessie van het tabblad). Oud: git show 9f8ff8e. */
  const [laden, setLaden] = useState(false);
  const [laadFase, setLaadFase] = useState(0);
  const [nieuw, setNieuw] = useState(false);
  const laadBeurt = useRef(0);
  const klokken = useRef<number[]>([]);
  const startLaad = (antw: Record<string, string>, vink: Record<string, string[]>) => {
    bewaarAanvraag(antw, vink);
    focusUit(); // 18 nov 2026 (v2): de sluier gaat uit vanaf de laadstap (vroeger deed het volle scherm dat)
    const t = (window as unknown as AbTest).__abLaadMs;
    const ms = !a.laden ? 0 : typeof t === 'number' ? t : 1200;
    if (ms <= 0) return;
    const beurt = ++laadBeurt.current;
    setLaadFase(0);
    setLaden(true);
    meldClarity(`${clarityNaam}-laden`);
    // 18 nov 2026 (Solvari): de cirkel draait, op 65 % wordt hij een groene vink ("Gegevens geanalyseerd"), dan het contactblok
    klokken.current = [window.setTimeout(() => { if (beurt === laadBeurt.current) setLaadFase(1); }, Math.round(ms * 0.65))];
    klokken.current.push(window.setTimeout(() => {
      if (beurt !== laadBeurt.current) return;
      setLaden(false);
      setNieuw(true);
    }, ms));
  };
  useEffect(() => () => { klokken.current.forEach((k) => window.clearTimeout(k)); }, []);

  /* ---------- Contactblok (18 nov 2026, v2) ----------
     Mohammed (18 nov, referentie op zijn klembord): het einde van het formulier "gewoon zo", "belgen houden niet van die ai stijl": een kop
     "Contact", "Uw naam" over de volle breedte, "Telefoonnummer" en "E-mailadres" ernaast (gsm: onder elkaar), een lijnicoon links in elk
     veld, de verzendknop over de volle breedte. Niets anders in het blok. Alle drie verplicht (AB-regel van 2 nov). Een melding verschijnt
     pas na een poging om te versturen, rood onder het veld zelf; de melding "Versturen lukte niet" direct onder de verzendknop. */
  const zetContact = (veld: CVeld, waarde: string) => {
    zet((s) => {
      const vf = { ...(s.veldFout ?? {}) };
      const n = { ...s, aangetikt: true, [veld]: waarde, veldFout: vf };
      /* zodra een gemarkeerd veld klopt, gaat de melding weg (zo verdwijnt rood terwijl de bezoeker typt; nieuw rood komt pas bij versturen) */
      if (vf[veld] && !veldMelding(veld, n)) delete vf[veld];
      bewaarContact({ naam: n.naam, email: n.email, telefoon: n.telefoon });
      return n;
    });
  };
  /** De melding voor dit veld, of null als het klopt. */
  function veldMelding(veld: CVeld, s: AanvraagStand): string | null {
    if (veld === 'naam') return naamGeldig(s.naam) ? null : MELDING.naam;
    if (veld === 'email') { if (!emailVerplicht && !(s.email ?? '').trim()) return null; const m = mailKaal(s.email ?? ''); return !m ? MELDING.mailLeeg : mailGeldig(m) ? null : MELDING.mailFout; }
    const t = s.telefoon.trim(); return !t ? MELDING.telLeeg : telGeldig(t) ? null : MELDING.telFout;
  }
  /* Enter (of "volgende" op het toetsenbord van de gsm): naar het volgende veld dat nog leeg is; in het laatste veld, of als alles erna
     al ingevuld is, verstuurt Enter (zoals bfbouw.be audit f5bc8cc: Enter in het naamveld verstuurde vroeger het formulier). */
  const VOLGORDE: CVeld[] = ['naam', 'telefoon', 'email'];
  const enterNaar = (e: React.KeyboardEvent<HTMLInputElement>, veld: CVeld) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    const s = levendRef.current;
    const leeg = VOLGORDE.slice(VOLGORDE.indexOf(veld) + 1).find((v) => !String((v === 'email' ? s.email : s[v]) ?? '').trim());
    if (leeg) { e.preventDefault(); cVelden[leeg].current?.focus(); }
  };
  /* Toetsenbord open (gemeten met een venster dat 290 px kleiner wordt, zoals een gsm-toetsenbord): de kop "Contact", het veld met de
     cursor en de verzendknop staan samen in beeld, onder de vaste kopbalk. Past dat niet: veld + knop; dan het invoervak + knop. */
  const houdInBeeld = () => {
    const el = kaart.current, act = document.activeElement as HTMLElement | null;
    if (!el || !act || !el.contains(act) || !act.matches('.kgj-reken__contact input')) return;
    const vv = window.visualViewport, top = vv ? vv.offsetTop : 0, hoog = vv ? vv.height : window.innerHeight;
    const kopEl = document.querySelector<HTMLElement>('.kgj-kop'), kcs = kopEl && getComputedStyle(kopEl);
    const kb = kopEl && kcs && kcs.position === 'fixed' && kcs.visibility !== 'hidden' ? kopEl.getBoundingClientRect().bottom : 0;
    const boven = Math.max(top, kb) + 8, onder = top + hoog - 8;
    const knop = verzendKnop.current;
    const vraagEl = el.querySelector<HTMLElement>('.kgj-reken__ckop');
    if (!knop) return;
    const vr = (act.closest<HTMLElement>('.kgj-reken__cveld') ?? act).getBoundingClientRect(), ir = act.getBoundingClientRect(), kr = knop.getBoundingClientRect();
    const qr = vraagEl ? vraagEl.getBoundingClientRect() : vr;
    let dy = 0;
    const bovenkant = [Math.min(qr.top, vr.top), vr.top, ir.top].find((y) => Math.max(kr.bottom, vr.bottom) - y <= onder - boven);
    if (bovenkant === undefined) dy = ir.top - boven;
    else if (kr.bottom > onder) dy = kr.bottom - onder;
    else if (bovenkant < boven) dy = bovenkant - boven;
    if (bovenkant !== undefined && bovenkant - dy < boven) dy = bovenkant - boven;
    if (Math.abs(dy) < 2) return;
    eigenScroll();
    window.scrollBy(0, dy);
  };
  /* Typen op de gsm (toetsenbord open: het zichtbare deel is meer dan 150 px lager dan het hoogste dat we op deze breedte zagen): de vaste
     kopbalk is weg (html.is-kopweg), zodat kop, veld en knop in de kleine ruimte passen. Gaat het toetsenbord dicht, dan blijft de balk weg
     tot de bezoeker zelf scrolt: kwam hij meteen terug, dan lag hij over het veld (niets verspringt). Zoals bfbouw.be zetTyp (8aee942). */
  useEffect(() => {
    const html = document.documentElement as HTMLElement & { __abTyp?: string };
    const hoogste: Record<number, number> = {};
    const hoogte = () => (window.visualViewport ? window.visualViewport.height : window.innerHeight);
    const open = () => { const h = hoogte(), w = Math.round(window.innerWidth); hoogste[w] = Math.max(hoogste[w] || 0, h); return h < hoogste[w] - 150; };
    let vorige = hoogte();
    const zetTyp = () => {
      const el = kaart.current, act = document.activeElement;
      const aan = window.matchMedia('(max-width: 1000px)').matches && !!el && !!act && el.contains(act) && act.matches('.kgj-reken__contact input') && open();
      if (aan) { html.__abTyp = plek; html.classList.add('is-ctyp', 'is-kopweg'); }
      else if (html.__abTyp === plek) { html.__abTyp = undefined; html.classList.remove('is-ctyp'); }
    };
    const opHoogte = () => { const h = hoogte(), kleiner = h < vorige - 40; vorige = h; zetTyp(); if (kleiner) { houdInBeeld(); window.setTimeout(houdInBeeld, 120); } };
    const focusWissel = () => window.setTimeout(zetTyp, 0);
    const kopTerug = () => { if (html.classList.contains('is-kopweg') && !html.classList.contains('is-ctyp')) html.classList.remove('is-kopweg'); };
    const toets = (e: KeyboardEvent) => { if (/^(PageUp|PageDown|ArrowUp|ArrowDown|Home|End| )$/.test(e.key) && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '')) kopTerug(); };
    open();
    const vv = window.visualViewport;
    if (vv) vv.addEventListener('resize', opHoogte); else window.addEventListener('resize', opHoogte);
    document.addEventListener('focusin', focusWissel);
    document.addEventListener('focusout', focusWissel);
    document.addEventListener('touchmove', kopTerug, { passive: true });
    window.addEventListener('wheel', kopTerug, { passive: true });
    document.addEventListener('keydown', toets);
    return () => {
      if (vv) vv.removeEventListener('resize', opHoogte); else window.removeEventListener('resize', opHoogte);
      document.removeEventListener('focusin', focusWissel);
      document.removeEventListener('focusout', focusWissel);
      document.removeEventListener('touchmove', kopTerug);
      window.removeEventListener('wheel', kopTerug);
      document.removeEventListener('keydown', toets);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plek]);

  /* ---------- Focusstand (7 nov 2026, zoals bfbouw.be; zie eigenScroll bovenaan) ----------
     Bij de klikvragen vóór de laadstap: een sluier over al de rest (gsm wit, pc donker; CSS lp-bf-ab.css blok 7 nov), de kaart blijft in de
     pagina staan. Aan bij de eerste tik op een knop in de kaart (of een knop "Ik ben op zoek naar", event ab-focus-start) en bij elke tik daarna.
     Uit zodra de bezoeker zelf wegscrollt (minder dan de helft van de kaart in beeld), bij een tik op de sluier, Esc, de laadstap, en bij
     terugkeer van de bedankpagina. Eén kaart tegelijk (event ab-focus). Testhaak: __abVolUit houdt ook de focusstand uit, zoals __bfVolUit. */
  const [focus, setFocus] = useState(false);
  const focusRef = useRef(false);
  const focusGestart = useRef(false);
  const bijVraag = useRef(false);
  bijVraag.current = !laden && !klaar && !offerte && !vraagToestemming && !bevroren;
  const focusUit = () => { if (!focusRef.current) return; focusRef.current = false; setFocus(false); };
  const focusAan = () => {
    if ((window as unknown as AbTest).__abVolUit || focusRef.current) return;
    focusRef.current = true;
    if (!eigen.aan) eigen.y0 = window.scrollY;
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
  /* De ouder (hero of slotblok) krijgt is-rkfocus zolang de kaart de stand heeft, en pas na het vervagen (0,2 s) weer af; html.is-rkfocus zolang een
     kaart de stand heeft. 19 nov 2026 (Mohammed: "de terugknop in het form onderaan bij ab is kapot en wit", "je ziet de knop niet", "op sommige
     momenten werkt die niet"): de ouder tilt niet meer zichzelf boven de kopbalk (z-index 1000), alleen de kaart gaat boven de sluier (lp-bf-ab.css,
     blok 19 nov), ook tijdens het wegvagen: zo ligt de kaart nooit een moment onder de wazige sluier. */
  useEffect(() => {
    const el = kaart.current;
    const ouder = el?.closest<HTMLElement>('.bf-lphero__in, .bf-lpinsp__in, .abc-hero__in');
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
      if (act && el.contains(act) && /^(INPUT|SELECT|TEXTAREA)$/.test(act.tagName)) { eigen.y0 = window.scrollY; return; } // toetsenbord open: de browser scrolt zelf
      if (Math.abs(window.scrollY - eigen.y0) > FOCUS_UIT_PX) { focusUit(); return; } // zelf gescrold: alles weer normaal
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom <= FOCUS_MARGE || r.top >= vh - FOCUS_MARGE) focusUit(); // Solvari: niet meer zichtbaar binnen de marge = alles weer normaal
    };
    const scroll = () => {
      if (eigen.aan) { window.clearTimeout(eigen.t); eigen.t = window.setTimeout(eigenKlaar, 250); return; }
      if (!raf) raf = requestAnimationFrame(kijk);
    };
    const toets = (e: KeyboardEvent) => { if (e.key === 'Escape') focusUit(); };
    // alleen een toetsenbord (veld in focus) telt; de adresbalk die bij scrollen meeschuift is ook een resize en telt niet
    const vv = () => { const a = document.activeElement; if (a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) eigenScroll(); };
    const naEigen = () => { if (!raf) raf = requestAnimationFrame(kijk); };
    // een veld in de kaart verliest de focus = het toetsenbord gaat dicht; de scroll die daarop volgt is niet van de bezoeker
    const veldUit = (e: FocusEvent) => { const t = e.target as HTMLElement | null; if (t && kaart.current?.contains(t) && /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) eigenScroll(); };
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('ab-eigen-klaar', naEigen);
    document.addEventListener('focusout', veldUit);
    document.addEventListener('keydown', toets);
    window.visualViewport?.addEventListener('resize', vv);
    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('ab-eigen-klaar', naEigen);
      document.removeEventListener('focusout', veldUit);
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

  /* Na de laadstap: de kop van het contactblok krijgt de focus (zonder te scrollen); geen autofocus in een veld (toetsenbord). */
  useEffect(() => {
    if (!nieuw || actief.current !== plek) return;
    inBeeld();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nieuw]);
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
  /* 16 nov 2026: vegen is geen tik (tast, bovenaan dit bestand). invoer = het pointerType van de laatste pointerdown op een tegel. */
  const invoer = useRef('');
  useEffect(() => { tastAan(); }, []);
  const kies = (sleutel: string, label: string, e?: React.MouseEvent) => {
    const soortDruk = invoer.current;
    invoer.current = '';
    if (e && veegTik(e, soortDruk)) { setDruk(null); return; }
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

  /* Versturen (18 nov 2026, formulier v2, zoals bfbouw.be audit f5bc8cc; gemeten op bfbouw.be met een nagebootste storing: één mislukt
     verzoek gaf meteen "Versturen lukte niet", een verzoek zonder antwoord bleef eeuwig op "Bezig"):
     - eerst de drie velden; elk fout veld krijgt zijn melding rood onder het veld, de cursor gaat naar het eerste (volgorde van het blok);
     - de knop toont "Bezig…" en werkt niet tot er een uitkomst is (één aanvraag, ook bij een dubbele tik of uit de twee kaarten samen);
     - valt de verbinding weg of geeft elk transport een serverfout (submitLead opnieuw = true), dan gaat de aanvraag vanzelf nog 2 keer
       (na 1 s en na 3 s); na een time-out of een fout van de aanvraag zelf niet (die kan al aangekomen zijn: anders twee leads);
     - na 15 s zonder uitkomst stopt het wachten;
     - mislukt: de melding direct onder de verzendknop, de knop werkt weer, alle antwoorden en getypte gegevens blijven staan. */
  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    gebruik();
    if (verstuurt.current) return;
    const f = new FormData(e.currentTarget);
    const s0 = levendRef.current;
    const schoonMail = mailKaal(s0.email ?? '');
    if (schoonMail !== (s0.email ?? '')) zetContact('email', schoonMail); // punt of spatie achteraan weg (iPhone: twee spaties = punt)
    const s1 = { ...s0, email: schoonMail };
    /* 20 okt 2026 (Mohammed: de bevestigings-sms begint met "Dag {{voornaam}},"): de naam is verplicht. Volgorde = die van het blok. */
    const meldingen: Partial<Record<CVeld, string>> = {};
    for (const v of VOLGORDE) { const m = veldMelding(v, s1); if (m) meldingen[v] = m; }
    const eerste = VOLGORDE.find((v) => meldingen[v]);
    if (eerste) {
      zet((s) => ({ ...s, fout: null, veldFout: meldingen }));
      cVelden[eerste].current?.focus();
      return;
    }
    verstuurt.current = true;
    zet((s) => ({ ...s, fout: null, veldFout: {}, bezig: true }));
    const telefoon = telSchoon(s1.telefoon);
    const payload = {
      source: 'landing_page' as const,
      page_path: window.location.pathname,
      landing_division: inhoud.divisie,
      firstName: s1.naam.trim() || undefined,
      email: schoonMail,
      phone: telefoon,
      postcode: String(f.get('postcode') || '').trim() || undefined,
      gemeente: String(f.get('gemeente') || '').trim() || undefined,
      type_werk: inhoud.divisie,
      /* "Aanvraag gratis offerte · Werk: Dakrenovatie · Dak: Hellend dak · ..." (zelfde begin als Inspectie.tsx). */
      /* Offerte: "Aanvraag offerte · Soort werk: Dak herstellen · Type dak: Plat dak · ... · Extra info: ..." (30 okt 2026: alles leesbaar in GHL). */
      aanvullende_info: (offerte ? ['Aanvraag offerte (weet al wat er moet gebeuren)',
        ...OSTAPPEN.flatMap((st) => [...st.velden.map((v) => v.sleutel), ...(st.extra ? [st.extra.sleutel] : [])])
          .filter((k) => (oAntw[k] ?? '').trim()).map((k) => `${k}: ${oAntw[k].trim().replace(/\s+/g, ' ')}`)]
        : ['Aanvraag ' + (inhoud.cta.naam ?? inhoud.cta.kop).toLowerCase(),
          ...BEANTWOORD.map((v) => `${v.sleutel}: ${antwoorden[v.sleutel]}`)]).concat(String(f.get('bericht') || '').trim() ? [`Bericht: ${String(f.get('bericht')).trim().replace(/\s+/g, ' ').slice(0, 1000)}`] : []).join(' · '),
      bron_lead: t.bronLead,
    };
    const wachtMs = typeof (window as unknown as AbTest).__abWachtMs === 'number' ? (window as unknown as AbTest).__abWachtMs! : 15000;
    const begin = Date.now();
    let res: Awaited<ReturnType<typeof submitLead>> | null = null;
    for (let poging = 1; poging <= 3; poging++) {
      const over = wachtMs - (Date.now() - begin);
      if (over <= 0) { res = null; break; }
      let klok = 0;
      const tijd = new Promise<null>((r) => { klok = window.setTimeout(() => r(null), over); });
      res = await Promise.race([submitLead(payload), tijd]);
      window.clearTimeout(klok);
      if (!res || res.ok || !res.opnieuw || poging === 3) break;
      const pauze = poging === 1 ? 1000 : 3000;
      if (Date.now() - begin + pauze >= wachtMs) break;
      await wachtEven(pauze);
    }
    if (!res || !res.ok) {
      verstuurt.current = false;
      meldClarity(`${clarityNaam}-mislukt`);
      zet((s) => ({ ...s, bezig: false, fout: leadFoutmelding(res ?? { ok: false, via: 'none' }, CONTACT.phone.display) }));
      return;
    }
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
  const metPostcode = a.contactVelden?.postcode !== false;
  /* Laadstap regel 2: de eigen antwoorden ("Dakrenovatie · Hellend dak"); een kaal "Weet ik niet" telt niet. */
  const KAAL = /^(ja|nee|weet ik (nog )?niet)$/i;
  const laadRegel = a.laden ? (a.laden.sleutels.map((k) => antwoorden[k]).filter((x) => x && !KAAL.test(x)).join(' · ') || a.laden.leeg) : '';
  /* Trust badges onderaan de kaart bij de klikvragen. 18 nov 2026 (v2, Mohammed: het contactblok "gewoon zo", niets anders): niet bij het
     contactblok. */
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
  /* Eén veld van het contactblok: lijnicoon links in het veld, de tekst als placeholder (en als naam voor een schermlezer), de melding
     rood onder het veld na een poging om te versturen. */
  const cVeld = (veld: CVeld, opties: { tekst: string; icoon: JSX.Element; type: string; auto: string; mode?: 'tel' | 'email'; breed?: boolean }) => {
    const id = `kgj-${plek}-${veld}`, melding = veldFout[veld];
    const waarde = veld === 'email' ? stand.email ?? '' : stand[veld];
    return (
      <div className={`kgj-reken__cveld${opties.breed ? ' kgj-reken__cveld--breed' : ''}`}>
        <span className="kgj-reken__cic" aria-hidden="true">{opties.icoon}</span>
        <input ref={cVelden[veld]} id={id} name={veld} type={opties.type} autoComplete={opties.auto} inputMode={opties.mode}
          autoCapitalize={veld === 'naam' ? 'words' : undefined} enterKeyHint={veld === 'email' ? 'send' : 'next'}
          placeholder={opties.tekst} aria-label={opties.tekst} aria-required="true" aria-invalid={melding ? true : undefined}
          aria-describedby={melding ? `${id}-fout` : undefined} value={waarde} onFocus={gebruik}
          onChange={(e) => zetContact(veld, e.target.value)} onKeyDown={(e) => enterNaar(e, veld)} />
        {melding && <p className="kgj-reken__veldfout" id={`${id}-fout`}>{melding}</p>}
      </div>
    );
  };

  /* 7 nov 2026: sluier van de focusstand (zoals bfbouw.be rk__sluier); een tik erop zet de stand uit.
     19 nov 2026: de sluier staat niet meer vlak vóór de kaart, maar direct in de wortel van de pagina (.bf.bf-lp, via een portal). Gemeten in de
     Safari-motor (WebKit), onderste kaart op 390x664: de vaste sluier binnen het slotblok (section met overflow:hidden, ouder met z-index 1000)
     werd in de verkeerde laag getekend: vinkjes en belknop van het slotblok lagen scherp bovenop de kopbalk en de sluier; Chrome toonde dat niet.
     Een vast vlak binnen een voorouder met overflow:hidden tekent Safari anders (zelfde soort fout als bfbouw.be 8 nov, 3f905c9). In de wortel
     heeft de sluier geen voorouder met overflow, transform of stapelcontext; de kaart gaat erboven met z-index (lp-bf-ab.css, blok 19 nov).
     Vóór het eerste beeld na het laden (en in de voorgerenderde HTML) bestaat de sluier niet: de stand is dan altijd uit. */
  const [wortel, setWortel] = useState<HTMLElement | null>(null);
  useEffect(() => { setWortel(kaart.current?.closest<HTMLElement>('.bf.bf-lp') ?? null); }, []);
  const sluier = <div className={`kgj-reken__sluier${focus ? ' is-aan' : ''}`} aria-hidden="true" onClick={focusUit} />;

  /* ---------- Terugweg naar het formulier (19 nov 2026) ----------
     Mohammed: "ze maken het form af, maar scrollen dan om te lezen", "en dan raken ze verdwaald", "iets technisch dat je makkelijk terug kan
     invullen". Staat de bezoeker voorbij vraag 1 (een latere vraag, de laadstap, het contactblok of de offertestappen) en is geen enkele
     aanvraagkaart nog in beeld, dan staat onderaan een vaste knop "Aanvraag afronden". Een tik brengt hem naar de kaart waarin hij bezig was
     (actief: bovenaan of onderaan), op dezelfde plek als na een stap (inBeeld): antwoorden en getypte gegevens staan er nog (gedeelde stand).
     Zodra een kaart weer in beeld is, verdwijnt de knop. Eén knop per pagina (de kaart bovenaan beheert hem). Hij hangt in de wortel (.bf.bf-lp,
     portal): een vast element binnen een sectie met overflow tekent Safari verkeerd (reference_ios_vast_scherm_afgeknipt). Zolang hij staat,
     wijkt de ronde belknop rechtsonder (html.is-afronden), zoals de belknoppen tijdens het formulier wijken (is-informulier, 18 nov). */
  const smal = useSmal();
  const [afronden, setAfronden] = useState(false);
  const verderDanStart = levend.aangetikt && (levend.stap > 0 || !!levend.offerte) && !levend.vraagToestemming;
  useEffect(() => {
    if (onder) return;
    let raf = 0;
    const kijk = () => {
      raf = 0;
      if (!verderDanStart) { setAfronden(false); return; }
      const kop = document.querySelector<HTMLElement>('.kgj-kop'), kcs = kop && getComputedStyle(kop);
      const kb = kop && kcs && kcs.position === 'fixed' && kcs.visibility !== 'hidden' ? Math.max(0, kop.getBoundingClientRect().bottom) : 0;
      const zicht = [...document.querySelectorAll<HTMLElement>('.kgj-reken--aanvraag')].some((k) => {
        const r = k.getBoundingClientRect();
        return r.height > 0 && r.bottom > kb + 24 && r.top < window.innerHeight - 24;
      });
      setAfronden(!zicht);
    };
    const plan = () => { if (!raf) raf = requestAnimationFrame(kijk); };
    plan();
    window.addEventListener('scroll', plan, { passive: true });
    window.addEventListener('resize', plan);
    return () => { window.removeEventListener('scroll', plan); window.removeEventListener('resize', plan); if (raf) cancelAnimationFrame(raf); };
  }, [onder, verderDanStart]);
  useEffect(() => {
    if (onder) return;
    document.documentElement.classList.toggle('is-afronden', afronden);
  }, [onder, afronden]);
  useEffect(() => () => { if (!onder) document.documentElement.classList.remove('is-afronden'); }, [onder]);
  /* Elke kaart luistert: de knop zegt welke kaart (actief) de bezoeker terugkrijgt. */
  useEffect(() => {
    const naar = (e: Event) => { if ((e as CustomEvent).detail === plek) inBeeld(); };
    window.addEventListener('ab-afronden', naar);
    return () => window.removeEventListener('ab-afronden', naar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plek]);
  const terugNaarKaart = () => {
    meldClarity('aanvraag-afronden');
    const doel = actief.current === 'onder' && document.querySelector('.kgj-reken--onder') ? 'onder' : 'hero';
    window.dispatchEvent(new CustomEvent('ab-afronden', { detail: doel }));
  };
  const afrondKnop = (
    <button type="button" className={`kgj-afronden${afronden ? ' is-aan' : ''}`} aria-hidden={!afronden} tabIndex={afronden ? 0 : -1} onClick={terugNaarKaart}>
      Aanvraag afronden<ArrowRight aria-hidden="true" />
    </button>
  );

  return (
    <Fragment>
    {wortel && createPortal(sluier, wortel)}
    {wortel && !onder && createPortal(afrondKnop, wortel)}
    <div ref={kaart} onClickCapture={focusKlik} className={`kgj-reken kgj-reken--aanvraag${onder ? ' kgj-reken--onder' : ''}${a.badges ? ' kgj-reken--badges' : ''}${stand.aangetikt && stap > 0 ? ' is-bezig' : ''}${klaar ? ' is-contact' : ''}${laden ? ' is-laden' : ''}${focus ? ' is-focus' : ''}`}>
      {/* 18 nov 2026 (v2, Mohammed: "gewoon de algemene stijl robuuster minder speels"): kaartkop zonder icoonvierkant. */}
      <div className="kgj-reken__hoofd">
        <div>
          <p className="kgj-reken__titel">{kaartkop?.titel ?? a.titel}</p>
          {kaartkop?.regel && <p className="kgj-reken__regel">{kaartkop.regel}</p>}
          {/* 2 nov 2026: zonder tijdregel als tijd leeg is (bfbouw.be 31 okt: kaartkop "Gratis offerte aanvragen" alleen). */}
          {!kaartkop && a.tijd && <p className="kgj-reken__tijd"><Clock aria-hidden="true" />{a.tijd}</p>}
        </div>
      </div>
      {boven}
      <div className="kgj-reken__weg" aria-hidden="true">
        {/* 7 nov 2026, zoals bfbouw.be (Mohammed daar: "maak de balk vanaf de start 40 procent gevuld"): 40 % bij stap 1, 100 % op het contactscherm. */}
        {/* 18 nov 2026, Mohammed: Solvari-widget ("3 balken bovenaan, en dan heb je gegevens analyseren, dan komt er een groene vink en dan contact"), Cralux ("stap .. van 3, in totaal 3 stappen"), "ook visueel zo met die 3 lijnen, die groen zijn": drie groene lijnen; lijn 1 = de klikvragen (start 40 %, vol pas na het laatste antwoord), lijn 2 = analyse, lijn 3 = contact. */}
        <div className="kgj-reken__lijnen" ref={balk}>
          {/* 18 nov 2026, Mohammed: "1 2 3 zijn de drie vragen, dat zijn de stappen, en de contactformulier hoeft geen aparte visuele stap": een lijn
              per vraag van het pad, groen tot en met de huidige vraag; analyse en contactblok: alle lijnen groen. */}
          {Array.from({ length: Math.max(1, totaal - 1) }, (_, k) => <i key={k} className={klaar || k < nu ? 'is-groen' : undefined} />)}
        </div>
      </div>
      {/* Na een verstuurde aanvraag geen Terug meer: terug naar een vraag zou doen alsof er nog niets verstuurd is. */}
      {!vraagToestemming && (
        <div className="kgj-reken__kop">
          {/* Uitgesproken door een schermlezer alleen in de kaart die de bezoeker gebruikt (de andere kaart verandert mee). */}
          {/* 7 nov 2026, zoals bfbouw.be (Mohammed daar: "DOE ipv stap 1 VAN 7 gewoon stap 1"). */}
          <span className="kgj-reken__tel" data-intern={`Stap ${nu}`} aria-live={actiefHier ? 'polite' : 'off'}>{klaar ? '' : `Stap ${nu} van ${totaal - 1}`}</span>
          {stap > 0 && !laden && (
            <button type="button" className="kgj-reken__terug" onClick={() => { gebruik(); setOFout([]); zet((s) => (s.offerte
              ? ((s.offerteStap ?? 0) > 0 ? { ...s, aangetikt: true, fout: null, offerteStap: (s.offerteStap ?? 0) - 1 } : { ...s, aangetikt: true, fout: null, offerte: false, stap: 0 })
              : { ...s, aangetikt: true, fout: null, stap: Math.max(0, Math.min(s.stap, VRAGEN.length) - 1) })); }}>
              {/* 19 nov 2026, Mohammed: "je ziet de knop niet": pijltje + "Terug", even groot en vet als "Stap x van 3", tikvlak 44 px (CSS). */}
              <ChevronLeft aria-hidden="true" />Terug
            </button>
          )}
          {/* 18 nov 2026 (v2): geen sluitknop meer (geen volle scherm, geen venster). */}
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
        /* 18 nov 2026, Mohammed: Solvari-widget ("3 balken bovenaan, en dan heb je gegevens analyseren, dan komt er een groene vink en dan contact"), Cralux ("stap .. van 3, in totaal 3 stappen"), "ook visueel zo met die 3 lijnen, die groen zijn": stap 2 van 3 = analyse (cirkel draait, wordt een groene vink), onder de kop de eigen antwoorden. */
        <div className={`kgj-reken__laad kgj-reken__analyse${laadFase > 0 ? ' is-klaar' : ''}`}>
          <span className="kgj-reken__analyse-rond" aria-hidden="true"><span className="kgj-reken__analyse-spin" /><span className="kgj-reken__analyse-vink"><Check /></span></span>
          <p className="kgj-reken__laad-kop kgj-reken__analyse-kop" role="status">{laadFase > 0 ? (a.laden.klaar ?? a.laden.kop) : a.laden.kop}</p>
          {laadRegel && <p className="kgj-reken__analyse-sub">{laadRegel}</p>}
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
              /* 18 nov 2026: k.waarde = het antwoord in de aanvraag als dat anders is dan het label ("Beide" -> "Beide (hellend en plat)");
                 k.breed = een rij over de volle breedte onder de tegels, zonder icoon */
              <button type="button" key={k.label} data-waarde={k.waarde}
                className={`kgj-reken__keuze${k.icoon ? ' kgj-reken__keuze--icoon' : ''}${k.breed ? ' kgj-reken__keuze--breed' : ''}${antwoorden[vraag.sleutel] === (k.waarde ?? k.label) ? ' is-aan' : ''}${druk === k.label ? ' is-druk' : ''}`}
                onPointerDown={(e) => { invoer.current = e.pointerType; setDruk(k.label); }}
                onPointerUp={() => setDruk(null)}
                onPointerCancel={() => setDruk(null)}
                onPointerLeave={() => setDruk(null)}
                onClick={(e) => kies(vraag.sleutel, k.waarde ?? k.label, e)}>
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
          {/* 18 nov 2026 (formulier v2; Mohammed, referentie op zijn klembord: het einde van het formulier "gewoon zo", "belgen houden niet van
              die ai stijl dat je hebt"): kop "Contact", "Uw naam" over de volle breedte, "Telefoonnummer" en "E-mailadres" naast elkaar (gsm:
              onder elkaar), lijnicoon links in het veld, de verzendknop over de volle breedte. Niets anders in het blok: geen band "Bijna klaar!",
              geen overzicht "Uw aanvraag", geen hulpregels, geen cijferrij, geen "Na uw aanvraag" (staat op de bedankpagina). Veldnamen (naam,
              telefoon, email) en de aanvraag naar het CRM blijven zoals ze waren. Geen autoFocus: op de gsm sprong het toetsenbord dan meteen
              open (Mohammed, 24 sep). */}
          <form className="kgj-reken__form kgj-reken__contact" onSubmit={verstuur} noValidate aria-labelledby={`kgj-${plek}-ckop`}>
            <p className="kgj-reken__vraag kgj-reken__ckop" id={`kgj-${plek}-ckop`}>Contact</p>
            <div className="kgj-reken__cvelden">
              {cVeld('naam', { tekst: 'Uw naam', icoon: <User />, type: 'text', auto: 'name', breed: true })}
              {cVeld('telefoon', { tekst: 'Telefoonnummer', icoon: <Phone />, type: 'tel', auto: 'tel', mode: 'tel' })}
              {cVeld('email', { tekst: 'E-mailadres', icoon: <Mail />, type: 'email', auto: 'email', mode: 'email' })}
              {metPostcode && <div className="kgj-reken__cveld kgj-reken__cveld--breed"><PostcodeGemeente hint="bv. 2830" /></div>}
            </div>
            {/* 18 nov 2026, Mohammed: "doe bij de laatste stap dat ze ook bericht kunnen doen, optioneel, ga eerst kijken in cro data": een open tekstvak
                drukt de conversie (HubSpot, 40.000 LP's), ingeklapt won (InsightWhale, 54.697 bezoekers, 72% gsm, +26%; Baymard). Dus ingeklapt. */}
            <details className="kgj-reken__bericht" onToggle={(e) => { const d = e.currentTarget; if (d.open) d.querySelector('textarea')?.focus({ preventScroll: true }); }}>
              <summary><Plus aria-hidden="true" /><span>Bericht toevoegen (optioneel)</span></summary>
              <label className="kgj-reken__bericht-label" htmlFor={`kgj-${plek}-bericht`}>Uw bericht (optioneel)</label>
              <textarea id={`kgj-${plek}-bericht`} name="bericht" rows={3} maxLength={1000} />
            </details>
            <button ref={verzendKnop} className="kgj-knop kgj-knop--vol kgj-reken__knop" type="submit" disabled={bezig} aria-busy={bezig || undefined}>
              {bezig ? 'Bezig…' : offerte && a.offerte ? a.offerte.verzend : t.knop}
            </button>
            {/* "Versturen lukte niet ..." direct onder de verzendknop, waar de bezoeker tikte (18 nov 2026, v2). */}
            {fout && <p className="kgj-reken__fout" role={actiefHier ? 'alert' : undefined}>{fout}</p>}
            {/* 18 nov 2026 (Mohammed: "ook kort van wat erna gebeurt", zijn woorden, daarna "niet 1 2 3 zo, meer stappen, zoals kijzer het heeft"):
                direct onder de knop een licht grijs stappenblok "Na uw aanvraag": per stap een cirkel met alleen een rand in de merkkleur en het
                cijfer, de tekst rechts, een stippellijn tussen de cirkels (CSS). Tekst = zijn dictaat (inhoud: naKort). Op de gsm mag het blok onder
                het scherm doorlopen; kop, velden en knop staan bij het openen in beeld. */}
            {/* 19 nov 2026, Mohammed: "dat blok minder lang maken, met alleen de belangrijkste zaken, 3 stappen": drie stappen (inhoud). Onder 340 px
                breed één regel die openklapt (details), zodat de verzendknop onderaan het formulier staat; vanaf 340 px open zoals voorheen. */}
            {a.naKort && a.naKort.length > 0 && (smal ? (
              <details className="kgj-reken__nastap kgj-reken__nastap--klap">
                <summary className="kgj-reken__nastap-kop">{a.volgtKop ?? 'Na uw aanvraag'}<ChevronDown aria-hidden="true" /></summary>
                <ol className="kgj-reken__nakort">
                  {a.naKort.map((r) => <li key={r.titel}><b>{r.titel}</b>{r.tekst && <span>{r.tekst}</span>}</li>)}
                </ol>
              </details>
            ) : (
              <div className="kgj-reken__nastap">
                <p className="kgj-reken__nastap-kop">{a.volgtKop ?? 'Na uw aanvraag'}</p>
                <ol className="kgj-reken__nakort">
                  {a.naKort.map((r) => <li key={r.titel}><b>{r.titel}</b>{r.tekst && <span>{r.tekst}</span>}</li>)}
                </ol>
              </div>
            ))}
          </form>
        </div>
      )}

      {/* 18 nov 2026 (v2): bij het contactblok staan de vinkjes en de cijferrij niet rond het formulier (Mohammed: het blok "gewoon zo"). */}
      {!klaar && a.vertrouwen && a.vertrouwen.length > 0 && (
        <ul className="kgj-reken__vertrouwen">
          {/* 2 nov 2026, Mohammed: "door al die tekst en iconen eronder weet je niet goed dat je moet klikken", "deel aub op zoals bf":
              een klein vinkje per punt zoals bfbouw.be (rk__vinkjes), geen eigen icoon meer dat op een keuze lijkt. */}
          {a.vertrouwen.map((v) => <li key={v}><Check aria-hidden="true" />{v}</li>)}
        </ul>
      )}
      {/* Trustrij zoals op de rekenaarkaart (Google 5,0 + sterren, dan de cijfers). Nooit het aantal reviews.
          5 nov 2026: op het contactscherm staat ze in het formulier (trustInForm). */}
      {!klaar && trustRij}
      {/* 26 okt 2026, Mohammed: privacyregel onder de trustsignalen, zodat die op de laatste stap meteen onder de knop in beeld staan. */}
      {klaar && !laden && <p className="kgj-reken__privacy kgj-reken__privacy--na">Wij gebruiken uw gegevens alleen voor deze aanvraag. <a href="/privacy">Privacybeleid</a></p>}
    </div>
    </Fragment>
  );
}
