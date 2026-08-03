import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import { BLOGS } from '@/data/blogs';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

import heroPhoto from '@/assets/home/hero-3.jpg';
import aboutPhoto from '@/assets/home/about.jpg';
// svc-dak.jpg toont een werkman; deze sectie moet mensvrij zijn -> dakvlak zonder mensen
import svcDak from '@/assets/dak/lp-veluxg-3.jpg';
import dakTextuur from '@/assets/dak/lp-hero-pannendak.jpg';
import leiTextuur from '@/assets/dak/lp-natuurleien.jpg';
import svcGevel from '@/assets/home/svc-gevel.jpg';
import svcBad from '@/assets/home/svc-bad.jpg';
import svcInterieur from '@/assets/home/svc-interieur.jpg';
import svcConstruct from '@/assets/home/svc-construct.jpg';
import svcEco from '@/assets/home/svc-eco.jpg';
import proj1 from '@/assets/home/proj1.jpg';
import proj3 from '@/assets/home/proj3.jpg';
import proj4 from '@/assets/home/proj4.jpg';
import stap2 from '@/assets/werkwijze/02-plaatsbezoek.jpg';
import stap3 from '@/assets/werkwijze/03-offerte.jpg';
import stap5 from '@/assets/werkwijze/05-uitvoering.jpg';
import stap7 from '@/assets/werkwijze/07-oplevering.jpg';
import ctaPhoto from '@/assets/home/hero-roof.jpg';
import mKoramic from '@/assets/merken/Koramic.png';
import mVelux from '@/assets/merken/Velux.png';
import mWienerberger from '@/assets/merken/Wienerberger.png';
import mRockpanel from '@/assets/merken/rockpanel.png';

import revMarc from '@/assets/reviews/marc.jpg';
import revEllen from '@/assets/reviews/ellen.jpg';
import revKatrien from '@/assets/reviews/katrien.jpg';
import revMehmet from '@/assets/reviews/mehmet.jpg';
import revSofie from '@/assets/reviews/sofie.jpg';
import revDirk from '@/assets/reviews/dirk.jpg';
import revAna from '@/assets/reviews/ana.jpg';
import revTim from '@/assets/reviews/tim.jpg';
import revNathalie from '@/assets/reviews/nathalie.jpg';
import revFilip from '@/assets/reviews/filip.jpg';
import revInge from '@/assets/reviews/inge.jpg';
import revKarim from '@/assets/reviews/karim.jpg';
import revHilde from '@/assets/reviews/hilde.jpg';

const svcIcon = (d: string) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

const ICONS = {
  dak: svcIcon('<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.8V20h14v-9.2"/><path d="M9.5 20v-5h5v5"/>'),
  gevel: svcIcon('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 9h16M4 15h16M10 3v6M14 9v6M10 15v6"/>'),
  bad: svcIcon('<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M6 19v2M18 19v2"/>'),
  interieur: svcIcon('<path d="M4 20v-6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6"/><path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M4 17h16"/>'),
  construct: svcIcon('<path d="m3 21 9-18 9 18z"/><path d="M8.5 12h7M6 16.5h12"/>'),
  eco: svcIcon('<path d="M12 21c5-2 8-6 8-11V5l-8-2-8 2v5c0 5 3 9 8 11z"/><path d="M12 12v5M12 12c0-2 1.5-3.5 3.5-3.5M12 12c0-2-1.5-3.5-3.5-3.5"/>'),
  ploeg: svcIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  shield: svcIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  planning: svcIcon('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 15 2 2 4-4"/>'),
  papier: svcIcon('<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h4"/>'),
};

