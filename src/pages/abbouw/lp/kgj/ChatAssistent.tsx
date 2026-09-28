import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Calculator, CalendarCheck, MessageCircle, Phone, X } from 'lucide-react';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import type { KgjInhoud } from './inhoud';

/**
 * Digitale assistent op /lp/dakwerken en /lp/totaalrenovatie (Mohammed, 28 sep
 * 2026: "AI chat assistente die alles weet van AB Bouwgroep, maar ... nooit een
 * prijs doorgeeft", "belangrijke, snelle functies" en "geef ook de particulier
 * ruimte voor andere vragen").
 *
 * Opbouw naar de AI van Trustlocal, maar over AB alleen:
 *   - Drie snelle functies bovenaan: prijs berekenen, gratis afspraak aanvragen,
 *     bellen. Daaronder vragen die bezoekers vaak hebben.
 *   - De AI stelt bij een aanvraag één vraag tegelijk, met klikbare antwoorden,
 *     en vraagt niet opnieuw wat al gezegd is.
 *   - Is de aanvraag rond, dan staat ze ingevuld in een kaart: de bezoeker vult
 *     alleen nog zijn telefoonnummer in. Die kaart verstuurt dezelfde lead als het
 *     formulier "Plan uw dakinspectie" onderaan (zelfde bron_lead), dus in GHL
 *     verandert er niets; de chat komt erbij in aanvullende_info.
 *
 * De AI draait op de server (api/chat.js). Zonder sleutel antwoordt die met
 * gereed:false en toont de pagina geen chatknop: niets dat faalt.
 */
type Actie = 'geen' | 'rekenaar' | 'aanvraag' | 'bellen';
type Aanvraag = { klaar: boolean; titel: string; velden: { label: string; waarde: string }[]; bericht: string };
type Bericht = {
  rol: 'bezoeker' | 'assistent'; tekst: string;
  keuzes?: string[]; suggesties?: string[]; actie?: Actie; aanvraag?: Aanvraag;
};

const TEKST = {
  dakwerken: {
    welkom: 'Dag, welkom bij AB Bouw Groep. Stel gerust uw vraag over uw dak, of kies hieronder.',
    afspraak: 'Gratis dakinspectie aanvragen',
    start: 'Ik wil een gratis dakinspectie aanvragen.',
    vaak: ['Hoelang duren de werken aan mijn dak?', 'Welke garantie krijg ik?', 'Krijg ik een premie voor dakisolatie?', 'Werken jullie in mijn gemeente?'],
  },
  totaalrenovatie: {
    welkom: 'Dag, welkom bij AB Bouw Groep. Stel gerust uw vraag over uw renovatie, of kies hieronder.',
    afspraak: 'Gratis plaatsbezoek aanvragen',
    start: 'Ik wil een gratis plaatsbezoek aanvragen.',
    vaak: ['Kan ik in huis blijven wonen tijdens de werken?', 'Hoe zit het met meerwerk?', 'Moet ik alles in één keer doen?', 'Op welke premies heb ik recht?'],
  },
} as const;

const MAX_TEKENS = 800;

