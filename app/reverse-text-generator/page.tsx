import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ReverseTextGeneratorClient from "./ReverseTextGeneratorClient";

export const metadata: Metadata = {
  title: "Reverse Text Generator | Toollane",

  description:
    "Reverse text instantly with Toollane's free online reverse text generator.",
};

const faqs = [
  {
    question: "What does a reverse text generator do?",

    answer:

  },

  {
    question: "Why use reverse text?",

    answer:
      "Reverse text can be used for fun, formatting, testing, puzzles and creative text effects.",
  },

  {
    question: "Does this reverse words or letters?",

    answer:

  },
];

export default function ReverseTextGeneratorPage() {
  return (
    <ToolPageLayout
      title="Reverse Text Generator"
      description="Reverse text instantly online."


      href="/reverse-text-generator"
      faqs={faqs}
    >
      <ReverseTextGeneratorClient />
    </ToolPageLayout>
  );
}