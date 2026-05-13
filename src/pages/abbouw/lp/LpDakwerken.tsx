import { useEffect } from 'react';
import { LP_STYLE, lpStickyBar, lpTrustFoot } from './_lp-shell';
import { submitLead } from '@/lib/leads';

// Assets — hergebruik bestaande dakwerken foto's
import heroBg from '@/assets/dak/intro-overview.jpg';
import imgBenefits from '@/assets/dak/dakisolatie.jpg';
import imgProcess from '@/assets/home/vakman-dak.jpg';
import g1 from '@/assets/dak/hellend-pannen.jpg';
import g2 from '@/assets/dak/leien.jpg';
import g3 from '@/assets/dak/plat-epdm.jpg';
import g4 from '@/assets/dak/zinkwerk.jpg';
import expertImg from '@/assets/home/team1.jpg';

const HTML = `
<section class="lp-hero">
  <div class="lp-hero-bg"><img src="${heroBg}" alt="Dakwerken Vlaanderen" /></div>
  <div class="lp-hero-wrap">
    <span class="lp-hero-tag">AB Dakwerken · Willebroek</span>
    <h1><em>Nieuw dak.</em>Vaste prijs.<br/>Geplaatst door eigen dakdekkers.</h1>
    <p class="lp-hero-lede">Volledige dakvervanging, dakisolatie en zinkwerk in Mechelen, Antwerpen, Lier en heel Vlaanderen. Gratis plaatsbezoek binnen 5 werkdagen, bindende offerte met fotorapport, 10 jaar garantie op waterdichtheid.</p>
    <div class="lp-hero-actions">
      <a href="#lp-form" class="lp-btn-primary" data-lp-smooth>
        Gratis dakinspectie aanvragen
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a href="tel:+32470634413" class="lp-btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        +32 470 63 44 13
      </a>
    </div>
    <div class="lp-hero-trust">
      <div><span class="lp-hero-stars">★★★★★</span><strong>4.9/5</strong> 124 reviews</div>
      <div><strong>VCA*-gecertificeerd</strong></div>
      <div><strong>10 jaar</strong> garantie</div>
      <div><strong>Premiedossier</strong> inbegrepen</div>
    </div>
  </div>
</section>

<section class="lp-stats">
  <div class="lp-stats-grid">
    <div class="lp-stat lp-reveal"><div class="lp-stat-num">48.325 m²</div><div class="lp-stat-label">Afgewerkte daken sinds 2010</div></div>
    <div class="lp-stat lp-reveal"><div class="lp-stat-num">6 vaste</div><div class="lp-stat-label">Eigen dakdekkers in dienst</div></div>
    <div class="lp-stat lp-reveal"><div class="lp-stat-num">30%</div><div class="lp-stat-label">Minder warmteverlies na isolatie</div></div>
    <div class="lp-stat lp-reveal"><div class="lp-stat-num">€40/m²</div><div class="lp-stat-label">Mijn VerbouwPremie dakisolatie</div></div>
  </div>
</section>

<section class="lp-section">
  <div class="lp-section-wrap">
    <div class="lp-benefits">
      <div class="lp-reveal">
        <span class="lp-eyebrow">Waarom een nieuw dak loont</span>
        <h2>Meer comfort, <em>minder kosten,</em> hogere woningwaarde.</h2>
        <p class="lp-section-lede">Een slecht dak verliest tot 30% van uw verwarming. Een goed dak bespaart u jaarlijks honderden euro's én verhoogt uw EPC-label met gemiddeld 80 punten in één renovatie.</p>
        <ul class="lp-benefits-list">
          <li><span><strong>Bescherming tegen lekkages</strong>Geen waterschade meer aan plafond, isolatie of structuur</span></li>
          <li><span><strong>Tot 30% minder warmteverlies</strong>Direct lagere verwarmingsfactuur, binnen 1 winter merkbaar</span></li>
          <li><span><strong>Hogere EPC-score</strong>Vereist voor verkoop, verhuur en de renovatieverplichting tegen 2028</span></li>
          <li><span><strong>Waardevermeerdering</strong>€8.000 – €18.000 meerwaarde op uw woning bij verkoop</span></li>
        </ul>
        <a href="#lp-form" class="lp-btn-primary" data-lp-smooth>Vraag uw plaatsbezoek aan</a>
      </div>
      <div class="lp-benefits-visual lp-reveal">
        <img src="${imgBenefits}" alt="Dakisolatie wordt aangebracht door vakman" loading="lazy" />
      </div>
    </div>
  </div>
</section>

<section class="lp-section alt">
  <div class="lp-section-wrap">
    <div class="lp-reveal" style="margin-bottom: 48px;">
      <span class="lp-eyebrow">Nu starten = meer voordeel</span>
      <h2>Drie redenen om <em>niet te wachten</em>.</h2>
    </div>
    <div class="lp-urgency-grid">
      <div class="lp-urgency-card lp-reveal">
        <div class="lp-urgency-num">01</div>
        <h4>Premies dalen jaarlijks</h4>
        <p>De Mijn VerbouwPremie staat in 2026 op €40/m² maar wordt elk jaar verlaagd. Op een gemiddelde rijwoning bespaart u nu €3.500-€5.400 die u in 2027 niet meer krijgt.</p>
      </div>
      <div class="lp-urgency-card lp-reveal">
        <div class="lp-urgency-num">02</div>
        <h4>Materiaalprijzen stijgen</h4>
        <p>Pannen, leien en EPDM zijn sinds 2022 +18% duurder geworden en blijven stijgen. Wie nu boekt, krijgt nog 2026-tarieven vastgezet in offerte.</p>
      </div>
      <div class="lp-urgency-card lp-reveal">
        <div class="lp-urgency-num">03</div>
        <h4>Klaar voor de winter</h4>
        <p>Begin nu en uw dak ligt waterdicht vóór november. Wachten tot najaar betekent 2-3 maanden langer wachten en stormrisico ondertussen.</p>
      </div>
    </div>
  </div>
</section>

<section class="lp-section">
  <div class="lp-section-wrap">
    <div class="lp-process">
      <div class="lp-process-img lp-reveal">
        <img src="${imgProcess}" alt="Dakdekker plaatst Koramic pannen op hellend dak" loading="lazy" />
      </div>
      <div class="lp-reveal">
        <span class="lp-eyebrow">Snelle start, vlotte afwerking</span>
        <h2>Van eerste gesprek tot <em>waterdicht dak</em> in 6 weken.</h2>
        <p class="lp-section-lede">Eigen dakploeg betekent: geen onderaannemers, geen tussenstops, één verantwoordelijke. Wij beginnen en wij maken het af.</p>
        <div class="lp-process-points">
          <div class="lp-process-point">
            <div class="lp-process-point-num">01</div>
            <div class="lp-process-point-body"><strong>Gratis plaatsbezoek (week 1)</strong><p>Binnen 5 werkdagen langs voor opname, dakinspectie met dronefoto's en eerste richtprijs.</p></div>
          </div>
          <div class="lp-process-point">
            <div class="lp-process-point-num">02</div>
            <div class="lp-process-point-body"><strong>Bindende offerte (week 2)</strong><p>Gedetailleerde meetstaat met materialen, uurloon, timing en premiedossier — alles op één pagina.</p></div>
          </div>
          <div class="lp-process-point">
            <div class="lp-process-point-num">03</div>
            <div class="lp-process-point-body"><strong>Uitvoering (week 3-5)</strong><p>8 tot 14 werkdagen op de werf, weekrapport per email, één projectleider als aanspreekpunt.</p></div>
          </div>
          <div class="lp-process-point">
            <div class="lp-process-point-num">04</div>
            <div class="lp-process-point-body"><strong>Oplevering + 10 jaar garantie</strong><p>Gezamenlijke controle, opleveringsverslag, premie ingediend, garantie schriftelijk vastgelegd.</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lp-section alt">
  <div class="lp-section-wrap">
    <div class="lp-reveal" style="margin-bottom: 40px;">
      <span class="lp-eyebrow">Realisaties</span>
      <h2>Daken die de <em>tand des tijds</em> doorstaan.</h2>
      <p class="lp-section-lede">Een greep uit projecten in Mechelen, Antwerpen, Lier, Sint-Niklaas en Brussel. Allemaal door onze eigen ploeg geplaatst.</p>
    </div>
    <div class="lp-gallery">
      <a href="#lp-form" class="lp-gallery-cell lp-reveal" data-lp-smooth>
        <img src="${g1}" alt="Hellend dak in keramische pannen Mechelen" loading="lazy" />
        <div class="lp-gallery-cap"><small>Hellend dak</small><strong>Pannendak — Mechelen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell lp-reveal" data-lp-smooth>
        <img src="${g2}" alt="Natuurleien dak villa Antwerpen" loading="lazy" />
        <div class="lp-gallery-cap"><small>Hellend dak</small><strong>Natuurleien — Antwerpen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell lp-reveal" data-lp-smooth>
        <img src="${g3}" alt="Plat dak EPDM met PIR isolatie Lier" loading="lazy" />
        <div class="lp-gallery-cap"><small>Plat dak</small><strong>EPDM rubber — Lier</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell lp-reveal" data-lp-smooth>
        <img src="${g4}" alt="Zinken dakgoten en boordafwerking Sint-Niklaas" loading="lazy" />
        <div class="lp-gallery-cap"><small>Afwerking</small><strong>Zinkwerk — Sint-Niklaas</strong></div>
      </a>
    </div>
  </div>
</section>

<section class="lp-section">
  <div class="lp-section-wrap">
    <div class="lp-expert">
      <div class="lp-expert-img lp-reveal">
        <img src="${expertImg}" alt="Bardh, dakwerken projectleider AB Bouw Groep" loading="lazy" />
      </div>
      <div class="lp-reveal">
        <span class="lp-eyebrow">Direct advies</span>
        <p class="lp-expert-quote">"Een dak is geen quick fix. Wij komen langs, meten alles op, en zeggen u eerlijk wat écht moet — en wat 5 jaar kan wachten."</p>
        <div class="lp-expert-name">Bardh</div>
        <div class="lp-expert-role">Projectleider Dakwerken · AB Bouw Groep</div>
        <a href="tel:+32470634413" class="lp-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Bel Bardh direct
        </a>
      </div>
    </div>
  </div>
</section>

<section class="lp-section alt">
  <div class="lp-section-wrap">
    <div class="lp-reveal" style="text-align:center; margin: 0 auto 48px; max-width: 740px;">
      <span class="lp-eyebrow">Wat klanten zeggen</span>
      <h2 style="margin: 0 auto;">23 vakmensen, <em>500+ daken</em>, één manier van werken.</h2>
    </div>
    <div class="lp-reviews-grid">
      <div class="lp-review-card lp-reveal">
        <div class="lp-review-stars">★★★★★</div>
        <p class="lp-review-text">"Volledig nieuw pannendak op onze rijwoning. Begonnen op afgesproken dag, klaar in 9 werkdagen, alles netjes opgeruimd. Het wekelijks fotorapport vond ik top — wist altijd waar ze stonden."</p>
        <div class="lp-review-author">
          <div class="lp-review-author-avatar">MV</div>
          <div class="lp-review-author-info"><strong>Marc V.</strong><span>Mechelen</span></div>
        </div>
      </div>
      <div class="lp-review-card lp-reveal">
        <div class="lp-review-stars">★★★★★</div>
        <p class="lp-review-text">"Plat dak in EPDM laten leggen op de aanbouw. Eerlijke offerte, geen verrassingen achteraf. Premiedossier hebben ze ook voor mij geregeld, kreeg €3.200 terug. Aanrader."</p>
        <div class="lp-review-author">
          <div class="lp-review-author-avatar">EK</div>
          <div class="lp-review-author-info"><strong>Ellen K.</strong><span>Lier</span></div>
        </div>
      </div>
      <div class="lp-review-card lp-reveal">
        <div class="lp-review-stars">★★★★★</div>
        <p class="lp-review-text">"Hadden lekkage tijdens herfststorm. Bardh kwam dezelfde week langs voor een tijdelijke fix, daarna volledig dak vernieuwd het voorjaar erop. Vakkundig en hij doet wat hij belooft."</p>
        <div class="lp-review-author">
          <div class="lp-review-author-avatar">DV</div>
          <div class="lp-review-author-info"><strong>Dirk V.</strong><span>Antwerpen</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lp-section">
  <div class="lp-section-wrap">
    <div class="lp-reveal" style="margin-bottom: 36px; text-align:center;">
      <span class="lp-eyebrow">Veelgestelde vragen</span>
      <h2 style="margin: 0 auto;">Antwoorden op wat <em>iedereen vraagt</em>.</h2>
    </div>
    <div class="lp-faq">
      <details><summary>Wat kost een nieuw dak in 2026?</summary><p>Volledige vervanging van een hellend dak op een gemiddelde rijwoning (120 m²): tussen €18.000 en €32.000 alles inbegrepen (afbraak, isolatie, panlatten, pannen, dakgoten). Plat dak in EPDM is iets goedkoper per m². De premie van €40/m² dakisolatie haalt u gemiddeld €3.500-€5.500 van die factuur. We geven na het plaatsbezoek een bindende richtprijs, geen verrassingen achteraf.</p></details>
      <details><summary>Hoe lang duurt de plaatsing?</summary><p>Een hellend pannendak op een rijwoning ligt waterdicht na 8 tot 14 werkdagen, exclusief weekenden en bij correct weer. Plat dak in EPDM is vaak in 4-8 werkdagen klaar. Inclusief opbouw stelling en eindopkuis.</p></details>
      <details><summary>Doen jullie de premieaanvraag voor mij?</summary><p>Ja, standaard bij elke renovatie. We bereiden het Mijn VerbouwPremie-dossier voor, leveren de foto's en facturen aan in het juiste format, en bezorgen u het ontvangstbewijs van het Vlaams Energie Agentschap. U hoeft enkel uw burgerprofiel-login te delen.</p></details>
      <details><summary>Wat is uw garantie?</summary><p>10 jaar wettelijke aansprakelijkheid op waterdichtheid en stabiliteit, gedekt door onze polis bij Federale Verzekering (BCCA Klasse 4). Daarbovenop krijgt u de fabrieksgarantie van Koramic, Eternit of Firestone op de gebruikte materialen — meestal 30-50 jaar.</p></details>
      <details><summary>Werken jullie ook bij dringende lekkages?</summary><p>Ja. Bij stormschade of acute lekkage bellen we dezelfde week. We doen een tijdelijke water-stop (kapje, dekzeil, EPDM-patch) en plannen daarna pas de structurele renovatie in. Belt u liefst voor 16u, dan komt iemand nog dezelfde dag.</p></details>
      <details><summary>Welke regio's bedienen jullie?</summary><p>Vanuit Willebroek werken wij in een straal van 80 km: Antwerpen, Mechelen, Lier, Boom, Bornem, Puurs, Sint-Niklaas, Heist-op-den-Berg, Brussel-stad, Vilvoorde, Asse, Aalst, Dendermonde, Leuven. Voor grote projecten ook daarbuiten — gewoon eens bellen.</p></details>
    </div>
  </div>
</section>

<section class="lp-section lp-form-section" id="lp-form">
  <div class="lp-section-wrap">
    <div class="lp-form-grid">
      <div class="lp-form-side lp-reveal">
        <span class="lp-eyebrow">Gratis dakinspectie</span>
        <h2>Vraag uw <em>plaatsbezoek</em> aan.</h2>
        <p>Binnen 5 werkdagen komt onze dakploeg langs. Volledige opname met dronefoto's, eerste richtprijs ter plaatse, premiedossier doorgesproken — vrijblijvend en gratis.</p>
        <ul>
          <li>Plaatsbezoek binnen 5 werkdagen</li>
          <li>Bindende offerte op papier</li>
          <li>Premiedossier inbegrepen (gemiddeld €3.500+ terug)</li>
          <li>10 jaar garantie op waterdichtheid</li>
          <li>Eigen dakploeg, geen onderaannemers</li>
        </ul>
      </div>
      <div class="lp-form-card lp-reveal" data-lp-form-wrapper>
        <h3>Plan uw dakinspectie</h3>
        <p class="lp-form-sub">Vul het formulier in, we bellen u binnen één werkdag terug om een afspraak in te plannen.</p>
        <form data-lp-form novalidate>
          <div class="lp-form-row">
            <input type="text" name="firstName" placeholder="Voornaam *" required autocomplete="given-name" />
            <input type="text" name="lastName" placeholder="Familienaam *" required autocomplete="family-name" />
          </div>
          <input type="email" name="email" placeholder="E-mailadres *" required autocomplete="email" />
          <input type="tel" name="phone" placeholder="Telefoonnummer *" required autocomplete="tel" />
          <input type="text" name="straat" placeholder="Straat en nummer" autocomplete="street-address" />
          <div class="lp-form-row">
            <input type="text" name="postcode" placeholder="Postcode" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="postal-code" />
            <input type="text" name="gemeente" placeholder="Gemeente" autocomplete="address-level2" />
          </div>
          <textarea name="aanvullende_info" placeholder="Vertel kort over uw dak (type, leeftijd, klacht)"></textarea>
          <button type="submit" data-lp-submit>Vraag dakinspectie aan</button>
          <p class="lp-form-foot">Geen spam. Eén keer contact, dan plannen we het plaatsbezoek. Privacy verklaring op <a href="/privacy" target="_blank">/privacy</a>.</p>
          <div class="lp-form-error" data-lp-form-error></div>
        </form>
        <div class="lp-form-thanks">
          <div class="lp-form-thanks-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>Aanvraag ontvangen.</h3>
          <p>We bellen u binnen één werkdag terug om uw plaatsbezoek in te plannen.</p>
        </div>
      </div>
    </div>
  </div>
</section>

${lpTrustFoot}
${lpStickyBar('+32 470 63 44 13', 'Vraag offerte')}
`;

