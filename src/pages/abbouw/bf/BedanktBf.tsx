/**
 * /bedankt in de stijl van bfbouw.be (BF-tegenhanger /lp/dakwerken/bedankt/, dist/css/site.css .dank*, .kop--lp, .lpvoet).
 *
 * Mohammed, 12 okt 2026: "en doe bedankt pagina bij beide landingspaginas, eenderzijds op totaalrenovatie om een
 * plaatsbezoek in te plannen, en anderzijds bij dakwerken om een dakinspectie in te plannen".
 *
 * Funnel in twee stappen (Mohammed, 12 okt 2026): "funnel is, bedanktpagina, richtprijs, via richtprijs berekenaar bardh,
 * veilige richtprijs ook aub, dan daar makkelijk, deze week, volgende week en nog een optie, en dan gaan ze verder naar
 * verdere pagina waar ze het moment zelf kunnen prikken in de agenda via de calender, want de kans is groot dat als je
 * direct calendar doet dat ze de klus kwijt raken de meeste mensen, en perongeluk niet verder gaan" + "ik laat jou je
 * gang gaan".
 *   Stap 1 = deze pagina: de keuzekaart. GEEN kalender op deze pagina. Eén tik is meteen door, zonder verzendknop.
 *   Stap 2 = /dakinspectie of /afspraak (AfspraakBf.tsx) met ?week=deze|volgende: daar staat de GHL-kalender.
 *
 * Keuzekaart na het CRO-advies dat Mohammed op 13 okt 2026 plakte ("behalve dat review dingetje, dat is al oke hoe je
 * het nu hebt" + "doe basis cro, doe ook zelf dingen om cro te verbeteren voor de cta"):
 *   - "Plan deze week" (hoofdknop, goud met navy tekst zoals elke goudknop van de site) en "Plan volgende week"
 *     (omlijnd in goud), elk met het aantal vrije momenten uit Bardhs agenda in die week (maandag t/m zondag,
 *     Europe/Brussels), hoogstens 4 zoals de teller ("4 gratis inspectieslots beschikbaar"). Een week met 0 vrije
 *     momenten: die knop weg. Faalt de API (of antwoordt hij niet binnen 5 s): knoppen zonder aantal, nooit een getal.
 *     Staat er maar één planknop, dan is die de hoofdknop; staan er geen, dan is "Bel mij terug" de hoofdknop.
 *   - "Later" is weg (nodigt uit tot uitstel); "Bel mij terug" in de plaats. Die tik stuurt NIETS: Bardh krijgt bij
 *     elke aanvraag al een beltaak. De kaart toont dan de zin uit Bedankt.tsx r.77, de belregel en "Toch nu een
 *     moment kiezen" (agenda zonder week).
 *   - Onder de planknoppen de microcopy uit het advies in de u-vorm van de site, en twee vinkpunten: "Gratis en
 *     vrijblijvend" (LP's: kgj/inhoud.ts en inhoud-totaalrenovatie.ts, velden zeker en troeven) en "Volledig
 *     transparante offerte" (dictaat Mohammed 13 okt; /over: "Onze offertes zijn helder en tot in detail
 *     uitgeschreven", inhoud-over.ts r.66).
 *   - "5,0 op Google" blijft zoals het was (geen aantal reviews).
 *   Een tik stuurt NIETS naar GHL of Web3Forms (elke webhook start W01: nieuwe opportunity + sms aan klant en Bardh).
 *   Wel één Clarity-gebeurtenis "bedankt-moment-deze|volgende|bellen", zodat de uitval te meten is (meldClarity: niets
 *   zonder Clarity).
 *
 * Opbouw zoals BF: heldfoto over de volle breedte met donkere laag; links vink + h1 + lede + brugtekst + 3 genummerde
 * stappen; rechts een witte kaart; kop met alleen logo + belknop, geen menu; voet van één regel.
 * Weg tegenover BF (geen bron bij AB): het reviewcitaat met avatar, het seizoens-urgentieblok, elke echte prijs. Alleen
 * het vergrendelde nullen-bedrag uit de rekenaar (Rekenaar.tsx r.305-320) staat hier: de prijs wordt NOOIT onthuld,
 * Bardh bezorgt de richtprijs.
 *
 * Soort, zelfde logica als Bedankt.tsx r.151-152 (die pagina blijft staan als terugval):
 *   ?dienst= / ?service= bevat "dak" -> dakinspectie, anders (totaalrenovatie-LP's, siteformulieren, chat) -> plaatsbezoek;
 *   ?van=rekenaar -> de richtprijs-variant (vergrendeld bedrag: dak vijf cijfers, renovatie zes, zoals de rekenaar).
 * Gedrag gelijk aan Bedankt.tsx r.154-177: titel, robots noindex,nofollow, scrollTo(0,0), meldClarity('aanvraag-verstuurd')
 * behalve bij van=rekenaar, de live teller van vrije inspectiemomenten (dak + rekenaar, komende 7 dagen). CalcPopup
 * blijft weg (SKIP_PATTERNS /bedankt).
 * Gsm: de keuzekaart staat direct onder de h1 (en onder het vergrendelde bedrag), vóór de brugtekst en de stappen.
 *
 * Elke zin heeft een bron (per regel hieronder). Een BF-vak zonder AB-bron is weggelaten: geen brugkop bij het
 * plaatsbezoek, geen vraag boven de keuzes ("Wanneer past een bezoek?" is BF-tekst), geen label boven het bedrag.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { CONTACT } from '@/data/contact';
import { meldClarity } from '@/lib/clarity';
import { bannerWachtOpScroll } from '@/lib/consent';
import { ICOON, NAAM, TEL, TEL_HREF, beeld, grootsteUrl, logoInk } from './schil';
import { bedrag, leesContact, leesVork } from '@/lib/richtprijs';
import { submitLead, type LeadPayload } from '@/lib/leads';
import './bf.css';
import './bf-ab.css';
import './bedankt.css';

/* Vrije momenten: dezelfde GHL-kalender als Afspraak.tsx r.18 ("Plaatsbezoek aan huis"). */
const KALENDER_ID = 'ST3uIpAM7kFEokIm2NM7';

