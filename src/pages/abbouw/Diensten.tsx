import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import hero from '@/assets/home/hero-diensten.jpg';
import svcConstruct from '@/assets/home/svc-construct.jpg';
import svcEco from '@/assets/home/svc-eco.jpg';
import svcInterieur from '@/assets/home/svc-interieur.jpg';
import svcDak from '@/assets/home/svc-dak.jpg';
import svcBad from '@/assets/home/svc-bad.jpg';
import svcGevel from '@/assets/home/svc-gevel.jpg';

const services = [
  {
    id: 'construct', img: svcConstruct, n: '01', title: 'AB Construct',
    tag: 'Algemene aanneming',
    intro: 'Onze hoofddivisie voor nieuwbouwwoningen, totaalrenovaties en aanbouwen. Wij coördineren alle bouwfases, van vergunning tot oplevering, met eigen metselaars en een vaste projectleider.',
    deep: 'AB Construct is verantwoordelijk voor circa 60% van onze omzet. We werken voor particulieren die hun gezinswoning bouwen, jonge gezinnen die een rijwoning kopen om volledig te strippen, en eigenaars die een waardevolle woning grondig willen aanpakken zonder de charme te verliezen. Onze projectleider blijft uw contactpersoon van het allereerste plaatsbezoek tot één jaar na oplevering.',
    bullets: [
      'Sleutel-op-de-deur woningen vanaf 180 m²',
      'Totaalrenovaties tot op de ruwe muren',
      'Aanbouwen, dakopbouwen en kelderuitbreidingen',
      'Coördinatie met uw architect of via onze huisarchitect',
      'Vergunning, EPB-verslag en oplevering inbegrepen',
    ],
    href: '/construct',
  },
  {
    id: 'ecologisch', img: svcEco, n: '02', title: 'AB Ecologisch',
    tag: 'Duurzaam bouwen',
    intro: 'Energetische renovaties en bio-ecologisch bouwen. Warmtepomp, dak- en spouwisolatie, kalkpleister, houtskeletbouw en zonnepanelen, alles in één dossier, met de premieaanvraag inbegrepen.',
    deep: 'Sinds 2022 is AB Ecologisch onze snelst groeiende divisie. De reden is simpel: een goed geïsoleerde woning met warmtepomp betaalt zichzelf terug op vijf tot zeven jaar via de lagere energiefactuur en de Mijn VerbouwPremie. Wij berekenen vooraf het exacte rendement op basis van uw EPC-attest en geven u één offerte voor het volledige pakket.',
    bullets: [
      'Lucht/water-warmtepompen (Daikin, Mitsubishi, Vaillant)',
      'Dakisolatie PIR/PUR/cellulose, K-waarde tot K30',
      'Spouwmuurisolatie en na-isolatie buitengevels',
      'Houtskeletbouw en strobalenbouw op aanvraag',
      'Premiedossier Mijn VerbouwPremie + Fluvius',
    ],
    href: '/ecologisch',
  },
  {
    id: 'interieur', img: svcInterieur, n: '03', title: 'AB Interieurwerken',
    tag: 'Afwerking & maatwerk',
    intro: 'De afwerkingsdivisie. Gyprocwanden en -plafonds, parket en laminaat, binnendeuren, trappen en maatwerkmeubilair. Strak afgewerkt, met onzichtbare aansluitingen.',
    deep: 'Een ruwbouw is pas een woning na de afwerking. Onze plaatsers werken al meer dan tien jaar samen en kennen elkaars kwaliteitsstandaard. Wij plaatsen geen vloer over een ondergrond die niet vlak is, en geen gyproc op een wand die niet recht staat, als de basis niet klopt, lossen we het eerst op in plaats van het te verbergen.',
    bullets: [
      'Gyproc enkele en dubbele wanden, akoestisch geïsoleerd',
      'Verlaagde plafonds met inbouwspots en ledstrips',
      'Parket: massief, meerlaags, visgraat, kuierplank',
      'Maatwerk: dressings, inbouwkasten, TV-meubels',
      'Binnendeuren in stomp of opdek, eigen schrijnwerker',
    ],
    href: '/interieur',
  },
  {
    id: 'dakwerken', img: svcDak, n: '04', title: 'AB Dakwerken',
    tag: 'Dak & isolatie',
    intro: 'Hellende daken (pannen, leien, zink), platte daken (EPDM, bitumen, roofing), dakisolatie en zinkwerk, uitgevoerd door onze eigen dakploeg.',
    deep: 'Een dak is zichtbaar pas na vijftien jaar of bij de eerste lekkage, dan moet het werk dat veertien jaar eerder geleverd werd, het bewijs zijn. Wij werken uitsluitend met merken die wij ook onder onze eigen verzekeringspolis durven plaatsen: Wienerberger en Koramic voor pannen, Firestone en Carlisle voor EPDM, VMZinc voor zinkwerk.',
    bullets: [
      'Volledig vernieuwen van pannendaken',
      'Plaatsen platte daken in EPDM één stuk (geen lassen)',
      'Dakisolatie tot K-peil <K30 (premiegerechtigd)',
      'Zinkwerk: dakgoten, mastgoten, kilgoten, slabben',
      'Dakvensters Velux & Fakro, dakkapellen op maat',
    ],
    href: '/dakwerken',
  },
  {
    id: 'bad', img: svcBad, n: '05', title: 'AB Bad & Wellness',
    tag: 'Sleutel-op-de-deur badkamer',
    intro: 'Sleutel-op-de-deur badkamers. Sloop, leidingwerk, vloerverwarming, tegels, sanitair en verlichting, door één coördinator, klaar in vier tot zes weken.',
    deep: 'De badkamer is het meest gebruikte luxe-element van de woning. Een goed ontworpen badkamer maakt elke ochtend prettiger; een slecht ontworpen badkamer ergert u tien jaar lang. Wij beginnen met een 3D-ontwerp waarin u de afmetingen, materialen en lichtval kunt zien voor er één tegel besteld wordt.',
    bullets: [
      '3D-ontwerp voor goedkeuring vóór bestelling',
      'Vloerverwarming standaard inbegrepen',
      'Tegels: keramiek, natuursteen, microcement',
      'Inloopdouches, vrijstaande baden, regendouches',
      'Sanitair Villeroy & Boch, Hansgrohe, Geberit',
    ],
    href: '/bad',
  },
  {
    id: 'gevel', img: svcGevel, n: '06', title: 'AB Gevelbekleding',
    tag: 'Gevels & buitenmuren',
    intro: 'Gevelrenovatie en -bekleding. Crepi, steenstrips, hout, composiet, vezelcement of natuursteen. Met of zonder bijkomende buitenisolatie (na-isolatie).',
    deep: 'Een gerenoveerde gevel verhoogt direct de waarde en de uitstraling van uw woning. Combineer dit met buitenisolatie (ETICS) en u behaalt vaak in één werk een hogere energieklasse plus een nieuwe esthetiek. Wij begeleiden ook de stedenbouwkundige aanvraag wanneer de gevel zichtbaar wijzigt.',
    bullets: [
      'Crepi (mineraal, silicaat, siliconen) op isolatie of muur',
      'Steenstrips (keramiek of klei) ter vervanging van metselwerk',
      'Houten gevels in lariks, ceder of thermohout',
      'Composietplaten (Trespa, Rockpanel, Eternit)',
      'Buitenisolatie ETICS, energieklasse-stijging',
    ],
    href: '/gevel',
  },
];

