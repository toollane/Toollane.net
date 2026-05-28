import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SocialBioGeneratorClient from "./SocialBioGeneratorClient";

export const metadata: Metadata = {
  title: "Social Bio Generator | Toollane",

  description:
    "Generate social media bio ideas instantly with Toollane's free online bio generator.",
};

const faqs = [
  {
    question: "What does a social bio generator do?",

    answer:
      "It creates short bio ideas for social media profiles based on your name, niche and style.",
  },

  {
    question: "Can I use it for Instagram or TikTok?",

    answer:
      "Yes. You can use the generated bio ideas for Instagram, TikTok, YouTube, X and other profiles.",
  },

  {
    question: "Can I choose a bio style?",

    answer:
      "Yes. You can choose creator, professional or fun bio styles.",
  },
];

export default function SocialBioGeneratorPage() {
  return (
    <ToolPageLayout
      title="Social Bio Generator"
      description="Generate social media bio ideas instantly online."


      href="/social-bio-generator"
      faqs={faqs}
    >
      <SocialBioGeneratorClient />
    </ToolPageLayout>
  );
}