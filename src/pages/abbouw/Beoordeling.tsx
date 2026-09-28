import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { LOGO } from './_rp';

/**
 * Beoordeling na de oplevering: abgroep.be/beoordeling/<telefoon klant>/<1-5>.
 *
 * De klant klikt in de reviewmail op een ster; elke ster linkt hierheen met
 * de score in het adres. De score gaat meteen naar GHL (eigen webhook), zodat
 * Bardh een melding krijgt bij 1 tot 3 sterren.
 *
 * 4 of 5 sterren: meteen door naar de Google-reviewpagina van AB Bouw Groep.
 * 1 tot 3 sterren: een vak "wat kan beter", dat naar GHL gaat, en de belregel.
 * Geen Google-link: Mohammed, 28 sept, "geen Google link bij 1 tot 3, dat is
 * gewoon interne reviews behandelen". Het risico (Google-beleid tegen review
 * gating) is hem voorgelegd; dit is zijn keuze.
 *
 * Het telefoonnummer in het adres is hoe GHL het contact terugvindt: de
 * workflow "AB 08c Beoordeling" zoekt of maakt het contact op dat nummer.
 */
const GOOGLE_REVIEW = 'https://www.google.com/maps/place//data=!4m3!3m2!1s0x4a0341ae3b55ce5d:0x7d0fc6746e96d5bf!12e1';

/* Inbound webhook van de GHL-workflow "AB 08c Beoordeling". Leeg = nog niet
   gekoppeld; de pagina werkt dan wel, maar er gaat niets naar GHL. */
const WEBHOOK = 'https://services.leadconnectorhq.com/hooks/86MhhNXcdg4sbqD689x4/webhook-trigger/a0b08505-bebd-4dbe-8f73-eaae30a74128';

/* Zelfde normalisatie als /status: +32…, 32… en 04… worden allemaal +32…. */
function naarTelefoon(ruw: string): string {
  const cijfers = decodeURIComponent(ruw || '').replace(/\D/g, '');
  if (!cijfers) return '';
  if (cijfers.startsWith('32')) return '+' + cijfers;
  if (cijfers.startsWith('0')) return '+32' + cijfers.slice(1);
  return '+' + cijfers;
}

async function stuur(data: Record<string, string | number>) {
  if (!WEBHOOK) return;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, pagina: window.location.pathname }),
      signal: ctrl.signal,
      mode: 'cors',
      keepalive: true,
    });
    clearTimeout(t);
  } catch {
    /* Een mislukte melding mag de klant niet tegenhouden. */
  }
}

const STIJL = `
.rp-afs { min-height: 100vh; background: var(--rp-bg-soft); }
.rp-afs__kop { display: flex; justify-content: center; padding: 28px 16px 8px; }
.rp-afs__kop img { display: block; height: auto; }
.rp-afs__main { max-width: 560px; margin: 0 auto; padding: 16px 16px 48px; text-align: center; }
.rp-afs__t { font-size: clamp(28px, 5vw, 38px); line-height: 1.15; margin: 0; }
.rp-afs__lede { margin: 12px auto 24px; font-size: 17px; line-height: 1.55; }
.rp-bo__sterren { font-size: 40px; letter-spacing: 4px; color: var(--rp-accent); margin: 18px 0 6px; }
.rp-bo__sterren span { color: #d9d6cf; }
.rp-bo__kaart { background: #fff; border: 1px solid var(--rp-line-soft); border-radius: 14px; padding: 22px; text-align: left; }
.rp-bo__kaart label { display: block; font-weight: 600; margin-bottom: 8px; color: var(--rp-ink); }
.rp-bo__kaart textarea { width: 100%; min-height: 130px; padding: 12px; border: 1px solid #cfd3da; border-radius: 10px; font: inherit; font-size: 16px; resize: vertical; box-sizing: border-box; }
.rp-bo__knop { display: inline-flex; justify-content: center; align-items: center; width: 100%; margin-top: 14px; padding: 15px 20px; border: 0; border-radius: 10px; background: var(--rp-accent); color: var(--rp-accent-ink); font: inherit; font-size: 17px; font-weight: 700; cursor: pointer; text-decoration: none; box-sizing: border-box; }
.rp-bo__knop[disabled] { opacity: .6; cursor: default; }
.rp-bo__bel { margin: 18px 0 0; }
.rp-bo__bel a { font-weight: 600; color: inherit; white-space: nowrap; }
@media (max-width: 640px) { .rp-afs__kop img { width: 120px; } }
`;

