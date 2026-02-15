'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import HeroSection from '@/components/layout/HeroSection';
import WhoWeAreSection from '@/components/layout/WhoWeAreSection';
import WhatWeDoSection from '@/components/layout/WhatWeDoSection';
import ClientsSection from '@/components/layout/ClientsSection';
import CTASection from '@/components/layout/CTASection';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── MOBILE DETECTION ─────────────────────────────────────────────────────────
const detectMobile = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.innerWidth < 1024 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

// Register GSAP plugin once at module scope
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const SHARED_STYLES = `
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
  html {
    scroll-behavior: smooth;
    overscroll-behavior: none;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
  body {
    overflow-x: hidden;
    margin: 0;
    background: #000;
    overscroll-behavior: none;
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
`;

const MOBILE_STYLES = `
  body {
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  .mobile-section {
    min-height: 100vh;
    position: relative;
  }
`;

const DESKTOP_STYLES = `
  #hero-black-overlay,
  #who-we-are-portal-content,
  #what-we-do-portal-content,
  #what-we-do-layer,
  #morph-blob,
  #cta-reveal-layer {
    will-change: transform, opacity;
    transform: translate3d(0, 0, 0);
  }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean>(true); // Default to mobile for safety
  const [isReady, setIsReady] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // ── Mobile detection with proper hydration ─────────────────────────────────
  useEffect(() => {
    const checkAndSetMobile = () => {
      const mobile = detectMobile();
      setIsMobile(mobile);
      setIsReady(true);
      console.log('Device type:', mobile ? 'Mobile' : 'Desktop');
    };

    checkAndSetMobile();

    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkAndSetMobile);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── GSAP animations — DESKTOP ONLY ─────────────────────────────────────────
  useEffect(() => {
    if (!isReady || isMobile || !mainRef.current) return;

    console.log('Initializing GSAP animations (desktop only)');

    const ctx = gsap.context(() => {
      // Clear any existing scroll triggers
      ScrollTrigger.getAll().forEach(st => st.kill());

      // ── 1) HERO OVERLAY FADE ──────────────────────────────────────────────
      gsap.to('#hero-black-overlay', {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#who-we-are',
          start: 'top 90%',
          end: 'top 20%',
          scrub: true,
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
          anticipatePin: 1,
        },
      })
        .to('#who-we-are-portal-content', {
          scale: 4,
          opacity: 0,
          filter: 'blur(18px)',
          ease: 'power2.inOut',
          duration: 1,
        }, 0)
        .fromTo('#what-we-do-portal-content', 
          { scale: 0.25, opacity: 0, filter: 'blur(25px)' },
          { scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 1 },
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
          anticipatePin: 1,
        },
      })
        .to('#what-we-do-layer', {
          opacity: 0,
          scale: 0.9,
          filter: 'blur(18px)',
          duration: 0.6,
          ease: 'power2.in',
        }, 0)
        .fromTo('#morph-blob',
          { scale: 0, opacity: 0, borderRadius: '50%' },
          { scale: 18, opacity: 1, borderRadius: '20%', duration: 0.8, ease: 'power2.inOut' },
          0.2
        )
        .fromTo('#cta-reveal-layer',
          { opacity: 0, y: 80, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
          0.5
        )
        .to('#morph-blob', { opacity: 0, duration: 0.4 }, 1.1);

      // ── 4) FADE IN ANIMATIONS ────────────────────────────────────────────
      const fadeEls = gsap.utils.toArray<Element>('.fade-in-up');
      if (fadeEls.length) {
        gsap.set(fadeEls, { y: 50, opacity: 0 });
        fadeEls.forEach((el) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }

      // Refresh after initialization
      ScrollTrigger.refresh();
    }, mainRef);

    return () => {
      console.log('Cleaning up GSAP');
      ctx.revert();
    };
  }, [isReady, isMobile]);

  // ── Prevent flash before ready ─────────────────────────────────────────────
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: SHARED_STYLES + MOBILE_STYLES }} />
        <main className="relative bg-black">
          <section className="mobile-section">
            <HeroSection />
          </section>

          <section className="mobile-section">
            <WhoWeAreSection />
          </section>

          <section className="mobile-section">
            <WhatWeDoSection />
          </section>

          <section className="mobile-section">
            <ClientsSection />
          </section>

          <section className="mobile-section">
            <CTASection />
          </section>
        </main>
      </>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SHARED_STYLES + DESKTOP_STYLES }} />

      <main ref={mainRef} className="relative bg-black">
        {/* SECTION 1: HERO */}
        <section id="hero" className="relative h-screen w-full bg-black">
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
          className="relative z-10 bg-black min-h-screen"
        >
          <WhoWeAreSection />
        </section>

        {/* SECTION 3: ZOOM PORTAL */}
        <section
          id="zoom-portal-trigger"
          className="relative z-20 h-screen w-full bg-black overflow-hidden"
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
            className="absolute inset-0 z-40 opacity-0"
          >
            <WhatWeDoSection />
          </div>
        </section>

        {/* SECTION 4: MORPH TRANSITION */}
        <section
          id="morph-transition-trigger"
          className="relative z-30 h-screen w-full overflow-hidden bg-black"
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