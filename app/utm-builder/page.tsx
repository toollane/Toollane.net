import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UtmBuilderClient from "./UtmBuilderClient";

export const metadata: Metadata = {
  title: "UTM Builder | Toollane",

  description:
    "Build UTM tracking URLs instantly with Toollane's free online UTM builder.",


  alternates: {
    canonical: "/utm-builder",
  },
};

export default function UtmBuilderPage() {
  return (
    <ToolPageLayout
      title="UTM Builder"
      description="Build UTM tracking URLs instantly online."


      href="/utm-builder"
    >
      <UtmBuilderClient />
    </ToolPageLayout>
  );
}