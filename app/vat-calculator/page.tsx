import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import VatCalculatorClient from "./VatCalculatorClient";

export const metadata: Metadata = {
  title: "VAT Calculator | Add or Remove VAT Online | Toollane",
  description:
    "Calculate VAT online for free. Add VAT to a net price, remove VAT from a gross price and estimate VAT amount, net amount and gross amount.",


  alternates: {
    canonical: "/vat-calculator",
  },
};

export default function VatCalculatorPage() {
  return (
    <ToolPageLayout
      title="VAT Calculator"
      description="Add or remove VAT from prices online. Calculate net price, gross price, VAT amount, quantity and discount-adjusted totals."
      href="/vat-calculator"
    >
      <VatCalculatorClient />
    </ToolPageLayout>
  );
}