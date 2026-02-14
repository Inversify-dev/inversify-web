import { Metadata } from 'next';

// Place this in: src/app/portfolio/metadata.ts
// Then in src/app/portfolio/page.tsx add: export { metadata } from './metadata';

export const metadata: Metadata = {
  title: "Project Gallery | Interactive 3D Showcase | Inversify",
  description:
    "Experience our work in a stunning 3D interactive gallery. Browse Inversify's selected projects featuring web development, e-commerce, and creative digital solutions in an immersive dome environment.",
  keywords: [
    "3D project gallery",
    "interactive portfolio",
    "web design showcase",
    "project showcase sri lanka",
    "creative web agency",
    "innovative portfolio",
  ],
  openGraph: {
    title: "Selected Works | Inversify 3D Gallery",
    description: "Explore our projects in an immersive 3D gallery experience",
    url: "https://inversify.lk/portfolio",
    type: "website",
    images: [
      {
        url: "/images/logo-icon.png",
        width: 1200,
        height: 630,
        alt: "Inversify Project Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inversify 3D Project Gallery",
    description: "Browse our work in an immersive experience",
    images: ["/images/logo-icon.png"],
  },
  alternates: { canonical: "https://inversify.lk/portfolio" },
};