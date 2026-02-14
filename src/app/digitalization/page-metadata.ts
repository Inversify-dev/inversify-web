import { Metadata } from 'next';

// Place this in: src/app/digitalization/metadata.ts
// Then in src/app/digitalization/page.tsx add: export { metadata } from './metadata';

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
    images: [
      {
        url: "/images/logo-icon.png",
        width: 1200,
        height: 630,
        alt: "Contact Inversify Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Inversify | Let's Get Started",
    description: "Free consultation with Sri Lanka's leading web agency",
    images: ["/images/logo-icon.png"],
  },
  alternates: { canonical: "https://inversify.lk/digitalization" },
};