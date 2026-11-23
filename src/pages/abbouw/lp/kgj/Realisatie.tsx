import { useEffect, useRef, useState } from 'react';
import { Check, Pause, Play } from 'lucide-react';
import type { Realisatie as RealisatieInhoud } from './inhoud';
import { kleiner } from './beelden-klein';

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
  /* 19 nov 2026, Mohammed: "fix ook dat probleem dat je niet op play kan drukken vaak". Gemeten (Chrome touch en WebKit, 390x664, live fa4e459):
     staat automatisch afspelen uit (iPhone in energiebesparing, Android met databesparing: play() zonder tik wordt geweigerd), dan toont de knop
     "Video afspelen", raakt de tik de knop (elementFromPoint), maar speelt de video 0 van 10 keer. Oorzaak: de tik zette gepauzeerd op false,
     dat al false was: geen nieuwe weergave, dus geen play(); en play() liep pas later in een effect, buiten de tik, waar Safari het weigert.
     Nu: de tik roept play() of pause() zelf aan, meteen in de tik; het icoon volgt de echte stand van de video (play/pause-events), zodat de
     tweede tik altijd pauzeert. Een tik op het beeld zelf doet hetzelfde als de knop. */
  const stand = useRef({ toon, gepauzeerd });
  stand.current = { toon, gepauzeerd };
  const laadBron = (v: HTMLVideoElement) => { if (!v.getAttribute('src')) { v.setAttribute('src', r.na.video); v.load(); } };
  const bijwerk = () => {
    const v = video.current;
    if (!v) return;
    const s = stand.current;
    const moet = zicht.current && s.toon === 'na' && !s.gepauzeerd && !stil.current && !!v.getAttribute('src');
    if (moet) { if (v.paused) v.play().catch(() => { /* automatisch afspelen geweigerd: de knop blijft "Video afspelen" */ }); } else if (!v.paused) v.pause();
  };
  const wissel = () => {
    const v = video.current;
    if (!v) return;
    if (!v.paused) { setGepauzeerd(true); v.pause(); return; }
    stil.current = false;
    stand.current = { ...stand.current, gepauzeerd: false };
    setGepauzeerd(false);
    laadBron(v);
    v.play().catch(() => setSpeelt(false));
  };
  useEffect(() => {
    stil.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (stil.current) setGepauzeerd(true);
    const el = podium.current;
    const v = video.current;
    if (!el || !v) return;
    const aan = () => setSpeelt(true), uit = () => setSpeelt(false);
    v.addEventListener('play', aan); v.addEventListener('playing', aan); v.addEventListener('pause', uit);
    setSpeelt(!v.paused);
    if (!('IntersectionObserver' in window)) return () => { v.removeEventListener('play', aan); v.removeEventListener('playing', aan); v.removeEventListener('pause', uit); };
    const laad = new IntersectionObserver(([x]) => {
      if (x.isIntersecting && !v.getAttribute('src')) { laadBron(v); bijwerk(); }
    }, { rootMargin: '400px 0px' });
    const kijk = new IntersectionObserver(([x]) => { zicht.current = x.isIntersecting; bijwerk(); }, { threshold: 0.35 });
    laad.observe(el); kijk.observe(el);
    return () => { laad.disconnect(); kijk.disconnect(); v.removeEventListener('play', aan); v.removeEventListener('playing', aan); v.removeEventListener('pause', uit); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { bijwerk(); }, [toon]);

  return (
    /* 8 nov 2026, Mohammed: "bij onze realisaties haal de titel weg. Want het is maar één realisatie, dus dat hoeft geen titel": geen sectiekop
       meer; de projectnaam is de kop van de sectie (h2, zelfde opmaak als voorheen). */
    <section className="bf-sblok bf-lprealisatie" id="realisaties" aria-labelledby="realisaties-kop">
      <div className="bf-sraam">
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
                aria-label={r.na.alt} aria-hidden={toon !== 'na'} tabIndex={-1} onClick={() => { if (toon === 'na') wissel(); }} />
              <div className={`bf-real__laag bf-real__laag--foto${toon === 'tijdens' ? ' is-aan' : ''}`} aria-hidden={toon !== 'tijdens'}>
                <img {...kleiner(r.tijdens.src, '(max-width: 1000px) 92vw, 720px')} alt={r.tijdens.alt} loading="lazy" decoding="async" />
              </div>
              <span className="bf-real__label" aria-hidden="true">{toon === 'na' ? r.na.label : r.tijdens.label}</span>
              {toon === 'na' && (
                <button type="button" className="bf-real__pauze" aria-label={speelt ? 'Video pauzeren' : 'Video afspelen'}
                  onClick={wissel}>
                  {speelt ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                </button>
              )}
            </div>
          </div>
          <div className="bf-real__info">
            <h2 className="bf-real__project" id="realisaties-kop">{r.project}</h2>
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
