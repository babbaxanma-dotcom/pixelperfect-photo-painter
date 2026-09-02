import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import { IcCamera, IcPijl } from './Iconen';

import basisWc from '@/assets/schetser/b-wc.jpg';
import basisGeenWc from '@/assets/schetser/b-geenwc.jpg';
import tAntraciet from '@/assets/schetser/t-antraciet.jpg';
import tMarmer from '@/assets/schetser/t-marmer.jpg';
import tZandsteen from '@/assets/schetser/t-zandsteen.jpg';
import tHout from '@/assets/schetser/t-hout.jpg';
import tMicro from '@/assets/schetser/t-micro.jpg';
import gAntraciet from '@/assets/schetser/g-antraciet.jpg';
import gMarmer from '@/assets/schetser/g-marmer.jpg';
import gZandsteen from '@/assets/schetser/g-zandsteen.jpg';
import gHout from '@/assets/schetser/g-hout.jpg';
import gMicro from '@/assets/schetser/g-micro.jpg';

/**
 * Ontwerp uw eigen badkamer.
 *
 * De bezoeker geeft eerst op hoe groot zijn badkamer is en of het toilet erin
 * zit. Daarmee verschijnt de voorbeeldruimte die het dichtst bij zijn situatie
 * ligt, met standaarduitrusting erin. Daarna vult hij zelf aan.
 *
 * Waarom het beeld op grootte en toilet reageert en niet op elke keuze: elk
 * beeld moet vooraf gemaakt en nagekeken worden. Grootte maal toilet is zes
 * beelden; daar de vier smaakassen bij optellen zou 192 beelden vragen. Die
 * keuzes gaan daarom mee in de aanvraag in plaats van in het beeld. De
 * samenvatting rechts laat elke klik wél meteen landen, zodat de bezoeker ziet
 * dat zijn keuze geregistreerd is.
 *
 * In elke keuzelijst staat onderaan "staat er niet tussen". Wie dat kiest,
 * beschrijft het zelf in het veld eronder — dat is precies de bezoeker die het
 * meest waard is om te bellen.
 */
type Ruimte = { sleutel: string; naam: string; onder: string };
type Optie = { waarde: string; label: string };
type As = { sleutel: string; vraag: string; opties: Optie[] };

const RUIMTES: Ruimte[] = [
  { sleutel: 'klein', naam: 'Klein', onder: 'ongeveer 4 m²' },
  { sleutel: 'middel', naam: 'Gemiddeld', onder: 'ongeveer 6 m²' },
  { sleutel: 'ruim', naam: 'Ruim', onder: '9 m² of meer' },
];

/**
 * De beeldenbank.
 *
 * Elk beeld is AFGELEID van hetzelfde basisbeeld, niet los gemaakt. Alleen zo
 * blijven hoek, raam, bad, meubel en kranen exact gelijk en verandert er echt
 * maar één ding. Losse generaties gaven zes verschillende kamers — daar viel
 * niets mee te vergelijken.
 *
 * De sleutel is toilet + tegelkeuze, en beide takken zijn nu volledig: elke
 * look bestaat met en zonder toilet. Wie "geen toilet" koos zag eerder bij vijf
 * van de zes looks de betonlook-basis met een uitleg eronder; dat was eerlijk,
 * maar het beloofde iets anders dan het toonde.
 *
 * De terugval blijft in de code staan. Komt er een look bij zonder dat beide
 * beelden gemaakt zijn, dan toont de schetser liever een ander beeld met een
 * eerlijk onderschrift dan een gebroken plaatje.
 *
 * Elk beeld is gemaakt met onderzochte materiaalregels: tegelformaat, voegmaat
 * en -kleur, legverband, glansgraad en hoeveel de tegels onderling verschillen.
 * Zonder die regels tekent een generator marmer dat over de voegen doorloopt en
 * houtlook in plankbreedtes die niet bestaan.
 */
const STANDAARDTEGEL = 'Betonlook grijs';

const BEELDEN: Record<string, string> = {
  'wc|Betonlook grijs': basisWc,
  'wc|Antraciet': tAntraciet,
  'wc|Marmerlook wit': tMarmer,
  'wc|Beige zandsteen': tZandsteen,
  'wc|Houtlook': tHout,
  'wc|Microcement': tMicro,
  'geenwc|Betonlook grijs': basisGeenWc,
  'geenwc|Antraciet': gAntraciet,
  'geenwc|Marmerlook wit': gMarmer,
  'geenwc|Beige zandsteen': gZandsteen,
  'geenwc|Houtlook': gHout,
  'geenwc|Microcement': gMicro,
};

