import { useEffect } from 'react';
import '@/styles/roofpro.css';
import hero from '@/assets/home/hero-over.jpg';
import about from '@/assets/home/about.jpg';
import why from '@/assets/home/why.jpg';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

const vink = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

const CIJFERS = [
  { n: '16', l: 'jaar ervaring in de bouw' },
  { n: '120+', l: 'woningen gerenoveerd' },
  { n: '6', l: 'vakdisciplines onder één dak' },
];

const PRINCIPES = [
  {
    n: '01', t: 'Vakmensen in vaste dienst',
    d: 'Onze metselaars, dakdekkers, tegelzetters en schrijnwerkers staan op onze eigen loonlijst. Daardoor werkt op uw werf iedere dag dezelfde ploeg, met dezelfde standaarden.',
  },
  {
    n: '02', t: 'Eén prijs, uitgesplitst',
    d: 'De offerte zet elke post apart: afbraak, materiaal, uitvoering en afvoer. Meerwerk gaat pas door na uw schriftelijke akkoord op een aparte prijs.',
  },
  {
    n: '03', t: 'Eén werfleider',
    d: 'U krijgt één nummer dat u belt. Die persoon kent uw dossier, kent de planning en blijft uw aanspreekpunt tot een jaar na de oplevering.',
  },
];

const AFSPRAKEN = [
  'Plaatsbezoek binnen vijf werkdagen',
  'Offerte binnen zeven werkdagen',
  'Vaste startdatum in het contract',
  'Wekelijks een werfrapport',
  'Eén factuur per afgeronde fase',
  'Werf elke vrijdag opgeruimd',
  'Premiedossier dienen wij mee in',
  'Nazorg tot twaalf maanden na oplevering',
];

const ERKENNINGEN = [
  { t: 'VCA', d: 'Veiligheidscertificaat aannemers, jaarlijks gecontroleerd.' },
  { t: 'BTW en KBO geregistreerd', d: 'Ondernemingsnummer opvraagbaar; staat op elke offerte en factuur.' },
  { t: '6% btw bij renovatie', d: 'Voor woningen ouder dan tien jaar, en de Mijn VerbouwLening waar u aan de voorwaarden voldoet.' },
  { t: 'Tienjarige aansprakelijkheid', d: 'Polis stabiliteit en waterdichtheid bij een federale verzekeraar.' },
  { t: 'EPB-verslaggever in huis', d: 'Voor renovaties en nieuwbouw waar een verslag verplicht is.' },
  { t: 'Eigen ploegen', d: 'Mensen op de loonlijst, met correcte verloning; geen schijnconstructies.' },
];

