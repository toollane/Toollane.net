import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ParagraphCounterClient from "./ParagraphCounterClient";

export const metadata: Metadata = {
  title: "Paragraph Counter | Toollane",

  description:
    "Count paragraphs and characters instantly with Toollane's free online paragraph counter.",
};

const faqs = [
  {
    question: "How does a paragraph counter work?",

    answer:

  },

  {
    question: "Who can use a paragraph counter?",

    answer:
      "Students, writers, bloggers and editors can use it to check essay, article and content structure.",
  },

  {
    question: "Does this tool count characters too?",

    answer:

  },
];

export default function ParagraphCounterPage() {
  return (
    <ToolPageLayout
      title="Paragraph Counter"
      description="Count paragraphs and characters instantly online."


      href="/paragraph-counter"
      faqs={faqs}
    >
      <ParagraphCounterClient />
    </ToolPageLayout>
  );
}