import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';

import hero from '@/assets/home/hero.jpg';
import hero2 from '@/assets/home/hero-2.jpg';
import hero3 from '@/assets/home/hero-3.jpg';
import hero4 from '@/assets/home/hero4.jpg';
import hero5 from '@/assets/home/hero5.jpg';
import about from '@/assets/home/about.jpg';
import skills from '@/assets/home/skills.jpg';
import vakmanDak from '@/assets/home/vakman-dak.jpg';
import vakmanInterieur from '@/assets/home/vakman-interieur.jpg';
import why from '@/assets/home/why.jpg';
import svcConstruct from '@/assets/home/svc-construct.jpg';
import svcEco from '@/assets/home/svc-eco.jpg';
import svcInterieur from '@/assets/home/svc-interieur.jpg';
import svcDak from '@/assets/home/svc-dak.jpg';
import svcBad from '@/assets/home/svc-bad.jpg';
import svcGevel from '@/assets/home/svc-gevel.jpg';
import proj1 from '@/assets/home/proj1.jpg';
import proj2 from '@/assets/home/proj2.jpg';
import proj3 from '@/assets/home/proj3.jpg';
import proj4 from '@/assets/home/proj4.jpg';
import team1 from '@/assets/home/team1.jpg';
import team2 from '@/assets/home/team2.jpg';
import team3 from '@/assets/home/team3.jpg';
import ctaMan from '@/assets/home/cta-man.jpg';
import blog1 from '@/assets/home/blog1.jpg';
import blog2 from '@/assets/home/blog2.jpg';
import blog3 from '@/assets/home/blog3.jpg';
import logo from '@/assets/home/logo.png';
import logoHero from '@/assets/home/logo-hero.png';

const HTML = (i: Record<string, string>) => `


<!-- NAV (floating white pill over hero) -->
<nav class="lf-nav hero-mode" id="nav">
  <div class="wrap lf-nav-inner">
    <a class="lf-brand" href="/">
      <img src="${i.logo}" alt="AB Bouw Groep" class="lf-brand-logo" />
    </a>
    <ul class="lf-menu">
      <li><a href="/" class="active">Home</a></li>
      <li><a href="/over">Over ons</a></li>
      <li><a href="/diensten">Diensten</a></li>
      <li><a href="/werkwijze">Werkwijze</a></li>
      <li><a href="/realisaties">Realisaties</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
    <a href="tel:+32470634413" class="lf-nav-phone">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      +32 470 63 44 13
    </a>
    <button class="mobile-toggle lf-mobile-toggle" onclick="toggleMobileMenu()" aria-label="Menu">☰</button>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <button class="mm-close" id="mobileMenuClose" type="button" aria-label="Sluit menu">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <div class="mm-section">
    <a href="/">Home</a><a href="/over">Over ons</a><a href="/diensten">Diensten</a>
    <a href="/werkwijze">Werkwijze</a><a href="/realisaties">Realisaties</a><a href="/contact">Contact</a>
  </div>
  <div class="mm-footer">
    <a href="tel:+32470634413">📞 +32 470 63 44 13</a>
    <a href="mailto:info@abbouwgroup.be">✉ info@abbouwgroup.be</a>
  </div>
</div>

<!-- HERO -->
<section class="lf-hero">
  <div class="lf-hero-bg lf-hero-bg--slides" data-hero-slides>
    <img src="${i.hero2}" alt="AB Bouw Group" class="is-active" />
    <img src="${i.hero4}" alt="" loading="lazy" />
    <img src="${i.hero5}" alt="" loading="lazy" />
    <img src="${i.hero3}" alt="" loading="lazy" />
  </div>
  <button type="button" class="lf-hero-arrow lf-hero-arrow--prev" data-hero-prev aria-label="Vorige foto">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  </button>
  <button type="button" class="lf-hero-arrow lf-hero-arrow--next" data-hero-next aria-label="Volgende foto">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
  <div class="wrap lf-hero-wrap">
    <div class="lf-hero-mini" data-hero-anim>
      <h1 class="lf-hero-headline">
        <span class="lf-hw" style="--i:0">Vakmanschap</span>
        <span class="lf-hw" style="--i:1">in</span>
        <span class="lf-hw" style="--i:2">heel</span>
        <span class="lf-hw" style="--i:3">Vlaanderen</span>
      </h1>
      <div class="lf-hero-actions" style="--i:7">
        <a href="#contact-form" class="lf-cta-pill" data-smooth>
          <span>Plan een kennismaking</span>
          <span class="lf-cta-pill-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </a>
        <a href="/realisaties" class="lf-hero-ghost">
          <span>Bekijk realisaties</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>


<!-- TESTIMONIALS — direct onder hero, eerste sociale proof -->
<section class="lf-section lf-tone-soft lf-reviews-section" style="padding: 56px 0;">
  <div class="wrap">
    <div class="lf-section-head centered lf-reviews-head" data-reveal style="margin-bottom: 36px;">
      <span class="lf-eyebrow">Wat klanten zeggen</span>
      <div class="lf-reviews-rating">
        <span class="lf-reviews-score">4.9</span>
        <span class="lf-reviews-divider" aria-hidden="true"></span>
        <div class="lf-reviews-meta">
          <div class="lf-reviews-stars" aria-label="4.9 van 5 sterren">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>
          </div>
          <span class="lf-reviews-count">184+ tevreden klanten</span>
        </div>
      </div>
    </div>
    <div class="lf-testi-marquee" data-testi-marquee>
      <button type="button" class="lf-testi-arrow lf-testi-arrow--prev" data-testi-prev aria-label="Vorige review">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button type="button" class="lf-testi-arrow lf-testi-arrow--next" data-testi-next aria-label="Volgende review">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="lf-testi-shift" data-testi-shift>
        <div class="lf-testi-track" data-testi-track>
          ${(() => {
            const reviews = [
              { name: 'Marc Van den Broeck', role: 'Dakrenovatie · Mechelen', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&q=80&fit=crop', text: 'Van offerte tot oplevering volledig correct. Geen meerwerken, binnen het budget, en de projectleider belde elke vrijdag met een update. Het dak ligt er strak bij.', highlights: ['volledig correct', 'binnen het budget', 'strak'] },
              { name: 'Ellen De Smet', role: 'Totaalrenovatie · Leuven', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&q=80&fit=crop', text: 'We hebben drie aannemers vergeleken. AB Bouw was de enige die alle vragen grondig beantwoordde en ook de premieaanvraag voor ons regelde. Resultaat: 3.500 euro terug.', highlights: ['grondig beantwoordde', 'premieaanvraag', '3.500 euro terug'] },
              { name: 'Katrien Peeters', role: 'Badkamer · Antwerpen', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&q=80&fit=crop', text: 'Eigen badkamerploeg, eigen tegelzetter, eigen loodgieter. Alles door dezelfde mensen. Dat zie je in het eindresultaat: vakwerk tot in de laatste voeg.', highlights: ['dezelfde mensen', 'vakwerk tot in de laatste voeg'] },
              { name: 'Pieter Janssens', role: 'Nieuwbouw · Bornem', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&q=80&fit=crop', text: 'Eerlijk, snel en correct. We kregen wekelijks een rapport en konden altijd Tom bereiken. Sleutel ontvangen op exact de afgesproken datum, dat is in deze sector zeldzaam.', highlights: ['Eerlijk, snel en correct', 'wekelijks een rapport', 'op exact de afgesproken datum'] },
              { name: 'Sofie Vermeulen', role: 'Gevelrenovatie · Sint-Niklaas', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&q=80&fit=crop', text: 'De gevel ligt er strak bij, alle buren komen vragen wie het werk gedaan heeft. Aanrader voor wie kwaliteit en stiptheid belangrijk vindt.', highlights: ['strak', 'kwaliteit en stiptheid'] },
              { name: 'Dirk Maes', role: 'Plat dak · Antwerpen', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&q=80&fit=crop', text: 'Lekkend dak op vrijdag gemeld, maandagochtend stond de ploeg op het dak. Probleem opgelost, factuur exact zoals afgesproken. Top service.', highlights: ['maandagochtend stond de ploeg op het dak', 'exact zoals afgesproken', 'Top service'] },
              { name: 'Annelies Claes', role: 'Interieur · Mechelen', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&q=80&fit=crop', text: 'Maatwerk in keuken en dressing perfect uitgevoerd. Plinten, plafonds, alles tot op de millimeter. Heldere communicatie van begin tot einde.', highlights: ['perfect uitgevoerd', 'tot op de millimeter', 'Heldere communicatie'] },
            ];
            const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const wrapWords = (phrase: string, baseI: number) => {
              const words = phrase.split(/(\s+)/);
              let wi = 0;
              return words.map((w) => {
                if (/^\s+$/.test(w)) return w;
                const idx = baseI + wi;
                wi += 1;
                return `<span class="lf-hl-word" style="--hl-i:${idx}">${w}</span>`;
              }).join('');
            };
            const highlight = (text: string, terms: string[]) => {
              let out = text;
              let wordOffset = 0;
              terms.forEach((term) => {
                const re = new RegExp(escapeRe(term), 'i');
                out = out.replace(re, (m) => {
                  const wrapped = `<mark class="lf-hl">${wrapWords(m, wordOffset)}</mark>`;
                  wordOffset += m.trim().split(/\s+/).length;
                  return wrapped;
                });
              });
              return out;
            };
            const loopedSets = [-1, 0, 1];
            return loopedSets.map((setIdx) => `
              <div class="lf-testi-set" data-testi-set="${setIdx}"${setIdx !== 0 ? ' aria-hidden="true"' : ''}>
                ${reviews.map((t, reviewIdx) => `
                  <article class="lf-testi" data-review-index="${reviewIdx}">
                    <div class="lf-testi-stars">★★★★★</div>
                    <p>${highlight(t.text, t.highlights)}</p>
                    <div class="lf-testi-divider"></div>
                    <div class="lf-testi-foot">
                      <img class="lf-testi-avatar" src="${t.img}" alt="${t.name}" loading="lazy"/>
                      <div class="lf-testi-meta">
                        <strong>${t.name}</strong>
                        <span>${t.role}</span>
                      </div>
                      <svg class="lf-testi-google" viewBox="0 0 48 48" width="22" height="22" aria-label="Review">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"/>
                        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.2 5.2C41.4 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                      </svg>
                    </div>
                  </article>
                `).join('')}
              </div>
            `).join('');
          })()}
        </div>
      </div>
    </div>
  </div>
</section>



<!-- OFFERTE FORM + TRUST BULLETS -->
<section class="lf-section lf-offerte-section">
  <div class="wrap">
    <div class="lf-offerte-head" data-reveal>
      <span class="lf-eyebrow">100% vrijblijvend</span>
      <h2 class="lf-h2">Gratis offerte of<br/>plaatsbezoek aanvragen.</h2>
      <p class="lf-lede">Binnen 24u persoonlijk contact met een ervaren vakman. Eerlijk advies en een vaste, transparante prijs.</p>
    </div>

    <aside class="lf-form lf-form-compact" id="contact-form" data-reveal data-reveal-delay="1">
      <form onsubmit="event.preventDefault(); alert('Bedankt, we nemen binnen 24u contact op.');">
        <div class="lf-form-row">
          <input type="text" placeholder="Voornaam" required />
          <input type="text" placeholder="Achternaam" required />
        </div>
        <div class="lf-form-row">
          <input type="email" placeholder="E-mailadres" required />
          <input type="tel" placeholder="Telefoonnummer" required />
        </div>
        <div class="lf-dd" data-dd>
          <button type="button" class="lf-dd-toggle" data-dd-toggle aria-haspopup="listbox" aria-expanded="false">
            <span class="lf-dd-label" data-dd-label>Welke dienst interesseert u?</span>
            <svg class="lf-dd-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <ul class="lf-dd-list" role="listbox">
            <li role="option" data-dd-opt>Algemene aanneming</li>
            <li role="option" data-dd-opt>Dakwerken</li>
            <li role="option" data-dd-opt>Interieurwerken</li>
            <li role="option" data-dd-opt>Badkamer / wellness</li>
            <li role="option" data-dd-opt>Gevelbekleding</li>
            <li role="option" data-dd-opt>Ecologisch bouwen</li>
          </ul>
          <input type="hidden" name="dienst" data-dd-input required />
        </div>
        <button type="submit" class="lf-cta-pill lf-cta-pill-block">
          <span>Vraag mijn gratis offerte aan</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </button>
        <p class="lf-form-foot">Of bel direct <a href="tel:+32470634413">+32 470 63 44 13</a></p>
      </form>
    </aside>

    <div class="lf-mini-bullets" data-reveal data-reveal-delay="2">
      <div class="lf-mini-bullet">
        <div class="lf-mini-bullet-num">01</div>
        <div>
          <h4>Eigen vakmensen</h4>
          <p>23 vaste medewerkers in eigen dienst. Geen onderaannemers.</p>
        </div>
      </div>
      <div class="lf-mini-bullet">
        <div class="lf-mini-bullet-num">02</div>
        <div>
          <h4>Vaste prijs, schriftelijk</h4>
          <p>Bindende offerte. Geen verrassingen op de eindfactuur.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SERVICES GRID -->
<section class="lf-section lf-services">
  <div class="wrap">
    <div class="lf-section-head" data-reveal>
      <span class="lf-eyebrow">Onze diensten</span>
      <h2 class="lf-h2">Zes specialisaties.<br>Eén bouwpartner.</h2>
    </div>
    <div class="lf-svc-grid" data-svc-stack>
      ${[
        { img: i.svcConstruct, n: '01', title: 'AB Construct', desc: 'Nieuwbouw en totaalrenovatie sleutel-op-de-deur. Eén contract, één planning, één resultaat.', href: '/construct' },
        { img: i.svcEco, n: '02', title: 'AB Ecologisch', desc: 'Duurzaam bouwen met natuurlijke materialen. Lager E-peil, lagere energiefactuur.', href: '/ecologisch' },
        { img: i.svcInterieur, n: '03', title: 'AB Interieurwerken', desc: 'Maatwerk in gyproc, vloeren, schrijnwerk en plafonds. Strak afgewerkt tot in de plint.', href: '/interieur' },
        { img: i.svcDak, n: '04', title: 'AB Dakwerken', desc: 'Hellende en platte daken, dakisolatie en zinkwerk. Door eigen dakdekkers geplaatst.', href: '/dakwerken' },
        { img: i.svcBad, n: '05', title: 'AB Bad &amp; Wellness', desc: 'Sleutel-op-de-deur badkamers met premium tegels en sanitair. Klaar in vier weken.', href: '/bad' },
        { img: i.svcGevel, n: '06', title: 'AB Gevelbekleding', desc: 'Witte of grijze crepi, sierpleister of steenstrips. Tijdloos én onderhoudsarm.', href: '/gevel' },
      ].map((s, idx, arr) => `
        <div class="lf-svc-slot" data-svc-slot style="--svc-i:${idx};--svc-total:${arr.length}">
          <a class="lf-svc-card" href="${s.href}" data-svc-card style="--svc-i:${idx};--svc-total:${arr.length}">
            <div class="lf-svc-img"><img src="${s.img}" alt="${s.title}" loading="lazy" /><span class="lf-svc-num">${s.n}</span></div>
            <div class="lf-svc-body">
              <h4>${s.title}</h4>
              <p>${s.desc}</p>
              <span class="lf-svc-link">Lees meer
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>
          </a>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- PARTNER LOGOS -->
