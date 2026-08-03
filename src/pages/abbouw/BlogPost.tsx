import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '@/styles/roofpro.css';
import { BLOGS } from '@/data/blogs';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOGS.find((b) => b.slug === slug);
  const andere = BLOGS.filter((b) => b.slug !== slug).slice(0, 3);

  useEffect(() => {
    document.title = post ? `${post.title} — AB Bouw Groep` : 'Artikel — AB Bouw Groep';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', post ? post.excerpt.substring(0, 158) : 'Bouwblog AB Bouw Groep — vakkennis uit de Vlaamse bouwpraktijk.');
    window.scrollTo(0, 0);

    const opruimers: Array<() => void> = [wireMobielMenu()];

    // Kwam de bezoeker via een advertentie-landingspagina, dan moeten de CTA's
    // terug naar HET formulier van die LP wijzen (anders lekt betaald verkeer weg).
    // ?lp=... wint (overleeft target="_blank"); sessionStorage is de fallback.
    let laatsteLp: string | null = null;
    try { laatsteLp = new URLSearchParams(window.location.search).get('lp'); } catch { /* leeg */ }
    if (!laatsteLp) { try { laatsteLp = sessionStorage.getItem('ab_last_lp'); } catch { /* leeg */ } }
    if (laatsteLp && (laatsteLp.startsWith('/lp/') || laatsteLp.startsWith('/lokaal/'))) {
      const doel = `${laatsteLp}#lp-form`;
      try { sessionStorage.setItem('ab_last_lp', laatsteLp); } catch { /* leeg */ }
      document.querySelectorAll<HTMLAnchorElement>('a[href="/contact"]').forEach((a) => { a.href = doel; });
    }

    return () => opruimers.forEach((f) => f());
  }, [slug, post]);

  if (!post) {
    const html = `<div class="rp">
      ${rpNav('/blog')}
      <section class="rp-section" style="text-align:center">
        <div class="rp-wrap">
          <span class="rp-eyebrow" style="justify-content:center">${ic.mark} 404</span>
          <h1 class="rp-phero__t">Artikel niet gevonden</h1>
          <p class="rp-phero__lede" style="margin-inline:auto">Dit artikel bestaat niet of werd verplaatst.</p>
          <div style="margin-top:28px"><a class="rp-btn rp-btn--primary" href="/blog">Terug naar de blog</a></div>
        </div>
      </section>
      ${rpFooter()}
    </div>`;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const html = `<div class="rp">
${rpNav('/blog')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <a href="/blog">Blog</a> &rsaquo; <span>${post.tag}</span></nav>
    <span class="rp-blog__tag">${post.tag}</span>
    <h1 class="rp-phero__t" style="margin-top:12px;font-size:clamp(28px,3.5vw,46px)">${post.title}</h1>
    <div class="rp-blog__meta" style="margin-top:20px">
      <span>${ic.cal} ${post.date}</span>
      <span>${ic.user} AB Bouw Groep</span>
      <span>${post.readTime} leestijd</span>
    </div>
  </div>
</section>

<article class="rp-section">
  <div class="rp-wrap">
    <div class="rp-artikel">
      <div class="rp-artikel__cover">
        <img src="${post.img}" alt="${post.title}" width="780" height="420" fetchpriority="high" decoding="async"/>
      </div>
      <div class="rp-artikel__body">${post.body}</div>
    </div>
  </div>
</article>

<section class="rp-cta">
  <div class="rp-wrap">
    <div class="rp-cta__box" style="min-height:270px">
      <div class="rp-cta__inner">
        <h2 class="rp-cta__t">Geldt dit ook voor uw woning?</h2>
        <p class="rp-cta__p">Bij een plaatsbezoek zeggen we wat er in uw situatie van toepassing is, en wat het kost. Het bezoek is vrijblijvend.</p>
        <div style="margin-top:26px;display:flex;flex-wrap:wrap;gap:12px">
          <a class="rp-btn rp-btn--primary" href="/contact">Plan een plaatsbezoek</a>
          <a class="rp-btn rp-btn--ghost" href="${CONTACT.phone.href}" style="color:#fff;border-color:rgba(255,255,255,.34)">${ic.phone(17)} ${CONTACT.phone.display}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="rp-section rp-section--soft">
  <div class="rp-wrap">
    <div class="rp-head">
      <div>
        <span class="rp-eyebrow">${ic.mark} Verder lezen</span>
        <h2 class="rp-head__title">Andere artikels<span class="rp-dim">uit de praktijk</span></h2>
      </div>
      <a class="rp-btn rp-btn--primary" href="/blog">Alle artikels</a>
    </div>
    <div class="rp-bloggrid">
      ${andere.map((p) => `
      <a class="rp-blog" href="/blog/${p.slug}">
        <div class="rp-blog__img"><img src="${p.img}" alt="${p.title}" width="420" height="240" loading="lazy" decoding="async"/></div>
        <div class="rp-blog__card">
          <span class="rp-blog__tag">${p.tag}</span>
          <div class="rp-blog__meta"><span>${ic.cal} ${p.date}</span></div>
          <h3 class="rp-blog__t">${p.title}</h3>
          <div class="rp-blog__foot"><span class="rp-more">Lees het artikel ${ic.arrowUpRight()}</span></div>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
