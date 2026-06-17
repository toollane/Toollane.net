import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import Base64EncoderDecoderClient from "./Base64EncoderDecoderClient";

export const metadata: Metadata = {
  title: "Base64 Encoder Decoder | Toollane",

  description:
    "Encode and decode Base64 instantly with Toollane's free online Base64 tool.",


  alternates: {
    canonical: "/base64-encoder-decoder",
  },
};

export default function Base64EncoderDecoderPage() {
  return (
    <ToolPageLayout
      title="Base64 Encoder Decoder"
      description="Encode and decode Base64 instantly online."


      href="/base64-encoder-decoder"
    >
      <Base64EncoderDecoderClient />
    </ToolPageLayout>
  );
}