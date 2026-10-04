import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '@/styles/roofpro.css';
import { CONTACT } from '@/data/contact';
import { ic, LOGO } from './_rp';

/**
 * Bedankpagina na elke aanvraag: abgroep.be/bedankt.
 *
 * Mohammed, 1 okt 2026: "bedankt pagina gewoon verbeteren, simpele bedanktpagina,
 * en praktische zaken", "ipv wat er nu is". Zelfde opbouw als /afspraak: logo,
 * kop in het midden, één zin, dan alleen wat de klant nu kan doen. Geen menu,
 * geen footer.
 *
 * Elke zin heeft een bron:
 * - de bevestigings-sms: GHL W01b stuurt na elke aanvraag een sms (K1a, K1b,
 *   K1c of K1 Standaard);
 * - "zo snel mogelijk": de woorden van die sms'en, zonder termijn;
 * - zelf een moment kiezen: /dakinspectie en /afspraak boeken in de GHL-kalender
 *   (dezelfde links als in K1c en K1 Standaard);
 * - telefoon en mail: src/data/contact.ts.
 * Wat hier eerder stond (fase-termijnen, "binnen het uur een bevestigingsmail",
 * zekerheden en 9 reviews met naam die niet op AB's Google-profiel staan) had
 * geen bron en is weg.
 *
 * ?dienst= komt van de rekenaars en de chat, ?service= van de oude calculators.
 */
type Soort = 'dakinspectie' | 'plaatsbezoek' | 'richtprijs-dak';

const AFSPRAAK: Record<Exclude<Soort, 'richtprijs-dak'>, { link: string; zin: string }> = {
  dakinspectie: { link: '/dakinspectie', zin: 'Plan uw gratis dakinspectie meteen in onze agenda.' },
  plaatsbezoek: { link: '/afspraak', zin: 'Plan uw plaatsbezoek meteen in onze agenda.' },
};

const vink = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
const sms = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
const agenda = ic.cal.replace('width="15" height="15"', 'width="20" height="20"');
const vraag = ic.phone(20);

/* 4 okt, Mohammed, na de dak-rekenaar: "Uw prijsaanvraag is ontvangen en we sturen zo snel
   mogelijk een vrijblijvende richtprijs", "elk dak is uniek. Om een definitieve prijs op te stellen
   komt onze dakexpert graag de exacte staat van het dak opmeten", dan "plan uw gratis dakinspectie"
   met de knop "krijg mijn gratis dakinspectie"; "dit is het eigenlijk". Het aantal vrije
   inspectiemomenten staat er niet bij: Bardhs agenda toont nu 8 vrije uren per werkdag. */
const HTML_RICHTPRIJS_DAK = `<div class="rp rp-afs">
<header class="rp-afs__kop">
  <a href="/" aria-label="AB Bouw Groep"><img src="${LOGO}" alt="AB Bouw Groep" width="150" /></a>
</header>

<main class="rp-afs__main rp-bed">
  <div class="rp-bed__vink">${vink}</div>
  <h1 class="rp-afs__t">Uw prijsaanvraag is ontvangen</h1>
  <p class="rp-afs__lede">We sturen u zo snel mogelijk een vrijblijvende richtprijs.</p>

  <div class="rp-bed__kaart">
    <p class="rp-bed__uniek">Elk dak is uniek. Om een definitieve prijs op te stellen, komt onze dakexpert graag de exacte staat van het dak opmeten.</p>
    <h2 class="rp-bed__cta-t">Plan uw gratis dakinspectie</h2>
    <a class="rp-btn rp-btn--primary rp-bed__cta" href="/dakinspectie">Krijg mijn gratis dakinspectie</a>
  </div>
</main>
</div>`;

