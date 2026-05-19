/**
 * CalculatorDak — multi-step dakwerken offerte-wizard.
 * URL: /calculator/dakwerken
 *
 * Doel: lead-magnet trick (Recotex-style). 6 stappen waarvan contactform pas op
 * stap 6. Sunk-cost commitment + reciprocity → 2-3× hogere CVR dan directe form.
 * Submit naar zelfde GHL-webhook + redirect naar /bedankt?service=dakwerken.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from '../_shell';
import { CONTACT } from '@/data/contact';
import { submitLead } from '@/lib/leads';

import imgPlatDak from '@/assets/dak/lp-plat-dak.jpg';
import imgHellendDak from '@/assets/dak/hellend-pannen.jpg';
import imgPannen from '@/assets/dak/lp-hero-pannendak.jpg';
import imgLeien from '@/assets/dak/lp-natuurleien.jpg';
import imgEPDM from '@/assets/dak/plat-epdm.jpg';
import imgRoofing from '@/assets/dak/leien.jpg';

type State = {
  step: number;
  dakType?: 'plat' | 'hellend';
  bedekking?: 'pannen' | 'leien' | 'epdm' | 'roofing';
  oppervlakte: number;
  isolatie?: 'ja' | 'nee';
  asbest?: 'ja' | 'nee' | 'weet-niet';
};

const TOTAL_STEPS = 6;

export default function CalculatorDak() {
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ step: 1, oppervlakte: 50 });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Bereken uw dakwerken-offerte | AB Bouw Groep';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');

    const prev = document.body.className;
    document.body.className = '';
    const style = document.createElement('style');
    style.textContent = SHELL_STYLE + CALC_CSS;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    return () => { document.body.className = prev; style.remove(); };
  }, []);
  useAbBouwInteractions();

  const set = (patch: Partial<State>) => setState(prev => ({ ...prev, ...patch }));
  const next = () => set({ step: Math.min(TOTAL_STEPS, state.step + 1) });
  const back = () => set({ step: Math.max(1, state.step - 1) });
  const goTo = (s: number) => set({ step: s });
  const pct = Math.round((state.step / TOTAL_STEPS) * 100);

  const BEDEKKING_LABELS: Record<NonNullable<State['bedekking']>, string> = {
    pannen: 'Pannendak',
    leien: 'Natuurleien',
    epdm: 'Plat dak — EPDM',
    roofing: 'Plat dak — bitumen / roofing',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const subParts: string[] = [];
    if (state.dakType) subParts.push(`Type dak: ${state.dakType === 'plat' ? 'Plat dak' : 'Hellend dak'}`);
    if (state.bedekking) subParts.push(`Bedekking: ${BEDEKKING_LABELS[state.bedekking]}`);
    if (state.oppervlakte) subParts.push(`Oppervlakte: ± ${state.oppervlakte} m²`);
    if (state.isolatie) subParts.push(`Isolatie: ${state.isolatie === 'ja' ? 'gewenst' : 'niet nodig'}`);
    if (state.asbest) subParts.push(`Asbest: ${state.asbest === 'ja' ? 'aanwezig' : state.asbest === 'nee' ? 'niet aanwezig' : 'niet zeker'}`);
    const userMsg = ((fd.get('aanvullende_info') as string) || '').trim();
    const combined = `${subParts.join('\n')}${userMsg ? `\n\nAanvullend:\n${userMsg}` : ''}`;

    setSubmitting(true);
    const result = await submitLead({
      source: 'landing_page',
      landing_division: 'ab_dakwerken',
      page_path: window.location.pathname,
      firstName: (fd.get('firstName') as string) || undefined,
      lastName: (fd.get('lastName') as string) || undefined,
      email: ((fd.get('email') as string) || '').trim(),
      phone: ((fd.get('phone') as string) || '').trim() || undefined,
      postcode: ((fd.get('postcode') as string) || '').trim() || undefined,
      gemeente: ((fd.get('gemeente') as string) || '').trim() || undefined,
      type_werk: 'AB Dakwerken',
      aanvullende_info: combined,
      bron_lead: 'calculator:dakwerken',
    });
    setSubmitting(false);

    if (result.ok) {
      navigate('/bedankt?service=dakwerken');
    } else {
      setSubmitError(`Er ging iets mis. Bel ons gerust op ${CONTACT.phone.spaced} of mail naar ${CONTACT.email}.`);
    }
  };

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: buildNav('home') }} />
      <section className="calc-section">
        <div className="wrap">
          <div className="calc-card" data-reveal>
            <header className="calc-head">
              <button type="button" className="calc-back-link" onClick={() => state.step > 1 ? back() : navigate('/lp/dakwerken')} aria-label="Terug">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                <span>Terug</span>
              </button>
              <span className="calc-head-label">Dakwerken — offerte-wizard</span>
            </header>
            <div className="calc-progress">
              <div className="calc-progress-bar" style={{ width: `${pct}%` }} />
              <div className="calc-progress-text">
                <span>Stap {state.step} van {TOTAL_STEPS}</span>
                <span>{pct}%</span>
              </div>
            </div>

            {state.step === 1 && (
              <div className="calc-step">
                <h2 className="calc-q">Welk soort dak heeft u?</h2>
                <p className="calc-q-sub">Kies wat het meest overeenkomt — we vragen geen technische kennis.</p>
                <div className="calc-options calc-options-2col">
                  <button type="button" className={`calc-opt-card ${state.dakType === 'plat' ? 'is-active' : ''}`} onClick={() => { set({ dakType: 'plat' }); setTimeout(next, 220); }}>
                    <div className="calc-opt-img"><img src={imgPlatDak} alt="Plat dak"/></div>
                    <div className="calc-opt-body">
                      <strong>Plat dak</strong>
                      <span>Hellingshoek &lt; 15°</span>
                    </div>
                  </button>
                  <button type="button" className={`calc-opt-card ${state.dakType === 'hellend' ? 'is-active' : ''}`} onClick={() => { set({ dakType: 'hellend' }); setTimeout(next, 220); }}>
                    <div className="calc-opt-img"><img src={imgHellendDak} alt="Hellend dak"/></div>
                    <div className="calc-opt-body">
                      <strong>Hellend dak</strong>
                      <span>Hellingshoek &gt; 15°</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {state.step === 2 && (
              <div className="calc-step">
                <h2 className="calc-q">Welke dakbedekking wenst u?</h2>
                <p className="calc-q-sub">Niet zeker? Kies wat u nu hebt — we adviseren tijdens het plaatsbezoek.</p>
                <div className="calc-options calc-options-1col">
                  {(state.dakType === 'plat' ? [
                    { key: 'epdm' as const, label: 'EPDM', desc: 'Rubber membraan — 25 jaar gegarandeerd waterdicht', img: imgEPDM },
                    { key: 'roofing' as const, label: 'Bitumen / Roofing', desc: 'Klassieke bituminuze afdichting', img: imgRoofing },
                  ] : [
                    { key: 'pannen' as const, label: 'Pannen (klei of beton)', desc: 'Klassieke keramische pannen — Koramic, Aleonard', img: imgPannen },
                    { key: 'leien' as const, label: 'Natuurleien', desc: 'Premium uitstraling — levensduur 100+ jaar', img: imgLeien },
                  ]).map(opt => (
                    <button key={opt.key} type="button" className={`calc-opt-row ${state.bedekking === opt.key ? 'is-active' : ''}`} onClick={() => { set({ bedekking: opt.key }); setTimeout(next, 220); }}>
                      <div className="calc-opt-row-img"><img src={opt.img} alt={opt.label}/></div>
                      <div className="calc-opt-row-body">
                        <strong>{opt.label}</strong>
                        <span>{opt.desc}</span>
                      </div>
                      <div className="calc-radio" aria-hidden="true"></div>
                    </button>
                  ))}
                </div>
                <div className="calc-actions">
                  <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
                </div>
              </div>
            )}

            {state.step === 3 && (
              <div className="calc-step">
                <h2 className="calc-q">Hoe groot is het dak?</h2>
                <p className="calc-q-sub">Een ruwe schatting volstaat — we meten ter plaatse nauwkeurig op.</p>
                <div className="calc-slider-card">
                  <div className="calc-slider-value">
                    <span className="calc-slider-num">± {state.oppervlakte}</span>
                    <span className="calc-slider-unit">m²</span>
                  </div>
                  <div className="calc-slider-tag">
                    {state.oppervlakte < 40 ? 'Klein dak' : state.oppervlakte < 100 ? 'Gemiddeld dak' : state.oppervlakte < 200 ? 'Groot dak' : 'Zeer groot dak'}
                  </div>
                  <input type="range" min={10} max={300} step={5} value={state.oppervlakte}
                    onChange={(e) => set({ oppervlakte: Number(e.target.value) })}
                    className="calc-slider" aria-label="Oppervlakte in m²"
                  />
                  <div className="calc-slider-range">
                    <span>10 m²</span>
                    <span>300+ m²</span>
                  </div>
                </div>
                <div className="calc-tip">Niet zeker van de oppervlakte? Geen probleem — wij meten alles nauwkeurig op bij de inspectie.</div>
                <div className="calc-actions">
                  <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
                  <button type="button" className="calc-btn-primary" onClick={next}>Volgende →</button>
                </div>
              </div>
            )}

            {state.step === 4 && (
              <div className="calc-step">
                <h2 className="calc-q">Is er isolatie nodig?</h2>
                <p className="calc-q-sub">Goede dakisolatie verlaagt uw stookkost. Vereist sinds 2028 (Vlaamse renovatieplicht).</p>
                <div className="calc-options calc-options-1col">
                  <button type="button" className={`calc-opt-row calc-opt-row--simple ${state.isolatie === 'ja' ? 'is-active' : ''}`} onClick={() => { set({ isolatie: 'ja' }); setTimeout(next, 220); }}>
                    <div className="calc-opt-row-body">
                      <strong>Ja</strong>
                      <span>Ik wil isolatie laten plaatsen</span>
                    </div>
                    <div className="calc-radio"></div>
                  </button>
                  <button type="button" className={`calc-opt-row calc-opt-row--simple ${state.isolatie === 'nee' ? 'is-active' : ''}`} onClick={() => { set({ isolatie: 'nee' }); setTimeout(next, 220); }}>
                    <div className="calc-opt-row-body">
                      <strong>Nee</strong>
                      <span>Enkel dakwerken, geen isolatie</span>
                    </div>
                    <div className="calc-radio"></div>
                  </button>
                </div>
                <div className="calc-actions">
                  <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
                </div>
              </div>
            )}

            {state.step === 5 && (
              <div className="calc-step">
                <h2 className="calc-q">Is er asbest aanwezig in het dak?</h2>
                <p className="calc-q-sub">Asbestverwijdering vereist speciale procedures — wij zijn erkend asbestverwerker.</p>
                <div className="calc-options calc-options-1col">
                  <button type="button" className={`calc-opt-row calc-opt-row--simple ${state.asbest === 'ja' ? 'is-active' : ''}`} onClick={() => { set({ asbest: 'ja' }); setTimeout(next, 220); }}>
                    <div className="calc-opt-row-body">
                      <strong>Ja</strong>
                      <span>Er is vermoedelijk asbest aanwezig</span>
                    </div>
                    <div className="calc-radio"></div>
                  </button>
                  <button type="button" className={`calc-opt-row calc-opt-row--simple ${state.asbest === 'nee' ? 'is-active' : ''}`} onClick={() => { set({ asbest: 'nee' }); setTimeout(next, 220); }}>
                    <div className="calc-opt-row-body">
                      <strong>Nee</strong>
                      <span>Er is geen asbest aanwezig</span>
                    </div>
                    <div className="calc-radio"></div>
                  </button>
                  <button type="button" className={`calc-opt-row calc-opt-row--simple ${state.asbest === 'weet-niet' ? 'is-active' : ''}`} onClick={() => { set({ asbest: 'weet-niet' }); setTimeout(next, 220); }}>
                    <div className="calc-opt-row-body">
                      <strong>Weet ik niet zeker</strong>
                      <span>We inspecteren dit voor de start van de werken</span>
                    </div>
                    <div className="calc-radio"></div>
                  </button>
                </div>
                <div className="calc-actions">
                  <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
                </div>
              </div>
            )}

            {state.step === 6 && (
              <div className="calc-step">
                <h2 className="calc-q">Bijna klaar — waar mogen we u bereiken?</h2>
                <p className="calc-q-sub">U krijgt binnen één werkdag persoonlijk contact met een vrijblijvende offerte op maat.</p>

                <div className="calc-summary" aria-label="Samenvatting van uw aanvraag">
                  <strong>Uw aanvraag in een notendop</strong>
                  <ul>
                    {state.dakType && <li><span>Type dak</span><span>{state.dakType === 'plat' ? 'Plat dak' : 'Hellend dak'}</span></li>}
                    {state.bedekking && <li><span>Bedekking</span><span>{BEDEKKING_LABELS[state.bedekking]}</span></li>}
                    <li><span>Oppervlakte</span><span>± {state.oppervlakte} m²</span></li>
                    {state.isolatie && <li><span>Isolatie</span><span>{state.isolatie === 'ja' ? 'Gewenst' : 'Niet nodig'}</span></li>}
                    {state.asbest && <li><span>Asbest</span><span>{state.asbest === 'ja' ? 'Aanwezig' : state.asbest === 'nee' ? 'Niet aanwezig' : 'Te bepalen'}</span></li>}
                  </ul>
                </div>

                <form className="calc-form" onSubmit={handleSubmit} noValidate>
                  <div className="calc-form-row">
                    <input type="text" name="firstName" placeholder="Voornaam *" required autoComplete="given-name" />
                    <input type="text" name="lastName" placeholder="Familienaam *" required autoComplete="family-name" />
                  </div>
                  <input type="email" name="email" placeholder="E-mailadres *" required autoComplete="email" />
                  <input type="tel" name="phone" placeholder="Telefoonnummer *" required autoComplete="tel" />
                  <div className="calc-form-row">
                    <input type="text" name="postcode" placeholder="Postcode" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="postal-code" />
                    <input type="text" name="gemeente" placeholder="Gemeente" autoComplete="address-level2" />
                  </div>
                  <textarea name="aanvullende_info" placeholder="Aanvullende info (optioneel)" rows={3}></textarea>

                  {submitError && <p className="calc-error">{submitError}</p>}

                  <div className="calc-actions calc-actions-final">
                    <button type="button" className="calc-btn-ghost" onClick={back}>← Terug</button>
                    <button type="submit" className="calc-btn-primary calc-btn-submit" disabled={submitting}>
                      {submitting ? 'Even bezig…' : 'Stuur mijn aanvraag →'}
                    </button>
                  </div>
                  <p className="calc-foot">Geen spam. Wij sturen alleen uw offerte. Privacy verklaring op <a href="/privacy">/privacy</a>.</p>
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

          <div className="calc-trust" data-reveal>
            <div className="calc-trust-item"><strong>★ 4,9 / 5</strong><span>184+ tevreden klanten</span></div>
            <div className="calc-trust-item"><strong>10 jaar</strong><span>garantie via Federale Verzekering</span></div>
            <div className="calc-trust-item"><strong>Eigen ploeg</strong><span>geen onderaannemers</span></div>
            <div className="calc-trust-item"><strong>Sinds 2010</strong><span>erkend bouwbedrijf in Willebroek</span></div>
          </div>
        </div>
      </section>
      <div dangerouslySetInnerHTML={{ __html: FOOTER }} />
    </>
  );
}

const CALC_CSS = `
.calc-section {
  background: linear-gradient(180deg, var(--bg-soft) 0%, #fff 50%);
  padding: 120px 0 80px;
  min-height: 100vh;
}
.calc-card {
  max-width: 640px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 18px;
  padding: 28px 32px 36px;
  box-shadow: 0 16px 48px -20px rgba(10,22,40,0.18);
}
@media (max-width: 720px) { .calc-card { padding: 22px 20px 28px; border-radius: 14px; } }

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

.calc-progress { margin-bottom: 28px; }
.calc-progress-bar {
  height: 4px; background: var(--accent);
  border-radius: 2px; transition: width .35s cubic-bezier(.22,1,.36,1);
}
.calc-progress { background: rgba(10,22,40,0.06); height: 4px; border-radius: 2px; overflow: hidden; position: relative; }
.calc-progress-text {
  display: flex; justify-content: space-between;
  font-size: 11.5px; font-weight: 600; color: var(--ink-soft);
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-top: 8px;
}

.calc-step {
  animation: calcFadeIn .35s cubic-bezier(.22,1,.36,1);
}
@keyframes calcFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.calc-q {
  font-family: var(--font-display);
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600; line-height: 1.2; color: var(--navy);
  margin: 0 0 6px;
}
.calc-q-sub {
  font-size: 14px; color: var(--ink-soft); line-height: 1.5;
  margin: 0 0 24px;
}

.calc-options { display: grid; gap: 12px; margin-bottom: 18px; }
.calc-options-2col { grid-template-columns: 1fr 1fr; }
.calc-options-1col { grid-template-columns: 1fr; }
@media (max-width: 560px) { .calc-options-2col { grid-template-columns: 1fr; } }

/* Card-style options (with photo on top) */
.calc-opt-card {
  display: flex; flex-direction: column;
  background: #fff; border: 2px solid var(--ink-line-soft);
  border-radius: 14px; overflow: hidden;
  cursor: pointer; padding: 0;
  font: inherit; text-align: left;
  transition: border-color .2s, transform .2s, box-shadow .2s;
}
.calc-opt-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 20px -10px rgba(10,22,40,0.18); }
.calc-opt-card.is-active { border-color: var(--accent); background: var(--bg-tint); }
.calc-opt-img { aspect-ratio: 4 / 3; overflow: hidden; background: var(--bg-soft); }
.calc-opt-img img { width: 100%; height: 100%; object-fit: cover; }
.calc-opt-body { padding: 14px 16px; }
.calc-opt-body strong { display: block; color: var(--navy); font-size: 16px; font-weight: 600; margin-bottom: 2px; }
.calc-opt-body span { display: block; color: var(--ink-soft); font-size: 12.5px; }