export default function ChatAssistent({ inhoud, balk, opRekenaar }: {
  inhoud: KgjInhoud;
  /** De vaste actiebalk onderaan de telefoon staat in beeld: de knop schuift erboven. */
  balk: boolean;
  opRekenaar: () => void;
}) {
  const pagina = inhoud.bedanktSlug === 'totaalrenovatie' ? 'totaalrenovatie' : 'dakwerken';
  const t = TEKST[pagina];
  const opslag = `ab_chat_${pagina}`;
  const navigate = useNavigate();
  const [gereed, setGereed] = useState(false);
  const [open, setOpen] = useState(false);
  const [berichten, setBerichten] = useState<Bericht[]>(() => {
    try { return JSON.parse(sessionStorage.getItem(opslag) || '[]'); } catch { return []; }
  });
  const [invoer, setInvoer] = useState('');
  const [bezig, setBezig] = useState(false);
  const lijst = useRef<HTMLDivElement>(null);
  const veld = useRef<HTMLTextAreaElement>(null);
  const gestart = useRef(false);

  /* Staat de assistent aan (sleutel op de server)? Anders geen knop. */
  useEffect(() => {
    let weg = false;
    fetch('/api/chat').then((r) => (r.ok ? r.json() : null)).then((d) => { if (!weg && d && d.gereed === true) setGereed(true); }).catch(() => {});
    return () => { weg = true; };
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem(opslag, JSON.stringify(berichten.slice(-40))); } catch { /* privévenster */ }
    /* Ook bij het openen: wie terugkomt in een lopend gesprek, ziet het laatste bericht. */
    lijst.current?.scrollTo({ top: lijst.current.scrollHeight, behavior: 'smooth' });
  }, [berichten, bezig, opslag, open]);

  /* Op de telefoon vult het venster het scherm; de pagina eronder scrolt dan niet mee. */
  useEffect(() => {
    if (!open || window.innerWidth > 640) return;
    const vorig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = vorig; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const toets = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', toets);
    /* Alleen met een muis meteen in het tekstvak: op een telefoon springt anders
       het toetsenbord over het gesprek (zoals bij de calculator, 24 sep). */
    if (window.matchMedia('(pointer: fine)').matches) veld.current?.focus();
    return () => document.removeEventListener('keydown', toets);
  }, [open]);

  const stuur = async (tekst: string) => {
    const schoon = tekst.trim().slice(0, MAX_TEKENS);
    if (!schoon || bezig) return;
    if (!gestart.current) { gestart.current = true; trackFormStart(`${inhoud.inspectie.bronLead}:chat`); }
    const nieuw: Bericht[] = [...berichten, { rol: 'bezoeker', tekst: schoon }];
    setBerichten(nieuw);
    setInvoer('');
    setBezig(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pagina, berichten: nieuw.map(({ rol, tekst: x }) => ({ rol, tekst: x })) }),
      });
      const d = await r.json();
      setBerichten([...nieuw, {
        rol: 'assistent', tekst: String(d.antwoord || ''), keuzes: d.keuzes || [], suggesties: d.suggesties || [],
        actie: d.actie || 'geen', aanvraag: d.aanvraag,
      }]);
    } catch {
      setBerichten([...nieuw, { rol: 'assistent', tekst: `Het lukt even niet om te antwoorden. Bel ons gerust op ${CONTACT.phone.display}.`, actie: 'bellen' }]);
    } finally {
      setBezig(false);
    }
  };

  const actie = (a: Actie) => {
    if (a === 'rekenaar') { setOpen(false); opRekenaar(); }
    else if (a === 'aanvraag') stuur(t.start);
    else if (a === 'bellen') window.location.href = CONTACT.phone.href;
  };

  const laatste = berichten[berichten.length - 1];
  const kaart = laatste?.rol === 'assistent' && laatste.aanvraag?.klaar ? laatste.aanvraag : null;

  if (!gereed) return null;

  return (
    <>
      {!open && (
        <button type="button" className={`kgj-chatknop${balk ? ' is-hoog' : ''}`} onClick={() => setOpen(true)}
          aria-label="Stel uw vraag aan onze digitale assistent">
          <MessageCircle aria-hidden="true" /><span>Stel uw vraag</span>
        </button>
      )}
      {open && (
        <div className="kgj-chat" role="dialog" aria-modal="false" aria-label="Digitale assistent van AB Bouw Groep">
          <div className="kgj-chat__kop">
            <span className="kgj-chat__merk" aria-hidden="true">AB</span>
            <div>
              <p className="kgj-chat__naam">AB Bouw Groep</p>
              <p className="kgj-chat__sub">Digitale assistent (AI)</p>
            </div>
            <button type="button" className="kgj-chat__dicht" onClick={() => setOpen(false)} aria-label="Chat sluiten"><X /></button>
          </div>

          <div className="kgj-chat__lijst" ref={lijst} aria-live="polite">
            <div className="kgj-chat__bel kgj-chat__bel--ai">{t.welkom}</div>
            <div className="kgj-chat__snel">
              <button type="button" onClick={() => actie('rekenaar')}><Calculator aria-hidden="true" />Bereken mijn prijs</button>
              <button type="button" onClick={() => actie('aanvraag')} disabled={bezig}><CalendarCheck aria-hidden="true" />{t.afspraak}</button>
              <a href={CONTACT.phone.href}><Phone aria-hidden="true" />Bel {CONTACT.phone.display}</a>
            </div>
            {berichten.length === 0 && (
              <div className="kgj-chat__vaak">
                <p>Vaak gevraagd</p>
                {t.vaak.map((v) => <button type="button" key={v} onClick={() => stuur(v)}>{v}</button>)}
              </div>
            )}

            {berichten.map((b, i) => {
              const isLaatste = i === berichten.length - 1;
              return (
                <div key={i} className="kgj-chat__beurt">
                  {/* Vaste spatie na het euroteken: "€" en "5.750" nooit op twee regels. */}
                  <div className={`kgj-chat__bel kgj-chat__bel--${b.rol === 'bezoeker' ? 'mens' : 'ai'}`}>{b.tekst.replace(/€ /g, '€\u00a0')}</div>
                  {b.rol === 'assistent' && isLaatste && !bezig && (
                    <>
                      {b.keuzes && b.keuzes.length > 0 && (
                        <div className="kgj-chat__keuzes">
                          {b.keuzes.map((k) => <button type="button" key={k} onClick={() => stuur(k)}>{k}</button>)}
                        </div>
                      )}
                      {!b.aanvraag?.klaar && b.actie && b.actie !== 'geen' && (
                        <button type="button" className="kgj-chat__actie" onClick={() => actie(b.actie!)}>
                          {b.actie === 'rekenaar' && <><Calculator aria-hidden="true" />Bereken mijn prijs</>}
                          {b.actie === 'aanvraag' && <><CalendarCheck aria-hidden="true" />{t.afspraak}</>}
                          {b.actie === 'bellen' && <><Phone aria-hidden="true" />Bel {CONTACT.phone.display}</>}
                        </button>
                      )}
                      {b.suggesties && b.suggesties.length > 0 && !b.keuzes?.length && (
                        <div className="kgj-chat__vaak kgj-chat__vaak--na">
                          <p>Andere vragen</p>
                          {b.suggesties.map((v) => <button type="button" key={v} onClick={() => stuur(v)}>{v}</button>)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            {bezig && <div className="kgj-chat__bel kgj-chat__bel--ai kgj-chat__typt" aria-label="Aan het typen"><i /><i /><i /></div>}
            {kaart && !bezig && <AanvraagKaart inhoud={inhoud} aanvraag={kaart} gesprek={berichten} onVerstuurd={(slug) => navigate('/bedankt?dienst=' + slug)} />}
          </div>

          <form className="kgj-chat__invoer" onSubmit={(e) => { e.preventDefault(); stuur(invoer); }}>
            <textarea ref={veld} rows={1} value={invoer} maxLength={MAX_TEKENS} placeholder="Typ uw vraag…"
              aria-label="Uw vraag" onChange={(e) => setInvoer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); stuur(invoer); } }} />
            <button type="submit" disabled={bezig || !invoer.trim()} aria-label="Versturen"><ArrowUp /></button>
          </form>
          <p className="kgj-chat__voet">Antwoorden komen van een AI-assistent. <a href="/privacy">Privacybeleid</a></p>
        </div>
      )}
    </>
  );
}

/** De ingevulde aanvraag: alleen het telefoonnummer is nog nodig. */
function AanvraagKaart({ inhoud, aanvraag, gesprek, onVerstuurd }: {
  inhoud: KgjInhoud; aanvraag: Aanvraag; gesprek: Bericht[]; onVerstuurd: (slug: string) => void;
}) {
  const [bericht, setBericht] = useState(aanvraag.bericht);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const telefoon = String(f.get('telefoon') || '').trim();
    /* Dezelfde drempel als de calculator en de lead-pijplijn: acht cijfers. */
    if (!telefoon) { setFout('Vul uw telefoonnummer in. Wij bellen u om een moment af te spreken.'); return; }
    if (telefoon.replace(/\D/g, '').length < 8) { setFout('Dat telefoonnummer lijkt niet volledig. Controleer het even.'); return; }
    setFout(null);
    setBezig(true);
    const gemeente = aanvraag.velden.find((v) => /gemeente/i.test(v.label))?.waarde;
    const vragen = gesprek.filter((b) => b.rol === 'bezoeker').length;
    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: inhoud.divisie,
      firstName: String(f.get('naam') || '').trim() || undefined,
      email: String(f.get('email') || '').trim(),
      phone: telefoon,
      gemeente: gemeente || undefined,
      type_werk: inhoud.divisie,
      aanvullende_info: [
        `Aanvraag ${inhoud.cta.kop.toLowerCase()} via de chat (${vragen} berichten)`,
        ...aanvraag.velden.map((v) => `${v.label}: ${v.waarde}`),
        bericht.trim() ? `Bericht: ${bericht.trim()}` : '',
      ].filter(Boolean).join(' · '),
      /* Dezelfde bron als het formulier onderaan: GHL behandelt het als die aanvraag. */
      bron_lead: inhoud.inspectie.bronLead,
    });
    setBezig(false);
    if (res.ok) onVerstuurd(inhoud.bedanktSlug);
    else setFout(leadFoutmelding(res, CONTACT.phone.display));
  };

  return (
    <form className="kgj-chat__kaart" onSubmit={verstuur} noValidate>
      <p className="kgj-chat__kaartkop">{aanvraag.titel || inhoud.cta.kop}</p>
      {aanvraag.velden.length > 0 && (
        <dl className="kgj-chat__velden">
          {aanvraag.velden.map((v) => (<div key={v.label}><dt>{v.label}</dt><dd>{v.waarde}</dd></div>))}
        </dl>
      )}
      <label>Uw bericht
        <textarea name="bericht" rows={4} value={bericht} onChange={(e) => setBericht(e.target.value)} />
      </label>
      <label>Telefoon *
        <input name="telefoon" type="tel" autoComplete="tel" inputMode="tel" placeholder="04xx xx xx xx" aria-required="true" />
      </label>
      <div className="kgj-chat__rij">
        <label>Naam<input name="naam" type="text" autoComplete="name" placeholder="Uw naam" /></label>
        <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="uw@email.be" /></label>
      </div>
      <button className="kgj-knop kgj-knop--vol kgj-chat__verstuur" type="submit" disabled={bezig}>
        {bezig ? 'Bezig…' : inhoud.inspectie.knop}
      </button>
      <p className="kgj-chat__klein">{inhoud.inspectie.onder}</p>
      {fout && <p className="kgj-reken__fout" role="alert">{fout}</p>}
    </form>
  );
}
