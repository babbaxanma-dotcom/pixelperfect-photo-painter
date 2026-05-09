import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import heroImg from '@/assets/interieur/hero.jpg';
import imgGyproc from '@/assets/interieur/gyproc.jpg';
import imgPleister from '@/assets/interieur/pleisterwerk.jpg';
import imgParket from '@/assets/interieur/parket.jpg';
import imgGietvloer from '@/assets/interieur/gietvloer.jpg';
import imgMaatkasten from '@/assets/interieur/maatkasten.jpg';
import imgTrap from '@/assets/interieur/trap.jpg';
import imgDeuren from '@/assets/interieur/binnendeuren.jpg';
import imgPlafonds from '@/assets/interieur/plafonds.jpg';
import imgIntro from '@/assets/interieur/intro-overview.jpg';
import imgDroom from '@/assets/interieur/droom.jpg';

const types = [
  {
    id: 'gyproc', img: imgGyproc, tag: 'Wanden',
    title: 'Gyproc & scheidingswanden',
    intro: 'Lichte scheidingswanden, voorzetwanden en akoestische opbouw in metalstud-systeem. Strak afgewerkt tot V3-niveau, klaar voor schilder.',
    specs: [
      ['Materialen', 'Knauf Diamant, Gyproc Habito'],
      ['Wanddikte', '75 / 100 / 125 mm'],
      ['Akoestiek', 'tot 52 dB demping'],
      ['Brandweerstand', 'EI30 tot EI60 mogelijk'],
      ['Afwerking', 'V2 standaard, V3/V4 op vraag'],
      ['Doorlooptijd', '3 tot 8 werkdagen per verdiep'],
    ],
    bullets: [
      'Metaalstud-structuur met minerale wol-isolatie',
      'Dubbele beplating voor extra geluidsdemping',
      'Vochtwerende platen in keuken en badkamer',
      'Versterkte zones voor TV, kasten en sanitair',
    ],
  },
  {
    id: 'pleister', img: imgPleister, tag: 'Wanden',
    title: 'Pleisterwerk & bezetting',
    intro: 'Klassieke binnenbepleistering of decoratief kalkpleister. Strakke wanden zonder voegen, perfect vlak en klaar voor verf, behang of leefkleur.',
    specs: [
      ['Materialen', 'Knauf MP75, Tierrafino kalkpleister'],
      ['Diktes', '8 tot 15 mm'],
      ['Afwerking', 'Glad gepolijst of fijn structuur'],
      ['Droogtijd', '1 dag per mm dikte'],
      ['Toepassing', 'Nieuwbouw, renovatie, restauratie'],
      ['Doorlooptijd', '5 tot 12 werkdagen'],
    ],
    bullets: [
      'Machinaal aangebracht voor strakke vlakheid',
      'Ademende kalkpleister mogelijk voor oude muren',
      'Hoekprofielen in inox of alu voor scherpe lijnen',
      'Vochtregulerend en goed voor binnenklimaat',
    ],
  },
  {
    id: 'parket', img: imgParket, tag: 'Vloeren',
    title: 'Parket & houten vloeren',
    intro: 'Eiken planken of visgraat in massief of meerlaags parket. Op maat geselecteerd, op kepers of vlot zwevend gelegd, naar wens geolied of gelakt.',
    specs: [
      ['Houtsoorten', 'Europees eik, walnoot, essen'],
      ['Patronen', 'Recht, visgraat, Hongaarse punt'],
      ['Diktes', '14 / 15 / 21 mm'],
      ['Afwerking', 'Hardwax-olie of mat lak'],
      ['Onderlaag', 'Geluidsdempend Tredaire of kurk'],
      ['Doorlooptijd', '5 tot 10 werkdagen'],
    ],
    bullets: [
      'Vlakheid van de chape eerst gecontroleerd',
      'Compatibel met vloerverwarming (lage opbouw)',
      'Plinten en overgangsprofielen in zelfde houtsoort',
      'Opname garantie tegen werking eerste jaar',
    ],
  },
  {
    id: 'gietvloer', img: imgGietvloer, tag: 'Vloeren',
    title: 'Gietvloer & microcement',
    intro: 'Naadloze vloer in PU-gietvloer of Beal Mortex microcement. Eén doorlopend vlak van keuken tot badkamer, ideaal in combinatie met vloerverwarming.',
    specs: [
      ['Materialen', 'Beal Mortex, Senso, Sika ComfortFloor'],
      ['Diktes', '2 tot 5 mm'],
      ['Kleuren', '120+ kleurstalen, op maat menging'],
      ['Afwerking', 'Mat, satijn of glanzend'],
      ['Onderhoud', 'Zeepachtige cleaner, geen agressieve chemie'],
      ['Doorlooptijd', '7 tot 14 werkdagen'],
    ],
    bullets: [
      'Egalisatie en primer in onze prijs inbegrepen',
      'Geschikt voor woonkamer, badkamer en trappen',
      'Slijtvast met PU-toplaag (30+ jaar)',
      'Volledige stofarme werf met Festool afzuiging',
    ],
  },
  {
    id: 'maatkasten', img: imgMaatkasten, tag: 'Schrijnwerk',
    title: 'Maatkasten & dressings',
    intro: 'Inbouwkasten, dressings, bibliotheken en TV-meubels uit eigen schrijnwerkerij. Op de millimeter ingemeten, met onzichtbare scharnieren en push-to-open.',
    specs: [
      ['Materialen', 'Eik fineer, MDF gelakt, melamine'],
      ['Beslag', 'Blum, Hettich, soft-close'],
      ['Verlichting', 'LED-strip of spots inbouw'],
      ['Greep', 'Push-to-open of geïntegreerde greep'],
      ['Productie', 'Eigen atelier in Mol'],
      ['Doorlooptijd', '3 tot 5 weken levertijd'],
    ],
    bullets: [
      '3D-tekening en moodboard vooraf goedgekeurd',
      'CNC-gefreesd voor perfecte passing',
      'Onzichtbaar bevestigd, geen plinten of kierjes',
      'Combineerbaar met spiegels en glazen schuifdeuren',
    ],
  },
  {
    id: 'trap', img: imgTrap, tag: 'Schrijnwerk',
    title: 'Trappen op maat',
    intro: 'Zwevende eiken trappen, bordestrappen of klassieke kwarttrappen. Ontworpen op maat van uw casco, geplaatst inclusief glazen of stalen leuning.',
    specs: [
      ['Houtsoorten', 'Massief eik, walnoot, essen'],
      ['Types', 'Zwevend, bordes, spiltrap'],
      ['Tredikte', '40 tot 60 mm massief'],
      ['Leuning', 'Glas, inox of zwart staal'],
      ['Afwerking', 'Geolied, gelakt of geborsteld'],
      ['Doorlooptijd', '6 tot 8 weken'],
    ],
    bullets: [
      'Berekening op maat van trapgat en afstap',
      'Anti-slip frees op vraag',
      'Stalen draagstructuur in eigen atelier gelast',
      'Eindcontrole op kraken en stabiliteit',
    ],
  },
  {
    id: 'deuren', img: imgDeuren, tag: 'Schrijnwerk',
    title: 'Binnendeuren tot plafond',
    intro: 'Hoge stomp-gedraaide deuren tot 2,7 m, vlak afgewerkt met de wand. Onzichtbare scharnieren en magnetisch slot voor een ultra-strakke look.',
    specs: [
      ['Hoogtes', '2,1 / 2,3 / 2,5 / 2,7 m'],
      ['Afwerking', 'Eik, gelakt, gefineerd of folie'],
      ['Scharnieren', 'Onzichtbaar (Tectus, Argenta)'],
      ['Slot', 'Magnetisch of klassiek'],
      ['Kader', 'Stomp inbouw of zonder zichtbaar kader'],
      ['Doorlooptijd', '4 tot 6 weken'],
    ],
    bullets: [
      'Geen omlijsting zichtbaar in de wand',
      'Akoestische deur mogelijk (40 dB)',
      'Brandwerende uitvoering EI30 op vraag',
      'Combineerbaar met taatsdeur of schuifdeur',
    ],
  },
  {
    id: 'plafonds', img: imgPlafonds, tag: 'Plafonds',
    title: 'Verlaagde &amp; akoestische plafonds',
    intro: 'Verlaagde plafonds in gyproc, akoestische panelen of een schaduwvoegplafond. Inclusief integratie van LED-spots, lijnverlichting en ventilatie.',
    specs: [
      ['Systemen', 'Knauf D112, Rockfon Mono Acoustic'],
      ['Verlaging', '10 tot 40 cm'],
      ['Verlichting', 'LED-spots, lijnprofiel, indirect'],
      ['Akoestiek', 'tot αw 0,95 absorptie'],
      ['Inbouw', 'Ventilatie, sprinkler, speakers'],
      ['Doorlooptijd', '3 tot 7 werkdagen'],
    ],
    bullets: [
      'Schaduwvoeg (5 mm) voor strakke aansluiting',
      'Luchtdicht uitgevoerd met BlowerProof',
      'Inspectieluiken op strategische plekken',
      'Bekabeling KNX/domotica voorbereid',
    ],
  },
];

