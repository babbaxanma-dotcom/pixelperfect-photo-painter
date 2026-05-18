import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from './_shell';
import { CONTACT } from '@/data/contact';

import realisatiesImg from '@/assets/home/hero-realisaties.jpg';
import werkwijzeImg from '@/assets/home/hero-werkwijze.jpg';
import premieImg from '@/assets/home/blog-trends-2026.jpg';

type ServiceKey = 'dakwerken' | 'gevel' | 'default';

const COPY: Record<ServiceKey, { label: string; expert: string }> = {
  dakwerken: { label: 'dakwerken', expert: 'dakdekker' },
  gevel:     { label: 'gevelrenovatie', expert: 'gevel-specialist' },
  default:   { label: 'aanvraag', expert: 'projectleider' },
};

export default function Bedankt() {
  const [searchParams] = useSearchParams();
  const param = searchParams.get('service');
  const service: ServiceKey =
    param === 'dakwerken' ? 'dakwerken' :
    param === 'gevel' ? 'gevel' :
    'default';
  const cfg = COPY[service];

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

<section class="lf-section ab-bedankt-intro">
  <div class="wrap">
    <div class="ab-bedankt-card" data-reveal>
      <div class="ab-bedankt-check" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <span class="lf-eyebrow">Aanvraag binnen</span>
      <h1 class="lf-h2 ab-bedankt-h1">Bedankt — we zijn met uw<br/><span class="ab-mark">${cfg.label}</span>-aanvraag bezig.</h1>
      <p class="lf-lede ab-bedankt-lede">Een van onze ${cfg.expert}s neemt binnen één werkdag persoonlijk contact met u op. We luisteren naar wat u nodig heeft en plannen samen een gratis plaatsbezoek in op een moment dat u past.</p>
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
        <p>Binnen vijf werkdagen. Onze ${cfg.expert} komt langs, meet op, neemt foto's en bespreekt opties. Vrijblijvend, geen verplichting.</p>
      </div>
      <div class="ab-flow-card" data-reveal data-reveal-delay="3">
        <div class="ab-flow-num">FASE 04</div>
        <h5>Offerte op maat</h5>
        <p>Vijf à tien dagen later. Vaste prijs, geldig 30 dagen, fotorapport van het plaatsbezoek en premie-dossier voorbereid.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="ab-quote" data-reveal>
      "Een goede renovatie begint met luisteren. Daarom plannen we eerst een rustig telefoontje en pas dan een plaatsbezoek. Geen verkoperstrucs, geen drukte — gewoon kijken wat u nodig heeft en of wij dat correct voor u kunnen uitvoeren."
      <footer>De ploeg van AB Bouw Groep</footer>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft">
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

<section class="lf-section">
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
.ab-bedankt-intro { padding-top: 140px; padding-bottom: 56px; }
.ab-bedankt-card {
  max-width: 760px; margin: 0 auto; text-align: center;
}
.ab-bedankt-check {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  margin: 0 auto 22px;
  box-shadow: 0 12px 28px -10px rgba(217, 140, 3, 0.45);
}
.ab-bedankt-h1 { margin-top: 12px; }
.ab-bedankt-lede { margin: 18px auto 28px; max-width: 600px; }
.ab-bedankt-actions { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.ab-bedankt-actions .lf-cta-pill { display: inline-flex; }
.ab-bedankt-sub { font-size: 12.5px; color: var(--ink-mute); }
`;
