/**
 * Juridische tekst van abgroep.be: privacybeleid, algemene voorwaarden en cookiebeleid.
 *
 * WOORDELIJK verplaatst uit Privacy.tsx, Voorwaarden.tsx en Cookies.tsx (stand 71dabdf, 11 okt 2026),
 * geen woord gewijzigd (spec/bf-stijl.md §10: "verplaats ze naar een gedeelde module"). Die oude
 * pagina's lezen hun tekst nu hieruit: één bron voor de oude en de nieuwe pagina.
 *
 * Waarom een aparte module en geen import uit de oude pagina's: die importeren '@/styles/roofpro.css',
 * en roofpro.css r.651 heeft een eigen ongescopete regel `.bf { padding-block; overflow:hidden; background }`
 * die de BF-schil zou breken. Dit bestand importeert daarom geen css.
 *
 * De strings mogen HTML bevatten (links); ze worden niet ge-escaped, net als in de oude pagina's.
 * Contactgegevens en btw-nummer komen uit CONTACT.
 */
import { CONTACT } from '@/data/contact';

/* ---------- gedeeld: de vraagkaart onderaan elke juridische pagina ---------- */
export const VRAAG_TEKST = `Bel <a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a> of mail naar <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.`;

/* ================================ Privacybeleid (Privacy.tsx) ================================ */
export type PrivacyBlok = { n: string; t: string; p?: string[]; lijst?: string[]; na?: string[] };

export const PRIVACY = {
  // Privacy.tsx r.111-114 (kruimel, h1, lede), r.129 (vraagkaart), r.142-145 (titel, beschrijving)
  kop: 'Privacybeleid',
  lede: 'Wat wij met uw gegevens doen, waarom, en hoe lang wij ze bijhouden. Laatste aanpassing: september 2026.',
  vraag: 'Een vraag over uw gegevens?',
  titel: 'Privacybeleid · AB Bouw Groep',
  omschrijving: 'Privacybeleid van AB Bouw Groep: welke persoonsgegevens wij verwerken, waarvoor, hoe lang wij ze bewaren en welke rechten u heeft.',
};

