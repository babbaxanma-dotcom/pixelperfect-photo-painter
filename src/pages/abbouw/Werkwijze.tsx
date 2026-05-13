import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import hero from '@/assets/home/hero-werkwijze.jpg';
import s1 from '@/assets/werkwijze/01-contact.jpg';
import s2 from '@/assets/werkwijze/02-plaatsbezoek.jpg';
import s3 from '@/assets/werkwijze/03-offerte.jpg';
import s4 from '@/assets/werkwijze/04-voorbereiding.jpg';
import s5 from '@/assets/werkwijze/05-uitvoering.jpg';
import s6 from '@/assets/werkwijze/06-voorop.jpg';
import s7 from '@/assets/werkwijze/07-oplevering.jpg';
import s8 from '@/assets/werkwijze/08-nazorg.jpg';

const stages = [
  {
    n: '01', img: s1, title: 'Eerste contact', tag: 'Dag 1–2',
    p: 'U belt of vult ons contactformulier in. Binnen één werkdag krijgt u een terugbelmoment van de projectleider die uw type project zal opvolgen, geen callcenter, geen verkoper.',
    bullets: ['Telefoongesprek van 15–20 minuten', 'Kort overzicht van uw plannen en budget', 'Inplannen plaatsbezoek op een moment dat u past'],
  },
  {
    n: '02', img: s2, title: 'Plaatsbezoek', tag: 'Week 1',
    p: 'Een projectleider en eventueel de juiste divisie-verantwoordelijke komen ter plaatse. We meten op, luisteren naar uw wensen, en geven al een eerste eerlijke kijk op haalbaarheid en budget, gratis en vrijblijvend.',
    bullets: ['Duurt typisch 60 tot 90 minuten', 'U krijgt een verslag per mail binnen 48u', 'Eerste budgetindicatie ter plaatse'],
  },
  {
    n: '03', img: s3, title: 'Offerte op maat', tag: 'Week 2–3',
    p: 'Wij maken een gedetailleerde offerte met meetstaat. Materialen, hoeveelheden, uurloon en planning, alles uitgesplitst. We bezorgen ze digitaal en plannen een offertegesprek om elke post samen door te nemen.',
    bullets: ['Bindende prijs, geldig 60 dagen', 'Per post: hoeveelheid, eenheidsprijs, totaal', 'Optionele meerwerken expliciet opgelijst', 'Toelichting in een offertegesprek (1u)'],
  },
  {
    n: '04', img: s4, title: 'Voorbereidende fase', tag: 'Week 3–14',
    p: 'Na ondertekening starten we de administratieve voorbereiding. Wij regelen vergunning, premieaanvragen en bestellen de hoofdmaterialen zodat de werf zonder vertraging kan starten.',
    bullets: ['Stedenbouwkundige aanvraag (indien nodig)', 'EPB-startverklaring door onze verslaggever', 'Indienen Mijn VerbouwPremie + Fluvius', 'Materiaalbestellingen (tegels, sanitair, schrijnwerk)', 'Detailplanning per week opgeleverd'],
  },
  {
    n: '05', img: s5, title: 'Uitvoering op de werf', tag: 'Variabel',
    p: 'De effectieve werf. U krijgt elke vrijdag een werfrapport met foto\'s en planning voor de week erop. Tweewekelijkse werfvergadering met de projectleider, en u bent altijd welkom op afspraak.',
    bullets: ['Vaste projectleider en vaste ploeg', 'Werfopruim elke vrijdagavond', 'Foto-update + voortgang via WhatsApp en e-mail', 'Toegang tot uw klantenportaal met alle documenten', 'Wijzigingen alleen na schriftelijke goedkeuring'],
  },
  {
    n: '06', img: s6, title: 'Voor-oplevering', tag: 'Week –1',
    p: 'Een week voor de eindoplevering doen we een interne controle. Eventuele puntjes lossen we op vóór u erbij komt, zodat u bij de officiële oplevering een afgewerkt resultaat ziet.',
    bullets: ['Interne controle door projectleider + werfleider', 'Bij elke afwerkingsdivisie afzonderlijk', 'Documentatie en garantieattesten verzameld'],
  },
  {
    n: '07', img: s7, title: 'Officiële oplevering', tag: 'Sleuteldag',
    p: 'Gezamenlijke rondgang met u en de projectleider. We tekenen een opleveringsverslag, overhandigen alle documenten en sleutels, en bespreken de nazorg. Pas dan staat de eindfactuur klaar.',
    bullets: ['Opleveringsverslag (eventuele restpunten)', 'Garantieattesten van alle materialen', 'Onderhoudshandleiding per installatie', 'EPB-aangifte na werken'],
  },
  {
    n: '08', img: s8, title: 'Nazorg', tag: '12 maanden',
    p: 'Eén jaar na oplevering komen we gratis langs voor een nacontrole, krimpscheuren, afregeling deuren, voegen, verluchtingsroosters. Klacht ondertussen? Reactie binnen 48 uur, ook na het garantiejaar.',
    bullets: ['Geplande nacontrole na 12 maanden', '10-jarige aansprakelijkheid stabiliteit & waterdichtheid', '2 jaar garantie op afwerking', 'Servicelijn voor klachten en kleine herstellingen'],
  },
];

