"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ Register ScrollTrigger normally
    gsap.registerPlugin(ScrollTrigger);

    // ✅ Refresh triggers on load to avoid stuck scroll / locked pages
    ScrollTrigger.refresh();

    return () => {
      // ✅ Kill all ScrollTriggers on unmount to prevent scroll freezing bugs
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.clearMatchMedia();
    };
  }, []);

  return <>{children}</>;
}
