import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DownPaymentCalculatorClient from "./DownPaymentCalculatorClient";

export const metadata: Metadata = {
  title: "Down Payment Calculator | Toollane",
  description:
    "Calculate your target down payment, total cash needed, savings gap and estimated time to reach your home buying goal.",
  alternates: {
    canonical: "https://toollane.net/down-payment-calculator",
  },
};

export default function DownPaymentCalculatorPage() {
  return (
    <ToolPageLayout
      title="Down Payment Calculator"
      description="Calculate how much you need for a home down payment and how long it may take to save."
      href="/down-payment-calculator"
    >
      <DownPaymentCalculatorClient />
    </ToolPageLayout>
  );
}