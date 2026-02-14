"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Cached UA check (never triggers re-render) ─────────────────────────────
const IS_MOBILE_UA =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ CRITICAL FIX #1: Never run Lenis on mobile/touch devices.
    // Lenis intercepts touch events which breaks native scroll on many phones.
    // Mobile devices scroll perfectly fine with the browser's native scroll.
    const isMobileDevice =
      window.innerWidth < 768 ||
      IS_MOBILE_UA ||
      ("ontouchstart" in window && window.innerWidth < 1024);

    if (isMobileDevice) return;

    // Desktop-only smooth scrolling below ─────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });

    // ✅ CRITICAL FIX #2: Proper Lenis ↔ GSAP ScrollTrigger connection.
    // This keeps ScrollTrigger's scroll position in sync with Lenis.
    lenis.on("scroll", ScrollTrigger.update);

    // ✅ CRITICAL FIX #3: Use GSAP ticker instead of manual requestAnimationFrame.
    // The old RAF loop was NEVER cancelled (lenis.destroy() didn't stop it),
    // causing ghost Lenis instances to keep running after unmount.
    // GSAP ticker is properly removed in cleanup.
    // Note: GSAP ticker provides seconds → Lenis.raf() needs milliseconds.
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}