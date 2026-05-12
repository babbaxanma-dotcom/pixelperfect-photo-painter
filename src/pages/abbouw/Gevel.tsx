import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import heroImg from '@/assets/home/svc-gevel.jpg';
import imgIntro from '@/assets/gevel/intro.jpg';
import imgWit from '@/assets/gevel/witte-crepi.jpg';
import imgGrijs from '@/assets/gevel/grijze-crepi.jpg';
import imgSteen from '@/assets/gevel/steenstrips.jpg';
import imgSier from '@/assets/gevel/sierpleister.jpg';
import imgStelling from '@/assets/gevel/stelling.jpg';

const types = [
  {
    id: 'wit', img: imgWit, tag: 'Crepi',
    title: 'Witte crepi',
    intro: 'De klassieker: helder, tijdloos en perfect bij een hedendaagse Vlaamse woning. Mineraal of siliconen, in elke gewenste tint wit of off-white.',
    specs: [
      ['Type', 'Mineraal of siliconen-crepi'],
      ['Korrel', '1,0 / 1,5 / 2,0 mm'],
      ['Levensduur', '25+ jaar zonder herschilderen'],
      ['Onderhoud', 'Sporadisch reinigen'],
      ['Premie', 'Tot €30/m² bij gevelisolatie'],
      ['Doorlooptijd', '2 tot 4 weken'],
    ],
    bullets: [
      'Spuitwerk in één doorlopende baan, geen aanzetten',
      'Vochtwerend en zelfreinigend bij regen',
      'Combineerbaar met buitenisolatie (ETICS)',
      'Hoeken in inox profiel voor scherpe lijn',
    ],
  },
  {
    id: 'grijs', img: imgGrijs, tag: 'Crepi',
    title: 'Grijze crepi',
    intro: 'Antraciet, parelgrijs of steengrijs. De moderne keuze, vooral mooi in combinatie met dark frame ramen of een zink-detail.',
    specs: [
      ['Type', 'Mineraal of siliconen-crepi'],
      ['Kleuren', 'Antraciet · parelgrijs · steengrijs'],
      ['Levensduur', '25+ jaar'],
      ['Combinatie', 'Met larix-cladding of zink'],
      ['Premie', 'Tot €30/m² bij gevelisolatie'],
      ['Doorlooptijd', '2 tot 4 weken'],
    ],
    bullets: [
      'Donkere tinten in UV-stabiele formule',
      'Vlakke afwerking voor strakke architectuur',
      'Naadloos rond ramen en hoeken',
      'Lange kleurvastheid zonder verkleuring',
    ],
  },
  {
    id: 'steenstrips', img: imgSteen, tag: 'Bekleding',
    title: 'Steenstrips',
    intro: 'Dunne baksteenstrips voor wie de baksteen-look wil bewaren én een topisolatie wil. Vaak in combinatie met buitenisolatie.',
    specs: [
      ['Formaten', 'Lang formaat of klassiek'],
      ['Kleuren', 'Bruin, grijs-bruin, antraciet'],
      ['Voeg', 'Smal grijs of zwart'],
      ['Combinatie', 'Met PIR of EPS isolatie'],
      ['Levensduur', '50+ jaar'],
      ['Doorlooptijd', '3 tot 5 weken'],
    ],
    bullets: [
      'Volledig systeemopbouw met isolatie en lijmlaag',
      'Onderhoudsvrij, kleurvast en vorstbestendig',
      'Strakke aansluitingen rond ramen en plinten',
      'Geschikt voor renovatie én nieuwbouw',
    ],
  },
  {
    id: 'sierpleister', img: imgSier, tag: 'Pleister',
    title: 'Sierpleister',
    intro: 'Iets meer textuur dan crepi, en warmer in toon. Geeft een rustige, ambachtelijke uitstraling, zeker bij landelijke woningen.',
    specs: [
      ['Type', 'Mineraal sierpleister'],
      ['Korrel', '1,5 / 2,0 / 3,0 mm'],
      ['Tinten', 'Off-white, beige, zandgrijs'],
      ['Toepassing', 'Volledig gevel of accentwand'],
      ['Onderhoud', 'Periodiek reinigen'],
      ['Doorlooptijd', '2 tot 4 weken'],
    ],
    bullets: [
      'Met de hand opgewerkt voor levendige textuur',
      'Past bij landelijke en hoeveachtige woningen',
      'Kleurvast en ademend',
      'Combineerbaar met natuursteen plint',
    ],
  },
];

