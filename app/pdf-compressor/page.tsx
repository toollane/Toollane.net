import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfCompressorClient from "./PdfCompressorClient";

export const metadata: Metadata = {
  title: "PDF Compressor | Toollane",

  description:
    "Compress PDF files instantly with Toollane's free online PDF compressor.",
};

const faqs = [
  {
    question: "What does a PDF compressor do?",

    answer:
      "A PDF compressor reduces the file size of a PDF document so it is easier to upload, send, or store.",
  },

  {
    question: "Are my PDF files uploaded?",

    answer:

  },

  {
    question: "Is this PDF compressor free?",

    answer:

  },
];

export default function PdfCompressorPage() {
  return (
    <ToolPageLayout
      title="PDF Compressor"
      description="Compress PDF files instantly online."


      href="/pdf-compressor"
      faqs={faqs}
    >
      <PdfCompressorClient />
    </ToolPageLayout>
  );
}