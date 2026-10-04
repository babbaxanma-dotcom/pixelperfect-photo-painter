import { useEffect } from 'react';
import '@/styles/roofpro.css';
/* 5 okt 2026: een eigen werffoto van Mohammed (woonkamer met haard en
   visgraatparket), in de hero zoals op de afdelingspagina's. */
import heroFoto from '@/assets/lp-diensten/eigen/IMG_0102.jpg';
import hero from '@/assets/home/hero-over.jpg';
import { CONTACT } from '@/data/contact';
import { ic, icStap, bolletjes, rpNav, rpFooter, wireMobielMenu } from './_rp';

/* 4 okt 2026: alle tekst op deze pagina is de tekst die Mohammed aanleverde,
   letterlijk, in de u-vorm. "120+ woningen gerenoveerd" uit zijn cijferregel
   staat er niet op: niet na te trekken, en op 1 okt van de site gehaald
   (check:claims). De andere punten koos hij bewust letterlijk, ook die Bardh
   nog niet bevestigde.

   5 okt 2026, "en bij over ons ook visueel verbeteren": de hero kreeg een foto
   en de twee cijfers, en de structuur en de erkenningen zijn bolletjes in de
   vorm van de homepage. Geen woord tekst veranderd. */
const CIJFERS = [
  { n: '16', l: 'jaar ervaring' },
  { n: '6', l: 'vakdisciplines onder één dak' },
];

const STRUCTUUR = [
  { ic: icStap.mensen, t: 'Vakmensen in vaste dienst',
    d: 'Onze metselaars, dakdekkers, tegelzetters en schrijnwerkers horen bij ons vaste team. Daardoor heeft u op de werf steeds vertrouwde gezichten over de vloer die werken volgens onze eigen vaste kwaliteitsstandaarden.' },
  { ic: icStap.telefoon, t: 'Eén vaste werfleider',
    d: 'U hoeft geen zes verschillende mensen na te bellen. U krijgt één direct telefoonnummer. Uw werfleider kent de planning, is vaak aanwezig op de werf en blijft uw vaste aanspreekpunt tot na de oplevering.' },
  { ic: icStap.meten, t: 'Eén prijs, helder uitgesplitst',
    d: 'Onze offertes laten precies zien waar u voor betaalt. Elke post (afbraak, materiaal, uitvoering, afvoer) staat apart genoteerd. Mochten er tijdens de werken extra wensen bij komen, dan voeren we die pas uit na uw schriftelijk akkoord op de prijs.' },
];

const ERKENNINGEN = [
  { ic: icStap.woning, t: 'Tienjarige aansprakelijkheid', d: 'Wettelijke garantie op stabiliteit en waterdichtheid.' },
  { ic: icStap.attest, t: 'EPB-verslaggever in huis', d: 'Direct de juiste expertise voor renovaties en nieuwbouw waar een verslag verplicht is.' },
  { ic: icStap.garantie, t: 'VCA-gecertificeerd', d: 'Veilig werken staat voorop, gecontroleerd en gecertificeerd.' },
  { ic: icStap.btw, t: '6% btw-tarief', d: 'Wij zorgen voor de correcte toepassing bij woningen ouder dan tien jaar.' },
];

const HTML = () => `<div class="rp">
${rpNav('/over')}

<section class="rp-phero rp-phero--foto">
  <div class="rp-phero__bg" aria-hidden="true">
    <img src="${heroFoto}" alt="" width="1179" height="870" fetchpriority="high" decoding="async"/>
    <span class="rp-phero__veil"></span>
  </div>
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Over ons</span></nav>
    <h1 class="rp-phero__t">Het bedrijf achter<span class="rp-dim">uw verbouwing</span></h1>
    <div class="rp-hero-cijfers">
      ${CIJFERS.map((c) => `<div><span class="rp-hero-cijfers__n">${c.n}</span><span class="rp-hero-cijfers__l">${c.l}</span></div>`).join('')}
    </div>
    <div style="margin-top:30px;display:flex;flex-wrap:wrap;gap:12px">
      <a class="rp-btn rp-btn--primary" href="/contact">Plan een plaatsbezoek</a>
      <a class="rp-btn rp-btn--ghost" href="${CONTACT.phone.href}">${ic.phone(17)} ${CONTACT.phone.display}</a>
    </div>
  </div>
</section>

<section class="rp-section">
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

<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div style="max-width:760px">
        <h2 class="rp-head__title">De mensen op uw werf</h2>
        <p class="rp-split__lede">Bij een grote verbouwing wisselen verschillende disciplines elkaar af. Om dat soepel te laten verlopen, werken we met een vaste structuur:</p>
      </div>
    </div>
    ${bolletjes(STRUCTUUR)}
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div style="max-width:760px">
        <h2 class="rp-head__title">Officieel erkend<span class="rp-dim">en verzekerd</span></h2>
        <p class="rp-split__lede">We bouwen op zekerheid, voor u en voor ons.</p>
      </div>
    </div>
    ${bolletjes(ERKENNINGEN)}
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
