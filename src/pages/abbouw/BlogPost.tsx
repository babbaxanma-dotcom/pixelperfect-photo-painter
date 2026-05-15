import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildCta, FOOTER, SHELL_STYLE } from './_shell';
import { BLOGS } from '@/data/blogs';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOGS.find(b => b.slug === slug);
  const others = BLOGS.filter(b => b.slug !== slug).slice(0, 3);

  useEffect(() => {
    document.title = post ? `${post.title} | AB Bouw Groep` : 'Artikel | AB Bouw Groep';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', post ? post.excerpt.substring(0, 158) : 'Bouwblog AB Bouw Groep — vakkennis en inzichten uit de Vlaamse bouwpraktijk.');

    const prevClass = document.body.className;
    document.body.className = 'ab-body';
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    window.scrollTo(0, 0);
    return () => { document.body.className = prevClass; styleEl.remove(); };
  }, [slug, post]);
  useAbBouwInteractions();

  if (!post) {
    const html = `
      ${buildNav('home' as any)}
      <section class="lf-section" style="padding-top: 180px;">
        <div class="wrap" style="text-align:center;">
          <span class="lf-eyebrow">404</span>
          <h1 class="lf-h2">Artikel niet gevonden</h1>
          <p class="lf-lede" style="margin: 0 auto 24px;">Dit artikel bestaat niet of werd verplaatst.</p>
          <a href="/blog" class="lf-cta-pill"><span>Terug naar de blog</span></a>
        </div>
      </section>
      ${FOOTER}
    `;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const html = `
${buildNav('home' as any)}

<article class="ab-article">
  <div class="ab-article-hero">
    <img src="${post.img}" alt="${post.title}" />
    <div class="ab-article-hero-overlay"></div>
    <div class="wrap ab-article-hero-inner">
      <a href="/blog" class="ab-article-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg><span>Terug naar blog</span></a>
      <span class="lf-blog-tag" style="position:static; display:inline-block;">${post.tag}</span>
      <h1>${post.title}</h1>
      <div class="ab-article-meta">
        <span>${post.author}</span>
        <span>·</span>
        <span>${post.date}</span>
        <span>·</span>
        <span>${post.readTime} leestijd</span>
      </div>
    </div>
  </div>

  <section class="lf-section" style="padding-top: 64px;">
    <div class="wrap">
      <div class="ab-article-body">
        ${post.body}
      </div>
    </div>
  </section>

  <section class="lf-section" style="padding: 24px 0 56px;">
    <div class="wrap">
      <div class="ab-article-cta" data-reveal>
        <div class="ab-article-cta-text">
          <span class="lf-eyebrow">Hulp nodig voor uw project?</span>
          <h3>Vraag een <strong>gratis plaatsbezoek</strong> aan</h3>
          <p>Onze projectleider komt vrijblijvend langs in heel Vlaanderen, meet uw situatie op, en stuurt een <strong>vrijblijvende offerte</strong> binnen 5 werkdagen. Premie-dossier inbegrepen.</p>
        </div>
        <div class="ab-article-cta-actions">
          <a href="/contact" class="lf-cta-pill"><span>Vraag uw gratis plaatsbezoek aan</span><span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></a>
          <a href="tel:+32470634413" class="ab-article-cta-phone">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>+32 470 63 44 13</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</article>

<a href="/contact" class="ab-blog-sticky-cta">Vraag uw <strong>gratis</strong> offerte aan
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
</a>

<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Lees ook</span>
      <h2 class="lf-h2">Andere artikels</h2>
    </div>
    <div class="lf-blog-grid">
      ${others.map(b => `
        <article class="lf-blog-card" data-reveal>
          <div class="lf-blog-img">
            <img src="${b.img}" alt="${b.title}" loading="lazy"/>
            <span class="lf-blog-tag">${b.tag}</span>
          </div>
          <div class="lf-blog-body">
            <h4><a href="/blog/${b.slug}">${b.title}</a></h4>
            <p>${b.excerpt}</p>
            <div class="lf-blog-foot">
              <a href="/blog/${b.slug}" class="lf-blog-btn">Lees meer
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

${buildCta('Klaar om te bouwen?', 'Een eerste gesprek is altijd vrijblijvend. We komen langs, luisteren, en geven u een eerlijk advies.')}

${FOOTER}

<style>
.ab-article-hero { position: relative; height: 60vh; min-height: 440px; overflow: hidden; }
.ab-article-hero img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.ab-article-hero-overlay { position:absolute; inset:0; background: linear-gradient(180deg, rgba(10,22,40,0.35) 0%, rgba(10,22,40,0.85) 100%); }
.ab-article-hero-inner { position: relative; z-index: 2; height: 100%; display:flex; flex-direction:column; justify-content:flex-end; padding-bottom: 56px; color:#fff; }
.ab-article-hero-inner h1 { font-family: var(--font-display); font-size: clamp(28px, 4vw, 48px); line-height: 1.15; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 16px 0 16px; max-width: 880px; }
.ab-article-back { display:inline-flex; align-items:center; gap:8px; color: rgba(255,255,255,0.85); font-size: 13px; margin-bottom: 18px; text-decoration: none; transition: color 0.2s, transform 0.2s; }
.ab-article-back svg { transition: transform 0.2s; }
.ab-article-back:hover { color: var(--accent); }
.ab-article-back:hover svg { transform: translateX(-3px); }
.ab-article-meta { display:flex; gap:8px; flex-wrap:wrap; font-size: 13px; color: rgba(255,255,255,0.85); letter-spacing: 0.02em; }
.ab-article-body { max-width: 720px; margin: 0 auto; }
.ab-article-body p, .ab-article-body li { font-size: 16px; line-height: 1.8; color: var(--ink-soft); margin-bottom: 18px; }
.ab-article-body h3 { font-family: var(--font-display); font-size: clamp(20px, 2vw, 26px); color: var(--navy); margin: 36px 0 14px; font-weight: 600; }
.ab-article-body ul { padding-left: 20px; }
.ab-article-body .lf-lede { font-size: 19px; line-height: 1.65; color: var(--ink); margin-bottom: 28px; }

/* Blog post CTA — inline na artikel body */
.ab-article-cta {
  background: linear-gradient(135deg, var(--navy) 0%, #0d2247 100%);
  color: #fff;
  border-radius: 18px;
  padding: 40px 44px;
  display: grid; grid-template-columns: 1fr auto; gap: 36px; align-items: center;
  box-shadow: 0 24px 60px -24px rgba(10,22,40,0.45);
  position: relative; overflow: hidden;
}
.ab-article-cta::before {
  content: ''; position: absolute; top: -40%; right: -10%; width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(217,140,3,0.22) 0%, transparent 70%);
  pointer-events: none;
}
.ab-article-cta-text { position: relative; z-index: 1; }
.ab-article-cta-text .lf-eyebrow { color: var(--accent); margin-bottom: 8px; }
.ab-article-cta-text h3 { font-family: var(--font-display); font-size: clamp(22px, 2.4vw, 28px); font-weight: 600; letter-spacing: -0.02em; color: #fff; margin: 0 0 10px; }
.ab-article-cta-text h3 strong { color: var(--accent); font-weight: 700; }
.ab-article-cta-text p { font-size: 14.5px; line-height: 1.6; color: rgba(255,255,255,0.86); margin: 0; max-width: 520px; }
.ab-article-cta-text p strong { color: #fff; font-weight: 600; }
.ab-article-cta-actions { display: flex; flex-direction: column; gap: 12px; align-items: stretch; position: relative; z-index: 1; }
.ab-article-cta-phone {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 12px 20px; border-radius: 999px;
  background: rgba(255,255,255,0.10); color: #fff; text-decoration: none;
  font-family: var(--font-display); font-weight: 500; font-size: 13.5px;
  border: 1px solid rgba(255,255,255,0.18);
  transition: background .2s ease, transform .15s ease;
}
.ab-article-cta-phone:hover { background: rgba(255,255,255,0.16); transform: translateY(-1px); color: #fff; }
@media (max-width: 760px) {
  .ab-article-cta { grid-template-columns: 1fr; padding: 28px 24px; gap: 22px; }
}

/* Sticky mobile bottom CTA — alleen op blog posts, alleen mobile */
.ab-blog-sticky-cta {
  display: none;
}
@media (max-width: 760px) {
  .ab-blog-sticky-cta {
    position: fixed;
    left: 14px; right: 88px;
    bottom: 16px;
    z-index: 90;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 18px;
    background: var(--accent);
    color: #fff !important;
    border-radius: 999px;
    font-family: var(--font-display);
    font-size: 13.5px; font-weight: 600;
    text-decoration: none;
    box-shadow: 0 14px 32px -6px rgba(217,140,3,0.55);
    transition: transform .15s ease;
  }
  .ab-blog-sticky-cta:hover { transform: translateY(-1px); }
  .ab-blog-sticky-cta strong { font-weight: 700; }
  body.is-scrolled .ab-blog-sticky-cta { animation: ab-blog-cta-in .3s ease; }
}
@keyframes ab-blog-cta-in {
  from { transform: translateY(120%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
`;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
