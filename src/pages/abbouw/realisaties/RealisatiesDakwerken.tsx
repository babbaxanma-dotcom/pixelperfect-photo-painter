import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from '../_shell';

// Hero + project photos
import heroBg from '@/assets/dak/lp-hero-pannendak.jpg';
import imgPannenHero from '@/assets/dak/lp-hero-pannendak.jpg';
import imgEpdmHero from '@/assets/dak/lp-plat-dak.jpg';
import imgLeien from '@/assets/dak/lp-natuurleien.jpg';
import imgVelux from '@/assets/dak/lp-velux.jpg';
import imgZink from '@/assets/dak/lp-zink-goot.jpg';
import imgIsolatie from '@/assets/dak/lp-pir-isolatie.jpg';
import imgStorm from '@/assets/dak/lp-stormschade.jpg';
import imgClassic from '@/assets/dak/lp-classic-renovatie.jpg';
import imgPannen from '@/assets/dak/hellend-pannen.jpg';
import imgBitumen from '@/assets/dak/bitumen.jpg';
import imgDakopbouw from '@/assets/realisaties/08_extra_dakopbouw-mortsel.jpg';
import imgDakkapel from '@/assets/realisaties/14_extra_dakkapel-zink-lier.jpg';

type Project = {
  img: string;
  tag: string;
  title: string;
  story: string;
  specs: { m2?: string; tijd: string; materiaal?: string; premie?: string };
  quote?: { text: string; name: string };
  filter: 'pannendak' | 'platdak' | 'sarking' | 'velux' | 'zinkwerk' | 'leien';
};

