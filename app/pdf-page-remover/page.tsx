import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfPageRemoverClient from "./PdfPageRemoverClient";

export const metadata: Metadata = {
  title:
    "PDF Page Remover | Toollane",

  description:
    "Remove PDF pages instantly with Toollane's free online PDF page remover.",
};

const faqs = [
  {
    question:
      "What does a PDF page remover do?",

    answer:

  },

  {
    question:
      "Can I remove multiple pages?",

    answer:

  },

  {
    question:
      "Are my PDF files uploaded?",

    answer:

  },
];

export default function PdfPageRemoverPage() {
  return (
    <ToolPageLayout
      title="PDF Page Remover"
      description="Remove PDF pages instantly online."


      href="/pdf-page-remover"
      faqs={faqs}
    >
      <PdfPageRemoverClient />
    </ToolPageLayout>
  );
}