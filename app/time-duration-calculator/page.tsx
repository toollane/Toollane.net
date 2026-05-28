import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TimeDurationCalculatorClient from "./TimeDurationCalculatorClient";

export const metadata: Metadata = {
  title: "Time Duration Calculator | Toollane",

  description:
    "Calculate time duration between two times instantly with Toollane's free online time duration calculator.",
};

const faqs = [
  {
    question: "How do you calculate time duration?",

    answer:

  },

  {
    question: "Can this calculator handle overnight times?",

    answer:
      "Yes. If the end time is earlier than the start time, the calculator treats it as the next day.",
  },

  {
    question: "Why use a time duration calculator?",

    answer:
      "It helps calculate work hours, shift duration, study time, travel time and event length.",
  },
];

export default function TimeDurationCalculatorPage() {
  return (
    <ToolPageLayout
      title="Time Duration Calculator"
      description="Calculate time duration between two times instantly online."


      href="/time-duration-calculator"
      faqs={faqs}
    >
      <TimeDurationCalculatorClient />
    </ToolPageLayout>
  );
}