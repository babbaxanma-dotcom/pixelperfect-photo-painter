import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from './_shell';

// Reviews — pick 3 per service voor trust-reinforcement direct na submit
import revStijn from '@/assets/reviews/stijn.jpg';
import revLieve from '@/assets/reviews/lieve.jpg';
import revYusuf from '@/assets/reviews/yusuf.jpg';
import revJasmien from '@/assets/reviews/jasmien.jpg';
import revHicham from '@/assets/reviews/hicham.jpg';
import revDimitri from '@/assets/reviews/dimitri.jpg';
import revGreet from '@/assets/reviews/greet.jpg';
import revAhmed from '@/assets/reviews/ahmed.jpg';
import revTine from '@/assets/reviews/tine.jpg';

type ServiceKey = 'dakwerken' | 'gevel' | 'default';

const SERVICE_CONFIG: Record<ServiceKey, {
  label: string;
  expert: string;
  reviews: { name: string; role: string; img: string; text: string }[];
}> = {
  dakwerken: {
    label: 'dakwerken',
    expert: 'dakdekker',
    reviews: [
      { name: 'Stijn D.', role: 'Pannendak Mechelen', img: revStijn, text: 'Rijwoning had een dak van 1962, lekte op drie plaatsen. AB Bouw lag vrijdag waterdicht. Premie €4.200 een maand later op de rekening.' },
      { name: 'Lieve H.', role: 'Plat dak EPDM Antwerpen', img: revLieve, text: 'Vrijdag een natte vlek op het plafond, maandag stond de ploeg op het dak. 70 m² EPDM in één stuk gelegd. Factuur klopte tot op de euro.' },
      { name: 'Yusuf D.', role: 'Sarkingisolatie Bornem', img: revYusuf, text: 'Sarkingisolatie + nieuwe Koramic pannen. Werf was elke vrijdag opgeruimd. Communicatie via app — wist altijd waar we stonden.' },
    ],
  },
  gevel: {
    label: 'gevelrenovatie',
    expert: 'gevel-specialist',
    reviews: [
      { name: 'Jasmien D.', role: 'Witte crepi Mechelen', img: revJasmien, text: 'Onze rijwoning had een vermoeide bezetting uit de jaren \'80. Nu een spierwitte crepi-gevel die je zo van een magazine plukt.' },
      { name: 'Dimitri M.', role: 'Crepi + ETICS Antwerpen', img: revDimitri, text: 'Halfopen woning uit 1968 die nooit was geïsoleerd. 16 cm EPS + crepi. Comfort-sprong enorm, premie €5.400 vlot uitbetaald.' },
      { name: 'Hicham B.', role: 'Gevelisolatie Mechelen', img: revHicham, text: 'Eerste aannemer wilde alleen crepi over de bestaande gevel. AB Bouw legde uit waarom ETICS-isolatie nodig was. Geen spijt van die keuze.' },
    ],
  },
  default: {
    label: 'aanvraag',
    expert: 'projectleider',
    reviews: [
      { name: 'Greet V.', role: 'Totaalrenovatie Lier', img: revGreet, text: 'Volledige renovatie van A tot Z. Eén aanspreekpunt, alles op tijd, eindfactuur klopte met de offerte. Geen verrassingen.' },
      { name: 'Ahmed K.', role: 'Badkamerrenovatie Vilvoorde', img: revAhmed, text: 'Inloopdouche + microcement. Werfleider belde elke vrijdag voor update. Klaar binnen de afgesproken termijn.' },
      { name: 'Tine M.', role: 'Aanbouw Bonheiden', img: revTine, text: 'Aanbouw met zinkwerk en grote raampartij. Architectenplan werd 1-op-1 uitgevoerd, ploeg dacht actief mee bij detail-uitwerking.' },
    ],
  },
};

