/**
 * CalculatorGevel — multi-step gevelrenovatie offerte-wizard.
 * URL: /calculator/gevel
 *
 * 6 stappen (Recotex-style):
 *  1. Aantal gevels (1/2/3/4+) — icon-based
 *  2. Oppervlakte (slider)
 *  3. Isolatie (ja/nee)
 *  4. Timing (zo snel mogelijk / 3mnd / 6mnd / nog niet zeker)
 *  5. Afwerking-voorkeur (crepi / steenstrips / sierpleister / anders)
 *  6. Contactgegevens
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from '../_shell';
import { CONTACT } from '@/data/contact';
import { submitLead } from '@/lib/leads';

import imgCrepi from '@/assets/gevel/witte-crepi.jpg';
import imgCrepiGrijs from '@/assets/gevel/grijze-crepi.jpg';
import imgSteenstrips from '@/assets/gevel/steenstrips.jpg';
import imgSierpleister from '@/assets/gevel/sierpleister.jpg';
import imgIsolatieJa from '@/assets/gevel/lp-anatomy-l2.jpg';
import imgIsolatieNee from '@/assets/gevel/intro.jpg';

type AantalGevels = '1' | '2' | '3' | '4plus';
type Isolatie = 'ja' | 'nee';
type Timing = 'snel' | '3mnd' | '6mnd' | 'onbekend';
type Afwerking = 'crepi' | 'steenstrips' | 'sierpleister' | 'anders';

type State = {
  step: number;
  aantal?: AantalGevels;
  oppervlakte: number;
  isolatie?: Isolatie;
  timing?: Timing;
  afwerking?: Afwerking;
};

const TOTAL_STEPS = 6;

interface CalculatorGevelProps {
  onClose?: () => void;
}

export default function CalculatorGevel({ onClose }: CalculatorGevelProps = {}) {
  const navigate = useNavigate();
  const isModal = !!onClose;
  const [state, setState] = useState<State>({ step: 1, oppervlakte: 80 });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModal) {
      document.title = 'Bereken uw gevelrenovatie-offerte | AB Bouw Groep';
      let m = document.querySelector('meta[name="robots"]');
      if (!m) { m = document.createElement('meta'); m.setAttribute('name','robots'); document.head.appendChild(m); }
      m.setAttribute('content', 'noindex, nofollow');
    }
    const prev = document.body.className;
    if (!isModal) document.body.className = 'is-calc-page';
    const style = document.createElement('style');
    style.textContent = (isModal ? '' : SHELL_STYLE) + CALC_CSS;
    document.head.appendChild(style);
    if (!isModal) window.scrollTo(0, 0);

    let onEsc: ((e: KeyboardEvent) => void) | null = null;
    if (isModal) {
      onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
      window.addEventListener('keydown', onEsc);
    }
    return () => {
      if (!isModal) document.body.className = prev;
      style.remove();
      if (isModal && onEsc) window.removeEventListener('keydown', onEsc);
    };
  }, [isModal, onClose]);
  useAbBouwInteractions();

  const set = (patch: Partial<State>) => setState(prev => ({ ...prev, ...patch }));
  const next = () => set({ step: Math.min(TOTAL_STEPS, state.step + 1) });
  const back = () => set({ step: Math.max(1, state.step - 1) });
  const goTo = (s: number) => set({ step: s });
  const pct = Math.round((state.step / TOTAL_STEPS) * 100);

  const STEP_PSYCHOLOGY: Record<number, { msg: string; timeLeft: string }> = {
    1: { msg: 'Net begonnen', timeLeft: '± 60 sec resterend' },
    2: { msg: 'Goed bezig — nog 4 stappen', timeLeft: '± 50 sec resterend' },
    3: { msg: 'Halverwege', timeLeft: '± 35 sec resterend' },
    4: { msg: 'Nog 2 vraagjes', timeLeft: '± 25 sec resterend' },
    5: { msg: 'Bijna klaar', timeLeft: '± 15 sec resterend' },
    6: { msg: 'Laatste stap — uw contactgegevens', timeLeft: '± 10 sec resterend' },
  };
  const psych = STEP_PSYCHOLOGY[state.step] ?? STEP_PSYCHOLOGY[1];

  const AANTAL_LABELS: Record<AantalGevels, string> = {
    '1': '1 gevel', '2': '2 gevels', '3': '3 gevels', '4plus': '4 of meer',
  };
  const TIMING_LABELS: Record<Timing, string> = {
    snel: 'Zo snel mogelijk', '3mnd': 'Binnen 3 maanden', '6mnd': 'Binnen 6 maanden', onbekend: 'Nog niet zeker',
  };
  const AFWERKING_LABELS: Record<Afwerking, string> = {
    crepi: 'Crepi', steenstrips: 'Steenstrips', sierpleister: 'Sierpleister', anders: 'Andere / weet niet',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const firstName = ((fd.get('firstName') as string) || '').trim();
    const emailV = ((fd.get('email') as string) || '').trim();
    const phoneV = ((fd.get('phone') as string) || '').trim();
    const emailValid = emailV && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailV);
    const phoneValid = phoneV && phoneV.replace(/\D/g, '').length >= 8;

    if (!firstName) {
      setSubmitError('Vul a.u.b. uw voornaam in.');
      form.querySelector<HTMLInputElement>('input[name="firstName"]')?.focus();
      return;
    }
    if (!emailValid) {
      setSubmitError('Vul een geldig e-mailadres in.');
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }
    if (!phoneValid) {
      setSubmitError('Vul uw telefoonnummer in (minstens 8 cijfers).');
      form.querySelector<HTMLInputElement>('input[name="phone"]')?.focus();
      return;
    }

    const subParts: string[] = [];
    if (state.aantal) subParts.push(`Aantal gevels: ${AANTAL_LABELS[state.aantal]}`);
    if (state.oppervlakte) subParts.push(`Oppervlakte: ± ${state.oppervlakte} m²`);
    if (state.isolatie) subParts.push(`Isolatie: ${state.isolatie === 'ja' ? 'gewenst (ETICS)' : 'enkel afwerking'}`);
    if (state.timing) subParts.push(`Timing: ${TIMING_LABELS[state.timing]}`);
    if (state.afwerking) subParts.push(`Afwerking: ${AFWERKING_LABELS[state.afwerking]}`);
    const userMsg = ((fd.get('aanvullende_info') as string) || '').trim();
    const combined = `${subParts.join('\n')}${userMsg ? `\n\nAanvullend:\n${userMsg}` : ''}`;

    setSubmitting(true);
    const result = await submitLead({
      source: 'landing_page',
      landing_division: 'ab_gevelbekleding',
      page_path: window.location.pathname,
      firstName,
      email: emailV || undefined,
      phone: phoneV || undefined,
      type_werk: 'AB Gevelbekleding',
      aanvullende_info: combined,
      bron_lead: 'calculator:gevel',
    });
    setSubmitting(false);

    if (result.ok) {
      navigate('/bedankt?service=gevel');
    } else {
      setSubmitError(`Er ging iets mis. Bel ons gerust op ${CONTACT.phone.spaced} of mail naar ${CONTACT.email}.`);
    }
  };

  const cardJSX = (
    <div className="calc-card" data-reveal>
      <header className="calc-head">
        <button type="button" className="calc-back-link" onClick={() => state.step > 1 ? back() : (isModal ? onClose!() : navigate('/lp/gevel'))} aria-label="Terug">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span>{state.step > 1 ? 'Terug' : (isModal ? 'Sluiten' : 'Terug')}</span>
        </button>
        <span className="calc-head-label">Gevelrenovatie — offerte-wizard</span>
        {isModal && (
          <button type="button" className="calc-modal-x" onClick={onClose} aria-label="Sluiten">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </header>

      <div className="calc-progress-wrap">
        <div className="calc-progress-head">
          <div className="calc-progress-meta">
            <span className="calc-progress-step">Stap {state.step} van {TOTAL_STEPS}</span>
            <span className="calc-progress-msg">{psych.msg}</span>
          </div>
          <div className="calc-progress-pct" key={pct}>
            <span className="calc-progress-pct-num">{pct}</span>
            <span className="calc-progress-pct-sign">%</span>
          </div>
        </div>
        <div className="calc-progress">
          <div className="calc-progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <div className="calc-progress-foot">
          <span className="calc-progress-time">{psych.timeLeft}</span>
          <span className="calc-progress-dots" aria-hidden="true">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span key={i} className={`calc-progress-dot ${i + 1 < state.step ? 'is-done' : i + 1 === state.step ? 'is-current' : ''}`}/>
            ))}
          </span>
        </div>
      </div>

      {/* STAP 1 — Aantal gevels (icon-based, 2x2) */}
      {state.step === 1 && (
        <div className="calc-step">
          <h2 className="calc-q">Hoeveel gevels?</h2>
          <p className="calc-q-sub">Tel zichtbare buitenmuren — <span className="calc-em">niet zeker? Kies dichtstbij</span>.</p>
          <div className="calc-options calc-options-2col calc-icon-grid">
            {(['1', '2', '3', '4plus'] as AantalGevels[]).map(v => (
              <button key={v} type="button"
                className={`calc-icon-card ${state.aantal === v ? 'is-active' : ''}`}
                onClick={() => { set({ aantal: v }); setTimeout(next, 220); }}>
                <div className="calc-icon-wrap" aria-hidden="true">
                  <GevelIcon count={v} />
                </div>
                <span>{AANTAL_LABELS[v]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STAP 2 — Oppervlakte slider */}
      {state.step === 2 && (
        <div className="calc-step">
          <h2 className="calc-q">Hoe groot is de gevel?</h2>
          <p className="calc-q-sub"><span className="calc-em">Een ruwe schatting volstaat</span> — wij meten ter plaatse op.</p>
          <div className="calc-slider-card">
            <div className="calc-slider-value">
              <span className="calc-slider-num">± {state.oppervlakte}</span>
              <span className="calc-slider-unit">m²</span>
            </div>
            <div className="calc-slider-tag">
              {state.oppervlakte < 60 ? 'Kleine gevel' : state.oppervlakte < 130 ? 'Gemiddelde gevel' : state.oppervlakte < 220 ? 'Grote gevel' : 'Zeer grote gevel'}
            </div>
            <input type="range" min={20} max={350} step={5} value={state.oppervlakte}
              onChange={(e) => set({ oppervlakte: Number(e.target.value) })}
              className="calc-slider" aria-label="Oppervlakte in m²"/>
            <div className="calc-slider-range">
              <span>20 m²</span>
              <span>350+ m²</span>
            </div>
          </div>
          <div className="calc-tip">Niet zeker van de oppervlakte? <span className="calc-em">Geen probleem</span> — wij meten alles nauwkeurig op bij <span className="calc-em">het gratis plaatsbezoek</span>.</div>
          <div className="calc-actions">
            <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
            <button type="button" className="calc-btn-primary" onClick={next}>Volgende →</button>
          </div>
        </div>
      )}

      {/* STAP 3 — Isolatie ja/nee */}
      {state.step === 3 && (
        <div className="calc-step">
          <h2 className="calc-q">Wenst u ook isolatie?</h2>
          <p className="calc-q-sub">ETICS-buitenisolatie + crepi = <span className="calc-em">6% BTW</span> + fors warmer huis.</p>
          <div className="calc-options calc-options-2col">
            <button type="button" className={`calc-opt-card ${state.isolatie === 'ja' ? 'is-active' : ''}`} onClick={() => { set({ isolatie: 'ja' }); setTimeout(next, 220); }}>
              <div className="calc-opt-img"><img src={imgIsolatieJa} alt="ETICS isolatie"/></div>
              <div className="calc-opt-body">
                <strong>Ja — ETICS isolatie</strong>
                <span>Buitenisolatie + crepi-afwerking, 6% BTW-tarief</span>
              </div>
            </button>
            <button type="button" className={`calc-opt-card ${state.isolatie === 'nee' ? 'is-active' : ''}`} onClick={() => { set({ isolatie: 'nee' }); setTimeout(next, 220); }}>
              <div className="calc-opt-img"><img src={imgIsolatieNee} alt="Enkel afwerking"/></div>
              <div className="calc-opt-body">
                <strong>Nee — enkel afwerking</strong>
                <span>Crepi, steenstrips of sierpleister zonder isolatie</span>
              </div>
            </button>
          </div>
          <div className="calc-actions">
            <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
          </div>
        </div>
      )}

      {/* STAP 4 — Timing */}
      {state.step === 4 && (
        <div className="calc-step">
          <h2 className="calc-q">Wanneer wilt u starten?</h2>
          <p className="calc-q-sub">Onze planning is meestal <span className="calc-em">4-8 weken vooruit</span> — laat ons weten wat past.</p>
          <div className="calc-options calc-options-1col">
            {([
              { v: 'snel' as Timing, icon: <TimingIconClock/>, desc: 'Plaatsbezoek binnen 5 werkdagen' },
              { v: '3mnd' as Timing, icon: <TimingIconCalendar/>, desc: 'Genoeg tijd voor offerte + planning' },
              { v: '6mnd' as Timing, icon: <TimingIconCalendar/>, desc: 'Comfortabele voorbereiding' },
              { v: 'onbekend' as Timing, icon: <TimingIconQuestion/>, desc: 'Eerst meer info verzamelen' },
            ]).map(opt => (
              <button key={opt.v} type="button"
                className={`calc-opt-row calc-opt-row--icon ${state.timing === opt.v ? 'is-active' : ''}`}
                onClick={() => { set({ timing: opt.v }); setTimeout(next, 220); }}>
                <div className="calc-opt-row-icon" aria-hidden="true">{opt.icon}</div>
                <div className="calc-opt-row-body">
                  <strong>{TIMING_LABELS[opt.v]}</strong>
                  <span>{opt.desc}</span>
                </div>
                <div className="calc-radio"></div>
              </button>
            ))}
          </div>
          <div className="calc-actions">
            <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
          </div>
        </div>
      )}

      {/* STAP 5 — Voorkeur afwerking */}
      {state.step === 5 && (
        <div className="calc-step">
          <h2 className="calc-q">Voorkeur afwerking?</h2>
          <p className="calc-q-sub">Geen idee? <span className="calc-em">Wij adviseren tijdens het plaatsbezoek</span> op basis van uw woning.</p>
          <div className="calc-options calc-options-1col">
            {([
              { v: 'crepi' as Afwerking, img: imgCrepi, desc: 'Sto, Marmolit of Cova — 15+ kleuren beschikbaar' },
              { v: 'steenstrips' as Afwerking, img: imgSteenstrips, desc: 'Authentieke baksteen-look, onderhoudsvrij 30+ jaar' },
              { v: 'sierpleister' as Afwerking, img: imgSierpleister, desc: 'Marmorino e.a. — kunst-look voor speciale gevels' },
            ]).map(opt => (
              <button key={opt.v} type="button"
                className={`calc-opt-row ${state.afwerking === opt.v ? 'is-active' : ''}`}
                onClick={() => { set({ afwerking: opt.v }); setTimeout(next, 220); }}>
                <div className="calc-opt-row-img"><img src={opt.img} alt={AFWERKING_LABELS[opt.v]}/></div>
                <div className="calc-opt-row-body">
                  <strong>{AFWERKING_LABELS[opt.v]}</strong>
                  <span>{opt.desc}</span>
                </div>
                <div className="calc-radio"></div>
              </button>
            ))}
            <button type="button" className={`calc-opt-row calc-opt-row--simple ${state.afwerking === 'anders' ? 'is-active' : ''}`} onClick={() => { set({ afwerking: 'anders' }); setTimeout(next, 220); }}>
              <div className="calc-opt-row-body">
                <strong>Andere / weet ik niet</strong>
                <span>Wij adviseren tijdens het plaatsbezoek</span>
              </div>
              <div className="calc-radio"></div>
            </button>
          </div>
          <div className="calc-actions">
            <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
          </div>
        </div>
      )}

      {/* STAP 6 — Contact */}
      {state.step === 6 && (
        <div className="calc-step">
          <h2 className="calc-q">Bijna klaar — waar mogen we u bereiken?</h2>
          <p className="calc-q-sub">U krijgt <span className="calc-em">binnen één werkdag</span> persoonlijk contact met een <span className="calc-em">vrijblijvende offerte op maat</span>.</p>

          <div className="calc-summary" aria-label="Samenvatting van uw aanvraag">
            <strong>Uw aanvraag in een notendop</strong>
            <ul>
              {state.aantal && <li><span>Aantal gevels</span><span>{AANTAL_LABELS[state.aantal]}</span></li>}
              <li><span>Oppervlakte</span><span>± {state.oppervlakte} m²</span></li>
              {state.isolatie && <li><span>Isolatie</span><span>{state.isolatie === 'ja' ? 'Ja — ETICS' : 'Nee'}</span></li>}
              {state.timing && <li><span>Timing</span><span>{TIMING_LABELS[state.timing]}</span></li>}
              {state.afwerking && <li><span>Afwerking</span><span>{AFWERKING_LABELS[state.afwerking]}</span></li>}
            </ul>
          </div>

          <form className="calc-form" onSubmit={handleSubmit} noValidate>
            <input type="text" name="firstName" placeholder="Voornaam *" required autoComplete="given-name" />
            <input type="tel" name="phone" placeholder="Telefoonnummer *" required autoComplete="tel" inputMode="tel" />
            <input type="email" name="email" placeholder="E-mailadres *" required autoComplete="email" inputMode="email" />
            <p className="calc-form-hint">We bellen u binnen 1 werkdag voor een vrijblijvende prijsindicatie en sturen de offerte na per e-mail.</p>

            {submitError && <p className="calc-error">{submitError}</p>}

            <div className="calc-actions calc-actions-final">
              <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
              <button type="submit" className="calc-btn-primary calc-btn-submit" disabled={submitting}
                style={{ background: '#d98c03', color: '#ffffff', border: 'none' }}>
                {submitting ? 'Even bezig…' : 'Stuur mijn aanvraag →'}
              </button>
            </div>
            <p className="calc-foot"><span className="calc-em">Geen spam.</span> Wij sturen alleen uw offerte. Privacy verklaring op <a href="/privacy">/privacy</a>.</p>
          </form>
        </div>
      )}

      {state.step < 6 && (
        <div className="calc-pager">
          {[1,2,3,4,5,6].map(n => (
            <button key={n} type="button" className={`calc-pager-dot ${state.step >= n ? 'is-done' : ''} ${state.step === n ? 'is-active' : ''}`} onClick={() => state.step > n && goTo(n)} aria-label={`Stap ${n}`}/>
          ))}
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="calc-widget" role="dialog" aria-label="Gevelrenovatie calculator">
        {cardJSX}
      </div>
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: buildNav('home') }} />
      <section className="calc-section">
        <div className="wrap">
          {cardJSX}
          <div className="calc-trust" data-reveal>
            <div className="calc-trust-item"><strong>★ 4,9 / 5</strong><span>184+ reviews</span></div>
            <div className="calc-trust-item"><strong>10 jaar</strong><span>garantie via Federale Verzekering</span></div>
            <div className="calc-trust-item"><strong>Eigen ploeg</strong><span>geen onderaannemers</span></div>
            <div className="calc-trust-item"><strong>Sinds 2010</strong><span>actief in heel Vlaanderen</span></div>
          </div>
        </div>
      </section>
      <div dangerouslySetInnerHTML={{ __html: FOOTER }} />
    </>
  );
}

/* Gevel-count icons — simple SVG, schaalt naar grootte container */
function GevelIcon({ count }: { count: AantalGevels }) {
  // Top-down view: square represents building footprint, N walls highlighted in orange
  // Same visuele metaphor als Recotex (4 zijden rond een vierkant)
  const inactiveColor = "rgba(10,22,40,0.18)";
  const activeColor = "#d98c03";
  const wallW = 6;
  const n = count === '1' ? 1 : count === '2' ? 2 : count === '3' ? 3 : 4;

  return (
    <svg viewBox="0 0 80 80" fill="none">
      {/* Inactive building outline (alle 4 walls in light grey) */}
      <rect x="18" y="18" width="44" height="44" stroke={inactiveColor} strokeWidth={wallW} fill="none"/>
      {/* Door marker — kleine streep onderin midden (signals "front") */}
      <line x1="36" y1="62" x2="44" y2="62" stroke={inactiveColor} strokeWidth={wallW + 2} strokeLinecap="square"/>
      {/* Active walls highlighted */}
      {/* Front (bottom) */}
      {n >= 1 && <line x1="18" y1="62" x2="62" y2="62" stroke={activeColor} strokeWidth={wallW} strokeLinecap="square"/>}
      {/* Right side */}
      {n >= 2 && <line x1="62" y1="18" x2="62" y2="62" stroke={activeColor} strokeWidth={wallW} strokeLinecap="square"/>}
      {/* Back (top) */}
      {n >= 3 && <line x1="18" y1="18" x2="62" y2="18" stroke={activeColor} strokeWidth={wallW} strokeLinecap="square"/>}
      {/* Left side */}
      {n >= 4 && <line x1="18" y1="18" x2="18" y2="62" stroke={activeColor} strokeWidth={wallW} strokeLinecap="square"/>}
      {/* Count badge in center */}
      <text x="40" y="44" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="14" fontWeight="700" fill="rgba(10,22,40,0.85)" style={{ letterSpacing: '-0.5px' }}>
        {count === '4plus' ? '4+' : count}
      </text>
    </svg>
  );
}

function TimingIconClock() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>;
}
function TimingIconCalendar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>;
}
function TimingIconQuestion() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>;
}

