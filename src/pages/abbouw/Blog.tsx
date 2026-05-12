import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from './_shell';
import { BLOGS } from '@/data/blogs';
import heroBlog from '@/assets/home/hero-blog.jpg';

const featured = BLOGS[0];
const latest = BLOGS.slice(1, 4);
const archive = BLOGS.slice(1);
const topics = ['Renovatie', 'Energie', 'Bad & Wellness', 'Gevel', 'Interieur'];

const HTML = `
${buildNav('blog')}

<section class="lf-hero lf-blog-hero">
  <div class="lf-hero-bg" style="background-image: url('${heroBlog}'); background-size: cover; background-position: center;"></div>
  <div class="wrap lf-blog-hero-wrap">
    <div class="lf-blog-hero-copy" data-reveal="left">
      <span class="lf-blog-kicker">Bouwblog</span>
      <h1>Vakkennis en inzichten<br/>uit de Vlaamse bouwpraktijk.</h1>
      <p>Analyses, technische dossiers en praktijkervaringen van onze projectleiders, vakmensen en interieurarchitecten. Onderbouwde antwoorden op de vragen die u zich stelt vóór, tijdens en na de werken.</p>
      <div class="lf-blog-hero-meta">
        <span><strong>${BLOGS.length}</strong> actuele artikels</span>
        <span><strong>2026</strong> premies & regels</span>
        <span><strong>Vlaanderen</strong> praktijkgericht</span>
      </div>
    </div>
  </div>
  <button class="lf-scroll-cue" type="button" aria-label="Scroll naar beneden" onclick="window.scrollBy({top: window.innerHeight - 80, left: 0, behavior: 'smooth'})">
    <span class="lf-scroll-cue-label">Scroll</span>
    <span class="lf-scroll-cue-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
  </button>
</section>

<section class="lf-section lf-blog-editorial">
  <div class="wrap">
    <div class="lf-blog-section-head" data-reveal>
      <span class="lf-eyebrow">Uitgelicht</span>
      <h2 class="lf-h2">Eerst lezen als u <span class="ab-mark">slim wil bouwen</span>.</h2>
    </div>

    <div class="lf-blog-magazine">
      <article class="lf-blog-feature" data-reveal="right">
        <a class="lf-blog-feature-img" href="/blog/${featured.slug}">
          <img src="${featured.img}" alt="${featured.title}" loading="eager"/>
          <span class="lf-blog-tag">${featured.tag}</span>
        </a>
        <div class="lf-blog-feature-body">
          <div class="lf-blog-feature-date"><strong>${featured.day}</strong><em>${featured.month}</em></div>
          <h2><a href="/blog/${featured.slug}">${featured.title}</a></h2>
          <p>${featured.excerpt} <span class="ab-hl" data-hl-delay="1">Concreet, nuchter en toepasbaar</span> op Vlaamse werven.</p>
          <div class="lf-blog-foot">
            <a href="/blog/${featured.slug}" class="lf-blog-btn">Lees analyse
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <span class="lf-blog-author">${featured.author} · ${featured.readTime}</span>
          </div>
        </div>
      </article>

      <aside class="lf-blog-latest" data-reveal="left" data-reveal-delay="1">
        <span class="lf-blog-aside-label">Meest relevant</span>
        ${latest.map((b, idx) => `
          <a class="lf-blog-latest-item" href="/blog/${b.slug}" data-reveal data-reveal-delay="${idx + 1}">
            <img src="${b.img}" alt="${b.title}" loading="lazy"/>
            <span><em>${b.tag} · ${b.readTime}</em><strong>${b.title}</strong></span>
          </a>
        `).join('')}
      </aside>
    </div>
  </div>
</section>

<section class="lf-section lf-tone-soft lf-blog-library">
  <div class="wrap">
    <div class="lf-blog-library-head" data-reveal>
      <div>
        <span class="lf-eyebrow">Alle artikels</span>
        <h2 class="lf-h2">Bouwadvies per onderwerp.</h2>
      </div>
      <div class="lf-blog-topic-row" data-x-rail>
        ${topics.map((topic, idx) => `<span class="lf-blog-topic${idx === 0 ? ' is-active' : ''}">${topic}</span>`).join('')}
      </div>
    </div>
    <div class="ab-scroll-hint lf-blog-mobile-hint"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg> Swipe zijwaarts</div>
    <div class="lf-blog-grid lf-blog-grid--archive" data-x-rail>
      ${archive.map((b, idx) => `
        <article class="lf-blog-card" data-reveal data-reveal-delay="${idx % 4}">
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
    styleEl.textContent = SHELL_STYLE + BLOG_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prevClass; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}

