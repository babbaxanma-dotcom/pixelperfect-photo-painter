import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

import svcConstruct from '@/assets/home/svc-construct.jpg';
import svcEco from '@/assets/home/svc-eco.jpg';
import svcInterieur from '@/assets/home/svc-interieur.jpg';
import svcDak from '@/assets/dak/lp-veluxg-3.jpg';
import svcBad from '@/assets/home/svc-bad.jpg';
import svcGevel from '@/assets/home/svc-gevel.jpg';

const vink = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

const DIENSTEN = [
  {
    n: '01', t: 'Totaalrenovatie en nieuwbouw', kort: 'totaalrenovatie', href: '/construct', img: svcConstruct,
    lede: 'Onze grootste afdeling. Een woning die volledig op de schop gaat, een aanbouw, of bouwen van nul. Wij coördineren alle vakken en houden één planning bij, zodat het ene werk niet op het andere staat te wachten.',
    punten: [
      'Sleutel-op-de-deur woningen vanaf 180 m²',
      'Totaalrenovatie tot op de ruwe muren',
      'Aanbouw, dakopbouw en kelderuitbreiding',
      'Samenwerking met uw architect of die van ons',
      'Vergunning, EPB-verslag en oplevering inbegrepen',
    ],
  },
  {
    n: '02', t: 'Ecologisch en energetisch', kort: 'energetisch renoveren', href: '/ecologisch', img: svcEco,
    lede: 'Isolatie, warmtepomp, ventilatie en zonnepanelen in één dossier. We rekenen vooraf uit wat elke ingreep u aan verbruik scheelt, zodat u kunt kiezen wat u wel en niet doet.',
    punten: [
      'Lucht/water-warmtepompen (Daikin, Mitsubishi, Vaillant)',
      'Dakisolatie in PIR, PUR of cellulose tot K30',
      'Spouwmuurisolatie en na-isolatie van buitengevels',
      'Houtskeletbouw op aanvraag',
      'Wij checken uw premierecht en dienen het dossier mee in',
    ],
  },
  {
    n: '03', t: 'Interieurwerken', kort: 'interieurwerken', href: '/interieur', img: svcInterieur,
    lede: 'De afwerking waar u dagelijks tegenaan kijkt: wanden, plafonds, vloeren en maatwerk. Onze eigen schrijnwerker maakt de kasten, dus wat getekend is, past ook.',
    punten: [
      'Gyproc wanden, ook akoestisch geïsoleerd',
      'Verlaagde plafonds met inbouwspots en ledstrips',
      'Parket: massief, meerlaags, visgraat of kuierplank',
      'Maatwerk: dressings, inbouwkasten, tv-meubels',
      'Binnendeuren stomp of opdek, door eigen schrijnwerker',
    ],
  },
  {
    n: '04', t: 'Dakwerken', kort: 'dakwerken', href: '/dakwerken', img: svcDak,
    lede: 'Van een lek dat hersteld moet worden tot een dak dat volledig vernieuwd wordt. Bij een plaatsbezoek zeggen we eerlijk of herstellen volstaat, ook als dat ons minder oplevert.',
    punten: [
      'Pannendaken volledig vernieuwen',
      'Platte daken in EPDM uit één stuk, dus zonder lasnaden',
      'Dakisolatie tot onder K30',
      'Zinkwerk: dakgoten, mastgoten, kilgoten en slabben',
      'Dakvensters Velux en Fakro, dakkapellen op maat',
    ],
  },
  {
    n: '05', t: 'Badkamer en wellness', kort: 'badkamers', href: '/bad', img: svcBad,
    lede: 'Eén ploeg voor sanitair, tegelwerk en vloerverwarming. U ziet het ontwerp in 3D voor er iets besteld wordt, zodat u niet achteraf ontdekt dat het meubel net te breed is.',
    punten: [
      '3D-ontwerp ter goedkeuring vóór de bestelling',
      'Vloerverwarming standaard inbegrepen',
      'Tegels in keramiek, natuursteen of microcement',
      'Inloopdouches, vrijstaande baden, regendouches',
      'Sanitair van Villeroy & Boch, Hansgrohe en Geberit',
    ],
  },
  {
    n: '06', t: 'Gevelrenovatie', kort: 'gevelrenovatie', href: '/gevel', img: svcGevel,
    lede: 'Een nieuwe gevel is het moment om er buitenisolatie achter te zetten: de stelling staat er toch. Dat scheelt later een tweede werf.',
    punten: [
      'Crepi in mineraal, silicaat of siliconen',
      'Steenstrips in keramiek of klei',
      'Houten gevels in lariks, ceder of thermohout',
      'Composietplaten zoals Trespa, Rockpanel en Eternit',
      'Buitenisolatie volgens ETICS',
    ],
  },
];

const INBEGREPEN = [
  { t: 'Plaatsbezoek en offerte', d: 'Kosteloos, en de offerte splitst elke post apart uit.' },
  { t: 'Eén werfleider', d: 'Eén nummer dat u belt, die uw dossier kent.' },
  { t: 'Werf opgeruimd', d: 'Elke vrijdag opgeruimd achtergelaten, afvoer inbegrepen.' },
  { t: '10 jaar garantie', d: 'Op de uitvoering, schriftelijk vastgelegd in de offerte.' },
];

const HTML = () => `<div class="rp">
${rpNav('/diensten')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Diensten</span></nav>
    <span class="rp-eyebrow">${ic.mark} Onze diensten</span>
    <h1 class="rp-phero__t">Van ruwbouw<span class="rp-dim">tot afwerking</span></h1>
    <p class="rp-phero__lede">Zes afdelingen met eigen vakmensen. U kunt er één inschakelen, of ze allemaal: loopt uw project over meerdere vakken, dan stemmen wij die onderling af.</p>
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
      <div>
        <span class="rp-eyebrow">${ic.mark} Bij elke opdracht</span>
        <h2 class="rp-head__title">Wat er altijd<span class="rp-dim">inbegrepen zit</span></h2>
      </div>
    </div>
    <div class="rp-why__tiles rp-tiles-4">
      ${INBEGREPEN.map((t) => `
      <div class="rp-tile">
        <div class="rp-tile__ic" aria-hidden="true">${vink}</div>
        <h3 class="rp-tile__t">${t.t}</h3>
        <p class="rp-tile__d">${t.d}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="rp-cta">
  <div class="rp-wrap">
    <div class="rp-cta__box" style="min-height:270px">
      <div class="rp-cta__inner">
        <h2 class="rp-cta__t">Weten wat uw plan kost?</h2>
        <p class="rp-cta__p">We komen langs, meten op en bezorgen u een offerte waarin elke post apart staat. Kosteloos en zonder verplichting.</p>
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

export default function Diensten() {
  useEffect(() => {
    document.title = 'Onze diensten — AB Bouw Groep';
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
