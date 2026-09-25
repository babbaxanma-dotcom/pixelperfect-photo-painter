import { useEffect, useId, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

/**
 * Eén veld voor postcode of gemeente, met automatische aanvulling.
 *
 * Mohammed, 25 sep: "bij uw gemeente doe postcode of stad, en dan bij invoeren
 * postcode automatisch stad selectie en bij invoeren stad ook automatische
 * selectie, dat het zo smooth voelt".
 *
 * Daarna: "het lukt niet goed op telefoon als je postcode wilt verwijderen" en
 * "het selecteren gaat soms ook automatisch terwijl je het niet wilt". De
 * vorige versie verving de tekst terwijl je typte: "2850" werd meteen "2850
 * Boom", wie verder typte kreeg "2850 Boom Boom", en wie wiste tot "2850" kreeg
 * "2850 Boom" terug. Nu verandert de tekst nooit onder de vingers:
 *
 * - Vier cijfers met één gemeente (2850): eronder staat "✓ 2850 Boom" en die
 *   gemeente gaat mee met het formulier. Bij het verlaten van het veld vult de
 *   tekst aan tot "2850 Boom".
 * - Vier cijfers met deelgemeenten (2830): de keuze verschijnt eronder.
 * - Een naam: voorstellen terwijl u typt; blijft er precies één over die u
 *   volledig typte, dan staat hij eronder als bevestiging.
 * - Het kruisje maakt het veld in één tik leeg.
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
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, ' ').trim();
const toon = (r: Regel) => `${r[0]} ${r[1]}`;

/** Voorstellen en, als er precies één gemeente bij de invoer past, die gemeente. */
function zoek(alle: Regel[], invoer: string): { opties: Regel[]; keuze: Regel | null } {
  const q = norm(invoer);
  if (!q) return { opties: [], keuze: null };
  /* Postcode, eventueel gevolgd door het begin van de naam: "2830 wil". */
  const pc = q.match(/^(\d{1,4})(?:\s+(.*))?$/);
  if (pc) {
    const [, cijfers, rest = ''] = pc;
    let kandidaten = alle.filter(([p]) => p.startsWith(cijfers));
    if (rest) kandidaten = kandidaten.filter(([, n]) => norm(n).startsWith(rest));
    const volledig = cijfers.length === 4;
    return { opties: kandidaten.slice(0, 8), keuze: volledig && kandidaten.length === 1 ? kandidaten[0] : null };
  }
  const begin = alle.filter(([, n]) => norm(n).startsWith(q));
  const midden = alle.filter(([, n]) => !norm(n).startsWith(q) && norm(n).includes(q));
  const exact = begin.filter(([, n]) => norm(n) === q);
  return { opties: [...begin, ...midden].slice(0, 8), keuze: exact.length === 1 && begin.length === 1 ? exact[0] : null };
}

export default function PostcodeGemeente() {
  const id = useId();
  const [tekst, setTekst] = useState('');
  const [keuze, setKeuze] = useState<Regel | null>(null);
  const [opties, setOpties] = useState<Regel[]>([]);
  const [open, setOpen] = useState(false);
  const [actief, setActief] = useState(0);
  const veld = useRef<HTMLInputElement>(null);
  /* Alleen het antwoord op de laatste invoer telt: de lijst laadt de eerste keer
     asynchroon, en een trager antwoord mag een nieuwere invoer niet overschrijven. */
  const teller = useRef(0);

  const kies = (r: Regel) => {
    teller.current++;
    setKeuze(r);
    setTekst(toon(r));
    setOpen(false);
  };

  const wis = () => {
    teller.current++;
    setTekst('');
    setKeuze(null);
    setOpties([]);
    setOpen(false);
    veld.current?.focus();
  };

  const verander = async (waarde: string) => {
    const nr = ++teller.current;
    setTekst(waarde);
    const alle = await laad();
    if (nr !== teller.current) return;
    const { opties: gevonden, keuze: enige } = zoek(alle, waarde);
    setKeuze(enige);
    setOpties(gevonden);
    setActief(0);
    /* Staat de gemeente al vast, dan is de lijst overbodig: de bevestiging staat eronder. */
    setOpen(!enige && gevonden.length > 0);
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
  const bevestig = keuze && tekst !== toon(keuze);

  return (
    <label className="kgj-pg">Postcode of gemeente
      <span className="kgj-pg__veld">
        <input ref={veld} type="text" value={tekst} placeholder="bv. 2830 of Willebroek" autoComplete="off"
          autoCorrect="off" autoCapitalize="words" spellCheck={false}
          inputMode="text" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-lijst`}
          aria-activedescendant={open ? `${id}-${actief}` : undefined}
          onFocus={() => {
            void laad();
            /* Op een telefoon neemt het toetsenbord de onderste helft in; schuif
               het veld naar boven zodat de voorstellen eronder zichtbaar blijven. */
            const r = veld.current?.getBoundingClientRect();
            if (r && window.innerWidth < 1000 && r.top > 120) window.scrollBy({ top: r.top - 100, behavior: 'smooth' });
          }}
          /* Pas bij het verlaten vult de tekst aan tot "2850 Boom". */
          onBlur={() => { if (keuze) setTekst(toon(keuze)); }}
          onChange={(e) => { void verander(e.target.value); }} onKeyDown={toets} />
        {tekst && (
          <button type="button" className="kgj-pg__wis" aria-label="Veld leegmaken"
            onPointerDown={(e) => e.preventDefault()} onClick={wis}>
            <X aria-hidden="true" />
          </button>
        )}
      </span>
      <input type="hidden" name="postcode" value={losPostcode} />
      <input type="hidden" name="gemeente" value={losGemeente} />
      {bevestig && <span className="kgj-pg__ok"><Check aria-hidden="true" />{toon(keuze)}</span>}
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
