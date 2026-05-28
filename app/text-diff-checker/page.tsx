import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TextDiffCheckerClient from "./TextDiffCheckerClient";

export const metadata: Metadata = {
  title: "Text Diff Checker | Toollane",

  description:
    "Compare two texts line by line with Toollane's free online text diff checker.",
};

const faqs = [
  {
    question: "What does a text diff checker do?",

    answer:

  },

  {
    question: "Who uses text diff tools?",

    answer:
      "Writers, students, editors, developers and office workers use diff tools to compare versions.",
  },

  {
    question: "Can I compare long text?",

    answer:

  },
];

export default function TextDiffCheckerPage() {
  return (
    <ToolPageLayout
      title="Text Diff Checker"
      description="Compare two texts line by line instantly online."


      href="/text-diff-checker"
      faqs={faqs}
    >
      <TextDiffCheckerClient />
    </ToolPageLayout>
  );
}