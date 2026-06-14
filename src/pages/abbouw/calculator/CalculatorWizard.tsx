/**
 * CalculatorWizard — generieke, config-gedreven offerte-wizard.
 *
 * Zelfde lead-magnet patroon als CalculatorDak (Recotex-style: meerdere stappen,
 * contactform pas op het einde → sunk-cost + reciprocity → hogere CVR), maar
 * de vraag-flow komt uit een per-dienst config (zie dakCalcConfigs.ts). Zo krijgt
 * elke dienst-LP (velux, dakisolatie, platdak) zijn EIGEN, dienst-specifieke vragen
 * i.p.v. één blanket-calculator. CalculatorDak blijft ongemoeid (live).
 *
 * Submit → zelfde submitLead() (GHL-webhook + Ads-conversie) → /bedankt?service=<slug>.
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from '../_shell';
import { CONTACT } from '@/data/contact';
import { submitLead, type Divisie } from '@/lib/leads';

export type CalcOption = {
  key: string;
  label: string;
  desc: string;
  /** foto links (rows) of bovenaan (cards). Weglaten = simpele tekst-rij. */
  img?: string;
};

export type CalcStep =
  | { id: string; kind: 'cards' | 'rows'; q: string; sub: string; summary: string; options: CalcOption[] }
  | { id: string; kind: 'slider'; q: string; sub: string; summary: string; min: number; max: number; step: number; def: number; unit: string; tip: string; tag: (v: number) => string; skipLabel?: string };

export type CalcConfig = {
  slug: string;
  label: string;          // header-label, bv. 'Dakraam prijs-indicatie'
  triggerLabel: string;   // knop-tekst op de LP, bv. 'Bereken mijn prijs'
  division: Divisie;
  bronLead: string;       // bv. 'calculator:velux'
  steps: CalcStep[];      // vraag-stappen (de contact-stap wordt generiek toegevoegd)
  contactSub: string;
  /** redirect-service-param na submit (default = slug) */
  thanksService?: string;
};

interface CalculatorWizardProps {
  config: CalcConfig;
  /** Modal-modus: render als overlay met sluit-knop. Anders: full-page modus. */
  onClose?: () => void;
}

