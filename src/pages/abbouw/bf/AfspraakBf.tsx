/**
 * /afspraak en /dakinspectie in de stijl van bfbouw.be: stap 2 van de funnel (stap 1 = /bedankt, BedanktBf.tsx).
 *
 * Mohammed, 12 okt 2026: "... en dan gaan ze verder naar verdere pagina waar ze het moment zelf kunnen prikken in de
 * agenda via de calender" + "ik laat jou je gang gaan".
 *
 * Compacte formpagina (ijk abgroep.be/afspraak): logo, kop, één zin, kalender, belregel. Geen menu, geen voet.
 * Afspraak.tsx blijft staan als terugval (App.tsx: de routes /afspraak en /dakinspectie terugzetten).
 *
 * Wat gelijk blijft aan Afspraak.tsx:
 *   - de GHL-kalender "Plaatsbezoek aan huis" als iframe, zelfde id, url (?lang=nl), title, scrolling en loading
 *     (r.18-22, r.52-53), zodat een boeking dezelfde workflows start (W05, W05c);
 *   - form_embed.js voor de hoogte van de iframe (r.83-90), opgeruimd bij het verlaten;
 *   - document.title, robots noindex,nofollow en scrollTo(0,0) (r.76-81);
 *   - kop en lede per soort (TEKST r.30-41) en de belregel "Liever telefonisch? Bel ons op" (r.55-56).
 * De klant-sms'en uit het CRM linken naar deze adressen ZONDER parameter: zonder ?week werkt de pagina precies zoals
 * Afspraak.tsx. Nieuw is alleen de regel "U koos: deze week." / "U koos volgende week: tik in de agenda op een dag in
 * de week van <maandag>." wanneer de bezoeker op de bedankpagina een week koos (?week=deze|volgende).
 */
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bannerWachtOpScroll } from '@/lib/consent';
import { ICOON, NAAM, TEL, TEL_HREF, logoInk } from './schil';
import './bf.css';
import './bf-ab.css';
import './afspraak.css';

/* Afspraak.tsx r.18-22: zelfde kalender, zelfde url. Wijzigt de kalender, dan daar en hier samen. */
const KALENDER_ID = 'ST3uIpAM7kFEokIm2NM7';
const KALENDER_URL = `https://api.leadconnectorhq.com/widget/booking/${KALENDER_ID}?lang=nl`;

export type AfspraakSoort = 'plaatsbezoek' | 'dakinspectie';
/* Afspraak.tsx r.30-41, woordelijk. Teksten komen van de LP: "Plan uw dakinspectie", "We bekijken uw dak ter plaatse",
   "Samen overlopen we de bevindingen". */
const TEKST: Record<AfspraakSoort, { kop: string; lede: string; titel: string }> = {
  plaatsbezoek: {
    kop: 'Plan uw plaatsbezoek',
    lede: 'Kies een dag en een uur. Onze projectleider komt langs, meet op en bespreekt uw plannen ter plaatse.',
    titel: 'Plaatsbezoek plannen · AB Bouw Groep',
  },
  dakinspectie: {
    kop: 'Plan uw gratis dakinspectie',
    lede: 'Kies een dag en een uur. Wij bekijken uw dak ter plaatse en overlopen de bevindingen met u.',
    titel: 'Dakinspectie plannen · AB Bouw Groep',
  },
};

/* De keuze van de bedankpagina (BedanktBf.tsx: "Plan deze week" / "Plan volgende week"). Andere waarden: geen regel.
   De GHL-widget heeft geen parameter voor de startdatum (13 okt gemeten: de widgetcode zet calendarStartingDate op
   vandaag en leest geen datum uit de url; date, startDate, start_date, selectedDate, appointmentDate, day en een
   startDate in ms gaven alle 7 dezelfde dag) en hij selecteert zelf de eerste vrije dag. Deze week: die dag ligt in
   deze week (de bedankpagina toont "Plan deze week" alleen met vrije momenten deze week). Volgende week: de regel
   zegt welke dag de bezoeker zelf aantikt. De widget is een MAANDkalender (de pijl gaat naar de volgende maand), dus
   de regel noemt de week bij naam ("de week van 19 oktober"), niet de pijl. */
