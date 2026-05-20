import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from '../_shell';

// Gevel + realisaties foto's
import heroBg from '@/assets/realisaties-new/gevel-hero.jpg';        // NEW FLUX — premium gevel hero
import imgCrepiWit from '@/assets/gevel/witte-crepi.jpg';
import imgCrepiGrijs from '@/assets/gevel/grijze-crepi.jpg';
import imgSteenstrips from '@/assets/gevel/steenstrips.jpg';
import imgSierpleister from '@/assets/gevel/sierpleister.jpg';
import imgGevelCrepi from '@/assets/realisaties/gevel-grijze-crepi.jpg';
import imgGevelStrips from '@/assets/realisaties/gevel-steenstrips.jpg';
import imgVillaMod from '@/assets/realisaties/01_extra_villa-modern-mechelen.jpg';
import imgHoekwoning from '@/assets/realisaties-new/gevel-hoekwoning.jpg'; // NEW FLUX — klassieke rode baksteen hoekwoning
import imgStadswoning from '@/assets/realisaties/04_extra_stadswoning-brussel.jpg';
import imgRijwoning from '@/assets/realisaties/extra-24_geel-rijwoning.jpg';
import imgRodeVilla from '@/assets/realisaties/extra-25_rode-baksteen-villa.jpg';
import imgGeleVilla from '@/assets/realisaties/extra-26_gele-villa-zijaanzicht.jpg';

type Project = {
  img: string;
  tag: string;
  title: string;
  story: string;
  specs: { m2?: string; tijd: string; materiaal?: string; premie?: string };
  quote?: { text: string; name: string };
  filter: 'crepi' | 'etics' | 'steenstrips' | 'sierpleister' | 'renovatie' | 'reiniging';
};