const HTML = `
${buildNav('diensten')}

${buildHero({
  bg: hero,
  eyebrow: 'Onze diensten',
  title: 'Zes specialisaties.<br/>Eén bouwpartner.',
  lede: "Elke divisie heeft een eigen vakploeg en projectleider. Hieronder vindt u per discipline wat we doen, voor wie, en welke materialen we standaard gebruiken. Klik door naar een divisie voor realisaties en gedetailleerde informatie.",
  primary: { label: 'Vraag een plaatsbezoek aan', href: '/contact' },
  secondary: { label: 'Onze werkwijze →', href: '/werkwijze' },
})}

<!-- TOC -->
<section class="lf-section" style="padding: 36px 0 0;">
  <div class="wrap">
    <div class="ab-toc-wrap">
      <nav class="ab-toc" aria-label="Diensten overzicht">
        ${services.map(s => `<a href="#${s.id}">${s.title}</a>`).join('')}
        <a href="#faq">Veelgestelde vragen</a>
      </nav>
    </div>
  </div>
</section>

<!-- DEEP SERVICE BLOCKS -->
<section class="lf-section ab-svc-section" style="padding-top: 24px;">
  <div class="wrap">
    <div class="ab-svc-track" id="abSvcTrack">
      ${services.map((s, i) => `
        <div class="ab-sub ab-svc-slide" id="${s.id}">
          <div class="ab-deep ${i % 2 === 1 ? 'reverse' : ''}" data-reveal>
            <div>
              <span class="ab-deep-tag">${s.tag} · ${s.n}</span>
              <h3>${s.title}</h3>
              <p>${s.intro}</p>
              <details class="ab-more">
                <summary>Meer details</summary>
                <p>${s.deep}</p>
                <ul class="ab-checks">
                  ${s.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </details>
              <div style="margin-top: 24px;">
                <a href="${s.href}" class="lf-cta-pill">
                  <span>Meer over ${s.title}</span>
                  <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
                </a>
              </div>
            </div>
            <div class="ab-deep-img"><img src="${s.img}" alt="${s.title}" loading="lazy"/></div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="ab-svc-dots" id="abSvcDots" aria-hidden="true">
      ${services.map((_, i) => `<button type="button" class="ab-svc-dot${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-label="Dienst ${i + 1}"></button>`).join('')}
    </div>
  </div>
</section>

<style>
@media (max-width: 768px) {
  .ab-svc-section .wrap { padding-left: 0 !important; padding-right: 0 !important; }
  .ab-svc-track {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    gap: 14px;
    padding: 4px 18px 8px;
    scrollbar-width: none;
  }
  .ab-svc-track::-webkit-scrollbar { display: none; }
  .ab-svc-track > .ab-svc-slide {
    flex: 0 0 86%;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    margin: 0 !important;
  }
  .ab-svc-track .ab-deep {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
    background: #fff;
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 10px 30px -18px rgba(10,22,40,0.18);
    height: 100%;
  }
  .ab-svc-track .ab-deep.reverse { flex-direction: column !important; }
  .ab-svc-track .ab-deep-img { order: -1; }
  .ab-svc-track .ab-deep-img img { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; }
  .ab-svc-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 14px 0 4px;
  }
  .ab-svc-dot {
    width: 8px; height: 8px; border-radius: 999px;
    background: rgba(10,22,40,0.18);
    border: 0; padding: 0; cursor: pointer;
    transition: background 0.2s, width 0.2s;
  }
  .ab-svc-dot.is-active { background: hsl(var(--accent)); width: 22px; }
}
@media (min-width: 769px) {
  .ab-svc-dots { display: none; }
}
</style>

