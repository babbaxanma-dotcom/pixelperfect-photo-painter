import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';

export type DivisionConfig = {
  slug: string;
  num: string;
  title: string;          // e.g. "AB Construct"
  eyebrow: string;        // e.g. "Algemene aanneming"
  heroTitle: string;      // HTML allowed
  heroLede: string;
  heroBg: string;
  storyTitle: string;     // HTML allowed
  storyLede: string;
  storyImg: string;
  features: { n: string; t: string; d: string }[];
  whatWeDo: { n: string; t: string; d: string }[];
  process: { n: string; t: string; d: string; time: string }[];
  faqs: { q: string; a: string }[];
  meta: string;
};

export function buildDivisionPage(c: DivisionConfig) {
  return `
${buildNav('diensten')}

${buildHero({
  bg: c.heroBg,
  eyebrow: `${c.num} · ${c.eyebrow}`,
  title: c.heroTitle,
  lede: c.heroLede,
  primary: { label: 'Vraag plaatsbezoek aan', href: '/contact' },
  secondary: { label: 'Onze werkwijze →', href: '/werkwijze' },
})}

<!-- STORY -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">${c.title}</span>
        <h2 class="lf-h2">${c.storyTitle}</h2>
        <p class="lf-lede">${c.storyLede}</p>
        ${c.features.map(f => `
          <div class="lf-feature">
            <div class="lf-feature-num">${f.n}</div>
            <div><h4>${f.t}</h4><p>${f.d}</p></div>
          </div>`).join('')}
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${c.storyImg}" alt="${c.title}" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- WHAT WE DO -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Wat we doen</span>
      <h2 class="lf-h2">Specialistisch werk,<br/>door eigen mensen.</h2>
    </div>
    <div class="lf-support-grid">
      ${c.whatWeDo.map((w, i) => `
        <div class="lf-support-card" data-reveal data-reveal-delay="${i}">
          <div class="lf-support-meta"><span>${w.n}</span> ${c.eyebrow}</div>
          <h5>${w.t}</h5>
          <p>${w.d}</p>
        </div>`).join('')}
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Onze werkwijze</span>
      <h2 class="lf-h2">Van offerte tot oplevering.</h2>
    </div>
    <div class="lf-process">
      <div class="lf-process-line"></div>
      ${c.process.map((s, i) => `
        <div class="lf-process-step" data-reveal data-reveal-delay="${i}">
          <div class="lf-process-num">${s.n}</div>
          <h5>${s.t}</h5>
          <p>${s.d}</p>
          <span class="lf-process-time">${s.time}</span>
        </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-faq-grid">
      <div class="lf-faq-side" data-reveal>
        <span class="lf-eyebrow">Veelgestelde vragen</span>
        <h2 class="lf-h2">Antwoorden op<br/>uw vragen.</h2>
        <p class="lf-lede">Staat uw vraag er niet tussen? Bel <a href="tel:+32470634413" style="color:var(--accent);font-weight:600;">+32 470 63 44 13</a>. U krijgt binnen 24 uur antwoord van een vakmens.</p>
        <a href="/contact" class="lf-cta-pill">
          <span>Stel uw vraag</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
      </div>
      <div class="lf-faq-list" data-reveal data-reveal-delay="1">
        ${c.faqs.map((f, i) => `
          <div class="faq-item${i === 0 ? ' open' : ''}">
            <button class="faq-q" type="button">
              <span>${f.q}</span>
              <svg class="faq-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <div class="faq-a"><p>${f.a}</p></div>
          </div>`).join('')}
      </div>
    </div>
  </div>
</section>

${buildCta(`Plan uw ${c.eyebrow.toLowerCase()}-project`, 'Vraag een vrijblijvend plaatsbezoek. Binnen één werkdag krijgt u antwoord van een vakmens.')}

${FOOTER}
`;
}

export function makeDivision(c: DivisionConfig) {
  const html = buildDivisionPage(c);
  return function DivisionPage() {
    useEffect(() => {
      document.title = `${c.title} | AB Bouw Group`;
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
      m.setAttribute('content', c.meta);
      const prev = document.body.className;
      document.body.className = "";
      const styleEl = document.createElement('style');
      styleEl.textContent = SHELL_STYLE;
      document.head.appendChild(styleEl);
      return () => { document.body.className = prev; styleEl.remove(); };
    }, []);
    useAbBouwInteractions();
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };
}
