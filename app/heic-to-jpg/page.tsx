import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";
import HeicToJpgNoSsr from "./HeicToJpgNoSsr";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter | Toollane",
  description:
    "Convert HEIC images to JPG instantly with Toollane's free online HEIC to JPG converter.",
};

export default function HeicToJpgPage() {
  return (
    <ToolPageLayout
      title="HEIC to JPG Converter"
      description="Convert HEIC images to JPG instantly online."
      href="/heic-to-jpg"
    >
      <HeicToJpgNoSsr />
    </ToolPageLayout>
  );
}