import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SlugGeneratorClient from "./SlugGeneratorClient";

export const metadata: Metadata = {
  title: "Slug Generator | Toollane",

  description:
    "Generate SEO-friendly URL slugs instantly with Toollane's free online slug generator.",
};

const faqs = [
  {
    question: "What is a slug?",

    answer:

  },

  {
    question: "What makes a slug SEO-friendly?",

    answer:
      "SEO-friendly slugs are usually short, lowercase and use hyphens between words.",
  },

  {
    question: "Why use a slug generator?",

    answer:
      "A slug generator helps quickly create clean URLs for blog posts, landing pages and websites.",
  },
];

export default function SlugGeneratorPage() {
  return (
    <ToolPageLayout
      title="Slug Generator"
      description="Generate SEO-friendly URL slugs instantly online."


      href="/slug-generator"
      faqs={faqs}
    >
      <SlugGeneratorClient />
    </ToolPageLayout>
  );
}