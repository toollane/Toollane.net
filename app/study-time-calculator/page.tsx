import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import StudyTimeCalculatorClient from "./StudyTimeCalculatorClient";

export const metadata: Metadata = {
  title: "Study Time Calculator | Toollane",

  description:
    "Plan study time and calculate daily study minutes instantly with Toollane's free online study time calculator.",
};

const faqs = [
  {
    question: "How does a study time calculator work?",

    answer:
      "It estimates total study time by multiplying topics by time per topic, then divides the result by available study days.",
  },

  {
    question: "Who can use a study time calculator?",

    answer:
      "Students, pupils and self-learners can use it to plan exams, assignments and revision sessions.",
  },

  {
    question: "Why plan study time?",

    answer:

  },
];

export default function StudyTimeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Study Time Calculator"
      description="Plan study time and daily study minutes instantly online."


      href="/study-time-calculator"
      faqs={faqs}
    >
      <StudyTimeCalculatorClient />
    </ToolPageLayout>
  );
}