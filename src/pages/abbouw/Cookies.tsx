import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

type Rij = { naam: string; doel: string; duur: string };
type Groep = { t: string; status: string; uitleg: string; rijen?: Rij[] };

const GROEPEN: Groep[] = [
  {
    t: 'Functionele cookies',
    status: 'altijd actief',
    uitleg: 'Deze zijn nodig om de site te laten werken. Ze worden geplaatst zodra u de site bezoekt en u kunt ze niet uitschakelen.',
    rijen: [
      { naam: 'ab_bouw_consent', doel: 'Onthoudt uw keuze in de cookiemelding', duur: '6 maanden' },
      { naam: 'session_id', doel: 'Houdt uw sessie vast tijdens het invullen van een formulier', duur: 'Sessie' },
    ],
  },
  {
    t: 'Analytische cookies',
    status: 'alleen met uw toestemming',
    uitleg: 'Hiermee meten wij hoeveel mensen de site bezoeken en welke pagina\'s zij bekijken. Zo zien wij wat werkt en wat niet. Wij zetten deze pas aan nadat u in de cookiemelding akkoord gaat.',
    rijen: [
      { naam: '_ga, _ga_*', doel: 'Google Analytics 4: bezoekstatistieken, met geanonimiseerd IP-adres', duur: 'Tot 2 jaar' },
    ],
  },
  {
    t: 'Advertentiecookies',
    status: 'alleen met uw toestemming',
    uitleg: 'Wij adverteren via Google. Deze cookies laten ons zien welke advertentie tot een aanvraag leidde, zodat wij ons budget niet verspillen. Ook deze zetten wij pas aan na uw akkoord.',
    rijen: [
      { naam: '_gcl_*', doel: 'Google Ads: meet welke advertentieklik tot een aanvraag leidt', duur: 'Tot 90 dagen' },
    ],
  },
];

const BROWSERS = [
  ['Google Chrome', 'https://support.google.com/chrome/answer/95647'],
  ['Mozilla Firefox', 'https://support.mozilla.org/nl/kb/cookies-verwijderen-gegevens-wissen-websites-opgeslagen'],
  ['Apple Safari', 'https://support.apple.com/nl-be/guide/safari/sfri11471/mac'],
  ['Microsoft Edge', 'https://support.microsoft.com/nl-nl/microsoft-edge/cookies-verwijderen-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'],
];

const tabel = (rijen: Rij[]) => `
<div style="overflow-x:auto;margin-top:14px">
  <table style="width:100%;border-collapse:collapse;font-size:14px;min-width:440px">
    <thead>
      <tr>
        <th style="text-align:left;padding:9px 12px;border-bottom:1.5px solid var(--rp-line);font-weight:800">Cookie</th>
        <th style="text-align:left;padding:9px 12px;border-bottom:1.5px solid var(--rp-line);font-weight:800">Waarvoor</th>
        <th style="text-align:left;padding:9px 12px;border-bottom:1.5px solid var(--rp-line);font-weight:800">Bewaartijd</th>
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
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Cookiebeleid</span></nav>
    <span class="rp-eyebrow">${ic.mark} Juridisch</span>
    <h1 class="rp-phero__t">Cookiebeleid</h1>
    <p class="rp-phero__lede">Welke cookies deze website plaatst, waarvoor ze dienen en hoe u ze weigert. Laatste aanpassing: augustus 2026.</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-artikel" style="max-width:820px">
      <div class="rp-artikel__body">

        <h2 style="font-size:21px;margin-top:0">Wat cookies zijn</h2>
        <p>Een cookie is een klein tekstbestand dat een website in uw browser opslaat. Bij een volgend bezoek kan de site dat bestand weer uitlezen. Zo onthoudt een site bijvoorbeeld welke keuze u in de cookiemelding maakte.</p>

        <h2 style="font-size:21px;margin-top:36px">Welke cookies wij plaatsen</h2>
        <p>Wij werken met drie soorten. Alleen de eerste staat standaard aan; de andere twee vragen eerst uw toestemming via de melding onderaan de site.</p>
        ${GROEPEN.map((g) => `
        <div class="rp-formkaart" style="margin-top:18px;padding:22px">
          <h3 style="font-size:17px;margin:0">${g.t} <span style="font-weight:600;color:var(--rp-mute);font-size:14px">&middot; ${g.status}</span></h3>
          <p style="margin-top:8px">${g.uitleg}</p>
          ${g.rijen ? tabel(g.rijen) : ''}
        </div>`).join('')}

        <h2 style="font-size:21px;margin-top:36px">Uw keuze wijzigen</h2>
        <p>Bij uw eerste bezoek vraagt de melding onderaan of u akkoord gaat. Zolang u niets kiest, blijven de analytische en advertentiecookies uit. Wilt u uw keuze later herzien, verwijder dan de cookies van deze site in uw browser; bij het volgende bezoek verschijnt de melding opnieuw.</p>

        <h2 style="font-size:21px;margin-top:36px">Cookies beheren in uw browser</h2>
        <p>U kunt cookies ook rechtstreeks in uw browser beheren of verwijderen:</p>
        <ul>
          ${BROWSERS.map(([n, u]) => `<li><a href="${u}" rel="noopener noreferrer" target="_blank">${n}</a></li>`).join('')}
        </ul>
        <p>Schakelt u de functionele cookies uit, dan werkt een deel van de site niet meer zoals bedoeld.</p>

        <h2 style="font-size:21px;margin-top:36px">Meer weten</h2>
        <p>Hoe wij met persoonsgegevens omgaan, leest u in ons <a href="/privacy">privacybeleid</a>.</p>

        <div class="rp-formkaart" style="margin-top:44px">
          <h2 style="font-size:19px;margin:0 0 8px">Een vraag over cookies?</h2>
          <p style="margin:0">Bel <a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a> of mail naar <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.</p>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Cookies() {
  useEffect(() => {
    document.title = 'Cookiebeleid — AB Bouw Groep';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Cookiebeleid van AB Bouw Groep: welke cookies deze website plaatst, waarvoor ze dienen en hoe u ze beheert.');
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
