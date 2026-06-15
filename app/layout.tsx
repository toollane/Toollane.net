import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WebsiteSchema from "@/components/WebsiteSchema";
import OrganizationSchema from "@/components/OrganizationSchema";
import ConsentManager from "@/components/ConsentManager";
import { siteConfig } from "./seo";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AdSenseScript from "@/components/AdSenseScript";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

other: {
  "google-adsense-account": "ca-pub-6697657323751063",
},

icons: {
  icon: "/favicon.ico",
  apple: "/apple-touch-icon.png",
},

  title: {
    default: siteConfig.title,
    template: "%s | Toollane",
  },

  description: siteConfig.description,

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

  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.className} min-h-screen bg-[#fff8df] text-[#171717] antialiased`}
      >
        <WebsiteSchema />
        <OrganizationSchema />
        <GoogleAnalytics />
        <AdSenseScript />
        
        <Navbar />

        {children}

        <Footer />  

        <ConsentManager />
      </body>
    </html>
  );
}