const DIENSTEN = [
  { t: 'Dakwerken', img: svcDak, ic: ICONS.dak, href: '/dakwerken',
    d: 'Nieuwe pannen, leien of een plat dak in EPDM. Inclusief isolatie, dakgoten en het opruimen achteraf.' },
  { t: 'Gevelrenovatie', img: svcGevel, ic: ICONS.gevel, href: '/gevel',
    d: 'Crepi, steenstrips, houten bekleding of gevelreiniging. Met buitenisolatie als de gevel toch openligt.' },
  { t: 'Badkamer en wellness', img: svcBad, ic: ICONS.bad, href: '/bad',
    d: 'Van inloopdouche tot volledige badkamer. Sanitair, tegelwerk en vloerverwarming door dezelfde ploeg.' },
  { t: 'Interieurwerken', img: svcInterieur, ic: ICONS.interieur, href: '/interieur',
    d: 'Maatkasten, keukens, gietvloeren en pleisterwerk. Afgewerkt tot in de plinten en de deurlijsten.' },
  { t: 'Totaalrenovatie en nieuwbouw', img: svcConstruct, ic: ICONS.construct, href: '/construct',
    d: 'Ruwbouw, uitbreiding of een woning die volledig op de schop gaat. Wij coördineren alle vakken.' },
  { t: 'Ecologisch bouwen', img: svcEco, ic: ICONS.eco, href: '/ecologisch',
    d: 'Isolatie, ventilatie, warmtepomp en zonnepanelen. We rekenen vooraf uit wat het oplevert.' },
];

const REVIEWS = [
  { name: 'Marc Van den Broeck', role: 'Dakrenovatie · Mechelen', img: revMarc, text: 'Alles verliep netjes zoals afgesproken, geen verrassingen achteraf. Het dak ligt er strak bij. Echt tevreden.' },
  { name: 'Ellen De Smet', role: 'Totaalrenovatie · Leuven', img: revEllen, text: 'We hebben drie aannemers vergeleken. AB Bouw was de enige die alle vragen grondig beantwoordde en ook de volledige papierwinkel voor ons regelde.' },
  { name: 'Katrien Peeters', role: 'Badkamer · Antwerpen', img: revKatrien, text: 'Van begin tot eind dezelfde ploeg, dat voel je aan het resultaat. Alles strak en netjes afgewerkt. Heel content.' },
  { name: 'Mehmet Yıldız', role: 'Nieuwbouw · Bornem', img: revMehmet, text: 'Eerlijk en stipt. We konden altijd terecht met vragen en kregen de sleutel exact op de afgesproken dag. Zeldzaam in deze sector.' },
  { name: 'Sofie Vermeulen', role: 'Gevelrenovatie · Sint-Niklaas', img: revSofie, text: 'De gevel ligt er strak bij, alle buren komen vragen wie het werk gedaan heeft. Aanrader voor wie kwaliteit en stiptheid belangrijk vindt.' },
  { name: 'Dirk Maes', role: 'Plat dak · Antwerpen', img: revDirk, text: 'Ik dacht aan een nieuw dak, maar na hun bezoek bleek herstellen genoeg. Ze hadden me makkelijk meer kunnen aansmeren. Dat noem ik eerlijk werken.' },
  { name: 'Ana Popescu', role: 'Interieur · Mechelen', img: revAna, text: 'Maatkeuken en dressing prachtig uitgevoerd, alles past perfect. En we werden overal goed in meegenomen. Heel content.' },
  { name: 'Tim Verbeeck', role: 'Carport en oprit · Lier', img: revTim, text: 'Carport en oprit klaar op tijd, geen vertraging. Elke vrijdag was de werf opgeruimd, fijn met kleine kinderen in huis.' },
  { name: 'Nathalie Aerts', role: 'Energetische renovatie · Bonheiden', img: revNathalie, text: 'Isolatie, dak en ramen in één keer aangepakt. Veel warmer nu, en zij regelden het hele papierwerk. Echt ontzorgd.' },
  { name: 'Filip Wouters', role: 'Hellend dak · Puurs', img: revFilip, text: 'Dak helemaal vernieuwd, mooi afgewerkt. De werfleider kwam elke ochtend even langs, dat gaf een gerust gevoel.' },
  { name: 'Inge Vermeiren', role: 'Badkamer en toilet · Kontich', img: revInge, text: 'Vier weken stof, en dan een prachtige badkamer. Inloopdouche, zwevend meubel, vloerverwarming. De tegelzetter heeft hier echt zijn handtekening gezet.' },
  { name: 'Karim El Amrani', role: 'Aanbouw · Willebroek', img: revKarim, text: 'Aanbouw netjes opgeleverd, precies zoals we het wilden. Eén aanspreekpunt voor alles, dat maakte het veel makkelijker.' },
  { name: 'Hilde Goossens', role: 'Gevelisolatie · Boom', img: revHilde, text: 'Witte crepi op buitenisolatie. Onze stookkost is bijna gehalveerd deze winter. Net en proper gewerkt, ook bij de buren bedankjes achtergelaten.' },
];

