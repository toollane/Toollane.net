import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import Base64EncoderDecoderClient from "./Base64EncoderDecoderClient";

export const metadata: Metadata = {
  title: "Base64 Encoder Decoder | Toollane",

  description:
    "Encode and decode Base64 instantly with Toollane's free online Base64 tool.",
};

const faqs = [
  {
    question: "What is Base64 encoding?",

    answer:

  },

  {
    question: "Can I decode Base64 text?",

    answer:

  },

  {
    question: "Why use a Base64 encoder decoder?",

    answer:
      "It helps developers quickly encode or decode data for APIs, URLs, files and web projects.",
  },
];

export default function Base64EncoderDecoderPage() {
  return (
    <ToolPageLayout
      title="Base64 Encoder Decoder"
      description="Encode and decode Base64 instantly online."


      href="/base64-encoder-decoder"
      faqs={faqs}
    >
      <Base64EncoderDecoderClient />
    </ToolPageLayout>
  );
}