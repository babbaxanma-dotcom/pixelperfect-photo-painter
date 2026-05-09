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
    const isHome = location.pathname === '/';
    const hero = isHome ? document.querySelector<HTMLElement>('.lf-hero') : null;
    if (hero) {
      nav?.classList.add('hero-mode');
    } else {
      // Non-home pages: navbar always visible, no sweep
      nav?.classList.remove('hero-mode');
      document.documentElement.style.setProperty('--nav-sweep', '1');
      document.body.classList.add('nav-revealed');
    }
    const onScroll = () => {
      if (window.scrollY > 30) nav?.classList.add('scrolled');
      else nav?.classList.remove('scrolled');
      if (hero) {
        const heroH = hero.offsetHeight;
        const fade = Math.max(0, Math.min(1, 1 - window.scrollY / (heroH * 0.45)));
        document.documentElement.style.setProperty('--hf', fade.toString());
        const navStart = heroH * 0.55;
        const navEnd = heroH * 0.75;
        const navP = Math.max(0, Math.min(1, (window.scrollY - navStart) / (navEnd - navStart)));
        document.documentElement.style.setProperty('--nav-sweep', navP.toString());
        if (navP > 0.02) {
          nav?.classList.remove('hero-mode');
          document.body.classList.add('nav-revealed');
        } else {
          nav?.classList.add('hero-mode');
          document.body.classList.remove('nav-revealed');
        }
      }
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

    // ── Offerte form: continuous calm pulse until user engages ──
    const formEl = document.querySelector<HTMLElement>('.lf-form#contact-form');
    if (formEl) {
      const fio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && e.intersectionRatio > 0.3) {
              formEl.classList.add('is-attention');
              fio.unobserve(formEl);
            }
          });
        },
        { threshold: [0.3, 0.5] },
      );
      fio.observe(formEl);
      const stop = () => formEl.classList.add('is-engaged');
      formEl.addEventListener('pointerdown', stop, { once: true });
      formEl.addEventListener('focusin', stop, { once: true });
    }

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
    const heroEl = document.querySelector<HTMLElement>('.lf-hero');
    const onParallax = () => {
      if (heroBg) {
        const y = Math.min(window.scrollY, 600);
        heroBg.style.transform = `scale(1.04) translate3d(0, ${y * 0.18}px, 0)`;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();

    // ── Hero slideshow: crossfade with arrows + dots
    const heroSlides = Array.from(
      document.querySelectorAll<HTMLImageElement>('[data-hero-slides] img'),
    );
    const heroDots = Array.from(
      document.querySelectorAll<HTMLElement>('[data-hero-dot]'),
    );
    const heroPrevBtn = document.querySelector<HTMLElement>('[data-hero-prev]');
    const heroNextBtn = document.querySelector<HTMLElement>('[data-hero-next]');
    let heroSlideIdx = 0;
    let heroSlideTimer: number | undefined;
    const HERO_INTERVAL = 7000;
    const goToHeroSlide = (next: number) => {
      if (heroSlides.length < 2) return;
      const n = ((next % heroSlides.length) + heroSlides.length) % heroSlides.length;
      if (n === heroSlideIdx) return;
      const prev = heroSlides[heroSlideIdx];
      heroSlides.forEach((s) => s.classList.remove('is-prev'));
      prev.classList.remove('is-active');
      prev.classList.add('is-prev');
      heroDots[heroSlideIdx]?.classList.remove('is-active');
      heroSlideIdx = n;
      const incoming = heroSlides[heroSlideIdx];
      incoming.classList.add('is-active');
      heroDots[heroSlideIdx]?.classList.add('is-active');
      // Restart dot fill animation by reflowing the span
      const span = heroDots[heroSlideIdx]?.querySelector<HTMLElement>('span');
      if (span) {
        span.style.animation = 'none';
        void span.offsetWidth;
        span.style.animation = '';
      }
    };
    const startHeroTimer = () => {
      if (heroSlideTimer) window.clearInterval(heroSlideTimer);
      heroSlideTimer = window.setInterval(() => goToHeroSlide(heroSlideIdx + 1), HERO_INTERVAL);
    };
    if (heroSlides.length > 1) startHeroTimer();
    const onHeroPrev = () => { goToHeroSlide(heroSlideIdx - 1); startHeroTimer(); };
    const onHeroNext = () => { goToHeroSlide(heroSlideIdx + 1); startHeroTimer(); };
    heroPrevBtn?.addEventListener('click', onHeroPrev);
    heroNextBtn?.addEventListener('click', onHeroNext);
    const heroDotHandlers: Array<[HTMLElement, () => void]> = [];
    heroDots.forEach((dot, idx) => {
      const h = () => { goToHeroSlide(idx); startHeroTimer(); };
      dot.addEventListener('click', h);
      heroDotHandlers.push([dot, h]);
    });

    // ── Testimonials carousel (desktop) + sticky scroll stack (mobile)
    const testiMarquee = document.querySelector<HTMLElement>('[data-testi-marquee]');
    const testiShift = document.querySelector<HTMLElement>('[data-testi-shift]');
    const testiTrack = document.querySelector<HTMLElement>('[data-testi-track]');
    const testiCards = testiMarquee
      ? Array.from(testiMarquee.querySelectorAll<HTMLElement>('.lf-testi'))
      : [];
    const mobileTestiCards = testiTrack
      ? Array.from(testiTrack.querySelectorAll<HTMLElement>('[data-testi-set="0"] .lf-testi'))
      : [];
    let testiRaf = 0;
    const isTestiMobile = () => window.matchMedia('(max-width: 760px)').matches;
    const updateMobileTestiStack = () => {
      if (!testiMarquee || mobileTestiCards.length === 0) return;
      // Mobile is now a native horizontal scroll-snap carousel — clear any
      // legacy inline transforms/opacity vars and let CSS take over.
      mobileTestiCards.forEach((card) => {
        card.style.removeProperty('--mobile-review-opacity');
        card.style.removeProperty('--mobile-review-x');
        card.style.removeProperty('--mobile-review-y');
        card.style.removeProperty('--mobile-review-scale');
        card.style.removeProperty('--mobile-review-z');
        card.style.removeProperty('--mobile-review-blur');
        card.classList.remove('is-mobile-active');
        card.classList.remove('is-focus', 'is-near');
      });
    };
    const updateTestiFocus = () => {
      if (isTestiMobile()) {
        updateMobileTestiStack();
        return;
      }
      if (!testiMarquee || testiCards.length === 0) return;
      const mRect = testiMarquee.getBoundingClientRect();
      const center = mRect.left + mRect.width / 2;
      let bestIdx = -1;
      let bestDist = Infinity;
      const dists: number[] = [];
      testiCards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const d = Math.abs(cx - center);
        dists[i] = d;
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      const cardW = testiCards[0].getBoundingClientRect().width;
      testiCards.forEach((card, i) => {
        card.classList.toggle('is-focus', i === bestIdx);
        card.classList.toggle('is-near', i !== bestIdx && dists[i] < cardW * 1.2);
      });
    };
    const centerMobileTesti = (behavior: ScrollBehavior = 'auto') => {
      if (!testiMarquee || !testiTrack || !isTestiMobile()) return;
      // Mobile now uses vertical sticky-scroll stack, not horizontal centering.
      void behavior;
      testiMarquee.classList.add('is-ready');
    };
    const keepMobileTestiInMiddleLoop = () => {
      // Mobile now uses vertical sticky-scroll stack, not horizontal loop scrolling.
      return;
    };
    const tickTesti = () => {
      updateTestiFocus();
      testiRaf = requestAnimationFrame(tickTesti);
    };
    if (testiMarquee && testiCards.length) {
      if (!isTestiMobile()) testiMarquee.classList.add('is-ready');
      requestAnimationFrame(() => centerMobileTesti('auto'));
      updateTestiFocus();
      testiRaf = requestAnimationFrame(tickTesti);
    }

    // ── Arrows: nudge the marquee by one card via --testi-shift offset
    const testiPrev = document.querySelector<HTMLElement>('[data-testi-prev]');
    const testiNext = document.querySelector<HTMLElement>('[data-testi-next]');
    let testiShiftValue = 0;
    const applyShift = () => {
      if (testiShift) testiShift.style.setProperty('--testi-shift', `${testiShiftValue}px`);
    };
    const stepShift = (dir: 1 | -1) => {
      if (!testiCards.length) return;
      const gap = isTestiMobile() ? 16 : 24;
      const cardW = testiCards[0].getBoundingClientRect().width + gap;
      if (testiMarquee && isTestiMobile()) {
        testiMarquee.scrollBy({ left: dir * cardW, behavior: 'smooth' });
        return;
      }
      testiShiftValue += -dir * cardW;
      applyShift();
    };
    const onPrev = () => stepShift(-1);
    const onNext = () => stepShift(1);
    testiPrev?.addEventListener('click', onPrev);
    testiNext?.addEventListener('click', onNext);
    testiMarquee?.addEventListener('scroll', keepMobileTestiInMiddleLoop, { passive: true });

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

    // ── Why-stack: scroll-linked scale on stacked cards (desktop), Olivier Larose pattern
    const whyStack = document.querySelector<HTMLElement>('[data-why-stack]');
    const whyStackSlots = whyStack
      ? Array.from(whyStack.querySelectorAll<HTMLElement>('[data-why-slot]'))
      : [];
    const whyStackCards = whyStack
      ? Array.from(whyStack.querySelectorAll<HTMLElement>('[data-why-card]'))
      : [];
    const isWhyStackDesktop = () => window.matchMedia('(min-width: 901px)').matches;
    let whyRaf = 0;
    const computeWhyStack = () => {
      whyRaf = 0;
      // Pure CSS sticky stack — clear any legacy inline transforms.
      whyStackCards.forEach((c) => {
        c.style.removeProperty('--why-scale');
        c.style.removeProperty('--why-card-h');
      });
    };
    const onWhyStackScroll = () => {
      if (whyRaf) return;
      whyRaf = requestAnimationFrame(computeWhyStack);
    };
    computeWhyStack();

    // ── Trust-strip: cascade-mark items as the strip enters the viewport
    const trustStrip = document.querySelector<HTMLElement>('[data-trust-strip]');
    const trustItems = trustStrip
      ? Array.from(trustStrip.querySelectorAll<HTMLElement>('.lf-trust-item'))
      : [];
    const onTrustScroll = () => {
      if (!trustStrip || trustItems.length === 0) return;
      const rect = trustStrip.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const enter = vh * 0.95;
      const center = vh * 0.55;
      const p = Math.max(0, Math.min(1, (enter - rect.top) / Math.max(1, enter - center)));
      const upTo = Math.floor(p * (trustItems.length + 0.5));
      trustItems.forEach((it, idx) => it.classList.toggle('is-marked', idx < upTo));
    };
    window.addEventListener('scroll', onTrustScroll, { passive: true });
    onTrustScroll();

    // ── Stacking-card scroll animation for services grid (mobile only)
    const svcStack = document.querySelector<HTMLElement>('[data-svc-stack]');
    const svcStackCards = svcStack
      ? Array.from(svcStack.querySelectorAll<HTMLElement>('[data-svc-card]'))
      : [];
    const svcStackSlots = svcStack
      ? Array.from(svcStack.querySelectorAll<HTMLElement>('[data-svc-slot]'))
      : [];
    let svcRaf = 0;
    const isSvcStackDesktop = () => window.matchMedia('(min-width: 901px)').matches;
    const computeSvcStack = () => {
      svcRaf = 0;
      // Pure CSS sticky — strip any inline transform/scale.
      svcStackCards.forEach((c) => {
        c.style.removeProperty('--svc-scale');
        c.style.removeProperty('--svc-card-h');
      });
    };
    const onSvcStackScroll = () => {
      if (svcRaf) return;
      svcRaf = requestAnimationFrame(computeSvcStack);
    };
    computeSvcStack();


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
      window.removeEventListener('scroll', onWhyStackScroll);
      window.removeEventListener('resize', onWhyStackScroll);
      window.removeEventListener('scroll', onTrustScroll);
      window.removeEventListener('scroll', onSvcStackScroll);
      window.removeEventListener('resize', onSvcStackScroll);
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
      heroPrevBtn?.removeEventListener('click', onHeroPrev);
      heroNextBtn?.removeEventListener('click', onHeroNext);
      heroDotHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
      if (testiRaf) cancelAnimationFrame(testiRaf);
      testiPrev?.removeEventListener('click', onPrev);
      testiNext?.removeEventListener('click', onNext);
      testiMarquee?.removeEventListener('scroll', keepMobileTestiInMiddleLoop);
    };
  }, [location.pathname, navigate]);
}
