/**
 * LpLokaal — dynamic local landing page per gemeente per service.
 * URL pattern: /lokaal/:service-:slug (bv /lokaal/dakwerker-mechelen)
 *
 * SEO doel: long-tail local pack rank voor "dakwerker [stad]" + "gevelrenovatie [stad]"
 * Per pagina: uniek H1 + meta + canonical + LocalBusiness schema met City + GeoCoords.
 */
import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from '../_shell';
import { GEMEENTES, type Gemeente } from '@/data/gemeentes';

type ServiceKey = 'dakwerker' | 'gevelrenovatie';

const SERVICE_META: Record<ServiceKey, {
  label: string;
  hero: string;
  intro: string;
  bullets: string[];
  ctaText: string;
  faqs: { q: string; a: string }[];
}> = {
  dakwerker: {
    label: 'Dakwerker',
    hero: 'Erkend dakwerker',
    intro: 'Pannendak Koramic, plat dak EPDM, sarkingisolatie, zinkwerk + dakgoten, natuurleien — alle dakwerken door eigen ploeg.',
    bullets: [
      'Pannendaken Koramic (Aleonard, Nuance, klassiek + nieuwbouw)',
      'Plat dak EPDM Firestone — gegarandeerd waterdicht 25j',
      'Sarkingisolatie buitenop bestaand dak — geen binnenafwerking kwijt',
      'Natuurleien Cupa — Vlaamse standaard, levensduur 100+ jaar',
      'Zinkwerk VMZinc + dakgoten in Anthra-Zinc anthraciet',
      'Volledig premiedossier Mijn VerbouwPremie tot €5.750'
    ],
    ctaText: 'gratis dakinspectie',
    faqs: [
      { q: 'Hoeveel kost een nieuw dak?', a: 'Pannendak met sarkingisolatie €120-€170/m². Plat dak EPDM €90-€140/m². Definitieve prijs na plaatsbezoek — vaste prijs in offerte.' },
      { q: 'Doen jullie de premieaanvraag?', a: 'Ja, standaard. Wij dienen Mijn VerbouwPremie in via Mijn VerbouwLoket. U deelt enkel uw itsme-login.' },
      { q: 'Hoe lang duren dakwerken?', a: 'Rijwoning waterdicht binnen 2 weken. Volledige renovatie met isolatie 3-5 weken.' },
      { q: 'Garantie?', a: '10 jaar wettelijke aansprakelijkheid via Federale Verzekering. Plus 30-50 jaar fabrieksgarantie op Koramic/Firestone materialen.' }
    ]
  },
  gevelrenovatie: {
    label: 'Gevelrenovatie',
    hero: 'Erkend gevelrenovatiebedrijf',
    intro: 'Crepi-afwerking, ETICS-buitenisolatie, steenstrips, marmorino sierpleister, gevelherstel — alle gevelwerken door eigen ploeg.',
    bullets: [
      'Witte / grijze / beige crepi-afwerking',
      'ETICS-buitenisolatie 16cm EPS + crepi — EPC-sprong tot 80 punten',
      'Steenstrips Vandersanden — gevelsteen-look zonder gewicht',
      'Marmorino sierpleister voor karaktervolle uitstraling',
      'Gevelherstel + scheurherstel vóór afwerking',
      'Volledig premiedossier Mijn VerbouwPremie tot €5.000'
    ],
    ctaText: 'gratis gevelinspectie',
    faqs: [
      { q: 'Hoeveel kost crepi?', a: 'Pure crepi €45-€75/m². ETICS-systeem (isolatie + crepi) €110-€150/m². Vaste prijs in offerte na plaatsbezoek.' },
      { q: 'Verschil crepi en ETICS?', a: 'Crepi = sierpleister direct op gevel. ETICS = EPS-isolatie + wapeningsnet + crepi-afwerking — voor energieprestatie EN optiek.' },
      { q: 'Premie 2026?', a: 'Voor ETICS-buitenisolatie tot €5.000 via Mijn VerbouwPremie. Pure crepi zonder isolatie krijgt sinds 2026 geen premie meer.' },
      { q: 'Hoe lang?', a: 'Rijwoning gevel 2 weken. Halfopen/vrijstaand 3-4 weken inclusief stelling + uithardingstijd.' }
    ]
  }
};

const NAV = buildNav('home');