const projects: Project[] = [
  {
    img: imgCrepiWit,
    tag: 'Witte crepi + cederlat-accenten',
    title: 'Hedendaagse villa · witte crepi met houten gevelblokken',
    story:
      "Hedendaagse vrijstaande villa met strakke witte siliconencrepi-gevel, accenten in westerse cederlat rond de inkom en raampartijen. ETICS-buitenisolatie 14 cm EPS, afgewerkt met Sto Lotusan in helder wit. Anthraciet aluminium schrijnwerk Reynaers MasterLine, dorpels in arduin. Een gevel die clean leest van de straat en warm wordt door de houten accenten.",
    specs: { m2: '186 m² gevelvlak', tijd: '6 weken', materiaal: '14 cm EPS + Sto Lotusan + ceder accenten', premie: 'Mijn VerbouwPremie €4.020' },
    quote: { text: 'De architect kwam zelf na de oplevering een rondje doen. Hij zei: "dit is geen pleisterwerk, dit is precisie-werk."', name: 'Annick D.' },
    filter: 'etics',
  },
  {
    img: imgCrepiGrijs,
    tag: 'Lichtgrijze siliconencrepi',
    title: 'Klassieke woning · siliconencrepi in zacht lichtgrijs',
    story:
      'Vrijstaande klassieke woning met traditioneel zadeldak vroeg om een tijdloze gevel — geen hard antraciet, geen kil wit, maar een warm-grijze siliconencrepi die mooi met de leien afdaling samenwerkt. Sto Lotusan in lichtgrijs (RAL 7044), antraciet aluminium schrijnwerk en dorpels in arduin. Zelf-reinigende coating — regen spoelt vuil automatisch mee.',
    specs: { m2: '224 m² gevelvlak', tijd: '5 weken', materiaal: 'Sto Lotusan RAL 7044 siliconencrepi' },
    filter: 'crepi',
  },
  {
    img: imgSteenstrips,
    tag: 'Anthraciet steenstrips tuin-aanbouw',
    title: 'Aanbouw met schuifpui · steenstrips in zwart-anthraciet',
    story:
      'Tuinzijde-aanbouw met grote schuifpui die uitkijkt op het terras. Volume bekleed met handvorm-steenstrips in zwart-anthraciet (Vandersanden Black Diamond) — modern karakter dat contrasteert met de witgekalkte hoofdgevel. Onderhoudsvrij voor 30+ jaar.',
    specs: { m2: '64 m² aanbouwgevel', tijd: '4 weken', materiaal: 'Vandersanden Black Diamond handvorm-steenstrips' },
    quote: { text: 'We hebben gekozen voor zwart steen i.p.v. crepi omdat we de tuin wilden laten "lezen" tegen iets sterks. Goeie keuze gebleken.', name: 'Stijn V.' },
    filter: 'steenstrips',
  },
  {
    img: imgSierpleister,
    tag: 'Sierpleister + zwart cladding',
    title: 'Modern volume · witte sierpleister boven anthraciet plint',
    story:
      'Hedendaagse villa met scherp contrast tussen het strakke witte bovenvolume in handgeschilderde sierpleister, en de zwarte horizontale anthraciet-cladding van de onderbouw. Composiet daktrim verbergt het plat dak compleet — een gevel die op afstand bijna grafisch leest, van dichtbij ambachtelijk.',
    specs: { m2: '178 m² (96 m² wit sierpleister + 82 m² zwarte cladding)', tijd: '7 weken', materiaal: 'Knauf handgeschilderde sierpleister + Eternit Equitone cladding' },
    filter: 'sierpleister',
  },
  {
    img: imgGevelCrepi,
    tag: 'Crepi-renovatie + herstelcoating',
    title: 'Bestaande crepi · reiniging + herstelcoating',
    story:
      "Bestaande crepi-gevel uit 2003 had algenaangroei aan de noordzijde en kleine scheurtjes nabij de raamhoeken. Hogedruk-reiniging met algen-killer, scheuren hersteld met vezelmortel en netwapening, daarna volledige herstel-coating in dezelfde RAL-tint. Geen complete strip nodig — alleen waar het mogelijk was.",
    specs: { m2: '198 m²', tijd: '2 weken', materiaal: 'Sto reinigings- en herstel-coating' },
    filter: 'reiniging',
  },
  {
    img: imgVillaMod,
    tag: 'Beige Vlaamse handvorm-baksteen',
    title: 'Nieuwbouw villa · gevelblokken in zacht beige handvorm',
    story:
      'Strakke moderne villa met als gevraagd materiaal: traditionele Vlaamse handvorm-gevelsteen in zacht beige-roze, met diepe voegen voor schaduwwerking en grote zwarte aluminium raamopeningen. Eigen metselploeg — geen losse onderaannemer — om ritme en voegdiepte over de volledige 312 m² consistent te houden.',
    specs: { m2: '312 m² gevelvlak', tijd: '8 weken', materiaal: 'Vandersanden handvorm beige + Reynaers schrijnwerk' },
    quote: { text: 'De voegen lopen overal even diep, ook achter de balkons en in de dakranden. Dat is bij andere bouwers nooit het geval.', name: 'Patrick H.' },
    filter: 'crepi',
  },
  {
    img: imgGevelStrips,
    tag: 'Rood-bruine handvorm-steenstrips',
    title: 'Naïsolatie rijhuis · klassieke rood-bruine steenstrips',
    story:
      'Tussenwoning eind 19e eeuw, enkele baksteen, geen isolatie. Volledig ingepakt met 14 cm EPS, daarna handvorm-steenstrips in warm rood-bruin Vandersanden — moderne thermische upgrade, klassiek straatbeeld behouden. Zwart aluminium schrijnwerk met diepe omkadering geeft een eigentijds detail.',
    specs: { m2: '128 m² gevelvlak', tijd: '6 weken', materiaal: '14 cm EPS + Vandersanden Forum rood-bruin', premie: 'Mijn VerbouwPremie €2.880' },
    filter: 'steenstrips',
  },
  {
    img: imgHoekwoning,
    tag: 'Klassieke baksteen-hoekwoning',
    title: 'Behoud baksteengevel · enkel voegherstel + reiniging',
    story:
      'Klassieke hoekwoning in originele rode Vlaamse baksteen. Eigenaar wou expliciet de gevel-uitstraling behouden — wij hebben geen ETICS toegepast maar zelectief voegherstel: oude verbrokkelende voegen uitgekapt, vervangen door kleurmatch kalkmortel. Biologische reiniging tegen algenaangroei. Karakter behouden, levensduur 25+ jaar verlengd.',
    specs: { m2: '156 m² gevelvlak', tijd: '5 weken', materiaal: 'Webertec kleurvaste voegmortel + bio-reiniging' },
    filter: 'reiniging',
  },
  {
    img: imgStadswoning,
    tag: 'Stadswoning-restauratie 1908',
    title: 'Burgerwoning · originele bepleistering hervoegd',
    story:
      'Beschermd stadszicht, geen ETICS toegestaan. We hebben de originele bepleistering uit 1908 gerestaureerd: losse delen vervangen door kalkmortel volgens recept van Brusselse monumentenzorg, geverfd in originele blauw-grijze RAL. Behoud van profileringen rond ramen en kornisen.',
    specs: { m2: '104 m² zijgevel', tijd: '7 weken', materiaal: 'Kalkmortel + Keim siliconaatverf' },
    quote: { text: 'De stedelijke monumentenzorg gaf zelfs een complimentje. Dat is bij hen zeldzaam.', name: 'Mariam K.' },
    filter: 'renovatie',
  },
  {
    img: imgRijwoning,
    tag: 'Gevelreiniging + nieuw voegwerk',
    title: 'Gele baksteen-rijwoning · reiniging + nieuw voegwerk',
    story:
      'Originele gele Vlaamse baksteengevel met 30 jaar verkleuring en losse voegen. Hogedruk-reiniging met biologisch product (geen chemische schade aan baksteen), oude voegen uitgekapt tot 18 mm diep, vervangen door lichte kalkmortel. Resultaat: gevel oogt 20 jaar jonger. Antraciet schrijnwerk meegenomen voor moderne accent.',
    specs: { m2: '88 m² gevelvlak', tijd: '4 weken', materiaal: 'Biocide-reiniging + kalkvoegmortel' },
    filter: 'reiniging',
  },
  {
    img: imgRodeVilla,
    tag: 'Karaktervilla · selectief voegherstel',
    title: 'Vrijstaande rode baksteen-villa · selectief voegherstel',
    story:
      'Bestaande rode baksteengevel was structureel gezond, maar voegen op de zuidoostzijde verbrokkelden. Selectieve uitkapping (alleen waar nodig), kleurmatch van de bestaande voeg, en finishing met silicaat-zout dat verkleuringen voorkomt. Karakter behouden, levensduur verlengd met decennia.',
    specs: { m2: '212 m² gevelvlak (32% voegherstel)', tijd: '5 weken', materiaal: 'Webertec kleurvaste voegmortel' },
    filter: 'reiniging',
  },
  {
    img: imgGeleVilla,
    tag: 'BEN-villa gele handvorm-gevelsteen',
    title: 'BEN-woning · gele gevelsteen met dieptevoeg',
    story:
      'Bijna-energie-neutrale nieuwbouw waar de gevel zelf de isolatie versterkt. Gele Vlaamse handvorm-gevelsteen op een geïsoleerde binnenmuur (Ytong 36 cm + 10 cm EPS), met een diep-uitgekapte voeg voor schaduw-werking. Architectonisch detail dat letterlijk het zonlicht modelleert.',
    specs: { m2: '264 m² gevelvlak', tijd: '11 weken', materiaal: 'Wienerberger gele handvorm + dieptevoeg' },
    filter: 'crepi',
  },
];