export default function Bedankt() {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const service: ServiceKey =
    serviceParam === 'dakwerken' ? 'dakwerken' :
    serviceParam === 'gevel' ? 'gevel' :
    'default';
  const cfg = SERVICE_CONFIG[service];

  useEffect(() => {
    document.title = 'Bedankt voor uw aanvraag | AB Bouw Groep';

    // Noindex — bedankt-pagina mag niet in Google search
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.setAttribute('name', 'robots'); document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, nofollow');

    const prevClass = document.body.className;
    document.body.className = 'ab-body bedankt-page';
    const style = document.createElement('style');
    style.textContent = SHELL_STYLE + BEDANKT_EXTRA;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    return () => { document.body.className = prevClass; style.remove(); };
  }, []);
  useAbBouwInteractions();

  const html = `
${buildNav('home')}

<section class="bedankt-hero">
  <div class="wrap bedankt-hero-inner">
    <div class="bedankt-check" data-reveal>
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
    </div>
    <span class="lf-eyebrow" data-reveal>Aanvraag binnen</span>
    <h1 class="bedankt-h1" data-reveal>Bedankt — we zijn met uw <span class="ab-mark">${cfg.label}</span>-aanvraag bezig.</h1>
    <p class="bedankt-lede" data-reveal>Een van onze ${cfg.expert}s neemt binnen één werkdag persoonlijk contact met u op. We luisteren naar wat u nodig heeft en plannen samen een gratis plaatsbezoek in op een moment dat u past.</p>
    <div class="bedankt-actions" data-reveal>
      <a href="tel:+32470634413" class="lf-cta-pill">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>Liever direct bellen? +32 470 63 44 13</span>
      </a>
      <span class="bedankt-actions-sub">Bereikbaar ma-vr 07:00 - 18:00</span>
    </div>
  </div>
</section>

<section class="lf-section bedankt-timeline-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Wat gebeurt er nu</span>
      <h2 class="lf-h2">Stap voor stap — geen verrassingen.</h2>
    </div>
    <div class="bedankt-timeline">
      <div class="bedankt-step" data-reveal data-reveal-delay="1">
        <div class="bedankt-step-num">01</div>
        <div class="bedankt-step-when">Vandaag</div>
        <h3>Bevestiging via e-mail</h3>
        <p>U krijgt binnen één uur een e-mail met de samenvatting van uw aanvraag en onze contactgegevens.</p>
      </div>
      <div class="bedankt-step" data-reveal data-reveal-delay="2">
        <div class="bedankt-step-num">02</div>
        <div class="bedankt-step-when">Eerstvolgende werkdag</div>
        <h3>Telefonische intake</h3>
        <p>Een korte babbel (10 à 15 min) waarin we luisteren naar wat u wil. Geen verkooppraat — gewoon de juiste vragen om u correct te kunnen helpen.</p>
      </div>
      <div class="bedankt-step" data-reveal data-reveal-delay="3">
        <div class="bedankt-step-when">Binnen 5 werkdagen</div>
        <div class="bedankt-step-num">03</div>
        <h3>Gratis plaatsbezoek</h3>
        <p>Onze ${cfg.expert} komt langs, meet alles op, neemt foto's en bespreekt mogelijke opties met u. Vrijblijvend, geen enkele verplichting.</p>
      </div>
      <div class="bedankt-step" data-reveal data-reveal-delay="4">
        <div class="bedankt-step-num">04</div>
        <div class="bedankt-step-when">5 à 10 dagen later</div>
        <h3>Vrijblijvende offerte met fotorapport</h3>
        <p>U krijgt een bindende offerte met vaste prijs, fotorapport van het plaatsbezoek en het premie-dossier alvast voorbereid. Geldig 30 dagen.</p>
      </div>
    </div>
  </div>
</section>

<section class="lf-section bedankt-trust-section">
  <div class="wrap">
    <div class="bedankt-trust-grid">
      <div class="bedankt-trust-text" data-reveal>
        <span class="lf-eyebrow">Geen zorgen</span>
        <h2 class="lf-h2">U bent in goede handen.</h2>
        <ul class="ab-checks">
          <li>Erkend bouwbedrijf in Willebroek sinds 2010 — 100+ realisaties</li>
          <li>Eigen ploegen, eigen werfleiders — geen onderaannemers</li>
          <li>10 jaar wettelijke aansprakelijkheid via Federale Verzekering</li>
          <li>Geen voorschot voor materialen die u nog niet zag (30/40/30 verdeling)</li>
          <li>Premie-dossier Mijn VerbouwPremie inbegrepen</li>
        </ul>
      </div>
      <div class="bedankt-reviews" data-reveal>
        ${cfg.reviews.map(r => `
          <div class="bedankt-review-card">
            <div class="bedankt-review-head">
              <img src="${r.img}" alt="${r.name}" loading="lazy"/>
              <div>
                <strong>${r.name}</strong>
                <span>${r.role}</span>
              </div>
              <div class="bedankt-review-stars">★★★★★</div>
            </div>
            <p>"${r.text}"</p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</section>

<section class="lf-section bedankt-explore-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Ondertussen</span>
      <h2 class="lf-h2">Even tijd te doden? Bekijk dit.</h2>
    </div>
    <div class="bedankt-explore-grid">
      <a href="/realisaties" class="bedankt-explore-card" data-reveal data-reveal-delay="1">
        <div class="bedankt-explore-icon">📐</div>
        <h3>Onze 100+ realisaties</h3>
        <p>Bekijk projecten van dakwerken tot totaalrenovatie. Echte huizen, echte klanten, echte fotorapporten.</p>
        <span class="bedankt-explore-cta">Bekijk realisaties →</span>
      </a>
      <a href="/blog/mijn-verbouwpremie-2026" class="bedankt-explore-card" data-reveal data-reveal-delay="2">
        <div class="bedankt-explore-icon">€</div>
        <h3>Welke premies krijgt u?</h3>
        <p>Mijn VerbouwPremie 2026 in mensentaal — wat u kunt krijgen, hoe u het aanvraagt, en wat wij voor u regelen.</p>
        <span class="bedankt-explore-cta">Lees premie-gids →</span>
      </a>
      <a href="/werkwijze" class="bedankt-explore-card" data-reveal data-reveal-delay="3">
        <div class="bedankt-explore-icon">⚙</div>
        <h3>Onze werkwijze</h3>
        <p>Van eerste contact tot oplevering — hoe we projecten aanpakken en wat u van ons mag verwachten.</p>
        <span class="bedankt-explore-cta">Bekijk werkwijze →</span>
      </a>
    </div>
  </div>
</section>

${FOOTER}
  `;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const BEDANKT_EXTRA = `
.bedankt-page { background: linear-gradient(180deg, #f6f4f0 0%, #fff 280px); }

/* HERO */
.bedankt-hero { padding: 120px 0 56px; text-align: center; }
.bedankt-hero-inner { max-width: 780px; margin: 0 auto; padding: 0 24px; }
.bedankt-check {
  width: 96px; height: 96px; border-radius: 50%;
  background: #2ea466; color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 16px 40px -12px rgba(46, 164, 102, 0.45);
}
.bedankt-h1 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(36px, 5.4vw, 56px);
  font-weight: 600;
  line-height: 1.08;
  margin: 12px 0 18px;
  color: var(--navy);
  letter-spacing: -0.01em;
}
.bedankt-lede {
  font-size: 18px; line-height: 1.6; color: var(--ink-soft);
  max-width: 640px; margin: 0 auto 32px;
}
.bedankt-actions { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.bedankt-actions-sub { font-size: 12.5px; color: var(--ink-mute); }

/* TIMELINE */
.bedankt-timeline-section { padding: 56px 0 72px; }
.bedankt-timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-top: 36px;
}
.bedankt-step {
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 16px;
  padding: 28px 22px;
  position: relative;
  box-shadow: 0 4px 16px -6px rgba(10,22,40,0.08);
}
.bedankt-step-num {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 38px; font-weight: 600;
  color: var(--orange);
  line-height: 1; margin-bottom: 6px;
}
.bedankt-step-when {
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--ink-mute); margin-bottom: 14px;
}
.bedankt-step h3 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px; font-weight: 600;
  color: var(--navy); margin: 0 0 8px;
  line-height: 1.2;
}
.bedankt-step p {
  font-size: 13.5px; line-height: 1.5; color: var(--ink-soft); margin: 0;
}
@media (max-width: 1000px) { .bedankt-timeline { grid-template-columns: 1fr 1fr; gap: 14px; } }
@media (max-width: 560px) { .bedankt-timeline { grid-template-columns: 1fr; } }

