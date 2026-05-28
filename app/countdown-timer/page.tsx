import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CountdownTimerClient from "./CountdownTimerClient";

export const metadata: Metadata = {
  title: "Countdown Timer | Toollane",

  description:
    "Use a free online countdown timer for focus, studying, workouts, cooking and daily tasks.",
};

const faqs = [
  {
    question: "What does a countdown timer do?",

    answer:

  },

  {
    question: "Can I set custom minutes?",

    answer:

  },

  {
    question: "What can I use a countdown timer for?",

    answer:
      "You can use it for studying, productivity, workouts, cooking, games and timed tasks.",
  },
];

export default function CountdownTimerPage() {
  return (
    <ToolPageLayout
      title="Countdown Timer"
      description="Use a free online countdown timer instantly."


      href="/countdown-timer"
      faqs={faqs}
    >
      <CountdownTimerClient />
    </ToolPageLayout>
  );
}