import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { submitLead, divisieKey } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';

const DIVISIE_OPTIES = [
  'Algemene aanneming (Construct)',
  'Ecologisch / duurzaam',
  'Interieurwerken',
  'Dakwerken',
  'Badkamer / wellness',
  'Gevelbekleding',
  'Combinatie / weet ik niet',
];

const HTML = () => `<div class="rp">
${rpNav('/contact')}



<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-split" style="align-items:start;gap:56px">
      <div>
        <div class="rp-formkaart">
          <h2 class="rp-split__t" style="font-size:24px">Uw aanvraag</h2>
          <p class="rp-split__lede" style="margin-top:10px;font-size:15px">Velden met een sterretje zijn verplicht.</p>
          <form class="rp-form" style="margin-top:24px" data-contact-form novalidate>
            <div class="rp-form__rij">
              <div class="rp-veld">
                <label for="cf-voornaam">Voornaam *</label>
                <input id="cf-voornaam" type="text" name="firstName" autocomplete="given-name" required/>
              </div>
              <div class="rp-veld">
                <label for="cf-naam">Familienaam *</label>
                <input id="cf-naam" type="text" name="lastName" autocomplete="family-name" required/>
              </div>
            </div>
            <div class="rp-form__rij">
              <div class="rp-veld">
                <label for="cf-email">E-mailadres *</label>
                <input id="cf-email" type="email" name="email" autocomplete="email" required/>
              </div>
              <div class="rp-veld">
                <label for="cf-tel">Telefoonnummer *</label>
                <input id="cf-tel" type="tel" name="phone" autocomplete="tel" inputmode="tel" required/>
              </div>
            </div>
            <details class="rp-faq__item" style="border-radius:8px">
              <summary class="rp-faq__q" style="padding:14px 16px;font-size:15px">Adres van het project <span style="font-weight:600;color:var(--rp-mute)">&nbsp;, optioneel</span>${ic.plus}</summary>
              <div style="padding:0 16px 16px;display:grid;gap:16px">
                <div class="rp-veld">
                  <label for="cf-straat">Straat en nummer</label>
                  <input id="cf-straat" type="text" name="straat" autocomplete="street-address"/>
                </div>
                <div class="rp-form__rij">
                  <div class="rp-veld">
                    <label for="cf-postcode">Postcode</label>
                    <input id="cf-postcode" type="text" name="postcode" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{4}" maxlength="4"/>
                  </div>
                  <div class="rp-veld">
                    <label for="cf-gemeente">Gemeente</label>
                    <input id="cf-gemeente" type="text" name="gemeente" autocomplete="address-level2"/>
                  </div>
                </div>
              </div>
            </details>
            <div class="rp-veld">
              <label for="cf-werk">Om welk werk gaat het? *</label>
              <select id="cf-werk" name="type_werk" required>
                <option value="">Maak een keuze</option>
                ${DIVISIE_OPTIES.map((o) => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
            <div class="rp-veld">
              <label for="cf-info">Kort over uw project</label>
              <textarea id="cf-info" name="aanvullende_info" placeholder="Bijvoorbeeld: dak van 90 m², pannen uit 1978, één lek boven de badkamer."></textarea>
            </div>
            <p class="rp-fout" data-form-fout hidden></p>
            <button class="rp-btn rp-btn--primary rp-btn--block" type="submit" data-form-btn>Verstuur aanvraag</button>
            <p class="rp-form__klein" style="text-align:center">Wij bellen u terug om een moment af te spreken.</p>
            <div style="display:flex;justify-content:center">
              <span class="rp-proofchip rp-proofchip--licht">
                <span class="rp-proofchip__sterren" aria-hidden="true">${ic.star(13).repeat(5)}</span>
                <span class="rp-proofchip__t">4,9 op Google</span>
              </span>
            </div>
            <p class="rp-form__klein">Wij gebruiken uw gegevens enkel om uw aanvraag te behandelen. Zie onze <a href="/privacy" style="color:var(--rp-accent-text);text-decoration:underline">privacyverklaring</a>.</p>
          </form>
          <div data-form-ok hidden>
            <h2 class="rp-split__t" style="font-size:24px">Bedankt, uw aanvraag is verstuurd</h2>
            <p class="rp-split__lede">Wij nemen binnen één werkdag contact met u op. Liever meteen iemand spreken? Bel <a href="${CONTACT.phone.href}" style="color:var(--rp-accent-text);font-weight:700">${CONTACT.phone.display}</a>.</p>
          </div>
        </div>
      </div>

      <div>
        <span class="rp-eyebrow">${ic.mark} Rechtstreeks</span>
        <h2 class="rp-split__t">Liever meteen<span class="rp-dim">iemand aan de lijn?</span></h2>
        <p class="rp-split__lede">Bellen gaat sneller dan een formulier. Tijdens de kantooruren neemt er iemand op die uw dossier kan inkijken.</p>
        <div class="rp-foot__rows" style="margin-top:26px">
          <span class="rp-foot__row">${ic.phone(17)}<a href="${CONTACT.phone.href}" style="font-weight:700">${CONTACT.phone.display}</a></span>
          <span class="rp-foot__row">${ic.mail}<a href="mailto:${CONTACT.email}">${CONTACT.email}</a></span>
          <span class="rp-foot__row">${ic.pin}<span>${CONTACT.address.full}</span></span>
        </div>
        <div class="rp-hours" style="margin-top:28px">
          <div class="rp-hours__row"><span class="rp-hours__d">Ma&ndash;vr</span><span>08:00 &ndash; 18:00</span></div>
          <div class="rp-hours__row"><span class="rp-hours__d">Zaterdag</span><span>Op afspraak</span></div>
          <div class="rp-hours__row"><span class="rp-hours__d">Zondag</span><span>Gesloten</span></div>
        </div>
        <!-- Portret-plaatshouder eruit (aug 2026): zelfde soort als de groepsfoto
             op /over, namelijk een foto van een persoon. -->
        <div hidden></div>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}
</div>`;

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact · AB Bouw Groep';
    window.scrollTo(0, 0);
    /* De zwevende belknop lag hier over de keuzelijst en de verstuurknop, en
       is op deze pagina overbodig: het nummer staat er al naast. Dit merk zet
       hem uit, en gaat er bij het verlaten weer af. */
    document.body.dataset.pagina = 'contact';
    const opruimers: Array<() => void> = [wireMobielMenu(),
      () => { delete document.body.dataset.pagina; }];

    const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
    const btn = document.querySelector<HTMLButtonElement>('[data-form-btn]');
    const fout = document.querySelector<HTMLElement>('[data-form-fout]');
    const ok = document.querySelector<HTMLElement>('[data-form-ok]');

    const onFocus = () => trackFormStart('contact');
    form?.addEventListener('focusin', onFocus, { once: true });

    const toonFout = (tekst: string, veld?: HTMLElement | null) => {
      if (fout) { fout.textContent = tekst; fout.hidden = false; }
      veld?.setAttribute('aria-invalid', 'true');
      (veld as HTMLInputElement | null)?.focus();
    };

    const onSubmit = async (e: Event) => {
      e.preventDefault();
      if (!form) return;
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      if (fout) fout.hidden = true;

      const fd = new FormData(form);
      const email = ((fd.get('email') as string) || '').trim();
      const phone = ((fd.get('phone') as string) || '').trim();
      const werk = ((fd.get('type_werk') as string) || '').trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return toonFout('Vul een geldig e-mailadres in.', form.querySelector('[name="email"]'));
      }
      if (phone.replace(/\D/g, '').length < 8) {
        return toonFout('Vul een geldig telefoonnummer in.', form.querySelector('[name="phone"]'));
      }
      if (!werk) {
        return toonFout('Kies om welk werk het gaat.', form.querySelector('[name="type_werk"]'));
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Versturen…'; }
      const result = await submitLead({
        source: 'contact_form',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email,
        phone,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: divisieKey(werk),
        aanvullende_info: (fd.get('aanvullende_info') as string) || undefined,
        bron_lead: 'website:contact',
      });

      if (result.ok) {
        form.hidden = true;
        if (ok) ok.hidden = false;
        ok?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } else {
        if (btn) { btn.disabled = false; btn.textContent = 'Verstuur aanvraag'; }
        toonFout(`Er ging iets mis bij het versturen. Bel ons gerust op ${CONTACT.phone.display}.`);
      }
    };

    form?.addEventListener('submit', onSubmit);
    opruimers.push(() => {
      form?.removeEventListener('submit', onSubmit);
      form?.removeEventListener('focusin', onFocus);
    });

    return () => opruimers.forEach((f) => f());
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