const STAPPEN = [
  { n: '01', t: 'Plaatsbezoek', img: stap2, d: 'We komen langs, meten op en luisteren wat u wil. Kosteloos en zonder verplichting.' },
  { n: '02', t: 'Offerte', img: stap3, d: 'U krijgt een gedetailleerde prijs per post. Elke lijn is uitgesplitst, zodat u ziet waarvoor u betaalt.' },
  { n: '03', t: 'Uitvoering', img: stap5, d: 'Eén werfleider volgt uw project op. U weet wie er komt en wanneer.' },
  { n: '04', t: 'Oplevering', img: stap7, d: 'We lopen samen alles na en werken de laatste punten af. Pas dan is het klaar.' },
];

const TEGELS = [
  { ic: ICONS.ploeg, t: 'Eigen vakmensen', d: 'Geen wisselende onderaannemers: dezelfde mensen van start tot oplevering.' },
  { ic: ICONS.shield, t: '10 jaar garantie', d: 'Op de uitvoering van ons werk, schriftelijk vastgelegd in de offerte.', feat: true },
  { ic: ICONS.planning, t: 'Eén werfleider', d: 'Eén nummer dat u belt. Die persoon kent uw dossier en volgt de planning op.' },
  { ic: ICONS.papier, t: 'Papierwerk geregeld', d: 'Premies, attesten en EPB regelen wij mee, zodat u niets hoeft na te zoeken.' },
];

const FAQ = [
  { q: 'Werken jullie in heel Vlaanderen?', a: 'Ja. We werken in heel Vlaanderen en in Brussel. Voor een plaatsbezoek maken we een afspraak die past, ook in de vooravond.' },
  { q: 'Wat kost een plaatsbezoek en een offerte?', a: 'Niets. We komen langs, meten op en bezorgen u een gedetailleerde offerte. Daar zijn geen kosten aan verbonden en u bent tot niets verplicht.' },
  { q: 'Kan ik één ding laten doen, of moet het een volledige renovatie zijn?', a: 'Beide kan. Alleen een dak of alleen een badkamer is prima. Loopt uw project over meerdere vakken, dan coördineren wij die onderling.' },
  { q: 'Hoe zit het met premies?', a: 'We bekijken bij het plaatsbezoek welke premies op uw situatie van toepassing zijn en leveren de attesten aan die u nodig heeft. De premievoorwaarden wijzigen geregeld, dus we toetsen ze per dossier opnieuw.' },
  { q: 'Hoe lang op voorhand moet ik boeken?', a: 'Dat hangt af van het vak en het seizoen. Bij het plaatsbezoek zeggen we meteen welke startperiode realistisch is, en die zetten we in de offerte.' },
];

