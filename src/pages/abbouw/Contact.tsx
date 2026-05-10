import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, FOOTER, SHELL_STYLE } from './_shell';
import hero from '@/assets/home/hero-contact.jpg';
import regionImg from '@/assets/home/region-coverage.jpg';

const HTML = `
${buildNav('contact')}

${buildHero({
  bg: hero,
  eyebrow: 'Contact',
  title: 'Laten we<br/>kennismaken.',
  lede: 'Vertel ons kort over uw project, we reageren binnen één werkdag en plannen indien gewenst een gratis plaatsbezoek.',
  primary: { label: 'Bel +32 470 63 44 13', href: 'tel:+32470634413' },
  secondary: { label: 'info@abbouwgroup.be →', href: 'mailto:info@abbouwgroup.be' },
})}

<!-- CONTACT GRID + FORMULIER -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-contact-grid">
      <div data-reveal>
        <span class="lf-eyebrow">Direct contact</span>
        <h2 class="lf-h2">Liever direct<br/>bellen?</h2>
        <p class="lf-lede">Voor dringende vragen of snel telefonisch overleg, we zijn bereikbaar tijdens de kantooruren. 's Avonds en in het weekend kan u inspreken; we bellen de eerste werkdag terug.</p>
        <div class="lf-contact-info">
          <div class="lf-contact-info-item">
            <div class="lf-contact-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
            <div class="lf-contact-info-text"><strong>TELEFOON</strong><a href="tel:+32470634413">+32 470 63 44 13</a></div>
          </div>
          <div class="lf-contact-info-item">
            <div class="lf-contact-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg></div>
            <div class="lf-contact-info-text"><strong>E-MAIL</strong><a href="mailto:info@abbouwgroup.be">info@abbouwgroup.be</a></div>
          </div>
          <div class="lf-contact-info-item">
            <div class="lf-contact-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <div class="lf-contact-info-text"><strong>KANTOORUREN</strong><span>Ma – Vr · 8u tot 18u · Za op afspraak</span></div>
          </div>
          <div class="lf-contact-info-item">
            <div class="lf-contact-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <div class="lf-contact-info-text"><strong>KANTOOR</strong><span>Industrieweg 14 · 2830 Willebroek</span></div>
          </div>
        </div>
      </div>

      <form class="lf-form" data-reveal data-reveal-delay="1" onsubmit="event.preventDefault(); alert('Bedankt, we nemen binnen 24u contact op.');">
        <h3>Vraag uw plaatsbezoek aan</h3>
        <p>Vul het formulier in en we contacteren u binnen één werkdag.</p>
        <div class="lf-form-row">
          <input type="text" placeholder="Voornaam" required />
          <input type="text" placeholder="Familienaam" required />
        </div>
        <input type="email" placeholder="E-mailadres" required />
        <input type="tel" placeholder="Telefoonnummer" required />
        <input type="text" placeholder="Postcode &amp; gemeente" />
        <select required>
          <option value="">Type werk</option>
          <option>Algemene aanneming (Construct)</option>
          <option>Ecologisch / duurzaam</option>
          <option>Interieurwerken</option>
          <option>Dakwerken</option>
          <option>Badkamer / wellness</option>
          <option>Gevelbekleding</option>
          <option>Combinatie / weet ik niet</option>
        </select>
        <textarea placeholder="Vertel kort over uw project (optioneel)"></textarea>
        <button type="submit" class="lf-cta-pill">
          <span>Verstuur aanvraag</span>
          <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </button>
      </form>
    </div>
  </div>
</section>

<!-- WERKGEBIED -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head" data-reveal>
      <span class="lf-eyebrow">Ons werkgebied</span>
      <h2 class="lf-h2">Heel Vlaanderen<br/>en Brussel.</h2>
      <p class="lf-lede">Vanuit ons kantoor in Willebroek bedienen we klanten in een straal van circa 80 km. Voor grote projecten (>€250k) kijken we ook over de gewestgrenzen heen.</p>
    </div>
    <div class="ab-coverage">
      <div class="ab-coverage-list" data-reveal>
        <h4>Kernregio's waar we wekelijks actief zijn</h4>
        <div class="ab-coverage-cols">
          <span>Antwerpen stad</span><span>Mechelen</span>
          <span>Willebroek</span><span>Boom &amp; Rupelstreek</span>
          <span>Klein-Brabant</span><span>Puurs-Sint-Amands</span>
          <span>Bornem</span><span>Sint-Niklaas</span>
          <span>Lier</span><span>Heist-op-den-Berg</span>
          <span>Brussel-stad</span><span>Vilvoorde</span>
          <span>Asse &amp; Pajottenland</span><span>Aalst</span>
          <span>Dendermonde</span><span>Halle</span>
          <span>Leuven</span><span>Tienen</span>
          <span>Gent (op aanvraag)</span><span>Hasselt (op aanvraag)</span>
        </div>
      </div>
      <div class="ab-map ab-map--photo" data-reveal data-reveal-delay="1" style="background-image: linear-gradient(180deg, rgba(11,18,32,0) 35%, rgba(11,18,32,0.85) 100%), url('${regionImg}');">
        <h4>Onze regio in beeld</h4>
        <p>Vlaamse rooftops, velden en kanalen — van Antwerpen en Mechelen tot Brussel en Gent. Hier rijden onze ploegen wekelijks rond.</p>
      </div>
    </div>
  </div>
</section>

<!-- ALTERNATIEVEN -->
<section class="lf-section">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Andere manieren om ons te bereiken</span>
      <h2 class="lf-h2">Via welk kanaal u ook contacteert,<br/>één werkdag responstijd.</h2>
    </div>
    <div class="lf-support-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="lf-support-card" data-reveal>
        <div class="lf-support-meta"><span>01</span> WhatsApp</div>
        <h5>+32 470 63 44 13</h5>
        <p>Stuur een berichtje, eventueel met foto van wat u laat doen. Praktisch voor korte vragen of een snelle prijsindicatie.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="1">
        <div class="lf-support-meta"><span>02</span> E-mail</div>
        <h5>info@abbouwgroup.be</h5>
        <p>Algemene vragen of offerteaanvragen. Bezorg ons gerust foto's of plannen, we komen binnen 24u terug.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="2">
        <div class="lf-support-meta"><span>03</span> Bezoek</div>
        <h5>Toon ons uw plaats</h5>
        <p>Geen budget om langs te komen? Stuur ons een korte video van wat u wilt veranderen, we maken een eerste prijsindicatie op afstand.</p>
      </div>
      <div class="lf-support-card" data-reveal data-reveal-delay="3">
        <div class="lf-support-meta"><span>04</span> Pers / partnerschappen</div>
        <h5>Tom Verheyden</h5>
        <p>Voor pers, samenwerkingen, leveranciers of vacatures: tom@abbouwgroup.be of vraag rechtstreeks naar Tom op het algemene nummer.</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lf-section lf-tone-soft">
  <div class="wrap">
    <div class="lf-section-head centered" data-reveal>
      <span class="lf-eyebrow">Voor u contacteert</span>
      <h2 class="lf-h2">Vaak gestelde vragen<br/>over een eerste contact.</h2>
    </div>
    <div class="ab-faq">
      <details data-reveal><summary>Is een plaatsbezoek echt gratis?</summary><div class="ab-faq-body"><p>Ja, volledig gratis en vrijblijvend. Wij zien een plaatsbezoek niet als een verkoopgesprek maar als een wederzijdse kennismaking. We willen weten of het project bij ons past, en u wilt weten of wij bij u passen. Pas na het plaatsbezoek beslissen we samen of we een offerte maken.</p></div></details>
      <details data-reveal><summary>Welke info moet ik klaar hebben voor het eerste gesprek?</summary><div class="ab-faq-body"><p>Niets verplicht. Handig als u dit wel weet: type woning (open / halfopen / rij), bouwjaar, bewoonbare oppervlakte, of er reeds plannen of een architect zijn, en een ruwe budgetindicatie. Geen budget? Geen probleem, we helpen het mee inschatten.</p></div></details>
      <details data-reveal><summary>Hoe snel kan ik een plaatsbezoek krijgen?</summary><div class="ab-faq-body"><p>Doorgaans binnen 5 tot 10 werkdagen. In drukke periodes (voorjaar, na het bouwsalon Batibouw) kan dit oplopen tot 3 weken. Spoedoplossingen voor lekkende daken of stormschade krijgen voorrang, bel dan rechtstreeks.</p></div></details>
      <details data-reveal><summary>Werken jullie ook voor B2B / bedrijven?</summary><div class="ab-faq-body"><p>Ja. Ongeveer een kwart van onze omzet is B2B: kantoorgebouwen, kleine winkels, horecazaken, magazijnen en logistieke ruimtes. We werken op factuur met betaaltermijn 30 dagen einde maand voor erkende ondernemingen.</p></div></details>
      <details data-reveal><summary>Mag ik bestaande klanten bellen om referentie te vragen?</summary><div class="ab-faq-body"><p>Heel graag. Vermeld bij uw aanvraag dat u referenties wenst en we bezorgen u 2 of 3 contactpersonen van vergelijkbare projecten, uiteraard met hun toestemming.</p></div></details>
    </div>
  </div>
</section>

${FOOTER}
`;

export default function Contact() {
  useEffect(() => {
    document.title = "Contact | AB Bouw Group | Plaatsbezoek aanvragen";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Plan een gratis plaatsbezoek of stel uw vraag. Reactie binnen één werkdag. Kantoor in Willebroek, actief in heel Vlaanderen en Brussel.");
    const prev = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE;
    document.head.appendChild(styleEl);
    return () => { document.body.className = prev; styleEl.remove(); };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
