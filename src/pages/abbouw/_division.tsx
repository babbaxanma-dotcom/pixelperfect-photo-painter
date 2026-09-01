import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

export type DivisionConfig = {
  slug: string;
  num: string;
  title: string;          // bv. "AB Construct"
  eyebrow: string;        // bv. "Algemene aanneming"
  heroTitle: string;      // HTML toegestaan
  heroLede: string;
  heroBg: string;
  storyTitle: string;     // HTML toegestaan
  storyLede: string;
  storyImg: string;
  features: { n: string; t: string; d: string }[];
  whatWeDo: { n: string; t: string; d: string }[];
  process: { n: string; t: string; d: string; time: string }[];
  faqs: { q: string; a: string }[];
  meta: string;
};

const vink = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

/** <br/> in bestaande koppen wordt de grijze tweede regel van het v6-kopsjabloon */
const tweeRegels = (html: string) => {
  const delen = html.split(/<br\s*\/?>/i);
  if (delen.length < 2) return html;
  return `${delen[0]}<span class="rp-dim">${delen.slice(1).join(' ')}</span>`;
};

export function buildDivisionPage(c: DivisionConfig) {
  return `<div class="rp">
${rpNav('/diensten')}

<section class="rp-phero rp-phero--foto">
  <div class="rp-phero__bg" aria-hidden="true">
    <img src="${c.heroBg}" alt="" width="1920" height="620" fetchpriority="high" decoding="async"/>
    <span class="rp-phero__veil"></span>
  </div>
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <a href="/diensten">Diensten</a> &rsaquo; <span>${c.eyebrow}</span></nav>
    <span class="rp-eyebrow">${ic.mark} ${c.eyebrow}</span>
    <h1 class="rp-phero__t">${tweeRegels(c.heroTitle)}</h1>
    <p class="rp-phero__lede">${c.heroLede}</p>
    <div style="margin-top:30px;display:flex;flex-wrap:wrap;gap:12px">
      <a class="rp-btn rp-btn--primary" href="/contact">Plan een plaatsbezoek</a>
      <a class="rp-btn rp-btn--ghost" href="${CONTACT.phone.href}">${ic.phone(17)} ${CONTACT.phone.display}</a>
    </div>
  </div>
</section>


<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-split">
      <div class="rp-split__media">
        <img src="${c.storyImg}" alt="${c.title}" width="560" height="420" loading="lazy" decoding="async"/>
      </div>
      <div>
        <span class="rp-eyebrow">${ic.mark} ${c.title}</span>
        <h2 class="rp-split__t">${tweeRegels(c.storyTitle)}</h2>
        <p class="rp-split__lede">${c.storyLede}</p>
        <ul class="rp-lijst">
          ${c.features.map((f) => `<li>${vink}<span><strong style="color:var(--rp-ink)">${f.t}.</strong> ${f.d}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div>
        <span class="rp-eyebrow">${ic.mark} Wat wij doen</span>
        <h2 class="rp-head__title">Specialistisch werk<span class="rp-dim">door eigen mensen</span></h2>
      </div>
    </div>
    <div class="rp-why__tiles rp-tiles-3">
      ${c.whatWeDo.map((w) => `
      <div class="rp-tile">
        <div class="rp-split__n">${w.n}</div>
        <h3 class="rp-tile__t">${w.t}</h3>
        <p class="rp-tile__d">${w.d}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-head">
      <div>
        <span class="rp-eyebrow">${ic.mark} Werkwijze</span>
        <h2 class="rp-head__title">Van offerte<span class="rp-dim">tot oplevering</span></h2>
      </div>
      <a class="rp-btn rp-btn--primary" href="/werkwijze">Volledige werkwijze</a>
    </div>
    <div class="rp-steps">
      ${c.process.map((s) => `
      <article class="rp-step">
        <div class="rp-step__body">
          <div class="rp-step__n">${s.n}</div>
          <h3 class="rp-step__t">${s.t}</h3>
          <p class="rp-step__d">${s.d}</p>
          <p class="rp-step__tijd">${s.time}</p>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div>
        <span class="rp-eyebrow">${ic.mark} Veelgestelde vragen</span>
        <h2 class="rp-head__title">Wat klanten ons<span class="rp-dim">het vaakst vragen</span></h2>
      </div>
    </div>
    <div class="rp-faq">
      ${c.faqs.map((f, i) => `
      <details class="rp-faq__item"${i === 0 ? ' open' : ''}>
        <summary class="rp-faq__q">${f.q}${ic.plus}</summary>
        <div class="rp-faq__a">${f.a}</div>
      </details>`).join('')}
    </div>
  </div>
</section>

<section class="rp-cta">
  <div class="rp-wrap">
    <div class="rp-cta__box" style="min-height:270px">
      <div class="rp-cta__bg" aria-hidden="true">
        <img src="${c.heroBg}" alt="" width="1200" height="420" loading="lazy" decoding="async"/>
        <span class="rp-cta__veil"></span>
      </div>
      <div class="rp-cta__inner">
        <h2 class="rp-cta__t">Plannen voor ${c.eyebrow.toLowerCase()}?</h2>
        <p class="rp-cta__p">We komen langs, meten op en bezorgen u een offerte waarin elke post apart staat. Het plaatsbezoek is vrijblijvend.</p>
        <div style="margin-top:26px;display:flex;flex-wrap:wrap;gap:12px">
          <a class="rp-btn rp-btn--primary" href="/contact">Plan een plaatsbezoek</a>
          <a class="rp-btn rp-btn--ghost" href="${CONTACT.phone.href}" style="color:#fff;border-color:rgba(255,255,255,.34)">${ic.phone(17)} ${CONTACT.phone.display}</a>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;
}

export function makeDivision(c: DivisionConfig) {
  const html = buildDivisionPage(c);
  return function DivisionPage() {
    useEffect(() => {
      document.title = `${c.title} · AB Bouw Groep`;
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
      m.setAttribute('content', c.meta);
      window.scrollTo(0, 0);
      const op = wireMobielMenu();
      return () => op();
    }, []);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };
}
