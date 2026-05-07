import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, FOOTER, SHELL_STYLE } from './_shell';

const NAV = buildNav('home');

const HTML = `
${NAV}

<section class="page-hero" style="min-height: 0; padding-bottom: 60px;">
  <div class="wrap">
    <div style="max-width: 800px;">
      <div class="breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="current">Algemene voorwaarden</span></div>
      <h1>Algemene Voorwaarden</h1>
      <p class="page-hero-lede">De algemene verkoops- en uitvoeringsvoorwaarden van AB Bouw Group.</p>
      <p style="font-size:13px; color: var(--ink-mute); margin-top: 8px;">Van toepassing vanaf januari 2026 · BTW BE 0XXX.XXX.XXX</p>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 0;">
  <div class="wrap">
    <div style="max-width: 760px; display: flex; flex-direction: column; gap: 40px;">

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 1, Toepassingsgebied</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Deze algemene voorwaarden zijn van toepassing op alle offertes, overeenkomsten en uitvoering van werken door AB Bouw Group (BTW BE 0XXX.XXX.XXX), gevestigd te Dokter Persoonslaan 33, 2830 Willebroek. Door het aanvaarden van een offerte aanvaardt de opdrachtgever deze voorwaarden in hun geheel.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 2, Offertes en bestellingen</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Alle offertes zijn vrijblijvend en geldig gedurende 30 kalenderdagen na datum van uitgifte, tenzij anders vermeld. Een overeenkomst komt tot stand na schriftelijke aanvaarding van de offerte door de opdrachtgever én bevestiging door AB Bouw Group.</p>
        <p style="color: var(--ink-soft); line-height: 1.7; margin-top: 10px;">De in de offerte vermelde prijs is een vaste prijs. Meerwerken die door de opdrachtgever worden aangevraagd, worden steeds schriftelijk bevestigd vóór uitvoering en gefactureerd aan de geldende dagprijs.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 3, Uitvoering van werken</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">AB Bouw Group verbindt er zich toe de werken uit te voeren volgens de regels van goed vakmanschap en de geldende normen (STS, bestek, …). De opgegeven uitvoeringstermijnen zijn indicatief. Vertragingen te wijten aan overmacht, weersinvloeden, leveringsproblemen of wijzigingen door de opdrachtgever geven geen recht op schadevergoeding.</p>
        <p style="color: var(--ink-soft); line-height: 1.7; margin-top: 10px;">De opdrachtgever zorgt voor vrije toegang tot de werf, aanwezigheid van water en elektriciteit, en verwijdert persoonlijke bezittingen uit de werkzone vóór aanvang van de werken.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 4, Betaling</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Facturen zijn betaalbaar binnen 14 kalenderdagen na factuurdatum, tenzij anders overeengekomen. Bij niet-tijdige betaling is van rechtswege en zonder voorafgaande ingebrekestelling een verwijlintrest van 10% per jaar verschuldigd, met een minimum van €50 administratiekosten. Bij aanhoudende niet-betaling behoudt AB Bouw Group het recht de werken op te schorten.</p>
        <p style="color: var(--ink-soft); line-height: 1.7; margin-top: 10px;">Standaard betalingsschema: 30% bij ondertekening · 40% bij ruwbouw/aanvang afwerking · 30% bij oplevering.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 5, Oplevering en aanvaarding</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">De oplevering geschiedt gezamenlijk en wordt schriftelijk vastgelegd in een opleveringsdocument. Zichtbare gebreken dienen op dit document vermeld te worden; bij afwezigheid hiervan worden de werken geacht aanvaard te zijn. Verborgen gebreken dienen gemeld te worden binnen 8 dagen na ontdekking.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 6, Garantie</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">AB Bouw Group verleent een commerciële garantie van 15 jaar op alle door haar uitgevoerde werken, ruimschoots boven de wettelijke tienjarige aansprakelijkheid (art. 1792 B.W.). Na 1 jaar na oplevering volgt een vrijblijvende inspectieronde. De garantie vervalt bij onoordeelkundig gebruik, wijzigingen door derden, of niet-betaling van openstaande facturen.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 7, Aansprakelijkheid</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">De aansprakelijkheid van AB Bouw Group is beperkt tot het bedrag van de uitgevoerde werken, met een maximum van de verzekerde bedragen. AB Bouw Group is niet aansprakelijk voor onrechtstreekse schade, gevolgschade of schade door overmacht.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 8, Annulatie</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Bij annulatie door de opdrachtgever na ondertekening van de overeenkomst is een forfaitaire schadevergoeding verschuldigd van 20% van het totale aanneemsom, onverminderd het recht van AB Bouw Group om hogere bewezen schade te vorderen.</p>
      </div>

      <div>
        <h2 style="font-size: 20px; margin-bottom: 12px;">Artikel 9, Toepasselijk recht en bevoegde rechtbank</h2>
        <p style="color: var(--ink-soft); line-height: 1.7;">Alle overeenkomsten met AB Bouw Group worden beheerst door het Belgisch recht. Bij geschillen zijn uitsluitend de rechtbanken van het arrondissement Mechelen bevoegd.</p>
      </div>

      <div style="background: var(--bg-soft); border-radius: var(--r-md); padding: 28px;">
        <p style="color: var(--ink-soft); font-size: 13.5px; line-height: 1.7;"><strong>Vragen over deze voorwaarden?</strong> Neem contact op via <a href="mailto:info@abconstruct.be" style="color: var(--accent);">info@abconstruct.be</a> of <a href="tel:+32470634413" style="color: var(--accent);">+32 470 63 44 13</a>.</p>
      </div>

    </div>
  </div>
</section>

${FOOTER}
`;

const EXTRA_STYLE = SHELL_STYLE + ``;

export default function Voorwaarden() {
  useEffect(() => {
    document.title = "Algemene Voorwaarden | AB Bouw Group";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "");

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
