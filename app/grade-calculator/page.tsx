import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import GradeCalculatorClient from "./GradeCalculatorClient";

export const metadata: Metadata = {
  title: "Grade Calculator | Toollane",

  description:
    "Calculate grade percentage and letter grade instantly with Toollane's free online grade calculator.",
};

const faqs = [
  {
    question: "How do you calculate a grade percentage?",

    answer:

  },

  {
    question: "Does this calculator estimate letter grades?",

    answer:

  },

  {
    question: "Can grading scales vary?",

    answer:
      "Yes. Schools and teachers may use different grading scales, so the letter grade is only an estimate.",
  },
];

export default function GradeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Grade Calculator"
      description="Calculate grade percentage and estimated letter grade instantly online."


      href="/grade-calculator"
      faqs={faqs}
    >
      <GradeCalculatorClient />
    </ToolPageLayout>
  );
}