import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgePercent, Calculator, Check, Clock, Home, Lock, Plus, ShieldCheck } from 'lucide-react';
import { Icoon } from './Iconen';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { allowsMarketing } from '@/lib/consent';
import { CONTACT } from '@/data/contact';
import type { KgjInhoud, Vraag } from './inhoud';
import Toestemming from './Toestemming';

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

export default function Rekenaar({ inhoud, plek, voor }: {
  inhoud: KgjInhoud; plek: 'hero' | 'onder' | 'venster';
  /** Message match: vraag 1 is al beantwoord met wat de bezoeker zocht (plat of hellend dak). */
  voor?: { sleutel: string; label: string };
}) {
  const ALLE = inhoud.rekenaar.vragen;
  const navigate = useNavigate();
  const vooraf = voor && ALLE[0]?.sleutel === voor.sleutel && ALLE[0].keuzes.some((k) => k.label === voor.label) ? voor : undefined;
  const [stap, setStap] = useState(vooraf ? 1 : 0);
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>(vooraf ? { [vooraf.sleutel]: vooraf.label } : {});
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [vraagToestemming, setVraagToestemming] = useState(false);
  const gestart = useRef(false);
  const kaart = useRef<HTMLDivElement>(null);
  const vorigeStap = useRef(stap);

  /* Vragen met een voorwaarde (als) verschijnen pas als de antwoorden waarop ze
     wachten gegeven zijn: de bedekking hangt af van het soort dak én van het
     werk, de vraag naar isolatie komt alleen bij een renovatie. */
  const VRAGEN = ALLE.filter((v) => past(v, antwoorden));
  /* De teller rekent met het langste pad zolang een vraag waarvan het vervolg
     afhangt nog open staat, zodat het totaal nooit oploopt; daarna met het
     echte pad (renovatie 8, herstelling 7, isolatie 6). */
  const AANTAL = langstePad(ALLE, antwoorden);

  const klaar = stap >= VRAGEN.length;

  /* Mohammed, 1 okt: "bij vraag 2 of 3 paar pixels naar onder ... waardoor je de
     form kwijtraakt". Een vraag is soms veel korter dan de vorige (totaalrenovatie:
     vraag 2 is 923 px, vraag 3 620 px op 390 px breed). Wie naar onder scrolde om
     te tikken, zag daarna de kop van de rekenaar niet meer: die viel onder de vaste
     menubalk of boven het scherm. Na elke stap (ook Terug) komt de kop daarom
     terug in beeld, net onder de menubalk, maar alleen als hij verdwenen is. */
  useEffect(() => {
    if (vorigeStap.current === stap) return;
    vorigeStap.current = stap;
    const el = kaart.current;
    if (!el) return;
    const kop = el.querySelector<HTMLElement>('.kgj-reken__kop') ?? el;
    const gedrag: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    /* In het venster ("Bereken uw prijs") scrolt het venster zelf, niet de pagina erachter. */
    const venster = el.closest<HTMLElement>('.kgj-venster__in');
    if (venster) {
      if (kop.getBoundingClientRect().top < venster.getBoundingClientRect().top + 4) venster.scrollTo({ top: 0, behavior: gedrag });
      return;
    }
    const balkH = document.querySelector('.kgj-kop')?.getBoundingClientRect().height ?? 0;
    if (kop.getBoundingClientRect().top >= balkH + 4) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - balkH - 8, behavior: gedrag });
  }, [stap]);
  const totaal = AANTAL + 1;
  const nu = klaar ? totaal : stap + 1;

  /* De eerste tik telt als start van het formulier: in GA4 zie je dan hoeveel
     mensen beginnen tegenover hoeveel er versturen. */
  const meldStart = () => {
    if (gestart.current) return;
    gestart.current = true;
    trackFormStart(`${inhoud.bronLead}:${plek}`);
  };

  /* Mohammed, 25 sep: "op telefoon ... je ziet niet wat je hebt aangeklikt" en
     "na de tik moet het wel gewoon direct doorgaan". Het antwoord kleurt op zodra
     de vinger het raakt (druk, stijl in extra.ts) en bij het loslaten volgt
     meteen de volgende vraag. :active alleen volstaat niet: Chrome op Android
     zet die pas na ongeveer 100 ms vasthouden, dus bij een snelle tik zag je
     niets. Een tweede tik binnen 200 ms telt niet, zodat een dubbele tik geen
     vraag overslaat. */
  const [druk, setDruk] = useState<string | null>(null);
  const laatsteTik = useRef(0);
  const kies = (sleutel: string, label: string) => {
    const nu = Date.now();
    if (nu - laatsteTik.current < 200) return;
    laatsteTik.current = nu;
    setDruk(null);
    meldStart();
    setAntwoorden((a) => ({ ...a, [sleutel]: label }));
    setStap((s) => s + 1);
  };

  /* Afvinkvraag (totaalrenovatie, "Wat wilt u renoveren?"): elke tik zet een
     vakje aan of uit, pas Volgende gaat door. "Alles" vinkt alles aan of alles
     uit; staat alles aan, dan staat ook "Alles" aan. Per vraag bewaard, zodat
     Terug de vinkjes laat staan. */
  const [vinken, setVinken] = useState<Record<string, string[]>>({});
  const vink = (v: Vraag, label: string | null) => {
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
  const verder = (v: Vraag) => {
    const gekozen = vinken[v.sleutel] ?? [];
    if (!gekozen.length || !v.afvinken) return;
    setAntwoorden((a) => ({ ...a, [v.sleutel]: gekozen.length === v.keuzes.length ? v.afvinken!.alles : gekozen.join(', ') }));
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
    if (!res.ok) { setFout(leadFoutmelding(res, CONTACT.phone.display)); return; }
    /* Zonder toestemming voor marketing eerst de vraag uit Toestemming.tsx, dan pas de bedankpagina. */
    if (allowsMarketing()) naarBedankt();
    else setVraagToestemming(true);
  };
  /* van=rekenaar: de bedankpagina toont dan de richtprijs-tekst en de dakinspectie (4 okt). */
  const naarBedankt = () => navigate('/bedankt?dienst=' + inhoud.bedanktSlug + '&van=rekenaar');

  const vraag = VRAGEN[stap];
  /* Na bepaalde antwoorden verschijnt onder de volgende vraag een korte melding
     (de 6% btw na "Hoe oud is uw dak?"), alleen op die ene stap. */
  const vorige = stap > 0 ? VRAGEN[stap - 1] : undefined;
  const tip = vorige?.tip && vorige.tip.bij.includes(antwoorden[vorige.sleutel]) ? vorige.tip.tekst : null;

  return (
    <div ref={kaart} className={`kgj-reken kgj-reken--${plek}`}>
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
      {/* Na een verstuurde aanvraag geen "‹ Terug" meer: terug naar een vraag zou doen alsof er nog niets verstuurd is. */}
      {!vraagToestemming && (
        <div className="kgj-reken__kop">
          <span className="kgj-reken__tel">{klaar ? 'Laatste stap' : `Vraag ${nu} van ${AANTAL}`}</span>
          {stap > 0 && (
            <button type="button" className="kgj-reken__terug" onClick={() => setStap((s) => s - 1)}>‹ Terug</button>
          )}
        </div>
      )}

      {!klaar && vraag.afvinken ? (() => {
        const gekozen = vinken[vraag.sleutel] ?? [];
        const alles = gekozen.length === vraag.keuzes.length;
        return (
          <div className="kgj-reken__stap" key={stap}>
            <p className="kgj-reken__vraag kgj-reken__vraag--vink">{vraag.vraag}</p>
            <p className="kgj-reken__meer">Meerdere keuzes mogelijk</p>
            <div className="kgj-reken__vinken" role="group" aria-label={vraag.vraag}>
              <button type="button" role="checkbox" aria-checked={alles}
                className={`kgj-reken__vink kgj-reken__vink--alles${alles ? ' is-aan' : ''}`}
                onClick={() => vink(vraag, null)}>
                <i className="kgj-reken__vakje" aria-hidden="true"><Check /></i>{vraag.afvinken.alles}
              </button>
              {/* Onder Alles: kleine knopjes per groep. Een plus zolang het knopje
                  uit staat, een vinkje zodra het aan staat (zoals filterknopjes). */}
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
            <button type="button" className="kgj-knop kgj-knop--vol kgj-reken__verder" disabled={!gekozen.length}
              onClick={() => verder(vraag)}>
              {gekozen.length ? <>Volgende<ArrowRight aria-hidden="true" /></> : 'Vink minstens één onderdeel aan'}
            </button>
          </div>
        );
      })() : !klaar ? (
        <div className="kgj-reken__stap" key={stap}>
          <p className="kgj-reken__vraag">{vraag.vraag}</p>
          <div className={`kgj-reken__keuzes${vraag.keuzes.length % 2 === 1 ? ' kgj-reken__keuzes--oneven' : ''}${vraag.raster ? ' kgj-reken__keuzes--raster' : ''}`}>
            {vraag.keuzes.map((k) => (
              <button type="button" key={k.label}
                className={`kgj-reken__keuze${k.icoon ? ' kgj-reken__keuze--icoon' : ''}${antwoorden[vraag.sleutel] === k.label ? ' is-aan' : ''}${druk === k.label ? ' is-druk' : ''}`}
                /* Loslaten, wegschuiven of scrollen (pointercancel) haalt de
                   druktoestand weer weg. */
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
          {tip && <p className="kgj-reken__tip"><BadgePercent aria-hidden="true" />{tip}</p>}
          {vraag.punt && (
            <ul className="kgj-reken__troeven kgj-reken__troeven--vraag">
              <li><Check aria-hidden="true" />{vraag.punt}</li>
            </ul>
          )}
          {/* Niet bij vraag 1: wat er aan het dak moet gebeuren, weet de bezoeker
              zelf (Mohammed: 'hoe kan iemand niet weten wat hij wilt'). */}
          {stap > 0 && <p className="kgj-reken__gerust">{inhoud.rekenaar.gerust}</p>}
        </div>
      ) : vraagToestemming ? (
        <Toestemming verder={naarBedankt} />
      ) : (
        <form className="kgj-reken__stap kgj-reken__form" onSubmit={verstuur} noValidate>
          {/* Vervaagde richtprijs bovenaan de laatste stap, met een slot (Mohammed,
              28 sept; naar zijn voorbeeld, zonder het sterretje en de hoofdletters).
              Er staan bewust alleen nullen in: de prijs wordt op de pagina nooit
              onthuld. De klant krijgt een mail, Bardh krijgt de antwoorden en
              bezorgt de richtprijs; de zin onder de knop zegt dat eerlijk.
              Dak: vijf cijfers, renovatie: zes, passend bij die bedragen. */}
          <div className="kgj-reken__richt" aria-hidden="true">
            <span className="kgj-reken__richt-bedrag">
              <span className="kgj-reken__richt-euro">€</span>
              <span className="kgj-reken__richt-cijfers">
                {inhoud.divisie === 'ab_dakwerken' ? '00.000 – 00.000' : '000.000 – 000.000'}
              </span>
            </span>
            <span className="kgj-reken__slot"><Lock /></span>
          </div>
          {/* Direct onder het bedrag, zodat de regel bij de prijs hoort (Mohammed, 28 sept). */}
          <p className="kgj-reken__richt-onder">Op basis van uw {Object.values(antwoorden).filter(Boolean).length} antwoorden</p>
          <p className="kgj-reken__vraag kgj-reken__vraag--richt">{inhoud.rekenaar.uitkomstKop}</p>
          {/* Mohammed, 26 sep: "naam en email bovenaan, telefoon onderaan, maar
              telefoon wel verplichting". */}
          <div className="kgj-reken__rij">
            <label>Naam<input name="naam" type="text" autoComplete="name" placeholder="Uw naam" /></label>
            <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="uw@email.be" /></label>
          </div>
          <label>Telefoon *
            {/* Geen autoFocus: op een telefoon sprong het toetsenbord dan meteen open
                over de vraag heen (Mohammed, 24 sep: "oude mensen gaan vastraken"). */}
            <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder="04xx xx xx xx"
              aria-required="true" />
          </label>
          {inhoud.rekenaar.troeven && (
            <ul className="kgj-reken__troeven">
              {inhoud.rekenaar.troeven.map((t) => <li key={t}><Check aria-hidden="true" />{t}</li>)}
            </ul>
          )}
          <button className="kgj-knop kgj-knop--vol kgj-reken__knop kgj-reken__knop--richt" type="submit" disabled={bezig}>
            {bezig ? 'Bezig…' : <>{inhoud.rekenaar.knop}<ArrowRight aria-hidden="true" /></>}
          </button>
          {inhoud.rekenaar.uitkomstOnder && <p className="kgj-reken__gerust">{inhoud.rekenaar.uitkomstOnder}</p>}
          {/* AVG: informatie bij het verzamelen (art. 13), klein en rustig (Mohammed, 25 sep:
              "niet opeens super duidelijk aan de prospect"). */}
          <p className="kgj-reken__privacy">Wij gebruiken uw gegevens alleen voor deze aanvraag. <a href="/privacy">Privacybeleid</a></p>
          {fout && <p className="kgj-reken__fout" role="alert">{fout}</p>}
        </form>
      )}
      {/* "Gratis en vrijblijvend" staat op de laatste stap al bij de zekerheden. */}
      {!(klaar && inhoud.rekenaar.troeven) && !(!klaar && vraag?.punt) && (inhoud.rekenaar.vertrouwen ? (
        <ul className="kgj-reken__vertrouwen">
          {inhoud.rekenaar.vertrouwen.map((t) => <li key={t}><Check aria-hidden="true" />{t}</li>)}
        </ul>
      ) : <p className="kgj-reken__zeker"><ShieldCheck aria-hidden="true" />{inhoud.rekenaar.zeker}</p>)}
    </div>
  );
}
