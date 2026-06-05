import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageFlipToolClient from "./ImageFlipToolClient";

export const metadata: Metadata = {
  title: "Image Flip Tool | Toollane",

  description:
    "Flip images horizontally or vertically instantly with Toollane's free online image flip tool.",
};

export default function ImageFlipToolPage() {
  return (
    <ToolPageLayout
      title="Image Flip Tool"
      description="Flip images horizontally or vertically instantly online."


      href="/image-flip-tool"
    >
      <ImageFlipToolClient />
    </ToolPageLayout>
  );
}