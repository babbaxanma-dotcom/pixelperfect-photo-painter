import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, LOGO } from './_rp';

/**
 * Afspraakpagina voor het plaatsbezoek: abgroep.be/afspraak.
 *
 * De klant-sms'en uit het CRM (GHL) linken hierheen in plaats van naar de
 * kale boekingslink van GHL. Die link toonde "api.leadconnectorhq.com" in de
 * sms en opende een losse pagina buiten de huisstijl. De kalender zelf blijft
 * de GHL-kalender "Plaatsbezoek aan huis", ingebed als iframe, zodat een
 * boeking dezelfde workflows start (W05, W05c).
 *
 * Niet in de sitemap en noindex: de pagina is alleen bedoeld voor wie de link
 * uit een sms krijgt.
 */
const KALENDER_ID = 'ST3uIpAM7kFEokIm2NM7';
/* De kalender staat in GHL op de Neo-widget, taal Nederlands, 24 uur, week
   vanaf maandag (Kalenders > Voorkeuren, 28 sept). lang=nl is een queryparameter
   van de widget zelf en houdt hem Nederlands, ook als die voorkeur ooit wijzigt. */
const KALENDER_URL = `https://api.leadconnectorhq.com/widget/booking/${KALENDER_ID}?lang=nl`;

/* Eén pagina, twee adressen. /afspraak is het plaatsbezoek (algemene sms K1,
   K4, K7, K8), /dakinspectie de gratis dakinspectie van de dak-LP (eigen
   bevestigings-sms). Beide boeken in dezelfde GHL-kalender, zodat dezelfde
   workflows (W05, W05c) lopen. Teksten komen van de LP: "Plan uw dakinspectie",
   "We bekijken uw dak ter plaatse", "Samen overlopen we de bevindingen". */
export type AfspraakSoort = 'plaatsbezoek' | 'dakinspectie';
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

const HTML = (t: (typeof TEKST)[AfspraakSoort]) => `<div class="rp rp-afs">
<header class="rp-afs__kop">
  <a href="/" aria-label="AB Bouw Groep"><img src="${LOGO}" alt="AB Bouw Groep" width="150" /></a>
</header>

<main class="rp-afs__main">
  <h1 class="rp-afs__t">${t.kop}</h1>
  <p class="rp-afs__lede">${t.lede}</p>
  <div class="rp-afspraak">
    <iframe src="${KALENDER_URL}" id="${KALENDER_ID}_afspraak" title="Kalender plaatsbezoek AB Bouw Groep"
      scrolling="no" loading="eager"></iframe>
  </div>
  <p class="rp-afspraak__onder">Liever telefonisch? Bel ons op
    <a href="${CONTACT.phone.href}">${ic.phone(15)} ${CONTACT.phone.display}</a></p>
</main>
</div>`;

const STIJL = `
.rp-afs { min-height: 100vh; background: var(--rp-bg-soft); }
.rp-afs__kop { display: flex; justify-content: center; padding: 28px 16px 8px; }
.rp-afs__kop img { display: block; height: auto; }
.rp-afs__main { max-width: 880px; margin: 0 auto; padding: 24px 16px 56px; text-align: center; }
.rp-afs__t { font-size: clamp(30px, 5vw, 46px); line-height: 1.1; margin: 0; }
.rp-afs__lede { max-width: 560px; margin: 14px auto 32px; font-size: 17px; line-height: 1.55; }
.rp-afspraak { background: #fff; border: 1px solid var(--rp-line-soft); border-radius: 14px; overflow: hidden; text-align: left; }
.rp-afspraak iframe { display: block; width: 100%; min-height: 560px; border: 0; }
.rp-afspraak__onder { margin: 22px 0 0; }
.rp-afspraak__onder a { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: inherit; white-space: nowrap; }
@media (max-width: 640px) { .rp-afs__kop img { width: 120px; } .rp-afspraak { border-radius: 10px; } .rp-afspraak iframe { min-height: 560px; } }
`;

export default function Afspraak({ soort = 'plaatsbezoek' }: { soort?: AfspraakSoort }) {
  const t = TEKST[soort];
  useEffect(() => {
    document.title = t.titel;
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    window.scrollTo(0, 0);

    /* Het GHL-script past de hoogte van de iframe aan de kalender aan. */
    const s = document.createElement('script');
    /* link.msgsvc.com (het adres uit oudere GHL-embedcode) antwoordt niet meer. */
    s.src = 'https://api.leadconnectorhq.com/js/form_embed.js';
    s.async = true;
    document.body.appendChild(s);

    return () => { s.remove(); };
  }, [t]);

  return (
    <>
      <style>{STIJL}</style>
      <div dangerouslySetInnerHTML={{ __html: HTML(t) }} />
    </>
  );
}
