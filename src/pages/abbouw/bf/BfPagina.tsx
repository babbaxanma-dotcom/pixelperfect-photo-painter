/**
 * Omhulsel van elke pagina in de BF-stijl (spec/bf-stijl.md §4).
 *
 * De markup is één HTML-string (schil.ts + blokken.ts), net als de BF-sjablonen.
 * Dit component zet hem in <div class="bf">, zet titel, beschrijving en canonical
 * (zoals LpReplica.tsx r.435-452) en hangt het gedrag eraan (gedrag.ts), met
 * opruimen bij het verlaten van de pagina.
 *
 * bf.css is volledig gescoped onder .bf (scripts/bf-css-port.cjs): na een
 * SPA-navigatie blijft het bestand geladen maar raakt het geen enkele andere pagina.
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { wireBf } from './gedrag';
import './bf.css';
import './bf-ab.css';

type Props = {
  html: string;
  titel: string;
  omschrijving: string;
  /** pad voor de canonical, bv. '/' */
  pad: string;
  /** sleutel van de pagina voor de leadbron en de metingen, bv. 'home' */
  bron: string;
};

export default function BfPagina({ html, titel, omschrijving, pad, bron }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = titel;
    const zet = (kies: string, maak: () => Element, attr: string, waarde: string) => {
      let el = document.querySelector(kies);
      if (!el) { el = maak(); document.head.appendChild(el); }
      el.setAttribute(attr, waarde);
    };
    zet('meta[name="description"]', () => { const m = document.createElement('meta'); m.setAttribute('name', 'description'); return m; }, 'content', omschrijving);
    zet('link[rel="canonical"]:not([hreflang])', () => { const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l; }, 'href', `https://abgroep.be${pad}`);
  }, [titel, omschrijving, pad]);

  useEffect(() => {
    if (!ref.current) return;
    // bovenaan beginnen, behalve met een #anker in het adres (gedrag.ts springt daar zelf naartoe).
    // 'instant': 'auto' volgt html { scroll-behavior: smooth } (ab-bouw.css r.76) en schoof bij elke paginawissel zichtbaar door de pagina
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return wireBf(ref.current, { navigate, bron });
    // navigate is stabiel binnen de router; opnieuw aanzetten hoort alleen bij nieuwe markup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, bron]);

  return <div className="bf" ref={ref} data-track-source={bron} dangerouslySetInnerHTML={{ __html: html }} />;
}
