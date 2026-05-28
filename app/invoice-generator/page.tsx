import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InvoiceGeneratorClient from "./InvoiceGeneratorClient";

export const metadata: Metadata = {
  title: "Invoice Generator | Toollane",

  description:
    "Create invoices instantly with Toollane's free online invoice generator.",
};

const faqs = [
  {
    question:
      "What does an invoice generator do?",

    answer:
      "An invoice generator helps you create a simple invoice for clients, services, or products.",
  },

  {
    question:
      "Can I download the invoice as PDF?",

    answer:
      "Yes. You can use your browser's print dialog to save the invoice as a PDF.",
  },

  {
    question:
      "Is my invoice data uploaded?",

    answer:

  },
];

export default function InvoiceGeneratorPage() {
  return (
    <ToolPageLayout
      title="Invoice Generator"
      description="Create invoices instantly online."


      href="/invoice-generator"
      faqs={faqs}
    >
      <InvoiceGeneratorClient />
    </ToolPageLayout>
  );
}