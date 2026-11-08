import { useEffect, useRef, useState } from 'react';
import { Check, Pause, Play } from 'lucide-react';
import type { Realisatie as RealisatieInhoud } from './inhoud';

/**
 * Realisatie in de kijker (8 nov 2026, Mohammed: "je ziet een video, before after, tijdens de werken snapje, dan heb je zo een wow gevoel,
 * doe dit volgens de norm aub"; "werk helemaal uit, elk detail"). Inhoud: realisatie-hoeve.ts.
 *
 * Opbouw (norm bij de concurrenten, NORVO-KENNIS/concurrentie-6nov2026: "Onze realisaties", "Project in de kijker", titel + beelden + knop):
 * - Podium 16:9 met de wissel "Na de werken" (dronevideo, speelt stil en in een lus zodra het podium in beeld is) en "Tijdens de werken"
 *   (dronefoto met het open dak). Zelfde kader, het beeld vloeit over: het voor-en-na-moment zonder schuif, want de twee beelden zijn
 *   vanuit een andere hoek genomen (een schuif over twee hoeken leest als knip- en plakwerk).
 * - Naast het podium (gsm: eronder) de projectnaam, de uitgevoerde werken en de knop naar het formulier: één doel op de pagina.
 * - 8 nov 2026, Mohammed (localhost): "Tijdens de werken MAG ERuit, eronder", "behoud alleen die na en tijdens die video en foto zo",
 *   "dat is genoeg": de galerij "Tijdens de werken" (7 foto's en de rondgang) en het venster om ze groot te bekijken zijn weg.
 * - Laden: de video pas als het podium bijna in beeld is (betaald advertentieverkeer, eerste scherm eerst); "minder beweging": geen
 *   automatisch afspelen, wel een afspeelknop. De video heeft geen geluid. Pauzeknop op het podium (beweging langer dan 5 s).
 */
export default function Realisatie({ r, knop }: { r: RealisatieInhoud; knop: React.ReactNode }) {
  const [toon, setToon] = useState<'na' | 'tijdens'>('na');
  const [gepauzeerd, setGepauzeerd] = useState(false);
  const [speelt, setSpeelt] = useState(false);
  const podium = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const zicht = useRef(false);
  const stil = useRef(false);

  /* Podiumvideo: bron pas zetten als het podium bijna in beeld is; spelen als minstens 35% in beeld is en "Na de werken" gekozen is.
     De waarnemers lezen de stand van nu via een ref (geen verouderde waarden uit de eerste weergave). */
  const stand = useRef({ toon, gepauzeerd });
  stand.current = { toon, gepauzeerd };
  const bijwerk = () => {
    const v = video.current;
    if (!v) return;
    const s = stand.current;
    const moet = zicht.current && s.toon === 'na' && !s.gepauzeerd && !stil.current && !!v.getAttribute('src');
    if (moet) { v.play().then(() => setSpeelt(true)).catch(() => setSpeelt(false)); } else { v.pause(); setSpeelt(false); }
  };
  useEffect(() => {
    stil.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (stil.current) setGepauzeerd(true);
    const el = podium.current;
    const v = video.current;
    if (!el || !v || !('IntersectionObserver' in window)) return;
    const laad = new IntersectionObserver(([x]) => {
      if (x.isIntersecting && !v.getAttribute('src')) { v.setAttribute('src', r.na.video); v.load(); bijwerk(); }
    }, { rootMargin: '400px 0px' });
    const kijk = new IntersectionObserver(([x]) => { zicht.current = x.isIntersecting; bijwerk(); }, { threshold: 0.35 });
    laad.observe(el); kijk.observe(el);
    return () => { laad.disconnect(); kijk.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { bijwerk(); }, [toon, gepauzeerd]);

  return (
    <section className="bf-sblok bf-lprealisatie" id="realisaties" aria-labelledby="realisaties-kop">
      <div className="bf-sraam">
        <h2 className="bf-h2 bf-h2--midden" id="realisaties-kop">{r.kop}</h2>
        <div className="bf-real">
          <div className="bf-real__beeld">
            <div className="bf-real__wissel" role="group" aria-label="Beeld van de realisatie">
              {(['na', 'tijdens'] as const).map((k) => (
                <button type="button" key={k} className={`bf-real__wisselknop${toon === k ? ' is-aan' : ''}`} aria-pressed={toon === k} onClick={() => setToon(k)}>
                  {k === 'na' ? r.na.label : r.tijdens.label}
                </button>
              ))}
            </div>
            <div className="bf-real__podium" ref={podium}>
              <video ref={video} className={`bf-real__laag${toon === 'na' ? ' is-aan' : ''}`} poster={r.na.poster} muted loop playsInline preload="none"
                aria-label={r.na.alt} aria-hidden={toon !== 'na'} tabIndex={-1} />
              <div className={`bf-real__laag bf-real__laag--foto${toon === 'tijdens' ? ' is-aan' : ''}`} aria-hidden={toon !== 'tijdens'}>
                <img src={r.tijdens.src} alt={r.tijdens.alt} loading="lazy" decoding="async" />
              </div>
              <span className="bf-real__label" aria-hidden="true">{toon === 'na' ? r.na.label : r.tijdens.label}</span>
              {toon === 'na' && (
                <button type="button" className="bf-real__pauze" aria-label={speelt ? 'Video pauzeren' : 'Video afspelen'}
                  onClick={() => { if (speelt) setGepauzeerd(true); else { stil.current = false; setGepauzeerd(false); } }}>
                  {speelt ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                </button>
              )}
            </div>
          </div>
          <div className="bf-real__info">
            <h3 className="bf-real__project">{r.project}</h3>
            <p className="bf-real__werkenkop">{r.werkenKop}</p>
            <ul className="bf-real__werken">
              {r.werken.map((w) => <li key={w}><span className="bf-real__vink" aria-hidden="true"><Check /></span>{w}</li>)}
            </ul>
            <div className="bf-real__knop">{knop}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
