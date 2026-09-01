/**
 * De losse onderdelen waaruit een landingspagina in deze stijl is opgebouwd.
 *
 * Ze stonden eerst onderaan LpReplica.tsx. Nu er een tweede pagina in dezelfde
 * vorm komt (badkamerrenovatie) horen ze op één plek: een tekstfix of een
 * uitlijningsfout moet je één keer maken, niet twee keer. Er is bij het
 * verhuizen niets aan het gedrag veranderd — dat is nagemeten met een
 * beeldvergelijking van de totaalrenovatie-pagina voor en na.
 */
import { useRef, useState } from 'react';
import { IcChevron, IcPijl, IcZonnestraal } from './Iconen';

export type Dienstkaart = { titel: string; tekst: string; foto: string; alt: string; href: string };
export type Aanbodkaart = {
  badge: [string, string]; titel: string; tekst: string;
  foto: string; alt: string; knop: string; href: string;
};
export type Stapgegevens = {
  titel: string; tekst: string;
  Icoon: (p: { className?: string }) => JSX.Element;
};

/** Eén fotokaart uit het dienstenraster. */
export function Kaart({ titel, tekst, foto, alt, href, hoogte, gevuld }: Dienstkaart & { hoogte: number; gevuld?: boolean }) {
  return (
    <div className="pc-kaart" style={{ height: hoogte }}>
      <img src={foto} alt={alt} loading="lazy" />
      <div className="pc-kaart-inhoud">
        {/* Alleen de naam van de dienst staat er; de uitleg klapt open zodra je
            de kaart aanwijst of er met het toetsenbord in landt. Op een scherm
            zonder muis bestaat aanwijzen niet, dus daar staat de uitleg gewoon
            open — zie de hover:none-regel in de stijl. */}
        <div className="pc-kaart-tekst">
          <h3>{titel}</h3>
          <div className="pc-kaart-uitleg"><p>{tekst}</p></div>
        </div>
        <a className={gevuld ? 'pc-rond pc-rond--vol' : 'pc-rond'} href={href} aria-label={titel}>
          <IcPijl maat={14} />
        </a>
      </div>
    </div>
  );
}

/** Eén stap uit de werkwijze: icooncirkel met stapnummer, titel en tekst. */
export function Stap({ titel, tekst, Icoon, nr, actief }: Stapgegevens & { nr: number; actief?: boolean }) {
  return (
    <div className={actief ? 'pc-stap pc-stap--actief' : 'pc-stap'}>
      <div className="pc-stap-badge">
        {actief && <span className="pc-stap-schijf" />}
        <Icoon />
        <span className="pc-stap-pil">Stap {nr}</span>
      </div>
      <h3>{titel}</h3>
      <p>{tekst}</p>
    </div>
  );
}

/** Eén kaart uit het aanbodspoor, met de zonnestraal-sticker op de foto. */
export function SpoorKaart({ badge, titel, tekst, foto, alt, knop, href, gevuld }: Aanbodkaart & { gevuld?: boolean }) {
  return (
    <article className="pc-spoor-kaart">
      <div className="pc-spoor-foto">
        <img src={foto} alt={alt} loading="lazy" />
        <span className="pc-badge" style={{ color: 'var(--pc-accent)' }}>
          <IcZonnestraal />
          <span><b>{badge[0]}</b><i>{badge[1]}</i></span>
        </span>
      </div>
      <h3>{titel}</h3>
      <p>{tekst}</p>
      <a className={`pc-knop ${gevuld ? 'pc-knop--accent' : 'pc-knop--rand'}`} href={href}>
        {knop}<IcPijl />
      </a>
    </article>
  );
}

/**
 * Bediening onder een horizontaal spoor: vorige, voortgang, volgende.
 * Op een telefoon is anders niet te zien dat er opzij te scrollen valt, en met
 * een muis is zijwaarts scrollen onhandig. Een spoor dat rondloopt (lus) heeft
 * geen begin en geen eind, dus daar blijven beide knoppen altijd bruikbaar en
 * vervalt het voortgangsbalkje.
 */
