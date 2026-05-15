import { useEffect } from 'react';
import { useAbBouwInteractions } from '@/hooks/useAbBouwInteractions';
import { buildNav, buildHero, FOOTER, SHELL_STYLE } from './_shell';
import hero from '@/assets/home/hero-contact.jpg';
import regionImg from '@/assets/home/region-coverage.jpg';
import { submitLead, divisieKey } from '@/lib/leads';

const HTML = `
${buildNav('contact')}

${buildHero({
  bg: hero,
  eyebrow: 'Contact',
  title: 'Laten we<br/>kennismaken.',
  lede: 'Vertel ons kort over uw project, we reageren binnen één werkdag en plannen indien gewenst een gratis plaatsbezoek.',
  primary: { label: 'Bel +32 470 63 44 13', href: 'tel:+32470634413' },
  secondary: { label: 'info@abgroep.be →', href: 'mailto:info@abgroep.be' },
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
            <div class="lf-contact-info-text"><strong>E-MAIL</strong><a href="mailto:info@abgroep.be">info@abgroep.be</a></div>
          </div>
          <div class="lf-contact-info-item">
            <div class="lf-contact-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <div class="lf-contact-info-text"><strong>KANTOORUREN</strong><span>Ma t.e.m. vr · 8u tot 18u · Za op afspraak</span></div>
          </div>
          <div class="lf-contact-info-item">
            <div class="lf-contact-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <div class="lf-contact-info-text"><strong>KANTOOR</strong><span>August van Landeghemstraat 65 · 2830 Willebroek</span></div>
          </div>
        </div>
      </div>

      <div class="lf-form-wrapper" data-form-wrapper>
        <form class="lf-form" id="contact-form" data-reveal data-reveal-delay="1" data-form-anim novalidate>
          <h3>Vraag uw plaatsbezoek aan</h3>
          <p>Vul het formulier in en we contacteren u binnen één werkdag.</p>
          <div class="lf-form-row">
            <input type="text" name="firstName" autocomplete="given-name" placeholder="Voornaam" required />
            <input type="text" name="lastName" autocomplete="family-name" placeholder="Familienaam" required />
          </div>
          <input type="email" name="email" autocomplete="email" placeholder="E-mailadres" required />
          <input type="tel" name="phone" autocomplete="tel" placeholder="Telefoonnummer" required />
          <input type="text" name="straat" autocomplete="street-address" placeholder="Straat en nummer" />
          <div class="lf-form-row">
            <input type="text" name="postcode" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="Postcode" />
            <input type="text" name="gemeente" autocomplete="address-level2" placeholder="Gemeente" />
          </div>
          <div class="lf-dd" data-dd>
            <button type="button" class="lf-dd-toggle" data-dd-toggle aria-haspopup="listbox" aria-expanded="false">
              <span class="lf-dd-label" data-dd-label>Type werk</span>
              <svg class="lf-dd-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <ul class="lf-dd-list" role="listbox">
              <li role="option" data-dd-opt>Algemene aanneming (Construct)</li>
              <li role="option" data-dd-opt>Ecologisch / duurzaam</li>
              <li role="option" data-dd-opt>Interieurwerken</li>
              <li role="option" data-dd-opt>Dakwerken</li>
              <li role="option" data-dd-opt>Badkamer / wellness</li>
              <li role="option" data-dd-opt>Gevelbekleding</li>
              <li role="option" data-dd-opt>Combinatie / weet ik niet</li>
            </ul>
            <input type="hidden" name="type_werk" data-dd-input required />
          </div>
          <textarea name="aanvullende_info" placeholder="Vertel kort over uw project (optioneel)"></textarea>
          <button type="submit" class="lf-cta-pill" data-submit-btn>
            <span data-submit-label>Verstuur aanvraag</span>
            <span class="lf-cta-pill-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
          </button>
          <p class="lf-form-error" data-form-error aria-live="polite" hidden></p>
        </form>
        <div class="lf-form-thanks" data-form-thanks aria-hidden="true">
          <div class="lf-form-thanks-circle">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>Bedankt voor je offerte.</h3>
          <p>We bekijken uw aanvraag en nemen binnen één werkdag contact met u op.</p>
        </div>
      </div>
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
        <p>Vlaamse rooftops, velden en kanalen, van Antwerpen en Mechelen tot Brussel en Gent. Hier rijden onze ploegen wekelijks rond.</p>
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
        <h5>info@abgroep.be</h5>
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
        <p>Voor pers, samenwerkingen, leveranciers of vacatures: tom@abgroep.be of vraag rechtstreeks naar Tom op het algemene nummer.</p>
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

const FORM_ANIM_CSS = `
/* Post-submit animatie: het formulier vouwt elegant samen en de
   bedankboodschap fade-in't met een lichte schaal- en lift-beweging. */