const HTML = `
${buildNav('diensten')}

${buildHero({
  bg: heroImg,
  eyebrow: '03 · Interieurwerken',
  title: 'Strak afgewerkt<br/>tot in de <span style="color:var(--accent)">plint</span>.',
  lede: 'Gyproc, pleisterwerk, vloeren, maatkasten en schrijnwerk. Onze interieurploeg zet de finale toets op uw woning, daar waar het verschil zichtbaar wordt.',
  primary: { label: 'Vraag interieuradvies', href: '/contact' },
  secondary: { label: 'Bekijk realisaties →', href: '/realisaties' },
})}

<!-- INTRO + USP -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">AB Interieurwerken</span>
        <h2 class="lf-h2">Een ruwbouw kan<br/>iedereen leveren.</h2>
        <p class="lf-lede">Een woning die klopt tot in elke hoek vraagt vakmensen die wéken aan dezelfde werf staan en oog hebben voor het detail dat niemand opmerkt, behalve uzelf, elke dag.</p>
        <ul class="ab-checks" style="margin-top:18px;">
          <li>Eigen schrijnwerker met eigen atelier in Mol</li>
          <li>Eén vaste interieurploeg, geen wisselende onderaannemers</li>
          <li>Stofarme werf met Festool afzuiging</li>
          <li>Eindcontrole tot in de plint, schaduwvoeg en silicone</li>
        </ul>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgIntro}" alt="Overzicht interieurafwerking" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- TOC -->
<section class="lf-section" style="padding: 12px 0 12px;">
  <div class="wrap">
    <div class="ab-toc-head" data-reveal>
      <h3 class="ab-toc-title">Spring direct naar een type interieurwerk</h3>
      <p class="ab-toc-sub">Klik op een onderwerp om er meteen naartoe te scrollen.</p>
    </div>
    <div class="ab-toc-wrap">
      <nav class="ab-toc" aria-label="Type interieurwerken">
        ${types.map(t => `<a href="#${t.id}">${t.title.replace('&amp;', '&')}</a>`).join('')}
      </nav>
    </div>
  </div>
</section>

<!-- INTERIEUR TYPES -->
<section class="lf-section" style="padding-top: 24px;">
  <div class="wrap">
    <div class="dak-grid">
      ${types.map(t => `
        <article class="dak-card" id="${t.id}" data-reveal>
          <div class="dak-card-img"><img src="${t.img}" alt="${t.title.replace('&amp;', '&')}" loading="lazy"/><span class="dak-card-tag">${t.tag}</span></div>
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

