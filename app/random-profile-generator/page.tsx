import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomProfileGeneratorClient from "./RandomProfileGeneratorClient";

export const metadata: Metadata = {
  title: "Random Profile Generator | Toollane",

  description:
    "Generate random sample profiles instantly with Toollane's free online random profile generator.",
};

const faqs = [
  {
    question: "What does a random profile generator do?",

    answer:
      "It creates sample profile data such as name, country, job, username and example email.",
  },

  {
    question: "What can I use random profiles for?",

    answer:
      "Random profiles are useful for mockups, test data, writing, design layouts and creative projects.",
  },

  {
    question: "Are these real identities?",

    answer:

  },
];

export default function RandomProfileGeneratorPage() {
  return (
    <ToolPageLayout
      title="Random Profile Generator"
      description="Generate fictional sample profiles instantly online."


      href="/random-profile-generator"
      faqs={faqs}
    >
      <RandomProfileGeneratorClient />
    </ToolPageLayout>
  );
}