import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { MobileNav } from "@/components/navigation/MobileNav";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { AdultAgeGateOverlay } from "@/components/compliance/AdultAgeGateOverlay";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.brandName} — Polskie Porno, Filmy 18+ i Platforma Twórczyń`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(`https://${siteConfig.domain}`),
  alternates: {
    canonical: `https://${siteConfig.domain}`,
    languages: {
      "pl-PL": `https://${siteConfig.domain}`,
      "en-US": `https://${siteConfig.domain}`,
    },
  },
  openGraph: {
    title: `${siteConfig.brandName} — Polskie Porno, Filmy 18+ i Twórcy`,
    description: siteConfig.description,
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.name,
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.brandName} — Platforma 18+`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandName} — Polskie Porno i Filmy 18+`,
    description: siteConfig.description,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    rating: "RTA-5042-1996-1400-1577-RTA",
    "RATING": "adult",
    "Age-Rating": "18+",
    "content-language": "pl, en",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `https://${siteConfig.domain}/#website`,
      url: `https://${siteConfig.domain}`,
      name: siteConfig.name,
      alternateName: ["OnlyYou", "OnlyYouHub", "OnlyYou.Club"],
      description: siteConfig.description,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `https://${siteConfig.domain}/explore?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: ["pl-PL", "en-US"],
    },
    {
      "@type": "Organization",
      "@id": `https://${siteConfig.domain}/#organization`,
      name: siteConfig.name,
      url: `https://${siteConfig.domain}`,
      logo: {
        "@type": "ImageObject",
        url: `https://${siteConfig.domain}/logo.png`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-zinc-100 antialiased flex flex-col min-h-screen selection:bg-brand-primary/30 selection:text-brand-primary">
        <I18nProvider>
          <AuthProvider>
            <AdultAgeGateOverlay />
            <VisitorTracker />
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
            <MobileNav />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