function pageHtml(service: ServiceKey, g: Gemeente) {
  const sm = SERVICE_META[service];
  const fullTitle = `${sm.label} ${g.name} — ${sm.ctaText} | AB Bouw Groep`;
  const url = `https://abgroep.be/lokaal/${service}-${g.slug}`;
  const neighList = g.neighborhoods?.length ? `Ook actief in: ${g.neighborhoods.join(', ')}.` : '';

  return `
${NAV}

<section class="lf-hero page-hero" style="min-height:auto; padding: 140px 0 60px; background: linear-gradient(180deg, #0a1628 0%, #142944 100%); color: #fff;">
  <div class="wrap">
    <div class="breadcrumb" style="color: rgba(255,255,255,0.7); margin-bottom: 16px;">
      <a href="/" style="color: rgba(255,255,255,0.85);">Home</a>
      <span class="sep">/</span>
      <a href="${service === 'dakwerker' ? '/lp/dakwerken' : '/lp/gevel'}" style="color: rgba(255,255,255,0.85);">${sm.label}</a>
      <span class="sep">/</span>
      <span class="current">${g.name}</span>
    </div>
    <span class="lf-eyebrow" style="color:#d98c03;">Lokaal in ${g.name}</span>
    <h1 style="font-family:var(--font-display); font-size: clamp(32px, 4.8vw, 56px); line-height: 1.1; font-weight: 600; letter-spacing: -0.02em; margin: 8px 0 18px; color:#fff;">
      ${sm.hero} in <span style="color:#d98c03;">${g.name}</span>.
    </h1>
    <p style="font-size: 17px; line-height: 1.6; max-width: 640px; color: rgba(255,255,255,0.86);">${g.intro}</p>
    <div style="margin-top: 28px; display: flex; gap: 14px; flex-wrap: wrap;">
      <a href="${service === 'dakwerker' ? '/lp/dakwerken#lp-form' : '/lp/gevel#lp-form'}" class="lf-cta-pill" style="background:#d98c03; color:#fff; padding:16px 28px; border-radius:999px; text-decoration:none; font-weight:600;">
        Plan ${sm.ctaText} in ${g.name}
      </a>
      <a href="tel:+32470634413" class="lf-btn-ghost" style="background:rgba(255,255,255,0.1); color:#fff; padding:16px 24px; border-radius:999px; text-decoration:none; border:1px solid rgba(255,255,255,0.3);">
        Bel +32 470 63 44 13
      </a>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" style="margin-bottom:32px;">
      <span class="lf-eyebrow">Diensten in ${g.name}</span>
      <h2 class="lf-h2">${sm.label} ${g.name} — onze<br/><span class="ab-mark">specialisaties</span>.</h2>
      <p class="lf-lede" style="margin: 14px auto 0; max-width: 620px;">${sm.intro}</p>
    </div>
    <ul class="ab-checks" style="max-width: 760px; margin: 32px auto 0;">
      ${sm.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" style="margin-bottom:28px;">
      <span class="lf-eyebrow">Waarom AB Bouw in ${g.name}</span>
      <h2 class="lf-h2">Lokaal verankerd,<br/><span class="ab-mark">lokaal vertrouwd</span>.</h2>
    </div>
    <ul class="ab-checks" style="max-width: 760px; margin: 0 auto;">
      ${g.highlights.map(h => `<li>${h}</li>`).join('')}
    </ul>
    ${neighList ? `<p style="text-align:center; margin-top:24px; color:var(--ink-mute); font-size:14px;">${neighList}</p>` : ''}
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" style="margin-bottom: 28px;">
      <span class="lf-eyebrow">${g.reviewCount}+ klanten in ${g.name}</span>
      <h2 class="lf-h2"><span class="ab-mark">${g.rating}/5</span> beoordeling.</h2>
    </div>
    <p style="text-align:center; max-width: 620px; margin: 0 auto; color: var(--ink-soft);">
      Vraag onze postcode-portfolio op aanvraag — wij delen adressen van afgewerkte projecten binnen 5 km van ${g.name} centrum zodat u onze kwaliteit zelf kan zien.
    </p>
  </div>
</section>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" style="margin-bottom: 28px;">
      <span class="lf-eyebrow">Veelgestelde vragen — ${g.name}</span>
      <h2 class="lf-h2">Wat u wil <span class="ab-mark">weten</span>.</h2>
    </div>
    <div style="max-width: 760px; margin: 0 auto;">
      ${sm.faqs.map(f => `
        <details style="background:#fff; border:1px solid var(--ink-line-soft); border-radius:14px; padding:18px 22px; margin-bottom:10px;">
          <summary style="font-family:var(--font-display); font-weight:700; cursor:pointer; color:var(--navy);">${f.q}</summary>
          <div class="ab-faq-body" style="margin-top:10px; color:var(--ink-soft);"><p>${f.a}</p></div>
        </details>
      `).join('')}
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap" style="text-align:center;">
    <h2 class="lf-h2" style="margin-bottom:16px;">Klaar voor een ${sm.ctaText} in ${g.name}?</h2>
    <p style="max-width: 580px; margin: 0 auto 24px; color: var(--ink-soft);">Wij komen binnen 5 werkdagen langs voor opname + vaste prijs. 100% vrijblijvend.</p>
    <a href="${service === 'dakwerker' ? '/lp/dakwerken#lp-form' : '/lp/gevel#lp-form'}" class="lf-cta-pill" style="background:#d98c03; color:#fff; padding:16px 32px; border-radius:999px; text-decoration:none; font-weight:600; display:inline-block;">
      Plan ${sm.ctaText} in ${g.name}
    </a>
  </div>
</section>

${FOOTER}
`;
}

