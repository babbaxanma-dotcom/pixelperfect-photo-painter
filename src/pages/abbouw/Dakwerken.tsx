import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import heroImg from '@/assets/home/svc-dak.jpg';
import imgPannen from '@/assets/dak/hellend-pannen.jpg';
import imgLeien from '@/assets/dak/leien.jpg';
import imgEpdm from '@/assets/dak/plat-epdm.jpg';
import imgIsolatie from '@/assets/dak/dakisolatie.jpg';
import imgZink from '@/assets/dak/zinkwerk.jpg';
import imgRaam from '@/assets/dak/dakraam.jpg';
import imgIntro from '@/assets/dak/intro-overview.jpg';
import imgBitumen from '@/assets/dak/bitumen.jpg';

const types = [
  {
    id: 'pannen', img: imgPannen, tag: 'Hellend dak',
    title: 'Pannendaken',
    intro: 'Het klassieke Vlaamse dak. Gebakken keramische of betonpannen op tengels en panlatten, met onderdak en isolatie.',
    specs: [
      ['Materialen', 'Wienerberger, Koramic, Eternit'],
      ['Levensduur', '50 tot 80 jaar'],
      ['Isolatie K-peil', 'tot K30 mogelijk'],
      ['Helling', '20° tot 60°'],
      ['Premie', 'Tot €40/m² dakisolatie'],
      ['Doorlooptijd', '8 tot 14 werkdagen'],
    ],
    bullets: [
      'Volledige strip-and-rebuild of gedeeltelijke vervanging',
      'Onderdak in HDPE-folie of houtvezelplaat',
      'Inclusief nieuwe panlatten, tengels en hulpstukken',
      'Pannen in rood, antraciet, leikleur of zwart',
    ],
  },
  {
    id: 'leien', img: imgLeien, tag: 'Hellend dak',
    title: 'Natuurleien & kunstleien',
    intro: 'Strakke esthetiek voor moderne en klassieke architectuur. Natuurleien (Spaans, Welsh) of kunstleien in vezelcement.',
    specs: [
      ['Materialen', 'Cupa Pizarras, Eternit, Cembrit'],
      ['Levensduur', '60 tot 100 jaar (natuurlei)'],
      ['Plaatsing', 'Diamant of vierkant patroon'],
      ['Helling', 'minimum 25°'],
      ['Premie', 'Tot €40/m² dakisolatie'],
      ['Doorlooptijd', '10 tot 18 werkdagen'],
    ],
    bullets: [
      'Plaatsing met koperen of RVS leihaken',
      'Geschikt voor pastoriewoningen en moderne villa\'s',
      'Onderhoudsarm en kleurvast',
      'Combineerbaar met zinken nokafwerking',
    ],
  },
  {
    id: 'epdm', img: imgEpdm, tag: 'Plat dak',
    title: 'Plat dak in EPDM',
    intro: 'Eén stuk synthetisch rubber over uw volledig dak. Geen lassen, geen naden, geen lekrisico aan verbindingen.',
    specs: [
      ['Materialen', 'Firestone RubberCover, Carlisle'],
      ['Levensduur', '50+ jaar (gegarandeerd)'],
      ['Dikte', '1,2 of 1,5 mm'],
      ['Isolatie', 'PIR 100 tot 180 mm'],
      ['Premie', 'Tot €40/m² dakisolatie'],
      ['Doorlooptijd', '4 tot 8 werkdagen'],
    ],
    bullets: [
      'Eén membraan op maat gesneden, geen naden',
      'Volledig verlijmd of mechanisch bevestigd',
      'Met nieuwe PIR-isolatie en dampscherm',
      'Aluminium daktrim en nieuwe afvoerputten',
    ],
  },
  {
    id: 'bitumen', img: imgBitumen, tag: 'Plat dak',
    title: 'Bitumen warmdak',
    intro: 'Tweelaagse roofing met onder- en bovenbaan. De bewezen oplossing voor grote oppervlakten en daken met installaties.',
    specs: [
      ['Materialen', 'Soprema, Iko, Derbigum'],
      ['Levensduur', '25 tot 35 jaar'],
      ['Opbouw', 'Dampscherm + PIR + 2 lagen bitumen'],
      ['Afwerking', 'Met of zonder leislag'],
      ['Premie', 'Tot €40/m² dakisolatie'],
      ['Doorlooptijd', '5 tot 10 werkdagen'],
    ],
    bullets: [
      'Geschikt voor begaanbare daken en groendaken',
      'Bovenste laag met leisteengranulaat (UV-bescherming)',
      'Goed bestand tegen mechanische belasting',
      'Eenvoudig herstelbaar bij beschadiging',
    ],
  },
  {
    id: 'isolatie', img: imgIsolatie, tag: 'Energie',
    title: 'Dakisolatie',
    intro: 'De renovatiemaatregel met de snelste terugverdientijd. Tot 30% van uw warmteverlies gebeurt via een slecht geïsoleerd dak.',
    specs: [
      ['Materialen', 'PIR, PUR, glaswol, cellulose'],
      ['Diktes', '120 tot 240 mm'],
      ['λ-waarde', '0,022 (PIR) tot 0,040 (glaswol)'],
      ['Plaatsing', 'Tussen kepers of op kepers (sarking)'],
      ['Premie', 'Mijn VerbouwPremie tot €40/m²'],
      ['Doorlooptijd', '2 tot 6 werkdagen'],
    ],
    bullets: [
      'Vooraf advies over dampscherm en luchtdichtheid',
      'Premiedossier door ons ingediend',
      'Combineerbaar met dakvervanging (sarking)',
      'EPC-stijging gemiddeld 80 punten',
    ],
  },
  {
    id: 'zink', img: imgZink, tag: 'Afwerking',
    title: 'Zinkwerk &amp; dakgoten',
    intro: 'Dakgoten, regenpijpen, kilgoten en boordafwerkingen in natuurzink. Strak, duurzaam en weinig onderhoud.',
    specs: [
      ['Materialen', 'VMZinc, NedZink, RheinZink'],
      ['Levensduur', '60 tot 80 jaar'],
      ['Profielen', 'Bakgoot, hanggoot, kraalgoot'],
      ['Diktes', '0,7 of 0,8 mm'],
      ['Verbindingen', 'Gesoldeerd, geen siliconen'],
      ['Doorlooptijd', '2 tot 5 werkdagen'],
    ],
    bullets: [
      'Op maat geplooid in eigen atelier',
      'Gesoldeerde verbindingen i.p.v. lijm of silicone',
      'Verborgen bevestiging voor strakke look',
      'Combineerbaar met natuurzinken regenpijpen',
    ],
  },
  {
    id: 'dakraam', img: imgRaam, tag: 'Lichtinval',
    title: 'Dakvensters &amp; dakkapellen',
    intro: 'Velux of Fakro dakvensters geplaatst door eigen vakmensen, of een dakkapel op maat voor maximale ruimtewinst.',
    specs: [
      ['Merken', 'Velux, Fakro, Roto'],
      ['Types', 'Tuimel, klap-tuimel, schuif'],
      ['Beglazing', 'HR++ of HR+++'],
      ['Bediening', 'Manueel of elektrisch'],
      ['Premie', 'Mogelijk via beglazingspremie'],
      ['Doorlooptijd', '2 tot 4 dagen per venster'],
    ],
    bullets: [
      'Inclusief gootstuk, isolatieframe en binnenafwerking',
      'Met buitenzonwering of rolluik op aanvraag',
      'Dakkapellen tot 4 m breed mogelijk',
      'Eigen schrijnwerker voor de binnenafwerking',
    ],
  },
];

