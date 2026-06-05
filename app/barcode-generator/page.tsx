import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BarcodeGeneratorClient from "./BarcodeGeneratorClient";

export const metadata: Metadata = {
  title: "Barcode Generator | Toollane",

  description:
    "Generate barcodes instantly with Toollane's free online barcode generator.",
};

export default function BarcodeGeneratorPage() {
  return (
    <ToolPageLayout
      title="Barcode Generator"
      description="Generate barcodes instantly online."


      href="/barcode-generator"
    >
      <BarcodeGeneratorClient />
    </ToolPageLayout>
  );
}