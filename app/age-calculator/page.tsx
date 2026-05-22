import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AgeCalculatorClient from "./AgeCalculatorClient";

export const metadata: Metadata = {
  title:
    "Age Calculator | Toollane",

  description:
    "Calculate your exact age in years, months and days instantly with Toollane's free online age calculator.",
};

const faqs = [
  {
    question:
      "How does an age calculator work?",

    answer:
      "An age calculator compares your date of birth with today's date to calculate your exact age.",
  },

  {
    question:
      "Can I calculate age in months and days?",

    answer:
      "Yes. Toollane's age calculator shows your age in years, months and days.",
  },

  {
    question:
      "Why use an online age calculator?",

    answer:
      "An online age calculator helps you quickly determine exact age differences without manual calculations.",
  },
];

export default function AgeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Age Calculator"
      description="Calculate your exact age instantly online."
      categoryName="Quick Math & Daily Calculators"
      categorySlug="quick-math-daily-calculators"
      href="/age-calculator"
      faqs={faqs}
    >
      <AgeCalculatorClient />
    </ToolPageLayout>
  );
}