function weekVanVolgende(nu = Date.now()) {
  const d = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Brussels', year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(nu).map((p) => [p.type, Number(p.value)]));
  const ma = (new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay() + 6) % 7; // 0 = maandag
  const maandag = Date.UTC(d.year, d.month - 1, d.day + 7 - ma);
  return new Intl.DateTimeFormat('nl-BE', { timeZone: 'UTC', day: 'numeric', month: 'long' }).format(maandag);
}
const weekRegel = (w: string) => {
  if (w === 'deze') return 'U koos: deze week.';
  if (w === 'volgende') return `U koos volgende week: tik in de agenda op een dag in de week van ${weekVanVolgende()}.`;
  return '';
};

/* Berichten van een GHL-kalender die al van de pagina weg is, gaan niet meer naar form_embed.js. In de funnel gaat de
   bezoeker met de terug-knop via de SPA naar /bedankt; gebeurt dat terwijl de widget nog laadt, dan zoekt form_embed.js
   de verdwenen iframe op en gooit "iFrame (...) does not exist" en "reading 'contentWindow'" (gemeten 13 okt met koude
   cache: 15 fouten in 8 rondes). Alleen berichten van leadconnectorhq/msgsvc waarvan de afzender geen iframe meer op de
   pagina heeft; een kalender die er staat (ook die van /status) krijgt alles. Eén keer per sessie, vóór form_embed.js. */
let ghlBewaakt = false;
function bewaakGhlBerichten() {
  if (ghlBewaakt || typeof window === 'undefined') return;
  ghlBewaakt = true;
  window.addEventListener('message', (e) => {
    let host = '';
    try { host = new URL(e.origin).hostname; } catch { return; }
    if (!/(^|\.)(leadconnectorhq|msgsvc)\.com$/.test(host)) return;
    const levend = Array.from(document.querySelectorAll('iframe')).some((f) => f.contentWindow === e.source);
    if (!levend) e.stopImmediatePropagation();
  }, true);
}

const Ic = ({ svg, className }: { svg: string; className?: string }) => (
  <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
);

export default function AfspraakBf({ soort = 'plaatsbezoek' }: { soort?: AfspraakSoort }) {
  const t = TEKST[soort];
  const [params] = useSearchParams();
  const week = weekRegel((params.get('week') || '').toLowerCase());

  useEffect(() => {
    document.title = t.titel;
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    window.scrollTo(0, 0);

    /* Het GHL-script past de hoogte van de iframe aan de kalender aan. */
    bewaakGhlBerichten();
    const s = document.createElement('script');
    /* link.msgsvc.com (het adres uit oudere GHL-embedcode) antwoordt niet meer. */
    s.src = 'https://api.leadconnectorhq.com/js/form_embed.js';
    s.async = true;
    document.body.appendChild(s);

    return () => { s.remove(); };
  }, [t]);

  /* Cookiebanner: hier pas na een scroll voorbij 90 % van het scherm (consent.ts), ook als de bezoeker via de SPA
     binnenkomt terwijl hij openstond. Op 390 lag hij over het datumraster (gemeten 12 okt). */
  useEffect(() => bannerWachtOpScroll(), []);

  return (
    <div className="bf bf-afspraakpagina" data-soort={soort}>
      <a className="bf-overslaan" href="#bf-inhoud">Naar de inhoud</a>
      <header className="bf-afs__kop">
        <a className="bf-afs__logo" href="/" aria-label={`${NAAM}, naar de startpagina`}>
          <img src={logoInk()} width={440} height={125} alt="" decoding="async" />
        </a>
      </header>
      <main id="bf-inhoud" className="bf-afs">
        <h1 className="bf-afs__titel">{t.kop}</h1>
        {/* lede + weekregel: op desktop op één regel (afspraak.css), zodat het datumraster hoger in beeld komt */}
        <div className="bf-afs__intro">
          <p className="bf-afs__lede">{t.lede}</p>
          {week && <p className={`bf-afs__week${week.length > 30 ? " bf-afs__week--lang" : ""}`}><Ic svg={ICOON.planning} className="bf-afs__week-ic" /><span>{week}</span></p>}
        </div>
        <div className="bf-afs__kalender">
          <iframe src={KALENDER_URL} id={`${KALENDER_ID}_afspraak`} title="Kalender plaatsbezoek AB Bouw Groep"
            scrolling="no" loading="eager" />
        </div>
        <p className="bf-afs__onder">Liever telefonisch? Bel ons op{' '}
          <a href={TEL_HREF}><Ic svg={ICOON.tel} className="bf-afs__tel-ic" />{TEL}</a></p>
      </main>
    </div>
  );
}
