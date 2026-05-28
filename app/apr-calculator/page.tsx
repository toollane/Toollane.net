import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AprCalculatorClient from "./AprCalculatorClient";

export const metadata: Metadata = {
  title: "APR Calculator | Toollane",

  description:
    "Estimate APR, loan fees and borrowing cost with Toollane's free online APR calculator.",
};

const faqs = [
  {
    question: "What is APR?",

    answer:

  },

  {
    question: "How is APR different from interest rate?",

    answer:
      "Interest rate only reflects borrowing interest, while APR can also include fees and other loan costs.",
  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function AprCalculatorPage() {
  return (
    <ToolPageLayout
      title="APR Calculator"
      description="Estimate APR, fees and borrowing cost instantly online."


      href="/apr-calculator"
      faqs={faqs}
    >
      <AprCalculatorClient />
    </ToolPageLayout>
  );
}