export default function Beoordeling() {
  const { tel = '', score: ruw = '' } = useParams();
  const telefoon = naarTelefoon(tel);
  const score = Math.min(5, Math.max(1, parseInt(ruw, 10) || 0));
  const geldig = /^[1-5]$/.test(ruw);
  const tevreden = score >= 4;
  const [tekst, setTekst] = useState('');
  const [status, setStatus] = useState<'open' | 'bezig' | 'verstuurd'>('open');
  const gemeld = useRef(false);

  useEffect(() => {
    document.title = 'Uw beoordeling · AB Bouw Groep';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    window.scrollTo(0, 0);
    if (!geldig || gemeld.current) return;
    gemeld.current = true;
    /* Eerst de score melden, dan pas doorsturen: anders is de melding weg
       voor ze vertrokken is. */
    stuur({ phone: telefoon, score, soort: 'score' }).then(() => {
      if (tevreden) window.location.replace(GOOGLE_REVIEW);
    });
  }, [telefoon, score, geldig, tevreden]);

  const verstuur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tekst.trim() || status !== 'open') return;
    setStatus('bezig');
    await stuur({ phone: telefoon, score, soort: 'feedback', feedback: tekst.trim() });
    setStatus('verstuurd');
  };

  const sterren = (
    <div className="rp-bo__sterren" aria-label={`${score} van 5 sterren`}>
      {'★'.repeat(score)}<span>{'★'.repeat(5 - score)}</span>
    </div>
  );

  return (
    <div className="rp rp-afs">
      <style>{STIJL}</style>
      <header className="rp-afs__kop">
        <img src={LOGO} alt="AB Bouw Groep" width={150} />
      </header>
      <main className="rp-afs__main">
        {!geldig ? (
          <>
            <h1 className="rp-afs__t">Bedankt</h1>
            <p className="rp-afs__lede">Deze link is niet volledig. Bel ons gerust op <a href={CONTACT.phone.href}>{CONTACT.phone.display}</a>.</p>
          </>
        ) : tevreden ? (
          <>
            {sterren}
            <h1 className="rp-afs__t">Bedankt voor uw beoordeling</h1>
            <p className="rp-afs__lede">U gaat nu naar Google, waar u uw review kunt plaatsen.</p>
            <a className="rp-bo__knop" href={GOOGLE_REVIEW}>Naar Google</a>
          </>
        ) : status === 'verstuurd' ? (
          <>
            {sterren}
            <h1 className="rp-afs__t">Bedankt voor uw bericht</h1>
            <p className="rp-afs__lede">Wij nemen contact met u op.</p>
          </>
        ) : (
          <>
            {sterren}
            <h1 className="rp-afs__t">Bedankt voor uw eerlijke antwoord</h1>
            <p className="rp-afs__lede">Wat had beter gekund? Wij lezen elk bericht en nemen contact met u op.</p>
            <form className="rp-bo__kaart" onSubmit={verstuur}>
              <label htmlFor="feedback">Uw opmerking</label>
              <textarea id="feedback" value={tekst} onChange={(e) => setTekst(e.target.value)} />
              <button className="rp-bo__knop" type="submit" disabled={!tekst.trim() || status === 'bezig'}>
                {status === 'bezig' ? 'Bezig…' : 'Verstuur'}
              </button>
            </form>
            <p className="rp-bo__bel">Liever bellen? <a href={CONTACT.phone.href}>{CONTACT.phone.display}</a></p>
          </>
        )}
      </main>
    </div>
  );
}
