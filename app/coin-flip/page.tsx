import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CoinFlipClient from "./CoinFlipClient";

export const metadata: Metadata = {
  title: "Coin Flip | Toollane",

  description:
    "Flip a virtual coin instantly with Toollane's free online coin flip tool.",
};

const faqs = [
  {
    question: "What does a coin flip tool do?",

    answer:

  },

  {
    question: "Can I use this for decisions?",

    answer:

  },

  {
    question: "Is the coin flip random?",

    answer:

  },
];

export default function CoinFlipPage() {
  return (
    <ToolPageLayout
      title="Coin Flip"
      description="Flip a virtual coin instantly online."


      href="/coin-flip"
      faqs={faqs}
    >
      <CoinFlipClient />
    </ToolPageLayout>
  );
}