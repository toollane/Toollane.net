import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfSplitterClient from "./PdfSplitterClient";

export const metadata: Metadata = {
  title: "PDF Splitter | Toollane",

  description:
    "Split PDF files instantly with Toollane's free online PDF splitter.",
};

const faqs = [
  {
    question: "What does a PDF splitter do?",
    answer:
      "A PDF splitter lets you extract selected pages from a PDF and save them as a new file.",
  },
  {
    question: "Are my PDF files uploaded?",
    answer:
      "No. The PDF splitting happens locally in your browser, so your files are not uploaded.",
  },
  {
    question: "Can I split large PDF files?",
    answer:
      "Yes. You can select pages from a PDF and create a new document from those pages.",
  },
];

export default function PdfSplitterPage() {
  return (
    <ToolPageLayout
      title="PDF Splitter"
      description="Split PDF files instantly online."


      href="/pdf-splitter"
      faqs={faqs}
    >
      <PdfSplitterClient />
    </ToolPageLayout>
  );
}