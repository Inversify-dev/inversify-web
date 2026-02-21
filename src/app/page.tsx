import { Metadata } from 'next';
import HomeClient from './HomeClient';

// ─── SEO METADATA ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Inversify | Sri Lanka's Leading Web Development & E-Commerce Agency",
  description:
    "Transform your business with Inversify — Sri Lanka's premier web development agency. Stunning websites, powerful e-commerce platforms, and custom digital solutions that drive results. Expert web design and digital marketing in Colombo.",
  keywords: [
    "web development sri lanka",
    "website design colombo",
    "ecommerce development sri lanka",
    "best web agency sri lanka",
    "professional website design",
    "custom web development",
    "online store development",
    "digital agency colombo",
  ],
  openGraph: {
    title: "Inversify",
    description:
      "Sri Lanka's most innovative digital agency. We build websites that convert, e-commerce platforms that sell, and digital experiences that captivate.",
    url: "https://inversify.lk",
    type: "website",
    images: [
      {
        url: "/images/logo-icon.png",
        width: 1200,
        height: 630,
        alt: "Inversify Web Development Agency Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inversify | Leading Digital Agency in Sri Lanka",
    description: "Transform your business with cutting-edge web solutions",
    images: ["/images/logo-icon.png"],
  },
  alternates: { canonical: "https://inversify.lk" },
};

// ─── PAGE (SERVER COMPONENT) ──────────────────────────────────────────────────
// This server component renders SEO-critical content immediately in HTML.
// HomeClient handles all animations, GSAP, and interactive logic client-side.
// Google sees the headings/text below even with JS disabled — fixing indexing.
export default function HomePage() {
  return (
    <>
      {/*
        ── SEO SHELL ────────────────────────────────────────────────────────────
        Visually hidden but fully readable by Google's crawler.
        These elements are rendered server-side as plain HTML — no JS required.
        HomeClient overlays the real visual experience on top via absolute/fixed
        positioning, so users never see this layer.
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
        <h1>Inversify — Sri Lanka&apos;s Leading Web Development &amp; E-Commerce Agency</h1>
        <p>
          Inversify is Sri Lanka&apos;s premier digital agency based in Colombo. We design and
          develop high-performance websites, e-commerce platforms, custom software, and
          immersive digital experiences that drive real business growth. Serving clients
          across Sri Lanka and worldwide.
        </p>
        <h2>Who We Are</h2>
        <p>
          A team of expert designers, developers, and strategists passionate about building
          digital products that make an impact. From startups to enterprise brands, we craft
          tailored solutions that perform.
        </p>
        <h2>What We Do</h2>
        <p>
          Web development, e-commerce solutions, UI/UX design, SEO, digital marketing,
          custom software development, and progressive web apps — all built to global
          standards from our studio in Colombo, Sri Lanka.
        </p>
        <h2>Our Clients</h2>
        <p>
          We partner with businesses across Sri Lanka and internationally to deliver
          transformative digital experiences that set them apart from the competition.
        </p>
        <h2>Ready to Start?</h2>
        <p>
          Contact Inversify today and let&apos;s build something extraordinary together.
          Reach us at invert@inversify.lk or call +94704621228.
        </p>
      </div>

      {/*
        ── CLIENT SHELL ─────────────────────────────────────────────────────────
        All animations, GSAP, ScrollTrigger, canvas, mobile detection, and
        interactive UI live here. Hydrates after the SEO shell above is served.
      */}
      <HomeClient />
    </>
  );
}