import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RemoveDuplicateLinesClient from "./RemoveDuplicateLinesClient";

export const metadata: Metadata = {
  title: "Remove Duplicate Lines | Toollane",

  description:
    "Remove duplicate lines from text instantly with Toollane's free online duplicate line remover.",
};

const faqs = [
  {
    question: "What does a duplicate line remover do?",

    answer:

  },

  {
    question: "What can I use it for?",

    answer:
      "You can clean lists, keywords, names, CSV snippets, exported data and copied text.",
  },

  {
    question: "Does it remove empty lines?",

    answer:

  },
];

export default function RemoveDuplicateLinesPage() {
  return (
    <ToolPageLayout
      title="Remove Duplicate Lines"
      description="Remove repeated lines from text instantly online."


      href="/remove-duplicate-lines"
      faqs={faqs}
    >
      <RemoveDuplicateLinesClient />
    </ToolPageLayout>
  );
}