import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MetaDescriptionLengthCheckerClient from "./MetaDescriptionLengthCheckerClient";

export const metadata: Metadata = {
  title:
    "Meta Description Length Checker | Toollane",

  description:
    "Check meta description length instantly with Toollane's free online SEO description checker.",
};

const faqs = [
  {
    question:
      "What is a meta description?",

    answer:

  },

  {
    question:
      "How long should a meta description be?",

    answer:

  },

  {
    question:
      "Why check meta description length?",

    answer:

  },
];

export default function MetaDescriptionLengthCheckerPage() {
  return (
    <ToolPageLayout
      title="Meta Description Length Checker"
      description="Check SEO description length instantly online."


      href="/meta-description-length-checker"
      faqs={faqs}
    >
      <MetaDescriptionLengthCheckerClient />
    </ToolPageLayout>
  );
}