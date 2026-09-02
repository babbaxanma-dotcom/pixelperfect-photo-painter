import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

type Artikel = { n: string; t: string; p: string[] };

const ARTIKELEN: Artikel[] = [
  {
    n: 'Artikel 1', t: 'Waarop deze voorwaarden van toepassing zijn',
    p: [
      `Deze voorwaarden gelden voor elke offerte, overeenkomst en uitvoering van werken door AB Bouw Groep, BTW BE 0712.443.881, met zetel te ${CONTACT.address.full}.`,
      'Wie een offerte aanvaardt, aanvaardt daarmee ook deze voorwaarden in hun geheel.',
    ],
  },
  {
    n: 'Artikel 2', t: 'Offertes en bestellingen',
    p: [
      'Een offerte is vrijblijvend en blijft dertig kalenderdagen geldig vanaf de datum van uitgifte, tenzij er iets anders op vermeld staat.',
      'De overeenkomst komt tot stand zodra u de offerte schriftelijk aanvaardt én wij die aanvaarding bevestigen.',
      'De prijs op de offerte is een vaste prijs. Vraagt u tijdens de werken extra werk, dan bevestigen wij dat eerst schriftelijk met een aparte prijs. Pas na uw akkoord voeren wij het uit en factureren wij het aan de dan geldende dagprijs.',
    ],
  },
  {
    n: 'Artikel 3', t: 'Uitvoering van de werken',
    p: [
      'Wij voeren de werken uit volgens de regels van goed vakmanschap en de geldende normen, waaronder de STS-voorschriften en het bestek.',
      'De termijnen die wij opgeven zijn een inschatting. Loopt het werk vertraging op door overmacht, weersomstandigheden, leveringsproblemen of wijzigingen die u aanvraagt, dan geeft dat geen recht op schadevergoeding.',
      'U zorgt dat de werf vrij toegankelijk is, dat er water en elektriciteit beschikbaar zijn, en dat persoonlijke bezittingen voor de start uit de werkzone verwijderd zijn.',
    ],
  },
  {
    n: 'Artikel 4', t: 'Betaling',
    p: [
      'Facturen betaalt u binnen veertien kalenderdagen na factuurdatum, tenzij wij samen iets anders afspreken.',
      'Blijft een factuur openstaan na die termijn, dan sturen wij u een herinnering. Betaalt u daarna nog steeds niet, dan rekenen wij een forfaitaire kostenvergoeding aan van veertig euro voor de administratieve opvolging, en mogen wij de werken opschorten tot de openstaande factuur voldaan is. Wij rekenen geen intrest aan.',
      'Standaard betalingsschema: dertig procent bij ondertekening, veertig procent bij de start van de afwerking, en dertig procent bij oplevering.',
    ],
  },
  {
    n: 'Artikel 5', t: 'Oplevering en aanvaarding',
    p: [
      'De oplevering gebeurt samen met u en wordt vastgelegd in een opleveringsdocument.',
      'Zichtbare gebreken noteert u op dat document. Staat er niets op, dan gelden de werken als aanvaard. Verborgen gebreken meldt u binnen acht dagen nadat u ze ontdekt.',
    ],
  },
  {
    n: 'Artikel 6', t: 'Garantie',
    p: [
      'Wij geven een commerciële garantie van vijftien jaar op de werken die wij zelf uitvoeren. Dat is ruimer dan de wettelijke tienjarige aansprakelijkheid uit artikel 1792 van het Burgerlijk Wetboek.',
      'Eén jaar na de oplevering komen wij vrijblijvend een inspectieronde doen.',
      'De garantie vervalt bij onoordeelkundig gebruik, bij wijzigingen door derden, of zolang er facturen openstaan.',
    ],
  },
  {
    n: 'Artikel 7', t: 'Aansprakelijkheid',
    p: [
      'Onze aansprakelijkheid blijft beperkt tot het bedrag van de uitgevoerde werken, en tot maximaal de bedragen die onze verzekering dekt.',
      'Voor onrechtstreekse schade, gevolgschade of schade door overmacht zijn wij niet aansprakelijk.',
    ],
  },
  {
    n: 'Artikel 8', t: 'Annulatie',
    p: [
      'Annuleert u nadat de overeenkomst getekend is, dan is een forfaitaire schadevergoeding verschuldigd van twintig procent van de aanneemsom.',
      'Ligt onze werkelijke schade hoger en kunnen wij dat aantonen, dan mogen wij dat hogere bedrag vorderen.',
    ],
  },
  {
    n: 'Artikel 9', t: 'Beeldmateriaal op onze website',
    p: [
      'Op onze website en in ons reclamemateriaal gebruiken wij beelden die geheel of gedeeltelijk met artificiële intelligentie gemaakt of bewerkt zijn. Het gaat onder meer om sfeerbeelden van woningen en gevels, technische doorsnedes, dakopbouwen en voor-en-na-visualisaties.',
      'Die beelden dienen om een type werk, een materiaal of een afwerking te tonen. Ze zijn geen weergave van een specifiek bestaand project of een specifieke klant. Echte projecten staan apart en zijn duidelijk aangeduid als realisatie, met locatie, uitvoeringsdatum en projectgegevens.',
      'Conform artikel 50 van Verordening (EU) 2024/1689, de AI-verordening, voorzien wij AI-gegenereerd beeldmateriaal waar dat technisch haalbaar is van een machinaal leesbare markering. Getuigenissen kunnen vereenvoudigd of geanonimiseerd zijn om de privacy van de opdrachtgever te beschermen; de inhoud van het achterliggende project blijft correct.',
      `Heeft u een vraag over een bepaalde afbeelding, of wilt u een verifieerbare foto of het dossier van een project inzien, mail dan naar <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.`,
    ],
  },
  {
    n: 'Artikel 10', t: 'Toepasselijk recht',
    p: [
      'Op onze overeenkomsten is het Belgisch recht van toepassing.',
    ],
  },
];

const HTML = () => `<div class="rp">
${rpNav('')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Algemene voorwaarden</span></nav>
    <span class="rp-eyebrow">${ic.mark} Juridisch</span>
    <h1 class="rp-phero__t">Algemene voorwaarden</h1>
    <p class="rp-phero__lede">De afspraken die gelden zodra u een offerte van ons aanvaardt. Laatste aanpassing: augustus 2026.</p>
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
          <h2 style="font-size:19px;margin:0 0 8px">Een vraag over deze voorwaarden?</h2>
          <p style="margin:0">Bel <a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a> of mail naar <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.</p>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Voorwaarden() {
  useEffect(() => {
    document.title = 'Algemene voorwaarden · AB Bouw Groep';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'De algemene voorwaarden van AB Bouw Groep: offertes, uitvoering, betaling, oplevering, garantie en aansprakelijkheid.');
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