const NIET_ERTUSSEN = 'anders';

/**
 * Welk beeld hoort bij deze keuze, en klopt het met wat er gevraagd werd.
 *
 * Apart en puur, zodat het vangnet toetsbaar blijft. In de pagina bestaat elke
 * combinatie, dus valt er niets terug en kan een browsercheck niet bewijzen dat
 * de terugval nog werkt. Met een onvolledige beeldenbank kan dat hier wel.
 */
/** Alleen voor de test: zo kan die de echte bank toetsen zonder hem te kopieren. */
export const BEELDEN_TEST = BEELDEN;

export function kiesBeeld(
  toiletdeel: string,
  tegelkeuze: string | undefined,
  bank: Record<string, string> = BEELDEN,
) {
  const gevraagd = tegelkeuze && tegelkeuze !== NIET_ERTUSSEN ? tegelkeuze : STANDAARDTEGEL;
  const getoond = bank[`${toiletdeel}|${gevraagd}`] ? gevraagd : STANDAARDTEGEL;
  return { gevraagd, getoond, beeld: bank[`${toiletdeel}|${getoond}`] };
}

const ASSEN: As[] = [
  { sleutel: 'Tegels', vraag: 'Tegels', opties: [
    { waarde: 'Betonlook grijs', label: 'Betonlook grijs' },
    { waarde: 'Antraciet', label: 'Antraciet' },
    { waarde: 'Marmerlook wit', label: 'Marmerlook wit' },
    { waarde: 'Beige zandsteen', label: 'Beige zandsteen' },
    { waarde: 'Houtlook', label: 'Houtlook' },
    { waarde: 'Microcement', label: 'Microcement (naadloos)' },
  ] },
  { sleutel: 'Meubel', vraag: 'Wastafelmeubel', opties: [
    { waarde: 'Eiken', label: 'Eiken' },
    { waarde: 'Walnoot', label: 'Walnoot' },
    { waarde: 'Mat wit', label: 'Mat wit' },
    { waarde: 'Antraciet', label: 'Antraciet' },
    { waarde: 'Dubbele lavabo', label: 'Dubbele lavabo' },
  ] },
  { sleutel: 'Kranen', vraag: 'Kranen en douchewand', opties: [
    { waarde: 'Mat zwart', label: 'Mat zwart' },
    { waarde: 'Chroom', label: 'Chroom' },
    { waarde: 'Geborsteld goud', label: 'Geborsteld goud' },
    { waarde: 'RVS', label: 'RVS' },
  ] },
  { sleutel: 'Douche of bad', vraag: 'Douche of bad', opties: [
    { waarde: 'Inloopdouche', label: 'Inloopdouche' },
    { waarde: 'Bad', label: 'Ligbad' },
    { waarde: 'Bad en douche', label: 'Bad én aparte douche' },
    { waarde: 'Indeling houden', label: 'Indeling houden zoals ze is' },
  ] },
  { sleutel: 'Verwarming', vraag: 'Verwarming', opties: [
    { waarde: 'Handdoekradiator', label: 'Handdoekradiator' },
    { waarde: 'Vloerverwarming', label: 'Vloerverwarming' },
    { waarde: 'Beide', label: 'Allebei' },
    { waarde: 'Weet ik niet', label: 'Weet ik nog niet' },
  ] },
];

/** Verkleint een foto in de browser: sneller op 4G en genoeg om te beoordelen. */
async function verklein(bestand: File): Promise<string> {
  const beeld = await createImageBitmap(bestand, { imageOrientation: 'from-image' });
  const schaal = Math.min(1, 1400 / Math.max(beeld.width, beeld.height));
  const doek = document.createElement('canvas');
  doek.width = Math.round(beeld.width * schaal);
  doek.height = Math.round(beeld.height * schaal);
  doek.getContext('2d')!.drawImage(beeld, 0, 0, doek.width, doek.height);
  return doek.toDataURL('image/jpeg', 0.8);
}

