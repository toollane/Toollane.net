import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TextRepeaterClient from "./TextRepeaterClient";

export const metadata: Metadata = {
  title: "Text Repeater | Toollane",

  description:
    "Repeat text multiple times instantly with Toollane's free online text repeater.",
};

const faqs = [
  {
    question: "What does a text repeater do?",

    answer:

  },

  {
    question: "Why use a text repeater?",

    answer:
      "It can help with formatting, testing, message drafts and repeated text tasks.",
  },

  {
    question: "Can I choose how many times text repeats?",

    answer:

  },
];

export default function TextRepeaterPage() {
  return (
    <ToolPageLayout
      title="Text Repeater"
      description="Repeat text multiple times instantly online."


      href="/text-repeater"
      faqs={faqs}
    >
      <TextRepeaterClient />
    </ToolPageLayout>
  );
}