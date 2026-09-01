/* Gedeelde chrome van het v6-designsysteem (RoofPro-replica): iconen, nav, footer, FAB.
   Elke pagina die dit gebruikt moet '@/styles/roofpro.css' importeren en zijn inhoud
   in een <div class="rp"> zetten. */
import { CONTACT } from '@/data/contact';
import logoTrim from '@/assets/home/logo-trim.png';

import { REPLICA_CSS } from './lp/replica/stijl';

export const LOGO = logoTrim;

export const ic = {
  /* Iconen in de PrimeCraft-maat, alleen voor de kop. Letterlijk dezelfde
     paden en maten als IcPin, IcMail en IcTelefoon in lp/replica/Iconen.tsx.
     Met de RoofPro-varianten (17x17, lijndikte 2) stond de contactrij op de
     binnenpaginas 2px lager en 7px breder dan op de homepage. */
  pinKop: '<svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 5.9c0 3.3-4.5 7.1-4.5 7.1S1.5 9.2 1.5 5.9a4.5 4.5 0 0 1 9 0Z"/><circle cx="6" cy="5.8" r="1.7"/></svg>',
  mailKop: '<svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="1.4" width="13" height="10.2" rx="1.8"/><path d="m1.6 2.6 5.9 4.2 5.9-4.2"/></svg>',
  telKop: '<svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true"><path d="M7.4 3.1c.4-.3 1-.2 1.3.2l1.8 2.6c.3.4.2.9-.1 1.2l-1.1 1c-.2.2-.3.5-.2.8.5 1.4 1.9 3.2 3.6 4.3.3.2.6.1.8-.1l1-1c.3-.3.8-.4 1.2-.2l2.7 1.6c.5.3.6.9.3 1.3l-1.2 1.6c-.5.7-1.4 1-2.2.8-2.2-.6-4.6-2.2-6.4-4.1C7 11 5.6 8.7 5.1 6.6c-.2-.8.1-1.6.8-2.1l1.5-1.4Z"/></svg>',
  /* De chevron van de PrimeCraft-kop is 10x6, de RoofPro-versie 14x14. Dat
     verschil maakte de navigatiebalk 2px hoger en schoof elke link erna 9px
     op, waardoor de kop op de binnenpaginas niet gelijk stond aan die op de
     homepage. Deze wordt alleen in de kop gebruikt. */
  chevKop: '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1 1 4 4 4-4"/></svg>',
  chev: '<svg class="rp-nav__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
  phone: (s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  pin: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  arrowUpRight: (s = 14) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`,
  star: (s = 15) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>`,
  google: '<svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 7 8.9 4.8 12 4.8z"/></svg>',
  cal: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  user: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  plus: '<svg class="rp-faq__ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  mark: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 2h9v9H2z"/><path d="M13 13h9v9h-9z"/><path d="M13 2h9v9h-9z" opacity=".45"/></svg>',
  burger: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  left: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
  right: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
};

/** Zichtbare plek voor een foto die nog moet komen. `hoogte` in px of een
 *  CSS-waarde, `maat` = de gewenste verhouding/resolutie. */
export const fotoPlaats = (opts: { titel: string; toelichting: string; maat: string; hoogte?: string }) => `
<div class="rp-ph" style="min-height:${opts.hoogte || '260px'}" role="img" aria-label="Plek voor foto: ${opts.titel}">
  <div>
    <div class="rp-ph__ic" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 0 1 2-2h2l1.4-2h7.2L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/></svg></div>
    <div class="rp-ph__t">${opts.titel}</div>
    <div class="rp-ph__d">${opts.toelichting}</div>
    <span class="rp-ph__maat">${opts.maat}</span>
  </div>
</div>`;

export const DIENST_LINKS = [
  { t: 'Dakwerken', href: '/dakwerken' },
  { t: 'Gevelrenovatie', href: '/gevel' },
  { t: 'Badkamer en wellness', href: '/bad' },
  { t: 'Interieurwerken', href: '/interieur' },
  { t: 'Totaalrenovatie en nieuwbouw', href: '/construct' },
  { t: 'Ecologisch bouwen', href: '/ecologisch' },
];

const NAV_LINKS = [
  { t: 'Over ons', href: '/over' },
  { t: 'Diensten', href: '/diensten', sub: DIENST_LINKS },
  { t: 'Werkwijze', href: '/werkwijze' },
  { t: 'Contact', href: '/contact' },
];

/** actief = het href van de huidige pagina, bv. '/blog' */
/**
 * De kop, in de PrimeCraft-vorm.
 *
 * De opbouw komt van de landingspagina: contactrij boven, logo links,
 * navigatie en offerteknop in het midden, telefoonblok rechts. Alleen de kop
 * en de voet staan in een .pcx-schil; de secties daartussen houden hun eigen
 * regels. Dat is met opzet, want .pcx zet color op inherit voor alles wat
 * eronder valt en dat zou de donkere secties van de pagina leegtrekken.
 *
 * Het mobiele menu houdt zijn bestaande knoppen en data-attributen, zodat
 * wireMobielMenu ongewijzigd blijft werken.
 */
export const rpNav = (actief: string) => `
<style>${REPLICA_CSS}</style>
<div class="pcx pc-chrome">
<header class="pc-kop">
  <div class="pc-vat pc-kop-vat">
    <div class="pc-kop-logo">
      <a href="/" aria-label="AB Bouw Groep, naar de startpagina"><img src="${LOGO}" alt="AB Bouw Groep" width="147" height="42" decoding="async"/></a>
    </div>
    <div class="pc-kop-streep"></div>
    <div class="pc-kop-midden">
      <div class="pc-kop-rij1">
        <div class="pc-kop-contact">
          <span>${ic.pinKop}${CONTACT.address.street}, ${CONTACT.address.city}</span>
          <span>${ic.mailKop}<a href="mailto:${CONTACT.email}">${CONTACT.email}</a></span>
        </div>
      </div>
      <div class="pc-kop-rij2">
        <nav class="pc-nav" aria-label="Hoofdmenu">
          ${NAV_LINKS.map((l) => l.sub
            ? `<span class="rp-dd">
                 <a href="${l.href}"${l.href === actief ? ' aria-current="page"' : ''}>${l.t}${ic.chevKop}</a>
                 <span class="rp-dd__panel">${l.sub.map((x) => `<a class="rp-dd__item" href="${x.href}">${x.t}</a>`).join('')}</span>
               </span>`
            : `<a href="${l.href}"${l.href === actief ? ' aria-current="page"' : ''}>${l.t}</a>`).join('')}
        </nav>
        <a class="pc-knop pc-knop--donker pc-kop-offerte" href="/contact">Gratis offerte</a>
      </div>
    </div>
    <div class="pc-kop-streep"></div>
    <div class="pc-kop-tel">
      <span class="pc-teltegel">${ic.telKop}</span>
      <span class="pc-telblok">
        <span class="pc-tellabel">Bel ons vandaag</span>
        <a class="pc-telnr" href="${CONTACT.phone.href}">${CONTACT.phone.display}</a>
      </span>
    </div>
    <button class="rp-burger" type="button" data-mob-open aria-label="Menu openen" aria-expanded="false" aria-controls="rp-mob">${ic.burger}</button>
  </div>
</header>
</div>

<div class="rp-mob" id="rp-mob" data-mob hidden>
  <div class="rp-wrap" style="padding:0">
    <div class="rp-mob__top">
      <img src="${LOGO}" alt="AB Bouw Groep" width="126" height="36" decoding="async" style="height:36px;width:auto"/>
      <button class="rp-mob__close" type="button" data-mob-close aria-label="Menu sluiten">${ic.close}</button>
    </div>
    <nav class="rp-mob__list" aria-label="Mobiel menu">
      ${NAV_LINKS.map((l) => l.sub
        ? `<a class="rp-mob__link" href="${l.href}">${l.t}</a><div class="rp-mob__sub">${l.sub.map((x) => `<a href="${x.href}">${x.t}</a>`).join('')}</div>`
        : `<a class="rp-mob__link" href="${l.href}">${l.t}</a>`).join('')}
    </nav>
    <div class="rp-mob__cta">
      <a class="rp-btn rp-btn--primary rp-btn--block" href="${CONTACT.phone.href}">${ic.phone(17)} ${CONTACT.phone.display}</a>
      <a class="rp-btn rp-btn--ghost rp-btn--block" href="/contact">Vraag een offerte</a>
    </div>
  </div>
</div>`;

/**
 * De voet, in de PrimeCraft-vorm. Vier kolommen, dan een lijn en de
 * onderregel. De openingsuren stonden hier eerder bij; die zijn een aanname
 * die nooit bevestigd is en staan daarom niet in deze versie.
 */
export const rpFooter = () => `
<div class="pcx pc-chrome">
<footer class="pc-footer">
  <div class="pc-vat">
    <div class="pc-footer-grid">
      <div>
        <div class="pc-footer-logo"><a href="/"><img src="${LOGO}" alt="AB Bouw Groep" loading="lazy" decoding="async"/></a></div>
        <p>Bouw en renovatie voor dak, gevel, badkamer en interieur. Actief in Vlaanderen en Brussel.</p>
      </div>
      <div>
        <h3>Snel naar</h3>
        <nav class="pc-footer-links">
          <a href="/over">Over ons</a>
          <a href="/werkwijze">Werkwijze</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
      <div>
        <h3>Onze diensten</h3>
        <nav class="pc-footer-links">${DIENST_LINKS.map((x) => `<a href="${x.href}">${x.t}</a>`).join('')}</nav>
      </div>
      <div>
        <h3>Contact</h3>
        <div class="pc-footer-contact">
          <span>${ic.phone(17)}<a href="${CONTACT.phone.href}">${CONTACT.phone.display}</a></span>
          <span>${ic.pin}<span>${CONTACT.address.street},<br/>${CONTACT.address.postcode} ${CONTACT.address.city}</span></span>
          <span>${ic.mail}<a href="mailto:${CONTACT.email}">${CONTACT.email}</a></span>
        </div>
      </div>
    </div>
    <div class="pc-footer-lijn"></div>
    <div class="pc-footer-onder">
      <span>&copy; ${new Date().getFullYear()} AB Bouw Groep. Alle rechten voorbehouden.</span>
      <span><a href="/privacy">Privacy</a> &middot; <a href="/voorwaarden">Voorwaarden</a> &middot; <a href="/cookies">Cookies</a></span>
    </div>
  </div>
</footer>
</div>

<a class="rp-fab" href="${CONTACT.phone.href}" aria-label="Bel AB Bouw Groep">${ic.phone(22)}</a>`;

/** Mobiel menu open/dicht. Geeft een opruimfunctie terug. */
export function wireMobielMenu(): () => void {
  const mob = document.querySelector<HTMLElement>('[data-mob]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-mob-open]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-mob-close]');
  const zet = (open: boolean) => {
    if (!mob) return;
    mob.classList.toggle('is-open', open);
    mob.hidden = !open;
    openBtn?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  const onOpen = () => zet(true);
  const onClose = () => zet(false);
  const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') zet(false); };
  openBtn?.addEventListener('click', onOpen);
  closeBtn?.addEventListener('click', onClose);
  document.addEventListener('keydown', onEsc);
  mob?.querySelectorAll('a').forEach((a) => a.addEventListener('click', onClose));
  return () => {
    openBtn?.removeEventListener('click', onOpen);
    closeBtn?.removeEventListener('click', onClose);
    document.removeEventListener('keydown', onEsc);
    document.body.style.overflow = '';
  };
}
