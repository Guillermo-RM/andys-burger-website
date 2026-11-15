import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { SiteLayout } from "@/components/site-layout";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  absoluteUrl,
  businessIdentity,
  businessStructuredData,
  siteUrl,
  websiteStructuredData,
} from "@/lib/site";
import { siteImages } from "@/lib/images";
import "./globals.css";

const googleTagManagerId =
  process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-KLLPKKG3";
const defaultTitle = "Hamburguesas San Ramón | Andy's Burger";
const defaultDescription = businessIdentity.description;

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Andy's Burger",
  title: {
    default: defaultTitle,
    template: "%s | Andy's Burger",
  },
  description: defaultDescription,
  authors: [{ name: "Andy's Burger", url: absoluteUrl("/") }],
  creator: "Andy's Burger",
  publisher: "Andy's Burger",
  category: "Restaurante",
  keywords: [
    "hamburguesas San Ramón",
    "hamburguesería San Ramón",
    "Andy's Burger",
    "hamburguesas a domicilio San Ramón",
    "hamburguesas para llevar San Ramón",
  ],
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "CR-A",
    "geo.placename": "San Ramón, Alajuela",
    "geo.position": "10.1056999;-84.4650583",
    ICBM: "10.1056999, -84.4650583",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    url: absoluteUrl("/"),
    locale: "es_CR",
    siteName: "Andy's Burger",
    images: [
      {
        url: siteImages.homeHero.social.src,
        width: siteImages.homeHero.social.width,
        height: siteImages.homeHero.social.height,
        alt: siteImages.homeHero.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: siteImages.homeHero.social.src,
        alt: siteImages.homeHero.alt,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#010101",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CR">
      <body className={nunito.variable}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [websiteStructuredData, businessStructuredData],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <ScrollReveal />
        <SiteLayout>{children}</SiteLayout>
        <GoogleTagManager gtmId={googleTagManagerId} />
      </body>
    </html>
  );
}