const HTML = `
${buildNav('werkwijze')}

${buildHero({
  bg: hero,
  eyebrow: 'Onze werkwijze',
  title: 'Acht stappen,<br/>nul verrassingen.',
  lede: 'Een goed traject is voorspelbaar. U weet wie u contacteert, wat er wanneer gebeurt, en welke documenten u krijgt, van het eerste telefoontje tot de nacontrole één jaar na de werf.',
  primary: { label: 'Start uw traject', href: '/contact' },
  secondary: { label: 'Onze werkwijze →', href: '/werkwijze' },
})}

<!-- INTRO -->
<section class="lf-section">
  <div class="wrap">
    <div class="ab-quote" data-reveal>
      "We hebben in onze vijftien jaar ondervonden dat 90% van de problemen op een werf ontstaan door slechte communicatie. Niet door slechte uitvoering. Daarom investeren we evenveel in onze werkwijze als in onze vakmensen."
      <footer>Zaakvoerder AB Bouw Groep</footer>
    </div>
  </div>
</section>

<!-- HORIZONTAL FLOW SUMMARY -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">In één oogopslag</span>
      <h2 class="lf-h2">Het traject van offerte<br/>tot oplevering.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal><div class="ab-flow-num">FASE 01</div><h5>Plaatsbezoek</h5><p>Gratis &amp; vrijblijvend, binnen één week na uw aanvraag.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1"><div class="ab-flow-num">FASE 02</div><h5>Offerte</h5><p>Bindend, gedetailleerd, mondeling toegelicht in een gesprek.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2"><div class="ab-flow-num">FASE 03</div><h5>Werf</h5><p>Vaste projectleider, eigen ploegen, wekelijks rapport.</p></div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3"><div class="ab-flow-num">FASE 04</div><h5>Oplevering &amp; nazorg</h5><p>Officiële oplevering en gratis nacontrole na één jaar.</p></div>
    </div>
  </div>
</section>

<!-- 8-STEP WITH PHOTOS (alternating) -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Acht stappen, in detail</span>
      <h2 class="lf-h2">Wat er gebeurt,<br/>wanneer het gebeurt.</h2>
    </div>
    <div class="ab-steps ab-steps--seq">
      ${stages.map((s, i) => `
        <article class="ab-step ${i % 2 === 1 ? 'reverse' : ''}" data-step-reveal style="--step-i:${i};">
          <div class="ab-step-media">
            <img src="${s.img}" alt="${s.title}" loading="lazy"/>
            <span class="ab-step-num">${s.n}</span>
          </div>
          <div class="ab-step-body">
            <span class="ab-step-tag">${s.tag}</span>
            <h3>${s.title}</h3>
            <p>${s.p}</p>
            <details class="ab-more">
              <summary>Wat krijgt u concreet?</summary>
              <ul class="ab-checks" style="margin-top: 10px;">${s.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
            </details>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<!-- WHAT YOU GET / GUARANTEES -->
<section class="lf-section lf-tone-soft ab-zek-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Schriftelijk vastgelegd</span>
      <h2 class="lf-h2">Vier zekerheden voor u<br/>als opdrachtgever.</h2>
    </div>
    <div class="lf-support-grid ab-zek-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="lf-support-card ab-zek-card" data-zek-reveal style="--zek-i:0;">
        <div class="lf-support-meta"><span>01</span> Prijs</div>
        <h5>Vaste prijs, bindend</h5>
        <p>Geen meerwerk tenzij u zelf wijzigingen vraagt, en dan eerst goedgekeurd, nooit verrast op de eindfactuur.</p>
      </div>
      <div class="lf-support-card ab-zek-card" data-zek-reveal style="--zek-i:1;">
        <div class="lf-support-meta"><span>02</span> Planning</div>
        <h5>Wekelijks werfrapport</h5>
        <p>Elke vrijdag een korte update met foto's, voortgang en planning voor de week erop. Vertraging? U weet het meteen, niet pas na drie weken.</p>
      </div>
      <div class="lf-support-card ab-zek-card" data-zek-reveal style="--zek-i:2;">
        <div class="lf-support-meta"><span>03</span> Garantie</div>
        <h5>10 jaar aansprakelijkheid</h5>
        <p>Wettelijke 10-jarige aansprakelijkheid op stabiliteit en waterdichtheid, plus 2 jaar garantie op afwerking. Polis bij Federale Verzekering.</p>
      </div>
      <div class="lf-support-card ab-zek-card" data-zek-reveal style="--zek-i:3;">
        <div class="lf-support-meta"><span>04</span> Aanspreekpunt</div>
        <h5>Eén projectleider</h5>
        <p>Dezelfde projectleider doet uw plaatsbezoek, levert de offerte op, leidt de werf en doet de oplevering. Geen carrousel van wisselende contactpersonen.</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Veelgestelde vragen</span>
      <h2 class="lf-h2">Over het traject.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Hoe snel na het plaatsbezoek krijg ik een offerte?</summary><div class="ab-faq-body"><p>Voor een eenvoudige opdracht (badkamer, dak, gevel) binnen 7 werkdagen. Voor totaalrenovaties of nieuwbouw rekenen we 10 tot 15 werkdagen omdat we voorafgaand de planken en hoeveelheden grondig opmeten en met onze leveranciers prijzen aftoetsen.</p></div></details>
      <details data-reveal><summary>Wat als ik tijdens de werf van gedacht verander?</summary><div class="ab-faq-body"><p>Dat kan altijd. Een wijziging tot vóór de start van die specifieke fase brengen we kosteloos in de planning aan. Wijzigingen tijdens de uitvoering zijn meestal mogelijk, maar brengen meerprijs. U krijgt vooraf altijd een geschreven prijsofferte voor de wijziging.</p></div></details>
      <details data-reveal><summary>Wat als de werf vertraging oploopt?</summary><div class="ab-faq-body"><p>Wij melden vertragingen onmiddellijk bij ontdekking, met foto en uitleg, in het wekelijkse rapport. Bij een vertraging van meer dan 4 weken die door ons toedoen ontstaat, is een compensatieregeling voorzien in onze algemene voorwaarden.</p></div></details>
      <details data-reveal><summary>Krijg ik een vast aanspreekpunt?</summary><div class="ab-faq-body"><p>U krijgt één vaste projectleider voor het volledige traject. Bij ziekte of vakantie neemt zijn back-up over, en die is op voorhand op uw dossier ingelezen.</p></div></details>
      <details data-reveal><summary>Hoe werkt jullie klantenportaal?</summary><div class="ab-faq-body"><p>U krijgt een persoonlijke login na contracttekening. Daar vindt u: contract en offertes, vergunning- en premiedossier, alle facturen, het wekelijks werfrapport met foto's, materialen en kleurkeuzes ter goedkeuring, en het opleveringsverslag.</p></div></details>
    </div>
  </div>
</section>

${buildCta('Klaar om uw traject te starten?', 'Plan vandaag een vrijblijvend plaatsbezoek. Binnen één werkdag krijgt u antwoord van een vakmens, geen callcenter.')}

${FOOTER}
`;

const STEP_REVEAL_CSS = `
/* Per-step scroll-driven reveal — each card stays hidden until you scroll to it */
.ab-steps--seq [data-step-reveal] {
  opacity: 0;
  transform: translateY(64px) scale(0.965);
  filter: blur(6px);
  transition:
    opacity .9s cubic-bezier(.2,.7,.2,1),
    transform 1.05s cubic-bezier(.2,.75,.2,1),
    filter .9s cubic-bezier(.2,.7,.2,1);
  will-change: opacity, transform, filter;
}
.ab-steps--seq [data-step-reveal] .ab-step-media {
  transform: translateY(28px) scale(0.98);
  transition: transform 1.1s cubic-bezier(.2,.75,.2,1);
  transition-delay: .08s;
}
.ab-steps--seq [data-step-reveal] .ab-step-body > * {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.75,.2,1);
}
.ab-steps--seq [data-step-reveal] .ab-step-body > *:nth-child(1) { transition-delay: .15s; }
.ab-steps--seq [data-step-reveal] .ab-step-body > *:nth-child(2) { transition-delay: .22s; }
.ab-steps--seq [data-step-reveal] .ab-step-body > *:nth-child(3) { transition-delay: .29s; }
.ab-steps--seq [data-step-reveal] .ab-step-body > *:nth-child(4) { transition-delay: .36s; }

