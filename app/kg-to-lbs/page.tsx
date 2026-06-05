import type { Metadata } from "next";

import KgToLbsClient from "./KgToLbsClient";
import ToolPageLayout from "@/components/ToolPageLayout";

export const metadata: Metadata = {
  title: "KG to LBS Converter | Toollane",
  description:
    "Convert kilograms to pounds instantly with Toollane's free online converter.",
};

export default function KgToLbsPage() {
  return (
    <ToolPageLayout
      title="KG to LBS Converter"
      description="Convert kilograms to pounds instantly online."


      href="/kg-to-lbs"
    >
      <KgToLbsClient />
    </ToolPageLayout>
  );
}