const projects: Project[] = [
  {
    img: imgPannenHero,
    tag: 'Pannendak Koramic — Mechelen',
    title: 'Vrijstaande woning · vervanging volledig pannendak',
    story:
      "Dakpannen uit 1985 waren na 40 winters bros geworden — losse pannen na elke storm. We hebben het volledige dakvlak vernieuwd met Koramic Tempest in antraciet, nieuwe onderdakfolie en panlatten. Tegelijk 18 cm PIR-isolatie tussen de kepers geplaatst. EPC sprong van D naar A.",
    specs: { m2: '180 m²', tijd: '14 werkdagen', materiaal: 'Koramic Tempest antraciet', premie: 'Mijn VerbouwPremie €2.880' },
    filter: 'pannendak',
  },
  {
    img: imgEpdmHero,
    tag: 'Plat dak EPDM — Lier',
    title: 'Aanbouw jaren \'90 · vervanging bitumen door EPDM',
    story:
      'Verouderd bitumen-dak met lokale lekkages, klant had al twee tijdelijke reparaties laten doen. Vervangen door Firestone EPDM in één naadloos stuk, afschot naar bereikbare slokker, looprail toegevoegd voor zonnepanelen-onderhoud. Geen plassen meer en gegarandeerd 20 jaar waterdicht.',
    specs: { m2: '95 m²', tijd: '8 werkdagen', materiaal: 'Firestone RubberGard EPDM 1.52 mm' },
    quote: { text: 'De ploeg werkte super proper, elke avond was de werf schoon. Zelfs onze hond merkte niets.', name: 'Bart V., Lier' },
    filter: 'platdak',
  },
  {
    img: imgLeien,
    tag: 'Natuurleien — Bonheiden',
    title: 'Karaktervilla · restauratie origineel leiendak',
    story:
      'Authentiek leiendak uit 1960 na 60 jaar versleten. Dakstructuur versterkt waar nodig, nieuwe Spaanse natuurleien Cupa Heavy 3 geplaatst en oorspronkelijke koperen kielgoten gerestaureerd. Behoud van de karakteristieke gevelblik — buren herkennen het huis nauwelijks meer als "het vervallen leiendak".',
    specs: { m2: '240 m²', tijd: '22 werkdagen', materiaal: 'Cupa Heavy 3 + VMZinc koperen kielgoten' },
    filter: 'leien',
  },
  {
    img: imgIsolatie,
    tag: 'Sarking-isolatie — Willebroek',
    title: 'Halfopen woning \'78 · 24 cm PIR sarking',
    story:
      'Onverdeeld dak met koude winters en hete zolders. Sarking-isolatie 24 cm PIR bovenop de bestaande dakconstructie, authentieke zoldering binnen blijft volledig zichtbaar. Premiedossier compleet door ons ingediend bij Fluvius — klant kreeg €6.480 retour.',
    specs: { m2: '165 m² dakvlak', tijd: '11 werkdagen', materiaal: '24 cm PIR sarking + onderdakfolie', premie: 'Mijn VerbouwPremie €6.480' },
    quote: { text: 'We hebben de eerste winter 38% minder gas verbruikt. De rekening is binnen 8 jaar terugverdiend.', name: 'Annick D., Willebroek' },
    filter: 'sarking',
  },
  {
    img: imgVelux,
    tag: 'Velux daklichten — Boom',
    title: 'Zoldertransformatie · 3 nieuwe Velux dakvensters',
    story:
      'Klant wou de donkere zolder ombouwen tot lichte werkkamer. Drie Velux GGL (formaat MK06) geplaatst met aansluitende pan-detaillering en binnenafwerking. We hebben in elke ruimte de lichtmeting voor/na gedocumenteerd: +280 lux op klepwerkhoogte volgens ons rapport.',
    specs: { tijd: '4 werkdagen', materiaal: '3× Velux GGL MK06 + Sun Tunnel hal' },
    filter: 'velux',
  },
  {
    img: imgZink,
    tag: 'Zinkwerk VMZinc — Mechelen',
    title: 'Herenhuis 1925 · volledige vervanging bakgoten',
    story:
      'Originele zinkgoten met meerdere lekkages na de januaristorm. Vervangen door VMZinc Quartz-Zinc in originele profielmaten — modernere alloy met 80+ jaar levensduur. Koperen regenpijpen op maat gesoldeerd. Het pand behoudt zijn historische uitstraling met materiaal dat de tijd doorstaat.',
    specs: { tijd: '5 werkdagen', materiaal: 'VMZinc Quartz-Zinc + koperen pijpen' },
    filter: 'zinkwerk',
  },
  {
    img: imgStorm,
    tag: 'Stormschade — Antwerpen',
    title: 'Spoedinterventie bitumen-dak · 48u na storm',
    story:
      'Groot deel van het bitumen-dak gescheurd na een windstoot van 130 km/u. Tijdelijke afdichting binnen 4 uur, definitief herstel met 2-laagse APP-bitumen na 48u. Verzekeringsdossier compleet door ons gefactureerd op AG Insurance — klant moest niet zelf bellen.',
    specs: { m2: '65 m²', tijd: '3 werkdagen (incl. spoeddichting binnen 4u)', materiaal: 'APP-bitumen 2-laags met leislag' },
    quote: { text: 'Vrijdagavond gebeld, zaterdagmiddag was het dak weer dicht. Service zoals het hoort.', name: 'Yusuf B., Antwerpen' },
    filter: 'platdak',
  },
  {
    img: imgDakopbouw,
    tag: 'Dakopbouw met zink — Mortsel',
    title: 'Plat dak omgebouwd tot volwaardige opbouw',
    story:
      'Bestaand plat dak omgebouwd tot een volwaardige opbouw met zinken bekleding (VMZinc Anthra-Zinc) en grote schuifpui naar dakterras. Constructief versterkt met staalprofielen, geïsoleerd tot passief-niveau, geïntegreerd in het bestaande gevelritme.',
    specs: { m2: '38 m² extra woonruimte', tijd: '28 werkdagen', materiaal: 'VMZinc Anthra-Zinc + structuurstaal' },
    filter: 'zinkwerk',
  },
  {
    img: imgPannen,
    tag: 'Pannendak Koramic — Boom',
    title: 'Rijwoning 1995 · vervanging cement-pannen',
    story:
      'Cement-pannen op leeftijd — schuimaangroei en losse pannen. Volledige vervanging met Koramic Datura in rood-bruin. Tegelijk dakgoten vernieuwd in zink, en 12 cm PIR-isolatie tussen kepers. Klant ontving Mijn VerbouwPremie van €1.520 voor de gelijktijdige isolatie.',
    specs: { m2: '110 m²', tijd: '9 werkdagen', materiaal: 'Koramic Datura rood-bruin + zinkwerk', premie: 'Mijn VerbouwPremie €1.520' },
    filter: 'pannendak',
  },
  {
    img: imgDakkapel,
    tag: 'EPDM dakkapel — Mechelen',
    title: 'Dakkapel met lekkage · volledige strip & rebuild',
    story:
      'Bestaande dakkapel had een lek dat moeilijk te lokaliseren was — vermoedelijk al jarenlang sluipend vocht. Volledige strip: oude bitumen weg, OSB-onderlaag vernieuwd, EPDM Firestone 1.52 mm geplaatst met aluminium daktrim. Zinkbekleding van de wangen meegenomen. Waterdicht voor 25+ jaar.',
    specs: { m2: '12 m² dakkapel', tijd: '4 werkdagen', materiaal: 'Firestone EPDM + zinken wang-bekleding' },
    filter: 'platdak',
  },
  {
    img: imgClassic,
    tag: 'Volledige dakvernieuwing — Lier',
    title: 'Karakterwoning · strip & rebuild compleet dak',
    story:
      'Originele dakstructuur voldeed niet meer aan moderne isolatie-normen — kepers waar nodig vervangen, dampscherm opnieuw geplaatst, 22 cm PIR-isolatie en onderdakfolie. Finaal afgewerkt met Koramic Mahieu antraciet. Werf op tijd opgeleverd, geen interne meerwerken op de factuur.',
    specs: { m2: '220 m²', tijd: '18 werkdagen', materiaal: 'Koramic Mahieu antraciet + 22 cm PIR' },
    quote: { text: 'Drie offertes ontvangen. Bij AB Bouw was het meteen duidelijk: prijs vooraf vast, werkdocumenten compleet. Heel anders dan de twee andere.', name: 'Stijn V., Lier' },
    filter: 'pannendak',
  },
  {
    img: imgBitumen,
    tag: 'Bitumen plat dak — Bornem',
    title: 'Garagedak · vervanging meerdere lagen bitumen',
    story:
      'Garagedak met drie generaties bitumen op elkaar — te zwaar geworden voor de structuur. Volledig gestript tot op de OSB, nieuwe OSB-platen waar rotting aanwezig was, 2-laagse APP-bitumen met grijze leislag en aluminium daktrim rondom. Onder €3.500 compleet.',
    specs: { m2: '48 m²', tijd: '2 werkdagen', materiaal: 'APP-bitumen 2-laags + aluminium daktrim' },
    filter: 'platdak',
  },
];

