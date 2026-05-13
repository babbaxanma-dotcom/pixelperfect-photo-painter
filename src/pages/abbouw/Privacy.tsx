import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from './_shell';

const NAV = buildNav('home');

const HTML = `
${NAV}

<section class="page-hero" style="min-height: 0; padding-bottom: 60px;">
  <div class="wrap">
    <div style="max-width: 800px;">
      <div class="breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="current">Privacybeleid</span></div>
      <h1>Privacybeleid</h1>
      <p class="page-hero-lede">Hoe AB Bouw Groep uw persoonsgegevens verzamelt, gebruikt en beschermt.</p>
      <p style="font-size:13px; color: var(--ink-mute); margin-top: 8px;">Laatste update: januari 2026</p>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 0;">
  <div class="wrap">
    <div style="max-width: 760px; display: flex; flex-direction: column; gap: 40px;">

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">1. Wie zijn wij?</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">AB Bouw Groep (hierna "wij", "ons" of "AB Bouw") is een bouw- en renovatiebedrijf gevestigd te Industrieweg 14, 2830 Willebroek, België. Wij zijn verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in dit privacybeleid.</p>
        <p style="color: var(--ink-soft); line-height: 1.7; margin-top: 10px;">Contactgegevens: <a href="mailto:info@abgroep.be" style="color: var(--accent);">info@abgroep.be</a> · <a href="tel:+32470634413" style="color: var(--accent);">+32 470 63 44 13</a></p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">2. Welke gegevens verzamelen wij?</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Wij verzamelen de volgende persoonsgegevens wanneer u contact met ons opneemt of een offerte aanvraagt:</p>
        <ul style="color: var(--ink-soft); line-height: 1.8; padding-left: 20px; margin-top: 10px;">
          <li>Naam en voornaam</li>
          <li>E-mailadres en telefoonnummer</li>
          <li>Adres van het te renoveren pand</li>
          <li>Beschrijving van uw project en wensen</li>
          <li>Correspondentie en berichten via ons contactformulier</li>
        </ul>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">3. Waarvoor gebruiken wij uw gegevens?</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Uw persoonsgegevens worden uitsluitend gebruikt voor:</p>
        <ul style="color: var(--ink-soft); line-height: 1.8; padding-left: 20px; margin-top: 10px;">
          <li>Het opmaken en opvolgen van offertes en contracten</li>
          <li>Het plannen en uitvoeren van bouwwerken</li>
          <li>Facturatie en administratie</li>
          <li>Communicatie over uw lopend project</li>
          <li>Wettelijke verplichtingen (btw, verzekering, garanties)</li>
        </ul>
        <p style="color: var(--ink-soft); line-height: 1.7; margin-top: 10px;">Wij verkopen uw gegevens nooit aan derden en gebruiken ze niet voor direct marketing zonder uw uitdrukkelijke toestemming.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">4. Hoe lang bewaren wij uw gegevens?</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Projectdossiers worden bewaard gedurende de looptijd van onze 15-jarige garantie. Boekhoudkundige gegevens worden 7 jaar bewaard conform de Belgische wetgeving. Gegevens van niet-gerealiseerde offerteaanvragen worden maximaal 2 jaar bewaard.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">5. Uw rechten</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Conform de AVG (Algemene Verordening Gegevensbescherming) heeft u het recht om:</p>
        <ul style="color: var(--ink-soft); line-height: 1.8; padding-left: 20px; margin-top: 10px;">
          <li>Inzage te vragen in uw persoonsgegevens</li>
          <li>Onjuiste gegevens te laten corrigeren</li>
          <li>Uw gegevens te laten verwijderen ("recht op vergetelheid")</li>
          <li>Bezwaar te maken tegen verwerking</li>
          <li>Uw gegevens over te laten dragen</li>
        </ul>
        <p style="color: var(--ink-soft); line-height: 1.7; margin-top: 10px;">Stuur uw verzoek per e-mail naar <a href="mailto:info@abgroep.be" style="color: var(--accent);">info@abgroep.be</a>. Wij reageren binnen 30 dagen.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">6. Cookies</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Onze website maakt gebruik van functionele cookies die noodzakelijk zijn voor het goed functioneren van de site. Wij gebruiken geen tracking- of advertentiecookies. Raadpleeg ons <a href="/cookies" style="color: var(--accent);">cookiebeleid</a> voor meer informatie.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">7. Klachten</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Bent u niet tevreden over hoe wij uw gegevens verwerken? U heeft het recht een klacht in te dienen bij de Gegevensbeschermingsautoriteit (GBA): <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" style="color: var(--accent);">www.gegevensbeschermingsautoriteit.be</a></p>
      </div>

    </div>
  </div>
</section>

${FOOTER}
`;

const EXTRA_STYLE = SHELL_STYLE + ``;

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacybeleid | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Privacybeleid van AB Bouw Groep. Hoe wij uw persoonsgegevens verwerken conform GDPR. Renovatie- en bouwbedrijf in Vlaanderen.");

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
