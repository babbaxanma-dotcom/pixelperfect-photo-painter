import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

import svcConstruct from '@/assets/home/svc-construct-nieuw.jpg';
import svcEco from '@/assets/eco/achterkant-isolatie.jpg';
import svcInterieur from '@/assets/home/svc-interieur-nieuw.jpg';
import svcDak from '@/assets/lp-diensten/dak-na.jpg';
import svcBad from '@/assets/lp-diensten/realisaties/badkamer-nieuw.jpg';
import svcGevel from '@/assets/gevel/uitbreiding-gevel.jpg';

const vink = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

/* 4 okt 2026: alle tekst op deze pagina is de tekst die Mohammed aanleverde,
   letterlijk, alleen omgezet naar de u-vorm van de rest van de site (zijn
   keuze). Hij koos ook bewust "letterlijk" voor de punten die Bardh nog niet
   bevestigde (eigen ploegen, warmtepompen, premiebegeleiding, startdatum,
   garantie). */
const DIENSTEN = [
  {
    n: '01', t: 'Totaalrenovatie en nieuwbouw', kort: 'totaalrenovatie', href: '/construct', img: svcConstruct,
    lede: 'Een ingrijpend bouwproject vraagt om strakke regie en overzicht. Wij nemen de volledige werfcoördinatie in handen, van de eerste grondwerken tot de schilderklare oplevering. Uw voordeel? Eén centrale projectleider die de voortgang bewaakt, overlegt met de architect en zorgt dat de ruwbouw naadloos overgaat in de afwerking.',
    punten: [
      'Volledige renovaties en sleutel-op-de-deur nieuwbouw',
      'Aanbouwen en volume-uitbreidingen',
      'Eén vast aanspreekpunt voor het hele traject',
    ],
  },
  {
    n: '02', t: 'Ecologisch en energetisch', kort: 'energetisch renoveren', href: '/ecologisch', img: svcEco,
    lede: 'De normen voor energiezuinig wonen worden steeds strenger. Wij helpen u om uw EPC-label drastisch te verbeteren met toekomstgerichte ingrepen. We kijken naar het totaalplaatje van uw woning en adviseren welke oplossingen het hoogste rendement opleveren, terwijl we u tegelijkertijd door het doolhof van de Vlaamse premies loodsen.',
    punten: [
      'Installatie van warmtepompen en efficiënte technieken',
      'Hoogwaardige isolatieschil (dak, vloer en wand)',
      'Actieve begeleiding bij het aanvragen van de Mijn VerbouwPremie',
    ],
  },
  {
    n: '03', t: 'Dakwerken', kort: 'dakwerken', href: '/dakwerken', img: svcDak,
    lede: 'Het dak is de belangrijkste beschermlaag van uw pand. Wij bouwen, vernieuwen en isoleren dakkappen volgens de strengste normen voor waterdichtheid en windbestendigheid. We werken uitsluitend met robuuste, weersbestendige materialen voor een resultaat dat decennia meegaat.',
    punten: [
      'Hellende daken met kwalitatieve pannen en zinkwerk',
      'Platte daken voorzien van naadloze, duurzame EPDM',
      'Plaatsing van dakramen en dakkapellen',
    ],
  },
  {
    n: '04', t: 'Gevelrenovatie', kort: 'gevelrenovatie', href: '/gevel', img: svcGevel,
    lede: 'Een nieuwe gevel geeft uw woning niet alleen visueel een complete upgrade, het is hét moment om de buitenschil thermisch te optimaliseren. Wij combineren hoogwaardige esthetische afwerkingen direct met de juiste buitengevelisolatie, zodat uw woning zowel qua look als energieprestatie weer helemaal bij de tijd is.',
    punten: [
      'Afwerking in moderne crepi of traditionele steenstrips',
      'Houten en composiet gevelbekledingen',
      'Geïntegreerde isolatiesystemen (ETICS)',
    ],
  },
  {
    n: '05', t: 'Badkamer en wellness', kort: 'badkamers', href: '/bad', img: svcBad,
    lede: 'Uw badkamer moet een plek van comfort en rust zijn. Wij verzorgen de complete transformatie van de ruimte. Omdat onze eigen ploegen zowel het breekwerk, de leidingen, als het precieze tegel- en kitwerk voor hun rekening nemen, werken we efficiënt door. Zo zit u geen dag langer in het stof dan nodig.',
    punten: [
      'Complete renovaties van afbraak tot afwerking',
      'Plaatsing van inloopdouches en grootformaat tegels',
      'Installatie van hoogwaardig sanitair en vloerverwarming',
    ],
  },
  {
    n: '06', t: 'Interieurwerken', kort: 'interieurwerken', href: '/interieur', img: svcInterieur,
    lede: 'De perfecte afwerking zit in de details. Onze interieurbouwers en eigen schrijnwerkers tillen de binnenkant van uw woning naar een hoger niveau. Met millimeterprecisie zorgen we voor een feilloze afwerking die perfect integreert met de rest van het huis.',
    punten: [
      'Vakkundige Gyproc-werken, scheidingswanden en (akoestische) plafonds',
      'Maatwerk door eigen schrijnwerkers: inbouwkasten en binnendeuren',
      'Plaatsing van kwalitatieve parket- en houten vloeren',
    ],
  },
];