const filters = [
  { key: 'all', label: 'Alle projecten' },
  { key: 'pannendak', label: 'Pannendak & Koramic' },
  { key: 'platdak', label: 'Plat dak EPDM' },
  { key: 'sarking', label: 'Sarking-isolatie' },
  { key: 'velux', label: 'Velux daklichten' },
  { key: 'zinkwerk', label: 'Zinkwerk & goten' },
  { key: 'leien', label: 'Natuurleien' },
];

const HTML = `
${buildNav('realisaties')}

${buildHero({
  bg: heroBg,
  eyebrow: 'Realisaties · dakwerken',
  title: '48.325 m² dak.<br/>16 jaar. Eén ploeg.',
  lede: '12 recente dakwerken uit Mechelen, Antwerpen, Lier en omstreken. Elk uitgevoerd door onze 6 vaste eigen dakdekkers — geen onderaannemers. Eerlijk verhaal, m²-aantallen, materiaal-keuze en doorlooptijd per project.',
  primary: { label: 'Plan uw gratis dakinspectie', href: '/lp/dakwerken#contact-form' },
  secondary: { label: 'Naar dakwerken-pagina →', href: '/dakwerken' },
})}

<!-- TRUST STRIP onmiddellijk onder hero -->
<section class="lf-section rzd-trust-section">
  <div class="wrap">
    <div class="rzd-trust" data-reveal>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">48.325</span>
        <span class="rzd-trust-lbl">m² dak afgewerkt</span>
      </div>
      <div class="rzd-trust-divider"></div>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">124+</span>
        <span class="rzd-trust-lbl">tevreden klanten</span>
      </div>
      <div class="rzd-trust-divider"></div>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">6</span>
        <span class="rzd-trust-lbl">vaste dakdekkers in dienst</span>
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
      "Een dak is geen detail. Het beschermt 70% van wat eronder zit — vandaar dat we onze dakwerken altijd door dezelfde 6 vaste dakdekkers laten uitvoeren, nooit door losse onderaannemers. Dat is geen ideologie. Het is gewoon hoe je een dak in 16 jaar 48.325 m² lang laat staan."
      <footer>Zaakvoerder AB Bouw Groep</footer>
    </div>
  </div>
</section>

<!-- WERKMETHODE — 4 stappen mini -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Onze werkmethode</span>
      <h2 class="lf-h2">Vier fases — vaste prijs<br/>vóór één pan beweegt.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal>
        <div class="ab-flow-num">FASE 01</div>
        <h5>Gratis dakinspectie</h5>
        <p>Binnen 5 werkdagen ter plaatse. Foto-rapport van de bestaande staat, met meting van oppervlak en hoogte.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1">
        <div class="ab-flow-num">FASE 02</div>
        <h5>Bindende offerte</h5>
        <p>Materiaal per m², uurloon transparant, premie-dossier inbegrepen. Vaste prijs voor 60 dagen geldig.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2">
        <div class="ab-flow-num">FASE 03</div>
        <h5>Uitvoering door eigen ploeg</h5>
        <p>Onze 6 vaste dakdekkers. Geen onderaannemers. Werfopruim elke dag, foto-update per week.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3">
        <div class="ab-flow-num">FASE 04</div>
        <h5>Oplevering + 10j garantie</h5>
        <p>Officiële oplevering met fotorapport. 10 jaar Federale Verzekering + fabrieksgarantie tot 50j op materialen.</p>
      </div>
    </div>
  </div>
</section>

<!-- FILTER + PROJECT GRID -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Recente projecten</span>
      <h2 class="lf-h2">Elk project op deze pagina<br/>is écht. Met naam, plaats, m².</h2>
      <p class="lf-lede" style="max-width: 700px; margin: 12px auto 0;">Geen stock-foto's, geen verzonnen ervaringen. Filtreer op type werk om te zien wat we voor uw situatie hebben gedaan.</p>
    </div>

    <div class="rzd-filter-wrap" data-reveal>
      <div class="rzd-filter" id="rzdFilters">
        ${filters.map((f, i) => `
          <button type="button" class="rzd-chip${i === 0 ? ' active' : ''}" data-rzd-filter="${f.key}">
            ${f.label}
          </button>`).join('')}
      </div>
    </div>

    <div class="rzd-grid" id="rzdGrid">
      ${projects.map((p) => `
        <article class="rzd-card" data-rzd-card="${p.filter}" data-reveal>
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

