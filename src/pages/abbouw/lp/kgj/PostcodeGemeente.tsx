import { useEffect, useId, useRef, useState } from 'react';

/**
 * Eén veld voor postcode of gemeente, met automatische aanvulling.
 *
 * Mohammed, 25 sep: "bij uw gemeente doe postcode of stad, en dan bij invoeren
 * postcode automatisch stad selectie en bij invoeren stad ook automatische
 * selectie, dat het zo smooth voelt".
 *
 * - Vier cijfers met één gemeente (2850): meteen gekozen, "2850 Boom".
 * - Vier cijfers met deelgemeenten (2830): de keuze verschijnt eronder.
 * - Een naam: voorstellen terwijl u typt; blijft er precies één over die u
 *   volledig typte, dan staat hij er meteen.
 *
 * De lijst (bpost-postcodes, 2758 regels, 58 kB) laadt pas bij de eerste
 * aanraking van het veld, zodat de pagina er niet trager van wordt.
 * Postcode en gemeente gaan als twee verborgen velden mee met het formulier.
 */
type Regel = [string, string];
let lijst: Regel[] | null = null;
const laad = async () => {
  if (!lijst) lijst = (await import('@/data/postcodes-be.json')).default as Regel[];
  return lijst;
};
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 -]/g, '').trim();

function zoek(alle: Regel[], invoer: string): Regel[] {
  const q = norm(invoer);
  if (!q) return [];
  if (/^\d+$/.test(q)) return alle.filter(([pc]) => pc.startsWith(q)).slice(0, 8);
  const begin = alle.filter(([, n]) => norm(n).startsWith(q));
  const midden = alle.filter(([, n]) => !norm(n).startsWith(q) && norm(n).includes(q));
  return [...begin, ...midden].slice(0, 8);
}

export default function PostcodeGemeente() {
  const id = useId();
  const [tekst, setTekst] = useState('');
  const [keuze, setKeuze] = useState<Regel | null>(null);
  const [opties, setOpties] = useState<Regel[]>([]);
  const [open, setOpen] = useState(false);
  const [actief, setActief] = useState(0);
  const veld = useRef<HTMLInputElement>(null);

  const kies = (r: Regel) => {
    setKeuze(r);
    setTekst(`${r[0]} ${r[1]}`);
    setOpen(false);
  };

  const verander = async (waarde: string) => {
    setTekst(waarde);
    setKeuze(null);
    const alle = await laad();
    const gevonden = zoek(alle, waarde);
    const q = norm(waarde);
    /* Automatisch kiezen: vier cijfers met één gemeente, of een volledig
       getypte naam die maar één keer voorkomt. */
    if (/^\d{4}$/.test(q) && gevonden.length === 1) { kies(gevonden[0]); return; }
    const exact = gevonden.filter(([, n]) => norm(n) === q);
    if (!/^\d/.test(q) && exact.length === 1 && gevonden.filter(([, n]) => norm(n).startsWith(q)).length === 1) { kies(exact[0]); return; }
    setOpties(gevonden);
    setActief(0);
    setOpen(gevonden.length > 0);
  };

  const toets = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !opties.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActief((a) => (a + 1) % opties.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActief((a) => (a - 1 + opties.length) % opties.length); }
    else if (e.key === 'Enter') { e.preventDefault(); kies(opties[actief]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  /* Klik buiten het veld sluit de lijst. */
  useEffect(() => {
    if (!open) return;
    const weg = (e: PointerEvent) => { if (!veld.current?.parentElement?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', weg);
    return () => document.removeEventListener('pointerdown', weg);
  }, [open]);

  /* Niet gekozen maar wel iets getypt: postcode of naam zoals ingevuld meesturen. */
  const losPostcode = keuze ? keuze[0] : (tekst.match(/\b\d{4}\b/)?.[0] ?? '');
  const losGemeente = keuze ? keuze[1] : tekst.replace(/\b\d{4}\b/, '').trim();

  return (
    <label className="kgj-pg">Postcode of gemeente
      <input ref={veld} type="text" value={tekst} placeholder="bv. 2830 of Willebroek" autoComplete="off"
        inputMode="text" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-lijst`}
        aria-activedescendant={open ? `${id}-${actief}` : undefined}
        onFocus={() => {
          void laad();
          /* Op een telefoon neemt het toetsenbord de onderste helft in; schuif
             het veld naar boven zodat de voorstellen eronder zichtbaar blijven. */
          const r = veld.current?.getBoundingClientRect();
          if (r && window.innerWidth < 1000 && r.top > 120) window.scrollBy({ top: r.top - 100, behavior: 'smooth' });
        }}
        onChange={(e) => { void verander(e.target.value); }} onKeyDown={toets} />
      <input type="hidden" name="postcode" value={losPostcode} />
      <input type="hidden" name="gemeente" value={losGemeente} />
      {open && (
        <ul className="kgj-pg__lijst" id={`${id}-lijst`} role="listbox">
          {opties.map((r, i) => (
            <li key={r[0] + r[1]} id={`${id}-${i}`} role="option" aria-selected={i === actief}
              className={i === actief ? 'is-aan' : undefined}
              onPointerDown={(e) => { e.preventDefault(); kies(r); }}>
              <b>{r[0]}</b> {r[1]}
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}
