import { Metadata } from 'next';
import DigitalizationClient from './DigitalizationClient';

export const metadata: Metadata = {
  title: "Contact Us | Get Your Free Quote | Inversify Sri Lanka",
  description:
    "Ready to transform your digital presence? Contact Inversify for a free consultation. We respond within 2 hours. Expert advice on web development, e-commerce, SEO, and digital solutions for your Sri Lankan business.",
  keywords: [
    "contact web developer sri lanka",
    "get website quote",
    "free web consultation sri lanka",
    "web development inquiry",
    "contact digital agency colombo",
    "website cost sri lanka",
    "ecommerce quote",
  ],
  openGraph: {
    title: "Get Started Today | Contact Inversify",
    description:
      "Let's build something amazing together. Free consultation, 2-hour response time guaranteed.",
    url: "https://inversify.lk/digitalization",
    type: "website",
    images: [{ url: "/images/logo-icon.png", width: 1200, height: 630, alt: "Contact Inversify Sri Lanka" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Inversify | Let's Get Started",
    description: "Free consultation with Sri Lanka's leading web agency",
    images: ["/images/logo-icon.png"],
  },
  alternates: { canonical: "https://inversify.lk/digitalization" },
};

export default function DigitalizationPage() {
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
        <h1>Contact Inversify | Get Your Free Quote Today</h1>
        <p>
          Ready to transform your digital presence? Contact Inversify — Sri Lanka&apos;s
          leading web development agency — for a free consultation. We respond within 2
          hours with expert advice tailored to your business.
        </p>
        <h2>Let&apos;s Get Started</h2>
        <p>
          Transform your business with modern digital solutions. We build premium websites,
          automation systems, and scalable platforms that make your brand unstoppable.
          Based in Colombo, serving clients across Sri Lanka and worldwide.
        </p>
        <h2>Contact Information</h2>
        <p>
          Email us at invert@inversify.lk or call +94 704 621 228. We offer free
          30-minute strategy calls — no automated replies, just real conversations with
          our expert team.
        </p>
        <h2>What We Can Help You With</h2>
        <p>
          Website redesign, e-commerce development, custom web applications, SEO services,
          digital marketing, and more. Share your vision and we&apos;ll bring it to life.
        </p>
      </div>

      {/* CLIENT SHELL — all animations, form logic, GSAP, interactive UI */}
      <DigitalizationClient />
    </>
  );
}