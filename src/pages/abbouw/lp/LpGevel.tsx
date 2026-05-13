import { useEffect } from 'react';
import { LP_STYLE, lpStickyBar, lpTrustFoot } from './_lp-shell';
import { submitLead } from '@/lib/leads';

// Assets — hergebruik bestaande gevel foto's
import heroBg from '@/assets/gevel/witte-crepi.jpg';
import imgBenefits from '@/assets/gevel/grijze-crepi.jpg';
import imgProcess from '@/assets/gevel/stelling.jpg';
import g1 from '@/assets/gevel/witte-crepi.jpg';
import g2 from '@/assets/gevel/grijze-crepi.jpg';
import g3 from '@/assets/gevel/steenstrips.jpg';
import g4 from '@/assets/gevel/sierpleister.jpg';
import expertImg from '@/assets/home/team2.jpg';

const HTML = `
<section class="lp-hero">
  <div class="lp-hero-bg"><img src="${heroBg}" alt="Gevelrenovatie Vlaanderen" /></div>
  <div class="lp-hero-wrap">
    <span class="lp-hero-tag">AB Gevelbekleding · Willebroek</span>
    <h1><em>Nieuwe gevel.</em>Lagere energiefactuur.<br/>Hogere woningwaarde.</h1>
    <p class="lp-hero-lede">Crepi, steenstrips en sierpleister — met of zonder buitenisolatie (ETICS). Gratis plaatsbezoek in Mechelen, Antwerpen, Lier en heel Vlaanderen. Premiedossier €30-45/m² inbegrepen, 10 jaar garantie op waterdichtheid.</p>
    <div class="lp-hero-actions">
      <a href="#lp-form" class="lp-btn-primary" data-lp-smooth>
        Gratis gevel-advies aanvragen
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
      <div><strong>EPC-sprong</strong> tot 120 punten</div>
    </div>
  </div>
</section>

<section class="lp-stats">
  <div class="lp-stats-grid">
    <div class="lp-stat lp-reveal"><div class="lp-stat-num">63.112 m²</div><div class="lp-stat-label">Afgewerkte gevels sinds 2010</div></div>
    <div class="lp-stat lp-reveal"><div class="lp-stat-num">€5.400</div><div class="lp-stat-label">Premie gem. rijwoning (ETICS)</div></div>
    <div class="lp-stat lp-reveal"><div class="lp-stat-num">30%</div><div class="lp-stat-label">Minder warmteverlies via gevel</div></div>
    <div class="lp-stat lp-reveal"><div class="lp-stat-num">€8K-15K</div><div class="lp-stat-label">Meerwaarde bij verkoop</div></div>
  </div>
</section>

<section class="lp-section">
  <div class="lp-section-wrap">
    <div class="lp-benefits">
      <div class="lp-reveal">
        <span class="lp-eyebrow">Waarom gevelrenovatie loont</span>
        <h2>Meer dan een <em>verfje</em> — uw gevel is uw woningschil.</h2>
        <p class="lp-section-lede">Een oude, niet-geïsoleerde gevel verliest tot 30% van uw verwarming. Gevelisolatie (ETICS) brengt uw woning meteen op label C of B en geeft u tot €45/m² premie in 2026.</p>
        <ul class="lp-benefits-list">
          <li><span><strong>Lagere energiefactuur</strong>Tot 25% besparing op jaarverwarming na ETICS</span></li>
          <li><span><strong>EPC-label sprong</strong>Gemiddeld 80-120 punten beter, vereist voor renovatieplicht 2028</span></li>
          <li><span><strong>Meer wooncomfort</strong>Geen koude buitenmuren meer in winter</span></li>
          <li><span><strong>Vastgoedwaarde +5-8%</strong>€8.000 – €15.000 meerwaarde bij verkoop</span></li>
        </ul>
        <a href="#lp-form" class="lp-btn-primary" data-lp-smooth>Vraag uw plaatsbezoek aan</a>
      </div>
      <div class="lp-benefits-visual lp-reveal">
        <img src="${imgBenefits}" alt="Gevelrenovatie in grijze crepi met buitenisolatie" loading="lazy" />
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
        <h4>Renovatieplicht 2028</h4>
        <p>Vanaf 2028 moet elke verkochte woning binnen 5 jaar op label C. Wie nu de gevel doet, voldoet automatisch. Wachten tot 2027 = krappe planning + hogere aannemersprijs door piekvraag.</p>
      </div>
      <div class="lp-urgency-card lp-reveal">
        <div class="lp-urgency-num">02</div>
        <h4>Premies dalen jaarlijks</h4>
        <p>Mijn VerbouwPremie staat in 2026 op €30-45/m² buitenisolatie. Op een gevel van 120 m² is dat €3.600-€5.400 cash terug. Bedragen dalen in 2027 en 2028.</p>
      </div>
      <div class="lp-urgency-card lp-reveal">
        <div class="lp-urgency-num">03</div>
        <h4>Klaar voor de winter</h4>
        <p>Een gevel renoveren tussen april en oktober gaat sneller en droogt beter. Wachten tot najaar = stelling die in regen blijft staan, langere uitvoering.</p>
      </div>
    </div>
  </div>
</section>

<section class="lp-section">
  <div class="lp-section-wrap">
    <div class="lp-process">
      <div class="lp-process-img lp-reveal">
        <img src="${imgProcess}" alt="Stelling opgebouwd voor gevelrenovatie" loading="lazy" />
      </div>
      <div class="lp-reveal">
        <span class="lp-eyebrow">Snelle start, vlotte afwerking</span>
        <h2>Van plaatsbezoek tot <em>nieuwe gevel</em> in 6 weken.</h2>
        <p class="lp-section-lede">Eigen plaatsers, eigen stelling, eigen premiebehandelaar. Geen onderaannemers tussen u en het resultaat.</p>
        <div class="lp-process-points">
          <div class="lp-process-point">
            <div class="lp-process-point-num">01</div>
            <div class="lp-process-point-body"><strong>Gratis plaatsbezoek (week 1)</strong><p>Binnen 5 werkdagen langs voor opname, U-waarde berekening en eerste richtprijs incl. premie.</p></div>
          </div>
          <div class="lp-process-point">
            <div class="lp-process-point-num">02</div>
            <div class="lp-process-point-body"><strong>Offerte + kleurkeuze (week 2)</strong><p>Bindende offerte, kleurstaal-staal ter plaatse, premiedossier voorbereid voor uw burgerprofiel.</p></div>
          </div>
          <div class="lp-process-point">
            <div class="lp-process-point-num">03</div>
            <div class="lp-process-point-body"><strong>Uitvoering (week 3-6)</strong><p>Stelling 2 dagen, isolatie kleven 3-4 dagen, wapenen 2 dagen, crepi-afwerking 4-5 dagen. Weersafhankelijk.</p></div>
          </div>
          <div class="lp-process-point">
            <div class="lp-process-point-num">04</div>
            <div class="lp-process-point-body"><strong>Oplevering + 10 jaar garantie</strong><p>Eindcontrole samen met u, premie ingediend bij VEA, garantieattest in mailbox.</p></div>
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
      <h2>Gevels die <em>tijdloos</em> mooi blijven.</h2>
      <p class="lp-section-lede">Crepi, steenstrips, sierpleister en houten gevelbekleding — vier looks, één manier van werken: vakkundig en strak afgewerkt.</p>
    </div>
    <div class="lp-gallery">
      <a href="#lp-form" class="lp-gallery-cell lp-reveal" data-lp-smooth>
        <img src="${g1}" alt="Witte crepi gevel modern rijwoning Mechelen" loading="lazy" />
        <div class="lp-gallery-cap"><small>Crepi</small><strong>Witte crepi — Mechelen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell lp-reveal" data-lp-smooth>
        <img src="${g2}" alt="Grijze crepi halfopen woning Antwerpen" loading="lazy" />
        <div class="lp-gallery-cap"><small>Crepi + ETICS</small><strong>Grijze crepi — Antwerpen</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell lp-reveal" data-lp-smooth>
        <img src="${g3}" alt="Steenstrips moderne villa Lier" loading="lazy" />
        <div class="lp-gallery-cap"><small>Steenstrips</small><strong>Genuanceerde steen — Lier</strong></div>
      </a>
      <a href="#lp-form" class="lp-gallery-cell lp-reveal" data-lp-smooth>
        <img src="${g4}" alt="Sierpleister decoratieve afwerking Bornem" loading="lazy" />
        <div class="lp-gallery-cap"><small>Sierpleister</small><strong>Marmorino — Bornem</strong></div>
      </a>
    </div>
  </div>
</section>

<section class="lp-section">
  <div class="lp-section-wrap">
    <div class="lp-expert">
      <div class="lp-expert-img lp-reveal">
        <img src="${expertImg}" alt="Bardh, gevelrenovatie projectleider AB Bouw Groep" loading="lazy" />
      </div>
      <div class="lp-reveal">
        <span class="lp-eyebrow">Direct advies</span>
        <p class="lp-expert-quote">"Voordat we praten over kleur of materiaal: eerst meten wat er ÉCHT moet. Soms volstaat een verfbeurt. Soms is ETICS de enige juiste keuze. Wij zeggen u eerlijk welk."</p>
        <div class="lp-expert-name">Bardh</div>
        <div class="lp-expert-role">Projectleider Gevelrenovatie · AB Bouw Groep</div>
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
      <h2 style="margin: 0 auto;">23 vakmensen, <em>500+ gevels</em>, één manier van werken.</h2>
    </div>
    <div class="lp-reviews-grid">
      <div class="lp-review-card lp-reveal">
        <div class="lp-review-stars">★★★★★</div>
        <p class="lp-review-text">"ETICS-isolatie met witte crepi laten plaatsen op de halfopen. EPC sprong van label E naar B. Verwarmingsfactuur dit jaar 28% lager. Premie van €4.800 gekregen zoals beloofd."</p>
        <div class="lp-review-author">
          <div class="lp-review-author-avatar">SD</div>
          <div class="lp-review-author-info"><strong>Sofie D.</strong><span>Mechelen</span></div>
        </div>
      </div>
      <div class="lp-review-card lp-reveal">
        <div class="lp-review-stars">★★★★★</div>
        <p class="lp-review-text">"Steenstrips op de voorgevel laten plaatsen omdat we de baksteen-look wilden behouden. Plaatsing was nauwkeurig, geen scheve voegen, perfecte aansluitingen rond ramen. Echt vakwerk."</p>
        <div class="lp-review-author">
          <div class="lp-review-author-avatar">FL</div>
          <div class="lp-review-author-info"><strong>Filip L.</strong><span>Lier</span></div>
        </div>
      </div>
      <div class="lp-review-card lp-reveal">
        <div class="lp-review-stars">★★★★★</div>
        <p class="lp-review-text">"Stelling stond binnen 1 dag, 4 weken later was het klaar. Geen verrassingen op de eindfactuur, premiedossier hebben ze volledig zelf opgesteld. Aanrader."</p>
        <div class="lp-review-author">
          <div class="lp-review-author-avatar">AN</div>
          <div class="lp-review-author-info"><strong>Ana N.</strong><span>Antwerpen</span></div>
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
      <details><summary>Wat kost gevelrenovatie in 2026?</summary><p>Crepi op bestaande gezonde gevel: €45-€60/m². Crepi + ETICS-buitenisolatie: €110-€150/m². Steenstrips: €120-€180/m². Houten gevelbekleding (lariks/thermowood): €60-€140/m². Stelling huur reken €1.800-€3.200 apart bij rijwoning. Premies €30-€45/m² halen een flink stuk van die factuur af.</p></details>
      <details><summary>Wat is ETICS en heb ik dat nodig?</summary><p>ETICS = External Thermal Insulation Composite System: een gelaagd systeem van isolatieplaat + wapeningsnet + crepi-afwerking. Voor woningen vóór 1995 zonder isolerende spouw is dit bijna altijd de juiste keuze. R-waarde 4,5+, EPC-sprong van 80-120 punten. Voor woningen met goede spouwisolatie volstaat soms enkel crepi.</p></details>
      <details><summary>Doen jullie de premieaanvraag voor mij?</summary><p>Ja, standaard. We bereiden Mijn VerbouwPremie-dossier voor met alle foto's, facturen en U-waarde-berekeningen in het juiste format. U deelt enkel uw burgerprofiel-login, wij dienen het dossier in, u krijgt het ontvangstbewijs binnen 2 weken.</p></details>
      <details><summary>Hoeveel meerwaarde geeft een gevelrenovatie?</summary><p>Vlaamse vastgoedmakelaars (Q1 2026) rapporteren €8.000-€15.000 meerwaarde voor een rijwoning met geïsoleerde + opnieuw afgewerkte gevel. Plus: woningen met label C of beter verkopen 5-7 weken sneller dan label E/F.</p></details>
      <details><summary>Welke kleur is het meest gevraagd?</summary><p>Top 3 in 2026: gebroken wit (RAL 9001), licht-warmgrijs (NCS S 2000-N), taupe-beige. Helder gekleurde gevels (geel, rood, blauw) vragen UV-stabiele pigmenten en kosten €4-€6/m² meer. We brengen kleurstalen mee naar het plaatsbezoek.</p></details>
      <details><summary>Welke regio's bedienen jullie?</summary><p>Vanuit Willebroek: Antwerpen, Mechelen, Lier, Boom, Bornem, Puurs, Sint-Niklaas, Heist-op-den-Berg, Brussel, Vilvoorde, Asse, Aalst, Dendermonde, Leuven. Voor grote projecten (villa €250k+) ook daarbuiten.</p></details>
    </div>
  </div>
</section>

<section class="lp-section lp-form-section" id="lp-form">
  <div class="lp-section-wrap">
    <div class="lp-form-grid">
      <div class="lp-form-side lp-reveal">
        <span class="lp-eyebrow">Gratis gevel-advies</span>
        <h2>Vraag uw <em>plaatsbezoek</em> aan.</h2>
        <p>Binnen 5 werkdagen langs voor opname, U-waarde berekening en kleurstalen ter plaatse. Vrijblijvend, gratis, geen verkoopgesprek.</p>
        <ul>
          <li>Plaatsbezoek binnen 5 werkdagen</li>
          <li>Bindende offerte met kleurstaal</li>
          <li>Premiedossier inbegrepen (gemiddeld €4.500+ terug)</li>
          <li>10 jaar garantie op waterdichtheid</li>
          <li>Eigen plaatsers, eigen stelling</li>
        </ul>
      </div>
      <div class="lp-form-card lp-reveal" data-lp-form-wrapper>
        <h3>Plan uw gevel-advies</h3>
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
          <textarea name="aanvullende_info" placeholder="Vertel kort over uw gevel (type woning, bouwjaar, wens)"></textarea>
          <button type="submit" data-lp-submit>Vraag gevel-advies aan</button>
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

export default function LpGevel() {
  useEffect(() => {
    document.title = "Gevelrenovatie Mechelen, Antwerpen & Vlaanderen — Gratis gevel-advies | AB Bouw Groep";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Gevelrenovatie in Mechelen, Antwerpen, Lier en heel Vlaanderen. Crepi, steenstrips, ETICS-isolatie. Premie €30-45/m², 10 jaar garantie. Gratis plaatsbezoek binnen 5 werkdagen.');

    const prev = document.body.className;
    document.body.className = 'lp-page';
    const style = document.createElement('style');
    style.textContent = LP_STYLE;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

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

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll<HTMLElement>('.lp-reveal').forEach((el) => io.observe(el));

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
        landing_division: 'ab_gevelbekleding',
        page_path: window.location.pathname,
        firstName: (fd.get('firstName') as string) || undefined,
        lastName: (fd.get('lastName') as string) || undefined,
        email: (fd.get('email') as string) || '',
        phone: (fd.get('phone') as string) || undefined,
        straat: (fd.get('straat') as string) || undefined,
        postcode: (fd.get('postcode') as string) || undefined,
        gemeente: (fd.get('gemeente') as string) || undefined,
        type_werk: 'ab_gevelbekleding',
        aanvullende_info: (fd.get('aanvullende_info') as string) || undefined,
        bron_lead: 'ads:gevel',
      });
      if (result.ok) {
        wrap.classList.add('is-success');
      } else {
        wrap.classList.add('is-error');
        if (errBox) errBox.textContent = 'Er ging iets mis. Bel ons gerust op +32 470 63 44 13.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Vraag gevel-advies aan'; }
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
