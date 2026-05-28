import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SalaryCalculatorClient from "./SalaryCalculatorClient";

export const metadata: Metadata = {
  title: "Salary Calculator | Toollane",

  description:
    "Convert annual salary into monthly, weekly, daily and hourly pay with Toollane's free online salary calculator.",
};

const faqs = [
  {
    question: "How do you calculate monthly salary from annual salary?",

    answer:

  },

  {
    question: "How do you calculate hourly rate from annual salary?",

    answer:

  },

  {
    question: "Does this salary calculator include taxes?",

    answer:
      "No. This calculator shows gross salary before taxes, insurance, deductions or benefits.",
  },
];

export default function SalaryCalculatorPage() {
  return (
    <ToolPageLayout
      title="Salary Calculator"
      description="Convert annual salary into monthly, weekly, daily and hourly pay instantly online."


      href="/salary-calculator"
      faqs={faqs}
    >
      <SalaryCalculatorClient />
    </ToolPageLayout>
  );
}