export default function CalculatorWizard({ config, onClose }: CalculatorWizardProps) {
  const navigate = useNavigate();
  const isModal = !!onClose;
  const QUESTION_STEPS = config.steps.length;
  const TOTAL_STEPS = QUESTION_STEPS + 1; // + contact

  // Slider-defaults vooraf in answers zetten zodat de samenvatting altijd klopt.
  const initialAnswers: Record<string, string | number> = {};
  config.steps.forEach((s) => { if (s.kind === 'slider') initialAnswers[s.id] = s.def; });

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | number>>(initialAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModal) {
      document.title = `${config.label} | AB Bouw Groep`;
      let m = document.querySelector('meta[name="robots"]');
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
      m.setAttribute('content', 'noindex, nofollow');
    }

    const prev = document.body.className;
    if (!isModal) document.body.className = 'is-calc-page';
    const style = document.createElement('style');
    style.textContent = (isModal ? '' : SHELL_STYLE) + CALC_CSS;
    document.head.appendChild(style);
    if (!isModal) window.scrollTo(0, 0);

    let onEsc: ((e: KeyboardEvent) => void) | null = null;
    let prevOverflow = '';
    let prevPaddingRight = '';
    if (isModal) {
      prevOverflow = document.body.style.overflow;
      prevPaddingRight = document.body.style.paddingRight;
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
      document.body.classList.add('calc-modal-open');
      onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
      window.addEventListener('keydown', onEsc);
    }

    return () => {
      if (!isModal) document.body.className = prev;
      style.remove();
      if (isModal) {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPaddingRight;
        document.body.classList.remove('calc-modal-open');
        if (onEsc) window.removeEventListener('keydown', onEsc);
      }
    };
  }, [isModal, onClose, config.label]);
  useAbBouwInteractions();

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const goTo = (s: number) => setStep(s);
  const setAnswer = (id: string, val: string | number) => setAnswers((a) => ({ ...a, [id]: val }));
  const choose = (id: string, key: string) => { setAnswer(id, key); setTimeout(next, 220); };
  const pct = Math.round((step / TOTAL_STEPS) * 100);

  // Generieke psychologie-laag (motivatie + tijdschatting) op basis van positie.
  const remaining = TOTAL_STEPS - step;
  const psychMsg =
    step === 1 ? 'Net begonnen'
    : step === TOTAL_STEPS ? 'Laatste stap: uw gegevens'
    : remaining === 1 ? 'Bijna klaar'
    : step / TOTAL_STEPS < 0.5 ? `Goed bezig, nog ${remaining} stappen`
    : 'Halverwege';
  const timeLeft = `± ${Math.max(10, (TOTAL_STEPS - step + 1) * 10)} sec resterend`;

  const curStep = config.steps[step - 1];

  // Samenvatting (laatste stap) — label + gekozen waarde per beantwoorde stap.
  const summaryRows = config.steps
    .map((s) => {
      const v = answers[s.id];
      if (v === undefined || v === '') return null;
      if (s.kind === 'slider') return { label: s.summary, value: v === 'onbekend' ? 'Nog op te meten' : `± ${v} ${s.unit}` };
      const opt = s.options.find((o) => o.key === v);
      return opt ? { label: s.summary, value: opt.label } : null;
    })
    .filter(Boolean) as { label: string; value: string }[];

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
    if (!firstName) { setSubmitError('Vul a.u.b. uw voornaam in.'); form.querySelector<HTMLInputElement>('input[name="firstName"]')?.focus(); return; }
    if (!emailValid) { setSubmitError('Vul een geldig e-mailadres in.'); form.querySelector<HTMLInputElement>('input[name="email"]')?.focus(); return; }
    if (!phoneValid) { setSubmitError('Vul uw telefoonnummer in (minstens 8 cijfers).'); form.querySelector<HTMLInputElement>('input[name="phone"]')?.focus(); return; }

    const subParts = summaryRows.map((r) => `${r.label}: ${r.value}`);
    const userMsg = ((fd.get('aanvullende_info') as string) || '').trim();
    const combined = `${subParts.join('\n')}${userMsg ? `\n\nAanvullend:\n${userMsg}` : ''}`;

    setSubmitting(true);
    const result = await submitLead({
      source: 'landing_page',
      landing_division: config.division,
      page_path: window.location.pathname,
      firstName,
      email: emailV || undefined,
      phone: phoneV || undefined,
      type_werk: config.division,
      aanvullende_info: combined,
      bron_lead: config.bronLead,
    });
    setSubmitting(false);

    if (result.ok) {
      navigate(`/bedankt?service=${config.thanksService ?? config.slug}`);
    } else {
      setSubmitError(`Er ging iets mis. Bel ons gerust op ${CONTACT.phone.spaced} of mail naar ${CONTACT.email}.`);
    }
  };

  const renderStep = (s: CalcStep) => {
    if (s.kind === 'slider') {
      const raw = answers[s.id];
      const val = typeof raw === 'number' ? raw : s.def;
      return (
        <div className="calc-step">
          <h2 className="calc-q">{s.q}</h2>
          <p className="calc-q-sub" dangerouslySetInnerHTML={{ __html: s.sub }} />
          <div className="calc-slider-card">
            <div className="calc-slider-value">
              <span className="calc-slider-num">± {val}</span>
              <span className="calc-slider-unit">{s.unit}</span>
            </div>
            <div className="calc-slider-tag">{s.tag(val)}</div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={val}
              onChange={(e) => setAnswer(s.id, Number(e.target.value))}
              className="calc-slider" aria-label={s.summary} />
            <div className="calc-slider-range"><span>{s.min} {s.unit}</span><span>{s.max}+ {s.unit}</span></div>
          </div>
          <div className="calc-tip" dangerouslySetInnerHTML={{ __html: s.tip }} />
          <div className="calc-actions">
            <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
            <button type="button" className="calc-btn-primary" onClick={next}>Volgende →</button>
          </div>
          {s.skipLabel && (
            <button type="button" className="calc-skip" onClick={() => { setAnswer(s.id, 'onbekend'); next(); }}>{s.skipLabel}</button>
          )}
        </div>
      );
    }
    if (s.kind === 'cards') {
      return (
        <div className="calc-step">
          <h2 className="calc-q">{s.q}</h2>
          <p className="calc-q-sub" dangerouslySetInnerHTML={{ __html: s.sub }} />
          <div className="calc-options calc-options-2col">
            {s.options.map((o) => (
              <button key={o.key} type="button" className={`calc-opt-card ${answers[s.id] === o.key ? 'is-active' : ''}`} onClick={() => choose(s.id, o.key)}>
                {o.img && <div className="calc-opt-img"><img src={o.img} alt={o.label} /></div>}
                <div className="calc-opt-body"><strong>{o.label}</strong><span>{o.desc}</span></div>
              </button>
            ))}
          </div>
          {step > 1 && <div className="calc-actions"><button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button></div>}
        </div>
      );
    }
    // rows
    return (
      <div className="calc-step">
        <h2 className="calc-q">{s.q}</h2>
        <p className="calc-q-sub" dangerouslySetInnerHTML={{ __html: s.sub }} />
        <div className="calc-options calc-options-1col">
          {s.options.map((o) => (
            <button key={o.key} type="button" className={`calc-opt-row ${o.img ? '' : 'calc-opt-row--simple'} ${answers[s.id] === o.key ? 'is-active' : ''}`} onClick={() => choose(s.id, o.key)}>
              {o.img && <div className="calc-opt-row-img"><img src={o.img} alt={o.label} /></div>}
              <div className="calc-opt-row-body"><strong>{o.label}</strong><span>{o.desc}</span></div>
              <div className="calc-radio" aria-hidden="true"></div>
            </button>
          ))}
        </div>
        {step > 1 && <div className="calc-actions"><button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button></div>}
      </div>
    );
  };

  const cardJSX = (
    <div className="calc-card" data-reveal>
      <header className="calc-head">
        <button type="button" className="calc-back-link" onClick={() => step > 1 ? back() : (isModal ? onClose!() : navigate(`/lp/${config.slug}`))} aria-label="Terug">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          <span>{step > 1 ? 'Terug' : (isModal ? 'Sluiten' : 'Terug')}</span>
        </button>
        <span className="calc-head-label">{config.label}</span>
        {isModal && (
          <button type="button" className="calc-modal-x" onClick={onClose} aria-label="Sluiten">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </header>
      <div className="calc-body">
        <div className="calc-progress-wrap">
          <div className="calc-progress-head">
            <div className="calc-progress-meta">
              <span className="calc-progress-step">Stap {step} van {TOTAL_STEPS}</span>
              <span className="calc-progress-msg">{psychMsg}</span>
            </div>
            <div className="calc-progress-pct" key={pct}>
              <span className="calc-progress-pct-num">{pct}</span>
              <span className="calc-progress-pct-sign">%</span>
            </div>
          </div>
          <div className="calc-progress"><div className="calc-progress-bar" style={{ width: `${pct}%` }} /></div>
          <div className="calc-progress-foot">
            <span className="calc-progress-time">{timeLeft}</span>
            <span className="calc-progress-dots" aria-hidden="true">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <span key={i} className={`calc-progress-dot ${i + 1 < step ? 'is-done' : i + 1 === step ? 'is-current' : ''}`} />
              ))}
            </span>
          </div>
        </div>

        {step <= QUESTION_STEPS && curStep && renderStep(curStep)}

        {step === TOTAL_STEPS && (
          <div className="calc-step">
            <h2 className="calc-q">Bijna klaar: waar mogen we u bereiken?</h2>
            <p className="calc-q-sub" dangerouslySetInnerHTML={{ __html: config.contactSub }} />

            {summaryRows.length > 0 && (
              <div className="calc-summary" aria-label="Samenvatting van uw aanvraag">
                <strong>Uw aanvraag in een notendop</strong>
                <ul>{summaryRows.map((r, i) => <li key={i}><span>{r.label}</span><span>{r.value}</span></li>)}</ul>
              </div>
            )}

            <form className="calc-form" onSubmit={handleSubmit} noValidate>
              <input type="text" name="firstName" placeholder="Voornaam *" required autoComplete="given-name" />
              <input type="tel" name="phone" placeholder="Telefoonnummer *" required autoComplete="tel" inputMode="tel" />
              <input type="email" name="email" placeholder="E-mailadres *" required autoComplete="email" inputMode="email" />
              <p className="calc-form-hint">We bellen u binnen 1 werkdag voor een vrijblijvende prijsindicatie en sturen de offerte na per e-mail.</p>

              {submitError && <p className="calc-error">{submitError}</p>}

              <div className="calc-actions calc-actions-final">
                <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
                <button type="submit" className="calc-btn-primary calc-btn-submit" disabled={submitting} style={{ background: '#d98c03', color: '#ffffff', border: 'none' }}>
                  {submitting ? 'Even bezig…' : 'Stuur mijn aanvraag →'}
                </button>
              </div>
              <p className="calc-foot"><span className="calc-em">Geen spam.</span> Wij sturen alleen uw offerte. Privacy verklaring op <a href="/privacy">/privacy</a>.</p>
            </form>
          </div>
        )}

        {step < TOTAL_STEPS && (
          <div className="calc-pager">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const n = i + 1;
              return <button key={n} type="button" className={`calc-pager-dot ${step >= n ? 'is-done' : ''} ${step === n ? 'is-active' : ''}`} onClick={() => step > n && goTo(n)} aria-label={`Stap ${n}`} />;
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    // Portal naar document.body: anders vangt de stacking-context van #root/.tr
    // de modal onder de body-level cookie-banner (z-index-val).
    const modal = (
      <div className="calc-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
        <div className="calc-widget" role="dialog" aria-modal="true" aria-label={config.label}>{cardJSX}</div>
      </div>
    );
    return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: buildNav('home') }} />
      <section className="calc-section">
        <div className="wrap">
          {cardJSX}
          <div className="calc-trust" data-reveal>
            <div className="calc-trust-item"><strong>★ 4,9 / 5</strong><span>180+ reviews</span></div>
            <div className="calc-trust-item"><strong>10 jaar</strong><span>garantie via Federale Verzekering</span></div>
            <div className="calc-trust-item"><strong>Vaste prijs</strong><span>offerte = factuur</span></div>
            <div className="calc-trust-item"><strong>Sinds 2010</strong><span>actief in heel Vlaanderen</span></div>
          </div>
        </div>
      </section>
      <div dangerouslySetInnerHTML={{ __html: FOOTER }} />
    </>
  );
}

