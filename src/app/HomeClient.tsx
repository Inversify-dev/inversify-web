'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import HeroSection from '@/components/layout/HeroSection';
import WhoWeAreSection from '@/components/layout/WhoWeAreSection';
import WhatWeDoSection from '@/components/layout/WhatWeDoSection';
import ClientsSection from '@/components/layout/ClientsSection';
import CTASection from '@/components/layout/CTASection';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── MODULE-LEVEL CONSTANTS ───────────────────────────────────────────────────
const IS_MOBILE_UA =
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const MOBILE_BREAKPOINT = 768;

// Register GSAP plugin once at module scope (safe for SSR)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
  gsap.config({ force3D: true });
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    limitCallbacks: true,
  });
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const SHARED_STYLES = `
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }

  html {
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    overflow-x: hidden;
  }

  body {
    overflow-x: hidden;
    margin: 0;
    background: #000;
  }

  /* Hide scrollbar but allow scroll */
  ::-webkit-scrollbar { width: 0px; height: 0px; }
`;

const DESKTOP_STYLES = `
  html { scroll-behavior: auto; }

  #hero-black-overlay,
  #who-we-are-portal-content,
  #what-we-do-portal-content,
  #what-we-do-layer,
  #morph-blob,
  #cta-reveal-layer {
    will-change: transform, opacity;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  #hero                     { contain: layout style paint; }
  #who-we-are               { contain: layout style paint; }
  #zoom-portal-trigger      { contain: layout style; }
  #morph-transition-trigger { contain: layout style; }

  @supports (-webkit-touch-callout: none) {
    body { cursor: pointer; }
  }
`;