<section class="lf-partners">
  <div class="wrap">
    <div class="lf-partners-head">
      <span class="lf-partners-eyebrow">Onze partners</span>
      <p>Wij verwerken enkel materialen van fabrikanten die voldoen aan de strengste Belgische bouwnormen.</p>
    </div>
    <div class="lf-marquee">
      <div class="lf-marquee-track">
        ${Array.from({ length: 2 }).map(() => `
          <div class="lf-marquee-set">
            <img src="/assets/logos/dorken.png" alt="Dörken" loading="lazy" />
            <img src="/assets/logos/eternit.png" alt="Eternit" loading="lazy" />
            <img src="/assets/logos/isoproc.png" alt="Isoproc" loading="lazy" />
            <img src="/assets/logos/isover.png" alt="Isover" loading="lazy" />
            <img src="/assets/logos/knauf.png" alt="Knauf" loading="lazy" />
            <img src="/assets/logos/koramic.png" alt="Koramic" loading="lazy" />
            <img src="/assets/logos/mato.png" alt="Mato" loading="lazy" />
            <img src="/assets/logos/rectic.png" alt="Recticel" loading="lazy" />
          </div>`).join('')}
      </div>
    </div>
  </div>
</section>

<!-- STATS COUNTERS -->
<section class="lf-stats">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">In cijfers</span>
      <h2 class="lf-h2">Vakmanschap dat<br>zich laat tellen.</h2>
    </div>
     <div class="lf-stats-pin" data-hpin>
      <div class="lf-stats-grid">
       <div class="lf-stat-card" data-reveal>
        <div class="lf-stat-photo"><img src="${i.svcDak}" alt="" loading="lazy"/></div>
        <div class="lf-stat-body">
          <div class="lf-stat-num"><span class="lf-stat-dot"></span><span data-count="48325">0</span><span class="lf-stat-suffix">m²</span></div>
          <div class="lf-stat-label">Afgewerkte daken</div>
        </div>
      </div>
      <div class="lf-stat-card" data-reveal data-reveal-delay="1">
        <div class="lf-stat-photo"><img src="${i.svcGevel}" alt="" loading="lazy"/></div>
        <div class="lf-stat-body">
          <div class="lf-stat-num"><span class="lf-stat-dot"></span><span data-count="63112">0</span><span class="lf-stat-suffix">m²</span></div>
          <div class="lf-stat-label">Afgewerkte gevels</div>
        </div>
      </div>
      <div class="lf-stat-card" data-reveal data-reveal-delay="2">
        <div class="lf-stat-photo"><img src="${i.svcConstruct}" alt="" loading="lazy"/></div>
        <div class="lf-stat-body">
          <div class="lf-stat-num"><span class="lf-stat-dot"></span><span data-count="184">0</span><span class="lf-stat-suffix">+</span></div>
          <div class="lf-stat-label">Opgeleverde projecten</div>
        </div>
      </div>
      <div class="lf-stat-card lf-stat-card--nophoto" data-reveal data-reveal-delay="3">
        <div class="lf-stat-body">
          <div class="lf-stat-num"><span class="lf-stat-dot"></span><span data-count="1326">0</span><span class="lf-stat-suffix">+</span></div>
          <div class="lf-stat-label">Tevreden klanten</div>
        </div>
      </div>
      </div>
     </div>
  </div>
</section>

<!-- WHY US, collage -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Waarom AB Bouw Group</span>
      <h2 class="lf-h2">De bouwpartner waar u<br>écht op kan rekenen.</h2>
    </div>
    <div class="lf-why-collage lf-why-stack" data-why-seq data-why-stack>
      <div class="lf-why-stack-left">
        <div class="lf-why-slot" data-why-slot>
          <div class="lf-why-tile" data-why-step="0" data-why-card style="--why-i:0;--why-total:4">
            <div class="lf-why-meta"><span class="lf-why-num">01</span><span class="lf-why-label">Ontzorging</span></div>
            <h5>Wij regelen ook de papierwinkel</h5>
            <p>Stedenbouwkundige vergunning, EPB-verslag, premieaanvraag Mijn VerbouwPremie en oplevering bij de architect. U tekent, wij regelen.</p>
          </div>
        </div>
        <div class="lf-why-slot" data-why-slot>
          <div class="lf-why-tile" data-why-step="1" data-why-card style="--why-i:1;--why-total:4">
            <div class="lf-why-meta"><span class="lf-why-num">02</span><span class="lf-why-label">Planning</span></div>
            <h5>Wekelijks werfrapport in uw mailbox</h5>
            <p>Elke vrijdag een korte update met foto's, voortgang en planning voor de week erop. Vertraging? U weet het meteen, niet pas op de opleveringsdag.</p>
          </div>
        </div>
        <div class="lf-why-slot" data-why-slot>
          <div class="lf-why-tile" data-why-step="2" data-why-card style="--why-i:2;--why-total:4">
            <div class="lf-why-meta"><span class="lf-why-num">03</span><span class="lf-why-label">Garantie</span></div>
            <h5>10-jarige aansprakelijkheid, wettelijk verzekerd</h5>
            <p>VCA*-gecertificeerd, aangesloten bij Bouwunie. Polis stabiliteit en waterdichtheid via Federale Verzekering.</p>
          </div>
        </div>
        <div class="lf-why-slot" data-why-slot>
          <div class="lf-why-tile" data-why-step="3" data-why-card style="--why-i:3;--why-total:4">
            <div class="lf-why-meta"><span class="lf-why-num">04</span><span class="lf-why-label">Vaste ploeg</span></div>
            <h5>Eigen ploegen op uw werf</h5>
            <p>23 mensen in vaste dienst, metselaars, dakdekkers, tegelzetters, schrijnwerkers. Eén verantwoordelijkheid, één kwaliteitsstandaard.</p>
          </div>
        </div>
      </div>
      <div class="lf-why-photo" data-reveal><img src="${i.why}" alt="" loading="lazy"/></div>
    </div>

    <div class="lf-trust-strip" data-reveal data-trust-strip>
      <div class="lf-trust-item" data-trust-i="0"><strong>VCA*-gecertificeerd</strong><span>Veiligheid op de werf</span></div>
      <div class="lf-trust-divider"></div>
      <div class="lf-trust-item" data-trust-i="1"><strong>Lid Bouwunie</strong><span>Vlaamse Confederatie Bouw</span></div>
      <div class="lf-trust-divider"></div>
      <div class="lf-trust-item" data-trust-i="2"><strong>BE 0712.443.881</strong><span>Federale Verzekering · polis 24/0089</span></div>
    </div>
  </div>
</section>

