import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ReceiptGeneratorClient from "./ReceiptGeneratorClient";

export const metadata: Metadata = {
  title:
    "Receipt Generator | Toollane",

  description:
    "Create printable receipts instantly with Toollane's free online receipt generator.",


  alternates: {
    canonical: "/receipt-generator",
  },
};

export default function ReceiptGeneratorPage() {
  return (
    <ToolPageLayout
      title="Receipt Generator"
      description="Create printable receipts instantly online."


      href="/receipt-generator"
    >
      <ReceiptGeneratorClient />
    </ToolPageLayout>
  );
}