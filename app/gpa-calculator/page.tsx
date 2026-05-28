import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import GpaCalculatorClient from "./GpaCalculatorClient";

export const metadata: Metadata = {
  title: "GPA Calculator | Toollane",

  description:
    "Calculate GPA instantly with Toollane's free online GPA calculator.",
};

const faqs = [
  {
    question: "How do you calculate GPA?",

    answer:

  },

  {
    question: "What are grade points?",

    answer:
      "Grade points are the numeric values assigned to grades, often multiplied by course credit hours.",
  },

  {
    question: "Who uses a GPA calculator?",

    answer:

  },
];

export default function GpaCalculatorPage() {
  return (
    <ToolPageLayout
      title="GPA Calculator"
      description="Calculate GPA instantly online."


      href="/gpa-calculator"
      faqs={faqs}
    >
      <GpaCalculatorClient />
    </ToolPageLayout>
  );
}