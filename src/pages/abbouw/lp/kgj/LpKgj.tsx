import { useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/data/contact';
import { KGJ_CSS } from './stijl';
import { KGJ_EXTRA } from './extra';
import Rekenaar from './Rekenaar';
import Inspectie from './Inspectie';
import { Icoon } from './Iconen';
import { DAKWERKEN, type KgjInhoud, type Review } from './inhoud';
import logo from '@/assets/home/logo-trim.png';

/**
 * Landingspagina in de vormtaal van de KGJ Projects-demo, met de inhoud van AB.
 *
 * Mohammed (22 sep 2026): "je hebt toch de website van kgj projects, exact die,
 * maar dan met abgroep.be context", met als doel dat de bezoeker de
 * prijscalculator gebruikt, met zo weinig mogelijk frictie.
 *
 * De opmaak en de klassen zijn die van de demo (NORVO-DEMOS/kgjprojects). Drie
 * dingen wijken bewust af, allemaal voor conversie:
 *
 *   1. Geen menu: alleen het logo en het telefoonnummer, zoals op de
 *      campagnepagina van Recotex. Elke menulink is een uitgang.
 *   2. De calculator staat in de hero met de eerste vraag open. Bij de vijf
 *      grootste spelers (Kijzer, Dural, Recotex, Rinovato, Verelst) staat op
 *      geen enkele pagina een vraag of veld boven de vouw.
 *   3. Onderaan staat de calculator nog eens, op de plek van het formulier van
 *      de demo, voor wie eerst de hele pagina leest.
 */

/* Hoe hoog elke stap van de werkwijze hangt: dezelfde golf als in de demo. */
const STAP_HOOGTE = [0, 58, 34, 58, 0];

const IcBel = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

/* Dezelfde hand als de iconen van de demo: 24 op 24, lijn 1,6, ronde uiteinden. */
const lijn = { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
const REDEN_ICONEN = [
  <svg {...lijn} key="schild"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" /><path d="m8.8 12 2.2 2.2 4.3-4.4" /></svg>,
  <svg {...lijn} key="agenda"><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="m9 15 2 2 4-4" /></svg>,
  <svg {...lijn} key="premie"><circle cx="12" cy="12" r="8.6" /><path d="M15.2 8.6a4 4 0 1 0 0 6.8M7.2 10.8h5.6M7.2 13.2h5.6" /></svg>,
];
const STAP_ICONEN = [
  <svg {...lijn} key="aanvraag"><path d="M21 3 3 10.5l7 2.6 2.6 7.4z" /><path d="m10 13.1 5-5" /></svg>,
  <svg {...lijn} key="huis"><path d="M3.2 10.6 12 3.4l8.8 7.2V20a1 1 0 0 1-1 1H4.2a1 1 0 0 1-1-1z" /><path d="M9.4 21v-6.2h5.2V21" /></svg>,
  <svg {...lijn} key="papier"><path d="M6 2.9h7.4L18.4 8v13.1H6z" /><path d="M13.4 2.9V8h5" /><path d="M9 12.2h6.4M9 15.4h6.4M9 18.6h3.6" /></svg>,
  <svg {...lijn} key="dak"><path d="M2.5 12.5 12 4l9.5 8.5" /><path d="M5.5 10v10h13V10" /><path d="M9 20v-5h6v5" /></svg>,
  <svg {...lijn} key="nazorg"><circle cx="12" cy="12" r="8.6" /><path d="m8.4 12.2 2.4 2.4 4.8-5" /></svg>,
];

/* De boog tussen twee rondjes, uitgerekend uit het hoogteverschil. Zo tekent de
   demo ze ook: het kader is 120 hoog met het midden op 60, en het rondje van
   62 heeft zijn middelpunt 31 onder de bovenkant van de stap. */
function Boog({ delta }: { delta: number }) {
  const begin = 60 - delta / 2;
  const eind = 60 + delta / 2;
  return (
    <span className="kgj-boog" style={{ '--mid': `${delta / 2 + 31}px` } as React.CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 300 120" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.6"
        vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round">
        <path d={`M6 ${begin} C110 ${begin}, 190 ${eind}, 286 ${eind}`} strokeDasharray="5 7" />
        <path d={`M277 ${eind - 6} L288 ${eind} L277 ${eind + 6}`} />
      </svg>
    </span>
  );
}

export default function LpKgj({ inhoud = DAKWERKEN }: { inhoud?: KgjInhoud }) {
  const vat = useRef<HTMLDivElement>(null);
  const [dia, setDia] = useState(0);
  /* De demo laat de kop één keer rustig binnenkomen: hij staat op doorzichtig
     tot de hero de klasse is-binnen krijgt. Zonder die klasse blijft de kop
     onzichtbaar. De calculator doet niet mee en staat er meteen. */
  const [binnen, setBinnen] = useState(false);
  const [balk, setBalk] = useState(false);
  const [rev, setRev] = useState(0);
  const [schuif, setSchuif] = useState(50);
  /* De calculator in een venster: elke knop 'Bereken uw prijs' opent hem waar
     de bezoeker is. Mohammed: 'elke knop moet rechtstreeks in het form komen,
     niet eerst naar boven gestuurd worden'. */
  const [venster, setVenster] = useState(false);
  useEffect(() => {
    if (!venster) return;
    const toets = (e: KeyboardEvent) => { if (e.key === 'Escape') setVenster(false); };
    const vorig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', toets);
    return () => { document.body.style.overflow = vorig; document.removeEventListener('keydown', toets); };
  }, [venster]);
  const schuifVak = useRef<HTMLDivElement>(null);
  const sleept = useRef(false);
  /* Alleen echte klantenstemmen. Is de lijst leeg, dan toont de pagina de
     sectie niet: een reviewblok met bedachte quotes is verzonnen bewijs. */
  const reviews = inhoud.reviews.lijst;

  useEffect(() => {
    const id = requestAnimationFrame(() => setBinnen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* De vaste balk onderaan de telefoon verdwijnt zodra een calculator in beeld
     staat. Anders dekt hij de verzendknop van het formulier af, en herhaalt hij
     een knop die de bezoeker op dat moment al voor zich heeft. */
  useEffect(() => {
    const wortel = vat.current;
    if (!wortel || !('IntersectionObserver' in window)) return;
    const kaarten = [...wortel.querySelectorAll('.kgj-reken')];
    if (!kaarten.length) return;
    const inBeeld = new Set<Element>();
    const kijker = new IntersectionObserver((rijen) => {
      for (const r of rijen) {
        if (r.isIntersecting) inBeeld.add(r.target);
        else inBeeld.delete(r.target);
      }
      setBalk(inBeeld.size === 0);
    }, { threshold: 0.25 });
    kaarten.forEach((k) => kijker.observe(k));
    return () => kijker.disconnect();
  }, []);

  useEffect(() => {
    document.title = inhoud.titel;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', inhoud.omschrijving);
  }, [inhoud]);

  /* Anker in de link (Google-sitelink /lp/dakwerken#rekenaar, #hellend, ...): naar
     die sectie scrollen. De browser probeert dat bij het laden zelf, maar dan
     bestaat het element nog niet; zonder dit landden alle sitelinks bovenaan
     (gevonden 25 sep, zelfde oplossing als LpDienst.tsx). */
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 120);
    return () => window.clearTimeout(t);
  }, []);

  /* Herofoto's: om de zes seconden de volgende, stil als het tabblad niet
     zichtbaar is. De demo stopte ook onder de muis, maar hier staat de
     calculator in de hero: wie iets invult, heeft de muis er altijd op, en dan
     liep de diashow nooit. Mohammed: "de hero moet automatisch loopen". */
  useEffect(() => {
    const n = inhoud.hero.dias.length;
    if (n < 2 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let klok: number | null = null;
    const stop = () => { if (klok !== null) { window.clearInterval(klok); klok = null; } };
    const start = () => { stop(); klok = window.setInterval(() => setDia((d) => (d + 1) % n), 6000); };
    const zicht = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', zicht);
    start();
    return () => {
      stop();
      document.removeEventListener('visibilitychange', zicht);
    };
  }, [inhoud]);

  /* Rustig verschijnen bij het scrollen (.kgj-op) en de werkwijze-bolletjes
     die meelopen, letterlijk de logica van de demo. Wat bij het laden al in
     beeld staat, verschijnt meteen. */
  useEffect(() => {
    const wortel = vat.current;
    if (!wortel) return;
    const blokken = [...wortel.querySelectorAll<HTMLElement>('.kgj-op')];
    const stappen = [...wortel.querySelectorAll<HTMLElement>('.kgj-stap')];
    const werkwijze = wortel.querySelector<HTMLElement>('.kgj-werkwijze');
    const rustig = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (rustig || !('IntersectionObserver' in window)) {
      blokken.forEach((e) => e.classList.add('is-zichtbaar'));
      stappen.forEach((e) => e.classList.add('is-aan'));
      return;
    }
    const kijker = new IntersectionObserver((rijen) => {
      for (const r of rijen) {
        if (!r.isIntersecting) continue;
        const el = r.target as HTMLElement;
        const buren = [...(el.parentElement?.children ?? [])].filter((k) => k.classList.contains('kgj-op'));
        const plek = buren.indexOf(el);
        el.style.transitionDelay = `${plek > 0 ? Math.min(plek, 5) * 70 : 0}ms`;
        el.classList.add('is-zichtbaar');
        kijker.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    blokken.forEach((e) => {
      if (e.getBoundingClientRect().top < window.innerHeight * 0.92) e.classList.add('is-zichtbaar');
      else kijker.observe(e);
    });

    let wacht = false;
    const meet = () => {
      if (!werkwijze) return;
      const r = werkwijze.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const begin = vh * 0.82;
      const eind = vh * 0.34;
      const p = Math.max(0, Math.min(1, (begin - r.top) / (begin - eind + r.height * 0.55)));
      const n = Math.ceil(p * stappen.length);
      stappen.forEach((e, i) => e.classList.toggle('is-aan', i < n));
    };
    const tik = () => { if (wacht) return; wacht = true; requestAnimationFrame(() => { wacht = false; meet(); }); };
    window.addEventListener('scroll', tik, { passive: true });
    window.addEventListener('resize', tik);
    meet();
    return () => { kijker.disconnect(); window.removeEventListener('scroll', tik); window.removeEventListener('resize', tik); };
  }, []);

  /* Voor/na: slepen met pointer-events, want iOS Safari levert aan een
     onzichtbare range-input geen betrouwbare aanrakingen af. De input blijft
     voor het toetsenbord. */
  const zetSchuif = (x: number) => {
    const el = schuifVak.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width > 0) setSchuif(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  };

  const toonRev = (i: number) => setRev(((i % reviews.length) + reviews.length) % reviews.length);
  const veeg = useRef(0);

  return (
    <div className="kgjx" ref={vat}>
      <style>{KGJ_CSS + KGJ_EXTRA}</style>

      <header className="kgj-kop kgj-kop--lp" id="kop">
        <div className="kgj-breed kgj-kop__in">
          <a className="kgj-logo" href="#top" aria-label="AB Bouw Groep"><img src={logo} alt="Logo van AB Bouw Groep" /></a>
          <a className="kgj-knop kgj-knop--vol kgj-kop__bel" href={CONTACT.phone.href}>
            <IcBel /><span>Bel {CONTACT.phone.display}</span>
          </a>
        </div>
      </header>

      <section className={`kgj-hero kgj-hero--lp${binnen ? " is-binnen" : ""}`} id="top">
        <div className="kgj-hero__foto">
          {inhoud.hero.dias.map((d, i) => (
            <figure className={`kgj-dia${i === dia ? ' is-aan' : ''}`} key={d.src}>
              <img src={d.src} alt={d.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
            </figure>
          ))}
        </div>
        <div className="kgj-breed kgj-hero__in">
          <div className="kgj-hero__raster">
            <div>
              <h1>{inhoud.hero.kop}</h1>
              {inhoud.hero.ondertitel && <p className="kgj-hero__ondertitel">{inhoud.hero.ondertitel}</p>}
              <p className="kgj-hero__sub">{inhoud.hero.onder}</p>
              <ul className="kgj-hero__bewijs">
                {inhoud.hero.bewijs.map((b) => (
                  <li key={b}>
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m4 10.5 4 4 8-9" />
                    </svg>{b}
                  </li>
                ))}
              </ul>
            </div>
            <div id="rekenaar"><Rekenaar inhoud={inhoud} plek="hero" /></div>
          </div>
        </div>
        {/* Geen pijlen: de diashow loopt vanzelf (Mohammed: "doe die onderste pijlen weg"). */}
        <div className="kgj-hero__streep" aria-hidden="true">
          {inhoud.hero.dias.map((d, i) => <span className={`kgj-hero__tik${i === dia ? ' is-aan' : ''}`} key={d.src} />)}
        </div>
      </section>

      <section className="kgj-band kgj-band--grijs kgj-waarom" id="waarom">
        <div className="kgj-breed kgj-waarom__in">
          <div className="kgj-waarom__tekst kgj-op">
            <h2>{inhoud.waarom.kop}</h2>
            <p>{inhoud.waarom.tekst}</p>
            <button type="button" className="kgj-knop kgj-knop--vol" onClick={() => setVenster(true)}>Bereken uw prijs</button>
          </div>
          <ul className="kgj-redenen">
            {inhoud.waarom.redenen.map((r, i) => (
              <li className="kgj-reden kgj-op" key={r.titel}>
                <span className="kgj-reden__teken">{REDEN_ICONEN[i % REDEN_ICONEN.length]}</span>
                <div><h3>{r.titel}</h3><p>{r.tekst}</p></div>
              </li>
            ))}
          </ul>
          <figure className="kgj-duo kgj-op">
            <img className="kgj-duo__a" src={inhoud.waarom.duo[0].src} alt={inhoud.waarom.duo[0].alt} loading="lazy" />
            <img className="kgj-duo__b" src={inhoud.waarom.duo[1].src} alt={inhoud.waarom.duo[1].alt} loading="lazy" />
          </figure>
        </div>
      </section>

      {/* Mohammed, 25 sep: korte dienstensectie onder "Waarom", met iconen. De
          id's per dienst zijn de ankers van de sitelinks. */}
      <section className="kgj-band kgj-diensten" id="diensten">
        <div className="kgj-breed">
          <div className="kgj-kopblok kgj-kopblok--mid kgj-op">
            <h2>{inhoud.diensten.kop}</h2>
          </div>
          <ul className="kgj-dienstraster">
            {inhoud.diensten.lijst.map((d) => (
              <li className="kgj-dienst kgj-op" id={d.id} key={d.id}>
                <span className="kgj-dienst__icoon"><Icoon naam={d.icoon} /></span>
                <h3>{d.naam}</h3>
                <p>{d.tekst}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kgj-band kgj-werkwijze" id="werkwijze">
        <div className="kgj-breed">
          <div className="kgj-kopblok kgj-kopblok--mid kgj-op">
            <h2>{inhoud.werkwijze.kop}</h2>
            <p>{inhoud.werkwijze.onder}</p>
          </div>
          <ol className="kgj-stappen">
            {inhoud.werkwijze.stappen.map((s, i, alle) => (
              <li className="kgj-stap kgj-op" key={s.titel} style={{ '--op': `${STAP_HOOGTE[i % STAP_HOOGTE.length]}px` } as React.CSSProperties}>
                <span className="kgj-stap__bol">{STAP_ICONEN[i % STAP_ICONEN.length]}</span>
                <span className="kgj-stap__nr">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.titel}</h3>
                <p>{s.tekst}</p>
                {i < alle.length - 1 && (
                  <Boog delta={STAP_HOOGTE[(i + 1) % STAP_HOOGTE.length] - STAP_HOOGTE[i % STAP_HOOGTE.length]} />
                )}
              </li>
            ))}
          </ol>
          <div className="kgj-midknop">
            <button type="button" className="kgj-knop kgj-knop--vol" onClick={() => setVenster(true)}>Bereken uw prijs</button>
          </div>
        </div>
      </section>

      <section className="kgj-band kgj-band--grijs kgj-voorna" id="voorna">
        <div className="kgj-breed">
          <div className="kgj-kopblok kgj-kopblok--mid kgj-op">
            <h2>{inhoud.voorna.kop}</h2>
            <p>{inhoud.voorna.onder}</p>
          </div>
          <div className="kgj-schuif kgj-op">
            <figure className="kgj-schuif__paar is-aan">
              <div className="kgj-schuif__vak" ref={schuifVak} style={{ '--verhouding': '62.5%' } as React.CSSProperties}
                onPointerDown={(e) => { sleept.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); zetSchuif(e.clientX); }}
                onPointerMove={(e) => { if (sleept.current) zetSchuif(e.clientX); }}
                onPointerUp={(e) => { sleept.current = false; const el = e.currentTarget as HTMLElement; if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); }}
                onPointerCancel={() => { sleept.current = false; }}>
                <div className="kgj-schuif__na">
                  <img src={inhoud.voorna.na.src} alt={inhoud.voorna.na.alt} loading="lazy" />
                  <span className="kgj-schuif__merk kgj-schuif__merk--na">Na</span>
                </div>
                <div className="kgj-schuif__voor" style={{ clipPath: `inset(0 ${100 - schuif}% 0 0)` }}>
                  <img src={inhoud.voorna.voor.src} alt={inhoud.voorna.voor.alt} loading="lazy" />
                  <span className="kgj-schuif__merk kgj-schuif__merk--voor">Voor</span>
                </div>
                <input className="kgj-schuif__bereik" type="range" min={0} max={100} step={0.1} value={schuif}
                  aria-label={inhoud.voorna.onder} onChange={(e) => setSchuif(Number(e.target.value))} />
                <span className="kgj-schuif__lijn" style={{ left: `${schuif}%` }}>
                  <span className="kgj-schuif__greep" aria-hidden="true">‹ ›</span>
                </span>
              </div>
              <figcaption>{inhoud.voorna.label}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* De drie werkfoto's onder de schuif zijn weg (Mohammed, 23 sep: "die 3
          fotos onder de slider haal die gewoon weg"). inhoud.werk blijft bestaan. */}

      {reviews.length > 0 && (
        <section className="kgj-band kgj-reviews" id="reviews">
          <div className="kgj-breed kgj-reviews__in">
            <div className="kgj-reviews__links kgj-op">
              <h2>{inhoud.reviews.kop}</h2>
            </div>
            <div className="kgj-reviews__beeld kgj-op">
              <img src={inhoud.reviews.beeld.src} alt={inhoud.reviews.beeld.alt} loading="lazy" />
            </div>
            <div className="kgj-reviews__spoorvak kgj-op">
              <div className="kgj-revvak">
                <ul className="kgj-revspoor" style={{ transform: `translate3d(${-rev * 100}%,0,0)` }}
                  onPointerDown={(e) => { veeg.current = e.clientX; }}
                  onPointerUp={(e) => { const d = e.clientX - veeg.current; if (Math.abs(d) > 45) toonRev(rev + (d < 0 ? 1 : -1)); }}>
                  {reviews.map((r, i) => (
                    <li className="kgj-rev" key={r.naam} aria-hidden={i !== rev}>
                      <span className="kgj-rev__aanhaling" aria-hidden="true">&ldquo;</span>
                      <p className="kgj-rev__tekst">{r.tekst}</p>
                      <p className="kgj-rev__naam">{r.naam}</p>
                      <p className="kgj-rev__bron">{r.bron}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="kgj-reviews__bediening">
                <button className="kgj-rond" type="button" aria-label="Vorige review" onClick={() => toonRev(rev - 1)}>‹</button>
                <button className="kgj-rond kgj-rond--vol" type="button" aria-label="Volgende review" onClick={() => toonRev(rev + 1)}>›</button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="kgj-cta kgj-cta--lp" id="contact">
        <div className="kgj-cta__foto"><img src={inhoud.cta.foto.src} alt={inhoud.cta.foto.alt} loading="lazy" /></div>
        <div className="kgj-breed kgj-cta__in">
          <div className="kgj-cta__tekst kgj-op">
            <h2>{inhoud.cta.kop}</h2>
            {inhoud.cta.tekst && <p>{inhoud.cta.tekst}</p>}
            <ul className="kgj-cta__punten">
              {inhoud.cta.punten.map((p) => (
                <li key={p}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m4 10.5 4 4 8-9" />
                  </svg>{p}
                </li>
              ))}
            </ul>
            <a className="kgj-knop kgj-knop--wit" href={CONTACT.phone.href}>Bel {CONTACT.phone.display}</a>
          </div>
          <div className="kgj-op"><Inspectie inhoud={inhoud} opPrijs={() => setVenster(true)} /></div>
        </div>
      </section>

      <div className={`kgj-actiebalk${balk ? ' is-aan' : ''}`}>
        {/* Mohammed, 24 sep: "de cta bij het scrollen onderaan moet zijn: gratis
            dakinspectie". De knop brengt de bezoeker naar het inspectieformulier;
            de calculator blijft bereikbaar via de knoppen op de pagina zelf. */}
        <button type="button" className="kgj-knop kgj-knop--vol"
          onClick={() => document.querySelector('.kgj-reken--inspectie')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
          Gratis dakinspectie
        </button>
        <a className="kgj-knop kgj-knop--rand" href={CONTACT.phone.href}
          aria-label={'Bel ' + CONTACT.phone.display}><IcBel /></a>
      </div>

      <footer className="kgj-voet kgj-voet--lp">
        <div className="kgj-breed kgj-voet__in">
          <div className="kgj-voet__merk">
            <img className="kgj-voet__logo" src={logo} alt="Logo van AB Bouw Groep" />
            <p>Dakwerken, gevelwerken en renovatie in heel Vlaanderen.</p>
          </div>
          <div className="kgj-voet__kolom">
            <h4>Contact</h4>
            <ul className="kgj-voet__contact">
              <li>{CONTACT.address.street}<br />{CONTACT.address.city}</li>
              <li><a href={CONTACT.phone.href}>{CONTACT.phone.display}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="kgj-breed kgj-voet__onder">
          {/* Btw-nummer uit Voorwaarden.tsx, de enige plek in de code waar het staat. */}
          <p>© {new Date().getFullYear()} AB Bouw Groep · BTW BE 0712.443.881</p>
          <a href="/privacy">Privacy</a>
          <a href="/cookies">Cookies</a>
          <a href="/voorwaarden">Voorwaarden</a>
        </div>
      </footer>

      {venster && (
        <div className="kgj-venster" role="dialog" aria-modal="true" aria-label="Bereken uw prijs"
          onClick={(e) => { if (e.target === e.currentTarget) setVenster(false); }}>
          <div className="kgj-venster__in">
            <button type="button" className="kgj-venster__dicht" aria-label="Sluiten" onClick={() => setVenster(false)}>×</button>
            <Rekenaar inhoud={inhoud} plek="venster" />
          </div>
        </div>
      )}
    </div>
  );
}
