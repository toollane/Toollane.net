import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CpmCalculatorClient from "./CpmCalculatorClient";

export const metadata: Metadata = {
  title: "CPM Calculator | Toollane",

  description:
    "Calculate cost per thousand impressions instantly with Toollane's free online CPM calculator.",
};

const faqs = [
  {
    question: "What is CPM?",

    answer:
      "CPM means cost per thousand impressions and is used to measure advertising cost for every 1,000 views.",
  },

  {
    question: "How do you calculate CPM?",

    answer:
      "CPM is calculated by dividing campaign cost by impressions and multiplying the result by 1,000.",
  },

  {
    question: "Why use a CPM calculator?",

    answer:

  },
];

export default function CpmCalculatorPage() {
  return (
    <ToolPageLayout
      title="CPM Calculator"
      description="Calculate cost per thousand impressions instantly online."


      href="/cpm-calculator"
      faqs={faqs}
    >
      <CpmCalculatorClient />
    </ToolPageLayout>
  );
}