const BLOG_STYLE = `
.lf-blog-hero { min-height: 100vh; min-height: 100svh; align-items: flex-end; }
.lf-blog-hero .lf-hero-bg::after { background: linear-gradient(90deg, rgba(10,18,32,0.88) 0%, rgba(10,18,32,0.58) 46%, rgba(10,18,32,0.22) 100%) !important; }
.lf-blog-hero-wrap { position: relative; z-index: 2; width: 100%; padding: 160px clamp(24px, 6vw, 96px) 110px; }
.lf-blog-hero-copy { max-width: 790px; color: #fff; }
.lf-blog-kicker { display: inline-flex; margin-bottom: 18px; color: rgba(255,255,255,0.74); font-size: 12px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
.lf-blog-hero-copy h1 { font-family: var(--font-display); font-size: clamp(44px, 7vw, 88px); line-height: .96; font-weight: 650; color: #fff; letter-spacing: -0.035em; margin: 0 0 24px; text-wrap: balance; }
.lf-blog-hero-copy p { max-width: 610px; color: rgba(255,255,255,0.82); font-size: clamp(16px, 1.4vw, 19px); line-height: 1.65; margin: 0; }
.lf-blog-hero-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
.lf-blog-hero-meta span { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; color: rgba(255,255,255,.76); font-size: 13px; backdrop-filter: blur(12px); }
.lf-blog-hero-meta strong { color: #fff; font-family: var(--font-display); }
.lf-blog-section-head { max-width: 820px; margin-bottom: 34px; }
.lf-blog-magazine { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(320px, .74fr); gap: 28px; align-items: stretch; }
.lf-blog-feature { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(330px, .82fr); min-height: 520px; background: #fff; border: 1px solid var(--ink-line-soft); border-radius: 18px; overflow: hidden; box-shadow: 0 30px 80px -44px rgba(10,22,40,.28); }
.lf-blog-feature-img { position: relative; display: block; min-height: 100%; overflow: hidden; }
.lf-blog-feature-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .9s var(--ease-out-quart); }
.lf-blog-feature:hover .lf-blog-feature-img img { transform: scale(1.035); }
.lf-blog-feature-body { padding: clamp(30px, 4vw, 54px); display: flex; flex-direction: column; justify-content: center; }
.lf-blog-feature-date { width: 62px; height: 62px; border-radius: 12px; background: var(--navy); color: #fff; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; margin-bottom: 22px; }
.lf-blog-feature-date strong { font-family: var(--font-display); font-size: 24px; }
.lf-blog-feature-date em { font-style: normal; margin-top: 4px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.68); }
.lf-blog-feature h2 { font-family: var(--font-display); font-size: clamp(30px, 3.2vw, 46px); line-height: 1.08; letter-spacing: -0.025em; color: var(--navy); margin: 0 0 18px; }
.lf-blog-feature h2 a { color: inherit; text-decoration: none; }
.lf-blog-feature-body p { color: var(--ink-soft); font-size: 15.5px; line-height: 1.75; margin: 0 0 22px; }
.lf-blog-latest { background: var(--navy); border-radius: 18px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.lf-blog-aside-label { color: rgba(255,255,255,.62); font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; margin-bottom: 4px; }
.lf-blog-latest-item { display: grid; grid-template-columns: 92px 1fr; gap: 14px; padding: 12px; border-radius: 12px; color: #fff; text-decoration: none; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.08); transition: transform .3s var(--ease-out-quart), background .3s var(--ease-out-quart), border-color .3s var(--ease-out-quart); }
.lf-blog-latest-item:hover { transform: translateY(-2px); background: rgba(255,255,255,.105); border-color: rgba(255,255,255,.2); }
.lf-blog-latest-item img { width: 92px; height: 78px; object-fit: cover; border-radius: 9px; }
.lf-blog-latest-item span { display: flex; flex-direction: column; justify-content: center; min-width: 0; }
.lf-blog-latest-item em { font-style: normal; color: rgba(255,255,255,.55); font-size: 11.5px; margin-bottom: 6px; }
.lf-blog-latest-item strong { color: #fff; font-size: 14px; line-height: 1.35; }
.lf-blog-library-head { display: flex; align-items: end; justify-content: space-between; gap: 28px; margin-bottom: 28px; }
.lf-blog-library-head .lf-h2 { margin-bottom: 0; }
.lf-blog-topic-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.lf-blog-topic { display: inline-flex; padding: 10px 16px; border-radius: 999px; background: #fff; border: 1px solid var(--ink-line-soft); color: var(--ink-soft); font-size: 13px; font-weight: 700; white-space: nowrap; transition: transform .3s var(--ease-out-quart), background .3s var(--ease-out-quart), color .3s var(--ease-out-quart); }
.lf-blog-topic.is-active { background: var(--navy); color: #fff; transform: translateY(-2px); }
.lf-blog-grid--archive { align-items: stretch; }
.lf-blog-grid--archive .lf-blog-card { border-radius: 16px; }
.lf-blog-mobile-hint { display: none; }
@media (max-width: 980px) {
  .lf-blog-magazine, .lf-blog-feature { grid-template-columns: 1fr; }
  .lf-blog-feature { min-height: 0; }
  .lf-blog-feature-img { aspect-ratio: 16 / 10; }
  .lf-blog-library-head { align-items: flex-start; flex-direction: column; }
  .lf-blog-topic-row { justify-content: flex-start; }
}
@media (max-width: 720px) {
  .lf-blog-hero { min-height: 76svh !important; align-items: flex-end !important; }
  .lf-blog-hero-wrap { padding: 112px 18px 70px !important; }
  .lf-blog-hero-copy h1 { font-size: 38px; line-height: 1; }
  .lf-blog-hero-meta { gap: 8px; margin-top: 24px; }
  .lf-blog-hero-meta span { font-size: 12px; padding: 9px 12px; }
  .lf-blog-editorial { padding-bottom: 40px; }
  .lf-blog-latest { margin: 0 -18px; border-radius: 0; padding: 22px 18px; overflow-x: auto; overflow-y: hidden; flex-direction: row; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .lf-blog-latest::-webkit-scrollbar { display: none; }
  .lf-blog-aside-label { position: absolute; opacity: 0; pointer-events: none; }
  .lf-blog-latest-item { flex: 0 0 82vw; grid-template-columns: 96px 1fr; scroll-snap-align: center; transform: scale(.96); opacity: .72; }
  .lf-blog-latest-item.is-x-active { transform: scale(1); opacity: 1; background: rgba(255,255,255,.105); border-color: rgba(255,255,255,.2); }
  .lf-blog-library-head { margin-bottom: 16px; }
  .lf-blog-topic-row { width: calc(100% + 36px); margin: 0 -18px; padding: 2px 18px 12px; overflow-x: auto; overflow-y: hidden; flex-wrap: nowrap; scroll-snap-type: x proximity; scrollbar-width: none; }
  .lf-blog-topic-row::-webkit-scrollbar { display: none; }
  .lf-blog-topic { scroll-snap-align: start; }
  .lf-blog-topic.is-x-active { background: var(--navy); color: #fff; transform: translateY(-2px); }
  .lf-blog-mobile-hint { display: flex; margin: -2px 0 12px; }
  .lf-blog-grid--archive { display: flex !important; grid-template-columns: none !important; gap: 14px; overflow-x: auto; overflow-y: hidden; margin: 0 -18px; padding: 6px 18px 24px; scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .lf-blog-grid--archive::-webkit-scrollbar { display: none; }
  .lf-blog-grid--archive .lf-blog-card { flex: 0 0 84vw; scroll-snap-align: center; transform: scale(.955); opacity: .7; transition: opacity .38s var(--ease-out-quart), transform .38s var(--ease-out-quart), box-shadow .3s var(--ease-out-quart), border-color .3s var(--ease-out-quart); }
  .lf-blog-grid--archive .lf-blog-card.is-x-active { opacity: 1; transform: scale(1); }
  .lf-blog-foot { flex-direction: column; align-items: flex-start; }
}
`;