/* Row-style options (photo on left, simpler) */
.calc-opt-row {
  display: grid; grid-template-columns: 96px 1fr auto; gap: 16px;
  align-items: center;
  background: #fff; border: 2px solid var(--ink-line-soft);
  border-radius: 14px; padding: 12px 16px 12px 12px;
  cursor: pointer; font: inherit; text-align: left;
  transition: border-color .2s, background .2s;
}
.calc-opt-row--simple { grid-template-columns: 1fr auto; padding: 16px 18px; }
.calc-opt-row:hover { border-color: var(--accent); }
.calc-opt-row.is-active { border-color: var(--accent); background: var(--bg-tint); }
.calc-opt-row-img { width: 96px; height: 72px; border-radius: 10px; overflow: hidden; background: var(--bg-soft); }
.calc-opt-row-img img { width: 100%; height: 100%; object-fit: cover; }
.calc-opt-row-body strong { display: block; color: var(--navy); font-size: 15px; font-weight: 600; margin-bottom: 2px; }
.calc-opt-row-body span { display: block; color: var(--ink-soft); font-size: 12.5px; line-height: 1.4; }
.calc-radio {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid var(--ink-line-soft); background: #fff;
  transition: border-color .2s, background .2s;
  position: relative;
}
.calc-opt-row.is-active .calc-radio { border-color: var(--accent); background: var(--accent); }
.calc-opt-row.is-active .calc-radio::after {
  content: ''; position: absolute; inset: 4px;
  border-radius: 50%; background: #fff;
}

