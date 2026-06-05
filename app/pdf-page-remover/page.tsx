import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfPageRemoverClient from "./PdfPageRemoverClient";

export const metadata: Metadata = {
  title:
    "PDF Page Remover | Toollane",

  description:
    "Remove PDF pages instantly with Toollane's free online PDF page remover.",
};

export default function PdfPageRemoverPage() {
  return (
    <ToolPageLayout
      title="PDF Page Remover"
      description="Remove PDF pages instantly online."


      href="/pdf-page-remover"
    >
      <PdfPageRemoverClient />
    </ToolPageLayout>
  );
}