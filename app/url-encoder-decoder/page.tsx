import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UrlEncoderDecoderClient from "./UrlEncoderDecoderClient";

export const metadata: Metadata = {
  title: "URL Encoder Decoder | Toollane",

  description:
    "Encode and decode URLs instantly with Toollane's free online URL encoder decoder.",


  alternates: {
    canonical: "/url-encoder-decoder",
  },
};

export default function UrlEncoderDecoderPage() {
  return (
    <ToolPageLayout
      title="URL Encoder Decoder"
      description="Encode and decode URLs instantly online."


      href="/url-encoder-decoder"
    >
      <UrlEncoderDecoderClient />
    </ToolPageLayout>
  );
}