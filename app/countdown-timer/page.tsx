import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CountdownTimerClient from "./CountdownTimerClient";

export const metadata: Metadata = {
  title: "Countdown Timer | Toollane",

  description:
    "Use a free online countdown timer for focus, studying, workouts, cooking and daily tasks.",
};

export default function CountdownTimerPage() {
  return (
    <ToolPageLayout
      title="Countdown Timer"
      description="Use a free online countdown timer instantly."


      href="/countdown-timer"
    >
      <CountdownTimerClient />
    </ToolPageLayout>
  );
}