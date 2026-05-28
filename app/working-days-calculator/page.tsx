import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WorkingDaysCalculatorClient from "./WorkingDaysCalculatorClient";

export const metadata: Metadata = {
  title: "Working Days Calculator | Toollane",

  description:
    "Calculate weekdays and working days between two dates with Toollane's free online calculator.",
};

const faqs = [
  {
    question: "How does a working days calculator work?",

    answer:

  },

  {
    question: "Does this calculator exclude weekends?",

    answer:

  },

  {
    question: "Why use a working days calculator?",

    answer:
      "It helps estimate schedules, deadlines, projects and work durations.",
  },
];

export default function WorkingDaysCalculatorPage() {
  return (
    <ToolPageLayout
      title="Working Days Calculator"
      description="Calculate weekdays and working days between two dates instantly online."


      href="/working-days-calculator"
      faqs={faqs}
    >
      <WorkingDaysCalculatorClient />
    </ToolPageLayout>
  );
}