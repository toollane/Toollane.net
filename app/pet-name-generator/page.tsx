import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PetNameGeneratorClient from "./PetNameGeneratorClient";

export const metadata: Metadata = {
  title: "Pet Name Generator | Toollane",
  description:
    "Generate pet name ideas for dogs, cats, horses, rabbits, birds, hamsters, fish and other pets by type, style, gender and starting letter.",
  alternates: {
    canonical: "https://toollane.net/pet-name-generator",
  },
};

export default function PetNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Pet Name Generator"
      description="Generate pet name ideas by animal type, style, gender, starting letter and personality."
      href="/pet-name-generator"
    >
      <PetNameGeneratorClient />
    </ToolPageLayout>
  );
}