import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfPageRemoverClient from "./PdfPageRemoverClient";

export const metadata: Metadata = {
  title: "PDF Page Remover | Delete Pages from PDF | Toollane",
  description:
    "Remove specific pages from a PDF instantly with Toollane's free online PDF page remover. Delete pages, ranges, odd pages or even pages directly in your browser.",
};

export default function PdfPageRemoverPage() {
  return (
    <ToolPageLayout
      title="PDF Page Remover"
      description="Remove specific pages from a PDF instantly online. Delete pages, ranges, odd pages or even pages directly in your browser."
      href="/pdf-page-remover"
    >
      <PdfPageRemoverClient />
    </ToolPageLayout>
  );
}