import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HtmlEntityEncoderDecoderClient from "./HtmlEntityEncoderDecoderClient";

export const metadata: Metadata = {
  title: "HTML Entity Encoder Decoder | Toollane",

  description:
    "Encode and decode HTML entities instantly with Toollane's free online HTML entity tool.",
};

export default function HtmlEntityEncoderDecoderPage() {
  return (
    <ToolPageLayout
      title="HTML Entity Encoder Decoder"
      description="Encode and decode HTML entities instantly online."


      href="/html-entity-encoder-decoder"
    >
      <HtmlEntityEncoderDecoderClient />
    </ToolPageLayout>
  );
}