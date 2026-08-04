import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';
import { CONTACT } from '@/data/contact';


const HTML = `<div class="rp">
${rpNav('')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Privacybeleid</span></nav>
    <span class="rp-eyebrow">${ic.mark} Juridisch</span>
    <h1 class="rp-phero__t">Privacybeleid</h1>
    <p class="rp-phero__lede">Hoe AB Bouw Groep uw persoonsgegevens verzamelt, gebruikt en beschermt.</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap rp-artikel__body" style="max-width:820px;margin-inline:auto">
    <div style="max-width: 760px; display: flex; flex-direction: column; gap: 40px;">

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">1. Wie zijn wij?</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">AB Bouw Groep (hierna "wij", "ons" of "AB Bouw") is een bouw- en renovatiebedrijf gevestigd te ${CONTACT.address.full}, België. Wij zijn verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in dit privacybeleid.</p>
        <p style="color: var(--ink-soft); line-height: 1.7; margin-top: 10px;">Contactgegevens: <a href="mailto:info@abgroep.be" style="color: var(--accent);">info@abgroep.be</a> · <a href="${CONTACT.phone.href}" style="color: var(--accent);">${CONTACT.phone.spaced}</a></p>
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

${rpFooter()}
</div>`;


export default function Privacy() {
  useEffect(() => {
    document.title = "Privacybeleid | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Privacybeleid van AB Bouw Groep. Hoe wij uw persoonsgegevens verwerken conform GDPR. Renovatie- en bouwbedrijf in Vlaanderen.");

    const op = wireMobielMenu();
    return () => op();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
