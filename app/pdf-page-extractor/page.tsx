import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfPageExtractorClient from "./PdfPageExtractorClient";

export const metadata: Metadata = {
  title: "PDF Page Extractor | Extract Pages from PDF | Toollane",
  description:
    "Extract specific pages from a PDF instantly with Toollane's free online PDF page extractor. Select pages, ranges, odd pages, even pages or split a PDF in your browser.",
};

export default function PdfPageExtractorPage() {
  return (
    <ToolPageLayout
      title="PDF Page Extractor"
      description="Extract specific pages from a PDF instantly online. Select pages, ranges, odd pages or even pages directly in your browser."
      href="/pdf-page-extractor"
    >
      <PdfPageExtractorClient />
    </ToolPageLayout>
  );
}