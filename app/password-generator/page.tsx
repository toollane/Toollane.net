import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PasswordGeneratorClient from "./PasswordGeneratorClient";

export const metadata: Metadata = {
  title:
    "Strong Password Generator | Toollane",

  description:
    "Generate secure random passwords instantly with Toollane's free online password generator.",


  alternates: {
    canonical: "/password-generator",
  },
};

export default function PasswordGeneratorPage() {
  return (
    <ToolPageLayout
      title="Strong Password Generator"
      description="Generate secure random passwords instantly online."


      href="/password-generator"
    >
      <PasswordGeneratorClient />
    </ToolPageLayout>
  );
}