import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfPageExtractorClient from "./PdfPageExtractorClient";

export const metadata: Metadata = {
  title:
    "PDF Page Extractor | Toollane",

  description:
    "Extract PDF pages instantly with Toollane's free online PDF page extractor.",
};

export default function PdfPageExtractorPage() {
  return (
    <ToolPageLayout
      title="PDF Page Extractor"
      description="Extract PDF pages instantly online."


      href="/pdf-page-extractor"
    >
      <PdfPageExtractorClient />
    </ToolPageLayout>
  );
}