.ab-steps--seq [data-step-reveal].is-in {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}
.ab-steps--seq [data-step-reveal].is-in .ab-step-media { transform: translateY(0) scale(1); }
.ab-steps--seq [data-step-reveal].is-in .ab-step-body > * { opacity: 1; transform: translateY(0); }

/* (reduced-motion override voor stap-reveal bewust verwijderd) */

/* "Vier zekerheden" — staggered scroll-driven reveal */
.ab-zek-card[data-zek-reveal] {
  opacity: 0;
  transform: translateY(56px) scale(0.94);
  filter: blur(8px);
  transition:
    opacity .85s cubic-bezier(.2,.7,.2,1),
    transform 1s cubic-bezier(.2,.75,.2,1),
    filter .85s cubic-bezier(.2,.7,.2,1);
  transition-delay: calc(var(--zek-i, 0) * 110ms);
  will-change: opacity, transform, filter;
}
.ab-zek-card[data-zek-reveal].is-in {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}
.ab-zek-section .lf-section-head { margin-bottom: 36px; }
/* (reduced-motion override voor zek-reveal bewust verwijderd) */
`;

export default function Werkwijze() {
  useEffect(() => {
    document.title = "Werkwijze | AB Bouw Groep | 8 stappen van offerte tot oplevering";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Het volledige bouwtraject in 8 transparante stappen: plaatsbezoek, offerte, vergunning, werf, oplevering en nazorg. Vaste projectleider, vaste prijs.");
    const prev = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE + STEP_REVEAL_CSS;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prev; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();

  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>('.ab-steps--seq [data-step-reveal]'));
    if (!steps.length) return;
    const reduced = false; // opdrachtgever: animaties voor iedereen
    if (reduced) {
      steps.forEach((s) => s.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.22, rootMargin: '0px 0px -12% 0px' },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-zek-reveal]'));
    if (!cards.length) return;
    const reduced = false; // opdrachtgever: animaties voor iedereen
    if (reduced) { cards.forEach((c) => c.classList.add('is-in')); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
