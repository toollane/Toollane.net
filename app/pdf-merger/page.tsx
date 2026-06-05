import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfMergerClient from "./PdfMergerClient";

export const metadata: Metadata = {
  title: "PDF Merger | Toollane",

  description:
    "Merge PDF files instantly with Toollane's free online PDF merger.",
};

export default function PdfMergerPage() {
  return (
    <ToolPageLayout
      title="PDF Merger"
      description="Merge PDF files instantly online."


      href="/pdf-merger"
    >
      <PdfMergerClient />
    </ToolPageLayout>
  );
}