type Dienst = 'dakinspectie' | 'plaatsbezoek';
type Week = 'deze' | 'volgende';

/* De planknoppen: woorden uit het CRO-advies (13 okt). De week gaat als ?week= mee naar de agendapagina. */
const PLAN: { k: Week; t: string }[] = [
  { k: 'deze', t: 'Plan deze week' },
  { k: 'volgende', t: 'Plan volgende week' },
];
/* CRO-advies 13 okt ("Kies direct een dag en tijdstip die jou uitkomen."), in de u-vorm van de site. */
const MICRO = 'Kies direct een dag en tijdstip die u uitkomen.';
/* Vinkpunten: "Gratis en vrijblijvend" staat op de LP's (kgj/inhoud.ts, zeker en troeven), "Volledig transparante offerte" is
   het dictaat van 13 okt ("Volledig transparante offerte als trust bolletje toevoegen"), bron /over inhoud-over.ts r.66. */
const ZEKER = ['Gratis en vrijblijvend', 'Volledig transparante offerte'];

/* Vrije momenten per week. De free-slots-API antwoordt per dag ("2026-10-14": { slots: [...] }) in de gevraagde
   tijdzone, plus metavelden (traceId, podName: dezelfde lijst als de GHL-widget negeert). Een andere sleutel of vorm
   = geen bruikbaar antwoord: dan geen getal (nooit een verzonnen 0). */
const TZ = 'Europe/Brussels';
const META = ['traceId', 'podName'];
const DAG = /^\d{4}-\d{2}-\d{2}$/;
type Vrij = { deze: number; volgende: number; zeven: number };

