import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "./providers/SmoothScrollProvider";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inversify.lk"),

  title: {
    default: "Inversify",
    template: "%s | Inversify",
  },
  description:
    "Inversify is Sri Lanka's premier web development and e-commerce agency. We build cutting-edge websites, online stores, custom software, and digital solutions that drive business growth. Expert web design, SEO, and digital marketing services in Colombo & worldwide.",
  keywords: [
    "web development sri lanka",
    "website design sri lanka",
    "e-commerce development sri lanka",
    "web design colombo",
    "website development colombo",
    "online store development sri lanka",
    "custom software development sri lanka",
    "ecommerce website design",
    "responsive web design",
    "mobile app development",
    "shopify development sri lanka",
    "woocommerce development",
    "wordpress development sri lanka",
    "react development",
    "nextjs development",
    "digital agency sri lanka",
    "web development company colombo",
    "best web designers sri lanka",
    "professional website design",
    "business website development",
    "corporate website design",
    "SEO services sri lanka",
    "digital marketing sri lanka",
    "UI UX design sri lanka",
    "website maintenance sri lanka",
    "web hosting sri lanka",
    "domain registration sri lanka",
    "GSAP animations",
    "framer motion",
    "three.js development",
    "progressive web apps",
    "headless cms",
    "web developer in sri lanka",
    "freelance web developer sri lanka",
    "affordable web design sri lanka",
    "best web development agency colombo",
  ],
  authors: [
    { name: "Inversify", url: "https://inversify.lk" },
    { name: "Inversify Team" },
  ],
  creator: "Inversify - Digital Innovation Agency",
  publisher: "Inversify",
  applicationName: "Inversify Digital Solutions",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  category: "Web Development",
  classification: "Business",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.ico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico/favicon-16x16.ico", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/favicon.ico/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  

  // ✅ REMOVED: manifest link — this is what triggers the "Install App" banner.
  // Browsers see a valid manifest + icons and automatically show the PWA install prompt.
  // manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://inversify.lk",
    siteName: "Inversify - Web Development Sri Lanka",
    title: "Inversify | Leading Web Development & E-Commerce Agency in Sri Lanka",
    description:
      "Transform your business with Inversify's premium web development, e-commerce solutions, and digital marketing services. Sri Lanka's most trusted digital agency with global standards.",
    images: [
      {
        url: "/images/logo-icon.png",
        width: 1200,
        height: 630,
        alt: "Inversify - Web Development Excellence",
      },
    ],
    emails: ["invert@inversify.lk"],
    phoneNumbers: ["+94704621228"],
    countryName: "Sri Lanka",
  },

  twitter: {
    card: "summary_large_image",
    site: "@inversify",
    creator: "@inversify",
    title: "Inversify",
    description:
      "Leading digital agency in Sri Lanka. Expert web development, e-commerce, and custom software solutions that drive results.",
    images: ["/images/logo-icon.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://inversify.lk",
    languages: {
      "en-US": "https://inversify.lk",
      "en-GB": "https://inversify.lk",
      "en-LK": "https://inversify.lk",
    },
  },

  verification: {
    google: "fidDS514qDaRbLnSuEYq_V9Ch72Yt5kn4ExozxhX5h4",
  },

  other: {
    // ✅ REMOVED: "mobile-web-app-capable" and "apple-mobile-web-app-capable"
    // These two meta tags are the second trigger for the install banner on Android & iOS.
    // Removing them tells browsers this is a regular website, not an installable PWA.
    // "mobile-web-app-capable": "yes",       ← REMOVED
    // "apple-mobile-web-app-capable": "yes", ← REMOVED
    // "apple-mobile-web-app-status-bar-style": "black-translucent", ← REMOVED (only applies to installed PWAs)
    "apple-mobile-web-app-title": "Inversify",
    "application-name": "Inversify",
    "msapplication-TileColor": "#000000",
    "msapplication-TileImage": "/favicon.ico/web-app-manifest-192x192.png",
    "theme-color": "#000000",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        <meta name="geo.region" content="LK" />
        <meta name="geo.placename" content="Colombo" />

        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="language" content="English" />
        <meta name="country" content="Sri Lanka" />
        <meta name="city" content="Colombo" />
        <meta name="apple-mobile-web-app-title" content="Inversify" />

        {/* ── Schema.org: Organization ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://inversify.lk/#organization",
              name: "Inversify",
              url: "https://inversify.lk",
              logo: {
                "@type": "ImageObject",
                url: "https://inversify.lk/favicon.ico/web-app-manifest-512x512.png",
                width: 512,
                height: 512,
              },
              image: "https://inversify.lk/images/logo-icon.png",
              description: "Premium web development and e-commerce solutions in Sri Lanka",
              email: "invert@inversify.lk",
              telephone: "+94704621228",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Colombo",
                addressRegion: "Western Province",
                addressCountry: "LK",
              },
              areaServed: [
                { "@type": "Country", name: "Sri Lanka" },
                { "@type": "Place", name: "Worldwide" },
              ],
              sameAs: [],
              priceRange: "$$",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                reviewCount: "47",
              },
            }),
          }}
        />

        {/* ── Schema.org: Local Business ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://inversify.lk/#localbusiness",
              name: "Inversify",
              image: "https://inversify.lk/images/logo-icon.png",
              url: "https://inversify.lk",
              telephone: "+94704621228",
              email: "invert@inversify.lk",
              address: {
                "@type": "PostalAddress",
                streetAddress: "",
                addressLocality: "Colombo",
                addressRegion: "Western Province",
                postalCode: "",
                addressCountry: "LK",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
              },
              sameAs: [],
            }),
          }}
        />

        {/* ── Schema.org: WebSite ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://inversify.lk/#website",
              url: "https://inversify.lk",
              name: "Inversify",
              description: "Premium web development and e-commerce solutions",
              publisher: { "@id": "https://inversify.lk/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://inversify.lk/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              inLanguage: "en-US",
            }),
          }}
        />

        {/* ── Schema.org: Service ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "Web Development & E-Commerce Solutions",
              provider: { "@id": "https://inversify.lk/#organization" },
              areaServed: { "@type": "Country", name: "Sri Lanka" },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Digital Services",
                itemListElement: [
                  {
                    "@type": "OfferCatalog",
                    name: "Web Development",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Custom Website Development",
                          description: "Tailored web solutions for businesses",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "E-Commerce Development",
                          description: "Full-featured online stores",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Progressive Web Apps",
                          description: "Modern, fast, app-like websites",
                        },
                      },
                    ],
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Digital Marketing",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "SEO Services",
                          description: "Search engine optimization",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Content Marketing",
                          description: "Strategic content creation",
                        },
                      },
                    ],
                  },
                ],
              },
            }),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){document.documentElement.setAttribute('data-theme','dark');})();`,
          }}
        />
      </head>

      <body
        className={`${inter.className} bg-black text-white antialiased`}
        suppressHydrationWarning
      >
        <SmoothScrollProvider>
          <ClientLayout>{children}</ClientLayout>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}