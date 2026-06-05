import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PngToJpgClient from "./PngToJpgClient";

export const metadata: Metadata = {
  title: "PNG to JPG Converter | Toollane",

  description:
    "Convert PNG images to JPG instantly with Toollane's free online PNG to JPG converter.",
};

export default function PngToJpgPage() {
  return (
    <ToolPageLayout
      title="PNG to JPG Converter"
      description="Convert PNG images to JPG instantly online."


      href="/png-to-jpg"
    >
      <PngToJpgClient />
    </ToolPageLayout>
  );
}