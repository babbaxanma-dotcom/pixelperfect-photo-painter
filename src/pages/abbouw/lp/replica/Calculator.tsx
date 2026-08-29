import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import { IcChevron, IcPijl } from './Iconen';
import type { PaginaInhoud } from './inhoud';

type Inhoud = PaginaInhoud['calculator'];
type Vraag = Inhoud['vragen'][number];
type Keuze = Vraag['keuzes'][number];

/**
 * Prijsindicatie-wizard onder de balk in de hero.
 *
 * Hij toont GEEN bedrag. Een getal dat niet uit AB's eigen tarieven komt is een
 * belofte die de offerte later moet waarmaken, en een bezoeker die zijn cijfer
 * al heeft belt niet meer. In plaats daarvan klikt hij door naar zijn
 * samenvatting en laat hij zijn gegevens achter — hetzelfde patroon als de
 * bestaande calculators op de site (CalculatorWizard).
 */
export default function Calculator({ inhoud }: { inhoud: Inhoud }) {
  const VRAGEN = inhoud.vragen;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [stap, setStap] = useState(0);
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>({});
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const gemeld = useState({ ja: false })[0];

  const klaar = stap >= VRAGEN.length;
  const totaal = VRAGEN.length + 1;

  const start = () => {
    setOpen(true);
    if (!gemeld.ja) { gemeld.ja = true; trackFormStart(inhoud.bronLead); }
  };

  const kies = (v: Vraag, k: Keuze) => {
    setAntwoorden((a) => ({ ...a, [v.sleutel]: k.label }));
    setStap((s) => s + 1);
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    const telefoon = String(f.get('telefoon') || '').trim();
    /* Telefoon is hier VERPLICHT, e-mail niet. Een prijsindicatie geven we aan
       de telefoon: dat is één gesprek in plaats van drie mails heen en weer.
       Dezelfde drempel als de lead-pijplijn zelf hanteert — acht cijfers — want
       een voorkant die iets doorlaat wat de achterkant weigert, laat de
       bezoeker denken dat hij verstuurd heeft terwijl er niets aankomt. */
    const cijfers = telefoon.replace(/\D/g, '').length;
    if (!telefoon) { setFout('Vul uw telefoonnummer in. Wij bellen u met de prijsindicatie.'); return; }
    if (cijfers < 8) { setFout('Dat telefoonnummer lijkt niet volledig. Controleer het even.'); return; }
    setFout(null);
    setBezig(true);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: inhoud.divisie,
      firstName: String(f.get('naam') || '').trim() || undefined,
      email,
      phone: telefoon || undefined,
      type_werk: inhoud.divisie,
      aanvullende_info: VRAGEN.map((v) => v.sleutel + ': ' + (antwoorden[v.sleutel] || '—')).join(' · '),
      bron_lead: inhoud.bronLead,
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=' + inhoud.bedanktSlug);
    else setFout('Versturen lukte niet. Bel gerust ' + CONTACT.phone.display + '.');
  };

  if (!open) {
    return (
      <div className="pc-calc pc-calc--dicht">
        <div>
          <span className="pc-calc-badge">{inhoud.badge}</span>
          <h2>{inhoud.kop}</h2>
          <p>{inhoud.onder}</p>
        </div>
        <button type="button" className="pc-knop pc-knop--accent" onClick={start}>
          {inhoud.knop}<IcPijl />
        </button>
      </div>
    );
  }

  const vraag = VRAGEN[stap];
  const nu = klaar ? totaal : stap + 1;

  return (
    <div className="pc-calc pc-calc--open">
      <div className="pc-calc-kop">
        <span className="pc-calc-tel">Stap {nu} van {totaal}</span>
        {stap > 0 && (
          <button type="button" className="pc-calc-terug" onClick={() => setStap((s) => s - 1)}>
            <IcChevron richting="links" />Terug
          </button>
        )}
      </div>
      <div className="pc-calc-balk" aria-hidden="true"><i style={{ width: (nu / totaal) * 100 + '%' }} /></div>

      {!klaar ? (
        <div className="pc-calc-vraag">
          <h2>{vraag.vraag}</h2>
          <div className="pc-calc-keuzes">
            {vraag.keuzes.map((k) => (
              <button type="button" key={k.label} onClick={() => kies(vraag, k)}>
                <strong>{k.label}</strong>
                <span>{k.uitleg}</span>
              </button>
            ))}
          </div>
          <p className="pc-calc-gerust">Een schatting volstaat. U kunt hier niets fout invullen.</p>
        </div>
      ) : (
        <div className="pc-calc-uitkomst">
          <h2>{inhoud.uitkomstKop}</h2>
          <ul className="pc-calc-samenvatting">
            {VRAGEN.map((v) => (
              <li key={v.sleutel}><span>{v.sleutel}</span><span>{antwoorden[v.sleutel] || '—'}</span></li>
            ))}
          </ul>
          <form onSubmit={verstuur}>
            <label className="pc-veld"><input name="naam" type="text" placeholder="Naam" autoComplete="name" aria-label="Naam" /></label>
            <label className="pc-veld"><input name="telefoon" type="tel" placeholder="Telefoon" autoComplete="tel"
              aria-label="Telefoon (verplicht)" aria-required="true" /></label>
            <label className="pc-veld"><input name="email" type="email" placeholder="E-mail" autoComplete="email" aria-label="E-mail" /></label>
            <button className="pc-knop pc-knop--accent" type="submit" disabled={bezig}>
              {bezig ? 'Bezig…' : 'Vraag mijn prijs aan'}<IcPijl />
            </button>
          </form>
          <p className="pc-calc-gerust">
            <strong>Volledig vrijblijvend — u zit nergens aan vast.</strong> Wij bellen u binnen één
            werkdag met een prijsindicatie.
          </p>
          {fout && <p className="pc-calc-fout">{fout}</p>}
        </div>
      )}
    </div>
  );
}
