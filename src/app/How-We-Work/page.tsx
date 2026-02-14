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

export default function PortfolioPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Single ScrollTrigger refresh after everything loads
  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted]);

  return (
    <main
      ref={containerRef}
      className="bg-black min-h-screen text-white overflow-x-hidden"
      style={{ touchAction: 'pan-y', overscrollBehavior: 'none' }}
    >
      <AboutHero />
      <RoadmapJourney />
    </main>
  );
}