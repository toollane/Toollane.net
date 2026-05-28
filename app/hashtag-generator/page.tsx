import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HashtagGeneratorClient from "./HashtagGeneratorClient";

export const metadata: Metadata = {
  title:
    "Hashtag Generator | Toollane",

  description:
    "Generate trending hashtags instantly with Toollane's free online hashtag generator.",
};

const faqs = [
  {
    question:
      "What does a hashtag generator do?",

    answer:
      "A hashtag generator creates hashtag ideas for Instagram, TikTok, YouTube and social media content.",
  },

  {
    question:
      "Can I generate hashtags for TikTok?",

    answer:
      "Yes. You can generate hashtags for TikTok, Instagram and YouTube Shorts.",
  },

  {
    question:
      "Why are hashtags important?",

    answer:

  },
];

export default function HashtagGeneratorPage() {
  return (
    <ToolPageLayout
      title="Hashtag Generator"
      description="Generate trending hashtags instantly online."


      href="/hashtag-generator"
      faqs={faqs}
    >
      <HashtagGeneratorClient />
    </ToolPageLayout>
  );
}