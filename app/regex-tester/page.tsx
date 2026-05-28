import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RegexTesterClient from "./RegexTesterClient";

export const metadata: Metadata = {
  title:
    "Regex Tester | Toollane",

  description:
    "Test regular expressions instantly with Toollane's free online regex tester.",
};

const faqs = [
  {
    question:
      "What does a regex tester do?",

    answer:

  },

  {
    question:
      "Who uses regex testers?",

    answer:
      "Developers, analysts and programmers use regex testers for validation and pattern matching.",
  },

  {
    question:
      "Can I test live regex patterns?",

    answer:

  },
];

export default function RegexTesterPage() {
  return (
    <ToolPageLayout
      title="Regex Tester"
      description="Test regex patterns instantly online."


      href="/regex-tester"
      faqs={faqs}
    >
      <RegexTesterClient />
    </ToolPageLayout>
  );
}