const MOBILE_STYLES = `
  html { scroll-behavior: smooth; }

  .mobile-section {
    content-visibility: auto;
    contain-intrinsic-size: auto 100vh;
  }
  .mobile-section:nth-child(1),
  .mobile-section:nth-child(2) {
    content-visibility: visible;
  }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function HomeClient() {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(IS_MOBILE_UA);
  const mainRef = useRef<HTMLDivElement>(null);

  // ── Mobile detection ────────────────────────────────────────────────────────
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT || IS_MOBILE_UA);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    checkMobile();
    setIsReady(true);

    let rafId: number;
    const debouncedCheck = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkMobile);
    };

    window.addEventListener('resize', debouncedCheck, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedCheck);
      cancelAnimationFrame(rafId);
    };
  }, [checkMobile]);

  // ── Scroll body styles ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.style.scrollBehavior = isMobile ? 'smooth' : 'auto';
    document.body.style.overscrollBehavior = 'auto';
    document.body.style.touchAction = 'pan-y';

    return () => {
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
    };
  }, [isMobile]);

  // ── GSAP animations — desktop only ────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !mainRef.current || isMobile || IS_MOBILE_UA) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.clearScrollMemory('manual');

      // ── 1) HERO OVERLAY FADE ──────────────────────────────────────────────
      gsap.to('#hero-black-overlay', {
        opacity: 1,
        ease: 'none',
        overwrite: 'auto',
        scrollTrigger: {
          trigger: '#who-we-are',
          start: 'top 90%',
          end: 'top 20%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // ── 2) ZOOM PORTAL (WHO WE ARE → WHAT WE DO) ─────────────────────────
      gsap.timeline({
        scrollTrigger: {
          trigger: '#zoom-portal-trigger',
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: 3000,
        },
      })
        .to(
          '#who-we-are-portal-content',
          {
            scale: 4,
            opacity: 0,
            filter: 'blur(18px)',
            ease: 'power2.inOut',
            duration: 1,
            overwrite: 'auto',
          },
          0
        )
        .fromTo(
          '#what-we-do-portal-content',
          { scale: 0.25, opacity: 0, filter: 'blur(25px)', pointerEvents: 'none' },
          { scale: 1, opacity: 1, filter: 'blur(0px)', pointerEvents: 'auto', ease: 'power2.out', duration: 1 },
          0.25
        );

      // ── 3) MORPH TRANSITION (WHAT WE DO → CTA) ───────────────────────────
      gsap.timeline({
        scrollTrigger: {
          trigger: '#morph-transition-trigger',
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: 3000,
        },
      })
        .to(
          '#what-we-do-layer',
          { opacity: 0, scale: 0.9, filter: 'blur(18px)', duration: 0.6, ease: 'power2.in', overwrite: 'auto' },
          0
        )
        .fromTo(
          '#morph-blob',
          { scale: 0, opacity: 0, borderRadius: '50%' },
          { scale: 18, opacity: 1, borderRadius: '20%', duration: 0.8, ease: 'power2.inOut' },
          0.2
        )
        .fromTo(
          '#cta-reveal-layer',
          { opacity: 0, y: 80, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
          0.5
        )
        .to('#morph-blob', { opacity: 0, duration: 0.4 }, 1.1);

      // ── 4) GENERAL REVEALS ────────────────────────────────────────────────
      const fadeEls = gsap.utils.toArray<Element>('.fade-in-up');
      if (fadeEls.length) {
        gsap.set(fadeEls, { y: 50, opacity: 0 });
        fadeEls.forEach((el) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            overwrite: 'auto',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }, mainRef);

    return () => ctx.revert();
  }, [isReady, isMobile]);

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <style>{SHARED_STYLES + MOBILE_STYLES}</style>
        <main className="relative bg-black min-h-screen" data-page="home">
          <section className="mobile-section relative h-screen w-full bg-black">
            <HeroSection />
          </section>

          <section className="mobile-section relative bg-black min-h-screen">
            <WhoWeAreSection />
          </section>

          <section className="mobile-section relative bg-black min-h-screen">
            <WhatWeDoSection />
          </section>

          <section className="mobile-section relative bg-black min-h-screen">
            <ClientsSection />
          </section>

          <section className="mobile-section relative bg-black min-h-screen">
            <CTASection />
          </section>
        </main>
      </>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  return (
    <>
      <style>{SHARED_STYLES + DESKTOP_STYLES}</style>

      <main
        ref={mainRef}
        className="relative bg-black min-h-screen"
        data-page="home"
        style={{
          overflowX: 'hidden',
          touchAction: 'pan-y',
        }}
      >
        {/* SECTION 1: HERO */}
        <section
          id="hero"
          className="relative h-screen w-full bg-black"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <HeroSection />
          <div
            id="hero-black-overlay"
            className="absolute inset-0 bg-black opacity-0 pointer-events-none"
            style={{ zIndex: 5 }}
          />
        </section>

        {/* SECTION 2: WHO WE ARE */}
        <section
          id="who-we-are"
          className="relative z-10 bg-black min-h-screen shadow-[0_-50px_100px_rgba(0,0,0,0.9)]"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <WhoWeAreSection />
        </section>

        {/* SECTION 3: ZOOM PORTAL */}
        <section
          id="zoom-portal-trigger"
          className="relative z-20 h-screen w-full bg-black overflow-hidden"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <div
            id="who-we-are-portal-content"
            className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6"
          >
            <h2 className="text-5xl sm:text-6xl md:text-[90px] font-black text-white tracking-tighter leading-none mb-6">
              DIVE <br />
              <span className="text-white/30 italic">DEEPER</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-lg">
              Entering the digital core of innovation.
            </p>
          </div>

          <div
            id="what-we-do-portal-content"
            className="absolute inset-0 z-40 opacity-0 pointer-events-none"
          >
            <WhatWeDoSection />
          </div>
        </section>

        {/* SECTION 4: MORPH TRANSITION */}
        <section
          id="morph-transition-trigger"
          className="relative z-30 h-screen w-full overflow-hidden bg-black"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <div id="what-we-do-layer" className="absolute inset-0 z-40 bg-black">
            <ClientsSection />
          </div>

          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div id="morph-blob" className="w-32 h-32 bg-black opacity-0" />
          </div>

          <div id="cta-reveal-layer" className="absolute inset-0 z-[60] opacity-0">
            <CTASection />
          </div>
        </section>
      </main>
    </>
  );
}