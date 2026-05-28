import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SalesTaxCalculatorClient from "./SalesTaxCalculatorClient";

export const metadata: Metadata = {
  title: "Sales Tax Calculator | Toollane",

  description:
    "Calculate sales tax and final price instantly with Toollane's free online sales tax calculator.",
};

const faqs = [
  {
    question: "How do you calculate sales tax?",

    answer:

  },

  {
    question: "How do you calculate the total price with tax?",

    answer:

  },

  {
    question: "Can I use a custom sales tax rate?",

    answer:

  },
];

export default function SalesTaxCalculatorPage() {
  return (
    <ToolPageLayout
      title="Sales Tax Calculator"
      description="Calculate sales tax and final price instantly online."


      href="/sales-tax-calculator"
      faqs={faqs}
    >
      <SalesTaxCalculatorClient />
    </ToolPageLayout>
  );
}