import { Metadata } from 'next';

// Place this in: src/app/invert/metadata.ts
// Then in src/app/invert/page.tsx add: export { metadata } from './metadata';

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