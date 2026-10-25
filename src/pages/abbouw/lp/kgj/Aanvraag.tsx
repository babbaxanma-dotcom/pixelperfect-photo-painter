import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, BadgePercent, CalendarCheck, Check, ClipboardCheck, Clock, Hammer, Home, Plus, ShieldCheck, UserCheck } from 'lucide-react';
import { Icoon } from './Iconen';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { allowsMarketing } from '@/lib/consent';
import { meldClarity } from '@/lib/clarity';
import { CONTACT } from '@/data/contact';
import type { KgjInhoud } from './inhoud';
import PostcodeGemeente from './PostcodeGemeente';
import Toestemming from './Toestemming';

/* Google-G en ster voor de trustrij (zelfde tekening als Rekenaar.tsx en LpBf.tsx). */
const IcGoogle = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.7 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);
const IcSter = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L10 15l-5.4 2.9 1.1-6.1L1.2 7.6l6.1-.8z" /></svg>
);
/* Huis met vergrootglas: de inspectie (bfbouw.be lp-dak.cjs ICO.inspectie), in de lijnstijl van de kaartkop. */
const IcInspectie = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 11 12 4l8.5 7" /><path d="M6 9.5V19h4.5" /><circle cx="15.5" cy="15.5" r="3.6" /><path d="m18.2 18.2 2.6 2.6" />
  </svg>
);

/**
 * De aanvraagkaart bovenaan de landingspagina (19 okt 2026, opdracht Mohammed: "bouw de abgroep totaalrenovatie en
 * dakwerken lp naar de nieuwe, dus rekenaar weg, en doe dat naar dakinspectie en gratis plaatsbezoek form bovenaan").
 *
 * "De nieuwe" = bfbouw.be/lp/dakwerken (bouw/lp-dak.cjs maakKaart, src/js/site.js data-inspectiekaart): eerst een paar
 * klikvragen, één tik = antwoord en meteen de volgende vraag, Terug kan altijd; daarna de contactstap. Geen prijs, geen
 * calculator. De opmaak en het tikgedrag zijn die van Rekenaar.tsx (klassen kgj-reken__*, druktoestand, 200 ms tegen een
 * dubbele tik, de kop terug in beeld na elke stap), zodat de kaart eruitziet zoals de rekenaar die hier stond.
 *
 * Versturen gaat exact zoals Inspectie.tsx (het formulier onderaan): submitLead met bron_lead = inhoud.inspectie.bronLead.
 * GHL en de belassistent routeren op die waarde, dus de kaart en het formulier onderaan geven dezelfde bron.
 * aanvullende_info = "Aanvraag gratis dakinspectie" (of plaatsbezoek), gevolgd door "Sleutel: antwoord" per vraag.
 * Daarna de vraag uit Toestemming.tsx (zonder marketingtoestemming) en de bedankpagina, zoals Inspectie.
 *
 * Draagt kgj-reken: de vaste balk op de telefoon (LpBf) verdwijnt zodra de kaart in beeld staat.
 */
/* Badges (22 okt 2026, /lp/totaalrenovatie en /lp/dakwerken): elk vinkje een icoon dat bij zijn tekst past. Een tekst die hier
   niet staat, krijgt het icoon van zijn plaats. Ook gebruikt voor de vinkjes onder de kaart op de telefoon (LpBf). */
const BADGE_PER_TEKST: Record<string, typeof Check> = {
  'Vaste prijs vooraf': ShieldCheck, 'Eén vast aanspreekpunt': UserCheck, 'Vakmanschap tot in de details': Award,
  'Gratis & vrijblijvende dakinspectie': ClipboardCheck, '6% btw-tarief (woningen > 10 jaar)': BadgePercent,
};
export const badgeIcoon = (tekst: string, i: number) => BADGE_PER_TEKST[tekst] ?? [ShieldCheck, UserCheck, Award][i] ?? Check;