export default function LpDakwerken() {
  useEffect(() => {
    document.title = "Dakwerken Mechelen, Antwerpen & Vlaanderen — Gratis dakinspectie | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Nieuw dak in Mechelen, Antwerpen, Lier en heel Vlaanderen. Eigen dakdekkers, 10 jaar garantie, premiedossier inbegrepen. Gratis plaatsbezoek binnen 5 werkdagen.');

    const prev = document.body.className;
    document.body.className = 'lp-page';
    const style = document.createElement('style');
    style.textContent = LP_STYLE;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    // Smooth scroll to anchor
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest('a[data-lp-smooth]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    document.addEventListener('click', onAnchor);

    // Reveal-on-scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll<HTMLElement>('.lp-reveal').forEach((el) => io.observe(el));

    // Form submit → GHL met bron_lead='ads:dakwerken'
    const wrap = document.querySelector<HTMLElement>('[data-lp-form-wrapper]');
    const form = document.querySelector<HTMLFormElement>('[data-lp-form]');
    const submitBtn = document.querySelector<HTMLButtonElement>('[data-lp-submit]');
    const errBox = document.querySelector<HTMLElement>('[data-lp-form-error]');
    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (!form || !wrap) return;
      const requiredInputs = form.querySelectorAll<HTMLInputElement>('input[required]');
      for (const inp of Array.from(requiredInputs)) {
        if (!inp.checkValidity()) { inp.reportValidity(); return; }
      }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Even bezig…'; }
      if (errBox) errBox.textContent = '';
      wrap.classList.remove('is-error');
      const fd = new FormData(form);
      const result = await submitLead({
        source: 'landing_page',
        landing_division: 'ab_dakwerken',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email: (fd.get('email') as string) || '',
        phone: (fd.get('phone') as string) || undefined,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: 'ab_dakwerken',
        aanvullende_info: (fd.get('aanvullende_info') as string) || undefined,
        bron_lead: 'ads:dakwerken',
      });
      if (result.ok) {
        wrap.classList.add('is-success');
      } else {
        wrap.classList.add('is-error');
        if (errBox) errBox.textContent = 'Er ging iets mis. Bel ons gerust op +32 470 63 44 13.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag dakinspectie aan'; }
      }
    };
    form?.addEventListener('submit', onSubmit);

    return () => {
      document.body.className = prev;
      style.remove();
      io.disconnect();
      form?.removeEventListener('submit', onSubmit);
      document.removeEventListener('click', onAnchor);
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