const HTML = (i: Record<string, string>) => {
  const hero = `
<section class="rp-hero">
  <div class="rp-wrap rp-hero__top">
    <div class="rp-hero__grid">
      <div class="rp-hero__main">
        <h1 class="rp-hero__display">Bouw en<span class="rp-hero__l2">renovatie</span></h1>
      </div>
      <div class="rp-hero__aside">
        <p class="rp-hero__lede">AB Bouw Groep verbouwt woningen in heel Vlaanderen. Dak, gevel, badkamer, interieur of alles samen: zes vakken die wij zelf uitvoeren en op elkaar afstemmen.</p>
      </div>
    </div>
  </div>
  <div class="rp-hero__photo">
    <img src="${i.heroPhoto}" alt="Vernieuwd hellend dak met dakkapellen op een woning in Vlaanderen" width="1600" height="620" fetchpriority="high" decoding="async"/>
  </div>
</section>

<div class="rp-band">
  <div class="rp-wrap rp-band__row">
    ${['Dakwerken', 'Gevelrenovatie', 'Badkamers', 'Interieurwerken', 'Totaalrenovatie', 'Nieuwbouw']
      .map((t, n) => `${n ? '<span class="rp-band__sep" aria-hidden="true">&#10038;</span>' : ''}<span>${t}</span>`).join('')}
  </div>
</div>`;

  const about = `
<section class="rp-section" id="over">
  <div class="rp-wrap rp-about__grid">
    <div class="rp-about__media">
      <div class="rp-about__circle">
        <img src="${i.aboutPhoto}" alt="Gerenoveerde woning van AB Bouw Groep" width="560" height="560" loading="lazy" decoding="async"/>
      </div>
      <div class="rp-about__inset" aria-hidden="true">
        <img src="${i.leiTextuur}" alt="" width="92" height="92" loading="lazy" decoding="async"/>
      </div>
      <div class="rp-about__chip">
        <span aria-hidden="true">${ic.google}</span>
        <span>
          <span class="rp-about__chip-t">Klanten tevreden</span>
          <span class="rp-about__chip-s">${ic.star(13)} 4,9 op Google</span>
        </span>
      </div>
      <div class="rp-about__badge"><b>16</b><span>jaar<br/>ervaring</span></div>
    </div>
    <div>
      <span class="rp-eyebrow">${ic.mark} Over AB Bouw Groep</span>
      <h2 class="rp-about__title">Zes vakken<span class="rp-dim">onder één dak</span></h2>
      <p class="rp-about__text">Wij zijn een Vlaams bouw- en renovatiebedrijf met eigen ploegen voor dakwerken, gevel, badkamer, interieur, ruwbouw en energiewerken. Omdat die vakken bij ons onder hetzelfde dak zitten, moet u niet zelf tussen aannemers bemiddelen wanneer het ene werk op het andere wacht.</p>
      <p class="rp-about__text">U krijgt een gedetailleerde offerte waarin elke post apart staat, en tijdens de werken één werfleider die uw dossier kent.</p>
      <div class="rp-about__stats">
        <div><div class="rp-stat__n">16</div><div class="rp-stat__l">jaar ervaring in de bouw</div></div>
        <div><div class="rp-stat__n">120+</div><div class="rp-stat__l">woningen gerenoveerd</div></div>
        <div><div class="rp-stat__n">10</div><div class="rp-stat__l">jaar garantie op ons werk</div></div>
      </div>
      <div class="rp-about__foot">
        <a class="rp-btn rp-btn--primary" href="/over">Meer over ons</a>
        <span class="rp-about__call">
          <span class="rp-about__call-ic" aria-hidden="true">${ic.phone(26)}</span>
          <span>
            <span class="rp-about__call-l">Rechtstreeks bellen</span><br/>
            <a class="rp-about__call-n" href="${CONTACT.phone.href}">${CONTACT.phone.display}</a>
          </span>
        </span>
      </div>
    </div>
  </div>
</section>`;

  const diensten = `
<section class="rp-section rp-section--soft" id="diensten">
  <div class="rp-wrap">
    <div class="rp-head">
      <div>
        <span class="rp-eyebrow">${ic.mark} Onze diensten</span>
        <h2 class="rp-head__title">Wat wij uitvoeren<span class="rp-dim">aan uw woning</span></h2>
      </div>
      <a class="rp-btn rp-btn--primary" href="/diensten">Alle diensten</a>
    </div>
    <div class="rp-carousel" data-car="svc" style="--rp-arrow-top:116px">
      <button class="rp-arrow rp-arrow--zweef rp-arrow--prev" type="button" data-car-prev="svc" aria-label="Vorige diensten">${ic.left}</button>
      <button class="rp-arrow rp-arrow--zweef rp-arrow--next" type="button" data-car-next="svc" aria-label="Volgende diensten">${ic.right}</button>
      <div class="rp-track" data-car-track tabindex="0" role="region" aria-label="Diensten, horizontaal schuifbaar">
        ${DIENSTEN.map((d, n) => `
        <article class="rp-svc${n === 1 ? ' rp-svc--feat' : ''}">
          <div class="rp-svc__img">
            <span class="rp-svc__clip"><img src="${i['svc' + n]}" alt="${d.t} door AB Bouw Groep" width="420" height="232" loading="lazy" decoding="async"/></span>
            <span class="rp-svc__ic" aria-hidden="true">${d.ic}</span>
          </div>
          <div class="rp-svc__body">
            <h3 class="rp-svc__title">${d.t}</h3>
            <p class="rp-svc__text">${d.d}</p>
            <div class="rp-svc__foot">
              <a class="rp-more${n === 1 ? ' rp-more--accent' : ''}" href="${d.href}">Meer info ${ic.arrowUpRight()}</a>
            </div>
          </div>
        </article>`).join('')}
      </div>
      <div class="rp-dots" data-car-dots></div>
    </div>
  </div>
</section>`;

  const waarom = `
<section class="rp-section">
  <div class="rp-wrap rp-why__grid">
    <div>
      <span class="rp-eyebrow">${ic.mark} Waarom AB Bouw Groep</span>
      <h2 class="rp-why__title">Weten waar u<span class="rp-dim">aan toe bent</span></h2>
      <p class="rp-why__p">De meeste ergernis in een verbouwing komt niet van het werk zelf, maar van niet weten wanneer er iemand komt en wat het uiteindelijk kost. Daar zetten wij onze afspraken tegenover: een offerte per post uitgesplitst, een planning die u vooraf krijgt, en één werfleider die u kan bellen.</p>
      <p class="rp-why__p">Loopt er iets anders dan gepland, dan hoort u dat van ons voor u het zelf merkt.</p>
      <div class="rp-why__cta"><a class="rp-btn rp-btn--primary" href="/werkwijze">Zo werken wij</a></div>
    </div>
    <div class="rp-why__tiles">
      ${TEGELS.map((t) => `
      <div class="rp-tile${t.feat ? ' rp-tile--feat' : ''}">
        <div class="rp-tile__ic" aria-hidden="true">${t.ic}</div>
        <h3 class="rp-tile__t">${t.t}</h3>
        <p class="rp-tile__d">${t.d}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;

  const realisaties = `
<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head">
      <div>
        <span class="rp-eyebrow">${ic.mark} Realisaties</span>
        <h2 class="rp-head__title">Werk dat wij<span class="rp-dim">opgeleverd hebben</span></h2>
      </div>
      <a class="rp-btn rp-btn--primary" href="/realisaties">Alle realisaties</a>
    </div>
    <div class="rp-proj__grid">
      <a class="rp-proj__item" href="/realisaties">
        <img src="${i.proj1}" alt="Gerenoveerde gevel van een woning" width="380" height="430" loading="lazy" decoding="async"/>
      </a>
      <div class="rp-proj__item rp-proj__item--main">
        <img src="${i.proj3}" alt="Woning met houten gevelbekleding na totaalrenovatie" width="700" height="470" loading="lazy" decoding="async"/>
        <div class="rp-proj__card">
          <a class="rp-proj__arrow" href="/realisaties" aria-label="Naar alle realisaties">${ic.arrowUpRight(18)}</a>
          <div class="rp-proj__eyebrow">Totaalrenovatie</div>
          <h3 class="rp-proj__t">Van verouderde woning tot afgewerkt geheel, in één traject</h3>
        </div>
      </div>
      <a class="rp-proj__item" href="/realisaties">
        <img src="${i.proj4}" alt="Woning met nieuwe aanbouw en dakwerken" width="380" height="430" loading="lazy" decoding="async"/>
      </a>
    </div>
  </div>
</section>`;

  const werkwijze = `
<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-head">
      <div>
        <span class="rp-eyebrow">${ic.mark} Werkwijze</span>
        <h2 class="rp-head__title">Van eerste telefoon<span class="rp-dim">tot oplevering</span></h2>
      </div>
      <a class="rp-btn rp-btn--primary" href="/werkwijze">Volledige werkwijze</a>
    </div>
    <div class="rp-steps">
      ${STAPPEN.map((s, n) => `
      <article class="rp-step">
        <div class="rp-step__img"><img src="${i['stap' + n]}" alt="${s.t}" width="300" height="168" loading="lazy" decoding="async"/></div>
        <div class="rp-step__body">
          <div class="rp-step__n">${s.n}</div>
          <h3 class="rp-step__t">${s.t}</h3>
          <p class="rp-step__d">${s.d}</p>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;

  const reviews = `
<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head">
      <div>
        <span class="rp-eyebrow">${ic.mark} Beoordelingen</span>
        <h2 class="rp-head__title">Wat klanten zeggen<span class="rp-dim">over hun verbouwing</span></h2>
      </div>
      <a class="rp-btn rp-btn--primary" href="/realisaties">Bekijk realisaties</a>
    </div>
    <div class="rp-carousel" data-car="rev" style="--rp-arrow-top:140px">
      <button class="rp-arrow rp-arrow--zweef rp-arrow--prev" type="button" data-car-prev="rev" aria-label="Vorige beoordelingen">${ic.left}</button>
      <button class="rp-arrow rp-arrow--zweef rp-arrow--next" type="button" data-car-next="rev" aria-label="Volgende beoordelingen">${ic.right}</button>
      <div class="rp-track" data-car-track tabindex="0" role="region" aria-label="Beoordelingen, horizontaal schuifbaar">
        ${REVIEWS.map((r, n) => `
        <article class="rp-rev">
          <div class="rp-rev__stars" aria-label="5 van 5 sterren">${ic.star().repeat(5)}</div>
          <p class="rp-rev__text">${r.text}</p>
          <div class="rp-rev__foot">
            <img class="rp-rev__av" src="${i['rev' + n]}" alt="" width="46" height="46" loading="lazy" decoding="async"/>
            <span class="rp-rev__who">
              <span class="rp-rev__name">${r.name}</span><br/>
              <span class="rp-rev__role">${r.role}</span>
            </span>
            <span class="rp-rev__g" aria-label="Google-beoordeling">${ic.google}</span>
          </div>
        </article>`).join('')}
      </div>
      <div class="rp-dots" data-car-dots></div>
    </div>
  </div>
</section>`;

  const merken = `
<section class="rp-section" style="padding-block:var(--rp-section-y-sm)">
  <div class="rp-wrap">
    <p style="text-align:center;font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--rp-mute);margin-bottom:30px">Materialen waarmee wij werken</p>
    <div class="rp-brands">
      <img src="${i.mWienerberger}" alt="Wienerberger" height="40" loading="lazy" decoding="async"/>
      <img src="${i.mKoramic}" alt="Koramic" height="40" loading="lazy" decoding="async"/>
      <img src="${i.mVelux}" alt="Velux" height="40" loading="lazy" decoding="async"/>
      <img src="${i.mRockpanel}" alt="Rockpanel" height="40" loading="lazy" decoding="async"/>
    </div>
  </div>
</section>`;

  const faq = `
<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="justify-content:center;text-align:center;flex-direction:column;align-items:center">
      <div>
        <span class="rp-eyebrow">${ic.mark} Veelgestelde vragen</span>
        <h2 class="rp-head__title">Wat klanten ons<span class="rp-dim">het vaakst vragen</span></h2>
      </div>
    </div>
    <div class="rp-faq">
      ${FAQ.map((f, n) => `
      <details class="rp-faq__item"${n === 0 ? ' open' : ''}>
        <summary class="rp-faq__q">${f.q}${ic.plus}</summary>
        <div class="rp-faq__a">${f.a}</div>
      </details>`).join('')}
    </div>
  </div>
</section>`;

  const posts = BLOGS.slice(0, 6);
  const blog = `
<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-head">
      <div>
        <span class="rp-eyebrow">${ic.mark} Blog en nieuws</span>
        <h2 class="rp-head__title">Uit de praktijk<span class="rp-dim">uitleg en achtergrond</span></h2>
      </div>
      <a class="rp-btn rp-btn--primary" href="/blog">Alle artikels</a>
    </div>
    <div class="rp-carousel" data-car="blog" style="--rp-arrow-top:170px">
      <button class="rp-arrow rp-arrow--zweef rp-arrow--prev" type="button" data-car-prev="blog" aria-label="Vorige artikels">${ic.left}</button>
      <button class="rp-arrow rp-arrow--zweef rp-arrow--next" type="button" data-car-next="blog" aria-label="Volgende artikels">${ic.right}</button>
      <div class="rp-track rp-track--2" data-car-track tabindex="0" role="region" aria-label="Artikels, horizontaal schuifbaar">
      ${posts.map((p, n) => `
      <a class="rp-blog" href="/blog/${p.slug}">
        <div class="rp-blog__img">
          <img src="${i['blog' + n]}" alt="${p.title}" width="600" height="340" loading="lazy" decoding="async"/>
        </div>
        <div class="rp-blog__card">
          <div class="rp-blog__meta">
            <span>${ic.cal} ${p.date}</span>
            <span>${ic.user} AB Bouw Groep</span>
          </div>
          <h3 class="rp-blog__t">${p.title}</h3>
          <div class="rp-blog__foot"><span class="rp-btn ${n === 1 ? 'rp-btn--primary' : 'rp-btn--ghost'}">Lees het artikel ${ic.arrowUpRight()}</span></div>
        </div>
      </a>`).join('')}
      </div>
      <div class="rp-dots" data-car-dots></div>
    </div>
  </div>
</section>`;

  const cta = `
<section class="rp-cta">
  <div class="rp-wrap">
    <div class="rp-cta__box">
      <div class="rp-cta__bg" aria-hidden="true">
        <img src="${i.ctaPhoto}" alt="" width="1200" height="420" loading="lazy" decoding="async"/>
        <span class="rp-cta__veil"></span>
      </div>
      <div class="rp-cta__inner">
        <h2 class="rp-cta__t">Plannen voor uw woning?<br/>Laat uw nummer achter</h2>
        <p class="rp-cta__p">Wij bellen u terug om een plaatsbezoek in te plannen. Dat bezoek en de offerte erna zijn kosteloos.</p>
        <form class="rp-cta__form" data-cta-form novalidate>
          <label class="rp-sr" for="rp-cta-phone">Uw telefoonnummer</label>
          <input class="rp-cta__input" id="rp-cta-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel"
                 placeholder="Uw telefoonnummer" required minlength="8"/>
          <button class="rp-btn rp-btn--primary" type="submit" data-cta-btn>Bel mij terug</button>
        </form>
        <p class="rp-cta__note" data-cta-note>Of bel zelf: <a href="${CONTACT.phone.href}" style="color:#fff;font-weight:700">${CONTACT.phone.display}</a></p>
      </div>
    </div>
  </div>
</section>`;

  return `<div class="rp">${rpNav('/')}${hero}${about}${diensten}${waarom}${realisaties}${werkwijze}${reviews}${merken}${faq}${blog}${cta}${rpFooter()}</div>`;
};

