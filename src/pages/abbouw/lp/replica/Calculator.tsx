import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import { IcChevron, IcPijl } from './Iconen';

type Keuze = { label: string; uitleg: string };
type Vraag = { sleutel: string; vraag: string; keuzes: Keuze[] };

/**
 * Vijf vragen, één per scherm.
 *
 * Bewust vijf en niet acht: elke extra vraag is een kans om af te haken, en een
 * vraag als "welke afwerking hebt u in gedachten" kan een bezoeker niet
 * beantwoorden zonder eerst offertes gezien te hebben. Wat overblijft is wat
 * hij zonder nadenken weet: wat, hoe groot, hoe oud, hoeveel, en wanneer.
 *
 * Onder elke keuze staat een tweede regel die de keuze concreet maakt — bij
 * grootte staat het aantal vierkante meter erbij, zodat niemand hoeft te meten.
 * Overal is er een uitweg ("weet ik niet"), want wie twijfelt sluit het scherm
 * in plaats van te gokken.
 */
const VRAGEN: Vraag[] = [
  /* Niet "welke dienst wil u" — wie op een totaalrenovatie-pagina landt heeft
     dat al gezegd, en zo'n vraag leest alsof je niet geluisterd hebt. Wat wél
     verschilt tussen deze bezoekers, en wat de prijs het hardst stuurt, is hoe
     VER de renovatie gaat. Daar vraagt hij dus naar. Eén losse ruimte staat er bewust NIET bij:
     dat is per definitie geen totaalrenovatie. */
  {
    sleutel: 'Omvang',
    vraag: 'Hoever gaat uw renovatie?',
    keuzes: [
      { label: 'De hele woning', uitleg: 'van kelder tot dak' },
      { label: 'De benedenverdieping', uitleg: 'leefruimte, keuken, berging' },
      { label: 'De bovenverdieping', uitleg: 'slaapkamers en badkamer' },
      { label: 'Nog niet beslist', uitleg: 'daar komen we samen uit' },
    ],
  },
  {
    sleutel: 'Grootte',
    vraag: 'Hoe groot is het ongeveer?',
    keuzes: [
      { label: 'Eén kamer', uitleg: 'ongeveer 20 m²' },
      { label: 'Een verdieping', uitleg: 'ongeveer 60 m²' },
      { label: 'Een rijwoning', uitleg: 'ongeveer 120 m²' },
      { label: 'Een grote woning', uitleg: '200 m² of meer' },
      { label: 'Geen idee', uitleg: 'wij meten het op' },
    ],
  },
  {
    sleutel: 'Leeftijd woning',
    vraag: 'Hoe oud is de woning ongeveer?',
    keuzes: [
      { label: 'Nieuwer dan 10 jaar', uitleg: 'dan geldt 21% btw' },
      { label: '10 tot 30 jaar', uitleg: 'dan geldt 6% btw' },
      { label: '30 tot 50 jaar', uitleg: 'dan geldt 6% btw' },
      { label: 'Ouder dan 50 jaar', uitleg: 'dan geldt 6% btw' },
      { label: 'Weet ik niet', uitleg: 'wij zoeken het op' },
    ],
  },
  {
    sleutel: 'Staat',
    vraag: 'Hoeveel moet er vernieuwd worden?',
    keuzes: [
      { label: 'Alles', uitleg: 'strippen tot op de ruwbouw' },
      { label: 'Een groot deel', uitleg: 'een stuk blijft staan' },
      { label: 'Enkel de afwerking', uitleg: 'vloer, pleister en verf' },
      { label: 'Weet ik niet', uitleg: 'dat zien we ter plaatse' },
    ],
  },
  {
    sleutel: 'Start',
    vraag: 'Wanneer zou u willen starten?',
    keuzes: [
      { label: 'Zo snel mogelijk', uitleg: 'wij bellen u eerst' },
      { label: 'Binnen drie maanden', uitleg: 'ruim op tijd' },
      { label: 'Dit jaar nog', uitleg: 'we plannen samen in' },
      { label: 'Ik kijk eerst rond', uitleg: 'vrijblijvend, geen druk' },
    ],
  },
];

/**
 * Prijsindicatie-wizard onder de balk in de hero.
 *
 * Hij toont GEEN bedrag. Een getal dat niet uit AB's eigen tarieven komt is een
 * belofte die de offerte later moet waarmaken, en een bezoeker die zijn cijfer
 * al heeft belt niet meer. In plaats daarvan klikt hij door naar zijn
 * samenvatting en laat hij zijn gegevens achter — hetzelfde patroon als de
 * bestaande calculators op de site (CalculatorWizard).
 */
export default function Calculator() {
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
    if (!gemeld.ja) { gemeld.ja = true; trackFormStart('lp:replica:calculator'); }
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
    if (!email && !telefoon) { setFout('Vul een e-mailadres of een telefoonnummer in.'); return; }
    setFout(null);
    setBezig(true);
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: 'ab_construct',
      firstName: String(f.get('naam') || '').trim() || undefined,
      email,
      phone: telefoon || undefined,
      type_werk: 'ab_construct',
      aanvullende_info: VRAGEN.map((v) => v.sleutel + ': ' + (antwoorden[v.sleutel] || '—')).join(' · '),
      bron_lead: 'lp:totaalrenovatie:calculator',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=totaalrenovatie');
    else setFout('Versturen lukte niet. Bel gerust ' + CONTACT.phone.display + '.');
  };

  if (!open) {
    return (
      <div className="pc-calc pc-calc--dicht">
        <div>
          <span className="pc-calc-badge">Prijsindicatie in 5 vragen</span>
          <h2>Wat kost uw renovatie?</h2>
          <p>Klik de antwoorden aan. U hoeft niets op te meten of op te zoeken.</p>
        </div>
        <button type="button" className="pc-knop pc-knop--accent" onClick={start}>
          Start de berekening<IcPijl />
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
          <h2>Waar mogen wij uw prijs naartoe sturen?</h2>
          <ul className="pc-calc-samenvatting">
            {VRAGEN.map((v) => (
              <li key={v.sleutel}><span>{v.sleutel}</span><span>{antwoorden[v.sleutel] || '—'}</span></li>
            ))}
          </ul>
          <form onSubmit={verstuur}>
            <label className="pc-veld"><input name="naam" type="text" placeholder="Naam" autoComplete="name" aria-label="Naam" /></label>
            <label className="pc-veld"><input name="telefoon" type="tel" placeholder="Telefoon" autoComplete="tel" aria-label="Telefoon" /></label>
            <label className="pc-veld"><input name="email" type="email" placeholder="E-mail" autoComplete="email" aria-label="E-mail" /></label>
            <button className="pc-knop pc-knop--accent" type="submit" disabled={bezig}>
              {bezig ? 'Bezig…' : 'Vraag mijn prijs aan'}<IcPijl />
            </button>
          </form>
          <p className="pc-calc-gerust">
            <strong>Volledig vrijblijvend — u zit nergens aan vast.</strong> Wij bellen u binnen één
            werkdag met een prijsindicatie en plannen het gratis plaatsbezoek in.
          </p>
          {fout && <p className="pc-calc-fout">{fout}</p>}
        </div>
      )}
    </div>
  );
}
