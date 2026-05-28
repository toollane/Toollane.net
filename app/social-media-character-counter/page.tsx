import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SocialMediaCharacterCounterClient from "./SocialMediaCharacterCounterClient";

export const metadata: Metadata = {
  title: "Social Media Character Counter | Toollane",

  description:
    "Count characters for social media posts, captions and titles with Toollane's free online character counter.",
};

const faqs = [
  {
    question: "What does a social media character counter do?",

    answer:

  },

  {
    question: "Which platforms are included?",

    answer:
      "This tool includes character checks for Twitter/X, Instagram, TikTok and YouTube titles.",
  },

  {
    question: "Why use a social media character counter?",

    answer:
      "It helps creators write captions, titles and posts that fit platform limits.",
  },
];

export default function SocialMediaCharacterCounterPage() {
  return (
    <ToolPageLayout
      title="Social Media Character Counter"
      description="Count characters for social media posts and captions instantly online."


      href="/social-media-character-counter"
      faqs={faqs}
    >
      <SocialMediaCharacterCounterClient />
    </ToolPageLayout>
  );
}