export default function LpLokaal() {
  const params = useParams<{ slug: string }>();
  const full = params.slug || '';
  // Parse: "dakwerker-mechelen" / "gevelrenovatie-mechelen"
  const m = full.match(/^(dakwerker|gevelrenovatie)-(.+)$/);
  if (!m) return <Navigate to="/" replace />;
  const service = m[1] as ServiceKey;
  const gemeenteSlug = m[2];
  const g = GEMEENTES[gemeenteSlug];
  if (!g) return <Navigate to="/" replace />;

  const sm = SERVICE_META[service];
  const url = `https://abgroep.be/lokaal/${service}-${g.slug}`;
  const title = `${sm.label} ${g.name} — ${sm.ctaText} | AB Bouw Groep`;
  const description = `Erkend ${sm.label.toLowerCase()} in ${g.name}. ${sm.intro} ${g.reviewCount}+ realisaties. Gratis plaatsbezoek binnen 5 werkdagen. 10j garantie via Federale Verzekering.`;

  useEffect(() => {
    document.title = title;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        const parts = sel.match(/\[(.+?)="(.+?)"\]/);
        if (parts) el.setAttribute(parts[1], parts[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:locale"]', 'content', 'nl_BE');
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');

    // Canonical
    let canon = document.querySelector('link[rel="canonical"]:not([hreflang])');
    if (!canon) { canon = document.createElement('link'); canon.setAttribute('rel', 'canonical'); document.head.appendChild(canon); }
    canon.setAttribute('href', url);

    // Schema.org
    const schemaId = 'lp-lokaal-schema';
    document.getElementById(schemaId)?.remove();
    const schemaEl = document.createElement('script');
    schemaEl.id = schemaId;
    schemaEl.type = 'application/ld+json';
    schemaEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": service === 'dakwerker' ? "RoofingContractor" : "HomeAndConstructionBusiness",
          "name": `AB Bouw Groep — ${sm.label} ${g.name}`,
          "url": url,
          "telephone": "+32470634413",
          "email": "info@abgroep.be",
          "address": { "@type": "PostalAddress", "streetAddress": "August van Landeghemstraat 65", "postalCode": "2830", "addressLocality": "Willebroek", "addressCountry": "BE" },
          "areaServed": { "@type": "City", "name": g.name, "geo": { "@type": "GeoCoordinates", "latitude": g.lat, "longitude": g.lng } },
          "geo": { "@type": "GeoCoordinates", "latitude": g.lat, "longitude": g.lng },
          "priceRange": "€€",
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": g.rating, "reviewCount": String(g.reviewCount), "bestRating": "5" }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://abgroep.be" },
            { "@type": "ListItem", "position": 2, "name": sm.label, "item": `https://abgroep.be${service === 'dakwerker' ? '/lp/dakwerken' : '/lp/gevel'}` },
            { "@type": "ListItem", "position": 3, "name": g.name, "item": url }
          ]
        },
        {
          "@type": "FAQPage",
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ab-faq-body p"] },
          "mainEntity": sm.faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
        }
      ]
    });
    document.head.appendChild(schemaEl);

    const prev = document.body.className;
    document.body.className = 'is-subpage';
    const style = document.createElement('style');
    style.textContent = SHELL_STYLE;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    return () => {
      document.body.className = prev;
      style.remove();
      document.getElementById(schemaId)?.remove();
    };
  }, [full]);

  useAbBouwInteractions();

  return <div dangerouslySetInnerHTML={{ __html: pageHtml(service, g) }} />;
}
