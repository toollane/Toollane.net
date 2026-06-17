import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SalaryCalculatorClient from "./SalaryCalculatorClient";

export const metadata: Metadata = {
  title: "Salary Calculator | Annual, Monthly & Hourly Pay | Toollane",
  description:
    "Convert annual salary into monthly, weekly, daily and hourly pay online. Estimate gross pay, net pay, taxes, bonus and effective hourly rate.",


  alternates: {
    canonical: "/salary-calculator",
  },
};

export default function SalaryCalculatorPage() {
  return (
    <ToolPageLayout
      title="Salary Calculator"
      description="Convert annual salary into monthly, biweekly, weekly, daily and hourly pay with estimated taxes, bonus and paid time off."
      href="/salary-calculator"
    >
      <SalaryCalculatorClient />
    </ToolPageLayout>
  );
}