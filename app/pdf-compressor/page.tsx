import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfCompressorClient from "./PdfCompressorClient";

export const metadata: Metadata = {
  title: "PDF Compressor | Compress PDF Files Online | Toollane",
  description:
    "Compress PDF files online for free. Reduce and optimize PDF file size directly in your browser without uploading your document.",
};

export default function PdfCompressorPage() {
  return (
    <ToolPageLayout
      title="PDF Compressor"
      description="Compress PDF files online and optimize PDF file size directly in your browser without uploading your document."
      href="/pdf-compressor"
    >
      <PdfCompressorClient />
    </ToolPageLayout>
  );
}