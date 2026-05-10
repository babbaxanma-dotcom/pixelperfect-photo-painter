import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from './_shell';
import { BLOGS } from '@/data/blogs';
import heroBlog from '@/assets/home/hero-blog.jpg';

const HTML = `
${buildNav('home' as any)}

<section class="lf-hero" style="min-height: 460px;">
  <div class="lf-hero-bg" style="background-image: url('${heroBlog}'); background-size: cover; background-position: center;"></div>
  <div class="lf-hero-bg" style="background: linear-gradient(180deg, rgba(11,18,32,0.55) 0%, rgba(11,18,32,0.35) 60%, rgba(11,18,32,0.6) 100%);"></div>
  <div class="wrap lf-hero-wrap">
    <div class="lf-hero-card" data-reveal>
      <span class="lf-eyebrow">Bouwblog</span>
      <h1>Inzichten uit de praktijk,<br/>geschreven op de werf.</h1>
      <p>Tips, trends en technieken van onze eigen vakmensen en projectleiders. Geen marketingpraat, gewoon wat werkt, wat niet, en wat het kost.</p>
    </div>
  </div>
</section>

<section class="lf-section">
  <div class="wrap">
    <div class="lf-blog-grid">
      ${BLOGS.map(b => `
        <article class="lf-blog-card" data-reveal>
          <div class="lf-blog-img">
            <img src="${b.img}" alt="${b.title}" loading="lazy"/>
            <span class="lf-blog-tag">${b.tag}</span>
            <span class="lf-blog-date-badge"><strong>${b.day}</strong><em>${b.month}</em></span>
          </div>
          <div class="lf-blog-body">
            <h4><a href="/blog/${b.slug}">${b.title}</a></h4>
            <p>${b.excerpt}</p>
            <div class="lf-blog-foot">
              <a href="/blog/${b.slug}" class="lf-blog-btn">Lees meer
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <span class="lf-blog-author">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ${b.author} · ${b.readTime}
              </span>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

${FOOTER}
`;

export default function Blog() {
  useEffect(() => {
    document.title = 'Bouwblog | AB Bouw Group';
    const prevClass = document.body.className;
    document.body.className = 'ab-body';
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prevClass; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
