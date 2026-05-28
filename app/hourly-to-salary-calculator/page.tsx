import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HourlyToSalaryCalculatorClient from "./HourlyToSalaryCalculatorClient";

export const metadata: Metadata = {
  title:
    "Hourly to Salary Calculator | Toollane",

  description:
    "Convert hourly pay to annual salary instantly with Toollane's free online calculator.",
};

const faqs = [
  {
    question:
      "How do you convert hourly pay to salary?",

    answer:

  },

  {
    question:
      "Why use an hourly to salary calculator?",

    answer:
      "It helps compare jobs, freelance work and annual earnings.",
  },

  {
    question:
      "Can I adjust work hours?",

    answer:

  },
];

export default function HourlyToSalaryCalculatorPage() {
  return (
    <ToolPageLayout
      title="Hourly to Salary Calculator"
      description="Convert hourly pay to annual salary instantly online."


      href="/hourly-to-salary-calculator"
      faqs={faqs}
    >
      <HourlyToSalaryCalculatorClient />
    </ToolPageLayout>
  );
}