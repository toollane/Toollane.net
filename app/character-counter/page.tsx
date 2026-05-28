import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CharacterCounterClient from "./CharacterCounterClient";

export const metadata: Metadata = {
  title: "Character Counter | Toollane",

  description:
    "Count characters, characters without spaces and lines instantly with Toollane's free online character counter.",
};

const faqs = [
  {
    question: "How does a character counter work?",

    answer:
      "A character counter counts every letter, number, space, symbol and line break in your text.",
  },

  {
    question: "Can I count characters without spaces?",

    answer:

  },

  {
    question: "Why use a character counter?",

    answer:
      "It helps check text length for social media, SEO titles, ads, forms and messages.",
  },
];

export default function CharacterCounterPage() {
  return (
    <ToolPageLayout
      title="Character Counter"
      description="Count characters, characters without spaces and lines instantly online."


      href="/character-counter"
      faqs={faqs}
    >
      <CharacterCounterClient />
    </ToolPageLayout>
  );
}