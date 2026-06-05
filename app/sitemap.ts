import { MetadataRoute } from "next";

import { categories, tools } from "@/data/tools";

const baseUrl = "https://toollane.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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

  const babyNamePages = [
    "girl",
    "boy",
    "unisex",
    "german",
    "vintage",
    "rare",
  ].map((type) => ({
    url: `${baseUrl}/baby-names/${type}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
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

    ...babyNamePages,
    ...categoryPages,
    ...toolPages,
  ];
}