export default function Home() {
  useEffect(() => {
    document.title = 'AB Bouw Groep — bouw en renovatie in heel Vlaanderen';
    const opruimers: Array<() => void> = [];

    const opruimersMenu = wireMobielMenu();
    opruimers.push(opruimersMenu);

    /* ── carousels: dots + pijlen, gesynchroniseerd met de echte scroll ── */
    document.querySelectorAll<HTMLElement>('[data-car]').forEach((car) => {
      const naam = car.dataset.car || '';
      const track = car.querySelector<HTMLElement>('[data-car-track]');
      const dots = car.querySelector<HTMLElement>('[data-car-dots]');
      if (!track) return;
      const items = Array.from(track.children) as HTMLElement[];
      if (!items.length) return;

      const perView = () => {
        const b = track.getBoundingClientRect().width;
        const w = items[0].getBoundingClientRect().width;
        return Math.max(1, Math.round(b / (w + 26)));
      };
      const stap = () => items[0].getBoundingClientRect().width + 26;
      // paginagewijs (per zichtbare groep), niet per kaart: anders krijg je 11 stipjes
      const paginaBreedte = () => stap() * perView();
      const paginas = () => Math.max(1, Math.ceil(items.length / perView()));

      const bouwDots = () => {
        if (!dots) return;
        dots.innerHTML = '';
        const n = paginas();
        if (n < 2) return;
        for (let p = 0; p < n; p++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'rp-dot';
          b.setAttribute('aria-label', `Ga naar groep ${p + 1} van ${n}`);
          b.addEventListener('click', () => {
            track.scrollTo({ left: p * paginaBreedte(), behavior: 'smooth' });
          });
          dots.appendChild(b);
        }
      };
      bouwDots();

      const prev = document.querySelector<HTMLButtonElement>(`[data-car-prev="${naam}"]`);
      const next = document.querySelector<HTMLButtonElement>(`[data-car-next="${naam}"]`);
      const onPrev = () => track.scrollBy({ left: -paginaBreedte(), behavior: 'smooth' });
      const onNext = () => track.scrollBy({ left: paginaBreedte(), behavior: 'smooth' });
      prev?.addEventListener('click', onPrev);
      next?.addEventListener('click', onNext);

      const sync = () => {
        const idx = Math.round(track.scrollLeft / paginaBreedte());
        dots?.querySelectorAll('.rp-dot').forEach((d, n) => {
          const actief = n === idx;
          d.classList.toggle('is-active', actief);
          d.setAttribute('aria-current', actief ? 'true' : 'false');
        });
        const eind = track.scrollWidth - track.clientWidth - 2;
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= eind;
      };
      sync();
      track.addEventListener('scroll', sync, { passive: true });
      const onResize = () => { bouwDots(); sync(); };
      window.addEventListener('resize', onResize);
      opruimers.push(() => {
        track.removeEventListener('scroll', sync);
        window.removeEventListener('resize', onResize);
        prev?.removeEventListener('click', onPrev);
        next?.removeEventListener('click', onNext);
      });
    });

    /* ── terugbel-formulier ──────────────────────────────────────────── */
    const form = document.querySelector<HTMLFormElement>('[data-cta-form]');
    const note = document.querySelector<HTMLElement>('[data-cta-note]');
    const btn = document.querySelector<HTMLButtonElement>('[data-cta-btn]');
    const input = form?.querySelector<HTMLInputElement>('input[name="phone"]');
    const onFocus = () => trackFormStart('home-cta');
    input?.addEventListener('focus', onFocus, { once: true });

    const onSubmit = async (e: Event) => {
      e.preventDefault();
      const tel = (input?.value || '').trim();
      if (tel.replace(/\D/g, '').length < 8) {
        if (note) { note.textContent = 'Vul een geldig telefoonnummer in, dan bellen wij u terug.'; note.style.color = '#ffb4b4'; }
        input?.focus();
        return;
      }
      if (btn) { btn.disabled = true; btn.textContent = 'Versturen…'; }
      const digits = tel.replace(/\D/g, '');
      const result = await submitLead({
        source: 'contact_form',
        page_path: window.location.pathname,
        phone: tel,
        // telefoon-only lead: zelfde synthetische e-mail als het hero-formulier,
        // zodat de lead nooit op een ontbrekend e-mailveld blijft hangen
        email: `lead-${digits}@abgroep.be`,
        type_werk: 'nog_te_bepalen',
        aanvullende_info: 'Terugbelverzoek via CTA-band homepage — dienst nog onbekend',
        bron_lead: 'website:home:cta-band',
      });
      if (result.ok) {
        form?.remove();
        if (note) {
          note.className = 'rp-cta__ok';
          note.textContent = 'Bedankt. Wij bellen u zo snel mogelijk terug.';
        }
      } else {
        if (btn) { btn.disabled = false; btn.textContent = 'Bel mij terug'; }
        if (note) {
          note.innerHTML = `Er ging iets mis. Bel ons gerust op <a href="${CONTACT.phone.href}" style="color:#fff;font-weight:700">${CONTACT.phone.display}</a>.`;
          note.style.color = '#ffb4b4';
        }
      }
    };
    form?.addEventListener('submit', onSubmit);
    opruimers.push(() => {
      form?.removeEventListener('submit', onSubmit);
      input?.removeEventListener('focus', onFocus);
    });

    return () => opruimers.forEach((f) => f());
  }, []);

  const beelden: Record<string, string> = {
    heroPhoto, aboutPhoto, ctaPhoto, svcDak, dakTextuur, leiTextuur,
    proj1, proj3, proj4,
    mKoramic, mVelux, mWienerberger, mRockpanel,
  };
  DIENSTEN.forEach((d, n) => { beelden['svc' + n] = d.img; });
  STAPPEN.forEach((s, n) => { beelden['stap' + n] = s.img; });
  REVIEWS.forEach((r, n) => { beelden['rev' + n] = r.img; });
  BLOGS.slice(0, 6).forEach((p, n) => { beelden['blog' + n] = p.img; });

  return <div dangerouslySetInnerHTML={{ __html: HTML(beelden) }} />;
}
