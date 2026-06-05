import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfSplitterClient from "./PdfSplitterClient";

export const metadata: Metadata = {
  title: "PDF Splitter | Toollane",

  description:
    "Split PDF files instantly with Toollane's free online PDF splitter.",
};

export default function PdfSplitterPage() {
  return (
    <ToolPageLayout
      title="PDF Splitter"
      description="Split PDF files instantly online."


      href="/pdf-splitter"
    >
      <PdfSplitterClient />
    </ToolPageLayout>
  );
}