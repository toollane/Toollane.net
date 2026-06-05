import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WebpToPngClient from "./WebpToPngClient";

export const metadata: Metadata = {
  title: "WEBP to PNG Converter | Toollane",
  description:
    "Convert WEBP images to PNG instantly with Toollane's free online WEBP to PNG converter.",
};

export default function WebpToPngPage() {
  return (
    <ToolPageLayout
      title="WEBP to PNG Converter"
      description="Convert WEBP images to PNG instantly online."


      href="/webp-to-png"
    >
      <WebpToPngClient />
    </ToolPageLayout>
  );
}