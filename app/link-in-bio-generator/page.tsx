import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import LinkInBioGeneratorClient from "./LinkInBioGeneratorClient";

export const metadata: Metadata = {
  title:
    "Link in Bio Generator | Toollane",

  description:
    "Create mobile link hub pages instantly with Toollane's free online link in bio generator.",
};

const faqs = [
  {
    question:
      "What does a link in bio generator do?",

    answer:

  },

  {
    question:
      "Who uses link in bio pages?",

    answer:
      "Creators, influencers, freelancers and businesses use them for Instagram and TikTok profiles.",
  },

  {
    question:
      "Can I add multiple links?",

    answer:

  },
];

export default function LinkInBioGeneratorPage() {
  return (
    <ToolPageLayout
      title="Link in Bio Generator"
      description="Create mobile link hub pages instantly online."


      href="/link-in-bio-generator"
      faqs={faqs}
    >
      <LinkInBioGeneratorClient />
    </ToolPageLayout>
  );
}