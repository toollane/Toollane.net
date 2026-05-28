import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WordCounterClient from "./WordCounterClient";

export const metadata: Metadata = {
  title: "Word Counter | Toollane",

  description:
    "Count words, characters and sentences instantly with Toollane's free online word counter.",
};

const faqs = [
  {
    question: "How does a word counter work?",

    answer:

  },

  {
    question: "Can I count characters too?",

    answer:
      "Yes. This tool counts total characters, characters without spaces, words and sentences.",
  },

  {
    question: "Why use an online word counter?",

    answer:
      "It helps writers, students, marketers and creators quickly check text length.",
  },
];

export default function WordCounterPage() {
  return (
    <ToolPageLayout
      title="Word Counter"
      description="Count words, characters and sentences instantly online."


      href="/word-counter"
      faqs={faqs}
    >
      <WordCounterClient />
    </ToolPageLayout>
  );
}