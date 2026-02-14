import { Metadata } from 'next';

// Place this in: src/app/page.tsx
// Add at the top: export { metadata } from './page-metadata';
// OR just paste this export directly into your src/app/page.tsx

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