import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { BLOGS } from '@/data/blogs';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

const TAGS = ['Alles', ...Array.from(new Set(BLOGS.map((b) => b.tag)))];

const kaart = (p: (typeof BLOGS)[number]) => `
<a class="rp-blog" href="/blog/${p.slug}" data-tag="${p.tag}">
  <div class="rp-blog__img">
    <img src="${p.img}" alt="${p.title}" width="420" height="240" loading="lazy" decoding="async"/>
  </div>
  <div class="rp-blog__card">
    <span class="rp-blog__tag">${p.tag}</span>
    <div class="rp-blog__meta">
      <span>${ic.cal} ${p.date}</span>
      <span>${ic.user} AB Bouw Groep</span>
    </div>
    <h2 class="rp-blog__t">${p.title}</h2>
    <p class="rp-blog__ex">${p.excerpt}</p>
    <div class="rp-blog__foot"><span class="rp-more">Lees het artikel ${ic.arrowUpRight()}</span></div>
  </div>
</a>`;

const HTML = () => `<div class="rp">
${rpNav('/blog')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Blog</span></nav>
    <span class="rp-eyebrow">${ic.mark} Blog en nieuws</span>
    <h1 class="rp-phero__t">Uit de praktijk<span class="rp-dim">uitleg en achtergrond</span></h1>
    <p class="rp-phero__lede">Wat we tijdens plaatsbezoeken het vaakst uitleggen, hier op papier: regelgeving, materiaalkeuzes en wat een ingreep in de praktijk oplevert.</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-tabs" role="tablist" aria-label="Filter artikels op onderwerp">
      ${TAGS.map((t, n) => `<button class="rp-tab${n === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${n === 0}" data-filter="${t}">${t}</button>`).join('')}
    </div>
    <div class="rp-bloggrid" data-blog-grid>
      ${BLOGS.map(kaart).join('')}
    </div>
    <p class="rp-leeg" data-leeg hidden>Geen artikels in dit onderwerp.</p>
  </div>
</section>

<section class="rp-cta">
  <div class="rp-wrap">
    <div class="rp-cta__box" style="min-height:270px">
      <div class="rp-cta__inner">
        <h2 class="rp-cta__t">Een vraag over uw eigen woning?</h2>
        <p class="rp-cta__p">Een artikel geeft de algemene lijn. Wat bij u van toepassing is, zien we het snelst ter plaatse.</p>
        <div style="margin-top:26px;display:flex;flex-wrap:wrap;gap:12px">
          <a class="rp-btn rp-btn--primary" href="/contact">Plan een plaatsbezoek</a>
          <a class="rp-btn rp-btn--ghost" href="${CONTACT.phone.href}" style="color:#fff;border-color:rgba(255,255,255,.34)">${ic.phone(17)} ${CONTACT.phone.display}</a>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Blog() {
  useEffect(() => {
    document.title = 'Blog en nieuws — AB Bouw Groep';
    const opruimers: Array<() => void> = [wireMobielMenu()];

    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const kaarten = Array.from(document.querySelectorAll<HTMLElement>('[data-blog-grid] .rp-blog'));
    const leeg = document.querySelector<HTMLElement>('[data-leeg]');

    const maakHandler = (b: HTMLButtonElement) => () => {
      const f = b.dataset.filter || 'Alles';
      tabs.forEach((t) => {
        const actief = t === b;
        t.classList.toggle('is-active', actief);
        t.setAttribute('aria-selected', String(actief));
      });
      let zichtbaar = 0;
      kaarten.forEach((k) => {
        const toon = f === 'Alles' || k.dataset.tag === f;
        k.style.display = toon ? '' : 'none';
        if (toon) zichtbaar++;
      });
      if (leeg) leeg.hidden = zichtbaar > 0;
    };
    tabs.forEach((b) => {
      const h = maakHandler(b);
      b.addEventListener('click', h);
      opruimers.push(() => b.removeEventListener('click', h));
    });

    return () => opruimers.forEach((f) => f());
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