const filters = [
  { key: 'all', label: 'Alle projecten' },
  { key: 'etics', label: 'ETICS buitenisolatie' },
  { key: 'crepi', label: 'Crepi (silicone)' },
  { key: 'steenstrips', label: 'Steenstrips' },
  { key: 'sierpleister', label: 'Sierpleister' },
  { key: 'renovatie', label: 'Renovatie + herstel' },
  { key: 'reiniging', label: 'Reiniging + voegwerk' },
];

const HTML = `
${buildNav('realisaties')}

${buildHero({
  bg: heroBg,
  eyebrow: 'Realisaties · gevelwerken',
  title: '63.112 m² gevel.<br/>16 jaar. Vakwerk dat blijft.',
  lede: '12 recente gevelprojecten uit Mechelen, Antwerpen, Lier en omstreken. Crepi, ETICS-buitenisolatie, steenstrips, sierpleister en renovatie van karaktergevels. Eigen vakmensen — m²-aantallen, materiaal en doorlooptijd per project.',
  primary: { label: 'Plan uw gratis gevel-offerte', href: '/lp/gevel#lp-form' },
  secondary: { label: 'Naar gevelwerken-pagina →', href: '/gevel' },
})}

<!-- TRUST STRIP -->
<section class="lf-section rzd-trust-section">
  <div class="wrap">
    <div class="rzd-trust" data-reveal>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">63.112</span>
        <span class="rzd-trust-lbl">m² gevel afgewerkt</span>
      </div>
      <div class="rzd-trust-divider"></div>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">124+</span>
        <span class="rzd-trust-lbl">tevreden klanten</span>
      </div>
      <div class="rzd-trust-divider"></div>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">14</span>
        <span class="rzd-trust-lbl">vaste vakmensen in dienst</span>
      </div>
      <div class="rzd-trust-divider"></div>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">2010</span>
        <span class="rzd-trust-lbl">familiebedrijf sinds</span>
      </div>
    </div>
  </div>
</section>

<!-- QUOTE -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="ab-quote" data-reveal>
      "Een gevel staat 30 jaar in weer en wind. We gebruiken bewust premium materialen: Sto, Wienerberger, Reynaers. Goedkoper kan altijd — maar dan ben je over 8 jaar terug aan het beginnen. Onze klanten kiezen ons omdat ze maar één keer willen renoveren."
      <footer>Zaakvoerder AB Bouw Groep</footer>
    </div>
  </div>
</section>

<!-- WERKMETHODE — 4 stappen mini -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Onze werkmethode</span>
      <h2 class="lf-h2">Vier fases — kleurkeuze<br/>en monsters vóór akkoord.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal>
        <div class="ab-flow-num">FASE 01</div>
        <h5>Gratis plaatsbezoek</h5>
        <p>Binnen 5 werkdagen ter plaatse. Bestaande gevel beoordeeld, m² opgemeten, foto-rapport van knelpunten.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1">
        <div class="ab-flow-num">FASE 02</div>
        <h5>Kleurkeuze + monsters</h5>
        <p>Kleurstaal-stukken op uw gevel uitgevoerd, 1m² echt materiaal, zodat u in echt licht kiest — niet uit een kleurenkaart.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2">
        <div class="ab-flow-num">FASE 03</div>
        <h5>Uitvoering eigen ploeg</h5>
        <p>14 vaste vakmensen in dienst. Stelling, isolatie, finish — alles door dezelfde ploeg, niet onderverdeeld.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3">
        <div class="ab-flow-num">FASE 04</div>
        <h5>Oplevering + 10j garantie</h5>
        <p>Officiële oplevering met fotorapport. 10 jaar Federale Verzekering. Onderhoudsadvies per materiaal meegegeven.</p>
      </div>
    </div>
  </div>
</section>

<!-- FILTER + PROJECT GRID -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Recente projecten</span>
      <h2 class="lf-h2">Echte gevels op echte huizen.<br/>Met m², materiaal en eerlijke verhalen.</h2>
      <p class="lf-lede" style="max-width: 700px; margin: 12px auto 0;">Geen stockfoto's. Geen gestreamlinde portfolio. Filtreer per type werk om te zien wat we voor uw situatie hebben gedaan.</p>
    </div>

    <div class="rzd-filter-wrap" data-reveal>
      <div class="rzd-filter" id="rzgFilters">
        ${filters.map((f, i) => `
          <button type="button" class="rzd-chip${i === 0 ? ' active' : ''}" data-rzg-filter="${f.key}">
            ${f.label}
          </button>`).join('')}
      </div>
    </div>

    <div class="rzd-grid" id="rzgGrid">
      ${projects.map((p) => `
        <article class="rzd-card" data-rzg-card="${p.filter}" data-reveal>
          <div class="rzd-card-img">
            <img src="${p.img}" alt="${p.tag}" loading="lazy"/>
            <span class="rzd-card-tag">${p.tag}</span>
          </div>
          <div class="rzd-card-body">
            <h3 class="rzd-card-title">${p.title}</h3>
            <p class="rzd-card-story">${p.story}</p>
            <ul class="rzd-card-specs">
              ${p.specs.m2 ? `<li><span class="rzd-spec-lbl">Oppervlakte</span><span class="rzd-spec-val">${p.specs.m2}</span></li>` : ''}
              <li><span class="rzd-spec-lbl">Doorlooptijd</span><span class="rzd-spec-val">${p.specs.tijd}</span></li>
              ${p.specs.materiaal ? `<li><span class="rzd-spec-lbl">Materiaal</span><span class="rzd-spec-val">${p.specs.materiaal}</span></li>` : ''}
              ${p.specs.premie ? `<li><span class="rzd-spec-lbl">Premie</span><span class="rzd-spec-val">${p.specs.premie}</span></li>` : ''}
            </ul>
            ${p.quote ? `
              <blockquote class="rzd-card-quote">
                <p>"${p.quote.text}"</p>
                <cite>— ${p.quote.name}</cite>
              </blockquote>` : ''}
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<!-- GARANTIE / WAARBORG -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Schriftelijk vastgelegd</span>
      <h2 class="lf-h2">Drie garanties voor uw gevel.</h2>
    </div>
    <div class="lf-support-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="lf-support-card" data-reveal>
        <div class="lf-support-meta"><span>01</span> Aansprakelijkheid</div>
        <h5>10 jaar Federale Verzekering</h5>
        <p>Wettelijke 10-jarige aansprakelijkheid op stabiliteit en waterdichtheid van de gevel, gedekt door polis bij Federale Verzekering.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="1">
        <div class="lf-support-meta"><span>02</span> Materialen</div>
        <h5>10-25j fabrieksgarantie</h5>
        <p>Sto siliconencrepi 10 jaar kleur- en vorm-vastheid, Wienerberger steenstrips 20 jaar, Reynaers schrijnwerk 25 jaar. Garantiedocumenten bij oplevering.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="2">
        <div class="lf-support-meta"><span>03</span> Erkenningen</div>
        <h5>VCA* + Lid Bouwunie</h5>
        <p>VCA*-certificaat voor werken op hoogte en met stelling. Lid Bouwunie — kwaliteitscontrole en bemiddeling bij geschillen via de sector-organisatie.</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Veelgestelde vragen</span>
      <h2 class="lf-h2">Over gevelwerken specifiek.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Hoe lang duurt een gevelrenovatie?</summary><div class="ab-faq-body"><p>Een rijwoning-gevel (~120 m²) duurt gemiddeld 4-6 weken inclusief stelling. Halfopen of vrijstaand (200-300 m²) loopt op tot 7-10 weken. Tijd hangt vooral af van uithardingstijd van de mortel — die kunnen we niet versnellen. Wachttijd tussen offerte-akkoord en start werf: typisch 6-10 weken afhankelijk van seizoen.</p></div></details>
      <details data-reveal><summary>Wat met Mijn VerbouwPremie voor gevelisolatie?</summary><div class="ab-faq-body"><p>Voor ETICS-buitenisolatie (gevelisolatie met afwerking erop) blijft Mijn VerbouwPremie in 2026 actief — tot €4.000 afhankelijk van inkomen en m². Pure crepi zonder isolatie komt sinds 2026 niet meer in aanmerking. Wij regelen het volledige dossier voor u: aanvraag, foto-rapport, technische fiches en indiening bij Fluvius. De premie volgt rechtstreeks op uw rekening, gemiddeld 8-12 weken na oplevering.</p></div></details>
      <details data-reveal><summary>Welk materiaal is beter: crepi, steenstrips of sierpleister?</summary><div class="ab-faq-body"><p>Crepi (siliconencrepi van Sto, Caparol, Marmolit) — goed voor strakke moderne uitstraling, 8-12 onderhoudsvrije jaren. Steenstrips (Wienerberger, Vandersanden) — authentieke baksteenlook, 30+ jaar onderhoudsvrij. Sierpleister (marmorino, kalkpleister) — premium ambachtelijk afwerking voor karaktergevels. Wij raden aan op basis van uw woning, niet op basis van wat we het liefst verkopen. Bij plaatsbezoek tonen we de drie opties met monsters op uw gevel.</p></div></details>
      <details data-reveal><summary>Mag ik mijn gevel zomaar laten isoleren — heb ik een vergunning nodig?</summary><div class="ab-faq-body"><p>Voor de meeste gevelisolatie-werken in Vlaanderen geldt vrijstelling (geen vergunning), op voorwaarde dat: de gevel grenst niet aan een beschermd zicht, de isolatie-dikte ≤14 cm blijft, en de kleur niet drastisch verandert van het straatbeeld. Bij twijfel — vooral binnenstad Mechelen, Antwerpen, Brussel — vragen wij de stedenbouwkundige stempel aan vóór start werf. Onze projectleider weet welke uitzonderingen waar gelden.</p></div></details>
      <details data-reveal><summary>Wat is het verschil tussen Sto en goedkopere crepi-merken?</summary><div class="ab-faq-body"><p>Sto Lotusan (en gelijkaardige Caparol AmphiSilan) heeft een siliconen-resin-basis die zelfreinigend werkt — regen spoelt vuil mee. Goedkopere crepi (acryl-basis) vraagt elke 5-7 jaar reiniging en herschildering. Het prijsverschil per m² is €4-6 — over 20 jaar bekeken levert de premium-keuze een netto besparing op door uitgespaard onderhoud.</p></div></details>
      <details data-reveal><summary>Krijg ik een fotorapport van het werk?</summary><div class="ab-faq-body"><p>Ja, standaard. Foto's van de bestaande staat bij offerte. Wekelijkse foto-update tijdens uitvoering. Bij oplevering een eindrapport per gevelvlak — inclusief detail-foto's rond ramen, dorpels en aansluitingen — digitaal bezorgd. Garantiedocumenten en kleurcode-fiches voor latere bijwerk-doeleinden.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Klaar voor een gevel die blijft staan?', 'Plan een gratis plaatsbezoek met kleur-monsters op uw gevel. Antwoord binnen één werkdag.')}

