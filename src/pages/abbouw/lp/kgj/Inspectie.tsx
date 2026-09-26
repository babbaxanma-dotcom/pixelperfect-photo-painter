import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import type { KgjInhoud } from './inhoud';
import PostcodeGemeente from './PostcodeGemeente';

/**
 * Aanvraag voor de gratis dakinspectie, onderaan de pagina.
 *
 * Wie tot hier scrolt, heeft de pagina gelezen en wil iemand over de vloer.
 * Daarom geen vijf vragen meer, maar drie velden: telefoon (verplicht), naam
 * en gemeente. De gemeente is er zodat de ploeg weet waar hij heen moet.
 *
 * Wie toch eerst een prijs wil, opent onder de knop de calculator in een
 * venster. Zo zijn er twee wegen en geen doodlopende.
 *
 * Draagt de klasse kgj-reken, zodat de vaste actiebalk op de telefoon
 * wegvalt zodra dit formulier in beeld komt, net als bij de calculator.
 *
 * De lead gaat via submitLead: GHL-webhook en Web3Forms-backup tegelijk,
 * conversie alleen bij bezorging.
 */
export default function Inspectie({ inhoud, opPrijs }: { inhoud: KgjInhoud; opPrijs: () => void }) {
  const navigate = useNavigate();
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const gestart = useRef(false);
  const t = inhoud.inspectie;

  const meldStart = () => {
    if (gestart.current) return;
    gestart.current = true;
    trackFormStart(t.bronLead);
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const telefoon = String(f.get('telefoon') || '').trim();
    /* Dezelfde drempel als de calculator en de lead-pijplijn: acht cijfers. */
    const cijfers = telefoon.replace(/\D/g, '').length;
    if (!telefoon) { setFout('Vul uw telefoonnummer in. Wij bellen u om een moment af te spreken.'); return; }
    if (cijfers < 8) { setFout('Dat telefoonnummer lijkt niet volledig. Controleer het even.'); return; }
    setFout(null);
    setBezig(true);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: inhoud.divisie,
      firstName: String(f.get('naam') || '').trim() || undefined,
      email: '',
      phone: telefoon,
      postcode: String(f.get('postcode') || '').trim() || undefined,
      gemeente: String(f.get('gemeente') || '').trim() || undefined,
      type_werk: inhoud.divisie,
      /* "Aanvraag gratis dakinspectie" of "Aanvraag gratis plaatsbezoek". */
      aanvullende_info: 'Aanvraag ' + inhoud.cta.kop.toLowerCase(),
      bron_lead: t.bronLead,
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=' + inhoud.bedanktSlug);
    else setFout(leadFoutmelding(res, CONTACT.phone.display));
  };

  return (
    <div className="kgj-reken kgj-reken--inspectie">
      <form className="kgj-reken__form" onSubmit={verstuur} onFocus={meldStart} noValidate>
        <p className="kgj-reken__vraag">{t.kop}</p>
        <label>Telefoon *
          <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder="04xx xx xx xx"
            aria-required="true" />
        </label>
        <div className="kgj-reken__rij">
          <label>Naam<input name="naam" type="text" autoComplete="name" placeholder="Uw naam" /></label>
          <PostcodeGemeente />
        </div>
        <button className="kgj-knop kgj-knop--vol kgj-reken__knop" type="submit" disabled={bezig}>
          {bezig ? 'Bezig…' : t.knop}
        </button>
        <p className="kgj-reken__gerust">{t.onder}</p>
        {fout && <p className="kgj-reken__fout" role="alert">{fout}</p>}
        <button type="button" className="kgj-reken__alt" onClick={opPrijs}>{t.alt}</button>
        <p className="kgj-reken__privacy">Wij gebruiken uw gegevens alleen voor deze aanvraag. <a href="/privacy">Privacybeleid</a></p>
      </form>
    </div>
  );
}
