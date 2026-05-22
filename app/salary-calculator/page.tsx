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
      "Monthly salary is calculated by dividing annual salary by 12.",
  },

  {
    question: "How do you calculate hourly rate from annual salary?",

    answer:
      "Hourly rate is calculated by dividing annual salary by total working hours per year.",
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
      categoryName="Finance & Investment Tools"
      categorySlug="finance-investment-tools"
      href="/salary-calculator"
      faqs={faqs}
    >
      <SalaryCalculatorClient />
    </ToolPageLayout>
  );
}