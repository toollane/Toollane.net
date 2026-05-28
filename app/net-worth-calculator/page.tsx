import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import NetWorthCalculatorClient from "./NetWorthCalculatorClient";

export const metadata: Metadata = {
  title: "Net Worth Calculator | Toollane",

  description:
    "Calculate total assets, total debts and net worth instantly with Toollane's free online net worth calculator.",
};

const faqs = [
  {
    question: "How do you calculate net worth?",

    answer:

  },

  {
    question: "What counts as an asset?",

    answer:
      "Assets can include cash, bank accounts, investments, property and other valuable possessions.",
  },

  {
    question: "What counts as debt?",

    answer:
      "Debt can include loans, credit card balances, mortgages and other financial obligations.",
  },
];

export default function NetWorthCalculatorPage() {
  return (
    <ToolPageLayout
      title="Net Worth Calculator"
      description="Calculate your total assets, debts and net worth instantly online."


      href="/net-worth-calculator"
      faqs={faqs}
    >
      <NetWorthCalculatorClient />
    </ToolPageLayout>
  );
}