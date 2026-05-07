import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Re-implements the vanilla JS interactions from app.js:
 *  - mobile menu toggle, FAQ accordion, services tabs, scroll progress, count-up stats.
 * Also intercepts internal anchor clicks for SPA navigation.
 */
export function useAbBouwInteractions() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // ── SPA link interception ───────────────────────────
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;
      // Smooth in-page anchors (e.g. CTA → contact form)
      if (href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
      if (href.startsWith('/') && !href.startsWith('//') && !target.target) {
        e.preventDefault();
        navigate(href);
      }
    };
    document.addEventListener('click', onClick);

    // ── Hero cinematic intro: trigger on next frame
    const heroAnim = document.querySelector<HTMLElement>('[data-hero-anim]');
    if (heroAnim) {
      requestAnimationFrame(() => requestAnimationFrame(() => heroAnim.classList.add('played')));
    }

    // ── Mobile menu ─────────────────────────────────────
    (window as any).toggleMobileMenu = () => {
      const m = document.getElementById('mobileMenu');
      m?.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    };
    const mm = document.getElementById('mobileMenu');
    const mmLinks = mm?.querySelectorAll('a') ?? [];
    const mmClose = () => {
      mm?.classList.remove('open');
      document.body.classList.remove('menu-open');
    };
    mmLinks.forEach((a) => a.addEventListener('click', mmClose));

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

    // ── Nav scroll state ────────────────────────────────
    const nav = document.getElementById('nav');
    const onScroll = () => {
      if (window.scrollY > 30) nav?.classList.add('scrolled');
      else nav?.classList.remove('scrolled');
      const sp = document.getElementById('scrollProgress');
      if (sp) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        sp.style.width = `${(window.scrollY / h) * 100}%`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Reveal on scroll ────────────────────────────────
    const reveals = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));

    // ── Count-up ────────────────────────────────────────
    const counters = document.querySelectorAll<HTMLElement>('[data-count]');
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const target = parseFloat(el.dataset.count || '0');
          const decimals = parseInt(el.dataset.decimals || '0', 10);
          const suffix = el.dataset.suffix || '';
          const dur = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            const val = target * (1 - Math.pow(1 - t, 3));
            el.textContent = val.toFixed(decimals).replace('.', ',') + suffix;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach((el) => cio.observe(el));

    // ── Magnetic / spotlight on service cards ───────────
    const svcCards = document.querySelectorAll<HTMLElement>('.lf-svc-card');
    const svcMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    svcCards.forEach((c) => c.addEventListener('mousemove', svcMove));

    // ── Skill bars: set --bar-w from inline width ──────
    document.querySelectorAll<HTMLElement>('.lf-bar-track i').forEach((bar) => {
      const w = bar.style.width || '100%';
      bar.style.setProperty('--bar-w', w);
    });

    // ── Subtle parallax on hero bg (single hero image only)
    const heroBg = document.querySelector<HTMLElement>('.lf-hero-bg:not(.lf-hero-bg--slides) img');
    const onParallax = () => {
      if (!heroBg) return;
      const y = Math.min(window.scrollY, 600);
      heroBg.style.transform = `scale(1.04) translate3d(0, ${y * 0.18}px, 0)`;
    };
    window.addEventListener('scroll', onParallax, { passive: true });

    // ── Hero slideshow: crossfade between images every ~7s
    const heroSlides = Array.from(
      document.querySelectorAll<HTMLImageElement>('[data-hero-slides] img'),
    );
    let heroSlideIdx = 0;
    let heroSlideTimer: number | undefined;
    if (heroSlides.length > 1) {
      heroSlideTimer = window.setInterval(() => {
        heroSlides[heroSlideIdx].classList.remove('is-active');
        heroSlideIdx = (heroSlideIdx + 1) % heroSlides.length;
        heroSlides[heroSlideIdx].classList.add('is-active');
      }, 7000);
    }

    // ── Mobile horizontal "pin" rail: vertical page scroll → horizontal rail scroll
    // Uses scroll-snap rail; we drive scrollLeft from window.scrollY while the
    // section is in the viewport. Also marks active card with `.in-view`.
    const pinRail = document.querySelector<HTMLElement>('.lf-stats-pin .lf-stats-grid');
    const pinSection = document.querySelector<HTMLElement>('.lf-stats');
    const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
    let pinTouching = false;
    const onPinTouch = () => { pinTouching = true; };
    const onPinTouchEnd = () => { setTimeout(() => { pinTouching = false; }, 600); };
    pinRail?.addEventListener('touchstart', onPinTouch, { passive: true });
    pinRail?.addEventListener('touchend', onPinTouchEnd, { passive: true });

    const onPinScroll = () => {
      if (!pinRail || !pinSection || !isMobile() || pinTouching) return;
      const rect = pinSection.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress 0 → 1 while section travels through viewport
      const total = rect.height + vh;
      const seen = vh - rect.top;
      const p = Math.max(0, Math.min(1, seen / total));
      const max = pinRail.scrollWidth - pinRail.clientWidth;
      pinRail.scrollLeft = max * p;
    };
    window.addEventListener('scroll', onPinScroll, { passive: true });

    // ── Sequential reveal: why-tiles light up one by one as user scrolls
    const whyWrap = document.querySelector<HTMLElement>('[data-why-seq]');
    const whyTiles = whyWrap
      ? Array.from(whyWrap.querySelectorAll<HTMLElement>('[data-why-step]'))
      : [];
    const onWhyScroll = () => {
      if (!whyWrap || whyTiles.length === 0) return;
      const rect = whyWrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress as section moves from bottom (0) to past top (1)
      const total = rect.height + vh * 0.4;
      const seen = vh * 0.85 - rect.top;
      const p = Math.max(0, Math.min(1, seen / total));
      const activeUpTo = Math.floor(p * (whyTiles.length + 0.4));
      whyTiles.forEach((t, idx) => {
        const on = idx <= activeUpTo - 1;
        t.classList.toggle('is-revealed', idx <= activeUpTo);
        t.classList.toggle('is-active', on && idx === activeUpTo - 1);
      });
    };
    window.addEventListener('scroll', onWhyScroll, { passive: true });
    onWhyScroll();

    // In-view active state for cards (smooth fade/scale of off-center cards)
    let pinIo: IntersectionObserver | null = null;
    if (pinRail) {
      pinIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            (en.target as HTMLElement).classList.toggle('in-view', en.intersectionRatio > 0.65);
          });
        },
        { root: pinRail, threshold: [0, 0.4, 0.65, 0.9, 1] },
      );
      pinRail.querySelectorAll('.lf-stat-card').forEach((c) => pinIo!.observe(c));
    }

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onParallax);
      window.removeEventListener('scroll', onPinScroll);
      window.removeEventListener('scroll', onWhyScroll);
      pinRail?.removeEventListener('touchstart', onPinTouch);
      pinRail?.removeEventListener('touchend', onPinTouchEnd);
      mmLinks.forEach((a) => a.removeEventListener('click', mmClose));
      faqHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
      tabHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
      svcCards.forEach((c) => c.removeEventListener('mousemove', svcMove));
      io.disconnect();
      cio.disconnect();
      pinIo?.disconnect();
      if (heroSlideTimer) window.clearInterval(heroSlideTimer);
    };
  }, [location.pathname, navigate]);
}