export function Bediening({ spoor, pos, schuif, wat, lus }: {
  spoor: React.RefObject<HTMLDivElement>;
  pos: { links: number; max: number };
  schuif: (ref: React.RefObject<HTMLDivElement>, richting: -1 | 1) => void;
  wat: string;
  lus?: boolean;
}) {
  const deel = Math.min(1, Math.max(0, pos.links / pos.max));
  const zichtbaar = spoor.current ? spoor.current.clientWidth / spoor.current.scrollWidth : 1;
  return (
    <div className="pc-bediening">
      <button type="button" aria-label={`Vorige ${wat}`} disabled={!lus && pos.links <= 2 && pos.max > 2}
        onClick={() => schuif(spoor, -1)}><IcChevron richting="links" /></button>
      {!lus && (
        <span className="pc-bediening-rail" aria-hidden="true">
          <i style={{ width: `${Math.max(12, zichtbaar * 100)}%`, transform: `translateX(${deel * (100 / Math.max(0.12, zichtbaar) - 100)}%)` }} />
        </span>
      )}
      <button type="button" aria-label={`Volgende ${wat}`} disabled={lus ? false : pos.max <= 2 ? false : pos.links >= pos.max - 2}
        onClick={() => schuif(spoor, 1)}><IcChevron richting="rechts" /></button>
    </div>
  );
}

/**
 * Voor/na-schuif over twee foto's van dezelfde plek.
 *
 * Het slepen wordt hier ZELF afgehandeld met pointer-events, niet overgelaten
 * aan het gedrag van de range-input. Die input is onzichtbaar (opacity 0) en
 * iOS Safari levert daar niet betrouwbaar aanraakgebeurtenissen aan af — op de
 * telefoon bewoog de slider daardoor niet, en ook de muissleep kwam er niet
 * doorheen. Met setPointerCapture volgt de vinger gegarandeerd, ook als hij
 * buiten het beeld komt. De input blijft staan voor het toetsenbord en voor
 * schermlezers.
 */
export function VoorNaSchuif({ voor, na, altVoor, altNa, labelLinks, labelRechts }: {
  voor: string; na: string; altVoor: string; altNa: string;
  labelLinks: string; labelRechts: string;
}) {
  const [deel, setDeel] = useState(50);
  const vat = useRef<HTMLDivElement>(null);
  const sleept = useRef(false);

  const uitPositie = (klientX: number) => {
    const el = vat.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width <= 0) return;
    setDeel(Math.min(100, Math.max(0, ((klientX - r.left) / r.width) * 100)));
  };
  const pak = (e: React.PointerEvent) => {
    sleept.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    uitPositie(e.clientX);
  };
  const volg = (e: React.PointerEvent) => { if (sleept.current) uitPositie(e.clientX); };
  const los = (e: React.PointerEvent) => {
    sleept.current = false;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  return (
    <figure className="pc-vgl">
      <div className="pc-vgl-vat" ref={vat}>
        <img src={voor} alt={altVoor} />
        <img src={na} alt={altNa} style={{ clipPath: `inset(0 0 0 ${deel}%)` }} />
        <div className="pc-vgl-sleep" onPointerDown={pak} onPointerMove={volg}
          onPointerUp={los} onPointerCancel={los} aria-hidden="true" />
        <input type="range" min={0} max={100} step={1} value={Math.round(deel)} className="pc-vgl-bedien"
          aria-label={`Sleep om ${labelLinks.toLowerCase()} en ${labelRechts.toLowerCase()} te vergelijken`}
          onChange={(e) => setDeel(Number(e.target.value))} />
        <span className="pc-vgl-lijn" style={{ left: `${deel}%` }} aria-hidden="true">
          <span className="pc-vgl-greep"><IcChevron richting="links" /><IcChevron richting="rechts" /></span>
        </span>
        <span className="pc-vgl-label pc-vgl-label--l" aria-hidden="true">{labelLinks}</span>
        <span className="pc-vgl-label pc-vgl-label--r" aria-hidden="true">{labelRechts}</span>
      </div>
    </figure>
  );
}
