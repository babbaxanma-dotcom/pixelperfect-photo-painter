import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import type { KgjInhoud } from './inhoud';

/**
 * De prijscalculator als eerste handeling van de pagina.
 *
 * Hij staat meteen open: de eerste vraag is zichtbaar zonder dat er iets
 * aangeklikt moet worden. Bij de vijf grootste spelers moet de bezoeker eerst
 * een knop in (Rinovato), scrollen (Kijzer, Recotex) of zeven velden invullen
 * (Recotex' campagnepagina); hier is de eerste tik al een antwoord.
 *
 * Een tik op een keuze gaat meteen door naar de volgende vraag. Contactgegevens
 * komen pas na de laatste vraag, en alleen het telefoonnummer is verplicht.
 *
 * Er verschijnt GEEN bedrag. In de code staan geen tarieven van AB, en een
 * getal dat niet uit AB's eigen prijzen komt, is een belofte die de offerte
 * later moet waarmaken. Zodra AB zijn prijzen per m² doorgeeft, kan hier een
 * richtprijs komen.
 *
 * De lead gaat via submitLead, dezelfde weg als de bestaande calculator:
 * GHL-webhook en Web3Forms-backup tegelijk, conversie alleen bij bezorging.
 */
export default function Rekenaar({ inhoud, plek }: { inhoud: KgjInhoud; plek: 'hero' | 'onder' }) {
  const VRAGEN = inhoud.rekenaar.vragen;
  const navigate = useNavigate();
  const [stap, setStap] = useState(0);
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>({});
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const gestart = useRef(false);

  const klaar = stap >= VRAGEN.length;
  const totaal = VRAGEN.length + 1;
  const nu = klaar ? totaal : stap + 1;

  /* De eerste tik telt als start van het formulier: in GA4 zie je dan hoeveel
     mensen beginnen tegenover hoeveel er versturen. */
  const meldStart = () => {
    if (gestart.current) return;
    gestart.current = true;
    trackFormStart(`${inhoud.bronLead}:${plek}`);
  };

  const kies = (sleutel: string, label: string) => {
    meldStart();
    setAntwoorden((a) => ({ ...a, [sleutel]: label }));
    setStap((s) => s + 1);
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const telefoon = String(f.get('telefoon') || '').trim();
    /* Dezelfde drempel als de lead-pijplijn zelf, acht cijfers: een voorkant die
       iets doorlaat wat de achterkant weigert, laat de bezoeker denken dat hij
       verstuurd heeft terwijl er niets aankomt. */
    const cijfers = telefoon.replace(/\D/g, '').length;
    if (!telefoon) { setFout('Vul uw telefoonnummer in. Wij bellen u met de prijs.'); return; }
    if (cijfers < 8) { setFout('Dat telefoonnummer lijkt niet volledig. Controleer het even.'); return; }
    setFout(null);
    setBezig(true);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: inhoud.divisie,
      firstName: String(f.get('naam') || '').trim() || undefined,
      email: String(f.get('email') || '').trim(),
      phone: telefoon,
      type_werk: inhoud.divisie,
      aanvullende_info: VRAGEN.map((v) => `${v.sleutel}: ${antwoorden[v.sleutel] || '-'}`).join(' · '),
      bron_lead: `${inhoud.bronLead}:${plek}`,
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=' + inhoud.bedanktSlug);
    else setFout(leadFoutmelding(res, CONTACT.phone.display));
  };

  const vraag = VRAGEN[stap];

  return (
    <div className={`kgj-reken kgj-reken--${plek}`}>
      <div className="kgj-reken__kop">
        <span className="kgj-reken__tel">{klaar ? 'Laatste stap' : `Vraag ${nu} van ${VRAGEN.length}`}</span>
        {stap > 0 && (
          <button type="button" className="kgj-reken__terug" onClick={() => setStap((s) => s - 1)}>‹ Terug</button>
        )}
      </div>
      <div className="kgj-reken__balk" aria-hidden="true"><i style={{ width: `${(nu / totaal) * 100}%` }} /></div>

      {!klaar ? (
        <div className="kgj-reken__stap" key={stap}>
          <p className="kgj-reken__vraag">{vraag.vraag}</p>
          <div className={`kgj-reken__keuzes${vraag.keuzes.length === 5 ? ' kgj-reken__keuzes--vijf' : ''}`}>
            {vraag.keuzes.map((k) => (
              <button type="button" key={k.label}
                className={`kgj-reken__keuze${antwoorden[vraag.sleutel] === k.label ? ' is-aan' : ''}`}
                onClick={() => kies(vraag.sleutel, k.label)}>
                {k.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form className="kgj-reken__stap kgj-reken__form" onSubmit={verstuur} noValidate>
          <p className="kgj-reken__vraag">{inhoud.rekenaar.uitkomstKop}</p>
          <label>Telefoon *
            <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder="04xx xx xx xx"
              aria-required="true" autoFocus />
          </label>
          <div className="kgj-reken__rij">
            <label>Naam<input name="naam" type="text" autoComplete="name" placeholder="Uw naam" /></label>
            <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="uw@email.be" /></label>
          </div>
          <button className="kgj-knop kgj-knop--vol kgj-reken__knop" type="submit" disabled={bezig}>
            {bezig ? 'Bezig…' : inhoud.rekenaar.knop}
          </button>
          <p className="kgj-reken__gerust">{inhoud.rekenaar.uitkomstOnder}</p>
          {fout && <p className="kgj-reken__fout" role="alert">{fout}</p>}
        </form>
      )}
    </div>
  );
}