<!-- WHAT'S ALWAYS INCLUDED -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Bij elke opdracht</span>
      <h2 class="lf-h2">Wat altijd inbegrepen is.</h2>
      
    </div>
    <div class="ab-incl ab-incl-single">
      <div class="ab-incl-card yes" data-reveal>
        <h4>Standaard inbegrepen</h4>
        <ul>
          <li>Plaatsbezoek en offerte op maat</li>
          <li>Vaste projectleider als aanspreekpunt</li>
          <li>Werfopruim op vrijdagavond</li>
          <li>Wekelijks werfrapport met foto's</li>
          <li>Stortkosten en afvalcontainer</li>
          <li>Beschermingsmateriaal (vloeren, meubilair)</li>
          <li>Indienen Mijn VerbouwPremie</li>
          <li>10-jarige aansprakelijkheid &amp; verzekering</li>
          <li>Oplevering met opleveringsverslag</li>
          <li>Nacontrole 1 jaar na oplevering</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- SUPPORT TRIPLE -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Ondersteuning van A tot Z</span>
      <h2 class="lf-h2">Wij nemen u álles uit handen,<br/>ook wat niet zichtbaar is.</h2>
    </div>
    <div class="lf-support-grid">
      <div class="lf-support-card" data-reveal>
        <div class="lf-support-meta"><span>01</span> Vergunningen</div>
        <h5>Stedenbouwkundige vergunning</h5>
        <p>Wij stellen het dossier op, dienen in via Omgevingsloket en volgen op tot goedkeuring. Doorlooptijd: 75 dagen voor een gewone aanvraag, 105 dagen bij openbaar onderzoek.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="1">
        <div class="lf-support-meta"><span>02</span> Premies</div>
        <h5>Mijn VerbouwPremie &amp; Fluvius</h5>
        <p>We berekenen vooraf op welke premies u recht heeft (dak, muur, glas, warmtepomp, ventilatie) en dienen de aanvraag in. Gemiddeld €4.200 terug per renovatieproject.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="2">
        <div class="lf-support-meta"><span>03</span> Nazorg</div>
        <h5>Service na oplevering</h5>
        <p>Eén jaar na oplevering komen we gratis langs voor een nacontrole, krimpscheuren, deuren bijregelen, voegen controleren. Klacht? Reactie binnen 48 uur, ook na de garantieperiode.</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section lf-tone-soft" id="faq">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Veelgestelde vragen</span>
      <h2 class="lf-h2">Wat klanten ons<br/>vooraf vragen.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Werken jullie ook samen met mijn eigen architect?</summary><div class="ab-faq-body"><p>Ja, in ongeveer 70% van onze projecten werken we met de architect van de klant. We coördineren de uitvoeringsplannen, plannen werfvergaderingen mee en bezorgen de architect alle documenten voor de oplevering. Heeft u nog geen architect, dan kunnen we onze huisarchitect voorstellen.</p></div></details>
      <details data-reveal><summary>Hoe lang op voorhand moet ik reserveren?</summary><div class="ab-faq-body"><p>Voor een badkamer- of interieurproject rekenen we doorgaans 4 tot 8 weken tussen contracttekening en start werf. Voor totaalrenovaties of nieuwbouw rekenen we 3 tot 5 maanden, omdat vergunning, materiaalbestelling en planning meer tijd vergen. Spoedopdrachten kunnen we soms tussenschuiven, vraag het bij uw plaatsbezoek.</p></div></details>
      <details data-reveal><summary>Krijg ik één prijs voor het volledige project?</summary><div class="ab-faq-body"><p>Ja. Wij geven één bindende offerte met meetstaat, ook als meerdere divisies betrokken zijn. U krijgt geen aparte rekeningen van metselaar, dakwerker en tegelzetter, alles loopt via AB Bouw Group, met één factuur per fase.</p></div></details>
      <details data-reveal><summary>Wat als er onverwachte problemen opduiken tijdens de werf?</summary><div class="ab-faq-body"><p>Bij renovaties is dat soms onvermijdelijk: een verrotte balk, asbest in de oude vloer, een oude septische put. Wij stoppen dan de werf, documenteren het probleem met foto's, en geven u binnen 48 uur een aparte offerte voor het meerwerk. U beslist of we het meenemen of niet, pas na uw goedkeuring gaan we verder.</p></div></details>
      <details data-reveal><summary>Mag ik tijdens de werf op de werf komen?</summary><div class="ab-faq-body"><p>Uiteraard. We organiseren elke twee weken een werfvergadering waarop u welkom bent. Daarbuiten kan u na afspraak met de projectleider altijd langs. Veiligheidsschoenen en helm hebben we voor u klaar liggen.</p></div></details>
      <details data-reveal><summary>Wat als ik niet tevreden ben met een afgewerkt detail?</summary><div class="ab-faq-body"><p>Bij de oplevering maken we een lijst van eventuele punten ("verfopstoot in hoek", "deur sluit niet vlot"). Die punten lossen we op vóór de eindfactuur. Daarna geldt de wettelijke 10-jarige aansprakelijkheid op stabiliteit en waterdichtheid, plus 2 jaar op afwerking.</p></div></details>
      <details data-reveal><summary>Werken jullie ook in Brussel en buiten Vlaanderen?</summary><div class="ab-faq-body"><p>We bedienen heel Vlaanderen en het Brussels Hoofdstedelijk Gewest. Voor projecten in Wallonië maken we een uitzondering bij grote opdrachten (>€250k) of voor terugkerende klanten. Vraag het na bij uw plaatsbezoek.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Niet zeker welke divisie u nodig heeft?', 'Bel ons of vraag een gratis plaatsbezoek aan. Wij adviseren eerlijk welke ploegen het best aansluiten bij uw plannen, ook als dat betekent dat u maar één divisie nodig heeft.')}

