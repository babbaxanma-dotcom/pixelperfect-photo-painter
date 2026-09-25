import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgePercent, Calculator, Clock, Home, ShieldCheck } from 'lucide-react';
import { Icoon } from './Iconen';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import type { KgjInhoud, Vraag } from './inhoud';

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
/** Past de vraag bij de antwoorden tot nu toe? Een open voorwaarde telt als nee. */
function past(v: Vraag, a: Record<string, string>) {
  return !v.als || Object.entries(v.als).every(([k, waarden]) => waarden.includes(a[k]));
}

/** Aantal vragen op het langste pad dat met deze antwoorden nog kan. */
function langstePad(alle: Vraag[], antwoorden: Record<string, string>) {
  const sleutels = [...new Set(alle.flatMap((v) => Object.keys(v.als ?? {})))].filter((k) => !antwoorden[k]);
  let mogelijk: Record<string, string>[] = [{ ...antwoorden }];
  for (const k of sleutels) {
    const opties = alle.find((v) => v.sleutel === k && !v.als)?.keuzes.map((c) => c.label) ?? [];
    mogelijk = mogelijk.flatMap((m) => opties.map((o) => ({ ...m, [k]: o })));
  }
  return Math.max(...mogelijk.map((m) => alle.filter((v) => past(v, m)).length));
}

export default function Rekenaar({ inhoud, plek }: { inhoud: KgjInhoud; plek: 'hero' | 'onder' | 'venster' }) {
  const ALLE = inhoud.rekenaar.vragen;
  const navigate = useNavigate();
  const [stap, setStap] = useState(0);
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>({});
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const gestart = useRef(false);

  /* Vragen met een voorwaarde (als) verschijnen pas als de antwoorden waarop ze
     wachten gegeven zijn: de bedekking hangt af van het soort dak én van het
     werk, de vraag naar isolatie komt alleen bij een renovatie. */
  const VRAGEN = ALLE.filter((v) => past(v, antwoorden));
  /* De teller rekent met het langste pad zolang een vraag waarvan het vervolg
     afhangt nog open staat, zodat het totaal nooit oploopt; daarna met het
     echte pad (renovatie 8, herstelling 7, isolatie 6). */
  const AANTAL = langstePad(ALLE, antwoorden);

  const klaar = stap >= VRAGEN.length;
  const totaal = AANTAL + 1;
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
    if (!telefoon) { setFout('Vul uw telefoonnummer in om uw prijs te ontvangen.'); return; }
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
  /* Na bepaalde antwoorden verschijnt onder de volgende vraag een korte melding
     (de 6% btw na "Hoe oud is uw dak?"), alleen op die ene stap. */
  const vorige = stap > 0 ? VRAGEN[stap - 1] : undefined;
  const tip = vorige?.tip && vorige.tip.bij.includes(antwoorden[vorige.sleutel]) ? vorige.tip.tekst : null;

  return (
    <div className={`kgj-reken kgj-reken--${plek}`}>
      <div className="kgj-reken__hoofd">
        <span className="kgj-reken__logo" aria-hidden="true"><Calculator /></span>
        <div>
          <p className="kgj-reken__titel">{inhoud.rekenaar.titel}</p>
          <p className="kgj-reken__tijd"><Clock aria-hidden="true" />{inhoud.rekenaar.tijd}</p>
        </div>
      </div>
      {/* De balk loopt van het huis naar de prijs: wat je aan het einde krijgt,
          staat er vanaf de eerste vraag (zoals bij Airadvisor het bedrag). */}
      <div className="kgj-reken__weg" aria-hidden="true">
        <Home className="kgj-reken__begin" />
        <div className="kgj-reken__balk"><i style={{ width: `${(nu / totaal) * 100}%` }} /></div>
        <span className={`kgj-reken__eind${klaar ? ' is-aan' : ''}`}>€</span>
      </div>
      <div className="kgj-reken__kop">
        <span className="kgj-reken__tel">{klaar ? 'Laatste stap' : `Vraag ${nu} van ${AANTAL}`}</span>
        {stap > 0 && (
          <button type="button" className="kgj-reken__terug" onClick={() => setStap((s) => s - 1)}>‹ Terug</button>
        )}
      </div>

      {!klaar ? (
        <div className="kgj-reken__stap" key={stap}>
          <p className="kgj-reken__vraag">{vraag.vraag}</p>
          <div className={`kgj-reken__keuzes${vraag.keuzes.length % 2 === 1 ? ' kgj-reken__keuzes--oneven' : ''}`}>
            {vraag.keuzes.map((k) => (
              <button type="button" key={k.label}
                className={`kgj-reken__keuze${k.icoon ? ' kgj-reken__keuze--icoon' : ''}${antwoorden[vraag.sleutel] === k.label ? ' is-aan' : ''}`}
                onClick={() => kies(vraag.sleutel, k.label)}>
                {k.foto && <img className="kgj-reken__foto" src={k.foto} alt="" width={640} height={360} decoding="async" />}
                {k.icoon && <i className="kgj-reken__icoon"><Icoon naam={k.icoon} /></i>}
                <span className="kgj-reken__tekst">
                  <strong>{k.label}</strong>
                  {k.uitleg && <span>{k.uitleg}</span>}
                </span>
              </button>
            ))}
          </div>
          {tip && <p className="kgj-reken__tip"><BadgePercent aria-hidden="true" />{tip}</p>}
          {/* Niet bij vraag 1: wat er aan het dak moet gebeuren, weet de bezoeker
              zelf (Mohammed: 'hoe kan iemand niet weten wat hij wilt'). */}
          {stap > 0 && <p className="kgj-reken__gerust">{inhoud.rekenaar.gerust}</p>}
        </div>
      ) : (
        <form className="kgj-reken__stap kgj-reken__form" onSubmit={verstuur} noValidate>
          <p className="kgj-reken__vraag">{inhoud.rekenaar.uitkomstKop}</p>
          <label>Telefoon *
            {/* Geen autoFocus: op een telefoon sprong het toetsenbord dan meteen open
                over de vraag heen (Mohammed, 24 sep: "oude mensen gaan vastraken"). */}
            <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder="04xx xx xx xx"
              aria-required="true" />
          </label>
          <div className="kgj-reken__rij">
            <label>Naam<input name="naam" type="text" autoComplete="name" placeholder="Uw naam" /></label>
            <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="uw@email.be" /></label>
          </div>
          <button className="kgj-knop kgj-knop--vol kgj-reken__knop" type="submit" disabled={bezig}>
            {bezig ? 'Bezig…' : inhoud.rekenaar.knop}
          </button>
          {inhoud.rekenaar.uitkomstOnder && <p className="kgj-reken__gerust">{inhoud.rekenaar.uitkomstOnder}</p>}
          {/* AVG: informatie bij het verzamelen (art. 13), klein en rustig (Mohammed, 25 sep:
              "niet opeens super duidelijk aan de prospect"). */}
          <p className="kgj-reken__privacy">Wij gebruiken uw gegevens alleen voor deze aanvraag. <a href="/privacy">Privacybeleid</a></p>
          {fout && <p className="kgj-reken__fout" role="alert">{fout}</p>}
        </form>
      )}
      <p className="kgj-reken__zeker"><ShieldCheck aria-hidden="true" />{inhoud.rekenaar.zeker}</p>
    </div>
  );
}
