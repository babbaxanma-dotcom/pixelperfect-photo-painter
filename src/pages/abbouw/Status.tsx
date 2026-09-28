import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '@/styles/roofpro.css';
import { LOGO } from './_rp';

/**
 * Statusmelding voor Bardh: abgroep.be/status/<telefoon klant>/<stap>.
 *
 * De interne sms'en uit het CRM (B1, B2, B5, B7) linkten naar het GHL-formulier
 * met ?phone=…&statusmelding=Klant%20gebeld%2C%20afspraak%20volgt erachter.
 * Mohammed, 28 sept: "duidelijkere link, nu zie je allemaal strings aan het
 * einde van het bericht". Deze pagina maakt daar een leesbaar adres van en
 * vult het formulier op dezelfde manier vooraf in.
 *
 * Het laatste woord van het adres moet exact overeenkomen met een optie van het
 * GHL-veld "Statusmelding"; de waarden hieronder zijn letterlijk die opties.
 * Een onbekend of ontbrekend woord laat de keuze open voor Bardh.
 */
const FORMULIER = 'https://api.leadconnectorhq.com/widget/form/2CxpclAhBCWQAaPBpLNt';

const STAPPEN: Record<string, string> = {
  gebeld: 'Klant gebeld, afspraak volgt',
  bezoek: 'Plaatsbezoek gedaan',
  'niet-thuis': 'Klant niet aanwezig',
  offerte: 'Offerte verstuurd',
  gewonnen: 'Gewonnen',
  verloren: 'Verloren',
  'werf-gestart': 'Werf gestart',
  uitgesteld: 'Werf uitgesteld',
  opgeleverd: 'Opgeleverd',
  betaald: 'Eindfactuur betaald',
};

/* GHL geeft {{contact.phone}} als +32460256585. Een sms-app kan de + in een
   link weglaten; dan komt 32460256585 of 0460256585 binnen. Alles wordt +32. */
function naarTelefoon(ruw: string): string {
  const cijfers = decodeURIComponent(ruw || '').replace(/\D/g, '');
  if (!cijfers) return '';
  if (cijfers.startsWith('32')) return '+' + cijfers;
  if (cijfers.startsWith('0')) return '+32' + cijfers.slice(1);
  return '+' + cijfers;
}

function leesbaar(tel: string): string {
  const m = tel.match(/^\+32(4\d{2})(\d{2})(\d{2})(\d{2})$/);
  return m ? `0${m[1]} ${m[2]} ${m[3]} ${m[4]}` : tel;
}

const STIJL = `
.rp-afs { min-height: 100vh; background: var(--rp-bg-soft); }
.rp-afs__kop { display: flex; justify-content: center; padding: 28px 16px 8px; }
.rp-afs__kop img { display: block; height: auto; }
.rp-afs__main { max-width: 560px; margin: 0 auto; padding: 16px 16px 48px; text-align: center; }
.rp-afs__t { font-size: clamp(28px, 5vw, 38px); line-height: 1.1; margin: 0; }
.rp-afs__lede { margin: 10px auto 24px; font-size: 17px; line-height: 1.5; }
.rp-afspraak { background: #fff; border: 1px solid var(--rp-line-soft); border-radius: 14px; overflow: hidden; text-align: left; }
.rp-afspraak iframe { display: block; width: 100%; min-height: 360px; border: 0; }
@media (max-width: 640px) { .rp-afs__kop img { width: 120px; } .rp-afspraak { border-radius: 10px; } }
`;

export default function Status() {
  const { tel = '', stap = '' } = useParams();
  const telefoon = naarTelefoon(tel);
  const status = STAPPEN[stap.toLowerCase()] ?? '';
  const query = new URLSearchParams();
  if (telefoon) query.set('phone', telefoon);
  if (status) query.set('statusmelding', status);
  const src = `${FORMULIER}?${query.toString()}`;

  useEffect(() => {
    document.title = 'Status doorgeven · AB Bouw Groep';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    window.scrollTo(0, 0);

    /* Zelfde hoogtescript als /afspraak; link.msgsvc.com antwoordt niet meer. */
    const s = document.createElement('script');
    s.src = 'https://api.leadconnectorhq.com/js/form_embed.js';
    s.async = true;
    document.body.appendChild(s);
    return () => { s.remove(); };
  }, []);

  return (
    <div className="rp rp-afs">
      <style>{STIJL}</style>
      <header className="rp-afs__kop">
        <img src={LOGO} alt="AB Bouw Groep" width={150} />
      </header>
      <main className="rp-afs__main">
        <h1 className="rp-afs__t">Status doorgeven</h1>
        {telefoon && <p className="rp-afs__lede">Klant: <strong>{leesbaar(telefoon)}</strong></p>}
        <div className="rp-afspraak">
          <iframe src={src} id="2CxpclAhBCWQAaPBpLNt_status" title="Statusmelding AB Bouw Groep" scrolling="no" />
        </div>
      </main>
    </div>
  );
}
