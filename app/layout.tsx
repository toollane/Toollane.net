import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import { defaultSEO } from "./seo";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://toollane.com"
  ),

  title: {
    default: defaultSEO.title,

    template:
      "%s | Toollane",
  },

  description:
    defaultSEO.description,

  keywords:
    defaultSEO.keywords,

  openGraph:
    defaultSEO.openGraph,

  twitter:
    defaultSEO.twitter,

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical:
      "https://toollane.net",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fff8df] text-[#171717] antialiased">
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}