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
      "Sales tax is calculated by multiplying the price before tax by the sales tax rate divided by 100.",
  },

  {
    question: "How do you calculate the total price with tax?",

    answer:
      "Add the sales tax amount to the original price to get the total price.",
  },

  {
    question: "Can I use a custom sales tax rate?",

    answer:
      "Yes. You can enter any custom sales tax rate manually.",
  },
];

export default function SalesTaxCalculatorPage() {
  return (
    <ToolPageLayout
      title="Sales Tax Calculator"
      description="Calculate sales tax and final price instantly online."
      categoryName="Business & Pricing Calculators"
      categorySlug="business-pricing-calculators"
      href="/sales-tax-calculator"
      faqs={faqs}
    >
      <SalesTaxCalculatorClient />
    </ToolPageLayout>
  );
}