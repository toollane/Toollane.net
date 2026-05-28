import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import FindAndReplaceClient from "./FindAndReplaceClient";

export const metadata: Metadata = {
  title: "Find and Replace Tool | Toollane",

  description:
    "Find and replace text instantly with Toollane's free online find and replace tool.",
};

const faqs = [
  {
    question: "What does a find and replace tool do?",

    answer:

  },

  {
    question: "Who can use this tool?",

    answer:
      "Writers, students, office workers and developers can use it to clean or edit text quickly.",
  },

  {
    question: "Does this tool change my text automatically?",

    answer:

  },
];

export default function FindAndReplacePage() {
  return (
    <ToolPageLayout
      title="Find and Replace Tool"
      description="Find and replace words, phrases or characters instantly online."


      href="/find-and-replace"
      faqs={faqs}
    >
      <FindAndReplaceClient />
    </ToolPageLayout>
  );
}