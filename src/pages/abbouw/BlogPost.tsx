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
    document.title = post ? `${post.title} | AB Bouw Group` : 'Artikel | AB Bouw Group';
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
</article>

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
</style>
`;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
