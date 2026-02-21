import { Metadata } from 'next';
import HowWeWorkClient from './HowWeWorkClient';

export const metadata: Metadata = {
  title: "How We Work | Our Process & Approach | Inversify",
  description:
    "Discover how Inversify builds exceptional digital products. Our proven process combines strategy, design, and development to deliver outstanding results — on time, every time. See the journey from idea to launch.",
  keywords: [
    "web development process sri lanka",
    "how we build websites",
    "digital agency workflow",
    "web design process colombo",
    "agile web development",
    "project roadmap",
    "website development steps",
    "inversify process",
  ],
  openGraph: {
    title: "How We Work | Inversify's Proven Process",
    description:
      "From discovery to launch — explore the structured, creative process that powers every Inversify project.",
    url: "https://inversify.lk/How-We-Work",
    type: "website",
    images: [{ url: "/images/logo-icon.png", width: 1200, height: 630, alt: "Inversify - How We Work" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Work | Inversify",
    description: "The process behind every great Inversify project",
    images: ["/images/logo-icon.png"],
  },
  alternates: { canonical: "https://inversify.lk/How-We-Work" },
};

export default function HowWeWorkPage() {
  return (
    <>
      {/* SEO SHELL — server-rendered, invisible to users, fully readable by Google */}
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
        <h1>How We Work | Inversify&apos;s Proven Process</h1>
        <p>
          Discover how Inversify builds exceptional digital products for businesses in Sri Lanka
          and worldwide. Our proven process combines strategy, creative design, and expert
          development to deliver outstanding results — on time, every time.
        </p>
        <h2>Discovery &amp; Strategy</h2>
        <p>
          We begin every project with deep discovery — understanding your business goals,
          target audience, and competitive landscape to craft a winning digital strategy.
        </p>
        <h2>Design &amp; Prototyping</h2>
        <p>
          Our designers craft pixel-perfect UI/UX experiences that balance beauty and
          performance, creating prototypes that align with your brand and user needs.
        </p>
        <h2>Development &amp; Engineering</h2>
        <p>
          Expert engineers build your product using modern frameworks like Next.js, React,
          and custom solutions — optimised for speed, SEO, and scalability.
        </p>
        <h2>Launch &amp; Growth</h2>
        <p>
          We handle deployment, testing, and post-launch support to ensure your digital
          product performs from day one. Based in Colombo, serving clients across Sri Lanka
          and globally.
        </p>
      </div>

      {/* CLIENT SHELL — all animations, GSAP, interactive logic */}
      <HowWeWorkClient />
    </>
  );
}