<!-- BEWOONDE WONING -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Werken in een bewoonde woning</span>
        <h2 class="lf-h2">U blijft wonen,<br/>wij houden het proper.</h2>
        <p class="lf-lede">Renoveren met het gezin nog in huis? Geen probleem. We werken zone per zone, met stofschotten, dagelijkse opkuis en duidelijke afspraken over water, elektriciteit en de keukenpauze.</p>
        <div style="margin-top: 22px;">
          <a href="/contact" class="lf-cta-pill">
            <span>Plan een werfbezoek</span>
            <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
          </a>
        </div>
      </div>
      <div data-reveal data-reveal-delay="1">
        <table class="ab-spec">
          <thead><tr><th>Maatregel</th><th>Wat houdt het in</th></tr></thead>
          <tbody>
            <tr><td>Stofschotten</td><td>Plastic ZipWall tot tegen het plafond</td></tr>
            <tr><td>Loopzones</td><td>Karton + folie van inkom tot werkzone</td></tr>
            <tr><td>Stofafzuiging</td><td>Festool M-klasse op alle elektrisch werktuig</td></tr>
            <tr><td>Dagelijkse opkuis</td><td>Werf veegnet voor de pauze, eindopkuis 's avonds</td></tr>
            <tr><td>Water &amp; stroom</td><td>Steeds aangekondigd 24u op voorhand</td></tr>
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
      <h2 class="lf-h2">Van moodboard tot<br/>silicone-voeg.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal><div class="ab-flow-num">STAP 01</div><h5>Plaatsbezoek</h5><p>Opmeten, luisteren naar uw smaak, fotorapport van de bestaande toestand.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1"><div class="ab-flow-num">STAP 02</div><h5>Moodboard &amp; offerte</h5><p>Materialen, kleuren en 3D-schets. Vaste prijs, geen verrassingen.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2"><div class="ab-flow-num">STAP 03</div><h5>Productie &amp; planning</h5><p>Maatwerk in eigen atelier. Heldere weekplanning aan u bezorgd.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3"><div class="ab-flow-num">STAP 04</div><h5>Plaatsing &amp; oplevering</h5><p>Eén doorlopende werf, eindcontrole tot in de plint en silicone-voeg.</p></div>
    </div>
  </div>