const CALC_CSS = `
/* Wizard open → verberg de body-level cookie-banner (anders botst hij met de modal). */
body.calc-modal-open #ab-bouw-cookie-banner { display: none !important; }
.calc-backdrop {
  position: fixed; inset: 0; z-index: 8990;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  background: rgba(10,22,40,0.55);
  -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
  animation: calcBackdropIn .25s ease both;
  -webkit-tap-highlight-color: transparent;
}
@keyframes calcBackdropIn { from { opacity: 0; } to { opacity: 1; } }
.calc-widget {
  position: relative;
  width: 440px; max-width: 100%;
  max-height: 90vh;
  z-index: 9000;
  display: flex; flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 24px 64px -16px rgba(10,22,40,0.45), 0 8px 20px -8px rgba(10,22,40,0.28);
  animation: calcModalIn .32s cubic-bezier(.22,1,.36,1);
}
.calc-widget .calc-card {
  border: none !important; border-radius: 16px;
  box-shadow: none; margin: 0;
  padding: 0 !important;
  display: flex; flex-direction: column;
  min-height: 0; flex: 1 1 auto; overflow: hidden;
  opacity: 1 !important; transform: none !important;
}
@keyframes calcModalIn {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.calc-widget .calc-head {
  position: sticky; top: 0; z-index: 2;
  flex-shrink: 0; margin: 0;
  padding: 16px 22px 14px;
  background: #fff;
  border-bottom: 1px solid var(--ink-line-soft);
}
.calc-widget .calc-modal-x { width: 38px; height: 38px; }
.calc-widget .calc-body {
  flex: 1 1 auto; min-height: 0;
  overflow-y: auto; -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 18px 22px 24px;
}
.calc-modal-x {
  background: none; border: 1px solid var(--ink-line-soft);
  width: 32px; height: 32px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--ink-soft); cursor: pointer;
  padding: 0; margin-left: auto;
  transition: border-color .2s, color .2s, background .2s;
}
.calc-modal-x:hover { border-color: var(--navy); color: var(--navy); background: var(--bg-soft); }

@media (max-width: 720px) {
  .calc-backdrop { padding: 0; align-items: flex-end; }
  .calc-widget {
    width: 100%; max-width: none;
    max-height: 90vh;
    max-height: 90dvh;
    border-radius: 18px 18px 0 0;
    animation: calcSheetIn .32s cubic-bezier(.22,1,.36,1);
  }
  .calc-widget .calc-card { border-radius: 18px 18px 0 0; }
  .calc-widget .calc-head { border-radius: 18px 18px 0 0; padding: 18px 16px 12px; }
  .calc-widget .calc-head::before {
    content: ''; position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
    width: 36px; height: 4px; border-radius: 999px; background: rgba(10,22,40,0.18);
  }
  .calc-widget .calc-body { padding: 14px 16px 22px; }
}
@keyframes calcSheetIn {
  from { opacity: 0; transform: translateY(100%); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .calc-backdrop, .calc-widget { animation: none; }
}

.calc-section {
  background: linear-gradient(180deg, var(--bg-soft) 0%, #fff 50%);
  padding: 120px 0 80px;
  min-height: 100vh;
}
.calc-card {
  max-width: 560px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 16px;
  padding: 24px 26px 28px;
  box-shadow: 0 16px 48px -20px rgba(10,22,40,0.18);
}
body.is-calc-page .lf-nav,
body.is-calc-page nav.lf-nav,
body.is-calc-page footer.footer,
body.is-calc-page .lf-fab-call,
body.is-calc-page .lf-mobile-bar { display: none !important; }
body.is-calc-page .scroll-progress { display: none !important; }

@media (max-width: 720px) {
  body.is-calc-page .wrap { padding-left: 8px !important; padding-right: 8px !important; max-width: 100% !important; }
  .calc-section { padding: 14px 0 18px; min-height: auto; }
  .calc-card { padding: 16px 14px 20px; border-radius: 12px; max-width: 100%; width: 100%; box-shadow: none; border: 1px solid rgba(10,22,40,0.06); }
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
  .calc-opt-row-body strong { font-size: 13.5px; }
  .calc-opt-row-body span { font-size: 11.5px; }
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

.calc-head {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18px; padding-bottom: 14px;
  border-bottom: 1px solid var(--ink-line-soft);
}
.calc-back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; color: var(--ink-soft); padding: 4px 0;
  border: none; background: none; cursor: pointer;
}
.calc-back-link:hover { color: var(--navy); }
.calc-head-label { font-size: 13px; font-weight: 600; color: var(--navy); letter-spacing: 0.02em; }

.calc-progress-wrap { margin-bottom: 28px; }
.calc-progress-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 10px; }
.calc-progress-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.calc-progress-step { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-mute); }
.calc-progress-msg { font-size: 14.5px; font-weight: 700; color: var(--navy); letter-spacing: -0.01em; line-height: 1.2; }
.calc-progress-pct { display: inline-flex; align-items: baseline; color: var(--accent); animation: calcPctPop .35s cubic-bezier(.22,1,.36,1); flex-shrink: 0; }
.calc-progress-pct-num { font-family: var(--font-display); font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
.calc-progress-pct-sign { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-left: 2px; opacity: 0.7; }
@keyframes calcPctPop { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
.calc-progress { background: rgba(10,22,40,0.06); height: 8px; border-radius: 999px; overflow: hidden; position: relative; }
.calc-progress-bar { height: 100%; background: linear-gradient(90deg, #d98c03 0%, #f0a93d 100%); border-radius: 999px; transition: width .45s cubic-bezier(.22,1,.36,1); box-shadow: 0 1px 3px rgba(217,140,3,0.4); position: relative; }
.calc-progress-bar::after { content: ''; position: absolute; top: 0; bottom: 0; right: 0; width: 8px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4)); border-top-right-radius: 999px; border-bottom-right-radius: 999px; }
.calc-progress-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; }
.calc-progress-time { font-size: 12px; color: var(--ink-soft); font-weight: 500; letter-spacing: 0.01em; }
.calc-progress-dots { display: inline-flex; align-items: center; gap: 6px; }
.calc-progress-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(10,22,40,0.16); transition: background .3s ease, transform .3s ease; }
.calc-progress-dot.is-done { background: var(--accent); }
.calc-progress-dot.is-current { background: var(--accent); transform: scale(1.4); box-shadow: 0 0 0 4px rgba(217,140,3,0.18); }
@media (max-width: 540px) {
  .calc-progress-msg { font-size: 13.5px; }
  .calc-progress-pct-num { font-size: 24px; }
  .calc-progress-pct-sign { font-size: 14px; }
  .calc-progress-time { font-size: 11.5px; }
  .calc-progress-dot { width: 6px; height: 6px; }
  .calc-progress-dot.is-current { transform: scale(1.35); box-shadow: 0 0 0 3px rgba(217,140,3,0.18); }
}
@media (prefers-reduced-motion: reduce) { .calc-progress-pct { animation: none; } .calc-progress-dot { transition: none; } }

.calc-step { animation: calcFadeIn .35s cubic-bezier(.22,1,.36,1); }
@keyframes calcFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.calc-q { font-family: var(--font-display); font-size: clamp(22px, 3vw, 28px); font-weight: 600; line-height: 1.2; color: var(--navy); margin: 0 0 6px; }
.calc-q-sub { font-size: 14px; color: var(--ink-soft); line-height: 1.5; margin: 0 0 24px; }

.calc-em { color: var(--navy); font-weight: 700; background: linear-gradient(transparent 62%, rgba(217,140,3,0.28) 62%); padding: 0 3px; border-radius: 2px; }
.calc-tip .calc-em { color: var(--navy); background: linear-gradient(transparent 62%, rgba(217,140,3,0.4) 62%); }
.calc-foot .calc-em { color: var(--navy); background: none; }

.calc-options { display: grid; gap: 12px; margin-bottom: 18px; }
.calc-options-2col { grid-template-columns: 1fr 1fr; }
.calc-options-1col { grid-template-columns: 1fr; }
@media (max-width: 560px) { .calc-options-2col { grid-template-columns: 1fr; } }

.calc-opt-card { display: flex; flex-direction: column; background: #fff; border: 2px solid var(--ink-line-soft); border-radius: 16px; overflow: hidden; cursor: pointer; padding: 0; font: inherit; text-align: left; transition: border-color .2s, transform .2s, box-shadow .2s; position: relative; }
.calc-opt-card:hover { border-color: #d98c03; transform: translateY(-3px); box-shadow: 0 12px 28px -12px rgba(10,22,40,0.25); }
.calc-opt-card.is-active { border-color: #d98c03; background: #fff; box-shadow: 0 0 0 4px rgba(217,140,3,0.15); }
.calc-opt-card.is-active::after { content: '✓'; position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%; background: #d98c03; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; box-shadow: 0 4px 12px -2px rgba(217,140,3,0.6); }
.calc-opt-img { aspect-ratio: 16 / 11; overflow: hidden; background: var(--bg-soft); }
.calc-opt-img img { width: 100%; height: 100%; object-fit: cover; }
.calc-opt-body { padding: 16px 18px 18px; }
.calc-opt-body strong { display: block; color: var(--navy); font-size: 17px; font-weight: 700; margin-bottom: 4px; line-height: 1.25; }
.calc-opt-body span { display: block; color: var(--ink-soft); font-size: 13px; line-height: 1.4; }

.calc-opt-row { display: grid; grid-template-columns: 120px 1fr auto; gap: 18px; align-items: center; background: #fff; border: 2px solid var(--ink-line-soft); border-radius: 14px; padding: 14px 18px 14px 14px; cursor: pointer; font: inherit; text-align: left; transition: border-color .2s, background .2s, transform .2s; }
.calc-opt-row.calc-opt-row--simple { grid-template-columns: 1fr auto; padding: 16px 18px; }
.calc-opt-row:hover { border-color: #d98c03; transform: translateX(2px); }
.calc-opt-row.is-active { border-color: #d98c03; background: #fff; box-shadow: 0 0 0 4px rgba(217,140,3,0.12); }
.calc-opt-row-img { width: 120px; height: 90px; border-radius: 10px; overflow: hidden; background: var(--bg-soft); }
.calc-opt-row-img img { width: 100%; height: 100%; object-fit: cover; }
.calc-opt-row-body strong { display: block; color: var(--navy); font-size: 16px; font-weight: 700; margin-bottom: 3px; line-height: 1.25; }
.calc-opt-row-body span { display: block; color: var(--ink-soft); font-size: 13px; line-height: 1.45; }
.calc-radio { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--ink-line-soft); background: #fff; transition: border-color .2s, background .2s; position: relative; flex-shrink: 0; }
.calc-opt-row.is-active .calc-radio { border-color: #d98c03; background: #d98c03; }
.calc-opt-row.is-active .calc-radio::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: #fff; }
@media (max-width: 480px) {
  .calc-opt-row { grid-template-columns: 80px 1fr auto; gap: 12px; padding: 10px 14px 10px 10px; }
  .calc-opt-row-img { width: 80px; height: 60px; }
}

.calc-slider-card { background: var(--bg-soft); border: 1px solid var(--ink-line-soft); border-radius: 14px; padding: 28px 24px 20px; text-align: center; margin-bottom: 16px; }
.calc-slider-value { display: flex; align-items: baseline; justify-content: center; gap: 6px; }
.calc-slider-num { font-family: var(--font-display); font-size: clamp(40px, 6vw, 56px); font-weight: 600; color: var(--accent); line-height: 1; }
.calc-slider-unit { font-size: 18px; font-weight: 600; color: var(--navy); }
.calc-slider-tag { font-size: 11.5px; font-weight: 700; color: var(--ink-soft); letter-spacing: 0.1em; text-transform: uppercase; margin: 6px 0 22px; }
.calc-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; background: rgba(10,22,40,0.12); outline: none; }
.calc-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 4px 12px -2px rgba(217,140,3,0.5); border: 3px solid #fff; }
.calc-slider::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 4px 12px -2px rgba(217,140,3,0.5); border: 3px solid #fff; }
.calc-slider-range { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--ink-mute); margin-top: 6px; }
.calc-tip { background: rgba(217,140,3,0.08); border-left: 3px solid var(--accent); padding: 12px 14px; font-size: 13px; color: var(--ink-soft); line-height: 1.5; border-radius: 0 8px 8px 0; margin-bottom: 20px; }
.calc-skip { display: block; margin: 12px auto 0; background: none; border: none; color: var(--ink-soft); font-size: 13px; text-decoration: underline; cursor: pointer; padding: 4px; }
.calc-skip:hover { color: var(--navy); }

.calc-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; gap: 12px; }
.calc-actions-final { flex-direction: column; gap: 10px; align-items: stretch; }
@media (min-width: 540px) { .calc-actions-final { flex-direction: row; align-items: center; } }
.calc-btn-ghost { background: none; border: 1px solid var(--ink-line-soft); padding: 12px 20px; border-radius: 10px; color: var(--ink-soft); font-size: 14px; font-weight: 600; cursor: pointer; transition: border-color .2s, color .2s; }
.calc-btn-ghost:hover { border-color: var(--navy); color: var(--navy); }
.calc-btn-primary { background: #d98c03 !important; color: #ffffff !important; border: none !important; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .2s, transform .2s; box-shadow: 0 8px 18px -6px rgba(217,140,3,0.45); }
.calc-btn-primary:hover { background: #b87502 !important; color: #ffffff !important; transform: translateY(-1px); }
.calc-btn-primary:disabled { background: #d98c03 !important; color: #ffffff !important; opacity: .6; cursor: wait; }
.calc-btn-submit { padding: 14px 22px; flex: 1; }

.calc-pager { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
.calc-pager-dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: var(--ink-line-soft); cursor: pointer; padding: 0; transition: background .2s, transform .2s; }
.calc-pager-dot.is-done { background: var(--accent); }
.calc-pager-dot.is-active { background: var(--accent); transform: scale(1.4); }

.calc-summary { background: var(--bg-soft); border-radius: 12px; padding: 18px 20px; margin-bottom: 22px; }
.calc-summary strong { display: block; color: var(--navy); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
.calc-summary ul { list-style: none; padding: 0; margin: 0; }
.calc-summary li { display: flex; justify-content: space-between; gap: 16px; padding: 6px 0; font-size: 14px; border-bottom: 1px solid var(--ink-line-soft); }
.calc-summary li:last-child { border-bottom: none; }
.calc-summary li span:first-child { color: var(--ink-soft); }
.calc-summary li span:last-child { color: var(--navy); font-weight: 600; text-align: right; }

.calc-form { display: grid; gap: 12px; }
.calc-form input, .calc-form textarea { width: 100%; padding: 13px 14px; border: 1px solid var(--ink-line-soft); border-radius: 10px; font: inherit; font-size: 14px; color: var(--navy); background: #fff; transition: border-color .2s; }
.calc-form input:focus, .calc-form textarea:focus { outline: none; border-color: var(--accent); }
.calc-form-hint { font-size: 12.5px; color: var(--ink-mute); margin: 2px 2px 0; line-height: 1.4; }
.calc-error { font-size: 13px; color: #c4523f; padding: 8px 12px; background: #fcebe5; border-radius: 8px; margin: 0; }
.calc-foot { font-size: 11.5px; color: var(--ink-mute); margin: 2px 0 0; text-align: center; }
.calc-foot a { color: var(--accent); }

.calc-trust { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 640px; margin: 28px auto 0; padding: 18px 8px; }
@media (max-width: 720px) { .calc-trust { grid-template-columns: 1fr 1fr; gap: 18px 10px; } }
.calc-trust-item { text-align: center; }
.calc-trust-item strong { display: block; font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 2px; }
.calc-trust-item span { display: block; font-size: 11.5px; color: var(--ink-soft); line-height: 1.4; }
`;