const BELOFTE = [
  { t: 'Gedetailleerde afspraken', d: 'Een heldere offerte en een vastgelegde startdatum. Geen verrassingen.' },
  { t: 'Respect voor uw woning', d: 'Een gestructureerde werf die aan het einde van de week netjes wordt achtergelaten.' },
  { t: 'Volledige dekking', d: '10 jaar wettelijke garantie op de uitgevoerde werken.' },
];

const HTML = () => `<div class="rp">
${rpNav('/diensten')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Diensten</span></nav>
    <h1 class="rp-phero__t">Onze diensten</h1>
    <p class="rp-phero__sub">Eén betrouwbare partner voor al uw bouw- en renovatieplannen.</p>
    <p class="rp-phero__lede">Bij AB Bouw Groep brengen we alle bouwspecialisaties samen onder één dak. Of u ons nu inschakelt voor een gerichte ingreep, of voor een project waarbij de hele woning op de schop gaat: wij hebben de juiste vakmensen in huis. Omdat onze afdelingen intern met elkaar communiceren, garanderen we een strakke, doorlopende planning zonder stiltes op de werf.</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    ${DIENSTEN.map((d, n) => `
    <div class="rp-split${n % 2 ? ' rp-split--om' : ''}">
      <div class="rp-split__media">
        <img src="${d.img}" alt="${d.t} door AB Bouw Groep" width="560" height="420" loading="lazy" decoding="async"/>
      </div>
      <div>
        <span class="rp-split__n">${d.n}</span>
        <h2 class="rp-split__t">${d.t}</h2>
        <p class="rp-split__lede">${d.lede}</p>
        <ul class="rp-lijst">
          ${d.punten.map((p) => `<li>${vink}<span>${p}</span></li>`).join('')}
        </ul>
        <div class="rp-split__cta"><a class="rp-btn rp-btn--primary" href="${d.href}">Meer over ${d.kort} ${ic.arrowUpRight()}</a></div>
      </div>
    </div>`).join('')}
  </div>
</section>

<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head" style="flex-direction:column;align-items:center;text-align:center">
      <div style="max-width:760px">
        <h2 class="rp-head__title">Onze belofte bij elk project</h2>
        <p class="rp-split__lede">Hoe groot of klein de opdracht ook is, wij werken altijd volgens dezelfde vaste principes:</p>
      </div>
    </div>
    <div class="rp-why__tiles rp-tiles-3">
      ${BELOFTE.map((t) => `
      <div class="rp-tile">
        <div class="rp-tile__ic" aria-hidden="true">${vink}</div>
        <h3 class="rp-tile__t">${t.t}</h3>
        <p class="rp-tile__d">${t.d}</p>
      </div>`).join('')}
    </div>
    <div class="rp-slot">
      <a class="rp-btn rp-btn--primary" href="/contact">Bespreek uw project met ons ${ic.arrowUpRight()}</a>
      <p class="rp-slot__contact"><a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a><span aria-hidden="true">&middot;</span><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Diensten() {
  useEffect(() => {
    document.title = 'Onze diensten · AB Bouw Groep';
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