<!-- SKILLS / CRAFTSMANSHIP -->
<section class="lf-section">
  <div class="wrap lf-skills-grid">
    <div class="lf-skills-text" data-reveal>
      <span class="lf-eyebrow">Onze expertise</span>
      <h2 class="lf-h2">Vakmanschap dat<br>het verschil maakt.</h2>
      <p class="lf-lede">Onze vakmensen werken al meer dan een decennium samen op de werf. Die ervaring zit in elk detail: van de eerste fundering tot de laatste verfstreek.</p>
      <div class="lf-bars">
        <div class="lf-bar"><div class="lf-bar-head"><span>Vakmanschap &amp; afwerking</span><span class="lf-bar-pct">95<em>%</em></span></div><div class="lf-bar-track"><i style="width:95%"><span class="lf-bar-knob"></span></i></div></div>
        <div class="lf-bar"><div class="lf-bar-head"><span>Moderne bouwtechnieken</span><span class="lf-bar-pct">93<em>%</em></span></div><div class="lf-bar-track"><i style="width:93%"><span class="lf-bar-knob"></span></i></div></div>
        <div class="lf-bar"><div class="lf-bar-head"><span>Probleemoplossend denken</span><span class="lf-bar-pct">99<em>%</em></span></div><div class="lf-bar-track"><i style="width:99%"><span class="lf-bar-knob"></span></i></div></div>
      </div>
      <a href="/over" class="lf-btn-pri lf-btn-sm"><span>Lees meer</span></a>
    </div>
    <div class="lf-skills-collage" data-reveal data-reveal-delay="1">
      <img class="lf-skills-img1" src="${i.vakmanDak}" alt="Dakwerker plaatst Koramic dakpannen" loading="lazy"/>
      <img class="lf-skills-img2" src="${i.vakmanInterieur}" alt="Schrijnwerker plaatst maatkast in eik" loading="lazy"/>
    </div>
  </div>
</section>

<!-- PROCESS / WERKWIJZE -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Onze werkwijze</span>
      <h2 class="lf-h2">Van eerste gesprek tot<br>sleutel op de deur.</h2>
      <p class="lf-lede" style="margin: 0 auto;">Eén transparant traject in vijf stappen. U weet vooraf precies wat er wanneer gebeurt, en wie u aanspreekt voor elke vraag.</p>
    </div>
    <div class="lf-process">
      <div class="lf-process-line"></div>
      <div class="lf-process-step" data-reveal>
        <div class="lf-process-num">01</div>
        <h5>Kennismaking &amp; plaatsbezoek</h5>
        <p>Binnen 5 werkdagen langs voor een gratis plaatsbezoek. We luisteren, meten op en adviseren, zonder verkooppraat.</p>
        <span class="lf-process-time">Week 1</span>
      </div>
      <div class="lf-process-step" data-reveal data-reveal-delay="1">
        <div class="lf-process-num">02</div>
        <h5>Offerte op maat</h5>
        <p>Bindende offerte met gedetailleerde meetstaat. Materialen, uurloon en timing, alles uitgesplitst, niets verborgen.</p>
        <span class="lf-process-time">Week 2–3</span>
      </div>
      <div class="lf-process-step" data-reveal data-reveal-delay="2">
        <div class="lf-process-num">03</div>
        <h5>Vergunning &amp; planning</h5>
        <p>Wij regelen vergunning, premies en architectencoördinatie. U krijgt een gedeeld werfdossier in onze klantenportaal.</p>
        <span class="lf-process-time">Week 4–14</span>
      </div>
      <div class="lf-process-step" data-reveal data-reveal-delay="3">
        <div class="lf-process-num">04</div>
        <h5>Uitvoering op de werf</h5>
        <p>Vaste projectleider, eigen ploegen, wekelijks rapport. Vaste werfopruim op vrijdagavond, ook tijdens uw afwezigheid.</p>
        <span class="lf-process-time">Variabel</span>
      </div>
      <div class="lf-process-step" data-reveal data-reveal-delay="4">
        <div class="lf-process-num">05</div>
        <h5>Oplevering &amp; nazorg</h5>
        <p>Gezamenlijke rondgang met opleveringsverslag. Eén jaar later komen we gratis terug voor een nacontrole.</p>
        <span class="lf-process-time">Sleutelmoment</span>
      </div>
    </div>
  </div>
</section>

<!-- PROJECTS -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Realisaties</span>
      <h2 class="lf-h2">Projecten die de tand<br>des tijds doorstaan.</h2>
    </div>
    <div class="lf-proj-tabs-wrap" data-reveal>
      <div class="lf-proj-tabs" data-proj-tabs>
        <button class="lf-proj-chip active" data-proj-filter="all"><span class="lf-chip-dot"></span>Alle projecten</button>
        <button class="lf-proj-chip" data-proj-filter="dakwerken">Dakwerken</button>
        <button class="lf-proj-chip" data-proj-filter="renovatie">Renovatie</button>
        <button class="lf-proj-chip" data-proj-filter="nieuwbouw">Nieuwbouw</button>
        <button class="lf-proj-chip" data-proj-filter="interieur">Interieur</button>
      </div>
    </div>
    <div class="lf-proj-collage" data-reveal data-proj-collage>
      ${[
        { img: 'proj1', cat: 'nieuwbouw', title: 'Nieuwbouw', place: 'Antwerpen' },
        { img: 'proj2', cat: 'renovatie', title: 'Renovatie', place: 'Mechelen' },
        { img: 'proj3', cat: 'interieur', title: 'Interieur', place: 'Brussel' },
        { img: 'proj4', cat: 'dakwerken', title: 'Dakwerken', place: 'Lier' },
      ].map(p => `
        <a href="/realisaties" class="lf-proj-cell" data-proj-cat="${p.cat}">
          <div class="lf-proj-img"><img src="${(i as any)[p.img]}" alt="${p.title} ${p.place}" loading="lazy"/></div>
          <div class="lf-proj-cap">
            <div>
              <span class="lf-proj-cap-cat">${p.title}</span>
              <strong>${p.place}</strong>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </a>
      `).join('')}
    </div>
  </div>
</section>


