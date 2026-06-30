import { MetadataRoute } from "next";

import { categories, tools } from "@/data/tools";
import { hubs } from "@/data/hubs";
import { babyNamePages } from "@/data/baby-names/pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = "https://toollane.net";

function isRecoveryBlockedBabyNameLandingPage(slug: string) {
  return slug.includes("starting-with");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const hubPages = hubs.map((hub) => ({
    url: `${baseUrl}${hub.href}`,
    lastModified: now,
    changeFrequency: hub.changeFrequency,
    priority: hub.priority,
  }));

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const babyNameLandingPages = babyNamePages
    .filter((page) => !isRecoveryBlockedBabyNameLandingPage(page.slug))
    .map((page) => ({
      url: `${baseUrl}/baby-names/${page.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/imprint`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },

    ...hubPages,
    ...categoryPages,
    ...toolPages,
    ...babyNameLandingPages,
  ];
}