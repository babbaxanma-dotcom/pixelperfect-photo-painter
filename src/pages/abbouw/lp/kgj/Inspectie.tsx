import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { allowsMarketing } from '@/lib/consent';
import { CONTACT } from '@/data/contact';
import type { KgjInhoud } from './inhoud';
import PostcodeGemeente from './PostcodeGemeente';
import Toestemming from './Toestemming';

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
/* Iconen voor de geruststellingen onder de knop: slot, telefoon, euro, koffie (5 okt). Lijntekening in de
   huisstijl in plaats van de emoji's uit de blauwdruk. */
const VERTROUWEN_ICOON: Record<'slot' | 'telefoon' | 'euro' | 'koffie', JSX.Element> = {
  slot: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" /></svg>,
  telefoon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.4 3.4H5.6a2 2 0 0 0-2 2.2c.6 8.3 7.2 14.9 15.5 15.5a2 2 0 0 0 2.2-2v-1.8a1.6 1.6 0 0 0-1.2-1.6l-3-.8a1.6 1.6 0 0 0-1.6.4l-1.2 1.2a11.2 11.2 0 0 1-5.4-5.4l1.2-1.2a1.6 1.6 0 0 0 .4-1.6l-.8-3a1.6 1.6 0 0 0-1.6-1.2Z" /></svg>,
  euro: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.6 6.4A7.2 7.2 0 1 0 17.6 17.6" /><path d="M4.6 10.2h8.8M4.6 13.8h8.8" /></svg>,
  koffie: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9.5h12.5v5.2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" /><path d="M16.5 11h1.3a2.6 2.6 0 0 1 0 5.2h-1.6" /><path d="M8 3.5c-.6.8-.6 1.6 0 2.4M11.5 3.5c-.6.8-.6 1.6 0 2.4" /></svg>,
};

export default function Inspectie({ inhoud, opPrijs }: { inhoud: KgjInhoud; opPrijs: () => void }) {
  const navigate = useNavigate();
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [vraagToestemming, setVraagToestemming] = useState(false);
  const gestart = useRef(false);
  const t = inhoud.inspectie;
  const pb = t.plaatsbezoek;

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
      email: String(f.get('email') || '').trim(),
      phone: telefoon,
      postcode: String(f.get('postcode') || '').trim() || undefined,
      gemeente: String(f.get('gemeente') || '').trim() || undefined,
      type_werk: inhoud.divisie,
      /* "Aanvraag gratis dakinspectie" of "Aanvraag gratis plaatsbezoek", met de
         ingevulde keuzelijsten erachter (alleen wat de bezoeker koos). */
      aanvullende_info: ['Aanvraag ' + (inhoud.cta.naam ?? inhoud.cta.kop).toLowerCase(),
        ...(t.extra ?? []).map((x) => [x.label, String(f.get(x.naam) || '').trim()] as const)
          .filter(([, w]) => w).map(([l, w]) => `${l.replace(/\?$/, '')}: ${w}`)].join(' · '),
      bron_lead: t.bronLead,
    });
    setBezig(false);
    if (!res.ok) { setFout(leadFoutmelding(res, CONTACT.phone.display)); return; }
    /* Zonder toestemming voor marketing eerst de vraag uit Toestemming.tsx, dan pas de bedankpagina. */
    if (allowsMarketing()) naarBedankt();
    else setVraagToestemming(true);
  };
  const naarBedankt = () => navigate('/bedankt?dienst=' + inhoud.bedanktSlug);

  if (vraagToestemming) {
    return (
      <div className="kgj-reken kgj-reken--inspectie">
        <Toestemming verder={naarBedankt} />
      </div>
    );
  }

  return (
    <div className={`kgj-reken kgj-reken--inspectie${t.extra?.length ? ' kgj-reken--extra' : ''}`}>
      <form className="kgj-reken__form" onSubmit={verstuur} onFocus={meldStart} noValidate>
        {t.kop && <p className="kgj-reken__vraag">{t.kop}</p>}
        {pb ? (
          /* 5 okt (totaalrenovatie en renovatiewerken): Mohammeds velden in zijn volgorde en met
             zijn labels. Het gsm-nummer blijft het enige verplichte veld (sterretje). */
          <>
            <label>{pb.naam}<input name="naam" type="text" autoComplete="name" placeholder={pb.naamHint} /></label>
            <label>{pb.email}<input name="email" type="email" autoComplete="email" inputMode="email" placeholder={pb.emailHint} /></label>
            <label>{pb.gsm} *{pb.gsmUitleg && <> <span className="kgj-reken__uitleg">{pb.gsmUitleg}</span></>}
              <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder={pb.gsmHint} aria-required="true" />
            </label>
            <PostcodeGemeente label={pb.postcode} hint={pb.postcodeHint} />
          </>
        ) : (
          <>
            <label>Telefoon *
              <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder="04xx xx xx xx"
                aria-required="true" />
            </label>
            <div className="kgj-reken__rij">
              <label>Naam<input name="naam" type="text" autoComplete="name" placeholder="Uw naam" /></label>
              <PostcodeGemeente />
            </div>
          </>
        )}
        {t.extra && t.extra.length > 0 && (
          <div className="kgj-reken__rij kgj-reken__rij--extra">
            {t.extra.map((x) => (
              <label key={x.naam}>{x.label}
                <select name={x.naam} defaultValue="">
                  <option value="">Maak een keuze</option>
                  {x.opties.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            ))}
          </div>
        )}
        <button className="kgj-knop kgj-knop--vol kgj-reken__knop" type="submit" disabled={bezig}>
          {bezig ? 'Bezig…' : t.knop}
          {/* 5 okt, definitieve totaalrenovatie: zijn ➔ achter de tekst. */}
          {!bezig && t.knopPijl && (
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
          )}
        </button>
        {t.vertrouwen ? (
          /* 5 okt: drie geruststellingen met een icoon direct onder de knop. */
          <>
          {fout && <p className="kgj-reken__fout" role="alert">{fout}</p>}
          <ul className="kgj-reken__gerustlijst">
            {t.vertrouwen.map((v) => (
              <li key={v.tekst}>{VERTROUWEN_ICOON[v.icoon]}<span>{v.tekst}</span></li>
            ))}
          </ul>
          </>
        ) : (
          <>
            <p className="kgj-reken__gerust">{t.onder}</p>
            {fout && <p className="kgj-reken__fout" role="alert">{fout}</p>}
            <button type="button" className="kgj-reken__alt" onClick={opPrijs}>{t.alt}</button>
            <p className="kgj-reken__privacy">Wij gebruiken uw gegevens alleen voor deze aanvraag. <a href="/privacy">Privacybeleid</a></p>
          </>
        )}
      </form>
    </div>
  );
}