const HTML = `
${buildNav('diensten')}

${buildHero({
  bg: heroImg,
  eyebrow: '04 · Daken & isolatie',
  title: 'Hellende en platte daken,<br/>door <span style="color:var(--accent)">eigen dakdekkers</span>.',
  lede: 'Volledige dakvervanging, dakisolatie, zinkwerk en dakgoten. Onze <span class="ab-hl" data-hl-delay="0">vaste dakploeg</span> staat <span class="ab-hl" data-hl-delay="1">12 maanden per jaar</span> op de werf, zonder wachtlijsten van weken.',
  primary: { label: 'Vraag dakinspectie aan', href: '/contact' },
  secondary: { label: 'Bekijk realisaties →', href: '/realisaties' },
})}

<!-- INTRO + USP -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">AB Dakwerken</span>
        <h2 class="lf-h2">Een dak is geen<br/><span class="ab-mark">quick fix</span>.</h2>
        <p class="lf-lede">We bekijken uw dak als <span class="ab-hl" data-hl-delay="0">systeem</span>, niet als losse pannen. <span class="ab-hl" data-hl-delay="1">Eerlijk advies</span> over wat écht nodig is. Actief in Willebroek, Mechelen, Antwerpen, Lier, Bornem en heel Vlaanderen.</p>
        <ul class="ab-checks" style="margin-top:18px;">
          <li>Eigen ploeg van 6 vaste dakdekkers</li>
          <li>Gratis dakinspectie met fotorapport</li>
          <li>10-jaar garantie op waterdichtheid</li>
          <li>Aanvraag Mijn VerbouwPremie inbegrepen</li>
        </ul>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgIntro}" alt="Overzicht dak" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- TOC -->
<section class="lf-section" style="padding: 0 0 12px;">
  <div class="wrap">
    <div class="ab-toc-wrap">
      <nav class="ab-toc" aria-label="Type daken">
        ${types.map(t => `<a href="#${t.id}">${t.title.replace('&amp;', '&')}</a>`).join('')}
      </nav>
    </div>
  </div>
</section>

<!-- DAK TYPES -->
<section class="lf-section" style="padding-top: 24px;">
  <div class="wrap">
    <div class="dak-grid">
      ${types.map(t => `
        <article class="dak-card" id="${t.id}" data-reveal>
          <div class="dak-card-img"><img src="${t.img}" alt="${t.title}" loading="lazy"/><span class="dak-card-tag">${t.tag}</span></div>
          <div class="dak-card-body">
            <h3>${t.title}</h3>
            <p>${t.intro}</p>
            <ul class="ab-checks" style="margin: 14px 0 0;">
              ${t.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
            <details class="ab-more" style="margin-top: 16px;">
              <summary>Specificaties bekijken</summary>
              <table class="dak-spec">
                <tbody>
                  ${t.specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
                </tbody>
              </table>
            </details>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<!-- LEKKAGE / EERSTE HULP -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Spoed &amp; lekkage</span>
        <h2 class="lf-h2">Lek vandaag?<br/>Wij vandaag.</h2>
        <p class="lf-lede">Bij stormschade of acute lekkage werken we met voorrang. Binnen 24 uur een tijdelijke waterdichting, daarna plannen we de definitieve herstelling rustig in.</p>
        <div style="margin-top: 22px;">
          <a href="tel:+32470634413" class="lf-cta-pill">
            <span>Bel noodnummer</span>
            <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
          </a>
        </div>
      </div>
      <div data-reveal data-reveal-delay="1">
        <table class="ab-spec">
          <thead><tr><th>Type schade</th><th>Reactie</th></tr></thead>
          <tbody>
            <tr><td>Acute lekkage / stormschade</td><td>Binnen 24 uur ter plaatse</td></tr>
            <tr><td>Verdwenen pannen</td><td>Binnen 3 werkdagen</td></tr>
            <tr><td>Lekkende dakgoot</td><td>Binnen 5 werkdagen</td></tr>
            <tr><td>Algemene dakinspectie</td><td>Binnen 10 werkdagen</td></tr>
            <tr><td>Voorbereiding renovatie</td><td>Op afspraak</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<!-- PROCES -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Hoe we te werk gaan</span>
      <h2 class="lf-h2">Van inspectie tot<br/>oplevering.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal><div class="ab-flow-num">STAP 01</div><h5>Dakinspectie</h5><p>Gratis bezoek met fotorapport en eerlijke diagnose. Geen verkoopgesprek.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1"><div class="ab-flow-num">STAP 02</div><h5>Offerte &amp; advies</h5><p>Vaste prijs met opties: enkel herstellen vs. volledige renovatie.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2"><div class="ab-flow-num">STAP 03</div><h5>Werf weersafhankelijk</h5><p>Planning met buffer voor regen. Dak nooit langer dan 24u open.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3"><div class="ab-flow-num">STAP 04</div><h5>Oplevering</h5><p>Lekvrij verklaard, garantieattesten en premiedossier in orde.</p></div>
    </div>
  </div>
</section>

<!-- WAT INBEGREPEN -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Bij elk dakproject</span>
      <h2 class="lf-h2">Wat altijd in onze prijs zit.</h2>
    </div>
    <div class="ab-incl ab-incl-single">
      <div class="ab-incl-card yes" data-reveal>
        <h4>Standaard inbegrepen</h4>
        <ul>
          <li>Gratis vooronderzoek met fotorapport</li>
          <li>Stelling of hoogwerker (afhankelijk van situatie)</li>
          <li>Beschermingszeil en buurtbescherming</li>
          <li>Afvoer en stortkosten oude dakbedekking</li>
          <li>Volledige onderkant: tengels, panlatten, onderdak</li>
          <li>Indienen Mijn VerbouwPremie</li>
          <li>10-jaar garantie waterdichtheid</li>
          <li>Eindcontrole met thermografisch beeld (op vraag)</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Veelgestelde vragen</span>
      <h2 class="lf-h2">Over dakwerken.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Hoe lang duurt een volledige dakvervanging?</summary><div class="ab-faq-body"><p>Een gemiddelde gezinswoning (ca. 100 m²) doen we in 8 tot 14 werkdagen. Bij regen werken we niet aan een open dak, daarom plannen we 2 tot 3 reservedagen in.</p></div></details>
      <details data-reveal><summary>Krijg ik premie voor dakisolatie?</summary><div class="ab-faq-body"><p>Ja, tot €40/m² via Mijn VerbouwPremie (R-waarde minstens 4,5 m²K/W). Wij dienen het dossier voor u in.</p></div></details>
      <details data-reveal><summary>Wat als ik enkel een lekkage heb?</summary><div class="ab-faq-body"><p>Geen probleem. Ongeveer 30% van onze dakopdrachten zijn herstellingen, met dezelfde garantie als grotere werken.</p></div></details>
      <details data-reveal><summary>Hoe lang gaat een nieuw dak mee?</summary><div class="ab-faq-body"><p>Keramische pannen 50–80 jaar, natuurleien 60–100 jaar, EPDM 50+ jaar, bitumen 25–35 jaar, natuurzink 60–80 jaar.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Plan uw dakrenovatie of -inspectie', 'Vraag een gratis dakinspectie aan. Binnen één werkdag krijgt u antwoord van een vakmens. Bij acute lekkage staan we binnen 24 uur ter plaatse.')}

${FOOTER}

<style>
.dak-grid { display: grid; grid-template-columns: 1fr; gap: 36px; }
.dak-card { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 18px; overflow: hidden; display: grid; grid-template-columns: 1fr 1.2fr; align-items: start; box-shadow: 0 14px 40px -28px rgba(10,22,40,0.18); transition: box-shadow 0.3s, transform 0.3s; }
.dak-card:hover { box-shadow: 0 24px 60px -28px rgba(10,22,40,0.28); transform: translateY(-2px); }
.dak-card:nth-child(even) { grid-template-columns: 1.2fr 1fr; }
.dak-card:nth-child(even) .dak-card-img { order: 2; }
.dak-card-img { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.dak-card-img img { width:100%; height:100%; object-fit: cover; display:block; transition: transform 0.6s var(--ease); }
.dak-card:hover .dak-card-img img { transform: scale(1.04); }
.dak-card-tag { position: absolute; top: 18px; left: 18px; padding: 6px 12px; background: #fff; color: var(--navy); border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; box-shadow: 0 6px 16px -4px rgba(10,22,40,0.25); }
.dak-card-body { padding: 36px 40px; display:flex; flex-direction:column; }
.dak-card-body h3 { font-family: var(--font-display); font-size: clamp(22px, 2.4vw, 28px); color: var(--navy); margin-bottom: 12px; font-weight: 600; letter-spacing: -0.01em; }
.dak-card-body > p { font-size: 14.5px; color: var(--ink-soft); line-height: 1.7; margin-bottom: 4px; }
.dak-spec { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: auto; border-top: 1px solid var(--ink-line-soft); }
.dak-spec td { padding: 9px 0; border-bottom: 1px dashed var(--ink-line-soft); vertical-align: top; }
.dak-spec tr:last-child td { border-bottom: none; }
.dak-spec td:first-child { color: var(--ink-mute); font-weight: 600; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; width: 42%; padding-right: 12px; }
.dak-spec td:last-child { color: var(--navy); font-weight: 500; }

@media (max-width: 900px) {
  .dak-card, .dak-card:nth-child(even) { grid-template-columns: 1fr; }
  .dak-card:nth-child(even) .dak-card-img { order: 0; }
  .dak-card-img { min-height: 240px; }
  .dak-card-body { padding: 28px 24px; }
}
</style>
`;

export default function Dakwerken() {
  useEffect(() => {
    document.title = "Dakwerken Mechelen, Antwerpen & Vlaanderen — AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Dakwerken in Willebroek, Mechelen, Antwerpen en heel Vlaanderen. EPDM, leien, pannen, dakisolatie en zinkwerk door eigen dakdekkers. 10 jaar garantie, premiedossier inbegrepen.");

    // Service schema voor lokale SEO
    let ld = document.getElementById('jsonld-service-dakwerken');
    if (!ld) {
      ld = document.createElement('script');
      ld.setAttribute('type', 'application/ld+json');
      ld.id = 'jsonld-service-dakwerken';
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Dakwerken",
        "name": "AB Dakwerken — dakvervanging, dakisolatie en zinkwerk",
        "description": "Hellende daken (pannen, leien) en platte daken (EPDM, bitumen, roofing). Dakisolatie tot K30. Zinkwerk en dakvensters. Eigen vaste dakploeg, 10 jaar garantie.",
        "provider": {
          "@type": "GeneralContractor",
          "name": "AB Bouw Groep",
          "url": "https://abgroep.be/",
          "telephone": "+32470634413",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Industrieweg 14",
            "postalCode": "2830",
            "addressLocality": "Willebroek",
            "addressCountry": "BE"
          }
        },
        "areaServed": [
          { "@type": "City", "name": "Willebroek" },
          { "@type": "City", "name": "Mechelen" },
          { "@type": "City", "name": "Antwerpen" },
          { "@type": "City", "name": "Lier" },
          { "@type": "City", "name": "Bornem" },
          { "@type": "City", "name": "Puurs-Sint-Amands" },
          { "@type": "City", "name": "Sint-Niklaas" },
          { "@type": "City", "name": "Heist-op-den-Berg" },
          { "@type": "AdministrativeArea", "name": "Vlaanderen" }
        ],
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "priceRange": "€€"
        }
      });
      document.head.appendChild(ld);
    }
    const prev = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prev; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
