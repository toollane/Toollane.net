import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SentenceCounterClient from "./SentenceCounterClient";

export const metadata: Metadata = {
  title: "Sentence Counter | Toollane",

  description:
    "Count sentences and words instantly with Toollane's free online sentence counter.",
};

const faqs = [
  {
    question: "How does a sentence counter work?",

    answer:
      "A sentence counter detects sentence-ending punctuation such as periods, question marks and exclamation marks.",
  },

  {
    question: "Who can use a sentence counter?",

    answer:
      "Writers, students, editors and marketers can use it to review text structure and readability.",
  },

  {
    question: "Does this tool count words too?",

    answer:

  },
];

export default function SentenceCounterPage() {
  return (
    <ToolPageLayout
      title="Sentence Counter"
      description="Count sentences and words instantly online."


      href="/sentence-counter"
      faqs={faqs}
    >
      <SentenceCounterClient />
    </ToolPageLayout>
  );
}