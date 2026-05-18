import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from './_shell';
import { CONTACT } from '@/data/contact';

import realisatiesImg from '@/assets/home/hero-realisaties.jpg';
import werkwijzeImg from '@/assets/home/hero-werkwijze.jpg';
import premieImg from '@/assets/home/blog-trends-2026.jpg';

import revStijn from '@/assets/reviews/stijn.jpg';
import revLieve from '@/assets/reviews/lieve.jpg';
import revYusuf from '@/assets/reviews/yusuf.jpg';
import revJasmien from '@/assets/reviews/jasmien.jpg';
import revDimitri from '@/assets/reviews/dimitri.jpg';
import revHicham from '@/assets/reviews/hicham.jpg';
import revGreet from '@/assets/reviews/greet.jpg';
import revAhmed from '@/assets/reviews/ahmed.jpg';
import revTine from '@/assets/reviews/tine.jpg';

type ServiceKey = 'dakwerken' | 'gevel' | 'default';

type Review = { name: string; role: string; img: string; text: string };

const H1: Record<ServiceKey, string> = {
  dakwerken: 'Bedankt — uw <span class="ab-mark">dakwerken</span>-aanvraag is goed aangekomen.',
  gevel:     'Bedankt — uw <span class="ab-mark">gevelrenovatie</span>-aanvraag is goed aangekomen.',
  default:   'Bedankt — uw <span class="ab-mark">aanvraag</span> is goed aangekomen.',
};

const REVIEWS: Record<ServiceKey, Review[]> = {
  dakwerken: [
    { name: 'Stijn Devos', role: 'Pannendak · Mechelen', img: revStijn, text: 'Onze rijwoning had een dak van 1962, lekte op drie plaatsen. AB Bouw stripte alles op één maandag en lag vrijdag waterdicht. Koramic Aleonard pannen, sarkingisolatie, nieuwe goten. Premie van €4.200 een maand na oplevering op de rekening.' },
    { name: 'Lieve Hermans', role: 'Plat dak EPDM · Antwerpen', img: revLieve, text: 'Vrijdag een natte vlek op het plafond, zaterdag belde een van de werfleiders me terug. Maandag stond de ploeg op het dak. 70 m² EPDM in één stuk gelegd, geen naden, geen sjoemel. Factuur klopte tot op de euro met de offerte.' },
    { name: 'Yusuf Demir', role: 'Sarkingisolatie · Bornem', img: revYusuf, text: 'Sarkingisolatie boven de bestaande kepers, daarna nieuwe Koramic pannen. Werf was elke vrijdagavond opgeruimd. Foto-update via app, je wist op elk moment waar we stonden in de planning.' },
  ],
  gevel: [
    { name: 'Jasmien De Backer', role: 'Witte crepi · Mechelen', img: revJasmien, text: 'Onze rijwoning had een vermoeide bezetting uit de jaren ’80. Nu een spierwitte crepi-gevel die je zo van een interieurmagazine plukt. Buren komen vragen wie het werk gedaan heeft. Strak, proper, op tijd opgeleverd.' },
    { name: 'Dimitri Maes', role: 'Crepi + ETICS-isolatie · Antwerpen', img: revDimitri, text: 'Halfopen woning uit 1968 die nooit was geïsoleerd. 16 cm EPS buitenisolatie plus crepi. Comfort-sprong is enorm: geen koude muren meer in de winter. Premie van €5.400 zonder problemen uitbetaald.' },
    { name: 'Hicham Bouali', role: 'Gevelisolatie · Mechelen', img: revHicham, text: 'Eerste aannemer wilde alleen crepi over de bestaande gevel. AB Bouw legde uit waarom ETICS-isolatie nodig was. Hogere prijs, veel betere oplossing. EPC en comfort beide vlot vooruit. Geen spijt van die keuze.' },
  ],
  default: [
    { name: 'Greet Vermeiren', role: 'Totaalrenovatie · Lier', img: revGreet, text: 'Volledige renovatie van A tot Z. Eén aanspreekpunt voor alles, planning klopte tot op de dag, eindfactuur exact zoals offerte. Geen verrassingen, geen meerwerk-trucs.' },
    { name: 'Ahmed Karimi', role: 'Badkamerrenovatie · Vilvoorde', img: revAhmed, text: 'Inloopdouche met microcement. Werfleider belde elke vrijdag voor de week-update. Klaar binnen de afgesproken termijn, propere werf, vakwerk tot in de laatste voeg.' },
    { name: 'Tine Maes', role: 'Aanbouw · Bonheiden', img: revTine, text: 'Aanbouw van 28 m² met zinkwerk en grote raampartij. Architectenplan werd 1-op-1 uitgevoerd, de ploeg dacht actief mee bij detail-uitwerking. Erg tevreden over de afwerking.' },
  ],
};

