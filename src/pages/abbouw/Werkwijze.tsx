import { useEffect } from 'react';
import '@/styles/roofpro.css';
// hero-werkwijze.jpg was een geposeerde stockfoto (twee mannen die omhoog wijzen)
import hero from '@/assets/home/hero-diensten.jpg';
// De acht stapfoto's zijn eruit (aug 2026, op vraag van Mohammed): AI-beelden
// met mensen erop, en mensen overtuigend genereren lukt niet. De stapkaarten
// zijn nu tekst; het nummer draagt de kaart.
import { CONTACT } from '@/data/contact';
import { icStap, icPad, rpNav, rpFooter, wireMobielMenu } from './_rp';

/* 4 okt 2026: alle tekst op deze pagina is de tekst die Mohammed aanleverde,
   letterlijk, in de u-vorm van de rest van de site (zijn keuze). Zijn regel
   "Beoordeeld met 4,9/5 op Google · Al 120+ woningen" staat er niet op: AB
   heeft één Google-review, en die twee claims zijn op 1 okt van de site
   gehaald (check:claims). Daarmee is ook de oude proefchip met dezelfde
   claims onder de afsluitband weg. */
const STAPPEN = [
  { n: '01', ic: icStap.bel, t: 'Eerste contact', tag: 'Binnen 1 tot 2 dagen',
    d: 'U laat uw gegevens achter of belt ons op. We nemen snel contact met u op om uw plannen kort te bespreken en direct een afspraak in te plannen voor een plaatsbezoek.' },
  { n: '02', ic: icStap.bezoek, t: 'Plaatsbezoek en technisch advies', tag: 'Binnen de eerste week',
    d: 'We komen persoonlijk langs om de situatie op te meten en de bestaande toestand in kaart te brengen. U krijgt ter plaatse al eerlijk, haalbaar advies over welke aanpak technisch en financieel het meest logisch is.' },
  { n: '03', ic: icStap.meten, t: 'Transparante offerte', tag: 'Week 2 tot 3',
    d: 'Geen vage totaalbedragen. U ontvangt een uiterst gedetailleerde offerte waarin elke post (materialen, uitvoering, afbraak en afvoer) helder is gesplitst. We nemen deze samen door zodat u exact weet waar uw budget naartoe gaat.' },
  { n: '04', ic: icStap.planning, t: 'Voorbereiding en planning', tag: 'Vanaf week 3',
    d: 'Na uw akkoord schieten wij in actie. We bestellen de materialen, plannen onze vaste ploegen in en regelen waar nodig de EPB-verslaggeving. Het belangrijkste: u krijgt de exacte startdatum zwart op wit.' },
  { n: '05', ic: icStap.werf, t: 'Uitvoering van de werken', tag: 'Duur afhankelijk van het project',
    d: 'De werken starten op de afgesproken dag. Onze werfleider bewaakt de planning streng en houdt u op de hoogte van de voortgang. Elke vrijdag ruimen we de werf grondig op, zodat uw huis netjes en veilig het weekend in gaat.' },
  { n: '06', ic: icStap.lijst, t: 'Vooroplevering en controle', tag: 'De laatste week',
    d: 'Voor we de werken definitief afronden, lopen we samen de volledige werf over. We noteren de laatste details op een afwerkingslijst en zorgen dat deze puntjes direct worden opgelost.' },
  { n: '07', ic: icStap.sleutel, t: 'Officiële oplevering', tag: 'De laatste dag',
    d: 'Het project is afgerond. We overlopen samen het eindresultaat en overhandigen u het complete opleverdossier. Hierin zitten alle attesten, garantiebewijzen en de specificaties van de gebruikte materialen.' },
  { n: '08', ic: icStap.garantie, t: 'Nazorg en garantie', tag: 'Voor de komende 10 jaar',
    d: 'Onze verantwoordelijkheid stopt niet wanneer we de oprit afrijden. U krijgt 10 jaar wettelijke, schriftelijke garantie op structurele renovaties en daken. Merkt u nadien toch iets op? Eén telefoontje en we komen het oplossen.' },
];

/** Een stapkaart. Staat zowel in de hero (de eerste) als in het pad. */
const kaart = (s: typeof STAPPEN[number], kant?: string) => `
      <article class="rp-step rp-step--tekst rp-pad__stap${kant ? ' rp-pad__stap--' + kant : ''}">
        <div class="rp-step__body">
          <div class="rp-step__badge">${s.ic}
            <span class="rp-step__pil">Stap ${s.n}</span>
          </div>
          <h3 class="rp-step__t">${s.t}</h3>
          <p class="rp-step__d">${s.d}</p>
          <p class="rp-step__tijd">${s.tag}</p>
        </div>
      </article>`;

const HTML = () => `<div class="rp">
${rpNav('/werkwijze')}

<section class="rp-phero rp-phero--pad">
  <div class="rp-wrap rp-phero__pad-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Werkwijze</span></nav>
    <h1 class="rp-phero__t">Onze werkwijze</h1>
    <p class="rp-phero__sub">Van uw eerste telefoontje tot 10 jaar na oplevering.</p>
    <p class="rp-phero__lede">Verbouwen brengt vaak stress met zich mee door onduidelijke planningen, onbereikbare aannemers en vage afspraken. Bij AB Bouw Groep doen we daar niet aan mee. Wij werken volgens een transparant stappenplan. Zo weet u op elk moment in het proces exact wat er gebeurt en wanneer u iets van ons mag verwachten.</p>
    <h2 class="rp-phero__h2">8 stappen naar een zorgeloze oplevering</h2>

    <!-- Het pad begint hier: de eerste kaart staat naast de kop, in de ruimte
         die de tekst vrijlaat. De boog eronder loopt door naar stap twee. -->
    <div class="rp-phero__stap">
      ${kaart(STAPPEN[0])}
    </div>
  </div>
</section>


<section class="rp-section">
  <div class="rp-wrap">
    <!-- Stap een staat in de hero, dus begint dit bij twee. Die hoort links,
         waar de boog uit de hero naartoe wijst; daarna om en om. -->
    <div class="rp-pad">
      <!-- De boog vanaf de kaart in de hero. Hij hoort hier en niet daar: in
           de hero zat hij vast in een doos van 430px, terwijl hij de hele
           breedte naar links moet overbruggen. -->
      <span class="rp-pad__boog rp-pad__boog--links rp-pad__boog--start">${icPad.heroNaarLinks}</span>
      ${STAPPEN.slice(1).map((s, i) => `
      ${kaart(s, i % 2 === 0 ? 'links' : 'rechts')}
      ${i === STAPPEN.length - 2 ? '' : `<span class="rp-pad__boog rp-pad__boog--${i % 2 === 0 ? 'rechts' : 'links'}">${i % 2 === 0 ? icPad.naarRechts : icPad.naarLinks}</span>`}
      `).join('')}
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
        <h2 class="rp-cta__t">Klaar voor stap 1?</h2>
        <p class="rp-cta__p">Het plaatsbezoek en de gedetailleerde offerte zijn volledig kosteloos. Daarna beslist u in alle rust of u de samenwerking aangaat.</p>
        <div style="margin-top:26px;display:flex;flex-wrap:wrap;gap:12px">
          <a class="rp-btn rp-btn--primary" href="/contact">Plan een kosteloos plaatsbezoek</a>
        </div>
        <p class="rp-cta__bel">Of bel ons op <a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a></p>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Werkwijze() {
  useEffect(() => {
    document.title = 'Werkwijze · AB Bouw Groep';
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
