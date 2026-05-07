import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import hero from '@/assets/home/hero.jpg';
import about from '@/assets/home/about.jpg';
import why from '@/assets/home/why.jpg';
const HTML = `
${buildNav('over')}

${buildHero({
  bg: hero,
  eyebrow: 'Over ons',
  title: 'Bouwen aan vertrouwen,<br/>sinds <span style="color:var(--accent)">2010</span>.',
  lede: 'Wat startte als een eenmanszaak in Willebroek, groeide uit tot een Vlaamse bouwgroep met zes specialisaties, zonder ooit de menselijke aanpak te verliezen.',
  primary: { label: 'Plan een kennismaking', href: '/contact' },
  secondary: { label: 'Bekijk ons werk →', href: '/realisaties' },
})}

<!-- INTRO + PORTRAIT -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Wie we zijn</span>
        <h2 class="lf-h2">Een familiebedrijf<br/>met vakmensen in dienst.</h2>
        <p class="lf-lede">AB Bouw Group is geen tussenpersoon. Wij hebben metselaars, dakdekkers, tegelzetters en schrijnwerkers in vaste dienst, en nemen daarmee de volledige verantwoordelijkheid voor uw project. Geen dunne prijsofferte met dikke meerwerken achteraf, maar een duidelijke prijs die we ook houden.</p>
        <p class="lf-lede">Onze klanten zijn particulieren die hun gezinswoning bouwen of renoveren, architecten die een betrouwbare uitvoerder zoeken, en kleine ondernemers die hun zaak laten verbouwen. Wat ze gemeen hebben: ze willen één aanspreekpunt en een resultaat dat lang meegaat.</p>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${about}" alt="AB Bouw Group team op de werf" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- MISSIE & VISIE -->
<section class="lf-section">
  <div class="wrap">
    <div class="ab-mv-grid">
      <div class="ab-mv-card ab-mv-mission" data-reveal>
        <div class="ab-mv-tag">Missie</div>
        <h3>Bouwen wat we zelf zouden willen kopen.</h3>
        <p>Elke woning, elke renovatie, elke badkamer leveren we op met de standaard die we voor onze eigen familie zouden eisen. Geen onafgewerkte hoekjes, geen verstopte gebreken, geen excuses.</p>
      </div>
      <div class="ab-mv-card ab-mv-vision" data-reveal data-reveal-delay="1">
        <div class="ab-mv-tag">Visie</div>
        <h3>Het bouwbedrijf waar mensen blijven werken.</h3>
        <p>Goede werven beginnen bij goede vakmensen. We investeren in opleiding, modern materieel en een correcte verloning, zodat onze ploegen blijven, en onze klanten dezelfde gezichten op hun werf blijven zien.</p>
      </div>
    </div>
  </div>
</section>

<!-- ERKENNINGEN / CERTIFICATEN -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Erkenningen</span>
        <h2 class="lf-h2">Officieel erkend,<br/>verzekerd en gecertificeerd.</h2>
        <p class="lf-lede">Werken met een erkende aannemer is geen luxe, het is uw garantie dat de wettelijke verplichtingen, de tienjarige aansprakelijkheid en de verzekeringen écht in orde zijn.</p>
      </div>
      <div class="ab-certs" data-reveal data-reveal-delay="1">
        <div class="ab-cert"><strong>VCA*</strong><span>Veiligheidscertificering aannemers, jaarlijks geauditeerd</span></div>
        <div class="ab-cert"><strong>10-jarige aansprakelijkheid</strong><span>Polis stabiliteit &amp; waterdichtheid bij Federale Verzekering</span></div>
        <div class="ab-cert"><strong>BTW &amp; KBO geregistreerd</strong><span>BE 0XXX.XXX.XXX, Confederatie Bouw lid</span></div>
        <div class="ab-cert"><strong>EPB-verslaggever in huis</strong><span>Voor renovatie- en nieuwbouwdossiers</span></div>
        <div class="ab-cert"><strong>Erkend voor Mijn VerbouwPremie</strong><span>Wij dienen het premiedossier voor u in</span></div>
      </div>
    </div>
  </div>
</section>

${buildCta('Een eerste gesprek is vrijblijvend.', 'Bel ons of plan een kennismaking. We luisteren naar uw plannen, geven onze eerlijke kijk en bekijken samen of we de juiste partner zijn.')}

${FOOTER}

<style>
.ab-timeline { max-width: 820px; margin: 0 auto; position: relative; }
.ab-timeline::before { content:''; position:absolute; left: 80px; top: 12px; bottom: 12px; width: 2px; background: var(--ink-line); }
.ab-tl-item { display:grid; grid-template-columns: 80px 1fr; gap: 28px; align-items:flex-start; padding: 14px 0; position: relative; }
.ab-tl-year { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--accent); text-align: right; padding-right: 12px; padding-top: 18px; position: relative; }
.ab-tl-year::after { content:''; position:absolute; right: -7px; top: 26px; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); border: 3px solid #fff; box-shadow: 0 0 0 2px var(--accent); z-index: 1; }
.ab-tl-card { background:#fff; padding: 22px 26px; border-radius: 12px; border: 1px solid var(--ink-line-soft); }
.ab-tl-card h4 { font-family: var(--font-display); font-size: 17px; color: var(--navy); margin-bottom: 6px; }
.ab-tl-card p { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0; }

.ab-mv-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.ab-mv-card { padding: 44px 38px; border-radius: 18px; }
.ab-mv-mission { background: var(--navy); color: #fff; }
.ab-mv-vision { background: #fff; border: 1px solid var(--ink-line-soft); }
.ab-mv-tag { display:inline-block; padding: 6px 14px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 18px; }
.ab-mv-mission .ab-mv-tag { background: var(--accent); color: #fff; }
.ab-mv-vision .ab-mv-tag { background: rgba(217,140,3,0.10); color: var(--accent); }
.ab-mv-card h3 { font-family: var(--font-display); font-size: 24px; line-height: 1.25; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 14px; }
.ab-mv-mission h3 { color: #fff; }
.ab-mv-vision h3 { color: var(--navy); }
.ab-mv-card p { font-size: 15px; line-height: 1.7; margin: 0; }
.ab-mv-mission p { color: rgba(255,255,255,0.82); }
.ab-mv-vision p { color: var(--ink-soft); }

.ab-facts { display:grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.ab-fact { background:#fff; padding: 36px 24px; border-radius: 14px; border: 1px solid var(--ink-line-soft); text-align: center; }
.ab-fact-num { font-family: var(--font-display); font-size: 44px; font-weight: 700; color: var(--accent); line-height: 1; margin-bottom: 10px; }
.ab-fact-lbl { font-size: 13px; color: var(--ink-soft); font-weight: 500; }

.ab-certs { display:grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ab-cert { background: #fff; padding: 18px 20px; border-radius: 10px; border: 1px solid var(--ink-line-soft); border-left: 3px solid var(--accent); }
.ab-cert strong { display:block; font-family: var(--font-display); font-size: 14.5px; color: var(--navy); margin-bottom: 4px; }
.ab-cert span { font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; }

@media (max-width: 760px) {
  .ab-timeline::before { left: 56px; }
  .ab-tl-item { grid-template-columns: 56px 1fr; gap: 18px; }
  .ab-tl-year { font-size: 17px; padding-top: 16px; }
  .ab-mv-grid { grid-template-columns: 1fr; }
  .ab-mv-card { padding: 30px 24px; }
  .ab-facts { grid-template-columns: 1fr 1fr; gap: 14px; }
  .ab-fact { padding: 24px 14px; }
  .ab-fact-num { font-size: 32px; }
  .ab-certs { grid-template-columns: 1fr; }
}
</style>
`;

export default function OverOns() {
  useEffect(() => {
    document.title = "Over ons | AB Bouw Group | Vlaams familiebedrijf sinds 2010";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Leer AB Bouw Group kennen: 15 jaar ervaring, 6 divisies, eigen vakmensen in dienst. VCA*-gecertificeerd.");
    const prev = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prev; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
