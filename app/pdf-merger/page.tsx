import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfMergerClient from "./PdfMergerClient";

export const metadata: Metadata = {
  title: "PDF Merger | Merge PDF Files Online | Toollane",
  description:
    "Merge multiple PDF files into one PDF online for free. Reorder files, combine PDFs and download the merged document directly in your browser.",


  alternates: {
    canonical: "/pdf-merger",
  },
};

export default function PdfMergerPage() {
  return (
    <ToolPageLayout
      title="PDF Merger"
      description="Merge multiple PDF files into one PDF online. Reorder files, combine documents and download the merged PDF directly in your browser."
      href="/pdf-merger"
    >
      <PdfMergerClient />
    </ToolPageLayout>
  );
}