/* Slider step */
.calc-slider-card {
  background: var(--bg-soft);
  border: 1px solid var(--ink-line-soft);
  border-radius: 14px;
  padding: 28px 24px 20px;
  text-align: center;
  margin-bottom: 16px;
}
.calc-slider-value { display: flex; align-items: baseline; justify-content: center; gap: 6px; }
.calc-slider-num {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 56px);
  font-weight: 600; color: var(--accent); line-height: 1;
}
.calc-slider-unit { font-size: 18px; font-weight: 600; color: var(--navy); }
.calc-slider-tag {
  font-size: 11.5px; font-weight: 700; color: var(--ink-soft);
  letter-spacing: 0.1em; text-transform: uppercase;
  margin: 6px 0 22px;
}
.calc-slider {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 6px; border-radius: 3px;
  background: rgba(10,22,40,0.12);
  outline: none;
}
.calc-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  box-shadow: 0 4px 12px -2px rgba(217,140,3,0.5);
  border: 3px solid #fff;
}
.calc-slider::-moz-range-thumb {
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  box-shadow: 0 4px 12px -2px rgba(217,140,3,0.5);
  border: 3px solid #fff;
}
.calc-slider-range {
  display: flex; justify-content: space-between;
  font-size: 11.5px; color: var(--ink-mute); margin-top: 6px;
}
.calc-tip {
  background: rgba(217,140,3,0.08);
  border-left: 3px solid var(--accent);
  padding: 12px 14px;
  font-size: 13px; color: var(--ink-soft); line-height: 1.5;
  border-radius: 0 8px 8px 0;
  margin-bottom: 20px;
}