</section>

<!-- WAT INBEGREPEN -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Bij elk interieurproject</span>
      <h2 class="lf-h2">Wat altijd in onze prijs zit.</h2>
    </div>
    <div class="ab-incl ab-incl-single">
      <div class="ab-incl-card yes" data-reveal>
        <h4>Standaard inbegrepen</h4>
        <ul>
          <li>Plaatsbezoek &amp; opmeting met digitale lasermeting</li>
          <li>3D-tekening en moodboard van het eindresultaat</li>
          <li>Stofschotten, loopzones en dagelijkse opkuis</li>
          <li>Festool stofafzuiging (M-klasse) op alle werktuig</li>
          <li>Egalisatie van vloer of muur waar nodig</li>
          <li>Plinten, hoekprofielen en silicone-voegen op kleur</li>
          <li>Afvoer en stortkosten van bouwafval</li>
          <li>Eindcontrole op vlakheid, kraken en luchtdichtheid</li>
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
      <h2 class="lf-h2">Over interieurwerken.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Hoe lang duurt een volledige interieurrenovatie?</summary><div class="ab-faq-body"><p>Een woonkamer doen we in 2 tot 3 weken, een volledig appartement in 6 tot 10 weken, een woning casco-tot-sleutel in 12 tot 20 weken. We bezorgen vooraf een dag-per-dag planning.</p></div></details>
      <details data-reveal><summary>Doen jullie ook keukens en badkamers?</summary><div class="ab-faq-body"><p>Ja. Maatwerkkeukens komen uit ons eigen atelier of via onze vaste keukenpartner. Voor badkamers werken we samen met AB Bad &amp; Wellness, met één contactpersoon voor de hele werf.</p></div></details>
      <details data-reveal><summary>Kan ik blijven wonen tijdens de werken?</summary><div class="ab-faq-body"><p>Bij de meeste renovaties wel. We werken zone per zone met stofschotten, dagelijkse opkuis en plastic loopzones. Water of stroom wordt steeds 24u vooraf aangekondigd.</p></div></details>
      <details data-reveal><summary>Welke vloer past bij vloerverwarming?</summary><div class="ab-faq-body"><p>Microcement (Beal Mortex), tegels en gietvloer geven het hoogste rendement. Parket kan, mits meerlaagse uitvoering met lage thermische weerstand (Rλ &lt; 0,15). We bespreken het bij plaatsbezoek.</p></div></details>
      <details data-reveal><summary>Wat is V3- of V4-afwerking bij gyproc?</summary><div class="ab-faq-body"><p>Dat zijn de Belgische normen voor afwerkingsgraad. V2 is standaard (klaar voor verf), V3 is extra geschuurd en geplamuurd voor satijnverf, V4 is volledig vlak gepleisterd voor strijklicht en hoogglans.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Plan uw interieurrenovatie', 'Vraag een gratis plaatsbezoek aan. Binnen één werkdag krijgt u antwoord van een vakmens, met richtprijs en realistische timing op basis van uw woning.')}

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

export default function Interieur() {
  useEffect(() => {
    document.title = "AB Interieurwerken, gyproc, vloeren, maatkasten & schrijnwerk | AB Bouw Group";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Interieurafwerking door eigen vakmensen: gyproc, pleisterwerk, parket, gietvloer, maatkasten, trappen en hoge binnendeuren. Strak afgewerkt tot in de plint.");
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
