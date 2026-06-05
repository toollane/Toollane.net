import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageToPdfClient from "./ImageToPdfClient";

export const metadata: Metadata = {
  title: "Image to PDF Converter | Toollane",
  description:
    "Convert images to PDF using Toollane's free online image to PDF converter.",
};

export default function ImageToPdfPage() {
  return (
    <ToolPageLayout
      title="Image to PDF Converter"
      description="Convert images to PDF instantly online."


      href="/image-to-pdf"
    >
      <ImageToPdfClient />
    </ToolPageLayout>
  );
}