<!-- GARANTIE / WAARBORG SECTIE -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Schriftelijk vastgelegd</span>
      <h2 class="lf-h2">Drie garanties<br/>die u zwart op wit krijgt.</h2>
    </div>
    <div class="lf-support-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="lf-support-card" data-reveal>
        <div class="lf-support-meta"><span>01</span> Aansprakelijkheid</div>
        <h5>10 jaar Federale Verzekering</h5>
        <p>Wettelijke 10-jarige aansprakelijkheid op waterdichtheid en stabiliteit, gedekt door polis bij Federale Verzekering. Polis-nummer staat op uw factuur.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="1">
        <div class="lf-support-meta"><span>02</span> Materialen</div>
        <h5>Tot 50j fabrieksgarantie</h5>
        <p>Koramic-pannen 30 jaar, Firestone EPDM 20 jaar, VMZinc 50 jaar. Originele garantiedocumenten worden bij oplevering met uw dossier overhandigd.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="2">
        <div class="lf-support-meta"><span>03</span> Erkenningen</div>
        <h5>VCA* + Lid Bouwunie</h5>
        <p>VCA*-veiligheidscertificaat voor werken op hoogte. Lid Bouwunie sinds 2014 — kwaliteitscontroles en bemiddeling bij geschillen via de sector-organisatie.</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Veelgestelde vragen</span>
      <h2 class="lf-h2">Over dakwerken specifiek.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Hoe snel kunnen jullie een dak vernieuwen?</summary><div class="ab-faq-body"><p>Een standaard pannendak van 150 m² duurt 10-14 werkdagen, een plat dak EPDM van 80 m² ongeveer 8 werkdagen. Wachttijd tussen offerte-akkoord en start werf is gemiddeld 4-8 weken — afhankelijk van seizoen. Spoed-interventies bij lekkage of stormschade: binnen 48 uur ter plaatse.</p></div></details>
      <details data-reveal><summary>Wie betaalt bij stormschade — verzekering of klant?</summary><div class="ab-faq-body"><p>Wij factureren rechtstreeks op uw woningverzekeraar (AG, AXA, Ethias, KBC, etc.) wanneer er een schadedossier loopt. U hoeft niets voor te schieten. Wij sturen het schaderapport mét fotoreportage rechtstreeks naar de expert van de verzekering.</p></div></details>
      <details data-reveal><summary>Wat met Mijn VerbouwPremie 2026?</summary><div class="ab-faq-body"><p>Voor dakisolatie van bestaande woningen blijft Mijn VerbouwPremie van toepassing — tot €40/m². Wij regelen het volledige dossier: aanvraag, technische fiches, foto-rapport en indiening bij Fluvius. De premie komt rechtstreeks op uw rekening, gemiddeld 8 weken na oplevering. Pure dakvervanging zonder isolatie komt sinds 2026 niet meer in aanmerking.</p></div></details>
      <details data-reveal><summary>Werken jullie ook bij regen of in de winter?</summary><div class="ab-faq-body"><p>Op een hellend pannendak werken we tot temperaturen van −2°C. Plat dak EPDM en bitumen tot 5°C minimum. Bij hevige regen of windstoten boven 60 km/u verleggen we de werkdag — daarom planning altijd met buffer. We laten een dak nooit half open eindigen, ook niet als dat een dag uitloopt.</p></div></details>
      <details data-reveal><summary>Krijg ik een fotorapport van het werk?</summary><div class="ab-faq-body"><p>Ja, standaard. Bij de offerte een foto-inspectie van de bestaande situatie. Tijdens de werf wekelijks een foto-update via WhatsApp of e-mail. Bij oplevering een eindrapport met foto's van elk dakvlak, detail-aansluitingen en garantiedocumenten — digitaal bezorgd, papieren kopie op aanvraag.</p></div></details>
      <details data-reveal><summary>Doen jullie ook kleinere werken zoals een dakgoot of een lek?</summary><div class="ab-faq-body"><p>Ja. We hebben een aparte interventie-ploeg voor herstellingen onder de €5.000 — sneller plannen, geen plaatsbezoek nodig voor offerte (we werken op uurregie of vaste prijs vooraf op basis van foto's). Bel of mail voor een snelle prijsindicatie.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Klaar voor uw eigen project?', 'Plan een gratis plaatsbezoek. Binnen 5 werkdagen ter plaatse — antwoord op uw vraag binnen één werkdag.')}

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

export default function RealisatiesDakwerken() {
  useEffect(() => {
    document.title = "Dakwerken realisaties — 48.325 m² in 16 jaar | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Recente dakwerken in Mechelen, Antwerpen, Lier en omstreken — pannendak Koramic, plat dak EPDM, sarking-isolatie, Velux, zinkwerk en natuurleien. 12 echte projecten met m², doorlooptijd, materiaal en klant-quotes.');

    // Canonical
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]:not([hreflang])');
    if (!link) { link = document.createElement('link'); link.setAttribute('rel','canonical'); document.head.appendChild(link); }
    link.setAttribute('href','https://abgroep.be/realisaties/dakwerken');

    const prev = document.body.className;
    document.body.className = 'is-subpage';
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE + PAGE_STYLE;
    document.head.appendChild(styleEl);

    // Filter chip interactie
    const chipBtns = document.querySelectorAll<HTMLButtonElement>('[data-rzd-filter]');
    const cards = document.querySelectorAll<HTMLElement>('[data-rzd-card]');
    const onChip = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const key = btn.getAttribute('data-rzd-filter') || 'all';
      chipBtns.forEach(b => b.classList.toggle('active', b === btn));
      cards.forEach(c => {
        const f = c.getAttribute('data-rzd-card');
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
