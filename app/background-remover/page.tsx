import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BackgroundRemoverClient from "./BackgroundRemoverClient";

export const metadata: Metadata = {
  title:
    "Background Remover | Toollane",

  description:
    "Remove image backgrounds instantly with Toollane's free online background remover.",
};

const faqs = [
  {
    question:
      "What does a background remover do?",

    answer:

  },

  {
    question:
      "Are my images uploaded?",

    answer:

  },

  {
    question:
      "Can I use this on mobile?",

    answer:
      "Yes. The tool works on phones, tablets, and desktop devices.",
  },
];

export default function BackgroundRemoverPage() {
  return (
    <ToolPageLayout
      title="Background Remover"
      description="Remove image backgrounds instantly online."


      href="/background-remover"
      faqs={faqs}
    >
      <BackgroundRemoverClient />
    </ToolPageLayout>
  );
}