/** 'JJJJ-MM-DD' van een tijdstip in Brussel */
function dagIn(ms: number) {
  const d = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(ms).map((p) => [p.type, p.value]));
  return `${d.year}-${d.month}-${d.day}`;
}
const plusDagen = (dag: string, n: number) => {
  const [j, m, d] = dag.split('-').map(Number);
  return new Date(Date.UTC(j, m - 1, d + n)).toISOString().slice(0, 10);
};
/** deze week = vandaag t/m zondag, volgende week = maandag t/m zondag daarna (Brussel) */
function weken(nu: number) {
  const vandaag = dagIn(nu);
  const [j, m, d] = vandaag.split('-').map(Number);
  const ma = (new Date(Date.UTC(j, m - 1, d)).getUTCDay() + 6) % 7; // 0 = maandag
  return { vandaag, zondag: plusDagen(vandaag, 6 - ma), volgMa: plusDagen(vandaag, 7 - ma), volgZo: plusDagen(vandaag, 13 - ma) };
}
function telVrij(d: unknown, nu: number): Vrij | null {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
  const w = weken(nu);
  const v: Vrij = { deze: 0, volgende: 0, zeven: 0 };
  for (const [dag, waarde] of Object.entries(d as Record<string, unknown>)) {
    if (META.includes(dag)) continue;
    const slots = (waarde as { slots?: unknown } | null)?.slots;
    if (!DAG.test(dag) || !Array.isArray(slots)) return null;
    if (dag >= w.vandaag && dag <= w.zondag) v.deze += slots.length;
    else if (dag >= w.volgMa && dag <= w.volgZo) v.volgende += slots.length;
    /* teller na de dak-rekenaar: zoals Bedankt.tsx r.165-177, de komende 7 dagen */
    v.zeven += slots.filter((s) => { const t = Date.parse(String(s)); return t >= nu && t <= nu + 7 * 864e5; }).length;
  }
  return v;
}
const momenten = (n: number) => (n === 1 ? 'nog 1 vrij moment' : `nog ${n} vrije momenten`);

type Tekst = {
  /** '' = geen bron, vak weg */
  brugKop: string;
  brug: string;
  stappen: string[];
  kaartKop: string;
  /** stap 2: de agendapagina (App.tsx: /dakinspectie en /afspraak -> AfspraakBf) */
  agenda: '/dakinspectie' | '/afspraak';
  /** vergrendeld bedrag van de rekenaar: Rekenaar.tsx r.317 (dak vijf cijfers, renovatie zes) */
  nullen: string;
  foto: { naam: string; pos?: string };
};

const TEKST: Record<Dienst, Tekst> = {
  dakinspectie: {
    /* Dictaat Mohammed 4 okt (Bedankt.tsx r.41-46 en r.58): "Elk dak is uniek. Om een definitieve prijs op te stellen,
       komt onze dakexpert graag de exacte staat van het dak opmeten." Zelfde woorden, in kop en tekst gesplitst zoals BF. */
    brugKop: 'Elk dak is uniek',
    brug: 'Om een definitieve prijs op te stellen, komt onze dakexpert graag de exacte staat van het dak opmeten.',
    /* Stappen van de dak-LP: kgj/inhoud.ts r.431-435 (cta.punten "Gratis dakinspectie"), ook het commentaar in
       Afspraak.tsx r.27-28 en de BF-stappen. */
    stappen: ['We bekijken uw dak ter plaatse', 'Samen overlopen we de bevindingen', 'U ontvangt een vrijblijvende offerte'],
    kaartKop: 'Plan uw gratis dakinspectie', // dictaat 4 okt (Bedankt.tsx r.59), ook Afspraak.tsx r.37
    agenda: '/dakinspectie',
    nullen: '00.000 – 00.000',
    // dakfoto: FOTOPLAN.divisie.dakwerken.kop (fotoplan.ts), vernieuwd pannendak van AB
    foto: { naam: 'dak-na' },
  },
  plaatsbezoek: {
    brugKop: '', // geen AB-bron voor een kop zoals "Elk dak is uniek": vak weg
    brug: 'Onze projectleider komt langs, meet op en bespreekt uw plannen ter plaatse.', // Afspraak.tsx r.33
    /* Stappen van de totaalrenovatie-LP: kgj/inhoud-totaalrenovatie-oud.ts r.306-310 (cta.punten "Gratis plaatsbezoek"),
       ook copy-totaalrenovatie.txt r.49-51. */
    stappen: ['We bekijken uw woning ter plaatse', 'Samen overlopen we uw wensen', 'U ontvangt een vrijblijvende offerte'],
    kaartKop: 'Plan uw plaatsbezoek', // Afspraak.tsx r.32
    agenda: '/afspraak',
    nullen: '000.000 – 000.000',
    // renovatiefoto: eerste dia van de homehero (inhoud.ts r.61, dictaat 11 okt "die mooie keuken foto")
    foto: { naam: 'totaalrenovatie-p5-a', pos: '50% 60%' },
  },
};

