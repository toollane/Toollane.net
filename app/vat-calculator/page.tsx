import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import VatCalculatorClient from "./VatCalculatorClient";

export const metadata: Metadata = {
  title: "VAT Calculator | Toollane",

  description:
    "Calculate VAT, net price and gross price instantly with Toollane's free online VAT calculator.",
};

export default function VatCalculatorPage() {
  return (
    <ToolPageLayout
      title="VAT Calculator"
      description="Calculate VAT, net price and gross price instantly online."


      href="/vat-calculator"
    >
      <VatCalculatorClient />
    </ToolPageLayout>
  );
}