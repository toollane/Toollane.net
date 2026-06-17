import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SignatureGeneratorClient from "./SignatureGeneratorClient";

export const metadata: Metadata = {
  title:
    "Signature Generator | Toollane",

  description:
    "Create digital signatures instantly with Toollane's free online signature generator.",


  alternates: {
    canonical: "/signature-generator",
  },
};

export default function SignatureGeneratorPage() {
  return (
    <ToolPageLayout
      title="Signature Generator"
      description="Create digital signatures instantly online."


      href="/signature-generator"
    >
      <SignatureGeneratorClient />
    </ToolPageLayout>
  );
}