/* h1 en lede. Gewone aanvraag: Bedankt.tsx r.76-77 (bron: de bevestigings-sms van GHL W01b, "zo snel mogelijk" zonder
   termijn). Na de rekenaar: dictaat Mohammed 4 okt (Bedankt.tsx r.54-55), "Uw prijsaanvraag is ontvangen" en "We sturen
   u zo snel mogelijk een vrijblijvende richtprijs."; die tweede zin staat onder het vergrendelde bedrag. */
const KOP_GEWOON = 'Bedankt, uw aanvraag is binnen';
const LEDE_GEWOON = 'Wij bekijken uw aanvraag en nemen zo snel mogelijk contact met u op.';
const KOP_REKENAAR = 'Uw prijsaanvraag is ontvangen';
const LEDE_REKENAAR = 'We sturen u zo snel mogelijk een vrijblijvende richtprijs.';
/* 14 okt (Mohammed: "zoals bf"): toont de rekenaar een richtprijs (src/lib/richtprijs.ts), dan staat die hier groot, met de
   woorden van de BF-bedankpagina (dictaat Mohammed 11 okt: "Bedankt! Uw aanvraag is verwerkt.", "Richtindicatie voor uw dak",
   "Asbestverwijdering inbegrepen"). De BF-zin "ook onderweg naar uw mailbox" staat er niet: AB mailt de prijs niet (niet bevestigd). */
const KOP_PRIJS = 'Bedankt! Uw aanvraag is verwerkt.';
const PRIJS_LABEL: Record<Dienst, string> = { dakinspectie: 'Richtindicatie voor uw dak', plaatsbezoek: 'Richtindicatie voor uw renovatie' };

/** Inline SVG uit ICOON (schil.ts) */
const Ic = ({ svg, className }: { svg: string; className?: string }) => (
  <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
);

