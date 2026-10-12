import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';
import { PRIVACY, PRIVACY_BLOKKEN, VRAAG_TEKST } from './bf/inhoud-juridisch';

/* De tekst staat sinds 11 okt 2026 woordelijk in bf/inhoud-juridisch.ts: één bron voor deze pagina en de BF-versie (JuridischBf.tsx). */
const BLOKKEN = PRIVACY_BLOKKEN;

const HTML = () => `<div class="rp">
${rpNav('')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>${PRIVACY.kop}</span></nav>
    <span class="rp-eyebrow">${ic.mark} Juridisch</span>
    <h1 class="rp-phero__t">${PRIVACY.kop}</h1>
    <p class="rp-phero__lede">${PRIVACY.lede}</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-artikel" style="max-width:820px">
      <div class="rp-artikel__body">
        ${BLOKKEN.map((b) => `
        <h2 style="font-size:21px;margin-top:36px">${b.n}. ${b.t}</h2>
        ${(b.p || []).map((t) => `<p>${t}</p>`).join('')}
        ${b.lijst ? `<ul>${b.lijst.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
        ${(b.na || []).map((t) => `<p>${t}</p>`).join('')}`).join('')}

        <div class="rp-formkaart" style="margin-top:44px">
          <h2 style="font-size:19px;margin:0 0 8px">${PRIVACY.vraag}</h2>
          <p style="margin:0">${VRAAG_TEKST}</p>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Privacy() {
  useEffect(() => {
    document.title = PRIVACY.titel;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', PRIVACY.omschrijving);
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
