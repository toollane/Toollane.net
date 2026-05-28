import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfMergerClient from "./PdfMergerClient";

export const metadata: Metadata = {
  title: "PDF Merger | Toollane",

  description:
    "Merge PDF files instantly with Toollane's free online PDF merger.",
};

const faqs = [
  {
    question: "What does a PDF merger do?",

    answer:

  },

  {
    question: "Are my PDF files uploaded?",

    answer:

  },

  {
    question: "Can I merge multiple PDFs?",

    answer:

  },
];

export default function PdfMergerPage() {
  return (
    <ToolPageLayout
      title="PDF Merger"
      description="Merge PDF files instantly online."


      href="/pdf-merger"
      faqs={faqs}
    >
      <PdfMergerClient />
    </ToolPageLayout>
  );
}