export default function Schetser() {
  const navigate = useNavigate();
  const [grootte, setGrootte] = useState<string | null>(null);
  const [wc, setWc] = useState<boolean | null>(null);
  const [keuzes, setKeuzes] = useState<Record<string, string>>({});
  const [toelichting, setToelichting] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const gemeld = useRef(false);
  const camera = useRef<HTMLInputElement>(null);
  const galerij = useRef<HTMLInputElement>(null);

  const gekozenRuimte = grootte !== null && wc !== null;

  /* Het beeld reageert op het toilet en op de tegelkeuze. Bestaat die
     combinatie nog niet, dan valt hij terug op de basisafwerking en zegt het
     onderschrift dat er iets anders te zien is dan wat er gekozen werd. */
  const tegelkeuze = keuzes['Tegels'];
  const toiletdeel = wc ? 'wc' : 'geenwc';
  const { gevraagd, getoond, beeld: gekozenBeeld } = kiesBeeld(toiletdeel, tegelkeuze);
  const beeld = gekozenRuimte ? gekozenBeeld : null;
  const ietsAnders = useMemo(
    () => Object.values(keuzes).some((v) => v === NIET_ERTUSSEN), [keuzes]);

  const meldStart = () => {
    if (gemeld.current) return;
    gemeld.current = true;
    trackFormStart('lp:badkamerrenovatie:schetser');
  };

  const neemFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const bestand = e.target.files?.[0];
    e.target.value = '';
    if (!bestand) return;
    meldStart();
    try { setFoto(await verklein(bestand)); }
    catch { setFout('Die foto konden we niet lezen. Probeer er een met de camera.'); }
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const telefoon = String(f.get('telefoon') || '').trim();
    /* Dezelfde drempel als de lead-pijplijn zelf: acht cijfers. Een voorkant
       die iets doorlaat wat de achterkant weigert, laat de bezoeker denken dat
       hij verstuurd heeft terwijl er niets aankomt. */
    if (telefoon.replace(/\D/g, '').length < 8) {
      setFout('Vul uw telefoonnummer in. Wij bellen u met het ontwerp.');
      return;
    }
    setFout(null);
    setBezig(true);

    const ruimte = RUIMTES.find((r) => r.sleutel === grootte);
    const samenvatting = [
      ruimte && `Grootte: ${ruimte.naam} (${ruimte.onder})`,
      wc !== null && `Toilet in de badkamer: ${wc ? 'ja' : 'nee'}`,
      ...ASSEN.map((a) => keuzes[a.sleutel]
        && `${a.sleutel}: ${keuzes[a.sleutel] === NIET_ERTUSSEN ? 'iets anders' : keuzes[a.sleutel]}`),
      toelichting.trim() && `Eigen wens: ${toelichting.trim()}`,
      foto && 'Bezoeker heeft een foto van zijn badkamer meegestuurd.',
    ].filter(Boolean).join(' · ');

    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: 'ab_bad__wellness',
      firstName: String(f.get('naam') || '').trim() || undefined,
      email: String(f.get('email') || '').trim(),
      phone: telefoon,
      type_werk: 'ab_bad__wellness',
      aanvullende_info: samenvatting,
      bron_lead: 'lp:badkamerrenovatie:schetser',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=badkamerrenovatie');
    else setFout('Versturen lukte niet. Bel gerust ' + CONTACT.phone.display + '.');
  };

  return (
    <section className="pc-schets" id="schetser">
      <div className="pc-vat pc-midden">
        <h2 className="pc-h2--midden">Ontwerp uw<br />eigen badkamer</h2>
        <p className="pc-schets-sub">
          <strong>Gratis ontwerp, in enkele ogenblikken.</strong> Geef aan hoe groot uw badkamer
          is en wat u in gedachten hebt.
        </p>
      </div>

      <div className="pc-vat pc-schets-grid">
        <div>
          {/* Stap 1, pas als grootte én toilet ingevuld zijn, verschijnt de
              ruimte die het dichtst bij zijn badkamer ligt. */}
          <div className="pc-schets-as">
            <h3>Hoe groot is uw badkamer?</h3>
            <div className="pc-schets-keuzes">
              {RUIMTES.map((r) => (
                <button key={r.sleutel} type="button"
                  className={grootte === r.sleutel ? 'is-aan' : undefined}
                  aria-pressed={grootte === r.sleutel}
                  onClick={() => { setGrootte(r.sleutel); meldStart(); }}>
                  <strong>{r.naam}</strong>
                  <span>{r.onder}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pc-schets-as">
            <h3>Zit het toilet in de badkamer?</h3>
            <div className="pc-schets-keuzes pc-schets-keuzes--twee">
              {[true, false].map((v) => (
                <button key={String(v)} type="button"
                  className={wc === v ? 'is-aan' : undefined}
                  aria-pressed={wc === v}
                  onClick={() => { setWc(v); meldStart(); }}>
                  <strong>{v ? 'Ja' : 'Nee'}</strong>
                  <span>{v ? 'toilet staat erin' : 'apart toilet'}</span>
                </button>
              ))}
            </div>
          </div>

          {gekozenRuimte && (
            <>
              {ASSEN.map((as) => (
                <label className="pc-schets-lijst" key={as.sleutel}>
                  <span>{as.vraag}</span>
                  <select value={keuzes[as.sleutel] ?? ''}
                    onChange={(e) => { setKeuzes((v) => ({ ...v, [as.sleutel]: e.target.value })); meldStart(); }}>
                    <option value="" disabled>Kies…</option>
                    {as.opties.map((o) => <option key={o.waarde} value={o.waarde}>{o.label}</option>)}
                    <option value={NIET_ERTUSSEN}>Staat er niet tussen</option>
                  </select>
                </label>
              ))}

              {ietsAnders && (
                <label className="pc-schets-lijst">
                  <span>Wat had u in gedachten?</span>
                  <textarea rows={3} value={toelichting} onChange={(e) => setToelichting(e.target.value)}
                    placeholder="Beschrijf het gerust in uw eigen woorden." />
                </label>
              )}
            </>
          )}
        </div>

        <div>
          <figure className={`pc-schets-beeld${beeld ? '' : ' is-leeg'}`}>
            {beeld
              ? <img src={foto ?? beeld} alt={foto ? 'Uw badkamer' : 'Voorbeeldruimte'} />
              : <p>Kies eerst de grootte en of het toilet erin zit.</p>}
            {beeld && (
              <figcaption>
                {foto
                  ? 'Uw foto'
                  : getoond === gevraagd
                    ? `Voorbeeldruimte, ${getoond.toLowerCase()}`
                    : `Voorbeeldruimte in ${getoond.toLowerCase()}. Uw keuze noteren wij bij de aanvraag.`}
              </figcaption>
            )}
          </figure>

          {gekozenRuimte && (
            <>
              <div className="pc-schets-opname">
                <button type="button" className="pc-schets-cam" onClick={() => camera.current?.click()}>
                  <span aria-hidden="true"><IcCamera maat={22} /></span>
                  {foto ? 'Andere foto maken' : 'Foto van uw badkamer maken'}
                </button>
                <button type="button" className="pc-schets-uit" onClick={() => galerij.current?.click()}>
                  of kies er een uit uw toestel
                </button>
              </div>
              <input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={neemFoto} />
              <input ref={galerij} type="file" accept="image/*" hidden onChange={neemFoto} />

              <form className="pc-schets-form" onSubmit={verstuur} onFocusCapture={meldStart}>
                <h3>Waar mogen wij uw ontwerp naartoe sturen?</h3>
                <label className="pc-veld"><input name="naam" type="text" placeholder="Naam" autoComplete="name" aria-label="Naam" /></label>
                <label className="pc-veld"><input name="telefoon" type="tel" placeholder="Telefoon" autoComplete="tel"
                  aria-label="Telefoon (verplicht)" aria-required="true" /></label>
                <label className="pc-veld"><input name="email" type="email" placeholder="E-mail" autoComplete="email" aria-label="E-mail" /></label>
                <button className="pc-knop pc-knop--accent" type="submit" disabled={bezig}>
                  {bezig ? 'Bezig…' : 'Stuur mijn ontwerp'}<IcPijl />
                </button>
                {fout && <p className="pc-schets-fout">{fout}</p>}
                <p className="pc-schets-gerust">
                  <strong>Volledig vrijblijvend en kosteloos.</strong> Uw foto gebruiken wij alleen
                  om uw ontwerp te maken.
                </p>
              </form>

              <a className="pc-knop pc-knop--rand pc-schets-bezoek" href="#contact">
                Of vraag meteen een gratis plaatsbezoek aan<IcPijl />
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
