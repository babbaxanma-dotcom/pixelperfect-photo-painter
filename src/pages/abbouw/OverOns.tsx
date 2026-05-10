import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import hero from '@/assets/home/hero-over.jpg';
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
  lede: 'Wat begon als een eenmanszaak in Willebroek groeide uit tot een Vlaamse bouwgroep met zes specialisaties en 23 vakmensen in vaste dienst, zonder ooit de menselijke aanpak te verliezen.',
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
      <p class="lf-lede" style="margin: 0 auto;">Geen marketingpraat. Gewoon hoe we al vijftien jaar werken, en waarom klanten ons aanbevelen aan hun buren.</p>
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
          <p>Onze offertes zijn gedetailleerd en bindend. Materialen, uurloon en planning, alles uitgesplitst. Wat we afspreken, dat bouwen we, voor de prijs die op papier staat.</p>
        </div>
      </article>
      <article class="ab-pillar" data-reveal data-reveal-delay="2">
        <div class="ab-pillar-img"><img src="${skills}" alt="Werfleider overlegt met opdrachtgever" loading="lazy"/></div>
        <div class="ab-pillar-body">
          <span class="ab-pillar-num">03</span>
          <h3>Eén aanspreekpunt</h3>
          <p>U krijgt één werfleider die uw dossier kent, van het plaatsbezoek tot de oplevering. Geen rondgestuurde mails, geen drie nummers om te bellen. Eén gezicht, eén mens.</p>
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
        <p>Goede werven beginnen bij goede vakmensen. We investeren in opleiding, modern materieel en een correcte verloning, zodat onze ploegen blijven, en onze klanten dezelfde gezichten op hun werf zien, jaar na jaar.</p>
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

