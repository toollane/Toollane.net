import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BarcodeGeneratorClient from "./BarcodeGeneratorClient";

export const metadata: Metadata = {
  title: "Barcode Generator | Toollane",

  description:
    "Generate barcodes instantly with Toollane's free online barcode generator.",
};

const faqs = [
  {
    question:
      "What does a barcode generator do?",

    answer:
      "A barcode generator creates scannable barcodes from text, numbers, or product codes.",
  },

  {
    question:
      "Can I download the barcode?",

    answer:

  },

  {
    question:
      "Which barcode formats are supported?",

    answer:
      "This tool supports popular barcode formats such as CODE128, EAN-13, UPC, and CODE39.",
  },
];

export default function BarcodeGeneratorPage() {
  return (
    <ToolPageLayout
      title="Barcode Generator"
      description="Generate barcodes instantly online."


      href="/barcode-generator"
      faqs={faqs}
    >
      <BarcodeGeneratorClient />
    </ToolPageLayout>
  );
}