.lf-form-wrapper {
  position: relative;
}
.lf-form-wrapper .lf-form {
  transition:
    opacity 0.55s cubic-bezier(.22,.61,.36,1),
    transform 0.65s cubic-bezier(.22,.61,.36,1),
    max-height 0.7s cubic-bezier(.22,.61,.36,1),
    filter 0.5s cubic-bezier(.22,.61,.36,1);
  max-height: 1600px;
  overflow: hidden;
}
.lf-form-wrapper.is-submitting .lf-form {
  pointer-events: none;
  filter: blur(0.5px);
  opacity: 0.55;
}
.lf-form-wrapper.is-success .lf-form {
  opacity: 0;
  transform: translateY(-12px) scale(0.985);
  max-height: 0;
  margin: 0;
  padding: 0;
  border: none;
  pointer-events: none;
}

.lf-form-thanks {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 28px;
  background: #fff;
  border: 1px solid var(--ink-line-soft);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(15,17,21,.04), 0 30px 60px -32px rgba(15,17,21,.18);
  opacity: 0;
  transform: translateY(14px) scale(0.985);
  pointer-events: none;
  transition:
    opacity 0.6s cubic-bezier(.22,.61,.36,1) 0.15s,
    transform 0.6s cubic-bezier(.22,.61,.36,1) 0.15s;
}
.lf-form-wrapper.is-success .lf-form-thanks {
  position: relative;
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.lf-form-thanks h3 {
  font-family: var(--font-display, inherit);
  font-size: clamp(22px, 2.4vw, 28px);
  color: var(--navy);
  margin: 16px 0 8px;
}
.lf-form-thanks p {
  font-size: 14.5px;
  color: var(--ink-soft);
  max-width: 360px;
  margin: 0;
  line-height: 1.55;
}
.lf-form-thanks-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent, #d98c03);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 32px -8px rgba(217,140,3,0.55);
  transform: scale(0.6);
  opacity: 0;
  transition:
    transform 0.55s cubic-bezier(.34,1.56,.64,1) 0.25s,
    opacity 0.45s ease 0.25s;
}
.lf-form-wrapper.is-success .lf-form-thanks-circle {
  transform: scale(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .lf-form-wrapper .lf-form,
  .lf-form-thanks,
  .lf-form-thanks-circle { transition: none; }
}

.lf-form-error {
  margin: 8px 0 0;
  padding: 12px 14px;
  font-size: 13.5px;
  line-height: 1.5;
  color: #b3261e;
  background: #fdecea;
  border: 1px solid rgba(179,38,30,0.18);
  border-radius: 10px;
}
`;

export default function Contact() {
  useEffect(() => {
    document.title = "Contact | AB Bouw Groep | Plaatsbezoek aanvragen";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', "Plan een gratis plaatsbezoek of stel uw vraag. Reactie binnen één werkdag. Kantoor in Willebroek, actief in heel Vlaanderen en Brussel.");
    const prev = document.body.className;
    document.body.className = "";
    const styleEl = document.createElement('style');
    styleEl.textContent = SHELL_STYLE + FORM_ANIM_CSS;
    document.head.appendChild(styleEl);

    // Form submit handler — POST naar GHL Inbound Webhook, dan UI switch
    const wrapper = document.querySelector<HTMLElement>('[data-form-wrapper]');
    const form = document.querySelector<HTMLFormElement>('[data-form-anim]');
    const errBox = document.querySelector<HTMLElement>('[data-form-error]');
    const btn = document.querySelector<HTMLButtonElement>('[data-submit-btn]');
    const btnLabel = document.querySelector<HTMLElement>('[data-submit-label]');

    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (!form || !wrapper) return;

      // Native HTML5 validation triggeren (we hebben novalidate aan voor custom dd)
      const requiredInputs = form.querySelectorAll<HTMLInputElement>('input[required]');
      for (const inp of Array.from(requiredInputs)) {
        if (!inp.checkValidity()) {
          inp.reportValidity();
          return;
        }
      }
      const ddInput = form.querySelector<HTMLInputElement>('input[name="type_werk"]');
      if (ddInput && !ddInput.value) {
        if (errBox) {
          errBox.hidden = false;
          errBox.textContent = 'Selecteer een type werk.';
        }
        return;
      }

      if (errBox) { errBox.hidden = true; errBox.textContent = ''; }
      wrapper.classList.add('is-submitting');
      if (btn) btn.disabled = true;
      if (btnLabel) btnLabel.textContent = 'Even bezig…';

      const fd = new FormData(form);
      const result = await submitLead({
        source: 'contact_form',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email: (fd.get('email') as string) || '',
        phone: (fd.get('phone') as string) || undefined,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: divisieKey(fd.get('type_werk') as string),
        aanvullende_info: (fd.get('aanvullende_info') as string) || undefined,
      });

      wrapper.classList.remove('is-submitting');

      if (result.ok) {
        wrapper.classList.add('is-success');
      } else {
        if (btn) btn.disabled = false;
        if (btnLabel) btnLabel.textContent = 'Verstuur aanvraag';
        if (errBox) {
          errBox.hidden = false;
          errBox.textContent = 'Er ging iets mis bij het versturen. Bel ons gerust op +32 470 63 44 13 of mail naar info@abgroep.be.';
        }
      }
    };
    form?.addEventListener('submit', onSubmit);

    return () => {
      document.body.className = prev;
      styleEl.remove();
      form?.removeEventListener('submit', onSubmit);
    };
  }, []);
  useAbBouwInteractions();
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