<!-- BLOG -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Bouwblog 2026</span>
      <h2 class="lf-h2">Inzichten uit de praktijk<br>op de werf van vandaag.</h2>
      <p class="lf-lede" style="margin: 0 auto;">Tips, trends en technieken, geschreven door onze eigen experts. Zo maakt u onderbouwde keuzes voor uw woning.</p>
    </div>
    <div class="lf-blog-grid">
      ${[
        { img: i.blog1, tag: 'Trends 2026', day: '12', month: 'mrt', date: '12 maart 2026', author: 'Door Tom V.', title: 'Bouwen in 2026: zo verandert de Vlaamse woningmarkt', excerpt: 'Strengere EPC-eisen, circulair bouwen en nieuwe premies. Waarom 2026 hét moment is voor een toekomstgerichte renovatie.', href: '#' },
        { img: i.blog2, tag: 'Energie', day: '05', month: 'mrt', date: '5 maart 2026', author: 'Door Bart D.', title: 'Warmtepomp en zonnepanelen: de slimme combinatie', excerpt: 'Hoe een hybride energiesysteem uw maandfactuur tot 70% verlaagt, en welke premies u in 2026 niet mag missen.', href: '#' },
        { img: i.blog3, tag: 'Interieur', day: '28', month: 'feb', date: '28 februari 2026', author: 'Door Lisa M.', title: '5 badkamertrends die uw woning meer waard maken', excerpt: 'Walk-in douches, natuurlijke materialen en slim sanitair. Onze interieurarchitect deelt de must-haves voor 2026.', href: '#' },
      ].map(b => `
        <article class="lf-blog-card" data-reveal>
          <div class="lf-blog-img">
            <img src="${b.img}" alt="${b.title}" loading="lazy"/>
            <span class="lf-blog-tag">${b.tag}</span>
            <span class="lf-blog-date-badge"><strong>${b.day}</strong><em>${b.month}</em></span>
          </div>
          <div class="lf-blog-body">
            <h4><a href="${b.href}">${b.title}</a></h4>
            <p>${b.excerpt}</p>
            <div class="lf-blog-foot">
              <a href="${b.href}" class="lf-blog-btn">Lees meer
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <span class="lf-blog-author">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ${b.author}
              </span>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
    <div class="lf-blog-more">
      <span class="lf-blog-dots"><i></i><i class="active"></i><i></i></span>
      <p>Meer praktijkverhalen en bouwadvies. <a href="#">Bekijk alle artikels.</a></p>
    </div>
  </div>
</section>

<!-- SUPPORT TILES -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Ondersteuning van A tot Z</span>
      <h2 class="lf-h2">Wij nemen u álles uit handen,<br>ook wat niet zichtbaar is.</h2>
    </div>
    <div class="lf-support-grid">
      <div class="lf-support-card" data-reveal data-support-card>
        <div class="lf-support-meta"><span>01</span> Vergunningen</div>
        <h5>Vergunning geregeld</h5>
        <p>Dossier, indiening en opvolging via Omgevingsloket — wij regelen alles.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="1" data-support-card>
        <div class="lf-support-meta"><span>02</span> Premies</div>
        <h5>Tot €4.200 terug</h5>
        <p>Mijn VerbouwPremie en Fluvius — berekend, aangevraagd en opgevolgd.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="2" data-support-card>
        <div class="lf-support-meta"><span>03</span> Nazorg</div>
        <h5>Service na oplevering</h5>
        <p>Gratis nacontrole na 1 jaar. Reactie binnen 48 uur in garantie.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA BANNER -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-cta" data-reveal>
      <div class="lf-cta-text">
        <h2>Bespreek vandaag nog<br>uw bouwproject met ons.</h2>
        <p>Een sterk, duurzaam resultaat begint bij een goed gesprek. Van eerste advies tot oplevering: wij staan naast u.</p>
        <div class="lf-cta-actions">
          <a href="/contact" class="lf-btn-light">Start uw project</a>
          <a href="/contact" class="lf-btn-outline">Contacteer ons</a>
        </div>
      </div>
      <div class="lf-cta-img"><img src="${i.ctaMan}" alt="" loading="lazy"/></div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-faq-grid">
      <div class="lf-faq-side" data-reveal>
        <span class="lf-eyebrow">Veelgestelde vragen</span>
        <h2 class="lf-h2">Antwoorden op de<br>vragen die u nu heeft.</h2>
        <p class="lf-lede">Staat uw vraag er niet tussen? Bel <a href="tel:+32470634413" style="color: var(--accent); font-weight:600;">+32 470 63 44 13</a> of mail <a href="mailto:info@abbouwgroup.be" style="color: var(--accent); font-weight:600;">info@abbouwgroup.be</a>. U krijgt binnen 24 uur antwoord van een vakmens, geen callcenter.</p>
        <a href="/contact" class="lf-cta-pill">
          <span>Stel uw vraag</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>
      </div>
      <div class="lf-faq-list" data-reveal data-reveal-delay="1">
        ${[
          { q: 'Hoe lang duurt een gemiddelde renovatie?', a: 'Een totaalrenovatie van een rijwoning duurt gemiddeld 4 tot 6 maanden, afhankelijk van de omvang. Een dakrenovatie is meestal klaar binnen 2 weken, een badkamer binnen 4 weken. U krijgt vooraf een gedetailleerde planning met opleverdatum.' },
          { q: 'Wat kost een plaatsbezoek?', a: 'Niets. Het eerste plaatsbezoek en het opmaken van een offerte zijn volledig gratis en vrijblijvend. U bent tot niets verplicht, pas bij ondertekening van het contract gaan we van start.' },
          { q: 'Wie staat er op mijn werf?', a: 'Onze 23 vakmensen, metselaars, dakdekkers, tegelzetters en schrijnwerkers, zijn allemaal in vaste dienst. Enkel zeer gespecialiseerd werk (zoals liftinstallatie of zwembadtechniek) besteden we uit aan vaste partners die wij sinds jaren kennen.' },
          { q: 'Welke premies kan ik krijgen?', a: 'Voor energetische renovaties komt u in aanmerking voor Mijn VerbouwPremie (tot €13.000) en eventueel Fluvius-premies. Wij berekenen vooraf op welke u recht heeft en dienen de aanvraag voor u in. Gemiddeld krijgen onze klanten €4.200 terug.' },
          { q: 'Krijg ik garantie op het werk?', a: 'Ja. U krijgt de wettelijke 10-jarige aansprakelijkheid op stabiliteit en waterdichtheid (verzekerd via Federale Verzekering, polis 24/0089), én 2 jaar garantie op afwerking. Defect binnen de garantieperiode? Wij staan binnen 48 uur op uw stoep.' },
          { q: 'Kunnen jullie ook met mijn architect samenwerken?', a: 'Zeker. We werken vaak samen met de architect die u zelf gekozen heeft. Heeft u nog geen architect? Wij brengen u in contact met drie architecten uit ons partnernetwerk waarmee we al jaren samenwerken.' },
        ].map((f, i) => `
          <div class="faq-item${i === 0 ? ' open' : ''}">
            <button class="faq-q" type="button">
              <span>${f.q}</span>
              <svg class="faq-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <div class="faq-a"><p>${f.a}</p></div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="nav-brand" href="/"><img src="${i.logo}" alt="AB Bouw Groep" class="footer-logo" /></a>
        <p>Vlaams bouw- en renovatiebedrijf met gespecialiseerde ploegen. Actief in heel Vlaanderen en Brussel sinds 2010.</p>
      </div>
      <div class="footer-col"><h5>Divisies</h5><ul>
        <li><a href="/construct">AB Construct</a></li>
        <li><a href="/ecologisch">AB Ecologisch</a></li>
        <li><a href="/interieur">AB Interieurwerken</a></li>
        <li><a href="/dakwerken">AB Dakwerken</a></li>
        <li><a href="/bad">AB Bad &amp; Wellness</a></li>
        <li><a href="/gevel">AB Gevelbekleding</a></li>
      </ul></div>
      <div class="footer-col"><h5>Bedrijf</h5><ul>
        <li><a href="/over">Over ons</a></li>
        <li><a href="/werkwijze">Werkwijze</a></li>
        <li><a href="/realisaties">Realisaties</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul></div>
      <div class="footer-col"><h5>Contact</h5><ul>
        <li><a href="tel:+32470634413">+32 470 63 44 13</a></li>
        <li><a href="mailto:info@abbouwgroup.be">info@abbouwgroup.be</a></li>
        <li><a>Willebroek, België</a></li>
        <li><a>Ma – Vr · 8u – 18u</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <div>© 2026 AB Bouw Group · BTW BE 0XXX.XXX.XXX</div>
      <div class="footer-bottom-links">
        <a href="/privacy">Privacy</a><a href="/voorwaarden">Algemene voorwaarden</a><a href="/cookies">Cookies</a>
      </div>
    </div>
  </div>
</footer>

<!-- Floating mobile call button -->
<a href="tel:+32470634413" class="lf-fab-call" aria-label="Bel ons">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  <span>Bel ons</span>
</a>
`;

const EXTRA_STYLE = `
/* ───── Lafarge-style premium home ───── */

/* Floating white pill nav over hero */
.lf-nav { position: fixed; top: 18px; left: 0; right: 0; z-index: 50; background: transparent; border: none; pointer-events: none; transition: top 0.3s var(--ease); }
.lf-nav-inner { pointer-events: auto; display:flex; align-items:center; gap:28px; padding: 10px 20px 10px 16px; max-width: min(1140px, calc(100% - 80px)); margin: 0 auto; background: #fff; border-radius: 999px; box-shadow: 0 12px 40px -12px rgba(10,22,40,0.18); transition: box-shadow 0.3s var(--ease), padding 0.3s var(--ease); }
.lf-nav.scrolled { top: 10px; }
.lf-nav.scrolled .lf-nav-inner { box-shadow: 0 16px 50px -10px rgba(10,22,40,0.28); }
.lf-brand { display:flex; align-items:center; gap:10px; font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--ink); }
.lf-brand-logo { height: 58px; width: auto; display:block; }
.lf-brand-mark { flex-shrink:0; width:38px; height:38px; display:inline-flex; align-items:center; justify-content:center; background: var(--accent) !important; color:#fff !important; font-weight:800; font-size:13px; border-radius: 999px; letter-spacing: 0.02em; }
.lf-brand-text em { font-style: normal; color: var(--accent); font-weight: 500; }
.lf-menu { display:flex; gap:24px; list-style:none; margin:0 auto; }
.lf-menu a { font-size: 14.5px; font-weight: 500; color: var(--ink-soft); transition: color 0.2s; padding: 8px 0; position: relative; }
.lf-menu a:hover, .lf-menu a.active { color: var(--accent); }
.lf-menu a.active::after { content:''; position:absolute; left:0; right:0; bottom:-2px; height:2px; background: var(--accent); }
.lf-nav-phone { display:inline-flex; align-items:center; gap:8px; padding: 12px 20px; background: var(--accent); color:#fff !important; border-radius: 999px; font-weight: 600; font-size: 14px; transition: background 0.2s; }
.lf-nav-phone:hover { background: var(--accent-hover); }
.lf-mobile-toggle { display:none; }

@media (max-width: 900px) {
  .lf-menu { display:none; }
  .lf-nav-phone { display:none; }
  .lf-mobile-toggle { display:inline-flex; margin-left:auto; font-size:24px; padding:6px 10px; }
  .lf-topbar-left { display:none; }
}

/* Buttons */
.lf-btn-pri { display:inline-flex; align-items:center; gap:10px; padding: 14px 26px; background: var(--accent); color:#fff !important; border-radius: 999px; font-weight: 600; font-size: 14px; transition: all 0.25s var(--ease); border:none; cursor:pointer; }
.lf-btn-pri:hover { background: var(--accent-hover); transform: translateY(-1px); }
.lf-btn-sm { padding: 10px 20px; font-size: 13px; }
.lf-btn-block { width: 100%; justify-content: center; padding: 15px; font-size: 14.5px; }
.lf-btn-light { display:inline-flex; align-items:center; gap:8px; padding: 14px 26px; background: #fff; color: var(--navy) !important; border-radius: 999px; font-weight:600; font-size:14px; }
.lf-btn-outline { display:inline-flex; align-items:center; gap:8px; padding: 14px 26px; background: transparent; color: #fff !important; border: 1.5px solid rgba(255,255,255,0.4); border-radius: 999px; font-weight:600; font-size:14px; }
.lf-btn-outline:hover { border-color: #fff; background: #fff; color: var(--navy) !important; }

.lf-eyebrow { display:inline-block; padding: 6px 14px; background: var(--accent); color:#fff; border-radius: 4px; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform: uppercase; margin-bottom: 18px; }
.lf-h2 { font-family: var(--font-display); font-size: clamp(28px, 3.4vw, 44px); line-height:1.15; font-weight:600; letter-spacing:-0.02em; color: var(--navy); margin-bottom: 18px; }
.lf-section { padding: 90px 0; }
.lf-tone-soft { background: var(--bg-tint); }
.lf-section-head { max-width: 720px; margin-bottom: 56px; }
.lf-section-head.centered { margin: 0 auto 56px; text-align:center; }
.lf-section-head.centered .lf-eyebrow { display:inline-block; }
.lf-lede { font-size: 16px; color: var(--ink-soft); line-height:1.7; max-width: 560px; margin-bottom: 28px; }

/* HERO */
.lf-hero { position: relative; min-height: 720px; display:flex; align-items:center; overflow:hidden; margin-top: 0; }
.lf-hero-bg { position:absolute; inset:0; }
.lf-hero-bg img { width:100%; height:100%; object-fit: cover; }
.lf-hero-bg::after { content:''; position:absolute; inset:0; background: linear-gradient(90deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0.15) 60%, transparent 100%); }
.lf-hero-wrap { position: relative; z-index:2; padding-top: 160px; padding-bottom: 100px; display:block; max-width: none !important; margin: 0 !important; padding-left: clamp(24px, 6vw, 96px) !important; padding-right: clamp(24px, 6vw, 96px) !important; }
.lf-hero-card { background: rgba(255,255,255,0.96); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.6); padding: 48px 44px; border-radius: 18px; width: 540px; max-width: 100%; box-shadow: 0 30px 80px -30px rgba(10,22,40,0.45); margin: 0 !important; }
.lf-hero-card h1 { font-family: var(--font-display); font-size: clamp(30px, 3.6vw, 44px); line-height:1.15; font-weight:700; letter-spacing:-0.02em; color: var(--navy); margin-bottom: 18px; }
.lf-hero-card p { font-size: 15px; color: var(--ink-soft); line-height:1.7; margin-bottom: 28px; }

/* Pill CTA — yellow square, no arrow */
.lf-cta-pill { display:inline-flex; align-items:center; justify-content:center; gap:0; padding: 14px 26px; background: #d98c03 !important; color: #fff !important; border-radius: 999px; font-weight: 600; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; border:none; cursor:pointer; transition: transform 0.08s var(--ease), background 0.15s var(--ease); text-decoration:none; line-height:1; box-shadow: none; -webkit-tap-highlight-color: transparent; }
.lf-cta-pill:hover, .lf-cta-pill:focus, .lf-cta-pill:focus-visible { background: #c47e02 !important; color: #fff !important; outline: none; }
.lf-cta-pill:active { background: #a86b01 !important; transform: scale(0.96); }
.lf-cta-pill-arrow { display: none !important; }
.lf-cta-pill-block { width:100%; }

/* About + Form */
.lf-about-grid { display:grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: start; }
.lf-feature { display:flex; gap:18px; padding: 4px 0 18px; border-bottom: 1px solid var(--ink-line-soft); margin-bottom: 16px; }
.lf-feature:last-of-type { border-bottom: none; }
.lf-feature-num { flex-shrink:0; font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--accent); letter-spacing: -0.02em; line-height: 1; padding-top: 2px; min-width: 36px; }
.lf-feature h4 { font-size: 15px; color: var(--navy); margin-bottom:4px; }
.lf-feature p { font-size: 13.5px; color: var(--ink-soft); margin:0; }
.lf-form { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 18px; padding: 36px; box-shadow: 0 24px 60px -28px rgba(10,22,40,0.18); position: relative; overflow: visible; z-index: 2; }
.lf-form::before { content:''; position:absolute; top:0; left:0; right:0; height: 4px; background: linear-gradient(90deg, #F5C518, #0A1F44); }
.lf-form-header { margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid var(--ink-line-soft); }
.lf-form-eyebrow { display:inline-flex; align-items:center; gap:6px; padding: 5px 12px; background: rgba(245,197,24,0.18); color: #8a6a00; border-radius: 999px; font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px; }
.lf-form-header h3 { font-family: var(--font-display); font-size: 24px; line-height:1.2; font-weight:700; color: var(--navy); margin-bottom: 6px; letter-spacing:-0.01em; }
.lf-form-header p { font-size: 13.5px; color: var(--ink-soft); line-height:1.5; margin:0; }
.lf-form-row { display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.lf-form-row > input { margin-bottom: 12px; }
.lf-form input, .lf-form select, .lf-form textarea { width:100%; padding: 13px 16px; border: 1px solid var(--ink-line); border-radius: 10px; background: #fff; margin-bottom: 12px; font-size: 14px; color: var(--ink); font-family: inherit; transition: all 0.2s; }
.lf-form input:focus, .lf-form select:focus, .lf-form textarea:focus { outline:none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(10,31,68,0.08); }
.lf-form textarea { resize: vertical; min-height: 80px; }
.lf-select-wrap { position:relative; }
.lf-select-wrap select { appearance:none; -webkit-appearance:none; -moz-appearance:none; padding-right: 40px; cursor:pointer; background-image:none; }
.lf-select-caret { position:absolute; right:16px; top:16px; color: var(--ink-soft); pointer-events:none; }
.lf-form button { margin-top: 10px; }

/* Compact offerte section: heading top, form middle, two bullets below */
.lf-offerte-section { padding: 80px 0 64px; }
.lf-offerte-head { text-align: center; max-width: 640px; margin: 0 auto 32px; }
.lf-offerte-head .lf-h2 { margin-bottom: 14px; }
.lf-offerte-head .lf-lede { margin: 0 auto; }
.lf-form-compact { max-width: 640px; margin: 0 auto; padding: 28px 28px 24px; border-radius: 16px; }
.lf-form-compact .lf-form-row { gap: 10px; }
.lf-form-compact input, .lf-form-compact textarea, .lf-form-compact .lf-dd-toggle { padding: 12px 14px; font-size: 14px; margin-bottom: 10px; }
.lf-form-foot { text-align: center; margin: 14px 0 0; font-size: 13px; color: var(--ink-soft); }
.lf-form-foot a { color: var(--navy); font-weight: 700; text-decoration: none; border-bottom: 1.5px solid var(--accent); }
.lf-mini-bullets { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 640px; margin: 28px auto 0; }
.lf-mini-bullet { display: flex; gap: 14px; align-items: flex-start; padding: 18px 20px; background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 14px; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.lf-mini-bullet:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -16px rgba(10,22,40,0.18); border-color: var(--accent); }
.lf-mini-bullet-num { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--accent); line-height: 1; flex-shrink: 0; }
.lf-mini-bullet h4 { font-size: 14px; color: var(--navy); margin: 0 0 4px; font-weight: 700; letter-spacing: -0.005em; }
.lf-mini-bullet p { font-size: 12.5px; color: var(--ink-soft); margin: 0; line-height: 1.45; }
@media (max-width: 760px) {
  .lf-offerte-section { padding: 56px 0 48px; }
  .lf-form-compact { padding: 22px 18px 20px; border-radius: 14px; }
  .lf-form-compact .lf-form-row { grid-template-columns: 1fr; }
  .lf-form-compact .lf-dd-list { max-height: min(240px, 45vh); }
  .lf-mini-bullets { grid-template-columns: 1fr; gap: 10px; margin-top: 20px; }
  .lf-mini-bullet { padding: 14px 16px; }
}

/* Services Grid */
.lf-svc-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.lf-svc-card { display:flex; flex-direction:column; background:#fff; border-radius: 14px; overflow:hidden; border: 1px solid var(--ink-line-soft); transition: all 0.3s var(--ease); color: var(--ink); }
.lf-svc-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(10,22,40,0.18); border-color: var(--accent); }

/* Stacking-card scroll animation: ALL cards share the same sticky parent so they
   physically pile on top of each other (Olivier Larose pattern). The slot wrappers
   are unwrapped via display:contents — each card is sticky against the grid itself. */
.lf-services .lf-svc-grid[data-svc-stack] {
  display: block;
  position: relative;
  padding: 0 16px 32px;
}
.lf-services .lf-svc-grid[data-svc-stack] .lf-svc-slot {
  display: contents;
}
.lf-services .lf-svc-grid[data-svc-stack] .lf-svc-card {
  position: sticky;
  top: calc(110px + var(--svc-i, 0) * 14px);
  display: block;
  width: 100%;
  max-width: 880px;
  margin: 0 auto 30px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 40px 80px -32px rgba(15,17,21,.32);
  transition: transform 0.5s var(--ease);
}
.lf-services .lf-svc-grid[data-svc-stack] .lf-svc-slot:last-child .lf-svc-card {
  margin-bottom: 0;
}
.lf-services .lf-svc-grid[data-svc-stack] .lf-svc-img { aspect-ratio: 21/9; }
.lf-svc-img { position:relative; aspect-ratio: 4/3; overflow:hidden; }
.lf-svc-img img { width:100%; height:100%; object-fit:cover; transition: transform 0.6s var(--ease); }
.lf-svc-card:hover .lf-svc-img img { transform: scale(1.05); }
.lf-svc-num { position:absolute; left:16px; bottom:16px; width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center; background: var(--accent); color:#fff; font-weight:700; font-size:14px; border-radius: 6px; box-shadow: 0 6px 16px rgba(217,140,3,0.4); }
.lf-svc-body { padding: 24px; }
.lf-svc-body h4 { font-size: 18px; color: var(--navy); margin-bottom: 8px; }
.lf-svc-body p { font-size: 14px; line-height:1.6; color: var(--ink-soft); margin-bottom:16px; }
.lf-svc-link { display:inline-flex; align-items:center; gap:6px; color: var(--accent); font-weight:600; font-size:13px; }

/* Why us collage */
.lf-why-collage { display:grid; grid-template-columns: 1fr 1.2fr 1fr; grid-template-rows: 1fr 1fr; gap: 24px; max-width: 1100px; margin: 0 auto; }
.lf-why-tile { background:#fff; padding: 28px 26px; border-radius: 12px; border: 1px solid var(--ink-line-soft); position: relative; }
.lf-why-tile h5 { font-size: 15.5px; color: var(--navy); margin-bottom: 8px; line-height: 1.3; margin-top: 14px; }
.lf-why-tile p { font-size: 13.5px; line-height:1.65; color: var(--ink-soft); margin: 0; }
.lf-why-meta { display:flex; align-items:center; gap:14px; padding-bottom: 14px; border-bottom: 1px solid var(--ink-line-soft); }
.lf-why-num { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; line-height: 1; }
.lf-why-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-mute); line-height: 1; }

/* Trust strip, certifications & legal */
.lf-trust-strip { margin-top: 48px; padding: 26px 36px; background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 12px; display:grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items:center; gap: 28px; }
.lf-trust-item { display:flex; flex-direction:column; gap: 4px; min-width: 0; }
.lf-trust-item strong { font-size: 13.5px; color: var(--navy); font-weight: 700; letter-spacing: -0.005em; display:block; margin-bottom: 2px; }
.lf-trust-item span { font-size: 11.5px; color: var(--ink-mute); letter-spacing: 0.01em; display:block; }
.lf-trust-divider { width: 1px; height: 32px; background: var(--ink-line-soft); }
@media (max-width: 900px) { .lf-trust-strip { grid-template-columns: 1fr; gap: 18px; padding: 22px 24px; } .lf-trust-divider { display:none; } }
.lf-why-photo { grid-row: 1 / 3; grid-column: 2; border-radius: 14px; overflow:hidden; }
.lf-why-photo img { width:100%; height:100%; object-fit:cover; }
.lf-why-tl { grid-area: 1 / 1; }
.lf-why-tr { grid-area: 1 / 3; }
.lf-why-bl { grid-area: 2 / 1; }
.lf-why-br { grid-area: 2 / 3; }

/* ── Why-us as scroll-stack: all tiles sticky in the SAME left column → real pile-up */
.lf-why-collage.lf-why-stack { display:grid; grid-template-columns: 1fr 1.05fr; gap: 56px; align-items: start; max-width: 1180px; margin: 0 auto; padding-bottom: 24px; }
.lf-why-stack .lf-why-stack-left { display:block; }
/* Unwrap slots so all tiles share the same sticky parent (.lf-why-stack-left) */
.lf-why-stack .lf-why-slot { display: contents; }
.lf-why-stack .lf-why-tile { position: sticky; top: calc(120px + var(--why-i, 0) * 12px); width: 100%; padding: 30px 32px; margin: 0 0 26px; background:#fff; border-radius: 16px; border: 1px solid var(--ink-line-soft); box-shadow: 0 1px 2px rgba(15,17,21,.04), 0 30px 60px -32px rgba(15,17,21,.22); transition: transform 0.5s var(--ease); }
.lf-why-stack .lf-why-stack-left > .lf-why-slot:last-child .lf-why-tile { margin-bottom: 0; }
.lf-why-stack .lf-why-photo { position: sticky; top: 120px; height: min(58vh, 520px); grid-row: auto; grid-column: auto; border-radius: 16px; overflow: hidden; box-shadow: 0 30px 80px -36px rgba(15,17,21,.32); align-self: start; transition: opacity 0.45s ease, transform 0.5s cubic-bezier(.22,.78,.27,1); }
.lf-why-stack.is-trust-near .lf-why-photo { opacity: 0; transform: translateY(-24px) scale(0.97); pointer-events: none; }
.lf-why-stack .lf-why-photo img { width:100%; height:100%; object-fit: cover; }


/* Trust-strip: highlight items in cascade as the strip enters viewport */
.lf-trust-strip[data-trust-strip] { position: relative; }
.lf-trust-strip[data-trust-strip] .lf-trust-item { position: relative; z-index: 1; transition: transform .5s cubic-bezier(.22,.78,.27,1); }
.lf-trust-strip[data-trust-strip] .lf-trust-item::before { content:""; position:absolute; inset: -10px -14px; border-radius: 10px; background: hsl(40 92% 52% / 0.10); opacity: 0; transform: scale(.94); transition: opacity .55s ease, transform .55s cubic-bezier(.22,.78,.27,1); z-index: -1; }
.lf-trust-strip[data-trust-strip] .lf-trust-item strong { transition: color .45s ease; }
.lf-trust-strip[data-trust-strip] .lf-trust-item.is-marked::before { opacity: 1; transform: scale(1); }
.lf-trust-strip[data-trust-strip] .lf-trust-item.is-marked strong { color: var(--accent); }
.lf-trust-strip[data-trust-strip] .lf-trust-item.is-marked { transform: translateY(-2px); }


/* Skills */
.lf-skills-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items:center; }
.lf-bars { margin-bottom: 28px; }
.lf-bar { margin-bottom: 22px; }
.lf-bar-head { display:flex; justify-content:space-between; align-items:center; font-size: 13.5px; font-weight:600; color: var(--navy); margin-bottom: 10px; }
.lf-bar-pct { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--navy); display:inline-flex; align-items: baseline; gap:1px; }
.lf-bar-pct em { font-style:normal; font-size: 11px; color: var(--accent); font-weight: 700; margin-left: 1px; }
.lf-bar-track { position:relative; height: 4px; background: var(--ink-line-soft); border-radius: 999px; overflow: visible; }
.lf-bar-track i { display:block; height:100%; background: linear-gradient(90deg, var(--accent), #F5C518); border-radius:999px; position:relative; }
.lf-bar-knob { position:absolute; right: -6px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 3px solid var(--accent); box-shadow: 0 4px 10px -2px rgba(217,140,3,0.55); }
.lf-skills-collage { display:grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.lf-skills-img1, .lf-skills-img2 { width:100%; height: 420px; object-fit:cover; border-radius: 6px; display:block; }

/* Team */
.lf-team-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 28px; max-width: 900px; margin: 0 auto; }
.lf-team-card { text-align:center; }
.lf-team-img { aspect-ratio: 4/4; border-radius: 12px; overflow:hidden; margin-bottom: 16px; position:relative; }
.lf-team-img::before { content:''; position:absolute; right:-1px; bottom:-1px; width:42px; height:42px; background: var(--accent); clip-path: polygon(100% 0, 100% 100%, 0 100%); z-index:2; }
.lf-team-img img { width:100%; height:100%; object-fit:cover; }
.lf-team-card h5 { font-size: 17px; color: var(--navy); margin-bottom: 4px; }
.lf-team-card span { font-size: 13px; color: var(--ink-mute); }

/* Projects */
.lf-proj-tabs-wrap { display:flex; justify-content:center; margin-bottom: 40px; }
.lf-proj-tabs { display:inline-flex; justify-content:center; gap:6px; flex-wrap:wrap; padding: 6px; background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 999px; box-shadow: 0 8px 24px -16px rgba(10,22,40,0.18); }
.lf-proj-chip { display:inline-flex; align-items:center; gap:8px; padding: 10px 20px; background: transparent; border-radius: 999px; font-size: 13px; font-weight:600; color: var(--ink-soft); border: none; transition: all 0.25s var(--ease); cursor:pointer; font-family: inherit; letter-spacing: -0.005em; }
.lf-proj-chip:hover { color: var(--navy); background: var(--bg-tint); }
.lf-proj-chip.active { background: var(--navy); color:#fff; box-shadow: 0 6px 16px -6px rgba(10,31,68,0.45); }
.lf-chip-dot { width:6px; height:6px; border-radius:50%; background: var(--accent); display:inline-block; }
.lf-proj-chip:not(.active) .lf-chip-dot { background: var(--ink-line); }
.lf-proj-collage { display:grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.lf-proj-cell { position:relative; display:flex; flex-direction:column; background:#fff; border:1px solid var(--ink-line-soft); border-radius: 16px; overflow:hidden; text-decoration:none; color:var(--ink); transition: transform .35s var(--ease), box-shadow .35s var(--ease), border-color .35s var(--ease); }
.lf-proj-cell:hover { transform: translateY(-4px); box-shadow: 0 22px 44px -22px rgba(10,22,40,0.22); border-color: var(--accent); }
.lf-proj-cell.is-hidden { display: none; }
.lf-proj-img { position:relative; aspect-ratio: 4/3; overflow:hidden; }
.lf-proj-img img { width:100%; height:100%; object-fit:cover; transition: transform 0.5s var(--ease); display:block; }
.lf-proj-cell:hover .lf-proj-img img { transform: scale(1.06); }
.lf-proj-cap { display:flex; align-items:center; justify-content:space-between; gap:12px; padding: 16px 18px; }
.lf-proj-cap-cat { display:block; font-size: 11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color: var(--accent); margin-bottom: 4px; }
.lf-proj-cap strong { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--navy); letter-spacing:-0.01em; line-height:1.2; display:block; }
.lf-proj-cap svg { color: var(--navy); flex-shrink: 0; transition: transform .3s var(--ease); }
.lf-proj-cell:hover .lf-proj-cap svg { transform: translateX(4px); color: var(--accent); }

/* Custom clean dropdown */
.lf-dd { position: relative; margin-bottom: 12px; z-index: 1; }
.lf-dd-toggle { width:100%; display:flex; align-items:center; justify-content:space-between; padding: 13px 16px; border: 1px solid var(--ink-line); border-radius: 10px; background: #fff; font-size: 14px; color: var(--ink-soft); font-family: inherit; cursor: pointer; transition: all 0.2s; text-align:left; }
.lf-dd-toggle:hover { border-color: #c9d1de; }
.lf-dd.open .lf-dd-toggle { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(10,31,68,0.08); }
.lf-dd-label.has-value { color: var(--ink); font-weight:500; }
.lf-dd-caret { color: var(--ink-soft); transition: transform 0.2s var(--ease); flex-shrink:0; }
.lf-dd.open .lf-dd-caret { transform: rotate(180deg); }
.lf-dd-list { position:absolute; top: calc(100% + 6px); left:0; right:0; background:#fff; border:1px solid var(--ink-line-soft); border-radius: 12px; box-shadow: 0 18px 40px -18px rgba(10,22,40,0.22); list-style:none; margin:0; padding:6px; z-index: 30; max-height: 320px; overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; touch-action: pan-y; opacity:0; transform: translateY(-6px); pointer-events:none; transition: all 0.18s var(--ease); }
.lf-dd.open { z-index: 80; }
.lf-dd.open .lf-dd-list { opacity:1; transform: translateY(0); pointer-events:auto; }
.lf-dd-list li { padding: 11px 14px; font-size: 14px; color: var(--ink); border-radius: 8px; cursor:pointer; transition: background 0.15s; }
.lf-dd-list li:hover { background: var(--bg-tint); }
.lf-dd-list li.selected { background: rgba(10,31,68,0.06); color: var(--navy); font-weight:600; }

/* Testimonials */
.lf-testi-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.lf-testi { background:#fff; padding: 32px; border-radius: 14px; border: 1px solid var(--ink-line-soft); display:flex; flex-direction:column; }
.lf-testi-stars { color: #F5B400; font-size: 18px; letter-spacing: 3px; margin-bottom: 18px; }
.lf-testi p { font-size: 14.5px; line-height:1.7; color: var(--ink-soft); margin-bottom: 22px; flex:1; }
.lf-testi-divider { height:1px; background: var(--ink-line-soft); margin-bottom: 18px; }
.lf-testi-foot { display:flex; align-items:center; gap:14px; }
.lf-testi-avatar { width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0; }
.lf-testi-meta { display:flex; flex-direction:column; gap:2px; flex:1; min-width:0; }
.lf-testi-foot strong { font-size:14.5px; color: var(--navy); font-weight:700; }
.lf-testi-foot span { font-size:12.5px; color: var(--ink-mute); }
.lf-testi-google { flex-shrink:0; }

/* CTA */
.lf-cta { background: var(--navy); border-radius: 18px; padding: 56px 56px; display:grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items:center; overflow:hidden; position:relative; }
.lf-cta::before { content:''; position:absolute; right: 28%; top:50%; transform:translateY(-50%); width: 280px; height: 280px; border-radius:50%; background: var(--accent); opacity: 0.15; }
.lf-cta-text { color:#fff; position:relative; z-index:2; }
.lf-cta-text h2 { color:#fff; font-family: var(--font-display); font-size: clamp(26px, 3vw, 38px); line-height:1.15; margin-bottom: 14px; letter-spacing:-0.02em; }
.lf-cta-text p { color: rgba(255,255,255,0.75); font-size: 15px; margin-bottom: 26px; max-width: 460px; }
.lf-cta-actions { display:flex; gap:12px; flex-wrap:wrap; }
.lf-cta-img { position:relative; z-index:2; height: 280px; display:flex; justify-content:flex-end; }
.lf-cta-img img { height:100%; width:auto; object-fit:cover; border-radius: 12px; }

/* Blog */
.lf-blog-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.lf-blog-card { display:flex; flex-direction:column; background:#fff; border-radius: 14px; overflow:hidden; border: 1px solid var(--ink-line-soft); transition: all 0.3s var(--ease); color: var(--ink); }
.lf-blog-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(10,22,40,0.18); border-color: var(--accent); }
.lf-blog-img { position:relative; aspect-ratio: 16/10; overflow:hidden; }
.lf-blog-img img { width:100%; height:100%; object-fit:cover; transition: transform 0.6s var(--ease); }
.lf-blog-card:hover .lf-blog-img img { transform: scale(1.05); }
.lf-blog-tag { position:absolute; top:14px; left:14px; padding: 6px 12px; background: var(--accent); color:#fff; border-radius: 4px; font-size:10.5px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; }
.lf-blog-date-badge { position:absolute; right:14px; bottom:14px; min-width:54px; padding: 8px 10px; background:#fff; border-radius:8px; box-shadow: 0 8px 20px -8px rgba(10,22,40,0.25); display:flex; flex-direction:column; align-items:center; line-height:1; }
.lf-blog-date-badge strong { font-family: var(--font-display); font-size: 18px; color: var(--navy); font-weight: 700; }
.lf-blog-date-badge em { font-style:normal; font-size: 10.5px; color: var(--ink-mute); text-transform:uppercase; letter-spacing:0.08em; margin-top:3px; font-weight:600; }
.lf-blog-body { padding: 24px; display:flex; flex-direction:column; gap:10px; }
.lf-blog-body h4 { font-size: 18px; line-height:1.35; color: var(--navy); }
.lf-blog-body h4 a { color: inherit; transition: color 0.2s; }
.lf-blog-body h4 a:hover { color: var(--accent); }
.lf-blog-body p { font-size: 14px; line-height:1.65; color: var(--ink-soft); margin-bottom: 6px; }
.lf-blog-foot { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top: 6px; padding-top: 14px; border-top: 1px solid var(--ink-line-soft); }
.lf-blog-btn { display:inline-flex; align-items:center; gap:8px; padding: 10px 18px; background: #d98c03; color:#fff !important; border-radius: 999px; font-size: 12.5px; font-weight: 700; letter-spacing:0.04em; text-transform:uppercase; transition: background 0.2s, transform 0.2s, box-shadow 0.2s; box-shadow: 0 6px 16px -4px rgba(217,140,3,0.45); }
.lf-blog-btn:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 10px 22px -6px rgba(217,140,3,0.55); }
.lf-blog-author { display:inline-flex; align-items:center; gap:6px; font-size:13px; color: var(--ink-soft); font-weight:500; }
.lf-blog-author svg { color: var(--accent); }
.lf-blog-more { margin-top: 36px; display:flex; flex-direction:column; align-items:center; gap:14px; }
.lf-blog-dots { display:inline-flex; gap:8px; }
.lf-blog-dots i { width:9px; height:9px; border-radius:50%; background: var(--ink-line); display:inline-block; }
.lf-blog-dots i.active { background: var(--accent); width: 26px; border-radius:5px; }
.lf-blog-more p { font-size: 13.5px; color: var(--ink-soft); }
.lf-blog-more p a { color: var(--accent); font-weight:700; }
@media (max-width: 900px) { .lf-blog-grid { grid-template-columns: 1fr; } }

@media (max-width: 900px) {
  .lf-section { padding: 60px 0; }
  .lf-about-grid, .lf-skills-grid { grid-template-columns: 1fr; gap: 40px; }
  .lf-team-grid, .lf-testi-grid { grid-template-columns: 1fr; }
  .lf-why-collage { grid-template-columns: 1fr 1fr; }
  .lf-why-photo { grid-row: 2; grid-column: 1 / 3; height: 220px; }
  .lf-why-tl { grid-area: 1 / 1; } .lf-why-tr { grid-area: 1 / 2; }
  .lf-why-bl { grid-area: 3 / 1; } .lf-why-br { grid-area: 3 / 2; }
  /* Disable scroll-stack on small screens — back to a normal stacked column */
  .lf-why-collage.lf-why-stack { display: block; }
  .lf-why-stack .lf-why-stack-left { display: grid; gap: 16px; }
  .lf-why-stack .lf-why-slot { height: auto; display: block; position: static; }
  .lf-why-stack .lf-why-tile { position: static; transform: none !important; margin: 0; box-shadow: none; top: 0 !important; }
  .lf-why-stack .lf-why-photo { position: static; height: 240px; min-height: 0; margin-top: 16px; }

  /* Services: clean horizontal swipe carousel on mobile (overrides desktop sticky stack) */
  .lf-services .lf-svc-grid,
  .lf-services .lf-svc-grid[data-svc-stack] {
    display: flex !important;
    flex-wrap: nowrap;
    gap: 14px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    padding: 4px 16px 22px;
    margin: 0 -16px;
    scrollbar-width: none;
  }
  .lf-services .lf-svc-grid::-webkit-scrollbar { display: none; }
  .lf-services .lf-svc-grid[data-svc-stack] .lf-svc-slot {
    position: static !important;
    height: auto !important;
    display: block;
    padding: 0;
    flex: 0 0 82%;
    max-width: 320px;
    scroll-snap-align: center;
  }
  .lf-services .lf-svc-grid[data-svc-stack] .lf-svc-card {
    position: static !important;
    top: 0 !important;
    margin: 0;
    transform: scale(0.92);
    transform-origin: 50% 50%;
    transition: transform 0.45s cubic-bezier(.22,.78,.27,1), box-shadow 0.45s ease;
    box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 12px 28px -18px rgba(15,17,21,.18);
    width: 100%;
    max-width: none;
  }
  .lf-services .lf-svc-grid[data-svc-stack] .lf-svc-slot.is-snapped .lf-svc-card {
    transform: scale(1);
    box-shadow: 0 1px 2px rgba(15,17,21,.06), 0 28px 60px -22px rgba(15,17,21,.32);
  }
  .lf-services .lf-svc-grid[data-svc-stack] .lf-svc-img { aspect-ratio: 16/10; }

  .lf-proj-collage { grid-template-columns: 1fr; gap: 14px; }
  .lf-skills-img1, .lf-skills-img2 { height: 320px; }
  .lf-cta { padding: 40px 28px; grid-template-columns: 1fr; }
  .lf-cta-img { display:none; }
  .lf-hero-card { padding: 32px 24px; }
  .lf-blog-foot { flex-direction: column; align-items: flex-start; }

  /* Mobile swipe hint — animated arrow pill, like big carousel sites */
  .lf-services .lf-section-head::after,
  .lf-reviews-section .lf-reviews-head::after {
    content: 'Veeg opzij  \\2192';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 18px auto 0;
    padding: 11px 22px;
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #fff;
    background: #0a1628;
    border: 2px solid #0a1628;
    border-radius: 999px;
    width: fit-content;
    box-shadow: 0 14px 30px -10px rgba(10,22,40,0.45);
    animation: lf-swipe-nudge 1.6s cubic-bezier(.22,.78,.27,1) infinite;
  }
  @keyframes lf-swipe-nudge {
    0%, 100% { transform: translateX(0); }
    45%      { transform: translateX(10px); }
    70%      { transform: translateX(-2px); }
  }
  .lf-services .lf-section-head { text-align: center; }
  .lf-reviews-section .lf-reviews-head { text-align: center; }
}

/* Footer, clean white with black text (matches site) */
.footer { background: #fff !important; color: var(--ink) !important; border-top: 1px solid var(--ink-line) !important; }
.footer .nav-brand { color: var(--navy) !important; }
.footer-logo { height: 64px; width: auto; display: block; margin-bottom: 8px; }
.footer .nav-brand .nav-brand-mark { background: var(--accent) !important; color:#fff !important; }
.footer .nav-brand em { color: var(--accent); font-style: normal; font-weight: 500; }
.footer-brand p { color: var(--ink-soft) !important; }
.footer-col h5 { color: var(--navy) !important; }
.footer-col a { color: var(--ink-soft) !important; }
.footer-col a:hover { color: var(--accent) !important; }
.footer-bottom { color: var(--ink-mute) !important; border-top: 1px solid var(--ink-line-soft) !important; }
.footer-bottom-links a { color: var(--ink-soft) !important; }
.footer-bottom-links a:hover { color: var(--accent) !important; }

/* Stats strip under hero */
.lf-stats { background: var(--navy); padding: 38px 0; }
.lf-stats-inner { display:grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items:center; gap: 36px; }
.lf-stat { display:flex; flex-direction:column; align-items:flex-start; gap: 6px; }
.lf-stat strong { font-family: var(--font-display); font-size: clamp(28px, 3vw, 40px); font-weight: 700; color: #fff; line-height: 1; letter-spacing: -0.02em; display:block; }
.lf-stat strong em { font-style:normal; font-size: 0.55em; color: var(--accent); font-weight: 700; margin-left: 2px; }
.lf-stat span { font-size: 12.5px; color: rgba(255,255,255,0.65); letter-spacing: 0.01em; line-height: 1.4; }
.lf-stats-divider { width: 1px; height: 42px; background: rgba(255,255,255,0.14); }
@media (max-width: 900px) { .lf-stats-inner { grid-template-columns: 1fr 1fr; gap: 24px; } .lf-stats-divider { display:none; } }

/* Partners */
.lf-partners { padding: 64px 0; background: #fff; border-bottom: 1px solid var(--ink-line-soft); }
.lf-hero-trust { background: transparent; padding: 28px 0 8px; }
.lf-hero-trust-row { display: flex; justify-content: center; align-items: stretch; gap: 14px; flex-wrap: wrap; }
.lf-trust-pill { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 14px 24px; background: #fff; border: 1px solid var(--ink-line-soft, #e8e6df); border-radius: 999px; box-shadow: 0 6px 20px -10px rgba(10,22,40,0.18); min-width: 170px; transition: transform .25s ease, box-shadow .25s ease; }
.lf-trust-pill:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -12px rgba(10,22,40,0.22); }
.lf-trust-pill strong { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--navy, #0a1628); letter-spacing: -0.01em; line-height: 1; }
.lf-trust-pill .lf-trust-unit { font-style: normal; font-size: 14px; font-weight: 600; color: var(--ink-soft, #5b6472); margin-left: 2px; }
.lf-trust-pill .lf-trust-sub { font-size: 11.5px; color: var(--ink-soft, #5b6472); letter-spacing: 0.04em; text-transform: uppercase; margin-top: 2px; }
.lf-trust-stars { color: #f5b301; font-size: 13px; letter-spacing: 2px; line-height: 1; margin-bottom: 2px; }
@media (max-width: 720px) { .lf-trust-pill { min-width: 46%; padding: 12px 16px; } .lf-trust-pill strong { font-size: 19px; } }
.lf-partners-head { text-align:center; max-width: 600px; margin: 0 auto 36px; }
.lf-partners-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); display:block; margin-bottom: 10px; }
.lf-partners-head p { font-size: 14px; color: var(--ink-soft); line-height: 1.6; margin: 0; }
.lf-partners-row { display:grid; grid-template-columns: repeat(8, 1fr); align-items:center; gap: 24px; }
.lf-partners-row img { width: 100%; height: 38px; object-fit: contain; filter: grayscale(1) opacity(0.55); transition: filter 0.25s var(--ease); }
.lf-partners-row img:hover { filter: grayscale(0) opacity(1); }
@media (max-width: 900px) { .lf-partners-row { grid-template-columns: repeat(4, 1fr); gap: 20px; } }

/* Marquee logos */
.lf-marquee { overflow: hidden; position: relative; padding: 8px 0; mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent); }
.lf-marquee-track { display: flex; width: max-content; animation: lf-marquee-scroll 46s linear infinite; }
.lf-marquee-set { display: flex; align-items: center; gap: 58px; padding: 0 58px; flex-shrink: 0; }
.lf-marquee-set img { height: 56px; width: 260px; object-fit: contain; flex: 0 0 260px; filter: grayscale(1) opacity(0.55); transition: filter 0.3s var(--ease); }
.lf-marquee-set img:hover { filter: grayscale(0) opacity(1); }
.lf-marquee:hover .lf-marquee-track { animation-play-state: paused; }
@keyframes lf-marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* Stats counters */
.lf-stats { padding: 80px 0; background: var(--bg-tint, #f7f5ef); }
.lf-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.lf-stat-card { background: #fff; border: 1px solid var(--ink-line-soft, #e8e6df); border-radius: 22px; padding: 22px; transition: transform .35s var(--ease), box-shadow .35s var(--ease); position: relative; overflow: hidden; display:flex; flex-direction:column; gap: 18px; }
.lf-stat-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -28px rgba(10,22,40,0.22); }
.lf-stat-card:hover .lf-stat-photo img { transform: scale(1.06); }
.lf-stat-photo { position:relative; width:100%; aspect-ratio: 4/3; border-radius: 16px; overflow:hidden; background:#eee; }
.lf-stat-photo img { width:100%; height:100%; object-fit:cover; transition: transform 0.8s var(--ease); display:block; }
.lf-stat-body { padding: 4px 6px 8px; }
.lf-stat-card .lf-stat-num { font-family: var(--font-display); font-size: clamp(30px, 3.6vw, 46px); font-weight: 700; color: var(--navy, #0a1628); letter-spacing: -0.02em; line-height: 1; display: flex; align-items: baseline; gap: 8px; }
.lf-stat-card .lf-stat-dot { display:inline-block; width:8px; height:8px; border-radius:999px; background: var(--accent, #c9a24a); align-self:center; transform: translateY(-2px); }
.lf-stat-card .lf-stat-suffix { font-size: 0.55em; font-weight: 600; color: var(--ink-soft, #5b6472); }
.lf-stat-card .lf-stat-label { margin-top: 10px; font-size: 14px; color: var(--ink-soft, #5b6472); letter-spacing: 0.01em; }
.lf-stat-card--nophoto { justify-content: center; align-items: flex-start; min-height: 100%; background: linear-gradient(140deg, #0a1628 0%, #142540 100%); color:#fff; }
.lf-stat-card--nophoto .lf-stat-num { color:#fff; font-size: clamp(40px, 5vw, 64px); }
.lf-stat-card--nophoto .lf-stat-suffix { color: var(--accent, #c9a24a); }
.lf-stat-card--nophoto .lf-stat-label { color: rgba(255,255,255,0.72); font-size:15px; text-transform:uppercase; letter-spacing:0.12em; }
@media (max-width: 900px) { .lf-stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .lf-stats-grid { grid-template-columns: 1fr; } }

/* Support tiles */
.lf-support-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.lf-support-card { background:#fff; padding: 28px 24px; border-radius: 14px; border: 1px solid var(--ink-line-soft); transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease), border-color 0.5s var(--ease), background 0.5s var(--ease); position:relative; }
.lf-support-card:hover { transform: translateY(-3px); box-shadow: 0 18px 36px -20px rgba(10,22,40,0.18); border-color: var(--accent); }
.lf-support-card.is-active { transform: translateY(-6px) scale(1.03); border-color: var(--accent); box-shadow: 0 18px 40px -22px rgba(10,22,40,0.22); background: #fff; }
.lf-support-card.is-active .lf-support-meta span { color: var(--accent); transform: scale(1.15); }
.lf-support-meta span { display:inline-block; transition: transform 0.5s var(--ease), color 0.5s var(--ease); }
.lf-support-meta { display:flex; align-items:center; gap: 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--ink-line-soft); }
.lf-support-meta span { font-family: var(--font-display); font-size: 14px; color: var(--accent); letter-spacing: 0.04em; }
.lf-support-card h5 { font-size: 16px; color: var(--navy); margin-bottom: 8px; line-height: 1.3; }
.lf-support-card p { font-size: 13.5px; line-height: 1.65; color: var(--ink-soft); margin: 0; }
@media (max-width: 900px) { .lf-support-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .lf-support-grid { grid-template-columns: 1fr; } }
html, body { overflow-x: hidden; max-width: 100%; }

/* Process / werkwijze */
.lf-process { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; margin-top: 20px; }
.lf-process-line { position: absolute; top: 28px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, var(--ink-line) 8%, var(--ink-line) 92%, transparent); z-index: 0; }
.lf-process-step { position: relative; z-index: 1; background: transparent; padding: 0 8px; text-align: left; }
.lf-process-num { width: 56px; height: 56px; border-radius: 50%; background: #fff; border: 2px solid var(--accent); color: var(--accent); display:inline-flex; align-items:center; justify-content:center; font-family: var(--font-display); font-size: 17px; font-weight: 700; margin-bottom: 18px; box-shadow: 0 6px 18px -6px rgba(217,140,3,0.35); letter-spacing: -0.01em; }
.lf-process-step h5 { font-size: 15px; color: var(--navy); margin-bottom: 8px; line-height: 1.3; }
.lf-process-step p { font-size: 13px; line-height: 1.6; color: var(--ink-soft); margin: 0 0 10px; }
.lf-process-time { display:inline-block; padding: 4px 10px; background: rgba(217,140,3,0.10); color: var(--accent); border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
@media (max-width: 900px) { .lf-process { grid-template-columns: 1fr; gap: 28px; } .lf-process-line { display: none; } .lf-process-step { display: grid; grid-template-columns: auto 1fr; gap: 0 18px; } .lf-process-num { margin-bottom: 0; grid-row: 1 / 4; } }

/* FAQ */
.lf-faq-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 64px; align-items: start; }
.lf-faq-side .lf-cta-pill { margin-top: 12px; }
.lf-faq-list .faq-item { background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 10px; margin-bottom: 12px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.lf-faq-list .faq-item:hover { border-color: #c9d1de; }
.lf-faq-list .faq-item.open { border-color: var(--accent); box-shadow: 0 12px 28px -16px rgba(217,140,3,0.25); }
.lf-faq-list .faq-q { width: 100%; display:flex; align-items:center; justify-content:space-between; gap: 18px; padding: 20px 24px; background: transparent; border: none; cursor: pointer; text-align: left; font-family: inherit; font-size: 15px; font-weight: 600; color: var(--navy); letter-spacing: -0.005em; }
.lf-faq-list .faq-icon { color: var(--accent); flex-shrink: 0; transition: transform 0.25s var(--ease); }
.lf-faq-list .faq-item.open .faq-icon { transform: rotate(45deg); }
.lf-faq-list .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.35s var(--ease); }
.lf-faq-list .faq-item.open .faq-a { max-height: 400px; }
.lf-faq-list .faq-a p { padding: 0 24px 22px; font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0; }
@media (max-width: 900px) { .lf-faq-grid { grid-template-columns: 1fr; gap: 36px; } }

/* ─── Floating mobile call button (FAB) ─── */
.lf-fab-call { display: none; }
@media (max-width: 760px) {
  .lf-fab-call {
    position: fixed;
    right: 16px;
    bottom: calc(20px + env(safe-area-inset-bottom));
    z-index: 60;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 15px 22px 15px 18px;
    background: #0a1628;
    color: #fff !important;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.01em;
    text-decoration: none;
    border-radius: 999px;
    border: 2px solid #fff;
    box-shadow: 0 18px 40px -10px rgba(10,22,40,0.55), 0 6px 16px rgba(10,22,40,0.25);
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    pointer-events: none;
    transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1);
  }
  body.nav-revealed .lf-fab-call {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }
  .lf-fab-call:active { transform: scale(0.95); }
}

/* ─── Mobile-specific polish (≤760px) ─── */
@media (max-width: 760px) {
  .wrap { padding-left: 18px !important; padding-right: 18px !important; }
  .lf-section { padding: 56px 0; }
  .lf-section-head { margin-bottom: 32px; }
  .lf-section-head.centered { margin-bottom: 32px; }
  .lf-h2 { font-size: 26px; line-height: 1.2; }
  .lf-eyebrow { font-size: 10px; padding: 5px 11px; margin-bottom: 14px; }
  .lf-lede { font-size: 14.5px; line-height: 1.6; }

  /* Hero */
  .lf-hero { min-height: 560px; }
  .lf-hero-wrap { padding-top: 110px !important; padding-bottom: 60px !important; padding-left: 20px !important; padding-right: 20px !important; }
  .lf-hero-card { padding: 28px 22px; border-radius: 14px; }
  .lf-hero-card h1 { font-size: 28px; line-height: 1.18; margin-bottom: 12px; }
  .lf-hero-card p { font-size: 14px; margin-bottom: 20px; }

  /* Stats, 2x2 with thin dividers */
  .lf-stats { padding: 26px 0; }
  .lf-stats-inner { grid-template-columns: 1fr 1fr; gap: 22px 18px; padding: 0 6px; }
  .lf-stat strong { font-size: 26px; }
  .lf-stat span { font-size: 11.5px; }

  /* Partners, compact 4-col */
  .lf-partners { padding: 40px 0; }
  .lf-partners-head { margin-bottom: 24px; }
  .lf-partners-head p { font-size: 13px; }
  .lf-partners-row { grid-template-columns: repeat(4, 1fr); gap: 18px 14px; }
  .lf-partners-row img { height: 28px; }

  /* About + form */
  .lf-about-grid { gap: 32px; }
  .lf-form { padding: 24px 20px; border-radius: 14px; }
  .lf-form-header h3 { font-size: 20px; }

  /* Services stack on mobile: shorter slot so it doesn't feel sluggish on phones */
  .lf-services .lf-svc-grid[data-svc-stack] .lf-svc-slot { height: 90vh; }
  .lf-services .lf-svc-grid[data-svc-stack] .lf-svc-card { max-width: 460px; border-radius: 16px; box-shadow: 0 1px 2px rgba(15,17,21,.05), 0 30px 60px -28px rgba(15,17,21,.28); }
  .lf-services .lf-svc-grid[data-svc-stack] .lf-svc-img { aspect-ratio: 16/10; }
  .lf-svc-body { padding: 18px; }
  .lf-svc-body h4 { font-size: 16px; }
  .lf-blog-body { padding: 18px; }
  .lf-blog-grid { gap: 16px; }

  /* Support: 2x2 */
  .lf-support-grid { grid-template-columns: 1fr; gap: 12px; }
  .lf-support-card { padding: 18px 18px; display: flex; gap: 14px; align-items: flex-start; }
  .lf-support-card > div:first-child { flex-shrink: 0; padding: 0; margin: 0; border: none; flex-direction: column; align-items: center; min-width: 44px; }
  .lf-support-card .lf-support-meta { padding: 0; margin: 0; border: none; flex-direction: column; align-items: flex-start; gap: 2px; min-width: 56px; }
  .lf-support-card .lf-support-meta span { font-size: 22px; color: var(--accent); }
  .lf-support-card h5 { font-size: 14.5px; margin-bottom: 4px; }
  .lf-support-card p { font-size: 12.5px; line-height: 1.55; }

  /* Why-us: stacked but compact 2-col grid where possible */
  .lf-why-collage { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto auto; gap: 12px; }
  .lf-why-photo { grid-row: 2; grid-column: 1 / 3; height: 200px; border-radius: 12px; }
  .lf-why-tl { grid-area: 1 / 1; } .lf-why-tr { grid-area: 1 / 2; }
  .lf-why-bl { grid-area: 3 / 1; } .lf-why-br { grid-area: 3 / 2; }
  .lf-why-tile { padding: 18px 14px; }
  .lf-why-tile h5 { font-size: 13.5px; margin-top: 10px; }
  .lf-why-tile p { font-size: 12.5px; }
  .lf-why-meta { gap: 10px; padding-bottom: 10px; }

  /* Trust strip stays 1-col but tighter */
  .lf-trust-strip { padding: 20px 18px; gap: 14px; margin-top: 28px; }

  /* Skills */
  .lf-skills-grid { gap: 32px; }
  .lf-skills-collage { grid-template-columns: 1fr; gap: 12px; }
  .lf-skills-img1, .lf-skills-img2 { height: 240px; }

  /* Process: vertical timeline with line on left */
  .lf-process { grid-template-columns: 1fr; gap: 0; padding-left: 8px; }
  .lf-process-line { display: block; left: 35px; right: auto; top: 28px; bottom: 28px; width: 2px; height: auto; background: var(--ink-line); }
  .lf-process-step { display: grid; grid-template-columns: 56px 1fr; gap: 0 18px; padding: 14px 0 18px 0; }
  .lf-process-num { margin-bottom: 0; grid-row: 1 / 4; }
  .lf-process-step h5 { margin-top: 14px; }

  /* Projects */
  .lf-proj-tabs-wrap { margin-bottom: 28px; }
  .lf-proj-tabs { padding: 4px; gap: 2px; }
  .lf-proj-chip { padding: 8px 14px; font-size: 12px; }
  .lf-proj-cap strong { font-size: 15px; }

  /* Testimonials, horizontal swipe */
  .lf-testi-grid { display: flex; grid-template-columns: none; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 0 18px 12px; margin: 0 -18px; -webkit-overflow-scrolling: touch; }
  .lf-testi-grid::-webkit-scrollbar { display: none; }
  .lf-testi { flex: 0 0 86%; scroll-snap-align: start; padding: 24px; }

  /* CTA banner */
  .lf-cta { padding: 32px 22px; border-radius: 14px; }
  .lf-cta-text h2 { font-size: 24px; }

  /* FAQ */
  .lf-faq-grid { gap: 28px; }
  .lf-faq-list .faq-q { padding: 16px 18px; font-size: 14px; gap: 12px; }
  .lf-faq-list .faq-a p { padding: 0 18px 18px; font-size: 13.5px; }
}
`;

export default function Home() {
  useEffect(() => {
    document.title = "AB Bouw Group, Vakkundige bouw en renovatie in Vlaanderen";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "AB Bouw Group: Vlaams familiebedrijf voor bouw en renovatie sinds 2010. Eigen vakmensen, vaste projectleider, vaste prijs.");
    const prevClass = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = EXTRA_STYLE;
    document.head.appendChild(styleEl);

    // Custom dropdown behaviour
    const ddSetup = () => {
      const dds = document.querySelectorAll<HTMLElement>('[data-dd]');
      const cleanups: Array<() => void> = [];
      dds.forEach((dd) => {
        const toggle = dd.querySelector<HTMLElement>('[data-dd-toggle]');
        const label = dd.querySelector<HTMLElement>('[data-dd-label]');
        const input = dd.querySelector<HTMLInputElement>('[data-dd-input]');
        const opts = dd.querySelectorAll<HTMLElement>('[data-dd-opt]');
        if (!toggle || !label || !input) return;
        const onToggle = (e: Event) => { e.stopPropagation(); dd.classList.toggle('open'); toggle.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false'); };
        toggle.addEventListener('click', onToggle);
        const optHandlers: Array<[HTMLElement, () => void]> = [];
        opts.forEach((o) => {
          const h = () => {
            opts.forEach((x) => x.classList.remove('selected'));
            o.classList.add('selected');
            label.textContent = o.textContent || '';
            label.classList.add('has-value');
            input.value = o.textContent || '';
            dd.classList.remove('open');
          };
          o.addEventListener('click', h);
          optHandlers.push([o, h]);
        });
        const onDoc = (e: MouseEvent) => { if (!dd.contains(e.target as Node)) dd.classList.remove('open'); };
        document.addEventListener('click', onDoc);
        cleanups.push(() => {
          toggle.removeEventListener('click', onToggle);
          optHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
          document.removeEventListener('click', onDoc);
        });
      });
      return () => cleanups.forEach((c) => c());
    };
    const ddCleanup = ddSetup();

    return () => { document.body.className = prevClass; styleEl.remove(); ddCleanup(); };
  }, []);

  useAbBouwInteractions();

  const html = HTML({
    hero, hero2, hero3, hero4, hero5, about, skills, why, vakmanDak, vakmanInterieur,
    svcConstruct, svcEco, svcInterieur, svcDak, svcBad, svcGevel,
    proj1, proj2, proj3, proj4,
    team1, team2, team3, ctaMan,
    blog1, blog2, blog3, logo, logoHero,
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
