import { Metadata } from 'next';
import InvertClient from './InvertClient';

// ─── SEO METADATA ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Ready to Invert? | Transform Your Digital Presence | Inversify",
  description:
    "Invert your digital universe with Inversify. Explore cutting-edge web development, 3D experiences, and creative digital solutions that transform businesses through technology.",
  keywords: [
    "digital transformation sri lanka",
    "innovative web design",
    "3D web experiences",
    "interactive portfolio",
    "creative web agency",
    "modern web development",
    "digital innovation",
  ],
  openGraph: {
    title: "Ready to Invert Your Digital Reality? | Inversify",
    description:
      "Experience the future of web design. Immersive 3D portfolios and cutting-edge digital experiences.",
    url: "https://inversify.lk/invert",
    type: "website",
    images: [
      {
        url: "/images/logo-icon.png",
        width: 1200,
        height: 630,
        alt: "Inversify - Digital Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready to Invert? | Inversify Portfolio",
    description: "Explore our universe of digital innovation",
    images: ["/images/logo-icon.png"],
  },
  alternates: { canonical: "https://inversify.lk/invert" },
};

// ─── PAGE (SERVER COMPONENT) ──────────────────────────────────────────────────
// This server component renders SEO-critical content immediately in HTML.
// InvertClient handles all animations, GSAP, 3D, and interactive logic.
// Google sees the headings/text below even with JS disabled — fixing indexing.
export default function InvertPage() {
  return (
    <>
      {/*
        ── SEO SHELL ────────────────────────────────────────────────────────────
        Visually hidden but fully readable by Google's crawler.
        Rendered server-side as plain HTML — zero JS dependency.
        InvertClient overlays the full visual experience on top.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        <h1>Ready to Invert Your Digital Universe? | Inversify</h1>
        <p>
          Step into the future of digital innovation with Inversify. We create immersive,
          3D-driven web experiences that push the boundaries of what a website can do.
          Our Invert platform showcases the cutting edge of interactive design and
          technology — built for businesses ready to stand out.
        </p>
        <h2>Immersive 3D Digital Experiences</h2>
        <p>
          Explore our portfolio of 3D web experiences, interactive animations, and
          next-generation digital products crafted by Inversify&apos;s team in Sri Lanka.
        </p>
        <h2>Digital Transformation Through Technology</h2>
        <p>
          From scroll-driven animations to real-time 3D environments, Inversify builds
          the web experiences that define modern brands. Ready to invert your digital
          presence? Contact us at invert@inversify.lk.
        </p>
        <h2>Your Digital Universe Awaits</h2>
        <p>
          Scroll to begin your journey through Inversify&apos;s universe of web innovation.
          Cutting-edge development meets world-class design — all from Colombo, Sri Lanka.
        </p>
      </div>

      {/*
        ── CLIENT SHELL ─────────────────────────────────────────────────────────
        All GSAP, 3D, PlanetScroll, hero image, and animations live here.
        Hydrates after the SEO shell above is served to the crawler.
      */}
      <InvertClient />
    </>
  );
}