<!-- HOE WIJ WERKEN -->
<section class="lf-section lf-tone-soft ab-rules-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Hoe wij werken</span>
      <h2 class="lf-h2">Acht afspraken die wij<br/>met onszelf maken.</h2>
      <p class="lf-lede" style="margin: 0 auto;">Geen loze beloftes. Klik door de acht punten die in elke offerte staan.</p>
    </div>

    <div class="ab-promise" data-promise>
      <div class="ab-promise-tabs" data-promise-tabs>
        ${[
          ['01','Plaatsbezoek binnen 5 werkdagen'],
          ['02','Offerte in 7 werkdagen'],
          ['03','Vaste startdatum op contract'],
          ['04','Wekelijks werfrapport'],
          ['05','Eén factuur per fase'],
          ['06','Werf opgeruimd op vrijdag'],
          ['07','Premiedossier door ons'],
          ['08','Nacontrole na 1 jaar'],
        ].map(([n,t], i) => `<button type="button" class="ab-promise-tab${i===0?' is-active':''}" data-promise-tab="${i}"><span class="ab-promise-tab-num">${n}</span><span class="ab-promise-tab-title">${t}</span></button>`).join('')}
      </div>

      <div class="ab-promise-stage" data-promise-stage>
        ${[
          ['01','Plaatsbezoek binnen 5 werkdagen','U belt of mailt, wij komen binnen de week ter plaatse. Geen tussenpersonen, gewoon de werfleider die uw project zal opvolgen.','Reactie binnen 24 u·Werfleider zelf ter plaatse·Vrijblijvend & gratis'],
          ['02','Offerte in 7 werkdagen','Een gedetailleerde meetstaat, geen ronde forfaits. U weet exact wat materiaal kost, wat uurloon kost en wat de marge is.','Post per post uitgesplitst·Bindende prijs·Mondeling toegelicht'],
          ['03','Vaste startdatum op contract','Bij ondertekening krijgt u een planning met start- én opleveringsdatum. Verschuift het, dan hoort u dat minstens twee weken vooraf.','Start- & einddatum zwart op wit·Boeteclausule bij vertraging·Geen open einde'],
          ['04','Wekelijks werfrapport','Elke vrijdag krijgt u een korte mail met foto\\u2019s, gewerkte uren en de planning voor de volgende week. U weet altijd waar we staan.','Foto\\u2019s van de week·Gewerkte uren per fase·Planning vooruit'],
          ['05','Eén factuur per fase','Geen losse rekeningen van metselaar, dakwerker en tegelzetter. Eén schijf per fase, telkens nadat u die fase samen met ons heeft opgeleverd.','Eén aanspreekpunt voor facturatie·Schijf na oplevering fase·Geen voorschotten zonder werk'],
          ['06','Werf opgeruimd op vrijdag','Standaard inbegrepen. Vloeren afgedekt, materiaal gestapeld, container leeg. U gebruikt uw woning gewoon door tijdens de werken.','Stof­schotten & vloerbescherming·Container wekelijks geleegd·Sanitair blijft bruikbaar'],
          ['07','Premiedossier door ons','Mijn VerbouwPremie en Fluvius worden door onze EPB-verslaggever ingediend. Gemiddeld goed voor \\u20ac4.200 retour per renovatieproject.','EPB-verslaggever in huis·Mijn VerbouwPremie + Fluvius·Gemiddeld \\u20ac4.200 retour'],
          ['08','Nacontrole na 1 jaar','Krimpscheuren, deuren bijregelen, voegen nakijken. Eén jaar na oplevering komen we gratis langs voor een eindcontrole.','Gratis nacontrole·Bijregelen inbegrepen·10 jaar aansprakelijkheid'],
        ].map(([n,t,d,b], i) => `
          <article class="ab-promise-panel${i===0?' is-active':''}" data-promise-panel="${i}">
            <div class="ab-promise-bignum">${n}</div>
            <div class="ab-promise-body">
              <span class="ab-promise-eyebrow">Afspraak ${n}</span>
              <h3>${t}</h3>
              <p>${d}</p>
              <ul class="ab-promise-bullets">
                ${(b as string).split('·').map(x => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>${x.trim()}</span></li>`).join('')}
              </ul>
            </div>
          </article>
        `).join('')}
        <div class="ab-promise-progress" data-promise-progress><i></i></div>
      </div>
    </div>
  </div>
</section>

<!-- TIJDLIJN -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Vijftien jaar bouwen</span>
      <h2 class="lf-h2">Ons verhaal,<br/>jaar per jaar.</h2>
    </div>
    <div class="ab-timeline">
      <div class="ab-tl" data-reveal><div class="ab-tl-year">2010</div><div class="ab-tl-body"><h5>De eenmanszaak</h5><p>Anthony start als zelfstandig metselaar in Willebroek met één bestelwagen, een stelling en een handvol vaste klanten uit de buurt.</p></div></div>
      <div class="ab-tl" data-reveal data-reveal-delay="1"><div class="ab-tl-year">2013</div><div class="ab-tl-body"><h5>Eerste vaste medewerkers</h5><p>Twee vaste metselaars in dienst, een tweede bestelwagen, en een eigen werkplaats voor schrijnwerk in een loods in Boom.</p></div></div>
      <div class="ab-tl" data-reveal data-reveal-delay="2"><div class="ab-tl-year">2016</div><div class="ab-tl-body"><h5>AB Dakwerken</h5><p>Een eigen dakploeg vervoegt het bedrijf. Vanaf nu wordt elk dak door eigen mensen geplaatst, met eigen verzekering en garantie.</p></div></div>
      <div class="ab-tl" data-reveal data-reveal-delay="3"><div class="ab-tl-year">2019</div><div class="ab-tl-body"><h5>VCA*-certificering</h5><p>De volledige ploeg behaalt het VCA*-attest. Veiligheid op de werf wordt formeel geborgd, niet alleen vanzelfsprekend.</p></div></div>
      <div class="ab-tl" data-reveal data-reveal-delay="4"><div class="ab-tl-year">2022</div><div class="ab-tl-body"><h5>AB Ecologisch</h5><p>Met de groeiende vraag naar warmtepompen, isolatie en zonnepanelen splitsen we de energetische renovaties af in een eigen divisie.</p></div></div>
      <div class="ab-tl" data-reveal data-reveal-delay="5"><div class="ab-tl-year">2025</div><div class="ab-tl-body"><h5>Zes specialisaties, één dak</h5><p>Construct, Ecologisch, Interieurwerken, Dakwerken, Bad &amp; Wellness en Gevelbekleding. Samen 23 vakmensen in vaste dienst.</p></div></div>
    </div>
  </div>
</section>

<!-- VERHAAL / FOTO BAND -->
<section class="lf-section ab-story lf-tone-soft">
  <div class="wrap">
    <div class="lf-split">
      <div class="lf-split-img" data-reveal><img src="${why}" alt="Werf AB Bouw Group in uitvoering" loading="lazy"/></div>
      <div data-reveal data-reveal-delay="1">
        <span class="lf-eyebrow">Onze werkregio</span>
        <h2 class="lf-h2">Vlaams gebouwd,<br/>lokaal verankerd.</h2>
        <p class="lf-lede">Vanuit ons kantoor in Willebroek bedienen we Antwerpen, Mechelen, Boom, Bonheiden, Lier, Brussel en omliggende gemeenten. Onze vaste leveranciers zitten in dezelfde driehoek, waardoor materiaal nooit ver moet komen en wij u snel kunnen helpen, ook bij dringende interventies.</p>
        <p class="lf-lede">We blijven bewust een Vlaamse familiale bouwgroep. Groot genoeg om uw volledig project zelf te dragen, klein genoeg om u bij naam te kennen en jaren later nog op te bellen om te vragen hoe het ermee gaat.</p>
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
        <p class="lf-lede">Werken met een erkende aannemer is geen luxe. Het is uw garantie dat de wettelijke verplichtingen, de tienjarige aansprakelijkheid en de verzekeringen écht in orde zijn.</p>
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

.ab-promise { margin-top: 36px; display: grid; grid-template-columns: 320px 1fr; gap: 28px; align-items: stretch; }
.ab-promise-tabs { display: flex; flex-direction: column; gap: 6px; }
.ab-promise-tab { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: transparent; border: none; border-left: 3px solid transparent; border-radius: 10px; cursor: pointer; text-align: left; transition: background .25s var(--ease), border-color .25s var(--ease), transform .25s var(--ease); font-family: inherit; }
.ab-promise-tab:hover { background: rgba(255,255,255,.65); transform: translateX(2px); }
.ab-promise-tab.is-active { background: #fff; border-left-color: var(--accent); box-shadow: 0 18px 40px -28px rgba(15,17,21,.22); }
.ab-promise-tab-num { font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--accent); letter-spacing: .12em; min-width: 26px; }
.ab-promise-tab-title { font-family: var(--font-display); font-size: 14.5px; color: var(--navy); font-weight: 600; line-height: 1.3; }

.ab-promise-stage { position: relative; background: #fff; border-radius: 18px; border: 1px solid var(--ink-line-soft); padding: 44px 48px 56px; min-height: 360px; overflow: hidden; box-shadow: 0 30px 60px -40px rgba(15,17,21,.18); }
.ab-promise-panel { position: absolute; inset: 44px 48px 56px; display: grid; grid-template-columns: auto 1fr; gap: 36px; align-items: start; opacity: 0; transform: translateY(14px); pointer-events: none; transition: opacity .5s var(--ease), transform .5s var(--ease); }
.ab-promise-panel.is-active { opacity: 1; transform: translateY(0); pointer-events: auto; }
.ab-promise-bignum { font-family: var(--font-display); font-size: 120px; font-weight: 700; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px var(--accent); letter-spacing: -0.04em; margin-top: -8px; }
.ab-promise-body { max-width: 520px; }
.ab-promise-eyebrow { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.ab-promise-body h3 { font-family: var(--font-display); font-size: 26px; line-height: 1.2; color: var(--navy); margin: 0 0 14px; letter-spacing: -0.01em; }
.ab-promise-body p { font-size: 15px; line-height: 1.65; color: var(--ink-soft); margin: 0 0 22px; }
.ab-promise-bullets { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.ab-promise-bullets li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--navy); font-weight: 500; }
.ab-promise-bullets svg { color: var(--accent); flex-shrink: 0; }
.ab-promise-progress { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(0,0,0,.04); overflow: hidden; }
.ab-promise-progress i { display: block; height: 100%; width: 0; background: var(--accent); transition: width .15s linear; }

.ab-timeline { display:grid; grid-template-columns: repeat(3, 1fr); gap: 22px; max-width: 1100px; margin: 0 auto; }
.ab-tl { background:#fff; border:1px solid var(--ink-line-soft); border-radius: 14px; padding: 24px 24px 26px; border-top: 3px solid var(--accent); }
.ab-tl-year { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--navy); letter-spacing: -0.02em; margin-bottom: 10px; }
.ab-tl-body h5 { font-family: var(--font-display); font-size: 15.5px; color: var(--navy); margin: 0 0 6px; }
.ab-tl-body p { font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); margin: 0; }

.ab-certs { display:grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ab-cert { background: #fff; padding: 18px 20px; border-radius: 10px; border: 1px solid var(--ink-line-soft); border-left: 3px solid var(--accent); }
.ab-cert strong { display:block; font-family: var(--font-display); font-size: 14.5px; color: var(--navy); margin-bottom: 4px; }
.ab-cert span { font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; }

@media (max-width: 1100px) {
  .ab-promise { grid-template-columns: 1fr; }
  .ab-promise-tabs { flex-direction: row; overflow-x: auto; gap: 8px; padding-bottom: 4px; scrollbar-width: none; }
  .ab-promise-tabs::-webkit-scrollbar { display: none; }
  .ab-promise-tab { flex: 0 0 auto; border-left: none; border-bottom: 3px solid transparent; padding: 10px 14px; }
  .ab-promise-tab.is-active { border-left-color: transparent; border-bottom-color: var(--accent); }
  .ab-promise-tab-title { display: none; }
  .ab-promise-tab-num { font-size: 14px; }
}
@media (max-width: 960px) {
  .ab-pillars { grid-template-columns: 1fr; }
  .ab-team { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
  .ab-timeline { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 760px) {
  .ab-mv-grid { grid-template-columns: 1fr; }
  .ab-mv-card { padding: 30px 24px; }
  .ab-facts { grid-template-columns: 1fr 1fr; gap: 14px; }
  .ab-fact { padding: 24px 14px; }
  .ab-fact-num { font-size: 32px; }
  .ab-certs { grid-template-columns: 1fr; }
  .ab-timeline { grid-template-columns: 1fr; }
  .ab-promise-stage { padding: 28px 22px 40px; min-height: 420px; }
  .ab-promise-panel { inset: 28px 22px 40px; grid-template-columns: 1fr; gap: 6px; }
  .ab-promise-bignum { font-size: 72px; }
  .ab-promise-body h3 { font-size: 21px; }
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

    const promise = document.querySelector<HTMLElement>('[data-promise]');
    let cleanupPromise = () => {};
    if (promise) {
      const tabs = Array.from(promise.querySelectorAll<HTMLButtonElement>('[data-promise-tab]'));
      const panels = Array.from(promise.querySelectorAll<HTMLElement>('[data-promise-panel]'));
      const progress = promise.querySelector<HTMLElement>('[data-promise-progress] i');
      let active = 0;
      let raf = 0;
      let start = performance.now();
      let paused = false;
      const DURATION = 5000;
      const setActive = (i: number, resetTimer = true) => {
        active = (i + panels.length) % panels.length;
        tabs.forEach((t, k) => t.classList.toggle('is-active', k === active));
        panels.forEach((p, k) => p.classList.toggle('is-active', k === active));
        if (resetTimer) start = performance.now();
      };
      const tick = (now: number) => {
        if (!paused) {
          const pct = Math.min(1, (now - start) / DURATION);
          if (progress) progress.style.width = `${pct * 100}%`;
          if (pct >= 1) setActive(active + 1);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      const handlers: Array<[HTMLButtonElement, () => void]> = [];
      tabs.forEach((tab, i) => {
        const h = () => setActive(i);
        tab.addEventListener('click', h);
        handlers.push([tab, h]);
      });
      const onEnter = () => { paused = true; };
      const onLeave = () => { paused = false; start = performance.now(); };
      promise.addEventListener('mouseenter', onEnter);
      promise.addEventListener('mouseleave', onLeave);
      cleanupPromise = () => {
        cancelAnimationFrame(raf);
        handlers.forEach(([el, h]) => el.removeEventListener('click', h));
        promise.removeEventListener('mouseenter', onEnter);
        promise.removeEventListener('mouseleave', onLeave);
      };
    }

    return () => { document.body.className = prev; styleEl.remove(); cleanupPromise(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
