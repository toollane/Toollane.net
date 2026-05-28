import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MetaTitleLengthCheckerClient from "./MetaTitleLengthCheckerClient";

export const metadata: Metadata = {
  title: "Meta Title Length Checker | Toollane",

  description:
    "Check meta title length instantly with Toollane's free online SEO title length checker.",
};

const faqs = [
  {
    question: "What is a meta title?",

    answer:

  },

  {
    question: "How long should a meta title be?",

    answer:
      "Many SEO titles work best around 40 to 60 characters, although exact display length can vary.",
  },

  {
    question: "Why check meta title length?",

    answer:

  },
];

export default function MetaTitleLengthCheckerPage() {
  return (
    <ToolPageLayout
      title="Meta Title Length Checker"
      description="Check SEO title length instantly online."


      href="/meta-title-length-checker"
      faqs={faqs}
    >
      <MetaTitleLengthCheckerClient />
    </ToolPageLayout>
  );
}