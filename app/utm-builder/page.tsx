import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UtmBuilderClient from "./UtmBuilderClient";

export const metadata: Metadata = {
  title: "UTM Builder | Toollane",

  description:
    "Build UTM tracking URLs instantly with Toollane's free online UTM builder.",
};

const faqs = [
  {
    question: "What is a UTM builder?",

    answer:

  },

  {
    question: "What are UTM parameters?",

    answer:
      "UTM parameters are tags added to URLs to track traffic source, medium and campaign performance.",
  },

  {
    question: "Why use a UTM builder?",

    answer:
      "A UTM builder helps marketers create clean tracking links for ads, email campaigns, social media and analytics.",
  },
];

export default function UtmBuilderPage() {
  return (
    <ToolPageLayout
      title="UTM Builder"
      description="Build UTM tracking URLs instantly online."


      href="/utm-builder"
      faqs={faqs}
    >
      <UtmBuilderClient />
    </ToolPageLayout>
  );
}