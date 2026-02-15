"use client";

// ✅ SIMPLIFIED: No Lenis, no smooth scroll library - just native browser scroll
// This provider now does nothing except wrap children - normal scroll for all devices

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // No useEffect, no Lenis, no GSAP ticker - just pure native scroll
  return <>{children}</>;
}