const HTML = `
${buildNav('diensten')}

${buildHero({
  bg: heroImg,
  eyebrow: '06 · Gevels & bekleding',
  title: 'Een nieuwe gevel<br/>verandert <span style="color:var(--accent)">alles</span>.',
  lede: 'Witte of grijze crepi, sierpleister of steenstrips. Vaak gecombineerd met <span class="ab-hl" data-hl-delay="0">esthetiek én energieprestatie</span>, zodat uw gevel niet alleen mooier maar ook <span class="ab-hl" data-hl-delay="1">energetisch klopt</span>.',
  primary: { label: 'Vraag plaatsbezoek aan', href: '/contact' },
  secondary: { label: 'Bekijk realisaties →', href: '/realisaties' },
})}

<!-- INTRO + USP -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">AB Gevelbekleding</span>
        <h2 class="lf-h2">Esthetiek én<br/>energieprestatie.</h2>
        <p class="lf-lede">Een gevelrenovatie is hét moment om in één werf ook gevelisolatie aan te pakken. We rekenen vooraf de E-peil-winst en de premies door, zodat u zeker weet dat de investering rendeert.</p>
        <ul class="ab-checks" style="margin-top:18px;">
          <li>Eigen ploeg gevelwerkers, geen onderaanneming</li>
          <li>Stelling en buurtbescherming inbegrepen</li>
          <li>10 jaar garantie op stabiliteit van bekleding</li>
          <li>Premiedossier (Mijn VerbouwPremie) door ons</li>
        </ul>
      </div>
      <div class="lf-split-img" data-reveal data-reveal-delay="1"><img src="${imgIntro}" alt="Gevelisolatie in uitvoering" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- TOC -->
<section class="lf-section" style="padding: 0 0 12px;">
  <div class="wrap">
    <div class="ab-toc-wrap">
      <nav class="ab-toc" aria-label="Type gevelafwerking">
        ${types.map(t => `<a href="#${t.id}">${t.title}</a>`).join('')}
      </nav>
    </div>
  </div>
</section>

<!-- TYPES -->
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
              <table class="dak-spec"><tbody>
                ${t.specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
              </tbody></table>
            </details>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<!-- ISOLATIE COMBO -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-split">
      <div data-reveal>
        <span class="lf-eyebrow">Buitenisolatie + crepi</span>
        <h2 class="lf-h2">Twee vliegen,<br/>één stelling.</h2>
        <p class="lf-lede">Een gevel openleggen is duur. Maak van die ene werf meteen een energetische upgrade: EPS- of minerale isolatieplaten op de bestaande gevel, daarna pas een nieuwe crepi-laag.</p>
        <ul class="ab-checks" style="margin-top:18px;">
          <li>Tot 25–40% lagere stookkost</li>
          <li>Geen koudebruggen meer aan ramen</li>
          <li>EPC-sprong gemiddeld 60–100 punten</li>
          <li>Premie tot €30/m² via Mijn VerbouwPremie</li>
        </ul>
      </div>
      <div data-reveal data-reveal-delay="1"><img src="${imgStelling}" alt="Stelling rond gevelrenovatie" loading="lazy" style="width:100%; border-radius: 16px; aspect-ratio: 4/3; object-fit: cover;"/></div>
    </div>
  </div>
</section>

<!-- PROCES -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Hoe we te werk gaan</span>
      <h2 class="lf-h2">Van inspectie tot<br/>laatste streek.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal><div class="ab-flow-num">STAP 01</div><h5>Gevelinspectie</h5><p>We controleren ondergrond, vocht en eventueel oude bezetting.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1"><div class="ab-flow-num">STAP 02</div><h5>Materiaalkeuze</h5><p>Stalen vergelijken op de werf, in het echte daglicht.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2"><div class="ab-flow-num">STAP 03</div><h5>Stelling &amp; isolatie</h5><p>Stelling, isolatieplaten, wapeningsmortel en hoekprofielen.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3"><div class="ab-flow-num">STAP 04</div><h5>Afwerking</h5><p>Spuitwerk in één doorlopende baan, controle, oplevering.</p></div>
    </div>
  </div>
</section>

<!-- WAT INBEGREPEN -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Bij elk gevelproject</span>
      <h2 class="lf-h2">Wat altijd in onze prijs zit.</h2>
    </div>
    <div class="ab-incl ab-incl-single">
      <div class="ab-incl-card yes" data-reveal>
        <h4>Standaard inbegrepen</h4>
        <ul>
          <li>Plaatsbezoek met fotorapport en advies</li>
          <li>Volledige stelling en buurtbescherming</li>
          <li>Reiniging en herstel van de bestaande ondergrond</li>
          <li>Hoekprofielen in inox of alu voor scherpe lijnen</li>
          <li>Nieuwe raamtabletten waar nodig</li>
          <li>Indienen Mijn VerbouwPremie</li>
          <li>10 jaar garantie op stabiliteit van bekleding</li>
          <li>Eindcontrole en onderhoudsadvies</li>
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
      <h2 class="lf-h2">Over gevelwerken.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Welke gevelafwerking is het meest onderhoudsvrij?</summary><div class="ab-faq-body"><p>Siliconen-crepi en steenstrips vragen het minst onderhoud. Een goede crepi gaat 25 jaar mee zonder herschilderen.</p></div></details>
      <details data-reveal><summary>Krijg ik premie voor gevelisolatie?</summary><div class="ab-faq-body"><p>Ja, tot €30/m² via Mijn VerbouwPremie (R-waarde minstens 3,0 m²K/W). Wij regelen het dossier voor u.</p></div></details>
      <details data-reveal><summary>Kan crepi op elke gevel?</summary><div class="ab-faq-body"><p>Op de meeste gevels wel. Bij sterk vervuilde of vochtige muren komt eerst een sanering. Dat zien we bij het plaatsbezoek meteen.</p></div></details>
      <details data-reveal><summary>Hoe lang duurt een gevelrenovatie?</summary><div class="ab-faq-body"><p>Een doorsnee gezinswoning: 2 tot 4 weken voor enkel crepi, 4 tot 6 weken inclusief buitenisolatie. We werken weersafhankelijk.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Plan uw gevelrenovatie', 'Vraag een gratis plaatsbezoek aan. Binnen één werkdag krijgt u antwoord met een eerste richtprijs en advies.')}

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

export default function Gevel() {
  useEffect(() => {
    document.title = 'AB Gevelbekleding, crepi, sierpleister en steenstrips | AB Bouw Group';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Witte en grijze crepi, sierpleister en steenstrips, vaak gecombineerd met buitenisolatie. Eigen gevelploeg, premiedossier inbegrepen.');
    const prev = document.body.className;
    document.body.className = '';
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prev; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
