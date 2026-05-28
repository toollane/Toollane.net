import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RemoveLineBreaksClient from "./RemoveLineBreaksClient";

export const metadata: Metadata = {
  title: "Remove Line Breaks | Toollane",

  description:
    "Remove line breaks from text instantly with Toollane's free online line break remover.",
};

const faqs = [
  {
    question: "What does a line break remover do?",

    answer:

  },

  {
    question: "Why remove line breaks?",

    answer:
      "Removing line breaks helps clean copied text from PDFs, emails, documents and websites.",
  },

  {
    question: "Does this tool change the words?",

    answer:

  },
];

export default function RemoveLineBreaksPage() {
  return (
    <ToolPageLayout
      title="Remove Line Breaks"
      description="Remove line breaks from text instantly online."


      href="/remove-line-breaks"
      faqs={faqs}
    >
      <RemoveLineBreaksClient />
    </ToolPageLayout>
  );
}