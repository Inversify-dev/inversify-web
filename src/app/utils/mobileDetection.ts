"use client";

import { useEffect, useState } from "react";

const IS_MOBILE_UA =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const MOBILE_BREAKPOINT = 768;

export const useMobileDetection = () => {
  // ✅ Pre-seed from UA so there's no flash from false → true on phones
  const [isMobile, setIsMobile] = useState<boolean>(IS_MOBILE_UA);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT || IS_MOBILE_UA);
    };

    checkMobile();

    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkMobile);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { isMobile, isMounted };
};

export const isClient = typeof window !== "undefined";