/* TRUST */
.bedankt-trust-section { padding: 72px 0; background: var(--cream); }
.bedankt-trust-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 56px;
  align-items: start;
}
.bedankt-trust-text .lf-h2 { margin-bottom: 24px; }
.bedankt-reviews { display: grid; gap: 14px; }
.bedankt-review-card {
  background: #fff;
  border: 1px solid rgba(10,22,40,0.06);
  border-radius: 14px;
  padding: 18px 20px;
}
.bedankt-review-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}
.bedankt-review-head img {
  width: 44px; height: 44px; border-radius: 50%; object-fit: cover;
}
.bedankt-review-head strong { display: block; color: var(--navy); font-size: 14px; }
.bedankt-review-head span { display: block; color: var(--ink-mute); font-size: 12px; }
.bedankt-review-stars { color: var(--orange); font-size: 13px; }
.bedankt-review-card p {
  font-size: 13.5px; line-height: 1.55; color: var(--ink-soft);
  margin: 0; font-style: italic;
}
@media (max-width: 900px) { .bedankt-trust-grid { grid-template-columns: 1fr; gap: 36px; } }

/* EXPLORE CARDS */
.bedankt-explore-section { padding: 72px 0 96px; }
.bedankt-explore-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 36px;
}
.bedankt-explore-card {
  background: #fff;
  border: 1px solid rgba(10,22,40,0.08);
  border-radius: 16px;
  padding: 28px 24px;
  text-decoration: none;
  color: var(--navy);
  transition: transform .3s ease, box-shadow .3s ease;
  display: flex; flex-direction: column;
}
.bedankt-explore-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px -16px rgba(10,22,40,0.18);
}
.bedankt-explore-icon {
  font-size: 28px; margin-bottom: 14px;
  width: 48px; height: 48px; border-radius: 12px;
  background: rgba(217, 140, 3, 0.10); color: var(--orange);
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 700;
}
.bedankt-explore-card h3 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px; font-weight: 600;
  color: var(--navy); margin: 0 0 8px;
}
.bedankt-explore-card p {
  font-size: 13.5px; line-height: 1.55; color: var(--ink-soft);
  margin: 0 0 18px; flex: 1;
}
.bedankt-explore-cta {
  font-size: 13px; font-weight: 600;
  color: var(--orange); margin-top: auto;
}
@media (max-width: 900px) { .bedankt-explore-grid { grid-template-columns: 1fr; gap: 14px; } }
`;