export default function Bedankt() {
  const [searchParams] = useSearchParams();
  const param = searchParams.get('service');
  const service: ServiceKey =
    param === 'dakwerken' ? 'dakwerken' :
    param === 'gevel' ? 'gevel' :
    'default';
  const h1 = H1[service];
  const reviews = REVIEWS[service];

  useEffect(() => {
    document.title = 'Bedankt voor uw aanvraag | AB Bouw Groep';

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.setAttribute('name', 'robots'); document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, nofollow');

    const prev = document.body.className;
    document.body.className = '';
    const style = document.createElement('style');
    style.textContent = SHELL_STYLE + BEDANKT_CSS;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    return () => { document.body.className = prev; style.remove(); };
  }, []);
  useAbBouwInteractions();

  const html = `
${buildNav('home')}

<section class="ab-bedankt-hero">
  <div class="ab-bedankt-hero-bg" aria-hidden="true"></div>
  <div class="wrap">
    <div class="ab-bedankt-card" data-reveal>
      <div class="ab-bedankt-check" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <span class="lf-eyebrow">Aanvraag binnen</span>
      <h1 class="lf-h2 ab-bedankt-h1">${h1}</h1>
      <p class="lf-lede ab-bedankt-lede">U mag het loslaten — wij nemen het van hier over. Binnen één werkdag belt of mailt een van onze projectleiders u persoonlijk. Iemand van het AB Bouw team, geen callcenter. We luisteren eerst naar wat u in gedachten heeft, en plannen pas daarna samen een gratis plaatsbezoek in op een moment dat u uitkomt.</p>
      <div class="ab-bedankt-actions">
        <a href="${CONTACT.phone.href}" class="lf-cta-pill">
          <span>Liever direct bellen — ${CONTACT.phone.spaced}</span>
          <span class="lf-cta-pill-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </a>
        <span class="ab-bedankt-sub">Bereikbaar ma-vr 07:00 — 18:00</span>
      </div>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Wat gebeurt er nu</span>
      <h2 class="lf-h2">Stap voor stap,<br/>geen verrassingen.</h2>
    </div>
    <div class="ab-flow">
      <div class="ab-flow-card" data-reveal>
        <div class="ab-flow-num">FASE 01</div>
        <h5>Bevestiging</h5>
        <p>Vandaag, binnen één uur. Een mail met de samenvatting van uw aanvraag en onze contactgegevens.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="1">
        <div class="ab-flow-num">FASE 02</div>
        <h5>Telefonische intake</h5>
        <p>Eerstvolgende werkdag. Een kort gesprek (10 à 15 min) waarin we luisteren naar uw plannen. Geen verkooppraatje, geen druk.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="2">
        <div class="ab-flow-num">FASE 03</div>
        <h5>Plaatsbezoek</h5>
        <p>Binnen vijf werkdagen. Onze projectleider komt langs, meet op, neemt foto's en bespreekt opties. Vrijblijvend, geen verplichting.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3">
        <div class="ab-flow-num">FASE 04</div>
        <h5>Offerte op maat</h5>
        <p>Vijf à tien dagen later. Vaste prijs, geldig 30 dagen, fotorapport van het plaatsbezoek en premie-dossier voorbereid.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf-section ab-bedankt-rev-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Recent over ons</span>
      <h2 class="lf-h2">Wat klanten zeggen<br/>na hun project.</h2>
    </div>
    <div class="ab-bedankt-rev-grid">
      ${reviews.map((r, i) => `
        <article class="ab-bedankt-rev" data-reveal data-reveal-delay="${i}">
          <div class="ab-bedankt-rev-stars" aria-label="5 van 5 sterren">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
          </div>
          <p>${r.text}</p>
          <div class="ab-bedankt-rev-foot">
            <img src="${r.img}" alt="${r.name}" loading="lazy"/>
            <div>
              <strong>${r.name}</strong>
              <span>${r.role}</span>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="ab-quote" data-reveal>
      "Een goede renovatie begint met luisteren. Daarom plannen we eerst een rustig telefoontje en pas dan een plaatsbezoek. Geen verkoperstrucs, geen drukte — gewoon kijken wat u nodig heeft en of wij dat correct voor u kunnen uitvoeren."
      <footer>De ploeg van AB Bouw Groep</footer>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Schriftelijk vastgelegd</span>
      <h2 class="lf-h2">Vier zekerheden voor u<br/>als opdrachtgever.</h2>
    </div>
    <div class="lf-support-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="lf-support-card" data-reveal>
        <div class="lf-support-meta"><span>01</span> Prijs</div>
        <h5>Vaste prijs, bindend</h5>
        <p>Geen meerwerk tenzij u zelf wijzigingen vraagt. Eindfactuur klopt tot op de euro met de offerte.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="1">
        <div class="lf-support-meta"><span>02</span> Ploeg</div>
        <h5>Eigen vakmensen</h5>
        <p>Eigen dakdekkers, gevelploegen, tegelzetters. Geen onderaannemers, geen losse contracten met dagloners.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="2">
        <div class="lf-support-meta"><span>03</span> Garantie</div>
        <h5>10 jaar via Federale</h5>
        <p>Wettelijke 10-jarige aansprakelijkheid op stabiliteit en waterdichtheid. Plus 2 jaar op afwerking.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="3">
        <div class="lf-support-meta"><span>04</span> Aanspreekpunt</div>
        <h5>Eén projectleider</h5>
        <p>Dezelfde persoon doet uw plaatsbezoek, offerte, werf en oplevering. Geen carrousel van wisselende contacten.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Even tijd te doden?</span>
      <h2 class="lf-h2">Wat u ondertussen<br/>al kan bekijken.</h2>
    </div>
    <div class="lf-blog-grid">
      <a href="/realisaties" class="lf-blog-card" data-reveal>
        <div class="lf-blog-img"><img src="${realisatiesImg}" alt="Realisaties AB Bouw Groep" loading="lazy"/></div>
        <div class="lf-blog-body">
          <span class="lf-blog-tag">Realisaties</span>
          <h3>Onze 100+ projecten in Vlaanderen</h3>
          <p>Echte huizen, echte klanten, echte fotorapporten. Van klassieke dakrenovaties tot volledige totaalrenovaties.</p>
        </div>
      </a>
      <a href="/blog/mijn-verbouwpremie-2026" class="lf-blog-card" data-reveal data-reveal-delay="1">
        <div class="lf-blog-img"><img src="${premieImg}" alt="Mijn VerbouwPremie 2026" loading="lazy"/></div>
        <div class="lf-blog-body">
          <span class="lf-blog-tag">Premie-gids</span>
          <h3>Welke premies krijgt u in 2026?</h3>
          <p>Mijn VerbouwPremie in mensentaal — wat u kunt krijgen, hoe het werkt, en wat wij voor u regelen.</p>
        </div>
      </a>
      <a href="/werkwijze" class="lf-blog-card" data-reveal data-reveal-delay="2">
        <div class="lf-blog-img"><img src="${werkwijzeImg}" alt="Onze werkwijze" loading="lazy"/></div>
        <div class="lf-blog-body">
          <span class="lf-blog-tag">Werkwijze</span>
          <h3>Acht stappen, nul verrassingen</h3>
          <p>Het volledige traject van eerste contact tot nazorg, met alle documenten die u onderweg krijgt.</p>
        </div>
      </a>
    </div>
  </div>
</section>

${FOOTER}
  `;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const BEDANKT_CSS = `
/* HERO — soft gradient bg, big visible green check */
.ab-bedankt-hero {
  position: relative;
  padding: 140px 0 80px;
  overflow: hidden;
  isolation: isolate;
}
.ab-bedankt-hero-bg {
  position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(circle at 50% 30%, rgba(46,164,102,0.10) 0%, rgba(46,164,102,0) 55%),
    linear-gradient(180deg, #f7f4ef 0%, #fff 70%);
}
.ab-bedankt-card {
  max-width: 780px; margin: 0 auto; text-align: center;
}
.ab-bedankt-check {
  width: 84px; height: 84px; border-radius: 50%;
  background: #2ea466;
  display: inline-flex; align-items: center; justify-content: center;
  margin: 0 auto 26px;
  box-shadow:
    0 0 0 8px rgba(46,164,102,0.12),
    0 16px 36px -12px rgba(46,164,102,0.45);
  animation: bedanktPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes bedanktPop {
  0%   { transform: scale(0.3); opacity: 0; }
  100% { transform: scale(1);   opacity: 1; }
}
.ab-bedankt-h1 { margin-top: 14px; }
.ab-bedankt-lede { margin: 20px auto 30px; max-width: 620px; }
.ab-bedankt-actions { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.ab-bedankt-actions .lf-cta-pill { display: inline-flex; }
.ab-bedankt-sub { font-size: 12.5px; color: var(--ink-mute); }

/* REVIEWS — clean cards, navy text, orange stars */
.ab-bedankt-rev-section { padding: 80px 0; }
.ab-bedankt-rev-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 36px;
}
.ab-bedankt-rev {
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  border-radius: 16px;
  padding: 28px 26px;
  display: flex; flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.ab-bedankt-rev:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 32px -16px rgba(10,22,40,0.14);
}
.ab-bedankt-rev-stars {
  display: inline-flex; gap: 3px;
  color: var(--accent);
  margin-bottom: 14px;
}
.ab-bedankt-rev p {
  font-size: 14px; line-height: 1.6; color: var(--ink-soft);
  margin: 0 0 22px;
  flex: 1;
  font-style: italic;
}
.ab-bedankt-rev-foot {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  padding-top: 18px;
  border-top: 1px solid var(--ink-line-soft);
}
.ab-bedankt-rev-foot img {
  width: 44px; height: 44px; border-radius: 50%; object-fit: cover;
}
.ab-bedankt-rev-foot strong {
  display: block;
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--navy);
  font-weight: 600;
}
.ab-bedankt-rev-foot span {
  display: block;
  font-size: 12px;
  color: var(--ink-mute);
  margin-top: 2px;
}
@media (max-width: 900px) { .ab-bedankt-rev-grid { grid-template-columns: 1fr; gap: 14px; } }
`;
