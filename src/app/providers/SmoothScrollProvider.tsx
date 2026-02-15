"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // ✅ COMPREHENSIVE MOBILE DETECTION - Block Lenis on ALL mobile scenarios
    const isMobile =
      // Width check (tablets included)
      window.innerWidth < 1024 ||
      // Touch device check
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // User agent check
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // ✅ CRITICAL: Exit early on mobile - let native scroll work
    if (isMobile) {
      console.log("Mobile device detected - using native scroll");
      return;
    }

    // Desktop-only smooth scrolling below ─────────────────────────────────
    console.log("Desktop detected - initializing Lenis");

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0, // ✅ Disable touch scroll multiplier
      syncTouch: false,   // ✅ Don't sync touch events
      infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker for animation loop
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // ✅ Proper cleanup
    return () => {
      console.log("Cleaning up Lenis");
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}