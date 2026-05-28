import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DateDifferenceCalculatorClient from "./DateDifferenceCalculatorClient";

export const metadata: Metadata = {
  title: "Date Difference Calculator | Toollane",

  description:
    "Calculate the difference between two dates instantly with Toollane's free online date difference calculator.",
};

const faqs = [
  {
    question: "How do you calculate date difference?",

    answer:

  },

  {
    question: "Can I calculate weeks between dates?",

    answer:

  },

  {
    question: "Why use a date difference calculator?",

    answer:
      "It helps quickly calculate time between events, deadlines, travel dates and schedules.",
  },
];

export default function DateDifferenceCalculatorPage() {
  return (
    <ToolPageLayout
      title="Date Difference Calculator"
      description="Calculate the difference between two dates instantly online."


      href="/date-difference-calculator"
      faqs={faqs}
    >
      <DateDifferenceCalculatorClient />
    </ToolPageLayout>
  );
}