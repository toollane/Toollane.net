import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import YoutubeTitleGeneratorClient from "./YoutubeTitleGeneratorClient";

export const metadata: Metadata = {
  title: "YouTube Title Generator | Toollane",

  description:
    "Generate YouTube video title ideas instantly with Toollane's free online YouTube title generator.",
};

const faqs = [
  {
    question: "What does a YouTube title generator do?",

    answer:

  },

  {
    question: "Can I use this for YouTube Shorts?",

    answer:
      "Yes. You can use the generated title ideas for regular YouTube videos, Shorts and creator content.",
  },

  {
    question: "Why are YouTube titles important?",

    answer:

  },
];

export default function YoutubeTitleGeneratorPage() {
  return (
    <ToolPageLayout
      title="YouTube Title Generator"
      description="Generate YouTube video title ideas instantly online."


      href="/youtube-title-generator"
      faqs={faqs}
    >
      <YoutubeTitleGeneratorClient />
    </ToolPageLayout>
  );
}