${FOOTER}
`;

export default function Diensten() {
  useEffect(() => {
    document.title = "Diensten | AB Bouw Group | 6 bouwspecialisaties onder één dak";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Construct, Ecologisch, Interieur, Dakwerken, Bad & Wellness, Gevelbekleding, alles onder één projectleider, één offerte, één factuur.");
    const prev = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prev; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();

  useEffect(() => {
    const track = document.getElementById('abSvcTrack');
    const dotsWrap = document.getElementById('abSvcDots');
    if (!track || !dotsWrap) return;
    const dots = Array.from(dotsWrap.querySelectorAll<HTMLButtonElement>('.ab-svc-dot'));
    const slides = Array.from(track.querySelectorAll<HTMLElement>('.ab-svc-slide'));
    if (!slides.length) return;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    const setActive = (i: number) => {
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!isMobile()) return;
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        slides.forEach((s, k) => {
          const c = s.offsetLeft + s.offsetWidth / 2;
          const d = Math.abs(c - center);
          if (d < bestDist) { bestDist = d; best = k; }
        });
        setActive(best);
      });
    };

    track.addEventListener('scroll', onScroll, { passive: true });

    const onDotClick = (e: Event) => {
      const btn = (e.currentTarget as HTMLButtonElement);
      const i = Number(btn.dataset.i || 0);
      const s = slides[i];
      if (!s) return;
      const left = s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2;
      track.scrollTo({ left, behavior: 'smooth' });
    };
    dots.forEach(d => d.addEventListener('click', onDotClick));

    // Hijack TOC clicks on mobile so anchor links scroll the carousel instead of the page
    const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.ab-toc a'));
    const onTocClick = (e: Event) => {
      if (!isMobile()) return;
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const id = href.slice(1);
      const idx = slides.findIndex(s => s.id === id);
      if (idx < 0) return;
      e.preventDefault();
      const s = slides[idx];
      const left = s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2;
      track.scrollTo({ left, behavior: 'smooth' });
      track.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    tocLinks.forEach(a => a.addEventListener('click', onTocClick));

    return () => {
      track.removeEventListener('scroll', onScroll);
      dots.forEach(d => d.removeEventListener('click', onDotClick));
      tocLinks.forEach(a => a.removeEventListener('click', onTocClick));
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
