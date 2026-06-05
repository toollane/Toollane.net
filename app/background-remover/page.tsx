import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BackgroundRemoverClient from "./BackgroundRemoverClient";

export const metadata: Metadata = {
  title:
    "Background Remover | Toollane",

  description:
    "Remove image backgrounds instantly with Toollane's free online background remover.",
};

export default function BackgroundRemoverPage() {
  return (
    <ToolPageLayout
      title="Background Remover"
      description="Remove image backgrounds instantly online."


      href="/background-remover"
    >
      <BackgroundRemoverClient />
    </ToolPageLayout>
  );
}