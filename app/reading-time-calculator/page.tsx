import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ReadingTimeCalculatorClient from "./ReadingTimeCalculatorClient";

export const metadata: Metadata = {
  title: "Reading Time Calculator | Toollane",

  description:
    "Estimate article and text reading time instantly with Toollane's free online reading time calculator.",
};

const faqs = [
  {
    question: "How does a reading time calculator work?",

    answer:

  },

  {
    question: "What reading speed is used?",

    answer:

  },

  {
    question: "Why use a reading time calculator?",

    answer:
      "It helps writers, bloggers and students estimate how long content takes to read.",
  },
];

export default function ReadingTimeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Reading Time Calculator"
      description="Estimate reading time instantly online."


      href="/reading-time-calculator"
      faqs={faqs}
    >
      <ReadingTimeCalculatorClient />
    </ToolPageLayout>
  );
}