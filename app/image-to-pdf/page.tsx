import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageToPdfClient from "./ImageToPdfClient";

export const metadata: Metadata = {
  title: "Image to PDF Converter | Convert JPG & PNG Online | Toollane",
  description:
    "Convert images to PDF online for free. Upload JPG, JPEG or PNG files, arrange the page order, adjust page settings and download your PDF directly in your browser.",
};

export default function ImageToPdfPage() {
  return (
    <ToolPageLayout
      title="Image to PDF Converter"
      description="Convert JPG, JPEG and PNG images to PDF instantly online. Arrange image order, adjust page settings and download your PDF directly in your browser."
      href="/image-to-pdf"
    >
      <ImageToPdfClient />
    </ToolPageLayout>
  );
}