/* Actions row */
.calc-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; gap: 12px; }
.calc-actions-final { flex-direction: column; gap: 10px; align-items: stretch; }
@media (min-width: 540px) { .calc-actions-final { flex-direction: row; align-items: center; } }
.calc-btn-ghost {
  background: none; border: 1px solid var(--ink-line-soft);
  padding: 12px 20px; border-radius: 10px;
  color: var(--ink-soft); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: border-color .2s, color .2s;
}
.calc-btn-ghost:hover { border-color: var(--navy); color: var(--navy); }
.calc-btn-primary {
  background: var(--accent); color: #fff;
  border: none; padding: 14px 28px; border-radius: 10px;
  font-size: 14px; font-weight: 700;
  cursor: pointer; transition: background .2s, transform .2s;
  box-shadow: 0 8px 18px -6px rgba(217,140,3,0.45);
}
.calc-btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
.calc-btn-primary:disabled { opacity: .6; cursor: wait; }
.calc-btn-submit { padding: 14px 22px; flex: 1; }

/* Pager dots */
.calc-pager {
  display: flex; justify-content: center; gap: 8px;
  margin-top: 24px;
}
.calc-pager-dot {
  width: 8px; height: 8px; border-radius: 50%;
  border: none; background: var(--ink-line-soft);
  cursor: pointer; padding: 0; transition: background .2s, transform .2s;
}
.calc-pager-dot.is-done { background: var(--accent); }
.calc-pager-dot.is-active { background: var(--accent); transform: scale(1.4); }

