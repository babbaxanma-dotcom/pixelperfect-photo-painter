import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';
import { VOORWAARDEN, voorwaardenArtikelen, VRAAG_TEKST } from './bf/inhoud-juridisch';

/* De tekst staat sinds 11 okt 2026 woordelijk in bf/inhoud-juridisch.ts: één bron voor deze pagina en de BF-versie (JuridischBf.tsx). */
const ARTIKELEN = voorwaardenArtikelen(CONTACT.btw.display);

const HTML = () => `<div class="rp">
${rpNav('')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>${VOORWAARDEN.kop}</span></nav>
    <span class="rp-eyebrow">${ic.mark} Juridisch</span>
    <h1 class="rp-phero__t">${VOORWAARDEN.kop}</h1>
    <p class="rp-phero__lede">${VOORWAARDEN.lede}</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-artikel" style="max-width:820px">
      <div class="rp-artikel__body">
        ${ARTIKELEN.map((a) => `
        <h2 style="font-size:21px;margin-top:36px">${a.n} &middot; ${a.t}</h2>
        ${a.p.map((t) => `<p>${t}</p>`).join('')}`).join('')}

        <div class="rp-formkaart" style="margin-top:44px">
          <h2 style="font-size:19px;margin:0 0 8px">${VOORWAARDEN.vraag}</h2>
          <p style="margin:0">${VRAAG_TEKST}</p>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Voorwaarden() {
  useEffect(() => {
    document.title = VOORWAARDEN.titel;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', VOORWAARDEN.omschrijving);
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
