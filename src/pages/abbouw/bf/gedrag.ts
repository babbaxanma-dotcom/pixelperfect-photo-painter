/**
 * Gedrag van de BF-pagina's (spec/bf-stijl.md §4 gedrag, §8 formulier).
 * Port van bfbouw-website/src/js/site.js (zie bf-js.md) met bf-klassen, als één
 * functie die alles aanzet en één opruimfunctie teruggeeft: elke listener,
 * interval, timeout en observer wordt bij het verlaten van de pagina weer
 * weggehaald (SPA: de pagina's blijven anders in de achtergrond draaien).
 *
 * Bewust NIET overgenomen (lock 3 aug): scroll-reveal, hero-parallax, optellende cijfers.
 */
import { CONTACT } from '@/data/contact';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { werkKey } from './blokken';

export type BfOpties = {
  /** react-router navigate: interne links en de bedankpagina zonder herladen */
  navigate: (pad: string) => void;
  /** sleutel van de pagina (bron_lead, trackFormStart), bv. 'home' */
  bron: string;
};

export function wireBf(root: HTMLElement, opties: BfOpties): () => void {
  const opruim: (() => void)[] = [];
  let opgeruimd = false;
  const op = (doel: EventTarget, type: string, fn: EventListenerOrEventListenerObject, o?: AddEventListenerOptions | boolean) => {
    doel.addEventListener(type, fn, o);
    opruim.push(() => doel.removeEventListener(type, fn, o));
  };
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); opruim.push(() => window.clearTimeout(id)); return id; };
  const elke = (fn: () => void, ms: number) => { const id = window.setInterval(fn, ms); opruim.push(() => window.clearInterval(id)); };
  const stil = !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const zacht: ScrollBehavior = stil ? 'auto' : 'smooth';
  const alle = <T extends Element = HTMLElement>(sel: string, binnen: ParentNode = root) => Array.from(binnen.querySelectorAll<T>(sel) as NodeListOf<T>);

  /* 1. kop: transparant over de hero, wit zodra er 24 px gescrold is (site.js r.7-8) */
  const kop = root.querySelector<HTMLElement>('.bf-kop--over');
  if (kop) {
    const schakel = () => kop.classList.toggle('bf-is-gescrold', window.scrollY > 24);
    schakel();
    op(window, 'scroll', schakel, { passive: true });
  }

  /* 2. hero-carrousel: om de 6 s overvloeien (1,4 s in CSS); uit bij reduced motion en ?shoot=1 (site.js r.11-18) */
  const heroBox = root.querySelector('[data-hero]');
  if (heroBox && !stil && !/[?&]shoot=1/.test(location.search)) {
    const dias = alle('.bf-hero__beeld', heroBox);
    if (dias.length > 1) {
      let i = 0;
      elke(() => {
        if (document.hidden) return;
        dias[i].classList.remove('bf-is-on'); i = (i + 1) % dias.length; dias[i].classList.add('bf-is-on');
      }, 6000);
    }
  }

  /* 3. gsm-menu (site.js r.21-26) + Escape, sluiten bij een link, scrollslot op body */
  const burger = root.querySelector<HTMLButtonElement>('.bf-nav__burger');
  const menu = root.querySelector<HTMLElement>('.bf-nav__menu');
  let menuOpen = false;
  let vorigeOverflow = '';
  const zetMenu = (open: boolean) => {
    if (!burger || open === menuOpen) return;
    menuOpen = open;
    root.classList.toggle('bf-menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    if (open) { vorigeOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    else document.body.style.overflow = vorigeOverflow;
  };
  if (burger && menu) {
    op(burger, 'click', () => zetMenu(!menuOpen));
    op(window, 'keydown', (e: KeyboardEvent) => { if (e.key === 'Escape' && menuOpen) { zetMenu(false); burger.focus(); } });
    op(menu, 'click', (e: Event) => { if ((e.target as Element).closest('a')) zetMenu(false); });
    const breed = window.matchMedia('(min-width: 1001px)');
    const dicht = () => { if (breed.matches) zetMenu(false); };
    op(breed, 'change', dicht);
    opruim.push(() => zetMenu(false));
  }

  /* 4. zwevende belknop op gsm: zichtbaar na 0,6 x schermhoogte (site.js r.355-360) */
  const bel = root.querySelector<HTMLElement>('.bf-belzweef');
  if (bel) {
    const zet = () => bel.classList.toggle('bf-is-zichtbaar', window.scrollY > window.innerHeight * 0.6);
    zet();
    op(window, 'scroll', zet, { passive: true });
  }

  /* 5. dienstenslider: start op de middelste kaart, pijlen, stippen, toetsen, muis slepen (site.js r.279-301) */
  for (const box of alle('[data-dkaarten]')) {
    const baan = box.querySelector<HTMLElement>('.bf-dkaarten__baan');
    if (!baan) continue;
    const kaarten = Array.from(baan.children) as HTMLElement[];
    const stippen = alle('.bf-dkaarten__stippen span', box);
    if (!kaarten.length) continue;
    let nu = 0;
    let vast = 0;
    const doel = (i: number) => { const kb = kaarten[i].getBoundingClientRect(), bb = baan.getBoundingClientRect(); return baan.scrollLeft + (kb.left + kb.width / 2) - (bb.left + bb.width / 2); };
    const toon = (i: number) => { stippen.forEach((s, k) => s.classList.toggle('bf-is-actief', k === i)); kaarten.forEach((c, k) => c.classList.toggle('bf-is-actief', k === i)); };
    const naar = (i: number, z: boolean) => { i = Math.max(0, Math.min(kaarten.length - 1, i)); nu = i; toon(i); vast = z ? performance.now() + 700 : 0; baan.scrollTo({ left: doel(i), behavior: z ? zacht : 'auto' }); };
    const actief = () => {
      if (performance.now() < vast) return;
      const bb = baan.getBoundingClientRect(), m = bb.left + bb.width / 2; let af = 1e9;
      kaarten.forEach((k, i) => { const kb = k.getBoundingClientRect(), d = Math.abs(kb.left + kb.width / 2 - m); if (d < af) { af = d; nu = i; } });
      toon(nu);
    };
    let rafId = 0;
    op(baan, 'scroll', () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(actief); }, { passive: true });
    opruim.push(() => cancelAnimationFrame(rafId));
    const vorige = box.querySelector('[data-dk-prev]'), volgende = box.querySelector('[data-dk-next]');
    if (vorige) op(vorige, 'click', () => naar(nu - 1, true));
    if (volgende) op(volgende, 'click', () => naar(nu + 1, true));
    op(box, 'keydown', (e: KeyboardEvent) => { if (e.key === 'ArrowRight') { e.preventDefault(); naar(nu + 1, true); } if (e.key === 'ArrowLeft') { e.preventDefault(); naar(nu - 1, true); } });
    let sleep: { x: number; l: number; bewogen: boolean } | null = null;
    op(baan, 'pointerdown', (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; sleep = { x: e.clientX, l: baan.scrollLeft, bewogen: false }; });
    op(window, 'pointermove', (e: PointerEvent) => { if (!sleep) return; const dx = e.clientX - sleep.x; if (Math.abs(dx) > 4) { sleep.bewogen = true; baan.classList.add('bf-is-slepen'); } baan.scrollLeft = sleep.l - dx; });
    op(window, 'pointerup', () => {
      if (!sleep) return;
      const was = sleep.bewogen; sleep = null; baan.classList.remove('bf-is-slepen');
      if (was) {
        const stop = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };
        baan.addEventListener('click', stop, { capture: true, once: true });
        later(() => baan.removeEventListener('click', stop, { capture: true }), 50);
        actief(); naar(nu, true);
      }
    });
    const start = () => { naar(Math.floor((kaarten.length - 1) / 2), false); actief(); };
    start();
    // opnieuw centreren zodra lettertypes en beelden de maten vastleggen (BF: window load)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!opgeruimd) start(); });
    if (document.readyState !== 'complete') op(window, 'load', start);
  }

  /* 6. realisatierail: pijlen schuiven één kaart; autoplay 4 s alleen in beeld, uit bij reduced motion en webdriver (site.js r.189-215) */
  for (const box of alle('[data-slider]')) {
    const baan = box.querySelector<HTMLElement>('.bf-rslider__baan');
    if (!baan) continue;
    const stap = () => { const k = baan.children[0] as HTMLElement | undefined; if (!k) return 0; const cs = getComputedStyle(baan); return k.getBoundingClientRect().width + (parseFloat(cs.columnGap || cs.gap) || 0); };
    const einde = () => baan.scrollLeft + baan.clientWidth >= baan.scrollWidth - 4;
    const schuif = (r: number) => {
      if (r > 0 && einde()) { baan.scrollTo({ left: 0, behavior: zacht }); return; }
      if (r < 0 && baan.scrollLeft <= 4) { baan.scrollTo({ left: baan.scrollWidth, behavior: zacht }); return; }
      baan.scrollBy({ left: r * stap(), behavior: zacht });
    };
    let pauze = false, tot = 0, inBeeld = false;
    const rust = () => { tot = performance.now() + 6000; };
    const vorige = box.querySelector('[data-slider-prev]'), volgende = box.querySelector('[data-slider-next]');
    if (vorige) op(vorige, 'click', () => { rust(); schuif(-1); });
    if (volgende) op(volgende, 'click', () => { rust(); schuif(1); });
    op(box, 'keydown', (e: KeyboardEvent) => { if (e.key === 'ArrowRight') { rust(); schuif(1); } if (e.key === 'ArrowLeft') { rust(); schuif(-1); } });
    op(box, 'mouseenter', () => { pauze = true; });
    op(box, 'mouseleave', () => { pauze = false; });
    op(baan, 'touchstart', rust, { passive: true });
    op(baan, 'wheel', rust, { passive: true });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((it) => { inBeeld = it[0].isIntersecting; }, { threshold: 0.4 });
      io.observe(box);
      opruim.push(() => io.disconnect());
    }
    if (!stil && !navigator.webdriver) elke(() => { if (inBeeld && !pauze && !document.hidden && performance.now() > tot) schuif(1); }, 4000);
  }

  /* 7. veeghint-stippen onder de zekerheden op gsm (site.js r.335-346; CSS verbergt ze boven 1000 px) */
  for (const rij of alle('.bf-waarom__veld')) {
    const kaarten = (Array.from(rij.children) as HTMLElement[]).filter((k) => k.matches('.bf-wkaart'));
    if (kaarten.length < 2) continue;
    const hint = document.createElement('div');
    hint.className = 'bf-veeghint'; hint.setAttribute('aria-hidden', 'true');
    kaarten.forEach((_, i) => { const s = document.createElement('span'); if (!i) s.className = 'bf-is-actief'; hint.appendChild(s); });
    rij.parentNode!.insertBefore(hint, rij.nextSibling);
    opruim.push(() => hint.remove());
    op(rij, 'scroll', () => {
      const l = rij.getBoundingClientRect().left; let best = 0, af = 1e9;
      kaarten.forEach((k, i) => { const x = Math.abs(k.getBoundingClientRect().left - l - 16); if (x < af) { af = x; best = i; } });
      Array.from(hint.children).forEach((s, i) => s.classList.toggle('bf-is-actief', i === best));
    }, { passive: true });
  }

  /* 8. traject op gsm: de stap in het midden van het scherm licht op (site.js r.347-351) */
  const stappen = alle('.bf-pstap');
  if (stappen.length && 'IntersectionObserver' in window && window.matchMedia('(max-width: 1000px)').matches) {
    const io = new IntersectionObserver((items) => items.forEach((it) => it.target.classList.toggle('bf-is-in-beeld', it.isIntersecting)), { rootMargin: '-45% 0px -45% 0px' });
    stappen.forEach((s) => io.observe(s));
    opruim.push(() => io.disconnect());
  }

  /* 9. formuliertabs + elke [data-kies]: tab Plaatsbezoek en scrollen naar de formulierkaart, zonder focus (site.js r.256-275) */
  const wissel = (soort: string, scroll: boolean) => {
    for (const box of alle('[data-fwissel]')) {
      for (const t of alle('[data-wissel]', box)) { const aan = t.getAttribute('data-wissel') === soort; t.classList.toggle('bf-is-actief', aan); t.setAttribute('aria-selected', aan ? 'true' : 'false'); t.tabIndex = aan ? 0 : -1; }
      for (const p of alle('[data-paneel]', box)) { const aan = p.getAttribute('data-paneel') === soort; p.hidden = !aan; p.classList.toggle('bf-is-on', aan); }
    }
    const pil = root.querySelector<HTMLElement>('.bf-plaats__inspectie');
    if (pil) pil.hidden = soort === 'plaatsbezoek';
    if (!scroll) return;
    const kaart = root.querySelector<HTMLElement>('.bf-plaats__formkern');
    if (!kaart) return;
    const doel = () => { const hoog = kop ? kop.getBoundingClientRect().height : 0; return kaart.getBoundingClientRect().top + window.scrollY - hoog - 12; };
    window.scrollTo({ top: doel(), behavior: zacht });
    // beelden die onderweg laden duwen de kaart soms weg: tot 3 keer nameten
    let pogingen = 0;
    const controleer = () => later(() => { const mis = doel() - window.scrollY; if (Math.abs(mis) > 16 && pogingen++ < 3) { window.scrollTo({ top: doel(), behavior: zacht }); controleer(); } }, 900);
    controleer();
  };
  for (const t of alle('[data-wissel]')) {
    op(t, 'click', () => wissel(t.getAttribute('data-wissel')!, false));
    op(t, 'keydown', (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const tabs = alle('[data-wissel]', t.parentElement!);
      const i = tabs.indexOf(t), j = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      e.preventDefault(); wissel(tabs[j].getAttribute('data-wissel')!, false); tabs[j].focus();
    });
  }
  for (const knop of alle('[data-kies]')) {
    op(knop, 'click', (e: Event) => {
      e.preventDefault();
      zetMenu(false);
      if (root.querySelector('.bf-plaats__formkern')) wissel('plaatsbezoek', true);
      else opties.navigate('/contact#offerte');
    });
  }

  /* 10. formulierverzending (spec §8): submitLead (GHL + Web3Forms parallel), nooit mailto */
  const plaats = root.querySelector<HTMLElement>('.bf-plaats');
  const pagina = plaats?.getAttribute('data-pagina') || opties.bron;
  const bronLead = (plaats?.getAttribute('data-bron') as 'landing_page' | 'contact_form') || 'landing_page';
  for (const form of alle<HTMLFormElement>('form.js-bf-form')) {
    op(form, 'focusin', () => trackFormStart(`${pagina}:plaatsblok`));
    const melding = form.querySelector<HTMLElement>('.bf-formulier-melding')!;
    const knop = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const meld = (t: string) => { melding.textContent = t; melding.hidden = false; };
    let bezig = false;
    op(form, 'submit', async (e: Event) => {
      e.preventDefault();
      if (bezig) return;
      const veld = (n: string) => form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
      const te = veld('telefoon') as HTMLInputElement, em = veld('email') as HTMLInputElement;
      [te, em].forEach((v) => { v.removeAttribute('aria-invalid'); v.removeAttribute('aria-describedby'); });
      const telefoon = te.value.trim();
      const email = em.value.trim();
      const telOk = telefoon.replace(/\D/g, '').length >= 8;
      const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!telOk && !mailOk) {
        // de bezoeker kan het zelf oplossen: zeg welk veld, zet de focus erop (geen toetsenbord-verrassing: hij drukte zelf op verzenden)
        const fout = !telefoon && email ? em : te;
        fout.setAttribute('aria-invalid', 'true');
        fout.setAttribute('aria-describedby', melding.id);
        meld(!telefoon && !email ? 'Vul een e-mailadres of een telefoonnummer in.' : leadFoutmelding({ ok: false, via: 'none', error: 'invalid_contact_info' }, CONTACT.phone.display));
        fout.focus();
        return;
      }
      const soort = form.getAttribute('data-soort') === 'plaatsbezoek' ? 'plaatsbezoek' : 'offerte';
      const tab = soort === 'plaatsbezoek' ? 'Gratis plaatsbezoek' : 'Offerte aanvragen';
      const naam = (veld('naam')?.value || '').trim();
      const werk = (veld('werk')?.value || '').trim();
      const postcode = (veld('postcode')?.value || '').trim();
      const project = (veld('project')?.value || '').trim();
      const [voor, ...rest] = naam.split(/\s+/).filter(Boolean);
      const key = werkKey(werk);
      bezig = true; knop.disabled = true; knop.setAttribute('aria-busy', 'true');
      meld('Bezig met versturen…');
      const res = await submitLead({
        source: bronLead,
        page_path: location.pathname,
        landing_division: key,
        firstName: voor || undefined,
        lastName: rest.join(' ') || undefined,
        email,
        phone: telefoon || undefined,
        type_werk: key,
        aanvullende_info: [tab, werk, postcode ? 'Postcode: ' + postcode : '', project].filter(Boolean).join('\n'),
        bron_lead: `${pagina}:${soort}`,
      });
      bezig = false; knop.disabled = false; knop.removeAttribute('aria-busy');
      if (opgeruimd) return;
      if (res.ok) { melding.hidden = true; opties.navigate('/bedankt?dienst=totaalrenovatie'); }
      else meld(leadFoutmelding(res, CONTACT.phone.display));
    });
  }

  /* 11. voor/na-schuif: slepen met muis of vinger, pijltoetsen via het (onzichtbare) bereik */
  for (const box of alle('[data-voorna]')) {
    const vak = box.querySelector<HTMLElement>('.bf-voorna__vak')!;
    const bereik = box.querySelector<HTMLInputElement>('.bf-voorna__bereik')!;
    const zet = (p: number) => { p = Math.max(0, Math.min(100, p)); vak.style.setProperty('--pos', p + '%'); bereik.value = String(Math.round(p)); };
    const vanX = (x: number) => { const r = vak.getBoundingClientRect(); zet(((x - r.left) / r.width) * 100); };
    let sleept = false;
    op(vak, 'pointerdown', (e: PointerEvent) => { sleept = true; vak.setPointerCapture(e.pointerId); vanX(e.clientX); });
    op(vak, 'pointermove', (e: PointerEvent) => { if (sleept) vanX(e.clientX); });
    const los = (e: PointerEvent) => { sleept = false; if (vak.hasPointerCapture(e.pointerId)) vak.releasePointerCapture(e.pointerId); };
    op(vak, 'pointerup', los);
    op(vak, 'pointercancel', los);
    op(bereik, 'input', () => zet(Number(bereik.value)));
  }

  /* 12. interne links zonder herladen (de HTML is een string, dus geen <Link>) */
  op(root, 'click', (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest('a');
    if (!a || !root.contains(a) || a.target || a.hasAttribute('download')) return;
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('/') || href.startsWith('//')) return;
    e.preventDefault();
    zetMenu(false);
    opties.navigate(href);
  });

  /* 13. sprong naar #anker na de render (zoals LpReplica.tsx r.322-341): de browser zocht het
     element al vóór React het tekende; daarna corrigeren voor wat nog nalaadt. */
  const anker = decodeURIComponent(location.hash.slice(1));
  if (anker) {
    let pogingen = 0, klaar = false;
    const spring = () => {
      const doel = document.getElementById(anker);
      if (doel && root.contains(doel)) { doel.scrollIntoView({ block: 'start' }); klaar = true; }
      pogingen += 1;
      if (pogingen < 20 && !(klaar && pogingen > 8)) later(spring, 100);
    };
    later(spring, 50);
  }

  return () => {
    opgeruimd = true;
    opruim.splice(0).reverse().forEach((f) => { try { f(); } catch { /* al weg */ } });
  };
}