const HTML = () => `<div class="rp">
${rpNav('/over')}

<section class="rp-phero rp-phero--foto">
  <div class="rp-phero__bg" aria-hidden="true">
    <img src="${hero}" alt="" width="1920" height="620" fetchpriority="high" decoding="async"/>
    <span class="rp-phero__veil"></span>
  </div>
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Over ons</span></nav>
    <span class="rp-eyebrow">${ic.mark} Over AB Bouw Groep</span>
    <h1 class="rp-phero__t">Het bedrijf achter<span class="rp-dim">uw verbouwing</span></h1>
    <p class="rp-phero__lede">AB Bouw Groep is een Vlaams bouw- en renovatiebedrijf met eigen afdelingen voor ruwbouw, dak, gevel, badkamer, interieur en energiewerken.</p>
  </div>
</section>


<section class="rp-section">
  <div class="rp-wrap rp-about__stats" style="grid-template-columns:repeat(3,minmax(0,1fr))">
    ${CIJFERS.map((c) => `<div><div class="rp-stat__n">${c.n}</div><div class="rp-stat__l">${c.l}</div></div>`).join('')}
  </div>
</section>

<section class="rp-section" style="padding-top:0">
  <div class="rp-wrap">
    <div class="rp-split">
      <div class="rp-split__media">
        <img src="${about}" alt="Woning in uitvoering bij AB Bouw Groep" width="560" height="420" loading="lazy" decoding="async"/>
      </div>
      <div>
        <span class="rp-eyebrow">${ic.mark} Wie we zijn</span>
        <h2 class="rp-split__t">Voor wie wij<span class="rp-dim">werken</span></h2>
        <p class="rp-split__lede">Onze klanten zijn particulieren die hun woning grondig aanpakken: een gezinswoning die op de schop gaat, een rijwoning die tot op de muren gestript wordt, of een dak dat na dertig jaar aan vervanging toe is.</p>
        <p class="rp-split__lede">We plannen per werf één ploeg in en nemen er maar zoveel aan als we met eigen mensen kunnen bemannen.</p>
      </div>
    </div>
  </div>
</section>

<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div>
        <span class="rp-eyebrow">${ic.mark} Onze principes</span>
        <h2 class="rp-head__title">Hoe wij<span class="rp-dim">werken</span></h2>
      </div>
    </div>
    <div class="rp-why__tiles rp-tiles-3">
      ${PRINCIPES.map((p) => `
      <div class="rp-tile">
        <div class="rp-split__n">${p.n}</div>
        <h3 class="rp-tile__t">${p.t}</h3>
        <p class="rp-tile__d">${p.d}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-split rp-split--om">
      <div class="rp-split__media">
        <img src="${why}" alt="Vakman van AB Bouw Groep aan het werk" width="560" height="420" loading="lazy" decoding="async"/>
      </div>
      <div>
        <span class="rp-eyebrow">${ic.mark} Wat wij vastleggen</span>
        <h2 class="rp-split__t">Acht afspraken<span class="rp-dim">die in het contract staan</span></h2>
        <p class="rp-split__lede">Deze acht punten staan in uw offerte en in de overeenkomst.</p>
        <ul class="rp-lijst">
          ${AFSPRAKEN.map((a) => `<li>${vink}<span>${a}</span></li>`).join('')}
        </ul>
        <div class="rp-split__cta"><a class="rp-btn rp-btn--primary" href="/werkwijze">Zo verloopt een project ${ic.arrowUpRight()}</a></div>
      </div>
    </div>
  </div>
</section>

<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <!-- De groepsfoto-plaatshouder is eruit (aug 2026, op vraag van Mohammed).
         Zonder tweede kolom bleef de tekst in de linkerhelft hangen, dus dit is
         nu een gecentreerd tekstblok in plaats van een rp-split. -->
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div style="max-width:760px">
        <span class="rp-eyebrow">${ic.mark} Het team</span>
        <h2 class="rp-head__title">De mensen die<span class="rp-dim">bij u over de vloer komen</span></h2>
        <p class="rp-split__lede">Op de werf staan een werfleider die de planning opvolgt en de vakmensen van de betrokken afdelingen. Bij een totaalrenovatie wisselen die afdelingen elkaar af volgens de planning die u vooraf krijgt.</p>
        <p class="rp-split__lede">De werfleider is ook de persoon die u belt tijdens de werken.</p>
      </div>
    </div>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div>
        <span class="rp-eyebrow">${ic.mark} Erkenningen</span>
        <h2 class="rp-head__title">Officieel erkend<span class="rp-dim">en verzekerd</span></h2>
      </div>
    </div>
    <div class="rp-why__tiles rp-tiles-3">
      ${ERKENNINGEN.map((e) => `
      <div class="rp-tile">
        <div class="rp-tile__ic" aria-hidden="true">${vink}</div>
        <h3 class="rp-tile__t">${e.t}</h3>
        <p class="rp-tile__d">${e.d}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="rp-cta">
  <div class="rp-wrap">
    <div class="rp-cta__box" style="min-height:270px">
      <div class="rp-cta__bg" aria-hidden="true">
        <img src="${hero}" alt="" width="1200" height="420" loading="lazy" decoding="async"/>
        <span class="rp-cta__veil"></span>
      </div>
      <div class="rp-cta__inner">
        <h2 class="rp-cta__t">Een eerste gesprek kost u niets</h2>
        <p class="rp-cta__p">We komen langs, luisteren wat u wil en zeggen eerlijk wat haalbaar is binnen uw budget.</p>
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

export default function OverOns() {
  useEffect(() => {
    document.title = 'Over ons — AB Bouw Groep';
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
