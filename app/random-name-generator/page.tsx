import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomNameGeneratorClient from "./RandomNameGeneratorClient";

export const metadata: Metadata = {
  title: "Random Name Generator | Toollane",

  description:
    "Generate random male, female and full names instantly with Toollane's free online random name generator.",
};

const faqs = [
  {
    question: "What does a random name generator do?",

    answer:
      "A random name generator creates random full names for writing, testing, games and creative projects.",
  },

  {
    question: "Can I generate male or female names?",

    answer:
      "Yes. You can choose mixed, male or female name generation.",
  },

  {
    question: "What can I use random names for?",

    answer:
      "Random names can be useful for stories, games, mockups, test data and creative work.",
  },
];

export default function RandomNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Random Name Generator"
      description="Generate random full names instantly online."


      href="/random-name-generator"
      faqs={faqs}
    >
      <RandomNameGeneratorClient />
    </ToolPageLayout>
  );
}