/* Final-step summary */
.calc-summary {
  background: var(--bg-soft);
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 22px;
}
.calc-summary strong {
  display: block; color: var(--navy); font-size: 13px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 12px;
}
.calc-summary ul { list-style: none; padding: 0; margin: 0; }
.calc-summary li {
  display: flex; justify-content: space-between;
  padding: 6px 0; font-size: 14px;
  border-bottom: 1px solid var(--ink-line-soft);
}
.calc-summary li:last-child { border-bottom: none; }
.calc-summary li span:first-child { color: var(--ink-soft); }
.calc-summary li span:last-child { color: var(--navy); font-weight: 600; }

/* Form */
.calc-form { display: grid; gap: 12px; }
.calc-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 480px) { .calc-form-row { grid-template-columns: 1fr; } }
.calc-form input, .calc-form textarea {
  width: 100%; padding: 13px 14px;
  border: 1px solid var(--ink-line-soft); border-radius: 10px;
  font: inherit; font-size: 14px; color: var(--navy);
  background: #fff; transition: border-color .2s;
}
.calc-form input:focus, .calc-form textarea:focus {
  outline: none; border-color: var(--accent);
}
.calc-form textarea { resize: vertical; min-height: 80px; font-family: inherit; }
.calc-error {
  font-size: 13px; color: #c4523f; padding: 8px 12px;
  background: #fcebe5; border-radius: 8px; margin: 0;
}
.calc-foot { font-size: 11.5px; color: var(--ink-mute); margin: 2px 0 0; text-align: center; }
.calc-foot a { color: var(--accent); }

/* Trust strip below */
.calc-trust {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; max-width: 640px; margin: 28px auto 0;
  padding: 18px 8px;
}
@media (max-width: 720px) { .calc-trust { grid-template-columns: 1fr 1fr; gap: 18px 10px; } }
.calc-trust-item { text-align: center; }
.calc-trust-item strong {
  display: block; font-family: var(--font-display);
  font-size: 15px; font-weight: 700; color: var(--navy);
  margin-bottom: 2px;
}
.calc-trust-item span {
  display: block; font-size: 11.5px; color: var(--ink-soft);
  line-height: 1.4;
}
`;
