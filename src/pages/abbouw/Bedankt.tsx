import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

type DienstSleutel = 'dakwerken' | 'gevel' | 'default';
type Review = { name: string; role: string; text: string };

const KOP: Record<DienstSleutel, { r1: string; r2: string }> = {
  dakwerken: { r1: 'Bedankt, uw aanvraag', r2: 'voor dakwerken is binnen' },
  gevel: { r1: 'Bedankt, uw aanvraag', r2: 'voor gevelrenovatie is binnen' },
  default: { r1: 'Bedankt,', r2: 'uw aanvraag is binnen' },
};

/* 30 sep: hier stonden 9 reviews met naam en een Google-icoon. Ze staan NIET op
   het Google-profiel van AB (dat heeft één review, 5,0, gecontroleerd 22 sep
   2026). Zolang dat zo is blijven de lijsten leeg en toont de pagina de sectie
   niet, net als de landingspagina (lp/kgj/inhoud.ts, reviews). Echte reviews
   komen hier alleen met naam en toestemming van de klant. */
const REVIEWS: Record<DienstSleutel, Review[]> = {
  dakwerken: [],
  gevel: [],
  default: [],
};

const FASES = [
  { n: '01', t: 'Bevestiging', tijd: 'Vandaag, binnen het uur', d: 'Een mail met de samenvatting van uw aanvraag en onze contactgegevens.' },
  { n: '02', t: 'Telefonische intake', tijd: 'Eerstvolgende werkdag', d: 'Een gesprek van tien à vijftien minuten waarin we uw plannen doornemen en aangeven wat haalbaar is.' },
  { n: '03', t: 'Plaatsbezoek', tijd: 'Binnen vijf werkdagen', d: 'De projectleider komt langs, meet op, neemt foto\'s en bespreekt de opties met u.' },
  /* Geen premiedossier in de gedeelde fase-tekst: deze pagina krijgt ook
     tegelwerk- en pleisterwerk-leads, en daar bestaat geen premie voor. De
     premie-belofte staat alleen nog in de dakwerken-variant hieronder. */
  { n: '04', t: 'Offerte', tijd: 'Vijf à tien dagen later', d: 'Vaste prijs, dertig dagen geldig, met een fotorapport van het plaatsbezoek.' },
];

/* Vier zekerheden per dienst. De kop zegt letterlijk "Vier", dus elke variant
   telt er vier. Beloof per dienst alleen wat die dienst waarmaakt: de tienjarige
   garantie en het premiedossier gelden bij AB voor dakwerken, niet voor interieur
   (LpDienst toont die garantie zelf ook enkel bij ab_dakwerken). */
const ZEKERHEDEN_BASIS = [
  { t: 'Vaste prijs, bindend', d: 'De offerte is de eindfactuur. Meerwerk gaat pas door na uw schriftelijke akkoord.' },
  { t: 'Startdatum op contract', d: 'De dag waarop wij beginnen staat vast voor u tekent.' },
];
const ZEKERHEDEN: Record<DienstSleutel, { t: string; d: string }[]> = {
  dakwerken: [
    ...ZEKERHEDEN_BASIS,
    { t: '10 jaar garantie', d: 'Op de uitvoering van ons werk, schriftelijk vastgelegd in de offerte.' },
    { t: 'Premies en attesten', d: 'Wij dienen het premiedossier mee in en leveren de attesten die u nodig heeft.' },
  ],
  gevel: [
    ...ZEKERHEDEN_BASIS,
    { t: 'Eigen vaste ploeg', d: 'Uw werf wordt uitgevoerd door onze eigen mensen, niet doorgegeven aan onderaannemers.' },
    { t: '6% btw waar het kan', d: 'Is uw woning ouder dan tien jaar, dan rekenen wij 6% btw. Het papierwerk regelen wij.' },
  ],
  default: [
    ...ZEKERHEDEN_BASIS,
    { t: 'Eigen vaste ploeg', d: 'Uw werf wordt uitgevoerd door onze eigen mensen, niet doorgegeven aan onderaannemers.' },
    { t: '6% btw waar het kan', d: 'Is uw woning ouder dan tien jaar, dan rekenen wij 6% btw. Het papierwerk regelen wij.' },
  ],
};

