import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfSplitterClient from "./PdfSplitterClient";

export const metadata: Metadata = {
  title: "PDF Splitter | Split PDF Pages Online | Toollane",
  description:
    "Split PDF files online for free. Select pages, extract pages or split every PDF page directly in your browser without uploading your document.",


  alternates: {
    canonical: "/pdf-splitter",
  },
};

export default function PdfSplitterPage() {
  return (
    <ToolPageLayout
      title="PDF Splitter"
      description="Split PDF files online. Select pages, extract pages or split every PDF page directly in your browser without uploading your document."
      href="/pdf-splitter"
    >
      <PdfSplitterClient />
    </ToolPageLayout>
  );
}