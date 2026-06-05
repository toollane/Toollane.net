import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfCompressorClient from "./PdfCompressorClient";

export const metadata: Metadata = {
  title: "PDF Compressor | Toollane",

  description:
    "Compress PDF files instantly with Toollane's free online PDF compressor.",
};

export default function PdfCompressorPage() {
  return (
    <ToolPageLayout
      title="PDF Compressor"
      description="Compress PDF files instantly online."


      href="/pdf-compressor"
    >
      <PdfCompressorClient />
    </ToolPageLayout>
  );
}