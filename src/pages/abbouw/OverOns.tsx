import { useEffect } from 'react';
import '@/styles/roofpro.css';
import hero from '@/assets/home/hero-over.jpg';
import why from '@/assets/home/why-nieuw.jpg';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

const vink = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

/* 4 okt 2026: alle tekst op deze pagina is de tekst die Mohammed aanleverde,
   letterlijk, in de u-vorm. "120+ woningen gerenoveerd" uit zijn cijferregel
   staat er niet op: niet na te trekken, en op 1 okt van de site gehaald
   (check:claims). De andere punten koos hij bewust letterlijk, ook die Bardh
   nog niet bevestigde. */
const CIJFERS = [
  { n: '16', l: 'jaar ervaring' },
  { n: '6', l: 'vakdisciplines onder één dak' },
];

const STRUCTUUR = [
  {
    n: '01', t: 'Vakmensen in vaste dienst',
    d: 'Onze metselaars, dakdekkers, tegelzetters en schrijnwerkers horen bij ons vaste team. Daardoor heeft u op de werf steeds vertrouwde gezichten over de vloer die werken volgens onze eigen vaste kwaliteitsstandaarden.',
  },
  {
    n: '02', t: 'Eén vaste werfleider',
    d: 'U hoeft geen zes verschillende mensen na te bellen. U krijgt één direct telefoonnummer. Uw werfleider kent de planning, is vaak aanwezig op de werf en blijft uw vaste aanspreekpunt tot na de oplevering.',
  },
  {
    n: '03', t: 'Eén prijs, helder uitgesplitst',
    d: 'Onze offertes laten precies zien waar u voor betaalt. Elke post (afbraak, materiaal, uitvoering, afvoer) staat apart genoteerd. Mochten er tijdens de werken extra wensen bij komen, dan voeren we die pas uit na uw schriftelijk akkoord op de prijs.',
  },
];

const ERKENNINGEN = [
  { t: 'Tienjarige aansprakelijkheid', d: 'Wettelijke garantie op stabiliteit en waterdichtheid.' },
  { t: 'EPB-verslaggever in huis', d: 'Direct de juiste expertise voor renovaties en nieuwbouw waar een verslag verplicht is.' },
  { t: 'VCA-gecertificeerd', d: 'Veilig werken staat voorop, gecontroleerd en gecertificeerd.' },
  { t: '6% btw-tarief', d: 'Wij zorgen voor de correcte toepassing bij woningen ouder dan tien jaar.' },
];

const HTML = () => `<div class="rp">
${rpNav('/over')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Over ons</span></nav>
    <h1 class="rp-phero__t">Het bedrijf achter<span class="rp-dim">uw verbouwing</span></h1>
  </div>
</section>


<section class="rp-section">
  <div class="rp-wrap rp-about__stats rp-about__stats--twee">
    ${CIJFERS.map((c) => `<div><div class="rp-stat__n">${c.n}</div><div class="rp-stat__l">${c.l}</div></div>`).join('')}
  </div>
</section>



<section class="rp-section rp-section--soft" style="padding-top:56px;padding-bottom:0">
  <div class="rp-wrap">
    <figure class="rp-band">
      <img src="${why}" alt="Afgewerkte leefruimte met verlaagd plafond en lichtlijnen, door AB Bouw Groep"
        width="1200" height="520" loading="lazy" decoding="async"/>
    </figure>
  </div>
</section>
<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div>
        <h2 class="rp-head__title">Hoe wij werken</h2>
      </div>
    </div>

    <div class="rp-uitleg">
      <p>Verbouwen is een flinke stap. Daarom werken wij als algemeen aannemer: we nemen het volledige
      traject op ons. Geen gedoe met het afstemmen van losse vakmannen of onduidelijkheid over wie
      verantwoordelijk is. Wij voeren de werken uit, sturen de planning aan en leveren af tegen de prijs
      die we vooraf hebben afgesproken.</p>
    </div>
  </div>
</section>



<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div style="max-width:760px">
        <h2 class="rp-head__title">De mensen op uw werf</h2>
        <p class="rp-split__lede">Bij een grote verbouwing wisselen verschillende disciplines elkaar af. Om dat soepel te laten verlopen, werken we met een vaste structuur:</p>
      </div>
    </div>

    <div class="rp-why__tiles rp-tiles-3">
      ${STRUCTUUR.map((p) => `
      <div class="rp-tile">
        <div class="rp-split__n">${p.n}</div>
        <h3 class="rp-tile__t">${p.t}</h3>
        <p class="rp-tile__d">${p.d}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div style="max-width:760px">
        <h2 class="rp-head__title">Officieel erkend<span class="rp-dim">en verzekerd</span></h2>
        <p class="rp-split__lede">We bouwen op zekerheid, voor u en voor ons.</p>
      </div>
    </div>
    <div class="rp-why__tiles rp-tiles-4">
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
        <h2 class="rp-cta__t">Zullen we uw plannen bespreken?</h2>
        <p class="rp-cta__p">We komen graag langs. We luisteren naar uw ideeën, kijken naar de huidige situatie en bespreken eerlijk wat er haalbaar is binnen uw budget. Een eerste gesprek kost u niets.</p>
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
    document.title = 'Over ons · AB Bouw Groep';
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
