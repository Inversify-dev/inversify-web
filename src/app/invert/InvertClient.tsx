'use client';

import { useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Register GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Lazy-load heavy 3D section ───────────────────────────────────────────────
const PlanetScroll = dynamic(() => import('@/components/layout/PlanetScroll'), {
  loading: () => (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  ),
  ssr: false,
});

export default function InvertClient() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Stable handler (prevents rerenders)
  const handleHeroLoad = useCallback(() => setHeroLoaded(true), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Proper ScrollTrigger initialization
  useEffect(() => {
    if (!mounted) return;

    // ✅ Configure ScrollTrigger for native scroll
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    // ✅ Clear any existing ScrollTriggers from previous pages
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // ✅ Refresh after mount
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      // ✅ Clean up on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [mounted]);

  // ✅ Ensure native scroll behavior
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overscrollBehavior = 'auto';
    document.body.style.touchAction = 'pan-y';

    return () => {
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
    };
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 bg-black" />;
  }

  return (
    <main
      className="relative bg-black text-white selection:bg-purple-500 selection:text-white overflow-x-hidden"
      style={{ 
        overscrollBehavior: 'auto', 
        touchAction: 'pan-y',
        overflowX: 'hidden',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Image
            src="/images/whoweare12.webp"
            alt="Inversify - Ready to Invert Your Digital Universe"
            fill
            priority
            quality={100}
            sizes="100vw"
            className={`object-cover object-center transition-opacity duration-1000 ${
              heroLoaded ? 'opacity-80' : 'opacity-0'
            }`}
            onLoad={handleHeroLoad}
            unoptimized
          />

          {/* Fallback gradient before image loads */}
          {!heroLoaded && (
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black" />
          )}

          {/* Overlay (makes text pop + hides low-res artifacts) */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Soft purple atmospheric glow */}
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-700/25 blur-[150px]" />
        </div>

        {/* HERO TEXT */}
        <div className="relative z-10 px-6 max-w-7xl mx-auto -mt-[8vh]">
          <h1 className="flex flex-col items-center">
            <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[140px] font-black tracking-tighter uppercase leading-[0.85]">
              Ready To
            </span>

            <span className="text-6xl sm:text-7xl md:text-9xl lg:text-[160px] font-serif italic font-light text-purple-400 lowercase leading-none tracking-tight mt-1 drop-shadow-[0_0_25px_rgba(168,85,247,0.55)]">
              invert
            </span>

            <span className="text-sm sm:text-lg md:text-2xl mt-5 md:mt-8 text-white/60 font-light tracking-wide">
              Your digital universe awaits
            </span>
          </h1>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-6 md:bottom-10 flex flex-col items-center gap-2 animate-bounce opacity-40 z-20">
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/70">
            Scroll to begin
          </span>
          <div className="w-[1px] h-10 md:h-14 bg-white/70" />
        </div>

        {/* ── HERO BOTTOM BLEND (MOST IMPORTANT FIX) ── */}
        <div className="absolute bottom-0 left-0 w-full h-40 md:h-56 bg-gradient-to-b from-transparent via-black/80 to-black z-30 pointer-events-none" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION TRANSITION BLEND (SMOOTH CUT INTO PLANETSCROLL)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-black">
        {/* Top fade overlay to remove seam */}
        <div className="absolute top-0 left-0 w-full h-32 md:h-44 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />

        {/* Optional subtle noise for premium cinematic texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10 mix-blend-overlay" />

        {/* PlanetScroll Section */}
        <div className="relative z-0">
          <PlanetScroll />
        </div>
      </div>
    </main>
  );
}