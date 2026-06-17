import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RegexTesterClient from "./RegexTesterClient";

export const metadata: Metadata = {
  title:
    "Regex Tester | Toollane",

  description:
    "Test regular expressions instantly with Toollane's free online regex tester.",


  alternates: {
    canonical: "/regex-tester",
  },
};

export default function RegexTesterPage() {
  return (
    <ToolPageLayout
      title="Regex Tester"
      description="Test regex patterns instantly online."


      href="/regex-tester"
    >
      <RegexTesterClient />
    </ToolPageLayout>
  );
}