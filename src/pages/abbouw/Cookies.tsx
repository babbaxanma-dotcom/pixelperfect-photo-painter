import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';
import { COOKIES, COOKIE_GROEPEN, COOKIE_BROWSERS, VRAAG_TEKST, type CookieRij } from './bf/inhoud-juridisch';

/* De tekst staat sinds 11 okt 2026 woordelijk in bf/inhoud-juridisch.ts: één bron voor deze pagina en de BF-versie (JuridischBf.tsx). */
type Rij = CookieRij;
const GROEPEN = COOKIE_GROEPEN;
const BROWSERS = COOKIE_BROWSERS;

const tabel = (rijen: Rij[]) => `
<div style="overflow-x:auto;margin-top:14px">
  <table style="width:100%;border-collapse:collapse;font-size:14px;min-width:440px">
    <thead>
      <tr>
        <th style="text-align:left;padding:9px 12px;border-bottom:1.5px solid var(--rp-line);font-weight:800">${COOKIES.tabelKop[0]}</th>
        <th style="text-align:left;padding:9px 12px;border-bottom:1.5px solid var(--rp-line);font-weight:800">${COOKIES.tabelKop[1]}</th>
        <th style="text-align:left;padding:9px 12px;border-bottom:1.5px solid var(--rp-line);font-weight:800">${COOKIES.tabelKop[2]}</th>
      </tr>
    </thead>
    <tbody>
      ${rijen.map((r) => `
      <tr>
        <td style="padding:9px 12px;border-bottom:1px solid var(--rp-line-soft)"><code>${r.naam}</code></td>
        <td style="padding:9px 12px;border-bottom:1px solid var(--rp-line-soft)">${r.doel}</td>
        <td style="padding:9px 12px;border-bottom:1px solid var(--rp-line-soft)">${r.duur}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</div>`;

const HTML = () => `<div class="rp">
${rpNav('')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>${COOKIES.kop}</span></nav>
    <span class="rp-eyebrow">${ic.mark} Juridisch</span>
    <h1 class="rp-phero__t">${COOKIES.kop}</h1>
    <p class="rp-phero__lede">${COOKIES.lede}</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-artikel" style="max-width:820px">
      <div class="rp-artikel__body">

        <h2 style="font-size:21px;margin-top:0">${COOKIES.wat.t}</h2>
        <p>${COOKIES.wat.p}</p>

        <h2 style="font-size:21px;margin-top:36px">${COOKIES.welke.t}</h2>
        <p>${COOKIES.welke.p}</p>
        ${GROEPEN.map((g) => `
        <div class="rp-formkaart" style="margin-top:18px;padding:22px">
          <h3 style="font-size:17px;margin:0">${g.t} <span style="font-weight:600;color:var(--rp-mute);font-size:14px">&middot; ${g.status}</span></h3>
          <p style="margin-top:8px">${g.uitleg}</p>
          ${g.rijen ? tabel(g.rijen) : ''}
        </div>`).join('')}

        <h2 style="font-size:21px;margin-top:36px">${COOKIES.keuze.t}</h2>
        <p>${COOKIES.keuze.p}</p>

        <h2 style="font-size:21px;margin-top:36px">${COOKIES.browser.t}</h2>
        <p>${COOKIES.browser.p}</p>
        <ul>
          ${BROWSERS.map(([n, u]) => `<li><a href="${u}" rel="noopener noreferrer" target="_blank">${n}</a></li>`).join('')}
        </ul>
        <p>${COOKIES.browser.na}</p>

        <h2 style="font-size:21px;margin-top:36px">${COOKIES.meer.t}</h2>
        <p>${COOKIES.meer.p}</p>

        <div class="rp-formkaart" style="margin-top:44px">
          <h2 style="font-size:19px;margin:0 0 8px">${COOKIES.vraag}</h2>
          <p style="margin:0">${VRAAG_TEKST}</p>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Cookies() {
  useEffect(() => {
    document.title = COOKIES.titel;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', COOKIES.omschrijving);
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
