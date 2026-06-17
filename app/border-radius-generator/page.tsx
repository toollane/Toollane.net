import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BorderRadiusGeneratorClient from "./BorderRadiusGeneratorClient";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator | Toollane",
  description:
    "Create CSS border radius values visually with Toollane's free online border radius generator.",


  alternates: {
    canonical: "/border-radius-generator",
  },
};

export default function BorderRadiusGeneratorPage() {
  return (
    <ToolPageLayout
      title="CSS Border Radius Generator"
      description="Create rounded corners visually and copy CSS instantly."


      href="/border-radius-generator"
    >
      <BorderRadiusGeneratorClient />
    </ToolPageLayout>
  );
}