import type { Metadata } from "next";

import LbsToKgClient from "./LbsToKgClient";
import ToolPageLayout from "@/components/ToolPageLayout";

export const metadata: Metadata = {
  title: "LBS to KG Converter | Toollane",
  description:
    "Convert pounds to kilograms instantly with Toollane's free online converter.",


  alternates: {
    canonical: "/lbs-to-kg",
  },
};

export default function LbsToKgPage() {
  return (
    <ToolPageLayout
      title="LBS to KG Converter"
      description="Convert pounds to kilograms instantly online."


      href="/lbs-to-kg"
    >
      <LbsToKgClient />
    </ToolPageLayout>
  );
}