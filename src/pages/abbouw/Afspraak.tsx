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
const KALENDER_URL = `https://api.leadconnectorhq.com/widget/booking/${KALENDER_ID}`;

const HTML = () => `<div class="rp rp-afs">
<header class="rp-afs__kop">
  <a href="/" aria-label="AB Bouw Groep"><img src="${LOGO}" alt="AB Bouw Groep" width="150" /></a>
</header>

<main class="rp-afs__main">
  <h1 class="rp-afs__t">Plan uw plaatsbezoek</h1>
  <p class="rp-afs__lede">Kies een dag en een uur. Onze projectleider komt langs, meet op en bespreekt uw plannen ter plaatse.</p>
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
.rp-afspraak iframe { display: block; width: 100%; min-height: 720px; border: 0; }
.rp-afspraak__onder { margin: 22px 0 0; }
.rp-afspraak__onder a { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: inherit; white-space: nowrap; }
@media (max-width: 640px) { .rp-afs__kop img { width: 120px; } .rp-afspraak { border-radius: 10px; } .rp-afspraak iframe { min-height: 860px; } }
`;

export default function Afspraak() {
  useEffect(() => {
    document.title = 'Plaatsbezoek plannen · AB Bouw Groep';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    window.scrollTo(0, 0);

    /* Het GHL-script past de hoogte van de iframe aan de kalender aan. */
    const s = document.createElement('script');
    s.src = 'https://link.msgsvc.com/js/form_embed.js';
    s.async = true;
    document.body.appendChild(s);

    return () => { s.remove(); };
  }, []);

  return (
    <>
      <style>{STIJL}</style>
      <div dangerouslySetInnerHTML={{ __html: HTML() }} />
    </>
  );
}
