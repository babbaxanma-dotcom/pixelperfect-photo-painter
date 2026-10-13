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
 *   Stap 1 = deze pagina: drie keuzes ("Deze week", "Volgende week", "Later", de woorden van BF dank__momenten). Eén tik
 *     is meteen door, zonder verzendknop. GEEN kalender op deze pagina.
 *   Stap 2 = /dakinspectie of /afspraak (AfspraakBf.tsx) met ?week=deze|volgende: daar staat de GHL-kalender.
 *   "Later" = geen kalender: de kaart toont een vink en een link naar de agenda zonder week; na de rekenaar ook de zin
 *     uit Bedankt.tsx r.77 (bij de gewone aanvraag staat die zin al als lede onder de h1).
 *   Een tik stuurt NIETS naar GHL of Web3Forms (elke webhook start W01: nieuwe opportunity + sms aan klant en Bardh).
 *   Wel één Clarity-gebeurtenis "bedankt-moment-<keuze>", zodat de uitval te meten is (meldClarity: niets zonder Clarity).
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
 * behalve bij van=rekenaar, de live teller van vrije inspectiemomenten (dak + rekenaar). CalcPopup blijft weg
 * (SKIP_PATTERNS /bedankt).
 *
 * Elke zin heeft een bron (per regel hieronder). Een BF-vak zonder AB-bron is weggelaten: geen brugkop bij het
 * plaatsbezoek, geen vraag boven de drie keuzes ("Wanneer past een bezoek?" is BF-tekst), geen label boven het bedrag.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { CONTACT } from '@/data/contact';
import { meldClarity } from '@/lib/clarity';
import { bannerWachtOpScroll } from '@/lib/consent';
import { ICOON, NAAM, TEL, TEL_HREF, beeld, grootsteUrl, logoInk } from './schil';
import './bf.css';
import './bf-ab.css';
import './bedankt.css';

/* Vrije momenten: dezelfde GHL-kalender als Afspraak.tsx r.18 ("Plaatsbezoek aan huis"). */
const KALENDER_ID = 'ST3uIpAM7kFEokIm2NM7';

type Dienst = 'dakinspectie' | 'plaatsbezoek';
type Keuze = 'deze-week' | 'volgende-week' | 'later';

/* De drie keuzes: de woorden van BF dank__momenten (bfbouw-website dist/lp/dakwerken/bedankt). */
const KEUZES: { k: Keuze; t: string }[] = [
  { k: 'deze-week', t: 'Deze week' },
  { k: 'volgende-week', t: 'Volgende week' },
  { k: 'later', t: 'Later' },
];

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

  const [gescrold, setGescrold] = useState(false);
  const [later, setLater] = useState(false);
  const [slots, setSlots] = useState(0);
  const laterRef = useRef<HTMLDivElement>(null);

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

  /* Aantal vrije inspectiemomenten, alleen na de dak-rekenaar: Bedankt.tsx r.165-177 (Mohammed "4 gratis
     inspectieslots beschikbaar"; live uit Bardhs agenda, de komende 7 dagen, hoogstens 4; 0 = geen regel). */
  useEffect(() => {
    if (soort !== 'richtprijs-dak') return;
    let weg = false;
    const nu = Date.now();
    const url = `https://backend.leadconnectorhq.com/calendars/${KALENDER_ID}/free-slots?startDate=${nu}&endDate=${nu + 7 * 864e5}&timezone=Europe%2FBrussels`;
    fetch(url).then((r) => r.json()).then((d: Record<string, { slots?: string[] }>) => {
      if (weg) return;
      const vrij = Object.values(d || {}).reduce((n, dag) => n + (Array.isArray(dag?.slots) ? dag.slots.length : 0), 0);
      setSlots(Math.min(4, vrij));
    }).catch(() => {});
    return () => { weg = true; };
  }, [soort]);

  /* Na "Later" verdwijnen de knoppen: de focus gaat naar de melding, niet terug naar het begin van de pagina. */
  useEffect(() => { if (later) laterRef.current?.focus(); }, [later]);

  const kies = (k: Keuze) => {
    meldClarity('bedankt-moment-' + k);
    if (k === 'later') { setLater(true); return; }
    navigate(`${t.agenda}?week=${k === 'deze-week' ? 'deze' : 'volgende'}`);
  };

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
                <h1 className="bf-dank__kop">{rekenaar ? KOP_REKENAAR : KOP_GEWOON}</h1>
              </div>

              {rekenaar ? (
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
              {soort === 'richtprijs-dak' && slots > 0 && (
                <p className="bf-dank__slots">{slots === 1 ? '1 gratis inspectieslot beschikbaar' : `${slots} gratis inspectieslots beschikbaar`}</p>
              )}
              {later ? (
                /* De zin uit Bedankt.tsx r.77 alleen na de rekenaar: bij de gewone aanvraag staat hij al als lede onder de
                   h1, en stond hij na "Later" 2 keer in hetzelfde scherm (keuring 12 okt, 3 van 5 varianten). */
                <div className={`bf-dank__later${rekenaar ? '' : ' bf-dank__later--kort'}`} ref={laterRef} tabIndex={-1} role="status">
                  <Ic svg={ICOON.vink} className="bf-dank__vink" />
                  {rekenaar && <p>{LEDE_GEWOON}</p>}
                  <Link className="bf-dank__toch" to={t.agenda}>Toch nu een moment kiezen</Link>
                </div>
              ) : (
                <div className="bf-dank__keuzes" role="group" aria-labelledby="bf-dank-kaartkop">
                  {KEUZES.map(({ k, t: label }) => (
                    <button type="button" key={k} className="bf-dank__keuze" data-keuze={k} onClick={() => kies(k)}>
                      <span>{label}</span>
                      <Ic svg={ICOON.chevR} className="bf-dank__keuze-pijl" />
                    </button>
                  ))}
                </div>
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
