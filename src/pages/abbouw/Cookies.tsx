import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';


const HTML = `<div class="rp">
${rpNav('')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Cookiebeleid</span></nav>
    <span class="rp-eyebrow">${ic.mark} Juridisch</span>
    <h1 class="rp-phero__t">Cookiebeleid</h1>
    <p class="rp-phero__lede">Welke cookies deze website plaatst en waarvoor ze dienen.</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap rp-artikel__body" style="max-width:820px;margin-inline:auto">
    <div style="max-width: 760px; display: flex; flex-direction: column; gap: 40px;">

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Wat zijn cookies?</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Cookies zijn kleine tekstbestandjes die een website op uw computer, tablet of smartphone plaatst wanneer u de site bezoekt. Ze worden opgeslagen in uw browser en kunnen bij een volgend bezoek worden uitgelezen. Cookies helpen websites efficiënter en gebruiksvriendelijker te werken.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Welke cookies gebruiken wij?</h2>

        <div style="border: 1px solid var(--ink-line); border-radius: var(--r-md); overflow: hidden; margin-top: 16px;">
          <div style="background: var(--bg-soft); padding: 16px 20px; border-bottom: 1px solid var(--ink-line);">
            <strong style="font-size: 14px;">Functionele cookies (altijd actief)</strong>
          </div>
          <div style="padding: 16px 20px;">
            <p style="color: var(--ink-soft); font-size: 14px; line-height: 1.6;">Deze cookies zijn strikt noodzakelijk voor het correct functioneren van de website. Ze worden automatisch geplaatst en kunnen niet uitgeschakeld worden.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px;">
              <thead>
                <tr style="background: var(--bg-soft);">
                  <th style="padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--ink-line);">Cookie</th>
                  <th style="padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--ink-line);">Doel</th>
                  <th style="padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--ink-line);">Duur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid var(--ink-line); color: var(--ink-soft);">session_id</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid var(--ink-line); color: var(--ink-soft);">Sessiemanagement contactformulier</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid var(--ink-line); color: var(--ink-soft);">Sessie</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; color: var(--ink-soft);">pref_lang</td>
                  <td style="padding: 8px 12px; color: var(--ink-soft);">Taalvoorkeur onthouden</td>
                  <td style="padding: 8px 12px; color: var(--ink-soft);">1 jaar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="border: 1px solid var(--ink-line); border-radius: var(--r-md); overflow: hidden; margin-top: 12px;">
          <div style="background: var(--bg-soft); padding: 16px 20px; border-bottom: 1px solid var(--ink-line);">
            <strong style="font-size: 14px;">Analytische cookies (optioneel)</strong>
          </div>
          <div style="padding: 16px 20px;">
            <p style="color: var(--ink-soft); font-size: 14px; line-height: 1.6;">Momenteel gebruiken wij geen analytische cookies (zoals Google Analytics). Als dit in de toekomst wijzigt, zullen wij u hierom vooraf om toestemming vragen.</p>
          </div>
        </div>

        <div style="border: 1px solid var(--ink-line); border-radius: var(--r-md); overflow: hidden; margin-top: 12px;">
          <div style="background: var(--bg-soft); padding: 16px 20px; border-bottom: 1px solid var(--ink-line);">
            <strong style="font-size: 14px;">Marketing- en trackingcookies</strong>
          </div>
          <div style="padding: 16px 20px;">
            <p style="color: var(--ink-soft); font-size: 14px; line-height: 1.6;">Wij plaatsen geen marketing- of trackingcookies. Uw surfgedrag wordt niet gedeeld met advertentienetwerken of sociale media platforms.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Cookies beheren en verwijderen</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">U kunt cookies beheren via de instellingen van uw browser. Hieronder vindt u links naar de instructies voor de meestgebruikte browsers:</p>
        <ul style="color: var(--ink-soft); line-height: 1.8; padding-left: 20px; margin-top: 10px;">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" style="color: var(--accent);">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/nl/kb/cookies-in-en-uitschakelen-websites-voorkeuren" target="_blank" style="color: var(--accent);">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/nl-be/guide/safari/sfri11471/mac" target="_blank" style="color: var(--accent);">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/nl-nl/microsoft-edge/cookies-verwijderen-in-microsoft-edge" target="_blank" style="color: var(--accent);">Microsoft Edge</a></li>
        </ul>
        <p style="color: var(--ink-soft); line-height: 1.7; margin-top: 10px;">Let op: het uitschakelen van functionele cookies kan de werking van de website beïnvloeden.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Meer informatie</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Voor meer informatie over ons privacybeleid verwijzen wij u naar ons <a href="/privacy" style="color: var(--accent);">privacybeleid</a>. Vragen? Stuur een e-mail naar <a href="mailto:info@abgroep.be" style="color: var(--accent);">info@abgroep.be</a>.</p>
      </div>

    </div>
  </div>
</section>

${rpFooter()}
</div>`;


export default function Cookies() {
  useEffect(() => {
    document.title = "Cookiebeleid | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Cookiebeleid AB Bouw Groep — transparantie over welke cookies abgroep.be gebruikt en hoe u uw toestemming kan aanpassen.");

    const op = wireMobielMenu();
    return () => op();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
