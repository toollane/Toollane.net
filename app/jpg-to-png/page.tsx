import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JpgToPngClient from "./JpgToPngClient";

export const metadata: Metadata = {
  title: "JPG to PNG Converter | Toollane",

  description:
    "Convert JPG images to PNG instantly with Toollane's free online JPG to PNG converter.",
};

export default function JpgToPngPage() {
  return (
    <ToolPageLayout
      title="JPG to PNG Converter"
      description="Convert JPG images to PNG instantly online."


      href="/jpg-to-png"
    >
      <JpgToPngClient />
    </ToolPageLayout>
  );
}