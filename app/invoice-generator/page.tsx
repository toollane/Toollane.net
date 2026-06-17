import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InvoiceGeneratorClient from "./InvoiceGeneratorClient";

export const metadata: Metadata = {
  title: "Invoice Generator | Toollane",

  description:
    "Create invoices instantly with Toollane's free online invoice generator.",


  alternates: {
    canonical: "/invoice-generator",
  },
};

export default function InvoiceGeneratorPage() {
  return (
    <ToolPageLayout
      title="Invoice Generator"
      description="Create invoices instantly online."


      href="/invoice-generator"
    >
      <InvoiceGeneratorClient />
    </ToolPageLayout>
  );
}