${FOOTER}
`;

const PAGE_STYLE = `
/* Trust strip */
.rzd-trust-section { padding: 32px 0 8px; }
.rzd-trust {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 22px 32px;
  background: linear-gradient(135deg, #fff 0%, #fafbfc 100%);
  border: 1px solid var(--ink-line-soft);
  border-radius: 18px;
  box-shadow: 0 10px 32px -22px rgba(15,23,42,0.18);
}
.rzd-trust-item {
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
  padding: 0 20px;
  flex: 1; min-width: 160px;
}
.rzd-trust-num {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.4vw, 38px);
  font-weight: 700;
  color: var(--navy);
  letter-spacing: -0.02em;
  line-height: 1;
}
.rzd-trust-lbl {
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
  margin-top: 4px;
}
.rzd-trust-divider {
  width: 1px;
  background: var(--ink-line-soft);
  align-self: stretch;
}
@media (max-width: 760px) {
  .rzd-trust { padding: 18px; gap: 4px; }
  .rzd-trust-divider { display: none; }
  .rzd-trust-item { flex: 1 1 44%; min-width: 130px; padding: 12px 8px; }
}

/* Filter chips */
.rzd-filter-wrap { margin: 32px 0 28px; display: flex; justify-content: center; }
.rzd-filter {
  display: flex; flex-wrap: wrap; gap: 8px;
  justify-content: center;
  max-width: 920px;
  padding: 8px;
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  border-radius: 999px;
}
.rzd-chip {
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: transparent;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink-soft);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s var(--ease);
  white-space: nowrap;
}
.rzd-chip:hover { color: var(--navy); background: rgba(10,31,68,0.04); }
.rzd-chip.active {
  background: var(--navy);
  color: #fff;
  box-shadow: 0 4px 12px -4px rgba(10,31,68,0.4);
}
@media (max-width: 720px) {
  .rzd-filter { border-radius: 16px; max-width: 100%; padding: 6px; }
  .rzd-chip { padding: 9px 14px; font-size: 13px; }
}