export default function BedanktBf() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ruw = (params.get('dienst') || params.get('service') || '').toLowerCase();
  const dienst: Dienst = ruw.includes('dak') ? 'dakinspectie' : 'plaatsbezoek';
  const rekenaar = params.get('van') === 'rekenaar';
  const t = TEKST[dienst];
  const soort = rekenaar ? (dienst === 'dakinspectie' ? 'richtprijs-dak' : 'richtprijs-plaatsbezoek') : dienst;

  const [vork] = useState(() => (rekenaar ? leesVork() : null));
  /* 14 okt: de rekenaar vraagt geen telefoon meer. "Bel mij terug" vraagt dan hier het nummer en stuurt het als aanvulling
     (zelfde e-mail en bron + ":terugbellen", zonder tweede conversie). Zonder bewaard contact: zoals vroeger (stuurt niets). */
  const [contact] = useState(() => (rekenaar ? leesContact() : null));
  const [vraagNummer, setVraagNummer] = useState(false);
  const [telFout, setTelFout] = useState<string | null>(null);
  const [telBezig, setTelBezig] = useState(false);
  const [gescrold, setGescrold] = useState(false);
  const [bellen, setBellen] = useState(false);
  /* null = laden of mislukt: knoppen zonder aantal */
  const [vrij, setVrij] = useState<Vrij | null>(null);
  const bellenRef = useRef<HTMLDivElement>(null);

  /* Zelfde als Bedankt.tsx r.154-163. */
  useEffect(() => {
    document.title = 'Bedankt voor uw aanvraag · AB Bouw Groep';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    window.scrollTo(0, 0);
    /* Clarity: de aanvraag via de chat of de dakinspectie als gebeurtenis in de opname. De
       rekenaar meldt die zelf bij het versturen (van=rekenaar). Zonder Clarity: niets.
       Eén melding per aanvraag: in de SPA-funnel blijft Clarity geladen, en met de terug-knop van de agendapagina
       monteert deze pagina opnieuw (keuring 12 okt: 12 van 12 keer een tweede 'aanvraag-verstuurd'; het oude
       Bedankt.tsx ging met een gewone link weg en meldde 0 keer extra). De vlag staat op de eigen geschiedenisregel:
       een nieuwe navigatie naar /bedankt is een nieuwe regel zonder vlag en meldt wel. */
    if (params.get('van') !== 'rekenaar') {
      let gemeld = false;
      try { gemeld = Boolean((window.history.state as { abBedanktGemeld?: boolean } | null)?.abBedanktGemeld); } catch { /* niets */ }
      if (!gemeld) {
        meldClarity('aanvraag-verstuurd');
        try { window.history.replaceState({ ...(window.history.state || {}), abBedanktGemeld: true }, ''); } catch { /* niets */ }
      }
    }
    // eenmalig bij het openen, zoals Bedankt.tsx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Cookiebanner: op deze pagina pas na een scroll voorbij 90 % van het scherm, ook als de bezoeker via de SPA
     binnenkomt terwijl hij openstond (op 390 lag hij over "Volgende week" en "Later", gemeten 12 okt). */
  useEffect(() => bannerWachtOpScroll(), []);

  /* Kop: transparant over de foto, wit zodra er 24 px gescrold is (gedrag.ts punt 1, BF site.js r.7-8). */
  useEffect(() => {
    const schakel = () => setGescrold(window.scrollY > 24);
    schakel();
    window.addEventListener('scroll', schakel, { passive: true });
    return () => window.removeEventListener('scroll', schakel);
  }, []);

  /* Vrije momenten uit Bardhs agenda, één vraag voor alles: deze week en volgende week (planknoppen, elke variant) en
     de komende 7 dagen (teller na de dak-rekenaar, Bedankt.tsx r.165-177: Mohammed "4 gratis inspectieslots
     beschikbaar"). Alles hoogstens 4. 15 dagen vooruit dekt volgende week altijd (op maandag: t/m dag 13). Geen
     antwoord binnen 5 s, een foutcode of een onbekende vorm: vrij blijft null, de knoppen staan er zonder aantal. */
  useEffect(() => {
    let weg = false;
    const ctl = new AbortController();
    const klok = window.setTimeout(() => ctl.abort(), 5000);
    const nu = Date.now();
    const url = `https://backend.leadconnectorhq.com/calendars/${KALENDER_ID}/free-slots?startDate=${nu}&endDate=${nu + 15 * 864e5}&timezone=Europe%2FBrussels`;
    fetch(url, { signal: ctl.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d: unknown) => { if (!weg) setVrij(telVrij(d, nu)); })
      .catch(() => {})
      .finally(() => window.clearTimeout(klok));
    return () => { weg = true; ctl.abort(); window.clearTimeout(klok); };
  }, []);

  /* Na "Bel mij terug" verdwijnen de knoppen: de focus gaat naar de melding, niet terug naar het begin van de pagina. */
  useEffect(() => { if (bellen) bellenRef.current?.focus(); }, [bellen]);

  const plan = (k: Week) => {
    meldClarity('bedankt-moment-' + k);
    navigate(`${t.agenda}?week=${k}`);
  };
  const belMij = () => {
    if (contact) { setVraagNummer(true); return; }
    meldClarity('bedankt-moment-bellen');
    setBellen(true);
  };
  const stuurNummer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (telBezig || !contact) return;
    const tel = String(new FormData(e.currentTarget).get('telefoon') || '').trim();
    /* zelfde drempel als de lead-pijplijn: acht cijfers */
    if (tel.replace(/\D/g, '').length < 8) { setTelFout('Dat telefoonnummer lijkt niet volledig. Controleer het even.'); return; }
    setTelFout(null);
    setTelBezig(true);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: contact.divisie as LeadPayload['landing_division'],
      firstName: contact.naam,
      email: contact.email,
      phone: tel,
      type_werk: contact.divisie as LeadPayload['type_werk'],
      aanvullende_info: 'Wil teruggebeld worden (na de rekenaar)',
      bron_lead: `${contact.bron}:terugbellen`,
      zonderConversie: true,
    });
    setTelBezig(false);
    if (!res.ok) { setTelFout('Versturen lukte niet. Bel gerust ' + TEL + '.'); return; }
    meldClarity('bedankt-moment-bellen');
    setBellen(true);
  };
  /* Een week met 0 vrije momenten valt weg; zonder bruikbaar antwoord blijven beide knoppen, zonder aantal. */
  const knoppen = PLAN.filter(({ k }) => !vrij || vrij[k] > 0);
  const teller = soort === 'richtprijs-dak' && vrij ? Math.min(4, vrij.zeven) : 0;

  return (
    <div className="bf bf-dankpagina" data-soort={soort}>
      <a className="bf-overslaan" href="#bf-inhoud">Naar de inhoud</a>
      <header className={`bf-kop bf-kop--over bf-dankkop${gescrold ? ' bf-is-gescrold' : ''}`}>
        <nav className="bf-nav" aria-label={NAAM}>
          <a className="bf-nav__logo" href="/" aria-label={`${NAAM}, naar de startpagina`}>
            <img className="bf-nav__logo-wit" src={grootsteUrl('logo-wit')} width={440} height={125} alt="" decoding="async" />
            <img className="bf-nav__logo-ink" src={logoInk()} width={440} height={125} alt="" decoding="async" />
          </a>
          <div className="bf-nav__acties">
            <a className="bf-knop bf-dankbel" href={TEL_HREF} aria-label={`Bel ${NAAM} op ${TEL}`}>
              <Ic svg={ICOON.tel} />
              <span className="bf-dankbel__lang">Bel {TEL}</span>
              <span className="bf-dankbel__kort">Bel direct</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="bf-inhoud">
        <section className="bf-dank">
          <div className="bf-dank__beeld" dangerouslySetInnerHTML={{ __html: beeld(t.foto.naam, { alt: '', sizes: '100vw', lazy: false, prio: true, pos: t.foto.pos }) }} />
          <div className="bf-dank__laag" aria-hidden="true" />
          <div className="bf-dank__in">
            <div className="bf-dank__tekst">
              <div className="bf-dank__status">
                <Ic svg={ICOON.vink} className="bf-dank__vink" />
                <h1 className="bf-dank__kop">{vork ? KOP_PRIJS : rekenaar ? KOP_REKENAAR : KOP_GEWOON}</h1>
              </div>

              {vork ? (
                /* De richtprijs uit de rekenaar, incl. btw (zelfde rekenregel als bfbouw.be). */
                <div className="bf-dank__prijs bf-dank__prijs--echt">
                  <p className="bf-dank__prijslabel">{PRIJS_LABEL[dienst]}</p>
                  <p className="bf-dank__echt">
                    <span className="bf-dank__echt-bedrag"><span>€&nbsp;{bedrag(vork.min)} –</span> <span>€&nbsp;{bedrag(vork.max)}</span></span>
                    <span className="bf-dank__echt-btw">incl. btw</span>
                  </p>
                  {vork.asbest && <p className="bf-dank__prijszin">Asbestverwijdering inbegrepen</p>}
                </div>
              ) : rekenaar ? (
                /* De veilige richtprijs: het vergrendelde bedrag uit de laatste stap van de rekenaar (Rekenaar.tsx r.305-320,
                   Mohammed 28 sept), alleen nullen, vervaagd, met hetzelfde slot (lucide Lock). Daaronder de zin uit het dictaat. */
                <div className="bf-dank__prijs">
                  <div className="bf-dank__richt" aria-hidden="true">
                    <span className="bf-dank__richt-bedrag">
                      <span className="bf-dank__richt-euro">€</span>
                      <span className="bf-dank__richt-cijfers">{t.nullen}</span>
                    </span>
                    <span className="bf-dank__slot"><Lock /></span>
                  </div>
                  <p className="bf-dank__prijszin">{LEDE_REKENAAR}</p>
                </div>
              ) : (
                <p className="bf-dank__lede">{LEDE_GEWOON}</p>
              )}

              <div className={`bf-dank__brug${t.brugKop ? '' : ' bf-dank__brug--los'}`}>
                {t.brugKop && <h2>{t.brugKop}</h2>}
                <p>{t.brug}</p>
              </div>
              <ol className="bf-dank__stappen">
                {t.stappen.map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}
              </ol>
            </div>

            <div className="bf-dank__kaart" id="plannen">
              <span className="bf-dank__gratis">Gratis</span>
              <h2 className="bf-dank__kaartkop" id="bf-dank-kaartkop">{t.kaartKop}</h2>
              {teller > 0 && (
                <p className="bf-dank__slots">{teller === 1 ? '1 gratis inspectieslot beschikbaar' : `${teller} gratis inspectieslots beschikbaar`}</p>
              )}
              {bellen ? (
                /* "Bel mij terug": de zin uit Bedankt.tsx r.77 (bron: de bevestigings-sms van GHL W01b); de belregel staat
                   onderaan de kaart. Er gaat niets naar GHL: Bardh heeft voor deze aanvraag al een beltaak. */
                <div className="bf-dank__bellen" ref={bellenRef} tabIndex={-1} role="status">
                  <Ic svg={ICOON.vink} className="bf-dank__vink" />
                  {/* Zonder rekenaar staat LEDE_GEWOON al onder de h1: dan geen tweede keer dezelfde zin in één scherm
                      (keuring 13 okt), wel een korte bevestiging van de knop. Bardh belt elke aanvraag (beltaak W01). */}
                  <p>{rekenaar && !contact ? LEDE_GEWOON : 'Genoteerd: wij bellen u zo snel mogelijk terug.'}</p>
                  <Link className="bf-dank__toch" to={t.agenda}>Toch nu een moment kiezen</Link>
                </div>
              ) : vraagNummer ? (
                /* Bel mij terug na de rekenaar: één veld, het nummer gaat als aanvulling naar GHL (zie stuurNummer). */
                <form className="bf-dank__nummer" onSubmit={stuurNummer} noValidate>
                  <label>Op welk nummer mogen we u bellen? *
                    <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder="04xx xx xx xx" aria-required="true" />
                  </label>
                  <button type="submit" className="bf-dank__terug bf-dank__terug--hoofd" disabled={telBezig}>
                    <Ic svg={ICOON.tel} className="bf-dank__terug-ic" />{telBezig ? 'Bezig…' : 'Bel mij terug'}
                  </button>
                  {telFout && <p className="bf-dank__fout" role="alert">{telFout}</p>}
                  <button type="button" className="bf-dank__toch" onClick={() => setVraagNummer(false)}>Toch liever een moment kiezen</button>
                </form>
              ) : (
                <>
                  {knoppen.length > 0 && (
                    <div className="bf-dank__plan" role="group" aria-labelledby="bf-dank-kaartkop">
                      {knoppen.map(({ k, t: label }, i) => (
                        <button type="button" key={k} className={`bf-dank__planknop bf-dank__planknop--${i === 0 ? 'hoofd' : 'twee'}`} data-keuze={k} onClick={() => plan(k)}>
                          <Ic svg={ICOON.planning} className="bf-dank__plan-ic" />
                          <span className="bf-dank__plan-tekst">
                            <span className="bf-dank__plan-label">{label}</span>
                            {vrij && <span className="bf-dank__plan-aantal">{momenten(Math.min(4, vrij[k]))}</span>}
                          </span>
                          <Ic svg={ICOON.chevR} className="bf-dank__plan-pijl" />
                        </button>
                      ))}
                    </div>
                  )}
                  {knoppen.length > 0 && <p className="bf-dank__micro">{MICRO}</p>}
                  <ul className="bf-dank__zeker">
                    {ZEKER.map((z) => <li key={z}><Ic svg={ICOON.vink} className="bf-dank__zeker-vink" />{z}</li>)}
                  </ul>
                  <button type="button" className={`bf-dank__terug${knoppen.length === 0 ? ' bf-dank__terug--hoofd' : ''}`} data-keuze="bellen" onClick={belMij}>
                    <Ic svg={ICOON.tel} className="bf-dank__terug-ic" />Bel mij terug
                  </button>
                </>
              )}
              <p className="bf-dank__google">
                <Ic svg={ICOON.ster.repeat(5)} className="bf-dank__sterren" />
                <b>5,0 op Google</b>
              </p>
              {/* Afspraak.tsx r.55-56: "Liever telefonisch? Bel ons op" + het nummer uit CONTACT */}
              <a className="bf-dank__belknop" href={TEL_HREF}>
                <Ic svg={ICOON.tel} className="bf-dank__belic" />Liever telefonisch? Bel ons op <b>{TEL}</b>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bf-dankvoet">
        <div className="bf-dankvoet__in">
          <p>© {new Date().getFullYear()} {NAAM} · BTW {CONTACT.btw.display} · {CONTACT.address.street}, <span className="bf-dankvoet__plaats">{CONTACT.address.postcode} {CONTACT.address.city}</span></p>
          <nav aria-label="Juridisch"><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/voorwaarden">Voorwaarden</a></nav>
        </div>
      </footer>
    </div>
  );
}
