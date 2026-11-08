import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Expand, Pause, Play, X } from 'lucide-react';
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
 * - Daaronder "Tijdens de werken": de foto's en de rondgang als tegels (gsm: een rij om te vegen), een tik opent ze groot in een venster
 *   (vegen, pijlen, Esc, sluitknop van 44 px; de rondgang speelt daar af).
 * - Laden: de video's pas als het podium of het venster ze nodig heeft (betaald advertentieverkeer, eerste scherm eerst); "minder beweging":
 *   geen automatisch afspelen, wel een afspeelknop. De video's hebben geen geluid. Pauzeknop op het podium (beweging langer dan 5 s).
 */
type Item = { soort: 'foto'; src: string; alt: string } | { soort: 'video'; src: string; poster: string; alt: string };

export default function Realisatie({ r, knop }: { r: RealisatieInhoud; knop: React.ReactNode }) {
  const [toon, setToon] = useState<'na' | 'tijdens'>('na');
  const [gepauzeerd, setGepauzeerd] = useState(false);
  const [speelt, setSpeelt] = useState(false);
  const podium = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const zicht = useRef(false);
  const stil = useRef(false);

  const items: Item[] = [
    { soort: 'foto', src: r.tijdens.groot, alt: r.tijdens.alt },
    ...r.fotos.map((f): Item => ({ soort: 'foto', src: f.groot, alt: f.alt })),
    ...(r.rondgang ? [{ soort: 'video', src: r.rondgang.video, poster: r.rondgang.poster, alt: r.rondgang.alt } as Item] : []),
  ];
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const openen = (i: number, e: React.MouseEvent<HTMLElement>) => { opener.current = e.currentTarget; setOpen(i); };

  /* Podiumvideo: bron pas zetten als het podium bijna in beeld is; spelen als minstens 35% in beeld is en "Na de werken" gekozen is.
     De waarnemers lezen de stand van nu via een ref (geen verouderde waarden uit de eerste weergave). */
  const stand = useRef({ toon, gepauzeerd, open });
  stand.current = { toon, gepauzeerd, open };
  const bijwerk = () => {
    const v = video.current;
    if (!v) return;
    const s = stand.current;
    const moet = zicht.current && s.toon === 'na' && !s.gepauzeerd && !stil.current && s.open === null && !!v.getAttribute('src');
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
  useEffect(() => { bijwerk(); }, [toon, gepauzeerd, open]);

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
              <button type="button" className={`bf-real__laag bf-real__laag--foto${toon === 'tijdens' ? ' is-aan' : ''}`} tabIndex={toon === 'tijdens' ? 0 : -1}
                aria-hidden={toon !== 'tijdens'} aria-label={`${r.tijdens.label}: foto groot bekijken`} onClick={(e) => openen(0, e)}>
                <img src={r.tijdens.src} alt={r.tijdens.alt} loading="lazy" decoding="async" />
                <span className="bf-real__groot" aria-hidden="true"><Expand /></span>
              </button>
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
        <div className="bf-real__galerij">
          <h3 className="bf-real__galerijkop">{r.galerijKop}</h3>
          <ul className="bf-real__tegels">
            {r.fotos.map((f, i) => (
              <li key={f.src}>
                <button type="button" className="bf-real__tegel" onClick={(e) => openen(i + 1, e)} aria-label={`Foto ${i + 2} van ${items.length} groot bekijken`}>
                  <img src={f.src} alt={f.alt} loading="lazy" decoding="async" />
                  <span className="bf-real__groot" aria-hidden="true"><Expand /></span>
                </button>
              </li>
            ))}
            {r.rondgang && (
              <li>
                <button type="button" className="bf-real__tegel bf-real__tegel--video" onClick={(e) => openen(items.length - 1, e)} aria-label={`${r.rondgang.label}: video afspelen`}>
                  <img src={r.rondgang.poster} alt="" loading="lazy" decoding="async" />
                  <span className="bf-real__speel" aria-hidden="true"><Play /></span>
                  <span className="bf-real__tegellabel">{r.rondgang.label}</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      {open !== null && <Venster titel={r.project} items={items} begin={open} sluit={() => { setOpen(null); opener.current?.focus({ preventScroll: true }); }} />}
    </section>
  );
}

/* Het venster: foto's en de rondgang groot, vegen (scroll-snap), pijlen, toetsen ← → en Esc, sluitknop 44 px, klik op de achtergrond sluit.
   De pagina erachter scrolt niet; de focus blijft in het venster. */
function Venster({ titel, items, begin, sluit }: { titel: string; items: Item[]; begin: number; sluit: () => void }) {
  const [nu, setNu] = useState(begin);
  const baan = useRef<HTMLDivElement>(null);
  const vak = useRef<HTMLDivElement>(null);
  const naar = (i: number, zacht = true) => {
    const b = baan.current;
    if (!b) return;
    const j = Math.max(0, Math.min(items.length - 1, i));
    b.scrollTo({ left: j * b.clientWidth, behavior: zacht ? 'smooth' : 'auto' });
  };
  useEffect(() => {
    const vorig = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => naar(begin, false));
    vak.current?.querySelector<HTMLElement>('.bf-venster__sluit')?.focus({ preventScroll: true });
    return () => { document.documentElement.style.overflow = vorig; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const toets = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); sluit(); }
      else if (e.key === 'ArrowRight') naar(nu + 1);
      else if (e.key === 'ArrowLeft') naar(nu - 1);
      else if (e.key === 'Tab') {
        const stops = [...(vak.current?.querySelectorAll<HTMLElement>('button, video[controls]') ?? [])].filter((x) => x.getClientRects().length > 0);
        if (!stops.length) return;
        const eerste = stops[0], laatste = stops[stops.length - 1];
        if (e.shiftKey && document.activeElement === eerste) { e.preventDefault(); laatste.focus(); }
        else if (!e.shiftKey && document.activeElement === laatste) { e.preventDefault(); eerste.focus(); }
      }
    };
    document.addEventListener('keydown', toets);
    return () => document.removeEventListener('keydown', toets);
  }, [nu, sluit]);
  /* De rondgang speelt als hij in beeld komt en stopt als de bezoeker verder veegt. */
  useEffect(() => {
    baan.current?.querySelectorAll('video').forEach((v) => {
      const hier = Number(v.dataset.i) === nu;
      if (hier) { if (!v.getAttribute('src')) v.setAttribute('src', v.dataset.src || ''); v.play().catch(() => {}); } else v.pause();
    });
  }, [nu]);
  return (
    <div className="bf-venster" role="dialog" aria-modal="true" aria-label={titel} ref={vak} onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('bf-venster__dia')) sluit(); }}>
      <div className="bf-venster__balk">
        <p className="bf-venster__titel">{titel}<span className="bf-venster__tel">{nu + 1} / {items.length}</span></p>
        <button type="button" className="bf-venster__sluit" aria-label="Sluiten" onClick={sluit}><X aria-hidden="true" /></button>
      </div>
      <div className="bf-venster__baan" ref={baan} onScroll={(e) => { const b = e.currentTarget; const i = Math.round(b.scrollLeft / Math.max(1, b.clientWidth)); if (i !== nu) setNu(i); }}>
        {items.map((it, i) => (
          <div className="bf-venster__dia" key={i} aria-hidden={i !== nu}>
            {it.soort === 'foto'
              ? <img src={it.src} alt={it.alt} loading={Math.abs(i - begin) <= 1 ? 'eager' : 'lazy'} decoding="async" />
              : <video data-i={i} data-src={it.src} poster={it.poster} controls playsInline muted loop preload="none" aria-label={it.alt} />}
          </div>
        ))}
      </div>
      <button type="button" className="bf-venster__pijl bf-venster__pijl--links" aria-label="Vorige" onClick={() => naar(nu - 1)} disabled={nu === 0}><ChevronLeft aria-hidden="true" /></button>
      <button type="button" className="bf-venster__pijl bf-venster__pijl--rechts" aria-label="Volgende" onClick={() => naar(nu + 1)} disabled={nu === items.length - 1}><ChevronRight aria-hidden="true" /></button>
      <ol className="bf-venster__bollen" aria-hidden="true">{items.map((_, i) => <li key={i} className={i === nu ? 'is-aan' : undefined} />)}</ol>
    </div>
  );
}
