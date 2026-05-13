import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from './_shell';

const NAV = buildNav('home');

const HTML = `
${NAV}

<section class="page-hero" style="min-height: 0; padding-bottom: 60px;">
  <div class="wrap">
    <div style="max-width: 800px;">
      <div class="breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="current">Cookiebeleid</span></div>
      <h1>Cookiebeleid</h1>
      <p class="page-hero-lede">Hoe en waarom AB Bouw Groep cookies gebruikt op deze website.</p>
      <p style="font-size:13px; color: var(--ink-mute); margin-top: 8px;">Laatste update: januari 2026</p>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 0;">
  <div class="wrap">
    <div style="max-width: 760px; display: flex; flex-direction: column; gap: 40px;">

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Wat zijn cookies?</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Cookies zijn kleine tekstbestandjes die een website op uw computer, tablet of smartphone plaatst wanneer u de site bezoekt. Ze worden opgeslagen in uw browser en kunnen bij een volgend bezoek worden uitgelezen. Cookies helpen websites efficiënter en gebruiksvriendelijker te werken.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Welke cookies gebruiken wij?</h2>

        <div style="border: 1px solid var(--ink-line); border-radius: var(--r-md); overflow: hidden; margin-top: 16px;">
          <div style="background: var(--bg-soft); padding: 16px 20px; border-bottom: 1px solid var(--ink-line);">
            <strong style="font-size: 14px;">🟢 Functionele cookies (altijd actief)</strong>
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
            <strong style="font-size: 14px;">⚪ Analytische cookies (optioneel)</strong>
          </div>
          <div style="padding: 16px 20px;">
            <p style="color: var(--ink-soft); font-size: 14px; line-height: 1.6;">Momenteel gebruiken wij geen analytische cookies (zoals Google Analytics). Als dit in de toekomst wijzigt, zullen wij u hierom vooraf om toestemming vragen.</p>
          </div>
        </div>

        <div style="border: 1px solid var(--ink-line); border-radius: var(--r-md); overflow: hidden; margin-top: 12px;">
          <div style="background: var(--bg-soft); padding: 16px 20px; border-bottom: 1px solid var(--ink-line);">
            <strong style="font-size: 14px;">🚫 Marketing- en trackingcookies</strong>
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
        <p style="color: var(--ink-soft); line-height: 1.7;">Voor meer informatie over ons privacybeleid verwijzen wij u naar ons <a href="/privacy" style="color: var(--accent);">privacybeleid</a>. Vragen? Stuur een e-mail naar <a href="mailto:info@abconstruct.be" style="color: var(--accent);">info@abconstruct.be</a>.</p>
      </div>

    </div>
  </div>
</section>

${FOOTER}
`;

const EXTRA_STYLE = SHELL_STYLE + ``;

export default function Cookies() {
  useEffect(() => {
    document.title = "Cookiebeleid | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Cookiebeleid AB Bouw Groep — transparantie over welke cookies abgroep.be gebruikt en hoe u uw toestemming kan aanpassen.");

    const prevClass = document.body.className;
    document.body.className = "";
    let styleEl: HTMLStyleElement | null = null;
    if (EXTRA_STYLE) {
      styleEl = document.createElement('style');
      styleEl.textContent = EXTRA_STYLE;
      document.head.appendChild(styleEl);
    }
    return () => {
      document.body.className = prevClass;
      if (styleEl) styleEl.remove();
    };
  }, []);

  useAbBouwInteractions();

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
