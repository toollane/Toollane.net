import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UsernameGeneratorClient from "./UsernameGeneratorClient";

export const metadata: Metadata = {
  title: "Username Generator | Toollane",

  description:
    "Generate username ideas instantly with Toollane's free online username generator.",
};

const faqs = [
  {
    question: "What does a username generator do?",

    answer:
      "A username generator creates name ideas for social media, gaming, apps and online profiles.",
  },

  {
    question: "Can I use it for Instagram or TikTok?",

    answer:
      "Yes. You can generate username ideas for Instagram, TikTok, Discord, gaming platforms and more.",
  },

  {
    question: "Can I enter my own keyword?",

    answer:

  },
];

export default function UsernameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Username Generator"
      description="Generate username ideas instantly online."


      href="/username-generator"
      faqs={faqs}
    >
      <UsernameGeneratorClient />
    </ToolPageLayout>
  );
}