const CALC_CSS = `
/* Widget-modus — floating panel rechtsonder */
.calc-widget {
  position: fixed; bottom: 24px; right: 24px;
  width: 420px; max-width: calc(100vw - 32px); max-height: calc(100vh - 48px);
  z-index: 9000; overflow-y: auto; border-radius: 16px;
  box-shadow: 0 24px 64px -16px rgba(10,22,40,0.30), 0 8px 20px -8px rgba(10,22,40,0.18);
  animation: calcSlideUp .35s cubic-bezier(.22,1,.36,1); background: #fff;
}
.calc-widget .calc-card { border: none !important; border-radius: 16px; padding: 20px 22px 24px !important; box-shadow: none; margin: 0; }
@keyframes calcSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.calc-modal-x {
  background: none; border: 1px solid var(--ink-line-soft); width: 32px; height: 32px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center; color: var(--ink-soft); cursor: pointer;
  padding: 0; margin-left: auto; transition: border-color .2s, color .2s, background .2s;
}
.calc-modal-x:hover { border-color: var(--navy); color: var(--navy); background: var(--bg-soft); }
@media (max-width: 720px) {
  .calc-widget { bottom: 12px; right: 12px; left: 12px; width: auto; max-width: none; max-height: calc(100vh - 24px); }
}

.calc-section {
  background: linear-gradient(180deg, var(--bg-soft) 0%, #fff 50%);
  padding: 120px 0 80px; min-height: 100vh;
}
.calc-card {
  max-width: 560px; margin: 0 auto; background: #fff;
  border: 1px solid rgba(10,22,40,0.08); border-radius: 16px;
  padding: 24px 26px 28px; box-shadow: 0 16px 48px -20px rgba(10,22,40,0.18);
}
/* Calc-page chrome: hide site nav + footer */
body.is-calc-page .lf-nav,
body.is-calc-page nav.lf-nav,
body.is-calc-page footer.footer,
body.is-calc-page .lf-fab-call,
body.is-calc-page .lf-mobile-bar { display: none !important; }
body.is-calc-page .scroll-progress { display: none !important; }

@media (max-width: 720px) {
  /* Mobile width fix: .wrap padding eet ruimte op kleine schermen — strip op calc-page */
  body.is-calc-page .wrap { padding-left: 8px !important; padding-right: 8px !important; max-width: 100% !important; }
  .calc-section { padding: 14px 0 18px; min-height: auto; }
  .calc-card { padding: 16px 14px 20px; border-radius: 12px; max-width: 100%; width: 100%; box-shadow: none; border: 1px solid rgba(10,22,40,0.06); }
  /* Icon-grid op mobile in 2 kolommen, vierkant aspect voor mooi gebouw-icon */
  .calc-icon-grid { grid-template-columns: 1fr 1fr !important; gap: 10px; }
  .calc-icon-card { aspect-ratio: 1.2 / 1; padding: 14px 8px; }
  .calc-head { margin-bottom: 10px; padding-bottom: 8px; }
  .calc-head-label { font-size: 12px; }
  .calc-progress-wrap { margin-bottom: 12px; }
  .calc-progress-head { margin-bottom: 6px; }
  .calc-progress-msg { font-size: 13px; }
  .calc-progress { height: 5px; }
  .calc-progress-foot { margin-top: 6px; }
  .calc-q { font-size: 18px !important; line-height: 1.25; }
  .calc-q-sub { font-size: 12.5px; margin-bottom: 12px; line-height: 1.4; }
  .calc-options { gap: 8px; margin-bottom: 10px; }
  .calc-opt-img { aspect-ratio: 16 / 6; }
  .calc-opt-body { padding: 8px 11px 10px; }
  .calc-opt-body strong { font-size: 14px; }
  .calc-opt-body span { font-size: 11.5px; line-height: 1.35; }
  .calc-opt-row { grid-template-columns: 60px 1fr auto; gap: 10px; padding: 8px 10px 8px 8px; }
  .calc-opt-row-img { width: 60px; height: 46px; }
  .calc-opt-row--icon { grid-template-columns: 34px 1fr auto; gap: 10px; padding: 9px 11px; }
  .calc-opt-row-icon { width: 34px; height: 34px; border-radius: 8px; }
  .calc-opt-row-body strong { font-size: 13.5px; }
  .calc-opt-row-body span { font-size: 11.5px; }
  .calc-icon-card { padding: 12px 8px; }
  .calc-icon-wrap { width: 38px; height: 38px; }
  .calc-icon-card span { font-size: 12.5px; }
  .calc-slider-card { padding: 14px 14px 12px; margin-bottom: 10px; }
  .calc-slider-num { font-size: 32px !important; }
  .calc-slider-tag { margin: 4px 0 12px; font-size: 10.5px; }
  .calc-tip { padding: 8px 10px; font-size: 11.5px; margin-bottom: 10px; }
  .calc-actions { margin-top: 10px; gap: 8px; }
  .calc-btn-ghost, .calc-btn-primary { padding: 11px 16px; font-size: 13px; }
  .calc-trust, .calc-pager { display: none; }
  .calc-summary { padding: 12px 14px; margin-bottom: 14px; }
  .calc-summary li { font-size: 12px; padding: 4px 0; }
  .calc-form input, .calc-form textarea { padding: 11px 12px; font-size: 14px; }
}

.calc-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--ink-line-soft); }
.calc-back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--ink-soft); padding: 4px 0; border: none; background: none; cursor: pointer; }
.calc-back-link:hover { color: var(--navy); }
.calc-head-label { font-size: 13px; font-weight: 600; color: var(--navy); letter-spacing: 0.02em; }

.calc-progress-wrap { margin-bottom: 24px; }
.calc-progress-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 10px; }
.calc-progress-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.calc-progress-step { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-mute); }
.calc-progress-msg { font-size: 14.5px; font-weight: 700; color: var(--navy); letter-spacing: -0.01em; line-height: 1.2; }
.calc-progress-pct { display: inline-flex; align-items: baseline; color: var(--accent); animation: calcPctPop .35s cubic-bezier(.22,1,.36,1); flex-shrink: 0; }
.calc-progress-pct-num { font-family: var(--font-display); font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
.calc-progress-pct-sign { font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-left: 2px; opacity: 0.7; }
@keyframes calcPctPop { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
.calc-progress { background: rgba(10,22,40,0.06); height: 7px; border-radius: 999px; overflow: hidden; position: relative; }
.calc-progress-bar { height: 100%; background: linear-gradient(90deg, #d98c03 0%, #f0a93d 100%); border-radius: 999px; transition: width .45s cubic-bezier(.22,1,.36,1); box-shadow: 0 1px 3px rgba(217,140,3,0.4); }
.calc-progress-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 8px; }
.calc-progress-time { font-size: 12px; color: var(--ink-soft); font-weight: 500; }
.calc-progress-dots { display: inline-flex; align-items: center; gap: 6px; }
.calc-progress-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(10,22,40,0.16); transition: background .3s ease, transform .3s ease; }
.calc-progress-dot.is-done { background: var(--accent); }
.calc-progress-dot.is-current { background: var(--accent); transform: scale(1.4); box-shadow: 0 0 0 4px rgba(217,140,3,0.18); }

.calc-step { animation: calcFadeIn .35s cubic-bezier(.22,1,.36,1); }
@keyframes calcFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.calc-q { font-family: var(--font-display); font-size: clamp(20px, 2.6vw, 25px); font-weight: 600; line-height: 1.2; color: var(--navy); margin: 0 0 6px; }
.calc-q-sub { font-size: 13.5px; color: var(--ink-soft); line-height: 1.5; margin: 0 0 20px; }
.calc-em { color: var(--navy); font-weight: 700; background: linear-gradient(transparent 62%, rgba(217,140,3,0.28) 62%); padding: 0 3px; border-radius: 2px; }
.calc-tip .calc-em { color: var(--navy); background: linear-gradient(transparent 62%, rgba(217,140,3,0.4) 62%); }
.calc-foot .calc-em { color: var(--navy); background: none; }

.calc-options { display: grid; gap: 10px; margin-bottom: 16px; }
.calc-options-2col { grid-template-columns: 1fr 1fr; }
.calc-options-1col { grid-template-columns: 1fr; }
@media (max-width: 480px) { .calc-options-2col { grid-template-columns: 1fr 1fr; } }

/* Icon-card (step 1 — aantal gevels) — top-down gebouw-view */
.calc-icon-grid { gap: 10px; }
.calc-icon-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; padding: 20px 12px;
  background: #fff; border: 2px solid var(--ink-line-soft); border-radius: 12px;
  cursor: pointer; transition: border-color .2s, transform .2s, box-shadow .2s;
  font: inherit; text-align: center; color: var(--navy);
}
.calc-icon-card:hover { border-color: #d98c03; transform: translateY(-2px); }
.calc-icon-card.is-active {
  border-color: #d98c03;
  background: linear-gradient(180deg, #fff 60%, rgba(217,140,3,0.04) 100%);
  box-shadow: 0 0 0 4px rgba(217,140,3,0.15);
}
.calc-icon-wrap { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; }
.calc-icon-wrap svg { width: 100%; height: 100%; }
.calc-icon-card span { font-size: 14px; font-weight: 700; color: var(--navy); letter-spacing: -0.01em; }
@media (max-width: 480px) {
  .calc-icon-card { padding: 14px 8px; gap: 6px; }
  .calc-icon-wrap { width: 64px; height: 64px; }
  .calc-icon-card span { font-size: 13.5px; }
}

/* Card-style options (photo on top) */
.calc-opt-card {
  display: flex; flex-direction: column; background: #fff;
  border: 2px solid var(--ink-line-soft); border-radius: 14px; overflow: hidden;
  cursor: pointer; padding: 0; font: inherit; text-align: left;
  transition: border-color .2s, transform .2s, box-shadow .2s; position: relative;
}
.calc-opt-card:hover { border-color: #d98c03; transform: translateY(-2px); box-shadow: 0 10px 24px -10px rgba(10,22,40,0.22); }
.calc-opt-card.is-active { border-color: #d98c03; background: #fff; box-shadow: 0 0 0 4px rgba(217,140,3,0.15); }
.calc-opt-card.is-active::after {
  content: '✓'; position: absolute; top: 10px; right: 10px;
  width: 28px; height: 28px; border-radius: 50%; background: #d98c03; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700;
  box-shadow: 0 4px 12px -2px rgba(217,140,3,0.6);
}
.calc-opt-img { aspect-ratio: 16 / 10; overflow: hidden; background: var(--bg-soft); }
.calc-opt-img img { width: 100%; height: 100%; object-fit: cover; }
.calc-opt-body { padding: 12px 14px 14px; }
.calc-opt-body strong { display: block; color: var(--navy); font-size: 15px; font-weight: 700; margin-bottom: 3px; line-height: 1.25; }
.calc-opt-body span { display: block; color: var(--ink-soft); font-size: 12.5px; line-height: 1.4; }

/* Row-style options */
.calc-opt-row {
  display: grid; grid-template-columns: 90px 1fr auto; gap: 14px; align-items: center;
  background: #fff; border: 2px solid var(--ink-line-soft); border-radius: 12px;
  padding: 10px 14px 10px 10px; cursor: pointer; font: inherit; text-align: left;
  transition: border-color .2s, background .2s, transform .2s;
}
.calc-opt-row--simple { grid-template-columns: 1fr auto; padding: 14px 16px; }
.calc-opt-row--icon { grid-template-columns: 40px 1fr auto; padding: 12px 14px; }
.calc-opt-row:hover { border-color: #d98c03; transform: translateX(2px); }
.calc-opt-row.is-active { border-color: #d98c03; background: #fff; box-shadow: 0 0 0 4px rgba(217,140,3,0.12); }
.calc-opt-row-img { width: 90px; height: 68px; border-radius: 8px; overflow: hidden; background: var(--bg-soft); }
.calc-opt-row-img img { width: 100%; height: 100%; object-fit: cover; }
.calc-opt-row-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(217,140,3,0.10); color: var(--accent); display: flex; align-items: center; justify-content: center; }
.calc-opt-row-body strong { display: block; color: var(--navy); font-size: 15px; font-weight: 700; margin-bottom: 2px; line-height: 1.25; }
.calc-opt-row-body span { display: block; color: var(--ink-soft); font-size: 12.5px; line-height: 1.4; }
.calc-radio { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--ink-line-soft); background: #fff; transition: border-color .2s, background .2s; position: relative; flex-shrink: 0; }
.calc-opt-row.is-active .calc-radio { border-color: #d98c03; background: #d98c03; }
.calc-opt-row.is-active .calc-radio::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 7px; height: 7px; border-radius: 50%; background: #fff; }
@media (max-width: 480px) {
  .calc-opt-row { grid-template-columns: 70px 1fr auto; gap: 10px; padding: 8px 12px 8px 8px; }
  .calc-opt-row-img { width: 70px; height: 52px; }
  .calc-opt-row--icon { grid-template-columns: 36px 1fr auto; }
}

/* Slider */
.calc-slider-card { background: var(--bg-soft); border: 1px solid var(--ink-line-soft); border-radius: 12px; padding: 22px 20px 16px; text-align: center; margin-bottom: 14px; }
.calc-slider-value { display: flex; align-items: baseline; justify-content: center; gap: 6px; }
.calc-slider-num { font-family: var(--font-display); font-size: clamp(34px, 5vw, 48px); font-weight: 600; color: var(--accent); line-height: 1; }
.calc-slider-unit { font-size: 16px; font-weight: 600; color: var(--navy); }
.calc-slider-tag { font-size: 11px; font-weight: 700; color: var(--ink-soft); letter-spacing: 0.1em; text-transform: uppercase; margin: 4px 0 18px; }
.calc-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; background: rgba(10,22,40,0.12); outline: none; }
.calc-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 4px 12px -2px rgba(217,140,3,0.5); border: 3px solid #fff; }
.calc-slider::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 4px 12px -2px rgba(217,140,3,0.5); border: 3px solid #fff; }
.calc-slider-range { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-mute); margin-top: 5px; }
.calc-tip { background: rgba(217,140,3,0.08); border-left: 3px solid var(--accent); padding: 10px 12px; font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; border-radius: 0 8px 8px 0; margin-bottom: 16px; }

.calc-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; gap: 10px; }
.calc-actions-final { flex-direction: column; gap: 8px; align-items: stretch; }
@media (min-width: 540px) { .calc-actions-final { flex-direction: row; align-items: center; } }
.calc-btn-ghost { background: none; border: 1px solid var(--ink-line-soft); padding: 10px 18px; border-radius: 8px; color: var(--ink-soft); font-size: 13.5px; font-weight: 600; cursor: pointer; transition: border-color .2s, color .2s; }
.calc-btn-ghost:hover { border-color: var(--navy); color: var(--navy); }
.calc-btn-primary { background: #d98c03 !important; color: #ffffff !important; border: none !important; padding: 12px 24px; border-radius: 8px; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: background .2s, transform .2s; box-shadow: 0 6px 16px -4px rgba(217,140,3,0.45); }
.calc-btn-primary:hover { background: #b87502 !important; color: #ffffff !important; transform: translateY(-1px); }
.calc-btn-primary:disabled { opacity: .6; cursor: wait; }
.calc-btn-submit { padding: 12px 20px; flex: 1; }

.calc-pager { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
.calc-pager-dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: var(--ink-line-soft); cursor: pointer; padding: 0; transition: background .2s, transform .2s; }
.calc-pager-dot.is-done { background: var(--accent); }
.calc-pager-dot.is-active { background: var(--accent); transform: scale(1.4); }

.calc-summary { background: var(--bg-soft); border-radius: 10px; padding: 14px 16px; margin-bottom: 18px; }
.calc-summary strong { display: block; color: var(--navy); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
.calc-summary ul { list-style: none; padding: 0; margin: 0; }
.calc-summary li { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; border-bottom: 1px solid var(--ink-line-soft); }
.calc-summary li:last-child { border-bottom: none; }
.calc-summary li span:first-child { color: var(--ink-soft); }
.calc-summary li span:last-child { color: var(--navy); font-weight: 600; }

.calc-form { display: grid; gap: 10px; }
.calc-form input, .calc-form textarea {
  width: 100%; padding: 12px 14px; border: 1px solid var(--ink-line-soft); border-radius: 9px;
  font: inherit; font-size: 14px; color: var(--navy); background: #fff; transition: border-color .2s;
}
.calc-form input:focus, .calc-form textarea:focus { outline: none; border-color: var(--accent); }
.calc-form-hint { font-size: 12px; color: var(--ink-mute); margin: 2px 2px 0; line-height: 1.4; }
.calc-error { font-size: 13px; color: #c4523f; padding: 8px 11px; background: #fcebe5; border-radius: 7px; margin: 0; }
.calc-foot { font-size: 11px; color: var(--ink-mute); margin: 2px 0 0; text-align: center; }
.calc-foot a { color: var(--accent); }

.calc-trust { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; max-width: 560px; margin: 24px auto 0; padding: 16px 8px; }
@media (max-width: 720px) { .calc-trust { grid-template-columns: 1fr 1fr; gap: 14px 10px; } }
.calc-trust-item { text-align: center; }
.calc-trust-item strong { display: block; font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--navy); margin-bottom: 2px; }
.calc-trust-item span { display: block; font-size: 11px; color: var(--ink-soft); line-height: 1.4; }
`;