const vink = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

const HTML = (sleutel: DienstSleutel) => {
  const kop = KOP[sleutel];
  const reviews = REVIEWS[sleutel];
  return `<div class="rp">
${rpNav('')}

<section class="rp-phero">
  <div class="rp-wrap">
    <span class="rp-eyebrow">${ic.mark} Aanvraag ontvangen</span>
    <h1 class="rp-phero__t">${kop.r1}<span class="rp-dim">${kop.r2}</span></h1>
    <p class="rp-phero__lede">U krijgt binnen het uur een bevestigingsmail. Wilt u ons intussen spreken, bel dan gerust.</p>
    <div style="margin-top:30px;display:flex;flex-wrap:wrap;gap:12px">
      <a class="rp-btn rp-btn--primary" href="${CONTACT.phone.href}">${ic.phone(17)} ${CONTACT.phone.display}</a>
      <a class="rp-btn rp-btn--ghost" href="/realisaties">Bekijk onze realisaties</a>
    </div>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div>
        <span class="rp-eyebrow">${ic.mark} Wat er nu gebeurt</span>
        <h2 class="rp-head__title">Van bevestiging<span class="rp-dim">tot offerte</span></h2>
      </div>
    </div>
    <div class="rp-steps">
      ${FASES.map((f) => `
      <article class="rp-step">
        <div class="rp-step__body">
          <div class="rp-step__n">${f.n}</div>
          <h3 class="rp-step__t">${f.t}</h3>
          <p class="rp-step__d">${f.d}</p>
          <p class="rp-step__tijd">${f.tijd}</p>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

${reviews.length ? `<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div>
        <span class="rp-eyebrow">${ic.mark} Beoordelingen</span>
        <h2 class="rp-head__title">Wat klanten zeggen<span class="rp-dim">na hun project</span></h2>
      </div>
    </div>
    <div class="rp-why__tiles rp-tiles-3">
      ${reviews.map((r) => `
      <article class="rp-rev">
        <div class="rp-rev__stars" aria-label="5 van 5 sterren">${ic.star().repeat(5)}</div>
        <p class="rp-rev__text">${r.text}</p>
        <div class="rp-rev__foot">
          <span class="rp-rev__who">
            <span class="rp-rev__name">${r.name}</span><br/>
            <span class="rp-rev__role">${r.role}</span>
          </span>
          <span class="rp-rev__g" aria-label="Google-beoordeling">${ic.google}</span>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>` : ''}

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div>
        <span class="rp-eyebrow">${ic.mark} Schriftelijk vastgelegd</span>
        <h2 class="rp-head__title">Vier zekerheden<span class="rp-dim">voor u als opdrachtgever</span></h2>
      </div>
    </div>
    <div class="rp-why__tiles rp-tiles-4">
      ${ZEKERHEDEN[sleutel].map((z) => `
      <div class="rp-tile">
        <div class="rp-tile__ic" aria-hidden="true">${vink}</div>
        <h3 class="rp-tile__t">${z.t}</h3>
        <p class="rp-tile__d">${z.d}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

${rpFooter()}
</div>`;
};

export default function Bedankt() {
  const [params] = useSearchParams();
  const ruw = (params.get('dienst') || '').toLowerCase();
  const sleutel: DienstSleutel =
    ruw.includes('dak') ? 'dakwerken' : ruw.includes('gevel') ? 'gevel' : 'default';

  useEffect(() => {
    document.title = 'Bedankt voor uw aanvraag · AB Bouw Groep';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML(sleutel) }} />;
}
