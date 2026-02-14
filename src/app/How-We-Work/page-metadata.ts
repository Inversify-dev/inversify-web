import { Metadata } from 'next';

// Place this in: src/app/How-We-Work/metadata.ts
// Then in src/app/How-We-Work/page.tsx add: export { metadata } from './metadata';

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
    images: [
      {
        url: "/images/logo-icon.png",
        width: 1200,
        height: 630,
        alt: "Inversify - How We Work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Work | Inversify",
    description: "The process behind every great Inversify project",
    images: ["/images/logo-icon.png"],
  },
  alternates: { canonical: "https://inversify.lk/How-We-Work" },
};