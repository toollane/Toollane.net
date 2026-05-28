import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ReceiptGeneratorClient from "./ReceiptGeneratorClient";

export const metadata: Metadata = {
  title:
    "Receipt Generator | Toollane",

  description:
    "Create printable receipts instantly with Toollane's free online receipt generator.",
};

const faqs = [
  {
    question:
      "What does a receipt generator do?",

    answer:

  },

  {
    question:
      "Who uses receipt generators?",

    answer:
      "Freelancers, stores, businesses and online sellers use receipt generators daily.",
  },

  {
    question:
      "Can I download the receipt?",

    answer:

  },
];

export default function ReceiptGeneratorPage() {
  return (
    <ToolPageLayout
      title="Receipt Generator"
      description="Create printable receipts instantly online."


      href="/receipt-generator"
      faqs={faqs}
    >
      <ReceiptGeneratorClient />
    </ToolPageLayout>
  );
}