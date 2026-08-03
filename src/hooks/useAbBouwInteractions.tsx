import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Functionele interacties voor de hoofdsite (robuust-overhaul aug 2026):
 * mobiel menu, FAQ, tabs, dropdowns, filters, rails, TOC-scrollspy en
 * SPA-navigatie. Alle scroll-reveal-, sweep-, parallax-, marquee- en
 * count-up-animaties zijn bewust verwijderd: content staat er direct,
 * navigatie is instant, de nav is overal altijd zichtbaar.
 */
export function useAbBouwInteractions() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);

    const scrollToTarget = (el: HTMLElement, behavior: ScrollBehavior = 'smooth') => {
      const navEl = document.getElementById('nav');
      const navH = navEl ? navEl.getBoundingClientRect().height : 0;
      const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navH - 24);
      window.scrollTo({ top, behavior });
    };

    // ── SPA link interception ───────────────────────────
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.dataset.route || target.getAttribute('href');
      if (!href) return;
      // In-page ankers (CTA → formulier, TOC → sectie): native smooth scroll
      if (href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href) as HTMLElement | null;
        if (el) {
          e.preventDefault();
          scrollToTarget(el);
          history.replaceState(null, '', href);
        }
        return;
      }
      if (href.startsWith('/') && !href.startsWith('//') && !target.target) {
        const url = new URL(href, window.location.origin);
        const nextHref = `${url.pathname}${url.search}${url.hash}`;
        if (url.pathname === location.pathname && url.hash.length > 1) {
          const el = document.querySelector(url.hash) as HTMLElement | null;
          if (el) {
            e.preventDefault();
            scrollToTarget(el);
            history.replaceState(null, '', url.hash);
            return;
          }
        }
        if (url.pathname === location.pathname && !url.hash && !url.search) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        e.preventDefault();
        navigate(nextHref);
      }
    };
    document.addEventListener('click', onClick, true);

    if (location.hash.length > 1) {
      requestAnimationFrame(() => {
        const el = document.querySelector(location.hash) as HTMLElement | null;
        if (!el) return;
        scrollToTarget(el, 'auto');
      });
    }

    // ── Mobiel menu ─────────────────────────────────────
    // `mm-open` op body verbergt de nav-pil zodat hij niet overlapt met de X.
    (window as any).toggleMobileMenu = () => {
      const m = document.getElementById('mobileMenu');
      const opening = !m?.classList.contains('open');
      m?.classList.toggle('open', opening);
      document.body.classList.toggle('menu-open', opening);
      document.body.classList.toggle('mm-open', opening);
    };
    const mm = document.getElementById('mobileMenu');
    const mmLinks = mm?.querySelectorAll('a') ?? [];
    const mmClose = () => {
      mm?.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.body.classList.remove('mm-open');
    };
    mmLinks.forEach((a) => a.addEventListener('click', mmClose));
    const mmCloseBtn = document.getElementById('mobileMenuClose');
    mmCloseBtn?.addEventListener('click', mmClose);

    // ── FAQ accordion ───────────────────────────────────
    const faqItems = document.querySelectorAll<HTMLElement>('.faq-item');
    const faqHandlers: Array<[HTMLElement, () => void]> = [];
    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-q') as HTMLElement | null;
      if (!btn) return;
      const h = () => item.classList.toggle('open');
      btn.addEventListener('click', h);
      faqHandlers.push([btn, h]);
    });

    // ── Service tabs ────────────────────────────────────
    const tabBtns = document.querySelectorAll<HTMLElement>('.svc-tab-btn');
    const tabHandlers: Array<[HTMLElement, () => void]> = [];
    tabBtns.forEach((btn) => {
      const h = () => {
        const id = btn.getAttribute('data-tab');
        document.querySelectorAll('.svc-tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.svc-tab-panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`.svc-tab-panel[data-panel="${id}"]`)?.classList.add('active');
      };
      btn.addEventListener('click', h);
      tabHandlers.push([btn, h]);
    });
    // Activate first panel
    const firstPanel = document.querySelector('.svc-tab-panel');
    firstPanel?.classList.add('active');

    // ── Custom division dropdowns (works on every page, not only Home) ──
    const ddCleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>('[data-dd]').forEach((dd) => {
      const toggle = dd.querySelector<HTMLElement>('[data-dd-toggle]');
      const label = dd.querySelector<HTMLElement>('[data-dd-label]');
      const input = dd.querySelector<HTMLInputElement>('[data-dd-input]');
      const opts = Array.from(dd.querySelectorAll<HTMLElement>('[data-dd-opt]'));
      if (!toggle || !label || !input || !opts.length) return;
      const close = () => {
        dd.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      };
      const onToggle = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll<HTMLElement>('[data-dd].open').forEach((other) => {
          if (other !== dd) other.classList.remove('open');
        });
        const open = !dd.classList.contains('open');
        dd.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      const optHandlers: Array<[HTMLElement, (ev: Event) => void]> = [];
      opts.forEach((opt) => {
        // Track scroll-movement zodat een swipe NIET als click registreert.
        let touchStartY = 0;
        let touchMoved = false;
        const onTouchStart = (e: TouchEvent) => {
          touchStartY = e.touches[0]?.clientY ?? 0;
          touchMoved = false;
        };
        const onTouchMove = (e: TouchEvent) => {
          const dy = Math.abs((e.touches[0]?.clientY ?? 0) - touchStartY);
          if (dy > 8) touchMoved = true;
        };
        const choose = (ev: Event) => {
          if (touchMoved) return;
          ev.preventDefault();
          ev.stopPropagation();
          opts.forEach((x) => x.classList.remove('selected'));
          opt.classList.add('selected');
          label.textContent = opt.textContent || '';
          label.classList.add('has-value');
          input.value = opt.textContent || '';
          close();
        };
        opt.addEventListener('touchstart', onTouchStart, { passive: true });
        opt.addEventListener('touchmove', onTouchMove, { passive: true });
        opt.addEventListener('click', choose);
        optHandlers.push([opt, choose]);
        ddCleanups.push(() => {
          opt.removeEventListener('touchstart', onTouchStart);
          opt.removeEventListener('touchmove', onTouchMove);
        });
      });
      const onDoc = (e: MouseEvent) => { if (!dd.contains(e.target as Node)) close(); };
      toggle.addEventListener('click', onToggle);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && dd.classList.contains('open')) close();
      };
      document.addEventListener('click', onDoc);
      document.addEventListener('keydown', onKey);
      ddCleanups.push(() => {
        toggle.removeEventListener('click', onToggle);
        document.removeEventListener('click', onDoc);
        document.removeEventListener('keydown', onKey);
        optHandlers.forEach(([el, h]) => {
          el.removeEventListener('click', h);
        });
      });
    });

    // ── Nav: overal altijd zichtbaar; alleen een schaduw-state bij scroll ──
    const nav = document.getElementById('nav');
    const isHome = location.pathname === '/';
    document.body.classList.toggle('is-subpage', !isHome);
    nav?.classList.remove('hero-mode', 'nav-sweep-once');
    // Legacy sweep-variabelen op hun eindstand: nav volledig aanwezig, geen shine.
    document.documentElement.style.setProperty('--nav-sweep', '1');
    document.documentElement.style.setProperty('--nav-sweep-clip', '0%');
    document.documentElement.style.setProperty('--nav-sweep-y', '0px');
    document.documentElement.style.setProperty('--nav-shine-x', '-115%');
    document.documentElement.style.setProperty('--nav-shine-opacity', '0');
    document.documentElement.style.setProperty('--hf', '1');
    document.body.classList.add('past-hero', 'nav-revealed');
    let navRaf = 0;
    const onScroll = () => {
      if (navRaf) return;
      navRaf = requestAnimationFrame(() => {
        navRaf = 0;
        const sy = window.scrollY;
        if (sy > 30) nav?.classList.add('scrolled');
        else nav?.classList.remove('scrolled');
        if (sy > 80) document.body.classList.add('is-scrolled');
        else document.body.classList.remove('is-scrolled');
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Project filter chips ────────────────────────────
    const projTabs = document.querySelector<HTMLElement>('[data-proj-tabs]');
    const projCells = Array.from(document.querySelectorAll<HTMLElement>('[data-proj-cat]'));
    const onProjFilter = (e: Event) => {
      const btn = (e.target as HTMLElement)?.closest<HTMLButtonElement>('[data-proj-filter]');
      if (!btn || !projTabs) return;
      const filter = btn.dataset.projFilter || 'all';
      projTabs.querySelectorAll('[data-proj-filter]').forEach(b => b.classList.toggle('active', b === btn));
      projCells.forEach(c => {
        const match = filter === 'all' || c.dataset.projCat === filter;
        c.classList.toggle('is-hidden', !match);
      });
    };
    projTabs?.addEventListener('click', onProjFilter);

    // ── Horizontale rails: swipe-navigatie op mobiel (functioneel) ──
    const xRails = Array.from(document.querySelectorAll<HTMLElement>('[data-x-rail], .dak-grid[data-scroll="x"]'));
    const xRailHandlers: Array<[HTMLElement, () => void]> = [];
    const updateXRail = (rail: HTMLElement) => {
      const items = Array.from(rail.children).filter((el): el is HTMLElement => el instanceof HTMLElement);
      if (!items.length) return;
      const rect = rail.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      items.forEach((item, idx) => {
        const r = item.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - center);
        if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
      });
      const max = Math.max(1, rail.scrollWidth - rail.clientWidth);
      rail.style.setProperty('--x-progress', `${rail.scrollLeft / max}`);
      items.forEach((item, idx) => item.classList.toggle('is-x-active', idx === bestIdx));
    };
    const onXRailResize = () => xRails.forEach(updateXRail);
    xRails.forEach((rail) => {
      const handler = () => requestAnimationFrame(() => updateXRail(rail));
      rail.addEventListener('scroll', handler, { passive: true });
      xRailHandlers.push([rail, handler]);
      updateXRail(rail);
    });
    window.addEventListener('resize', onXRailResize);

    // ── Over ons promise tabs ───────────────────────────
    const promiseTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-promise-tab]'));
    const promisePanels = Array.from(document.querySelectorAll<HTMLElement>('[data-promise-panel]'));
    const promiseProgress = document.querySelector<HTMLElement>('[data-promise-progress] i');
    const promiseHandlers: Array<[HTMLButtonElement, () => void]> = [];
    const setPromise = (idx: number) => {
      promiseTabs.forEach((tab, i) => tab.classList.toggle('is-active', i === idx));
      promisePanels.forEach((panel, i) => panel.classList.toggle('is-active', i === idx));
      if (promiseProgress && promiseTabs.length > 1) {
        promiseProgress.style.width = `${((idx + 1) / promiseTabs.length) * 100}%`;
      }
    };
    promiseTabs.forEach((tab, idx) => {
      const handler = () => setPromise(idx);
      tab.addEventListener('click', handler);
      promiseHandlers.push([tab, handler]);
    });
    if (promiseTabs.length) setPromise(promiseTabs.findIndex((tab) => tab.classList.contains('is-active')) || 0);

    // ===== ab-toc: scroll naar sectie + scroll-spy active state =====
    const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.ab-toc a[href^="#"]'));
    const tocTargets: { link: HTMLAnchorElement; el: HTMLElement }[] = [];
    tocLinks.forEach((a) => {
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        tocTargets.push({ link: a, el });
        el.style.scrollMarginTop = '96px';
      }
    });
    const navEl2 = document.getElementById('nav');
    const onTocClick = (e: MouseEvent) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      tocLinks.forEach((l) => l.classList.toggle('is-active', l === a));
      try { (a as HTMLElement).blur(); } catch {}
      const navH = navEl2?.offsetHeight ?? 88;
      const top = el.getBoundingClientRect().top + window.scrollY - (navH + 16);
      const htmlEl = document.documentElement;
      const prevBehavior = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = 'auto';
      window.scrollTo({ top, behavior: 'smooth' });
      requestAnimationFrame(() => { htmlEl.style.scrollBehavior = prevBehavior; });
      history.replaceState(null, '', `#${id}`);
    };
    tocLinks.forEach((a) => a.addEventListener('click', onTocClick as EventListener));
    let tocRaf = 0;
    const onTocScroll = () => {
      if (tocRaf) return;
      tocRaf = requestAnimationFrame(() => {
        tocRaf = 0;
        if (!tocTargets.length) return;
        const probe = window.scrollY + 180;
        let activeIdx = 0;
        tocTargets.forEach((t, i) => { if (t.el.offsetTop <= probe) activeIdx = i; });
        tocTargets.forEach((t, i) => t.link.classList.toggle('is-active', i === activeIdx));
      });
    };
    window.addEventListener('scroll', onTocScroll, { passive: true });
    onTocScroll();

    return () => {
      document.removeEventListener('click', onClick, true);
      projTabs?.removeEventListener('click', onProjFilter);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onTocScroll);
      tocLinks.forEach((a) => a.removeEventListener('click', onTocClick as EventListener));
      mmLinks.forEach((a) => a.removeEventListener('click', mmClose));
      mmCloseBtn?.removeEventListener('click', mmClose);
      xRailHandlers.forEach(([el, h]) => el.removeEventListener('scroll', h));
      window.removeEventListener('resize', onXRailResize);
      ddCleanups.forEach((cleanup) => cleanup());
      faqHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
      tabHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
      promiseHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
    };
  }, [location.pathname, navigate]);
}
