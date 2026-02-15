'use client';

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "@/components/layout/SplashScreen"; 
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SPLASH_KEY = "inversify-splash-seen";
const SPLASH_DURATION = 5700;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // --- Splash Screen Logic ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only show splash on Home page ('/')
    if (pathname !== "/") {
      setShowSplash(false);
      setIsReady(true);
      return;
    }

    const hasSeenSplash = sessionStorage.getItem(SPLASH_KEY);

    if (hasSeenSplash === "true") {
      setShowSplash(false);
      setIsReady(true);
      return;
    }

    // Trigger Splash
    setShowSplash(true);
    setIsReady(true);

    const timer = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "true");
      setShowSplash(false);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleSplashComplete = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(SPLASH_KEY, "true");
    setShowSplash(false);
  }, []);

  // --- Smooth Scroll for Desktop Only ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ BULLETPROOF MOBILE DETECTION
    const isMobile =
      window.innerWidth < 1024 ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // ✅ Exit on mobile - use native scroll
    if (isMobile) {
      console.log("Mobile detected - using native scroll");
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
      return;
    }

    // ✅ Desktop only - Initialize Lenis
    console.log("Desktop detected - initializing smooth scroll");

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0,
      syncTouch: false,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      console.log("Cleaning up smooth scroll");
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  // Prevent FOUC (Flash of Unstyled Content) before check completes
  if (!isReady) {
    return <div className="fixed inset-0 bg-black z-[9999]" />;
  }

  return (
    <>
      {/* Navbar - Fixed to top */}
      <Navbar isSplashDone={!showSplash} />

      {/* Main Content Wrapper */}
      <main className="relative w-full min-h-screen bg-black flex flex-col">
        
        {/* Page Children - Grows to fill space */}
        <div className="flex-grow">
            {children}
        </div>

        {/* Footer - Renders at bottom of flow, hidden if splash is active */}
        {!showSplash && <Footer />}
        
      </main>

      {/* Splash Screen Overlay */}
      <AnimatePresence mode="wait">
        {pathname === "/" && showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999]"
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}