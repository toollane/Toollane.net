import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PasswordGeneratorClient from "./PasswordGeneratorClient";

export const metadata: Metadata = {
  title:
    "Strong Password Generator | Toollane",

  description:
    "Generate secure random passwords instantly with Toollane's free online password generator.",
};

const faqs = [
  {
    question:
      "What does a password generator do?",

    answer:
      "It creates secure random passwords using letters, numbers and symbols.",
  },

  {
    question:
      "Why should I use strong passwords?",

    answer:

  },

  {
    question:
      "Can I customize the password length?",

    answer:

  },
];

export default function PasswordGeneratorPage() {
  return (
    <ToolPageLayout
      title="Strong Password Generator"
      description="Generate secure random passwords instantly online."


      href="/password-generator"
      faqs={faqs}
    >
      <PasswordGeneratorClient />
    </ToolPageLayout>
  );
}