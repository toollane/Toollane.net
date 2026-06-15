import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WebpToJpgClient from "./WebpToJpgClient";

export const metadata: Metadata = {
  title: "WEBP to JPG Converter | Convert WEBP Images Online | Toollane",
  description:
    "Convert WEBP images to JPG online for free. Adjust JPG quality, resize width, choose a background color for transparency and download the result directly in your browser.",
};

export default function WebpToJpgPage() {
  return (
    <ToolPageLayout
      title="WEBP to JPG Converter"
      description="Convert WEBP images to JPG instantly online. Adjust quality, resize width, choose a background color for transparency and download the result directly in your browser."
      href="/webp-to-jpg"
    >
      <WebpToJpgClient />
    </ToolPageLayout>
  );
}