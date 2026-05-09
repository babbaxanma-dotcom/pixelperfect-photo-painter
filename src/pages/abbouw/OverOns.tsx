import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import hero from '@/assets/home/hero.jpg';
import about from '@/assets/home/about.jpg';
import why from '@/assets/home/why.jpg';
import skills from '@/assets/home/skills.jpg';
import vakmanDak from '@/assets/home/vakman-dak.jpg';
import vakmanInterieur from '@/assets/home/vakman-interieur.jpg';
import team1 from '@/assets/home/team1.jpg';
import team2 from '@/assets/home/team2.jpg';
import team3 from '@/assets/home/team3.jpg';

const HTML = `
${buildNav('over')}

${buildHero({
  bg: hero,
  eyebrow: '15 jaar ervaring',
  title: 'Bouwen aan vertrouwen,<br/>steen voor <span style="color:var(--accent)">steen</span>.',
  lede: 'Wat begon als een eenmanszaak in Willebroek groeide uit tot een Vlaamse bouwgroep met zes specialisaties en 23 vakmensen in vaste dienst — zonder ooit de menselijke aanpak te verliezen.',
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
        <p class="lf-lede">AB Bouw Group is geen tussenpersoon en geen losse bende onderaannemers. Onze metselaars, dakdekkers, tegelzetters en schrijnwerkers staan op onze eigen loonlijst. Daardoor kunnen we instaan voor één planning, één prijs en één kwaliteitsstandaard, van de eerste schop tot de laatste plint.</p>
        <p class="lf-lede">Onze klanten zijn particulieren die hun gezinswoning bouwen of grondig renoveren, architecten die een uitvoerder zoeken die meedenkt, en kleine ondernemers die hun zaak laten verbouwen zonder de zaak stil te leggen. Wat ze gemeen hebben: ze willen één aanspreekpunt en een resultaat dat lang meegaat.</p>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${about}" alt="AB Bouw Group ploeg op de werf in Willebroek" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- PIJLERS / WAARDEN -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Onze pijlers</span>
      <h2 class="lf-h2">Drie principes die elke<br/>werf bij ons vorm geven.</h2>
      <p class="lf-lede" style="margin: 0 auto;">Geen marketingpraat — gewoon hoe we al vijftien jaar werken, en waarom klanten ons aanbevelen aan hun buren.</p>
    </div>
    <div class="ab-pillars">
      <article class="ab-pillar" data-reveal>
        <div class="ab-pillar-img"><img src="${vakmanInterieur}" alt="Schrijnwerker werkt aan maatkast" loading="lazy"/></div>
        <div class="ab-pillar-body">
          <span class="ab-pillar-num">01</span>
          <h3>Vakmanschap in vaste dienst</h3>
          <p>23 vakmensen die elkaar kennen, dezelfde standaarden delen en al jaren samen op de werf staan. Geen wisselende ploegen, geen taalbarrières, geen afgeschoven verantwoordelijkheid.</p>
        </div>
      </article>
      <article class="ab-pillar" data-reveal data-reveal-delay="1">
        <div class="ab-pillar-img"><img src="${vakmanDak}" alt="Dakdekker plaatst Koramic dakpannen" loading="lazy"/></div>
        <div class="ab-pillar-body">
          <span class="ab-pillar-num">02</span>
          <h3>Eén prijs, geen verrassingen</h3>
          <p>Onze offertes zijn gedetailleerd en bindend. Materialen, uurloon en planning, alles uitgesplitst. Wat we afspreken, dat bouwen we — voor de prijs die op papier staat.</p>
        </div>
      </article>
      <article class="ab-pillar" data-reveal data-reveal-delay="2">
        <div class="ab-pillar-img"><img src="${skills}" alt="Werfleider overlegt met opdrachtgever" loading="lazy"/></div>
        <div class="ab-pillar-body">
          <span class="ab-pillar-num">03</span>
          <h3>Eén aanspreekpunt</h3>
          <p>U krijgt één werfleider die uw dossier kent — van het plaatsbezoek tot de oplevering. Geen rondgestuurde mails, geen drie nummers om te bellen. Eén gezicht, eén mens.</p>
        </div>
      </article>
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
        <p>Elke woning, elke renovatie, elke badkamer leveren we op met de standaard die we voor onze eigen familie zouden eisen. Geen onafgewerkte hoekjes, geen verstopte gebreken, geen excuses achteraf.</p>
      </div>
      <div class="ab-mv-card ab-mv-vision" data-reveal data-reveal-delay="1">
        <div class="ab-mv-tag">Visie</div>
        <h3>Het bouwbedrijf waar mensen blijven werken.</h3>
        <p>Goede werven beginnen bij goede vakmensen. We investeren in opleiding, modern materieel en een correcte verloning, zodat onze ploegen blijven — en onze klanten dezelfde gezichten op hun werf zien, jaar na jaar.</p>
      </div>
    </div>
  </div>
</section>

<!-- IN CIJFERS -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">In cijfers</span>
      <h2 class="lf-h2">Een groep die rustig<br/>maar gestaag groeit.</h2>
    </div>
    <div class="ab-facts">
      <div class="ab-fact" data-reveal><div class="ab-fact-num">15</div><div class="ab-fact-lbl">Jaar ervaring</div></div>
      <div class="ab-fact" data-reveal data-reveal-delay="1"><div class="ab-fact-num">23</div><div class="ab-fact-lbl">Vakmensen in vaste dienst</div></div>
      <div class="ab-fact" data-reveal data-reveal-delay="2"><div class="ab-fact-num">184+</div><div class="ab-fact-lbl">Opgeleverde projecten</div></div>
      <div class="ab-fact" data-reveal data-reveal-delay="3"><div class="ab-fact-num">6</div><div class="ab-fact-lbl">Specialisaties onder één dak</div></div>
    </div>
  </div>
</section>

<!-- TEAM -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Het team</span>
      <h2 class="lf-h2">De mensen achter<br/>elke werf.</h2>
      <p class="lf-lede" style="margin: 0 auto;">Een kleine groep vaste gezichten die uw project van A tot Z aanstuurt. Wie u op het kennismakingsgesprek ontmoet, ziet u op de werf terug.</p>
    </div>
    <div class="ab-team">
      <article class="ab-team-card" data-reveal>
        <div class="ab-team-photo"><img src="${team1}" alt="Portret zaakvoerder AB Bouw Group" loading="lazy"/></div>
        <h4>Anthony Beerens</h4>
        <span class="ab-team-role">Zaakvoerder &amp; werfopvolging</span>
        <p>Stichter en zaakvoerder. Bouwt al 15 jaar in en rond Willebroek en blijft elke werf zelf opvolgen.</p>
      </article>
      <article class="ab-team-card" data-reveal data-reveal-delay="1">
        <div class="ab-team-photo"><img src="${team2}" alt="Portret werfleider AB Bouw Group" loading="lazy"/></div>
        <h4>Tom Verhaegen</h4>
        <span class="ab-team-role">Werfleider ruwbouw &amp; dakwerken</span>
        <p>Stuurt de ruwbouw- en dakploegen aan. Uw eerste aanspreekpunt zodra de schop in de grond gaat.</p>
      </article>
      <article class="ab-team-card" data-reveal data-reveal-delay="2">
        <div class="ab-team-photo"><img src="${team3}" alt="Portret projectleider afwerking AB Bouw Group" loading="lazy"/></div>
        <h4>Sarah Van den Broeck</h4>
        <span class="ab-team-role">Projectleider afwerking &amp; interieur</span>
        <p>Coördineert tegelzetters, schrijnwerkers en sanitair. Bewaakt timing, materiaalkeuzes en oplevering.</p>
      </article>
    </div>
  </div>
</section>

<!-- VERHAAL / FOTO BAND -->
<section class="lf-section ab-story">
  <div class="wrap">
    <div class="lf-split">
      <div class="lf-split-img" data-reveal><img src="${why}" alt="Werf AB Bouw Group in uitvoering" loading="lazy"/></div>
      <div data-reveal data-reveal-delay="1">
        <span class="lf-eyebrow">Ons verhaal</span>
        <h2 class="lf-h2">Van eenmanszaak<br/>tot Vlaamse bouwgroep.</h2>
        <p class="lf-lede">In 2010 startte Anthony als zelfstandig metselaar, met één bestelwagen en de overtuiging dat eerlijk werk vanzelf nieuwe klanten brengt. Vijftien jaar later staan er zes specialisaties onder één dak, een eigen werfopvolging en een ploeg die er nog elke dag voor gáát.</p>
        <p class="lf-lede">We zijn geen ketenbedrijf en willen het ook niet worden. We blijven groot genoeg om uw volledig project zelf te dragen, en klein genoeg om u bij naam te kennen.</p>
      </div>
    </div>
  </div>
</section>

<!-- ERKENNINGEN / CERTIFICATEN -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Erkenningen</span>
        <h2 class="lf-h2">Officieel erkend,<br/>verzekerd en gecertificeerd.</h2>
        <p class="lf-lede">Werken met een erkende aannemer is geen luxe — het is uw garantie dat de wettelijke verplichtingen, de tienjarige aansprakelijkheid en de verzekeringen écht in orde zijn.</p>
      </div>
      <div class="ab-certs" data-reveal data-reveal-delay="1">
        <div class="ab-cert"><strong>VCA*</strong><span>Veiligheidscertificering aannemers, jaarlijks geauditeerd</span></div>
        <div class="ab-cert"><strong>10-jarige aansprakelijkheid</strong><span>Polis stabiliteit &amp; waterdichtheid bij Federale Verzekering</span></div>
        <div class="ab-cert"><strong>BTW &amp; KBO geregistreerd</strong><span>BE 0712.443.881 · lid Bouwunie</span></div>
        <div class="ab-cert"><strong>EPB-verslaggever in huis</strong><span>Voor renovatie- en nieuwbouwdossiers</span></div>
        <div class="ab-cert"><strong>Erkend voor Mijn VerbouwPremie</strong><span>Wij dienen het premiedossier voor u in</span></div>
        <div class="ab-cert"><strong>Eigen ploegen, geen schijnzelfstandigen</strong><span>Alle vakmensen in vaste dienst, RSZ in orde</span></div>
      </div>
    </div>
  </div>
</section>

${buildCta('Een eerste gesprek is altijd vrijblijvend.', 'Bel ons of plan een kennismaking. We luisteren naar uw plannen, geven onze eerlijke kijk en bekijken samen of we de juiste partner zijn.')}

${FOOTER}

<style>
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

.ab-pillars { display:grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
.ab-pillar { background:#fff; border-radius: 16px; overflow: hidden; border: 1px solid var(--ink-line-soft); display:flex; flex-direction:column; transition: transform .35s var(--ease), box-shadow .35s var(--ease); }
.ab-pillar:hover { transform: translateY(-4px); box-shadow: 0 28px 50px -28px rgba(15,17,21,.22); }
.ab-pillar-img { aspect-ratio: 4/3; overflow: hidden; }
.ab-pillar-img img { width:100%; height:100%; object-fit:cover; transition: transform .6s var(--ease); }
.ab-pillar:hover .ab-pillar-img img { transform: scale(1.04); }
.ab-pillar-body { padding: 26px 26px 30px; position:relative; }
.ab-pillar-num { font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--accent); letter-spacing: .12em; }
.ab-pillar h3 { font-family: var(--font-display); font-size: 19px; color: var(--navy); margin: 8px 0 10px; line-height: 1.3; }
.ab-pillar p { font-size: 14.5px; line-height: 1.65; color: var(--ink-soft); margin: 0; }

.ab-facts { display:grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.ab-fact { background:#fff; padding: 36px 24px; border-radius: 14px; border: 1px solid var(--ink-line-soft); text-align: center; }
.ab-fact-num { font-family: var(--font-display); font-size: 44px; font-weight: 700; color: var(--accent); line-height: 1; margin-bottom: 10px; }
.ab-fact-lbl { font-size: 13px; color: var(--ink-soft); font-weight: 500; }

.ab-team { display:grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
.ab-team-card { background:#fff; border-radius: 16px; overflow: hidden; border: 1px solid var(--ink-line-soft); padding-bottom: 26px; }
.ab-team-photo { aspect-ratio: 4/5; overflow: hidden; background: var(--ink-line-soft); }
.ab-team-photo img { width:100%; height:100%; object-fit:cover; filter: saturate(.95); }
.ab-team-card h4 { font-family: var(--font-display); font-size: 18px; color: var(--navy); margin: 22px 26px 4px; }
.ab-team-role { display:block; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin: 0 26px 12px; }
.ab-team-card p { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0 26px; }

.ab-story .lf-split-img img { border-radius: 16px; }

.ab-certs { display:grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ab-cert { background: #fff; padding: 18px 20px; border-radius: 10px; border: 1px solid var(--ink-line-soft); border-left: 3px solid var(--accent); }
.ab-cert strong { display:block; font-family: var(--font-display); font-size: 14.5px; color: var(--navy); margin-bottom: 4px; }
.ab-cert span { font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; }

@media (max-width: 960px) {
  .ab-pillars { grid-template-columns: 1fr; }
  .ab-team { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
}
@media (max-width: 760px) {
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
    document.title = "Over ons | AB Bouw Group | 15 jaar Vlaams vakmanschap";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Maak kennis met AB Bouw Group: 15 jaar ervaring, 6 specialisaties, 23 vakmensen in vaste dienst. VCA*-gecertificeerd familiebedrijf uit Willebroek.");
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
