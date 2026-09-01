import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

type Blok = { n: string; t: string; p?: string[]; lijst?: string[]; na?: string[] };

const BLOKKEN: Blok[] = [
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
      'een beschrijving van uw project',
      'de berichten die u ons stuurt via het contactformulier',
    ],
  },
  {
    n: '3', t: 'Waarvoor wij ze gebruiken',
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
    n: '4', t: 'Hoe lang wij ze bewaren',
    p: [
      'Een projectdossier bewaren wij zolang de garantie op de uitgevoerde werken loopt.',
      'Boekhoudkundige gegevens houden wij zeven jaar bij, zoals de Belgische wetgeving voorschrijft. Offerteaanvragen die niet tot een opdracht leiden, verwijderen wij na maximaal twee jaar.',
    ],
  },
  {
    n: '5', t: 'Uw rechten',
    p: ['De AVG geeft u het recht om:'],
    lijst: [
      'uw persoonsgegevens in te kijken',
      'onjuiste gegevens te laten verbeteren',
      'uw gegevens te laten wissen, het recht op vergetelheid',
      'bezwaar te maken tegen de verwerking',
      'uw gegevens te laten overdragen',
    ],
    na: [`Stuur uw vraag naar <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>. Wij antwoorden binnen dertig dagen.`],
  },
  {
    n: '6', t: 'Cookies',
    p: [
      'Onze website plaatst functionele cookies die nodig zijn om de site te laten werken, en met uw toestemming ook cookies om bezoek te meten en advertenties op te volgen. In ons <a href="/cookies">cookiebeleid</a> leest u precies welke dat zijn.',
    ],
  },
  {
    n: '7', t: 'Klachten',
    p: [
      'Bent u niet tevreden over hoe wij met uw gegevens omgaan, laat het ons dan eerst weten. Meestal lossen we het snel op.',
      'U heeft daarnaast altijd het recht een klacht in te dienen bij de Gegevensbeschermingsautoriteit via <a href="https://www.gegevensbeschermingsautoriteit.be" rel="noopener noreferrer" target="_blank">gegevensbeschermingsautoriteit.be</a>.',
    ],
  },
];

const HTML = () => `<div class="rp">
${rpNav('')}

<section class="rp-phero">
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Privacybeleid</span></nav>
    <span class="rp-eyebrow">${ic.mark} Juridisch</span>
    <h1 class="rp-phero__t">Privacybeleid</h1>
    <p class="rp-phero__lede">Wat wij met uw gegevens doen, waarom, en hoe lang wij ze bijhouden. Laatste aanpassing: augustus 2026.</p>
  </div>
</section>

<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-artikel" style="max-width:820px">
      <div class="rp-artikel__body">
        ${BLOKKEN.map((b) => `
        <h2 style="font-size:21px;margin-top:36px">${b.n}. ${b.t}</h2>
        ${(b.p || []).map((t) => `<p>${t}</p>`).join('')}
        ${b.lijst ? `<ul>${b.lijst.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
        ${(b.na || []).map((t) => `<p>${t}</p>`).join('')}`).join('')}

        <div class="rp-formkaart" style="margin-top:44px">
          <h2 style="font-size:19px;margin:0 0 8px">Een vraag over uw gegevens?</h2>
          <p style="margin:0">Bel <a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a> of mail naar <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.</p>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacybeleid · AB Bouw Groep';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Privacybeleid van AB Bouw Groep: welke persoonsgegevens wij verwerken, waarvoor, hoe lang wij ze bewaren en welke rechten u heeft.');
    window.scrollTo(0, 0);
    const op = wireMobielMenu();
    return () => op();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