// Privacy.tsx r.8-104
export const PRIVACY_BLOKKEN: PrivacyBlok[] = [
  {
    n: '1', t: 'Wie wij zijn',
    p: [
      `AB Bouw Groep is een bouw- en renovatiebedrijf met zetel te ${CONTACT.address.full}. Wij zijn verantwoordelijk voor de verwerking van de persoonsgegevens die in dit beleid beschreven staan.`,
      `U bereikt ons op <a href="mailto:${CONTACT.email}">${CONTACT.email}</a> of <a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a>.`,
    ],
  },
  {
    n: '2', t: 'Welke gegevens wij bijhouden',
    p: ['Neemt u contact op of vraagt u een offerte aan, dan houden wij bij:'],
    lijst: [
      'uw naam en voornaam',
      'uw e-mailadres en telefoonnummer',
      'het adres van het pand waar de werken plaatsvinden',
      'een beschrijving van uw project en de antwoorden die u in de prijscalculator aanduidt',
      'de berichten die u ons stuurt via het contactformulier, per sms of per telefoon',
      'de vragen die u stelt aan de digitale assistent op onze website',
      'hoe u bij ons terechtkwam, bijvoorbeeld via welke advertentie of zoekopdracht',
    ],
    /* 28 sep: api/chat.js logt geen inhoud en slaat niets op; het gesprek staat
       alleen in de browser van de bezoeker (sessionStorage). ChatAssistent.tsx
       zet alleen bij een verstuurde aanvraag de velden en het bericht erbij. */
    na: ['De gesprekken met de digitale assistent bewaren wij zelf niet. Verstuurt u via de chat een aanvraag, dan komt een samenvatting van het gesprek bij uw aanvraag.'],
  },
  {
    n: '3', t: 'Op welke grond wij ze verwerken',
    lijst: [
      'uw offerteaanvraag en de uitvoering van de werken: om een overeenkomst met u voor te bereiden en uit te voeren',
      'facturatie en administratie: om te voldoen aan onze wettelijke verplichtingen',
      'het opvolgen van uw aanvraag en het meten van onze advertenties: ons gerechtvaardigd belang om aanvragen goed op te volgen',
      'cookies voor statistieken en advertenties: uw toestemming, die u altijd kan intrekken',
    ],
  },
  {
    n: '4', t: 'Waarvoor wij ze gebruiken',
    p: ['Uw gegevens gebruiken wij uitsluitend om:'],
    lijst: [
      'een offerte op te maken en op te volgen',
      'de werken in te plannen en uit te voeren',
      'te factureren en de administratie te voeren',
      'met u te communiceren over uw lopende project',
      'te voldoen aan wettelijke verplichtingen rond btw, verzekering en garantie',
    ],
    na: ['Wij verkopen uw gegevens niet door en gebruiken ze niet voor reclame van derden zonder uw uitdrukkelijke toestemming.'],
  },
  {
    /* Mohammed, 25 sep: "wij als Norvo zien klantgegevens ook". Elke partij die
       persoonsgegevens verwerkt in opdracht van AB staat hier; de lijst komt uit
       de code (leads.ts, tracking.ts, vercel.json) en de telefonie (Twilio). */
    n: '5', t: 'Wie uw gegevens nog verwerkt',
    p: ['Voor onze website, onze klantenopvolging en onze advertenties werken wij met partijen die uw gegevens in onze opdracht verwerken. Zij mogen ze alleen gebruiken voor de taak die wij hen geven:'],
    lijst: [
      'Norvo, ons marketingbureau: beheert onze website, ons klantenbestand en onze advertenties, en ziet daarvoor uw aanvraag',
      'HighLevel (LeadConnector): het klantenbestand waarin uw aanvraag binnenkomt en wordt opgevolgd, ook per sms',
      'Web3Forms: stuurt een kopie van uw aanvraag naar ons per e-mail, zodat er geen aanvraag verloren gaat',
      'Twilio: onze telefonie en sms',
      'Google: meet het bezoek aan de website en de resultaten van onze advertenties, alleen als u daarvoor toestemming gaf',
      'Vercel: host onze website',
      'Anthropic: maakt de antwoorden van de digitale assistent op onze website, op basis van de vragen die u daar stelt',
    ],
    na: ['Sommige van deze partijen verwerken gegevens buiten de Europese Unie. Dat gebeurt alleen met de waarborgen die de AVG voorschrijft, zoals de standaardcontractbepalingen van de Europese Commissie.'],
  },
  {
    n: '6', t: 'Hoe lang wij ze bewaren',
    p: [
      'Een projectdossier bewaren wij zolang de garantie op de uitgevoerde werken loopt.',
      'Boekhoudkundige gegevens houden wij zeven jaar bij, zoals de Belgische wetgeving voorschrijft. Offerteaanvragen die niet tot een opdracht leiden, verwijderen wij na maximaal twee jaar.',
    ],
  },
  {
    n: '7', t: 'Uw rechten',
    p: ['De AVG geeft u het recht om:'],
    lijst: [
      'uw persoonsgegevens in te kijken',
      'onjuiste gegevens te laten verbeteren',
      'uw gegevens te laten wissen, het recht op vergetelheid',
      'bezwaar te maken tegen de verwerking',
      'uw gegevens te laten overdragen',
      'uw toestemming voor cookies op elk moment in te trekken',
    ],
    na: [`Stuur uw vraag naar <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>. Wij antwoorden binnen dertig dagen.`],
  },
  {
    n: '8', t: 'Cookies',
    p: [
      'Onze website plaatst functionele cookies die nodig zijn om de site te laten werken, en met uw toestemming ook cookies om bezoek te meten en advertenties op te volgen. In ons <a href="/cookies">cookiebeleid</a> leest u precies welke dat zijn.',
    ],
  },
  {
    n: '9', t: 'Klachten',
    p: [
      'Bent u niet tevreden over hoe wij met uw gegevens omgaan, laat het ons dan eerst weten. Meestal lossen we het snel op.',
      'U heeft daarnaast altijd het recht een klacht in te dienen bij de Gegevensbeschermingsautoriteit via <a href="https://www.gegevensbeschermingsautoriteit.be" rel="noopener noreferrer" target="_blank">gegevensbeschermingsautoriteit.be</a>.',
    ],
  },
];

/* ============================ Algemene voorwaarden (Voorwaarden.tsx) ============================ */
export type Artikel = { n: string; t: string; p: string[] };

export const VOORWAARDEN = {
  // Voorwaarden.tsx r.91-94 (kruimel, h1, lede), r.107 (vraagkaart), r.120-123 (titel, beschrijving)
  kop: 'Algemene voorwaarden',
  lede: 'De afspraken die gelden zodra u een offerte van ons aanvaardt. Laatste aanpassing: augustus 2026.',
  vraag: 'Een vraag over deze voorwaarden?',
  titel: 'Algemene voorwaarden · AB Bouw Groep',
  omschrijving: 'De algemene voorwaarden van AB Bouw Groep: offertes, uitvoering, betaling, oplevering, garantie en aansprakelijkheid.',
};

