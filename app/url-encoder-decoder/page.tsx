import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UrlEncoderDecoderClient from "./UrlEncoderDecoderClient";

export const metadata: Metadata = {
  title: "URL Encoder Decoder | Toollane",

  description:
    "Encode and decode URLs instantly with Toollane's free online URL encoder decoder.",
};

const faqs = [
  {
    question: "What is URL encoding?",

    answer:

  },

  {
    question: "Can I decode URL encoded text?",

    answer:

  },

  {
    question: "Why use a URL encoder decoder?",

    answer:
      "It helps developers, marketers and analysts quickly prepare or read URLs, query strings and tracking links.",
  },
];

export default function UrlEncoderDecoderPage() {
  return (
    <ToolPageLayout
      title="URL Encoder Decoder"
      description="Encode and decode URLs instantly online."


      href="/url-encoder-decoder"
      faqs={faqs}
    >
      <UrlEncoderDecoderClient />
    </ToolPageLayout>
  );
}