import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import VatCalculatorClient from "./VatCalculatorClient";

export const metadata: Metadata = {
  title: "VAT Calculator | Toollane",

  description:
    "Calculate VAT, net price and gross price instantly with Toollane's free online VAT calculator.",
};

const faqs = [
  {
    question: "How do you calculate VAT?",

    answer:
      "To add VAT, multiply the net price by the VAT rate and add the result to the net price.",
  },

  {
    question: "How do you remove VAT from a price?",

    answer:
      "To remove VAT from a gross price, divide the gross price by 1 plus the VAT rate divided by 100.",
  },

  {
    question: "Can I use different VAT rates?",

    answer:
      "Yes. You can choose common VAT rates or enter a custom VAT percentage manually.",
  },
];

export default function VatCalculatorPage() {
  return (
    <ToolPageLayout
      title="VAT Calculator"
      description="Calculate VAT, net price and gross price instantly online."
      categoryName="Business & Pricing Calculators"
      categorySlug="business-pricing-calculators"
      href="/vat-calculator"
      faqs={faqs}
    >
      <VatCalculatorClient />
    </ToolPageLayout>
  );
}