import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://toollane.net"
  ),

  title: {
    default:
      "Toollane | Fast Online Tools for Everyday Tasks",

    template: "%s",
  },

  description:
    "Free online calculators, converters and utility tools built for speed, simplicity and everyday productivity.",

  openGraph: {
    title:
      "Toollane | Fast Online Tools for Everyday Tasks",

    description:
      "Free online calculators, converters and utility tools built for speed and simplicity.",

    url: "https://toollane.net",

    siteName: "Toollane",

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Toollane | Fast Online Tools for Everyday Tasks",

    description:
      "Free online calculators, converters and utility tools built for speed and simplicity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}