/**
 * Voorwaarden.tsx r.8-84.
 * @param btw CONTACT.btw.display. Het nummer komt als parameter binnen zodat elke pagina die de
 *   voorwaarden toont het zelf uit CONTACT.btw haalt (scripts/check-btw.cjs eist dat van Voorwaarden.tsx).
 */
export const voorwaardenArtikelen = (btw: string): Artikel[] => [
  {
    n: 'Artikel 1', t: 'Waarop deze voorwaarden van toepassing zijn',
    p: [
      `Deze voorwaarden gelden voor elke offerte, overeenkomst en uitvoering van werken door AB Bouw Groep, BTW ${btw}, met zetel te ${CONTACT.address.full}.`,
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
      // keuze Mohammed 12 okt: "10 jaar, zoals de wet" (de commerciële garantie van vijftien jaar had geen bron)
      'Voor de werken die wij zelf uitvoeren, geldt de wettelijke tienjarige aansprakelijkheid uit de artikelen 1792 en 2270 van het oud Burgerlijk Wetboek.',
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

/* =============================== Cookiebeleid (Cookies.tsx) =============================== */
export type CookieRij = { naam: string; doel: string; duur: string };
export type CookieGroep = { t: string; status: string; uitleg: string; rijen?: CookieRij[] };

export const COOKIES = {
  // Cookies.tsx r.70-73 (kruimel, h1, lede), r.108 (vraagkaart), r.121-124 (titel, beschrijving)
  kop: 'Cookiebeleid',
  lede: 'Welke cookies deze website plaatst, waarvoor ze dienen en hoe u ze weigert. Laatste aanpassing: augustus 2026.',
  vraag: 'Een vraag over cookies?',
  titel: 'Cookiebeleid · AB Bouw Groep',
  omschrijving: 'Cookiebeleid van AB Bouw Groep: welke cookies deze website plaatst, waarvoor ze dienen en hoe u ze beheert.',
  // Cookies.tsx r.82-105 (tussenkoppen en alinea's)
  wat: {
    t: 'Wat cookies zijn',
    p: 'Een cookie is een klein tekstbestand dat een website in uw browser opslaat. Bij een volgend bezoek kan de site dat bestand weer uitlezen. Zo onthoudt een site bijvoorbeeld welke keuze u in de cookiemelding maakte.',
  },
  welke: {
    t: 'Welke cookies wij plaatsen',
    p: 'Wij werken met drie soorten. Alleen de eerste staat standaard aan; de andere twee vragen eerst uw toestemming via de melding onderaan de site.',
  },
  keuze: {
    t: 'Uw keuze wijzigen',
    p: 'Bij uw eerste bezoek vraagt de melding onderaan of u akkoord gaat. Zolang u niets kiest, blijven de analytische en advertentiecookies uit. Wilt u uw keuze later herzien, verwijder dan de cookies van deze site in uw browser; bij het volgende bezoek verschijnt de melding opnieuw.',
  },
  browser: {
    t: 'Cookies beheren in uw browser',
    p: 'U kunt cookies ook rechtstreeks in uw browser beheren of verwijderen:',
    na: 'Schakelt u de functionele cookies uit, dan werkt een deel van de site niet meer zoals bedoeld.',
  },
  meer: {
    t: 'Meer weten',
    p: 'Hoe wij met persoonsgegevens omgaan, leest u in ons <a href="/privacy">privacybeleid</a>.',
  },
  // Cookies.tsx r.49-51 (kolomkoppen van de tabel)
  tabelKop: ['Cookie', 'Waarvoor', 'Bewaartijd'] as const,
};

// Cookies.tsx r.9-35
export const COOKIE_GROEPEN: CookieGroep[] = [
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

// Cookies.tsx r.37-42
export const COOKIE_BROWSERS: [string, string][] = [
  ['Google Chrome', 'https://support.google.com/chrome/answer/95647'],
  ['Mozilla Firefox', 'https://support.mozilla.org/nl/kb/cookies-verwijderen-gegevens-wissen-websites-opgeslagen'],
  ['Apple Safari', 'https://support.apple.com/nl-be/guide/safari/sfri11471/mac'],
  ['Microsoft Edge', 'https://support.microsoft.com/nl-nl/microsoft-edge/cookies-verwijderen-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'],
];
