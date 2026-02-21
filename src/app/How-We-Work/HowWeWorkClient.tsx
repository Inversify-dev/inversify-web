'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AboutHero from '@/components/layout/AboutHero';
import RoadmapJourney from '@/components/layout/RoadmapJourney';

// Register plugin once at module scope
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HowWeWorkClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Proper ScrollTrigger initialization
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
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
      ref={containerRef}
      className="bg-black min-h-screen text-white overflow-x-hidden"
      style={{ 
        touchAction: 'pan-y', 
        overscrollBehavior: 'auto',
        overflowX: 'hidden',
      }}
    >
      <AboutHero />
      <RoadmapJourney />
    </main>
  );
}