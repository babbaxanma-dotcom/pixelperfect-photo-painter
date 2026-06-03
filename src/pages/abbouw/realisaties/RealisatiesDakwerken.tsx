import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildHero, FOOTER, SHELL_STYLE } from '../_shell';
import { CONTACT } from '@/data/contact';
import logo from '@/assets/home/logo.png';

// Hero + project photos — alle geverifieerd qua match met story-tekst
import heroBg from '@/assets/realisaties-new/dak-hero.jpg';
import imgGeelPannen from '@/assets/dak/lp-geel-nieuwbouw.jpg';
import imgEpdmHero from '@/assets/realisaties-new/dak-epdm-modern.jpg';      // NEW FLUX — moderne villa zonnedak + plat-dak gevelvolume
import imgLeien from '@/assets/realisaties-new/dak-leien-villa.jpg';
import imgVelux from '@/assets/dak/lp-velux.jpg';
import imgZink from '@/assets/dak/lp-zink-goot.jpg';
import imgSarking from '@/assets/dak/dakisolatie.jpg';
import imgStorm from '@/assets/realisaties-new/dak-storm-v2.jpg';            // NEW FLUX v2 — clean afgewerkt bitumen plat dak na storm-reparatie
import imgClassic from '@/assets/dak/lp-classic-renovatie.jpg';
import imgPannen from '@/assets/realisaties-new/dak-rijwoning.jpg';          // NEW FLUX — rijwoning 1990s nieuw rood-bruin pannendak
import imgBitumen from '@/assets/dak/bitumen.jpg';
import imgDakopbouw from '@/assets/realisaties-new/dak-opbouw-v2.jpg';       // NEW FLUX v2 — volledig zink-volume tussen klassieke rijwoningen
import imgDakkapelZink from '@/assets/realisaties/14_extra_dakkapel-zink-lier.jpg';

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
    img: imgGeelPannen,
    tag: 'Pannendak antraciet',
    title: 'Gele baksteenwoning · nieuw antraciet pannendak',
    story:
      "Hedendaagse woning in gele Vlaamse baksteen met origineel daken van betonpannen — kleur was vervaagd en porositeit toegenomen. Volledige vervanging met antraciet Koramic-keramiek, nieuwe onderdakfolie en panlatten. Tegelijk 18 cm PIR-isolatie tussen de kepers — strakke moderne dakblik tegen de warme gele gevelsteen.",
    specs: { m2: '180 m²', tijd: '14 werkdagen', materiaal: 'Koramic Tempest antraciet keramiek', premie: '6% btw-tarief' },
    filter: 'pannendak',
  },
  {
    img: imgEpdmHero,
    tag: 'Hellend zonnedak + plat gevelvolume',
    title: 'Hedendaagse villa · pannen-met-PV en plat dak boven gevelopening',
    story:
      'Architecturale villa met asymmetrisch zadeldak — volledig bedekt met geïntegreerde PV-panelen op anthraciet pannen. Plat dak boven de inkom + grote schuifpui in EPDM Firestone met crepi-gevelvolume eronder. Cederlat-accent rondom de inkom. Wij hebben dak + PV-integratie + plat-dak details simultaan uitgevoerd zodat niets dubbel hoefde te worden gefactureerd.',
    specs: { m2: '142 m² hoofddak + 36 m² plat dak', tijd: '14 werkdagen', materiaal: 'Pannen + JinkoSolar PV + Firestone EPDM' },
    quote: { text: 'De ploeg werkte super proper, elke avond was de werf schoon. Zelfs onze hond merkte niets.', name: 'Bart V.' },
    filter: 'platdak',
  },
  {
    img: imgLeien,
    tag: 'Natuurleien Cupa Heavy 3',
    title: 'Karaktervilla \'60 · volledig nieuw leiendak Cupa Heavy 3',
    story:
      'Klassieke vrijstaande karaktervilla met origineel leiendak dat na 60 winters versleten was — broze leien, lekkages bij de schouwen. Volledig nieuw dak in Spaanse natuurleien Cupa Heavy 3 in dezelfde blauwgrijze tint. Bestaande dakstructuur versterkt waar nodig, originele bakstenen schouwen behouden en gerestaureerd, koperen kielgoten op maat geklopt. De karakteristieke uitstraling van de buurt blijft intact.',
    specs: { m2: '240 m²', tijd: '22 werkdagen', materiaal: 'Cupa Heavy 3 + VMZinc koperen kielgoten' },
    filter: 'leien',
  },
  {
    img: imgSarking,
    tag: 'Sarking-isolatie 24 cm PIR',
    title: 'Halfopen woning · 24 cm PIR sarking op bestaand dak',
    story:
      'Onverdeeld dak met koude winters en hete zolders. Sarking-isolatie 24 cm PIR boven op de bestaande dakconstructie geplaatst, oude pannen tijdelijk verwijderd en herplaatst — de foto toont het dak halverwege uitvoering met de nieuwe PIR-platen en dampdichte folie zichtbaar. Premiedossier compleet door ons ingediend bij Fluvius — klant kreeg €6.480 retour.',
    specs: { m2: '165 m² dakvlak', tijd: '11 werkdagen', materiaal: '24 cm PIR sarking + Delta onderdakfolie', premie: '6% btw-tarief' },
    quote: { text: 'We hebben de eerste winter 38% minder gas verbruikt. De rekening is binnen 8 jaar terugverdiend.', name: 'Annick D.' },
    filter: 'sarking',
  },
  {
    img: imgVelux,
    tag: 'Velux daklichten',
    title: 'Zoldertransformatie · 3 nieuwe Velux dakvensters',
    story:
      'Klant wou de donkere zolder ombouwen tot lichte werkkamer. Drie Velux GGL (formaat MK06) geplaatst met aansluitende pan-detaillering en binnenafwerking. We hebben in elke ruimte de lichtmeting voor/na gedocumenteerd: +280 lux op klepwerkhoogte volgens ons rapport.',
    specs: { tijd: '4 werkdagen', materiaal: '3× Velux GGL MK06 + Sun Tunnel hal' },
    filter: 'velux',
  },
  {
    img: imgZink,
    tag: 'Zinkwerk VMZinc Quartz',
    title: 'Herenhuis 1925 · volledige vervanging bakgoten',
    story:
      'Originele zinkgoten met meerdere lekkages na de januaristorm. Vervangen door VMZinc Quartz-Zinc in originele profielmaten — modernere alloy met 80+ jaar levensduur. Koperen regenpijpen op maat gesoldeerd. Het pand behoudt zijn historische uitstraling met materiaal dat de tijd doorstaat.',
    specs: { tijd: '5 werkdagen', materiaal: 'VMZinc Quartz-Zinc + koperen pijpen' },
    filter: 'zinkwerk',
  },
  {
    img: imgStorm,
    tag: 'Spoedinterventie stormschade',
    title: 'Spoedinterventie bitumen-dak · 48u na storm',
    story:
      'Groot deel van het bitumen-dak gescheurd na een windstoot van 130 km/u. Tijdelijke afdichting binnen 4 uur, definitief herstel met 2-laagse APP-bitumen na 48u. Verzekeringsdossier compleet door ons gefactureerd op AG Insurance — klant moest niet zelf bellen.',
    specs: { m2: '65 m²', tijd: '3 werkdagen (incl. spoeddichting binnen 4u)', materiaal: 'APP-bitumen 2-laags met leislag' },
    quote: { text: 'Vrijdagavond gebeld, zaterdagmiddag was het dak weer dicht. Service zoals het hoort.', name: 'Yusuf B.' },
    filter: 'platdak',
  },
  {
    img: imgDakopbouw,
    tag: 'Doorlopende zinkbekleding dak + gevel',
    title: 'Radicale dak-en-gevel renovatie · VMZinc Anthra-Zinc',
    story:
      "Tussenwoning met volledige dak-en-gevel transformatie. Originele pannendak en voorgevel vervangen door doorlopende verticale zinkbekleding in VMZinc Anthra-Zinc met staande naden — identiek profiel op dakvlak én gevel maakt het volume monolitisch. Klassieke nokhoogte en breedte behouden zodat het volume aansluit op de twee buur-rijwoningen met hun traditionele rode pannen- en baksteengevel. Daagt de norm uit qua materiaal, respecteert de norm qua proportie.",
    specs: { m2: '128 m² zinkbekleding (dak + gevel)', tijd: '32 werkdagen', materiaal: 'VMZinc Anthra-Zinc + nieuwe structuur + isolatie passief-niveau' },
    filter: 'zinkwerk',
  },
  {
    img: imgPannen,
    tag: 'Pannendak Koramic Datura',
    title: 'Rijwoning 1995 · vervanging cement-pannen',
    story:
      'Cement-pannen op leeftijd — schuimaangroei en losse pannen. Volledige vervanging met Koramic Datura in rood-bruin. Tegelijk dakgoten vernieuwd in zink, en 12 cm PIR-isolatie tussen kepers.',
    specs: { m2: '110 m²', tijd: '9 werkdagen', materiaal: 'Koramic Datura rood-bruin + zinkwerk', premie: '6% btw-tarief' },
    filter: 'pannendak',
  },
  {
    img: imgDakkapelZink,
    tag: 'Zinken dakkapel VMZinc',
    title: 'Uitbreiding zolder · dakkapel in zink VMZinc Anthra',
    story:
      'Bestaande dakkapel met lekkage werd compleet vervangen door een grotere zinken-bekleede dakkapel — gevels in VMZinc Anthra-Zinc met staande naden, plat dak in EPDM. Resultaat: 6 m² extra woonruimte op zolder en een design-statement dat past bij de moderne buurt.',
    specs: { m2: '14 m² dakkapel-buitenoppervlak', tijd: '6 werkdagen', materiaal: 'VMZinc Anthra-Zinc + Firestone EPDM' },
    filter: 'zinkwerk',
  },
  {
    img: imgClassic,
    tag: 'Volledige dakvernieuwing strip & rebuild',
    title: 'Belgisch huisje · nieuw rood-oranje pannendak',
    story:
      'Vrijstaande woning waar de originele dakstructuur niet meer voldeed aan moderne isolatie-normen. Strip-and-rebuild: kepers waar nodig vervangen, dampscherm opnieuw geplaatst, 22 cm PIR-isolatie en onderdakfolie. Twee Velux-dakvensters meegenomen. Finaal afgewerkt met Koramic Tempest in warme rood-oranje tint die past bij de baksteengevel.',
    specs: { m2: '220 m²', tijd: '18 werkdagen', materiaal: 'Koramic Tempest rood-oranje + 22 cm PIR' },
    quote: { text: 'Drie offertes ontvangen. Bij AB Bouw was het meteen duidelijk: prijs vooraf vast, werkdocumenten compleet. Heel anders dan de twee andere.', name: 'Stijn V.' },
    filter: 'pannendak',
  },
  {
    img: imgBitumen,
    tag: 'Bitumen plat dak APP 2-laags',
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
<header class="lp-mini-header">
  <div class="wrap lp-mini-header-inner">
    <a class="lp-mini-brand" href="/" aria-label="AB Bouw Groep — home">
      <img src="${logo}" alt="AB Bouw Groep — Dakwerken" class="lp-mini-logo" />
    </a>
    <a href="${CONTACT.phone.href}" class="lp-mini-phone" aria-label="Bel ons direct">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <span class="lp-mini-phone-label">${CONTACT.phone.spaced}</span>
    </a>
  </div>
</header>

${buildHero({
  bg: heroBg,
  eyebrow: 'Realisaties · dakwerken',
  title: 'Een dak dat<br/>doet wat het belooft.',
  lede: '12 recent afgewerkte daken — pannen Koramic, EPDM, sarking-isolatie, Velux, zinkwerk en natuurleien. Voor elk project: oppervlakte, materiaal-keuze, doorlooptijd en wat de klant erover zei.',
  primary: { label: 'Plan uw gratis dakinspectie', href: '/lp/dakwerken#lp-form' },
  secondary: { label: 'Bereken uw offerte (60 sec)', href: '/calculator/dakwerken' },
})}

<!-- TRUST STRIP — bewijs in plaats van marketing-getallen -->
<section class="lf-section rzd-trust-section">
  <div class="wrap">
    <div class="rzd-trust" data-reveal>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">10 jaar</span>
        <span class="rzd-trust-lbl">aansprakelijkheid via Federale</span>
      </div>
      <div class="rzd-trust-divider"></div>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">VCA*</span>
        <span class="rzd-trust-lbl">veiligheidscertificaat hoogte</span>
      </div>
      <div class="rzd-trust-divider"></div>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">Bouwunie</span>
        <span class="rzd-trust-lbl">erkend lid sinds 2014</span>
      </div>
      <div class="rzd-trust-divider"></div>
      <div class="rzd-trust-item">
        <span class="rzd-trust-num">Tot 50j</span>
        <span class="rzd-trust-lbl">fabrieksgarantie Koramic, VMZinc</span>
      </div>
    </div>
  </div>
</section>

<!-- QUOTE — story-driven, geen herhaling van trust-stats -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="ab-quote" data-reveal>
      "De vraag is niet 'wie legt mijn dak'. De vraag is: 'wie staat er nog binnen tien jaar als er iets is'. Dat antwoord is voor ons hetzelfde gebleven — een eigen dakdekker met een naam, een gsm-nummer en een polis bij Federale. Geen onderaannemer-keten waar niemand zich verantwoordelijk voelt."
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
      <details data-reveal><summary>Wat met Mijn VerbouwPremie 2026?</summary><div class="ab-faq-body"><p>De premievoorwaarden wijzigden op 1 maart 2026: voor inkomenscategorie 1 en 2 (de meeste eigenaars) verviel de dakisolatiepremie. Behoort u tot een lagere inkomenscategorie, dan kan er nog Mijn VerbouwPremie zijn (tot €40/m²) — wij checken dit en regelen het dossier. Het 6% BTW-tarief geldt sowieso voor woningen ouder dan 10 jaar. Pure dakvervanging zonder isolatie kwam ook voordien al niet in aanmerking.</p></div></details>
      <details data-reveal><summary>Werken jullie ook bij regen of in de winter?</summary><div class="ab-faq-body"><p>Op een hellend pannendak werken we tot temperaturen van −2°C. Plat dak EPDM en bitumen tot 5°C minimum. Bij hevige regen of windstoten boven 60 km/u verleggen we de werkdag — daarom planning altijd met buffer. We laten een dak nooit half open eindigen, ook niet als dat een dag uitloopt.</p></div></details>
      <details data-reveal><summary>Krijg ik een fotorapport van het werk?</summary><div class="ab-faq-body"><p>Ja, standaard. Bij de offerte een foto-inspectie van de bestaande situatie. Tijdens de werf wekelijks een foto-update via WhatsApp of e-mail. Bij oplevering een eindrapport met foto's van elk dakvlak, detail-aansluitingen en garantiedocumenten — digitaal bezorgd, papieren kopie op aanvraag.</p></div></details>
      <details data-reveal><summary>Doen jullie ook kleinere werken zoals een dakgoot of een lek?</summary><div class="ab-faq-body"><p>Ja. We hebben een aparte interventie-ploeg voor herstellingen onder de €5.000 — sneller plannen, geen plaatsbezoek nodig voor offerte (we werken op uurregie of vaste prijs vooraf op basis van foto's). Bel of mail voor een snelle prijsindicatie.</p></div></details>
    </div>
  </div>
</section>

<!-- CALCULATOR-CTA banner — zelfde patroon als /lp/dakwerken -->
<section class="lf-section rzd-calc-cta-section">
  <div class="wrap">
    <a href="/calculator/dakwerken" class="rzd-calc-cta" data-reveal>
      <div class="rzd-calc-cta-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/>
          <line x1="8" y1="6" x2="16" y2="6"/>
          <line x1="8" y1="10" x2="10" y2="10"/>
          <line x1="12" y1="10" x2="14" y2="10"/>
          <line x1="16" y1="10" x2="16" y2="10"/>
          <line x1="8" y1="14" x2="10" y2="14"/>
          <line x1="12" y1="14" x2="14" y2="14"/>
          <line x1="16" y1="14" x2="16" y2="14"/>
          <line x1="8" y1="18" x2="14" y2="18"/>
        </svg>
      </div>
      <div class="rzd-calc-cta-text">
        <span class="rzd-calc-cta-eyebrow">Sneller dan een formulier</span>
        <strong class="rzd-calc-cta-title">Bereken uw offerte online — <span class="rzd-calc-cta-em">60 seconden</span></strong>
        <span class="rzd-calc-cta-sub">6 simpele vragen. <strong>Geen technische kennis nodig.</strong> Wij meten alles nauwkeurig op bij het gratis plaatsbezoek.</span>
      </div>
      <div class="rzd-calc-cta-arrow" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </a>
  </div>
</section>

<!-- FINAL CTA — beide knoppen naar LP-form -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-cta lf-cta--simple" data-reveal>
      <div class="lf-cta-text">
        <h2>Klaar voor uw eigen project?</h2>
        <p>Plan een gratis plaatsbezoek. Binnen 5 werkdagen ter plaatse — antwoord op uw vraag binnen één werkdag.</p>
        <div class="lf-cta-actions">
          <a href="/lp/dakwerken#lp-form" class="lf-btn-light">Plan uw dakinspectie</a>
          <a href="/lp/dakwerken#lp-form" class="lf-btn-outline">Vraag een offerte</a>
        </div>
      </div>
    </div>
  </div>
</section>

${FOOTER}
`;

const PAGE_STYLE = `
/* Mini LP-header (logo + telefoon) — overlay op hero, geen volledige nav */
.lp-mini-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 50;
  background: linear-gradient(180deg, rgba(8,12,22,0.55) 0%, rgba(8,12,22,0.25) 70%, rgba(8,12,22,0) 100%);
  pointer-events: none;
}
.lp-mini-header > * { pointer-events: auto; }
.lp-mini-header-inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 18px 0;
}
.lp-mini-brand {
  display: inline-flex; align-items: center; text-decoration: none;
  background: #fff; padding: 8px 14px; border-radius: 10px;
  box-shadow: 0 4px 14px rgba(8,12,22,0.18);
}
.lp-mini-logo { height: 30px; width: auto; display: block; }
.lp-mini-phone {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 10px 18px; border-radius: 999px;
  background: var(--navy); color: #fff !important;
  font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
  text-decoration: none; transition: background .2s ease, transform .2s ease;
}
.lp-mini-phone:hover { background: #08213d; transform: translateY(-1px); }
.lp-mini-phone svg { flex-shrink: 0; }
@media (max-width: 720px) {
  .lp-mini-header-inner { padding: 14px 0; }
  .lp-mini-logo { height: 24px; }
  .lp-mini-brand { padding: 6px 10px; }
  .lp-mini-phone { padding: 9px 14px; font-size: 13px; }
  .lp-mini-phone-label { display: none; }
}

/* Calculator-CTA banner (boven final CTA) — zelfde patroon als /lp/dakwerken */
.rzd-calc-cta-section { padding: 32px 0 8px; background: var(--bg); }
.rzd-calc-cta {
  display: grid; grid-template-columns: auto 1fr auto; gap: 22px;
  align-items: center; max-width: 920px; margin: 0 auto;
  background: linear-gradient(135deg, #fff 0%, #fff8ec 100%);
  border: 1.5px solid rgba(217,140,3,0.32); border-radius: 18px;
  padding: 22px 28px; text-decoration: none;
  box-shadow: 0 10px 32px -14px rgba(217,140,3,0.25);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.rzd-calc-cta:hover {
  transform: translateY(-3px); border-color: #d98c03;
  box-shadow: 0 16px 40px -16px rgba(217,140,3,0.45);
}
.rzd-calc-cta-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: #d98c03; color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; box-shadow: 0 8px 20px -8px rgba(217,140,3,0.55);
}
.rzd-calc-cta-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.rzd-calc-cta-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: #d98c03;
}
.rzd-calc-cta-title {
  font-family: var(--font-display); font-size: clamp(18px, 2.2vw, 22px);
  font-weight: 700; color: var(--navy); line-height: 1.25;
}
.rzd-calc-cta-em {
  background: linear-gradient(transparent 62%, rgba(217,140,3,0.32) 62%);
  padding: 0 3px;
}
.rzd-calc-cta-sub { font-size: 13.5px; color: var(--ink-soft); line-height: 1.5; }
.rzd-calc-cta-sub strong { color: var(--navy); font-weight: 700; }
.rzd-calc-cta-arrow {
  width: 44px; height: 44px; border-radius: 50%;
  background: #d98c03; color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: transform .25s ease;
}
.rzd-calc-cta:hover .rzd-calc-cta-arrow { transform: translateX(4px); }
@media (max-width: 720px) {
  .rzd-calc-cta { grid-template-columns: auto 1fr; padding: 18px 20px; }
  .rzd-calc-cta-arrow { display: none; }
  .rzd-calc-cta-icon { width: 44px; height: 44px; }
}

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