export default function Aanvraag({ inhoud, voor, boven, plek = 'hero' }: {
  inhoud: KgjInhoud;
  /** hero = de kaart bovenaan (form_start-label met :hero, Clarity aanvraag-*); onder = dezelfde kaart in het slotblok
      (#contact, 22 okt 2026: "onderaan bij plaatsbezoek de form zo dat je makkelijk kan klikken"): form_start-label = de
      bron_lead zelf, zoals het formulier van Inspectie.tsx dat daar had, en eigen Clarity-events (aanvraag-onder-*). */
  plek?: 'hero' | 'onder';
  /** Message match (LpBf match.voor): past dit bij vraag 1, dan begint de kaart bij vraag 2 met dat antwoord. */
  voor?: { sleutel: string; label: string };
  /** Optioneel onder de kaartkop: het eerstvolgende vrije plaatsbezoek (VrijMoment in LpBf). */
  boven?: React.ReactNode;
}) {
  const a = inhoud.aanvraag!;
  const t = inhoud.inspectie;
  const VRAGEN = a.vragen;
  const navigate = useNavigate();
  const vooraf = voor && VRAGEN[0]?.sleutel === voor.sleutel && VRAGEN[0].keuzes.some((k) => k.label === voor.label) ? voor : undefined;
  const [stap, setStap] = useState(vooraf ? 1 : 0);
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>(vooraf ? { [vooraf.sleutel]: vooraf.label } : {});
  const [bezig, setBezig] = useState(false);
  const verstuurt = useRef(false);
  const [fout, setFout] = useState<string | null>(null);
  const [vraagToestemming, setVraagToestemming] = useState(false);
  const gestart = useRef(false);
  const kaart = useRef<HTMLDivElement>(null);
  const vorigeStap = useRef(stap);
  const versteStap = useRef(stap);

  const onder = plek === 'onder';
  const clarityNaam = onder ? 'aanvraag-onder' : 'aanvraag';
  const klaar = stap >= VRAGEN.length;
  /* De contactstap telt mee: "Stap 1 van 5" bij vier vragen. De balk staat bij het laden al op de eerste stap. */
  const totaal = VRAGEN.length + 1;
  const nu = Math.min(stap, VRAGEN.length) + 1;

  /* Na elke stap (ook Terug) de kop van de kaart terug in beeld als hij onder de vaste kop of boven het scherm viel
     (Rekenaar.tsx, Mohammed 1 okt: "paar pixels naar onder ... waardoor je de form kwijtraakt"). De nieuwe vraag krijgt
     de focus zonder te scrollen (zoals bfbouw.be focusVraag): een schermlezer verliest zijn plek niet. */
  useEffect(() => {
    if (vorigeStap.current === stap) return;
    vorigeStap.current = stap;
    const el = kaart.current;
    if (!el) return;
    const vraag = el.querySelector<HTMLElement>('.kgj-reken__stap .kgj-reken__vraag');
    if (vraag) { vraag.setAttribute('tabindex', '-1'); vraag.focus({ preventScroll: true }); }
    const kop = el.querySelector<HTMLElement>('.kgj-reken__kop') ?? el;
    const gedrag: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const balkH = document.querySelector('.kgj-kop')?.getBoundingClientRect().height ?? 0;
    if (kop.getBoundingClientRect().top >= balkH + 4) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - balkH - 8, behavior: gedrag });
  }, [stap]);

  /* Clarity: de verste stap van deze bezoeker (Terug telt niet), zoals de rekenaar dat deed. */
  useEffect(() => {
    if (stap <= versteStap.current) return;
    versteStap.current = stap;
    meldClarity(stap >= VRAGEN.length ? `${clarityNaam}-contact` : `${clarityNaam}-vraag-${stap + 1}`);
  }, [stap, VRAGEN.length, clarityNaam]);

  /* De eerste tik telt als start van het formulier (GA4 form_start). Eigen label voor de kaart bovenaan, zodat in GA4
     te zien is welk formulier begonnen werd; de bron in GHL (bron_lead) blijft die van het formulier onderaan. */
  const meldStart = () => {
    if (gestart.current) return;
    gestart.current = true;
    trackFormStart(onder ? t.bronLead : `${t.bronLead}:hero`);
  };

  /* Tik = antwoord + volgende vraag (Rekenaar.tsx, Mohammed 25 sep): het antwoord kleurt op zodra de vinger het raakt,
     een tweede tik binnen 200 ms telt niet (een dubbele tik slaat geen vraag over). */
  const [druk, setDruk] = useState<string | null>(null);
  const laatsteTik = useRef(0);
  const kies = (sleutel: string, label: string) => {
    const tijd = Date.now();
    if (tijd - laatsteTik.current < 200) return;
    laatsteTik.current = tijd;
    setDruk(null);
    meldStart();
    setAntwoorden((x) => ({ ...x, [sleutel]: label }));
    setStap((s) => s + 1);
  };

  /* Afvinkvraag (22 okt 2026, /lp/totaalrenovatie: "die vraag van dat ze mooi kunnen aanklikken wat er allemaal nodig is, makkelijk
     en gebruiksvriendelijk"): zelfde gedrag als de afvinkvraag van de rekenaar (Rekenaar.tsx vink/verder). Alles vinkt alles aan of
     uit; Volgende pas met minstens één vinkje; het antwoord is de lijst, of het label van Alles als alles aan staat. */
  const [vinken, setVinken] = useState<Record<string, string[]>>({});
  const vink = (v: (typeof VRAGEN)[number], label: string | null) => {
    meldStart();
    const alle = v.keuzes.map((k) => k.label);
    setVinken((o) => {
      const nu = o[v.sleutel] ?? [];
      const volgend = label === null
        ? (nu.length === alle.length ? [] : alle)
        : nu.includes(label) ? nu.filter((l) => l !== label) : alle.filter((l) => l === label || nu.includes(l));
      return { ...o, [v.sleutel]: volgend };
    });
  };
  const verder = (v: (typeof VRAGEN)[number]) => {
    const gekozen = vinken[v.sleutel] ?? [];
    if (!gekozen.length || !v.afvinken) return;
    setAntwoorden((x) => ({ ...x, [v.sleutel]: gekozen.length === v.keuzes.length ? v.afvinken!.alles : gekozen.join(', ') }));
    setStap((s) => s + 1);
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (verstuurt.current) return;
    const f = new FormData(e.currentTarget);
    const telefoon = String(f.get('telefoon') || '').trim();
    /* 20 okt 2026 (Mohammed: de bevestigings-sms begint met "Dag {{voornaam}},"): de naam is hier verplicht, zoals op
       bfbouw.be. Zonder naam stond er "Dag ,". De controle staat vóór die van de gsm: de velden staan in die volgorde. */
    if (!String(f.get('naam') || '').trim()) { setFout('Vul uw naam in.'); return; }
    /* Dezelfde controle en meldingen als Inspectie.tsx: leeg = fout, minder dan acht cijfers = fout. */
    const cijfers = telefoon.replace(/\D/g, '').length;
    if (!telefoon) { setFout('Vul uw telefoonnummer in. Wij bellen u om een moment af te spreken.'); return; }
    if (cijfers < 8) { setFout('Dat telefoonnummer lijkt niet volledig. Controleer het even.'); return; }
    setFout(null);
    verstuurt.current = true;
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
      /* "Aanvraag gratis dakinspectie · Dak: Hellend dak · Werk: ..." (zelfde begin als Inspectie.tsx). */
      aanvullende_info: ['Aanvraag ' + (inhoud.cta.naam ?? inhoud.cta.kop).toLowerCase(),
        ...VRAGEN.filter((v) => antwoorden[v.sleutel]).map((v) => `${v.sleutel}: ${antwoorden[v.sleutel]}`)].join(' · '),
      bron_lead: t.bronLead,
    });
    setBezig(false);
    if (!res.ok) { verstuurt.current = false; setFout(leadFoutmelding(res, CONTACT.phone.display)); return; }
    meldClarity(`${clarityNaam}-verstuurd`);
    /* Zonder toestemming voor marketing eerst de vraag uit Toestemming.tsx, dan pas de bedankpagina. */
    if (allowsMarketing()) naarBedankt();
    else setVraagToestemming(true);
  };
  const naarBedankt = () => navigate('/bedankt/' + inhoud.bedanktSlug);

  const vraag = VRAGEN[stap];
  /* Welke velden de contactstap naast Naam en Gsm heeft (renovatiepagina's: alleen die twee). Standaard beide aan. */
  const metEmail = a.contactVelden?.email !== false;
  const metPostcode = a.contactVelden?.postcode !== false;
  /* "Bijna klaar! Bevestig uw gratis dakinspectie": het eerste deel op een eigen regel in de merkkleur (bfbouw.be rk__bijna). */
  const band = a.contactKop.match(/^(Bijna klaar!)\s+(.+)$/);

  return (
    <div ref={kaart} className={`kgj-reken kgj-reken--aanvraag${onder ? ' kgj-reken--onder' : ''}${a.badges ? ' kgj-reken--badges' : ''}${klaar ? ' is-contact' : ''}`}>
      <div className="kgj-reken__hoofd">
        <span className="kgj-reken__logo" aria-hidden="true"><IcInspectie /></span>
        <div>
          <p className="kgj-reken__titel">{a.titel}</p>
          <p className="kgj-reken__tijd"><Clock aria-hidden="true" />{a.tijd}</p>
        </div>
      </div>
      {boven}
      <div className="kgj-reken__weg" aria-hidden="true">
        <Home className="kgj-reken__begin" />
        <div className="kgj-reken__balk"><i style={{ width: `${(nu / totaal) * 100}%` }} /></div>
        <span className={`kgj-reken__eind${klaar ? ' is-aan' : ''}`}><Check /></span>
      </div>
      {/* Na een verstuurde aanvraag geen Terug meer: terug naar een vraag zou doen alsof er nog niets verstuurd is. */}
      {!vraagToestemming && (
        <div className="kgj-reken__kop">
          <span className="kgj-reken__tel" aria-live="polite">Stap {nu} van {totaal}</span>
          {stap > 0 && (
            <button type="button" className="kgj-reken__terug" onClick={() => { setFout(null); setStap((s) => s - 1); }}>‹ Terug</button>
          )}
        </div>
      )}

      {vraagToestemming ? (
        <Toestemming verder={naarBedankt} />
      ) : !klaar && vraag.afvinken ? (() => {
        const gekozen = vinken[vraag.sleutel] ?? [];
        const alles = gekozen.length === vraag.keuzes.length;
        return (
          <div className="kgj-reken__stap" key={stap}>
            <p className="kgj-reken__vraag kgj-reken__vraag--vink">{vraag.vraag}</p>
            <p className="kgj-reken__meer">Meerdere keuzes mogelijk</p>
            <div className="kgj-reken__vinken" role="group" aria-label={vraag.vraag}>
              <button type="button" role="checkbox" aria-checked={alles}
                className={`kgj-reken__vink kgj-reken__vink--alles${alles ? ' is-aan' : ''}`} onClick={() => vink(vraag, null)}>
                <i className="kgj-reken__vakje" aria-hidden="true"><Check /></i>{vraag.afvinken.alles}
              </button>
              {[...new Set(vraag.keuzes.map((k) => k.groep ?? ''))].map((groep) => (
                <div className="kgj-reken__groep" key={groep}>
                  {groep && <p className="kgj-reken__groepnaam">{groep}</p>}
                  <div className="kgj-reken__chips">
                    {vraag.keuzes.filter((k) => (k.groep ?? '') === groep).map((k) => {
                      const aan = gekozen.includes(k.label);
                      return (
                        <button type="button" role="checkbox" aria-checked={aan} key={k.label}
                          className={`kgj-reken__vink kgj-reken__vink--chip${aan ? ' is-aan' : ''}`} onClick={() => vink(vraag, k.label)}>
                          {aan ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}{k.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {vraag.afvinken.tip && vraag.afvinken.tip.bij.some((b) => gekozen.includes(b)) && (
              <p className="kgj-reken__tip"><BadgePercent aria-hidden="true" />{vraag.afvinken.tip.tekst}</p>
            )}
            <button type="button" className="kgj-knop kgj-knop--vol kgj-reken__verder" disabled={!gekozen.length} onClick={() => verder(vraag)}>
              {gekozen.length ? <>Volgende<ArrowRight aria-hidden="true" /></> : 'Vink minstens één onderdeel aan'}
            </button>
          </div>
        );
      })() : !klaar ? (
        <div className="kgj-reken__stap" key={stap}>
          <p className="kgj-reken__vraag">{vraag.vraag}</p>
          <div className={`kgj-reken__keuzes${vraag.keuzes.length % 2 === 1 ? ' kgj-reken__keuzes--oneven' : ''}${vraag.raster ? ' kgj-reken__keuzes--raster' : ''}${vraag.lijst ? ' kgj-reken__keuzes--lijst' : ''}`}>
            {vraag.keuzes.map((k) => (
              <button type="button" key={k.label}
                className={`kgj-reken__keuze${k.icoon ? ' kgj-reken__keuze--icoon' : ''}${antwoorden[vraag.sleutel] === k.label ? ' is-aan' : ''}${druk === k.label ? ' is-druk' : ''}`}
                onPointerDown={() => setDruk(k.label)}
                onPointerUp={() => setDruk(null)}
                onPointerCancel={() => setDruk(null)}
                onPointerLeave={() => setDruk(null)}
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
        </div>
      ) : (
        <div className="kgj-reken__stap" key="contact">
          <form className="kgj-reken__form kgj-reken__contact" onSubmit={verstuur} noValidate>
            <div className="kgj-reken__band">
              <p className="kgj-reken__vraag kgj-reken__vraag--band">
                {band ? <><span className="kgj-reken__bijna">{band[1]}</span> {band[2]}</> : a.contactKop}
              </p>
            </div>
            {/* De zin onder "Bijna klaar! Bevestig ..." zoals op bfbouw.be (rk__contactsub), in een duidelijk vlak met vinkje. 22 okt 2026,
                Mohammed: "die disclaimer bedoelde ik van wat er al was visueel verbeteren", "laat uw dak vakkundig controleren en vermijd
                onnodige kosten", "dat wat er stond", "doe even overal". */}
            {a.disclaimer && (
              <p className="kgj-reken__disclaimer">
                <Check aria-hidden="true" />
                <span>{a.disclaimer}</span>
              </p>
            )}
            {/* Geen autoFocus: op een telefoon sprong het toetsenbord dan meteen open (Mohammed, 24 sep). */}
            <div className="kgj-reken__rij">
              <label>Naam *<input name="naam" type="text" autoComplete="name" placeholder="Uw naam" aria-required="true" /></label>
              {/* 22 okt 2026, Mohammed: "en doe naam en telefoonnummer", "niet gsm". */}
              <label>Telefoonnummer *
                <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder="04xx xx xx xx" aria-required="true" />
              </label>
            </div>
            {(metPostcode || metEmail) && (
              <div className="kgj-reken__rij">
                {/* Korte voorbeeldtekst: op de computer staat het veld in een halve kolom (de standaardhint werd afgekapt). */}
                {metPostcode && <PostcodeGemeente hint="bv. 2830" />}
                {metEmail && <label>E-mail<input name="email" type="email" autoComplete="email" inputMode="email" placeholder="uw@email.be" /></label>}
              </div>
            )}
            {fout && <p className="kgj-reken__fout" role="alert">{fout}</p>}
            <button className="kgj-knop kgj-knop--vol kgj-reken__knop" type="submit" disabled={bezig}>
              {bezig ? 'Bezig…' : <>{t.knop}<ArrowRight aria-hidden="true" /></>}
            </button>
            <p className="kgj-reken__gerust">{t.onder}</p>
            <p className="kgj-reken__privacy">Wij gebruiken uw gegevens alleen voor deze aanvraag. <a href="/privacy">Privacybeleid</a></p>
          </form>
        </div>
      )}

      {a.vertrouwen && a.vertrouwen.length > 0 && (
        <ul className="kgj-reken__vertrouwen">
          {a.vertrouwen.map((v, i) => {
            const Teken = a.badges ? badgeIcoon(v, i) : Check;
            return <li key={v}><Teken aria-hidden="true" />{v}</li>;
          })}
        </ul>
      )}
      {/* Trustrij zoals op de rekenaarkaart (Google 5,0 + sterren, dan de cijfers). Nooit het aantal reviews. */}
      {a.trustrij && (
        <ul className="kgj-reken__trust">
          <li className="kgj-reken__trust-g">
            <span className="kgj-reken__trust-gic"><IcGoogle /></span>
            <span><b>5,0</b><span className="kgj-reken__trust-st" aria-hidden="true"><IcSter /><IcSter /><IcSter /><IcSter /><IcSter /></span></span>
          </li>
          {a.trustrij.map((c) => (
            <li key={c.b + c.s}>
              {a.badges && c.icoon && <span className="kgj-reken__trust-ic" aria-hidden="true">{c.icoon === 'kalender' ? <CalendarCheck /> : c.icoon === 'schild' ? <ShieldCheck /> : <Hammer />}</span>}
              <b>{c.b}</b>{' '}<span>{c.s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
