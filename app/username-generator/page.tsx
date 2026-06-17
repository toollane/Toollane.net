import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UsernameGeneratorClient from "./UsernameGeneratorClient";

export const metadata: Metadata = {
  title: "Username Generator | Toollane",

  description:
    "Generate username ideas instantly with Toollane's free online username generator.",


  alternates: {
    canonical: "/username-generator",
  },
};

export default function UsernameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Username Generator"
      description="Generate username ideas instantly online."


      href="/username-generator"
    >
      <UsernameGeneratorClient />
    </ToolPageLayout>
  );
}