/* Project grid */
.rzd-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-top: 8px;
}
@media (max-width: 880px) {
  .rzd-grid { grid-template-columns: 1fr; gap: 24px; }
}
.rzd-card {
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid var(--ink-line-soft);
  box-shadow: 0 1px 3px rgba(15,23,42,0.04), 0 18px 36px -22px rgba(15,23,42,0.16);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  display: flex;
  flex-direction: column;
}
.rzd-card[hidden] { display: none !important; }
.rzd-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 1px 3px rgba(15,23,42,0.06), 0 28px 52px -22px rgba(15,23,42,0.24);
}
.rzd-card-img {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #eef0f3;
}
.rzd-card-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.9s cubic-bezier(.2,.7,.2,1);
}
.rzd-card:hover .rzd-card-img img { transform: scale(1.04); }
.rzd-card-tag {
  position: absolute;
  bottom: 14px; left: 14px;
  padding: 7px 14px;
  background: rgba(10,22,40,0.88);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #fff;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 999px;
}
.rzd-card-body {
  padding: 26px 28px 28px;
  display: flex; flex-direction: column; gap: 14px;
  flex: 1;
}
.rzd-card-title {
  font-family: var(--font-display);
  font-size: clamp(19px, 1.9vw, 22px);
  font-weight: 700;
  color: var(--navy);
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.rzd-card-story {
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--ink);
  margin: 0;
}
.rzd-card-specs {
  list-style: none;
  margin: 6px 0 0;
  padding: 14px 0 0;
  border-top: 1px solid var(--ink-line-soft);
  display: flex; flex-direction: column; gap: 8px;
}
.rzd-card-specs li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}
.rzd-spec-lbl {
  color: var(--ink-soft);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 11px;
}
.rzd-spec-val {
  color: var(--navy);
  font-weight: 600;
  text-align: right;
  font-size: 13px;
}
.rzd-card-quote {
  margin: 14px 0 0;
  padding: 16px 18px;
  background: linear-gradient(135deg, #fafbfc 0%, #f4f6f8 100%);
  border-left: 3px solid var(--accent);
  border-radius: 12px;
}
.rzd-card-quote p {
  margin: 0 0 6px;
  font-size: 14px;
  font-style: italic;
  color: var(--ink);
  line-height: 1.5;
}
.rzd-card-quote cite {
  font-size: 12px;
  font-style: normal;
  color: var(--ink-soft);
  font-weight: 500;
}
@media (max-width: 720px) {
  .rzd-card-body { padding: 22px 22px 24px; }
  .rzd-card-title { font-size: 18px; }
  .rzd-card-story { font-size: 14px; }
}
`;

export default function RealisatiesGevel() {
  useEffect(() => {
    document.title = "Gevel realisaties — 63.112 m² in 16 jaar | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Recente gevelrenovaties in Mechelen, Antwerpen, Lier en omstreken — crepi, ETICS-buitenisolatie, steenstrips, sierpleister en gevelreiniging. 12 echte projecten met m², doorlooptijd, materiaal en klant-quotes.');

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]:not([hreflang])');
    if (!link) { link = document.createElement('link'); link.setAttribute('rel','canonical'); document.head.appendChild(link); }
    link.setAttribute('href','https://abgroep.be/realisaties/gevel');

    const prev = document.body.className;
    document.body.className = 'is-subpage';
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE + PAGE_STYLE;
    document.head.appendChild(styleEl);

    const chipBtns = document.querySelectorAll<HTMLButtonElement>('[data-rzg-filter]');
    const cards = document.querySelectorAll<HTMLElement>('[data-rzg-card]');
    const onChip = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const key = btn.getAttribute('data-rzg-filter') || 'all';
      chipBtns.forEach(b => b.classList.toggle('active', b === btn));
      cards.forEach(c => {
        const f = c.getAttribute('data-rzg-card');
        const show = key === 'all' || f === key;
        c.hidden = !show;
      });
    };
    chipBtns.forEach(b => b.addEventListener('click', onChip));

    return () => {
      document.body.className = prev;
      styleEl.remove();
      chipBtns.forEach(b => b.removeEventListener('click', onChip));
    };
  }, []);

  useAbBouwInteractions();

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
