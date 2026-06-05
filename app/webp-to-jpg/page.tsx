import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WebpToJpgClient from "./WebpToJpgClient";

export const metadata: Metadata = {
  title: "WEBP to JPG Converter | Toollane",
  description:
    "Convert WEBP images to JPG instantly with Toollane's free online WEBP to JPG converter.",
};

export default function WebpToJpgPage() {
  return (
    <ToolPageLayout
      title="WEBP to JPG Converter"
      description="Convert WEBP images to JPG instantly online."


      href="/webp-to-jpg"
    >
      <WebpToJpgClient />
    </ToolPageLayout>
  );
}