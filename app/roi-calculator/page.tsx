import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RoiCalculatorClient from "./RoiCalculatorClient";

export const metadata: Metadata = {
  title:
    "ROI Calculator | Toollane",

  description:
    "Calculate return on investment, profit and ROI percentage instantly with Toollane's free online ROI calculator.",
};

const faqs = [
  {
    question:
      "What is ROI?",

    answer:

  },

  {
    question:
      "How do you calculate ROI?",

    answer:
      "ROI is calculated by subtracting the initial investment from the final value, dividing by the initial investment and multiplying by 100.",
  },

  {
    question:
      "Why use an ROI calculator?",

    answer:

  },
];

export default function RoiCalculatorPage() {
  return (
    <ToolPageLayout
      title="ROI Calculator"
      description="Calculate return on investment and profitability instantly online."


      href="/roi-calculator"
      faqs={faqs}
    >
      <RoiCalculatorClient />
    </ToolPageLayout>
  );
}