import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HtmlEntityEncoderDecoderClient from "./HtmlEntityEncoderDecoderClient";

export const metadata: Metadata = {
  title: "HTML Entity Encoder Decoder | Toollane",

  description:
    "Encode and decode HTML entities instantly with Toollane's free online HTML entity tool.",
};

const faqs = [
  {
    question: "What are HTML entities?",

    answer:
      "HTML entities are special codes used to display reserved characters like less-than, greater-than and ampersand in HTML.",
  },

  {
    question: "Can I decode HTML entities?",

    answer:

  },

  {
    question: "Why use an HTML entity encoder decoder?",

    answer:
      "It helps developers safely display code, symbols and special characters in web pages.",
  },
];

export default function HtmlEntityEncoderDecoderPage() {
  return (
    <ToolPageLayout
      title="HTML Entity Encoder Decoder"
      description="Encode and decode HTML entities instantly online."


      href="/html-entity-encoder-decoder"
      faqs={faqs}
    >
      <HtmlEntityEncoderDecoderClient />
    </ToolPageLayout>
  );
}