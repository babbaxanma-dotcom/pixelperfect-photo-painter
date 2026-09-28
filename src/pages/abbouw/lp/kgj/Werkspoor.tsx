import { useEffect, useRef, useState } from 'react';
import { Bediening } from '../replica/Onderdelen';
import type { Foto } from './inhoud';

/**
 * Het doorlopende fotospoor van de homepage, voor de KGJ-landingspagina's.
 *
 * Mohammed, 28 sep, over "Uitgevoerd werk" op /lp/totaalrenovatie: "zonder de
 * namen", "op de manier van de home page ook had", "zo dat het horizontaal
 * doorloopt".
 *
 * Het gedrag is dat van werkSpoor in replica/LpReplica.tsx, regel voor regel
 * overgenomen: die logica zit daar in de paginacomponent en is niet los te
 * importeren, en LpReplica.tsx mocht op dit moment niet gewijzigd worden. De
 * pijlen zijn wel dezelfde component (Bediening uit replica/Onderdelen.tsx).
 *
 *   - Elke vier seconden schuift het spoor één tegel op; de vullijn eronder
 *     loopt in diezelfde vier seconden vol.
 *   - Muis, vinger of toetsenbord erop: het spoor stopt. Na een aanraking of
 *     een klik op een pijl wacht het zes seconden voor het verder gaat.
 *   - De reeks staat twee keer in de DOM. Aan het eind springt het spoor
 *     onzichtbaar terug naar dezelfde foto in de eerste reeks: geen muur, in
 *     geen van beide richtingen.
 *   - Wie "minder beweging" heeft ingesteld, krijgt geen autoplay en geen lijn.
 *
 * Eén verschil met het origineel: het spoor is hier zelf de offsetParent van
 * de tegels (position: relative in extra.ts). Dan is offsetLeft meteen de
 * scrollstand van een tegel, ook in de zelfcorrectie, waar het origineel de
 * marge van de gecentreerde container meetelt.
 */
const STAND = { links: 0, max: 1 };

export default function Werkspoor({ fotos, label }: { fotos: (Foto & { pos?: string })[]; label: string }) {
  const spoor = useRef<HTMLDivElement>(null);
  const [stil, setStil] = useState(false);
  /* Sleutel van de vullijn: gaat alleen omhoog als er een nieuwe foto begint,
     zodat de lijn bij hoveren bevriest in plaats van terug te springen. */
  const [ronde, setRonde] = useState(0);
  const nieuweRonde = () => setRonde((r) => r + 1);
  const index = useRef(0);
  const hervatKlok = useRef<number>();

  const pauzeer = (hervatNa = 0) => {
    window.clearTimeout(hervatKlok.current);
    setStil(true);
    if (hervatNa > 0) hervatKlok.current = window.setTimeout(() => { setStil(false); nieuweRonde(); }, hervatNa);
  };
  const hervat = () => { window.clearTimeout(hervatKlok.current); setStil(false); nieuweRonde(); };
  useEffect(() => () => window.clearTimeout(hervatKlok.current), []);

  /** Verzet het spoor zonder animatie (het spoor heeft scroll-behavior: smooth). */
  const springDirect = (el: HTMLElement, naar: number) => {
    const bewaar = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = naar;
    void el.scrollLeft;
    el.style.scrollBehavior = bewaar;
  };

  /** Eén tegel verder of terug, naar de exacte positie van een tegel. De index
      wordt geteld, niet afgelezen: tijdens de eigen animatie ligt scrollLeft
      tussen twee tegels in. */
  const stapLus = (el: HTMLElement, richting: -1 | 1) => {
    const tegels = Array.from(el.children) as HTMLElement[];
    const helft = Math.floor(tegels.length / 2);
    if (!helft) return;
    const nul = tegels[0].offsetLeft;
    const stand = (i: number) => tegels[i].offsetLeft - nul;
    let i = Math.min(Math.max(index.current, 0), tegels.length - 1);
    /* Zelfcorrectie: heeft iets anders het spoor verzet (een veeg), dan wint
       de tegel die het dichtst bij de huidige stand ligt. */
    const stapBreedte = stand(1) - stand(0);
    if (stapBreedte > 0 && Math.abs(stand(i) - el.scrollLeft) > stapBreedte) {
      let dichtst = Infinity;
      tegels.forEach((_, j) => {
        const afstand = Math.abs(stand(j) - el.scrollLeft);
        if (afstand < dichtst) { dichtst = afstand; i = j; }
      });
    }
    if (i >= helft) { i -= helft; springDirect(el, stand(i)); }
    let doel = i + richting;
    if (doel < 0) { i += helft; springDirect(el, stand(i)); doel = i - 1; }
    index.current = doel;
    el.scrollTo({ left: stand(doel), behavior: 'smooth' });
  };

  /* Wie zelf op een pijl klikt, neemt het over: de autoplay stopt zes seconden. */
  const schuif = (ref: React.RefObject<HTMLDivElement>, richting: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    pauzeer(6000);
    nieuweRonde();
    stapLus(el, richting);
  };

  /* Elke vier seconden één tegel. Stil als het tabblad op de achtergrond staat. */
  useEffect(() => {
    const el = spoor.current;
    if (!el || stil) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      stapLus(el, 1);
      nieuweRonde();
    }, 4000);
    return () => window.clearInterval(id);
  }, [stil]);

  return (
    <div className="kgj-werkspoor"
      onPointerEnter={() => pauzeer()} onPointerLeave={hervat}
      onFocusCapture={() => pauzeer()} onBlurCapture={hervat}
      onTouchStart={() => pauzeer(6000)} onWheel={() => pauzeer(6000)}>
      {/* De tweede reeks is voor een schermlezer verborgen, anders staat elke foto er twee keer in. */}
      <div className="kgj-werkspoor__spoor" ref={spoor} role="group" aria-label={label} data-lus="1">
        {[0, 1].map((reeks) => fotos.map((f) => (
          <figure className="kgj-werkspoor__foto" key={reeks + f.src} aria-hidden={reeks === 1 ? true : undefined}>
            <img src={f.src} alt={reeks === 1 ? '' : f.alt} loading="lazy" decoding="async"
              style={f.pos ? { objectPosition: f.pos } : undefined} />
          </figure>
        )))}
      </div>
      <div className="kgj-werkspoor__lijn" aria-hidden="true">
        <i key={ronde} className={stil ? 'kgj-werkspoor__vul kgj-werkspoor__vul--stil' : 'kgj-werkspoor__vul'} />
      </div>
      <Bediening spoor={spoor} pos={STAND} schuif={schuif} wat="foto" lus />
    </div>
  );
}
