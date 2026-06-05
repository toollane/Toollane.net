import type { Metadata } from "next";

import { tools } from "@/data/tools";
import { siteConfig } from "@/app/seo";

export function getToolMetadata(href: string): Metadata {
  const tool = tools.find((item) => item.href === href);

  if (!tool) {
    throw new Error(`Tool metadata not found for href: ${href}`);
  }

  const title = tool.seoTitle || `${tool.name} | Toollane`;
  const description = tool.seoDescription || tool.description;
  const url = `${siteConfig.url}${tool.href}`;
  const ogImage = `${siteConfig.url}/og-image.png`;

  return {
    title,
    description,

    keywords: tool.keywords,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${tool.name} - Toollane`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
  };
}