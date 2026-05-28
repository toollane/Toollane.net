import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomNumberGeneratorClient from "./RandomNumberGeneratorClient";

export const metadata: Metadata = {
  title: "Random Number Generator | Toollane",

  description:
    "Generate random numbers instantly with Toollane's free online random number generator.",
};

const faqs = [
  {
    question: "What does a random number generator do?",

    answer:

  },

  {
    question: "Can I choose the number range?",

    answer:

  },

  {
    question: "Why use a random number generator?",

    answer:
      "It can be used for games, raffles, classrooms, coding, testing and quick decisions.",
  },
];

export default function RandomNumberGeneratorPage() {
  return (
    <ToolPageLayout
      title="Random Number Generator"
      description="Generate random numbers instantly online."


      href="/random-number-generator"
      faqs={faqs}
    >
      <RandomNumberGeneratorClient />
    </ToolPageLayout>
  );
}