const HTML = (soort: Soort) => {
  if (soort === 'richtprijs-dak') return HTML_RICHTPRIJS_DAK;
  const a = AFSPRAAK[soort];
  return `<div class="rp rp-afs">
<header class="rp-afs__kop">
  <a href="/" aria-label="AB Bouw Groep"><img src="${LOGO}" alt="AB Bouw Groep" width="150" /></a>
</header>

<main class="rp-afs__main rp-bed">
  <div class="rp-bed__vink">${vink}</div>
  <h1 class="rp-afs__t">Bedankt, uw aanvraag is binnen</h1>
  <p class="rp-afs__lede">Wij bekijken uw aanvraag en nemen zo snel mogelijk contact met u op.</p>

  <ul class="rp-bed__lijst">
    <li>
      <span class="rp-bed__ic">${sms}</span>
      <div>
        <p class="rp-bed__t">Bevestiging per sms</p>
        <p class="rp-bed__d">U krijgt meteen een sms van AB Bouw Groep op het nummer dat u invulde.</p>
      </div>
    </li>
    <li>
      <span class="rp-bed__ic">${agenda}</span>
      <div>
        <p class="rp-bed__t">Liever zelf een moment kiezen?</p>
        <p class="rp-bed__d">${a.zin}</p>
        <a class="rp-btn rp-btn--primary rp-bed__knop" href="${a.link}">Kies een moment</a>
      </div>
    </li>
    <li>
      <span class="rp-bed__ic">${vraag}</span>
      <div>
        <p class="rp-bed__t">Een vraag of iets vergeten?</p>
        <p class="rp-bed__d">Bel <a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a> of mail naar <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.</p>
      </div>
    </li>
  </ul>

  <a class="rp-bed__terug" href="/">Terug naar de website</a>
</main>
</div>`;
};

const STIJL = `
.rp-afs { min-height: 100vh; background: var(--rp-bg-soft); }
.rp-afs__kop { display: flex; justify-content: center; padding: 28px 16px 8px; }
.rp-afs__kop img { display: block; height: auto; }
.rp-afs__main { max-width: 880px; margin: 0 auto; padding: 24px 16px 56px; text-align: center; }
.rp-afs__t { font-size: clamp(30px, 5vw, 46px); line-height: 1.1; margin: 0; }
.rp-afs__lede { max-width: 560px; margin: 14px auto 32px; font-size: 17px; line-height: 1.55; text-wrap: balance; }
.rp-bed { max-width: 600px; }
.rp-bed__vink { width: 64px; height: 64px; margin: 0 auto 20px; border-radius: 50%; display: grid; place-items: center;
  background: var(--rp-accent); color: var(--rp-accent-ink); }
.rp-bed__lijst { list-style: none; margin: 0; padding: 0; background: #fff; border: 1px solid var(--rp-line-soft); border-radius: 14px; text-align: left; }
.rp-bed__lijst li { display: flex; gap: 16px; padding: 22px; }
.rp-bed__lijst li + li { border-top: 1px solid var(--rp-line-soft); }
.rp-bed__ic { flex: none; width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center;
  background: var(--rp-accent-tint); color: var(--rp-accent-text); }
.rp-bed__t { margin: 0; font-weight: 700; font-size: 17px; line-height: 1.3; color: var(--rp-ink); }
.rp-bed__d { margin: 4px 0 0; font-size: 15.5px; line-height: 1.5; }
.rp-bed__d a { color: var(--rp-ink); font-weight: 600; white-space: nowrap; }
.rp-bed__knop { margin-top: 14px; }
.rp-bed__terug { display: inline-block; margin-top: 26px; font-weight: 600; color: var(--rp-ink); }
.rp-bed__kaart { background: #fff; border: 1px solid var(--rp-line-soft); border-radius: 14px; padding: 28px 26px; }
.rp-bed__uniek { margin: 0; font-size: 17px; line-height: 1.55; color: var(--rp-ink); text-wrap: pretty; }
.rp-bed__cta-t { margin: 22px 0 14px; font-size: 22px; line-height: 1.25; }
.rp-bed__cta { justify-content: center; }
@media (max-width: 640px) {
  .rp-afs__kop img { width: 120px; }
  .rp-bed__lijst { border-radius: 10px; }
  .rp-bed__lijst li { padding: 18px 16px; gap: 14px; }
  .rp-bed__knop { width: 100%; justify-content: center; }
  .rp-bed__kaart { padding: 22px 18px; border-radius: 10px; }
  .rp-bed__uniek { font-size: 16px; }
  .rp-bed__cta-t { font-size: 20px; }
  .rp-bed__cta { width: 100%; }
}
`;

export default function Bedankt() {
  const [params] = useSearchParams();
  const ruw = (params.get('dienst') || params.get('service') || '').toLowerCase();
  const soort: Soort = ruw.includes('dak') ? (params.get('van') === 'rekenaar' ? 'richtprijs-dak' : 'dakinspectie') : 'plaatsbezoek';

  useEffect(() => {
    document.title = 'Bedankt voor uw aanvraag · AB Bouw Groep';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{STIJL}</style>
      <div dangerouslySetInnerHTML={{ __html: HTML(soort) }} />
    </>
  );
}
