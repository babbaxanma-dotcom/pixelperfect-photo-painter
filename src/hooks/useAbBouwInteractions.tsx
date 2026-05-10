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
      // Smooth in-page anchors (e.g. CTA → contact form, TOC → section)
      if (href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href) as HTMLElement | null;
        if (el) {
          e.preventDefault();
          const navEl = document.getElementById('nav');
          const navH = navEl ? navEl.getBoundingClientRect().height : 0;
          const offset = navH + 24;
          const startY = window.scrollY;
          const targetY = Math.max(0, el.getBoundingClientRect().top + startY - offset);
          const distance = targetY - startY;
          const absDist = Math.abs(distance);
          if (absDist < 4) return;
          // Duration scales with distance, clamped for a calm feel
          const duration = Math.min(1400, Math.max(650, absDist * 0.55));
          const startT = performance.now();
          // easeInOutCubic
          const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
          const step = (now: number) => {
            const p = Math.min(1, (now - startT) / duration);
            window.scrollTo(0, startY + distance * ease(p));
            if (p < 1) requestAnimationFrame(step);
            else history.replaceState(null, '', href);
          };
          requestAnimationFrame(step);
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
    const mmCloseBtn = document.getElementById('mobileMenuClose');
    mmCloseBtn?.addEventListener('click', mmClose);

    // ── Why-stack: hide photo when trust strip approaches viewport
    const whyStackEl = document.querySelector<HTMLElement>('.lf-why-stack');
    const trustStripEl = document.querySelector<HTMLElement>('.lf-trust-strip');
    let trustNearIo: IntersectionObserver | null = null;
    if (whyStackEl && trustStripEl) {
      trustNearIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            whyStackEl.classList.toggle('is-trust-near', en.isIntersecting);
          });
        },
        { rootMargin: '0px 0px -20% 0px', threshold: 0 },
      );
      trustNearIo.observe(trustStripEl);
    }

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
    const hero = document.querySelector<HTMLElement>('.lf-hero');
    nav?.classList.remove('hero-mode', 'nav-sweep-once');
    document.documentElement.style.setProperty('--nav-sweep', '0');
    document.documentElement.style.setProperty('--nav-sweep-clip', '50%');
    document.documentElement.style.setProperty('--nav-sweep-y', '-18px');
    document.documentElement.style.setProperty('--nav-shine-x', '-115%');
    document.documentElement.style.setProperty('--nav-shine-opacity', '0');
    document.body.classList.remove('past-hero', 'nav-revealed');
    let navRaf = 0;
    const onScroll = () => {
      if (navRaf) return;
      navRaf = requestAnimationFrame(() => {
        navRaf = 0;
        const sy = window.scrollY;
        if (sy > 30) nav?.classList.add('scrolled');
        else nav?.classList.remove('scrolled');
        if (hero) {
          const heroH = hero.offsetHeight;
          const navStart = heroH * 0.42;
          const navEnd = heroH * 0.78;
          const raw = Math.max(0, Math.min(1, (sy - navStart) / (navEnd - navStart)));
          // easeInOutCubic — verzacht begin en einde van de sweep
          let navP = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
          // Forceer volledig zichtbare nav zodra we duidelijk onder de hero zitten
          if (sy > heroH * 0.65) navP = 1;
          document.documentElement.style.setProperty('--nav-sweep', navP.toFixed(3));
          document.documentElement.style.setProperty('--nav-sweep-clip', `${((1 - navP) * 50).toFixed(2)}%`);
          document.documentElement.style.setProperty('--nav-sweep-y', `${((1 - navP) * -18).toFixed(2)}px`);
          document.documentElement.style.setProperty('--nav-shine-x', `${(-115 + navP * 230).toFixed(2)}%`);
          document.documentElement.style.setProperty('--nav-shine-opacity', navP > 0.08 && navP < 0.98 ? '1' : '0');
          document.body.classList.toggle('past-hero', navP > 0.02 || sy > heroH * 0.5);
          document.body.classList.toggle('nav-revealed', navP > 0.95 || sy > heroH * 0.65);
          const fadeStart = heroH * 0.55;
          const fadeEnd = heroH * 0.95;
          const fade = Math.max(0, Math.min(1, 1 - (sy - fadeStart) / (fadeEnd - fadeStart)));
          document.documentElement.style.setProperty('--hf', fade.toString());
        } else {
          document.documentElement.style.setProperty('--nav-sweep', '1');
          document.documentElement.style.setProperty('--nav-sweep-clip', '0%');
          document.documentElement.style.setProperty('--nav-sweep-y', '0px');
          document.documentElement.style.setProperty('--nav-shine-opacity', '0');
          document.body.classList.add('past-hero', 'nav-revealed');
        }
        const sp = document.getElementById('scrollProgress');
        if (sp) {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          sp.style.width = `${(sy / h) * 100}%`;
        }
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
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
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
    let parallaxRaf = 0;
    const onParallax = () => {
      if (!heroBg) return;
      if (parallaxRaf) return;
      parallaxRaf = requestAnimationFrame(() => {
        parallaxRaf = 0;
        const y = Math.min(window.scrollY, 600);
        heroBg.style.transform = `scale(1.04) translate3d(0, ${y * 0.18}px, 0)`;
      });
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

    // ── Mobile services carousel: mark snapped (centered) slot for scale-up effect
    const svcCarousel = svcStack as HTMLElement | null;
    let svcSnapRaf = 0;
    const updateSvcSnapped = () => {
      svcSnapRaf = 0;
      if (!svcCarousel || svcStackSlots.length === 0) return;
      if (window.matchMedia('(min-width: 901px)').matches) {
        svcStackSlots.forEach((s) => s.classList.remove('is-snapped'));
        return;
      }
      const railRect = svcCarousel.getBoundingClientRect();
      const center = railRect.left + railRect.width / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      svcStackSlots.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      svcStackSlots.forEach((s, i) => s.classList.toggle('is-snapped', i === bestIdx));
    };
    const onSvcSnapScroll = () => {
      if (svcSnapRaf) return;
      svcSnapRaf = requestAnimationFrame(updateSvcSnapped);
    };
    svcCarousel?.addEventListener('scroll', onSvcSnapScroll, { passive: true });
    window.addEventListener('resize', onSvcSnapScroll);
    updateSvcSnapped();


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

    // ── Support cards: scroll-driven sequential highlight ──
    const supportCards = Array.from(document.querySelectorAll<HTMLElement>('[data-support-card]'));
    const onSupportScroll = () => {
      if (!supportCards.length) return;
      const center = window.innerHeight / 2;
      let bestIdx = -1;
      let bestDist = Infinity;
      supportCards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        if (r.bottom < 60 || r.top > window.innerHeight - 60) return;
        const d = Math.abs((r.top + r.bottom) / 2 - center);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      supportCards.forEach((c, i) => c.classList.toggle('is-active', i === bestIdx));
    };
    window.addEventListener('scroll', onSupportScroll, { passive: true });
    onSupportScroll();

    // ===== ab-toc: smooth scroll on click + scroll-spy active state =====
    const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.ab-toc a[href^="#"]'));
    const tocTargets: { link: HTMLAnchorElement; el: HTMLElement }[] = [];
    tocLinks.forEach((a) => {
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        tocTargets.push({ link: a, el });
        // Ensure native + JS anchor jumps respect the sticky nav height
        el.style.scrollMarginTop = '96px';
      }
    });
    const navEl = document.getElementById('nav');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onTocClick = (e: MouseEvent) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      tocLinks.forEach((l) => l.classList.toggle('is-active', l === a));
      // Blur to prevent the horizontal pill bar from auto-scrolling its focused child on mobile
      try { (a as HTMLElement).blur(); } catch {}
      const navH = navEl?.offsetHeight ?? 88;
      const top = el.getBoundingClientRect().top + window.scrollY - (navH + 16);
      // Temporarily disable CSS smooth so it doesn't fight the JS scroll on iOS Safari
      const htmlEl = document.documentElement;
      const prevBehavior = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = 'auto';
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
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
      document.removeEventListener('click', onClick);
      projTabs?.removeEventListener('click', onProjFilter);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onParallax);
      window.removeEventListener('scroll', onPinScroll);
      window.removeEventListener('scroll', onSupportScroll);
      window.removeEventListener('scroll', onTocScroll);
      tocLinks.forEach((a) => a.removeEventListener('click', onTocClick as EventListener));
      window.removeEventListener('scroll', onWhyScroll);
      window.removeEventListener('scroll', onWhyStackScroll);
      window.removeEventListener('resize', onWhyStackScroll);
      window.removeEventListener('scroll', onTrustScroll);
      window.removeEventListener('scroll', onSvcStackScroll);
      window.removeEventListener('resize', onSvcStackScroll);
      svcCarousel?.removeEventListener('scroll', onSvcSnapScroll);
      window.removeEventListener('resize', onSvcSnapScroll);
      pinRail?.removeEventListener('touchstart', onPinTouch);
      pinRail?.removeEventListener('touchend', onPinTouchEnd);
      mmLinks.forEach((a) => a.removeEventListener('click', mmClose));
      mmCloseBtn?.removeEventListener('click', mmClose);
      trustNearIo?.disconnect();
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
